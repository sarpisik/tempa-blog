import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, makeStyles } from '@material-ui/core';

import { UserDetails } from './components';
import { useSelectAuthor } from './hooks';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4),
    },
}));

const User: React.FC = () => {
    const history = useHistory();
    const { userId } = useParams<{ userId: string }>();
    const author = useSelectAuthor(userId);

    React.useEffect(
        function redirectOnAuthorNotExist() {
            author || history.replace('/authors');
        },
        [author, history]
    );
    const classes = useStyles();

    return author ? (
        <div className={classes.root}>
            <Grid container spacing={4}>
                {/* <Grid item lg={4} md={6} xl={4} xs={12}>
                    <UserProfile />
                </Grid> */}
                <Grid xs={12}>
                    <UserDetails author={author} />
                </Grid>
            </Grid>
        </div>
    ) : null;
};

export default User;
