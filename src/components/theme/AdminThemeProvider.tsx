"use client"

import * as React from "react"

const STORAGE_KEY = "admin-theme"

type Theme = "light" | "dark"

interface AdminThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

export const AdminThemeContext = React.createContext<AdminThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
})

export function useAdminTheme() {
  return React.useContext(AdminThemeContext)
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === "dark" || stored === "light") {
      setThemeState(stored)
    }
    setMounted(true)
  }, [])

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem(STORAGE_KEY, t)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div
        className={`${mounted ? theme : "light"} min-h-screen bg-background text-foreground`}
        style={{ colorScheme: mounted ? theme : "light" }}
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  )
}
