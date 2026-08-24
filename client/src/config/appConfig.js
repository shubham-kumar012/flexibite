export const APP_CONFIG = {
  name: "FlexiBite",
  tagline: "Indian Nutrition • Made Simple",
  logoUrl: "/logo.png",
  heroImageUrl: "/hero.jpg",
  // apiBaseUrl: "http://localhost:5002/api",
  apiBaseUrl: "flexibite-production.up.railway.app/api",
  navLinks: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Nutrition", href: "#nutrition" },
    { label: "About", href: "#about" },
  ],
  routes: {
    home: "/",
    login: "/login",
    signup: "/signup",
    profile: "/profile",
    onboarding: "/onboarding",
  }
};
