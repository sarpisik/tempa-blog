import { useLoading } from '@hooks';
import { useEffect } from 'react';
import { getAuthors, selectAuthors } from '@app/authorsSlice';
import { useSelector } from 'react-redux';

export default function useFetchAuthors() {
    const [loading, dispatch] = useLoading('GET_AUTHORS');
    const authors = useSelector(selectAuthors);

    useEffect(function fetchAuthorsOnMounted() {
        dispatch(getAuthors());

        // skip dispatch to run once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [loading, authors] as const;
}
