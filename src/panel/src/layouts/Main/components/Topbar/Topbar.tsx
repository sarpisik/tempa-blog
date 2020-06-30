import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    AppBar,
    Toolbar,
    Badge,
    Hidden,
    IconButton,
    makeStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';

interface TopbarProps extends React.ComponentProps<typeof AppBar> {
    onSidebarOpen: React.ComponentProps<typeof IconButton>['onClick'];
}

const useStyles = makeStyles((theme) => ({
    root: {
        boxShadow: 'none',
    },
    flexGrow: {
        flexGrow: 1,
    },
    signOutButton: {
        marginLeft: theme.spacing(1),
    },
}));

const Topbar: React.FC<TopbarProps> = (props) => {
    const { className, onSidebarOpen, ...rest } = props;

    const classes = useStyles();

    const [notifications] = React.useState([]);

    return (
        <AppBar {...rest} className={clsx(classes.root, className)}>
            <Toolbar>
                <RouterLink to="/">
                    <img alt="Logo" src="/images/logos/logo--white.svg" />
                </RouterLink>
                <div className={classes.flexGrow} />
                <Hidden mdDown>
                    <IconButton color="inherit">
                        <Badge
                            badgeContent={notifications.length}
                            color="primary"
                            variant="dot"
                        >
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton
                        className={classes.signOutButton}
                        color="inherit"
                    >
                        <InputIcon />
                    </IconButton>
                </Hidden>
                <Hidden lgUp>
                    <IconButton color="inherit" onClick={onSidebarOpen}>
                        <MenuIcon />
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
};

Topbar.propTypes = {
    className: PropTypes.string,
    onSidebarOpen: PropTypes.func,
};

export default Topbar;
