const requireComponent = require.context('./modules/', true, /.js$/)

let object = {}
requireComponent.keys().forEach(item => {
  let key = item.replace(/\.\/(\S+)\.js/, '$1').replace(/-(\S)/g, (value, $1) => $1.toUpperCase())
  object[key] = requireComponent(item).default
})

export default object
