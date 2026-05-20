import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'tracker-data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Load tracker data from file on startup
let trackerData = {};
function loadTrackerData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      trackerData = JSON.parse(data);
      console.log('Loaded tracker data from file');
    }
  } catch (error) {
    console.error('Error loading tracker data:', error.message);
    trackerData = {};
  }
}

// Save tracker data to file
function saveTrackerData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(trackerData, null, 2));
  } catch (error) {
    console.error('Error saving tracker data:', error.message);
  }
}

loadTrackerData();

// Convert Google Sheet URL to CSV export URL
function getCSVUrl(sheetId) {
  if (sheetId.includes('docs.google.com')) {
    const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) sheetId = match[1];
  }
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
}

// Load agents from Google Sheet CSV
app.post('/api/load-agents', async (req, res) => {
  try {
    const { sheetId } = req.body;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] Load Agents Request - Sheet ID: ${sheetId}`);

    if (!sheetId) {
      console.log(`[${timestamp}] ERROR: No sheet ID provided`);
      return res.status(400).json({ ok: false, error: 'Sheet ID required' });
    }

    const csvUrl = getCSVUrl(sheetId);
    console.log(`[${timestamp}] Fetching CSV from: ${csvUrl}`);

    const response = await fetch(csvUrl);
    console.log(`[${timestamp}] Google Sheets response status: ${response.status}`);

    if (!response.ok) {
      console.log(`[${timestamp}] ERROR: Failed to fetch sheet (status ${response.status})`);
      return res.status(400).json({
        ok: false,
        error: 'Could not load Google Sheet. Make sure it is shared as "Anyone with the link can view"'
      });
    }

    const csvText = await response.text();
    console.log(`[${timestamp}] CSV received, size: ${csvText.length} bytes`);

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const agents = results.data.filter(agent => agent.npn_no || agent.npn);
        console.log(`[${timestamp}] Parsed ${results.data.length} rows, ${agents.length} agents with NPN`);

        if (agents.length === 0) {
          console.log(`[${timestamp}] ERROR: No agents with NPN column found`);
          return res.status(400).json({
            ok: false,
            error: 'No agents found. Make sure your sheet has an npn_no or npn column'
          });
        }

        console.log(`[${timestamp}] SUCCESS: Loaded ${agents.length} agents`);
        res.json({
          ok: true,
          agents: agents,
          sheetId: sheetId,
          count: agents.length
        });
      },
      error: (error) => {
        console.log(`[${timestamp}] ERROR: Parse error - ${error.message}`);
        res.status(400).json({ ok: false, error: error.message });
      }
    });
  } catch (error) {
    console.log(`[${timestamp}] ERROR: ${error.message}`);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Save tracker data
app.post('/api/save-tracker', (req, res) => {
  try {
    const { sheetId, npn, field, value } = req.body;

    if (!trackerData[sheetId]) {
      trackerData[sheetId] = {};
    }

    if (!trackerData[sheetId][npn]) {
      trackerData[sheetId][npn] = {};
    }

    trackerData[sheetId][npn][field] = value;
    saveTrackerData();

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Get tracker data for specific agent
app.get('/api/tracker/:sheetId/:npn', (req, res) => {
  const { sheetId, npn } = req.params;
  const data = trackerData[sheetId]?.[npn] || {};
  res.json({ ok: true, data });
});

// Get all tracker data for a sheet
app.get('/api/tracker/:sheetId', (req, res) => {
  const { sheetId } = req.params;
  const data = trackerData[sheetId] || {};
  res.json({ ok: true, data });
});

// Add or update team member
app.post('/api/team-member/add', (req, res) => {
  try {
    const { sheetId, email, color, name } = req.body;

    if (!sheetId || !email || !color || !name) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    if (!trackerData[sheetId]) {
      trackerData[sheetId] = {};
    }

    if (!trackerData[sheetId]['_team']) {
      trackerData[sheetId]['_team'] = [];
    }

    const team = trackerData[sheetId]['_team'];

    // Check if user already exists
    const existingIndex = team.findIndex(t => t.email === email);
    if (existingIndex >= 0) {
      team[existingIndex] = { email, color, name };
    } else {
      // Check for duplicate color (unless it's a generated color with hsl)
      const colorExists = team.some(t => t.color === color);
      if (colorExists) {
        return res.status(400).json({ ok: false, error: 'Color already in use by another team member' });
      }

      // Check 100-person limit
      if (team.length >= 100) {
        return res.status(400).json({ ok: false, error: 'Team capacity (100 members) reached' });
      }
      team.push({ email, color, name });
    }

    saveTrackerData();
    res.json({ ok: true, team });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Get team members for a sheet
app.get('/api/team/:sheetId', (req, res) => {
  const { sheetId } = req.params;
  const team = trackerData[sheetId]?.['_team'] || [];
  res.json({ ok: true, team });
});

// Bulk save all tracker data
app.post('/api/tracker/bulk-save', (req, res) => {
  try {
    const { sheetId, data } = req.body;
    if (sheetId && data) {
      trackerData[sheetId] = data;
      saveTrackerData();
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Exterior PropHog running at http://localhost:${PORT}`);
});
