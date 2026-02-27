// oss图片链接压缩
export const getUrl = (url: string) => {
  if (!url) return ''
  return `${url}${url.indexOf('?') > -1 ? '&' : '?'}x-oss-process=image/resize,p_40`
}