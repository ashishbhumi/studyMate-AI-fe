/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
    },

    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Playfair Display", "serif"],
      },

      colors: {
        /* ==========================
            PRIMARY GOLD
        ========================== */

        primary: {
          50: "#fffdf7",
          100: "#fff8e8",
          200: "#fdeec3",
          300: "#f9df8c",
          400: "#f3cf5b",
          500: "#d4af37", // Royal Gold
          600: "#b99124",
          700: "#967417",
          800: "#6d540d",
          900: "#4b3806",
        },

        /* ==========================
            NEUTRAL
        ========================== */

        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },

        /* ==========================
            BACKGROUND
        ========================== */

        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#FCFBF8",
          tertiary: "#F7F5F1",
          dark: "#111111",
        },

        /* ==========================
            SURFACE
        ========================== */

        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#FAFAFA",
          elevated: "#FFFFFF",
          dark: "#1E1E1E",
        },

        /* ==========================
            TEXT
        ========================== */

        text: {
          primary: "#111827",
          secondary: "#4B5563",
          muted: "#9CA3AF",
          light: "#FFFFFF",
        },

        /* ==========================
            BORDER
        ========================== */

        border: {
          DEFAULT: "#E5E7EB",
          light: "#F3F4F6",
          dark: "#D1D5DB",
          gold: "#E7C873",
        },

        /* ==========================
            STATUS COLORS
        ========================== */

        success: {
          light: "#DCFCE7",
          DEFAULT: "#16A34A",
          dark: "#166534",
        },

        warning: {
          light: "#FEF3C7",
          DEFAULT: "#F59E0B",
          dark: "#92400E",
        },

        danger: {
          light: "#FEE2E2",
          DEFAULT: "#DC2626",
          dark: "#991B1B",
        },

        info: {
          light: "#DBEAFE",
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
        },
      },

      /* ==========================
            FONT SIZE
      ========================== */

      fontSize: {
        xs: ["0.75rem", "1rem"],
        sm: ["0.875rem", "1.25rem"],
        base: ["1rem", "1.6rem"],
        lg: ["1.125rem", "1.8rem"],
        xl: ["1.25rem", "1.8rem"],
        "2xl": ["1.5rem", "2rem"],
        "3xl": ["1.875rem", "2.3rem"],
        "4xl": ["2.25rem", "2.7rem"],
        "5xl": ["3rem", "1.1"],
        "6xl": ["3.75rem", "1.1"],
      },

      /* ==========================
            SPACING
      ========================== */

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
      },

      /* ==========================
            BORDER RADIUS
      ========================== */

      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "24px",
        "3xl": "32px",
      },

      /* ==========================
            SHADOWS
      ========================== */

      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.05)",

        sm: "0 2px 6px rgba(0,0,0,.08)",

        DEFAULT: "0 4px 12px rgba(0,0,0,.08)",

        md: "0 10px 30px rgba(0,0,0,.10)",

        lg: "0 20px 45px rgba(0,0,0,.12)",

        xl: "0 30px 60px rgba(0,0,0,.15)",

        card: "0 10px 30px rgba(17,24,39,0.08)",

        premium: "0 12px 40px rgba(212,175,55,0.18)",

        glow: "0 0 30px rgba(212,175,55,0.25)",
      },

      /* ==========================
            GRADIENTS
      ========================== */

      backgroundImage: {
        hero: "linear-gradient(135deg,#ffffff 0%,#fcfbf8 40%,#f5edd5 100%)",

        gold: "linear-gradient(135deg,#D4AF37,#F7E7A1)",

        premium: "linear-gradient(145deg,#ffffff,#f9f7f2)",

        dark: "linear-gradient(135deg,#111827,#1F2937)",
      },

      /* ==========================
            TRANSITIONS
      ========================== */

      transitionTimingFunction: {
        premium: "cubic-bezier(.4,0,.2,1)",
      },

      transitionDuration: {
        400: "400ms",
        600: "600ms",
      },

      /* ==========================
            ANIMATION
      ========================== */

      keyframes: {
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },

        float: {
          "0%,100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-8px)",
          },
        },
      },

      animation: {
        fadeUp: "fadeUp .6s ease forwards",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },

  plugins: [],
};
