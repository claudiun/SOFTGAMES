import * as PIXI from "pixi.js";
import { MagicWordsResponse } from "../scenes/interfaces/IMagicWords";

export function measureSpaceWidth(textStyle: Partial<PIXI.ITextStyle>): number {
  const dummyText = new PIXI.Text(" ", {
    ...textStyle,
    wordWrap: false,
  });
  return PIXI.TextMetrics.measureText(" ", dummyText.style).width;
}

export function isValidMagicWordsResponse(
  data: any
): data is MagicWordsResponse {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.dialogue) &&
    Array.isArray(data.emojies) &&
    Array.isArray(data.avatars)
  );
}
