/**
 * 判断数据和是否超过目标值
 * 使用容差比较避免浮点数精度问题
 * @param {number} target - 目标值
 * @param {number|number[]} numbers - 已计算好的和 或 需要相加的数字数组
 * @param {number} [epsilon=1e-6] - 容差值，默认 0.000001
 * @returns {boolean} - 是否超过目标值 true 超过 false 不超过
 */
export function isSumExceedTarget(
  target: number,
  numbers: number | number[],
  epsilon = Number.EPSILON
) {
  // 如果是数组，则计算和；如果是数字，则直接使用
  const sum = Array.isArray(numbers) ? numbers.reduce((acc, curr) => acc + curr, 0) : numbers
  return sum - target > epsilon
}

/**
 * 判断数据和是否等于目标值
 * 使用容差比较避免浮点数精度问题
 * @param {number} target - 目标值
 * @param {number|number[]} numbers - 已计算好的和 或 需要相加的数字数组
 * @param {number} [epsilon=1e-6] - 容差值，默认 0.000001
 * @returns {boolean} - 是否等于目标值（在容差范围内） true 等于 false 不等于
 */
export function isSumEqualTarget(
  target: number,
  numbers: number | number[],
  epsilon = Number.EPSILON
) {
  // 如果是数组，则计算和；如果是数字，则直接使用
  const sum = Array.isArray(numbers) ? numbers.reduce((acc, curr) => acc + curr, 0) : numbers

  return Math.abs(sum - target) <= epsilon
}
