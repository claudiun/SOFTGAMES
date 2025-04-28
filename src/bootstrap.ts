import * as PIXI from "pixi.js";

import { AceOfShadows } from "./scenes/AceOfShadows";
import { MagicWords } from "./scenes/MagicWords";
import { PhoenixFlame } from "./scenes/PhoenixFlame";
import { FpsCounter } from "./ui/FpsCounter";
import { Menu } from "./ui/Menu";
import { EVENTS } from "./common/events";

const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: 0x222222,
});
document.body.appendChild(app.view as HTMLCanvasElement);

let currentScene: PIXI.DisplayObject | null = null;
let menu: Menu;
const fpsCounter = new FpsCounter(app);

function clearScene() {
  if (currentScene) {
    app.stage.removeChild(currentScene);
  }
  if (menu) {
    app.stage.removeChild(menu);
  }
  app.stage.addChild(fpsCounter);
}

function showMenu() {
  menu = new Menu(app, (task: string) => {
    if (menu) {
      app.stage.removeChild(menu);
    }
    if (task === "aceofshadow") {
      clearScene();
      currentScene = new AceOfShadows(app);
    } else if (task === "magicwords") {
      clearScene();
      currentScene = new MagicWords(app);
    } else if (task === "phoenixflame") {
      clearScene();
      currentScene = new PhoenixFlame(app);
    }
    if (currentScene) {
      currentScene.on(EVENTS.BACK_TO_MENU, () => {
        showMenu();
      });
      app.stage.addChild(fpsCounter);
    }
  });
  app.stage.addChild(menu);
  app.stage.addChild(fpsCounter);
}

window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

showMenu();
