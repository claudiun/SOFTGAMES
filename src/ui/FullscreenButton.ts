import * as PIXI from "pixi.js";

export class FullscreenButton extends PIXI.Container {
  private icon: PIXI.Graphics;

  constructor(app: PIXI.Application) {
    super();
    this.icon = this.createIcon();
    this.addChild(this.icon);
    this.eventMode = "static";
    this.cursor = "pointer";
    this.hitArea = new PIXI.Rectangle(0, 0, 32, 32);
    this.zIndex = 1001;
    this.on("pointertap", () => {
      console.log("pointertap");
      const canvas = app.view as HTMLCanvasElement;
      if (!document.fullscreenElement) {
        if (canvas.requestFullscreen) {
          canvas.requestFullscreen();
        } else if ((canvas as any).webkitRequestFullscreen) {
          (canvas as any).webkitRequestFullscreen();
        } else if ((canvas as any).msRequestFullscreen) {
          (canvas as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    });
    // Responsive position
    app.renderer.on("resize", () => {
      this.x = app.screen.width - this.width;
    });
  }

  private createIcon(): PIXI.Graphics {
    const g = new PIXI.Graphics();
    g.lineStyle(3, 0xffffff, 1);
    // Top left
    g.moveTo(2, 10).lineTo(2, 2).lineTo(10, 2);
    // Top right
    g.moveTo(22, 2).lineTo(30, 2).lineTo(30, 10);
    // Bottom right
    g.moveTo(30, 22).lineTo(30, 30).lineTo(22, 30);
    // Bottom left
    g.moveTo(10, 30).lineTo(2, 30).lineTo(2, 22);
    return g;
  }
}
