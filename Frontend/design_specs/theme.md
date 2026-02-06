# Design Theme & System Specification

**Design Language:** "Organic Glass"
**Version:** 1.0

This document defines the global variables, color systems, and effect tokens required to implement the visual style described in `third.md` and `second.md`.
Override any color systems and effect from first.md if collides.
---

## 1. The Color System

We utilize a **Semantic Color Strategy**. Colors are named by their function (e.g., `status-safe`) rather than their hue (e.g., `light-green`). This ensures consistency across the "Ingredient Cards" and "Summary Box."

### A. Base Palette (The Canvas)
The foundation of the "Light & Gradient" vibe.

| Token Name | Hex Value | Usage |
| :--- | :--- | :--- |
| `surface-ground` | `#FAFAFA` | The absolute bottom layer of the page body. |
| `surface-glass` | `rgba(255, 255, 255, 0.65)` | Background for Navbar, Input Box, and Cards. |
| `surface-glass-high`| `rgba(255, 255, 255, 0.85)` | Background for Dropdowns and Tooltips (higher opacity). |
| `border-glass` | `rgba(255, 255, 255, 0.4)` | Subtle borders on glass elements to create depth. |

### B. The Mesh Gradient (Brand Identity)
These colors form the moving background blobs.

| Token Name | Hex Value | Role |
| :--- | :--- | :--- |
| `mesh-mint` | `#A7F3D0` | Represents "Natural/Safe" (Top Right Blob). |
| `mesh-coral` | `#FECACA` | Represents "Caution/Organic" (Bottom Left Blob). |
| `mesh-lavender`| `#E9D5FF` | Represents "AI/Intelligence" (Center/Moving Blob). |

### C. Semantic Status Colors (The Data)
Used specifically for the **Ingredient Cards** and **Confidence Meter**.

| Token Name | Hex Value | Usage |
| :--- | :--- | :--- |
| `status-safe` | `#059669` (Emerald 600) | "Safe" Cards, High Confidence Score, Success Toasts. |
| `status-safe-bg`| `#ECFDF5` (Emerald 50) | Background tint for "Safe" Summary Box. |
| `status-warn` | `#D97706` (Amber 600) | "Moderate" Cards, Medium Confidence. |
| `status-danger`| `#DC2626` (Red 600) | "Avoid" Cards, Low Confidence, Error Messages. |
| `status-danger-bg`| `#FEF2F2` (Red 50) | Background tint for "Danger" Summary Box. |

### D. Typography Colors
High contrast is required for accessibility on the light glass background.

| Token Name | Hex Value | Usage |
| :--- | :--- | :--- |
| `text-primary` | `#1F2937` (Gray 900) | Main Headings, Ingredient Names. |
| `text-body` | `#4B5563` (Gray 600) | Explanatory text, Descriptions. |
| `text-muted` | `#9CA3AF` (Gray 400) | Placeholders, Footers, Low-priority labels. |

---

## 2. Typography System

**Headings:** *Inter* or *Plus Jakarta Sans*
* **H1 (Hero):** 3.75rem (60px) / Bold / Tracking -0.02em.
* **H2 (Section Titles):** 2.25rem (36px) / SemiBold.
* **H3 (Card Titles):** 1.25rem (20px) / SemiBold.

**Body:** *Merriweather* (Serif) or *Inter* (Sans)
* *Design Choice:* Use *Merriweather* for the "AI Analysis" text to give it an editorial, "encyclopedia" feel. Use *Inter* for UI elements (buttons, nav).
* **Body-Lg:** 1.125rem (18px) / Height 1.6 (Summary Box).
* **Body-Base:** 1rem (16px) / Height 1.5 (Ingredient Descriptions).

---

## 3. Effects & Depth System

To achieve the "Ethereal" look, we rely heavily on shadows and blurs rather than solid borders.

### A. Box Shadows
| Token Name | CSS Value | Usage |
| :--- | :--- | :--- |
| `shadow-glass` | `0 8px 32px 0 rgba(31, 38, 135, 0.07)` | Standard depth for Cards and Input Box. |
| `shadow-hover` | `0 12px 40px 0 rgba(31, 38, 135, 0.12)` | Interaction state for cards. |
| `shadow-glow-green`| `0 0 20px rgba(5, 150, 105, 0.2)` | Success state or Safe Card highlight. |

### B. Glassmorphism Utilities (CSS Classes)
```css
/* The standard glass panel */
.glass {
  background: var(--surface-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-glass);
}

/* The active/hover state for glass */
.glass:hover {
  background: var(--surface-glass-high);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}