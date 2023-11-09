import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { InputData } from './types.js'

export class WidgetImage extends LitElement {
  
  @property({type: Object}) 
  inputData = {} as InputData

  static styles = css`
  :host {
    display: block;
    color: var(--re-line-text-color, #000);
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
  }

  #sizer {
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  h2 {
    margin: 0;
    padding: 12px;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
  }

  h3 {
    margin: 0;
    padding: 12px;
  }

  p {
    margin: 0;
    padding: 0px 12px;
  }
`; 

  render() {
    return html`
      <div class="wrapper">
          <h2 class="paging" ?active=${this.inputData?.title?.text}
            style="font-size: ${this.inputData?.title?.fontSize}; 
              font-weight: ${this.inputData?.title?.fontWeight}; 
              color: ${this.inputData?.title?.color};
              background-color: ${this.inputData?.title?.backgroundColor};">
            ${this.inputData?.title?.text}
          </h2>
          <h3 class="paging" ?active=${this.inputData?.subTitle?.text}
            style="font-size: ${this.inputData?.subTitle?.fontSize}; font-weight: ${this.inputData?.subTitle?.fontWeight}; color: ${this.inputData?.subTitle?.color};">
            ${this.inputData?.subTitle?.text}
          </h3>
          <p class="paging" ?active=${this.inputData?.body?.text}
            style="font-size: ${this.inputData?.body?.fontSize}; font-weight: ${this.inputData?.body?.fontWeight}; color: ${this.inputData?.body?.color};">
            ${this.inputData?.body?.text}
          </p>
      </div>
    `;
  }
}
window.customElements.define('widget-image', WidgetImage)
