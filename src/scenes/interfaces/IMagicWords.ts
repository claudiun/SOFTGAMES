export interface AvatarData {
  name: string;
  url: string;
  position: "left" | "right";
}

export interface EmojiData {
  name: string;
  url: string;
}

export interface DialogueLineData {
  name: string;
  text: string;
}

export interface MagicWordsResponse {
  dialogue: DialogueLineData[];
  emojies: EmojiData[];
  avatars: AvatarData[];
}
