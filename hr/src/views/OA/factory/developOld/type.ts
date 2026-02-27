export interface TabsProvideType {
    permissionList: Ref<Array<any>>;
    roleList: Ref<Array<any>>;
    getList: () => void;
    grabCheck: (name: string) => Boolean;
}