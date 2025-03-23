import ContestTracker from "@/components/contest-tracker"
import { ThemeProvider } from "@/components/theme-provider"

export default function DashboardPage() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="contest-tracker-theme">
      <div className="min-h-screen bg-background">
        <ContestTracker />
      </div>
    </ThemeProvider>
  )
}

