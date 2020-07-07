import React from 'react';
import PropTypes from 'prop-types';

import { Card } from '@material-ui/core';

import { deleteAuthor as dAuthor, putAuthor } from '@app/authorsSlice';
import { UploadsApi } from '@api';
import { IAuthor, ImageFormats } from '@common/entitites';

import { useLoading } from '@hooks';
import { useFormik } from 'formik';
import { Form, useDropzone } from './components';

import { AuthorValidationSchema as validationSchema } from '@views/shared';
import { resolveAvatarUrl } from '@views/shared/helpers';

const INPUT_FIELDS = ['name', 'email', 'bio'] as const;

type FormProps = React.ComponentProps<typeof Form>;

interface UserDetailsProps extends React.ComponentProps<typeof Card> {
    author: IAuthor;
}

const UserDetails: React.FC<UserDetailsProps> = (props) => {
    const { author: initialValues } = props;
    const [loading, dispatch] = useLoading('PUT_AUTHOR');
    const [deleteLoading] = useLoading('DELETE_AUTHOR');
    const {
        files,
        open,
        removeFile,
        setFiles,
        setOpen,
        toggleDropzone,
    } = useDropzone();

    const onSubmit = React.useCallback(
        async function onSubmit(state: IAuthor) {
            try {
                // If avatar changed, upload it first
                const avatar = files[0];
                if (avatar) {
                    const data = new FormData();
                    data.append('image', avatar.file);

                    const [response] = await Promise.all([
                        // Upload new avatar
                        UploadsApi.postUpload<ImageFormats>(data),

                        // Delete former avatar
                        UploadsApi.deleteUploads([props.author.avatar_url]),
                    ]);

                    if ('error' in response)
                        throw new Error(
                            response.error || 'Something went wrong'
                        );

                    // Avatar upload success
                    removeFile();
                    state.avatar_url = response;
                }

                dispatch(putAuthor(state));
            } catch (error) {
                alert('Something went wrong.');
                console.error(error);
            }
        },
        // skip deps dispatch,removeFile
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [files, props.author.avatar_url]
    );

    const {
        errors,
        getFieldProps,
        handleSubmit,
        setFieldValue,
        touched,
        values,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    const setAvatarField = React.useCallback(
        function setAvatarField() {
            setFieldValue('avatar_url', files[0].data);
            setOpen(false);
        },
        // skip dep setFieldValue
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [files, setOpen]
    );

    const removeFileOnCancel = React.useCallback(
        function removeFileOnCancel() {
            removeFile();
            setOpen(false);
        },
        // skip deps setOpen, removeFile
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const deleteAuthor = React.useCallback(
        function deleteAuthor() {
            dispatch(dAuthor(props.author));
        },
        // skip dep dispatch
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.author]
    );

    const avatarProps = {
        src: resolveAvatarUrl(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            values.avatar_url.src || values.avatar_url,
            !files[0] // Do not resolve on local image
        ),
        placeholder: initialValues.name,
    };

    const deleteBtnProps = {
        loading: deleteLoading,
        onClick: deleteAuthor,
    };

    const dropzoneProps = {
        fileObjects: files,
        onBtnClick: toggleDropzone(true),
        onAdd: setFiles,
        onDelete: removeFile,
        open: open,
        onClose: removeFileOnCancel,
        onSave: setAvatarField,
    };

    const inputs = INPUT_FIELDS.map(function createInputProps(field) {
        const props: FormProps['inputs'][number] = {
            disabled: !!loading,
            helperText: touched[field] ? errors[field] : '',
            error: Boolean(errors[field]),
            label: field,
            ...getFieldProps(field),
        };

        if (field === 'email') {
            props.type = 'email';
        }
        if (field === 'bio') {
            props.multiline = true;
            props.rows = 4;
            props.rowsMax = 8;
        }

        return props;
    });

    const saveBtnProps = { loading };

    return (
        <Form
            avatarProps={avatarProps}
            deleteBtnProps={deleteBtnProps}
            dropzoneProps={dropzoneProps}
            handleSubmit={handleSubmit}
            inputs={inputs}
            saveBtnProps={saveBtnProps}
        />
    );
};

UserDetails.propTypes = {
    className: PropTypes.string,
};

export default UserDetails;
