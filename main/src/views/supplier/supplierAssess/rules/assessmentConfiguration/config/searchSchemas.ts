import type { FormSchema } from '@/types/form'

// 作为查询表单数组的第一项：可切换字段的输入框
export const labelSelectInputFirstItem: FormSchema = {
  field: '',
  component: 'LabelSelectInput',
  componentProps: {
    trigger: 'click',
    clearOnSwitch: true,
    labelWidth: 90,
    options: [
      {
        label: '供应商简称',
        field: 'abbreviationCompany',
        placeholder: '请输入供应商简称',
        active: true
      },
      { label: '公司名称', field: 'fullCompany', placeholder: '请输入公司名称' }
    ]
  }
}
