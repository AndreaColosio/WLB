export function balanceScore(energy: number, rest: number, focus: number, connection: number): number {
  const clamp = (x: number) => Math.max(0, Math.min(10, Math.round(x)));
  return clamp((energy + rest + focus + connection) / 4);
}

export async function computeStreakDays(userId: string, prisma: any): Promise<number> {
  const entries = await prisma.entry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true }
  });

  if (!entries.length) return 0;

  let streak = 0;
  const today = new Date();
  const daysSet = new Set(entries.map((e: any) => e.createdAt.toISOString().slice(0, 10)));

  // Count back from today
  for (let i = 0; ; i++) {
    const d = new Date(today.getTime() - i * 86400 * 1000).toISOString().slice(0, 10);
    if (daysSet.has(d)) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export async function grantBadges(userId: string, prisma: any): Promise<void> {
  // Grant FIRST_ENTRY badge
  const entryCount = await prisma.entry.count({ where: { userId } });
  if (entryCount === 1) {
    const existingBadge = await prisma.badge.findFirst({
      where: { userId, code: "FIRST_ENTRY" }
    });
    if (!existingBadge) {
      await prisma.badge.create({
        data: { userId, code: "FIRST_ENTRY" }
      });
    }
  }

  // Grant WEEK_STREAK_7 badge
  const streakDays = await computeStreakDays(userId, prisma);
  if (streakDays >= 7) {
    const existingBadge = await prisma.badge.findFirst({
      where: { userId, code: "WEEK_STREAK_7" }
    });
    if (!existingBadge) {
      await prisma.badge.create({
        data: { userId, code: "WEEK_STREAK_7" }
      });
    }
  }

  // Grant GRATITUDE_30 badge
  const gratitudeCount = await prisma.entry.count({
    where: { userId, type: "GRATITUDE" }
  });
  if (gratitudeCount >= 30) {
    const existingBadge = await prisma.badge.findFirst({
      where: { userId, code: "GRATITUDE_30" }
    });
    if (!existingBadge) {
      await prisma.badge.create({
        data: { userId, code: "GRATITUDE_30" }
      });
    }
  }
}
