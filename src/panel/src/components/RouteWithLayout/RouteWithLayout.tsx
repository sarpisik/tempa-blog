import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

interface RouteWithLayoutProps extends React.ComponentProps<typeof Route> {
    layout: any;
    component: any;
}

const RouteWithLayout: React.FC<RouteWithLayoutProps> = (props) => {
    const { layout: Layout, component: Component, ...rest } = props;

    return (
        <Route
            {...rest}
            render={(matchProps) => (
                <Layout>
                    <Component {...matchProps} />
                </Layout>
            )}
        />
    );
};

RouteWithLayout.propTypes = {
    component: PropTypes.any.isRequired,
    layout: PropTypes.any.isRequired,
    path: PropTypes.string,
};

export default RouteWithLayout;
