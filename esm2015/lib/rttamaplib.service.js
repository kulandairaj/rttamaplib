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
     * @param {?} latitude
     * @param {?} longitude
     * @return {?}
     */
    getAddressByLatLong(latitude, longitude) {
        /** @type {?} */
        var bingHost = "https://dev.virtualearth.net/REST/v1/Locations/LatLong?o=json&key=AnxpS-32kYvBzjQ5pbZcnDz17oKBa1Bq2HRwHANoNpHs3Z25NDvqbhcqJZyDoYMj";
        /** @type {?} */
        var getBingUrl = bingHost.replace("LatLong", latitude + "," + longitude);
        ;
        return this.http.get(getBingUrl);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcnR0YW1hcGxpYi8iLCJzb3VyY2VzIjpbImxpYi9ydHRhbWFwbGliLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLElBQUksRUFBWSxjQUFjLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxVQUFVLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLDZCQUE2QixDQUFDO0FBQ3JDLE9BQU8sS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7OztBQU92QyxNQUFNOzs7O0lBUUosWUFBb0IsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07d0JBTm5CLEtBQUs7dUJBQ04sSUFBSTtvQkFDQyxJQUFJO3NCQUNMLElBQUk7eUJBQ0UsSUFBSTtRQUd0QixJQUFJLENBQUMsSUFBSSxHQUFHLDJDQUEyQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsbUNBQW1DLENBQUM7S0FDdEQ7Ozs7O0lBRUQsc0JBQXNCLENBQUMsUUFBUTs7UUFDN0IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7UUFDMUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBYSxFQUFFLEVBQUU7WUFDL0UsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbkIsQ0FBQyxDQUFDO0tBQ0o7Ozs7O0lBRUQsaUJBQWlCLENBQUMsTUFBTTs7UUFDdEIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLFlBQVksR0FBRyxNQUFNLENBQUMsS0FBSyxD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LEdBQUcsRUFBRSxhQUFhOzs7UUFJM0MsSUFBRyxjQUFjLEVBQ2hCO1lBQ0UsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1NBQzVEO0tBQ0Y7Ozs7OztJQUVELHVCQUF1QixDQUFDLEdBQUcsRUFBRSxhQUFhO1FBRXRDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztLQUM1RDs7Ozs7O0lBRUQsNEJBQTRCLENBQUMsR0FBRyxFQUFFLGFBQWE7O1FBRTNDLElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBRyxNQUFNLElBQUUsSUFBSTtZQUNiLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLE9BQU8sTUFBTSxDQUFDO0tBQ2pCOzs7OztJQUVELDhCQUE4QixDQUFDLEdBQUc7UUFFaEMsSUFBRyxjQUFjLEVBQ2pCOztZQUNFLElBQUksTUFBTSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekMsSUFBRyxNQUFNLElBQUUsSUFBSTtnQkFDYixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixPQUFPLE1BQU0sQ0FBQztTQUNmO2FBRUQ7WUFDRSxPQUFPLElBQUksQ0FBQztTQUNiO0tBQ0Y7OztZQXZORixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFWUSxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cCwgUmVzcG9uc2UsIFJlcXVlc3RPcHRpb25zLCBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3RvUHJvbWlzZSc7XG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcbmltcG9ydCB7IFRydWNrRGlyZWN0aW9uRGV0YWlscyB9IGZyb20gJy4vbW9kZWxzL3RydWNrZGV0YWlscyc7XG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyL3NyYy91dGlscy9jb2xsZWN0aW9uJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUnR0YW1hcGxpYlNlcnZpY2Uge1xuXG4gIG1hcFJlYWR5ID0gZmFsc2U7XG4gIHNob3dOYXYgPSB0cnVlO1xuICBob3N0OiBzdHJpbmcgPSBudWxsO1xuICBzb2NrZXQ6IGFueSA9IG51bGw7XG4gIHNvY2tldFVSTDogc3RyaW5nID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHtcbiAgICB0aGlzLmhvc3QgPSBcImh0dHBzOi8vemxkMDQwOTAudmNpLmF0dC5jb206ODQ0My9SQVBUT1IvXCI7XG4gICAgdGhpcy5zb2NrZXRVUkwgPSBcImh0dHBzOi8vemxkMDQwOTAudmNpLmF0dC5jb206MzAwN1wiO1xuICB9XG5cbiAgY2hlY2tVc2VySGFzUGVybWlzc2lvbih1c2VyTmFtZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHVzZXJzTGlzdFVybCA9IHRoaXMuaG9zdCArIFwiYXV0aHVzZXJcIjtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXNlcnNMaXN0VXJsLCB1c2VyTmFtZSkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRNYXBQdXNoUGluRGF0YShhdHRVSUQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzdXBlcnZpc29ySWQgPSBbXTtcbiAgICBzdXBlcnZpc29ySWQgPSBhdHRVSUQuc3BsaXQoJywnKTtcbiAgICB2YXIgdXNlcnNMaXN0VXJsID0gdGhpcy5ob3N0ICsgJ1RlY2hEZXRhaWxGZXRjaCc7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVzZXJzTGlzdFVybCwge1xuICAgICAgXCJhdHR1SWRcIjogXCJcIixcbiAgICAgIFwic3VwZXJ2aXNvcklkXCI6IHN1cGVydmlzb3JJZFxuICAgIH0pLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZmluZFRydWNrTmVhckJ5KGxhdCwgbG9uZywgZGlzdGFuY2UsIHN1cGVydmlzb3JJZCk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHN1cGVydmlzb3JJZHMgPSBbXTtcbiAgICBzdXBlcnZpc29ySWRzID0gc3VwZXJ2aXNvcklkLnNwbGl0KCcsJyk7XG4gICAgY29uc3QgZmluZFRydWNrVVJMID0gdGhpcy5ob3N0ICsgJ0ZpbmRUcnVja05lYXJCeSc7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGZpbmRUcnVja1VSTCwge1xuICAgICAgJ2xhdCc6IGxhdCxcbiAgICAgICdsbG9uZyc6IGxvbmcsXG4gICAgICAncmFkaXVzJzogZGlzdGFuY2UsXG4gICAgICAnc3VwZXJ2aXNvcklkJzogc3VwZXJ2aXNvcklkc1xuICAgIH0pLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0V2ViUGhvbmVVc2VyRGF0YShhdHRVSUQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBsZGFwVVJMID0gdGhpcy5zb2NrZXRVUkwgKyBcIi9nZXR0ZWNobmljaWFucy9cIiArIGF0dFVJRDtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChsZGFwVVJMKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFdlYlBob25lVXNlckluZm8oYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgbGRhcFVSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvZ2V0dGVjaG5pY2lhbmluZm8vXCIgKyBhdHRVSUQ7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQobGRhcFVSTCkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBHZXROZXh0Um91dGVEYXRhKGZyb21BdHRpdHVkZSwgdG9BdHRpdHVkZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHJvdXRlVXJsID0gXCJodHRwczovL2Rldi52aXJ0dWFsZWFydGgubmV0L1JFU1QvVjEvUm91dGVzL0RyaXZpbmc/d3AuMD1cIiArIGZyb21BdHRpdHVkZSArIFwiJndwLjE9XCIgKyB0b0F0dGl0dWRlICsgXCImcm91dGVBdHRyaWJ1dGVzPXJvdXRlUGF0aCZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQocm91dGVVcmwpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNbXCJfYm9keVwiXTtcbiAgICB9KTtcbiAgfVxuXG4gIEdldFJvdXRlTWFwRGF0YShkaXJEZXRhaWxzOiBhbnlbXSk6IGFueVtdIHtcbiAgICBsZXQgY29tYmluZWRVcmxzID0gW107XG4gICAgbGV0IHJvdXRlVXJsO1xuICAgIHZhciBuZXdSb3V0ZVVybDtcbiAgICBkaXJEZXRhaWxzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIHJvdXRlVXJsID0gXCJodHRwczovL2Rldi52aXJ0dWFsZWFydGgubmV0L1JFU1QvVjEvUm91dGVzLz93cC4wPVwiICsgaXRlbS5zb3VyY2VMYXQgKyBcIixcIiArIGl0ZW0uc291cmNlTG9uZyArIFwiJndwLjE9XCIgKyBpdGVtLmRlc3RMYXQgKyBcIixcIiArIGl0ZW0uZGVzdExvbmcgKyBcIiZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiXG4gICAgICBuZXdSb3V0ZVVybCA9IHRoaXMuaHR0cC5nZXQocm91dGVVcmwpXG4gICAgICBjb21iaW5lZFVybHMucHVzaChuZXdSb3V0ZVVybClcbiAgICB9KTtcbiAgICByZXR1cm4gY29tYmluZWRVcmxzO1xuICB9XG5cbiAgZ2V0QWRkcmVzc0J5TGF0TG9uZyhsYXRpdHVkZSxsb25naXR1ZGUpIHsgIFxuICAgIHZhciBiaW5nSG9zdCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL3YxL0xvY2F0aW9ucy9MYXRMb25nP289anNvbiZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiO1xuICBcbiAgICB2YXIgZ2V0QmluZ1VybCA9IGJpbmdIb3N0LnJlcGxhY2UoXCJMYXRMb25nXCIsbGF0aXR1ZGUgKyBcIixcIiArIGxvbmdpdHVkZSk7O1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGdldEJpbmdVcmwpO1xuICB9XG5cbiAgc2VuZEVtYWlsKGZyb21FbWFpbCwgdG9FbWFpbCwgZnJvbU5hbWUsIHRvTmFtZSwgc3ViamVjdCwgYm9keSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHNtc1VSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvc2VuZGVtYWlsXCI7XG4gICAgdmFyIGVtYWlsTWVzc2FnZSA9IHtcbiAgICAgIFwiZXZlbnRcIjoge1xuICAgICAgICBcInJlY2lwaWVudERhdGFcIjogW3tcbiAgICAgICAgICBcImhlYWRlclwiOiB7IFwic291cmNlXCI6IFwiS2VwbGVyXCIsIFwic2NlbmFyaW9OYW1lXCI6IFwiXCIsIFwidHJhbnNhY3Rpb25JZFwiOiBcIjUxMTExXCIgfSxcbiAgICAgICAgICBcIm5vdGlmaWNhdGlvbk9wdGlvblwiOiBbeyBcIm1vY1wiOiBcImVtYWlsXCIgfV0sXG4gICAgICAgICAgXCJlbWFpbERhdGFcIjoge1xuICAgICAgICAgICAgXCJzdWJqZWN0XCI6IFwiXCIgKyBzdWJqZWN0ICsgXCJcIixcbiAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keSArIFwiXCIsXG4gICAgICAgICAgICBcImFkZHJlc3NcIjoge1xuICAgICAgICAgICAgICBcInRvXCI6IFt7IFwibmFtZVwiOiBcIlwiICsgdG9OYW1lICsgXCJcIiwgXCJhZGRyZXNzXCI6IFwiXCIgKyB0b0VtYWlsICsgXCJcIiB9XSxcbiAgICAgICAgICAgICAgXCJjY1wiOiBbXSxcbiAgICAgICAgICAgICAgXCJiY2NcIjogW10sXG4gICAgICAgICAgICAgIFwiZnJvbVwiOiB7IFwibmFtZVwiOiBcIkFUJlQgRW50ZXJwcmlzZSBOb3RpZmljYXRpb25cIiwgXCJhZGRyZXNzXCI6IFwiXCIgfSwgXCJib3VuY2VUb1wiOiB7IFwiYWRkcmVzc1wiOiBcIlwiIH0sXG4gICAgICAgICAgICAgIFwicmVwbHlUb1wiOiB7IFwiYWRkcmVzc1wiOiBcIlwiIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICBcImF0dHJpYkRhdGFcIjogW3sgXCJuYW1lXCI6IFwic3ViamVjdFwiLCBcInZhbHVlXCI6ICBzdWJqZWN0IH0sXG4gICAgICAgIHsgXCJuYW1lXCI6IFwibWVzc2FnZVwiLCBcInZhbHVlXCI6IFwiVGhpcyBpcyBmaXJzdCBjYW11bmRhIHByb2Nlc3NcIiB9LFxuICAgICAgICB7IFwibmFtZVwiOiBcImNvbnRyYWN0b3JOYW1lXCIsIFwidmFsdWVcIjogXCJBamF5IEFwYXRcIiB9XVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuICAgIHZhciBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogaGVhZGVycyB9KTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Qoc21zVVJMLCBKU09OLnN0cmluZ2lmeShlbWFpbE1lc3NhZ2UpLCBvcHRpb25zKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRTTVModG9OdW1iZXIsIGJvZHlNZXNzYWdlKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgc21zVVJMID0gdGhpcy5zb2NrZXRVUkwgKyBcIi9zZW5kc21zXCI7XG4gICAgdmFyIHNtc01lc3NhZ2UgPSB7XG4gICAgICBcImV2ZW50XCI6IHtcbiAgICAgICAgXCJyZWNpcGllbnREYXRhXCI6IFt7XG4gICAgICAgICAgXCJoZWFkZXJcIjogeyBcInNvdXJjZVwiOiBcIktlcGxlclwiLCBcInNjZW5hcmlvTmFtZVwiOiBcIiBGaXJzdE5ldEluaXRpYWxSZWdpc3RyYXRpaW9uVXNlclwiLCBcInRyYW5zYWN0aW9uSWRcIjogXCIwMDA0XCIgfSxcbiAgICAgICAgICBcIm5vdGlmaWNhdGlvbk9wdGlvblwiOiBbeyBcIm1vY1wiOiBcInNtc1wiIH1dLFxuICAgICAgICAgIFwic21zRGF0YVwiOiB7XG4gICAgICAgICAgICBcImRldGFpbHNcIjoge1xuICAgICAgICAgICAgICBcImNvbnRhY3REYXRhXCI6IHtcbiAgICAgICAgICAgICAgICBcInJlcXVlc3RJZFwiOiBcIjExMTE2XCIsIFwic3lzSWRcIjogXCJDQlwiLCBcImNsaWVudElkXCI6IFwiUlRUQVwiLFxuICAgICAgICAgICAgICAgIC8vIFwicGhvbmVOdW1iZXJcIjogeyBcImFyZWFDb2RlXCI6IFwiXCIgKyB0b051bWJlci50b1N0cmluZygpLnN1YnN0cigwLCAzKSArIFwiXCIsIFwibnVtYmVyXCI6IFwiXCIgKyB0b051bWJlci50b1N0cmluZygpLnN1YnN0cigzLCAxMCkgKyBcIlwiIH0sIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keU1lc3NhZ2UgKyBcIlwiLFxuICAgICAgICAgICAgICAgIFwicGhvbmVOdW1iZXJcIjogeyBcImFyZWFDb2RlXCI6IFwiXCIsIFwibnVtYmVyXCI6IFwiXCIgKyB0b051bWJlciArIFwiXCIgfSwgXCJtZXNzYWdlXCI6IFwiXCIgKyBib2R5TWVzc2FnZSArIFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzY2VuYXJpb05hbWVcIjogXCIgRmlyc3ROZXRJbml0aWFsUmVnaXN0cmF0aWlvblVzZXJcIiwgXCJpbnRlcm5hdGlvbmFsTnVtYmVySW5kaWNhdG9yXCI6IFwiVHJ1ZVwiLCBcImludGVyYWN0aXZlSW5kaWNhdG9yXCI6IFwiRmFsc2VcIixcbiAgICAgICAgICAgICAgICBcImhvc3RlZEluZGljYXRvclwiOiBcIkZhbHNlXCIsIFwicHJvdmlkZXJcIjogXCJCU05MXCIsIFwic2hvcnRDb2RlXCI6IFwiMTExMVwiLCBcInJlcGx5VG9cIjogXCJETUFBUFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICBcImF0dHJpYkRhdGFcIjogW3sgXCJuYW1lXCI6IFwiYWRtaW5EYXRhMVwiLCBcInZhbHVlXCI6IDEyMzQ1NjcgfSwgeyBcIm5hbWVcIjogXCJjb250cmFjdG9yTmFtZVwiLCBcInZhbHVlXCI6IFwiY29udHJhY3RvciBuYW1lXCIgfV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICB2YXIgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IGhlYWRlcnMgfSk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHNtc1VSTCwgSlNPTi5zdHJpbmdpZnkoc21zTWVzc2FnZSksIG9wdGlvbnMpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VHJ1Y2tGZWVkKHRlY2hJZHM6IGFueSwgbWdySWQ6IGFueSkge1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG5cbiAgICAgIHRoaXMuc29ja2V0ID0gaW8uY29ubmVjdCh0aGlzLnNvY2tldFVSTCxcbiAgICAgICAge1xuICAgICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgICByZWNvbm5lY3Rpb246IHRydWUsXG4gICAgICAgICAgcmVjb25uZWN0aW9uRGVsYXk6IDEwMDAsXG4gICAgICAgICAgcmVjb25uZWN0aW9uRGVsYXlNYXg6IDUwMDAsXG4gICAgICAgICAgcmVjb25uZWN0aW9uQXR0ZW1wdHM6IDk5OTk5XG4gICAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNvY2tldC5lbWl0KCdqb2luJywgeyBtZ3JJZDogbWdySWQsIGF0dHVJZHM6IHRlY2hJZHMgfSk7XG5cbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdtZXNzYWdlJywgKGRhdGEpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG4gIC8vR2V0IFJ1bGUgZGVzaWduZWQgYmFzZWQgb24gdGVjaHR5cGUuXG4gIGdldFJ1bGVzKGRpc3BhdGNoVHlwZSkge1xuICAgIHZhciBnZXRSdWxlc1VybCA9IHRoaXMuaG9zdCArIFwiRmV0Y2hSdWxlXCI7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGdldFJ1bGVzVXJsLCB7XG4gICAgICBcImRpc3BhdGNoVHlwZVwiOiBkaXNwYXRjaFR5cGVcbiAgICB9KTtcbiAgfVxuXG4gIHN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2Uoa2V5LCBvYmplY3RUb1N0b3JlKVxuICB7XG4gICAgLy8gcmV0dXJuICBpZiB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGNvbXBsZXRlIHN0b3JhZ2UgdXNlIHRoZSBjbGVhcigpIG1ldGhvZCwgbGlrZSBsb2NhbFN0b3JhZ2UuY2xlYXIoKVxuICAgIC8vIENoZWNrIGlmIHRoZSBzZXNzaW9uU3RvcmFnZSBvYmplY3QgZXhpc3RzXG4gICBpZihzZXNzaW9uU3RvcmFnZSlcbiAgICB7XG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9TdG9yZSkpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3JlRGF0YUluTG9jYWxTdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShvYmplY3RUb1N0b3JlKSk7XG4gIH1cblxuICByZXRyaWV2ZURhdGFGcm9tTG9jYWxTdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgICAgdmFyIHJlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICBpZihyZXN1bHQhPW51bGwpXG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2Uoa2V5KVxuICB7XG4gICAgaWYoc2Vzc2lvblN0b3JhZ2UpXG4gICAge1xuICAgICAgdmFyIHJlc3VsdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgIGlmKHJlc3VsdCE9bnVsbClcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=