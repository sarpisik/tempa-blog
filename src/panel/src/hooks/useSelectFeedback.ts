import { useSelector } from 'react-redux';
import { selectFeedback } from '@app/feedbackSlice';

export default function useSelectFeedback() {
    const feedback = useSelector(selectFeedback);

    return feedback;
}
