import * as PIXI from "pixi.js";
import { log } from "../utils/log";

export function showPhoenixFlame(app: PIXI.Application) {
  log("showPhoenixFlame");
  const text = new PIXI.Text("Phoenix Flame", {
    fontFamily: "Arial",
    fontSize: 48,
    fill: 0x0000ff,
  });
  text.anchor.set(0.5);
  text.x = app.screen.width / 2;
  text.y = app.screen.height / 2;
  app.stage.addChild(text);
  return text;
}
