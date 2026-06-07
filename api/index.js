const express = require('express');
const https = require('https');

const app = express();
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Frontend HTML Interface
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>ShortCraft AI</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root {
  --bg:#08080f; --surface:#101018; --card:#13131e; --border:#1f1f30;
  --accent:#ff2d55; --green:#00e676; --blue:#448aff; --text:#f5f5fa;
  --muted:#5a5a78; --sub:#8888a8; --r:14px;
  --font:'DM Sans',sans-serif; --mono:'DM Mono',monospace; --display:'Bebas Neue',sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh;overflow-x:hidden;padding-bottom:50px;}
.page{position:relative;z-index:1;max-width:480px;margin:0 auto;padding:0 16px;}
.header{display:flex;align-items:center;justify-content:space-between;padding:20px 0 16px;}
.logo{display:flex;align-items:center;gap:10px;}
.logo-mark{width:32px;height:32px;background:var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;}
.logo-name{font-family:var(--display);font-size:24px;letter-spacing:1px;line-height:1;}
.logo-name span{color:var(--accent);}
.live-badge{font-family:var(--mono);font-size:10px;color:var(--green);background:rgba(0,230,118,0.08);border:1px solid rgba(0,230,118,0.2);border-radius:100px;padding:4px 10px;display:flex;align-items:center;gap:5px;}
.pdot{width:5px;height:5px;background:var(--green);border-radius:50%;}
.hero{padding:24px 0 20px;text-align:center;}
.hero h1{font-family:var(--display);font-size:50px;line-height:0.95;letter-spacing:2px;margin-bottom:12px;}
.hero h1 .red{color:var(--accent);}
.hero-sub{font-size:13px;color:var(--sub);line-height:1.7;max-width:300px;margin:0 auto 18px;}
.input-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:20px;margin-bottom:12px;position:relative;overflow:hidden;}
.input-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent),var(--blue),var(--green));}
.input-label{font-family:var(--mono);font-size:10px;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;display:block;}
.url-box{display:flex;background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:12px;}
.url-input{flex:1;background:transparent;border:none;outline:none;padding:13px 14px;color:var(--text);font-family:var(--mono);font-size:11px;}
.url-input::placeholder{color:var(--muted);}
.paste-btn{background:rgba(68,138,255,0.1);border:none;border-left:1px solid var(--border);color:var(--blue);font-family:var(--mono);font-size:11px;padding:0 14px;cursor:pointer;}
.btn-main{width:100%;background:var(--accent);border:none;border-radius:10px;padding:15px;color:white;font-family:var(--display);font-size:20px;letter-spacing:1px;cursor:pointer;}
.btn-main:disabled{opacity:0.5;}
#status-section{display:none;background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:20px;margin-bottom:12px;}
.status-top{display:flex;align-items:center;gap:12px;margin-bottom:16px;}
.spinner{width:18px;height:18px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 0.8s linear infinite;}
@keyframes spin { to { transform: rotate(360deg); } }
.status-txt{font-size:14px;font-weight:600;}
.progress-list{display:flex;flex-direction:column;gap:7px;}
.p-step{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;font-family:var(--mono);font-size:11px;background:var(--surface);color:var(--muted);}
.p-step.active{border-color:rgba(68,138,255,0.4);color:var(--text);border:1px solid var(--blue);}
.p-step.done{border-color:rgba(0,230,118,0.3);color:var(--green);border:1px solid var(--green);}
.error-card{display:none;background:rgba(255,45,85,0.07);border:1px solid rgba(255,45,85,0.25);border-radius:10px;padding:14px 16px;font-size:13px;color:var(--accent);margin-bottom:12px;}
#results-section{display:none;}
.results-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.results-title{font-family:var(--display);font-size:28px;}
.count-badge{background:rgba(0,230,118,0.1);border:1px solid rgba(0,230,118,0.25);border-radius:100px;padding:4px 12px;font-family:var(--mono);font-size:11px;color:var(--green);}
.shorts-list{display:flex;flex-direction:column;gap:14px;}
.short-card{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;}
.tiktok-preview{position:relative;width:100%;aspect-ratio:9/16;max-height:320px;overflow:hidden;}
.preview-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:14px;}
.preview-top-row{display:flex;justify-content:space-between;}
.badge-num{background:var(--accent);color:white;font-family:var(--mono);font-size:10px;padding:3px 10px;border-radius:100px;}
.badge-dur{background:rgba(0,0,0,0.55);color:var(--green);font-family:var(--mono);font-size:10px;padding:3px 10px;border-radius:100px;}
.preview-mid{display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:40px;}
.play-ring{width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;color:white;}
.hook-text{font-family:var(--display);font-size:18px;text-align:center;color:white;text-shadow:0 2px 8px #000;}
.caption-bar{background:rgba(0,0,0,0.72);border-radius:8px;padding:10px 12px;}
.cap-label{font-family:var(--mono);font-size:9px;color:var(--green);}
.cap-preview{font-size:11px;color:rgba(255,255,255,0.88);}
.card-body{padding:16px;}
.card-title{font-size:14px;font-weight:700;margin-bottom:8px;}
.ts-row{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
.ts-badge{font-family:var(--mono);font-size:11px;color:var(--blue);background:rgba(68,138,255,0.08);border:1px solid rgba(68,138,255,0.2);border-radius:6px;padding:4px 10px;}
.full-cap-box{background:var(--surface);border-left:3px solid var(--green);padding:10px 12px;font-size:12px;font-family:var(--mono);color:var(--sub);margin-bottom:14px;}
.action-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.btn-act{padding:11px;border-radius:9px;border:none;font-family:var(--mono);font-size:11px;cursor:pointer;}
.btn-srt{background:rgba(0,230,118,0.08);color:var(--green);border:1px solid rgba(0,230,118,0.25);}
.btn-cap{background:rgba(68,138,255,0.08);color:var(--blue);border:1px solid rgba(68,138,255,0.25);}
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo"><div class="logo-mark">✂</div><div class="logo-name">Short<span>Craft</span></div></div>
    <div class="live-badge"><div class="pdot"></div>AI LIVE</div>
  </div>
  <div class="hero">
    <h1><span class="red">10 VIRAL</span><br><span>SHORTS</span><br><span class="red">INSTANTLY</span></h1>
    <p class="hero-sub">Paste any YouTube link. AI finds the best moments and generates captions instantly.</p>
  </div>
  <div class="input-card">
    <span class="input-label">YouTube Video Link</span>
    <div class="url-box">
      <input class="url-input" type="url" id="urlInput" placeholder="youtube.com/watch?v=..."/>
      <button class="paste-btn" onclick="pasteURL()">📋 Paste</button>
    </div>
    <button class="btn-main" id="mainBtn" onclick="generate()">⚡ GENERATE 10 SHORTS</button>
  </div>
  <div class="error-card" id="errorCard"></div>
  <div id="status-section">
    <div class="status-top"><div class="spinner"></div><div class="status-txt" id="statusTxt">Analyzing...</div></div>
    <div class="progress-list">
      <div class="p-step" id="ps1">📡 Fetching video info</div>
      <div class="p-step" id="ps2">🧠 AI analyzing key moments</div>
      <div class="p-step" id="ps3">✂️ Creating 10 segments</div>
      <div class="p-step" id="ps4">📝 Writing captions & hooks</div>
    </div>
  </div>
  <div id="results-section">
    <div class="results-header"><div class="results-title">YOUR SHORTS</div><div class="count-badge" id="countBadge">10 Ready ✅</div></div>
    <div class="shorts-list" id="shortsList"></div>
  </div>
</div>
<script>
let shorts = [];
async function pasteURL() { try { const t = await navigator.clipboard.readText(); document.getElementById('urlInput').value = t; } catch(e){} }
function setStep(n) { ['ps1','ps2','ps3','ps4'].forEach((id,i) => { document.getElementById(id).className = i < n ? 'p-step done' : (i === n ? 'p-step active' : 'p-step'); }); }
async function generate() {
  const url = document.getElementById('urlInput').value.trim();
  if(!url) { alert('Paste URL first'); return; }
  const btn = document.getElementById('mainBtn');
  btn.disabled = true;
  document.getElementById('errorCard').style.display = 'none';
  document.getElementById('status-section').style.display = 'block';
  document.getElementById('results-section').style.display = 'none';
  setStep(0);
  try {
    const res = await fetch('/api/generate-shorts', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ url })
    });
    setStep(2);
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Generation failed');
    setStep(4);
    shorts = data.shorts;
    renderResults(shorts);
  } catch(e) {
    document.getElementById('errorCard').style.display = 'block';
    document.getElementById('errorCard').textContent = e.message;
  } finally { btn.disabled = false; document.getElementById('status-section').style.display = 'none'; }
}
function renderResults(data) {
  document.getElementById('results-section').style.display = 'block';
  const list = document.getElementById('shortsList');
  list.innerHTML = '';
  data.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'short-card';
    card.innerHTML = `
      <div class="tiktok-preview" style="background:linear-gradient(170deg,#1a0030,#000520)">
        <div class="preview-content">
          <div class="preview-top-row"><div class="badge-num">SHORT #${i+1}</div><div class="badge-dur">⏱ 30s</div></div>
          <div class="preview-mid"><div class="play-ring">▶</div><div class="hook-text">\${s.hook}</div></div>
          <div class="caption-bar"><div class="cap-label">📝 Caption</div><div class="cap-preview">\${s.caption.slice(0,60)}...</div></div>
        </div>
      </div>
      <div class="card-body">
        <div class="card-title">\${s.title}</div>
        <div class="ts-row"><div class="ts-badge">▶ \${s.start}</div><div class="ts-arrow">→</div><div class="ts-badge">⏹ \${s.end}</div></div>
        <div class="full-cap-box">\${s.caption}</div>
        <div class="action-row">
          <button class="btn-act btn-srt" onclick="alert('SRT Downloaded')">⬇ .SRT File</button>
          <button class="btn-act btn-cap" onclick="navigator.clipboard.writeText('\${s.caption}'); alert('Copied!')">📋 Copy</button>
        </div>
      </div>`;
    list.appendChild(card);
  });
}
</script>
</body>
</html>
  `);
});

// Secure Backend Route using Native HTTPS
app.post('/api/generate-shorts', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: 'Server API key setup is missing' });

  const prompt = `You are a viral short-form video expert. Analyze this video link: ${url}. Produce exactly 10 perfect TikTok clips. Output strictly as a raw JSON array format only, with no markdown backticks: [{"title":"clip title","hook":"punchy hook","start":"00:01:00","end":"00:01:30","caption":"viral text content"}].`;

  const postData = JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });

  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        if (response.statusCode !== 200) {
          return res.status(response.statusCode).json({ error: parsedData.error?.message || 'Anthropic API Error' });
        }
        const rawText = parsedData.content[0].text.trim();
        const shortsData = JSON.parse(rawText);
        res.json({ shorts: shortsData });
      } catch (error) {
        res.status(500).json({ error: 'Failed to parse API response' });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  request.write(postData);
  request.end();
});

module.exports = app;
