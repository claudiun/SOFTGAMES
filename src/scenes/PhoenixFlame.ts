import * as PIXI from "pixi.js";
import { BaseScene } from "../core/BaseScene";
import { Emitter } from "@pixi/particle-emitter";
import { FLAME_EMMITTER_CONFIG } from "../common/config";

/**
 * Scene for rendering the Phoenix Flame particle effect using PIXI and @pixi/particle-emitter.
 * Extends BaseScene for integration with the app lifecycle.
 */
export class PhoenixFlame extends BaseScene {
  private emitter: Emitter;
  private last: number = performance.now();

  /**
   * Creates a new PhoenixFlame scene and initializes the particle emitter.
   * @param app The PIXI.Application instance.
   */
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

  /**
   * Updates the particle emitter each frame.
   * Called automatically by the PIXI ticker.
   */
  private update() {
    const now = performance.now();
    this.emitter.update((now - this.last) * 0.001);
    this.last = now;
  }

  /**
   * Cleans up the emitter and destroys the scene.
   * @param options Optional destroy options.
   */
  public destroy(options?: boolean | PIXI.IDestroyOptions) {
    this.emitter.destroy();
    super.destroy(options);
  }
}
