import { ElSubMenu, ElMenuItem } from "element-plus";
import { defineComponent } from 'vue';

const pathIndex = (item: any) => {
  return `${item?.pPath || ''}${item.path[0] === '/' ? '' : '/'}${item.path}`;
};

const renderItem = (menu: any) => {
  const list: any = menu?.children?.filter((item: any) => item.visible) || [];
  return (
    <>
      {list.map((ms: any) => (
        ms?.children?.length ? (
          <ElSubMenu index={pathIndex(ms)} >
            {{
              title: () => (
                <span>{ms.name}</span>
              ),
              default: () => renderItem(ms)
            }}

          </ElSubMenu>
        ) : (
          <ElMenuItem index={pathIndex(ms)} >
            {{
              title: () => (
                <span>{ms.name}</span>
              )
            }}
          </ElMenuItem>
        )
      ))}
    </>
  )
}

export default defineComponent({
  name: 'ChildMenu',
  props: { menuInfo: Object },
  setup(props) {
    return () => (
      <>
        {renderItem(props.menuInfo)}
      </>
    );
  }
});