import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import LineTages from '@/components/template/table/components/lineTage.vue'
import UserScreen from '@/components/common/user/userScreen.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import dayjs from 'dayjs'
import { ElButton, ElCheckbox, ElTooltip, ElCascader } from 'element-plus'
import { placeholderMap } from '@/views/OA/new/product/utils'
import HeaderLine from '@/components/template/table/components/headerLine.vue'

export class SearchItem {
  name: string = ''
  firstDepartIds: Array<string> = []
  khzq: string = dayjs().add(-1, 'month').format('YYYY-MM')
  sftb: Array<number> = []
  isStop: number | null = null
  userId: any = ''
  isSub: boolean = false
}

export class DataItem {
  name: string = ''
  userId: string = ''
  firstDepartId: string = ''
  firstDepart: string = ''
  secondDepart: string = ''
  departId: string = ''
  departName: string = ''
  khzq: string = ''
  nl: string = ''
  ql: string = ''
  jzg: string = ''
  isStop: number = 0
  sftb: number = 0
  remark: string = ''
  id: string = ''
  tx: string = ''
  tdzjz: string = ''
  zdx: string = ''
  gnsw: string = ''
  questions: any = ''
  yxl: string = ''
  cjdx: string = ''
  jrx: string = ''
}

export const otherOptions = [
  {
    label: '3',
    value: '3',
    color: '#349B34',
    background: 'rgba(52, 155, 52, 0.2)'
  },
  {
    label: '2',
    value: '2',
    color: '#0064FF',
    background: 'rgba(0, 100, 255, 0.2)'
  },
  {
    label: '1',
    value: '1',
    color: '#CD8200',
    background: '#FFF4C8'
  },
  {
    label: '0',
    value: '0',
    color: '#EB3737',
    background: 'rgba(235, 55, 55, 0.2)'
  }
]

