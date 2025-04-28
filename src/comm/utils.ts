import * as PIXI from "pixi.js";

export function measureSpaceWidth(textStyle: Partial<PIXI.ITextStyle>): number {
  const dummyText = new PIXI.Text(" ", {
    ...textStyle,
    wordWrap: false,
  });
  return PIXI.TextMetrics.measureText(" ", dummyText.style).width;
}
