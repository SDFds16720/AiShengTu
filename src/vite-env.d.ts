/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_VOLCANO_API_KEY: string
  readonly VITE_VOLCANO_ACCESS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
