import { html, css, LitElement, PropertyValues, PropertyValueMap, nothing } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { customElement, property, state, query } from 'lit/decorators.js'
import { InputData } from './definition-schema'
type Theme = {
    theme_name: string
    theme_object: any
}
@customElement('widget-image-versionplaceholder')
export class WidgetImage extends LitElement {
    @property({ type: Object })
    inputData?: InputData

    @property({ type: Object })
    theme?: Theme

    @state() private themeBgColor?: string
    @state() private themeTitleColor?: string
    @state() private themeSubtitleColor?: string
    @state() private elementWidth: number = 0
    @state() private elementHeight: number = 0

    @query('.wrapper') private wrapper?: HTMLDivElement

    version: string = 'versionplaceholder'
    private resizeObserver?: ResizeObserver

    disconnectedCallback() {
        super.disconnectedCallback()
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
        }
    }

    update(changedProperties: Map<string, any>) {
        if (changedProperties.has('inputData')) {
            this.updateGridLayout()
        }

        if (changedProperties.has('theme')) {
            this.registerTheme(this.theme)
        }

        super.update(changedProperties)
    }

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        this.registerTheme(this.theme)

        // Set up ResizeObserver for the wrapper
        if (this.wrapper) {
            this.resizeObserver = new ResizeObserver(() => {
                this.updateGridLayout()
            })
            this.resizeObserver.observe(this.wrapper)
            // Initial layout calculation
            this.updateGridLayout()
        }
    }

    registerTheme(theme?: Theme) {
        const cssTextColor = getComputedStyle(this).getPropertyValue('--re-text-color').trim()
        const cssBgColor = getComputedStyle(this).getPropertyValue('--re-tile-background-color').trim()
        this.themeBgColor = cssBgColor || this.theme?.theme_object?.backgroundColor
        this.themeTitleColor = cssTextColor || this.theme?.theme_object?.title?.textStyle?.color
        this.themeSubtitleColor =
            cssTextColor || this.theme?.theme_object?.title?.subtextStyle?.color || this.themeTitleColor
    }

    /**
     * Update grid layout based on container size and number of elements
     */
    updateGridLayout() {
        if (!this.wrapper) return

        const singleImageUrl = this.inputData?.useUpload
            ? typeof this.inputData?.image === 'string'
                ? this.inputData.image
                : ''
            : (this.inputData?.imageUrl ?? '')

        const images = this.inputData?.multiImage
            ? (this.inputData?.data ?? [])
            : [{ imageUrl: singleImageUrl, title: this.inputData?.title ?? '' }]

        const numElements = images.length
        if (numElements === 0) return

        const rect = this.wrapper.getBoundingClientRect()
        // Account for padding: 2cqw on each side (4% width total), 2cqh on each side (4% height total)
        const horizontalPadding = rect.width * 0.04
        const verticalPadding = rect.height * 0.04
        const containerWidth = rect.width - horizontalPadding
        const containerHeight = rect.height - verticalPadding

        if (containerWidth <= 0 || containerHeight <= 0) return

        // Optimize for 1:1 aspect ratio
        const layout = this.optimizeLayout(
            containerWidth,
            containerHeight,
            numElements,
            (w, h) => Math.abs(w / h - 1 / 1),
            this.inputData?.gap ?? 12
        )

        // Update element dimensions
        this.elementWidth = layout.elementWidth
        this.elementHeight = layout.elementHeight

        // Apply width and height to each child image container
        const imageContainers = this.wrapper.querySelectorAll('.image-item') as NodeListOf<HTMLDivElement>
        imageContainers.forEach((container) => {
            container.style.width = `${layout.elementWidth}px`
            container.style.height = `${layout.elementHeight}px`
        })
    }

    /**
     * Optimize grid layout by minimizing an error function
     * @param containerWidth - Available width for the grid
     * @param containerHeight - Available height for the grid
     * @param numElements - Number of elements to arrange
     * @param errorFn - Error function that takes (element_width, element_height) and returns error value
     * @param gap - Gap between elements (default: 12)
     * @returns Optimal layout configuration
     */
    optimizeLayout(
        containerWidth: number,
        containerHeight: number,
        numElements: number,
        errorFn: (w: number, h: number) => number,
        gap: number = 12
    ): {
        elementWidth: number
        elementHeight: number
        numCols: number
        numRows: number
        error: number
    } {
        let bestLayout = {
            elementWidth: 0,
            elementHeight: 0,
            numCols: 1,
            numRows: numElements,
            error: Infinity
        }

        // Try all possible column configurations from 1 to numElements
        for (let cols = 1; cols <= numElements; cols++) {
            const rows = Math.ceil(numElements / cols)

            // Calculate element dimensions accounting for gaps
            const totalGapWidth = gap * (cols - 1)
            const totalGapHeight = gap * (rows - 1)
            const availableWidth = containerWidth - totalGapWidth
            const availableHeight = containerHeight - totalGapHeight

            if (availableWidth <= 0 || availableHeight <= 0) continue

            const elementWidth = availableWidth / cols
            const elementHeight = availableHeight / rows

            // Calculate error for this configuration
            const error = errorFn(elementWidth, elementHeight)

            // Update best layout if this is better
            if (error < bestLayout.error) {
                bestLayout = {
                    elementWidth,
                    elementHeight,
                    numCols: cols,
                    numRows: rows,
                    error
                }
            }
        }

        return bestLayout
    }

    static styles = css`
        :host {
            display: block;
            font-family: sans-serif;
            box-sizing: border-box;
            margin: auto;
            container-type: size;
        }

        .paging:not([active]) {
            display: none !important;
        }

        .wrapper {
            display: flex;
            flex-wrap: wrap;
            height: 100%;
            width: 100%;
            padding: 2cqh 2cqw;
            box-sizing: border-box;
            gap: 12px;
            align-content: flex-start;
        }

        .wrapper > * {
            flex-shrink: 1;
            min-width: 0;
            min-height: 0;
        }

        .image-item {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            max-width: 100%;
            max-height: 100%;
            overflow: hidden;
        }

        .title {
            height: 24px;
            font-size: 18px;
            margin: 0;
            padding: 0 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
            flex: 0 0 auto;
            white-space: nowrap;
        }

        h3 {
            margin: 0;
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        p {
            margin: 10px 0 0 0;
            max-width: 300px;
            font-size: 14px;
            line-height: 17px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .img-container {
            flex: 1;
            box-sizing: border-box;
            overflow: hidden;
            min-width: 0;
            min-height: 0;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .no-data {
            font-size: 20px;
            display: flex;
            height: 100%;
            width: 100%;
            text-align: center;
            align-items: center;
            justify-content: center;
        }
    `

    render() {
        const singleImageUrl = this.inputData?.useUpload
            ? typeof this.inputData?.image === 'string'
                ? this.inputData.image
                : ''
            : (this.inputData?.imageUrl ?? '')

        const images = this.inputData?.multiImage
            ? (this.inputData?.data ?? [])
            : [{ imageUrl: singleImageUrl, title: this.inputData?.title ?? '' }]

        const hasMultipleItems = images.length > 1
        const showTitles = images.filter((img) => img.title).length > 0
        const hasAnyImage = images.some((img) => img.imageUrl)

        return html`
            <div
                class="wrapper"
                style="background-color: ${this.themeBgColor}; color: ${this
                    .themeTitleColor}; gap: ${hasMultipleItems
                    ? `${this.inputData?.gap ?? 12}px`
                    : '0px'}; ${!hasMultipleItems ? 'flex-direction: column;' : ''}"
            >
                ${!hasMultipleItems && this.inputData?.title
                    ? html`
                          <h3
                              class="paging"
                              ?active=${this.inputData?.title}
                              style="color: ${this.themeTitleColor};"
                          >
                              ${this.inputData?.title}
                          </h3>
                      `
                    : nothing}
                ${!hasMultipleItems && this.inputData?.subTitle
                    ? html`
                          <p
                              class="paging"
                              ?active=${this.inputData?.subTitle}
                              style="color: ${this.themeSubtitleColor};"
                          >
                              ${this.inputData?.subTitle}
                          </p>
                      `
                    : nothing}
                <div class="paging no-data" ?active=${!hasAnyImage} style="color: ${this.themeTitleColor};">
                    No Image
                </div>
                ${repeat(
                    images,
                    (img) => img.imageUrl,
                    (img) => html`
                        <div
                            class="image-item"
                            style="width: ${this.elementWidth}px; height: ${this.elementHeight}px;"
                        >
                            ${showTitles ? html`<h2 class="title">${img.title ?? ''}</h2>` : nothing}
                            <div class="img-container paging" ?active="${img.imageUrl}">
                                <img
                                    src="${ifDefined(img.imageUrl)}"
                                    alt="${img.title || 'Image Widget'}"
                                    style="object-fit: ${this.inputData?.stretchToFit ? 'fill' : 'contain'}"
                                />
                            </div>
                        </div>
                    `
                )}
            </div>
        `
    }
}
