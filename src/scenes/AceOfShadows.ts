import * as PIXI from "pixi.js";
import { Card } from "./components/Card";
import { BaseScene } from "../core/BaseScene";

const CARD_COUNT = 144;
const CARD_WIDTH = 60;
const CARD_HEIGHT = 90;
const CARD_OFFSET = 4;
const STACK_GAP = 180;

type StackPosition = { x: number; y: number };

export class AceOfShadows extends BaseScene {
  protected app: PIXI.Application;

  constructor(app: PIXI.Application) {
    super(app);
    this.app = app;
    const { stacks, stackPositions } = setupStacksAndPositions(app);
    createCards(stacks, stackPositions, this, app);
    this.sortChildren();
    startAnimationLoop(app, stacks, stackPositions, this);
  }
}

function setupStacksAndPositions(app: PIXI.Application): {
  stacks: Card[][];
  stackPositions: StackPosition[];
} {
  const STACK_Y = app.screen.height - CARD_HEIGHT;
  const STACK_X_START = app.screen.width / 2 - (CARD_WIDTH + STACK_GAP) / 2;
  const stacks: Card[][] = [[], []];
  const stackPositions: StackPosition[] = [
    { x: STACK_X_START, y: STACK_Y },
    { x: STACK_X_START + STACK_GAP, y: STACK_Y },
  ];
  return { stacks, stackPositions };
}

function createCards(
  stacks: Card[][],
  stackPositions: StackPosition[],
  sceneContainer: PIXI.Container,
  app: PIXI.Application
) {
  for (let i = 0; i < CARD_COUNT; i++) {
    const card = new Card({
      id: i + 1,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      x: stackPositions[0].x,
      y: stackPositions[0].y - i * CARD_OFFSET,
      zIndex: i,
    });
    sceneContainer.addChild(card);
    stacks[0].push(card);
  }
}

function updateAllZIndexes(stacks: Card[][]) {
  // Left stack: zIndex 0 ... stacks[1].length-1
  for (let i = 0; i < stacks[1].length; i++) {
    stacks[1][i].zIndex = i;
  }
  // Right stack: zIndex starts after left stack
  const offset = stacks[1].length;
  for (let i = 0; i < stacks[0].length; i++) {
    stacks[0][i].zIndex = offset + i;
  }
}

function startAnimationLoop(
  app: PIXI.Application,
  stacks: Card[][],
  stackPositions: StackPosition[],
  sceneContainer: PIXI.Container
) {
  let cardsInTransit = 0;
  const interval = setInterval(() => {
    if (stacks[0].length === 0) {
      clearInterval(interval);
      return;
    }
    const topCard = stacks[0].pop();
    if (topCard) {
      const newIndex = stacks[1].length + cardsInTransit;
      const targetX = stackPositions[1].x;
      const targetY = stackPositions[1].y - newIndex * CARD_OFFSET;
      cardsInTransit++;
      updateAllZIndexes(stacks);
      topCard.animateTo({
        app,
        x: targetX,
        y: targetY,
        zIndex: newIndex,
        duration: 2,
        onComplete: () => {
          stacks[1].push(topCard);
          cardsInTransit--;
          updateAllZIndexes(stacks);
          sceneContainer.sortChildren();
        },
      });
    }
  }, 1000);
}
