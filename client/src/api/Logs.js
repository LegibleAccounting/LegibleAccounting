import { JSONAPIRequest } from './util/Request.js';
import Auth from './Auth.js';

class LogsAPI {
    constructor() {}

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

    search(searchString) {
        if (!Auth.token) {
            return Promise.reject();
        }

        return fetch(new JSONAPIRequest('/api/logs/?search=' + searchString, Auth.token), {
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