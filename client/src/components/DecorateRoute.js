import React, { Component } from 'react';
import './DecorateRoute.css';

const DecorateRoute = (WrappedComponent, extraProps) => {
    return class extends Component {
        render() {
            let props = Object.assign({}, this.props, extraProps);
            return (
                <div className="full-height">
                    <WrappedComponent {...props} />
                </div>
            );
        }
    };
};

export default DecorateRoute;
