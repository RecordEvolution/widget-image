import { html, css, LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'
import { ConfigureTheImage } from './definition-schema.js'
type Theme = {
    theme_name: string
    theme_object: any
}
export class WidgetImage extends LitElement {
    @property({ type: Object })
    inputData?: ConfigureTheImage

    @property({ type: Object })
    theme?: Theme

    version: string = 'versionplaceholder'

    static styles = css`
        :host {
            display: block;
            font-family: sans-serif;
            box-sizing: border-box;
            margin: auto;
            background-color: var(--re-background-color, #fff);
        }

        .paging:not([active]) {
            display: none !important;
        }

        .wrapper {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            padding: 16px;
            box-sizing: border-box;
        }

        h3 {
            margin: 0;
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--re-text-color, #000);
        }
        p {
            margin: 10px 0 0 0;
            max-width: 300px;
            font-size: 14px;
            line-height: 17px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--re-text-color, #000);
        }

        .img-container {
            flex: 1;
            box-sizing: border-box;
            overflow: hidden;
        }

        img {
            width: 100%; /* Set the width of the container */
            height: 100%;
            object-fit: contain;
        }
        .no-data {
            font-size: 20px;
            color: var(--re-text-color, #000);
            display: flex;
            height: 100%;
            width: 100%;
            text-align: center;
            align-items: center;
            justify-content: center;
        }
    `

    render() {
        return html`
            <div class="wrapper" style="background-color: ${this.theme?.theme_object?.backgroundColor}">
                <h3
                    class="paging"
                    ?active=${this.inputData?.title?.text}
                    style="font-size: ${this.inputData?.title?.fontSize}; 
          font-weight: ${this.inputData?.title?.fontWeight}; 
          background-color: ${this.inputData?.title?.backgroundColor ??
                    this.theme?.theme_object?.backgroundColor};
          color: ${this.inputData?.title?.color ?? this.theme?.theme_object?.title.textStyle.color};"
                >
                    ${this.inputData?.title?.text}
                </h3>
                <p
                    class="paging"
                    ?active=${this.inputData?.subTitle?.text}
                    style="font-size: ${this.inputData?.subTitle?.fontSize}; font-weight: ${this.inputData
                        ?.subTitle?.fontWeight}; color: ${this.inputData?.subTitle?.color ??
                    this.theme?.theme_object?.title.textStyle.color};"
                >
                    ${this.inputData?.subTitle?.text}
                </p>
                <div class="paging no-data" ?active=${!this.inputData?.imageLink}>No Image</div>
                <div class="img-container paging" ?active="${this.inputData?.imageLink}">
                    <img src="${this.inputData?.imageLink ?? ''}" alt="Image Widget" />
                </div>
            </div>
        `
    }
}
window.customElements.define('widget-image-versionplaceholder', WidgetImage)
