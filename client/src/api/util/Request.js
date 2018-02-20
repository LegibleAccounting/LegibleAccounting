import { CSRF_HEADER_NAME } from '../constants/Constants.js';

class JSONAPIRequest {
    constructor(url, token) {
        return new Request(url, {
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                [CSRF_HEADER_NAME]: token
            }
        });
    }
}

export { JSONAPIRequest };
