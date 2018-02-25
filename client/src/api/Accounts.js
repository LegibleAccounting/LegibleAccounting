import { JSONAPIRequest } from './util/Request.js';
import Auth from './Auth.js';

class AccountsAPI {
    constructor() {}

    getAll(active) {
		if (!Auth.token) {
            return Promise.reject();
        }

        // determine if searching active accounts
        var requestURL = '/api/accounts/';
        if (active) {
        	requestURL += '?is_active=true';
        }

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

    search(active, searchString) {
    	if (!Auth.token) {
            return Promise.reject();
        }

		// determine if searching active accounts
        var requestURL = '/api/accounts/';
        if (active) {
        	requestURL += '?is_active=true&search=';
        } else {
        	requestURL += '?search=';
        }

        // actually search
        requestURL += searchString;

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

export default new AccountsAPI();
