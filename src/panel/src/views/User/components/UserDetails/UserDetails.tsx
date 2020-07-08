import React from 'react';
import PropTypes from 'prop-types';

import { Card } from '@material-ui/core';

import {
    deleteAuthor as dAuthor,
    putAuthor,
    PrePutAuthor,
} from '@app/authorsSlice';
import { IAuthor } from '@common/entitites';

import { useLoading } from '@hooks';
import { useFormik } from 'formik';
import { Form, useDropzone } from './components';

import { AuthorValidationSchema as validationSchema } from '@views/shared';
import { resolveAvatarUrl } from '@views/shared/helpers';
import { useRequestFeedback } from '@views/shared/hooks';

const INPUT_FIELDS = ['name', 'email', 'bio'] as const;

type FormProps = React.ComponentProps<typeof Form>;

interface UserDetailsProps extends React.ComponentProps<typeof Card> {
    author: IAuthor;
}

const UserDetails: React.FC<UserDetailsProps> = (props) => {
    const { author: initialValues } = props;
    const updateSuccess = useRequestFeedback('SUCCESS', 'PUT_AUTHOR');
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
        function onSubmit(state: IAuthor) {
            const preAuthor: PrePutAuthor = { ...state, avatar: null };
            const image = files[0];

            // Lift the new avatar to reducer If avatar changed.
            if (image) {
                preAuthor.avatar = new FormData();
                preAuthor.avatar.append('image', image.file);

                // avatar_url been overwritten by setAvatarField.
                // So we pass back the original in order to make delete req.
                preAuthor.avatar_url = props.author.avatar_url;
            }

            dispatch(putAuthor(preAuthor));
        },
        // skip dep dispatch
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [files]
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

    React.useEffect(
        function removeCachedImageOnUpdateSuccess() {
            if (updateSuccess) {
                // Remove local cached file
                removeFile();
                // Save uploaded file to local form state
                setFieldValue('avatar_url', props.author.avatar_url);
            }
        },
        // skip deps removeFile, setFieldValue
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.author.avatar_url, updateSuccess]
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
