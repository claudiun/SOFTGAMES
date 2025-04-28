import * as PIXI from "pixi.js";

import { Menu } from "./menu";
import { showAceOfShadows } from "./tasks/aceofshadow";
import { showMagicWords } from "./tasks/magicwords";
import { showPhoenixFlame } from "./tasks/phoenixflame";
import { FpsCounter, FullscreenButton } from "./utils/ui";

const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: 0x222222,
});
document.body.appendChild(app.view as HTMLCanvasElement);

let currentScene: PIXI.DisplayObject | null = null;
let menu: Menu | null = null;
const fpsCounter = new FpsCounter();
const fullscreenBtn = new FullscreenButton();

function clearScene() {
  if (currentScene) {
    app.stage.removeChild(currentScene);
    if (
      "destroy" in currentScene &&
      typeof (currentScene as any).destroy === "function"
    ) {
      (currentScene as any).destroy();
    }
    currentScene = null;
  }
}

function showMenu() {
  clearScene();
  if (menu) menu.destroy();
  menu = new Menu((task) => {
    if (menu) menu.destroy();
    if (task === "aceofshadow") {
      clearScene();
      currentScene = showAceOfShadows(app);
    } else if (task === "magicwords") {
      clearScene();
      currentScene = showMagicWords(app);
    } else if (task === "phoenixflame") {
      clearScene();
      currentScene = showPhoenixFlame(app);
    }
    // Add a back button
    const backBtn = document.createElement("button");
    backBtn.textContent = "Back to Menu";
    backBtn.style.position = "fixed";
    backBtn.style.bottom = "16px";
    backBtn.style.left = "50%";
    backBtn.style.transform = "translateX(-50%)";
    backBtn.style.zIndex = "100";
    backBtn.onclick = () => {
      backBtn.remove();
      showMenu();
    };
    document.body.appendChild(backBtn);
  });
}

window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

showMenu();
