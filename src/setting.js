export var setting = {
  id: null,
  auto: false,
  frequence: 0.2, 
  relyOpts: {},
  tplOpts: {}
};

export function extendSetting (opts) {
  setting = { ...setting, ...opts };
}
