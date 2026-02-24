# Bird Tricks Academy - Lesson Player Template

## 🦜 Overview

Clean, reusable template for online bird training lessons. Features:
- ✅ Progressive level unlocking (Basic → Intermediate → Advanced)
- ✅ Animated companion (Ranger Taila with cute eyes)
- ✅ Step-by-step instruction flow
- ✅ Image display for each step
- ✅ Reward system with bouncing bubbles
- ✅ Sound effects (bubbling, bouncing)
- ✅ Progress tracking with localStorage
- ✅ Mobile responsive

## 📁 Files Included

- `index.html` - Main page structure
- `styles.css` - All styling
- `app.js` - Complete functionality
- `rangerTaila.webp` - Companion image
- `trick_001.json` - Sample lesson (Target Training)
- `README.md` - This file

## 🎨 Customization

### Change Branding

**Edit `index.html`:**
```html
<div class="brand-kicker">YOUR COMPANY NAME</div>
<div class="brand-title">Your Academy Name</div>
```

**Edit `styles.css`:**
```css
:root{
  --accent:#8b4513;  /* Your brand color */
}
```

### Change Companion Image

Replace `rangerTaila.webp` with your image, or update `index.html`:
```html
<img id="companionImage" src="your-image.jpg" />
```

### Adjust Eye Position

Edit `styles.css`:
```css
.eyes-container{
  top: 15%;  /* Adjust vertical position */
  /* Change based on your image */
}
```

## 📝 Creating Lessons

### Lesson JSON Structure

```json
{
  "title": "Your Trick Name",
  "steps_basic": [
    {
      "title": "Step title",
      "instruction": "What the user should do",
      "hint": "Helpful tip if they're stuck",
      "image": "path/to/image.jpg"
    }
  ],
  "steps_intermediate": [...],
  "steps_advanced": [...]
}
```

### Level Naming

Template uses three levels:
- `steps_basic` - Beginner level
- `steps_intermediate` - Medium level  
- `steps_advanced` - Expert level

You can rename these in the HTML dropdown if needed.

## 🖼️ Adding Images

### Option 1: Local Images
1. Put images in same folder as lesson files
2. Reference in JSON: `"image": "step1.jpg"`

### Option 2: External URLs
```json
"image": "https://yourdomain.com/images/step1.jpg"
```

### Option 3: No Images
Leave blank for text-only steps:
```json
"image": ""
```

## 🚀 Deployment

### GitHub Pages (Free)
1. Create GitHub repository
2. Upload all files to repository root
3. Settings → Pages → Deploy from main branch
4. Access: `https://username.github.io/repo-name/?lesson=trick_001`

### Custom Domain
Point your domain to GitHub Pages or host on your own server.

## 🔗 URL Parameters

Access lessons via URL parameter:
```
https://yoursite.com/?lesson=trick_001
https://yoursite.com/?lesson=trick_002
```

The `?lesson=` parameter loads the corresponding JSON file.

## 💾 Progress Tracking

Progress is saved in browser localStorage:
- Current step per level
- Unlocked levels
- Completed levels
- Reward balls earned

Clearing browser data resets progress.

## 🎮 Features Explained

### Progressive Unlocking
1. Start at Basic level
2. Complete all steps → unlock Intermediate
3. Complete Intermediate → unlock Advanced
4. Use dropdown to switch between unlocked levels

### Reward System
- Complete a level → bouncing ball reward appears
- Balls have physics (bounce, collide)
- Sound effects on bounce
- Restart clears all rewards

### Eyes Animation
- Happy eyes when idle
- Thinking eyes when typing
- Pupils dart around when processing

## 🎨 Styling Tips

### Change Colors
Edit `:root` variables in `styles.css`:
```css
:root{
  --primary:#2477c9;  /* Button color */
  --accent:#8b4513;   /* Brand accent */
  --border:#dbe6f2;   /* Border color */
}
```

### Adjust Layout
- Left panel: Companion and speech bubble
- Right panel: Steps and images
- Grid adjusts automatically on mobile

### Customize Bubble
```css
.bubble{
  border: 3px solid var(--accent);  /* Border color */
  border-radius: 18px;               /* Roundness */
}
```

## 📱 Mobile Responsive

Template automatically stacks on small screens:
- Desktop: Side-by-side layout
- Mobile: Stacked layout (companion on top)

## 🔧 Advanced Customization

### Add More Levels
1. Add option to `<select>` in HTML
2. Add `steps_expert` (or your name) to JSON
3. Update level logic in `getCurrentSteps()` function

### Change Default Lesson
Edit `app.js`:
```javascript
const DEFAULT_LESSON = "your_lesson_id";
```

### Disable Rewards
Remove or hide `<div class="bubble-rewards">` in HTML.

### Change Typing Speed
Edit `app.js`:
```javascript
await sleep(14);  // Lower = faster typing
```

## 🐛 Troubleshooting

**No sound?**
- Click anywhere first (browsers require user interaction for audio)
- Check browser volume
- Try Chrome (best Web Audio support)

**Images not loading?**
- Check file paths in JSON
- Verify images are uploaded
- Check browser console for errors

**Progress not saving?**
- localStorage might be disabled
- Check browser privacy settings
- Try incognito/private mode

**Level won't unlock?**
- Click "Complete Level ✓" button on final step
- Check console for JavaScript errors

## 📄 License

Template is provided as-is for educational use.
Customize freely for your bird training academy!

## 🆘 Support

For template issues, check browser console (F12) for error messages.

---

**Created for The Amazonica Singapore - Bird Tricks Academy**
