/*
 * @Date: 2025-03-13 15:59:04
 */
export const getToday = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const end = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  return end
}
