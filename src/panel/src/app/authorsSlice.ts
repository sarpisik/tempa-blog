import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthor, PreAuthor } from '@common/entitites';
import { AuthorsApi } from '@api';

import { RootState } from './store';
import { withCatchError, setSuccess } from './feedbackSlice';
import { setLoading } from './loadingSlice';

interface State {
    entities: IAuthor[];
}

const initialState: State = { entities: [] };

const subscribers = {
    getAuthor: 'GET_AUTHORS',
    postAuthor: 'POST_AUTHOR',
} as const;

export const authorsSlice = createSlice({
    name: 'authors',
    initialState,
    reducers: {
        getAuthorsSuccess(state, action: PayloadAction<IAuthor[]>) {
            state.entities = action.payload;
            // action.payload.forEach((author) => state.push(author));
        },
        postAuthorSuccess(state, action: PayloadAction<IAuthor>) {
            state.entities.push(action.payload);
        },
        putAuthorSuccess(state, { payload }: PayloadAction<IAuthor>) {
            const authorIndex = state.entities.findIndex(
                (a) => a.id === payload.id
            );
            state.entities[authorIndex] = payload;
        },
    },
});

export const { getAuthorsSuccess, postAuthorSuccess } = authorsSlice.actions;

const isError = <T = any>(
    tested: T | { error: string }
): tested is { error: string } => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Boolean(tested.error);
};

export const getAuthors = withCatchError<PreAuthor>(
    subscribers.getAuthor,
    () => async (dispatch) => {
        dispatch(setLoading(subscribers.getAuthor));

        const response = await AuthorsApi.getAuthors();

        if (isError(response)) throw new Error(response.error);
        dispatch(getAuthorsSuccess(response));
    }
);

export const postAuthor = withCatchError<PreAuthor>(
    subscribers.postAuthor,
    (data) => async (dispatch) => {
        dispatch(setLoading(subscribers.postAuthor));

        const response = await AuthorsApi.postAuthor(data);

        if (isError(response)) throw new Error(response.error);

        dispatch(postAuthorSuccess(response));
        dispatch(
            setSuccess({
                message: 'Author create success.',
                subscriber: subscribers.postAuthor,
            })
        );
    }
);

export const selectAuthors = (state: RootState) => state.authors.entities;

export default authorsSlice.reducer;
