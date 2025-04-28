import * as PIXI from "pixi.js";
import { Avatar } from "./Avatar";
import { Emoji } from "./Emoji";
import { DialogueLineData } from "../models/IMagicWords";
import { measureSpaceWidth } from "../../comm/utils";

const PADDING = 16;

export class DialogueLine extends PIXI.Container {
  constructor(
    data: DialogueLineData,
    textStyle: Partial<PIXI.ITextStyle>,
    parentWidth: number
  ) {
    super();
    const position = Avatar.getPosition(data.name);
    const avatarSize = 40;
    const avatarContainer = Avatar.create(data.name, avatarSize);
    if (!avatarContainer) return;

    // Get avatar image height for vertical alignment
    const avatarImage = avatarContainer.children[0] as PIXI.Sprite;
    const avatarHeight = avatarImage ? avatarImage.height : avatarSize;
    const textFontSize = Number(textStyle.fontSize) || 16;
    const textY = (avatarHeight - textFontSize) / 2;

    // Create text container first to measure its width
    const textContainer = this.createTextWithEmojis(
      data.text,
      textStyle,
      parentWidth - avatarContainer.width - PADDING * 2,
      0,
      textY
    );

    // Calculate total width
    const totalLineWidth = textContainer.width + avatarContainer.width + 8;

    if (position === "right") {
      // Text on left, avatar on right, align to right with padding
      textContainer.x = 0;
      avatarContainer.x = textContainer.width + 8;
      avatarContainer.y = 0;
      this.addChild(textContainer);
      this.addChild(avatarContainer);
      this.x = parentWidth - totalLineWidth - PADDING;
    } else {
      // Avatar on left, text on right, align to left with padding
      avatarContainer.x = 0;
      avatarContainer.y = 0;
      textContainer.x = avatarContainer.width + 8;
      this.addChild(avatarContainer);
      this.addChild(textContainer);
      this.x = PADDING;
    }
  }

  private createTextWithEmojis(
    text: string,
    textStyle: Partial<PIXI.ITextStyle>,
    maxWidth: number,
    x: number,
    y: number
  ): PIXI.Container {
    const container = new PIXI.Container();
    const fontSize = textStyle.fontSize || 16;
    const emojiRegex = /{([^}]+)}/g;
    const emojiPlaceholders: { index: number; name: string; width: number }[] =
      [];
    let plainText = "";
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // First pass: build plainText with placeholders and record emoji info
    while ((match = emojiRegex.exec(text))) {
      plainText += text.substring(lastIndex, match.index) + "\uFFFC";
      // We'll determine width later
      emojiPlaceholders.push({
        index: plainText.length - 1,
        name: match[1],
        width: 0,
      });
      lastIndex = emojiRegex.lastIndex;
    }
    plainText += text.substring(lastIndex);

    // Create a dummy text object to measure space width
    const spaceWidth = measureSpaceWidth(textStyle);

    // Determine emoji widths and how many spaces are needed for each
    for (const placeholder of emojiPlaceholders) {
      const emojiSprite = Emoji.create(placeholder.name, Number(fontSize));
      if (emojiSprite) {
        placeholder.width = emojiSprite.width;
      } else {
        placeholder.width = spaceWidth; // fallback
      }
    }

    // Replace each placeholder with enough spaces to match the emoji width
    let adjustedText = plainText;
    let offset = 0;
    for (const placeholder of emojiPlaceholders) {
      const numSpaces = Math.max(1, Math.ceil(placeholder.width / spaceWidth));
      const spaces = " ".repeat(numSpaces);
      const idx = placeholder.index + offset;
      adjustedText =
        adjustedText.substring(0, idx) +
        spaces +
        adjustedText.substring(idx + 1);
      offset += spaces.length - 1;
      placeholder.index = idx; // update to new index in adjustedText
    }

    // Render the text with spaces
    const txtObj = new PIXI.Text(adjustedText, {
      ...textStyle,
      wordWrap: true,
      wordWrapWidth: maxWidth,
    });
    txtObj.x = x;
    txtObj.y = y;
    container.addChild(txtObj);

    // Use TextMetrics to find emoji positions
    const lines = txtObj.text.split("\n");
    let charCount = 0;
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      let emojiOffset = 0;
      for (let i = 0; i < line.length; i++) {
        const globalCharIndex = charCount + i;
        const placeholder = emojiPlaceholders.find(
          (e) => e.index === globalCharIndex
        );
        if (placeholder) {
          // Measure up to this character
          const subText = line.substring(0, i);
          const metrics = PIXI.TextMetrics.measureText(subText, txtObj.style);
          const emojiSprite = Emoji.create(placeholder.name, Number(fontSize));
          if (emojiSprite) {
            const lineHeight =
              Number(txtObj.style.lineHeight) || Number(fontSize) * 1.2;
            // Add a space before the emoji
            emojiSprite.x = x + metrics.width + emojiOffset + spaceWidth;
            emojiSprite.y = y + lineIndex * lineHeight;
            container.addChild(emojiSprite);
            emojiOffset += emojiSprite.width + spaceWidth;
          }
        }
      }
      charCount += line.length + 1; // +1 for the newline
    }

    return container;
  }
}
