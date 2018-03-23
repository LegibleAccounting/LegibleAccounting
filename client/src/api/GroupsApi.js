import { JSONAPIRequest } from './util/Request.js';
import Auth from './Auth.js';

class GroupsApi {
    getAll(active) {
		if (!Auth.token) {
            return Promise.reject();
        }

        // determine if searching active users
        var requestURL = '/api/groups/';
        if (active === true || active === false) {
            requestURL += '?is_active=' + (active ? 'true' : 'false');
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
    }
export default new GroupsApi();
