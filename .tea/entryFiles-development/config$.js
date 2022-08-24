
const g = typeof global !== 'undefined' ? global : self;
g.appXAppJson = {
  "app": {
    "$homepage": "pages/index/index",
    "plugins": {
      "HelloWidget": {
        "version": "dev",
        "provider": "devPluginId"
      }
    }
  }
};
