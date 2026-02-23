"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminTheme } from "./AdminThemeProvider"

export function AdminThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useAdminTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="h-9 w-9 shrink-0" />

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`relative shrink-0 rounded-xl text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-foreground ${className}`}
      aria-label={isDark ? "Switch admin to light mode" : "Switch admin to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <Sun className={`h-[1.15rem] w-[1.15rem] transition-all duration-300 ${isDark ? "rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100"}`} />
      <Moon className={`h-[1.15rem] w-[1.15rem] transition-all duration-300 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0 absolute"}`} />
    </Button>
  )
}
