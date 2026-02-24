# Bird Tricks Academy - Stay Command Training

## 🦜 Clean Training Template

Streamlined lesson player for bird training with generated illustrations.

## ✨ Features

- ✅ Step-by-step training progression
- ✅ Auto-generated illustrations for each stage
- ✅ Speech bubble with typing animation
- ✅ Progress tracking
- ✅ Hint system
- ✅ Clean, distraction-free interface

## 📁 Files

- `index.html` - Main page
- `styles.css` - Styling
- `app.js` - Logic + illustration generation
- `stay_training.json` - Stay command lesson (14 steps)
- `rangerTaila.webp` - Companion image

## 🎨 How It Works

### Illustrations
Each step automatically generates a custom illustration showing:
- **Stage 1**: Bird on perch + hand showing "Stay" + 1 sec timer
- **Stage 2**: Bird + hand + duration timer (3s, 5s, 8s, 15s)
- **Stage 3**: Bird + person at distance + arrow showing movement
- **Stage 4**: Bird + distractions (waving hand, motion lines)
- **Stage 5**: Bird + person far away + long timer (30-60s)

### Navigation
- **Next →** - Advance to next step
- **← Back** - Return to previous step
- **Hint** - Show training tip
- **Restart** - Go back to Step 1

## 📝 Lesson Format

```json
{
  "title": "Lesson Name",
  "steps": [
    {
      "stage": 1,
      "title": "Stage title",
      "instruction": "Training instructions",
      "hint": "Helpful tip",
      "duration": "5 sec"  // Optional, for timers
    }
  ]
}
```

## 🎯 Creating New Lessons

1. **Copy** `stay_training.json`
2. **Rename** to `your_lesson.json`
3. **Edit** steps (keep stage 1-5 for illustrations)
4. **Update** `app.js` line 20: `await fetch("your_lesson.json")`

## 🎨 Customization

### Change Companion Image
Replace `rangerTaila.webp` with your image

### Change Colors
Edit `styles.css` `:root` section:
```css
--primary:#2477c9;  /* Blue buttons */
--accent:#8b4513;   /* Brown accents */
```

### Adjust Illustrations
Edit drawing functions in `app.js`:
- `drawBird()` - Bird appearance
- `drawPerch()` - Perch style
- `drawHand()` - Hand gesture
- `drawPerson()` - Trainer figure

### Add New Stage Illustrations
Add case in `drawIllustration()`:
```javascript
else if(stage === 6){
  // Your custom drawing code
}
```

## 🚀 Deployment

### Option 1: Local
Just open `index.html` in browser

### Option 2: GitHub Pages
1. Upload all files to GitHub repo
2. Enable Pages in Settings
3. Access at: `username.github.io/repo/`

### Option 3: Web Server
Upload all files to web hosting root directory

## 🔧 Technical Details

### Canvas Illustrations
- Size: 600×400px
- Auto-scales to container
- Redraws on each step
- All vector graphics (no image files needed)

### Progress Tracking
- Saves current step
- Shows progress bar
- Persists across sessions

### Typing Animation
- 12ms per character
- Can be interrupted
- Smooth natural flow

## 📱 Mobile Responsive

- Desktop: Side-by-side layout
- Mobile: Stacked layout
- Canvas scales automatically

## 🎓 Training Stages Included

- **Stage 1**: Zero Duration (Days 1-2)
- **Stage 2**: Build Duration 3-15s (Days 3-5)
- **Stage 3**: Add Distance (Days 6-8)
- **Stage 4**: Add Distractions (Days 9-11)
- **Stage 5**: Performance 30-60s (Days 12-14)

## 🆘 Troubleshooting

**Illustrations not showing?**
- Check browser console (F12)
- Canvas requires modern browser
- Try Chrome/Firefox

**Steps not advancing?**
- Check JSON file loads correctly
- Verify file paths
- Check console for errors

**Layout broken on mobile?**
- Clear browser cache
- Try different browser
- Check viewport meta tag

## 💡 Tips

- Keep sessions short (5-10 minutes)
- Use high-value treats
- Practice same time daily
- End on success
- Be patient with progress

---

**The Amazonica Singapore - Bird Tricks Academy**
