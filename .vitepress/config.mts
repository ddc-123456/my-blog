import {defineConfig} from 'vitepress'
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/my-blog/",
  title: "dc",
  description: "record",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Examples', link: '/markdown-examples'},
      {text: '测试', link: '/test'}
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          {text: 'Markdown Examples', link: '/markdown-examples'},
          {text: 'Runtime API Examples', link: '/api-examples'}
        ]
      }
    ],

    socialLinks: [
      {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '选择',
              navigateText: '切换',
              closeText: '关闭',
              closeKeyAriaLabel: '关闭'
            }
          }
        }
      }
    }
  },
  vite: {
    plugins: [
      AutoSidebar({
        path: '.',
        collapsed: false,
        ignoreList: ['.obsidian', '.git', 'node_modules',],
        ignoreIndexItem: true
      })
    ]
  },

})
