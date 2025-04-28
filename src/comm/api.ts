import { MagicWordsResponse } from "../scenes/models/IMagicWords";
import { MAGICWORDS_URL } from "./consts";

export function fetchMagicWords(callback: (data: MagicWordsResponse) => void) {
  fetch(MAGICWORDS_URL)
    .then((res) => res.json())
    .then((data: MagicWordsResponse) => callback(data));
}
