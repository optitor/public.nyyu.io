import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const NODE_CLIENT_ENV = 'dev';

const composeEnhancers = NODE_CLIENT_ENV === 'production' ? compose : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const storeMiddleware = composeEnhancers(applyMiddleware(thunk));
const store = createStore(rootReducer, storeMiddleware);

export default store;