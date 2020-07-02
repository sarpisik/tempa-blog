import React from 'react';
import { CircularProgress } from '@material-ui/core';

type SpinnerProps = React.ComponentProps<typeof CircularProgress>;

const Spinner: React.FC<SpinnerProps> = (props) => (
    <CircularProgress size={20} {...props} />
);

export default Spinner;
