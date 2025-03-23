"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookmarkIcon, Calendar, Clock, Code2, Home } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate, calculateTimeRemaining } from "@/lib/api-utils"

interface Contest {
  id: string
  name: string
  platform: "leetcode"
  url: string
  startTime: string | number
  endTime: string | number
  duration: number
  isUpcoming: boolean
  solutionUrl?: string
  bookmarked?: boolean
}

export default function LeetCodePage() {
  const { theme } = useTheme()
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch("/api/contests")
        const data = await response.json()
        // Filter only LeetCode contests
        const leetcodeContests = data.filter((contest: Contest) => contest.platform === "leetcode")

        // Load bookmarks from localStorage
        const bookmarked = localStorage.getItem("bookmarkedContests")
        if (bookmarked) {
          const bookmarkedIds = JSON.parse(bookmarked) as string[]
          setContests(
            leetcodeContests.map((contest: Contest) => ({
              ...contest,
              bookmarked: bookmarkedIds.includes(contest.id),
            })),
          )
        } else {
          setContests(leetcodeContests)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching contests:", error)
        setLoading(false)
      }
    }

    fetchContests()
  }, [])

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

  const filteredContests = contests.filter((contest) => contest.isUpcoming === (activeTab === "upcoming"))

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Code2 className="h-8 w-8 mr-2" />
          <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>LeetCode Contests</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

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
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 capitalize">
                        LeetCode
                      </Badge>
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
                No upcoming LeetCode contests found
              </h3>
              <p className="text-muted-foreground mt-2">Check back later for new contests.</p>
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
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 capitalize">
                        LeetCode
                      </Badge>
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
                No past LeetCode contests found
              </h3>
              <p className="text-muted-foreground mt-2">Check back later.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

