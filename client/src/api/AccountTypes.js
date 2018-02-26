import { JSONAPIRequest } from './util/Request.js';
import Auth from './Auth.js';

class AccountTypesAPI {
    constructor() {}
    getAll() {
    	return fetch(new JSONAPIRequest('/api/account-types/', Auth.token), {
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
        });;
    }
}

export default new AccountTypesAPI();
