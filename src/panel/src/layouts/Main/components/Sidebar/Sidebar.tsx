/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Divider, Drawer, makeStyles } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';

import { Profile, SidebarNav } from './components';
import { pages } from '@configs';

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
    variant: React.ComponentProps<typeof Drawer>['variant'];
    open: React.ComponentProps<typeof Drawer>['open'];
    onClose: React.ComponentProps<typeof Drawer>['onClose'];
}

type PageType = typeof pages[number];

const ICONS: Record<PageType['title'], JSX.Element> = {
    Dashboard: <DashboardIcon />,
    Authors: <PeopleIcon />,
};

const PAGES = pages.map((page) => ({ ...page, icon: ICONS[page.title] }));

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: 240,
        [theme.breakpoints.up('lg')]: {
            marginTop: 64,
            height: 'calc(100% - 64px)',
        },
    },
    root: {
        // @ts-ignore
        backgroundColor: theme.palette.white.main,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: theme.spacing(2),
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
    nav: {
        marginBottom: theme.spacing(2),
    },
}));

const Sidebar: React.FC<SideBarProps> = (props) => {
    const { open, variant, onClose, className, ...rest } = props;

    const classes = useStyles();

    return (
        <Drawer
            anchor="left"
            classes={{ paper: classes.drawer }}
            onClose={onClose}
            open={open}
            variant={variant}
        >
            <div {...rest} className={clsx(classes.root, className)}>
                <Profile />
                <Divider className={classes.divider} />
                <SidebarNav className={classes.nav} pages={PAGES} />
            </div>
        </Drawer>
    );
};

Sidebar.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    // @ts-ignore
    variant: PropTypes.string.isRequired,
};

export default Sidebar;
