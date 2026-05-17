# Landing Page Specification — ZaaranżujTo

> Non-technical specification for the public marketing landing page at zaaranzujto.pl.
> Document type: Strategic / Product Marketing brief.
> Audience: Designer, copywriter, frontend implementer.

---

## 1. Strategic Diagnosis

### 1.1 Product Context

ZaaranżujTo is a B2C web application that generates AI-powered interior design visualizations. It is monetized via a **Hard Paywall** (no free trial, no freemium credits). The landing page is therefore the **only persuasive surface** between a cold visitor and a paying customer — it must do 100% of the convincing before the user is asked to sign up or pay.

### 1.2 Primary Target Persona

**"The New-Apartment Owner"** — an individual (B2C) who has just purchased or is about to receive a new apartment, house, or empty space, and now faces the daunting task of designing and furnishing it from scratch.

**Dominant emotional state: ANXIETY REDUCTION.**
This persona has typically just committed 500 000+ PLN to a property and is terrified of making expensive furnishing mistakes (a wrong sofa = 4 000 PLN lost, a wrong color palette = a regretted apartment). The product's real value is **pre-purchase visualization** — letting them _see_ the result before spending real money on furniture and finishes.

A secondary audience — people redecorating an existing room — may not be addressed in the hero, but may be naturally mentioned in other sections or/and captured by the same gallery and pricing.

### 1.3 Core Value Proposition

> **ZaaranżujTo helps people designing a new apartment or house achieve a realistic visualization of their future rooms — without paying thousands of PLN to a designer or spending weeks scrolling Pinterest.**

### 1.4 Displaced Alternatives

The landing page positions ZaaranżujTo against two concrete alternatives:

1. **Hiring an interior designer** — typically 3 000–8 000 PLN, slow, requires multiple meetings.
2. **Scrolling Pinterest / Instagram for hours** — free, but never shows _your_ room, only someone else's.

These are the two opponents named explicitly in the comparison table (see §3.4).

### 1.5 Key Conversion Risks

| Risk                                                       | Mitigation in this spec                                                                                                |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Hard Paywall with no trial → high bounce                   | Filterable gallery serves as the "demo"; pricing shown before signup                                                   |
| No testimonials yet (new product) → trust deficit          | Quality gallery + transparent pricing + FAQ carry the trust load in v1                                                 |
| Visitor sees "AI image generator" and dismisses as gimmick | "Iterate" step in How-It-Works + iteration sequences in gallery position it as a _design tool_, not a _prompt machine_ |
| Surprise paywall after signup → rage-quit                  | Pricing is visible on the landing page itself, well before any signup CTA fires                                        |

---

## 2. Page Goals & Success Criteria

### 2.1 Primary Goal

Drive qualified visitors (people seriously considering visualizing a new space) to click the primary CTA and proceed to signup with realistic expectations of paying.

### 2.2 Secondary Goal

For visitors not yet ready to buy, make the gallery memorable enough that they return when they are.

### 2.3 What this page must accomplish in ~3 seconds

1. The visitor understands this is a tool for **visualizing their future apartment/home interior**.
2. The visitor sees a **concrete price anchor** (e.g., "od X PLN") — no hidden cost surprise later.
3. The visitor sees a **real example output** within one scroll, proving the AI produces quality results.

---

## 3. Page Structure & Section-by-Section Specification

The landing page is a single scrollable page with the following section order. The order is deliberate: **the gallery comes before "How it Works"**, because visitors must believe the output looks good before they care about the process.

### 3.1 Section 1 — Hero

**Purpose:** Communicate the core promise + price anchor + primary CTA within 3 seconds.

**Content requirements:**

- **Headline:** Anxiety-reduction angle. Frames the product as pre-purchase risk mitigation, not aesthetic play.
  - Suggested direction (to be refined by copywriter): _"Zobacz, jak będzie wyglądać Twoje mieszkanie — zanim wydasz złotówkę na meble."_
- **Subheadline:** One sentence naming the persona + outcome + alternative being displaced. E.g., _"Wizualizacje wnętrz nowego mieszkania w kilka minut. Bez projektanta za 5 000 PLN, bez godzin na Pinterest."_
- **Primary CTA button:** **"Zacznij od X PLN"** (X = price of the smallest credit package).
- **Secondary link below CTA:** _"Zobacz przykłady ↓"_ — anchors to the gallery section for hesitant visitors.
- **Hero visual:** A single high-impact before/after pair OR a short looping animation showing a room evolving across iterations. No video required for v1.

