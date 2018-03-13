import { JSONAPIRequest } from './util/Request.js';
import Auth from './Auth.js';

class GeneralJournalAPI {
    getEntryTypeOptions() {
        if (!Auth.token) {
            return Promise.reject();
        }

        return fetch(new JSONAPIRequest('/api/journal-entries', Auth.token), {
            method: 'OPTIONS'
        })
            .then(response => response.ok ? Promise.resolve(response) : Promise.reject(response))
            .then(response => response.json())
            .then(response => {
                return Promise.resolve(response.actions.POST.entry_type.choices);
            })
            .catch(response => {
                // Consider how to handle this?
                return Promise.reject(response);
            });
    }

	getAll(posted) {
		if (!Auth.token) {
            return Promise.reject();
        }

        // determine if searching posted entries
        var requestURL = '/api/journal-entries/';
        if (posted === false || posted === true) {
            requestURL += '?is_approved=' + (posted ? 'rejected' : 'posted');
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

        return fetch(new JSONAPIRequest(`/api/journal-entries/${id}/`, Auth.token), {
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
        var requestURL = '/api/journal-entries/';
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

        return fetch(new JSONAPIRequest('/api/journal-entries/', Auth.token), {
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

        return fetch(new JSONAPIRequest(`/api/journal-entries/${data.id}/`, Auth.token), {
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
