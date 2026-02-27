import { useImagePathStoreWithOut } from '@/store/modules/asset'
const imagePathStore = useImagePathStoreWithOut()

let offsetX = 0
let offsetY = 0
let width = 36
let height = 20
let rotate = 0
let marginX = 0.0
let marginY = 0.0

function base64Process(data) {
  //去除base64的数据头
  return data.substring(22)
}

//图像打印数据
export const imgPrintData = {
  InitDrawingBoardParam: {
    width: width,
    height: height,
    rotate: rotate,
    path: 'ZT001.ttf',
    verticalShift: 0,
    HorizontalShift: 0
  },
  elements: []
}

// 假设这是你的按钮点击事件处理函数
export function onButtonClick() {
  //先执行的
  const imagePath = imagePathStore.imagePath

  // console.log('拿到的路径', imagePath);
  let imgData200 = imagePath
  // console.log('imgData200: ', imgData200);

  imgPrintData.elements = [
    {
      type: 'image',
      json: {
        x: marginX + offsetX,
        y: marginY + offsetY,
        height: height,
        width: width,
        rotate: 0,
        imageProcessingType: 0,
        imageProcessingValue: 127,
        imageData: base64Process(imgData200) //B32和T8等300点机型使用imgData300,其余的用imgData200
      }
    }
  ]
}
