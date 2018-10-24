/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import * as io from 'socket.io-client';
import * as i0 from "@angular/core";
import * as i1 from "@angular/http";
export class RttamaplibService {
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
        this.mapReady = false;
        this.showNav = true;
        this.host = null;
        this.socket = null;
        this.socketURL = null;
        this.host = "https://zld04090.vci.att.com:8443/RAPTOR/";
        this.socketURL = "https://zld04090.vci.att.com:3007";
    }
    /**
     * @param {?} userName
     * @return {?}
     */
    checkUserHasPermission(userName) {
        /** @type {?} */
        var usersListUrl = this.host + "authuser";
        return this.http.post(usersListUrl, userName).toPromise().then((res) => {
            return res.json();
        });
    }
    /**
     * @param {?} attUID
     * @return {?}
     */
    getMapPushPinData(attUID) {
        /** @type {?} */
        var supervisorId = [];
        supervisorId = attUID.split(',');
        /** @type {?} */
        var usersListUrl = this.host + 'TechDetailFetch';
        return this.http.post(usersListUrl, {
            "attuId": "",
            "supervisorId": supervisorId
        }).toPromise().then((res) => {
            return res.json();
        });
    }
    /**
     * @param {?} lat
     * @param {?} long
     * @param {?} distance
     * @param {?} supervisorId
     * @return {?}
     */
    findTruckNearBy(lat, long, distance, supervisorId) {
        /** @type {?} */
        var supervisorIds = [];
        supervisorIds = supervisorId.split(',');
        /** @type {?} */
        const findTruckURL = this.host + 'FindTruckNearBy';
        return this.http.post(findTruckURL, {
            'lat': lat,
            'llong': long,
            'radius': distance,
            'supervisorId': supervisorIds
        }).toPromise().then((res) => {
            return res.json();
        });
    }
    /**
     * @param {?} attUID
     * @return {?}
     */
    getWebPhoneUserData(attUID) {
        /** @type {?} */
        var ldapURL = this.socketURL + "/gettechnicians/" + attUID;
        return this.http.get(ldapURL).toPromise().then((res) => {
            return res.json();
        });
    }
    /**
     * @param {?} attUID
     * @return {?}
     */
    getWebPhoneUserInfo(attUID) {
        /** @type {?} */
        var ldapURL = this.socketURL + "/gettechnicianinfo/" + attUID;
        return this.http.get(ldapURL).toPromise().then((res) => {
            return res.json();
        });
    }
    /**
     * @param {?} fromAttitude
     * @param {?} toAttitude
     * @return {?}
     */
    GetNextRouteData(fromAttitude, toAttitude) {
        /** @type {?} */
        var routeUrl = "https://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=" + fromAttitude + "&wp.1=" + toAttitude + "&routeAttributes=routePath&key=AnxpS-32kYvBzjQ5pbZcnDz17oKBa1Bq2HRwHANoNpHs3Z25NDvqbhcqJZyDoYMj";
        return this.http.get(routeUrl).toPromise().then((res) => {
            return res["_body"];
        });
    }
    /**
     * @param {?} dirDetails
     * @return {?}
     */
    GetRouteMapData(dirDetails) {
        /** @type {?} */
        let combinedUrls = [];
        /** @type {?} */
        let routeUrl;
        /** @type {?} */
        var newRouteUrl;
        dirDetails.forEach((item) => {
            routeUrl = "https://dev.virtualearth.net/REST/V1/Routes/?wp.0=" + item.sourceLat + "," + item.sourceLong + "&wp.1=" + item.destLat + "," + item.destLong + "&key=AnxpS-32kYvBzjQ5pbZcnDz17oKBa1Bq2HRwHANoNpHs3Z25NDvqbhcqJZyDoYMj";
            newRouteUrl = this.http.get(routeUrl);
            combinedUrls.push(newRouteUrl);
        });
        return combinedUrls;
    }
    /**
     * @param {?} fromEmail
     * @param {?} toEmail
     * @param {?} fromName
     * @param {?} toName
     * @param {?} subject
     * @param {?} body
     * @return {?}
     */
    sendEmail(fromEmail, toEmail, fromName, toName, subject, body) {
        /** @type {?} */
        var smsURL = this.socketURL + "/sendemail";
        /** @type {?} */
        var emailMessage = {
            "event": {
                "recipientData": [{
                        "header": { "source": "Kepler", "scenarioName": "", "transactionId": "51111" },
                        "notificationOption": [{ "moc": "email" }],
                        "emailData": {
                            "subject": "" + subject + "",
                            "message": "" + body + "",
                            "address": {
                                "to": [{ "name": "" + toName + "", "address": "" + toEmail + "" }],
                                "cc": [],
                                "bcc": [],
                                "from": { "name": "AT&T Enterprise Notification", "address": "" }, "bounceTo": { "address": "" },
                                "replyTo": { "address": "" }
                            }
                        }
                    }],
                "attribData": [{ "name": "subject", "value": subject },
                    { "name": "message", "value": "This is first camunda process" },
                    { "name": "contractorName", "value": "Ajay Apat" }]
            }
        };
        /** @type {?} */
        var headers = new Headers({ 'Content-Type': 'application/json' });
        /** @type {?} */
        var options = new RequestOptions({ headers: headers });
        return this.http.post(smsURL, JSON.stringify(emailMessage), options).toPromise().then((res) => {
            return res.json();
        });
    }
    /**
     * @param {?} toNumber
     * @param {?} bodyMessage
     * @return {?}
     */
    sendSMS(toNumber, bodyMessage) {
        /** @type {?} */
        var smsURL = this.socketURL + "/sendsms";
        /** @type {?} */
        var smsMessage = {
            "event": {
                "recipientData": [{
                        "header": { "source": "Kepler", "scenarioName": " FirstNetInitialRegistratiionUser", "transactionId": "0004" },
                        "notificationOption": [{ "moc": "sms" }],
                        "smsData": {
                            "details": {
                                "contactData": {
                                    "requestId": "11116", "sysId": "CB", "clientId": "RTTA",
                                    // "phoneNumber": { "areaCode": "" + toNumber.toString().substr(0, 3) + "", "number": "" + toNumber.toString().substr(3, 10) + "" }, "message": "" + bodyMessage + "",
                                    "phoneNumber": { "areaCode": "", "number": "" + toNumber + "" }, "message": "" + bodyMessage + "",
                                    "scenarioName": " FirstNetInitialRegistratiionUser", "internationalNumberIndicator": "True", "interactiveIndicator": "False",
                                    "hostedIndicator": "False", "provider": "BSNL", "shortCode": "1111", "replyTo": "DMAAP"
                                }
                            }
                        }
                    }],
                "attribData": [{ "name": "adminData1", "value": 1234567 }, { "name": "contractorName", "value": "contractor name" }]
            }
        };
        /** @type {?} */
        var headers = new Headers({ 'Content-Type': 'application/json' });
        /** @type {?} */
        var options = new RequestOptions({ headers: headers });
        return this.http.post(smsURL, JSON.stringify(smsMessage), options).toPromise().then((res) => {
            return res.json();
        });
    }
    /**
     * @param {?} techIds
     * @param {?} mgrId
     * @return {?}
     */
    getTruckFeed(techIds, mgrId) {
        /** @type {?} */
        const observable = new Observable(observer => {
            this.socket = io.connect(this.socketURL, {
                secure: true,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 99999
            });
            this.socket.emit('join', { mgrId: mgrId, attuIds: techIds });
            this.socket.on('message', (data) => {
                observer.next(data);
            });
        });
        return observable;
    }
    /**
     * @param {?} dispatchType
     * @return {?}
     */
    getRules(dispatchType) {
        /** @type {?} */
        var getRulesUrl = this.host + "FetchRule";
        return this.http.post(getRulesUrl, {
            "dispatchType": dispatchType
        });
    }
    /**
     * @param {?} key
     * @param {?} objectToStore
     * @return {?}
     */
    storeDataInSessionStorage(key, objectToStore) {
        // return  if you want to remove the complete storage use the clear() method, like localStorage.clear()
        // Check if the sessionStorage object exists
        if (sessionStorage) {
            sessionStorage.setItem(key, JSON.stringify(objectToStore));
        }
    }
    /**
     * @param {?} key
     * @param {?} objectToStore
     * @return {?}
     */
    storeDataInLocalStorage(key, objectToStore) {
        localStorage.setItem(key, JSON.stringify(objectToStore));
    }
    /**
     * @param {?} key
     * @param {?} objectToStore
     * @return {?}
     */
    retrieveDataFromLocalStorage(key, objectToStore) {
        /** @type {?} */
        var result = localStorage.getItem(key);
        if (result != null)
            result = JSON.parse(result);
        return result;
    }
    /**
     * @param {?} key
     * @return {?}
     */
    retrieveDataFromSessionStorage(key) {
        if (sessionStorage) {
            /** @type {?} */
            var result = sessionStorage.getItem(key);
            if (result != null)
                result = JSON.parse(result);
            return result;
        }
        else {
            return null;
        }
    }
}
RttamaplibService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
RttamaplibService.ctorParameters = () => [
    { type: Http }
];
/** @nocollapse */ RttamaplibService.ngInjectableDef = i0.defineInjectable({ factory: function RttamaplibService_Factory() { return new RttamaplibService(i0.inject(i1.Http)); }, token: RttamaplibService, providedIn: "root" });
if (false) {
    /** @type {?} */
    RttamaplibService.prototype.mapReady;
    /** @type {?} */
    RttamaplibService.prototype.showNav;
    /** @type {?} */
    RttamaplibService.prototype.host;
    /** @type {?} */
    RttamaplibService.prototype.socket;
    /** @type {?} */
    RttamaplibService.prototype.socketURL;
    /** @type {?} */
    RttamaplibService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcnR0YW1hcGxpYi8iLCJzb3VyY2VzIjpbImxpYi9ydHRhbWFwbGliLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLElBQUksRUFBWSxjQUFjLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxVQUFVLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLDZCQUE2QixDQUFDO0FBQ3JDLE9BQU8sS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7OztBQU92QyxNQUFNOzs7O0lBUUosWUFBb0IsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07d0JBTm5CLEtBQUs7dUJBQ04sSUFBSTtvQkFDQyxJQUFJO3NCQUNMLElBQUk7eUJBQ0UsSUFBSTtRQUd0QixJQUFJLENBQUMsSUFBSSxHQUFHLDJDQUEyQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsbUNBQW1DLENBQUM7S0FDdEQ7Ozs7O0lBRUQsc0JBQXNCLENBQUMsUUFBUTs7UUFDN0IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7UUFDMUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBYSxFQUFFLEVBQUU7WUFDL0UsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbkIsQ0FBQyxDQUFDO0tBQ0o7Ozs7O0lBRUQsaUJBQWlCLENBQUMsTUFBTTs7UUFDdEIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLFlBQVksR0FBRyxNQUFNLENBQUMsS0FBSyxD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QUFDLENBQUM7S0FDNUQ7Ozs7OztJQUVELDRCQUE0QixDQUFDLEdBQUcsRUFBRSxhQUFhOztRQUUzQyxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUcsTUFBTSxJQUFFLElBQUk7WUFDYixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QixPQUFPLE1BQU0sQ0FBQztLQUNqQjs7Ozs7SUFFRCw4QkFBOEIsQ0FBQyxHQUFHO1FBRWhDLElBQUcsY0FBYyxFQUNqQjs7WUFDRSxJQUFJLE1BQU0sR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLElBQUcsTUFBTSxJQUFFLElBQUk7Z0JBQ2IsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsT0FBTyxNQUFNLENBQUM7U0FDZjthQUVEO1lBQ0UsT0FBTyxJQUFJLENBQUM7U0FDYjtLQUNGOzs7WUFoTkYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7O1lBVlEsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHAsIFJlc3BvbnNlLCBSZXF1ZXN0T3B0aW9ucywgSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaWJlciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tYXAnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci90b1Byb21pc2UnO1xuaW1wb3J0ICogYXMgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5pbXBvcnQgeyBUcnVja0RpcmVjdGlvbkRldGFpbHMgfSBmcm9tICcuL21vZGVscy90cnVja2RldGFpbHMnO1xuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlci9zcmMvdXRpbHMvY29sbGVjdGlvbic7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJ0dGFtYXBsaWJTZXJ2aWNlIHtcblxuICBtYXBSZWFkeSA9IGZhbHNlO1xuICBzaG93TmF2ID0gdHJ1ZTtcbiAgaG9zdDogc3RyaW5nID0gbnVsbDtcbiAgc29ja2V0OiBhbnkgPSBudWxsO1xuICBzb2NrZXRVUkw6IHN0cmluZyA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XG4gICAgdGhpcy5ob3N0ID0gXCJodHRwczovL3psZDA0MDkwLnZjaS5hdHQuY29tOjg0NDMvUkFQVE9SL1wiO1xuICAgIHRoaXMuc29ja2V0VVJMID0gXCJodHRwczovL3psZDA0MDkwLnZjaS5hdHQuY29tOjMwMDdcIjtcbiAgfVxuXG4gIGNoZWNrVXNlckhhc1Blcm1pc3Npb24odXNlck5hbWUpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciB1c2Vyc0xpc3RVcmwgPSB0aGlzLmhvc3QgKyBcImF1dGh1c2VyXCI7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVzZXJzTGlzdFVybCwgdXNlck5hbWUpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TWFwUHVzaFBpbkRhdGEoYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgc3VwZXJ2aXNvcklkID0gW107XG4gICAgc3VwZXJ2aXNvcklkID0gYXR0VUlELnNwbGl0KCcsJyk7XG4gICAgdmFyIHVzZXJzTGlzdFVybCA9IHRoaXMuaG9zdCArICdUZWNoRGV0YWlsRmV0Y2gnO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1c2Vyc0xpc3RVcmwsIHtcbiAgICAgIFwiYXR0dUlkXCI6IFwiXCIsXG4gICAgICBcInN1cGVydmlzb3JJZFwiOiBzdXBlcnZpc29ySWRcbiAgICB9KS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmRUcnVja05lYXJCeShsYXQsIGxvbmcsIGRpc3RhbmNlLCBzdXBlcnZpc29ySWQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzdXBlcnZpc29ySWRzID0gW107XG4gICAgc3VwZXJ2aXNvcklkcyA9IHN1cGVydmlzb3JJZC5zcGxpdCgnLCcpO1xuICAgIGNvbnN0IGZpbmRUcnVja1VSTCA9IHRoaXMuaG9zdCArICdGaW5kVHJ1Y2tOZWFyQnknO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChmaW5kVHJ1Y2tVUkwsIHtcbiAgICAgICdsYXQnOiBsYXQsXG4gICAgICAnbGxvbmcnOiBsb25nLFxuICAgICAgJ3JhZGl1cyc6IGRpc3RhbmNlLFxuICAgICAgJ3N1cGVydmlzb3JJZCc6IHN1cGVydmlzb3JJZHNcbiAgICB9KS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFdlYlBob25lVXNlckRhdGEoYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgbGRhcFVSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvZ2V0dGVjaG5pY2lhbnMvXCIgKyBhdHRVSUQ7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQobGRhcFVSTCkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRXZWJQaG9uZVVzZXJJbmZvKGF0dFVJRCk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIGxkYXBVUkwgPSB0aGlzLnNvY2tldFVSTCArIFwiL2dldHRlY2huaWNpYW5pbmZvL1wiICsgYXR0VUlEO1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGxkYXBVUkwpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgR2V0TmV4dFJvdXRlRGF0YShmcm9tQXR0aXR1ZGUsIHRvQXR0aXR1ZGUpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciByb3V0ZVVybCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL1YxL1JvdXRlcy9Ecml2aW5nP3dwLjA9XCIgKyBmcm9tQXR0aXR1ZGUgKyBcIiZ3cC4xPVwiICsgdG9BdHRpdHVkZSArIFwiJnJvdXRlQXR0cmlidXRlcz1yb3V0ZVBhdGgma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIlxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHJvdXRlVXJsKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzW1wiX2JvZHlcIl07XG4gICAgfSk7XG4gIH1cblxuICBHZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlsczogYW55W10pOiBhbnlbXSB7XG4gICAgbGV0IGNvbWJpbmVkVXJscyA9IFtdO1xuICAgIGxldCByb3V0ZVVybDtcbiAgICB2YXIgbmV3Um91dGVVcmw7XG4gICAgZGlyRGV0YWlscy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICByb3V0ZVVybCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL1YxL1JvdXRlcy8/d3AuMD1cIiArIGl0ZW0uc291cmNlTGF0ICsgXCIsXCIgKyBpdGVtLnNvdXJjZUxvbmcgKyBcIiZ3cC4xPVwiICsgaXRlbS5kZXN0TGF0ICsgXCIsXCIgKyBpdGVtLmRlc3RMb25nICsgXCIma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIlxuICAgICAgbmV3Um91dGVVcmwgPSB0aGlzLmh0dHAuZ2V0KHJvdXRlVXJsKVxuICAgICAgY29tYmluZWRVcmxzLnB1c2gobmV3Um91dGVVcmwpXG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbWJpbmVkVXJscztcbiAgfVxuXG4gIHNlbmRFbWFpbChmcm9tRW1haWwsIHRvRW1haWwsIGZyb21OYW1lLCB0b05hbWUsIHN1YmplY3QsIGJvZHkpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzbXNVUkwgPSB0aGlzLnNvY2tldFVSTCArIFwiL3NlbmRlbWFpbFwiO1xuICAgIHZhciBlbWFpbE1lc3NhZ2UgPSB7XG4gICAgICBcImV2ZW50XCI6IHtcbiAgICAgICAgXCJyZWNpcGllbnREYXRhXCI6IFt7XG4gICAgICAgICAgXCJoZWFkZXJcIjogeyBcInNvdXJjZVwiOiBcIktlcGxlclwiLCBcInNjZW5hcmlvTmFtZVwiOiBcIlwiLCBcInRyYW5zYWN0aW9uSWRcIjogXCI1MTExMVwiIH0sXG4gICAgICAgICAgXCJub3RpZmljYXRpb25PcHRpb25cIjogW3sgXCJtb2NcIjogXCJlbWFpbFwiIH1dLFxuICAgICAgICAgIFwiZW1haWxEYXRhXCI6IHtcbiAgICAgICAgICAgIFwic3ViamVjdFwiOiBcIlwiICsgc3ViamVjdCArIFwiXCIsXG4gICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJcIiArIGJvZHkgKyBcIlwiLFxuICAgICAgICAgICAgXCJhZGRyZXNzXCI6IHtcbiAgICAgICAgICAgICAgXCJ0b1wiOiBbeyBcIm5hbWVcIjogXCJcIiArIHRvTmFtZSArIFwiXCIsIFwiYWRkcmVzc1wiOiBcIlwiICsgdG9FbWFpbCArIFwiXCIgfV0sXG4gICAgICAgICAgICAgIFwiY2NcIjogW10sXG4gICAgICAgICAgICAgIFwiYmNjXCI6IFtdLFxuICAgICAgICAgICAgICBcImZyb21cIjogeyBcIm5hbWVcIjogXCJBVCZUIEVudGVycHJpc2UgTm90aWZpY2F0aW9uXCIsIFwiYWRkcmVzc1wiOiBcIlwiIH0sIFwiYm91bmNlVG9cIjogeyBcImFkZHJlc3NcIjogXCJcIiB9LFxuICAgICAgICAgICAgICBcInJlcGx5VG9cIjogeyBcImFkZHJlc3NcIjogXCJcIiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgXCJhdHRyaWJEYXRhXCI6IFt7IFwibmFtZVwiOiBcInN1YmplY3RcIiwgXCJ2YWx1ZVwiOiAgc3ViamVjdCB9LFxuICAgICAgICB7IFwibmFtZVwiOiBcIm1lc3NhZ2VcIiwgXCJ2YWx1ZVwiOiBcIlRoaXMgaXMgZmlyc3QgY2FtdW5kYSBwcm9jZXNzXCIgfSxcbiAgICAgICAgeyBcIm5hbWVcIjogXCJjb250cmFjdG9yTmFtZVwiLCBcInZhbHVlXCI6IFwiQWpheSBBcGF0XCIgfV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICB2YXIgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IGhlYWRlcnMgfSk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHNtc1VSTCwgSlNPTi5zdHJpbmdpZnkoZW1haWxNZXNzYWdlKSwgb3B0aW9ucykudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBzZW5kU01TKHRvTnVtYmVyLCBib2R5TWVzc2FnZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHNtc1VSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvc2VuZHNtc1wiO1xuICAgIHZhciBzbXNNZXNzYWdlID0ge1xuICAgICAgXCJldmVudFwiOiB7XG4gICAgICAgIFwicmVjaXBpZW50RGF0YVwiOiBbe1xuICAgICAgICAgIFwiaGVhZGVyXCI6IHsgXCJzb3VyY2VcIjogXCJLZXBsZXJcIiwgXCJzY2VuYXJpb05hbWVcIjogXCIgRmlyc3ROZXRJbml0aWFsUmVnaXN0cmF0aWlvblVzZXJcIiwgXCJ0cmFuc2FjdGlvbklkXCI6IFwiMDAwNFwiIH0sXG4gICAgICAgICAgXCJub3RpZmljYXRpb25PcHRpb25cIjogW3sgXCJtb2NcIjogXCJzbXNcIiB9XSxcbiAgICAgICAgICBcInNtc0RhdGFcIjoge1xuICAgICAgICAgICAgXCJkZXRhaWxzXCI6IHtcbiAgICAgICAgICAgICAgXCJjb250YWN0RGF0YVwiOiB7XG4gICAgICAgICAgICAgICAgXCJyZXF1ZXN0SWRcIjogXCIxMTExNlwiLCBcInN5c0lkXCI6IFwiQ0JcIiwgXCJjbGllbnRJZFwiOiBcIlJUVEFcIixcbiAgICAgICAgICAgICAgICAvLyBcInBob25lTnVtYmVyXCI6IHsgXCJhcmVhQ29kZVwiOiBcIlwiICsgdG9OdW1iZXIudG9TdHJpbmcoKS5zdWJzdHIoMCwgMykgKyBcIlwiLCBcIm51bWJlclwiOiBcIlwiICsgdG9OdW1iZXIudG9TdHJpbmcoKS5zdWJzdHIoMywgMTApICsgXCJcIiB9LCBcIm1lc3NhZ2VcIjogXCJcIiArIGJvZHlNZXNzYWdlICsgXCJcIixcbiAgICAgICAgICAgICAgICBcInBob25lTnVtYmVyXCI6IHsgXCJhcmVhQ29kZVwiOiBcIlwiLCBcIm51bWJlclwiOiBcIlwiICsgdG9OdW1iZXIgKyBcIlwiIH0sIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keU1lc3NhZ2UgKyBcIlwiLFxuICAgICAgICAgICAgICAgIFwic2NlbmFyaW9OYW1lXCI6IFwiIEZpcnN0TmV0SW5pdGlhbFJlZ2lzdHJhdGlpb25Vc2VyXCIsIFwiaW50ZXJuYXRpb25hbE51bWJlckluZGljYXRvclwiOiBcIlRydWVcIiwgXCJpbnRlcmFjdGl2ZUluZGljYXRvclwiOiBcIkZhbHNlXCIsXG4gICAgICAgICAgICAgICAgXCJob3N0ZWRJbmRpY2F0b3JcIjogXCJGYWxzZVwiLCBcInByb3ZpZGVyXCI6IFwiQlNOTFwiLCBcInNob3J0Q29kZVwiOiBcIjExMTFcIiwgXCJyZXBseVRvXCI6IFwiRE1BQVBcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgXCJhdHRyaWJEYXRhXCI6IFt7IFwibmFtZVwiOiBcImFkbWluRGF0YTFcIiwgXCJ2YWx1ZVwiOiAxMjM0NTY3IH0sIHsgXCJuYW1lXCI6IFwiY29udHJhY3Rvck5hbWVcIiwgXCJ2YWx1ZVwiOiBcImNvbnRyYWN0b3IgbmFtZVwiIH1dXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XG4gICAgdmFyIG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoeyBoZWFkZXJzOiBoZWFkZXJzIH0pO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChzbXNVUkwsIEpTT04uc3RyaW5naWZ5KHNtc01lc3NhZ2UpLCBvcHRpb25zKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFRydWNrRmVlZCh0ZWNoSWRzOiBhbnksIG1ncklkOiBhbnkpIHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuXG4gICAgICB0aGlzLnNvY2tldCA9IGlvLmNvbm5lY3QodGhpcy5zb2NrZXRVUkwsXG4gICAgICAgIHtcbiAgICAgICAgICBzZWN1cmU6IHRydWUsXG4gICAgICAgICAgcmVjb25uZWN0aW9uOiB0cnVlLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5OiAxMDAwLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5TWF4OiA1MDAwLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkF0dGVtcHRzOiA5OTk5OVxuICAgICAgICB9KTtcblxuICAgICAgdGhpcy5zb2NrZXQuZW1pdCgnam9pbicsIHsgbWdySWQ6IG1ncklkLCBhdHR1SWRzOiB0ZWNoSWRzIH0pO1xuXG4gICAgICB0aGlzLnNvY2tldC5vbignbWVzc2FnZScsIChkYXRhKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoZGF0YSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuICAvL0dldCBSdWxlIGRlc2lnbmVkIGJhc2VkIG9uIHRlY2h0eXBlLlxuICBnZXRSdWxlcyhkaXNwYXRjaFR5cGUpIHtcbiAgICB2YXIgZ2V0UnVsZXNVcmwgPSB0aGlzLmhvc3QgKyBcIkZldGNoUnVsZVwiO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChnZXRSdWxlc1VybCwge1xuICAgICAgXCJkaXNwYXRjaFR5cGVcIjogZGlzcGF0Y2hUeXBlXG4gICAgfSk7XG4gIH1cblxuICBzdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgIC8vIHJldHVybiAgaWYgeW91IHdhbnQgdG8gcmVtb3ZlIHRoZSBjb21wbGV0ZSBzdG9yYWdlIHVzZSB0aGUgY2xlYXIoKSBtZXRob2QsIGxpa2UgbG9jYWxTdG9yYWdlLmNsZWFyKClcbiAgICAvLyBDaGVjayBpZiB0aGUgc2Vzc2lvblN0b3JhZ2Ugb2JqZWN0IGV4aXN0c1xuICAgaWYoc2Vzc2lvblN0b3JhZ2UpXG4gICAge1xuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KG9iamVjdFRvU3RvcmUpKTtcbiAgICB9XG4gIH1cblxuICBzdG9yZURhdGFJbkxvY2FsU3RvcmFnZShrZXksIG9iamVjdFRvU3RvcmUpXG4gIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9TdG9yZSkpO1xuICB9XG5cbiAgcmV0cmlldmVEYXRhRnJvbUxvY2FsU3RvcmFnZShrZXksIG9iamVjdFRvU3RvcmUpXG4gIHtcbiAgICAgIHZhciByZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgaWYocmVzdWx0IT1udWxsKVxuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKGtleSlcbiAge1xuICAgIGlmKHNlc3Npb25TdG9yYWdlKVxuICAgIHtcbiAgICAgIHZhciByZXN1bHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICBpZihyZXN1bHQhPW51bGwpXG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxufVxuIl19