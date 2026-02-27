self.onmessage = (e: any) => {
  const serializedData = JSON.parse(JSON.stringify(e.data));
  const { dataList, ids, updateData, name } = serializedData;

  // 参数验证
  if (!dataList || !Array.isArray(dataList)) {
    self.postMessage({ type: 'error', message: 'Invalid dataList' });
    return;
  }

  const idSet = new Set(ids);
  const chunkSize = 200; // 合适的块大小
  const total = dataList.length;
  const result: Array<any> = [];

  try {
    for (let i = 0; i < total; i += chunkSize) {
      const chunk = dataList.slice(i, i + chunkSize);

      // 处理当前块
      for (let j = 0; j < chunk.length; j++) {
        const item: any = chunk[j];
        if (idSet.has(item[name])) {
          result.push({ ...item, ...updateData });
        } else {
          result.push(item);
        }
      }

      if (i % 200 === 0) {
        const progress = Math.round((i / total) * 100);
        self.postMessage({
          type: 'progress',
          progress,
          processed: i
        });
      }
    }

    // 发送最终结果
    self.postMessage({
      type: 'complete',
      data: result
    });

  } catch (error: any) {
    self.postMessage({
      type: 'error',
      message: error.message
    });
  }
};