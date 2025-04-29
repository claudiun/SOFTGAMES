// src/components/emoji.ts
import * as PIXI from "pixi.js";
import { EmojiData } from "../interfaces/IMagicWords";

/**
 * Utility class for managing and rendering emojis.
 */
export class Emoji {
  /**
   * Map of emoji names to their image URLs.
   */
  static emojiMap: Record<string, string> = {};

  /**
   * Sets the available emojis.
   * @param emojis Array of EmojiData.
   */
  static setEmojis(emojis: EmojiData[]) {
    Emoji.emojiMap = Object.fromEntries(emojis.map((e) => [e.name, e.url]));
  }

  /**
   * Creates a PIXI.Sprite for the emoji image.
   * @param name The emoji's name.
   * @param size The size of the emoji image.
   * @returns The PIXI.Sprite or null if not found.
   */
  static create(name: string, size: number = 24): PIXI.Sprite | null {
    const url = Emoji.emojiMap[name];
    if (!url) return null;
    const sprite = PIXI.Sprite.from(url);
    sprite.width = size;
    sprite.height = size;
    return sprite;
  }
}
