import { createContext, useContext, useState, type ReactNode } from "react";

type AdminTheme = "dark" | "light";

interface AdminThemeContextType {
  theme: AdminTheme;
  isDark: boolean;
  toggleTheme: () => void;
  vars: Record<string, string>;
}

export const darkVars: Record<string, string> = {
  "--a-bg": "#1a1028",
  "--a-sidebar": "#241535",
  "--a-card": "#211330",
  "--a-row-even": "#1a1028",
  "--a-row-odd": "#1e1330",
  "--a-border": "hsl(40 55% 55% / 0.12)",
  "--a-border-soft": "hsl(40 55% 55% / 0.22)",
  "--a-border-subtle": "hsl(40 55% 55% / 0.15)",
  "--a-border-faint": "hsl(40 55% 55% / 0.08)",
  "--a-chart-text": "rgba(255,255,255,0.55)",
  "--a-chart-label": "rgba(255,255,255,0.80)",
  "--a-tooltip-bg": "#211330",
  "--a-select-bg": "#211330",
};

export const lightVars: Record<string, string> = {
  "--a-bg": "#F5F0E8",
  "--a-sidebar": "#EDE3D2",
  "--a-card": "#FFFFFF",
  "--a-row-even": "#FDFAF6",
  "--a-row-odd": "#F5EFE5",
  "--a-border": "hsl(33 30% 80%)",
  "--a-border-soft": "hsl(33 30% 74%)",
  "--a-border-subtle": "hsl(33 30% 78%)",
  "--a-border-faint": "hsl(33 30% 85%)",
  "--a-chart-text": "hsl(30 12% 42%)",
  "--a-chart-label": "hsl(30 18% 20%)",
  "--a-tooltip-bg": "#FFFFFF",
  "--a-select-bg": "#FFFFFF",
};

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: "dark",
  isDark: true,
  toggleTheme: () => {},
  vars: darkVars,
});

export const AdminThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<AdminTheme>(() => {
    return (localStorage.getItem("admin-theme") as AdminTheme) || "light";
  });

  const isDark = theme === "dark";
  const vars = isDark ? darkVars : lightVars;

  const toggleTheme = () => {
    const next: AdminTheme = isDark ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("admin-theme", next);
  };

  return (
    <AdminThemeContext.Provider value={{ theme, isDark, toggleTheme, vars }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => useContext(AdminThemeContext);
