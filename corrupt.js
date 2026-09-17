// window.triggerCorrupt = function () {
//   const replacementText = "You saw the addiction. Did you see the person?";

//   // --- 1. Safely Replace DOM Text ---
//   function replaceDOMText(node) {
//     if (node.nodeType === Node.TEXT_NODE) {
//       if (node.nodeValue.trim().length > 0 && node.nodeValue !== replacementText) {
//         node.nodeValue = replacementText;
//       }
//     } else {
//       // Avoid modifying script/style elements
//       if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
//         for (let child of node.childNodes) {
//           replaceDOMText(child);
//         }
//       }
//     }
//   }

//   replaceDOMText(document.body);

//   // Observe changes without infinite loops
//   const observer = new MutationObserver((mutations) => {
//     // Temporarily disconnect observer to avoid self-triggering
//     observer.disconnect();
    
//     mutations.forEach((mutation) => {
//       mutation.addedNodes.forEach((node) => {
//         replaceDOMText(node);
//       });
//     });

//     // Re-engage observer
//     observer.observe(document.body, { childList: true, subtree: true });
//   });

//   observer.observe(document.body, { childList: true, subtree: true });

//   // --- 2. Override p5.js Text Rendering Globally ---
  
//   // A. Prototype override (for any new instances/methods)
//   if (window.p5 && window.p5.prototype) {
//     const originalText = window.p5.prototype.text;
//     window.p5.prototype.text = function (str, x, y, x2, y2) {
//       return originalText.call(this, replacementText, x, y, x2, y2);
//     };
//   }

//   // B. Override active p5 instance methods (Instance Mode Fix)
//   // If your sketch is assigned to a global variable (e.g., `mySketch`), hook directly:
//   if (window.mySketch && typeof window.mySketch.text === 'function') {
//     const activeText = window.mySketch.text;
//     window.mySketch.text = function (str, x, y, x2, y2) {
//       return activeText.call(this, replacementText, x, y, x2, y2);
//     };
//   }
// };








