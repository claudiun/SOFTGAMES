// src/components/avatar.ts
import * as PIXI from "pixi.js";
import { AvatarData } from "../models/IMagicWords";

export class Avatar {
  static avatarMap: Record<string, AvatarData> = {};

  static setAvatars(avatars: AvatarData[]) {
    Avatar.avatarMap = Object.fromEntries(avatars.map((a) => [a.name, a]));
  }

  static addImage(name: string, size: number = 56): PIXI.Sprite | null {
    const avatar = Avatar.avatarMap[name];
    if (!avatar) return null;
    const sprite = PIXI.Sprite.from(avatar.url);
    sprite.width = size;
    sprite.height = size;
    return sprite;
  }

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

  static getPosition(name: string): "left" | "right" {
    return Avatar.avatarMap[name]?.position || "left";
  }
}
