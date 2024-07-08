export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  SELF_CANCELED = 'SELF_CANCELED',
  SYSTEM_CANCELED = 'SYSTEM_CANCELED'
}

export enum DiscountType {
  PERCENT = 'PERCENT',
  AMOUNT = 'AMOUNT'
}

export enum SocialProviders {
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE'
}

export enum AdminRoles {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum VoucherStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
