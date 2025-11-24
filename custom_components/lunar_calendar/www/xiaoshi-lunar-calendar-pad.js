import { LitElement, html, css } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

export class LunarCalendarPad extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  setConfig(config) {
    this.config = {
      lunar: config?.lunar || 'sensor.lunar_calendar',
      theme: config?.theme || 'on',
      width: config?.width || '780px',
      height: config?.height || '540px',
      date: config?.date || 'date.lunar_tap_date',
      ...config
    };
  }
 
  static get styles() {
    return css`
      :host {
        display: block;
      } 
      .grid-container {
        display: grid;
        grid-template-areas: 
          "left1 head  right1"
          "left1 lunar right1"            
          "left2 lunar right2"     
          "left3 lunar right3"    
          "left4 lunar right4"      
          "left5 body1 right5" 
          "left6 body7 right6";
        grid-template-columns: 180px 400px 180px;
        grid-template-rows: 60px 20px 30px 120px 120px 60px 60px;
        width: 760px;
        height: 540px;
        gap: 10px;
      } 
      .grid-item {
        display: flex;
        position: relative;
      }
      .left1 { grid-area: left1; height: 90px; }
      .right1 { grid-area: right1; height: 90px; }
      .head { grid-area: head; height: 60px; }
      .lunar { grid-area: lunar; height: 320px; }
      .left2 { grid-area: left2; height: 30px; }
      .right2 { grid-area: right2; height: 30px; }
      .left3 { grid-area: left3; height: 120px; }
      .right3 { grid-area: right3; height: 120px; }
      .left4 { grid-area: left4; height: 120px; }
      .right4 { grid-area: right4; height: 120px; }
      .left5 { grid-area: left5; height: 60px; }
      .right5 { grid-area: right5; height: 60px; }
      .body1 { grid-area: body1; height: 60px; }
      .left6 { grid-area: left6; height: 60px; }
      .right6 { grid-area: right6; height: 60px; }
      .body7 { grid-area: body7; height: 60px; }
    `;
  }

  render() {
    if (!this.hass) {
      return html`<div>Loading...</div>`;
    }
    const headHeight1 = '320px'; 
    const headHeight12 = '120px'; 
    const headHeight9 = '90px'; 
    const headHeight6 = '60px'; 
    const headHeight3 = '30px'; 
    return html`
      <div class="grid-container">
        <div class="grid-item head">
          <xiaoshi-lunar-calendar-head \n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight6}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-head>
        </div>

        <div class="grid-item lunar">
          <xiaoshi-lunar-calendar \n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight1}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar>
        </div>

        <div class="grid-item body1">
          <xiaoshi-lunar-calendar-body1 \n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight6}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-body1>
        </div>

        <div class="grid-item body7">
          <xiaoshi-lunar-calendar-body7 \n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight6}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-body7>
        </div>
        <div class="grid-item left1">
          <xiaoshi-lunar-calendar-left1\n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight9}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-left1>
        </div>
        
        <div class="grid-item right1">
          <xiaoshi-lunar-calendar-right1\n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight9}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-right1>
        </div>
        
        <div class="grid-item left2">
          <xiaoshi-lunar-calendar-left2\n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight3}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-left2>
        </div>
        
        <div class="grid-item right2">
          <xiaoshi-lunar-calendar-right2\n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight3}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-right2>
        </div>
        
        <div class="grid-item left3">
          <xiaoshi-lunar-calendar-left3\n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight12}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-left3>
        </div>
        
        <div class="grid-item right3">
          <xiaoshi-lunar-calendar-right3\n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight12}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-right3>
        </div>
        
        <div class="grid-item left4">
          <xiaoshi-lunar-calendar-left4\n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight12}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-left4>
        </div>
        
        <div class="grid-item right4">
          <xiaoshi-lunar-calendar-right4\n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight12}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-right4>
        </div>
        
        <div class="grid-item left5">
          <xiaoshi-lunar-calendar-left5\n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight6}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-left5>
        </div>
        
        <div class="grid-item right5">
          <xiaoshi-lunar-calendar-right5\n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight6}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-right5>
        </div>
        
        <div class="grid-item left6">
          <xiaoshi-lunar-calendar-left6\n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight6}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-left6>
        </div>
        
        <div class="grid-item right6">
          <xiaoshi-lunar-calendar-right6\n
            .hass=${this.hass}\n
            .config=${this.config}\n
            .height=${headHeight6}\n
            style="width:100%;height:100%">
          </xiaoshi-lunar-calendar-right6>
        </div>
      </div>
    `;
  }
}
customElements.define('xiaoshi-lunar-calendar-pad', LunarCalendarPad);

