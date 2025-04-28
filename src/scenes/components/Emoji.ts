// src/components/emoji.ts
import * as PIXI from "pixi.js";
import { EmojiData } from "../models/IMagicWords";

export class Emoji {
  static emojiMap: Record<string, string> = {};

  static setEmojis(emojis: EmojiData[]) {
    Emoji.emojiMap = Object.fromEntries(emojis.map((e) => [e.name, e.url]));
  }

  static create(name: string, size: number = 24): PIXI.Sprite | null {
    const url = Emoji.emojiMap[name];
    if (!url) return null;
    const sprite = PIXI.Sprite.from(url);
    sprite.width = size;
    sprite.height = size;
    return sprite;
  }
}
