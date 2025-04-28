import * as PIXI from "pixi.js";
import { Button } from "../ui/Button";
import { EVENTS } from "../comm/events";
import { DialogueLine } from "./components/DialogueLine";
import { MagicWordsResponse } from "./models/IMagicWords";
import { Emoji } from "./components/Emoji";
import { Avatar } from "./components/Avatar";
import { fetchMagicWords } from "../comm/api";

const FONT_SIZE = 12;
const FONT_STYLE = {
  fontFamily: "Arial",
  fontSize: FONT_SIZE,
  fill: 0xffffff,
  fontWeight: "bold" as PIXI.TextStyleFontWeight,
};
const VERTICAL_PADDING = 80; // Used for both top and bottom

export function MagicWords(app: PIXI.Application): PIXI.Container {
  clearStage(app);
  const sceneContainer = createSceneContainer(app);
  const loadingText = showLoading(sceneContainer, app);
  addBackButton(sceneContainer, app);
  const { scrollContainer, maskY, maskHeight } = createScrollContainer(
    sceneContainer,
    app
  );
  let contentHeight = 0; // Will be set after dialogue is rendered
  fetchAndRenderDialogue(
    app,
    sceneContainer,
    scrollContainer,
    loadingText,
    maskY,
    maskHeight,
    (ch: number) => {
      contentHeight = ch;
      setupScrolling(app, scrollContainer, maskY, maskHeight, contentHeight);
      setupTouchScrolling(
        app,
        scrollContainer,
        maskY,
        maskHeight,
        () => contentHeight
      );
    }
  );
  return sceneContainer;
}

function clearStage(app: PIXI.Application) {
  app.stage.removeChildren();
}

function createSceneContainer(app: PIXI.Application) {
  const container = new PIXI.Container();
  container.sortableChildren = true;
  app.stage.addChild(container);
  return container;
}

function showLoading(sceneContainer: PIXI.Container, app: PIXI.Application) {
  const loadingText = new PIXI.Text("Loading...", {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0xffffff,
    fontWeight: "bold",
  });
  loadingText.anchor.set(0.5);
  loadingText.x = app.screen.width / 2;
  loadingText.y = app.screen.height / 2;
  sceneContainer.addChild(loadingText);
  return loadingText;
}

function addBackButton(sceneContainer: PIXI.Container, app: PIXI.Application) {
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
  return backBtn;
}

function createScrollContainer(
  sceneContainer: PIXI.Container,
  app: PIXI.Application
) {
  const scrollContainer = new PIXI.Container();
  sceneContainer.addChild(scrollContainer);
  const maskY = 60;
  const maskHeight = app.screen.height + maskY;
  const mask = new PIXI.Graphics()
    .beginFill(0xffffff)
    .drawRect(0, maskY, app.screen.width, maskHeight)
    .endFill();
  scrollContainer.mask = mask;
  sceneContainer.addChild(mask);
  return { scrollContainer, maskY, maskHeight };
}

function setupScrolling(
  app: PIXI.Application,
  scrollContainer: PIXI.Container,
  maskY: number,
  maskHeight: number,
  contentHeight: number
) {
  (app.view as HTMLCanvasElement).addEventListener("wheel", (e) => {
    const event = e as WheelEvent;
    scrollContainer.y -= event.deltaY;
    clampScroll(scrollContainer, maskY, maskHeight, contentHeight);
  });
}

function clampScroll(
  scrollContainer: PIXI.Container,
  maskY: number,
  maskHeight: number,
  contentHeight: number
) {
  const minY = Math.min(maskY, maskY + maskHeight - contentHeight);
  if (scrollContainer.y > maskY) scrollContainer.y = maskY;
  if (scrollContainer.y < minY) scrollContainer.y = minY;
}

function fetchAndRenderDialogue(
  app: PIXI.Application,
  sceneContainer: PIXI.Container,
  scrollContainer: PIXI.Container,
  loadingText: PIXI.Text,
  maskY: number,
  maskHeight: number,
  onContentReady: (contentHeight: number) => void
) {
  fetchMagicWords((data: MagicWordsResponse) => {
    Emoji.setEmojis(data.emojies);
    Avatar.setAvatars(data.avatars);
    let y = VERTICAL_PADDING; // top padding
    const dialogueWidth = app.screen.width;
    for (const line of data.dialogue) {
      const dialogueLine = new DialogueLine(line, FONT_STYLE, dialogueWidth);
      dialogueLine.y = y;
      scrollContainer.addChild(dialogueLine);
      y += dialogueLine.height + 20;
    }
    // Calculate content height (bottom of last child + bottom padding)
    const lastChild = scrollContainer.children[
      scrollContainer.children.length - 1
    ] as PIXI.DisplayObject;
    const contentBottom = lastChild
      ? lastChild.y + (lastChild as any).height
      : 0;
    const contentHeight = contentBottom + VERTICAL_PADDING * 2; // bottom padding
    sceneContainer.removeChild(loadingText);
    // Start at the top
    setTimeout(() => {
      scrollContainer.y = maskY;
      clampScroll(scrollContainer, maskY, maskHeight, contentHeight);
      onContentReady(contentHeight);
    }, 0);
  });
}

function setupTouchScrolling(
  app: PIXI.Application,
  scrollContainer: PIXI.Container,
  maskY: number,
  maskHeight: number,
  getContentHeight: () => number
) {
  const canvas = app.view as HTMLCanvasElement;
  let touchDragging = false;
  let lastTouchY = 0;
  canvas.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 1) {
        touchDragging = true;
        lastTouchY = e.touches[0].clientY;
      }
      e.preventDefault();
    },
    { passive: false }
  );
  canvas.addEventListener(
    "touchmove",
    (e) => {
      if (touchDragging && e.touches.length === 1) {
        const newY = e.touches[0].clientY;
        const delta = newY - lastTouchY;
        scrollContainer.y += delta;
        lastTouchY = newY;
        clampScroll(scrollContainer, maskY, maskHeight, getContentHeight());
      }
      e.preventDefault();
    },
    { passive: false }
  );
  canvas.addEventListener(
    "touchend",
    (e) => {
      touchDragging = false;
      e.preventDefault();
    },
    { passive: false }
  );
}