export const usePage = (params: any = {}) => {
  const route = useRoute()

  const { userInfo, options, dicInfo, onButtonClick } = params

  const dataList = ref<Array<DataItem>>([]),
    stateInfo = ref<any>({}),
    statistics = ref<any>({}),
    directSubs = ref([])

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem() })

  const scheme = computed(() => {
    const name: any = { field: 'name', label: '姓名' }
    const khzq: any = {
      field: 'khzq',
      label: '考核周期',
      component: 'DatePicker',
      componentProps: {
        type: 'month',
        valueFormat: 'YYYY-MM',
        format: 'YYYY-MM',
        clearable: false,
        editable: false,
        disabledDate: (time: Date) =>
          time.getTime() > new Date(dayjs().add(-1, 'month').format('YYYY-MM')).getTime()
      }
    }
    const stop: any = {
      field: 'isStop',
      label: '封版状态',
      component: 'Select',
      options: [
        { label: '已封版', value: 1 },
        { label: '未封版', value: 0 }
      ],
      componentProps: { clearable: true }
    }
    const directSuperior: any = {
      field: 'userId',
      label: '直属上级',
      isCustom: true,
      customRender: (_item: any) => (
        <UserScreen item={searchData.value} id="userId" name="userName"></UserScreen>
      )
    }
    const directSubordinate: any = {
      field: 'isSub',
      label: ['是否', '直属下级'],
      component: 'Select',
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      componentProps: { clearable: true, placeholder: '请选择是否直属下级' }
    }
    const nl: any = {
      field: 'nl',
      label: '能力',
      component: 'Select',
      options: dicInfo.value,
      componentProps: {
        clearable: true,
        placeholder: '请选择能力',
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true
      }
    }

    const ql: any = {
      field: 'ql',
      label: '潜力',
      component: 'Select',
      options: dicInfo.value,
      componentProps: {
        clearable: true,
        placeholder: '请选择潜力',
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true
      }
    }

    const jzg: any = {
      field: 'jzg',
      label: '价值观',
      component: 'Select',
      options: dicInfo.value,
      componentProps: {
        clearable: true,
        placeholder: '请选择价值观',
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true
      }
    }

    const tdzjz: any = {
      field: 'tdzjz',
      label: ['团队中价', '值'],
      component: 'Select',
      options: dicInfo.value,
      componentProps: {
        clearable: true,
        placeholder: '请选择团队中价值',
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true
      }
    }

    const zdx: any = {
      field: 'zdx',
      label: '主动性',
      component: 'Select',
      options: otherOptions,
      componentProps: {
        clearable: true,
        placeholder: '请选择主动性',
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true
      }
    }

    const gnsw: any = {
      field: 'gnsw',
      label: '概念思维',
      component: 'Select',
      options: otherOptions,
      componentProps: {
        clearable: true,
        placeholder: '请选择概念思维',
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true
      }
    }

    const yxl: any = {
      field: 'yxl',
      label: '影响力',
      component: 'Select',
      options: otherOptions,
      componentProps: {
        clearable: true,
        placeholder: '请选择影响力',
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true
      }
    }

    const cjdx: any = {
      field: 'cjdx',
      label: '成就导向',
      component: 'Select',
      options: otherOptions,
      componentProps: {
        clearable: true,
        placeholder: '请选择成就导向',
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true
      }
    }

    const jrx: any = {
      field: 'jrx',
      label: '坚韧性',
      component: 'Select',
      options: otherOptions,
      componentProps: {
        clearable: true,
        placeholder: '请选择坚韧性',
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true
      }
    }

    const casProps = {
      label: 'name',
      value: 'id',
      children: 'children',
      checkStrictly: false,
      multiple: true
    }
    const data = !!userInfo.value.isManagement
      ? [
          name,
          {
            field: 'firstDepartIds',
            label: '部门',
            isCustom: true,
            customRender: (_item, _model) => (
              <ElCascader
                collapse-tags-tooltip={true}
                show-all-levels={false}
                collapse-tags={true}
                options={options.value}
                props={casProps}
              />
            )
          },
          khzq,
          stop,
          nl,
          ql,
          jzg,
          tdzjz,
          zdx,
          gnsw,
          yxl,
          cjdx,
          jrx
        ]
      : [name, khzq, stop, nl, ql, jzg, tdzjz, zdx, gnsw, yxl, cjdx, jrx]
    if (!!userInfo.value.isHrbp) {
      data.splice(1, 0, {
        field: 'departName',
        label: '部门名称'
      })
      data.push(directSuperior)
    } else {
      data.push(directSubordinate)
    }
    return data
  })

  const screen = computed(() => ({
    ...new Screen({
      field: 'sftb',
      label: '填报状态:',
      options: [
        { label: '已填报', value: 1 },
        { label: '未填报', value: 0 }
      ],
      props: {}
    })
  }))

  const btns = computed(() => [
    { fun: 'board', txt: '数据看板', disabled: () => !dataList?.value?.length },
    { fun: 'seal', txt: '数据封版', display: () => !userInfo.value.isHrbp },
    { fun: 'solution', txt: '数据解封', display: () => !userInfo.value.isManagement },
    {
      fun: 'export',
      txt: '导出',
      type: 'primary',
      api: `/api/employeeMonthlyAssessment/exportList`,
      method: 'downloadPost',
      exportName: '月度考核'
    },
    {
      fun: 'quickEdit',
      txt: '快速填报',
      type: 'primary',
      isCustom: true,
      customRender: () =>
        directSubs.value &&
        directSubs.value.length && (
          <ElTooltip content="快速填报直属下级数据" width={150} placement="top-end">
            <ElButton type="primary" onClick={quickEdit}>
              快速填报
            </ElButton>
          </ElTooltip>
        )
    }
  ])

  const column = computed(() => [
    {
      field: 'name',
      title: '姓名',
      width: 110,
      fixed: 'left',
      isCustom: true,
      customRender: (_item) => <LineAvatar user={{ name: _item.name, avatarOrigin: _item.tx }} />
    },
    { field: 'firstDepart', title: '一级部门', width: 120 },
    { field: 'secondDepart', title: '二级部门', width: 120 },
    { field: 'khzq', title: '考核周期', width: 100 },
    {
      title: '月度考核',
      align: 'center',
      children: [
        {
          field: 'nl',
          title: '能力',
          tipsWidth: 412,
          tips: tipsInfo.nl,
          width: 100,
          isCustom: true,
          customRender: (_item) => (
            <LineTages
              txt={getDicInfo(dicInfo.value, _item.nl, 'label')}
              background={getDicInfo(dicInfo.value, _item.nl, 'background')}
              color={getDicInfo(dicInfo.value, _item.nl, 'color')}
            />
          )
        },
        {
          field: 'ql',
          title: '潜力',
          tipsWidth: 416,
          tips: tipsInfo.ql,
          width: 100,
          isCustom: true,
          customRender: (_item) => (
            <LineTages
              txt={getDicInfo(dicInfo.value, _item.ql, 'label')}
              background={getDicInfo(dicInfo.value, _item.ql, 'background')}
              color={getDicInfo(dicInfo.value, _item.ql, 'color')}
            />
          )
        },
        {
          field: 'jzg',
          title: '价值观',
          tipsWidth: 416,
          tips: tipsInfo.jzg,
          width: 100,
          isCustom: true,
          customRender: (_item) => (
            <LineTages
              txt={getDicInfo(dicInfo.value, _item.jzg, 'label')}
              background={getDicInfo(dicInfo.value, _item.jzg, 'background')}
              color={getDicInfo(dicInfo.value, _item.jzg, 'color')}
            />
          )
        },
        {
          field: 'tdzjz',
          title: '团队中价值',
          tipsWidth: 416,
          tips: tipsInfo.tdzjz,
          width: 120,
          isCustom: true,
          customRender: (_item) => (
            <LineTages
              txt={getDicInfo(dicInfo.value, _item.tdzjz, 'label')}
              background={getDicInfo(dicInfo.value, _item.tdzjz, 'background')}
              color={getDicInfo(dicInfo.value, _item.tdzjz, 'color')}
            />
          )
        },
        {
          field: 'dcsfpy',
          title: '当初是否聘用',
          tipsWidth: 416,
          tips: tipsInfo.dcsfpy,
          width: 130,
          isFormatter: true,
          formatter: (_item) => {
            let val
            if(_item.questions) {
              const questions = JSON.parse(_item.questions)
              val = questions[0]['value']
            }
            return val ? (val === '0' ? '否' : '是') : '-'
          }
        },
        {
          field: 'xzsfwl',
          title: '现在是否挽留',
          tipsWidth: 416,
          tips: tipsInfo.xzsfwl,
          width: 130,
          isFormatter: true,
          formatter: (_item) => {
            let val
            if(_item.questions) {
              const questions = JSON.parse(_item.questions)
              val = questions[1]['value']
            }
            return val ? (val === '0' ? '否' : '是') : '-'
          }
        }
      ]
    },
    { field: 'remark', title: '备注', minWidth: 264 },
    {
      title: '人才标签',
      align: 'center',
      children: [
        {
          field: 'zdx',
          title: '主动性',
          tipsWidth: 416,
          tips: tipsInfo.zdx,
          width: 100,
          isCustom: true,
          customRender: (_item) => (
            <LineTages
              txt={getDicInfo(otherOptions, _item.zdx, 'label')}
              background={getDicInfo(otherOptions, _item.zdx, 'background')}
              color={getDicInfo(otherOptions, _item.zdx, 'color')}
            />
          )
        },
        {
          field: 'gnsw',
          title: '概念思维',
          tipsWidth: 416,
          tips: tipsInfo.gnsw,
          width: 100,
          isCustom: true,
          customRender: (_item) => (
            <LineTages
              txt={getDicInfo(otherOptions, _item.gnsw, 'label')}
              background={getDicInfo(otherOptions, _item.gnsw, 'background')}
              color={getDicInfo(otherOptions, _item.gnsw, 'color')}
            />
          )
        },
        {
          field: 'yxl',
          title: '影响力',
          tipsWidth: 416,
          tips: tipsInfo.yxl,
          width: 100,
          isCustom: true,
          customRender: (_item) => (
            <LineTages
              txt={getDicInfo(otherOptions, _item.yxl, 'label')}
              background={getDicInfo(otherOptions, _item.yxl, 'background')}
              color={getDicInfo(otherOptions, _item.yxl, 'color')}
            />
          )
        },
        {
          field: 'cjdx',
          title: '成就导向',
          tipsWidth: 416,
          tips: tipsInfo.cjdx,
          width: 100,
          isCustom: true,
          customRender: (_item) => (
            <LineTages
              txt={getDicInfo(otherOptions, _item.cjdx, 'label')}
              background={getDicInfo(otherOptions, _item.cjdx, 'background')}
              color={getDicInfo(otherOptions, _item.cjdx, 'color')}
            />
          )
        },
        {
          field: 'jrx',
          title: '坚韧性',
          tipsWidth: 416,
          tips: tipsInfo.jrx,
          width: 100,
          isCustom: true,
          customRender: (_item) => (
            <LineTages
              txt={getDicInfo(otherOptions, _item.jrx, 'label')}
              background={getDicInfo(otherOptions, _item.jrx, 'background')}
              color={getDicInfo(otherOptions, _item.jrx, 'color')}
            />
          )
        }
      ]
    },
    {
      field: 'sftbTxt',
      title: '填报状态',
      width: 90,
      isFormatter: true,
      formatter: (_item) => (_item.sftb === 1 ? '已填报' : '未填报')
    },
    {
      field: 'isStop',
      title: '封版状态',
      width: 90,
      isFormatter: true,
      formatter: (_item) => (_item.isStop === 1 ? '已封版' : '未封版')
    },
    {
      field: 'managerName',
      title: '直属上级',
      width: 110,
      isCustom: true,
      customRender: (_item) => (
        <LineAvatar user={{ name: _item.managerName, avatarOrigin: _item.sjtx }} />
      )
    },
    {
      field: 'hrName',
      title: 'HRBP',
      width: 110,
      isCustom: true,
      customRender: (_item) => (
        <LineAvatar user={{ name: _item.hrName, avatarOrigin: _item.hrtx }} />
      )
    }
  ])

  const handleColumn = computed(() => [
    {
      fun: 'edit',
      txt: '填报',
      reveal: (_item) =>
        !!userInfo?.value?.isManagement ? true : !_item.isStop && !!_item?.isSubordinate
    },
    {
      fun: 'view',
      txt: '详情',
      reveal: (_item) =>
        !(!!userInfo?.value?.isManagement ? true : !_item.isStop && !!_item?.isSubordinate)
    },
    { fun: 'record', txt: '填报记录' }
  ])

  const getDicInfo = (dict: any, value: any, name: string = 'color') => {
    const tar: any = dict.find((dic: any) => dic.value === value)
    return tar && tar[name] ? tar[name] : ''
  }

  const setRouterInfo = () => {
    let params: Object = {}
    const param: any = route.params
    const query: any = route.query
    Object.keys(param).forEach((key) => {
      params[key] = param[key]
    })
    Object.keys(query).forEach((key) => {
      params[key] = query[key]
    })
    if (Object.keys(params).length !== 0) {
      searchData.value = { ...searchData.value, ...params }
      const newUrl = window.location.href.replace(/\?.*$/, '')
      history.replaceState({}, '', newUrl)
    }
  }

  const quickEdit = () => {
    onButtonClick({ fun: 'quickEdit' })
  }

  return {
    dataList,
    directSubs,
    searchData,
    loading,
    page,
    scheme,
    btns,
    column,
    screen,
    stateInfo,
    statistics,
    handleColumn,
    setRouterInfo
  }
}

