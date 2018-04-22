import { JSONAPIRequest } from './util/Request.js';
import Auth from './Auth.js';

class LogsAPI {
    getAll() {
		if (!Auth.token) {
            return Promise.reject();
        }

        return fetch(new JSONAPIRequest('/api/logs/', Auth.token), {
            method: 'GET'
        })
            .then(response => response.ok ? Promise.resolve(response) : Promise.reject(response))
            .then(response => response.json())
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((response) => {
                // Consider how to handle this?
                return Promise.reject(response);
            });
    }

    search(searchString, fieldNames, isAscending) {
        if (!Auth.token) {
            return Promise.reject();
        }

        var requestURL = '/api/logs/';
        let parts = [];

        // determine if doing a text based search
        if (searchString) {
            parts.push('search=' + searchString);
        }

        // determine if there are any sorting requirements
        if (Array.isArray(fieldNames)) {
            if (isAscending) {
                fieldNames = fieldNames.map(fieldName => '-' + fieldName);
            }

            parts.push('ordering=' + fieldNames.join(','));
        }

        // actually search
        requestURL += '?' + parts.join('&');
        return fetch(new JSONAPIRequest(requestURL, Auth.token), {
            method: 'GET'
        })
            .then(response => response.ok ? Promise.resolve(response) : Promise.reject(response))
            .then(response => response.json())
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((response) => {
                // Consider how to handle this?
                return Promise.reject(response);
            });
    }
}

export default new LogsAPI();
