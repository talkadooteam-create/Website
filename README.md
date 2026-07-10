# React + TypeScript + Vite

> ## ⚠️ Deploying the parent/store pages — bump the cache-busting version
>
> The parent app lives in `public/parent.js` + `public/parent.html` (a manual copy of
> `Talkadoo-Data/store/`). `public/parent.html` loads the script with a pinned version query:
>
> ```html
> <script src="parent.js?v=20260710"></script>
> ```
>
> **Whenever you change `public/parent.js`, bump that `?v=` number** (e.g. `?v=20260711`) in
> `public/parent.html` in the same commit. Otherwise browsers and Vercel's per-POP edge caches
> keep serving the old `parent.js` under the old URL, and the change won't go live even after a
> successful deploy. The version query gives the new file a brand-new URL that no cache can serve
> stale. Use the deploy date (`YYYYMMDD`) as the value.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
