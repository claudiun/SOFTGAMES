import * as PIXI from "pixi.js";
import { Button } from "../ui/Button";
import { EVENTS } from "../comm/events";
import { Emitter } from "@pixi/particle-emitter";

export function PhoenixFlame(app: PIXI.Application): PIXI.Container {
  const sceneContainer = new PIXI.Container();

  const emitter = new Emitter(sceneContainer, {
    lifetime: {
      min: 0.1,
      max: 0.75,
    },
    frequency: 0.001,
    emitterLifetime: 0,
    maxParticles: 10,
    addAtBack: false,
    pos: {
      x: app.screen.width / 2,
      y: app.screen.height - 100,
    },
    behaviors: [
      {
        type: "alpha",
        config: {
          alpha: {
            list: [
              {
                time: 0,
                value: 0.62,
              },
              {
                time: 1,
                value: 0,
              },
            ],
          },
        },
      },
      {
        type: "moveSpeed",
        config: {
          speed: {
            list: [
              { value: 150, time: 0 },
              { value: 100, time: 1 },
            ],
            isStepped: false,
          },
          angle: { min: 270, max: 270 },
        },
      },
      {
        type: "scale",
        config: {
          scale: {
            list: [
              {
                time: 0,
                value: 0.5,
              },
              {
                time: 1,
                value: 2.5,
              },
            ],
          },
          minMult: 1,
        },
      },
      {
        type: "color",
        config: {
          color: {
            list: [
              {
                time: 0,
                value: "fff191",
              },
              {
                time: 1,
                value: "ff622c",
              },
            ],
          },
        },
      },
      {
        type: "rotation",
        config: {
          accel: 0,
          minSpeed: 50,
          maxSpeed: 50,
          minStart: 265,
          maxStart: 275,
        },
      },
      {
        type: "textureRandom",
        config: {
          textures: ["/assets/flame.png"],
        },
      },
      {
        type: "spawnShape",
        config: {
          type: "torus",
          data: {
            x: 0,
            y: 0,
            radius: 10,
            innerRadius: 0,
            affectRotation: false,
          },
        },
      },
    ],
  });
  emitter.emit = true;

  let last = performance.now();
  app.ticker.add(() => {
    const now = performance.now();
    emitter.update((now - last) * 0.001);
    last = now;
  });

  const backBtn = new Button({
    label: "Back to Menu",
    onClick: () => {
      app.stage.removeChildren();
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
