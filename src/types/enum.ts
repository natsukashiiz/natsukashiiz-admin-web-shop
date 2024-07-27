export enum OrderStatus {
  pending = 'pending',
  paid = 'paid',
  shipping = 'shipping',
  successful = 'successful',
  failed = 'failed',
  self_canceled = 'self_canceled',
  seller_canceled = 'seller_canceled',
  system_canceled = 'system_canceled'
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
  super_admin = 'super_admin',
  admin = 'admin'
}

export enum CommonStatus {
  active = 'active',
  inactive = 'inactive',
  deleted = 'deleted'
}
