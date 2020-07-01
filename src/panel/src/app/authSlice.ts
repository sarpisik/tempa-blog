import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthor } from '@common/entitites';
import { AppThunk, RootState } from './store';

interface State {
    user: IAuthor | null;
    loading: boolean;
    error: string | null;
}

const initialState: State = {
    user: null,
    loading: false,
    error: null,
};

export const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        getAuthStart(state) {
            state.loading = true;
            state.error = null;
        },
        getAuthSuccess(state, action: PayloadAction<IAuthor>) {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.loading = false;
            state.error = null;
            state.user = action.payload;
        },
        getAuthFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    getAuthStart,
    getAuthSuccess,
    getAuthFailure,
} = userSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const fetchAuth = (user: IAuthor): AppThunk => (dispatch) => {
    dispatch(getAuthStart());
    setTimeout(() => {
        dispatch(getAuthSuccess(user));
    }, 1000);
};

// The function below is called a selector and allows us to select a user from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.user)`
export const selectAuth = (state: RootState) => state.auth;

export default userSlice.reducer;
