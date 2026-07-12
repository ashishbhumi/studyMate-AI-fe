import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
