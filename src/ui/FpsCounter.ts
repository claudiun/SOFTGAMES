import * as PIXI from "pixi.js";

/**
 * Displays the current FPS as a PIXI.Text object in the canvas.
 */
export class FpsCounter extends PIXI.Text {
  private lastTime = performance.now();
  private frames = 0;
  private fps = 0;

  /**
   * Creates a new FPS counter and adds it to the stage.
   * @param app The PIXI.Application instance.
   */
  constructor(app: PIXI.Application) {
    super("0", {
      fontFamily: "monospace",
      fontSize: 16,
      fill: 0xffffff,
      fontWeight: "bold",
      align: "center",
      stroke: "#222",
      strokeThickness: 3,
    });
    this.anchor.set(0, 0);
    this.x = 0;
    this.y = 0;
    this.zIndex = 1000;
    app.stage.addChild(this);
    app.ticker.add(this.update, this);
  }

  /**
   * Updates the FPS counter every frame.
   */
  private update() {
    this.frames++;
    const now = performance.now();
    if (now - this.lastTime >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastTime = now;
      this.text = `${this.fps}`;
    }
    // Keep centered on resize
    if (this.parent) {
      const app = (this.parent as any).app || (this.parent as any)._app;
      if (app && app.screen) {
        this.x = app.screen.width / 2;
      }
    }
  }

  /**
   * Removes the FPS counter from the stage and destroys the text object.
   * @param options Optional destroy options.
   */
  destroy(options?: boolean | PIXI.IDestroyOptions) {
    this.parent?.removeChild(this);
    super.destroy(options);
  }
}
