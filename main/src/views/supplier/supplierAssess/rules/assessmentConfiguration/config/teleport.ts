// Centralized teleport targets for assessment configuration module
export const TELEPORT_IDS = {
  searchRowId: 'supplier-assessment-configuration-search-row',
  footerId: 'supplier-assessment-configuration-footer'
} as const

export const TELEPORT_SELECTORS = {
  searchRow: `#${TELEPORT_IDS.searchRowId}`,
  footer: `#${TELEPORT_IDS.footerId}`
} as const

export type TeleportSelectors = typeof TELEPORT_SELECTORS
export type TeleportIds = typeof TELEPORT_IDS
