/**

 * 将svg导出成图片

 * @param node svg节点 => document.querySelector('svg')

 * @param name 生成的图片名称

 * @param width 生成的图片宽度

 * @param height 生成的图片高度

 * @param type 生成的图片类型

 */
import BackgroundImage from '@/assets/imgs/sample/sampleCodeBg.png'
import CodeIcon from '@/assets/imgs/asset-edit.png'

import { useImagePathStoreWithOut } from '@/store/modules/asset'

const imagePathStore = useImagePathStoreWithOut()

export const saveImage = async (
  barcodeEncode,
  barCodeUrl,
  code,
  name,
  width,
  height,
  type = 'png'
) => {
  const loadImage = (src: any) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = src
      img.onload = () => resolve(img)
      img.onerror = (error) => reject(error)
    })
  }

  try {
    const barCodeImage: any = await loadImage(barCodeUrl)
    const backgroundImage: any = await loadImage(BackgroundImage)
    // const codeIconImage:any = await loadImage(CodeIcon)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')

    if (context) {
      context.drawImage(backgroundImage, 0, 0, width, height)
      context.drawImage(
        barCodeImage,
        (width - barCodeImage.width) / 2,
        height - barCodeImage.height - 10
      )

      // 在条形码图片上方添加代码
      context.font = '60px Arial'
      context.textAlign = 'left'
      // context.drawImage(codeIconImage, 120, height - barCodeImage.height - 100)
      // context.drawImage(codeIconImage, 120, height - barCodeImage.height - 80, 48, 39)

      context.fillText(`${name}：` + code, 180, height - barCodeImage.height - 40)
      // 在条形码图片下方添加 barcodeEncode
      // context.fillText(barcodeEncode, 120, height - 40)
      const a = document.createElement('a')
      a.download = `${name}.${type}`
      a.href = canvas.toDataURL(`image/${type}`)
      // 设置图片路径
      imagePathStore.imagePath = a.href
      // document.body.appendChild(a)
      // a.click()
      // document.body.removeChild(a)
    }
  } catch (error) {
    console.error('Error loading images:', error)
  }
}
