/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { withRouter } from 'react-router';
import { Table, tableIcons, TableProps } from '@components';
import { useFetchAuthors, useDeleteAuthors } from './hooks';
import { RouteComponentProps } from 'react-router-dom';
import { IAuthor } from '@common/entitites';

const COLUMNS = [
    { title: 'ID', field: 'id' },
    { title: 'Email', field: 'email' },
    { title: 'Name', field: 'name' },
    { title: 'Avatar', field: 'avatar_url' },
    { title: 'Bio', field: 'bio' },
    { title: 'Created At', field: 'created_at' },
];

const UsersTable: React.FC<RouteComponentProps> = ({ history }) => {
    const [fetchLoading, authors] = useFetchAuthors();
    const [deleteLoading, deleteAuthors] = useDeleteAuthors();
    const loading = fetchLoading || deleteLoading;
    const tableData: typeof authors = React.useMemo(
        function memoizeAuthors() {
            // Material-table needs to mutate passed data.
            // So we deserialize data came from redux store.
            return JSON.parse(JSON.stringify(authors));
        },
        [authors]
    );

    const navigateToAuthor: TableProps<
        IAuthor
    >['onRowClick'] = React.useCallback(
        (evt, row) => {
            const authorPath = `/users/${row.id}`;
            history.push(authorPath);
        },
        [history]
    );

    return (
        <Table
            columns={COLUMNS}
            isLoading={loading}
            data={tableData}
            onRowClick={navigateToAuthor}
            options={{
                selection: true,
                showTitle: false,
            }}
            actions={[
                {
                    tooltip: 'Remove All Selected Users',
                    // @ts-ignore
                    icon: tableIcons.Delete,
                    // @ts-ignore
                    onClick: deleteAuthors,
                },
            ]}
        />
    );
};

export default withRouter(UsersTable);
