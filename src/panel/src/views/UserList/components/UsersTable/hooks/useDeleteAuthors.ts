import { useCallback } from 'react';
import { useLoading } from '@hooks';
import { IAuthor } from '@common/entitites';
import { deleteAuthors as dAuthors } from '@app/authorsSlice';

export default function useDeleteAuthors() {
    const [loading, dispatch] = useLoading('DELETE_AUTHORS');
    const deleteAuthors = useCallback(
        function deleteAuthors<T>(_evt: T, authors: IAuthor[]) {
            dispatch(dAuthors(authors));
        },

        // skip dep static dispatch
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return [loading, deleteAuthors] as const;
}
