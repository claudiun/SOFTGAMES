import { MagicWordsResponse } from "../scenes/interfaces/IMagicWords";
import { MAGICWORDS_URL } from "./constants";

/**
 * Fetches magic words data from the API and invokes the callback with the result.
 * @param callback Function to call with the MagicWordsResponse data or error.
 */
export function fetchMagicWords(callback: (data: MagicWordsResponse) => void) {
  fetch(MAGICWORDS_URL)
    .then((res) => res.json())
    .then((data: MagicWordsResponse) => callback(data))
    .catch((err: any) => {
      console.error("Failed to fetch magic words:", err);
      callback(err);
    });
}
