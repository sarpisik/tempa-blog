import React from 'react';
import { withRouter } from 'react-router';
import { Table, tableIcons, TableProps } from '@components';
import useFetchAuthors from './hooks/useFetchAuthors';
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
    const [loading, authors] = useFetchAuthors();
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
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    icon: tableIcons.Delete,
                    onClick: (evt, data) =>
                        alert(
                            'You want to delete ' +
                                (data as any[]).length +
                                ' rows'
                        ),
                },
            ]}
        />
    );
};

export default withRouter(UsersTable);
