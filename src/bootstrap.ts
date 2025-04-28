import * as PIXI from "pixi.js";

import { AceOfShadows } from "./scenes/AceOfShadows";
import { MagicWords } from "./scenes/MagicWords";
import { PhoenixFlame } from "./scenes/PhoenixFlame";
import { FpsCounter } from "./ui/FpsCounter";
import { FullscreenButton } from "./ui/FullscreenButton";
import { Menu } from "./ui/Menu";
import { EVENTS } from "./comm/events";

const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: 0x222222,
});
document.body.appendChild(app.view as HTMLCanvasElement);

let currentScene: PIXI.DisplayObject | null = null;
let menu: Menu;
const fpsCounter = new FpsCounter();
const fullscreenBtn = new FullscreenButton();

function clearScene() {
  if (currentScene) {
    app.stage.removeChild(currentScene);
  }
  if (menu) {
    app.stage.removeChild(menu);
  }
}

function showMenu() {
  menu = new Menu(app, (task: string) => {
    if (menu) {
      app.stage.removeChild(menu);
    }
    if (task === "aceofshadow") {
      clearScene();
      currentScene = AceOfShadows(app);
    } else if (task === "magicwords") {
      clearScene();
      // currentScene = MagicWords(app);
    } else if (task === "phoenixflame") {
      clearScene();
      currentScene = PhoenixFlame(app);
    }
    if (currentScene) {
      currentScene.on(EVENTS.BACK_TO_MENU, () => {
        showMenu();
      });
    }
  });
  app.stage.addChild(menu);
}

window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

showMenu();
