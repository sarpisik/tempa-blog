import { useSelectFeedback } from '@hooks';

type UseSelectFeedback = ReturnType<typeof useSelectFeedback>;

export default function useRequestFeedback(
    feedbackType: UseSelectFeedback['type'],
    feedbackSubscriber: UseSelectFeedback['subscriber']
) {
    const { type, subscriber } = useSelectFeedback();
    return type === feedbackType && subscriber === feedbackSubscriber;
}
