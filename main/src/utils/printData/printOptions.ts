/**
 * 配合vue3-print-nb使用
 */

export const printObj = ref({
  id: 'printMe', // 这里是要打印元素的ID
  // url:'https://www.baidu.com/',
  // popTitle: '打印表单', // 打印的标题
  // extraCss: "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css", // 打印可引入外部的一个 css 文件
  // extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>', // 打印头部文字
  // preview: true, // 是否启动预览模式，默认是false
  // previewTitle: '补货单', // 打印预览的标题
  // previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印
  zIndex: 20003, // 预览窗口的z-index，默认是20002，最好比默认值更高
  previewBeforeOpenCallback() {
    // console.log('正在加载预览窗口！')
  }, // 预览窗口打开之前的callback
  previewOpenCallback() {
    // console.log('已经加载完预览窗口，预览打开了！')
  }, // 预览窗口打开时的callback
  beforeOpenCallback(vue) {
    // vue.printLoading = true
    // console.log('开始打印之前！')
  }, // 开始打印之前的callback
  openCallback(vue) {
    // vue.printLoading = false
    // console.log('监听到了打印窗户弹起了！')
  }, // 调用打印时的callback
  closeCallback() {
    // console.log('关闭了打印工具！')
  }, // 关闭打印的callback(点击弹窗的取消和打印按钮都会触发)
  clickMounted() {
    // console.log('点击v-print绑定的按钮了！')
  }
})
