import * as PIXI from "pixi.js";
import { log } from "../utils/log";

export function showAceOfShadows(app: PIXI.Application) {
  log("showAceOfShadows");

  const text = new PIXI.Text("Ace of Shadows", {
    fontFamily: "Arial",
    fontSize: 48,
    fill: 0xff0000,
  });
  text.anchor.set(0.5);
  text.x = app.screen.width / 2;
  text.y = app.screen.height / 2;
  app.stage.addChild(text);
  return text;
}
