import * as PIXI from "pixi.js";

export class BackButton extends PIXI.Container {
  private icon: PIXI.Graphics;

  constructor(onClick: () => void) {
    super();
    this.icon = this.createIcon();
    this.addChild(this.icon);
    this.eventMode = "static";
    this.cursor = "pointer";
    this.hitArea = new PIXI.Rectangle(0, 0, 44, 44);
    this.zIndex = 1000;
    this.on("pointertap", onClick);
  }

  private createIcon(): PIXI.Graphics {
    const g = new PIXI.Graphics();
    // Draw a large, bold left arrow with a wider angle and middle shaft, centered
    g.lineStyle(4, 0xffffff, 1);
    g.moveTo(32, 6).lineTo(14, 22).lineTo(32, 38);
    // Draw the middle shaft
    // g.moveTo(14, 22).lineTo(36, 22);
    return g;
  }
}
