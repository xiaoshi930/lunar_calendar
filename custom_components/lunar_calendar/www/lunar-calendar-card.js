console.info("%c 万年历 \n%c v 1.1 ", "color: red; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");

const cardConfigs = [
  {
    type: 'lunar-calendar-phone-date',
    name: '万年历 - 手机日期UI',
    description: '',
		preview: true
  },
  {
    type: 'lunar-calendar-phone',
    name: '万年历 - 手机UI',
    description: '',
		preview: true
  },
  {
    type: 'lunar-calendar-pad-date',
    name: '万年历 - 平板日期UI',
    description: '',
		preview: true
  },
  {
    type: 'lunar-calendar-pad',
    name: '万年历 - 平板UI',
    description: '',
		preview: true
  },
  {
    type: 'lunar-calendar',
    name: '万年历 - 日历UI',
    description: '',
		preview: true
  },
];

const loadCards  = async () => {
  await import('./lunar-calendar.js');
  await import('./lunar-calendar-phone.js');
  await import('./lunar-calendar-module.js');
  await import('./lunar-calendar-pad.js');
  
  window.customCards = window.customCards || [];
  window.customCards.push(...cardConfigs);
};

loadCards ();
