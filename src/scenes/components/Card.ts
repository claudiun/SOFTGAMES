import * as PIXI from "pixi.js";
import { ICard } from "../interfaces/IAceOfShadows";
import { IAnimateTo } from "../interfaces/IAceOfShadows";
import { ASSETS } from "../../common/constants";

export class Card extends PIXI.Sprite {
  id: number;
  cardText: PIXI.Text;

  constructor({
    id,
    width = 60,
    height = 90,
    x = 0,
    y = 0,
    zIndex = 0,
    text = String(id),
  }: ICard) {
    // Use the card image as the texture
    const texture = PIXI.Texture.from(ASSETS.CARD);
    super(texture);

    this.id = id;
    this.x = x;
    this.y = y;
    this.zIndex = zIndex;
    this.width = width;
    this.height = height;

    // Add a dynamic text object on top for the card id
    const fontSize = Math.floor(width);
    this.cardText = new PIXI.Text(text, {
      fontFamily: "Arial",
      fontSize,
      fill: 0x000000,
      align: "center",
      wordWrap: true,
      wordWrapWidth: width,
    });
    this.cardText.anchor.set(0.5);
    this.cardText.x = width;
    this.cardText.y = height;
    this.addChild(this.cardText);
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
