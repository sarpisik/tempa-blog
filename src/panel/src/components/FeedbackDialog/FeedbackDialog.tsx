import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { selectFeedback, hideFeedback } from '@app/feedbackSlice';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const FeedbackDialog: React.FC = () => {
    const { message, type } = useSelector(selectFeedback);
    const open = Boolean(message) && Boolean(type);
    const dispatch = useDispatch();

    const handleClose = React.useCallback(() => {
        dispatch(hideFeedback());
        // skip dispatch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            onClose={handleClose}
        >
            <Alert
                onClose={handleClose}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                severity={type.toLowerCase()}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

FeedbackDialog.propTypes = {
    children: PropTypes.node,
};

export default FeedbackDialog;
