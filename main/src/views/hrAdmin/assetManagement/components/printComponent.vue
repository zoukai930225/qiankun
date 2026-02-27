<template>
  <el-button
    @click="savebarCodeAsImage"
    style="color: #333333; font-size: 14px; font-weight: 400; margin-left: 20px; margin-right: 20px"
    plain
    link
    :loading="loading"
    >打印</el-button
  >
</template>

<script lang="ts" setup>
import { saveImage } from '@/utils/saveImage'
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
const props = defineProps({
  data: Object
})
// 保存条形码图片并打印
const savebarCodeAsImage = async () => {
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
      props.data?.barcodeEncode,
      props.data?.barcodeFileUrl,
      props.data?.number,
      '固定资产条码',
      1200,
      600,
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
</script>
<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;

  h1 {
    text-align: center;
  }

  h3 {
    text-align: left;
  }

  .content {
    border: solid 1px #ced4da;
    padding: 8px;
    text-align: left;
  }

  button {
    margin-left: 8px;
    margin-right: 0px;
    display: inline;
    padding: 8px;
    background-color: #409eff;
    border-color: #409eff;
    border: 1px;
    border-radius: 4px;
    color: #fff;
  }

  button:hover {
    background-color: #75baff;
    border-color: #75baff;
  }

  button:active {
    background-color: #1866b4;
    border-color: #1866b4;
  }

  span {
    color: red;
    font-style: italic;
    font-weight: bold;
    text-decoration: underline;
  }

  .status {
    display: inline;
  }

  .service_status,
  .init_status,
  .connect_usb .usb_printer_connect_status,
  .connect_wifi .wifi_printer_connect_status,
  .select_usb .select_printer,
  .select_wifi .select_printer {
    border: solid 1px #ced4da;
    background-color: #e9ecef;
    border-radius: 4px;
    font-size: 14px;
    padding: 6px;
  }

  .service,
  .init,
  .select_usb,
  .select_wifi,
  .connect_usb,
  .connect_wifi,
  .wifi_printer_setting,
  .wifi_printer_setting .setOrGet,
  .print {
    margin-top: 16px;
  }

  .print_label {
    margin-left: 10px;
    margin-top: 8px;
  }

  #wifi_password {
    margin-left: 16px;
  }
}
</style>
