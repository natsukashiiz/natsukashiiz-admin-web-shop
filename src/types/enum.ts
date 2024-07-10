export enum OrderStatus {
  pending,
  paid,
  successful,
  failed,
  self_canceled,
  system_canceled
}

export enum DiscountType {
  percent,
  amount
}

export enum SocialProviders {
  facebook,
  google
}

export enum AdminRoles {
  admin,
  super_admin
}

export enum VoucherStatus {
  active,
  inactive
}

export enum PostStatus {
  draft = 'draft',
  published = 'published',
  archived = 'archived'
}
