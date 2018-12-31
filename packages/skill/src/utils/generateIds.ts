const MIN_LENGTH = 2;
const MAX_LENGTH = 6;
const ROUNDS = 5;

export function generateIds(): string[] {
  return new Array(ROUNDS * (MAX_LENGTH - MIN_LENGTH + 1)).fill(0)
    .map((_, i) => Math.floor(i / ROUNDS) + MIN_LENGTH)
    .reduce((ids: string[], length) => {
      let id: string | undefined;
      while (!id || ids.indexOf(id) >= 0) {
        id = randomId(length);
      }
      return ids.concat(id);
    }, []);
}

export function randomId(length: number): string {
  const min = 10 ** (length - 1);
  const max = (10 ** length) - 1;
  const rand = min + Math.random() * (max + 1 - min);
  return String(Math.floor(rand));
}
