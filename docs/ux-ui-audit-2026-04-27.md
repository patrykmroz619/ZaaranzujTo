# Audyt UX/UI — 2026-04-27

Analiza interfejsu aplikacji `platform-web` przeprowadzona równolegle przez cztery subagenty (dashboard + landing, projekty, workspace, kredyty/ustawienia/nawigacja). Poniżej zsyntetyzowana, odfiltrowana lista propozycji ulepszeń pogrupowana według priorytetu.

## Wykonane wcześniej zmiany copy (pl.json)

W tej samej iteracji zostały już zastosowane poprawki tekstów w `apps/platform-web/src/i18n/messages/pl.json`:

- `landing.heroSubtitle` — usunięta dwuznaczność „opisz je słowami"
- `dashboard.welcomeSubtitle`, `dashboard.ctaHeading` — naturalniejszy język
- `dashboard.topUpCreditsDesc`, `dashboard.emptyDescription`, `dashboard.emptyCta` — pełniejsze, mniej powtórzeń
- `workspace.chosenAttributes` (atrybuty → ustawienia), `workspace.lockedAttributesHint`, `workspace.requiresCredit`, `workspace.generatingMessage`, `workspace.editPromptPlaceholder` (przecinek), `workspace.prompt` (Opis wizji → Opis wnętrza), `workspace.emptyVisualizationHint`
- `project.iterations` / `latestIteration` / `iteration` / `deleteVisualizationConfirmMessage` — `iteracje` → `wersje` (mniej żargonu)
- `project.create`, `dashboard.emptyCta` — `Stwórz` → `Utwórz` (formalniejsze w formularzach)

---

## Wysoki priorytet — duży wpływ na UX

### Workspace

#### 1. Pole uploadu zdjęcia powinno być opcjonalne

- **Pliki**: `apps/platform-web/src/modules/workspace/components/WorkspaceCreateForm/WorkspaceCreateForm.tsx`, `PhotoUpload.tsx`
- **Problem**: Formularz zawsze wymaga zdjęcia, mimo że i18n sugeruje istnienie trybu „od podstaw". Użytkownik nie może wygenerować wizualizacji wyłącznie z opisu.
- **Propozycja**: Uczyń `PhotoUpload` opcjonalnym (bez tabów / radio). Pod inputem dodaj hint typu „Opcjonalnie — dodaj zdjęcie pomieszczenia, aby AI zachowała jego układ. Bez zdjęcia wizualizacja powstanie wyłącznie z opisu." Walidacja: wymagaj albo zdjęcia, albo wypełnionego `prompt`.

#### 2. Walidacja rozmiaru pliku po stronie klienta

