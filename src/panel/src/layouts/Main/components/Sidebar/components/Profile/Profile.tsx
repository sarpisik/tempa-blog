import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    Avatar,
    Typography,
    makeStyles,
    CircularProgress,
    Box,
} from '@material-ui/core';
import { useSelectAuth } from './hooks';

type ProfileProps = React.HTMLAttributes<HTMLDivElement>;

const FALLBACK_AVATAR = '/images/avatars/avatar_11.png';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'fit-content',
    },
    avatar: {
        width: 60,
        height: 60,
    },
    name: {
        marginTop: theme.spacing(1),
    },
}));

const Profile: React.FC<ProfileProps> = (props) => {
    const { className, ...rest } = props;

    const { user, loading } = useSelectAuth();

    const classes = useStyles();

    return (
        <div {...rest} className={clsx(classes.root, className)}>
            <Avatar
                alt="Person"
                className={classes.avatar}
                component={RouterLink}
                src={user?.avatar_url || FALLBACK_AVATAR}
                to="/settings"
            />
            {loading ? (
                <Box marginTop={2}>
                    <CircularProgress size={20} />
                </Box>
            ) : (
                <>
                    <Typography className={classes.name} variant="h4">
                        {user?.name}
                    </Typography>
                    <Typography variant="body2">{user?.description}</Typography>
                </>
            )}
        </div>
    );
};

Profile.propTypes = {
    className: PropTypes.string,
};

export default Profile;
