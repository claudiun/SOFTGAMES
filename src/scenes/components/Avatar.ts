// src/components/avatar.ts
import * as PIXI from "pixi.js";
import { AvatarData } from "../interfaces/IMagicWords";

/**
 * Utility class for managing and rendering avatars.
 */
export class Avatar {
  /**
   * Map of avatar names to their data.
   */
  static avatarMap: Record<string, AvatarData> = {};

  /**
   * Sets the available avatars.
   * @param avatars Array of AvatarData.
   */
  static setAvatars(avatars: AvatarData[]) {
    Avatar.avatarMap = Object.fromEntries(avatars.map((a) => [a.name, a]));
  }

  /**
   * Creates a PIXI.Sprite for the avatar image.
   * @param name The avatar's name.
   * @param size The size of the avatar image.
   * @returns The PIXI.Sprite or null if not found.
   */
  static addImage(name: string, size: number = 56): PIXI.Sprite | null {
    const avatar = Avatar.avatarMap[name];
    if (!avatar) return null;
    const sprite = PIXI.Sprite.from(avatar.url);
    sprite.width = size;
    sprite.height = size;
    return sprite;
  }

  /**
   * Creates a PIXI.Text for the avatar name.
   * @param name The avatar's name.
   * @param size The size for the text.
   * @returns The PIXI.Text or null if not found.
   */
  static addName(name: string, size: number = 56): PIXI.Text | null {
    const avatar = Avatar.avatarMap[name];
    if (!avatar) return null;
    const nameText = new PIXI.Text(name, {
      fontFamily: "Arial",
      fontSize: size / 3,
      fill: 0x00ff66,
      fontWeight: "bold",
    });
    return nameText;
  }

  /**
   * Creates a container with the avatar image and name.
   * @param name The avatar's name.
   * @param size The size for the avatar.
   * @returns The PIXI.Container or null if not found.
   */
  static create(name: string, size: number = 56): PIXI.Container | null {
    const avatar = Avatar.avatarMap[name];
    if (!avatar) return null;
    const container = new PIXI.Container();
    const sprite = Avatar.addImage(name, size);
    const nameText = Avatar.addName(name, size);
    if (!sprite || !nameText) return null;
    container.addChild(sprite);
    // Name below the image, centered
    nameText.x = (sprite.width - nameText.width) / 2;
    nameText.y = sprite.height + 4;
    container.addChild(nameText);
    return container;
  }

  /**
   * Gets the position ('left' or 'right') for the avatar.
   * @param name The avatar's name.
   * @returns 'left' or 'right'.
   */
  static getPosition(name: string): "left" | "right" {
    return Avatar.avatarMap[name]?.position || "left";
  }
}