export const tipsInfo = {
  nl: `
        <p style="width: 392px;padding-bottom: 10px;word-break: break-all;">很好: 远超要求。技能精通，能解决复杂问题，工作成果突出，是团队标杆。</p>
        <p style="width: 392px;padding-bottom: 10px;word-break: break-all;">比较好: 满足要求。能独立熟练完成工作，处理常见问题，稳定可靠。</p>
         <p style="width: 392px;padding-bottom: 10px;word-break: break-all;">一般: 基本合格。具备基础技能，但处理疑难问题时需指导，有提升空间。 </p>
         <p style="width: 392px;padding-bottom: 0;word-break: break-all;">差: 未达要求。技能不足，工作常出疏漏，需他人补救。 </p>`,
  ql: `
          <p style="width: 392px;padding-bottom: 10px;word-break: break-all;">很好: 潜力巨大。学习速度快，有战略眼光，主动挑战，具备未来领导者潜质。 </p>
          <p style="width: 392px;padding-bottom: 10px;word-break: break-all;">比较好: 有发展潜力。学习能力强，能思考改进，愿意承担更多职责。 </p>
          <p style="width: 392px;padding-bottom: 10px;word-break: break-all;">一般: 成长平稳。能完成学习任务，但主动性一般，暂未显现更高潜质。 </p>
          <p style="width: 392px;padding-bottom: 0;word-break: break-all;">差: 停滞不前。拒绝新事物，安于现状，缺乏上进心。 </p>`,
  jzg: `
          <p style="width: 392px;padding-bottom: 10px;word-break: break-all;">很好: 文化楷模。以身作则，积极影响团队，坚守原则，有主人翁精神。 </p>
          <p style="width: 392px;padding-bottom: 10px;word-break: break-all;">比较好: 符合期待。言行一致，乐于合作，诚实守信，是合格团队成员。 </p>
          <p style="width: 392px;padding-bottom: 10px;word-break: break-all;">一般: 基本符合。大体遵循，但偶有不足或需提醒。 </p>
          <p style="width: 392px;padding-bottom: 0;word-break: break-all;">差: 严重背离。言行不一，破坏团队氛围，或有违规行为。 </p>`,
  tdzjz: `
          <p style="width: 392px;padding-bottom: 10px;word-break: break-all;">很好: 离开将造成显著损失。 </p>
          <p style="width: 392px;padding-bottom: 10px;word-break: break-all;">比较好: 对团队有一般影响。 </p>
          <p style="width: 392px;padding-bottom: 10px;word-break: break-all;">一般: 对团队无影响。 </p>
          <p style="width: 392px;padding-bottom: 0;word-break: break-all;">差: 短期无影响,伙伴的离开不会影响进度,长期会对团队更好。 </p>`,
  dcsfpy: `<p>如果这个时候让你再做一次当初聘用的选择,你还会聘用他/她吗?</p>`,
  xzsfwl: `<p>如果这个人这时候对说他/她要离职,你非常想挽留他/她吗?</p>`,
  zdx: `
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">0: 没有主动。 </p>
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">1: 主动行动。 </p>
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">2: 主动思考,快速行动。 </p>
         <p style="width: 392px;padding-bottom: 0;word-break:break-all;">3: 未雨绸缪。 </p>`,
  gnsw: `
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">0: 不能准确周密思考问题,想不清楚,弄不明白。 </p>
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">1: 简单类比。 </p>
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">2: 触类旁通作用复杂的概念,以点带面掌握事物发展规律。 </p>
         <p style="width: 392px;padding-bottom: 0;word-break:break-all;">3: 深入浅出,复杂事物一眼看破,掌握,也能让别人一眼看懂。 </p>`,
  yxl: `
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">0: 不能清楚表达,说服他人,盲从他人。 </p>
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">1: 能用简单道理说服,争理说服别人。 </p>
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">2: 能换位思考别人需要什么。 </p>
         <p style="width: 392px;padding-bottom: 0;word-break:break-all;">3: 综合策略智慧影响他人不需要做什么,但是你还是按着我说的去做,围魏救赵。 </p>`,
  cjdx: `
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">0: 安于现状,不求进步,被盯着工作,不想承担压力。 </p>
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">1: 努力做的更好,或者某项成就,工匠精神,天生想做更好。 </p>
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">2: 自己设置具有挑战性目标,自己给自己设置,为自己设置更好的目标进步,不需要被设置。 </p>
         <p style="width: 392px;padding-bottom: 0;word-break:break-all;">3: 仔细权衡,有冒险精神,做大的改变,做一件有挑战有意义的事情。 </p>`,
  jrx: `
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">0: 接受不了批评,压力,挫折,很容易放弃。 </p>
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">1: 压不垮,能承受压力,但未必搞得成。 </p>
         <p style="width: 392px;padding-bottom: 10px;word-break:break-all;">2: 能承受压力,并且在艰苦奋斗环境下,完成任务。 </p>
         <p style="width: 392px;padding-bottom: 0;word-break:break-all;">3: 通过建设性方式,化解压力解除压力,完成任务。 </p>
        `
}
