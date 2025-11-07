export {};

declare module '#app' {
  interface NuxtApp {
    $toast: {
      success: (msg: string) => void;
      error: (msg: string) => void;
      info: (msg: string) => void;
      warning: (msg: string) => void;
    };
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: {
      success: (msg: string) => void;
      error: (msg: string) => void;
      info: (msg: string) => void;
      warning: (msg: string) => void;
    };
  }
}

declare global {
  const $toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
    warning: (msg: string) => void;
  };
}
