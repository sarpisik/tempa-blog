import React from 'react';
import {
    makeStyles,
    Card,
    CardHeader,
    Divider,
    CardContent,
    Grid,
    CardActions,
} from '@material-ui/core';
import { LoadingButton } from '@components';
import { Avatar, Dropzone, TextInput } from './components';

type HTMLFormProps = React.FormHTMLAttributes<HTMLFormElement>;

interface FormProps extends Omit<HTMLFormProps, 'onSubmit'> {
    handleSubmit: HTMLFormProps['onSubmit'];
    inputs: React.ComponentProps<typeof TextInput>[];
    avatarProps: React.ComponentProps<typeof Avatar>;
    dropzoneProps: React.ComponentProps<typeof Dropzone>;
    deleteBtnProps: React.ComponentProps<typeof LoadingButton>;
    saveBtnProps: React.ComponentProps<typeof LoadingButton>;
}

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

export default function Form({
    avatarProps,
    deleteBtnProps,
    dropzoneProps,
    handleSubmit,
    inputs,
    saveBtnProps,
}: FormProps) {
    const classes = useStyles();
    return (
        <Card>
            <form autoComplete="off" onSubmit={handleSubmit}>
                <CardHeader title="Profile" />
                <Divider />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            {inputs.map(TextInput)}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Avatar {...avatarProps} />
                            <Dropzone {...dropzoneProps} />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                    <LoadingButton
                        color="primary"
                        variant="contained"
                        type="submit"
                        {...saveBtnProps}
                    >
                        Save details
                    </LoadingButton>
                    <LoadingButton
                        classes={classes}
                        variant="contained"
                        {...deleteBtnProps}
                    >
                        Delete
                    </LoadingButton>
                </CardActions>
            </form>
        </Card>
    );
}
