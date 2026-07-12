export const normalizeRole = (role) => {
  if (typeof role !== 'string') return ''
  return role.trim().toUpperCase()
}

export const isAdminRole = (role) => normalizeRole(role) === 'ADMIN'
