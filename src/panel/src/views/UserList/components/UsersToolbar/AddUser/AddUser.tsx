import React from 'react';
import { TextField } from '@material-ui/core';
import { AuthorValidationSchema as validationSchema } from '@views/shared';
import { useFormik } from 'formik';
import { postAuthor } from '@app/authorsSlice';

import { useLoading } from '@hooks';
import { FormDialog } from '@components';
import useCloseFormDialog from './useCloseFormDialog';
import { PreAuthor } from '@common/entitites';

const initialValues: PreAuthor = { email: '', name: '', bio: '' };

const AddUser: React.FC = () => {
    const [loading, dispatch] = useLoading('POST_AUTHOR');
    const closeFormDialog = useCloseFormDialog('POST_AUTHOR');
    const {
        errors,
        getFieldProps,
        handleSubmit,
        touched,
        resetForm,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit(state) {
            dispatch(postAuthor(state));
        },
    });

    React.useEffect(
        function resetFormOnSuccess() {
            closeFormDialog && resetForm();
        },
        [closeFormDialog, resetForm]
    );

    return (
        <FormDialog
            onSubmit={handleSubmit}
            buttonContent="Add user"
            dialogTitle="New User"
            loading={loading}
            close={closeFormDialog}
        >
            <TextField
                disabled={!!loading}
                helperText={touched.name ? errors.name : ''}
                error={Boolean(errors.name)}
                margin="dense"
                fullWidth
                label="Name"
                {...getFieldProps('name')}
            />
            <TextField
                disabled={!!loading}
                helperText={touched.email ? errors.email : ''}
                error={Boolean(errors.email)}
                margin="dense"
                fullWidth
                label="Email"
                type="email"
                {...getFieldProps('email')}
            />
            <TextField
                disabled={!!loading}
                helperText={touched.bio ? errors.bio : ''}
                error={Boolean(errors.bio)}
                margin="dense"
                fullWidth
                label="Bio"
                multiline
                rows={4}
                rowsMax={8}
                {...getFieldProps('bio')}
            />
        </FormDialog>
    );
};

export default AddUser;
