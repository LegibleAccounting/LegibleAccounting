import React from 'react';
import ReactDOM from 'react-dom';
import 'core-js/fn/array/find';
import promiseFinallyPolyfill from 'promise.prototype.finally';
import cssVariablesPonyfill from 'css-vars-ponyfill'; // It's not a typo

import 'bootstrap/dist/css/bootstrap.css';
import 'react-datetime/css/react-datetime.css';
import 'toastr/build/toastr.css';
import 'animate.css/animate.css';
import './index.css';

import Auth from './api/Auth';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

promiseFinallyPolyfill.shim();
cssVariablesPonyfill();

Auth.get()
    .finally(() => {
        ReactDOM.render(<App />, document.getElementById('root'));
        registerServiceWorker();
    });

