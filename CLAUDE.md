# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command           | Purpose                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `npm start`       | Vite dev server at http://localhost:8000/demo/ (build + watch)   |
| `npm run build`   | Production build to `dist/` (Vite lib mode, ES output)           |
| `npm run watch`   | `vite build --watch`                                             |
| `npm run types`   | Regenerate `src/definition-schema.d.ts` from `definition-schema.json` via `json2ts`. Run after every schema edit. |
| `npm run analyze` | Generate custom-elements manifest via `cem`                      |
| `npm run link`    | Build + npm link, then link into `../RESWARM/frontend` for integration testing |
| `npm run release` | `build` → regenerate types → `npm version patch` → `git push` (with tags) → rebuild |

No test runner or linter is configured. Node `>=24.9.0`, npm `>=10.0.2` (see `package.json` engines).

## Architecture

Single-component Lit 3.x web component published as `@record-evolution/widget-image`. Part of the IronFlock multi-widget ecosystem (`widget-*` repos sharing identical patterns).

**Entry point:** `src/widget-image.ts` (Vite lib entry, builds to `dist/widget-image.js`).

### Version-tagged custom elements (critical)

The component decorator uses a literal placeholder:

```ts
@customElement('widget-image-versionplaceholder')
```

`versionplaceholder` is replaced with `package.json#version` at build time by `@rollup/plugin-replace` configured in `vite.config.ts`. Consumers must use the version-suffixed tag (e.g. `<widget-image-1.1.18>`). The demo (`demo/index.html`) imports `package.json` and constructs the tag dynamically with `lit/static-html.js` — never hardcode a version anywhere.

### Schema-driven configuration

`src/definition-schema.json` is the source of truth for the widget's config UI. The IronFlock dashboard auto-generates a form from it, then sets `inputData` on the element. Custom (non-standard) JSON Schema extensions consumed by the dashboard:

- `"type": "image"` — image upload picker
- `"order": N` — field ordering
- `"dataDrivenDisabled": true` — field cannot be data-bound from IoT sources
- `"condition"` — conditional field visibility

**Workflow:** edit `definition-schema.json` → run `npm run types` → `definition-schema.d.ts` is regenerated (do not edit by hand) → import generated `InputData` type into `widget-image.ts`.

### Universal widget API

All IronFlock widgets expose the same three reactive properties:

```ts
@property({ type: Object }) inputData?: InputData                            // from schema
@property({ type: Object }) theme?: { theme_name: string; theme_object: any } // platform theme
@property({ type: Object }) timeRange?: { start: number; end: number }       // Unix ms, for filtering
```

Theme files for local testing live in `demo/themes/`. CSS custom properties `--re-text-color` and `--re-tile-background-color` are honored, falling back to the theme object.

### Widget-specific logic

- **Two modes** controlled by `inputData.multiImage`: single image (URL or upload) vs. grid built from `data[]`.
- **Time filtering** (multi mode): `getFilteredImages()` filters `data[]` by `timestamp` against `timeRange`; entries without a timestamp are always shown.
- **Responsive grid:** `ResizeObserver` triggers `updateGridLayout()` → `optimizeLayout()` finds optimal rows × cols by minimizing an error function, and scales gap proportionally.
- **Theme:** `registerTheme()` extracts colors from the theme object.

### Build pipeline

`vite.config.ts`:

- Lib mode, ES format only, entry `src/widget-image.ts`
- `process.env.NODE_ENV` is forced to `'production'` (required for Lit optimization)
- No externals — `lit` and `tslib` are bundled
- License banner is injected into the rollup output

### Demo harness

`demo/index.html` mounts the component, randomizes values on a 1s interval via `ObjectRandomizer.js`, and uses an empty `keyPathsToRandomize` array. Populate it with paths like `'data.0.imageUrl'`, `'title'`, or `'multiImage'` to exercise specific fields during dev.

## Platform registration (post-release)

After `npm run release` and publish, register the new version with the IronFlock platform:

```sql
select swarm.f_update_widget_master('{"package_name": "widget-image", "version": "X.Y.Z"}'::jsonb);
```
