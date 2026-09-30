/* =========================================================
   HMU IF UR BORED L8TER
   Touch-to-enter / staged reveal / restart
   ========================================================= */

const enterScreen = document.getElementById("enterScreen");
const restartButton = document.getElementById("restartButton");
const revealElements = document.querySelectorAll(".reveal");

let timers = [];
let started = false;

/* -----------------------------------------
   Clear all pending animation timers
   ----------------------------------------- */

function clearTimers() {
  timers.forEach((timer) => clearTimeout(timer));
  timers = [];
}

/* -----------------------------------------
   Hide everything
   ----------------------------------------- */

function resetReveals() {
  revealElements.forEach((element) => {
    element.classList.remove("show");

    /*
      Force the browser to recognize the reset
      before another animation begins.
    */
    void element.offsetWidth;
  });
}

/* -----------------------------------------
   Start the experience
   ----------------------------------------- */

function startExperience() {
  if (started) return;

  started = true;
  clearTimers();
  resetReveals();

  /* Remove entry screen */

  enterScreen.classList.add("hidden");

  /*
    Stagger the page into existence.
    Each section gets a little more breathing
    room before appearing.
  */

  revealElements.forEach((element) => {
    const delay = Number(element.dataset.delay) || 0;

    const timer = setTimeout(() => {
      element.classList.add("show");
    }, delay);

    timers.push(timer);
  });
}

/* -----------------------------------------
   Restart the experience
   ----------------------------------------- */

function restartExperience() {
  clearTimers();
  started = false;

  /*
    Fade the page back into darkness.
  */

  revealElements.forEach((element) => {
    element.classList.remove("show");
  });

  /*
    Wait just long enough for the disappearance
    to feel intentional.
  */

  const timer = setTimeout(() => {
    enterScreen.classList.remove("hidden");
  }, 500);

  timers.push(timer);
}

/* -----------------------------------------
   Touch / click entry
   ----------------------------------------- */

enterScreen.addEventListener("click", startExperience);

/* -----------------------------------------
   Keyboard accessibility
   ----------------------------------------- */

enterScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    startExperience();
  }
});

/* -----------------------------------------
   Restart button
   ----------------------------------------- */

restartButton.addEventListener("click", (event) => {
  event.stopPropagation();
  restartExperience();
});

/* -----------------------------------------
   Touch anywhere to restart
   after the experience has completed
   ----------------------------------------- */

document.addEventListener(
  "click",
  (event) => {
    if (!started) return;

    /*
      Don't interfere with the email link
      or restart button.
    */

    if (
      event.target.closest(".email") ||
      event.target.closest(".restart")
    ) {
      return;
    }

    /*
      Only restart once the final section
      has had time to appear.
    */

    const finalSection = document.querySelector(".closing");

    if (
      finalSection &&
      finalSection.classList.contains("show")
    ) {
      restartExperience();
    }
  }
);

/* -----------------------------------------
   Touch support
   ----------------------------------------- */

document.addEventListener(
  "touchend",
  (event) => {
    if (!started) return;

    if (
      event.target.closest(".email") ||
      event.target.closest(".restart") ||
      event.target.closest(".enter-screen")
    ) {
      return;
    }

    const finalSection = document.querySelector(".closing");

    if (
      finalSection &&
      finalSection.classList.contains("show")
    ) {
      restartExperience();
    }
  },
  {
    passive: true
  }
);
