import { saveImage } from '@/utils/saveSampleCodeImage'
import { imgPrintData, onButtonClick } from '@/utils/printData/Img.js'
import { ElMessage } from 'element-plus'
import { printerData } from '@/store/modules/printer'
const usbPrinters = ref({})
const onlineUsbBool = ref(false)
const usbSelectPrinter = ref('')
const initBool = ref(false)
const density = ref(3)
const label_type = ref(1)
const print_mode = ref(1)
const loading = ref(false) //打印状态
const printerDataStore = printerData()

// 保存条形码图片并打印
export const savebarCodeAsImage = async (data, title) => {
  //打印之前 更新usb打印列表
  await getPrinters()

  // 连接usb打印机
  await selectOnLineUsbPrinter()

  // 初始化sdk
  await init()

  loading.value = true
  try {
    // 处理图片
    await saveImage(
      data?.barcode || data?.locationCode,
      data?.codeUrl,
      data?.barcode || data?.locationCode,
      title,
      1200,
      500,
      'png'
    )
    // 更新图片
    onButtonClick()
    // 执行打印操作
    startPrintJobTest(imgPrintData)
  } catch (error) {
    console.error('执行过程中出现错误:', error)
  } finally {
    loading.value = false
  }
}

const jsonObj = {
  printerImageProcessingInfo: {
    printQuantity: 1
  }
}

//更新打印机列表
const getPrinters = async () => {
  console.log('dayb1')

  try {
    const allPrintersRes = await printerDataStore.printerClass.getAllPrinters() //打印机列表
    console.log(allPrintersRes, 'allPrintersRes')
    if (allPrintersRes.resultAck.errorCode === 0) {
      const allPrinters = JSON.parse(allPrintersRes.resultAck.info)
      usbPrinters.value = { ...allPrinters }
      usbSelectPrinter.value = Object.keys(usbPrinters.value)[0]
      console.log('printers', usbPrinters.value)
    } else {
      ElMessage({
        message: '没有在线的打印机',
        type: 'warning'
      })
    }
  } catch (err) {
    console.error(err)
  }
}

// 连接打印机
const selectOnLineUsbPrinter = async () => {
  try {
    const res = printerDataStore.printerClass.selectPrinter(
      usbSelectPrinter.value,
      parseInt(usbPrinters.value[usbSelectPrinter.value])
    )
    onlineUsbBool.value = true
    console.log('选择打印机', res)
  } catch (err) {
    console.error(err)
  }
}

//初始化SDK
const init = async () => {
  try {
    const res = await printerDataStore.printerClass.initSdk({ fontDir: '' })
    if (res.resultAck.errorCode == 0) {
      console.log('初始化成功')
      initBool.value = true
    } else {
      console.log('初始化失败')
      initBool.value = false
    }
  } catch (err) {
    console.error(err)
  }
}

// 开始打印
const startPrintJobTest = async (content: any) => {
  const contentArr = ref<any[]>([])
  contentArr.value.push(content)
  batchPrintJob(contentArr.value)
}

//批量打印列表数据
const batchPrintJob = async (list) => {
  const printQuantity = jsonObj.printerImageProcessingInfo.printQuantity
  const startRes = await printerDataStore.printerClass.startJob(
    density.value,
    label_type.value,
    print_mode.value,
    list.length * printQuantity
  )

  if (startRes.resultAck.errorCode == 0) {
    // 提交打印任务
    await printTag(list, 0)
  }
}
// 绘制打印标签
const printTag = async (list, x) => {
  //设置画布尺寸
  try {
    const res = await printerDataStore.printerClass.InitDrawingBoard(list[x].InitDrawingBoardParam)
    if (res.resultAck.errorCode != 0) {
      return
    }
    // 提交打印任务
    printItem(list, x, list[x].elements, 0)
  } catch (err) {
    console.error(err)
  }
}
const printItem = async (list, x, item, i) => {
  try {
    if (i < item.length) {
      let arrParse
      switch (item[i].type) {
        case 'text':
          //绘制文本
          arrParse = await printerDataStore.printerClass.DrawLableText(item[i].json)
          if (arrParse.resultAck.errorCode != 0) {
            return
          }
          i++
          await printItem(list, x, item, i)
          break
        case 'qrCode':
          arrParse = await printerDataStore.printerClass.DrawLableQrCode(item[i].json)
          //绘制二维码
          if (arrParse.resultAck.errorCode !== 0) {
            return
          }
          i++
          await printItem(list, x, item, i)
          break
        case 'barCode':
          //绘制一维码
          arrParse = await printerDataStore.printerClass.DrawLableBarCode(item[i].json)
          if (arrParse.resultAck.errorCode !== 0) {
            return
          }
          i++
          await printItem(list, x, item, i)
          break
        case 'line':
          //绘制线条
          arrParse = await printerDataStore.printerClass.DrawLableLine(item[i].json)
          if (arrParse.resultAck.errorCode !== 0) {
            return
          }
          i++
          await printItem(list, x, item, i)
          break
        case 'graph':
          //绘制边框
          arrParse = await printerDataStore.printerClass.DrawLableGraph(item[i].json)
          if (arrParse.resultAck.errorCode != 0) {
            return
          }

          i++
          await printItem(list, x, item, i)
          break
        case 'image':
          //绘制边框
          arrParse = await printerDataStore.printerClass.DrawLableImage(item[i].json)
          if (arrParse.resultAck.errorCode != 0) {
            return
          }
          i++
          await printItem(list, x, item, i)
          break
      }
    } else {
      //遍历完成，开始打印
      const commitRes = await printerDataStore.printerClass.commitJob(null, JSON.stringify(jsonObj))
      console.log('--')
      //回调页码为数据总长度且回调打印份数数据等于当前页需要打印的份数数据时，结束打印任务
      if (
        commitRes.resultAck.printQuantity == list.length &&
        commitRes.resultAck.onPrintPageCompleted == jsonObj.printerImageProcessingInfo.printQuantity
      ) {
        //结束打印任务
        const endRes = await printerDataStore.printerClass.endJob()
        if (endRes.resultAck.errorCode === 0) {
          console.log('打印完成')
        }
        return
      }
      //回调为提交成功，同时数据未发送完成时，可继续提交数据
      if (commitRes.resultAck.errorCode === 0 && x < list.length - 1) {
        //数据提交成功，数据下标+1
        console.log('发送下一页打印数据： ')
        x++
        await printTag(list, x)
      }
    }
  } catch (err) {
    console.error(err)
  }
}
