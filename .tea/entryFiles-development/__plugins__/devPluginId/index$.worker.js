require('@alipay/appx-compiler/lib/sjsEnvInit');
AFAppX.Plugin({ config: {
  "publicComponents": {
    "mini-card": "component/mini-card"
  }
},

run: function(){
require('../../../../widget/component/mini-card?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
},
});