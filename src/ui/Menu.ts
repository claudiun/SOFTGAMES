import * as PIXI from "pixi.js";
import { Button } from "./Button";

export class Menu extends PIXI.Container {
  constructor(app: PIXI.Application, onSelect: (task: string) => void) {
    super();
    const scenes = [
      { name: "Ace of Shadows", key: "aceofshadow" },
      { name: "Magic Words", key: "magicwords" },
      { name: "Phoenix Flame", key: "phoenixflame" },
    ];

    const buttonWidth = 300;
    const buttonHeight = 60;
    const gap = 30;
    const startY =
      app.screen.height / 2 - ((buttonHeight + gap) * scenes.length - gap) / 2;

    scenes.forEach((scene, i) => {
      const btn = new Button({
        label: scene.name,
        width: buttonWidth,
        height: buttonHeight,
        fontSize: 28,
        backgroundColor: 0x333333,
        onClick: () => onSelect(scene.key),
      });
      btn.x = app.screen.width / 2 - buttonWidth / 2;
      btn.y = startY + i * (buttonHeight + gap);
      this.addChild(btn);
    });
  }
}
