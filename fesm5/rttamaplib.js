import { Injectable, NgModule, ViewContainerRef, Component, ViewChild, Input, Output, EventEmitter, defineInjectable, inject } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable, forkJoin } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { connect } from 'socket.io-client';
import 'ng2-opd-popup';
import { setTimeout } from 'timers';
import { utc } from 'moment-timezone';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
            _this.socket = connect(_this.socketURL, {
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
    /** @nocollapse */ RttamaplibService.ngInjectableDef = defineInjectable({ factory: function RttamaplibService_Factory() { return new RttamaplibService(inject(Http)); }, token: RttamaplibService, providedIn: "root" });
    return RttamaplibService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var TruckDetails = /** @class */ (function () {
    function TruckDetails() {
    }
    return TruckDetails;
}());
var TruckDirectionDetails = /** @class */ (function () {
    function TruckDirectionDetails() {
    }
    return TruckDirectionDetails;
}());
var Ticket = /** @class */ (function () {
    function Ticket() {
    }
    return Ticket;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var RttamaplibComponent = /** @class */ (function () {
    function RttamaplibComponent(mapService, 
    //private router: Router,
    //public toastr: ToastsManager,
    //private router: Router, 
    //public toastr: ToastsManager, 
    vRef) {
        this.mapService = mapService;
        this.truckItems = [];
        this.truckList = [];
        this.mapview = 'road';
        this.loading = false;
        this.myMap = document.querySelector('#myMap');
        this.ready = false;
        this.socket = null;
        this.results = [];
        this.lastZoomLevel = 10;
        this.reportingTechnicianDetails = [];
        this.reportingTechnicians = [];
        this.isTrafficEnabled = 0;
        this.loggedUserId = '';
        this.managerUserId = '';
        this.cookieATTUID = '';
        this.feet = 0.000189394;
        this.IsAreaManager = false;
        this.IsVP = false;
        this.fieldManagers = [];
        // Weather tile url from Iowa Environmental Mesonet (IEM): http://mesonet.agron.iastate.edu/ogc/
        this.urlTemplate = 'http://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-{timestamp}/{zoom}/{x}/{y}.png';
        // The time stamps values for the IEM service for the last 50 minutes broken up into 5 minute increments.
        this.timestamps = ['900913-m50m', '900913-m45m', '900913-m40m', '900913-m35m', '900913-m30m', '900913-m25m', '900913-m20m', '900913-m15m', '900913-m10m', '900913-m05m', '900913'];
        this.thresholdValue = 0;
        this.animationTruckList = [];
        this.dropdownSettings = {};
        this.selectedFieldMgr = [];
        this.managerIds = '';
        this.radiousValue = '';
        this.foundTruck = false;
        this.loggedInUserTimeZone = 'CST';
        this.isMapLoaded = true;
        this.WorkFlowAdmin = false;
        this.SystemAdmin = false;
        this.RuleAdmin = false;
        this.RegularUser = false;
        this.Reporting = false;
        this.NotificationAdmin = false;
        this.ticketList = [];
        this.ticketClick = new EventEmitter();
        this.ticketData = [];
        //this.toastr.setRootViewContainerRef(vRef);
        this.loading = true;
        this.cookieATTUID = "kr5226"; //this.utils.getCookieUserId();
        this.reportingTechnicians = [];
        this.reportingTechnicians.push(this.cookieATTUID);
        this.travalDuration = 5000;
        // // to load already addred watch list
        if (sessionStorage.getItem('TruckWatchList') != null) {
            this.truckList = JSON.parse(sessionStorage.getItem('TruckWatchList'));
        }
    }
    /**
     * @return {?}
     */
    RttamaplibComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        //$('#loading').hide();
        this.loggedUserId = this.managerUserId = "kr5226"; //this.utils.getCookieUserId();
        this.loading = false;
        //this.checkUserLevel(false);
        if (document.readyState != 'complete') {
            document.onreadystatechange = function () {
                if (document.readyState === 'complete') {
                    _this.mapview = 'road';
                    _this.loadMapView('road');
                }
                else {
                    _this.ngOnInit();
                }
            };
        }
        else {
            if (document.readyState === 'complete') {
                this.mapview = 'road';
                this.loadMapView('road');
            }
        }
    };
    /**
     * @param {?} IsShowTruck
     * @return {?}
     */
    RttamaplibComponent.prototype.checkUserLevel = /**
     * @param {?} IsShowTruck
     * @return {?}
     */
    function (IsShowTruck) {
        var _this = this;
        this.fieldManagers = [];
        /** @type {?} */
        var mgr = { id: this.managerUserId, itemName: this.managerUserId };
        this.fieldManagers.push(mgr);
        // Comment below line when you give for production build 9008
        this.IsVP = true;
        // Check is logged in user is a field manager area manager/vp
        this.mapService.getWebPhoneUserInfo(this.managerUserId).then(function (data) {
            if (!jQuery.isEmptyObject(data)) {
                /** @type {?} */
                var managers = 'f';
                /** @type {?} */
                var amanagers = 'e';
                /** @type {?} */
                var vp = 'a,b,c,d';
                if (data.level.indexOf(managers) > -1) {
                    // this.IsVP = IsShowTruck;
                    // this.IsVP = IsShowTruck;
                    _this.IsAreaManager = false;
                    _this.managerIds = _this.fieldManagers.map(function (item) {
                        return item['id'];
                    }).toString();
                    // this.getTechDetailsForManagers();
                    // this.LoadTrucks(this.map, null, null, null, false);
                    setTimeout(function () {
                        //$('#loading').hide()
                    }, 3000);
                }
                else if (data.level.indexOf(amanagers) > -1) {
                    _this.fieldManagers = [];
                    /** @type {?} */
                    var areaMgr = {
                        id: _this.managerUserId,
                        itemName: data.name + ' (' + _this.managerUserId + ')'
                    };
                    _this.fieldManagers.unshift(areaMgr);
                    _this.getListofFieldManagers();
                    //$('#loading').hide();
                }
                else if (data.level.indexOf(vp) > -1) {
                    _this.IsVP = true;
                    _this.IsAreaManager = false;
                    //$('#loading').hide();
                }
            }
        }).catch(function (error) {
            console.log(error);
            //this.toastr.error('Error while connecting web phone!', 'Error')
            //$('#loading').hide();
        });
    };
    /**
     * @return {?}
     */
    RttamaplibComponent.prototype.getListofFieldManagers = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.mapService.getWebPhoneUserData(this.managerUserId).then(function (data) {
            if (data.TechnicianDetails.length > 0) {
                for (var tech in data.TechnicianDetails) {
                    /** @type {?} */
                    var mgr = {
                        id: data.TechnicianDetails[tech].attuid,
                        itemName: data.TechnicianDetails[tech].name + ' (' + data.TechnicianDetails[tech].attuid + ')'
                    };
                    _this.fieldManagers.push(mgr);
                }
                _this.IsVP = false;
                _this.IsAreaManager = true;
            }
            else {
                _this.IsVP = true;
                _this.IsAreaManager = false;
                //this.toastr.warning('Do not have any direct reports!', 'Manager');
            }
        }).catch(function (error) {
            console.log(error);
            //this.toastr.error('Error while connecting web phone!', 'Error');
            //$('#loading').hide();
        });
    };
    /**
     * @return {?}
     */
    RttamaplibComponent.prototype.getTechDetailsForManagers = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.managerIds != null) {
            this.mapService.getWebPhoneUserData(this.managerIds).then(function (data) {
                if (data.TechnicianDetails.length > 0) {
                    for (var tech in data.TechnicianDetails) {
                        _this.reportingTechnicians.push(data.TechnicianDetails[tech].attuid);
                        _this.reportingTechnicianDetails.push({
                            attuid: data.TechnicianDetails[tech].attuid,
                            name: data.TechnicianDetails[tech].name,
                            email: data.TechnicianDetails[tech].email,
                            phone: data.TechnicianDetails[tech].phone
                        });
                    }
                }
            });
        }
    };
    /**
     * @param {?} type
     * @return {?}
     */
    RttamaplibComponent.prototype.loadMapView = /**
     * @param {?} type
     * @return {?}
     */
    function (type) {
        /** @type {?} */
        var that = this;
        this.truckItems = [];
        /** @type {?} */
        var location = new Microsoft.Maps.Location(40.0583, -74.4057);
        if (this.lastLocation) {
            location = new Microsoft.Maps.Location(this.lastLocation.latitude, this.lastLocation.longitude);
        }
        this.map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
            credentials: 'AnxpS-32kYvBzjQ5pbZcnDz17oKBa1Bq2HRwHANoNpHs3Z25NDvqbhcqJZyDoYMj',
            center: location,
            mapTypeId: type == 'satellite' ? Microsoft.Maps.MapTypeId.aerial : Microsoft.Maps.MapTypeId.road,
            zoom: 12,
            liteMode: true,
            //navigationBarOrientation: Microsoft.Maps.NavigationBarOrientation.horizontal,
            enableClickableLogo: false,
            showLogo: false,
            showTermsLink: false,
            showMapTypeSelector: false,
            showTrafficButton: true,
            enableSearchLogo: false,
            showCopyright: false
        });
        //Load the Animation Module
        //Microsoft.Maps.loadModule("AnimationModule");
        Microsoft.Maps.loadModule('AnimationModule', function () {
        });
        //Store some metadata with the pushpin
        this.infobox = new Microsoft.Maps.Infobox(this.map.getCenter(), {
            visible: false
        });
        this.infobox.setMap(this.map);
        // Create a layer for rendering the path.
        this.pathLayer = new Microsoft.Maps.Layer();
        this.map.layers.insert(this.pathLayer);
        // Load the Spatial Math module.
        Microsoft.Maps.loadModule('Microsoft.Maps.SpatialMath', function () { });
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () { });
        // Create a layer to load pushpins to.
        this.dataLayer = new Microsoft.Maps.EntityCollection();
        // Add a right click event to the map
        Microsoft.Maps.Events.addHandler(this.map, 'rightclick', function (e) {
            /** @type {?} */
            var x1 = e.location;
            that.clickedLat = x1.latitude;
            that.clickedLong = x1.longitude;
            that.radiousValue = '';
            jQuery('#myRadiusModal').modal('show');
        });
        //load ticket details
        this.addTicketData(this.map, this.directionsManager);
    };
    /**
     * @param {?} maps
     * @param {?} lt
     * @param {?} lg
     * @param {?} rd
     * @param {?} isTruckSearch
     * @return {?}
     */
    RttamaplibComponent.prototype.LoadTrucks = /**
     * @param {?} maps
     * @param {?} lt
     * @param {?} lg
     * @param {?} rd
     * @param {?} isTruckSearch
     * @return {?}
     */
    function (maps, lt, lg, rd, isTruckSearch) {
        var _this = this;
        /** @type {?} */
        var that = this;
        this.truckItems = [];
        if (!isTruckSearch) {
            this.mapService.getMapPushPinData(this.managerIds).then(function (data) {
                if (!jQuery.isEmptyObject(data) && data.techData.length > 0) {
                    /** @type {?} */
                    var techData = data.techData;
                    /** @type {?} */
                    var dirDetails = [];
                    techData.forEach(function (item) {
                        if (item.long == undefined) {
                            item.long = item.longg;
                        }
                        if (item.techID != undefined) {
                            /** @type {?} */
                            var dirDetail = new TruckDirectionDetails();
                            dirDetail.techId = item.techID;
                            dirDetail.sourceLat = item.lat;
                            dirDetail.sourceLong = item.long;
                            dirDetail.destLat = item.wrLat;
                            dirDetail.destLong = item.wrLong;
                            dirDetails.push(dirDetail);
                            _this.pushNewTruck(maps, item);
                        }
                    });
                    /** @type {?} */
                    var routeMapUrls = [];
                    routeMapUrls = _this.mapService.GetRouteMapData(dirDetails);
                    forkJoin(routeMapUrls).subscribe(function (results) {
                        for (var j = 0; j <= results.length - 1; j++) {
                            /** @type {?} */
                            var routeData = /** @type {?} */ (results[j]);
                            /** @type {?} */
                            var routedataJson = routeData.json();
                            if (routedataJson.resourceSets[0].resources[0].routeLegs[0].itineraryItems != null
                                && routedataJson.resourceSets[0].resources[0].routeLegs[0].itineraryItems.length > 0) {
                                /** @type {?} */
                                var nextSourceLat = routedataJson.resourceSets[0].resources[0].routeLegs[0].itineraryItems[1].maneuverPoint.coordinates[0];
                                /** @type {?} */
                                var nextSourceLong = routedataJson.resourceSets[0].resources[0].routeLegs[0].itineraryItems[1].maneuverPoint.coordinates[1];
                                dirDetails[j].nextRouteLat = nextSourceLat;
                                dirDetails[j].nextRouteLong = nextSourceLong;
                            }
                        }
                        /** @type {?} */
                        var listOfPins = maps.entities;
                        for (var i = 0; i < listOfPins.getLength(); i++) {
                            /** @type {?} */
                            var techId = listOfPins.get(i).metadata.ATTUID;
                            /** @type {?} */
                            var truckColor = listOfPins.get(i).metadata.truckCol.toLowerCase();
                            /** @type {?} */
                            var curPushPin = listOfPins.get(i);
                            /** @type {?} */
                            var currDirDetail = [];
                            currDirDetail = dirDetails.filter(function (element) {
                                if (element.techId === techId) {
                                    return element;
                                }
                            });
                            /** @type {?} */
                            var nextLocation;
                            if (currDirDetail.length > 0) {
                                nextLocation = new Microsoft.Maps.Location(currDirDetail[0].nextRouteLat, currDirDetail[0].nextRouteLong);
                            }
                            if (nextLocation != null && nextLocation != undefined) {
                                /** @type {?} */
                                var pinLocation = listOfPins.get(i).getLocation();
                                /** @type {?} */
                                var nextCoord = that.CalculateNextCoord(pinLocation, nextLocation);
                                /** @type {?} */
                                var bearing = that.calculateBearing(pinLocation, nextCoord);
                                /** @type {?} */
                                var truckUrl = _this.getTruckUrl(truckColor);
                                _this.createRotatedImagePushpin(curPushPin, truckUrl, bearing, function () { });
                            }
                        }
                        //$('#loading').hide();
                    }, function (err) {
                        //$('#loading').hide();
                    });
                    _this.connection = _this.mapService.getTruckFeed(_this.reportingTechnicians, _this.managerIds).subscribe(function (data) {
                        if (_this.reportingTechnicians.some(function (x) { return x.toLowerCase() == data.techID.toLowerCase(); })) {
                            console.log(data);
                            _this.pushNewTruck(maps, data);
                        }
                    }, function (err) {
                        console.log('Error while fetching trucks from Kafka Consumer. Errors-> ' + err.Error);
                    });
                }
            }).catch(function (error) {
                console.log(error);
                //this.toastr.error('Error while fetching data from API!', 'Error');
                //$('#loading').hide();
            });
        }
        else {
            /** @type {?} */
            var mtrs = Math.round(that.getMeters(rd));
            this.mapService.findTruckNearBy(lt, lg, mtrs, this.managerIds).then(function (data) {
                if (!jQuery.isEmptyObject(data) && data.techData.length > 0) {
                    /** @type {?} */
                    var techData = data.techData;
                    /** @type {?} */
                    var dirDetails_1 = [];
                    techData.forEach(function (item) {
                        if (item.long == undefined) {
                            item.long = item.longg;
                        }
                        if ((item.techID != undefined) && (dirDetails_1.some(function (x) { return x.techId == item.techID; }) == false)) {
                            /** @type {?} */
                            var dirDetail = new TruckDirectionDetails();
                            dirDetail.techId = item.techID;
                            dirDetail.sourceLat = item.lat;
                            dirDetail.sourceLong = item.long;
                            dirDetail.destLat = item.wrLat;
                            dirDetail.destLong = item.wrLong;
                            dirDetails_1.push(dirDetail);
                            _this.pushNewTruck(maps, item);
                            that.foundTruck = true;
                        }
                    });
                    /** @type {?} */
                    var routeMapUrls = [];
                    routeMapUrls = _this.mapService.GetRouteMapData(dirDetails_1);
                    forkJoin(routeMapUrls).subscribe(function (results) {
                        for (var j = 0; j <= results.length - 1; j++) {
                            /** @type {?} */
                            var routeData = /** @type {?} */ (results[j]);
                            /** @type {?} */
                            var routedataJson = routeData.json();
                            if (routedataJson.resourceSets[0].resources[0].routeLegs[0].itineraryItems != null
                                && routedataJson.resourceSets[0].resources[0].routeLegs[0].itineraryItems.length > 0) {
                                /** @type {?} */
                                var nextSourceLat = routedataJson.resourceSets[0].resources[0].routeLegs[0].itineraryItems[1].maneuverPoint.coordinates[0];
                                /** @type {?} */
                                var nextSourceLong = routedataJson.resourceSets[0].resources[0].routeLegs[0].itineraryItems[1].maneuverPoint.coordinates[1];
                                dirDetails_1[j].nextRouteLat = nextSourceLat;
                                dirDetails_1[j].nextRouteLong = nextSourceLong;
                            }
                        }
                        /** @type {?} */
                        var listOfPins = that.map.entities;
                        var _loop_1 = function (i) {
                            /** @type {?} */
                            var pushpin = listOfPins.get(i);
                            if (pushpin instanceof Microsoft.Maps.Pushpin) {
                                /** @type {?} */
                                var techId_1 = pushpin.metadata.ATTUID;
                                /** @type {?} */
                                var truckColor = pushpin.metadata.truckCol.toLowerCase();
                                currDirDetail = [];
                                currDirDetail = dirDetails_1.filter(function (element) {
                                    if (element.techId === techId_1) {
                                        return element;
                                    }
                                });
                                if (currDirDetail.length > 0) {
                                    nextLocation = new Microsoft.Maps.Location(currDirDetail[0].nextRouteLat, currDirDetail[0].nextRouteLong);
                                }
                                if (nextLocation != null && nextLocation != undefined) {
                                    pinLocation = listOfPins.get(i).getLocation();
                                    nextCoord = that.CalculateNextCoord(pinLocation, nextLocation);
                                    bearing = that.calculateBearing(pinLocation, nextCoord);
                                    truckUrl = _this.getTruckUrl(truckColor);
                                    _this.createRotatedImagePushpin(pushpin, truckUrl, bearing, function () { });
                                }
                            }
                        };
                        var currDirDetail, nextLocation, pinLocation, nextCoord, bearing, truckUrl;
                        for (var i = 0; i < listOfPins.getLength(); i++) {
                            _loop_1(i);
                        }
                        // Load the spatial math module
                        Microsoft.Maps.loadModule('Microsoft.Maps.SpatialMath', function () {
                            /** @type {?} */
                            var loc = new Microsoft.Maps.Location(that.clickedLat, that.clickedLong);
                            /** @type {?} */
                            var path = Microsoft.Maps.SpatialMath.getRegularPolygon(loc, rd, 36, Microsoft.Maps.SpatialMath.DistanceUnits.Miles);
                            /** @type {?} */
                            var poly = new Microsoft.Maps.Polygon(path);
                            that.map.entities.push(poly);
                            /** @type {?} */
                            var pin = new Microsoft.Maps.Pushpin(loc, {
                                icon: 'https://bingmapsisdk.blob.core.windows.net/isdksamples/defaultPushpin.png',
                                anchor: new Microsoft.Maps.Point(12, 39),
                                title: rd + ' mile(s) of radius',
                            });
                            /** @type {?} */
                            var metadata = {
                                Latitude: lt,
                                Longitude: lg,
                                radius: rd
                            };
                            Microsoft.Maps.Events.addHandler(pin, 'click', function (e) {
                                that.radiousValue = rd;
                                that.clickedLat = lt;
                                that.clickedLong = lg;
                                jQuery('#myRadiusModal').modal('show');
                            });
                            pin.metadata = metadata;
                            that.map.entities.push(pin);
                            that.dataLayer.push(pin);
                            // Center the map on the user's location.
                            that.map.setView({ center: loc, zoom: 8 });
                        });
                        //$('#loading').hide();
                    }, function (err) {
                        console.log(err);
                        //$('#loading').hide();
                    });
                    _this.connection = _this.mapService.getTruckFeed(_this.reportingTechnicians, _this.managerIds).subscribe(function (data) {
                        if (dirDetails_1.some(function (x) { return x.techId.toLocaleLowerCase() == data.techID.toLocaleLowerCase(); })) {
                            console.log(data);
                            _this.pushNewTruck(maps, data);
                        }
                    }, function (err) {
                        console.log('Error while fetching trucks from Kafka Consumer. Errors-> ' + err.Error);
                    });
                }
            }).catch(function (error) {
                console.log(error);
                //this.toastr.error('Error while fetching data from API!', 'Error');
                //$('#loading').hide();
            });
        }
    };
    /**
     * @param {?} color
     * @return {?}
     */
    RttamaplibComponent.prototype.getTruckUrl = /**
     * @param {?} color
     * @return {?}
     */
    function (color) {
        /** @type {?} */
        var truckUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAHkmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNy0xMi0xNFQxOTowODowMy0wODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTctMTItMTlUMTU6NDk6MDEtMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTctMTItMTlUMTU6NDk6MDEtMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YWRmM2ViMWQtNGJlZC1jNjQ0LTgzYmUtYjQ5YjZlNDlmYmRmIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZGExNTBlYTEtMjJhYy03OTQ5LThiNmEtZWU1MTc4ZTBmMWFkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ODhkMzU2YTctNzE4MS1lNTRhLTk5ZmUtNDgwZTM1YWM2NmY2Ij4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmYwZWQxZWM3LTM1OTAtZGE0Yi05MWIwLTYwOTQ2ZjFhNWQ5YzwvcmRmOmxpPiA8cmRmOmxpPnhtcC5kaWQ6ODhkMzU2YTctNzE4MS1lNTRhLTk5ZmUtNDgwZTM1YWM2NmY2PC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODhkMzU2YTctNzE4MS1lNTRhLTk5ZmUtNDgwZTM1YWM2NmY2IiBzdEV2dDp3aGVuPSIyMDE3LTEyLTE0VDE5OjA4OjAzLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDQ2MDc1Zi04MmRmLWY3NDAtYmU3ZS1mN2I0MzlmYjcyMzEiIHN0RXZ0OndoZW49IjIwMTctMTItMTVUMTk6MjM6MzEtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmFkZjNlYjFkLTRiZWQtYzY0NC04M2JlLWI0OWI2ZTQ5ZmJkZiIgc3RFdnQ6d2hlbj0iMjAxNy0xMi0xOVQxNTo0OTowMS0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4db7vjAAACe0lEQVRIx92WTWtTQRSGnzNzb3LTtKG1WlHwq4uCbYX+A125ELcuuihCRXCp2H3BhSv/gUvBglJw4ULBigpSaUFciFLFjSAtsX61SdM0vXNc9NokRZOYARXnMqu5zDPnnPe8M4Gq8qdHwF8Y/x706rOJnpTItadf7o++Ly+VrZhkRZL5YzjExOn1F5mpsUPnbkyMTT5qGzpXmRlZLubHP7KE7Upn2K6/1DFVwWShmFsdf/h2ZnyCSWk/vfe6e74NvSazJ0fsKvVrdfoTzKawXioyN/+85FfTJ7un3KccwdkiFBsdXolTIHmDzHb51bTncA4XOGIRNFSkQXdZo6g1ZLoj6wWNBmQ07NVp8inshiANgtXVMmFXyIGh/ae8oA+C2/nAWAp3hOBD9Mu/NQa6HdnjZYbP9J8GZtqGHhzc21FIrRHs2yAoxw1PL1lFg00G0kcuApfahi6/LNzq7Ovl5PmjlItraCJZQRCt5lpFyURp5m8uMP15qnT5xJX201uubKSzbqs7JHY1YSnUQBFFjQEMX9dWPG1QQlUUR4yqrfqB1repKDhinChI6AfVRK6SfPV28HOvsBg/qBNFhGSbxlegk6QMzveWUWoMQZrvJmyLrW2oQZAYzG/c895QEWkpwC0xmeTCc57pRVtlYtQgCtYXKiK0/oRyiFHEeAopdq7G5LVpNavTJ1LVmppKM+HiWtN4Y2haLIomKdYmQkr62heqAsYK1ghhFO4AS13aAwtiDWx6Qou2ZDKlHItvVqlU1lHVqiFqnSMQhSGuZNCO5lJqCB3cdWxl4d2rztnrixhrcAl0ZzpUhVgdUdTJcP9IwQt698Ljvv/mhf8dtGHlh4v5R1IAAAAASUVORK5CYII=';
        if (color.toLowerCase() == 'green') {
            truckUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAHkmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNy0xMi0xNFQxOTowODowMy0wODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTctMTItMTlUMTU6NDk6MDEtMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTctMTItMTlUMTU6NDk6MDEtMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YWRmM2ViMWQtNGJlZC1jNjQ0LTgzYmUtYjQ5YjZlNDlmYmRmIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZGExNTBlYTEtMjJhYy03OTQ5LThiNmEtZWU1MTc4ZTBmMWFkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ODhkMzU2YTctNzE4MS1lNTRhLTk5ZmUtNDgwZTM1YWM2NmY2Ij4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmYwZWQxZWM3LTM1OTAtZGE0Yi05MWIwLTYwOTQ2ZjFhNWQ5YzwvcmRmOmxpPiA8cmRmOmxpPnhtcC5kaWQ6ODhkMzU2YTctNzE4MS1lNTRhLTk5ZmUtNDgwZTM1YWM2NmY2PC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODhkMzU2YTctNzE4MS1lNTRhLTk5ZmUtNDgwZTM1YWM2NmY2IiBzdEV2dDp3aGVuPSIyMDE3LTEyLTE0VDE5OjA4OjAzLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDQ2MDc1Zi04MmRmLWY3NDAtYmU3ZS1mN2I0MzlmYjcyMzEiIHN0RXZ0OndoZW49IjIwMTctMTItMTVUMTk6MjM6MzEtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmFkZjNlYjFkLTRiZWQtYzY0NC04M2JlLWI0OWI2ZTQ5ZmJkZiIgc3RFdnQ6d2hlbj0iMjAxNy0xMi0xOVQxNTo0OTowMS0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4db7vjAAACe0lEQVRIx92WTWtTQRSGnzNzb3LTtKG1WlHwq4uCbYX+A125ELcuuihCRXCp2H3BhSv/gUvBglJw4ULBigpSaUFciFLFjSAtsX61SdM0vXNc9NokRZOYARXnMqu5zDPnnPe8M4Gq8qdHwF8Y/x706rOJnpTItadf7o++Ly+VrZhkRZL5YzjExOn1F5mpsUPnbkyMTT5qGzpXmRlZLubHP7KE7Upn2K6/1DFVwWShmFsdf/h2ZnyCSWk/vfe6e74NvSazJ0fsKvVrdfoTzKawXioyN/+85FfTJ7un3KccwdkiFBsdXolTIHmDzHb51bTncA4XOGIRNFSkQXdZo6g1ZLoj6wWNBmQ07NVp8inshiANgtXVMmFXyIGh/ae8oA+C2/nAWAp3hOBD9Mu/NQa6HdnjZYbP9J8GZtqGHhzc21FIrRHs2yAoxw1PL1lFg00G0kcuApfahi6/LNzq7Ovl5PmjlItraCJZQRCt5lpFyURp5m8uMP15qnT5xJX201uubKSzbqs7JHY1YSnUQBFFjQEMX9dWPG1QQlUUR4yqrfqB1repKDhinChI6AfVRK6SfPV28HOvsBg/qBNFhGSbxlegk6QMzveWUWoMQZrvJmyLrW2oQZAYzG/c895QEWkpwC0xmeTCc57pRVtlYtQgCtYXKiK0/oRyiFHEeAopdq7G5LVpNavTJ1LVmppKM+HiWtN4Y2haLIomKdYmQkr62heqAsYK1ghhFO4AS13aAwtiDWx6Qou2ZDKlHItvVqlU1lHVqiFqnSMQhSGuZNCO5lJqCB3cdWxl4d2rztnrixhrcAl0ZzpUhVgdUdTJcP9IwQt698Ljvv/mhf8dtGHlh4v5R1IAAAAASUVORK5CYII=';
        }
        else if (color.toLowerCase() == 'red') {
            truckUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAH3mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNy0xMi0xNFQxOTowODowMy0wODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTctMTItMTlUMTU6NTI6MjEtMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTctMTItMTlUMTU6NTI6MjEtMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDVjMzc1ZDYtMWNlOC1kZjRlLTgwYjgtMjlmYTRhZjA2ZDE3IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZGRmMGIzYmEtMWNiZC1hMjQ0LWEyZWMtMTg4YTlkOGRlMjk0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ODhkMzU2YTctNzE4MS1lNTRhLTk5ZmUtNDgwZTM1YWM2NmY2Ij4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjAwMDJlNDhlLThmOWUtNjU0Yy05YjQ2LTVmYWZkMTBhN2E2NzwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmMGVkMWVjNy0zNTkwLWRhNGItOTFiMC02MDk0NmYxYTVkOWM8L3JkZjpsaT4gPHJkZjpsaT54bXAuZGlkOjg4ZDM1NmE3LTcxODEtZTU0YS05OWZlLTQ4MGUzNWFjNjZmNjwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg4ZDM1NmE3LTcxODEtZTU0YS05OWZlLTQ4MGUzNWFjNjZmNiIgc3RFdnQ6d2hlbj0iMjAxNy0xMi0xNFQxOTowODowMy0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NWQ0NjA3NWYtODJkZi1mNzQwLWJlN2UtZjdiNDM5ZmI3MjMxIiBzdEV2dDp3aGVuPSIyMDE3LTEyLTE1VDE5OjIzOjMxLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNWMzNzVkNi0xY2U4LWRmNGUtODBiOC0yOWZhNGFmMDZkMTciIHN0RXZ0OndoZW49IjIwMTctMTItMTlUMTU6NTI6MjEtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7SdAwAAAAspJREFUSMfll7trFFEYxX/fnZldNwmJGkKICD4iIWKlIoqrVj46QVBsfYD4H2hhbZAU2oiInVqIWGhlI6ggBlF8BN8hKohEohI1bjb7uPez2NHdTdzZZSdo4QzfbeYO557vnHvujKgqf/sy/IPLj3r49M49hsduJVoGL67oHCdhA+NmzhGUbCEnD7cun9jTufrD2LJeu+XwweZBb548sXjDZO70slxyXb7DpUQoa6FlWOc8Wf9oYnSs9+0F+laeA6aaBv10e2jNF5vdua5/JdbOIFlhBTWK1fza9ufDiwrbdnwBLjat6RvD4I+WdnCGgtPq0nLZIkCCJ0rPlYcPzscy0t1PH/u++Ubr2k0sSTyeGcPA1cu5WKCZru4z87HToMxTalZSBaRId6Dj29KbjsZy777+vlP25YtDNwIfDYIqIaXCSEYMMM2SnLG73o1fiwW6u6d77/wH94vXXw57WZEKIJAKP3nOp8PlSU9871p15mwiFujzkdH9/R2dyS2ZH3gJnz+llwAOh/opJluUzyOvDnRBZIslKgaPtbXmt2cLwdLNaezCBeDcrC1TYmwhmUJej3DpyWOOqErTTCWTLbZ6yaDNGJxUCVnFVMVg8FDxSEA2VnsxBsVgw6JGV4x1qHGIk/jZ6wAnJYKi1SlUFU4CiICU3onHFFBVSnfZsbNBFRVFaOyYjAwHT8FZC1obMNypgGCda+is9OuvSFA0HDVKiHDeXLT3N5BENNgAjZmoIVAJh1+61WJa8tIcuNcTrURFNIKpCIjMjaYFVSwOE8HUd4pTxTb4kVe3vQgIIcuodFNpWNXoGJQwD4wBz9RMB6cOMVJaXFzQhAqtnuBlM5hJH7UWCds+y9MJhykWCBowUyRozlnvvbOMDg1VgZhwZ8oM7gHwGbxYoOmB419NMd+GyxUU57QiCipPuFIJBt9sDFJTdW3y3/xW/ARNpjvxl80uLAAAAABJRU5ErkJggg==';
        }
        else if (color.toLowerCase() == 'yellow') {
            truckUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAIKmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNy0xMi0xNFQxOTowODowMy0wODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTctMTItMTlUMTU6NTg6NTUtMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTctMTItMTlUMTU6NTg6NTUtMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YWQ4MjFkZjMtZmFlNC0xMjQzLTljZTUtZmFkN2E2MTdmNTU3IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZjUwN2IxYmMtNDBkZS0wZDQyLWIwZTctMGU4NjNmNzVkNjA0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ODhkMzU2YTctNzE4MS1lNTRhLTk5ZmUtNDgwZTM1YWM2NmY2Ij4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjAwMDJlNDhlLThmOWUtNjU0Yy05YjQ2LTVmYWZkMTBhN2E2NzwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4MzcxY2U2YS0xYWZkLTE0NDMtOTgxZC1kN2E4NGY1NmU0ZWU8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6ZjBlZDFlYzctMzU5MC1kYTRiLTkxYjAtNjA5NDZmMWE1ZDljPC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDo4OGQzNTZhNy03MTgxLWU1NGEtOTlmZS00ODBlMzVhYzY2ZjY8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4OGQzNTZhNy03MTgxLWU1NGEtOTlmZS00ODBlMzVhYzY2ZjYiIHN0RXZ0OndoZW49IjIwMTctMTItMTRUMTk6MDg6MDMtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjVkNDYwNzVmLTgyZGYtZjc0MC1iZTdlLWY3YjQzOWZiNzIzMSIgc3RFdnQ6d2hlbj0iMjAxNy0xMi0xNVQxOToyMzozMS0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YWQ4MjFkZjMtZmFlNC0xMjQzLTljZTUtZmFkN2E2MTdmNTU3IiBzdEV2dDp3aGVuPSIyMDE3LTEyLTE5VDE1OjU4OjU1LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnewY6UAAAJESURBVEjH3VYxaxRREP6+9/ayudUIkSNnCAoRlYiIWgmChRDsRUtbC3+AlsHWwlYbi1hpYxEEm1ipMRBREUQ8go2SHCki3l243N7uzVgkJnfHubu5FxJw4LHFzs43833zZoeqir02g32wfQH1kl5WVn+Vv3y4Fxw78kwODR2EyIYU2iP19VDwc+WiGT91v14cHR9NisskTacfXGtcnXzrF0Z+IwzZ9lU3tCDIe5h91cSaXApv3Jwb7JveT58/ytJyDaoWbD9iQfG2DtSDUhDFFqVvJXHSdHpGML9A+EFyEAVhSUTxAB4/ybtp2lBBswXAEtZqO7ddmStoFbRALQrdQGdnHqJVvY1qtQLGBv9Sn1DUQoVqA1N3b6WCMm04vH6R17mFYQgDWLtNaEelamANcO5MGZPX1+gE+vTRUW22hlA4/ANxRND2vDCgKOwAMHFC8fzl2PqdqcWgb3pPn6xhtT6OkWIRKgrVnpKCCng+8WZ+BWOFipumUWwQRzHOnj8OSMqMzg+gvNRC4cCyG+gWk+sR4pYkuuUIxFGMMDSOoGx7MsWPuzR7t6tNiao9Eu0XVDvmrKYzortUqTJjpZudra6gZHfUhEL1b4Ku9HLnncIMbon9bVRBEDvZo9QVFJqtPt0cSwRhMiTopXFFApqle9ljoeive6VNo/TuJbOJmghqQfi+B2TUdANPHK+MWv2+2OTlKx6MmERGMJiD73uwoHECHS76K8V6IXj/LhIVdvzKui3nA6WvDXNhwtadN4f/ZsP/Awzt5R3bsQ2jAAAAAElFTkSuQmCC';
        }
        else if (color.toLowerCase() == 'purple') {
            truckUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAH3mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNy0xMi0xNFQxOTowODowMy0wODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDMtMDJUMTI6MjA6MzMtMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMDMtMDJUMTI6MjA6MzMtMDU6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YjVmYmU3YjYtZGQ1OC1jNzRiLThmZGYtYjJkNjU1NTY3OTE0IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZjAxNmZmNjctYWYxZC02MTQ5LTgzMjQtZDM0OGY1Nzg0ZTk0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ODhkMzU2YTctNzE4MS1lNTRhLTk5ZmUtNDgwZTM1YWM2NmY2Ij4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjAwMDJlNDhlLThmOWUtNjU0Yy05YjQ2LTVmYWZkMTBhN2E2NzwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmMGVkMWVjNy0zNTkwLWRhNGItOTFiMC02MDk0NmYxYTVkOWM8L3JkZjpsaT4gPHJkZjpsaT54bXAuZGlkOjg4ZDM1NmE3LTcxODEtZTU0YS05OWZlLTQ4MGUzNWFjNjZmNjwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg4ZDM1NmE3LTcxODEtZTU0YS05OWZlLTQ4MGUzNWFjNjZmNiIgc3RFdnQ6d2hlbj0iMjAxNy0xMi0xNFQxOTowODowMy0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NWQ0NjA3NWYtODJkZi1mNzQwLWJlN2UtZjdiNDM5ZmI3MjMxIiBzdEV2dDp3aGVuPSIyMDE3LTEyLTE1VDE5OjIzOjMxLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNWZiZTdiNi1kZDU4LWM3NGItOGZkZi1iMmQ2NTU1Njc5MTQiIHN0RXZ0OndoZW49IjIwMTgtMDMtMDJUMTI6MjA6MzMtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+3413jwAAAupJREFUSMfll89vVFUUxz/n3vum04LlV8Dwa1GRNoS4wKYQ40pwRQg7owlucCEbNqzwD2CHCzfKQleWxBBWJpC4QzYEQ8LCKKLSAFWUSJBSy0w7795zXLwpnaYz0zqv0YVncieZnJv3vef7/Z5z34iZ8W+H4z+I0C15cfwSD29eqeQXXnm5Nr2pIlnSpacWGrEuz/ZeeTK669iDqaHf0okz7/QOeuOzmzuGpt78eGsaGtO1jX4n8lwLa8IroEGlOjk6MZM9GGfYPgVqPYNOXn/66vrG06N7dm4g17QoZy3CZALENBpvrd8mb8w8Bs73rOmjyv2zs/01oglR46KVbGHVU6IRYCJ8v/Xqj199XspI3818M1wP09bCatuoAI4+7lduc/7rT+ZKgcaN9XMv6LpZATKrdlyePjKBF9PmP17b9/oHpdx7eMdbH6Vb6f1vB66iYkhLTqz4ZYAiVKOwqbYz7f356JelQA8OHnk7j2viDz9d81HmWAy7ELl3DOaDbGf35iOnD1ZKgd75ZeL4ljDS91Ico2J9GNpml4AqiPCXTTM5efc9GO1KsXQbg+/KqcYIY9nI8AiyIS+4nG+ZJr2C4BWs38jvBC4//IJx+1B6rnSWuZgxkPXLGpxFRKVNnYKJoSqIeQJZvRS9gkMxoiScJKTD+U0dmiCZKz97FS10NCno7KCEiIEAomhb3Xu6ZQyjs/bODHEGrOyaXAZUiOSYFdp1ZMQVuaQJt4I6XPekw5p1drOj1+JIxbiU1aDXWr7bR3LGP3n/CMttEAQR8ALWYfA7BWvuKw2aEfBNMpItzNsllQoFoHTXfoV9WhgJtGulogG1hJquDr2+sAjJrGOlUIzfVdHUNakSZ7gAFjt5LeG9zDugLGhGlQGk7pEgkOYf61r8LIgJWoGsYQSycqANZv0jfuX3e3efTyRpfto1iScwzZ++FOihkwemfMOvDXPkTk3ngVR0SS+rGCmIG67ury3bhv+bvxV/A8sVQAg8+gDYAAAAAElFTkSuQmCC';
        }
        return truckUrl;
    };
    /**
     * @param {?} miles
     * @return {?}
     */
    RttamaplibComponent.prototype.convertMilesToFeet = /**
     * @param {?} miles
     * @return {?}
     */
    function (miles) {
        return Math.round(miles * 5280);
    };
    /**
     * @param {?} maps
     * @param {?} truckItem
     * @return {?}
     */
    RttamaplibComponent.prototype.pushNewTruck = /**
     * @param {?} maps
     * @param {?} truckItem
     * @return {?}
     */
    function (maps, truckItem) {
        var _this = this;
        /** @type {?} */
        var that = this;
        /** @type {?} */
        var pinLocation = new Microsoft.Maps.Location(truckItem.lat, truckItem.long);
        /** @type {?} */
        var destLoc = new Microsoft.Maps.Location(truckItem.wrLat, truckItem.wrLong);
        /** @type {?} */
        var iconUrl;
        /** @type {?} */
        var infoBoxTruckUrl;
        /** @type {?} */
        var NewPin;
        /** @type {?} */
        var jobIdUrl = '';
        /** @type {?} */
        var truckColor = truckItem.truckCol.toLowerCase();
        iconUrl = this.getIconUrl(truckColor, truckItem.lat, truckItem.long, truckItem.wrLat, truckItem.wrLong);
        if (truckColor == 'green') {
            infoBoxTruckUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAArCAYAAADbjc6zAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wNS0wMVQxNjoxMToxMC0wNDowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDUtMDFUMTY6MjAtMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMDUtMDFUMTY6MjAtMDQ6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTdkZjE0YmQtNDBhOC01NDRjLTkzOTAtM2RiNmZkYTZmMmJlIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MGFkM2IyZDItODBhNi0xMDRkLThiNzQtZjVhZDFmMThlYzEyIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OTdkZjE0YmQtNDBhOC01NDRjLTkzOTAtM2RiNmZkYTZmMmJlIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5N2RmMTRiZC00MGE4LTU0NGMtOTM5MC0zZGI2ZmRhNmYyYmUiIHN0RXZ0OndoZW49IjIwMTgtMDUtMDFUMTY6MTE6MTAtMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+OduK3QAAAw9JREFUaN7tmj1PG0EQhu8nuKehDJ0rlNJSJGpHpCWylDYF6aABV6QiQQKlSRRMFSUFpqNBmAoEBaQgpDTiQ5QGmpSbe9FtNBn2znt3O8d9eKSRbTjtvvfc7szc7nqekCml2qrYduJ7TQpOQ/dy/+defTnYUMu9tdw7dEIvsa4UoC3dw9Snl2ps4VlhHHqpJQVQ9/2j7z3fB2Fj9NfN70LB0X7QP0oGKADTs53E6KgygPxrFzkAzFc0Rh2jpnKA/OvW+ch48+2tsfFX66+rBYjDWdx+H9l4pQBxOO+680MbrwygJHAqAygpnEoASgOn9IDSwik1IP/7Slo4pQXkfzZdwCkzoL4LOKUEREfPj5Nu6sbLCKijfzz/8GIEyAAIK2fqcnDtpPEyAnJ6MyNAQxzTlJqLaZulTyxNqjuy7OpJPG26JnQxuFKzm3Nq+utM7h06ofe/JVcJQHSaFdxmPal4gXqK7RAUzbZ0kSgWUDGfscCG+oovzebRmbXFARXNR4CyBITpoyM/PvO0QYjSgmqzLTWcAEJn3483jVENKXJ5d/XJwGCn5ZSUGNT2+4cP2VUUEDLTnUVmgkiMsCzhhD00bp/3N2QA4enwbWVkKDwVON/4zxISh4N70dqgG1mUasP1TgHx8jtsbwzX0SraxfKJzai2WexDaKDaTNPtUZFoCwhHQ2w3DgEJKwNZvYvRV4M42k7ZwQpD9d/QgPaG3YwWYbskQqfjMNGujqrYaqMjjt4vQgSzcQ2opf+yfbbzKG7gtzY0EremkKyv6Mi21UbvR58v4GeCMGj4ds9P/R/EGkR6pGs4DYAQZCtexyyd+iUcqTuJNpr6Q7JfnQOqUUhhlmQEZWVJAIVYK2y7uRYcvLyNqm/yutxhq42XK/Tt/V9gtjyESb0TZ1uIDv0gCTQEvR2VurmzSvs8aKOW9lDmOI1RUUIMc7ruCVtwow/aot4JDdpaYuee0RleBJEVIMq0XOlUQLS2ZgJtHQkhKzHCQtvL0Gi5YmEd6ad1HtH5nnWwc6+tTgtfg0F3M06bfwG4Tv8Xy+hPaAAAAABJRU5ErkJggg==';
        }
        else if (truckColor == 'red') {
            infoBoxTruckUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAArCAYAAADbjc6zAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wNS0wMVQxNjoxMToyMS0wNDowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDUtMDFUMTY6MTU6MjMtMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMDUtMDFUMTY6MTU6MjMtMDQ6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZjA1Y2VmNDctM2NjYi03YjQ2LWI1ZjQtN2I5MDAwMjg1MjllIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOmYwNWNlZjQ3LTNjY2ItN2I0Ni1iNWY0LTdiOTAwMDI4NTI5ZSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmYwNWNlZjQ3LTNjY2ItN2I0Ni1iNWY0LTdiOTAwMDI4NTI5ZSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZjA1Y2VmNDctM2NjYi03YjQ2LWI1ZjQtN2I5MDAwMjg1MjllIiBzdEV2dDp3aGVuPSIyMDE4LTA1LTAxVDE2OjExOjIxLTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpKpcKcAAAL4SURBVGje7ZrNSjMxFIbnEuYSunbVnVs37sUbcG5A6NZunKU7Xeja6g20F1Cw624UQSwI/kBFEIpFQRCEmLc0cnqcTDMzyTg/PXA+9WNI3jxJTk5+PM+BCSFCUW67lO57juBsqFq+39/F6/m5eDk5KbxDJ/QS67oC1FM1jLa3xeXaWmkcepk10gBoSj+UfiH9TTdGP0ejUsFR/jEc0maEScFcmE5iVFQbQPLDfQ4A8xWFUceoqR0g+dEpHxn3u7uRhd8FQb0AcTjjg4PYwmsFiMN5areXFl4bQGng1AZQWji1AJQFTuUBZYVTaUDyl6OscCoLSP6zZQNOlQE92IBTZUAzm/R6mQuvNKCbzc0VIB2gr+dnK4VXFpCtxqwALXFMU2o2pm2efr2+zo9dW57t3qZnQl/jsXja2xN3OzuFd+iEXma+dUB0mpXcWiqLth4vkE+xoVo269E9mJOAivmMAzbkV/xotojOLHQOqGy+ApQnIEwfFfnxs0gXhEgtqDbTVMMKIFQ26XYjoxqWyJfj438Dg5uWz9tb7R0dVlengExXJojECMsTjq7TuL2enbkBhN7h18pYodArcH7xnyckDgdtUdqgG6so1YbvrQLi6bfubgzf0SzaxvGJyag2OexDaKDaoqZbZJJoAghPQ0wvDgEJJwN57cXo1iCJNozwJdn/xgKguMYoEaZHInQ6LhNt66mKqTY64mh7ESK0z17U/0z7/T9xA3//BjhZSNKcwmV+RUe2qTbaHvW+IOJN0IDfhV0tvAiTkR7LNZwGQAgyFa9illr6XTjdHiTRRjtPs/o1OSCfQtIukSlGUF6WBpDGAt1dvD9/eDmNy2+Ketxhqo2nK3T3vhCYDR5hUu8kuRZiO+NBRHk2PYxbuv8c5i1m2o/zMvysjzIbNEbFCYmY003Psc0bOtMWtyeM0BY4e/eMyrARxKoAUZrjysDLwfjNsKG2jgshRwnCQujlaOiMBNo6rnvrMabygXGws6+tOa9fZ9C9lbTcHxHBxB7J6eTVAAAAAElFTkSuQmCC';
        }
        else if (truckColor == 'yellow') {
            infoBoxTruckUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAsCAYAAADGiP4LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wNS0wMVQxNjoxMTowNi0wNDowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDUtMDFUMTY6MTU6MTktMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMDUtMDFUMTY6MTU6MTktMDQ6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTAyNDE4Y2EtNTMzNC04NjRjLWFhNmEtYTJlNDk2YmU1YmE4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkwMjQxOGNhLTUzMzQtODY0Yy1hYTZhLWEyZTQ5NmJlNWJhOCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjkwMjQxOGNhLTUzMzQtODY0Yy1hYTZhLWEyZTQ5NmJlNWJhOCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTAyNDE4Y2EtNTMzNC04NjRjLWFhNmEtYTJlNDk2YmU1YmE4IiBzdEV2dDp3aGVuPSIyMDE4LTA1LTAxVDE2OjExOjA2LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnKbI5YAAAMJSURBVGje7Zq9SsRAEIDvESx8AMEXOHwB7wnUJ5B7AAV7C6/VRkutvM5SQQQbOQW1sfBALSz84RobwbPQQsytM2s2TjabZPOza35uYFBQspMvszOzs9NoWBDG2ATobAm02bApsOAC6BMrl7yBruFHNQ2nw8ot18YgwYNb3jJf78x53GHO/UbxFexEe4nsmwJ0IFZwzlrs+3CyNIr2UkkLoAm6Cdpz96xSRu+3pYIjdPR6kQ6QC6anu4lxodoAciO7X2C/4sN8Cl5TO0Dwf7uyZzhXi+o9fDlfL0ABOHer0UGuToACcPrL8VmgLoDSwKkNoLRwagEoC5zKA8oKp9KA4PetrHAqC8htS2SGU2VAT3nAqSQg6j2jwV7203AFAXW91sTJzBiQAtA1/+1zkE8/pYKAcn2ZMaA4QLBNqeSxba3q8TRjX0NzgPgXID0h9jFgTn8JPGuu+Ap2or2+lqsJQHSblVxWGqbiBdZT0g1B2eRAFInmAirsZ2ywYX0VaM0WUCXpmAdUMh0DsgoIto+I/PxngS4IsbTw2aZZauQCCBfDmKIUSJGj+/X/A3O1CCXGTcgd3TnPrkYB/WamYfyFIRiJHma1+g37aJI4D9tmAOHXka+VMUPhV+EqXfzbhCTD4VlJ2IZehX+ntoV0LdIDksrv0LsxTOv0ZjWH9omWV2s0+3hoILaptlugSNQFhKMhuheHHObnwNpZjB4NktjGPTy6+m8JQKdxL+MZodkSodsx1ui8RlU0baMeR9+Xhwi/TAlAbe9lXo6CcQOpiwfCQ5LWFCbrK+rZ2rbR93HnC+SZIHQa+bqn/zexMeSRHtM1VxIA0SBtQCJmuanfiELqTmUbSf0h2a+pmkLtx6bIFB5kS9IACpF21KguDl4OI+ubgrY7tG2TyhV6evcCs+YQJtVukmsh6vpuEmgZ1E5U6g4283yV9rP7jImsQ5lTvhgVYYhiTzctzGM/e7ZFnAkVtrWNzT3jYngQ5IdWMErVrszVgPiB9aS2dU0YspUgLHQsT/W3E9imDecHRjxSmK+bqfwAAAAASUVORK5CYII=';
        }
        else if (truckColor == 'purple') {
            infoBoxTruckUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAArCAYAAADbjc6zAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGtmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wMy0wM1QxMTozMTowNC0wNTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDUtMDFUMTY6MTU6NDktMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMDUtMDFUMTY6MTU6NDktMDQ6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDkwYTAwZTYtOTNmZi1kYjQ1LWIxMjEtM2I1MzBmN2YyZTQwIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NTJkMWQwMDgtYWMxMy03MDQ5LTlmOGMtOThiNTcxZDIzYjI0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YzI0OTg0MGUtMmJkMS1kZDQxLTg0Y2ItMWQ0YjRjNzVkMDkxIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjMjQ5ODQwZS0yYmQxLWRkNDEtODRjYi0xZDRiNGM3NWQwOTEiIHN0RXZ0OndoZW49IjIwMTgtMDMtMDNUMTE6MzE6MDQtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJmMzk3MjE4LTlmMDUtZTc0MC1iY2Y5LTNiMmVjMzk5MDQ3MiIgc3RFdnQ6d2hlbj0iMjAxOC0wMy0wM1QxMTozOTowOC0wNTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDkwYTAwZTYtOTNmZi1kYjQ1LWIxMjEtM2I1MzBmN2YyZTQwIiBzdEV2dDp3aGVuPSIyMDE4LTA1LTAxVDE2OjE1OjQ5LTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgYoI4oAAAL9SURBVGje7Zq7ThtBFIb3EfwIPIIfgTfANZWr1O6DhLuUQBspynZWinALDUhgF0gkUiQih2Yb1kUokJCMEAVUy/7IA8fHs7uzu3M2e/GRjnzRaubfb2bOnLk4jpAFQdAPqm2Xobek4KyqWp4en4PxoRf8HlyV3qETeontSQHaVzV87x0Hn9e+Vcahl1pWAO3Qt0Ifhj6N6qN3/rRScJTf/L3NBmgGZmg6iFFRYwCFz25yABivKIw6ek3jAIXPfeU94+TTubbwo41hswBxOBdfLmMLbxQgDme08yux8MYAygKnMYCywmkEoDxwag8oL5xaAwq/b+eFU1tA4WfHBpw6A/JtwKklINp7vDM/d+F1BOSqH4MPR0tAGkDYOQsebh+tFF5HQFZfZgkowTFMqdkYtkW6u747t+3qSLQ23RPC0MXM+OPjWekdOqF3bstVAhAdZhW3niMVL9Aa7ISgaravkkSxgIrxjA025Fd8a7aMzqwvDqhqvgRUJCAMHxX58VmmA0KkFlSbaaphBRAq8059bVTDFIkj3P8FBictd9fTyDM6zK6igExnJohEDysSTlSjcRsfeDKA0Dr8WBkzFFoFzg/+i4TE4eBdlDboxixKteF5q4B4+h11NobnaBZtY/vEpFebbPYhNFBtuuG2kCSaAkJcMT04BCSarkuvxWhdabShhydk/6sK0CjpZVShplsidDgmibZ1VcVUG+1x9H0RIpitKEBd9Y//899C3MDvtwB36KXOKSTzK9qzTbXR91H3C/idIHQaftzzZ+5G2MH7jTAaANNM4SpmqalfwunyII022ngRs1+bA2pRSJFTZIYeVJRlARRh3ajj5tbs4uV9XH5T1u0OU208XaGr97fAbHgJk7qb5liIrYxHmvJsej9u6l7YzJvPtCezMlp5L2Wu0BgVJ0QzptuOsM1e9FVb3JpQo60rdu8ZlWEhiFkBonTblVYFxGvrZNDmSgjZThEW+k6BRtMVA3OlW2sSU/nIONjZ19amia/GoLuTpswXoaTwsnKAkdEAAAAASUVORK5CYII=';
        }
        /** @type {?} */
        var mielsTodispatch = parseFloat(truckItem.dist).toFixed(2);
        this.results.push({
            display: truckItem.truckId + " : " + truckItem.techID,
            value: 1,
            Latitude: truckItem.lat,
            Longitude: truckItem.long
        });
        /** @type {?} */
        var truckUrl = this.getTruckUrl(truckColor);
        /** @type {?} */
        var listOfPushPins = maps.entities;
        /** @type {?} */
        var metadata = {
            truckId: truckItem.truckId,
            ATTUID: truckItem.techID,
            truckStatus: truckItem.truckCol,
            truckCol: truckItem.truckCol,
            jobType: truckItem.jobType,
            WRJobType: truckItem.workType,
            WRStatus: truckItem.wrStat,
            AssingedWRID: truckItem.wrID,
            Speed: truckItem.speed,
            Distance: mielsTodispatch,
            CurrentIdleTime: truckItem.idleTime,
            ETA: truckItem.totIdleTime,
            Email: '',
            // truckItem.Email,
            Mobile: '',
            // truckItem.Mobile,
            icon: iconUrl,
            iconInfo: infoBoxTruckUrl,
            CurrentLat: truckItem.lat,
            CurrentLong: truckItem.long,
            WRLat: truckItem.wrLat,
            WRLong: truckItem.wrLong,
            techIds: this.reportingTechnicians,
            jobId: truckItem.jobId,
            managerIds: this.managerIds,
            workAddress: truckItem.workAddress,
            sbcVin: truckItem.sbcVin,
            customerName: truckItem.customerName,
            technicianName: truckItem.technicianName,
            dispatchTime: truckItem.dispatchTime,
            region: truckItem.zone
        };
        /** @type {?} */
        var jobIdString = 'http://edge-edt.it.att.com/cgi-bin/edt_jobinfo.cgi?';
        /** @type {?} */
        var zone = truckItem.zone;
        // = M for MW
        // = W for West
        // = B for SE
        // = S for SW
        if (zone != null && zone != undefined) {
            if (zone === 'MW') {
                zone = 'M';
            }
            else if (zone === 'SE') {
                zone = 'B';
            }
            else if (zone === 'SW') {
                zone = 'S';
            }
        }
        else {
            zone = '';
        }
        jobIdString = jobIdString + 'edt_region=' + zone + '&wrid=' + truckItem.wrID;
        truckItem.jobId = truckItem.jobId == undefined || truckItem.jobId == null ? '' : truckItem.jobId;
        if (truckItem.jobId != '') {
            jobIdUrl = '<a href="' + jobIdString + '" target="_blank" title="Click here to see actual Force/Edge job data">' + truckItem.jobId + '</a>';
        }
        if (truckItem.dispatchTime != null && truckItem.dispatchTime != undefined && truckItem.dispatchTime != '') {
            /** @type {?} */
            var dispatchDate = truckItem.dispatchTime.split(':');
            /** @type {?} */
            var dt = dispatchDate[0] + ' ' + dispatchDate[1] + ':' + dispatchDate[2] + ':' + dispatchDate[3];
            metadata.dispatchTime = that.UTCToTimeZone(dt);
        }
        // Update in the TruckWatchList session
        if (sessionStorage.getItem('TruckWatchList') !== null) {
            this.truckList = JSON.parse(sessionStorage.getItem('TruckWatchList'));
            if (this.truckList.length > 0) {
                if (this.truckList.some(function (x) { return x.truckId == truckItem.truckId; }) == true) {
                    /** @type {?} */
                    var item = this.truckList.find(function (x) { return x.truckId == truckItem.truckId; });
                    /** @type {?} */
                    var index = this.truckList.indexOf(item);
                    if (index !== -1) {
                        item.Distance = metadata.Distance;
                        item.icon = metadata.icon;
                        this.truckList.splice(index, 1);
                        this.truckList.splice(index, 0, item);
                        this.mapService.storeDataInSessionStorage('TruckWatchList', this.truckList);
                        item = null;
                    }
                }
            }
        }
        // Update in the SelectedTruck session
        if (sessionStorage.getItem('TruckDetails') !== 'undefined') {
            /** @type {?} */
            var selectedTruck = void 0;
            selectedTruck = JSON.parse(sessionStorage.getItem('TruckDetails'));
            if (selectedTruck != null) {
                if (selectedTruck.truckId == truckItem.truckId) {
                    sessionStorage.removeItem('TruckDetails');
                    this.mapService.storeDataInSessionStorage('TruckDetails', metadata);
                    selectedTruck = null;
                }
            }
        }
        if (this.truckItems.length > 0 && this.truckItems.some(function (x) { return x.toLowerCase() == truckItem.truckId.toLowerCase(); })) {
            // If it is not a new truck then move the truck to new location
            for (var i = 0; i < listOfPushPins.getLength(); i++) {
                if (listOfPushPins.get(i).metadata.truckId === truckItem.truckId) {
                    /** @type {?} */
                    var curPushPin = listOfPushPins.get(i);
                    curPushPin.metadata = metadata;
                    destLoc = pinLocation;
                    pinLocation = listOfPushPins.get(i).getLocation();
                    /** @type {?} */
                    var truckIdRanId = truckItem.truckId + '_' + Math.random();
                    this.animationTruckList.forEach(function (item, index) {
                        if (item.indexOf(truckItem.truckId) > -1) {
                            _this.animationTruckList.splice(index, 1);
                        }
                    });
                    this.animationTruckList.push(truckIdRanId);
                    this.loadDirections(this, pinLocation, destLoc, i, truckUrl, truckIdRanId);
                    return;
                }
            }
        }
        else {
            this.truckItems.push(truckItem.truckId);
            NewPin = new Microsoft.Maps.Pushpin(pinLocation, { icon: truckUrl });
            NewPin.metadata = metadata;
            this.map.entities.push(NewPin);
            this.dataLayer.push(NewPin);
            if (this.isMapLoaded) {
                this.isMapLoaded = false;
                this.map.setView({ center: pinLocation, zoom: this.lastZoomLevel });
                that.lastZoomLevel = this.map.getZoom();
                that.lastLocation = this.map.getCenter();
            }
            Microsoft.Maps.Events.addHandler(NewPin, 'mouseout', function (e) {
                _this.infobox.setOptions({ visible: false });
            });
            if ($(window).width() < 1024) {
                Microsoft.Maps.Events.addHandler(NewPin, 'click', function (e) {
                    _this.infobox.setOptions({
                        showPointer: true,
                        location: e.target.getLocation(),
                        visible: true,
                        showCloseButton: true,
                        offset: new Microsoft.Maps.Point(0, 20),
                        htmlContent: '<div class = "infy infyMappopup">'
                            + getInfoBoxHTML(e.target.metadata, _this.thresholdValue, jobIdUrl) + '</div>'
                    });
                    _this.truckWatchList = [{ TruckId: e.target.metadata.truckId, Distance: e.target.metadata.Distance }];
                    _this.mapService.storeDataInSessionStorage('selectedTruck', e.target.metadata);
                    _this.mapService.storeDataInSessionStorage('TruckDetails', e.target.metadata);
                    /** @type {?} */
                    var buffer = 30;
                    /** @type {?} */
                    var infoboxOffset = that.infobox.getOffset();
                    /** @type {?} */
                    var infoboxAnchor = that.infobox.getAnchor();
                    /** @type {?} */
                    var infoboxLocation = maps.tryLocationToPixel(e.target.getLocation(), Microsoft.Maps.PixelReference.control);
                    /** @type {?} */
                    var dx = infoboxLocation.x + infoboxOffset.x - infoboxAnchor.x;
                    /** @type {?} */
                    var dy = infoboxLocation.y - 25 - infoboxAnchor.y;
                    if (dy < buffer) { // Infobox overlaps with top of map.
                        // Infobox overlaps with top of map.
                        // #### Offset in opposite direction.
                        dy *= -1;
                        // #### add buffer from the top edge of the map.
                        dy += buffer;
                    }
                    else {
                        // #### If dy is greater than zero than it does not overlap.
                        dy = 0;
                    }
                    if (dx < buffer) { // Check to see if overlapping with left side of map.
                        // Check to see if overlapping with left side of map.
                        // #### Offset in opposite direction.
                        dx *= -1;
                        // #### add a buffer from the left edge of the map.
                        dx += buffer;
                    }
                    else { // Check to see if overlapping with right side of map.
                        // Check to see if overlapping with right side of map.
                        dx = maps.getWidth() - infoboxLocation.x + infoboxAnchor.x - that.infobox.getWidth();
                        // #### If dx is greater than zero then it does not overlap.
                        if (dx > buffer) {
                            dx = 0;
                        }
                        else {
                            // #### add a buffer from the right edge of the map.
                            dx -= buffer;
                        }
                    }
                    // #### Adjust the map so infobox is in view
                    if (dx != 0 || dy != 0) {
                        maps.setView({
                            centerOffset: new Microsoft.Maps.Point(dx, dy),
                            center: maps.getCenter()
                        });
                    }
                    /** @type {?} */
                    var selectedTruck;
                    selectedTruck = _this.mapService.retrieveDataFromSessionStorage('selectedTruck');
                    if (selectedTruck != null) {
                        /** @type {?} */
                        var technicianDetails = _this.reportingTechnicianDetails.find(function (x) { return x.attuid.toLowerCase() == selectedTruck.ATTUID.toLowerCase(); });
                        if (technicianDetails != null) {
                            _this.technicianEmail = technicianDetails.email;
                            _this.technicianPhone = technicianDetails.phone;
                            _this.technicianName = technicianDetails.name;
                        }
                    }
                    Microsoft.Maps.Events.addHandler(_this.infobox, 'click', viewTruckDetails);
                });
            }
            else {
                Microsoft.Maps.Events.addHandler(NewPin, 'mouseover', function (e) {
                    _this.infobox.setOptions({
                        showPointer: true,
                        location: e.target.getLocation(),
                        visible: true,
                        showCloseButton: true,
                        offset: new Microsoft.Maps.Point(0, 20),
                        htmlContent: '<div class = "infy infyMappopup">'
                            + getInfoBoxHTML(e.target.metadata, _this.thresholdValue, jobIdUrl) + '</div>'
                    });
                    _this.truckWatchList = [{ TruckId: e.target.metadata.truckId, Distance: e.target.metadata.Distance }];
                    _this.mapService.storeDataInSessionStorage('selectedTruck', e.target.metadata);
                    _this.mapService.storeDataInSessionStorage('TruckDetails', e.target.metadata);
                    /** @type {?} */
                    var buffer = 30;
                    /** @type {?} */
                    var infoboxOffset = that.infobox.getOffset();
                    /** @type {?} */
                    var infoboxAnchor = that.infobox.getAnchor();
                    /** @type {?} */
                    var infoboxLocation = maps.tryLocationToPixel(e.target.getLocation(), Microsoft.Maps.PixelReference.control);
                    /** @type {?} */
                    var dx = infoboxLocation.x + infoboxOffset.x - infoboxAnchor.x;
                    /** @type {?} */
                    var dy = infoboxLocation.y - 25 - infoboxAnchor.y;
                    if (dy < buffer) { // Infobox overlaps with top of map.
                        // Infobox overlaps with top of map.
                        // #### Offset in opposite direction.
                        dy *= -1;
                        // #### add buffer from the top edge of the map.
                        dy += buffer;
                    }
                    else {
                        // #### If dy is greater than zero than it does not overlap.
                        dy = 0;
                    }
                    if (dx < buffer) { // Check to see if overlapping with left side of map.
                        // Check to see if overlapping with left side of map.
                        // #### Offset in opposite direction.
                        dx *= -1;
                        // #### add a buffer from the left edge of the map.
                        dx += buffer;
                    }
                    else { // Check to see if overlapping with right side of map.
                        // Check to see if overlapping with right side of map.
                        dx = maps.getWidth() - infoboxLocation.x + infoboxAnchor.x - that.infobox.getWidth();
                        // #### If dx is greater than zero then it does not overlap.
                        if (dx > buffer) {
                            dx = 0;
                        }
                        else {
                            // #### add a buffer from the right edge of the map.
                            dx -= buffer;
                        }
                    }
                    // #### Adjust the map so infobox is in view
                    if (dx != 0 || dy != 0) {
                        maps.setView({
                            centerOffset: new Microsoft.Maps.Point(dx, dy),
                            center: maps.getCenter()
                        });
                    }
                    /** @type {?} */
                    var selectedTruck;
                    selectedTruck = _this.mapService.retrieveDataFromSessionStorage('selectedTruck');
                    if (selectedTruck != null) {
                        /** @type {?} */
                        var technicianDetails = _this.reportingTechnicianDetails.find(function (x) { return x.attuid.toLowerCase() == selectedTruck.ATTUID.toLowerCase(); });
                        if (technicianDetails != null) {
                            _this.technicianEmail = technicianDetails.email;
                            _this.technicianPhone = technicianDetails.phone;
                            _this.technicianName = technicianDetails.name;
                        }
                    }
                    Microsoft.Maps.Events.addHandler(_this.infobox, 'click', viewTruckDetails);
                });
            }
            Microsoft.Maps.Events.addHandler(maps, 'viewchange', mapViewChanged);
            // this.ChangeTruckDirection(this, NewPin, destLoc, truckUrl);
        }
        /**
         * @param {?} e
         * @return {?}
         */
        function mapViewChanged(e) {
            that.lastZoomLevel = maps.getZoom();
            that.lastLocation = maps.getCenter();
        }
        /**
         * @param {?} data
         * @param {?} tValue
         * @param {?} jobId
         * @return {?}
         */
        function getInfoBoxHTML(data, tValue, jobId) {
            if (!data.Speed) {
                data.Speed = 0;
            }
            /** @type {?} */
            var className = "";
            /** @type {?} */
            var styleLeft = "";
            /** @type {?} */
            var reason = '';
            if (data.truckStatus != undefined) {
                if (data.truckStatus.toLocaleLowerCase() == 'red') {
                    reason = "<div class='row' style='margin-top:3px;color:red;'>Reason: Cumulative idle time is beyond " + tValue + " mins</div>";
                }
                else if (data.truckStatus.toLocaleLowerCase() == 'purple') {
                    reason = "<div class='row' style='margin-top:3px;color:purple;'>Reason: Truck is driven greater than 75 m/h</div>";
                }
            }
            /** @type {?} */
            var infoboxData = '';
            data.customerName = data.customerName == undefined || data.customerName == null ? '' : data.customerName;
            data.dispatchTime = data.dispatchTime == undefined || data.dispatchTime == null ? '' : data.dispatchTime;
            data.jobId = data.jobId == undefined || data.jobId == null ? '' : data.jobId;
            data.workAddress = data.workAddress == undefined || data.workAddress == null ? '' : data.workAddress;
            data.sbcVin = data.sbcVin == undefined || data.sbcVin == null || data.sbcVin == '' ? '' : data.sbcVin;
            data.technicianName = data.technicianName == undefined || data.technicianName == null || data.technicianName == '' ? '' : data.technicianName;
            if ($(window).width() < 1024) {
                infoboxData = "<div class='popModalContainer'><div class='popModalHeader'><img src='" + data.iconInfo + "' ><a class='details' title='Click here to see technician details' >View Details</a><i class='fa fa-times' aria-hidden='true' style='cursor: pointer'></i></div>"
                    + "<hr/><div class='popModalBody'>"
                    + "<div class='row'>"
                    + "<div class='col-md-6'>"
                    + "<div class='form-group row'><label class='col col-sm-5 col-form-label'>Vehicle Number :</label><div class='col col-sm-7'><span class='col-form-label'>" + data.sbcVin + "</span></div></div></div>"
                    + "<div class='col-md-6'>"
                    + "<div class='form-group row'><label class='col col-sm-5 col-form-label'>VTS Unit ID :</label><div class='col col-sm-7'><span class='col-form-label'>" + data.truckId + "</span></div></div></div>"
                    + "</div>"
                    + "<div class='row'>"
                    + "<div class='col-md-6'>"
                    + "<div class='form-group row'><label class='col col-sm-5 col-form-label'>Job Type :</label><div class='col col-sm-7'><span class='col-form-label'>" + data.jobType + "</span></div></div></div>"
                    + "<div class='col-md-6'>"
                    + "<div class='form-group row'><label class='col col-sm-5 col-form-label'>Job Id :</label><div class='col col-sm-7'><span class='col-form-label'>" + jobId + "</span></div></div></div>"
                    + "</div>"
                    + "<div class='row'>"
                    + "<div class='col-md-6'>"
                    + "<div class='form-group row'><label class='col col-sm-5 col-form-label'>ATTUID :</label><div class='col col-sm-7'><span class='col-form-label'>" + data.ATTUID + "</span></div></div></div>"
                    + "<div class='col-md-6'>"
                    + "<div class='form-group row'><label class='col col-sm-5 col-form-label'>Technician Name :</label><div class='col col-sm-7'><span class='col-form-label'>" + data.technicianName + "</span></div></div></div>"
                    + "</div>"
                    + "<div class='row'>"
                    + "<div class='col-md-6'>"
                    + "<div class='form-group row'><label class='col col-sm-5 col-form-label'>Customer Name :</label><div class='col col-sm-7'><span class='col-form-label'>" + data.customerName + "</span></div></div></div>"
                    + "<div class='col-md-6'>"
                    + "<div class='form-group row'><label class='col col-sm-5 col-form-label'>Dispatch Time:</label><div class='col col-sm-7'><span class='col-form-label'>" + data.dispatchTime + "</span></div></div></div>"
                    + "</div>"
                    + "<div class='row'>"
                    + "<div class='col-md-12'>"
                    + "<div class='form-group row'><label class='col-12 col-sm-12 col-form-label'>Job Address :</label><div class='col-12 col-sm-12'><span class='col-form-label col-form-label-full'>" + data.workAddress + "</span></div></div></div>"
                    + "</div>"
                    + "<div class='row meterCal'>"
                    + "<div class='col-12 col-md-4'><strong>" + data.Speed + "</strong> mph <span class='infoBox-bottom1'>Speed</span></div>"
                    + "<div class='col-12 col-md-4'><strong>" + data.ETA + "</strong> Mins <span class='infoBox-bottom1'>Cumulative Idle Minutes</span></div>"
                    + "<div class='col-12 col-md-4'><strong>" + that.convertMilesToFeet(data.Distance) + "</strong> Ft <span class='infoBox-bottom1'>Feet to Job Site</span></div>"
                    + "</div>"
                    + "</div> <hr/>"
                    + "<div class='popModalFooter'><div class='row'>"
                    + "<div class='col col-md-4'><i class='fa fa-commenting'></i><span class='sms' title='Click to send SMS' >SMS</p></div>"
                    + "<div class='col col-md-4'><i class='fa fa-envelope' aria-hidden='true'></i><span class='email' title='Click to send email' >Email</p></div>"
                    + "<div class='col col-md-4'><i class='fa fa-eye' aria-hidden='true'></i><span class='watchlist' title='Click to add in watchlist' >Watch</p></div>"
                    + "</div> </div>"
                    + "</div>";
            }
            else {
                infoboxData = "<div class='row' style='padding-top:10px;margin: 0px;'>"
                    + "<div class='col-md-3'><div style='padding-top:15px;' ><img src='" + data.iconInfo + "' style='display: block;margin: 0 auto;' ></div></div>" +
                    "<div class='col-md-9'>" +
                    "<div class='row '>" +
                    "<div class='col-md-8' style='padding-left:0px;padding-right:0px;' ><span style='font-weight:bold;'>Vehicle Number</span>&nbsp;:&nbsp;" + data.sbcVin + "</div>" +
                    "<div class='col-md-4' style='padding-left:0px;padding-right:0px;' ><a class='details' style='color:#009FDB;cursor: pointer;'  title='Click here to see technician details' >View Details</a><i class='fa fa-times' style='padding-left:15px;cursor: pointer;' aria-hidden='true' style='cursor: pointer'></i></div>" +
                    "</div>" +
                    "<div class='row'><div><span style='font-weight:bold;'>VTS Unit ID</span>&nbsp;:&nbsp;" + data.truckId + "</div></div>" +
                    "<div class='row'><div class='col-md-5' style='padding-left:0px;padding-right:0px;' ><span style='font-weight:bold;'>Job Type</span>&nbsp;:&nbsp;" + data.jobType + "</div><div class='col-md-7' style='padding-left:0px;padding-right:0px;' ><span style='font-weight:bold;' >Job Id</span>&nbsp;:&nbsp;" + jobId + "</div></div>"
                    + reason + "</div></div>"
                    + "<div class='infoRow' style='padding-left:5px;padding-right:5px;'><span style='font-weight:bold;'>ATTUID</span>&nbsp;:&nbsp;" + data.ATTUID + "<span style='font-weight:bold;margin-left:8px;'>Technician Name</span>&nbsp;:&nbsp;" + data.technicianName + "</div>"
                    + "<div class='infoRow' style='padding-left:5px;padding-right:5px;' >"
                    + "<div><span style='font-weight:bold;'>Customer Name</span>&nbsp;:&nbsp;" + data.customerName + "</div>"
                    + "</div>"
                    + "<div class='infoRow' style='padding-left:5px;padding-right:5px;' >"
                    + "<div><span style='font-weight:bold;'>Dispatch Time</span>&nbsp;:&nbsp;" + data.dispatchTime + "</div>"
                    + "</div>"
                    + "<div class='infoRow' style='padding-left:5px;padding-right:5px;' >"
                    + "<div><span style='font-weight:bold;'>Job Address</span>&nbsp;:&nbsp;" + data.workAddress + "</div>"
                    + "</div>"
                    + "<hr style='margin-top:1px; margin-bottom:5px;' />"
                    + "<div style='margin-left: 10px;'> <div class='row'> <div class='speed col-md-3'> <div class='row' style='margin-left: 1px'><p style='font-weight: bolder;font-size: 23px;margin: 0px;'>" + data.Speed + "</p><p style='margin: 10px 10px;'>mph</p></div><p style='margin:0px' class='infoBox-bottom1'>Speed</p></div>"
                    + "<div class='idle col-md-5'><div class='row' style='margin-left: 10px'><p style='font-weight: bolder;font-size: 23px;margin: 0px;'>" + data.ETA + "</p><p style='margin: 10px 10px;'>Mins</p></div><p style='margin:0px' class='infoBox-bottom1'>Cumulative Idle Minutes</p></div> <div class='miles col-md-4'>"
                    + "<div class='row' style='margin-left: 10px'><p style='font-weight: bolder;font-size: 23px;margin: 0px;'>" + that.convertMilesToFeet(data.Distance) + "</p><p style='margin: 10px 10px;'>Ft</p></div><p style='margin:0px' class='infoBox-bottom1'>Feet to Job Site</p></div>"
                    + "</div></div><hr style='margin-top:1px; margin-bottom:5px;' />"
                    + "<div class='row' style='cursor: pointer'> <div class='col-md-1'></div><div class='row col-md-3' style='" + className + "'> <i class='fa fa-commenting col-md-2'></i><p class='col-md-6 sms' title='Click to send SMS' >SMS</p></div>"
                    + "<div class='row col-md-3 offset-md-1' style='" + className + "'> <i class='fa fa-envelope col-md-2' aria-hidden='true'></i><p class='col-md-6 email' title='Click to send email' >Email</p></div>"
                    + "<div class='row col-md-3'></div>"
                    + "<div class='row col-md-3' style='" + styleLeft + "'><i class='fa fa-eye col-md-2' aria-hidden='true'></i><p class='col-md-6 watchlist' title='Click to add in watchlist' >Watch</p></div> </div>";
            }
            return infoboxData;
        }
        /**
         * @param {?} e
         * @return {?}
         */
        function viewTruckDetails(e) {
            if (e.originalEvent.target.className === 'fa fa-times') {
                that.infobox.setOptions({
                    visible: false
                });
            }
            if (e.originalEvent.target.className === 'details') ;
            if (e.originalEvent.target.className === 'col-md-6 sms') {
                /** @type {?} */
                var selectedTruck_1 = void 0;
                selectedTruck_1 = that.mapService.retrieveDataFromSessionStorage('selectedTruck');
                if (selectedTruck_1 != null) {
                    /** @type {?} */
                    var technicianDetails = that.reportingTechnicianDetails.find(function (x) { return x.attuid.toLowerCase() == selectedTruck_1.ATTUID.toLowerCase(); });
                    if (technicianDetails != null) {
                        this.technicianEmail = technicianDetails.email;
                        this.technicianPhone = technicianDetails.phone;
                        this.technicianName = technicianDetails.name;
                    }
                }
                jQuery('#myModalSMS').modal('show');
            }
            if (e.originalEvent.target.className === 'col-md-6 email') {
                /** @type {?} */
                var selectedTruck_2 = void 0;
                selectedTruck_2 = that.mapService.retrieveDataFromSessionStorage('selectedTruck');
                if (selectedTruck_2 != null) {
                    /** @type {?} */
                    var technicianDetails = that.reportingTechnicianDetails.find(function (x) { return x.attuid.toLowerCase() == selectedTruck_2.ATTUID.toLowerCase(); });
                    if (technicianDetails != null) {
                        this.technicianEmail = technicianDetails.email;
                        this.technicianPhone = technicianDetails.phone;
                        this.technicianName = technicianDetails.name;
                    }
                }
                jQuery('#myModalEmail').modal('show');
            }
        }
    };
    /**
     * @param {?} that
     * @param {?} startLoc
     * @param {?} endLoc
     * @param {?} index
     * @param {?} truckUrl
     * @param {?} truckIdRanId
     * @return {?}
     */
    RttamaplibComponent.prototype.loadDirections = /**
     * @param {?} that
     * @param {?} startLoc
     * @param {?} endLoc
     * @param {?} index
     * @param {?} truckUrl
     * @param {?} truckIdRanId
     * @return {?}
     */
    function (that, startLoc, endLoc, index, truckUrl, truckIdRanId) {
        var _this = this;
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
            _this.directionsManager = new Microsoft.Maps.Directions.DirectionsManager(that.map);
            // Set Route Mode to driving
            // Set Route Mode to driving
            _this.directionsManager.setRequestOptions({
                routeMode: Microsoft.Maps.Directions.RouteMode.driving
            });
            _this.directionsManager.setRenderOptions({
                drivingPolylineOptions: {
                    strokeColor: 'green',
                    strokeThickness: 3,
                    visible: false
                },
                waypointPushpinOptions: { visible: false },
                viapointPushpinOptions: { visible: false },
                autoUpdateMapView: false
            });
            /** @type {?} */
            var waypoint1 = new Microsoft.Maps.Directions.Waypoint({
                location: new Microsoft.Maps.Location(startLoc.latitude, startLoc.longitude), icon: ''
            });
            /** @type {?} */
            var waypoint2 = new Microsoft.Maps.Directions.Waypoint({
                location: new Microsoft.Maps.Location(endLoc.latitude, endLoc.longitude)
            });
            _this.directionsManager.addWaypoint(waypoint1);
            _this.directionsManager.addWaypoint(waypoint2);
            // Add event handler to directions manager.
            Microsoft.Maps.Events.addHandler(_this.directionsManager, 'directionsUpdated', function (e) {
                // const that = this;
                console.log(e);
                /** @type {?} */
                var routeIndex = e.route[0].routeLegs[0].originalRouteIndex;
                /** @type {?} */
                var nextIndex = routeIndex;
                if (e.route[0].routePath.length > routeIndex) {
                    nextIndex = routeIndex + 1;
                }
                /** @type {?} */
                var nextLocation = e.route[0].routePath[nextIndex];
                /** @type {?} */
                var pin = that.map.entities.get(index);
                // var bearing = that.calculateBearing(startLoc,nextLocation);
                that.MovePinOnDirection(that, e.route[0].routePath, pin, truckUrl, truckIdRanId);
            });
            _this.directionsManager.calculateDirections();
        });
    };
    /**
     * @param {?} that
     * @param {?} routePath
     * @param {?} pin
     * @param {?} truckUrl
     * @param {?} truckIdRanId
     * @return {?}
     */
    RttamaplibComponent.prototype.MovePinOnDirection = /**
     * @param {?} that
     * @param {?} routePath
     * @param {?} pin
     * @param {?} truckUrl
     * @param {?} truckIdRanId
     * @return {?}
     */
    function (that, routePath, pin, truckUrl, truckIdRanId) {
        that = this;
        /** @type {?} */
        var isGeodesic = false;
        that.currentAnimation = new Bing.Maps.Animations.PathAnimation(routePath, function (coord, idx, frameIdx, rotationAngle, locations, truckIdRanId) {
            if (that.animationTruckList.length > 0 && that.animationTruckList.some(function (x) { return x == truckIdRanId; })) {
                /** @type {?} */
                var index = (frameIdx == locations.length - 1) ? frameIdx : frameIdx + 1;
                /** @type {?} */
                var rotationAngle = that.calculateBearing(coord, locations[index]);
                if (that.isOdd(frameIdx)) {
                    that.createRotatedImagePushpin(pin, truckUrl, rotationAngle);
                }
                else if (frameIdx == locations.length - 1) {
                    that.createRotatedImagePushpin(pin, truckUrl, rotationAngle);
                }
                pin.setLocation(coord);
            }
        }, isGeodesic, that.travalDuration, truckIdRanId);
        that.currentAnimation.play();
    };
    /**
     * @param {?} startLocation
     * @param {?} endLocation
     * @return {?}
     */
    RttamaplibComponent.prototype.CalculateNextCoord = /**
     * @param {?} startLocation
     * @param {?} endLocation
     * @return {?}
     */
    function (startLocation, endLocation) {
        try {
            /** @type {?} */
            var dlat = (endLocation.latitude - startLocation.latitude);
            /** @type {?} */
            var dlon = (endLocation.longitude - startLocation.longitude);
            /** @type {?} */
            var alpha = Math.atan2(dlat * Math.PI / 180, dlon * Math.PI / 180);
            /** @type {?} */
            var dx = 0.00015238794727909931;
            dlat = dx * Math.sin(alpha);
            dlon = dx * Math.cos(alpha);
            /** @type {?} */
            var nextCoord = new Microsoft.Maps.Location(startLocation.latitude + dlat, startLocation.longitude + dlon);
            dlat = null;
            dlon = null;
            alpha = null;
            dx = null;
            return nextCoord;
        }
        catch (error) {
            console.log('Error in CalculateNextCoord - ' + error);
        }
    };
    /**
     * @param {?} num
     * @return {?}
     */
    RttamaplibComponent.prototype.isOdd = /**
     * @param {?} num
     * @return {?}
     */
    function (num) {
        return num % 2;
    };
    /**
     * @param {?} x
     * @return {?}
     */
    RttamaplibComponent.prototype.degToRad = /**
     * @param {?} x
     * @return {?}
     */
    function (x) {
        return x * Math.PI / 180;
    };
    /**
     * @param {?} x
     * @return {?}
     */
    RttamaplibComponent.prototype.radToDeg = /**
     * @param {?} x
     * @return {?}
     */
    function (x) {
        return x * 180 / Math.PI;
    };
    /**
     * @param {?} origin
     * @param {?} dest
     * @return {?}
     */
    RttamaplibComponent.prototype.calculateBearing = /**
     * @param {?} origin
     * @param {?} dest
     * @return {?}
     */
    function (origin, dest) {
        try {
            /** @type {?} */
            var lat1 = this.degToRad(origin.latitude);
            /** @type {?} */
            var lon1 = origin.longitude;
            /** @type {?} */
            var lat2 = this.degToRad(dest.latitude);
            /** @type {?} */
            var lon2 = dest.longitude;
            /** @type {?} */
            var dLon = this.degToRad(lon2 - lon1);
            /** @type {?} */
            var y = Math.sin(dLon) * Math.cos(lat2);
            /** @type {?} */
            var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
            lat1 = lat2 = lon1 = lon2 = dLon = null;
            return (this.radToDeg(Math.atan2(y, x)) + 360) % 360;
        }
        catch (error) {
            console.log('Error in calculateBearing - ' + error);
        }
    };
    /**
     * @param {?} form
     * @return {?}
     */
    RttamaplibComponent.prototype.SendSMS = /**
     * @param {?} form
     * @return {?}
     */
    function (form) {
        // if(this.technicianPhone != ''){
        if (form.value.mobileNo != '') {
            if (confirm('Are you sure want to send SMS?')) {
                // this.mapService.sendSMS(this.technicianPhone,form.value.smsMessage);
                this.mapService.sendSMS(form.value.mobileNo, form.value.smsMessage);
                form.controls.smsMessage.reset();
                form.value.mobileNo = this.technicianPhone;
                jQuery('#myModalSMS').modal('hide');
                //this.toastr.success('SMS sent successfully', 'Success');
            }
        }
    };
    /**
     * @param {?} form
     * @return {?}
     */
    RttamaplibComponent.prototype.SendEmail = /**
     * @param {?} form
     * @return {?}
     */
    function (form) {
        // if(this.technicianEmail != ''){
        if (form.value.emailId != '') {
            if (confirm('Are you sure want to send Email?')) ;
        }
    };
    /**
     * @param {?} form
     * @return {?}
     */
    RttamaplibComponent.prototype.SearchTruck = /**
     * @param {?} form
     * @return {?}
     */
    function (form) {
        /** @type {?} */
        var that = this;
        //$('#loading').show();
        if (form.value.inputmiles != '' && form.value.inputmiles != null) {
            /** @type {?} */
            var lt = that.clickedLat;
            /** @type {?} */
            var lg = that.clickedLong;
            /** @type {?} */
            var rd = form.value.inputmiles;
            this.foundTruck = false;
            this.animationTruckList = [];
            if (this.connection !== undefined) {
                this.connection.unsubscribe();
            }
            this.loadMapView('road');
            that.LoadTrucks(this.map, lt, lg, rd, true);
            form.controls.inputmiles.reset();
            jQuery('#myRadiusModal').modal('hide');
            setTimeout(function () {
                //$('#loading').hide();
            }, 10000);
        }
    };
    /**
     * @param {?} i
     * @return {?}
     */
    RttamaplibComponent.prototype.getMiles = /**
     * @param {?} i
     * @return {?}
     */
    function (i) {
        return i * 0.000621371192;
    };
    /**
     * @param {?} i
     * @return {?}
     */
    RttamaplibComponent.prototype.getMeters = /**
     * @param {?} i
     * @return {?}
     */
    function (i) {
        return i * 1609.344;
    };
    /**
     * @param {?} data
     * @return {?}
     */
    RttamaplibComponent.prototype.stringifyJson = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return JSON.stringify(data);
    };
    /**
     * @param {?} data
     * @return {?}
     */
    RttamaplibComponent.prototype.parseToJson = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return JSON.parse(data);
    };
    /**
     * @param {?} number
     * @param {?} precision
     * @return {?}
     */
    RttamaplibComponent.prototype.Round = /**
     * @param {?} number
     * @param {?} precision
     * @return {?}
     */
    function (number, precision) {
        /** @type {?} */
        var factor = Math.pow(10, precision);
        /** @type {?} */
        var tempNumber = number * factor;
        /** @type {?} */
        var roundedTempNumber = Math.round(tempNumber);
        return roundedTempNumber / factor;
    };
    /**
     * @param {?} y
     * @param {?} x
     * @return {?}
     */
    RttamaplibComponent.prototype.getAtan2 = /**
     * @param {?} y
     * @param {?} x
     * @return {?}
     */
    function (y, x) {
        return Math.atan2(y, x);
    };
    /**
     * @param {?} color
     * @param {?} sourceLat
     * @param {?} sourceLong
     * @param {?} destinationLat
     * @param {?} destinationLong
     * @return {?}
     */
    RttamaplibComponent.prototype.getIconUrl = /**
     * @param {?} color
     * @param {?} sourceLat
     * @param {?} sourceLong
     * @param {?} destinationLat
     * @param {?} destinationLong
     * @return {?}
     */
    function (color, sourceLat, sourceLong, destinationLat, destinationLong) {
        /** @type {?} */
        var iconUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAA3ZJREFUaIHtl11IU2EYx/9vuVqQaxeB6wv0KscIF4G0bpoaZnWzhVpdVEp1ERrmpChvMgjrIhT6oKBZ6EXUAueNaFH0QTSxyAWVXRQuP1Avsu3M5nHani7clunZx9lmCL6/q3PO8/Kc//95vwEOh8PhcDgcDoezVGGpSEJEagBVqcglgYsx1hwpmJZsdiJSByjwYcz3c+2wZ8SfbL65bFmvUxORkTFWLhWX3QPBau8EoA9+0k9Mifu2Xd2pEEQhCanSWPIqYTFWAEAWY8w1Ny6rB4ioajrw+1LasuWr+370j49PeqczVBlK19h3thDiAcDh6gZQAQCZABI3QET3AJRde3UbVkcLBFFYDcxUaEdmborkyicuAyHxlrZa2HrsCyxJHstiNVjM4oEYBha7eCCKASIyYpGLB6LMgclp/5nX395M2Xrsiv8pSC4RDaxMW7G3vfdJXEnSlekpEzSXNUpV1HjUVWjAPRTzB4LohU6TjRK9Ka72cinOMYUenVLxpI8Sth47SvUmNJovJ5sqGtWMMbdUIGkDgiig8JYZhqzUb2alejNK9CYgQvWBJAzoNFp8GukNvzv6uhNNNS9XCEMcO7wsAyqlCg2mehRpC8LfGp7fQMOLm3LShDm2/Qhq8iqhCi4CDlc3LPZaWXNJloGmQ9exSb0Rxx+cgkcUoNNoUWOswJpVKlzokDcHjhuOoq7oHJq6WtD55RkAoMZYCVt5M3bf2o94D4cRDYjT4qhOo80IDY0i7S4YMnNhaNwVrpCjrxuD7iFYD16H1dEiq3IWYwUeOdv+MV7cdwRd1c9QutUMq6MZOet0UwAUkDiFxjSgTFPePptfVeuZ8CgG3EMo3JyPLtfbeSI7e58CAAqzCyTHsRQ6jRYqZTpszvk7vM1px+7sfBARCjYbFQBeSt0DYhpgjNURkbrRfDl8VRzxjvoBrJjdThXcaC7uOR+X+NlIbVKb1BtmenpmAr8EYJrXaLbOeH5ERHrMXCjsdZ1XYHX8vaI2mOpRutUMAGYAkmu1FOOTvgOD7sET++8eXh4a7zqNFo9PtoaFR1r7E4aIyoiIPg730p03zdT/c5CClCWQSy2I3q/ChBB4+L6VOj4/JSKiQCDgCRZsYSAiozg12f7j15jT55+4Hzy1JppLTUSnPaL3nc/v6yKiuuCdm8PhcDicpcEfk3eALbc1+VQAAAAASUVORK5CYII=";
        if (color.toLowerCase() == "green") {
            iconUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAA3ZJREFUaIHtl11IU2EYx/9vuVqQaxeB6wv0KscIF4G0bpoaZnWzhVpdVEp1ERrmpChvMgjrIhT6oKBZ6EXUAueNaFH0QTSxyAWVXRQuP1Avsu3M5nHani7clunZx9lmCL6/q3PO8/Kc//95vwEOh8PhcDgcDoezVGGpSEJEagBVqcglgYsx1hwpmJZsdiJSByjwYcz3c+2wZ8SfbL65bFmvUxORkTFWLhWX3QPBau8EoA9+0k9Mifu2Xd2pEEQhCanSWPIqYTFWAEAWY8w1Ny6rB4ioajrw+1LasuWr+370j49PeqczVBlK19h3thDiAcDh6gZQAQCZABI3QET3AJRde3UbVkcLBFFYDcxUaEdmborkyicuAyHxlrZa2HrsCyxJHstiNVjM4oEYBha7eCCKASIyYpGLB6LMgclp/5nX395M2Xrsiv8pSC4RDaxMW7G3vfdJXEnSlekpEzSXNUpV1HjUVWjAPRTzB4LohU6TjRK9Ka72cinOMYUenVLxpI8Sth47SvUmNJovJ5sqGtWMMbdUIGkDgiig8JYZhqzUb2alejNK9CYgQvWBJAzoNFp8GukNvzv6uhNNNS9XCEMcO7wsAyqlCg2mehRpC8LfGp7fQMOLm3LShDm2/Qhq8iqhCi4CDlc3LPZaWXNJloGmQ9exSb0Rxx+cgkcUoNNoUWOswJpVKlzokDcHjhuOoq7oHJq6WtD55RkAoMZYCVt5M3bf2o94D4cRDYjT4qhOo80IDY0i7S4YMnNhaNwVrpCjrxuD7iFYD16H1dEiq3IWYwUeOdv+MV7cdwRd1c9QutUMq6MZOet0UwAUkDiFxjSgTFPePptfVeuZ8CgG3EMo3JyPLtfbeSI7e58CAAqzCyTHsRQ6jRYqZTpszvk7vM1px+7sfBARCjYbFQBeSt0DYhpgjNURkbrRfDl8VRzxjvoBrJjdThXcaC7uOR+X+NlIbVKb1BtmenpmAr8EYJrXaLbOeH5ERHrMXCjsdZ1XYHX8vaI2mOpRutUMAGYAkmu1FOOTvgOD7sET++8eXh4a7zqNFo9PtoaFR1r7E4aIyoiIPg730p03zdT/c5CClCWQSy2I3q/ChBB4+L6VOj4/JSKiQCDgCRZsYSAiozg12f7j15jT55+4Hzy1JppLTUSnPaL3nc/v6yKiuuCdm8PhcDicpcEfk3eALbc1+VQAAAAASUVORK5CYII=";
        }
        else if (color.toLowerCase() == "red") {
            iconUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAA0xJREFUaIHtlz1sEmEcxp9XhBQDhRA/MCSNTUy8tEsXXEsgcdABqoOTpA4ukKAOxsYuDkJ0rdHo1JQmbgYcXPxKnDTgUAdtmzSxIUCKRCweoQV693eAu2h7BQ5a08T3Nx33P557nvfr3hfgcDgcDofD4XA4/ytsL0SIyA7g+l5oabDKGJvbrXi4X3UiskOWP2/9/Hm0XijU+9XbzpGRETsReRhjV7Xqunug1drjAMZat8bkzc0LXzweoySKfVjVxhkOwxkKAcAwY2x1e11XDxDRdZKke8xgsNQymYpUqWyZjh8fqGUybD/MA0AlnVYuTwHoPQARzQKYLDx9imI8DkkULUCzhSxu91547YmuAijmM9PTKCWT+2xJH4c6PXCQzQMdAhx080CbAETkwQE3D7SZA1Sv3xI/fGiUkknjvzSkl10DMJPp/PqrV12JGKzWPTOkV7vtKlTP5zu+QBJFmAUBDr+/q+f14vD7lcsFrXrfW4lSIgFHIIChWKxfqXbcZIytaxX6DiCJIpYvXoTl7Nl+pXbgCASUHtBsfaCPAGZBwMbSkvq7kkr1KrVDS6GbL7yuAAarFUPRKGw+n3pv7dEjrD1+rEdG5diVK3CGw+pEraTTyExPo57Lda2hK8Dww4cwuVz4Fomok9cZCsEwOIjc/fv6zAeDcN2+jeL8PMrv3gEAnKEQTs/OYvnSJXS7Odw1gLy5WTALwgllaNh8Pljcbnw9d05toUoqhXouh+GZGRTn53W1nDMUQunFi7+Cr6RSGHn9Go6JCRTjcRwZHW0AMEJjF9oxwKGBgScnI5E7UrlsrOfzsHm9qKTTO0yW375tBvR6NcexFmZBgMFq1fzCl5JJ2LxegAiD4+NGAO+1zgEdAzDG7hKRfSgWU4+KjeaJy/Tnc8r4dU1NdWVe679/YnK5YHG7lQn8HkCgnUZXJzIiGkPzQJHIPXiAYjyu1oaiUTgCAQCYAKC5VmshV6uXa9nstZVg0KCMd7Mg4Mzz56rx3db+niGiSSKi6uIifZ+bo1o2Sy0me9CyS6K4svXrl/wjkaD1N2+aSrJcbjXY/kBEHrlWe9kolRakjY1nrV1rr1p2IrohieKnrWr1IxHdbZ25ORwOh8P5P/gNqhx/6rsujjgAAAAASUVORK5CYII=";
        }
        else if (color.toLowerCase() == "yellow") {
            iconUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAyhJREFUaIHtlz1MU1EYht/vYhWNaZtghAGNmICJVmFwMCFRHEwEE8VJnMRBnRQdygAODrroYCILuBgWYdPEyGRixBQcHCD+DKhAWiM41HgJlJ/bnteht/Wntz+3BUPCeabe+528fb/vnHvOdwCNRqPRaDQajUazUZHVECHpB9CxGloOTItIf7bgplLVSfpBNQ7rxw4sflspVS8D3yE/ySYRuegUdj0DdrWPAWiwXzUgsXgq8eKgB5ZZglNnpK4TRl0QAGpEZPrfuKsZINkBxm9DNm1HbHIe1nwc5VXlXJiUtTAPAIiGAAQBYA+A4hMg+QhAu/p0H5zqAyxzO5CskFQ0rpJb9xSUQMo8x6+BkYE1tuQOI9+AP82rdWYeyJPAejcP5EiAZBPWuXkg1zeQWA4yOmypyIDnP/pxTfYEyra0YOZZYSoe7yrZcdL25Qzn3IUYC+fVl7gJ8QYgu9qAAsa7RarPpX6OOcVLbiVUZBBG9XkY9T2lSuXihoj8dAqUnAAsE2q4aU0OM6luS85sluoDJSQg3gA49z79zGioWKkMrTQVjXmbNXcJeHww6h9AqlrSrzhxF2riniuZFEbNZUhdZ/pDZTQEjl8r6NtL4SoB43A/ZNtuqLcXAMuE+AKQ2k6Ixw9+6HZnfu8VyP7bUFMPgdkhAHbneeQpEq+Po9DmMPtJnFj6Lr5A+lGqWiAVjVCjreDsEBgNQU32QY1fTVZy225XCUhtEIwMgh+6k5WPhqBGzwACGMl1D/E3WPbwjC40RY5zoLxX9nV1iWV6EAtDKpvB6EjG9DJVvcqTgNM6djLvDQAeH/h1MCOmIoOQymYYJGTnCQ+AV073gLwJiMgtkn6jvuf3VXFpZgXA5r8G2utXDtxxfztyOKRk667kjpbc1V4BaM0lUdB/kmxA8kLxhB9vQk32pWNGfU9qqzsLwHGvdiQxf46x8CU1crostd7FG4Bx9GXaeLa9v2hItpOkMt8x8aWXXAjTpr0ILT9X5j7TMpUKD1DNPLellGkXbG0g2cT40nMuR8cYjz22u9Zitfwkr3PFfMv4whuSt+w7t0aj0Wg0G4NfTixkfFxyXPEAAAAASUVORK5CYII=";
        }
        else if (color.toLowerCase() == "purple") {
            iconUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF62lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wMy0wM1QxMTo0MDozNy0wNTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDMtMDNUMTE6NTM6MjUtMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMDMtMDNUMTE6NTM6MjUtMDU6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YTlhYTYxZGYtY2VhNC0wYzQyLThhZTAtZjY1ZTdhNWIwMjBhIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MTI4NmYzZGUtZDdjNS1kZTRmLTg5NGYtMWYzODk2YmM5ZjFkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTdkNDRmN2EtMjJlYy1hODQ0LTlmOWItMTA3YjFhNWY2OTcyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphN2Q0NGY3YS0yMmVjLWE4NDQtOWY5Yi0xMDdiMWE1ZjY5NzIiIHN0RXZ0OndoZW49IjIwMTgtMDMtMDNUMTE6NDA6MzctMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmE5YWE2MWRmLWNlYTQtMGM0Mi04YWUwLWY2NWU3YTViMDIwYSIgc3RFdnQ6d2hlbj0iMjAxOC0wMy0wM1QxMTo1MzoyNS0wNTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6RQ2cXAAACS0lEQVRo3u2YvUoDQRDH8wh5BN9AH8DC2kYrWwXt1V7RWhu7lIKKWCkqNoKooKBEJSDED0wRjSSScGLiJWZzd+v+z9uwhHxe9uCEGRhCNnez85udnZ1NhHMe+c8aIQACIAACIAACIAACIAACIADtAL2IeD4qdCkgnVTm0Q8A5x2bp8sFZhaS35+6lf/JujYAL9pjSoT2ahWb7Qzf8o3Ba+2aiGU8Bj7QN4AYn7UtpwRrxddKCREq51nl465YC8J56PHMgwQY6QsAywgriIgabXzPxr94qAGk85eLqaZLHGqAds6HHqCT86EG8F5o63yoAeyqc/R2/sm6KXNhXYGO0ZcAxqMZGMDp/LN/ANB3miC+mnatXyyk+PH0g3Z9PTEkQDQQAJwJxpPJA5a5nluJbgHUXNWtqYN8PX20AxxO3GvL81a2lD5IDwDSRclJLlsLv47HV9K8WqzVbaGa7Y4mggPABKX3H7cy4DdsYDiQ3Mr27ry3+fGuTBnXfuan3mv1BSBa5BwmaSxnaoTajXdSgCPHG8cRIDkvziHZSvtZgeVa2WayPL7s51seWBCkQ7elEc+22mPyYJTPCDnzfSMTn2tqvpu5arVZGfUrWL1Ge0rlcZ1H/e/7Sim+DwkddyOtpBUUK+PJuHdadqXMtGLGs2mpdwtUo2aOa7sTi/EpWEfrkNzMuhvOk6lIjwIHWcl6EXvBQRDq1c3hXwhYi3e03IlH0OhVDJYQG31bVgg/4rUHcwLkhpWtK+y7ZpH3BUB/bBEAARAAARDAf9BfRb64KYflRLAAAAAASUVORK5CYII=";
        }
        return iconUrl;
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    RttamaplibComponent.prototype.locatepushpin = /**
     * @param {?} obj
     * @return {?}
     */
    function (obj) {
        /** @type {?} */
        var truckId = obj.truckId;
        /** @type {?} */
        var searchPin;
        for (var i = 0; i < this.dataLayer.getLength(); i++) {
            searchPin = this.dataLayer.get(i);
            if (searchPin.metadata.truckId.toLowerCase() !== truckId.toLowerCase()) {
                searchPin = null;
            }
            else {
                break;
            }
        }
        // If a pin is found with a matching ID, then center the map on it and show it's infobox.
        if (searchPin) {
            // Offset the centering to account for the infobox.
            this.map.setView({ center: searchPin.getLocation(), zoom: 17 });
            // this.displayInfoBox(searchPin, obj);
        }
    };
    /**
     * @param {?} location
     * @param {?} url
     * @param {?} rotationAngle
     * @param {?} callback
     * @return {?}
     */
    RttamaplibComponent.prototype.createRotatedImagePushpin = /**
     * @param {?} location
     * @param {?} url
     * @param {?} rotationAngle
     * @param {?} callback
     * @return {?}
     */
    function (location, url, rotationAngle, callback) {
        /** @type {?} */
        var img = new Image();
        img.onload = function () {
            /** @type {?} */
            var c = document.createElement('canvas');
            /** @type {?} */
            var rotationAngleRads = rotationAngle * Math.PI / 180;
            c.width = 50;
            c.height = 50;
            /** @type {?} */
            var context = c.getContext('2d');
            // Move to the center of the canvas.
            context.translate(c.width / 2, c.height / 2);
            // Rotate the canvas to the specified angle in degrees.
            context.rotate(rotationAngleRads);
            // Draw the image, since the context is rotated, the image will be rotated also.
            context.drawImage(img, -img.width / 2, -img.height / 2);
            // anchor: new Microsoft.Maps.Point(24, 6)
            if (!isNaN(rotationAngleRads) && rotationAngleRads > 0) {
                location.setOptions({ icon: c.toDataURL(), anchor: new Microsoft.Maps.Point(c.width / 2, c.height / 2) });
            }
            // return c;
        };
        // Allow cross domain image editting.
        img.crossOrigin = 'anonymous';
        img.src = url;
    };
    /**
     * @return {?}
     */
    RttamaplibComponent.prototype.getThresholdValue = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.mapService.getRules(this.techType)
            .subscribe(function (data) {
            /** @type {?} */
            var obj = JSON.parse((_this.stringifyBodyJson(data)).data);
            if (obj != null) {
                /** @type {?} */
                var idleTime = obj.filter(function (element) {
                    if (element.fieldName === 'Cumulative idle time for RED' && element.dispatchType === _this.techType) {
                        return element.value;
                    }
                });
                if (idleTime != undefined && idleTime.length > 0) {
                    _this.thresholdValue = idleTime[0].value;
                }
            }
        }, function (err) {
            console.log(err);
        });
    };
    /**
     * @param {?} data
     * @return {?}
     */
    RttamaplibComponent.prototype.stringifyBodyJson = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return JSON.parse(data['_body']);
    };
    /**
     * @param {?} recordDatetime
     * @return {?}
     */
    RttamaplibComponent.prototype.UTCToTimeZone = /**
     * @param {?} recordDatetime
     * @return {?}
     */
    function (recordDatetime) {
        /** @type {?} */
        var recordTime;
        /** @type {?} */
        var recorddTime = utc(recordDatetime);
        // var recorddTime = momenttimezone.tz(recordDatetime, "America/Chicago");
        if (this.loggedInUserTimeZone == 'CST') {
            recordTime = recorddTime.tz('America/Chicago').format('MM-DD-YYYY HH:mm:ss');
        }
        else if (this.loggedInUserTimeZone == 'EST') {
            recordTime = recorddTime.tz('America/New_York').format('MM-DD-YYYY HH:mm:ss');
        }
        else if (this.loggedInUserTimeZone == 'PST') {
            recordTime = recorddTime.tz('America/Los_Angeles').format('MM-DD-YYYY HH:mm:ss');
        }
        else if (this.loggedInUserTimeZone == 'Alaska') {
            recordTime = recorddTime.tz('US/Alaska').format('MM-DD-YYYY HH:mm:ss');
        }
        return recordTime;
    };
    /**
     * @param {?} map
     * @param {?} dirManager
     * @return {?}
     */
    RttamaplibComponent.prototype.addTicketData = /**
     * @param {?} map
     * @param {?} dirManager
     * @return {?}
     */
    function (map, dirManager) {
        var _this = this;
        /** @type {?} */
        var that = this;
        this.UpdateTicketJSONDataList();
        /** @type {?} */
        var initIndex = 1;
        this.ticketData.forEach(function (data) {
            /** @type {?} */
            var ticketImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAtCAYAAADcMyneAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANOSURBVFiFzZlPSBRRGMB/39tMCCN3Ny3ILlGC/TlYUOCfTYIwISjwVnTpVHTJg1EgCdVFq1sRHSLonIe6WFGkq7sVFEhhmuWtP4TMiiiFujOvQ6M76qw67rjj7zbvffN9Px6zO+99I6wA3UChMU6tCLVaqBSLXQhbgCI7ZALNbxGGNPRpiEeL6JVOJr3WEi/BozEqLYsLCI1Ascdao0CHMrkbTtLnq2Cqjr3a5BZQ71EqW9VOTJqjCfqXDl0EvYf1qQg3gCZgnS9yGdJauB01uCr9THkWNOooE5MnGvb7LDbf4L2e5uTmN/xwn3aTq2YPIZ6j2baqchm+A/XRHj7Pn1ggOFJDuRK6ga35MHPwywwRK+3im3NwjuBINRuV4h1QkVe1DENSyMHIS8ZmBpRzVikeEpwcQLme5L5zYHYFjVoagcd5V3LBEk6UxHkKtqA+QEFqA4PAjkDNbAS+hUNUSBdpBWBs4DRrRA5Aw04jzSmwn0GB88EqLUSEcwBi/618CVrIjZDJTiXi0/t1FbAU9UqgKmiRbFhQrYDdQYtkRahQQFnQHotQpsjsgtccApsUeN+G55G/CvgZtMUi/FQCv4K2WIQfyoKBoC2yITCogBdBi2RF81zsTaoBFATtM48pM0RUlSQYZw2uosCz0i4mFIAS2oMWcqEd7O1WOE4cSAaq40TTE+khAc4zidAMmEE5OTDRXJq5mBWMxklqzc1gnDIItEUTvHVcZ9ANFI5OkFz1bkIWBD6EU1Q5WyFzjp3SyWQBHIOFJ/w8MJQOcXx+n8a99VFHGSbd5OkgpWFYW8RKEgv3BcrthmgX3wtCHELoXH09XplTVLvJwVLtN1BGLZcFWoH1PotNidAajtMmoLMFLauBacTYDrSgOUvufUILoSOU5kpxkuGlgj21gEdqKFdwxm4Be+3hDKDpMBWPSuN8Xe5NngSdpGLs05puILxE6KgIhyNxPq2kjuuPZDnYBa8vI/TaSuUgB0GAyB/uAEPZ5jUMR4q4l0uNnATlA9PW/3e4e3JN00q+jcypkcvNMxg1vEA4Oiex5nWklyO55s5pBWfRNAFpx4iJcNGP1L4I2h9kHs4OCA8iPXz0I7c/KwhMm7QAY8C4qWj1K+8/dkjlffe0168AAAAASUVORK5CYII=";
            if (data.ticketSeverity === "Unknown" || data.ticketSeverity === "Warning" || data.ticketSeverity === "Minor") {
                ticketImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAzCAYAAADsBOpPAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAPySURBVGiB7ZhPiBt1FMe/7yXT1d3FQhGKeKnoKtjsWmlvxRah9qLVS6dJZoOuBw+WQi/1tIcWvOiWslS9uAeJaya/bIMHKYqohxQUQYhaNpWyWFBWoi30oCh1N5Pf87DbkJ1MJpOdZBKwn1ve7/1+75Nh5vePsA1M09xhGMZBAIcAPA3gCQC7AYxvpvxNRH+IyAqAH5j5yujo6DcLCwu17dRrhrpJTqfTe4noFIATAHZ1Wes2gEtE9J5t2z912bdBIOFkMvl4LBabA/Bi0D4+CIBPmPmNXC73c7edfYubphmLx+OzRDQLYMd2DduwJiJvOo7zVrFYrAft1FY4nU4/SEQfY+M97RsiUjIM4/ji4uLtIPmewqlUag8zfwFgoqd27VkBcDSfz//aKbFFOJ1O7yaiK9j48qPkBjM/k8vlfvdL4uYfMzMz9xHRp4heFgAe1Vp/Zprm/X5JW4TX19fnAezvq5Y/+wzDmPNLaLwSlmUdAlBC+GkrLFpEDiulvvZqvPuECcBFDF4WAJiI5tHGhQEgk8kcA7AvSqsOHJienn7eq4EBQGt9MlqfzojI615xymQyD2mtVwHEInbqRF1EHlZK3WwOsogcxfDJAhtOz7mDrLXu69IbBiI67I4xM+8dhEwQiOhJd4xFZM8AXAIhIo+4Ywxg5wBcgtLixl5ZQ0SLHwO46ZE4LFTdAfYKDhGewh03zQOkxY03N+tDiYiU3DGu1+ufD8AlECLylTvGhULhFwDXo9fpyLVNty0wAIjIu5HrdOYdryADwMjIyAcYruntVq1W+8irgQEgm83+C2A+UiV/zheLxTteDY2VpFqtXgDwXWRK7fl+fHz8YrvGhnCpVHJE5BUAnv8sItZE5GW/W84ta7VS6jqA1wDofpt5oEXkVaXUNb+klpPG8vLyciKRWCWiXtxUBkVE5KRSKtsp0fNoVKlUfpycnLwFIIrj07qInFJKvR8k2fcJplKpA8x8CUDLRrpH/CYiJ5RS3wbt4Pv0KpVKNZFI2ET0AICnOuV3QQ3AQjweT9q2vdJNx8DvaCaTeUxrfQ7AcQAj3fk1WCOiouM455aWlm5sZ4CuPyrTNHcahvECgCSAYwG7XQawRESXbdv+q9uazYSaBSzL+hLAEb8cESkppZ4NU6eZUGc6Zj4D/zlbE9GZMDVaaobpnMvlrgJY9En5MJ/Pl8PUcBP61Ky1ngXwj0fTHa312bDjuwktXCgUqkR0waNprlAorIYd301P7iXGxsbeBtAsV43FYud7MbabniwE5XK5NjU19SeAlwBARE7btt2XrWrPbn4mJiayAMoictVxHL8PcXiwLOuIZVm+8/I97vF/5z/d0joEPzhZGgAAAABJRU5ErkJggg==";
            }
            else if (data.ticketSeverity === "Major") {
                ticketImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAzCAYAAADsBOpPAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOySURBVGiB7ZhNaBxlGICfd2ZNalsoiFBUhLbZTfpzMNLgQTFFqL1oPZV4UZvdpJTWHuspggEvmlJCVdCg5sciYsSD9CLqIYGKILbaQ2q73a2GltgKBRVNmuzOvB4S083szOzMzu7sgn1u837v930PH7vfzytUw+RMCwutT2BrN/Ao0AFsBjauZPyNcgMhC/wITLP057cc7ipUNV8JEip7/MouVI6B9gD3hZzrFsIkNu+QSV0M2XeVYMIT+XZsewh4LnAfbxT4AkteoT+ZC9vZf/JJNZnPDaAMAC1VCnqxiMjrrG97gx6xgnbyFh65fD8txudAdy3sfJjCKB7g4I5bQZLdhcd+3gKJr4BUDcX8yGKZ++jfNlspsVz4/aubSdjToB11UfMmT6LwJC/u/M0vaa3w2C/roHgW2F1PMx9+YsO6x+l5eMErwVj7aQ3TOFmATuZvD/kl3Fnh8Ww3KlNE37aiYmMbe+hrO+vWuLzCqoLKKRovC2Bg2sOourosC0/k9gOdcVr5onQxduUZt6aVFeZorEJBEI64h09ffIDiPdcAM2alSlgUzYc4tO1madCg0LKP5pMFMDGtp51BA9F6H73VY7CnPAS7GqASDGWnM2QAW+I3CYpsdUYMYFMDTAKiZW6GW1oTUeZnADddEpuFOWfAQMuDTYOoi7BoxUtzw1ApczOA6QaoBEOZcoYMsL5sgEowpPiNM2SQ3vErcCl+m4rMrLit4b9t4+14XQIg8pZbeEU4MUpzbW+/s771tFvDsnB6621gOE4jX1ROeD1E75wks9dPAt/H5eTDeQp/nPJqdDzzL28H4zxwb72tPFhE2E1vasYrYe1Zne64hHAIsOtt5oKNatpPFtwuP72pj1HtZ7nKGBeK6lEy7Z9USnS/rWXax1BeBiIXoAOwhOoRMu0jQZL96xAf5rsw7Emg7CJdE4TrCD0cTH0XtIv/fbiv7QeW7MdA3qO2q11AeBcpdoaRhTCVng9ySUwdBA4AreH8VllE+AwYpDeVr2aA8KWpkfwmWu1nUZ4H9gfsdQbhUxKc4YXUX6HnLCFaLW089zWqeytkTZFOPRVpnhKiveks6zj+e7aNyPFIcziIJtzXcQHkI892YYLe5LlIcziI/mq2iwPAPy4tC9jyWuTxHUQX7ts+h3LSpWWITPJa5PEd1KYuUdjwJlAqN4c5f6ImYzuojfDhB+eBwdVv1Vd56RG3n0lkalf5mU2OA+eAC2xMef8Rm4rR7F5Gs5X25bvc5X/Nv1oY9qdbFkl0AAAAAElFTkSuQmCC";
            }
            /** @type {?} */
            var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(data.latitude, data.longitude), { icon: ticketImage, text: initIndex.toString() });
            pushpin.metadata = data;
            map.entities.push(pushpin);
            _this.dataLayer.push(pushpin);
            Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked);
            map.setView({ mapTypeId: Microsoft.Maps.MapTypeId.road, center: new Microsoft.Maps.Location(data.latitude, data.longitude) });
            initIndex = initIndex + 1;
        });
        $('.NavBar_Container.Light').attr('style', 'top:580px');
        /** @type {?} */
        var infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
            visible: false
        });
        /**
         * @param {?} e
         * @return {?}
         */
        function pushpinClicked(e) {
            if (e.target.metadata) {
                infobox.setMap(map);
                infobox.setOptions({
                    location: e.target.getLocation(),
                    visible: true,
                    offset: new Microsoft.Maps.Point(0, 20),
                    htmlContent: '<div class = "infy" style= "background-color: white;border: 1px solid lightgray; width:360px;">'
                        + getTicketInfoBoxHTML(e.target.metadata) + '</div>'
                });
            }
            $('.NavBar_Container.Light').attr('style', 'top:580px');
            pinClicked(e.target.metadata);
            Microsoft.Maps.Events.addHandler(infobox, 'click', close);
        }
        /**
         * @param {?} parms
         * @return {?}
         */
        function pinClicked(parms) {
            console.log('emit', that);
            that.ticketClick.emit(parms);
        }
        /**
         * @param {?} e
         * @return {?}
         */
        function close(e) {
            if (e.originalEvent.target.className === 'fa fa-times') {
                $('.NavBar_Container.Light').attr('style', 'top:0px');
                infobox.setOptions({
                    visible: false
                });
            }
        }
        /**
         * @param {?} data
         * @return {?}
         */
        function getTicketInfoBoxHTML(data) {
            console.log(data);
            /** @type {?} */
            var infoboxData = "<div class='row' style='padding-top:10px;padding-bottom:10px;margin: 0px;'>"
                + "</div>";
            return infoboxData;
        }
    };
    /**
     * @return {?}
     */
    RttamaplibComponent.prototype.UpdateTicketJSONDataList = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.ticketList.length != 0) {
            this.ticketList.TicketInfoList.TicketInfo.forEach(function (ticketInfo) {
                /** @type {?} */
                var ticket = new Ticket();
                ticketInfo.FieldTupleList.FieldTuple.forEach(function (element) {
                    if (element.Name === "TicketNumber") {
                        ticket.ticketNumber = element.Value;
                    }
                    else if (element.Name === "EntryType") {
                        ticket.entryType = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "CreateDate") {
                        ticket.createDate = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "EquipmentID") {
                        ticket.equipmentID = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "CommonID") {
                        ticket.commonID = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "ParentID") {
                        ticket.parentID = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "CustAffecting") {
                        ticket.custAffecting = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "TicketSeverity") {
                        ticket.ticketSeverity = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "AssignedTo") {
                        ticket.assignedTo = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "SubmittedBy") {
                        ticket.submittedBy = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "ProblemSubcategory") {
                        ticket.problemSubcategory = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "ProblemDetail") {
                        ticket.problemDetail = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "ProblemCategory") {
                        ticket.problemCategory = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "Latitude") {
                        ticket.latitude = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "Longitude") {
                        ticket.longitude = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "PlannedRestoralTime") {
                        ticket.plannedRestoralTime = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "AlternateSiteID") {
                        ticket.alternateSiteID = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "LocationRanking") {
                        ticket.locationRanking = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "AssignedDepartment") {
                        ticket.assignedDepartment = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "Region") {
                        ticket.region = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "Market") {
                        ticket.market = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "WorkRequestId") {
                        ticket.workRequestId = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "ShiftLog") {
                        ticket.shiftLog = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "Action") {
                        ticket.action = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "EquipmentName") {
                        ticket.equipmentName = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "ShortDescription") {
                        ticket.shortDescription = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "ParentName") {
                        ticket.parentName = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "TicketStatus") {
                        ticket.ticketStatus = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "LocationID") {
                        ticket.locationID = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "OpsDistrict") {
                        ticket.opsDistrict = element.Value === null ? '' : element.Value;
                    }
                    else if (element.Name === "OpsZone") {
                        ticket.opsZone = element.Value === null ? '' : element.Value;
                    }
                });
                _this.ticketData.push(ticket);
            });
        }
    };
    /**
     * @return {?}
     */
    RttamaplibComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.connection !== undefined) {
            this.connection.unsubscribe();
        }
    };
    RttamaplibComponent.decorators = [
        { type: Component, args: [{
                    selector: 'att-rttamaplib',
                    template: "  \n  <div id='myMap' style=\"padding: 0px 0px 0px 10px;\" #mapElement>\n  </div>\n  "
                }] }
    ];
    /** @nocollapse */
    RttamaplibComponent.ctorParameters = function () { return [
        { type: RttamaplibService },
        { type: ViewContainerRef }
    ]; };
    RttamaplibComponent.propDecorators = {
        someInput: [{ type: ViewChild, args: ['mapElement',] }],
        smspopup: [{ type: ViewChild, args: ['smspopup',] }],
        emailpopup: [{ type: ViewChild, args: ['emailpopup',] }],
        infoTemplate: [{ type: ViewChild, args: ['info',] }],
        ticketList: [{ type: Input }],
        loggedInUser: [{ type: Input }],
        ticketClick: [{ type: Output }]
    };
    return RttamaplibComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var RttamaplibModule = /** @class */ (function () {
    function RttamaplibModule() {
    }
    RttamaplibModule.decorators = [
        { type: NgModule, args: [{
                    imports: [],
                    declarations: [RttamaplibComponent],
                    exports: [RttamaplibComponent]
                },] }
    ];
    return RttamaplibModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { RttamaplibService, RttamaplibComponent, RttamaplibModule, TruckDetails, TruckDirectionDetails, Ticket };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vcnR0YW1hcGxpYi9saWIvcnR0YW1hcGxpYi5zZXJ2aWNlLnRzIiwibmc6Ly9ydHRhbWFwbGliL2xpYi9tb2RlbHMvdHJ1Y2tkZXRhaWxzLnRzIiwibmc6Ly9ydHRhbWFwbGliL2xpYi9ydHRhbWFwbGliLmNvbXBvbmVudC50cyIsIm5nOi8vcnR0YW1hcGxpYi9saWIvcnR0YW1hcGxpYi5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cCwgUmVzcG9uc2UsIFJlcXVlc3RPcHRpb25zLCBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3RvUHJvbWlzZSc7XG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcbmltcG9ydCB7IFRydWNrRGlyZWN0aW9uRGV0YWlscyB9IGZyb20gJy4vbW9kZWxzL3RydWNrZGV0YWlscyc7XG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyL3NyYy91dGlscy9jb2xsZWN0aW9uJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUnR0YW1hcGxpYlNlcnZpY2Uge1xuXG4gIG1hcFJlYWR5ID0gZmFsc2U7XG4gIHNob3dOYXYgPSB0cnVlO1xuICBob3N0OiBzdHJpbmcgPSBudWxsO1xuICBzb2NrZXQ6IGFueSA9IG51bGw7XG4gIHNvY2tldFVSTDogc3RyaW5nID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHtcbiAgICB0aGlzLmhvc3QgPSBcImh0dHBzOi8vemxkMDQwOTAudmNpLmF0dC5jb206ODQ0My9SQVBUT1IvXCI7XG4gICAgdGhpcy5zb2NrZXRVUkwgPSBcImh0dHBzOi8vemxkMDQwOTAudmNpLmF0dC5jb206MzAwN1wiO1xuICB9XG5cbiAgY2hlY2tVc2VySGFzUGVybWlzc2lvbih1c2VyTmFtZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHVzZXJzTGlzdFVybCA9IHRoaXMuaG9zdCArIFwiYXV0aHVzZXJcIjtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXNlcnNMaXN0VXJsLCB1c2VyTmFtZSkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRNYXBQdXNoUGluRGF0YShhdHRVSUQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzdXBlcnZpc29ySWQgPSBbXTtcbiAgICBzdXBlcnZpc29ySWQgPSBhdHRVSUQuc3BsaXQoJywnKTtcbiAgICB2YXIgdXNlcnNMaXN0VXJsID0gdGhpcy5ob3N0ICsgJ1RlY2hEZXRhaWxGZXRjaCc7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVzZXJzTGlzdFVybCwge1xuICAgICAgXCJhdHR1SWRcIjogXCJcIixcbiAgICAgIFwic3VwZXJ2aXNvcklkXCI6IHN1cGVydmlzb3JJZFxuICAgIH0pLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZmluZFRydWNrTmVhckJ5KGxhdCwgbG9uZywgZGlzdGFuY2UsIHN1cGVydmlzb3JJZCk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHN1cGVydmlzb3JJZHMgPSBbXTtcbiAgICBzdXBlcnZpc29ySWRzID0gc3VwZXJ2aXNvcklkLnNwbGl0KCcsJyk7XG4gICAgY29uc3QgZmluZFRydWNrVVJMID0gdGhpcy5ob3N0ICsgJ0ZpbmRUcnVja05lYXJCeSc7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGZpbmRUcnVja1VSTCwge1xuICAgICAgJ2xhdCc6IGxhdCxcbiAgICAgICdsbG9uZyc6IGxvbmcsXG4gICAgICAncmFkaXVzJzogZGlzdGFuY2UsXG4gICAgICAnc3VwZXJ2aXNvcklkJzogc3VwZXJ2aXNvcklkc1xuICAgIH0pLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0V2ViUGhvbmVVc2VyRGF0YShhdHRVSUQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBsZGFwVVJMID0gdGhpcy5zb2NrZXRVUkwgKyBcIi9nZXR0ZWNobmljaWFucy9cIiArIGF0dFVJRDtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChsZGFwVVJMKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFdlYlBob25lVXNlckluZm8oYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgbGRhcFVSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvZ2V0dGVjaG5pY2lhbmluZm8vXCIgKyBhdHRVSUQ7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQobGRhcFVSTCkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBHZXROZXh0Um91dGVEYXRhKGZyb21BdHRpdHVkZSwgdG9BdHRpdHVkZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHJvdXRlVXJsID0gXCJodHRwczovL2Rldi52aXJ0dWFsZWFydGgubmV0L1JFU1QvVjEvUm91dGVzL0RyaXZpbmc/d3AuMD1cIiArIGZyb21BdHRpdHVkZSArIFwiJndwLjE9XCIgKyB0b0F0dGl0dWRlICsgXCImcm91dGVBdHRyaWJ1dGVzPXJvdXRlUGF0aCZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQocm91dGVVcmwpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNbXCJfYm9keVwiXTtcbiAgICB9KTtcbiAgfVxuXG4gIEdldFJvdXRlTWFwRGF0YShkaXJEZXRhaWxzOiBhbnlbXSk6IGFueVtdIHtcbiAgICBsZXQgY29tYmluZWRVcmxzID0gW107XG4gICAgbGV0IHJvdXRlVXJsO1xuICAgIHZhciBuZXdSb3V0ZVVybDtcbiAgICBkaXJEZXRhaWxzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIHJvdXRlVXJsID0gXCJodHRwczovL2Rldi52aXJ0dWFsZWFydGgubmV0L1JFU1QvVjEvUm91dGVzLz93cC4wPVwiICsgaXRlbS5zb3VyY2VMYXQgKyBcIixcIiArIGl0ZW0uc291cmNlTG9uZyArIFwiJndwLjE9XCIgKyBpdGVtLmRlc3RMYXQgKyBcIixcIiArIGl0ZW0uZGVzdExvbmcgKyBcIiZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiXG4gICAgICBuZXdSb3V0ZVVybCA9IHRoaXMuaHR0cC5nZXQocm91dGVVcmwpXG4gICAgICBjb21iaW5lZFVybHMucHVzaChuZXdSb3V0ZVVybClcbiAgICB9KTtcbiAgICByZXR1cm4gY29tYmluZWRVcmxzO1xuICB9XG5cbiAgc2VuZEVtYWlsKGZyb21FbWFpbCwgdG9FbWFpbCwgZnJvbU5hbWUsIHRvTmFtZSwgc3ViamVjdCwgYm9keSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHNtc1VSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvc2VuZGVtYWlsXCI7XG4gICAgdmFyIGVtYWlsTWVzc2FnZSA9IHtcbiAgICAgIFwiZXZlbnRcIjoge1xuICAgICAgICBcInJlY2lwaWVudERhdGFcIjogW3tcbiAgICAgICAgICBcImhlYWRlclwiOiB7IFwic291cmNlXCI6IFwiS2VwbGVyXCIsIFwic2NlbmFyaW9OYW1lXCI6IFwiXCIsIFwidHJhbnNhY3Rpb25JZFwiOiBcIjUxMTExXCIgfSxcbiAgICAgICAgICBcIm5vdGlmaWNhdGlvbk9wdGlvblwiOiBbeyBcIm1vY1wiOiBcImVtYWlsXCIgfV0sXG4gICAgICAgICAgXCJlbWFpbERhdGFcIjoge1xuICAgICAgICAgICAgXCJzdWJqZWN0XCI6IFwiXCIgKyBzdWJqZWN0ICsgXCJcIixcbiAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keSArIFwiXCIsXG4gICAgICAgICAgICBcImFkZHJlc3NcIjoge1xuICAgICAgICAgICAgICBcInRvXCI6IFt7IFwibmFtZVwiOiBcIlwiICsgdG9OYW1lICsgXCJcIiwgXCJhZGRyZXNzXCI6IFwiXCIgKyB0b0VtYWlsICsgXCJcIiB9XSxcbiAgICAgICAgICAgICAgXCJjY1wiOiBbXSxcbiAgICAgICAgICAgICAgXCJiY2NcIjogW10sXG4gICAgICAgICAgICAgIFwiZnJvbVwiOiB7IFwibmFtZVwiOiBcIkFUJlQgRW50ZXJwcmlzZSBOb3RpZmljYXRpb25cIiwgXCJhZGRyZXNzXCI6IFwiXCIgfSwgXCJib3VuY2VUb1wiOiB7IFwiYWRkcmVzc1wiOiBcIlwiIH0sXG4gICAgICAgICAgICAgIFwicmVwbHlUb1wiOiB7IFwiYWRkcmVzc1wiOiBcIlwiIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICBcImF0dHJpYkRhdGFcIjogW3sgXCJuYW1lXCI6IFwic3ViamVjdFwiLCBcInZhbHVlXCI6ICBzdWJqZWN0IH0sXG4gICAgICAgIHsgXCJuYW1lXCI6IFwibWVzc2FnZVwiLCBcInZhbHVlXCI6IFwiVGhpcyBpcyBmaXJzdCBjYW11bmRhIHByb2Nlc3NcIiB9LFxuICAgICAgICB7IFwibmFtZVwiOiBcImNvbnRyYWN0b3JOYW1lXCIsIFwidmFsdWVcIjogXCJBamF5IEFwYXRcIiB9XVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuICAgIHZhciBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogaGVhZGVycyB9KTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Qoc21zVVJMLCBKU09OLnN0cmluZ2lmeShlbWFpbE1lc3NhZ2UpLCBvcHRpb25zKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRTTVModG9OdW1iZXIsIGJvZHlNZXNzYWdlKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgc21zVVJMID0gdGhpcy5zb2NrZXRVUkwgKyBcIi9zZW5kc21zXCI7XG4gICAgdmFyIHNtc01lc3NhZ2UgPSB7XG4gICAgICBcImV2ZW50XCI6IHtcbiAgICAgICAgXCJyZWNpcGllbnREYXRhXCI6IFt7XG4gICAgICAgICAgXCJoZWFkZXJcIjogeyBcInNvdXJjZVwiOiBcIktlcGxlclwiLCBcInNjZW5hcmlvTmFtZVwiOiBcIiBGaXJzdE5ldEluaXRpYWxSZWdpc3RyYXRpaW9uVXNlclwiLCBcInRyYW5zYWN0aW9uSWRcIjogXCIwMDA0XCIgfSxcbiAgICAgICAgICBcIm5vdGlmaWNhdGlvbk9wdGlvblwiOiBbeyBcIm1vY1wiOiBcInNtc1wiIH1dLFxuICAgICAgICAgIFwic21zRGF0YVwiOiB7XG4gICAgICAgICAgICBcImRldGFpbHNcIjoge1xuICAgICAgICAgICAgICBcImNvbnRhY3REYXRhXCI6IHtcbiAgICAgICAgICAgICAgICBcInJlcXVlc3RJZFwiOiBcIjExMTE2XCIsIFwic3lzSWRcIjogXCJDQlwiLCBcImNsaWVudElkXCI6IFwiUlRUQVwiLFxuICAgICAgICAgICAgICAgIC8vIFwicGhvbmVOdW1iZXJcIjogeyBcImFyZWFDb2RlXCI6IFwiXCIgKyB0b051bWJlci50b1N0cmluZygpLnN1YnN0cigwLCAzKSArIFwiXCIsIFwibnVtYmVyXCI6IFwiXCIgKyB0b051bWJlci50b1N0cmluZygpLnN1YnN0cigzLCAxMCkgKyBcIlwiIH0sIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keU1lc3NhZ2UgKyBcIlwiLFxuICAgICAgICAgICAgICAgIFwicGhvbmVOdW1iZXJcIjogeyBcImFyZWFDb2RlXCI6IFwiXCIsIFwibnVtYmVyXCI6IFwiXCIgKyB0b051bWJlciArIFwiXCIgfSwgXCJtZXNzYWdlXCI6IFwiXCIgKyBib2R5TWVzc2FnZSArIFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzY2VuYXJpb05hbWVcIjogXCIgRmlyc3ROZXRJbml0aWFsUmVnaXN0cmF0aWlvblVzZXJcIiwgXCJpbnRlcm5hdGlvbmFsTnVtYmVySW5kaWNhdG9yXCI6IFwiVHJ1ZVwiLCBcImludGVyYWN0aXZlSW5kaWNhdG9yXCI6IFwiRmFsc2VcIixcbiAgICAgICAgICAgICAgICBcImhvc3RlZEluZGljYXRvclwiOiBcIkZhbHNlXCIsIFwicHJvdmlkZXJcIjogXCJCU05MXCIsIFwic2hvcnRDb2RlXCI6IFwiMTExMVwiLCBcInJlcGx5VG9cIjogXCJETUFBUFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICBcImF0dHJpYkRhdGFcIjogW3sgXCJuYW1lXCI6IFwiYWRtaW5EYXRhMVwiLCBcInZhbHVlXCI6IDEyMzQ1NjcgfSwgeyBcIm5hbWVcIjogXCJjb250cmFjdG9yTmFtZVwiLCBcInZhbHVlXCI6IFwiY29udHJhY3RvciBuYW1lXCIgfV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICB2YXIgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IGhlYWRlcnMgfSk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHNtc1VSTCwgSlNPTi5zdHJpbmdpZnkoc21zTWVzc2FnZSksIG9wdGlvbnMpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VHJ1Y2tGZWVkKHRlY2hJZHM6IGFueSwgbWdySWQ6IGFueSkge1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG5cbiAgICAgIHRoaXMuc29ja2V0ID0gaW8uY29ubmVjdCh0aGlzLnNvY2tldFVSTCxcbiAgICAgICAge1xuICAgICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgICByZWNvbm5lY3Rpb246IHRydWUsXG4gICAgICAgICAgcmVjb25uZWN0aW9uRGVsYXk6IDEwMDAsXG4gICAgICAgICAgcmVjb25uZWN0aW9uRGVsYXlNYXg6IDUwMDAsXG4gICAgICAgICAgcmVjb25uZWN0aW9uQXR0ZW1wdHM6IDk5OTk5XG4gICAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNvY2tldC5lbWl0KCdqb2luJywgeyBtZ3JJZDogbWdySWQsIGF0dHVJZHM6IHRlY2hJZHMgfSk7XG5cbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdtZXNzYWdlJywgKGRhdGEpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG4gIC8vR2V0IFJ1bGUgZGVzaWduZWQgYmFzZWQgb24gdGVjaHR5cGUuXG4gIGdldFJ1bGVzKGRpc3BhdGNoVHlwZSkge1xuICAgIHZhciBnZXRSdWxlc1VybCA9IHRoaXMuaG9zdCArIFwiRmV0Y2hSdWxlXCI7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGdldFJ1bGVzVXJsLCB7XG4gICAgICBcImRpc3BhdGNoVHlwZVwiOiBkaXNwYXRjaFR5cGVcbiAgICB9KTtcbiAgfVxuXG4gIHN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2Uoa2V5LCBvYmplY3RUb1N0b3JlKVxuICB7XG4gICAgLy8gcmV0dXJuICBpZiB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGNvbXBsZXRlIHN0b3JhZ2UgdXNlIHRoZSBjbGVhcigpIG1ldGhvZCwgbGlrZSBsb2NhbFN0b3JhZ2UuY2xlYXIoKVxuICAgIC8vIENoZWNrIGlmIHRoZSBzZXNzaW9uU3RvcmFnZSBvYmplY3QgZXhpc3RzXG4gICBpZihzZXNzaW9uU3RvcmFnZSlcbiAgICB7XG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9TdG9yZSkpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3JlRGF0YUluTG9jYWxTdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShvYmplY3RUb1N0b3JlKSk7XG4gIH1cblxuICByZXRyaWV2ZURhdGFGcm9tTG9jYWxTdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgICAgdmFyIHJlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICBpZihyZXN1bHQhPW51bGwpXG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2Uoa2V5KVxuICB7XG4gICAgaWYoc2Vzc2lvblN0b3JhZ2UpXG4gICAge1xuICAgICAgdmFyIHJlc3VsdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgIGlmKHJlc3VsdCE9bnVsbClcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG59XG4iLCJleHBvcnQgY2xhc3MgVHJ1Y2tEZXRhaWxzIHtcbiAgIHB1YmxpYyBUcnVja0lkOiBzdHJpbmc7XG4gICBwdWJsaWMgRGlzdGFuY2U6IHN0cmluZzsgIFxufVxuXG5leHBvcnQgY2xhc3MgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxze1xuICAgIHB1YmxpYyB0ZWNoSWQ6IHN0cmluZztcbiAgICBwdWJsaWMgc291cmNlTGF0OiBzdHJpbmc7XG4gICAgcHVibGljIHNvdXJjZUxvbmc6IHN0cmluZztcbiAgICBwdWJsaWMgZGVzdExhdDogc3RyaW5nO1xuICAgIHB1YmxpYyBkZXN0TG9uZzogc3RyaW5nO1xuICAgIHB1YmxpYyBuZXh0Um91dGVMYXQ6IHN0cmluZztcbiAgICBwdWJsaWMgbmV4dFJvdXRlTG9uZzogc3RyaW5nO1xuICB9XG4gIFxuICBleHBvcnQgY2xhc3MgVGlja2V0e1xuICAgIHB1YmxpYyB0aWNrZXROdW1iZXI6IHN0cmluZztcbiAgICBwdWJsaWMgZW50cnlUeXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGNyZWF0ZURhdGU6IHN0cmluZztcbiAgICBwdWJsaWMgZXF1aXBtZW50SUQ6IHN0cmluZztcbiAgICBwdWJsaWMgY29tbW9uSUQ6IHN0cmluZztcbiAgICBwdWJsaWMgcGFyZW50SUQ6IHN0cmluZztcbiAgICBwdWJsaWMgY3VzdEFmZmVjdGluZzogc3RyaW5nO1xuICAgIHB1YmxpYyB0aWNrZXRTZXZlcml0eTogc3RyaW5nO1xuICAgIHB1YmxpYyBhc3NpZ25lZFRvOiBzdHJpbmc7XG4gICAgcHVibGljIHN1Ym1pdHRlZEJ5OiBzdHJpbmc7XG4gICAgcHVibGljIHByb2JsZW1TdWJjYXRlZ29yeTogc3RyaW5nO1xuICAgIHB1YmxpYyBwcm9ibGVtRGV0YWlsOiBzdHJpbmc7XG4gICAgcHVibGljIHByb2JsZW1DYXRlZ29yeTogc3RyaW5nO1xuICAgIHB1YmxpYyBsYXRpdHVkZTogc3RyaW5nO1xuICAgIHB1YmxpYyBsb25naXR1ZGU6IHN0cmluZztcbiAgICBwdWJsaWMgcGxhbm5lZFJlc3RvcmFsVGltZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhbHRlcm5hdGVTaXRlSUQ6IHN0cmluZztcbiAgICBwdWJsaWMgbG9jYXRpb25SYW5raW5nOiBzdHJpbmc7XG4gICAgcHVibGljIGFzc2lnbmVkRGVwYXJ0bWVudDogc3RyaW5nO1xuICAgIHB1YmxpYyByZWdpb246IHN0cmluZztcbiAgICBwdWJsaWMgbWFya2V0OiBzdHJpbmc7XG4gICAgcHVibGljIHNoaWZ0TG9nOiBzdHJpbmc7XG4gICAgcHVibGljIGVxdWlwbWVudE5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgc2hvcnREZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIHB1YmxpYyB0aWNrZXRTdGF0dXM6IHN0cmluZztcbiAgICBwdWJsaWMgbG9jYXRpb25JRDogc3RyaW5nO1xuICAgIHB1YmxpYyBvcHNEaXN0cmljdDogc3RyaW5nO1xuICAgIHB1YmxpYyBvcHNab25lOiBzdHJpbmc7XG4gICAgcHVibGljIHBhcmVudE5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XG4gICAgcHVibGljIHdvcmtSZXF1ZXN0SWQ6IHN0cmluZztcbiAgfSIsImltcG9ydCB7IFZpZXdDb250YWluZXJSZWYsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgT25Jbml0LCBWaWV3Q2hpbGQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4vLyBpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUnR0YW1hcGxpYlNlcnZpY2UgfSBmcm9tICcuL3J0dGFtYXBsaWIuc2VydmljZSc7XG5pbXBvcnQgeyBOZ3VpQXV0b0NvbXBsZXRlTW9kdWxlIH0gZnJvbSAnQG5ndWkvYXV0by1jb21wbGV0ZS9kaXN0JztcbmltcG9ydCB7IFBvcHVwIH0gZnJvbSAnbmcyLW9wZC1wb3B1cCc7XG5pbXBvcnQgeyBUcnVja0RldGFpbHMsIFRydWNrRGlyZWN0aW9uRGV0YWlscywgVGlja2V0IH0gZnJvbSAnLi9tb2RlbHMvdHJ1Y2tkZXRhaWxzJztcbmltcG9ydCAqIGFzIGlvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xuaW1wb3J0IHsgZmFpbCwgdGhyb3dzIH0gZnJvbSAnYXNzZXJ0Jztcbi8vIGltcG9ydCB7IFRvYXN0LCBUb2FzdHNNYW5hZ2VyIH0gZnJvbSAnbmcyLXRvYXN0ci9uZzItdG9hc3RyJztcbmltcG9ydCB7IE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvc3JjL21ldGFkYXRhL2xpZmVjeWNsZV9ob29rcyc7XG5pbXBvcnQgeyBUcnlDYXRjaFN0bXQgfSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHsgQW5ndWxhck11bHRpU2VsZWN0TW9kdWxlIH0gZnJvbSAnYW5ndWxhcjItbXVsdGlzZWxlY3QtZHJvcGRvd24vYW5ndWxhcjItbXVsdGlzZWxlY3QtZHJvcGRvd24nO1xuaW1wb3J0IHsgc2V0VGltZW91dCB9IGZyb20gJ3RpbWVycyc7XG5pbXBvcnQgeyBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgKiBhcyBtb21lbnR0aW1lem9uZSBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xuaW1wb3J0IHsgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvY29yZSc7XG5cbmRlY2xhcmUgY29uc3QgTWljcm9zb2Z0OiBhbnk7XG5kZWNsYXJlIGNvbnN0IEJpbmc7XG5kZWNsYXJlIGNvbnN0IEdlb0pzb246IGFueTtcbmRlY2xhcmUgdmFyIGpRdWVyeTogYW55O1xuZGVjbGFyZSB2YXIgJDogYW55O1xuXG4vLyA8ZGl2IGlkPVwibG9hZGluZ1wiPlxuLy8gICAgIDxpbWcgaWQ9XCJsb2FkaW5nLWltYWdlXCIgc3JjPVwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoa0FHUUFhSUdBUC8vLzh6TXpKbVptV1ptWmpNek13QUFBUC8vL3dBQUFDSC9DMDVGVkZORFFWQkZNaTR3QXdFQUFBQWgrUVFGQUFBR0FDd0FBQUFBa0FHUUFRQUQvMmk2M1A0d3lrbXJ2VGpyemJ2L1lDaU9aR21lYUtxdWJPdStjQ3pQZEczZmVLN3ZmTy8vd0tCd1NDd2FqOGlrY3Nsc09wL1FxSFJLclZxdjJLeDJ5KzE2ditDd2VFd3VtOC9vdEhyTmJydmY4TGg4VHEvYjcvaThmcy92Ky8rQWdZS0RoSVdHaDRpSmlvdU1qWTZQa0VrQUFaUUNBZ09ZQkpxYUJaMmVud1dhQUpHa2FhQ25xS2tGbzZXdFpLcXdxYXl1dEYreHQ1OEJ0YnRkdUw2NnZNRll2cmpBd3NkVHhMZkd5TTFPeXJITXp0TkowTERTMU5sRTFxclkydDgvM0tuZTRPVTY0cWprNXVzMTZLZnE3UEV3N3FEdzh2Y3I5TG40L0RINm52WjJBQmdnWUZZL1NQODZCZFFob0JNQkFRc1BEa3BZSU9JTkFLQWVXcFRvaC8vaXhob0RVR25rdUFTQXdTQWVpUVNBTlpKa0VaT1VpcVFjUXVEV3c1TXVlY0NrRkFDbkQ0b0NoalQwZFRObmowazhlZnJrQVZRSWdKcktDQnJOZ1RScDBpRk5nNFRrTnVEajFCRTdyU1pkZWk1aFVDQXIwYlg4NnFLcVdLdENzdjZBNnU0aFd4WnUzMW9saTBOdWo2SC91dDQ5RVZidlc3NDIvQXFrKzYvb1lCRjVEWXRGM003c2o2MFVRMUYrVENHeTVNUGhMUGRJbTduQVdjNGRQSDkrRy9yZjZSMk1FeEpBblZyMTZzay9SZThnbmRrcmJRTzJiN1B1b2ZoaTdNQy9OUVFYanB1cDdoeUFNMjlPem1BNTg3M09YZTh1M2VrMTlRcldyeXZOcnMrN0Rjd1VDVXovdmlDOCtKNDdLQTdRd1hzbWV3enZoY2RQT0IvSFUrNy9zOTJYZ1h2aXJaY1BmOUJ4VjVHQUd1UjNXMW5JM1ZBZmdnd082T0JuQnFZZ0h3N29VWlJoaGNCZEtObUhKbXhvdzRUYWdXaWhpSWIxUlNFTi81V21ub3JLc2FnWGlTU1lTRU4wOXRGNEFZSGkzYUNqREJoeDE1K1BLOXFJWFdVUnp0QmhRcjRocVNSb05Bd0pBNHI2SElsa2tsTlNnbU1JVnJaMW5ENHpicmxCbDB2S0VHWUxQRDVuSmdaQVhsZmxpeThVS2VPYnFhRTVucHAwdXZEa1AxSGlHU2R6TTZRWEE1YjBhSWxualhyQzU0OXNNWXlwVDZDTEd0Q29sNDgyQmtPYktWYkt3YUMzZmNtQm9XSUNLS3FubHpycUFxa3QvRG1wcHgrQSt1QUxySzZBYUYyd2dwRHFxUmpVcW9LazlGQ2FhNGlYMGdvcEM1eG1PU3dJLzdKaXVPcXhLc1JZR3EvRE51c3NDNzZlNENvOTVpMjdnYldHVVV0QnRpWGNxcGE0eSs2S0xiUW9BT3VPc042MmwrcTZtcVpncmpnQnhodUN1aXFRQzVtNzZNQ3Jyd0xndHRndnV5VnM2NDZpQTN0UU1KVW8rS3VyZ21VMnpDeS9KMGo4QWNEaWRHdnhwL05HakxBSTkzSlQ4Y2U2WG9wdUE1bVpJRzF2S0lNVmNva1VtWkJzb2pHVGdIR09OZXVzNElJNVE3YXpDQzJUb0RBNkhnZk53ZEJnOWt3eXhTc0gvVERFUkR2TkxNZmNKQzJKd01kTUxWWUpSWWR3TTY1Uk5EUkExTFY0bldZSW1MVHQ5dHR3eDgzdzBqOXpmU0pkV3N1ajlsVlpIQzNPM0VnRUVCc0JkZ2ZEdEJRbGMxTjREQU9sSXBnYkpwVjArQk12RjJjRUFQOWpGd0M0R1ZXaHpjTGtUbVNPcitmSWNrdzRHM21SbnNMZWUwcGhaMm1MdHlBNE1XZXY0Wm5xaE0xY05zVkpCT0QzS1hsL0VSenVKTENPNlJRQ1lLMU03S3YvTGhMelNvVDZrcDdFd3lnNjdaZGZEOHZtd2d0WC9iNVRScDVGNC9wOHI2dnlzUVN2Ulp6bTUybGoreEtpajRyNjhhY0gvZlR2d2QrZ2lQcERKNzhuSi9NQitUSkRQeXMwUzN3Q2RGRC9CT0s4ZlFBQmN6ODduUmplaDVZQ0xYQTBEY3lYRDVMM3MwNXdEd3RUdTZBRWdDVENIOHh1R1NiOFg4ZkFzTGNTUGlBOExneEM1ajQ0QTk5MThCUzE4d0xyRU9pZmE4VmhnQm1KWVhVYWFMa3JHTzk0VkFtWEhVNzRpUUxpUlh1bTZzSVJXeWVoNXVDQmlScThBUWYvYjVnK0xreHhiVEFhU3g4Z0NMVDZjZEVtOTlQQkY4RllRMVg1QVhNNHNPRVpmZUZFSmF5UmFrUVNZaUNBT0VlYjZERjNxZkxod0tEWXgxQ2s4U0tCRE5VZjE4SEVRc2JDTHV0THBQZlNwY0l6Rm1RTGQyVE9JcWZCUjBlcUlvZVlsR1QrM2tSR1R6N3lrRG9SWmY0MnVZc3RtbElWa0F4REpndWtva2ErRWhXZ0ZFTmhWQ205KzhqeGxvNURKZjU0cVVucWRCS1lBQlFtRW1aNUhSN2VwWlRJQkI0Y2Rrbk1FVDNHbHRIMElDdVBVczFpVGdXYjJYeGNIWmpaVEpjY001b1N4QU0xdTRuSGUwQXptNTY0SkIvSTZjMTd1QktlMnR3ak8zdkp5RXB5TVoyQ29LY2l6VUhJUHNheUVBSmR6VGFuNmMrZnlUTVJDYjBST3hKMy84WmNMaUtpYlB4R1EyV2pUTlR0VTR6eG9LaUM2b2pRajNiVUVFU1V6MEpseWM2VjB1RjFjeFFuTCtqWmo0S3E1YVRxNUtWTHg3bFJPbjVqalR0ZDRnMHRTbzExaG84aktTVUtUdlhacUtEZVFhUzRBR2c4OXBhVHBLcmlvZmd3NmlqTjJWUE5PZlVPRDV1S1RUOGhWWkpZNjZ0NnFPUkJwNkpWYTM0RnFxWkI2eDhHSlZjOU5GQ21xQ0ZRWGZWUXNyTCtKanljeVJ4SjJTcEl0bFRPRTBRVmtHMW9NeUc4MGlneWUvVURYZnpxSTdkRTFnOXB3ZXFpa1BJZHpjTHFza29McldoSFM5clNtdmEwcUUydGFsZkwydGE2OXJXd2phMXNaMHZiMnRyMnRyak5yVzUzeTl2ZSt2YTN3QTJ1Y0lkTDNPSWF0eEVZTFphWmt0dlVHditZVkhlVmZhNXkyeWhkTkpHeXVucHlMbmE3ZE4zdFRrbTczclZSZDhQTEl2Q1M5MExqUGErRHpLdmU5NlMzdlVHaUFYelh1OXo1NW9lOTlwM1ZscGpiS1B6bTl6UHYvUytBNVN0Zy9kUzN3UHFWQVlJVEhOMEZENWk2RHRaTGdDUE1Od2hUR0M0SHZ2RFhDS3hoRE8rM3d4dTJNSWduckdIL2xqakRJSTRKaDFPODFITHdON3NyVGpHSkwyeGlHcU5ZeGpFZThZMTFMT0lPejVqQ05RYnlqbjJjWXlKL21NVXE3dkdKajR6a0lFZjR4MDh1OHBLUjlHTHJYc1FrV002eWxyZk01U3l6RThwTjdiS1l4NXpsNDVyNXpHaE9zNXJYek9ZMnUvbk5jSTZ6bk9kTTV6cmIrYzU0enJPZTk4em5QdnY1ejRBT3RLQUhUZWhDL3hiL3RJYkdTNUwvaW1oSWhLWFJla0FLcEJrQjJkOWtGRVNxbWJRZGJsZlo0WEhHTnM1a0QyQWZzeHhOejdPZVgzR1BxY0hxM3J2UU1xLzVXWFViNkVwcS9yMVZnYWxXRW1GdGJjNmo5dnA5c2lZRFZYK3RwR0N6VUdWbWJlNVVBMm5zTVREYkhFQ1Z5QmREall4Wk5oc01xcncyRk1qWkQyWnFXM0xkL0hZa3d6MVRrK0xqbytKMlNuTFRiY0Ruc3B1YjFYMzNGTEFyYjBSdXQ5N2I5aTYrR1ZkbEttcWozMGcwQk1EOW5ZMkJCNXlwNU4wMzVkcXI4QkswRmQxWk5YaFBHaDRDZzFPYkhSSjNJNnZQUy9GMnE3ZmpjUHA0cmtVK0I0c1A1dUhvQmprRUpLNXlLVEo4MWlULzY4dlRZUEw3Wkp6aUZtLzVHVmcrQnA0LzF1YzYvK1E0bUNFZTlIdDdpdVhwZnZIRmh4eHZsN3RiWDBBSG9VbDF2b2Viajd1YUpWdzZ4bVB1Y1dLNjhPRHpqT0hBdFczdEhoSThweG9QSTcxREtVazl0dk9sSHI1eTA5bU9iRFhlaU9vamZMdmFpVTUzNmdta3NKQURkU3IzeWU0V3dodndhckJPQXJIZVBWOFBmcEsyZy96aFJTbnZnbW5keVhwbnFaeCtnSElLaG9GRkM1VlZ3enQvNlNRbXN1ZTREZ0xvZFhraGx4NVI0ZXdiZ3VVTHYzclorMTNZbWd4cWw3NGRRaUtRbnArb1YrZ3dIVjhGdFYydTJHaEFQT2RCQjI0MG9SVmNOSmZvRVk1SUJlb3ZNL1ZvcVBUMG1XOUg3aSsvbklrSGFlRHFYbjN2QzFDdkhvM3M2N3QrKys0TGY5Wk1NSC96Mis5K2cwa2J1bFVJNVAvQ003OTE4bGVjekFCWVpoVW5mMDVSZXNzMlhTVERYVUtEZ0UzUU9jbm1mK0R6WFF1b2JOdDJlWXdFZ1JHb2F6S0RnYlMxZnVXaWdDTkFnS3NsZ2hkZ1pSdElnYlZsZlNaZ2dpY0lZN1pGZ2lVSWdpM29mTGFsZ2lzb2d6T0lnN0RsZ1NmQWdqckRnYTFsUExqamd6bElmSzVsZ3oyb2d5R0lmNndGZ3hsQWhFV0lmSytGaEVrb2dTaEFoYXJsaEUrb2hEK0lncW9saExMRGhWSG9lVitvaFZ0b2hmWUNoS1FGaG1HSWhsZG9odDZDaFNnQWhTN0RoS01GaDJlb2daK2pobEpqaDNNb2hnN25oMEdEaDNrb1hpNUFpSnZGaDFXb2g0cW1pQmFEaVBnQmlIWG9oWDFJaVh2b2hpdkFnNVhZWHdvbWlaUElpVXJEaG9maWlUZi9hSWtOSTRlWHlJaHRJWWp4QW9uN2c0a3RJSW9mSTR1akNJdU5hSXJlNG9xdnFJcDF3b3FmNVlncVFJZHRTSC82NG91MlFvcHZ5SUJ4Q0l6QmlJekpTSXpWWW96SGFJdXJ5SXhVWm8xcFNJM1ZDSTFIaDQzWnlJdWRpSXR2SW8ycGFJZzJnSXBNVjN0eDVJelI0bzBDUW83bFdGNW1CNHFWUW9zbndvN3RLSTRxWW8vM0tJVTVvSXU3eG8yWWgycjJKcEQ3Nkk3VFNJYi9pSkMwd1RvK3NIdVA1NEpEUjVBTDZZOTJwNDhWOG5zUHhnTVFPUnJLbUk0VVdaRUtlWkVHMldEWTU1RVd1UnNNYVV3bnlaRkdTSkkwbUNzYW1YWXFtWkovNTN4NEIzZUVvbm92V1pNMkdZM3ZWMEUvQ1pPdGh6SVBOd1FkS1pRS2xKTmpwRVJDdHBDVTN4ZHJvNlY5VDltVEVTbDVVMmxaS21HVkx1azlUQ2x3aytCVVVQbEFBOFZhWHpXV1Nua1lYMWxMWEhtVlNyR1dOSUtXWkRrV2NPa2pjaG1WRm1ob2Q4bDVlWmxvZTVsb1R2Q1hnQmwvYlRtWVN5Q1lodGs3aFptWTR6ZVVqQms5aS9tWVJZQ1lrcm1WamxtWlJrQ1ptTW1UbDdtWlNCbVpubWxDb0JtYUtEbVNwUGtTV2xhVXA3bWFyTm1hcnZtYXNCbWJzam1idEZtYnRubWJ1Sm1idXJtYnZObWJ2dm1id0JtY3dqbWN4Rm1jR0pBQUFDSDVCQVVBQUFZQUxMVUFGd0RGQUw4QUFBUC9hTEFiL2pCS1E2dTlPT3ZOdS85Z0tJNmpaSjRUcWE1czY3NHRLcDl3YmQ5NGZzMDhCT2pBb0hCbzZSbC94S1J5U1RMMmtNeW9kR3B3OHFEVXJGWm5uV0czNERDcksvdUt6K2dPR1dWT3U5L1Z0YWtOcjRmbGM3c2VqWmZROTRCTWZSRi9nWVpEZ3o2SGk0S0pEb1dNa1RXT2o1S1dRSlFCa0plY0paU2JuYUVlbWFDaXBobWtwNm9pcWF1dWFwK3ZzaHF0czdZVXRiZXp1YnF2dkwycnY4Q253c09peGNhZHlNbVh5OHlTenMrTTBkS0gxTldCMTloN21RSGJvZDNmeXBuaW5PSGxsdWZva2VycmkrM3VodkR4Z1BQMGV2YjNkZm42Yi96OWFmNEJQQ053NEIxeUJ1MFVUS2hsSVVNcURoOUtpU2l4RWFXS2JpaGlUS0p4L3lNaWhCNFBYZ3dwMGhISmtvbE9ndW1vRWdmTGxqWmV3b1FoYzZhTG1qYkhnTXk1QkNmUEpqdC9FdkVwTkFUUm9oK09Jb1UxY3FrUXBVNXBCWTNxY2lyVnExaXphdDNLdGF2WHIyRERpaDFMdHF6WnMyalRxbDNMdHEzYnQzRGp5cDFMdDY3ZHUzano2dDNMdDYvZnY0QURDeDVNdUxEaHc0Z1RLMTdNdUxIang1QWpTNTVNdWJMbHk1Z3phOTdNdWJQbno2QkRpeDVOdXJUcDA2aFRxMTdOdXJYcjE3Qmp5NTV0U1VDQjI3aHo2OTdOdTdmdjM4Qi9Dd2hwTzdqeDQ4aVQ2eDVBWExuejU5QnZNL2RZUExyMTY3Mm5iNnlPdlR0MkFzMjlpN2NPbnZyNDg4L0xiMGZQSHJsNmpOemJ5K2Y5dm1MOCtmaHhoOC9QLy9iKy9tSDUvUWZnZkFJTzJGNkJCcUtIWUlMakxjaWdkdzQraUYyRUVscEhZWVhRWFlpaGN2VkpkTitHNUdrSTRuRWRQdlRoaU9tSmlDSndKVEowNG9ySmFRY2ZqTmZKYUY5dkJPU280NDQ4RWpEQWowQUdLZVNQQWhScDVKRklDbUNGQlFrQUFDSDVCQVVBQUFZQUxPZ0FKZ0NBQUFrQkFBUC9hTHJjL3BBRkVLdTlPT3ZOSVFnZ1FIVmthWjRtcUU0ajZyNHd1YzVpYk4rNDhzMTBtLzlBRFc4NENScVBqeDJSNTBNNmM4dG84MGxGUmEvRnFyYWt4QkpyMjNERzY1Mkt6NHN1V1lwdUw5WnJzNXNLaDgvRjZ2cFNmai9xeVgxYmVYOU1nVnFFV0laVmc0Z3FpbFNNalZtUFNKSkxsRTZSalh5WU5wWkVuVWVhaUp5aExxT0lwa0dmUTZwQXFIK2xyaW1zTTdNNXNIcXl0eDIxdHJ5ZXZpcTd3Qm01ZXNVeHdvN0pMOGR3eE0wV3l5RFNMdFNUMWlUUGR0cTB5OUhlRGR4azRlSVMxT2N5MU9icTVJRHFITmp0NSs5ZThmTHArRUxzKzhiWS9zYjBDMmpCWGlLQzB3WWloSUF0d01JSUJxODhqREJ2WWhLQUZoMVV6TWdnLzJJVWpoMDNnalFnRXFUSFN5TVZsT1I0RWxUS2xrUG9pV3VZMGdETVFpbFhacno1SzZkQ2t4aHI4Z3hSTTJTdG9oby9JYjI0YWFtSFZFNHA2b3BhZ1J2VkM3bGtDajE0VmFETHJob0dhYVdxQnF5SkhXUE5walhMdHEzYnQzRGp5cDFMdDY3ZHUzano2dDNMdDYvZnY0QURDeDVNdUxEaHc0Z1RLMTdNdUxIang1QWpTNTVNdWJMbHk1Z3phOTdNdWJQbno2QkRpeDVOdXJUcDA2aFRxMTdOdXJYcjE3Qmp5NTVOdTdidDI3aHo2OTdOdTdmdjM4Q0RDeDlPdkxqeDQ4aVRLMS9PdkhuT3dBRUtFQkR3bDBDQjZ3UWM3bzErdmZ1QXZkYTdpNmQrVjRENDg5SzEwMFhQZm9CNnVBUFl5LzhPbDd0OCtlVGJocjh2UHp0YjgvLzhCZWdlV1BzRnlGOStUZ0Zvb0lIVE9XWGZnZ3Y2VjFSOEVGWllBSDBqUFdnaGhBaGFWT0NHRUVvNGtZSWdiaWdpUWgrV2FDR0dBVkdvNG9zZHFxUGhpeVdlZUU2S05KWTQ0RGt6NXZnaWk5Ymc2S09LRFZwRDRwQkQyZ2lNQUVJaXFTS1F4UnpwWkk0eEF1UGlsRGtXMlV3QVRXSnBvWks4Y09tbGoxQXVPYWFQVmZKeTVaa2dnbmxMQUd1eXVlSjd4WWdwcDQ3YU1IbG5pV25lSXVXZUROSlpUSnlBQ2lob21JUVdlbCtmczlpcEtJT011dkxubyt5NWVVdWlsSjVYcHBXWkduaG9tRjFTYWlrdmVuWjZYcVJtbW9yZHA5Wmd1aWVxVzdwNkpnRUxPUW9vck42VWV1ZW1BVTA2SmE3eHlFb2pyN1dHV2lPckU5bUtabFF5dnBxSUxFakNHZ2lzUlhEKzJKYXlFVDY3bEs0TFRsdFVzK0lSYTVhc283SlY3WHg1WWJ0alhpU1dPeGVGM3NLRmF3SUFJZmtFQlFBQUJnQXM2QUJoQUg4QUNnRUFBLzlvdXR6K01NcEpxNFhnNnMyNzcwQVFmR1Jwbms4b0JobnF2akMyem0xczMrU3NzM2p2VTZyZDdFY3NHb0pDbW5FWlF5WjF6S2pKK2RUVnBOaExkY3ZMZWlWVTd1NUxib1RGdTJzWmUwWUwxZXVsZXc2UC85cnpaTjF1dytlZmZENStmMDk3Z1NXRGhGV0hNSXFPSW9hTUdvbVBpNUlmbEpWVmtaY3ltcCtjblF1Wm4xeWhvcVdwSXFKZ3FxbW5oNlN1bTZ3cHM2QzFEN2VmdVE2eXUybTlETC9BU3NJS3hNVXJ4OGpLanJDQnpvclFmTW5LMUhiV3lzeEgwb1RZY2Q1LzRHdmF3T1JsNXNEYzZydm9aTzJ6NzJ2aWFQTng4YnpjdXZWNis1NzlWdHlURkhEWlB3b0JCNHJLWitxZ0Jta0tlekVVNHRERHVZb2VKbmJCYVBIL0ZVY1RwVDZlTUJkUjVET1JMMzZWUkxrZ3owcVd6Y1M4aERscXkweWFEQ3poeEJIbTVzNEdWbjRTVWVGVGFBcWpTSk1xWGNxMHFkT25VS05LblVxMXF0V3JXTE5xM2NxMXE5ZXZZTU9LSFV1MnJObXphTk9xWGN1MnJkdTNjT1BLblV1M3J0MjdlUFBxM2N1M3I5Ky9nQU1MSGt5NHNPSERpQk1yWHN5NHNlUEhrQ05Mbmt5NXN1WExtRE5yM3N5NXMrZlBvRU9MSGsyNnRPblRxRk9yWHMyNnRldlhzR1BMdGlDZ3JRQUNCVWFrRFlDN1FBRUNhUWY0SGw2Z2Rsa0J4SWtESDNzN2VmSUJZWGs3bjY2N3EvRHAwNkZ6Ulk2OWUvV3IwcnQzWDI0MXdIWHg0bzFUUFk4ZVBWWHU3ZU5yZnhvK3Z2M3ZTK0hidDArZWFZRDkvd0RtOXBSK0FZclhIMU85RllpZWV2NHBHQjlVN0RtWUhYMFNvb2VmVWdSV3FCeFVDV3FZSElOTC9lZWhjd2N1MWVHSXZvR29sSWdvRW5kaFVobU9PRjlUSjZMNElsSXN0dmdiaHpvT3AySlNPYlpZb2xJUm9qZ2pnajM2ZHFOUk1YbzRaRkkxanJpa1VFR2krQ1JTUlk3NEk1UkpGZ0JWa3hvZWFXS1hVLzVVNVloWEdwV2xoMlgrMUdXYVFvRlo0WlpJUmNrbWhVbUtTU1NaVUwzNVpaZDBHbVZuaFhDYTJhV2VTYTJwWVpzNG5la2hva2pKS1NHak9BMHFZYUU3T2FwaG9FSXBXaUZVbWxZSUtaTjhQbVdwZzVnMldxcFRweXFZS2syaFNzanBUNTVLR0ZXckJZNUs1YW8wSnZrcVRMRTZPT3RPdGJwNmE1TEQ0aVJwZ0RjRUpMc1RydkpSYXFpR3pWcFY3SGdDU010bHJ0cGlHT0FBenJMS1g3aDRHa2h1VklvMjIrMVUwNmxybG43dW9vVmJ2THVkeTB3Q0FDSDVCQVVBQUFZQUxMVUF1Z0RGQU1BQUFBUC9hTHJjL2pES1NhdTFJT2pOdS85Z0tJNGljSjFvcXE0WTZiNXcvTEYwYmQ5TUp1OThyK0hBb0RDaTh4bVBvYUZ5aVNzaW4wK21kSXB5UXE4OXFuWUxzV0svTUs1WTdBV2JSZU0wdFh4dWQ5VHdKZHROajl1RGMzcjd6cmZsOVdaOWdpdC9nRitEaUNlRmhsZUpqaFNMakZHUGxBK1Jra2VWbWptWWVwdWZsNTFabjVxaG9qdWtwYWQ3cVpTbXEyR3RqNit3THJLenRXQzNqclM1YUx1SXZiNGd3TUhEamNXQ3dzZHZ5WDNMUEFEUzA5VFYxdGZVenRyYjNOM2UzK0RoNHVQazVlYm42T25xNit6dDd1L3c4Zkx6OVBYMjkvajUrdnY4L2Y3L0FBTUtIRWl3b01HRENCTXFYTWl3b2NPSEVDTktuRWl4b3NXTEdETnEzTWl4LzZQSGp5QkRpaHhKc3FUSmt5aFRxbHpKc3FYTGx6Qmp5cHhKczZiTm16aHo2dHpKczZmUG4wQ0RDaDFLdEtqUm8waVRLbDNLdEtuVHAxQ2pTcDFLdGFyVnE0OEVhTjNLdGF2WHJ6d0xpQjFMdHF6WnMySFBxbDA3TmkzYnQyWGR3cDByZCs3YnVuYlg0czJMZGlmZnR3VDIvaDBiMk85Z3RZVjFIa1lzK0hEaW5JdlBQc1laMmV6a201WExYcmFabWV6bW1wMEpOeDc4bVdab3NhVm5uaTZRV3VicTFqRmZqLzRMRzZac3c2RnJ2MXc5WURiZjNyZzdBMWQ4ZWpqazRyN3pHcWVNUEhqbTVaaWJFdzhObmJQMDQ5U1QyNjBPK2pyejdNNHJDOUErZDN6NHlPYW5kMDZQZlQxNXVPeS91eisvT0g3MDBQYXQ0My8vTm4vMy9WMzBIZWFmYWFjTnFGcUIvTEVWUUlKckxSamdZQTZxbDFtRTdVM0lvRm9VeW1maGczOWxlRjluSHVvSDRvVm5oZmpmaUJ6eVpTS0JvYTE0WUlza211V2lhNmZOR0Z1Tk1jYVZJMWs5cmViVEJsb05JQ1FCUkJJSm1HNHZKUUFBSWZrRUJRQUFCZ0FzWUFEdUFBZ0JlQUFBQS85b3V0eitNTXBKcTcwNDY2MEEvMkFvam1ScG5oa1FCQjdxdm5Bc3orWnF0M1N1NzN5dnFUYWJiMGdzR2wzQkpPN0liRHFmd0dSdytheGFyekNwbG9YdGVyK2FyUmhNTHB1allpblZ6RzRiMC9DMWUwNlBvZUZiZVgzUEIrSC9lbjJDZ3hKM2YyS0JoSXFEaG9kcGlZdVJjNDZVSzVLWGZJMlZqNWlkYlp1Z2tKNmpScHFnZUtLa3FqdW5yUUdyc0VXdXJxbXh0aVNtczRlMXQ3MGJ1c0M4dnNNVHVjQ1V4TWtmeDh6Q3lzbkd6SlhPejc3UjBzalYyaEhYMklEYjRBN2V4OVRocTkzamNlYm02T2xqNitIdDdtcnc0Zk8wOWR2eTkxUDUydnY4TFBtckJwQmZ1WUdYQ3Q0N2lEQlN3RkFOb1QyY0ZsSGlSRWNNS3pLNmlGSC80ekNPamp4K0JJbEt4Z0FDQWtSYVVaZ3VJNFVBQldJU2VLVVNDa2t0TGlrUWlNbHpRTTBxTE1uRmdNbXphTXFmVG02dXlEbGhaOUdpTTVFMkNkcEtob0NuV0FzTW9DbTFGRWVtRXJLSzlkbjFDTldRTVFhSVhYdTBiSkd6NnJLc25SdlZyYXg1SnVmcTNXcVhDRng2Y3ZVS2J0dTN4OStsTXB3SzFvdXk4SkMvWUNGY1hVeTVybU1ld1JKVDNxejFzdUZaVmpsdkp1dVpSOEhJRDRpS1hzeTF0R21LYVZjdkp1ejY4eUVacW1XdkpWRDd5TGNZaW5XTGJkMzdNUnpjd3VrV241cEhjL0xoeTUzY1FmMWc4bk9zcEtNM3VUSGp1bGp0VjZnL1VPdjlLVzN3cEhLWEw4QWJmU3p5NjJNU2QrOUpmZm4yOUZVRlh6OC8veVhyLy9GbDUxOG4rM21IMzRDZEFMamVlUWhHRWg5UEJ6WW9DWHp4OVNmaElQWjVKK0NGaWhUb25ZVWM4cEhoZFF5RzJJZUh6MFZvb2lBS2xsZmlpbldnbUp5S01PNUJJWDgxWXZoZ1RCdm1TTWVONWZrb3lJalB2U2lrR1RJS1IrT1JiQkNaSEloTWtwR2tia3RHU1VhTEgxcEp4NDZkYWVrR2tONTU2WWFUd2hrcDVoVmdwbmhtazF4Q3VXWVZVOHJXNDV0WFlIbWRtM1EyRWVkcWMrYjVoSjB6K3ZrRm1icVpLYWdSYVFaNktCYUV5b2Jub2tQc0tWcWZrTXJTWnFWV1NNcVpvWmp5QUtpU25WWnhhYWhPQ0tEcFlsV1NPa1FBaWE3MnFLcWVuam9XckZldytoeXRqSjVVS0s1ZDJDcGFxcnd5WVNwbnJ3WkxoSytDQVd0c0V5UEQ2bFhzc3JJMG14V2wwRmFCTEZUVnRpSEFqWnhtVzBXenlucUxoYW5QaW90Q0FnQWgrUVFGQUFBR0FDd25BTzRBQWdGOUFBQUQvMmk2M1A0d3lqYkl2RGpyemJ2L1lDaU9rVkNjQXFtdWJPdStzQmdRNTJuRmVLN3ZmQjRNdFdDcVJ5d2FqMFZUY0JsQU9wL1FhR2EyckE2azJLeVcrS3Q2QzgydGVFd0dBYi9lVzNuTmJpc0VOUFIzNks3Ym9WUTVXbjN2KzNWbmVuSlhmNFdHS25DQ2ltR0hqWTRZZVlxQ2ZJK1ZsZ2FCa291WG5JMUttcHFVbmFOdGthQ2FkS1NxWkptbm9LdXdXNSt1cm9TeHQwaW10SzZNdUw0N3JidXVvci9GTExQQ3dyM0d6REp4eWRERXpkTWF3ZERDcWRUYUU4algxOHZiNFF1NjN0QzI0dWhkNWVVRTRPamEzZXU3Qk5udjhNL3l5ZlgyMCtUNXRlNzRNYlAyRDFRN2dlRVNGY1NHY0p1L2haTE9OV3hHRUtLZ0FRRW40b3BuY2Y5U1JvMnhIbmFVc3c4a3Jvb2p2MGcwK1F0bHlpVUhXVGJqK0RJSVBablVSTllzaWZNWHpaUXJlekxUQ1RHbTBHMC9DOTQ4S282b3ZLQk1zUUE0a3JRY3hxaGpBQVFJTUxXSTAyUkdzV2JSdW5VclZZZzh4VG9weTdackVYeFcxVzRoeTdiczJYVmg1VUtoVzVmdEVaZVM4dXAxd3Jkdld5TlZCYVVkek1XdzQ0OHhBS09CeXJoSTRjZUh2Y0pWSkxpeVpjeWc3d1plN0RuSFpkQjkzZmI0V29CMGFSeW9ZME9HVVpYeWF4Mm5aUnYrdTJmMjdSZTVkUnRXemNPZjY5OHVnZ3ZmalhpSmJlUTRsQyt2UzV6SG1hdlFrVWlmYnRmSUROL1pZWE5IWFQzOHJlM2p6UThkajFwOU1mVGN5N3RYQlgvNi9GL3NRY3UvMzZuK2N2Ny91T1NIMlg0QVd1S2ZjQVFXK01pQnVpa0lpNENQSmVqZ0lRektOcUVxRURvbTRZVi9WQmdiaDZOazZCaUluWWlZR29tWGVOZ2VpcGFZU0IyTGxhZ1lHb3lQdUpnWmpZM1kyQjJPRk9wb0ZvK0grTWdWa0liSWlCbVJoZ2k1SVpKakNNbGtoejR1K2FRV1NrNTVoNUdQV1hsSGxWclc0V1NYYm1BNUhKaHVmRW5tR21JeWQyWVpYSzZabFpsdWlwSG1pM0UyNldPZGIrb29KWjZyM2NtbkZuUFc5U2VnVVE2YUJaeUdQaEZvV1hzbUdnT2lqaDZ4NkZhTlJ1b0NwSlo2NVdlbWtoYks2UkdZZm9xYnA2STJwbU9wM3VtSktoR0xWcnFxRENhNittb0lZc282SzZ6c0FXRHJyYmhPdHl1dklqRDRLN0FqSUVoc0ZPZ05lNndLR1BvcHV5eXp3em43ckFxRjZUcXRHSXhLZXkwTDFvYVFBQUFoK1FRRkFBQUdBQ3dYQUxvQXVnREFBQUFEL3lpMTNQNHd5a25sTURqcnpidi9ZQ2lPcERaVWFLcXV6bFcrY0N6UDJjbmVlTzdTZk8vRHRweHdPTm45anNna2djaHNNb3pKcURTMmRGcUYwS2wyNjZsZXY2c3NkOHoxZ3M4VU1Ya2ROYVBmRHpWNzdvUGJJWEs2WG5idlAvZUFkWDU5ZVlHR0lJT0VoNHN2aVhlRmpKRUdqbmFRa291VWNKYVhocGx2bTV5QW5taWdvWHFqWjZXbWM2aGdxcXRyYnExRXI3Qmpzck5ZdHB5NHVUaTF1MXE5dml6QXdWTER4Q3JHeDBsQnlqck5qTS9RTjh6U1NRSGEyOXpkQVFMZzRlTGpBZ1BtNStqcDVnVHM3ZTd2dmRmWTgvVDE5dmY0K2ZyNy9QMysvd0FEQ2h4SXNLREJnd2dUS2x6SXNLSERoeEFqU3B4SXNhTEZpeGd6YXR6SXNmK2p4NDhnUTRvY1NiS2t5Wk1vVTZwY3liS2x5NWN3WThxY1NiT216WnM0YytyY3liT256NTlBZ3dvZFNyU28wYU5Ja3lwZHlyU3AwNmRRbzBxZFNyV3ExYXRZczJyZHlyV3IxNjlndzRvZFM3YXMyYk5vMDZwZHk3YXQyN2R3NHpJQ1FMZXUzYnQ0ODBiMXhyY3YzNzErQS9jRkxMandOc0tHQ3lOT0hIZ3g0OEZRSHl1T0xMa3g1Y3FRbjJMMjYzaXp0czZlUVc4V2pabDBaZE9TVVQ5V3paaDFZdGVHWVUvVzdObWJiTUczTGRPdXpTMDM1OHU4UHdNUDdqdXowK0M5aC9NdS9sZDViZWEyblllV1BwcDZhZXVuc2FmV3ZwcDdZZ0RRdVlIM2Juajg3dURtanlNUGtMN3BldmJodDdWbituNyswdnJ4dGRsWGlwOTg0ZjFKU2ZWM0htOEFJaVdnZXNnVmVOU0I3cTJub0ZFTTB1ZGdmdkQ1SjlpRFJVVjQzNFFXQm9ZaFVScnl4K0dBdFgwNFZJZ0Jqb2dnZWhTYUtCU0tCcTRuMVhzenlpalZYYUVsQUFBaCtRUUZBQUFHQUN3bkFHWUFkUUFBQVFBRC8yaTZ2Qkl0eWttcnZUaHJGa2daV3lpT1pLa01SVm9JWnV1K202Q3FCQVRmK052TjgyRG53Q0FHeGVPQmhNaWtvOGdrc0pSUTNJN1ovRVd2SkJsMWU4UjZOZFB0OXZrdFU0aGlzZFBNWm1qVDhGcWJqWWJEdS9QcjI4NG41NVVlZklJRmNuOUllNE44UG9aQVlZbURlSXd1aUkrRGZwSWtqcFdKaFpnamxKdUppNTRibXFHVmw2UVZvS2VQYTZvVnBxMmJuYkFOckxPYmtiWUdBWFc1czZtMnNzQ1Z0YndHdU1XY1ZyeSt5N203dzRIUXA4S3d5dFYyeDd5LzJxTE4wOStoMHRqam9kZXEzdWZiNGJERTdHTGxxdG54VE9tazYvWmI3dS9VKzJPUVNhZ1hqNERBTXdEdkhhUUE3NXpCaGF2KzJlc0hrWUUrYmZNcWNwRDRUZitqQmdFY2wrSHpHSUdnTVpJaG5rR2ppSkpoU0ZvdHN3QmpHVFBXUlVVMVRUUk1rM01TcXA0dmJoWjVDTlRGVGhVMGk4YTRvelRIemFSTlU0Yk1HTFVFSXFKVmdhQVptVlVuQWF4ZHc0b2RTN2FzMmJObzA2cGR5N2F0MjdkdzQ4cWRTN2V1M2J0NDgrcmR5N2V2MzcrQUF3c2VUTGl3NGNPSUV5dGV6TGl4NDhlUUkwdWVUTG15NWN1WU0ydmV6TG16NTgrZ1E0c2VUYnEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQWd3c2ZUcnk0OGVPNEF3UUFBQmlBY3VYTSt6NmZ6dGY1OU9mUjhWN2ZucDJ1OWUzWHU4Y0ZUeDZxMmZMbHhhLzlqaDY4ZXJUdDQ3OG55ejQrK2ZsaTdldkhYN1crZnZUZi9DbjEzNERteGVRZmdlV0pkU0NDN3VYSG9Id0tQaGpmV0JLMkYyQk9DMWFvSElVYTNoZGhoK0J4Q09KMUlvNkkzWWNtUGxkaWloZldsS0dHSzVyWW9vRXBVdWRnalFXMjlLS0VNOGFFNDRZMzF0Z2pTanRLR09PSVE1SlVKSU5Ka3ZSamprVCsyS1JIVHg0SjRwUVZMY21nbFIyT3BTV0JXRlpVSllvc2Nna2ptVEthV2FHYVJxS0pKSnNQZWlrbG5GdTZlU1dkQ01xSm81NUM0a2tnbjJVR21TS2dhUXI2cHAxZCt2bGZtRm51V2RhWDlqR3E1SWhxUVVvZVc1YUc1MWFtUUw1bHFhUktRVnJYa3FEMnQyTmVHVmJIblYvc0JlWmNxUllrQUFBaCtRUUZBQUFHQUN3bkFDb0FkUUFBQVFBRC8yaTYzUDR3eWtsTkNEWHJ6YnRYQWtGOFpHbWVJRkdzQXVxKzhDSU1hejNHZUw0RmRPMFB1cUN3RVFqNWpnWE1jSWt6SW84M3B0VEVlMXFWMHl6SGFVVkd0V0JKdGR0dGhjL0VnWXBNUnJzdFBUWVorQVp6NVdSc2ZUbkd5Nzk3UVhkK2JIcUJPUUtFaElDSE9HdUtjbWFOT1FHUWZvYVRMNCtXWFhTWk1aV2NoWjg0Y2FKUGpLUlVwMlNTcWlpSnJLaXZNSnV5Tlo2MEpyRzNSNWk2SHJhOXVjQWZvYjArdjhVYnBzaXB5eHJIeUN6UUpNM0kxU1RUUDlrZXZOdkszUkxDdDgvaUVkL1Q0ZWNQNUxMbTdBN1MwNjd4RXRlOTloWHp5TVQ2RC9odXJmdG53QjByZUFUVElhdEhzSUhCVXdqLzhldkZzT0dDaDZjRzZwdDR5LytmUlFVQlpXblV0ODNHeHdjS0taNTBnSkZUUkgwcE82NTBXSExGeUhnY1pYbjhHSkxWVFhZNUQ4NWswUE5VeFk4MVZ3eVZrWFNueFphY2ZwNExDbkdwQXFpV3BJcWpLdXFsdmFLaWpqYmtLc3FxZ1pnNnpXSlY1TFFoV3BkYTJhMWxJM1lsV1RadGg0THRRaUF1d2J0UTZwbzFzTmVINE1FS0NPVkZ6SlJOWDhZYURCSTRESmxCek1XVldSNFo0TGZ5c2NlWlA5Q2dITHEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQWd3c2ZUcnk0OGVQSWt5dGZ6cnk1OCtmUW8wdWZUcjI2OWV2WXMydmZ6cjI3OSsvZ3c0c2ZUNzY4K2ZQbzA2dGZ6NzY5Ky9mdzQ4dWZUNysrL2Z2NDgrdmZ6NysvLy8vL0FBWW80SUFFRmlqYkJia0JjRUVBQU5pbTRJSUl6dllnaEJjMEdOdUVGRmI0R29ZWkx0Z2FoeDB1YUdGcUlaYlltVVVnbWlpaWFTbXFDR0ZwTHNaWVdZc3hVamlpVlRUV21PRmdPdlo0NDBrNTl0amhURUVLMmVHUEVobXBKSXBLTm5uaUpFVTZXU0tTMlVocEpUdFJXbWtpbGJwa3FhV0tWWDc1SlplZmVDbW1pMlFlWXVhWkx0S3lKcHRidWdubm1ITE9hV1dhZTd4cFo0WjQxckhublhYK3FXU2ZiK2dwYUlTdkhOb2tvVzRZS2lpamFEajZKNlJvS0xxa0xwWUtTV21qbWNhNGFhR2R4cG1OcEYrZVE2cVVuMElacW9iMm5DcGtRNjU2eXVTaHFRSVQ2NUZMN1duV3JheWFkV2F0cG1vSkxFNVNzcmdvYW1zT0M2dU9HTXArRkNWc0tqWkxaSWpTTGdYaWJSQldPNWlDMmhLVUFBQWgrUVFGQUFBR0FDd1hBQmNBdWdDL0FBQUQvMmk2M1A0d3lrbXJ2VGk3d0lVWUlDR0tSV21laGFpdGJPdStNSVhPZEYzRWVLN3ZzTzNYdktCd09Qd1pUd0dpY3NuRUhKL0pwblE2ZlI2ajFLeVdaelZpdCtBd3EvdjdpczlvQ2RsblRydmZhMXY3VFJmSGEvTzZQbnVuNWZlQVRIMHpmNEdHUW9Nb2hZZU1PWWxJalpGRmp5V0xrcGNhbEpXWW5ER2FCWmFkb2hHZm9hT25ES1dvcXhXcXJLOFFud0t3dEEyeXRiZ0d0N20wdTd5dnZyK3J3Y0tueE1XaXg4aWN5c3VYemM2UjBOR00wOVNHMXRlQTJkcDYzTjEwbndQZ3o1cmo1TkxtNk9tVTUrdUg0dS9WNnZMWTlQWGI5L2plK3Z2aC9mN2N4QXRZWnlCQk9BQVAya21vRUl6QmhtYytFWUNZUmlKRk5CWXZMcVEwVWY5am1Jd2V0NEFNeVVkVFI1SWxPYUxVTW5KbGs1WXVsOENNU1dRbVRVUW1iNzdNcVZNbXo1NDFmd0xGcVhMb3BLSkdnM3k2a1ZUcHA2Wk9OVUhsOG5TcWpxVldyMWJONm1rcjF4Y2d3b29kUzdhc3U2OW8wNnBkeTdhdDI3ZHc0OHFkUzdldTNidDQ4K3JkeTdldjM3K0FBd3NlVExpdzRjT0lFeXRlekxpeDQ4ZVFJMHVlVExteTVjdVlNMnZlekxtejU4K2dRNHNlVGJxMDZkT29VNnRlemJxMTY5ZXdZOHVlVGJ1MjdkdTRjK3ZlemJ1Mzc5L0FOUURnUUx5NDhlUElreXRmenB3NXhlYlFvMHVmanZ3NTlldllzM093cnIyN2QrWGN2NHNYSDM2OCtlemx6NnVYbm42OSsrWHQzOHMzSG4rKy9mcjI1ZVBQNzM0L2YvVkUvdjFuWG9BQ2tnZFJnZndSaUdCM0NpNkkzb0VPNmdkaGhQMU5TQ0dBRmw0NFlJWWFHdGhRaHhoK0NPS0dJbzdvb1VJbWp1Y1JBQ3kyNk9LTE1NYm80b0lVSlFBQUlma0VCUUFBQmdBc0p3QW1BQUVCZkFBQUEvOW91dHorTU1wSnE3MDQ2ODI3R29JbmptUnBubWpLQ1VWQkNJRXF6M1J0MzFXcnZ6SHUvOENna0RIUUdYbkRwSExKdkFTTVVCZXNTYTFhZ1lSbzlIWHRlcjhpbGxiTEJadlBhRVoyUEFhbDMzQnFrVTBmOU9MNHZPMUo3eVAxZ0lFbGEzMStJWUtJaVJkaWhZMTJpcENSRFlTTmhXV1NtSUp6bFpVRW1aOTZmSnlWaDZDbWFaU2pkSjZucldhaXFuMTNyclJXcWJGYUE3VzdWWXk0Ykx6QlM3Qy9XcVhDeUQrYnhWdkp6ajdFekVheno5VXF0OUl1MXRzcXZ0azYxTnppSGRIZnV1UG9Ic3ZmTGVudUcrWFp4Ky8wRTlqU3JQWDZFZDdzNGZzQURiQ0RjaTZnUVFQci9CMDBHRTlhd1lYNzdqSExCMUZmdjIvektyNGJlRVQvNDc2RTMvNTVGTmVRMmNPUjZTUXlFNG5TMmtWNUxkK3AvRVV4cGppUTJWamFURmF5V00yZDFtYiswZ2swMkV1SFJjVUp4WldVRzA1cEdac0s2MGxUYWxDTzRLdytvNHJycDFaZVMyTVIvV3JxcVVteXlMakc4b3JXVlZoVlVkdWVVcXVLclZ4VGIwZU52UnZwNkZtK3RPaXEyZ3M0a2RsaWNRdExFc3pKcnVKSWVUa2xmcXpJcjAvS3BoaHpJb3c1eitGZkp6dEQwbHlKY3drQUFFVFhpRXdLQ0lBQXNGWExzRndWQ096YnFXV2Z3SnIxeCt2YnVIV1RvTjNWTmZEakFYSUw3eUNBdFN6YnlKRXZEek13ZEkzZjBZOHJuNzdoY3lQajJiTnY1NDRoZ0hNZGsxVmdEeCtkL0Fybmp0V3puei9ldlFYdlVFeVRtTTgvdWYwTS93SGdwNDF2L2ZWWDMzOFNtTmVJZmlNVTZDQ0NHRmhtSFEzck9VZ2ZoQmZnRko4S0ZuWjRJSVlPS0FoRmVpbFUyS0dCSUZJZzRvQSttSGhpZ1NsU0lBYURJcmo0SW9veFNrQWlDamJlV09DSE9RYlJvNDgvQnFuRWtFUVdhYVFRU0NhcDVKSTROT21rZzBCQ2VZS1VVejVvSllWWmR1bmZsak5nNlNWL1ZZSlo0NWhUbG1rbUIyS2l5ZDZhOHJsSnBKcHdhdENtbk1qUldXZDVlUHFvNTU0VjNOa25jSUNhSU9pZ1h4YmFJS0luL3Fsb0JJY2krdWdJa2ZicDZLUVBNT29ocGg1VWl1YWxuRDdnYVplaGxxQnBlS0NXQ3NHb1JLcDY1YW5CdVhvQ3JEVEtPZ0dyTU5vYUo1NnA2bW9CcnRuNXl1V253bDQzWnJFM0FOc3JzaXdaNE1wc2k2MCtTMkNqMGdaeFlyVk1Vb250RUZKdXE4U0YzaWJSWTdoTW1FZ3VGY0F0ZXk2UHNUR2JBQUE3XCIgYWx0PVwiTG9hZGluZy4uLlwiIC8+XG4vLyAgIDwvZGl2PlxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhdHQtcnR0YW1hcGxpYicsXG4gIHRlbXBsYXRlOiBgICBcbiAgPGRpdiBpZD0nbXlNYXAnIHN0eWxlPVwicGFkZGluZzogMHB4IDBweCAwcHggMTBweDtcIiAjbWFwRWxlbWVudD5cbiAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgUnR0YW1hcGxpYkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29ubmVjdGlvbjtcbiAgbWFwOiBhbnk7XG4gIGNvbnRleHRNZW51OiBhbnk7XG4gIHRlY2huaWNpYW5QaG9uZTogc3RyaW5nO1xuICB0ZWNobmljaWFuRW1haWw6IHN0cmluZztcbiAgdGVjaG5pY2lhbk5hbWU6IHN0cmluZztcbiAgdHJhdmFsRHVyYXRpb247XG4gIHRydWNrSXRlbXMgPSBbXTtcblxuICBkaXJlY3Rpb25zTWFuYWdlcjtcbiAgdHJhZmZpY01hbmFnZXI6IGFueTtcblxuICB0cnVja0xpc3QgPSBbXTtcbiAgdHJ1Y2tXYXRjaExpc3Q6IFRydWNrRGV0YWlsc1tdO1xuICBidXN5OiBhbnk7XG4gIG1hcHZpZXcgPSAncm9hZCc7XG4gIGxvYWRpbmcgPSBmYWxzZTtcbiAgQFZpZXdDaGlsZCgnbWFwRWxlbWVudCcpIHNvbWVJbnB1dDogRWxlbWVudFJlZjtcbiAgbXlNYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlNYXAnKTtcbiAgcmVhZHkgPSBmYWxzZTtcbiAgYW5pbWF0ZWRMYXllcjtcbiAgQFZpZXdDaGlsZCgnc21zcG9wdXAnKSBzbXNwb3B1cDogUG9wdXA7XG4gIEBWaWV3Q2hpbGQoJ2VtYWlscG9wdXAnKSBlbWFpbHBvcHVwOiBQb3B1cDtcbiAgQFZpZXdDaGlsZCgnaW5mbycpIGluZm9UZW1wbGF0ZTogRWxlbWVudFJlZjtcbiAgc29ja2V0OiBhbnkgPSBudWxsO1xuICBzb2NrZXRVUkw6IHN0cmluZztcbiAgcmVzdWx0cyA9IFtcbiAgXTtcbiAgcHVibGljIHVzZXJSb2xlOiBhbnk7XG4gIGxhc3Rab29tTGV2ZWwgPSAxMDtcbiAgbGFzdExvY2F0aW9uOiBhbnk7XG4gIHJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzID0gW107XG4gIHJlcG9ydGluZ1RlY2huaWNpYW5zID0gW107XG4gIGlzVHJhZmZpY0VuYWJsZWQgPSAwO1xuICBsb2dnZWRVc2VySWQgPSAnJztcbiAgbWFuYWdlclVzZXJJZCA9ICcnO1xuICBjb29raWVBVFRVSUQgPSAnJztcbiAgZmVldDogbnVtYmVyID0gMC4wMDAxODkzOTQ7XG4gIElzQXJlYU1hbmFnZXIgPSBmYWxzZTtcbiAgSXNWUCA9IGZhbHNlO1xuICBmaWVsZE1hbmFnZXJzID0gW107XG4gIC8vIFdlYXRoZXIgdGlsZSB1cmwgZnJvbSBJb3dhIEVudmlyb25tZW50YWwgTWVzb25ldCAoSUVNKTogaHR0cDovL21lc29uZXQuYWdyb24uaWFzdGF0ZS5lZHUvb2djL1xuICB1cmxUZW1wbGF0ZSA9ICdodHRwOi8vbWVzb25ldC5hZ3Jvbi5pYXN0YXRlLmVkdS9jYWNoZS90aWxlLnB5LzEuMC4wL25leHJhZC1uMHEte3RpbWVzdGFtcH0ve3pvb219L3t4fS97eX0ucG5nJztcblxuICAvLyBUaGUgdGltZSBzdGFtcHMgdmFsdWVzIGZvciB0aGUgSUVNIHNlcnZpY2UgZm9yIHRoZSBsYXN0IDUwIG1pbnV0ZXMgYnJva2VuIHVwIGludG8gNSBtaW51dGUgaW5jcmVtZW50cy5cbiAgdGltZXN0YW1wcyA9IFsnOTAwOTEzLW01MG0nLCAnOTAwOTEzLW00NW0nLCAnOTAwOTEzLW00MG0nLCAnOTAwOTEzLW0zNW0nLCAnOTAwOTEzLW0zMG0nLCAnOTAwOTEzLW0yNW0nLCAnOTAwOTEzLW0yMG0nLCAnOTAwOTEzLW0xNW0nLCAnOTAwOTEzLW0xMG0nLCAnOTAwOTEzLW0wNW0nLCAnOTAwOTEzJ107XG5cbiAgdGVjaFR5cGU6IGFueTtcblxuICB0aHJlc2hvbGRWYWx1ZSA9IDA7XG5cbiAgYW5pbWF0aW9uVHJ1Y2tMaXN0ID0gW107XG5cbiAgZHJvcGRvd25TZXR0aW5ncyA9IHt9O1xuICBzZWxlY3RlZEZpZWxkTWdyID0gW107XG4gIG1hbmFnZXJJZHMgPSAnJztcblxuICByYWRpb3VzVmFsdWUgPSAnJztcblxuICBmb3VuZFRydWNrID0gZmFsc2U7XG5cbiAgbG9nZ2VkSW5Vc2VyVGltZVpvbmUgPSAnQ1NUJztcbiAgY2xpY2tlZExhdDsgYW55O1xuICBjbGlja2VkTG9uZzogYW55O1xuICBkYXRhTGF5ZXI6IGFueTtcbiAgcGF0aExheWVyOiBhbnk7XG4gIGluZm9Cb3hMYXllcjogYW55O1xuICBpbmZvYm94OiBhbnk7XG4gIGlzTWFwTG9hZGVkID0gdHJ1ZTtcbiAgV29ya0Zsb3dBZG1pbiA9IGZhbHNlO1xuICBTeXN0ZW1BZG1pbiA9IGZhbHNlO1xuICBSdWxlQWRtaW4gPSBmYWxzZTtcbiAgUmVndWxhclVzZXIgPSBmYWxzZTtcbiAgUmVwb3J0aW5nID0gZmFsc2U7XG4gIE5vdGlmaWNhdGlvbkFkbWluID0gZmFsc2U7XG4gIEBJbnB1dCgpIHRpY2tldExpc3Q6IGFueSA9IFtdO1xuICBASW5wdXQoKSBsb2dnZWRJblVzZXI6IHN0cmluZztcbiAgQE91dHB1dCgpIHRpY2tldENsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHRpY2tldERhdGE6IFRpY2tldFtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBtYXBTZXJ2aWNlOiBSdHRhbWFwbGliU2VydmljZSxcbiAgICAvL3ByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIFxuICAgIC8vcHVibGljIHRvYXN0cjogVG9hc3RzTWFuYWdlciwgXG4gICAgdlJlZjogVmlld0NvbnRhaW5lclJlZlxuICAgICkge1xuICAgIC8vdGhpcy50b2FzdHIuc2V0Um9vdFZpZXdDb250YWluZXJSZWYodlJlZik7XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmNvb2tpZUFUVFVJRCA9IFwia3I1MjI2XCI7Ly90aGlzLnV0aWxzLmdldENvb2tpZVVzZXJJZCgpO1xuICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMgPSBbXTtcbiAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnB1c2godGhpcy5jb29raWVBVFRVSUQpO1xuICAgIHRoaXMudHJhdmFsRHVyYXRpb24gPSA1MDAwO1xuICAgIC8vIC8vIHRvIGxvYWQgYWxyZWFkeSBhZGRyZWQgd2F0Y2ggbGlzdFxuICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja1dhdGNoTGlzdCcpICE9IG51bGwpIHtcbiAgICAgIHRoaXMudHJ1Y2tMaXN0ID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja1dhdGNoTGlzdCcpKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgIHRoaXMubG9nZ2VkVXNlcklkID0gdGhpcy5tYW5hZ2VyVXNlcklkID0gXCJrcjUyMjZcIjsvL3RoaXMudXRpbHMuZ2V0Q29va2llVXNlcklkKCk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgLy90aGlzLmNoZWNrVXNlckxldmVsKGZhbHNlKTtcbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSAnY29tcGxldGUnKSAge1xuICAgICAgZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgIHRoaXMubWFwdmlldyA9ICdyb2FkJztcbiAgICAgICAgICB0aGlzLmxvYWRNYXBWaWV3KCdyb2FkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5uZ09uSW5pdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgIHRoaXMubWFwdmlldyA9ICdyb2FkJztcbiAgICAgICAgdGhpcy5sb2FkTWFwVmlldygncm9hZCcpO1xuICAgICAgfVxuICAgIH0gICBcbiAgfVxuXG4gIGNoZWNrVXNlckxldmVsKElzU2hvd1RydWNrKSB7XG4gICAgdGhpcy5maWVsZE1hbmFnZXJzID0gW107XG4gICAgLy8gQXNzaWduIGxvZ2dlZCBpbiB1c2VyXG4gICAgdmFyIG1nciA9IHsgaWQ6IHRoaXMubWFuYWdlclVzZXJJZCwgaXRlbU5hbWU6IHRoaXMubWFuYWdlclVzZXJJZCB9O1xuICAgIHRoaXMuZmllbGRNYW5hZ2Vycy5wdXNoKG1ncik7XG5cbiAgICAvLyBDb21tZW50IGJlbG93IGxpbmUgd2hlbiB5b3UgZ2l2ZSBmb3IgcHJvZHVjdGlvbiBidWlsZCA5MDA4XG4gICAgdGhpcy5Jc1ZQID0gdHJ1ZTtcblxuICAgIC8vIENoZWNrIGlzIGxvZ2dlZCBpbiB1c2VyIGlzIGEgZmllbGQgbWFuYWdlciBhcmVhIG1hbmFnZXIvdnBcbiAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VySW5mbyh0aGlzLm1hbmFnZXJVc2VySWQpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xuICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSkge1xuICAgICAgICBsZXQgbWFuYWdlcnMgPSAnZic7XG4gICAgICAgIGxldCBhbWFuYWdlcnMgPSAnZSc7XG4gICAgICAgIGxldCB2cCA9ICdhLGIsYyxkJztcblxuICAgICAgICBpZiAoZGF0YS5sZXZlbC5pbmRleE9mKG1hbmFnZXJzKSA+IC0xKSB7XG4gICAgICAgICAgLy8gdGhpcy5Jc1ZQID0gSXNTaG93VHJ1Y2s7XG4gICAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5tYW5hZ2VySWRzID0gdGhpcy5maWVsZE1hbmFnZXJzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1bJ2lkJ107XG4gICAgICAgICAgfSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAvLyB0aGlzLmdldFRlY2hEZXRhaWxzRm9yTWFuYWdlcnMoKTtcbiAgICAgICAgICAvLyB0aGlzLkxvYWRUcnVja3ModGhpcy5tYXAsIG51bGwsIG51bGwsIG51bGwsIGZhbHNlKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgLy8kKCcjbG9hZGluZycpLmhpZGUoKSBcbiAgICAgICAgfSwgMzAwMCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZXZlbC5pbmRleE9mKGFtYW5hZ2VycykgPiAtMSkge1xuICAgICAgICAgIHRoaXMuZmllbGRNYW5hZ2VycyA9IFtdO1xuICAgICAgICAgIHZhciBhcmVhTWdyID0ge1xuICAgICAgICAgICAgaWQ6IHRoaXMubWFuYWdlclVzZXJJZCxcbiAgICAgICAgICAgIGl0ZW1OYW1lOiBkYXRhLm5hbWUgKyAnICgnICsgdGhpcy5tYW5hZ2VyVXNlcklkICsgJyknXG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMudW5zaGlmdChhcmVhTWdyKTtcbiAgICAgICAgICB0aGlzLmdldExpc3RvZkZpZWxkTWFuYWdlcnMoKTtcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEubGV2ZWwuaW5kZXhPZih2cCkgPiAtMSkge1xuICAgICAgICAgIHRoaXMuSXNWUCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gZmFsc2U7XG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL3RoaXMudG9hc3RyLndhcm5pbmcoJ05vdCB2YWxpZCBGaWVsZC9BcmVhIE1hbmFnZXIhJywgJ01hbmFnZXInLCB7IHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSB9KVxuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vdGhpcy50b2FzdHIud2FybmluZygnUGxlYXNlIGVudGVyIHZhbGlkIEZpZWxkL0FyZWEgTWFuYWdlciBhdHR1aWQhJywgJ01hbmFnZXInLCB7IHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSB9KVxuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgfVxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGNvbm5lY3Rpbmcgd2ViIHBob25lIScsICdFcnJvcicpXG4gICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TGlzdG9mRmllbGRNYW5hZ2VycygpIHtcbiAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VyRGF0YSh0aGlzLm1hbmFnZXJVc2VySWQpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xuICAgICAgaWYgKGRhdGEuVGVjaG5pY2lhbkRldGFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKHZhciB0ZWNoIGluIGRhdGEuVGVjaG5pY2lhbkRldGFpbHMpIHtcbiAgICAgICAgICB2YXIgbWdyID0ge1xuICAgICAgICAgICAgaWQ6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkLFxuICAgICAgICAgICAgaXRlbU5hbWU6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0ubmFtZSArICcgKCcgKyBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmF0dHVpZCArICcpJ1xuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5maWVsZE1hbmFnZXJzLnB1c2gobWdyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuSXNWUCA9IGZhbHNlO1xuICAgICAgICB0aGlzLklzQXJlYU1hbmFnZXIgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5Jc1ZQID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gZmFsc2U7XG4gICAgICAgIC8vdGhpcy50b2FzdHIud2FybmluZygnRG8gbm90IGhhdmUgYW55IGRpcmVjdCByZXBvcnRzIScsICdNYW5hZ2VyJyk7XG4gICAgICB9XG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgY29ubmVjdGluZyB3ZWIgcGhvbmUhJywgJ0Vycm9yJyk7XG4gICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VGVjaERldGFpbHNGb3JNYW5hZ2VycygpIHtcbiAgICBpZiAodGhpcy5tYW5hZ2VySWRzICE9IG51bGwpIHtcbiAgICAgIHRoaXMubWFwU2VydmljZS5nZXRXZWJQaG9uZVVzZXJEYXRhKHRoaXMubWFuYWdlcklkcykudGhlbigoZGF0YTogYW55KSA9PiB7XG4gICAgICAgIGlmIChkYXRhLlRlY2huaWNpYW5EZXRhaWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgKHZhciB0ZWNoIGluIGRhdGEuVGVjaG5pY2lhbkRldGFpbHMpIHtcbiAgICAgICAgICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMucHVzaChkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmF0dHVpZCk7XG5cbiAgICAgICAgICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMucHVzaCh7XG4gICAgICAgICAgICAgIGF0dHVpZDogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQsXG4gICAgICAgICAgICAgIG5hbWU6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0ubmFtZSxcbiAgICAgICAgICAgICAgZW1haWw6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uZW1haWwsXG4gICAgICAgICAgICAgIHBob25lOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLnBob25lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAgIFxuICBsb2FkTWFwVmlldyh0eXBlOiBTdHJpbmcpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy50cnVja0l0ZW1zID0gW107XG4gICAgdmFyIGxvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKDQwLjA1ODMsIC03NC40MDU3KTtcblxuICAgIGlmICh0aGlzLmxhc3RMb2NhdGlvbikge1xuICAgICAgbG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odGhpcy5sYXN0TG9jYXRpb24ubGF0aXR1ZGUsIHRoaXMubGFzdExvY2F0aW9uLmxvbmdpdHVkZSk7XG4gICAgfVxuICAgIHRoaXMubWFwID0gbmV3IE1pY3Jvc29mdC5NYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlNYXAnKSwge1xuICAgICAgY3JlZGVudGlhbHM6ICdBbnhwUy0zMmtZdkJ6alE1cGJaY25EejE3b0tCYTFCcTJIUndIQU5vTnBIczNaMjVORHZxYmhjcUpaeURvWU1qJyxcbiAgICAgIGNlbnRlcjogbG9jYXRpb24sXG4gICAgICBtYXBUeXBlSWQ6IHR5cGUgPT0gJ3NhdGVsbGl0ZScgPyBNaWNyb3NvZnQuTWFwcy5NYXBUeXBlSWQuYWVyaWFsIDogTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLnJvYWQsXG4gICAgICB6b29tOiAxMixcbiAgICAgIGxpdGVNb2RlOiB0cnVlLFxuICAgICAgLy9uYXZpZ2F0aW9uQmFyT3JpZW50YXRpb246IE1pY3Jvc29mdC5NYXBzLk5hdmlnYXRpb25CYXJPcmllbnRhdGlvbi5ob3Jpem9udGFsLFxuICAgICAgZW5hYmxlQ2xpY2thYmxlTG9nbzogZmFsc2UsXG4gICAgICBzaG93TG9nbzogZmFsc2UsXG4gICAgICBzaG93VGVybXNMaW5rOiBmYWxzZSxcbiAgICAgIHNob3dNYXBUeXBlU2VsZWN0b3I6IGZhbHNlLFxuICAgICAgc2hvd1RyYWZmaWNCdXR0b246IHRydWUsXG4gICAgICBlbmFibGVTZWFyY2hMb2dvOiBmYWxzZSxcbiAgICAgIHNob3dDb3B5cmlnaHQ6IGZhbHNlXG4gICAgfSk7XG4gICAgXG4gICAgLy9Mb2FkIHRoZSBBbmltYXRpb24gTW9kdWxlXG4gICAgLy9NaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKFwiQW5pbWF0aW9uTW9kdWxlXCIpO1xuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ0FuaW1hdGlvbk1vZHVsZScsIGZ1bmN0aW9uICgpIHtcbiAgICB9KTtcblxuICAgIC8vU3RvcmUgc29tZSBtZXRhZGF0YSB3aXRoIHRoZSBwdXNocGluXG4gICAgdGhpcy5pbmZvYm94ID0gbmV3IE1pY3Jvc29mdC5NYXBzLkluZm9ib3godGhpcy5tYXAuZ2V0Q2VudGVyKCksIHtcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSk7XG4gICAgdGhpcy5pbmZvYm94LnNldE1hcCh0aGlzLm1hcCk7XG5cbiAgICAvLyBDcmVhdGUgYSBsYXllciBmb3IgcmVuZGVyaW5nIHRoZSBwYXRoLlxuICAgIHRoaXMucGF0aExheWVyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxheWVyKCk7XG4gICAgdGhpcy5tYXAubGF5ZXJzLmluc2VydCh0aGlzLnBhdGhMYXllcik7XG5cbiAgICAvLyBMb2FkIHRoZSBTcGF0aWFsIE1hdGggbW9kdWxlLlxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoJywgZnVuY3Rpb24gKCkgeyB9KTtcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zJywgZnVuY3Rpb24gKCkgeyB9KTtcblxuICAgIC8vIENyZWF0ZSBhIGxheWVyIHRvIGxvYWQgcHVzaHBpbnMgdG8uXG4gICAgdGhpcy5kYXRhTGF5ZXIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRW50aXR5Q29sbGVjdGlvbigpO1xuXG4gICAgLy8gQWRkIGEgcmlnaHQgY2xpY2sgZXZlbnQgdG8gdGhlIG1hcFxuICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMubWFwLCAncmlnaHRjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBjb25zdCB4MSA9IGUubG9jYXRpb247XG4gICAgICB0aGF0LmNsaWNrZWRMYXQgPSB4MS5sYXRpdHVkZTtcbiAgICAgIHRoYXQuY2xpY2tlZExvbmcgPSB4MS5sb25naXR1ZGU7XG4gICAgICB0aGF0LnJhZGlvdXNWYWx1ZSA9ICcnO1xuICAgICAgalF1ZXJ5KCcjbXlSYWRpdXNNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgfSk7XG5cbiAgICAvL2xvYWQgdGlja2V0IGRldGFpbHNcbiAgICB0aGlzLmFkZFRpY2tldERhdGEodGhpcy5tYXAsIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIpO1xuICAgIFxuICB9XG5cbiAgTG9hZFRydWNrcyhtYXBzLCBsdCwgbGcsIHJkLCBpc1RydWNrU2VhcmNoKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy50cnVja0l0ZW1zID0gW107XG5cbiAgICBpZiAoIWlzVHJ1Y2tTZWFyY2gpIHtcblxuICAgICAgdGhpcy5tYXBTZXJ2aWNlLmdldE1hcFB1c2hQaW5EYXRhKHRoaXMubWFuYWdlcklkcykudGhlbigoZGF0YTogYW55KSA9PiB7XG4gICAgICAgIGlmICghalF1ZXJ5LmlzRW1wdHlPYmplY3QoZGF0YSkgJiYgZGF0YS50ZWNoRGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdmFyIHRlY2hEYXRhID0gZGF0YS50ZWNoRGF0YTtcbiAgICAgICAgICB2YXIgZGlyRGV0YWlscyA9IFtdO1xuICAgICAgICAgIHRlY2hEYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmxvbmcgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGl0ZW0ubG9uZyA9IGl0ZW0ubG9uZ2c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS50ZWNoSUQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHZhciBkaXJEZXRhaWw6IFRydWNrRGlyZWN0aW9uRGV0YWlscyA9IG5ldyBUcnVja0RpcmVjdGlvbkRldGFpbHMoKTtcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnRlY2hJZCA9IGl0ZW0udGVjaElEO1xuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTGF0ID0gaXRlbS5sYXQ7XG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMb25nID0gaXRlbS5sb25nO1xuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExhdCA9IGl0ZW0ud3JMYXQ7XG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TG9uZyA9IGl0ZW0ud3JMb25nO1xuICAgICAgICAgICAgICBkaXJEZXRhaWxzLnB1c2goZGlyRGV0YWlsKTtcbiAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2YXIgcm91dGVNYXBVcmxzID0gW107XG4gICAgICAgICAgcm91dGVNYXBVcmxzID0gdGhpcy5tYXBTZXJ2aWNlLkdldFJvdXRlTWFwRGF0YShkaXJEZXRhaWxzKTtcblxuICAgICAgICAgIGZvcmtKb2luKHJvdXRlTWFwVXJscykuc3Vic2NyaWJlKHJlc3VsdHMgPT4ge1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSByZXN1bHRzLmxlbmd0aCAtIDE7IGorKykge1xuICAgICAgICAgICAgICBsZXQgcm91dGVEYXRhID0gcmVzdWx0c1tqXSBhcyBhbnk7XG4gICAgICAgICAgICAgIGxldCByb3V0ZWRhdGFKc29uID0gcm91dGVEYXRhLmpzb24oKTtcbiAgICAgICAgICAgICAgaWYgKHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMgIT0gbnVsbFxuICAgICAgICAgICAgICAgICYmIHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTGF0ID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzBdXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMb25nID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzFdXG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMYXQgPSBuZXh0U291cmNlTGF0O1xuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTG9uZyA9IG5leHRTb3VyY2VMb25nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBsaXN0T2ZQaW5zID0gbWFwcy5lbnRpdGllcztcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0T2ZQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIHRlY2hJZCA9IGxpc3RPZlBpbnMuZ2V0KGkpLm1ldGFkYXRhLkFUVFVJRDtcbiAgICAgICAgICAgICAgdmFyIHRydWNrQ29sb3IgPSBsaXN0T2ZQaW5zLmdldChpKS5tZXRhZGF0YS50cnVja0NvbC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICB2YXIgY3VyUHVzaFBpbiA9IGxpc3RPZlBpbnMuZ2V0KGkpO1xuICAgICAgICAgICAgICB2YXIgY3VyckRpckRldGFpbCA9IFtdO1xuXG4gICAgICAgICAgICAgIGN1cnJEaXJEZXRhaWwgPSBkaXJEZXRhaWxzLmZpbHRlcihlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50ZWNoSWQgPT09IHRlY2hJZCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICB2YXIgbmV4dExvY2F0aW9uO1xuXG4gICAgICAgICAgICAgIGlmIChjdXJyRGlyRGV0YWlsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBuZXh0TG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMYXQsIGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTG9uZyk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAobmV4dExvY2F0aW9uICE9IG51bGwgJiYgbmV4dExvY2F0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhciBwaW5Mb2NhdGlvbiA9IGxpc3RPZlBpbnMuZ2V0KGkpLmdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRDb29yZCA9IHRoYXQuQ2FsY3VsYXRlTmV4dENvb3JkKHBpbkxvY2F0aW9uLCBuZXh0TG9jYXRpb24pO1xuICAgICAgICAgICAgICAgIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHBpbkxvY2F0aW9uLCBuZXh0Q29vcmQpO1xuICAgICAgICAgICAgICAgIHZhciB0cnVja1VybCA9IHRoaXMuZ2V0VHJ1Y2tVcmwodHJ1Y2tDb2xvcik7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKGN1clB1c2hQaW4sIHRydWNrVXJsLCBiZWFyaW5nLCBmdW5jdGlvbiAoKSB7IH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5tYXBTZXJ2aWNlLmdldFRydWNrRmVlZCh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLCB0aGlzLm1hbmFnZXJJZHMpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMuc29tZSh4ID0+IHgudG9Mb3dlckNhc2UoKSA9PSBkYXRhLnRlY2hJRC50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGRhdGEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgZmV0Y2hpbmcgdHJ1Y2tzIGZyb20gS2Fma2EgQ29uc3VtZXIuIEVycm9ycy0+ICcgKyBlcnIuRXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdObyB0cnVjayBmb3VuZCEnLCAnTWFuYWdlcicpO1xuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBmZXRjaGluZyBkYXRhIGZyb20gQVBJIScsICdFcnJvcicpO1xuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcblxuICAgICAgY29uc3QgbXRycyA9IE1hdGgucm91bmQodGhhdC5nZXRNZXRlcnMocmQpKTtcbiAgICAgIHRoaXMubWFwU2VydmljZS5maW5kVHJ1Y2tOZWFyQnkobHQsIGxnLCBtdHJzLCB0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICBpZiAoIWpRdWVyeS5pc0VtcHR5T2JqZWN0KGRhdGEpICYmIGRhdGEudGVjaERhdGEubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgY29uc3QgdGVjaERhdGEgPSBkYXRhLnRlY2hEYXRhO1xuICAgICAgICAgIGxldCBkaXJEZXRhaWxzID0gW107XG4gICAgICAgICAgdGVjaERhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0ubG9uZyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgaXRlbS5sb25nID0gaXRlbS5sb25nZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoaXRlbS50ZWNoSUQgIT0gdW5kZWZpbmVkKSAmJiAoZGlyRGV0YWlscy5zb21lKHggPT4geC50ZWNoSWQgPT0gaXRlbS50ZWNoSUQpID09IGZhbHNlKSkge1xuICAgICAgICAgICAgICB2YXIgZGlyRGV0YWlsOiBUcnVja0RpcmVjdGlvbkRldGFpbHMgPSBuZXcgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzKCk7XG4gICAgICAgICAgICAgIGRpckRldGFpbC50ZWNoSWQgPSBpdGVtLnRlY2hJRDtcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxhdCA9IGl0ZW0ubGF0O1xuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTG9uZyA9IGl0ZW0ubG9uZztcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMYXQgPSBpdGVtLndyTGF0O1xuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExvbmcgPSBpdGVtLndyTG9uZztcbiAgICAgICAgICAgICAgZGlyRGV0YWlscy5wdXNoKGRpckRldGFpbCk7XG4gICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGl0ZW0pO1xuICAgICAgICAgICAgICB0aGF0LmZvdW5kVHJ1Y2sgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmFyIHJvdXRlTWFwVXJscyA9IFtdO1xuICAgICAgICAgIHJvdXRlTWFwVXJscyA9IHRoaXMubWFwU2VydmljZS5HZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlscyk7XG5cbiAgICAgICAgICBmb3JrSm9pbihyb3V0ZU1hcFVybHMpLnN1YnNjcmliZShyZXN1bHRzID0+IHtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPD0gcmVzdWx0cy5sZW5ndGggLSAxOyBqKyspIHtcbiAgICAgICAgICAgICAgbGV0IHJvdXRlRGF0YSA9IHJlc3VsdHNbal0gYXMgYW55O1xuICAgICAgICAgICAgICBsZXQgcm91dGVkYXRhSnNvbiA9IHJvdXRlRGF0YS5qc29uKCk7XG4gICAgICAgICAgICAgIGlmIChyb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zICE9IG51bGxcbiAgICAgICAgICAgICAgICAmJiByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxhdCA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1swXVxuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTG9uZyA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1sxXVxuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTGF0ID0gbmV4dFNvdXJjZUxhdDtcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxvbmcgPSBuZXh0U291cmNlTG9uZztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbGlzdE9mUGlucyA9IHRoYXQubWFwLmVudGl0aWVzO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RPZlBpbnMuZ2V0TGVuZ3RoKCk7IGkrKykge1xuICAgICAgICAgICAgICBjb25zdCBwdXNocGluID0gbGlzdE9mUGlucy5nZXQoaSk7XG4gICAgICAgICAgICAgIGlmIChwdXNocGluIGluc3RhbmNlb2YgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbikge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdGVjaElkID0gcHVzaHBpbi5tZXRhZGF0YS5BVFRVSUQ7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJ1Y2tDb2xvciA9IHB1c2hwaW4ubWV0YWRhdGEudHJ1Y2tDb2wudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB2YXIgY3VyckRpckRldGFpbCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgY3VyckRpckRldGFpbCA9IGRpckRldGFpbHMuZmlsdGVyKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQudGVjaElkID09PSB0ZWNoSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV4dExvY2F0aW9uO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJEaXJEZXRhaWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgbmV4dExvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTGF0LCBjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxvbmcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChuZXh0TG9jYXRpb24gIT0gbnVsbCAmJiBuZXh0TG9jYXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcGluTG9jYXRpb24gPSBsaXN0T2ZQaW5zLmdldChpKS5nZXRMb2NhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgdmFyIG5leHRDb29yZCA9IHRoYXQuQ2FsY3VsYXRlTmV4dENvb3JkKHBpbkxvY2F0aW9uLCBuZXh0TG9jYXRpb24pO1xuICAgICAgICAgICAgICAgICAgdmFyIGJlYXJpbmcgPSB0aGF0LmNhbGN1bGF0ZUJlYXJpbmcocGluTG9jYXRpb24sIG5leHRDb29yZCk7XG4gICAgICAgICAgICAgICAgICB2YXIgdHJ1Y2tVcmwgPSB0aGlzLmdldFRydWNrVXJsKHRydWNrQ29sb3IpO1xuICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKHB1c2hwaW4sIHRydWNrVXJsLCBiZWFyaW5nLCBmdW5jdGlvbiAoKSB7IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb2FkIHRoZSBzcGF0aWFsIG1hdGggbW9kdWxlXG4gICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgLy8gUmVxdWVzdCB0aGUgdXNlcidzIGxvY2F0aW9uXG5cbiAgICAgICAgICAgICAgY29uc3QgbG9jID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRoYXQuY2xpY2tlZExhdCwgdGhhdC5jbGlja2VkTG9uZyk7XG4gICAgICAgICAgICAgIC8vIENyZWF0ZSBhbiBhY2N1cmFjeSBjaXJjbGVcbiAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IE1pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoLmdldFJlZ3VsYXJQb2x5Z29uKGxvYyxcbiAgICAgICAgICAgICAgICByZCxcbiAgICAgICAgICAgICAgICAzNixcbiAgICAgICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aC5EaXN0YW5jZVVuaXRzLk1pbGVzKTtcblxuICAgICAgICAgICAgICBjb25zdCBwb2x5ID0gbmV3IE1pY3Jvc29mdC5NYXBzLlBvbHlnb24ocGF0aCk7XG4gICAgICAgICAgICAgIHRoYXQubWFwLmVudGl0aWVzLnB1c2gocG9seSk7XG4gICAgICAgICAgICAgIC8vIEFkZCBhIHB1c2hwaW4gYXQgdGhlIHVzZXIncyBsb2NhdGlvbi5cbiAgICAgICAgICAgICAgY29uc3QgcGluID0gbmV3IE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4obG9jLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGljb246ICdodHRwczovL2JpbmdtYXBzaXNkay5ibG9iLmNvcmUud2luZG93cy5uZXQvaXNka3NhbXBsZXMvZGVmYXVsdFB1c2hwaW4ucG5nJyxcbiAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDEyLCAzOSksXG4gICAgICAgICAgICAgICAgICB0aXRsZTogcmQgKyAnIG1pbGUocykgb2YgcmFkaXVzJyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICB2YXIgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICAgICAgTGF0aXR1ZGU6IGx0LFxuICAgICAgICAgICAgICAgIExvbmdpdHVkZTogbGcsXG4gICAgICAgICAgICAgICAgcmFkaXVzOiByZFxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHBpbiwgJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGF0LnJhZGlvdXNWYWx1ZSA9IHJkO1xuICAgICAgICAgICAgICAgIHRoYXQuY2xpY2tlZExhdCA9IGx0O1xuICAgICAgICAgICAgICAgIHRoYXQuY2xpY2tlZExvbmcgPSBsZztcbiAgICAgICAgICAgICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgcGluLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgICAgIHRoYXQubWFwLmVudGl0aWVzLnB1c2gocGluKTtcbiAgICAgICAgICAgICAgdGhhdC5kYXRhTGF5ZXIucHVzaChwaW4pO1xuXG4gICAgICAgICAgICAgIC8vIENlbnRlciB0aGUgbWFwIG9uIHRoZSB1c2VyJ3MgbG9jYXRpb24uXG4gICAgICAgICAgICAgIHRoYXQubWFwLnNldFZpZXcoeyBjZW50ZXI6IGxvYywgem9vbTogOCB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGxldCBmZWVkTWFuYWdlciA9IFtdO1xuXG4gICAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5tYXBTZXJ2aWNlLmdldFRydWNrRmVlZCh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLCB0aGlzLm1hbmFnZXJJZHMpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGRpckRldGFpbHMuc29tZSh4ID0+IHgudGVjaElkLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gZGF0YS50ZWNoSUQudG9Mb2NhbGVMb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBkYXRhKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIGZldGNoaW5nIHRydWNrcyBmcm9tIEthZmthIENvbnN1bWVyLiBFcnJvcnMtPiAnICsgZXJyLkVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignTm8gdHJ1Y2sgZm91bmQhJywgJ01hbmFnZXInKTtcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgZmV0Y2hpbmcgZGF0YSBmcm9tIEFQSSEnLCAnRXJyb3InKTtcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICB9XG5cbiAgZ2V0VHJ1Y2tVcmwoY29sb3IpIHtcbiAgICBsZXQgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUhrbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUm1NMlZpTVdRdE5HSmxaQzFqTmpRMExUZ3pZbVV0WWpRNVlqWmxORGxtWW1SbUlpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdFeE5UQmxZVEV0TWpKaFl5MDNPVFE1TFRoaU5tRXRaV1UxTVRjNFpUQm1NV0ZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T21Zd1pXUXhaV00zTFRNMU9UQXRaR0UwWWkwNU1XSXdMVFl3T1RRMlpqRmhOV1E1WXp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkyUEM5eVpHWTZiR2srSUR3dmNtUm1Pa0poWno0Z1BDOXdhRzkwYjNOb2IzQTZSRzlqZFcxbGJuUkJibU5sYzNSdmNuTStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTBWREU1T2pBNE9qQXpMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzFaRFEyTURjMVppMDRNbVJtTFdZM05EQXRZbVUzWlMxbU4ySTBNemxtWWpjeU16RWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRWVU1UazZNak02TXpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21Ga1pqTmxZakZrTFRSaVpXUXRZelkwTkMwNE0ySmxMV0kwT1dJMlpUUTVabUprWmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhPVlF4TlRvME9Ub3dNUzB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NGRiN3ZqQUFBQ2UwbEVRVlJJeDkyV1RXdFRRUlNHbnpOemIzTFR0S0cxV2xId3E0dUNiWVgrQTEyNUVMY3V1aWhDUlhDcDJIM0JoU3YvZ1V2QmdsSnc0VUxCaWdwU2FVRmNpRkxGalNBdHNYNjFTZE0wdlhOYzlOb2tSWk9ZQVJYbk1xdTV6RFBublBlOE00R3E4cWRId0Y4WS94NzA2ck9KbnBUSXRhZGY3bysrTHkrVnJaaGtSWkw1WXpqRXhPbjFGNW1wc1VQbmJreU1UVDVxR3pwWG1SbFpMdWJIUDdLRTdVcG4ySzYvMURGVndXU2htRnNkZi9oMlpueUNTV2svdmZlNmU3NE52U2F6SjBmc0t2VnJkZm9Uekthd1hpb3lOLys4NUZmVEo3dW4zS2Njd2RraUZCc2RYb2xUSUhtRHpIYjUxYlRuY0E0WE9HSVJORlNrUVhkWm82ZzFaTG9qNndXTkJtUTA3TlZwOGluc2hpQU5ndFhWTW1GWHlJR2gvYWU4b0ErQzIvbkFXQXAzaE9CRDlNdS9OUWE2SGRualpZYlA5SjhHWnRxR0hoemMyMUZJclJIczJ5QW94dzFQTDFsRmcwMEcwa2N1QXBmYWhpNi9MTnpxN092bDVQbWpsSXRyYUNKWlFSQ3Q1bHBGeVVScDVtOHVNUDE1cW5UNXhKWDIwMXV1YktTemJxczdKSFkxWVNuVVFCRkZqUUVNWDlkV1BHMVFRbFVVUjR5cXJmcUIxcmVwS0RoaW5DaEk2QWZWUks2U2ZQVjI4SE92c0JnL3FCTkZoR1NieGxlZ2s2UU16dmVXVVdvTVFacnZKbXlMclcyb1FaQVl6Ry9jODk1UUVXa3B3QzB4bWVUQ2M1N3BSVnRsWXRRZ0N0WVhLaUswL29SeWlGSEVlQW9wZHE3RzVMVnBOYXZUSjFMVm1wcEtNK0hpV3RONFkyaGFMSW9tS2RZbVFrcjYyaGVxQXNZSzFnaGhGTzRBUzEzYUF3dGlEV3g2UW91MlpES2xISXR2VnFsVTFsSFZxaUZxblNNUWhTR3VaTkNPNWxKcUNCM2NkV3hsNGQycnp0bnJpeGhyY0FsMFp6cFVoVmdkVWRUSmNQOUl3UXQ2OThManZ2L21oZjhkdEdIbGg0djVSMUlBQUFBQVNVVk9SSzVDWUlJPSc7XG5cbiAgICBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAnZ3JlZW4nKSB7XG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSGttbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TkRrNk1ERXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TkRrNk1ERXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdSbU0yVmlNV1F0TkdKbFpDMWpOalEwTFRnelltVXRZalE1WWpabE5EbG1ZbVJtSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaR0V4TlRCbFlURXRNakpoWXkwM09UUTVMVGhpTm1FdFpXVTFNVGM0WlRCbU1XRmtJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPbVl3WldReFpXTTNMVE0xT1RBdFpHRTBZaTA1TVdJd0xUWXdPVFEyWmpGaE5XUTVZend2Y21SbU9teHBQaUE4Y21SbU9teHBQbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJQQzl5WkdZNmJHaytJRHd2Y21SbU9rSmhaejRnUEM5d2FHOTBiM05vYjNBNlJHOWpkVzFsYm5SQmJtTmxjM1J2Y25NK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMFZERTVPakE0T2pBekxUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvMVpEUTJNRGMxWmkwNE1tUm1MV1kzTkRBdFltVTNaUzFtTjJJME16bG1ZamN5TXpFaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVFZVTVRrNk1qTTZNekV0TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPbUZrWmpObFlqRmtMVFJpWldRdFl6WTBOQzA0TTJKbExXSTBPV0kyWlRRNVptSmtaaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE9WUXhOVG8wT1Rvd01TMHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOEwzSmtaanBUWlhFK0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0lEd3ZjbVJtT2xKRVJqNGdQQzk0T25odGNHMWxkR0UrSUR3L2VIQmhZMnRsZENCbGJtUTlJbklpUHo0ZGI3dmpBQUFDZTBsRVFWUkl4OTJXVFd0VFFSU0duek56YjNMVHRLRzFXbEh3cTR1Q2JZWCtBMTI1RUxjdXVpaENSWENwMkgzQmhTdi9nVXZCZ2xKdzRVTEJpZ3BTYVVGY2lGTEZqU0F0c1g2MVNkTTB2WE5jOU5va1JaT1lBUlhuTXF1NXpEUG5uUGU4TTRHcThxZEh3RjhZL3g3MDZyT0pucFRJdGFkZjdvKytMeStWclpoa1JaTDVZempFeE9uMUY1bXBzVVBuYmt5TVRUNXFHenBYbVJsWkx1YkhQN0tFN1VwbjJLNi8xREZWd1dTaG1Gc2RmL2gyWm55Q1NXay92ZmU2ZTc0TnZTYXpKMGZzS3ZWcmRmb1R6S2F3WGlveU4vKzg1RmZUSjd1bjNLY2N3ZGtpRkJzZFhvbFRJSG1EekhiNTFiVG5jQTRYT0dJUk5GU2tRWGRabzZnMVpMb2o2d1dOQm1RMDdOVnA4aW5zaGlBTmd0WFZNbUZYeUlHaC9hZThvQStDMi9uQVdBcDNoT0JEOU11L05RYTZIZG5qWlliUDlKOEdadHFHSGh6YzIxRklyUkhzMnlBb3h3MVBMMWxGZzAwRzBrY3VBcGZhaGk2L0xOenE3T3ZsNVBtamxJdHJhQ0paUVJDdDVscEZ5VVJwNW04dU1QMTVxblQ1eEpYMjAxdXViS1N6YnFzN0pIWTFZU25VUUJGRmpRRU1YOWRXUEcxUVFsVVVSNHlxcmZxQjFyZXBLRGhpbkNoSTZBZlZSSzZTZlBWMjhIT3ZzQmcvcUJORmhHU2J4bGVnazZRTXp2ZVdVV29NUVpydkpteUxyVzJvUVpBWXpHL2M4OTVRRVdrcHdDMHhtZVRDYzU3cFJWdGxZdFFnQ3RZWEtpSzAvb1J5aUZIRWVBb3BkcTdHNUxWcE5hdlRKMUxWbXBwS00rSGlXdE40WTJoYUxJb21LZFltUWtyNjJoZXFBc1lLMWdoaEZPNEFTMTNhQXd0aURXeDZRb3UyWkRLbEhJdHZWcWxVMWxIVnFpRnFuU01RaFNHdVpOQ081bEpxQ0IzY2RXeGw0ZDJyenRucml4aHJjQWwwWnpwVWhWZ2RVZFRKY1A5SXdRdDY5OExqdnYvbWhmOGR0R0hsaDR2NVIxSUFBQUFBU1VWT1JLNUNZSUk9JztcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ3JlZCcpIHtcbiAgICAgIHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFIM21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZOVEk2TWpFdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZOVEk2TWpFdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZNRFZqTXpjMVpEWXRNV05sT0Mxa1pqUmxMVGd3WWpndE1qbG1ZVFJoWmpBMlpERTNJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpHUm1NR0l6WW1FdE1XTmlaQzFoTWpRMExXRXlaV010TVRnNFlUbGtPR1JsTWprMElpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09qQXdNREpsTkRobExUaG1PV1V0TmpVMFl5MDVZalEyTFRWbVlXWmtNVEJoTjJFMk56d3ZjbVJtT214cFBpQThjbVJtT214cFBtRmtiMkpsT21SdlkybGtPbkJvYjNSdmMyaHZjRHBtTUdWa01XVmpOeTB6TlRrd0xXUmhOR0l0T1RGaU1DMDJNRGswTm1ZeFlUVmtPV004TDNKa1pqcHNhVDRnUEhKa1pqcHNhVDU0YlhBdVpHbGtPamc0WkRNMU5tRTNMVGN4T0RFdFpUVTBZUzA1T1dabExUUTRNR1V6TldGak5qWm1Oand2Y21SbU9teHBQaUE4TDNKa1pqcENZV2MrSUR3dmNHaHZkRzl6YUc5d09rUnZZM1Z0Wlc1MFFXNWpaWE4wYjNKelBpQThlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BISmtaanBUWlhFK0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0pqY21WaGRHVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPamc0WkRNMU5tRTNMVGN4T0RFdFpUVTBZUzA1T1dabExUUTRNR1V6TldGak5qWm1OaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0l2UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGljMkYyWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk5XUTBOakEzTldZdE9ESmtaaTFtTnpRd0xXSmxOMlV0WmpkaU5ETTVabUkzTWpNeElpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEUxVkRFNU9qSXpPak14TFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQnpkRVYyZERwamFHRnVaMlZrUFNJdklpOCtJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKellYWmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG93TldNek56VmtOaTB4WTJVNExXUm1OR1V0T0RCaU9DMHlPV1poTkdGbU1EWmtNVGNpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRJNk1qRXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpSUhOMFJYWjBPbU5vWVc1blpXUTlJaThpTHo0Z1BDOXlaR1k2VTJWeFBpQThMM2h0Y0UxTk9raHBjM1J2Y25rK0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBpQThMM0prWmpwU1JFWStJRHd2ZURwNGJYQnRaWFJoUGlBOFAzaHdZV05yWlhRZ1pXNWtQU0p5SWo4KzdTZEF3QUFBQXNwSlJFRlVTTWZsbDd0ckZGRVl4WC9mblpsZE53bUpHa0tJQ0Q0aUlXS2xJb3FyVmo0NlFWQnNmWUQ0SDJoaGJaQVUyb2lJblZxSVdHaGxJNmdnQmxGOEJOOGhLb2hFb2hJMWJqYjd1UGV6Mk5IZFRkelpaU2RvNFF6ZmJlWU81NTd2bkh2dWpLZ3FmL3N5L0lQTGozcjQ5TTQ5aHNkdUpWb0dMNjdvSENkaEErTm16aEdVYkNFbkQ3Y3VuOWpUdWZyRDJMSmV1K1h3d2VaQmI1NDhzWGpEWk83MHNseHlYYjdEcFVRb2E2RmxXT2M4V2Y5b1luU3M5KzBGK2xhZUE2YWFCdjEwZTJqTkY1dmR1YTUvSmRiT0lGbGhCVFdLMWZ6YTl1ZkRpd3JiZG53QkxqYXQ2UnZENEkrV2RuQ0dndFBxMG5MWklrQ0NKMHJQbFljUHpzY3kwdDFQSC91KytVYnIyazBzU1R5ZUdjUEExY3U1V0tDWnJ1NHo4N0hUb014VGFsWlNCYVJJZDZEajI5S2Jqc1p5Nzc3K3ZsUDI1WXRETndJZkRZSXFJYVhDU0VZTU1NMlNuTEc3M28xZml3VzZ1NmQ3Ny93SDk0dlhYdzU3V1pFS0lKQUtQM25PcDhQbFNVOTg3MXAxNW13aUZ1anprZEg5L1IyZHlTMlpIM2dKbnorbGx3QU9oL29wSmx1VXp5T3ZEblJCWklzbEtnYVB0YlhtdDJjTHdkTE5hZXpDQmVEY3JDMVRZbXdobVVKZWozRHB5V09PcUVyVFRDV1RMYlo2eWFETkdKeFVDVm5GVk1WZzhGRHhTRUEyVm5zeEJzVmd3NkpHVjR4MXFIR0lrL2paNndBbkpZS2kxU2xVRlU0Q2lJQ1Uzb25IRkZCVlNuZlpzYk5CRlJWRmFPeVlqQXdIVDhGWkMxb2JNTnlwZ0dDZGEraXM5T3V2U0ZBMEhEVktpSERlWExUM041QkVOTmdBalptb0lWQUpoMSs2MVdKYTh0SWN1TmNUclVSRk5JS3BDSWpNamFZRlZTd09FOEhVZDRwVHhUYjRrVmUzdlFnSUljdW9kRk5wV05Yb0dKUXdENHdCejlSTUI2Y09NVkphWEZ6UWhBcXRudUJsTTVoSkg3VVdDZHMreTlNSmh5a1dDQm93VXlSb3psbnZ2Yk9NRGcxVmdaaHdaOG9NN2dId0dieFlvT21CNDE5Tk1kK0d5eFVVNTdRaUNpcFB1RklKQnQ5c0RGSlRkVzN5My94Vy9BUk5wanZ4bDgwdUxBQUFBQUJKUlU1RXJrSmdnZz09JztcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ3llbGxvdycpIHtcbiAgICAgIHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFJS21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZOVGc2TlRVdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZOVGc2TlRVdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1E0TWpGa1pqTXRabUZsTkMweE1qUXpMVGxqWlRVdFptRmtOMkUyTVRkbU5UVTNJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpqVXdOMkl4WW1NdE5EQmtaUzB3WkRReUxXSXdaVGN0TUdVNE5qTm1OelZrTmpBMElpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09qQXdNREpsTkRobExUaG1PV1V0TmpVMFl5MDVZalEyTFRWbVlXWmtNVEJoTjJFMk56d3ZjbVJtT214cFBpQThjbVJtT214cFBtRmtiMkpsT21SdlkybGtPbkJvYjNSdmMyaHZjRG80TXpjeFkyVTJZUzB4WVdaa0xURTBORE10T1RneFpDMWtOMkU0TkdZMU5tVTBaV1U4TDNKa1pqcHNhVDRnUEhKa1pqcHNhVDVoWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpqQmxaREZsWXpjdE16VTVNQzFrWVRSaUxUa3hZakF0TmpBNU5EWm1NV0UxWkRsalBDOXlaR1k2YkdrK0lEeHlaR1k2YkdrK2VHMXdMbVJwWkRvNE9HUXpOVFpoTnkwM01UZ3hMV1UxTkdFdE9UbG1aUzAwT0RCbE16VmhZelkyWmpZOEwzSmtaanBzYVQ0Z1BDOXlaR1k2UW1GblBpQThMM0JvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNE9HUXpOVFpoTnkwM01UZ3hMV1UxTkdFdE9UbG1aUzAwT0RCbE16VmhZelkyWmpZaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVFJVTVRrNk1EZzZNRE10TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPalZrTkRZd056Vm1MVGd5WkdZdFpqYzBNQzFpWlRkbExXWTNZalF6T1daaU56SXpNU0lnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE5WUXhPVG95TXpvek1TMHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGljMkYyWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUTRNakZrWmpNdFptRmxOQzB4TWpRekxUbGpaVFV0Wm1Ga04yRTJNVGRtTlRVM0lpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEU1VkRFMU9qVTRPalUxTFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQnpkRVYyZERwamFHRnVaMlZrUFNJdklpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QbmV3WTZVQUFBSkVTVVJCVkVqSDNWWXhheFJSRVA2KzkvYXl1ZFVJa1NObkNBb1JsWWlJV2dtQ2hSRHNSVXRiQzMrQWxzSFd3bFliaTFocFl4RUVtMWlwTVJCUkVVUThnbzJTSENraTNsMjQzTjd1elZna0puZkh1YnU1RnhKdzRMSEZ6czQzODMzelpvZXFpcjAyZzMyd2ZRSDFrbDVXVm4rVnYzeTRGeHc3OGt3T0RSMkV5SVlVMmlQMTlWRHdjK1dpR1Q5MXYxNGNIUjlOaXNza1RhY2ZYR3Rjblh6ckYwWitJd3paOWxVM3RDREllNWg5MWNTYVhBcHYzSndiN0p2ZVQ1OC95dEp5RGFvV2JEOWlRZkcyRHRTRFVoREZGcVZ2SlhIU2RIcEdNTDlBK0VGeUVBVmhTVVR4QUI0L3lidHAybEJCc3dYQUV0WnFPN2RkbVN0b0ZiUkFMUXJkUUdkbkhxSlZ2WTFxdFFMR0J2OVNuMURVUW9WcUExTjNiNldDTW0wNHZINlIxN21GWVFnRFdMdE5hRWVsYW1BTmNPNU1HWlBYMStnRSt2VFJVVzIyaGxBNC9BTnhSTkQydkRDZ0tPd0FNSEZDOGZ6bDJQcWRxY1dnYjNwUG42eGh0VDZPa1dJUktnclZucEtDQ25nKzhXWitCV09GaXB1bVVXd1FSekhPbmo4T1NNcU16Zytndk5SQzRjQ3lHK2dXaytzUjRwWWt1dVVJeEZHTU1EU09vR3g3TXNXUHV6Ujd0NnROaWFvOUV1MFhWRHZtcktZem9ydFVxVEpqcFp1ZHJhNmdaSGZVaEVMMWI0S3U5SExubmNJTWJvbjliVlJCRUR2Wm85UVZGSnF0UHQwY1N3UmhNaVRvcFhGRkFwcWxlOWxqb2VpdmU2Vk5vL1R1SmJPSm1naHFRZmkrQjJUVWRBTlBISytNV3YyKzJPVGxLeDZNbUVSR01KaUQ3M3V3b0hFQ0hTNzZLOFY2SVhqL0xoSVZkdnpLdWkzbkE2V3ZEWE5od3RhZE40Zi9ac1AvQXd6dDVSM2JzUTJqQUFBQUFFbEZUa1N1UW1DQyc7XG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICdwdXJwbGUnKSB7XG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSDNtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURNdE1ESlVNVEk2TWpBNk16TXRNRFU2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURNdE1ESlVNVEk2TWpBNk16TXRNRFU2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WWpWbVltVTNZall0WkdRMU9DMWpOelJpTFRobVpHWXRZakprTmpVMU5UWTNPVEUwSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaakF4Tm1abU5qY3RZV1l4WkMwMk1UUTVMVGd6TWpRdFpETTBPR1kxTnpnMFpUazBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPakF3TURKbE5EaGxMVGhtT1dVdE5qVTBZeTA1WWpRMkxUVm1ZV1prTVRCaE4yRTJOend2Y21SbU9teHBQaUE4Y21SbU9teHBQbUZrYjJKbE9tUnZZMmxrT25Cb2IzUnZjMmh2Y0RwbU1HVmtNV1ZqTnkwek5Ua3dMV1JoTkdJdE9URmlNQzAyTURrME5tWXhZVFZrT1dNOEwzSmtaanBzYVQ0Z1BISmtaanBzYVQ1NGJYQXVaR2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmp3dmNtUm1PbXhwUGlBOEwzSmtaanBDWVdjK0lEd3ZjR2h2ZEc5emFHOXdPa1J2WTNWdFpXNTBRVzVqWlhOMGIzSnpQaUE4ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQSEprWmpwVFpYRStJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKamNtVmhkR1ZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZOV1EwTmpBM05XWXRPREprWmkxbU56UXdMV0psTjJVdFpqZGlORE01Wm1JM01qTXhJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMVZERTVPakl6T2pNeExUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwaU5XWmlaVGRpTmkxa1pEVTRMV00zTkdJdE9HWmtaaTFpTW1RMk5UVTFOamM1TVRRaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCszNDEzandBQUF1cEpSRUZVU01mbGw4OXZWRlVVeHovbjN2dW0wNExsVjhEd2ExR1JOb1M0d0tZUTQwcHdSUWc3b3dsdWNDRWJOcXp3RDJDSEN6ZktRbGVXeEJCV0pwQzRRellFUThMQ0tLTFNBRldVU0pCU3kwdzc3OTV6WEx3cG5hWXowenF2MFlWbmNpZVpuSnYzdmVmNy9aNXozNGlaOFcrSDR6K0kwQzE1Y2Z3U0QyOWVxZVFYWG5tNU5yMnBJbG5TcGFjV0dyRXV6L1plZVRLNjY5aURxYUhmMG9rejcvUU9ldU96bXp1R3B0NzhlR3NhR3RPMWpYNG44bHdMYThJcm9FR2xPams2TVpNOUdHZllQZ1ZxUFlOT1huLzY2dnJHMDZON2RtNGcxN1FvWnkzQ1pBTEVOQnB2cmQ4bWI4dzhCczczck9tanl2MnpzLzAxb2dsUjQ2S1ZiR0hWVTZJUllDSjh2L1hxajE5OVhzcEkzODE4TTF3UDA5YkNhdHVvQUk0KzdsZHVjLzdyVCtaS2djYU45WE12NkxwWkFUS3JkbHllUGpLQkY5UG1QMTdiOS9vSHBkeDdlTWRiSDZWYjZmMXZCNjZpWWtoTFRxejRaWUFpVktPd3FiWXo3ZjM1NkplbFFBOE9Ibms3ajJ2aUR6OWQ4MUhtV0F5N0VMbDNET2FEYkdmMzVpT25EMVpLZ2Q3NVplTDRsakRTOTFJY28ySjlHTnBtbDRBcWlQQ1hUVE01ZWZjOUdPMUtzWFFiZysvS3FjWUlZOW5JOEFpeUlTKzRuRytaSnIyQzRCV3MzOGp2QkM0Ly9JSngrMUI2cm5TV3VaZ3hrUFhMR3B4RlJLVk5uWUtKb1NxSWVRSlp2UlM5Z2tNeG9pU2NKS1REK1UwZG1pQ1pLejk3RlMxME5Dbm83S0NFaUlFQW9taGIzWHU2WlF5anMvYk9ESEVHck95YVhBWlVpT1NZRmRwMVpNUVZ1YVFKdDRJNlhQZWt3NXAxZHJPajErSkl4YmlVMWFEWFdyN2JSM0xHUDNuL0NNdHRFQVFSOEFMV1lmQTdCV3Z1S3cyYUVmQk5NcEl0ek5zbGxRb0ZvSFRYZm9WOVdoZ0p0R3Vsb2dHMWhKcXVEcjIrc0FqSnJHT2xVSXpmVmRIVU5ha1NaN2dBRmp0NUxlRzl6RHVnTEdoR2xRR2s3cEVna09ZZjYxcjhMSWdKV29Hc1lRU3ljcUFOWnYwamZ1WDNlM2VmVHlScGZ0bzFpU2N3elorK0ZPaWhrd2VtZk1PdkRYUGtUazNuZ1ZSMFNTK3JHQ21JRzY3dXJ5M2JoditidnhWL0E4c1ZRQWc4K2dEWUFBQUFBRWxGVGtTdVFtQ0MnO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVja1VybDtcbiAgfVxuXG4gIGNvbnZlcnRNaWxlc1RvRmVldChtaWxlcykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1pbGVzICogNTI4MCk7XG4gIH1cblxuICBwdXNoTmV3VHJ1Y2sobWFwcywgdHJ1Y2tJdGVtKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGN1cnJlbnRPYmplY3QgPSB0aGlzO1xuICAgIHZhciBwaW5Mb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0cnVja0l0ZW0ubGF0LCB0cnVja0l0ZW0ubG9uZyk7XG4gICAgdmFyIGRlc3RMb2MgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odHJ1Y2tJdGVtLndyTGF0LCB0cnVja0l0ZW0ud3JMb25nKTtcbiAgICB2YXIgaWNvblVybDtcbiAgICB2YXIgaW5mb0JveFRydWNrVXJsO1xuICAgIHZhciBOZXdQaW47XG4gICAgdmFyIGpvYklkVXJsID0gJyc7XG5cbiAgICB2YXIgdHJ1Y2tDb2xvciA9IHRydWNrSXRlbS50cnVja0NvbC50b0xvd2VyQ2FzZSgpO1xuICAgIGljb25VcmwgPSB0aGlzLmdldEljb25VcmwodHJ1Y2tDb2xvciwgdHJ1Y2tJdGVtLmxhdCwgdHJ1Y2tJdGVtLmxvbmcsIHRydWNrSXRlbS53ckxhdCwgdHJ1Y2tJdGVtLndyTG9uZyk7XG5cbiAgICBpZiAodHJ1Y2tDb2xvciA9PSAnZ3JlZW4nKSB7XG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUZHbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdOUzB3TVZReE5qb3hNVG94TUMwd05Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1qQXRNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TWpBdE1EUTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVGRrWmpFMFltUXROREJoT0MwMU5EUmpMVGt6T1RBdE0yUmlObVprWVRabU1tSmxJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNk1HRmtNMkl5WkRJdE9EQmhOaTB4TURSa0xUaGlOelF0WmpWaFpERm1NVGhsWXpFeUlpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9UZGtaakUwWW1RdE5EQmhPQzAxTkRSakxUa3pPVEF0TTJSaU5tWmtZVFptTW1KbElqNGdQSGh0Y0UxTk9raHBjM1J2Y25rK0lEeHlaR1k2VTJWeFBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpWTNKbFlYUmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG81TjJSbU1UUmlaQzAwTUdFNExUVTBOR010T1RNNU1DMHpaR0kyWm1SaE5tWXlZbVVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGd0TURVdE1ERlVNVFk2TVRFNk1UQXRNRFE2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpTHo0Z1BDOXlaR1k2VTJWeFBpQThMM2h0Y0UxTk9raHBjM1J2Y25rK0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBpQThMM0prWmpwU1JFWStJRHd2ZURwNGJYQnRaWFJoUGlBOFAzaHdZV05yWlhRZ1pXNWtQU0p5SWo4K09kdUszUUFBQXc5SlJFRlVhTjd0bWoxUEcwRVFodThudUtlaERKMHJsTkpTSkdwSHBDV3lsRFlGNmFBQlY2UWlRUUtsU1JSTUZTVUZwcU5CbUFvRUJhUWdwRFRpUTVRR21wU2JlOUZ0TkJuMnpudDNPOGQ5ZUtTUmJUanR2dmZjN3N6YzducWVrQ21sMnFyWWR1SjdUUXBPUS9keS8rZGVmVG5ZVU11OXRkdzdkRUl2c2E0VW9DM2R3OVNubDJwczRWbGhISHFwSlFWUTkvMmo3ejNmQjJGajlOZk43MExCMFg3UVAwb0dLQURUczUzRTZLZ3lnUHhyRnprQXpGYzBSaDJqcG5LQS9PdlcrY2g0OCsydHNmRlg2NityQllqRFdkeCtIOWw0cFFCeE9PKzY4ME1icnd5Z0pIQXFBeWdwbkVvQVNnT245SURTd2lrMUlQLzdTbG80cFFYa2Z6WmR3Q2t6b0w0TE9LVUVSRWZQajVOdTZzYkxDS2lqZnp6LzhHSUV5QUFJSzJmcWNuRHRwUEV5QW5KNk15TkFReHpUbEpxTGFadWxUeXhOcWp1eTdPcEpQRzI2Sm5ReHVGS3ptM05xK3V0TTdoMDZvZmUvSlZjSlFIU2FGZHhtUGFsNGdYcUs3UkFVemJaMGtTZ1dVREdmc2NDRytvb3Z6ZWJSbWJYRkFSWE5SNEN5QklUcG95TS9Qdk8wUVlqU2dtcXpMVFdjQUVKbjM0ODNqVkVOS1hKNWQvWEp3R0NuNVpTVUdOVDIrNGNQMlZVVUVETFRuVVZtZ2tpTXNDemhoRDAwYnAvM04yUUE0ZW53YldWa0tEd1ZPTi80enhJU2g0TjcwZHFnRzFtVWFzUDFUZ0h4OGp0c2J3elgwU3JheGZLSnphaTJXZXhEYUtEYVROUHRVWkZvQ3doSFEydzNEZ0VKS3dOWnZZdlJWNE00Mms3WndRcEQ5ZC9RZ1BhRzNZd1dZYnNrUXFmak1OR3VqcXJZYXFNamp0NHZRZ1N6Y1Eyb3BmK3lmYmJ6S0c3Z3R6WTBFcmVta0t5djZNaTIxVWJ2UjU4djRHZUNNR2o0ZHM5UC9SL0VHa1I2cEdzNERZQVFaQ3RleHl5ZCtpVWNxVHVKTnByNlE3SmZuUU9xVVVoaGxtUUVaV1ZKQUlWWUsyeTd1Ulljdkx5TnFtL3l1dHhocTQyWEsvVHQvVjlndGp5RVNiMFRaMXVJRHYwZ0NUUUV2UjJWdXJtelN2czhhS09XOWxEbU9JMVJVVUlNYzdydUNWdHdvdy9hb3Q0SkRkcGFZdWVlMFJsZUJKRVZJTXEwWE9sVVFMUzJaZ0p0SFFraEt6SENRdHZMMEdpNVltRWQ2YWQxSHRINW5uV3djNit0VGd0ZmcwRjNNMDZiZndHNFR2OFh5K2hQYUFBQUFBQkpSVTVFcmtKZ2dnPT0nO1xuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAncmVkJykge1xuICAgICAgaW5mb0JveFRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRWdBQUFBckNBWUFBQURiamM2ekFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFGRW1sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TlMwd01WUXhOam94TVRveU1TMHdORG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TWpNdE1EUTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TWpNdE1EUTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZaakExWTJWbU5EY3RNMk5qWWkwM1lqUTJMV0kxWmpRdE4ySTVNREF3TWpnMU1qbGxJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0o0YlhBdVpHbGtPbVl3TldObFpqUTNMVE5qWTJJdE4ySTBOaTFpTldZMExUZGlPVEF3TURJNE5USTVaU0lnZUcxd1RVMDZUM0pwWjJsdVlXeEViMk4xYldWdWRFbEVQU0o0YlhBdVpHbGtPbVl3TldObFpqUTNMVE5qWTJJdE4ySTBOaTFpTldZMExUZGlPVEF3TURJNE5USTVaU0krSUR4NGJYQk5UVHBJYVhOMGIzSjVQaUE4Y21SbU9sTmxjVDRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUltTnlaV0YwWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNlpqQTFZMlZtTkRjdE0yTmpZaTAzWWpRMkxXSTFaalF0TjJJNU1EQXdNamcxTWpsbElpQnpkRVYyZERwM2FHVnVQU0l5TURFNExUQTFMVEF4VkRFMk9qRXhPakl4TFRBME9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QcEtwY0tjQUFBTDRTVVJCVkdqZTdack5Tak14RklibkV1WVN1bmJWblZzMzdzVWJjRzVBNk5adW5LVTdYZWphNmcyMEYxQ3c2MjRVUVN3SS9rQkZFSXBGUVJDRW1MYzBjbnFjVERNenlUZy9QWEErOVdOSTNqeEpUazUrUE0rQkNTRkNVVzY3bE81N2p1QnNxRnErMzkvRjYvbTVlRGs1S2J4REovUVM2N29DMUZNMWpMYTN4ZVhhV21rY2VwazEwZ0JvU2orVWZpSDlUVGRHUDBlalVzRlIvakVjMG1hRVNjRmNtRTVpVkZRYlFQTERmUTRBOHhXRlVjZW9xUjBnK2RFcEh4bjN1N3VSaGQ4RlFiMEFjVGpqZzRQWXdtc0ZpTU41YXJlWEZsNGJRR25nMUFaUVdqaTFBSlFGVHVVQlpZVlRhVUR5bDZPc2NDb0xTUDZ6WlFOT2xRRTkySUJUWlVBem0vUjZtUXV2TktDYnpjMFZJQjJncitkbks0VlhGcEN0eHF3QUxYRk1VMm8ycG0yZWZyMit6bzlkVzU3dDNxWm5RbC9qc1hqYTJ4TjNPenVGZCtpRVhtYStkVUIwbXBYY1dpcUx0aDR2a0UreG9WbzI2OUU5bUpPQWl2bU1BemJrVi94b3Rvak9MSFFPcUd5K0FwUW5JRXdmRmZueHMwZ1hoRWd0cURiVFZNTUtJRlEyNlhZam94cVd5SmZqNDM4RGc1dVd6OXRiN1IwZFZsZW5nRXhYSm9qRUNNc1RqcTdUdUwyZW5ia0JoTjdoMThwWW9kQXJjSDd4bnlja0RnZHRVZHFnRzZzbzFZYnZyUUxpNmJmdWJnemYwU3pheHZHSnlhZzJPZXhEYUtEYW9xWmJaSkpvQWdoUFEwd3ZEZ0VKSndONTdjWG8xaUNKTm96d0pkbi94Z0tndU1Zb0VhWkhJblE2TGhOdDY2bUtxVFk2NG1oN0VTSzB6MTdVLzB6Ny9UOXhBMy8vQmpoWlNOS2N3bVYrUlVlMnFUYmFIdlcrSU9KTjBJRGZoVjB0dkFpVGtSN0xOWndHUUFneUZhOWlsbHI2WFRqZEhpVFJSanRQcy9vMU9TQ2ZRdEl1a1NsR1VGNldCcERHQXQxZHZEOS9lRG1OeTIrS2V0eGhxbzJuSzNUM3ZoQ1lEUjVoVXU4a3VSWmlPK05CUkhrMlBZeGJ1djhjNWkxbTJvL3pNdnlzanpJYk5FYkZDWW1ZMDAzUHNjMGJPdE1XdHllTTBCWTRlL2VNeXJBUnhLb0FVWnJqeXNETHdmak5zS0cyamdzaFJ3bkNRdWpsYU9pTUJObzZybnZyTWFieWdYR3dzNit0T2E5Zlo5QzlsYlRjSHhIQnhCN0o2ZVRWQUFBQUFFbEZUa1N1UW1DQyc7XG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICd5ZWxsb3cnKSB7XG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFzQ0FZQUFBREdpUDRMQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUZFbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdOUzB3TVZReE5qb3hNVG93Tmkwd05Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNVGt0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNVGt0TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9UQXlOREU0WTJFdE5UTXpOQzA0TmpSakxXRmhObUV0WVRKbE5EazJZbVUxWW1FNElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09qa3dNalF4T0dOaExUVXpNelF0T0RZMFl5MWhZVFpoTFdFeVpUUTVObUpsTldKaE9DSWdlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09qa3dNalF4T0dOaExUVXpNelF0T0RZMFl5MWhZVFpoTFdFeVpUUTVObUpsTldKaE9DSStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RBeU5ERTRZMkV0TlRNek5DMDROalJqTFdGaE5tRXRZVEpsTkRrMlltVTFZbUU0SWlCemRFVjJkRHAzYUdWdVBTSXlNREU0TFRBMUxUQXhWREUyT2pFeE9qQTJMVEEwT2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BuS2JJNVlBQUFNSlNVUkJWR2plN1pxOVNzUkFFSUR2RVN4OEFNRVhPSHdCN3duVUo1QjdBQVY3QzYvVlJrdXR2TTVTUVFRYk9RVzFzZkJBTFN6ODRSb2J3YlBRUXN5dE0yczJUamFiWlBPemEzNXVZRkJRc3BNdnN6T3pzOU5vV0JERzJBVG9iQW0wMmJBcHNPQUM2Qk1ybDd5QnJ1RkhOUTJudzhvdDE4WWd3WU5iM2pKZjc4eDUzR0hPL1VieEZleEVlNG5zbXdKMElGWnd6bHJzKzNDeU5JcjJVa2tMb0FtNkNkcHo5NnhTUnUrM3BZSWpkUFI2a1E2UUM2YW51NGx4b2RvQWNpTzdYMkMvNHNOOENsNVRPMER3Zjd1eVp6aFhpK285ZkRsZkwwQUJPSGVyMFVHdVRvQUNjUHJMOFZtZ0xvRFN3S2tOb0xSd2FnRW9DNXpLQThvS3A5S0E0UGV0ckhBcUM4aHRTMlNHVTJWQVQzbkFxU1FnNmoyandWNzIwM0FGQVhXOTFzVEp6QmlRQXRBMS8rMXprRTgvcFlLQWNuMlpNYUE0UUxCTnFlU3hiYTNxOFRSalgwTnpnUGdYSUQwaDlqRmdUbjhKUEd1dStBcDJvcjIrbHFzSlFIU2JsVnhXR3FiaUJkWlQwZzFCMmVSQUZJbm1BaXJzWjJ5d1lYMFZhTTBXVUNYcG1BZFVNaDBEc2dvSXRvK0kvUHhuZ1M0SXNiVHcyYVpaYXVRQ0NCZkRtS0lVU0pHaisvWC9BM08xQ0NYR1RjZ2QzVG5QcmtZQi9XYW1ZZnlGSVJpSkhtYTErZzM3YUpJNEQ5dG1BT0hYa2ErVk1VUGhWK0VxWGZ6YmhDVEQ0VmxKMklaZWhYK250b1YwTGRJRGtzcnYwTHN4VE92MFpqV0g5b21XVjJzMCszaG9JTGFwdGx1Z1NOUUZoS01odWhlSEhPYm53TnBaakI0Tmt0akdQVHk2K204SlFLZHhMK01ab2RrU29kc3gxdWk4UmxVMGJhTWVSOStYaHdpL1RBbEFiZTlsWG82Q2NRT3Bpd2ZDUTVMV0ZDYnJLK3JaMnJiUjkzSG5DK1NaSUhRYSticW4vemV4TWVTUkh0TTFWeElBMFNCdFFDSm11YW5maUVMcVRtVWJTZjBoMmErcG1rTHR4NmJJRkI1a1M5SUFDcEYyMUtndURsNE9JK3ViZ3JZN3RHMlR5aFY2ZXZjQ3MrWVFKdFZ1a21zaDZ2cHVFbWdaMUU1VTZnNDI4M3lWOXJQN2pJbXNRNWxUdmhnVllZaGlUemN0ekdNL2U3WkZuQWtWdHJXTnpUM2pZbmdRNUlkV01FclZyc3pWZ1BpQjlhUzJkVTBZc3BVZ0xIUXNUL1czRTlpbURlY0hSanhTbUsrYnFmd0FBQUFBU1VWT1JLNUNZSUk9JztcbiAgICB9IGVsc2UgaWYgKHRydWNrQ29sb3IgPT0gJ3B1cnBsZScpIHtcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXJDQVlBQUFEYmpjNnpBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBR3RtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd015MHdNMVF4TVRvek1Ub3dOQzB3TlRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk5Ea3RNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk5Ea3RNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TURrd1lUQXdaVFl0T1RObVppMWtZalExTFdJeE1qRXRNMkkxTXpCbU4yWXlaVFF3SWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZOVEprTVdRd01EZ3RZV014TXkwM01EUTVMVGxtT0dNdE9UaGlOVGN4WkRJellqSTBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZZekkwT1RnME1HVXRNbUprTVMxa1pEUXhMVGcwWTJJdE1XUTBZalJqTnpWa01Ea3hJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwak1qUTVPRFF3WlMweVltUXhMV1JrTkRFdE9EUmpZaTB4WkRSaU5HTTNOV1F3T1RFaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1ETXRNRE5VTVRFNk16RTZNRFF0TURVNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPakptTXprM01qRTRMVGxtTURVdFpUYzBNQzFpWTJZNUxUTmlNbVZqTXprNU1EUTNNaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhPQzB3TXkwd00xUXhNVG96T1Rvd09DMHdOVG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGljMkYyWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1Ea3dZVEF3WlRZdE9UTm1aaTFrWWpRMUxXSXhNakV0TTJJMU16Qm1OMll5WlRRd0lpQnpkRVYyZERwM2FHVnVQU0l5TURFNExUQTFMVEF4VkRFMk9qRTFPalE1TFRBME9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQnpkRVYyZERwamFHRnVaMlZrUFNJdklpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QZ1lvSTRvQUFBTDlTVVJCVkdqZTdacTdUaHRCRkliM0Vmd0lQSUlmZ1RmQU5aV3IxTzZEaEx1VVFCc3B5blpXaW5BTERVaGdGMGdrVWlRaWgyWWIxa1Vva0pDTUVBVlV5LzdJQThmSHM3dXp1M00yZS9HUmpuelJhdWJmYjJiT25MazRqcEFGUWRBUHFtMlhvYmVrNEt5cVdwNGVuNFB4b1JmOEhseVYzcUVUZW9udFNRSGFWelY4N3gwSG45ZStWY2FobDFwV0FPM1F0MElmaGo2TjZxTjMvclJTY0pUZi9MM05CbWdHWm1nNmlGRlJZd0NGejI1eUFCaXZLSXc2ZWszakFJWFBmZVU5NCtUVHViYndvNDFoc3dCeE9CZGZMbU1MYnhRZ0RtZTA4eXV4OE1ZQXlnS25NWUN5d21rRW9EeHdhZzhvTDV4YUF3cS9iK2VGVTF0QTRXZkhCcHc2QS9KdHdLa2xJTnA3dkRNL2QrRjFCT1NxSDRNUFIwdEFHa0RZT1FzZWJoK3RGRjVIUUZaZlpna293VEZNcWRrWXRrVzZ1NzQ3dCszcVNMUTIzUlBDME1YTStPUGpXZWtkT3FGM2JzdFZBaEFkWmhXM25pTVZMOUFhN0lTZ2FyYXZra1N4Z0lyeGpBMDI1RmQ4YTdhTXpxd3ZEcWhxdmdSVUpDQU1IeFg1OFZtbUEwS2tGbFNiYWFwaEJSQXE4MDU5YlZUREZJa2ozUDhGQmljdGQ5ZlR5RE02eks2aWdFeG5Kb2hFRHlzU1RsU2pjUnNmZURLQTBEcjhXQmt6RkZvRnpnLytpNFRFNGVCZGxEYm94aXhLdGVGNXE0QjQraDExTm9ibmFCWnRZL3ZFcEZlYmJQWWhORkJ0dXVHMmtDU2FBa0pjTVQwNEJDU2Fya3V2eFdoZGFiU2hoeWRrLzZzSzBDanBaVlNocGxzaWREZ21pYloxVmNWVUcrMXg5SDBSSXBpdEtFQmQ5WS8vODk5QzNNRHZ0d0IzNktYT0tTVHpLOXF6VGJYUjkxSDNDL2lkSUhRYWZ0enpaKzVHMk1IN2pUQWFBTk5NNFNwbXFhbGZ3dW55SUkwMjJuZ1JzMStiQTJwUlNKRlRaSVllVkpSbEFSUmgzYWpqNXRiczR1VjlYSDVUMXUwT1UyMDhYYUdyOTdmQWJIZ0prN3FiNWxpSXJZeEhtdkpzZWo5dTZsN1l6SnZQdENlek1scDVMMld1MEJnVkowUXpwdHVPc00xZTlGVmIzSnBRbzYwcmR1OFpsV0VoaUZrQm9uVGJsVllGeEd2clpORG1TZ2paVGhFVytrNkJSdE1WQTNPbFcyc1NVL25JT05qWjE5YW1pYS9Hb0x1VHBzd1hvYVR3c25LQWtkRUFBQUFBU1VWT1JLNUNZSUk9JztcbiAgICB9XG5cbiAgICB2YXIgZmVldGZvck1pbGVzID0gMC4wMDAxODkzOTQ7XG4gICAgdmFyIG1pZWxzVG9kaXNwYXRjaCA9IHBhcnNlRmxvYXQodHJ1Y2tJdGVtLmRpc3QpLnRvRml4ZWQoMik7XG5cbiAgICB0aGlzLnJlc3VsdHMucHVzaCh7XG4gICAgICBkaXNwbGF5OiB0cnVja0l0ZW0udHJ1Y2tJZCArIFwiIDogXCIgKyB0cnVja0l0ZW0udGVjaElELFxuICAgICAgdmFsdWU6IDEsXG4gICAgICBMYXRpdHVkZTogdHJ1Y2tJdGVtLmxhdCxcbiAgICAgIExvbmdpdHVkZTogdHJ1Y2tJdGVtLmxvbmdcbiAgICB9KTtcblxuICAgIHZhciB0cnVja1VybCA9IHRoaXMuZ2V0VHJ1Y2tVcmwodHJ1Y2tDb2xvcik7XG4gICAgY29uc3QgbGlzdE9mUHVzaFBpbnMgPSBtYXBzLmVudGl0aWVzO1xuICAgIHZhciBpc05ld1RydWNrID0gdHJ1ZTtcblxuICAgIHZhciBtZXRhZGF0YSA9IHtcbiAgICAgIHRydWNrSWQ6IHRydWNrSXRlbS50cnVja0lkLFxuICAgICAgQVRUVUlEOiB0cnVja0l0ZW0udGVjaElELFxuICAgICAgdHJ1Y2tTdGF0dXM6IHRydWNrSXRlbS50cnVja0NvbCxcbiAgICAgIHRydWNrQ29sOiB0cnVja0l0ZW0udHJ1Y2tDb2wsXG4gICAgICBqb2JUeXBlOiB0cnVja0l0ZW0uam9iVHlwZSxcbiAgICAgIFdSSm9iVHlwZTogdHJ1Y2tJdGVtLndvcmtUeXBlLFxuICAgICAgV1JTdGF0dXM6IHRydWNrSXRlbS53clN0YXQsXG4gICAgICBBc3NpbmdlZFdSSUQ6IHRydWNrSXRlbS53cklELFxuICAgICAgU3BlZWQ6IHRydWNrSXRlbS5zcGVlZCxcbiAgICAgIERpc3RhbmNlOiBtaWVsc1RvZGlzcGF0Y2gsXG4gICAgICBDdXJyZW50SWRsZVRpbWU6IHRydWNrSXRlbS5pZGxlVGltZSxcbiAgICAgIEVUQTogdHJ1Y2tJdGVtLnRvdElkbGVUaW1lLFxuICAgICAgRW1haWw6ICcnLC8vIHRydWNrSXRlbS5FbWFpbCxcbiAgICAgIE1vYmlsZTogJycsIC8vIHRydWNrSXRlbS5Nb2JpbGUsXG4gICAgICBpY29uOiBpY29uVXJsLFxuICAgICAgaWNvbkluZm86IGluZm9Cb3hUcnVja1VybCxcbiAgICAgIEN1cnJlbnRMYXQ6IHRydWNrSXRlbS5sYXQsXG4gICAgICBDdXJyZW50TG9uZzogdHJ1Y2tJdGVtLmxvbmcsXG4gICAgICBXUkxhdDogdHJ1Y2tJdGVtLndyTGF0LFxuICAgICAgV1JMb25nOiB0cnVja0l0ZW0ud3JMb25nLFxuICAgICAgdGVjaElkczogdGhpcy5yZXBvcnRpbmdUZWNobmljaWFucyxcbiAgICAgIGpvYklkOiB0cnVja0l0ZW0uam9iSWQsXG4gICAgICBtYW5hZ2VySWRzOiB0aGlzLm1hbmFnZXJJZHMsXG4gICAgICB3b3JrQWRkcmVzczogdHJ1Y2tJdGVtLndvcmtBZGRyZXNzLFxuICAgICAgc2JjVmluOiB0cnVja0l0ZW0uc2JjVmluLFxuICAgICAgY3VzdG9tZXJOYW1lOiB0cnVja0l0ZW0uY3VzdG9tZXJOYW1lLFxuICAgICAgdGVjaG5pY2lhbk5hbWU6IHRydWNrSXRlbS50ZWNobmljaWFuTmFtZSxcbiAgICAgIGRpc3BhdGNoVGltZTogdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSxcbiAgICAgIHJlZ2lvbjogdHJ1Y2tJdGVtLnpvbmVcbiAgICB9O1xuXG4gICAgbGV0IGpvYklkU3RyaW5nID0gJ2h0dHA6Ly9lZGdlLWVkdC5pdC5hdHQuY29tL2NnaS1iaW4vZWR0X2pvYmluZm8uY2dpPyc7XG5cbiAgICBsZXQgem9uZSA9IHRydWNrSXRlbS56b25lO1xuXG4gICAgLy8gPSBNIGZvciBNV1xuICAgIC8vID0gVyBmb3IgV2VzdFxuICAgIC8vID0gQiBmb3IgU0VcbiAgICAvLyA9IFMgZm9yIFNXXG4gICAgaWYgKHpvbmUgIT0gbnVsbCAmJiB6b25lICE9IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHpvbmUgPT09ICdNVycpIHtcbiAgICAgICAgem9uZSA9ICdNJztcbiAgICAgIH0gZWxzZSBpZiAoem9uZSA9PT0gJ1NFJykge1xuICAgICAgICB6b25lID0gJ0InXG4gICAgICB9IGVsc2UgaWYgKHpvbmUgPT09ICdTVycpIHtcbiAgICAgICAgem9uZSA9ICdTJ1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB6b25lID0gJyc7XG4gICAgfVxuXG4gICAgam9iSWRTdHJpbmcgPSBqb2JJZFN0cmluZyArICdlZHRfcmVnaW9uPScgKyB6b25lICsgJyZ3cmlkPScgKyB0cnVja0l0ZW0ud3JJRDtcblxuICAgIHRydWNrSXRlbS5qb2JJZCA9IHRydWNrSXRlbS5qb2JJZCA9PSB1bmRlZmluZWQgfHwgdHJ1Y2tJdGVtLmpvYklkID09IG51bGwgPyAnJyA6IHRydWNrSXRlbS5qb2JJZDtcblxuICAgIGlmICh0cnVja0l0ZW0uam9iSWQgIT0gJycpIHtcbiAgICAgIGpvYklkVXJsID0gJzxhIGhyZWY9XCInICsgam9iSWRTdHJpbmcgKyAnXCIgdGFyZ2V0PVwiX2JsYW5rXCIgdGl0bGU9XCJDbGljayBoZXJlIHRvIHNlZSBhY3R1YWwgRm9yY2UvRWRnZSBqb2IgZGF0YVwiPicgKyB0cnVja0l0ZW0uam9iSWQgKyAnPC9hPic7XG4gICAgfVxuXG4gICAgaWYgKHRydWNrSXRlbS5kaXNwYXRjaFRpbWUgIT0gbnVsbCAmJiB0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lICE9IHVuZGVmaW5lZCAmJiB0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lICE9ICcnKSB7XG4gICAgICBsZXQgZGlzcGF0Y2hEYXRlID0gdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZS5zcGxpdCgnOicpO1xuICAgICAgbGV0IGR0ID0gZGlzcGF0Y2hEYXRlWzBdICsgJyAnICsgZGlzcGF0Y2hEYXRlWzFdICsgJzonICsgZGlzcGF0Y2hEYXRlWzJdICsgJzonICsgZGlzcGF0Y2hEYXRlWzNdO1xuICAgICAgbWV0YWRhdGEuZGlzcGF0Y2hUaW1lID0gdGhhdC5VVENUb1RpbWVab25lKGR0KTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgaW4gdGhlIFRydWNrV2F0Y2hMaXN0IHNlc3Npb25cbiAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy50cnVja0xpc3QgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykpO1xuXG4gICAgICBpZiAodGhpcy50cnVja0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAodGhpcy50cnVja0xpc3Quc29tZSh4ID0+IHgudHJ1Y2tJZCA9PSB0cnVja0l0ZW0udHJ1Y2tJZCkgPT0gdHJ1ZSkge1xuICAgICAgICAgIGxldCBpdGVtID0gdGhpcy50cnVja0xpc3QuZmluZCh4ID0+IHgudHJ1Y2tJZCA9PSB0cnVja0l0ZW0udHJ1Y2tJZCk7XG4gICAgICAgICAgY29uc3QgaW5kZXg6IG51bWJlciA9IHRoaXMudHJ1Y2tMaXN0LmluZGV4T2YoaXRlbSk7XG4gICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgaXRlbS5EaXN0YW5jZSA9IG1ldGFkYXRhLkRpc3RhbmNlO1xuICAgICAgICAgICAgaXRlbS5pY29uID0gbWV0YWRhdGEuaWNvbjtcbiAgICAgICAgICAgIHRoaXMudHJ1Y2tMaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB0aGlzLnRydWNrTGlzdC5zcGxpY2UoaW5kZXgsIDAsIGl0ZW0pO1xuICAgICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrV2F0Y2hMaXN0JywgdGhpcy50cnVja0xpc3QpO1xuICAgICAgICAgICAgaXRlbSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGluIHRoZSBTZWxlY3RlZFRydWNrIHNlc3Npb25cbiAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tEZXRhaWxzJykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xuICAgICAgc2VsZWN0ZWRUcnVjayA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tEZXRhaWxzJykpO1xuXG4gICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrLnRydWNrSWQgPT0gdHJ1Y2tJdGVtLnRydWNrSWQpIHtcbiAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdUcnVja0RldGFpbHMnKTtcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tEZXRhaWxzJywgbWV0YWRhdGEpO1xuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHJ1Y2tJdGVtcy5sZW5ndGggPiAwICYmIHRoaXMudHJ1Y2tJdGVtcy5zb21lKHggPT4geC50b0xvd2VyQ2FzZSgpID09IHRydWNrSXRlbS50cnVja0lkLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICBpc05ld1RydWNrID0gZmFsc2U7XG4gICAgICAvLyBJZiBpdCBpcyBub3QgYSBuZXcgdHJ1Y2sgdGhlbiBtb3ZlIHRoZSB0cnVjayB0byBuZXcgbG9jYXRpb25cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mUHVzaFBpbnMuZ2V0TGVuZ3RoKCk7IGkrKykge1xuICAgICAgICBpZiAobGlzdE9mUHVzaFBpbnMuZ2V0KGkpLm1ldGFkYXRhLnRydWNrSWQgPT09IHRydWNrSXRlbS50cnVja0lkKSB7XG4gICAgICAgICAgdmFyIGN1clB1c2hQaW4gPSBsaXN0T2ZQdXNoUGlucy5nZXQoaSk7XG4gICAgICAgICAgY3VyUHVzaFBpbi5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgIGRlc3RMb2MgPSBwaW5Mb2NhdGlvbjtcbiAgICAgICAgICBwaW5Mb2NhdGlvbiA9IGxpc3RPZlB1c2hQaW5zLmdldChpKS5nZXRMb2NhdGlvbigpO1xuXG4gICAgICAgICAgbGV0IHRydWNrSWRSYW5JZCA9IHRydWNrSXRlbS50cnVja0lkICsgJ18nICsgTWF0aC5yYW5kb20oKTtcblxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0LmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5pbmRleE9mKHRydWNrSXRlbS50cnVja0lkKSA+IC0xKSB7XG4gICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5hbmltYXRpb25UcnVja0xpc3QucHVzaCh0cnVja0lkUmFuSWQpO1xuXG4gICAgICAgICAgdGhpcy5sb2FkRGlyZWN0aW9ucyh0aGlzLCBwaW5Mb2NhdGlvbiwgZGVzdExvYywgaSwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cnVja0l0ZW1zLnB1c2godHJ1Y2tJdGVtLnRydWNrSWQpO1xuICAgICAgTmV3UGluID0gbmV3IE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4ocGluTG9jYXRpb24sIHsgaWNvbjogdHJ1Y2tVcmwgfSk7XG5cbiAgICAgIE5ld1Bpbi5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgdGhpcy5tYXAuZW50aXRpZXMucHVzaChOZXdQaW4pO1xuXG4gICAgICB0aGlzLmRhdGFMYXllci5wdXNoKE5ld1Bpbik7XG4gICAgICBpZiAodGhpcy5pc01hcExvYWRlZCkge1xuICAgICAgICB0aGlzLmlzTWFwTG9hZGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMubWFwLnNldFZpZXcoeyBjZW50ZXI6IHBpbkxvY2F0aW9uLCB6b29tOiB0aGlzLmxhc3Rab29tTGV2ZWwgfSk7XG4gICAgICAgIHRoYXQubGFzdFpvb21MZXZlbCA9IHRoaXMubWFwLmdldFpvb20oKTtcbiAgICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSB0aGlzLm1hcC5nZXRDZW50ZXIoKTtcbiAgICAgIH1cblxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoTmV3UGluLCAnbW91c2VvdXQnLCAoZSkgPT4ge1xuICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7IHZpc2libGU6IGZhbHNlIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDEwMjQpIHtcbiAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoTmV3UGluLCAnY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgIHRoaXMuaW5mb2JveC5zZXRPcHRpb25zKHtcbiAgICAgICAgICAgIHNob3dQb2ludGVyOiB0cnVlLFxuICAgICAgICAgICAgbG9jYXRpb246IGUudGFyZ2V0LmdldExvY2F0aW9uKCksXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgb2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMCwgMjApLFxuICAgICAgICAgICAgaHRtbENvbnRlbnQ6ICc8ZGl2IGNsYXNzID0gXCJpbmZ5IGluZnlNYXBwb3B1cFwiPidcbiAgICAgICAgICAgICAgKyBnZXRJbmZvQm94SFRNTChlLnRhcmdldC5tZXRhZGF0YSwgdGhpcy50aHJlc2hvbGRWYWx1ZSwgam9iSWRVcmwpICsgJzwvZGl2PidcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMudHJ1Y2tXYXRjaExpc3QgPSBbeyBUcnVja0lkOiBlLnRhcmdldC5tZXRhZGF0YS50cnVja0lkLCBEaXN0YW5jZTogZS50YXJnZXQubWV0YWRhdGEuRGlzdGFuY2UgfV07XG5cbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tEZXRhaWxzJywgZS50YXJnZXQubWV0YWRhdGEpO1xuXG4gICAgICAgICAgLy8gQSBidWZmZXIgbGltaXQgdG8gdXNlIHRvIHNwZWNpZnkgdGhlIGluZm9ib3ggbXVzdCBiZSBhd2F5IGZyb20gdGhlIGVkZ2VzIG9mIHRoZSBtYXAuXG5cbiAgICAgICAgICB2YXIgYnVmZmVyID0gMzA7XG4gICAgICAgICAgdmFyIGluZm9ib3hPZmZzZXQgPSB0aGF0LmluZm9ib3guZ2V0T2Zmc2V0KCk7XG4gICAgICAgICAgdmFyIGluZm9ib3hBbmNob3IgPSB0aGF0LmluZm9ib3guZ2V0QW5jaG9yKCk7XG4gICAgICAgICAgdmFyIGluZm9ib3hMb2NhdGlvbiA9IG1hcHMudHJ5TG9jYXRpb25Ub1BpeGVsKGUudGFyZ2V0LmdldExvY2F0aW9uKCksIE1pY3Jvc29mdC5NYXBzLlBpeGVsUmVmZXJlbmNlLmNvbnRyb2wpO1xuICAgICAgICAgIHZhciBkeCA9IGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveE9mZnNldC54IC0gaW5mb2JveEFuY2hvci54O1xuICAgICAgICAgIHZhciBkeSA9IGluZm9ib3hMb2NhdGlvbi55IC0gMjUgLSBpbmZvYm94QW5jaG9yLnk7XG5cbiAgICAgICAgICBpZiAoZHkgPCBidWZmZXIpIHsgLy8gSW5mb2JveCBvdmVybGFwcyB3aXRoIHRvcCBvZiBtYXAuXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXG4gICAgICAgICAgICBkeSAqPSAtMTtcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGJ1ZmZlciBmcm9tIHRoZSB0b3AgZWRnZSBvZiB0aGUgbWFwLlxuICAgICAgICAgICAgZHkgKz0gYnVmZmVyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAjIyMjIElmIGR5IGlzIGdyZWF0ZXIgdGhhbiB6ZXJvIHRoYW4gaXQgZG9lcyBub3Qgb3ZlcmxhcC5cbiAgICAgICAgICAgIGR5ID0gMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZHggPCBidWZmZXIpIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggbGVmdCBzaWRlIG9mIG1hcC5cbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cbiAgICAgICAgICAgIGR4ICo9IC0xO1xuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgbGVmdCBlZGdlIG9mIHRoZSBtYXAuXG4gICAgICAgICAgICBkeCArPSBidWZmZXI7XG4gICAgICAgICAgfSBlbHNlIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggcmlnaHQgc2lkZSBvZiBtYXAuXG4gICAgICAgICAgICBkeCA9IG1hcHMuZ2V0V2lkdGgoKSAtIGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveEFuY2hvci54IC0gdGhhdC5pbmZvYm94LmdldFdpZHRoKCk7XG4gICAgICAgICAgICAvLyAjIyMjIElmIGR4IGlzIGdyZWF0ZXIgdGhhbiB6ZXJvIHRoZW4gaXQgZG9lcyBub3Qgb3ZlcmxhcC5cbiAgICAgICAgICAgIGlmIChkeCA+IGJ1ZmZlcikge1xuICAgICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSByaWdodCBlZGdlIG9mIHRoZSBtYXAuXG4gICAgICAgICAgICAgIGR4IC09IGJ1ZmZlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyAjIyMjIEFkanVzdCB0aGUgbWFwIHNvIGluZm9ib3ggaXMgaW4gdmlld1xuICAgICAgICAgIGlmIChkeCAhPSAwIHx8IGR5ICE9IDApIHtcbiAgICAgICAgICAgIG1hcHMuc2V0Vmlldyh7XG4gICAgICAgICAgICAgIGNlbnRlck9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KGR4LCBkeSksXG4gICAgICAgICAgICAgIGNlbnRlcjogbWFwcy5nZXRDZW50ZXIoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcbiAgICAgICAgICBzZWxlY3RlZFRydWNrID0gdGhpcy5tYXBTZXJ2aWNlLnJldHJpZXZlRGF0YUZyb21TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycpO1xuXG4gICAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXG4gICAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcblxuICAgICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMuaW5mb2JveCwgJ2NsaWNrJywgdmlld1RydWNrRGV0YWlscyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoTmV3UGluLCAnbW91c2VvdmVyJywgKGUpID0+IHtcbiAgICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7XG4gICAgICAgICAgICBzaG93UG9pbnRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiBlLnRhcmdldC5nZXRMb2NhdGlvbigpLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgIG9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDAsIDIwKSxcbiAgICAgICAgICAgIGh0bWxDb250ZW50OiAnPGRpdiBjbGFzcyA9IFwiaW5meSBpbmZ5TWFwcG9wdXBcIj4nXG4gICAgICAgICAgICAgICsgZ2V0SW5mb0JveEhUTUwoZS50YXJnZXQubWV0YWRhdGEsIHRoaXMudGhyZXNob2xkVmFsdWUsIGpvYklkVXJsKSArICc8L2Rpdj4nXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnRydWNrV2F0Y2hMaXN0ID0gW3sgVHJ1Y2tJZDogZS50YXJnZXQubWV0YWRhdGEudHJ1Y2tJZCwgRGlzdGFuY2U6IGUudGFyZ2V0Lm1ldGFkYXRhLkRpc3RhbmNlIH1dO1xuXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snLCBlLnRhcmdldC5tZXRhZGF0YSk7XG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrRGV0YWlscycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcblxuICAgICAgICAgIC8vIEEgYnVmZmVyIGxpbWl0IHRvIHVzZSB0byBzcGVjaWZ5IHRoZSBpbmZvYm94IG11c3QgYmUgYXdheSBmcm9tIHRoZSBlZGdlcyBvZiB0aGUgbWFwLlxuXG4gICAgICAgICAgdmFyIGJ1ZmZlciA9IDMwO1xuICAgICAgICAgIHZhciBpbmZvYm94T2Zmc2V0ID0gdGhhdC5pbmZvYm94LmdldE9mZnNldCgpO1xuICAgICAgICAgIHZhciBpbmZvYm94QW5jaG9yID0gdGhhdC5pbmZvYm94LmdldEFuY2hvcigpO1xuICAgICAgICAgIHZhciBpbmZvYm94TG9jYXRpb24gPSBtYXBzLnRyeUxvY2F0aW9uVG9QaXhlbChlLnRhcmdldC5nZXRMb2NhdGlvbigpLCBNaWNyb3NvZnQuTWFwcy5QaXhlbFJlZmVyZW5jZS5jb250cm9sKTtcbiAgICAgICAgICB2YXIgZHggPSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hPZmZzZXQueCAtIGluZm9ib3hBbmNob3IueDtcbiAgICAgICAgICB2YXIgZHkgPSBpbmZvYm94TG9jYXRpb24ueSAtIDI1IC0gaW5mb2JveEFuY2hvci55O1xuXG4gICAgICAgICAgaWYgKGR5IDwgYnVmZmVyKSB7IC8vIEluZm9ib3ggb3ZlcmxhcHMgd2l0aCB0b3Agb2YgbWFwLlxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxuICAgICAgICAgICAgZHkgKj0gLTE7XG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBidWZmZXIgZnJvbSB0aGUgdG9wIGVkZ2Ugb2YgdGhlIG1hcC5cbiAgICAgICAgICAgIGR5ICs9IGJ1ZmZlcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeSBpcyBncmVhdGVyIHRoYW4gemVybyB0aGFuIGl0IGRvZXMgbm90IG92ZXJsYXAuXG4gICAgICAgICAgICBkeSA9IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGR4IDwgYnVmZmVyKSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIGxlZnQgc2lkZSBvZiBtYXAuXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXG4gICAgICAgICAgICBkeCAqPSAtMTtcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIGxlZnQgZWRnZSBvZiB0aGUgbWFwLlxuICAgICAgICAgICAgZHggKz0gYnVmZmVyO1xuICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIHJpZ2h0IHNpZGUgb2YgbWFwLlxuICAgICAgICAgICAgZHggPSBtYXBzLmdldFdpZHRoKCkgLSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hBbmNob3IueCAtIHRoYXQuaW5mb2JveC5nZXRXaWR0aCgpO1xuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeCBpcyBncmVhdGVyIHRoYW4gemVybyB0aGVuIGl0IGRvZXMgbm90IG92ZXJsYXAuXG4gICAgICAgICAgICBpZiAoZHggPiBidWZmZXIpIHtcbiAgICAgICAgICAgICAgZHggPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgbWFwLlxuICAgICAgICAgICAgICBkeCAtPSBidWZmZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gIyMjIyBBZGp1c3QgdGhlIG1hcCBzbyBpbmZvYm94IGlzIGluIHZpZXdcbiAgICAgICAgICBpZiAoZHggIT0gMCB8fCBkeSAhPSAwKSB7XG4gICAgICAgICAgICBtYXBzLnNldFZpZXcoe1xuICAgICAgICAgICAgICBjZW50ZXJPZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludChkeCwgZHkpLFxuICAgICAgICAgICAgICBjZW50ZXI6IG1hcHMuZ2V0Q2VudGVyKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XG4gICAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoaXMubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcblxuICAgICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhpcy5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxuICAgICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XG5cbiAgICAgICAgICAgIGlmICh0ZWNobmljaWFuRGV0YWlscyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhblBob25lID0gdGVjaG5pY2lhbkRldGFpbHMucGhvbmU7XG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbk5hbWUgPSB0ZWNobmljaWFuRGV0YWlscy5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLmluZm9ib3gsICdjbGljaycsIHZpZXdUcnVja0RldGFpbHMpO1xuXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihtYXBzLCAndmlld2NoYW5nZScsIG1hcFZpZXdDaGFuZ2VkKTtcblxuICAgICAgLy8gdGhpcy5DaGFuZ2VUcnVja0RpcmVjdGlvbih0aGlzLCBOZXdQaW4sIGRlc3RMb2MsIHRydWNrVXJsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXBWaWV3Q2hhbmdlZChlKSB7XG4gICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSBtYXBzLmdldFpvb20oKTtcbiAgICAgIHRoYXQubGFzdExvY2F0aW9uID0gbWFwcy5nZXRDZW50ZXIoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbW91c2V3aGVlbENoYW5nZWQoZSkge1xuICAgICAgdGhhdC5sYXN0Wm9vbUxldmVsID0gbWFwcy5nZXRab29tKCk7XG4gICAgICB0aGF0Lmxhc3RMb2NhdGlvbiA9IG1hcHMuZ2V0Q2VudGVyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SW5mb0JveEhUTUwoZGF0YTogYW55LCB0VmFsdWUsIGpvYklkKTogU3RyaW5nIHtcblxuICAgICAgaWYgKCFkYXRhLlNwZWVkKSB7XG4gICAgICAgIGRhdGEuU3BlZWQgPSAwO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2xhc3NOYW1lID0gXCJcIjtcbiAgICAgIHZhciBzdHlsZUxlZnQgPSBcIlwiO1xuICAgICAgdmFyIHJlYXNvbiA9ICcnO1xuICAgICAgaWYgKGRhdGEudHJ1Y2tTdGF0dXMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChkYXRhLnRydWNrU3RhdHVzLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3JlZCcpIHtcbiAgICAgICAgICByZWFzb24gPSBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi10b3A6M3B4O2NvbG9yOnJlZDsnPlJlYXNvbjogQ3VtdWxhdGl2ZSBpZGxlIHRpbWUgaXMgYmV5b25kIFwiICsgdFZhbHVlICsgXCIgbWluczwvZGl2PlwiO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEudHJ1Y2tTdGF0dXMudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAncHVycGxlJykge1xuICAgICAgICAgIHJlYXNvbiA9IFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLXRvcDozcHg7Y29sb3I6cHVycGxlOyc+UmVhc29uOiBUcnVjayBpcyBkcml2ZW4gZ3JlYXRlciB0aGFuIDc1IG0vaDwvZGl2PlwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBpbmZvYm94RGF0YSA9ICcnO1xuXG4gICAgICBkYXRhLmN1c3RvbWVyTmFtZSA9IGRhdGEuY3VzdG9tZXJOYW1lID09IHVuZGVmaW5lZCB8fCBkYXRhLmN1c3RvbWVyTmFtZSA9PSBudWxsID8gJycgOiBkYXRhLmN1c3RvbWVyTmFtZTtcblxuICAgICAgZGF0YS5kaXNwYXRjaFRpbWUgPSBkYXRhLmRpc3BhdGNoVGltZSA9PSB1bmRlZmluZWQgfHwgZGF0YS5kaXNwYXRjaFRpbWUgPT0gbnVsbCA/ICcnIDogZGF0YS5kaXNwYXRjaFRpbWU7XG5cbiAgICAgIGRhdGEuam9iSWQgPSBkYXRhLmpvYklkID09IHVuZGVmaW5lZCB8fCBkYXRhLmpvYklkID09IG51bGwgPyAnJyA6IGRhdGEuam9iSWQ7XG5cbiAgICAgIGRhdGEud29ya0FkZHJlc3MgPSBkYXRhLndvcmtBZGRyZXNzID09IHVuZGVmaW5lZCB8fCBkYXRhLndvcmtBZGRyZXNzID09IG51bGwgPyAnJyA6IGRhdGEud29ya0FkZHJlc3M7XG5cbiAgICAgIGRhdGEuc2JjVmluID0gZGF0YS5zYmNWaW4gPT0gdW5kZWZpbmVkIHx8IGRhdGEuc2JjVmluID09IG51bGwgfHwgZGF0YS5zYmNWaW4gPT0gJycgPyAnJyA6IGRhdGEuc2JjVmluO1xuXG4gICAgICBkYXRhLnRlY2huaWNpYW5OYW1lID0gZGF0YS50ZWNobmljaWFuTmFtZSA9PSB1bmRlZmluZWQgfHwgZGF0YS50ZWNobmljaWFuTmFtZSA9PSBudWxsIHx8IGRhdGEudGVjaG5pY2lhbk5hbWUgPT0gJycgPyAnJyA6IGRhdGEudGVjaG5pY2lhbk5hbWU7XG5cbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDEwMjQpIHtcbiAgICAgICAgaW5mb2JveERhdGEgPSBcIjxkaXYgY2xhc3M9J3BvcE1vZGFsQ29udGFpbmVyJz48ZGl2IGNsYXNzPSdwb3BNb2RhbEhlYWRlcic+PGltZyBzcmM9J1wiICsgZGF0YS5pY29uSW5mbyArIFwiJyA+PGEgY2xhc3M9J2RldGFpbHMnIHRpdGxlPSdDbGljayBoZXJlIHRvIHNlZSB0ZWNobmljaWFuIGRldGFpbHMnID5WaWV3IERldGFpbHM8L2E+PGkgY2xhc3M9J2ZhIGZhLXRpbWVzJyBhcmlhLWhpZGRlbj0ndHJ1ZScgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+PC9pPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxoci8+PGRpdiBjbGFzcz0ncG9wTW9kYWxCb2R5Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPlZlaGljbGUgTnVtYmVyIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuc2JjVmluICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+VlRTIFVuaXQgSUQgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS50cnVja0lkICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5Kb2IgVHlwZSA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmpvYlR5cGUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5Kb2IgSWQgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgam9iSWQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkFUVFVJRCA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLkFUVFVJRCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPlRlY2huaWNpYW4gTmFtZSA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLnRlY2huaWNpYW5OYW1lICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5DdXN0b21lciBOYW1lIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuY3VzdG9tZXJOYW1lICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+RGlzcGF0Y2ggVGltZTo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuZGlzcGF0Y2hUaW1lICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtMTInPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbC0xMiBjb2wtc20tMTIgY29sLWZvcm0tbGFiZWwnPkpvYiBBZGRyZXNzIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtc20tMTInPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCBjb2wtZm9ybS1sYWJlbC1mdWxsJz5cIiArIGRhdGEud29ya0FkZHJlc3MgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgbWV0ZXJDYWwnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtbWQtNCc+PHN0cm9uZz5cIiArIGRhdGEuU3BlZWQgKyBcIjwvc3Ryb25nPiBtcGggPHNwYW4gY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+U3BlZWQ8L3NwYW4+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLTEyIGNvbC1tZC00Jz48c3Ryb25nPlwiICsgZGF0YS5FVEEgKyBcIjwvc3Ryb25nPiBNaW5zIDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkN1bXVsYXRpdmUgSWRsZSBNaW51dGVzPC9zcGFuPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtbWQtNCc+PHN0cm9uZz5cIiArIHRoYXQuY29udmVydE1pbGVzVG9GZWV0KGRhdGEuRGlzdGFuY2UpICsgXCI8L3N0cm9uZz4gRnQgPHNwYW4gY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+RmVldCB0byBKb2IgU2l0ZTwvc3Bhbj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj4gPGhyLz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdwb3BNb2RhbEZvb3Rlcic+PGRpdiBjbGFzcz0ncm93Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wgY29sLW1kLTQnPjxpIGNsYXNzPSdmYSBmYS1jb21tZW50aW5nJz48L2k+PHNwYW4gY2xhc3M9J3NtcycgdGl0bGU9J0NsaWNrIHRvIHNlbmQgU01TJyA+U01TPC9wPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbCBjb2wtbWQtNCc+PGkgY2xhc3M9J2ZhIGZhLWVudmVsb3BlJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxzcGFuIGNsYXNzPSdlbWFpbCcgdGl0bGU9J0NsaWNrIHRvIHNlbmQgZW1haWwnID5FbWFpbDwvcD48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wgY29sLW1kLTQnPjxpIGNsYXNzPSdmYSBmYS1leWUnIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PHNwYW4gY2xhc3M9J3dhdGNobGlzdCcgdGl0bGU9J0NsaWNrIHRvIGFkZCBpbiB3YXRjaGxpc3QnID5XYXRjaDwvcD48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj4gPC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCI7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZm9ib3hEYXRhID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdwYWRkaW5nLXRvcDoxMHB4O21hcmdpbjogMHB4Oyc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTMnPjxkaXYgc3R5bGU9J3BhZGRpbmctdG9wOjE1cHg7JyA+PGltZyBzcmM9J1wiICsgZGF0YS5pY29uSW5mbyArIFwiJyBzdHlsZT0nZGlzcGxheTogYmxvY2s7bWFyZ2luOiAwIGF1dG87JyA+PC9kaXY+PC9kaXY+XCIgK1xuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTknPlwiICtcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdyAnPlwiICtcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J2NvbC1tZC04JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPlZlaGljbGUgTnVtYmVyPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuc2JjVmluICsgXCI8L2Rpdj5cIiArXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PGEgY2xhc3M9J2RldGFpbHMnIHN0eWxlPSdjb2xvcjojMDA5RkRCO2N1cnNvcjogcG9pbnRlcjsnICB0aXRsZT0nQ2xpY2sgaGVyZSB0byBzZWUgdGVjaG5pY2lhbiBkZXRhaWxzJyA+VmlldyBEZXRhaWxzPC9hPjxpIGNsYXNzPSdmYSBmYS10aW1lcycgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4O2N1cnNvcjogcG9pbnRlcjsnIGFyaWEtaGlkZGVuPSd0cnVlJyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz48L2k+PC9kaXY+XCIgK1xuICAgICAgICAgIFwiPC9kaXY+XCIgK1xuICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncm93Jz48ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+VlRTIFVuaXQgSUQ8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS50cnVja0lkICsgXCI8L2Rpdj48L2Rpdj5cIiArXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnPjxkaXYgY2xhc3M9J2NvbC1tZC01JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkpvYiBUeXBlPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuam9iVHlwZSArIFwiPC9kaXY+PGRpdiBjbGFzcz0nY29sLW1kLTcnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOycgPkpvYiBJZDwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBqb2JJZCArIFwiPC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIHJlYXNvbiArIFwiPC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7Jz48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkFUVFVJRDwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLkFUVFVJRCArIFwiPHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7bWFyZ2luLWxlZnQ6OHB4Oyc+VGVjaG5pY2lhbiBOYW1lPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEudGVjaG5pY2lhbk5hbWUgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4OycgPlwiXG4gICAgICAgICAgKyBcIjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5DdXN0b21lciBOYW1lPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuY3VzdG9tZXJOYW1lICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnID5cIlxuICAgICAgICAgICsgXCI8ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+RGlzcGF0Y2ggVGltZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmRpc3BhdGNoVGltZSArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7JyA+XCJcbiAgICAgICAgICArIFwiPGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkpvYiBBZGRyZXNzPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEud29ya0FkZHJlc3MgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxociBzdHlsZT0nbWFyZ2luLXRvcDoxcHg7IG1hcmdpbi1ib3R0b206NXB4OycgLz5cIlxuXG4gICAgICAgICAgKyBcIjxkaXYgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Oyc+IDxkaXYgY2xhc3M9J3Jvdyc+IDxkaXYgY2xhc3M9J3NwZWVkIGNvbC1tZC0zJz4gPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDFweCc+PHAgc3R5bGU9J2ZvbnQtd2VpZ2h0OiBib2xkZXI7Zm9udC1zaXplOiAyM3B4O21hcmdpbjogMHB4Oyc+XCIgKyBkYXRhLlNwZWVkICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+bXBoPC9wPjwvZGl2PjxwIHN0eWxlPSdtYXJnaW46MHB4JyBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5TcGVlZDwvcD48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpZGxlIGNvbC1tZC01Jz48ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tbGVmdDogMTBweCc+PHAgc3R5bGU9J2ZvbnQtd2VpZ2h0OiBib2xkZXI7Zm9udC1zaXplOiAyM3B4O21hcmdpbjogMHB4Oyc+XCIgKyBkYXRhLkVUQSArIFwiPC9wPjxwIHN0eWxlPSdtYXJnaW46IDEwcHggMTBweDsnPk1pbnM8L3A+PC9kaXY+PHAgc3R5bGU9J21hcmdpbjowcHgnIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkN1bXVsYXRpdmUgSWRsZSBNaW51dGVzPC9wPjwvZGl2PiA8ZGl2IGNsYXNzPSdtaWxlcyBjb2wtbWQtNCc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHgnPjxwIHN0eWxlPSdmb250LXdlaWdodDogYm9sZGVyO2ZvbnQtc2l6ZTogMjNweDttYXJnaW46IDBweDsnPlwiICsgdGhhdC5jb252ZXJ0TWlsZXNUb0ZlZXQoZGF0YS5EaXN0YW5jZSkgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5GdDwvcD48L2Rpdj48cCBzdHlsZT0nbWFyZ2luOjBweCcgY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+RmVldCB0byBKb2IgU2l0ZTwvcD48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj48L2Rpdj48aHIgc3R5bGU9J21hcmdpbi10b3A6MXB4OyBtYXJnaW4tYm90dG9tOjVweDsnIC8+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz4gPGRpdiBjbGFzcz0nY29sLW1kLTEnPjwvZGl2PjxkaXYgY2xhc3M9J3JvdyBjb2wtbWQtMycgc3R5bGU9J1wiICsgY2xhc3NOYW1lICsgXCInPiA8aSBjbGFzcz0nZmEgZmEtY29tbWVudGluZyBjb2wtbWQtMic+PC9pPjxwIGNsYXNzPSdjb2wtbWQtNiBzbXMnIHRpdGxlPSdDbGljayB0byBzZW5kIFNNUycgPlNNUzwvcD48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMgb2Zmc2V0LW1kLTEnIHN0eWxlPSdcIiArIGNsYXNzTmFtZSArIFwiJz4gPGkgY2xhc3M9J2ZhIGZhLWVudmVsb3BlIGNvbC1tZC0yJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxwIGNsYXNzPSdjb2wtbWQtNiBlbWFpbCcgdGl0bGU9J0NsaWNrIHRvIHNlbmQgZW1haWwnID5FbWFpbDwvcD48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3JvdyBjb2wtbWQtMycgc3R5bGU9J1wiICsgc3R5bGVMZWZ0ICsgXCInPjxpIGNsYXNzPSdmYSBmYS1leWUgY29sLW1kLTInIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PHAgY2xhc3M9J2NvbC1tZC02IHdhdGNobGlzdCcgdGl0bGU9J0NsaWNrIHRvIGFkZCBpbiB3YXRjaGxpc3QnID5XYXRjaDwvcD48L2Rpdj4gPC9kaXY+XCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbmZvYm94RGF0YTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2aWV3VHJ1Y2tEZXRhaWxzKGUpIHtcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2ZhIGZhLXRpbWVzJykge1xuICAgICAgICB0aGF0LmluZm9ib3guc2V0T3B0aW9ucyh7XG4gICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdkZXRhaWxzJykge1xuICAgICAgICAvL3RoYXQucm91dGVyLm5hdmlnYXRlKFsnL3RlY2huaWNpYW4tZGV0YWlscyddKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnY29sLW1kLTYgc21zJykge1xuICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xuICAgICAgICBzZWxlY3RlZFRydWNrID0gdGhhdC5tYXBTZXJ2aWNlLnJldHJpZXZlRGF0YUZyb21TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycpO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcbiAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoYXQucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcbiAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcblxuICAgICAgICAgIGlmICh0ZWNobmljaWFuRGV0YWlscyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbk5hbWUgPSB0ZWNobmljaWFuRGV0YWlscy5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBqUXVlcnkoJyNteU1vZGFsU01TJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnY29sLW1kLTYgZW1haWwnKSB7XG4gICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XG4gICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGF0Lm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhhdC5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxuICAgICAgICAgICAgeCA9PiB4LmF0dHVpZC50b0xvd2VyQ2FzZSgpID09IHNlbGVjdGVkVHJ1Y2suQVRUVUlELnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGpRdWVyeSgnI215TW9kYWxFbWFpbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgICB9XG4gICAgIFxuICAgIH1cbiAgfVxuXG4gIGxvYWREaXJlY3Rpb25zKHRoYXQsIHN0YXJ0TG9jLCBlbmRMb2MsIGluZGV4LCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKSB7XG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucycsICgpID0+IHtcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5EaXJlY3Rpb25zTWFuYWdlcih0aGF0Lm1hcCk7XG4gICAgICAvLyBTZXQgUm91dGUgTW9kZSB0byBkcml2aW5nXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLnNldFJlcXVlc3RPcHRpb25zKHtcbiAgICAgICAgcm91dGVNb2RlOiBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLlJvdXRlTW9kZS5kcml2aW5nXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuc2V0UmVuZGVyT3B0aW9ucyh7XG4gICAgICAgIGRyaXZpbmdQb2x5bGluZU9wdGlvbnM6IHtcbiAgICAgICAgICBzdHJva2VDb2xvcjogJ2dyZWVuJyxcbiAgICAgICAgICBzdHJva2VUaGlja25lc3M6IDMsXG4gICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgd2F5cG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiBmYWxzZSB9LFxuICAgICAgICB2aWFwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IGZhbHNlIH0sXG4gICAgICAgIGF1dG9VcGRhdGVNYXBWaWV3OiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHdheXBvaW50MSA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLldheXBvaW50KHtcbiAgICAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihzdGFydExvYy5sYXRpdHVkZSwgc3RhcnRMb2MubG9uZ2l0dWRlKSwgaWNvbjogJydcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgd2F5cG9pbnQyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuV2F5cG9pbnQoe1xuICAgICAgICBsb2NhdGlvbjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGVuZExvYy5sYXRpdHVkZSwgZW5kTG9jLmxvbmdpdHVkZSlcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5hZGRXYXlwb2ludCh3YXlwb2ludDEpO1xuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5hZGRXYXlwb2ludCh3YXlwb2ludDIpO1xuXG4gICAgICAvLyBBZGQgZXZlbnQgaGFuZGxlciB0byBkaXJlY3Rpb25zIG1hbmFnZXIuXG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLCAnZGlyZWN0aW9uc1VwZGF0ZWQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIHZhciByb3V0ZUluZGV4ID0gZS5yb3V0ZVswXS5yb3V0ZUxlZ3NbMF0ub3JpZ2luYWxSb3V0ZUluZGV4O1xuICAgICAgICB2YXIgbmV4dEluZGV4ID0gcm91dGVJbmRleDtcbiAgICAgICAgaWYgKGUucm91dGVbMF0ucm91dGVQYXRoLmxlbmd0aCA+IHJvdXRlSW5kZXgpIHtcbiAgICAgICAgICBuZXh0SW5kZXggPSByb3V0ZUluZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmV4dExvY2F0aW9uID0gZS5yb3V0ZVswXS5yb3V0ZVBhdGhbbmV4dEluZGV4XTtcbiAgICAgICAgdmFyIHBpbiA9IHRoYXQubWFwLmVudGl0aWVzLmdldChpbmRleCk7XG4gICAgICAgIC8vIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHN0YXJ0TG9jLG5leHRMb2NhdGlvbik7XG4gICAgICAgIHRoYXQuTW92ZVBpbk9uRGlyZWN0aW9uKHRoYXQsIGUucm91dGVbMF0ucm91dGVQYXRoLCBwaW4sIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuY2FsY3VsYXRlRGlyZWN0aW9ucygpO1xuICAgIH0pO1xuICB9XG5cbiAgTW92ZVBpbk9uRGlyZWN0aW9uKHRoYXQsIHJvdXRlUGF0aCwgcGluLCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKSB7XG4gICAgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGlzR2VvZGVzaWMgPSBmYWxzZTtcbiAgICB0aGF0LmN1cnJlbnRBbmltYXRpb24gPSBuZXcgQmluZy5NYXBzLkFuaW1hdGlvbnMuUGF0aEFuaW1hdGlvbihyb3V0ZVBhdGgsIGZ1bmN0aW9uIChjb29yZCwgaWR4LCBmcmFtZUlkeCwgcm90YXRpb25BbmdsZSwgbG9jYXRpb25zLCB0cnVja0lkUmFuSWQpIHtcblxuICAgICAgaWYgKHRoYXQuYW5pbWF0aW9uVHJ1Y2tMaXN0Lmxlbmd0aCA+IDAgJiYgdGhhdC5hbmltYXRpb25UcnVja0xpc3Quc29tZSh4ID0+IHggPT0gdHJ1Y2tJZFJhbklkKSkge1xuICAgICAgICB2YXIgaW5kZXggPSAoZnJhbWVJZHggPT0gbG9jYXRpb25zLmxlbmd0aCAtIDEpID8gZnJhbWVJZHggOiBmcmFtZUlkeCArIDE7XG4gICAgICAgIHZhciByb3RhdGlvbkFuZ2xlID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKGNvb3JkLCBsb2NhdGlvbnNbaW5kZXhdKTtcbiAgICAgICAgaWYgKHRoYXQuaXNPZGQoZnJhbWVJZHgpKSB7XG4gICAgICAgICAgdGhhdC5jcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKHBpbiwgdHJ1Y2tVcmwsIHJvdGF0aW9uQW5nbGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZyYW1lSWR4ID09IGxvY2F0aW9ucy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgdGhhdC5jcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKHBpbiwgdHJ1Y2tVcmwsIHJvdGF0aW9uQW5nbGUpO1xuICAgICAgICB9XG4gICAgICAgIHBpbi5zZXRMb2NhdGlvbihjb29yZCk7XG4gICAgICB9XG5cbiAgICB9LCBpc0dlb2Rlc2ljLCB0aGF0LnRyYXZhbER1cmF0aW9uLCB0cnVja0lkUmFuSWQpO1xuXG4gICAgdGhhdC5jdXJyZW50QW5pbWF0aW9uLnBsYXkoKTtcbiAgfVxuXG4gIENhbGN1bGF0ZU5leHRDb29yZChzdGFydExvY2F0aW9uLCBlbmRMb2NhdGlvbikge1xuICAgIHRyeSB7XG5cbiAgICAgIHZhciBkbGF0ID0gKGVuZExvY2F0aW9uLmxhdGl0dWRlIC0gc3RhcnRMb2NhdGlvbi5sYXRpdHVkZSk7XG4gICAgICB2YXIgZGxvbiA9IChlbmRMb2NhdGlvbi5sb25naXR1ZGUgLSBzdGFydExvY2F0aW9uLmxvbmdpdHVkZSk7XG4gICAgICB2YXIgYWxwaGEgPSBNYXRoLmF0YW4yKGRsYXQgKiBNYXRoLlBJIC8gMTgwLCBkbG9uICogTWF0aC5QSSAvIDE4MCk7XG4gICAgICB2YXIgZHggPSAwLjAwMDE1MjM4Nzk0NzI3OTA5OTMxO1xuICAgICAgZGxhdCA9IGR4ICogTWF0aC5zaW4oYWxwaGEpO1xuICAgICAgZGxvbiA9IGR4ICogTWF0aC5jb3MoYWxwaGEpO1xuICAgICAgdmFyIG5leHRDb29yZCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihzdGFydExvY2F0aW9uLmxhdGl0dWRlICsgZGxhdCwgc3RhcnRMb2NhdGlvbi5sb25naXR1ZGUgKyBkbG9uKTtcblxuICAgICAgZGxhdCA9IG51bGw7XG4gICAgICBkbG9uID0gbnVsbDtcbiAgICAgIGFscGhhID0gbnVsbDtcbiAgICAgIGR4ID0gbnVsbDtcblxuICAgICAgcmV0dXJuIG5leHRDb29yZDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIENhbGN1bGF0ZU5leHRDb29yZCAtICcgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgaXNPZGQobnVtKSB7XG4gICAgcmV0dXJuIG51bSAlIDI7XG4gIH1cblxuICBkZWdUb1JhZCh4KSB7XG4gICAgcmV0dXJuIHggKiBNYXRoLlBJIC8gMTgwO1xuICB9XG5cbiAgcmFkVG9EZWcoeCkge1xuICAgIHJldHVybiB4ICogMTgwIC8gTWF0aC5QSTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUJlYXJpbmcob3JpZ2luLCBkZXN0KSB7XG4gICAgLy8vIDxzdW1tYXJ5PkNhbGN1bGF0ZXMgdGhlIGJlYXJpbmcgYmV0d2VlbiB0d28gbG9hY2F0aW9ucy48L3N1bW1hcnk+XG4gICAgLy8vIDxwYXJhbSBuYW1lPVwib3JpZ2luXCIgdHlwZT1cIk1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uXCI+SW5pdGlhbCBsb2NhdGlvbi48L3BhcmFtPlxuICAgIC8vLyA8cGFyYW0gbmFtZT1cImRlc3RcIiB0eXBlPVwiTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb25cIj5TZWNvbmQgbG9jYXRpb24uPC9wYXJhbT5cbiAgICB0cnkge1xuICAgICAgdmFyIGxhdDEgPSB0aGlzLmRlZ1RvUmFkKG9yaWdpbi5sYXRpdHVkZSk7XG4gICAgICB2YXIgbG9uMSA9IG9yaWdpbi5sb25naXR1ZGU7XG4gICAgICB2YXIgbGF0MiA9IHRoaXMuZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSk7XG4gICAgICB2YXIgbG9uMiA9IGRlc3QubG9uZ2l0dWRlO1xuICAgICAgdmFyIGRMb24gPSB0aGlzLmRlZ1RvUmFkKGxvbjIgLSBsb24xKTtcbiAgICAgIHZhciB5ID0gTWF0aC5zaW4oZExvbikgKiBNYXRoLmNvcyhsYXQyKTtcbiAgICAgIHZhciB4ID0gTWF0aC5jb3MobGF0MSkgKiBNYXRoLnNpbihsYXQyKSAtIE1hdGguc2luKGxhdDEpICogTWF0aC5jb3MobGF0MikgKiBNYXRoLmNvcyhkTG9uKTtcblxuICAgICAgbGF0MSA9IGxhdDIgPSBsb24xID0gbG9uMiA9IGRMb24gPSBudWxsO1xuXG4gICAgICByZXR1cm4gKHRoaXMucmFkVG9EZWcoTWF0aC5hdGFuMih5LCB4KSkgKyAzNjApICUgMzYwO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3IgaW4gY2FsY3VsYXRlQmVhcmluZyAtICcgKyBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgU2VuZFNNUyhmb3JtKSB7XG4gICAgLy8gaWYodGhpcy50ZWNobmljaWFuUGhvbmUgIT0gJycpe1xuICAgIGlmIChmb3JtLnZhbHVlLm1vYmlsZU5vICE9ICcnKSB7XG4gICAgICBpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHdhbnQgdG8gc2VuZCBTTVM/JykpIHtcbiAgICAgICAgLy8gdGhpcy5tYXBTZXJ2aWNlLnNlbmRTTVModGhpcy50ZWNobmljaWFuUGhvbmUsZm9ybS52YWx1ZS5zbXNNZXNzYWdlKTtcbiAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnNlbmRTTVMoZm9ybS52YWx1ZS5tb2JpbGVObywgZm9ybS52YWx1ZS5zbXNNZXNzYWdlKTtcblxuICAgICAgICBmb3JtLmNvbnRyb2xzLnNtc01lc3NhZ2UucmVzZXQoKVxuICAgICAgICBmb3JtLnZhbHVlLm1vYmlsZU5vID0gdGhpcy50ZWNobmljaWFuUGhvbmU7XG4gICAgICAgIGpRdWVyeSgnI215TW9kYWxTTVMnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAvL3RoaXMudG9hc3RyLnN1Y2Nlc3MoJ1NNUyBzZW50IHN1Y2Nlc3NmdWxseScsICdTdWNjZXNzJyk7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICBTZW5kRW1haWwoZm9ybSkge1xuICAgIC8vIGlmKHRoaXMudGVjaG5pY2lhbkVtYWlsICE9ICcnKXtcbiAgICBpZiAoZm9ybS52YWx1ZS5lbWFpbElkICE9ICcnKSB7XG4gICAgICBpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHdhbnQgdG8gc2VuZCBFbWFpbD8nKSkge1xuXG4gICAgICAgIC8vIHRoaXMudXNlclByb2ZpbGVTZXJ2aWNlLmdldFVzZXJEYXRhKHRoaXMuY29va2llQVRUVUlEKVxuICAgICAgICAvLyAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgICAgLy8gICAgIHZhciBuZXdEYXRhOiBhbnkgPSB0aGlzLnN0cmluZ2lmeUpzb24oZGF0YSk7XG4gICAgICAgIC8vICAgICAvL3RoaXMubWFwU2VydmljZS5zZW5kRW1haWwobmV3RGF0YS5lbWFpbCx0aGlzLnRlY2huaWNpYW5FbWFpbCxuZXdEYXRhLmxhc3ROYW1lICsgJyAnICsgbmV3RGF0YS5maXJzdE5hbWUsIHRoaXMudGVjaG5pY2lhbk5hbWUsIGZvcm0udmFsdWUuZW1haWxTdWJqZWN0LGZvcm0udmFsdWUuZW1haWxNZXNzYWdlKTtcbiAgICAgICAgLy8gICAgIHRoaXMubWFwU2VydmljZS5zZW5kRW1haWwobmV3RGF0YS5lbWFpbCwgZm9ybS52YWx1ZS5lbWFpbElkLCBuZXdEYXRhLmxhc3ROYW1lICsgJyAnICsgbmV3RGF0YS5maXJzdE5hbWUsIHRoaXMudGVjaG5pY2lhbk5hbWUsIGZvcm0udmFsdWUuZW1haWxTdWJqZWN0LCBmb3JtLnZhbHVlLmVtYWlsTWVzc2FnZSk7XG4gICAgICAgIC8vICAgICB0aGlzLnRvYXN0ci5zdWNjZXNzKFwiRW1haWwgc2VudCBzdWNjZXNzZnVsbHlcIiwgJ1N1Y2Nlc3MnKTtcblxuICAgICAgICAvLyAgICAgZm9ybS5jb250cm9scy5lbWFpbFN1YmplY3QucmVzZXQoKVxuICAgICAgICAvLyAgICAgZm9ybS5jb250cm9scy5lbWFpbE1lc3NhZ2UucmVzZXQoKVxuICAgICAgICAvLyAgICAgZm9ybS52YWx1ZS5lbWFpbElkID0gdGhpcy50ZWNobmljaWFuRW1haWw7XG4gICAgICAgIC8vICAgICBqUXVlcnkoJyNteU1vZGFsRW1haWwnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAvLyAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIFNlYXJjaFRydWNrKGZvcm0pIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgIC8vJCgnI2xvYWRpbmcnKS5zaG93KCk7XG5cbiAgICBpZiAoZm9ybS52YWx1ZS5pbnB1dG1pbGVzICE9ICcnICYmIGZvcm0udmFsdWUuaW5wdXRtaWxlcyAhPSBudWxsKSB7XG4gICAgICBjb25zdCBsdCA9IHRoYXQuY2xpY2tlZExhdDtcbiAgICAgIGNvbnN0IGxnID0gdGhhdC5jbGlja2VkTG9uZztcbiAgICAgIGNvbnN0IHJkID0gZm9ybS52YWx1ZS5pbnB1dG1pbGVzO1xuXG4gICAgICB0aGlzLmZvdW5kVHJ1Y2sgPSBmYWxzZTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0ID0gW107XG5cbiAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5sb2FkTWFwVmlldygncm9hZCcpO1xuXG4gICAgICB0aGF0LkxvYWRUcnVja3ModGhpcy5tYXAsIGx0LCBsZywgcmQsIHRydWUpO1xuXG4gICAgICBmb3JtLmNvbnRyb2xzLmlucHV0bWlsZXMucmVzZXQoKTtcbiAgICAgIGpRdWVyeSgnI215UmFkaXVzTW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICB9LCAxMDAwMCk7XG4gICAgfVxuICB9XG5cblxuXG4gIGdldE1pbGVzKGkpIHtcbiAgICByZXR1cm4gaSAqIDAuMDAwNjIxMzcxMTkyO1xuICB9XG5cbiAgZ2V0TWV0ZXJzKGkpIHtcbiAgICByZXR1cm4gaSAqIDE2MDkuMzQ0O1xuICB9XG5cbiAgc3RyaW5naWZ5SnNvbihkYXRhKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICB9XG4gIHBhcnNlVG9Kc29uKGRhdGEpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcbiAgfVxuXG4gIFJvdW5kKG51bWJlciwgcHJlY2lzaW9uKSB7XG4gICAgdmFyIGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xuICAgIHZhciB0ZW1wTnVtYmVyID0gbnVtYmVyICogZmFjdG9yO1xuICAgIHZhciByb3VuZGVkVGVtcE51bWJlciA9IE1hdGgucm91bmQodGVtcE51bWJlcik7XG4gICAgcmV0dXJuIHJvdW5kZWRUZW1wTnVtYmVyIC8gZmFjdG9yO1xuICB9XG5cbiAgZ2V0QXRhbjIoeSwgeCkge1xuICAgIHJldHVybiBNYXRoLmF0YW4yKHksIHgpO1xuICB9O1xuXG4gIGdldEljb25VcmwoY29sb3I6IHN0cmluZywgc291cmNlTGF0OiBudW1iZXIsIHNvdXJjZUxvbmc6IG51bWJlciwgZGVzdGluYXRpb25MYXQ6IG51bWJlciwgZGVzdGluYXRpb25Mb25nOiBudW1iZXIpIHtcbiAgICB2YXIgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQTNaSlJFRlVhSUh0bDExSVUyRVl4Lzl2dVZxUWF4ZUI2d3YwS3NjSUY0RzBicG9hWm5XemhWcGRWRXAxRVJybXBDaHZNZ2pySWhUNm9LQlo2RVhVQXVlTmFGSDBRVFN4eUFXVlhSUXVQMUF2c3UzTTVuSGFuaTdjbHVuWng5bG1DTDYvcTNQTzgvS2MvLzk1dndFT2g4UGhjRGdjRG9lelZHR3BTRUpFYWdCVnFjZ2xnWXN4MWh3cG1KWnNkaUpTQnlqd1ljejNjKzJ3WjhTZmJMNjViRm12VXhPUmtURldMaFdYM1FQQmF1OEVvQTkrMGs5TWlmdTJYZDJwRUVRaENhblNXUElxWVRGV0FFQVdZOHcxTnk2ckI0aW9hanJ3KzFMYXN1V3IrMzcwajQ5UGVxY3pWQmxLMTloM3RoRGlBY0RoNmdaUUFRQ1pBQkkzUUVUM0FKUmRlM1ViVmtjTEJGRllEY3hVYUVkbWJvcmt5aWN1QXlIeGxyWmEySHJzQ3l4SkhzdGlOVmpNNG9FWUJoYTdlQ0NLQVNJeVlwR0xCNkxNZ2NscC81blgzOTVNMlhyc2l2OHBTQzRSRGF4TVc3RzN2ZmRKWEVuU2xla3BFelNYTlVwVjFIalVWV2pBUFJUekI0TG9oVTZUalJLOUthNzJjaW5PTVlVZW5WTHhwSThTdGg0N1N2VW1OSm92SjVzcUd0V01NYmRVSUdrRGdpaWc4SllaaHF6VWIyYWxlak5LOUNZZ1F2V0JKQXpvTkZwOEd1a052enY2dWhOTk5TOVhDRU1jTzd3c0F5cWxDZzJtZWhScEM4TGZHcDdmUU1PTG0zTFNoRG0yL1FocThpcWhDaTRDRGxjM0xQWmFXWE5KbG9HbVE5ZXhTYjBSeHgrY2drY1VvTk5vVVdPc3dKcFZLbHpva0RjSGpodU9vcTdvSEpxNld0RDU1UmtBb01aWUNWdDVNM2JmMm85NEQ0Y1JEWWpUNHFoT284MElEWTBpN1M0WU1uTmhhTndWcnBDanJ4dUQ3aUZZRDE2SDFkRWlxM0lXWXdVZU9kditNVjdjZHdSZDFjOVF1dFVNcTZNWk9ldDBVd0FVa0RpRnhqU2dURlBlUHB0ZlZldVo4Q2dHM0VNbzNKeVBMdGZiZVNJN2U1OENBQXF6Q3lUSHNSUTZqUllxWlRwc3p2azd2TTFweCs3c2ZCQVJDalliRlFCZVN0MERZaHBnak5VUmticlJmRGw4VlJ6eGp2b0JySmpkVGhYY2FDN3VPUitYK05sSWJWS2IxQnRtZW5wbUFyOEVZSnJYYUxiT2VINUVSSHJNWENqc2RaMVhZSFg4dmFJMm1PcFJ1dFVNQUdZQWttdTFGT09UdmdPRDdzRVQrKzhlWGg0YTd6cU5GbzlQdG9hRlIxcjdFNGFJeW9pSVBnNzMwcDAzemRUL2M1Q0NsQ1dRU3kySTNxL0NoQkI0K0w2Vk9qNC9KU0tpUUNEZ0NSWnNZU0Fpb3pnMTJmN2oxNWpUNTUrNEh6eTFKcHBMVFVTblBhTDNuYy92NnlLaXV1Q2RtOFBoY0RpY3BjRWZrM2VBTGJjMStWUUFBQUFBU1VWT1JLNUNZSUk9XCI7XG5cbiAgICBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcImdyZWVuXCIpIHtcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEzWkpSRUZVYUlIdGwxMUlVMkVZeC85dnVWcVFheGVCNnd2MEtzY0lGNEcwYnBvYVpuV3poVnBkVkVwMUVScm1wQ2h2TWdqckloVDZvS0JaNkVYVUF1ZU5hRkgwUVRTeHlBV1ZYUlF1UDFBdnN1M001bkhhbmk3Y2x1blp4OWxtQ0w2L3EzUE84L0tjLy85NXZ3RU9oOFBoY0RnY0RvZXpWR0dwU0VKRWFnQlZxY2dsZ1lzeDFod3BtSlpzZGlKU0J5andZY3ozYysyd1o4U2ZiTDY1YkZtdlV4T1JrVEZXTGhXWDNRUEJhdThFb0E5KzBrOU1pZnUyWGQycEVFUWhDYW5TV1BJcVlURldBRUFXWTh3MU55NnJCNGlvYWpydysxTGFzdVdyKzM3MGo0OVBlcWN6VkJsSzE5aDN0aERpQWNEaDZnWlFBUUNaQUJJM1FFVDNBSlJkZTNVYlZrY0xCRkZZRGN4VWFFZG1ib3JreWljdUF5SHhsclphMkhyc0N5eEpIc3RpTlZqTTRvRVlCaGE3ZUNDS0FTSXlZcEdMQjZMTWdjbHAvNW5YMzk1TTJYcnNpdjhwU0M0UkRheE1XN0czdmZkSlhFblNsZWtwRXpTWE5VcFYxSGpVVldqQVBSVHpCNExvaFU2VGpSSzlLYTcyY2luT01ZVWVuVkx4cEk4U3RoNDdTdlVtTkpvdko1c3FHdFdNTWJkVUlHa0RnaWlnOEpZWmhxelViMmFsZWpOSzlDWWdRdldCSkF6b05GcDhHdWtOdnp2NnVoTk5OUzlYQ0VNY083d3NBeXFsQ2cybWVoUnBDOExmR3A3ZlFNT0xtM0xTaERtMi9RaHE4aXFoQ2k0Q0RsYzNMUFphV1hOSmxvR21ROWV4U2IwUnh4K2Nna2NVb05Ob1VXT3N3SnBWS2x6b2tEY0hqaHVPb3E3b0hKcTZXdEQ1NVJrQW9NWllDVnQ1TTNiZjJvOTRENGNSRFlqVDRxaE9vODBJRFkwaTdTNFlNbk5oYU53VnJwQ2pyeHVEN2lGWUQxNkgxZEVpcTNJV1l3VWVPZHYrTVY3Y2R3UmQxYzlRdXRVTXE2TVpPZXQwVXdBVWtEaUZ4alNnVEZQZVBwdGZWZXVaOENnRzNFTW8zSnlQTHRmYmVTSTdlNThDQUFxekN5VEhzUlE2alJZcVpUcHN6dms3dk0xcHgrN3NmQkFSQ2pZYkZRQmVTdDBEWWhwZ2pOVVJrYnJSZkRsOFZSenhqdm9CckpqZFRoWGNhQzd1T1IrWCtObEliVktiMUJ0bWVucG1BcjhFWUpyWGFMYk9lSDVFUkhyTVhDanNkWjFYWUhYOHZhSTJtT3BSdXRVTUFHWUFrbXUxRk9PVHZnT0Q3c0VUKys4ZVhoNGE3enFORm85UHRvYUZSMXI3RTRhSXlvaUlQZzczMHAwM3pkVC9jNUNDbENXUVN5MkkzcS9DaEJCNCtMNlZPajQvSlNLaVFDRGdDUlpzWVNBaW96ZzEyZjdqMTVqVDU1KzRIenkxSnBwTFRVU25QYUwzbmMvdjZ5S2l1dUNkbThQaGNEaWNwY0VmazNlQUxiYzErVlFBQUFBQVNVVk9SSzVDWUlJPVwiO1xuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcInJlZFwiKSB7XG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBMHhKUkVGVWFJSHRsejFzRW1FY3hwOVhoQlFEaFJBL01DU05UVXk4dEVzWFhFc2djZEFCcW9PVHBBNHVrS0FPeHNZdURrSjByZEhvMUpRbWJnWWNYUHhLbkRUZ1VBZHRtelN4SVVDS1JDd2VvUVY2OTNlQXUyaDdCUTVhMDhUM054MzNQNTU3bnZmcjNoZmdjRGdjRG9mRDRYQTQveXRzTDBTSXlBN2crbDVvYWJES0dKdmJyWGk0WDNVaXNrT1dQMi85L0htMFhpalUrOVhienBHUkVUc1JlUmhqVjdYcXVudWcxZHJqQU1aYXQ4Ymt6YzBMWHp3ZW95U0tmVmpWeGhrT3d4a0tBY0F3WTJ4MWUxMVhEeERSZFpLa2U4eGdzTlF5bVlwVXFXeVpqaDhmcUdVeWJEL01BMEFsblZZdVR3SG9QUUFSelFLWUxEeDlpbUk4RGtrVUxVQ3poU3h1OTE1NDdZbXVBaWptTTlQVEtDV1QrMnhKSDRjNlBYQ1F6UU1kQWh4MDgwQ2JBRVRrd1FFM0Q3U1pBMVN2M3hJL2ZHaVVra25qdnpTa2wxMERNSlBwL1BxclYxMkpHS3pXUFRPa1Y3dnRLbFRQNXp1K1FCSkZtQVVCRHIrL3ErZjE0dkQ3bGNzRnJYcmZXNGxTSWdGSElJQ2hXS3hmcVhiY1pJeXRheFg2RGlDSklwWXZYb1RsN05sK3BYYmdDQVNVSHRCc2ZhQ1BBR1pCd01iU2t2cTdra3IxS3JWRFM2R2JMN3l1QUFhckZVUFJLR3crbjNwdjdkRWpyRDErckVkRzVkaVZLM0NHdytwRXJhVFR5RXhQbzU3TGRhMmhLOER3dzRjd3VWejRGb21vazljWkNzRXdPSWpjL2Z2NnpBZURjTjIramVMOFBNcnYzZ0VBbktFUVRzL09Zdm5TSlhTN09kdzFnTHk1V1RBTHdnbGxhTmg4UGxqY2JudzlkMDV0b1VvcWhYb3VoK0daR1JUbjUzVzFuRE1VUXVuRmk3K0NyNlJTR0huOUdvNkpDUlRqY1J3WkhXMEFNRUpqRjlveHdLR0JnU2NuSTVFN1VybHNyT2Z6c0htOXFLVFRPMHlXMzc1dEJ2UjZOY2V4Rm1aQmdNRnExZnpDbDVKSjJMeGVnQWlENCtOR0FPKzF6Z0VkQXpERzdoS1JmU2dXVTQrS2plYUp5L1RuYzhyNGRVMU5kV1ZlNjc5L1luSzVZSEc3bFFuOEhrQ2duVVpYSnpJaUdrUHpRSkhJUFhpQVlqeXUxb2FpVVRnQ0FRQ1lBS0M1Vm1zaFY2dVhhOW5zdFpWZzBLQ01kN01nNE16ejU2cngzZGIrbmlHaVNTS2k2dUlpZlorYm8xbzJTeTBtZTlDeVM2SzRzdlhybC93amthRDFOMithU3JKY2JqWFkva0JFSHJsV2U5a29sUmFralkxbnJWMXJyMXAySXJvaGllS25yV3IxSXhIZGJaMjVPUndPaDhQNVAvZ05xaHgvNnJzdWpqZ0FBQUFBU1VWT1JLNUNZSUk9XCI7XG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwieWVsbG93XCIpIHtcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUF5aEpSRUZVYUlIdGx6MU1VMUVZaHQvdlloV05hWnRnaEFHTm1JQ0pWbUZ3TUNGUkhFd0VFOFZKbk1SQm5SUWR5Z0FPRHJyb1lDSUx1QmdXWWRQRXlHUml4QlFjSENEK0RLaEFXaU00MUhnSmxKL2JudGVodC9XbnR6KzNCVVBDZWFiZSs1MjhmYi92bkh2T2R3Q05ScVBSYURRYWpVYXpVWkhWRUNIcEI5Q3hHbG9PVEl0SWY3YmdwbExWU2ZwQk5RN3J4dzRzZmxzcFZTOEQzeUUveVNZUnVlZ1VkajBEZHJXUEFXaXdYelVnc1hncThlS2dCNVpaZ2xObnBLNFRSbDBRQUdwRVpQcmZ1S3NaSU5rQnhtOURObTFIYkhJZTFud2M1VlhsWEppVXRUQVBBSWlHQUFRQllBK0E0aE1nK1FoQXUvcDBINXpxQXl4ek81Q3NrRlEwcnBKYjl4U1VRTW84eDYrQmtZRTF0dVFPSTkrQVA4MnJkV1lleUpQQWVqY1A1RWlBWkJQV3VYa2cxemVRV0E0eU9teXB5SURuUC9weFRmWUV5cmEwWU9aWllTb2U3eXJaY2RMMjVRem4zSVVZQytmVmw3Z0o4UVlndTlxQUFzYTdSYXJQcFg2T09jVkxiaVZVWkJCRzlYa1k5VDJsU3VYaWhvajhkQXFVbkFBc0UycTRhVTBPTTZsdVM4NXNsdW9ESlNRZzNnQTQ5ejc5ekdpb1dLa01yVFFWalhtYk5YY0plSHd3Nmg5QXFsclNyemh4RjJyaW5pdVpGRWJOWlVoZFovcERaVFFFamw4cjZOdEw0U29CNDNBL1pOdHVxTGNYQU11RStBS1EyazZJeHc5KzZIWm5mdThWeVA3YlVGTVBnZGtoQUhibmVlUXBFcStQbzlEbU1QdEpuRmo2THI1QStsR3FXaUFWalZDanJlRHNFQmdOUVUzMlFZMWZUVlp5MjI1WENVaHRFSXdNZ2grNms1V1BocUJHendBQ0dNbDFEL0UzV1Bid2pDNDBSWTV6b0x4WDluVjFpV1Y2RUF0REtwdkI2RWpHOURKVnZjcVRnTk02ZGpMdkRRQWVIL2gxTUNPbUlvT1F5bVlZSkdUbkNRK0FWMDczZ0x3SmlNZ3RrbjZqdnVmM1ZYRnBaZ1hBNXI4RzJ1dFhEdHh4Znp0eU9LUms2NjdranBiYzFWNEJhTTBsVWRCL2tteEE4a0x4aEI5dlFrMzJwV05HZlU5cXF6c0x3SEd2ZGlReGY0Nng4Q1UxY3Jvc3RkN0ZHNEJ4OUdYYWVMYTl2MmhJdHBPa010OHg4YVdYWEFqVHByMElMVDlYNWo3VE1wVUtEMUROUExlbGxHa1hiRzBnMmNUNDBuTXVSOGNZanoyMnU5Wml0ZndrcjNQRmZNdjR3aHVTdCt3N3QwYWowV2cwRzROZlRpeGtmRnh5WFBFQUFBQUFTVVZPUks1Q1lJST1cIlxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcInB1cnBsZVwiKSB7XG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRjYybFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd015MHdNMVF4TVRvME1Eb3pOeTB3TlRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURNdE1ETlVNVEU2TlRNNk1qVXRNRFU2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURNdE1ETlVNVEU2TlRNNk1qVXRNRFU2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVRsaFlUWXhaR1l0WTJWaE5DMHdZelF5TFRoaFpUQXRaalkxWlRkaE5XSXdNakJoSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZNVEk0Tm1ZelpHVXRaRGRqTlMxa1pUUm1MVGc1TkdZdE1XWXpPRGsyWW1NNVpqRmtJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZZVGRrTkRSbU4yRXRNakpsWXkxaE9EUTBMVGxtT1dJdE1UQTNZakZoTldZMk9UY3lJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwaE4yUTBOR1kzWVMweU1tVmpMV0U0TkRRdE9XWTVZaTB4TURkaU1XRTFaalk1TnpJaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1ETXRNRE5VTVRFNk5EQTZNemN0TURVNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPbUU1WVdFMk1XUm1MV05sWVRRdE1HTTBNaTA0WVdVd0xXWTJOV1UzWVRWaU1ESXdZU0lnYzNSRmRuUTZkMmhsYmowaU1qQXhPQzB3TXkwd00xUXhNVG8xTXpveU5TMHdOVG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOEwzSmtaanBUWlhFK0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0lEd3ZjbVJtT2xKRVJqNGdQQzk0T25odGNHMWxkR0UrSUR3L2VIQmhZMnRsZENCbGJtUTlJbklpUHo2UlEyY1hBQUFDUzBsRVFWUm8zdTJZdlVvRFFSREg4d2g1Qk45QUg4REMya1lyV3dYdDFWN1JXaHU3bElLS1dDa3FOb0tvb0tCRUpTREVEMHdSalNTU2NHTGlKV1p6ZCt2K3o5dXdoSHhlOXVDRUdSaENObmV6ODV1ZG5aMU5oSE1lK2M4YUlRQUNJQUFDSUFBQ0lBQUNJQUFDSUFEdEFMMkllRDRxZENrZ25WVG0wUThBNXgyYnA4c0ZaaGFTMzUrNmxmL0p1allBTDlwalNvVDJhaFdiN1F6ZjhvM0JhKzJhaUdVOEJqN1FONEFZbjdVdHB3UnJ4ZGRLQ1JFcTUxbmw0NjVZQzhKNTZQSE1nd1FZNlFzQXl3Z3JpSWdhYlh6UHhyOTRxQUdrODVlTHFhWkxIR3FBZHM2SEhxQ1Q4NkVHOEY1bzYzeW9BZXlxYy9SMi9zbTZLWE5oWFlHTzBaY0F4cU1aR01EcC9MTi9BTkIzbWlDK21uYXRYeXlrK1BIMGczWjlQVEVrUURRUUFKd0p4cFBKQTVhNW5sdUpiZ0hVWE5XdHFZTjhQWDIwQXh4TzNHdkw4MWEybEQ1SUR3RFNSY2xKTGxzTHY0N0hWOUs4V3F6VmJhR2E3WTRtZ2dQQUJLWDNIN2N5NERkc1lEaVEzTXIyN3J5MytmR3VUQm5YZnVhbjNtdjFCU0JhNUJ3bWFTeG5hb1RhalhkU2dDUEhHOGNSSURrdnppSFpTdnRaZ2VWYTJXYXlQTDdzNTFzZVdCQ2tRN2VsRWMrMjJtUHlZSlRQQ0RuemZTTVRuMnRxdnB1NWFyVlpHZlVyV0wxR2UwcmxjWjFIL2UvN1NpbStEd2tkZHlPdHBCVVVLK1BKdUhkYWRxWE10R0xHczJtcGR3dFVvMmFPYTdzVGkvRXBXRWZya056TXVodk9rNmxJandJSFdjbDZFWHZCUVJEcTFjM2hYd2hZaTNlMDNJbEgwT2hWREpZUUczMWJWZ2cvNHJVSGN3TGtocFd0Syt5N1pwSDNCVUIvYkJFQUFSQUFBUkRBZjlCZlJiNjRLWWZsUkxBQUFBQUFTVVZPUks1Q1lJST1cIlxuICAgIH1cblxuICAgIHJldHVybiBpY29uVXJsO1xuICB9XG5cbiAgbG9jYXRlcHVzaHBpbihvYmopIHtcbiAgICBjb25zdCB0cnVja0lkID0gb2JqLnRydWNrSWQ7XG5cbiAgICAvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBwaW5zIGluIHRoZSBkYXRhIGxheWVyIGFuZCBmaW5kIHRoZSBwdXNocGluIGZvciB0aGUgbG9jYXRpb24uIFxuICAgIGxldCBzZWFyY2hQaW47XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmRhdGFMYXllci5nZXRMZW5ndGgoKTsgaSsrKSB7XG4gICAgICBzZWFyY2hQaW4gPSB0aGlzLmRhdGFMYXllci5nZXQoaSk7XG4gICAgICBpZiAoc2VhcmNoUGluLm1ldGFkYXRhLnRydWNrSWQudG9Mb3dlckNhc2UoKSAhPT0gdHJ1Y2tJZC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIHNlYXJjaFBpbiA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBhIHBpbiBpcyBmb3VuZCB3aXRoIGEgbWF0Y2hpbmcgSUQsIHRoZW4gY2VudGVyIHRoZSBtYXAgb24gaXQgYW5kIHNob3cgaXQncyBpbmZvYm94LlxuICAgIGlmIChzZWFyY2hQaW4pIHtcbiAgICAgIC8vIE9mZnNldCB0aGUgY2VudGVyaW5nIHRvIGFjY291bnQgZm9yIHRoZSBpbmZvYm94LlxuICAgICAgdGhpcy5tYXAuc2V0Vmlldyh7IGNlbnRlcjogc2VhcmNoUGluLmdldExvY2F0aW9uKCksIHpvb206IDE3IH0pO1xuICAgICAgLy8gdGhpcy5kaXNwbGF5SW5mb0JveChzZWFyY2hQaW4sIG9iaik7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihsb2NhdGlvbiwgdXJsLCByb3RhdGlvbkFuZ2xlLCBjYWxsYmFjaykge1xuICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuICAgICAgdmFyIHJvdGF0aW9uQW5nbGVSYWRzID0gcm90YXRpb25BbmdsZSAqIE1hdGguUEkgLyAxODA7XG4gICAgICBjLndpZHRoID0gNTA7XG4gICAgICBjLmhlaWdodCA9IDUwO1xuICAgICAgLy8gQ2FsY3VsYXRlIHJvdGF0ZWQgaW1hZ2Ugc2l6ZS5cbiAgICAgIC8vIGMud2lkdGggPSBNYXRoLmFicyhNYXRoLmNlaWwoaW1nLndpZHRoICogTWF0aC5jb3Mocm90YXRpb25BbmdsZVJhZHMpICsgaW1nLmhlaWdodCAqIE1hdGguc2luKHJvdGF0aW9uQW5nbGVSYWRzKSkpO1xuICAgICAgLy8gYy5oZWlnaHQgPSBNYXRoLmFicyhNYXRoLmNlaWwoaW1nLndpZHRoICogTWF0aC5zaW4ocm90YXRpb25BbmdsZVJhZHMpICsgaW1nLmhlaWdodCAqIE1hdGguY29zKHJvdGF0aW9uQW5nbGVSYWRzKSkpO1xuXG4gICAgICB2YXIgY29udGV4dCA9IGMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgLy8gTW92ZSB0byB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZShjLndpZHRoIC8gMiwgYy5oZWlnaHQgLyAyKTtcblxuICAgICAgLy8gUm90YXRlIHRoZSBjYW52YXMgdG8gdGhlIHNwZWNpZmllZCBhbmdsZSBpbiBkZWdyZWVzLlxuICAgICAgY29udGV4dC5yb3RhdGUocm90YXRpb25BbmdsZVJhZHMpO1xuXG4gICAgICAvLyBEcmF3IHRoZSBpbWFnZSwgc2luY2UgdGhlIGNvbnRleHQgaXMgcm90YXRlZCwgdGhlIGltYWdlIHdpbGwgYmUgcm90YXRlZCBhbHNvLlxuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCAtaW1nLndpZHRoIC8gMiwgLWltZy5oZWlnaHQgLyAyKTtcbiAgICAgIC8vIGFuY2hvcjogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDI0LCA2KVxuICAgICAgaWYgKCFpc05hTihyb3RhdGlvbkFuZ2xlUmFkcykgJiYgcm90YXRpb25BbmdsZVJhZHMgPiAwKSB7XG4gICAgICAgIGxvY2F0aW9uLnNldE9wdGlvbnMoeyBpY29uOiBjLnRvRGF0YVVSTCgpLCBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludChjLndpZHRoIC8gMiwgYy5oZWlnaHQgLyAyKSB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gcmV0dXJuIGM7XG4gICAgfTtcblxuICAgIC8vIEFsbG93IGNyb3NzIGRvbWFpbiBpbWFnZSBlZGl0dGluZy5cbiAgICBpbWcuY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJztcbiAgICBpbWcuc3JjID0gdXJsO1xuICB9XG5cbiAgZ2V0VGhyZXNob2xkVmFsdWUoKSB7XG5cbiAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0UnVsZXModGhpcy50ZWNoVHlwZSlcbiAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgIChkYXRhKSA9PiB7XG4gICAgICAgICAgdmFyIG9iaiA9IEpTT04ucGFyc2UoKHRoaXMuc3RyaW5naWZ5Qm9keUpzb24oZGF0YSkpLmRhdGEpO1xuICAgICAgICAgIGlmIChvYmogIT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGlkbGVUaW1lID0gb2JqLmZpbHRlcihlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZmllbGROYW1lID09PSAnQ3VtdWxhdGl2ZSBpZGxlIHRpbWUgZm9yIFJFRCcgJiYgZWxlbWVudC5kaXNwYXRjaFR5cGUgPT09IHRoaXMudGVjaFR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChpZGxlVGltZSAhPSB1bmRlZmluZWQgJiYgaWRsZVRpbWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICB0aGlzLnRocmVzaG9sZFZhbHVlID0gaWRsZVRpbWVbMF0udmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgfVxuXG4gIHN0cmluZ2lmeUJvZHlKc29uKGRhdGEpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhWydfYm9keSddKTtcbiAgfVxuXG4gIFVUQ1RvVGltZVpvbmUocmVjb3JkRGF0ZXRpbWUpIHtcbiAgICB2YXIgcmVjb3JkVGltZTtcbiAgICB2YXIgcmVjb3JkZFRpbWUgPSBtb21lbnR0aW1lem9uZS51dGMocmVjb3JkRGF0ZXRpbWUpO1xuICAgIC8vIHZhciByZWNvcmRkVGltZSA9IG1vbWVudHRpbWV6b25lLnR6KHJlY29yZERhdGV0aW1lLCBcIkFtZXJpY2EvQ2hpY2Fnb1wiKTtcblxuICAgIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdDU1QnKSB7XG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ0FtZXJpY2EvQ2hpY2FnbycpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXG4gICAgfSBlbHNlIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdFU1QnKSB7XG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ0FtZXJpY2EvTmV3X1lvcmsnKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnUFNUJykge1xuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdBbWVyaWNhL0xvc19BbmdlbGVzJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ0FsYXNrYScpIHtcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignVVMvQWxhc2thJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcbiAgICB9XG5cbiAgICByZXR1cm4gcmVjb3JkVGltZTtcbiAgfVxuXG4gIGFkZFRpY2tldERhdGEobWFwLCBkaXJNYW5hZ2VyKXtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5VcGRhdGVUaWNrZXRKU09ORGF0YUxpc3QoKTtcbiAgICB2YXIgaW5pdEluZGV4OiBudW1iZXIgPTE7XG4gICAgdGhpcy50aWNrZXREYXRhLmZvckVhY2goZGF0YSA9PiB7XG4gICAgICB2YXIgdGlja2V0SW1hZ2UgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBdENBWUFBQURjTXluZUFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBT3hBQUFEc1FCbFNzT0d3QUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU5PU1VSQlZGaUZ6WmxQU0JSUkdNQi8zOXRNQ0NOM055M0lMbEdDL1RsWVVPQ2ZUWUl3SVNqd1ZuVHBWSFRKZzFFZ0NkVkZxMXNSSFNMb25JZTZXRkdrcTdzVkZFaGhtdVd0UDRUTWlpaUZ1ak92UTZNNzZxdzY3cmpqN3pidmZmTjlQeDZ6Tys5OUk2d0EzVUNoTVU2dENMVmFxQlNMWFFoYmdDSTdaQUxOYnhHR05QUnBpRWVMNkpWT0pyM1dFaS9Cb3pFcUxZc0xDSTFBc2NkYW8wQ0hNcmtiVHRMbnEyQ3FqcjNhNUJaUTcxRXFXOVZPVEpxakNmcVhEbDBFdllmMXFRZzNnQ1pnblM5eUdkSmF1QjAxdUNyOVRIa1dOT29vRTVNbkd2YjdMRGJmNEwyZTV1VG1OL3h3bjNhVHEyWVBJWjZqMmJhcWNobStBL1hSSGo3UG4xZ2dPRkpEdVJLNmdhMzVNSFB3eXd3UksrM2ltM053anVCSU5SdVY0aDFRa1ZlMURFTlN5TUhJUzhabUJwUnpWaWtlRXB3Y1FMbWU1TDV6WUhZRmpWb2FnY2Q1VjNMQkVrNlV4SGtLdHFBK1FFRnFBNFBBamtETmJBUytoVU5VU0JkcEJXQnM0RFJyUkE1QXcwNGp6U213bjBHQjg4RXFMVVNFY3dCaS82MThDVnJJalpESlRpWGkwL3QxRmJBVTlVcWdLbWlSYkZoUXJZRGRRWXRrUmFoUVFGblFIb3RRcHNqc2d0Y2NBcHNVZU4rRzU1Ry9DdmdadE1VaS9GUUN2NEsyV0lRZnlvS0JvQzJ5SVRDb2dCZEJpMlJGODF6c1Rhb0JGQVR0TTQ4cE0wUlVsU1FZWncydW9zQ3owaTRtRklBUzJvTVdjcUVkN08xV09FNGNTQWFxNDBUVEUra2hBYzR6aWRBTW1FRTVPVERSWEpxNW1CV014a2xxemMxZ25ESUl0RVVUdkhWY1o5QU5GSTVPa0Z6MWJrSVdCRDZFVTFRNVd5RnpqcDNTeVdRQkhJT0ZKL3c4TUpRT2NYeCtuOGE5OVZGSEdTYmQ1T2tncFdGWVc4UktFZ3YzQmNydGhtZ1gzd3RDSEVMb1hIMDlYcGxUVkx2SndWTHROMUJHTFpjRldvSDFQb3ROaWRBYWp0TW1vTE1GTGF1QmFjVFlEclNnT1V2dWZVSUxvU09VNWtweGt1R2xnajIxZ0VkcUtGZHd4bTRCZSszaERLRHBNQldQU3VOOFhlNU5uZ1NkcEdMczA1cHVJTHhFNktnSWh5TnhQcTJranV1UFpEbllCYTh2SS9UYVN1VWdCMEdBeUIvdUFFUFo1alVNUjRxNGwwdU5uQVRsQTlQVy8zZTRlM0pOMDBxK2pjeXBrY3ZOTXhnMXZFQTRPaWV4NW5Xa2x5TzU1czVwQldmUk5BRnB4NGlKY05HUDFMNEkyaDlrSHM0T0NBOGlQWHowSTdjL0t3aE1tN1FBWThDNHFXajFLKzgvZGtqbGZmZTAxNjhBQUFBQVNVVk9SSzVDWUlJPVwiXG4gICAgICBpZihkYXRhLnRpY2tldFNldmVyaXR5ID09PSBcIlVua25vd25cIiB8fCBkYXRhLnRpY2tldFNldmVyaXR5ID09PSBcIldhcm5pbmdcIiB8fCBkYXRhLnRpY2tldFNldmVyaXR5ID09PSBcIk1pbm9yXCIpXG4gICAgICB7XG4gICAgICAgIHRpY2tldEltYWdlID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUN3QUFBQXpDQVlBQUFEc0JPcFBBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFQeVNVUkJWR2lCN1poUGlCdDFGTWUvN3lYVDFkM0ZRaEdLZUtub0t0anNXbWx2eFJhaDlxTFZTNmRKWm9PdUJ3K1dRaS8xdEljV3ZPaVdzbFM5dUFlSmF5YS9iSU1IS1lxb2h4UVVRWWhhTnBXeVdGQldvaTMwb0NoMU41UGY4N0Ria0oxTUpwT2RaQkt3bjF2ZTcvMSs3NU5oNXZlUHNBMU0wOXhoR01aQkFJY0FQQTNnQ1FDN0FZeHZwdnhOUkgrSXlBcUFINWo1eXVqbzZEY0xDd3UxN2RScmhycEpUcWZUZTRub0ZJQVRBSFoxV2VzMmdFdEU5SjV0Mno5MTJiZEJJT0ZrTXZsNExCYWJBL0JpMEQ0K0NJQlBtUG1OWEM3M2M3ZWRmWXVicGhtTHgrT3pSRFFMWU1kMkRkdXdKaUp2T283elZyRllyQWZ0MUZZNG5VNC9TRVFmWStNOTdSc2lVaklNNC9qaTR1THRJUG1ld3FsVWFnOHpmd0Znb3FkMjdWa0JjRFNmei8vYUtiRkZPSjFPN3lhaUs5ajQ4cVBrQmpNL2s4dmxmdmRMNHVZZk16TXo5eEhScDRoZUZnQWUxVnAvWnBybS9YNUpXNFRYMTlmbkFlenZxNVkvK3d6RG1QTkxhTHdTbG1VZEFsQkMrR2tyTEZwRURpdWx2dlpxdlB1RUNjQkZERjRXQUppSTV0SEdoUUVnazhrY0E3QXZTcXNPSEppZW5uN2VxNEVCUUd0OU1scWZ6b2pJNjE1eHltUXlEMm10VndIRUluYnFSRjFFSGxaSzNXd09zb2djeGZESkFodE96N21EckxYdTY5SWJCaUk2N0k0eE0rOGRoRXdRaU9oSmQ0eEZaTThBWEFJaElvKzRZd3hnNXdCY2d0TGl4bDVaUTBTTEh3TzQ2WkU0TEZUZEFmWUtEaEdld2gwM3pRT2t4WTAzTit0RGlZaVUzREd1MSt1ZkQ4QWxFQ0x5bFR2R2hVTGhGd0RYbzlmcHlMVk50eTB3QUlqSXU1SHJkT1lkcnlBRHdNakl5QWNZcnVudFZxMVcrOGlyZ1FFZ204MytDMkErVWlWL3poZUx4VHRlRFkyVnBGcXRYZ0R3WFdSSzdmbCtmSHo4WXJ2R2huQ3BWSEpFNUJVQW52OHNJdFpFNUdXL1c4NHRhN1ZTNmpxQTF3RG9mcHQ1b0VYa1ZhWFVOYitrbHBQRzh2THljaUtSV0NXaVh0eFVCa1ZFNUtSU0t0c3AwZk5vVktsVWZweWNuTHdGSUlyajA3cUluRkpLdlI4azJmY0pwbEtwQTh4OENVRExScnBIL0NZaUo1UlMzd2J0NFB2MEtwVktOWkZJMkVUMEFJQ25PdVYzUVEzQVFqd2VUOXEydmRKTng4RHZhQ2FUZVV4cmZRN0FjUUFqM2ZrMVdDT2lvdU00NTVhV2xtNXNaNEN1UHlyVE5IY2FodkVDZ0NTQVl3RzdYUWF3UkVTWGJkditxOXVhellTYUJTekwraExBRWI4Y0VTa3BwWjROVTZlWlVHYzZaajREL3psYkU5R1pNRFZhYW9icG5NdmxyZ0pZOUVuNU1KL1BsOFBVY0JQNjFLeTFuZ1h3ajBmVEhhMzEyYkRqdXdrdFhDZ1Vxa1Iwd2FOcHJsQW9ySVlkMzAxUDdpWEd4c2JlQnRBc1Y0M0ZZdWQ3TWJhYm5pd0U1WEs1TmpVMTlTZUFsd0JBUkU3YnR0MlhyV3JQYm40bUppYXlBTW9pY3RWeEhMOFBjWGl3TE91SVpWbSs4L0k5N3ZGLzV6L2Qwam9FUHpoWkdnQUFBQUJKUlU1RXJrSmdnZz09XCJcbiAgICAgIH1lbHNlIGlmKGRhdGEudGlja2V0U2V2ZXJpdHkgPT09IFwiTWFqb3JcIil7XG4gICAgICAgIHRpY2tldEltYWdlID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUN3QUFBQXpDQVlBQUFEc0JPcFBBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFPeVNVUkJWR2lCN1poTmFCeGxHSUNmZDJaTmFsc29pRkJVaExiWlRmcHpNTkxnUVRGRnFMMW9QWlY0VVp2ZHBKVFdIdXNwZ2dFdm1sSkNWZENnNXNjaVlzU0Q5Q0xxSVlHS0lMYmFRMnE3M2EyR2x0Z0tCUlZObXV6T3ZCNFMwODNzek96TXp1N3NnbjF1ODM3djkzMFBIN3Zmenl0VXcrUk1Dd3V0VDJCck4vQW8wQUZzQmphdVpQeU5jZ01oQy93SVRMUDA1N2NjN2lwVU5WOEpFaXA3L01vdVZJNkI5Z0QzaFp6ckZzSWtOdStRU1YwTTJYZVZZTUlUK1hac2V3aDRMbkFmYnhUNEFrdGVvVCtaQzl2WmYvSkpOWm5QRGFBTUFDMVZDbnF4aU1qcnJHOTdneDZ4Z25ieUZoNjVmRDh0eHVkQWR5M3NmSmpDS0I3ZzRJNWJRWkxkaGNkKzNnS0pyNEJVRGNYOHlHS1orK2pmTmxzcHNWejQvYXViU2RqVG9CMTFVZk1tVDZMd0pDL3UvTTB2YWEzdzJDL3JvSGdXMkYxUE14OStZc082eCtsNWVNRXJ3Vmo3YVEzVE9GbUFUdVp2RC9rbDNGbmg4V3czS2xORTM3YWlZbU1iZStock8rdld1THpDcW9MS0tSb3ZDMkJnMnNPb3Vyb3NDMC9rOWdPZGNWcjVvblF4ZHVVWnQ2YVZGZVpvckVKQkVJNjRoMDlmZklEaVBkY0FNMmFsU2xnVXpZYzR0TzFtYWRDZzBMS1A1cE1GTURHdHA1MUJBOUY2SDczVlk3Q25QQVM3R3FBU0RHV25NMlFBVytJM0NZcHNkVVlNWUZNRFRBS2laVzZHVzFvVFVlWm5BRGRkRXB1Rk9XZkFRTXVEVFlPb2k3Qm94VXR6dzFBcGN6T0E2UWFvQkVPWmNvWU1zTDVzZ0Vvd3BQaU5NMlNRM3ZFcmNDbCttNHJNckxpdDRiOXQ0KzE0WFFJZzhwWmJlRVU0TVVwemJXKy9zNzcxdEZ2RHNuQjY2MjFnT0U0algxUk9lRDFFNzV3a3M5ZFBBdC9INWVURGVRcC9uUEpxZER6ekwyOEg0enh3YjcydFBGaEUyRTF2YXNZclllMVpuZTY0aEhBSXNPdHQ1b0tOYXRwUEZ0d3VQNzJwajFIdFo3bktHQmVLNmxFeTdaOVVTblMvcldYYXgxQmVCaUlYb0FPd2hPb1JNdTBqUVpMOTZ4QWY1cnN3N0VtZzdDSmRFNFRyQ0QwY1RIMFh0SXYvZmJpdjdRZVc3TWRBM3FPMnExMUFlQmNwZG9hUmhUQ1ZuZzl5U1V3ZEJBNEFyZUg4VmxsRStBd1lwRGVWcjJhQThLV3BrZndtV3UxblVaNEg5Z2ZzZFFiaFV4S2M0WVhVWDZIbkxDRmFMVzA4OXpXcWV5dGtUWkZPUFJWcG5oS2l2ZWtzNnpqK2U3YU55UEZJY3ppSUp0elhjUUhrSTg5MllZTGU1TGxJY3ppSS9tcTJpd1BBUHk0dEM5anlXdVR4SFVRWDd0cytoM0xTcFdXSVRQSmE1UEVkMUtZdVVkandKbEFxTjRjNWY2SW1ZenVvamZEaEIrZUJ3ZFZ2MVZkNTZSRzNuMGxrYWxmNW1VMk9BK2VBQzJ4TWVmOFJtNHJSN0Y1R3M1WDI1YnZjNVgvTnYxb1k5cWRiRmtsMEFBQUFBRWxGVGtTdVFtQ0NcIlxuICAgICAgfVxuXG4gICAgICB2YXIgcHVzaHBpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihkYXRhLmxhdGl0dWRlLCBkYXRhLmxvbmdpdHVkZSksIHsgaWNvbjogdGlja2V0SW1hZ2UsIHRleHQ6IGluaXRJbmRleC50b1N0cmluZygpIH0pO1xuICAgICAgcHVzaHBpbi5tZXRhZGF0YSA9IGRhdGE7XG4gICAgICBtYXAuZW50aXRpZXMucHVzaChwdXNocGluKTtcbiAgICAgIHRoaXMuZGF0YUxheWVyLnB1c2gocHVzaHBpbik7XG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihwdXNocGluLCAnY2xpY2snLCBwdXNocGluQ2xpY2tlZCk7XG4gICAgICBtYXAuc2V0Vmlldyh7IG1hcFR5cGVJZDogTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLnJvYWQsIGNlbnRlcjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGRhdGEubGF0aXR1ZGUsIGRhdGEubG9uZ2l0dWRlKX0pO1xuICAgICAgaW5pdEluZGV4ID0gaW5pdEluZGV4ICsgMTtcbiAgICB9KTtcbiAgICAkKCcuTmF2QmFyX0NvbnRhaW5lci5MaWdodCcpLmF0dHIoJ3N0eWxlJywndG9wOjU4MHB4Jyk7XG4gICAgY29uc3QgaW5mb2JveCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5JbmZvYm94KG1hcC5nZXRDZW50ZXIoKSwge1xuICAgICAgdmlzaWJsZTogZmFsc2UgIFxuICAgIH0pOyAgICBcbiAgICBmdW5jdGlvbiBwdXNocGluQ2xpY2tlZChlKSB7XG4gICAgICBpZiAoZS50YXJnZXQubWV0YWRhdGEpIHtcbiAgICAgICAgaW5mb2JveC5zZXRNYXAobWFwKTsgIFxuICAgICAgICBpbmZvYm94LnNldE9wdGlvbnMoe1xuICAgICAgICAgIGxvY2F0aW9uOiBlLnRhcmdldC5nZXRMb2NhdGlvbigpLFxuICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgb2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMCwgMjApLFxuICAgICAgICAgIGh0bWxDb250ZW50Oic8ZGl2IGNsYXNzID0gXCJpbmZ5XCIgc3R5bGU9IFwiYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7Ym9yZGVyOiAxcHggc29saWQgbGlnaHRncmF5OyB3aWR0aDozNjBweDtcIj4nXG4gICAgICAgICAgKyBnZXRUaWNrZXRJbmZvQm94SFRNTChlLnRhcmdldC5tZXRhZGF0YSkgKyAnPC9kaXY+J1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgICQoJy5OYXZCYXJfQ29udGFpbmVyLkxpZ2h0JykuYXR0cignc3R5bGUnLCd0b3A6NTgwcHgnKTtcbiAgICAgIHBpbkNsaWNrZWQoZS50YXJnZXQubWV0YWRhdGEpXG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihpbmZvYm94LCAnY2xpY2snLCBjbG9zZSk7XG4gIH1cbiAgZnVuY3Rpb24gcGluQ2xpY2tlZChwYXJtcyl7XG4gICAgY29uc29sZS5sb2coJ2VtaXQnLHRoYXQpO1xuICAgIHRoYXQudGlja2V0Q2xpY2suZW1pdChwYXJtcyk7XG4gIH1cbiAgZnVuY3Rpb24gY2xvc2UoZSkge1xuICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2ZhIGZhLXRpbWVzJykge1xuICAgICAgJCgnLk5hdkJhcl9Db250YWluZXIuTGlnaHQnKS5hdHRyKCdzdHlsZScsJ3RvcDowcHgnKTtcbiAgICAgIGluZm9ib3guc2V0T3B0aW9ucyh7XG4gICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgXG4gICAgICAgIGZ1bmN0aW9uIGdldFRpY2tldEluZm9Cb3hIVE1MKGRhdGE6IGFueSk6U3RyaW5ne1xuICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIHZhciBpbmZvYm94RGF0YSA9IFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0ncGFkZGluZy10b3A6MTBweDtwYWRkaW5nLWJvdHRvbToxMHB4O21hcmdpbjogMHB4Oyc+XCJcbiAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgIHJldHVybiBpbmZvYm94RGF0YTtcbiAgICAgICAgfVxuXG5cbn1cblxuICBVcGRhdGVUaWNrZXRKU09ORGF0YUxpc3QoKVxuICB7XG4gICAgaWYodGhpcy50aWNrZXRMaXN0Lmxlbmd0aCAhPTApXG4gICAge1xuICAgIHRoaXMudGlja2V0TGlzdC5UaWNrZXRJbmZvTGlzdC5UaWNrZXRJbmZvLmZvckVhY2godGlja2V0SW5mbyA9PiB7XG4gICAgICB2YXIgdGlja2V0OiBUaWNrZXQgPSBuZXcgVGlja2V0KCk7O1xuICAgICAgdGlja2V0SW5mby5GaWVsZFR1cGxlTGlzdC5GaWVsZFR1cGxlLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJUaWNrZXROdW1iZXJcIil7XG4gICAgICAgICAgICB0aWNrZXQudGlja2V0TnVtYmVyID0gZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFbnRyeVR5cGVcIil7XG4gICAgICAgICAgdGlja2V0LmVudHJ5VHlwZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkNyZWF0ZURhdGVcIil7XG4gICAgICAgICAgdGlja2V0LmNyZWF0ZURhdGUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkVxdWlwbWVudElEXCIpe1xuICAgICAgICAgIHRpY2tldC5lcXVpcG1lbnRJRCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkNvbW1vbklEXCIpe1xuICAgICAgICAgIHRpY2tldC5jb21tb25JRCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUGFyZW50SURcIil7XG4gICAgICAgICAgdGlja2V0LnBhcmVudElEID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDdXN0QWZmZWN0aW5nXCIpe1xuICAgICAgICAgIHRpY2tldC5jdXN0QWZmZWN0aW5nID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJUaWNrZXRTZXZlcml0eVwiKXtcbiAgICAgICAgICB0aWNrZXQudGlja2V0U2V2ZXJpdHkgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFzc2lnbmVkVG9cIil7XG4gICAgICAgICAgdGlja2V0LmFzc2lnbmVkVG8gPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlN1Ym1pdHRlZEJ5XCIpe1xuICAgICAgICAgIHRpY2tldC5zdWJtaXR0ZWRCeSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUHJvYmxlbVN1YmNhdGVnb3J5XCIpe1xuICAgICAgICAgIHRpY2tldC5wcm9ibGVtU3ViY2F0ZWdvcnkgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlByb2JsZW1EZXRhaWxcIil7XG4gICAgICAgICAgdGlja2V0LnByb2JsZW1EZXRhaWwgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlByb2JsZW1DYXRlZ29yeVwiKXtcbiAgICAgICAgICB0aWNrZXQucHJvYmxlbUNhdGVnb3J5ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMYXRpdHVkZVwiKXtcbiAgICAgICAgICB0aWNrZXQubGF0aXR1ZGUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkxvbmdpdHVkZVwiKXtcbiAgICAgICAgICB0aWNrZXQubG9uZ2l0dWRlID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQbGFubmVkUmVzdG9yYWxUaW1lXCIpe1xuICAgICAgICAgIHRpY2tldC5wbGFubmVkUmVzdG9yYWxUaW1lID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBbHRlcm5hdGVTaXRlSURcIil7XG4gICAgICAgICAgdGlja2V0LmFsdGVybmF0ZVNpdGVJRCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTG9jYXRpb25SYW5raW5nXCIpe1xuICAgICAgICAgIHRpY2tldC5sb2NhdGlvblJhbmtpbmcgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFzc2lnbmVkRGVwYXJ0bWVudFwiKXtcbiAgICAgICAgICB0aWNrZXQuYXNzaWduZWREZXBhcnRtZW50ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJSZWdpb25cIil7XG4gICAgICAgICAgdGlja2V0LnJlZ2lvbiA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTWFya2V0XCIpe1xuICAgICAgICAgIHRpY2tldC5tYXJrZXQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIldvcmtSZXF1ZXN0SWRcIil7XG4gICAgICAgICAgdGlja2V0LndvcmtSZXF1ZXN0SWQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlNoaWZ0TG9nXCIpe1xuICAgICAgICAgIHRpY2tldC5zaGlmdExvZyA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQWN0aW9uXCIpe1xuICAgICAgICAgIHRpY2tldC5hY3Rpb24gPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkVxdWlwbWVudE5hbWVcIil7XG4gICAgICAgICAgdGlja2V0LmVxdWlwbWVudE5hbWUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlNob3J0RGVzY3JpcHRpb25cIil7XG4gICAgICAgICAgdGlja2V0LnNob3J0RGVzY3JpcHRpb24gPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlBhcmVudE5hbWVcIil7XG4gICAgICAgICAgdGlja2V0LnBhcmVudE5hbWUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlRpY2tldFN0YXR1c1wiKXtcbiAgICAgICAgICB0aWNrZXQudGlja2V0U3RhdHVzID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMb2NhdGlvbklEXCIpe1xuICAgICAgICAgIHRpY2tldC5sb2NhdGlvbklEID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJPcHNEaXN0cmljdFwiKXtcbiAgICAgICAgICB0aWNrZXQub3BzRGlzdHJpY3QgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIk9wc1pvbmVcIil7XG4gICAgICAgICAgdGlja2V0Lm9wc1pvbmUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnRpY2tldERhdGEucHVzaCh0aWNrZXQpO1xuICAgIH0pO1xuICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUnR0YW1hcGxpYkNvbXBvbmVudCB9IGZyb20gJy4vcnR0YW1hcGxpYi5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1J0dGFtYXBsaWJDb21wb25lbnRdLFxuICBleHBvcnRzOiBbUnR0YW1hcGxpYkNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgUnR0YW1hcGxpYk1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJpby5jb25uZWN0IiwibW9tZW50dGltZXpvbmUudXRjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0lBb0JFLDJCQUFvQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTt3QkFObkIsS0FBSzt1QkFDTixJQUFJO29CQUND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