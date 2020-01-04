import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { persistStore/* , persistCombineReducers */ } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import reducers from '@redux/reducer';
import thunk from 'redux-thunk';
import { setStore } from './storevar';

// const config = {
//   key: 'primary',
//   storage,
// };
// const reducer = persistCombineReducers(config, reducers);
const reducer = combineReducers(reducers);

function warn(error) {
  throw error; // To let the caller handle the rejection
}

const promise = () => next => action => (
  typeof action.then === 'function'
    ? Promise.resolve(action).then(next, warn)
    : next(action)
);

export function configureStore(onCompletion:()=>void):any {
  const enhancer = compose(applyMiddleware(thunk, promise));
  const store = createStore(reducer, enhancer);

  setStore(store);
  persistStore(store, null, onCompletion);

  return store;
}
