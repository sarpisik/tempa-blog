import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, LoadingFor } from '@app/loadingSlice';

export default function useLoading(loadingFor: LoadingFor) {
    const dispatch = useDispatch();
    const state = useSelector(selectLoading);

    return [state === loadingFor, dispatch] as const;
}
