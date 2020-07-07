import React from 'react';
import { Grid, TextField } from '@material-ui/core';

export default function TextInput(
    props: React.ComponentProps<typeof TextField>
) {
    return (
        <Grid key={props.label as string} item xs={12}>
            <TextField fullWidth margin="dense" variant="outlined" {...props} />
        </Grid>
    );
}
