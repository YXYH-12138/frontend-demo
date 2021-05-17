const req = require.context('./', true, /index\.vue$/)
const Vue = require('vue')

req.keys().forEach((item) => {
  const component = req(item)
  Vue.default.component(component.default.name, component.default)
});



