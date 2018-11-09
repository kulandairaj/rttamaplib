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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcnR0YW1hcGxpYi8iLCJzb3VyY2VzIjpbImxpYi9ydHRhbWFwbGliLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLElBQUksRUFBWSxjQUFjLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxVQUFVLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLDZCQUE2QixDQUFDO0FBQ3JDLE9BQU8sS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7OztBQU92QyxNQUFNOzs7O0lBUUosWUFBb0IsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07d0JBTm5CLEtBQUs7dUJBQ04sSUFBSTtvQkFDQyxJQUFJO3NCQUNMLElBQUk7eUJBQ0UsSUFBSTtRQUd0QixJQUFJLENBQUMsSUFBSSxHQUFHLDJDQUEyQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsbUNBQW1DLENBQUM7S0FDdEQ7Ozs7O0lBRUQsc0JBQXNCLENBQUMsUUFBUTs7UUFDN0IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7UUFDMUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBYSxFQUFFLEVBQUU7WUFDL0UsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbkIsQ0FBQyxDQUFDO0tBQ0o7Ozs7O0lBRUQsaUJBQWlCLENBQUMsTUFBTTs7UUFDdEIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLFlBQVksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUNqQyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO1FBQ2pELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2xDLFFBQVEsRUFBRSxFQUFFO1lBQ1osY0FBYyxFQUFFLFlBQVk7U0FDN0IsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQWEsRUFBRSxFQUFFO1lBQ3BDLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ25CLENBQUMsQ0FBQztLQUNKOzs7Ozs7OztJQUVELGVBQWUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxZQUFZOztRQUMvQyxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDdkIsYUFBYSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBQ3hDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUM7UUFDbkQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbEMsS0FBSyxFQUFFLEdBQUc7WUFDVixPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLGNBQWMsRUFBRSxhQUFhO1NBQzlCLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFhLEVBQUUsRUFBRTtZQUNwQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNuQixDQUFDLENBQUM7S0FDSjs7Ozs7SUFFRCxtQkFBbUIsQ0FBQyxNQUFNOztRQUN4QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLGtCQUFrQixHQUFHLE1BQU0sQ0FBQztRQUMzRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQWEsRUFBRSxFQUFFO1lBQy9ELE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ25CLENBQUMsQ0FBQztLQUNKOzs7OztJQUVELG1CQUFtQixDQUFDLE1BQU07O1FBQ3hCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQXFCLEdBQUcsTUFBTSxDQUFDO1FBQzlELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBYSxFQUFFLEVBQUU7WUFDL0QsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbkIsQ0FBQyxDQUFDO0tBQ0o7Ozs7OztJQUVELGdCQUFnQixDQUFDLFlBQVksRUFBRSxVQUFVOztRQUN2QyxJQUFJLFFBQVEsR0FBRywyREFBMkQsR0FBRyxZQUFZLEdBQUcsUUFBUSxHQUFHLFVBQVUsR0FBRyxpR0FBaUcsQ0FBQTtRQUNyTixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQWEsRUFBRSxFQUFFO1lBQ2hFLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3JCLENBQUMsQ0FBQztLQUNKOzs7OztJQUVELGVBQWUsQ0FBQyxVQUFpQjs7UUFDL0IsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDOztRQUN0QixJQUFJLFFBQVEsQ0FBQzs7UUFDYixJQUFJLFdBQVcsQ0FBQztRQUNoQixVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDMUIsUUFBUSxHQUFHLG9EQUFvRCxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsdUVBQXVFLENBQUE7WUFDbE8sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3JDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7U0FDL0IsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxZQUFZLENBQUM7S0FDckI7Ozs7OztJQUVELG1CQUFtQixDQUFDLFFBQVEsRUFBQyxTQUFTOztRQUNwQyxJQUFJLFFBQVEsR0FBRyxvSUFBb0ksQ0FBQzs7UUFFcEosSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQztRQUFBLENBQUM7UUFDekUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUNsQzs7Ozs7Ozs7OztJQUVELFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7O1FBQzNELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDOztRQUMzQyxJQUFJLFlBQVksR0FBRztZQUNqQixPQUFPLEVBQUU7Z0JBQ1AsZUFBZSxFQUFFLENBQUM7d0JBQ2hCLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFO3dCQUM5RSxvQkFBb0IsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDO3dCQUMxQyxXQUFXLEVBQUU7NEJBQ1gsU0FBUyxFQUFFLEVBQUUsR0FBRyxPQUFPLEdBQUcsRUFBRTs0QkFDNUIsU0FBUyxFQUFFLEVBQUUsR0FBRyxJQUFJLEdBQUcsRUFBRTs0QkFDekIsU0FBUyxFQUFFO2dDQUNULElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsR0FBRyxNQUFNLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEdBQUcsT0FBTyxHQUFHLEVBQUUsRUFBRSxDQUFDO2dDQUNsRSxJQUFJLEVBQUUsRUFBRTtnQ0FDUixLQUFLLEVBQUUsRUFBRTtnQ0FDVCxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsOEJBQThCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7Z0NBQ2hHLFNBQVMsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7NkJBQzdCO3lCQUNGO3FCQUNGLENBQUM7Z0JBQ0YsWUFBWSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRyxPQUFPLEVBQUU7b0JBQ3ZELEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsK0JBQStCLEVBQUU7b0JBQy9ELEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQzthQUNwRDtTQUNGLENBQUE7O1FBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDOztRQUNsRSxJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBYSxFQUFFLEVBQUU7WUFDdEcsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbkIsQ0FBQyxDQUFDO0tBQ0o7Ozs7OztJQUVELE9BQU8sQ0FBQyxRQUFRLEVBQUUsV0FBVzs7UUFDM0IsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7O1FBQ3pDLElBQUksVUFBVSxHQUFHO1lBQ2YsT0FBTyxFQUFFO2dCQUNQLGVBQWUsRUFBRSxDQUFDO3dCQUNoQixRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxtQ0FBbUMsRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFO3dCQUM5RyxvQkFBb0IsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO3dCQUN4QyxTQUFTLEVBQUU7NEJBQ1QsU0FBUyxFQUFFO2dDQUNULGFBQWEsRUFBRTtvQ0FDYixXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU07O29DQUV2RCxhQUFhLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEdBQUcsUUFBUSxHQUFHLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEdBQUcsV0FBVyxHQUFHLEVBQUU7b0NBQ2pHLGNBQWMsRUFBRSxtQ0FBbUMsRUFBRSw4QkFBOEIsRUFBRSxNQUFNLEVBQUUsc0JBQXNCLEVBQUUsT0FBTztvQ0FDNUgsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTztpQ0FDeEY7NkJBQ0Y7eUJBQ0Y7cUJBQ0YsQ0FBQztnQkFDRixZQUFZLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxDQUFDO2FBQ3JIO1NBQ0YsQ0FBQTs7UUFFRCxJQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUM7O1FBQ2xFLElBQUksT0FBTyxHQUFHLElBQUksY0FBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDdkQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFhLEVBQUUsRUFBRTtZQUNwRyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNuQixDQUFDLENBQUM7S0FDSjs7Ozs7O0lBRUQsWUFBWSxDQUFDLE9BQVksRUFBRSxLQUFVOztRQUNuQyxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUUzQyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFDckM7Z0JBQ0UsTUFBTSxFQUFFLElBQUk7Z0JBQ1osWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLGlCQUFpQixFQUFFLElBQUk7Z0JBQ3ZCLG9CQUFvQixFQUFFLElBQUk7Z0JBQzFCLG9CQUFvQixFQUFFLEtBQUs7YUFDNUIsQ0FBQyxDQUFDO1lBRUwsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUU3RCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDakMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNyQixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7UUFDSCxPQUFPLFVBQVUsQ0FBQztLQUNuQjs7Ozs7SUFFRCxRQUFRLENBQUMsWUFBWTs7UUFDbkIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUM7UUFDMUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDakMsY0FBYyxFQUFFLFlBQVk7U0FDN0IsQ0FBQyxDQUFDO0tBQ0o7Ozs7OztJQUVELHlCQUF5QixDQUFDLEdBQUcsRUFBRSxhQUFhOzs7UUFJM0MsSUFBRyxjQUFjLEVBQ2hCO1lBQ0UsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1NBQzVEO0tBQ0Y7Ozs7OztJQUVELHVCQUF1QixDQUFDLEdBQUcsRUFBRSxhQUFhO1FBRXRDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztLQUM1RDs7Ozs7O0lBRUQsNEJBQTRCLENBQUMsR0FBRyxFQUFFLGFBQWE7O1FBRTNDLElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBRyxNQUFNLElBQUUsSUFBSTtZQUNiLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLE9BQU8sTUFBTSxDQUFDO0tBQ2pCOzs7OztJQUVELDhCQUE4QixDQUFDLEdBQUc7UUFFaEMsSUFBRyxjQUFjLEVBQ2pCOztZQUNFLElBQUksTUFBTSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekMsSUFBRyxNQUFNLElBQUUsSUFBSTtnQkFDYixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixPQUFPLE1BQU0sQ0FBQztTQUNmO2FBRUQ7WUFDRSxPQUFPLElBQUksQ0FBQztTQUNiO0tBQ0Y7OztZQXZORixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFWUSxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwLCBSZXNwb25zZSwgUmVxdWVzdE9wdGlvbnMsIEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaWJlciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvdG9Qcm9taXNlJztcclxuaW1wb3J0ICogYXMgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IFRydWNrRGlyZWN0aW9uRGV0YWlscyB9IGZyb20gJy4vbW9kZWxzL3RydWNrZGV0YWlscyc7XHJcbmltcG9ydCB7IGZvckVhY2ggfSBmcm9tICdAYW5ndWxhci9yb3V0ZXIvc3JjL3V0aWxzL2NvbGxlY3Rpb24nO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgUnR0YW1hcGxpYlNlcnZpY2Uge1xyXG5cclxuICBtYXBSZWFkeSA9IGZhbHNlO1xyXG4gIHNob3dOYXYgPSB0cnVlO1xyXG4gIGhvc3Q6IHN0cmluZyA9IG51bGw7XHJcbiAgc29ja2V0OiBhbnkgPSBudWxsO1xyXG4gIHNvY2tldFVSTDogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XHJcbiAgICB0aGlzLmhvc3QgPSBcImh0dHBzOi8vemxkMDQwOTAudmNpLmF0dC5jb206ODQ0My9SQVBUT1IvXCI7XHJcbiAgICB0aGlzLnNvY2tldFVSTCA9IFwiaHR0cHM6Ly96bGQwNDA5MC52Y2kuYXR0LmNvbTozMDA3XCI7XHJcbiAgfVxyXG5cclxuICBjaGVja1VzZXJIYXNQZXJtaXNzaW9uKHVzZXJOYW1lKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHZhciB1c2Vyc0xpc3RVcmwgPSB0aGlzLmhvc3QgKyBcImF1dGh1c2VyXCI7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXNlcnNMaXN0VXJsLCB1c2VyTmFtZSkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWFwUHVzaFBpbkRhdGEoYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHZhciBzdXBlcnZpc29ySWQgPSBbXTtcclxuICAgIHN1cGVydmlzb3JJZCA9IGF0dFVJRC5zcGxpdCgnLCcpO1xyXG4gICAgdmFyIHVzZXJzTGlzdFVybCA9IHRoaXMuaG9zdCArICdUZWNoRGV0YWlsRmV0Y2gnO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVzZXJzTGlzdFVybCwge1xyXG4gICAgICBcImF0dHVJZFwiOiBcIlwiLFxyXG4gICAgICBcInN1cGVydmlzb3JJZFwiOiBzdXBlcnZpc29ySWRcclxuICAgIH0pLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZpbmRUcnVja05lYXJCeShsYXQsIGxvbmcsIGRpc3RhbmNlLCBzdXBlcnZpc29ySWQpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgdmFyIHN1cGVydmlzb3JJZHMgPSBbXTtcclxuICAgIHN1cGVydmlzb3JJZHMgPSBzdXBlcnZpc29ySWQuc3BsaXQoJywnKTtcclxuICAgIGNvbnN0IGZpbmRUcnVja1VSTCA9IHRoaXMuaG9zdCArICdGaW5kVHJ1Y2tOZWFyQnknO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGZpbmRUcnVja1VSTCwge1xyXG4gICAgICAnbGF0JzogbGF0LFxyXG4gICAgICAnbGxvbmcnOiBsb25nLFxyXG4gICAgICAncmFkaXVzJzogZGlzdGFuY2UsXHJcbiAgICAgICdzdXBlcnZpc29ySWQnOiBzdXBlcnZpc29ySWRzXHJcbiAgICB9KS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXZWJQaG9uZVVzZXJEYXRhKGF0dFVJRCk6IFByb21pc2U8YW55PiB7XHJcbiAgICB2YXIgbGRhcFVSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvZ2V0dGVjaG5pY2lhbnMvXCIgKyBhdHRVSUQ7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChsZGFwVVJMKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXZWJQaG9uZVVzZXJJbmZvKGF0dFVJRCk6IFByb21pc2U8YW55PiB7XHJcbiAgICB2YXIgbGRhcFVSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvZ2V0dGVjaG5pY2lhbmluZm8vXCIgKyBhdHRVSUQ7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChsZGFwVVJMKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBHZXROZXh0Um91dGVEYXRhKGZyb21BdHRpdHVkZSwgdG9BdHRpdHVkZSk6IFByb21pc2U8YW55PiB7XHJcbiAgICB2YXIgcm91dGVVcmwgPSBcImh0dHBzOi8vZGV2LnZpcnR1YWxlYXJ0aC5uZXQvUkVTVC9WMS9Sb3V0ZXMvRHJpdmluZz93cC4wPVwiICsgZnJvbUF0dGl0dWRlICsgXCImd3AuMT1cIiArIHRvQXR0aXR1ZGUgKyBcIiZyb3V0ZUF0dHJpYnV0ZXM9cm91dGVQYXRoJmtleT1BbnhwUy0zMmtZdkJ6alE1cGJaY25EejE3b0tCYTFCcTJIUndIQU5vTnBIczNaMjVORHZxYmhjcUpaeURvWU1qXCJcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHJvdXRlVXJsKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHJldHVybiByZXNbXCJfYm9keVwiXTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgR2V0Um91dGVNYXBEYXRhKGRpckRldGFpbHM6IGFueVtdKTogYW55W10ge1xyXG4gICAgbGV0IGNvbWJpbmVkVXJscyA9IFtdO1xyXG4gICAgbGV0IHJvdXRlVXJsO1xyXG4gICAgdmFyIG5ld1JvdXRlVXJsO1xyXG4gICAgZGlyRGV0YWlscy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIHJvdXRlVXJsID0gXCJodHRwczovL2Rldi52aXJ0dWFsZWFydGgubmV0L1JFU1QvVjEvUm91dGVzLz93cC4wPVwiICsgaXRlbS5zb3VyY2VMYXQgKyBcIixcIiArIGl0ZW0uc291cmNlTG9uZyArIFwiJndwLjE9XCIgKyBpdGVtLmRlc3RMYXQgKyBcIixcIiArIGl0ZW0uZGVzdExvbmcgKyBcIiZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiXHJcbiAgICAgIG5ld1JvdXRlVXJsID0gdGhpcy5odHRwLmdldChyb3V0ZVVybClcclxuICAgICAgY29tYmluZWRVcmxzLnB1c2gobmV3Um91dGVVcmwpXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBjb21iaW5lZFVybHM7XHJcbiAgfVxyXG5cclxuICBnZXRBZGRyZXNzQnlMYXRMb25nKGxhdGl0dWRlLGxvbmdpdHVkZSkgeyAgXHJcbiAgICB2YXIgYmluZ0hvc3QgPSBcImh0dHBzOi8vZGV2LnZpcnR1YWxlYXJ0aC5uZXQvUkVTVC92MS9Mb2NhdGlvbnMvTGF0TG9uZz9vPWpzb24ma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIjtcclxuICBcclxuICAgIHZhciBnZXRCaW5nVXJsID0gYmluZ0hvc3QucmVwbGFjZShcIkxhdExvbmdcIixsYXRpdHVkZSArIFwiLFwiICsgbG9uZ2l0dWRlKTs7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChnZXRCaW5nVXJsKTtcclxuICB9XHJcblxyXG4gIHNlbmRFbWFpbChmcm9tRW1haWwsIHRvRW1haWwsIGZyb21OYW1lLCB0b05hbWUsIHN1YmplY3QsIGJvZHkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgdmFyIHNtc1VSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvc2VuZGVtYWlsXCI7XHJcbiAgICB2YXIgZW1haWxNZXNzYWdlID0ge1xyXG4gICAgICBcImV2ZW50XCI6IHtcclxuICAgICAgICBcInJlY2lwaWVudERhdGFcIjogW3tcclxuICAgICAgICAgIFwiaGVhZGVyXCI6IHsgXCJzb3VyY2VcIjogXCJLZXBsZXJcIiwgXCJzY2VuYXJpb05hbWVcIjogXCJcIiwgXCJ0cmFuc2FjdGlvbklkXCI6IFwiNTExMTFcIiB9LFxyXG4gICAgICAgICAgXCJub3RpZmljYXRpb25PcHRpb25cIjogW3sgXCJtb2NcIjogXCJlbWFpbFwiIH1dLFxyXG4gICAgICAgICAgXCJlbWFpbERhdGFcIjoge1xyXG4gICAgICAgICAgICBcInN1YmplY3RcIjogXCJcIiArIHN1YmplY3QgKyBcIlwiLFxyXG4gICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJcIiArIGJvZHkgKyBcIlwiLFxyXG4gICAgICAgICAgICBcImFkZHJlc3NcIjoge1xyXG4gICAgICAgICAgICAgIFwidG9cIjogW3sgXCJuYW1lXCI6IFwiXCIgKyB0b05hbWUgKyBcIlwiLCBcImFkZHJlc3NcIjogXCJcIiArIHRvRW1haWwgKyBcIlwiIH1dLFxyXG4gICAgICAgICAgICAgIFwiY2NcIjogW10sXHJcbiAgICAgICAgICAgICAgXCJiY2NcIjogW10sXHJcbiAgICAgICAgICAgICAgXCJmcm9tXCI6IHsgXCJuYW1lXCI6IFwiQVQmVCBFbnRlcnByaXNlIE5vdGlmaWNhdGlvblwiLCBcImFkZHJlc3NcIjogXCJcIiB9LCBcImJvdW5jZVRvXCI6IHsgXCJhZGRyZXNzXCI6IFwiXCIgfSxcclxuICAgICAgICAgICAgICBcInJlcGx5VG9cIjogeyBcImFkZHJlc3NcIjogXCJcIiB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XSxcclxuICAgICAgICBcImF0dHJpYkRhdGFcIjogW3sgXCJuYW1lXCI6IFwic3ViamVjdFwiLCBcInZhbHVlXCI6ICBzdWJqZWN0IH0sXHJcbiAgICAgICAgeyBcIm5hbWVcIjogXCJtZXNzYWdlXCIsIFwidmFsdWVcIjogXCJUaGlzIGlzIGZpcnN0IGNhbXVuZGEgcHJvY2Vzc1wiIH0sXHJcbiAgICAgICAgeyBcIm5hbWVcIjogXCJjb250cmFjdG9yTmFtZVwiLCBcInZhbHVlXCI6IFwiQWpheSBBcGF0XCIgfV1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xyXG4gICAgdmFyIG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoeyBoZWFkZXJzOiBoZWFkZXJzIH0pO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHNtc1VSTCwgSlNPTi5zdHJpbmdpZnkoZW1haWxNZXNzYWdlKSwgb3B0aW9ucykudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VuZFNNUyh0b051bWJlciwgYm9keU1lc3NhZ2UpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgdmFyIHNtc1VSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvc2VuZHNtc1wiO1xyXG4gICAgdmFyIHNtc01lc3NhZ2UgPSB7XHJcbiAgICAgIFwiZXZlbnRcIjoge1xyXG4gICAgICAgIFwicmVjaXBpZW50RGF0YVwiOiBbe1xyXG4gICAgICAgICAgXCJoZWFkZXJcIjogeyBcInNvdXJjZVwiOiBcIktlcGxlclwiLCBcInNjZW5hcmlvTmFtZVwiOiBcIiBGaXJzdE5ldEluaXRpYWxSZWdpc3RyYXRpaW9uVXNlclwiLCBcInRyYW5zYWN0aW9uSWRcIjogXCIwMDA0XCIgfSxcclxuICAgICAgICAgIFwibm90aWZpY2F0aW9uT3B0aW9uXCI6IFt7IFwibW9jXCI6IFwic21zXCIgfV0sXHJcbiAgICAgICAgICBcInNtc0RhdGFcIjoge1xyXG4gICAgICAgICAgICBcImRldGFpbHNcIjoge1xyXG4gICAgICAgICAgICAgIFwiY29udGFjdERhdGFcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJyZXF1ZXN0SWRcIjogXCIxMTExNlwiLCBcInN5c0lkXCI6IFwiQ0JcIiwgXCJjbGllbnRJZFwiOiBcIlJUVEFcIixcclxuICAgICAgICAgICAgICAgIC8vIFwicGhvbmVOdW1iZXJcIjogeyBcImFyZWFDb2RlXCI6IFwiXCIgKyB0b051bWJlci50b1N0cmluZygpLnN1YnN0cigwLCAzKSArIFwiXCIsIFwibnVtYmVyXCI6IFwiXCIgKyB0b051bWJlci50b1N0cmluZygpLnN1YnN0cigzLCAxMCkgKyBcIlwiIH0sIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keU1lc3NhZ2UgKyBcIlwiLFxyXG4gICAgICAgICAgICAgICAgXCJwaG9uZU51bWJlclwiOiB7IFwiYXJlYUNvZGVcIjogXCJcIiwgXCJudW1iZXJcIjogXCJcIiArIHRvTnVtYmVyICsgXCJcIiB9LCBcIm1lc3NhZ2VcIjogXCJcIiArIGJvZHlNZXNzYWdlICsgXCJcIixcclxuICAgICAgICAgICAgICAgIFwic2NlbmFyaW9OYW1lXCI6IFwiIEZpcnN0TmV0SW5pdGlhbFJlZ2lzdHJhdGlpb25Vc2VyXCIsIFwiaW50ZXJuYXRpb25hbE51bWJlckluZGljYXRvclwiOiBcIlRydWVcIiwgXCJpbnRlcmFjdGl2ZUluZGljYXRvclwiOiBcIkZhbHNlXCIsXHJcbiAgICAgICAgICAgICAgICBcImhvc3RlZEluZGljYXRvclwiOiBcIkZhbHNlXCIsIFwicHJvdmlkZXJcIjogXCJCU05MXCIsIFwic2hvcnRDb2RlXCI6IFwiMTExMVwiLCBcInJlcGx5VG9cIjogXCJETUFBUFwiXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgXCJhdHRyaWJEYXRhXCI6IFt7IFwibmFtZVwiOiBcImFkbWluRGF0YTFcIiwgXCJ2YWx1ZVwiOiAxMjM0NTY3IH0sIHsgXCJuYW1lXCI6IFwiY29udHJhY3Rvck5hbWVcIiwgXCJ2YWx1ZVwiOiBcImNvbnRyYWN0b3IgbmFtZVwiIH1dXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcclxuICAgIHZhciBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogaGVhZGVycyB9KTtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChzbXNVUkwsIEpTT04uc3RyaW5naWZ5KHNtc01lc3NhZ2UpLCBvcHRpb25zKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRUcnVja0ZlZWQodGVjaElkczogYW55LCBtZ3JJZDogYW55KSB7XHJcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xyXG5cclxuICAgICAgdGhpcy5zb2NrZXQgPSBpby5jb25uZWN0KHRoaXMuc29ja2V0VVJMLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNlY3VyZTogdHJ1ZSxcclxuICAgICAgICAgIHJlY29ubmVjdGlvbjogdHJ1ZSxcclxuICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5OiAxMDAwLFxyXG4gICAgICAgICAgcmVjb25uZWN0aW9uRGVsYXlNYXg6IDUwMDAsXHJcbiAgICAgICAgICByZWNvbm5lY3Rpb25BdHRlbXB0czogOTk5OTlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ2pvaW4nLCB7IG1ncklkOiBtZ3JJZCwgYXR0dUlkczogdGVjaElkcyB9KTtcclxuXHJcbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdtZXNzYWdlJywgKGRhdGEpID0+IHtcclxuICAgICAgICBvYnNlcnZlci5uZXh0KGRhdGEpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG9ic2VydmFibGU7XHJcbiAgfVxyXG4gIC8vR2V0IFJ1bGUgZGVzaWduZWQgYmFzZWQgb24gdGVjaHR5cGUuXHJcbiAgZ2V0UnVsZXMoZGlzcGF0Y2hUeXBlKSB7XHJcbiAgICB2YXIgZ2V0UnVsZXNVcmwgPSB0aGlzLmhvc3QgKyBcIkZldGNoUnVsZVwiO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGdldFJ1bGVzVXJsLCB7XHJcbiAgICAgIFwiZGlzcGF0Y2hUeXBlXCI6IGRpc3BhdGNoVHlwZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcclxuICB7XHJcbiAgICAvLyByZXR1cm4gIGlmIHlvdSB3YW50IHRvIHJlbW92ZSB0aGUgY29tcGxldGUgc3RvcmFnZSB1c2UgdGhlIGNsZWFyKCkgbWV0aG9kLCBsaWtlIGxvY2FsU3RvcmFnZS5jbGVhcigpXHJcbiAgICAvLyBDaGVjayBpZiB0aGUgc2Vzc2lvblN0b3JhZ2Ugb2JqZWN0IGV4aXN0c1xyXG4gICBpZihzZXNzaW9uU3RvcmFnZSlcclxuICAgIHtcclxuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KG9iamVjdFRvU3RvcmUpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0b3JlRGF0YUluTG9jYWxTdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcclxuICB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9TdG9yZSkpO1xyXG4gIH1cclxuXHJcbiAgcmV0cmlldmVEYXRhRnJvbUxvY2FsU3RvcmFnZShrZXksIG9iamVjdFRvU3RvcmUpXHJcbiAge1xyXG4gICAgICB2YXIgcmVzdWx0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuICAgICAgaWYocmVzdWx0IT1udWxsKVxyXG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlRGF0YUZyb21TZXNzaW9uU3RvcmFnZShrZXkpXHJcbiAge1xyXG4gICAgaWYoc2Vzc2lvblN0b3JhZ2UpXHJcbiAgICB7XHJcbiAgICAgIHZhciByZXN1bHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcbiAgICAgIGlmKHJlc3VsdCE9bnVsbClcclxuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIl19