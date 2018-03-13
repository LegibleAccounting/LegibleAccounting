import Cookies from 'js-cookie';
import { CSRF_COOKIE_NAME } from './constants/Constants.js';
import { JSONAPIRequest } from './util/Request.js';

class Auth {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.token = Cookies.get(CSRF_COOKIE_NAME);
    }

    authenticate(username, password) {
        return fetch(new JSONAPIRequest('/auth/login/', this.token), {
            method: 'POST',
            body: JSON.stringify({
              username,
              password
            })
        })
          .then(response => response.ok ? Promise.resolve(response) : Promise.reject(response))
          .then(response => response = response.json())
          .then((response) => {
            this.isAuthenticated = true;
            this.currentUser = response;
            this.token = Cookies.get(CSRF_COOKIE_NAME);
            return Promise.resolve(response);
          })
          .catch((response) => {
            return Promise.reject(response);
          });
    }

    deAuthenticate() {
        return fetch(new JSONAPIRequest('/auth/logout/', this.token), {
            method: 'POST'
        })
            .then(response => response.ok ? Promise.resolve(response) : Promise.reject(response))
            .then((response) => {
                this.isAuthenticated = false;
                this.currentUser = null;
                return Promise.resolve(response);
            })
            .catch((response) => {
                // Consider how to handle this
                return Promise.reject(response);
            });
    }

    get() {
        if (!this.token) {
            return Promise.reject();
        }

        return fetch(new JSONAPIRequest('/auth/current/', this.token), {
            method: 'GET'
        })
            .then(response => response.ok ? Promise.resolve(response) : Promise.reject(response))
            .then(response => response.json())
            .then((response) => {
                this.isAuthenticated = true;
                this.currentUser = response;
                return Promise.resolve(response);
            })
            .catch((response) => {
                // Consider how to handle this?
                return Promise.reject(response);
            });
    }
}

export default new Auth();
