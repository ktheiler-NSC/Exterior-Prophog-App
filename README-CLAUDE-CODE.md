# Exterior PropHog - Claude Code Edition

A complete, working multi-agent management system built for insurance teams.

## What's Included

✅ **Full-stack web app** - No configuration needed
✅ **Google Sheets integration** - Read agent data directly from your sheets
✅ **Multi-user support** - Share with your entire downline
✅ **Search & filter** - Find agents instantly
✅ **Color-coded users** - Each agent has their own identity

## Files

- `server.mjs` - Node.js backend (Express)
- `index.html` - Complete frontend (HTML/CSS/JS)
- `package.json` - Dependencies

## Quick Start

### Option 1: Run in Claude Code (RECOMMENDED)

1. **Open Claude Code** 
2. **Create a new project**
3. **Upload these 3 files** to the project root
4. **Click "Run"**
5. **Click the generated URL** - Your app is live! 🚀

### Option 2: Run Locally

```bash
npm install
npm start
```

Visit `http://localhost:3000`

## How to Use

### For Team Leaders (Mentors)

1. **Go to your Google Sheet** with agent data
2. **Share it:** Settings → Share → "Anyone with the link can view"
3. **Copy the Sheet ID** from the URL: `docs.google.com/spreadsheets/d/{ID}/edit`
4. **Give the app URL** to your downline

### For Agents (Downline)

1. **Visit the shared app URL**
2. **Enter your email** (e.g., yourname@agency.com)
3. **Pick your color** (your identity badge)
4. **Paste the Sheet ID** your mentor gave you
5. **Click "Load Agents"**
6. **Search and manage agents!**

## Important Requirements

### Google Sheet Setup

Your sheet MUST have:
- ✅ A column called `npn_no` OR `npn` (identifies agents)
- ✅ Public sharing: "Anyone with the link can view"
- ✅ Recommended columns: `full_name`, `phone`, `email`, `city`, `county`, `license_type`, `license_status`

### Column Names (Recommended)

```
full_name, first_name, middle_name, last_name
phone, email, full_address
city, county, state, zip_code
license_number, license_type, license_status
npn_no (or npn)
```

## Features

**Login Screen**
- Email address input
- 10-color identity picker
- Google Sheet URL/ID input

**Agent Table**
- Searchable list of all agents
- Name, phone, email, city, county
- License type and status
- NPN number

**Multi-User**
- Each user logs in independently
- Same data, different users
- Real-time collaboration ready

## Sharing with Your Team

**Public URL Format:**
```
https://your-claude-code-url.app/
```

Share this link with:
- ✅ Entire downline team
- ✅ Other mentors (they use their own Sheet ID)
- ✅ Partners and managers
- ✅ No login credentials needed!

## Troubleshooting

**"Could not load Google Sheet"**
- Make sure sheet is shared as "Anyone with the link can view"
- Try refreshing the page
- Check the Sheet ID is correct

**"No agents found"**
- Make sure your sheet has an `npn_no` or `npn` column
- Check that the data is in the first sheet (not a hidden sheet)
- Verify column names match

**App not loading**
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check your internet connection
- Try a different browser

## Future Enhancements

Ready to add later:
- Call notes per agent
- Appointment scheduling
- Assignment tracking
- Activity feed
- Database persistence
- Real-time sync across users

## Support

Built with ❤️ for insurance teams. Questions? Check your Google Sheet setup!

---

**Version:** 1.0.0  
**Platform:** Node.js + Express + Vanilla JS  
**Status:** Production Ready ✅
