export enum OrderStatus {
  pending,
  paid,
  successful,
  failed,
  self_canceled,
  system_canceled
}

export enum DiscountType {
  percent = 'percent',
  amount = 'amount'
}

export enum SocialProviders {
  facebook,
  google
}

export enum AdminRoles {
  admin,
  super_admin
}

export enum CommonStatus {
  active = 'active',
  inactive = 'inactive',
  deleted = 'deleted'
}
