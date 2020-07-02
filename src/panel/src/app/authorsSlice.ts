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
    deleteAuthors: 'DELETE_AUTHORS',
} as const;

export const authorsSlice = createSlice({
    name: 'authors',
    initialState,
    reducers: {
        getAuthorsSuccess(state, action: PayloadAction<IAuthor[]>) {
            state.entities = action.payload;
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
        deleteAuthorsSuccess(
            state,
            { payload }: PayloadAction<IAuthor['id'][]>
        ) {
            for (let i = 0; i < state.entities.length; i++) {
                const author = state.entities[i];
                const isDelete = payload.includes(author.id);
                if (isDelete) {
                    state.entities.splice(i, 1);
                    // Decrement the index variable so it does not skip the next item in the array.
                    i--;
                }
            }
        },
    },
});

export const {
    getAuthorsSuccess,
    postAuthorSuccess,
    deleteAuthorsSuccess,
} = authorsSlice.actions;

const isError = <T = any>(
    tested: T | { error: string }
): tested is { error: string } => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Boolean(tested?.error);
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

export const deleteAuthors = withCatchError<IAuthor['id'][]>(
    subscribers.deleteAuthors,
    (data) => async (dispatch) => {
        dispatch(setLoading(subscribers.deleteAuthors));

        await AuthorsApi.deleteAuthors(data);

        dispatch(deleteAuthorsSuccess(data));
        dispatch(
            setSuccess({
                message: 'Author(s) delete success.',
                subscriber: subscribers.deleteAuthors,
            })
        );
    }
);

export const selectAuthors = (state: RootState) => state.authors.entities;

export default authorsSlice.reducer;
