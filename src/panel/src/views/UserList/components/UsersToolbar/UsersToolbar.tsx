import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { SearchInput } from '@components';
import AddUser from './AddUser/AddUser';

type UsersToolbarProps = React.HTMLAttributes<HTMLDivElement>;

const useStyles = makeStyles((theme) => ({
    root: {},
    row: {
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1),
    },
    spacer: {
        flexGrow: 1,
    },
    searchInput: {
        marginRight: theme.spacing(1),
    },
}));

const UsersToolbar: React.FC<UsersToolbarProps> = (props) => {
    const { className, ...rest } = props;

    const classes = useStyles();

    return (
        <div {...rest} className={clsx(classes.root, className)}>
            <div className={classes.row}>
                <span className={classes.spacer} />
                <AddUser />
            </div>
            <div className={classes.row}>
                <SearchInput
                    className={classes.searchInput}
                    placeholder="Search user"
                    onChange={null}
                    style={null}
                />
            </div>
        </div>
    );
};

UsersToolbar.propTypes = {
    className: PropTypes.string,
};

export default UsersToolbar;