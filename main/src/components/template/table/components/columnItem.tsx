import { defineComponent, resolveComponent, h } from 'vue';
import { ElTableColumn } from 'element-plus';
import { Column } from '../../config/type';
import HeaderLine from "./headerLine.vue";
import LineTxt from "./lineTxt.vue";

const tableWidthInit = (col: any) => {
  const length = col.title?.length * 14.25 + 38 + 25;
  return length > (col.width || 120) ? Math.ceil(length) : col.minWidth;
};

const widthProps = (col: Column) => {
  let obj: any = {};
  if (col.minWidth) {
    obj = { minWidth: tableWidthInit(col) };
  } else {
    obj = { width: col.width || '' };
  }
  return obj;
};

const textShadow = (scope: any, col: Column) => { return String(!['', null, undefined].includes(scope.row[col.field]) ? scope.row[col.field] : '-') };

const renderColumn = (col: any, name: any) => {

  return (
    <>
      <ElTableColumn  {...widthProps(col)} show-overflow-tooltip={col.isFormatter}
        property={col.field} label={col.title} align={col.align} fixed={col.fixed || null} sortable={col.sort}
        formatter={col.formatter}>
        {{
          header: () => (
            <HeaderLine info={col} />
          ),
          default: (scope: any) => {
            if (col?.children?.length) {
              return col.children.map((cli: any) => renderColumn(cli, name));
            }

            if (!col.isCustom && !col.isFormatter) {
              return (
                <LineTxt
                  txt={textShadow(scope, col)}
                  name={name}
                  class={'line-text'}
                  isCopy={col.isCopy}
                  isClick={col.isClick}
                  style={col.style}
                  icon={col.icon}
                  info={{ scope, col }}
                />
              );
            }

            if (col.isCustom && !col.isFormatter && col.customRender) {
              const CustomComponent = col.customRender(scope.row, scope);

              if (typeof CustomComponent === 'string') {
                const ResolvedComponent = resolveComponent(CustomComponent);
                return h(ResolvedComponent, {
                  modelValue: scope.row[col.field],
                  ...col.componentProps,
                  'onUpdate:modelValue': (value: any) => {
                    scope.row[col.field] = value;
                  }
                });
              } else {
                return h(CustomComponent, {
                  modelValue: scope.row[col.field],
                  ...col.componentProps,
                  'onUpdate:modelValue': (value: any) => {
                    scope.row[col.field] = value;
                  }
                });
              }
            }
            return null;
          }
        }}
      </ElTableColumn >
    </>
  )
};

export default defineComponent({
  name: 'ColumnItem',
  props: { column: Object, name: String },
  setup(props) {
    return () => (
      <>
        {renderColumn(props.column, props.name)}
      </>
    );
  }
});