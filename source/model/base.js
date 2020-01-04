export default class MDBase {
  parse(info: Object) {
    if (!info) return;

    const keysA = Object.keys(this);
    const keysB = Object.keys(info);
    keysB.forEach((key) => {
      const type = typeof info[key];
      if (type === 'function' || type === 'object' || type === 'array') return;
      if (keysA.indexOf(key) !== -1) {
        this[key] = info[key];
      }
    });
  }
}

export function defineProperty(obj, key, getter, setter) {
  Object.defineProperty(obj, key, {
    enumerable: false,
    get: getter,
    set: setter,
  });
}
