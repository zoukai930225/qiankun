export interface IDirectDialogService{
  submit: (successCallback?: () => void) =>  void | Promise<void>
}