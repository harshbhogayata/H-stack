export const PERMISSIONS = {
  CUSTOMER_VIEW: 'customer.view',
  CUSTOMER_EDIT: 'customer.edit',
  ACCOUNT_FREEZE: 'account.freeze',
  DATA_EXPORT: 'data.export',
  PROFILE_EDIT_SELF: 'profile.edit.self',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export function requirePermission(staff: { permissions: Permission[] }, permission: Permission) {
  if (!staff.permissions.includes(permission)) {
    throw new Error(`Permission required: ${permission}`);
  }
}
