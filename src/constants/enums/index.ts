export enum ERole {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export enum EStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  FRIENDS = 'FRIENDS'
}

export enum EPagination {
  PAGE = 1,
  LIMIT = 24
}

export enum ESortPostField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt'
}

export enum ESortDirection {
  ASC = 'asc',
  DESC = 'desc'
}
