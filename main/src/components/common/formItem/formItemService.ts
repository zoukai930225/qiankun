

import type { FormItemProps } from 'element-plus'

// type formItemPropsOmit = Omit<FormItemProps, 'prop' |'label'|'placeholder'|'required'>

interface CustomProps  {
    customRules?: any[],
    validateTrigger?: string[]
    pattern?: string | RegExp
    patternMessage?: string
}
export interface swFormItemProps extends CustomProps,FormItemProps{}



export const computedRulesFn = (props) => {
   console.log("computedRulesFn",props)
  const rules = [...props.customRules]

  if (props.required) {
    rules.push({
      required: true,
      message: props.errorText || `请输入${props.label || props.prop}`,
      trigger: props.validateTrigger
    })
  }

  if (props.pattern) {
    let regex = props.pattern
    if (typeof regex === 'string') {
      regex = new RegExp(regex)
    }

    rules.push({
      validator: (rule: any, value: any, callback: any) => {
        if (!value || regex.test(String(value))) {
          callback()
        } else {
          callback(new Error(props.patternMessage))
        }
      },
      trigger: props.validateTrigger
    })
  }

  return rules
}