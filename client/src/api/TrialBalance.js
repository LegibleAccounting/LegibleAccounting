import { JSONAPIRequest } from './util/Request.js';
import Auth from './Auth.js';

class TrialBalanceAPI {
    
    getTrialBalance() {
        return fetch(new JSONAPIRequest('/api/accounts/trial_balance/', Auth.token), {
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
}

export default new TrialBalanceAPI();