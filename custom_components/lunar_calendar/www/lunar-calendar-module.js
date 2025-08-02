import { LitElement, html, css } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

export class LunarCalendarHead extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '60px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%';
    this.height = '60px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "gonglilabel gongli"
          "nonglilabel nongli";
        grid-template-columns: 15% 85%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .gongli-label, 
      .nongli-label {
        font-size: 15px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .gongli-label {
        grid-area: gonglilabel;
      }
      .nongli-label {
        grid-area: nonglilabel;
      }
      .gongli-data, 
      .nongli-data {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .gongli-data {
        grid-area: gongli;
      }
      .nongli-data {
        grid-area: nongli;
      }
      .date-diff {
        font-size: 10px;
        color: rgb(150,150,150);
        display: inline-flex;
        align-items: flex-end;
        padding-top: 2px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes;
    const solarDate = lunarData.点击的阳历日期?.日期2 || '';
    const nowSolarDate = lunarData.今天的阳历日期?.日期2 || '';
    const weekDay = lunarData.点击的阳历日期?.星期1 || '';
    const zodiac = this.getZodiacWithSymbol(lunarData.点击的阳历日期?.星座 || '');
    const dateDiff = this.calculateDateDiff(solarDate, nowSolarDate);
    const lunarYear = lunarData.点击的农历日期?.年 || '';
    const lunarDate = lunarData.点击的农历日期?.日期 || '';
    const season = lunarData.老黄历信息?.季节 || '';
    const moonPhase = this.getMoonPhaseWithSymbol(lunarData.老黄历信息?.月相 || '');
    return html`
      <div export class="calendar"\n
           style="${style}">
        <div export class="gongli-label">公历</div>
        <div export class="gongli-data">
          ${solarDate}&ensp;
          ${dateDiff ? html`<span export class="date-diff">${dateDiff}</span>` : ''}&ensp;
          ${weekDay}&emsp;${zodiac}
        </div>
        <div export class="nongli-label">农历</div>
        <div export class="nongli-data">
          ${lunarYear}&emsp;${lunarDate}&emsp;${season}&emsp;${moonPhase}
        </div>
      </div>
    `;
  }

  calculateDateDiff(tapDate, nowDate) {
    if (!tapDate || !nowDate) return '';
    const tapDateTime = new Date(`${tapDate}T00:00:00`);
    const nowDateTime = new Date(`${nowDate}T00:00:00`);
    const diffTime = tapDateTime.getTime() - nowDateTime.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
    if (diffDays === 0) return '';
    if (diffDays > 0) return `(${diffDays}天后)`;
    return `(${Math.abs(diffDays)}天前)`;
  }

  getZodiacWithSymbol(zodiac) {
    const zodiacSymbols = {
      '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
      '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
      '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓'
    };
    return zodiac + (zodiacSymbols[zodiac] || '');
  }

  getMoonPhaseWithSymbol(moonPhase) {
    const moonPhaseSymbols = {
      '朔月': '🌑', '既朔月': '🌑', '蛾眉新月': '🌒', '蛾眉月': '🌒',
      '夕月': '🌓', '上弦月': '🌓', '九夜月': '🌓', '宵月': '🌔',
      '渐盈凸月': '🌔', '小望月': '🌕', '望月': '🌕', '既望月': '🌕',
      '立待月': '🌖', '居待月': '🌖', '寝待月': '🌖', '更待月': '🌖',
      '渐亏凸月': '🌗', '下弦月': '🌗', '有明月': '🌗', '蛾眉残月': '🌘',
      '残月': '🌘', '晓月': '🌑', '晦月': '🌑'
    };
    return moonPhase + (moonPhaseSymbols[moonPhase] || '');
  }
}
customElements.define('lunar-calendar-head', LunarCalendarHead);

export class LunarCalendarBody1 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on'; 
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%';
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a0 a1 a2 a3 a4 a5 a6 a7 a8 a9 a10 a11 a12"
          "b0 b1 b2 b3 b4 b5 b6 b7 b8 b9 b10 b11 b12";
        grid-template-columns: repeat(13, minmax(0, 1fr));
        grid-template-rows: 65% 35%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .time-cell {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        text-align: center;
        font-size: 13px;
        white-space: nowrap;
        overflow: visible;
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
      }
      .luck-cell {
        text-align: center;
        font-size: 13px;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes;
    const nowDate = lunarData.今天的阳历日期?.日期2 || '';
    const selectedDate = lunarData.点击的阳历日期?.日期2 || '';
    const isCurrentDay = nowDate === selectedDate;
    const now = new Date();
    const hour = now.getHours();
    let currentShichenIndex = -1;
    if (isCurrentDay) {
      if (hour === 23 || hour === 0) {
        if (hour === 23) {
          currentShichenIndex = 12;
        } else {
          currentShichenIndex = 0;
        }
      } else {
        const tzArr = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
        const currentShichen = tzArr[(Math.floor((hour + 1) / 2)) % 12];
        for (let i = 0; i < 13; i++) {
          const shichenGanzhi = lunarData.老黄历信息.时辰干支[i] || '';
          const shichen = shichenGanzhi.slice(1, 2);
          if (shichen === currentShichen) {
            currentShichenIndex = i;
            break;
          }
        }
      }
    }
    const timeCells = [];
    for (let i = 0; i < 13; i++) {
      const shichenGanzhi = lunarData.老黄历信息.时辰干支[i] || '';
      const isCurrent = i === currentShichenIndex;
      const cellStyle = isCurrent ? 'color: rgb(0,191,255);' : '';
      timeCells.push(html`
        <div export class="time-cell"\nstyle="${cellStyle}">${shichenGanzhi}</div>
      `);
    }
    const luckCells = [];
    for (let i = 0; i < 13; i++) {
      const luck = lunarData.老黄历信息.时辰吉凶[i] || '';
      const color = luck === '吉' ? 'rgb(50,250,50)' : 'rgb(255,0,0)';
      luckCells.push(html`
        <div export class="luck-cell"\nstyle="color: ${color}">${luck}</div>
      `);
    }
    return html`
      <div export class="calendar"\nstyle="${style}">
        ${timeCells.map((cell, index) => html`<div style="grid-area: a${index}">${cell}</div>`)}
        ${luckCells.map((cell, index) => html`<div style="grid-area: b${index}">${cell}</div>`)}
      </div>
    `;
  }
}
customElements.define('lunar-calendar-body1', LunarCalendarBody1);

