/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
    readonly VITE_PAYPAL_CLIENT_ID: string
    readonly VITE_PAYPAL_SECRET: string
    readonly VITE_PAYPAL_PLAN_ID_PRO: string
    readonly VITE_PAYPAL_PLAN_ID_ENTERPRISE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
