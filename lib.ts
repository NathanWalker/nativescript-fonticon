export const mapCss = (data: any, debug?: boolean): object => {
  const map = {}
  let sets = data.split('}');
  let cleanValue = (val) => {
    let v = val.replace(/content:\s*"\\f([^"]+)"/, '\\uf$1').trim();
    return v;
  };

  for (let set of sets) {
    let pair = set.split(/:before\s*{/);
    let keyGroups = pair[0];
    let keys = keyGroups.split(',');
    if (pair[1]) {
      let value = cleanValue(pair[1]);
      for (let key of keys) {
        key = key.trim().slice(1).split(':before')[0];
        map[key] = String.fromCharCode(parseInt(value.substring(2), 16));
        if (debug) {
          console.log(`${key}: ${value}`);
        }
      }
    }
  }
  return map
}
