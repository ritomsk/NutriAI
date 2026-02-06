# Design Specification: Site Structure & Layout For Home Page(Dashboard)

**Layout Philosophy:** Single-page view with central focus, utilizing "Z-Pattern" scanning for navigation.

---
**Tech Stack:** React(javascript), Tailwind CSS, Framer Motion

## 1. High-Level Layout Strategy

The page is divided into three distinct vertical zones. The background (Mesh Gradient) remains fixed or covers the entire viewport (`100vh`) to maintain continuity.

* **Zone A (Top):** Navigation Bar (Fixed/Sticky)
* **Zone B (Center):** Hero/Main Action Area (Vertically & Horizontally Centered)
* **Zone C (Bottom):** Footer (Anchored to bottom)

---

## 2. Component Specifications

### Zone A: The Navigation Bar
* **Position:** Fixed at the top (`top: 0`, `width: 100%`).
* **Z-Index:** High (Must float above all other content).
* **Visual Style:** Glassmorphism (Frosted glass effect).
* **Layout:** Flexbox (`justify-content: space-between`, `align-items: center`).

#### Left Section: Branding
* **Container:** Flex row.
* **Elements:**
    * **Logo Icon:** 32x32px (SVG).
    * **Brand Name:** Bold Text (e.g., "IngredientAI"), Size 20px or 1.25rem.

#### Right Section: Navigation Links
* **Container:** Flex row with gap (approx. `2rem` or `32px`).
* **Items:**
    1.  **"About"** (Anchor link).
    2.  **"Help"** (Anchor link).
    3.  **"Get Started"** (Primary Nav Button or Link).
        * *Style:* Distinct from other links (e.g., pill-shaped border or filled background).

---

### Zone B: The Hero Section (Middle)
This section occupies the majority of the viewport height (e.g., `min-h-screen` minus header/footer height).

* **Layout:** Flex Column (`flex-direction: column`).
* **Alignment:** Perfectly centered (`justify-content: center`, `align-items: center`).
* **Spacing:** Large gap between Heading and CTA Button (`margin-bottom: 2rem`).

#### Element 1: Main Heading
* **Content:** The core value proposition (e.g., "Decode Your Food Instantly").
* **Typography:**
    * Size: `H1` (approx. 3.5rem to 4.5rem).
    * Weight: Bold / ExtraBold.
    * Alignment: Center.
    * *Effect:* Optional slight gradient text fill to match background vibe.

#### Element 2: Sub-heading (Optional)
* **Content:** Short description (e.g., "AI-powered analysis for safer eating").
* **Style:** Muted gray, smaller font size.

#### Element 3: The "Chat" CTA Button
* **Action:** Redirects to `/chat`.
* **Shape:** Pill / Rounded (`border-radius: 9999px`).
* **Size:** Large (Padding: `16px 32px`).
* **Visuals:**
    * Background: Gradient or Primary Brand Color.
    * Text: White (for contrast).
    * Shadow: Soft glow shadow.
* **Interaction:** Scale up slightly on hover.

---

### Zone C: The Footer
* **Position:** Static (at the end of content) or Fixed Bottom (if content is sparse).
* **Layout:** Simple Flex or Grid.
* **Visual Style:** Minimalist. No background color (transparent) or very subtle border-top.
* **Content:**
    * Copyright Text (© 2026 BrandName).
    * Secondary Links (Privacy Policy, Terms of Service).
    * Social Media Icons (Optional, muted colors).

---

## 3. Responsive Behavior (Mobile)

* **Navbar:** The "Right Side" links collapse into a Hamburger Menu icon.
* **Hero Section:**
    * Heading size reduces (approx. 2.5rem).
    * Padding on sides increases to prevent text touching edges.
* **Footer:** Stacks vertically (Copyright on top, links below).

---

## 4. Simplified Wireframe View

```text
+-------------------------------------------------------+
| [Logo BrandName]              [About] [Help] [Start]  |  <-- Glass Navbar
+-------------------------------------------------------+
|                                                       |
|                                                       |
|                                                       |
|              THE MAIN HEADING GOES HERE               |  <-- Centered H1
|                                                       |
|               [ GO TO CHAT BUTTON ]                   |  <-- Redirects to /chat
|                                                       |
|                                                       |
|                                                       |
+-------------------------------------------------------+
| © 2026 BrandName | Privacy | Terms                    |  <-- Minimal Footer
+-------------------------------------------------------+