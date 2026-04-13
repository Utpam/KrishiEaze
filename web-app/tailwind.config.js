module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['var(--font-sans)'],
      serif: ['var(--font-serif)'],
    },
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        secondary: 'var(--secondary)',
        'background-light': 'var(--background-light)',
        'background-dark': 'var(--background-dark)',
        'card-light': 'var(--card-light)',
        'card-dark': 'var(--card-dark)',
        'text-light': 'var(--text-light)',
        'text-dark': 'var(--text-dark)',
        'surface-dark': 'var(--surface-dark)',
        'surface-dark-2': 'var(--surface-dark-2)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
