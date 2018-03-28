import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';

import './SortWidget.css';

class SortWidget extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span className="sort-widget">
                <Glyphicon
                  glyph={ !this.props.state || this.props.state === 'asc' ? "chevron-up" : 'chevron-down' }
                  className={!this.props.state ? 'sorter sorter-inactive' : 'sorter'}
                  onClick={this.props.onClick} />
                { this.props.state }
            </span>
        );
    }
}

export default SortWidget;
