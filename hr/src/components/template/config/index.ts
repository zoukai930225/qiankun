type ImplementationType = 'view' | 'edit' | 'add' | 'approval'; // 定义允许的类型

interface ImplementationMap {
  view?: (...args: any[]) => any;
  edit?: (...args: any[]) => any;
  add?: (...args: any[]) => any;
  approval?: (...args: any[]) => any;
}

export const executableVerification = (implementations: ImplementationMap, type: ImplementationType = 'view') => {
  return (...args: any[]) => {
    const implementation = implementations[type];

    if (implementation && typeof implementation === 'function') {
      return implementation(...args);
    } else {
      throw new Error(`未找到 ${type} 类型的方法实现`);
    }
  };
};

export const viewTypeCheck = (type: string = 'view', substitute: Array<any> = []) => {
  const list: any = [...[
    { type: 'view', label: '详情' },
    { type: 'add', label: '新增' },
    { type: 'edit', label: '编辑' },
    { type: 'approval', label: '审批' },
  ], ...substitute];
  const uniqueData = list.reverse().reduce((acc: any, curr: any) => {
    if (!acc.some(item => item.type === curr.type)) {
      acc.push(curr);
    }
    return acc;
  }, []).reverse();
  const tar: any = uniqueData.find((li: any) => li.type === type);
  return tar?.label || '详情';
};
