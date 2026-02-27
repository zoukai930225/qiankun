document.body.addEventListener('keydown', (event) => {
  // 使用 matches() 检查是否为输入框或包含特定类的元素
  if (event.target.matches('input, textarea') && event.key === 'Enter') {
    event.preventDefault()
  }
})
// 全局去除输入框回车的默认行为
