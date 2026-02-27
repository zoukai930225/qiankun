export  interface IDrawerService {
  /**
   * 提交方法
   */
  submit: (successCallback?: () => void,handleLoading?:(val:boolean) => void) =>  void | Promise<void>
  /**
   * 检查是否有未保存的修改
   */
  beforCancel: () => boolean | Promise<boolean>
}