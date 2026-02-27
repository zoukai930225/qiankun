export async function copyText(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // console.log('复制文本', text)
      await navigator.clipboard.writeText(text)
      ElMessage({
        message: '复制成功',
        type: 'success'
      })
    } else {
      // 创建textArea
      let textArea: HTMLTextAreaElement | null = document.createElement('textarea')
      textArea.value = text
      // 使textArea不在viewport，同时设置不可见
      textArea.style.position = 'absolute'
      textArea.style.opacity = '0'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      return new Promise((res: any, rej) => {
        // 执行复制命令并移除文本框
        if (document.execCommand('copy')) {
          res()
          ElMessage({
            message: '复制成功',
            type: 'success'
          })
        } else {
          rej()
          ElMessage({
            message: '复制失败，请手动复制',
            type: 'error'
          })
        }
        if (textArea !== null) {
          document.body.removeChild(textArea)
        }
        textArea = null
      })
    }
  } catch (err) {
    ElMessage({
      message: '复制失败，请手动复制',
      type: 'error'
    })
    console.error('复制失败:', err)
  }
}

export function handleCopyCode(val: string) {
  const textarea = document.createElement('textarea')
  textarea.value = val
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)
  document.execCommand('copy')
  document.body.removeChild(textarea)

  ElMessage.closeAll()
  nextTick(() => {
    ElMessage.success(`复制成功：${val}`)
  })
}
