import { ASSETS } from "./consts";

export const FLAME_EMMITTER_CONFIG = {
  lifetime: {
    min: 0.1,
    max: 0.75,
  },
  frequency: 0.001,
  emitterLifetime: 0,
  maxParticles: 10,
  addAtBack: false,
  pos: {
    x: 0,
    y: 0,
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
        textures: [ASSETS.FLAME],
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
};
