import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { SUBSCRIBERS } from './shared/constants';

export type LoadingFor = typeof SUBSCRIBERS[number];

interface State {
    subscriber: LoadingFor;
}

const initialState: State = {
    subscriber: '',
};

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<State['subscriber']>) {
            state.subscriber = action.payload;
        },
    },
});

export const { setLoading } = loadingSlice.actions;

export const hideLoading = (dispatch: any) => () => {
    dispatch(setLoading(''));
};

export const selectLoading = (state: RootState) => state.loading.subscriber;

export default loadingSlice.reducer;
