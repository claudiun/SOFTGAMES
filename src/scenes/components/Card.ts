import * as PIXI from "pixi.js";
import { ICard } from "../models/IAceOfShadows";
import { IAnimateTo } from "../models/IAceOfShadows";

export class Card extends PIXI.Container {
  id: number;
  private cardBg: PIXI.Graphics;
  private cardText: PIXI.Text;

  constructor({
    id,
    width = 60,
    height = 90,
    x = 0,
    y = 0,
    zIndex = 0,
  }: ICard) {
    super();
    this.id = id;
    this.x = x;
    this.y = y;
    this.zIndex = zIndex;

    this.cardBg = this.createCardBackground(width, height);
    this.addChild(this.cardBg);

    this.cardText = this.createCardText(id, width, height);
    this.addChild(this.cardText);
  }

  private createCardBackground(width: number, height: number): PIXI.Graphics {
    const cardBg = new PIXI.Graphics();
    cardBg.beginFill(0xffffff);
    cardBg.lineStyle(2, 0x000000);
    cardBg.drawRoundedRect(0, 0, width, height, 10);
    cardBg.endFill();
    return cardBg;
  }

  private createCardText(id: number, width: number, height: number): PIXI.Text {
    const cardText = new PIXI.Text(String(id), {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0x000000,
      align: "center",
    });
    cardText.anchor.set(0.5);
    cardText.x = width / 2;
    cardText.y = height / 2;
    return cardText;
  }

  animateTo({ app, x, y, zIndex, duration = 2, onComplete }: IAnimateTo) {
    let elapsed = 0;
    const startX = this.x;
    const startY = this.y;
    const targetX = x;
    const targetY = y;
    const animate = () => {
      elapsed += app.ticker.deltaMS / 1000;
      const t = Math.min(elapsed / duration, 1);
      this.x = startX + (targetX - startX) * t;
      this.y = startY + (targetY - startY) * t;
      if (t >= 1) {
        app.ticker.remove(animate);
        this.x = targetX;
        this.y = targetY;
        if (typeof zIndex === "number") this.zIndex = zIndex;
        if (onComplete) onComplete();
      }
    };
    app.ticker.add(animate);
  }
}
