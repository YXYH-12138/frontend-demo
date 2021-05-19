module.exports = {
  title: '舜网',
  // description: '舜网',
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: '/', // 这是部署到github相关的配置
  markdown: {
    lineNumbers: false // 代码块显示行号
  },
  themeConfig: {
    nav: [ // 导航栏配置
      { text: '组件', link: '/components' },
    ],
    // sidebar: [
    //   ['/', '简介'],
    //   ['/cst/cst.md', '车商通'],
    //   ['/new/index1.md', '发布新框架'],
    //   ['/feedback/feedback.md', '问题反馈']
    // ],
    sidebar: 'auto', // 侧边栏配置
    sidebarDepth: 2, // 侧边栏显示2级
  }
};