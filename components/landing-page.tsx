"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Code2, Moon, Sun, Trophy, Clock, Filter, BookmarkIcon } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Ensure theme is only accessed after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code2 className="h-8 w-8 text-primary" />
          <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>Contest Tracker</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1
            className={`text-4xl md:text-6xl font-extrabold tracking-tight mb-6 ${theme === "dark" ? "text-white" : "text-black"}`}
          >
            Track Coding Contests <span className="text-primary">All in One Place</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
            Never miss a coding contest again. Track upcoming contests from Codeforces, CodeChef, and LeetCode with
            countdown timers, bookmarks, and solution links.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 rounded-full animate-pulse"
            onClick={() => router.push("/dashboard")}
          >
            Launch App
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Calendar className="h-12 w-12 text-primary mb-4" />
              <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
                All Platforms
              </h3>
              <p className="text-muted-foreground">
                Track contests from Codeforces, CodeChef, and LeetCode in one unified interface.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
                Countdown Timers
              </h3>
              <p className="text-muted-foreground">See exactly how much time is left before each contest starts.</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <BookmarkIcon className="h-12 w-12 text-primary mb-4" />
              <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>Bookmarks</h3>
              <p className="text-muted-foreground">Save contests you're interested in and access them quickly.</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl" />
          <div className="relative bg-card/50 backdrop-blur-sm rounded-xl border border-primary/20 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                  Solution Videos
                </h2>
                <p className="text-muted-foreground mb-6">
                  Access solution videos for past contests directly from our platform. Learn from the best and improve
                  your problem-solving skills.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter Platforms
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Trophy className="h-4 w-4" />
                    Past Contests
                  </Button>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 border border-border">
                <div className="aspect-video rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Code2 className="h-16 w-16 text-primary/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-20 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>Contest Tracker</p>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Contest Tracker. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

