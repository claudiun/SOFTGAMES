import * as PIXI from "pixi.js";
import { MagicWordsResponse } from "../scenes/interfaces/IMagicWords";

/**
 * Measures the width of a space character using the given PIXI text style.
 * @param textStyle Partial PIXI.ITextStyle to use for measurement.
 * @returns The width of a space character.
 */
export function measureSpaceWidth(textStyle: Partial<PIXI.ITextStyle>): number {
  const dummyText = new PIXI.Text(" ", {
    ...textStyle,
    wordWrap: false,
  });
  return PIXI.TextMetrics.measureText(" ", dummyText.style).width;
}

/**
 * Checks if the provided data is a valid MagicWordsResponse object.
 * @param data The data to validate.
 * @returns True if valid, false otherwise.
 */
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
