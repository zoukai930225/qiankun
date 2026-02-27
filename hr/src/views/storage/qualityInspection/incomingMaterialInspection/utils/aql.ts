/**
 * =================================================================
 * AQL 验货标准库 (基于 ISO 2859-1 / ANSI/ASQ Z1.4 一般检验水平 II)
 * =================================================================
 */

// 1. 定义支持的 AQL 标准 (严格对应表头)
export type AqlStandard = 0.65 | 1.0 | 1.5 | 2.5 | 4.0 | 6.0;

// 2. 定义返回结果接口
export interface InspectionResult {
  isQualified: boolean; // 判定结果：是否合格
  code: string;         // 字码 (Code Letter)
  sampleSize: number;   // 实际抽样数
  ac: number;           // 允收数 (Accept)
  re: number;           // 拒收数 (Reject)
  msg: string;          // 结果描述文本
}

// 3. 核心数据表：字码 -> { 标准抽样数, 各 AQL 对应的 [AC, RE] }
const AQL_TABLE: Record<string, { baseSample: number; limits: Record<AqlStandard, [number, number]> }> = {
  'A': { baseSample: 2, limits: { 0.65: [0, 1], 1.0: [0, 1], 1.5: [0, 1], 2.5: [0, 1], 4.0: [0, 1], 6.0: [0, 1] } },
  'B': { baseSample: 3, limits: { 0.65: [0, 1], 1.0: [0, 1], 1.5: [0, 1], 2.5: [0, 1], 4.0: [0, 1], 6.0: [0, 1] } },
  'C': { baseSample: 5, limits: { 0.65: [0, 1], 1.0: [0, 1], 1.5: [0, 1], 2.5: [0, 1], 4.0: [0, 1], 6.0: [1, 2] } },
  'D': { baseSample: 8, limits: { 0.65: [0, 1], 1.0: [0, 1], 1.5: [0, 1], 2.5: [0, 1], 4.0: [1, 2], 6.0: [1, 2] } },
  'E': { baseSample: 13, limits: { 0.65: [0, 1], 1.0: [0, 1], 1.5: [0, 1], 2.5: [1, 2], 4.0: [1, 2], 6.0: [2, 3] } },
  'F': { baseSample: 20, limits: { 0.65: [0, 1], 1.0: [0, 1], 1.5: [1, 2], 2.5: [1, 2], 4.0: [2, 3], 6.0: [3, 4] } },
  'G': { baseSample: 32, limits: { 0.65: [0, 1], 1.0: [1, 2], 1.5: [1, 2], 2.5: [2, 3], 4.0: [3, 4], 6.0: [5, 6] } },
  'H': { baseSample: 50, limits: { 0.65: [1, 2], 1.0: [1, 2], 1.5: [2, 3], 2.5: [3, 4], 4.0: [5, 6], 6.0: [7, 8] } },
  'J': { baseSample: 80, limits: { 0.65: [1, 2], 1.0: [2, 3], 1.5: [3, 4], 2.5: [5, 6], 4.0: [7, 8], 6.0: [10, 11] } },
  'K': { baseSample: 125, limits: { 0.65: [2, 3], 1.0: [3, 4], 1.5: [5, 6], 2.5: [7, 8], 4.0: [10, 11], 6.0: [14, 15] } },
  'L': { baseSample: 200, limits: { 0.65: [3, 4], 1.0: [5, 6], 1.5: [7, 8], 2.5: [10, 11], 4.0: [14, 15], 6.0: [21, 22] } },
  'M': { baseSample: 315, limits: { 0.65: [5, 6], 1.0: [7, 8], 1.5: [10, 11], 2.5: [14, 15], 4.0: [21, 22], 6.0: [21, 22] } },
  'N': { baseSample: 500, limits: { 0.65: [7, 8], 1.0: [10, 11], 1.5: [14, 15], 2.5: [21, 22], 4.0: [21, 22], 6.0: [21, 22] } },
  'P': { baseSample: 800, limits: { 0.65: [10, 11], 1.0: [14, 15], 1.5: [21, 22], 2.5: [21, 22], 4.0: [21, 22], 6.0: [21, 22] } },
  'Q': { baseSample: 1250, limits: { 0.65: [14, 15], 1.0: [21, 22], 1.5: [21, 22], 2.5: [21, 22], 4.0: [21, 22], 6.0: [21, 22] } },
  'R': { baseSample: 2000, limits: { 0.65: [21, 22], 1.0: [21, 22], 1.5: [21, 22], 2.5: [21, 22], 4.0: [21, 22], 6.0: [21, 22] } }
};

