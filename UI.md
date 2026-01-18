# UI Component Reference

Standard UI components for the Vibz application. Use these descriptions to ensure consistent design.

---

## StandardRedButton

Primary action button with distinctive red appearance for main call-to-action elements.

**Colors:**
- Background: `#DC2727` (vibz-button-red)
- Text: `#FFF5CF` (vibz-bg)
- Hover: `#B91C1C` (vibz-button-red-hover)

**Typography:** Deaugusta font, thin weight

**Shape:** Fully rounded pill shape (rounded-full), shadow-lg (hover: shadow-xl)

**Spacing:** Use `gap-2` when combining icons and text

**States:** Normal (full opacity), Hover (darker bg, larger shadow), Disabled (50% opacity, cursor-not-allowed), Loading (spinner icon with animate-spin)

**Size:** Adapt content/component size to context

**CSS Class:** `btn-vibz-red`

**Example:**
```jsx
<button className="btn-vibz-red gap-2">
  <span>Button Text</span>
  <IconName size={20} />
</button>
```

---

## StandardBeigeButton

Secondary button with beige/cream appearance and red border for less prominent actions.

**Colors:**
- Background: `#FFEFB3` (vibz-button-beige)
- Text: `#DC2727` (vibz-red)
- Border: 2px solid `#DC2727` (vibz-red)
- Hover: `#FFF5CF` (vibz-button-beige-hover)

**Typography:** Poppins font, thin weight

**Shape:** Fully rounded pill shape (rounded-full)

**States:** Normal, Hover (lighter bg), Disabled (50% opacity, cursor-not-allowed)

**Size:** Adapt content/component size to context

**CSS Class:** `btn-vibz-beige`

**Example:**
```jsx
<button className="btn-vibz-beige">
  Button Text
</button>
```

---

## DeAugustaLabel

Large decorative heading text using the DeAugusta font for prominent titles and headings.

**Colors:**
- Text: `#DC2727` (vibz-red)

**Typography:**
- Font: Deaugusta (font-deaugusta)
- Size: Adapt to context (typically text-4xl or larger)
- Weight: normal (default thin appearance of DeAugusta)

**Alignment:** Usually center-aligned (text-center)

**Size:** Adapt text size to context and importance

**Example:**
```jsx
<p className="text-4xl font-deaugusta text-vibz-red text-center">
  Your Heading Text
</p>
```

---

## PoppinsLabel

Body text and descriptive labels using Poppins font for readable secondary information.

**Colors:**
- Text: `#DC2727` (vibz-textbox-text)

**Typography:**
- Font: Poppins (font-poppins)
- Size: Adapt to context (typically text-base to text-2xl)
- Weight: normal

**Alignment:** Usually center-aligned (text-center)

**Size:** Adapt text size to context and hierarchy

**Example:**
```jsx
<p className="text-base md:text-2xl font-poppins text-vibz-textbox-text text-center">
  Your descriptive text
</p>
```

---

## StandardBackground

Default background color for pages and containers.

**Color:** `#FFEFB3` (vibz-button-beige)

**CSS Class:** `bg-vibz-button-beige`

**Example:**
```jsx
<div className="bg-vibz-button-beige min-h-screen">
  Your content
</div>
```

---

## StandardInputBox

Multi-line text input with beige background and red border focus states.

**Colors:**
- Background: `#FFEFB3` (vibz-bg-textbox)
- Text: `#DC2727` (vibz-textbox-text)
- Border: 2px solid `#DC2727` (vibz-frame)
- Placeholder: `#DC2727` at 40% opacity (vibz-textbox-text/40)
- Focus border: `#DC2727` (vibz-frame)
- Focus shadow: `#DC2727` at 30% opacity (vibz-frame/30)

**Typography:** Poppins font, normal weight

**Shape:** Rounded corners (rounded-lg), no resize handles (resize-none)

**Padding:** px-4 py-3

**Focus states:** No outline, enhanced border color, shadow-lg with frame color glow

**Size:** Adapt width to context, typically full width (w-full)

**Example:**
```jsx
<textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Your placeholder text"
  className="w-full bg-vibz-bg-textbox rounded-lg px-4 py-3 text-vibz-textbox-text font-poppins
    placeholder:text-vibz-textbox-text/40 border-2 border-vibz-frame
    focus:outline-none focus:border-vibz-frame focus:shadow-lg focus:shadow-vibz-frame/30
    min-h-[100px] resize-none transition-all"
/>
```

---

## StandardCheckbox

Custom styled checkbox with red checked state, typically paired with Poppins text label.

**Colors:**
- Background (unchecked): `#FFEFB3` (vibz-bg-textbox)
- Border (unchecked): 2px solid `#DC2727` (vibz-frame)
- Background (checked): `#DC2727` (vibz-button-red)
- Border (checked): `#DC2727` (vibz-button-red)
- Focus ring: `#DC2727` at 50% opacity (vibz-button-red/50)

