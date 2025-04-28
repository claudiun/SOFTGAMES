import * as PIXI from "pixi.js";
import { Button } from "../ui/Button";
import { EVENTS } from "../comm/events";

export function PhoenixFlame(app: PIXI.Application): PIXI.Container {
  const sceneContainer = new PIXI.Container();

  // Parameters
  const MAX_FLAMES = 10;
  const flames: {
    g: PIXI.Graphics;
    baseRadius: number;
    color: number;
    offset: number;
  }[] = [];
  const colors = [0xff3300, 0xff9900, 0xffff66]; // red, orange, yellow

  // Create layered flame circles
  for (let i = 0; i < MAX_FLAMES; i++) {
    // Pick color: more red/orange at the bottom, more yellow at the top
    const color = colors[Math.floor(Math.random() * colors.length)];
    const baseRadius = 18 + Math.random() * 18;
    const flame = new PIXI.Graphics();
    flame.beginFill(color, 0.7 + Math.random() * 0.3);
    flame.drawCircle(0, 0, baseRadius);
    flame.endFill();
    flame.x = app.screen.width / 2 + (Math.random() - 0.5) * 40;
    flame.y = app.screen.height / 2 + 60 + Math.random() * 20;
    sceneContainer.addChild(flame);
    flames.push({ g: flame, baseRadius, color, offset: Math.random() * 1000 });
  }

  // Animate flames
  app.ticker.add(() => {
    for (let i = 0; i < MAX_FLAMES; i++) {
      const { g, baseRadius, color, offset } = flames[i];
      // Flicker radius and alpha
      const flicker =
        Math.sin(performance.now() / 120 + offset) * 3 + Math.random() * 2;
      g.clear();
      g.beginFill(color, 0.5 + Math.random() * 0.5);
      g.drawCircle(0, 0, baseRadius + flicker);
      g.endFill();

      // Move up and jitter horizontally
      g.y -= 1.1 + Math.random() * 0.7;
      g.x += Math.sin(performance.now() / 200 + offset) * 0.5;

      // Reset if out of range, with new color and radius
      if (g.y < app.screen.height / 2 - 40) {
        g.x = app.screen.width / 2 + (Math.random() - 0.5) * 40;
        g.y = app.screen.height / 2 + 60 + Math.random() * 20;
        flames[i].baseRadius = 18 + Math.random() * 18;
        flames[i].color = colors[Math.floor(Math.random() * colors.length)];
      }
    }
  });

  // Back button (unchanged)
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

  app.stage.addChild(sceneContainer);

  return sceneContainer;
}
