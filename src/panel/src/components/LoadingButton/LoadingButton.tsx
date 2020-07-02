import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { Spinner } from '@components';

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
    loading: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    children,
    loading,
    ...btnProps
}) => {
    return (
        <Button disabled={loading} {...btnProps}>
            {loading ? <Spinner /> : children}
        </Button>
    );
};

LoadingButton.propTypes = {
    children: PropTypes.node,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    loading: PropTypes.bool,
};

export default LoadingButton;
