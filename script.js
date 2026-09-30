const enterScreen =
  document.getElementById("enterScreen");

const restartButton =
  document.getElementById("restartButton");

const scenes =
  Array.from(
    document.querySelectorAll(".scene")
  );

let currentScene = -1;
let running = false;
let timers = [];

const sceneDuration = 3000;
const fadeDuration = 1000;


/* =========================================
   TIMER MANAGEMENT
   ========================================= */

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}


/* =========================================
   SHOW SCENE
   ========================================= */

function showScene(index) {

  if (index < 0 || index >= scenes.length) {
    finishExperience();
    return;
  }

  const previous =
    scenes[currentScene];

  const next =
    scenes[index];

  if (previous) {
    previous.classList.remove("active");
    previous.classList.add("leaving");

    const fadeTimer = setTimeout(() => {
      previous.classList.remove("leaving");
    }, fadeDuration);

    timers.push(fadeTimer);
  }

  next.classList.add("active");
  next.setAttribute("aria-hidden", "false");

  currentScene = index;

  /*
    Hold the scene long enough to read,
    then move to the next one.
  */

  const nextTimer = setTimeout(() => {

    next.classList.remove("active");
    next.setAttribute("aria-hidden", "true");

    const followingTimer = setTimeout(() => {
      showScene(index + 1);
    }, fadeDuration);

    timers.push(followingTimer);

  }, sceneDuration);

  timers.push(nextTimer);
}


/* =========================================
   START
   ========================================= */

function startExperience() {

  if (running) return;

  running = true;

  clearTimers();

  currentScene = -1;

  scenes.forEach((scene) => {
    scene.classList.remove(
      "active",
      "leaving"
    );

    scene.setAttribute(
      "aria-hidden",
      "true"
    );
  });

  enterScreen.classList.add("hidden");

  /*
    Give the entrance fade a moment
    before the first scene appears.
  */

  const timer = setTimeout(() => {
    showScene(0);
  }, 900);

  timers.push(timer);
}


/* =========================================
   FINISH
   ========================================= */

function finishExperience() {

  running = false;

  clearTimers();

  const last =
    scenes[scenes.length - 1];

  if (last) {
    last.classList.remove("active");
    last.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  currentScene = -1;

  /*
    Return to the black entrance screen.
  */

  const timer = setTimeout(() => {
    enterScreen.classList.remove("hidden");
  }, 1200);

  timers.push(timer);
}


/* =========================================
   RESTART
   ========================================= */

function restartExperience() {

  clearTimers();

  running = false;

  scenes.forEach((scene) => {
    scene.classList.remove(
      "active",
      "leaving"
    );

    scene.setAttribute(
      "aria-hidden",
      "true"
    );
  });

  currentScene = -1;

  enterScreen.classList.remove("hidden");
}


/* =========================================
   ENTER SCREEN
   ========================================= */

enterScreen.addEventListener(
  "click",
  startExperience
);

enterScreen.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      startExperience();
    }

  }
);


/* =========================================
   RESTART BUTTON
   ========================================= */

restartButton.addEventListener(
  "click",
  (event) => {

    event.stopPropagation();

    restartExperience();

  }
);


/* =========================================
   TAP ANYWHERE TO RESTART
   AFTER FINAL SCENE
   ========================================= */

document.addEventListener(
  "click",
  (event) => {

    if (!running) return;

    /*
      Don't hijack the email.
    */

    if (
      event.target.closest(".email") ||
      event.target.closest(".restart")
    ) {
      return;
    }

    /*
      If the final scene is currently
      visible, tapping restarts.
    */

    if (
      currentScene === scenes.length - 1
    ) {
      restartExperience();
    }

  }
);


/* =========================================
   TOUCH ANYWHERE TO RESTART
   ========================================= */

document.addEventListener(
  "touchend",
  (event) => {

    if (!running) return;

    if (
      event.target.closest(".email") ||
      event.target.closest(".restart")
    ) {
      return;
    }

    if (
      currentScene === scenes.length - 1
    ) {
      restartExperience();
    }

  },
  {
    passive: true
  }
);
