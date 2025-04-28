import { MagicWordsResponse } from "../scenes/interfaces/IMagicWords";
import { MAGICWORDS_URL } from "./constants";

export function fetchMagicWords(callback: (data: MagicWordsResponse) => void) {
  fetch(MAGICWORDS_URL)
    .then((res) => res.json())
    .then((data: MagicWordsResponse) => callback(data))
    .catch((err: any) => {
      console.error("Failed to fetch magic words:", err);
      callback(err);
    });
}
