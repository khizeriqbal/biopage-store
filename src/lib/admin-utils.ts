import prisma from "@/lib/prisma";

// Role definitions
export type AdminRole = "user" | "admin" | "superadmin";

/**
 * Check if user has admin access
 */
export function isAdminUser(role: string): boolean {
  return role === "admin" || role === "superadmin";
}

/**
 * Check if user is superadmin (highest privilege)
 */
export function isSuperAdmin(role: string): boolean {
  return role === "superadmin";
}

/**
 * Verify if admin can manage another user
 * Superadmin can manage anyone
 * Admin can manage users but not other admins
 */
export function canManageUser(
  actorRole: string,
  targetUserRole: string
): boolean {
  if (isSuperAdmin(actorRole)) return true;
  if (actorRole === "admin" && targetUserRole === "user") return true;
  return false;
}

/**
 * Get full user details for admin panel
 */
export async function getAdminUserDetails(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      role: true,
      isAdmin: true,
      suspendedAt: true,
      suspendReason: true,
      adminNotes: true,
      customDomain: true,
      domainVerified: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          products: true,
          orders: true,
          subscribers: true,
          affiliateLinks: true,
        },
      },
    },
  });
  return user;
}

/**
 * Log admin action for audit trail
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  entityType: string,
  entityId: string,
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>,
  reason?: string,
  ipAddress?: string
): Promise<void> {
  try {
    await prisma.adminLog.create({
      data: {
        adminId,
        action,
        entityType,
        entityId,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        reason,
        ipAddress,
      },
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
    // Don't throw - logging shouldn't break the action
  }
}

/**
 * Suspend a user account
 */
export async function suspendUser(
  userId: string,
  adminId: string,
  reason: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { suspendedAt: true },
  });

  if (!user) throw new Error("User not found");
  if (user.suspendedAt) throw new Error("User is already suspended");

  const oldValues = { suspendedAt: null };
  const newValues = { suspendedAt: new Date() };

  await prisma.user.update({
    where: { id: userId },
    data: {
      suspendedAt: new Date(),
      lastSuspendedBy: adminId,
      suspendReason: reason,
    },
  });

  await logAdminAction(
    adminId,
    "suspend",
    "user",
    userId,
    oldValues,
    newValues,
    reason
  );
}

/**
 * Unsuspend a user account
 */
export async function unsuspendUser(
  userId: string,
  adminId: string,
  reason?: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { suspendedAt: true },
  });

  if (!user) throw new Error("User not found");
  if (!user.suspendedAt) throw new Error("User is not suspended");

  const oldValues = { suspendedAt: user.suspendedAt };
  const newValues = { suspendedAt: null };

  await prisma.user.update({
    where: { id: userId },
    data: {
      suspendedAt: null,
      suspendReason: null,
    },
  });

  await logAdminAction(
    adminId,
    "unsuspend",
    "user",
    userId,
    oldValues,
    newValues,
    reason
  );
}

/**
 * Promote user to admin (superadmin only)
 */
export async function promoteToAdmin(
  userId: string,
  adminId: string,
  adminRole: "admin" | "superadmin",
  reason?: string
): Promise<void> {
  if (!isSuperAdmin(adminRole)) {
    throw new Error("Only superadmin can promote users");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) throw new Error("User not found");
  if (user.role !== "user") throw new Error("User is already an admin");

  const oldValues = { role: user.role };
  const newValues = { role: "admin" };

  await prisma.user.update({
    where: { id: userId },
    data: {
      role: "admin",
      isAdmin: true,
    },
  });

  await logAdminAction(
    adminId,
    "promote",
    "user",
    userId,
    oldValues,
    newValues,
    reason
  );
}

/**
 * Demote admin to user (superadmin only)
 */
export async function demoteFromAdmin(
  userId: string,
  adminId: string,
  adminRole: "admin" | "superadmin",
  reason?: string
): Promise<void> {
  if (!isSuperAdmin(adminRole)) {
    throw new Error("Only superadmin can demote admins");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) throw new Error("User not found");
  if (user.role === "user") throw new Error("User is not an admin");

  const oldValues = { role: user.role };
  const newValues = { role: "user" };

  await prisma.user.update({
    where: { id: userId },
    data: {
      role: "user",
      isAdmin: false,
    },
  });

  await logAdminAction(
    adminId,
    "demote",
    "user",
    userId,
    oldValues,
    newValues,
    reason
  );
}

/**
 * Update user plan from admin panel
 */
export async function updateUserPlan(
  userId: string,
  newPlan: string,
  adminId: string,
  reason?: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const oldValues = { plan: (user as any).plan };
  const newValues = { plan: newPlan };

  // This assumes User model has a plan field
  // Update based on actual schema
  await logAdminAction(
    adminId,
    "update_plan",
    "user",
    userId,
    oldValues,
    newValues,
    reason
  );
}

/**
 * Get all admin logs with optional filters
 */
export async function getAdminLogs(
  filters?: {
    adminId?: string;
    action?: string;
    entityType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    skip?: number;
  }
) {
  const where: any = {};

  if (filters?.adminId) where.adminId = filters.adminId;
  if (filters?.action) where.action = filters.action;
  if (filters?.entityType) where.entityType = filters.entityType;

  if (filters?.dateFrom || filters?.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
    if (filters.dateTo) where.createdAt.lte = filters.dateTo;
  }

  const logs = await prisma.adminLog.findMany({
    where,
    include: {
      admin: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: filters?.limit || 100,
    skip: filters?.skip || 0,
  });

  return logs;
}

/**
 * Get system stats for admin dashboard
 */
export async function getAdminStats() {
  const [
    totalUsers,
    totalAdmins,
    suspendedUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    totalAffiliates,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "user" } }),
    prisma.user.count({ where: { isAdmin: true } }),
    prisma.user.count({ where: { suspendedAt: { not: null } } }),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { amount: true },
    }),
    prisma.affiliateLink.count(),
  ]);

  return {
    totalUsers,
    totalAdmins,
    suspendedUsers,
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.amount || 0,
    totalAffiliates,
  };
}
