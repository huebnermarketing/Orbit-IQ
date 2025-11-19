import { ref, reactive, computed, type Ref } from 'vue';

/**
 * Form validation error structure
 */
export interface ValidationErrors {
  [field: string]: string | string[];
}

/**
 * API error response structure
 */
export interface ApiError {
  data?: {
    errors?: ValidationErrors;
    message?: string;
  };
  message?: string;
  statusMessage?: string;
}

/**
 * Form validation options
 */
export interface FormValidationOptions {
  /**
   * Default error message when no specific message is provided
   */
  defaultErrorMessage?: string;

  /**
   * Strategy for handling multiple field errors
   * 'first' - Show only the first error
   * 'all' - Show all errors joined together
   * 'field' - Store errors per field (for field-specific display)
   */
  errorStrategy?: 'first' | 'all' | 'field';

  /**
   * Whether to clear errors when form is submitted
   */
  clearOnSubmit?: boolean;
}

/**
 * Form validation composable
 * Provides consistent form validation and error handling across the application
 *
 * @example
 * ```ts
 * const { error, clearErrors, handleApiError } = useFormValidation();
 *
 * try {
 *   await api.create(data);
 * } catch (err) {
 *   handleApiError(err);
 * }
 * ```
 */
export const useFormValidation = (options: FormValidationOptions = {}) => {
  const {
    defaultErrorMessage = 'An error occurred. Please try again.',
    errorStrategy = 'first',
    clearOnSubmit = true,
  } = options;

  // General error message (for single error display)
  const error = ref<string>('');

  // Field-specific errors (for per-field error display)
  const fieldErrors = reactive<Record<string, string>>({});

  /**
   * Clear all errors
   */
  const clearErrors = () => {
    error.value = '';
    Object.keys(fieldErrors).forEach((key) => {
      delete fieldErrors[key];
    });
  };

  /**
   * Set a general error message
   */
  const setError = (message: string) => {
    error.value = message;
  };

  /**
   * Set error for a specific field
   */
  const setFieldError = (field: string, message: string) => {
    fieldErrors[field] = message;
  };

  /**
   * Clear error for a specific field
   */
  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      delete fieldErrors[field];
    }
  };

  /**
   * Get error for a specific field
   */
  const getFieldError = (field: string): string => {
    return fieldErrors[field] || '';
  };

  /**
   * Check if a specific field has an error
   */
  const hasFieldError = (field: string): boolean => {
    return !!fieldErrors[field];
  };

  /**
   * Check if there are any errors
   */
  const hasErrors = computed(() => {
    return !!error.value || Object.keys(fieldErrors).length > 0;
  });

  /**
   * Get all field errors as an object
   */
  const getAllFieldErrors = computed(() => {
    return { ...fieldErrors };
  });

  /**
   * Handle API error response
   * Extracts errors from API response and sets them according to the error strategy
   */
  const handleApiError = (err: ApiError | any) => {
    // Clear previous errors if configured
    if (clearOnSubmit) {
      clearErrors();
    }

    const apiError = err as ApiError;

    // Handle field-specific errors (err.data.errors)
    if (apiError.data?.errors) {
      const errors = apiError.data.errors;

      if (errorStrategy === 'field') {
        // Store errors per field
        Object.keys(errors).forEach((field) => {
          const fieldError = errors[field];
          if (Array.isArray(fieldError)) {
            fieldErrors[field] = fieldError[0] || '';
          } else {
            fieldErrors[field] = String(fieldError);
          }
        });
      } else if (errorStrategy === 'all') {
        // Join all errors
        const errorMessages = Object.values(errors)
          .flat()
          .map((e) => (Array.isArray(e) && e.length > 0 ? e[0] : String(e)))
          .filter((msg) => msg); // Filter out empty strings
        error.value = errorMessages.join(', ');
      } else {
        // 'first' strategy - show first error
        const firstField = Object.keys(errors)[0];
        if (firstField) {
          const firstError = errors[firstField];
          if (Array.isArray(firstError) && firstError.length > 0) {
            error.value = firstError[0] || '';
          } else if (firstError) {
            error.value = String(firstError);
          }
        }
      }
    }
    // Handle general error message (err.data.message)
    else if (apiError.data?.message) {
      error.value = apiError.data.message;
    }
    // Handle top-level error message
    else if (apiError.message) {
      error.value = apiError.message;
    }
    // Fallback to default error message
    else {
      error.value = defaultErrorMessage;
    }
  };

  /**
   * Validate a single field with custom validation rules
   */
  const validateField = (
    field: string,
    value: any,
    rules: Array<(val: any) => string | true>
  ): string => {
    for (const rule of rules) {
      const result = rule(value);
      if (result !== true) {
        fieldErrors[field] = result;
        return result;
      }
    }
    // Clear error if validation passes
    delete fieldErrors[field];
    return '';
  };

  /**
   * Validate entire form with validation rules
   */
  const validateForm = (
    formData: Record<string, any>,
    rules: Record<string, Array<(val: any) => string | true>>
  ): boolean => {
    clearErrors();
    let isValid = true;

    Object.keys(rules).forEach((field) => {
      const value = formData[field];
      const fieldRules = rules[field];
      if (fieldRules) {
        const error = validateField(field, value, fieldRules);
        if (error) {
          isValid = false;
        }
      }
    });

    return isValid;
  };

  /**
   * Handle form submit with validation
   * Validates the form before calling the submit function
   *
   * @param formData - The form data to validate
   * @param validationRules - Validation rules for each field
   * @param submitFn - The async function to call if validation passes
   * @returns Promise that resolves when submit completes or rejects on validation failure
   *
   * @example
   * ```ts
   * const handleSubmit = async () => {
   *   await handleSubmitWithValidation(
   *     form,
   *     {
   *       name: [rules.required('Name is required')],
   *       email: [rules.required(), rules.email()],
   *     },
   *     async () => {
   *       await api.create(form);
   *     }
   *   );
   * };
   * ```
   */
  const handleSubmitWithValidation = async (
    formData: Record<string, any>,
    validationRules: Record<string, Array<(val: any) => string | true>>,
    submitFn: () => Promise<void>
  ): Promise<void> => {
    // Validate form
    const isValid = validateForm(formData, validationRules);

    if (!isValid) {
      // Set general error if there are field errors but no general error
      if (!error.value && Object.keys(fieldErrors).length > 0) {
        const firstFieldError = Object.values(fieldErrors)[0];
        if (firstFieldError) {
          error.value = firstFieldError;
        }
      }
      throw new Error('Validation failed');
    }

    // Clear errors before submitting
    clearErrors();

    // Call submit function
    await submitFn();
  };

  /**
   * Common validation rules
   */
  const rules = {
    required: (message = 'This field is required'): ((val: any) => string | true) => {
      return (val: any) => {
        if (val === null || val === undefined || val === '') {
          return message;
        }
        if (Array.isArray(val) && val.length === 0) {
          return message;
        }
        return true;
      };
    },

    email: (message = 'Please enter a valid email address'): ((val: any) => string | true) => {
      return (val: any) => {
        if (!val) return true; // Use required rule separately
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val) ? true : message;
      };
    },

    minLength: (min: number, message?: string): ((val: any) => string | true) => {
      return (val: any) => {
        if (!val) return true;
        const msg = message || `Must be at least ${min} characters`;
        return String(val).length >= min ? true : msg;
      };
    },

    maxLength: (max: number, message?: string): ((val: any) => string | true) => {
      return (val: any) => {
        if (!val) return true;
        const msg = message || `Must be no more than ${max} characters`;
        return String(val).length <= max ? true : msg;
      };
    },

    pattern: (regex: RegExp, message: string): ((val: any) => string | true) => {
      return (val: any) => {
        if (!val) return true;
        return regex.test(String(val)) ? true : message;
      };
    },

    numeric: (message = 'Must be a number'): ((val: any) => string | true) => {
      return (val: any) => {
        if (!val) return true;
        return /^\d+$/.test(String(val)) ? true : message;
      };
    },

    exactLength: (length: number, message?: string): ((val: any) => string | true) => {
      return (val: any) => {
        if (!val) return true;
        const msg = message || `Must be exactly ${length} characters`;
        return String(val).length === length ? true : msg;
      };
    },

    match: (otherValue: Ref<any> | (() => any), message: string): ((val: any) => string | true) => {
      return (val: any) => {
        const other = typeof otherValue === 'function' ? otherValue() : otherValue.value;
        return val === other ? true : message;
      };
    },
  };

  return {
    // State
    error,
    fieldErrors,

    // Computed
    hasErrors,
    getAllFieldErrors,

    // Methods
    clearErrors,
    setError,
    setFieldError,
    clearFieldError,
    getFieldError,
    hasFieldError,
    handleApiError,
    validateField,
    validateForm,
    handleSubmitWithValidation,
    rules,
  };
};
