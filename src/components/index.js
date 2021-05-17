const requireComponent = require.context('./', true, /index\.vue$/)

const obj = {}

requireComponent.keys().forEach(item => {
  const component = requireComponent(item)
  obj[component.default.name] = component.default
})

export default obj