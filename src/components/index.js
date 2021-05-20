const req = require.context('./', true, /.vue$/)
const Vue = require('vue')

// const blackList = ['']

req.keys().forEach((item) => {
  const component = req(item)
  Vue.default.component(component.default.name, component.default)
});



