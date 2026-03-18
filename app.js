const VIDEO_LIBRARY = {
  default: "videos/default-loop.mp4",
  duniya: "videos/duniya-kiske-hawale.mp4",
  water: "videos/water.mp4",
  earth: "videos/earth.mp4",
  nature: "videos/nature.mp4",
  lifelong: "videos/quality-lifelong.mp4",
  generation: "videos/generation-green.mp4",
  ezcharge: "videos/ez-charge.mp4",
  solaroof: "videos/solaroof.mp4",
  smartmeter: "videos/smart-meter.mp4",
  ai: "videos/power-for-ai.mp4",
  rooftop: "videos/rooftop-qc-demo.mp4",
  rooftopqc: "videos/rooftop-qc-mysine.mp4",
  eneruni: "videos/eneruni-ccra.mp4",
  mix: "videos/energy-mix-explained.mp4",
  drone: "videos/drone-analytics.mp4",
};

const CATEGORIES = [
  {
    title: "DUNIYA KISKE HAWALE?",
    buttons: [{ label: "Watch the future\nwe are leaving behind", key: "duniya", long: true }],
  },
  {
    title: "SOUNDS OF OUR EARTH",
    buttons: [
      { label: "Water", key: "water" },
      { label: "Earth", key: "earth" },
      { label: "Nature", key: "nature" },
    ],
  },
  {
    title: "QUALITY LIFELONG",
    buttons: [{ label: "Discover how clean energy\nimproves everyday living", key: "lifelong", long: true }],
  },
  {
    title: "GENERATION GREEN",
    buttons: [{ label: "See how the next generation\nis shaping a greener future", key: "generation", long: true }],
  },
  {
    title: "SUSTAINABILITY SHOTS",
    buttons: [
      { label: "EZ Charge", key: "ezcharge" },
      { label: "Solaroof", key: "solaroof" },
      { label: "Smart\nMeter", key: "smartmeter" },
    ],
  },
  {
    title: "POWER FOR AI. AI FOR POWER",
    buttons: [{ label: "24x7 green power\nat scale", key: "ai", long: true }],
  },
  {
    title: "SMART ENERGY IN ACTION",
    wide: true,
    buttons: [
      { label: "Rooftop\nQC Demo", key: "rooftop" },
      { label: "Rooftop QC +\nMySine Demo", key: "rooftopqc" },
      { label: "EnerUni + CCRA\nControl Centre", key: "eneruni" },
      { label: "Energy\nMix Explained", key: "mix" },
      { label: "Drone\nAnalytics", key: "drone" },
    ],
  },
];

const statusEl = document.getElementById("status");
const openPlayerBtn = document.getElementById("openPlayerBtn");
const buttonGrid = document.getElementById("buttonGrid");
const categoryTemplate = document.getElementById("categoryTemplate");

let playerWindow = null;
let playerVideo = null;
let currentVideoKey = "default";
let activeRequestToken = 0;

function setStatus(message) {
  statusEl.textContent = message;
}

function buildButtons() {
  for (const category of CATEGORIES) {
    const clone = categoryTemplate.content.cloneNode(true);
    clone.querySelector(".category-title").textContent = category.title;
    const card = clone.querySelector(".category-card");
    const row = clone.querySelector(".button-row");

    if (category.wide) {
      card.classList.add("wide");
    }

    for (const item of category.buttons) {
      const btn = document.createElement("button");
      btn.className = "video-btn";
      btn.type = "button";
      btn.innerHTML = item.label.replaceAll("\n", "<br>");
      if (item.long) btn.classList.add("long");
      btn.dataset.videoKey = item.key;
      btn.addEventListener("click", () => playSelection(item.key));
      row.appendChild(btn);
    }

    buttonGrid.appendChild(clone);
  }
}

function createPlayerDocument(win) {
  win.document.write(`<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Second Screen Player</title>
      <style>
        html, body {
          margin: 0;
          width: 100%;
          height: 100%;
          background: #000;
          overflow: hidden;
        }
        video {
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          background: #000;
        }
      </style>
    </head>
    <body>
      <video id="player" playsinline muted autoplay></video>
    </body>
  </html>`);
  win.document.close();
  playerVideo = win.document.getElementById("player");

  playerVideo.addEventListener("ended", () => {
    if (currentVideoKey !== "default") {
      playDefaultLoop();
    }
  });

  // Try fullscreen (must be user initiated on most browsers)
  if (win.document.fullscreenEnabled) {
    win.document.documentElement.requestFullscreen().catch(() => {});
  }
}

async function openPlayerWindow() {
  if (playerWindow && !playerWindow.closed) {
    playerWindow.focus();
    return true;
  }

  playerWindow = window.open("", "tatapower-video-screen", "popup=yes,width=1280,height=720");

  if (!playerWindow) {
    setStatus("Popup blocked. Allow popups and tap ‘Open Player’ again.");
    return false;
  }

  createPlayerDocument(playerWindow);
  await playDefaultLoop();
  setStatus("Player opened. Default video looping.");
  return true;
}

async function playVideoByKey(videoKey, { loop = false } = {}) {
  if (!playerVideo) {
    const opened = await openPlayerWindow();
    if (!opened) return;
  }

  const source = VIDEO_LIBRARY[videoKey];
  if (!source) {
    setStatus(`Missing mapping for: ${videoKey}`);
    return;
  }

  playerVideo.loop = loop;
  playerVideo.src = source;

  try {
    await playerVideo.play();
  } catch {
    setStatus("Autoplay blocked. Touch any button once to start playback.");
  }
}

async function playDefaultLoop() {
  currentVideoKey = "default";
  await playVideoByKey("default", { loop: true });
  setStatus("Default video is playing in loop.");
}

async function playSelection(videoKey) {
  activeRequestToken += 1;
  const requestToken = activeRequestToken;

  currentVideoKey = videoKey;
  await playVideoByKey(videoKey, { loop: false });

  if (requestToken !== activeRequestToken) {
    return;
  }

  setStatus(`Playing: ${videoKey}. Will return to default loop after ending.`);
}

openPlayerBtn.addEventListener("click", openPlayerWindow);

buildButtons();
playDefaultLoop();
