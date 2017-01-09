import { Callback } from './Models';
import { $e } from './Ecgine';
export class HttpService {

    private static _instance: HttpService;

    constructor() {
        if (HttpService._instance) {
            throw new Error("Error: Do not create another object. This is singleton");
        }
        HttpService._instance = this;
    }

    startRequest() {
        //TODO
    }

    onStartRequest(func: Callback) {
        //TODO
    }

    successRequest() {
        //TODO
    }

    onEndRequest(func: Callback) {
        //TODO
    }

    failRequest(e: any) {
        alert("Request Failed: code=" + e.status)
        if (e.status == 403) {
            let h = window.location.hash;
            if (h) {
                h = h.substring(1);
                $e.$router.push({ path: '/', query: { target: h } })
            } else {
                $e.$router.push('/')
            }
        }
    }
}