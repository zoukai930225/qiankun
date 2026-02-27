//  'https://img.yzcdn.cn/vant/cat.jpeg',
// 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
export const imgToBase64 = (imgUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    window.URL = window.URL || window.webkitURL

    // 创建 XMLHttpRequest 对象
    const xhr = new XMLHttpRequest()

    // get请求，请求图片资源
    xhr.open('get', imgUrl, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status === 200) {
        // 返回结果是 Blob 类型
        const blob = this.response

        // 读取文件内容
        const reader = new FileReader()

        reader.onloadend = function () {
          // 将 DataURL 作为返回值 resolve
          resolve(reader.result as string)
        }

        // 将 Blob 文件编码成 Base64
        reader.readAsDataURL(blob)
      }
    }

    xhr.send()
  })
}
