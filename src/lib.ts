export const mapCss = (data: any, debug?: boolean): object => {
  const map = {};
  const sets = data.split('}');

  for (const set of sets) {
    const pair = set.split(/:before\s*{/);
    const keyGroups = pair[0];
    const keys = keyGroups.split(',');
    if (pair[1]) {
      const value = cleanValue(pair[1]);
      if (!value) {
        continue;
      }
      for (let key of keys) {
        key = key.trim().slice(1).split(':before')[0];
        map[key] = String.fromCharCode(parseInt(value.substring(2), 16));
        if (debug) {
          console.log(`${key}: ${value}`);
        }
      }
    }
  }
  return map;
};

export const cleanValue = (val: string): string | void => {
  const matches = val.match(/content\s*:\s*["|']\\f([^"|^']+)["|']/i)
  if (matches) {
    return `\\uf${matches[1]}`;
  }
  return void 0;
};
