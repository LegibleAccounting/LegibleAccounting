import React, { Component } from 'react';
import './Spinner.css';

class Spinner extends Component {
    render() {
        return (
            <span aria-hidden="true"
              style={{ fontSize: '4rem', animation: 'spin 4s infinite linear' }}
              className="glyphicon glyphicon-refresh">
            </span>
        );
    }
}

export default Spinner;
