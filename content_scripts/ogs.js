function getGameId() {
  const match = location.pathname.match(/^\/game\/(\d+)/);
  return match ? match[1] : null;
}

function addButton() {
  const gameId = getGameId();
  const existing = document.getElementById("aisensei-btn");

  if (!gameId) {
    if (existing) existing.remove();
    return;
  }

  if (existing) {
    if (existing.dataset.gameId !== gameId) {
      existing.dataset.gameId = gameId;
    }
    return;
  }

  const btn = document.createElement("a");
  btn.id = "aisensei-btn";
  btn.href = "#";
  btn.textContent = "Review on AI Sensei";
  btn.title = "Open this game in AI Sensei for review";
  btn.dataset.gameId = gameId;
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    const id = btn.dataset.gameId || getGameId();
    if (!id) return;
    const ogsUrl = `https://online-go.com/game/${id}`;
    browser.runtime.sendMessage({ type: "open-aisensei", ogsUrl });
  });

  // Preferred: insert into the game sidebar, after the game-info block.
  const sidebar = document.querySelector(".GobanView-sidebar-content");
  if (sidebar) {
    const infoBlock = sidebar.querySelector(".condensed-game-information");
    if (infoBlock) {
      infoBlock.insertAdjacentElement("afterend", btn);
    } else {
      sidebar.appendChild(btn);
    }
    return;
  }

  // Fallback: other candidate anchor points.
  const anchors = [
    ".GobanView-sidebar",
    ".GobanView-tab-bar-right",
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

// OGS is a SPA — watch for the game UI to appear and for client-side
// navigation between pages.
const observer = new MutationObserver(addButton);
observer.observe(document.body, { childList: true, subtree: true });

let lastPath = location.pathname;
setInterval(() => {
  if (location.pathname !== lastPath) {
    lastPath = location.pathname;
    addButton();
  }
}, 500);

window.addEventListener("popstate", addButton);
addButton();
