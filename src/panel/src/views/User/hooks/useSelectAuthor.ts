import { selectAuthors } from '@app/authorsSlice';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IAuthor } from '@common/entitites';

export default function useSelectAuthor(authId: IAuthor['id']) {
    const authors = useSelector(selectAuthors);

    return useMemo(
        function memoizeFoundAuthor() {
            return authors.find((author) => author.id === authId);
        },
        [authId, authors]
    );
}
