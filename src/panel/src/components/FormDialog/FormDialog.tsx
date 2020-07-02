/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import Spinner from '../Spinner';

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
    loading: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    children,
    loading,
    ...btnProps
}) => {
    return (
        <Button type="submit" color="primary" disabled={loading} {...btnProps}>
            {loading ? <Spinner /> : children}
        </Button>
    );
};

LoadingButton.propTypes = {
    children: PropTypes.node,
    //@ts-ignore
    loading: PropTypes.bool,
};

interface FormDialogProps {
    buttonContent: React.ReactNode;
    dialogTitle: React.ReactNode;
    loading: boolean;
    onSubmit: any;
    close: boolean;
}

const FormDialog: React.FC<FormDialogProps> = ({
    buttonContent,
    dialogTitle,
    loading,
    onSubmit,
    children,
    close,
}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(
        function closeFormDialogByProp() {
            close && setOpen(false);
        },
        [close]
    );

    return (
        <>
            <Button
                color="primary"
                variant="contained"
                onClick={handleClickOpen}
            >
                {buttonContent}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
                <form onSubmit={onSubmit}>
                    <DialogContent>{children}</DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                        <LoadingButton loading={loading}>Save</LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

FormDialog.propTypes = {
    buttonContent: PropTypes.node,
    dialogTitle: PropTypes.node,
    // @ts-ignore
    loading: PropTypes.bool,
    // @ts-ignore
    close: PropTypes.bool,
    onSubmit: PropTypes.func,
    children: PropTypes.node,
};

export default FormDialog;
