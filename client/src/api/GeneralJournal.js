import { JSONAPIRequest } from './util/Request.js';
import Auth from './Auth.js';

class GeneralJournalAPI {
	getAll(posted) {
		if (!Auth.token) {
            return Promise.reject();
        }

        var postedEnum = {
        	PENDING: 0,
        	REJECTED: 1,
        	POSTED: 2
        };

        // determine if searching posted entries
        var requestURL = '/api/journals/';
        if (posted === postedEnum.PENDING || posted === postedEnum.REJECTED || posted === postedEnum.POSTED) {
            requestURL += '?status=' + (posted ? 'pending' : 'rejected' : 'posted');
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

    getOne(id) {
        if (!Auth.token) {
            return Promise.reject();
        }

        return fetch(new JSONAPIRequest(`/api/journals/${id}/`, Auth.token), {
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

    search(posted, searchString) {
    	if (!Auth.token) {
            return Promise.reject();
        }

		// determine if searching posted entries
        var requestURL = '/api/journals/';
        if (posted) {
        	requestURL += '?status=true&search=';
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

    create(data) {
        if (!Auth.token) {
            return Promise.reject();
        }

        return fetch(new JSONAPIRequest('/api/journals/', Auth.token), {
            method: 'POST',
            body: JSON.stringify(data)
        })
          .then(response => response.ok ? Promise.resolve(response) : Promise.reject(response))
          .then(response => response = response.json())
          .then((response) => {
            return Promise.resolve(response);
          })
          .catch((response) => {
            return Promise.reject(response);
          });
    }

    update(data) {
        if (!Auth.token) {
            return Promise.reject();
        }

        return fetch(new JSONAPIRequest(`/api/journals/${data.id}/`, Auth.token), {
            method: 'PUT',
            body: JSON.stringify(data)
        })
          .then(response => response.ok ? Promise.resolve(response) : Promise.reject(response))
          .then(response => response = response.json())
          .then((response) => {
            return Promise.resolve(response);
          })
          .catch((response) => {
            return Promise.reject(response);
          });
    }
}


export default new GeneralJournalAPI();