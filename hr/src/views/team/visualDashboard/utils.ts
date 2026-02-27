/*
 * @Date: 2025-01-19 09:56:54
 */
interface DateItem {
  label: string
  prop: string
}

export const generateDates = (start: Date, end: Date) => {
  console.log('start,end', start, end)
  const datesArray: DateItem[] = []
  const currentDate = new Date(start)
  while (currentDate <= end) {
    const day = currentDate.getDate().toString().padStart(2, '0')
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const year = currentDate.getFullYear().toString()
    const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const dayOfWeek = daysOfWeek[currentDate.getDay()]
    datesArray.push({ label: `${month}-${day} ${dayOfWeek}`, prop: `${year}-${month}-${day}` })
    currentDate.setDate(currentDate.getDate() + 1)
  }
  console.log('datesArray111', datesArray)
  return datesArray
}

const baseUrl = 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/visualApproval/'

export const formatStoreIcon = (store: string) => {
  const str = store?.toLowerCase()
  if (str?.includes('taobao')) {
    return `${baseUrl}920400583-tb.png`
  } else if (str?.includes('pdd')) {
    return `${baseUrl}314369605-pdd.png`
  } else if (str?.includes('douyin')) {
    return `${baseUrl}620444503-douyin.png`
  } else if (str?.includes('tmall')) {
    return `${baseUrl}792791811-tm.png`
  }
  return `${baseUrl}920400583-tb.png`
}
