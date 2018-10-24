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
var RttamaplibService = /** @class */ (function () {
    function RttamaplibService(http) {
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
    RttamaplibService.prototype.checkUserHasPermission = /**
     * @param {?} userName
     * @return {?}
     */
    function (userName) {
        /** @type {?} */
        var usersListUrl = this.host + "authuser";
        return this.http.post(usersListUrl, userName).toPromise().then(function (res) {
            return res.json();
        });
    };
    /**
     * @param {?} attUID
     * @return {?}
     */
    RttamaplibService.prototype.getMapPushPinData = /**
     * @param {?} attUID
     * @return {?}
     */
    function (attUID) {
        /** @type {?} */
        var supervisorId = [];
        supervisorId = attUID.split(',');
        /** @type {?} */
        var usersListUrl = this.host + 'TechDetailFetch';
        return this.http.post(usersListUrl, {
            "attuId": "",
            "supervisorId": supervisorId
        }).toPromise().then(function (res) {
            return res.json();
        });
    };
    /**
     * @param {?} lat
     * @param {?} long
     * @param {?} distance
     * @param {?} supervisorId
     * @return {?}
     */
    RttamaplibService.prototype.findTruckNearBy = /**
     * @param {?} lat
     * @param {?} long
     * @param {?} distance
     * @param {?} supervisorId
     * @return {?}
     */
    function (lat, long, distance, supervisorId) {
        /** @type {?} */
        var supervisorIds = [];
        supervisorIds = supervisorId.split(',');
        /** @type {?} */
        var findTruckURL = this.host + 'FindTruckNearBy';
        return this.http.post(findTruckURL, {
            'lat': lat,
            'llong': long,
            'radius': distance,
            'supervisorId': supervisorIds
        }).toPromise().then(function (res) {
            return res.json();
        });
    };
    /**
     * @param {?} attUID
     * @return {?}
     */
    RttamaplibService.prototype.getWebPhoneUserData = /**
     * @param {?} attUID
     * @return {?}
     */
    function (attUID) {
        /** @type {?} */
        var ldapURL = this.socketURL + "/gettechnicians/" + attUID;
        return this.http.get(ldapURL).toPromise().then(function (res) {
            return res.json();
        });
    };
    /**
     * @param {?} attUID
     * @return {?}
     */
    RttamaplibService.prototype.getWebPhoneUserInfo = /**
     * @param {?} attUID
     * @return {?}
     */
    function (attUID) {
        /** @type {?} */
        var ldapURL = this.socketURL + "/gettechnicianinfo/" + attUID;
        return this.http.get(ldapURL).toPromise().then(function (res) {
            return res.json();
        });
    };
    /**
     * @param {?} fromAttitude
     * @param {?} toAttitude
     * @return {?}
     */
    RttamaplibService.prototype.GetNextRouteData = /**
     * @param {?} fromAttitude
     * @param {?} toAttitude
     * @return {?}
     */
    function (fromAttitude, toAttitude) {
        /** @type {?} */
        var routeUrl = "https://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=" + fromAttitude + "&wp.1=" + toAttitude + "&routeAttributes=routePath&key=AnxpS-32kYvBzjQ5pbZcnDz17oKBa1Bq2HRwHANoNpHs3Z25NDvqbhcqJZyDoYMj";
        return this.http.get(routeUrl).toPromise().then(function (res) {
            return res["_body"];
        });
    };
    /**
     * @param {?} dirDetails
     * @return {?}
     */
    RttamaplibService.prototype.GetRouteMapData = /**
     * @param {?} dirDetails
     * @return {?}
     */
    function (dirDetails) {
        var _this = this;
        /** @type {?} */
        var combinedUrls = [];
        /** @type {?} */
        var routeUrl;
        /** @type {?} */
        var newRouteUrl;
        dirDetails.forEach(function (item) {
            routeUrl = "https://dev.virtualearth.net/REST/V1/Routes/?wp.0=" + item.sourceLat + "," + item.sourceLong + "&wp.1=" + item.destLat + "," + item.destLong + "&key=AnxpS-32kYvBzjQ5pbZcnDz17oKBa1Bq2HRwHANoNpHs3Z25NDvqbhcqJZyDoYMj";
            newRouteUrl = _this.http.get(routeUrl);
            combinedUrls.push(newRouteUrl);
        });
        return combinedUrls;
    };
    /**
     * @param {?} fromEmail
     * @param {?} toEmail
     * @param {?} fromName
     * @param {?} toName
     * @param {?} subject
     * @param {?} body
     * @return {?}
     */
    RttamaplibService.prototype.sendEmail = /**
     * @param {?} fromEmail
     * @param {?} toEmail
     * @param {?} fromName
     * @param {?} toName
     * @param {?} subject
     * @param {?} body
     * @return {?}
     */
    function (fromEmail, toEmail, fromName, toName, subject, body) {
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
        return this.http.post(smsURL, JSON.stringify(emailMessage), options).toPromise().then(function (res) {
            return res.json();
        });
    };
    /**
     * @param {?} toNumber
     * @param {?} bodyMessage
     * @return {?}
     */
    RttamaplibService.prototype.sendSMS = /**
     * @param {?} toNumber
     * @param {?} bodyMessage
     * @return {?}
     */
    function (toNumber, bodyMessage) {
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
        return this.http.post(smsURL, JSON.stringify(smsMessage), options).toPromise().then(function (res) {
            return res.json();
        });
    };
    /**
     * @param {?} techIds
     * @param {?} mgrId
     * @return {?}
     */
    RttamaplibService.prototype.getTruckFeed = /**
     * @param {?} techIds
     * @param {?} mgrId
     * @return {?}
     */
    function (techIds, mgrId) {
        var _this = this;
        /** @type {?} */
        var observable = new Observable(function (observer) {
            _this.socket = io.connect(_this.socketURL, {
                secure: true,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 99999
            });
            _this.socket.emit('join', { mgrId: mgrId, attuIds: techIds });
            _this.socket.on('message', function (data) {
                observer.next(data);
            });
        });
        return observable;
    };
    //Get Rule designed based on techtype.
    /**
     * @param {?} dispatchType
     * @return {?}
     */
    RttamaplibService.prototype.getRules = /**
     * @param {?} dispatchType
     * @return {?}
     */
    function (dispatchType) {
        /** @type {?} */
        var getRulesUrl = this.host + "FetchRule";
        return this.http.post(getRulesUrl, {
            "dispatchType": dispatchType
        });
    };
    /**
     * @param {?} key
     * @param {?} objectToStore
     * @return {?}
     */
    RttamaplibService.prototype.storeDataInSessionStorage = /**
     * @param {?} key
     * @param {?} objectToStore
     * @return {?}
     */
    function (key, objectToStore) {
        // return  if you want to remove the complete storage use the clear() method, like localStorage.clear()
        // Check if the sessionStorage object exists
        if (sessionStorage) {
            sessionStorage.setItem(key, JSON.stringify(objectToStore));
        }
    };
    /**
     * @param {?} key
     * @param {?} objectToStore
     * @return {?}
     */
    RttamaplibService.prototype.storeDataInLocalStorage = /**
     * @param {?} key
     * @param {?} objectToStore
     * @return {?}
     */
    function (key, objectToStore) {
        localStorage.setItem(key, JSON.stringify(objectToStore));
    };
    /**
     * @param {?} key
     * @param {?} objectToStore
     * @return {?}
     */
    RttamaplibService.prototype.retrieveDataFromLocalStorage = /**
     * @param {?} key
     * @param {?} objectToStore
     * @return {?}
     */
    function (key, objectToStore) {
        /** @type {?} */
        var result = localStorage.getItem(key);
        if (result != null)
            result = JSON.parse(result);
        return result;
    };
    /**
     * @param {?} key
     * @return {?}
     */
    RttamaplibService.prototype.retrieveDataFromSessionStorage = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
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
    };
    RttamaplibService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    RttamaplibService.ctorParameters = function () { return [
        { type: Http }
    ]; };
    /** @nocollapse */ RttamaplibService.ngInjectableDef = i0.defineInjectable({ factory: function RttamaplibService_Factory() { return new RttamaplibService(i0.inject(i1.Http)); }, token: RttamaplibService, providedIn: "root" });
    return RttamaplibService;
}());
export { RttamaplibService };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcnR0YW1hcGxpYi8iLCJzb3VyY2VzIjpbImxpYi9ydHRhbWFwbGliLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLElBQUksRUFBWSxjQUFjLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxVQUFVLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLDZCQUE2QixDQUFDO0FBQ3JDLE9BQU8sS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7Ozs7SUFlckMsMkJBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO3dCQU5uQixLQUFLO3VCQUNOLElBQUk7b0JBQ0MsSUFBSTtzQkFDTCxJQUFJO3lCQUNFLElBQUk7UUFHdEIsSUFBSSxDQUFDLElBQUksR0FBRywyQ0FBMkMsQ0FBQztRQUN4RCxJQUFJLENBQUMsU0FBUyxHQUFHLG1DQUFtQyxDQUFDO0tBQ3REOzs7OztJQUVELGtEQUFzQjs7OztJQUF0QixVQUF1QixRQUFROztRQUM3QixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztRQUMxQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFhO1lBQzNFLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ25CLENBQUMsQ0FBQztLQUNKOzs7OztJQUVELDZDQUFpQjs7OztJQUFqQixVQUFrQixNQUFNOztRQUN0QixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdEIsWUFBWSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENB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QUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7S0FDNUQ7Ozs7OztJQUVELHdEQUE0Qjs7Ozs7SUFBNUIsVUFBNkIsR0FBRyxFQUFFLGFBQWE7O1FBRTNDLElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBRyxNQUFNLElBQUUsSUFBSTtZQUNiLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLE9BQU8sTUFBTSxDQUFDO0tBQ2pCOzs7OztJQUVELDBEQUE4Qjs7OztJQUE5QixVQUErQixHQUFHO1FBRWhDLElBQUcsY0FBYyxFQUNqQjs7WUFDRSxJQUFJLE1BQU0sR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLElBQUcsTUFBTSxJQUFFLElBQUk7Z0JBQ2IsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsT0FBTyxNQUFNLENBQUM7U0FDZjthQUVEO1lBQ0UsT0FBTyxJQUFJLENBQUM7U0FDYjtLQUNGOztnQkFoTkYsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7OztnQkFWUSxJQUFJOzs7NEJBRGI7O1NBWWEsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cCwgUmVzcG9uc2UsIFJlcXVlc3RPcHRpb25zLCBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3RvUHJvbWlzZSc7XG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcbmltcG9ydCB7IFRydWNrRGlyZWN0aW9uRGV0YWlscyB9IGZyb20gJy4vbW9kZWxzL3RydWNrZGV0YWlscyc7XG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyL3NyYy91dGlscy9jb2xsZWN0aW9uJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUnR0YW1hcGxpYlNlcnZpY2Uge1xuXG4gIG1hcFJlYWR5ID0gZmFsc2U7XG4gIHNob3dOYXYgPSB0cnVlO1xuICBob3N0OiBzdHJpbmcgPSBudWxsO1xuICBzb2NrZXQ6IGFueSA9IG51bGw7XG4gIHNvY2tldFVSTDogc3RyaW5nID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHtcbiAgICB0aGlzLmhvc3QgPSBcImh0dHBzOi8vemxkMDQwOTAudmNpLmF0dC5jb206ODQ0My9SQVBUT1IvXCI7XG4gICAgdGhpcy5zb2NrZXRVUkwgPSBcImh0dHBzOi8vemxkMDQwOTAudmNpLmF0dC5jb206MzAwN1wiO1xuICB9XG5cbiAgY2hlY2tVc2VySGFzUGVybWlzc2lvbih1c2VyTmFtZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHVzZXJzTGlzdFVybCA9IHRoaXMuaG9zdCArIFwiYXV0aHVzZXJcIjtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXNlcnNMaXN0VXJsLCB1c2VyTmFtZSkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRNYXBQdXNoUGluRGF0YShhdHRVSUQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzdXBlcnZpc29ySWQgPSBbXTtcbiAgICBzdXBlcnZpc29ySWQgPSBhdHRVSUQuc3BsaXQoJywnKTtcbiAgICB2YXIgdXNlcnNMaXN0VXJsID0gdGhpcy5ob3N0ICsgJ1RlY2hEZXRhaWxGZXRjaCc7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVzZXJzTGlzdFVybCwge1xuICAgICAgXCJhdHR1SWRcIjogXCJcIixcbiAgICAgIFwic3VwZXJ2aXNvcklkXCI6IHN1cGVydmlzb3JJZFxuICAgIH0pLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZmluZFRydWNrTmVhckJ5KGxhdCwgbG9uZywgZGlzdGFuY2UsIHN1cGVydmlzb3JJZCk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHN1cGVydmlzb3JJZHMgPSBbXTtcbiAgICBzdXBlcnZpc29ySWRzID0gc3VwZXJ2aXNvcklkLnNwbGl0KCcsJyk7XG4gICAgY29uc3QgZmluZFRydWNrVVJMID0gdGhpcy5ob3N0ICsgJ0ZpbmRUcnVja05lYXJCeSc7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGZpbmRUcnVja1VSTCwge1xuICAgICAgJ2xhdCc6IGxhdCxcbiAgICAgICdsbG9uZyc6IGxvbmcsXG4gICAgICAncmFkaXVzJzogZGlzdGFuY2UsXG4gICAgICAnc3VwZXJ2aXNvcklkJzogc3VwZXJ2aXNvcklkc1xuICAgIH0pLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0V2ViUGhvbmVVc2VyRGF0YShhdHRVSUQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBsZGFwVVJMID0gdGhpcy5zb2NrZXRVUkwgKyBcIi9nZXR0ZWNobmljaWFucy9cIiArIGF0dFVJRDtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChsZGFwVVJMKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFdlYlBob25lVXNlckluZm8oYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgbGRhcFVSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvZ2V0dGVjaG5pY2lhbmluZm8vXCIgKyBhdHRVSUQ7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQobGRhcFVSTCkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBHZXROZXh0Um91dGVEYXRhKGZyb21BdHRpdHVkZSwgdG9BdHRpdHVkZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHJvdXRlVXJsID0gXCJodHRwczovL2Rldi52aXJ0dWFsZWFydGgubmV0L1JFU1QvVjEvUm91dGVzL0RyaXZpbmc/d3AuMD1cIiArIGZyb21BdHRpdHVkZSArIFwiJndwLjE9XCIgKyB0b0F0dGl0dWRlICsgXCImcm91dGVBdHRyaWJ1dGVzPXJvdXRlUGF0aCZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQocm91dGVVcmwpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNbXCJfYm9keVwiXTtcbiAgICB9KTtcbiAgfVxuXG4gIEdldFJvdXRlTWFwRGF0YShkaXJEZXRhaWxzOiBhbnlbXSk6IGFueVtdIHtcbiAgICBsZXQgY29tYmluZWRVcmxzID0gW107XG4gICAgbGV0IHJvdXRlVXJsO1xuICAgIHZhciBuZXdSb3V0ZVVybDtcbiAgICBkaXJEZXRhaWxzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIHJvdXRlVXJsID0gXCJodHRwczovL2Rldi52aXJ0dWFsZWFydGgubmV0L1JFU1QvVjEvUm91dGVzLz93cC4wPVwiICsgaXRlbS5zb3VyY2VMYXQgKyBcIixcIiArIGl0ZW0uc291cmNlTG9uZyArIFwiJndwLjE9XCIgKyBpdGVtLmRlc3RMYXQgKyBcIixcIiArIGl0ZW0uZGVzdExvbmcgKyBcIiZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiXG4gICAgICBuZXdSb3V0ZVVybCA9IHRoaXMuaHR0cC5nZXQocm91dGVVcmwpXG4gICAgICBjb21iaW5lZFVybHMucHVzaChuZXdSb3V0ZVVybClcbiAgICB9KTtcbiAgICByZXR1cm4gY29tYmluZWRVcmxzO1xuICB9XG5cbiAgc2VuZEVtYWlsKGZyb21FbWFpbCwgdG9FbWFpbCwgZnJvbU5hbWUsIHRvTmFtZSwgc3ViamVjdCwgYm9keSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHNtc1VSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvc2VuZGVtYWlsXCI7XG4gICAgdmFyIGVtYWlsTWVzc2FnZSA9IHtcbiAgICAgIFwiZXZlbnRcIjoge1xuICAgICAgICBcInJlY2lwaWVudERhdGFcIjogW3tcbiAgICAgICAgICBcImhlYWRlclwiOiB7IFwic291cmNlXCI6IFwiS2VwbGVyXCIsIFwic2NlbmFyaW9OYW1lXCI6IFwiXCIsIFwidHJhbnNhY3Rpb25JZFwiOiBcIjUxMTExXCIgfSxcbiAgICAgICAgICBcIm5vdGlmaWNhdGlvbk9wdGlvblwiOiBbeyBcIm1vY1wiOiBcImVtYWlsXCIgfV0sXG4gICAgICAgICAgXCJlbWFpbERhdGFcIjoge1xuICAgICAgICAgICAgXCJzdWJqZWN0XCI6IFwiXCIgKyBzdWJqZWN0ICsgXCJcIixcbiAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keSArIFwiXCIsXG4gICAgICAgICAgICBcImFkZHJlc3NcIjoge1xuICAgICAgICAgICAgICBcInRvXCI6IFt7IFwibmFtZVwiOiBcIlwiICsgdG9OYW1lICsgXCJcIiwgXCJhZGRyZXNzXCI6IFwiXCIgKyB0b0VtYWlsICsgXCJcIiB9XSxcbiAgICAgICAgICAgICAgXCJjY1wiOiBbXSxcbiAgICAgICAgICAgICAgXCJiY2NcIjogW10sXG4gICAgICAgICAgICAgIFwiZnJvbVwiOiB7IFwibmFtZVwiOiBcIkFUJlQgRW50ZXJwcmlzZSBOb3RpZmljYXRpb25cIiwgXCJhZGRyZXNzXCI6IFwiXCIgfSwgXCJib3VuY2VUb1wiOiB7IFwiYWRkcmVzc1wiOiBcIlwiIH0sXG4gICAgICAgICAgICAgIFwicmVwbHlUb1wiOiB7IFwiYWRkcmVzc1wiOiBcIlwiIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICBcImF0dHJpYkRhdGFcIjogW3sgXCJuYW1lXCI6IFwic3ViamVjdFwiLCBcInZhbHVlXCI6ICBzdWJqZWN0IH0sXG4gICAgICAgIHsgXCJuYW1lXCI6IFwibWVzc2FnZVwiLCBcInZhbHVlXCI6IFwiVGhpcyBpcyBmaXJzdCBjYW11bmRhIHByb2Nlc3NcIiB9LFxuICAgICAgICB7IFwibmFtZVwiOiBcImNvbnRyYWN0b3JOYW1lXCIsIFwidmFsdWVcIjogXCJBamF5IEFwYXRcIiB9XVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuICAgIHZhciBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogaGVhZGVycyB9KTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Qoc21zVVJMLCBKU09OLnN0cmluZ2lmeShlbWFpbE1lc3NhZ2UpLCBvcHRpb25zKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRTTVModG9OdW1iZXIsIGJvZHlNZXNzYWdlKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgc21zVVJMID0gdGhpcy5zb2NrZXRVUkwgKyBcIi9zZW5kc21zXCI7XG4gICAgdmFyIHNtc01lc3NhZ2UgPSB7XG4gICAgICBcImV2ZW50XCI6IHtcbiAgICAgICAgXCJyZWNpcGllbnREYXRhXCI6IFt7XG4gICAgICAgICAgXCJoZWFkZXJcIjogeyBcInNvdXJjZVwiOiBcIktlcGxlclwiLCBcInNjZW5hcmlvTmFtZVwiOiBcIiBGaXJzdE5ldEluaXRpYWxSZWdpc3RyYXRpaW9uVXNlclwiLCBcInRyYW5zYWN0aW9uSWRcIjogXCIwMDA0XCIgfSxcbiAgICAgICAgICBcIm5vdGlmaWNhdGlvbk9wdGlvblwiOiBbeyBcIm1vY1wiOiBcInNtc1wiIH1dLFxuICAgICAgICAgIFwic21zRGF0YVwiOiB7XG4gICAgICAgICAgICBcImRldGFpbHNcIjoge1xuICAgICAgICAgICAgICBcImNvbnRhY3REYXRhXCI6IHtcbiAgICAgICAgICAgICAgICBcInJlcXVlc3RJZFwiOiBcIjExMTE2XCIsIFwic3lzSWRcIjogXCJDQlwiLCBcImNsaWVudElkXCI6IFwiUlRUQVwiLFxuICAgICAgICAgICAgICAgIC8vIFwicGhvbmVOdW1iZXJcIjogeyBcImFyZWFDb2RlXCI6IFwiXCIgKyB0b051bWJlci50b1N0cmluZygpLnN1YnN0cigwLCAzKSArIFwiXCIsIFwibnVtYmVyXCI6IFwiXCIgKyB0b051bWJlci50b1N0cmluZygpLnN1YnN0cigzLCAxMCkgKyBcIlwiIH0sIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keU1lc3NhZ2UgKyBcIlwiLFxuICAgICAgICAgICAgICAgIFwicGhvbmVOdW1iZXJcIjogeyBcImFyZWFDb2RlXCI6IFwiXCIsIFwibnVtYmVyXCI6IFwiXCIgKyB0b051bWJlciArIFwiXCIgfSwgXCJtZXNzYWdlXCI6IFwiXCIgKyBib2R5TWVzc2FnZSArIFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzY2VuYXJpb05hbWVcIjogXCIgRmlyc3ROZXRJbml0aWFsUmVnaXN0cmF0aWlvblVzZXJcIiwgXCJpbnRlcm5hdGlvbmFsTnVtYmVySW5kaWNhdG9yXCI6IFwiVHJ1ZVwiLCBcImludGVyYWN0aXZlSW5kaWNhdG9yXCI6IFwiRmFsc2VcIixcbiAgICAgICAgICAgICAgICBcImhvc3RlZEluZGljYXRvclwiOiBcIkZhbHNlXCIsIFwicHJvdmlkZXJcIjogXCJCU05MXCIsIFwic2hvcnRDb2RlXCI6IFwiMTExMVwiLCBcInJlcGx5VG9cIjogXCJETUFBUFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICBcImF0dHJpYkRhdGFcIjogW3sgXCJuYW1lXCI6IFwiYWRtaW5EYXRhMVwiLCBcInZhbHVlXCI6IDEyMzQ1NjcgfSwgeyBcIm5hbWVcIjogXCJjb250cmFjdG9yTmFtZVwiLCBcInZhbHVlXCI6IFwiY29udHJhY3RvciBuYW1lXCIgfV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICB2YXIgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IGhlYWRlcnMgfSk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHNtc1VSTCwgSlNPTi5zdHJpbmdpZnkoc21zTWVzc2FnZSksIG9wdGlvbnMpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VHJ1Y2tGZWVkKHRlY2hJZHM6IGFueSwgbWdySWQ6IGFueSkge1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG5cbiAgICAgIHRoaXMuc29ja2V0ID0gaW8uY29ubmVjdCh0aGlzLnNvY2tldFVSTCxcbiAgICAgICAge1xuICAgICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgICByZWNvbm5lY3Rpb246IHRydWUsXG4gICAgICAgICAgcmVjb25uZWN0aW9uRGVsYXk6IDEwMDAsXG4gICAgICAgICAgcmVjb25uZWN0aW9uRGVsYXlNYXg6IDUwMDAsXG4gICAgICAgICAgcmVjb25uZWN0aW9uQXR0ZW1wdHM6IDk5OTk5XG4gICAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNvY2tldC5lbWl0KCdqb2luJywgeyBtZ3JJZDogbWdySWQsIGF0dHVJZHM6IHRlY2hJZHMgfSk7XG5cbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdtZXNzYWdlJywgKGRhdGEpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG4gIC8vR2V0IFJ1bGUgZGVzaWduZWQgYmFzZWQgb24gdGVjaHR5cGUuXG4gIGdldFJ1bGVzKGRpc3BhdGNoVHlwZSkge1xuICAgIHZhciBnZXRSdWxlc1VybCA9IHRoaXMuaG9zdCArIFwiRmV0Y2hSdWxlXCI7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGdldFJ1bGVzVXJsLCB7XG4gICAgICBcImRpc3BhdGNoVHlwZVwiOiBkaXNwYXRjaFR5cGVcbiAgICB9KTtcbiAgfVxuXG4gIHN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2Uoa2V5LCBvYmplY3RUb1N0b3JlKVxuICB7XG4gICAgLy8gcmV0dXJuICBpZiB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGNvbXBsZXRlIHN0b3JhZ2UgdXNlIHRoZSBjbGVhcigpIG1ldGhvZCwgbGlrZSBsb2NhbFN0b3JhZ2UuY2xlYXIoKVxuICAgIC8vIENoZWNrIGlmIHRoZSBzZXNzaW9uU3RvcmFnZSBvYmplY3QgZXhpc3RzXG4gICBpZihzZXNzaW9uU3RvcmFnZSlcbiAgICB7XG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9TdG9yZSkpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3JlRGF0YUluTG9jYWxTdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShvYmplY3RUb1N0b3JlKSk7XG4gIH1cblxuICByZXRyaWV2ZURhdGFGcm9tTG9jYWxTdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgICAgdmFyIHJlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICBpZihyZXN1bHQhPW51bGwpXG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2Uoa2V5KVxuICB7XG4gICAgaWYoc2Vzc2lvblN0b3JhZ2UpXG4gICAge1xuICAgICAgdmFyIHJlc3VsdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgIGlmKHJlc3VsdCE9bnVsbClcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=