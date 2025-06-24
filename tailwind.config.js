/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-sora)', 'sans-serif'],
      },

      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",

        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },

        // Custom colors
        neon: {
          green: "#39FF14",
        },
        deep: {
          navy: "#0D1117",
        },
        light: {
          gray: "#E6EDF3",
        },
        medium: {
          gray: "#8B949E",
        },
      },

      boxShadow: {
        "neon-glow": "0 0 15px rgba(57, 255, 20, 0.5), 0 0 5px rgba(57, 255, 20, 0.7)",
        "neon-glow-hover": "0 0 20px rgba(57, 255, 20, 0.7), 0 0 10px rgba(57, 255, 20, 1)",
      },

      keyframes: {
        "scroll-ticker": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "price-flash-green": {
          "0%": { backgroundColor: "rgba(57, 255, 20, 0)" },
          "50%": { backgroundColor: "rgba(57, 255, 20, 0.25)" },
          "100%": { backgroundColor: "rgba(57, 255, 20, 0)" },
        },
        "price-flash-red": {
          "0%": { backgroundColor: "rgba(239, 68, 68, 0)" },
          "50%": { backgroundColor: "rgba(239, 68, 68, 0.25)" },
          "100%": { backgroundColor: "rgba(239, 68, 68, 0)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },

      animation: {
        "scroll-ticker": "scroll-ticker 40s linear infinite",
        "flash-green": "price-flash-green 1s ease-out",
        "flash-red": "price-flash-red 1s ease-out",
        "fade-in": "fade-in 1s ease-in forwards",
        "slide-up": "slide-up 1s ease-out forwards",
      },
    },
  },

  plugins: [
    require("tailwindcss-animate"),
  ],
};