**Notes for designer:**

- No navigation menu items beyond logo + (optional) "Zaloguj się" link in the top-right.
- Avoid generic stock interior photos — every visual must look like it came from the product itself.

---

### 3.2 Section 2 — Filterable Gallery

**Purpose:** Serve as the de facto product demo. This is the single most important section on the page.

**Content requirements:**

- A grid of real before/after visualizations generated by the application.
- **Two independent filters:**
  - **Room type:** salon, kuchnia, sypialnia, łazienka, pokój dziecięcy, biuro, przedpokój. (Final list to be locked once gallery assets are produced.)
  - **Style:** skandynawski, nowoczesny, industrialny, boho, klasyczny, minimalistyczny. (Final list TBD.)
- Each gallery item shows the **before** (original empty/raw room) and **after** (AI-generated design) side by side or via toggle.
- **At least 2–3 "iteration sequences"** must be included — items that show the same room evolving across 3 iterations (Iteration 1 → Iteration 2 → Iteration 3) to communicate the unique iterative-design value vs. one-shot AI tools.
- Minimum recommended gallery size for launch: **12–18 high-quality items** covering the main room types and styles.

**Copy:**

- Section title direction: _"Zobacz, co zaprojektujesz"_ or similar.
- Short intro line below title naming the iteration capability: _"Każdy projekt możesz dopracować w kolejnych iteracjach — aż będzie idealny."_

**Notes:**

- This is where the marketing team should invest the most effort for v1. A weak gallery kills the entire page regardless of how good the copy is.
- All gallery images must be downloaded/served at high resolution but compressed for web performance.

---

### 3.3 Section 3 — How It Works (4 Steps)

**Purpose:** Make the product feel achievable and demonstrate the iterative-design moat.

**Content requirements:** Exactly **4 numbered steps**, each with an icon/illustration and a short caption:

