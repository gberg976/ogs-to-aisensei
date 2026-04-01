function getGameId() {
  const match = location.pathname.match(/^\/game\/(\d+)/);
  return match ? match[1] : null;
}

function addButton() {
  if (document.getElementById("aisensei-btn")) return;

  const gameId = getGameId();
  if (!gameId) return;

  const btn = document.createElement("button");
  btn.id = "aisensei-btn";
  btn.textContent = "Review on AI Sensei";
  btn.title = "Open this game in AI Sensei for review";
  btn.addEventListener("click", () => {
    const ogsUrl = `https://online-go.com/game/${gameId}`;
    browser.runtime.sendMessage({ type: "open-aisensei", ogsUrl });
  });

  // OGS renders its controls dynamically; try a few candidate anchor points.
  const anchors = [
    ".action-bar",
    ".game-action-buttons",
    ".chat-input-container",
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
