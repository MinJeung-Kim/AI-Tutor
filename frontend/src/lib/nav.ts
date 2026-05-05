export const NAV_ITEMS = [
  { href: "/",         label: "홈",   icon: "home"     },
  { href: "/chat",     label: "AI 튜터", icon: "chat"  },
  { href: "/quiz",     label: "퀴즈",  icon: "quiz"    },
  { href: "/progress", label: "진도",  icon: "progress" },
] as const;

export type NavIcon = (typeof NAV_ITEMS)[number]["icon"];