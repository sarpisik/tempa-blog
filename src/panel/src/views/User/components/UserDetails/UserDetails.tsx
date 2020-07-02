import React from 'react';
import PropTypes from 'prop-types';
import { deleteAuthor as dAuthor, putAuthor } from '@app/authorsSlice';

import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    makeStyles,
    TextField,
} from '@material-ui/core';

import { useFormik } from 'formik';
import { IAuthor } from '@common/entitites';
import { AuthorValidationSchema as validationSchema } from '@views/shared';
import { useLoading } from '@hooks';
import { LoadingButton } from '@components';

const useStyles = makeStyles((theme) => {
    const red = theme.palette.error.main;
    const white = '#ffffff';
    return {
        contained: {
            backgroundColor: red,
            color: white,
            '&:hover': {
                backgroundColor: white,
                color: red,
            },
        },
    };
});

interface UserDetailsProps extends React.ComponentProps<typeof Card> {
    author: IAuthor;
}

const UserDetails: React.FC<UserDetailsProps> = (props) => {
    const { author: initialValues, ...rest } = props;
    const classes = useStyles();
    const [loading, dispatch] = useLoading('PUT_AUTHOR');
    const [deleteLoading] = useLoading('DELETE_AUTHOR');

    const { errors, getFieldProps, handleSubmit, touched } = useFormik({
        initialValues,
        validationSchema,
        onSubmit(state) {
            dispatch(putAuthor(state));
        },
    });

    const deleteAuthor = React.useCallback(
        function deleteAuthor() {
            dispatch(dAuthor(props.author.id));
        },
        // skip dep dispatch
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.author.id]
    );

    return (
        <Card {...rest}>
            <form autoComplete="off" onSubmit={handleSubmit}>
                <CardHeader title="Profile" />
                <Divider />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                disabled={!!loading}
                                helperText={touched.name ? errors.name : ''}
                                error={Boolean(errors.name)}
                                label="Name"
                                margin="dense"
                                variant="outlined"
                                {...getFieldProps('name')}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                disabled={!!loading}
                                helperText={touched.email ? errors.email : ''}
                                error={Boolean(errors.email)}
                                label="Email"
                                type="email"
                                variant="outlined"
                                {...getFieldProps('email')}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                disabled={!!loading}
                                helperText={touched.bio ? errors.bio : ''}
                                error={Boolean(errors.bio)}
                                label="Bio"
                                margin="dense"
                                multiline
                                rows={4}
                                rowsMax={8}
                                variant="outlined"
                                {...getFieldProps('bio')}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                    <LoadingButton
                        color="primary"
                        variant="contained"
                        type="submit"
                        loading={loading}
                    >
                        Save details
                    </LoadingButton>
                    <LoadingButton
                        classes={classes}
                        variant="contained"
                        loading={deleteLoading}
                        onClick={deleteAuthor}
                    >
                        Delete
                    </LoadingButton>
                </CardActions>
            </form>
        </Card>
    );
};

UserDetails.propTypes = {
    className: PropTypes.string,
};

export default UserDetails;
