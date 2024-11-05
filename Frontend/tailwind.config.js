/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system", // Apple devices
          "BlinkMacSystemFont", // macOS
          "Segoe UI", // Windows
          "Roboto", // Google Fonts
          "Oxygen", // Linux
          "Ubuntu", // Linux
          "Cantarell", // Linux
          "Fira Sans", // Mozilla
          "Droid Sans", // Android
          "Helvetica Neue", // macOS fallback
          "Arial", // General fallback
          "sans-serif", // Generic fallback
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        myColor: "#474954 ", //BG MAIN - 474954            392F5A
        myDarkColor: "#343432", //BG SECONDARY - 343432    25283d
        mySecondaryColor: '#74C171', //GREEN - 74C171      a6d3a0
        myThirdColor: '#D7DEDC', //WHITE - D7DEDC          E7DFC6
        myFourthColor: '#FF6B6B', //RED - FF6B6B           bc2c1a
        myFifthColor: '#b198eb', //PURPLE - b198eb         377771
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
