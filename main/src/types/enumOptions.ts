// ++++++++++++++++++ 小红书模块 ++++++++++++++++++
/**
 * 小红书文章类型枚举
 */
export const XhsNoteTypeOptions = [
  {
    label: '素人',
    value: 1
  },
  {
    label: '共创',
    value: 2
  },
  {
    label: '第三方',
    value: 3
  }
]

export const XhsNoteTypeName = (noteType: number) => {
  let name = '-'
  XhsNoteTypeOptions.forEach((item) => {
    if (noteType === item.value) name = item.label
  })
  return name
}

/**
 * 通用状态
 */
export const CommonStatusOptions = [
  {
    label: '启用',
    value: 1
  },
  {
    label: '禁用',
    value: 0
  }
]
export const CommonStatusName = (type: number) => {
  let name = '-'
  CommonStatusOptions.forEach((item) => {
    if (type === item.value) name = item.label
  })
  return name
}
/**
 * 菜单类型
 */
export const MenuTypeOptions = [
  {
    label: '目录',
    value: 1
  },
  {
    label: '菜单',
    value: 2
  },
  {
    label: '按钮',
    value: 3
  }
]
export const menuTypeName = (menuType: number) => {
  let name = '-'
  MenuTypeOptions.forEach((item) => {
    if (menuType === item.value) name = item.label
  })
  return name
}

/**
 * 用户性别
 */
export const UserSexOptions = [
  {
    label: '男',
    value: 1
  },
  {
    label: '女',
    value: 2
  }
]
export const UserSexName = (type: number) => {
  let name = '-'
  UserSexOptions.forEach((item) => {
    if (type === item.value) name = item.label
  })
  return name
}

/**
 * 是否
 */
export const CommonYesOrNoOptions = [
  {
    label: '是',
    value: 1
  },
  {
    label: '否',
    value: 0
  }
]
export const CommonYesOrNoName = (type: number) => {
  let name = '-'
  CommonYesOrNoOptions.forEach((item) => {
    if (type === item.value) name = item.label
  })
  return name
}
