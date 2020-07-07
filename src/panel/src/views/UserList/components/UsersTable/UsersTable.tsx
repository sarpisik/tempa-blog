/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { withRouter } from 'react-router';
import { Table, tableIcons, TableProps } from '@components';
import { useFetchAuthors, useDeleteAuthors } from './hooks';
import { RouteComponentProps } from 'react-router-dom';
import { IAuthor } from '@common/entitites';
import { pages } from '@configs';
import { Avatar, makeStyles, Typography } from '@material-ui/core';
import { resolveAvatarUrl } from '@views/shared/helpers';

const AUTHORS_PATH = pages.find((page) => page.title === 'Authors')?.href || '';

const useStyles = makeStyles((theme) => ({
    nameContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    avatar: {
        marginRight: theme.spacing(2),
    },
}));

const AvatarCell: React.FC<{ name: string; url: string }> = ({ name, url }) => {
    const classes = useStyles();
    return (
        <div className={classes.nameContainer}>
            <Avatar className={classes.avatar} src={url}>
                {name}
            </Avatar>
            <Typography variant="body1">{name}</Typography>
        </div>
    );
};

const COLUMNS = [
    {
        title: 'Name',
        field: 'name',
        render(rowData: IAuthor) {
            const url = resolveAvatarUrl(rowData.avatar_url);
            return <AvatarCell name={rowData.name} url={url} />;
        },
    },
    { title: 'ID', field: 'id' },
    { title: 'Email', field: 'email' },
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
            const authorPath = `${AUTHORS_PATH}/${row.id}`;

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
