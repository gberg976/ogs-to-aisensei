function getGameId() {
  const match = location.pathname.match(/^\/game\/(\d+)/);
  return match ? match[1] : null;
}

function addButton() {
  if (document.getElementById("aisensei-btn")) return;

  const gameId = getGameId();
  if (!gameId) return;

  const btn = document.createElement("a");
  btn.id = "aisensei-btn";
  btn.href = "#";
  btn.textContent = "Review on AI Sensei";
  btn.title = "Open this game in AI Sensei for review";
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    const ogsUrl = `https://online-go.com/game/${gameId}`;
    browser.runtime.sendMessage({ type: "open-aisensei", ogsUrl });
  });

  // Preferred: insert after the "Add to library" link in the Dock panel.
  const dock = document.querySelector(".Dock");
  if (dock) {
    const libraryLink = Array.from(dock.querySelectorAll("a")).find(
      (a) => a.querySelector(".fa-plus") && a.textContent.includes("library")
    );
    if (libraryLink) {
      libraryLink.insertAdjacentElement("afterend", btn);
    } else {
      dock.appendChild(btn);
    }
    return;
  }

  // Fallback: other candidate anchor points.
  const anchors = [
    ".game-action-buttons",
    ".action-bar",
    "#game-nav-details",
    ".NavBar",
  ];

  for (const selector of anchors) {
    const el = document.querySelector(selector);
    if (el) {
      el.appendChild(btn);
      return;
    }
  }

  // Fallback: fixed overlay in the corner.
  btn.classList.add("aisensei-floating");
  document.body.appendChild(btn);
}

// OGS is a SPA — watch for the game UI to appear.
const observer = new MutationObserver(addButton);
observer.observe(document.body, { childList: true, subtree: true });
addButton();