- **Pliki**: `apps/platform-web/src/modules/workspace/components/PhotoUpload/PhotoUpload.tsx`
- **Problem**: Brak limitu rozmiaru przed uploadem. Komunikat `errors.fileTooLarge` przychodzi dopiero z serwera. Użytkownik nie wie, jaki rozmiar jest akceptowany.
- **Propozycja**: `MAX_FILE_SIZE = 10MB`, walidacja w `onChange` przed `form.setValue`, hint pod labelem („max 10 MB, JPG/PNG/WEBP").

#### 3. Komunikat o braku kredytów jest zbyt pasywny

- **Pliki**: `WorkspaceCreateForm.tsx:258-269`, `WorkspaceIterationForm.tsx:90-101`
- **Problem**: Mały tekst + mały link „Kup kredyty". Brak informacji o cenie generowania.
- **Propozycja**: Wyraźna karta z wiadomością „Generowanie kosztuje 1 kredyt", przycisk `gradient-warm` `size="default"` zamiast `sm`, ikona ostrzeżenia.

### Karty projektów / wizualizacji

#### 4. Menu kontekstowe na karcie projektu znika na mobile

- **Pliki**: `apps/platform-web/src/modules/projects/components/ProjectCard/ProjectCard.tsx:48`
- **Problem**: `opacity-0 group-hover:opacity-100` — na touch device nie ma zdarzenia hover, więc menu nigdy się nie pojawia.
- **Propozycja**: `md:opacity-0 md:group-hover:opacity-100` (zachowuje efekt na desktop, zawsze widoczne na mobile).

#### 5. Tytuł strony szczegółów projektu nie zawiera nazwy

- **Pliki**: `apps/platform-web/src/views/projects/ProjectDetailView.tsx:34`
- **Problem**: `PageHeader title={t("project.title")}` zwraca tylko „Projekt". Użytkownik nie widzi, w którym projekcie jest.
- **Propozycja**: Pobierz dane projektu i wyświetl `project.name` jako `title`, datę modyfikacji jako `subtitle`.

#### 6. Dialog usuwania bez konkretnych konsekwencji

- **Pliki**: `apps/platform-web/src/modules/projects/components/DeleteProjectDialog/DeleteProjectDialog.tsx`, `pl.json`
- **Problem**: „Wszystkie wizualizacje zostaną usunięte" — bez liczby.
- **Propozycja**: Wstrzyknij liczbę: „Projekt »{name}« zawiera {count} wizualizacji. Tej operacji nie można cofnąć." Wymaga klucza i18n z placeholderami.

### Kredyty / saldo

#### 7. Saldo niewidoczne na stronie kredytów podczas zakupu

- **Pliki**: `apps/platform-web/src/views/credits/CreditsView.tsx`
- **Problem**: Loading state pokazuje samo „kredytów" bez wartości.
- **Propozycja**: Wyraźna sekcja „Twoje saldo: X kredytów" nad listą pakietów; aktualizuj po zakupie.

#### 8. Brak informacji „1 kredyt = 1 wizualizacja"

- **Pliki**: `apps/platform-web/src/modules/credits/components/CreditPackageCard/CreditPackageCard.tsx`, `pl.json`
- **Problem**: Użytkownik nie wie, co dostaje za pakiet. Brak konwersji kredyty → wizualizacje.
- **Propozycja**: Dodaj na karcie pakietu drugi wiersz „≈ N wizualizacji" + jedno zdanie wyjaśnienia na górze strony (`credits.creditsPerGeneration`).

---

## Średni priorytet

### Dashboard

#### 9. Dodaj trzecią statystykę — liczba wizualizacji

- **Pliki**: `DashboardView.tsx:39-42`
- **Problem**: `StatsCard` pokazuje tylko projekty i kredyty. Liczba wizualizacji to główna metryka aktywności.
- **Propozycja**: Trzecia karta `StatsCard` (wymaga endpointa lub agregacji w API).

#### 10. `RecentProjects` bez „Zobacz wszystkie"

- **Pliki**: `apps/platform-web/src/modules/dashboard/components/RecentProjects/RecentProjects.tsx`
- **Problem**: Pokazane 3 ostatnie projekty, ale brak linku do pełnej listy.
- **Propozycja**: Link `Wszystkie projekty →` po prawej stronie nagłówka sekcji.

#### 11. Duplikat CTA do `/projects`

- **Pliki**: `QuickActions.tsx`, `RecentProjects.tsx`
- **Problem**: Zarówno kafelek w QuickActions jak i przycisk w RecentProjects prowadzą do tej samej strony.
- **Propozycja**: Pozostaw link w nagłówku `RecentProjects` (#10), usuń kafelek z `QuickActions`. Zwolnione miejsce można wykorzystać na rzeczywiste „Ostatnia wizualizacja" z miniaturą.

### Listy / formularze

#### 12. Daty bezwzględne zamiast względnych

- **Pliki**: `ProjectCard.tsx`
- **Problem**: „Utworzono 2026-04-25" jest mniej czytelne niż „2 dni temu".
- **Propozycja**: Helper z `Intl.RelativeTimeFormat` (lokalizacja PL gotowa). Użyj na kartach projektów i w `latestIteration`.

#### 13. Licznik znaków w polach z `maxLength`

- **Pliki**: `EditProjectNameDialog.tsx`, `CreateProjectDialog.tsx`, nazwa wizualizacji w `WorkspaceCreateForm.tsx`
- **Problem**: `maxLength=100` bez wizualnego counter — użytkownik nie wie, że jest blokowany.
- **Propozycja**: `{value.length}/100` pod inputem, kolor `text-warning` przy >80.

#### 14. Sortowanie listy projektów

- **Pliki**: `ProjectsView.tsx`
- **Problem**: API obsługuje `sort`, ale UI go nie ujawnia.
- **Propozycja**: `Select` na górze listy: Najnowsze / Najstarsze / Nazwa A-Z.

### Settings

#### 15. Usuwanie konta to jeden klik

- **Pliki**: `apps/platform-web/src/modules/settings/components/AccountActions/AccountActions.tsx:22-24`
- **Problem**: Tylko `window.confirm`. Brak realnego zabezpieczenia.
- **Propozycja**: Modal z polem „wpisz `USUŃ KONTO`, aby potwierdzić" jako warunek aktywacji przycisku. Krótki, statyczny opis konsekwencji (utrata projektów, wizualizacji i salda kredytów) bez konkretnych liczb — bez dodatkowych zapytań do API.

#### 16. Brak selektora języka

- **Pliki**: `SettingsView.tsx`
- **Problem**: Aplikacja używa `next-intl`, ale nie ma UI do zmiany języka.
- **Propozycja**: Sekcja „Język" z `Select` PL/EN. Struktura jest gotowa, dodanie selectora to drobna zmiana — nawet jeśli `en.json` jeszcze nie jest pełne, lepiej mieć fundament.

---

## Nice-to-have

| #   | Pozycja                                                                                    | Plik / obszar                                  |
| --- | ------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| 17  | Drag & drop dla `FurniturePhotosField` (obecnie tylko klik)                                | `FurniturePhotosField.tsx`                     |
| 18  | Wymagane pola formularzy oznaczone jako `required` + komunikaty walidacji pod polami       | `WorkspaceCreateForm.tsx`, formularze ogólnie  |
| 19  | 404 — przycisk „Wróć" (`router.back()`) obok linku do dashboardu                           | `app/(app)/not-found.tsx`                      |
| 20  | Globalny `ErrorBoundary` + toast retry mapujący `error.code` na `errors.*`                 | core layer                                     |
| 21  | Audyt kontrastu WCAG AA dla dark mode (`bg-muted/50` może być zbyt subtelne)               | całość                                         |

---

## Sugerowane fale wdrożeniowe

**Fala 1 (1–2 dni, niskie ryzyko, lokalne zmiany):**
1, 2, 3, 4, 6, 7, 8

**Fala 2 (wymaga nowej logiki / hooków):**
5, 9, 12, 13, 15

**Fala 3 (większe refaktory layoutu lub backendu):**
10, 11, 14, 16

Pozycje 17–21 można wpiąć w odpowiednie fale w zależności od czasu.

---
