# \<widget-image>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm i @record-evolution/widget-image
```

## Usage

```html
<script type="module">
    import '@record-evolution/widget-image/widget-image.js'
</script>

<widget-image-1.1.12></widget-image-1.1.12>
```

## Expected data format

The widget supports both single image and multi-image modes:

### Single Image Mode

Display a single image with optional title and subtitle.

### Multi Image Mode

Display multiple images in an optimized grid layout with automatic sizing and aspect ratio calculation.

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with Vite

```bash
npm start
```

To run a local development server that serves the basic demo at http://localhost:8000/demo/
