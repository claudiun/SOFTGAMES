import * as PIXI from "pixi.js";
import { Card } from "./components/Card";
import { Button } from "../ui/Button";
import { EVENTS } from "../comm/events";

// --- Constants ---
const CARD_COUNT = 144;
const CARD_WIDTH = 60;
const CARD_HEIGHT = 90;
const CARD_OFFSET = 4;
const STACK_GAP = 180;

type StackPosition = { x: number; y: number };

export function AceOfShadows(app: PIXI.Application): PIXI.Container {
  removePreviousChildren(app);
  const sceneContainer = createSceneContainer(app);
  const { stacks, stackPositions } = setupStacksAndPositions(app);
  createCards(stacks, stackPositions, sceneContainer);
  sceneContainer.sortChildren();
  startAnimationLoop(app, stacks, stackPositions, sceneContainer);
  addBackButton(app, sceneContainer);
  return sceneContainer;
}

function removePreviousChildren(app: PIXI.Application) {
  app.stage.removeChildren();
}

function createSceneContainer(app: PIXI.Application): PIXI.Container {
  const sceneContainer = new PIXI.Container();
  sceneContainer.sortableChildren = true;
  app.stage.addChild(sceneContainer);
  return sceneContainer;
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
  sceneContainer: PIXI.Container
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

function addBackButton(app: PIXI.Application, sceneContainer: PIXI.Container) {
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
}
