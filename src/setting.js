var setting = {
  id: null,
  auto: false,
  frequence: 0.2, 
  relyOpts: {},
  pipeOpts: {}
};

function extendSetting (opts) {
  setting = { ...setting, opts };
}

export  { setting, extendSetting }
