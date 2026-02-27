export function pickUserId(u: any): string | undefined {
  const id = u?.userId ?? u?.id ?? u?.assessmentUserId
  return id != null && id !== '' ? String(id) : undefined
}

export function hasAssessors(val: any): boolean {
  if (!val) return false
  return Array.isArray(val) ? val.length > 0 : pickUserId(val) != null
}
