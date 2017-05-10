import invariant from 'invariant';

export default (rejectionsMap, defaultHandler) => {
  invariant(rejectionsMap, 'Rejections map should be provided');

  invariant(isOnlyFunctionValues(rejectionsMap), 'rejectionsMap values should be functions');

  invariant(isFunctionOrUndefined(defaultHandler), 'Default handler should be a function, null or undefined');

  return rej => {
    if (rejectionsMap[rej.type]) {
      return rejectionsMap[rej.type](rej)
    }
    if (defaultHandler) return defaultHandler(rej);
    return Promise.reject(rej);
  }
};

const isOnlyFunctionValues = map => {
  return !Object.keys(map).find(k => !isFunction(map[k]));
};

const isFunctionOrUndefined = val =>
      val === undefined || val === null || isFunction(val);

const isFunction = val => typeof val === 'function';