window.triggerCorrupt = function () {
  const replacementText = "You saw the addiction. Did you see the person?";

  // --- 1. DOM Text Corruption (Excludes the Final Modal) ---
  function replaceDOMText(node) {
    // DO NOT corrupt anything inside the final modal
    if (
      node.id === "whats-new-modal" ||
      (node.closest && node.closest("#whats-new-modal"))
    ) {
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      if (
        node.nodeValue.trim().length > 0 &&
        node.nodeValue !== replacementText
      ) {
        node.nodeValue = replacementText;
      }
    } else {
      if (node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE") {
        for (let child of node.childNodes) {
          replaceDOMText(child);
        }
      }
    }
  }

  // Corrupt existing text on screen
  replaceDOMText(document.body);

  // Monitor DOM for new content
  const observer = new MutationObserver((mutations) => {
    observer.disconnect();

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        replaceDOMText(node);
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // --- 2. Override p5.js Text Rendering ---
  if (window.p5 && window.p5.prototype) {
    const originalText = window.p5.prototype.text;

    window.p5.prototype.text = function (str, x, y, x2, y2) {
      return originalText.call(
        this,
        replacementText,
        x,
        y,
        x2,
        y2
      );
    };
  }

  if (
    window.mySketch &&
    typeof window.mySketch.text === "function"
  ) {
    const activeText = window.mySketch.text;

    window.mySketch.text = function (str, x, y, x2, y2) {
      return activeText.call(
        this,
        replacementText,
        x,
        y,
        x2,
        y2
      );
    };
  }

  // --- 3. Timeline Sequence ---
  // Wait 6 seconds before starting the popup sequence
  setTimeout(() => {
    startPopupsAndDarken(observer);
  }, 6000);
};


function startPopupsAndDarken(observer) {
  // --- Show dark background with purple border ---
  const borderOverlay = document.getElementById(
    "purple-border-overlay"
  );

  if (borderOverlay) {
    borderOverlay.classList.remove("hidden");
  }

  const adContainer = document.getElementById(
    "popup-ads-container"
  );

  if (adContainer) {
    adContainer.classList.remove("hidden");
  }


  // --- Popup Text ---
  const adSentences = [
    "You saw the addiction.",
    "Did you see the person?",
    "SYSTEM OVERRIDE: SDG 3.5",
    "People struggling with addiction need empathy.",
    "Compulsory rehabilitation shows high relapse rates.",
    "Voluntary treatment offers real support and freedom.",
    "I finally summoned up the courage to say: I need help.",
    "Erase the stigma around substance use disorders.",
    "Rehabilitation is a freeing experience.",
    "Look beyond the suffering."
  ];


  // =========================================================
  // POPUP SOUNDS
  // =========================================================

  // All 9 available sounds
  const soundFiles = [
    "designed-sounds/COMM2754-2026-S2-A3w12-radiosilent-anim.wav",
    "designed-sounds/COMM2754-2026-S2-A3w12-noise-anim.wav",
    "designed-sounds/COMM2754-2026-S2-A3w12-low-airleak-anim.wav",
    "designed-sounds/COMM2754-2026-S2-A3w12-goofy-anim.wav",
    "designed-sounds/COMM2754-2026-S2-A3w12-flashing-anim.wav",
    "designed-sounds/COMM2754-2026-S2-A3w12-blip-anim.wav",
    "designed-sounds/COMM2754-2026-S2-A3w12-blip2-anim.wav",
    "designed-sounds/COMM2754-2026-S2-A3w12-beat-anim.wav",
    "designed-sounds/COMM2754-2026-S2-A3w12-airleak-1-anim.wav"
  ];


  // Randomly select ONLY 3 unique sounds
  const selectedSounds = [...soundFiles]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);


  // Play one random sound from the selected 3
  function playPopupSound() {
    const soundFile =
      selectedSounds[
        Math.floor(Math.random() * selectedSounds.length)
      ];

    const audio = new Audio(soundFile);

    audio.volume = 0.7;

    audio.play().catch((error) => {
      console.log("Popup sound could not play:", error);
    });
  }


  // =========================================================
  // POPUP CREATION
  // =========================================================

  let adIndex = 0;

  // Spawn 1 popup every second
  const popupInterval = setInterval(() => {
    if (adIndex >= adSentences.length) {
      clearInterval(popupInterval);
      return;
    }


    // Create popup
    const popup = document.createElement("div");

    popup.className = "corrupt-ad-popup";

    popup.style.top =
      Math.floor(Math.random() * 65 + 10) + "vh";

    popup.style.left =
      Math.floor(Math.random() * 60 + 10) + "vw";


    // Popup HTML
    popup.innerHTML = `
      <div class="ad-header">
        <span>WARNING</span>
        <button class="ad-close-btn">X</button>
      </div>

      <div class="ad-body">
        ${adSentences[adIndex]}
      </div>
    `;


    // Add popup to container
    if (adContainer) {
      adContainer.appendChild(popup);
    }


    // Play a random sound from the selected 3
    playPopupSound();


    adIndex++;

  }, 1000);


  // =========================================================
  // FADE OUT POPUPS
  // =========================================================

  setTimeout(() => {
    clearInterval(popupInterval);

    if (adContainer) {
      adContainer.classList.add("fade-out");
    }


    // Freeze p5 sketch animation loop
    if (
      window.mySketch &&
      typeof window.mySketch.noLoop === "function"
    ) {
      window.mySketch.noLoop();
    }


    // =======================================================
    // REVEAL FINAL MODAL
    // =======================================================

    setTimeout(() => {

      // Stop DOM corruption
      if (observer) {
        observer.disconnect();
      }


      // Remove popup ads
      if (adContainer) {
        adContainer.innerHTML = "";

        adContainer.classList.remove("fade-out");

        adContainer.classList.add("hidden");
      }


      // Display final clean modal
      const mainModal =
        document.getElementById("whats-new-modal");

      if (mainModal) {
        mainModal.classList.remove("hidden");
      }

    }, 5000);

  }, 10000);
}


// =============================================================
// CLOSE FINAL MODAL → RELOAD PAGE
// =============================================================

document.addEventListener("DOMContentLoaded", () => {

  const closeBtn =
    document.getElementById("close-modal-btn");

  if (closeBtn) {

    closeBtn.addEventListener("click", () => {
      window.location.reload();
    });

  }

});
