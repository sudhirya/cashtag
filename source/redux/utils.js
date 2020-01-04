import { bindActionCreators } from 'redux';
import { getStore } from '@app/storevar';
import _ from 'lodash';
// const shallowEqualAddon = require('fbjs/lib/shallowEqual');

function getState() {
  return getStore().getState();
}

function dispatch(state) {
  return getStore().dispatch(state);
}

function handleDispatch(state, params) {
  if (params && params.length && params.length > 0) {
    const lastParam = params[params.length - 1];
    if (lastParam && lastParam.props && lastParam.dispatcher) {
      lastParam.dispatcher(state);
      return;
    }
  }
  getStore().dispatch(state);
}

function shallowEqual(a, b, maxdepth = 10, depth = 0) {
  if (depth >= (maxdepth || 10)) return true;

  const aIsNull = a === null || a === undefined;
  const bIsNull = b === null || b === undefined;

  if (aIsNull !== bIsNull) return false;
  if (aIsNull === true) return true;

  const aTypeof = typeof a;
  const bTypeof = typeof b;
  if (aTypeof !== bTypeof) return false;

  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  if (aIsArray !== bIsArray) return false;

  if (aIsArray) {
    const l = a.length;
    if (l !== b.length) return false;

    for (let i = 0; i < l; i += 1) {
      if (shallowEqual(a[i], b[i], maxdepth, depth + 1) === false) return false;
    }
    return true;
  } else if (aTypeof === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    const hasOwn = Object.prototype.hasOwnProperty;

    if (keysA.length !== keysB.length) return false;
    for (let i = 0; i < keysA.length; i += 1) {
      const keyA = keysA[i];

      if (!hasOwn.call(b, keyA)) return false;
      if (shallowEqual(a[keyA], b[keyA], maxdepth, depth + 1) === false) return false;
    }
    return true;
  } else if (aTypeof === 'function') {
    return true;
  }

  return a === b;
}

function createTypes(base, path, types) {
  const res = {};
  _.each(types, (type) => {
    if (type.length) {
      res[`${base}_${type}`] = `${path}.${type.toLowerCase()}`;
    } else {
      res[`${base}`] = `${path}`;
    }
  });
  return res;
}

export {
  getStore,
  getState,
  dispatch,
  handleDispatch,
  shallowEqual,
  bindActionCreators,
  bindActionCreators as createActions,
  createTypes,
};