export class LunarCalendarPadDate extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      _currentTime: { type: Object },
      _lunarState: { type: Object },
      _flipParts: { type: Array },
      _previousTime: { type: Object },
      _displayTime: { type: Object },
      _theme: { type: String }, 
      _theme_on: { type: String }, 
      _theme_off: { type: String }, 
      _filterValue: { type: String }
    };
  }

  constructor() {
    super();
    this._currentTime = { hours: '', minutes: '', seconds: '' };
    this._previousTime = { hours: '', minutes: '', seconds: '' };
    this._displayTime = { hours: '', minutes: '', seconds: '' };
    this._flipParts = [];
    this._updateInterval = null;
    this._mode = 'A';
    this._theme = 'off';
    this._theme_on= 'rgb(150,70,70)';
    this._theme_off = 'rgb(50,50,50)'; 
    this._filterValue = '0deg';
  }

  setConfig(config) {
    this.config = config;
    this._mode = config.mode || 'A';
    this._theme = config.theme || 'off';
    this._theme_on = config.theme_on || 'rgb(150,70,70)';
    this._theme_off = config.theme_off || 'rgb(50,50,50)';
    this._filterEntity = config.filter || '';
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateTime();
    this._updateInterval = setInterval(() => this._updateTime(), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._updateInterval);
  }

  set hass(hass) {
    this._hass = hass;
    const lunarEntity = this.config?.entity || 'sensor.lunar_calendar';
    this._lunarState = this._hass.states[lunarEntity];
    if (this._filterEntity) {
      const filterState = this._hass.states[this._filterEntity];
      this._filterValue = filterState ? filterState.state + 'deg' : '0deg';
    }
    this._updateStyles();
    this.requestUpdate();
  }

  _updateTime() {
    const now = new Date();
    const beijingOffset = 8 * 60;
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const beijingTime = new Date(utcTime + beijingOffset * 60000);
    const newTime = {
      hours: beijingTime.getHours().toString().padStart(2, '0'),
      minutes: beijingTime.getMinutes().toString().padStart(2, '0'),
      seconds: beijingTime.getSeconds().toString().padStart(2, '0')
    };
    this._previousTime = {...this._displayTime};
    if (this._mode === 'B') {
      this._updateFlipParts(newTime);
    } else {
      this._currentTime = newTime;
      this._displayTime = {...newTime};
      this.requestUpdate();
    }
  }

  _updateFlipParts(newTime) {
    this._flipParts = [];
    const parts = ['hours', 'minutes', 'seconds'];  
    parts.forEach(part => {
      if (newTime[part] !== this._displayTime[part]) {
        this._flipParts.push({
          part,
          newValue: newTime[part],
          oldValue: this._displayTime[part],
          flipping: true
        });   
        setTimeout(() => {
          this._displayTime[part] = newTime[part];
          this._flipParts = this._flipParts.filter(p => p.part !== part);
          this.requestUpdate();
        }, 300);
      }
    });
    this._currentTime = newTime;
    this.requestUpdate();
  }

  render() {
    return html`
      <ha-card @click=${this._showPopup}>
        <div class="grid-container">
          ${this._mode === 'A' 
            ? html`<div id="time">${this._currentTime.hours}:${this._currentTime.minutes}:${this._currentTime.seconds}</div>`
            : this._renderFlipClock()
          }
          <div id="date">${this._getAttribute(this._lunarState, '今天的阳历日期.日期1')}</div>
          <div id="week">${this._getAttribute(this._lunarState, '今天的阳历日期.星期1')}</div>
          <div id="jieqi">${this._getAttribute(this._lunarState, '节气.节气')}</div>
          <div id="year">${this._getAttribute(this._lunarState, '今天的农历日期.年')}</div>
          <div id="mon">${this._getAttribute(this._lunarState, '今天的农历日期.日期').slice(-4)}</div>
          <div id="day">${this._getShichen()}</div>
          <div id="line"></div>
          <div id="shengri">${this._getAttribute(this._lunarState, '最近的生日.0')}</div>
          <div id="jieri">${this._getAttribute(this._lunarState, '最近的节日.0')}</div>
        </div>
      </ha-card>
    `;
  }

  _renderFlipClock() {
    const renderPart = (part) => {
      const flipPart = this._flipParts.find(p => p.part === part);
      const displayValue = flipPart ? flipPart.oldValue : this._displayTime[part];
      const topValue = flipPart ? flipPart.newValue : displayValue;
      return html`
        <div class="flip-part-container">
          <div class="part-top">${topValue}</div>
          ${flipPart ? html`
            <div class="flip-animation flipping">
              <div class="flip-animation-top">${flipPart.oldValue}</div>
              <div class="flip-animation-bottom">${flipPart.newValue}</div>
            </div>
          ` : ''}
          <div class="part-bottom">${displayValue}</div>
        </div>
      `;
    };
    return html`
      <div id="time"\n class="flip-clock">
        ${renderPart('hours')}
        <div class="colon">:</div>
        ${renderPart('minutes')}
        <div class="colon">:</div>
        ${renderPart('seconds')}
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 240px;
        height: 145px;
        color: white !important;
        --text-color: white;
      }
      ha-card {
        background: transparent !important;
        box-shadow: none !important;
        border: none !important;
        cursor: pointer;
      }
      .grid-container {
        display: grid;
        grid-template-areas: 
          "time time time time"
          "date week jieqi jieqi"
          "year mon mon day"
          "line line line line"
          "shengri shengri shengri shengri"
          "jieri jieri jieri jieri";
        grid-template-columns: 80px 58px 16px 72px;
        grid-template-rows: 55px 20px 20px 15px 20px 20px;
        font-weight: bold;
        font-size: 16px;
      }
      #time {
        grid-area: time;
        font-size: 57px;
        font-weight: 430;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        color: var(--text-color);
        line-height: 0.9;
      }
      .colon {
        display: flex;
        align-items: center;
        font-size: 50px;
        color: var(--text-color);
        margin: 0 -5px;
      }
      .flip-clock {
        display: flex;
        justify-content: center;
        gap: 10px;
      }
      .flip-part-container {
        position: relative;
        width: 80px;
        height: 50px;
        perspective: 200px;
      }
      .part-top, .part-bottom {
        line-height: 50px;
        font-size: 47px;
        position: absolute;
        width: 100%;
        height: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        backface-visibility: hidden;
        border-radius: 4px;
        filter: var(--time-filter, none);
        background: var(--time-bg-color, rgba(0, 0, 0, 1));
      }
      .part-top {
        top: 0px;
        bottom: 2px;
        border-radius: 4px 4px 0 0;
        align-items: flex-start;
        z-index: 2;
        transform: translateZ(1px);
      }
      .part-bottom {
        bottom: -1px;
        border-radius: 0 0 4px 4px;
        align-items: flex-end;
        z-index: 1;
        transform: translateZ(1px);
      }
      .flip-animation {
        position: absolute;
        top: 0;
        width: 100%;
        height: 52%;
        transform-style: preserve-3d;
        transform-origin: bottom;
        z-index: 3;
      }
      .flip-animation-top, .flip-animation-bottom {
        line-height: 50px;
        font-size: 47px;
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        overflow: hidden;
        backface-visibility: hidden;
        border-radius: 4px;
        transform-style: preserve-3d;
        filter: var(--time-filter, none);
        background: var(--time-bg-color, rgba(0, 0, 0, 1));
      } 
      .flip-animation-top {
        top: 0px;
        bottom: 2px;
        align-items: flex-start;
        transform: rotateX(0deg) translateZ(1px);
        border-radius: 4px 4px 0 0;
      }
      .flip-animation-bottom {
        bottom: -1px;
        align-items: flex-end;
        transform: rotateX(180deg) translateZ(1px);
        border-radius: 0 0 4px 4px;
      }
      .flipping {
        animation: flip 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      @keyframes flip {
        0% { transform: rotateX(0deg); }
        100% { transform: rotateX(-180deg); }
      }
      #date    { grid-area: date; color: var(--text-color) }
      #week    { grid-area: week; color: var(--text-color) }
      #jieqi   { grid-area: jieqi; text-align: right; color: var(--text-color) }
      #year    { grid-area: year; color: var(--text-color) }
      #mon     { grid-area: mon; color: var(--text-color) }
      #day     { grid-area: day; text-align: right; color: var(--text-color) }
      #line    { 
          grid-area: line; 
          border-bottom: 2px solid rgb(255,255,255); 
          margin: 5px 0;
        }
      #shengri { grid-area: shengri; color: var(--text-color); font-size: 15px }
      #jieri   { grid-area: jieri; color: var(--text-color); font-size: 15px }
    `;
  } 
 
  updated(changedProperties) {
    if (changedProperties.has('_theme') || changedProperties.has('_filterValue')) {
      this._updateStyles(); 
    }
  }

  _updateStyles() {
    const theme = this._evaluateTheme();
    const bgColor =  theme  == 'on' ? this.config.theme_on : this.config.theme_off;
    this.style.setProperty('--time-bg-color', bgColor);
    this.style.setProperty('--time-filter', `hue-rotate(${this._filterValue})`);
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

  _getCurrentTime() {
    const now = new Date();
    return {
      hours: now.getHours().toString().padStart(2, '0'),
      minutes: now.getMinutes().toString().padStart(2, '0'),
      seconds: now.getSeconds().toString().padStart(2, '0')
    };
  }

  _getShichen() {
    const tzArr = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子'];
    const skArr = ['一', '二', '三', '四', '五', '六', '七', '八'];
    const h = new Date().getHours();
    const m = new Date().getMinutes();
    const shichen = tzArr[parseInt( (h+1) / 2)] + '时';
    const shike = skArr[parseInt(m / 15) + Math.abs((h % 2) - 1) * 4] + "刻";
    return shichen+shike;
  } 

  _getAttribute(state, path) { 
    return path.split('.').reduce((obj, key) => (obj || {})[key], state?.attributes || {}) || '';
  }

  _showPopup() {
    const popupContent = this.config.popup_content || {
      type: 'custom:xiaoshi-lunar-calendar-pad',
      theme: this._evaluateTheme()
    };
    const popupStyle = this.config.popup_style || `
      --popup-min-width: 800px;
      --mdc-theme-surface: rgb(0,0,0,0);
      --dialog-backdrop-filter: blur(10px) brightness(1);
    `;
    window.browser_mod.service('popup', { 
      style: popupStyle,
      content: popupContent
    });
  }
}
customElements.define('xiaoshi-lunar-calendar-pad-date', LunarCalendarPadDate);
