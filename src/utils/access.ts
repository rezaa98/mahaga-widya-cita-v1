import type { Access, AccessResult } from 'payload'

/**
 * Roles are deliberately kept independent from generated Payload types so they
 * can be used in collection config, route handlers, and hooks before types are
 * regenerated.
 *
 * `member` is retained only for existing accounts created before Sprint 1. It
 * has read-only access to the CMS and should be migrated to a named role.
 */
export const USER_ROLES = ['super_admin', 'admin', 'editor', 'reviewer', 'member'] as const

export type UserRole = (typeof USER_ROLES)[number]

export type Capability =
  | 'accessAdmin'
  | 'manageUsers'
  | 'manageSiteContent'
  | 'manageContent'
  | 'reviewContent'
  | 'publishContent'
  | 'manageMedia'
  | 'viewAudience'
  | 'manageAudience'

type UserLike = { id?: number | string; role?: unknown } | null | undefined
type RequestWithUser = { user?: UserLike }

const capabilityMatrix: Record<UserRole, readonly Capability[]> = {
  super_admin: [
    'accessAdmin',
    'manageUsers',
    'manageSiteContent',
    'manageContent',
    'reviewContent',
    'publishContent',
    'manageMedia',
    'viewAudience',
    'manageAudience',
  ],
  admin: [
    'accessAdmin',
    'manageUsers',
    'manageSiteContent',
    'manageContent',
    'reviewContent',
    'publishContent',
    'manageMedia',
    'viewAudience',
    'manageAudience',
  ],
  editor: ['accessAdmin', 'manageContent', 'manageMedia'],
  reviewer: ['accessAdmin', 'reviewContent'],
  member: ['accessAdmin'],
}

export function getUserRole(user: UserLike): UserRole | null {
  if (!user || typeof user.role !== 'string') return null

  return (USER_ROLES as readonly string[]).includes(user.role)
    ? (user.role as UserRole)
    : null
}

export function hasCapability(user: UserLike, capability: Capability): boolean {
  const role = getUserRole(user)
  return role ? capabilityMatrix[role].includes(capability) : false
}

export function isAdminUser(user: UserLike): boolean {
  return hasCapability(user, 'accessAdmin')
}

/** Server-side utility routes are reserved for operational administrators. */
export function isAdminApiUser(user: UserLike): boolean {
  const role = getUserRole(user)
  return role === 'super_admin' || role === 'admin'
}

export function canManageUsers({ req }: { req: RequestWithUser }): boolean {
  return hasCapability(req.user, 'manageUsers')
}

/**
 * Users can always read their own account profile. Super admins and admins
 * can read all accounts.
 */
export const canReadUser: Access = ({ req, id }): AccessResult => {
  if (canManageUsers({ req })) return true
  if (req.user && id && String(req.user.id) === String(id)) return true
  if (req.user) return { id: { equals: req.user.id } }
  return false
}

/**
 * Users can update their own account profile (password, email, name).
 * Super admins and admins can update all accounts.
 */
export const canUpdateUser: Access = ({ req, id }): AccessResult => {
  if (canManageUsers({ req })) return true
  if (req.user && id && String(req.user.id) === String(id)) return true
  if (req.user) return { id: { equals: req.user.id } }
  return false
}

/**
 * Allows the very first CMS account to be created without a session. The Users
 * collection hook promotes that account to super_admin; every later create is
 * restricted to an existing super administrator.
 */
export const canBootstrapOrManageUsers: Access = async ({ req }): Promise<boolean> => {
  if (canManageUsers({ req })) return true

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
  })

  return totalDocs === 0
}

export function canManageSiteContent({ req }: { req: RequestWithUser }): boolean {
  return hasCapability(req.user, 'manageSiteContent')
}

export function canManageContent({ req }: { req: RequestWithUser }): boolean {
  return hasCapability(req.user, 'manageContent')
}

export function canReviewContent({ req }: { req: RequestWithUser }): boolean {
  return hasCapability(req.user, 'reviewContent')
}

export function canPublishContent({ req }: { req: RequestWithUser }): boolean {
  return hasCapability(req.user, 'publishContent')
}

export function canManageMedia({ req }: { req: RequestWithUser }): boolean {
  return hasCapability(req.user, 'manageMedia')
}

export function canViewAudience({ req }: { req: RequestWithUser }): boolean {
  return hasCapability(req.user, 'viewAudience')
}

export function canManageAudience({ req }: { req: RequestWithUser }): boolean {
  return hasCapability(req.user, 'manageAudience')
}

/**
 * Public callers are limited to published documents, while any authenticated
 * CMS user can see all states required for their editorial work.
 */
export const canReadPublishedOrAuthenticated: Access = ({ req }): AccessResult => {
  if (req.user) return true
  return { status: { equals: 'published' } }
}

/**
 * Editors can update their own content; reviewers can update a document only
 * to complete its review, while admins retain full editorial control.
 */
export const canManageOwnContent: Access = ({ req }): AccessResult => {
  if (canPublishContent({ req })) {
    return true
  }

  if (canManageContent({ req }) && req.user?.id) {
    return { author: { equals: req.user.id } }
  }

  return false
}

export const canManageOwnContentOrReview: Access = ({ req }): AccessResult => {
  if (canPublishContent({ req }) || canReviewContent({ req })) {
    return true
  }

  if (canManageContent({ req }) && req.user?.id) {
    return { author: { equals: req.user.id } }
  }

  return false
}
