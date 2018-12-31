export function firstPromise<T>(promises: Promise<T>[], predicate: (_: T) => boolean): Promise<T> {
  return new Promise((resolve, reject) => {
    let waitPromisesCount = promises.length;
    let resolved = false;
    promises.map(promise => promise
      .then(res => {
        if (predicate(res) && !resolved) {
          resolved = true;
          resolve(res);
        }
      })
      .catch(() => undefined)
      .then(() => {
        if (--waitPromisesCount === 0 && !resolved) {
          reject();
        }
      }));
  });
}
