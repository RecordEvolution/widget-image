import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { InputData } from './types.js'

export class WidgetImage extends LitElement {

  @property({ type: Object })
  inputData = {} as InputData

  static styles = css`
  :host {
    display: block;
    font-family: sans-serif;
    box-sizing: border-box;
    margin: auto;
  }

  .paging:not([active]) { display: none !important; }

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
      color: var(--re-text-color, #000) !important;
    }
  p {
      margin: 10px 0 0 0;
      max-width: 300px;
      font-size: 14px;
      line-height: 17px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--re-text-color, #000) !important;
    }

  .img-container{
    flex: 1;
    box-sizing: border-box;
    overflow: hidden;
  }

  img {
    width: 100%; /* Set the width of the container */
    height: 100%;
    object-fit: contain;
  } 
`;

  render() {
    this.style.setProperty("--re-user-h2-color", this.inputData?.title?.color)
    this.style.setProperty("--re-user-p-color", this.inputData?.subTitle?.color)

    return html`
      <div class="wrapper">
        <h3 class="paging" ?active=${this.inputData?.title?.text}
          style="font-size: ${this.inputData?.title?.fontSize}; 
          font-weight: ${this.inputData?.title?.fontWeight}; 
          background-color: ${this.inputData?.title?.backgroundColor};">
          ${this.inputData?.title?.text}
        </h3>
        <p class="paging" ?active=${this.inputData?.subTitle?.text}
          style="font-size: ${this.inputData?.subTitle?.fontSize}; font-weight: ${this.inputData?.subTitle?.fontWeight};">
          ${this.inputData?.subTitle?.text}
        </p>
        <div class="img-container paging" ?active="${this.inputData?.imageLink}">
          <img src="${this.inputData?.imageLink}" alt="Image Widget">
        </div>
      </div>
    `;
  }
}
window.customElements.define('widget-image', WidgetImage)