export class LunarCalendarBody2 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%';
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 b1"
          "a2 b2";
        grid-template-columns: 10% 90%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label1 {
        color: rgb(0,220,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
      }
      .label2 {
        color: rgb(255,0,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        line-height: 12px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _calculateFontSize(length) {
    if (length <= 40) return '13px';
    if (length <= 70) return '12px';
    if (length <= 100) return '11px';
    if (length <= 130) return '10px';
    return '9px';
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `background: ${bgColor};color: ${fgColor};width: ${this.width};height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const label1 = lunarData.宜;
    const label2 = lunarData.忌;
    const maxLength = Math.max(
      label1 ? label1.length : 0,
      label2 ? label2.length : 0
    );
    const commonFontSize = this._calculateFontSize(maxLength);
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="label1">宜</div>
        <div export class="state"\n style="grid-area: b1; font-size: ${commonFontSize}">${label1}</div>
        <div export class="label2">忌</div>
        <div export class="state"\n style="grid-area: b2; font-size: ${commonFontSize}">${label2}</div>
      </div>
    `;
  }
}
customElements.define('lunar-calendar-body2', LunarCalendarBody2);

export class LunarCalendarBody3 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%';
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 b1"
          "a2 b2";
        grid-template-columns: 10% 90%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label1 {
        color: rgb(0,220,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .label2 {
        color: rgb(255,0,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _calculateFontSize(length) {
    if (length <= 40) return '13px';
    if (length <= 80) return '12px';
    if (length <= 120) return '11px';
    if (length <= 160) return '10px';
    return '9px';
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const label1 = lunarData.吉神;
    const label2 = lunarData.凶煞;
    const maxLength = Math.max(
      label1 ? label1.length : 0,
      label2 ? label2.length : 0
    );
    const commonFontSize = this._calculateFontSize(maxLength);
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="label1">吉神</div>
        <div export class="state"\n style="grid-area: b1; font-size: ${commonFontSize}">${label1}</div>
        <div export class="label2">凶煞</div>
        <div export class="state"\n style="grid-area: b2; font-size: ${commonFontSize}">${label2}</div>
      </div>
    `;
  }
}
customElements.define('lunar-calendar-body3', LunarCalendarBody3);

export class LunarCalendarBody4 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%';
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 b1 a3 b3"
          "a2 b2 a4 b4";
        grid-template-columns: 10% 40% 10% 40%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(255,0,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const label1 = lunarData.彭祖干;
    const label2 = lunarData.彭祖支;
    const label3 = lunarData.相冲;
    const label4 = lunarData.岁煞;
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">彭祖</div>
        <div export class="state"\n style="grid-area: b1;">${label1}</div>
        <div export class="label"\n style="grid-area: a2;">百忌</div>
        <div export class="state"\n style="grid-area: b2;">${label2}</div>
        <div export class="label"\n style="grid-area: a3;">相冲</div>
        <div export class="state"\n style="grid-area: b3;">${label3}</div>
        <div export class="label"\n style="grid-area: a4;">岁煞</div>
        <div export class="state"\n style="grid-area: b4;">${label4}</div>
      </div>
    `;
  }
}
customElements.define('lunar-calendar-body4', LunarCalendarBody4);

export class LunarCalendarBody5 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 b1 a3 b3"
          "a2 b2 a4 b4";
        grid-template-columns: 10% 40% 10% 40%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(0,220,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const label1 = lunarData.本月胎神 + " " + lunarData.今日胎神;
    const label2 = lunarData.物候;
    const label3 = lunarData.星宿;
    const label4 = lunarData.天神;
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">胎神</div>
        <div export class="state"\n style="grid-area: b1;">${label1}</div>
        <div export class="label"\n style="grid-area: a2;">物候</div>
        <div export class="state"\n style="grid-area: b2;">${label2}</div>
        <div export class="label"\n style="grid-area: a3;">星宿</div>
        <div export class="state"\n style="grid-area: b3;">${label3}</div>
        <div export class="label"\n style="grid-area: a4;">天神</div>
        <div export class="state"\n style="grid-area: b4;">${label4}</div>
      </div>
    `;
  }
}
customElements.define('lunar-calendar-body5', LunarCalendarBody5);

export class LunarCalendarBody6 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 b1 a2 b2 b2 b2"
          "a3 b3 a4 b4 a5 b5";
        grid-template-columns: 10% 40% 10% 10% 20% 10%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(0,220,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const label1 = lunarData.九星;
    const label2 = lunarData.纳音.年 + " "+lunarData.纳音.月+" "+lunarData.纳音.日;
    const label3 = lunarData.日禄;
    const label4 = lunarData.六耀;
    const label5 = lunarData.值星;
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">九星</div>
        <div export class="state"\n style="grid-area: b1;">${label1}</div>
        <div export class="label"\n style="grid-area: a2;">纳音</div>
        <div export class="state"\n style="grid-area: b2;">${label2}</div>
        <div export class="label"\n style="grid-area: a3;">日禄</div>
        <div export class="state"\n style="grid-area: b3;">${label3}</div>
        <div export class="label"\n style="grid-area: a4;">六耀</div>
        <div export class="state"\n style="grid-area: b4;">${label4}</div>
        <div export class="label"\n style="grid-area: a5;">十二建星</div>
        <div export class="state"\n style="grid-area: b5;">${label5}</div>
      </div>
    `;
  }
}
customElements.define('lunar-calendar-body6', LunarCalendarBody6);

export class LunarCalendarBody7 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '55px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '55px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 a2 a3 a4 a5"
          "b1 b2 b3 b4 b5";
        grid-template-columns: 20% 20% 20% 20% 20%;
        grid-template-rows: 50% 50%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(0,220,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
      .direction-container {
        display: flex;
        align-items: center;
        justify-content: center;
        --mdc-icon-size: 15px;
      }
      .direction-icon {
        transition: transform 0.3s ease;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _getRotationAngle(label) {
    if (!label) return "rotate(0deg)";
    if (label.includes("正北")) return "rotate(0deg)";
    if (label.includes("东北")) return "rotate(45deg)";
    if (label.includes("正东")) return "rotate(90deg)";
    if (label.includes("东南")) return "rotate(135deg)";
    if (label.includes("正南")) return "rotate(180deg)";
    if (label.includes("西南")) return "rotate(225deg)";
    if (label.includes("正西")) return "rotate(270deg)";
    if (label.includes("西北")) return "rotate(315deg)";
    return "rotate(0deg)";
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const label1 = lunarData.喜神;
    const label2 = lunarData.福神;
    const label3 = lunarData.财神;
    const label4 = lunarData.阳贵;
    const label5 = lunarData.阴贵;
    const renderDirection = (label) => html`
      <div export class="direction-container">
        <ha-icon 
          export class="direction-icon"\n
          icon="mdi:arrow-up-bold"\n
          style="transform: ${this._getRotationAngle(label)};"
        ></ha-icon>
        ${label}
      </div>
    `;
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">喜神</div>
        <div export class="state"\n style="grid-area: b1;">${renderDirection(label1)}</div>
        <div export class="label"\n style="grid-area: a2;">福神</div>
        <div export class="state"\n style="grid-area: b2;">${renderDirection(label2)}</div>
        <div export class="label"\n style="grid-area: a3;">财神</div>
        <div export class="state"\n style="grid-area: b3;">${renderDirection(label3)}</div>
        <div export class="label"\n style="grid-area: a4;">阳贵</div>
        <div export class="state"\n style="grid-area: b4;">${renderDirection(label4)}</div>
        <div export class="label"\n style="grid-area: a5;">阴贵</div>
        <div export class="state"\n style="grid-area: b5;">${renderDirection(label5)}</div>
      </div>
    `;
  }
}
customElements.define('lunar-calendar-body7', LunarCalendarBody7);

export class LunarCalendarLeft1 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '90px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '90px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 a2 a3"
          "b1 b2 b3"
          "c1 c2 c3";
        grid-template-columns: 33% 17% 50%;
        grid-template-rows: repeat(3, 1fr);
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(250,50,10);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `background: ${bgColor};color: ${fgColor};width: ${this.width};height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const labela1 = lunarData.干支.年+"年";
    const labelb1 = lunarData.干支.月+"月";
    const labelc1 = lunarData.干支.日+"日";
    const labela2 = lunarData.生肖.年;
    const labelb2 = lunarData.生肖.月;
    const labelc2 = lunarData.生肖.日;
    const labela3 = lunarData.纳音.年;
    const labelb3 = lunarData.纳音.月;
    const labelc3 = lunarData.纳音.日;
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">${labela1}</div>
        <div export class="label"\n style="grid-area: b1;">${labelb1}</div>
        <div export class="label"\n style="grid-area: c1;">${labelc1}</div>
        <div export class="state"\n style="grid-area: a2;">${labela2}</div>
        <div export class="state"\n style="grid-area: b2;">${labelb2}</div>
        <div export class="state"\n style="grid-area: c2;">${labelc2}</div>
        <div export class="state"\n style="grid-area: a3;">${labela3}</div>
        <div export class="state"\n style="grid-area: b3;">${labelb3}</div>
        <div export class="state"\n style="grid-area: c3;">${labelc3}</div>
      </div>
    `;
  }
} 
customElements.define('lunar-calendar-left1', LunarCalendarLeft1);

export class LunarCalendarRight1 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '90px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '90px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 a2"
          "b1 b2"
          "c1 c2";
        grid-template-columns: 27% 73%;
        grid-template-rows: repeat(3, 1fr);
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(250,50,10);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const labela2 = lunarData.相冲;
    const labelb2 = lunarData.岁煞;
    const labelc2 = lunarData.天神;
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">相冲</div>
        <div export class="label"\n style="grid-area: b1;">岁煞</div>
        <div export class="label"\n style="grid-area: c1;">天神</div>
        <div export class="state"\n style="grid-area: a2;">${labela2}</div>
        <div export class="state"\n style="grid-area: b2;">${labelb2}</div>
        <div export class="state"\n style="grid-area: c2;">${labelc2}</div>
      </div>
    `;
  }
} 
customElements.define('lunar-calendar-right1', LunarCalendarRight1);

export class LunarCalendarLeft2 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '30px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '30px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1";
        grid-template-columns: 100%;
        grid-template-rows: 100%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes;
    const label = lunarData.节气.上一节气;
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="state"\n style="grid-area: a1;">${label}</div>
      </div>
    `;
  }
} 
customElements.define('lunar-calendar-left2', LunarCalendarLeft2);

export class LunarCalendarRight2 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '30px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '30px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1";
        grid-template-columns: 100%;
        grid-template-rows: 100%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height}; 
    `;
    const lunarData = this.hass.states[this.lunar].attributes;
    const label = lunarData.节气.下一节气;
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="state"\n style="grid-area: a1;">${label}</div>
      </div>
    `;
  }
} 
customElements.define('lunar-calendar-right2', LunarCalendarRight2);

export class LunarCalendarLeft3 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '120px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '120px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1"
          "b1";
        grid-template-columns: 100%;
        grid-template-rows: 15% 85%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
        place-items: center; 
      }
      .label{
        background: rgb(0,220,0);
        border-radius: 100%;
        color: rgb(255,255,255);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        width: 25px;
        height: 25px;
        margin-top: 15px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 16px;
        padding: 0 5px 0 5px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _calculateFontSize(length) {
    if (length <= 70) return '13px';
    if (length <= 100) return '12px';
    if (length <= 130) return '11px';
    return '10px';
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const label1 = lunarData.宜;
    const label2 = lunarData.忌;
    const maxLength = Math.max(
      label1 ? label1.length : 0,
      label2 ? label2.length : 0
    );
    const commonFontSize = this._calculateFontSize(maxLength);
    return html` 
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">宜</div>
        <div export class="state"\n style="grid-area: b1; font-size: ${commonFontSize}">${label1}</div>
      </div>
    `;
  }
} 
customElements.define('lunar-calendar-left3', LunarCalendarLeft3); 

export class LunarCalendarRight3 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '120px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '120px';
  }

  static get styles() { 
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1"
          "b1";
        grid-template-columns: 100%;
        grid-template-rows: 15% 85%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
        place-items: center; 
      }
      .label{
        background: rgb(200,20,0);
        border-radius: 100%;
        color: rgb(255,255,255);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        width: 25px;
        height: 25px;
        margin-top: 15px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 16px;
        padding: 0 5px 0 5px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _calculateFontSize(length) {
    if (length <= 70) return '13px'; 
    if (length <= 100) return '12px';
    if (length <= 130) return '11px';
    return '10px';
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const label1 = lunarData.宜;
    const label2 = lunarData.忌;
    const maxLength = Math.max(
      label1 ? label1.length : 0,
      label2 ? label2.length : 0
    );
    const commonFontSize = this._calculateFontSize(maxLength);
    return html` 
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">忌</div>
        <div export class="state"\n style="grid-area: b1; font-size: ${commonFontSize}">${label2}</div>
      </div>
    `;
  }
} 
customElements.define('lunar-calendar-right3', LunarCalendarRight3); 

export class LunarCalendarLeft4 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '120px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '120px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1"
          "b1";
        grid-template-columns: 100%;
        grid-template-rows: 15% 85%;
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
        place-items: center; 
      }
      .label{
        color: rgb(0,220,0); 
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        margin-top: 10px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 16px;
        padding: 0 5px 0 5px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _calculateFontSize(length) {
    if (length <= 70) return '13px';
    if (length <= 100) return '12px';
    if (length <= 130) return '11px';
    return '10px';
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const label1 = lunarData.吉神;
    const label2 = lunarData.凶煞;
    const maxLength = Math.max(
      label1 ? label1.length : 0,
      label2 ? label2.length : 0
    );
    const commonFontSize = this._calculateFontSize(maxLength);
    return html` 
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">吉神宜趋</div>
        <div export class="state"\n style="grid-area: b1; font-size: ${commonFontSize}">${label1}</div>
      </div>
    `;
  }
} 
customElements.define('lunar-calendar-left4', LunarCalendarLeft4); 

export class LunarCalendarRight4 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '120px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '120px';
  }

  static get styles() { 
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1"
          "b1";
        grid-template-columns: 100%;
        grid-template-rows: 15% 85%; 
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px; 
        place-items: center; 
      }
      .label{
        color: rgb(200,20,0);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        margin-top: 10px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 16px;
        padding: 0 5px 0 5px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  _calculateFontSize(length) {
    if (length <= 70) return '13px'; 
    if (length <= 100) return '12px';
    if (length <= 130) return '11px';
    return '10px';
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const label1 = lunarData.吉神;
    const label2 = lunarData.凶煞;
    const maxLength = Math.max(
      label1 ? label1.length : 0,
      label2 ? label2.length : 0
    );
    const commonFontSize = this._calculateFontSize(maxLength);
    return html` 
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">凶煞宜忌</div>
        <div export class="state"\n style="grid-area: b1; font-size: ${commonFontSize}">${label2}</div>
      </div>
    `;
  }
} 
customElements.define('lunar-calendar-right4', LunarCalendarRight4); 

export class LunarCalendarLeft5 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '60px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '60px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 a2"
          "b1 b2";
        grid-template-columns: 27% 73%;
        grid-template-rows: repeat(2, 1fr);
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(250,50,10);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const labela2 = lunarData.彭祖干;
    const labelb2 = lunarData.彭祖支;
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">彭祖</div>
        <div export class="label"\n style="grid-area: b1;">百忌</div>
        <div export class="state"\n style="grid-area: a2;">${labela2}</div>
        <div export class="state"\n style="grid-area: b2;">${labelb2}</div>
      </div>
    `;
  }
} 
customElements.define('lunar-calendar-left5', LunarCalendarLeft5);

export class LunarCalendarRight5 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '60px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '60px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 a2"
          "b1 b2";
        grid-template-columns: 38% 62%;
        grid-template-rows: repeat(2, 1fr);
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(250,50,10);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const labela2 = lunarData.本月胎神;
    const labelb2 = lunarData.今日胎神;
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">本月胎神</div>
        <div export class="label"\n style="grid-area: b1;">今日胎神</div>
        <div export class="state"\n style="grid-area: a2;">${labela2}</div>
        <div export class="state"\n style="grid-area: b2;">${labelb2}</div>
      </div>
    `;
  }
} 
customElements.define('lunar-calendar-right5', LunarCalendarRight5);

export class LunarCalendarLeft6 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '60px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '60px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 a2"
          "b1 b2";
        grid-template-columns: 27% 73%;
        grid-template-rows: repeat(2, 1fr);
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(250,50,10);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
        white-space: nowrap;
        overflow: visible;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const labela2 = lunarData.日禄;
    const labelb2 = lunarData.物候;
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">日禄</div>
        <div export class="label"\n style="grid-area: b1;">物候</div>
        <div export class="state"\n style="grid-area: a2;">${labela2}</div>
        <div export class="state"\n style="grid-area: b2;">${labelb2}</div>
      </div>
    `;
  }
} 
customElements.define('lunar-calendar-left6', LunarCalendarLeft6);

export class LunarCalendarRight6 extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      lunar: { type: String },
      theme: { type: String },
      width: { type: String },
      height: { type: String }
    };
  }

  setConfig(config) {
    this.config = config;
    if (config) {
      this.lunar = config.lunar || 'sensor.lunar_calendar';
      this.theme = config.theme || 'on';
      this.width = config.width || '100%';
      this.height = config.height || '60px';
    }
  }

  constructor() {
    super();
    this.lunar = 'sensor.lunar_calendar';
    this.theme = 'on';
    this.width = '100%'; 
    this.height = '60px';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .calendar {
        display: grid;
        grid-template-areas: 
          "a1 a2"
          "b1 b2";
        grid-template-columns: 27% 73%;
        grid-template-rows: repeat(2, 1fr);
        gap: 1px;
        padding: 2px;
        border-radius: 10px;
        margin-bottom: -3px;
      }
      .label{
        color: rgb(250,50,10);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .state {
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 13px;
      }
    `;
  }

  _evaluateTheme() {
    try {
      if (!this.config || !this.config.theme) return 'on';
      if (typeof this.config.theme === 'function') {
        return this.config.theme();
      }
      if (typeof this.config.theme === 'string' && 
          (this.config.theme.includes('return') || this.config.theme.includes('=>'))) {
        return (new Function(`return ${this.config.theme}`))();
      }
      return this.config.theme;
    } catch(e) {
      console.error('计算主题时出错:', e);
      return 'on';
    }
  }

  render() {
    if (!this.hass || !this.hass.states[this.lunar] || !this.hass.states[this.lunar].attributes) {
      return html`<div export class="calendar">加载中...</div>`;
    }
    const theme = this._evaluateTheme();
    const bgColor = theme === 'on' ? 'rgb(255, 255, 255)' : 'rgb(50, 50, 50)';
    const fgColor = theme === 'on' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    const style = `
      background: ${bgColor};
      color: ${fgColor};
      width: ${this.width};
      height: ${this.height};
    `;
    const lunarData = this.hass.states[this.lunar].attributes.老黄历信息;
    const labela2 = lunarData.九星;
    const labelb2 = lunarData.星宿;
    return html`
      <div export class="calendar"\n style="${style}">
        <div export class="label"\n style="grid-area: a1;">九星</div>
        <div export class="label"\n style="grid-area: b1;">星宿</div>
        <div export class="state"\n style="grid-area: a2;">${labela2}</div>
        <div export class="state"\n style="grid-area: b2;">${labelb2}</div>
      </div>
    `;
  }
} 
customElements.define('lunar-calendar-right6', LunarCalendarRight6);
