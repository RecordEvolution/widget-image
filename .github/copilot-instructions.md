# Copilot Instructions for widget-image

## Architecture Overview

IronFlock widget: Lit 3.x web component displaying images with single/multi-image modes, time-based filtering, and responsive grid layouts. Part of a multi-widget ecosystem (`widget-*` repos) sharing identical patterns.

**Key files:**

-   `src/widget-image.ts` - Main LitElement component
-   `src/definition-schema.json` - JSON Schema → auto-generates dashboard forms
-   `src/definition-schema.d.ts` - Generated types (never edit manually)
-   `demo/index.html` - Dev harness for testing

## Critical: Version-Tagged Custom Elements

Source uses `versionplaceholder` replaced at build time via `@rollup/plugin-replace` in `vite.config.ts`:

```typescript
@customElement('widget-image-versionplaceholder')  // Becomes: widget-image-1.1.15
```

**Never hardcode versions** - the demo imports `package.json` to construct the tag dynamically.

## Schema-Driven Development

The dashboard auto-generates config UI from `definition-schema.json`. Custom extensions:

-   `"type": "image"` → image upload picker
-   `"order": N` → field ordering
-   `"dataDrivenDisabled": true` → field cannot be data-bound from IoT sources
-   `"condition"` → conditional field visibility

**Workflow:** Edit schema → `npm run types` → import generated types in component.

## Component API (universal across all widgets)

```typescript
@property({ type: Object }) inputData?: InputData  // From schema
@property({ type: Object }) theme?: { theme_name: string, theme_object: any }
@property({ type: Object }) timeRange?: { start: number; end: number }  // For time-based filtering
```

Theme files in `demo/themes/` for testing.

## Widget-Specific Features

### Image Modes

| Mode   | Configuration       | Description                        |
| ------ | ------------------- | ---------------------------------- |
| Single | `multiImage: false` | Single image with URL or upload    |
| Multi  | `multiImage: true`  | Grid of images from `data[]` array |

### Time-Based Filtering

When `timeRange` is provided and in multi-image mode:

-   Filters `data[]` by `timestamp` field (Unix ms)
-   Images without timestamps are always shown
-   Uses `getFilteredImages()` method

### Responsive Grid Layout

Uses `ResizeObserver` and `optimizeLayout()` to:

-   Calculate optimal grid dimensions (rows × cols)
-   Minimize error function for element sizing
-   Scale gap proportionally with element size

### Key Methods

| Method                | Purpose                                 |
| --------------------- | --------------------------------------- |
| `getFilteredImages()` | Returns images filtered by timeRange    |
| `updateGridLayout()`  | Recalculates grid on resize             |
| `optimizeLayout()`    | Finds optimal rows/cols for given space |
| `registerTheme()`     | Extracts colors from theme object       |

### Configuration Options

| Option             | Type    | Description                         |
| ------------------ | ------- | ----------------------------------- |
| `title`            | string  | Widget title (single-image mode)    |
| `subTitle`         | string  | Widget subtitle (single-image mode) |
| `multiImage`       | boolean | Enable multi-image grid mode        |
| `gap`              | number  | Gap between images in pixels        |
| `labelFontSize`    | number  | Font size for image labels          |
| `stretchToFit`     | boolean | Stretch images to fill (vs contain) |
| `useUpload`        | boolean | Use uploaded image vs URL           |
| `data[].timestamp` | number  | Unix ms timestamp for filtering     |
| `data[].imageUrl`  | string  | Image URL                           |
| `data[].label`     | string  | Image label text                    |

## Commands

| Command           | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `npm run start`   | Dev server at localhost:8000/demo/                      |
| `npm run build`   | Production build to dist/                               |
| `npm run types`   | Regenerate types from schema (run after schema changes) |
| `npm run release` | Build → bump patch → git push → tag                     |
| `npm run link`    | Link to local RESWARM/frontend for integration testing  |

## Build Config Notes (vite.config.ts)

-   `process.env.NODE_ENV` must be `'production'` for optimization
-   No external dependencies (only `lit` and `tslib`)

## Platform Registration (post-release)

```sql
select swarm.f_update_widget_master('{"package_name": "widget-image", "version": "X.Y.Z"}'::jsonb);
```

## Theming

CSS custom properties for theme integration:

```css
--re-text-color
--re-tile-background-color
```

Falls back to theme object properties if CSS vars not set.

## Testing Tips

In `demo/index.html`, configure `keyPathsToRandomize` array to auto-test specific data paths.
Example paths: `'data.0.imageUrl'`, `'title'`, `'multiImage'`
