import { FeedbackFor } from '@app/feedbackSlice';
import { useSelectFeedback } from '@hooks';

export default function useCloseFormDialog(dialogFor: FeedbackFor) {
    const { type, subscriber } = useSelectFeedback();
    const isClose = type === 'SUCCESS' && subscriber === dialogFor;

    return isClose;
}
