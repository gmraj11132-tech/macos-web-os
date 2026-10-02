const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '../')));

// Mock Data
let systemSettings = {
    appearance: 'light',
    accentColor: '#007AFF',
    dockSize: 48,
    dockMagnification: true,
    dockPosition: 'bottom',
    dockAutoHide: false,
    wallpaper: 'default'
};

const appsList = [
    { id: 'vscode', name: 'VS Code', installed: false },
    { id: 'slack', name: 'Slack', installed: false }
];

let files = [
    { path: '/Desktop', type: 'directory' },
    { path: '/Documents', type: 'directory' }
];

// API Endpoints
app.get('/api/system-info', (req, res) => {
    res.json({
        os: 'macOS Web 15.0',
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

app.get('/api/apps', (req, res) => {
    res.json(appsList);
});

app.post('/api/apps/install', (req, res) => {
    const { id } = req.body;
    const appToInstall = appsList.find(a => a.id === id);
    if (appToInstall) {
        appToInstall.installed = true;
        res.json({ success: true, app: appToInstall });
    } else {
        res.status(404).json({ error: 'App not found' });
    }
});

app.delete('/api/apps/:id', (req, res) => {
    const { id } = req.params;
    const appToUninstall = appsList.find(a => a.id === id);
    if (appToUninstall) {
        appToUninstall.installed = false;
        res.json({ success: true, app: appToUninstall });
    } else {
        res.status(404).json({ error: 'App not found' });
    }
});

app.get('/api/files', (req, res) => {
    res.json(files);
});

app.post('/api/files', (req, res) => {
    const newFile = req.body;
    files.push(newFile);
    res.json({ success: true, file: newFile });
});

app.put('/api/files', (req, res) => {
    res.json({ success: true, message: 'File updated' });
});

app.delete('/api/files/:path(*)', (req, res) => {
    const filePath = '/' + req.params.path;
    files = files.filter(f => f.path !== filePath);
    res.json({ success: true });
});

app.get('/api/weather', (req, res) => {
    res.json({ temp: 72, condition: 'Sunny', location: 'Cupertino' });
});

app.get('/api/news', (req, res) => {
    res.json([
        { title: 'New macOS Web Released', source: 'Apple News' },
        { title: 'Developers love the new OS', source: 'Tech Daily' }
    ]);
});

app.post('/api/settings', (req, res) => {
    systemSettings = { ...systemSettings, ...req.body };
    res.json({ success: true, settings: systemSettings });
});

app.get('/api/settings', (req, res) => {
    res.json(systemSettings);
});

app.listen(PORT, () => {
    console.log(`macOS Web backend running at http://localhost:${PORT}`);
});
