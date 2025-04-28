import * as PIXI from "pixi.js";
import { log } from "../utils/log";

export function showMagicWords(app: PIXI.Application) {
  log("showMagicWords");
  const text = new PIXI.Text("Magic Words", {
    fontFamily: "Arial",
    fontSize: 48,
    fill: 0x00ff00,
  });
  text.anchor.set(0.5);
  text.x = app.screen.width / 2;
  text.y = app.screen.height / 2;
  app.stage.addChild(text);
  return text;
}
