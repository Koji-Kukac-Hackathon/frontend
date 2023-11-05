export type User = {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
  name: string | null
  email: string
  emailVerifiedAt: string | null
  role: string
}

export type AuthUser = {
  name: string
  email: string
  role: string
}