**Size:** w-4 h-4 (adapt if needed)

**Shape:** Rounded (rounded)

**States:** Unchecked (beige bg), Checked (red bg), Focus (ring glow)

**Label Typography:** Poppins font, text-xs or adapt to context, vibz-textbox-text color

**Example:**
```jsx
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    checked={isChecked}
    onChange={(e) => setIsChecked(e.target.checked)}
    className="w-4 h-4 rounded border-2 border-vibz-frame bg-vibz-bg-textbox
      appearance-none
      checked:bg-vibz-button-red checked:border-vibz-button-red
      focus:outline-none focus:ring-2 focus:ring-vibz-button-red/50
      transition-colors cursor-pointer"
  />
  <span className="text-xs text-vibz-textbox-text font-poppins select-none">
    Your label text
  </span>
</label>
```

---

## StandardEditorIcon

Editor action buttons with circular backdrop, drop shadows, status badges, and text labels. Designed for mobile use without hover state effects on the background.

**Container:**
- Size: w-12 h-12
- Shape: rounded-full
- Backdrop: backdrop-blur-md
- Background: radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)
- Shadow: shadow-lg

**Icon:**
- Size: 20px
- Color: #FFF5CF (vibz-bg)
- Filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8))
- Position: Inside relative container for StatusBadge placement

**Label:**
- Color: #FFF5CF (vibz-bg)
- Typography: Poppins font, text-sm, font-medium
- Text Shadow: 0 4px 18px rgba(0,0,0,1), 0 0 18px rgba(0,0,0,1)

**Button Container:**
- Layout: flex items-center gap-2
- Animation: transition-transform hover:scale-110

**Status Badge:**
- Complete: w-3 h-3 bg-green-500 rounded-full with white check icon
- Incomplete: w-3 h-3 bg-orange-400 rounded-full with animate-pulse
- Position: absolute -top-1 -right-1 on the relative icon container

**Important:** Do not add hover effects that change the background gradient (e.g., onMouseEnter/onMouseLeave) as the app is designed for mobile devices where hover states are not applicable.

**Example:**
```jsx
<button
  onClick={handleAction}
  className="flex items-center gap-2 transition-transform hover:scale-110"
>
  <div
    className="w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg"
    style={{
      background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)'
    }}
  >
    <div className="relative">
      <IconName size={20} className="text-[#FFF5CF]" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }} />
      <StatusBadge isComplete={hasFeature} />
    </div>
  </div>
  <span className="text-[#FFF5CF] text-sm font-poppins font-medium" style={{ textShadow: '0 4px 18px rgba(0,0,0,1), 0 0 18px rgba(0,0,0,1)' }}>Label</span>
</button>
```

---

## StandardOneLineMessageBox

Standard message box for displaying short messages or confirmations with action buttons.

**Container:**
- Background: `#FFF5CF` (vibz-bg)
- Shape: Rounded corners (rounded-lg)
- Padding: px-6 py-4
- Shadow: shadow-lg
- Border: 2px solid `#DC2727` (vibz-frame)

**Typography:**
- Font: Poppins (font-poppins)
- Weight: bold (font-bold)
- Size: text-base or text-lg depending on context
- Color: `#DC2727` (vibz-textbox-text)

**Buttons:**
- Use StandardRedButton for primary action (e.g., "Yes", "OK", "Continue")
- Use StandardBeigeButton for secondary action (e.g., "No", "Cancel", "Back")
- Layout: flex gap-3 for multiple buttons

**Example:**
```jsx
<div className="bg-vibz-bg rounded-lg px-6 py-4 shadow-lg border-2 border-vibz-frame max-w-md">
  <p className="font-poppins font-bold text-vibz-textbox-text text-center mb-4">
    Your message text here
  </p>
  <div className="flex gap-3 justify-center">
    <button className="btn-vibz-beige">
      Secondary Action
    </button>
    <button className="btn-vibz-red">
      Primary Action
    </button>
  </div>
</div>
```

---

## Color Reference

- **vibz-button-red:** `#DC2727` (primary red)
- **vibz-button-red-hover:** `#B91C1C` (darker red)
- **vibz-button-beige:** `#FFEFB3` (light beige)
- **vibz-button-beige-hover:** `#FFF5CF` (cream)
- **vibz-red / vibz-textbox-text / vibz-frame:** `#DC2727`
- **vibz-bg:** `#FFF5CF` (cream background)
- **vibz-bg-textbox:** `#FFEFB3` (beige background)

## Font Reference

- **Deaugusta:** Decorative serif font for headings and buttons (thin weight)
- **Poppins:** Clean sans-serif font for body text and labels (normal weight)
