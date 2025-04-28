import { log } from "./log";

export async function fetchMagicWords() {
  const response = await fetch(
    "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords"
  );
  const data = await response.json();
  log(data);
  return data;
}
