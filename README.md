# \<widget-image>

A Lit 3.x web component for displaying images with single/multi-image modes, time-based filtering, and responsive grid layouts. Part of the IronFlock widget ecosystem.

![screenshot](thumbnail.png)

## Installation

```bash
npm i @record-evolution/widget-image
```

## Usage

```html
<script type="module">
    import '@record-evolution/widget-image/dist/widget-image.js'
</script>

<widget-image-1.1.15></widget-image-1.1.15>
```

> **Note:** The version number in the tag name must match the installed package version.

## Configuration

Configure the widget by setting the `inputData` property:

```javascript
const widget = document.querySelector('widget-image-1.1.15')
widget.inputData = {
    title: 'My Image',
    subTitle: 'Optional subtitle',
    imageUrl: 'https://example.com/image.jpg',
    stretchToFit: false
}
```

### Single Image Mode

Display a single image with optional title and subtitle.

| Option         | Type    | Description                                   |
| -------------- | ------- | --------------------------------------------- |
| `title`        | string  | Widget title                                  |
| `subTitle`     | string  | Widget subtitle                               |
| `imageUrl`     | string  | URL of the image to display                   |
| `useUpload`    | boolean | Use uploaded image instead of URL             |
| `stretchToFit` | boolean | Stretch image to fill container (vs. contain) |

### Multi Image Mode

Display multiple images in an optimized grid layout with automatic sizing.

```javascript
widget.inputData = {
    multiImage: true,
    gap: 12,
    labelFontSize: 14,
    data: [
        { imageUrl: 'https://example.com/img1.jpg', label: 'Image 1', timestamp: 1737417600000 },
        { imageUrl: 'https://example.com/img2.jpg', label: 'Image 2', timestamp: 1737504000000 }
    ]
}
```

| Option          | Type    | Description                        |
| --------------- | ------- | ---------------------------------- |
| `multiImage`    | boolean | Enable multi-image grid mode       |
| `gap`           | number  | Gap between images in pixels       |
| `labelFontSize` | number  | Font size for image labels         |
| `data`          | array   | Array of image objects (see below) |

#### Data Item Properties

| Property    | Type   | Description                            |
| ----------- | ------ | -------------------------------------- |
| `imageUrl`  | string | Image URL                              |
| `label`     | string | Optional label text                    |
| `timestamp` | number | Unix timestamp (ms) for time filtering |

## Time-Based Filtering

Filter images by time range (useful for IoT dashboards):

```javascript
widget.timeRange = {
    start: 1737417600000, // Start timestamp (Unix ms)
    end: 1737590400000 // End timestamp (Unix ms)
}
```

Images without timestamps are always shown. Images with timestamps outside the range are hidden.

## Theming

The widget supports theming via CSS custom properties or a theme object:

```javascript
widget.theme = {
    theme_name: 'dark',
    theme_object: {
        backgroundColor: '#1a1a1a',
        textStyle: { color: '#ffffff' }
    }
}
```

### CSS Custom Properties

```css
widget-image-1.1.15 {
    --re-text-color: #333;
    --re-tile-background-color: #fff;
}
```

## Development

```bash
npm start       # Dev server at http://localhost:8000/demo/
npm run build   # Production build to dist/
npm run types   # Regenerate TypeScript types from schema
npm run release # Build, bump version, push, and tag
```

## License

MIT
