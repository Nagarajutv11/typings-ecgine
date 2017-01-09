import { $e } from './Ecgine';
import { RemoteServiceSyncProxy } from './RemoteServiceSyncProxy';
export class EcgineService {

    doLogin(params: any, success: () => void, onFail: (reason: any) => void) {
        $e.$http.post('/org.ecgine.core.server/desktop/login', {}, { params }).then(function (loginresp: any) {
            var userDetails = loginresp.data;
            $e.setUserDetails(userDetails);
            success();
        }, onFail);
    }

    loadExistingUserDetails(success: () => void) {
        var proxy = $e.service("RemoteServiceSyncProxy") as RemoteServiceSyncProxy;
        proxy.sendEcgineRequest("/org.ecgine.webui/u/loaduser", {}, function (data: Object) {
            $e.setUserDetails(data);
            success();
        })
    }
}