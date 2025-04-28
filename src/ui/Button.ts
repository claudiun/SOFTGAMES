import * as PIXI from "pixi.js";
import { IButton } from "./models/IButton";

export class Button extends PIXI.Container {
  constructor({
    label,
    width = 180,
    height = 50,
    onClick,
    fontSize = 22,
    backgroundColor = 0x444444,
    radius = 10,
    textColor = 0xffffff,
  }: IButton) {
    super();
    this.eventMode = "static";
    this.cursor = "pointer";

    // Background
    const bg = new PIXI.Graphics();
    bg.beginFill(backgroundColor);
    bg.drawRoundedRect(0, 0, width, height, radius);
    bg.endFill();
    this.addChild(bg);

    // Label
    const text = new PIXI.Text(label, {
      fontFamily: "Arial",
      fontSize,
      fill: textColor,
      align: "center",
    });
    text.anchor.set(0.5);
    text.x = width / 2;
    text.y = height / 2;
    this.addChild(text);

    this.on("pointertap", onClick);
  }
}
