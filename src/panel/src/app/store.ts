import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import authorsReducer from './authorsSlice';
import feedbackReducer from './feedbackSlice';
import loadingReducer from './loadingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        authors: authorsReducer,
        feedback: feedbackReducer,
        loading: loadingReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
