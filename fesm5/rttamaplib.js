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
        this.testClass = "position:relative;";
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
        Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend', function () {
            window.setTimeout(that.setZoomPosition, 10000);
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
     * @return {?}
     */
    RttamaplibComponent.prototype.setZoomPosition = /**
     * @return {?}
     */
    function () {
        $('.NavBar_Container.Light').attr('style', 'bottom:30px;top:unset !important;');
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
            $('.NavBar_Container.Light').attr('style', 'bottom:30px;top:unset !important;');
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
                    //Add a pushpin at the user's location.
                    // var pin = new Microsoft.Maps.Pushpin(loc);
                    // map.entities.push(pin);
                    // // Center the map on the user's location.
                    // // maps.setView({ center: loc, zoom: 15 });
                    currentLatitude = position.coords.latitude;
                    currentLongitude = position.coords.longitude;
                    // console.log(currentLatitude);
                    // console.log(currentLongitude);
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
                    displayRouteSelector: false
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
                    distanceData = "<label style='font-weight:bold; font-size:24px;'>" + distance + '&nbsp;' + distanceUnits + ", </label>Traffic: " + time + " minutes";
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
                        // backdrop: 'static',
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
                    $("#ticketmodal").on("hidden.bs.modal", function () {
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
            var dialogData = "<div style='display: flex; padding:5px;justify-content: space-between;align-items: flex-start;'>"
                + "<h5 id='tktId'><a href='javascript:void(0);' style='text-decoration: underline; color:#000; font-size:15px;'>" + data.ticketNumber + "</a></h5>"
                + "<button type='button' class='close' data-dismiss='modal' title='Close'>&times;</button>"
                + "</div>"
                + "<div  style='max-height:390px; overflow-y:auto; overflow-x:hidden; font-size:14px; padding:5px; width:370px;'>" //class='modal-body'
                + "<form class='tktForm'>"
                + "<div id='initFormContent' style='display: block;'>"
                + "<div class='row'>"
                + " <div class='col-sm-4' style='width:130px;'>"
                + "<label class='control-label'>Severity:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:240px;'>"
                + " <label class='control-label' style=color:" + workSeverityColor + ">" + data.ticketSeverity + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-4' style='width:130px;'>"
                + "<label class='control-label'>Common ID:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:240px;'>"
                + "<label class='control-label'>" + data.commonID + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-4' style='width:130px;'>"
                + "<label class='control-label'>Affecting:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:240px;'>"
                + "<label class='control-label'>" + data.custAffecting + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-4' style='width:130px;'>"
                + "<label class='control-label'>Short Descript:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:240px;'>"
                + " <label class='control-label'>" + data.shortDescription + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-1' style='width:30px;'>"
                + "</div>"
                + "<div class='col-sm-10' style='border-top:1px solid #dbdbdb;'>"
                + "</div>"
                + " <div class='col-sm-1' style='width:30px;'>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-12' style='width:350px;'>"
                + " <label class='control-label'>" + distancdData + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-1' style='width:30px;'>"
                + "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAYCAYAAAALQIb7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANRSURBVEhLvZVLSFRRGMeNiqK2tYwWtW/RpqigCCJCiBZFUFnLaFEtapESGBiVRRSCCGUvNW1sLNNSk14qvSwdH42PeTuPa/N+OC/vzPz73xitO94Zxwh/cOBy7j33f873P9/3FWARWZDYdCyBcETEVHgaSCTTs/kzr5g9EMdHWxjVWj9Ke124+MWJks9OXO5z4/5YAN8cYQS4gXzIKpbiMHpjuNPrRFGzBRtrDVj6UI9VNQas5ljyQI+1NXqcejkBtdYLiz+OlLQoB1nFmkf9OPjMjC31BlzrEfBaF8CQKwZ7WMTPaILPUTwZ8uJsmxVrHulxoMMO3WQkvVoZRbFnFDr50oqiFxZUD3oxyh9H6Fcmfgr3MYyXGNadPP2+NhvG+G0qqXxEuRi/MTF0h7nwGIWe/vBBFOe/CBGKltHLDfVGXPv0ExMMqRIyMSEYx116tI2hq9J4kBDnMeEvbL4YKii0iT4+1wfTs3JkYr2OCI4+t6D0nQMDQu74K6GhZ5vrDCinqN0393QysSZjCOu5s4Zh728/FoqbKXCm046Lbx3oMs09nUysUuvjldahxx6mf/mHcIapeBL1GjdKKKga9qVn/zArFomKuPLdhZW8xvogK8Q/EJ5OopU5d6HThtpBT3r2D7NiInd1o9+DFUzcAXcsPbswpJM1DXlwvsOKRwM5xCSqRvxYcm8cneYQUnlc+UyCzMWbPZMofm1DK3M1E5lYy8QU1vE23frqhD1LruRiIjCN/bzNZV0Cfgj0PQOZmJTQ5d0CChtNaMmSK9kQ6Ve7MYhlvGC3WXWSCpGRiYmJFDQsP9sbjDjNUGj5nC9tFNrXZMYhVp6vWdbJxCRCNPkKk3KX2oQjHTb0MQ2UdjlDlD41s0gfe2XFbm6yfcyPkEIdlZgjJiGw9Jx4L2D9YwPOS2YbghhnRfAw0QOs+H4OF59HPTGoRnwoZHfYozKigl7HcmxMUUzCw26sZpLvVZmw/L4OW9VmXKfxdf1uPPjmQvEbB3bwXQHfHWebea8PIE4bcpWCrGISQZ6glzWykgl69eMkylgzz7VbfydtKUvSDYa7Zlzqc2xBDP985BSbIUYPjPzhB9a7RrYdqbF2m4Mwe6LpL/IjL7H/xSKKAb8A9MKXAOgE42gAAAAASUVORK5CYII=' />"
                + "</div>"
                + " <div class='col-sm-10' style='border-bottom:1px solid #dbdbdb; width:300px'>"
                + " <label class='control-label'>" + fromAddress + "</label>"
                + "</div>"
                + " <div class='col-sm-1' style='width:30px;'>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + " <div class='col-sm-1' style='width:30px;'>"
                + "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAaCAYAAABCfffNAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANfSURBVEhLzZXdS1NxGMf7eyLrwgyMbgIhUevCiKC6zQgURfRCw7AXKnqjEouIUCzqIlAUMwjBhC4qrL229v7W3M7cdJubO3s527fn9zunU3vfupA+MDae39nve36/5/s8zx7sAv+HSF6SkEulIO3sQEokIMXj/HcunUY+l1Oeqk5VkTx9Ek4nhPl5uO/fh+vGDTivXYP3yROElpeRXF+XH6xBWRG2+bZWC/fYGCwXLsDS3w/H9etwP3oE1717sI2Pw9zbC8u5c/BNTCBhsch/rECJSC6bRWR1Fc7RURiOH4e1pwc/afPQ+/eIfv2KyJcvCLKT3bwJ88mTMJ46BTcJc6E8e71SCkTyJBD99g3ms2ehO3IE669eIROJKKuliH4/XFevwkBitpERpARBWSmkQET0eGDq6oLpzBkIs7M8wdVgic9ub8M/PQ19dzdct2/zPYpRRTLRKIJv30Lf3g7f5CSyNQT+Jul2w0NXpj96FOHFRSX6B1UkYTTCOjgIGyU7bjAo0fqJ6/XQtbby/KU2NpSojCqyRW+g2bsXQbqmTCymROsnEw7DOjwMBxki8vmzEpXhIswTwRcvoNm3DzFyT3mPVIcVqW9mht9EcG5OicpwkWwyCf/Tp9AeOADR4eALjSLRHhvv3sF++TKE16+VqAwXkahtBJ49g3b/foh2O19oFOZEYWEBdipU4c0bJSqj5iRMudA0NWFrZQUS9aVGyZI7PQ8fwkYnCS0tKVEZVST64QN0x47BSycSfT4lWj/pQIDXl/vuXcSL2owqkqRcOKkBmk6fxmbRm9RCEkWEKB/aw4chvHzJr/9vVBF2RdG1NejpQfelS0iWqdxKRD5+hGVggL9g7NMnJfoHVYSRI4ew4+o7OmCnzpve3FRWKhOjIrb19UF36BA2qbEylxVTIMIQaUa4bt2Ctq0NZupHfqqfuM2GHA2v32TISdsmE/xUF99PnMAPOgGzLetj5SgRYcRpg58PHsBMifxx8SIc1PZ9d+4g+Pw5Ao8fw0OzxT40BAt9rOfPQ5iaQoamZiXKijBY1ceohzmvXIGxsxP6gweha26GrqWFf5soxiZkggxTq0NUFGHw+U7OYTUger2IaTS8eabI4jk258lF9cz5qiLFsKnJhBulIZF/ZRdEgF832n4shv7MoQAAAABJRU5ErkJggg==' />"
                + "</div>"
                + "<div class='col-sm-10' style='width:300px;'>"
                + " <label class='control-label'>" + toAddress + "</label>"
                + "</div>"
                + " <div class='col-sm-1' style='width:30px;'>"
                + "</div>"
                + "</div>"
                + "</div>" //end initform
                + "<div id='moreFormContent' style='display: none;'>"
                + "<div class='row'>"
                + " <div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + " <label class='control-label'>Entry Type:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.entryType + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Status:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.ticketStatus + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Customer Affecting:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + " <label class='control-label'>" + data.custAffecting + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Assignee:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + " <label class='control-label'>" + data.assignedTo + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Common ID:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.commonID + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Equipment ID:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + " <label class='control-label'>" + data.equipmentID + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Equipment Name:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.equipmentName + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Parent ID:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.parentID + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Parent Name:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.parentName + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Problem Category:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + " <label class='control-label'>" + data.problemCategory + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Problem Sub Category:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.problemSubcategory + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Problem Detail:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.problemDetail + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Short Descript:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.shortDescription + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Location Ranking:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.locationRanking + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Planned Restoral Time:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.plannedRestoralTime + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Alternate Site ID:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.alternateSiteID + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Work Request ID:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.workRequestId + "</label>"
                + "</div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-sm-4' style='width:160px; font-size:12px;'>"
                + "<label class='control-label'>Activity Action:</label>"
                + "</div>"
                + "<div class='col-sm-8' style='width:210px;'>"
                + "<label class='control-label'>" + data.action + "</label>"
                + "</div>"
                + "</div>"
                + "</div>"
                + "</form>"
                + "</div>"
                + "<div style='display: flex; justify-content: flex-end; padding-right: 5px; padding-bottom: 5px;'>"
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
                    template: "  \n  <div style='position:relative;'>\n  <div id='myMap' class='mapclass' #mapElement>\n  </div>\n  <div id=\"ticketmodal\" class=\"modal\">\n\t\t<div class=\"modal-dialog\" style='max-width:370px;'>\t\t\t\n      <div class=\"modal-content\" style='line-height:1.2em;'>\n      </div>\t\t\t\n      </div>\n  </div>\n  </div>\n  ",
                    styles: ["\n  .mapclass{\n    height: calc(100vh - 4em - 80px) !important;    \n    display:block;\n  }\n  .modal{\n    position:absolute;\n  }\n  .infyMappopup{\n\t\tmargin:auto !important;\n    width:300px !important;\n    background-color: white;\n    border: 1px solid lightgray; \n  },\n  .popModalContainer{\n    padding:15px;\n  }\n  .popModalHeader{\n    position: relative;\n    width:100%;\n  }\n  .popModalHeader a{\n    display: inline-block;\n    padding:5px 10px;\n    background-color: #ffc107;\n    border-color: #ffc107;\n    position: absolute;\n    right:10px;\n    top:5px;\n  }\n  .popModalHeader .fa{\n    position: absolute;\n    top:-10px;\n    right:-10px;\n  \n  }\n  .popModalBody label{\n    font-weight: bold;\n    line-height: normal;\n  }\n  .popModalBody span{\n    display: inline-block;\n    line-height: normal;\n    word-break:\u00A0break-word;\n  }\n  .meterCal strong{\n    font-weight: bolder;\n    font-size: 23px;\n  }\n  .meterCal span{\n    display: block;\n  }\n  .popModalFooter .col{\n    text-align: center;\n  }\n  .popModalFooter .fa{\n    padding:0 5px;\n  }\n.modal-body {max-height:450px; overflow-y:auto}\n.tktForm .form-group {margin-bottom:5px}\n.tktForm .form-group div label {font-weight:500}\n.topBorder {border-top:#dbdbdb 1px solid;}\n\n.text-success {color:#5cb85c}\n.text-danger {color:#d9534f}\n#moreFormContentBtn, #moreFormContentBtn:hover  {    \n   \n    background:transparent;\n    border:0\n}\n#moreFormContentBtn:focus  {    \n    outline:0\n}\n\n  "]
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vcnR0YW1hcGxpYi9saWIvcnR0YW1hcGxpYi5zZXJ2aWNlLnRzIiwibmc6Ly9ydHRhbWFwbGliL2xpYi9tb2RlbHMvdHJ1Y2tkZXRhaWxzLnRzIiwibmc6Ly9ydHRhbWFwbGliL2xpYi9ydHRhbWFwbGliLmNvbXBvbmVudC50cyIsIm5nOi8vcnR0YW1hcGxpYi9saWIvcnR0YW1hcGxpYi5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cCwgUmVzcG9uc2UsIFJlcXVlc3RPcHRpb25zLCBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL3RvUHJvbWlzZSc7XG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcbmltcG9ydCB7IFRydWNrRGlyZWN0aW9uRGV0YWlscyB9IGZyb20gJy4vbW9kZWxzL3RydWNrZGV0YWlscyc7XG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyL3NyYy91dGlscy9jb2xsZWN0aW9uJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUnR0YW1hcGxpYlNlcnZpY2Uge1xuXG4gIG1hcFJlYWR5ID0gZmFsc2U7XG4gIHNob3dOYXYgPSB0cnVlO1xuICBob3N0OiBzdHJpbmcgPSBudWxsO1xuICBzb2NrZXQ6IGFueSA9IG51bGw7XG4gIHNvY2tldFVSTDogc3RyaW5nID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHtcbiAgICB0aGlzLmhvc3QgPSBcImh0dHBzOi8vemxkMDQwOTAudmNpLmF0dC5jb206ODQ0My9SQVBUT1IvXCI7XG4gICAgdGhpcy5zb2NrZXRVUkwgPSBcImh0dHBzOi8vemxkMDQwOTAudmNpLmF0dC5jb206MzAwN1wiO1xuICB9XG5cbiAgY2hlY2tVc2VySGFzUGVybWlzc2lvbih1c2VyTmFtZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHVzZXJzTGlzdFVybCA9IHRoaXMuaG9zdCArIFwiYXV0aHVzZXJcIjtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXNlcnNMaXN0VXJsLCB1c2VyTmFtZSkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRNYXBQdXNoUGluRGF0YShhdHRVSUQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzdXBlcnZpc29ySWQgPSBbXTtcbiAgICBzdXBlcnZpc29ySWQgPSBhdHRVSUQuc3BsaXQoJywnKTtcbiAgICB2YXIgdXNlcnNMaXN0VXJsID0gdGhpcy5ob3N0ICsgJ1RlY2hEZXRhaWxGZXRjaCc7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVzZXJzTGlzdFVybCwge1xuICAgICAgXCJhdHR1SWRcIjogXCJcIixcbiAgICAgIFwic3VwZXJ2aXNvcklkXCI6IHN1cGVydmlzb3JJZFxuICAgIH0pLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZmluZFRydWNrTmVhckJ5KGxhdCwgbG9uZywgZGlzdGFuY2UsIHN1cGVydmlzb3JJZCk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHN1cGVydmlzb3JJZHMgPSBbXTtcbiAgICBzdXBlcnZpc29ySWRzID0gc3VwZXJ2aXNvcklkLnNwbGl0KCcsJyk7XG4gICAgY29uc3QgZmluZFRydWNrVVJMID0gdGhpcy5ob3N0ICsgJ0ZpbmRUcnVja05lYXJCeSc7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGZpbmRUcnVja1VSTCwge1xuICAgICAgJ2xhdCc6IGxhdCxcbiAgICAgICdsbG9uZyc6IGxvbmcsXG4gICAgICAncmFkaXVzJzogZGlzdGFuY2UsXG4gICAgICAnc3VwZXJ2aXNvcklkJzogc3VwZXJ2aXNvcklkc1xuICAgIH0pLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0V2ViUGhvbmVVc2VyRGF0YShhdHRVSUQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBsZGFwVVJMID0gdGhpcy5zb2NrZXRVUkwgKyBcIi9nZXR0ZWNobmljaWFucy9cIiArIGF0dFVJRDtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChsZGFwVVJMKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFdlYlBob25lVXNlckluZm8oYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgbGRhcFVSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvZ2V0dGVjaG5pY2lhbmluZm8vXCIgKyBhdHRVSUQ7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQobGRhcFVSTCkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBHZXROZXh0Um91dGVEYXRhKGZyb21BdHRpdHVkZSwgdG9BdHRpdHVkZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHJvdXRlVXJsID0gXCJodHRwczovL2Rldi52aXJ0dWFsZWFydGgubmV0L1JFU1QvVjEvUm91dGVzL0RyaXZpbmc/d3AuMD1cIiArIGZyb21BdHRpdHVkZSArIFwiJndwLjE9XCIgKyB0b0F0dGl0dWRlICsgXCImcm91dGVBdHRyaWJ1dGVzPXJvdXRlUGF0aCZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQocm91dGVVcmwpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNbXCJfYm9keVwiXTtcbiAgICB9KTtcbiAgfVxuXG4gIEdldFJvdXRlTWFwRGF0YShkaXJEZXRhaWxzOiBhbnlbXSk6IGFueVtdIHtcbiAgICBsZXQgY29tYmluZWRVcmxzID0gW107XG4gICAgbGV0IHJvdXRlVXJsO1xuICAgIHZhciBuZXdSb3V0ZVVybDtcbiAgICBkaXJEZXRhaWxzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIHJvdXRlVXJsID0gXCJodHRwczovL2Rldi52aXJ0dWFsZWFydGgubmV0L1JFU1QvVjEvUm91dGVzLz93cC4wPVwiICsgaXRlbS5zb3VyY2VMYXQgKyBcIixcIiArIGl0ZW0uc291cmNlTG9uZyArIFwiJndwLjE9XCIgKyBpdGVtLmRlc3RMYXQgKyBcIixcIiArIGl0ZW0uZGVzdExvbmcgKyBcIiZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiXG4gICAgICBuZXdSb3V0ZVVybCA9IHRoaXMuaHR0cC5nZXQocm91dGVVcmwpXG4gICAgICBjb21iaW5lZFVybHMucHVzaChuZXdSb3V0ZVVybClcbiAgICB9KTtcbiAgICByZXR1cm4gY29tYmluZWRVcmxzO1xuICB9XG5cbiAgZ2V0QWRkcmVzc0J5TGF0TG9uZyhsYXRpdHVkZSxsb25naXR1ZGUpIHsgIFxuICAgIHZhciBiaW5nSG9zdCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL3YxL0xvY2F0aW9ucy9MYXRMb25nP289anNvbiZrZXk9QW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNalwiO1xuICBcbiAgICB2YXIgZ2V0QmluZ1VybCA9IGJpbmdIb3N0LnJlcGxhY2UoXCJMYXRMb25nXCIsbGF0aXR1ZGUgKyBcIixcIiArIGxvbmdpdHVkZSk7O1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGdldEJpbmdVcmwpO1xuICB9XG5cbiAgc2VuZEVtYWlsKGZyb21FbWFpbCwgdG9FbWFpbCwgZnJvbU5hbWUsIHRvTmFtZSwgc3ViamVjdCwgYm9keSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHNtc1VSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvc2VuZGVtYWlsXCI7XG4gICAgdmFyIGVtYWlsTWVzc2FnZSA9IHtcbiAgICAgIFwiZXZlbnRcIjoge1xuICAgICAgICBcInJlY2lwaWVudERhdGFcIjogW3tcbiAgICAgICAgICBcImhlYWRlclwiOiB7IFwic291cmNlXCI6IFwiS2VwbGVyXCIsIFwic2NlbmFyaW9OYW1lXCI6IFwiXCIsIFwidHJhbnNhY3Rpb25JZFwiOiBcIjUxMTExXCIgfSxcbiAgICAgICAgICBcIm5vdGlmaWNhdGlvbk9wdGlvblwiOiBbeyBcIm1vY1wiOiBcImVtYWlsXCIgfV0sXG4gICAgICAgICAgXCJlbWFpbERhdGFcIjoge1xuICAgICAgICAgICAgXCJzdWJqZWN0XCI6IFwiXCIgKyBzdWJqZWN0ICsgXCJcIixcbiAgICAgICAgICAgIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keSArIFwiXCIsXG4gICAgICAgICAgICBcImFkZHJlc3NcIjoge1xuICAgICAgICAgICAgICBcInRvXCI6IFt7IFwibmFtZVwiOiBcIlwiICsgdG9OYW1lICsgXCJcIiwgXCJhZGRyZXNzXCI6IFwiXCIgKyB0b0VtYWlsICsgXCJcIiB9XSxcbiAgICAgICAgICAgICAgXCJjY1wiOiBbXSxcbiAgICAgICAgICAgICAgXCJiY2NcIjogW10sXG4gICAgICAgICAgICAgIFwiZnJvbVwiOiB7IFwibmFtZVwiOiBcIkFUJlQgRW50ZXJwcmlzZSBOb3RpZmljYXRpb25cIiwgXCJhZGRyZXNzXCI6IFwiXCIgfSwgXCJib3VuY2VUb1wiOiB7IFwiYWRkcmVzc1wiOiBcIlwiIH0sXG4gICAgICAgICAgICAgIFwicmVwbHlUb1wiOiB7IFwiYWRkcmVzc1wiOiBcIlwiIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICBcImF0dHJpYkRhdGFcIjogW3sgXCJuYW1lXCI6IFwic3ViamVjdFwiLCBcInZhbHVlXCI6ICBzdWJqZWN0IH0sXG4gICAgICAgIHsgXCJuYW1lXCI6IFwibWVzc2FnZVwiLCBcInZhbHVlXCI6IFwiVGhpcyBpcyBmaXJzdCBjYW11bmRhIHByb2Nlc3NcIiB9LFxuICAgICAgICB7IFwibmFtZVwiOiBcImNvbnRyYWN0b3JOYW1lXCIsIFwidmFsdWVcIjogXCJBamF5IEFwYXRcIiB9XVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuICAgIHZhciBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHsgaGVhZGVyczogaGVhZGVycyB9KTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Qoc21zVVJMLCBKU09OLnN0cmluZ2lmeShlbWFpbE1lc3NhZ2UpLCBvcHRpb25zKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRTTVModG9OdW1iZXIsIGJvZHlNZXNzYWdlKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgc21zVVJMID0gdGhpcy5zb2NrZXRVUkwgKyBcIi9zZW5kc21zXCI7XG4gICAgdmFyIHNtc01lc3NhZ2UgPSB7XG4gICAgICBcImV2ZW50XCI6IHtcbiAgICAgICAgXCJyZWNpcGllbnREYXRhXCI6IFt7XG4gICAgICAgICAgXCJoZWFkZXJcIjogeyBcInNvdXJjZVwiOiBcIktlcGxlclwiLCBcInNjZW5hcmlvTmFtZVwiOiBcIiBGaXJzdE5ldEluaXRpYWxSZWdpc3RyYXRpaW9uVXNlclwiLCBcInRyYW5zYWN0aW9uSWRcIjogXCIwMDA0XCIgfSxcbiAgICAgICAgICBcIm5vdGlmaWNhdGlvbk9wdGlvblwiOiBbeyBcIm1vY1wiOiBcInNtc1wiIH1dLFxuICAgICAgICAgIFwic21zRGF0YVwiOiB7XG4gICAgICAgICAgICBcImRldGFpbHNcIjoge1xuICAgICAgICAgICAgICBcImNvbnRhY3REYXRhXCI6IHtcbiAgICAgICAgICAgICAgICBcInJlcXVlc3RJZFwiOiBcIjExMTE2XCIsIFwic3lzSWRcIjogXCJDQlwiLCBcImNsaWVudElkXCI6IFwiUlRUQVwiLFxuICAgICAgICAgICAgICAgIC8vIFwicGhvbmVOdW1iZXJcIjogeyBcImFyZWFDb2RlXCI6IFwiXCIgKyB0b051bWJlci50b1N0cmluZygpLnN1YnN0cigwLCAzKSArIFwiXCIsIFwibnVtYmVyXCI6IFwiXCIgKyB0b051bWJlci50b1N0cmluZygpLnN1YnN0cigzLCAxMCkgKyBcIlwiIH0sIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keU1lc3NhZ2UgKyBcIlwiLFxuICAgICAgICAgICAgICAgIFwicGhvbmVOdW1iZXJcIjogeyBcImFyZWFDb2RlXCI6IFwiXCIsIFwibnVtYmVyXCI6IFwiXCIgKyB0b051bWJlciArIFwiXCIgfSwgXCJtZXNzYWdlXCI6IFwiXCIgKyBib2R5TWVzc2FnZSArIFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzY2VuYXJpb05hbWVcIjogXCIgRmlyc3ROZXRJbml0aWFsUmVnaXN0cmF0aWlvblVzZXJcIiwgXCJpbnRlcm5hdGlvbmFsTnVtYmVySW5kaWNhdG9yXCI6IFwiVHJ1ZVwiLCBcImludGVyYWN0aXZlSW5kaWNhdG9yXCI6IFwiRmFsc2VcIixcbiAgICAgICAgICAgICAgICBcImhvc3RlZEluZGljYXRvclwiOiBcIkZhbHNlXCIsIFwicHJvdmlkZXJcIjogXCJCU05MXCIsIFwic2hvcnRDb2RlXCI6IFwiMTExMVwiLCBcInJlcGx5VG9cIjogXCJETUFBUFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICBcImF0dHJpYkRhdGFcIjogW3sgXCJuYW1lXCI6IFwiYWRtaW5EYXRhMVwiLCBcInZhbHVlXCI6IDEyMzQ1NjcgfSwgeyBcIm5hbWVcIjogXCJjb250cmFjdG9yTmFtZVwiLCBcInZhbHVlXCI6IFwiY29udHJhY3RvciBuYW1lXCIgfV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICB2YXIgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IGhlYWRlcnMgfSk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHNtc1VSTCwgSlNPTi5zdHJpbmdpZnkoc21zTWVzc2FnZSksIG9wdGlvbnMpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VHJ1Y2tGZWVkKHRlY2hJZHM6IGFueSwgbWdySWQ6IGFueSkge1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG5cbiAgICAgIHRoaXMuc29ja2V0ID0gaW8uY29ubmVjdCh0aGlzLnNvY2tldFVSTCxcbiAgICAgICAge1xuICAgICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgICByZWNvbm5lY3Rpb246IHRydWUsXG4gICAgICAgICAgcmVjb25uZWN0aW9uRGVsYXk6IDEwMDAsXG4gICAgICAgICAgcmVjb25uZWN0aW9uRGVsYXlNYXg6IDUwMDAsXG4gICAgICAgICAgcmVjb25uZWN0aW9uQXR0ZW1wdHM6IDk5OTk5XG4gICAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNvY2tldC5lbWl0KCdqb2luJywgeyBtZ3JJZDogbWdySWQsIGF0dHVJZHM6IHRlY2hJZHMgfSk7XG5cbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdtZXNzYWdlJywgKGRhdGEpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG4gIC8vR2V0IFJ1bGUgZGVzaWduZWQgYmFzZWQgb24gdGVjaHR5cGUuXG4gIGdldFJ1bGVzKGRpc3BhdGNoVHlwZSkge1xuICAgIHZhciBnZXRSdWxlc1VybCA9IHRoaXMuaG9zdCArIFwiRmV0Y2hSdWxlXCI7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGdldFJ1bGVzVXJsLCB7XG4gICAgICBcImRpc3BhdGNoVHlwZVwiOiBkaXNwYXRjaFR5cGVcbiAgICB9KTtcbiAgfVxuXG4gIHN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2Uoa2V5LCBvYmplY3RUb1N0b3JlKVxuICB7XG4gICAgLy8gcmV0dXJuICBpZiB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGNvbXBsZXRlIHN0b3JhZ2UgdXNlIHRoZSBjbGVhcigpIG1ldGhvZCwgbGlrZSBsb2NhbFN0b3JhZ2UuY2xlYXIoKVxuICAgIC8vIENoZWNrIGlmIHRoZSBzZXNzaW9uU3RvcmFnZSBvYmplY3QgZXhpc3RzXG4gICBpZihzZXNzaW9uU3RvcmFnZSlcbiAgICB7XG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9TdG9yZSkpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3JlRGF0YUluTG9jYWxTdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShvYmplY3RUb1N0b3JlKSk7XG4gIH1cblxuICByZXRyaWV2ZURhdGFGcm9tTG9jYWxTdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgICAgdmFyIHJlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICBpZihyZXN1bHQhPW51bGwpXG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2Uoa2V5KVxuICB7XG4gICAgaWYoc2Vzc2lvblN0b3JhZ2UpXG4gICAge1xuICAgICAgdmFyIHJlc3VsdCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgIGlmKHJlc3VsdCE9bnVsbClcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG59XG4iLCJleHBvcnQgY2xhc3MgVHJ1Y2tEZXRhaWxzIHtcbiAgIHB1YmxpYyBUcnVja0lkOiBzdHJpbmc7XG4gICBwdWJsaWMgRGlzdGFuY2U6IHN0cmluZzsgIFxufVxuXG5leHBvcnQgY2xhc3MgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxze1xuICAgIHB1YmxpYyB0ZWNoSWQ6IHN0cmluZztcbiAgICBwdWJsaWMgc291cmNlTGF0OiBzdHJpbmc7XG4gICAgcHVibGljIHNvdXJjZUxvbmc6IHN0cmluZztcbiAgICBwdWJsaWMgZGVzdExhdDogc3RyaW5nO1xuICAgIHB1YmxpYyBkZXN0TG9uZzogc3RyaW5nO1xuICAgIHB1YmxpYyBuZXh0Um91dGVMYXQ6IHN0cmluZztcbiAgICBwdWJsaWMgbmV4dFJvdXRlTG9uZzogc3RyaW5nO1xuICB9XG4gIFxuICBleHBvcnQgY2xhc3MgVGlja2V0e1xuICAgIHB1YmxpYyB0aWNrZXROdW1iZXI6IHN0cmluZztcbiAgICBwdWJsaWMgZW50cnlUeXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGNyZWF0ZURhdGU6IHN0cmluZztcbiAgICBwdWJsaWMgZXF1aXBtZW50SUQ6IHN0cmluZztcbiAgICBwdWJsaWMgY29tbW9uSUQ6IHN0cmluZztcbiAgICBwdWJsaWMgcGFyZW50SUQ6IHN0cmluZztcbiAgICBwdWJsaWMgY3VzdEFmZmVjdGluZzogc3RyaW5nO1xuICAgIHB1YmxpYyB0aWNrZXRTZXZlcml0eTogc3RyaW5nO1xuICAgIHB1YmxpYyBhc3NpZ25lZFRvOiBzdHJpbmc7XG4gICAgcHVibGljIHN1Ym1pdHRlZEJ5OiBzdHJpbmc7XG4gICAgcHVibGljIHByb2JsZW1TdWJjYXRlZ29yeTogc3RyaW5nO1xuICAgIHB1YmxpYyBwcm9ibGVtRGV0YWlsOiBzdHJpbmc7XG4gICAgcHVibGljIHByb2JsZW1DYXRlZ29yeTogc3RyaW5nO1xuICAgIHB1YmxpYyBsYXRpdHVkZTogc3RyaW5nO1xuICAgIHB1YmxpYyBsb25naXR1ZGU6IHN0cmluZztcbiAgICBwdWJsaWMgcGxhbm5lZFJlc3RvcmFsVGltZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhbHRlcm5hdGVTaXRlSUQ6IHN0cmluZztcbiAgICBwdWJsaWMgbG9jYXRpb25SYW5raW5nOiBzdHJpbmc7XG4gICAgcHVibGljIGFzc2lnbmVkRGVwYXJ0bWVudDogc3RyaW5nO1xuICAgIHB1YmxpYyByZWdpb246IHN0cmluZztcbiAgICBwdWJsaWMgbWFya2V0OiBzdHJpbmc7XG4gICAgcHVibGljIHNoaWZ0TG9nOiBzdHJpbmc7XG4gICAgcHVibGljIGVxdWlwbWVudE5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgc2hvcnREZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIHB1YmxpYyB0aWNrZXRTdGF0dXM6IHN0cmluZztcbiAgICBwdWJsaWMgbG9jYXRpb25JRDogc3RyaW5nO1xuICAgIHB1YmxpYyBvcHNEaXN0cmljdDogc3RyaW5nO1xuICAgIHB1YmxpYyBvcHNab25lOiBzdHJpbmc7XG4gICAgcHVibGljIHBhcmVudE5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XG4gICAgcHVibGljIHdvcmtSZXF1ZXN0SWQ6IHN0cmluZztcbiAgfSIsImltcG9ydCB7IFZpZXdDb250YWluZXJSZWYsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgT25Jbml0LCBWaWV3Q2hpbGQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbi8vIGltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IFJ0dGFtYXBsaWJTZXJ2aWNlIH0gZnJvbSAnLi9ydHRhbWFwbGliLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBOZ3VpQXV0b0NvbXBsZXRlTW9kdWxlIH0gZnJvbSAnQG5ndWkvYXV0by1jb21wbGV0ZS9kaXN0JztcclxuLy8gaW1wb3J0IHsgUG9wdXAgfSBmcm9tICduZzItb3BkLXBvcHVwJztcclxuaW1wb3J0IHsgVHJ1Y2tEZXRhaWxzLCBUcnVja0RpcmVjdGlvbkRldGFpbHMsIFRpY2tldCB9IGZyb20gJy4vbW9kZWxzL3RydWNrZGV0YWlscyc7XHJcbmltcG9ydCAqIGFzIGlvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgeyBmYWlsLCB0aHJvd3MgfSBmcm9tICdhc3NlcnQnO1xyXG4vLyBpbXBvcnQgeyBUb2FzdCwgVG9hc3RzTWFuYWdlciB9IGZyb20gJ25nMi10b2FzdHIvbmcyLXRvYXN0cic7XHJcbmltcG9ydCB7IE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvc3JjL21ldGFkYXRhL2xpZmVjeWNsZV9ob29rcyc7XHJcbmltcG9ydCB7IFRyeUNhdGNoU3RtdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyL3NyYy9vdXRwdXQvb3V0cHV0X2FzdCc7XHJcbmltcG9ydCB7IEFuZ3VsYXJNdWx0aVNlbGVjdE1vZHVsZSB9IGZyb20gJ2FuZ3VsYXIyLW11bHRpc2VsZWN0LWRyb3Bkb3duL2FuZ3VsYXIyLW11bHRpc2VsZWN0LWRyb3Bkb3duJztcclxuaW1wb3J0IHsgc2V0VGltZW91dCB9IGZyb20gJ3RpbWVycyc7XHJcbmltcG9ydCB7IGZvcmtKb2luIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQgKiBhcyBtb21lbnR0aW1lem9uZSBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xyXG5pbXBvcnQgeyBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyL3NyYy9jb3JlJztcclxuaW1wb3J0IHsgUEFSQU1FVEVSUyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvc3JjL3V0aWwvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IHNoYWxsb3dFcXVhbCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlci9zcmMvdXRpbHMvY29sbGVjdGlvbic7XHJcblxyXG5kZWNsYXJlIGNvbnN0IE1pY3Jvc29mdDogYW55O1xyXG5kZWNsYXJlIGNvbnN0IEJpbmc7XHJcbmRlY2xhcmUgY29uc3QgR2VvSnNvbjogYW55O1xyXG5kZWNsYXJlIHZhciBqUXVlcnk6IGFueTtcclxuZGVjbGFyZSB2YXIgJDogYW55O1xyXG4od2luZG93IGFzIGFueSkuZ2xvYmFsID0gd2luZG93O1xyXG4vLyA8ZGl2IGlkPVwibG9hZGluZ1wiPlxyXG4vLyAgICAgPGltZyBpZD1cImxvYWRpbmctaW1hZ2VcIiBzcmM9XCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhrQUdRQWFJR0FQLy8vOHpNekptWm1XWm1aak16TXdBQUFQLy8vd0FBQUNIL0MwNUZWRk5EUVZCRk1pNHdBd0VBQUFBaCtRUUZBQUFHQUN3QUFBQUFrQUdRQVFBRC8yaTYzUDR3eWttcnZUanJ6YnYvWUNpT1pHbWVhS3F1Yk91K2NDelBkRzNmZUs3dmZPLy93S0J3U0N3YWo4aWtjc2xzT3AvUXFIUktyVnF2Mkt4MnkrMTZ2K0N3ZUV3dW04L290SHJOYnJ2ZjhMaDhUcS9iNy9pOGZzL3YrLytBZ1lLRGhJV0doNGlKaW91TWpZNlBrRWtBQVpRQ0FnT1lCSnFhQloyZW53V2FBSkdrYWFDbnFLa0ZvNld0Wktxd3FheXV0Rit4dDU4QnRidGR1TDY2dk1GWXZyakF3c2RUeExmR3lNMU95ckhNenROSjBMRFMxTmxFMXFyWTJ0OC8zS25lNE9VNjRxams1dXMxNktmcTdQRXc3cUR3OHZjcjlMbjQvREg2bnZaMkFCZ2dZRlkvU1A4NkJkUWhvQk1CQVFzUERrcFlJT0lOQUtBZVdwVG9oLy9peGhvRFVHbmt1QVNBd1NBZWlRU0FOWkprRVpPVWlxUWNRdURXdzVNdWVjQ2tGQUNuRDRvQ2hqVDBkVE5uajBrOGVmcmtBVlFJZ0pyS0NCck5nVFJwMGlGTmc0VGtOdURqMUJFN3JTWmRlaTVoVUNBcjBiWDg2cUtxV0t0Q3N2NkE2dTRoV3hadTMxb2xpME51ajZIL3V0NDlFVmJ2Vzc0Mi9BcWsrNi9vWUJGNURZdEYzTTdzajYwVVExRitUQ0d5NU1QaExQZEltN25BV2M0ZFBIOStHL3JmNlIyTUV4SkFuVnIxNnNrL1JlOGduZGtyYlFPMmI3UHVvZmhpN01DL05RUVhqcHVwN2h5QU0yOU96bUE1ODczT1hlOHUzZWsxOVFyV3J5dk5ycys3RGN3VUNVei92aUM4K0o0N0tBN1F3WHNtZXd6dmhjZFBPQi9IVSs3L3M5MlhnWHZpclpjUGY5QnhWNUdBR3VSM1cxbkkzVkFmZ2d3TzZPQm5CcVlnSHc3b1VaUmhoY0JkS05tSEpteG93NFRhZ1dpaGlJYjFSU0VOLzVXbW5vcktzYWdYaVNTWVNFTjA5dEY0QVlIaTNhQ2pEQmh4MTUrUEs5cUlYV1VSenRCaFFyNGhxU1JvTkF3SkE0cjZISWxra2xOU2dtTUlWcloxbkQ0emJybEJsMHZLRUdZTFBENW5KZ1pBWGxmbGl5OFVLZU9icWFFNW5wcDB1dkRrUDFIaUdTZHpNNlFYQTViMGFJbG5qWHJDNTQ5c01ZeXBUNkNMR3RDb2w0ODJCa09iS1ZiS3dhQzNmY21Cb1dJQ0tLcW5senJxQXFrdC9EbXBweCtBK3VBTHJLNkFhRjJ3Z3BEcXFSalVxb0trOUZDYWE0aVgwZ29wQzV4bU9Td0kvN0ppdU9xeEtzUllHcS9ETnVzc0M3NmU0Q285NWkyN2diV0dVVXRCdGlYY3FwYTR5KzZLTGJRb0FPdU9zTjYybCtxNm1xWmdyamdCeGh1Q3VpcVFDNW03Nk1DcnJ3TGd0dGd2dXlWczY0NmlBM3RRTUpVbytLdXJnbVUyekN5L0owajhBY0RpZEd2eHAvTkdqTEFJOTNKVDhjZTZYb3B1QTVtWklHMXZLSU1WY29rVW1aQnNvakdUZ0hHT05ldXM0SUk1UTdhekNDMlRvREE2SGdmTndkQmc5a3d5eFNzSC9UREVSRHZOTE1mY0pDMkp3TWRNTFZZSlJZZHdNNjVSTkRSQTFMVjRuV1lJbUxUdDl0dHd4ODN3MGo5emZTSmRXc3VqOWxWWkhDM08zRWdFRUJzQmRnZkR0QlFsYzFONERBT2xJcGdiSnBWMCtCTXZGMmNFQVA5akZ3QzRHVldoemNMa1RtU09yK2ZJY2t3NEczbVJuc0xlZTBwaFoybUx0eUE0TVdldjRabnFoTTFjTnNWSkJPRDNLWGwvRVJ6dUpMQ082UlFDWUsxTTdLdi9MaEx6U29UNmtwN0V3eWc2N1pkZkQ4dm13Z3RYL2I1VFJwNUY0L3A4cjZ2eXNRU3ZSWnptNTJsait4S2lqNHI2OGFjSC9mVHZ3ZCtnaVBwREo3OG5KL01CK1RKRFB5czBTM3dDZEZEL0JPSzhmUUFCY3o4N25SamVoNVlDTFhBMERjeVhENUwzczA1d0R3dFR1NkFFZ0NUQ0g4eHVHU2I4WDhmQXNMY1NQaUE4TGd4QzVqNDRBOTkxOEJTMTh3THJFT2lmYThWaGdCbUpZWFVhYUxrckdPOTRWQW1YSFU3NGlRTGlSWHVtNnNJUld5ZWg1dUNCaVJxOEFRZi9iNWcrTGt4eGJUQWFTeDhnQ0xUNmNkRW05OVBCRjhGWVExWDVBWE00c09FWmZlRkVKYXlSYWtRU1lpQ0FPRWViNkRGM3FmTGh3S0RZeDFDazhTS0JETlVmMThIRVFzYkNMdXRMcFBmU3BjSXpGbVFMZDJUT0lxZkJSMGVxSW9lWWxHVCsza1JHVHo3eWtEb1JaZjQydVlzdG1sSVZrQXhESmd1a29rYStFaFdnRkVOaFZDbTkrOGp4bG81REpmNTRxVW5xZEJLWUFCUW1FbVo1SFI3ZXBaVElCQjRjZGtuTUVUM0dsdEgwSUN1UFVzMWlUZ1diMlh4Y0haalpUSmNjTTVvU3hBTTF1NG5IZTBBem01NjRKQi9JNmMxN3VCS2UydHdqTzN2SnlFcHlNWjJDb0tjaXpVSElQc2F5RUFKZHpUYW42YytmeVRNUkNiMFJPeEozLzhaY0xpS2liUHhHUTJXalROVHRVNHp4b0tpQzZvalFqM2JVRUVTVXowSmx5YzZWMHVGMWN4UW5MK2paajRLcTVhVHE1S1ZMeDdsUk9uNWpqVHRkNGcwdFNvMTFobzhqS1NVS1R2WFpxS0RlUWFTNEFHZzg5cGFUcEtyaW9mZ3c2aWpOMlZQTk9mVU9ENXVLVFQ4aFZaSlk2NnQ2cU9SQnA2SlZhMzRGcXFaQjZ4OEdKVmM5TkZDbXFDRlFYZlZRc3JMK0pqeWN5UnhKMlNwSXRsVE9FMFFWa0cxb015RzgwaWd5ZS9VRFhmenFJN2RFMWc5cHdlcWlrUElkemNMcXNrb0xyV2hIUzlyU212YTBxRTJ0YWxmTDJ0YTY5cld3amExc1owdmIydHIydHJqTnJXNTN5OXZlK3ZhM3dBMnVjSWRMM09JYXR4RVlMWmFaa3R2VUd2K1lWSGVWZmE1eTJ5aGROSkd5dW5weUxuYTdkTjN0VGttNzNyVlJkOFBMSXZDUzkwTGpQYStEekt2ZTk2UzN2VUdpQVh6WHU5ejU1b2U5OXAzVmxwamJLUHptOXpQdi9TK0E1U3RnL2RTM3dQcVZBWUlUSE4wRkQ1aTZEdFpMZ0NQTU53aFRHQzRIdnZEWENLeGhETyszd3h1Mk1JZ25yR0gvbGpqRElJNEpoMU84MUhMd043c3JUakdKTDJ4aUdxTll4akVlOFkxMUxPSU96NWpDTlFieWpuMmNZeUovbU1VcTd2R0pqNHprSUVmNHgwOHU4cEtSOUdMclhzUWtXTTZ5bHJmTTVTeXpFOHBON2JLWXg1emw0NXI1ekdoT3M1clh6T1kydS9uTmNJNnpuT2RNNXpyYitjNTR6ck9lOTh6blB2djV6NEFPdEtBSFRlaEMveGIvdEliR1M1TC9pbWhJaEtYUmVrQUtwQmtCMmQ5a0ZFU3FtYlFkYmxmWjRYSEdOczVrRDJBZnN4eE56N09lWDNHUHFjSHEzcnZRTXEvNVdYVWI2RXBxL3IxVmdhbFdFbUZ0YmM2ajl2cDlzaVlEVlgrdHBHQ3pVR1ZtYmU1VUEybnNNVERiSEVDVnlCZERqWXhaTmhzTXFydzJGTWpaRDJacVczTGQvSFlrd3oxVGsrTGpvK0oyU25MVGJjRG5zcHViMVgzM0ZMQXJiMFJ1dDk3YjlpNitHVmRsS21xajMwZzBCTUQ5blkyQkI1eXA1TjAzNWRxcjhCSzBGZDFaTlhoUEdoNENnMU9iSFJKM0k2dlBTL0YycTdmamNQcDRya1UrQjRzUDV1SG9CamtFSks1eUtUSjgxaVQvNjh2VFlQTDdaSnppRm0vNUdWZytCcDQvMXVjNi8rUTRtQ0VlOUh0N2l1WHBmdkhGaHh4dmw3dGJYMEFIb1VsMXZvZWJqN3VhSlZ3NnhtUHVjV0s2OE9EempPSEF0VzN0SGhJOHB4b1BJNzFES1VrOXR2T2xIcjV5MDltT2JEWGVpT29qZkx2YWlVNTM2Z21rc0pBRGRTcjN5ZTRXd2h2d2FyQk9BckhlUFY4UGZwSzJnL3poUlNudmdtbmR5WHBucVp4K2dISUtob0ZGQzVWVnd6dC82U1Ftc3VlNERnTG9kWGtobHg1UjRld2JndVVMdjNyWisxM1ltZ3hxbDc0ZFFpS1FucCtvVitnd0hWOEZ0VjJ1MkdoQVBPZEJCMjQwb1JWY05KZm9FWTVJQmVvdk0vVm9xUFQwbVc5SDdpKy9uSWtIYWVEcVhuM3ZDMUN2SG8zczY3dCsrKzRMZjlaTU1IL3oyKzkrZzBrYnVsVUk1UC9DTTc5MThsZWN6QUJZWmhVbmYwNVJlc3MyWFNURFhVS0RnRTNRT2NubWYrRHpYUXVvYk50MmVZd0VnUkdvYXpLRGdiUzFmdVdpZ0NOQWdLc2xnaGRnWlJ0SWdiVmxmU1pnZ2ljSVk3WkZnaVVJZ2kzb2ZMYWxnaXNvZ3pPSWc3RGxnU2ZBZ2pyRGdhMWxQTGpqZ3psSWZLNWxnejJvZ3lHSWY2d0ZneGxBaEVXSWZLK0ZoRWtvZ1NoQWhhcmxoRStvaEQrSWdxb2xoTExEaFZIb2VWK29oVnRvaGZZQ2hLUUZobUdJaGxkb2h0NkNoU2dBaFM3RGhLTUZoMmVvZ1oramhsSmpoM01vaGc3bmgwR0RoM2tvWGk1QWlKdkZoMVdvaDRxbWlCYURpUGdCaUhYb2hYMUlpWHZvaGl2QWc1WFlYd29taVpQSWlVckRob2ZpaVRmL2FJa05JNGVYeUlodElZanhBb243ZzRrdElJb2ZJNHVqQ0l1TmFJcmU0b3F2cUlwMXdvcWY1WWdxUUlkdFNILzY0b3UyUW9wdnlJQnhDSXpCaUl6SlNJelZZb3pIYUl1cnlJeFVabzFwU0kzVkNJMUhoNDNaeUl1ZGlJdHZJbzJwYUlnMmdJcE1WM3R4NUl6UjRvMENRbzdsV0Y1bUI0cVZRb3Nud283dEtJNHFZby8zS0lVNW9JdTd4bzJZaDJyMkpwRDc2STdUU0liL2lKQzB3VG8rc0h1UDU0SkRSNUFMNlk5MnA0OFY4bnNQeGdNUU9SckttSTRVV1pFS2VaRUcyV0RZNTVFV3VSc01hVXdueVpGR1NKSTBtQ3NhbVhZcW1aSi81M3g0QjNlRW9ub3ZXWk0yR1kzdlYwRS9DWk90aHpJUE53UWRLWlFLbEpOanBFUkN0cENVM3hkcm82VjlUOW1URVNsNVUybFpLbUdWTHVrOVRDbHdrK0JVVVBsQUE4VmFYeldXU25rWVgxbExYSG1WU3JHV05JS1daRGtXY09ramNobVZGbWhvZDhsNWVabG9lNWxvVHZDWGdCbC9iVG1ZU3lDWWh0azdoWm1ZNHplVWpCazlpL21ZUllDWWtybVZqbG1aUmtDWm1NbVRsN21aU0JtWm5tbENvQm1hS0RtU3BQa1NXbGFVcDdtYXJObWFydm1hc0JtYnNqbWJ0Rm1idG5tYnVKbWJ1cm1idk5tYnZ2bWJ3Qm1jd2ptY3hGbWNHSkFBQUNINUJBVUFBQVlBTExVQUZ3REZBTDhBQUFQL2FMQWIvakJLUTZ1OU9Pdk51LzlnS0k2alpKNFRxYTVzNjc0dEtwOXdiZDk0ZnMwOEJPakFvSEJvNlJsL3hLUnlTVEwya015b2RHcHc4cURVckZabm5XRzM0RENySy91S3orZ09HV1ZPdTkvVnRha05yNGZsYzdzZWpaZlE5NEJNZlJGL2dZWkRnejZIaTRLSkRvV01rVFdPajVLV1FKUUJrSmVjSlpTYm5hRWVtYUNpcGhta3A2b2lxYXV1YXArdnNocXRzN1lVdGJlenVicXZ2TDJydjhDbndzT2l4Y2FkeU1tWHk4eVN6cytNMGRLSDFOV0IxOWg3bVFIYm9kM2Z5cG5pbk9IbGx1Zm9rZXJyaSszdWh2RHhnUFAwZXZiM2RmbjZiL3o5YWY0QlBDTnc0QjF5QnUwVVRLaGxJVU1xRGg5S2lTaXhFYVdLYmloaVRLSngveU1paEI0UFhnd3AwaEhKa29sT2d1bW9FZ2ZMbGpaZXdvUWhjNmFMbWpiSGdNeTVCQ2ZQSmp0L0V2RXBOQVRSb2grT0lvVTFjcWtRcFU1cEJZM3FjaXJWcTFpemF0M0t0YXZYcjJERGloMUx0cXpaczJqVHFsM0x0cTNidDNEanlwMUx0NjdkdTNqejZ0M0x0Ni9mdjRBREN4NU11TERodzRnVEsxN011TEhqeDVBalM1NU11YkxseTVnemE5N011YlBuejZCRGl4NU51clRwMDZoVHExN051clhyMTdCank1NXRTVUNCMjdoejY5N051N2Z2MzhCL0N3aHBPN2p4NDhpVDZ4NUFYTG56NTlCdk0vZFlQTHIxNjcybmI2eU92VHQyQXMyOWk3Y09udnI0ODgvTGIwZlBIcmw2ak56YnkrZjl2bUw4K2ZoeGg4L1AvL2IrL21INS9RZmdmQUlPMkY2QkJxS0hZSUxqTGNpZ2R3NCtpRjJFRWxwSFlZWFFYWWloY3ZWSmROK0c1R2tJNG5FZFB2VGhpT21KaUNKd0pUSjA0b3JKYVFjZmpOZkphRjl2Qk9TbzQ0NDhFakRBajBBR0tlU1BBaFJwNUpGSUNtQ0ZCUWtBQUNINUJBVUFBQVlBTE9nQUpnQ0FBQWtCQUFQL2FMcmMvcEFGRUt1OU9Pdk5JUWdnUUhWa2FaNG1xRTRqNnI0d3VjNWliTis0OHMxMG0vOUFEVzg0Q1JxUGp4MlI1ME02Yzh0bzgwbEZSYS9GcXJha3hCSnIyM0RHNjUyS3o0c3VXWXB1TDlacnM1c0toOC9GNnZwU2ZqL3F5WDFiZVg5TWdWcUVXSVpWZzRncWlsU01qVm1QU0pKTGxFNlJqWHlZTnBaRW5VZWFpSnloTHFPSXBrR2ZRNnBBcUgrbHJpbXNNN001c0hxeXR4MjF0cnlldmlxN3dCbTVlc1V4d283Skw4ZHd4TTBXeXlEU0x0U1QxaVRQZHRxMHk5SGVEZHhrNGVJUzFPY3kxT2JxNUlEcUhOanQ1KzllOGZMcCtFTHMrOGJZL3NiMEMyakJYaUtDMHdZaWhJQXR3TUlJQnE4OGpEQnZZaEtBRmgxVXpNZ2cvMklVamgwM2dqUWdFcVRIU3lNVmxPUjRFbFRLbGtQb2lXdVkwZ0RNUWlsWFpyejVLNmRDa3hocjhneFJNMlN0b2hvL0liMjRhYW1IVkU0cDZvcGFnUnZWQzdsa0NqMTRWYURMcmhvR2FhV3FCcXlKSFdQTnBqWEx0cTNidDNEanlwMUx0NjdkdTNqejZ0M0x0Ni9mdjRBREN4NU11TERodzRnVEsxN011TEhqeDVBalM1NU11YkxseTVnemE5N011YlBuejZCRGl4NU51clRwMDZoVHExN051clhyMTdCank1NU51N2J0MjdoejY5N051N2Z2MzhDREN4OU92TGp4NDhpVEsxL092SG5Pd0FFS0VCRHdsMENCNndRYzdvMSt2ZnVBdmRhN2k2ZCtWNEQ0ODlLMTAwWFBmb0I2dUFQWXkvOE9sN3Q4K2VUYmhyOHZQenRiOC8vOEJlZ2VXUHNGeUY5K1RnRm9vSUhUT1dYZmdndjZWMVI4RUZaWUFIMGpQV2doaEFoYVZPQ0dFRW80a1lJZ2JpZ2lRaCtXYUNHR0FWR280b3NkcXFQaGl5V2VlRTZLTkpZNDREa3o1dmdpaTliZzZLT0tEVnBENHBCRDJnaU1BRUlpcVNLUXhSenBaSTR4QXVQaWxEa1cyVXdBVFdKcG9aSzhjT21sajFBdU9hYVBWZkp5NVprZ2dubExBR3V5dWVKN3hZZ3BwNDdhTUhsbmlXbmVJdVdlRE5KWlRKeUFDaWhvbUlRV2VsK2ZzOWlwS0lPTXV2TG5vK3k1ZVV1aWxKNVhwcFdaR25ob21GMVNhaWt2ZW5aNlhxUm1tb3JkcDlaZ3VpZXFXN3A2SmdFTE9Rb29yTjZVZXVlbUFVMDZKYTd4eUVvanI3V0dXaU9yRTltS1psUXl2cHFJTEVqQ0dnaXNSWEQrMkpheUVUNjdsSzRMVGx0VXMrSVJhNWFzbzdKVjdYeDVZYnRqWGlTV094ZUYzc0tGYXdJQUlma0VCUUFBQmdBczZBQmhBSDhBQ2dFQUEvOW91dHorTU1wSnE0WGc2czI3NzBBUWZHUnBuazhvQmhucXZqQzJ6bTFzMytTc3MzanZVNnJkN0Vjc0dvSkNtbkVaUXlaMXpLakorZFRWcE5oTGRjdkxlaVZVN3U1TGJvVEZ1MnNaZTBZTDFldWxldzZQLzlyelpOMXV3K2VmZkQ1K2YwOTdnU1dEaEZXSE1JcU9Jb2FNR29tUGk1SWZsSlZWa1pjeW1wK2NuUXVabjF5aG9xV3BJcUpncXFtbmg2U3VtNndwczZDMUQ3ZWZ1UTZ5dTJtOURML0FTc0lLeE1Vcng4aktqckNCem9yUWZNbksxSGJXeXN4SDBvVFljZDUvNEd2YXdPUmw1c0RjNnJ2b1pPMno3MnZpYVBOeDhiemN1dlY2KzU3OVZ0eVRGSERaUHdvQkI0cktaK3FnQm1rS2V6RVU0dEREdVlvZUpuYkJhUEgvRlVjVHBUNmVNQmRSNURPUkwzNlZSTGtnejBxV3pjUzhoRGxxeTB5YURDemh4QkhtNXM0R1ZuNFNVZUZUYUFxalNKTXFYY3EwcWRPblVLTktuVXExcXRXcldMTnEzY3ExcTlldllNT0tIVXUyck5temFOT3FYY3UycmR1M2NPUEtuVXUzcnQyN2VQUHEzY3UzcjkrL2dBTUxIa3k0c09IRGlCTXJYc3k0c2VQSGtDTkxua3k1c3VYTG1ETnIzc3k1cytmUG9FT0xIazI2dE9uVHFGT3JYczI2dGV2WHNHUEx0aUNnclFBQ0JVYWtEWUM3UUFFQ2FRZjRIbDZnZGxrQnhJa0RIM3M3ZWZJQllYazduNjY3cS9EcDA2RnpSWTY5ZS9XcjBydDNYMjQxd0hYeDRvMVRQWThlUFZYdTdlTnJmeG8rdnYzdlMrSGJ0MCtlYVlEOS93RG05cFIrQVlyWEgxTzlGWWllZXY0cEdCOVU3RG1ZSFgwU29vZWZVZ1JXcUJ4VUNXcVlISU5ML2VlaGN3Y3UxZUdJdm9Hb2xJZ29FbmRoVWhtT09GOVRKNkw0SWxJc3R2Z2Joem9PcDJKU09iWllvbElSb2pnamdqMzZkcU5STVhvNFpGSTFqcmlrVUVHaStDUlNSWTc0STVSSkZnQlZreG9lYVdLWFUvNVU1WWhYR3BXbGgyWCsxR1dhUW9GWjRaWklSY2ttaFVtS1NTU1pVTDM1WlpkMEdtVm5oWENhMmFXZVNhMnBZWnM0bmVraG9rakpLU0dqT0EwcVlhRTdPYXBob0VJcFdpRlVtbFlJS1pOOFBtV3BnNWcyV3FwVHB5cVlLazJoU3NqcFQ1NUtHRldyQlk1SzVhbzBKdmtxVExFNk9PdE90YnA2YTVMRDRpUnBnRGNFSkxzVHJ2SlJhcWlHelZwVjdIZ0NTTXRscnRwaUdPQUF6ckxLWDdoNEdraHVWSW8yMisxVTA2bHJsbjd1b29WYnZMdWR5MHdDQUNINUJBVUFBQVlBTExVQXVnREZBTUFBQUFQL2FMcmMvakRLU2F1MUlPak51LzlnS0k0aWNKMW9xcTRZNmI1dy9MRjBiZDlNSnU5OHIrSEFvRENpOHhtUG9hRnlpU3NpbjArbWRJcHlRcTg5cW5ZTHNXSy9NSzVZN0FXYlJlTTB0WHh1ZDlUd0pkdE5qOXVEYzNyN3pyZmw5V1o5Z2l0L2dGK0RpQ2VGaGxlSmpoU0xqRkdQbEErUmtrZVZtam1ZZXB1Zmw1MVpuNXFob2p1a3BhZDdxWlNtcTJHdGo2K3dMckt6dFdDM2pyUzVhTHVJdmI0Z3dNSERqY1dDd3NkdnlYM0xQQURTMDlUVjF0ZlV6dHJiM04zZTMrRGg0dVBrNWVibjZPbnE2K3p0N3UvdzhmTHo5UFgyOS9qNSt2djgvZjcvQUFNS0hFaXdvTUdEQ0JNcVhNaXdvY09IRUNOS25FaXhvc1dMR0ROcTNNaXgvNlBIanlCRGloeEpzcVRKa3loVHFsekpzcVhMbHpCanlweEpzNmJObXpoejZ0ekpzNmZQbjBDRENoMUt0S2pSbzBpVEtsM0t0S25UcDFDalNwMUt0YXJWcTQ4RWFOM0t0YXZYcnp3TGlCMUx0cXpaczJIUHFsMDdOaTNidDJYZHdwMHJkKzdidW5iWDRzMkxkaWZmdHdUMi9oMGIyTzlndFlWMUhrWXMrSERpbkl2UFBzWVoyZXprbTVYTFhyYVptZXptbXAwSk54NzhtV1pvc2FWbm5pNlFXdWJxMWpGZmovNExHNlpzdzZGcnYxdzlZRGJmM3JnN0ExZDhlamprNHI3ekdxZU1QSGptNVppYkV3OE5uYlAwNDlTVDI2ME8ranJ6N000ckM5QStkM3o0eU9hbmQwNlBmVDE1dU95L3V6Ky9PSDcwMFBhdDQzLy9Obi8zL1YzMEhlYWZhYWNOcUZxQi9MRVZRSUpyTFJqZ1lBNnFsMW1FN1UzSW9Gb1V5bWZoZzM5bGVGOW5IdW9ING9WbmhmamZpQnp5WlNLQm9hMTRZSXNrbXVXaWE2Zk5HRnVOTWNhVkkxazlyZWJUQmxvTklDUUJSQklKbUc0dkpRQUFJZmtFQlFBQUJnQXNZQUR1QUFnQmVBQUFBLzlvdXR6K01NcEpxNzA0NjYwQS8yQW9qbVJwbmhrUUJCN3F2bkFzeitacXQzU3U3M3l2cVRhYmIwZ3NHbDNCSk83SWJEcWZ3R1J3K2F4YXJ6Q3Bsb1h0ZXIrYXJSaE1McHVqWWluVnpHNGIwL0MxZTA2UG9lRmJlWDNQQitIL2VuMkNneEozZjJLQmhJcURob2RwaVl1UmM0NlVLNUtYZkkyVmo1aWRiWnVna0o2alJwcWdlS0trcWp1bnJRR3JzRVd1cnFteHRpU21zNGUxdDcwYnVzQzh2c01UdWNDVXhNa2Z4OHpDeXNuR3pKWE96NzdSMHNqVjJoSFgySURiNEE3ZXg5VGhxOTNqY2VibTZPbGo2K0h0N21ydzRmTzA5ZHZ5OTFQNTJ2djhMUG1yQnBCZnVZR1hDdDQ3aURCU3dGQU5vVDJjRmxIaVJFY01Leks2aUZILzR6Q09qangrQklsS3hnQUNBa1JhVVpndUk0VUFCV0lTZUtVU0Nra3RMaWtRaU1selFNMHFMTW5GZ01temFNcWZUbTZ1eURsaFo5R2lNNUUyQ2RwS2hvQ25XQXNNb0NtMUZFZW1FcktLOWRuMUNOV1FNUWFJWFh1MGJKR3o2cktzblJ2VnJheDVKdWZxM1dxWENGeDZjdlVLYnR1M3g5K2xNcHdLMW91eThKQy9ZQ0ZjWFV5NXJtTWV3UkpUM3F6MXN1RlpWamx2SnV1WlI4SElENGlLWHN5MXRHbUthVmN2SnV6Njh5RVpxbVd2SlZEN3lMY1lpbldMYmQzN01SemN3dWtXbjVwSGMvTGh5NTNjUWYxZzhuT3NwS00zdVRIanVsanRWNmcvVU92OUtXM3dwSEtYTDhBYmZTenk2Mk1TZCs5SmZmbjI5RlVGWHo4Ly95WHIvL0ZsNTE4biszbUgzNENkQUxqZWVRaEdFaDlQQnpZb0NYeng5U2ZoSVBaNUorQ0ZpaFRvbllVYzhwSGhkUXlHMkllSHowVm9vaUFLbGxmaWluV2dtSnlLTU81QklYODFZdmhnVEJ2bVNNZU41ZmtveUlqUHZTaWtHVElLUitPUmJCQ1pISWhNa3BHa2JrdEdTVWFMSDFwSng0NmRhZWtHa041NTZZYVR3aGtwNWhWZ3BuaG1rMXhDdVdZVlU4clc0NXRYWUhtZG0zUTJFZWRxYytiNWhKMHordmtGbWJxWkthZ1JhUVo2S0JhRXlvYm5va1BzS1ZxZmtNclNacVZXU01xWm9aanlBS2lTblZaeGFhaE9DS0RwWWxXU09rUUFpYTcycUtxZW5qb1dyRmV3K2h5dGpKNVVLSzVkMkNwYXFyd3lZU3BucndaTGhLK0NBV3RzRXlQRDZsWHNzckkwbXhXbDBGYUJMRlRWdGlIQWpaeG1XMFd6eW5xTGhhblBpb3RDQWdBaCtRUUZBQUFHQUN3bkFPNEFBZ0Y5QUFBRC8yaTYzUDR3eWpiSXZEanJ6YnYvWUNpT2tWQ2NBcW11Yk91K3NCZ1E1Mm5GZUs3dmZCNE10V0NxUnl3YWowVlRjQmxBT3AvUWFHYTJyQTZrMkt5VytLdDZDODJ0ZUV3R0FiL2VXM25OYmlzRU5QUjM2Szdib1ZRNVduM3YrM1ZuZW5KWGY0V0dLbkNDaW1HSGpZNFllWXFDZkkrVmxnYUJrb3VYbkkxS21wcVVuYU50a2FDYWRLU3FaSm1ub0t1d1c1K3Vyb1N4dDBpbXRLNk11TDQ3cmJ1dW9yL0ZMTFBDd3IzR3pESnh5ZERFemRNYXdkRENxZFRhRThqWDE4dmI0UXU2M3RDMjR1aGQ1ZVVFNE9qYTNldTdCTm52OE0veXlmWDIwK1Q1dGU3NE1iUDJEMVE3Z2VFU0ZjU0djSnUvaFpMT05XeEdFS0tnQVFFbjRvcG5jZjlTUm8yeEhuYVVzdzhrcm9vanYwZzArUXRseWlVSFdUYmorRElJUFpuVVJOWXNpZk1YelpRcmV6TFRDVEdtMEcwL0M5NDhLbzZvdktCTXNRQTRrclFjeHFoakFBUUlNTFdJMDJSR3NXYlJ1blVyVllnOHhUb3B5N1pyRVh4VzFXNGh5N2JzMlhWaDVVS2hXNWZ0RVplUzh1cDF3cmR2V3lOVkJhVWR6TVd3NDQ4eEFLT0J5cmhJNGNlSHZjSlZKTGl5WmN5Zzd3WmU3RG5IWmRCOTNmYjRXb0IwYVJ5b1kwT0dVWlh5YXgyblpSdit1MmYyN1JlNWRSdFd6Y09mNjk4dWdndmZqWGlKYmVRNGxDK3ZTNXpIbWF2UWtVaWZidGZJRE4vWllYTkhYVDM4cmUzanpROGRqMXA5TWZUY3k3dFhCWC82L0Yvc1FjdS8zNm4rY3Y3L3VPU0gyWDRBV3VLZmNBUVcrTWlCdWlrSWk0Q1BKZWpnSVF6S05xRXFFRG9tNFlWL1ZCZ2JoNk5rNkJpSW5ZaVlHb21YZU5nZWlwYVlTQjJMbGFnWUdveVB1SmdaalkzWTJCMk9GT3BvRm8rSCtNZ1ZrSWJJaUJtUmhnaTVJWkpqQ01sa2h6NHUrYVFXU2s1NWg1R1BXWGxIbFZyVzRXU1hibUE1SEpodWZFbm1HbUl5ZDJZWlhLNlpsWmx1aXBIbWkzRTI2V09kYitvb0paNnIzY21uRm5QVzlTZWdVUTZhQlp5R1BoRm9XWHNtR2dPaWpoNng2RmFOUnVvQ3BKWjY1V2Vta2hiSzZSR1lmb3FicDZJMnBtT3AzdW1KS2hHTFZycXFEQ2E2K21vSVlzbzZLNnpzQVdEcnJiaE90eXV2SWpENEs3QWpJRWhzRk9nTmU2d0tHUG9wdXl5end6bjdyQXFGNlRxdEdJeEtleTBMMW9hUUFBQWgrUVFGQUFBR0FDd1hBTG9BdWdEQUFBQUQveWkxM1A0d3lrbmxNRGpyemJ2L1lDaU9wRFpVYUtxdXpsVytjQ3pQMmNuZWVPN1NmTy9EdHB4d09Objlqc2drZ2Noc01vekpxRFMyZEZxRjBLbDI2NmxldjZzc2Q4ejFnczhVTVhrZE5hUGZEelY3N29QYklYSzZYbmJ2UC9lQWRYNTllWUdHSUlPRWg0c3ZpWGVGakpFR2puYVFrb3VVY0phWGhwbHZtNXlBbm1pZ29YcWpaNldtYzZoZ3FxdHJicTFFcjdCanNyTll0cHk0dVRpMXUxcTl2aXpBd1ZMRHhDckd4MGxCeWpyTmpNL1FOOHpTU1FIYTI5emRBUUxnNGVMakFnUG01K2pwNWdUczdlN3Z2ZGZZOC9UMTl2ZjQrZnI3L1AzKy93QURDaHhJc0tEQmd3Z1RLbHpJc0tIRGh4QWpTcHhJc2FMRml4Z3phdHpJc2Yrang0OGdRNG9jU2JLa3laTW9VNnBjeWJLbHk1Y3dZOHFjU2JPbXpaczRjK3JjeWJPbno1OUFnd29kU3JTbzBhTklreXBkeXJTcDA2ZFFvMHFkU3JXcTFhdFlzMnJkeXJXcjE2OWd3NG9kUzdhczJiTm8wNnBkeTdhdDI3ZHc0eklDUUxldTNidDQ4MGIxeHJjdjM3MStBL2NGTExqd05zS0dDeU5PSEhneDQ4RlFIeXVPTExreDVjcVFuMkwyNjNpenRzNmVRVzhXalpsMFpkT1NVVDlXelpoMVl0ZUdZVS9XN05tYmJNRzNMZE91elMwMzU4dThQd01QN2p1ejArQzloL011L2xkNWJlYTJuWWVXUHBwNmFldW5zYWZXdnBwN1lnRFF1WUgzYm5qODd1RG1qeU1Qa0w3cGV2Ymh0N1ZuK243KzB2cnh0ZGxYaXA5ODRmMUpTZlYzSG04QUlpV2dlc2dWZU5TQjdxMm5vRkVNMHVkZ2Z2RDVKOWlEUlVWNDM0UVdCb1loVVJyeXgrR0F0WDA0VklnQmpvZ2dlaFNhS0JTS0JxNG4xWHN6eWlqVlhhRWxBQUFoK1FRRkFBQUdBQ3duQUdZQWRRQUFBUUFELzJpNnZCSXR5a21ydlRockZrZ1pXeWlPWktrTVJWb0ladXUrbTZDcUJBVGYrTnZOODJEbndDQUd4ZU9CaE1pa284Z2tzSlJRM0k3Wi9FV3ZKQmwxZThSNk5kUHQ5dmt0VTRoaXNkUE1abWpUOEZxYmpZYkR1L1ByMjg0bjU1VWVmSUlGY245SWU0TjhQb1pBWVltRGVJd3VpSStEZnBJa2pwV0poWmdqbEp1Smk1NGJtcUdWbDZRVm9LZVBhNm9WcHEyYm5iQU5yTE9ia2JZR0FYVzVzNm0yc3NDVnRid0d1TVdjVnJ5K3k3bTd3NEhRcDhLd3l0VjJ4N3kvMnFMTjA5K2gwdGpqb2RlcTN1ZmI0YkRFN0dMbHF0bnhUT21rNi9aYjd1L1UrMk9RU2FnWGo0REFNd0R2SGFRQTc1ekJoYXYrMmVzSGtZRStiZk1xY3BENFRmK2pCZ0VjbCtIekdJR2dNWklobmtHamlKSmhTRm90c3dCakdUUFdSVVUxVFRSTWszTVNxcDR2YmhaNUNOVEZUaFUwaThhNG96VEh6YVJOVTRiTUdMVUVJcUpWZ2FBWm1WVW5BYXhkdzRvZFM3YXMyYk5vMDZwZHk3YXQyN2R3NDhxZFM3ZXUzYnQ0OCtyZHk3ZXYzNytBQXdzZVRMaXc0Y09JRXl0ZXpMaXg0OGVRSTB1ZVRMbXk1Y3VZTTJ2ZXpMbXo1OCtnUTRzZVRicTA2ZE9vVTZ0ZXpicTE2OWV3WTh1ZVRidTI3ZHU0Yyt2ZXpidTM3OS9BZ3dzZlRyeTQ4ZU80QXdRQUFCaUFjdVhNK3o2Znp0ZjU5T2ZSOFY3Zm5wMnU5ZTNYdThjRlR4NnEyZkxseGEvOWpoNjhlclR0NDc4bnl6NCsrZmxpN2V2SFg3VytmdlRmL0NuMTM0RG14ZVFmZ2VXSmRTQ0M3dVhIb0h3S1BoamZXQksyRjJCT0MxYW9ISVVhM2hkaGgrQnhDT0oxSW82STNZY21QbGRpaWhmV2xLR0dLNXJZb29FcFV1ZGdqUVcyOUtLRU04YUU0NFkzMXRnalNqdEtHT09JUTVKVUpJTkprdlJqamtUKzJLUkhUeDRKNHBRVkxjbWdsUjJPcFNXQldGWlVKWW9zY2dram1US2FXYUdhUnFLSkpKc1BlaWtsbkZ1NmVTV2RDTXFKbzU1QzRra2duMlVHbVNLZ2FRcjZwcDFkK3ZsZm1GbnVXZGFYOWpHcTVJaHFRVW9lVzVhRzUxYW1RTDVscWFSS1FWclhrcUQydDJOZUdWYkhuVi9zQmVaY3FSWWtBQUFoK1FRRkFBQUdBQ3duQUNvQWRRQUFBUUFELzJpNjNQNHd5a2xOQ0RYcnpidFhBa0Y4WkdtZUlGR3NBdXErOENJTWF6M0dlTDRGZE8wUHVxQ3dFUWo1amdYTWNJa3pJbzgzcHRURWUxcVYweXpIYVVWR3RXQkp0ZHR0aGMvRWdZcE1ScnN0UFRZWitBWno1V1JzZlRuR3k3OTdRWGQrYkhxQk9RS0VoSUNIT0d1S2NtYU5PUUdRZm9hVEw0K1dYWFNaTVpXY2haODRjYUpQaktSVXAyU1NxaWlKcktpdk1KdXlOWjYwSnJHM1I1aTZIcmE5dWNBZm9iMCt2OFVicHNpcHl4ckh5Q3pRSk0zSTFTVFRQOWtldk52SzNSTEN0OC9pRWQvVDRlY1A1TExtN0E3UzA2N3hFdGU5OWhYenlNVDZEL2h1cmZ0bndCMHJlQVRUSWF0SHNJSEJVd2ovOGV2RnNPR0NoNmNHNnB0NHkvK2ZSUVVCWlduVXQ4M0d4d2NLS1o1MGdKRlRSSDBwTzY1MFdITEZ5SGdjWlhuOEdKTFZUWFk1RDg1azBQTlV4WTgxVnd5VmtYU254WmFjZnA0TENuR3BBcWlXcElxakt1cWx2YUtpampia0tzcXFnWmc2eldKVjVMUWhXcGRhMmExbEkzWWxXVFp0aDRMdFFpQXV3YnRRNnBvMXNOZUg0TUVLQ09WRnpKUk5YOFlhREJJNERKbEJ6TVdWV1I0WjRMZnlzY2VaUDlDZ0hMcTA2ZE9vVTZ0ZXpicTE2OWV3WTh1ZVRidTI3ZHU0Yyt2ZXpidTM3OS9BZ3dzZlRyeTQ4ZVBJa3l0ZnpyeTU4K2ZRbzB1ZlRyMjY5ZXZZczJ2ZnpyMjc5Ky9ndzRzZlQ3NjgrZlBvMDZ0Zno3NjkrL2Z3NDh1ZlQ3KysvZnY0OCt2Zno3Ky8vLy8vQUFZbzRJQUVGaWpiQmJrQmNFRUFBTmltNElJSXp2WWdoQmMwR051RUZGYjRHb1laTHRnYWh4MHVhR0ZxSVpiWW1VVWdtaWlpYVNtcUNHRnBMc1pZV1lzeFVqaWlWVFRXbU9GZ092WjQ0MGs1OXRqaFRFRUsyZUdQRWhtcEpJcEtObm5pSkVVNldTS1MyVWhwSlR0Uldta2lsYnBrcWFXS1ZYNzVKWmVmZUNtbWkyUWVZdWFaTHRLeUpwdGJ1Z25ubUhMT2FXV2FlN3hwWjRaNDFySG5uWFgrcVdTZmIrZ3BhSVN2SE5va29XNFlLaWlqYURqNko2Um9LTHFrTHBZS1NXbWptY2E0YWFHZHhwbU5wRitlUTZxVW4wSVpxb2IybkNwa1E2NTZ5dVNocVFJVDY1Rkw3V25XcmF5YWRXYXRwbW9KTEU1U3NyZ29hbXNPQzZ1T0dNcCtGQ1ZzS2paTFpJalNMZ1hpYlJCV081aUMyaEtVQUFBaCtRUUZBQUFHQUN3WEFCY0F1Z0MvQUFBRC8yaTYzUDR3eWttcnZUaTd3SVVZSUNHS1JXbWVoYWl0Yk91K01JWE9kRjNFZUs3dnNPM1h2S0J3T1B3WlR3R2ljc25FSEovSnBuUTZmUjZqMUt5V1p6Vml0K0F3cS92N2lzOW9DZGxuVHJ2ZmExdjdUUmZIYS9PNlBudW41ZmVBVEgwemY0R0dRb01vaFllTU9ZbElqWkZGanlXTGtwY2FsSldZbkRHYUJaYWRvaEdmb2FPbkRLV29xeFdxcks4UW53S3d0QTJ5dGJnR3Q3bTB1N3l2dnIrcndjS254TVdpeDhpY3lzdVh6YzZSME5HTTA5U0cxdGVBMmRwNjNOMTBud1BnejVyajVOTG02T21VNSt1SDR1L1Y2dkxZOVBYYjkvamUrdnZoL2Y3Y3hBdFlaeUJCT0FBUDJrbW9FSXpCaG1jK0VZQ1lSaUpGTkJZdkxxUTBVZjlqbUl3ZXQ0QU15VWRUUjVJbE9hTFVNbkpsazVZdWw4Q01TV1FtVFVRbWI3N01xVk1tejU0MWZ3TEZxWExvcEtKR2czeTZrVlRwcDZaT05VSGw4blNxanFWV3IxYk42bWtyMXhjZ3dvb2RTN2FzdTY5bzA2cGR5N2F0MjdkdzQ4cWRTN2V1M2J0NDgrcmR5N2V2MzcrQUF3c2VUTGl3NGNPSUV5dGV6TGl4NDhlUUkwdWVUTG15NWN1WU0ydmV6TG16NTgrZ1E0c2VUYnEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQU5RRGdRTHk0OGVQSWt5dGZ6cHc1eGViUW8wdWZqdnc1OWV2WXMzT3dycjI3ZCtYY3Y0c1hIMzY4K2V6bHo2dVhubjY5KytYdDM4czNIbisrL2ZyMjVlUFA3MzQvZi9WRS92MW5Yb0FDa2dkUmdmd1JpR0IzQ2k2STNvRU82Z2RoaFAxTlNDR0FGbDQ0WUlZYUd0aFFoeGgrQ09LR0lvN29vVUltanVjUkFDeTI2T0tMTU1ibzRvSVVKUUFBSWZrRUJRQUFCZ0FzSndBbUFBRUJmQUFBQS85b3V0eitNTXBKcTcwNDY4MjdHb0luam1ScG5taktDVVZCQ0lFcXozUnQzMVdydnpIdS84Q2drREhRR1huRHBITEp2QVNNVUJlc1NhMWFnWVJvOUhYdGVyOGlsbGJMQlp2UGFFWjJQQWFsMzNCcWtVMGY5T0w0dk8xSjd5UDFnSUVsYTMxK0lZS0lpUmRpaFkxMmlwQ1JEWVNOaFdXU21JSnpsWlVFbVo5NmZKeVZoNkNtYVpTamRKNm5yV2FpcW4xM3JyUldxYkZhQTdXN1ZZeTRiTHpCUzdDL1dxWEN5RCtieFZ2SnpqN0V6RWF6ejlVcXQ5SXUxdHNxdnRrNjFOemlIZEhmdXVQb0hzdmZMZW51RytYWngrLzBFOWpTclBYNkVkN3M0ZnNBRGJDRGNpNmdRUVByL0IwMEdFOWF3WVg3N2pITEIxRmZ2Mi96S3I0YmVFVC80NzZFMy81NUZOZVEyY09SNlNReUU0blMya1Y1TGQrcC9FVXhwamlRMlZqYVRGYXlXTTJkMW1iKzBnazAyRXVIUmNVSnhaV1VHMDVwR1pzSzYwbFRhbENPNEt3K280cnJwMVplUzJNUi9XcnFxVW15eUxqRzhvcldWVmhWVWR1ZVVxdUtyVnhUYjBlTnZSdnA2Rm0rdE9pcTJnczRrZGxpY1F0TEVzekpydUpJZVRrbGZxeklyMC9LcGhoeklvdzV6K0ZmSnp0RDBseUpjd2tBQUVUWGlFd0tDSUFBc0ZYTHNGd1ZDT3picVdXZndKcjF4K3ZidUhXVG9OM1ZOZkRqQVhJTDd5Q0F0U3pieUpFdkR6TXdkSTNmMFk4cm43N2hjeVBqMmJOdjU0NGhnSE1kazFWZ0R4K2QvQXJuanRXem56L2V2UVh2VUV5VG1NOC91ZjBNL3dIZ3A0MXYvZlZYMzM4U21OZUlmaU1VNkNDQ0dGaG1IUTNyT1VnZmhCZmdGSjhLRm5aNElJWU9LQWhGZWlsVTJLR0JJRklnNG9BK21IaGlnU2xTSUFhRElyajRJb294U2tBaUNqYmVXT0NIT1FiUm80OC9CcW5Fa0VRV2FhUVFTQ2FwNUpJNE5PbWtnMEJDZVlLVVV6NW9KWVZaZHVuZmxqTmc2U1YvVllKWjQ1aFRsbWttQjJLaXlkNmE4cmxKcEpwd2F0Q21uTWpSV1dkNWVQcW81NTRWM05rbmNJQ2FJT2lnWHhiYUlLSW4vcWxvQkljaSt1Z0lrZmJwNktRUE1Pb2hwaDVVaXVhbG5EN2dhWmVobHFCcGVLQ1dDc0dvUktwNjVhbkJ1WG9DckRUS09nR3JNTm9hSjU2cDZtb0JydG41eXVXbndsNDNackUzQU5zcnNpd1o0TXBzaTYwK1MyQ2owZ1p4WXJWTVVvbnRFRkp1cThTRjNpYlJZN2hNbUVndUZjQXRleTZQc1RHYkFBQTdcIiBhbHQ9XCJMb2FkaW5nLi4uXCIgLz5cclxuLy8gICA8L2Rpdj5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXR0LXJ0dGFtYXBsaWInLFxyXG4gIHRlbXBsYXRlOiBgICBcclxuICA8ZGl2IHN0eWxlPSdwb3NpdGlvbjpyZWxhdGl2ZTsnPlxyXG4gIDxkaXYgaWQ9J215TWFwJyBjbGFzcz0nbWFwY2xhc3MnICNtYXBFbGVtZW50PlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgaWQ9XCJ0aWNrZXRtb2RhbFwiIGNsYXNzPVwibW9kYWxcIj5cclxuXHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIiBzdHlsZT0nbWF4LXdpZHRoOjM3MHB4Oyc+XHRcdFx0XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCIgc3R5bGU9J2xpbmUtaGVpZ2h0OjEuMmVtOyc+XHJcbiAgICAgIDwvZGl2Plx0XHRcdFxyXG4gICAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG4gIHN0eWxlczogW2BcclxuICAubWFwY2xhc3N7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMTAwdmggLSA0ZW0gLSA4MHB4KSAhaW1wb3J0YW50OyAgICBcclxuICAgIGRpc3BsYXk6YmxvY2s7XHJcbiAgfVxyXG4gIC5tb2RhbHtcclxuICAgIHBvc2l0aW9uOmFic29sdXRlO1xyXG4gIH1cclxuICAuaW5meU1hcHBvcHVwe1xyXG5cdFx0bWFyZ2luOmF1dG8gIWltcG9ydGFudDtcclxuICAgIHdpZHRoOjMwMHB4ICFpbXBvcnRhbnQ7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGxpZ2h0Z3JheTsgXHJcbiAgfSxcclxuICAucG9wTW9kYWxDb250YWluZXJ7XHJcbiAgICBwYWRkaW5nOjE1cHg7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEhlYWRlcntcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHdpZHRoOjEwMCU7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEhlYWRlciBhe1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgcGFkZGluZzo1cHggMTBweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmMxMDc7XHJcbiAgICBib3JkZXItY29sb3I6ICNmZmMxMDc7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICByaWdodDoxMHB4O1xyXG4gICAgdG9wOjVweDtcclxuICB9XHJcbiAgLnBvcE1vZGFsSGVhZGVyIC5mYXtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDotMTBweDtcclxuICAgIHJpZ2h0Oi0xMHB4O1xyXG4gIFxyXG4gIH1cclxuICAucG9wTW9kYWxCb2R5IGxhYmVse1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICBsaW5lLWhlaWdodDogbm9ybWFsO1xyXG4gIH1cclxuICAucG9wTW9kYWxCb2R5IHNwYW57XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBsaW5lLWhlaWdodDogbm9ybWFsO1xyXG4gICAgd29yZC1icmVhazrDgsKgYnJlYWstd29yZDtcclxuICB9XHJcbiAgLm1ldGVyQ2FsIHN0cm9uZ3tcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XHJcbiAgICBmb250LXNpemU6IDIzcHg7XHJcbiAgfVxyXG4gIC5tZXRlckNhbCBzcGFue1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEZvb3RlciAuY29se1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIH1cclxuICAucG9wTW9kYWxGb290ZXIgLmZhe1xyXG4gICAgcGFkZGluZzowIDVweDtcclxuICB9XHJcbi5tb2RhbC1ib2R5IHttYXgtaGVpZ2h0OjQ1MHB4OyBvdmVyZmxvdy15OmF1dG99XHJcbi50a3RGb3JtIC5mb3JtLWdyb3VwIHttYXJnaW4tYm90dG9tOjVweH1cclxuLnRrdEZvcm0gLmZvcm0tZ3JvdXAgZGl2IGxhYmVsIHtmb250LXdlaWdodDo1MDB9XHJcbi50b3BCb3JkZXIge2JvcmRlci10b3A6I2RiZGJkYiAxcHggc29saWQ7fVxyXG5cclxuLnRleHQtc3VjY2VzcyB7Y29sb3I6IzVjYjg1Y31cclxuLnRleHQtZGFuZ2VyIHtjb2xvcjojZDk1MzRmfVxyXG4jbW9yZUZvcm1Db250ZW50QnRuLCAjbW9yZUZvcm1Db250ZW50QnRuOmhvdmVyICB7ICAgIFxyXG4gICBcclxuICAgIGJhY2tncm91bmQ6dHJhbnNwYXJlbnQ7XHJcbiAgICBib3JkZXI6MFxyXG59XHJcbiNtb3JlRm9ybUNvbnRlbnRCdG46Zm9jdXMgIHsgICAgXHJcbiAgICBvdXRsaW5lOjBcclxufVxyXG5cclxuICBgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUnR0YW1hcGxpYkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIGNvbm5lY3Rpb247XHJcbiAgbWFwOiBhbnk7XHJcbiAgY29udGV4dE1lbnU6IGFueTtcclxuICB0ZWNobmljaWFuUGhvbmU6IHN0cmluZztcclxuICB0ZWNobmljaWFuRW1haWw6IHN0cmluZztcclxuICB0ZWNobmljaWFuTmFtZTogc3RyaW5nO1xyXG4gIHRyYXZhbER1cmF0aW9uO1xyXG4gIHRydWNrSXRlbXMgPSBbXTtcclxuICB0ZXN0Q2xhc3MgPSBcInBvc2l0aW9uOnJlbGF0aXZlO1wiO1xyXG5cclxuICBkaXJlY3Rpb25zTWFuYWdlcjtcclxuICB0cmFmZmljTWFuYWdlcjogYW55O1xyXG5cclxuICB0cnVja0xpc3QgPSBbXTtcclxuICB0cnVja1dhdGNoTGlzdDogVHJ1Y2tEZXRhaWxzW107XHJcbiAgYnVzeTogYW55O1xyXG4gIG1hcHZpZXcgPSAncm9hZCc7XHJcbiAgbG9hZGluZyA9IGZhbHNlO1xyXG4gIEBWaWV3Q2hpbGQoJ21hcEVsZW1lbnQnKSBzb21lSW5wdXQ6IEVsZW1lbnRSZWY7XHJcbiAgbXlNYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlNYXAnKTtcclxuICByZWFkeSA9IGZhbHNlO1xyXG4gIGFuaW1hdGVkTGF5ZXI7XHJcbiAgLy8gQFZpZXdDaGlsZCgnc21zcG9wdXAnKSBzbXNwb3B1cDogUG9wdXA7XHJcbiAgLy8gQFZpZXdDaGlsZCgnZW1haWxwb3B1cCcpIGVtYWlscG9wdXA6IFBvcHVwO1xyXG4gIEBWaWV3Q2hpbGQoJ2luZm8nKSBpbmZvVGVtcGxhdGU6IEVsZW1lbnRSZWY7XHJcbiAgc29ja2V0OiBhbnkgPSBudWxsO1xyXG4gIHNvY2tldFVSTDogc3RyaW5nO1xyXG4gIHJlc3VsdHMgPSBbXHJcbiAgXTtcclxuICBwdWJsaWMgdXNlclJvbGU6IGFueTtcclxuICBsYXN0Wm9vbUxldmVsID0gMTA7XHJcbiAgbGFzdExvY2F0aW9uOiBhbnk7XHJcbiAgcmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMgPSBbXTtcclxuICByZXBvcnRpbmdUZWNobmljaWFucyA9IFtdO1xyXG4gIGlzVHJhZmZpY0VuYWJsZWQgPSAwO1xyXG4gIGxvZ2dlZFVzZXJJZCA9ICcnO1xyXG4gIG1hbmFnZXJVc2VySWQgPSAnJztcclxuICBjb29raWVBVFRVSUQgPSAnJztcclxuICBmZWV0OiBudW1iZXIgPSAwLjAwMDE4OTM5NDtcclxuICBJc0FyZWFNYW5hZ2VyID0gZmFsc2U7XHJcbiAgSXNWUCA9IGZhbHNlO1xyXG4gIGZpZWxkTWFuYWdlcnMgPSBbXTtcclxuICAvLyBXZWF0aGVyIHRpbGUgdXJsIGZyb20gSW93YSBFbnZpcm9ubWVudGFsIE1lc29uZXQgKElFTSk6IGh0dHA6Ly9tZXNvbmV0LmFncm9uLmlhc3RhdGUuZWR1L29nYy9cclxuICB1cmxUZW1wbGF0ZSA9ICdodHRwOi8vbWVzb25ldC5hZ3Jvbi5pYXN0YXRlLmVkdS9jYWNoZS90aWxlLnB5LzEuMC4wL25leHJhZC1uMHEte3RpbWVzdGFtcH0ve3pvb219L3t4fS97eX0ucG5nJztcclxuXHJcbiAgLy8gVGhlIHRpbWUgc3RhbXBzIHZhbHVlcyBmb3IgdGhlIElFTSBzZXJ2aWNlIGZvciB0aGUgbGFzdCA1MCBtaW51dGVzIGJyb2tlbiB1cCBpbnRvIDUgbWludXRlIGluY3JlbWVudHMuXHJcbiAgdGltZXN0YW1wcyA9IFsnOTAwOTEzLW01MG0nLCAnOTAwOTEzLW00NW0nLCAnOTAwOTEzLW00MG0nLCAnOTAwOTEzLW0zNW0nLCAnOTAwOTEzLW0zMG0nLCAnOTAwOTEzLW0yNW0nLCAnOTAwOTEzLW0yMG0nLCAnOTAwOTEzLW0xNW0nLCAnOTAwOTEzLW0xMG0nLCAnOTAwOTEzLW0wNW0nLCAnOTAwOTEzJ107XHJcblxyXG4gIHRlY2hUeXBlOiBhbnk7XHJcblxyXG4gIHRocmVzaG9sZFZhbHVlID0gMDtcclxuXHJcbiAgYW5pbWF0aW9uVHJ1Y2tMaXN0ID0gW107XHJcblxyXG4gIGRyb3Bkb3duU2V0dGluZ3MgPSB7fTtcclxuICBzZWxlY3RlZEZpZWxkTWdyID0gW107XHJcbiAgbWFuYWdlcklkcyA9ICcnO1xyXG5cclxuICByYWRpb3VzVmFsdWUgPSAnJztcclxuXHJcbiAgZm91bmRUcnVjayA9IGZhbHNlO1xyXG5cclxuICBsb2dnZWRJblVzZXJUaW1lWm9uZSA9ICdDU1QnO1xyXG4gIGNsaWNrZWRMYXQ7IGFueTtcclxuICBjbGlja2VkTG9uZzogYW55O1xyXG4gIGRhdGFMYXllcjogYW55O1xyXG4gIHBhdGhMYXllcjogYW55O1xyXG4gIGluZm9Cb3hMYXllcjogYW55O1xyXG4gIGluZm9ib3g6IGFueTtcclxuICBpc01hcExvYWRlZCA9IHRydWU7XHJcbiAgV29ya0Zsb3dBZG1pbiA9IGZhbHNlO1xyXG4gIFN5c3RlbUFkbWluID0gZmFsc2U7XHJcbiAgUnVsZUFkbWluID0gZmFsc2U7XHJcbiAgUmVndWxhclVzZXIgPSBmYWxzZTtcclxuICBSZXBvcnRpbmcgPSBmYWxzZTtcclxuICBOb3RpZmljYXRpb25BZG1pbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHRpY2tldExpc3Q6IGFueSA9IFtdO1xyXG4gIEBJbnB1dCgpIGxvZ2dlZEluVXNlcjogc3RyaW5nO1xyXG4gIEBPdXRwdXQoKSB0aWNrZXRDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgdGlja2V0RGF0YTogVGlja2V0W10gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIG1hcFNlcnZpY2U6IFJ0dGFtYXBsaWJTZXJ2aWNlLFxyXG4gICAgLy9wcml2YXRlIHJvdXRlcjogUm91dGVyLCBcclxuICAgIC8vcHVibGljIHRvYXN0cjogVG9hc3RzTWFuYWdlciwgXHJcbiAgICB2UmVmOiBWaWV3Q29udGFpbmVyUmVmXHJcbiAgICApIHtcclxuICAgIC8vdGhpcy50b2FzdHIuc2V0Um9vdFZpZXdDb250YWluZXJSZWYodlJlZik7XHJcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5jb29raWVBVFRVSUQgPSBcImtyNTIyNlwiOy8vdGhpcy51dGlscy5nZXRDb29raWVVc2VySWQoKTtcclxuICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMgPSBbXTtcclxuICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMucHVzaCh0aGlzLmNvb2tpZUFUVFVJRCk7XHJcbiAgICB0aGlzLnRyYXZhbER1cmF0aW9uID0gNTAwMDtcclxuICAgIC8vIC8vIHRvIGxvYWQgYWxyZWFkeSBhZGRyZWQgd2F0Y2ggbGlzdFxyXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnRydWNrTGlzdCA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICB0aGlzLmxvZ2dlZFVzZXJJZCA9IHRoaXMubWFuYWdlclVzZXJJZCA9IFwia3I1MjI2XCI7Ly90aGlzLnV0aWxzLmdldENvb2tpZVVzZXJJZCgpO1xyXG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAvL3RoaXMuY2hlY2tVc2VyTGV2ZWwoZmFsc2UpO1xyXG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gJ2NvbXBsZXRlJykgIHtcclxuICAgICAgZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgICB0aGlzLm1hcHZpZXcgPSAncm9hZCc7XHJcbiAgICAgICAgICB0aGlzLmxvYWRNYXBWaWV3KCdyb2FkJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubmdPbkluaXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgdGhpcy5tYXB2aWV3ID0gJ3JvYWQnO1xyXG4gICAgICAgIHRoaXMubG9hZE1hcFZpZXcoJ3JvYWQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgXHJcbiAgfVxyXG5cclxuICBjaGVja1VzZXJMZXZlbChJc1Nob3dUcnVjaykge1xyXG4gICAgdGhpcy5maWVsZE1hbmFnZXJzID0gW107XHJcbiAgICAvLyBBc3NpZ24gbG9nZ2VkIGluIHVzZXJcclxuICAgIHZhciBtZ3IgPSB7IGlkOiB0aGlzLm1hbmFnZXJVc2VySWQsIGl0ZW1OYW1lOiB0aGlzLm1hbmFnZXJVc2VySWQgfTtcclxuICAgIHRoaXMuZmllbGRNYW5hZ2Vycy5wdXNoKG1ncik7XHJcblxyXG4gICAgLy8gQ29tbWVudCBiZWxvdyBsaW5lIHdoZW4geW91IGdpdmUgZm9yIHByb2R1Y3Rpb24gYnVpbGQgOTAwOFxyXG4gICAgdGhpcy5Jc1ZQID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBDaGVjayBpcyBsb2dnZWQgaW4gdXNlciBpcyBhIGZpZWxkIG1hbmFnZXIgYXJlYSBtYW5hZ2VyL3ZwXHJcbiAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VySW5mbyh0aGlzLm1hbmFnZXJVc2VySWQpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoIWpRdWVyeS5pc0VtcHR5T2JqZWN0KGRhdGEpKSB7XHJcbiAgICAgICAgbGV0IG1hbmFnZXJzID0gJ2YnO1xyXG4gICAgICAgIGxldCBhbWFuYWdlcnMgPSAnZSc7XHJcbiAgICAgICAgbGV0IHZwID0gJ2EsYixjLGQnO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5sZXZlbC5pbmRleE9mKG1hbmFnZXJzKSA+IC0xKSB7XHJcbiAgICAgICAgICAvLyB0aGlzLklzVlAgPSBJc1Nob3dUcnVjaztcclxuICAgICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy5tYW5hZ2VySWRzID0gdGhpcy5maWVsZE1hbmFnZXJzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbVsnaWQnXTtcclxuICAgICAgICAgIH0pLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAvLyB0aGlzLmdldFRlY2hEZXRhaWxzRm9yTWFuYWdlcnMoKTtcclxuICAgICAgICAgIC8vIHRoaXMuTG9hZFRydWNrcyh0aGlzLm1hcCwgbnVsbCwgbnVsbCwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IC8vJCgnI2xvYWRpbmcnKS5oaWRlKCkgXHJcbiAgICAgICAgfSwgMzAwMCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxldmVsLmluZGV4T2YoYW1hbmFnZXJzKSA+IC0xKSB7XHJcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMgPSBbXTtcclxuICAgICAgICAgIHZhciBhcmVhTWdyID0ge1xyXG4gICAgICAgICAgICBpZDogdGhpcy5tYW5hZ2VyVXNlcklkLFxyXG4gICAgICAgICAgICBpdGVtTmFtZTogZGF0YS5uYW1lICsgJyAoJyArIHRoaXMubWFuYWdlclVzZXJJZCArICcpJ1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHRoaXMuZmllbGRNYW5hZ2Vycy51bnNoaWZ0KGFyZWFNZ3IpO1xyXG4gICAgICAgICAgdGhpcy5nZXRMaXN0b2ZGaWVsZE1hbmFnZXJzKCk7XHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZXZlbC5pbmRleE9mKHZwKSA+IC0xKSB7XHJcbiAgICAgICAgICB0aGlzLklzVlAgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gZmFsc2U7XHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvL3RoaXMudG9hc3RyLndhcm5pbmcoJ05vdCB2YWxpZCBGaWVsZC9BcmVhIE1hbmFnZXIhJywgJ01hbmFnZXInLCB7IHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSB9KVxyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy90aGlzLnRvYXN0ci53YXJuaW5nKCdQbGVhc2UgZW50ZXIgdmFsaWQgRmllbGQvQXJlYSBNYW5hZ2VyIGF0dHVpZCEnLCAnTWFuYWdlcicsIHsgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlIH0pXHJcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGNvbm5lY3Rpbmcgd2ViIHBob25lIScsICdFcnJvcicpXHJcbiAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldExpc3RvZkZpZWxkTWFuYWdlcnMoKSB7XHJcbiAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VyRGF0YSh0aGlzLm1hbmFnZXJVc2VySWQpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5UZWNobmljaWFuRGV0YWlscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZm9yICh2YXIgdGVjaCBpbiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzKSB7XHJcbiAgICAgICAgICB2YXIgbWdyID0ge1xyXG4gICAgICAgICAgICBpZDogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQsXHJcbiAgICAgICAgICAgIGl0ZW1OYW1lOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLm5hbWUgKyAnICgnICsgZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQgKyAnKSdcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMucHVzaChtZ3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5Jc1ZQID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLklzVlAgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIud2FybmluZygnRG8gbm90IGhhdmUgYW55IGRpcmVjdCByZXBvcnRzIScsICdNYW5hZ2VyJyk7XHJcbiAgICAgIH1cclxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBjb25uZWN0aW5nIHdlYiBwaG9uZSEnLCAnRXJyb3InKTtcclxuICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGVjaERldGFpbHNGb3JNYW5hZ2VycygpIHtcclxuICAgIGlmICh0aGlzLm1hbmFnZXJJZHMgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VyRGF0YSh0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChkYXRhLlRlY2huaWNpYW5EZXRhaWxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGZvciAodmFyIHRlY2ggaW4gZGF0YS5UZWNobmljaWFuRGV0YWlscykge1xyXG4gICAgICAgICAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnB1c2goZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5wdXNoKHtcclxuICAgICAgICAgICAgICBhdHR1aWQ6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkLFxyXG4gICAgICAgICAgICAgIG5hbWU6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0ubmFtZSxcclxuICAgICAgICAgICAgICBlbWFpbDogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5lbWFpbCxcclxuICAgICAgICAgICAgICBwaG9uZTogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5waG9uZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICAgIFxyXG4gIGxvYWRNYXBWaWV3KHR5cGU6IFN0cmluZykge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy50cnVja0l0ZW1zID0gW107XHJcbiAgICB2YXIgbG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oNDAuMDU4MywgLTc0LjQwNTcpO1xyXG5cclxuICAgIGlmICh0aGlzLmxhc3RMb2NhdGlvbikge1xyXG4gICAgICBsb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0aGlzLmxhc3RMb2NhdGlvbi5sYXRpdHVkZSwgdGhpcy5sYXN0TG9jYXRpb24ubG9uZ2l0dWRlKTtcclxuICAgIH1cclxuICAgIHRoaXMubWFwID0gbmV3IE1pY3Jvc29mdC5NYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlNYXAnKSwge1xyXG4gICAgICBjcmVkZW50aWFsczogJ0FueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWonLFxyXG4gICAgICBjZW50ZXI6IGxvY2F0aW9uLFxyXG4gICAgICBtYXBUeXBlSWQ6IHR5cGUgPT0gJ3NhdGVsbGl0ZScgPyBNaWNyb3NvZnQuTWFwcy5NYXBUeXBlSWQuYWVyaWFsIDogTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLnJvYWQsXHJcbiAgICAgIHpvb206IDEyLFxyXG4gICAgICBsaXRlTW9kZTogdHJ1ZSxcclxuICAgICAgLy9uYXZpZ2F0aW9uQmFyT3JpZW50YXRpb246IE1pY3Jvc29mdC5NYXBzLk5hdmlnYXRpb25CYXJPcmllbnRhdGlvbi5ob3Jpem9udGFsLFxyXG4gICAgICBlbmFibGVDbGlja2FibGVMb2dvOiBmYWxzZSxcclxuICAgICAgc2hvd0xvZ286IGZhbHNlLFxyXG4gICAgICBzaG93VGVybXNMaW5rOiBmYWxzZSxcclxuICAgICAgc2hvd01hcFR5cGVTZWxlY3RvcjogZmFsc2UsXHJcbiAgICAgIHNob3dUcmFmZmljQnV0dG9uOiB0cnVlLFxyXG4gICAgICBlbmFibGVTZWFyY2hMb2dvOiBmYWxzZSxcclxuICAgICAgc2hvd0NvcHlyaWdodDogZmFsc2VcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAvL0xvYWQgdGhlIEFuaW1hdGlvbiBNb2R1bGVcclxuICAgIC8vTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZShcIkFuaW1hdGlvbk1vZHVsZVwiKTtcclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ0FuaW1hdGlvbk1vZHVsZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIH0pO1xyXG4gICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5tYXAsICd2aWV3Y2hhbmdlZW5kJywgKCkgPT4geyBcclxuICAgICAgd2luZG93LnNldFRpbWVvdXQodGhhdC5zZXRab29tUG9zaXRpb24sMTAwMDApO1xyXG4gICAgIH0pO1xyXG5cclxuICAgICAgXHJcbiAgICAvL1N0b3JlIHNvbWUgbWV0YWRhdGEgd2l0aCB0aGUgcHVzaHBpblxyXG4gICAgdGhpcy5pbmZvYm94ID0gbmV3IE1pY3Jvc29mdC5NYXBzLkluZm9ib3godGhpcy5tYXAuZ2V0Q2VudGVyKCksIHtcclxuICAgICAgdmlzaWJsZTogZmFsc2VcclxuICAgIH0pO1xyXG4gICAgdGhpcy5pbmZvYm94LnNldE1hcCh0aGlzLm1hcCk7XHJcbiAgICBcclxuICAgIC8vIENyZWF0ZSBhIGxheWVyIGZvciByZW5kZXJpbmcgdGhlIHBhdGguXHJcbiAgICB0aGlzLnBhdGhMYXllciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5MYXllcigpO1xyXG4gICAgdGhpcy5tYXAubGF5ZXJzLmluc2VydCh0aGlzLnBhdGhMYXllcik7XHJcblxyXG4gICAgLy8gTG9hZCB0aGUgU3BhdGlhbCBNYXRoIG1vZHVsZS5cclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoJywgZnVuY3Rpb24gKCkgeyB9KTtcclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMnLCBmdW5jdGlvbiAoKSB7IH0pO1xyXG5cclxuICAgIC8vIENyZWF0ZSBhIGxheWVyIHRvIGxvYWQgcHVzaHBpbnMgdG8uXHJcbiAgICB0aGlzLmRhdGFMYXllciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5FbnRpdHlDb2xsZWN0aW9uKCk7XHJcblxyXG4gICAgLy8gQWRkIGEgcmlnaHQgY2xpY2sgZXZlbnQgdG8gdGhlIG1hcFxyXG4gICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5tYXAsICdyaWdodGNsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgY29uc3QgeDEgPSBlLmxvY2F0aW9uO1xyXG4gICAgICB0aGF0LmNsaWNrZWRMYXQgPSB4MS5sYXRpdHVkZTtcclxuICAgICAgdGhhdC5jbGlja2VkTG9uZyA9IHgxLmxvbmdpdHVkZTtcclxuICAgICAgdGhhdC5yYWRpb3VzVmFsdWUgPSAnJztcclxuICAgICAgalF1ZXJ5KCcjbXlSYWRpdXNNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL2xvYWQgdGlja2V0IGRldGFpbHNcclxuICAgIHRoaXMuYWRkVGlja2V0RGF0YSh0aGlzLm1hcCwgdGhpcy5kaXJlY3Rpb25zTWFuYWdlcik7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIHNldFpvb21Qb3NpdGlvbigpe1xyXG4gICAgJCgnLk5hdkJhcl9Db250YWluZXIuTGlnaHQnKS5hdHRyKCdzdHlsZScsJ2JvdHRvbTozMHB4O3RvcDp1bnNldCAhaW1wb3J0YW50OycpOyAgICBcclxuICB9XHJcblxyXG4gIExvYWRUcnVja3MobWFwcywgbHQsIGxnLCByZCwgaXNUcnVja1NlYXJjaCkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLnRydWNrSXRlbXMgPSBbXTtcclxuXHJcbiAgICBpZiAoIWlzVHJ1Y2tTZWFyY2gpIHtcclxuXHJcbiAgICAgIHRoaXMubWFwU2VydmljZS5nZXRNYXBQdXNoUGluRGF0YSh0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmICghalF1ZXJ5LmlzRW1wdHlPYmplY3QoZGF0YSkgJiYgZGF0YS50ZWNoRGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICB2YXIgdGVjaERhdGEgPSBkYXRhLnRlY2hEYXRhO1xyXG4gICAgICAgICAgdmFyIGRpckRldGFpbHMgPSBbXTtcclxuICAgICAgICAgIHRlY2hEYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ubG9uZyA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBpdGVtLmxvbmcgPSBpdGVtLmxvbmdnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnRlY2hJRCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICB2YXIgZGlyRGV0YWlsOiBUcnVja0RpcmVjdGlvbkRldGFpbHMgPSBuZXcgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzKCk7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnRlY2hJZCA9IGl0ZW0udGVjaElEO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMYXQgPSBpdGVtLmxhdDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTG9uZyA9IGl0ZW0ubG9uZztcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExhdCA9IGl0ZW0ud3JMYXQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMb25nID0gaXRlbS53ckxvbmc7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlscy5wdXNoKGRpckRldGFpbCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHZhciByb3V0ZU1hcFVybHMgPSBbXTtcclxuICAgICAgICAgIHJvdXRlTWFwVXJscyA9IHRoaXMubWFwU2VydmljZS5HZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlscyk7XHJcblxyXG4gICAgICAgICAgZm9ya0pvaW4ocm91dGVNYXBVcmxzKS5zdWJzY3JpYmUocmVzdWx0cyA9PiB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSByZXN1bHRzLmxlbmd0aCAtIDE7IGorKykge1xyXG4gICAgICAgICAgICAgIGxldCByb3V0ZURhdGEgPSByZXN1bHRzW2pdIGFzIGFueTtcclxuICAgICAgICAgICAgICBsZXQgcm91dGVkYXRhSnNvbiA9IHJvdXRlRGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgICAgaWYgKHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMgIT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgJiYgcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxhdCA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1swXVxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMb25nID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzFdXHJcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxhdCA9IG5leHRTb3VyY2VMYXQ7XHJcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxvbmcgPSBuZXh0U291cmNlTG9uZztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBsaXN0T2ZQaW5zID0gbWFwcy5lbnRpdGllcztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mUGlucy5nZXRMZW5ndGgoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHRlY2hJZCA9IGxpc3RPZlBpbnMuZ2V0KGkpLm1ldGFkYXRhLkFUVFVJRDtcclxuICAgICAgICAgICAgICB2YXIgdHJ1Y2tDb2xvciA9IGxpc3RPZlBpbnMuZ2V0KGkpLm1ldGFkYXRhLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgdmFyIGN1clB1c2hQaW4gPSBsaXN0T2ZQaW5zLmdldChpKTtcclxuICAgICAgICAgICAgICB2YXIgY3VyckRpckRldGFpbCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICBjdXJyRGlyRGV0YWlsID0gZGlyRGV0YWlscy5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50ZWNoSWQgPT09IHRlY2hJZCkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgdmFyIG5leHRMb2NhdGlvbjtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGN1cnJEaXJEZXRhaWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbmV4dExvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTGF0LCBjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxvbmcpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKG5leHRMb2NhdGlvbiAhPSBudWxsICYmIG5leHRMb2NhdGlvbiAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwaW5Mb2NhdGlvbiA9IGxpc3RPZlBpbnMuZ2V0KGkpLmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dENvb3JkID0gdGhhdC5DYWxjdWxhdGVOZXh0Q29vcmQocGluTG9jYXRpb24sIG5leHRMb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhwaW5Mb2NhdGlvbiwgbmV4dENvb3JkKTtcclxuICAgICAgICAgICAgICAgIHZhciB0cnVja1VybCA9IHRoaXMuZ2V0VHJ1Y2tVcmwodHJ1Y2tDb2xvcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4oY3VyUHVzaFBpbiwgdHJ1Y2tVcmwsIGJlYXJpbmcsIGZ1bmN0aW9uICgpIHsgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5tYXBTZXJ2aWNlLmdldFRydWNrRmVlZCh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLCB0aGlzLm1hbmFnZXJJZHMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnNvbWUoeCA9PiB4LnRvTG93ZXJDYXNlKCkgPT0gZGF0YS50ZWNoSUQudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIGZldGNoaW5nIHRydWNrcyBmcm9tIEthZmthIENvbnN1bWVyLiBFcnJvcnMtPiAnICsgZXJyLkVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ05vIHRydWNrIGZvdW5kIScsICdNYW5hZ2VyJyk7XHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBmZXRjaGluZyBkYXRhIGZyb20gQVBJIScsICdFcnJvcicpO1xyXG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIGNvbnN0IG10cnMgPSBNYXRoLnJvdW5kKHRoYXQuZ2V0TWV0ZXJzKHJkKSk7XHJcbiAgICAgIHRoaXMubWFwU2VydmljZS5maW5kVHJ1Y2tOZWFyQnkobHQsIGxnLCBtdHJzLCB0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmICghalF1ZXJ5LmlzRW1wdHlPYmplY3QoZGF0YSkgJiYgZGF0YS50ZWNoRGF0YS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgY29uc3QgdGVjaERhdGEgPSBkYXRhLnRlY2hEYXRhO1xyXG4gICAgICAgICAgbGV0IGRpckRldGFpbHMgPSBbXTtcclxuICAgICAgICAgIHRlY2hEYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ubG9uZyA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBpdGVtLmxvbmcgPSBpdGVtLmxvbmdnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgoaXRlbS50ZWNoSUQgIT0gdW5kZWZpbmVkKSAmJiAoZGlyRGV0YWlscy5zb21lKHggPT4geC50ZWNoSWQgPT0gaXRlbS50ZWNoSUQpID09IGZhbHNlKSkge1xyXG4gICAgICAgICAgICAgIHZhciBkaXJEZXRhaWw6IFRydWNrRGlyZWN0aW9uRGV0YWlscyA9IG5ldyBUcnVja0RpcmVjdGlvbkRldGFpbHMoKTtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwudGVjaElkID0gaXRlbS50ZWNoSUQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxhdCA9IGl0ZW0ubGF0O1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMb25nID0gaXRlbS5sb25nO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TGF0ID0gaXRlbS53ckxhdDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExvbmcgPSBpdGVtLndyTG9uZztcclxuICAgICAgICAgICAgICBkaXJEZXRhaWxzLnB1c2goZGlyRGV0YWlsKTtcclxuICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBpdGVtKTtcclxuICAgICAgICAgICAgICB0aGF0LmZvdW5kVHJ1Y2sgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB2YXIgcm91dGVNYXBVcmxzID0gW107XHJcbiAgICAgICAgICByb3V0ZU1hcFVybHMgPSB0aGlzLm1hcFNlcnZpY2UuR2V0Um91dGVNYXBEYXRhKGRpckRldGFpbHMpO1xyXG5cclxuICAgICAgICAgIGZvcmtKb2luKHJvdXRlTWFwVXJscykuc3Vic2NyaWJlKHJlc3VsdHMgPT4ge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPD0gcmVzdWx0cy5sZW5ndGggLSAxOyBqKyspIHtcclxuICAgICAgICAgICAgICBsZXQgcm91dGVEYXRhID0gcmVzdWx0c1tqXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgbGV0IHJvdXRlZGF0YUpzb24gPSByb3V0ZURhdGEuanNvbigpO1xyXG4gICAgICAgICAgICAgIGlmIChyb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zICE9IG51bGxcclxuICAgICAgICAgICAgICAgICYmIHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMYXQgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMF1cclxuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTG9uZyA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1sxXVxyXG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMYXQgPSBuZXh0U291cmNlTGF0O1xyXG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMb25nID0gbmV4dFNvdXJjZUxvbmc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbGlzdE9mUGlucyA9IHRoYXQubWFwLmVudGl0aWVzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0T2ZQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcclxuICAgICAgICAgICAgICBjb25zdCBwdXNocGluID0gbGlzdE9mUGlucy5nZXQoaSk7XHJcbiAgICAgICAgICAgICAgaWYgKHB1c2hwaW4gaW5zdGFuY2VvZiBNaWNyb3NvZnQuTWFwcy5QdXNocGluKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVjaElkID0gcHVzaHBpbi5tZXRhZGF0YS5BVFRVSUQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0cnVja0NvbG9yID0gcHVzaHBpbi5tZXRhZGF0YS50cnVja0NvbC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJEaXJEZXRhaWwgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBjdXJyRGlyRGV0YWlsID0gZGlyRGV0YWlscy5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRlY2hJZCA9PT0gdGVjaElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBuZXh0TG9jYXRpb247XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJEaXJEZXRhaWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICBuZXh0TG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMYXQsIGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTG9uZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5leHRMb2NhdGlvbiAhPSBudWxsICYmIG5leHRMb2NhdGlvbiAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHBpbkxvY2F0aW9uID0gbGlzdE9mUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgdmFyIG5leHRDb29yZCA9IHRoYXQuQ2FsY3VsYXRlTmV4dENvb3JkKHBpbkxvY2F0aW9uLCBuZXh0TG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhwaW5Mb2NhdGlvbiwgbmV4dENvb3JkKTtcclxuICAgICAgICAgICAgICAgICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKHB1c2hwaW4sIHRydWNrVXJsLCBiZWFyaW5nLCBmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gTG9hZCB0aGUgc3BhdGlhbCBtYXRoIG1vZHVsZVxyXG4gICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAvLyBSZXF1ZXN0IHRoZSB1c2VyJ3MgbG9jYXRpb25cclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgbG9jID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRoYXQuY2xpY2tlZExhdCwgdGhhdC5jbGlja2VkTG9uZyk7XHJcbiAgICAgICAgICAgICAgLy8gQ3JlYXRlIGFuIGFjY3VyYWN5IGNpcmNsZVxyXG4gICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aC5nZXRSZWd1bGFyUG9seWdvbihsb2MsXHJcbiAgICAgICAgICAgICAgICByZCxcclxuICAgICAgICAgICAgICAgIDM2LFxyXG4gICAgICAgICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGguRGlzdGFuY2VVbml0cy5NaWxlcyk7XHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IHBvbHkgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9seWdvbihwYXRoKTtcclxuICAgICAgICAgICAgICB0aGF0Lm1hcC5lbnRpdGllcy5wdXNoKHBvbHkpO1xyXG4gICAgICAgICAgICAgIC8vIEFkZCBhIHB1c2hwaW4gYXQgdGhlIHVzZXIncyBsb2NhdGlvbi5cclxuICAgICAgICAgICAgICBjb25zdCBwaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihsb2MsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGljb246ICdodHRwczovL2JpbmdtYXBzaXNkay5ibG9iLmNvcmUud2luZG93cy5uZXQvaXNka3NhbXBsZXMvZGVmYXVsdFB1c2hwaW4ucG5nJyxcclxuICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMTIsIDM5KSxcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHJkICsgJyBtaWxlKHMpIG9mIHJhZGl1cycsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgdmFyIG1ldGFkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgTGF0aXR1ZGU6IGx0LFxyXG4gICAgICAgICAgICAgICAgTG9uZ2l0dWRlOiBsZyxcclxuICAgICAgICAgICAgICAgIHJhZGl1czogcmRcclxuICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihwaW4sICdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnJhZGlvdXNWYWx1ZSA9IHJkO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jbGlja2VkTGF0ID0gbHQ7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNsaWNrZWRMb25nID0gbGc7XHJcbiAgICAgICAgICAgICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgcGluLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcbiAgICAgICAgICAgICAgdGhhdC5tYXAuZW50aXRpZXMucHVzaChwaW4pO1xyXG4gICAgICAgICAgICAgIHRoYXQuZGF0YUxheWVyLnB1c2gocGluKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ2VudGVyIHRoZSBtYXAgb24gdGhlIHVzZXIncyBsb2NhdGlvbi5cclxuICAgICAgICAgICAgICB0aGF0Lm1hcC5zZXRWaWV3KHsgY2VudGVyOiBsb2MsIHpvb206IDggfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgbGV0IGZlZWRNYW5hZ2VyID0gW107XHJcblxyXG4gICAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5tYXBTZXJ2aWNlLmdldFRydWNrRmVlZCh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLCB0aGlzLm1hbmFnZXJJZHMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChkaXJEZXRhaWxzLnNvbWUoeCA9PiB4LnRlY2hJZC50b0xvY2FsZUxvd2VyQ2FzZSgpID09IGRhdGEudGVjaElELnRvTG9jYWxlTG93ZXJDYXNlKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGRhdGEpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBmZXRjaGluZyB0cnVja3MgZnJvbSBLYWZrYSBDb25zdW1lci4gRXJyb3JzLT4gJyArIGVyci5FcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdObyB0cnVjayBmb3VuZCEnLCAnTWFuYWdlcicpO1xyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgZmV0Y2hpbmcgZGF0YSBmcm9tIEFQSSEnLCAnRXJyb3InKTtcclxuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBnZXRUcnVja1VybChjb2xvcikge1xyXG4gICAgbGV0IHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFIa21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1JtTTJWaU1XUXROR0psWkMxak5qUTBMVGd6WW1VdFlqUTVZalpsTkRsbVltUm1JaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpHRXhOVEJsWVRFdE1qSmhZeTAzT1RRNUxUaGlObUV0WldVMU1UYzRaVEJtTVdGa0lpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09tWXdaV1F4WldNM0xUTTFPVEF0WkdFMFlpMDVNV0l3TFRZd09UUTJaakZoTldRNVl6d3ZjbVJtT214cFBpQThjbVJtT214cFBuaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMlBDOXlaR1k2YkdrK0lEd3ZjbVJtT2tKaFp6NGdQQzl3YUc5MGIzTm9iM0E2Ukc5amRXMWxiblJCYm1ObGMzUnZjbk0rSUR4NGJYQk5UVHBJYVhOMGIzSjVQaUE4Y21SbU9sTmxjVDRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUltTnlaV0YwWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEUwVkRFNU9qQTRPakF6TFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpOCtJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKellYWmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG8xWkRRMk1EYzFaaTA0TW1SbUxXWTNOREF0WW1VM1pTMW1OMkkwTXpsbVlqY3lNekVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UVlVNVGs2TWpNNk16RXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpSUhOMFJYWjBPbU5vWVc1blpXUTlJaThpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09tRmtaak5sWWpGa0xUUmlaV1F0WXpZME5DMDRNMkpsTFdJME9XSTJaVFE1Wm1Ka1ppSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4T1ZReE5UbzBPVG93TVMwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4TDNKa1pqcFRaWEUrSUR3dmVHMXdUVTA2U0dsemRHOXllVDRnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrSUR3dmNtUm1PbEpFUmo0Z1BDOTRPbmh0Y0cxbGRHRStJRHcvZUhCaFkydGxkQ0JsYm1ROUluSWlQejRkYjd2akFBQUNlMGxFUVZSSXg5MldUV3RUUVJTR256TnpiM0xUdEtHMVdsSHdxNHVDYllYK0ExMjVFTGN1dWloQ1JYQ3AySDNCaFN2L2dVdkJnbEp3NFVMQmlncFNhVUZjaUZMRmpTQXRzWDYxU2RNMHZYTmM5Tm9rUlpPWUFSWG5NcXU1ekRQbm5QZThNNEdxOHFkSHdGOFkveDcwNnJPSm5wVEl0YWRmN28rK0x5K1ZyWmhrUlpMNVl6akV4T24xRjVtcHNVUG5ia3lNVFQ1cUd6cFhtUmxaTHViSFA3S0U3VXBuMks2LzFERlZ3V1NobUZzZGYvaDJabnlDU1drL3ZmZTZlNzROdlNhekowZnNLdlZyZGZvVHpLYXdYaW95Ti8rODVGZlRKN3VuM0tjY3dka2lGQnNkWG9sVElIbUR6SGI1MWJUbmNBNFhPR0lSTkZTa1FYZFpvNmcxWkxvajZ3V05CbVEwN05WcDhpbnNoaUFOZ3RYVk1tRlh5SUdoL2FlOG9BK0MyL25BV0FwM2hPQkQ5TXUvTlFhNkhkbmpaWWJQOUo4R1p0cUdIaHpjMjFGSXJSSHMyeUFveHcxUEwxbEZnMDBHMGtjdUFwZmFoaTYvTE56cTdPdmw1UG1qbEl0cmFDSlpRUkN0NWxwRnlVUnA1bTh1TVAxNXFuVDV4SlgyMDF1dWJLU3picXM3SkhZMVlTblVRQkZGalFFTVg5ZFdQRzFRUWxVVVI0eXFyZnFCMXJlcEtEaGluQ2hJNkFmVlJLNlNmUFYyOEhPdnNCZy9xQk5GaEdTYnhsZWdrNlFNenZlV1VXb01RWnJ2Sm15THJXMm9RWkFZekcvYzg5NVFFV2twd0MweG1lVENjNTdwUlZ0bFl0UWdDdFlYS2lLMC9vUnlpRkhFZUFvcGRxN0c1TFZwTmF2VEoxTFZtcHBLTStIaVd0TjRZMmhhTElvbUtkWW1Ra3I2MmhlcUFzWUsxZ2hoRk80QVMxM2FBd3RpRFd4NlFvdTJaREtsSEl0dlZxbFUxbEhWcWlGcW5TTVFoU0d1Wk5DTzVsSnFDQjNjZFd4bDRkMnJ6dG5yaXhocmNBbDBaenBVaFZnZFVkVEpjUDlJd1F0Njk4TGp2di9taGY4ZHRHSGxoNHY1UjFJQUFBQUFTVVZPUks1Q1lJST0nO1xyXG5cclxuICAgIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICdncmVlbicpIHtcclxuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUhrbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUm1NMlZpTVdRdE5HSmxaQzFqTmpRMExUZ3pZbVV0WWpRNVlqWmxORGxtWW1SbUlpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdFeE5UQmxZVEV0TWpKaFl5MDNPVFE1TFRoaU5tRXRaV1UxTVRjNFpUQm1NV0ZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T21Zd1pXUXhaV00zTFRNMU9UQXRaR0UwWWkwNU1XSXdMVFl3T1RRMlpqRmhOV1E1WXp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkyUEM5eVpHWTZiR2srSUR3dmNtUm1Pa0poWno0Z1BDOXdhRzkwYjNOb2IzQTZSRzlqZFcxbGJuUkJibU5sYzNSdmNuTStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTBWREU1T2pBNE9qQXpMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzFaRFEyTURjMVppMDRNbVJtTFdZM05EQXRZbVUzWlMxbU4ySTBNemxtWWpjeU16RWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRWVU1UazZNak02TXpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21Ga1pqTmxZakZrTFRSaVpXUXRZelkwTkMwNE0ySmxMV0kwT1dJMlpUUTVabUprWmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhPVlF4TlRvME9Ub3dNUzB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NGRiN3ZqQUFBQ2UwbEVRVlJJeDkyV1RXdFRRUlNHbnpOemIzTFR0S0cxV2xId3E0dUNiWVgrQTEyNUVMY3V1aWhDUlhDcDJIM0JoU3YvZ1V2QmdsSnc0VUxCaWdwU2FVRmNpRkxGalNBdHNYNjFTZE0wdlhOYzlOb2tSWk9ZQVJYbk1xdTV6RFBublBlOE00R3E4cWRId0Y4WS94NzA2ck9KbnBUSXRhZGY3bysrTHkrVnJaaGtSWkw1WXpqRXhPbjFGNW1wc1VQbmJreU1UVDVxR3pwWG1SbFpMdWJIUDdLRTdVcG4ySzYvMURGVndXU2htRnNkZi9oMlpueUNTV2svdmZlNmU3NE52U2F6SjBmc0t2VnJkZm9Uekthd1hpb3lOLys4NUZmVEo3dW4zS2Njd2RraUZCc2RYb2xUSUhtRHpIYjUxYlRuY0E0WE9HSVJORlNrUVhkWm82ZzFaTG9qNndXTkJtUTA3TlZwOGluc2hpQU5ndFhWTW1GWHlJR2gvYWU4b0ErQzIvbkFXQXAzaE9CRDlNdS9OUWE2SGRualpZYlA5SjhHWnRxR0hoemMyMUZJclJIczJ5QW94dzFQTDFsRmcwMEcwa2N1QXBmYWhpNi9MTnpxN092bDVQbWpsSXRyYUNKWlFSQ3Q1bHBGeVVScDVtOHVNUDE1cW5UNXhKWDIwMXV1YktTemJxczdKSFkxWVNuVVFCRkZqUUVNWDlkV1BHMVFRbFVVUjR5cXJmcUIxcmVwS0RoaW5DaEk2QWZWUks2U2ZQVjI4SE92c0JnL3FCTkZoR1NieGxlZ2s2UU16dmVXVVdvTVFacnZKbXlMclcyb1FaQVl6Ry9jODk1UUVXa3B3QzB4bWVUQ2M1N3BSVnRsWXRRZ0N0WVhLaUswL29SeWlGSEVlQW9wZHE3RzVMVnBOYXZUSjFMVm1wcEtNK0hpV3RONFkyaGFMSW9tS2RZbVFrcjYyaGVxQXNZSzFnaGhGTzRBUzEzYUF3dGlEV3g2UW91MlpES2xISXR2VnFsVTFsSFZxaUZxblNNUWhTR3VaTkNPNWxKcUNCM2NkV3hsNGQycnp0bnJpeGhyY0FsMFp6cFVoVmdkVWRUSmNQOUl3UXQ2OThManZ2L21oZjhkdEdIbGg0djVSMUlBQUFBQVNVVk9SSzVDWUlJPSc7XHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ3JlZCcpIHtcclxuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUgzbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1EVmpNemMxWkRZdE1XTmxPQzFrWmpSbExUZ3dZamd0TWpsbVlUUmhaakEyWkRFM0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdSbU1HSXpZbUV0TVdOaVpDMWhNalEwTFdFeVpXTXRNVGc0WVRsa09HUmxNamswSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEcG1NR1ZrTVdWak55MHpOVGt3TFdSaE5HSXRPVEZpTUMwMk1EazBObVl4WVRWa09XTThMM0prWmpwc2FUNGdQSEprWmpwc2FUNTRiWEF1Wkdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5qd3ZjbVJtT214cFBpQThMM0prWmpwQ1lXYytJRHd2Y0dodmRHOXphRzl3T2tSdlkzVnRaVzUwUVc1alpYTjBiM0p6UGlBOGVHMXdUVTA2U0dsemRHOXllVDRnUEhKa1pqcFRaWEUrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSmpjbVZoZEdWa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5pSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TldRME5qQTNOV1l0T0RKa1ppMW1OelF3TFdKbE4yVXRaamRpTkRNNVptSTNNak14SWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTFWREU1T2pJek9qTXhMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEb3dOV016TnpWa05pMHhZMlU0TFdSbU5HVXRPREJpT0MweU9XWmhOR0ZtTURaa01UY2lJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRsVU1UVTZOVEk2TWpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEM5eVpHWTZVMlZ4UGlBOEwzaHRjRTFOT2tocGMzUnZjbmsrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrN1NkQXdBQUFBc3BKUkVGVVNNZmxsN3RyRkZFWXhYL2ZuWmxkTndtSkdrS0lDRDRpSVdLbElvcXJWajQ2UVZCc2ZZRDRIMmhoYlpBVTJvaUluVnFJV0dobEk2Z2dCbEY4Qk44aEtvaEVvaEkxYmpiN3VQZXoyTkhkVGR6WlpTZG80UXpmYmVZTzU1N3ZuSHZ1aktncWYvc3kvSVBMajNyNDlNNDloc2R1SlZvR0w2N29IQ2RoQStObXpoR1ViQ0VuRDdjdW45alR1ZnJEMkxKZXUrWHd3ZVpCYjU0OHNYakRaTzcwc2x4eVhiN0RwVVFvYTZGbFdPYzhXZjlvWW5TczkrMEYrbGFlQTZhYUJ2MTBlMmpORjV2ZHVhNS9KZGJPSUZsaEJUV0sxZnphOXVmRGl3cmJkbndCTGphdDZSdkQ0SStXZG5DR2d0UHEwbkxaSWtDQ0owclBsWWNQenNjeTB0MVBIL3UrK1VicjJrMHNTVHllR2NQQTFjdTVXS0NacnU0ejg3SFRvTXhUYWxaU0JhUklkNkRqMjlLYmpzWnk3NzcrdmxQMjVZdEROd0lmRFlJcUlhWENTRVlNTU0yU25MRzczbzFmaXdXNnU2ZDc3L3dIOTR2WFh3NTdXWkVLSUpBS1Azbk9wOFBsU1U5ODcxcDE1bXdpRnVqemtkSDkvUjJkeVMyWkgzZ0pueitsbHdBT2gvb3BKbHVVenlPdkRuUkJaSXNsS2dhUHRiWG10MmNMd2RMTmFlekNCZURjckMxVFltd2htVUplajNEcHlXT09xRXJUVENXVExiWjZ5YUROR0p4VUNWbkZWTVZnOEZEeFNFQTJWbnN4QnNWZ3c2SkdWNHgxcUhHSWsvalo2d0FuSllLaTFTbFVGVTRDaUlDVTNvbkhGRkJWU25mWnNiTkJGUlZGYU95WWpBd0hUOEZaQzFvYk1OeXBnR0NkYStpczlPdXZTRkEwSERWS2lIRGVYTFQzTjVCRU5OZ0FqWm1vSVZBSmgxKzYxV0phOHRJY3VOY1RyVVJGTklLcENJak1qYVlGVlN3T0U4SFVkNHBUeFRiNGtWZTN2UWdJSWN1b2RGTnBXTlhvR0pRd0Q0d0J6OVJNQjZjT01WSmFYRnpRaEFxdG51QmxNNWhKSDdVV0Nkcyt5OU1KaHlrV0NCb3dVeVJvemxudnZiT01EZzFWZ1pod1o4b003Z0h3R2J4WW9PbUI0MTlOTWQrR3l4VVU1N1FpQ2lwUHVGSUpCdDlzREZKVGRXM3kzL3hXL0FSTnBqdnhsODB1TEFBQUFBQkpSVTVFcmtKZ2dnPT0nO1xyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICd5ZWxsb3cnKSB7XHJcbiAgICAgIHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFJS21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZOVGc2TlRVdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZOVGc2TlRVdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1E0TWpGa1pqTXRabUZsTkMweE1qUXpMVGxqWlRVdFptRmtOMkUyTVRkbU5UVTNJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpqVXdOMkl4WW1NdE5EQmtaUzB3WkRReUxXSXdaVGN0TUdVNE5qTm1OelZrTmpBMElpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09qQXdNREpsTkRobExUaG1PV1V0TmpVMFl5MDVZalEyTFRWbVlXWmtNVEJoTjJFMk56d3ZjbVJtT214cFBpQThjbVJtT214cFBtRmtiMkpsT21SdlkybGtPbkJvYjNSdmMyaHZjRG80TXpjeFkyVTJZUzB4WVdaa0xURTBORE10T1RneFpDMWtOMkU0TkdZMU5tVTBaV1U4TDNKa1pqcHNhVDRnUEhKa1pqcHNhVDVoWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpqQmxaREZsWXpjdE16VTVNQzFrWVRSaUxUa3hZakF0TmpBNU5EWm1NV0UxWkRsalBDOXlaR1k2YkdrK0lEeHlaR1k2YkdrK2VHMXdMbVJwWkRvNE9HUXpOVFpoTnkwM01UZ3hMV1UxTkdFdE9UbG1aUzAwT0RCbE16VmhZelkyWmpZOEwzSmtaanBzYVQ0Z1BDOXlaR1k2UW1GblBpQThMM0JvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNE9HUXpOVFpoTnkwM01UZ3hMV1UxTkdFdE9UbG1aUzAwT0RCbE16VmhZelkyWmpZaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVFJVTVRrNk1EZzZNRE10TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPalZrTkRZd056Vm1MVGd5WkdZdFpqYzBNQzFpWlRkbExXWTNZalF6T1daaU56SXpNU0lnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE5WUXhPVG95TXpvek1TMHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGljMkYyWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUTRNakZrWmpNdFptRmxOQzB4TWpRekxUbGpaVFV0Wm1Ga04yRTJNVGRtTlRVM0lpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEU1VkRFMU9qVTRPalUxTFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQnpkRVYyZERwamFHRnVaMlZrUFNJdklpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QbmV3WTZVQUFBSkVTVVJCVkVqSDNWWXhheFJSRVA2KzkvYXl1ZFVJa1NObkNBb1JsWWlJV2dtQ2hSRHNSVXRiQzMrQWxzSFd3bFliaTFocFl4RUVtMWlwTVJCUkVVUThnbzJTSENraTNsMjQzTjd1elZna0puZkh1YnU1RnhKdzRMSEZ6czQzODMzelpvZXFpcjAyZzMyd2ZRSDFrbDVXVm4rVnYzeTRGeHc3OGt3T0RSMkV5SVlVMmlQMTlWRHdjK1dpR1Q5MXYxNGNIUjlOaXNza1RhY2ZYR3Rjblh6ckYwWitJd3paOWxVM3RDREllNWg5MWNTYVhBcHYzSndiN0p2ZVQ1OC95dEp5RGFvV2JEOWlRZkcyRHRTRFVoREZGcVZ2SlhIU2RIcEdNTDlBK0VGeUVBVmhTVVR4QUI0L3lidHAybEJCc3dYQUV0WnFPN2RkbVN0b0ZiUkFMUXJkUUdkbkhxSlZ2WTFxdFFMR0J2OVNuMURVUW9WcUExTjNiNldDTW0wNHZINlIxN21GWVFnRFdMdE5hRWVsYW1BTmNPNU1HWlBYMStnRSt2VFJVVzIyaGxBNC9BTnhSTkQydkRDZ0tPd0FNSEZDOGZ6bDJQcWRxY1dnYjNwUG42eGh0VDZPa1dJUktnclZucEtDQ25nKzhXWitCV09GaXB1bVVXd1FSekhPbmo4T1NNcU16Zytndk5SQzRjQ3lHK2dXaytzUjRwWWt1dVVJeEZHTU1EU09vR3g3TXNXUHV6Ujd0NnROaWFvOUV1MFhWRHZtcktZem9ydFVxVEpqcFp1ZHJhNmdaSGZVaEVMMWI0S3U5SExubmNJTWJvbjliVlJCRUR2Wm85UVZGSnF0UHQwY1N3UmhNaVRvcFhGRkFwcWxlOWxqb2VpdmU2Vk5vL1R1SmJPSm1naHFRZmkrQjJUVWRBTlBISytNV3YyKzJPVGxLeDZNbUVSR01KaUQ3M3V3b0hFQ0hTNzZLOFY2SVhqL0xoSVZkdnpLdWkzbkE2V3ZEWE5od3RhZE40Zi9ac1AvQXd6dDVSM2JzUTJqQUFBQUFFbEZUa1N1UW1DQyc7XHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ3B1cnBsZScpIHtcclxuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUgzbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllqVm1ZbVUzWWpZdFpHUTFPQzFqTnpSaUxUaG1aR1l0WWpKa05qVTFOVFkzT1RFMElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpBeE5tWm1OamN0WVdZeFpDMDJNVFE1TFRnek1qUXRaRE0wT0dZMU56ZzBaVGswSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEcG1NR1ZrTVdWak55MHpOVGt3TFdSaE5HSXRPVEZpTUMwMk1EazBObVl4WVRWa09XTThMM0prWmpwc2FUNGdQSEprWmpwc2FUNTRiWEF1Wkdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5qd3ZjbVJtT214cFBpQThMM0prWmpwQ1lXYytJRHd2Y0dodmRHOXphRzl3T2tSdlkzVnRaVzUwUVc1alpYTjBiM0p6UGlBOGVHMXdUVTA2U0dsemRHOXllVDRnUEhKa1pqcFRaWEUrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSmpjbVZoZEdWa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5pSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TldRME5qQTNOV1l0T0RKa1ppMW1OelF3TFdKbE4yVXRaamRpTkRNNVptSTNNak14SWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTFWREU1T2pJek9qTXhMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGlOV1ppWlRkaU5pMWtaRFU0TFdNM05HSXRPR1prWmkxaU1tUTJOVFUxTmpjNU1UUWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TURKVU1USTZNakE2TXpNdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEM5eVpHWTZVMlZ4UGlBOEwzaHRjRTFOT2tocGMzUnZjbmsrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrMzQxM2p3QUFBdXBKUkVGVVNNZmxsODl2VkZVVXh6L24zdnVtMDRMbFY4RHdhMUdSTm9TNHdLWVE0MHB3UlFnN293bHVjQ0ViTnF6d0QyQ0hDemZLUWxlV3hCQldKcEM0UXpZRVE4TENLS0xTQUZXVVNKQlN5MHc3Nzk1elhMd3BuYVl6MHpxdjBZVm5jaWVabkp2M3ZlZjcvWjV6MzRpWjhXK0g0eitJMEMxNWNmd1NEMjllcWVRWFhubTVOcjJwSWxuU3BhY1dHckV1ei9aZWVUSzY2OWlEcWFIZjBva3o3L1FPZXVPem16dUdwdDc4ZUdzYUd0TzFqWDRuOGx3TGE4SXJvRUdsT2prNk1aTTlHR2ZZUGdWcVBZTk9Ybi82NnZyRzA2TjdkbTRnMTdRb1p5M0NaQUxFTkJwdnJkOG1iOHc4QnM3M3JPbWp5djJ6cy8wMW9nbFI0NktWYkdIVlU2SVJZQ0o4di9YcWoxOTlYc3BJMzgxOE0xd1AwOWJDYXR1b0FJNCs3bGR1Yy83clQrWktnY2FOOVhNdjZMcFpBVEtyZGx5ZVBqS0JGOVBtUDE3Yjkvb0hwZHg3ZU1kYkg2VmI2ZjF2QjY2aVlraExUcXo0WllBaVZLT3dxYll6N2YzNTZKZWxRQThPSG5rN2oydmlEejlkODFIbVdBeTdFTGwzRE9hRGJHZjM1aU9uRDFaS2dkNzVaZUw0bGpEUzkxSWNvMko5R05wbWw0QXFpUENYVFRNNWVmYzlHTzFLc1hRYmcrL0txY1lJWTluSThBaXlJUys0bkcrWkpyMkM0QldzMzhqdkJDNC8vSUp4KzFCNnJuU1d1Wmd4a1BYTEdweEZSS1ZObllLSm9TcUllUUpadlJTOWdrTXhvaVNjSktURCtVMGRtaUNaS3o5N0ZTMTBOQ25vN0tDRWlJRUFvbWhiM1h1NlpReWpzL2JPREhFR3JPeWFYQVpVaU9TWUZkcDFaTVFWdWFRSnQ0STZYUGVrdzVwMWRyT2oxK0pJeGJpVTFhRFhXcjdiUjNMR1Azbi9DTXR0RUFRUjhBTFdZZkE3Qld2dUt3MmFFZkJOTXBJdHpOc2xsUW9Gb0hUWGZvVjlXaGdKdEd1bG9nRzFoSnF1RHIyK3NBakpyR09sVUl6ZlZkSFVOYWtTWjdnQUZqdDVMZUc5ekR1Z0xHaEdsUUdrN3BFZ2tPWWY2MXI4TElnSldvR3NZUVN5Y3FBTlp2MGpmdVgzZTNlZlR5UnBmdG8xaVNjd3paKytGT2loa3dlbWZNT3ZEWFBrVGszbmdWUjBTUytyR0NtSUc2N3VyeTNiaHYrYnZ4Vi9BOHNWUUFnOCtnRFlBQUFBQUVsRlRrU3VRbUNDJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1Y2tVcmw7XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0TWlsZXNUb0ZlZXQobWlsZXMpIHtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKG1pbGVzICogNTI4MCk7XHJcbiAgfVxyXG5cclxuICBwdXNoTmV3VHJ1Y2sobWFwcywgdHJ1Y2tJdGVtKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgIHZhciBjdXJyZW50T2JqZWN0ID0gdGhpcztcclxuICAgIHZhciBwaW5Mb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0cnVja0l0ZW0ubGF0LCB0cnVja0l0ZW0ubG9uZyk7XHJcbiAgICB2YXIgZGVzdExvYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0cnVja0l0ZW0ud3JMYXQsIHRydWNrSXRlbS53ckxvbmcpO1xyXG4gICAgdmFyIGljb25Vcmw7XHJcbiAgICB2YXIgaW5mb0JveFRydWNrVXJsO1xyXG4gICAgdmFyIE5ld1BpbjtcclxuICAgIHZhciBqb2JJZFVybCA9ICcnO1xyXG5cclxuICAgIHZhciB0cnVja0NvbG9yID0gdHJ1Y2tJdGVtLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpY29uVXJsID0gdGhpcy5nZXRJY29uVXJsKHRydWNrQ29sb3IsIHRydWNrSXRlbS5sYXQsIHRydWNrSXRlbS5sb25nLCB0cnVja0l0ZW0ud3JMYXQsIHRydWNrSXRlbS53ckxvbmcpO1xyXG5cclxuICAgIGlmICh0cnVja0NvbG9yID09ICdncmVlbicpIHtcclxuICAgICAgaW5mb0JveFRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRWdBQUFBckNBWUFBQURiamM2ekFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFGR21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TlMwd01WUXhOam94TVRveE1DMHdORG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNakF0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1qQXRNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1Rka1pqRTBZbVF0TkRCaE9DMDFORFJqTFRrek9UQXRNMlJpTm1aa1lUWm1NbUpsSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZNR0ZrTTJJeVpESXRPREJoTmkweE1EUmtMVGhpTnpRdFpqVmhaREZtTVRobFl6RXlJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPVGRrWmpFMFltUXROREJoT0MwMU5EUmpMVGt6T1RBdE0yUmlObVprWVRabU1tSmxJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNU4yUm1NVFJpWkMwME1HRTRMVFUwTkdNdE9UTTVNQzB6WkdJMlptUmhObVl5WW1VaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1EVXRNREZVTVRZNk1URTZNVEF0TURRNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCtPZHVLM1FBQUF3OUpSRUZVYU43dG1qMVBHMEVRaHU4bnVLZWhESjBybE5KU0pHcEhwQ1d5bERZRjZhQUJWNlFpUVFLbFNSUk1GU1VGcHFOQm1Bb0VCYVFncERUaVE1UUdtcFNiZTlGdE5CbjJ6bnQzTzhkOWVLU1JiVGp0dnZmYzdzemM3bnFla0NtbDJxcllkdUo3VFFwT1EvZHkvK2RlZlRuWVVNdTl0ZHc3ZEVJdnNhNFVvQzNkdzlTbmwycHM0VmxoSEhxcEpRVlE5LzJqN3ozZkIyRmo5TmZONzBMQjBYN1FQMG9HS0FEVHM1M0U2S2d5Z1B4ckZ6a0F6RmMwUmgyanBuS0EvT3ZXK2NoNDgrMnRzZkZYNjYrckJZakRXZHgrSDlsNHBRQnhPTys2ODBNYnJ3eWdKSEFxQXlncG5Fb0FTZ09uOUlEU3dpazFJUC83U2xvNHBRWGtmelpkd0Nrem9MNExPS1VFUkVmUGo1TnU2c2JMQ0tpamZ6ei84R0lFeUFBSUsyZnFjbkR0cFBFeUFuSjZNeU5BUXh6VGxKcUxhWnVsVHl4TnFqdXk3T3BKUEcyNkpuUXh1Rkt6bTNOcSt1dE03aDA2b2ZlL0pWY0pRSFNhRmR4bVBhbDRnWHFLN1JBVXpiWjBrU2dXVURHZnNjQ0crb292emViUm1iWEZBUlhOUjRDeUJJVHBveU0vUHZPMFFZalNnbXF6TFRXY0FFSm4zNDgzalZFTktYSjVkL1hKd0dDbjVaU1VHTlQyKzRjUDJWVVVFRExUblVWbWdraU1zQ3poaEQwMGJwLzNOMlFBNGVud2JXVmtLRHdWT04vNHp4SVNoNE43MGRxZ0cxbVVhc1AxVGdIeDhqdHNid3pYMFNyYXhmS0p6YWkyV2V4RGFLRGFUTlB0VVpGb0N3aEhRMnczRGdFSkt3Tlp2WXZSVjRNNDJrN1p3UXBEOWQvUWdQYUczWXdXWWJza1FxZmpNTkd1anFyWWFxTWpqdDR2UWdTemNRMm9wZit5ZmJiektHN2d0elkwRXJlbWtLeXY2TWkyMVVidlI1OHY0R2VDTUdqNGRzOVAvUi9FR2tSNnBHczREWUFRWkN0ZXh5eWQraVVjcVR1Sk5wcjZRN0pmblFPcVVVaGhsbVFFWldWSkFJVllLMnk3dVJZY3ZMeU5xbS95dXR4aHE0MlhLL1R0L1Y5Z3RqeUVTYjBUWjF1SUR2MGdDVFFFdlIyVnVybXpTdnM4YUtPVzlsRG1PSTFSVVVJTWM3cnVDVnR3b3cvYW90NEpEZHBhWXVlZTBSbGVCSkVWSU1xMFhPbFVRTFMyWmdKdEhRa2hLekhDUXR2TDBHaTVZbUVkNmFkMUh0SDVubld3YzYrdFRndGZnMEYzTTA2YmZ3RzRUdjhYeStoUGFBQUFBQUJKUlU1RXJrSmdnZz09JztcclxuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAncmVkJykge1xyXG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUZFbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdOUzB3TVZReE5qb3hNVG95TVMwd05Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNak10TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNak10TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNlpqQTFZMlZtTkRjdE0yTmpZaTAzWWpRMkxXSTFaalF0TjJJNU1EQXdNamcxTWpsbElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09tWXdOV05sWmpRM0xUTmpZMkl0TjJJME5pMWlOV1kwTFRkaU9UQXdNREk0TlRJNVpTSWdlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09tWXdOV05sWmpRM0xUTmpZMkl0TjJJME5pMWlOV1kwTFRkaU9UQXdNREk0TlRJNVpTSStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WmpBMVkyVm1ORGN0TTJOallpMDNZalEyTFdJMVpqUXROMkk1TURBd01qZzFNamxsSWlCemRFVjJkRHAzYUdWdVBTSXlNREU0TFRBMUxUQXhWREUyT2pFeE9qSXhMVEEwT2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BwS3BjS2NBQUFMNFNVUkJWR2plN1pyTlNqTXhGSWJuRXVZU3VuYlZuVnMzN3NVYmNHNUE2Tlp1bktVN1hlamE2ZzIwRjFDdzYyNFVRU3dJL2tCRkVJcEZRUkNFbUxjMGNucWNURE16eVRnL1BYQSs5V05JM2p4SlRrNStQTStCQ1NGQ1VXNjdsTzU3anVCc3FGcSszOS9GNi9tNWVEazVLYnhESi9RUzY3b0MxRk0xakxhM3hlWGFXbWtjZXBrMTBnQm9TaitVZmlIOVRUZEdQMGVqVXNGUi9qRWMwbWFFU2NGY21FNWlWRlFiUVBMRGZRNEE4eFdGVWNlb3FSMGcrZEVwSHhuM3U3dVJoZDhGUWIwQWNUampnNFBZd21zRmlNTjVhcmVYRmw0YlFHbmcxQVpRV2ppMUFKUUZUdVVCWllWVGFVRHlsNk9zY0NvTFNQNnpaUU5PbFFFOTJJQlRaVUF6bS9SNm1RdXZOS0NiemMwVklCMmdyK2RuSzRWWEZwQ3R4cXdBTFhGTVUybzJwbTJlZnIyK3pvOWRXNTd0M3FablFsL2pzWGphMnhOM096dUZkK2lFWG1hK2RVQjBtcFhjV2lxTHRoNHZrRSt4b1ZvMjY5RTltSk9BaXZtTUF6YmtWL3hvdG9qT0xIUU9xR3krQXBRbklFd2ZGZm54czBnWGhFZ3RxRGJUVk1NS0lGUTI2WFlqb3hxV3lKZmo0MzhEZzV1V3o5dGI3UjBkVmxlbmdFeFhKb2pFQ01zVGpxN1R1TDJlbmJrQmhON2gxOHBZb2RBcmNIN3hueWNrRGdkdFVkcWdHNnNvMVlidnJRTGk2YmZ1Ymd6ZjBTemF4dkdKeWFnMk9leERhS0Rhb3FaYlpKSm9BZ2hQUTB3dkRnRUpKd041N2NYbzFpQ0pOb3p3SmRuL3hnS2d1TVlvRWFaSEluUTZMaE50NjZtS3FUWTY0bWg3RVNLMHoxN1UvMHo3L1Q5eEEzLy9CamhaU05LY3dtVitSVWUycVRiYUh2VytJT0pOMElEZmhWMHR2QWlUa1I3TE5ad0dRQWd5RmE5aWxscjZYVGpkSGlUUlJqdFBzL28xT1NDZlF0SXVrU2xHVUY2V0JwREdBdDFkdkQ5L2VEbU55MitLZXR4aHFvMm5LM1QzdmhDWURSNWhVdThrdVJaaU8rTkJSSGsyUFl4YnV2OGM1aTFtMm8vek12eXNqekliTkViRkNZbVkwMDNQc2MwYk90TVd0eWVNMEJZNGUvZU15ckFSeEtvQVVacmp5c0RMd2ZqTnNLRzJqZ3NoUnduQ1F1amxhT2lNQk5vNnJudnJNYWJ5Z1hHd3M2K3RPYTlmWjlDOWxiVGNIeEhCeEI3SjZlVFZBQUFBQUVsRlRrU3VRbUNDJztcclxuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAneWVsbG93Jykge1xyXG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFzQ0FZQUFBREdpUDRMQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUZFbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdOUzB3TVZReE5qb3hNVG93Tmkwd05Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNVGt0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNVGt0TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9UQXlOREU0WTJFdE5UTXpOQzA0TmpSakxXRmhObUV0WVRKbE5EazJZbVUxWW1FNElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09qa3dNalF4T0dOaExUVXpNelF0T0RZMFl5MWhZVFpoTFdFeVpUUTVObUpsTldKaE9DSWdlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09qa3dNalF4T0dOaExUVXpNelF0T0RZMFl5MWhZVFpoTFdFeVpUUTVObUpsTldKaE9DSStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RBeU5ERTRZMkV0TlRNek5DMDROalJqTFdGaE5tRXRZVEpsTkRrMlltVTFZbUU0SWlCemRFVjJkRHAzYUdWdVBTSXlNREU0TFRBMUxUQXhWREUyT2pFeE9qQTJMVEEwT2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BuS2JJNVlBQUFNSlNVUkJWR2plN1pxOVNzUkFFSUR2RVN4OEFNRVhPSHdCN3duVUo1QjdBQVY3QzYvVlJrdXR2TTVTUVFRYk9RVzFzZkJBTFN6ODRSb2J3YlBRUXN5dE0yczJUamFiWlBPemEzNXVZRkJRc3BNdnN6T3pzOU5vV0JERzJBVG9iQW0wMmJBcHNPQUM2Qk1ybDd5QnJ1RkhOUTJudzhvdDE4WWd3WU5iM2pKZjc4eDUzR0hPL1VieEZleEVlNG5zbXdKMElGWnd6bHJzKzNDeU5JcjJVa2tMb0FtNkNkcHo5NnhTUnUrM3BZSWpkUFI2a1E2UUM2YW51NGx4b2RvQWNpTzdYMkMvNHNOOENsNVRPMER3Zjd1eVp6aFhpK285ZkRsZkwwQUJPSGVyMFVHdVRvQUNjUHJMOFZtZ0xvRFN3S2tOb0xSd2FnRW9DNXpLQThvS3A5S0E0UGV0ckhBcUM4aHRTMlNHVTJWQVQzbkFxU1FnNmoyandWNzIwM0FGQVhXOTFzVEp6QmlRQXRBMS8rMXprRTgvcFlLQWNuMlpNYUE0UUxCTnFlU3hiYTNxOFRSalgwTnpnUGdYSUQwaDlqRmdUbjhKUEd1dStBcDJvcjIrbHFzSlFIU2JsVnhXR3FiaUJkWlQwZzFCMmVSQUZJbm1BaXJzWjJ5d1lYMFZhTTBXVUNYcG1BZFVNaDBEc2dvSXRvK0kvUHhuZ1M0SXNiVHcyYVpaYXVRQ0NCZkRtS0lVU0pHaisvWC9BM08xQ0NYR1RjZ2QzVG5QcmtZQi9XYW1ZZnlGSVJpSkhtYTErZzM3YUpJNEQ5dG1BT0hYa2ErVk1VUGhWK0VxWGZ6YmhDVEQ0VmxKMklaZWhYK250b1YwTGRJRGtzcnYwTHN4VE92MFpqV0g5b21XVjJzMCszaG9JTGFwdGx1Z1NOUUZoS01odWhlSEhPYm53TnBaakI0Tmt0akdQVHk2K204SlFLZHhMK01ab2RrU29kc3gxdWk4UmxVMGJhTWVSOStYaHdpL1RBbEFiZTlsWG82Q2NRT3Bpd2ZDUTVMV0ZDYnJLK3JaMnJiUjkzSG5DK1NaSUhRYSticW4vemV4TWVTUkh0TTFWeElBMFNCdFFDSm11YW5maUVMcVRtVWJTZjBoMmErcG1rTHR4NmJJRkI1a1M5SUFDcEYyMUtndURsNE9JK3ViZ3JZN3RHMlR5aFY2ZXZjQ3MrWVFKdFZ1a21zaDZ2cHVFbWdaMUU1VTZnNDI4M3lWOXJQN2pJbXNRNWxUdmhnVllZaGlUemN0ekdNL2U3WkZuQWtWdHJXTnpUM2pZbmdRNUlkV01FclZyc3pWZ1BpQjlhUzJkVTBZc3BVZ0xIUXNUL1czRTlpbURlY0hSanhTbUsrYnFmd0FBQUFBU1VWT1JLNUNZSUk9JztcclxuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAncHVycGxlJykge1xyXG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUd0bWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdNeTB3TTFReE1Ub3pNVG93TkMwd05Ub3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZORGt0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZORGt0TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1Ea3dZVEF3WlRZdE9UTm1aaTFrWWpRMUxXSXhNakV0TTJJMU16Qm1OMll5WlRRd0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2TlRKa01XUXdNRGd0WVdNeE15MDNNRFE1TFRsbU9HTXRPVGhpTlRjeFpESXpZakkwSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2WXpJME9UZzBNR1V0TW1Ka01TMWtaRFF4TFRnMFkySXRNV1EwWWpSak56VmtNRGt4SWo0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGpNalE1T0RRd1pTMHlZbVF4TFdSa05ERXRPRFJqWWkweFpEUmlOR00zTldRd09URWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TUROVU1URTZNekU2TURRdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pKbU16azNNakU0TFRsbU1EVXRaVGMwTUMxaVkyWTVMVE5pTW1Wak16azVNRFEzTWlJZ2MzUkZkblE2ZDJobGJqMGlNakF4T0Mwd015MHdNMVF4TVRvek9Ub3dPQzB3TlRvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZNRGt3WVRBd1pUWXRPVE5tWmkxa1lqUTFMV0l4TWpFdE0ySTFNekJtTjJZeVpUUXdJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakUxT2pRNUxUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUGdZb0k0b0FBQUw5U1VSQlZHamU3WnE3VGh0QkZJYjNFZndJUElJZmdUZkFOWldyMU82RGhMdVVRQnNweW5aV2luQUxEVWhnRjBna1VpUWloMlliMWtVb2tKQ01FQVZVeS83SUE4ZkhzN3V6dTNNMmUvR1JqbnpSYXViZmIyYk9uTGs0anBBRlFkQVBxbTJYb2JlazRLeXFXcDRlbjRQeG9SZjhIbHlWM3FFVGVvbnRTUUhhVnpWODd4MEhuOWUrVmNhaGwxcFdBTzNRdDBJZmhqNk42cU4zL3JSU2NKVGYvTDNOQm1nR1ptZzZpRkZSWXdDRnoyNXlBQml2S0l3NmVrM2pBSVhQZmVVOTQrVFR1YmJ3bzQxaHN3QnhPQmRmTG1NTGJ4UWdEbWUwOHl1eDhNWUF5Z0tuTVlDeXdta0VvRHh3YWc4b0w1eGFBd3EvYitlRlUxdEE0V2ZIQnB3NkEvSnR3S2tsSU5wN3ZETS9kK0YxQk9TcUg0TVBSMHRBR2tEWU9Rc2ViaCt0RkY1SFFGWmZaZ2tvd1RGTXFka1l0a1c2dTc0N3QrM3FTTFEyM1JQQzBNWE0rT1BqV2VrZE9xRjNic3RWQWhBZFpoVzNuaU1WTDlBYTdJU2dhcmF2a2tTeGdJcnhqQTAyNUZkOGE3YU16cXd2RHFocXZnUlVKQ0FNSHhYNThWbW1BMEtrRmxTYmFhcGhCUkFxODA1OWJWVERGSWtqM1A4RkJpY3RkOWZUeURNNnpLNmlnRXhuSm9oRUR5c1NUbFNqY1JzZmVES0EwRHI4V0JrekZGb0Z6Zy8raTRURTRlQmRsRGJveGl4S3RlRjVxNEI0K2gxMU5vYm5hQlp0WS92RXBGZWJiUFloTkZCdHV1RzJrQ1NhQWtKY01UMDRCQ1Nhcmt1dnhXaGRhYlNoaHlkay82c0swQ2pwWlZTaHBsc2lkRGdtaWJaMVZjVlVHKzF4OUgwUklwaXRLRUJkOVkvLzg5OUMzTUR2dHdCMzZLWE9LU1R6SzlxelRiWFI5MUgzQy9pZElIUWFmdHp6Wis1RzJNSDdqVEFhQU5OTTRTcG1xYWxmd3VueUlJMDIybmdSczErYkEycFJTSkZUWklZZVZKUmxBUlJoM2FqajV0YnM0dVY5WEg1VDF1ME9VMjA4WGFHcjk3ZkFiSGdKazdxYjVsaUlyWXhIbXZKc2VqOXU2bDdZekp2UHRDZXpNbHA1TDJXdTBCZ1ZKMFF6cHR1T3NNMWU5RlZiM0pwUW82MHJkdThabFdFaGlGa0JvblRibFZZRnhHdnJaTkRtU2dqWlRoRVcrazZCUnRNVkEzT2xXMnNTVS9uSU9OaloxOWFtaWEvR29MdVRwc3dYb2FUd3NuS0FrZEVBQUFBQVNVVk9SSzVDWUlJPSc7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGZlZXRmb3JNaWxlcyA9IDAuMDAwMTg5Mzk0O1xyXG4gICAgdmFyIG1pZWxzVG9kaXNwYXRjaCA9IHBhcnNlRmxvYXQodHJ1Y2tJdGVtLmRpc3QpLnRvRml4ZWQoMik7XHJcblxyXG4gICAgdGhpcy5yZXN1bHRzLnB1c2goe1xyXG4gICAgICBkaXNwbGF5OiB0cnVja0l0ZW0udHJ1Y2tJZCArIFwiIDogXCIgKyB0cnVja0l0ZW0udGVjaElELFxyXG4gICAgICB2YWx1ZTogMSxcclxuICAgICAgTGF0aXR1ZGU6IHRydWNrSXRlbS5sYXQsXHJcbiAgICAgIExvbmdpdHVkZTogdHJ1Y2tJdGVtLmxvbmdcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciB0cnVja1VybCA9IHRoaXMuZ2V0VHJ1Y2tVcmwodHJ1Y2tDb2xvcik7XHJcbiAgICBjb25zdCBsaXN0T2ZQdXNoUGlucyA9IG1hcHMuZW50aXRpZXM7XHJcbiAgICB2YXIgaXNOZXdUcnVjayA9IHRydWU7XHJcblxyXG4gICAgdmFyIG1ldGFkYXRhID0ge1xyXG4gICAgICB0cnVja0lkOiB0cnVja0l0ZW0udHJ1Y2tJZCxcclxuICAgICAgQVRUVUlEOiB0cnVja0l0ZW0udGVjaElELFxyXG4gICAgICB0cnVja1N0YXR1czogdHJ1Y2tJdGVtLnRydWNrQ29sLFxyXG4gICAgICB0cnVja0NvbDogdHJ1Y2tJdGVtLnRydWNrQ29sLFxyXG4gICAgICBqb2JUeXBlOiB0cnVja0l0ZW0uam9iVHlwZSxcclxuICAgICAgV1JKb2JUeXBlOiB0cnVja0l0ZW0ud29ya1R5cGUsXHJcbiAgICAgIFdSU3RhdHVzOiB0cnVja0l0ZW0ud3JTdGF0LFxyXG4gICAgICBBc3NpbmdlZFdSSUQ6IHRydWNrSXRlbS53cklELFxyXG4gICAgICBTcGVlZDogdHJ1Y2tJdGVtLnNwZWVkLFxyXG4gICAgICBEaXN0YW5jZTogbWllbHNUb2Rpc3BhdGNoLFxyXG4gICAgICBDdXJyZW50SWRsZVRpbWU6IHRydWNrSXRlbS5pZGxlVGltZSxcclxuICAgICAgRVRBOiB0cnVja0l0ZW0udG90SWRsZVRpbWUsXHJcbiAgICAgIEVtYWlsOiAnJywvLyB0cnVja0l0ZW0uRW1haWwsXHJcbiAgICAgIE1vYmlsZTogJycsIC8vIHRydWNrSXRlbS5Nb2JpbGUsXHJcbiAgICAgIGljb246IGljb25VcmwsXHJcbiAgICAgIGljb25JbmZvOiBpbmZvQm94VHJ1Y2tVcmwsXHJcbiAgICAgIEN1cnJlbnRMYXQ6IHRydWNrSXRlbS5sYXQsXHJcbiAgICAgIEN1cnJlbnRMb25nOiB0cnVja0l0ZW0ubG9uZyxcclxuICAgICAgV1JMYXQ6IHRydWNrSXRlbS53ckxhdCxcclxuICAgICAgV1JMb25nOiB0cnVja0l0ZW0ud3JMb25nLFxyXG4gICAgICB0ZWNoSWRzOiB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLFxyXG4gICAgICBqb2JJZDogdHJ1Y2tJdGVtLmpvYklkLFxyXG4gICAgICBtYW5hZ2VySWRzOiB0aGlzLm1hbmFnZXJJZHMsXHJcbiAgICAgIHdvcmtBZGRyZXNzOiB0cnVja0l0ZW0ud29ya0FkZHJlc3MsXHJcbiAgICAgIHNiY1ZpbjogdHJ1Y2tJdGVtLnNiY1ZpbixcclxuICAgICAgY3VzdG9tZXJOYW1lOiB0cnVja0l0ZW0uY3VzdG9tZXJOYW1lLFxyXG4gICAgICB0ZWNobmljaWFuTmFtZTogdHJ1Y2tJdGVtLnRlY2huaWNpYW5OYW1lLFxyXG4gICAgICBkaXNwYXRjaFRpbWU6IHRydWNrSXRlbS5kaXNwYXRjaFRpbWUsXHJcbiAgICAgIHJlZ2lvbjogdHJ1Y2tJdGVtLnpvbmVcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGpvYklkU3RyaW5nID0gJ2h0dHA6Ly9lZGdlLWVkdC5pdC5hdHQuY29tL2NnaS1iaW4vZWR0X2pvYmluZm8uY2dpPyc7XHJcblxyXG4gICAgbGV0IHpvbmUgPSB0cnVja0l0ZW0uem9uZTtcclxuXHJcbiAgICAvLyA9IE0gZm9yIE1XXHJcbiAgICAvLyA9IFcgZm9yIFdlc3RcclxuICAgIC8vID0gQiBmb3IgU0VcclxuICAgIC8vID0gUyBmb3IgU1dcclxuICAgIGlmICh6b25lICE9IG51bGwgJiYgem9uZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgaWYgKHpvbmUgPT09ICdNVycpIHtcclxuICAgICAgICB6b25lID0gJ00nO1xyXG4gICAgICB9IGVsc2UgaWYgKHpvbmUgPT09ICdTRScpIHtcclxuICAgICAgICB6b25lID0gJ0InXHJcbiAgICAgIH0gZWxzZSBpZiAoem9uZSA9PT0gJ1NXJykge1xyXG4gICAgICAgIHpvbmUgPSAnUydcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgem9uZSA9ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIGpvYklkU3RyaW5nID0gam9iSWRTdHJpbmcgKyAnZWR0X3JlZ2lvbj0nICsgem9uZSArICcmd3JpZD0nICsgdHJ1Y2tJdGVtLndySUQ7XHJcblxyXG4gICAgdHJ1Y2tJdGVtLmpvYklkID0gdHJ1Y2tJdGVtLmpvYklkID09IHVuZGVmaW5lZCB8fCB0cnVja0l0ZW0uam9iSWQgPT0gbnVsbCA/ICcnIDogdHJ1Y2tJdGVtLmpvYklkO1xyXG5cclxuICAgIGlmICh0cnVja0l0ZW0uam9iSWQgIT0gJycpIHtcclxuICAgICAgam9iSWRVcmwgPSAnPGEgaHJlZj1cIicgKyBqb2JJZFN0cmluZyArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIiB0aXRsZT1cIkNsaWNrIGhlcmUgdG8gc2VlIGFjdHVhbCBGb3JjZS9FZGdlIGpvYiBkYXRhXCI+JyArIHRydWNrSXRlbS5qb2JJZCArICc8L2E+JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSBudWxsICYmIHRydWNrSXRlbS5kaXNwYXRjaFRpbWUgIT0gdW5kZWZpbmVkICYmIHRydWNrSXRlbS5kaXNwYXRjaFRpbWUgIT0gJycpIHtcclxuICAgICAgbGV0IGRpc3BhdGNoRGF0ZSA9IHRydWNrSXRlbS5kaXNwYXRjaFRpbWUuc3BsaXQoJzonKTtcclxuICAgICAgbGV0IGR0ID0gZGlzcGF0Y2hEYXRlWzBdICsgJyAnICsgZGlzcGF0Y2hEYXRlWzFdICsgJzonICsgZGlzcGF0Y2hEYXRlWzJdICsgJzonICsgZGlzcGF0Y2hEYXRlWzNdO1xyXG4gICAgICBtZXRhZGF0YS5kaXNwYXRjaFRpbWUgPSB0aGF0LlVUQ1RvVGltZVpvbmUoZHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFVwZGF0ZSBpbiB0aGUgVHJ1Y2tXYXRjaExpc3Qgc2Vzc2lvblxyXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykgIT09IG51bGwpIHtcclxuICAgICAgdGhpcy50cnVja0xpc3QgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykpO1xyXG5cclxuICAgICAgaWYgKHRoaXMudHJ1Y2tMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICBpZiAodGhpcy50cnVja0xpc3Quc29tZSh4ID0+IHgudHJ1Y2tJZCA9PSB0cnVja0l0ZW0udHJ1Y2tJZCkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnRydWNrTGlzdC5maW5kKHggPT4geC50cnVja0lkID09IHRydWNrSXRlbS50cnVja0lkKTtcclxuICAgICAgICAgIGNvbnN0IGluZGV4OiBudW1iZXIgPSB0aGlzLnRydWNrTGlzdC5pbmRleE9mKGl0ZW0pO1xyXG4gICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpdGVtLkRpc3RhbmNlID0gbWV0YWRhdGEuRGlzdGFuY2U7XHJcbiAgICAgICAgICAgIGl0ZW0uaWNvbiA9IG1ldGFkYXRhLmljb247XHJcbiAgICAgICAgICAgIHRoaXMudHJ1Y2tMaXN0LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMudHJ1Y2tMaXN0LnNwbGljZShpbmRleCwgMCwgaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja1dhdGNoTGlzdCcsIHRoaXMudHJ1Y2tMaXN0KTtcclxuICAgICAgICAgICAgaXRlbSA9IG51bGw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXBkYXRlIGluIHRoZSBTZWxlY3RlZFRydWNrIHNlc3Npb25cclxuICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja0RldGFpbHMnKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcclxuICAgICAgc2VsZWN0ZWRUcnVjayA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tEZXRhaWxzJykpO1xyXG5cclxuICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrLnRydWNrSWQgPT0gdHJ1Y2tJdGVtLnRydWNrSWQpIHtcclxuICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ1RydWNrRGV0YWlscycpO1xyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrRGV0YWlscycsIG1ldGFkYXRhKTtcclxuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRydWNrSXRlbXMubGVuZ3RoID4gMCAmJiB0aGlzLnRydWNrSXRlbXMuc29tZSh4ID0+IHgudG9Mb3dlckNhc2UoKSA9PSB0cnVja0l0ZW0udHJ1Y2tJZC50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICBpc05ld1RydWNrID0gZmFsc2U7XHJcbiAgICAgIC8vIElmIGl0IGlzIG5vdCBhIG5ldyB0cnVjayB0aGVuIG1vdmUgdGhlIHRydWNrIHRvIG5ldyBsb2NhdGlvblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RPZlB1c2hQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcclxuICAgICAgICBpZiAobGlzdE9mUHVzaFBpbnMuZ2V0KGkpLm1ldGFkYXRhLnRydWNrSWQgPT09IHRydWNrSXRlbS50cnVja0lkKSB7XHJcbiAgICAgICAgICB2YXIgY3VyUHVzaFBpbiA9IGxpc3RPZlB1c2hQaW5zLmdldChpKTtcclxuICAgICAgICAgIGN1clB1c2hQaW4ubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgICAgICAgIGRlc3RMb2MgPSBwaW5Mb2NhdGlvbjtcclxuICAgICAgICAgIHBpbkxvY2F0aW9uID0gbGlzdE9mUHVzaFBpbnMuZ2V0KGkpLmdldExvY2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgbGV0IHRydWNrSWRSYW5JZCA9IHRydWNrSXRlbS50cnVja0lkICsgJ18nICsgTWF0aC5yYW5kb20oKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5pbmRleE9mKHRydWNrSXRlbS50cnVja0lkKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25UcnVja0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5wdXNoKHRydWNrSWRSYW5JZCk7XHJcblxyXG4gICAgICAgICAgdGhpcy5sb2FkRGlyZWN0aW9ucyh0aGlzLCBwaW5Mb2NhdGlvbiwgZGVzdExvYywgaSwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50cnVja0l0ZW1zLnB1c2godHJ1Y2tJdGVtLnRydWNrSWQpO1xyXG4gICAgICBOZXdQaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihwaW5Mb2NhdGlvbiwgeyBpY29uOiB0cnVja1VybCB9KTtcclxuXHJcbiAgICAgIE5ld1Bpbi5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG4gICAgICB0aGlzLm1hcC5lbnRpdGllcy5wdXNoKE5ld1Bpbik7XHJcblxyXG4gICAgICB0aGlzLmRhdGFMYXllci5wdXNoKE5ld1Bpbik7XHJcbiAgICAgIGlmICh0aGlzLmlzTWFwTG9hZGVkKSB7XHJcbiAgICAgICAgdGhpcy5pc01hcExvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubWFwLnNldFZpZXcoeyBjZW50ZXI6IHBpbkxvY2F0aW9uLCB6b29tOiB0aGlzLmxhc3Rab29tTGV2ZWwgfSk7XHJcbiAgICAgICAgdGhhdC5sYXN0Wm9vbUxldmVsID0gdGhpcy5tYXAuZ2V0Wm9vbSgpO1xyXG4gICAgICAgIHRoYXQubGFzdExvY2F0aW9uID0gdGhpcy5tYXAuZ2V0Q2VudGVyKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ21vdXNlb3V0JywgKGUpID0+IHtcclxuICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7IHZpc2libGU6IGZhbHNlIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDEwMjQpIHtcclxuICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihOZXdQaW4sICdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgICAgICAgIHNob3dQb2ludGVyOiB0cnVlLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCAyMCksXHJcbiAgICAgICAgICAgIGh0bWxDb250ZW50OiAnPGRpdiBjbGFzcyA9IFwiaW5meSBpbmZ5TWFwcG9wdXBcIj4nXHJcbiAgICAgICAgICAgICAgKyBnZXRJbmZvQm94SFRNTChlLnRhcmdldC5tZXRhZGF0YSwgdGhpcy50aHJlc2hvbGRWYWx1ZSwgam9iSWRVcmwpICsgJzwvZGl2PidcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRoaXMudHJ1Y2tXYXRjaExpc3QgPSBbeyBUcnVja0lkOiBlLnRhcmdldC5tZXRhZGF0YS50cnVja0lkLCBEaXN0YW5jZTogZS50YXJnZXQubWV0YWRhdGEuRGlzdGFuY2UgfV07XHJcblxyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snLCBlLnRhcmdldC5tZXRhZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tEZXRhaWxzJywgZS50YXJnZXQubWV0YWRhdGEpO1xyXG5cclxuICAgICAgICAgIC8vIEEgYnVmZmVyIGxpbWl0IHRvIHVzZSB0byBzcGVjaWZ5IHRoZSBpbmZvYm94IG11c3QgYmUgYXdheSBmcm9tIHRoZSBlZGdlcyBvZiB0aGUgbWFwLlxyXG5cclxuICAgICAgICAgIHZhciBidWZmZXIgPSAzMDtcclxuICAgICAgICAgIHZhciBpbmZvYm94T2Zmc2V0ID0gdGhhdC5pbmZvYm94LmdldE9mZnNldCgpO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hBbmNob3IgPSB0aGF0LmluZm9ib3guZ2V0QW5jaG9yKCk7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveExvY2F0aW9uID0gbWFwcy50cnlMb2NhdGlvblRvUGl4ZWwoZS50YXJnZXQuZ2V0TG9jYXRpb24oKSwgTWljcm9zb2Z0Lk1hcHMuUGl4ZWxSZWZlcmVuY2UuY29udHJvbCk7XHJcbiAgICAgICAgICB2YXIgZHggPSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hPZmZzZXQueCAtIGluZm9ib3hBbmNob3IueDtcclxuICAgICAgICAgIHZhciBkeSA9IGluZm9ib3hMb2NhdGlvbi55IC0gMjUgLSBpbmZvYm94QW5jaG9yLnk7XHJcblxyXG4gICAgICAgICAgaWYgKGR5IDwgYnVmZmVyKSB7IC8vIEluZm9ib3ggb3ZlcmxhcHMgd2l0aCB0b3Agb2YgbWFwLlxyXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXHJcbiAgICAgICAgICAgIGR5ICo9IC0xO1xyXG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBidWZmZXIgZnJvbSB0aGUgdG9wIGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgZHkgKz0gYnVmZmVyO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeSBpcyBncmVhdGVyIHRoYW4gemVybyB0aGFuIGl0IGRvZXMgbm90IG92ZXJsYXAuXHJcbiAgICAgICAgICAgIGR5ID0gMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoZHggPCBidWZmZXIpIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggbGVmdCBzaWRlIG9mIG1hcC5cclxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxyXG4gICAgICAgICAgICBkeCAqPSAtMTtcclxuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgbGVmdCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgIGR4ICs9IGJ1ZmZlcjtcclxuICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIHJpZ2h0IHNpZGUgb2YgbWFwLlxyXG4gICAgICAgICAgICBkeCA9IG1hcHMuZ2V0V2lkdGgoKSAtIGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveEFuY2hvci54IC0gdGhhdC5pbmZvYm94LmdldFdpZHRoKCk7XHJcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHggaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhlbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxyXG4gICAgICAgICAgICBpZiAoZHggPiBidWZmZXIpIHtcclxuICAgICAgICAgICAgICBkeCA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICAgIGR4IC09IGJ1ZmZlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vICMjIyMgQWRqdXN0IHRoZSBtYXAgc28gaW5mb2JveCBpcyBpbiB2aWV3XHJcbiAgICAgICAgICBpZiAoZHggIT0gMCB8fCBkeSAhPSAwKSB7XHJcbiAgICAgICAgICAgIG1hcHMuc2V0Vmlldyh7XHJcbiAgICAgICAgICAgICAgY2VudGVyT2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoZHgsIGR5KSxcclxuICAgICAgICAgICAgICBjZW50ZXI6IG1hcHMuZ2V0Q2VudGVyKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcclxuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGlzLm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XHJcblxyXG4gICAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcclxuICAgICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5pbmZvYm94LCAnY2xpY2snLCB2aWV3VHJ1Y2tEZXRhaWxzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihOZXdQaW4sICdtb3VzZW92ZXInLCAoZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5pbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAgICAgICBzaG93UG9pbnRlcjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9jYXRpb246IGUudGFyZ2V0LmdldExvY2F0aW9uKCksXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgb2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMCwgMjApLFxyXG4gICAgICAgICAgICBodG1sQ29udGVudDogJzxkaXYgY2xhc3MgPSBcImluZnkgaW5meU1hcHBvcHVwXCI+J1xyXG4gICAgICAgICAgICAgICsgZ2V0SW5mb0JveEhUTUwoZS50YXJnZXQubWV0YWRhdGEsIHRoaXMudGhyZXNob2xkVmFsdWUsIGpvYklkVXJsKSArICc8L2Rpdj4nXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLnRydWNrV2F0Y2hMaXN0ID0gW3sgVHJ1Y2tJZDogZS50YXJnZXQubWV0YWRhdGEudHJ1Y2tJZCwgRGlzdGFuY2U6IGUudGFyZ2V0Lm1ldGFkYXRhLkRpc3RhbmNlIH1dO1xyXG5cclxuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJywgZS50YXJnZXQubWV0YWRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrRGV0YWlscycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcclxuXHJcbiAgICAgICAgICAvLyBBIGJ1ZmZlciBsaW1pdCB0byB1c2UgdG8gc3BlY2lmeSB0aGUgaW5mb2JveCBtdXN0IGJlIGF3YXkgZnJvbSB0aGUgZWRnZXMgb2YgdGhlIG1hcC5cclxuXHJcbiAgICAgICAgICB2YXIgYnVmZmVyID0gMzA7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveE9mZnNldCA9IHRoYXQuaW5mb2JveC5nZXRPZmZzZXQoKTtcclxuICAgICAgICAgIHZhciBpbmZvYm94QW5jaG9yID0gdGhhdC5pbmZvYm94LmdldEFuY2hvcigpO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hMb2NhdGlvbiA9IG1hcHMudHJ5TG9jYXRpb25Ub1BpeGVsKGUudGFyZ2V0LmdldExvY2F0aW9uKCksIE1pY3Jvc29mdC5NYXBzLlBpeGVsUmVmZXJlbmNlLmNvbnRyb2wpO1xyXG4gICAgICAgICAgdmFyIGR4ID0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94T2Zmc2V0LnggLSBpbmZvYm94QW5jaG9yLng7XHJcbiAgICAgICAgICB2YXIgZHkgPSBpbmZvYm94TG9jYXRpb24ueSAtIDI1IC0gaW5mb2JveEFuY2hvci55O1xyXG5cclxuICAgICAgICAgIGlmIChkeSA8IGJ1ZmZlcikgeyAvLyBJbmZvYm94IG92ZXJsYXBzIHdpdGggdG9wIG9mIG1hcC5cclxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxyXG4gICAgICAgICAgICBkeSAqPSAtMTtcclxuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYnVmZmVyIGZyb20gdGhlIHRvcCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgIGR5ICs9IGJ1ZmZlcjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHkgaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhhbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxyXG4gICAgICAgICAgICBkeSA9IDA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGR4IDwgYnVmZmVyKSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIGxlZnQgc2lkZSBvZiBtYXAuXHJcbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cclxuICAgICAgICAgICAgZHggKj0gLTE7XHJcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIGxlZnQgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICBkeCArPSBidWZmZXI7XHJcbiAgICAgICAgICB9IGVsc2UgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCByaWdodCBzaWRlIG9mIG1hcC5cclxuICAgICAgICAgICAgZHggPSBtYXBzLmdldFdpZHRoKCkgLSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hBbmNob3IueCAtIHRoYXQuaW5mb2JveC5nZXRXaWR0aCgpO1xyXG4gICAgICAgICAgICAvLyAjIyMjIElmIGR4IGlzIGdyZWF0ZXIgdGhhbiB6ZXJvIHRoZW4gaXQgZG9lcyBub3Qgb3ZlcmxhcC5cclxuICAgICAgICAgICAgaWYgKGR4ID4gYnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgZHggPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgICBkeCAtPSBidWZmZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyAjIyMjIEFkanVzdCB0aGUgbWFwIHNvIGluZm9ib3ggaXMgaW4gdmlld1xyXG4gICAgICAgICAgaWYgKGR4ICE9IDAgfHwgZHkgIT0gMCkge1xyXG4gICAgICAgICAgICBtYXBzLnNldFZpZXcoe1xyXG4gICAgICAgICAgICAgIGNlbnRlck9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KGR4LCBkeSksXHJcbiAgICAgICAgICAgICAgY2VudGVyOiBtYXBzLmdldENlbnRlcigpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XHJcbiAgICAgICAgICBzZWxlY3RlZFRydWNrID0gdGhpcy5tYXBTZXJ2aWNlLnJldHJpZXZlRGF0YUZyb21TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycpO1xyXG5cclxuICAgICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXHJcbiAgICAgICAgICAgICAgeCA9PiB4LmF0dHVpZC50b0xvd2VyQ2FzZSgpID09IHNlbGVjdGVkVHJ1Y2suQVRUVUlELnRvTG93ZXJDYXNlKCkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhblBob25lID0gdGVjaG5pY2lhbkRldGFpbHMucGhvbmU7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMuaW5mb2JveCwgJ2NsaWNrJywgdmlld1RydWNrRGV0YWlscyk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihtYXBzLCAndmlld2NoYW5nZScsIG1hcFZpZXdDaGFuZ2VkKTtcclxuXHJcbiAgICAgIC8vIHRoaXMuQ2hhbmdlVHJ1Y2tEaXJlY3Rpb24odGhpcywgTmV3UGluLCBkZXN0TG9jLCB0cnVja1VybCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWFwVmlld0NoYW5nZWQoZSkge1xyXG4gICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSBtYXBzLmdldFpvb20oKTtcclxuICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSBtYXBzLmdldENlbnRlcigpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gbW91c2V3aGVlbENoYW5nZWQoZSkge1xyXG4gICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSBtYXBzLmdldFpvb20oKTtcclxuICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSBtYXBzLmdldENlbnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEluZm9Cb3hIVE1MKGRhdGE6IGFueSwgdFZhbHVlLCBqb2JJZCk6IFN0cmluZyB7XHJcblxyXG4gICAgICBpZiAoIWRhdGEuU3BlZWQpIHtcclxuICAgICAgICBkYXRhLlNwZWVkID0gMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNsYXNzTmFtZSA9IFwiXCI7XHJcbiAgICAgIHZhciBzdHlsZUxlZnQgPSBcIlwiO1xyXG4gICAgICB2YXIgcmVhc29uID0gJyc7XHJcbiAgICAgIGlmIChkYXRhLnRydWNrU3RhdHVzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChkYXRhLnRydWNrU3RhdHVzLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3JlZCcpIHtcclxuICAgICAgICAgIHJlYXNvbiA9IFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLXRvcDozcHg7Y29sb3I6cmVkOyc+UmVhc29uOiBDdW11bGF0aXZlIGlkbGUgdGltZSBpcyBiZXlvbmQgXCIgKyB0VmFsdWUgKyBcIiBtaW5zPC9kaXY+XCI7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLnRydWNrU3RhdHVzLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3B1cnBsZScpIHtcclxuICAgICAgICAgIHJlYXNvbiA9IFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLXRvcDozcHg7Y29sb3I6cHVycGxlOyc+UmVhc29uOiBUcnVjayBpcyBkcml2ZW4gZ3JlYXRlciB0aGFuIDc1IG0vaDwvZGl2PlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGluZm9ib3hEYXRhID0gJyc7XHJcblxyXG4gICAgICBkYXRhLmN1c3RvbWVyTmFtZSA9IGRhdGEuY3VzdG9tZXJOYW1lID09IHVuZGVmaW5lZCB8fCBkYXRhLmN1c3RvbWVyTmFtZSA9PSBudWxsID8gJycgOiBkYXRhLmN1c3RvbWVyTmFtZTtcclxuXHJcbiAgICAgIGRhdGEuZGlzcGF0Y2hUaW1lID0gZGF0YS5kaXNwYXRjaFRpbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEuZGlzcGF0Y2hUaW1lID09IG51bGwgPyAnJyA6IGRhdGEuZGlzcGF0Y2hUaW1lO1xyXG5cclxuICAgICAgZGF0YS5qb2JJZCA9IGRhdGEuam9iSWQgPT0gdW5kZWZpbmVkIHx8IGRhdGEuam9iSWQgPT0gbnVsbCA/ICcnIDogZGF0YS5qb2JJZDtcclxuXHJcbiAgICAgIGRhdGEud29ya0FkZHJlc3MgPSBkYXRhLndvcmtBZGRyZXNzID09IHVuZGVmaW5lZCB8fCBkYXRhLndvcmtBZGRyZXNzID09IG51bGwgPyAnJyA6IGRhdGEud29ya0FkZHJlc3M7XHJcblxyXG4gICAgICBkYXRhLnNiY1ZpbiA9IGRhdGEuc2JjVmluID09IHVuZGVmaW5lZCB8fCBkYXRhLnNiY1ZpbiA9PSBudWxsIHx8IGRhdGEuc2JjVmluID09ICcnID8gJycgOiBkYXRhLnNiY1ZpbjtcclxuXHJcbiAgICAgIGRhdGEudGVjaG5pY2lhbk5hbWUgPSBkYXRhLnRlY2huaWNpYW5OYW1lID09IHVuZGVmaW5lZCB8fCBkYXRhLnRlY2huaWNpYW5OYW1lID09IG51bGwgfHwgZGF0YS50ZWNobmljaWFuTmFtZSA9PSAnJyA/ICcnIDogZGF0YS50ZWNobmljaWFuTmFtZTtcclxuXHJcbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDEwMjQpIHtcclxuICAgICAgICBpbmZvYm94RGF0YSA9IFwiPGRpdiBjbGFzcz0ncG9wTW9kYWxDb250YWluZXInPjxkaXYgY2xhc3M9J3BvcE1vZGFsSGVhZGVyJz48aW1nIHNyYz0nXCIgKyBkYXRhLmljb25JbmZvICsgXCInID48YSBjbGFzcz0nZGV0YWlscycgdGl0bGU9J0NsaWNrIGhlcmUgdG8gc2VlIHRlY2huaWNpYW4gZGV0YWlscycgPlZpZXcgRGV0YWlsczwvYT48aSBjbGFzcz0nZmEgZmEtdGltZXMnIGFyaWEtaGlkZGVuPSd0cnVlJyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz48L2k+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8aHIvPjxkaXYgY2xhc3M9J3BvcE1vZGFsQm9keSc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5WZWhpY2xlIE51bWJlciA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLnNiY1ZpbiArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5WVFMgVW5pdCBJRCA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLnRydWNrSWQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Sm9iIFR5cGUgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5qb2JUeXBlICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkpvYiBJZCA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBqb2JJZCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5BVFRVSUQgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5BVFRVSUQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+VGVjaG5pY2lhbiBOYW1lIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEudGVjaG5pY2lhbk5hbWUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Q3VzdG9tZXIgTmFtZSA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmN1c3RvbWVyTmFtZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5EaXNwYXRjaCBUaW1lOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5kaXNwYXRjaFRpbWUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC0xMic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wtMTIgY29sLXNtLTEyIGNvbC1mb3JtLWxhYmVsJz5Kb2IgQWRkcmVzcyA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wtMTIgY29sLXNtLTEyJz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwgY29sLWZvcm0tbGFiZWwtZnVsbCc+XCIgKyBkYXRhLndvcmtBZGRyZXNzICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3JvdyBtZXRlckNhbCc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyBkYXRhLlNwZWVkICsgXCI8L3N0cm9uZz4gbXBoIDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPlNwZWVkPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLTEyIGNvbC1tZC00Jz48c3Ryb25nPlwiICsgZGF0YS5FVEEgKyBcIjwvc3Ryb25nPiBNaW5zIDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkN1bXVsYXRpdmUgSWRsZSBNaW51dGVzPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLTEyIGNvbC1tZC00Jz48c3Ryb25nPlwiICsgdGhhdC5jb252ZXJ0TWlsZXNUb0ZlZXQoZGF0YS5EaXN0YW5jZSkgKyBcIjwvc3Ryb25nPiBGdCA8c3BhbiBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5GZWV0IHRvIEpvYiBTaXRlPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj4gPGhyLz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3BvcE1vZGFsRm9vdGVyJz48ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtY29tbWVudGluZyc+PC9pPjxzcGFuIGNsYXNzPSdzbXMnIHRpdGxlPSdDbGljayB0byBzZW5kIFNNUycgPlNNUzwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbCBjb2wtbWQtNCc+PGkgY2xhc3M9J2ZhIGZhLWVudmVsb3BlJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxzcGFuIGNsYXNzPSdlbWFpbCcgdGl0bGU9J0NsaWNrIHRvIHNlbmQgZW1haWwnID5FbWFpbDwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbCBjb2wtbWQtNCc+PGkgY2xhc3M9J2ZhIGZhLWV5ZScgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48c3BhbiBjbGFzcz0nd2F0Y2hsaXN0JyB0aXRsZT0nQ2xpY2sgdG8gYWRkIGluIHdhdGNobGlzdCcgPldhdGNoPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+IDwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCI7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluZm9ib3hEYXRhID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdwYWRkaW5nLXRvcDoxMHB4O21hcmdpbjogMHB4Oyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtMyc+PGRpdiBzdHlsZT0ncGFkZGluZy10b3A6MTVweDsnID48aW1nIHNyYz0nXCIgKyBkYXRhLmljb25JbmZvICsgXCInIHN0eWxlPSdkaXNwbGF5OiBibG9jazttYXJnaW46IDAgYXV0bzsnID48L2Rpdj48L2Rpdj5cIiArXHJcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J2NvbC1tZC05Jz5cIiArXHJcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdyAnPlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTgnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+VmVoaWNsZSBOdW1iZXI8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5zYmNWaW4gKyBcIjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTQnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxhIGNsYXNzPSdkZXRhaWxzJyBzdHlsZT0nY29sb3I6IzAwOUZEQjtjdXJzb3I6IHBvaW50ZXI7JyAgdGl0bGU9J0NsaWNrIGhlcmUgdG8gc2VlIHRlY2huaWNpYW4gZGV0YWlscycgPlZpZXcgRGV0YWlsczwvYT48aSBjbGFzcz0nZmEgZmEtdGltZXMnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweDtjdXJzb3I6IHBvaW50ZXI7JyBhcmlhLWhpZGRlbj0ndHJ1ZScgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+PC9pPjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnPjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5WVFMgVW5pdCBJRDwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLnRydWNrSWQgKyBcIjwvZGl2PjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncm93Jz48ZGl2IGNsYXNzPSdjb2wtbWQtNScgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5Kb2IgVHlwZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmpvYlR5cGUgKyBcIjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC03JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnID5Kb2IgSWQ8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgam9iSWQgKyBcIjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIHJlYXNvbiArIFwiPC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7Jz48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkFUVFVJRDwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLkFUVFVJRCArIFwiPHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7bWFyZ2luLWxlZnQ6OHB4Oyc+VGVjaG5pY2lhbiBOYW1lPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEudGVjaG5pY2lhbk5hbWUgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7JyA+XCJcclxuICAgICAgICAgICsgXCI8ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+Q3VzdG9tZXIgTmFtZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmN1c3RvbWVyTmFtZSArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4OycgPlwiXHJcbiAgICAgICAgICArIFwiPGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkRpc3BhdGNoIFRpbWU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5kaXNwYXRjaFRpbWUgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnID5cIlxyXG4gICAgICAgICAgKyBcIjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5Kb2IgQWRkcmVzczwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLndvcmtBZGRyZXNzICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGhyIHN0eWxlPSdtYXJnaW4tdG9wOjFweDsgbWFyZ2luLWJvdHRvbTo1cHg7JyAvPlwiXHJcblxyXG4gICAgICAgICAgKyBcIjxkaXYgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Oyc+IDxkaXYgY2xhc3M9J3Jvdyc+IDxkaXYgY2xhc3M9J3NwZWVkIGNvbC1tZC0zJz4gPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDFweCc+PHAgc3R5bGU9J2ZvbnQtd2VpZ2h0OiBib2xkZXI7Zm9udC1zaXplOiAyM3B4O21hcmdpbjogMHB4Oyc+XCIgKyBkYXRhLlNwZWVkICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+bXBoPC9wPjwvZGl2PjxwIHN0eWxlPSdtYXJnaW46MHB4JyBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5TcGVlZDwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2lkbGUgY29sLW1kLTUnPjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIGRhdGEuRVRBICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+TWluczwvcD48L2Rpdj48cCBzdHlsZT0nbWFyZ2luOjBweCcgY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+Q3VtdWxhdGl2ZSBJZGxlIE1pbnV0ZXM8L3A+PC9kaXY+IDxkaXYgY2xhc3M9J21pbGVzIGNvbC1tZC00Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIHRoYXQuY29udmVydE1pbGVzVG9GZWV0KGRhdGEuRGlzdGFuY2UpICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+RnQ8L3A+PC9kaXY+PHAgc3R5bGU9J21hcmdpbjowcHgnIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkZlZXQgdG8gSm9iIFNpdGU8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj48L2Rpdj48aHIgc3R5bGU9J21hcmdpbi10b3A6MXB4OyBtYXJnaW4tYm90dG9tOjVweDsnIC8+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPiA8ZGl2IGNsYXNzPSdjb2wtbWQtMSc+PC9kaXY+PGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zJyBzdHlsZT0nXCIgKyBjbGFzc05hbWUgKyBcIic+IDxpIGNsYXNzPSdmYSBmYS1jb21tZW50aW5nIGNvbC1tZC0yJz48L2k+PHAgY2xhc3M9J2NvbC1tZC02IHNtcycgdGl0bGU9J0NsaWNrIHRvIHNlbmQgU01TJyA+U01TPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zIG9mZnNldC1tZC0xJyBzdHlsZT0nXCIgKyBjbGFzc05hbWUgKyBcIic+IDxpIGNsYXNzPSdmYSBmYS1lbnZlbG9wZSBjb2wtbWQtMicgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgZW1haWwnIHRpdGxlPSdDbGljayB0byBzZW5kIGVtYWlsJyA+RW1haWw8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zJyBzdHlsZT0nXCIgKyBzdHlsZUxlZnQgKyBcIic+PGkgY2xhc3M9J2ZhIGZhLWV5ZSBjb2wtbWQtMicgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgd2F0Y2hsaXN0JyB0aXRsZT0nQ2xpY2sgdG8gYWRkIGluIHdhdGNobGlzdCcgPldhdGNoPC9wPjwvZGl2PiA8L2Rpdj5cIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGluZm9ib3hEYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpZXdUcnVja0RldGFpbHMoZSkge1xyXG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdmYSBmYS10aW1lcycpIHtcclxuICAgICAgICB0aGF0LmluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2RldGFpbHMnKSB7XHJcbiAgICAgICAgLy90aGF0LnJvdXRlci5uYXZpZ2F0ZShbJy90ZWNobmljaWFuLWRldGFpbHMnXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2NvbC1tZC02IHNtcycpIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGF0Lm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XHJcblxyXG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcclxuICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhhdC5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxyXG4gICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGpRdWVyeSgnI215TW9kYWxTTVMnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdjb2wtbWQtNiBlbWFpbCcpIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGF0Lm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XHJcblxyXG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcclxuICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhhdC5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxyXG4gICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGpRdWVyeSgnI215TW9kYWxFbWFpbCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgIH1cclxuICAgICBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvYWREaXJlY3Rpb25zKHRoYXQsIHN0YXJ0TG9jLCBlbmRMb2MsIGluZGV4LCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKSB7XHJcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuRGlyZWN0aW9uc01hbmFnZXIodGhhdC5tYXApO1xyXG4gICAgICAvLyBTZXQgUm91dGUgTW9kZSB0byBkcml2aW5nXHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuc2V0UmVxdWVzdE9wdGlvbnMoe1xyXG4gICAgICAgIHJvdXRlTW9kZTogTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5Sb3V0ZU1vZGUuZHJpdmluZ1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5zZXRSZW5kZXJPcHRpb25zKHtcclxuICAgICAgICBkcml2aW5nUG9seWxpbmVPcHRpb25zOiB7XHJcbiAgICAgICAgICBzdHJva2VDb2xvcjogJ2dyZWVuJyxcclxuICAgICAgICAgIHN0cm9rZVRoaWNrbmVzczogMyxcclxuICAgICAgICAgIHZpc2libGU6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3YXlwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IGZhbHNlIH0sXHJcbiAgICAgICAgdmlhcG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiBmYWxzZSB9LFxyXG4gICAgICAgIGF1dG9VcGRhdGVNYXBWaWV3OiBmYWxzZVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IHdheXBvaW50MSA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLldheXBvaW50KHtcclxuICAgICAgICBsb2NhdGlvbjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHN0YXJ0TG9jLmxhdGl0dWRlLCBzdGFydExvYy5sb25naXR1ZGUpLCBpY29uOiAnJ1xyXG4gICAgICB9KTtcclxuICAgICAgY29uc3Qgd2F5cG9pbnQyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuV2F5cG9pbnQoe1xyXG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZW5kTG9jLmxhdGl0dWRlLCBlbmRMb2MubG9uZ2l0dWRlKVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5hZGRXYXlwb2ludCh3YXlwb2ludDEpO1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50Mik7XHJcblxyXG4gICAgICAvLyBBZGQgZXZlbnQgaGFuZGxlciB0byBkaXJlY3Rpb25zIG1hbmFnZXIuXHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMuZGlyZWN0aW9uc01hbmFnZXIsICdkaXJlY3Rpb25zVXBkYXRlZCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy8gY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgdmFyIHJvdXRlSW5kZXggPSBlLnJvdXRlWzBdLnJvdXRlTGVnc1swXS5vcmlnaW5hbFJvdXRlSW5kZXg7XHJcbiAgICAgICAgdmFyIG5leHRJbmRleCA9IHJvdXRlSW5kZXg7XHJcbiAgICAgICAgaWYgKGUucm91dGVbMF0ucm91dGVQYXRoLmxlbmd0aCA+IHJvdXRlSW5kZXgpIHtcclxuICAgICAgICAgIG5leHRJbmRleCA9IHJvdXRlSW5kZXggKyAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV4dExvY2F0aW9uID0gZS5yb3V0ZVswXS5yb3V0ZVBhdGhbbmV4dEluZGV4XTtcclxuICAgICAgICB2YXIgcGluID0gdGhhdC5tYXAuZW50aXRpZXMuZ2V0KGluZGV4KTtcclxuICAgICAgICAvLyB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhzdGFydExvYyxuZXh0TG9jYXRpb24pO1xyXG4gICAgICAgIHRoYXQuTW92ZVBpbk9uRGlyZWN0aW9uKHRoYXQsIGUucm91dGVbMF0ucm91dGVQYXRoLCBwaW4sIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuY2FsY3VsYXRlRGlyZWN0aW9ucygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBNb3ZlUGluT25EaXJlY3Rpb24odGhhdCwgcm91dGVQYXRoLCBwaW4sIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpIHtcclxuICAgIHRoYXQgPSB0aGlzO1xyXG4gICAgdmFyIGlzR2VvZGVzaWMgPSBmYWxzZTtcclxuICAgIHRoYXQuY3VycmVudEFuaW1hdGlvbiA9IG5ldyBCaW5nLk1hcHMuQW5pbWF0aW9ucy5QYXRoQW5pbWF0aW9uKHJvdXRlUGF0aCwgZnVuY3Rpb24gKGNvb3JkLCBpZHgsIGZyYW1lSWR4LCByb3RhdGlvbkFuZ2xlLCBsb2NhdGlvbnMsIHRydWNrSWRSYW5JZCkge1xyXG5cclxuICAgICAgaWYgKHRoYXQuYW5pbWF0aW9uVHJ1Y2tMaXN0Lmxlbmd0aCA+IDAgJiYgdGhhdC5hbmltYXRpb25UcnVja0xpc3Quc29tZSh4ID0+IHggPT0gdHJ1Y2tJZFJhbklkKSkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IChmcmFtZUlkeCA9PSBsb2NhdGlvbnMubGVuZ3RoIC0gMSkgPyBmcmFtZUlkeCA6IGZyYW1lSWR4ICsgMTtcclxuICAgICAgICB2YXIgcm90YXRpb25BbmdsZSA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhjb29yZCwgbG9jYXRpb25zW2luZGV4XSk7XHJcbiAgICAgICAgaWYgKHRoYXQuaXNPZGQoZnJhbWVJZHgpKSB7XHJcbiAgICAgICAgICB0aGF0LmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4ocGluLCB0cnVja1VybCwgcm90YXRpb25BbmdsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGZyYW1lSWR4ID09IGxvY2F0aW9ucy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICB0aGF0LmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4ocGluLCB0cnVja1VybCwgcm90YXRpb25BbmdsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBpbi5zZXRMb2NhdGlvbihjb29yZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9LCBpc0dlb2Rlc2ljLCB0aGF0LnRyYXZhbER1cmF0aW9uLCB0cnVja0lkUmFuSWQpO1xyXG5cclxuICAgIHRoYXQuY3VycmVudEFuaW1hdGlvbi5wbGF5KCk7XHJcbiAgfVxyXG5cclxuICBDYWxjdWxhdGVOZXh0Q29vcmQoc3RhcnRMb2NhdGlvbiwgZW5kTG9jYXRpb24pIHtcclxuICAgIHRyeSB7XHJcblxyXG4gICAgICB2YXIgZGxhdCA9IChlbmRMb2NhdGlvbi5sYXRpdHVkZSAtIHN0YXJ0TG9jYXRpb24ubGF0aXR1ZGUpO1xyXG4gICAgICB2YXIgZGxvbiA9IChlbmRMb2NhdGlvbi5sb25naXR1ZGUgLSBzdGFydExvY2F0aW9uLmxvbmdpdHVkZSk7XHJcbiAgICAgIHZhciBhbHBoYSA9IE1hdGguYXRhbjIoZGxhdCAqIE1hdGguUEkgLyAxODAsIGRsb24gKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgdmFyIGR4ID0gMC4wMDAxNTIzODc5NDcyNzkwOTkzMTtcclxuICAgICAgZGxhdCA9IGR4ICogTWF0aC5zaW4oYWxwaGEpO1xyXG4gICAgICBkbG9uID0gZHggKiBNYXRoLmNvcyhhbHBoYSk7XHJcbiAgICAgIHZhciBuZXh0Q29vcmQgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oc3RhcnRMb2NhdGlvbi5sYXRpdHVkZSArIGRsYXQsIHN0YXJ0TG9jYXRpb24ubG9uZ2l0dWRlICsgZGxvbik7XHJcblxyXG4gICAgICBkbGF0ID0gbnVsbDtcclxuICAgICAgZGxvbiA9IG51bGw7XHJcbiAgICAgIGFscGhhID0gbnVsbDtcclxuICAgICAgZHggPSBudWxsO1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRDb29yZDtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBpbiBDYWxjdWxhdGVOZXh0Q29vcmQgLSAnICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNPZGQobnVtKSB7XHJcbiAgICByZXR1cm4gbnVtICUgMjtcclxuICB9XHJcblxyXG4gIGRlZ1RvUmFkKHgpIHtcclxuICAgIHJldHVybiB4ICogTWF0aC5QSSAvIDE4MDtcclxuICB9XHJcblxyXG4gIHJhZFRvRGVnKHgpIHtcclxuICAgIHJldHVybiB4ICogMTgwIC8gTWF0aC5QSTtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZUJlYXJpbmcob3JpZ2luLCBkZXN0KSB7XHJcbiAgICAvLy8gPHN1bW1hcnk+Q2FsY3VsYXRlcyB0aGUgYmVhcmluZyBiZXR3ZWVuIHR3byBsb2FjYXRpb25zLjwvc3VtbWFyeT5cclxuICAgIC8vLyA8cGFyYW0gbmFtZT1cIm9yaWdpblwiIHR5cGU9XCJNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvblwiPkluaXRpYWwgbG9jYXRpb24uPC9wYXJhbT5cclxuICAgIC8vLyA8cGFyYW0gbmFtZT1cImRlc3RcIiB0eXBlPVwiTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb25cIj5TZWNvbmQgbG9jYXRpb24uPC9wYXJhbT5cclxuICAgIHRyeSB7XHJcbiAgICAgIHZhciBsYXQxID0gdGhpcy5kZWdUb1JhZChvcmlnaW4ubGF0aXR1ZGUpO1xyXG4gICAgICB2YXIgbG9uMSA9IG9yaWdpbi5sb25naXR1ZGU7XHJcbiAgICAgIHZhciBsYXQyID0gdGhpcy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlKTtcclxuICAgICAgdmFyIGxvbjIgPSBkZXN0LmxvbmdpdHVkZTtcclxuICAgICAgdmFyIGRMb24gPSB0aGlzLmRlZ1RvUmFkKGxvbjIgLSBsb24xKTtcclxuICAgICAgdmFyIHkgPSBNYXRoLnNpbihkTG9uKSAqIE1hdGguY29zKGxhdDIpO1xyXG4gICAgICB2YXIgeCA9IE1hdGguY29zKGxhdDEpICogTWF0aC5zaW4obGF0MikgLSBNYXRoLnNpbihsYXQxKSAqIE1hdGguY29zKGxhdDIpICogTWF0aC5jb3MoZExvbik7XHJcblxyXG4gICAgICBsYXQxID0gbGF0MiA9IGxvbjEgPSBsb24yID0gZExvbiA9IG51bGw7XHJcblxyXG4gICAgICByZXR1cm4gKHRoaXMucmFkVG9EZWcoTWF0aC5hdGFuMih5LCB4KSkgKyAzNjApICUgMzYwO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIGNhbGN1bGF0ZUJlYXJpbmcgLSAnICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgU2VuZFNNUyhmb3JtKSB7XHJcbiAgICAvLyBpZih0aGlzLnRlY2huaWNpYW5QaG9uZSAhPSAnJyl7XHJcbiAgICBpZiAoZm9ybS52YWx1ZS5tb2JpbGVObyAhPSAnJykge1xyXG4gICAgICBpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHdhbnQgdG8gc2VuZCBTTVM/JykpIHtcclxuICAgICAgICAvLyB0aGlzLm1hcFNlcnZpY2Uuc2VuZFNNUyh0aGlzLnRlY2huaWNpYW5QaG9uZSxmb3JtLnZhbHVlLnNtc01lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMubWFwU2VydmljZS5zZW5kU01TKGZvcm0udmFsdWUubW9iaWxlTm8sIGZvcm0udmFsdWUuc21zTWVzc2FnZSk7XHJcblxyXG4gICAgICAgIGZvcm0uY29udHJvbHMuc21zTWVzc2FnZS5yZXNldCgpXHJcbiAgICAgICAgZm9ybS52YWx1ZS5tb2JpbGVObyA9IHRoaXMudGVjaG5pY2lhblBob25lO1xyXG4gICAgICAgIGpRdWVyeSgnI215TW9kYWxTTVMnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIuc3VjY2VzcygnU01TIHNlbnQgc3VjY2Vzc2Z1bGx5JywgJ1N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIFNlbmRFbWFpbChmb3JtKSB7XHJcbiAgICAvLyBpZih0aGlzLnRlY2huaWNpYW5FbWFpbCAhPSAnJyl7XHJcbiAgICBpZiAoZm9ybS52YWx1ZS5lbWFpbElkICE9ICcnKSB7XHJcbiAgICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgd2FudCB0byBzZW5kIEVtYWlsPycpKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXNlclByb2ZpbGVTZXJ2aWNlLmdldFVzZXJEYXRhKHRoaXMuY29va2llQVRUVUlEKVxyXG4gICAgICAgIC8vICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgIC8vICAgICB2YXIgbmV3RGF0YTogYW55ID0gdGhpcy5zdHJpbmdpZnlKc29uKGRhdGEpO1xyXG4gICAgICAgIC8vICAgICAvL3RoaXMubWFwU2VydmljZS5zZW5kRW1haWwobmV3RGF0YS5lbWFpbCx0aGlzLnRlY2huaWNpYW5FbWFpbCxuZXdEYXRhLmxhc3ROYW1lICsgJyAnICsgbmV3RGF0YS5maXJzdE5hbWUsIHRoaXMudGVjaG5pY2lhbk5hbWUsIGZvcm0udmFsdWUuZW1haWxTdWJqZWN0LGZvcm0udmFsdWUuZW1haWxNZXNzYWdlKTtcclxuICAgICAgICAvLyAgICAgdGhpcy5tYXBTZXJ2aWNlLnNlbmRFbWFpbChuZXdEYXRhLmVtYWlsLCBmb3JtLnZhbHVlLmVtYWlsSWQsIG5ld0RhdGEubGFzdE5hbWUgKyAnICcgKyBuZXdEYXRhLmZpcnN0TmFtZSwgdGhpcy50ZWNobmljaWFuTmFtZSwgZm9ybS52YWx1ZS5lbWFpbFN1YmplY3QsIGZvcm0udmFsdWUuZW1haWxNZXNzYWdlKTtcclxuICAgICAgICAvLyAgICAgdGhpcy50b2FzdHIuc3VjY2VzcyhcIkVtYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5XCIsICdTdWNjZXNzJyk7XHJcblxyXG4gICAgICAgIC8vICAgICBmb3JtLmNvbnRyb2xzLmVtYWlsU3ViamVjdC5yZXNldCgpXHJcbiAgICAgICAgLy8gICAgIGZvcm0uY29udHJvbHMuZW1haWxNZXNzYWdlLnJlc2V0KClcclxuICAgICAgICAvLyAgICAgZm9ybS52YWx1ZS5lbWFpbElkID0gdGhpcy50ZWNobmljaWFuRW1haWw7XHJcbiAgICAgICAgLy8gICAgIGpRdWVyeSgnI215TW9kYWxFbWFpbCcpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgLy8gICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgU2VhcmNoVHJ1Y2soZm9ybSkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgLy8kKCcjbG9hZGluZycpLnNob3coKTtcclxuXHJcbiAgICBpZiAoZm9ybS52YWx1ZS5pbnB1dG1pbGVzICE9ICcnICYmIGZvcm0udmFsdWUuaW5wdXRtaWxlcyAhPSBudWxsKSB7XHJcbiAgICAgIGNvbnN0IGx0ID0gdGhhdC5jbGlja2VkTGF0O1xyXG4gICAgICBjb25zdCBsZyA9IHRoYXQuY2xpY2tlZExvbmc7XHJcbiAgICAgIGNvbnN0IHJkID0gZm9ybS52YWx1ZS5pbnB1dG1pbGVzO1xyXG5cclxuICAgICAgdGhpcy5mb3VuZFRydWNrID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0ID0gW107XHJcblxyXG4gICAgICBpZiAodGhpcy5jb25uZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5sb2FkTWFwVmlldygncm9hZCcpO1xyXG5cclxuICAgICAgdGhhdC5Mb2FkVHJ1Y2tzKHRoaXMubWFwLCBsdCwgbGcsIHJkLCB0cnVlKTtcclxuXHJcbiAgICAgIGZvcm0uY29udHJvbHMuaW5wdXRtaWxlcy5yZXNldCgpO1xyXG4gICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgfSwgMTAwMDApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG5cclxuICBnZXRNaWxlcyhpKSB7XHJcbiAgICByZXR1cm4gaSAqIDAuMDAwNjIxMzcxMTkyO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWV0ZXJzKGkpIHtcclxuICAgIHJldHVybiBpICogMTYwOS4zNDQ7XHJcbiAgfVxyXG5cclxuICBzdHJpbmdpZnlKc29uKGRhdGEpIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICB9XHJcbiAgcGFyc2VUb0pzb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgfVxyXG5cclxuICBSb3VuZChudW1iZXIsIHByZWNpc2lvbikge1xyXG4gICAgdmFyIGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xyXG4gICAgdmFyIHRlbXBOdW1iZXIgPSBudW1iZXIgKiBmYWN0b3I7XHJcbiAgICB2YXIgcm91bmRlZFRlbXBOdW1iZXIgPSBNYXRoLnJvdW5kKHRlbXBOdW1iZXIpO1xyXG4gICAgcmV0dXJuIHJvdW5kZWRUZW1wTnVtYmVyIC8gZmFjdG9yO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXRhbjIoeSwgeCkge1xyXG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCk7XHJcbiAgfTtcclxuXHJcbiAgZ2V0SWNvblVybChjb2xvcjogc3RyaW5nLCBzb3VyY2VMYXQ6IG51bWJlciwgc291cmNlTG9uZzogbnVtYmVyLCBkZXN0aW5hdGlvbkxhdDogbnVtYmVyLCBkZXN0aW5hdGlvbkxvbmc6IG51bWJlcikge1xyXG4gICAgdmFyIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEzWkpSRUZVYUlIdGwxMUlVMkVZeC85dnVWcVFheGVCNnd2MEtzY0lGNEcwYnBvYVpuV3poVnBkVkVwMUVScm1wQ2h2TWdqckloVDZvS0JaNkVYVUF1ZU5hRkgwUVRTeHlBV1ZYUlF1UDFBdnN1M001bkhhbmk3Y2x1blp4OWxtQ0w2L3EzUE84L0tjLy85NXZ3RU9oOFBoY0RnY0RvZXpWR0dwU0VKRWFnQlZxY2dsZ1lzeDFod3BtSlpzZGlKU0J5andZY3ozYysyd1o4U2ZiTDY1YkZtdlV4T1JrVEZXTGhXWDNRUEJhdThFb0E5KzBrOU1pZnUyWGQycEVFUWhDYW5TV1BJcVlURldBRUFXWTh3MU55NnJCNGlvYWpydysxTGFzdVdyKzM3MGo0OVBlcWN6VkJsSzE5aDN0aERpQWNEaDZnWlFBUUNaQUJJM1FFVDNBSlJkZTNVYlZrY0xCRkZZRGN4VWFFZG1ib3JreWljdUF5SHhsclphMkhyc0N5eEpIc3RpTlZqTTRvRVlCaGE3ZUNDS0FTSXlZcEdMQjZMTWdjbHAvNW5YMzk1TTJYcnNpdjhwU0M0UkRheE1XN0czdmZkSlhFblNsZWtwRXpTWE5VcFYxSGpVVldqQVBSVHpCNExvaFU2VGpSSzlLYTcyY2luT01ZVWVuVkx4cEk4U3RoNDdTdlVtTkpvdko1c3FHdFdNTWJkVUlHa0RnaWlnOEpZWmhxelViMmFsZWpOSzlDWWdRdldCSkF6b05GcDhHdWtOdnp2NnVoTk5OUzlYQ0VNY083d3NBeXFsQ2cybWVoUnBDOExmR3A3ZlFNT0xtM0xTaERtMi9RaHE4aXFoQ2k0Q0RsYzNMUFphV1hOSmxvR21ROWV4U2IwUnh4K2Nna2NVb05Ob1VXT3N3SnBWS2x6b2tEY0hqaHVPb3E3b0hKcTZXdEQ1NVJrQW9NWllDVnQ1TTNiZjJvOTRENGNSRFlqVDRxaE9vODBJRFkwaTdTNFlNbk5oYU53VnJwQ2pyeHVEN2lGWUQxNkgxZEVpcTNJV1l3VWVPZHYrTVY3Y2R3UmQxYzlRdXRVTXE2TVpPZXQwVXdBVWtEaUZ4alNnVEZQZVBwdGZWZXVaOENnRzNFTW8zSnlQTHRmYmVTSTdlNThDQUFxekN5VEhzUlE2alJZcVpUcHN6dms3dk0xcHgrN3NmQkFSQ2pZYkZRQmVTdDBEWWhwZ2pOVVJrYnJSZkRsOFZSenhqdm9CckpqZFRoWGNhQzd1T1IrWCtObEliVktiMUJ0bWVucG1BcjhFWUpyWGFMYk9lSDVFUkhyTVhDanNkWjFYWUhYOHZhSTJtT3BSdXRVTUFHWUFrbXUxRk9PVHZnT0Q3c0VUKys4ZVhoNGE3enFORm85UHRvYUZSMXI3RTRhSXlvaUlQZzczMHAwM3pkVC9jNUNDbENXUVN5MkkzcS9DaEJCNCtMNlZPajQvSlNLaVFDRGdDUlpzWVNBaW96ZzEyZjdqMTVqVDU1KzRIenkxSnBwTFRVU25QYUwzbmMvdjZ5S2l1dUNkbThQaGNEaWNwY0VmazNlQUxiYzErVlFBQUFBQVNVVk9SSzVDWUlJPVwiO1xyXG5cclxuICAgIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwiZ3JlZW5cIikge1xyXG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBM1pKUkVGVWFJSHRsMTFJVTJFWXgvOXZ1VnFRYXhlQjZ3djBLc2NJRjRHMGJwb2Fabld6aFZwZFZFcDFFUnJtcENodk1nanJJaFQ2b0tCWjZFWFVBdWVOYUZIMFFUU3h5QVdWWFJRdVAxQXZzdTNNNW5IYW5pN2NsdW5aeDlsbUNMNi9xM1BPOC9LYy8vOTV2d0VPaDhQaGNEZ2NEb2V6VkdHcFNFSkVhZ0JWcWNnbGdZc3gxaHdwbUpac2RpSlNCeWp3WWN6M2MrMndaOFNmYkw2NWJGbXZVeE9Sa1RGV0xoV1gzUVBCYXU4RW9BOSswazlNaWZ1MlhkMnBFRVFoQ2FuU1dQSXFZVEZXQUVBV1k4dzFOeTZyQjRpb2FqcncrMUxhc3VXciszNzBqNDlQZXFjelZCbEsxOWgzdGhEaUFjRGg2Z1pRQVFDWkFCSTNRRVQzQUpSZGUzVWJWa2NMQkZGWURjeFVhRWRtYm9ya3lpY3VBeUh4bHJaYTJIcnNDeXhKSHN0aU5Wak00b0VZQmhhN2VDQ0tBU0l5WXBHTEI2TE1nY2xwLzVuWDM5NU0yWHJzaXY4cFNDNFJEYXhNVzdHM3ZmZEpYRW5TbGVrcEV6U1hOVXBWMUhqVVZXakFQUlR6QjRMb2hVNlRqUks5S2E3MmNpbk9NWVVlblZMeHBJOFN0aDQ3U3ZVbU5Kb3ZKNXNxR3RXTU1iZFVJR2tEZ2lpZzhKWVpocXpVYjJhbGVqTks5Q1lnUXZXQkpBem9ORnA4R3VrTnZ6djZ1aE5OTlM5WENFTWNPN3dzQXlxbENnMm1laFJwQzhMZkdwN2ZRTU9MbTNMU2hEbTIvUWhxOGlxaENpNENEbGMzTFBaYVdYTkpsb0dtUTlleFNiMFJ4eCtjZ2tjVW9OTm9VV09zd0pwVktsem9rRGNIamh1T29xN29ISnE2V3RENTVSa0FvTVpZQ1Z0NU0zYmYybzk0RDRjUkRZalQ0cWhPbzgwSURZMGk3UzRZTW5OaGFOd1ZycENqcnh1RDdpRllEMTZIMWRFaXEzSVdZd1VlT2R2K01WN2Nkd1JkMWM5UXV0VU1xNk1aT2V0MFV3QVVrRGlGeGpTZ1RGUGVQcHRmVmV1WjhDZ0czRU1vM0p5UEx0ZmJlU0k3ZTU4Q0FBcXpDeVRIc1JRNmpSWXFaVHBzenZrN3ZNMXB4KzdzZkJBUkNqWWJGUUJlU3QwRFlocGdqTlVSa2JyUmZEbDhWUnp4anZvQnJKamRUaFhjYUM3dU9SK1grTmxJYlZLYjFCdG1lbnBtQXI4RVlKclhhTGJPZUg1RVJIck1YQ2pzZFoxWFlIWDh2YUkybU9wUnV0VU1BR1lBa211MUZPT1R2Z09EN3NFVCsrOGVYaDRhN3pxTkZvOVB0b2FGUjFyN0U0YUl5b2lJUGc3MzBwMDN6ZFQvYzVDQ2xDV1FTeTJJM3EvQ2hCQjQrTDZWT2o0L0pTS2lRQ0RnQ1Jac1lTQWlvemcxMmY3ajE1alQ1NSs0SHp5MUpwcExUVVNuUGFMM25jL3Y2eUtpdXVDZG04UGhjRGljcGNFZmszZUFMYmMxK1ZRQUFBQUFTVVZPUks1Q1lJST1cIjtcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcInJlZFwiKSB7XHJcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEweEpSRUZVYUlIdGx6MXNFbUVjeHA5WGhCUURoUkEvTUNTTlRVeTh0RXNYWEVzZ2NkQUJxb09UcEE0dWtLQU94c1l1RGtKMHJkSG8xSlFtYmdZY1hQeEtuRFRnVUFkdG16U3hJVUNLUkN3ZW9RVjY5M2VBdTJoN0JRNWEwOFQzTngzM1A1NTdudmZyM2hmZ2NEZ2NEb2ZENFhBNC95dHNMMFNJeUE3ZytsNW9hYkRLR0p2YnJYaTRYM1Vpc2tPV1AyLzkvSG0wWGlqVSs5WGJ6cEdSRVRzUmVSaGpWN1hxdW51ZzFkcmpBTVphdDhia3pjMExYendlb3lTS2ZWalZ4aGtPd3hrS0FjQXdZMngxZTExWER4RFJkWktrZTh4Z3NOUXltWXBVcVd5WmpoOGZxR1V5YkQvTUEwQWxuVll1VHdIb1BRQVJ6UUtZTER4OWltSThEa2tVTFVDemhTeHU5MTU0N1ltdUFpam1NOVBUS0NXVCsyeEpINGM2UFhDUXpRTWRBaHgwODBDYkFFVGt3UUUzRDdTWkExU3YzeEkvZkdpVWtrbmp2elNrbDEwRE1KUHAvUHFyVjEySkdLeldQVE9rVjd2dEtsVFA1enUrUUJKRm1BVUJEcisvcStmMTR2RDdsY3NGclhyZlc0bFNJZ0ZISUlDaFdLeGZxWGJjWkl5dGF4WDZEaUNKSXBZdlhvVGw3TmwrcFhiZ0NBU1VIdEJzZmFDUEFHWkJ3TWJTa3ZxN2trcjFLclZEUzZHYkw3eXVBQWFyRlVQUktHdytuM3B2N2RFanJEMStyRWRHNWRpVkszQ0d3K3BFcmFUVHlFeFBvNTdMZGEyaEs4RHd3NGN3dVZ6NEZvbW9rOWNaQ3NFd09JamMvZnY2ekFlRGNOMitqZUw4UE1ydjNnRUFuS0VRVHMvT1l2blNKWFM3T2R3MWdMeTVXVEFMd2dsbGFOaDhQbGpjYm53OWQwNXRvVW9xaFhvdWgrR1pHUlRuNTNXMW5ETVVRdW5GaTcrQ3I2UlNHSG45R282SkNSVGpjUndaSFcwQU1FSmpGOW94d0tHQmdTY25JNUU3VXJsc3JPZnpzSG05cUtUVE8weVczNzV0QnZSNk5jZXhGbVpCZ01GcTFmekNsNUpKMkx4ZWdBaUQ0K05HQU8rMXpnRWRBekRHN2hLUmZTZ1dVNCtLamVhSnkvVG5jOHI0ZFUxTmRXVmU2NzkvWW5LNVlIRzdsUW44SGtDZ25VWlhKeklpR2tQelFKSElQWGlBWWp5dTFvYWlVVGdDQVFDWUFLQzVWbXNoVjZ1WGE5bnN0WlZnMEtDTWQ3TWc0TXp6NTZyeDNkYituaUdpU1NLaTZ1SWlmWitibzFvMlN5MG1lOUN5UzZLNHN2WHJsL3dqa2FEMU4yK2FTckpjYmpYWS9rQkVIcmxXZTlrb2xSYWtqWTFuclYxcnIxcDJJcm9oaWVLbnJXcjFJeEhkYloyNU9Sd09oOFA1UC9nTnFoeC82cnN1ampnQUFBQUFTVVZPUks1Q1lJST1cIjtcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcInllbGxvd1wiKSB7XHJcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUF5aEpSRUZVYUlIdGx6MU1VMUVZaHQvdlloV05hWnRnaEFHTm1JQ0pWbUZ3TUNGUkhFd0VFOFZKbk1SQm5SUWR5Z0FPRHJyb1lDSUx1QmdXWWRQRXlHUml4QlFjSENEK0RLaEFXaU00MUhnSmxKL2JudGVodC9XbnR6KzNCVVBDZWFiZSs1MjhmYi92bkh2T2R3Q05ScVBSYURRYWpVYXpVWkhWRUNIcEI5Q3hHbG9PVEl0SWY3YmdwbExWU2ZwQk5RN3J4dzRzZmxzcFZTOEQzeUUveVNZUnVlZ1VkajBEZHJXUEFXaXdYelVnc1hncThlS2dCNVpaZ2xObnBLNFRSbDBRQUdwRVpQcmZ1S3NaSU5rQnhtOURObTFIYkhJZTFud2M1VlhsWEppVXRUQVBBSWlHQUFRQllBK0E0aE1nK1FoQXUvcDBINXpxQXl4ek81Q3NrRlEwcnBKYjl4U1VRTW84eDYrQmtZRTF0dVFPSTkrQVA4MnJkV1lleUpQQWVqY1A1RWlBWkJQV3VYa2cxemVRV0E0eU9teXB5SURuUC9weFRmWUV5cmEwWU9aWllTb2U3eXJaY2RMMjVRem4zSVVZQytmVmw3Z0o4UVlndTlxQUFzYTdSYXJQcFg2T09jVkxiaVZVWkJCRzlYa1k5VDJsU3VYaWhvajhkQXFVbkFBc0UycTRhVTBPTTZsdVM4NXNsdW9ESlNRZzNnQTQ5ejc5ekdpb1dLa01yVFFWalhtYk5YY0plSHd3Nmg5QXFsclNyemh4RjJyaW5pdVpGRWJOWlVoZFovcERaVFFFamw4cjZOdEw0U29CNDNBL1pOdHVxTGNYQU11RStBS1EyazZJeHc5KzZIWm5mdThWeVA3YlVGTVBnZGtoQUhibmVlUXBFcStQbzlEbU1QdEpuRmo2THI1QStsR3FXaUFWalZDanJlRHNFQmdOUVUzMlFZMWZUVlp5MjI1WENVaHRFSXdNZ2grNms1V1BocUJHendBQ0dNbDFEL0UzV1Bid2pDNDBSWTV6b0x4WDluVjFpV1Y2RUF0REtwdkI2RWpHOURKVnZjcVRnTk02ZGpMdkRRQWVIL2gxTUNPbUlvT1F5bVlZSkdUbkNRK0FWMDczZ0x3SmlNZ3RrbjZqdnVmM1ZYRnBaZ1hBNXI4RzJ1dFhEdHh4Znp0eU9LUms2NjdranBiYzFWNEJhTTBsVWRCL2tteEE4a0x4aEI5dlFrMzJwV05HZlU5cXF6c0x3SEd2ZGlReGY0Nng4Q1UxY3Jvc3RkN0ZHNEJ4OUdYYWVMYTl2MmhJdHBPa010OHg4YVdYWEFqVHByMElMVDlYNWo3VE1wVUtEMUROUExlbGxHa1hiRzBnMmNUNDBuTXVSOGNZanoyMnU5Wml0ZndrcjNQRmZNdjR3aHVTdCt3N3QwYWowV2cwRzROZlRpeGtmRnh5WFBFQUFBQUFTVVZPUks1Q1lJST1cIlxyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwicHVycGxlXCIpIHtcclxuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUY2MmxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdNeTB3TTFReE1UbzBNRG96Tnkwd05Ub3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1ETXRNRE5VTVRFNk5UTTZNalV0TURVNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1ETXRNRE5VTVRFNk5UTTZNalV0TURVNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllUbGhZVFl4WkdZdFkyVmhOQzB3WXpReUxUaGhaVEF0WmpZMVpUZGhOV0l3TWpCaElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2TVRJNE5tWXpaR1V0WkRkak5TMWtaVFJtTFRnNU5HWXRNV1l6T0RrMlltTTVaakZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2WVRka05EUm1OMkV0TWpKbFl5MWhPRFEwTFRsbU9XSXRNVEEzWWpGaE5XWTJPVGN5SWo0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGhOMlEwTkdZM1lTMHlNbVZqTFdFNE5EUXRPV1k1WWkweE1EZGlNV0UxWmpZNU56SWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TUROVU1URTZOREE2TXpjdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21FNVlXRTJNV1JtTFdObFlUUXRNR00wTWkwNFlXVXdMV1kyTldVM1lUVmlNREl3WVNJZ2MzUkZkblE2ZDJobGJqMGlNakF4T0Mwd015MHdNMVF4TVRvMU16b3lOUzB3TlRvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NlJRMmNYQUFBQ1MwbEVRVlJvM3UyWXZVb0RRUkRIOHdoNUJOOUFIOERDMmtZcld3WHQxVjdSV2h1N2xJS0tXQ2txTm9Lb29LQkVKU0RFRDB3UmpTU1NjR0xpSldaemQrdit6OXV3aEh4ZTl1Q0VHUmhDTm5lejg1dWRuWjFOaEhNZStjOGFJUUFDSUFBQ0lBQUNJQUFDSUFBQ0lBRHRBTDJJZUQ0cWRDa2duVlRtMFE4QTV4MmJwOHNGWmhhUzM1KzZsZi9KdWpZQUw5cGpTb1QyYWhXYjdRemY4bzNCYSsyYWlHVThCajdRTjRBWW43VXRwd1JyeGRkS0NSRXE1MW5sNDY1WUM4SjU2UEhNZ3dRWTZRc0F5d2dyaUlnYWJYelB4cjk0cUFHazg1ZUxxYVpMSEdxQWRzNkhIcUNUODZFRzhGNW82M3lvQWV5cWMvUjIvc202S1hOaFhZR08wWmNBeHFNWkdNRHAvTE4vQU5CM21pQyttbmF0WHl5aytQSDBnM1o5UFRFa1FEUVFBSndKeHBQSkE1YTVubHVKYmdIVVhOV3RxWU44UFgyMEF4eE8zR3ZMODFhMmxENUlEd0RTUmNsSkxsc0x2NDdIVjlLOFdxelZiYUdhN1k0bWdnUEFCS1gzSDdjeTREZHNZRGlRM01yMjdyeTMrZkd1VEJuWGZ1YW4zbXYxQlNCYTVCd21hU3huYW9UYWpYZFNnQ1BIRzhjUklEa3Z6aUhaU3Z0WmdlVmEyV2F5UEw3czUxc2VXQkNrUTdlbEVjKzIybVB5WUpUUENEbnpmU01UbjJ0cXZwdTVhclZaR2ZVcldMMUdlMHJsY1oxSC9lLzdTaW0rRHdrZGR5T3RwQlVVSytQSnVIZGFkcVhNdEdMR3MybXBkd3RVbzJhT2E3c1RpL0VwV0VmcmtOek11aHZPazZsSWp3SUhXY2w2RVh2QlFSRHExYzNoWHdoWWkzZTAzSWxIME9oVkRKWVFHMzFiVmdnLzRyVUhjd0xraHBXdEsreTdacEgzQlVCL2JCRUFBUkFBQVJEQWY5QmZSYjY0S1lmbFJMQUFBQUFBU1VWT1JLNUNZSUk9XCJcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaWNvblVybDtcclxuICB9XHJcblxyXG4gIGxvY2F0ZXB1c2hwaW4ob2JqKSB7XHJcbiAgICBjb25zdCB0cnVja0lkID0gb2JqLnRydWNrSWQ7XHJcblxyXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgcGlucyBpbiB0aGUgZGF0YSBsYXllciBhbmQgZmluZCB0aGUgcHVzaHBpbiBmb3IgdGhlIGxvY2F0aW9uLiBcclxuICAgIGxldCBzZWFyY2hQaW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YUxheWVyLmdldExlbmd0aCgpOyBpKyspIHtcclxuICAgICAgc2VhcmNoUGluID0gdGhpcy5kYXRhTGF5ZXIuZ2V0KGkpO1xyXG4gICAgICBpZiAoc2VhcmNoUGluLm1ldGFkYXRhLnRydWNrSWQudG9Mb3dlckNhc2UoKSAhPT0gdHJ1Y2tJZC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgc2VhcmNoUGluID0gbnVsbDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGEgcGluIGlzIGZvdW5kIHdpdGggYSBtYXRjaGluZyBJRCwgdGhlbiBjZW50ZXIgdGhlIG1hcCBvbiBpdCBhbmQgc2hvdyBpdCdzIGluZm9ib3guXHJcbiAgICBpZiAoc2VhcmNoUGluKSB7XHJcbiAgICAgIC8vIE9mZnNldCB0aGUgY2VudGVyaW5nIHRvIGFjY291bnQgZm9yIHRoZSBpbmZvYm94LlxyXG4gICAgICB0aGlzLm1hcC5zZXRWaWV3KHsgY2VudGVyOiBzZWFyY2hQaW4uZ2V0TG9jYXRpb24oKSwgem9vbTogMTcgfSk7XHJcbiAgICAgIC8vIHRoaXMuZGlzcGxheUluZm9Cb3goc2VhcmNoUGluLCBvYmopO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihsb2NhdGlvbiwgdXJsLCByb3RhdGlvbkFuZ2xlLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuXHJcbiAgICAgIHZhciByb3RhdGlvbkFuZ2xlUmFkcyA9IHJvdGF0aW9uQW5nbGUgKiBNYXRoLlBJIC8gMTgwO1xyXG4gICAgICBjLndpZHRoID0gNTA7XHJcbiAgICAgIGMuaGVpZ2h0ID0gNTA7XHJcbiAgICAgIC8vIENhbGN1bGF0ZSByb3RhdGVkIGltYWdlIHNpemUuXHJcbiAgICAgIC8vIGMud2lkdGggPSBNYXRoLmFicyhNYXRoLmNlaWwoaW1nLndpZHRoICogTWF0aC5jb3Mocm90YXRpb25BbmdsZVJhZHMpICsgaW1nLmhlaWdodCAqIE1hdGguc2luKHJvdGF0aW9uQW5nbGVSYWRzKSkpO1xyXG4gICAgICAvLyBjLmhlaWdodCA9IE1hdGguYWJzKE1hdGguY2VpbChpbWcud2lkdGggKiBNYXRoLnNpbihyb3RhdGlvbkFuZ2xlUmFkcykgKyBpbWcuaGVpZ2h0ICogTWF0aC5jb3Mocm90YXRpb25BbmdsZVJhZHMpKSk7XHJcblxyXG4gICAgICB2YXIgY29udGV4dCA9IGMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgIC8vIE1vdmUgdG8gdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZShjLndpZHRoIC8gMiwgYy5oZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgIC8vIFJvdGF0ZSB0aGUgY2FudmFzIHRvIHRoZSBzcGVjaWZpZWQgYW5nbGUgaW4gZGVncmVlcy5cclxuICAgICAgY29udGV4dC5yb3RhdGUocm90YXRpb25BbmdsZVJhZHMpO1xyXG5cclxuICAgICAgLy8gRHJhdyB0aGUgaW1hZ2UsIHNpbmNlIHRoZSBjb250ZXh0IGlzIHJvdGF0ZWQsIHRoZSBpbWFnZSB3aWxsIGJlIHJvdGF0ZWQgYWxzby5cclxuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCAtaW1nLndpZHRoIC8gMiwgLWltZy5oZWlnaHQgLyAyKTtcclxuICAgICAgLy8gYW5jaG9yOiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMjQsIDYpXHJcbiAgICAgIGlmICghaXNOYU4ocm90YXRpb25BbmdsZVJhZHMpICYmIHJvdGF0aW9uQW5nbGVSYWRzID4gMCkge1xyXG4gICAgICAgIGxvY2F0aW9uLnNldE9wdGlvbnMoeyBpY29uOiBjLnRvRGF0YVVSTCgpLCBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludChjLndpZHRoIC8gMiwgYy5oZWlnaHQgLyAyKSB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gcmV0dXJuIGM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEFsbG93IGNyb3NzIGRvbWFpbiBpbWFnZSBlZGl0dGluZy5cclxuICAgIGltZy5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xyXG4gICAgaW1nLnNyYyA9IHVybDtcclxuICB9XHJcblxyXG4gIGdldFRocmVzaG9sZFZhbHVlKCkge1xyXG5cclxuICAgIHRoaXMubWFwU2VydmljZS5nZXRSdWxlcyh0aGlzLnRlY2hUeXBlKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICB2YXIgb2JqID0gSlNPTi5wYXJzZSgodGhpcy5zdHJpbmdpZnlCb2R5SnNvbihkYXRhKSkuZGF0YSk7XHJcbiAgICAgICAgICBpZiAob2JqICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIGlkbGVUaW1lID0gb2JqLmZpbHRlcihlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5maWVsZE5hbWUgPT09ICdDdW11bGF0aXZlIGlkbGUgdGltZSBmb3IgUkVEJyAmJiBlbGVtZW50LmRpc3BhdGNoVHlwZSA9PT0gdGhpcy50ZWNoVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZGxlVGltZSAhPSB1bmRlZmluZWQgJiYgaWRsZVRpbWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGhyZXNob2xkVmFsdWUgPSBpZGxlVGltZVswXS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBzdHJpbmdpZnlCb2R5SnNvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhWydfYm9keSddKTtcclxuICB9XHJcblxyXG4gIFVUQ1RvVGltZVpvbmUocmVjb3JkRGF0ZXRpbWUpIHtcclxuICAgIHZhciByZWNvcmRUaW1lO1xyXG4gICAgdmFyIHJlY29yZGRUaW1lID0gbW9tZW50dGltZXpvbmUudXRjKHJlY29yZERhdGV0aW1lKTtcclxuICAgIC8vIHZhciByZWNvcmRkVGltZSA9IG1vbWVudHRpbWV6b25lLnR6KHJlY29yZERhdGV0aW1lLCBcIkFtZXJpY2EvQ2hpY2Fnb1wiKTtcclxuXHJcbiAgICBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnQ1NUJykge1xyXG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ0FtZXJpY2EvQ2hpY2FnbycpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ0VTVCcpIHtcclxuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdBbWVyaWNhL05ld19Zb3JrJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcclxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnUFNUJykge1xyXG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ0FtZXJpY2EvTG9zX0FuZ2VsZXMnKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdBbGFza2EnKSB7XHJcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignVVMvQWxhc2thJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVjb3JkVGltZTtcclxuICB9XHJcbiAgXHJcbiAgYWRkVGlja2V0RGF0YShtYXAsIGRpck1hbmFnZXIpe1xyXG4gICAgLy8vL2xvYWQgY3VycmVudCBsb2NhdGlvblxyXG4gICAgdmFyIG1hcFpvb21MZXZlbDogbnVtYmVyPTEwO1xyXG4gICAgbG9hZEN1cnJlbnRMb2NhdGlvbigpOyAgICBcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuVXBkYXRlVGlja2V0SlNPTkRhdGFMaXN0KCk7XHJcbiAgICB2YXIgaW5pdEluZGV4OiBudW1iZXIgPTE7XHJcbiAgICB0aGlzLnRpY2tldERhdGEuZm9yRWFjaChkYXRhID0+IHtcclxuICAgICAgaWYoZGF0YS5sYXRpdHVkZSAhPSAnJyAmJiAgZGF0YS5sb25naXR1ZGUgIT0gJycpe1xyXG4gICAgICAgIHZhciB0aWNrZXRJbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDZ0FBQUF0Q0FZQUFBRGNNeW5lQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBTk9TVVJCVkZpRnpabFBTQlJSR01CLzM5dE1DQ04zTnkzSUxsR0MvVGxZVU9DZlRZSXdJU2p3Vm5UcFZIVEpnMUVnQ2RWRnExc1JIU0xvbkllNldGR2txN3NWRkVoaG11V3RQNFRNaWlpRnVqT3ZRNk03NnF3Njdyamo3emJ2ZmZOOVB4NnpPKzk5STZ3QTNVQ2hNVTZ0Q0xWYXFCU0xYUWhiZ0NJN1pBTE5ieEdHTlBScGlFZUw2SlZPSnIzV0VpL0JvekVxTFlzTENJMUFzY2RhbzBDSE1ya2JUdExucTJDcWpyM2E1QlpRNzFFcVc5Vk9USnFqQ2ZxWERsMEV2WWYxcVFnM2dDWmduUzl5R2RKYXVCMDF1Q3I5VEhrV05Pb29FNU1uR3ZiN0xEYmY0TDJlNXVUbU4veHduM2FUcTJZUElaNmoyYmFxY2htK0EvWFJIajdQbjFnZ09GSkR1Uks2Z2EzNU1IUHd5d3dSSyszaW0zTndqdUJJTlJ1VjRoMVFrVmUxREVOU3lNSElTOFptQnBSelZpa2VFcHdjUUxtZTVMNXpZSFlGalZvYWdjZDVWM0xCRWs2VXhIa0t0cUErUUVGcUE0UEFqa0ROYkFTK2hVTlVTQmRwQldCczREUnJSQTVBdzA0anpTbXduMEdCODhFcUxVU0Vjd0JpLzYxOENWcklqWkRKVGlYaTAvdDFGYkFVOVVxZ0ttaVJiRmhRcllEZFFZdGtSYWhRUUZuUUhvdFFwc2pzZ3RjY0Fwc1VlTitHNTVHL0N2Z1p0TVVpL0ZRQ3Y0SzJXSVFmeW9LQm9DMnlJVENvZ0JkQmkyUkY4MXpzVGFvQkZBVHRNNDhwTTBSVWxTUVladzJ1b3NDejBpNG1GSUFTMm9NV2NxRWQ3TzFXT0U0Y1NBYXE0MFRURStraEFjNHppZEFNbUVFNU9URFJYSnE1bUJXTXhrbHF6YzFnbkRJSXRFVVR2SFZjWjlBTkZJNU9rRnoxYmtJV0JENkVVMVE1V3lGempwM1N5V1FCSElPRkovdzhNSlFPY1h4K244YTk5VkZIR1NiZDVPa2dwV0ZZVzhSS0VndjNCY3J0aG1nWDN3dENIRUxvWEgwOVhwbFRWTHZKd1ZMdE4xQkdMWmNGV29IMVBvdE5pZEFhanRNbW9MTUZMYXVCYWNUWURyU2dPVXZ1ZlVJTG9TT1U1a3B4a3VHbGdqMjFnRWRxS0Zkd3htNEJlKzNoREtEcE1CV1BTdU44WGU1Tm5nU2RwR0xzMDVwdUlMeEU2S2dJaHlOeFBxMmtqdXVQWkRuWUJhOHZJL1RhU3VVZ0IwR0F5Qi91QUVQWjVqVU1SNHE0bDB1Tm5BVGxBOVBXLzNlNGUzSk4wMHEramN5cGtjdk5NeGcxdkVBNE9pZXg1bldrbHlPNTVzNXBCV2ZSTkFGcHg0aUpjTkdQMUw0STJoOWtIczRPQ0E4aVBYejBJN2MvS3doTW03UUFZOEM0cVdqMUsrOC9ka2psZmZlMDE2OEFBQUFBU1VWT1JLNUNZSUk9XCJcclxuICAgICAgICBpZihkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkgPT09IFwidW5rbm93blwiIHx8IGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJ3YXJuaW5nXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcIm1pbm9yXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGlja2V0SW1hZ2UgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ3dBQUFBekNBWUFBQURzQk9wUEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBT3hBQUFEc1FCbFNzT0d3QUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQVB5U1VSQlZHaUI3WmhQaUJ0MUZNZS83eVhUMWQzRlFoR0tlS25vS3Rqc1dtbHZ4UmFoOXFMVlM2ZEpab091QncrV1FpLzF0SWNXdk9pV3NsUzl1QWVKYXlhL2JJTUhLWXFvaHhRVVFZaGFOcFd5V0ZCV29pMzBvQ2gxTjVQZjg3RGJrSjFNSnBPZFpCS3duMXZlNy8xKzc1Tmg1dmVQc0ExTTA5eGhHTVpCQUljQVBBM2dDUUM3QVl4dnB2eE5SSCtJeUFxQUg1ajV5dWpvNkRjTEN3dTE3ZFJyaHJwSlRxZlRlNG5vRklBVEFIWjFXZXMyZ0V0RTlKNXQyejkxMmJkQklPRmtNdmw0TEJhYkEvQmkwRDQrQ0lCUG1QbU5YQzczYzdlZGZZdWJwaG1MeCtPelJEUUxZTWQyRGR1d0ppSnZPbzd6VnJGWXJBZnQxRlk0blU0L1NFUWZZK005N1JzaVVqSU00L2ppNHVMdElQbWV3cWxVYWc4emZ3RmdvcWQyN1ZrQmNEU2Z6Ly9hS2JGRk9KMU83eWFpSzlqNDhxUGtCak0vazh2bGZ2ZEw0dVlmTXpNejl4SFJwNGhlRmdBZTFWcC9acHJtL1g1Slc0VFgxOWZuQWV6dnE1WS8rd3pEbVBOTGFMd1NsbVVkQWxCQytHa3JMRnBFRGl1bHZ2WnF2UHVFQ2NCRkRGNFdBSmlJNXRIR2hRRWdrOGtjQTdBdlNxc09ISmllbm43ZXE0RUJRR3Q5TWxxZnpvakk2MTV4eW1ReUQybXRWd0hFSW5icVJGMUVIbFpLM1d3T3NvZ2N4ZkRKQWh0T3o3bURyTFh1NjlJYkJpSTY3STR4TSs4ZGhFd1FpT2hKZDR4RlpNOEFYQUloSW8rNFl3eGc1d0JjZ3RMaXhsNVpRMFNMSHdPNDZaRTRMRlRkQWZZS0RoR2V3aDAzelFPa3hZMDNOK3REaVlpVTNER3UxK3VmRDhBbEVDTHlsVHZHaFVMaEZ3RFhvOWZweUxWTnR5MHdBSWpJdTVIcmRPWWRyeUFEd01qSXlBY1lydW50VnExVys4aXJnUUVnbTgzK0MyQStVaVYvemhlTHhUdGVEWTJWcEZxdFhnRHdYV1JLN2ZsK2ZIejhZcnZHaG5DcFZISkU1QlVBbnY4c0l0WkU1R1cvVzg0dGE3VlM2anFBMXdEb2ZwdDVvRVhrVmFYVU5iK2tscFBHOHZMeWNpS1JXQ1dpWHR4VUJrVkU1S1JTS3RzcDBmTm9WS2xVZnB5Y25Md0ZJSXJqMDdxSW5GSkt2UjhrMmZjSnBsS3BBOHg4Q1VETFJycEgvQ1lpSjVSUzN3YnQ0UHYwS3BWS05aRkkyRVQwQUlDbk91VjNRUTNBUWp3ZVQ5cTJ2ZEpOeDhEdmFDYVRlVXhyZlE3QWNRQWozZmsxV0NPaW91TTQ1NWFXbG01c1o0Q3VQeXJUTkhjYWh2RUNnQ1NBWXdHN1hRYXdSRVNYYmR2K3E5dWF6WVNhQlN6TCtoTEFFYjhjRVNrcHBaNE5VNmVaVUdjNlpqNEQvemxiRTlHWk1EVmFhb2Jwbk12bHJnSlk5RW41TUovUGw4UFVjQlA2MUt5MW5nWHdqMGZUSGEzMTJiRGp1d2t0WENnVXFrUjB3YU5wcmxBb3JJWWQzMDFQN2lYR3hzYmVCdEFzVjQzRll1ZDdNYmFibml3RTVYSzVOalUxOVNlQWx3QkFSRTdidHQyWHJXclBibjRtSmlheUFNb2ljdFZ4SEw4UGNYaXdMT3VJWlZtKzgvSTk3dkYvNXovZDBqb0VQemhaR2dBQUFBQkpSVTVFcmtKZ2dnPT1cIlxyXG4gICAgICAgIH1lbHNlIGlmKGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJtYWpvclwiKXtcclxuICAgICAgICAgIHRpY2tldEltYWdlID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUN3QUFBQXpDQVlBQUFEc0JPcFBBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFPeVNVUkJWR2lCN1poTmFCeGxHSUNmZDJaTmFsc29pRkJVaExiWlRmcHpNTkxnUVRGRnFMMW9QWlY0VVp2ZHBKVFdIdXNwZ2dFdm1sSkNWZENnNXNjaVlzU0Q5Q0xxSVlHS0lMYmFRMnE3M2EyR2x0Z0tCUlZObXV6T3ZCNFMwODNzek96TXp1N3NnbjF1ODM3djkzMFBIN3Zmenl0VXcrUk1Dd3V0VDJCck4vQW8wQUZzQmphdVpQeU5jZ01oQy93SVRMUDA1N2NjN2lwVU5WOEpFaXA3L01vdVZJNkI5Z0QzaFp6ckZzSWtOdStRU1YwTTJYZVZZTUlUK1hac2V3aDRMbkFmYnhUNEFrdGVvVCtaQzl2WmYvSkpOWm5QRGFBTUFDMVZDbnF4aU1qcnJHOTdneDZ4Z25ieUZoNjVmRDh0eHVkQWR5M3NmSmpDS0I3ZzRJNWJRWkxkaGNkKzNnS0pyNEJVRGNYOHlHS1orK2pmTmxzcHNWejQvYXViU2RqVG9CMTFVZk1tVDZMd0pDL3UvTTB2YWEzdzJDL3JvSGdXMkYxUE14OStZc082eCtsNWVNRXJ3Vmo3YVEzVE9GbUFUdVp2RC9rbDNGbmg4V3czS2xORTM3YWlZbU1iZStock8rdld1THpDcW9MS0tSb3ZDMkJnMnNPb3Vyb3NDMC9rOWdPZGNWcjVvblF4ZHVVWnQ2YVZGZVpvckVKQkVJNjRoMDlmZklEaVBkY0FNMmFsU2xnVXpZYzR0TzFtYWRDZzBMS1A1cE1GTURHdHA1MUJBOUY2SDczVlk3Q25QQVM3R3FBU0RHV25NMlFBVytJM0NZcHNkVVlNWUZNRFRBS2laVzZHVzFvVFVlWm5BRGRkRXB1Rk9XZkFRTXVEVFlPb2k3Qm94VXR6dzFBcGN6T0E2UWFvQkVPWmNvWU1zTDVzZ0Vvd3BQaU5NMlNRM3ZFcmNDbCttNHJNckxpdDRiOXQ0KzE0WFFJZzhwWmJlRVU0TVVwemJXKy9zNzcxdEZ2RHNuQjY2MjFnT0U0algxUk9lRDFFNzV3a3M5ZFBBdC9INWVURGVRcC9uUEpxZER6ekwyOEg0enh3YjcydFBGaEUyRTF2YXNZclllMVpuZTY0aEhBSXNPdHQ1b0tOYXRwUEZ0d3VQNzJwajFIdFo3bktHQmVLNmxFeTdaOVVTblMvcldYYXgxQmVCaUlYb0FPd2hPb1JNdTBqUVpMOTZ4QWY1cnN3N0VtZzdDSmRFNFRyQ0QwY1RIMFh0SXYvZmJpdjdRZVc3TWRBM3FPMnExMUFlQmNwZG9hUmhUQ1ZuZzl5U1V3ZEJBNEFyZUg4VmxsRStBd1lwRGVWcjJhQThLV3BrZndtV3UxblVaNEg5Z2ZzZFFiaFV4S2M0WVhVWDZIbkxDRmFMVzA4OXpXcWV5dGtUWkZPUFJWcG5oS2l2ZWtzNnpqK2U3YU55UEZJY3ppSUp0elhjUUhrSTg5MllZTGU1TGxJY3ppSS9tcTJpd1BBUHk0dEM5anlXdVR4SFVRWDd0cytoM0xTcFdXSVRQSmE1UEVkMUtZdVVkandKbEFxTjRjNWY2SW1ZenVvamZEaEIrZUJ3ZFZ2MVZkNTZSRzNuMGxrYWxmNW1VMk9BK2VBQzJ4TWVmOFJtNHJSN0Y1R3M1WDI1YnZjNVgvTnYxb1k5cWRiRmtsMEFBQUFBRWxGVGtTdVFtQ0NcIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHB1c2hwaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZGF0YS5sYXRpdHVkZSwgZGF0YS5sb25naXR1ZGUpLCB7IGljb246IHRpY2tldEltYWdlLCB0ZXh0OiBpbml0SW5kZXgudG9TdHJpbmcoKSB9KTtcclxuICAgICAgICBwdXNocGluLm1ldGFkYXRhID0gZGF0YTtcclxuICAgICAgICBtYXAuZW50aXRpZXMucHVzaChwdXNocGluKTtcclxuICAgICAgICB0aGlzLmRhdGFMYXllci5wdXNoKHB1c2hwaW4pO1xyXG4gICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHB1c2hwaW4sICdjbGljaycsIHB1c2hwaW5DbGlja2VkKTtcclxuICAgICAgICBcclxuICAgICAgICBtYXAuc2V0Vmlldyh7IG1hcFR5cGVJZDogTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLnJvYWQsIGNlbnRlcjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGRhdGEubGF0aXR1ZGUsIGRhdGEubG9uZ2l0dWRlKX0pO1xyXG4gICAgICAgIGluaXRJbmRleCA9IGluaXRJbmRleCArIDE7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgbWFwWm9vbUxldmVsID0gbWFwLmdldFpvb20oKTtcclxuICAgIFxyXG4gICAgLy8gY29uc3QgaW5mb2JveCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5JbmZvYm94KG1hcC5nZXRDZW50ZXIoKSwge1xyXG4gICAgLy8gICB2aXNpYmxlOiBmYWxzZSwgYXV0b0FsaWdubWVudDogdHJ1ZVxyXG4gICAgLy8gfSk7ICAgIFxyXG4gICAgZnVuY3Rpb24gcHVzaHBpbkNsaWNrZWQoZSkge1xyXG4gICAgICBpZiAoZS50YXJnZXQubWV0YWRhdGEpIHtcclxuICAgICAgICB2YXIgbGw9ZS50YXJnZXQuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICBsb2FkVGlja2V0RGlyZWN0aW9ucyh0aGlzLCBlLnRhcmdldC5tZXRhZGF0YSwgbGwubGF0aXR1ZGUsIGxsLmxvbmdpdHVkZSk7XHJcbiAgICAgICAgLy8vL2luZm9ib3guc2V0TWFwKG1hcCk7ICBcclxuICAgICAgICAvLyBpbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAgIC8vICAgbG9jYXRpb246IGUudGFyZ2V0LmdldExvY2F0aW9uKCksXHJcbiAgICAgICAgLy8gICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgIC8vICAgb2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMCwgNDApLFxyXG4gICAgICAgIC8vICAgaHRtbENvbnRlbnQ6JzxkaXYgc3R5bGU9XCJtYXJnaW46YXV0byAhaW1wb3J0YW50O3dpZHRoOjU1MHB4ICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjogd2hpdGU7Ym9yZGVyOiAxcHggc29saWQgbGlnaHRncmF5O1wiPidcclxuICAgICAgICAvLyAgICsgZ2V0VGlja2V0SW5mb0JveEhUTUwoZS50YXJnZXQubWV0YWRhdGEpICsgJzwvZGl2PidcclxuICAgICAgICAvLyB9KTtcclxuICAgICAgfVxyXG4gICAgICAkKCcuTmF2QmFyX0NvbnRhaW5lci5MaWdodCcpLmF0dHIoJ3N0eWxlJywnYm90dG9tOjMwcHg7dG9wOnVuc2V0ICFpbXBvcnRhbnQ7Jyk7XHJcbiAgICAgIHBpbkNsaWNrZWQoZS50YXJnZXQubWV0YWRhdGEsIDApXHJcbiAgICAgIC8vLy9NaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihpbmZvYm94LCAnY2xpY2snLCBjbG9zZSk7XHJcbiAgfVxyXG4gIHZhciBjdXJyZW50TGF0aXR1ZGU9NDAuMzEyODtcclxuICB2YXIgY3VycmVudExvbmdpdHVkZT0tNzUuMzkwMjtcclxuICB2YXIgZGlzdGFuY2VEYXRhID0gXCJcIjtcclxuICBmdW5jdGlvbiBsb2FkQ3VycmVudExvY2F0aW9uKClcclxuICAgICAge1xyXG4gICAgICAgIGlmKG5hdmlnYXRvci5nZW9sb2NhdGlvbil7XHJcbiAgICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIHZhciBsb2MgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG4gIFxyXG4gICAgICAgICAgICAgICAgLy9BZGQgYSBwdXNocGluIGF0IHRoZSB1c2VyJ3MgbG9jYXRpb24uXHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgcGluID0gbmV3IE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4obG9jKTtcclxuICAgICAgICAgICAgICAgIC8vIG1hcC5lbnRpdGllcy5wdXNoKHBpbik7XHJcbiAgICAgICAgICAgICAgICAvLyAvLyBDZW50ZXIgdGhlIG1hcCBvbiB0aGUgdXNlcidzIGxvY2F0aW9uLlxyXG4gICAgICAgICAgICAgICAgLy8gLy8gbWFwcy5zZXRWaWV3KHsgY2VudGVyOiBsb2MsIHpvb206IDE1IH0pO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudExhdGl0dWRlID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudExvbmdpdHVkZSA9IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjdXJyZW50TGF0aXR1ZGUpO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY3VycmVudExvbmdpdHVkZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBpbkNsaWNrZWQocGFybXM6IGFueSwgbGF1Y2hUaWNrZXRDYXJkOiBudW1iZXIpe1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCdlbWl0Jyx0aGF0KTtcclxuICAgICAgdmFyIHNlbGVjdGVkVGlja2V0ID0ge1wiU2VsZWN0ZWRUaWNrZXRcIjoge1xyXG4gICAgICAgICAgXCJUaWNrZXROdW1iZXJcIjogcGFybXMudGlja2V0TnVtYmVyLFxyXG4gICAgICAgICAgXCJMYXVuY2hUaWNrZXRDYXJkXCI6IGxhdWNoVGlja2V0Q2FyZFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZygnU2VsZWN0ZWQgVGlja2V0OiAnICsgc2VsZWN0ZWRUaWNrZXQgKydsYXVuY2hUaWNrZXQ6ICcrIGxhdWNoVGlja2V0Q2FyZCk7XHJcbiAgICB0aGF0LnRpY2tldENsaWNrLmVtaXQoc2VsZWN0ZWRUaWNrZXQpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBjbG9zZShlKSB7XHJcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdmYSBmYS10aW1lcycpIHtcclxuICAgICAgJCgnLk5hdkJhcl9Db250YWluZXIuTGlnaHQnKS5hdHRyKCdzdHlsZScsJ3RvcDowcHgnKTtcclxuICAgICAgLy8gaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgLy8gICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgICAvLyB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gbG9hZFRpY2tldERpcmVjdGlvbnModGhhdCwgaW5mb0JveE1ldGFEYXRhOiBhbnksZW5kTGF0LCBlbmRMb25nKSB7XHJcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zJywgKCkgPT4ge1xyXG4gICAgICBkaXJNYW5hZ2VyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuRGlyZWN0aW9uc01hbmFnZXIobWFwKTtcclxuICAgICAgZGlyTWFuYWdlci5jbGVhckFsbCgpO1xyXG4gICAgICBtYXAubGF5ZXJzLmNsZWFyKCk7XHJcbiAgICAgIC8vdmFyIGxvY2MgPSBtYXBzLmdldENlbnRlcigpO1xyXG4gICAgICB2YXIgbG9jYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihjdXJyZW50TGF0aXR1ZGUsIGN1cnJlbnRMb25naXR1ZGUpO1xyXG4gICAgICAvLyBTZXQgUm91dGUgTW9kZSB0byBkcml2aW5nXHJcbiAgICAgIGRpck1hbmFnZXIuc2V0UmVxdWVzdE9wdGlvbnMoe1xyXG4gICAgICAgIHJvdXRlTW9kZTogTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5Sb3V0ZU1vZGUuZHJpdmluZyxcclxuICAgICAgICByb3V0ZURyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICB9KTtcclxuICBcclxuICAgICAgZGlyTWFuYWdlci5zZXRSZW5kZXJPcHRpb25zKHtcclxuICAgICAgICBkcml2aW5nUG9seWxpbmVPcHRpb25zOiB7XHJcbiAgICAgICAgICBzdHJva2VDb2xvcjogTWljcm9zb2Z0Lk1hcHMuQ29sb3IuZnJvbUhleCgnIzAwOWZkYicpLFxyXG4gICAgICAgICAgc3Ryb2tlVGhpY2tuZXNzOiA1XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaXJzdFdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogdHJ1ZSwgdGV4dDogJycsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUQwQUFBQTlDQVlBQUFBZVltSHBBQUFBQm1KTFIwUUEvd0QvQVArZ3ZhZVRBQUFBQ1hCSVdYTUFBQUJJQUFBQVNBQkd5V3MrQUFBWTFrbEVRVlJvM3FXYmFheGwyWFhYZjJ2dGM4NGQzdnhlRFQxUDduYmI3bTdiM2M1azRoZ0xNQi95SWJFaUVFSUpFaUFIZ1JBU2dnQkJJUjlRNUVnZ2hJUVZSOUFKaWJDSUVRcUtGREdJS1NHT29SUFNkbHZkZEx1ckozZjFVRlZkVmErcTNuU25jODVlaXc5N24zdnZxOEZkRFVlNjlXNjlkKzg1ZSswMS85ZC9pN3R6dTVjWnFLYjNidUFLT0JpR3UyQU9CcGhEZE1jOC9UNGk0STQ3SUxlNHVZTUlJRUxBRVhGVWxDQ0NDaWlnUXZvOUNnSmlJSHJqMnQ3dmt0c1IyajJ2VmNETWNGWGNESFBCM0RBVWMyZ3M0aWlORzYwNXJVTTBUNXZoNElDWnU2aUlPUTZPaW9pYnU2cUlaTUZVb0ZBaDVKK2xLSUpSYWtBRkFvYUlvdUtJS21LR1pvbTkyN3ovSDZFZHdNQWx2WGV6dEhoM29pdlJqY2FkeHFCMXA0N1FBdFBXdkRFbk9yU2QwT1lZam9nc05PN2c3aWlDYU5KcWtWK2xDcjFDcFFDcUFLVUloVUlsa3EzQVVCR1NnU2hCazhaRmIyMVFBTVg3Q2V4NTkwM1NvaU1rUWN4cFBWSWJ6RnFuTm1kcTdyTUlVelBxNkxRR2pUa3pnem9hclVHVXREQnpBMEJGVUJXQ2t3UUtTaytoREVJcDBBdm1sU3FEQUpXSzlBcWhDbEJKbkc5TTByNWpwUGZXYWZTREN0MEpUUGJQNkVtN3JTVnQxZ2ExT1pQV21VVDNTV3RNczhCVGcvMjY1YWlCVWVQc05aSEQyaGpGOUpuV0hmUDBCSkZrdm4yRmxWSllxd0tiUlVqdlMyR2pDdlRWNkt2U0svQmhWQVpCcEIrRW5ncFJuVEtrK0ZKWVdyTWd1TnhhOE9KV0FuY080Z2dHdERHWmNXMHdhWjJaT2FQV2ZOdzRvOWFZbW5OVU81ZW1MVmRxNC93NGNtWFdzaitER1pZZTN1MmtMRDlGd09PeDFaV3FiSlJ3c2w5dzEwcGdwMUpPOUFyV0sySFVHaXNoK0xDRVFhRXlWS0dQVUxyakdpZzBCVDNKem4yejJIbURUL3RjM3FRTlE0bnUxRm13U1hSR2pmdFJheHpXeHNTYy9TWnlidFJ5YmhSNWQ5eHdlV3FZSk10d0U2SWJTSXJ1MHNtZW55dlpKenMzRW5kVU5VZHZJUmljSENwM0R3dnVXUzI0YzFDd1ZRWUdLcXhXeW1xcHJCUWlneUQwZzJhM0VJVHM3em1xeWEyRXZsN2c2QkJkbUVWbkdvMVI2NHlpKzBGdEhOU1JvOVo0ZDlUeTNhT0dkNDVhZHV1NEVGU1M3N3VsZTdrSXVPRGNQSEFLQXVKSmFFbEJMUWdFQjFFbmlMRFRDOXk3VXZDaDFaSjdWZ3BXUzJXOURLeVZ5bW9oTWl5RVFWQ3FJQVJ4Z25CVHdZc2JCS2JMdFVMcktRQ05XK2VvTlE0Yjg0UEdPR2ljSzdPR1YvWmFYajlxdURpT1JFaUJLdnQrbDZ2SnVkdmRFZUY3Q0wzNGpKTEMvVHhIZTRybWx5YkcxV25OeFVua1E3T1NSOWRLbWo3VVpyU21IbDNGSFZ5RW51bzh6U29MQzVOT2FPL3NQeS9Xa0JTd2NxQTZhbzM5Mm55dmpodzJ6anZqeUl2WFpwdzlhamxxblJpTk5uL0hSTEJvODd6c25aaSt2TFZ5ay9jKy81VUE0a0xFazlCQmFjMHBGS0k0NThiT1htMWNuVVVlMyt4eDc3Qkk5VUI2bktDYUVyWUtoYVRDS0JVMlNjWmpnY3c5aGYwMnBrQTFqc1pSWXh5MDd0ZnE1TU92SFRZOGY3WG0zTGlsTm1nc0ZTS1JWSWk0ZTBwdnZyQWRSNDdMZWF1NEtvdk42VDVxSW1oclNFNUZNYWNtYTV3emV3MUhqVk52OTNsb3JjREZ3TVZkVENpQlhMa1ZtbUpGWithRjUyQmlwRnhzQm8ybm9EVnFuYjBtK3Q0c3BaMVg5bXUrZlhYR3BVbGs1azVyUWpTbjdVcFFBOGVBSERXRkpERGZJMzljL3dkWm1HSEthazUwUjF5VDYwa0tGbEhUQnJ3emFxbmpsTnBMSGxtclVpR0Z1SXFJaWhGRWM0eEk5MVFSQ29GY0ppWnROUWJUQ09QR09XeWlIemJPUVJONS9hRGh1YXMxbHllUm1VTWRuV2lMSE82ZGlYWlJPcWVMMjYvc2I3SUpPUU9vQ081R2RNRmNjSEdDYTRvQk9POU5XcDdkTlFUaHcyc1FORkJvOUVBUVdhb0F1elJXdUNVcmlER1pUVzJXSTdYTm8vUjNqMXErZFhYR3BVbEw0OG1rb3d2UmpOWWxHeHlZTElLSEgxLytQQnUwMW0zUzR1OUJJR2pTZ0dZVG5HOVd0M2tpcUZzcVkxMFgzVWJ1TkM1Tkl0L2FuVklKaEpBaWZ5bmloWW9VYXFnb2lxT0ZVSmgyQ2xMYWFFeWpNMjdkRDVzVXBDNk1JeTlkblhGaDFOS1lVK00wSm5oTURZZlQrWnN1RnJ2a2w3WEJKQm9sOExHdEhrOXNWZHc5TE5qb0JkeU12Y1k1UDI1NTZWckRTL3MxalVVR1FTbTcramtMVGQ1VXhWTGVkOFZqMHBoanVBam5KOGJ6MTJxR3BSSldDaXAxU2hWS1ZRcHh5cUI0TG5lcGM0YzBhMkVXblhFVE9XcUZhM1hrT3djMXJ4MUZvanNOUW95cDB6S1gxRktLSG8vRDJkVGJYQUQvNE1rZWYrNmhOVDV6cWkrVDF2aldsZHJmT0t3NWU5Z0FzRmtKbnowOTRHOStiRU1HUWZqR2UxUC9OMmVQZUhaM2x0S0w1cWlRaGJjY25LSWI2a2xSdU5Lb0lPSjg5N0JscTFlelZpcjlVTkNQN3Ixb1VpQ29Sdm9lS016Si9nSXpZTkxpUjFFNGFscmVQR3c1czlkZ2JxbUx5cEY2V2VCamdkZFRPMWtJZlBya2dMLyswVFYyZXNxL2ZPMlFuM2wyMTkrNVZqT1BhMTMvNTR2Y2R1OVd4Wis5ZjVVdlBiWEY3c1Q1OGl0N2ZQUHlESVBjWXkrMDdxS3BhWEdsdFJROGd3aHRnQmYzYWs3MkFzT2c5RlhwRitvOVJTcFBqWTdVMFpsYVpOSTRodzFjbWJWK2RScDU0NmpobVVzVDNqaUsxTkZvb3RONENsNG1UbW9HajZlN3htR3JFdjdXWTlzOHVWM3lqMS9hNDJ1dkhnSWtYOHE1OG1aWHQySFdwbHIxSng5ZTQrOS9mSk0vMnEzNXB5L3VzZC9ZRGQ5UFVkNVFGNEttanF0SzdTZ1ByUlo4NWxTZkIxWkxkdnFCbmFxUXRSNE1nNkpPRXFReG1KcjVKRHI3VFNvdjN4cTFXTGFDU0FjRTNGakNlKzZuSDkybytPYy9kSnJvenFmLzB6bSs5dW9oWlNuMEtxWFVSVGw0czZndUlxbC9ycFN5RUg3anRVTSs5Ui9PSWU1ODVZZE84T0gxa3NiSTNkbnhTTzkwRmFBa3hiaHg5cWpoM2JGeDBGanFCTTI4aWFsaTFHU3lrcnFtYUl4Ylk3YzJYajlzbHdBQXlhVmxxcUU5VmNwemdXY1JQclhUNHg5OTN3Ny83cTBqdnZoN0Y2bWowNnYwV0RUdUdnMHhSNkxoMFhETHlXNHA0cXNrNGR2by9LV3ZYK1RmdnozbUY1N2M1cW1kSG8wdE5TdWtPc0JGNXFXdnU5TGtjdmlWL1JsWGFtTWNqWEYwcGpFcHA0Z3V0R1pNby91MGRZNWl5bnZ2VGR1MGUrWXBQWGxuVWtzQ0E5UG9mR3lqNHU4K3NjblRaL1o0K2p0N2xMMHdGemJEWTBnZG9ZblFHQkp6SlpNa2hGN1JJUWg0U05LbklDWm9wZnlURjY5eTBCcC8rN0VOdnZUQ0hpL3UxZlRVbHpvMFNmck9hVEdZWXlxOE40MjhOMm80MVF1c0ZFWWRrcXhGNndrTW1GbnFwQTVta2JjT0dzeWdaUUVlZU5jcExWM1JuSjFlNE84OHNjbHZ2enZoNlRNSGxGVTRubXZyaUl3YVpGUW53VzBCWXMzdjVqTzhVRmdwWVZqQk1NdzNWMFVvQ3VYcFYvZlpxSlMvOGRFTmZ1N2JWN2syaTVSTHkwbDl2eU81VVNyY2lTYThlZFR5NEpxeFhpa3pjMi9NUldQR3RlcVl6SFMvTnM1UDJsUnBtY3lydGVPbFJqS3gycDB2Zm5pRGMrUElMMzFuanlJcythMlFoTDA4UnE5T2tGbE1Yd3k2UVAvbUx4QXpaSCtLWEI0aGU5TVVSRHB6UnloVWVQcVZBODVQV3Y3aXcrdkVySWlsb0lBdmQzaVdUUDdDeE5odkl0UG96TEo1YThLNjBpL0dyWE5wRmhsSGlFajJFY21kMG5FVW9qRjRZclBpeVoyU0w3Kzh4elJhNm1RNmdZOXE1TW9ZbmJiSnhEVzV5S1F4SnJQSVpOcW1WeDJUbitZTkVUUGsyaFM5T2w0Q0dsSjdlTlFhdi9ycUFZOXZsankrbWZ4NzRkdGRSK2NKZHZZa3c3ZzFMazRqMHpiSjJMcFQ1QmJTYS9QMGdYR2NSOE41ZTloMUQ4dkJ5NXcvLzhBYS8rMzhtRmYyNjBYckppRFRCdGtkSjkvVjFNNU5HNk5YQ0gveW9YV2V2SFBJenJCZzFocXZYNW54dTJjUE9IL1FVSVZVanVLT0hNMFFCVDh4UkhJdEwrNmMyYS81L1lzVC9zd0RLL3o4dDJlVXZraGpxWXRNYStnczFJRUxZK01qNjhZc0tyVzVGK2FwK1c4TlpnYTdzeGEzaFpsMHByMnM1ZWp3NEZyQnd4c2xYejZ6UjIycElPbEFPUzZONWdLYk8yMTBucnByeU05OTlpNmV1bk1vSjFkS2hxWFFHbHlidEp6ZHIvMWZmZnN5di9iY0ZacG9sQ0gxdzdJL2cyR0ZEd3NrM1k1UjYvejM4MlArNFpNN1BMUlc4dTZvWGZMdHBQTzV3aktnY0dtUzJ1Q1laUzFjRWpyWmVHVFdSdllieDhXSnNmdFM1enNMVFRmbS9PQ0pQbWYyYXM2UDIwV1pLTUQrRktsVEUrRHVtTUduNzF2bHF6L3hvRHk0MVQ4V0NNc0FwMVpMVHEyVzh2SFRBKzVkci93WHYzR0JhZU1wUHJqamwwZnd3R2JhaEF3SXZEdU92SGJROEttZEhtY1BHMHFWdWRDcERrOGFqNVoyNnJBeFp0RlM3KythZk5weTkzUFlwUFRrdVJWTDRQNk5GVlJqOE1tdGloZjJhc1p0MGtDS09JcnVUUkZORzlCRTU0N1ZrbC83d2dNM0NIejkxUytVbi8zc1hmS0ZqMndSUXJJUUpLVTZtYlp6U0RjSUhOVEdxL3MxajIyVWM3OWV2dHdXblZtVWhBUWQxRFlmT21pcVlWTWhQNHFXWUY4VGZBazR2cjdjTEJUdVhTMTU0N0JsR24zeDkxa0RkWngvcmw4cVAvWEpiUjdaR1hDNzF5OSsvaDVacTVSb3lVbEZCZlpueDlMY0tEcG5SNUc3VndyNmhkNVlwYzBMQ2NFVFFNZFI5RHlaQVhXelBHOUt0ZlVOVGY5MWlqYUhFNE5BY0xnd2JtazdueGVRSEtrN0lHRzFWSDd5NHlkdVcyQ0FlOVlyUG5ISElBZWxwRzJ0bTJQcmlHYnNUbHR3NFVRdnBhcWJyYm1yMnh5bjhZd09tYU9Jb0pvbWltMlVEUEhjR3ZGd1lDVUkwMXpqZHY0TUlNMnlSVUFabE1kT0RkNW5uSGJqOVgxM3JjMERJNUNhOGs2ZS9LeldvQUVHaGR4eXJjdmZhZHVZU3VBOERQakFrSTZLcGxIdDhUdUR4YmtaT2hEMC93MHNXdTB0cWV1bUMweTljNXFIM2Q2ZXhxV2JhT2ZEa29kZ1haeSsxYTBFR0RXUlhpRVVHVURvQUR5dkFpdzFBNjBKUjdYeFFhK3oxNXBVVXViLzI5TGMyVE1xVStTdWJOYTgvLzNkb1FvaHV3eW9xQkpVVUlReXlCempPdFpWTEFzdGNLMU8xZGRXRlZESmd6aEk5WFArdkFxTUcrTy92cjcvZ2RYOXY5NCtUSUVzUDErcVlubkFob3F3VmlrRndyWEdGOWxqOFpINVdwRzB0bEpTT1p1bXBKNEVDR0tzaENTdFNDbzZ1em5iOHFwRmhFbHJ2RGR1ZVdpOW9LKzZ3TVVHNVJ3elVvRlJIZm4xNXk1L0lJRi84NldyZnY2d21WZDR1T09yMWR5Q0hCZ0U1ZjZWa3N2VHlHRnJOMXBsUnlMSXd3SWt4U0hwU3YzUXpYZEZXQzJWNEk0NlNMWnprZU9LNmxxK0YvWnFIdHVvR0JRcFVnTVFCRnNwTTlDWUFzei9mUHVJci96dlM3ZWw3VGV1VHZuUzF5OHdibUphYk5lL3I1WjB5ekNIOVZKNGVMWGt6SDU5VXpSR1pERXBWRS9RNFhvbGhMVEVSTk1vUkNnU2xzUmFwYW5rVSthUldVU09xYnRVNGRuZEdSL2ZxampaRHd0d0lEcStNMGlSd2RNczZyQ08vTUxYei9ITHoxNzBLK1AycHNLYU8zL3d6cEgvOUcrZjllOWNuaXlHYnViNFdpK1ZiblFUR0RnOURIeGtzK1NiVitxbGFveDUxZGIxMlVGVFdieFNoVFRSbERUbUtVSitVMm9hZFc3MUE5ZnFpTnFDNEdMdXh3ZGdBaS92MWV3MXh1ZE9EM2p6cUoxL2hsNkpiL1NSWEptVnF1eU9XLzdlZjNtWFAzaHI1SC9xNFhVZTJ1cXgzZ3MwMGJsdzFQRE5jeVArN1l0WGVmM0tsQ0lrdjhNY0x3TnNEK2dRakdUYXdoODcyZWV3TWM3czE1VEh5RFVPSkxSRzgvQlBCSFo2Z1Y0ZTQ0Wk82REpBRllSQkVFNzFsVGNQTzRGdHlUK1dBSHBKU01Wdm5oM3h4VWZXK00vbko3d3phbEx6YWNEV0VHOHNBUWRaOERvNi8vcjVYWDdyNVdzOHROMWpveDlvV3VlZGc1b0wyWWVyc0tSaEZmemtFQzhFeWJ5VTZQRGdTc0dQM3IzQ1Y3OTdtTGdxUzRoc0Vqa0JDWnJaU1FpYzZpbjlrRURETWlDcWliY2hsUWo5QUtkNmdVcEl6SjNzMDhrL2o3dGxGWVJuTGsyNE9JMzg5S1ByZVlDZlhTbTNoTFpXZ2FjTkNpcjB5elI5ZlBueWhHZmVQdUtiNTBmc2psdjZSVUl3QlNBYVhpbCthZ1VmSHZmbFF1RXZmR2lOSzdQSUgxNmVVb1hqdVh4dTJySVkrWllxM0RVSTlCSm5KVUZRaFNibkxrT3Fialo3Z1ZPRGtLR2FGT0E2elM0UEhqVWpGVjk1ZVovUG5lN3pFdytzMGtiUDg2V1V2bnhuaU8zMG9WU0lobmg2VmhWUy9PZ1ZtZ0lSTEV4NHJZZWZXTUZYbGdWTzhQQ1AzN1BLajV3YThQU3JLYVV0dzFLeWJJVWk4NEIxdWgvWTdBVUdSWnFhRkFJYUpCRldlaXIwZ3JCUkt2ZXRWdGwzMHczVU84VHF1TFpMaGJlT0duN3A1WDMrd1NlMitmVHBBWFZqaXdJbktMN2V3MDZ0WUR0RFBBZTlOTDNQVGJ6bkRkcnNZWGVzcFVEWUwrWUN1enRONi96STZRRS84L2dtdi9MYUFXOGVOVlEzRU9YU1ptc09vRUVGUVhod3RXSzFWSHFxOUVJZThTU0NtbEtwU1QrSXJ4VEtuUU5scHgvWW5VWUtkMXdWOHpodkFMb3RFRW4wcG05Y25MSitacDlmLytGVDhwZWZ1ZVRQdkR1bTZ1bDgxNzBxa2ltdFZjbGZZOWZqU1ZKOVRxQ3V4d0ZEZDZlZUdaKzdiNFYvOXYwbitPVXorL3orZXhNcTVSaUdMaG5NVWxHQ2FxSmVxTEJkS1hjTWxaVkN5R3drU1psS2hDQXhVWmFDTVN6Z3hLRGc0YldTSzFPakVDZG0wc3FDUnJIQXkxU0VRcDMvK002WWNZdC83VE9uNUV2LzU1ci95a3Y3U0puNEgvTkJYQkFJa0FibU4xN0wyYmFPanRmR1gzMWlrNS85eExiOC9MZDIvWCs4TjcxaHNpbExxVXBGVUN4WnFNT0gxOU4wWTlnSkhZUkNuRUl4cWlEVUJrTVhtUVQxelJMdUhaYTgyYXU1T0lXeUNGZ1RjMUdVWjBpNTdsNFcvSGN2akhsN1ZQdVh2LzhrUDNiZkNuL3RtVjNlM1p0QkZhNHpSMWxXNTdIb1cxdjY1KzZ0a2wvOS9GM2MzUS84MU85ZDlMTkhUYUpMWFQvS2RVTlJRbGVQaDhRa1BOVUwzTDlhc0ZrcWc2RDBnMGhWS0pXQ3FpZ3FTaFdjdmdSV0NtR2xnSHRXQWgvYjZsTktTRGRVSlJTQ2hvNWJZTWNlcmlKVUNtOGN0dnpvNzV6bjViMkc1MzdzSHZucW43aUxKM2Q2MUxWUk40bEpXSnRSeC93eVQ3OXJqTG8ybmpyUjR6YytmNW9Ydm5DZlBIOXR4cC8rbmZPOE5Xb29ieUt3NUxtNEJpY1VRZ2hPS1VuNEo3WjczREVzV1FuS3NCUUdLcFRxaUNqU1JLUDF0SmhwRlBZYjQ5b3MrdTQwY203UzhvZVhaM3hucjA3a09ZVEduTVljaXdhNm1FdDM1dGxWVFpQVzJDZ0wvc3FqYS96NGZTdGlEdCs0T1BYbnJzNTRlOVN3VjZlbGIxYkNmU3NsVDIzMytPTjM5RVdBMzNwcjVQL2kxWDBPYTJlbFhNU1A1VENxR0ZnaTRhUVpkT0tQbFFxUGIxWDh3RTZQdTFjTFRsU0JyVjZROVZMcHE5TXZCRW1nZmhKa0ZwbFRwNjVNRStQdnU0ZVJaeTVQT1Q5dUVqV3lOV295RXlrbWtweG5Cc0wxYzJwelp4d2RkZWZqTzMxKzRFU1BqNnhYM0xrU1dDOEQ0T3czem9WeHk2c0hOWCswTytYNXF3M216akFrenVqTmVFanFLZjFwU05Ub0FxY3FrbW5mTXl6NDRaTjlIbHdON1BRTGRucUJ0VkpscFZCNklaWFFCZTZKUzYySmFqZ0lRbXNpcTVWNmJZSDdWNVZSYTB4aW9qQjVrV2pQMFFTQ1l0RlFXVzdtczBaeWpsL0xNUERMZXpVdlhKdWxVVysyaHFTeFpMWkJFOHQzRUpoWFdSMkMweG4xL09leXdPcVVtbkx3ZGhYNDVIYVArMVpLVnF2VVFIVTgwakpqNmdvcGVrZFAvYVpveWlURG9FU1FhTzdSalVmV1N5Wm1QSGRseG42ZEtBOE5udWhJUVRPcktQZlZTeGowY3RsYUJhaHVBK1ZZaHFxV2hlMWdhRVVKWVdtalZLbFUyQ3lGcDdaTFByUmFaQ0t0c2xhcURJTFN5NlpmZEpTcUZJUVNzSmRMVWl3azJEUldLdEVTb1BqWWVvV1o4TUsxS2RlYXhPUVJISFdoSmJNVDVpdk93aTlOUm00WFNWZ005WHdCRHVhbmFhNjBRcVpRbHFtV1pxdFNudHp1OGRITmlzMWVZTDFTMWd1VlFTSDBzNzkzellmNEVrMnlTejFCb1hJbklxeWdlSVdZNEc2Qko3YlRRMTY0T21OM2xzQ0hOaWJ1Wm5TWlR4VmlsckpiOVBVYmNHczEreHpTNmI0aklnUTZBQ0RuMlNCenJ2ZUpudktKN1I2UHJwZHNWOHBtcFd4VUtpdWxKb0Z6Yk5DbExIbU1NZGkxcHFLQzVZZGFJU2xDWjlyaDR4czkra0Y0YWEvbTNGSExMSGMxTVI5ZmNNOWRVVzVTTEVNdjBvRUMxNnZVbC80N0YzUkJaQlU4MS85T0llbDlxZEJYNFo3VmtzZldTeDdhS05rb1F4STRrV1BwNTdLNjZ5MlcyKzRDT21aZng4bE1RcGVXdW9QRUxYRVIzSU1haFNnZkRSWHJaZUNWYXNickJ6V0hyZERtU2loYVloYTVDR2FKT3UwWmQ1cnpSSFAwNy94OXppdGNZdXlxZUlyZWViaWdxaFNlNm9YMVNuaGt2ZVRSalI1M0RSSUxlS09TRktXRE1waFhYN2xoOGlVWjVUcno3alpBdXhZTGgzeG9SQWlTQ0c3dWlkQ1NIblJIUC9ER1ljdWJveWJSSGtndFlEUW41b21saVdhYWhXU2F4UklTMDUzQjZEU3NBbTZaQWV5SkNFYzZuMUdKOE1CYXljTnJKZmV0Rm14VktXaXRsY3BhS1RMb0JDNlVNdGZmeThkRmJtcmVuZEJrLzZZajVoVVpmakdsRUpOQzFDdDFlbHF3WGdpbmh3VVBURXJlT3F4NTY4aVp4SmF5NkxncWlhaGpvaG56U2h6d2VYUGhqcWhrVEU3bUhPMGdpZWlPdzZCUTdsOVJIbGd0dVhOWWNxcW5ESXRNY2k4a2s5d3pVSkRQZmlRLzdncWI2MlM4MVdtZFpXSk1PbjZVQ3hoenBtMHFPc2FOK3lnVDRJOVNKY2VWMm5sbk5PUDh4TmlkR0czMlk4OUhJOXpueWEwejlLVXBTZXFVQktmUU5MSzVleGk0ZDloanV5ZHM5d1BEUWxrSmljdytMRVdHUVJnVU1xZFRMU0sxM0JLLy81NUhsRG9nMzBuekk4dGNzY1pnWnM2c3pZei9UTktaUm1kcXp2N01PSXpPNFN4eXRZbGNtclRzMTg0b0p2NTRhOGVMazBLVEVLc2xiSlNCa3dObHB5eFlyWVQxTWdXbktnczNDTUl3YURxNGtnTldrY0dCSXAvYjZyUjd5NEhGK3g1Rzg1VER6VklZU2tjYzhpekpuVG9hTTROWmEwd2lQbzNHTEVLTlU3ZHBFeFo4ai9ScTgvZkovcDhXbklDTUtxUTJzSzlKcUJLaEY2QWZsRUdCOUxJWmQ3VjJGNTJEa0E2bWVaNVZmWS9zZUZzbjhDd0hta1JlTnl5Q2t3Nml0Wm4zWFZ2dW1KSmdQdk0wbjY0dDBaalN3YlRNQ25TZmo0SzdBeXBkcEsxVUNLcFU2Z25weUJoZVR6c1RWZ3BOblZUSVFWWkRJdlNHdk5iM08zMTRXMElmVTN3K1krbTVFREVneGtnVUpWcWtiZ1dUaFRZYmk3U210TzRlTTJFOWNWa1dQdDFoY1NHakdvV2tJNGFkRmFnTFZlRUVEUVEzUWdqcFhFWlhaYzFaMEl2amg5L3IrcjljM3dMdDdJUElPQUFBQUNWMFJWaDBaR0YwWlRwamNtVmhkR1VBTWpBeE9DMHhNQzB5TlZReU1qbzBNem93Tmkwd05Ub3dNRkN6a0NvQUFBQWxkRVZZZEdSaGRHVTZiVzlrYVdaNUFESXdNVGd0TVRBdE1qVlVNakk2TkRNNk1EWXRNRFU2TURBaDdpaVdBQUFBQUVsRlRrU3VRbUNDJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgIGxhc3RXYXlwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IHRydWUsIHRleHQ6ICcnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRDBBQUFBMENBWUFBQUE1YlRBaEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBT3hBQUFEc1FCbFNzT0d3QUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQWg5U1VSQlZHaUJ4WnByYkZ6RkZjZC81OTZzNC9WNnZVNXNFbE8ySVhHYWgyM3lzSjFFRU5IeVVCK2tsSDZCdnFCcW9hM1VoNURhU2tXSWlsSlVxU0lpcW9MNlVJVmFwTFlpMU9VaEVMU2dwaFVva0laRUpDWXg4U09KWTF5SkJDZXgxMTU3MTJ2djdwM1REN3RyMXNIRzkzcnZxdjh2TzN2dnpIL08vODdNbVRNUG9Zem8yN0FoUEdWWm4xZVJtNEd0aUt4Qk5aSi9QUTRNb0hwQzRkVjBKdlB5dGYzOTQrVzBwd0FwQjJuWHBrMk5qakVQb1BvMUlPU3kyS1JDaDRvODB0N2QzVjhPdXdyd1ZmU2hhRFFZakVRZVJ2WEhRR0NSTkZuZ01TY1kvUG0yWThjbWZUUnZCcjZKL3VmNjlSc3JSUDVWYTl0Ulh3aEZUb25xN1Z0N2VycDk0U3VDNVFOSDRQYmEyb2NxUlU3NkpoaEFkWVBDd2M2Tkc2L3pqVE9QVWx2NjQ4M0I0RXUvWDdWcVM0MXQrMkxRaHlBU3R4M25rNXY3K3Q3eGk3S1VscjYxeHJhN0hvMUd5eWNZUURYaVdOYmZ1MXRhbHZ0RnVWalJ0d0l2UE5EUVVIdFZZTEgreWhOV3BWVWY5NHRzTWFLM0F4MDdRcUVsdDBRaUMyYjJFWGQwTmpmdjhvUElxK2c2NEVXZytrY3JWL3BSdnllSTZtNzFZY1paNGpIL0hxQmhXeWhFVTJXbHA0STlxUlRQajQxeElwVWk2VGhFYkp0dG9SQmZYcmFNYUVXRk94S1J6U2V1dWVZem5EeTUzNlBkcytCRjlFYmdHd0JmOU5DdE02cnNHUnJpMmRGUnRPajUrVXlHM3FrcC9ocUw4WU1ycnVDZStucFhmT280ZHdNbGlmYlN2ZThGYkF1NHFhYkdkYUdPV0d6Zk02T2p0eW5zQXI0SHZBd2Y2TStxOHV1TEYvbmo4TEE3UXBIYmpyYTNsK1E5M1k0UEc3Z0ExRFZWVnZKVVk2TmIvbWRiZTNxK05NZnpHNEFPb0tId3dBSTZHaHRaNTJMWXFERTcyL3I2M25ScnhPVncyOUx0NUp3WVRjR2dhM0tqK3F0NVhoMEFiZ0ZTTTNtQnAySXhWN3dpMHVyYWlEbmdWdlJNSlZIMzgzS3lyYmYzeUVlOFB3SHNMWDV3T0psMHkvMEp0eG5uZ2x2UmF3cUppUHZvYTFpWTVidm13cCtLLzhTeVdYZk1sbFhuMW9nNWk3dk1GeTRrbGxxdWZkK1ZyNjFldmRBQTdRZG1sbyt1cHk1VjkyTnNEcmhWTU5QdkVvN2pscnVpTmhpOFpZRThTNEdaRDNOak9Qd1JXVCtBaUpTMHcrSlc5S1ZDWXR5OWFCQjU2T21jNTU4UE54ZHNDTnMyZHkxM3Q2WXd4cmljMythR1c5R25Db2x6bVl3WC90WjFMUzIvbVNkMEZPQUJnQW9SZGw5MUZjdVh1SXVWTEpGM3ZSanhvZkl1OHgwaTc1UjZwcWE4MWFENi9lUE56YzkzTmpWZFhmUlVnTjNBOWVzcUszbGk5V3AyVmxlN3BqU1dkY3liRWJQaEpYanZBamJaSWh6Y3NJRks5dzZ0Z0xUQ2ErY3ltWGNQVEV4OEttMU04OWFxS3JaV1ZYbGRRVXhYcDlPUmRmMzkwMTROS01CTDdQMDBzTWxSNVVneXlRMHVuVTRSS2dRK0Z3MEVYSS9kZWZCcUtZTEJXK3pkUWI2THY1NUlsRkpuU1ZEVmwwcmw4Q0s2bi96cTVzREVCSTR1RkhlVUFTS081VGd2bGtyamRXRHVCUmpKWmpuNC8yaHQxZjFiVDU4K1Z5cU5WOUg3Z1U2QUY4YkdTcTNiTTFUa0NUOTR2SXBXNEVHQU54SUozdmMyWjVjR2tYTkxvZVR4REl2YkdId0ZPT0NvOHVUSWlCODJ1SUtxN20zcDdrNzd3YlhZTGVCN2dld0xZMlBFdllTbGk4ZFlPcDMrZzE5a2k5Mmx2d2lzektqdVdDTENqcERiZzhuRlFVVWUyWDdxVkVuN1lzVW81WVRqcDhCLzk4VmlqTGhkQnk4T0krbnA2Y2Y4SkN4RjlEandyWlF4K29UYlRiMUZRT0VSdncvclN6MjFmQlg0M2RPam81enh1aEJ4aHpQaGRQcTNmcFA2Y1ZSN3Y2TjZldmZRMElKN1ExNmg4TU5TNCt5NTRJZm9TZUR1enNuSnpQNXgvM3Fod0hOdFBUMnYrRVpZQkQ5RUE3d0ozTDluYUlpa01hV3ppYVRVbUorVVRqUTMvRHhZUHB3eXB0bFJiYm5XdzRiQVhCRFZYN1QyOVpXOHNKZ1BmclYwQWQvZUY0djF2cE5LTFp4emZod1BXTmFqZmhrMEYvd1duY2lxM3ZIdytmT0o2Y1V0UGFlTlpYM1RyM0J6UHBUajNzU2xVY2ZwVEt2ZWVWMTF0YWVkSUJYNVdYdDM5M05sc0drV3luVlo1R3hQS2pYV0ZncnQrcGpMWXlDQncyZDZlcjd6ek1LbklpV2piRGRrREJ3WlNLY2JQMXRUczZWQ0ZtendDVlIzZlhxNGpLRmRFVngzdjBQUmFEQllYYjFTNFVxeHJCVUNkWWhFVkRXQ1NDUi81N01hUUtGU0lHaEEvanc4dk9PZSt2cVAza1ZVUFNlV05aUkxhZ3FZeXZPa0pKOEdFb2pFVVkyak9pWWljWVdZR25NUmtmUHhWT3JDVFlPRHJzTENXYUtQdHJjSEpKbmNiTnQydTZxdVEyUXRxbzNBMVVCdFVkWUVJcGRRalJjTUVaRzRxcVlRY2RTWWNRQVJjYVlnZVhoaTRyNGJ3K0hpOGtVV3lIOEUvcUtxTlNKaTU0WFhxS29OSUpaVmc2b3RJc0ZaSHpqM2UwWGhRK2N4Qmd5cTZvQ0lESWpJR1RIbWFLYXE2cDF0eDQ3TjdIaklvV2cwV0ZWVDgxWGdMb1hyeVowdkRRSzlxQTZJWlExZ3pMdHEyeGVzVE9iOVpESTV0UE85OXp6TlNiZUZ3L1VQUnFPdlY0ZzBYZmFxMndrR2Q1UnlCL1JRTkJvTWhVSU5KaEM0VWh4bkpaYTFSbzFwRkpHMW1yc3lzaHFZQnQ1QVpOOVlNdGtoeDV1Yi82MndCZFcvcWNnL1REYjcxcmJUcDMwZlcyOXYzTGdheTNvTEtGd3VtVkNSYTl1NnUzdjhycXNZUjlldnI3ZVdMTmt1SWw5QTlTdkEyNWJteHVLNFd0WUZXL1VDNFhDOEhKVzM5dlVOYXU0cWRCWXdZbGwzbGxzd0FPRnczSUloelYwZmlRTVI2ZHEwYVZuV21PK0s2dGVCbHJ6ak9LN1FKNnBualdXZHhYRUdqVzJmUzhmamw3eDI3Y3Z4ZGxQVGZVQkZhMi92TDMyUUJFQjNTOHZ5dERGMXFsb3Z0cjFHakdsVWtiVkFrOEFXelIwSG54U1JKelVRZUh5V0l6dXhlZk1Lazhsc1Y4dHFFOVgxZVVlMkZsaFJsRzBDZUI4WW5YRmtNRXJPbXlhczNQakJxRTVhSXRNQXFwb0UwZ0FLQ1ZITmFtRStGZ2xJM2hrSkxFV2tLbCsrMGhMSkhiNnJWZ0VoaFRxRk9vSGxBblVxVW9kcUhiTWp5d3VvbmtWa1FGUlBLWFJhZ2NEUkxWMWRGd3NaWEUxWlI5dmJxd0tKeEVwSHBDRS9YVFVZa1dVWVU0dElyWldidW1xQUNpQWlJbFplYktUSW9OcWkrcGJsZjVXY3g0WGNYWnZDMEhJS0IrK3FtZ1VtRUprV2lDbU1pREVqQmtaRVpGaEVoaDJSRVR1ZEhwbWNuSXk1NlluL0E4RklTMjA1T1NLZUFBQUFBRWxGVGtTdVFtQ0MnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIHZpYXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIHdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UgfSxcclxuICAgICAgICBhdXRvVXBkYXRlTWFwVmlldzogdHJ1ZSxcclxuICAgICAgICBkaXNwbGF5Um91dGVTZWxlY3RvcjogZmFsc2VcclxuICAgICAgICAvL2l0aW5lcmFyeUNvbnRhaW5lcjogJyNkaXJlY3Rpb25zSXRpbmVyYXJ5J1xyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIC8vZGlyTWFuYWdlci5zaG93SW5wdXRQYW5lbCgnZGlyZWN0aW9uc1BhbmVsJyk7XHJcblxyXG4gICAgICBjb25zdCB3YXlwb2ludDEgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5XYXlwb2ludCh7XHJcbiAgICAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihsb2NjLmxhdGl0dWRlLCBsb2NjLmxvbmdpdHVkZSlcclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIGNvbnN0IHdheXBvaW50MiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLldheXBvaW50KHtcclxuICAgICAgICBsb2NhdGlvbjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGVuZExhdCwgZW5kTG9uZyksIFxyXG4gICAgICB9KTtcclxuICBcclxuICAgICAgZGlyTWFuYWdlci5hZGRXYXlwb2ludCh3YXlwb2ludDEpO1xyXG4gICAgICBkaXJNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50Mik7XHJcblxyXG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihkaXJNYW5hZ2VyLCAnZGlyZWN0aW9uc1VwZGF0ZWQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIC8vdGhhdC5wYXRoTGF5ZXIuY2xlYXIoKTsgXHJcbiAgICAgIHZhciBhbGxXYXlQb2ludHMgPSBkaXJNYW5hZ2VyLmdldEFsbFdheXBvaW50cygpO1xyXG4gICAgICBcclxuICAgICAgdmFyIGZyb21BZGRyZXNzID0gYWxsV2F5UG9pbnRzWzBdLmdldEFkZHJlc3MoKTtcclxuICAgICAgdmFyIHRvQWRkcmVzcyA9IGFsbFdheVBvaW50c1sxXS5nZXRBZGRyZXNzKCk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCByb3V0ZUluZGV4ID0gZS5yb3V0ZVswXS5yb3V0ZUxlZ3NbMF0ub3JpZ2luYWxSb3V0ZUluZGV4O1xyXG4gICAgICBjb25zdCBuZXh0TG9jYXRpb24gPSBlLnJvdXRlWzBdLnJvdXRlUGF0aFtyb3V0ZUluZGV4ICsgMV07XHJcblxyXG4gICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgcm91dGUgaW5kZXguXHJcbiAgICAgIGNvbnN0IHJvdXRlSWR4ID0gZGlyTWFuYWdlci5nZXRSZXF1ZXN0T3B0aW9ucygpLnJvdXRlSW5kZXg7XHJcbiAgICAgIC8vIEdldCB0aGUgZGlzdGFuY2Ugb2YgdGhlIHJvdXRlLCByb3VuZGVkIHRvIDIgZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5yb3VuZChlLnJvdXRlU3VtbWFyeVtyb3V0ZUlkeF0uZGlzdGFuY2UgKiAxMDApIC8gMTAwO1xyXG4gICAgICAvLyBHZXQgdGhlIGRpc3RhbmNlIHVuaXRzIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByb3V0ZS5cclxuICAgICAgY29uc3QgdW5pdHMgPSBkaXJNYW5hZ2VyLmdldFJlcXVlc3RPcHRpb25zKCkuZGlzdGFuY2VVbml0O1xyXG4gICAgICBsZXQgZGlzdGFuY2VVbml0cyA9ICcnO1xyXG5cclxuICAgICAgaWYgKHVuaXRzID09PSBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLkRpc3RhbmNlVW5pdC5rbSkge1xyXG4gICAgICAgIGRpc3RhbmNlVW5pdHMgPSAna20nO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIE11c3QgYmUgaW4gbWlsZXNcclxuICAgICAgICBkaXN0YW5jZVVuaXRzID0gJ21pbGVzJztcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgY29uc29sZS5sb2coJ2xhc3QgWm9vbSBMZXZlbCcrbWFwWm9vbUxldmVsKTtcclxuICAgICAgLy8gVGltZSBpcyBpbiBzZWNvbmRzLCBjb252ZXJ0IHRvIG1pbnV0ZXMgYW5kIHJvdW5kIG9mZi5cclxuICAgICAgY29uc3QgdGltZSA9IE1hdGgucm91bmQoZS5yb3V0ZVN1bW1hcnlbcm91dGVJZHhdLnRpbWVXaXRoVHJhZmZpYyAvIDYwKTtcclxuICAgICAgZGlzdGFuY2VEYXRhID0gXCI8bGFiZWwgc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7IGZvbnQtc2l6ZToyNHB4Oyc+XCIrIGRpc3RhbmNlICsgJyZuYnNwOycgKyBkaXN0YW5jZVVuaXRzICsgXCIsIDwvbGFiZWw+VHJhZmZpYzogXCIgKyB0aW1lICsgXCIgbWludXRlc1wiO1xyXG4gICAgICAvLyAvLyBpbmZvYm94LnNldE1hcChtYXApOyAgXHJcbiAgICAgIC8vIGluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgIC8vICAgICBsb2NhdGlvbjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGVuZExhdCwgZW5kTG9uZyksXHJcbiAgICAgIC8vICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAvLyAgICAgb2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMCwgNDApLFxyXG4gICAgICAvLyAgICAgaHRtbENvbnRlbnQ6JzxkaXYgc3R5bGU9XCJtYXJnaW46YXV0byAhaW1wb3J0YW50O3dpZHRoOjU1MHB4ICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjogd2hpdGU7Ym9yZGVyOiAxcHggc29saWQgbGlnaHRncmF5O1wiPidcclxuICAgICAgLy8gICAgICsgZ2V0VGlja2V0SW5mb0JveEhUTUwoaW5mb0JveE1ldGFEYXRhLCBkaXN0YW5jZURhdGEsIGZyb21BZGRyZXNzLCB0b0FkZHJlc3MpICsgJzwvZGl2PidcclxuICAgICAgLy8gICB9KTtcclxuICAgICAgJChcIi5tb2RhbC1jb250ZW50XCIpLmh0bWwoZ2V0VGlja2V0TW9kYWxIVE1MKGluZm9Cb3hNZXRhRGF0YSwgZGlzdGFuY2VEYXRhLCBmcm9tQWRkcmVzcywgdG9BZGRyZXNzKSk7XHJcbiAgICAgIGpRdWVyeShcIiN0aWNrZXRtb2RhbFwiKS5tb2RhbCh7XHJcbiAgICAgICAvLyBiYWNrZHJvcDogJ3N0YXRpYycsXHJcbiAgICAgICAga2V5Ym9hcmQ6IGZhbHNlXHJcbiAgICAgfSk7XHJcbiAgICAgIHZhciB4ZmxhZzogbnVtYmVyPTA7XHJcbiAgICAgICQoXCIjbW9yZUZvcm1Db250ZW50QnRuXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxlZCBjbGljaycpO1xyXG4gICAgICAgIGlmKHhmbGFnID09IDApIHtcclxuICAgICAgICAgICQoXCIjaW5pdEZvcm1Db250ZW50XCIpLmhpZGUoKTtcclxuICAgICAgICAgICQoXCIjbW9yZUZvcm1Db250ZW50XCIpLnNsaWRlVG9nZ2xlKCBcInNsb3dcIik7XHJcbiAgICAgICAgICAkKFwiI2R1bW15aW1hZ2VcIikuYXR0cihcInNyY1wiLFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCZ0FBQUFZQ0FZQUFBRGdkejM0QUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUF5SnBWRmgwV0UxTU9tTnZiUzVoWkc5aVpTNTRiWEFBQUFBQUFEdy9lSEJoWTJ0bGRDQmlaV2RwYmowaTc3dS9JaUJwWkQwaVZ6Vk5NRTF3UTJWb2FVaDZjbVZUZWs1VVkzcHJZemxrSWo4K0lEeDRPbmh0Y0cxbGRHRWdlRzFzYm5NNmVEMGlZV1J2WW1VNmJuTTZiV1YwWVM4aUlIZzZlRzF3ZEdzOUlrRmtiMkpsSUZoTlVDQkRiM0psSURVdU1DMWpNRFl4SURZMExqRTBNRGswT1N3Z01qQXhNQzh4TWk4d055MHhNRG8xTnpvd01TQWdJQ0FnSUNBZ0lqNGdQSEprWmpwU1JFWWdlRzFzYm5NNmNtUm1QU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh4T1RrNUx6QXlMekl5TFhKa1ppMXplVzUwWVhndGJuTWpJajRnUEhKa1pqcEVaWE5qY21sd2RHbHZiaUJ5WkdZNllXSnZkWFE5SWlJZ2VHMXNibk02ZUcxd1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JTWldZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlZKbFppTWlJSGh0Y0RwRGNtVmhkRzl5Vkc5dmJEMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTlROUzR4SUZkcGJtUnZkM01pSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RoR09UWTVPVEpFUXpOQk1URkZPRGt3TWpBNE0wUXhNakUzTTBZeU5Ua2lJSGh0Y0UxTk9rUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPVGhHT1RZNU9UTkVRek5CTVRGRk9Ea3dNakE0TTBReE1qRTNNMFl5TlRraVBpQThlRzF3VFUwNlJHVnlhWFpsWkVaeWIyMGdjM1JTWldZNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzVPRVk1TmprNU1FUkRNMEV4TVVVNE9UQXlNRGd6UkRFeU1UY3pSakkxT1NJZ2MzUlNaV1k2Wkc5amRXMWxiblJKUkQwaWVHMXdMbVJwWkRvNU9FWTVOams1TVVSRE0wRXhNVVU0T1RBeU1EZ3pSREV5TVRjelJqSTFPU0l2UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUHYzUkh3Z0FBQUY3U1VSQlZIamF2SlpCWndOQkZNY25GYzBuS0dFb09ZV2xoSHlKc0N3OTVXUHNLWlI4a2lIWHNQVFFTM3BwSmQrZ2xGSktMaVU5OWRMcUtZVHBtL29QejVqZG5VbW5mZnlXblozNS8zZmU3TXpiam1nT1NWd1NPWEZHak5EK1NMd1R0OFNOMXZwTlJFYWZVTVNCMEMwYzBMZFBSc0xGRnhQaWl3bFV4SlFZRTEwd1JsdkYrcGt4a3phRGtnMjRKcktBMldib2E4ZVZkUVlGUzhrOE5KZE1hTTVTVnJnR1pqRS8wRUhGTEpienRnb2FSa3R5QThYeUxZNDFnS0JkRjJVTnpsbHFzZ1FHR1V1VjBSWlhhRmlLSTZMbTAxeEMwMmlMTlc1eWtTQmdrRVB6em56VFE3WTdlVndRcHhIYW44VFcwZnBKK1I1dVBXZkFhOEF1NXF6WURIcG8yM2NiM3VnSjUwMW9iT3NlN09BbUU2NkJoT2J1aEM0dmVEWks4UlU1V3MvRzRCNDNVNUV1ck5iR1hBWi91TkVHLzNKVTJFV3hOV0QyaThOdXhtcUQ5QjNYT3RiRUk2NTl4N1d2NEZSc2x6ZkYwS2xzWlZ2SkxCcEtwbzI2a2xtRTFHUzdKb3VJb3Ird09YZnBSUDYyMkZrOGhQNjJmQXN3QUplZVphQW5XU3VmQUFBQUFFbEZUa1N1UW1DQ1wiKTtcclxuICAgICAgICAgICAgeGZsYWcgPSAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZih4ZmxhZyA9PSAxKSB7XHJcbiAgICAgICAgICAgICQoXCIjbW9yZUZvcm1Db250ZW50XCIpLmhpZGUoKTtcclxuICAgICAgICAgICAgJChcIiNpbml0Rm9ybUNvbnRlbnRcIikuc2xpZGVUb2dnbGUoIFwic2xvd1wiKTtcclxuICAgICAgICAgICAgJChcIiNkdW1teWltYWdlXCIpLmF0dHIoXCJzcmNcIixcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQmdBQUFBWUNBWUFBQURnZHozNEFBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCQlpHOWlaU0JKYldGblpWSmxZV1I1Y2NsbFBBQUFBeUpwVkZoMFdFMU1PbU52YlM1aFpHOWlaUzU0YlhBQUFBQUFBRHcvZUhCaFkydGxkQ0JpWldkcGJqMGk3N3UvSWlCcFpEMGlWelZOTUUxd1EyVm9hVWg2Y21WVGVrNVVZM3ByWXpsa0lqOCtJRHg0T25odGNHMWxkR0VnZUcxc2JuTTZlRDBpWVdSdlltVTZibk02YldWMFlTOGlJSGc2ZUcxd2RHczlJa0ZrYjJKbElGaE5VQ0JEYjNKbElEVXVNQzFqTURZeElEWTBMakUwTURrME9Td2dNakF4TUM4eE1pOHdOeTB4TURvMU56b3dNU0FnSUNBZ0lDQWdJajRnUEhKa1pqcFNSRVlnZUcxc2JuTTZjbVJtUFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eE9UazVMekF5THpJeUxYSmtaaTF6ZVc1MFlYZ3Ribk1qSWo0Z1BISmtaanBFWlhOamNtbHdkR2x2YmlCeVpHWTZZV0p2ZFhROUlpSWdlRzFzYm5NNmVHMXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNoaGNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSU1pXWTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpWSmxaaU1pSUhodGNEcERjbVZoZEc5eVZHOXZiRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5UTlM0eElGZHBibVJ2ZDNNaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9USTBSalZGTmpaRVF6TkJNVEZGT0VGRU1USTRRVU16T0RORFJFUkdRa01pSUhodGNFMU5Pa1J2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T1RJMFJqVkZOamRFUXpOQk1URkZPRUZFTVRJNFFVTXpPRE5EUkVSR1FrTWlQaUE4ZUcxd1RVMDZSR1Z5YVhabFpFWnliMjBnYzNSU1pXWTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG81TWpSR05VVTJORVJETTBFeE1VVTRRVVF4TWpoQlF6TTRNME5FUkVaQ1F5SWdjM1JTWldZNlpHOWpkVzFsYm5SSlJEMGllRzF3TG1ScFpEbzVNalJHTlVVMk5VUkRNMEV4TVVVNFFVUXhNamhCUXpNNE0wTkVSRVpDUXlJdlBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BsaE9zdVlBQUFHeFNVUkJWSGphdEpiQlNzTkFFSVlUTGZvRWhVSWcwRk1oSUJSNjlTUUlCU0hncWRBSEVEemw1S25nWXdpQjlsb0NIcnpvU2ZBTkJFRUlDSVdpMUpNWHhWT2hFUCtWR1JqWFRiS0pjZUJMMDJUMy83T3oyWjI0VG5GNDRCZ2NnVGJvMC9VSDhBWnV3RldXWmE5T3hlaUFHR3hBVnNLRzJuWmc1T2lZWWdnK2hVQUNSbUFBV3NTQXJpV2luZW96TERPSVJJZExFRmlNTnFDMjNDL0tNd2hGU2lhMnVSUkNFNUd5VURkUWsvbE9EZUlDdlgxd0lrZW1QVzFNR2tyTGt3YXh5SGRSWEZDN1U1TUJDZks4eEd6Z2k5UUVEUmdFSWxYK0ZnNWpzQTNtSUhYK0dEQkpTVXRwanBYQklkMmIxeEYwWGZjSG10YUJlcWQ3WW5YSzJBTTcyclUyL2ZxMEZtUjhnSVdtOVozeU5lVnNWK3Z3YkxHS0pkYzhKNlNsVHRhdGd0RS8wbjRqdzZkUnZCanVMZktFVnVUbVdhVDgxMXRrV25pa3BVNVdhcEtmNkY2LzVsdGoybnRZSzFVR3QvUm41RFFYckhXbkR0MS9YR2hkTllJbG1GSDc4d2FlbmpWbU1Gekt6WTVyd0ZuZE9hQytYQnM4MDNhZFZUVXhpR2VtN2RwVWNCS3h5b3VpcDFXMnFLeGtoZ1Vsa3lPdlpJWTJOWm5uWkZxaDZFODU1enB1eGM4V0hzVzk3V2ZMbHdBREFFZURVcTJEVlk4TUFBQUFBRWxGVGtTdVFtQ0NcIik7XHJcbiAgICAgICAgICAgIHhmbGFnID0gMDtcclxuICAgICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgICQoXCIuY2xvc2VcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgICBkaXJNYW5hZ2VyLmNsZWFyQWxsKCk7XHJcbiAgICAgICAgbWFwLmxheWVycy5jbGVhcigpO1xyXG4gICAgICAgIG1hcC5zZXRWaWV3KHtjZW50ZXI6IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihlbmRMYXQsIGVuZExvbmcpLCBtYXBab29tTGV2ZWx9KTtcclxuICAgICAgfSk7XHJcbiAgICAgICQoXCIjdGlja2V0bW9kYWxcIikub24oXCJoaWRkZW4uYnMubW9kYWxcIixmdW5jdGlvbigpe1xyXG4gICAgICAgIGRpck1hbmFnZXIuY2xlYXJBbGwoKTtcclxuICAgICAgICBtYXAubGF5ZXJzLmNsZWFyKCk7XHJcbiAgICAgICAgbWFwLnNldFZpZXcoe2NlbnRlcjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGVuZExhdCwgZW5kTG9uZyksIG1hcFpvb21MZXZlbH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgJChcIiN0a3RJZFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgIHBpbkNsaWNrZWQoaW5mb0JveE1ldGFEYXRhLCAxKTtcclxuICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBkaXJNYW5hZ2VyLmNhbGN1bGF0ZURpcmVjdGlvbnMoKTtcclxuICAgICAgXHJcbiAgICB9KTtcclxuICAgIH1cclxuICAgXHJcbiAgICBmdW5jdGlvbiBnZXRUaWNrZXRNb2RhbEhUTUwoZGF0YTogYW55LCBkaXN0YW5jZERhdGE6IGFueSwgZnJvbUFkZHJlc3M6IGFueSwgdG9BZGRyZXNzOiBhbnkpOlN0cmluZ3tcclxuICAgICAgY29uc29sZS5sb2coZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICB2YXIgd29ya1NldmVyaXR5Q29sb3I6IGFueSA9IFwiI2NmMmEyYVwiO1xyXG4gICAgICAgIGlmKGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJtYWpvclwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHdvcmtTZXZlcml0eUNvbG9yID0gXCIjMDA5ZmRiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcIm1pbm9yXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcIndhcm5pbmdcIiB8fCBkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkgPT09IFwidW5rbm93blwiKXtcclxuICAgICAgICAgIHdvcmtTZXZlcml0eUNvbG9yID0gXCIjMTkxOTE5XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkaWFsb2dEYXRhID0gXCI8ZGl2IHN0eWxlPSdkaXNwbGF5OiBmbGV4OyBwYWRkaW5nOjVweDtqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7Jz5cIlxyXG4gICAgICAgICtcIjxoNSBpZD0ndGt0SWQnPjxhIGhyZWY9J2phdmFzY3JpcHQ6dm9pZCgwKTsnIHN0eWxlPSd0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgY29sb3I6IzAwMDsgZm9udC1zaXplOjE1cHg7Jz5cIisgZGF0YS50aWNrZXROdW1iZXIgK1wiPC9hPjwvaDU+XCJcclxuICAgICAgICArXCI8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3M9J2Nsb3NlJyBkYXRhLWRpc21pc3M9J21vZGFsJyB0aXRsZT0nQ2xvc2UnPiZ0aW1lczs8L2J1dHRvbj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiAgc3R5bGU9J21heC1oZWlnaHQ6MzkwcHg7IG92ZXJmbG93LXk6YXV0bzsgb3ZlcmZsb3cteDpoaWRkZW47IGZvbnQtc2l6ZToxNHB4OyBwYWRkaW5nOjVweDsgd2lkdGg6MzcwcHg7Jz5cIlx0XHRcdFx0Ly9jbGFzcz0nbW9kYWwtYm9keSdcdFxyXG5cdFx0XHRcdCtcIjxmb3JtIGNsYXNzPSd0a3RGb3JtJz5cIlxyXG4gICAgICAgICtcIjxkaXYgaWQ9J2luaXRGb3JtQ29udGVudCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrOyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTMwcHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+U2V2ZXJpdHk6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyNDBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnIHN0eWxlPWNvbG9yOlwiK3dvcmtTZXZlcml0eUNvbG9yK1wiPlwiKyBkYXRhLnRpY2tldFNldmVyaXR5ICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjEzMHB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkNvbW1vbiBJRDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjI0MHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIitkYXRhLmNvbW1vbklEK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTMwcHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+QWZmZWN0aW5nOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjQwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmN1c3RBZmZlY3RpbmcgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTMwcHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+U2hvcnQgRGVzY3JpcHQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyNDBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnNob3J0RGVzY3JpcHRpb24gK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS0xJyBzdHlsZT0nd2lkdGg6MzBweDsnPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tMTAnIHN0eWxlPSdib3JkZXItdG9wOjFweCBzb2xpZCAjZGJkYmRiOyc+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tMScgc3R5bGU9J3dpZHRoOjMwcHg7Jz5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS0xMicgc3R5bGU9J3dpZHRoOjM1MHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRpc3RhbmNkRGF0YSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlx0XHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tMScgc3R5bGU9J3dpZHRoOjMwcHg7Jz5cIlxyXG4gICAgICAgICtcIjxpbWcgc3JjPSdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJzQUFBQVlDQVlBQUFBTFFJYjdBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFBSmNFaFpjd0FBRHNNQUFBN0RBY2R2cUdRQUFBTlJTVVJCVkVoTHZaVkxTRlJSR01lTmlxSzJ0WXdXdFcvUnBxaWdDQ0pDaUJaRlVGbkxhRkV0YXBFU0dCaVZSUlNDQ0dVdk5XMXNMTk5TazE0cXZTd2RINDJQZVR1UGEvTitPQy92elB6NzN4aXRPOTRaeHdoL2NPQnk3ajMzZjg3M1A5LzNGV0FSV1pEWWRDeUJjRVRFVkhnYVNDVFRzL2t6cjVnOUVNZEhXeGpWV2o5S2UxMjQrTVdKa3M5T1hPNXo0LzVZQU44Y1lRUzRnWHpJS3BiaU1IcGp1TlByUkZHekJSdHJEVmo2VUk5Vk5RYXM1bGp5UUkrMU5YcWNlamtCdGRZTGl6K09sTFFvQjFuRm1rZjlPUGpNakMzMUJsenJFZkJhRjhDUUt3WjdXTVRQYUlMUFVUd1o4dUpzbXhWckh1bHhvTU1PM1dRa3ZWb1pSYkZuRkRyNTBvcWlGeFpVRDNveHloOUg2RmNtZmdyM01ZeVhHTmFkUFAyK05odkcrRzBxcVh4RXVSaS9NVEYwaDdud0dJV2UvdkJCRk9lL0NCR0tsdEhMRGZWR1hQdjBFeE1NcVJJeU1TRVl4MTE2dEkyaHE5SjRrQkRuTWVFdmJMNFlLaWkwaVQ0KzF3ZlRzM0prWXIyT0NJNCt0NkQwblFNRFF1NzRLNkdoWjV2ckRDaW5xTjAzOTNReXNTWmpDT3U1czRaaDcyOC9Gb3FiS1hDbTA0NkxieDNvTXMwOW5VeXNVdXZqbGRhaHh4Nm1mL21IY0lhcGVCTDFHamRLS0tnYTlxVm4vekFyRm9tS3VQTGRoWlc4eHZvZ0s4US9FSjVPb3BVNWQ2SFRodHBCVDNyMkQ3TmlJbmQxbzkrREZVemNBWGNzUGJzd3BKTTFEWGx3dnNPS1J3TTV4Q1NxUnZ4WWNtOGNuZVlRVW5sYytVeUN6TVdiUFpNb2ZtMURLM00xRTVsWXk4UVUxdkUyM2ZycWhEMUxydVJpSWpDTi9iek5aVjBDZmdqMFBRT1ptSlRRNWQwQ0NodE5hTW1TSzlrUTZWZTdNWWhsdkdDM1dYV1NDcEdSaVltSkZEUXNQOXNiakRqTlVHajVuQzl0Rk5yWFpNWWhWcDZ2V2RiSnhDUkNOUGtLazNLWDJvUWpIVGIwTVEyVWRqbERsRDQxczBnZmUyWEZibTZ5ZmN5UGtFSWRsWmdqSmlHdzlKeDRMMkQ5WXdQT1MyWWJnaGhuUmZBdzBRT3MrSDRPRjU5SFBUR29SbndvWkhmWW96S2lnbDdIY214TVVVekN3MjZzWnBMdlZabXcvTDRPVzlWbVhLZnhkZjF1UFBqbVF2RWJCM2J3WFFIZkhXZWJlYThQSUU0YmNwV0NyR0lTUVo2Z2x6V3lrZ2w2OWVNa3lsZ3p6N1ZiZnlkdEtVdlNEWWE3Wmx6cWMyeEJEUDk4NUJTYklVWVBqUHpoQjlhN1JyWWRxYkYybTRNd2U2THBML0lqTDdIL3hTS0tBYjhBOU1LWEFPZ0U0MmdBQUFBQVNVVk9SSzVDWUlJPScgLz5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEwJyBzdHlsZT0nYm9yZGVyLWJvdHRvbToxcHggc29saWQgI2RiZGJkYjsgd2lkdGg6MzAwcHgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBmcm9tQWRkcmVzcyArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEnIHN0eWxlPSd3aWR0aDozMHB4Oyc+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlx0XHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEnIHN0eWxlPSd3aWR0aDozMHB4Oyc+XCJcclxuICAgICAgICArXCI8aW1nIHNyYz0nZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCa0FBQUFhQ0FZQUFBQkNmZmZOQUFBQUFYTlNSMElBcnM0YzZRQUFBQVJuUVUxQkFBQ3hqd3Y4WVFVQUFBQUpjRWhaY3dBQURzTUFBQTdEQWNkdnFHUUFBQU5mU1VSQlZFaEx6WlhkUzFOeEdNZjdleUxyd2d5TWJnSWhVZXZDaUtDNnpRZ1VSZlJDdzdBWEtucWpFb3VJVUN6cUlsQVVNd2pCaEM0cXJMMjI5djdXM003Y2RKdWJPM3M1Mjdmbjl6dW5VM3ZmdXBBK01EYWUzOW52ZTM2LzUvczh6eDdzQXYrSFNGNlNrRXVsSU8zc1FFb2tJTVhqL0hjdW5VWStsMU9lcWs1VmtUeDlFazRuaFBsNXVPL2ZoK3ZHRFRpdlhZUDN5Uk9FbHBlUlhGK1hINnhCV1JHMitiWldDL2ZZR0N3WExzRFMzdy9IOWV0d1Azb0UxNzE3c0kyUHc5emJDOHU1Yy9CTlRDQmhzY2gvckVDSlNDNmJSV1IxRmM3UlVSaU9INGUxcHdjL2FmUFErL2VJZnYyS3lKY3ZDTEtUM2J3Sjg4bVRNSjQ2QlRjSmM2RThlNzFTQ2tUeUpCRDk5ZzNtczJlaE8zSUU2NjllSVJPSktLdWxpSDQvWEZldndrQml0cEVScEFSQldTbWtRRVQwZUdEcTZvTHB6QmtJczdNOHdkVmdpYzl1YjhNL1BRMTlkemRjdDIvelBZcFJSVExSS0lKdjMwTGYzZzdmNUNTeU5RVCtKdWwydzBOWHBqOTZGT0hGUlNYNkIxVWtZVFRDT2pnSUd5VTdiakFvMGZxSjYvWFF0YmJ5L0tVMk5wU29qQ3F5UlcrZzJic1hRYnFtVEN5bVJPc25FdzdET2p3TUJ4a2k4dm16RXBYaElzd1R3UmN2b05tM0R6RnlUM21QVkljVnFXOW1odDlFY0c1T2ljcHdrV3d5Q2YvVHA5QWVPQURSNGVBTGpTTFJIaHZ2M3NGKytUS0UxNitWcUF3WGthaHRCSjQ5ZzNiL2ZvaDJPMTlvRk9aRVlXRUJkaXBVNGMwYkpTcWo1aVJNdWRBME5XRnJaUVVTOWFWR3laSTdQUThmd2tZbkNTMHRLVkVaVlNUNjRRTjB4NDdCU3ljU2ZUNGxXai9wUUlEWGwvdnVYY1NMMm93cWtxUmNPS2tCbWs2ZnhtYlJtOVJDRWtXRUtCL2F3NGNodkh6SnIvOXZWQkYyUmRHMU5lanBRZmVsUzBpV3FkeEtSRDUraEdWZ2dMOWc3Tk1uSmZvSFZZU1JJNGV3NCtvN09tQ256cHZlM0ZSV0toT2pJcmIxOVVGMzZCQTJxYkV5bHhWVElNSVFhVWE0YnQyQ3RxME5adXBIZnFxZnVNMkdIQTJ2MzJUSVNkc21FL3hVRjk5UG5NQVBPZ0d6TGV0ajVTZ1JZY1JwZzU4UEhzQk1pZnh4OFNJYzFQWjlkKzRnK1B3NUFvOGZ3ME96eFQ0MEJBdDlyT2ZQUTVpYVFvYW1aaVhLaWpCWTFjZW9oem12WElHeHN4UDZnd2VoYTI2R3JxV0ZmNXNveGlaa2dneFRxME5VRkdIdytVN09ZVFVnZXIySWFUUzhlYWJJNGprMjU4bEY5Y3o1cWlMRnNLbkpoQnVsSVpGL1pSZEVnRjgzMm40c2h2N01vUUFBQUFCSlJVNUVya0pnZ2c9PScgLz5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tMTAnIHN0eWxlPSd3aWR0aDozMDBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyB0b0FkZHJlc3MgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS0xJyBzdHlsZT0nd2lkdGg6MzBweDsnPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCI8L2Rpdj5cIlx0Ly9lbmQgaW5pdGZvcm1cdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGRpdiBpZD0nbW9yZUZvcm1Db250ZW50JyBzdHlsZT0nZGlzcGxheTogbm9uZTsnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+RW50cnkgVHlwZTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5lbnRyeVR5cGUgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+U3RhdHVzOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnRpY2tldFN0YXR1cyArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5DdXN0b21lciBBZmZlY3Rpbmc6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmN1c3RBZmZlY3RpbmcgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+QXNzaWduZWU6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmFzc2lnbmVkVG8gK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+Q29tbW9uIElEOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIiArIGRhdGEuY29tbW9uSUQgKyBcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkVxdWlwbWVudCBJRDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuZXF1aXBtZW50SUQgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+RXF1aXBtZW50IE5hbWU6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIgKyBkYXRhLmVxdWlwbWVudE5hbWUgKyBcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlBhcmVudCBJRDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5wYXJlbnRJRCArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5QYXJlbnQgTmFtZTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5wYXJlbnROYW1lICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlByb2JsZW0gQ2F0ZWdvcnk6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnByb2JsZW1DYXRlZ29yeSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5Qcm9ibGVtIFN1YiBDYXRlZ29yeTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5wcm9ibGVtU3ViY2F0ZWdvcnkgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+UHJvYmxlbSBEZXRhaWw6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnByb2JsZW1EZXRhaWwgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+U2hvcnQgRGVzY3JpcHQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuc2hvcnREZXNjcmlwdGlvbiArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5Mb2NhdGlvbiBSYW5raW5nOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5sb2NhdGlvblJhbmtpbmcgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuXHRcdFx0XHQrXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+UGxhbm5lZCBSZXN0b3JhbCBUaW1lOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEucGxhbm5lZFJlc3RvcmFsVGltZSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5BbHRlcm5hdGUgU2l0ZSBJRDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmFsdGVybmF0ZVNpdGVJRCArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5Xb3JrIFJlcXVlc3QgSUQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEud29ya1JlcXVlc3RJZCArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5BY3Rpdml0eSBBY3Rpb246PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuYWN0aW9uICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFx0XHRcclxuICAgICAgICArXCI8L2Zvcm0+XCJcclxuXHRcdFx0XHQrXCI8L2Rpdj5cIlxyXG5cdFx0XHRcdCtcIjxkaXYgc3R5bGU9J2Rpc3BsYXk6IGZsZXg7IGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7IHBhZGRpbmctcmlnaHQ6IDVweDsgcGFkZGluZy1ib3R0b206IDVweDsnPlwiXHJcbiAgICAgICAgK1wiPGJ1dHRvbiBpZD0nbW9yZUZvcm1Db250ZW50QnRuJyBzdHlsZT0nYmFja2dyb3VuZDp0cmFuc3BhcmVudDtib3JkZXI6MDtjdXJzb3I6cG9pbnRlcjsnPiA8aW1nIGlkPSdkdW1teWltYWdlJyAgc3JjPSdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJnQUFBQVlDQVlBQUFEZ2R6MzRBQUFBR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBQXlKcFZGaDBXRTFNT21OdmJTNWhaRzlpWlM1NGJYQUFBQUFBQUR3L2VIQmhZMnRsZENCaVpXZHBiajBpNzd1L0lpQnBaRDBpVnpWTk1FMXdRMlZvYVVoNmNtVlRlazVVWTNwcll6bGtJajgrSUR4NE9uaHRjRzFsZEdFZ2VHMXNibk02ZUQwaVlXUnZZbVU2Ym5NNmJXVjBZUzhpSUhnNmVHMXdkR3M5SWtGa2IySmxJRmhOVUNCRGIzSmxJRFV1TUMxak1EWXhJRFkwTGpFME1EazBPU3dnTWpBeE1DOHhNaTh3TnkweE1EbzFOem93TVNBZ0lDQWdJQ0FnSWo0Z1BISmtaanBTUkVZZ2VHMXNibk02Y21SbVBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHhPVGs1THpBeUx6SXlMWEprWmkxemVXNTBZWGd0Ym5NaklqNGdQSEprWmpwRVpYTmpjbWx3ZEdsdmJpQnlaR1k2WVdKdmRYUTlJaUlnZUcxc2JuTTZlRzF3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzaGhjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUlNaV1k5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVkpsWmlNaUlIaHRjRHBEY21WaGRHOXlWRzl2YkQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVOVE5TNHhJRmRwYm1SdmQzTWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVEkwUmpWRk5qWkVRek5CTVRGRk9FRkVNVEk0UVVNek9ETkRSRVJHUWtNaUlIaHRjRTFOT2tSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9USTBSalZGTmpkRVF6TkJNVEZGT0VGRU1USTRRVU16T0RORFJFUkdRa01pUGlBOGVHMXdUVTA2UkdWeWFYWmxaRVp5YjIwZ2MzUlNaV1k2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNU1qUkdOVVUyTkVSRE0wRXhNVVU0UVVReE1qaEJRek00TTBORVJFWkNReUlnYzNSU1pXWTZaRzlqZFcxbGJuUkpSRDBpZUcxd0xtUnBaRG81TWpSR05VVTJOVVJETTBFeE1VVTRRVVF4TWpoQlF6TTRNME5FUkVaQ1F5SXZQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QbGhPc3VZQUFBR3hTVVJCVkhqYXRKYkJTc05BRUlZVExmb0VoVUlnMEZNaElCUjY5U1FJQlNIZ3FkQUhFRHpsNUtuZ1l3aUI5bG9DSHJ6b1NmQU5CRUVJQ0lXaTFKTVh4Vk9oRVArVkdSalhUYktKY2VCTDAyVDMvN096MloyNFRuRjQ0QmdjZ1RibzAvVUg4QVp1d0ZXV1phOU94ZWlBR0d4QVZzS0cyblpnNU9pWVlnZytoVUFDUm1BQVdzU0FyaVdpbmVvekxET0lSSWRMRUZpTU5xQzIzQy9LTXdoRlNpYTJ1UlJDRTVHeVVEZFFrL2xPRGVJQ3ZYMXdJa2VtUFcxTUdrckxrd2F4eUhkUlhGQzdVNU1CQ2ZLOHhHemdpOVFFRFJnRUlsWCtGZzVqc0EzbUlIWCtHREJKU1V0cGpwWEJJZDJiMXhGMFhmY0htdGFCZXFkN1luWEsyQU03MnJVMi9mcTBGbVI4Z0lXbTlaM3lOZVZzVit2d2JMR0tKZGM4SjZTbFR0YXRndEUvMG40anc2ZFJ2Qmp1TGZLRVZ1VG1XYVQ4MTF0a1duaWtwVTVXYXBLZjZGNi81bHRqMm50WUsxVUd0L1JuNURRWHJIV25EdDEvWEdoZE5ZSWxtRkg3OHdhZW5qVm1NRnpLelk1cndGbmRPYUMrWEJzODAzYWRWVFV4aUdlbTdkcFVjQkt4eW91aXAxVzJxS3hraGdVbGt5T3ZaSVkyTlpublpGcWg2RTg1NXpwdXhjOFdIc1c5N1dmTGx3QURBRWVEVXEyRFZZOE1BQUFBQUVsRlRrU3VRbUNDJy8+IDwvYnV0dG9uPlwiXHJcblx0XHRcdFx0K1wiPC9kaXY+XCJcclxuICAgICAgcmV0dXJuIGRpYWxvZ0RhdGE7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VGlja2V0SW5mb0JveEhUTUwoZGF0YTogYW55LCBkaXN0YW5jZERhdGE6IGFueSwgZnJvbUFkZHJlc3M6IGFueSwgdG9BZGRyZXNzOiBhbnkpOlN0cmluZ3tcclxuICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgdmFyIGluZm9ib3hEYXRhID0gXCI8ZGl2IHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4Oyc+PGRpdiBzdHlsZT0ncG9zaXRpb246IHJlbGF0aXZlO3dpZHRoOjEwMCU7Jz5cIlxyXG4gICAgICAgICtcIjxkaXY+PGEgaHJlZj0namF2YXNjcmlwdDp2b2lkKDApJyBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUnPlwiK2RhdGEudGlja2V0TnVtYmVyK1wiIDwvYT4gPGkgY2xhc3M9J2ZhIGZhLXRpbWVzJyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz48L2k+PC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiICBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+U2V2ZXJpdHk6PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC04JyBzdHlsZT0nY29sb3I6cmVkOyc+XCIrZGF0YS50aWNrZXRTZXZlcml0eStcIjwvZGl2PlwiIFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+Q29tbW9uIElEOjwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSdjb2wtbWQtOCc+XCIrZGF0YS5jb21tb25JRCtcIjwvZGl2PlwiIFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+QWZmZWN0aW5nOjwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSdjb2wtbWQtOCc+XCIrZGF0YS5jdXN0QWZmZWN0aW5nK1wiPC9kaXY+XCIgXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5TaG9ydERlc2NyaXB0Ojwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSdjb2wtbWQtOCc+XCIrZGF0YS5zaG9ydERlc2NyaXB0aW9uK1wiPC9kaXY+XCIgXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC0xMicgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PGhyIC8+PC9kaXY+XCJcclxuICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC0xMScgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+XCIrIGRpc3RhbmNlRGF0YSAgK1wiPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtMTEnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweCcgPjxzcGFuPlwiKyBmcm9tQWRkcmVzcyAgK1wiPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtMTEnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweCcgPjxzcGFuPlwiKyB0b0FkZHJlc3MgICtcIjwvc3Bhbj48L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgIHJldHVybiBpbmZvYm94RGF0YTtcclxuICAgICAgICB9XHJcbn1cclxuXHJcbiAgVXBkYXRlVGlja2V0SlNPTkRhdGFMaXN0KClcclxuICB7XHJcbiAgICBpZih0aGlzLnRpY2tldExpc3QubGVuZ3RoICE9MClcclxuICAgIHtcclxuICAgIHRoaXMudGlja2V0TGlzdC5UaWNrZXRJbmZvTGlzdC5UaWNrZXRJbmZvLmZvckVhY2godGlja2V0SW5mbyA9PiB7XHJcbiAgICAgIHZhciB0aWNrZXQ6IFRpY2tldCA9IG5ldyBUaWNrZXQoKTs7XHJcbiAgICAgIHRpY2tldEluZm8uRmllbGRUdXBsZUxpc3QuRmllbGRUdXBsZS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJUaWNrZXROdW1iZXJcIil7XHJcbiAgICAgICAgICAgIHRpY2tldC50aWNrZXROdW1iZXIgPSBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFbnRyeVR5cGVcIil7XHJcbiAgICAgICAgICB0aWNrZXQuZW50cnlUeXBlID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQ3JlYXRlRGF0ZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5jcmVhdGVEYXRlID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiRXF1aXBtZW50SURcIil7XHJcbiAgICAgICAgICB0aWNrZXQuZXF1aXBtZW50SUQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDb21tb25JRFwiKXtcclxuICAgICAgICAgIHRpY2tldC5jb21tb25JRCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlBhcmVudElEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnBhcmVudElEID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQ3VzdEFmZmVjdGluZ1wiKXtcclxuICAgICAgICAgIHRpY2tldC5jdXN0QWZmZWN0aW5nID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiVGlja2V0U2V2ZXJpdHlcIil7XHJcbiAgICAgICAgICB0aWNrZXQudGlja2V0U2V2ZXJpdHkgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBc3NpZ25lZFRvXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmFzc2lnbmVkVG8gPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTdWJtaXR0ZWRCeVwiKXtcclxuICAgICAgICAgIHRpY2tldC5zdWJtaXR0ZWRCeSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlByb2JsZW1TdWJjYXRlZ29yeVwiKXtcclxuICAgICAgICAgIHRpY2tldC5wcm9ibGVtU3ViY2F0ZWdvcnkgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQcm9ibGVtRGV0YWlsXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnByb2JsZW1EZXRhaWwgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQcm9ibGVtQ2F0ZWdvcnlcIil7XHJcbiAgICAgICAgICB0aWNrZXQucHJvYmxlbUNhdGVnb3J5ID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTGF0aXR1ZGVcIil7XHJcbiAgICAgICAgICB0aWNrZXQubGF0aXR1ZGUgPSAoZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGVsZW1lbnQuVmFsdWUgPT09ICcnKSAgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMb25naXR1ZGVcIil7XHJcbiAgICAgICAgICB0aWNrZXQubG9uZ2l0dWRlID0gIChlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgfHwgZWxlbWVudC5WYWx1ZSA9PT0gJycpID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUGxhbm5lZFJlc3RvcmFsVGltZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5wbGFubmVkUmVzdG9yYWxUaW1lID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQWx0ZXJuYXRlU2l0ZUlEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmFsdGVybmF0ZVNpdGVJRCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkxvY2F0aW9uUmFua2luZ1wiKXtcclxuICAgICAgICAgIHRpY2tldC5sb2NhdGlvblJhbmtpbmcgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBc3NpZ25lZERlcGFydG1lbnRcIil7XHJcbiAgICAgICAgICB0aWNrZXQuYXNzaWduZWREZXBhcnRtZW50ID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUmVnaW9uXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnJlZ2lvbiA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIk1hcmtldFwiKXtcclxuICAgICAgICAgIHRpY2tldC5tYXJrZXQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJXb3JrUmVxdWVzdElkXCIpe1xyXG4gICAgICAgICAgdGlja2V0LndvcmtSZXF1ZXN0SWQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTaGlmdExvZ1wiKXtcclxuICAgICAgICAgIHRpY2tldC5zaGlmdExvZyA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFjdGlvblwiKXtcclxuICAgICAgICAgIHRpY2tldC5hY3Rpb24gPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFcXVpcG1lbnROYW1lXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmVxdWlwbWVudE5hbWUgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTaG9ydERlc2NyaXB0aW9uXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnNob3J0RGVzY3JpcHRpb24gPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQYXJlbnROYW1lXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnBhcmVudE5hbWUgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJUaWNrZXRTdGF0dXNcIil7XHJcbiAgICAgICAgICB0aWNrZXQudGlja2V0U3RhdHVzID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTG9jYXRpb25JRFwiKXtcclxuICAgICAgICAgIHRpY2tldC5sb2NhdGlvbklEID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiT3BzRGlzdHJpY3RcIil7XHJcbiAgICAgICAgICB0aWNrZXQub3BzRGlzdHJpY3QgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJPcHNab25lXCIpe1xyXG4gICAgICAgICAgdGlja2V0Lm9wc1pvbmUgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMudGlja2V0RGF0YS5wdXNoKHRpY2tldCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLmNvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSdHRhbWFwbGliQ29tcG9uZW50IH0gZnJvbSAnLi9ydHRhbWFwbGliLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBSdHRhbWFwbGliU2VydmljZSB9IGZyb20gXCIuL3J0dGFtYXBsaWIuc2VydmljZVwiXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbUnR0YW1hcGxpYkNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtSdHRhbWFwbGliQ29tcG9uZW50XSxcbiAgcHJvdmlkZXJzOiBbUnR0YW1hcGxpYlNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIFJ0dGFtYXBsaWJNb2R1bGUgeyB9XG4iXSwibmFtZXMiOlsiaW8uY29ubmVjdCIsIm1vbWVudHRpbWV6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