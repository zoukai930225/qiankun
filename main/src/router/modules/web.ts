import { Layout } from '@/utils/routerHelper'

const { t } = useI18n()
const webRouter: AppRouteRecordRaw[] = [
  {
    path: '/admin/VD/gallery/web',
    component: () => import('@/views/web/visualGallery/index.vue'),
    name: 'VisualGallery',
    meta: {
      hidden: true,
      title: '视觉图库',
      noTagsView: true
    }
  }
]

export default webRouter
