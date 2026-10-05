const intro = document.getElementById("intro");
const message = document.getElementById("message");
const final = document.getElementById("final");
const gift = document.getElementById("gift");

const enterBtn = document.getElementById("enterBtn");
const revealBtn = document.getElementById("revealBtn");
const giftBtn = document.getElementById("giftBtn");

const music = document.getElementById("music");
const soundBtn = document.getElementById("soundBtn");
const soundText = document.getElementById("soundText");

function show(sectionToShow, sectionToHide) {
  sectionToHide.classList.add("hidden");
  setTimeout(() => sectionToShow.classList.remove("hidden"), 450);
}

function startMusic() {
  music.volume = 0.38;
  music.play().catch(() => {
    soundText.textContent = "PLAY";
  });
}

enterBtn.addEventListener("click", () => {
  startMusic();
  show(message, intro);
});

revealBtn.addEventListener("click", () => {
  show(final, message);
});

giftBtn.addEventListener("click", () => {
  show(gift, final);
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
