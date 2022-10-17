import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api';
import uiReducer from './uiSlice';


// Configuration
const middlewares = [api.middleware];
if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
})
store.dispatch(api.util.prefetch('getMembers', undefined, {force: true}))


// Hooks
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


// ?
setupListeners(store.dispatch)
