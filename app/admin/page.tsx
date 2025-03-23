"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Code2 } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function AdminPage() {
  const { theme } = useTheme()
  const { toast } = useToast()
  const [platform, setPlatform] = useState("")
  const [contestId, setContestId] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
  
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Solution link added",
        description: "The YouTube solution link has been successfully added to the contest.",
      })

      // Reset form
      setPlatform("")
      setContestId("")
      setYoutubeUrl("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add solution link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Code2 className="h-8 w-8 mr-2" />
          <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>Admin Dashboard</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contest Tracker
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className={theme === "dark" ? "text-white" : "text-black"}>Add Solution Link</CardTitle>
            <CardDescription>Connect YouTube solution videos to past contests</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform" className={theme === "dark" ? "text-white" : "text-black"}>
                  Platform
                </Label>
                <Select value={platform} onValueChange={setPlatform} required>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="codeforces">Codeforces</SelectItem>
                    <SelectItem value="codechef">CodeChef</SelectItem>
                    <SelectItem value="leetcode">LeetCode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contestId" className={theme === "dark" ? "text-white" : "text-black"}>
                  Contest ID
                </Label>
                <Input
                  id="contestId"
                  placeholder="Enter contest ID"
                  value={contestId}
                  onChange={(e) => setContestId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeUrl" className={theme === "dark" ? "text-white" : "text-black"}>
                  YouTube Solution URL
                </Label>
                <Input
                  id="youtubeUrl"
                  placeholder="https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Solution Link"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={theme === "dark" ? "text-white" : "text-black"}>YouTube Playlists</CardTitle>
            <CardDescription>Manage your solution video playlists</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="codeforces">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="codeforces">Codeforces</TabsTrigger>
                <TabsTrigger value="codechef">CodeChef</TabsTrigger>
                <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
              </TabsList>
              <TabsContent value="codeforces" className="space-y-4">
                <div className="space-y-2 mt-4">
                  <Label htmlFor="codeforces-playlist" className={theme === "dark" ? "text-white" : "text-black"}>
                    Codeforces Playlist URL
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="codeforces-playlist"
                      placeholder="https://youtube.com/playlist?list=..."
                      defaultValue="https://youtube.com/playlist?list=PLCFqxGYH9ALRMKQEUkPJMCYGG-L7H1-_r"
                    />
                    <Button variant="outline">Update</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codeforces-api-key" className={theme === "dark" ? "text-white" : "text-black"}>
                    YouTube API Key (for auto-fetch)
                  </Label>
                  <div className="flex space-x-2">
                    <Input id="codeforces-api-key" type="password" placeholder="Enter YouTube API key" />
                    <Button variant="outline">Save</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="codechef" className="space-y-4">
                <div className="space-y-2 mt-4">
                  <Label htmlFor="codechef-playlist" className={theme === "dark" ? "text-white" : "text-black"}>
                    CodeChef Playlist URL
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="codechef-playlist"
                      placeholder="https://youtube.com/playlist?list=..."
                      defaultValue="https://youtube.com/playlist?list=PLCFqxGYH9ALTjGzLMF4EQSnQw-1GhHdRj"
                    />
                    <Button variant="outline">Update</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codechef-api-key" className={theme === "dark" ? "text-white" : "text-black"}>
                    YouTube API Key (for auto-fetch)
                  </Label>
                  <div className="flex space-x-2">
                    <Input id="codechef-api-key" type="password" placeholder="Enter YouTube API key" />
                    <Button variant="outline">Save</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="leetcode" className="space-y-4">
                <div className="space-y-2 mt-4">
                  <Label htmlFor="leetcode-playlist" className={theme === "dark" ? "text-white" : "text-black"}>
                    LeetCode Playlist URL
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="leetcode-playlist"
                      placeholder="https://youtube.com/playlist?list=..."
                      defaultValue="https://youtube.com/playlist?list=PLCFqxGYH9ALQJzJfgH3LfUJEp9kO4ZvTm"
                    />
                    <Button variant="outline">Update</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leetcode-api-key" className={theme === "dark" ? "text-white" : "text-black"}>
                    YouTube API Key (for auto-fetch)
                  </Label>
                  <div className="flex space-x-2">
                    <Input id="leetcode-api-key" type="password" placeholder="Enter YouTube API key" />
                    <Button variant="outline">Save</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <h3 className={`text-lg font-medium mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
                Auto-Fetch Configuration
              </h3>
              <div className="space-y-2">
                <Label htmlFor="auto-fetch-notes" className={theme === "dark" ? "text-white" : "text-black"}>
                  Notes
                </Label>
                <Textarea
                  id="auto-fetch-notes"
                  placeholder="Configuration notes..."
                  defaultValue="The auto-fetch feature uses the YouTube Data API to automatically retrieve solution videos from your playlists. Make sure your video titles include the contest ID for proper matching."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

