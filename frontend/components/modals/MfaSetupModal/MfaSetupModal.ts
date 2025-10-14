import { ref, onMounted } from 'vue'

const emit = defineEmits(['close', 'success'])

const step = ref(1)
const loading = ref(false)
const error = ref('')
const verificationCode = ref('')
const qrCodeUrl = ref('')
const backupCodes = ref<string[]>([])
const mfaSecret = ref('')

onMounted(async () => {
  try {
    const response = await $fetch('/api/auth/mfa/setup') as any
    qrCodeUrl.value = response.qr_code_url
    mfaSecret.value = response.secret
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to setup MFA. Please try again.'
  }
})

const enableMfa = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/auth/mfa/enable', {
      method: 'POST',
      body: {
        secret: mfaSecret.value,
        verification_code: verificationCode.value
      }
    }) as any
    backupCodes.value = response.backup_codes
    step.value = 3
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to enable MFA. Please try again.'
  } finally {
    loading.value = false
  }
}

const completeSetup = () => {
  emit('success')
}

const handleQrCodeError = () => {
  console.error('Failed to load QR code image')
}

const copySecret = async () => {
  try {
    await navigator.clipboard.writeText(mfaSecret.value)
    console.log('Secret copied to clipboard')
  } catch (err) {
    console.error('Failed to copy secret:', err)
  }
}
export {
  step,
  loading,
  error,
  verificationCode,
  qrCodeUrl,
  backupCodes,
  mfaSecret,
  enableMfa,
  completeSetup,handleQrCodeError,
  copySecret
}