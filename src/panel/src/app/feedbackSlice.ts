import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from './store';
import { hideLoading } from './loadingSlice';
import { SUBSCRIBERS } from './shared/constants';

export type FeedbackFor = typeof SUBSCRIBERS[number];

interface State {
    message: string | '';
    type: 'ERROR' | 'SUCCESS' | '';
    subscriber: FeedbackFor;
}

const initialState: State = {
    message: '',
    type: '',
    subscriber: '',
};

export const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        setError(
            state,
            action: PayloadAction<{
                message: State['message'];
                subscriber: State['subscriber'];
            }>
        ) {
            state.message = action.payload.message;
            state.subscriber = action.payload.subscriber;
            state.type = 'ERROR';
        },
        setSuccess(
            state,
            action: PayloadAction<{
                message: State['message'];
                subscriber: State['subscriber'];
            }>
        ) {
            state.message = action.payload.message;
            state.subscriber = action.payload.subscriber;
            state.type = 'SUCCESS';
        },
        hideFeedback(state) {
            state.message = '';
            state.type = '';
            state.subscriber = '';
        },
    },
});

export const { setError, setSuccess, hideFeedback } = feedbackSlice.actions;

export const selectFeedback = (state: RootState) => state.feedback;

export const withCatchError = <Data>(
    subscriber: FeedbackFor,
    wrapperReducer: (data: Data) => AppThunk<Promise<unknown>>
) => (data?: Data): AppThunk => (dispatch) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wrapperReducer(data)(dispatch)
        .catch((error) => {
            dispatch(
                setError({
                    message: error.message || 'Something went wrong.',
                    subscriber,
                })
            );
        })
        .finally(hideLoading(dispatch));

export default feedbackSlice.reducer;
