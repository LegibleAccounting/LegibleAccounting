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
            .then(response => {
                return response.json()
                    .catch(() => {
                        return Promise.reject(response);
                    })
                    .then(data => {
                        return response.ok ? Promise.resolve(data.actions.POST.entry_type.choices) : Promise.reject(data);
                    });
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
            .then(response => {
                return response.json()
                    .catch(() => {
                        return Promise.reject(response);
                    })
                    .then(data => {
                        return response.ok ? Promise.resolve(data) : Promise.reject(data);
                    });
            });
    }

    getOne(id) {
        if (!Auth.token) {
            return Promise.reject();
        }

        return fetch(new JSONAPIRequest(`/api/journal-entries/${id}/`, Auth.token), {
            method: 'GET'
        })
            .then(response => {
                return response.json()
                    .catch(() => {
                        return Promise.reject(response);
                    })
                    .then(data => {
                        return response.ok ? Promise.resolve(data) : Promise.reject(data);
                    });
            });
    }

    search(approved, searchString) {
    	if (!Auth.token) {
            return Promise.reject();
        }

        var requestURL = '/api/journal-entries/';
        let parts = [];

        // determine if searching approved entries
        if (approved === true) {
            parts.push('is_approved=2');
        } else if (approved === false) {
            parts.push('is_approved=3');
        }

        // determine if doing a text based search
        if (searchString) {
            parts.push('search=' + searchString);
        }

        // actually search
        requestURL += '?' + parts.join('&');

        return fetch(new JSONAPIRequest(requestURL, Auth.token), {
            method: 'GET'
        })
            .then(response => {
                return response.json()
                    .catch(() => {
                        return Promise.reject(response);
                    })
                    .then(data => {
                        return response.ok ? Promise.resolve(data) : Promise.reject(data);
                    });
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
            .then(response => {
                return response.json()
                    .catch(() => {
                        return Promise.reject(response);
                    })
                    .then(data => {
                        return response.ok ? Promise.resolve(data) : Promise.reject(data);
                    });
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
            .then(response => {
                return response.json()
                    .catch(() => {
                        return Promise.reject(response);
                    })
                    .then(data => {
                        return response.ok ? Promise.resolve(data) : Promise.reject(data);
                    });
            });
    }
}


export default new GeneralJournalAPI();
