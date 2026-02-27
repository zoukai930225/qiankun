/*
 * @Date: 2024-07-01 14:07:07
 */
export const employeeStatusDictionary = reactive([
  {
    label: '在职',
    value: 0
  },
  {
    label: '离职',
    value: 1
  }
])

/**
 * 深度对比两个对象
 * @param a
 * @param b
 * @returns
 */
export function deepEqual(a, b) {
  // 快速路径：严格相等
  if (a === b) return true

  // 快速路径：检查是否为 null 或非对象
  if (a === null || typeof a !== 'object' || b === null || typeof b !== 'object') {
    return false
  }

  // 检查是否为数组（关键优化点）
  const isArrayA = Array.isArray(a)
  const isArrayB = Array.isArray(b)

  // 类型不匹配直接返回 false
  if (isArrayA !== isArrayB) return false

  // 数组优化处理
  if (isArrayA) {
    // 快速比较数组长度
    if (a.length !== b.length) return false
    // 使用 for 循环而非 for...of（性能更好）
    for (let i = 0; i < a.length; i++) {
      // 使用 Object.is 处理 NaN 情况
      if (Object.is(a[i], b[i])) continue

      // 递归比较复杂类型
      if (!deepEqual(a[i], b[i])) return false
    }

    return true
  }

  // 对象处理逻辑
  const keysA = Object.keys(a)
  const keysB = new Set(Object.keys(b)) // 使用 Set 加速查找

  // 检查键数量
  if (keysA.length !== keysB.size) return false

  // 遍历并比较每个键
  for (const key of keysA) {
    if (!keysB.has(key) || !deepEqual(a[key], b[key])) {
      return false
    }
  }

  return true
}

/** canvas转blob */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = 'image/png',
  quality = 1
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('图片不存在'))
        }
      },
      type,
      quality
    )
  })
}

/**
 * 计算文本长度是否超过上线
 * @param text
 * @param maxLength
 */
export function equalTextLength(text: string, maxLength: number, fontSize?: number) {
  const a = document.createElement('span')
  a.style.fontSize = fontSize + 'px' || '14px'
  a.innerHTML = text
  document.body.appendChild(a)
  const width = a.offsetWidth
  document.body.removeChild(a)
  return width > maxLength
}

/**
 * 分片数组的方法
 * @param sourceArray 原数组
 * @param chunkSize 单片尺寸
 */
export function splitArrayToChunksBySlice(sourceArray: any[], chunkSize: number) {
  if (chunkSize < 1) {
    return sourceArray ? [sourceArray] : []
  }

  const result: any[] = []
  const totalLength = sourceArray.length

  for (let i = 0; i < totalLength; i += chunkSize) {
    const chunk = sourceArray.slice(i, i + chunkSize)
    result.push(chunk)
  }

  return result
}
