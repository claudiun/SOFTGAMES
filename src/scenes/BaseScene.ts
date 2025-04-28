import * as PIXI from "pixi.js";
import { Button } from "../ui/Button";
import { EVENTS } from "../comm/events";

export class BaseScene extends PIXI.Container {
  protected app: PIXI.Application;

  constructor(app: PIXI.Application) {
    super();
    this.app = app;
    this.setupBackButton();
    this.app.stage.addChild(this);
  }

  protected setupBackButton() {
    const backBtn = new Button({
      label: "Back to Menu",
      onClick: () => {
        this.app.stage.removeChildren();
        this.emit(EVENTS.BACK_TO_MENU);
      },
    });
    backBtn.x = 16;
    backBtn.y = 16;
    backBtn.zIndex = 1000;
    this.addChild(backBtn);
    this.sortChildren();
  }
}
