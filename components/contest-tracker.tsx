"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookmarkIcon, Calendar, Clock, Code2, Filter, Home, Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDate, calculateTimeRemaining } from "@/lib/api-utils"

type Platform = "codeforces" | "codechef" | "leetcode"

interface Contest {
  id: string
  name: string
  platform: Platform
  url: string
  startTime: string | number
  endTime: string | number
  duration: number
  isUpcoming: boolean
  solutionUrl?: string
  bookmarked?: boolean
}

export default function ContestTracker() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [contests, setContests] = useState<Contest[]>([])
  const [filteredContests, setFilteredContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [platforms, setPlatforms] = useState<Platform[]>(["codeforces", "codechef", "leetcode"])
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")

  useEffect(() => {
    const fetchContests = async () => {
      try {
        // Fetch contests from our API endpoint
        const response = await fetch("/api/contests")
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()
        setContests(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching contests:", error)
        setLoading(false)
      }
    }

    fetchContests()

    // Load bookmarks from localStorage
    const loadBookmarks = () => {
      const bookmarked = localStorage.getItem("bookmarkedContests")
      if (bookmarked) {
        const bookmarkedIds = JSON.parse(bookmarked) as string[]
        setContests((prevContests) =>
          prevContests.map((contest) => ({
            ...contest,
            bookmarked: bookmarkedIds.includes(contest.id),
          })),
        )
      }
    }

    loadBookmarks()
  }, [])

  useEffect(() => {
    // Filter contests based on selected platforms and active tab
    const filtered = contests.filter(
      (contest) => platforms.includes(contest.platform) && contest.isUpcoming === (activeTab === "upcoming"),
    )
    setFilteredContests(filtered)
  }, [contests, platforms, activeTab])

  const toggleBookmark = (id: string) => {
    setContests((prevContests) =>
      prevContests.map((contest) => (contest.id === id ? { ...contest, bookmarked: !contest.bookmarked } : contest)),
    )

    // Save bookmarks to localStorage
    const updatedContests = contests.map((contest) =>
      contest.id === id ? { ...contest, bookmarked: !contest.bookmarked } : contest,
    )
    const bookmarkedIds = updatedContests.filter((contest) => contest.bookmarked).map((contest) => contest.id)
    localStorage.setItem("bookmarkedContests", JSON.stringify(bookmarkedIds))
  }

  const togglePlatform = (platform: Platform) => {
    setPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const getPlatformColor = (platform: Platform) => {
    switch (platform) {
      case "codeforces":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "codechef":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "leetcode":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Code2 className="h-8 w-8 mr-2" />
          <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>Contest Tracker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle {theme === "dark" ? "light" : "dark"} mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                  <Filter className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter platforms</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="outline" onClick={() => router.push("/admin")}>
            Admin
          </Button>

          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="h-5 w-5 mr-2" />
              Home
            </Link>
          </Button>
        </div>
      </header>

      {showFilterMenu && (
        <div className="mb-6 p-4 border rounded-lg bg-card">
          <h2 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
            Filter Platforms
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="codeforces"
                checked={platforms.includes("codeforces")}
                onCheckedChange={() => togglePlatform("codeforces")}
              />
              <label
                htmlFor="codeforces"
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                Codeforces
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="codechef"
                checked={platforms.includes("codechef")}
                onCheckedChange={() => togglePlatform("codechef")}
              />
              <label
                htmlFor="codechef"
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                CodeChef
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="leetcode"
                checked={platforms.includes("leetcode")}
                onCheckedChange={() => togglePlatform("leetcode")}
              />
              <label
                htmlFor="leetcode"
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                LeetCode
              </label>
            </div>
          </div>
        </div>
      )}

      <Tabs
        defaultValue="upcoming"
        className="mb-6"
        onValueChange={(value) => setActiveTab(value as "upcoming" | "past")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Contests</TabsTrigger>
          <TabsTrigger value="past">Past Contests</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredContests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContests.map((contest) => (
                <Card key={contest.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className={`${getPlatformColor(contest.platform)} capitalize`}>{contest.platform}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(contest.id)}
                        className={contest.bookmarked ? "text-yellow-500" : "text-muted-foreground"}
                      >
                        <BookmarkIcon className="h-5 w-5" />
                      </Button>
                    </div>
                    <CardTitle
                      className={`text-lg mt-2 line-clamp-2 ${theme === "dark" ? "text-white" : "text-black"}`}
                    >
                      {contest.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatDate(contest.startTime)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Time remaining: {calculateTimeRemaining(contest.startTime)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={contest.url} target="_blank" rel="noopener noreferrer">
                        Go to Contest
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className={`text-xl font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>
                No contests found
              </h3>
              <p className="text-muted-foreground mt-2">Try changing your platform filters or check back later.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="past">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredContests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContests.map((contest) => (
                <Card key={contest.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className={`${getPlatformColor(contest.platform)} capitalize`}>{contest.platform}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(contest.id)}
                        className={contest.bookmarked ? "text-yellow-500" : "text-muted-foreground"}
                      >
                        <BookmarkIcon className="h-5 w-5" />
                      </Button>
                    </div>
                    <CardTitle
                      className={`text-lg mt-2 line-clamp-2 ${theme === "dark" ? "text-white" : "text-black"}`}
                    >
                      {contest.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatDate(contest.startTime)}</span>
                      </div>
                      {contest.solutionUrl ? (
                        <div className="mt-2">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            Solution Available
                          </Badge>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button asChild className="w-full">
                      <Link href={contest.url} target="_blank" rel="noopener noreferrer">
                        View Contest
                      </Link>
                    </Button>
                    {contest.solutionUrl && (
                      <Button variant="outline" asChild className="w-full">
                        <Link href={contest.solutionUrl} target="_blank" rel="noopener noreferrer">
                          Watch Solution
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className={`text-xl font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>
                No past contests found
              </h3>
              <p className="text-muted-foreground mt-2">Try changing your platform filters or check back later.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

