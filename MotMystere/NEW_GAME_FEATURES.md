# 🎯 TUSMO CESI - New Wordle-Style Game

## ✅ Implemented Features

### 1. **Full Keyboard Support** ⌨️
- ✅ **Physical Keyboard**: Type letters directly, press Enter to submit, Backspace to delete
- ✅ **Virtual Keyboard**: Click on-screen AZERTY keyboard
- ✅ **Keyboard Feedback**: Keys change color based on letter status (green/yellow/gray)
- ✅ **Smooth Animations**: Letter boxes flip and pulse when revealed

### 2. **French Word Database** 🇫🇷
- ✅ **800+ French 5-letter words**
- ✅ **Word validation**: Only valid French words accepted
- ✅ **Random word selection** for infinite mode
- ✅ **Daily word system** with consistent word for all players

### 3. **Game Modes** 🎮

#### Daily Challenge Mode
- One word per day for all players
- Timer tracks how long you take
- Score calculation based on:
  - Base score: 1000 points
  - Attempts bonus: +100 per unused attempt
  - Time penalty: -1 point per second
- Leaderboard ranking
- Countdown to next daily word

#### Infinite Mode
- New random word each game
- Play as many times as you want
- No timer or score tracking
- Perfect for practice

### 4. **Scoring System** 📊
**Formula**: `Score = 1000 + (unused_attempts × 100) - time_in_seconds`

**Examples**:
- Win in 1 attempt, 30 seconds: `1000 + 500 - 30 = 1470 points` 🏆
- Win in 3 attempts, 90 seconds: `1000 + 300 - 90 = 1210 points`
- Win in 6 attempts, 180 seconds: `1000 + 0 - 180 = 820 points`

### 5. **Leaderboard System** 🏆
- Daily rankings based on score
- Top 5 players displayed
- Gold/Silver/Bronze medals for top 3
- Your rank highlighted
- Updates in real-time

### 6. **Statistics Tracking** 📈
- **Games Played**: Total number of games
- **Win Rate**: Percentage of games won
- **Current Streak**: Consecutive wins
- **Max Streak**: Best winning streak
- Saved locally in browser

### 7. **Modern UI/UX** ✨
- **Glassmorphism design** with frosted glass effects
- **Smooth animations**: Flip, pop, and pulse effects
- **Color-coded feedback**:
  - 🟩 **Green**: Correct letter in correct position
  - 🟨 **Yellow**: Correct letter in wrong position
  - ⬜ **Gray**: Letter not in word
- **Responsive design**: Works on desktop, tablet, and mobile
- **Dark theme**: Easy on the eyes

### 8. **Game Features** 🎯
- **6 attempts** to guess the word
- **Real-time feedback** after each guess
- **Keyboard highlighting** shows used letters
- **Share results** to clipboard
- **Toast notifications** for errors and success
- **Modal dialogs** for stats and results

## 🎮 How to Play

### Starting a Game
1. Open `http://127.0.0.1:5000/game`
2. Choose mode: **Daily Challenge** or **Infinite**
3. Start typing your guess!

### Making a Guess
1. **Type** a 5-letter French word using keyboard or on-screen keys
2. Press **Enter** to submit
3. Watch the colors reveal:
   - Green = correct position
   - Yellow = wrong position
   - Gray = not in word
4. Use feedback to make next guess
5. Win by guessing the word in 6 attempts or less!

### Keyboard Shortcuts
- **A-Z**: Type letters
- **Enter**: Submit guess
- **Backspace**: Delete last letter
- **Click keys**: Use virtual keyboard

## 📊 Accessing Features

### View Statistics
- Click **📊** button in header
- See your performance stats
- View daily leaderboard
- Check countdown to next word

### Game Results
- Automatically shown when game ends
- Shows:
  - The correct word
  - Number of attempts used
  - Time taken
  - Score earned (daily mode)
- Options to:
  - Share results
  - Play again (infinite mode)

## 🔧 Technical Details

### Files Created
1. **`templates/game.html`** - New game interface
2. **`static/game_style.css`** - Styling for new game
3. **`static/wordle_game.js`** - Game logic with keyboard support
4. **`static/french_words.js`** - French word database (800+ words)

### Technologies Used
- **HTML5**: Modern semantic markup
- **CSS3**: Glassmorphism, animations, flexbox/grid
- **JavaScript ES6+**: Modules, async/await, localStorage
- **Flask**: Backend routing

### Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 🎯 Scoring Examples

### Perfect Game (1 attempt, 20 seconds)
```
Base: 1000
Bonus: 5 × 100 = 500
Time: -20
Total: 1480 points 🏆
```

### Good Game (3 attempts, 60 seconds)
```
Base: 1000
Bonus: 3 × 100 = 300
Time: -60
Total: 1240 points
```

### Close Call (6 attempts, 120 seconds)
```
Base: 1000
Bonus: 0 × 100 = 0
Time: -120
Total: 880 points
```

## 🚀 Future Enhancements

### Planned Features
1. **Real Server Leaderboard** - Connect to backend database
2. **User Accounts** - Save progress across devices
3. **Achievements** - Unlock badges for milestones
4. **Hard Mode** - Revealed hints must be used
5. **Word Length Options** - 4, 6, or 7 letter words
6. **Themes** - Light mode, colorblind mode
7. **Sound Effects** - Audio feedback
8. **Social Sharing** - Share to Twitter/Facebook
9. **Statistics Charts** - Visual progress graphs
10. **Multiplayer** - Race against friends

## 📝 Notes

- **Daily word** changes at midnight (00:00)
- **Scores** are saved locally in browser
- **Leaderboard** is currently simulated (will connect to server)
- **Word list** can be expanded with more French words
- **Game state** persists in browser session

## 🎮 Access Points

- **Main Menu**: `http://127.0.0.1:5000/`
- **New Game**: `http://127.0.0.1:5000/game`
- **Multiplayer** (old): `http://127.0.0.1:5000/` (original version)

---

**Enjoy playing TUSMO CESI! 🎯🇫🇷**
