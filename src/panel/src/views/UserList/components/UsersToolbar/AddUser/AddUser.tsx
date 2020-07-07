import React from 'react';
import { TextField } from '@material-ui/core';
import { AuthorValidationSchema as validationSchema } from '@views/shared';
import { useFormik } from 'formik';
import { postAuthor } from '@app/authorsSlice';

import { useLoading } from '@hooks';
import { FormDialog } from '@components';
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone';
import useCloseFormDialog from './useCloseFormDialog';
import { PreAuthor } from '@common/entitites';
import { UploadsApi } from '@api';

const initialValues: PreAuthor = {
    email: '',
    name: '',
    bio: '',
    avatar_url: '',
};

const AddUser: React.FC = () => {
    const [loading, dispatch] = useLoading('POST_AUTHOR');
    const closeFormDialog = useCloseFormDialog('POST_AUTHOR');
    const [files, setFiles] = React.useState<FileObject[]>([]);
    const removeFile = React.useCallback(function removeField<File>(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _file?: File
    ) {
        setFiles([]);
    }, []);
    const onSubmit = React.useCallback(
        async function onSubmit(state: PreAuthor) {
            try {
                // Upload avatar first
                const data = new FormData();
                data.append('image', files[0].file);
                const response = await UploadsApi.postUpload<{
                    url: string;
                }>(data);

                if ('error' in response)
                    throw new Error(response.error || 'Something went wrong');

                // Avatar upload success
                removeFile();
                state.avatar_url = response.url;
                dispatch(postAuthor(state));
            } catch (error) {
                alert('Something went wrong.');
                console.error(error);
            }
        },
        // skip dep dispatch
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [files]
    );
    const {
        errors,
        getFieldProps,
        handleSubmit,
        touched,
        resetForm,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
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
            formDisabled={loading || files.length < 1}
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
            <DropzoneAreaBase
                filesLimit={1}
                fileObjects={files}
                acceptedFiles={['image/*']}
                dropzoneText="Drag and drop an image here or click"
                onAdd={setFiles}
                onDelete={removeFile}
                onAlert={(message, variant) =>
                    console.log(`${variant}: ${message}`)
                }
                previewGridProps={{ item: { xs: 8 } }}
                showPreviews
                showPreviewsInDropzone={false}
            />
            {}
        </FormDialog>
    );
};

export default AddUser;
