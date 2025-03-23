import { NextResponse } from "next/server"

// Define contest interface
export interface Contest {
  id: string
  name: string
  platform: "codeforces" | "codechef" | "leetcode"
  url: string
  startTime: string | number
  endTime: string | number
  duration: number
  isUpcoming: boolean
  solutionUrl?: string
  bookmarked?: boolean
}

// Fetch Codeforces contests using their API
async function fetchCodeforcesContests(): Promise<Contest[]> {
  try {
    // Codeforces API doesn't actually require authentication for the contestList endpoint
    // but we'll implement it anyway for demonstration and future use
    const apiKey = process.env.CODEFORCES_API_KEY || "f4d5b9034955051913ca8d6f2b3f2dedd0232eb9"
    const apiSecret = process.env.CODEFORCES_API_SECRET || "bb2a3f03d3e8986f3f926896318d2cecbc920236"

    const response = await fetch("https://codeforces.com/api/contest.list")
    const data = await response.json()

    if (data.status !== "OK") {
      throw new Error(`Codeforces API error: ${data.comment || "Unknown error"}`)
    }

    const now = Date.now()

    // Transform Codeforces API response to our Contest format
    return data.result.map((contest: any) => {
      // Codeforces API returns time in seconds, we need milliseconds
      const startTimeMs = contest.startTimeSeconds * 1000
      const durationMs = contest.durationSeconds * 1000
      const endTimeMs = startTimeMs + durationMs

      return {
        id: `cf-${contest.id}`,
        name: contest.name,
        platform: "codeforces",
        url: `https://codeforces.com/contests/${contest.id}`,
        startTime: startTimeMs,
        endTime: endTimeMs,
        duration: durationMs,
        isUpcoming: startTimeMs > now,
      }
    })
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error)
    return []
  }
}

// Mock data for CodeChef and LeetCode (since we don't have API keys for those)
function getMockContests(): Contest[] {
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000

  // Generate dates for upcoming contests
  const upcomingDate1 = now + oneDay
  const upcomingDate2 = now + 2 * oneDay
  const upcomingDate3 = now + 3 * oneDay

  // Generate dates for past contests
  const pastDate1 = now - oneDay
  const pastDate2 = now - 2 * oneDay
  const pastDate3 = now - 3 * oneDay

  return [
    // CodeChef Contests
    {
      id: "cc-starter-100",
      name: "CodeChef Starters 100",
      platform: "codechef",
      url: "https://www.codechef.com/START100",
      startTime: upcomingDate1,
      endTime: upcomingDate1 + 3 * 60 * 60 * 1000,
      duration: 3 * 60 * 60 * 1000,
      isUpcoming: true,
    },
    {
      id: "cc-starter-99",
      name: "CodeChef Starters 99",
      platform: "codechef",
      url: "https://www.codechef.com/START99",
      startTime: pastDate2,
      endTime: pastDate2 + 3 * 60 * 60 * 1000,
      duration: 3 * 60 * 60 * 1000,
      isUpcoming: false,
      solutionUrl: "https://www.youtube.com/watch?v=xYzM7lkQpLU",
    },
    {
      id: "cc-cookoff-20",
      name: "CodeChef Cook-Off 20",
      platform: "codechef",
      url: "https://www.codechef.com/COOK20",
      startTime: pastDate3,
      endTime: pastDate3 + 2.5 * 60 * 60 * 1000,
      duration: 2.5 * 60 * 60 * 1000,
      isUpcoming: false,
    },

    // LeetCode Contests
    {
      id: "lc-weekly-345",
      name: "LeetCode Weekly Contest 345",
      platform: "leetcode",
      url: "https://leetcode.com/contest/weekly-contest-345",
      startTime: upcomingDate2,
      endTime: upcomingDate2 + 1.5 * 60 * 60 * 1000,
      duration: 1.5 * 60 * 60 * 1000,
      isUpcoming: true,
    },
    {
      id: "lc-biweekly-100",
      name: "LeetCode Biweekly Contest 100",
      platform: "leetcode",
      url: "https://leetcode.com/contest/biweekly-contest-100",
      startTime: upcomingDate3,
      endTime: upcomingDate3 + 1.5 * 60 * 60 * 1000,
      duration: 1.5 * 60 * 60 * 1000,
      isUpcoming: true,
    },
    {
      id: "lc-weekly-344",
      name: "LeetCode Weekly Contest 344",
      platform: "leetcode",
      url: "https://leetcode.com/contest/weekly-contest-344",
      startTime: pastDate1,
      endTime: pastDate1 + 1.5 * 60 * 60 * 1000,
      duration: 1.5 * 60 * 60 * 1000,
      isUpcoming: false,
      solutionUrl: "https://www.youtube.com/watch?v=KLBCUx1mZYY",
    },
  ]
}

export async function GET() {
  try {
    // Fetch real Codeforces contests
    const codeforcesContests = await fetchCodeforcesContests()

    // Get mock data for other platforms
    const mockContests = getMockContests()

    // Combine all contests
    const allContests = [...codeforcesContests, ...mockContests]

    // Sort by start time (upcoming first, then past)
    allContests.sort((a, b) => {
      // First sort by upcoming/past
      if (a.isUpcoming && !b.isUpcoming) return -1
      if (!a.isUpcoming && b.isUpcoming) return 1

      // Then sort by start time
      if (a.isUpcoming) {
        // For upcoming, sort by earliest first
        return Number(a.startTime) - Number(b.startTime)
      } else {
        // For past, sort by most recent first
        return Number(b.startTime) - Number(a.startTime)
      }
    })

    return NextResponse.json(allContests)
  } catch (error) {
    console.error("Error in contests API:", error)
    return NextResponse.json({ error: "Failed to fetch contests" }, { status: 500 })
  }
}

