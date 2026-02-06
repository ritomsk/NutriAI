/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                surface: {
                    ground: '#FAFAFA',
                    glass: 'rgba(255, 255, 255, 0.65)',
                    'glass-high': 'rgba(255, 255, 255, 0.85)',
                },
                mesh: {
                    mint: '#A7F3D0',
                    coral: '#FECACA',
                    lavender: '#E9D5FF',
                },
                status: {
                    safe: '#059669',
                    'safe-bg': '#ECFDF5',
                    warn: '#D97706',
                    danger: '#DC2626',
                    'danger-bg': '#FEF2F2',
                },
                border: {
                    glass: 'rgba(255, 255, 255, 0.4)',
                },
                text: {
                    primary: '#1F2937',
                    body: '#4B5563',
                    muted: '#9CA3AF',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Merriweather', 'serif'],
            },
            boxShadow: {
                glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                hover: '0 12px 40px 0 rgba(31, 38, 135, 0.12)',
                'glow-green': '0 0 20px rgba(5, 150, 105, 0.2)',
            }
        },
    },
    plugins: [],
}
