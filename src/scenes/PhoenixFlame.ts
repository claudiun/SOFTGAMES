import * as PIXI from "pixi.js";
import { BaseScene } from "../core/BaseScene";
import { Emitter } from "@pixi/particle-emitter";
import { FLAME_EMMITTER_CONFIG } from "../common/config";

export class PhoenixFlame extends BaseScene {
  private emitter: Emitter;
  private last: number = performance.now();

  constructor(app: PIXI.Application) {
    super(app);

    // Clone config and set position at runtime
    const config = {
      ...FLAME_EMMITTER_CONFIG,
      pos: {
        x: app.screen.width / 2,
        y: app.screen.height - 100,
      },
    };

    this.emitter = new Emitter(this, config);
    this.emitter.emit = true;

    // Add ticker for emitter update
    app.ticker.add(this.update, this);
  }

  private update() {
    const now = performance.now();
    this.emitter.update((now - this.last) * 0.001);
    this.last = now;
  }

  // Optionally, add cleanup logic
  public destroy(options?: boolean | PIXI.IDestroyOptions) {
    this.emitter.destroy();
    super.destroy(options);
  }
}
