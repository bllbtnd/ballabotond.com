// GitHub contribution statistics calculations

import type { ContributionDay, GitHubStats } from '../types';

/**
 * Calculates comprehensive statistics from GitHub contribution data
 */
export function calculateGitHubStats(data: ContributionDay[]): GitHubStats {
    const total = data.reduce((sum, day) => sum + day.count, 0);
    const max = Math.max(...data.map((d) => d.count));
    const avgPerWeek = Math.round((total / data.length) * 7);
    const activeDays = data.filter((d) => d.count > 0).length;
    const quietDays = data.length - activeDays;
    const dailyAvg = (total / data.length).toFixed(1);

    // Calculate current streak
    const currentStreak = calculateCurrentStreak(data);

    // Calculate longest streak
    const longestStreak = calculateLongestStreak(data);

    // Calculate best day of week
    const { bestDay, bestDayCount } = calculateBestDayOfWeek(data);

    // Calculate best month
    const { bestMonth, bestMonthCount } = calculateBestMonth(data);

    // Calculate contribution distribution
    const distribution = {
        light: data.filter((d) => d.level === 1).length,
        moderate: data.filter((d) => d.level === 2).length,
        heavy: data.filter((d) => d.level === 3).length,
        intense: data.filter((d) => d.level === 4).length,
    };

    const lightPct = ((distribution.light / activeDays) * 100).toFixed(1);
    const moderatePct = ((distribution.moderate / activeDays) * 100).toFixed(1);
    const heavyPct = ((distribution.heavy / activeDays) * 100).toFixed(1);
    const intensePct = ((distribution.intense / activeDays) * 100).toFixed(1);

    // Calculate weekly insights
    const { bestWeek, activeWeeks } = calculateWeeklyInsights(data);

    return {
        total,
        max,
        avgPerWeek,
        currentStreak,
        longestStreak,
        activeDays,
        quietDays,
        dailyAvg,
        bestDay,
        bestDayCount,
        bestMonth,
        bestMonthCount,
        distribution,
        lightPct,
        moderatePct,
        heavyPct,
        intensePct,
        bestWeek,
        activeWeeks,
    };
}

/**
 * Calculates the current active streak
 */
function calculateCurrentStreak(data: ContributionDay[]): number {
    let currentStreak = 0;
    let startIndex = data.length - 1;

    // If the last day has 0 commits, check if it's today
    if (startIndex >= 0 && data[startIndex].count === 0) {
        const lastDate = new Date(data[startIndex].date);
        const today = new Date();

        const isToday =
            lastDate.getFullYear() === today.getFullYear() &&
            lastDate.getMonth() === today.getMonth() &&
            lastDate.getDate() === today.getDate();

        // If it's today, start counting from yesterday
        if (isToday) {
            startIndex--;
        }
    }

    // Count consecutive days with commits
    for (let i = startIndex; i >= 0; i--) {
        if (data[i].count > 0) {
            currentStreak++;
        } else {
            break;
        }
    }

    return currentStreak;
}

/**
 * Calculates the longest streak in the data
 */
function calculateLongestStreak(data: ContributionDay[]): number {
    let longestStreak = 0;
    let tempStreak = 0;

    data.forEach((day) => {
        if (day.count > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    });

    return longestStreak;
}

/**
 * Calculates the best day of the week
 */
function calculateBestDayOfWeek(data: ContributionDay[]): {
    bestDay: string;
    bestDayCount: number;
} {
    const dayOfWeekCounts: Record<string, number> = {
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
    };

    const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    data.forEach((day) => {
        const date = new Date(day.date);
        const dayName = dayNames[date.getDay()];
        dayOfWeekCounts[dayName] += day.count;
    });

    let bestDay = 'N/A';
    let bestDayCount = 0;

    Object.entries(dayOfWeekCounts).forEach(([day, count]) => {
        if (count > bestDayCount) {
            bestDayCount = count;
            bestDay = day;
        }
    });

    return { bestDay, bestDayCount };
}

/**
 * Calculates the best month
 */
function calculateBestMonth(data: ContributionDay[]): {
    bestMonth: string;
    bestMonthCount: number;
} {
    const monthCounts: Record<string, number> = {};
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    data.forEach((day) => {
        const date = new Date(day.date);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + day.count;
    });

    let bestMonth = 'N/A';
    let bestMonthCount = 0;

    Object.entries(monthCounts).forEach(([month, count]) => {
        if (count > bestMonthCount) {
            bestMonthCount = count;
            bestMonth = month;
        }
    });

    return { bestMonth, bestMonthCount };
}

/**
 * Calculates weekly insights
 */
function calculateWeeklyInsights(data: ContributionDay[]): {
    bestWeek: number;
    activeWeeks: number;
} {
    const weeks: number[] = [];

    for (let i = 0; i < data.length; i += 7) {
        const weekData = data.slice(i, i + 7);
        const weekTotal = weekData.reduce((sum, day) => sum + day.count, 0);
        weeks.push(weekTotal);
    }

    const bestWeek = Math.max(...weeks);
    const activeWeeks = weeks.filter((w) => w > 0).length;

    return { bestWeek, activeWeeks };
}

/**
 * Fetches GitHub contribution data
 */
export async function fetchGitHubContributions(
    username: string
): Promise<ContributionDay[]> {
    const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch GitHub data');
    }

    const result = await response.json();

    return result.contributions.map((day: any) => ({
        date: day.date,
        count: day.count,
        level: day.level,
    }));
}
