// 页面导出为pdf格式
import html2Canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as FileApi from '@/api/file'

export const htmlToPdf = async (title, id, download = false) => {
  return new Promise((resolve, reject) => {
    html2Canvas(document.querySelector(id), {
      allowTaint: false,
      taintTest: false,
      logging: false,
      useCORS: true,
      dpi: window.devicePixelRatio * 2, //将分辨率提高到特定的DPI 提高四倍
      scale: 2 //按比例增加分辨率
    }).then((canvas) => {
      var pdf = new jsPDF('p', 'mm', 'a4') //A4纸，纵向
      var ctx = canvas.getContext('2d'),
        a4w = 210,
        a4h = 297, //A4大小，210mm x 297mm，
        imgHeight = Math.floor((a4h * canvas.width) / a4w), //按A4显示比例换算一页图像的像素高度
        renderedHeight = 0
      console.log('大家分手快乐', renderedHeight, canvas)
      while (renderedHeight < canvas.height) {
        var page = document.createElement('canvas')
        page.width = canvas.width
        page.height = Math.min(imgHeight, canvas.height - renderedHeight) //可能内容不足一页

        //用getImageData剪裁指定区域，并画到前面创建的canvas对象中
        page
          .getContext('2d')
          .putImageData(
            ctx.getImageData(
              0,
              renderedHeight,
              canvas.width,
              Math.min(imgHeight, canvas.height - renderedHeight)
            ),
            0,
            0
          )
        pdf.addImage(
          page.toDataURL('image/jpeg', 1.0),
          'JPEG',
          0,
          0,
          a4w,
          Math.min(a4h, (a4w * page.height) / page.width)
        ) //添加图像到页面，保留10mm边距

        renderedHeight += imgHeight
        if (renderedHeight < canvas.height) {
          if (canvas.height - renderedHeight > 100) {
            pdf.addPage() //如果后面还有内容，添加一个空页
          }
        }
      }
      // pdf.save(title + '.pdf')
      //转成base64
      console.log('就到了数据库111')
      if (download) {
        //下载pdf
        pdf.save(title + '.pdf')
        resolve('downloadSuccess')
      } else {
        // 预览pdf
        let pdfBlobUrl = pdf.output('bloburl')
        resolve(pdfBlobUrl)
      }
      return
      // var _this = this
      //转成base64
      // let pdfBlob = pdf.output('blob')
      // let newfile = blobToFile(pdfBlob, `${title}.pdf`) //将blob转换为file
      //上传到服务器
      // let formdata = new FormData()
      //第三个参数传一个不一定会用到的文件名，但是得有。注意后缀
      // FileApi.updateFile({ file: newfile, bussinessCode })
      //   .then((res) => {
      //     console.log('倒计时付了款', res)
      //     if (res.code === 200) {
      //       resolve(res)
      //     } else {
      //       reject(res)
      //     }
      //   })
      // .catch((res) => {
      //   reject(res)
      // })
    })
  })
}

//将blob转换为file
const blobToFile = (theBlob, fileName) => {
  const file = new File([theBlob], fileName, { type: 'application/pdf' })
  return file
}
