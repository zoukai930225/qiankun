type Record = {
  id: string
  company?: any
  isDeleted?: any
  createdAt: Date
  createdId?: any
  updatedAt?: any
  updatedId?: any
  companyName?: any
  recordChangeDataFlag: boolean
  category?: any
  categoryName: string
  type?: any
  typeName: string
  handleDept?: any
  deptName: string
  directorId?: any
  directorName: string
  avatarOrigin: string
  createUserName: string
  createAvatarOrigin: string
}
type userId = {
  userId: string
  userName: string
  realName: string
  dept: string
  company: string
  storeCount: string
  roleCount: string
  accountType: string
  avatarOrigin:string
}

// 导出类型
export type { Record,userId }
