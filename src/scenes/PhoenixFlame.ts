import * as PIXI from "pixi.js";
import { log } from "../utils/log";
import { Button } from "../ui/Button";
import { EVENTS } from "../comm/events";

export function PhoenixFlame(app: PIXI.Application) {
  log("showPhoenixFlame");
  const sceneContainer = new PIXI.Container();
  const text = new PIXI.Text("Phoenix Flame", {
    fontFamily: "Arial",
    fontSize: 48,
    fill: 0x0000ff,
  });
  text.anchor.set(0.5);
  text.x = app.screen.width / 2;
  text.y = app.screen.height / 2;
  sceneContainer.addChild(text);

  const backBtn = new Button({
    label: "Back to Menu",
    onClick: () => {
      sceneContainer.emit(EVENTS.BACK_TO_MENU);
    },
  });
  backBtn.x = 16;
  backBtn.y = 16;
  backBtn.zIndex = 1000;
  sceneContainer.addChild(backBtn);
  sceneContainer.sortChildren();

  return sceneContainer;
}
