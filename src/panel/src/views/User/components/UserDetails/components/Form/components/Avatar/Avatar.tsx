import React from 'react';
import { Avatar as MaterialAvatar, makeStyles } from '@material-ui/core';

interface AvatarProps extends React.ComponentProps<typeof MaterialAvatar> {
    src: string;
    placeholder: string;
}

const useStyles = makeStyles((theme) => ({
    avatarSize: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        margin: 'auto',
    },
}));

export default function Avatar({ placeholder, ...props }: AvatarProps) {
    const classes = useStyles();

    return (
        <MaterialAvatar className={classes.avatarSize} {...props}>
            {placeholder}
        </MaterialAvatar>
    );
}
