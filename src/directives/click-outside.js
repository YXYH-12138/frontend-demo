import Vue from "vue";

const outside = (el, value) => (e) => {
  const current = e.target;
  if (el.contains(current)) return;
  value();
}

/**
 * 点击外部 指令
 *  绑定的 value，会传入一个布尔值，表示当前是否点击的是外面
 */
Vue.directive('click-outside', {
  inserted(el, { value }) {
    if (typeof value !== 'function') {
      throw new TypeError('value is not function')
    }
    window.addEventListener('click', outside(el, value))
  },
  unbind(el, { value }) {
    window.removeEventListener('click', outside(el, value))
  }
})