// @ts-check
import { defineConfig } from 'astro/config';

// Fleet contract: nginx forwards the whole /direct/<agent>:<port> prefix
// UNCHANGED, so links and assets must carry it. Astro bakes `base` at BUILD
// time. Empty/unset => serve at the host root.
const raw = (process.env.BASE_PATH ?? '').trim();
const basePath = raw ? `/${raw.replace(/^\/+|\/+$/g, '')}` : '';

// https://astro.build/config
export default defineConfig({
  ...(basePath ? { base: basePath } : {}),
});
