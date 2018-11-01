import { Injectable, NgModule, ViewContainerRef, Component, ViewChild, Input, Output, EventEmitter, defineInjectable, inject } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable, forkJoin } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { connect } from 'socket.io-client';
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
     * @param {?} latitude
     * @param {?} longitude
     * @return {?}
     */
    RttamaplibService.prototype.getAddressByLatLong = /**
     * @param {?} latitude
     * @param {?} longitude
     * @return {?}
     */
    function (latitude, longitude) {
        /** @type {?} */
        var bingHost = "https://dev.virtualearth.net/REST/v1/Locations/LatLong?o=json&key=AnxpS-32kYvBzjQ5pbZcnDz17oKBa1Bq2HRwHANoNpHs3Z25NDvqbhcqJZyDoYMj";
        /** @type {?} */
        var getBingUrl = bingHost.replace("LatLong", latitude + "," + longitude);
        return this.http.get(getBingUrl);
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
(/** @type {?} */ (window)).global = window;
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
        var mapZoomLevel = 10;
        loadCurrentLocation();
        /** @type {?} */
        var that = this;
        this.UpdateTicketJSONDataList();
        /** @type {?} */
        var initIndex = 1;
        this.ticketData.forEach(function (data) {
            if (data.latitude != '' && data.longitude != '') {
                /** @type {?} */
                var ticketImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAtCAYAAADcMyneAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANOSURBVFiFzZlPSBRRGMB/39tMCCN3Ny3ILlGC/TlYUOCfTYIwISjwVnTpVHTJg1EgCdVFq1sRHSLonIe6WFGkq7sVFEhhmuWtP4TMiiiFujOvQ6M76qw67rjj7zbvffN9Px6zO+99I6wA3UChMU6tCLVaqBSLXQhbgCI7ZALNbxGGNPRpiEeL6JVOJr3WEi/BozEqLYsLCI1Ascdao0CHMrkbTtLnq2Cqjr3a5BZQ71EqW9VOTJqjCfqXDl0EvYf1qQg3gCZgnS9yGdJauB01uCr9THkWNOooE5MnGvb7LDbf4L2e5uTmN/xwn3aTq2YPIZ6j2baqchm+A/XRHj7Pn1ggOFJDuRK6ga35MHPwywwRK+3im3NwjuBINRuV4h1QkVe1DENSyMHIS8ZmBpRzVikeEpwcQLme5L5zYHYFjVoagcd5V3LBEk6UxHkKtqA+QEFqA4PAjkDNbAS+hUNUSBdpBWBs4DRrRA5Aw04jzSmwn0GB88EqLUSEcwBi/618CVrIjZDJTiXi0/t1FbAU9UqgKmiRbFhQrYDdQYtkRahQQFnQHotQpsjsgtccApsUeN+G55G/CvgZtMUi/FQCv4K2WIQfyoKBoC2yITCogBdBi2RF81zsTaoBFATtM48pM0RUlSQYZw2uosCz0i4mFIAS2oMWcqEd7O1WOE4cSAaq40TTE+khAc4zidAMmEE5OTDRXJq5mBWMxklqzc1gnDIItEUTvHVcZ9ANFI5OkFz1bkIWBD6EU1Q5WyFzjp3SyWQBHIOFJ/w8MJQOcXx+n8a99VFHGSbd5OkgpWFYW8RKEgv3BcrthmgX3wtCHELoXH09XplTVLvJwVLtN1BGLZcFWoH1PotNidAajtMmoLMFLauBacTYDrSgOUvufUILoSOU5kpxkuGlgj21gEdqKFdwxm4Be+3hDKDpMBWPSuN8Xe5NngSdpGLs05puILxE6KgIhyNxPq2kjuuPZDnYBa8vI/TaSuUgB0GAyB/uAEPZ5jUMR4q4l0uNnATlA9PW/3e4e3JN00q+jcypkcvNMxg1vEA4Oiex5nWklyO55s5pBWfRNAFpx4iJcNGP1L4I2h9kHs4OCA8iPXz0I7c/KwhMm7QAY8C4qWj1K+8/dkjlffe0168AAAAASUVORK5CYII=";
                if (data.ticketSeverity.toLowerCase() === "unknown" || data.ticketSeverity.toLowerCase() === "warning" || data.ticketSeverity.toLowerCase() === "minor") {
                    ticketImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAzCAYAAADsBOpPAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAPySURBVGiB7ZhPiBt1FMe/7yXT1d3FQhGKeKnoKtjsWmlvxRah9qLVS6dJZoOuBw+WQi/1tIcWvOiWslS9uAeJaya/bIMHKYqohxQUQYhaNpWyWFBWoi30oCh1N5Pf87DbkJ1MJpOdZBKwn1ve7/1+75Nh5vePsA1M09xhGMZBAIcAPA3gCQC7AYxvpvxNRH+IyAqAH5j5yujo6DcLCwu17dRrhrpJTqfTe4noFIATAHZ1Wes2gEtE9J5t2z912bdBIOFkMvl4LBabA/Bi0D4+CIBPmPmNXC73c7edfYubphmLx+OzRDQLYMd2DduwJiJvOo7zVrFYrAft1FY4nU4/SEQfY+M97RsiUjIM4/ji4uLtIPmewqlUag8zfwFgoqd27VkBcDSfz//aKbFFOJ1O7yaiK9j48qPkBjM/k8vlfvdL4uYfMzMz9xHRp4heFgAe1Vp/Zprm/X5JW4TX19fnAezvq5Y/+wzDmPNLaLwSlmUdAlBC+GkrLFpEDiulvvZqvPuECcBFDF4WAJiI5tHGhQEgk8kcA7AvSqsOHJienn7eq4EBQGt9MlqfzojI615xymQyD2mtVwHEInbqRF1EHlZK3WwOsogcxfDJAhtOz7mDrLXu69IbBiI67I4xM+8dhEwQiOhJd4xFZM8AXAIhIo+4Ywxg5wBcgtLixl5ZQ0SLHwO46ZE4LFTdAfYKDhGewh03zQOkxY03N+tDiYiU3DGu1+ufD8AlECLylTvGhULhFwDXo9fpyLVNty0wAIjIu5HrdOYdryADwMjIyAcYruntVq1W+8irgQEgm83+C2A+UiV/zheLxTteDY2VpFqtXgDwXWRK7fl+fHz8YrvGhnCpVHJE5BUAnv8sItZE5GW/W84ta7VS6jqA1wDofpt5oEXkVaXUNb+klpPG8vLyciKRWCWiXtxUBkVE5KRSKtsp0fNoVKlUfpycnLwFIIrj07qInFJKvR8k2fcJplKpA8x8CUDLRrpH/CYiJ5RS3wbt4Pv0KpVKNZFI2ET0AICnOuV3QQ3AQjweT9q2vdJNx8DvaCaTeUxrfQ7AcQAj3fk1WCOiouM455aWlm5sZ4CuPyrTNHcahvECgCSAYwG7XQawRESXbdv+q9uazYSaBSzL+hLAEb8cESkppZ4NU6eZUGc6Zj4D/zlbE9GZMDVaaobpnMvlrgJY9En5MJ/Pl8PUcBP61Ky1ngXwj0fTHa312bDjuwktXCgUqkR0waNprlAorIYd301P7iXGxsbeBtAsV43FYud7MbabniwE5XK5NjU19SeAlwBARE7btt2XrWrPbn4mJiayAMoictVxHL8PcXiwLOuIZVm+8/I97vF/5z/d0joEPzhZGgAAAABJRU5ErkJggg==";
                }
                else if (data.ticketSeverity.toLowerCase() === "major") {
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
            }
        });
        mapZoomLevel = map.getZoom();
        $('.NavBar_Container.Light').attr('style', '480px');
        /**
         * @param {?} e
         * @return {?}
         */
        function pushpinClicked(e) {
            if (e.target.metadata) {
                /** @type {?} */
                var ll = e.target.getLocation();
                loadTicketDirections(this, e.target.metadata, ll.latitude, ll.longitude);
                // infobox.setOptions({
                //   location: e.target.getLocation(),
                //   visible: true,
                //   offset: new Microsoft.Maps.Point(0, 40),
                //   htmlContent:'<div style="margin:auto !important;width:550px !important;background-color: white;border: 1px solid lightgray;">'
                //   + getTicketInfoBoxHTML(e.target.metadata) + '</div>'
                // });
            }
            $('.NavBar_Container.Light').attr('style', 'top:480px');
            pinClicked(e.target.metadata, 0);
        }
        /** @type {?} */
        var currentLatitude = 40.3128;
        /** @type {?} */
        var currentLongitude = -75.3902;
        /** @type {?} */
        var distanceData = "";
        /**
         * @return {?}
         */
        function loadCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    /** @type {?} */
                    var loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
                    /** @type {?} */
                    var pin = new Microsoft.Maps.Pushpin(loc);
                    map.entities.push(pin);
                    // // Center the map on the user's location.
                    // // maps.setView({ center: loc, zoom: 15 });
                    currentLatitude = position.coords.latitude;
                    currentLongitude = position.coords.longitude;
                    console.log(currentLatitude);
                    console.log(currentLongitude);
                });
            }
        }
        /**
         * @param {?} parms
         * @param {?} lauchTicketCard
         * @return {?}
         */
        function pinClicked(parms, lauchTicketCard) {
            /** @type {?} */
            var selectedTicket = { "SelectedTicket": {
                    "TicketNumber": parms.ticketNumber,
                    "LaunchTicketCard": lauchTicketCard
                }
            };
            console.log('Selected Ticket: ' + selectedTicket + 'launchTicket: ' + lauchTicketCard);
            that.ticketClick.emit(selectedTicket);
        }
        /**
         * @param {?} that
         * @param {?} infoBoxMetaData
         * @param {?} endLat
         * @param {?} endLong
         * @return {?}
         */
        function loadTicketDirections(that, infoBoxMetaData, endLat, endLong) {
            Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
                dirManager = new Microsoft.Maps.Directions.DirectionsManager(map);
                dirManager.clearAll();
                map.layers.clear();
                /** @type {?} */
                var locc = new Microsoft.Maps.Location(currentLatitude, currentLongitude);
                // Set Route Mode to driving
                dirManager.setRequestOptions({
                    routeMode: Microsoft.Maps.Directions.RouteMode.driving,
                    routeDraggable: true
                });
                dirManager.setRenderOptions({
                    drivingPolylineOptions: {
                        strokeColor: Microsoft.Maps.Color.fromHex('#009fdb'),
                        strokeThickness: 5
                    },
                    firstWaypointPushpinOptions: { visible: true, text: '',
                        icon: 'data:image/png;base64,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'
                    },
                    lastWaypointPushpinOptions: { visible: true, text: '',
                        icon: 'data:image/png;base64,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'
                    },
                    viapointPushpinOptions: { visible: false,
                    },
                    waypointPushpinOptions: { visible: false },
                    autoUpdateMapView: true,
                });
                /** @type {?} */
                var waypoint1 = new Microsoft.Maps.Directions.Waypoint({
                    location: new Microsoft.Maps.Location(locc.latitude, locc.longitude)
                });
                /** @type {?} */
                var waypoint2 = new Microsoft.Maps.Directions.Waypoint({
                    location: new Microsoft.Maps.Location(endLat, endLong),
                });
                dirManager.addWaypoint(waypoint1);
                dirManager.addWaypoint(waypoint2);
                Microsoft.Maps.Events.addHandler(dirManager, 'directionsUpdated', function (e) {
                    /** @type {?} */
                    var allWayPoints = dirManager.getAllWaypoints();
                    /** @type {?} */
                    var fromAddress = allWayPoints[0].getAddress();
                    /** @type {?} */
                    var toAddress = allWayPoints[1].getAddress();
                    /** @type {?} */
                    var routeIndex = e.route[0].routeLegs[0].originalRouteIndex;
                    /** @type {?} */
                    var nextLocation = e.route[0].routePath[routeIndex + 1];
                    /** @type {?} */
                    var routeIdx = dirManager.getRequestOptions().routeIndex;
                    /** @type {?} */
                    var distance = Math.round(e.routeSummary[routeIdx].distance * 100) / 100;
                    /** @type {?} */
                    var units = dirManager.getRequestOptions().distanceUnit;
                    /** @type {?} */
                    var distanceUnits = '';
                    if (units === Microsoft.Maps.Directions.DistanceUnit.km) {
                        distanceUnits = 'km';
                    }
                    else {
                        // Must be in miles
                        distanceUnits = 'miles';
                    }
                    console.log('last Zoom Level' + mapZoomLevel);
                    /** @type {?} */
                    var time = Math.round(e.routeSummary[routeIdx].timeWithTraffic / 60);
                    distanceData = "<label style='font-weight:bold; font-size:32px;'>" + distance + '&nbsp;' + distanceUnits + ", </label> Time with Traffic: " + time + " minutes";
                    // // infobox.setMap(map);
                    // infobox.setOptions({
                    //     location: new Microsoft.Maps.Location(endLat, endLong),
                    //     visible: true,
                    //     offset: new Microsoft.Maps.Point(0, 40),
                    //     htmlContent:'<div style="margin:auto !important;width:550px !important;background-color: white;border: 1px solid lightgray;">'
                    //     + getTicketInfoBoxHTML(infoBoxMetaData, distanceData, fromAddress, toAddress) + '</div>'
                    //   });
                    $(".modal-content").html(getTicketModalHTML(infoBoxMetaData, distanceData, fromAddress, toAddress));
                    jQuery("#ticketmodal").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    /** @type {?} */
                    var xflag = 0;
                    $("#moreFormContentBtn").click(function () {
                        // console.log('called click');
                        if (xflag == 0) {
                            $("#initFormContent").hide();
                            $("#moreFormContent").slideToggle("slow");
                            $("#dummyimage").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OThGOTY5OTJEQzNBMTFFODkwMjA4M0QxMjE3M0YyNTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OThGOTY5OTNEQzNBMTFFODkwMjA4M0QxMjE3M0YyNTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5OEY5Njk5MERDM0ExMUU4OTAyMDgzRDEyMTczRjI1OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5OEY5Njk5MURDM0ExMUU4OTAyMDgzRDEyMTczRjI1OSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv3RHwgAAAF7SURBVHjavJZBZwNBFMcnFc0nKGEoOYWlhHyJsCw95WPsKZR8kiHXsPTQS3ppJd+glFJKLiU99dLqKYTpm/oPz5jdnUmnffyWnZ35/3fe7MzbjmgOSVwSOXFGjND+SLwTt8SN1vpNREafUMSB0C0c0LdPRsLFFxPiiwlUxJQYE10wRlvF+pkxkzaDkg24JrKA2Wboa8eVdQYFS8k8NJdMaM5SVrgGZjE/0EHFLJbztgoaRktyA8XyLY41gKBdF2UNzllqsgQGGUuV0RZXaFiKI6Lm01xC02iLNW5ykSBgkEPzznzTQ7Y7eVwQpxHan8TW0fpJ+R5uPWfAa8Au5qzYDHpo23cb3ugJ501obOse7OAmE66BhObuhC4veDZK8RU5Ws/G4B43U5EurNbGXAZ/uNEG/3JU2EWxNWD2i8NuxmqD9B3XOtbEI659x7Wv4FRslzfF0KlsZVvJLBpKpo26klmE1GS7JouIor+wOXfpRP622Fk8hP62fAswAJeeZaAnWSufAAAAAElFTkSuQmCC");
                            xflag = 1;
                        }
                        else if (xflag == 1) {
                            $("#moreFormContent").hide();
                            $("#initFormContent").slideToggle("slow");
                            $("#dummyimage").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTI0RjVFNjZEQzNBMTFFOEFEMTI4QUMzODNDRERGQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTI0RjVFNjdEQzNBMTFFOEFEMTI4QUMzODNDRERGQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MjRGNUU2NERDM0ExMUU4QUQxMjhBQzM4M0NEREZCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MjRGNUU2NURDM0ExMUU4QUQxMjhBQzM4M0NEREZCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlhOsuYAAAGxSURBVHjatJbBSsNAEIYTLfoEhUIg0FMhIBR69SQIBSHgqdAHEDzl5KngYwiB9loCHrzoSfANBEEICIWi1JMXxVOhEP+VGRjXTbKJceBL02T3/7Oz2Z24TnF44BgcgTbo0/UH8AZuwFWWZa9OxeiAGGxAVsKG2nZg5OiYYgg+hUACRmAAWsSAriWineozLDOIRIdLEFiMNqC23C/KMwhFSia2uRRCE5GyUDdQk/lODeICvX1wIkemPW1MGkrLkwaxyHdRXFC7U5MBCfK8xGzgi9QEDRgEIlX+Fg5jsA3mIHX+GDBJSUtpjpXBId2b1xF0XfcHmtaBeqd7YnXK2AM72rU2/fq0FmR8gIWm9Z3yNeVsV+vwbLGKJdc8J6SlTtatgtE/0n4jw6dRvBjuLfKEVuTmWaT811tkWnikpU5WapKf6F6/5ltj2ntYK1UGt/Rn5DQXrHWnDt1/XGhdNYIlmFH78waenjVmMFzKzY5rwFndOaC+XBs803adVTUxiGem7dpUcBKxyouip1W2qKxkhgUlkyOvZIY2NZnnZFqh6E855zpuxc8WHsW97WfLlwADAEeDUq2DVY8MAAAAAElFTkSuQmCC");
                            xflag = 0;
                        }
                    });
                    $(".close").click(function () {
                        dirManager.clearAll();
                        map.layers.clear();
                        map.setView({ center: new Microsoft.Maps.Location(endLat, endLong), mapZoomLevel: mapZoomLevel });
                    });
                    $("#tktId").click(function () {
                        pinClicked(infoBoxMetaData, 1);
                    });
                });
                dirManager.calculateDirections();
            });
        }
        /**
         * @param {?} data
         * @param {?} distancdData
         * @param {?} fromAddress
         * @param {?} toAddress
         * @return {?}
         */
        function getTicketModalHTML(data, distancdData, fromAddress, toAddress) {
            console.log(data.ticketSeverity.toLowerCase());
            /** @type {?} */
            var workSeverityColor = "#cf2a2a";
            if (data.ticketSeverity.toLowerCase() === "major") {
                workSeverityColor = "#009fdb";
            }
            else if (data.ticketSeverity.toLowerCase() === "minor" || data.ticketSeverity.toLowerCase() === "warning" || data.ticketSeverity.toLowerCase() === "unknown") {
                workSeverityColor = "#191919";
            }
            /** @type {?} */
            var dialogData = "<div class='modal-header'>"
                + "<h5 class='modal-title' id='tktId'><a href='javascript:void(0);' style='text-decoration: underline; color:#000;'>" + data.ticketNumber + "</a></h5>"
                + "<button type='button' class='close' data-dismiss='modal' title='Close'>&times;</button>"
                + "</div>"
                + "<div class='modal-body' style='max-height:520px; overflow-y:auto;'>"
                + "<form class='tktForm'>"
                + "<div id='initFormContent' style='display: block;'>"
                + "<div class='row'>"
                + " <div class='col-sm-4'>"
                + "<label class='control-label'>Severity:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + " <label class='control-label' style=color:" + workSeverityColor + ">" + data.ticketSeverity + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-4'>"
                + "<label class='control-label'>Common ID:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.commonID + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-4'>"
                + "<label class='control-label'>Affecting:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.custAffecting + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-4'>"
                + "<label class='control-label'>Short Descript:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + " <label class='control-label'>" + data.shortDescription + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-11' style='border-top:1px solid #dbdbdb;'>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-12'>"
                + " <label class='control-label'>" + distancdData + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-1'>"
                + "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAaCAYAAABCfffNAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANfSURBVEhLzZXdS1NxGMf7eyLrwgyMbgIhUevCiKC6zQgURfRCw7AXKnqjEouIUCzqIlAUMwjBhC4qrL229v7W3M7cdJubO3s527fn9zunU3vfupA+MDae39nve36/5/s8zx7sAv+HSF6SkEulIO3sQEokIMXj/HcunUY+l1Oeqk5VkTx9Ek4nhPl5uO/fh+vGDTivXYP3yROElpeRXF+XH6xBWRG2+bZWC/fYGCwXLsDS3w/H9etwP3oE1717sI2Pw9zbC8u5c/BNTCBhsch/rECJSC6bRWR1Fc7RURiOH4e1pwc/afPQ+/eIfv2KyJcvCLKT3bwJ88mTMJ46BTcJc6E8e71SCkTyJBD99g3ms2ehO3IE669eIROJKKuliH4/XFevwkBitpERpARBWSmkQET0eGDq6oLpzBkIs7M8wdVgic9ub8M/PQ19dzdct2/zPYpRRTLRKIJv30Lf3g7f5CSyNQT+Jul2w0NXpj96FOHFRSX6B1UkYTTCOjgIGyU7bjAo0fqJ6/XQtbby/KU2NpSojCqyRW+g2bsXQbqmTCymROsnEw7DOjwMBxki8vmzEpXhIswTwRcvoNm3DzFyT3mPVIcVqW9mht9EcG5OicpwkWwyCf/Tp9AeOADR4eALjSLRHhvv3sF++TKE16+VqAwXkahtBJ49g3b/foh2O19oFOZEYWEBdipU4c0bJSqj5iRMudA0NWFrZQUS9aVGyZI7PQ8fwkYnCS0tKVEZVST64QN0x47BSycSfT4lWj/pQIDXl/vuXcSL2owqkqRcOKkBmk6fxmbRm9RCEkWEKB/aw4chvHzJr/9vVBF2RdG1NejpQfelS0iWqdxKRD5+hGVggL9g7NMnJfoHVYSRI4ew4+o7OmCnzpve3FRWKhOjIrb19UF36BA2qbEylxVTIMIQaUa4bt2Ctq0NZupHfqqfuM2GHA2v32TISdsmE/xUF99PnMAPOgGzLetj5SgRYcRpg58PHsBMifxx8SIc1PZ9d+4g+Pw5Ao8fw0OzxT40BAt9rOfPQ5iaQoamZiXKijBY1ceohzmvXIGxsxP6gweha26GrqWFf5soxiZkggxTq0NUFGHw+U7OYTUger2IaTS8eabI4jk258lF9cz5qiLFsKnJhBulIZF/ZRdEgF832n4shv7MoQAAAABJRU5ErkJggg==' />"
                + "</div>"
                + " <div class='col-sm-10' style='border-bottom:1px solid #dbdbdb;'>"
                + " <label class='control-label'>" + fromAddress + "</label>"
                + "</div>"
                + " <div class='col-sm-1'>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-1'>"
                + "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAYCAYAAAALQIb7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANRSURBVEhLvZVLSFRRGMeNiqK2tYwWtW/RpqigCCJCiBZFUFnLaFEtapESGBiVRRSCCGUvNW1sLNNSk14qvSwdH42PeTuPa/N+OC/vzPz73xitO94Zxwh/cOBy7j33f873P9/3FWARWZDYdCyBcETEVHgaSCTTs/kzr5g9EMdHWxjVWj9Ke124+MWJks9OXO5z4/5YAN8cYQS4gXzIKpbiMHpjuNPrRFGzBRtrDVj6UI9VNQas5ljyQI+1NXqcejkBtdYLiz+OlLQoB1nFmkf9OPjMjC31BlzrEfBaF8CQKwZ7WMTPaILPUTwZ8uJsmxVrHulxoMMO3WQkvVoZRbFnFDr50oqiFxZUD3oxyh9H6Fcmfgr3MYyXGNadPP2+NhvG+G0qqXxEuRi/MTF0h7nwGIWe/vBBFOe/CBGKltHLDfVGXPv0ExMMqRIyMSEYx116tI2hq9J4kBDnMeEvbL4YKii0iT4+1wfTs3JkYr2OCI4+t6D0nQMDQu74K6GhZ5vrDCinqN0393QysSZjCOu5s4Zh728/FoqbKXCm046Lbx3oMs09nUysUuvjldahxx6mf/mHcIapeBL1GjdKKKga9qVn/zArFomKuPLdhZW8xvogK8Q/EJ5OopU5d6HThtpBT3r2D7NiInd1o9+DFUzcAXcsPbswpJM1DXlwvsOKRwM5xCSqRvxYcm8cneYQUnlc+UyCzMWbPZMofm1DK3M1E5lYy8QU1vE23frqhD1LruRiIjCN/bzNZV0Cfgj0PQOZmJTQ5d0CChtNaMmSK9kQ6Ve7MYhlvGC3WXWSCpGRiYmJFDQsP9sbjDjNUGj5nC9tFNrXZMYhVp6vWdbJxCRCNPkKk3KX2oQjHTb0MQ2UdjlDlD41s0gfe2XFbm6yfcyPkEIdlZgjJiGw9Jx4L2D9YwPOS2YbghhnRfAw0QOs+H4OF59HPTGoRnwoZHfYozKigl7HcmxMUUzCw26sZpLvVZmw/L4OW9VmXKfxdf1uPPjmQvEbB3bwXQHfHWebea8PIE4bcpWCrGISQZ6glzWykgl69eMkylgzz7VbfydtKUvSDYa7Zlzqc2xBDP985BSbIUYPjPzhB9a7RrYdqbF2m4Mwe6LpL/IjL7H/xSKKAb8A9MKXAOgE42gAAAAASUVORK5CYII=' />"
                + "</div>"
                + "<div class='col-sm-10'>"
                + " <label class='control-label'>" + toAddress + "</label>"
                + "</div>"
                + " <div class='col-sm-1'>"
                + "</div>"
                + "</div>"
                + "</div>" //end initform
                + "<div id='moreFormContent' style='display: none;'>"
                + "<div class='row'>"
                + " <div class='col-sm-4'>"
                + " <label class='control-label'>Entry Type:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.entryType + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Status:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.ticketStatus + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Customer Affecting:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + " <label class='control-label'>" + data.custAffecting + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Assignee:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + " <label class='control-label'>" + data.assignedTo + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Common ID:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.commonID + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Equipment ID:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + " <label class='control-label'>" + data.equipmentID + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Equipment Name:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.equipmentName + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Parent ID:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.parentID + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Parent Name:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.parentName + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Problem Category:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + " <label class='control-label'>" + data.problemCategory + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Problem Sub Category:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.problemSubcategory + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Problem Detail:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.problemDetail + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Short Descript:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.shortDescription + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Location Ranking:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.locationRanking + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Planned Restoral Time:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.plannedRestoralTime + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Alternate Site ID:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.alternateSiteID + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Work Request ID:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.workRequestId + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4'>"
                + "<label class='control-label'>Activity Action:</label>"
                + "</div>"
                + "<div class='col-sm-8'>"
                + "<label class='control-label'>" + data.action + "</label>"
                + "</div>"
                + "</div>"
                + "</div>"
                + "</form>"
                + "</div>"
                + "<div class='modal-footer'>"
                + "<button id='moreFormContentBtn' style='background:transparent;border:0;cursor:pointer;'> <img id='dummyimage'  src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTI0RjVFNjZEQzNBMTFFOEFEMTI4QUMzODNDRERGQkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTI0RjVFNjdEQzNBMTFFOEFEMTI4QUMzODNDRERGQkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MjRGNUU2NERDM0ExMUU4QUQxMjhBQzM4M0NEREZCQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MjRGNUU2NURDM0ExMUU4QUQxMjhBQzM4M0NEREZCQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlhOsuYAAAGxSURBVHjatJbBSsNAEIYTLfoEhUIg0FMhIBR69SQIBSHgqdAHEDzl5KngYwiB9loCHrzoSfANBEEICIWi1JMXxVOhEP+VGRjXTbKJceBL02T3/7Oz2Z24TnF44BgcgTbo0/UH8AZuwFWWZa9OxeiAGGxAVsKG2nZg5OiYYgg+hUACRmAAWsSAriWineozLDOIRIdLEFiMNqC23C/KMwhFSia2uRRCE5GyUDdQk/lODeICvX1wIkemPW1MGkrLkwaxyHdRXFC7U5MBCfK8xGzgi9QEDRgEIlX+Fg5jsA3mIHX+GDBJSUtpjpXBId2b1xF0XfcHmtaBeqd7YnXK2AM72rU2/fq0FmR8gIWm9Z3yNeVsV+vwbLGKJdc8J6SlTtatgtE/0n4jw6dRvBjuLfKEVuTmWaT811tkWnikpU5WapKf6F6/5ltj2ntYK1UGt/Rn5DQXrHWnDt1/XGhdNYIlmFH78waenjVmMFzKzY5rwFndOaC+XBs803adVTUxiGem7dpUcBKxyouip1W2qKxkhgUlkyOvZIY2NZnnZFqh6E855zpuxc8WHsW97WfLlwADAEeDUq2DVY8MAAAAAElFTkSuQmCC'/> </button>"
                + "</div>";
            return dialogData;
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
                        ticket.entryType = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "CreateDate") {
                        ticket.createDate = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "EquipmentID") {
                        ticket.equipmentID = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "CommonID") {
                        ticket.commonID = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "ParentID") {
                        ticket.parentID = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "CustAffecting") {
                        ticket.custAffecting = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "TicketSeverity") {
                        ticket.ticketSeverity = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "AssignedTo") {
                        ticket.assignedTo = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "SubmittedBy") {
                        ticket.submittedBy = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "ProblemSubcategory") {
                        ticket.problemSubcategory = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "ProblemDetail") {
                        ticket.problemDetail = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "ProblemCategory") {
                        ticket.problemCategory = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "Latitude") {
                        ticket.latitude = (element.Value === undefined || element.Value === '') ? '' : element.Value;
                    }
                    else if (element.Name === "Longitude") {
                        ticket.longitude = (element.Value === undefined || element.Value === '') ? '' : element.Value;
                    }
                    else if (element.Name === "PlannedRestoralTime") {
                        ticket.plannedRestoralTime = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "AlternateSiteID") {
                        ticket.alternateSiteID = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "LocationRanking") {
                        ticket.locationRanking = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "AssignedDepartment") {
                        ticket.assignedDepartment = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "Region") {
                        ticket.region = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "Market") {
                        ticket.market = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "WorkRequestId") {
                        ticket.workRequestId = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "ShiftLog") {
                        ticket.shiftLog = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "Action") {
                        ticket.action = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "EquipmentName") {
                        ticket.equipmentName = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "ShortDescription") {
                        ticket.shortDescription = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "ParentName") {
                        ticket.parentName = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "TicketStatus") {
                        ticket.ticketStatus = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "LocationID") {
                        ticket.locationID = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "OpsDistrict") {
                        ticket.opsDistrict = element.Value === undefined ? '' : element.Value;
                    }
                    else if (element.Name === "OpsZone") {
                        ticket.opsZone = element.Value === undefined ? '' : element.Value;
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
                    template: "  \n  <div id='myMap' class='mapclass' #mapElement>\n  </div>\n  <div id=\"ticketmodal\" class=\"modal fade\">\n\t\t<div class=\"modal-dialog\">\t\t\t\n      <div class=\"modal-content\">\n      </div>\t\t\t\n      </div>\n  </div>\n  ",
                    styles: ["\n  .mapclass{\n    height: calc(100vh - 4em - 70px) !important;    \n    display:block;\n  },\n  .infyMappopup{\n\t\tmargin:auto !important;\n    width:300px !important;\n    background-color: white;\n    border: 1px solid lightgray; \n  },\n  .popModalContainer{\n    padding:15px;\n  }\n  .popModalHeader{\n    position: relative;\n    width:100%;\n  }\n  .popModalHeader a{\n    display: inline-block;\n    padding:5px 10px;\n    background-color: #ffc107;\n    border-color: #ffc107;\n    position: absolute;\n    right:10px;\n    top:5px;\n  }\n  .popModalHeader .fa{\n    position: absolute;\n    top:-10px;\n    right:-10px;\n  \n  }\n  .popModalBody label{\n    font-weight: bold;\n    line-height: normal;\n  }\n  .popModalBody span{\n    display: inline-block;\n    line-height: normal;\n    word-break:\u00A0break-word;\n  }\n  .meterCal strong{\n    font-weight: bolder;\n    font-size: 23px;\n  }\n  .meterCal span{\n    display: block;\n  }\n  .popModalFooter .col{\n    text-align: center;\n  }\n  .popModalFooter .fa{\n    padding:0 5px;\n  }\n.modal-body {max-height:450px; overflow-y:auto}\n.tktForm .form-group {margin-bottom:5px}\n.tktForm .form-group div label {font-weight:500}\n.topBorder {border-top:#dbdbdb 1px solid;}\n\n.text-success {color:#5cb85c}\n.text-danger {color:#d9534f}\n#moreFormContentBtn, #moreFormContentBtn:hover  {    \n   \n    background:transparent;\n    border:0\n}\n#moreFormContentBtn:focus  {    \n    outline:0\n}\n\n  "]
                }] }
    ];
    /** @nocollapse */
    RttamaplibComponent.ctorParameters = function () { return [
        { type: RttamaplibService },
        { type: ViewContainerRef }
    ]; };
    RttamaplibComponent.propDecorators = {
        someInput: [{ type: ViewChild, args: ['mapElement',] }],
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
                    exports: [RttamaplibComponent],
                    providers: [RttamaplibService]
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vcnR0YW1hcGxpYi9saWIvcnR0YW1hcGxpYi5zZXJ2aWNlLnRzIiwibmc6Ly9ydHRhbWFwbGliL2xpYi9tb2RlbHMvdHJ1Y2tkZXRhaWxzLnRzIiwibmc6Ly9ydHRhbWFwbGliL2xpYi9ydHRhbWFwbGliLmNvbXBvbmVudC50cyIsIm5nOi8vcnR0YW1hcGxpYi9saWIvcnR0YW1hcGxpYi5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cCwgUmVzcG9uc2UsIFJlcXVlc3RPcHRpb25zLCBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3RvUHJvbWlzZSc7XG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcbmltcG9ydCB7IFRydWNrRGlyZWN0aW9uRGV0YWlscyB9IGZyb20gJy4vbW9kZWxzL3RydWNrZGV0YWlscyc7XG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyL3NyYy91dGlscy9jb2xsZWN0aW9uJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUnR0YW1hcGxpYlNlcnZpY2Uge1xuXG4gIG1hcFJlYWR5ID0gZmFsc2U7XG4gIHNob3dOYXYgPSB0cnVlO1xuICBob3N0OiBzdHJpbmcgPSBudWxsO1xuICBzb2NrZXQ6IGFueSA9IG51bGw7XG4gIHNvY2tldFVSTDogc3RyaW5nID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHtcbiAgICB0aGlzLmhvc3QgPSBcImh0dHBzOi8vemxkMDQwOTAudmNpLmF0dC5jb206ODQ0My9SQVBUT1IvXCI7XG4gICAgdGhpcy5zb2NrZXRVUkwgPSBcImh0dHBzOi8vemxkMDQwOTAudmNpLmF0dC5jb206MzAwN1wiO1xuICB9XG5cbiAgY2hlY2tVc2VySGFzUGVybWlzc2lvbih1c2VyTmFtZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHVzZXJzTGlzdFVybCA9IHRoaXMuaG9zdCArIFwiYXV0aHVzZXJcIjtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXNlcnNMaXN0VXJsLCB1c2VyTmFtZSkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRNYXBQdXNoUGluRGF0YShhdHRVSUQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzdXBlcnZpc29ySWQgPSBbXTtcbiAgICBzdXBlcnZpc29ySWQgPSBhdHRVSUQuc3BsaXQoJywnKTtcbiAgICB2YXIgdXNlcnNMaXN0VXJsID0gdGhpcy5ob3N0ICsgJ1RlY2hEZXRhaWxGZXRjaCc7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVzZXJzTGlzdFVybCwge1xuICAgICAgXCJhdHR1SWRcIjogXCJcIixcbiAgICAgIFwic3VwZXJ2aXNvcklkXCI6IHN1cGVydmlzb3JJZFxuICAgIH0pLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZmluZFRydWNrTmVhckJ5KGxhdCwgbG9uZywgZGlzdGFuY2UsIHN1cGVydmlzb3JJZCk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHN1cGVydmlzb3JJZHMgPSBbXTtcbiAgICBzdXBlcnZpc29ySWRzID0gc3VwZXJ2aXNvcklkLnNwbGl0KCcsJyk7XG4gICAgY29uc3QgZmluZFRydWNrVVJMID0gdGhpcy5ob3N0ICsgJ0ZpbmRUcnVja05lYXJCeSc7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGZpbmRUcnVja1VSTCwge1xuICAgICAgJ2xhdCc6IGxhdCxcbiAgICAgICdsbG9uZyc6IGxvbmcsXG4gICAgICAncmFkaXVzJzogZGlzdGFuY2UsXG4gICAgICAnc3VwZXJ2aXNvcklkJzogc3VwZXJ2aXNvcklkc1xuICAgIH0pLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0V2ViUGhvbmVVc2VyRGF0YShhdHRVSUQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBsZGFwVVJMID0gdGhpcy5zb2NrZXRVUkwgKyBcIi9nZXR0ZWNobmljaWFucy9cIiArIGF0dFVJRDtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChsZGFwVVJMKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFdlYlBob25lVXNlckluZm8oYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgbGRhcFVSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvZ2V0dGVjaG5pY2lhbmluZm8vXCIgKyBhdHRVSUQ7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQobGRhcFVSTCkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBHZXROZXh0Um91dGVEYXRhKGZyb21BdHRpdHVkZSwgdG9BdHRpdHVkZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHJvdXRlVXJsID0gXCJodHRwczovL2Rldi52aXJ0dWFsZWFydGgubmV0L1JFU1QvVjEvUm91dGVzL0RyaXZpbmc/d3AuMD1cIiArIGZyb21BdHRpdHVkZSArIFwiJndwLjE9XCIgKyB0b0F0dGl0dWRlICsgXCImcm91dGVBdHRyaWJ1dGVzPXJvdXRlUGF0aCZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQocm91dGVVcmwpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNbXCJfYm9keVwiXTtcbiAgICB9KTtcbiAgfVxuXG4gIEdldFJvdXRlTWFwRGF0YShkaXJEZXRhaWxzOiBhbnlbXSk6IGFueVtdIHtcbiAgICBsZXQgY29tYmluZWRVcmxzID0gW107XG4gICAgbGV0IHJvdXRlVXJsO1xuICAgIHZhciBuZXdSb3V0ZVVybDtcbiAgICBkaXJEZXRhaWxzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIHJvdXRlVXJsID0gXCJodHRwczovL2Rldi52aXJ0dWFsZWFydGgubmV0L1JFU1QvVjEvUm91dGVzLz93cC4wPVwiICsgaXRlbS5zb3VyY2VMYXQgKyBcIixcIiArIGl0ZW0uc291cmNlTG9uZyArIFwiJndwLjE9XCIgKyBpdGVtLmRlc3RMYXQgKyBcIixcIiArIGl0ZW0uZGVzdExvbmcgKyBcIiZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiXG4gICAgICBuZXdSb3V0ZVVybCA9IHRoaXMuaHR0cC5nZXQocm91dGVVcmwpXG4gICAgICBjb21iaW5lZFVybHMucHVzaChuZXdSb3V0ZVVybClcbiAgICB9KTtcbiAgICByZXR1cm4gY29tYmluZWRVcmxzO1xuICB9XG5cbiAgZ2V0QWRkcmVzc0J5TGF0TG9uZyhsYXRpdHVkZSxsb25naXR1ZGUpIHsgIFxuICAgIHZhciBiaW5nSG9zdCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL3YxL0xvY2F0aW9ucy9MYXRMb25nP289anNvbiZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiO1xuICBcbiAgICB2YXIgZ2V0QmluZ1VybCA9IGJpbmdIb3N0LnJlcGxhY2UoXCJMYXRMb25nXCIsbGF0aXR1ZGUgKyBcIixcIiArIGxvbmdpdHVkZSk7O1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGdldEJpbmdVcmwpO1xuICB9XG5cbiAgc2VuZEVtYWlsKGZyb21FbWFpbCwgdG9FbWFpbCwgZnJvbU5hbWUsIHRvTmFtZSwgc3ViamVjdCwgYm9keSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHNtc1VSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvc2VuZGVtYWlsXCI7XG4gICAgdmFyIGVtYWlsTWVzc2FnZSA9IHtcbiAgICAgIFwiZXZlbnRcIjoge1xuICAgICAgICBcInJlY2lwaWVudERhdGFcIjogW3tcbiAgICAgICAgICBcImhlYWRlclwiOiB7IFwic291cmNlXCI6IFwiS2VwbGVyXCIsIFwic2NlbmFyaW9OYW1lXCI6IFwiXCIsIFwidHJhbnNhY3Rpb25JZFwiOiBcIjUxMTExXCIgfSxcbiAgICAgICAgICBcIm5vdGlmaWNhdGlvbk9wdGlvblwiOiBbeyBcIm1vY1wiOiBcImVtYWlsXCIgfV0sXG4gICAgICAgICAgXCJlbWFpbERhdGFcIjoge1xuICAgICAgICAgICAgXCJzdWJqZWN0XCI6IFwiXCIgKyBzdWJqZWN0ICsgXCJcIixcbiAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keSArIFwiXCIsXG4gICAgICAgICAgICBcImFkZHJlc3NcIjoge1xuICAgICAgICAgICAgICBcInRvXCI6IFt7IFwibmFtZVwiOiBcIlwiICsgdG9OYW1lICsgXCJcIiwgXCJhZGRyZXNzXCI6IFwiXCIgKyB0b0VtYWlsICsgXCJcIiB9XSxcbiAgICAgICAgICAgICAgXCJjY1wiOiBbXSxcbiAgICAgICAgICAgICAgXCJiY2NcIjogW10sXG4gICAgICAgICAgICAgIFwiZnJvbVwiOiB7IFwibmFtZVwiOiBcIkFUJlQgRW50ZXJwcmlzZSBOb3RpZmljYXRpb25cIiwgXCJhZGRyZXNzXCI6IFwiXCIgfSwgXCJib3VuY2VUb1wiOiB7IFwiYWRkcmVzc1wiOiBcIlwiIH0sXG4gICAgICAgICAgICAgIFwicmVwbHlUb1wiOiB7IFwiYWRkcmVzc1wiOiBcIlwiIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICBcImF0dHJpYkRhdGFcIjogW3sgXCJuYW1lXCI6IFwic3ViamVjdFwiLCBcInZhbHVlXCI6ICBzdWJqZWN0IH0sXG4gICAgICAgIHsgXCJuYW1lXCI6IFwibWVzc2FnZVwiLCBcInZhbHVlXCI6IFwiVGhpcyBpcyBmaXJzdCBjYW11bmRhIHByb2Nlc3NcIiB9LFxuICAgICAgICB7IFwibmFtZVwiOiBcImNvbnRyYWN0b3JOYW1lXCIsIFwidmFsdWVcIjogXCJBamF5IEFwYXRcIiB9XVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuICAgIHZhciBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogaGVhZGVycyB9KTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Qoc21zVVJMLCBKU09OLnN0cmluZ2lmeShlbWFpbE1lc3NhZ2UpLCBvcHRpb25zKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRTTVModG9OdW1iZXIsIGJvZHlNZXNzYWdlKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgc21zVVJMID0gdGhpcy5zb2NrZXRVUkwgKyBcIi9zZW5kc21zXCI7XG4gICAgdmFyIHNtc01lc3NhZ2UgPSB7XG4gICAgICBcImV2ZW50XCI6IHtcbiAgICAgICAgXCJyZWNpcGllbnREYXRhXCI6IFt7XG4gICAgICAgICAgXCJoZWFkZXJcIjogeyBcInNvdXJjZVwiOiBcIktlcGxlclwiLCBcInNjZW5hcmlvTmFtZVwiOiBcIiBGaXJzdE5ldEluaXRpYWxSZWdpc3RyYXRpaW9uVXNlclwiLCBcInRyYW5zYWN0aW9uSWRcIjogXCIwMDA0XCIgfSxcbiAgICAgICAgICBcIm5vdGlmaWNhdGlvbk9wdGlvblwiOiBbeyBcIm1vY1wiOiBcInNtc1wiIH1dLFxuICAgICAgICAgIFwic21zRGF0YVwiOiB7XG4gICAgICAgICAgICBcImRldGFpbHNcIjoge1xuICAgICAgICAgICAgICBcImNvbnRhY3REYXRhXCI6IHtcbiAgICAgICAgICAgICAgICBcInJlcXVlc3RJZFwiOiBcIjExMTE2XCIsIFwic3lzSWRcIjogXCJDQlwiLCBcImNsaWVudElkXCI6IFwiUlRUQVwiLFxuICAgICAgICAgICAgICAgIC8vIFwicGhvbmVOdW1iZXJcIjogeyBcImFyZWFDb2RlXCI6IFwiXCIgKyB0b051bWJlci50b1N0cmluZygpLnN1YnN0cigwLCAzKSArIFwiXCIsIFwibnVtYmVyXCI6IFwiXCIgKyB0b051bWJlci50b1N0cmluZygpLnN1YnN0cigzLCAxMCkgKyBcIlwiIH0sIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keU1lc3NhZ2UgKyBcIlwiLFxuICAgICAgICAgICAgICAgIFwicGhvbmVOdW1iZXJcIjogeyBcImFyZWFDb2RlXCI6IFwiXCIsIFwibnVtYmVyXCI6IFwiXCIgKyB0b051bWJlciArIFwiXCIgfSwgXCJtZXNzYWdlXCI6IFwiXCIgKyBib2R5TWVzc2FnZSArIFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzY2VuYXJpb05hbWVcIjogXCIgRmlyc3ROZXRJbml0aWFsUmVnaXN0cmF0aWlvblVzZXJcIiwgXCJpbnRlcm5hdGlvbmFsTnVtYmVySW5kaWNhdG9yXCI6IFwiVHJ1ZVwiLCBcImludGVyYWN0aXZlSW5kaWNhdG9yXCI6IFwiRmFsc2VcIixcbiAgICAgICAgICAgICAgICBcImhvc3RlZEluZGljYXRvclwiOiBcIkZhbHNlXCIsIFwicHJvdmlkZXJcIjogXCJCU05MXCIsIFwic2hvcnRDb2RlXCI6IFwiMTExMVwiLCBcInJlcGx5VG9cIjogXCJETUFBUFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICBcImF0dHJpYkRhdGFcIjogW3sgXCJuYW1lXCI6IFwiYWRtaW5EYXRhMVwiLCBcInZhbHVlXCI6IDEyMzQ1NjcgfSwgeyBcIm5hbWVcIjogXCJjb250cmFjdG9yTmFtZVwiLCBcInZhbHVlXCI6IFwiY29udHJhY3RvciBuYW1lXCIgfV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICB2YXIgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IGhlYWRlcnMgfSk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHNtc1VSTCwgSlNPTi5zdHJpbmdpZnkoc21zTWVzc2FnZSksIG9wdGlvbnMpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VHJ1Y2tGZWVkKHRlY2hJZHM6IGFueSwgbWdySWQ6IGFueSkge1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG5cbiAgICAgIHRoaXMuc29ja2V0ID0gaW8uY29ubmVjdCh0aGlzLnNvY2tldFVSTCxcbiAgICAgICAge1xuICAgICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgICByZWNvbm5lY3Rpb246IHRydWUsXG4gICAgICAgICAgcmVjb25uZWN0aW9uRGVsYXk6IDEwMDAsXG4gICAgICAgICAgcmVjb25uZWN0aW9uRGVsYXlNYXg6IDUwMDAsXG4gICAgICAgICAgcmVjb25uZWN0aW9uQXR0ZW1wdHM6IDk5OTk5XG4gICAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNvY2tldC5lbWl0KCdqb2luJywgeyBtZ3JJZDogbWdySWQsIGF0dHVJZHM6IHRlY2hJZHMgfSk7XG5cbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdtZXNzYWdlJywgKGRhdGEpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG4gIC8vR2V0IFJ1bGUgZGVzaWduZWQgYmFzZWQgb24gdGVjaHR5cGUuXG4gIGdldFJ1bGVzKGRpc3BhdGNoVHlwZSkge1xuICAgIHZhciBnZXRSdWxlc1VybCA9IHRoaXMuaG9zdCArIFwiRmV0Y2hSdWxlXCI7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGdldFJ1bGVzVXJsLCB7XG4gICAgICBcImRpc3BhdGNoVHlwZVwiOiBkaXNwYXRjaFR5cGVcbiAgICB9KTtcbiAgfVxuXG4gIHN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2Uoa2V5LCBvYmplY3RUb1N0b3JlKVxuICB7XG4gICAgLy8gcmV0dXJuICBpZiB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGNvbXBsZXRlIHN0b3JhZ2UgdXNlIHRoZSBjbGVhcigpIG1ldGhvZCwgbGlrZSBsb2NhbFN0b3JhZ2UuY2xlYXIoKVxuICAgIC8vIENoZWNrIGlmIHRoZSBzZXNzaW9uU3RvcmFnZSBvYmplY3QgZXhpc3RzXG4gICBpZihzZXNzaW9uU3RvcmFnZSlcbiAgICB7XG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9TdG9yZSkpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3JlRGF0YUluTG9jYWxTdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShvYmplY3RUb1N0b3JlKSk7XG4gIH1cblxuICByZXRyaWV2ZURhdGFGcm9tTG9jYWxTdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgICAgdmFyIHJlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICBpZihyZXN1bHQhPW51bGwpXG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2Uoa2V5KVxuICB7XG4gICAgaWYoc2Vzc2lvblN0b3JhZ2UpXG4gICAge1xuICAgICAgdmFyIHJlc3VsdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgIGlmKHJlc3VsdCE9bnVsbClcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG59XG4iLCJleHBvcnQgY2xhc3MgVHJ1Y2tEZXRhaWxzIHtcbiAgIHB1YmxpYyBUcnVja0lkOiBzdHJpbmc7XG4gICBwdWJsaWMgRGlzdGFuY2U6IHN0cmluZzsgIFxufVxuXG5leHBvcnQgY2xhc3MgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxze1xuICAgIHB1YmxpYyB0ZWNoSWQ6IHN0cmluZztcbiAgICBwdWJsaWMgc291cmNlTGF0OiBzdHJpbmc7XG4gICAgcHVibGljIHNvdXJjZUxvbmc6IHN0cmluZztcbiAgICBwdWJsaWMgZGVzdExhdDogc3RyaW5nO1xuICAgIHB1YmxpYyBkZXN0TG9uZzogc3RyaW5nO1xuICAgIHB1YmxpYyBuZXh0Um91dGVMYXQ6IHN0cmluZztcbiAgICBwdWJsaWMgbmV4dFJvdXRlTG9uZzogc3RyaW5nO1xuICB9XG4gIFxuICBleHBvcnQgY2xhc3MgVGlja2V0e1xuICAgIHB1YmxpYyB0aWNrZXROdW1iZXI6IHN0cmluZztcbiAgICBwdWJsaWMgZW50cnlUeXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGNyZWF0ZURhdGU6IHN0cmluZztcbiAgICBwdWJsaWMgZXF1aXBtZW50SUQ6IHN0cmluZztcbiAgICBwdWJsaWMgY29tbW9uSUQ6IHN0cmluZztcbiAgICBwdWJsaWMgcGFyZW50SUQ6IHN0cmluZztcbiAgICBwdWJsaWMgY3VzdEFmZmVjdGluZzogc3RyaW5nO1xuICAgIHB1YmxpYyB0aWNrZXRTZXZlcml0eTogc3RyaW5nO1xuICAgIHB1YmxpYyBhc3NpZ25lZFRvOiBzdHJpbmc7XG4gICAgcHVibGljIHN1Ym1pdHRlZEJ5OiBzdHJpbmc7XG4gICAgcHVibGljIHByb2JsZW1TdWJjYXRlZ29yeTogc3RyaW5nO1xuICAgIHB1YmxpYyBwcm9ibGVtRGV0YWlsOiBzdHJpbmc7XG4gICAgcHVibGljIHByb2JsZW1DYXRlZ29yeTogc3RyaW5nO1xuICAgIHB1YmxpYyBsYXRpdHVkZTogc3RyaW5nO1xuICAgIHB1YmxpYyBsb25naXR1ZGU6IHN0cmluZztcbiAgICBwdWJsaWMgcGxhbm5lZFJlc3RvcmFsVGltZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhbHRlcm5hdGVTaXRlSUQ6IHN0cmluZztcbiAgICBwdWJsaWMgbG9jYXRpb25SYW5raW5nOiBzdHJpbmc7XG4gICAgcHVibGljIGFzc2lnbmVkRGVwYXJ0bWVudDogc3RyaW5nO1xuICAgIHB1YmxpYyByZWdpb246IHN0cmluZztcbiAgICBwdWJsaWMgbWFya2V0OiBzdHJpbmc7XG4gICAgcHVibGljIHNoaWZ0TG9nOiBzdHJpbmc7XG4gICAgcHVibGljIGVxdWlwbWVudE5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgc2hvcnREZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIHB1YmxpYyB0aWNrZXRTdGF0dXM6IHN0cmluZztcbiAgICBwdWJsaWMgbG9jYXRpb25JRDogc3RyaW5nO1xuICAgIHB1YmxpYyBvcHNEaXN0cmljdDogc3RyaW5nO1xuICAgIHB1YmxpYyBvcHNab25lOiBzdHJpbmc7XG4gICAgcHVibGljIHBhcmVudE5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XG4gICAgcHVibGljIHdvcmtSZXF1ZXN0SWQ6IHN0cmluZztcbiAgfSIsImltcG9ydCB7IFZpZXdDb250YWluZXJSZWYsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgT25Jbml0LCBWaWV3Q2hpbGQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbi8vIGltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IFJ0dGFtYXBsaWJTZXJ2aWNlIH0gZnJvbSAnLi9ydHRhbWFwbGliLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBOZ3VpQXV0b0NvbXBsZXRlTW9kdWxlIH0gZnJvbSAnQG5ndWkvYXV0by1jb21wbGV0ZS9kaXN0JztcclxuLy8gaW1wb3J0IHsgUG9wdXAgfSBmcm9tICduZzItb3BkLXBvcHVwJztcclxuaW1wb3J0IHsgVHJ1Y2tEZXRhaWxzLCBUcnVja0RpcmVjdGlvbkRldGFpbHMsIFRpY2tldCB9IGZyb20gJy4vbW9kZWxzL3RydWNrZGV0YWlscyc7XHJcbmltcG9ydCAqIGFzIGlvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgeyBmYWlsLCB0aHJvd3MgfSBmcm9tICdhc3NlcnQnO1xyXG4vLyBpbXBvcnQgeyBUb2FzdCwgVG9hc3RzTWFuYWdlciB9IGZyb20gJ25nMi10b2FzdHIvbmcyLXRvYXN0cic7XHJcbmltcG9ydCB7IE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvc3JjL21ldGFkYXRhL2xpZmVjeWNsZV9ob29rcyc7XHJcbmltcG9ydCB7IFRyeUNhdGNoU3RtdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyL3NyYy9vdXRwdXQvb3V0cHV0X2FzdCc7XHJcbmltcG9ydCB7IEFuZ3VsYXJNdWx0aVNlbGVjdE1vZHVsZSB9IGZyb20gJ2FuZ3VsYXIyLW11bHRpc2VsZWN0LWRyb3Bkb3duL2FuZ3VsYXIyLW11bHRpc2VsZWN0LWRyb3Bkb3duJztcclxuaW1wb3J0IHsgc2V0VGltZW91dCB9IGZyb20gJ3RpbWVycyc7XHJcbmltcG9ydCB7IGZvcmtKb2luIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQgKiBhcyBtb21lbnR0aW1lem9uZSBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xyXG5pbXBvcnQgeyBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyL3NyYy9jb3JlJztcclxuaW1wb3J0IHsgUEFSQU1FVEVSUyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvc3JjL3V0aWwvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IHNoYWxsb3dFcXVhbCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlci9zcmMvdXRpbHMvY29sbGVjdGlvbic7XHJcblxyXG5kZWNsYXJlIGNvbnN0IE1pY3Jvc29mdDogYW55O1xyXG5kZWNsYXJlIGNvbnN0IEJpbmc7XHJcbmRlY2xhcmUgY29uc3QgR2VvSnNvbjogYW55O1xyXG5kZWNsYXJlIHZhciBqUXVlcnk6IGFueTtcclxuZGVjbGFyZSB2YXIgJDogYW55O1xyXG4od2luZG93IGFzIGFueSkuZ2xvYmFsID0gd2luZG93O1xyXG4vLyA8ZGl2IGlkPVwibG9hZGluZ1wiPlxyXG4vLyAgICAgPGltZyBpZD1cImxvYWRpbmctaW1hZ2VcIiBzcmM9XCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhrQUdRQWFJR0FQLy8vOHpNekptWm1XWm1aak16TXdBQUFQLy8vd0FBQUNIL0MwNUZWRk5EUVZCRk1pNHdBd0VBQUFBaCtRUUZBQUFHQUN3QUFBQUFrQUdRQVFBRC8yaTYzUDR3eWttcnZUanJ6YnYvWUNpT1pHbWVhS3F1Yk91K2NDelBkRzNmZUs3dmZPLy93S0J3U0N3YWo4aWtjc2xzT3AvUXFIUktyVnF2Mkt4MnkrMTZ2K0N3ZUV3dW04L290SHJOYnJ2ZjhMaDhUcS9iNy9pOGZzL3YrLytBZ1lLRGhJV0doNGlKaW91TWpZNlBrRWtBQVpRQ0FnT1lCSnFhQloyZW53V2FBSkdrYWFDbnFLa0ZvNld0Wktxd3FheXV0Rit4dDU4QnRidGR1TDY2dk1GWXZyakF3c2RUeExmR3lNMU95ckhNenROSjBMRFMxTmxFMXFyWTJ0OC8zS25lNE9VNjRxams1dXMxNktmcTdQRXc3cUR3OHZjcjlMbjQvREg2bnZaMkFCZ2dZRlkvU1A4NkJkUWhvQk1CQVFzUERrcFlJT0lOQUtBZVdwVG9oLy9peGhvRFVHbmt1QVNBd1NBZWlRU0FOWkprRVpPVWlxUWNRdURXdzVNdWVjQ2tGQUNuRDRvQ2hqVDBkVE5uajBrOGVmcmtBVlFJZ0pyS0NCck5nVFJwMGlGTmc0VGtOdURqMUJFN3JTWmRlaTVoVUNBcjBiWDg2cUtxV0t0Q3N2NkE2dTRoV3hadTMxb2xpME51ajZIL3V0NDlFVmJ2Vzc0Mi9BcWsrNi9vWUJGNURZdEYzTTdzajYwVVExRitUQ0d5NU1QaExQZEltN25BV2M0ZFBIOStHL3JmNlIyTUV4SkFuVnIxNnNrL1JlOGduZGtyYlFPMmI3UHVvZmhpN01DL05RUVhqcHVwN2h5QU0yOU96bUE1ODczT1hlOHUzZWsxOVFyV3J5dk5ycys3RGN3VUNVei92aUM4K0o0N0tBN1F3WHNtZXd6dmhjZFBPQi9IVSs3L3M5MlhnWHZpclpjUGY5QnhWNUdBR3VSM1cxbkkzVkFmZ2d3TzZPQm5CcVlnSHc3b1VaUmhoY0JkS05tSEpteG93NFRhZ1dpaGlJYjFSU0VOLzVXbW5vcktzYWdYaVNTWVNFTjA5dEY0QVlIaTNhQ2pEQmh4MTUrUEs5cUlYV1VSenRCaFFyNGhxU1JvTkF3SkE0cjZISWxra2xOU2dtTUlWcloxbkQ0emJybEJsMHZLRUdZTFBENW5KZ1pBWGxmbGl5OFVLZU9icWFFNW5wcDB1dkRrUDFIaUdTZHpNNlFYQTViMGFJbG5qWHJDNTQ5c01ZeXBUNkNMR3RDb2w0ODJCa09iS1ZiS3dhQzNmY21Cb1dJQ0tLcW5senJxQXFrdC9EbXBweCtBK3VBTHJLNkFhRjJ3Z3BEcXFSalVxb0trOUZDYWE0aVgwZ29wQzV4bU9Td0kvN0ppdU9xeEtzUllHcS9ETnVzc0M3NmU0Q285NWkyN2diV0dVVXRCdGlYY3FwYTR5KzZLTGJRb0FPdU9zTjYybCtxNm1xWmdyamdCeGh1Q3VpcVFDNW03Nk1DcnJ3TGd0dGd2dXlWczY0NmlBM3RRTUpVbytLdXJnbVUyekN5L0owajhBY0RpZEd2eHAvTkdqTEFJOTNKVDhjZTZYb3B1QTVtWklHMXZLSU1WY29rVW1aQnNvakdUZ0hHT05ldXM0SUk1UTdhekNDMlRvREE2SGdmTndkQmc5a3d5eFNzSC9UREVSRHZOTE1mY0pDMkp3TWRNTFZZSlJZZHdNNjVSTkRSQTFMVjRuV1lJbUxUdDl0dHd4ODN3MGo5emZTSmRXc3VqOWxWWkhDM08zRWdFRUJzQmRnZkR0QlFsYzFONERBT2xJcGdiSnBWMCtCTXZGMmNFQVA5akZ3QzRHVldoemNMa1RtU09yK2ZJY2t3NEczbVJuc0xlZTBwaFoybUx0eUE0TVdldjRabnFoTTFjTnNWSkJPRDNLWGwvRVJ6dUpMQ082UlFDWUsxTTdLdi9MaEx6U29UNmtwN0V3eWc2N1pkZkQ4dm13Z3RYL2I1VFJwNUY0L3A4cjZ2eXNRU3ZSWnptNTJsait4S2lqNHI2OGFjSC9mVHZ3ZCtnaVBwREo3OG5KL01CK1RKRFB5czBTM3dDZEZEL0JPSzhmUUFCY3o4N25SamVoNVlDTFhBMERjeVhENUwzczA1d0R3dFR1NkFFZ0NUQ0g4eHVHU2I4WDhmQXNMY1NQaUE4TGd4QzVqNDRBOTkxOEJTMTh3THJFT2lmYThWaGdCbUpZWFVhYUxrckdPOTRWQW1YSFU3NGlRTGlSWHVtNnNJUld5ZWg1dUNCaVJxOEFRZi9iNWcrTGt4eGJUQWFTeDhnQ0xUNmNkRW05OVBCRjhGWVExWDVBWE00c09FWmZlRkVKYXlSYWtRU1lpQ0FPRWViNkRGM3FmTGh3S0RZeDFDazhTS0JETlVmMThIRVFzYkNMdXRMcFBmU3BjSXpGbVFMZDJUT0lxZkJSMGVxSW9lWWxHVCsza1JHVHo3eWtEb1JaZjQydVlzdG1sSVZrQXhESmd1a29rYStFaFdnRkVOaFZDbTkrOGp4bG81REpmNTRxVW5xZEJLWUFCUW1FbVo1SFI3ZXBaVElCQjRjZGtuTUVUM0dsdEgwSUN1UFVzMWlUZ1diMlh4Y0haalpUSmNjTTVvU3hBTTF1NG5IZTBBem01NjRKQi9JNmMxN3VCS2UydHdqTzN2SnlFcHlNWjJDb0tjaXpVSElQc2F5RUFKZHpUYW42YytmeVRNUkNiMFJPeEozLzhaY0xpS2liUHhHUTJXalROVHRVNHp4b0tpQzZvalFqM2JVRUVTVXowSmx5YzZWMHVGMWN4UW5MK2paajRLcTVhVHE1S1ZMeDdsUk9uNWpqVHRkNGcwdFNvMTFobzhqS1NVS1R2WFpxS0RlUWFTNEFHZzg5cGFUcEtyaW9mZ3c2aWpOMlZQTk9mVU9ENXVLVFQ4aFZaSlk2NnQ2cU9SQnA2SlZhMzRGcXFaQjZ4OEdKVmM5TkZDbXFDRlFYZlZRc3JMK0pqeWN5UnhKMlNwSXRsVE9FMFFWa0cxb015RzgwaWd5ZS9VRFhmenFJN2RFMWc5cHdlcWlrUElkemNMcXNrb0xyV2hIUzlyU212YTBxRTJ0YWxmTDJ0YTY5cld3amExc1owdmIydHIydHJqTnJXNTN5OXZlK3ZhM3dBMnVjSWRMM09JYXR4RVlMWmFaa3R2VUd2K1lWSGVWZmE1eTJ5aGROSkd5dW5weUxuYTdkTjN0VGttNzNyVlJkOFBMSXZDUzkwTGpQYStEekt2ZTk2UzN2VUdpQVh6WHU5ejU1b2U5OXAzVmxwamJLUHptOXpQdi9TK0E1U3RnL2RTM3dQcVZBWUlUSE4wRkQ1aTZEdFpMZ0NQTU53aFRHQzRIdnZEWENLeGhETyszd3h1Mk1JZ25yR0gvbGpqRElJNEpoMU84MUhMd043c3JUakdKTDJ4aUdxTll4akVlOFkxMUxPSU96NWpDTlFieWpuMmNZeUovbU1VcTd2R0pqNHprSUVmNHgwOHU4cEtSOUdMclhzUWtXTTZ5bHJmTTVTeXpFOHBON2JLWXg1emw0NXI1ekdoT3M1clh6T1kydS9uTmNJNnpuT2RNNXpyYitjNTR6ck9lOTh6blB2djV6NEFPdEtBSFRlaEMveGIvdEliR1M1TC9pbWhJaEtYUmVrQUtwQmtCMmQ5a0ZFU3FtYlFkYmxmWjRYSEdOczVrRDJBZnN4eE56N09lWDNHUHFjSHEzcnZRTXEvNVdYVWI2RXBxL3IxVmdhbFdFbUZ0YmM2ajl2cDlzaVlEVlgrdHBHQ3pVR1ZtYmU1VUEybnNNVERiSEVDVnlCZERqWXhaTmhzTXFydzJGTWpaRDJacVczTGQvSFlrd3oxVGsrTGpvK0oyU25MVGJjRG5zcHViMVgzM0ZMQXJiMFJ1dDk3YjlpNitHVmRsS21xajMwZzBCTUQ5blkyQkI1eXA1TjAzNWRxcjhCSzBGZDFaTlhoUEdoNENnMU9iSFJKM0k2dlBTL0YycTdmamNQcDRya1UrQjRzUDV1SG9CamtFSks1eUtUSjgxaVQvNjh2VFlQTDdaSnppRm0vNUdWZytCcDQvMXVjNi8rUTRtQ0VlOUh0N2l1WHBmdkhGaHh4dmw3dGJYMEFIb1VsMXZvZWJqN3VhSlZ3NnhtUHVjV0s2OE9EempPSEF0VzN0SGhJOHB4b1BJNzFES1VrOXR2T2xIcjV5MDltT2JEWGVpT29qZkx2YWlVNTM2Z21rc0pBRGRTcjN5ZTRXd2h2d2FyQk9BckhlUFY4UGZwSzJnL3poUlNudmdtbmR5WHBucVp4K2dISUtob0ZGQzVWVnd6dC82U1Ftc3VlNERnTG9kWGtobHg1UjRld2JndVVMdjNyWisxM1ltZ3hxbDc0ZFFpS1FucCtvVitnd0hWOEZ0VjJ1MkdoQVBPZEJCMjQwb1JWY05KZm9FWTVJQmVvdk0vVm9xUFQwbVc5SDdpKy9uSWtIYWVEcVhuM3ZDMUN2SG8zczY3dCsrKzRMZjlaTU1IL3oyKzkrZzBrYnVsVUk1UC9DTTc5MThsZWN6QUJZWmhVbmYwNVJlc3MyWFNURFhVS0RnRTNRT2NubWYrRHpYUXVvYk50MmVZd0VnUkdvYXpLRGdiUzFmdVdpZ0NOQWdLc2xnaGRnWlJ0SWdiVmxmU1pnZ2ljSVk3WkZnaVVJZ2kzb2ZMYWxnaXNvZ3pPSWc3RGxnU2ZBZ2pyRGdhMWxQTGpqZ3psSWZLNWxnejJvZ3lHSWY2d0ZneGxBaEVXSWZLK0ZoRWtvZ1NoQWhhcmxoRStvaEQrSWdxb2xoTExEaFZIb2VWK29oVnRvaGZZQ2hLUUZobUdJaGxkb2h0NkNoU2dBaFM3RGhLTUZoMmVvZ1oramhsSmpoM01vaGc3bmgwR0RoM2tvWGk1QWlKdkZoMVdvaDRxbWlCYURpUGdCaUhYb2hYMUlpWHZvaGl2QWc1WFlYd29taVpQSWlVckRob2ZpaVRmL2FJa05JNGVYeUlodElZanhBb243ZzRrdElJb2ZJNHVqQ0l1TmFJcmU0b3F2cUlwMXdvcWY1WWdxUUlkdFNILzY0b3UyUW9wdnlJQnhDSXpCaUl6SlNJelZZb3pIYUl1cnlJeFVabzFwU0kzVkNJMUhoNDNaeUl1ZGlJdHZJbzJwYUlnMmdJcE1WM3R4NUl6UjRvMENRbzdsV0Y1bUI0cVZRb3Nud283dEtJNHFZby8zS0lVNW9JdTd4bzJZaDJyMkpwRDc2STdUU0liL2lKQzB3VG8rc0h1UDU0SkRSNUFMNlk5MnA0OFY4bnNQeGdNUU9SckttSTRVV1pFS2VaRUcyV0RZNTVFV3VSc01hVXdueVpGR1NKSTBtQ3NhbVhZcW1aSi81M3g0QjNlRW9ub3ZXWk0yR1kzdlYwRS9DWk90aHpJUE53UWRLWlFLbEpOanBFUkN0cENVM3hkcm82VjlUOW1URVNsNVUybFpLbUdWTHVrOVRDbHdrK0JVVVBsQUE4VmFYeldXU25rWVgxbExYSG1WU3JHV05JS1daRGtXY09ramNobVZGbWhvZDhsNWVabG9lNWxvVHZDWGdCbC9iVG1ZU3lDWWh0azdoWm1ZNHplVWpCazlpL21ZUllDWWtybVZqbG1aUmtDWm1NbVRsN21aU0JtWm5tbENvQm1hS0RtU3BQa1NXbGFVcDdtYXJObWFydm1hc0JtYnNqbWJ0Rm1idG5tYnVKbWJ1cm1idk5tYnZ2bWJ3Qm1jd2ptY3hGbWNHSkFBQUNINUJBVUFBQVlBTExVQUZ3REZBTDhBQUFQL2FMQWIvakJLUTZ1OU9Pdk51LzlnS0k2alpKNFRxYTVzNjc0dEtwOXdiZDk0ZnMwOEJPakFvSEJvNlJsL3hLUnlTVEwya015b2RHcHc4cURVckZabm5XRzM0RENySy91S3orZ09HV1ZPdTkvVnRha05yNGZsYzdzZWpaZlE5NEJNZlJGL2dZWkRnejZIaTRLSkRvV01rVFdPajVLV1FKUUJrSmVjSlpTYm5hRWVtYUNpcGhta3A2b2lxYXV1YXArdnNocXRzN1lVdGJlenVicXZ2TDJydjhDbndzT2l4Y2FkeU1tWHk4eVN6cytNMGRLSDFOV0IxOWg3bVFIYm9kM2Z5cG5pbk9IbGx1Zm9rZXJyaSszdWh2RHhnUFAwZXZiM2RmbjZiL3o5YWY0QlBDTnc0QjF5QnUwVVRLaGxJVU1xRGg5S2lTaXhFYVdLYmloaVRLSngveU1paEI0UFhnd3AwaEhKa29sT2d1bW9FZ2ZMbGpaZXdvUWhjNmFMbWpiSGdNeTVCQ2ZQSmp0L0V2RXBOQVRSb2grT0lvVTFjcWtRcFU1cEJZM3FjaXJWcTFpemF0M0t0YXZYcjJERGloMUx0cXpaczJqVHFsM0x0cTNidDNEanlwMUx0NjdkdTNqejZ0M0x0Ni9mdjRBREN4NU11TERodzRnVEsxN011TEhqeDVBalM1NU11YkxseTVnemE5N011YlBuejZCRGl4NU51clRwMDZoVHExN051clhyMTdCank1NXRTVUNCMjdoejY5N051N2Z2MzhCL0N3aHBPN2p4NDhpVDZ4NUFYTG56NTlCdk0vZFlQTHIxNjcybmI2eU92VHQyQXMyOWk3Y09udnI0ODgvTGIwZlBIcmw2ak56YnkrZjl2bUw4K2ZoeGg4L1AvL2IrL21INS9RZmdmQUlPMkY2QkJxS0hZSUxqTGNpZ2R3NCtpRjJFRWxwSFlZWFFYWWloY3ZWSmROK0c1R2tJNG5FZFB2VGhpT21KaUNKd0pUSjA0b3JKYVFjZmpOZkphRjl2Qk9TbzQ0NDhFakRBajBBR0tlU1BBaFJwNUpGSUNtQ0ZCUWtBQUNINUJBVUFBQVlBTE9nQUpnQ0FBQWtCQUFQL2FMcmMvcEFGRUt1OU9Pdk5JUWdnUUhWa2FaNG1xRTRqNnI0d3VjNWliTis0OHMxMG0vOUFEVzg0Q1JxUGp4MlI1ME02Yzh0bzgwbEZSYS9GcXJha3hCSnIyM0RHNjUyS3o0c3VXWXB1TDlacnM1c0toOC9GNnZwU2ZqL3F5WDFiZVg5TWdWcUVXSVpWZzRncWlsU01qVm1QU0pKTGxFNlJqWHlZTnBaRW5VZWFpSnloTHFPSXBrR2ZRNnBBcUgrbHJpbXNNN001c0hxeXR4MjF0cnlldmlxN3dCbTVlc1V4d283Skw4ZHd4TTBXeXlEU0x0U1QxaVRQZHRxMHk5SGVEZHhrNGVJUzFPY3kxT2JxNUlEcUhOanQ1KzllOGZMcCtFTHMrOGJZL3NiMEMyakJYaUtDMHdZaWhJQXR3TUlJQnE4OGpEQnZZaEtBRmgxVXpNZ2cvMklVamgwM2dqUWdFcVRIU3lNVmxPUjRFbFRLbGtQb2lXdVkwZ0RNUWlsWFpyejVLNmRDa3hocjhneFJNMlN0b2hvL0liMjRhYW1IVkU0cDZvcGFnUnZWQzdsa0NqMTRWYURMcmhvR2FhV3FCcXlKSFdQTnBqWEx0cTNidDNEanlwMUx0NjdkdTNqejZ0M0x0Ni9mdjRBREN4NU11TERodzRnVEsxN011TEhqeDVBalM1NU11YkxseTVnemE5N011YlBuejZCRGl4NU51clRwMDZoVHExN051clhyMTdCank1NU51N2J0MjdoejY5N051N2Z2MzhDREN4OU92TGp4NDhpVEsxL092SG5Pd0FFS0VCRHdsMENCNndRYzdvMSt2ZnVBdmRhN2k2ZCtWNEQ0ODlLMTAwWFBmb0I2dUFQWXkvOE9sN3Q4K2VUYmhyOHZQenRiOC8vOEJlZ2VXUHNGeUY5K1RnRm9vSUhUT1dYZmdndjZWMVI4RUZaWUFIMGpQV2doaEFoYVZPQ0dFRW80a1lJZ2JpZ2lRaCtXYUNHR0FWR280b3NkcXFQaGl5V2VlRTZLTkpZNDREa3o1dmdpaTliZzZLT0tEVnBENHBCRDJnaU1BRUlpcVNLUXhSenBaSTR4QXVQaWxEa1cyVXdBVFdKcG9aSzhjT21sajFBdU9hYVBWZkp5NVprZ2dubExBR3V5dWVKN3hZZ3BwNDdhTUhsbmlXbmVJdVdlRE5KWlRKeUFDaWhvbUlRV2VsK2ZzOWlwS0lPTXV2TG5vK3k1ZVV1aWxKNVhwcFdaR25ob21GMVNhaWt2ZW5aNlhxUm1tb3JkcDlaZ3VpZXFXN3A2SmdFTE9Rb29yTjZVZXVlbUFVMDZKYTd4eUVvanI3V0dXaU9yRTltS1psUXl2cHFJTEVqQ0dnaXNSWEQrMkpheUVUNjdsSzRMVGx0VXMrSVJhNWFzbzdKVjdYeDVZYnRqWGlTV094ZUYzc0tGYXdJQUlma0VCUUFBQmdBczZBQmhBSDhBQ2dFQUEvOW91dHorTU1wSnE0WGc2czI3NzBBUWZHUnBuazhvQmhucXZqQzJ6bTFzMytTc3MzanZVNnJkN0Vjc0dvSkNtbkVaUXlaMXpLakorZFRWcE5oTGRjdkxlaVZVN3U1TGJvVEZ1MnNaZTBZTDFldWxldzZQLzlyelpOMXV3K2VmZkQ1K2YwOTdnU1dEaEZXSE1JcU9Jb2FNR29tUGk1SWZsSlZWa1pjeW1wK2NuUXVabjF5aG9xV3BJcUpncXFtbmg2U3VtNndwczZDMUQ3ZWZ1UTZ5dTJtOURML0FTc0lLeE1Vcng4aktqckNCem9yUWZNbksxSGJXeXN4SDBvVFljZDUvNEd2YXdPUmw1c0RjNnJ2b1pPMno3MnZpYVBOeDhiemN1dlY2KzU3OVZ0eVRGSERaUHdvQkI0cktaK3FnQm1rS2V6RVU0dEREdVlvZUpuYkJhUEgvRlVjVHBUNmVNQmRSNURPUkwzNlZSTGtnejBxV3pjUzhoRGxxeTB5YURDemh4QkhtNXM0R1ZuNFNVZUZUYUFxalNKTXFYY3EwcWRPblVLTktuVXExcXRXcldMTnEzY3ExcTlldllNT0tIVXUyck5temFOT3FYY3UycmR1M2NPUEtuVXUzcnQyN2VQUHEzY3UzcjkrL2dBTUxIa3k0c09IRGlCTXJYc3k0c2VQSGtDTkxua3k1c3VYTG1ETnIzc3k1cytmUG9FT0xIazI2dE9uVHFGT3JYczI2dGV2WHNHUEx0aUNnclFBQ0JVYWtEWUM3UUFFQ2FRZjRIbDZnZGxrQnhJa0RIM3M3ZWZJQllYazduNjY3cS9EcDA2RnpSWTY5ZS9XcjBydDNYMjQxd0hYeDRvMVRQWThlUFZYdTdlTnJmeG8rdnYzdlMrSGJ0MCtlYVlEOS93RG05cFIrQVlyWEgxTzlGWWllZXY0cEdCOVU3RG1ZSFgwU29vZWZVZ1JXcUJ4VUNXcVlISU5ML2VlaGN3Y3UxZUdJdm9Hb2xJZ29FbmRoVWhtT09GOVRKNkw0SWxJc3R2Z2Joem9PcDJKU09iWllvbElSb2pnamdqMzZkcU5STVhvNFpGSTFqcmlrVUVHaStDUlNSWTc0STVSSkZnQlZreG9lYVdLWFUvNVU1WWhYR3BXbGgyWCsxR1dhUW9GWjRaWklSY2ttaFVtS1NTU1pVTDM1WlpkMEdtVm5oWENhMmFXZVNhMnBZWnM0bmVraG9rakpLU0dqT0EwcVlhRTdPYXBob0VJcFdpRlVtbFlJS1pOOFBtV3BnNWcyV3FwVHB5cVlLazJoU3NqcFQ1NUtHRldyQlk1SzVhbzBKdmtxVExFNk9PdE90YnA2YTVMRDRpUnBnRGNFSkxzVHJ2SlJhcWlHelZwVjdIZ0NTTXRscnRwaUdPQUF6ckxLWDdoNEdraHVWSW8yMisxVTA2bHJsbjd1b29WYnZMdWR5MHdDQUNINUJBVUFBQVlBTExVQXVnREZBTUFBQUFQL2FMcmMvakRLU2F1MUlPak51LzlnS0k0aWNKMW9xcTRZNmI1dy9MRjBiZDlNSnU5OHIrSEFvRENpOHhtUG9hRnlpU3NpbjArbWRJcHlRcTg5cW5ZTHNXSy9NSzVZN0FXYlJlTTB0WHh1ZDlUd0pkdE5qOXVEYzNyN3pyZmw5V1o5Z2l0L2dGK0RpQ2VGaGxlSmpoU0xqRkdQbEErUmtrZVZtam1ZZXB1Zmw1MVpuNXFob2p1a3BhZDdxWlNtcTJHdGo2K3dMckt6dFdDM2pyUzVhTHVJdmI0Z3dNSERqY1dDd3NkdnlYM0xQQURTMDlUVjF0ZlV6dHJiM04zZTMrRGg0dVBrNWVibjZPbnE2K3p0N3UvdzhmTHo5UFgyOS9qNSt2djgvZjcvQUFNS0hFaXdvTUdEQ0JNcVhNaXdvY09IRUNOS25FaXhvc1dMR0ROcTNNaXgvNlBIanlCRGloeEpzcVRKa3loVHFsekpzcVhMbHpCanlweEpzNmJObXpoejZ0ekpzNmZQbjBDRENoMUt0S2pSbzBpVEtsM0t0S25UcDFDalNwMUt0YXJWcTQ4RWFOM0t0YXZYcnp3TGlCMUx0cXpaczJIUHFsMDdOaTNidDJYZHdwMHJkKzdidW5iWDRzMkxkaWZmdHdUMi9oMGIyTzlndFlWMUhrWXMrSERpbkl2UFBzWVoyZXprbTVYTFhyYVptZXptbXAwSk54NzhtV1pvc2FWbm5pNlFXdWJxMWpGZmovNExHNlpzdzZGcnYxdzlZRGJmM3JnN0ExZDhlamprNHI3ekdxZU1QSGptNVppYkV3OE5uYlAwNDlTVDI2ME8ranJ6N000ckM5QStkM3o0eU9hbmQwNlBmVDE1dU95L3V6Ky9PSDcwMFBhdDQzLy9Obi8zL1YzMEhlYWZhYWNOcUZxQi9MRVZRSUpyTFJqZ1lBNnFsMW1FN1UzSW9Gb1V5bWZoZzM5bGVGOW5IdW9ING9WbmhmamZpQnp5WlNLQm9hMTRZSXNrbXVXaWE2Zk5HRnVOTWNhVkkxazlyZWJUQmxvTklDUUJSQklKbUc0dkpRQUFJZmtFQlFBQUJnQXNZQUR1QUFnQmVBQUFBLzlvdXR6K01NcEpxNzA0NjYwQS8yQW9qbVJwbmhrUUJCN3F2bkFzeitacXQzU3U3M3l2cVRhYmIwZ3NHbDNCSk83SWJEcWZ3R1J3K2F4YXJ6Q3Bsb1h0ZXIrYXJSaE1McHVqWWluVnpHNGIwL0MxZTA2UG9lRmJlWDNQQitIL2VuMkNneEozZjJLQmhJcURob2RwaVl1UmM0NlVLNUtYZkkyVmo1aWRiWnVna0o2alJwcWdlS0trcWp1bnJRR3JzRVd1cnFteHRpU21zNGUxdDcwYnVzQzh2c01UdWNDVXhNa2Z4OHpDeXNuR3pKWE96NzdSMHNqVjJoSFgySURiNEE3ZXg5VGhxOTNqY2VibTZPbGo2K0h0N21ydzRmTzA5ZHZ5OTFQNTJ2djhMUG1yQnBCZnVZR1hDdDQ3aURCU3dGQU5vVDJjRmxIaVJFY01Leks2aUZILzR6Q09qangrQklsS3hnQUNBa1JhVVpndUk0VUFCV0lTZUtVU0Nra3RMaWtRaU1selFNMHFMTW5GZ01temFNcWZUbTZ1eURsaFo5R2lNNUUyQ2RwS2hvQ25XQXNNb0NtMUZFZW1FcktLOWRuMUNOV1FNUWFJWFh1MGJKR3o2cktzblJ2VnJheDVKdWZxM1dxWENGeDZjdlVLYnR1M3g5K2xNcHdLMW91eThKQy9ZQ0ZjWFV5NXJtTWV3UkpUM3F6MXN1RlpWamx2SnV1WlI4SElENGlLWHN5MXRHbUthVmN2SnV6Njh5RVpxbVd2SlZEN3lMY1lpbldMYmQzN01SemN3dWtXbjVwSGMvTGh5NTNjUWYxZzhuT3NwS00zdVRIanVsanRWNmcvVU92OUtXM3dwSEtYTDhBYmZTenk2Mk1TZCs5SmZmbjI5RlVGWHo4Ly95WHIvL0ZsNTE4biszbUgzNENkQUxqZWVRaEdFaDlQQnpZb0NYeng5U2ZoSVBaNUorQ0ZpaFRvbllVYzhwSGhkUXlHMkllSHowVm9vaUFLbGxmaWluV2dtSnlLTU81QklYODFZdmhnVEJ2bVNNZU41ZmtveUlqUHZTaWtHVElLUitPUmJCQ1pISWhNa3BHa2JrdEdTVWFMSDFwSng0NmRhZWtHa041NTZZYVR3aGtwNWhWZ3BuaG1rMXhDdVdZVlU4clc0NXRYWUhtZG0zUTJFZWRxYytiNWhKMHordmtGbWJxWkthZ1JhUVo2S0JhRXlvYm5va1BzS1ZxZmtNclNacVZXU01xWm9aanlBS2lTblZaeGFhaE9DS0RwWWxXU09rUUFpYTcycUtxZW5qb1dyRmV3K2h5dGpKNVVLSzVkMkNwYXFyd3lZU3BucndaTGhLK0NBV3RzRXlQRDZsWHNzckkwbXhXbDBGYUJMRlRWdGlIQWpaeG1XMFd6eW5xTGhhblBpb3RDQWdBaCtRUUZBQUFHQUN3bkFPNEFBZ0Y5QUFBRC8yaTYzUDR3eWpiSXZEanJ6YnYvWUNpT2tWQ2NBcW11Yk91K3NCZ1E1Mm5GZUs3dmZCNE10V0NxUnl3YWowVlRjQmxBT3AvUWFHYTJyQTZrMkt5VytLdDZDODJ0ZUV3R0FiL2VXM25OYmlzRU5QUjM2Szdib1ZRNVduM3YrM1ZuZW5KWGY0V0dLbkNDaW1HSGpZNFllWXFDZkkrVmxnYUJrb3VYbkkxS21wcVVuYU50a2FDYWRLU3FaSm1ub0t1d1c1K3Vyb1N4dDBpbXRLNk11TDQ3cmJ1dW9yL0ZMTFBDd3IzR3pESnh5ZERFemRNYXdkRENxZFRhRThqWDE4dmI0UXU2M3RDMjR1aGQ1ZVVFNE9qYTNldTdCTm52OE0veXlmWDIwK1Q1dGU3NE1iUDJEMVE3Z2VFU0ZjU0djSnUvaFpMT05XeEdFS0tnQVFFbjRvcG5jZjlTUm8yeEhuYVVzdzhrcm9vanYwZzArUXRseWlVSFdUYmorRElJUFpuVVJOWXNpZk1YelpRcmV6TFRDVEdtMEcwL0M5NDhLbzZvdktCTXNRQTRrclFjeHFoakFBUUlNTFdJMDJSR3NXYlJ1blVyVllnOHhUb3B5N1pyRVh4VzFXNGh5N2JzMlhWaDVVS2hXNWZ0RVplUzh1cDF3cmR2V3lOVkJhVWR6TVd3NDQ4eEFLT0J5cmhJNGNlSHZjSlZKTGl5WmN5Zzd3WmU3RG5IWmRCOTNmYjRXb0IwYVJ5b1kwT0dVWlh5YXgyblpSdit1MmYyN1JlNWRSdFd6Y09mNjk4dWdndmZqWGlKYmVRNGxDK3ZTNXpIbWF2UWtVaWZidGZJRE4vWllYTkhYVDM4cmUzanpROGRqMXA5TWZUY3k3dFhCWC82L0Yvc1FjdS8zNm4rY3Y3L3VPU0gyWDRBV3VLZmNBUVcrTWlCdWlrSWk0Q1BKZWpnSVF6S05xRXFFRG9tNFlWL1ZCZ2JoNk5rNkJpSW5ZaVlHb21YZU5nZWlwYVlTQjJMbGFnWUdveVB1SmdaalkzWTJCMk9GT3BvRm8rSCtNZ1ZrSWJJaUJtUmhnaTVJWkpqQ01sa2h6NHUrYVFXU2s1NWg1R1BXWGxIbFZyVzRXU1hibUE1SEpodWZFbm1HbUl5ZDJZWlhLNlpsWmx1aXBIbWkzRTI2V09kYitvb0paNnIzY21uRm5QVzlTZWdVUTZhQlp5R1BoRm9XWHNtR2dPaWpoNng2RmFOUnVvQ3BKWjY1V2Vta2hiSzZSR1lmb3FicDZJMnBtT3AzdW1KS2hHTFZycXFEQ2E2K21vSVlzbzZLNnpzQVdEcnJiaE90eXV2SWpENEs3QWpJRWhzRk9nTmU2d0tHUG9wdXl5end6bjdyQXFGNlRxdEdJeEtleTBMMW9hUUFBQWgrUVFGQUFBR0FDd1hBTG9BdWdEQUFBQUQveWkxM1A0d3lrbmxNRGpyemJ2L1lDaU9wRFpVYUtxdXpsVytjQ3pQMmNuZWVPN1NmTy9EdHB4d09Objlqc2drZ2Noc01vekpxRFMyZEZxRjBLbDI2NmxldjZzc2Q4ejFnczhVTVhrZE5hUGZEelY3N29QYklYSzZYbmJ2UC9lQWRYNTllWUdHSUlPRWg0c3ZpWGVGakpFR2puYVFrb3VVY0phWGhwbHZtNXlBbm1pZ29YcWpaNldtYzZoZ3FxdHJicTFFcjdCanNyTll0cHk0dVRpMXUxcTl2aXpBd1ZMRHhDckd4MGxCeWpyTmpNL1FOOHpTU1FIYTI5emRBUUxnNGVMakFnUG01K2pwNWdUczdlN3Z2ZGZZOC9UMTl2ZjQrZnI3L1AzKy93QURDaHhJc0tEQmd3Z1RLbHpJc0tIRGh4QWpTcHhJc2FMRml4Z3phdHpJc2Yrang0OGdRNG9jU2JLa3laTW9VNnBjeWJLbHk1Y3dZOHFjU2JPbXpaczRjK3JjeWJPbno1OUFnd29kU3JTbzBhTklreXBkeXJTcDA2ZFFvMHFkU3JXcTFhdFlzMnJkeXJXcjE2OWd3NG9kUzdhczJiTm8wNnBkeTdhdDI3ZHc0eklDUUxldTNidDQ4MGIxeHJjdjM3MStBL2NGTExqd05zS0dDeU5PSEhneDQ4RlFIeXVPTExreDVjcVFuMkwyNjNpenRzNmVRVzhXalpsMFpkT1NVVDlXelpoMVl0ZUdZVS9XN05tYmJNRzNMZE91elMwMzU4dThQd01QN2p1ejArQzloL011L2xkNWJlYTJuWWVXUHBwNmFldW5zYWZXdnBwN1lnRFF1WUgzYm5qODd1RG1qeU1Qa0w3cGV2Ymh0N1ZuK243KzB2cnh0ZGxYaXA5ODRmMUpTZlYzSG04QUlpV2dlc2dWZU5TQjdxMm5vRkVNMHVkZ2Z2RDVKOWlEUlVWNDM0UVdCb1loVVJyeXgrR0F0WDA0VklnQmpvZ2dlaFNhS0JTS0JxNG4xWHN6eWlqVlhhRWxBQUFoK1FRRkFBQUdBQ3duQUdZQWRRQUFBUUFELzJpNnZCSXR5a21ydlRockZrZ1pXeWlPWktrTVJWb0ladXUrbTZDcUJBVGYrTnZOODJEbndDQUd4ZU9CaE1pa284Z2tzSlJRM0k3Wi9FV3ZKQmwxZThSNk5kUHQ5dmt0VTRoaXNkUE1abWpUOEZxYmpZYkR1L1ByMjg0bjU1VWVmSUlGY245SWU0TjhQb1pBWVltRGVJd3VpSStEZnBJa2pwV0poWmdqbEp1Smk1NGJtcUdWbDZRVm9LZVBhNm9WcHEyYm5iQU5yTE9ia2JZR0FYVzVzNm0yc3NDVnRid0d1TVdjVnJ5K3k3bTd3NEhRcDhLd3l0VjJ4N3kvMnFMTjA5K2gwdGpqb2RlcTN1ZmI0YkRFN0dMbHF0bnhUT21rNi9aYjd1L1UrMk9RU2FnWGo0REFNd0R2SGFRQTc1ekJoYXYrMmVzSGtZRStiZk1xY3BENFRmK2pCZ0VjbCtIekdJR2dNWklobmtHamlKSmhTRm90c3dCakdUUFdSVVUxVFRSTWszTVNxcDR2YmhaNUNOVEZUaFUwaThhNG96VEh6YVJOVTRiTUdMVUVJcUpWZ2FBWm1WVW5BYXhkdzRvZFM3YXMyYk5vMDZwZHk3YXQyN2R3NDhxZFM3ZXUzYnQ0OCtyZHk3ZXYzNytBQXdzZVRMaXc0Y09JRXl0ZXpMaXg0OGVRSTB1ZVRMbXk1Y3VZTTJ2ZXpMbXo1OCtnUTRzZVRicTA2ZE9vVTZ0ZXpicTE2OWV3WTh1ZVRidTI3ZHU0Yyt2ZXpidTM3OS9BZ3dzZlRyeTQ4ZU80QXdRQUFCaUFjdVhNK3o2Znp0ZjU5T2ZSOFY3Zm5wMnU5ZTNYdThjRlR4NnEyZkxseGEvOWpoNjhlclR0NDc4bnl6NCsrZmxpN2V2SFg3VytmdlRmL0NuMTM0RG14ZVFmZ2VXSmRTQ0M3dVhIb0h3S1BoamZXQksyRjJCT0MxYW9ISVVhM2hkaGgrQnhDT0oxSW82STNZY21QbGRpaWhmV2xLR0dLNXJZb29FcFV1ZGdqUVcyOUtLRU04YUU0NFkzMXRnalNqdEtHT09JUTVKVUpJTkprdlJqamtUKzJLUkhUeDRKNHBRVkxjbWdsUjJPcFNXQldGWlVKWW9zY2dram1US2FXYUdhUnFLSkpKc1BlaWtsbkZ1NmVTV2RDTXFKbzU1QzRra2duMlVHbVNLZ2FRcjZwcDFkK3ZsZm1GbnVXZGFYOWpHcTVJaHFRVW9lVzVhRzUxYW1RTDVscWFSS1FWclhrcUQydDJOZUdWYkhuVi9zQmVaY3FSWWtBQUFoK1FRRkFBQUdBQ3duQUNvQWRRQUFBUUFELzJpNjNQNHd5a2xOQ0RYcnpidFhBa0Y4WkdtZUlGR3NBdXErOENJTWF6M0dlTDRGZE8wUHVxQ3dFUWo1amdYTWNJa3pJbzgzcHRURWUxcVYweXpIYVVWR3RXQkp0ZHR0aGMvRWdZcE1ScnN0UFRZWitBWno1V1JzZlRuR3k3OTdRWGQrYkhxQk9RS0VoSUNIT0d1S2NtYU5PUUdRZm9hVEw0K1dYWFNaTVpXY2haODRjYUpQaktSVXAyU1NxaWlKcktpdk1KdXlOWjYwSnJHM1I1aTZIcmE5dWNBZm9iMCt2OFVicHNpcHl4ckh5Q3pRSk0zSTFTVFRQOWtldk52SzNSTEN0OC9pRWQvVDRlY1A1TExtN0E3UzA2N3hFdGU5OWhYenlNVDZEL2h1cmZ0bndCMHJlQVRUSWF0SHNJSEJVd2ovOGV2RnNPR0NoNmNHNnB0NHkvK2ZSUVVCWlduVXQ4M0d4d2NLS1o1MGdKRlRSSDBwTzY1MFdITEZ5SGdjWlhuOEdKTFZUWFk1RDg1azBQTlV4WTgxVnd5VmtYU254WmFjZnA0TENuR3BBcWlXcElxakt1cWx2YUtpampia0tzcXFnWmc2eldKVjVMUWhXcGRhMmExbEkzWWxXVFp0aDRMdFFpQXV3YnRRNnBvMXNOZUg0TUVLQ09WRnpKUk5YOFlhREJJNERKbEJ6TVdWV1I0WjRMZnlzY2VaUDlDZ0hMcTA2ZE9vVTZ0ZXpicTE2OWV3WTh1ZVRidTI3ZHU0Yyt2ZXpidTM3OS9BZ3dzZlRyeTQ4ZVBJa3l0ZnpyeTU4K2ZRbzB1ZlRyMjY5ZXZZczJ2ZnpyMjc5Ky9ndzRzZlQ3NjgrZlBvMDZ0Zno3NjkrL2Z3NDh1ZlQ3KysvZnY0OCt2Zno3Ky8vLy8vQUFZbzRJQUVGaWpiQmJrQmNFRUFBTmltNElJSXp2WWdoQmMwR051RUZGYjRHb1laTHRnYWh4MHVhR0ZxSVpiWW1VVWdtaWlpYVNtcUNHRnBMc1pZV1lzeFVqaWlWVFRXbU9GZ092WjQ0MGs1OXRqaFRFRUsyZUdQRWhtcEpJcEtObm5pSkVVNldTS1MyVWhwSlR0Uldta2lsYnBrcWFXS1ZYNzVKWmVmZUNtbWkyUWVZdWFaTHRLeUpwdGJ1Z25ubUhMT2FXV2FlN3hwWjRaNDFySG5uWFgrcVdTZmIrZ3BhSVN2SE5va29XNFlLaWlqYURqNko2Um9LTHFrTHBZS1NXbWptY2E0YWFHZHhwbU5wRitlUTZxVW4wSVpxb2IybkNwa1E2NTZ5dVNocVFJVDY1Rkw3V25XcmF5YWRXYXRwbW9KTEU1U3NyZ29hbXNPQzZ1T0dNcCtGQ1ZzS2paTFpJalNMZ1hpYlJCV081aUMyaEtVQUFBaCtRUUZBQUFHQUN3WEFCY0F1Z0MvQUFBRC8yaTYzUDR3eWttcnZUaTd3SVVZSUNHS1JXbWVoYWl0Yk91K01JWE9kRjNFZUs3dnNPM1h2S0J3T1B3WlR3R2ljc25FSEovSnBuUTZmUjZqMUt5V1p6Vml0K0F3cS92N2lzOW9DZGxuVHJ2ZmExdjdUUmZIYS9PNlBudW41ZmVBVEgwemY0R0dRb01vaFllTU9ZbElqWkZGanlXTGtwY2FsSldZbkRHYUJaYWRvaEdmb2FPbkRLV29xeFdxcks4UW53S3d0QTJ5dGJnR3Q3bTB1N3l2dnIrcndjS254TVdpeDhpY3lzdVh6YzZSME5HTTA5U0cxdGVBMmRwNjNOMTBud1BnejVyajVOTG02T21VNSt1SDR1L1Y2dkxZOVBYYjkvamUrdnZoL2Y3Y3hBdFlaeUJCT0FBUDJrbW9FSXpCaG1jK0VZQ1lSaUpGTkJZdkxxUTBVZjlqbUl3ZXQ0QU15VWRUUjVJbE9hTFVNbkpsazVZdWw4Q01TV1FtVFVRbWI3N01xVk1tejU0MWZ3TEZxWExvcEtKR2czeTZrVlRwcDZaT05VSGw4blNxanFWV3IxYk42bWtyMXhjZ3dvb2RTN2FzdTY5bzA2cGR5N2F0MjdkdzQ4cWRTN2V1M2J0NDgrcmR5N2V2MzcrQUF3c2VUTGl3NGNPSUV5dGV6TGl4NDhlUUkwdWVUTG15NWN1WU0ydmV6TG16NTgrZ1E0c2VUYnEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQU5RRGdRTHk0OGVQSWt5dGZ6cHc1eGViUW8wdWZqdnc1OWV2WXMzT3dycjI3ZCtYY3Y0c1hIMzY4K2V6bHo2dVhubjY5KytYdDM4czNIbisrL2ZyMjVlUFA3MzQvZi9WRS92MW5Yb0FDa2dkUmdmd1JpR0IzQ2k2STNvRU82Z2RoaFAxTlNDR0FGbDQ0WUlZYUd0aFFoeGgrQ09LR0lvN29vVUltanVjUkFDeTI2T0tMTU1ibzRvSVVKUUFBSWZrRUJRQUFCZ0FzSndBbUFBRUJmQUFBQS85b3V0eitNTXBKcTcwNDY4MjdHb0luam1ScG5taktDVVZCQ0lFcXozUnQzMVdydnpIdS84Q2drREhRR1huRHBITEp2QVNNVUJlc1NhMWFnWVJvOUhYdGVyOGlsbGJMQlp2UGFFWjJQQWFsMzNCcWtVMGY5T0w0dk8xSjd5UDFnSUVsYTMxK0lZS0lpUmRpaFkxMmlwQ1JEWVNOaFdXU21JSnpsWlVFbVo5NmZKeVZoNkNtYVpTamRKNm5yV2FpcW4xM3JyUldxYkZhQTdXN1ZZeTRiTHpCUzdDL1dxWEN5RCtieFZ2SnpqN0V6RWF6ejlVcXQ5SXUxdHNxdnRrNjFOemlIZEhmdXVQb0hzdmZMZW51RytYWngrLzBFOWpTclBYNkVkN3M0ZnNBRGJDRGNpNmdRUVByL0IwMEdFOWF3WVg3N2pITEIxRmZ2Mi96S3I0YmVFVC80NzZFMy81NUZOZVEyY09SNlNReUU0blMya1Y1TGQrcC9FVXhwamlRMlZqYVRGYXlXTTJkMW1iKzBnazAyRXVIUmNVSnhaV1VHMDVwR1pzSzYwbFRhbENPNEt3K280cnJwMVplUzJNUi9XcnFxVW15eUxqRzhvcldWVmhWVWR1ZVVxdUtyVnhUYjBlTnZSdnA2Rm0rdE9pcTJnczRrZGxpY1F0TEVzekpydUpJZVRrbGZxeklyMC9LcGhoeklvdzV6K0ZmSnp0RDBseUpjd2tBQUVUWGlFd0tDSUFBc0ZYTHNGd1ZDT3picVdXZndKcjF4K3ZidUhXVG9OM1ZOZkRqQVhJTDd5Q0F0U3pieUpFdkR6TXdkSTNmMFk4cm43N2hjeVBqMmJOdjU0NGhnSE1kazFWZ0R4K2QvQXJuanRXem56L2V2UVh2VUV5VG1NOC91ZjBNL3dIZ3A0MXYvZlZYMzM4U21OZUlmaU1VNkNDQ0dGaG1IUTNyT1VnZmhCZmdGSjhLRm5aNElJWU9LQWhGZWlsVTJLR0JJRklnNG9BK21IaGlnU2xTSUFhRElyajRJb294U2tBaUNqYmVXT0NIT1FiUm80OC9CcW5Fa0VRV2FhUVFTQ2FwNUpJNE5PbWtnMEJDZVlLVVV6NW9KWVZaZHVuZmxqTmc2U1YvVllKWjQ1aFRsbWttQjJLaXlkNmE4cmxKcEpwd2F0Q21uTWpSV1dkNWVQcW81NTRWM05rbmNJQ2FJT2lnWHhiYUlLSW4vcWxvQkljaSt1Z0lrZmJwNktRUE1Pb2hwaDVVaXVhbG5EN2dhWmVobHFCcGVLQ1dDc0dvUktwNjVhbkJ1WG9DckRUS09nR3JNTm9hSjU2cDZtb0JydG41eXVXbndsNDNackUzQU5zcnNpd1o0TXBzaTYwK1MyQ2owZ1p4WXJWTVVvbnRFRkp1cThTRjNpYlJZN2hNbUVndUZjQXRleTZQc1RHYkFBQTdcIiBhbHQ9XCJMb2FkaW5nLi4uXCIgLz5cclxuLy8gICA8L2Rpdj5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXR0LXJ0dGFtYXBsaWInLFxyXG4gIHRlbXBsYXRlOiBgICBcclxuICA8ZGl2IGlkPSdteU1hcCcgY2xhc3M9J21hcGNsYXNzJyAjbWFwRWxlbWVudD5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGlkPVwidGlja2V0bW9kYWxcIiBjbGFzcz1cIm1vZGFsIGZhZGVcIj5cclxuXHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj5cdFx0XHRcclxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgPC9kaXY+XHRcdFx0XHJcbiAgICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcbiAgc3R5bGVzOiBbYFxyXG4gIC5tYXBjbGFzc3tcclxuICAgIGhlaWdodDogY2FsYygxMDB2aCAtIDRlbSAtIDcwcHgpICFpbXBvcnRhbnQ7ICAgIFxyXG4gICAgZGlzcGxheTpibG9jaztcclxuICB9LFxyXG4gIC5pbmZ5TWFwcG9wdXB7XHJcblx0XHRtYXJnaW46YXV0byAhaW1wb3J0YW50O1xyXG4gICAgd2lkdGg6MzAwcHggIWltcG9ydGFudDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgbGlnaHRncmF5OyBcclxuICB9LFxyXG4gIC5wb3BNb2RhbENvbnRhaW5lcntcclxuICAgIHBhZGRpbmc6MTVweDtcclxuICB9XHJcbiAgLnBvcE1vZGFsSGVhZGVye1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgd2lkdGg6MTAwJTtcclxuICB9XHJcbiAgLnBvcE1vZGFsSGVhZGVyIGF7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBwYWRkaW5nOjVweCAxMHB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmYzEwNztcclxuICAgIGJvcmRlci1jb2xvcjogI2ZmYzEwNztcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHJpZ2h0OjEwcHg7XHJcbiAgICB0b3A6NXB4O1xyXG4gIH1cclxuICAucG9wTW9kYWxIZWFkZXIgLmZhe1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOi0xMHB4O1xyXG4gICAgcmlnaHQ6LTEwcHg7XHJcbiAgXHJcbiAgfVxyXG4gIC5wb3BNb2RhbEJvZHkgbGFiZWx7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGxpbmUtaGVpZ2h0OiBub3JtYWw7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEJvZHkgc3BhbntcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIGxpbmUtaGVpZ2h0OiBub3JtYWw7XHJcbiAgICB3b3JkLWJyZWFrOsOCwqBicmVhay13b3JkO1xyXG4gIH1cclxuICAubWV0ZXJDYWwgc3Ryb25ne1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcclxuICAgIGZvbnQtc2l6ZTogMjNweDtcclxuICB9XHJcbiAgLm1ldGVyQ2FsIHNwYW57XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICB9XHJcbiAgLnBvcE1vZGFsRm9vdGVyIC5jb2x7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEZvb3RlciAuZmF7XHJcbiAgICBwYWRkaW5nOjAgNXB4O1xyXG4gIH1cclxuLm1vZGFsLWJvZHkge21heC1oZWlnaHQ6NDUwcHg7IG92ZXJmbG93LXk6YXV0b31cclxuLnRrdEZvcm0gLmZvcm0tZ3JvdXAge21hcmdpbi1ib3R0b206NXB4fVxyXG4udGt0Rm9ybSAuZm9ybS1ncm91cCBkaXYgbGFiZWwge2ZvbnQtd2VpZ2h0OjUwMH1cclxuLnRvcEJvcmRlciB7Ym9yZGVyLXRvcDojZGJkYmRiIDFweCBzb2xpZDt9XHJcblxyXG4udGV4dC1zdWNjZXNzIHtjb2xvcjojNWNiODVjfVxyXG4udGV4dC1kYW5nZXIge2NvbG9yOiNkOTUzNGZ9XHJcbiNtb3JlRm9ybUNvbnRlbnRCdG4sICNtb3JlRm9ybUNvbnRlbnRCdG46aG92ZXIgIHsgICAgXHJcbiAgIFxyXG4gICAgYmFja2dyb3VuZDp0cmFuc3BhcmVudDtcclxuICAgIGJvcmRlcjowXHJcbn1cclxuI21vcmVGb3JtQ29udGVudEJ0bjpmb2N1cyAgeyAgICBcclxuICAgIG91dGxpbmU6MFxyXG59XHJcblxyXG4gIGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBSdHRhbWFwbGliQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgY29ubmVjdGlvbjtcclxuICBtYXA6IGFueTtcclxuICBjb250ZXh0TWVudTogYW55O1xyXG4gIHRlY2huaWNpYW5QaG9uZTogc3RyaW5nO1xyXG4gIHRlY2huaWNpYW5FbWFpbDogc3RyaW5nO1xyXG4gIHRlY2huaWNpYW5OYW1lOiBzdHJpbmc7XHJcbiAgdHJhdmFsRHVyYXRpb247XHJcbiAgdHJ1Y2tJdGVtcyA9IFtdO1xyXG5cclxuICBkaXJlY3Rpb25zTWFuYWdlcjtcclxuICB0cmFmZmljTWFuYWdlcjogYW55O1xyXG5cclxuICB0cnVja0xpc3QgPSBbXTtcclxuICB0cnVja1dhdGNoTGlzdDogVHJ1Y2tEZXRhaWxzW107XHJcbiAgYnVzeTogYW55O1xyXG4gIG1hcHZpZXcgPSAncm9hZCc7XHJcbiAgbG9hZGluZyA9IGZhbHNlO1xyXG4gIEBWaWV3Q2hpbGQoJ21hcEVsZW1lbnQnKSBzb21lSW5wdXQ6IEVsZW1lbnRSZWY7XHJcbiAgbXlNYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlNYXAnKTtcclxuICByZWFkeSA9IGZhbHNlO1xyXG4gIGFuaW1hdGVkTGF5ZXI7XHJcbiAgLy8gQFZpZXdDaGlsZCgnc21zcG9wdXAnKSBzbXNwb3B1cDogUG9wdXA7XHJcbiAgLy8gQFZpZXdDaGlsZCgnZW1haWxwb3B1cCcpIGVtYWlscG9wdXA6IFBvcHVwO1xyXG4gIEBWaWV3Q2hpbGQoJ2luZm8nKSBpbmZvVGVtcGxhdGU6IEVsZW1lbnRSZWY7XHJcbiAgc29ja2V0OiBhbnkgPSBudWxsO1xyXG4gIHNvY2tldFVSTDogc3RyaW5nO1xyXG4gIHJlc3VsdHMgPSBbXHJcbiAgXTtcclxuICBwdWJsaWMgdXNlclJvbGU6IGFueTtcclxuICBsYXN0Wm9vbUxldmVsID0gMTA7XHJcbiAgbGFzdExvY2F0aW9uOiBhbnk7XHJcbiAgcmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMgPSBbXTtcclxuICByZXBvcnRpbmdUZWNobmljaWFucyA9IFtdO1xyXG4gIGlzVHJhZmZpY0VuYWJsZWQgPSAwO1xyXG4gIGxvZ2dlZFVzZXJJZCA9ICcnO1xyXG4gIG1hbmFnZXJVc2VySWQgPSAnJztcclxuICBjb29raWVBVFRVSUQgPSAnJztcclxuICBmZWV0OiBudW1iZXIgPSAwLjAwMDE4OTM5NDtcclxuICBJc0FyZWFNYW5hZ2VyID0gZmFsc2U7XHJcbiAgSXNWUCA9IGZhbHNlO1xyXG4gIGZpZWxkTWFuYWdlcnMgPSBbXTtcclxuICAvLyBXZWF0aGVyIHRpbGUgdXJsIGZyb20gSW93YSBFbnZpcm9ubWVudGFsIE1lc29uZXQgKElFTSk6IGh0dHA6Ly9tZXNvbmV0LmFncm9uLmlhc3RhdGUuZWR1L29nYy9cclxuICB1cmxUZW1wbGF0ZSA9ICdodHRwOi8vbWVzb25ldC5hZ3Jvbi5pYXN0YXRlLmVkdS9jYWNoZS90aWxlLnB5LzEuMC4wL25leHJhZC1uMHEte3RpbWVzdGFtcH0ve3pvb219L3t4fS97eX0ucG5nJztcclxuXHJcbiAgLy8gVGhlIHRpbWUgc3RhbXBzIHZhbHVlcyBmb3IgdGhlIElFTSBzZXJ2aWNlIGZvciB0aGUgbGFzdCA1MCBtaW51dGVzIGJyb2tlbiB1cCBpbnRvIDUgbWludXRlIGluY3JlbWVudHMuXHJcbiAgdGltZXN0YW1wcyA9IFsnOTAwOTEzLW01MG0nLCAnOTAwOTEzLW00NW0nLCAnOTAwOTEzLW00MG0nLCAnOTAwOTEzLW0zNW0nLCAnOTAwOTEzLW0zMG0nLCAnOTAwOTEzLW0yNW0nLCAnOTAwOTEzLW0yMG0nLCAnOTAwOTEzLW0xNW0nLCAnOTAwOTEzLW0xMG0nLCAnOTAwOTEzLW0wNW0nLCAnOTAwOTEzJ107XHJcblxyXG4gIHRlY2hUeXBlOiBhbnk7XHJcblxyXG4gIHRocmVzaG9sZFZhbHVlID0gMDtcclxuXHJcbiAgYW5pbWF0aW9uVHJ1Y2tMaXN0ID0gW107XHJcblxyXG4gIGRyb3Bkb3duU2V0dGluZ3MgPSB7fTtcclxuICBzZWxlY3RlZEZpZWxkTWdyID0gW107XHJcbiAgbWFuYWdlcklkcyA9ICcnO1xyXG5cclxuICByYWRpb3VzVmFsdWUgPSAnJztcclxuXHJcbiAgZm91bmRUcnVjayA9IGZhbHNlO1xyXG5cclxuICBsb2dnZWRJblVzZXJUaW1lWm9uZSA9ICdDU1QnO1xyXG4gIGNsaWNrZWRMYXQ7IGFueTtcclxuICBjbGlja2VkTG9uZzogYW55O1xyXG4gIGRhdGFMYXllcjogYW55O1xyXG4gIHBhdGhMYXllcjogYW55O1xyXG4gIGluZm9Cb3hMYXllcjogYW55O1xyXG4gIGluZm9ib3g6IGFueTtcclxuICBpc01hcExvYWRlZCA9IHRydWU7XHJcbiAgV29ya0Zsb3dBZG1pbiA9IGZhbHNlO1xyXG4gIFN5c3RlbUFkbWluID0gZmFsc2U7XHJcbiAgUnVsZUFkbWluID0gZmFsc2U7XHJcbiAgUmVndWxhclVzZXIgPSBmYWxzZTtcclxuICBSZXBvcnRpbmcgPSBmYWxzZTtcclxuICBOb3RpZmljYXRpb25BZG1pbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHRpY2tldExpc3Q6IGFueSA9IFtdO1xyXG4gIEBJbnB1dCgpIGxvZ2dlZEluVXNlcjogc3RyaW5nO1xyXG4gIEBPdXRwdXQoKSB0aWNrZXRDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgdGlja2V0RGF0YTogVGlja2V0W10gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIG1hcFNlcnZpY2U6IFJ0dGFtYXBsaWJTZXJ2aWNlLFxyXG4gICAgLy9wcml2YXRlIHJvdXRlcjogUm91dGVyLCBcclxuICAgIC8vcHVibGljIHRvYXN0cjogVG9hc3RzTWFuYWdlciwgXHJcbiAgICB2UmVmOiBWaWV3Q29udGFpbmVyUmVmXHJcbiAgICApIHtcclxuICAgIC8vdGhpcy50b2FzdHIuc2V0Um9vdFZpZXdDb250YWluZXJSZWYodlJlZik7XHJcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5jb29raWVBVFRVSUQgPSBcImtyNTIyNlwiOy8vdGhpcy51dGlscy5nZXRDb29raWVVc2VySWQoKTtcclxuICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMgPSBbXTtcclxuICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMucHVzaCh0aGlzLmNvb2tpZUFUVFVJRCk7XHJcbiAgICB0aGlzLnRyYXZhbER1cmF0aW9uID0gNTAwMDtcclxuICAgIC8vIC8vIHRvIGxvYWQgYWxyZWFkeSBhZGRyZWQgd2F0Y2ggbGlzdFxyXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnRydWNrTGlzdCA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICB0aGlzLmxvZ2dlZFVzZXJJZCA9IHRoaXMubWFuYWdlclVzZXJJZCA9IFwia3I1MjI2XCI7Ly90aGlzLnV0aWxzLmdldENvb2tpZVVzZXJJZCgpO1xyXG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAvL3RoaXMuY2hlY2tVc2VyTGV2ZWwoZmFsc2UpO1xyXG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gJ2NvbXBsZXRlJykgIHtcclxuICAgICAgZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgICB0aGlzLm1hcHZpZXcgPSAncm9hZCc7XHJcbiAgICAgICAgICB0aGlzLmxvYWRNYXBWaWV3KCdyb2FkJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubmdPbkluaXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgdGhpcy5tYXB2aWV3ID0gJ3JvYWQnO1xyXG4gICAgICAgIHRoaXMubG9hZE1hcFZpZXcoJ3JvYWQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgXHJcbiAgfVxyXG5cclxuICBjaGVja1VzZXJMZXZlbChJc1Nob3dUcnVjaykge1xyXG4gICAgdGhpcy5maWVsZE1hbmFnZXJzID0gW107XHJcbiAgICAvLyBBc3NpZ24gbG9nZ2VkIGluIHVzZXJcclxuICAgIHZhciBtZ3IgPSB7IGlkOiB0aGlzLm1hbmFnZXJVc2VySWQsIGl0ZW1OYW1lOiB0aGlzLm1hbmFnZXJVc2VySWQgfTtcclxuICAgIHRoaXMuZmllbGRNYW5hZ2Vycy5wdXNoKG1ncik7XHJcblxyXG4gICAgLy8gQ29tbWVudCBiZWxvdyBsaW5lIHdoZW4geW91IGdpdmUgZm9yIHByb2R1Y3Rpb24gYnVpbGQgOTAwOFxyXG4gICAgdGhpcy5Jc1ZQID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBDaGVjayBpcyBsb2dnZWQgaW4gdXNlciBpcyBhIGZpZWxkIG1hbmFnZXIgYXJlYSBtYW5hZ2VyL3ZwXHJcbiAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VySW5mbyh0aGlzLm1hbmFnZXJVc2VySWQpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoIWpRdWVyeS5pc0VtcHR5T2JqZWN0KGRhdGEpKSB7XHJcbiAgICAgICAgbGV0IG1hbmFnZXJzID0gJ2YnO1xyXG4gICAgICAgIGxldCBhbWFuYWdlcnMgPSAnZSc7XHJcbiAgICAgICAgbGV0IHZwID0gJ2EsYixjLGQnO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5sZXZlbC5pbmRleE9mKG1hbmFnZXJzKSA+IC0xKSB7XHJcbiAgICAgICAgICAvLyB0aGlzLklzVlAgPSBJc1Nob3dUcnVjaztcclxuICAgICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy5tYW5hZ2VySWRzID0gdGhpcy5maWVsZE1hbmFnZXJzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbVsnaWQnXTtcclxuICAgICAgICAgIH0pLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAvLyB0aGlzLmdldFRlY2hEZXRhaWxzRm9yTWFuYWdlcnMoKTtcclxuICAgICAgICAgIC8vIHRoaXMuTG9hZFRydWNrcyh0aGlzLm1hcCwgbnVsbCwgbnVsbCwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IC8vJCgnI2xvYWRpbmcnKS5oaWRlKCkgXHJcbiAgICAgICAgfSwgMzAwMCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxldmVsLmluZGV4T2YoYW1hbmFnZXJzKSA+IC0xKSB7XHJcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMgPSBbXTtcclxuICAgICAgICAgIHZhciBhcmVhTWdyID0ge1xyXG4gICAgICAgICAgICBpZDogdGhpcy5tYW5hZ2VyVXNlcklkLFxyXG4gICAgICAgICAgICBpdGVtTmFtZTogZGF0YS5uYW1lICsgJyAoJyArIHRoaXMubWFuYWdlclVzZXJJZCArICcpJ1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHRoaXMuZmllbGRNYW5hZ2Vycy51bnNoaWZ0KGFyZWFNZ3IpO1xyXG4gICAgICAgICAgdGhpcy5nZXRMaXN0b2ZGaWVsZE1hbmFnZXJzKCk7XHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZXZlbC5pbmRleE9mKHZwKSA+IC0xKSB7XHJcbiAgICAgICAgICB0aGlzLklzVlAgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gZmFsc2U7XHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvL3RoaXMudG9hc3RyLndhcm5pbmcoJ05vdCB2YWxpZCBGaWVsZC9BcmVhIE1hbmFnZXIhJywgJ01hbmFnZXInLCB7IHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSB9KVxyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy90aGlzLnRvYXN0ci53YXJuaW5nKCdQbGVhc2UgZW50ZXIgdmFsaWQgRmllbGQvQXJlYSBNYW5hZ2VyIGF0dHVpZCEnLCAnTWFuYWdlcicsIHsgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlIH0pXHJcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGNvbm5lY3Rpbmcgd2ViIHBob25lIScsICdFcnJvcicpXHJcbiAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldExpc3RvZkZpZWxkTWFuYWdlcnMoKSB7XHJcbiAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VyRGF0YSh0aGlzLm1hbmFnZXJVc2VySWQpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5UZWNobmljaWFuRGV0YWlscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZm9yICh2YXIgdGVjaCBpbiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzKSB7XHJcbiAgICAgICAgICB2YXIgbWdyID0ge1xyXG4gICAgICAgICAgICBpZDogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQsXHJcbiAgICAgICAgICAgIGl0ZW1OYW1lOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLm5hbWUgKyAnICgnICsgZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQgKyAnKSdcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMucHVzaChtZ3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5Jc1ZQID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLklzVlAgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIud2FybmluZygnRG8gbm90IGhhdmUgYW55IGRpcmVjdCByZXBvcnRzIScsICdNYW5hZ2VyJyk7XHJcbiAgICAgIH1cclxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBjb25uZWN0aW5nIHdlYiBwaG9uZSEnLCAnRXJyb3InKTtcclxuICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGVjaERldGFpbHNGb3JNYW5hZ2VycygpIHtcclxuICAgIGlmICh0aGlzLm1hbmFnZXJJZHMgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VyRGF0YSh0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChkYXRhLlRlY2huaWNpYW5EZXRhaWxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGZvciAodmFyIHRlY2ggaW4gZGF0YS5UZWNobmljaWFuRGV0YWlscykge1xyXG4gICAgICAgICAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnB1c2goZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5wdXNoKHtcclxuICAgICAgICAgICAgICBhdHR1aWQ6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkLFxyXG4gICAgICAgICAgICAgIG5hbWU6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0ubmFtZSxcclxuICAgICAgICAgICAgICBlbWFpbDogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5lbWFpbCxcclxuICAgICAgICAgICAgICBwaG9uZTogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5waG9uZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICAgIFxyXG4gIGxvYWRNYXBWaWV3KHR5cGU6IFN0cmluZykge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy50cnVja0l0ZW1zID0gW107XHJcbiAgICB2YXIgbG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oNDAuMDU4MywgLTc0LjQwNTcpO1xyXG5cclxuICAgIGlmICh0aGlzLmxhc3RMb2NhdGlvbikge1xyXG4gICAgICBsb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0aGlzLmxhc3RMb2NhdGlvbi5sYXRpdHVkZSwgdGhpcy5sYXN0TG9jYXRpb24ubG9uZ2l0dWRlKTtcclxuICAgIH1cclxuICAgIHRoaXMubWFwID0gbmV3IE1pY3Jvc29mdC5NYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlNYXAnKSwge1xyXG4gICAgICBjcmVkZW50aWFsczogJ0FueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWonLFxyXG4gICAgICBjZW50ZXI6IGxvY2F0aW9uLFxyXG4gICAgICBtYXBUeXBlSWQ6IHR5cGUgPT0gJ3NhdGVsbGl0ZScgPyBNaWNyb3NvZnQuTWFwcy5NYXBUeXBlSWQuYWVyaWFsIDogTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLnJvYWQsXHJcbiAgICAgIHpvb206IDEyLFxyXG4gICAgICBsaXRlTW9kZTogdHJ1ZSxcclxuICAgICAgLy9uYXZpZ2F0aW9uQmFyT3JpZW50YXRpb246IE1pY3Jvc29mdC5NYXBzLk5hdmlnYXRpb25CYXJPcmllbnRhdGlvbi5ob3Jpem9udGFsLFxyXG4gICAgICBlbmFibGVDbGlja2FibGVMb2dvOiBmYWxzZSxcclxuICAgICAgc2hvd0xvZ286IGZhbHNlLFxyXG4gICAgICBzaG93VGVybXNMaW5rOiBmYWxzZSxcclxuICAgICAgc2hvd01hcFR5cGVTZWxlY3RvcjogZmFsc2UsXHJcbiAgICAgIHNob3dUcmFmZmljQnV0dG9uOiB0cnVlLFxyXG4gICAgICBlbmFibGVTZWFyY2hMb2dvOiBmYWxzZSxcclxuICAgICAgc2hvd0NvcHlyaWdodDogZmFsc2VcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAvL0xvYWQgdGhlIEFuaW1hdGlvbiBNb2R1bGVcclxuICAgIC8vTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZShcIkFuaW1hdGlvbk1vZHVsZVwiKTtcclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ0FuaW1hdGlvbk1vZHVsZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vU3RvcmUgc29tZSBtZXRhZGF0YSB3aXRoIHRoZSBwdXNocGluXHJcbiAgICB0aGlzLmluZm9ib3ggPSBuZXcgTWljcm9zb2Z0Lk1hcHMuSW5mb2JveCh0aGlzLm1hcC5nZXRDZW50ZXIoKSwge1xyXG4gICAgICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmluZm9ib3guc2V0TWFwKHRoaXMubWFwKTtcclxuXHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgbGF5ZXIgZm9yIHJlbmRlcmluZyB0aGUgcGF0aC5cclxuICAgIHRoaXMucGF0aExheWVyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxheWVyKCk7XHJcbiAgICB0aGlzLm1hcC5sYXllcnMuaW5zZXJ0KHRoaXMucGF0aExheWVyKTtcclxuXHJcbiAgICAvLyBMb2FkIHRoZSBTcGF0aWFsIE1hdGggbW9kdWxlLlxyXG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGgnLCBmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucycsIGZ1bmN0aW9uICgpIHsgfSk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgbGF5ZXIgdG8gbG9hZCBwdXNocGlucyB0by5cclxuICAgIHRoaXMuZGF0YUxheWVyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkVudGl0eUNvbGxlY3Rpb24oKTtcclxuXHJcbiAgICAvLyBBZGQgYSByaWdodCBjbGljayBldmVudCB0byB0aGUgbWFwXHJcbiAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLm1hcCwgJ3JpZ2h0Y2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBjb25zdCB4MSA9IGUubG9jYXRpb247XHJcbiAgICAgIHRoYXQuY2xpY2tlZExhdCA9IHgxLmxhdGl0dWRlO1xyXG4gICAgICB0aGF0LmNsaWNrZWRMb25nID0geDEubG9uZ2l0dWRlO1xyXG4gICAgICB0aGF0LnJhZGlvdXNWYWx1ZSA9ICcnO1xyXG4gICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ3Nob3cnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vbG9hZCB0aWNrZXQgZGV0YWlsc1xyXG4gICAgdGhpcy5hZGRUaWNrZXREYXRhKHRoaXMubWFwLCB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyKTtcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgTG9hZFRydWNrcyhtYXBzLCBsdCwgbGcsIHJkLCBpc1RydWNrU2VhcmNoKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMudHJ1Y2tJdGVtcyA9IFtdO1xyXG5cclxuICAgIGlmICghaXNUcnVja1NlYXJjaCkge1xyXG5cclxuICAgICAgdGhpcy5tYXBTZXJ2aWNlLmdldE1hcFB1c2hQaW5EYXRhKHRoaXMubWFuYWdlcklkcykudGhlbigoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSAmJiBkYXRhLnRlY2hEYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHZhciB0ZWNoRGF0YSA9IGRhdGEudGVjaERhdGE7XHJcbiAgICAgICAgICB2YXIgZGlyRGV0YWlscyA9IFtdO1xyXG4gICAgICAgICAgdGVjaERhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5sb25nID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGl0ZW0ubG9uZyA9IGl0ZW0ubG9uZ2c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGl0ZW0udGVjaElEICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIHZhciBkaXJEZXRhaWw6IFRydWNrRGlyZWN0aW9uRGV0YWlscyA9IG5ldyBUcnVja0RpcmVjdGlvbkRldGFpbHMoKTtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwudGVjaElkID0gaXRlbS50ZWNoSUQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxhdCA9IGl0ZW0ubGF0O1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMb25nID0gaXRlbS5sb25nO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TGF0ID0gaXRlbS53ckxhdDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExvbmcgPSBpdGVtLndyTG9uZztcclxuICAgICAgICAgICAgICBkaXJEZXRhaWxzLnB1c2goZGlyRGV0YWlsKTtcclxuICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdmFyIHJvdXRlTWFwVXJscyA9IFtdO1xyXG4gICAgICAgICAgcm91dGVNYXBVcmxzID0gdGhpcy5tYXBTZXJ2aWNlLkdldFJvdXRlTWFwRGF0YShkaXJEZXRhaWxzKTtcclxuXHJcbiAgICAgICAgICBmb3JrSm9pbihyb3V0ZU1hcFVybHMpLnN1YnNjcmliZShyZXN1bHRzID0+IHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IHJlc3VsdHMubGVuZ3RoIC0gMTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHJvdXRlRGF0YSA9IHJlc3VsdHNbal0gYXMgYW55O1xyXG4gICAgICAgICAgICAgIGxldCByb3V0ZWRhdGFKc29uID0gcm91dGVEYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgICBpZiAocm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcyAhPSBudWxsXHJcbiAgICAgICAgICAgICAgICAmJiByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTGF0ID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzBdXHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxvbmcgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMV1cclxuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTGF0ID0gbmV4dFNvdXJjZUxhdDtcclxuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTG9uZyA9IG5leHRTb3VyY2VMb25nO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGxpc3RPZlBpbnMgPSBtYXBzLmVudGl0aWVzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0T2ZQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcclxuICAgICAgICAgICAgICB2YXIgdGVjaElkID0gbGlzdE9mUGlucy5nZXQoaSkubWV0YWRhdGEuQVRUVUlEO1xyXG4gICAgICAgICAgICAgIHZhciB0cnVja0NvbG9yID0gbGlzdE9mUGlucy5nZXQoaSkubWV0YWRhdGEudHJ1Y2tDb2wudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICB2YXIgY3VyUHVzaFBpbiA9IGxpc3RPZlBpbnMuZ2V0KGkpO1xyXG4gICAgICAgICAgICAgIHZhciBjdXJyRGlyRGV0YWlsID0gW107XHJcblxyXG4gICAgICAgICAgICAgIGN1cnJEaXJEZXRhaWwgPSBkaXJEZXRhaWxzLmZpbHRlcihlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRlY2hJZCA9PT0gdGVjaElkKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICB2YXIgbmV4dExvY2F0aW9uO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoY3VyckRpckRldGFpbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0TG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMYXQsIGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTG9uZyk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAobmV4dExvY2F0aW9uICE9IG51bGwgJiYgbmV4dExvY2F0aW9uICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBpbkxvY2F0aW9uID0gbGlzdE9mUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0Q29vcmQgPSB0aGF0LkNhbGN1bGF0ZU5leHRDb29yZChwaW5Mb2NhdGlvbiwgbmV4dExvY2F0aW9uKTtcclxuICAgICAgICAgICAgICAgIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHBpbkxvY2F0aW9uLCBuZXh0Q29vcmQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihjdXJQdXNoUGluLCB0cnVja1VybCwgYmVhcmluZywgZnVuY3Rpb24gKCkgeyB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLm1hcFNlcnZpY2UuZ2V0VHJ1Y2tGZWVkKHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsIHRoaXMubWFuYWdlcklkcykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMuc29tZSh4ID0+IHgudG9Mb3dlckNhc2UoKSA9PSBkYXRhLnRlY2hJRC50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBkYXRhKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgZmV0Y2hpbmcgdHJ1Y2tzIGZyb20gS2Fma2EgQ29uc3VtZXIuIEVycm9ycy0+ICcgKyBlcnIuRXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignTm8gdHJ1Y2sgZm91bmQhJywgJ01hbmFnZXInKTtcclxuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGZldGNoaW5nIGRhdGEgZnJvbSBBUEkhJywgJ0Vycm9yJyk7XHJcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgY29uc3QgbXRycyA9IE1hdGgucm91bmQodGhhdC5nZXRNZXRlcnMocmQpKTtcclxuICAgICAgdGhpcy5tYXBTZXJ2aWNlLmZpbmRUcnVja05lYXJCeShsdCwgbGcsIG10cnMsIHRoaXMubWFuYWdlcklkcykudGhlbigoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSAmJiBkYXRhLnRlY2hEYXRhLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICBjb25zdCB0ZWNoRGF0YSA9IGRhdGEudGVjaERhdGE7XHJcbiAgICAgICAgICBsZXQgZGlyRGV0YWlscyA9IFtdO1xyXG4gICAgICAgICAgdGVjaERhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5sb25nID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGl0ZW0ubG9uZyA9IGl0ZW0ubG9uZ2c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKChpdGVtLnRlY2hJRCAhPSB1bmRlZmluZWQpICYmIChkaXJEZXRhaWxzLnNvbWUoeCA9PiB4LnRlY2hJZCA9PSBpdGVtLnRlY2hJRCkgPT0gZmFsc2UpKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGRpckRldGFpbDogVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzID0gbmV3IFRydWNrRGlyZWN0aW9uRGV0YWlscygpO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC50ZWNoSWQgPSBpdGVtLnRlY2hJRDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTGF0ID0gaXRlbS5sYXQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxvbmcgPSBpdGVtLmxvbmc7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMYXQgPSBpdGVtLndyTGF0O1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TG9uZyA9IGl0ZW0ud3JMb25nO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbHMucHVzaChkaXJEZXRhaWwpO1xyXG4gICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgIHRoYXQuZm91bmRUcnVjayA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHZhciByb3V0ZU1hcFVybHMgPSBbXTtcclxuICAgICAgICAgIHJvdXRlTWFwVXJscyA9IHRoaXMubWFwU2VydmljZS5HZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlscyk7XHJcblxyXG4gICAgICAgICAgZm9ya0pvaW4ocm91dGVNYXBVcmxzKS5zdWJzY3JpYmUocmVzdWx0cyA9PiB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSByZXN1bHRzLmxlbmd0aCAtIDE7IGorKykge1xyXG4gICAgICAgICAgICAgIGxldCByb3V0ZURhdGEgPSByZXN1bHRzW2pdIGFzIGFueTtcclxuICAgICAgICAgICAgICBsZXQgcm91dGVkYXRhSnNvbiA9IHJvdXRlRGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgICAgaWYgKHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMgIT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgJiYgcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxhdCA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1swXVxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMb25nID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzFdXHJcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxhdCA9IG5leHRTb3VyY2VMYXQ7XHJcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxvbmcgPSBuZXh0U291cmNlTG9uZztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBsaXN0T2ZQaW5zID0gdGhhdC5tYXAuZW50aXRpZXM7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RPZlBpbnMuZ2V0TGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHB1c2hwaW4gPSBsaXN0T2ZQaW5zLmdldChpKTtcclxuICAgICAgICAgICAgICBpZiAocHVzaHBpbiBpbnN0YW5jZW9mIE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZWNoSWQgPSBwdXNocGluLm1ldGFkYXRhLkFUVFVJRDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRydWNrQ29sb3IgPSBwdXNocGluLm1ldGFkYXRhLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyckRpckRldGFpbCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGN1cnJEaXJEZXRhaWwgPSBkaXJEZXRhaWxzLmZpbHRlcihlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQudGVjaElkID09PSB0ZWNoSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRMb2NhdGlvbjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VyckRpckRldGFpbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIG5leHRMb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxhdCwgY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMb25nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dExvY2F0aW9uICE9IG51bGwgJiYgbmV4dExvY2F0aW9uICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgcGluTG9jYXRpb24gPSBsaXN0T2ZQaW5zLmdldChpKS5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgbmV4dENvb3JkID0gdGhhdC5DYWxjdWxhdGVOZXh0Q29vcmQocGluTG9jYXRpb24sIG5leHRMb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHBpbkxvY2F0aW9uLCBuZXh0Q29vcmQpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdHJ1Y2tVcmwgPSB0aGlzLmdldFRydWNrVXJsKHRydWNrQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4ocHVzaHBpbiwgdHJ1Y2tVcmwsIGJlYXJpbmcsIGZ1bmN0aW9uICgpIHsgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBMb2FkIHRoZSBzcGF0aWFsIG1hdGggbW9kdWxlXHJcbiAgICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIC8vIFJlcXVlc3QgdGhlIHVzZXIncyBsb2NhdGlvblxyXG5cclxuICAgICAgICAgICAgICBjb25zdCBsb2MgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odGhhdC5jbGlja2VkTGF0LCB0aGF0LmNsaWNrZWRMb25nKTtcclxuICAgICAgICAgICAgICAvLyBDcmVhdGUgYW4gYWNjdXJhY3kgY2lyY2xlXHJcbiAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IE1pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoLmdldFJlZ3VsYXJQb2x5Z29uKGxvYyxcclxuICAgICAgICAgICAgICAgIHJkLFxyXG4gICAgICAgICAgICAgICAgMzYsXHJcbiAgICAgICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aC5EaXN0YW5jZVVuaXRzLk1pbGVzKTtcclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgcG9seSA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2x5Z29uKHBhdGgpO1xyXG4gICAgICAgICAgICAgIHRoYXQubWFwLmVudGl0aWVzLnB1c2gocG9seSk7XHJcbiAgICAgICAgICAgICAgLy8gQWRkIGEgcHVzaHBpbiBhdCB0aGUgdXNlcidzIGxvY2F0aW9uLlxyXG4gICAgICAgICAgICAgIGNvbnN0IHBpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKGxvYyxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2h0dHBzOi8vYmluZ21hcHNpc2RrLmJsb2IuY29yZS53aW5kb3dzLm5ldC9pc2Rrc2FtcGxlcy9kZWZhdWx0UHVzaHBpbi5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgxMiwgMzkpLFxyXG4gICAgICAgICAgICAgICAgICB0aXRsZTogcmQgKyAnIG1pbGUocykgb2YgcmFkaXVzJyxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICB2YXIgbWV0YWRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBMYXRpdHVkZTogbHQsXHJcbiAgICAgICAgICAgICAgICBMb25naXR1ZGU6IGxnLFxyXG4gICAgICAgICAgICAgICAgcmFkaXVzOiByZFxyXG4gICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHBpbiwgJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoYXQucmFkaW91c1ZhbHVlID0gcmQ7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNsaWNrZWRMYXQgPSBsdDtcclxuICAgICAgICAgICAgICAgIHRoYXQuY2xpY2tlZExvbmcgPSBsZztcclxuICAgICAgICAgICAgICAgIGpRdWVyeSgnI215UmFkaXVzTW9kYWwnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICBwaW4ubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgICAgICAgICAgICB0aGF0Lm1hcC5lbnRpdGllcy5wdXNoKHBpbik7XHJcbiAgICAgICAgICAgICAgdGhhdC5kYXRhTGF5ZXIucHVzaChwaW4pO1xyXG5cclxuICAgICAgICAgICAgICAvLyBDZW50ZXIgdGhlIG1hcCBvbiB0aGUgdXNlcidzIGxvY2F0aW9uLlxyXG4gICAgICAgICAgICAgIHRoYXQubWFwLnNldFZpZXcoeyBjZW50ZXI6IGxvYywgem9vbTogOCB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBsZXQgZmVlZE1hbmFnZXIgPSBbXTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLm1hcFNlcnZpY2UuZ2V0VHJ1Y2tGZWVkKHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsIHRoaXMubWFuYWdlcklkcykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGRpckRldGFpbHMuc29tZSh4ID0+IHgudGVjaElkLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gZGF0YS50ZWNoSUQudG9Mb2NhbGVMb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIGZldGNoaW5nIHRydWNrcyBmcm9tIEthZmthIENvbnN1bWVyLiBFcnJvcnMtPiAnICsgZXJyLkVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ05vIHRydWNrIGZvdW5kIScsICdNYW5hZ2VyJyk7XHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBmZXRjaGluZyBkYXRhIGZyb20gQVBJIScsICdFcnJvcicpO1xyXG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGdldFRydWNrVXJsKGNvbG9yKSB7XHJcbiAgICBsZXQgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUhrbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUm1NMlZpTVdRdE5HSmxaQzFqTmpRMExUZ3pZbVV0WWpRNVlqWmxORGxtWW1SbUlpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdFeE5UQmxZVEV0TWpKaFl5MDNPVFE1TFRoaU5tRXRaV1UxTVRjNFpUQm1NV0ZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T21Zd1pXUXhaV00zTFRNMU9UQXRaR0UwWWkwNU1XSXdMVFl3T1RRMlpqRmhOV1E1WXp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkyUEM5eVpHWTZiR2srSUR3dmNtUm1Pa0poWno0Z1BDOXdhRzkwYjNOb2IzQTZSRzlqZFcxbGJuUkJibU5sYzNSdmNuTStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTBWREU1T2pBNE9qQXpMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzFaRFEyTURjMVppMDRNbVJtTFdZM05EQXRZbVUzWlMxbU4ySTBNemxtWWpjeU16RWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRWVU1UazZNak02TXpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21Ga1pqTmxZakZrTFRSaVpXUXRZelkwTkMwNE0ySmxMV0kwT1dJMlpUUTVabUprWmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhPVlF4TlRvME9Ub3dNUzB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NGRiN3ZqQUFBQ2UwbEVRVlJJeDkyV1RXdFRRUlNHbnpOemIzTFR0S0cxV2xId3E0dUNiWVgrQTEyNUVMY3V1aWhDUlhDcDJIM0JoU3YvZ1V2QmdsSnc0VUxCaWdwU2FVRmNpRkxGalNBdHNYNjFTZE0wdlhOYzlOb2tSWk9ZQVJYbk1xdTV6RFBublBlOE00R3E4cWRId0Y4WS94NzA2ck9KbnBUSXRhZGY3bysrTHkrVnJaaGtSWkw1WXpqRXhPbjFGNW1wc1VQbmJreU1UVDVxR3pwWG1SbFpMdWJIUDdLRTdVcG4ySzYvMURGVndXU2htRnNkZi9oMlpueUNTV2svdmZlNmU3NE52U2F6SjBmc0t2VnJkZm9Uekthd1hpb3lOLys4NUZmVEo3dW4zS2Njd2RraUZCc2RYb2xUSUhtRHpIYjUxYlRuY0E0WE9HSVJORlNrUVhkWm82ZzFaTG9qNndXTkJtUTA3TlZwOGluc2hpQU5ndFhWTW1GWHlJR2gvYWU4b0ErQzIvbkFXQXAzaE9CRDlNdS9OUWE2SGRualpZYlA5SjhHWnRxR0hoemMyMUZJclJIczJ5QW94dzFQTDFsRmcwMEcwa2N1QXBmYWhpNi9MTnpxN092bDVQbWpsSXRyYUNKWlFSQ3Q1bHBGeVVScDVtOHVNUDE1cW5UNXhKWDIwMXV1YktTemJxczdKSFkxWVNuVVFCRkZqUUVNWDlkV1BHMVFRbFVVUjR5cXJmcUIxcmVwS0RoaW5DaEk2QWZWUks2U2ZQVjI4SE92c0JnL3FCTkZoR1NieGxlZ2s2UU16dmVXVVdvTVFacnZKbXlMclcyb1FaQVl6Ry9jODk1UUVXa3B3QzB4bWVUQ2M1N3BSVnRsWXRRZ0N0WVhLaUswL29SeWlGSEVlQW9wZHE3RzVMVnBOYXZUSjFMVm1wcEtNK0hpV3RONFkyaGFMSW9tS2RZbVFrcjYyaGVxQXNZSzFnaGhGTzRBUzEzYUF3dGlEV3g2UW91MlpES2xISXR2VnFsVTFsSFZxaUZxblNNUWhTR3VaTkNPNWxKcUNCM2NkV3hsNGQycnp0bnJpeGhyY0FsMFp6cFVoVmdkVWRUSmNQOUl3UXQ2OThManZ2L21oZjhkdEdIbGg0djVSMUlBQUFBQVNVVk9SSzVDWUlJPSc7XHJcblxyXG4gICAgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ2dyZWVuJykge1xyXG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSGttbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TkRrNk1ERXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TkRrNk1ERXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdSbU0yVmlNV1F0TkdKbFpDMWpOalEwTFRnelltVXRZalE1WWpabE5EbG1ZbVJtSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaR0V4TlRCbFlURXRNakpoWXkwM09UUTVMVGhpTm1FdFpXVTFNVGM0WlRCbU1XRmtJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPbVl3WldReFpXTTNMVE0xT1RBdFpHRTBZaTA1TVdJd0xUWXdPVFEyWmpGaE5XUTVZend2Y21SbU9teHBQaUE4Y21SbU9teHBQbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJQQzl5WkdZNmJHaytJRHd2Y21SbU9rSmhaejRnUEM5d2FHOTBiM05vYjNBNlJHOWpkVzFsYm5SQmJtTmxjM1J2Y25NK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMFZERTVPakE0T2pBekxUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvMVpEUTJNRGMxWmkwNE1tUm1MV1kzTkRBdFltVTNaUzFtTjJJME16bG1ZamN5TXpFaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVFZVTVRrNk1qTTZNekV0TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPbUZrWmpObFlqRmtMVFJpWldRdFl6WTBOQzA0TTJKbExXSTBPV0kyWlRRNVptSmtaaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE9WUXhOVG8wT1Rvd01TMHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOEwzSmtaanBUWlhFK0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0lEd3ZjbVJtT2xKRVJqNGdQQzk0T25odGNHMWxkR0UrSUR3L2VIQmhZMnRsZENCbGJtUTlJbklpUHo0ZGI3dmpBQUFDZTBsRVFWUkl4OTJXVFd0VFFSU0duek56YjNMVHRLRzFXbEh3cTR1Q2JZWCtBMTI1RUxjdXVpaENSWENwMkgzQmhTdi9nVXZCZ2xKdzRVTEJpZ3BTYVVGY2lGTEZqU0F0c1g2MVNkTTB2WE5jOU5va1JaT1lBUlhuTXF1NXpEUG5uUGU4TTRHcThxZEh3RjhZL3g3MDZyT0pucFRJdGFkZjdvKytMeStWclpoa1JaTDVZempFeE9uMUY1bXBzVVBuYmt5TVRUNXFHenBYbVJsWkx1YkhQN0tFN1VwbjJLNi8xREZWd1dTaG1Gc2RmL2gyWm55Q1NXay92ZmU2ZTc0TnZTYXpKMGZzS3ZWcmRmb1R6S2F3WGlveU4vKzg1RmZUSjd1bjNLY2N3ZGtpRkJzZFhvbFRJSG1EekhiNTFiVG5jQTRYT0dJUk5GU2tRWGRabzZnMVpMb2o2d1dOQm1RMDdOVnA4aW5zaGlBTmd0WFZNbUZYeUlHaC9hZThvQStDMi9uQVdBcDNoT0JEOU11L05RYTZIZG5qWlliUDlKOEdadHFHSGh6YzIxRklyUkhzMnlBb3h3MVBMMWxGZzAwRzBrY3VBcGZhaGk2L0xOenE3T3ZsNVBtamxJdHJhQ0paUVJDdDVscEZ5VVJwNW04dU1QMTVxblQ1eEpYMjAxdXViS1N6YnFzN0pIWTFZU25VUUJGRmpRRU1YOWRXUEcxUVFsVVVSNHlxcmZxQjFyZXBLRGhpbkNoSTZBZlZSSzZTZlBWMjhIT3ZzQmcvcUJORmhHU2J4bGVnazZRTXp2ZVdVV29NUVpydkpteUxyVzJvUVpBWXpHL2M4OTVRRVdrcHdDMHhtZVRDYzU3cFJWdGxZdFFnQ3RZWEtpSzAvb1J5aUZIRWVBb3BkcTdHNUxWcE5hdlRKMUxWbXBwS00rSGlXdE40WTJoYUxJb21LZFltUWtyNjJoZXFBc1lLMWdoaEZPNEFTMTNhQXd0aURXeDZRb3UyWkRLbEhJdHZWcWxVMWxIVnFpRnFuU01RaFNHdVpOQ081bEpxQ0IzY2RXeGw0ZDJyenRucml4aHJjQWwwWnpwVWhWZ2RVZFRKY1A5SXdRdDY5OExqdnYvbWhmOGR0R0hsaDR2NVIxSUFBQUFBU1VWT1JLNUNZSUk9JztcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAncmVkJykge1xyXG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSDNtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRJNk1qRXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRJNk1qRXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TURWak16YzFaRFl0TVdObE9DMWtaalJsTFRnd1lqZ3RNamxtWVRSaFpqQTJaREUzSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaR1JtTUdJelltRXRNV05pWkMxaE1qUTBMV0V5WldNdE1UZzRZVGxrT0dSbE1qazBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPakF3TURKbE5EaGxMVGhtT1dVdE5qVTBZeTA1WWpRMkxUVm1ZV1prTVRCaE4yRTJOend2Y21SbU9teHBQaUE4Y21SbU9teHBQbUZrYjJKbE9tUnZZMmxrT25Cb2IzUnZjMmh2Y0RwbU1HVmtNV1ZqTnkwek5Ua3dMV1JoTkdJdE9URmlNQzAyTURrME5tWXhZVFZrT1dNOEwzSmtaanBzYVQ0Z1BISmtaanBzYVQ1NGJYQXVaR2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmp3dmNtUm1PbXhwUGlBOEwzSmtaanBDWVdjK0lEd3ZjR2h2ZEc5emFHOXdPa1J2WTNWdFpXNTBRVzVqWlhOMGIzSnpQaUE4ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQSEprWmpwVFpYRStJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKamNtVmhkR1ZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZOV1EwTmpBM05XWXRPREprWmkxbU56UXdMV0psTjJVdFpqZGlORE01Wm1JM01qTXhJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMVZERTVPakl6T2pNeExUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvd05XTXpOelZrTmkweFkyVTRMV1JtTkdVdE9EQmlPQzB5T1daaE5HRm1NRFprTVRjaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCs3U2RBd0FBQUFzcEpSRUZVU01mbGw3dHJGRkVZeFgvZm5abGROd21KR2tLSUNENGlJV0tsSW9xclZqNDZRVkJzZllENEgyaGhiWkFVMm9pSW5WcUlXR2hsSTZnZ0JsRjhCTjhoS29oRW9oSTFiamI3dVBlejJOSGRUZHpaWlNkbzRRemZiZVlPNTU3dm5IdnVqS2dxZi9zeS9JUExqM3I0OU00OWhzZHVKVm9HTDY3b0hDZGhBK05temhHVWJDRW5EN2N1bjlqVHVmckQyTEpldStYd3dlWkJiNTQ4c1hqRFpPNzBzbHh5WGI3RHBVUW9hNkZsV09jOFdmOW9ZblNzOSswRitsYWVBNmFhQnYxMGUyak5GNXZkdWE1L0pkYk9JRmxoQlRXSzFmemE5dWZEaXdyYmRud0JMamF0NlJ2RDRJK1dkbkNHZ3RQcTBuTFpJa0NDSjByUGxZY1B6c2N5MHQxUEgvdSsrVWJyMmswc1NUeWVHY1BBMWN1NVdLQ1pydTR6ODdIVG9NeFRhbFpTQmFSSWQ2RGoyOUtianNaeTc3Nyt2bFAyNVl0RE53SWZEWUlxSWFYQ1NFWU1NTTJTbkxHNzNvMWZpd1c2dTZkNzcvd0g5NHZYWHc1N1daRUtJSkFLUDNuT3A4UGxTVTk4NzFwMTVtd2lGdWp6a2RIOS9SMmR5UzJaSDNnSm56K2xsd0FPaC9vcEpsdVV6eU92RG5SQlpJc2xLZ2FQdGJYbXQyY0x3ZExOYWV6Q0JlRGNyQzFUWW13aG1VSmVqM0RweVdPT3FFclRUQ1dUTGJaNnlhRE5HSnhVQ1ZuRlZNVmc4RkR4U0VBMlZuc3hCc1ZndzZKR1Y0eDFxSEdJay9qWjZ3QW5KWUtpMVNsVUZVNENpSUNVM29uSEZGQlZTbmZac2JOQkZSVkZhT3lZakF3SFQ4RlpDMW9iTU55cGdHQ2RhK2lzOU91dlNGQTBIRFZLaUhEZVhMVDNONUJFTk5nQWpabW9JVkFKaDErNjFXSmE4dEljdU5jVHJVUkZOSUtwQ0lqTWphWUZWU3dPRThIVWQ0cFR4VGI0a1ZlM3ZRZ0lJY3VvZEZOcFdOWG9HSlF3RDR3Qno5Uk1CNmNPTVZKYVhGelFoQXF0bnVCbE01aEpIN1VXQ2RzK3k5TUpoeWtXQ0Jvd1V5Um96bG52dmJPTURnMVZnWmh3WjhvTTdnSHdHYnhZb09tQjQxOU5NZCtHeXhVVTU3UWlDaXBQdUZJSkJ0OXNERkpUZFczeTMveFcvQVJOcGp2eGw4MHVMQUFBQUFCSlJVNUVya0pnZ2c9PSc7XHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ3llbGxvdycpIHtcclxuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUlLbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5UZzZOVFV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5UZzZOVFV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUTRNakZrWmpNdFptRmxOQzB4TWpRekxUbGpaVFV0Wm1Ga04yRTJNVGRtTlRVM0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpVd04ySXhZbU10TkRCa1pTMHdaRFF5TFdJd1pUY3RNR1U0TmpObU56VmtOakEwSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEbzRNemN4WTJVMllTMHhZV1prTFRFME5ETXRPVGd4WkMxa04yRTROR1kxTm1VMFpXVThMM0prWmpwc2FUNGdQSEprWmpwc2FUNWhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpCbFpERmxZemN0TXpVNU1DMWtZVFJpTFRreFlqQXROakE1TkRabU1XRTFaRGxqUEM5eVpHWTZiR2srSUR4eVpHWTZiR2srZUcxd0xtUnBaRG80T0dRek5UWmhOeTAzTVRneExXVTFOR0V0T1RsbVpTMDBPREJsTXpWaFl6WTJaalk4TDNKa1pqcHNhVDRnUEM5eVpHWTZRbUZuUGlBOEwzQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSGh0Y0UxTk9raHBjM1J2Y25rK0lEeHlaR1k2VTJWeFBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpWTNKbFlYUmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG80T0dRek5UWmhOeTAzTVRneExXVTFOR0V0T1RsbVpTMDBPREJsTXpWaFl6WTJaallpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UUlVNVGs2TURnNk1ETXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qVmtORFl3TnpWbUxUZ3laR1l0WmpjME1DMWlaVGRsTFdZM1lqUXpPV1ppTnpJek1TSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TlZReE9Ub3lNem96TVMwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdRNE1qRmtaak10Wm1GbE5DMHhNalF6TFRsalpUVXRabUZrTjJFMk1UZG1OVFUzSWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTVWREUxT2pVNE9qVTFMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BuZXdZNlVBQUFKRVNVUkJWRWpIM1ZZeGF4UlJFUDYrOS9heXVkVUlrU05uQ0FvUmxZaUlXZ21DaFJEc1JVdGJDMytBbHNIV3dsWWJpMWhwWXhFRW0xaXBNUkJSRVVROGdvMlNIQ2tpM2wyNDNON3V6VmdrSm5mSHVidTVGeEp3NExIRnpzNDM4MzN6Wm9lcWlyMDJnMzJ3ZlFIMWtsNVdWbitWdjN5NEZ4dzc4a3dPRFIyRXlJWVUyaVAxOVZEd2MrV2lHVDkxdjE0Y0hSOU5pc3NrVGFjZlhHdGNuWHpyRjBaK0l3elo5bFUzdENESWU1aDkxY1NhWEFwdjNKd2I3SnZlVDU4L3l0SnlEYW9XYkQ5aVFmRzJEdFNEVWhERkZxVnZKWEhTZEhwR01MOUErRUZ5RUFWaFNVVHhBQjQveWJ0cDJsQkJzd1hBRXRacU83ZGRtU3RvRmJSQUxRcmRRR2RuSHFKVnZZMXF0UUxHQnY5U24xRFVRb1ZxQTFOM2I2V0NNbTA0dkg2UjE3bUZZUWdEV0x0TmFFZWxhbUFOY081TUdaUFgxK2dFK3ZUUlVXMjJobEE0L0FOeFJORDJ2RENnS093QU1IRkM4ZnpsMlBxZHFjV2diM3BQbjZ4aHRUNk9rV0lSS2dyVm5wS0NDbmcrOFdaK0JXT0ZpcHVtVVd3UVJ6SE9uajhPU01xTXpnK2d2TlJDNGNDeUcrZ1drK3NSNHBZa3V1VUl4RkdNTURTT29HeDdNc1dQdXpSN3Q2dE5pYW85RXUwWFZEdm1yS1l6b3J0VXFUSmpwWnVkcmE2Z1pIZlVoRUwxYjRLdTlITG5uY0lNYm9uOWJWUkJFRHZabzlRVkZKcXRQdDBjU3dSaE1pVG9wWEZGQXBxbGU5bGpvZWl2ZTZWTm8vVHVKYk9KbWdocVFmaStCMlRVZEFOUEhLK01XdjIrMk9UbEt4Nk1tRVJHTUppRDczdXdvSEVDSFM3Nks4VjZJWGovTGhJVmR2ekt1aTNuQTZXdkRYTmh3dGFkTjRmL1pzUC9Bd3p0NVIzYnNRMmpBQUFBQUVsRlRrU3VRbUNDJztcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAncHVycGxlJykge1xyXG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSDNtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURNdE1ESlVNVEk2TWpBNk16TXRNRFU2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURNdE1ESlVNVEk2TWpBNk16TXRNRFU2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WWpWbVltVTNZall0WkdRMU9DMWpOelJpTFRobVpHWXRZakprTmpVMU5UWTNPVEUwSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaakF4Tm1abU5qY3RZV1l4WkMwMk1UUTVMVGd6TWpRdFpETTBPR1kxTnpnMFpUazBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPakF3TURKbE5EaGxMVGhtT1dVdE5qVTBZeTA1WWpRMkxUVm1ZV1prTVRCaE4yRTJOend2Y21SbU9teHBQaUE4Y21SbU9teHBQbUZrYjJKbE9tUnZZMmxrT25Cb2IzUnZjMmh2Y0RwbU1HVmtNV1ZqTnkwek5Ua3dMV1JoTkdJdE9URmlNQzAyTURrME5tWXhZVFZrT1dNOEwzSmtaanBzYVQ0Z1BISmtaanBzYVQ1NGJYQXVaR2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmp3dmNtUm1PbXhwUGlBOEwzSmtaanBDWVdjK0lEd3ZjR2h2ZEc5emFHOXdPa1J2WTNWdFpXNTBRVzVqWlhOMGIzSnpQaUE4ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQSEprWmpwVFpYRStJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKamNtVmhkR1ZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZOV1EwTmpBM05XWXRPREprWmkxbU56UXdMV0psTjJVdFpqZGlORE01Wm1JM01qTXhJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMVZERTVPakl6T2pNeExUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwaU5XWmlaVGRpTmkxa1pEVTRMV00zTkdJdE9HWmtaaTFpTW1RMk5UVTFOamM1TVRRaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCszNDEzandBQUF1cEpSRUZVU01mbGw4OXZWRlVVeHovbjN2dW0wNExsVjhEd2ExR1JOb1M0d0tZUTQwcHdSUWc3b3dsdWNDRWJOcXp3RDJDSEN6ZktRbGVXeEJCV0pwQzRRellFUThMQ0tLTFNBRldVU0pCU3kwdzc3OTV6WEx3cG5hWXowenF2MFlWbmNpZVpuSnYzdmVmNy9aNXozNGlaOFcrSDR6K0kwQzE1Y2Z3U0QyOWVxZVFYWG5tNU5yMnBJbG5TcGFjV0dyRXV6L1plZVRLNjY5aURxYUhmMG9rejcvUU9ldU96bXp1R3B0NzhlR3NhR3RPMWpYNG44bHdMYThJcm9FR2xPams2TVpNOUdHZllQZ1ZxUFlOT1huLzY2dnJHMDZON2RtNGcxN1FvWnkzQ1pBTEVOQnB2cmQ4bWI4dzhCczczck9tanl2MnpzLzAxb2dsUjQ2S1ZiR0hWVTZJUllDSjh2L1hxajE5OVhzcEkzODE4TTF3UDA5YkNhdHVvQUk0KzdsZHVjLzdyVCtaS2djYU45WE12NkxwWkFUS3JkbHllUGpLQkY5UG1QMTdiOS9vSHBkeDdlTWRiSDZWYjZmMXZCNjZpWWtoTFRxejRaWUFpVktPd3FiWXo3ZjM1NkplbFFBOE9Ibms3ajJ2aUR6OWQ4MUhtV0F5N0VMbDNET2FEYkdmMzVpT25EMVpLZ2Q3NVplTDRsakRTOTFJY28ySjlHTnBtbDRBcWlQQ1hUVE01ZWZjOUdPMUtzWFFiZysvS3FjWUlZOW5JOEFpeUlTKzRuRytaSnIyQzRCV3MzOGp2QkM0Ly9JSngrMUI2cm5TV3VaZ3hrUFhMR3B4RlJLVk5uWUtKb1NxSWVRSlp2UlM5Z2tNeG9pU2NKS1REK1UwZG1pQ1pLejk3RlMxME5Dbm83S0NFaUlFQW9taGIzWHU2WlF5anMvYk9ESEVHck95YVhBWlVpT1NZRmRwMVpNUVZ1YVFKdDRJNlhQZWt3NXAxZHJPajErSkl4YmlVMWFEWFdyN2JSM0xHUDNuL0NNdHRFQVFSOEFMV1lmQTdCV3Z1S3cyYUVmQk5NcEl0ek5zbGxRb0ZvSFRYZm9WOVdoZ0p0R3Vsb2dHMWhKcXVEcjIrc0FqSnJHT2xVSXpmVmRIVU5ha1NaN2dBRmp0NUxlRzl6RHVnTEdoR2xRR2s3cEVna09ZZjYxcjhMSWdKV29Hc1lRU3ljcUFOWnYwamZ1WDNlM2VmVHlScGZ0bzFpU2N3elorK0ZPaWhrd2VtZk1PdkRYUGtUazNuZ1ZSMFNTK3JHQ21JRzY3dXJ5M2JoditidnhWL0E4c1ZRQWc4K2dEWUFBQUFBRWxGVGtTdVFtQ0MnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVja1VybDtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRNaWxlc1RvRmVldChtaWxlcykge1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQobWlsZXMgKiA1MjgwKTtcclxuICB9XHJcblxyXG4gIHB1c2hOZXdUcnVjayhtYXBzLCB0cnVja0l0ZW0pIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgdmFyIGN1cnJlbnRPYmplY3QgPSB0aGlzO1xyXG4gICAgdmFyIHBpbkxvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRydWNrSXRlbS5sYXQsIHRydWNrSXRlbS5sb25nKTtcclxuICAgIHZhciBkZXN0TG9jID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRydWNrSXRlbS53ckxhdCwgdHJ1Y2tJdGVtLndyTG9uZyk7XHJcbiAgICB2YXIgaWNvblVybDtcclxuICAgIHZhciBpbmZvQm94VHJ1Y2tVcmw7XHJcbiAgICB2YXIgTmV3UGluO1xyXG4gICAgdmFyIGpvYklkVXJsID0gJyc7XHJcblxyXG4gICAgdmFyIHRydWNrQ29sb3IgPSB0cnVja0l0ZW0udHJ1Y2tDb2wudG9Mb3dlckNhc2UoKTtcclxuICAgIGljb25VcmwgPSB0aGlzLmdldEljb25VcmwodHJ1Y2tDb2xvciwgdHJ1Y2tJdGVtLmxhdCwgdHJ1Y2tJdGVtLmxvbmcsIHRydWNrSXRlbS53ckxhdCwgdHJ1Y2tJdGVtLndyTG9uZyk7XHJcblxyXG4gICAgaWYgKHRydWNrQ29sb3IgPT0gJ2dyZWVuJykge1xyXG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUZHbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdOUzB3TVZReE5qb3hNVG94TUMwd05Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1qQXRNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TWpBdE1EUTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVGRrWmpFMFltUXROREJoT0MwMU5EUmpMVGt6T1RBdE0yUmlObVprWVRabU1tSmxJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNk1HRmtNMkl5WkRJdE9EQmhOaTB4TURSa0xUaGlOelF0WmpWaFpERm1NVGhsWXpFeUlpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9UZGtaakUwWW1RdE5EQmhPQzAxTkRSakxUa3pPVEF0TTJSaU5tWmtZVFptTW1KbElqNGdQSGh0Y0UxTk9raHBjM1J2Y25rK0lEeHlaR1k2VTJWeFBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpWTNKbFlYUmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG81TjJSbU1UUmlaQzAwTUdFNExUVTBOR010T1RNNU1DMHpaR0kyWm1SaE5tWXlZbVVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGd0TURVdE1ERlVNVFk2TVRFNk1UQXRNRFE2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpTHo0Z1BDOXlaR1k2VTJWeFBpQThMM2h0Y0UxTk9raHBjM1J2Y25rK0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBpQThMM0prWmpwU1JFWStJRHd2ZURwNGJYQnRaWFJoUGlBOFAzaHdZV05yWlhRZ1pXNWtQU0p5SWo4K09kdUszUUFBQXc5SlJFRlVhTjd0bWoxUEcwRVFodThudUtlaERKMHJsTkpTSkdwSHBDV3lsRFlGNmFBQlY2UWlRUUtsU1JSTUZTVUZwcU5CbUFvRUJhUWdwRFRpUTVRR21wU2JlOUZ0TkJuMnpudDNPOGQ5ZUtTUmJUanR2dmZjN3N6YzducWVrQ21sMnFyWWR1SjdUUXBPUS9keS8rZGVmVG5ZVU11OXRkdzdkRUl2c2E0VW9DM2R3OVNubDJwczRWbGhISHFwSlFWUTkvMmo3ejNmQjJGajlOZk43MExCMFg3UVAwb0dLQURUczUzRTZLZ3lnUHhyRnprQXpGYzBSaDJqcG5LQS9PdlcrY2g0OCsydHNmRlg2NityQllqRFdkeCtIOWw0cFFCeE9PKzY4ME1icnd5Z0pIQXFBeWdwbkVvQVNnT245SURTd2lrMUlQLzdTbG80cFFYa2Z6WmR3Q2t6b0w0TE9LVUVSRWZQajVOdTZzYkxDS2lqZnp6LzhHSUV5QUFJSzJmcWNuRHRwUEV5QW5KNk15TkFReHpUbEpxTGFadWxUeXhOcWp1eTdPcEpQRzI2Sm5ReHVGS3ptM05xK3V0TTdoMDZvZmUvSlZjSlFIU2FGZHhtUGFsNGdYcUs3UkFVemJaMGtTZ1dVREdmc2NDRytvb3Z6ZWJSbWJYRkFSWE5SNEN5QklUcG95TS9Qdk8wUVlqU2dtcXpMVFdjQUVKbjM0ODNqVkVOS1hKNWQvWEp3R0NuNVpTVUdOVDIrNGNQMlZVVUVETFRuVVZtZ2tpTXNDemhoRDAwYnAvM04yUUE0ZW53YldWa0tEd1ZPTi80enhJU2g0TjcwZHFnRzFtVWFzUDFUZ0h4OGp0c2J3elgwU3JheGZLSnphaTJXZXhEYUtEYVROUHRVWkZvQ3doSFEydzNEZ0VKS3dOWnZZdlJWNE00Mms3WndRcEQ5ZC9RZ1BhRzNZd1dZYnNrUXFmak1OR3VqcXJZYXFNamp0NHZRZ1N6Y1Eyb3BmK3lmYmJ6S0c3Z3R6WTBFcmVta0t5djZNaTIxVWJ2UjU4djRHZUNNR2o0ZHM5UC9SL0VHa1I2cEdzNERZQVFaQ3RleHl5ZCtpVWNxVHVKTnByNlE3SmZuUU9xVVVoaGxtUUVaV1ZKQUlWWUsyeTd1Ulljdkx5TnFtL3l1dHhocTQyWEsvVHQvVjlndGp5RVNiMFRaMXVJRHYwZ0NUUUV2UjJWdXJtelN2czhhS09XOWxEbU9JMVJVVUlNYzdydUNWdHdvdy9hb3Q0SkRkcGFZdWVlMFJsZUJKRVZJTXEwWE9sVVFMUzJaZ0p0SFFraEt6SENRdHZMMEdpNVltRWQ2YWQxSHRINW5uV3djNit0VGd0ZmcwRjNNMDZiZndHNFR2OFh5K2hQYUFBQUFBQkpSVTVFcmtKZ2dnPT0nO1xyXG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICdyZWQnKSB7XHJcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXJDQVlBQUFEYmpjNnpBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRkVtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd05TMHdNVlF4TmpveE1Ub3lNUzB3TkRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1qTXRNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1qTXRNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WmpBMVkyVm1ORGN0TTJOallpMDNZalEyTFdJMVpqUXROMkk1TURBd01qZzFNamxsSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT21Zd05XTmxaalEzTFROalkySXROMkkwTmkxaU5XWTBMVGRpT1RBd01ESTROVEk1WlNJZ2VHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT21Zd05XTmxaalEzTFROalkySXROMkkwTmkxaU5XWTBMVGRpT1RBd01ESTROVEk1WlNJK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZaakExWTJWbU5EY3RNMk5qWWkwM1lqUTJMV0kxWmpRdE4ySTVNREF3TWpnMU1qbGxJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakV4T2pJeExUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUHBLcGNLY0FBQUw0U1VSQlZHamU3WnJOU2pNeEZJYm5FdVlTdW5iVm5WczM3c1ViY0c1QTZOWnVuS1U3WGVqYTZnMjBGMUN3NjI0VVFTd0kva0JGRUlwRlFSQ0VtTGMwY25xY1RETXp5VGcvUFhBKzlXTkkzanhKVGs1K1BNK0JDU0ZDVVc2N2xPNTdqdUJzcUZxKzM5L0Y2L201ZURrNUtieERKL1FTNjdvQzFGTTFqTGEzeGVYYVdta2NlcGsxMGdCb1NqK1VmaUg5VFRkR1AwZWpVc0ZSL2pFYzBtYUVTY0ZjbUU1aVZGUWJRUExEZlE0QTh4V0ZVY2VvcVIwZytkRXBIeG4zdTd1UmhkOEZRYjBBY1Rqamc0UFl3bXNGaU1ONWFyZVhGbDRiUUduZzFBWlFXamkxQUpRRlR1VUJaWVZUYVVEeWw2T3NjQ29MU1A2elpRTk9sUUU5MklCVFpVQXptL1I2bVF1dk5LQ2J6YzBWSUIyZ3IrZG5LNFZYRnBDdHhxd0FMWEZNVTJvMnBtMmVmcjIrem85ZFc1N3QzcVpuUWwvanNYamEyeE4zT3p1RmQraUVYbWErZFVCMG1wWGNXaXFMdGg0dmtFK3hvVm8yNjlFOW1KT0Fpdm1NQXpia1YveG90b2pPTEhRT3FHeStBcFFuSUV3ZkZmbnhzMGdYaEVndHFEYlRWTU1LSUZRMjZYWWpveHFXeUpmajQzOERnNXVXejl0YjdSMGRWbGVuZ0V4WEpvakVDTXNUanE3VHVMMmVuYmtCaE43aDE4cFlvZEFyY0g3eG55Y2tEZ2R0VWRxZ0c2c28xWWJ2clFMaTZiZnViZ3pmMFN6YXh2R0p5YWcyT2V4RGFLRGFvcVpiWkpKb0FnaFBRMHd2RGdFSkp3TjU3Y1hvMWlDSk5vendKZG4veGdLZ3VNWW9FYVpISW5RNkxoTnQ2Nm1LcVRZNjRtaDdFU0swejE3VS8wejcvVDl4QTMvL0JqaFpTTktjd21WK1JVZTJxVGJhSHZXK0lPSk4wSURmaFYwdHZBaVRrUjdMTlp3R1FBZ3lGYTlpbGxyNlhUamRIaVRSUmp0UHMvbzFPU0NmUXRJdWtTbEdVRjZXQnBER0F0MWR2RDkvZURtTnkyK0tldHhocW8ybkszVDN2aENZRFI1aFV1OGt1UlppTytOQlJIazJQWXhidXY4YzVpMW0yby96TXZ5c2p6SWJORWJGQ1ltWTAwM1BzYzBiT3RNV3R5ZU0wQlk0ZS9lTXlyQVJ4S29BVVpyanlzREx3ZmpOc0tHMmpnc2hSd25DUXVqbGFPaU1CTm82cm52ck1hYnlnWEd3czYrdE9hOWZaOUM5bGJUY0h4SEJ4QjdKNmVUVkFBQUFBRWxGVGtTdVFtQ0MnO1xyXG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICd5ZWxsb3cnKSB7XHJcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXNDQVlBQUFER2lQNExBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRkVtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd05TMHdNVlF4TmpveE1Ub3dOaTB3TkRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1Ua3RNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1Ua3RNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RBeU5ERTRZMkV0TlRNek5DMDROalJqTFdGaE5tRXRZVEpsTkRrMlltVTFZbUU0SWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2prd01qUXhPR05oTFRVek16UXRPRFkwWXkxaFlUWmhMV0V5WlRRNU5tSmxOV0poT0NJZ2VHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2prd01qUXhPR05oTFRVek16UXRPRFkwWXkxaFlUWmhMV0V5WlRRNU5tSmxOV0poT0NJK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVEF5TkRFNFkyRXROVE16TkMwNE5qUmpMV0ZoTm1FdFlUSmxORGsyWW1VMVltRTRJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakV4T2pBMkxUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUG5LYkk1WUFBQU1KU1VSQlZHamU3WnE5U3NSQUVJRHZFU3g4QU1FWE9Id0I3d25VSjVCN0FBVjdDNi9WUmt1dHZNNVNRUVFiT1FXMXNmQkFMU3o4NFJvYndiUFFRc3l0TTJzMlRqYWJaUE96YTM1dVlGQlFzcE12c3pPenM5Tm9XQkRHMkFUb2JBbTAyYkFwc09BQzZCTXJsN3lCcnVGSE5RMm53OG90MThZZ3dZTmIzakpmNzh4NTNHSE8vVWJ4RmV4RWU0bnNtd0owSUZad3pscnMrM0N5TklyMlVra0xvQW02Q2Rwejk2eFNSdSszcFlJamRQUjZrUTZRQzZhbnU0bHhvZG9BY2lPN1gyQy80c044Q2w1VE8wRHdmN3V5WnpoWGkrbzlmRGxmTDBBQk9IZXIwVUd1VG9BQ2NQckw4Vm1nTG9EU3dLa05vTFJ3YWdFb0M1ektBOG9LcDlLQTRQZXRySEFxQzhodFMyU0dVMlZBVDNuQXFTUWc2ajJqd1Y3MjAzQUZBWFc5MXNUSnpCaVFBdEExLysxemtFOC9wWUtBY24yWk1hQTRRTEJOcWVTeGJhM3E4VFJqWDBOemdQZ1hJRDBoOWpGZ1RuOEpQR3V1K0FwMm9yMitscXNKUUhTYmxWeFdHcWJpQmRaVDBnMUIyZVJBRklubUFpcnNaMnl3WVgwVmFNMFdVQ1hwbUFkVU1oMERzZ29JdG8rSS9QeG5nUzRJc2JUdzJhWlphdVFDQ0JmRG1LSVVTSkdqKy9YL0EzTzFDQ1hHVGNnZDNUblBya1lCL1dhbVlmeUZJUmlKSG1hMStnMzdhSkk0RDl0bUFPSFhrYStWTVVQaFYrRXFYZnpiaENURDRWbEoySVplaFgrbnRvVjBMZElEa3NydjBMc3hUT3YwWmpXSDlvbVdWMnMwKzNob0lMYXB0bHVnU05RRmhLTWh1aGVISE9ibndOcFpqQjROa3RqR1BUeTYrbThKUUtkeEwrTVpvZGtTb2RzeDF1aThSbFUwYmFNZVI5K1hod2kvVEFsQWJlOWxYbzZDY1FPcGl3ZkNRNUxXRkNicksrcloycmJSOTNIbkMrU1pJSFFhK2Jxbi96ZXhNZVNSSHRNMVZ4SUEwU0J0UUNKbXVhbmZpRUxxVG1VYlNmMGgyYStwbWtMdHg2YklGQjVrUzlJQUNwRjIxS2d1RGw0T0krdWJnclk3dEcyVHloVjZldmNDcytZUUp0VnVrbXNoNnZwdUVtZ1oxRTVVNmc0MjgzeVY5clA3akltc1E1bFR2aGdWWVloaVR6Y3R6R00vZTdaRm5Ba1Z0cldOelQzalluZ1E1SWRXTUVyVnJzelZnUGlCOWFTMmRVMFlzcFVnTEhRc1QvVzNFOWltRGVjSFJqeFNtSyticWZ3QUFBQUFTVVZPUks1Q1lJST0nO1xyXG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICdwdXJwbGUnKSB7XHJcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXJDQVlBQUFEYmpjNnpBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBR3RtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd015MHdNMVF4TVRvek1Ub3dOQzB3TlRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk5Ea3RNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk5Ea3RNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TURrd1lUQXdaVFl0T1RObVppMWtZalExTFdJeE1qRXRNMkkxTXpCbU4yWXlaVFF3SWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZOVEprTVdRd01EZ3RZV014TXkwM01EUTVMVGxtT0dNdE9UaGlOVGN4WkRJellqSTBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZZekkwT1RnME1HVXRNbUprTVMxa1pEUXhMVGcwWTJJdE1XUTBZalJqTnpWa01Ea3hJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwak1qUTVPRFF3WlMweVltUXhMV1JrTkRFdE9EUmpZaTB4WkRSaU5HTTNOV1F3T1RFaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1ETXRNRE5VTVRFNk16RTZNRFF0TURVNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPakptTXprM01qRTRMVGxtTURVdFpUYzBNQzFpWTJZNUxUTmlNbVZqTXprNU1EUTNNaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhPQzB3TXkwd00xUXhNVG96T1Rvd09DMHdOVG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGljMkYyWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1Ea3dZVEF3WlRZdE9UTm1aaTFrWWpRMUxXSXhNakV0TTJJMU16Qm1OMll5WlRRd0lpQnpkRVYyZERwM2FHVnVQU0l5TURFNExUQTFMVEF4VkRFMk9qRTFPalE1TFRBME9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQnpkRVYyZERwamFHRnVaMlZrUFNJdklpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QZ1lvSTRvQUFBTDlTVVJCVkdqZTdacTdUaHRCRkliM0Vmd0lQSUlmZ1RmQU5aV3IxTzZEaEx1VVFCc3B5blpXaW5BTERVaGdGMGdrVWlRaWgyWWIxa1Vva0pDTUVBVlV5LzdJQThmSHM3dXp1M00yZS9HUmpuelJhdWJmYjJiT25MazRqcEFGUWRBUHFtMlhvYmVrNEt5cVdwNGVuNFB4b1JmOEhseVYzcUVUZW9udFNRSGFWelY4N3gwSG45ZStWY2FobDFwV0FPM1F0MElmaGo2TjZxTjMvclJTY0pUZi9MM05CbWdHWm1nNmlGRlJZd0NGejI1eUFCaXZLSXc2ZWszakFJWFBmZVU5NCtUVHViYndvNDFoc3dCeE9CZGZMbU1MYnhRZ0RtZTA4eXV4OE1ZQXlnS25NWUN5d21rRW9EeHdhZzhvTDV4YUF3cS9iK2VGVTF0QTRXZkhCcHc2QS9KdHdLa2xJTnA3dkRNL2QrRjFCT1NxSDRNUFIwdEFHa0RZT1FzZWJoK3RGRjVIUUZaZlpna293VEZNcWRrWXRrVzZ1NzQ3dCszcVNMUTIzUlBDME1YTStPUGpXZWtkT3FGM2JzdFZBaEFkWmhXM25pTVZMOUFhN0lTZ2FyYXZra1N4Z0lyeGpBMDI1RmQ4YTdhTXpxd3ZEcWhxdmdSVUpDQU1IeFg1OFZtbUEwS2tGbFNiYWFwaEJSQXE4MDU5YlZUREZJa2ozUDhGQmljdGQ5ZlR5RE02eks2aWdFeG5Kb2hFRHlzU1RsU2pjUnNmZURLQTBEcjhXQmt6RkZvRnpnLytpNFRFNGVCZGxEYm94aXhLdGVGNXE0QjQraDExTm9ibmFCWnRZL3ZFcEZlYmJQWWhORkJ0dXVHMmtDU2FBa0pjTVQwNEJDU2Fya3V2eFdoZGFiU2hoeWRrLzZzSzBDanBaVlNocGxzaWREZ21pYloxVmNWVUcrMXg5SDBSSXBpdEtFQmQ5WS8vODk5QzNNRHZ0d0IzNktYT0tTVHpLOXF6VGJYUjkxSDNDL2lkSUhRYWZ0enpaKzVHMk1IN2pUQWFBTk5NNFNwbXFhbGZ3dW55SUkwMjJuZ1JzMStiQTJwUlNKRlRaSVllVkpSbEFSUmgzYWpqNXRiczR1VjlYSDVUMXUwT1UyMDhYYUdyOTdmQWJIZ0prN3FiNWxpSXJZeEhtdkpzZWo5dTZsN1l6SnZQdENlek1scDVMMld1MEJnVkowUXpwdHVPc00xZTlGVmIzSnBRbzYwcmR1OFpsV0VoaUZrQm9uVGJsVllGeEd2clpORG1TZ2paVGhFVytrNkJSdE1WQTNPbFcyc1NVL25JT05qWjE5YW1pYS9Hb0x1VHBzd1hvYVR3c25LQWtkRUFBQUFBU1VWT1JLNUNZSUk9JztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZmVldGZvck1pbGVzID0gMC4wMDAxODkzOTQ7XHJcbiAgICB2YXIgbWllbHNUb2Rpc3BhdGNoID0gcGFyc2VGbG9hdCh0cnVja0l0ZW0uZGlzdCkudG9GaXhlZCgyKTtcclxuXHJcbiAgICB0aGlzLnJlc3VsdHMucHVzaCh7XHJcbiAgICAgIGRpc3BsYXk6IHRydWNrSXRlbS50cnVja0lkICsgXCIgOiBcIiArIHRydWNrSXRlbS50ZWNoSUQsXHJcbiAgICAgIHZhbHVlOiAxLFxyXG4gICAgICBMYXRpdHVkZTogdHJ1Y2tJdGVtLmxhdCxcclxuICAgICAgTG9uZ2l0dWRlOiB0cnVja0l0ZW0ubG9uZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcclxuICAgIGNvbnN0IGxpc3RPZlB1c2hQaW5zID0gbWFwcy5lbnRpdGllcztcclxuICAgIHZhciBpc05ld1RydWNrID0gdHJ1ZTtcclxuXHJcbiAgICB2YXIgbWV0YWRhdGEgPSB7XHJcbiAgICAgIHRydWNrSWQ6IHRydWNrSXRlbS50cnVja0lkLFxyXG4gICAgICBBVFRVSUQ6IHRydWNrSXRlbS50ZWNoSUQsXHJcbiAgICAgIHRydWNrU3RhdHVzOiB0cnVja0l0ZW0udHJ1Y2tDb2wsXHJcbiAgICAgIHRydWNrQ29sOiB0cnVja0l0ZW0udHJ1Y2tDb2wsXHJcbiAgICAgIGpvYlR5cGU6IHRydWNrSXRlbS5qb2JUeXBlLFxyXG4gICAgICBXUkpvYlR5cGU6IHRydWNrSXRlbS53b3JrVHlwZSxcclxuICAgICAgV1JTdGF0dXM6IHRydWNrSXRlbS53clN0YXQsXHJcbiAgICAgIEFzc2luZ2VkV1JJRDogdHJ1Y2tJdGVtLndySUQsXHJcbiAgICAgIFNwZWVkOiB0cnVja0l0ZW0uc3BlZWQsXHJcbiAgICAgIERpc3RhbmNlOiBtaWVsc1RvZGlzcGF0Y2gsXHJcbiAgICAgIEN1cnJlbnRJZGxlVGltZTogdHJ1Y2tJdGVtLmlkbGVUaW1lLFxyXG4gICAgICBFVEE6IHRydWNrSXRlbS50b3RJZGxlVGltZSxcclxuICAgICAgRW1haWw6ICcnLC8vIHRydWNrSXRlbS5FbWFpbCxcclxuICAgICAgTW9iaWxlOiAnJywgLy8gdHJ1Y2tJdGVtLk1vYmlsZSxcclxuICAgICAgaWNvbjogaWNvblVybCxcclxuICAgICAgaWNvbkluZm86IGluZm9Cb3hUcnVja1VybCxcclxuICAgICAgQ3VycmVudExhdDogdHJ1Y2tJdGVtLmxhdCxcclxuICAgICAgQ3VycmVudExvbmc6IHRydWNrSXRlbS5sb25nLFxyXG4gICAgICBXUkxhdDogdHJ1Y2tJdGVtLndyTGF0LFxyXG4gICAgICBXUkxvbmc6IHRydWNrSXRlbS53ckxvbmcsXHJcbiAgICAgIHRlY2hJZHM6IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsXHJcbiAgICAgIGpvYklkOiB0cnVja0l0ZW0uam9iSWQsXHJcbiAgICAgIG1hbmFnZXJJZHM6IHRoaXMubWFuYWdlcklkcyxcclxuICAgICAgd29ya0FkZHJlc3M6IHRydWNrSXRlbS53b3JrQWRkcmVzcyxcclxuICAgICAgc2JjVmluOiB0cnVja0l0ZW0uc2JjVmluLFxyXG4gICAgICBjdXN0b21lck5hbWU6IHRydWNrSXRlbS5jdXN0b21lck5hbWUsXHJcbiAgICAgIHRlY2huaWNpYW5OYW1lOiB0cnVja0l0ZW0udGVjaG5pY2lhbk5hbWUsXHJcbiAgICAgIGRpc3BhdGNoVGltZTogdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSxcclxuICAgICAgcmVnaW9uOiB0cnVja0l0ZW0uem9uZVxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgam9iSWRTdHJpbmcgPSAnaHR0cDovL2VkZ2UtZWR0Lml0LmF0dC5jb20vY2dpLWJpbi9lZHRfam9iaW5mby5jZ2k/JztcclxuXHJcbiAgICBsZXQgem9uZSA9IHRydWNrSXRlbS56b25lO1xyXG5cclxuICAgIC8vID0gTSBmb3IgTVdcclxuICAgIC8vID0gVyBmb3IgV2VzdFxyXG4gICAgLy8gPSBCIGZvciBTRVxyXG4gICAgLy8gPSBTIGZvciBTV1xyXG4gICAgaWYgKHpvbmUgIT0gbnVsbCAmJiB6b25lICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAoem9uZSA9PT0gJ01XJykge1xyXG4gICAgICAgIHpvbmUgPSAnTSc7XHJcbiAgICAgIH0gZWxzZSBpZiAoem9uZSA9PT0gJ1NFJykge1xyXG4gICAgICAgIHpvbmUgPSAnQidcclxuICAgICAgfSBlbHNlIGlmICh6b25lID09PSAnU1cnKSB7XHJcbiAgICAgICAgem9uZSA9ICdTJ1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB6b25lID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgam9iSWRTdHJpbmcgPSBqb2JJZFN0cmluZyArICdlZHRfcmVnaW9uPScgKyB6b25lICsgJyZ3cmlkPScgKyB0cnVja0l0ZW0ud3JJRDtcclxuXHJcbiAgICB0cnVja0l0ZW0uam9iSWQgPSB0cnVja0l0ZW0uam9iSWQgPT0gdW5kZWZpbmVkIHx8IHRydWNrSXRlbS5qb2JJZCA9PSBudWxsID8gJycgOiB0cnVja0l0ZW0uam9iSWQ7XHJcblxyXG4gICAgaWYgKHRydWNrSXRlbS5qb2JJZCAhPSAnJykge1xyXG4gICAgICBqb2JJZFVybCA9ICc8YSBocmVmPVwiJyArIGpvYklkU3RyaW5nICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiIHRpdGxlPVwiQ2xpY2sgaGVyZSB0byBzZWUgYWN0dWFsIEZvcmNlL0VkZ2Ugam9iIGRhdGFcIj4nICsgdHJ1Y2tJdGVtLmpvYklkICsgJzwvYT4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lICE9IG51bGwgJiYgdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSB1bmRlZmluZWQgJiYgdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSAnJykge1xyXG4gICAgICBsZXQgZGlzcGF0Y2hEYXRlID0gdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZS5zcGxpdCgnOicpO1xyXG4gICAgICBsZXQgZHQgPSBkaXNwYXRjaERhdGVbMF0gKyAnICcgKyBkaXNwYXRjaERhdGVbMV0gKyAnOicgKyBkaXNwYXRjaERhdGVbMl0gKyAnOicgKyBkaXNwYXRjaERhdGVbM107XHJcbiAgICAgIG1ldGFkYXRhLmRpc3BhdGNoVGltZSA9IHRoYXQuVVRDVG9UaW1lWm9uZShkdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXBkYXRlIGluIHRoZSBUcnVja1dhdGNoTGlzdCBzZXNzaW9uXHJcbiAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSAhPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnRydWNrTGlzdCA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSk7XHJcblxyXG4gICAgICBpZiAodGhpcy50cnVja0xpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRydWNrTGlzdC5zb21lKHggPT4geC50cnVja0lkID09IHRydWNrSXRlbS50cnVja0lkKSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMudHJ1Y2tMaXN0LmZpbmQoeCA9PiB4LnRydWNrSWQgPT0gdHJ1Y2tJdGVtLnRydWNrSWQpO1xyXG4gICAgICAgICAgY29uc3QgaW5kZXg6IG51bWJlciA9IHRoaXMudHJ1Y2tMaXN0LmluZGV4T2YoaXRlbSk7XHJcbiAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uRGlzdGFuY2UgPSBtZXRhZGF0YS5EaXN0YW5jZTtcclxuICAgICAgICAgICAgaXRlbS5pY29uID0gbWV0YWRhdGEuaWNvbjtcclxuICAgICAgICAgICAgdGhpcy50cnVja0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgdGhpcy50cnVja0xpc3Quc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrV2F0Y2hMaXN0JywgdGhpcy50cnVja0xpc3QpO1xyXG4gICAgICAgICAgICBpdGVtID0gbnVsbDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBVcGRhdGUgaW4gdGhlIFNlbGVjdGVkVHJ1Y2sgc2Vzc2lvblxyXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrRGV0YWlscycpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICBzZWxlY3RlZFRydWNrID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja0RldGFpbHMnKSk7XHJcblxyXG4gICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sudHJ1Y2tJZCA9PSB0cnVja0l0ZW0udHJ1Y2tJZCkge1xyXG4gICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnVHJ1Y2tEZXRhaWxzJyk7XHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tEZXRhaWxzJywgbWV0YWRhdGEpO1xyXG4gICAgICAgICAgc2VsZWN0ZWRUcnVjayA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudHJ1Y2tJdGVtcy5sZW5ndGggPiAwICYmIHRoaXMudHJ1Y2tJdGVtcy5zb21lKHggPT4geC50b0xvd2VyQ2FzZSgpID09IHRydWNrSXRlbS50cnVja0lkLnRvTG93ZXJDYXNlKCkpKSB7XHJcbiAgICAgIGlzTmV3VHJ1Y2sgPSBmYWxzZTtcclxuICAgICAgLy8gSWYgaXQgaXMgbm90IGEgbmV3IHRydWNrIHRoZW4gbW92ZSB0aGUgdHJ1Y2sgdG8gbmV3IGxvY2F0aW9uXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mUHVzaFBpbnMuZ2V0TGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICAgIGlmIChsaXN0T2ZQdXNoUGlucy5nZXQoaSkubWV0YWRhdGEudHJ1Y2tJZCA9PT0gdHJ1Y2tJdGVtLnRydWNrSWQpIHtcclxuICAgICAgICAgIHZhciBjdXJQdXNoUGluID0gbGlzdE9mUHVzaFBpbnMuZ2V0KGkpO1xyXG4gICAgICAgICAgY3VyUHVzaFBpbi5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG4gICAgICAgICAgZGVzdExvYyA9IHBpbkxvY2F0aW9uO1xyXG4gICAgICAgICAgcGluTG9jYXRpb24gPSBsaXN0T2ZQdXNoUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcclxuXHJcbiAgICAgICAgICBsZXQgdHJ1Y2tJZFJhbklkID0gdHJ1Y2tJdGVtLnRydWNrSWQgKyAnXycgKyBNYXRoLnJhbmRvbSgpO1xyXG5cclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0LmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmluZGV4T2YodHJ1Y2tJdGVtLnRydWNrSWQpID4gLTEpIHtcclxuICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0LnB1c2godHJ1Y2tJZFJhbklkKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmxvYWREaXJlY3Rpb25zKHRoaXMsIHBpbkxvY2F0aW9uLCBkZXN0TG9jLCBpLCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKTtcclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRydWNrSXRlbXMucHVzaCh0cnVja0l0ZW0udHJ1Y2tJZCk7XHJcbiAgICAgIE5ld1BpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKHBpbkxvY2F0aW9uLCB7IGljb246IHRydWNrVXJsIH0pO1xyXG5cclxuICAgICAgTmV3UGluLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcbiAgICAgIHRoaXMubWFwLmVudGl0aWVzLnB1c2goTmV3UGluKTtcclxuXHJcbiAgICAgIHRoaXMuZGF0YUxheWVyLnB1c2goTmV3UGluKTtcclxuICAgICAgaWYgKHRoaXMuaXNNYXBMb2FkZWQpIHtcclxuICAgICAgICB0aGlzLmlzTWFwTG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5tYXAuc2V0Vmlldyh7IGNlbnRlcjogcGluTG9jYXRpb24sIHpvb206IHRoaXMubGFzdFpvb21MZXZlbCB9KTtcclxuICAgICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSB0aGlzLm1hcC5nZXRab29tKCk7XHJcbiAgICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSB0aGlzLm1hcC5nZXRDZW50ZXIoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoTmV3UGluLCAnbW91c2VvdXQnLCAoZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5mb2JveC5zZXRPcHRpb25zKHsgdmlzaWJsZTogZmFsc2UgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgMTAyNCkge1xyXG4gICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgIHRoaXMuaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgICAgICAgc2hvd1BvaW50ZXI6IHRydWUsXHJcbiAgICAgICAgICAgIGxvY2F0aW9uOiBlLnRhcmdldC5nZXRMb2NhdGlvbigpLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93Q2xvc2VCdXR0b246IHRydWUsXHJcbiAgICAgICAgICAgIG9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDAsIDIwKSxcclxuICAgICAgICAgICAgaHRtbENvbnRlbnQ6ICc8ZGl2IGNsYXNzID0gXCJpbmZ5IGluZnlNYXBwb3B1cFwiPidcclxuICAgICAgICAgICAgICArIGdldEluZm9Cb3hIVE1MKGUudGFyZ2V0Lm1ldGFkYXRhLCB0aGlzLnRocmVzaG9sZFZhbHVlLCBqb2JJZFVybCkgKyAnPC9kaXY+J1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGhpcy50cnVja1dhdGNoTGlzdCA9IFt7IFRydWNrSWQ6IGUudGFyZ2V0Lm1ldGFkYXRhLnRydWNrSWQsIERpc3RhbmNlOiBlLnRhcmdldC5tZXRhZGF0YS5EaXN0YW5jZSB9XTtcclxuXHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcclxuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja0RldGFpbHMnLCBlLnRhcmdldC5tZXRhZGF0YSk7XHJcblxyXG4gICAgICAgICAgLy8gQSBidWZmZXIgbGltaXQgdG8gdXNlIHRvIHNwZWNpZnkgdGhlIGluZm9ib3ggbXVzdCBiZSBhd2F5IGZyb20gdGhlIGVkZ2VzIG9mIHRoZSBtYXAuXHJcblxyXG4gICAgICAgICAgdmFyIGJ1ZmZlciA9IDMwO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hPZmZzZXQgPSB0aGF0LmluZm9ib3guZ2V0T2Zmc2V0KCk7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveEFuY2hvciA9IHRoYXQuaW5mb2JveC5nZXRBbmNob3IoKTtcclxuICAgICAgICAgIHZhciBpbmZvYm94TG9jYXRpb24gPSBtYXBzLnRyeUxvY2F0aW9uVG9QaXhlbChlLnRhcmdldC5nZXRMb2NhdGlvbigpLCBNaWNyb3NvZnQuTWFwcy5QaXhlbFJlZmVyZW5jZS5jb250cm9sKTtcclxuICAgICAgICAgIHZhciBkeCA9IGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveE9mZnNldC54IC0gaW5mb2JveEFuY2hvci54O1xyXG4gICAgICAgICAgdmFyIGR5ID0gaW5mb2JveExvY2F0aW9uLnkgLSAyNSAtIGluZm9ib3hBbmNob3IueTtcclxuXHJcbiAgICAgICAgICBpZiAoZHkgPCBidWZmZXIpIHsgLy8gSW5mb2JveCBvdmVybGFwcyB3aXRoIHRvcCBvZiBtYXAuXHJcbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cclxuICAgICAgICAgICAgZHkgKj0gLTE7XHJcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGJ1ZmZlciBmcm9tIHRoZSB0b3AgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICBkeSArPSBidWZmZXI7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAjIyMjIElmIGR5IGlzIGdyZWF0ZXIgdGhhbiB6ZXJvIHRoYW4gaXQgZG9lcyBub3Qgb3ZlcmxhcC5cclxuICAgICAgICAgICAgZHkgPSAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChkeCA8IGJ1ZmZlcikgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCBsZWZ0IHNpZGUgb2YgbWFwLlxyXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXHJcbiAgICAgICAgICAgIGR4ICo9IC0xO1xyXG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgZHggKz0gYnVmZmVyO1xyXG4gICAgICAgICAgfSBlbHNlIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggcmlnaHQgc2lkZSBvZiBtYXAuXHJcbiAgICAgICAgICAgIGR4ID0gbWFwcy5nZXRXaWR0aCgpIC0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94QW5jaG9yLnggLSB0aGF0LmluZm9ib3guZ2V0V2lkdGgoKTtcclxuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeCBpcyBncmVhdGVyIHRoYW4gemVybyB0aGVuIGl0IGRvZXMgbm90IG92ZXJsYXAuXHJcbiAgICAgICAgICAgIGlmIChkeCA+IGJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgIGR4ID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSByaWdodCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgICAgZHggLT0gYnVmZmVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gIyMjIyBBZGp1c3QgdGhlIG1hcCBzbyBpbmZvYm94IGlzIGluIHZpZXdcclxuICAgICAgICAgIGlmIChkeCAhPSAwIHx8IGR5ICE9IDApIHtcclxuICAgICAgICAgICAgbWFwcy5zZXRWaWV3KHtcclxuICAgICAgICAgICAgICBjZW50ZXJPZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludChkeCwgZHkpLFxyXG4gICAgICAgICAgICAgIGNlbnRlcjogbWFwcy5nZXRDZW50ZXIoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoaXMubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcclxuXHJcbiAgICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhpcy5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxyXG4gICAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0ZWNobmljaWFuRGV0YWlscyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbk5hbWUgPSB0ZWNobmljaWFuRGV0YWlscy5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLmluZm9ib3gsICdjbGljaycsIHZpZXdUcnVja0RldGFpbHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ21vdXNlb3ZlcicsIChlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgICAgICAgIHNob3dQb2ludGVyOiB0cnVlLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCAyMCksXHJcbiAgICAgICAgICAgIGh0bWxDb250ZW50OiAnPGRpdiBjbGFzcyA9IFwiaW5meSBpbmZ5TWFwcG9wdXBcIj4nXHJcbiAgICAgICAgICAgICAgKyBnZXRJbmZvQm94SFRNTChlLnRhcmdldC5tZXRhZGF0YSwgdGhpcy50aHJlc2hvbGRWYWx1ZSwgam9iSWRVcmwpICsgJzwvZGl2PidcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRoaXMudHJ1Y2tXYXRjaExpc3QgPSBbeyBUcnVja0lkOiBlLnRhcmdldC5tZXRhZGF0YS50cnVja0lkLCBEaXN0YW5jZTogZS50YXJnZXQubWV0YWRhdGEuRGlzdGFuY2UgfV07XHJcblxyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snLCBlLnRhcmdldC5tZXRhZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tEZXRhaWxzJywgZS50YXJnZXQubWV0YWRhdGEpO1xyXG5cclxuICAgICAgICAgIC8vIEEgYnVmZmVyIGxpbWl0IHRvIHVzZSB0byBzcGVjaWZ5IHRoZSBpbmZvYm94IG11c3QgYmUgYXdheSBmcm9tIHRoZSBlZGdlcyBvZiB0aGUgbWFwLlxyXG5cclxuICAgICAgICAgIHZhciBidWZmZXIgPSAzMDtcclxuICAgICAgICAgIHZhciBpbmZvYm94T2Zmc2V0ID0gdGhhdC5pbmZvYm94LmdldE9mZnNldCgpO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hBbmNob3IgPSB0aGF0LmluZm9ib3guZ2V0QW5jaG9yKCk7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveExvY2F0aW9uID0gbWFwcy50cnlMb2NhdGlvblRvUGl4ZWwoZS50YXJnZXQuZ2V0TG9jYXRpb24oKSwgTWljcm9zb2Z0Lk1hcHMuUGl4ZWxSZWZlcmVuY2UuY29udHJvbCk7XHJcbiAgICAgICAgICB2YXIgZHggPSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hPZmZzZXQueCAtIGluZm9ib3hBbmNob3IueDtcclxuICAgICAgICAgIHZhciBkeSA9IGluZm9ib3hMb2NhdGlvbi55IC0gMjUgLSBpbmZvYm94QW5jaG9yLnk7XHJcblxyXG4gICAgICAgICAgaWYgKGR5IDwgYnVmZmVyKSB7IC8vIEluZm9ib3ggb3ZlcmxhcHMgd2l0aCB0b3Agb2YgbWFwLlxyXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXHJcbiAgICAgICAgICAgIGR5ICo9IC0xO1xyXG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBidWZmZXIgZnJvbSB0aGUgdG9wIGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgZHkgKz0gYnVmZmVyO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeSBpcyBncmVhdGVyIHRoYW4gemVybyB0aGFuIGl0IGRvZXMgbm90IG92ZXJsYXAuXHJcbiAgICAgICAgICAgIGR5ID0gMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoZHggPCBidWZmZXIpIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggbGVmdCBzaWRlIG9mIG1hcC5cclxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxyXG4gICAgICAgICAgICBkeCAqPSAtMTtcclxuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgbGVmdCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgIGR4ICs9IGJ1ZmZlcjtcclxuICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIHJpZ2h0IHNpZGUgb2YgbWFwLlxyXG4gICAgICAgICAgICBkeCA9IG1hcHMuZ2V0V2lkdGgoKSAtIGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveEFuY2hvci54IC0gdGhhdC5pbmZvYm94LmdldFdpZHRoKCk7XHJcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHggaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhlbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxyXG4gICAgICAgICAgICBpZiAoZHggPiBidWZmZXIpIHtcclxuICAgICAgICAgICAgICBkeCA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICAgIGR4IC09IGJ1ZmZlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vICMjIyMgQWRqdXN0IHRoZSBtYXAgc28gaW5mb2JveCBpcyBpbiB2aWV3XHJcbiAgICAgICAgICBpZiAoZHggIT0gMCB8fCBkeSAhPSAwKSB7XHJcbiAgICAgICAgICAgIG1hcHMuc2V0Vmlldyh7XHJcbiAgICAgICAgICAgICAgY2VudGVyT2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoZHgsIGR5KSxcclxuICAgICAgICAgICAgICBjZW50ZXI6IG1hcHMuZ2V0Q2VudGVyKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcclxuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGlzLm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XHJcblxyXG4gICAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcclxuICAgICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5pbmZvYm94LCAnY2xpY2snLCB2aWV3VHJ1Y2tEZXRhaWxzKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKG1hcHMsICd2aWV3Y2hhbmdlJywgbWFwVmlld0NoYW5nZWQpO1xyXG5cclxuICAgICAgLy8gdGhpcy5DaGFuZ2VUcnVja0RpcmVjdGlvbih0aGlzLCBOZXdQaW4sIGRlc3RMb2MsIHRydWNrVXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYXBWaWV3Q2hhbmdlZChlKSB7XHJcbiAgICAgIHRoYXQubGFzdFpvb21MZXZlbCA9IG1hcHMuZ2V0Wm9vbSgpO1xyXG4gICAgICB0aGF0Lmxhc3RMb2NhdGlvbiA9IG1hcHMuZ2V0Q2VudGVyKCk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBtb3VzZXdoZWVsQ2hhbmdlZChlKSB7XHJcbiAgICAgIHRoYXQubGFzdFpvb21MZXZlbCA9IG1hcHMuZ2V0Wm9vbSgpO1xyXG4gICAgICB0aGF0Lmxhc3RMb2NhdGlvbiA9IG1hcHMuZ2V0Q2VudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0SW5mb0JveEhUTUwoZGF0YTogYW55LCB0VmFsdWUsIGpvYklkKTogU3RyaW5nIHtcclxuXHJcbiAgICAgIGlmICghZGF0YS5TcGVlZCkge1xyXG4gICAgICAgIGRhdGEuU3BlZWQgPSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY2xhc3NOYW1lID0gXCJcIjtcclxuICAgICAgdmFyIHN0eWxlTGVmdCA9IFwiXCI7XHJcbiAgICAgIHZhciByZWFzb24gPSAnJztcclxuICAgICAgaWYgKGRhdGEudHJ1Y2tTdGF0dXMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEudHJ1Y2tTdGF0dXMudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAncmVkJykge1xyXG4gICAgICAgICAgcmVhc29uID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tdG9wOjNweDtjb2xvcjpyZWQ7Jz5SZWFzb246IEN1bXVsYXRpdmUgaWRsZSB0aW1lIGlzIGJleW9uZCBcIiArIHRWYWx1ZSArIFwiIG1pbnM8L2Rpdj5cIjtcclxuICAgICAgICB9IGVsc2UgaWYgKGRhdGEudHJ1Y2tTdGF0dXMudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAncHVycGxlJykge1xyXG4gICAgICAgICAgcmVhc29uID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tdG9wOjNweDtjb2xvcjpwdXJwbGU7Jz5SZWFzb246IFRydWNrIGlzIGRyaXZlbiBncmVhdGVyIHRoYW4gNzUgbS9oPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgaW5mb2JveERhdGEgPSAnJztcclxuXHJcbiAgICAgIGRhdGEuY3VzdG9tZXJOYW1lID0gZGF0YS5jdXN0b21lck5hbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEuY3VzdG9tZXJOYW1lID09IG51bGwgPyAnJyA6IGRhdGEuY3VzdG9tZXJOYW1lO1xyXG5cclxuICAgICAgZGF0YS5kaXNwYXRjaFRpbWUgPSBkYXRhLmRpc3BhdGNoVGltZSA9PSB1bmRlZmluZWQgfHwgZGF0YS5kaXNwYXRjaFRpbWUgPT0gbnVsbCA/ICcnIDogZGF0YS5kaXNwYXRjaFRpbWU7XHJcblxyXG4gICAgICBkYXRhLmpvYklkID0gZGF0YS5qb2JJZCA9PSB1bmRlZmluZWQgfHwgZGF0YS5qb2JJZCA9PSBudWxsID8gJycgOiBkYXRhLmpvYklkO1xyXG5cclxuICAgICAgZGF0YS53b3JrQWRkcmVzcyA9IGRhdGEud29ya0FkZHJlc3MgPT0gdW5kZWZpbmVkIHx8IGRhdGEud29ya0FkZHJlc3MgPT0gbnVsbCA/ICcnIDogZGF0YS53b3JrQWRkcmVzcztcclxuXHJcbiAgICAgIGRhdGEuc2JjVmluID0gZGF0YS5zYmNWaW4gPT0gdW5kZWZpbmVkIHx8IGRhdGEuc2JjVmluID09IG51bGwgfHwgZGF0YS5zYmNWaW4gPT0gJycgPyAnJyA6IGRhdGEuc2JjVmluO1xyXG5cclxuICAgICAgZGF0YS50ZWNobmljaWFuTmFtZSA9IGRhdGEudGVjaG5pY2lhbk5hbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEudGVjaG5pY2lhbk5hbWUgPT0gbnVsbCB8fCBkYXRhLnRlY2huaWNpYW5OYW1lID09ICcnID8gJycgOiBkYXRhLnRlY2huaWNpYW5OYW1lO1xyXG5cclxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgMTAyNCkge1xyXG4gICAgICAgIGluZm9ib3hEYXRhID0gXCI8ZGl2IGNsYXNzPSdwb3BNb2RhbENvbnRhaW5lcic+PGRpdiBjbGFzcz0ncG9wTW9kYWxIZWFkZXInPjxpbWcgc3JjPSdcIiArIGRhdGEuaWNvbkluZm8gKyBcIicgPjxhIGNsYXNzPSdkZXRhaWxzJyB0aXRsZT0nQ2xpY2sgaGVyZSB0byBzZWUgdGVjaG5pY2lhbiBkZXRhaWxzJyA+VmlldyBEZXRhaWxzPC9hPjxpIGNsYXNzPSdmYSBmYS10aW1lcycgYXJpYS1oaWRkZW49J3RydWUnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPjwvaT48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxoci8+PGRpdiBjbGFzcz0ncG9wTW9kYWxCb2R5Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPlZlaGljbGUgTnVtYmVyIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuc2JjVmluICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPlZUUyBVbml0IElEIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEudHJ1Y2tJZCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5Kb2IgVHlwZSA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmpvYlR5cGUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Sm9iIElkIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGpvYklkICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkFUVFVJRCA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLkFUVFVJRCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5UZWNobmljaWFuIE5hbWUgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS50ZWNobmljaWFuTmFtZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5DdXN0b21lciBOYW1lIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuY3VzdG9tZXJOYW1lICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkRpc3BhdGNoIFRpbWU6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmRpc3BhdGNoVGltZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTEyJz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbC0xMiBjb2wtc20tMTIgY29sLWZvcm0tbGFiZWwnPkpvYiBBZGRyZXNzIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtc20tMTInPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCBjb2wtZm9ybS1sYWJlbC1mdWxsJz5cIiArIGRhdGEud29ya0FkZHJlc3MgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IG1ldGVyQ2FsJz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtbWQtNCc+PHN0cm9uZz5cIiArIGRhdGEuU3BlZWQgKyBcIjwvc3Ryb25nPiBtcGggPHNwYW4gY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+U3BlZWQ8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyBkYXRhLkVUQSArIFwiPC9zdHJvbmc+IE1pbnMgPHNwYW4gY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+Q3VtdWxhdGl2ZSBJZGxlIE1pbnV0ZXM8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyB0aGF0LmNvbnZlcnRNaWxlc1RvRmVldChkYXRhLkRpc3RhbmNlKSArIFwiPC9zdHJvbmc+IEZ0IDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkZlZXQgdG8gSm9iIFNpdGU8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PiA8aHIvPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncG9wTW9kYWxGb290ZXInPjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wgY29sLW1kLTQnPjxpIGNsYXNzPSdmYSBmYS1jb21tZW50aW5nJz48L2k+PHNwYW4gY2xhc3M9J3NtcycgdGl0bGU9J0NsaWNrIHRvIHNlbmQgU01TJyA+U01TPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtZW52ZWxvcGUnIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PHNwYW4gY2xhc3M9J2VtYWlsJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBlbWFpbCcgPkVtYWlsPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtZXllJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxzcGFuIGNsYXNzPSd3YXRjaGxpc3QnIHRpdGxlPSdDbGljayB0byBhZGQgaW4gd2F0Y2hsaXN0JyA+V2F0Y2g8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj4gPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIjtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5mb2JveERhdGEgPSBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J3BhZGRpbmctdG9wOjEwcHg7bWFyZ2luOiAwcHg7Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC0zJz48ZGl2IHN0eWxlPSdwYWRkaW5nLXRvcDoxNXB4OycgPjxpbWcgc3JjPSdcIiArIGRhdGEuaWNvbkluZm8gKyBcIicgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrO21hcmdpbjogMCBhdXRvOycgPjwvZGl2PjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTknPlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncm93ICc+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtOCcgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5WZWhpY2xlIE51bWJlcjwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLnNiY1ZpbiArIFwiPC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PGEgY2xhc3M9J2RldGFpbHMnIHN0eWxlPSdjb2xvcjojMDA5RkRCO2N1cnNvcjogcG9pbnRlcjsnICB0aXRsZT0nQ2xpY2sgaGVyZSB0byBzZWUgdGVjaG5pY2lhbiBkZXRhaWxzJyA+VmlldyBEZXRhaWxzPC9hPjxpIGNsYXNzPSdmYSBmYS10aW1lcycgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4O2N1cnNvcjogcG9pbnRlcjsnIGFyaWEtaGlkZGVuPSd0cnVlJyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz48L2k+PC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8L2Rpdj5cIiArXHJcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J3Jvdyc+PGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPlZUUyBVbml0IElEPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEudHJ1Y2tJZCArIFwiPC9kaXY+PC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnPjxkaXYgY2xhc3M9J2NvbC1tZC01JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkpvYiBUeXBlPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuam9iVHlwZSArIFwiPC9kaXY+PGRpdiBjbGFzcz0nY29sLW1kLTcnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOycgPkpvYiBJZDwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBqb2JJZCArIFwiPC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgcmVhc29uICsgXCI8L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+QVRUVUlEPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuQVRUVUlEICsgXCI8c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDttYXJnaW4tbGVmdDo4cHg7Jz5UZWNobmljaWFuIE5hbWU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS50ZWNobmljaWFuTmFtZSArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnID5cIlxyXG4gICAgICAgICAgKyBcIjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5DdXN0b21lciBOYW1lPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuY3VzdG9tZXJOYW1lICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7JyA+XCJcclxuICAgICAgICAgICsgXCI8ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+RGlzcGF0Y2ggVGltZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmRpc3BhdGNoVGltZSArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4OycgPlwiXHJcbiAgICAgICAgICArIFwiPGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkpvYiBBZGRyZXNzPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEud29ya0FkZHJlc3MgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8aHIgc3R5bGU9J21hcmdpbi10b3A6MXB4OyBtYXJnaW4tYm90dG9tOjVweDsnIC8+XCJcclxuXHJcbiAgICAgICAgICArIFwiPGRpdiBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHg7Jz4gPGRpdiBjbGFzcz0ncm93Jz4gPGRpdiBjbGFzcz0nc3BlZWQgY29sLW1kLTMnPiA8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tbGVmdDogMXB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIGRhdGEuU3BlZWQgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5tcGg8L3A+PC9kaXY+PHAgc3R5bGU9J21hcmdpbjowcHgnIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPlNwZWVkPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naWRsZSBjb2wtbWQtNSc+PGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHgnPjxwIHN0eWxlPSdmb250LXdlaWdodDogYm9sZGVyO2ZvbnQtc2l6ZTogMjNweDttYXJnaW46IDBweDsnPlwiICsgZGF0YS5FVEEgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5NaW5zPC9wPjwvZGl2PjxwIHN0eWxlPSdtYXJnaW46MHB4JyBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5DdW11bGF0aXZlIElkbGUgTWludXRlczwvcD48L2Rpdj4gPGRpdiBjbGFzcz0nbWlsZXMgY29sLW1kLTQnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHgnPjxwIHN0eWxlPSdmb250LXdlaWdodDogYm9sZGVyO2ZvbnQtc2l6ZTogMjNweDttYXJnaW46IDBweDsnPlwiICsgdGhhdC5jb252ZXJ0TWlsZXNUb0ZlZXQoZGF0YS5EaXN0YW5jZSkgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5GdDwvcD48L2Rpdj48cCBzdHlsZT0nbWFyZ2luOjBweCcgY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+RmVldCB0byBKb2IgU2l0ZTwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PjwvZGl2PjxociBzdHlsZT0nbWFyZ2luLXRvcDoxcHg7IG1hcmdpbi1ib3R0b206NXB4OycgLz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+IDxkaXYgY2xhc3M9J2NvbC1tZC0xJz48L2Rpdj48ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnIHN0eWxlPSdcIiArIGNsYXNzTmFtZSArIFwiJz4gPGkgY2xhc3M9J2ZhIGZhLWNvbW1lbnRpbmcgY29sLW1kLTInPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgc21zJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBTTVMnID5TTVM8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMgb2Zmc2V0LW1kLTEnIHN0eWxlPSdcIiArIGNsYXNzTmFtZSArIFwiJz4gPGkgY2xhc3M9J2ZhIGZhLWVudmVsb3BlIGNvbC1tZC0yJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxwIGNsYXNzPSdjb2wtbWQtNiBlbWFpbCcgdGl0bGU9J0NsaWNrIHRvIHNlbmQgZW1haWwnID5FbWFpbDwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3JvdyBjb2wtbWQtMyc+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnIHN0eWxlPSdcIiArIHN0eWxlTGVmdCArIFwiJz48aSBjbGFzcz0nZmEgZmEtZXllIGNvbC1tZC0yJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxwIGNsYXNzPSdjb2wtbWQtNiB3YXRjaGxpc3QnIHRpdGxlPSdDbGljayB0byBhZGQgaW4gd2F0Y2hsaXN0JyA+V2F0Y2g8L3A+PC9kaXY+IDwvZGl2PlwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaW5mb2JveERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmlld1RydWNrRGV0YWlscyhlKSB7XHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2ZhIGZhLXRpbWVzJykge1xyXG4gICAgICAgIHRoYXQuaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgICAgIHZpc2libGU6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnZGV0YWlscycpIHtcclxuICAgICAgICAvL3RoYXQucm91dGVyLm5hdmlnYXRlKFsnL3RlY2huaWNpYW4tZGV0YWlscyddKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnY29sLW1kLTYgc21zJykge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XHJcbiAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoYXQubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGF0LnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXHJcbiAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbFNNUycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2NvbC1tZC02IGVtYWlsJykge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XHJcbiAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoYXQubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGF0LnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXHJcbiAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbEVtYWlsJykubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgfVxyXG4gICAgIFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZERpcmVjdGlvbnModGhhdCwgc3RhcnRMb2MsIGVuZExvYywgaW5kZXgsIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpIHtcclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5EaXJlY3Rpb25zTWFuYWdlcih0aGF0Lm1hcCk7XHJcbiAgICAgIC8vIFNldCBSb3V0ZSBNb2RlIHRvIGRyaXZpbmdcclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5zZXRSZXF1ZXN0T3B0aW9ucyh7XHJcbiAgICAgICAgcm91dGVNb2RlOiBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLlJvdXRlTW9kZS5kcml2aW5nXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLnNldFJlbmRlck9wdGlvbnMoe1xyXG4gICAgICAgIGRyaXZpbmdQb2x5bGluZU9wdGlvbnM6IHtcclxuICAgICAgICAgIHN0cm9rZUNvbG9yOiAnZ3JlZW4nLFxyXG4gICAgICAgICAgc3Ryb2tlVGhpY2tuZXNzOiAzLFxyXG4gICAgICAgICAgdmlzaWJsZTogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UgfSxcclxuICAgICAgICB2aWFwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IGZhbHNlIH0sXHJcbiAgICAgICAgYXV0b1VwZGF0ZU1hcFZpZXc6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3Qgd2F5cG9pbnQxID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuV2F5cG9pbnQoe1xyXG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oc3RhcnRMb2MubGF0aXR1ZGUsIHN0YXJ0TG9jLmxvbmdpdHVkZSksIGljb246ICcnXHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCB3YXlwb2ludDIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5XYXlwb2ludCh7XHJcbiAgICAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihlbmRMb2MubGF0aXR1ZGUsIGVuZExvYy5sb25naXR1ZGUpXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50MSk7XHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuYWRkV2F5cG9pbnQod2F5cG9pbnQyKTtcclxuXHJcbiAgICAgIC8vIEFkZCBldmVudCBoYW5kbGVyIHRvIGRpcmVjdGlvbnMgbWFuYWdlci5cclxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5kaXJlY3Rpb25zTWFuYWdlciwgJ2RpcmVjdGlvbnNVcGRhdGVkJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvLyBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICB2YXIgcm91dGVJbmRleCA9IGUucm91dGVbMF0ucm91dGVMZWdzWzBdLm9yaWdpbmFsUm91dGVJbmRleDtcclxuICAgICAgICB2YXIgbmV4dEluZGV4ID0gcm91dGVJbmRleDtcclxuICAgICAgICBpZiAoZS5yb3V0ZVswXS5yb3V0ZVBhdGgubGVuZ3RoID4gcm91dGVJbmRleCkge1xyXG4gICAgICAgICAgbmV4dEluZGV4ID0gcm91dGVJbmRleCArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBuZXh0TG9jYXRpb24gPSBlLnJvdXRlWzBdLnJvdXRlUGF0aFtuZXh0SW5kZXhdO1xyXG4gICAgICAgIHZhciBwaW4gPSB0aGF0Lm1hcC5lbnRpdGllcy5nZXQoaW5kZXgpO1xyXG4gICAgICAgIC8vIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHN0YXJ0TG9jLG5leHRMb2NhdGlvbik7XHJcbiAgICAgICAgdGhhdC5Nb3ZlUGluT25EaXJlY3Rpb24odGhhdCwgZS5yb3V0ZVswXS5yb3V0ZVBhdGgsIHBpbiwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5jYWxjdWxhdGVEaXJlY3Rpb25zKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIE1vdmVQaW5PbkRpcmVjdGlvbih0aGF0LCByb3V0ZVBhdGgsIHBpbiwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCkge1xyXG4gICAgdGhhdCA9IHRoaXM7XHJcbiAgICB2YXIgaXNHZW9kZXNpYyA9IGZhbHNlO1xyXG4gICAgdGhhdC5jdXJyZW50QW5pbWF0aW9uID0gbmV3IEJpbmcuTWFwcy5BbmltYXRpb25zLlBhdGhBbmltYXRpb24ocm91dGVQYXRoLCBmdW5jdGlvbiAoY29vcmQsIGlkeCwgZnJhbWVJZHgsIHJvdGF0aW9uQW5nbGUsIGxvY2F0aW9ucywgdHJ1Y2tJZFJhbklkKSB7XHJcblxyXG4gICAgICBpZiAodGhhdC5hbmltYXRpb25UcnVja0xpc3QubGVuZ3RoID4gMCAmJiB0aGF0LmFuaW1hdGlvblRydWNrTGlzdC5zb21lKHggPT4geCA9PSB0cnVja0lkUmFuSWQpKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gKGZyYW1lSWR4ID09IGxvY2F0aW9ucy5sZW5ndGggLSAxKSA/IGZyYW1lSWR4IDogZnJhbWVJZHggKyAxO1xyXG4gICAgICAgIHZhciByb3RhdGlvbkFuZ2xlID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKGNvb3JkLCBsb2NhdGlvbnNbaW5kZXhdKTtcclxuICAgICAgICBpZiAodGhhdC5pc09kZChmcmFtZUlkeCkpIHtcclxuICAgICAgICAgIHRoYXQuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwaW4sIHRydWNrVXJsLCByb3RhdGlvbkFuZ2xlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZnJhbWVJZHggPT0gbG9jYXRpb25zLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIHRoYXQuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwaW4sIHRydWNrVXJsLCByb3RhdGlvbkFuZ2xlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGluLnNldExvY2F0aW9uKGNvb3JkKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0sIGlzR2VvZGVzaWMsIHRoYXQudHJhdmFsRHVyYXRpb24sIHRydWNrSWRSYW5JZCk7XHJcblxyXG4gICAgdGhhdC5jdXJyZW50QW5pbWF0aW9uLnBsYXkoKTtcclxuICB9XHJcblxyXG4gIENhbGN1bGF0ZU5leHRDb29yZChzdGFydExvY2F0aW9uLCBlbmRMb2NhdGlvbikge1xyXG4gICAgdHJ5IHtcclxuXHJcbiAgICAgIHZhciBkbGF0ID0gKGVuZExvY2F0aW9uLmxhdGl0dWRlIC0gc3RhcnRMb2NhdGlvbi5sYXRpdHVkZSk7XHJcbiAgICAgIHZhciBkbG9uID0gKGVuZExvY2F0aW9uLmxvbmdpdHVkZSAtIHN0YXJ0TG9jYXRpb24ubG9uZ2l0dWRlKTtcclxuICAgICAgdmFyIGFscGhhID0gTWF0aC5hdGFuMihkbGF0ICogTWF0aC5QSSAvIDE4MCwgZGxvbiAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICB2YXIgZHggPSAwLjAwMDE1MjM4Nzk0NzI3OTA5OTMxO1xyXG4gICAgICBkbGF0ID0gZHggKiBNYXRoLnNpbihhbHBoYSk7XHJcbiAgICAgIGRsb24gPSBkeCAqIE1hdGguY29zKGFscGhhKTtcclxuICAgICAgdmFyIG5leHRDb29yZCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihzdGFydExvY2F0aW9uLmxhdGl0dWRlICsgZGxhdCwgc3RhcnRMb2NhdGlvbi5sb25naXR1ZGUgKyBkbG9uKTtcclxuXHJcbiAgICAgIGRsYXQgPSBudWxsO1xyXG4gICAgICBkbG9uID0gbnVsbDtcclxuICAgICAgYWxwaGEgPSBudWxsO1xyXG4gICAgICBkeCA9IG51bGw7XHJcblxyXG4gICAgICByZXR1cm4gbmV4dENvb3JkO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIENhbGN1bGF0ZU5leHRDb29yZCAtICcgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc09kZChudW0pIHtcclxuICAgIHJldHVybiBudW0gJSAyO1xyXG4gIH1cclxuXHJcbiAgZGVnVG9SYWQoeCkge1xyXG4gICAgcmV0dXJuIHggKiBNYXRoLlBJIC8gMTgwO1xyXG4gIH1cclxuXHJcbiAgcmFkVG9EZWcoeCkge1xyXG4gICAgcmV0dXJuIHggKiAxODAgLyBNYXRoLlBJO1xyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlQmVhcmluZyhvcmlnaW4sIGRlc3QpIHtcclxuICAgIC8vLyA8c3VtbWFyeT5DYWxjdWxhdGVzIHRoZSBiZWFyaW5nIGJldHdlZW4gdHdvIGxvYWNhdGlvbnMuPC9zdW1tYXJ5PlxyXG4gICAgLy8vIDxwYXJhbSBuYW1lPVwib3JpZ2luXCIgdHlwZT1cIk1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uXCI+SW5pdGlhbCBsb2NhdGlvbi48L3BhcmFtPlxyXG4gICAgLy8vIDxwYXJhbSBuYW1lPVwiZGVzdFwiIHR5cGU9XCJNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvblwiPlNlY29uZCBsb2NhdGlvbi48L3BhcmFtPlxyXG4gICAgdHJ5IHtcclxuICAgICAgdmFyIGxhdDEgPSB0aGlzLmRlZ1RvUmFkKG9yaWdpbi5sYXRpdHVkZSk7XHJcbiAgICAgIHZhciBsb24xID0gb3JpZ2luLmxvbmdpdHVkZTtcclxuICAgICAgdmFyIGxhdDIgPSB0aGlzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpO1xyXG4gICAgICB2YXIgbG9uMiA9IGRlc3QubG9uZ2l0dWRlO1xyXG4gICAgICB2YXIgZExvbiA9IHRoaXMuZGVnVG9SYWQobG9uMiAtIGxvbjEpO1xyXG4gICAgICB2YXIgeSA9IE1hdGguc2luKGRMb24pICogTWF0aC5jb3MobGF0Mik7XHJcbiAgICAgIHZhciB4ID0gTWF0aC5jb3MobGF0MSkgKiBNYXRoLnNpbihsYXQyKSAtIE1hdGguc2luKGxhdDEpICogTWF0aC5jb3MobGF0MikgKiBNYXRoLmNvcyhkTG9uKTtcclxuXHJcbiAgICAgIGxhdDEgPSBsYXQyID0gbG9uMSA9IGxvbjIgPSBkTG9uID0gbnVsbDtcclxuXHJcbiAgICAgIHJldHVybiAodGhpcy5yYWRUb0RlZyhNYXRoLmF0YW4yKHksIHgpKSArIDM2MCkgJSAzNjA7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZygnRXJyb3IgaW4gY2FsY3VsYXRlQmVhcmluZyAtICcgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBTZW5kU01TKGZvcm0pIHtcclxuICAgIC8vIGlmKHRoaXMudGVjaG5pY2lhblBob25lICE9ICcnKXtcclxuICAgIGlmIChmb3JtLnZhbHVlLm1vYmlsZU5vICE9ICcnKSB7XHJcbiAgICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgd2FudCB0byBzZW5kIFNNUz8nKSkge1xyXG4gICAgICAgIC8vIHRoaXMubWFwU2VydmljZS5zZW5kU01TKHRoaXMudGVjaG5pY2lhblBob25lLGZvcm0udmFsdWUuc21zTWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnNlbmRTTVMoZm9ybS52YWx1ZS5tb2JpbGVObywgZm9ybS52YWx1ZS5zbXNNZXNzYWdlKTtcclxuXHJcbiAgICAgICAgZm9ybS5jb250cm9scy5zbXNNZXNzYWdlLnJlc2V0KClcclxuICAgICAgICBmb3JtLnZhbHVlLm1vYmlsZU5vID0gdGhpcy50ZWNobmljaWFuUGhvbmU7XHJcbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbFNNUycpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgLy90aGlzLnRvYXN0ci5zdWNjZXNzKCdTTVMgc2VudCBzdWNjZXNzZnVsbHknLCAnU3VjY2VzcycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgU2VuZEVtYWlsKGZvcm0pIHtcclxuICAgIC8vIGlmKHRoaXMudGVjaG5pY2lhbkVtYWlsICE9ICcnKXtcclxuICAgIGlmIChmb3JtLnZhbHVlLmVtYWlsSWQgIT0gJycpIHtcclxuICAgICAgaWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZSB3YW50IHRvIHNlbmQgRW1haWw/JykpIHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy51c2VyUHJvZmlsZVNlcnZpY2UuZ2V0VXNlckRhdGEodGhpcy5jb29raWVBVFRVSUQpXHJcbiAgICAgICAgLy8gICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgLy8gICAgIHZhciBuZXdEYXRhOiBhbnkgPSB0aGlzLnN0cmluZ2lmeUpzb24oZGF0YSk7XHJcbiAgICAgICAgLy8gICAgIC8vdGhpcy5tYXBTZXJ2aWNlLnNlbmRFbWFpbChuZXdEYXRhLmVtYWlsLHRoaXMudGVjaG5pY2lhbkVtYWlsLG5ld0RhdGEubGFzdE5hbWUgKyAnICcgKyBuZXdEYXRhLmZpcnN0TmFtZSwgdGhpcy50ZWNobmljaWFuTmFtZSwgZm9ybS52YWx1ZS5lbWFpbFN1YmplY3QsZm9ybS52YWx1ZS5lbWFpbE1lc3NhZ2UpO1xyXG4gICAgICAgIC8vICAgICB0aGlzLm1hcFNlcnZpY2Uuc2VuZEVtYWlsKG5ld0RhdGEuZW1haWwsIGZvcm0udmFsdWUuZW1haWxJZCwgbmV3RGF0YS5sYXN0TmFtZSArICcgJyArIG5ld0RhdGEuZmlyc3ROYW1lLCB0aGlzLnRlY2huaWNpYW5OYW1lLCBmb3JtLnZhbHVlLmVtYWlsU3ViamVjdCwgZm9ybS52YWx1ZS5lbWFpbE1lc3NhZ2UpO1xyXG4gICAgICAgIC8vICAgICB0aGlzLnRvYXN0ci5zdWNjZXNzKFwiRW1haWwgc2VudCBzdWNjZXNzZnVsbHlcIiwgJ1N1Y2Nlc3MnKTtcclxuXHJcbiAgICAgICAgLy8gICAgIGZvcm0uY29udHJvbHMuZW1haWxTdWJqZWN0LnJlc2V0KClcclxuICAgICAgICAvLyAgICAgZm9ybS5jb250cm9scy5lbWFpbE1lc3NhZ2UucmVzZXQoKVxyXG4gICAgICAgIC8vICAgICBmb3JtLnZhbHVlLmVtYWlsSWQgPSB0aGlzLnRlY2huaWNpYW5FbWFpbDtcclxuICAgICAgICAvLyAgICAgalF1ZXJ5KCcjbXlNb2RhbEVtYWlsJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAvLyAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBTZWFyY2hUcnVjayhmb3JtKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAvLyQoJyNsb2FkaW5nJykuc2hvdygpO1xyXG5cclxuICAgIGlmIChmb3JtLnZhbHVlLmlucHV0bWlsZXMgIT0gJycgJiYgZm9ybS52YWx1ZS5pbnB1dG1pbGVzICE9IG51bGwpIHtcclxuICAgICAgY29uc3QgbHQgPSB0aGF0LmNsaWNrZWRMYXQ7XHJcbiAgICAgIGNvbnN0IGxnID0gdGhhdC5jbGlja2VkTG9uZztcclxuICAgICAgY29uc3QgcmQgPSBmb3JtLnZhbHVlLmlucHV0bWlsZXM7XHJcblxyXG4gICAgICB0aGlzLmZvdW5kVHJ1Y2sgPSBmYWxzZTtcclxuICAgICAgdGhpcy5hbmltYXRpb25UcnVja0xpc3QgPSBbXTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmxvYWRNYXBWaWV3KCdyb2FkJyk7XHJcblxyXG4gICAgICB0aGF0LkxvYWRUcnVja3ModGhpcy5tYXAsIGx0LCBsZywgcmQsIHRydWUpO1xyXG5cclxuICAgICAgZm9ybS5jb250cm9scy5pbnB1dG1pbGVzLnJlc2V0KCk7XHJcbiAgICAgIGpRdWVyeSgnI215UmFkaXVzTW9kYWwnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICB9LCAxMDAwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGdldE1pbGVzKGkpIHtcclxuICAgIHJldHVybiBpICogMC4wMDA2MjEzNzExOTI7XHJcbiAgfVxyXG5cclxuICBnZXRNZXRlcnMoaSkge1xyXG4gICAgcmV0dXJuIGkgKiAxNjA5LjM0NDtcclxuICB9XHJcblxyXG4gIHN0cmluZ2lmeUpzb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gIH1cclxuICBwYXJzZVRvSnNvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcclxuICB9XHJcblxyXG4gIFJvdW5kKG51bWJlciwgcHJlY2lzaW9uKSB7XHJcbiAgICB2YXIgZmFjdG9yID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XHJcbiAgICB2YXIgdGVtcE51bWJlciA9IG51bWJlciAqIGZhY3RvcjtcclxuICAgIHZhciByb3VuZGVkVGVtcE51bWJlciA9IE1hdGgucm91bmQodGVtcE51bWJlcik7XHJcbiAgICByZXR1cm4gcm91bmRlZFRlbXBOdW1iZXIgLyBmYWN0b3I7XHJcbiAgfVxyXG5cclxuICBnZXRBdGFuMih5LCB4KSB7XHJcbiAgICByZXR1cm4gTWF0aC5hdGFuMih5LCB4KTtcclxuICB9O1xyXG5cclxuICBnZXRJY29uVXJsKGNvbG9yOiBzdHJpbmcsIHNvdXJjZUxhdDogbnVtYmVyLCBzb3VyY2VMb25nOiBudW1iZXIsIGRlc3RpbmF0aW9uTGF0OiBudW1iZXIsIGRlc3RpbmF0aW9uTG9uZzogbnVtYmVyKSB7XHJcbiAgICB2YXIgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQTNaSlJFRlVhSUh0bDExSVUyRVl4Lzl2dVZxUWF4ZUI2d3YwS3NjSUY0RzBicG9hWm5XemhWcGRWRXAxRVJybXBDaHZNZ2pySWhUNm9LQlo2RVhVQXVlTmFGSDBRVFN4eUFXVlhSUXVQMUF2c3UzTTVuSGFuaTdjbHVuWng5bG1DTDYvcTNQTzgvS2MvLzk1dndFT2g4UGhjRGdjRG9lelZHR3BTRUpFYWdCVnFjZ2xnWXN4MWh3cG1KWnNkaUpTQnlqd1ljejNjKzJ3WjhTZmJMNjViRm12VXhPUmtURldMaFdYM1FQQmF1OEVvQTkrMGs5TWlmdTJYZDJwRUVRaENhblNXUElxWVRGV0FFQVdZOHcxTnk2ckI0aW9hanJ3KzFMYXN1V3IrMzcwajQ5UGVxY3pWQmxLMTloM3RoRGlBY0RoNmdaUUFRQ1pBQkkzUUVUM0FKUmRlM1ViVmtjTEJGRllEY3hVYUVkbWJvcmt5aWN1QXlIeGxyWmEySHJzQ3l4SkhzdGlOVmpNNG9FWUJoYTdlQ0NLQVNJeVlwR0xCNkxNZ2NscC81blgzOTVNMlhyc2l2OHBTQzRSRGF4TVc3RzN2ZmRKWEVuU2xla3BFelNYTlVwVjFIalVWV2pBUFJUekI0TG9oVTZUalJLOUthNzJjaW5PTVlVZW5WTHhwSThTdGg0N1N2VW1OSm92SjVzcUd0V01NYmRVSUdrRGdpaWc4SllaaHF6VWIyYWxlak5LOUNZZ1F2V0JKQXpvTkZwOEd1a052enY2dWhOTk5TOVhDRU1jTzd3c0F5cWxDZzJtZWhScEM4TGZHcDdmUU1PTG0zTFNoRG0yL1FocThpcWhDaTRDRGxjM0xQWmFXWE5KbG9HbVE5ZXhTYjBSeHgrY2drY1VvTk5vVVdPc3dKcFZLbHpva0RjSGpodU9vcTdvSEpxNld0RDU1UmtBb01aWUNWdDVNM2JmMm85NEQ0Y1JEWWpUNHFoT284MElEWTBpN1M0WU1uTmhhTndWcnBDanJ4dUQ3aUZZRDE2SDFkRWlxM0lXWXdVZU9kditNVjdjZHdSZDFjOVF1dFVNcTZNWk9ldDBVd0FVa0RpRnhqU2dURlBlUHB0ZlZldVo4Q2dHM0VNbzNKeVBMdGZiZVNJN2U1OENBQXF6Q3lUSHNSUTZqUllxWlRwc3p2azd2TTFweCs3c2ZCQVJDalliRlFCZVN0MERZaHBnak5VUmticlJmRGw4VlJ6eGp2b0JySmpkVGhYY2FDN3VPUitYK05sSWJWS2IxQnRtZW5wbUFyOEVZSnJYYUxiT2VINUVSSHJNWENqc2RaMVhZSFg4dmFJMm1PcFJ1dFVNQUdZQWttdTFGT09UdmdPRDdzRVQrKzhlWGg0YTd6cU5GbzlQdG9hRlIxcjdFNGFJeW9pSVBnNzMwcDAzemRUL2M1Q0NsQ1dRU3kySTNxL0NoQkI0K0w2Vk9qNC9KU0tpUUNEZ0NSWnNZU0Fpb3pnMTJmN2oxNWpUNTUrNEh6eTFKcHBMVFVTblBhTDNuYy92NnlLaXV1Q2RtOFBoY0RpY3BjRWZrM2VBTGJjMStWUUFBQUFBU1VWT1JLNUNZSUk9XCI7XHJcblxyXG4gICAgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJncmVlblwiKSB7XHJcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEzWkpSRUZVYUlIdGwxMUlVMkVZeC85dnVWcVFheGVCNnd2MEtzY0lGNEcwYnBvYVpuV3poVnBkVkVwMUVScm1wQ2h2TWdqckloVDZvS0JaNkVYVUF1ZU5hRkgwUVRTeHlBV1ZYUlF1UDFBdnN1M001bkhhbmk3Y2x1blp4OWxtQ0w2L3EzUE84L0tjLy85NXZ3RU9oOFBoY0RnY0RvZXpWR0dwU0VKRWFnQlZxY2dsZ1lzeDFod3BtSlpzZGlKU0J5andZY3ozYysyd1o4U2ZiTDY1YkZtdlV4T1JrVEZXTGhXWDNRUEJhdThFb0E5KzBrOU1pZnUyWGQycEVFUWhDYW5TV1BJcVlURldBRUFXWTh3MU55NnJCNGlvYWpydysxTGFzdVdyKzM3MGo0OVBlcWN6VkJsSzE5aDN0aERpQWNEaDZnWlFBUUNaQUJJM1FFVDNBSlJkZTNVYlZrY0xCRkZZRGN4VWFFZG1ib3JreWljdUF5SHhsclphMkhyc0N5eEpIc3RpTlZqTTRvRVlCaGE3ZUNDS0FTSXlZcEdMQjZMTWdjbHAvNW5YMzk1TTJYcnNpdjhwU0M0UkRheE1XN0czdmZkSlhFblNsZWtwRXpTWE5VcFYxSGpVVldqQVBSVHpCNExvaFU2VGpSSzlLYTcyY2luT01ZVWVuVkx4cEk4U3RoNDdTdlVtTkpvdko1c3FHdFdNTWJkVUlHa0RnaWlnOEpZWmhxelViMmFsZWpOSzlDWWdRdldCSkF6b05GcDhHdWtOdnp2NnVoTk5OUzlYQ0VNY083d3NBeXFsQ2cybWVoUnBDOExmR3A3ZlFNT0xtM0xTaERtMi9RaHE4aXFoQ2k0Q0RsYzNMUFphV1hOSmxvR21ROWV4U2IwUnh4K2Nna2NVb05Ob1VXT3N3SnBWS2x6b2tEY0hqaHVPb3E3b0hKcTZXdEQ1NVJrQW9NWllDVnQ1TTNiZjJvOTRENGNSRFlqVDRxaE9vODBJRFkwaTdTNFlNbk5oYU53VnJwQ2pyeHVEN2lGWUQxNkgxZEVpcTNJV1l3VWVPZHYrTVY3Y2R3UmQxYzlRdXRVTXE2TVpPZXQwVXdBVWtEaUZ4alNnVEZQZVBwdGZWZXVaOENnRzNFTW8zSnlQTHRmYmVTSTdlNThDQUFxekN5VEhzUlE2alJZcVpUcHN6dms3dk0xcHgrN3NmQkFSQ2pZYkZRQmVTdDBEWWhwZ2pOVVJrYnJSZkRsOFZSenhqdm9CckpqZFRoWGNhQzd1T1IrWCtObEliVktiMUJ0bWVucG1BcjhFWUpyWGFMYk9lSDVFUkhyTVhDanNkWjFYWUhYOHZhSTJtT3BSdXRVTUFHWUFrbXUxRk9PVHZnT0Q3c0VUKys4ZVhoNGE3enFORm85UHRvYUZSMXI3RTRhSXlvaUlQZzczMHAwM3pkVC9jNUNDbENXUVN5MkkzcS9DaEJCNCtMNlZPajQvSlNLaVFDRGdDUlpzWVNBaW96ZzEyZjdqMTVqVDU1KzRIenkxSnBwTFRVU25QYUwzbmMvdjZ5S2l1dUNkbThQaGNEaWNwY0VmazNlQUxiYzErVlFBQUFBQVNVVk9SSzVDWUlJPVwiO1xyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwicmVkXCIpIHtcclxuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQTB4SlJFRlVhSUh0bHoxc0VtRWN4cDlYaEJRRGhSQS9NQ1NOVFV5OHRFc1hYRXNnY2RBQnFvT1RwQTR1a0tBT3hzWXVEa0owcmRIbzFKUW1iZ1ljWFB4S25EVGdVQWR0bXpTeElVQ0tSQ3dlb1FWNjkzZUF1Mmg3QlE1YTA4VDNOeDMzUDU1N252ZnIzaGZnY0RnY0RvZkQ0WEE0L3l0c0wwU0l5QTdnK2w1b2FiREtHSnZiclhpNFgzVWlza09XUDIvOS9IbTBYaWpVKzlYYnpwR1JFVHNSZVJoalY3WHF1bnVnMWRyakFNWmF0OGJremMwTFh6d2VveVNLZlZqVnhoa093eGtLQWNBd1kyeDFlMTFYRHhEUmRaS2tlOHhnc05ReW1ZcFVxV3laamg4ZnFHVXliRC9NQTBBbG5WWXVUd0hvUFFBUnpRS1lMRHg5aW1JOERra1VMVUN6aFN4dTkxNTQ3WW11QWlqbU05UFRLQ1dUKzJ4Skg0YzZQWENRelFNZEFoeDA4MENiQUVUa3dRRTNEN1NaQTFTdjN4SS9mR2lVa2tuanZ6U2tsMTBETUpQcC9QcXJWMTJKR0t6V1BUT2tWN3Z0S2xUUDV6dStRQkpGbUFVQkRyKy9xK2YxNHZEN2xjc0ZyWHJmVzRsU0lnRkhJSUNoV0t4ZnFYYmNaSXl0YXhYNkRpQ0pJcFl2WG9UbDdObCtwWGJnQ0FTVUh0QnNmYUNQQUdaQndNYlNrdnE3a2tyMUtyVkRTNkdiTDd5dUFBYXJGVVBSS0d3K24zcHY3ZEVqckQxK3JFZEc1ZGlWSzNDR3crcEVyYVRUeUV4UG81N0xkYTJoSzhEd3c0Y3d1Vno0Rm9tb2s5Y1pDc0V3T0lqYy9mdjZ6QWVEY04yK2plTDhQTXJ2M2dFQW5LRVFUcy9PWXZuU0pYUzdPZHcxZ0x5NVdUQUx3Z2xsYU5oOFBsamNibnc5ZDA1dG9Vb3FoWG91aCtHWkdSVG41M1cxbkRNVVF1bkZpNytDcjZSU0dIbjlHbzZKQ1JUamNSd1pIVzBBTUVKakY5b3h3S0dCZ1Njbkk1RTdVcmxzck9menNIbTlxS1RUTzB5VzM3NXRCdlI2TmNleEZtWkJnTUZxMWZ6Q2w1SkoyTHhlZ0FpRDQrTkdBTysxemdFZEF6REc3aEtSZlNnV1U0K0tqZWFKeS9UbmM4cjRkVTFOZFdWZTY3OS9Zbks1WUhHN2xRbjhIa0NnblVaWEp6SWlHa1B6UUpISVBYaUFZanl1MW9haVVUZ0NBUUNZQUtDNVZtc2hWNnVYYTluc3RaVmcwS0NNZDdNZzRNeno1NnJ4M2RiK25pR2lTU0tpNnVJaWZaK2JvMW8yU3kwbWU5Q3lTNks0c3ZYcmwvd2prYUQxTjIrYVNySmNialhZL2tCRUhybFdlOWtvbFJha2pZMW5yVjFycjFwMklyb2hpZUtucldyMUl4SGRiWjI1T1J3T2g4UDVQL2dOcWh4LzZyc3VqamdBQUFBQVNVVk9SSzVDWUlJPVwiO1xyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwieWVsbG93XCIpIHtcclxuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQXloSlJFRlVhSUh0bHoxTVUxRVlodC92WWhXTmFadGdoQUdObUlDSlZtRndNQ0ZSSEV3RUU4VkpuTVJCblJRZHlnQU9EcnJvWUNJTHVCZ1dZZFBFeUdSaXhCUWNIQ0QrREtoQVdpTTQxSGdKbEovYm50ZWh0L1dudHorM0JVUENlYWJlKzUyOGZiL3ZuSHZPZHdDTlJxUFJhRFFhalVhelVaSFZFQ0hwQjlDeEdsb09USXRJZjdiZ3BsTFZTZnBCTlE3cnh3NHNmbHNwVlM4RDN5RS95U1lSdWVnVWRqMERkcldQQVdpd1h6VWdzWGdxOGVLZ0I1WlpnbE5ucEs0VFJsMFFBR3BFWlByZnVLc1pJTmtCeG05RE5tMUhiSEllMW53YzVWWGxYSmlVdFRBUEFJaUdBQVFCWUErQTRoTWcrUWhBdS9wMEg1enFBeXh6TzVDc2tGUTBycEpiOXhTVVFNbzh4NitCa1lFMXR1UU9JOStBUDgycmRXWWV5SlBBZWpjUDVFaUFaQlBXdVhrZzF6ZVFXQTR5T215cHlJRG5QL3B4VGZZRXlyYTBZT1paWVNvZTd5clpjZEwyNVF6bjNJVVlDK2ZWbDdnSjhRWWd1OXFBQXNhN1JhclBwWDZPT2NWTGJpVlVaQkJHOVhrWTlUMmxTdVhpaG9qOGRBcVVuQUFzRTJxNGFVME9NNmx1Uzg1c2x1b0RKU1FnM2dBNDl6Nzl6R2lvV0trTXJUUVZqWG1iTlhjSmVId3c2aDlBcWxyU3J6aHhGMnJpbml1WkZFYk5aVWhkWi9wRFpUUUVqbDhyNk50TDRTb0I0M0EvWk50dXFMY1hBTXVFK0FLUTJrNkl4dzkrNkhabmZ1OFZ5UDdiVUZNUGdka2hBSGJuZWVRcEVxK1BvOURtTVB0Sm5GajZMcjVBK2xHcVdpQVZqVkNqcmVEc0VCZ05RVTMyUVkxZlRWWnkyMjVYQ1VodEVJd01naCs2azVXUGhxQkd6d0FDR01sMUQvRTNXUGJ3akM0MFJZNXpvTHhYOW5WMWlXVjZFQXRES3B2QjZFakc5REpWdmNxVGdOTTZkakx2RFFBZUgvaDFNQ09tSW9PUXltWVlKR1RuQ1ErQVYwNzNnTHdKaU1ndGtuNmp2dWYzVlhGcFpnWEE1cjhHMnV0WER0eHhmenR5T0tSazY2N2tqcGJjMVY0QmFNMGxVZEIva214QThrTHhoQjl2UWszMnBXTkdmVTlxcXpzTHdIR3ZkaVF4ZjQ2eDhDVTFjcm9zdGQ3Rkc0Qng5R1hhZUxhOXYyaEl0cE9rTXQ4eDhhV1hYQWpUcHIwSUxUOVg1ajdUTXBVS0QxRE5QTGVsbEdrWGJHMGcyY1Q0MG5NdVI4Y1lqejIydTlaaXRmd2tyM1BGZk12NHdodVN0K3c3dDBhajBXZzBHNE5mVGl4a2ZGeHlYUEVBQUFBQVNVVk9SSzVDWUlJPVwiXHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJwdXJwbGVcIikge1xyXG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRjYybFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd015MHdNMVF4TVRvME1Eb3pOeTB3TlRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURNdE1ETlVNVEU2TlRNNk1qVXRNRFU2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURNdE1ETlVNVEU2TlRNNk1qVXRNRFU2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVRsaFlUWXhaR1l0WTJWaE5DMHdZelF5TFRoaFpUQXRaalkxWlRkaE5XSXdNakJoSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZNVEk0Tm1ZelpHVXRaRGRqTlMxa1pUUm1MVGc1TkdZdE1XWXpPRGsyWW1NNVpqRmtJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZZVGRrTkRSbU4yRXRNakpsWXkxaE9EUTBMVGxtT1dJdE1UQTNZakZoTldZMk9UY3lJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwaE4yUTBOR1kzWVMweU1tVmpMV0U0TkRRdE9XWTVZaTB4TURkaU1XRTFaalk1TnpJaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1ETXRNRE5VTVRFNk5EQTZNemN0TURVNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPbUU1WVdFMk1XUm1MV05sWVRRdE1HTTBNaTA0WVdVd0xXWTJOV1UzWVRWaU1ESXdZU0lnYzNSRmRuUTZkMmhsYmowaU1qQXhPQzB3TXkwd00xUXhNVG8xTXpveU5TMHdOVG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOEwzSmtaanBUWlhFK0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0lEd3ZjbVJtT2xKRVJqNGdQQzk0T25odGNHMWxkR0UrSUR3L2VIQmhZMnRsZENCbGJtUTlJbklpUHo2UlEyY1hBQUFDUzBsRVFWUm8zdTJZdlVvRFFSREg4d2g1Qk45QUg4REMya1lyV3dYdDFWN1JXaHU3bElLS1dDa3FOb0tvb0tCRUpTREVEMHdSalNTU2NHTGlKV1p6ZCt2K3o5dXdoSHhlOXVDRUdSaENObmV6ODV1ZG5aMU5oSE1lK2M4YUlRQUNJQUFDSUFBQ0lBQUNJQUFDSUFEdEFMMkllRDRxZENrZ25WVG0wUThBNXgyYnA4c0ZaaGFTMzUrNmxmL0p1allBTDlwalNvVDJhaFdiN1F6ZjhvM0JhKzJhaUdVOEJqN1FONEFZbjdVdHB3UnJ4ZGRLQ1JFcTUxbmw0NjVZQzhKNTZQSE1nd1FZNlFzQXl3Z3JpSWdhYlh6UHhyOTRxQUdrODVlTHFhWkxIR3FBZHM2SEhxQ1Q4NkVHOEY1bzYzeW9BZXlxYy9SMi9zbTZLWE5oWFlHTzBaY0F4cU1aR01EcC9MTi9BTkIzbWlDK21uYXRYeXlrK1BIMGczWjlQVEVrUURRUUFKd0p4cFBKQTVhNW5sdUpiZ0hVWE5XdHFZTjhQWDIwQXh4TzNHdkw4MWEybEQ1SUR3RFNSY2xKTGxzTHY0N0hWOUs4V3F6VmJhR2E3WTRtZ2dQQUJLWDNIN2N5NERkc1lEaVEzTXIyN3J5MytmR3VUQm5YZnVhbjNtdjFCU0JhNUJ3bWFTeG5hb1RhalhkU2dDUEhHOGNSSURrdnppSFpTdnRaZ2VWYTJXYXlQTDdzNTFzZVdCQ2tRN2VsRWMrMjJtUHlZSlRQQ0RuemZTTVRuMnRxdnB1NWFyVlpHZlVyV0wxR2UwcmxjWjFIL2UvN1NpbStEd2tkZHlPdHBCVVVLK1BKdUhkYWRxWE10R0xHczJtcGR3dFVvMmFPYTdzVGkvRXBXRWZya056TXVodk9rNmxJandJSFdjbDZFWHZCUVJEcTFjM2hYd2hZaTNlMDNJbEgwT2hWREpZUUczMWJWZ2cvNHJVSGN3TGtocFd0Syt5N1pwSDNCVUIvYkJFQUFSQUFBUkRBZjlCZlJiNjRLWWZsUkxBQUFBQUFTVVZPUks1Q1lJST1cIlxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpY29uVXJsO1xyXG4gIH1cclxuXHJcbiAgbG9jYXRlcHVzaHBpbihvYmopIHtcclxuICAgIGNvbnN0IHRydWNrSWQgPSBvYmoudHJ1Y2tJZDtcclxuXHJcbiAgICAvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBwaW5zIGluIHRoZSBkYXRhIGxheWVyIGFuZCBmaW5kIHRoZSBwdXNocGluIGZvciB0aGUgbG9jYXRpb24uIFxyXG4gICAgbGV0IHNlYXJjaFBpbjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhTGF5ZXIuZ2V0TGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICBzZWFyY2hQaW4gPSB0aGlzLmRhdGFMYXllci5nZXQoaSk7XHJcbiAgICAgIGlmIChzZWFyY2hQaW4ubWV0YWRhdGEudHJ1Y2tJZC50b0xvd2VyQ2FzZSgpICE9PSB0cnVja0lkLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICBzZWFyY2hQaW4gPSBudWxsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgYSBwaW4gaXMgZm91bmQgd2l0aCBhIG1hdGNoaW5nIElELCB0aGVuIGNlbnRlciB0aGUgbWFwIG9uIGl0IGFuZCBzaG93IGl0J3MgaW5mb2JveC5cclxuICAgIGlmIChzZWFyY2hQaW4pIHtcclxuICAgICAgLy8gT2Zmc2V0IHRoZSBjZW50ZXJpbmcgdG8gYWNjb3VudCBmb3IgdGhlIGluZm9ib3guXHJcbiAgICAgIHRoaXMubWFwLnNldFZpZXcoeyBjZW50ZXI6IHNlYXJjaFBpbi5nZXRMb2NhdGlvbigpLCB6b29tOiAxNyB9KTtcclxuICAgICAgLy8gdGhpcy5kaXNwbGF5SW5mb0JveChzZWFyY2hQaW4sIG9iaik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKGxvY2F0aW9uLCB1cmwsIHJvdGF0aW9uQW5nbGUsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cclxuICAgICAgdmFyIHJvdGF0aW9uQW5nbGVSYWRzID0gcm90YXRpb25BbmdsZSAqIE1hdGguUEkgLyAxODA7XHJcbiAgICAgIGMud2lkdGggPSA1MDtcclxuICAgICAgYy5oZWlnaHQgPSA1MDtcclxuICAgICAgLy8gQ2FsY3VsYXRlIHJvdGF0ZWQgaW1hZ2Ugc2l6ZS5cclxuICAgICAgLy8gYy53aWR0aCA9IE1hdGguYWJzKE1hdGguY2VpbChpbWcud2lkdGggKiBNYXRoLmNvcyhyb3RhdGlvbkFuZ2xlUmFkcykgKyBpbWcuaGVpZ2h0ICogTWF0aC5zaW4ocm90YXRpb25BbmdsZVJhZHMpKSk7XHJcbiAgICAgIC8vIGMuaGVpZ2h0ID0gTWF0aC5hYnMoTWF0aC5jZWlsKGltZy53aWR0aCAqIE1hdGguc2luKHJvdGF0aW9uQW5nbGVSYWRzKSArIGltZy5oZWlnaHQgKiBNYXRoLmNvcyhyb3RhdGlvbkFuZ2xlUmFkcykpKTtcclxuXHJcbiAgICAgIHZhciBjb250ZXh0ID0gYy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgICAgLy8gTW92ZSB0byB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGMud2lkdGggLyAyLCBjLmhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgLy8gUm90YXRlIHRoZSBjYW52YXMgdG8gdGhlIHNwZWNpZmllZCBhbmdsZSBpbiBkZWdyZWVzLlxyXG4gICAgICBjb250ZXh0LnJvdGF0ZShyb3RhdGlvbkFuZ2xlUmFkcyk7XHJcblxyXG4gICAgICAvLyBEcmF3IHRoZSBpbWFnZSwgc2luY2UgdGhlIGNvbnRleHQgaXMgcm90YXRlZCwgdGhlIGltYWdlIHdpbGwgYmUgcm90YXRlZCBhbHNvLlxyXG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWcsIC1pbWcud2lkdGggLyAyLCAtaW1nLmhlaWdodCAvIDIpO1xyXG4gICAgICAvLyBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgyNCwgNilcclxuICAgICAgaWYgKCFpc05hTihyb3RhdGlvbkFuZ2xlUmFkcykgJiYgcm90YXRpb25BbmdsZVJhZHMgPiAwKSB7XHJcbiAgICAgICAgbG9jYXRpb24uc2V0T3B0aW9ucyh7IGljb246IGMudG9EYXRhVVJMKCksIGFuY2hvcjogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KGMud2lkdGggLyAyLCBjLmhlaWdodCAvIDIpIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyByZXR1cm4gYztcclxuICAgIH07XHJcblxyXG4gICAgLy8gQWxsb3cgY3Jvc3MgZG9tYWluIGltYWdlIGVkaXR0aW5nLlxyXG4gICAgaW1nLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XHJcbiAgICBpbWcuc3JjID0gdXJsO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGhyZXNob2xkVmFsdWUoKSB7XHJcblxyXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFJ1bGVzKHRoaXMudGVjaFR5cGUpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGRhdGEpID0+IHtcclxuICAgICAgICAgIHZhciBvYmogPSBKU09OLnBhcnNlKCh0aGlzLnN0cmluZ2lmeUJvZHlKc29uKGRhdGEpKS5kYXRhKTtcclxuICAgICAgICAgIGlmIChvYmogIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgaWRsZVRpbWUgPSBvYmouZmlsdGVyKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmZpZWxkTmFtZSA9PT0gJ0N1bXVsYXRpdmUgaWRsZSB0aW1lIGZvciBSRUQnICYmIGVsZW1lbnQuZGlzcGF0Y2hUeXBlID09PSB0aGlzLnRlY2hUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC52YWx1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkbGVUaW1lICE9IHVuZGVmaW5lZCAmJiBpZGxlVGltZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy50aHJlc2hvbGRWYWx1ZSA9IGlkbGVUaW1lWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIHN0cmluZ2lmeUJvZHlKc29uKGRhdGEpIHtcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGFbJ19ib2R5J10pO1xyXG4gIH1cclxuXHJcbiAgVVRDVG9UaW1lWm9uZShyZWNvcmREYXRldGltZSkge1xyXG4gICAgdmFyIHJlY29yZFRpbWU7XHJcbiAgICB2YXIgcmVjb3JkZFRpbWUgPSBtb21lbnR0aW1lem9uZS51dGMocmVjb3JkRGF0ZXRpbWUpO1xyXG4gICAgLy8gdmFyIHJlY29yZGRUaW1lID0gbW9tZW50dGltZXpvbmUudHoocmVjb3JkRGF0ZXRpbWUsIFwiQW1lcmljYS9DaGljYWdvXCIpO1xyXG5cclxuICAgIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdDU1QnKSB7XHJcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignQW1lcmljYS9DaGljYWdvJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcclxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnRVNUJykge1xyXG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ0FtZXJpY2EvTmV3X1lvcmsnKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdQU1QnKSB7XHJcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignQW1lcmljYS9Mb3NfQW5nZWxlcycpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ0FsYXNrYScpIHtcclxuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdVUy9BbGFza2EnKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZWNvcmRUaW1lO1xyXG4gIH1cclxuICBcclxuICBhZGRUaWNrZXREYXRhKG1hcCwgZGlyTWFuYWdlcil7XHJcbiAgICAvLy8vbG9hZCBjdXJyZW50IGxvY2F0aW9uXHJcbiAgICB2YXIgbWFwWm9vbUxldmVsOiBudW1iZXI9MTA7XHJcbiAgICBsb2FkQ3VycmVudExvY2F0aW9uKCk7ICAgIFxyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy5VcGRhdGVUaWNrZXRKU09ORGF0YUxpc3QoKTtcclxuICAgIHZhciBpbml0SW5kZXg6IG51bWJlciA9MTtcclxuICAgIHRoaXMudGlja2V0RGF0YS5mb3JFYWNoKGRhdGEgPT4ge1xyXG4gICAgICBpZihkYXRhLmxhdGl0dWRlICE9ICcnICYmICBkYXRhLmxvbmdpdHVkZSAhPSAnJyl7XHJcbiAgICAgICAgdmFyIHRpY2tldEltYWdlID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNnQUFBQXRDQVlBQUFEY015bmVBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFOT1NVUkJWRmlGelpsUFNCUlJHTUIvMzl0TUNDTjNOeTNJTGxHQy9UbFlVT0NmVFlJd0lTandWblRwVkhUSmcxRWdDZFZGcTFzUkhTTG9uSWU2V0ZHa3E3c1ZGRWhobXVXdFA0VE1paWlGdWpPdlE2TTc2cXc2N3Jqajd6YnZmZk45UHg2ek8rOTlJNndBM1VDaE1VNnRDTFZhcUJTTFhRaGJnQ0k3WkFMTmJ4R0dOUFJwaUVlTDZKVk9KcjNXRWkvQm96RXFMWXNMQ0kxQXNjZGFvMENITXJrYlR0TG5xMkNxanIzYTVCWlE3MUVxVzlWT1RKcWpDZnFYRGwwRXZZZjFxUWczZ0NaZ25TOXlHZEphdUIwMXVDcjlUSGtXTk9vb0U1TW5HdmI3TERiZjRMMmU1dVRtTi94d24zYVRxMllQSVo2ajJiYXFjaG0rQS9YUkhqN1BuMWdnT0ZKRHVSSzZnYTM1TUhQd3l3d1JLKzNpbTNOd2p1QklOUnVWNGgxUWtWZTFERU5TeU1ISVM4Wm1CcFJ6VmlrZUVwd2NRTG1lNUw1ellIWUZqVm9hZ2NkNVYzTEJFazZVeEhrS3RxQStRRUZxQTRQQWprRE5iQVMraFVOVVNCZHBCV0JzNERSclJBNUF3MDRqelNtd24wR0I4OEVxTFVTRWN3QmkvNjE4Q1ZySWpaREpUaVhpMC90MUZiQVU5VXFnS21pUmJGaFFyWURkUVl0a1JhaFFRRm5RSG90UXBzanNndGNjQXBzVWVOK0c1NUcvQ3ZnWnRNVWkvRlFDdjRLMldJUWZ5b0tCb0MyeUlUQ29nQmRCaTJSRjgxenNUYW9CRkFUdE00OHBNMFJVbFNRWVp3MnVvc0N6MGk0bUZJQVMyb01XY3FFZDdPMVdPRTRjU0FhcTQwVFRFK2toQWM0emlkQU1tRUU1T1REUlhKcTVtQldNeGtscXpjMWduRElJdEVVVHZIVmNaOUFORkk1T2tGejFia0lXQkQ2RVUxUTVXeUZ6anAzU3lXUUJISU9GSi93OE1KUU9jWHgrbjhhOTlWRkhHU2JkNU9rZ3BXRllXOFJLRWd2M0JjcnRobWdYM3d0Q0hFTG9YSDA5WHBsVFZMdkp3Vkx0TjFCR0xaY0ZXb0gxUG90TmlkQWFqdE1tb0xNRkxhdUJhY1RZRHJTZ09VdnVmVUlMb1NPVTVrcHhrdUdsZ2oyMWdFZHFLRmR3eG00QmUrM2hES0RwTUJXUFN1TjhYZTVObmdTZHBHTHMwNXB1SUx4RTZLZ0loeU54UHEya2p1dVBaRG5ZQmE4dkkvVGFTdVVnQjBHQXlCL3VBRVBaNWpVTVI0cTRsMHVObkFUbEE5UFcvM2U0ZTNKTjAwcStqY3lwa2N2Tk14ZzF2RUE0T2lleDVuV2tseU81NXM1cEJXZlJOQUZweDRpSmNOR1AxTDRJMmg5a0hzNE9DQThpUFh6MEk3Yy9Ld2hNbTdRQVk4QzRxV2oxSys4L2RramxmZmUwMTY4QUFBQUFTVVZPUks1Q1lJST1cIlxyXG4gICAgICAgIGlmKGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJ1bmtub3duXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcIndhcm5pbmdcIiB8fCBkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkgPT09IFwibWlub3JcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0aWNrZXRJbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDd0FBQUF6Q0FZQUFBRHNCT3BQQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBUHlTVVJCVkdpQjdaaFBpQnQxRk1lLzd5WFQxZDNGUWhHS2VLbm9LdGpzV21sdnhSYWg5cUxWUzZkSlpvT3VCdytXUWkvMXRJY1d2T2lXc2xTOXVBZUpheWEvYklNSEtZcW9oeFFVUVloYU5wV3lXRkJXb2kzMG9DaDFONVBmODdEYmtKMU1KcE9kWkJLd24xdmU3LzErNzVOaDV2ZVBzQTFNMDl4aEdNWkJBSWNBUEEzZ0NRQzdBWXh2cHZ4TlJIK0l5QXFBSDVqNXl1am82RGNMQ3d1MTdkUnJocnBKVHFmVGU0bm9GSUFUQUhaMVdlczJnRXRFOUo1dDJ6OTEyYmRCSU9Ga012bDRMQmFiQS9CaTBENCtDSUJQbVBtTlhDNzNjN2VkZll1YnBobUx4K096UkRRTFlNZDJEZHV3SmlKdk9vN3pWckZZckFmdDFGWTRuVTQvU0VRZlkrTTk3UnNpVWpJTTQvamk0dUx0SVBtZXdxbFVhZzh6ZndGZ29xZDI3VmtCY0RTZnovL2FLYkZGT0oxTzd5YWlLOWo0OHFQa0JqTS9rOHZsZnZkTDR1WWZNek16OXhIUnA0aGVGZ0FlMVZwL1pwcm0vWDVKVzRUWDE5Zm5BZXp2cTVZLyt3ekRtUE5MYUx3U2xtVWRBbEJDK0drckxGcEVEaXVsdnZacXZQdUVDY0JGREY0V0FKaUk1dEhHaFFFZ2s4a2NBN0F2U3FzT0hKaWVubjdlcTRFQlFHdDlNbHFmem9qSTYxNXh5bVF5RDJtdFZ3SEVJbmJxUkYxRUhsWkszV3dPc29nY3hmREpBaHRPejdtRHJMWHU2OUliQmlJNjdJNHhNKzhkaEV3UWlPaEpkNHhGWk04QVhBSWhJbys0WXd4ZzV3QmNndExpeGw1WlEwU0xId080NlpFNExGVGRBZllLRGhHZXdoMDN6UU9reFkwM04rdERpWWlVM0RHdTErdWZEOEFsRUNMeWxUdkdoVUxoRndEWG85ZnB5TFZOdHkwd0FJakl1NUhyZE9ZZHJ5QUR3TWpJeUFjWXJ1bnRWcTFXKzhpcmdRRWdtODMrQzJBK1VpVi96aGVMeFR0ZURZMlZwRnF0WGdEd1hXUks3ZmwrZkh6OFlydkdobkNwVkhKRTVCVUFudjhzSXRaRTVHVy9XODR0YTdWUzZqcUExd0RvZnB0NW9FWGtWYVhVTmIra2xwUEc4dkx5Y2lLUldDV2lYdHhVQmtWRTVLUlNLdHNwMGZOb1ZLbFVmcHljbkx3RklJcmowN3FJbkZKS3ZSOGsyZmNKcGxLcEE4eDhDVURMUnJwSC9DWWlKNVJTM3didDRQdjBLcFZLTlpGSTJFVDBBSUNuT3VWM1FRM0FRandlVDlxMnZkSk54OER2YUNhVGVVeHJmUTdBY1FBajNmazFXQ09pb3VNNDU1YVdsbTVzWjRDdVB5clROSGNhaHZFQ2dDU0FZd0c3WFFhd1JFU1hiZHYrcTl1YXpZU2FCU3pMK2hMQUViOGNFU2twcFo0TlU2ZVpVR2M2Wmo0RC96bGJFOUdaTURWYWFvYnBuTXZscmdKWTlFbjVNSi9QbDhQVWNCUDYxS3kxbmdYd2owZlRIYTMxMmJEanV3a3RYQ2dVcWtSMHdhTnBybEFvcklZZDMwMVA3aVhHeHNiZUJ0QXNWNDNGWXVkN01iYWJuaXdFNVhLNU5qVTE5U2VBbHdCQVJFN2J0dDJYcldyUGJuNG1KaWF5QU1vaWN0VnhITDhQY1hpd0xPdUlaVm0rOC9JOTd2Ri81ei9kMGpvRVB6aFpHZ0FBQUFCSlJVNUVya0pnZ2c9PVwiXHJcbiAgICAgICAgfWVsc2UgaWYoZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcIm1ham9yXCIpe1xyXG4gICAgICAgICAgdGlja2V0SW1hZ2UgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ3dBQUFBekNBWUFBQURzQk9wUEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBT3hBQUFEc1FCbFNzT0d3QUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU95U1VSQlZHaUI3WmhOYUJ4bEdJQ2ZkMlpOYWxzb2lGQlVoTGJaVGZwek1OTGdRVEZGcUwxb1BaVjRVWnZkcEpUV0h1c3BnZ0V2bWxKQ1ZkQ2c1c2NpWXNTRDlDTHFJWUdLSUxiYVEycTczYTJHbHRnS0JSVk5tdXpPdkI0UzA4M3N6T3pNenU3c2duMXU4Mzd2OTMwUEg3dmZ6eXRVdytSTUN3dXRUMkJyTi9BbzBBRnNCamF1WlB5TmNnTWhDL3dJVExQMDU3Y2M3aXBVTlY4SkVpcDcvTW91Vkk2QjlnRDNoWnpyRnNJa051K1FTVjBNMlhlVllNSVQrWFpzZXdoNExuQWZieFQ0QWt0ZW9UK1pDOXZaZi9KSk5ablBEYUFNQUMxVkNucXhpTWpyckc5N2d4NnhnbmJ5Rmg2NWZEOHR4dWRBZHkzc2ZKakNLQjdnNEk1YlFaTGRoY2QrM2dLSnI0QlVEY1g4eUdLWisramZObHNwc1Z6NC9hdWJTZGpUb0IxMVVmTW1UNkx3SkMvdS9NMHZhYTN3MkMvcm9IZ1cyRjFQTXg5K1lzTzZ4K2w1ZU1FcndWajdhUTNUT0ZtQVR1WnZEL2tsM0ZuaDhXdzNLbE5FMzdhaVltTWJlK2hyTyt2V3VMekNxb0xLS1JvdkMyQmcyc09vdXJvc0MwL2s5Z09kY1ZyNW9uUXhkdVVadDZhVkZlWm9yRUpCRUk2NGgwOWZmSURpUGRjQU0yYWxTbGdVelljNHRPMW1hZENnMExLUDVwTUZNREd0cDUxQkE5RjZINzNWWTdDblBBUzdHcUFTREdXbk0yUUFXK0kzQ1lwc2RVWU1ZRk1EVEFLaVpXNkdXMW9UVWVabkFEZGRFcHVGT1dmQVFNdURUWU9vaTdCb3hVdHp3MUFwY3pPQTZRYW9CRU9aY29ZTXNMNXNnRW93cFBpTk0yU1EzdkVyY0NsK200ck1yTGl0NGI5dDQrMTRYUUlnOHBaYmVFVTRNVXB6YlcrL3M3NzF0RnZEc25CNjYyMWdPRTRqWDFST2VEMUU3NXdrczlkUEF0L0g1ZVREZVFwL25QSnFkRHp6TDI4SDR6eHdiNzJ0UEZoRTJFMXZhc1lyWWUxWm5lNjRoSEFJc090dDVvS05hdHBQRnR3dVA3MnBqMUh0WjduS0dCZUs2bEV5N1o5VVNuUy9yV1hheDFCZUJpSVhvQU93aE9vUk11MGpRWkw5NnhBZjVyc3c3RW1nN0NKZEU0VHJDRDBjVEgwWHRJdi9mYml2N1FlVzdNZEEzcU8ycTExQWVCY3Bkb2FSaFRDVm5nOXlTVXdkQkE0QXJlSDhWbGxFK0F3WXBEZVZyMmFBOEtXcGtmd21XdTFuVVo0SDlnZnNkUWJoVXhLYzRZWFVYNkhuTENGYUxXMDg5eldxZXl0a1RaRk9QUlZwbmhLaXZla3M2emorZTdhTnlQRkljemlJSnR6WGNRSGtJODkyWVlMZTVMbEljemlJL21xMml3UEFQeTR0QzlqeVd1VHhIVVFYN3RzK2gzTFNwV1dJVFBKYTVQRWQxS1l1VWRqd0psQXFONGM1ZjZJbVl6dW9qZkRoQitlQndkVnYxVmQ1NlJHM24wbGthbGY1bVUyT0ErZUFDMnhNZWY4Um00clI3RjVHczVYMjVidmM1WC9OdjFvWTlxZGJGa2wwQUFBQUFFbEZUa1N1UW1DQ1wiXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHVzaHBpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihkYXRhLmxhdGl0dWRlLCBkYXRhLmxvbmdpdHVkZSksIHsgaWNvbjogdGlja2V0SW1hZ2UsIHRleHQ6IGluaXRJbmRleC50b1N0cmluZygpIH0pO1xyXG4gICAgICAgIHB1c2hwaW4ubWV0YWRhdGEgPSBkYXRhO1xyXG4gICAgICAgIG1hcC5lbnRpdGllcy5wdXNoKHB1c2hwaW4pO1xyXG4gICAgICAgIHRoaXMuZGF0YUxheWVyLnB1c2gocHVzaHBpbik7XHJcbiAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIocHVzaHBpbiwgJ2NsaWNrJywgcHVzaHBpbkNsaWNrZWQpO1xyXG4gICAgICAgIG1hcC5zZXRWaWV3KHsgbWFwVHlwZUlkOiBNaWNyb3NvZnQuTWFwcy5NYXBUeXBlSWQucm9hZCwgY2VudGVyOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZGF0YS5sYXRpdHVkZSwgZGF0YS5sb25naXR1ZGUpfSk7XHJcbiAgICAgICAgaW5pdEluZGV4ID0gaW5pdEluZGV4ICsgMTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBtYXBab29tTGV2ZWwgPSBtYXAuZ2V0Wm9vbSgpO1xyXG4gICAgJCgnLk5hdkJhcl9Db250YWluZXIuTGlnaHQnKS5hdHRyKCdzdHlsZScsJzQ4MHB4Jyk7XHJcbiAgICAvLyBjb25zdCBpbmZvYm94ID0gbmV3IE1pY3Jvc29mdC5NYXBzLkluZm9ib3gobWFwLmdldENlbnRlcigpLCB7XHJcbiAgICAvLyAgIHZpc2libGU6IGZhbHNlLCBhdXRvQWxpZ25tZW50OiB0cnVlXHJcbiAgICAvLyB9KTsgICAgXHJcbiAgICBmdW5jdGlvbiBwdXNocGluQ2xpY2tlZChlKSB7XHJcbiAgICAgIGlmIChlLnRhcmdldC5tZXRhZGF0YSkge1xyXG4gICAgICAgIHZhciBsbD1lLnRhcmdldC5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgIGxvYWRUaWNrZXREaXJlY3Rpb25zKHRoaXMsIGUudGFyZ2V0Lm1ldGFkYXRhLCBsbC5sYXRpdHVkZSwgbGwubG9uZ2l0dWRlKTtcclxuICAgICAgICAvLy8vaW5mb2JveC5zZXRNYXAobWFwKTsgIFxyXG4gICAgICAgIC8vIGluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgICAgLy8gICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcclxuICAgICAgICAvLyAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgLy8gICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCA0MCksXHJcbiAgICAgICAgLy8gICBodG1sQ29udGVudDonPGRpdiBzdHlsZT1cIm1hcmdpbjphdXRvICFpbXBvcnRhbnQ7d2lkdGg6NTUwcHggIWltcG9ydGFudDtiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtib3JkZXI6IDFweCBzb2xpZCBsaWdodGdyYXk7XCI+J1xyXG4gICAgICAgIC8vICAgKyBnZXRUaWNrZXRJbmZvQm94SFRNTChlLnRhcmdldC5tZXRhZGF0YSkgKyAnPC9kaXY+J1xyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICB9XHJcbiAgICAgICQoJy5OYXZCYXJfQ29udGFpbmVyLkxpZ2h0JykuYXR0cignc3R5bGUnLCd0b3A6NDgwcHgnKTtcclxuICAgICAgcGluQ2xpY2tlZChlLnRhcmdldC5tZXRhZGF0YSwgMClcclxuICAgICAgLy8vL01pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKGluZm9ib3gsICdjbGljaycsIGNsb3NlKTtcclxuICB9XHJcbiAgdmFyIGN1cnJlbnRMYXRpdHVkZT00MC4zMTI4O1xyXG4gIHZhciBjdXJyZW50TG9uZ2l0dWRlPS03NS4zOTAyO1xyXG4gIHZhciBkaXN0YW5jZURhdGEgPSBcIlwiO1xyXG4gIGZ1bmN0aW9uIGxvYWRDdXJyZW50TG9jYXRpb24oKVxyXG4gICAgICB7XHJcbiAgICAgICAgaWYobmF2aWdhdG9yLmdlb2xvY2F0aW9uKXtcclxuICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XHJcbiAgXHJcbiAgICAgICAgICAgICAgICAvL0FkZCBhIHB1c2hwaW4gYXQgdGhlIHVzZXIncyBsb2NhdGlvbi5cclxuICAgICAgICAgICAgICAgIHZhciBwaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihsb2MpO1xyXG4gICAgICAgICAgICAgICAgbWFwLmVudGl0aWVzLnB1c2gocGluKTtcclxuICBcclxuICAgICAgICAgICAgICAgIC8vIC8vIENlbnRlciB0aGUgbWFwIG9uIHRoZSB1c2VyJ3MgbG9jYXRpb24uXHJcbiAgICAgICAgICAgICAgICAvLyAvLyBtYXBzLnNldFZpZXcoeyBjZW50ZXI6IGxvYywgem9vbTogMTUgfSk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TGF0aXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TG9uZ2l0dWRlID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRMYXRpdHVkZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50TG9uZ2l0dWRlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgZnVuY3Rpb24gcGluQ2xpY2tlZChwYXJtczogYW55LCBsYXVjaFRpY2tldENhcmQ6IG51bWJlcil7XHJcbiAgICAgIC8vY29uc29sZS5sb2coJ2VtaXQnLHRoYXQpO1xyXG4gICAgICB2YXIgc2VsZWN0ZWRUaWNrZXQgPSB7XCJTZWxlY3RlZFRpY2tldFwiOiB7XHJcbiAgICAgICAgICBcIlRpY2tldE51bWJlclwiOiBwYXJtcy50aWNrZXROdW1iZXIsXHJcbiAgICAgICAgICBcIkxhdW5jaFRpY2tldENhcmRcIjogbGF1Y2hUaWNrZXRDYXJkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCdTZWxlY3RlZCBUaWNrZXQ6ICcgKyBzZWxlY3RlZFRpY2tldCArJ2xhdW5jaFRpY2tldDogJysgbGF1Y2hUaWNrZXRDYXJkKTtcclxuICAgIHRoYXQudGlja2V0Q2xpY2suZW1pdChzZWxlY3RlZFRpY2tldCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNsb3NlKGUpIHtcclxuICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2ZhIGZhLXRpbWVzJykge1xyXG4gICAgICAkKCcuTmF2QmFyX0NvbnRhaW5lci5MaWdodCcpLmF0dHIoJ3N0eWxlJywndG9wOjBweCcpO1xyXG4gICAgICAvLyBpbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAvLyAgIHZpc2libGU6IGZhbHNlXHJcbiAgICAgIC8vIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBsb2FkVGlja2V0RGlyZWN0aW9ucyh0aGF0LCBpbmZvQm94TWV0YURhdGE6IGFueSxlbmRMYXQsIGVuZExvbmcpIHtcclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMnLCAoKSA9PiB7XHJcbiAgICAgIGRpck1hbmFnZXIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5EaXJlY3Rpb25zTWFuYWdlcihtYXApO1xyXG4gICAgICBkaXJNYW5hZ2VyLmNsZWFyQWxsKCk7XHJcbiAgICAgIG1hcC5sYXllcnMuY2xlYXIoKTtcclxuICAgICAgLy92YXIgbG9jYyA9IG1hcHMuZ2V0Q2VudGVyKCk7XHJcbiAgICAgIHZhciBsb2NjID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGN1cnJlbnRMYXRpdHVkZSwgY3VycmVudExvbmdpdHVkZSk7XHJcbiAgICAgIC8vIFNldCBSb3V0ZSBNb2RlIHRvIGRyaXZpbmdcclxuICAgICAgZGlyTWFuYWdlci5zZXRSZXF1ZXN0T3B0aW9ucyh7XHJcbiAgICAgICAgcm91dGVNb2RlOiBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLlJvdXRlTW9kZS5kcml2aW5nLFxyXG4gICAgICAgIHJvdXRlRHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICBkaXJNYW5hZ2VyLnNldFJlbmRlck9wdGlvbnMoe1xyXG4gICAgICAgIGRyaXZpbmdQb2x5bGluZU9wdGlvbnM6IHtcclxuICAgICAgICAgIHN0cm9rZUNvbG9yOiBNaWNyb3NvZnQuTWFwcy5Db2xvci5mcm9tSGV4KCcjMDA5ZmRiJyksXHJcbiAgICAgICAgICBzdHJva2VUaGlja25lc3M6IDVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpcnN0V2F5cG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiB0cnVlLCB0ZXh0OiAnJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUQwQUFBQTBDQVlBQUFBNWJUQWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFoOVNVUkJWR2lCeFpwcmJGekZGY2QvNTk2czQvVjZ2VTVzRWxPMklYR2FoMjN5c0oxRUVOSHlVQitrbEg2QnZxQnFvYTNVaDVEYVNrV0lpbEpVcVNJaXFvTDZVSVZhcExZaTFPVWhFTFNncGhVb2tJWkVKQ1l4OFNPSlkxeUpCQ2V4MTE1NzEydnY3cDNURDd0cjFzSEc5M3J2cXY4dk8zdnZ6SC9PLzg3TW1UTVBvWXpvMjdBaFBHVlpuMWVSbTRHdGlLeEJOWkovUFE0TW9IcEM0ZFYwSnZQeXRmMzk0K1cwcHdBcEIyblhwazJOampFUG9QbzFJT1N5MktSQ2g0bzgwdDdkM1Y4T3V3cndWZlNoYURRWWpFUWVSdlhIUUdDUk5GbmdNU2NZL1BtMlk4Y21mVFJ2QnI2Si91ZjY5UnNyUlA1VmE5dFJYd2hGVG9ucTdWdDdlcnA5NFN1QzVRTkg0UGJhMm9jcVJVNzZKaGhBZFlQQ3djNk5HNi96alRPUFVsdjY0ODNCNEV1L1g3VnFTNDF0KzJMUWh5QVN0eDNuazV2Nyt0N3hpN0tVbHI2MXhyYTdIbzFHeXljWVFEWGlXTmJmdTF0YWx2dEZ1VmpSdHdJdlBORFFVSHRWWUxIK3loTldwVlVmOTR0c01hSzNBeDA3UXFFbHQwUWlDMmIyRVhkME5qZnY4b1BJcStnNjRFV2cra2NyVi9wUnZ5ZUk2bTcxWWNaWjRqSC9IcUJoV3loRVUyV2xwNEk5cVJUUGo0MXhJcFVpNlRoRWJKdHRvUkJmWHJhTWFFV0ZPeEtSelNldXVlWXpuRHk1MzZQZHMrQkY5RWJnR3dCZjlOQ3RNNnJzR1JyaTJkRlJ0T2o1K1V5RzNxa3AvaHFMOFlNcnJ1Q2UrbnBYZk9vNGR3TWxpZmJTdmU4RmJBdTRxYWJHZGFHT1dHemZNNk9qdHluc0FyNEh2QXdmNk0rcTh1dUxGL25qOExBN1FwSGJqcmEzbCtROTNZNFBHN2dBMURWVlZ2SlVZNk5iL21kYmUzcStOTWZ6RzRBT29LSHd3QUk2R2h0WjUyTFlxREU3Mi9yNjNuUnJ4T1Z3MjlMdDVKd1lUY0dnYTNLaitxdDVYaDBBYmdGU00zbUJwMkl4Vjd3aTB1cmFpRG5nVnZSTUpWSDM4M0t5cmJmM3lFZThQd0hzTFg1d09KbDB5LzBKdHhubmdsdlJhd3FKaVB2b2ExaVk1YnZtd3ArSy84U3lXWGZNbGxYbjFvZzVpN3ZNRnk0a2xscXVmZCtWcjYxZXZkQUE3UWRtbG8rdXB5NVY5Mk5zRHJoVk1OUHZFbzdqbHJ1aU5oaThaWUU4UzRHWkQzTmpPUHdSV1QrQWlKUzB3K0pXOUtWQ1l0eTlhQkI1Nk9tYzU1OFBOeGRzQ05zMmR5MTN0Nll3eHJpYzMrYUdXOUduQ29sem1Zd1gvdFoxTFMyL21TZDBGT0FCZ0FvUmRsOTFGY3VYdUl1VkxKRjN2Ump4b2ZJdTh4MGk3NVI2cHFhODFhRDYvZVBOemM5M05qVmRYZlJVZ04zQTllc3FLM2xpOVdwMlZsZTdwalNXZGN5YkViUGhKWGp2QWpiWkloemNzSUZLOXc2dGdMVENhK2N5bVhjUFRFeDhLbTFNODlhcUtyWldWWGxkUVV4WHA5T1JkZjM5MDE0TktNQkw3UDAwc01sUjVVZ3l5UTB1blU0UktnUStGdzBFWEkvZGVmQnFLWUxCVyt6ZFFiNkx2NTVJbEZKblNWRFZsMHJsOENLNm4venE1c0RFQkk0dUZIZVVBU0tPNVRndmxrcmpkV0R1QlJqSlpqbjQvMmh0MWYxYlQ1OCtWeXFOVjlIN2dVNkFGOGJHU3EzYk0xVGtDVDk0dklwVzRFR0FOeElKM3ZjMlo1Y0drWE5Mb2VUeERJdmJHSHdGT09Dbzh1VElpQjgydUlLcTdtM3A3azc3d2JYWUxlQjdnZXdMWTJQRXZZU2xpOGRZT3AzK2cxOWtpOTJsdndpc3pLanVXQ0xDanBEYmc4bkZRVVVlMlg3cVZFbjdZc1VvNVlUanA4Qi85OFZpakxoZEJ5OE9JK25wNmNmOEpDeEY5RGp3clpReCtvVGJUYjFGUU9FUnZ3L3JTejIxZkJYNDNkT2pvNXp4dWhCeGh6UGhkUHEzZnBQNmNWUjd2Nk42ZXZmUTBJSjdRMTZoOE1OUzQreTU0SWZvU2VEdXpzbkp6UDV4LzNxaHdITnRQVDJ2K0VaWUJEOUVBN3dKM0w5bmFJaWtNYVd6aWFUVW1KK1VUalEzL0R4WVBwd3lwdGxSYmJuV3c0YkFYQkRWWDdUMjlaVzhzSmdQZnJWMEFkL2VGNHYxdnBOS0xaeHpmaHdQV05hamZoazBGL3dXbmNpcTN2SHcrZk9KNmNVdFBhZU5aWDNUcjNCelBwVGozc1NsVWNmcFRLdmVlVjExdGFlZElCWDVXWHQzOTNObHNHa1d5blZaNUd4UEtqWFdGZ3J0K3BqTFl5Q0J3MmQ2ZXI3enpNS25JaVdqYkRka0RCd1pTS2NiUDF0VHM2VkNGbXp3Q1ZSM2ZYcTRqS0ZkRVZ4M3YwUFJhREJZWGIxUzRVcXhyQlVDZFloRVZEV0NTQ1IvNTdNYVFLRlNJR2hBL2p3OHZPT2UrdnFQM2tWVVBTZVdOWlJMYWdxWXl2T2tKSjhHRW9qRVVZMmpPaVlpY1lXWUduTVJrZlB4Vk9yQ1RZT0Ryc0xDV2FLUHRyY0hKSm5jYk50MnU2cXVRMlF0cW8zQTFVQnRVZFlFSXBkUWpSY01FWkc0cXFZUWNkU1ljUUFSY2FZZ2VYaGk0cjRidytIaThrVVd5SDhFL3FLcU5TSmk1NFhYcUtvTklKWlZnNm90SXNGWkh6ajNlMFhoUStjeEJneXE2b0NJRElqSUdUSG1hS2FxNnAxdHg0N043SGpJb1dnMFdGVlQ4MVhnTG9YcnlaMHZEUUs5cUE2SVpRMWd6THRxMnhlc1RPYjlaREk1dFBPOTl6ek5TYmVGdy9VUFJxT3ZWNGcwWGZhcTJ3a0dkNVJ5Qi9SUU5Cb01oVUlOSmhDNFVoeG5KWmExUm8xcEZKRzFtcnN5c2hxWUJ0NUFaTjlZTXRraHg1dWIvNjJ3QmRXL3FjZy9URGI3MXJiVHAzMGZXMjl2M0xnYXkzb0xLRnd1bVZDUmE5dTZ1M3Y4cnFzWVI5ZXZyN2VXTE5rdUlsOUE5U3ZBMjVibXh1SzRXdFlGVy9VQzRYQzhISlczOXZVTmF1NHFkQll3WWxsM2xsc3dBT0Z3M0lJaHpWMGZpUU1SNmRxMGFWbldtTytLNnRlQmxyempPSzdRSjZwbmpXV2R4WEVHalcyZlM4ZmpsN3gyN2N2eGRsUFRmVUJGYTIvdkwzMlFCRUIzUzh2eXRERjFxbG92dHIxR2pHbFVrYlZBazhBV3pSMEhueFNSSnpVUWVIeVdJenV4ZWZNS2s4bHNWOHRxRTlYMWVVZTJGbGhSbEcwQ2VCOFluWEZrTUVyT215YXMzUGpCcUU1YUl0TUFxcG9FMGdBS0NWSE5hbUUrRmdsSTNoa0pMRVdrS2wrKzBoTEpIYjZyVmdFaGhUcUZPb0hsQW5VcVVvZHFIYk1qeXd1b25rVmtRRlJQS1hSYWdjRFJMVjFkRndzWlhFMVpSOXZicXdLSnhFcEhwQ0UvWFRVWWtXVVlVNHRJclpXYnVtcUFDaUFpSWxaZWJLVElvTnFpK3BibGY1V2N4NFhjWFp2QzBISUtCKytxbWdVbUVKa1dpQ21NaURFakJrWkVaRmhFaGgyUkVUdWRIcG1jbkl5NTZZbi9BOEZJUzIwNU9TS2VBQUFBQUVsRlRrU3VRbUNDJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgIGxhc3RXYXlwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IHRydWUsIHRleHQ6ICcnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEMEFBQUE5Q0FZQUFBQWVZbUhwQUFBQUJtSkxSMFFBL3dEL0FQK2d2YWVUQUFBQUNYQklXWE1BQUFCSUFBQUFTQUJHeVdzK0FBQVkxa2xFUVZSbzNxV2JhYXhsMlhYWGYydnRjODRkM3Z4ZURUMVA3bmJiN203YjNjNWs0aGdMTUIveUliRWlFRUlKRWlBSGdSQVNnZ0JCSVI5UTVFZ2doSVFWUjlBSmliQ0lFUXFLRkRHSUtTR09vUlBTZGx2ZGRMdXJKM2YxVUZWZFZhK3EzblNuYzg1ZWl3OTduM3Z2cThGZERVZTY5VzY5ZCs4NWUrMDEvOWQvaTd0enU1Y1pxS2IzYnVBS09CaUd1MkFPQnBoRGRNYzgvVDRpNEk0N0lMZTR1WU1JSUVMQUVYRlVsQ0NDQ2lpZ1F2bzlDZ0ppSUhyajJ0N3ZrdHNSMmoydlZjRE1jRlhjREhQQjNEQVVjMmdzNGlpTkc2MDVyVU0wVDV2aDRJQ1p1NmlJT1E2T2lvaWJ1NnFJWk1GVW9GQWg1SitsS0lKUmFrQUZBb2FJb3VLSUttS0dab205Mjd6L0g2RWR3TUFsdlhlenRIaDNvaXZSamNhZHhxQjFwNDdRQXRQV3ZERW5PclNkME9ZWWpvZ3NOTzdnN2lpQ2FOSnFrVitsQ3IxQ3BRQ3FBS1VJaFVJbGtxM0FVQkdTZ1NoQms4WkZiMjFRQU1YN0NleDU5MDNTb2lNa1FjeHBQVkliekZxbk5tZHE3ck1JVXpQcTZMUUdqVGt6Z3pvYXJVR1V0REJ6QTBCRlVCV0Nrd1FLU2sraERFSXAwQXZtbFNxREFKV0s5QXFoQ2xCSm5HOU0wcjVqcFBmV2FmU0RDdDBKVFBiUDZFbTdyU1Z0MWdhMU9aUFdtVVQzU1d0TXM4QlRnLzI2NWFpQlVlUHNOWkhEMmhqRjlKbldIZlAwQkpGa3ZuMkZsVkpZcXdLYlJVanZTMkdqQ3ZUVjZLdlNLL0JoVkFaQnBCK0VuZ3BSblRLaytGSllXck1ndU54YThPSldBbmNPNGdnR3RER1pjVzB3YVoyWk9hUFdmTnc0bzlhWW1uTlVPNWVtTFZkcTQvdzRjbVhXc2orREdaWWUzdTJrTEQ5RndPT3gxWldxYkpSd3NsOXcxMHBncDFKTzlBcldLMkhVR2lzaCtMQ0VRYUV5VktHUFVMcmpHaWcwQlQzSnpuMnoySG1EVC90YzNxUU5RNG51MUZtd1NYUkdqZnRSYXh6V3hzU2MvU1p5YnRSeWJoUjVkOXh3ZVdxWUpNdHdFNkliU0lydTBzbWVueXZaSnpzM0VuZFVOVWR2SVJpY0hDcDNEd3Z1V1MyNGMxQ3dWUVlHS3F4V3ltcXByQlFpZ3lEMGcyYTNFSVRzN3ptcXlhMkV2bDdnNkJCZG1FVm5HbzFSNjR5aSswRnRITlNSbzlaNGQ5VHkzYU9HZDQ1YWR1dTRFRlNTNzd1bGU3a0l1T0RjUEhBS0F1SkphRWxCTFFnRUIxRW5pTERUQzl5N1V2Q2gxWko3VmdwV1MyVzlES3lWeW1vaE1peUVRVkNxSUFSeGduQlR3WXNiQktiTHRVTHJLUUNOVytlb05RNGI4NFBHT0dpY0s3T0dWL1phWGo5cXVEaU9SRWlCS3Z0K2w2dkp1ZHZkRWVGN0NMMzRqSkxDL1R4SGU0cm1seWJHMVduTnhVbmtRN09TUjlkS21qN1VaclNtSGwzRkhWeUVudW84elNvTEM1Tk9hTy9zUHkvV2tCU3djcUE2YW8zOTJueXZqaHcyemp2anlJdlhacHc5YWpscW5SaU5Obi9IUkxCbzg3enNuWmkrdkxWeWsvYysvNVVBNGtMRWs5QkJhYzBwRktJNDU4Yk9YbTFjblVVZTMreHg3N0JJOVVCNm5LQ2FFcllLaGFUQ0tCVTJTY1pqZ2N3OWhmMDJwa0ExanNaUll4eTA3dGZxNU1PdkhUWThmN1htM0xpbE5tZ3NGU0tSVklpNGUwcHZ2ckFkUjQ3TGVhdTRLb3ZONlQ1cUltaHJTRTVGTWFjbWE1d3pldzFIalZOdjkzbG9yY0RGd01WZFRDaUJYTGtWbW1KRlorYUY1MkJpcEZ4c0JvMm5vRFZxbmIwbSt0NHNwWjFYOW11K2ZYWEdwVWxrNWs1clFqU243VXBRQThlQUhEV0ZKRERmSTM5Yy93ZFptR0hLYWs1MFIxeVQ2MGtLRmxIVEJyd3phcW5qbE5wTEhsbXJVaUdGdUlxSWloRkVjNHhJOTFRUkNvRmNKaVp0TlFiVENPUEdPV3lpSHpiT1FSTjUvYURodWFzMWx5ZVJtVU1kbldpTEhPNmRpWFpST3FlTDI2L3NiN0lKT1FPb0NPNUdkTUZjY0hHQ2E0b0JPTzlOV3A3ZE5RVGh3MnNRTkZCbzlFQVFXYW9BdXpSV3VDVXJpREdaVFcyV0k3WE5vL1IzajFxK2RYWEdwVWxMNDhta293dlJqTllsR3h5WUxJS0hIMS8rUEJ1MDFtM1M0dTlCSUdqU2dHWVRuRzlXdDNraXFGc3FZMTBYM1VidU5DNU5JdC9hblZJSmhKQWlmeW5paFlvVWFxZ29pcU9GVUpoMkNsTGFhRXlqTTI3ZEQ1c1VwQzZNSXk5ZG5YRmgxTktZVStNMEpuaE1EWWZUK1pzdUZydmtsN1hCSkJvbDhMR3RIazlzVmR3OUxOam9CZHlNdmNZNVAyNTU2VnJEUy9zMWpVVUdRU203K2prTFRkNVV4VkxlZDhWajBwaGp1QWpuSjhiejEycUdwUkpXQ2lwMVNoVktWUXB4eXFCNExuZXBjNGMwYTJFV25YRVRPV3FGYTNYa093YzFyeDFGb2pzTlFveXAwektYMUZLS0hvL0QyZFRiWEFELzRNa2VmKzZoTlQ1enFpK1QxdmpXbGRyZk9LdzVlOWdBc0ZrSm56MDk0RzkrYkVNR1FmakdlMVAvTjJlUGVIWjNsdEtMNXFpUWhiY2NuS0liNmtsUnVOS29JT0o4OTdCbHExZXpWaXI5VU5DUDdyMW9VaUNvUnZvZUtNekovZ0l6WU5MaVIxRTRhbHJlUEd3NXM5ZGdicW1MeXBGNldlQmpnZGRUTzFrSWZQcmtnTC8rMFRWMmVzcS9mTzJRbjNsMjE5KzVWak9QYTEzLzU0dmNkdTlXeForOWY1VXZQYlhGN3NUNThpdDdmUFB5RElQY1l5KzA3cUtwYVhHbHRSUThnd2h0Z0JmM2FrNzJBc09nOUZYcEYrbzlSU3BQalk3VTBabGFaTkk0aHcxY21iVitkUnA1NDZqaG1Vc1QzamlLMU5Gb290TjRDbDRtVG1vR2o2ZTd4bUdyRXY3V1k5czh1VjN5ajEvYTQydXZIZ0lrWDhxNThtWlh0MkhXcGxyMUp4OWU0KzkvZkpNLzJxMzVweS91c2QvWURkOVBVZDVRRjRLbWpxdEs3U2dQclJaODVsU2ZCMVpMZHZxQm5hcVF0UjRNZzZKT0VxUXhtSnI1SkRyN1RTb3YzeHExV0xhQ1NBY0UzRmpDZSs2bkg5Mm8rT2MvZEpyb3pxZi8wem0rOXVvaFpTbjBLcVhVUlRsNHM2Z3VJcWwvcnBTeUVIN2p0VU0rOVIvT0llNTg1WWRPOE9IMWtzYkkzZG54U085MEZhQWt4Ymh4OXFqaDNiRngwRmpxQk0yOGlhbGkxR1N5a3JxbWFJeGJZN2MyWGo5c2x3QUF5YVZscXFFOVZjcHpnV2NSUHJYVDR4OTkzdzcvN3EwanZ2aDdGNm1qMDZ2MFdEVHVHZzB4UjZMaDBYREx5VzRwNHFzazRkdm8vS1d2WCtUZnZ6M21GNTdjNXFtZEhvMHROU3VrT3NCRjVxV3Z1OUxrY3ZpVi9SbFhhbU1jalhGMHBqRXBwNGd1dEdaTW8vdTBkWTVpeW52dlRkdTBlK1lwUFhsblVrc0NBOVBvZkd5ajR1OCtzY25UWi9aNCtqdDdsTDB3RnpiRFkwZ2RvWW5RR0JKekpaTWtoRjdSSVFoNFNOS25JQ1pvcGZ5VEY2OXkwQnAvKzdFTnZ2VENIaS91MWZUVWx6bzBTZnJPYVRHWVl5cThONDI4TjJvNDFRdXNGRVlka3F4RjZ3a01tRm5xcEE1bWtiY09Hc3lnWlFFZWVOY3BMVjNSbkoxZTRPODhzY2x2dnp2aDZUTUhsRlU0bm12cmlJd2FaRlFud1cwQllzM3Y1ak84VUZncFlWakJNTXczVjBVb0N1WHBWL2ZacUpTLzhkRU5mdTdiVjdrMmk1Ukx5MGw5dnlPNVVTcmNpU2E4ZWRUeTRKcXhYaWt6YzIvTVJXUEd0ZXFZekhTL05zNVAybFJwbWN5cnRlT2xSakt4MnAwdmZuaURjK1BJTDMxbmp5SXMrYTJRaEwwOFJxOU9rRmxNWHd5NlFQL21MeEF6WkgrS1hCNGhlOU1VUkRwelJ5aFVlUHFWQTg1UFd2N2l3K3ZFcklpbG9JQXZkM2lXVFA3Q3hOaHZJdFBvekxKNWE4SzYwaS9HclhOcEZobEhpRWoyRWNtZDBuRVVvakY0WXJQaXlaMlNMNys4eHpSYTZtUTZnWTlxNU1vWW5iYkp4RFc1eUtReEpyUElaTnFtVngyVG4rWU5FVFBrMmhTOU9sNENHbEo3ZU5RYXYvcnFBWTl2bGp5K21meDc0ZHRkUitjSmR2WWt3N2cxTGs0ajB6YkoyTHBUNUJiU2EvUDBnWEdjUjhONWU5aDFEOHZCeTV3Ly84QWEvKzM4bUZmMjYwWHJKaURUQnRrZEo5L1YxTTVORzZOWENIL3lvWFdldkhQSXpyQmcxaHF2WDVueHUyY1BPSC9RVUlWVWp1S09ITTBRQlQ4eFJISXRMKzZjMmEvNS9Zc1Qvc3dESy96OHQyZVV2a2hqcVl0TWErZ3MxSUVMWStNajY4WXNLclc1RithcCtXOE5aZ2E3c3hhM2habDBwcjJzNWVqdzRGckJ3eHNsWHo2elIyMnBJT2xBT1M2TjVnS2JPMjEwbnJwcnlNOTk5aTZldW5Nb0oxZEtocVhRR2x5YnRKemRyLzFmZmZzeXYvYmNGWnBvbENIMXc3SS9nMkdGRHdzazNZNVI2L3ozODJQKzRaTTdQTFJXOHU2b1hmTHRwUE81d2pLZ2NHbVMydUNZWlMxY0VqclplR1RXUnZZYng4V0pzZnRTNXpzTFRUZm0vT0NKUG1mMmFzNlAyMFdaS01EK0ZLbFRFK0R1bU1Hbjcxdmxxei94b0R5NDFUOFdDTXNBcDFaTFRxMlc4dkhUQSs1ZHIvd1h2M0dCYWVNcFByampsMGZ3d0diYWhBd0l2RHVPdkhiUThLbWRIbWNQRzBxVnVkQ3BEazhhajVaMjZyQXhadEZTNysrYWZOcHk5M1BZcFBUa3VSVkw0UDZORlZSajhNbXRpaGYyYXNadDBrQ0tPSXJ1VFJGTkc5QkU1NDdWa2wvN3dnTTNDSHo5MVMrVW4vM3NYZktGajJ3UlFySVFKS1U2bWJaelNEY0lITlRHcS9zMWoyMlVjNzlldnR3V25WbVVoQVFkMURZZk9taXFZVk1oUDRxV1lGOFRmQWs0dnI3Y0xCVHVYUzE1NDdCbEduM3g5MWtEZFp4L3JsOHFQL1hKYlI3WkdYQzcxeTkrL2g1WnE1Um95VWxGQmZabng5TGNLRHBuUjVHN1Z3cjZoZDVZcGMwTENjRVRRTWRSOUR5WkFYV3pQRzlLdGZVTlRmOTFpamFIRTROQWNMZ3dibWs3bnhlUUhLazdJR0cxVkg3eTR5ZHVXMkNBZTlZclBuSEhJQWVscEcydG0yUHJpR2JzVGx0dzRVUXZwYXFicmJtcjJ4eW44WXdPbWFPSW9Kb21pbTJVRFBIY0d2RndZQ1VJMDF6amR2NE1JTTJ5UlVBWmxNZE9EZDVubkhiajlYMTNyYzBESTVDYThrNmUvS3pXb0FFR2hkeHlyY3ZmYWR1WVN1QThEUGpBa0k2S3BsSHQ4VHVEeGJrWk9oRDAvdzBzV3UwdHFldW1DMHk5YzVxSDNkNmV4cVdiYU9mRGtvZGdYWnkrMWEwRUdEV1JYaUVVR1VEb0FEeXZBaXcxQTYwSlI3WHhRYSt6MTVwVVV1Yi8yOUxjMlRNcVUrU3ViTmE4Ly8zZG9Rb2h1d3lvcUJKVVVJUXl5QnpqT3RaVkxBc3RjSzFPMWRkV0ZWREpnemhJOVhQK3ZBcU1HK08vdnI3L2dkWDl2OTQrVElFc1AxK3FZbm5BaG9xd1Zpa0Z3clhHRjlsajhaSDVXcEcwdGxKU09adW1wSjRFQ0dLc2hDU3RTQ282dXpuYjhxcEZoRWxydkRkdWVXaTlvSys2d01VRzVSd3pVb0ZSSGZuMTV5NS9JSUYvODZXcmZ2NndtVmQ0dU9PcjFkeUNIQmdFNWY2VmtzdlR5R0ZyTjFwbFJ5TEl3d0lreFNIcFN2M1F6WGRGV0MyVjRJNDZTTFp6a2VPSzZscStGL1pxSHR1b0dCUXBVZ01RQkZzcE05Q1lBc3ovZlB1SXIvenZTN2VsN1RldVR2blMxeTh3Ym1KYWJOZS9yNVoweXpDSDlWSjRlTFhrekg1OVV6UkdaREVwVkUvUTRYb2xoTFRFUk5Nb1JDZ1Nsc1JhcGFua1UrYVJXVVNPcWJ0VTRkbmRHUi9mcWpqWkR3dHdJRHErTTBpUndkTXM2ckNPL01MWHovSEx6MTcwSytQMnBzS2FPMy93enBILzlHK2Y5ZTljbml5R2J1YjRXaStWYm5RVEdEZzlESHhrcytTYlYrcWxhb3g1MWRiMTJVRlRXYnhTaFRUUmxEVG1LVUorVTJvYWRXNzFBOWZxaU5xQzRHTHV4d2RnQWkvdjFldzF4dWRPRDNqenFKMS9obDZKYi9TUlhKbVZxdXlPVy83ZWYzbVhQM2hyNUgvcTRYVWUydXF4M2dzMDBibHcxUEROY3lQKzdZdFhlZjNLbENJa3Y4TWNMd05zRCtnUWpHVGF3aDg3MmVld01jN3MxNVRIeURVT0pMUkc4L0JQQkhaNmdWNGU0NFpPNkRKQUZZUkJFRTcxbFRjUE80RnR5VCtXQUhwSlNNVnZuaDN4eFVmVytNL25KN3d6YWxMemFjRFdFRzhzQVFkWjhEbzYvL3I1WFg3cjVXczh0TjFqb3g5b1d1ZWRnNW9MMlllcnNLUmhGZnprRUM4RXlieVU2UERnU3NHUDNyM0NWNzk3bUxncVM0aHNFamtCQ1pyWlNRaWM2aW45a0VERE1pQ3FpYmNobFFqOUFLZDZnVXBJekozczA4ay9qN3RsRllSbkxrMjRPSTM4OUtQcmVZQ2ZYU20zaExaV2dhY05DaXIweXpSOWZQbnloR2ZlUHVLYjUwZnNqbHY2UlVJd0JTQWFYaWwrYWdVZkh2ZmxRdUV2ZkdpTks3UElIMTZlVW9YanVYeHUycklZK1pZcTNEVUk5QkpuSlVGUWhTYm5Ma09xYmpaN2dWT0RrS0dhRk9BNnpTNFBIalVqRlY5NWVaL1BuZTd6RXcrczBrYlA4NldVdm54bmlPMzBvVlNJaG5oNlZoVlMvT2dWbWdJUkxFeDRyWWVmV01GWGxnVk84UENQMzdQS2o1d2E4UFNyS2FVdHcxS3liSVVpODRCMXVoL1k3QVVHUlpxYUZBSWFKQkZXZWlyMGdyQlJLdmV0VnRsMzB3M1VPOFRxdUxaTGhiZU9HbjdwNVgzK3dTZTIrZlRwQVhWaml3SW5LTDdldzA2dFlEdERQQWU5TkwzUFRiem5EZHJzWVhlc3BVRFlMK1lDdXp0TjYvekk2UUUvOC9nbXYvTGFBVzhlTlZRM0VPWFNabXNPb0VFRlFYaHd0V0sxVkhxcTlFSWU4U1NDbWxLcFNUK0lyeFRLblFObHB4L1luVVlLZDF3Vjh6aHZBTG90RUVuMHBtOWNuTEorWnA5Zi8rRlQ4cGVmdWVUUHZEdW02dWw4MTcwcWtpbXRWY2xmWTlmalNWSjlUcUN1eHdGRGQ2ZWVHWis3YjRWLzl2MG4rT1V6Ky96K2V4TXE1UmlHTGhuTVVsR0NhcUplcUxCZEtYY01sWlZDeUd3a1NabEtoQ0F4VVphQ01Temd4S0RnNGJXU0sxT2pFQ2RtMHNxQ1JySEF5MVNFUXAzLytNNlljWXQvN1RPbjVFdi81NXIveWt2N1NKbjRIL05CWEJBSWtBYm1OMTdMMmJhT2p0ZkdYMzFpazUvOXhMYjgvTGQyL1grOE43MWhzaWxMcVVwRlVDeFpxTU9IMTlOMFk5Z0pIWVJDbkVJeHFpRFVCa01YbVFUMXpSTHVIWmE4MmF1NU9JV3lDRmdUYzFHVVowaTU3bDRXL0hjdmpIbDdWUHVYdi84a1AzYmZDbi90bVYzZTNadEJGYTR6UjFsVzU3SG9XMXY2NSs2dGtsLzkvRjNjM1EvODFPOWQ5TE5IVGFKTFhUL0tkVU5SUWxlUGg4UWtQTlVMM0w5YXNGa3FnNkQwZzBoVktKV0NxaWdxU2hXY3ZnUldDbUdsZ0h0V0FoL2I2bE5LU0RkVUpSU0NobzViWU1jZXJpSlVDbThjdHZ6bzc1em41YjJHNTM3c0h2bnFuN2lMSjNkNjFMVlJONGxKV0p0Ungvd3lUNzlyakxvMm5qclI0emMrZjVvWHZuQ2ZQSDl0eHAvK25mTzhOV29vYnlLdzVMbTRCaWNVUWdoT0tVbjRKN1o3M0RFc1dRbktzQlFHS3BUcWlDalNSS1AxdEpocEZQWWI0OW9zK3U0MGNtN1M4b2VYWjN4bnIwN2tPWVRHbk1ZY2l3YTZtRXQzNXRsVlRaUFcyQ2dML3NxamEvejRmU3RpRHQrNE9QWG5yczU0ZTlTd1Y2ZWxiMWJDZlNzbFQyMzMrT04zOUVXQTMzcHI1UC9pMVgwT2EyZWxYTVNQNVRDcUdGZ2k0YVFaZE9LUGxRcVBiMVg4d0U2UHUxY0xUbFNCclY2UTlWTHBxOU12QkVtZ2ZoSmtGcGxUcDY1TUUrUHZ1NGVSWnk1UE9UOXVFald5TldveUV5a21rcHhuQnNMMWMycHpaeHdkZGVmak8zMSs0RVNQajZ4WDNMa1NXQzhENE93M3pvVnh5NnNITlgrME8rWDVxdzNtempBa3p1ak5lRWpxS2YxcFNOVG9BcWNxa21uZk15ejQ0Wk45SGx3TjdQUUxkbnFCdFZKbHBWQjZJWlhRQmU2SlM2MkphamdJUW1zaXE1VjZiWUg3VjVWUmEweGlvakI1a1dqUDBRU0NZdEZRV1c3bXMwWnlqbC9MTVBETGV6VXZYSnVsVVcrMmhxU3haTFpCRTh0M0VKaFhXUjJDMHhuMS9PZXl3T3FVbW5Md2RoWDQ1SGFQKzFaS1ZxdlVRSFU4MGpKajZnb3Bla2RQL2Fab3lpVERvRVNRYU83UmpVZldTeVptUEhkbHhuNmRLQThObnVoSVFUT3JLUGZWU3hqMGN0bGFCYWh1QStWWWhxcVdoZTFnYUVVSllXbWpWS2xVMkN5RnA3WkxQclJhWkNLdHNsYXFESUxTeTZaZmRKU3FGSVFTc0pkTFVpd2syRFJXS3RFU29Qalllb1daOE1LMUtkZWF4T1FSSEhXaEpiTVQ1aXZPd2k5TlJtNFhTVmdNOVh3QkR1YW5hYTYwUXFaUWxxbVdacXRTbnR6dThkSE5pczFlWUwxUzFndVZRU0gwczc5M3pZZjRFazJ5U3oxQm9YSW5JcXlnZUlXWTRHNkJKN2JUUTE2NE9tTjNsc0NITmlidVpuU1pUeFZpbHJKYjlQVWJjR3MxK3h6UzZiNGpJZ1E2QUNEbjJTQnpydmVKbnZLSjdSNlBycGRzVjhwbXBXeFVLaXVsSm9GemJOQ2xMSG1NTWRpMXBxS0M1WWRhSVNsQ1o5cmg0eHM5K2tGNGFhL20zRkhMTEhjMU1SOWZjTTlkVVc1U0xFTXYwb0VDMTZ2VWwvNDdGM1JCWkJVODEvOU9JZWw5cWRCWDRaN1Zrc2ZXU3g3YUtOa29ReEk0a1dQcDU3SzY2eTJXMis0Q09tWmZ4OGxNUXBlV3VvUEVMWEVSM0lNYWhTZ2ZEUlhyWmVDVmFzYnJCeldIcmREbVNpaGFZaGE1Q0dhSk91MFpkNXJ6UkhQMDcveDl6aXRjWXV5cWVJcmVlYmlncWhTZTZvWDFTbmhrdmVUUmpSNTNEUklMZUtPU0ZLV0RNcGhYWDdsaDhpVVo1VHJ6N2paQXV4WUxoM3hvUkFpU0NHN3VpZENTSG5SSFAvREdZY3Vib3liUkhrZ3RZRFFuNW9tbGlXYWFoV1NheFJJUzA1M0I2RFNzQW02WkFleUpDRWM2bjFHSjhNQmF5Y05ySmZldEZteFZLV2l0bGNwYUtUTG9CQzZVTXRmZnk4ZEZibXJlbmRCay82WWo1aFVaZmpHbEVKTkMxQ3QxZWxxd1hnaW5od1VQVEVyZU9xeDU2OGlaeEpheTZMZ3FpYWhqb2huelNoendlWFBoanFoa1RFN21ITzBnaWVpT3c2QlE3bDlSSGxndHVYTlljcXFuREl0TWNpOGtrOXd6VUpEUGZpUS83Z3FiNjJTODFXbWRaV0pNT242VUN4aHpwbTBxT3NhTit5Z1Q0STlTSmNlVjJubG5OT1A4eE5pZEdHMzJZODlISTl6bnlhMHo5S1VwU2VxVUJLZlFOTEs1ZXhpNGQ5aGp1eWRzOXdQRFFsa0ppY3crTEVXR1FSZ1VNcWRUTFNLMTNCSy8vNTVIbERvZzMwbnpJOHRjc2NaZ1pzNnN6WXovVE5LWlJtZHF6djdNT0l6TzRTeHl0WWxjbXJUczE4NG9KdjU0YThlTGswS1RFS3NsYkpTQmt3TmxweXhZcllUMU1nV25LZ3MzQ01Jd2FEcTRrZ05Xa2NHQklwL2I2clI3eTRIRit4NUc4NVREelZJWVNrY2M4aXpKblRvYU00TlphMHdpUG8zR0xFS05VN2RwRXhaOGovUnE4L2ZKL3A4V25JQ01LcVEyc0s5SnFCS2hGNkFmbEVHQjlMSVpkN1YyRjUyRGtBNm1lWjVWZlkvc2VGc244Q3dIbWtSZU55eUNrdzZpdFpuM1hWdnVtSkpnUHZNMG42NHQwWmpTd2JUTUNuU2ZqNEs3QXlwZHBLMVVDS3BVNmducHlCaGVUenNUVmdwTm5WVElRVlpESXZTR3ZOYjNPMzE0VzBJZlUzdytZK201RURFZ3hrZ1VKVnFrYmdXVGhUWWJpN1NtdE80ZU0yRTljVmtXUHQxaGNTR2pHb1drSTRhZEZhZ0xWZUVFRFFRM1FnanBYRVpYWmMxWjBJdmpoOS9yK3I5YzN3THQ3SVBJT0FBQUFDVjBSVmgwWkdGMFpUcGpjbVZoZEdVQU1qQXhPQzB4TUMweU5WUXlNam8wTXpvd05pMHdOVG93TUZDemtDb0FBQUFsZEVWWWRHUmhkR1U2Ylc5a2FXWjVBREl3TVRndE1UQXRNalZVTWpJNk5ETTZNRFl0TURVNk1EQWg3aWlXQUFBQUFFbEZUa1N1UW1DQydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgdmlhcG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgd2F5cG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiBmYWxzZSB9LFxyXG4gICAgICAgIGF1dG9VcGRhdGVNYXBWaWV3OiB0cnVlLFxyXG4gICAgICAgIC8vaXRpbmVyYXJ5Q29udGFpbmVyOiAnI2RpcmVjdGlvbnNJdGluZXJhcnknXHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgLy9kaXJNYW5hZ2VyLnNob3dJbnB1dFBhbmVsKCdkaXJlY3Rpb25zUGFuZWwnKTtcclxuXHJcbiAgICAgIGNvbnN0IHdheXBvaW50MSA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLldheXBvaW50KHtcclxuICAgICAgICBsb2NhdGlvbjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGxvY2MubGF0aXR1ZGUsIGxvY2MubG9uZ2l0dWRlKVxyXG4gICAgICB9KTtcclxuICBcclxuICAgICAgY29uc3Qgd2F5cG9pbnQyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuV2F5cG9pbnQoe1xyXG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZW5kTGF0LCBlbmRMb25nKSwgXHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICBkaXJNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50MSk7XHJcbiAgICAgIGRpck1hbmFnZXIuYWRkV2F5cG9pbnQod2F5cG9pbnQyKTtcclxuXHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKGRpck1hbmFnZXIsICdkaXJlY3Rpb25zVXBkYXRlZCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy90aGF0LnBhdGhMYXllci5jbGVhcigpOyBcclxuICAgICAgdmFyIGFsbFdheVBvaW50cyA9IGRpck1hbmFnZXIuZ2V0QWxsV2F5cG9pbnRzKCk7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgZnJvbUFkZHJlc3MgPSBhbGxXYXlQb2ludHNbMF0uZ2V0QWRkcmVzcygpO1xyXG4gICAgICB2YXIgdG9BZGRyZXNzID0gYWxsV2F5UG9pbnRzWzFdLmdldEFkZHJlc3MoKTtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IHJvdXRlSW5kZXggPSBlLnJvdXRlWzBdLnJvdXRlTGVnc1swXS5vcmlnaW5hbFJvdXRlSW5kZXg7XHJcbiAgICAgIGNvbnN0IG5leHRMb2NhdGlvbiA9IGUucm91dGVbMF0ucm91dGVQYXRoW3JvdXRlSW5kZXggKyAxXTtcclxuXHJcbiAgICAgIC8vIEdldCB0aGUgY3VycmVudCByb3V0ZSBpbmRleC5cclxuICAgICAgY29uc3Qgcm91dGVJZHggPSBkaXJNYW5hZ2VyLmdldFJlcXVlc3RPcHRpb25zKCkucm91dGVJbmRleDtcclxuICAgICAgLy8gR2V0IHRoZSBkaXN0YW5jZSBvZiB0aGUgcm91dGUsIHJvdW5kZWQgdG8gMiBkZWNpbWFsIHBsYWNlcy5cclxuICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnJvdW5kKGUucm91dGVTdW1tYXJ5W3JvdXRlSWR4XS5kaXN0YW5jZSAqIDEwMCkgLyAxMDA7XHJcbiAgICAgIC8vIEdldCB0aGUgZGlzdGFuY2UgdW5pdHMgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHJvdXRlLlxyXG4gICAgICBjb25zdCB1bml0cyA9IGRpck1hbmFnZXIuZ2V0UmVxdWVzdE9wdGlvbnMoKS5kaXN0YW5jZVVuaXQ7XHJcbiAgICAgIGxldCBkaXN0YW5jZVVuaXRzID0gJyc7XHJcblxyXG4gICAgICBpZiAodW5pdHMgPT09IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuRGlzdGFuY2VVbml0LmttKSB7XHJcbiAgICAgICAgZGlzdGFuY2VVbml0cyA9ICdrbSc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gTXVzdCBiZSBpbiBtaWxlc1xyXG4gICAgICAgIGRpc3RhbmNlVW5pdHMgPSAnbWlsZXMnO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBjb25zb2xlLmxvZygnbGFzdCBab29tIExldmVsJyttYXBab29tTGV2ZWwpO1xyXG4gICAgICAvLyBUaW1lIGlzIGluIHNlY29uZHMsIGNvbnZlcnQgdG8gbWludXRlcyBhbmQgcm91bmQgb2ZmLlxyXG4gICAgICBjb25zdCB0aW1lID0gTWF0aC5yb3VuZChlLnJvdXRlU3VtbWFyeVtyb3V0ZUlkeF0udGltZVdpdGhUcmFmZmljIC8gNjApO1xyXG4gICAgICBkaXN0YW5jZURhdGEgPSBcIjxsYWJlbCBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsgZm9udC1zaXplOjMycHg7Jz5cIisgZGlzdGFuY2UgKyAnJm5ic3A7JyArIGRpc3RhbmNlVW5pdHMgKyBcIiwgPC9sYWJlbD4gVGltZSB3aXRoIFRyYWZmaWM6IFwiICsgdGltZSArIFwiIG1pbnV0ZXNcIjtcclxuICAgICAgLy8gLy8gaW5mb2JveC5zZXRNYXAobWFwKTsgIFxyXG4gICAgICAvLyBpbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAvLyAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihlbmRMYXQsIGVuZExvbmcpLFxyXG4gICAgICAvLyAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgLy8gICAgIG9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDAsIDQwKSxcclxuICAgICAgLy8gICAgIGh0bWxDb250ZW50Oic8ZGl2IHN0eWxlPVwibWFyZ2luOmF1dG8gIWltcG9ydGFudDt3aWR0aDo1NTBweCAhaW1wb3J0YW50O2JhY2tncm91bmQtY29sb3I6IHdoaXRlO2JvcmRlcjogMXB4IHNvbGlkIGxpZ2h0Z3JheTtcIj4nXHJcbiAgICAgIC8vICAgICArIGdldFRpY2tldEluZm9Cb3hIVE1MKGluZm9Cb3hNZXRhRGF0YSwgZGlzdGFuY2VEYXRhLCBmcm9tQWRkcmVzcywgdG9BZGRyZXNzKSArICc8L2Rpdj4nXHJcbiAgICAgIC8vICAgfSk7XHJcbiAgICAgICQoXCIubW9kYWwtY29udGVudFwiKS5odG1sKGdldFRpY2tldE1vZGFsSFRNTChpbmZvQm94TWV0YURhdGEsIGRpc3RhbmNlRGF0YSwgZnJvbUFkZHJlc3MsIHRvQWRkcmVzcykpO1xyXG4gICAgICBqUXVlcnkoXCIjdGlja2V0bW9kYWxcIikubW9kYWwoe1xyXG4gICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcclxuICAgICAgICBrZXlib2FyZDogZmFsc2VcclxuICAgICB9KTtcclxuICAgICAgdmFyIHhmbGFnOiBudW1iZXI9MDtcclxuICAgICAgJChcIiNtb3JlRm9ybUNvbnRlbnRCdG5cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnY2FsbGVkIGNsaWNrJyk7XHJcbiAgICAgICAgaWYoeGZsYWcgPT0gMCkge1xyXG4gICAgICAgICAgJChcIiNpbml0Rm9ybUNvbnRlbnRcIikuaGlkZSgpO1xyXG4gICAgICAgICAgJChcIiNtb3JlRm9ybUNvbnRlbnRcIikuc2xpZGVUb2dnbGUoIFwic2xvd1wiKTtcclxuICAgICAgICAgICQoXCIjZHVtbXlpbWFnZVwiKS5hdHRyKFwic3JjXCIsXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJnQUFBQVlDQVlBQUFEZ2R6MzRBQUFBR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBQXlKcFZGaDBXRTFNT21OdmJTNWhaRzlpWlM1NGJYQUFBQUFBQUR3L2VIQmhZMnRsZENCaVpXZHBiajBpNzd1L0lpQnBaRDBpVnpWTk1FMXdRMlZvYVVoNmNtVlRlazVVWTNwcll6bGtJajgrSUR4NE9uaHRjRzFsZEdFZ2VHMXNibk02ZUQwaVlXUnZZbVU2Ym5NNmJXVjBZUzhpSUhnNmVHMXdkR3M5SWtGa2IySmxJRmhOVUNCRGIzSmxJRFV1TUMxak1EWXhJRFkwTGpFME1EazBPU3dnTWpBeE1DOHhNaTh3TnkweE1EbzFOem93TVNBZ0lDQWdJQ0FnSWo0Z1BISmtaanBTUkVZZ2VHMXNibk02Y21SbVBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHhPVGs1THpBeUx6SXlMWEprWmkxemVXNTBZWGd0Ym5NaklqNGdQSEprWmpwRVpYTmpjbWx3ZEdsdmJpQnlaR1k2WVdKdmRYUTlJaUlnZUcxc2JuTTZlRzF3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzaGhjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUlNaV1k5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVkpsWmlNaUlIaHRjRHBEY21WaGRHOXlWRzl2YkQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVOVE5TNHhJRmRwYm1SdmQzTWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVGhHT1RZNU9USkVRek5CTVRGRk9Ea3dNakE0TTBReE1qRTNNMFl5TlRraUlIaHRjRTFOT2tSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9UaEdPVFk1T1RORVF6TkJNVEZGT0Rrd01qQTRNMFF4TWpFM00wWXlOVGtpUGlBOGVHMXdUVTA2UkdWeWFYWmxaRVp5YjIwZ2MzUlNaV1k2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNU9FWTVOams1TUVSRE0wRXhNVVU0T1RBeU1EZ3pSREV5TVRjelJqSTFPU0lnYzNSU1pXWTZaRzlqZFcxbGJuUkpSRDBpZUcxd0xtUnBaRG81T0VZNU5qazVNVVJETTBFeE1VVTRPVEF5TURnelJERXlNVGN6UmpJMU9TSXZQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QdjNSSHdnQUFBRjdTVVJCVkhqYXZKWkJad05CRk1jbkZjMG5LR0VvT1lXbGhIeUpzQ3c5NVdQc0taUjhraUhYc1BUUVMzcHBKZCtnbEZKS0xpVTk5ZExxS1lUcG0vb1B6NWpkblVtbmZmeVduWjM1LzNmZTdNemJqbWdPU1Z3U09YRkdqTkQrU0x3VHQ4U04xdnBOUkVhZlVNU0IwQzBjMExkUFJzTEZGeFBpaXdsVXhKUVlFMTB3Umx2Ritwa3hremFEa2cyNEpyS0EyV2JvYThlVmRRWUZTOGs4TkpkTWFNNVNWcmdHWmpFLzBFSEZMSmJ6dGdvYVJrdHlBOFh5TFk0MWdLQmRGMlVOemxscXNnUUdHVXVWMFJaWGFGaUtJNkxtMDF4QzAyaUxOVzV5a1NCZ2tFUHp6bnpUUTdZN2VWd1FweEhhbjhUVzBmcEorUjV1UFdmQWE4QXU1cXpZREhwbzIzY2IzdWdKNTAxb2JPc2U3T0FtRTY2QmhPYnVoQzR2ZURaSzhSVTVXcy9HNEI0M1U1RXVyTmJHWEFaL3VORUcvM0pVMkVXeE5XRDJpOE51eG1xRDlCM1hPdGJFSTY1OXg3V3Y0RlJzbHpmRjBLbHNaVnZKTEJwS3BvMjZrbG1FMUdTN0pvdUlvcit3T1hmcFJQNjIyRms4aFA2MmZBc3dBSmVlWmFBbldTdWZBQUFBQUVsRlRrU3VRbUNDXCIpO1xyXG4gICAgICAgICAgICB4ZmxhZyA9IDE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmKHhmbGFnID09IDEpIHtcclxuICAgICAgICAgICAgJChcIiNtb3JlRm9ybUNvbnRlbnRcIikuaGlkZSgpO1xyXG4gICAgICAgICAgICAkKFwiI2luaXRGb3JtQ29udGVudFwiKS5zbGlkZVRvZ2dsZSggXCJzbG93XCIpO1xyXG4gICAgICAgICAgICAkKFwiI2R1bW15aW1hZ2VcIikuYXR0cihcInNyY1wiLFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCZ0FBQUFZQ0FZQUFBRGdkejM0QUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUF5SnBWRmgwV0UxTU9tTnZiUzVoWkc5aVpTNTRiWEFBQUFBQUFEdy9lSEJoWTJ0bGRDQmlaV2RwYmowaTc3dS9JaUJwWkQwaVZ6Vk5NRTF3UTJWb2FVaDZjbVZUZWs1VVkzcHJZemxrSWo4K0lEeDRPbmh0Y0cxbGRHRWdlRzFzYm5NNmVEMGlZV1J2WW1VNmJuTTZiV1YwWVM4aUlIZzZlRzF3ZEdzOUlrRmtiMkpsSUZoTlVDQkRiM0psSURVdU1DMWpNRFl4SURZMExqRTBNRGswT1N3Z01qQXhNQzh4TWk4d055MHhNRG8xTnpvd01TQWdJQ0FnSUNBZ0lqNGdQSEprWmpwU1JFWWdlRzFzYm5NNmNtUm1QU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh4T1RrNUx6QXlMekl5TFhKa1ppMXplVzUwWVhndGJuTWpJajRnUEhKa1pqcEVaWE5qY21sd2RHbHZiaUJ5WkdZNllXSnZkWFE5SWlJZ2VHMXNibk02ZUcxd1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JTWldZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlZKbFppTWlJSGh0Y0RwRGNtVmhkRzl5Vkc5dmJEMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTlROUzR4SUZkcGJtUnZkM01pSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RJMFJqVkZOalpFUXpOQk1URkZPRUZFTVRJNFFVTXpPRE5EUkVSR1FrTWlJSGh0Y0UxTk9rUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPVEkwUmpWRk5qZEVRek5CTVRGRk9FRkVNVEk0UVVNek9ETkRSRVJHUWtNaVBpQThlRzF3VFUwNlJHVnlhWFpsWkVaeWIyMGdjM1JTWldZNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzVNalJHTlVVMk5FUkRNMEV4TVVVNFFVUXhNamhCUXpNNE0wTkVSRVpDUXlJZ2MzUlNaV1k2Wkc5amRXMWxiblJKUkQwaWVHMXdMbVJwWkRvNU1qUkdOVVUyTlVSRE0wRXhNVVU0UVVReE1qaEJRek00TTBORVJFWkNReUl2UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUGxoT3N1WUFBQUd4U1VSQlZIamF0SmJCU3NOQUVJWVRMZm9FaFVJZzBGTWhJQlI2OVNRSUJTSGdxZEFIRUR6bDVLbmdZd2lCOWxvQ0hyem9TZkFOQkVFSUNJV2kxSk1YeFZPaEVQK1ZHUmpYVGJLSmNlQkwwMlQzLzdPejJaMjRUbkY0NEJnY2dUYm8wL1VIOEFadXdGV1daYTlPeGVpQUdHeEFWc0tHMm5aZzVPaVlZZ2craFVBQ1JtQUFXc1NBcmlXaW5lb3pMRE9JUklkTEVGaU1OcUMyM0MvS013aEZTaWEydVJSQ0U1R3lVRGRRay9sT0RlSUN2WDF3SWtlbVBXMU1Ha3JMa3dheHlIZFJYRkM3VTVNQkNmSzh4R3pnaTlRRURSZ0VJbFgrRmc1anNBM21JSFgrR0RCSlNVdHBqcFhCSWQyYjF4RjBYZmNIbXRhQmVxZDdZblhLMkFNNzJyVTIvZnEwRm1SOGdJV205WjN5TmVWc1YrdndiTEdLSmRjOEo2U2xUdGF0Z3RFLzBuNGp3NmRSdkJqdUxmS0VWdVRtV2FUODExdGtXbmlrcFU1V2FwS2Y2RjYvNWx0ajJudFlLMVVHdC9SbjVEUVhySFduRHQxL1hHaGROWUlsbUZINzh3YWVualZtTUZ6S3pZNXJ3Rm5kT2FDK1hCczgwM2FkVlRVeGlHZW03ZHBVY0JLeHlvdWlwMVcycUt4a2hnVWxreU92WklZMk5abm5aRnFoNkU4NTV6cHV4YzhXSHNXOTdXZkxsd0FEQUVlRFVxMkRWWThNQUFBQUFFbEZUa1N1UW1DQ1wiKTtcclxuICAgICAgICAgICAgeGZsYWcgPSAwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgJChcIi5jbG9zZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgIGRpck1hbmFnZXIuY2xlYXJBbGwoKTtcclxuICAgICAgICBtYXAubGF5ZXJzLmNsZWFyKCk7XHJcbiAgICAgICAgbWFwLnNldFZpZXcoe2NlbnRlcjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGVuZExhdCwgZW5kTG9uZyksIG1hcFpvb21MZXZlbH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgJChcIiN0a3RJZFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgIHBpbkNsaWNrZWQoaW5mb0JveE1ldGFEYXRhLCAxKTtcclxuICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBkaXJNYW5hZ2VyLmNhbGN1bGF0ZURpcmVjdGlvbnMoKTtcclxuICAgICAgXHJcbiAgICB9KTtcclxuICAgIH1cclxuICAgXHJcbiAgICBmdW5jdGlvbiBnZXRUaWNrZXRNb2RhbEhUTUwoZGF0YTogYW55LCBkaXN0YW5jZERhdGE6IGFueSwgZnJvbUFkZHJlc3M6IGFueSwgdG9BZGRyZXNzOiBhbnkpOlN0cmluZ3tcclxuICAgICAgY29uc29sZS5sb2coZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICB2YXIgd29ya1NldmVyaXR5Q29sb3I6IGFueSA9IFwiI2NmMmEyYVwiO1xyXG4gICAgICAgIGlmKGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJtYWpvclwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHdvcmtTZXZlcml0eUNvbG9yID0gXCIjMDA5ZmRiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcIm1pbm9yXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcIndhcm5pbmdcIiB8fCBkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkgPT09IFwidW5rbm93blwiKXtcclxuICAgICAgICAgIHdvcmtTZXZlcml0eUNvbG9yID0gXCIjMTkxOTE5XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkaWFsb2dEYXRhID0gXCI8ZGl2IGNsYXNzPSdtb2RhbC1oZWFkZXInPlwiXHJcbiAgICAgICAgK1wiPGg1IGNsYXNzPSdtb2RhbC10aXRsZScgaWQ9J3RrdElkJz48YSBocmVmPSdqYXZhc2NyaXB0OnZvaWQoMCk7JyBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IGNvbG9yOiMwMDA7Jz5cIisgZGF0YS50aWNrZXROdW1iZXIgK1wiPC9hPjwvaDU+XCJcclxuICAgICAgICArXCI8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3M9J2Nsb3NlJyBkYXRhLWRpc21pc3M9J21vZGFsJyB0aXRsZT0nQ2xvc2UnPiZ0aW1lczs8L2J1dHRvbj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nbW9kYWwtYm9keScgc3R5bGU9J21heC1oZWlnaHQ6NTIwcHg7IG92ZXJmbG93LXk6YXV0bzsnPlwiXHRcdFx0XHRcdFxyXG5cdFx0XHRcdCtcIjxmb3JtIGNsYXNzPSd0a3RGb3JtJz5cIlxyXG4gICAgICAgICtcIjxkaXYgaWQ9J2luaXRGb3JtQ29udGVudCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrOyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+U2V2ZXJpdHk6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnIHN0eWxlPWNvbG9yOlwiK3dvcmtTZXZlcml0eUNvbG9yK1wiPlwiKyBkYXRhLnRpY2tldFNldmVyaXR5ICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkNvbW1vbiBJRDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIitkYXRhLmNvbW1vbklEK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+QWZmZWN0aW5nOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmN1c3RBZmZlY3RpbmcgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+U2hvcnQgRGVzY3JpcHQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnNob3J0RGVzY3JpcHRpb24gK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTExJyBzdHlsZT0nYm9yZGVyLXRvcDoxcHggc29saWQgI2RiZGJkYjsnPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEyJz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGlzdGFuY2REYXRhICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS0xJz5cIlxyXG4gICAgICAgICtcIjxpbWcgc3JjPSdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJrQUFBQWFDQVlBQUFCQ2ZmZk5BQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFBSmNFaFpjd0FBRHNNQUFBN0RBY2R2cUdRQUFBTmZTVVJCVkVoTHpaWGRTMU54R01mN2V5THJ3Z3lNYmdJaFVldkNpS0M2elFnVVJmUkN3N0FYS25xakVvdUlVQ3pxSWxBVU13akJoQzRxckwyMjl2N1czTTdjZEp1Yk8zczUyN2ZuOXp1blUzdmZ1cEErTURhZTM5bnZlMzYvNS9zOHp4N3NBditIU0Y2U2tFdWxJTzNzUUVva0lNWGovSGN1blVZK2wxT2VxazVWa1R4OUVrNG5oUGw1dU8vZmgrdkdEVGl2WFlQM3lST0VscGVSWEYrWEg2eEJXUkcyK2JaV0MvZllHQ3dYTHNEUzN3L0g5ZXR3UDNvRTE3MTdzSTJQdzl6YkM4dTVjL0JOVENCaHNjaC9yRUNKU0M2YlJXUjFGYzdSVVJpT0g0ZTFwd2MvYWZQUSsvZUlmdjJLeUpjdkNMS1QzYndKODhtVE1KNDZCVGNKYzZFOGU3MVNDa1R5SkJEOTlnM21zMmVoTzNJRTY2OWVJUk9KS0t1bGlINC9YRmV2d2tCaXRwRVJwQVJCV1Nta1FFVDBlR0RxNm9McHpCa0lzN004d2RWZ2ljOXViOE0vUFExOWR6ZGN0Mi96UFlwUlJUTFJLSUp2MzBMZjNnN2Y1Q1N5TlFUK0p1bDJ3ME5YcGo5NkZPSEZSU1g2QjFVa1lUVENPamdJR3lVN2JqQW8wZnFKNi9YUXRiYnkvS1UyTnBTb2pDcXlSVytnMmJzWFFicW1UQ3ltUk9zbkV3N0RPandNQnhraTh2bXpFcFhoSXN3VHdSY3ZvTm0zRHpGeVQzbVBWSWNWcVc5bWh0OUVjRzVPaWNwd2tXd3lDZi9UcDlBZU9BRFI0ZUFMalNMUkhodnYzc0YrK1RLRTE2K1ZxQXdYa2FodEJKNDlnM2IvZm9oMk8xOW9GT1pFWVdFQmRpcFU0YzBiSlNxajVpUk11ZEEwTldGclpRVVM5YVZHeVpJN1BROGZ3a1luQ1MwdEtWRVpWU1Q2NFFOMHg0N0JTeWNTZlQ0bFdqL3BRSURYbC92dVhjU0wyb3dxa3FSY09La0JtazZmeG1iUm05UkNFa1dFS0IvYXc0Y2h2SHpKci85dlZCRjJSZEcxTmVqcFFmZWxTMGlXcWR4S1JENStoR1ZnZ0w5ZzdOTW5KZm9IVllTUkk0ZXc0K283T21DbnpwdmUzRlJXS2hPaklyYjE5VUYzNkJBMnFiRXlseFZUSU1JUWFVYTRidDJDdHEwTlp1cEhmcXFmdU0yR0hBMnYzMlRJU2RzbUUveFVGOTlQbk1BUE9nR3pMZXRqNVNnUlljUnBnNThQSHNCTWlmeHg4U0ljMVBaOWQrNGcrUHc1QW84ZncwT3p4VDQwQkF0OXJPZlBRNWlhUW9hbVppWEtpakJZMWNlb2h6bXZYSUd4c3hQNmd3ZWhhMjZHcnFXRmY1c294aVprZ2d4VHEwTlVGR0h3K1U3T1lUVWdlcjJJYVRTOGVhYkk0amsyNThsRjljejVxaUxGc0tuSmhCdWxJWkYvWlJkRWdGODMybjRzaHY3TW9RQUFBQUJKUlU1RXJrSmdnZz09JyAvPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tMTAnIHN0eWxlPSdib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZGJkYmRiOyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGZyb21BZGRyZXNzICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tMSc+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlx0XHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEnPlwiXHJcbiAgICAgICAgK1wiPGltZyBzcmM9J2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQnNBQUFBWUNBWUFBQUFMUUliN0FBQUFBWE5TUjBJQXJzNGM2UUFBQUFSblFVMUJBQUN4and2OFlRVUFBQUFKY0VoWmN3QUFEc01BQUE3REFjZHZxR1FBQUFOUlNVUkJWRWhMdlpWTFNGUlJHTWVOaXFLMnRZd1d0Vy9ScHFpZ0NDSkNpQlpGVUZuTGFGRXRhcEVTR0JpVlJSU0NDR1V2Tlcxc0xOTlNrMTRxdlN3ZEg0MlBlVHVQYS9OK09DL3Z6UHo3M3hpdE85NFp4d2gvY09CeTdqMzNmODczUDkvM0ZXQVJXWkRZZEN5QmNFVEVWSGdhU0NUVHMva3pyNWc5RU1kSFd4alZXajlLZTEyNCtNV0prczlPWE81ejQvNVlBTjhjWVFTNGdYeklLcGJpTUhwanVOUHJSRkd6QlJ0ckRWajZVSTlWTlFhczVsanlRSSsxTlhxY2Vqa0J0ZFlMaXorT2xMUW9CMW5GbWtmOU9Qak1qQzMxQmx6ckVmQmFGOENRS3daN1dNVFBhSUxQVVR3Wjh1SnNteFZySHVseG9NTU8zV1FrdlZvWlJiRm5GRHI1MG9xaUZ4WlVEM294eWg5SDZGY21mZ3IzTVl5WEdOYWRQUDIrTmh2RytHMHFxWHhFdVJpL01URjBoN253R0lXZS92QkJGT2UvQ0JHS2x0SExEZlZHWFB2MEV4TU1xUkl5TVNFWXgxMTZ0STJocTlKNGtCRG5NZUV2Ykw0WUtpaTBpVDQrMXdmVHMzSmtZcjJPQ0k0K3Q2RDBuUU1EUXU3NEs2R2haNXZyRENpbnFOMDM5M1F5c1NaakNPdTVzNFpoNzI4L0ZvcWJLWENtMDQ2TGJ4M29NczA5blV5c1V1dmpsZGFoeHg2bWYvbUhjSWFwZUJMMUdqZEtLS2dhOXFWbi96QXJGb21LdVBMZGhaVzh4dm9nSzhRL0VKNU9vcFU1ZDZIVGh0cEJUM3IyRDdOaUluZDFvOStERlV6Y0FYY3NQYnN3cEpNMURYbHd2c09LUndNNXhDU3FSdnhZY204Y25lWVFVbmxjK1V5Q3pNV2JQWk1vZm0xREszTTFFNWxZeThRVTF2RTIzZnJxaEQxTHJ1UmlJakNOL2J6TlpWMENmZ2owUFFPWm1KVFE1ZDBDQ2h0TmFNbVNLOWtRNlZlN01ZaGx2R0MzV1hXU0NwR1JpWW1KRkRRc1A5c2JqRGpOVUdqNW5DOXRGTnJYWk1ZaFZwNnZXZGJKeENSQ05Qa0trM0tYMm9RakhUYjBNUTJVZGpsRGxENDFzMGdmZTJYRmJtNnlmY3lQa0VJZGxaZ2pKaUd3OUp4NEwyRDlZd1BPUzJZYmdoaG5SZkF3MFFPcytINE9GNTlIUFRHb1Jud29aSGZZb3pLaWdsN0hjbXhNVVV6Q3cyNnNacEx2Vlptdy9MNE9XOVZtWEtmeGRmMXVQUGptUXZFYkIzYndYUUhmSFdlYmVhOFBJRTRiY3BXQ3JHSVNRWjZnbHpXeWtnbDY5ZU1reWxneno3VmJmeWR0S1V2U0RZYTdabHpxYzJ4QkRQOTg1QlNiSVVZUGpQemhCOWE3UnJZZHFiRjJtNE13ZTZMcEwvSWpMN0gveFNLS0FiOEE5TUtYQU9nRTQyZ0FBQUFBU1VWT1JLNUNZSUk9JyAvPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS0xMCc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIHRvQWRkcmVzcyArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEnPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCI8L2Rpdj5cIlx0Ly9lbmQgaW5pdGZvcm1cdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGRpdiBpZD0nbW9yZUZvcm1Db250ZW50JyBzdHlsZT0nZGlzcGxheTogbm9uZTsnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5FbnRyeSBUeXBlOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmVudHJ5VHlwZSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlN0YXR1czo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS50aWNrZXRTdGF0dXMgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5DdXN0b21lciBBZmZlY3Rpbmc6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmN1c3RBZmZlY3RpbmcgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5Bc3NpZ25lZTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuYXNzaWduZWRUbyArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkNvbW1vbiBJRDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIgKyBkYXRhLmNvbW1vbklEICsgXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkVxdWlwbWVudCBJRDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuZXF1aXBtZW50SUQgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5FcXVpcG1lbnQgTmFtZTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIiArIGRhdGEuZXF1aXBtZW50TmFtZSArIFwiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5QYXJlbnQgSUQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEucGFyZW50SUQgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5QYXJlbnQgTmFtZTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5wYXJlbnROYW1lICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+UHJvYmxlbSBDYXRlZ29yeTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEucHJvYmxlbUNhdGVnb3J5ICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+UHJvYmxlbSBTdWIgQ2F0ZWdvcnk6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEucHJvYmxlbVN1YmNhdGVnb3J5ICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+UHJvYmxlbSBEZXRhaWw6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnByb2JsZW1EZXRhaWwgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5TaG9ydCBEZXNjcmlwdDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5zaG9ydERlc2NyaXB0aW9uICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+TG9jYXRpb24gUmFua2luZzo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEubG9jYXRpb25SYW5raW5nICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcblx0XHRcdFx0K1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+UGxhbm5lZCBSZXN0b3JhbCBUaW1lOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEucGxhbm5lZFJlc3RvcmFsVGltZSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkFsdGVybmF0ZSBTaXRlIElEOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuYWx0ZXJuYXRlU2l0ZUlEICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+V29yayBSZXF1ZXN0IElEOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLndvcmtSZXF1ZXN0SWQgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5BY3Rpdml0eSBBY3Rpb246PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuYWN0aW9uICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFx0XHRcclxuICAgICAgICArXCI8L2Zvcm0+XCJcclxuXHRcdFx0XHQrXCI8L2Rpdj5cIlxyXG5cdFx0XHRcdCtcIjxkaXYgY2xhc3M9J21vZGFsLWZvb3Rlcic+XCJcclxuICAgICAgICArXCI8YnV0dG9uIGlkPSdtb3JlRm9ybUNvbnRlbnRCdG4nIHN0eWxlPSdiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O2JvcmRlcjowO2N1cnNvcjpwb2ludGVyOyc+IDxpbWcgaWQ9J2R1bW15aW1hZ2UnICBzcmM9J2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQmdBQUFBWUNBWUFBQURnZHozNEFBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCQlpHOWlaU0JKYldGblpWSmxZV1I1Y2NsbFBBQUFBeUpwVkZoMFdFMU1PbU52YlM1aFpHOWlaUzU0YlhBQUFBQUFBRHcvZUhCaFkydGxkQ0JpWldkcGJqMGk3N3UvSWlCcFpEMGlWelZOTUUxd1EyVm9hVWg2Y21WVGVrNVVZM3ByWXpsa0lqOCtJRHg0T25odGNHMWxkR0VnZUcxc2JuTTZlRDBpWVdSdlltVTZibk02YldWMFlTOGlJSGc2ZUcxd2RHczlJa0ZrYjJKbElGaE5VQ0JEYjNKbElEVXVNQzFqTURZeElEWTBMakUwTURrME9Td2dNakF4TUM4eE1pOHdOeTB4TURvMU56b3dNU0FnSUNBZ0lDQWdJajRnUEhKa1pqcFNSRVlnZUcxc2JuTTZjbVJtUFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eE9UazVMekF5THpJeUxYSmtaaTF6ZVc1MFlYZ3Ribk1qSWo0Z1BISmtaanBFWlhOamNtbHdkR2x2YmlCeVpHWTZZV0p2ZFhROUlpSWdlRzFzYm5NNmVHMXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNoaGNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSU1pXWTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpWSmxaaU1pSUhodGNEcERjbVZoZEc5eVZHOXZiRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5UTlM0eElGZHBibVJ2ZDNNaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9USTBSalZGTmpaRVF6TkJNVEZGT0VGRU1USTRRVU16T0RORFJFUkdRa01pSUhodGNFMU5Pa1J2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T1RJMFJqVkZOamRFUXpOQk1URkZPRUZFTVRJNFFVTXpPRE5EUkVSR1FrTWlQaUE4ZUcxd1RVMDZSR1Z5YVhabFpFWnliMjBnYzNSU1pXWTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG81TWpSR05VVTJORVJETTBFeE1VVTRRVVF4TWpoQlF6TTRNME5FUkVaQ1F5SWdjM1JTWldZNlpHOWpkVzFsYm5SSlJEMGllRzF3TG1ScFpEbzVNalJHTlVVMk5VUkRNMEV4TVVVNFFVUXhNamhCUXpNNE0wTkVSRVpDUXlJdlBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BsaE9zdVlBQUFHeFNVUkJWSGphdEpiQlNzTkFFSVlUTGZvRWhVSWcwRk1oSUJSNjlTUUlCU0hncWRBSEVEemw1S25nWXdpQjlsb0NIcnpvU2ZBTkJFRUlDSVdpMUpNWHhWT2hFUCtWR1JqWFRiS0pjZUJMMDJUMy83T3oyWjI0VG5GNDRCZ2NnVGJvMC9VSDhBWnV3RldXWmE5T3hlaUFHR3hBVnNLRzJuWmc1T2lZWWdnK2hVQUNSbUFBV3NTQXJpV2luZW96TERPSVJJZExFRmlNTnFDMjNDL0tNd2hGU2lhMnVSUkNFNUd5VURkUWsvbE9EZUlDdlgxd0lrZW1QVzFNR2tyTGt3YXh5SGRSWEZDN1U1TUJDZks4eEd6Z2k5UUVEUmdFSWxYK0ZnNWpzQTNtSUhYK0dEQkpTVXRwanBYQklkMmIxeEYwWGZjSG10YUJlcWQ3WW5YSzJBTTcyclUyL2ZxMEZtUjhnSVdtOVozeU5lVnNWK3Z3YkxHS0pkYzhKNlNsVHRhdGd0RS8wbjRqdzZkUnZCanVMZktFVnVUbVdhVDgxMXRrV25pa3BVNVdhcEtmNkY2LzVsdGoybnRZSzFVR3QvUm41RFFYckhXbkR0MS9YR2hkTllJbG1GSDc4d2FlbmpWbU1Gekt6WTVyd0ZuZE9hQytYQnM4MDNhZFZUVXhpR2VtN2RwVWNCS3h5b3VpcDFXMnFLeGtoZ1Vsa3lPdlpJWTJOWm5uWkZxaDZFODU1enB1eGM4V0hzVzk3V2ZMbHdBREFFZURVcTJEVlk4TUFBQUFBRWxGVGtTdVFtQ0MnLz4gPC9idXR0b24+XCJcclxuXHRcdFx0XHQrXCI8L2Rpdj5cIlxyXG4gICAgICByZXR1cm4gZGlhbG9nRGF0YTtcclxuICAgIH1cclxuICBcclxuICAgICAgICBmdW5jdGlvbiBnZXRUaWNrZXRJbmZvQm94SFRNTChkYXRhOiBhbnksIGRpc3RhbmNkRGF0YTogYW55LCBmcm9tQWRkcmVzczogYW55LCB0b0FkZHJlc3M6IGFueSk6U3RyaW5ne1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICB2YXIgaW5mb2JveERhdGEgPSBcIjxkaXYgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7Jz48ZGl2IHN0eWxlPSdwb3NpdGlvbjogcmVsYXRpdmU7d2lkdGg6MTAwJTsnPlwiXHJcbiAgICAgICAgK1wiPGRpdj48YSBocmVmPSdqYXZhc2NyaXB0OnZvaWQoMCknIHN0eWxlPSd0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSc+XCIrZGF0YS50aWNrZXROdW1iZXIrXCIgPC9hPiA8aSBjbGFzcz0nZmEgZmEtdGltZXMnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPjwvaT48L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5TZXZlcml0eTo8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0nY29sLW1kLTgnIHN0eWxlPSdjb2xvcjpyZWQ7Jz5cIitkYXRhLnRpY2tldFNldmVyaXR5K1wiPC9kaXY+XCIgXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5Db21tb24gSUQ6PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC04Jz5cIitkYXRhLmNvbW1vbklEK1wiPC9kaXY+XCIgXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5BZmZlY3Rpbmc6PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC04Jz5cIitkYXRhLmN1c3RBZmZlY3RpbmcrXCI8L2Rpdj5cIiBcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTQnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweCcgPjxzcGFuPlNob3J0RGVzY3JpcHQ6PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC04Jz5cIitkYXRhLnNob3J0RGVzY3JpcHRpb24rXCI8L2Rpdj5cIiBcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTEyJyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48aHIgLz48L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTExJyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHg7IGZvbnQtd2VpZ2h0OiBib2xkbCcgPjxzcGFuPlwiKyBkaXN0YW5jZURhdGEgICtcIjwvc3Bhbj48L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTExJyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHg7IGZvbnQtd2VpZ2h0OiBib2xkbCcgPjxzcGFuPlwiKyBmcm9tQWRkcmVzcyAgK1wiPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtMTEnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweDsgZm9udC13ZWlnaHQ6IGJvbGRsJyA+PHNwYW4+XCIrIHRvQWRkcmVzcyAgK1wiPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgcmV0dXJuIGluZm9ib3hEYXRhO1xyXG4gICAgICAgIH1cclxufVxyXG5cclxuICBVcGRhdGVUaWNrZXRKU09ORGF0YUxpc3QoKVxyXG4gIHtcclxuICAgIGlmKHRoaXMudGlja2V0TGlzdC5sZW5ndGggIT0wKVxyXG4gICAge1xyXG4gICAgdGhpcy50aWNrZXRMaXN0LlRpY2tldEluZm9MaXN0LlRpY2tldEluZm8uZm9yRWFjaCh0aWNrZXRJbmZvID0+IHtcclxuICAgICAgdmFyIHRpY2tldDogVGlja2V0ID0gbmV3IFRpY2tldCgpOztcclxuICAgICAgdGlja2V0SW5mby5GaWVsZFR1cGxlTGlzdC5GaWVsZFR1cGxlLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgaWYoZWxlbWVudC5OYW1lID09PSBcIlRpY2tldE51bWJlclwiKXtcclxuICAgICAgICAgICAgdGlja2V0LnRpY2tldE51bWJlciA9IGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkVudHJ5VHlwZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5lbnRyeVR5cGUgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDcmVhdGVEYXRlXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmNyZWF0ZURhdGUgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFcXVpcG1lbnRJRFwiKXtcclxuICAgICAgICAgIHRpY2tldC5lcXVpcG1lbnRJRCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkNvbW1vbklEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmNvbW1vbklEID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUGFyZW50SURcIil7XHJcbiAgICAgICAgICB0aWNrZXQucGFyZW50SUQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDdXN0QWZmZWN0aW5nXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmN1c3RBZmZlY3RpbmcgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJUaWNrZXRTZXZlcml0eVwiKXtcclxuICAgICAgICAgIHRpY2tldC50aWNrZXRTZXZlcml0eSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFzc2lnbmVkVG9cIil7XHJcbiAgICAgICAgICB0aWNrZXQuYXNzaWduZWRUbyA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlN1Ym1pdHRlZEJ5XCIpe1xyXG4gICAgICAgICAgdGlja2V0LnN1Ym1pdHRlZEJ5ID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUHJvYmxlbVN1YmNhdGVnb3J5XCIpe1xyXG4gICAgICAgICAgdGlja2V0LnByb2JsZW1TdWJjYXRlZ29yeSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlByb2JsZW1EZXRhaWxcIil7XHJcbiAgICAgICAgICB0aWNrZXQucHJvYmxlbURldGFpbCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlByb2JsZW1DYXRlZ29yeVwiKXtcclxuICAgICAgICAgIHRpY2tldC5wcm9ibGVtQ2F0ZWdvcnkgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMYXRpdHVkZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5sYXRpdHVkZSA9IChlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgfHwgZWxlbWVudC5WYWx1ZSA9PT0gJycpICA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkxvbmdpdHVkZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5sb25naXR1ZGUgPSAgKGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBlbGVtZW50LlZhbHVlID09PSAnJykgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQbGFubmVkUmVzdG9yYWxUaW1lXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnBsYW5uZWRSZXN0b3JhbFRpbWUgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBbHRlcm5hdGVTaXRlSURcIil7XHJcbiAgICAgICAgICB0aWNrZXQuYWx0ZXJuYXRlU2l0ZUlEID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTG9jYXRpb25SYW5raW5nXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmxvY2F0aW9uUmFua2luZyA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFzc2lnbmVkRGVwYXJ0bWVudFwiKXtcclxuICAgICAgICAgIHRpY2tldC5hc3NpZ25lZERlcGFydG1lbnQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJSZWdpb25cIil7XHJcbiAgICAgICAgICB0aWNrZXQucmVnaW9uID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTWFya2V0XCIpe1xyXG4gICAgICAgICAgdGlja2V0Lm1hcmtldCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIldvcmtSZXF1ZXN0SWRcIil7XHJcbiAgICAgICAgICB0aWNrZXQud29ya1JlcXVlc3RJZCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlNoaWZ0TG9nXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnNoaWZ0TG9nID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQWN0aW9uXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmFjdGlvbiA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkVxdWlwbWVudE5hbWVcIil7XHJcbiAgICAgICAgICB0aWNrZXQuZXF1aXBtZW50TmFtZSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlNob3J0RGVzY3JpcHRpb25cIil7XHJcbiAgICAgICAgICB0aWNrZXQuc2hvcnREZXNjcmlwdGlvbiA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlBhcmVudE5hbWVcIil7XHJcbiAgICAgICAgICB0aWNrZXQucGFyZW50TmFtZSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlRpY2tldFN0YXR1c1wiKXtcclxuICAgICAgICAgIHRpY2tldC50aWNrZXRTdGF0dXMgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMb2NhdGlvbklEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmxvY2F0aW9uSUQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJPcHNEaXN0cmljdFwiKXtcclxuICAgICAgICAgIHRpY2tldC5vcHNEaXN0cmljdCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIk9wc1pvbmVcIil7XHJcbiAgICAgICAgICB0aWNrZXQub3BzWm9uZSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy50aWNrZXREYXRhLnB1c2godGlja2V0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuY29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJ0dGFtYXBsaWJDb21wb25lbnQgfSBmcm9tICcuL3J0dGFtYXBsaWIuY29tcG9uZW50JztcbmltcG9ydCB7IFJ0dGFtYXBsaWJTZXJ2aWNlIH0gZnJvbSBcIi4vcnR0YW1hcGxpYi5zZXJ2aWNlXCJcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtSdHRhbWFwbGliQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW1J0dGFtYXBsaWJDb21wb25lbnRdLFxuICBwcm92aWRlcnM6IFtSdHRhbWFwbGliU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgUnR0YW1hcGxpYk1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJpby5jb25uZWN0IiwibW9tZW50dGltZXpvbmUudXRjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7SUFvQkUsMkJBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO3dCQU5uQixLQUFLO3VCQUNOLElBQUk7b0JBQ0MsSUFBSTtzQkFDTCxJQUFJO3lCQUNFLElBQUk7UUFHdEIsSUFBSSxDQUFDLElBQUksR0FBRywyQ0FBMkMsQ0FBQztRQUN4RCxJQUFJLENBQUMsU0FBUyxHQUFHLG1DQUFtQyxDQUFDO0tBQ3REOzs7OztJQUVELGtEQUFzQjs7OztJQUF0QixVQUF1QixRQUFROztRQUM3QixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztRQUMxQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFhO1lBQzNFLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ25CLENBQUMsQ0FBQztLQUNKOzs7OztJQUVELDZDQUFpQjs7OztJQUFqQixVQUFrQixNQUFNOztRQUN0QixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdEIsWUFBWSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMs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