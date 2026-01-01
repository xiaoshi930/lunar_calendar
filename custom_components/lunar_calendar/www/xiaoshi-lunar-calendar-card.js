console.info("%c 消逝-万年历 \n%c      v 2.8 ", "color: red; font-weight: bold; background: black", "color: white; font-weight: bold; background: black");

const loadCards  = async () => {
  await import('./xiaoshi-lunar-calendar.js');
  await import('./xiaoshi-lunar-calendar-phone.js');
  await import('./xiaoshi-lunar-calendar-module.js');
  await import('./xiaoshi-lunar-calendar-pad.js');
  await import('./xiaoshi-birthday-card.js');
  
  window.customCards = window.customCards || [];
  window.customCards.push(...cardConfigs);
};

const cardConfigs = [
  {
    type: 'xiaoshi-lunar-calendar-phone-date',
    name: '消逝万年历 - 手机日期',
    description: '',
	preview: true
  },
  {
    type: 'xiaoshi-lunar-calendar-phone',
    name: '消逝万年历 - 手机端聚合',
    description: ''
  },
  {
    type: 'xiaoshi-lunar-calendar-pad-date',
    name: '消逝万年历 - 平板日期',
    description: '',
	preview: true
  },
  {
    type: 'xiaoshi-lunar-calendar-pad',
    name: '消逝万年历 - 平板端聚合',
    description: ''
  },
  {
    type: 'xiaoshi-lunar-calendar',
    name: '消逝万年历 - 日历UI',
    description: '',
	preview: true
  },
  {
    type: 'xiaoshi-birthday-card',
    name: '消逝万年历 - 生日信息卡片',
    description: '',
	preview: true
  }
];

loadCards ();
