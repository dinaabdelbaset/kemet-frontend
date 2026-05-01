import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import fs from "fs"
import { VitePWA } from "vite-plugin-pwa"

// ── Auto-copy AI-generated images to public/images on dev server start ──
const BRAIN = "C:/Users/Technologist/.gemini/antigravity/brain/c2d84a60-43f5-453b-b555-f79cac85e55b"
const imagesToCopy: Record<string, string> = {
  // Egypt Through Time era images
  "era-pharaonic.png":   `${BRAIN}/pharaonic_egypt_pyramids_1775066991910.png`,
  "era-greco-roman.png": `${BRAIN}/greco_roman_alexandria_1775067015936.png`,
  "era-coptic.png":      `${BRAIN}/coptic_egypt_church_1775067032759.png`,
  "era-islamic.png":     `${BRAIN}/islamic_egypt_cairo_1775066959857.png`,
  "era-modern.png":      `${BRAIN}/modern_egypt_capital_1775066974390.png`,
  // Popular Tours
  "tour-pyramids.png":      `${BRAIN}/pyramids_cairo_tour_1775071147110.png`,
  "tour-nile-cruise.png":   `${BRAIN}/nile_dinner_cruise_tour_1775071112255.png`,
  "tour-red-sea.png":       `${BRAIN}/red_sea_snorkeling_tour_1775071131863.png`,
  "tour-desert-safari.png": `${BRAIN}/desert_safari_atv_tour_1775071172281.png`,
  "tour-cairo-food.png":    `${BRAIN}/cairo_food_tour_street_1775071188045.png`,
  "tour-museum.png":        `${BRAIN}/egyptian_museum_guided_1775071206904.png`,
}

const EVENTS_BRAIN = "C:/Users/Technologist/.gemini/antigravity/brain/66fb5c08-f331-460b-90d0-ebc614abb105"
const eventsToCopy: Record<string, string> = {
  "event_book_fair.png":             `${EVENTS_BRAIN}/event_book_fair_1775182462625.png`,
  "event_cairo_jazz.png":            `${EVENTS_BRAIN}/event_cairo_jazz_1775182429105.png`,
  "event_hero_banner.png":           `${EVENTS_BRAIN}/event_hero_banner_1775182476585.png`,
  "event_opera_aida.png":            `${EVENTS_BRAIN}/event_opera_aida_1775182414340.png`,
  "event_pyramids_light_show.png":   `${EVENTS_BRAIN}/event_pyramids_light_show_1775182379397.png`,
  "event_red_sea_edm.png":           `${EVENTS_BRAIN}/event_red_sea_edm_1775182448774.png`,
  "event_whirling_dervishes.png":    `${EVENTS_BRAIN}/event_whirling_dervishes_1775182399411.png`,
}

function autoCopyImagesPlugin() {
  return {
    name: "auto-copy-images",
    buildStart() {
      const destDir = path.resolve(__dirname, "public/images")
      const eventsDir = path.resolve(__dirname, "public/events")
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
      if (!fs.existsSync(eventsDir)) fs.mkdirSync(eventsDir, { recursive: true })
      
      for (const [destName, srcPath] of Object.entries(imagesToCopy)) {
        const destPath = path.join(destDir, destName)
        try {
          if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath)
          }
        } catch { /* silent */ }
      }

      for (const [destName, srcPath] of Object.entries(eventsToCopy)) {
        const destPath = path.join(eventsDir, destName)
        try {
          if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath)
            console.log(`✅ Copied Event Image: ${destName}`)
          }
        } catch { /* silent */ }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    autoCopyImagesPlugin(), 
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Kemet - Egypt Tourism Platform',
        short_name: 'Kemet',
        description: 'Explore the wonders of Egypt, book tours, and plan your journey.',
        theme_color: '#D4AF37',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/11516/11516147.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/11516/11516147.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Heavy 3D library — only loads with GlobeSection
          "three-vendor": ["three", "@react-three/fiber", "@react-three/drei"],
          // Animation library
          "gsap-vendor": ["gsap"],
          // React core
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // UI libraries
          "ui-vendor": ["lucide-react", "react-icons"],
        },
      },
    },
    // Warn when chunks exceed 800KB
    chunkSizeWarningLimit: 800,
  },
})