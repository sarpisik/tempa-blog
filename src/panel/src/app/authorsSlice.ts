import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthor, PreAuthor } from '@common/entitites';
import { AuthorsApi } from '@api';

import { asyncFailed, asyncStart } from './shared/reducers';
import { AsyncState } from './shared/types';
import { AppThunk, RootState } from './store';

interface State extends AsyncState {
    authors: IAuthor[];
}

const initialState: State = {
    authors: [],
    loading: false,
    error: null,
};

export const authorsSlice = createSlice({
    name: 'authors',
    initialState,
    reducers: {
        asyncStart,
        asyncFailed,
        getAuthorsSuccess(state, action: PayloadAction<State['authors']>) {
            state.loading = false;
            state.error = null;
            state.authors = action.payload;
        },
        postAuthorSuccess(state, action: PayloadAction<IAuthor>) {
            state.loading = false;
            state.error = null;
            state.authors.push(action.payload);
        },
        putAuthorSuccess(state, { payload }: PayloadAction<IAuthor>) {
            const authorIndex = state.authors.findIndex(
                (a) => a.id === payload.id
            );
            state.authors[authorIndex] = payload;
            state.loading = false;
            state.error = null;
        },
    },
});

export const { getAuthorsSuccess, postAuthorSuccess } = authorsSlice.actions;

export const postAuthor = (data: PreAuthor): AppThunk => async (dispatch) => {
    try {
        dispatch(authorsSlice.actions.asyncStart());

        const author = await AuthorsApi.postAuthor(data);

        dispatch(postAuthorSuccess(author));
    } catch (error) {
        dispatch(
            authorsSlice.actions.asyncFailed(
                error.message || 'Something went wrong.'
            )
        );
    }
};

export const selectAuthors = (state: RootState) => state.authors;

export default authorsSlice.reducer;
