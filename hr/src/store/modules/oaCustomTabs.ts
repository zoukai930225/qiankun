/*
 * @Date: 2025-03-27 17:37:55
 */
import { defineStore } from 'pinia'

export const oaCustomTabsStore = defineStore('oaCustomTabs', {
  state: (): { tabs: any, npDesignPictureGodownDtos: any } => ({
    tabs: [],
    npDesignPictureGodownDtos: [],
  }),

})

export const oaCustomTabsStorePackage = defineStore('oaCustomTabsPackage', {
  state: (): { tabs: any, records: any } => ({
    tabs: [],
    records: [],
  }),
  // state: (): { tabs: any; npDesignPictureGodownDtos: any } => ({
  //   tabs: [],
  //   npDesignPictureGodownDtos: []
  // })
})
