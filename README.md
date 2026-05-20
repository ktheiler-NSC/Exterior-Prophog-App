# Exterior PropHog - Agent Management System

A multi-agent management system for tracking and managing insurance agents from Google Sheets.

## Features

- Load agents from Google Sheets (CSV export)
- Track contact status and notes
- Schedule appointments via Calendly
- Real-time data persistence
- Team collaboration tracking
- Daily goal management

## Setup

1. Clone this repository
2. Run `npm install`
3. Run `npm start`
4. Open http://localhost:3000 in your browser

## Usage

1. Enter your email address
2. Select a color for your profile
3. Paste your Google Sheet ID (or full URL)
4. Click "Load Agents"
5. Start tracking agents!

## Google Sheets Format

Your sheet needs at least these columns:
- `npn` or `npn_no` - Agent NPN number
- `first_name` - First name
- `last_name` - Last name
- `phone` - Phone number
- `email` - Email address
- `city` - City
- `county` - County
- `license_type` - License type
- `license_status` - License status

## Sharing Your Google Sheet

Make sure your Google Sheet is shared with "Anyone with the link can view" permissions.

## Data Persistence

All tracker data (notes, assignments, appointments) is automatically saved to the server and persists across sessions.

