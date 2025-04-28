import * as PIXI from "pixi.js";

export interface IAnimateTo {
  app: PIXI.Application;
  x: number;
  y: number;
  zIndex?: number;
  duration?: number;
  onComplete?: () => void;
}

export interface ICard {
  id: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  zIndex?: number;
}
