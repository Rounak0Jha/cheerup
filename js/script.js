const site = document.querySelector(".site");
const camera = document.querySelector(".camera");
const bg = document.getElementById("backgroundImage");
const track = document.getElementById("contentTrack");
const panels = [...document.querySelectorAll(".panel")];
const dots = [...document.querySelectorAll(".dot")];

const music = document.getElementById("music");
const soundBtn = document.getElementById("soundBtn");
const soundText = document.getElementById("soundText");

let current = 0;
let maxPan = 0;
let positions = [];
let touchStartX = null;
let touchStartY = null;
let scrolling = false;

/*
  Calculate exactly how much of the landscape image is hidden on a phone.
  Example:
  phone width = 390px
  image scaled to phone height = ~650px wide
  hidden width = ~260px

  The four sections then use different camera positions across that hidden area.
*/
function calculateCamera() {
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  if (!bg.naturalWidth || !bg.naturalHeight) return;

  const imageAspect = bg.naturalWidth / bg.naturalHeight;

  if (viewportW <= 900) {
    const renderedWidth = viewportH * imageAspect;
    maxPan = Math.max(0, renderedWidth - viewportW);

    // Move through the entire available image over the four story sections.
    positions = [
      0,
      maxPan * 0.34,
      maxPan * 0.68,
      maxPan
    ];
  } else {
    // Desktop shows the full composition.
    maxPan = 0;
    positions = [0, 0, 0, 0];
  }

  moveTo(current, false);
}

function moveTo(index, animate = true) {
  current = Math.max(0, Math.min(index, panels.length - 1));

  // Content slides left like a simple horizontal story.
  track.style.transitionDuration = animate ? "1.15s" : "0s";
  track.style.transform = `translate3d(-${current * 100}vw, 0, 0)`;

  // Camera independently pans across the original landscape.
  const x = positions[current] || 0;
  bg.style.transition = animate
    ? "transform 1.45s cubic-bezier(.22,.61,.36,1)"
    : "none";
  bg.style.transform = `translate3d(${-x}px, 0, 0)`;

  panels.forEach((panel, i) => {
    panel.classList.toggle("active", i === current);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === current);
  });
}

function startMusic() {
  music.volume = 0.38;
  music.play().catch(() => {
    soundText.textContent = "PLAY";
  });
}

function next() {
  if (current < panels.length - 1) {
    moveTo(current + 1, true);
  }
}

document.querySelectorAll(".next-btn").forEach(button => {
  button.addEventListener("click", () => {
    if (current === 0) startMusic();
    next();
  });
});

soundBtn.addEventListener("click", () => {
  if (music.paused) {
    startMusic();
    soundText.textContent = "SOUND";
  } else {
    music.pause();
    soundText.textContent = "OFF";
  }
});

/*
  Optional natural swipe interaction on phones.
  Buttons are still the primary/simple interaction, but the user can also
  swipe horizontally to move between sections.
*/
site.addEventListener("touchstart", e => {
  if (!e.touches.length) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, {passive: true});

site.addEventListener("touchend", e => {
  if (touchStartX === null || !e.changedTouches.length) return;

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const dx = endX - touchStartX;
  const dy = endY - touchStartY;

  touchStartX = null;
  touchStartY = null;

  // Ignore mostly vertical gestures and tiny movements.
  if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.25) return;

  if (dx < 0) {
    next();
  } else if (dx > 0 && current > 0) {
    moveTo(current - 1, true);
  }
});

window.addEventListener("resize", calculateCamera);
window.addEventListener("orientationchange", () => {
  setTimeout(calculateCamera, 180);
});

if (bg.complete) {
  calculateCamera();
} else {
  bg.addEventListener("load", calculateCamera, {once: true});
}