1. **Wgraj** — upload a photo of the empty room (or describe it in text if you don't have one yet).
2. **Skonfiguruj** — choose style, colors, and optionally add reference photos of furniture you like.
3. **Wygeneruj** — receive your first visualization in under a minute.
4. **Doprecyzuj** — iterate: change style, swap furniture, adjust the palette — without starting over.

**Notes:**

- Step 4 ("Doprecyzuj" / iterate) is non-negotiable. It is the section's strategic purpose: differentiating from ChatGPT/Midjourney/generic AI image tools.
- Use a small animated or static visual showing the same room evolving across the 4 steps.

---

### 3.4 Section 4 — Comparison Table

**Purpose:** Anchor against both displaced alternatives in a single scannable view.

**Structure:** A 3-column comparison table.

| Cecha                                  | Projektant wnętrz   | Pinterest + zgadywanie      | ZaaranżujTo                      |
| -------------------------------------- | ------------------- | --------------------------- | -------------------------------- |
| Koszt                                  | 3 000 – 8 000 PLN   | "Za darmo" (czas + pomyłki) | od X PLN                         |
| Czas do rezultatu                      | Tygodnie / miesiące | Godziny scrollowania        | Minuty                           |
| Personalizacja pod Twoje pomieszczenie | Tak                 | Nie (cudze wnętrza)         | Tak                              |
| Możliwość iteracji / zmian             | Ograniczona         | Brak                        | Bez limitu (1 kredyt / iteracja) |
| Wymaga umawiania spotkań               | Tak                 | Nie                         | Nie                              |

**Notes:**

- The Pinterest column is critical — it is the harder competitor because it _feels_ free. The row "Personalizacja pod Twoje pomieszczenie" is the line that kills that illusion.
- Visual treatment: ZaaranżujTo column should be subtly highlighted (e.g., colored background or border) without looking like a gimmicky "us vs. them" infographic.

---

### 3.5 Section 5 — Pricing

**Purpose:** Full price transparency before any signup commitment.

**Content requirements:**

- **Three credit packages** displayed as cards in a row: small / medium / large.
- Middle (medium) package is labeled **"Najpopularniejszy"** and visually highlighted.
- Each card shows:
  - Number of credits
  - Total price (PLN)
  - Effective per-credit cost
  - Single CTA button: **"Zacznij od X PLN"** (or package-specific variant)
- A short line under the cards: _"1 kredyt = 1 wygenerowana wizualizacja. Kredyty nie wygasają."_ (Adjust if PRD policy differs.)
- Payment method note: _"Płatność BLIK"_ (or whatever final payment methods are supported).

**Notes:**

- The middle package's per-credit price must be meaningfully better than the smallest package — this is the primary margin lever and the reason most users will choose it.
- Concrete prices and credit counts are configured via env/config per NFR-07 and are NOT hardcoded in this specification.

---

### 3.6 Section 6 — FAQ

**Purpose:** Handle last-mile objections for the skeptical 30%.

**Content requirements:**

- An FAQ section is required on the landing page.
- The number, wording, and ordering of specific questions is left to the copywriter/product team and is **out of scope for this specification**.
- Format: accordion-style (click to expand) to keep the section visually compact.

---

### 3.7 Section 7 — Final CTA

**Purpose:** Capture visitors who scrolled the entire page and are ready.

**Content requirements:**

- One clear, large CTA button: **"Zacznij od X PLN"**.
- A single supporting line above the button — reinforcing the core promise once more (e.g., _"Zaprojektuj swoje nowe mieszkanie w kilka minut."_).
- No other distractions, links, or fields in this section.

---

### 3.8 Footer

**Purpose:** Minimal legal + contact surface.

**Content requirements:**

- Mailto contact link (per PRD §6 "In Scope").
- Link to Terms of Service / Regulamin (when available).
- Copyright line.
- (Optional) language switcher placeholder if/when EN is added post-MVP.

---

## 4. Conversion Mechanics

### 4.1 Primary CTA Strategy

- **Consistent copy across all placements:** **"Zacznij od X PLN"** (hero, mid-page, final CTA).
- Rationale: combines transparency (price visible), low commitment (anchored on smallest package), and action verb ("zacznij" implies creation, not bureaucracy).
- **Forbidden CTA copy:** "Załóż konto" (sounds like work), "Wypróbuj teraz" (too vague, implies a free trial that doesn't exist), "Kup teraz" (too transactional before the value has landed).

### 4.2 Secondary CTA

- In the hero only: a text link **"Zobacz przykłady ↓"** that scrolls to the gallery. This catches hesitant visitors and routes them to the strongest persuasion surface (gallery) rather than losing them to a bounce.

### 4.3 Pricing Transparency Rule

Pricing must be visible on the landing page itself, before any signup form is shown. The flow `landing → signup → surprise paywall` is explicitly forbidden — it produces the worst conversion outcome (rage-quit drop-off) for Hard Paywall products.

---

## 5. Tone & Voice Guidelines

- **Language:** Polish only for v1 (per PRD §6).
- **Tone:** Calm, confident, practical. The target persona is anxious about an expensive decision — over-hyped marketing language ("Rewolucyjna AI! Niesamowite!") backfires by triggering skepticism.
- **Avoid:** generic tech-marketing words like "innowacyjny," "rewolucyjny," "zaawansowany." These add no information and signal that the writer has nothing concrete to say.
- **Prefer:** concrete numbers (PLN, minutes, number of styles), concrete outcomes ("zobacz swoją kuchnię w stylu skandynawskim"), and concrete fears named directly ("zanim kupisz sofę za 4 000 PLN").

---

## 6. Visual & Layout Guidelines

- **Visual hierarchy:** Each section should be visually distinct (alternating background tones or generous whitespace) so the user can scan the page without reading every word.
- **Imagery rule:** Every image on the page must look like it came from the product. No stock photos of generic interiors. No AI illustrations of robots, brains, or sparkles.
- **Dark/Light mode:** Per PRD §6, the application supports dark/light mode. The landing page should respect the system preference and offer the same visual quality in both modes.
- **Mobile:** All sections must work on mobile. The comparison table should reflow vertically (one column per alternative, stacked) rather than being horizontally scrollable.
- **Performance:** The filterable gallery is image-heavy — implement lazy loading and modern image formats (WebP/AVIF) to keep initial load fast.

---

## 7. Out of Scope (v1 Landing Page)

The following elements were deliberately considered and excluded from the v1 landing page to keep effort focused on the gallery:

- Customer testimonials / reviews (none exist yet for a new product).
- Founder story / "About" section.
- Explainer video or screen recording.
- Press logos / "featured in" section.
- Live interactive demo / try-before-signup widget.
- Volume / social-proof metrics ("X wizualizacji wygenerowanych").
- Money-back guarantee / refund policy callout.
- Blog / SEO content for the "future apartment planner" persona.
