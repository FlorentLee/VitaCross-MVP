import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        sidebar: {
          bg: "var(--sidebar-bg)",
          hover: "var(--sidebar-hover)",
          active: "var(--sidebar-active)",
        },
        bg: {
          main: "var(--bg-main)",
        },
        card: {
          DEFAULT: "var(--card-bg)",
        },
        text: {
          main: "var(--text-main)",
          muted: "var(--text-muted)",
          light: "var(--text-light)",
        },
        border: {
          light: "var(--border-light)",
          dark: "var(--border-dark)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
      },
      width: {
        sidebar: "var(--sidebar-width)",
      },
    },
  },
  plugins: [],
};
export default config;
