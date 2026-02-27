/**
 * 判断元素内的多行文本是否溢出容器
 * @param {HTMLElement} container - 文本所在的容器元素
 * @param {Object} options - 配置选项
 * @param {boolean} options.autoRestoreStyle - 是否自动恢复样式，默认true
 * @param {boolean} options.forceHeight - 是否强制设置高度，默认false
 * @returns {boolean} 文本溢出则返回true，否则返回false
 */
export const  isMultiLineTextOverflow = (container, options = {}) =>{
  const {
    autoRestoreStyle = true,
    forceHeight = false
  } = options;
  
  // 校验参数合法性
  if (!container || !(container instanceof HTMLElement)) {
    throw new Error('参数必须是有效的DOM元素');
  }

  // 如果元素不可见，返回false
  if (container.offsetParent === null || container.getClientRects().length === 0) {
    console.warn('元素不可见，无法准确计算溢出状态');
    return false;
  }

  // 保存容器原始样式
  const originalStyles = {
    overflow: container.style.overflow,
    height: container.style.height,
    maxHeight: container.style.maxHeight,
    minHeight: container.style.minHeight
  };

  let isOverflow = false;
  
  try {
    // 临时调整样式以确保计算准确
    container.style.overflow = 'hidden';
    
    // 只有当需要强制设置高度且容器没有明确高度时才设置
    const hasExplicitHeight = container.style.height || 
                             container.style.maxHeight || 
                             window.getComputedStyle(container).height !== 'auto';
    
    if (forceHeight && !hasExplicitHeight) {
      // 使用当前可见高度作为基准，而不是固定1px
      const currentHeight = container.clientHeight;
      container.style.height = `${currentHeight}px`;
    }

    // 关键判断：内容总高度 > 可见高度 → 溢出
    // 添加小容差（1px）避免因浏览器计算误差导致的误判
    const tolerance = 1;
    isOverflow = container.scrollHeight > container.clientHeight + tolerance;
    
    // 调试信息
    if (console && console.debug) {
      console.debug('文本溢出检测:', {
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight,
        isOverflow,
        element: container
      });
    }
    
  } catch (error) {
    console.error('文本溢出检测出错:', error);
    isOverflow = false;
  } finally {
    // 恢复容器原始样式
    if (autoRestoreStyle) {
      Object.keys(originalStyles).forEach(key => {
        container.style[key] = originalStyles[key];
      });
    }
  }
  return isOverflow;
}

export const isSingleLineTextOverflow = (element) =>{
   console.log("element",element)
  // 参数校验
  if (!element || !(element instanceof HTMLElement)) {
    throw new Error('参数必须是有效的DOM元素');
  }
  
  // 检查元素是否可见
  if (element.offsetParent === null || element.getClientRects().length === 0) {
    console.warn('元素不可见，无法准确计算溢出状态');
    return false;
  }
   console.log("element.scrollWidth",element.scrollWidth)
   console.log("element.clientWidth",element.clientWidth)
  // 核心判断：内容宽度 > 容器宽度 → 溢出
  return element.scrollWidth > element.clientWidth;
}