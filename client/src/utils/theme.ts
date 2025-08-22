export type Theme = "dark" | "light" | "system"

export function getSystemTheme(): Theme {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return "light"
}

export function getStoredTheme(): Theme {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme") as Theme
    if (stored && ["dark", "light", "system"].includes(stored)) {
      return stored
    }
  }
  return "system"
}

export function setStoredTheme(theme: Theme) {
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", theme)
  }
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  
  if (theme === "system") {
    const systemTheme = getSystemTheme()
    root.classList.toggle("dark", systemTheme === "dark")
  } else {
    root.classList.toggle("dark", theme === "dark")
  }
} 