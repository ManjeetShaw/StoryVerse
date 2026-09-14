async function mapWithConcurrency(items, limit, asyncFn) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex++;

      if (index >= items.length) {
        return;
      }

      try {
        results[index] = await asyncFn(items[index], index);
      } catch (error) {
        results[index] = {
          error: true,
          message: error.message
        };
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    () => worker()
  );

  await Promise.all(workers);

  return results;
}

module.exports = {
  mapWithConcurrency
};