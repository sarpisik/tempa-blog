import React from 'react';
import { makeStyles } from '@material-ui/core';

import { UsersToolbar, UsersTable } from './components';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    content: {
        marginTop: theme.spacing(2),
    },
}));

const UserList = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <UsersToolbar />
            <div className={classes.content}>
                <UsersTable />
            </div>
        </div>
    );
};

export default UserList;
