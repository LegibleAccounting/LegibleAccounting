import React from 'react';
import ReactDOM from 'react-dom';
import promiseFinallyPolyfill from 'promise.prototype.finally';
import './index.css';

import Auth from './api/Auth';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

promiseFinallyPolyfill.shim();

Auth.get()
    .finally(() => {
        ReactDOM.render(<App />, document.getElementById('root'));
        registerServiceWorker();
    });

