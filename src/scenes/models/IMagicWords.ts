export type AvatarData = {
  name: string;
  url: string;
  position: "left" | "right";
};

export type EmojiData = {
  name: string;
  url: string;
};

export type DialogueLineData = {
  name: string;
  text: string;
};

export interface MagicWordsResponse {
  dialogue: DialogueLineData[];
  emojies: EmojiData[];
  avatars: AvatarData[];
}
