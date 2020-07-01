import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import authorsReducer from './authorsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        authors: authorsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
