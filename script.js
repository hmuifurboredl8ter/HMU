const enterScreen = document.getElementById("enterScreen");
const restartButton = document.getElementById("restartButton");
const scenes = Array.from(document.querySelectorAll(".scene"));

let currentScene = -1;
let running = false;
let timers = [];

const fadeDuration = 1400;
const openingPause = 1200;

// Each scene has its own display duration, in milliseconds.
const sceneDurations = [
  4800, 5200, 4200, 4800, 5200, 4200, 3800, 4200, 5600,
  4000, 5200, 4800, 4600, 4200, 4200, 5200, 4600, 3600,
  3600, 4400, 5200, 4000, 6000, 5200, 4200, 4800, 4600,
  9000
];

function schedule(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  timers.push(timer);
  return timer;
}

function clearTimers() {
  timers.forEach(window.clearTimeout);
  timers = [];
}

function resetScenes() {
  scenes.forEach((scene) => {
    scene.classList.remove("active", "leaving");
    scene.setAttribute("aria-hidden", "true");
  });
  currentScene = -1;
}

function showScene(index) {
  if (index >= scenes.length) {
    finishExperience();
    return;
  }

  const previous = scenes[currentScene];
  const next = scenes[index];

  if (previous) {
    previous.classList.remove("active");
    previous.classList.add("leaving");
    previous.setAttribute("aria-hidden", "true");

    schedule(() => previous.classList.remove("leaving"), fadeDuration);
  }

  currentScene = index;
  next.classList.remove("leaving");
  next.classList.add("active");
  next.setAttribute("aria-hidden", "false");

  // The final scene stays visible until the visitor touches the screen.
  if (index === scenes.length - 1) return;

  const duration = sceneDurations[index] ?? 4500;

  schedule(() => {
    if (!running || currentScene !== index) return;

    next.classList.remove("active");
    next.classList.add("leaving");
    next.setAttribute("aria-hidden", "true");

    schedule(() => {
      if (!running || currentScene !== index) return;
      next.classList.remove("leaving");
      showScene(index + 1);
    }, fadeDuration);
  }, duration);
}

function startExperience() {
  if (running) return;

  running = true;
  clearTimers();
  resetScenes();
  enterScreen.classList.add("hidden");

  schedule(() => {
    if (running) showScene(0);
  }, openingPause);
}

function finishExperience() {
  running = false;
  clearTimers();
  resetScenes();
  enterScreen.classList.remove("hidden");
}

function restartExperience() {
  clearTimers();
  running = false;
  resetScenes();
  enterScreen.classList.remove("hidden");
}

function handleEnterKey(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    startExperience();
  }
}

enterScreen.addEventListener("click", startExperience);
enterScreen.addEventListener("keydown", handleEnterKey);

restartButton.addEventListener("click", (event) => {
  event.stopPropagation();
  restartExperience();
});

// On the last scene, touching anywhere outside the email or Restart
// returns to the entry screen. The visitor can then touch to replay.
document.addEventListener("click", (event) => {
  if (!running || currentScene !== scenes.length - 1) return;
  if (event.target.closest(".email, .restart")) return;
  restartExperience();
});

document.addEventListener("keydown", (event) => {
  if (!running || currentScene !== scenes.length - 1) return;
  if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
    if (event.target.closest(".email, .restart")) return;
    restartExperience();
  }
});
