# 🌙☀️ Day/Night Mode - Testing & Troubleshooting Guide

## Quick Start - Test the Theme System

### Option 1: Use Debug Tool
1. Open `theme-debug.html` in your browser
2. You'll see real-time debugging information:
   - Current time
   - Current theme status
   - Stored preferences
   - CSS variables
   - Live console log

### Option 2: Test Directly on Portfolio
Open `index.html` and check:
1. **Look at the header** - logo color should change with theme
2. **Background color** should be:
   - White/light gray in light mode
   - Deep navy (#0f172a) in dark mode
3. **Click the ☀️/🌙 button** to toggle themes
4. **Phone mockup** should show your current time in HH:MM format

---

## How the Theme System Works

### Step 1: Inline Script (Runs Immediately)
```html
<script>
  // This runs BEFORE CSS loads
  const savedTheme = localStorage.getItem('portfolio-theme');
  let theme = savedTheme;
  
  if (!theme) {
    const hour = new Date().getHours();
    theme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
  }
  
  document.documentElement.setAttribute('data-theme', theme);
</script>
```

**What happens:**
- Checks if you've saved a theme preference
- If not, uses current time to pick a theme
- Sets `data-theme` attribute on `<html>` element
- This happens BEFORE CSS loads, no flash!

### Step 2: CSS Variables Apply
```css
/* Light Mode */
html[data-theme="light"] {
  --primary: #0066cc;
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
}

/* Dark Mode */
html[data-theme="dark"] {
  --primary: #60a5fa;
  --bg-primary: #0f172a;
  --text-primary: #f1f5f9;
}
```

**What happens:**
- CSS variables automatically update based on data-theme
- All colors change smoothly (0.5s transition)
- No JavaScript manipulation of individual elements

### Step 3: JavaScript Enhances (script.js loads)
```javascript
// Sets up toggle button
const btn = document.getElementById('theme-toggle');
btn.addEventListener('click', () => {
  // Toggle between light and dark
  // Save preference
  // Update button icon
});

// Updates phone time every minute
setInterval(() => {
  document.getElementById('phone-time').textContent = currentTime;
}, 60000);
```

---

## Troubleshooting - If Theme Not Working

### Issue 1: Theme doesn't change when clicking button
**Check:**
1. Open browser console (F12)
2. Look for error messages
3. Check if button is clickable
4. Try the debug tool to see if theme changes

**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Check console for JavaScript errors
- Open theme-debug.html to test

### Issue 2: Colors don't match expected theme
**Check CSS Variables:**
1. Open DevTools (F12)
2. Go to "Inspect Element" (right-click anywhere)
3. Go to Styles tab
4. Look for `--primary`, `--bg-primary`, etc.
5. Check if they have correct values

**Light Mode Should Show:**
- `--primary: #0066cc` (blue)
- `--bg-primary: #ffffff` (white)
- `--text-primary: #1a1a1a` (dark)

**Dark Mode Should Show:**
- `--primary: #60a5fa` (light blue)
- `--bg-primary: #0f172a` (navy)
- `--text-primary: #f1f5f9` (light)

### Issue 3: Theme keeps reverting to light
**Check localStorage:**
1. Open DevTools (F12)
2. Go to Application → Storage → Local Storage
3. Look for key: `portfolio-theme`
4. Value should be `light` or `dark`

**Solution:**
- Use theme-debug.html "Clear Storage" button
- Reload page to let it auto-detect time-based theme

### Issue 4: Time not showing correctly on phone
**Check:**
1. Phone mockup should show current time
2. Format should be HH:MM (24-hour)
3. Should update every minute

**Debug in Console:**
```javascript
// Check phone time element
document.getElementById('phone-time')

// Should output: <text id="phone-time">21:10</text>
```

---

## Time-Based Theme Selection

The theme automatically switches based on your local time:

```
6:00 AM  ──────── LIGHT MODE ────────  6:00 PM
                   (Day Time)
6:00 PM  ──────── DARK MODE ────────  6:00 AM
                   (Night Time)
```

Examples:
- **7:00 AM** → Light mode (white background)
- **12:00 PM** (noon) → Light mode
- **5:00 PM** → Light mode (still before 6 PM)
- **6:00 PM** → Dark mode (just switched)
- **11:00 PM** → Dark mode
- **5:00 AM** → Dark mode (before 6 AM)

---

## Manual Testing Steps

### Test 1: Auto-Detection
1. Open index.html
2. Check the current time in your system
3. Expected: Light theme if 6 AM - 6 PM, Dark if 6 PM - 6 AM
4. If not matching, proceed to Test 2

### Test 2: Toggle Button
1. Click the ☀️/🌙 button in top-right
2. Colors should smoothly fade to opposite theme
3. Icon should change (☀️ ↔️ 🌙)
4. Background should change (white ↔️ navy)

### Test 3: Persistence
1. Toggle to your preferred theme
2. Reload the page (F5)
3. Expected: Same theme is still active
4. This means localStorage is working

### Test 4: Storage Clear
1. Open theme-debug.html
2. Click "Clear Storage"
3. Reload index.html
4. Expected: Auto-detects time-based theme

### Test 5: Phone Time
1. Look at Android phone mockup
2. Status bar should show current time
3. Format: HH:MM (like "21:13")
4. Should match your system time

---

## Console Messages (When Working)

When everything works correctly, you should see in console:

```
Script.js loaded
Theme set to: light
DOM ready, initializing theme and time...
ThemeManager initializing...
Toggle button setup complete
Phone time updated to: 21:13
```

---

## Advanced: Reset Everything

If having persistent issues, try this:

1. **Clear everything:**
   ```javascript
   // Run in browser console (F12)
   localStorage.clear();
   document.documentElement.setAttribute('data-theme', 'light');
   location.reload();
   ```

2. **Check CSS is loaded:**
   - DevTools → Network tab
   - Reload page
   - Look for `styles.css` - should load with green checkmark

3. **Check JavaScript is loaded:**
   - DevTools → Network tab
   - Look for `script.js` - should load at bottom

---

## Files to Check

| File | Purpose |
|------|---------|
| `index.html` | Main portfolio (has inline script in `<head>`) |
| `styles.css` | Color variables and theme rules |
| `script.js` | Theme toggle and time update logic |
| `theme-debug.html` | Debug tool for testing |

---

## Contact & Support

If theme still not working after these steps:
1. Open theme-debug.html
2. Take screenshot of status section
3. Note the time shown
4. Note what theme is selected
5. Check if CSS variables show correct values

This information will help identify the exact issue!
