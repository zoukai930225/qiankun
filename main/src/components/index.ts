import QueryScheme from "@/components/template/query/queryScheme.vue";
import SchemeDialog from "@/components/template/details/windows.vue";
import SchemeDetails from "@/components/template/details/index.vue";
import SearchCard from '@/components/common/content/searchCard.vue';
import ExScreen from "@/components/common/content/exScreen.vue";
import SchemeTable from "@/components/template/table/index.vue";
import { SWSearchForm, Form as SForm } from './Form';
import { STable } from './SWTable';
import type { App } from 'vue';
import { Icon } from './Icon';

export const setupGlobCom = (app: App<Element>): void => {
  app.component('SchemeDetails', SchemeDetails)
  app.component('SchemeDialog', SchemeDialog)
  app.component('SWSearchForm', SWSearchForm)
  app.component('QueryScheme', QueryScheme)
  app.component('SchemeTable', SchemeTable)
  app.component('SearchCard', SearchCard)
  app.component('ExScreen', ExScreen)
  app.component('STable', STable)
  app.component('SForm', SForm)
  app.component('Icon', Icon)
}
