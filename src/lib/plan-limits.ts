export const PLAN_LIMITS = {
    FREE: {
        maxProducts: 3,
        maxSubscribers: 500,
        customDomain: false,
        aiTools: false,
        emailAutomation: false,
        funnels: false,
        platformFee: 0.05,
    },
    STARTER: {
        maxProducts: Infinity,
        maxSubscribers: 5000,
        customDomain: true,
        aiTools: false,
        emailAutomation: false,
        funnels: false,
        platformFee: 0.02,
    },
    CREATOR: {
        maxProducts: Infinity,
        maxSubscribers: Infinity,
        customDomain: true,
        aiTools: true,
        emailAutomation: true,
        funnels: true,
        platformFee: 0.01,
    },
    PRO: {
        maxProducts: Infinity,
        maxSubscribers: Infinity,
        customDomain: true,
        aiTools: true,
        emailAutomation: true,
        funnels: true,
        platformFee: 0,
    },
} as const;

export function canUseFeature(plan: string, feature: keyof typeof PLAN_LIMITS.FREE): boolean {
    const limits = (PLAN_LIMITS as any)[plan] || PLAN_LIMITS.FREE;
    const value = limits[feature];
    return value === true || value === Infinity;
}

export function isAtLimit(plan: string, feature: "maxProducts" | "maxSubscribers", current: number): boolean {
    const limits = (PLAN_LIMITS as any)[plan] || PLAN_LIMITS.FREE;
    const max = limits[feature];
    return current >= max;
}

export function getPlatformFee(plan: string): number {
    const limits = (PLAN_LIMITS as any)[plan] || PLAN_LIMITS.FREE;
    return limits.platformFee;
}
