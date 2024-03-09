import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger'; // Add redux-logger
import rootReducer from './reducers';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        process.env.NODE_ENV !== 'production'
            ? getDefaultMiddleware().concat(logger)
            : getDefaultMiddleware(),

});

export default store;