//批量范围配置 (Range Config)
const BATCH_RANGES = [
  { limit: 8, code: 'A' },
  { limit: 15, code: 'B' },
  { limit: 25, code: 'C' },
  { limit: 50, code: 'D' },
  { limit: 90, code: 'E' },
  { limit: 150, code: 'F' },
  { limit: 280, code: 'G' },
  { limit: 500, code: 'H' },
  { limit: 1200, code: 'J' },
  { limit: 3200, code: 'K' },
  { limit: 10000, code: 'L' },
  { limit: 35000, code: 'M' },
  { limit: 150000, code: 'N' },
  { limit: 500000, code: 'P' }
];

/**
 * 获取批量范围文本，例如：151-280
 */
export function getBatchRangeText(totalQty: number): string {
  const qty = Number(totalQty) || 0
  if (qty <= 0) return ''
  let lower = 1
  for (const r of BATCH_RANGES) {
    if (qty <= r.limit) {
      return `${lower}-${r.limit}`
    }
    lower = r.limit + 1
  }
  const last = BATCH_RANGES[BATCH_RANGES.length - 1]
  return `${last.limit + 1}+`
}

export function getSampleSize(totalQty: number): number {
  if (totalQty < 2) return totalQty; // 小于2全检

  const code = getCodeLetter(totalQty);
  // 获取该字码的标准抽样数
  return AQL_TABLE[code].baseSample;
}

/**
 * 内部辅助函数：根据批量数获取字码 (Code Letter)
 */
function getCodeLetter(totalQty: number): string {
  if (totalQty < 2) return 'A'; // 特殊处理：小于2当做A处理

  for (const range of BATCH_RANGES) {
    if (totalQty <= range.limit) {
      return range.code;
    }
  }
  // 超过 500,000
  return 'Q';
}

/**
 * =================================================================
 * 主函数：AQL 验货判定 (checkQuality)
 * =================================================================
 * @param totalQty   产品总数量 (Batch Size)
 * @param defectQty  发现的残次品数量 (Defect Quantity)
 * @param aqlLevel   执行标准 (0.65, 1.0, 1.5, 2.5, 4.0, 6.0)
 * @returns InspectionResult 对象
 */
export function checkQuality(totalQty: number, defectQty: number, aqlLevel: AqlStandard): InspectionResult {

  // 确定字码 (Code Letter)
  const code = getCodeLetter(totalQty);
  const data = AQL_TABLE[code];

  if (!data) {
    throw new Error(`系统错误：未找到字码 ${code} 的配置数据`);
  }

  // 第二步：确定抽样数 (Sample Size)
  // 逻辑修正：如果批量总数比标准抽样数还小，则全检 (抽样数 = 总数)
  // 例如：总数 5 个，字码 A 抽样 2 个 -> 抽 2 个
  // 例如：总数 1 个，字码 A 抽样 2 个 -> 抽 1 个
  const sampleSize = Math.min(totalQty, data.baseSample);

  // 第三步：查找 AC/RE 标准
  const limits = data.limits[aqlLevel];
  if (!limits) {
    throw new Error(`不支持的 AQL 标准: ${aqlLevel}`);
  }
  const [ac, re] = limits;

  // 第四步：判定
  // 规则：残次品 <= AC (Pass), 残次品 >= RE (Fail)
  // 注意：在标准表中 RE 通常等于 AC + 1，所以 > AC 即为 Fail
  const isQualified = defectQty <= ac;

  // 第五步：生成结果
  return {
    isQualified,
    code,
    sampleSize,
    ac,
    re,
    msg: isQualified
      ? `合格 (发现 ${defectQty} ≤ 允收 ${ac})`
      : `不合格 (发现 ${defectQty} ≥ 拒收 ${re})`
  };
}
