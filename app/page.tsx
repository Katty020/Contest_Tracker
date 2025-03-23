import LandingPage from "@/components/landing-page"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="contest-tracker-theme">
      <LandingPage />
    </ThemeProvider>
  )
}

