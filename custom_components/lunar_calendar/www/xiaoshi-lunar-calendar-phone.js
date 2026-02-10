import { LitElement, html, css } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

export class LunarCalendarPhoneDate extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _theme: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    this._theme = config.theme || 'off';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 20px;
      }
      ha-card {
        background: transparent !important;
        box-shadow: none !important;
        border: none !important; 
      }
      .content {
        font-weight: bold;
        font-size: 12px;
        color: var(--theme-color);
        text-align: center;
      }
    `;
  } 

  render() {
    const theme = this._evaluateTheme();
    const Color =  theme  == 'on' ? 'rgb(0,0,0)' : 'rgb(255,255,255)';
    this.style.setProperty('--theme-color', Color);
    if (!this.hass || !this.config) {
      return html``;
    }
    const entityId = this.config.entity || 'sensor.lunar_calendar';
    const state = this.hass.states[entityId];
    if (!state || !state.attributes) {
      return html``;
    }
    const stateAttrs = state.attributes;
    const date = stateAttrs['今天的阳历日期']?.['日期3'] || '';
    const week = stateAttrs['今天的阳历日期']?.['星期1'] || '';
    const lunaryear = stateAttrs['今天的农历日期']?.['年'] || '';
    const lunardate = stateAttrs['今天的农历日期']?.['日期'] || '';
    const nowdate = `${date} ${week} 【农历 ${lunaryear} ${lunardate}】`;

    return html`
      <ha-card @click=${this._showPopup}>
        <div class="content">${nowdate}</div>
      </ha-card>
    `;
  }

  _evaluateTheme() {
    try {
      if (typeof this.config.theme === 'function') return this.config.theme();
      if (typeof this.config.theme === 'string' && this.config.theme.includes('theme()')) {
        return (new Function('return theme()'))();
      }
      return this.config.theme || 'off';
    } catch(e) {
      return 'off';
    }
  } 

  _handleClick(){
    const hapticEvent = new Event('haptic', {
      bubbles: true,
      cancelable: false,
      composed: true
    });
    hapticEvent.detail = 'light';
    this.dispatchEvent(hapticEvent);
  }

  _showPopup() {
    this._handleClick();
    const popupContent = this.config.popup_content || {
      type: 'custom:xiaoshi-lunar-calendar-phone',
      theme: this._evaluateTheme()
    };
    const popupStyle = this.config.popup_style || `
      --mdc-theme-surface: rgb(150,150,150,0.5);
      --dialog-backdrop-filter: blur(10px) brightness(1);
      --ha-dialog-scrim-backdrop-filter: blur(10px) brightness(1);          
      ha-dialog{
        --dialog-content-position: unset;
      }
    `;
    window.browser_mod.service('popup', { 
      style: popupStyle,
      content: popupContent
    });
  }
}
customElements.define('xiaoshi-lunar-calendar-phone-date', LunarCalendarPhoneDate);

export class LunarCalendarPhone extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      selectedDate: { type: String },
      todayDate: { type: String }
    };
  }

  setConfig(config) {
    this.config = {
      lunar: config?.lunar || 'sensor.lunar_calendar',
      theme: config?.theme || 'on',
      width: config?.width || '100%',
      height: config?.height || '86vh',
      date: config?.date || 'date.lunar_tap_date',
      ...config
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
      }
      .card-container {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
    `;
  }

  render() {
    if (!this.hass) {
      return html`<div>Loading...</div>`;
    }
    const totalHeight = this.config.height;
    const headHeight = '60px'; 
    const calendarHeight = '250px';
    const bodyHeight = `calc((${totalHeight}\n-\n60px\n-\n250px\n-\n${7*6}px)/7)`;
    
    return html`
      <div class="card-container"\n style="width: ${this.config.width};">
        <xiaoshi-lunar-calendar-head \n
          .hass=${this.hass}\n
          .config=${this.config}\n
          .width=${this.config.width}\n
          .height=${headHeight}>
        </xiaoshi-lunar-calendar-head>
        
        <xiaoshi-lunar-calendar \n
          .hass=${this.hass}\n
          .config=${this.config}\n
          .width=${this.config.width}\n
          .height=${calendarHeight}>
        </xiaoshi-lunar-calendar>
        
        <xiaoshi-lunar-calendar-body1 \n
          .hass=${this.hass}\n
          .config=${this.config}\n
          .width=${this.config.width}\n
          .height=${bodyHeight}>
        </xiaoshi-lunar-calendar-body1>
        
        <xiaoshi-lunar-calendar-body2 \n
          .hass=${this.hass}\n
          .config=${this.config}\n
          .width=${this.config.width}\n
          .height=${bodyHeight}>
        </xiaoshi-lunar-calendar-body2>
        
        <xiaoshi-lunar-calendar-body3 \n
          .hass=${this.hass}\n
          .config=${this.config}\n
          .width=${this.config.width}\n
          .height=${bodyHeight}>
        </xiaoshi-lunar-calendar-body3>
        
        <xiaoshi-lunar-calendar-body4 \n
          .hass=${this.hass}\n
          .config=${this.config}\n
          .width=${this.config.width}\n
          .height=${bodyHeight}>
        </xiaoshi-lunar-calendar-body4>
        
        <xiaoshi-lunar-calendar-body5 \n
          .hass=${this.hass}\n
          .config=${this.config}\n
          .width=${this.config.width}\n
          .height=${bodyHeight}>
        </xiaoshi-lunar-calendar-body5>
        
        <xiaoshi-lunar-calendar-body6 \n
          .hass=${this.hass}\n
          .config=${this.config}\n
          .width=${this.config.width}\n
          .height=${bodyHeight}>
        </xiaoshi-lunar-calendar-body6>
        
        <xiaoshi-lunar-calendar-body7 \n
          .hass=${this.hass}\n
          .config=${this.config}\n
          .width=${this.config.width}\n
          .height=${bodyHeight}>\n
        </xiaoshi-lunar-calendar-body7>
      </div>
    `;
  }
}
customElements.define('xiaoshi-lunar-calendar-phone', LunarCalendarPhone);

