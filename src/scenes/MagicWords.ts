import * as PIXI from "pixi.js";
import { BaseScene } from "../core/BaseScene";
import { DialogueLine } from "./components/DialogueLine";
import { MagicWordsResponse } from "./interfaces/IMagicWords";
import { Emoji } from "./components/Emoji";
import { Avatar } from "./components/Avatar";
import { fetchMagicWords } from "../common/api";
import { isValidMagicWordsResponse } from "../common/utils";

const FONT_SIZE = 12;
const FONT_STYLE = {
  fontFamily: "Arial",
  fontSize: FONT_SIZE,
  fill: 0xffffff,
  fontWeight: "bold" as PIXI.TextStyleFontWeight,
};
const VERTICAL_PADDING = 60; // Used for both top and bottom

/**
 * MagicWords scene: displays a scrollable dialogue with avatars and emojis.
 * Fetches data from the API and renders it in a PixiJS container.
 */
export class MagicWords extends BaseScene {
  /**
   * Constructs the MagicWords scene, sets up loading, scrolling, and fetches dialogue data.
   * @param app The PIXI.Application instance
   */
  constructor(app: PIXI.Application) {
    super(app);
    const loadingText = showLoading(this, app);
    const { scrollContainer, maskY, maskHeight } = createScrollContainer(
      this,
      app
    );
    fetchAndRenderDialogue(
      app,
      this,
      scrollContainer,
      loadingText,
      maskY,
      maskHeight,
      (ch: number) => {
        setupScrolling(app, scrollContainer, maskY, maskHeight, ch);
        setupTouchScrolling(app, scrollContainer, maskY, maskHeight, () => ch);
      }
    );
  }
}

/**
 * Shows a loading text in the center of the scene.
 * @param sceneContainer The container to add the loading text to
 * @param app The PIXI.Application instance
 * @returns The PIXI.Text object for loading
 */
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

/**
 * Creates a scrollable container with a mask for dialogue lines.
 * @param sceneContainer The parent container
 * @param app The PIXI.Application instance
 * @returns An object with scrollContainer, maskY, and maskHeight
 */
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

/**
 * Sets up mouse wheel scrolling for the dialogue container.
 * @param app The PIXI.Application instance
 * @param scrollContainer The container to scroll
 * @param maskY The top Y of the mask
 * @param maskHeight The height of the mask
 * @param contentHeight The total content height
 */
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

/**
 * Fetches dialogue data and renders it in the scroll container. Handles error display.
 * @param app The PIXI.Application instance
 * @param sceneContainer The parent container
 * @param scrollContainer The container for dialogue lines
 * @param loadingText The loading text to remove
 * @param maskY The top Y of the mask
 * @param maskHeight The height of the mask
 * @param onContentReady Callback when content is ready
 */
function fetchAndRenderDialogue(
  app: PIXI.Application,
  sceneContainer: PIXI.Container,
  scrollContainer: PIXI.Container,
  loadingText: PIXI.Text,
  maskY: number,
  maskHeight: number,
  onContentReady: (contentHeight: number) => void
) {
  fetchMagicWords((data: MagicWordsResponse | any) => {
    if (!isValidMagicWordsResponse(data)) {
      const errorText = new PIXI.Text("Failed to get data", {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xff4444,
        fontWeight: "bold",
      });
      errorText.anchor.set(0.5);
      errorText.x = app.screen.width / 2;
      errorText.y = app.screen.height / 2;
      sceneContainer.removeChild(loadingText);
      sceneContainer.addChild(errorText);
      return;
    }
    Emoji.setEmojis(data.emojies);
    Avatar.setAvatars(data.avatars);
    let yPos = VERTICAL_PADDING; // top padding
    const dialogueWidth = app.screen.width;
    for (const line of data.dialogue) {
      const dialogueLine = new DialogueLine(line, FONT_STYLE, dialogueWidth);
      dialogueLine.y = yPos - 60;
      scrollContainer.addChild(dialogueLine);
      yPos += dialogueLine.height + 20;
    }
    // Calculate content height (bottom of last child + bottom padding)
    const lastChild = scrollContainer.children[
      scrollContainer.children.length - 1
    ] as PIXI.DisplayObject;
    const contentBottom = lastChild
      ? lastChild.y + (lastChild as any).height
      : 0;
    const contentHeight = contentBottom + VERTICAL_PADDING * 3; // bottom padding
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
