import { InjectionKey, provide, inject, ref, type Ref } from 'vue'
import type { LabelSelectOption } from '@/components/Form/src/components/useRenderLabelSelectInput'

export interface AssessmentSearchProvide {
  selectedField: Ref<string>
  labelSelectOptions: LabelSelectOption[]
  labelSelectLabelWidth: string | number
}

const assessmentSearchProvideKey: InjectionKey<AssessmentSearchProvide> = Symbol(
  'assessmentSearchProvideKey'
)

export function provideAssessmentSearchConfig(
  init?: Partial<AssessmentSearchProvide>
): AssessmentSearchProvide {
  const selectedField = init?.selectedField ?? ref<string>('abbreviationCompany')
  const labelSelectOptions = init?.labelSelectOptions ?? [
    {
      label: '供应商简称',
      field: 'abbreviationCompany',
      placeholder: '请输入供应商简称',
      active: true
    },
    { label: '公司名称', field: 'fullCompany', placeholder: '请输入公司名称' }
  ]
  const labelSelectLabelWidth = init?.labelSelectLabelWidth ?? 90

  const value: AssessmentSearchProvide = {
    selectedField,
    labelSelectOptions,
    labelSelectLabelWidth
  }
  provide(assessmentSearchProvideKey, value)
  return value
}

export function useAssessmentSearchConfig(): AssessmentSearchProvide | null {
  return inject(assessmentSearchProvideKey, null as any)
}
