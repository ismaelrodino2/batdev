export const SITE = {
  name: "BatDev",
  tagline: "Notes from building things that ship",
  description:
    "BatDev — Ismael Rodino writing about software architecture, AI engineering, performance and the trade-offs behind real production systems.",
  url: "https://batdev.vercel.app",
  locale: "en_US",
  author: {
    name: "Ismael Rodino",
    fullName: "Ismael Tavares Rodino",
    role: "Senior Software Engineer",
    email: "ismael.rodino@hotmail.com",
    github: "https://github.com/ismaelrodino2",
    linkedin: "https://www.linkedin.com/in/ismael-tavares/",
    portfolio: "https://ismaelrodino.vercel.app"
  },
  repository: "https://github.com/ismaelrodino2/batdev"
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Writing" },
  { href: "/about", label: "About" }
] as const;
