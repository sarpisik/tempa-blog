/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'inline-block',
        borderRadius: '50%',
        flexGrow: 0,
        flexShrink: 0,
    },
    sm: {
        height: theme.spacing(1),
        width: theme.spacing(1),
    },
    md: {
        height: theme.spacing(2),
        width: theme.spacing(2),
    },
    lg: {
        height: theme.spacing(3),
        width: theme.spacing(3),
    },
    neutral: {
        //@ts-ignore
        backgroundColor: theme.palette.neutral,
    },
    primary: {
        backgroundColor: theme.palette.primary.main,
    },
    info: {
        backgroundColor: theme.palette.info.main,
    },
    warning: {
        backgroundColor: theme.palette.warning.main,
    },
    danger: {
        backgroundColor: theme.palette.error.main,
    },
    success: {
        backgroundColor: theme.palette.success.main,
    },
}));

interface StatusBulletProps extends React.HTMLAttributes<HTMLSpanElement> {
    size: keyof ReturnType<typeof useStyles>;
    color: keyof ReturnType<typeof useStyles>;
}

const StatusBullet: React.FC<StatusBulletProps> = (props) => {
    const { className, size, color, ...rest } = props;

    const classes = useStyles();

    return (
        <span
            {...rest}
            className={clsx(
                {
                    [classes.root]: true,
                    [classes[size]]: size,
                    [classes[color]]: color,
                },
                className
            )}
        />
    );
};

StatusBullet.propTypes = {
    className: PropTypes.string,
    // @ts-ignore
    color: PropTypes.oneOf([
        'neutral',
        'primary',
        'info',
        'success',
        'warning',
        'danger',
    ]),
    // @ts-ignore
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

StatusBullet.defaultProps = {
    size: 'md',
    // @ts-ignore
    color: 'default',
};

export default StatusBullet;
