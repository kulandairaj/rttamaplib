(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/http'), require('rxjs'), require('rxjs/add/operator/map'), require('rxjs/add/operator/toPromise'), require('socket.io-client'), require('timers'), require('moment-timezone')) :
    typeof define === 'function' && define.amd ? define('rttamaplib', ['exports', '@angular/core', '@angular/http', 'rxjs', 'rxjs/add/operator/map', 'rxjs/add/operator/toPromise', 'socket.io-client', 'timers', 'moment-timezone'], factory) :
    (factory((global.rttamaplib = {}),global.ng.core,global.ng.http,global.rxjs,global.rxjs['add/operator/map'],global.rxjs['add/operator/toPromise'],global.io,global.timers,global.momenttimezone));
}(this, (function (exports,i0,i1,rxjs,map,toPromise,io,timers,momenttimezone) { 'use strict';

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
                var headers = new i1.Headers({ 'Content-Type': 'application/json' });
                /** @type {?} */
                var options = new i1.RequestOptions({ headers: headers });
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
                var headers = new i1.Headers({ 'Content-Type': 'application/json' });
                /** @type {?} */
                var options = new i1.RequestOptions({ headers: headers });
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
                var observable = new rxjs.Observable(function (observer) {
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
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        RttamaplibService.ctorParameters = function () {
            return [
                { type: i1.Http }
            ];
        };
        /** @nocollapse */ RttamaplibService.ngInjectableDef = i0.defineInjectable({ factory: function RttamaplibService_Factory() { return new RttamaplibService(i0.inject(i1.Http)); }, token: RttamaplibService, providedIn: "root" });
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
    ( /** @type {?} */(window)).global = window;
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
            this.ticketClick = new i0.EventEmitter();
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
                            timers.setTimeout(function () {
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
                            rxjs.forkJoin(routeMapUrls).subscribe(function (results) {
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
                            rxjs.forkJoin(routeMapUrls).subscribe(function (results) {
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
                    timers.setTimeout(function () {
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
                var recorddTime = momenttimezone.utc(recordDatetime);
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
            function (map$$1, dirManager) {
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
                        map$$1.entities.push(pushpin);
                        _this.dataLayer.push(pushpin);
                        Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked);
                        map$$1.setView({ mapTypeId: Microsoft.Maps.MapTypeId.road, center: new Microsoft.Maps.Location(data.latitude, data.longitude) });
                        initIndex = initIndex + 1;
                    }
                });
                mapZoomLevel = map$$1.getZoom();
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
                        dirManager = new Microsoft.Maps.Directions.DirectionsManager(map$$1);
                        dirManager.clearAll();
                        map$$1.layers.clear();
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
                                map$$1.layers.clear();
                                map$$1.setView({ center: new Microsoft.Maps.Location(endLat, endLong), mapZoomLevel: mapZoomLevel });
                            });
                            $("#ticketmodal").on("hidden.bs.modal", function () {
                                dirManager.clearAll();
                                map$$1.layers.clear();
                                map$$1.setView({ center: new Microsoft.Maps.Location(endLat, endLong), mapZoomLevel: mapZoomLevel });
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
            { type: i0.Component, args: [{
                        selector: 'att-rttamaplib',
                        template: "  \n  <div style='position:relative;'>\n  <div id='myMap' class='mapclass' #mapElement>\n  </div>\n  <div id=\"ticketmodal\" class=\"modal\">\n\t\t<div class=\"modal-dialog\" style='max-width:370px;'>\t\t\t\n      <div class=\"modal-content\" style='line-height:1.2em;'>\n      </div>\t\t\t\n      </div>\n  </div>\n  </div>\n  ",
                        styles: ["\n  .mapclass{\n    height: calc(100vh - 4em - 80px) !important;    \n    display:block;\n  }\n  .modal{\n    position:absolute;\n  }\n  .infyMappopup{\n\t\tmargin:auto !important;\n    width:300px !important;\n    background-color: white;\n    border: 1px solid lightgray; \n  },\n  .popModalContainer{\n    padding:15px;\n  }\n  .popModalHeader{\n    position: relative;\n    width:100%;\n  }\n  .popModalHeader a{\n    display: inline-block;\n    padding:5px 10px;\n    background-color: #ffc107;\n    border-color: #ffc107;\n    position: absolute;\n    right:10px;\n    top:5px;\n  }\n  .popModalHeader .fa{\n    position: absolute;\n    top:-10px;\n    right:-10px;\n  \n  }\n  .popModalBody label{\n    font-weight: bold;\n    line-height: normal;\n  }\n  .popModalBody span{\n    display: inline-block;\n    line-height: normal;\n    word-break:\u00A0break-word;\n  }\n  .meterCal strong{\n    font-weight: bolder;\n    font-size: 23px;\n  }\n  .meterCal span{\n    display: block;\n  }\n  .popModalFooter .col{\n    text-align: center;\n  }\n  .popModalFooter .fa{\n    padding:0 5px;\n  }\n.modal-body {max-height:450px; overflow-y:auto}\n.tktForm .form-group {margin-bottom:5px}\n.tktForm .form-group div label {font-weight:500}\n.topBorder {border-top:#dbdbdb 1px solid;}\n\n.text-success {color:#5cb85c}\n.text-danger {color:#d9534f}\n#moreFormContentBtn, #moreFormContentBtn:hover  {    \n   \n    background:transparent;\n    border:0\n}\n#moreFormContentBtn:focus  {    \n    outline:0\n}\n\n  "]
                    }] }
        ];
        /** @nocollapse */
        RttamaplibComponent.ctorParameters = function () {
            return [
                { type: RttamaplibService },
                { type: i0.ViewContainerRef }
            ];
        };
        RttamaplibComponent.propDecorators = {
            someInput: [{ type: i0.ViewChild, args: ['mapElement',] }],
            infoTemplate: [{ type: i0.ViewChild, args: ['info',] }],
            ticketList: [{ type: i0.Input }],
            loggedInUser: [{ type: i0.Input }],
            ticketClick: [{ type: i0.Output }]
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
            { type: i0.NgModule, args: [{
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

    exports.RttamaplibService = RttamaplibService;
    exports.RttamaplibComponent = RttamaplibComponent;
    exports.RttamaplibModule = RttamaplibModule;
    exports.TruckDetails = TruckDetails;
    exports.TruckDirectionDetails = TruckDirectionDetails;
    exports.Ticket = Ticket;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL3J0dGFtYXBsaWIvbGliL3J0dGFtYXBsaWIuc2VydmljZS50cyIsIm5nOi8vcnR0YW1hcGxpYi9saWIvbW9kZWxzL3RydWNrZGV0YWlscy50cyIsIm5nOi8vcnR0YW1hcGxpYi9saWIvcnR0YW1hcGxpYi5jb21wb25lbnQudHMiLCJuZzovL3J0dGFtYXBsaWIvbGliL3J0dGFtYXBsaWIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHAsIFJlc3BvbnNlLCBSZXF1ZXN0T3B0aW9ucywgSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaWJlciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tYXAnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci90b1Byb21pc2UnO1xuaW1wb3J0ICogYXMgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5pbXBvcnQgeyBUcnVja0RpcmVjdGlvbkRldGFpbHMgfSBmcm9tICcuL21vZGVscy90cnVja2RldGFpbHMnO1xuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlci9zcmMvdXRpbHMvY29sbGVjdGlvbic7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJ0dGFtYXBsaWJTZXJ2aWNlIHtcblxuICBtYXBSZWFkeSA9IGZhbHNlO1xuICBzaG93TmF2ID0gdHJ1ZTtcbiAgaG9zdDogc3RyaW5nID0gbnVsbDtcbiAgc29ja2V0OiBhbnkgPSBudWxsO1xuICBzb2NrZXRVUkw6IHN0cmluZyA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XG4gICAgdGhpcy5ob3N0ID0gXCJodHRwczovL3psZDA0MDkwLnZjaS5hdHQuY29tOjg0NDMvUkFQVE9SL1wiO1xuICAgIHRoaXMuc29ja2V0VVJMID0gXCJodHRwczovL3psZDA0MDkwLnZjaS5hdHQuY29tOjMwMDdcIjtcbiAgfVxuXG4gIGNoZWNrVXNlckhhc1Blcm1pc3Npb24odXNlck5hbWUpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciB1c2Vyc0xpc3RVcmwgPSB0aGlzLmhvc3QgKyBcImF1dGh1c2VyXCI7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVzZXJzTGlzdFVybCwgdXNlck5hbWUpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TWFwUHVzaFBpbkRhdGEoYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgc3VwZXJ2aXNvcklkID0gW107XG4gICAgc3VwZXJ2aXNvcklkID0gYXR0VUlELnNwbGl0KCcsJyk7XG4gICAgdmFyIHVzZXJzTGlzdFVybCA9IHRoaXMuaG9zdCArICdUZWNoRGV0YWlsRmV0Y2gnO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1c2Vyc0xpc3RVcmwsIHtcbiAgICAgIFwiYXR0dUlkXCI6IFwiXCIsXG4gICAgICBcInN1cGVydmlzb3JJZFwiOiBzdXBlcnZpc29ySWRcbiAgICB9KS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmRUcnVja05lYXJCeShsYXQsIGxvbmcsIGRpc3RhbmNlLCBzdXBlcnZpc29ySWQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzdXBlcnZpc29ySWRzID0gW107XG4gICAgc3VwZXJ2aXNvcklkcyA9IHN1cGVydmlzb3JJZC5zcGxpdCgnLCcpO1xuICAgIGNvbnN0IGZpbmRUcnVja1VSTCA9IHRoaXMuaG9zdCArICdGaW5kVHJ1Y2tOZWFyQnknO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChmaW5kVHJ1Y2tVUkwsIHtcbiAgICAgICdsYXQnOiBsYXQsXG4gICAgICAnbGxvbmcnOiBsb25nLFxuICAgICAgJ3JhZGl1cyc6IGRpc3RhbmNlLFxuICAgICAgJ3N1cGVydmlzb3JJZCc6IHN1cGVydmlzb3JJZHNcbiAgICB9KS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFdlYlBob25lVXNlckRhdGEoYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgbGRhcFVSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvZ2V0dGVjaG5pY2lhbnMvXCIgKyBhdHRVSUQ7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQobGRhcFVSTCkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRXZWJQaG9uZVVzZXJJbmZvKGF0dFVJRCk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIGxkYXBVUkwgPSB0aGlzLnNvY2tldFVSTCArIFwiL2dldHRlY2huaWNpYW5pbmZvL1wiICsgYXR0VUlEO1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGxkYXBVUkwpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgR2V0TmV4dFJvdXRlRGF0YShmcm9tQXR0aXR1ZGUsIHRvQXR0aXR1ZGUpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciByb3V0ZVVybCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL1YxL1JvdXRlcy9Ecml2aW5nP3dwLjA9XCIgKyBmcm9tQXR0aXR1ZGUgKyBcIiZ3cC4xPVwiICsgdG9BdHRpdHVkZSArIFwiJnJvdXRlQXR0cmlidXRlcz1yb3V0ZVBhdGgma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIlxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHJvdXRlVXJsKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzW1wiX2JvZHlcIl07XG4gICAgfSk7XG4gIH1cblxuICBHZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlsczogYW55W10pOiBhbnlbXSB7XG4gICAgbGV0IGNvbWJpbmVkVXJscyA9IFtdO1xuICAgIGxldCByb3V0ZVVybDtcbiAgICB2YXIgbmV3Um91dGVVcmw7XG4gICAgZGlyRGV0YWlscy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICByb3V0ZVVybCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL1YxL1JvdXRlcy8/d3AuMD1cIiArIGl0ZW0uc291cmNlTGF0ICsgXCIsXCIgKyBpdGVtLnNvdXJjZUxvbmcgKyBcIiZ3cC4xPVwiICsgaXRlbS5kZXN0TGF0ICsgXCIsXCIgKyBpdGVtLmRlc3RMb25nICsgXCIma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIlxuICAgICAgbmV3Um91dGVVcmwgPSB0aGlzLmh0dHAuZ2V0KHJvdXRlVXJsKVxuICAgICAgY29tYmluZWRVcmxzLnB1c2gobmV3Um91dGVVcmwpXG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbWJpbmVkVXJscztcbiAgfVxuXG4gIGdldEFkZHJlc3NCeUxhdExvbmcobGF0aXR1ZGUsbG9uZ2l0dWRlKSB7ICBcbiAgICB2YXIgYmluZ0hvc3QgPSBcImh0dHBzOi8vZGV2LnZpcnR1YWxlYXJ0aC5uZXQvUkVTVC92MS9Mb2NhdGlvbnMvTGF0TG9uZz9vPWpzb24ma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIjtcbiAgXG4gICAgdmFyIGdldEJpbmdVcmwgPSBiaW5nSG9zdC5yZXBsYWNlKFwiTGF0TG9uZ1wiLGxhdGl0dWRlICsgXCIsXCIgKyBsb25naXR1ZGUpOztcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChnZXRCaW5nVXJsKTtcbiAgfVxuXG4gIHNlbmRFbWFpbChmcm9tRW1haWwsIHRvRW1haWwsIGZyb21OYW1lLCB0b05hbWUsIHN1YmplY3QsIGJvZHkpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzbXNVUkwgPSB0aGlzLnNvY2tldFVSTCArIFwiL3NlbmRlbWFpbFwiO1xuICAgIHZhciBlbWFpbE1lc3NhZ2UgPSB7XG4gICAgICBcImV2ZW50XCI6IHtcbiAgICAgICAgXCJyZWNpcGllbnREYXRhXCI6IFt7XG4gICAgICAgICAgXCJoZWFkZXJcIjogeyBcInNvdXJjZVwiOiBcIktlcGxlclwiLCBcInNjZW5hcmlvTmFtZVwiOiBcIlwiLCBcInRyYW5zYWN0aW9uSWRcIjogXCI1MTExMVwiIH0sXG4gICAgICAgICAgXCJub3RpZmljYXRpb25PcHRpb25cIjogW3sgXCJtb2NcIjogXCJlbWFpbFwiIH1dLFxuICAgICAgICAgIFwiZW1haWxEYXRhXCI6IHtcbiAgICAgICAgICAgIFwic3ViamVjdFwiOiBcIlwiICsgc3ViamVjdCArIFwiXCIsXG4gICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJcIiArIGJvZHkgKyBcIlwiLFxuICAgICAgICAgICAgXCJhZGRyZXNzXCI6IHtcbiAgICAgICAgICAgICAgXCJ0b1wiOiBbeyBcIm5hbWVcIjogXCJcIiArIHRvTmFtZSArIFwiXCIsIFwiYWRkcmVzc1wiOiBcIlwiICsgdG9FbWFpbCArIFwiXCIgfV0sXG4gICAgICAgICAgICAgIFwiY2NcIjogW10sXG4gICAgICAgICAgICAgIFwiYmNjXCI6IFtdLFxuICAgICAgICAgICAgICBcImZyb21cIjogeyBcIm5hbWVcIjogXCJBVCZUIEVudGVycHJpc2UgTm90aWZpY2F0aW9uXCIsIFwiYWRkcmVzc1wiOiBcIlwiIH0sIFwiYm91bmNlVG9cIjogeyBcImFkZHJlc3NcIjogXCJcIiB9LFxuICAgICAgICAgICAgICBcInJlcGx5VG9cIjogeyBcImFkZHJlc3NcIjogXCJcIiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgXCJhdHRyaWJEYXRhXCI6IFt7IFwibmFtZVwiOiBcInN1YmplY3RcIiwgXCJ2YWx1ZVwiOiAgc3ViamVjdCB9LFxuICAgICAgICB7IFwibmFtZVwiOiBcIm1lc3NhZ2VcIiwgXCJ2YWx1ZVwiOiBcIlRoaXMgaXMgZmlyc3QgY2FtdW5kYSBwcm9jZXNzXCIgfSxcbiAgICAgICAgeyBcIm5hbWVcIjogXCJjb250cmFjdG9yTmFtZVwiLCBcInZhbHVlXCI6IFwiQWpheSBBcGF0XCIgfV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICB2YXIgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IGhlYWRlcnMgfSk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHNtc1VSTCwgSlNPTi5zdHJpbmdpZnkoZW1haWxNZXNzYWdlKSwgb3B0aW9ucykudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBzZW5kU01TKHRvTnVtYmVyLCBib2R5TWVzc2FnZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHNtc1VSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvc2VuZHNtc1wiO1xuICAgIHZhciBzbXNNZXNzYWdlID0ge1xuICAgICAgXCJldmVudFwiOiB7XG4gICAgICAgIFwicmVjaXBpZW50RGF0YVwiOiBbe1xuICAgICAgICAgIFwiaGVhZGVyXCI6IHsgXCJzb3VyY2VcIjogXCJLZXBsZXJcIiwgXCJzY2VuYXJpb05hbWVcIjogXCIgRmlyc3ROZXRJbml0aWFsUmVnaXN0cmF0aWlvblVzZXJcIiwgXCJ0cmFuc2FjdGlvbklkXCI6IFwiMDAwNFwiIH0sXG4gICAgICAgICAgXCJub3RpZmljYXRpb25PcHRpb25cIjogW3sgXCJtb2NcIjogXCJzbXNcIiB9XSxcbiAgICAgICAgICBcInNtc0RhdGFcIjoge1xuICAgICAgICAgICAgXCJkZXRhaWxzXCI6IHtcbiAgICAgICAgICAgICAgXCJjb250YWN0RGF0YVwiOiB7XG4gICAgICAgICAgICAgICAgXCJyZXF1ZXN0SWRcIjogXCIxMTExNlwiLCBcInN5c0lkXCI6IFwiQ0JcIiwgXCJjbGllbnRJZFwiOiBcIlJUVEFcIixcbiAgICAgICAgICAgICAgICAvLyBcInBob25lTnVtYmVyXCI6IHsgXCJhcmVhQ29kZVwiOiBcIlwiICsgdG9OdW1iZXIudG9TdHJpbmcoKS5zdWJzdHIoMCwgMykgKyBcIlwiLCBcIm51bWJlclwiOiBcIlwiICsgdG9OdW1iZXIudG9TdHJpbmcoKS5zdWJzdHIoMywgMTApICsgXCJcIiB9LCBcIm1lc3NhZ2VcIjogXCJcIiArIGJvZHlNZXNzYWdlICsgXCJcIixcbiAgICAgICAgICAgICAgICBcInBob25lTnVtYmVyXCI6IHsgXCJhcmVhQ29kZVwiOiBcIlwiLCBcIm51bWJlclwiOiBcIlwiICsgdG9OdW1iZXIgKyBcIlwiIH0sIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keU1lc3NhZ2UgKyBcIlwiLFxuICAgICAgICAgICAgICAgIFwic2NlbmFyaW9OYW1lXCI6IFwiIEZpcnN0TmV0SW5pdGlhbFJlZ2lzdHJhdGlpb25Vc2VyXCIsIFwiaW50ZXJuYXRpb25hbE51bWJlckluZGljYXRvclwiOiBcIlRydWVcIiwgXCJpbnRlcmFjdGl2ZUluZGljYXRvclwiOiBcIkZhbHNlXCIsXG4gICAgICAgICAgICAgICAgXCJob3N0ZWRJbmRpY2F0b3JcIjogXCJGYWxzZVwiLCBcInByb3ZpZGVyXCI6IFwiQlNOTFwiLCBcInNob3J0Q29kZVwiOiBcIjExMTFcIiwgXCJyZXBseVRvXCI6IFwiRE1BQVBcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgXCJhdHRyaWJEYXRhXCI6IFt7IFwibmFtZVwiOiBcImFkbWluRGF0YTFcIiwgXCJ2YWx1ZVwiOiAxMjM0NTY3IH0sIHsgXCJuYW1lXCI6IFwiY29udHJhY3Rvck5hbWVcIiwgXCJ2YWx1ZVwiOiBcImNvbnRyYWN0b3IgbmFtZVwiIH1dXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XG4gICAgdmFyIG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoeyBoZWFkZXJzOiBoZWFkZXJzIH0pO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChzbXNVUkwsIEpTT04uc3RyaW5naWZ5KHNtc01lc3NhZ2UpLCBvcHRpb25zKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFRydWNrRmVlZCh0ZWNoSWRzOiBhbnksIG1ncklkOiBhbnkpIHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuXG4gICAgICB0aGlzLnNvY2tldCA9IGlvLmNvbm5lY3QodGhpcy5zb2NrZXRVUkwsXG4gICAgICAgIHtcbiAgICAgICAgICBzZWN1cmU6IHRydWUsXG4gICAgICAgICAgcmVjb25uZWN0aW9uOiB0cnVlLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5OiAxMDAwLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5TWF4OiA1MDAwLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkF0dGVtcHRzOiA5OTk5OVxuICAgICAgICB9KTtcblxuICAgICAgdGhpcy5zb2NrZXQuZW1pdCgnam9pbicsIHsgbWdySWQ6IG1ncklkLCBhdHR1SWRzOiB0ZWNoSWRzIH0pO1xuXG4gICAgICB0aGlzLnNvY2tldC5vbignbWVzc2FnZScsIChkYXRhKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoZGF0YSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuICAvL0dldCBSdWxlIGRlc2lnbmVkIGJhc2VkIG9uIHRlY2h0eXBlLlxuICBnZXRSdWxlcyhkaXNwYXRjaFR5cGUpIHtcbiAgICB2YXIgZ2V0UnVsZXNVcmwgPSB0aGlzLmhvc3QgKyBcIkZldGNoUnVsZVwiO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChnZXRSdWxlc1VybCwge1xuICAgICAgXCJkaXNwYXRjaFR5cGVcIjogZGlzcGF0Y2hUeXBlXG4gICAgfSk7XG4gIH1cblxuICBzdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgIC8vIHJldHVybiAgaWYgeW91IHdhbnQgdG8gcmVtb3ZlIHRoZSBjb21wbGV0ZSBzdG9yYWdlIHVzZSB0aGUgY2xlYXIoKSBtZXRob2QsIGxpa2UgbG9jYWxTdG9yYWdlLmNsZWFyKClcbiAgICAvLyBDaGVjayBpZiB0aGUgc2Vzc2lvblN0b3JhZ2Ugb2JqZWN0IGV4aXN0c1xuICAgaWYoc2Vzc2lvblN0b3JhZ2UpXG4gICAge1xuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KG9iamVjdFRvU3RvcmUpKTtcbiAgICB9XG4gIH1cblxuICBzdG9yZURhdGFJbkxvY2FsU3RvcmFnZShrZXksIG9iamVjdFRvU3RvcmUpXG4gIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9TdG9yZSkpO1xuICB9XG5cbiAgcmV0cmlldmVEYXRhRnJvbUxvY2FsU3RvcmFnZShrZXksIG9iamVjdFRvU3RvcmUpXG4gIHtcbiAgICAgIHZhciByZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgaWYocmVzdWx0IT1udWxsKVxuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKGtleSlcbiAge1xuICAgIGlmKHNlc3Npb25TdG9yYWdlKVxuICAgIHtcbiAgICAgIHZhciByZXN1bHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICBpZihyZXN1bHQhPW51bGwpXG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxufVxuIiwiZXhwb3J0IGNsYXNzIFRydWNrRGV0YWlscyB7XG4gICBwdWJsaWMgVHJ1Y2tJZDogc3RyaW5nO1xuICAgcHVibGljIERpc3RhbmNlOiBzdHJpbmc7ICBcbn1cblxuZXhwb3J0IGNsYXNzIFRydWNrRGlyZWN0aW9uRGV0YWlsc3tcbiAgICBwdWJsaWMgdGVjaElkOiBzdHJpbmc7XG4gICAgcHVibGljIHNvdXJjZUxhdDogc3RyaW5nO1xuICAgIHB1YmxpYyBzb3VyY2VMb25nOiBzdHJpbmc7XG4gICAgcHVibGljIGRlc3RMYXQ6IHN0cmluZztcbiAgICBwdWJsaWMgZGVzdExvbmc6IHN0cmluZztcbiAgICBwdWJsaWMgbmV4dFJvdXRlTGF0OiBzdHJpbmc7XG4gICAgcHVibGljIG5leHRSb3V0ZUxvbmc6IHN0cmluZztcbiAgfVxuICBcbiAgZXhwb3J0IGNsYXNzIFRpY2tldHtcbiAgICBwdWJsaWMgdGlja2V0TnVtYmVyOiBzdHJpbmc7XG4gICAgcHVibGljIGVudHJ5VHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBjcmVhdGVEYXRlOiBzdHJpbmc7XG4gICAgcHVibGljIGVxdWlwbWVudElEOiBzdHJpbmc7XG4gICAgcHVibGljIGNvbW1vbklEOiBzdHJpbmc7XG4gICAgcHVibGljIHBhcmVudElEOiBzdHJpbmc7XG4gICAgcHVibGljIGN1c3RBZmZlY3Rpbmc6IHN0cmluZztcbiAgICBwdWJsaWMgdGlja2V0U2V2ZXJpdHk6IHN0cmluZztcbiAgICBwdWJsaWMgYXNzaWduZWRUbzogc3RyaW5nO1xuICAgIHB1YmxpYyBzdWJtaXR0ZWRCeTogc3RyaW5nO1xuICAgIHB1YmxpYyBwcm9ibGVtU3ViY2F0ZWdvcnk6IHN0cmluZztcbiAgICBwdWJsaWMgcHJvYmxlbURldGFpbDogc3RyaW5nO1xuICAgIHB1YmxpYyBwcm9ibGVtQ2F0ZWdvcnk6IHN0cmluZztcbiAgICBwdWJsaWMgbGF0aXR1ZGU6IHN0cmluZztcbiAgICBwdWJsaWMgbG9uZ2l0dWRlOiBzdHJpbmc7XG4gICAgcHVibGljIHBsYW5uZWRSZXN0b3JhbFRpbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYWx0ZXJuYXRlU2l0ZUlEOiBzdHJpbmc7XG4gICAgcHVibGljIGxvY2F0aW9uUmFua2luZzogc3RyaW5nO1xuICAgIHB1YmxpYyBhc3NpZ25lZERlcGFydG1lbnQ6IHN0cmluZztcbiAgICBwdWJsaWMgcmVnaW9uOiBzdHJpbmc7XG4gICAgcHVibGljIG1hcmtldDogc3RyaW5nO1xuICAgIHB1YmxpYyBzaGlmdExvZzogc3RyaW5nO1xuICAgIHB1YmxpYyBlcXVpcG1lbnROYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHNob3J0RGVzY3JpcHRpb246IHN0cmluZztcbiAgICBwdWJsaWMgdGlja2V0U3RhdHVzOiBzdHJpbmc7XG4gICAgcHVibGljIGxvY2F0aW9uSUQ6IHN0cmluZztcbiAgICBwdWJsaWMgb3BzRGlzdHJpY3Q6IHN0cmluZztcbiAgICBwdWJsaWMgb3BzWm9uZTogc3RyaW5nO1xuICAgIHB1YmxpYyBwYXJlbnROYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xuICAgIHB1YmxpYyB3b3JrUmVxdWVzdElkOiBzdHJpbmc7XG4gIH0iLCJpbXBvcnQgeyBWaWV3Q29udGFpbmVyUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uSW5pdCwgVmlld0NoaWxkLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG4vLyBpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBSdHRhbWFwbGliU2VydmljZSB9IGZyb20gJy4vcnR0YW1hcGxpYi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTmd1aUF1dG9Db21wbGV0ZU1vZHVsZSB9IGZyb20gJ0BuZ3VpL2F1dG8tY29tcGxldGUvZGlzdCc7XHJcbi8vIGltcG9ydCB7IFBvcHVwIH0gZnJvbSAnbmcyLW9wZC1wb3B1cCc7XHJcbmltcG9ydCB7IFRydWNrRGV0YWlscywgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzLCBUaWNrZXQgfSBmcm9tICcuL21vZGVscy90cnVja2RldGFpbHMnO1xyXG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcclxuaW1wb3J0IHsgZmFpbCwgdGhyb3dzIH0gZnJvbSAnYXNzZXJ0JztcclxuLy8gaW1wb3J0IHsgVG9hc3QsIFRvYXN0c01hbmFnZXIgfSBmcm9tICduZzItdG9hc3RyL25nMi10b2FzdHInO1xyXG5pbXBvcnQgeyBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlL3NyYy9tZXRhZGF0YS9saWZlY3ljbGVfaG9va3MnO1xyXG5pbXBvcnQgeyBUcnlDYXRjaFN0bXQgfSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvb3V0cHV0L291dHB1dF9hc3QnO1xyXG5pbXBvcnQgeyBBbmd1bGFyTXVsdGlTZWxlY3RNb2R1bGUgfSBmcm9tICdhbmd1bGFyMi1tdWx0aXNlbGVjdC1kcm9wZG93bi9hbmd1bGFyMi1tdWx0aXNlbGVjdC1kcm9wZG93bic7XHJcbmltcG9ydCB7IHNldFRpbWVvdXQgfSBmcm9tICd0aW1lcnMnO1xyXG5pbXBvcnQgeyBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0ICogYXMgbW9tZW50dGltZXpvbmUgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcclxuaW1wb3J0IHsgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvY29yZSc7XHJcbmltcG9ydCB7IFBBUkFNRVRFUlMgfSBmcm9tICdAYW5ndWxhci9jb3JlL3NyYy91dGlsL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBzaGFsbG93RXF1YWwgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXIvc3JjL3V0aWxzL2NvbGxlY3Rpb24nO1xyXG5cclxuZGVjbGFyZSBjb25zdCBNaWNyb3NvZnQ6IGFueTtcclxuZGVjbGFyZSBjb25zdCBCaW5nO1xyXG5kZWNsYXJlIGNvbnN0IEdlb0pzb246IGFueTtcclxuZGVjbGFyZSB2YXIgalF1ZXJ5OiBhbnk7XHJcbmRlY2xhcmUgdmFyICQ6IGFueTtcclxuKHdpbmRvdyBhcyBhbnkpLmdsb2JhbCA9IHdpbmRvdztcclxuLy8gPGRpdiBpZD1cImxvYWRpbmdcIj5cclxuLy8gICAgIDxpbWcgaWQ9XCJsb2FkaW5nLWltYWdlXCIgc3JjPVwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoa0FHUUFhSUdBUC8vLzh6TXpKbVptV1ptWmpNek13QUFBUC8vL3dBQUFDSC9DMDVGVkZORFFWQkZNaTR3QXdFQUFBQWgrUVFGQUFBR0FDd0FBQUFBa0FHUUFRQUQvMmk2M1A0d3lrbXJ2VGpyemJ2L1lDaU9aR21lYUtxdWJPdStjQ3pQZEczZmVLN3ZmTy8vd0tCd1NDd2FqOGlrY3Nsc09wL1FxSFJLclZxdjJLeDJ5KzE2ditDd2VFd3VtOC9vdEhyTmJydmY4TGg4VHEvYjcvaThmcy92Ky8rQWdZS0RoSVdHaDRpSmlvdU1qWTZQa0VrQUFaUUNBZ09ZQkpxYUJaMmVud1dhQUpHa2FhQ25xS2tGbzZXdFpLcXdxYXl1dEYreHQ1OEJ0YnRkdUw2NnZNRll2cmpBd3NkVHhMZkd5TTFPeXJITXp0TkowTERTMU5sRTFxclkydDgvM0tuZTRPVTY0cWprNXVzMTZLZnE3UEV3N3FEdzh2Y3I5TG40L0RINm52WjJBQmdnWUZZL1NQODZCZFFob0JNQkFRc1BEa3BZSU9JTkFLQWVXcFRvaC8vaXhob0RVR25rdUFTQXdTQWVpUVNBTlpKa0VaT1VpcVFjUXVEV3c1TXVlY0NrRkFDbkQ0b0NoalQwZFRObmowazhlZnJrQVZRSWdKcktDQnJOZ1RScDBpRk5nNFRrTnVEajFCRTdyU1pkZWk1aFVDQXIwYlg4NnFLcVdLdENzdjZBNnU0aFd4WnUzMW9saTBOdWo2SC91dDQ5RVZidlc3NDIvQXFrKzYvb1lCRjVEWXRGM003c2o2MFVRMUYrVENHeTVNUGhMUGRJbTduQVdjNGRQSDkrRy9yZjZSMk1FeEpBblZyMTZzay9SZThnbmRrcmJRTzJiN1B1b2ZoaTdNQy9OUVFYanB1cDdoeUFNMjlPem1BNTg3M09YZTh1M2VrMTlRcldyeXZOcnMrN0Rjd1VDVXovdmlDOCtKNDdLQTdRd1hzbWV3enZoY2RQT0IvSFUrNy9zOTJYZ1h2aXJaY1BmOUJ4VjVHQUd1UjNXMW5JM1ZBZmdnd082T0JuQnFZZ0h3N29VWlJoaGNCZEtObUhKbXhvdzRUYWdXaWhpSWIxUlNFTi81V21ub3JLc2FnWGlTU1lTRU4wOXRGNEFZSGkzYUNqREJoeDE1K1BLOXFJWFdVUnp0QmhRcjRocVNSb05Bd0pBNHI2SElsa2tsTlNnbU1JVnJaMW5ENHpicmxCbDB2S0VHWUxQRDVuSmdaQVhsZmxpeThVS2VPYnFhRTVucHAwdXZEa1AxSGlHU2R6TTZRWEE1YjBhSWxualhyQzU0OXNNWXlwVDZDTEd0Q29sNDgyQmtPYktWYkt3YUMzZmNtQm9XSUNLS3FubHpycUFxa3QvRG1wcHgrQSt1QUxySzZBYUYyd2dwRHFxUmpVcW9LazlGQ2FhNGlYMGdvcEM1eG1PU3dJLzdKaXVPcXhLc1JZR3EvRE51c3NDNzZlNENvOTVpMjdnYldHVVV0QnRpWGNxcGE0eSs2S0xiUW9BT3VPc042MmwrcTZtcVpncmpnQnhodUN1aXFRQzVtNzZNQ3Jyd0xndHRndnV5VnM2NDZpQTN0UU1KVW8rS3VyZ21VMnpDeS9KMGo4QWNEaWRHdnhwL05HakxBSTkzSlQ4Y2U2WG9wdUE1bVpJRzF2S0lNVmNva1VtWkJzb2pHVGdIR09OZXVzNElJNVE3YXpDQzJUb0RBNkhnZk53ZEJnOWt3eXhTc0gvVERFUkR2TkxNZmNKQzJKd01kTUxWWUpSWWR3TTY1Uk5EUkExTFY0bldZSW1MVHQ5dHR3eDgzdzBqOXpmU0pkV3N1ajlsVlpIQzNPM0VnRUVCc0JkZ2ZEdEJRbGMxTjREQU9sSXBnYkpwVjArQk12RjJjRUFQOWpGd0M0R1ZXaHpjTGtUbVNPcitmSWNrdzRHM21SbnNMZWUwcGhaMm1MdHlBNE1XZXY0Wm5xaE0xY05zVkpCT0QzS1hsL0VSenVKTENPNlJRQ1lLMU03S3YvTGhMelNvVDZrcDdFd3lnNjdaZGZEOHZtd2d0WC9iNVRScDVGNC9wOHI2dnlzUVN2Ulp6bTUybGoreEtpajRyNjhhY0gvZlR2d2QrZ2lQcERKNzhuSi9NQitUSkRQeXMwUzN3Q2RGRC9CT0s4ZlFBQmN6ODduUmplaDVZQ0xYQTBEY3lYRDVMM3MwNXdEd3RUdTZBRWdDVENIOHh1R1NiOFg4ZkFzTGNTUGlBOExneEM1ajQ0QTk5MThCUzE4d0xyRU9pZmE4VmhnQm1KWVhVYWFMa3JHTzk0VkFtWEhVNzRpUUxpUlh1bTZzSVJXeWVoNXVDQmlScThBUWYvYjVnK0xreHhiVEFhU3g4Z0NMVDZjZEVtOTlQQkY4RllRMVg1QVhNNHNPRVpmZUZFSmF5UmFrUVNZaUNBT0VlYjZERjNxZkxod0tEWXgxQ2s4U0tCRE5VZjE4SEVRc2JDTHV0THBQZlNwY0l6Rm1RTGQyVE9JcWZCUjBlcUlvZVlsR1QrM2tSR1R6N3lrRG9SWmY0MnVZc3RtbElWa0F4REpndWtva2ErRWhXZ0ZFTmhWQ205KzhqeGxvNURKZjU0cVVucWRCS1lBQlFtRW1aNUhSN2VwWlRJQkI0Y2Rrbk1FVDNHbHRIMElDdVBVczFpVGdXYjJYeGNIWmpaVEpjY001b1N4QU0xdTRuSGUwQXptNTY0SkIvSTZjMTd1QktlMnR3ak8zdkp5RXB5TVoyQ29LY2l6VUhJUHNheUVBSmR6VGFuNmMrZnlUTVJDYjBST3hKMy84WmNMaUtpYlB4R1EyV2pUTlR0VTR6eG9LaUM2b2pRajNiVUVFU1V6MEpseWM2VjB1RjFjeFFuTCtqWmo0S3E1YVRxNUtWTHg3bFJPbjVqalR0ZDRnMHRTbzExaG84aktTVUtUdlhacUtEZVFhUzRBR2c4OXBhVHBLcmlvZmd3NmlqTjJWUE5PZlVPRDV1S1RUOGhWWkpZNjZ0NnFPUkJwNkpWYTM0RnFxWkI2eDhHSlZjOU5GQ21xQ0ZRWGZWUXNyTCtKanljeVJ4SjJTcEl0bFRPRTBRVmtHMW9NeUc4MGlneWUvVURYZnpxSTdkRTFnOXB3ZXFpa1BJZHpjTHFza29McldoSFM5clNtdmEwcUUydGFsZkwydGE2OXJXd2phMXNaMHZiMnRyMnRyak5yVzUzeTl2ZSt2YTN3QTJ1Y0lkTDNPSWF0eEVZTFphWmt0dlVHditZVkhlVmZhNXkyeWhkTkpHeXVucHlMbmE3ZE4zdFRrbTczclZSZDhQTEl2Q1M5MExqUGErRHpLdmU5NlMzdlVHaUFYelh1OXo1NW9lOTlwM1ZscGpiS1B6bTl6UHYvUytBNVN0Zy9kUzN3UHFWQVlJVEhOMEZENWk2RHRaTGdDUE1Od2hUR0M0SHZ2RFhDS3hoRE8rM3d4dTJNSWduckdIL2xqakRJSTRKaDFPODFITHdON3NyVGpHSkwyeGlHcU5ZeGpFZThZMTFMT0lPejVqQ05RYnlqbjJjWXlKL21NVXE3dkdKajR6a0lFZjR4MDh1OHBLUjlHTHJYc1FrV002eWxyZk01U3l6RThwTjdiS1l4NXpsNDVyNXpHaE9zNXJYek9ZMnUvbk5jSTZ6bk9kTTV6cmIrYzU0enJPZTk4em5QdnY1ejRBT3RLQUhUZWhDL3hiL3RJYkdTNUwvaW1oSWhLWFJla0FLcEJrQjJkOWtGRVNxbWJRZGJsZlo0WEhHTnM1a0QyQWZzeHhOejdPZVgzR1BxY0hxM3J2UU1xLzVXWFViNkVwcS9yMVZnYWxXRW1GdGJjNmo5dnA5c2lZRFZYK3RwR0N6VUdWbWJlNVVBMm5zTVREYkhFQ1Z5QmREall4Wk5oc01xcncyRk1qWkQyWnFXM0xkL0hZa3d6MVRrK0xqbytKMlNuTFRiY0Ruc3B1YjFYMzNGTEFyYjBSdXQ5N2I5aTYrR1ZkbEttcWozMGcwQk1EOW5ZMkJCNXlwNU4wMzVkcXI4QkswRmQxWk5YaFBHaDRDZzFPYkhSSjNJNnZQUy9GMnE3ZmpjUHA0cmtVK0I0c1A1dUhvQmprRUpLNXlLVEo4MWlULzY4dlRZUEw3Wkp6aUZtLzVHVmcrQnA0LzF1YzYvK1E0bUNFZTlIdDdpdVhwZnZIRmh4eHZsN3RiWDBBSG9VbDF2b2Viajd1YUpWdzZ4bVB1Y1dLNjhPRHpqT0hBdFczdEhoSThweG9QSTcxREtVazl0dk9sSHI1eTA5bU9iRFhlaU9vamZMdmFpVTUzNmdta3NKQURkU3IzeWU0V3dodndhckJPQXJIZVBWOFBmcEsyZy96aFJTbnZnbW5keVhwbnFaeCtnSElLaG9GRkM1VlZ3enQvNlNRbXN1ZTREZ0xvZFhraGx4NVI0ZXdiZ3VVTHYzclorMTNZbWd4cWw3NGRRaUtRbnArb1YrZ3dIVjhGdFYydTJHaEFQT2RCQjI0MG9SVmNOSmZvRVk1SUJlb3ZNL1ZvcVBUMG1XOUg3aSsvbklrSGFlRHFYbjN2QzFDdkhvM3M2N3QrKys0TGY5Wk1NSC96Mis5K2cwa2J1bFVJNVAvQ003OTE4bGVjekFCWVpoVW5mMDVSZXNzMlhTVERYVUtEZ0UzUU9jbm1mK0R6WFF1b2JOdDJlWXdFZ1JHb2F6S0RnYlMxZnVXaWdDTkFnS3NsZ2hkZ1pSdElnYlZsZlNaZ2dpY0lZN1pGZ2lVSWdpM29mTGFsZ2lzb2d6T0lnN0RsZ1NmQWdqckRnYTFsUExqamd6bElmSzVsZ3oyb2d5R0lmNndGZ3hsQWhFV0lmSytGaEVrb2dTaEFoYXJsaEUrb2hEK0lncW9saExMRGhWSG9lVitvaFZ0b2hmWUNoS1FGaG1HSWhsZG9odDZDaFNnQWhTN0RoS01GaDJlb2daK2pobEpqaDNNb2hnN25oMEdEaDNrb1hpNUFpSnZGaDFXb2g0cW1pQmFEaVBnQmlIWG9oWDFJaVh2b2hpdkFnNVhZWHdvbWlaUElpVXJEaG9maWlUZi9hSWtOSTRlWHlJaHRJWWp4QW9uN2c0a3RJSW9mSTR1akNJdU5hSXJlNG9xdnFJcDF3b3FmNVlncVFJZHRTSC82NG91MlFvcHZ5SUJ4Q0l6QmlJekpTSXpWWW96SGFJdXJ5SXhVWm8xcFNJM1ZDSTFIaDQzWnlJdWRpSXR2SW8ycGFJZzJnSXBNVjN0eDVJelI0bzBDUW83bFdGNW1CNHFWUW9zbndvN3RLSTRxWW8vM0tJVTVvSXU3eG8yWWgycjJKcEQ3Nkk3VFNJYi9pSkMwd1RvK3NIdVA1NEpEUjVBTDZZOTJwNDhWOG5zUHhnTVFPUnJLbUk0VVdaRUtlWkVHMldEWTU1RVd1UnNNYVV3bnlaRkdTSkkwbUNzYW1YWXFtWkovNTN4NEIzZUVvbm92V1pNMkdZM3ZWMEUvQ1pPdGh6SVBOd1FkS1pRS2xKTmpwRVJDdHBDVTN4ZHJvNlY5VDltVEVTbDVVMmxaS21HVkx1azlUQ2x3aytCVVVQbEFBOFZhWHpXV1Nua1lYMWxMWEhtVlNyR1dOSUtXWkRrV2NPa2pjaG1WRm1ob2Q4bDVlWmxvZTVsb1R2Q1hnQmwvYlRtWVN5Q1lodGs3aFptWTR6ZVVqQms5aS9tWVJZQ1lrcm1WamxtWlJrQ1ptTW1UbDdtWlNCbVpubWxDb0JtYUtEbVNwUGtTV2xhVXA3bWFyTm1hcnZtYXNCbWJzam1idEZtYnRubWJ1Sm1idXJtYnZObWJ2dm1id0JtY3dqbWN4Rm1jR0pBQUFDSDVCQVVBQUFZQUxMVUFGd0RGQUw4QUFBUC9hTEFiL2pCS1E2dTlPT3ZOdS85Z0tJNmpaSjRUcWE1czY3NHRLcDl3YmQ5NGZzMDhCT2pBb0hCbzZSbC94S1J5U1RMMmtNeW9kR3B3OHFEVXJGWm5uV0czNERDcksvdUt6K2dPR1dWT3U5L1Z0YWtOcjRmbGM3c2VqWmZROTRCTWZSRi9nWVpEZ3o2SGk0S0pEb1dNa1RXT2o1S1dRSlFCa0plY0paU2JuYUVlbWFDaXBobWtwNm9pcWF1dWFwK3ZzaHF0czdZVXRiZXp1YnF2dkwycnY4Q253c09peGNhZHlNbVh5OHlTenMrTTBkS0gxTldCMTloN21RSGJvZDNmeXBuaW5PSGxsdWZva2VycmkrM3VodkR4Z1BQMGV2YjNkZm42Yi96OWFmNEJQQ053NEIxeUJ1MFVUS2hsSVVNcURoOUtpU2l4RWFXS2JpaGlUS0p4L3lNaWhCNFBYZ3dwMGhISmtvbE9ndW1vRWdmTGxqWmV3b1FoYzZhTG1qYkhnTXk1QkNmUEpqdC9FdkVwTkFUUm9oK09Jb1UxY3FrUXBVNXBCWTNxY2lyVnExaXphdDNLdGF2WHIyRERpaDFMdHF6WnMyalRxbDNMdHEzYnQzRGp5cDFMdDY3ZHUzano2dDNMdDYvZnY0QURDeDVNdUxEaHc0Z1RLMTdNdUxIang1QWpTNTVNdWJMbHk1Z3phOTdNdWJQbno2QkRpeDVOdXJUcDA2aFRxMTdOdXJYcjE3Qmp5NTV0U1VDQjI3aHo2OTdOdTdmdjM4Qi9Dd2hwTzdqeDQ4aVQ2eDVBWExuejU5QnZNL2RZUExyMTY3Mm5iNnlPdlR0MkFzMjlpN2NPbnZyNDg4L0xiMGZQSHJsNmpOemJ5K2Y5dm1MOCtmaHhoOC9QLy9iKy9tSDUvUWZnZkFJTzJGNkJCcUtIWUlMakxjaWdkdzQraUYyRUVscEhZWVhRWFlpaGN2VkpkTitHNUdrSTRuRWRQdlRoaU9tSmlDSndKVEowNG9ySmFRY2ZqTmZKYUY5dkJPU280NDQ4RWpEQWowQUdLZVNQQWhScDVKRklDbUNGQlFrQUFDSDVCQVVBQUFZQUxPZ0FKZ0NBQUFrQkFBUC9hTHJjL3BBRkVLdTlPT3ZOSVFnZ1FIVmthWjRtcUU0ajZyNHd1YzVpYk4rNDhzMTBtLzlBRFc4NENScVBqeDJSNTBNNmM4dG84MGxGUmEvRnFyYWt4QkpyMjNERzY1Mkt6NHN1V1lwdUw5WnJzNXNLaDgvRjZ2cFNmai9xeVgxYmVYOU1nVnFFV0laVmc0Z3FpbFNNalZtUFNKSkxsRTZSalh5WU5wWkVuVWVhaUp5aExxT0lwa0dmUTZwQXFIK2xyaW1zTTdNNXNIcXl0eDIxdHJ5ZXZpcTd3Qm01ZXNVeHdvN0pMOGR3eE0wV3l5RFNMdFNUMWlUUGR0cTB5OUhlRGR4azRlSVMxT2N5MU9icTVJRHFITmp0NSs5ZThmTHArRUxzKzhiWS9zYjBDMmpCWGlLQzB3WWloSUF0d01JSUJxODhqREJ2WWhLQUZoMVV6TWdnLzJJVWpoMDNnalFnRXFUSFN5TVZsT1I0RWxUS2xrUG9pV3VZMGdETVFpbFhacno1SzZkQ2t4aHI4Z3hSTTJTdG9oby9JYjI0YWFtSFZFNHA2b3BhZ1J2VkM3bGtDajE0VmFETHJob0dhYVdxQnF5SkhXUE5walhMdHEzYnQzRGp5cDFMdDY3ZHUzano2dDNMdDYvZnY0QURDeDVNdUxEaHc0Z1RLMTdNdUxIang1QWpTNTVNdWJMbHk1Z3phOTdNdWJQbno2QkRpeDVOdXJUcDA2aFRxMTdOdXJYcjE3Qmp5NTVOdTdidDI3aHo2OTdOdTdmdjM4Q0RDeDlPdkxqeDQ4aVRLMS9PdkhuT3dBRUtFQkR3bDBDQjZ3UWM3bzErdmZ1QXZkYTdpNmQrVjRENDg5SzEwMFhQZm9CNnVBUFl5LzhPbDd0OCtlVGJocjh2UHp0YjgvLzhCZWdlV1BzRnlGOStUZ0Zvb0lIVE9XWGZnZ3Y2VjFSOEVGWllBSDBqUFdnaGhBaGFWT0NHRUVvNGtZSWdiaWdpUWgrV2FDR0dBVkdvNG9zZHFxUGhpeVdlZUU2S05KWTQ0RGt6NXZnaWk5Ymc2S09LRFZwRDRwQkQyZ2lNQUVJaXFTS1F4UnpwWkk0eEF1UGlsRGtXMlV3QVRXSnBvWks4Y09tbGoxQXVPYWFQVmZKeTVaa2dnbmxMQUd1eXVlSjd4WWdwcDQ3YU1IbG5pV25lSXVXZUROSlpUSnlBQ2lob21JUVdlbCtmczlpcEtJT011dkxubyt5NWVVdWlsSjVYcHBXWkduaG9tRjFTYWlrdmVuWjZYcVJtbW9yZHA5Wmd1aWVxVzdwNkpnRUxPUW9vck42VWV1ZW1BVTA2SmE3eHlFb2pyN1dHV2lPckU5bUtabFF5dnBxSUxFakNHZ2lzUlhEKzJKYXlFVDY3bEs0TFRsdFVzK0lSYTVhc283SlY3WHg1WWJ0alhpU1dPeGVGM3NLRmF3SUFJZmtFQlFBQUJnQXM2QUJoQUg4QUNnRUFBLzlvdXR6K01NcEpxNFhnNnMyNzcwQVFmR1Jwbms4b0JobnF2akMyem0xczMrU3NzM2p2VTZyZDdFY3NHb0pDbW5FWlF5WjF6S2pKK2RUVnBOaExkY3ZMZWlWVTd1NUxib1RGdTJzWmUwWUwxZXVsZXc2UC85cnpaTjF1dytlZmZENStmMDk3Z1NXRGhGV0hNSXFPSW9hTUdvbVBpNUlmbEpWVmtaY3ltcCtjblF1Wm4xeWhvcVdwSXFKZ3FxbW5oNlN1bTZ3cHM2QzFEN2VmdVE2eXUybTlETC9BU3NJS3hNVXJ4OGpLanJDQnpvclFmTW5LMUhiV3lzeEgwb1RZY2Q1LzRHdmF3T1JsNXNEYzZydm9aTzJ6NzJ2aWFQTng4YnpjdXZWNis1NzlWdHlURkhEWlB3b0JCNHJLWitxZ0Jta0tlekVVNHRERHVZb2VKbmJCYVBIL0ZVY1RwVDZlTUJkUjVET1JMMzZWUkxrZ3owcVd6Y1M4aERscXkweWFEQ3poeEJIbTVzNEdWbjRTVWVGVGFBcWpTSk1xWGNxMHFkT25VS05LblVxMXF0V3JXTE5xM2NxMXE5ZXZZTU9LSFV1MnJObXphTk9xWGN1MnJkdTNjT1BLblV1M3J0MjdlUFBxM2N1M3I5Ky9nQU1MSGt5NHNPSERpQk1yWHN5NHNlUEhrQ05Mbmt5NXN1WExtRE5yM3N5NXMrZlBvRU9MSGsyNnRPblRxRk9yWHMyNnRldlhzR1BMdGlDZ3JRQUNCVWFrRFlDN1FBRUNhUWY0SGw2Z2Rsa0J4SWtESDNzN2VmSUJZWGs3bjY2N3EvRHAwNkZ6Ulk2OWUvV3IwcnQzWDI0MXdIWHg0bzFUUFk4ZVBWWHU3ZU5yZnhvK3Z2M3ZTK0hidDArZWFZRDkvd0RtOXBSK0FZclhIMU85RllpZWV2NHBHQjlVN0RtWUhYMFNvb2VmVWdSV3FCeFVDV3FZSElOTC9lZWhjd2N1MWVHSXZvR29sSWdvRW5kaFVobU9PRjlUSjZMNElsSXN0dmdiaHpvT3AySlNPYlpZb2xJUm9qZ2pnajM2ZHFOUk1YbzRaRkkxanJpa1VFR2krQ1JTUlk3NEk1UkpGZ0JWa3hvZWFXS1hVLzVVNVloWEdwV2xoMlgrMUdXYVFvRlo0WlpJUmNrbWhVbUtTU1NaVUwzNVpaZDBHbVZuaFhDYTJhV2VTYTJwWVpzNG5la2hva2pKS1NHak9BMHFZYUU3T2FwaG9FSXBXaUZVbWxZSUtaTjhQbVdwZzVnMldxcFRweXFZS2syaFNzanBUNTVLR0ZXckJZNUs1YW8wSnZrcVRMRTZPT3RPdGJwNmE1TEQ0aVJwZ0RjRUpMc1RydkpSYXFpR3pWcFY3SGdDU010bHJ0cGlHT0FBenJMS1g3aDRHa2h1VklvMjIrMVUwNmxybG43dW9vVmJ2THVkeTB3Q0FDSDVCQVVBQUFZQUxMVUF1Z0RGQU1BQUFBUC9hTHJjL2pES1NhdTFJT2pOdS85Z0tJNGljSjFvcXE0WTZiNXcvTEYwYmQ5TUp1OThyK0hBb0RDaTh4bVBvYUZ5aVNzaW4wK21kSXB5UXE4OXFuWUxzV0svTUs1WTdBV2JSZU0wdFh4dWQ5VHdKZHROajl1RGMzcjd6cmZsOVdaOWdpdC9nRitEaUNlRmhsZUpqaFNMakZHUGxBK1Jra2VWbWptWWVwdWZsNTFabjVxaG9qdWtwYWQ3cVpTbXEyR3RqNit3THJLenRXQzNqclM1YUx1SXZiNGd3TUhEamNXQ3dzZHZ5WDNMUEFEUzA5VFYxdGZVenRyYjNOM2UzK0RoNHVQazVlYm42T25xNit6dDd1L3c4Zkx6OVBYMjkvajUrdnY4L2Y3L0FBTUtIRWl3b01HRENCTXFYTWl3b2NPSEVDTktuRWl4b3NXTEdETnEzTWl4LzZQSGp5QkRpaHhKc3FUSmt5aFRxbHpKc3FYTGx6Qmp5cHhKczZiTm16aHo2dHpKczZmUG4wQ0RDaDFLdEtqUm8waVRLbDNLdEtuVHAxQ2pTcDFLdGFyVnE0OEVhTjNLdGF2WHJ6d0xpQjFMdHF6WnMySFBxbDA3TmkzYnQyWGR3cDByZCs3YnVuYlg0czJMZGlmZnR3VDIvaDBiMk85Z3RZVjFIa1lzK0hEaW5JdlBQc1laMmV6a201WExYcmFabWV6bW1wMEpOeDc4bVdab3NhVm5uaTZRV3VicTFqRmZqLzRMRzZac3c2RnJ2MXc5WURiZjNyZzdBMWQ4ZWpqazRyN3pHcWVNUEhqbTVaaWJFdzhObmJQMDQ5U1QyNjBPK2pyejdNNHJDOUErZDN6NHlPYW5kMDZQZlQxNXVPeS91eisvT0g3MDBQYXQ0My8vTm4vMy9WMzBIZWFmYWFjTnFGcUIvTEVWUUlKckxSamdZQTZxbDFtRTdVM0lvRm9VeW1maGczOWxlRjluSHVvSDRvVm5oZmpmaUJ6eVpTS0JvYTE0WUlza211V2lhNmZOR0Z1Tk1jYVZJMWs5cmViVEJsb05JQ1FCUkJJSm1HNHZKUUFBSWZrRUJRQUFCZ0FzWUFEdUFBZ0JlQUFBQS85b3V0eitNTXBKcTcwNDY2MEEvMkFvam1ScG5oa1FCQjdxdm5Bc3orWnF0M1N1NzN5dnFUYWJiMGdzR2wzQkpPN0liRHFmd0dSdytheGFyekNwbG9YdGVyK2FyUmhNTHB1allpblZ6RzRiMC9DMWUwNlBvZUZiZVgzUEIrSC9lbjJDZ3hKM2YyS0JoSXFEaG9kcGlZdVJjNDZVSzVLWGZJMlZqNWlkYlp1Z2tKNmpScHFnZUtLa3FqdW5yUUdyc0VXdXJxbXh0aVNtczRlMXQ3MGJ1c0M4dnNNVHVjQ1V4TWtmeDh6Q3lzbkd6SlhPejc3UjBzalYyaEhYMklEYjRBN2V4OVRocTkzamNlYm02T2xqNitIdDdtcnc0Zk8wOWR2eTkxUDUydnY4TFBtckJwQmZ1WUdYQ3Q0N2lEQlN3RkFOb1QyY0ZsSGlSRWNNS3pLNmlGSC80ekNPamp4K0JJbEt4Z0FDQWtSYVVaZ3VJNFVBQldJU2VLVVNDa2t0TGlrUWlNbHpRTTBxTE1uRmdNbXphTXFmVG02dXlEbGhaOUdpTTVFMkNkcEtob0NuV0FzTW9DbTFGRWVtRXJLSzlkbjFDTldRTVFhSVhYdTBiSkd6NnJLc25SdlZyYXg1SnVmcTNXcVhDRng2Y3ZVS2J0dTN4OStsTXB3SzFvdXk4SkMvWUNGY1hVeTVybU1ld1JKVDNxejFzdUZaVmpsdkp1dVpSOEhJRDRpS1hzeTF0R21LYVZjdkp1ejY4eUVacW1XdkpWRDd5TGNZaW5XTGJkMzdNUnpjd3VrV241cEhjL0xoeTUzY1FmMWc4bk9zcEtNM3VUSGp1bGp0VjZnL1VPdjlLVzN3cEhLWEw4QWJmU3p5NjJNU2QrOUpmZm4yOUZVRlh6OC8veVhyLy9GbDUxOG4rM21IMzRDZEFMamVlUWhHRWg5UEJ6WW9DWHp4OVNmaElQWjVKK0NGaWhUb25ZVWM4cEhoZFF5RzJJZUh6MFZvb2lBS2xsZmlpbldnbUp5S01PNUJJWDgxWXZoZ1RCdm1TTWVONWZrb3lJalB2U2lrR1RJS1IrT1JiQkNaSEloTWtwR2tia3RHU1VhTEgxcEp4NDZkYWVrR2tONTU2WWFUd2hrcDVoVmdwbmhtazF4Q3VXWVZVOHJXNDV0WFlIbWRtM1EyRWVkcWMrYjVoSjB6K3ZrRm1icVpLYWdSYVFaNktCYUV5b2Jub2tQc0tWcWZrTXJTWnFWV1NNcVpvWmp5QUtpU25WWnhhYWhPQ0tEcFlsV1NPa1FBaWE3MnFLcWVuam9XckZldytoeXRqSjVVS0s1ZDJDcGFxcnd5WVNwbnJ3WkxoSytDQVd0c0V5UEQ2bFhzc3JJMG14V2wwRmFCTEZUVnRpSEFqWnhtVzBXenlucUxoYW5QaW90Q0FnQWgrUVFGQUFBR0FDd25BTzRBQWdGOUFBQUQvMmk2M1A0d3lqYkl2RGpyemJ2L1lDaU9rVkNjQXFtdWJPdStzQmdRNTJuRmVLN3ZmQjRNdFdDcVJ5d2FqMFZUY0JsQU9wL1FhR2EyckE2azJLeVcrS3Q2QzgydGVFd0dBYi9lVzNuTmJpc0VOUFIzNks3Ym9WUTVXbjN2KzNWbmVuSlhmNFdHS25DQ2ltR0hqWTRZZVlxQ2ZJK1ZsZ2FCa291WG5JMUttcHFVbmFOdGthQ2FkS1NxWkptbm9LdXdXNSt1cm9TeHQwaW10SzZNdUw0N3JidXVvci9GTExQQ3dyM0d6REp4eWRERXpkTWF3ZERDcWRUYUU4algxOHZiNFF1NjN0QzI0dWhkNWVVRTRPamEzZXU3Qk5udjhNL3l5ZlgyMCtUNXRlNzRNYlAyRDFRN2dlRVNGY1NHY0p1L2haTE9OV3hHRUtLZ0FRRW40b3BuY2Y5U1JvMnhIbmFVc3c4a3Jvb2p2MGcwK1F0bHlpVUhXVGJqK0RJSVBablVSTllzaWZNWHpaUXJlekxUQ1RHbTBHMC9DOTQ4S282b3ZLQk1zUUE0a3JRY3hxaGpBQVFJTUxXSTAyUkdzV2JSdW5VclZZZzh4VG9weTdackVYeFcxVzRoeTdiczJYVmg1VUtoVzVmdEVaZVM4dXAxd3Jkdld5TlZCYVVkek1XdzQ0OHhBS09CeXJoSTRjZUh2Y0pWSkxpeVpjeWc3d1plN0RuSFpkQjkzZmI0V29CMGFSeW9ZME9HVVpYeWF4Mm5aUnYrdTJmMjdSZTVkUnRXemNPZjY5OHVnZ3ZmalhpSmJlUTRsQyt2UzV6SG1hdlFrVWlmYnRmSUROL1pZWE5IWFQzOHJlM2p6UThkajFwOU1mVGN5N3RYQlgvNi9GL3NRY3UvMzZuK2N2Ny91T1NIMlg0QVd1S2ZjQVFXK01pQnVpa0lpNENQSmVqZ0lRektOcUVxRURvbTRZVi9WQmdiaDZOazZCaUluWWlZR29tWGVOZ2VpcGFZU0IyTGxhZ1lHb3lQdUpnWmpZM1kyQjJPRk9wb0ZvK0grTWdWa0liSWlCbVJoZ2k1SVpKakNNbGtoejR1K2FRV1NrNTVoNUdQV1hsSGxWclc0V1NYYm1BNUhKaHVmRW5tR21JeWQyWVpYSzZabFpsdWlwSG1pM0UyNldPZGIrb29KWjZyM2NtbkZuUFc5U2VnVVE2YUJaeUdQaEZvV1hzbUdnT2lqaDZ4NkZhTlJ1b0NwSlo2NVdlbWtoYks2UkdZZm9xYnA2STJwbU9wM3VtSktoR0xWcnFxRENhNittb0lZc282SzZ6c0FXRHJyYmhPdHl1dklqRDRLN0FqSUVoc0ZPZ05lNndLR1BvcHV5eXp3em43ckFxRjZUcXRHSXhLZXkwTDFvYVFBQUFoK1FRRkFBQUdBQ3dYQUxvQXVnREFBQUFEL3lpMTNQNHd5a25sTURqcnpidi9ZQ2lPcERaVWFLcXV6bFcrY0N6UDJjbmVlTzdTZk8vRHRweHdPTm45anNna2djaHNNb3pKcURTMmRGcUYwS2wyNjZsZXY2c3NkOHoxZ3M4VU1Ya2ROYVBmRHpWNzdvUGJJWEs2WG5idlAvZUFkWDU5ZVlHR0lJT0VoNHN2aVhlRmpKRUdqbmFRa291VWNKYVhocGx2bTV5QW5taWdvWHFqWjZXbWM2aGdxcXRyYnExRXI3Qmpzck5ZdHB5NHVUaTF1MXE5dml6QXdWTER4Q3JHeDBsQnlqck5qTS9RTjh6U1NRSGEyOXpkQVFMZzRlTGpBZ1BtNStqcDVnVHM3ZTd2dmRmWTgvVDE5dmY0K2ZyNy9QMysvd0FEQ2h4SXNLREJnd2dUS2x6SXNLSERoeEFqU3B4SXNhTEZpeGd6YXR6SXNmK2p4NDhnUTRvY1NiS2t5Wk1vVTZwY3liS2x5NWN3WThxY1NiT216WnM0YytyY3liT256NTlBZ3dvZFNyU28wYU5Ja3lwZHlyU3AwNmRRbzBxZFNyV3ExYXRZczJyZHlyV3IxNjlndzRvZFM3YXMyYk5vMDZwZHk3YXQyN2R3NHpJQ1FMZXUzYnQ0ODBiMXhyY3YzNzErQS9jRkxMandOc0tHQ3lOT0hIZ3g0OEZRSHl1T0xMa3g1Y3FRbjJMMjYzaXp0czZlUVc4V2pabDBaZE9TVVQ5V3paaDFZdGVHWVUvVzdObWJiTUczTGRPdXpTMDM1OHU4UHdNUDdqdXowK0M5aC9NdS9sZDViZWEyblllV1BwcDZhZXVuc2FmV3ZwcDdZZ0RRdVlIM2Juajg3dURtanlNUGtMN3BldmJodDdWbituNyswdnJ4dGRsWGlwOTg0ZjFKU2ZWM0htOEFJaVdnZXNnVmVOU0I3cTJub0ZFTTB1ZGdmdkQ1SjlpRFJVVjQzNFFXQm9ZaFVScnl4K0dBdFgwNFZJZ0Jqb2dnZWhTYUtCU0tCcTRuMVhzenlpalZYYUVsQUFBaCtRUUZBQUFHQUN3bkFHWUFkUUFBQVFBRC8yaTZ2Qkl0eWttcnZUaHJGa2daV3lpT1pLa01SVm9JWnV1K202Q3FCQVRmK052TjgyRG53Q0FHeGVPQmhNaWtvOGdrc0pSUTNJN1ovRVd2SkJsMWU4UjZOZFB0OXZrdFU0aGlzZFBNWm1qVDhGcWJqWWJEdS9QcjI4NG41NVVlZklJRmNuOUllNE44UG9aQVlZbURlSXd1aUkrRGZwSWtqcFdKaFpnamxKdUppNTRibXFHVmw2UVZvS2VQYTZvVnBxMmJuYkFOckxPYmtiWUdBWFc1czZtMnNzQ1Z0YndHdU1XY1ZyeSt5N203dzRIUXA4S3d5dFYyeDd5LzJxTE4wOStoMHRqam9kZXEzdWZiNGJERTdHTGxxdG54VE9tazYvWmI3dS9VKzJPUVNhZ1hqNERBTXdEdkhhUUE3NXpCaGF2KzJlc0hrWUUrYmZNcWNwRDRUZitqQmdFY2wrSHpHSUdnTVpJaG5rR2ppSkpoU0ZvdHN3QmpHVFBXUlVVMVRUUk1rM01TcXA0dmJoWjVDTlRGVGhVMGk4YTRvelRIemFSTlU0Yk1HTFVFSXFKVmdhQVptVlVuQWF4ZHc0b2RTN2FzMmJObzA2cGR5N2F0MjdkdzQ4cWRTN2V1M2J0NDgrcmR5N2V2MzcrQUF3c2VUTGl3NGNPSUV5dGV6TGl4NDhlUUkwdWVUTG15NWN1WU0ydmV6TG16NTgrZ1E0c2VUYnEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQWd3c2ZUcnk0OGVPNEF3UUFBQmlBY3VYTSt6NmZ6dGY1OU9mUjhWN2ZucDJ1OWUzWHU4Y0ZUeDZxMmZMbHhhLzlqaDY4ZXJUdDQ3OG55ejQrK2ZsaTdldkhYN1crZnZUZi9DbjEzNERteGVRZmdlV0pkU0NDN3VYSG9Id0tQaGpmV0JLMkYyQk9DMWFvSElVYTNoZGhoK0J4Q09KMUlvNkkzWWNtUGxkaWloZldsS0dHSzVyWW9vRXBVdWRnalFXMjlLS0VNOGFFNDRZMzF0Z2pTanRLR09PSVE1SlVKSU5Ka3ZSamprVCsyS1JIVHg0SjRwUVZMY21nbFIyT3BTV0JXRlpVSllvc2Nna2ptVEthV2FHYVJxS0pKSnNQZWlrbG5GdTZlU1dkQ01xSm81NUM0a2tnbjJVR21TS2dhUXI2cHAxZCt2bGZtRm51V2RhWDlqR3E1SWhxUVVvZVc1YUc1MWFtUUw1bHFhUktRVnJYa3FEMnQyTmVHVmJIblYvc0JlWmNxUllrQUFBaCtRUUZBQUFHQUN3bkFDb0FkUUFBQVFBRC8yaTYzUDR3eWtsTkNEWHJ6YnRYQWtGOFpHbWVJRkdzQXVxKzhDSU1hejNHZUw0RmRPMFB1cUN3RVFqNWpnWE1jSWt6SW84M3B0VEVlMXFWMHl6SGFVVkd0V0JKdGR0dGhjL0VnWXBNUnJzdFBUWVorQVp6NVdSc2ZUbkd5Nzk3UVhkK2JIcUJPUUtFaElDSE9HdUtjbWFOT1FHUWZvYVRMNCtXWFhTWk1aV2NoWjg0Y2FKUGpLUlVwMlNTcWlpSnJLaXZNSnV5Tlo2MEpyRzNSNWk2SHJhOXVjQWZvYjArdjhVYnBzaXB5eHJIeUN6UUpNM0kxU1RUUDlrZXZOdkszUkxDdDgvaUVkL1Q0ZWNQNUxMbTdBN1MwNjd4RXRlOTloWHp5TVQ2RC9odXJmdG53QjByZUFUVElhdEhzSUhCVXdqLzhldkZzT0dDaDZjRzZwdDR5LytmUlFVQlpXblV0ODNHeHdjS0taNTBnSkZUUkgwcE82NTBXSExGeUhnY1pYbjhHSkxWVFhZNUQ4NWswUE5VeFk4MVZ3eVZrWFNueFphY2ZwNExDbkdwQXFpV3BJcWpLdXFsdmFLaWpqYmtLc3FxZ1pnNnpXSlY1TFFoV3BkYTJhMWxJM1lsV1RadGg0THRRaUF1d2J0UTZwbzFzTmVINE1FS0NPVkZ6SlJOWDhZYURCSTRESmxCek1XVldSNFo0TGZ5c2NlWlA5Q2dITHEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQWd3c2ZUcnk0OGVQSWt5dGZ6cnk1OCtmUW8wdWZUcjI2OWV2WXMydmZ6cjI3OSsvZ3c0c2ZUNzY4K2ZQbzA2dGZ6NzY5Ky9mdzQ4dWZUNysrL2Z2NDgrdmZ6NysvLy8vL0FBWW80SUFFRmlqYkJia0JjRUVBQU5pbTRJSUl6dllnaEJjMEdOdUVGRmI0R29ZWkx0Z2FoeDB1YUdGcUlaYlltVVVnbWlpaWFTbXFDR0ZwTHNaWVdZc3hVamlpVlRUV21PRmdPdlo0NDBrNTl0amhURUVLMmVHUEVobXBKSXBLTm5uaUpFVTZXU0tTMlVocEpUdFJXbWtpbGJwa3FhV0tWWDc1SlplZmVDbW1pMlFlWXVhWkx0S3lKcHRidWdubm1ITE9hV1dhZTd4cFo0WjQxckhublhYK3FXU2ZiK2dwYUlTdkhOb2tvVzRZS2lpamFEajZKNlJvS0xxa0xwWUtTV21qbWNhNGFhR2R4cG1OcEYrZVE2cVVuMElacW9iMm5DcGtRNjU2eXVTaHFRSVQ2NUZMN1duV3JheWFkV2F0cG1vSkxFNVNzcmdvYW1zT0M2dU9HTXArRkNWc0tqWkxaSWpTTGdYaWJSQldPNWlDMmhLVUFBQWgrUVFGQUFBR0FDd1hBQmNBdWdDL0FBQUQvMmk2M1A0d3lrbXJ2VGk3d0lVWUlDR0tSV21laGFpdGJPdStNSVhPZEYzRWVLN3ZzTzNYdktCd09Qd1pUd0dpY3NuRUhKL0pwblE2ZlI2ajFLeVdaelZpdCtBd3EvdjdpczlvQ2RsblRydmZhMXY3VFJmSGEvTzZQbnVuNWZlQVRIMHpmNEdHUW9Nb2hZZU1PWWxJalpGRmp5V0xrcGNhbEpXWW5ER2FCWmFkb2hHZm9hT25ES1dvcXhXcXJLOFFud0t3dEEyeXRiZ0d0N20wdTd5dnZyK3J3Y0tueE1XaXg4aWN5c3VYemM2UjBOR00wOVNHMXRlQTJkcDYzTjEwbndQZ3o1cmo1TkxtNk9tVTUrdUg0dS9WNnZMWTlQWGI5L2plK3Z2aC9mN2N4QXRZWnlCQk9BQVAya21vRUl6QmhtYytFWUNZUmlKRk5CWXZMcVEwVWY5am1Jd2V0NEFNeVVkVFI1SWxPYUxVTW5KbGs1WXVsOENNU1dRbVRVUW1iNzdNcVZNbXo1NDFmd0xGcVhMb3BLSkdnM3k2a1ZUcHA2Wk9OVUhsOG5TcWpxVldyMWJONm1rcjF4Y2d3b29kUzdhc3U2OW8wNnBkeTdhdDI3ZHc0OHFkUzdldTNidDQ4K3JkeTdldjM3K0FBd3NlVExpdzRjT0lFeXRlekxpeDQ4ZVFJMHVlVExteTVjdVlNMnZlekxtejU4K2dRNHNlVGJxMDZkT29VNnRlemJxMTY5ZXdZOHVlVGJ1MjdkdTRjK3ZlemJ1Mzc5L0FOUURnUUx5NDhlUElreXRmenB3NXhlYlFvMHVmanZ3NTlldllzM093cnIyN2QrWGN2NHNYSDM2OCtlemx6NnVYbm42OSsrWHQzOHMzSG4rKy9mcjI1ZVBQNzM0L2YvVkUvdjFuWG9BQ2tnZFJnZndSaUdCM0NpNkkzb0VPNmdkaGhQMU5TQ0dBRmw0NFlJWWFHdGhRaHhoK0NPS0dJbzdvb1VJbWp1Y1JBQ3kyNk9LTE1NYm80b0lVSlFBQUlma0VCUUFBQmdBc0p3QW1BQUVCZkFBQUEvOW91dHorTU1wSnE3MDQ2ODI3R29JbmptUnBubWpLQ1VWQkNJRXF6M1J0MzFXcnZ6SHUvOENna0RIUUdYbkRwSExKdkFTTVVCZXNTYTFhZ1lSbzlIWHRlcjhpbGxiTEJadlBhRVoyUEFhbDMzQnFrVTBmOU9MNHZPMUo3eVAxZ0lFbGEzMStJWUtJaVJkaWhZMTJpcENSRFlTTmhXV1NtSUp6bFpVRW1aOTZmSnlWaDZDbWFaU2pkSjZucldhaXFuMTNyclJXcWJGYUE3VzdWWXk0Ykx6QlM3Qy9XcVhDeUQrYnhWdkp6ajdFekVheno5VXF0OUl1MXRzcXZ0azYxTnppSGRIZnV1UG9Ic3ZmTGVudUcrWFp4Ky8wRTlqU3JQWDZFZDdzNGZzQURiQ0RjaTZnUVFQci9CMDBHRTlhd1lYNzdqSExCMUZmdjIvektyNGJlRVQvNDc2RTMvNTVGTmVRMmNPUjZTUXlFNG5TMmtWNUxkK3AvRVV4cGppUTJWamFURmF5V00yZDFtYiswZ2swMkV1SFJjVUp4WldVRzA1cEdac0s2MGxUYWxDTzRLdytvNHJycDFaZVMyTVIvV3JxcVVteXlMakc4b3JXVlZoVlVkdWVVcXVLclZ4VGIwZU52UnZwNkZtK3RPaXEyZ3M0a2RsaWNRdExFc3pKcnVKSWVUa2xmcXpJcjAvS3BoaHpJb3c1eitGZkp6dEQwbHlKY3drQUFFVFhpRXdLQ0lBQXNGWExzRndWQ096YnFXV2Z3SnIxeCt2YnVIV1RvTjNWTmZEakFYSUw3eUNBdFN6YnlKRXZEek13ZEkzZjBZOHJuNzdoY3lQajJiTnY1NDRoZ0hNZGsxVmdEeCtkL0Fybmp0V3puei9ldlFYdlVFeVRtTTgvdWYwTS93SGdwNDF2L2ZWWDMzOFNtTmVJZmlNVTZDQ0NHRmhtSFEzck9VZ2ZoQmZnRko4S0ZuWjRJSVlPS0FoRmVpbFUyS0dCSUZJZzRvQSttSGhpZ1NsU0lBYURJcmo0SW9veFNrQWlDamJlV09DSE9RYlJvNDgvQnFuRWtFUVdhYVFRU0NhcDVKSTROT21rZzBCQ2VZS1VVejVvSllWWmR1bmZsak5nNlNWL1ZZSlo0NWhUbG1rbUIyS2l5ZDZhOHJsSnBKcHdhdENtbk1qUldXZDVlUHFvNTU0VjNOa25jSUNhSU9pZ1h4YmFJS0luL3Fsb0JJY2krdWdJa2ZicDZLUVBNT29ocGg1VWl1YWxuRDdnYVplaGxxQnBlS0NXQ3NHb1JLcDY1YW5CdVhvQ3JEVEtPZ0dyTU5vYUo1NnA2bW9CcnRuNXl1V253bDQzWnJFM0FOc3JzaXdaNE1wc2k2MCtTMkNqMGdaeFlyVk1Vb250RUZKdXE4U0YzaWJSWTdoTW1FZ3VGY0F0ZXk2UHNUR2JBQUE3XCIgYWx0PVwiTG9hZGluZy4uLlwiIC8+XHJcbi8vICAgPC9kaXY+XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2F0dC1ydHRhbWFwbGliJyxcclxuICB0ZW1wbGF0ZTogYCAgXHJcbiAgPGRpdiBzdHlsZT0ncG9zaXRpb246cmVsYXRpdmU7Jz5cclxuICA8ZGl2IGlkPSdteU1hcCcgY2xhc3M9J21hcGNsYXNzJyAjbWFwRWxlbWVudD5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGlkPVwidGlja2V0bW9kYWxcIiBjbGFzcz1cIm1vZGFsXCI+XHJcblx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgc3R5bGU9J21heC13aWR0aDozNzBweDsnPlx0XHRcdFxyXG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiIHN0eWxlPSdsaW5lLWhlaWdodDoxLjJlbTsnPlxyXG4gICAgICA8L2Rpdj5cdFx0XHRcclxuICAgICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuICBzdHlsZXM6IFtgXHJcbiAgLm1hcGNsYXNze1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gNGVtIC0gODBweCkgIWltcG9ydGFudDsgICAgXHJcbiAgICBkaXNwbGF5OmJsb2NrO1xyXG4gIH1cclxuICAubW9kYWx7XHJcbiAgICBwb3NpdGlvbjphYnNvbHV0ZTtcclxuICB9XHJcbiAgLmluZnlNYXBwb3B1cHtcclxuXHRcdG1hcmdpbjphdXRvICFpbXBvcnRhbnQ7XHJcbiAgICB3aWR0aDozMDBweCAhaW1wb3J0YW50O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBsaWdodGdyYXk7IFxyXG4gIH0sXHJcbiAgLnBvcE1vZGFsQ29udGFpbmVye1xyXG4gICAgcGFkZGluZzoxNXB4O1xyXG4gIH1cclxuICAucG9wTW9kYWxIZWFkZXJ7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB3aWR0aDoxMDAlO1xyXG4gIH1cclxuICAucG9wTW9kYWxIZWFkZXIgYXtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIHBhZGRpbmc6NXB4IDEwcHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZjMTA3O1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjZmZjMTA3O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6MTBweDtcclxuICAgIHRvcDo1cHg7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEhlYWRlciAuZmF7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6LTEwcHg7XHJcbiAgICByaWdodDotMTBweDtcclxuICBcclxuICB9XHJcbiAgLnBvcE1vZGFsQm9keSBsYWJlbHtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcclxuICB9XHJcbiAgLnBvcE1vZGFsQm9keSBzcGFue1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcclxuICAgIHdvcmQtYnJlYWs6w4LCoGJyZWFrLXdvcmQ7XHJcbiAgfVxyXG4gIC5tZXRlckNhbCBzdHJvbmd7XHJcbiAgICBmb250LXdlaWdodDogYm9sZGVyO1xyXG4gICAgZm9udC1zaXplOiAyM3B4O1xyXG4gIH1cclxuICAubWV0ZXJDYWwgc3BhbntcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gIH1cclxuICAucG9wTW9kYWxGb290ZXIgLmNvbHtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICB9XHJcbiAgLnBvcE1vZGFsRm9vdGVyIC5mYXtcclxuICAgIHBhZGRpbmc6MCA1cHg7XHJcbiAgfVxyXG4ubW9kYWwtYm9keSB7bWF4LWhlaWdodDo0NTBweDsgb3ZlcmZsb3cteTphdXRvfVxyXG4udGt0Rm9ybSAuZm9ybS1ncm91cCB7bWFyZ2luLWJvdHRvbTo1cHh9XHJcbi50a3RGb3JtIC5mb3JtLWdyb3VwIGRpdiBsYWJlbCB7Zm9udC13ZWlnaHQ6NTAwfVxyXG4udG9wQm9yZGVyIHtib3JkZXItdG9wOiNkYmRiZGIgMXB4IHNvbGlkO31cclxuXHJcbi50ZXh0LXN1Y2Nlc3Mge2NvbG9yOiM1Y2I4NWN9XHJcbi50ZXh0LWRhbmdlciB7Y29sb3I6I2Q5NTM0Zn1cclxuI21vcmVGb3JtQ29udGVudEJ0biwgI21vcmVGb3JtQ29udGVudEJ0bjpob3ZlciAgeyAgICBcclxuICAgXHJcbiAgICBiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O1xyXG4gICAgYm9yZGVyOjBcclxufVxyXG4jbW9yZUZvcm1Db250ZW50QnRuOmZvY3VzICB7ICAgIFxyXG4gICAgb3V0bGluZTowXHJcbn1cclxuXHJcbiAgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFJ0dGFtYXBsaWJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBjb25uZWN0aW9uO1xyXG4gIG1hcDogYW55O1xyXG4gIGNvbnRleHRNZW51OiBhbnk7XHJcbiAgdGVjaG5pY2lhblBob25lOiBzdHJpbmc7XHJcbiAgdGVjaG5pY2lhbkVtYWlsOiBzdHJpbmc7XHJcbiAgdGVjaG5pY2lhbk5hbWU6IHN0cmluZztcclxuICB0cmF2YWxEdXJhdGlvbjtcclxuICB0cnVja0l0ZW1zID0gW107XHJcbiAgdGVzdENsYXNzID0gXCJwb3NpdGlvbjpyZWxhdGl2ZTtcIjtcclxuXHJcbiAgZGlyZWN0aW9uc01hbmFnZXI7XHJcbiAgdHJhZmZpY01hbmFnZXI6IGFueTtcclxuXHJcbiAgdHJ1Y2tMaXN0ID0gW107XHJcbiAgdHJ1Y2tXYXRjaExpc3Q6IFRydWNrRGV0YWlsc1tdO1xyXG4gIGJ1c3k6IGFueTtcclxuICBtYXB2aWV3ID0gJ3JvYWQnO1xyXG4gIGxvYWRpbmcgPSBmYWxzZTtcclxuICBAVmlld0NoaWxkKCdtYXBFbGVtZW50Jykgc29tZUlucHV0OiBFbGVtZW50UmVmO1xyXG4gIG15TWFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215TWFwJyk7XHJcbiAgcmVhZHkgPSBmYWxzZTtcclxuICBhbmltYXRlZExheWVyO1xyXG4gIC8vIEBWaWV3Q2hpbGQoJ3Ntc3BvcHVwJykgc21zcG9wdXA6IFBvcHVwO1xyXG4gIC8vIEBWaWV3Q2hpbGQoJ2VtYWlscG9wdXAnKSBlbWFpbHBvcHVwOiBQb3B1cDtcclxuICBAVmlld0NoaWxkKCdpbmZvJykgaW5mb1RlbXBsYXRlOiBFbGVtZW50UmVmO1xyXG4gIHNvY2tldDogYW55ID0gbnVsbDtcclxuICBzb2NrZXRVUkw6IHN0cmluZztcclxuICByZXN1bHRzID0gW1xyXG4gIF07XHJcbiAgcHVibGljIHVzZXJSb2xlOiBhbnk7XHJcbiAgbGFzdFpvb21MZXZlbCA9IDEwO1xyXG4gIGxhc3RMb2NhdGlvbjogYW55O1xyXG4gIHJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzID0gW107XHJcbiAgcmVwb3J0aW5nVGVjaG5pY2lhbnMgPSBbXTtcclxuICBpc1RyYWZmaWNFbmFibGVkID0gMDtcclxuICBsb2dnZWRVc2VySWQgPSAnJztcclxuICBtYW5hZ2VyVXNlcklkID0gJyc7XHJcbiAgY29va2llQVRUVUlEID0gJyc7XHJcbiAgZmVldDogbnVtYmVyID0gMC4wMDAxODkzOTQ7XHJcbiAgSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xyXG4gIElzVlAgPSBmYWxzZTtcclxuICBmaWVsZE1hbmFnZXJzID0gW107XHJcbiAgLy8gV2VhdGhlciB0aWxlIHVybCBmcm9tIElvd2EgRW52aXJvbm1lbnRhbCBNZXNvbmV0IChJRU0pOiBodHRwOi8vbWVzb25ldC5hZ3Jvbi5pYXN0YXRlLmVkdS9vZ2MvXHJcbiAgdXJsVGVtcGxhdGUgPSAnaHR0cDovL21lc29uZXQuYWdyb24uaWFzdGF0ZS5lZHUvY2FjaGUvdGlsZS5weS8xLjAuMC9uZXhyYWQtbjBxLXt0aW1lc3RhbXB9L3t6b29tfS97eH0ve3l9LnBuZyc7XHJcblxyXG4gIC8vIFRoZSB0aW1lIHN0YW1wcyB2YWx1ZXMgZm9yIHRoZSBJRU0gc2VydmljZSBmb3IgdGhlIGxhc3QgNTAgbWludXRlcyBicm9rZW4gdXAgaW50byA1IG1pbnV0ZSBpbmNyZW1lbnRzLlxyXG4gIHRpbWVzdGFtcHMgPSBbJzkwMDkxMy1tNTBtJywgJzkwMDkxMy1tNDVtJywgJzkwMDkxMy1tNDBtJywgJzkwMDkxMy1tMzVtJywgJzkwMDkxMy1tMzBtJywgJzkwMDkxMy1tMjVtJywgJzkwMDkxMy1tMjBtJywgJzkwMDkxMy1tMTVtJywgJzkwMDkxMy1tMTBtJywgJzkwMDkxMy1tMDVtJywgJzkwMDkxMyddO1xyXG5cclxuICB0ZWNoVHlwZTogYW55O1xyXG5cclxuICB0aHJlc2hvbGRWYWx1ZSA9IDA7XHJcblxyXG4gIGFuaW1hdGlvblRydWNrTGlzdCA9IFtdO1xyXG5cclxuICBkcm9wZG93blNldHRpbmdzID0ge307XHJcbiAgc2VsZWN0ZWRGaWVsZE1nciA9IFtdO1xyXG4gIG1hbmFnZXJJZHMgPSAnJztcclxuXHJcbiAgcmFkaW91c1ZhbHVlID0gJyc7XHJcblxyXG4gIGZvdW5kVHJ1Y2sgPSBmYWxzZTtcclxuXHJcbiAgbG9nZ2VkSW5Vc2VyVGltZVpvbmUgPSAnQ1NUJztcclxuICBjbGlja2VkTGF0OyBhbnk7XHJcbiAgY2xpY2tlZExvbmc6IGFueTtcclxuICBkYXRhTGF5ZXI6IGFueTtcclxuICBwYXRoTGF5ZXI6IGFueTtcclxuICBpbmZvQm94TGF5ZXI6IGFueTtcclxuICBpbmZvYm94OiBhbnk7XHJcbiAgaXNNYXBMb2FkZWQgPSB0cnVlO1xyXG4gIFdvcmtGbG93QWRtaW4gPSBmYWxzZTtcclxuICBTeXN0ZW1BZG1pbiA9IGZhbHNlO1xyXG4gIFJ1bGVBZG1pbiA9IGZhbHNlO1xyXG4gIFJlZ3VsYXJVc2VyID0gZmFsc2U7XHJcbiAgUmVwb3J0aW5nID0gZmFsc2U7XHJcbiAgTm90aWZpY2F0aW9uQWRtaW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSB0aWNrZXRMaXN0OiBhbnkgPSBbXTtcclxuICBASW5wdXQoKSBsb2dnZWRJblVzZXI6IHN0cmluZztcclxuICBAT3V0cHV0KCkgdGlja2V0Q2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gIHRpY2tldERhdGE6IFRpY2tldFtdID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtYXBTZXJ2aWNlOiBSdHRhbWFwbGliU2VydmljZSxcclxuICAgIC8vcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgXHJcbiAgICAvL3B1YmxpYyB0b2FzdHI6IFRvYXN0c01hbmFnZXIsIFxyXG4gICAgdlJlZjogVmlld0NvbnRhaW5lclJlZlxyXG4gICAgKSB7XHJcbiAgICAvL3RoaXMudG9hc3RyLnNldFJvb3RWaWV3Q29udGFpbmVyUmVmKHZSZWYpO1xyXG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcclxuICAgIHRoaXMuY29va2llQVRUVUlEID0gXCJrcjUyMjZcIjsvL3RoaXMudXRpbHMuZ2V0Q29va2llVXNlcklkKCk7XHJcbiAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zID0gW107XHJcbiAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnB1c2godGhpcy5jb29raWVBVFRVSUQpO1xyXG4gICAgdGhpcy50cmF2YWxEdXJhdGlvbiA9IDUwMDA7XHJcbiAgICAvLyAvLyB0byBsb2FkIGFscmVhZHkgYWRkcmVkIHdhdGNoIGxpc3RcclxuICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja1dhdGNoTGlzdCcpICE9IG51bGwpIHtcclxuICAgICAgdGhpcy50cnVja0xpc3QgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgdGhpcy5sb2dnZWRVc2VySWQgPSB0aGlzLm1hbmFnZXJVc2VySWQgPSBcImtyNTIyNlwiOy8vdGhpcy51dGlscy5nZXRDb29raWVVc2VySWQoKTtcclxuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgLy90aGlzLmNoZWNrVXNlckxldmVsKGZhbHNlKTtcclxuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9ICdjb21wbGV0ZScpICB7XHJcbiAgICAgIGRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xyXG4gICAgICAgICAgdGhpcy5tYXB2aWV3ID0gJ3JvYWQnO1xyXG4gICAgICAgICAgdGhpcy5sb2FkTWFwVmlldygncm9hZCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLm5nT25Jbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xyXG4gICAgICAgIHRoaXMubWFwdmlldyA9ICdyb2FkJztcclxuICAgICAgICB0aGlzLmxvYWRNYXBWaWV3KCdyb2FkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgICAgIFxyXG4gIH1cclxuXHJcbiAgY2hlY2tVc2VyTGV2ZWwoSXNTaG93VHJ1Y2spIHtcclxuICAgIHRoaXMuZmllbGRNYW5hZ2VycyA9IFtdO1xyXG4gICAgLy8gQXNzaWduIGxvZ2dlZCBpbiB1c2VyXHJcbiAgICB2YXIgbWdyID0geyBpZDogdGhpcy5tYW5hZ2VyVXNlcklkLCBpdGVtTmFtZTogdGhpcy5tYW5hZ2VyVXNlcklkIH07XHJcbiAgICB0aGlzLmZpZWxkTWFuYWdlcnMucHVzaChtZ3IpO1xyXG5cclxuICAgIC8vIENvbW1lbnQgYmVsb3cgbGluZSB3aGVuIHlvdSBnaXZlIGZvciBwcm9kdWN0aW9uIGJ1aWxkIDkwMDhcclxuICAgIHRoaXMuSXNWUCA9IHRydWU7XHJcblxyXG4gICAgLy8gQ2hlY2sgaXMgbG9nZ2VkIGluIHVzZXIgaXMgYSBmaWVsZCBtYW5hZ2VyIGFyZWEgbWFuYWdlci92cFxyXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckluZm8odGhpcy5tYW5hZ2VyVXNlcklkKS50aGVuKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSkge1xyXG4gICAgICAgIGxldCBtYW5hZ2VycyA9ICdmJztcclxuICAgICAgICBsZXQgYW1hbmFnZXJzID0gJ2UnO1xyXG4gICAgICAgIGxldCB2cCA9ICdhLGIsYyxkJztcclxuXHJcbiAgICAgICAgaWYgKGRhdGEubGV2ZWwuaW5kZXhPZihtYW5hZ2VycykgPiAtMSkge1xyXG4gICAgICAgICAgLy8gdGhpcy5Jc1ZQID0gSXNTaG93VHJ1Y2s7XHJcbiAgICAgICAgICB0aGlzLklzQXJlYU1hbmFnZXIgPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMubWFuYWdlcklkcyA9IHRoaXMuZmllbGRNYW5hZ2Vycy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1bJ2lkJ107XHJcbiAgICAgICAgICB9KS50b1N0cmluZygpO1xyXG4gICAgICAgICAgLy8gdGhpcy5nZXRUZWNoRGV0YWlsc0Zvck1hbmFnZXJzKCk7XHJcbiAgICAgICAgICAvLyB0aGlzLkxvYWRUcnVja3ModGhpcy5tYXAsIG51bGwsIG51bGwsIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyAvLyQoJyNsb2FkaW5nJykuaGlkZSgpIFxyXG4gICAgICAgIH0sIDMwMDApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZXZlbC5pbmRleE9mKGFtYW5hZ2VycykgPiAtMSkge1xyXG4gICAgICAgICAgdGhpcy5maWVsZE1hbmFnZXJzID0gW107XHJcbiAgICAgICAgICB2YXIgYXJlYU1nciA9IHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMubWFuYWdlclVzZXJJZCxcclxuICAgICAgICAgICAgaXRlbU5hbWU6IGRhdGEubmFtZSArICcgKCcgKyB0aGlzLm1hbmFnZXJVc2VySWQgKyAnKSdcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMudW5zaGlmdChhcmVhTWdyKTtcclxuICAgICAgICAgIHRoaXMuZ2V0TGlzdG9mRmllbGRNYW5hZ2VycygpO1xyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRhdGEubGV2ZWwuaW5kZXhPZih2cCkgPiAtMSkge1xyXG4gICAgICAgICAgdGhpcy5Jc1ZQID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy90aGlzLnRvYXN0ci53YXJuaW5nKCdOb3QgdmFsaWQgRmllbGQvQXJlYSBNYW5hZ2VyIScsICdNYW5hZ2VyJywgeyBzaG93Q2xvc2VCdXR0b246IHRydWUgfSlcclxuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIud2FybmluZygnUGxlYXNlIGVudGVyIHZhbGlkIEZpZWxkL0FyZWEgTWFuYWdlciBhdHR1aWQhJywgJ01hbmFnZXInLCB7IHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSB9KVxyXG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBjb25uZWN0aW5nIHdlYiBwaG9uZSEnLCAnRXJyb3InKVxyXG4gICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRMaXN0b2ZGaWVsZE1hbmFnZXJzKCkge1xyXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckRhdGEodGhpcy5tYW5hZ2VyVXNlcklkKS50aGVuKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGRhdGEuVGVjaG5pY2lhbkRldGFpbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZvciAodmFyIHRlY2ggaW4gZGF0YS5UZWNobmljaWFuRGV0YWlscykge1xyXG4gICAgICAgICAgdmFyIG1nciA9IHtcclxuICAgICAgICAgICAgaWQ6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkLFxyXG4gICAgICAgICAgICBpdGVtTmFtZTogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5uYW1lICsgJyAoJyArIGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkICsgJyknXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgdGhpcy5maWVsZE1hbmFnZXJzLnB1c2gobWdyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuSXNWUCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5Jc1ZQID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLklzQXJlYU1hbmFnZXIgPSBmYWxzZTtcclxuICAgICAgICAvL3RoaXMudG9hc3RyLndhcm5pbmcoJ0RvIG5vdCBoYXZlIGFueSBkaXJlY3QgcmVwb3J0cyEnLCAnTWFuYWdlcicpO1xyXG4gICAgICB9XHJcbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgY29ubmVjdGluZyB3ZWIgcGhvbmUhJywgJ0Vycm9yJyk7XHJcbiAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFRlY2hEZXRhaWxzRm9yTWFuYWdlcnMoKSB7XHJcbiAgICBpZiAodGhpcy5tYW5hZ2VySWRzICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckRhdGEodGhpcy5tYW5hZ2VySWRzKS50aGVuKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAoZGF0YS5UZWNobmljaWFuRGV0YWlscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciB0ZWNoIGluIGRhdGEuVGVjaG5pY2lhbkRldGFpbHMpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFucy5wdXNoKGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgYXR0dWlkOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmF0dHVpZCxcclxuICAgICAgICAgICAgICBuYW1lOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLm5hbWUsXHJcbiAgICAgICAgICAgICAgZW1haWw6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uZW1haWwsXHJcbiAgICAgICAgICAgICAgcGhvbmU6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0ucGhvbmVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgICBcclxuICBsb2FkTWFwVmlldyh0eXBlOiBTdHJpbmcpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMudHJ1Y2tJdGVtcyA9IFtdO1xyXG4gICAgdmFyIGxvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKDQwLjA1ODMsIC03NC40MDU3KTtcclxuXHJcbiAgICBpZiAodGhpcy5sYXN0TG9jYXRpb24pIHtcclxuICAgICAgbG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odGhpcy5sYXN0TG9jYXRpb24ubGF0aXR1ZGUsIHRoaXMubGFzdExvY2F0aW9uLmxvbmdpdHVkZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm1hcCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215TWFwJyksIHtcclxuICAgICAgY3JlZGVudGlhbHM6ICdBbnhwUy0zMmtZdkJ6alE1cGJaY25EejE3b0tCYTFCcTJIUndIQU5vTnBIczNaMjVORHZxYmhjcUpaeURvWU1qJyxcclxuICAgICAgY2VudGVyOiBsb2NhdGlvbixcclxuICAgICAgbWFwVHlwZUlkOiB0eXBlID09ICdzYXRlbGxpdGUnID8gTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLmFlcmlhbCA6IE1pY3Jvc29mdC5NYXBzLk1hcFR5cGVJZC5yb2FkLFxyXG4gICAgICB6b29tOiAxMixcclxuICAgICAgbGl0ZU1vZGU6IHRydWUsXHJcbiAgICAgIC8vbmF2aWdhdGlvbkJhck9yaWVudGF0aW9uOiBNaWNyb3NvZnQuTWFwcy5OYXZpZ2F0aW9uQmFyT3JpZW50YXRpb24uaG9yaXpvbnRhbCxcclxuICAgICAgZW5hYmxlQ2xpY2thYmxlTG9nbzogZmFsc2UsXHJcbiAgICAgIHNob3dMb2dvOiBmYWxzZSxcclxuICAgICAgc2hvd1Rlcm1zTGluazogZmFsc2UsXHJcbiAgICAgIHNob3dNYXBUeXBlU2VsZWN0b3I6IGZhbHNlLFxyXG4gICAgICBzaG93VHJhZmZpY0J1dHRvbjogdHJ1ZSxcclxuICAgICAgZW5hYmxlU2VhcmNoTG9nbzogZmFsc2UsXHJcbiAgICAgIHNob3dDb3B5cmlnaHQ6IGZhbHNlXHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgLy9Mb2FkIHRoZSBBbmltYXRpb24gTW9kdWxlXHJcbiAgICAvL01pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoXCJBbmltYXRpb25Nb2R1bGVcIik7XHJcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdBbmltYXRpb25Nb2R1bGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB9KTtcclxuICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMubWFwLCAndmlld2NoYW5nZWVuZCcsICgpID0+IHsgXHJcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHRoYXQuc2V0Wm9vbVBvc2l0aW9uLDEwMDAwKTtcclxuICAgICB9KTtcclxuXHJcbiAgICAgIFxyXG4gICAgLy9TdG9yZSBzb21lIG1ldGFkYXRhIHdpdGggdGhlIHB1c2hwaW5cclxuICAgIHRoaXMuaW5mb2JveCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5JbmZvYm94KHRoaXMubWFwLmdldENlbnRlcigpLCB7XHJcbiAgICAgIHZpc2libGU6IGZhbHNlXHJcbiAgICB9KTtcclxuICAgIHRoaXMuaW5mb2JveC5zZXRNYXAodGhpcy5tYXApO1xyXG4gICAgXHJcbiAgICAvLyBDcmVhdGUgYSBsYXllciBmb3IgcmVuZGVyaW5nIHRoZSBwYXRoLlxyXG4gICAgdGhpcy5wYXRoTGF5ZXIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTGF5ZXIoKTtcclxuICAgIHRoaXMubWFwLmxheWVycy5pbnNlcnQodGhpcy5wYXRoTGF5ZXIpO1xyXG5cclxuICAgIC8vIExvYWQgdGhlIFNwYXRpYWwgTWF0aCBtb2R1bGUuXHJcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aCcsIGZ1bmN0aW9uICgpIHsgfSk7XHJcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zJywgZnVuY3Rpb24gKCkgeyB9KTtcclxuXHJcbiAgICAvLyBDcmVhdGUgYSBsYXllciB0byBsb2FkIHB1c2hwaW5zIHRvLlxyXG4gICAgdGhpcy5kYXRhTGF5ZXIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRW50aXR5Q29sbGVjdGlvbigpO1xyXG5cclxuICAgIC8vIEFkZCBhIHJpZ2h0IGNsaWNrIGV2ZW50IHRvIHRoZSBtYXBcclxuICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMubWFwLCAncmlnaHRjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGNvbnN0IHgxID0gZS5sb2NhdGlvbjtcclxuICAgICAgdGhhdC5jbGlja2VkTGF0ID0geDEubGF0aXR1ZGU7XHJcbiAgICAgIHRoYXQuY2xpY2tlZExvbmcgPSB4MS5sb25naXR1ZGU7XHJcbiAgICAgIHRoYXQucmFkaW91c1ZhbHVlID0gJyc7XHJcbiAgICAgIGpRdWVyeSgnI215UmFkaXVzTW9kYWwnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy9sb2FkIHRpY2tldCBkZXRhaWxzXHJcbiAgICB0aGlzLmFkZFRpY2tldERhdGEodGhpcy5tYXAsIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIpO1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICBzZXRab29tUG9zaXRpb24oKXtcclxuICAgICQoJy5OYXZCYXJfQ29udGFpbmVyLkxpZ2h0JykuYXR0cignc3R5bGUnLCdib3R0b206MzBweDt0b3A6dW5zZXQgIWltcG9ydGFudDsnKTsgICAgXHJcbiAgfVxyXG5cclxuICBMb2FkVHJ1Y2tzKG1hcHMsIGx0LCBsZywgcmQsIGlzVHJ1Y2tTZWFyY2gpIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy50cnVja0l0ZW1zID0gW107XHJcblxyXG4gICAgaWYgKCFpc1RydWNrU2VhcmNoKSB7XHJcblxyXG4gICAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0TWFwUHVzaFBpbkRhdGEodGhpcy5tYW5hZ2VySWRzKS50aGVuKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAoIWpRdWVyeS5pc0VtcHR5T2JqZWN0KGRhdGEpICYmIGRhdGEudGVjaERhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgdmFyIHRlY2hEYXRhID0gZGF0YS50ZWNoRGF0YTtcclxuICAgICAgICAgIHZhciBkaXJEZXRhaWxzID0gW107XHJcbiAgICAgICAgICB0ZWNoRGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmxvbmcgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgaXRlbS5sb25nID0gaXRlbS5sb25nZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXRlbS50ZWNoSUQgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGRpckRldGFpbDogVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzID0gbmV3IFRydWNrRGlyZWN0aW9uRGV0YWlscygpO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC50ZWNoSWQgPSBpdGVtLnRlY2hJRDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTGF0ID0gaXRlbS5sYXQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxvbmcgPSBpdGVtLmxvbmc7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMYXQgPSBpdGVtLndyTGF0O1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TG9uZyA9IGl0ZW0ud3JMb25nO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbHMucHVzaChkaXJEZXRhaWwpO1xyXG4gICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB2YXIgcm91dGVNYXBVcmxzID0gW107XHJcbiAgICAgICAgICByb3V0ZU1hcFVybHMgPSB0aGlzLm1hcFNlcnZpY2UuR2V0Um91dGVNYXBEYXRhKGRpckRldGFpbHMpO1xyXG5cclxuICAgICAgICAgIGZvcmtKb2luKHJvdXRlTWFwVXJscykuc3Vic2NyaWJlKHJlc3VsdHMgPT4ge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPD0gcmVzdWx0cy5sZW5ndGggLSAxOyBqKyspIHtcclxuICAgICAgICAgICAgICBsZXQgcm91dGVEYXRhID0gcmVzdWx0c1tqXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgbGV0IHJvdXRlZGF0YUpzb24gPSByb3V0ZURhdGEuanNvbigpO1xyXG4gICAgICAgICAgICAgIGlmIChyb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zICE9IG51bGxcclxuICAgICAgICAgICAgICAgICYmIHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMYXQgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMF1cclxuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTG9uZyA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1sxXVxyXG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMYXQgPSBuZXh0U291cmNlTGF0O1xyXG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMb25nID0gbmV4dFNvdXJjZUxvbmc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbGlzdE9mUGlucyA9IG1hcHMuZW50aXRpZXM7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RPZlBpbnMuZ2V0TGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICAgICAgICAgIHZhciB0ZWNoSWQgPSBsaXN0T2ZQaW5zLmdldChpKS5tZXRhZGF0YS5BVFRVSUQ7XHJcbiAgICAgICAgICAgICAgdmFyIHRydWNrQ29sb3IgPSBsaXN0T2ZQaW5zLmdldChpKS5tZXRhZGF0YS50cnVja0NvbC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgIHZhciBjdXJQdXNoUGluID0gbGlzdE9mUGlucy5nZXQoaSk7XHJcbiAgICAgICAgICAgICAgdmFyIGN1cnJEaXJEZXRhaWwgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgY3VyckRpckRldGFpbCA9IGRpckRldGFpbHMuZmlsdGVyKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQudGVjaElkID09PSB0ZWNoSWQpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgIHZhciBuZXh0TG9jYXRpb247XHJcblxyXG4gICAgICAgICAgICAgIGlmIChjdXJyRGlyRGV0YWlsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG5leHRMb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxhdCwgY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMb25nKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChuZXh0TG9jYXRpb24gIT0gbnVsbCAmJiBuZXh0TG9jYXRpb24gIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGluTG9jYXRpb24gPSBsaXN0T2ZQaW5zLmdldChpKS5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRDb29yZCA9IHRoYXQuQ2FsY3VsYXRlTmV4dENvb3JkKHBpbkxvY2F0aW9uLCBuZXh0TG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJlYXJpbmcgPSB0aGF0LmNhbGN1bGF0ZUJlYXJpbmcocGluTG9jYXRpb24sIG5leHRDb29yZCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHJ1Y2tVcmwgPSB0aGlzLmdldFRydWNrVXJsKHRydWNrQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKGN1clB1c2hQaW4sIHRydWNrVXJsLCBiZWFyaW5nLCBmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMubWFwU2VydmljZS5nZXRUcnVja0ZlZWQodGhpcy5yZXBvcnRpbmdUZWNobmljaWFucywgdGhpcy5tYW5hZ2VySWRzKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICBpZiAodGhpcy5yZXBvcnRpbmdUZWNobmljaWFucy5zb21lKHggPT4geC50b0xvd2VyQ2FzZSgpID09IGRhdGEudGVjaElELnRvTG93ZXJDYXNlKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGRhdGEpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBmZXRjaGluZyB0cnVja3MgZnJvbSBLYWZrYSBDb25zdW1lci4gRXJyb3JzLT4gJyArIGVyci5FcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdObyB0cnVjayBmb3VuZCEnLCAnTWFuYWdlcicpO1xyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgZmV0Y2hpbmcgZGF0YSBmcm9tIEFQSSEnLCAnRXJyb3InKTtcclxuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICBjb25zdCBtdHJzID0gTWF0aC5yb3VuZCh0aGF0LmdldE1ldGVycyhyZCkpO1xyXG4gICAgICB0aGlzLm1hcFNlcnZpY2UuZmluZFRydWNrTmVhckJ5KGx0LCBsZywgbXRycywgdGhpcy5tYW5hZ2VySWRzKS50aGVuKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAoIWpRdWVyeS5pc0VtcHR5T2JqZWN0KGRhdGEpICYmIGRhdGEudGVjaERhdGEubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgIGNvbnN0IHRlY2hEYXRhID0gZGF0YS50ZWNoRGF0YTtcclxuICAgICAgICAgIGxldCBkaXJEZXRhaWxzID0gW107XHJcbiAgICAgICAgICB0ZWNoRGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmxvbmcgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgaXRlbS5sb25nID0gaXRlbS5sb25nZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoKGl0ZW0udGVjaElEICE9IHVuZGVmaW5lZCkgJiYgKGRpckRldGFpbHMuc29tZSh4ID0+IHgudGVjaElkID09IGl0ZW0udGVjaElEKSA9PSBmYWxzZSkpIHtcclxuICAgICAgICAgICAgICB2YXIgZGlyRGV0YWlsOiBUcnVja0RpcmVjdGlvbkRldGFpbHMgPSBuZXcgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzKCk7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnRlY2hJZCA9IGl0ZW0udGVjaElEO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMYXQgPSBpdGVtLmxhdDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTG9uZyA9IGl0ZW0ubG9uZztcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExhdCA9IGl0ZW0ud3JMYXQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMb25nID0gaXRlbS53ckxvbmc7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlscy5wdXNoKGRpckRldGFpbCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgaXRlbSk7XHJcbiAgICAgICAgICAgICAgdGhhdC5mb3VuZFRydWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdmFyIHJvdXRlTWFwVXJscyA9IFtdO1xyXG4gICAgICAgICAgcm91dGVNYXBVcmxzID0gdGhpcy5tYXBTZXJ2aWNlLkdldFJvdXRlTWFwRGF0YShkaXJEZXRhaWxzKTtcclxuXHJcbiAgICAgICAgICBmb3JrSm9pbihyb3V0ZU1hcFVybHMpLnN1YnNjcmliZShyZXN1bHRzID0+IHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IHJlc3VsdHMubGVuZ3RoIC0gMTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHJvdXRlRGF0YSA9IHJlc3VsdHNbal0gYXMgYW55O1xyXG4gICAgICAgICAgICAgIGxldCByb3V0ZWRhdGFKc29uID0gcm91dGVEYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgICBpZiAocm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcyAhPSBudWxsXHJcbiAgICAgICAgICAgICAgICAmJiByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTGF0ID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzBdXHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxvbmcgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMV1cclxuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTGF0ID0gbmV4dFNvdXJjZUxhdDtcclxuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTG9uZyA9IG5leHRTb3VyY2VMb25nO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGxpc3RPZlBpbnMgPSB0aGF0Lm1hcC5lbnRpdGllcztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mUGlucy5nZXRMZW5ndGgoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcHVzaHBpbiA9IGxpc3RPZlBpbnMuZ2V0KGkpO1xyXG4gICAgICAgICAgICAgIGlmIChwdXNocGluIGluc3RhbmNlb2YgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbikge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlY2hJZCA9IHB1c2hwaW4ubWV0YWRhdGEuQVRUVUlEO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJ1Y2tDb2xvciA9IHB1c2hwaW4ubWV0YWRhdGEudHJ1Y2tDb2wudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyRGlyRGV0YWlsID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgY3VyckRpckRldGFpbCA9IGRpckRldGFpbHMuZmlsdGVyKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50ZWNoSWQgPT09IHRlY2hJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dExvY2F0aW9uO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjdXJyRGlyRGV0YWlsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgbmV4dExvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTGF0LCBjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxvbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChuZXh0TG9jYXRpb24gIT0gbnVsbCAmJiBuZXh0TG9jYXRpb24gIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBwaW5Mb2NhdGlvbiA9IGxpc3RPZlBpbnMuZ2V0KGkpLmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBuZXh0Q29vcmQgPSB0aGF0LkNhbGN1bGF0ZU5leHRDb29yZChwaW5Mb2NhdGlvbiwgbmV4dExvY2F0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgdmFyIGJlYXJpbmcgPSB0aGF0LmNhbGN1bGF0ZUJlYXJpbmcocGluTG9jYXRpb24sIG5leHRDb29yZCk7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB0cnVja1VybCA9IHRoaXMuZ2V0VHJ1Y2tVcmwodHJ1Y2tDb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwdXNocGluLCB0cnVja1VybCwgYmVhcmluZywgZnVuY3Rpb24gKCkgeyB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIExvYWQgdGhlIHNwYXRpYWwgbWF0aCBtb2R1bGVcclxuICAgICAgICAgICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGgnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgLy8gUmVxdWVzdCB0aGUgdXNlcidzIGxvY2F0aW9uXHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IGxvYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0aGF0LmNsaWNrZWRMYXQsIHRoYXQuY2xpY2tlZExvbmcpO1xyXG4gICAgICAgICAgICAgIC8vIENyZWF0ZSBhbiBhY2N1cmFjeSBjaXJjbGVcclxuICAgICAgICAgICAgICBjb25zdCBwYXRoID0gTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGguZ2V0UmVndWxhclBvbHlnb24obG9jLFxyXG4gICAgICAgICAgICAgICAgcmQsXHJcbiAgICAgICAgICAgICAgICAzNixcclxuICAgICAgICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoLkRpc3RhbmNlVW5pdHMuTWlsZXMpO1xyXG5cclxuICAgICAgICAgICAgICBjb25zdCBwb2x5ID0gbmV3IE1pY3Jvc29mdC5NYXBzLlBvbHlnb24ocGF0aCk7XHJcbiAgICAgICAgICAgICAgdGhhdC5tYXAuZW50aXRpZXMucHVzaChwb2x5KTtcclxuICAgICAgICAgICAgICAvLyBBZGQgYSBwdXNocGluIGF0IHRoZSB1c2VyJ3MgbG9jYXRpb24uXHJcbiAgICAgICAgICAgICAgY29uc3QgcGluID0gbmV3IE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4obG9jLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBpY29uOiAnaHR0cHM6Ly9iaW5nbWFwc2lzZGsuYmxvYi5jb3JlLndpbmRvd3MubmV0L2lzZGtzYW1wbGVzL2RlZmF1bHRQdXNocGluLnBuZycsXHJcbiAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDEyLCAzOSksXHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiByZCArICcgbWlsZShzKSBvZiByYWRpdXMnLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgIHZhciBtZXRhZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIExhdGl0dWRlOiBsdCxcclxuICAgICAgICAgICAgICAgIExvbmdpdHVkZTogbGcsXHJcbiAgICAgICAgICAgICAgICByYWRpdXM6IHJkXHJcbiAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIocGluLCAnY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5yYWRpb3VzVmFsdWUgPSByZDtcclxuICAgICAgICAgICAgICAgIHRoYXQuY2xpY2tlZExhdCA9IGx0O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jbGlja2VkTG9uZyA9IGxnO1xyXG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcjbXlSYWRpdXNNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgIHBpbi5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG4gICAgICAgICAgICAgIHRoYXQubWFwLmVudGl0aWVzLnB1c2gocGluKTtcclxuICAgICAgICAgICAgICB0aGF0LmRhdGFMYXllci5wdXNoKHBpbik7XHJcblxyXG4gICAgICAgICAgICAgIC8vIENlbnRlciB0aGUgbWFwIG9uIHRoZSB1c2VyJ3MgbG9jYXRpb24uXHJcbiAgICAgICAgICAgICAgdGhhdC5tYXAuc2V0Vmlldyh7IGNlbnRlcjogbG9jLCB6b29tOiA4IH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGxldCBmZWVkTWFuYWdlciA9IFtdO1xyXG5cclxuICAgICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMubWFwU2VydmljZS5nZXRUcnVja0ZlZWQodGhpcy5yZXBvcnRpbmdUZWNobmljaWFucywgdGhpcy5tYW5hZ2VySWRzKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZGlyRGV0YWlscy5zb21lKHggPT4geC50ZWNoSWQudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSBkYXRhLnRlY2hJRC50b0xvY2FsZUxvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBkYXRhKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgZmV0Y2hpbmcgdHJ1Y2tzIGZyb20gS2Fma2EgQ29uc3VtZXIuIEVycm9ycy0+ICcgKyBlcnIuRXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignTm8gdHJ1Y2sgZm91bmQhJywgJ01hbmFnZXInKTtcclxuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGZldGNoaW5nIGRhdGEgZnJvbSBBUEkhJywgJ0Vycm9yJyk7XHJcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0VHJ1Y2tVcmwoY29sb3IpIHtcclxuICAgIGxldCB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSGttbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TkRrNk1ERXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TkRrNk1ERXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdSbU0yVmlNV1F0TkdKbFpDMWpOalEwTFRnelltVXRZalE1WWpabE5EbG1ZbVJtSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaR0V4TlRCbFlURXRNakpoWXkwM09UUTVMVGhpTm1FdFpXVTFNVGM0WlRCbU1XRmtJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPbVl3WldReFpXTTNMVE0xT1RBdFpHRTBZaTA1TVdJd0xUWXdPVFEyWmpGaE5XUTVZend2Y21SbU9teHBQaUE4Y21SbU9teHBQbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJQQzl5WkdZNmJHaytJRHd2Y21SbU9rSmhaejRnUEM5d2FHOTBiM05vYjNBNlJHOWpkVzFsYm5SQmJtTmxjM1J2Y25NK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMFZERTVPakE0T2pBekxUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvMVpEUTJNRGMxWmkwNE1tUm1MV1kzTkRBdFltVTNaUzFtTjJJME16bG1ZamN5TXpFaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVFZVTVRrNk1qTTZNekV0TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPbUZrWmpObFlqRmtMVFJpWldRdFl6WTBOQzA0TTJKbExXSTBPV0kyWlRRNVptSmtaaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE9WUXhOVG8wT1Rvd01TMHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOEwzSmtaanBUWlhFK0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0lEd3ZjbVJtT2xKRVJqNGdQQzk0T25odGNHMWxkR0UrSUR3L2VIQmhZMnRsZENCbGJtUTlJbklpUHo0ZGI3dmpBQUFDZTBsRVFWUkl4OTJXVFd0VFFSU0duek56YjNMVHRLRzFXbEh3cTR1Q2JZWCtBMTI1RUxjdXVpaENSWENwMkgzQmhTdi9nVXZCZ2xKdzRVTEJpZ3BTYVVGY2lGTEZqU0F0c1g2MVNkTTB2WE5jOU5va1JaT1lBUlhuTXF1NXpEUG5uUGU4TTRHcThxZEh3RjhZL3g3MDZyT0pucFRJdGFkZjdvKytMeStWclpoa1JaTDVZempFeE9uMUY1bXBzVVBuYmt5TVRUNXFHenBYbVJsWkx1YkhQN0tFN1VwbjJLNi8xREZWd1dTaG1Gc2RmL2gyWm55Q1NXay92ZmU2ZTc0TnZTYXpKMGZzS3ZWcmRmb1R6S2F3WGlveU4vKzg1RmZUSjd1bjNLY2N3ZGtpRkJzZFhvbFRJSG1EekhiNTFiVG5jQTRYT0dJUk5GU2tRWGRabzZnMVpMb2o2d1dOQm1RMDdOVnA4aW5zaGlBTmd0WFZNbUZYeUlHaC9hZThvQStDMi9uQVdBcDNoT0JEOU11L05RYTZIZG5qWlliUDlKOEdadHFHSGh6YzIxRklyUkhzMnlBb3h3MVBMMWxGZzAwRzBrY3VBcGZhaGk2L0xOenE3T3ZsNVBtamxJdHJhQ0paUVJDdDVscEZ5VVJwNW04dU1QMTVxblQ1eEpYMjAxdXViS1N6YnFzN0pIWTFZU25VUUJGRmpRRU1YOWRXUEcxUVFsVVVSNHlxcmZxQjFyZXBLRGhpbkNoSTZBZlZSSzZTZlBWMjhIT3ZzQmcvcUJORmhHU2J4bGVnazZRTXp2ZVdVV29NUVpydkpteUxyVzJvUVpBWXpHL2M4OTVRRVdrcHdDMHhtZVRDYzU3cFJWdGxZdFFnQ3RZWEtpSzAvb1J5aUZIRWVBb3BkcTdHNUxWcE5hdlRKMUxWbXBwS00rSGlXdE40WTJoYUxJb21LZFltUWtyNjJoZXFBc1lLMWdoaEZPNEFTMTNhQXd0aURXeDZRb3UyWkRLbEhJdHZWcWxVMWxIVnFpRnFuU01RaFNHdVpOQ081bEpxQ0IzY2RXeGw0ZDJyenRucml4aHJjQWwwWnpwVWhWZ2RVZFRKY1A5SXdRdDY5OExqdnYvbWhmOGR0R0hsaDR2NVIxSUFBQUFBU1VWT1JLNUNZSUk9JztcclxuXHJcbiAgICBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAnZ3JlZW4nKSB7XHJcbiAgICAgIHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFIa21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1JtTTJWaU1XUXROR0psWkMxak5qUTBMVGd6WW1VdFlqUTVZalpsTkRsbVltUm1JaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpHRXhOVEJsWVRFdE1qSmhZeTAzT1RRNUxUaGlObUV0WldVMU1UYzRaVEJtTVdGa0lpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09tWXdaV1F4WldNM0xUTTFPVEF0WkdFMFlpMDVNV0l3TFRZd09UUTJaakZoTldRNVl6d3ZjbVJtT214cFBpQThjbVJtT214cFBuaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMlBDOXlaR1k2YkdrK0lEd3ZjbVJtT2tKaFp6NGdQQzl3YUc5MGIzTm9iM0E2Ukc5amRXMWxiblJCYm1ObGMzUnZjbk0rSUR4NGJYQk5UVHBJYVhOMGIzSjVQaUE4Y21SbU9sTmxjVDRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUltTnlaV0YwWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEUwVkRFNU9qQTRPakF6TFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpOCtJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKellYWmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG8xWkRRMk1EYzFaaTA0TW1SbUxXWTNOREF0WW1VM1pTMW1OMkkwTXpsbVlqY3lNekVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UVlVNVGs2TWpNNk16RXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpSUhOMFJYWjBPbU5vWVc1blpXUTlJaThpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09tRmtaak5sWWpGa0xUUmlaV1F0WXpZME5DMDRNMkpsTFdJME9XSTJaVFE1Wm1Ka1ppSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4T1ZReE5UbzBPVG93TVMwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4TDNKa1pqcFRaWEUrSUR3dmVHMXdUVTA2U0dsemRHOXllVDRnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrSUR3dmNtUm1PbEpFUmo0Z1BDOTRPbmh0Y0cxbGRHRStJRHcvZUhCaFkydGxkQ0JsYm1ROUluSWlQejRkYjd2akFBQUNlMGxFUVZSSXg5MldUV3RUUVJTR256TnpiM0xUdEtHMVdsSHdxNHVDYllYK0ExMjVFTGN1dWloQ1JYQ3AySDNCaFN2L2dVdkJnbEp3NFVMQmlncFNhVUZjaUZMRmpTQXRzWDYxU2RNMHZYTmM5Tm9rUlpPWUFSWG5NcXU1ekRQbm5QZThNNEdxOHFkSHdGOFkveDcwNnJPSm5wVEl0YWRmN28rK0x5K1ZyWmhrUlpMNVl6akV4T24xRjVtcHNVUG5ia3lNVFQ1cUd6cFhtUmxaTHViSFA3S0U3VXBuMks2LzFERlZ3V1NobUZzZGYvaDJabnlDU1drL3ZmZTZlNzROdlNhekowZnNLdlZyZGZvVHpLYXdYaW95Ti8rODVGZlRKN3VuM0tjY3dka2lGQnNkWG9sVElIbUR6SGI1MWJUbmNBNFhPR0lSTkZTa1FYZFpvNmcxWkxvajZ3V05CbVEwN05WcDhpbnNoaUFOZ3RYVk1tRlh5SUdoL2FlOG9BK0MyL25BV0FwM2hPQkQ5TXUvTlFhNkhkbmpaWWJQOUo4R1p0cUdIaHpjMjFGSXJSSHMyeUFveHcxUEwxbEZnMDBHMGtjdUFwZmFoaTYvTE56cTdPdmw1UG1qbEl0cmFDSlpRUkN0NWxwRnlVUnA1bTh1TVAxNXFuVDV4SlgyMDF1dWJLU3picXM3SkhZMVlTblVRQkZGalFFTVg5ZFdQRzFRUWxVVVI0eXFyZnFCMXJlcEtEaGluQ2hJNkFmVlJLNlNmUFYyOEhPdnNCZy9xQk5GaEdTYnhsZWdrNlFNenZlV1VXb01RWnJ2Sm15THJXMm9RWkFZekcvYzg5NVFFV2twd0MweG1lVENjNTdwUlZ0bFl0UWdDdFlYS2lLMC9vUnlpRkhFZUFvcGRxN0c1TFZwTmF2VEoxTFZtcHBLTStIaVd0TjRZMmhhTElvbUtkWW1Ra3I2MmhlcUFzWUsxZ2hoRk80QVMxM2FBd3RpRFd4NlFvdTJaREtsSEl0dlZxbFUxbEhWcWlGcW5TTVFoU0d1Wk5DTzVsSnFDQjNjZFd4bDRkMnJ6dG5yaXhocmNBbDBaenBVaFZnZFVkVEpjUDlJd1F0Njk4TGp2di9taGY4ZHRHSGxoNHY1UjFJQUFBQUFTVVZPUks1Q1lJST0nO1xyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICdyZWQnKSB7XHJcbiAgICAgIHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFIM21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZOVEk2TWpFdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZOVEk2TWpFdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZNRFZqTXpjMVpEWXRNV05sT0Mxa1pqUmxMVGd3WWpndE1qbG1ZVFJoWmpBMlpERTNJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpHUm1NR0l6WW1FdE1XTmlaQzFoTWpRMExXRXlaV010TVRnNFlUbGtPR1JsTWprMElpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09qQXdNREpsTkRobExUaG1PV1V0TmpVMFl5MDVZalEyTFRWbVlXWmtNVEJoTjJFMk56d3ZjbVJtT214cFBpQThjbVJtT214cFBtRmtiMkpsT21SdlkybGtPbkJvYjNSdmMyaHZjRHBtTUdWa01XVmpOeTB6TlRrd0xXUmhOR0l0T1RGaU1DMDJNRGswTm1ZeFlUVmtPV004TDNKa1pqcHNhVDRnUEhKa1pqcHNhVDU0YlhBdVpHbGtPamc0WkRNMU5tRTNMVGN4T0RFdFpUVTBZUzA1T1dabExUUTRNR1V6TldGak5qWm1Oand2Y21SbU9teHBQaUE4TDNKa1pqcENZV2MrSUR3dmNHaHZkRzl6YUc5d09rUnZZM1Z0Wlc1MFFXNWpaWE4wYjNKelBpQThlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BISmtaanBUWlhFK0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0pqY21WaGRHVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPamc0WkRNMU5tRTNMVGN4T0RFdFpUVTBZUzA1T1dabExUUTRNR1V6TldGak5qWm1OaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0l2UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGljMkYyWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk5XUTBOakEzTldZdE9ESmtaaTFtTnpRd0xXSmxOMlV0WmpkaU5ETTVabUkzTWpNeElpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEUxVkRFNU9qSXpPak14TFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQnpkRVYyZERwamFHRnVaMlZrUFNJdklpOCtJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKellYWmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG93TldNek56VmtOaTB4WTJVNExXUm1OR1V0T0RCaU9DMHlPV1poTkdGbU1EWmtNVGNpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRJNk1qRXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpSUhOMFJYWjBPbU5vWVc1blpXUTlJaThpTHo0Z1BDOXlaR1k2VTJWeFBpQThMM2h0Y0UxTk9raHBjM1J2Y25rK0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBpQThMM0prWmpwU1JFWStJRHd2ZURwNGJYQnRaWFJoUGlBOFAzaHdZV05yWlhRZ1pXNWtQU0p5SWo4KzdTZEF3QUFBQXNwSlJFRlVTTWZsbDd0ckZGRVl4WC9mblpsZE53bUpHa0tJQ0Q0aUlXS2xJb3FyVmo0NlFWQnNmWUQ0SDJoaGJaQVUyb2lJblZxSVdHaGxJNmdnQmxGOEJOOGhLb2hFb2hJMWJqYjd1UGV6Mk5IZFRkelpaU2RvNFF6ZmJlWU81NTd2bkh2dWpLZ3FmL3N5L0lQTGozcjQ5TTQ5aHNkdUpWb0dMNjdvSENkaEErTm16aEdVYkNFbkQ3Y3VuOWpUdWZyRDJMSmV1K1h3d2VaQmI1NDhzWGpEWk83MHNseHlYYjdEcFVRb2E2RmxXT2M4V2Y5b1luU3M5KzBGK2xhZUE2YWFCdjEwZTJqTkY1dmR1YTUvSmRiT0lGbGhCVFdLMWZ6YTl1ZkRpd3JiZG53QkxqYXQ2UnZENEkrV2RuQ0dndFBxMG5MWklrQ0NKMHJQbFljUHpzY3kwdDFQSC91KytVYnIyazBzU1R5ZUdjUEExY3U1V0tDWnJ1NHo4N0hUb014VGFsWlNCYVJJZDZEajI5S2Jqc1p5Nzc3K3ZsUDI1WXRETndJZkRZSXFJYVhDU0VZTU1NMlNuTEc3M28xZml3VzZ1NmQ3Ny93SDk0dlhYdzU3V1pFS0lKQUtQM25PcDhQbFNVOTg3MXAxNW13aUZ1anprZEg5L1IyZHlTMlpIM2dKbnorbGx3QU9oL29wSmx1VXp5T3ZEblJCWklzbEtnYVB0YlhtdDJjTHdkTE5hZXpDQmVEY3JDMVRZbXdobVVKZWozRHB5V09PcUVyVFRDV1RMYlo2eWFETkdKeFVDVm5GVk1WZzhGRHhTRUEyVm5zeEJzVmd3NkpHVjR4MXFIR0lrL2paNndBbkpZS2kxU2xVRlU0Q2lJQ1Uzb25IRkZCVlNuZlpzYk5CRlJWRmFPeVlqQXdIVDhGWkMxb2JNTnlwZ0dDZGEraXM5T3V2U0ZBMEhEVktpSERlWExUM041QkVOTmdBalptb0lWQUpoMSs2MVdKYTh0SWN1TmNUclVSRk5JS3BDSWpNamFZRlZTd09FOEhVZDRwVHhUYjRrVmUzdlFnSUljdW9kRk5wV05Yb0dKUXdENHdCejlSTUI2Y09NVkphWEZ6UWhBcXRudUJsTTVoSkg3VVdDZHMreTlNSmh5a1dDQm93VXlSb3psbnZ2Yk9NRGcxVmdaaHdaOG9NN2dId0dieFlvT21CNDE5Tk1kK0d5eFVVNTdRaUNpcFB1RklKQnQ5c0RGSlRkVzN5My94Vy9BUk5wanZ4bDgwdUxBQUFBQUJKUlU1RXJrSmdnZz09JztcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAneWVsbG93Jykge1xyXG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSUttbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRnNk5UVXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRnNk5UVXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdRNE1qRmtaak10Wm1GbE5DMHhNalF6TFRsalpUVXRabUZrTjJFMk1UZG1OVFUzSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaalV3TjJJeFltTXROREJrWlMwd1pEUXlMV0l3WlRjdE1HVTROak5tTnpWa05qQTBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPakF3TURKbE5EaGxMVGhtT1dVdE5qVTBZeTA1WWpRMkxUVm1ZV1prTVRCaE4yRTJOend2Y21SbU9teHBQaUE4Y21SbU9teHBQbUZrYjJKbE9tUnZZMmxrT25Cb2IzUnZjMmh2Y0RvNE16Y3hZMlUyWVMweFlXWmtMVEUwTkRNdE9UZ3haQzFrTjJFNE5HWTFObVUwWldVOEwzSmtaanBzYVQ0Z1BISmtaanBzYVQ1aFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaakJsWkRGbFl6Y3RNelU1TUMxa1lUUmlMVGt4WWpBdE5qQTVORFptTVdFMVpEbGpQQzl5WkdZNmJHaytJRHh5WkdZNmJHaytlRzF3TG1ScFpEbzRPR1F6TlRaaE55MDNNVGd4TFdVMU5HRXRPVGxtWlMwME9EQmxNelZoWXpZMlpqWThMM0prWmpwc2FUNGdQQzl5WkdZNlFtRm5QaUE4TDNCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzRPR1F6TlRaaE55MDNNVGd4TFdVMU5HRXRPVGxtWlMwME9EQmxNelZoWXpZMlpqWWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRSVU1UazZNRGc2TURNdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pWa05EWXdOelZtTFRneVpHWXRaamMwTUMxaVpUZGxMV1kzWWpRek9XWmlOekl6TVNJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhOVlF4T1RveU16b3pNUzB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1E0TWpGa1pqTXRabUZsTkMweE1qUXpMVGxqWlRVdFptRmtOMkUyTVRkbU5UVTNJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFNVZERTFPalU0T2pVMUxUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUG5ld1k2VUFBQUpFU1VSQlZFakgzVll4YXhSUkVQNis5L2F5dWRVSWtTTm5DQW9SbFlpSVdnbUNoUkRzUlV0YkMzK0Fsc0hXd2xZYmkxaHBZeEVFbTFpcE1SQlJFVVE4Z28yU0hDa2kzbDI0M043dXpWZ2tKbmZIdWJ1NUZ4Snc0TEhGenM0MzgzM3pab2VxaXIwMmczMndmUUgxa2w1V1ZuK1Z2M3k0Rnh3Nzhrd09EUjJFeUlZVTJpUDE5VkR3YytXaUdUOTF2MTRjSFI5Tmlzc2tUYWNmWEd0Y25YenJGMForSXd6WjlsVTN0Q0RJZTVoOTFjU2FYQXB2M0p3YjdKdmVUNTgveXRKeURhb1diRDlpUWZHMkR0U0RVaERGRnFWdkpYSFNkSHBHTUw5QStFRnlFQVZoU1VUeEFCNC95YnRwMmxCQnN3WEFFdFpxTzdkZG1TdG9GYlJBTFFyZFFHZG5IcUpWdlkxcXRRTEdCdjlTbjFEVVFvVnFBMU4zYjZXQ01tMDR2SDZSMTdtRllRZ0RXTHROYUVlbGFtQU5jTzVNR1pQWDErZ0UrdlRSVVcyMmhsQTQvQU54Uk5EMnZEQ2dLT3dBTUhGQzhmemwyUHFkcWNXZ2IzcFBuNnhodFQ2T2tXSVJLZ3JWbnBLQ0NuZys4V1orQldPRmlwdW1VV3dRUnpIT25qOE9TTXFNemcrZ3ZOUkM0Y0N5RytnV2src1I0cFlrdXVVSXhGR01NRFNPb0d4N01zV1B1elI3dDZ0TmlhbzlFdTBYVkR2bXJLWXpvcnRVcVRKanBadWRyYTZnWkhmVWhFTDFiNEt1OUhMbm5jSU1ib245YlZSQkVEdlpvOVFWRkpxdFB0MGNTd1JoTWlUb3BYRkZBcHFsZTlsam9laXZlNlZOby9UdUpiT0ptZ2hxUWZpK0IyVFVkQU5QSEsrTVd2MisyT1RsS3g2TW1FUkdNSmlENzN1d29IRUNIUzc2SzhWNklYai9MaElWZHZ6S3VpM25BNld2RFhOaHd0YWRONGYvWnNQL0F3enQ1UjNic1EyakFBQUFBRWxGVGtTdVFtQ0MnO1xyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICdwdXJwbGUnKSB7XHJcbiAgICAgIHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFIM21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRE10TURKVU1USTZNakE2TXpNdE1EVTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRE10TURKVU1USTZNakE2TXpNdE1EVTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZalZtWW1VM1lqWXRaR1ExT0Mxak56UmlMVGhtWkdZdFlqSmtOalUxTlRZM09URTBJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpqQXhObVptTmpjdFlXWXhaQzAyTVRRNUxUZ3pNalF0WkRNME9HWTFOemcwWlRrMElpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09qQXdNREpsTkRobExUaG1PV1V0TmpVMFl5MDVZalEyTFRWbVlXWmtNVEJoTjJFMk56d3ZjbVJtT214cFBpQThjbVJtT214cFBtRmtiMkpsT21SdlkybGtPbkJvYjNSdmMyaHZjRHBtTUdWa01XVmpOeTB6TlRrd0xXUmhOR0l0T1RGaU1DMDJNRGswTm1ZeFlUVmtPV004TDNKa1pqcHNhVDRnUEhKa1pqcHNhVDU0YlhBdVpHbGtPamc0WkRNMU5tRTNMVGN4T0RFdFpUVTBZUzA1T1dabExUUTRNR1V6TldGak5qWm1Oand2Y21SbU9teHBQaUE4TDNKa1pqcENZV2MrSUR3dmNHaHZkRzl6YUc5d09rUnZZM1Z0Wlc1MFFXNWpaWE4wYjNKelBpQThlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BISmtaanBUWlhFK0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0pqY21WaGRHVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPamc0WkRNMU5tRTNMVGN4T0RFdFpUVTBZUzA1T1dabExUUTRNR1V6TldGak5qWm1OaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0l2UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGljMkYyWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk5XUTBOakEzTldZdE9ESmtaaTFtTnpRd0xXSmxOMlV0WmpkaU5ETTVabUkzTWpNeElpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEUxVkRFNU9qSXpPak14TFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQnpkRVYyZERwamFHRnVaMlZrUFNJdklpOCtJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKellYWmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRHBpTldaaVpUZGlOaTFrWkRVNExXTTNOR0l0T0daa1ppMWlNbVEyTlRVMU5qYzVNVFFpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGd0TURNdE1ESlVNVEk2TWpBNk16TXRNRFU2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpSUhOMFJYWjBPbU5vWVc1blpXUTlJaThpTHo0Z1BDOXlaR1k2VTJWeFBpQThMM2h0Y0UxTk9raHBjM1J2Y25rK0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBpQThMM0prWmpwU1JFWStJRHd2ZURwNGJYQnRaWFJoUGlBOFAzaHdZV05yWlhRZ1pXNWtQU0p5SWo4KzM0MTNqd0FBQXVwSlJFRlVTTWZsbDg5dlZGVVV4ei9uM3Z1bTA0TGxWOER3YTFHUk5vUzR3S1lRNDBwd1JRZzdvd2x1Y0NFYk5xendEMkNIQ3pmS1FsZVd4QkJXSnBDNFF6WUVROExDS0tMU0FGV1VTSkJTeTB3Nzc5NXpYTHdwbmFZejB6cXYwWVZuY2llWm5KdjN2ZWY3L1o1ejM0aVo4VytINHorSTBDMTVjZndTRDI5ZXFlUVhYbm01TnIycElsblNwYWNXR3JFdXovWmVlVEs2NjlpRHFhSGYwb2t6Ny9RT2V1T3ptenVHcHQ3OGVHc2FHdE8xalg0bjhsd0xhOElyb0VHbE9qazZNWk05R0dmWVBnVnFQWU5PWG4vNjZ2ckcwNk43ZG00ZzE3UW9aeTNDWkFMRU5CcHZyZDhtYjh3OEJzNzNyT21qeXYyenMvMDFvZ2xSNDZLVmJHSFZVNklSWUNKOHYvWHFqMTk5WHNwSTM4MThNMXdQMDliQ2F0dW9BSTQrN2xkdWMvN3JUK1pLZ2NhTjlYTXY2THBaQVRLcmRseWVQaktCRjlQbVAxN2I5L29IcGR4N2VNZGJINlZiNmYxdkI2NmlZa2hMVHF6NFpZQWlWS093cWJZejdmMzU2SmVsUUE4T0huazdqMnZpRHo5ZDgxSG1XQXk3RUxsM0RPYURiR2YzNWlPbkQxWktnZDc1WmVMNGxqRFM5MUljbzJKOUdOcG1sNEFxaVBDWFRUTTVlZmM5R08xS3NYUWJnKy9LcWNZSVk5bkk4QWl5SVMrNG5HK1pKcjJDNEJXczM4anZCQzQvL0lKeCsxQjZyblNXdVpneGtQWExHcHhGUktWTm5ZS0pvU3FJZVFKWnZSUzlna014b2lTY0pLVEQrVTBkbWlDWkt6OTdGUzEwTkNubzdLQ0VpSUVBb21oYjNYdTZaUXlqcy9iT0RIRUdyT3lhWEFaVWlPU1lGZHAxWk1RVnVhUUp0NEk2WFBla3c1cDFkck9qMStKSXhiaVUxYURYV3I3YlIzTEdQM24vQ010dEVBUVI4QUxXWWZBN0JXdnVLdzJhRWZCTk1wSXR6TnNsbFFvRm9IVFhmb1Y5V2hnSnRHdWxvZ0cxaEpxdURyMitzQWpKckdPbFVJemZWZEhVTmFrU1o3Z0FGanQ1TGVHOXpEdWdMR2hHbFFHazdwRWdrT1lmNjFyOExJZ0pXb0dzWVFTeWNxQU5adjBqZnVYM2UzZWZUeVJwZnRvMWlTY3d6WisrRk9paGt3ZW1mTU92RFhQa1RrM25nVlIwU1MrckdDbUlHNjd1cnkzYmh2K2J2eFYvQThzVlFBZzgrZ0RZQUFBQUFFbEZUa1N1UW1DQyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWNrVXJsO1xyXG4gIH1cclxuXHJcbiAgY29udmVydE1pbGVzVG9GZWV0KG1pbGVzKSB7XHJcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtaWxlcyAqIDUyODApO1xyXG4gIH1cclxuXHJcbiAgcHVzaE5ld1RydWNrKG1hcHMsIHRydWNrSXRlbSkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICB2YXIgY3VycmVudE9iamVjdCA9IHRoaXM7XHJcbiAgICB2YXIgcGluTG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odHJ1Y2tJdGVtLmxhdCwgdHJ1Y2tJdGVtLmxvbmcpO1xyXG4gICAgdmFyIGRlc3RMb2MgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odHJ1Y2tJdGVtLndyTGF0LCB0cnVja0l0ZW0ud3JMb25nKTtcclxuICAgIHZhciBpY29uVXJsO1xyXG4gICAgdmFyIGluZm9Cb3hUcnVja1VybDtcclxuICAgIHZhciBOZXdQaW47XHJcbiAgICB2YXIgam9iSWRVcmwgPSAnJztcclxuXHJcbiAgICB2YXIgdHJ1Y2tDb2xvciA9IHRydWNrSXRlbS50cnVja0NvbC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWNvblVybCA9IHRoaXMuZ2V0SWNvblVybCh0cnVja0NvbG9yLCB0cnVja0l0ZW0ubGF0LCB0cnVja0l0ZW0ubG9uZywgdHJ1Y2tJdGVtLndyTGF0LCB0cnVja0l0ZW0ud3JMb25nKTtcclxuXHJcbiAgICBpZiAodHJ1Y2tDb2xvciA9PSAnZ3JlZW4nKSB7XHJcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXJDQVlBQUFEYmpjNnpBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRkdtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd05TMHdNVlF4TmpveE1Ub3hNQzB3TkRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TWpBdE1EUTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNakF0TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9UZGtaakUwWW1RdE5EQmhPQzAxTkRSakxUa3pPVEF0TTJSaU5tWmtZVFptTW1KbElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2TUdGa00ySXlaREl0T0RCaE5pMHhNRFJrTFRoaU56UXRaalZoWkRGbU1UaGxZekV5SWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T1Rka1pqRTBZbVF0TkRCaE9DMDFORFJqTFRrek9UQXRNMlJpTm1aa1lUWm1NbUpsSWo0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzVOMlJtTVRSaVpDMDBNR0U0TFRVME5HTXRPVE01TUMwelpHSTJabVJoTm1ZeVltVWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRFV0TURGVU1UWTZNVEU2TVRBdE1EUTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEM5eVpHWTZVMlZ4UGlBOEwzaHRjRTFOT2tocGMzUnZjbmsrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrT2R1SzNRQUFBdzlKUkVGVWFON3RtajFQRzBFUWh1OG51S2VoREowcmxOSlNKR3BIcENXeWxEWUY2YUFCVjZRaVFRS2xTUlJNRlNVRnBxTkJtQW9FQmFRZ3BEVGlRNVFHbXBTYmU5RnROQm4yem50M084ZDllS1NSYlRqdHZ2ZmM3c3pjN25xZWtDbWwycXJZZHVKN1RRcE9RL2R5LytkZWZUbllVTXU5dGR3N2RFSXZzYTRVb0MzZHc5U25sMnBzNFZsaEhIcXBKUVZROS8yajd6M2ZCMkZqOU5mTjcwTEIwWDdRUDBvR0tBRFRzNTNFNktneWdQeHJGemtBekZjMFJoMmpwbktBL092VytjaDQ4KzJ0c2ZGWDY2K3JCWWpEV2R4K0g5bDRwUUJ4T08rNjgwTWJyd3lnSkhBcUF5Z3BuRW9BU2dPbjlJRFN3aWsxSVAvN1NsbzRwUVhrZnpaZHdDa3pvTDRMT0tVRVJFZlBqNU51NnNiTENLaWpmenovOEdJRXlBQUlLMmZxY25EdHBQRXlBbko2TXlOQVF4elRsSnFMYVp1bFR5eE5xanV5N09wSlBHMjZKblF4dUZLem0zTnErdXRNN2gwNm9mZS9KVmNKUUhTYUZkeG1QYWw0Z1hxSzdSQVV6Ylowa1NnV1VER2ZzY0NHK29vdnplYlJtYlhGQVJYTlI0Q3lCSVRwb3lNL1B2TzBRWWpTZ21xekxUV2NBRUpuMzQ4M2pWRU5LWEo1ZC9YSndHQ241WlNVR05UMis0Y1AyVlVVRURMVG5VVm1na2lNc0N6aGhEMDBicC8zTjJRQTRlbndiV1ZrS0R3Vk9OLzR6eElTaDRONzBkcWdHMW1VYXNQMVRnSHg4anRzYnd6WDBTcmF4ZktKemFpMldleERhS0RhVE5QdFVaRm9Dd2hIUTJ3M0RnRUpLd05adll2UlY0TTQyazdad1FwRDlkL1FnUGFHM1l3V1lic2tRcWZqTU5HdWpxcllhcU1qanQ0dlFnU3pjUTJvcGYreWZiYnpLRzdndHpZMEVyZW1rS3l2Nk1pMjFVYnZSNTh2NEdlQ01HajRkczlQL1IvRUdrUjZwR3M0RFlBUVpDdGV4eXlkK2lVY3FUdUpOcHI2UTdKZm5RT3FVVWhobG1RRVpXVkpBSVZZSzJ5N3VSWWN2THlOcW0veXV0eGhxNDJYSy9UdC9WOWd0anlFU2IwVFoxdUlEdjBnQ1RRRXZSMlZ1cm16U3ZzOGFLT1c5bERtT0kxUlVVSU1jN3J1Q1Z0d293L2FvdDRKRGRwYVl1ZWUwUmxlQkpFVklNcTBYT2xVUUxTMlpnSnRIUWtoS3pIQ1F0dkwwR2k1WW1FZDZhZDFIdEg1bm5Xd2M2K3RUZ3RmZzBGM00wNmJmd0c0VHY4WHkraFBhQUFBQUFCSlJVNUVya0pnZ2c9PSc7XHJcbiAgICB9IGVsc2UgaWYgKHRydWNrQ29sb3IgPT0gJ3JlZCcpIHtcclxuICAgICAgaW5mb0JveFRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRWdBQUFBckNBWUFBQURiamM2ekFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFGRW1sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TlMwd01WUXhOam94TVRveU1TMHdORG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TWpNdE1EUTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TWpNdE1EUTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZaakExWTJWbU5EY3RNMk5qWWkwM1lqUTJMV0kxWmpRdE4ySTVNREF3TWpnMU1qbGxJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0o0YlhBdVpHbGtPbVl3TldObFpqUTNMVE5qWTJJdE4ySTBOaTFpTldZMExUZGlPVEF3TURJNE5USTVaU0lnZUcxd1RVMDZUM0pwWjJsdVlXeEViMk4xYldWdWRFbEVQU0o0YlhBdVpHbGtPbVl3TldObFpqUTNMVE5qWTJJdE4ySTBOaTFpTldZMExUZGlPVEF3TURJNE5USTVaU0krSUR4NGJYQk5UVHBJYVhOMGIzSjVQaUE4Y21SbU9sTmxjVDRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUltTnlaV0YwWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNlpqQTFZMlZtTkRjdE0yTmpZaTAzWWpRMkxXSTFaalF0TjJJNU1EQXdNamcxTWpsbElpQnpkRVYyZERwM2FHVnVQU0l5TURFNExUQTFMVEF4VkRFMk9qRXhPakl4TFRBME9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QcEtwY0tjQUFBTDRTVVJCVkdqZTdack5Tak14RklibkV1WVN1bmJWblZzMzdzVWJjRzVBNk5adW5LVTdYZWphNmcyMEYxQ3c2MjRVUVN3SS9rQkZFSXBGUVJDRW1MYzBjbnFjVERNenlUZy9QWEErOVdOSTNqeEpUazUrUE0rQkNTRkNVVzY3bE81N2p1QnNxRnErMzkvRjYvbTVlRGs1S2J4REovUVM2N29DMUZNMWpMYTN4ZVhhV21rY2VwazEwZ0JvU2orVWZpSDlUVGRHUDBlalVzRlIvakVjMG1hRVNjRmNtRTVpVkZRYlFQTERmUTRBOHhXRlVjZW9xUjBnK2RFcEh4bjN1N3VSaGQ4RlFiMEFjVGpqZzRQWXdtc0ZpTU41YXJlWEZsNGJRR25nMUFaUVdqaTFBSlFGVHVVQlpZVlRhVUR5bDZPc2NDb0xTUDZ6WlFOT2xRRTkySUJUWlVBem0vUjZtUXV2TktDYnpjMFZJQjJncitkbks0VlhGcEN0eHF3QUxYRk1VMm8ycG0yZWZyMit6bzlkVzU3dDNxWm5RbC9qc1hqYTJ4TjNPenVGZCtpRVhtYStkVUIwbXBYY1dpcUx0aDR2a0UreG9WbzI2OUU5bUpPQWl2bU1BemJrVi94b3Rvak9MSFFPcUd5K0FwUW5JRXdmRmZueHMwZ1hoRWd0cURiVFZNTUtJRlEyNlhZam94cVd5SmZqNDM4RGc1dVd6OXRiN1IwZFZsZW5nRXhYSm9qRUNNc1RqcTdUdUwyZW5ia0JoTjdoMThwWW9kQXJjSDd4bnlja0RnZHRVZHFnRzZzbzFZYnZyUUxpNmJmdWJnemYwU3pheHZHSnlhZzJPZXhEYUtEYW9xWmJaSkpvQWdoUFEwd3ZEZ0VKSndONTdjWG8xaUNKTm96d0pkbi94Z0tndU1Zb0VhWkhJblE2TGhOdDY2bUtxVFk2NG1oN0VTSzB6MTdVLzB6Ny9UOXhBMy8vQmpoWlNOS2N3bVYrUlVlMnFUYmFIdlcrSU9KTjBJRGZoVjB0dkFpVGtSN0xOWndHUUFneUZhOWlsbHI2WFRqZEhpVFJSanRQcy9vMU9TQ2ZRdEl1a1NsR1VGNldCcERHQXQxZHZEOS9lRG1OeTIrS2V0eGhxbzJuSzNUM3ZoQ1lEUjVoVXU4a3VSWmlPK05CUkhrMlBZeGJ1djhjNWkxbTJvL3pNdnlzanpJYk5FYkZDWW1ZMDAzUHNjMGJPdE1XdHllTTBCWTRlL2VNeXJBUnhLb0FVWnJqeXNETHdmak5zS0cyamdzaFJ3bkNRdWpsYU9pTUJObzZybnZyTWFieWdYR3dzNit0T2E5Zlo5QzlsYlRjSHhIQnhCN0o2ZVRWQUFBQUFFbEZUa1N1UW1DQyc7XHJcbiAgICB9IGVsc2UgaWYgKHRydWNrQ29sb3IgPT0gJ3llbGxvdycpIHtcclxuICAgICAgaW5mb0JveFRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRWdBQUFBc0NBWUFBQURHaVA0TEFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFGRW1sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TlMwd01WUXhOam94TVRvd05pMHdORG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TVRrdE1EUTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TVRrdE1EUTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVEF5TkRFNFkyRXROVE16TkMwNE5qUmpMV0ZoTm1FdFlUSmxORGsyWW1VMVltRTRJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0o0YlhBdVpHbGtPamt3TWpReE9HTmhMVFV6TXpRdE9EWTBZeTFoWVRaaExXRXlaVFE1Tm1KbE5XSmhPQ0lnZUcxd1RVMDZUM0pwWjJsdVlXeEViMk4xYldWdWRFbEVQU0o0YlhBdVpHbGtPamt3TWpReE9HTmhMVFV6TXpRdE9EWTBZeTFoWVRaaExXRXlaVFE1Tm1KbE5XSmhPQ0krSUR4NGJYQk5UVHBJYVhOMGIzSjVQaUE4Y21SbU9sTmxjVDRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUltTnlaV0YwWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9UQXlOREU0WTJFdE5UTXpOQzA0TmpSakxXRmhObUV0WVRKbE5EazJZbVUxWW1FNElpQnpkRVYyZERwM2FHVnVQU0l5TURFNExUQTFMVEF4VkRFMk9qRXhPakEyTFRBME9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QbktiSTVZQUFBTUpTVVJCVkdqZTdacTlTc1JBRUlEdkVTeDhBTUVYT0h3Qjd3blVKNUI3QUFWN0M2L1ZSa3V0dk01U1FRUWJPUVcxc2ZCQUxTejg0Um9id2JQUVFzeXRNMnMyVGphYlpQT3phMzV1WUZCUXNwTXZzek96czlOb1dCREcyQVRvYkFtMDJiQXBzT0FDNkJNcmw3eUJydUZITlEybnc4b3QxOFlnd1lOYjNqSmY3OHg1M0dITy9VYnhGZXhFZTRuc213SjBJRlp3emxycyszQ3lOSXIyVWtrTG9BbTZDZHB6OTZ4U1J1KzNwWUlqZFBSNmtRNlFDNmFudTRseG9kb0FjaU83WDJDLzRzTjhDbDVUTzBEd2Y3dXlaemhYaStvOWZEbGZMMEFCT0hlcjBVR3VUb0FDY1ByTDhWbWdMb0RTd0trTm9MUndhZ0VvQzV6S0E4b0twOUtBNFBldHJIQXFDOGh0UzJTR1UyVkFUM25BcVNRZzZqMmp3VjcyMDNBRkFYVzkxc1RKekJpUUF0QTEvKzF6a0U4L3BZS0FjbjJaTWFBNFFMQk5xZVN4YmEzcThUUmpYME56Z1BnWElEMGg5akZnVG44SlBHdXUrQXAyb3IyK2xxc0pRSFNibFZ4V0dxYmlCZFpUMGcxQjJlUkFGSW5tQWlyc1oyeXdZWDBWYU0wV1VDWHBtQWRVTWgwRHNnb0l0bytJL1B4bmdTNElzYlR3MmFaWmF1UUNDQmZEbUtJVVNKR2orL1gvQTNPMUNDWEdUY2dkM1RuUHJrWUIvV2FtWWZ5RklSaUpIbWExK2czN2FKSTREOXRtQU9IWGthK1ZNVVBoVitFcVhmemJoQ1RENFZsSjJJWmVoWCtudG9WMExkSURrc3J2MExzeFRPdjBaaldIOW9tV1YyczArM2hvSUxhcHRsdWdTTlFGaEtNaHVoZUhIT2Jud05wWmpCNE5rdGpHUFR5NittOEpRS2R4TCtNWm9ka1NvZHN4MXVpOFJsVTBiYU1lUjkrWGh3aS9UQWxBYmU5bFhvNkNjUU9waXdmQ1E1TFdGQ2JySytyWjJyYlI5M0huQytTWklIUWErYnFuL3pleE1lU1JIdE0xVnhJQTBTQnRRQ0ptdWFuZmlFTHFUbVViU2YwaDJhK3Bta0x0eDZiSUZCNWtTOUlBQ3BGMjFLZ3VEbDRPSSt1YmdyWTd0RzJUeWhWNmV2Y0NzK1lRSnRWdWttc2g2dnB1RW1nWjFFNVU2ZzQyODN5VjlyUDdqSW1zUTVsVHZoZ1ZZWWhpVHpjdHpHTS9lN1pGbkFrVnRyV056VDNqWW5nUTVJZFdNRXJWcnN6VmdQaUI5YVMyZFUwWXNwVWdMSFFzVC9XM0U5aW1EZWNIUmp4U21LK2JxZndBQUFBQVNVVk9SSzVDWUlJPSc7XHJcbiAgICB9IGVsc2UgaWYgKHRydWNrQ29sb3IgPT0gJ3B1cnBsZScpIHtcclxuICAgICAgaW5mb0JveFRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRWdBQUFBckNBWUFBQURiamM2ekFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFHdG1sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TXkwd00xUXhNVG96TVRvd05DMHdOVG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TkRrdE1EUTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TkRrdE1EUTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZNRGt3WVRBd1pUWXRPVE5tWmkxa1lqUTFMV0l4TWpFdE0ySTFNekJtTjJZeVpUUXdJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNk5USmtNV1F3TURndFlXTXhNeTAzTURRNUxUbG1PR010T1RoaU5UY3haREl6WWpJMElpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNll6STBPVGcwTUdVdE1tSmtNUzFrWkRReExUZzBZMkl0TVdRMFlqUmpOelZrTURreElqNGdQSGh0Y0UxTk9raHBjM1J2Y25rK0lEeHlaR1k2VTJWeFBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpWTNKbFlYUmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRHBqTWpRNU9EUXdaUzB5WW1ReExXUmtOREV0T0RSallpMHhaRFJpTkdNM05XUXdPVEVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGd0TURNdE1ETlVNVEU2TXpFNk1EUXRNRFU2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qSm1NemszTWpFNExUbG1NRFV0WlRjME1DMWlZMlk1TFROaU1tVmpNems1TURRM01pSWdjM1JGZG5RNmQyaGxiajBpTWpBeE9DMHdNeTB3TTFReE1Ub3pPVG93T0Mwd05Ub3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TURrd1lUQXdaVFl0T1RObVppMWtZalExTFdJeE1qRXRNMkkxTXpCbU4yWXlaVFF3SWlCemRFVjJkRHAzYUdWdVBTSXlNREU0TFRBMUxUQXhWREUyT2pFMU9qUTVMVEEwT2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BnWW9JNG9BQUFMOVNVUkJWR2plN1pxN1RodEJGSWIzRWZ3SVBJSWZnVGZBTlpXcjFPNkRoTHVVUUJzcHluWldpbkFMRFVoZ0YwZ2tVaVFpaDJZYjFrVW9rSkNNRUFWVXkvN0lBOGZIczd1enUzTTJlL0dSam56UmF1YmZiMmJPbkxrNGpwQUZRZEFQcW0yWG9iZWs0S3lxV3A0ZW40UHhvUmY4SGx5VjNxRVRlb250U1FIYVZ6Vjg3eDBIbjllK1ZjYWhsMXBXQU8zUXQwSWZoajZONnFOMy9yUlNjSlRmL0wzTkJtZ0dabWc2aUZGUll3Q0Z6MjV5QUJpdktJdzZlazNqQUlYUGZlVTk0K1RUdWJid280MWhzd0J4T0JkZkxtTUxieFFnRG1lMDh5dXg4TVlBeWdLbk1ZQ3l3bWtFb0R4d2FnOG9MNXhhQXdxL2IrZUZVMXRBNFdmSEJwdzZBL0p0d0trbElOcDd2RE0vZCtGMUJPU3FINE1QUjB0QUdrRFlPUXNlYmgrdEZGNUhRRlpmWmdrb3dURk1xZGtZdGtXNnU3NDd0KzNxU0xRMjNSUEMwTVhNK09Qaldla2RPcUYzYnN0VkFoQWRaaFczbmlNVkw5QWE3SVNnYXJhdmtrU3hnSXJ4akEwMjVGZDhhN2FNenF3dkRxaHF2Z1JVSkNBTUh4WDU4Vm1tQTBLa0ZsU2JhYXBoQlJBcTgwNTliVlRERklrajNQOEZCaWN0ZDlmVHlETTZ6SzZpZ0V4bkpvaEVEeXNTVGxTamNSc2ZlREtBMERyOFdCa3pGRm9GemcvK2k0VEU0ZUJkbERib3hpeEt0ZUY1cTRCNCtoMTFOb2JuYUJadFkvdkVwRmViYlBZaE5GQnR1dUcya0NTYUFrSmNNVDA0QkNTYXJrdXZ4V2hkYWJTaGh5ZGsvNnNLMENqcFpWU2hwbHNpZERnbWliWjFWY1ZVRysxeDlIMFJJcGl0S0VCZDlZLy84OTlDM01EdnR3QjM2S1hPS1NUeks5cXpUYlhSOTFIM0MvaWRJSFFhZnR6elorNUcyTUg3alRBYUFOTk00U3BtcWFsZnd1bnlJSTAyMm5nUnMxK2JBMnBSU0pGVFpJWWVWSlJsQVJSaDNhamo1dGJzNHVWOVhINVQxdTBPVTIwOFhhR3I5N2ZBYkhnSms3cWI1bGlJcll4SG12SnNlajl1Nmw3WXpKdlB0Q2V6TWxwNUwyV3UwQmdWSjBRenB0dU9zTTFlOUZWYjNKcFFvNjByZHU4WmxXRWhpRmtCb25UYmxWWUZ4R3ZyWk5EbVNnalpUaEVXK2s2QlJ0TVZBM09sVzJzU1UvbklPTmpaMTlhbWlhL0dvTHVUcHN3WG9hVHdzbktBa2RFQUFBQUFTVVZPUks1Q1lJST0nO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBmZWV0Zm9yTWlsZXMgPSAwLjAwMDE4OTM5NDtcclxuICAgIHZhciBtaWVsc1RvZGlzcGF0Y2ggPSBwYXJzZUZsb2F0KHRydWNrSXRlbS5kaXN0KS50b0ZpeGVkKDIpO1xyXG5cclxuICAgIHRoaXMucmVzdWx0cy5wdXNoKHtcclxuICAgICAgZGlzcGxheTogdHJ1Y2tJdGVtLnRydWNrSWQgKyBcIiA6IFwiICsgdHJ1Y2tJdGVtLnRlY2hJRCxcclxuICAgICAgdmFsdWU6IDEsXHJcbiAgICAgIExhdGl0dWRlOiB0cnVja0l0ZW0ubGF0LFxyXG4gICAgICBMb25naXR1ZGU6IHRydWNrSXRlbS5sb25nXHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgdHJ1Y2tVcmwgPSB0aGlzLmdldFRydWNrVXJsKHRydWNrQ29sb3IpO1xyXG4gICAgY29uc3QgbGlzdE9mUHVzaFBpbnMgPSBtYXBzLmVudGl0aWVzO1xyXG4gICAgdmFyIGlzTmV3VHJ1Y2sgPSB0cnVlO1xyXG5cclxuICAgIHZhciBtZXRhZGF0YSA9IHtcclxuICAgICAgdHJ1Y2tJZDogdHJ1Y2tJdGVtLnRydWNrSWQsXHJcbiAgICAgIEFUVFVJRDogdHJ1Y2tJdGVtLnRlY2hJRCxcclxuICAgICAgdHJ1Y2tTdGF0dXM6IHRydWNrSXRlbS50cnVja0NvbCxcclxuICAgICAgdHJ1Y2tDb2w6IHRydWNrSXRlbS50cnVja0NvbCxcclxuICAgICAgam9iVHlwZTogdHJ1Y2tJdGVtLmpvYlR5cGUsXHJcbiAgICAgIFdSSm9iVHlwZTogdHJ1Y2tJdGVtLndvcmtUeXBlLFxyXG4gICAgICBXUlN0YXR1czogdHJ1Y2tJdGVtLndyU3RhdCxcclxuICAgICAgQXNzaW5nZWRXUklEOiB0cnVja0l0ZW0ud3JJRCxcclxuICAgICAgU3BlZWQ6IHRydWNrSXRlbS5zcGVlZCxcclxuICAgICAgRGlzdGFuY2U6IG1pZWxzVG9kaXNwYXRjaCxcclxuICAgICAgQ3VycmVudElkbGVUaW1lOiB0cnVja0l0ZW0uaWRsZVRpbWUsXHJcbiAgICAgIEVUQTogdHJ1Y2tJdGVtLnRvdElkbGVUaW1lLFxyXG4gICAgICBFbWFpbDogJycsLy8gdHJ1Y2tJdGVtLkVtYWlsLFxyXG4gICAgICBNb2JpbGU6ICcnLCAvLyB0cnVja0l0ZW0uTW9iaWxlLFxyXG4gICAgICBpY29uOiBpY29uVXJsLFxyXG4gICAgICBpY29uSW5mbzogaW5mb0JveFRydWNrVXJsLFxyXG4gICAgICBDdXJyZW50TGF0OiB0cnVja0l0ZW0ubGF0LFxyXG4gICAgICBDdXJyZW50TG9uZzogdHJ1Y2tJdGVtLmxvbmcsXHJcbiAgICAgIFdSTGF0OiB0cnVja0l0ZW0ud3JMYXQsXHJcbiAgICAgIFdSTG9uZzogdHJ1Y2tJdGVtLndyTG9uZyxcclxuICAgICAgdGVjaElkczogdGhpcy5yZXBvcnRpbmdUZWNobmljaWFucyxcclxuICAgICAgam9iSWQ6IHRydWNrSXRlbS5qb2JJZCxcclxuICAgICAgbWFuYWdlcklkczogdGhpcy5tYW5hZ2VySWRzLFxyXG4gICAgICB3b3JrQWRkcmVzczogdHJ1Y2tJdGVtLndvcmtBZGRyZXNzLFxyXG4gICAgICBzYmNWaW46IHRydWNrSXRlbS5zYmNWaW4sXHJcbiAgICAgIGN1c3RvbWVyTmFtZTogdHJ1Y2tJdGVtLmN1c3RvbWVyTmFtZSxcclxuICAgICAgdGVjaG5pY2lhbk5hbWU6IHRydWNrSXRlbS50ZWNobmljaWFuTmFtZSxcclxuICAgICAgZGlzcGF0Y2hUaW1lOiB0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lLFxyXG4gICAgICByZWdpb246IHRydWNrSXRlbS56b25lXHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBqb2JJZFN0cmluZyA9ICdodHRwOi8vZWRnZS1lZHQuaXQuYXR0LmNvbS9jZ2ktYmluL2VkdF9qb2JpbmZvLmNnaT8nO1xyXG5cclxuICAgIGxldCB6b25lID0gdHJ1Y2tJdGVtLnpvbmU7XHJcblxyXG4gICAgLy8gPSBNIGZvciBNV1xyXG4gICAgLy8gPSBXIGZvciBXZXN0XHJcbiAgICAvLyA9IEIgZm9yIFNFXHJcbiAgICAvLyA9IFMgZm9yIFNXXHJcbiAgICBpZiAoem9uZSAhPSBudWxsICYmIHpvbmUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGlmICh6b25lID09PSAnTVcnKSB7XHJcbiAgICAgICAgem9uZSA9ICdNJztcclxuICAgICAgfSBlbHNlIGlmICh6b25lID09PSAnU0UnKSB7XHJcbiAgICAgICAgem9uZSA9ICdCJ1xyXG4gICAgICB9IGVsc2UgaWYgKHpvbmUgPT09ICdTVycpIHtcclxuICAgICAgICB6b25lID0gJ1MnXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHpvbmUgPSAnJztcclxuICAgIH1cclxuXHJcbiAgICBqb2JJZFN0cmluZyA9IGpvYklkU3RyaW5nICsgJ2VkdF9yZWdpb249JyArIHpvbmUgKyAnJndyaWQ9JyArIHRydWNrSXRlbS53cklEO1xyXG5cclxuICAgIHRydWNrSXRlbS5qb2JJZCA9IHRydWNrSXRlbS5qb2JJZCA9PSB1bmRlZmluZWQgfHwgdHJ1Y2tJdGVtLmpvYklkID09IG51bGwgPyAnJyA6IHRydWNrSXRlbS5qb2JJZDtcclxuXHJcbiAgICBpZiAodHJ1Y2tJdGVtLmpvYklkICE9ICcnKSB7XHJcbiAgICAgIGpvYklkVXJsID0gJzxhIGhyZWY9XCInICsgam9iSWRTdHJpbmcgKyAnXCIgdGFyZ2V0PVwiX2JsYW5rXCIgdGl0bGU9XCJDbGljayBoZXJlIHRvIHNlZSBhY3R1YWwgRm9yY2UvRWRnZSBqb2IgZGF0YVwiPicgKyB0cnVja0l0ZW0uam9iSWQgKyAnPC9hPic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRydWNrSXRlbS5kaXNwYXRjaFRpbWUgIT0gbnVsbCAmJiB0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lICE9IHVuZGVmaW5lZCAmJiB0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lICE9ICcnKSB7XHJcbiAgICAgIGxldCBkaXNwYXRjaERhdGUgPSB0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lLnNwbGl0KCc6Jyk7XHJcbiAgICAgIGxldCBkdCA9IGRpc3BhdGNoRGF0ZVswXSArICcgJyArIGRpc3BhdGNoRGF0ZVsxXSArICc6JyArIGRpc3BhdGNoRGF0ZVsyXSArICc6JyArIGRpc3BhdGNoRGF0ZVszXTtcclxuICAgICAgbWV0YWRhdGEuZGlzcGF0Y2hUaW1lID0gdGhhdC5VVENUb1RpbWVab25lKGR0KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBVcGRhdGUgaW4gdGhlIFRydWNrV2F0Y2hMaXN0IHNlc3Npb25cclxuICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja1dhdGNoTGlzdCcpICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMudHJ1Y2tMaXN0ID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja1dhdGNoTGlzdCcpKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnRydWNrTGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudHJ1Y2tMaXN0LnNvbWUoeCA9PiB4LnRydWNrSWQgPT0gdHJ1Y2tJdGVtLnRydWNrSWQpID09IHRydWUpIHtcclxuICAgICAgICAgIGxldCBpdGVtID0gdGhpcy50cnVja0xpc3QuZmluZCh4ID0+IHgudHJ1Y2tJZCA9PSB0cnVja0l0ZW0udHJ1Y2tJZCk7XHJcbiAgICAgICAgICBjb25zdCBpbmRleDogbnVtYmVyID0gdGhpcy50cnVja0xpc3QuaW5kZXhPZihpdGVtKTtcclxuICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgaXRlbS5EaXN0YW5jZSA9IG1ldGFkYXRhLkRpc3RhbmNlO1xyXG4gICAgICAgICAgICBpdGVtLmljb24gPSBtZXRhZGF0YS5pY29uO1xyXG4gICAgICAgICAgICB0aGlzLnRydWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLnRydWNrTGlzdC5zcGxpY2UoaW5kZXgsIDAsIGl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tXYXRjaExpc3QnLCB0aGlzLnRydWNrTGlzdCk7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFVwZGF0ZSBpbiB0aGUgU2VsZWN0ZWRUcnVjayBzZXNzaW9uXHJcbiAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tEZXRhaWxzJykgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XHJcbiAgICAgIHNlbGVjdGVkVHJ1Y2sgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrRGV0YWlscycpKTtcclxuXHJcbiAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcclxuICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjay50cnVja0lkID09IHRydWNrSXRlbS50cnVja0lkKSB7XHJcbiAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdUcnVja0RldGFpbHMnKTtcclxuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja0RldGFpbHMnLCBtZXRhZGF0YSk7XHJcbiAgICAgICAgICBzZWxlY3RlZFRydWNrID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy50cnVja0l0ZW1zLmxlbmd0aCA+IDAgJiYgdGhpcy50cnVja0l0ZW1zLnNvbWUoeCA9PiB4LnRvTG93ZXJDYXNlKCkgPT0gdHJ1Y2tJdGVtLnRydWNrSWQudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgaXNOZXdUcnVjayA9IGZhbHNlO1xyXG4gICAgICAvLyBJZiBpdCBpcyBub3QgYSBuZXcgdHJ1Y2sgdGhlbiBtb3ZlIHRoZSB0cnVjayB0byBuZXcgbG9jYXRpb25cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0T2ZQdXNoUGlucy5nZXRMZW5ndGgoKTsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGxpc3RPZlB1c2hQaW5zLmdldChpKS5tZXRhZGF0YS50cnVja0lkID09PSB0cnVja0l0ZW0udHJ1Y2tJZCkge1xyXG4gICAgICAgICAgdmFyIGN1clB1c2hQaW4gPSBsaXN0T2ZQdXNoUGlucy5nZXQoaSk7XHJcbiAgICAgICAgICBjdXJQdXNoUGluLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcbiAgICAgICAgICBkZXN0TG9jID0gcGluTG9jYXRpb247XHJcbiAgICAgICAgICBwaW5Mb2NhdGlvbiA9IGxpc3RPZlB1c2hQaW5zLmdldChpKS5nZXRMb2NhdGlvbigpO1xyXG5cclxuICAgICAgICAgIGxldCB0cnVja0lkUmFuSWQgPSB0cnVja0l0ZW0udHJ1Y2tJZCArICdfJyArIE1hdGgucmFuZG9tKCk7XHJcblxyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb25UcnVja0xpc3QuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uaW5kZXhPZih0cnVja0l0ZW0udHJ1Y2tJZCkgPiAtMSkge1xyXG4gICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb25UcnVja0xpc3QucHVzaCh0cnVja0lkUmFuSWQpO1xyXG5cclxuICAgICAgICAgIHRoaXMubG9hZERpcmVjdGlvbnModGhpcywgcGluTG9jYXRpb24sIGRlc3RMb2MsIGksIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpO1xyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudHJ1Y2tJdGVtcy5wdXNoKHRydWNrSXRlbS50cnVja0lkKTtcclxuICAgICAgTmV3UGluID0gbmV3IE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4ocGluTG9jYXRpb24sIHsgaWNvbjogdHJ1Y2tVcmwgfSk7XHJcblxyXG4gICAgICBOZXdQaW4ubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgICAgdGhpcy5tYXAuZW50aXRpZXMucHVzaChOZXdQaW4pO1xyXG5cclxuICAgICAgdGhpcy5kYXRhTGF5ZXIucHVzaChOZXdQaW4pO1xyXG4gICAgICBpZiAodGhpcy5pc01hcExvYWRlZCkge1xyXG4gICAgICAgIHRoaXMuaXNNYXBMb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm1hcC5zZXRWaWV3KHsgY2VudGVyOiBwaW5Mb2NhdGlvbiwgem9vbTogdGhpcy5sYXN0Wm9vbUxldmVsIH0pO1xyXG4gICAgICAgIHRoYXQubGFzdFpvb21MZXZlbCA9IHRoaXMubWFwLmdldFpvb20oKTtcclxuICAgICAgICB0aGF0Lmxhc3RMb2NhdGlvbiA9IHRoaXMubWFwLmdldENlbnRlcigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihOZXdQaW4sICdtb3VzZW91dCcsIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pbmZvYm94LnNldE9wdGlvbnMoeyB2aXNpYmxlOiBmYWxzZSB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPCAxMDI0KSB7XHJcbiAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoTmV3UGluLCAnY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5pbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAgICAgICBzaG93UG9pbnRlcjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9jYXRpb246IGUudGFyZ2V0LmdldExvY2F0aW9uKCksXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgb2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMCwgMjApLFxyXG4gICAgICAgICAgICBodG1sQ29udGVudDogJzxkaXYgY2xhc3MgPSBcImluZnkgaW5meU1hcHBvcHVwXCI+J1xyXG4gICAgICAgICAgICAgICsgZ2V0SW5mb0JveEhUTUwoZS50YXJnZXQubWV0YWRhdGEsIHRoaXMudGhyZXNob2xkVmFsdWUsIGpvYklkVXJsKSArICc8L2Rpdj4nXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLnRydWNrV2F0Y2hMaXN0ID0gW3sgVHJ1Y2tJZDogZS50YXJnZXQubWV0YWRhdGEudHJ1Y2tJZCwgRGlzdGFuY2U6IGUudGFyZ2V0Lm1ldGFkYXRhLkRpc3RhbmNlIH1dO1xyXG5cclxuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJywgZS50YXJnZXQubWV0YWRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrRGV0YWlscycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcclxuXHJcbiAgICAgICAgICAvLyBBIGJ1ZmZlciBsaW1pdCB0byB1c2UgdG8gc3BlY2lmeSB0aGUgaW5mb2JveCBtdXN0IGJlIGF3YXkgZnJvbSB0aGUgZWRnZXMgb2YgdGhlIG1hcC5cclxuXHJcbiAgICAgICAgICB2YXIgYnVmZmVyID0gMzA7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveE9mZnNldCA9IHRoYXQuaW5mb2JveC5nZXRPZmZzZXQoKTtcclxuICAgICAgICAgIHZhciBpbmZvYm94QW5jaG9yID0gdGhhdC5pbmZvYm94LmdldEFuY2hvcigpO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hMb2NhdGlvbiA9IG1hcHMudHJ5TG9jYXRpb25Ub1BpeGVsKGUudGFyZ2V0LmdldExvY2F0aW9uKCksIE1pY3Jvc29mdC5NYXBzLlBpeGVsUmVmZXJlbmNlLmNvbnRyb2wpO1xyXG4gICAgICAgICAgdmFyIGR4ID0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94T2Zmc2V0LnggLSBpbmZvYm94QW5jaG9yLng7XHJcbiAgICAgICAgICB2YXIgZHkgPSBpbmZvYm94TG9jYXRpb24ueSAtIDI1IC0gaW5mb2JveEFuY2hvci55O1xyXG5cclxuICAgICAgICAgIGlmIChkeSA8IGJ1ZmZlcikgeyAvLyBJbmZvYm94IG92ZXJsYXBzIHdpdGggdG9wIG9mIG1hcC5cclxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxyXG4gICAgICAgICAgICBkeSAqPSAtMTtcclxuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYnVmZmVyIGZyb20gdGhlIHRvcCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgIGR5ICs9IGJ1ZmZlcjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHkgaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhhbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxyXG4gICAgICAgICAgICBkeSA9IDA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGR4IDwgYnVmZmVyKSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIGxlZnQgc2lkZSBvZiBtYXAuXHJcbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cclxuICAgICAgICAgICAgZHggKj0gLTE7XHJcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIGxlZnQgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICBkeCArPSBidWZmZXI7XHJcbiAgICAgICAgICB9IGVsc2UgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCByaWdodCBzaWRlIG9mIG1hcC5cclxuICAgICAgICAgICAgZHggPSBtYXBzLmdldFdpZHRoKCkgLSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hBbmNob3IueCAtIHRoYXQuaW5mb2JveC5nZXRXaWR0aCgpO1xyXG4gICAgICAgICAgICAvLyAjIyMjIElmIGR4IGlzIGdyZWF0ZXIgdGhhbiB6ZXJvIHRoZW4gaXQgZG9lcyBub3Qgb3ZlcmxhcC5cclxuICAgICAgICAgICAgaWYgKGR4ID4gYnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgZHggPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgICBkeCAtPSBidWZmZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyAjIyMjIEFkanVzdCB0aGUgbWFwIHNvIGluZm9ib3ggaXMgaW4gdmlld1xyXG4gICAgICAgICAgaWYgKGR4ICE9IDAgfHwgZHkgIT0gMCkge1xyXG4gICAgICAgICAgICBtYXBzLnNldFZpZXcoe1xyXG4gICAgICAgICAgICAgIGNlbnRlck9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KGR4LCBkeSksXHJcbiAgICAgICAgICAgICAgY2VudGVyOiBtYXBzLmdldENlbnRlcigpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XHJcbiAgICAgICAgICBzZWxlY3RlZFRydWNrID0gdGhpcy5tYXBTZXJ2aWNlLnJldHJpZXZlRGF0YUZyb21TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycpO1xyXG5cclxuICAgICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXHJcbiAgICAgICAgICAgICAgeCA9PiB4LmF0dHVpZC50b0xvd2VyQ2FzZSgpID09IHNlbGVjdGVkVHJ1Y2suQVRUVUlELnRvTG93ZXJDYXNlKCkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhblBob25lID0gdGVjaG5pY2lhbkRldGFpbHMucGhvbmU7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMuaW5mb2JveCwgJ2NsaWNrJywgdmlld1RydWNrRGV0YWlscyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoTmV3UGluLCAnbW91c2VvdmVyJywgKGUpID0+IHtcclxuICAgICAgICAgIHRoaXMuaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgICAgICAgc2hvd1BvaW50ZXI6IHRydWUsXHJcbiAgICAgICAgICAgIGxvY2F0aW9uOiBlLnRhcmdldC5nZXRMb2NhdGlvbigpLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93Q2xvc2VCdXR0b246IHRydWUsXHJcbiAgICAgICAgICAgIG9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDAsIDIwKSxcclxuICAgICAgICAgICAgaHRtbENvbnRlbnQ6ICc8ZGl2IGNsYXNzID0gXCJpbmZ5IGluZnlNYXBwb3B1cFwiPidcclxuICAgICAgICAgICAgICArIGdldEluZm9Cb3hIVE1MKGUudGFyZ2V0Lm1ldGFkYXRhLCB0aGlzLnRocmVzaG9sZFZhbHVlLCBqb2JJZFVybCkgKyAnPC9kaXY+J1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGhpcy50cnVja1dhdGNoTGlzdCA9IFt7IFRydWNrSWQ6IGUudGFyZ2V0Lm1ldGFkYXRhLnRydWNrSWQsIERpc3RhbmNlOiBlLnRhcmdldC5tZXRhZGF0YS5EaXN0YW5jZSB9XTtcclxuXHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcclxuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja0RldGFpbHMnLCBlLnRhcmdldC5tZXRhZGF0YSk7XHJcblxyXG4gICAgICAgICAgLy8gQSBidWZmZXIgbGltaXQgdG8gdXNlIHRvIHNwZWNpZnkgdGhlIGluZm9ib3ggbXVzdCBiZSBhd2F5IGZyb20gdGhlIGVkZ2VzIG9mIHRoZSBtYXAuXHJcblxyXG4gICAgICAgICAgdmFyIGJ1ZmZlciA9IDMwO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hPZmZzZXQgPSB0aGF0LmluZm9ib3guZ2V0T2Zmc2V0KCk7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveEFuY2hvciA9IHRoYXQuaW5mb2JveC5nZXRBbmNob3IoKTtcclxuICAgICAgICAgIHZhciBpbmZvYm94TG9jYXRpb24gPSBtYXBzLnRyeUxvY2F0aW9uVG9QaXhlbChlLnRhcmdldC5nZXRMb2NhdGlvbigpLCBNaWNyb3NvZnQuTWFwcy5QaXhlbFJlZmVyZW5jZS5jb250cm9sKTtcclxuICAgICAgICAgIHZhciBkeCA9IGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveE9mZnNldC54IC0gaW5mb2JveEFuY2hvci54O1xyXG4gICAgICAgICAgdmFyIGR5ID0gaW5mb2JveExvY2F0aW9uLnkgLSAyNSAtIGluZm9ib3hBbmNob3IueTtcclxuXHJcbiAgICAgICAgICBpZiAoZHkgPCBidWZmZXIpIHsgLy8gSW5mb2JveCBvdmVybGFwcyB3aXRoIHRvcCBvZiBtYXAuXHJcbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cclxuICAgICAgICAgICAgZHkgKj0gLTE7XHJcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGJ1ZmZlciBmcm9tIHRoZSB0b3AgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICBkeSArPSBidWZmZXI7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAjIyMjIElmIGR5IGlzIGdyZWF0ZXIgdGhhbiB6ZXJvIHRoYW4gaXQgZG9lcyBub3Qgb3ZlcmxhcC5cclxuICAgICAgICAgICAgZHkgPSAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChkeCA8IGJ1ZmZlcikgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCBsZWZ0IHNpZGUgb2YgbWFwLlxyXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXHJcbiAgICAgICAgICAgIGR4ICo9IC0xO1xyXG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgZHggKz0gYnVmZmVyO1xyXG4gICAgICAgICAgfSBlbHNlIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggcmlnaHQgc2lkZSBvZiBtYXAuXHJcbiAgICAgICAgICAgIGR4ID0gbWFwcy5nZXRXaWR0aCgpIC0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94QW5jaG9yLnggLSB0aGF0LmluZm9ib3guZ2V0V2lkdGgoKTtcclxuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeCBpcyBncmVhdGVyIHRoYW4gemVybyB0aGVuIGl0IGRvZXMgbm90IG92ZXJsYXAuXHJcbiAgICAgICAgICAgIGlmIChkeCA+IGJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgIGR4ID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSByaWdodCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgICAgZHggLT0gYnVmZmVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gIyMjIyBBZGp1c3QgdGhlIG1hcCBzbyBpbmZvYm94IGlzIGluIHZpZXdcclxuICAgICAgICAgIGlmIChkeCAhPSAwIHx8IGR5ICE9IDApIHtcclxuICAgICAgICAgICAgbWFwcy5zZXRWaWV3KHtcclxuICAgICAgICAgICAgICBjZW50ZXJPZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludChkeCwgZHkpLFxyXG4gICAgICAgICAgICAgIGNlbnRlcjogbWFwcy5nZXRDZW50ZXIoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoaXMubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcclxuXHJcbiAgICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhpcy5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxyXG4gICAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0ZWNobmljaWFuRGV0YWlscyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbk5hbWUgPSB0ZWNobmljaWFuRGV0YWlscy5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLmluZm9ib3gsICdjbGljaycsIHZpZXdUcnVja0RldGFpbHMpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIobWFwcywgJ3ZpZXdjaGFuZ2UnLCBtYXBWaWV3Q2hhbmdlZCk7XHJcblxyXG4gICAgICAvLyB0aGlzLkNoYW5nZVRydWNrRGlyZWN0aW9uKHRoaXMsIE5ld1BpbiwgZGVzdExvYywgdHJ1Y2tVcmwpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1hcFZpZXdDaGFuZ2VkKGUpIHtcclxuICAgICAgdGhhdC5sYXN0Wm9vbUxldmVsID0gbWFwcy5nZXRab29tKCk7XHJcbiAgICAgIHRoYXQubGFzdExvY2F0aW9uID0gbWFwcy5nZXRDZW50ZXIoKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG1vdXNld2hlZWxDaGFuZ2VkKGUpIHtcclxuICAgICAgdGhhdC5sYXN0Wm9vbUxldmVsID0gbWFwcy5nZXRab29tKCk7XHJcbiAgICAgIHRoYXQubGFzdExvY2F0aW9uID0gbWFwcy5nZXRDZW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRJbmZvQm94SFRNTChkYXRhOiBhbnksIHRWYWx1ZSwgam9iSWQpOiBTdHJpbmcge1xyXG5cclxuICAgICAgaWYgKCFkYXRhLlNwZWVkKSB7XHJcbiAgICAgICAgZGF0YS5TcGVlZCA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjbGFzc05hbWUgPSBcIlwiO1xyXG4gICAgICB2YXIgc3R5bGVMZWZ0ID0gXCJcIjtcclxuICAgICAgdmFyIHJlYXNvbiA9ICcnO1xyXG4gICAgICBpZiAoZGF0YS50cnVja1N0YXR1cyAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoZGF0YS50cnVja1N0YXR1cy50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICdyZWQnKSB7XHJcbiAgICAgICAgICByZWFzb24gPSBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi10b3A6M3B4O2NvbG9yOnJlZDsnPlJlYXNvbjogQ3VtdWxhdGl2ZSBpZGxlIHRpbWUgaXMgYmV5b25kIFwiICsgdFZhbHVlICsgXCIgbWluczwvZGl2PlwiO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS50cnVja1N0YXR1cy50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICdwdXJwbGUnKSB7XHJcbiAgICAgICAgICByZWFzb24gPSBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi10b3A6M3B4O2NvbG9yOnB1cnBsZTsnPlJlYXNvbjogVHJ1Y2sgaXMgZHJpdmVuIGdyZWF0ZXIgdGhhbiA3NSBtL2g8L2Rpdj5cIjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBpbmZvYm94RGF0YSA9ICcnO1xyXG5cclxuICAgICAgZGF0YS5jdXN0b21lck5hbWUgPSBkYXRhLmN1c3RvbWVyTmFtZSA9PSB1bmRlZmluZWQgfHwgZGF0YS5jdXN0b21lck5hbWUgPT0gbnVsbCA/ICcnIDogZGF0YS5jdXN0b21lck5hbWU7XHJcblxyXG4gICAgICBkYXRhLmRpc3BhdGNoVGltZSA9IGRhdGEuZGlzcGF0Y2hUaW1lID09IHVuZGVmaW5lZCB8fCBkYXRhLmRpc3BhdGNoVGltZSA9PSBudWxsID8gJycgOiBkYXRhLmRpc3BhdGNoVGltZTtcclxuXHJcbiAgICAgIGRhdGEuam9iSWQgPSBkYXRhLmpvYklkID09IHVuZGVmaW5lZCB8fCBkYXRhLmpvYklkID09IG51bGwgPyAnJyA6IGRhdGEuam9iSWQ7XHJcblxyXG4gICAgICBkYXRhLndvcmtBZGRyZXNzID0gZGF0YS53b3JrQWRkcmVzcyA9PSB1bmRlZmluZWQgfHwgZGF0YS53b3JrQWRkcmVzcyA9PSBudWxsID8gJycgOiBkYXRhLndvcmtBZGRyZXNzO1xyXG5cclxuICAgICAgZGF0YS5zYmNWaW4gPSBkYXRhLnNiY1ZpbiA9PSB1bmRlZmluZWQgfHwgZGF0YS5zYmNWaW4gPT0gbnVsbCB8fCBkYXRhLnNiY1ZpbiA9PSAnJyA/ICcnIDogZGF0YS5zYmNWaW47XHJcblxyXG4gICAgICBkYXRhLnRlY2huaWNpYW5OYW1lID0gZGF0YS50ZWNobmljaWFuTmFtZSA9PSB1bmRlZmluZWQgfHwgZGF0YS50ZWNobmljaWFuTmFtZSA9PSBudWxsIHx8IGRhdGEudGVjaG5pY2lhbk5hbWUgPT0gJycgPyAnJyA6IGRhdGEudGVjaG5pY2lhbk5hbWU7XHJcblxyXG4gICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPCAxMDI0KSB7XHJcbiAgICAgICAgaW5mb2JveERhdGEgPSBcIjxkaXYgY2xhc3M9J3BvcE1vZGFsQ29udGFpbmVyJz48ZGl2IGNsYXNzPSdwb3BNb2RhbEhlYWRlcic+PGltZyBzcmM9J1wiICsgZGF0YS5pY29uSW5mbyArIFwiJyA+PGEgY2xhc3M9J2RldGFpbHMnIHRpdGxlPSdDbGljayBoZXJlIHRvIHNlZSB0ZWNobmljaWFuIGRldGFpbHMnID5WaWV3IERldGFpbHM8L2E+PGkgY2xhc3M9J2ZhIGZhLXRpbWVzJyBhcmlhLWhpZGRlbj0ndHJ1ZScgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+PC9pPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGhyLz48ZGl2IGNsYXNzPSdwb3BNb2RhbEJvZHknPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+VmVoaWNsZSBOdW1iZXIgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5zYmNWaW4gKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+VlRTIFVuaXQgSUQgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS50cnVja0lkICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkpvYiBUeXBlIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuam9iVHlwZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5Kb2IgSWQgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgam9iSWQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+QVRUVUlEIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuQVRUVUlEICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPlRlY2huaWNpYW4gTmFtZSA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLnRlY2huaWNpYW5OYW1lICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkN1c3RvbWVyIE5hbWUgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5jdXN0b21lck5hbWUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+RGlzcGF0Y2ggVGltZTo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuZGlzcGF0Y2hUaW1lICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtMTInPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sLTEyIGNvbC1zbS0xMiBjb2wtZm9ybS1sYWJlbCc+Sm9iIEFkZHJlc3MgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sLTEyIGNvbC1zbS0xMic+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsIGNvbC1mb3JtLWxhYmVsLWZ1bGwnPlwiICsgZGF0YS53b3JrQWRkcmVzcyArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgbWV0ZXJDYWwnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLTEyIGNvbC1tZC00Jz48c3Ryb25nPlwiICsgZGF0YS5TcGVlZCArIFwiPC9zdHJvbmc+IG1waCA8c3BhbiBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5TcGVlZDwvc3Bhbj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtbWQtNCc+PHN0cm9uZz5cIiArIGRhdGEuRVRBICsgXCI8L3N0cm9uZz4gTWlucyA8c3BhbiBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5DdW11bGF0aXZlIElkbGUgTWludXRlczwvc3Bhbj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtbWQtNCc+PHN0cm9uZz5cIiArIHRoYXQuY29udmVydE1pbGVzVG9GZWV0KGRhdGEuRGlzdGFuY2UpICsgXCI8L3N0cm9uZz4gRnQgPHNwYW4gY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+RmVldCB0byBKb2IgU2l0ZTwvc3Bhbj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+IDxoci8+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdwb3BNb2RhbEZvb3Rlcic+PGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbCBjb2wtbWQtNCc+PGkgY2xhc3M9J2ZhIGZhLWNvbW1lbnRpbmcnPjwvaT48c3BhbiBjbGFzcz0nc21zJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBTTVMnID5TTVM8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wgY29sLW1kLTQnPjxpIGNsYXNzPSdmYSBmYS1lbnZlbG9wZScgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48c3BhbiBjbGFzcz0nZW1haWwnIHRpdGxlPSdDbGljayB0byBzZW5kIGVtYWlsJyA+RW1haWw8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wgY29sLW1kLTQnPjxpIGNsYXNzPSdmYSBmYS1leWUnIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PHNwYW4gY2xhc3M9J3dhdGNobGlzdCcgdGl0bGU9J0NsaWNrIHRvIGFkZCBpbiB3YXRjaGxpc3QnID5XYXRjaDwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PiA8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbmZvYm94RGF0YSA9IFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0ncGFkZGluZy10b3A6MTBweDttYXJnaW46IDBweDsnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTMnPjxkaXYgc3R5bGU9J3BhZGRpbmctdG9wOjE1cHg7JyA+PGltZyBzcmM9J1wiICsgZGF0YS5pY29uSW5mbyArIFwiJyBzdHlsZT0nZGlzcGxheTogYmxvY2s7bWFyZ2luOiAwIGF1dG87JyA+PC9kaXY+PC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtOSc+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cgJz5cIiArXHJcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J2NvbC1tZC04JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPlZlaGljbGUgTnVtYmVyPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuc2JjVmluICsgXCI8L2Rpdj5cIiArXHJcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48YSBjbGFzcz0nZGV0YWlscycgc3R5bGU9J2NvbG9yOiMwMDlGREI7Y3Vyc29yOiBwb2ludGVyOycgIHRpdGxlPSdDbGljayBoZXJlIHRvIHNlZSB0ZWNobmljaWFuIGRldGFpbHMnID5WaWV3IERldGFpbHM8L2E+PGkgY2xhc3M9J2ZhIGZhLXRpbWVzJyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHg7Y3Vyc29yOiBwb2ludGVyOycgYXJpYS1oaWRkZW49J3RydWUnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPjwvaT48L2Rpdj5cIiArXHJcbiAgICAgICAgICBcIjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncm93Jz48ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+VlRTIFVuaXQgSUQ8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS50cnVja0lkICsgXCI8L2Rpdj48L2Rpdj5cIiArXHJcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J3Jvdyc+PGRpdiBjbGFzcz0nY29sLW1kLTUnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+Sm9iIFR5cGU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5qb2JUeXBlICsgXCI8L2Rpdj48ZGl2IGNsYXNzPSdjb2wtbWQtNycgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7JyA+Sm9iIElkPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGpvYklkICsgXCI8L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyByZWFzb24gKyBcIjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4Oyc+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5BVFRVSUQ8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5BVFRVSUQgKyBcIjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkO21hcmdpbi1sZWZ0OjhweDsnPlRlY2huaWNpYW4gTmFtZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLnRlY2huaWNpYW5OYW1lICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4OycgPlwiXHJcbiAgICAgICAgICArIFwiPGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkN1c3RvbWVyIE5hbWU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5jdXN0b21lck5hbWUgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnID5cIlxyXG4gICAgICAgICAgKyBcIjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5EaXNwYXRjaCBUaW1lPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuZGlzcGF0Y2hUaW1lICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7JyA+XCJcclxuICAgICAgICAgICsgXCI8ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+Sm9iIEFkZHJlc3M8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS53b3JrQWRkcmVzcyArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxociBzdHlsZT0nbWFyZ2luLXRvcDoxcHg7IG1hcmdpbi1ib3R0b206NXB4OycgLz5cIlxyXG5cclxuICAgICAgICAgICsgXCI8ZGl2IHN0eWxlPSdtYXJnaW4tbGVmdDogMTBweDsnPiA8ZGl2IGNsYXNzPSdyb3cnPiA8ZGl2IGNsYXNzPSdzcGVlZCBjb2wtbWQtMyc+IDxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi1sZWZ0OiAxcHgnPjxwIHN0eWxlPSdmb250LXdlaWdodDogYm9sZGVyO2ZvbnQtc2l6ZTogMjNweDttYXJnaW46IDBweDsnPlwiICsgZGF0YS5TcGVlZCArIFwiPC9wPjxwIHN0eWxlPSdtYXJnaW46IDEwcHggMTBweDsnPm1waDwvcD48L2Rpdj48cCBzdHlsZT0nbWFyZ2luOjBweCcgY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+U3BlZWQ8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpZGxlIGNvbC1tZC01Jz48ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tbGVmdDogMTBweCc+PHAgc3R5bGU9J2ZvbnQtd2VpZ2h0OiBib2xkZXI7Zm9udC1zaXplOiAyM3B4O21hcmdpbjogMHB4Oyc+XCIgKyBkYXRhLkVUQSArIFwiPC9wPjxwIHN0eWxlPSdtYXJnaW46IDEwcHggMTBweDsnPk1pbnM8L3A+PC9kaXY+PHAgc3R5bGU9J21hcmdpbjowcHgnIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkN1bXVsYXRpdmUgSWRsZSBNaW51dGVzPC9wPjwvZGl2PiA8ZGl2IGNsYXNzPSdtaWxlcyBjb2wtbWQtNCc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tbGVmdDogMTBweCc+PHAgc3R5bGU9J2ZvbnQtd2VpZ2h0OiBib2xkZXI7Zm9udC1zaXplOiAyM3B4O21hcmdpbjogMHB4Oyc+XCIgKyB0aGF0LmNvbnZlcnRNaWxlc1RvRmVldChkYXRhLkRpc3RhbmNlKSArIFwiPC9wPjxwIHN0eWxlPSdtYXJnaW46IDEwcHggMTBweDsnPkZ0PC9wPjwvZGl2PjxwIHN0eWxlPSdtYXJnaW46MHB4JyBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5GZWV0IHRvIEpvYiBTaXRlPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+PC9kaXY+PGhyIHN0eWxlPSdtYXJnaW4tdG9wOjFweDsgbWFyZ2luLWJvdHRvbTo1cHg7JyAvPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz4gPGRpdiBjbGFzcz0nY29sLW1kLTEnPjwvZGl2PjxkaXYgY2xhc3M9J3JvdyBjb2wtbWQtMycgc3R5bGU9J1wiICsgY2xhc3NOYW1lICsgXCInPiA8aSBjbGFzcz0nZmEgZmEtY29tbWVudGluZyBjb2wtbWQtMic+PC9pPjxwIGNsYXNzPSdjb2wtbWQtNiBzbXMnIHRpdGxlPSdDbGljayB0byBzZW5kIFNNUycgPlNNUzwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3JvdyBjb2wtbWQtMyBvZmZzZXQtbWQtMScgc3R5bGU9J1wiICsgY2xhc3NOYW1lICsgXCInPiA8aSBjbGFzcz0nZmEgZmEtZW52ZWxvcGUgY29sLW1kLTInIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PHAgY2xhc3M9J2NvbC1tZC02IGVtYWlsJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBlbWFpbCcgPkVtYWlsPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zJz48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3JvdyBjb2wtbWQtMycgc3R5bGU9J1wiICsgc3R5bGVMZWZ0ICsgXCInPjxpIGNsYXNzPSdmYSBmYS1leWUgY29sLW1kLTInIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PHAgY2xhc3M9J2NvbC1tZC02IHdhdGNobGlzdCcgdGl0bGU9J0NsaWNrIHRvIGFkZCBpbiB3YXRjaGxpc3QnID5XYXRjaDwvcD48L2Rpdj4gPC9kaXY+XCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBpbmZvYm94RGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB2aWV3VHJ1Y2tEZXRhaWxzKGUpIHtcclxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnZmEgZmEtdGltZXMnKSB7XHJcbiAgICAgICAgdGhhdC5pbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAgICAgdmlzaWJsZTogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdkZXRhaWxzJykge1xyXG4gICAgICAgIC8vdGhhdC5yb3V0ZXIubmF2aWdhdGUoWycvdGVjaG5pY2lhbi1kZXRhaWxzJ10pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdjb2wtbWQtNiBzbXMnKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcclxuICAgICAgICBzZWxlY3RlZFRydWNrID0gdGhhdC5tYXBTZXJ2aWNlLnJldHJpZXZlRGF0YUZyb21TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycpO1xyXG5cclxuICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XHJcbiAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoYXQucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcclxuICAgICAgICAgICAgeCA9PiB4LmF0dHVpZC50b0xvd2VyQ2FzZSgpID09IHNlbGVjdGVkVHJ1Y2suQVRUVUlELnRvTG93ZXJDYXNlKCkpO1xyXG5cclxuICAgICAgICAgIGlmICh0ZWNobmljaWFuRGV0YWlscyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XHJcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhblBob25lID0gdGVjaG5pY2lhbkRldGFpbHMucGhvbmU7XHJcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbk5hbWUgPSB0ZWNobmljaWFuRGV0YWlscy5uYW1lO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBqUXVlcnkoJyNteU1vZGFsU01TJykubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnY29sLW1kLTYgZW1haWwnKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcclxuICAgICAgICBzZWxlY3RlZFRydWNrID0gdGhhdC5tYXBTZXJ2aWNlLnJldHJpZXZlRGF0YUZyb21TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycpO1xyXG5cclxuICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XHJcbiAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoYXQucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcclxuICAgICAgICAgICAgeCA9PiB4LmF0dHVpZC50b0xvd2VyQ2FzZSgpID09IHNlbGVjdGVkVHJ1Y2suQVRUVUlELnRvTG93ZXJDYXNlKCkpO1xyXG5cclxuICAgICAgICAgIGlmICh0ZWNobmljaWFuRGV0YWlscyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XHJcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhblBob25lID0gdGVjaG5pY2lhbkRldGFpbHMucGhvbmU7XHJcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbk5hbWUgPSB0ZWNobmljaWFuRGV0YWlscy5uYW1lO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBqUXVlcnkoJyNteU1vZGFsRW1haWwnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICB9XHJcbiAgICAgXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb2FkRGlyZWN0aW9ucyh0aGF0LCBzdGFydExvYywgZW5kTG9jLCBpbmRleCwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCkge1xyXG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucycsICgpID0+IHtcclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLkRpcmVjdGlvbnNNYW5hZ2VyKHRoYXQubWFwKTtcclxuICAgICAgLy8gU2V0IFJvdXRlIE1vZGUgdG8gZHJpdmluZ1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLnNldFJlcXVlc3RPcHRpb25zKHtcclxuICAgICAgICByb3V0ZU1vZGU6IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuUm91dGVNb2RlLmRyaXZpbmdcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuc2V0UmVuZGVyT3B0aW9ucyh7XHJcbiAgICAgICAgZHJpdmluZ1BvbHlsaW5lT3B0aW9uczoge1xyXG4gICAgICAgICAgc3Ryb2tlQ29sb3I6ICdncmVlbicsXHJcbiAgICAgICAgICBzdHJva2VUaGlja25lc3M6IDMsXHJcbiAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2F5cG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiBmYWxzZSB9LFxyXG4gICAgICAgIHZpYXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UgfSxcclxuICAgICAgICBhdXRvVXBkYXRlTWFwVmlldzogZmFsc2VcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCB3YXlwb2ludDEgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5XYXlwb2ludCh7XHJcbiAgICAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihzdGFydExvYy5sYXRpdHVkZSwgc3RhcnRMb2MubG9uZ2l0dWRlKSwgaWNvbjogJydcclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IHdheXBvaW50MiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLldheXBvaW50KHtcclxuICAgICAgICBsb2NhdGlvbjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGVuZExvYy5sYXRpdHVkZSwgZW5kTG9jLmxvbmdpdHVkZSlcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuYWRkV2F5cG9pbnQod2F5cG9pbnQxKTtcclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5hZGRXYXlwb2ludCh3YXlwb2ludDIpO1xyXG5cclxuICAgICAgLy8gQWRkIGV2ZW50IGhhbmRsZXIgdG8gZGlyZWN0aW9ucyBtYW5hZ2VyLlxyXG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLCAnZGlyZWN0aW9uc1VwZGF0ZWQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIC8vIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgIHZhciByb3V0ZUluZGV4ID0gZS5yb3V0ZVswXS5yb3V0ZUxlZ3NbMF0ub3JpZ2luYWxSb3V0ZUluZGV4O1xyXG4gICAgICAgIHZhciBuZXh0SW5kZXggPSByb3V0ZUluZGV4O1xyXG4gICAgICAgIGlmIChlLnJvdXRlWzBdLnJvdXRlUGF0aC5sZW5ndGggPiByb3V0ZUluZGV4KSB7XHJcbiAgICAgICAgICBuZXh0SW5kZXggPSByb3V0ZUluZGV4ICsgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5leHRMb2NhdGlvbiA9IGUucm91dGVbMF0ucm91dGVQYXRoW25leHRJbmRleF07XHJcbiAgICAgICAgdmFyIHBpbiA9IHRoYXQubWFwLmVudGl0aWVzLmdldChpbmRleCk7XHJcbiAgICAgICAgLy8gdmFyIGJlYXJpbmcgPSB0aGF0LmNhbGN1bGF0ZUJlYXJpbmcoc3RhcnRMb2MsbmV4dExvY2F0aW9uKTtcclxuICAgICAgICB0aGF0Lk1vdmVQaW5PbkRpcmVjdGlvbih0aGF0LCBlLnJvdXRlWzBdLnJvdXRlUGF0aCwgcGluLCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLmNhbGN1bGF0ZURpcmVjdGlvbnMoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgTW92ZVBpbk9uRGlyZWN0aW9uKHRoYXQsIHJvdXRlUGF0aCwgcGluLCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKSB7XHJcbiAgICB0aGF0ID0gdGhpcztcclxuICAgIHZhciBpc0dlb2Rlc2ljID0gZmFsc2U7XHJcbiAgICB0aGF0LmN1cnJlbnRBbmltYXRpb24gPSBuZXcgQmluZy5NYXBzLkFuaW1hdGlvbnMuUGF0aEFuaW1hdGlvbihyb3V0ZVBhdGgsIGZ1bmN0aW9uIChjb29yZCwgaWR4LCBmcmFtZUlkeCwgcm90YXRpb25BbmdsZSwgbG9jYXRpb25zLCB0cnVja0lkUmFuSWQpIHtcclxuXHJcbiAgICAgIGlmICh0aGF0LmFuaW1hdGlvblRydWNrTGlzdC5sZW5ndGggPiAwICYmIHRoYXQuYW5pbWF0aW9uVHJ1Y2tMaXN0LnNvbWUoeCA9PiB4ID09IHRydWNrSWRSYW5JZCkpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSAoZnJhbWVJZHggPT0gbG9jYXRpb25zLmxlbmd0aCAtIDEpID8gZnJhbWVJZHggOiBmcmFtZUlkeCArIDE7XHJcbiAgICAgICAgdmFyIHJvdGF0aW9uQW5nbGUgPSB0aGF0LmNhbGN1bGF0ZUJlYXJpbmcoY29vcmQsIGxvY2F0aW9uc1tpbmRleF0pO1xyXG4gICAgICAgIGlmICh0aGF0LmlzT2RkKGZyYW1lSWR4KSkge1xyXG4gICAgICAgICAgdGhhdC5jcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKHBpbiwgdHJ1Y2tVcmwsIHJvdGF0aW9uQW5nbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChmcmFtZUlkeCA9PSBsb2NhdGlvbnMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgdGhhdC5jcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKHBpbiwgdHJ1Y2tVcmwsIHJvdGF0aW9uQW5nbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwaW4uc2V0TG9jYXRpb24oY29vcmQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSwgaXNHZW9kZXNpYywgdGhhdC50cmF2YWxEdXJhdGlvbiwgdHJ1Y2tJZFJhbklkKTtcclxuXHJcbiAgICB0aGF0LmN1cnJlbnRBbmltYXRpb24ucGxheSgpO1xyXG4gIH1cclxuXHJcbiAgQ2FsY3VsYXRlTmV4dENvb3JkKHN0YXJ0TG9jYXRpb24sIGVuZExvY2F0aW9uKSB7XHJcbiAgICB0cnkge1xyXG5cclxuICAgICAgdmFyIGRsYXQgPSAoZW5kTG9jYXRpb24ubGF0aXR1ZGUgLSBzdGFydExvY2F0aW9uLmxhdGl0dWRlKTtcclxuICAgICAgdmFyIGRsb24gPSAoZW5kTG9jYXRpb24ubG9uZ2l0dWRlIC0gc3RhcnRMb2NhdGlvbi5sb25naXR1ZGUpO1xyXG4gICAgICB2YXIgYWxwaGEgPSBNYXRoLmF0YW4yKGRsYXQgKiBNYXRoLlBJIC8gMTgwLCBkbG9uICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICAgIHZhciBkeCA9IDAuMDAwMTUyMzg3OTQ3Mjc5MDk5MzE7XHJcbiAgICAgIGRsYXQgPSBkeCAqIE1hdGguc2luKGFscGhhKTtcclxuICAgICAgZGxvbiA9IGR4ICogTWF0aC5jb3MoYWxwaGEpO1xyXG4gICAgICB2YXIgbmV4dENvb3JkID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHN0YXJ0TG9jYXRpb24ubGF0aXR1ZGUgKyBkbGF0LCBzdGFydExvY2F0aW9uLmxvbmdpdHVkZSArIGRsb24pO1xyXG5cclxuICAgICAgZGxhdCA9IG51bGw7XHJcbiAgICAgIGRsb24gPSBudWxsO1xyXG4gICAgICBhbHBoYSA9IG51bGw7XHJcbiAgICAgIGR4ID0gbnVsbDtcclxuXHJcbiAgICAgIHJldHVybiBuZXh0Q29vcmQ7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZygnRXJyb3IgaW4gQ2FsY3VsYXRlTmV4dENvb3JkIC0gJyArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzT2RkKG51bSkge1xyXG4gICAgcmV0dXJuIG51bSAlIDI7XHJcbiAgfVxyXG5cclxuICBkZWdUb1JhZCh4KSB7XHJcbiAgICByZXR1cm4geCAqIE1hdGguUEkgLyAxODA7XHJcbiAgfVxyXG5cclxuICByYWRUb0RlZyh4KSB7XHJcbiAgICByZXR1cm4geCAqIDE4MCAvIE1hdGguUEk7XHJcbiAgfVxyXG5cclxuICBjYWxjdWxhdGVCZWFyaW5nKG9yaWdpbiwgZGVzdCkge1xyXG4gICAgLy8vIDxzdW1tYXJ5PkNhbGN1bGF0ZXMgdGhlIGJlYXJpbmcgYmV0d2VlbiB0d28gbG9hY2F0aW9ucy48L3N1bW1hcnk+XHJcbiAgICAvLy8gPHBhcmFtIG5hbWU9XCJvcmlnaW5cIiB0eXBlPVwiTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb25cIj5Jbml0aWFsIGxvY2F0aW9uLjwvcGFyYW0+XHJcbiAgICAvLy8gPHBhcmFtIG5hbWU9XCJkZXN0XCIgdHlwZT1cIk1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uXCI+U2Vjb25kIGxvY2F0aW9uLjwvcGFyYW0+XHJcbiAgICB0cnkge1xyXG4gICAgICB2YXIgbGF0MSA9IHRoaXMuZGVnVG9SYWQob3JpZ2luLmxhdGl0dWRlKTtcclxuICAgICAgdmFyIGxvbjEgPSBvcmlnaW4ubG9uZ2l0dWRlO1xyXG4gICAgICB2YXIgbGF0MiA9IHRoaXMuZGVnVG9SYWQoZGVzdC5sYXRpdHVkZSk7XHJcbiAgICAgIHZhciBsb24yID0gZGVzdC5sb25naXR1ZGU7XHJcbiAgICAgIHZhciBkTG9uID0gdGhpcy5kZWdUb1JhZChsb24yIC0gbG9uMSk7XHJcbiAgICAgIHZhciB5ID0gTWF0aC5zaW4oZExvbikgKiBNYXRoLmNvcyhsYXQyKTtcclxuICAgICAgdmFyIHggPSBNYXRoLmNvcyhsYXQxKSAqIE1hdGguc2luKGxhdDIpIC0gTWF0aC5zaW4obGF0MSkgKiBNYXRoLmNvcyhsYXQyKSAqIE1hdGguY29zKGRMb24pO1xyXG5cclxuICAgICAgbGF0MSA9IGxhdDIgPSBsb24xID0gbG9uMiA9IGRMb24gPSBudWxsO1xyXG5cclxuICAgICAgcmV0dXJuICh0aGlzLnJhZFRvRGVnKE1hdGguYXRhbjIoeSwgeCkpICsgMzYwKSAlIDM2MDtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBpbiBjYWxjdWxhdGVCZWFyaW5nIC0gJyArIGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIFNlbmRTTVMoZm9ybSkge1xyXG4gICAgLy8gaWYodGhpcy50ZWNobmljaWFuUGhvbmUgIT0gJycpe1xyXG4gICAgaWYgKGZvcm0udmFsdWUubW9iaWxlTm8gIT0gJycpIHtcclxuICAgICAgaWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZSB3YW50IHRvIHNlbmQgU01TPycpKSB7XHJcbiAgICAgICAgLy8gdGhpcy5tYXBTZXJ2aWNlLnNlbmRTTVModGhpcy50ZWNobmljaWFuUGhvbmUsZm9ybS52YWx1ZS5zbXNNZXNzYWdlKTtcclxuICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc2VuZFNNUyhmb3JtLnZhbHVlLm1vYmlsZU5vLCBmb3JtLnZhbHVlLnNtc01lc3NhZ2UpO1xyXG5cclxuICAgICAgICBmb3JtLmNvbnRyb2xzLnNtc01lc3NhZ2UucmVzZXQoKVxyXG4gICAgICAgIGZvcm0udmFsdWUubW9iaWxlTm8gPSB0aGlzLnRlY2huaWNpYW5QaG9uZTtcclxuICAgICAgICBqUXVlcnkoJyNteU1vZGFsU01TJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAvL3RoaXMudG9hc3RyLnN1Y2Nlc3MoJ1NNUyBzZW50IHN1Y2Nlc3NmdWxseScsICdTdWNjZXNzJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBTZW5kRW1haWwoZm9ybSkge1xyXG4gICAgLy8gaWYodGhpcy50ZWNobmljaWFuRW1haWwgIT0gJycpe1xyXG4gICAgaWYgKGZvcm0udmFsdWUuZW1haWxJZCAhPSAnJykge1xyXG4gICAgICBpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHdhbnQgdG8gc2VuZCBFbWFpbD8nKSkge1xyXG5cclxuICAgICAgICAvLyB0aGlzLnVzZXJQcm9maWxlU2VydmljZS5nZXRVc2VyRGF0YSh0aGlzLmNvb2tpZUFUVFVJRClcclxuICAgICAgICAvLyAgIC5zdWJzY3JpYmUoKGRhdGEpID0+IHtcclxuICAgICAgICAvLyAgICAgdmFyIG5ld0RhdGE6IGFueSA9IHRoaXMuc3RyaW5naWZ5SnNvbihkYXRhKTtcclxuICAgICAgICAvLyAgICAgLy90aGlzLm1hcFNlcnZpY2Uuc2VuZEVtYWlsKG5ld0RhdGEuZW1haWwsdGhpcy50ZWNobmljaWFuRW1haWwsbmV3RGF0YS5sYXN0TmFtZSArICcgJyArIG5ld0RhdGEuZmlyc3ROYW1lLCB0aGlzLnRlY2huaWNpYW5OYW1lLCBmb3JtLnZhbHVlLmVtYWlsU3ViamVjdCxmb3JtLnZhbHVlLmVtYWlsTWVzc2FnZSk7XHJcbiAgICAgICAgLy8gICAgIHRoaXMubWFwU2VydmljZS5zZW5kRW1haWwobmV3RGF0YS5lbWFpbCwgZm9ybS52YWx1ZS5lbWFpbElkLCBuZXdEYXRhLmxhc3ROYW1lICsgJyAnICsgbmV3RGF0YS5maXJzdE5hbWUsIHRoaXMudGVjaG5pY2lhbk5hbWUsIGZvcm0udmFsdWUuZW1haWxTdWJqZWN0LCBmb3JtLnZhbHVlLmVtYWlsTWVzc2FnZSk7XHJcbiAgICAgICAgLy8gICAgIHRoaXMudG9hc3RyLnN1Y2Nlc3MoXCJFbWFpbCBzZW50IHN1Y2Nlc3NmdWxseVwiLCAnU3VjY2VzcycpO1xyXG5cclxuICAgICAgICAvLyAgICAgZm9ybS5jb250cm9scy5lbWFpbFN1YmplY3QucmVzZXQoKVxyXG4gICAgICAgIC8vICAgICBmb3JtLmNvbnRyb2xzLmVtYWlsTWVzc2FnZS5yZXNldCgpXHJcbiAgICAgICAgLy8gICAgIGZvcm0udmFsdWUuZW1haWxJZCA9IHRoaXMudGVjaG5pY2lhbkVtYWlsO1xyXG4gICAgICAgIC8vICAgICBqUXVlcnkoJyNteU1vZGFsRW1haWwnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIC8vICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIFNlYXJjaFRydWNrKGZvcm0pIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgIC8vJCgnI2xvYWRpbmcnKS5zaG93KCk7XHJcblxyXG4gICAgaWYgKGZvcm0udmFsdWUuaW5wdXRtaWxlcyAhPSAnJyAmJiBmb3JtLnZhbHVlLmlucHV0bWlsZXMgIT0gbnVsbCkge1xyXG4gICAgICBjb25zdCBsdCA9IHRoYXQuY2xpY2tlZExhdDtcclxuICAgICAgY29uc3QgbGcgPSB0aGF0LmNsaWNrZWRMb25nO1xyXG4gICAgICBjb25zdCByZCA9IGZvcm0udmFsdWUuaW5wdXRtaWxlcztcclxuXHJcbiAgICAgIHRoaXMuZm91bmRUcnVjayA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdCA9IFtdO1xyXG5cclxuICAgICAgaWYgKHRoaXMuY29ubmVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMubG9hZE1hcFZpZXcoJ3JvYWQnKTtcclxuXHJcbiAgICAgIHRoYXQuTG9hZFRydWNrcyh0aGlzLm1hcCwgbHQsIGxnLCByZCwgdHJ1ZSk7XHJcblxyXG4gICAgICBmb3JtLmNvbnRyb2xzLmlucHV0bWlsZXMucmVzZXQoKTtcclxuICAgICAgalF1ZXJ5KCcjbXlSYWRpdXNNb2RhbCcpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgIH0sIDEwMDAwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuXHJcbiAgZ2V0TWlsZXMoaSkge1xyXG4gICAgcmV0dXJuIGkgKiAwLjAwMDYyMTM3MTE5MjtcclxuICB9XHJcblxyXG4gIGdldE1ldGVycyhpKSB7XHJcbiAgICByZXR1cm4gaSAqIDE2MDkuMzQ0O1xyXG4gIH1cclxuXHJcbiAgc3RyaW5naWZ5SnNvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcbiAgfVxyXG4gIHBhcnNlVG9Kc29uKGRhdGEpIHtcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgUm91bmQobnVtYmVyLCBwcmVjaXNpb24pIHtcclxuICAgIHZhciBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKTtcclxuICAgIHZhciB0ZW1wTnVtYmVyID0gbnVtYmVyICogZmFjdG9yO1xyXG4gICAgdmFyIHJvdW5kZWRUZW1wTnVtYmVyID0gTWF0aC5yb3VuZCh0ZW1wTnVtYmVyKTtcclxuICAgIHJldHVybiByb3VuZGVkVGVtcE51bWJlciAvIGZhY3RvcjtcclxuICB9XHJcblxyXG4gIGdldEF0YW4yKHksIHgpIHtcclxuICAgIHJldHVybiBNYXRoLmF0YW4yKHksIHgpO1xyXG4gIH07XHJcblxyXG4gIGdldEljb25VcmwoY29sb3I6IHN0cmluZywgc291cmNlTGF0OiBudW1iZXIsIHNvdXJjZUxvbmc6IG51bWJlciwgZGVzdGluYXRpb25MYXQ6IG51bWJlciwgZGVzdGluYXRpb25Mb25nOiBudW1iZXIpIHtcclxuICAgIHZhciBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBM1pKUkVGVWFJSHRsMTFJVTJFWXgvOXZ1VnFRYXhlQjZ3djBLc2NJRjRHMGJwb2Fabld6aFZwZFZFcDFFUnJtcENodk1nanJJaFQ2b0tCWjZFWFVBdWVOYUZIMFFUU3h5QVdWWFJRdVAxQXZzdTNNNW5IYW5pN2NsdW5aeDlsbUNMNi9xM1BPOC9LYy8vOTV2d0VPaDhQaGNEZ2NEb2V6VkdHcFNFSkVhZ0JWcWNnbGdZc3gxaHdwbUpac2RpSlNCeWp3WWN6M2MrMndaOFNmYkw2NWJGbXZVeE9Sa1RGV0xoV1gzUVBCYXU4RW9BOSswazlNaWZ1MlhkMnBFRVFoQ2FuU1dQSXFZVEZXQUVBV1k4dzFOeTZyQjRpb2FqcncrMUxhc3VXciszNzBqNDlQZXFjelZCbEsxOWgzdGhEaUFjRGg2Z1pRQVFDWkFCSTNRRVQzQUpSZGUzVWJWa2NMQkZGWURjeFVhRWRtYm9ya3lpY3VBeUh4bHJaYTJIcnNDeXhKSHN0aU5Wak00b0VZQmhhN2VDQ0tBU0l5WXBHTEI2TE1nY2xwLzVuWDM5NU0yWHJzaXY4cFNDNFJEYXhNVzdHM3ZmZEpYRW5TbGVrcEV6U1hOVXBWMUhqVVZXakFQUlR6QjRMb2hVNlRqUks5S2E3MmNpbk9NWVVlblZMeHBJOFN0aDQ3U3ZVbU5Kb3ZKNXNxR3RXTU1iZFVJR2tEZ2lpZzhKWVpocXpVYjJhbGVqTks5Q1lnUXZXQkpBem9ORnA4R3VrTnZ6djZ1aE5OTlM5WENFTWNPN3dzQXlxbENnMm1laFJwQzhMZkdwN2ZRTU9MbTNMU2hEbTIvUWhxOGlxaENpNENEbGMzTFBaYVdYTkpsb0dtUTlleFNiMFJ4eCtjZ2tjVW9OTm9VV09zd0pwVktsem9rRGNIamh1T29xN29ISnE2V3RENTVSa0FvTVpZQ1Z0NU0zYmYybzk0RDRjUkRZalQ0cWhPbzgwSURZMGk3UzRZTW5OaGFOd1ZycENqcnh1RDdpRllEMTZIMWRFaXEzSVdZd1VlT2R2K01WN2Nkd1JkMWM5UXV0VU1xNk1aT2V0MFV3QVVrRGlGeGpTZ1RGUGVQcHRmVmV1WjhDZ0czRU1vM0p5UEx0ZmJlU0k3ZTU4Q0FBcXpDeVRIc1JRNmpSWXFaVHBzenZrN3ZNMXB4KzdzZkJBUkNqWWJGUUJlU3QwRFlocGdqTlVSa2JyUmZEbDhWUnp4anZvQnJKamRUaFhjYUM3dU9SK1grTmxJYlZLYjFCdG1lbnBtQXI4RVlKclhhTGJPZUg1RVJIck1YQ2pzZFoxWFlIWDh2YUkybU9wUnV0VU1BR1lBa211MUZPT1R2Z09EN3NFVCsrOGVYaDRhN3pxTkZvOVB0b2FGUjFyN0U0YUl5b2lJUGc3MzBwMDN6ZFQvYzVDQ2xDV1FTeTJJM3EvQ2hCQjQrTDZWT2o0L0pTS2lRQ0RnQ1Jac1lTQWlvemcxMmY3ajE1alQ1NSs0SHp5MUpwcExUVVNuUGFMM25jL3Y2eUtpdXVDZG04UGhjRGljcGNFZmszZUFMYmMxK1ZRQUFBQUFTVVZPUks1Q1lJST1cIjtcclxuXHJcbiAgICBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcImdyZWVuXCIpIHtcclxuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQTNaSlJFRlVhSUh0bDExSVUyRVl4Lzl2dVZxUWF4ZUI2d3YwS3NjSUY0RzBicG9hWm5XemhWcGRWRXAxRVJybXBDaHZNZ2pySWhUNm9LQlo2RVhVQXVlTmFGSDBRVFN4eUFXVlhSUXVQMUF2c3UzTTVuSGFuaTdjbHVuWng5bG1DTDYvcTNQTzgvS2MvLzk1dndFT2g4UGhjRGdjRG9lelZHR3BTRUpFYWdCVnFjZ2xnWXN4MWh3cG1KWnNkaUpTQnlqd1ljejNjKzJ3WjhTZmJMNjViRm12VXhPUmtURldMaFdYM1FQQmF1OEVvQTkrMGs5TWlmdTJYZDJwRUVRaENhblNXUElxWVRGV0FFQVdZOHcxTnk2ckI0aW9hanJ3KzFMYXN1V3IrMzcwajQ5UGVxY3pWQmxLMTloM3RoRGlBY0RoNmdaUUFRQ1pBQkkzUUVUM0FKUmRlM1ViVmtjTEJGRllEY3hVYUVkbWJvcmt5aWN1QXlIeGxyWmEySHJzQ3l4SkhzdGlOVmpNNG9FWUJoYTdlQ0NLQVNJeVlwR0xCNkxNZ2NscC81blgzOTVNMlhyc2l2OHBTQzRSRGF4TVc3RzN2ZmRKWEVuU2xla3BFelNYTlVwVjFIalVWV2pBUFJUekI0TG9oVTZUalJLOUthNzJjaW5PTVlVZW5WTHhwSThTdGg0N1N2VW1OSm92SjVzcUd0V01NYmRVSUdrRGdpaWc4SllaaHF6VWIyYWxlak5LOUNZZ1F2V0JKQXpvTkZwOEd1a052enY2dWhOTk5TOVhDRU1jTzd3c0F5cWxDZzJtZWhScEM4TGZHcDdmUU1PTG0zTFNoRG0yL1FocThpcWhDaTRDRGxjM0xQWmFXWE5KbG9HbVE5ZXhTYjBSeHgrY2drY1VvTk5vVVdPc3dKcFZLbHpva0RjSGpodU9vcTdvSEpxNld0RDU1UmtBb01aWUNWdDVNM2JmMm85NEQ0Y1JEWWpUNHFoT284MElEWTBpN1M0WU1uTmhhTndWcnBDanJ4dUQ3aUZZRDE2SDFkRWlxM0lXWXdVZU9kditNVjdjZHdSZDFjOVF1dFVNcTZNWk9ldDBVd0FVa0RpRnhqU2dURlBlUHB0ZlZldVo4Q2dHM0VNbzNKeVBMdGZiZVNJN2U1OENBQXF6Q3lUSHNSUTZqUllxWlRwc3p2azd2TTFweCs3c2ZCQVJDalliRlFCZVN0MERZaHBnak5VUmticlJmRGw4VlJ6eGp2b0JySmpkVGhYY2FDN3VPUitYK05sSWJWS2IxQnRtZW5wbUFyOEVZSnJYYUxiT2VINUVSSHJNWENqc2RaMVhZSFg4dmFJMm1PcFJ1dFVNQUdZQWttdTFGT09UdmdPRDdzRVQrKzhlWGg0YTd6cU5GbzlQdG9hRlIxcjdFNGFJeW9pSVBnNzMwcDAzemRUL2M1Q0NsQ1dRU3kySTNxL0NoQkI0K0w2Vk9qNC9KU0tpUUNEZ0NSWnNZU0Fpb3pnMTJmN2oxNWpUNTUrNEh6eTFKcHBMVFVTblBhTDNuYy92NnlLaXV1Q2RtOFBoY0RpY3BjRWZrM2VBTGJjMStWUUFBQUFBU1VWT1JLNUNZSUk9XCI7XHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJyZWRcIikge1xyXG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBMHhKUkVGVWFJSHRsejFzRW1FY3hwOVhoQlFEaFJBL01DU05UVXk4dEVzWFhFc2djZEFCcW9PVHBBNHVrS0FPeHNZdURrSjByZEhvMUpRbWJnWWNYUHhLbkRUZ1VBZHRtelN4SVVDS1JDd2VvUVY2OTNlQXUyaDdCUTVhMDhUM054MzNQNTU3bnZmcjNoZmdjRGdjRG9mRDRYQTQveXRzTDBTSXlBN2crbDVvYWJES0dKdmJyWGk0WDNVaXNrT1dQMi85L0htMFhpalUrOVhienBHUkVUc1JlUmhqVjdYcXVudWcxZHJqQU1aYXQ4Ymt6YzBMWHp3ZW95U0tmVmpWeGhrT3d4a0tBY0F3WTJ4MWUxMVhEeERSZFpLa2U4eGdzTlF5bVlwVXFXeVpqaDhmcUdVeWJEL01BMEFsblZZdVR3SG9QUUFSelFLWUxEeDlpbUk4RGtrVUxVQ3poU3h1OTE1NDdZbXVBaWptTTlQVEtDV1QrMnhKSDRjNlBYQ1F6UU1kQWh4MDgwQ2JBRVRrd1FFM0Q3U1pBMVN2M3hJL2ZHaVVra25qdnpTa2wxMERNSlBwL1BxclYxMkpHS3pXUFRPa1Y3dnRLbFRQNXp1K1FCSkZtQVVCRHIrL3ErZjE0dkQ3bGNzRnJYcmZXNGxTSWdGSElJQ2hXS3hmcVhiY1pJeXRheFg2RGlDSklwWXZYb1RsN05sK3BYYmdDQVNVSHRCc2ZhQ1BBR1pCd01iU2t2cTdra3IxS3JWRFM2R2JMN3l1QUFhckZVUFJLR3crbjNwdjdkRWpyRDErckVkRzVkaVZLM0NHdytwRXJhVFR5RXhQbzU3TGRhMmhLOER3dzRjd3VWejRGb21vazljWkNzRXdPSWpjL2Z2NnpBZURjTjIramVMOFBNcnYzZ0VBbktFUVRzL09Zdm5TSlhTN09kdzFnTHk1V1RBTHdnbGxhTmg4UGxqY2JudzlkMDV0b1VvcWhYb3VoK0daR1JUbjUzVzFuRE1VUXVuRmk3K0NyNlJTR0huOUdvNkpDUlRqY1J3WkhXMEFNRUpqRjlveHdLR0JnU2NuSTVFN1VybHNyT2Z6c0htOXFLVFRPMHlXMzc1dEJ2UjZOY2V4Rm1aQmdNRnExZnpDbDVKSjJMeGVnQWlENCtOR0FPKzF6Z0VkQXpERzdoS1JmU2dXVTQrS2plYUp5L1RuYzhyNGRVMU5kV1ZlNjc5L1luSzVZSEc3bFFuOEhrQ2duVVpYSnpJaUdrUHpRSkhJUFhpQVlqeXUxb2FpVVRnQ0FRQ1lBS0M1Vm1zaFY2dVhhOW5zdFpWZzBLQ01kN01nNE16ejU2cngzZGIrbmlHaVNTS2k2dUlpZlorYm8xbzJTeTBtZTlDeVM2SzRzdlhybC93amthRDFOMithU3JKY2JqWFkva0JFSHJsV2U5a29sUmFralkxbnJWMXJyMXAySXJvaGllS25yV3IxSXhIZGJaMjVPUndPaDhQNVAvZ05xaHgvNnJzdWpqZ0FBQUFBU1VWT1JLNUNZSUk9XCI7XHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJ5ZWxsb3dcIikge1xyXG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBeWhKUkVGVWFJSHRsejFNVTFFWWh0L3ZZaFdOYVp0Z2hBR05tSUNKVm1Gd01DRlJIRXdFRThWSm5NUkJuUlFkeWdBT0Rycm9ZQ0lMdUJnV1lkUEV5R1JpeEJRY0hDRCtES2hBV2lNNDFIZ0psSi9ibnRlaHQvV250eiszQlVQQ2VhYmUrNTI4ZmIvdm5Idk9kd0NOUnFQUmFEUWFqVWF6VVpIVkVDSHBCOUN4R2xvT1RJdElmN2JncGxMVlNmcEJOUTdyeHc0c2Zsc3BWUzhEM3lFL3lTWVJ1ZWdVZGowRGRyV1BBV2l3WHpVZ3NYZ3E4ZUtnQjVaWmdsTm5wSzRUUmwwUUFHcEVaUHJmdUtzWklOa0J4bTlETm0xSGJISWUxbndjNVZYbFhKaVV0VEFQQUlpR0FBUUJZQStBNGhNZytRaEF1L3AwSDV6cUF5eHpPNUNza0ZRMHJwSmI5eFNVUU1vOHg2K0JrWUUxdHVRT0k5K0FQODJyZFdZZXlKUEFlamNQNUVpQVpCUFd1WGtnMXplUVdBNHlPbXlweUlEblAvcHhUZllFeXJhMFlPWlpZU29lN3lyWmNkTDI1UXpuM0lVWUMrZlZsN2dKOFFZZ3U5cUFBc2E3UmFyUHBYNk9PY1ZMYmlWVVpCQkc5WGtZOVQybFN1WGlob2o4ZEFxVW5BQXNFMnE0YVUwT002bHVTODVzbHVvREpTUWczZ0E0OXo3OXpHaW9XS2tNclRRVmpYbWJOWGNKZUh3dzZoOUFxbHJTcnpoeEYycmluaXVaRkViTlpVaGRaL3BEWlRRRWpsOHI2TnRMNFNvQjQzQS9aTnR1cUxjWEFNdUUrQUtRMms2SXh3OSs2SFpuZnU4VnlQN2JVRk1QZ2RraEFIYm5lZVFwRXErUG85RG1NUHRKbkZqNkxyNUErbEdxV2lBVmpWQ2pyZURzRUJnTlFVMzJRWTFmVFZaeTIyNVhDVWh0RUl3TWdoKzZrNVdQaHFCR3p3QUNHTWwxRC9FM1dQYndqQzQwUlk1em9MeFg5blYxaVdWNkVBdERLcHZCNkVqRzlESlZ2Y3FUZ05NNmRqTHZEUUFlSC9oMU1DT21Jb09ReW1ZWUpHVG5DUStBVjA3M2dMd0ppTWd0a242anZ1ZjNWWEZwWmdYQTVyOEcydXRYRHR4eGZ6dHlPS1JrNjY3a2pwYmMxVjRCYU0wbFVkQi9rbXhBOGtMeGhCOXZRazMycFdOR2ZVOXFxenNMd0hHdmRpUXhmNDZ4OENVMWNyb3N0ZDdGRzRCeDlHWGFlTGE5djJoSXRwT2tNdDh4OGFXWFhBalRwcjBJTFQ5WDVqN1RNcFVLRDFETlBMZWxsR2tYYkcwZzJjVDQwbk11UjhjWWp6MjJ1OVppdGZ3a3IzUEZmTXY0d2h1U3Qrdzd0MGFqMFdnMEc0TmZUaXhrZkZ4eVhQRUFBQUFBU1VWT1JLNUNZSUk9XCJcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcInB1cnBsZVwiKSB7XHJcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFGNjJsVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TXkwd00xUXhNVG8wTURvek55MHdOVG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRE10TUROVU1URTZOVE02TWpVdE1EVTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRE10TUROVU1URTZOVE02TWpVdE1EVTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZVGxoWVRZeFpHWXRZMlZoTkMwd1l6UXlMVGhoWlRBdFpqWTFaVGRoTldJd01qQmhJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNk1USTRObVl6WkdVdFpEZGpOUzFrWlRSbUxUZzVOR1l0TVdZek9EazJZbU01WmpGa0lpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNllUZGtORFJtTjJFdE1qSmxZeTFoT0RRMExUbG1PV0l0TVRBM1lqRmhOV1kyT1RjeUlqNGdQSGh0Y0UxTk9raHBjM1J2Y25rK0lEeHlaR1k2VTJWeFBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpWTNKbFlYUmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRHBoTjJRME5HWTNZUzB5TW1WakxXRTRORFF0T1dZNVlpMHhNRGRpTVdFMVpqWTVOeklpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGd0TURNdE1ETlVNVEU2TkRBNk16Y3RNRFU2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09tRTVZV0UyTVdSbUxXTmxZVFF0TUdNME1pMDRZV1V3TFdZMk5XVTNZVFZpTURJd1lTSWdjM1JGZG5RNmQyaGxiajBpTWpBeE9DMHdNeTB3TTFReE1UbzFNem95TlMwd05Ub3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4TDNKa1pqcFRaWEUrSUR3dmVHMXdUVTA2U0dsemRHOXllVDRnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrSUR3dmNtUm1PbEpFUmo0Z1BDOTRPbmh0Y0cxbGRHRStJRHcvZUhCaFkydGxkQ0JsYm1ROUluSWlQejZSUTJjWEFBQUNTMGxFUVZSbzN1Mll2VW9EUVJESDh3aDVCTjlBSDhEQzJrWXJXd1h0MVY3UldodTdsSUtLV0NrcU5vS29vS0JFSlNERUQwd1JqU1NTY0dMaUpXWnpkK3Yrejl1d2hIeGU5dUNFR1JoQ05uZXo4NXVkbloxTmhITWUrYzhhSVFBQ0lBQUNJQUFDSUFBQ0lBQUNJQUR0QUwySWVENHFkQ2tnblZUbTBROEE1eDJicDhzRlpoYVMzNSs2bGYvSnVqWUFMOXBqU29UMmFoV2I3UXpmOG8zQmErMmFpR1U4Qmo3UU40QVluN1V0cHdScnhkZEtDUkVxNTFubDQ2NVlDOEo1NlBITWd3UVk2UXNBeXdncmlJZ2FiWHpQeHI5NHFBR2s4NWVMcWFaTEhHcUFkczZISHFDVDg2RUc4RjVvNjN5b0FleXFjL1IyL3NtNktYTmhYWUdPMFpjQXhxTVpHTURwL0xOL0FOQjNtaUMrbW5hdFh5eWsrUEgwZzNaOVBURWtRRFFRQUp3SnhwUEpBNWE1bmx1SmJnSFVYTld0cVlOOFBYMjBBeHhPM0d2TDgxYTJsRDVJRHdEU1JjbEpMbHNMdjQ3SFY5SzhXcXpWYmFHYTdZNG1nZ1BBQktYM0g3Y3k0RGRzWURpUTNNcjI3cnkzK2ZHdVRCblhmdWFuM212MUJTQmE1QndtYVN4bmFvVGFqWGRTZ0NQSEc4Y1JJRGt2emlIWlN2dFpnZVZhMldheVBMN3M1MXNlV0JDa1E3ZWxFYysyMm1QeVlKVFBDRG56ZlNNVG4ydHF2cHU1YXJWWkdmVXJXTDFHZTBybGNaMUgvZS83U2ltK0R3a2RkeU90cEJVVUsrUEp1SGRhZHFYTXRHTEdzMm1wZHd0VW8yYU9hN3NUaS9FcFdFZnJrTnpNdWh2T2s2bElqd0lIV2NsNkVYdkJRUkRxMWMzaFh3aFlpM2UwM0lsSDBPaFZESllRRzMxYlZnZy80clVIY3dMa2hwV3RLK3k3WnBIM0JVQi9iQkVBQVJBQUFSREFmOUJmUmI2NEtZZmxSTEFBQUFBQVNVVk9SSzVDWUlJPVwiXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGljb25Vcmw7XHJcbiAgfVxyXG5cclxuICBsb2NhdGVwdXNocGluKG9iaikge1xyXG4gICAgY29uc3QgdHJ1Y2tJZCA9IG9iai50cnVja0lkO1xyXG5cclxuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHBpbnMgaW4gdGhlIGRhdGEgbGF5ZXIgYW5kIGZpbmQgdGhlIHB1c2hwaW4gZm9yIHRoZSBsb2NhdGlvbi4gXHJcbiAgICBsZXQgc2VhcmNoUGluO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmRhdGFMYXllci5nZXRMZW5ndGgoKTsgaSsrKSB7XHJcbiAgICAgIHNlYXJjaFBpbiA9IHRoaXMuZGF0YUxheWVyLmdldChpKTtcclxuICAgICAgaWYgKHNlYXJjaFBpbi5tZXRhZGF0YS50cnVja0lkLnRvTG93ZXJDYXNlKCkgIT09IHRydWNrSWQudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgIHNlYXJjaFBpbiA9IG51bGw7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiBhIHBpbiBpcyBmb3VuZCB3aXRoIGEgbWF0Y2hpbmcgSUQsIHRoZW4gY2VudGVyIHRoZSBtYXAgb24gaXQgYW5kIHNob3cgaXQncyBpbmZvYm94LlxyXG4gICAgaWYgKHNlYXJjaFBpbikge1xyXG4gICAgICAvLyBPZmZzZXQgdGhlIGNlbnRlcmluZyB0byBhY2NvdW50IGZvciB0aGUgaW5mb2JveC5cclxuICAgICAgdGhpcy5tYXAuc2V0Vmlldyh7IGNlbnRlcjogc2VhcmNoUGluLmdldExvY2F0aW9uKCksIHpvb206IDE3IH0pO1xyXG4gICAgICAvLyB0aGlzLmRpc3BsYXlJbmZvQm94KHNlYXJjaFBpbiwgb2JqKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4obG9jYXRpb24sIHVybCwgcm90YXRpb25BbmdsZSwgY2FsbGJhY2spIHtcclxuICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcblxyXG4gICAgICB2YXIgcm90YXRpb25BbmdsZVJhZHMgPSByb3RhdGlvbkFuZ2xlICogTWF0aC5QSSAvIDE4MDtcclxuICAgICAgYy53aWR0aCA9IDUwO1xyXG4gICAgICBjLmhlaWdodCA9IDUwO1xyXG4gICAgICAvLyBDYWxjdWxhdGUgcm90YXRlZCBpbWFnZSBzaXplLlxyXG4gICAgICAvLyBjLndpZHRoID0gTWF0aC5hYnMoTWF0aC5jZWlsKGltZy53aWR0aCAqIE1hdGguY29zKHJvdGF0aW9uQW5nbGVSYWRzKSArIGltZy5oZWlnaHQgKiBNYXRoLnNpbihyb3RhdGlvbkFuZ2xlUmFkcykpKTtcclxuICAgICAgLy8gYy5oZWlnaHQgPSBNYXRoLmFicyhNYXRoLmNlaWwoaW1nLndpZHRoICogTWF0aC5zaW4ocm90YXRpb25BbmdsZVJhZHMpICsgaW1nLmhlaWdodCAqIE1hdGguY29zKHJvdGF0aW9uQW5nbGVSYWRzKSkpO1xyXG5cclxuICAgICAgdmFyIGNvbnRleHQgPSBjLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAvLyBNb3ZlIHRvIHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cclxuICAgICAgY29udGV4dC50cmFuc2xhdGUoYy53aWR0aCAvIDIsIGMuaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgICAvLyBSb3RhdGUgdGhlIGNhbnZhcyB0byB0aGUgc3BlY2lmaWVkIGFuZ2xlIGluIGRlZ3JlZXMuXHJcbiAgICAgIGNvbnRleHQucm90YXRlKHJvdGF0aW9uQW5nbGVSYWRzKTtcclxuXHJcbiAgICAgIC8vIERyYXcgdGhlIGltYWdlLCBzaW5jZSB0aGUgY29udGV4dCBpcyByb3RhdGVkLCB0aGUgaW1hZ2Ugd2lsbCBiZSByb3RhdGVkIGFsc28uXHJcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltZywgLWltZy53aWR0aCAvIDIsIC1pbWcuaGVpZ2h0IC8gMik7XHJcbiAgICAgIC8vIGFuY2hvcjogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDI0LCA2KVxyXG4gICAgICBpZiAoIWlzTmFOKHJvdGF0aW9uQW5nbGVSYWRzKSAmJiByb3RhdGlvbkFuZ2xlUmFkcyA+IDApIHtcclxuICAgICAgICBsb2NhdGlvbi5zZXRPcHRpb25zKHsgaWNvbjogYy50b0RhdGFVUkwoKSwgYW5jaG9yOiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoYy53aWR0aCAvIDIsIGMuaGVpZ2h0IC8gMikgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHJldHVybiBjO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBBbGxvdyBjcm9zcyBkb21haW4gaW1hZ2UgZWRpdHRpbmcuXHJcbiAgICBpbWcuY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJztcclxuICAgIGltZy5zcmMgPSB1cmw7XHJcbiAgfVxyXG5cclxuICBnZXRUaHJlc2hvbGRWYWx1ZSgpIHtcclxuXHJcbiAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0UnVsZXModGhpcy50ZWNoVHlwZSlcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgdmFyIG9iaiA9IEpTT04ucGFyc2UoKHRoaXMuc3RyaW5naWZ5Qm9keUpzb24oZGF0YSkpLmRhdGEpO1xyXG4gICAgICAgICAgaWYgKG9iaiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBpZGxlVGltZSA9IG9iai5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZmllbGROYW1lID09PSAnQ3VtdWxhdGl2ZSBpZGxlIHRpbWUgZm9yIFJFRCcgJiYgZWxlbWVudC5kaXNwYXRjaFR5cGUgPT09IHRoaXMudGVjaFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnZhbHVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaWRsZVRpbWUgIT0gdW5kZWZpbmVkICYmIGlkbGVUaW1lLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICB0aGlzLnRocmVzaG9sZFZhbHVlID0gaWRsZVRpbWVbMF0udmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgc3RyaW5naWZ5Qm9keUpzb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YVsnX2JvZHknXSk7XHJcbiAgfVxyXG5cclxuICBVVENUb1RpbWVab25lKHJlY29yZERhdGV0aW1lKSB7XHJcbiAgICB2YXIgcmVjb3JkVGltZTtcclxuICAgIHZhciByZWNvcmRkVGltZSA9IG1vbWVudHRpbWV6b25lLnV0YyhyZWNvcmREYXRldGltZSk7XHJcbiAgICAvLyB2YXIgcmVjb3JkZFRpbWUgPSBtb21lbnR0aW1lem9uZS50eihyZWNvcmREYXRldGltZSwgXCJBbWVyaWNhL0NoaWNhZ29cIik7XHJcblxyXG4gICAgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ0NTVCcpIHtcclxuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdBbWVyaWNhL0NoaWNhZ28nKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdFU1QnKSB7XHJcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignQW1lcmljYS9OZXdfWW9yaycpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ1BTVCcpIHtcclxuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdBbWVyaWNhL0xvc19BbmdlbGVzJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcclxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnQWxhc2thJykge1xyXG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ1VTL0FsYXNrYScpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlY29yZFRpbWU7XHJcbiAgfVxyXG4gIFxyXG4gIGFkZFRpY2tldERhdGEobWFwLCBkaXJNYW5hZ2VyKXtcclxuICAgIC8vLy9sb2FkIGN1cnJlbnQgbG9jYXRpb25cclxuICAgIHZhciBtYXBab29tTGV2ZWw6IG51bWJlcj0xMDtcclxuICAgIGxvYWRDdXJyZW50TG9jYXRpb24oKTsgICAgXHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLlVwZGF0ZVRpY2tldEpTT05EYXRhTGlzdCgpO1xyXG4gICAgdmFyIGluaXRJbmRleDogbnVtYmVyID0xO1xyXG4gICAgdGhpcy50aWNrZXREYXRhLmZvckVhY2goZGF0YSA9PiB7XHJcbiAgICAgIGlmKGRhdGEubGF0aXR1ZGUgIT0gJycgJiYgIGRhdGEubG9uZ2l0dWRlICE9ICcnKXtcclxuICAgICAgICB2YXIgdGlja2V0SW1hZ2UgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ2dBQUFBdENBWUFBQURjTXluZUFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBT3hBQUFEc1FCbFNzT0d3QUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU5PU1VSQlZGaUZ6WmxQU0JSUkdNQi8zOXRNQ0NOM055M0lMbEdDL1RsWVVPQ2ZUWUl3SVNqd1ZuVHBWSFRKZzFFZ0NkVkZxMXNSSFNMb25JZTZXRkdrcTdzVkZFaGhtdVd0UDRUTWlpaUZ1ak92UTZNNzZxdzY3cmpqN3pidmZmTjlQeDZ6Tys5OUk2d0EzVUNoTVU2dENMVmFxQlNMWFFoYmdDSTdaQUxOYnhHR05QUnBpRWVMNkpWT0pyM1dFaS9Cb3pFcUxZc0xDSTFBc2NkYW8wQ0hNcmtiVHRMbnEyQ3FqcjNhNUJaUTcxRXFXOVZPVEpxakNmcVhEbDBFdllmMXFRZzNnQ1pnblM5eUdkSmF1QjAxdUNyOVRIa1dOT29vRTVNbkd2YjdMRGJmNEwyZTV1VG1OL3h3bjNhVHEyWVBJWjZqMmJhcWNobStBL1hSSGo3UG4xZ2dPRkpEdVJLNmdhMzVNSFB3eXd3UksrM2ltM053anVCSU5SdVY0aDFRa1ZlMURFTlN5TUhJUzhabUJwUnpWaWtlRXB3Y1FMbWU1TDV6WUhZRmpWb2FnY2Q1VjNMQkVrNlV4SGtLdHFBK1FFRnFBNFBBamtETmJBUytoVU5VU0JkcEJXQnM0RFJyUkE1QXcwNGp6U213bjBHQjg4RXFMVVNFY3dCaS82MThDVnJJalpESlRpWGkwL3QxRmJBVTlVcWdLbWlSYkZoUXJZRGRRWXRrUmFoUVFGblFIb3RRcHNqc2d0Y2NBcHNVZU4rRzU1Ry9DdmdadE1VaS9GUUN2NEsyV0lRZnlvS0JvQzJ5SVRDb2dCZEJpMlJGODF6c1Rhb0JGQVR0TTQ4cE0wUlVsU1FZWncydW9zQ3owaTRtRklBUzJvTVdjcUVkN08xV09FNGNTQWFxNDBUVEUra2hBYzR6aWRBTW1FRTVPVERSWEpxNW1CV014a2xxemMxZ25ESUl0RVVUdkhWY1o5QU5GSTVPa0Z6MWJrSVdCRDZFVTFRNVd5RnpqcDNTeVdRQkhJT0ZKL3c4TUpRT2NYeCtuOGE5OVZGSEdTYmQ1T2tncFdGWVc4UktFZ3YzQmNydGhtZ1gzd3RDSEVMb1hIMDlYcGxUVkx2SndWTHROMUJHTFpjRldvSDFQb3ROaWRBYWp0TW1vTE1GTGF1QmFjVFlEclNnT1V2dWZVSUxvU09VNWtweGt1R2xnajIxZ0VkcUtGZHd4bTRCZSszaERLRHBNQldQU3VOOFhlNU5uZ1NkcEdMczA1cHVJTHhFNktnSWh5TnhQcTJranV1UFpEbllCYTh2SS9UYVN1VWdCMEdBeUIvdUFFUFo1alVNUjRxNGwwdU5uQVRsQTlQVy8zZTRlM0pOMDBxK2pjeXBrY3ZOTXhnMXZFQTRPaWV4NW5Xa2x5TzU1czVwQldmUk5BRnB4NGlKY05HUDFMNEkyaDlrSHM0T0NBOGlQWHowSTdjL0t3aE1tN1FBWThDNHFXajFLKzgvZGtqbGZmZTAxNjhBQUFBQVNVVk9SSzVDWUlJPVwiXHJcbiAgICAgICAgaWYoZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcInVua25vd25cIiB8fCBkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkgPT09IFwid2FybmluZ1wiIHx8IGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJtaW5vclwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRpY2tldEltYWdlID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUN3QUFBQXpDQVlBQUFEc0JPcFBBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFQeVNVUkJWR2lCN1poUGlCdDFGTWUvN3lYVDFkM0ZRaEdLZUtub0t0anNXbWx2eFJhaDlxTFZTNmRKWm9PdUJ3K1dRaS8xdEljV3ZPaVdzbFM5dUFlSmF5YS9iSU1IS1lxb2h4UVVRWWhhTnBXeVdGQldvaTMwb0NoMU41UGY4N0Ria0oxTUpwT2RaQkt3bjF2ZTcvMSs3NU5oNXZlUHNBMU0wOXhoR01aQkFJY0FQQTNnQ1FDN0FZeHZwdnhOUkgrSXlBcUFINWo1eXVqbzZEY0xDd3UxN2RScmhycEpUcWZUZTRub0ZJQVRBSFoxV2VzMmdFdEU5SjV0Mno5MTJiZEJJT0ZrTXZsNExCYWJBL0JpMEQ0K0NJQlBtUG1OWEM3M2M3ZWRmWXVicGhtTHgrT3pSRFFMWU1kMkRkdXdKaUp2T283elZyRllyQWZ0MUZZNG5VNC9TRVFmWStNOTdSc2lVaklNNC9qaTR1THRJUG1ld3FsVWFnOHpmd0Znb3FkMjdWa0JjRFNmei8vYUtiRkZPSjFPN3lhaUs5ajQ4cVBrQmpNL2s4dmxmdmRMNHVZZk16TXo5eEhScDRoZUZnQWUxVnAvWnBybS9YNUpXNFRYMTlmbkFlenZxNVkvK3d6RG1QTkxhTHdTbG1VZEFsQkMrR2tyTEZwRURpdWx2dlpxdlB1RUNjQkZERjRXQUppSTV0SEdoUUVnazhrY0E3QXZTcXNPSEppZW5uN2VxNEVCUUd0OU1scWZ6b2pJNjE1eHltUXlEMm10VndIRUluYnFSRjFFSGxaSzNXd09zb2djeGZESkFodE96N21EckxYdTY5SWJCaUk2N0k0eE0rOGRoRXdRaU9oSmQ0eEZaTThBWEFJaElvKzRZd3hnNXdCY2d0TGl4bDVaUTBTTEh3TzQ2WkU0TEZUZEFmWUtEaEdld2gwM3pRT2t4WTAzTit0RGlZaVUzREd1MSt1ZkQ4QWxFQ0x5bFR2R2hVTGhGd0RYbzlmcHlMVk50eTB3QUlqSXU1SHJkT1lkcnlBRHdNakl5QWNZcnVudFZxMVcrOGlyZ1FFZ204MytDMkErVWlWL3poZUx4VHRlRFkyVnBGcXRYZ0R3WFdSSzdmbCtmSHo4WXJ2R2huQ3BWSEpFNUJVQW52OHNJdFpFNUdXL1c4NHRhN1ZTNmpxQTF3RG9mcHQ1b0VYa1ZhWFVOYitrbHBQRzh2THljaUtSV0NXaVh0eFVCa1ZFNUtSU0t0c3AwZk5vVktsVWZweWNuTHdGSUlyajA3cUluRkpLdlI4azJmY0pwbEtwQTh4OENVRExScnBIL0NZaUo1UlMzd2J0NFB2MEtwVktOWkZJMkVUMEFJQ25PdVYzUVEzQVFqd2VUOXEydmRKTng4RHZhQ2FUZVV4cmZRN0FjUUFqM2ZrMVdDT2lvdU00NTVhV2xtNXNaNEN1UHlyVE5IY2FodkVDZ0NTQVl3RzdYUWF3UkVTWGJkditxOXVhellTYUJTekwraExBRWI4Y0VTa3BwWjROVTZlWlVHYzZaajREL3psYkU5R1pNRFZhYW9icG5NdmxyZ0pZOUVuNU1KL1BsOFBVY0JQNjFLeTFuZ1h3ajBmVEhhMzEyYkRqdXdrdFhDZ1Vxa1Iwd2FOcHJsQW9ySVlkMzAxUDdpWEd4c2JlQnRBc1Y0M0ZZdWQ3TWJhYm5pd0U1WEs1TmpVMTlTZUFsd0JBUkU3YnR0MlhyV3JQYm40bUppYXlBTW9pY3RWeEhMOFBjWGl3TE91SVpWbSs4L0k5N3ZGLzV6L2Qwam9FUHpoWkdnQUFBQUJKUlU1RXJrSmdnZz09XCJcclxuICAgICAgICB9ZWxzZSBpZihkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkgPT09IFwibWFqb3JcIil7XHJcbiAgICAgICAgICB0aWNrZXRJbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDd0FBQUF6Q0FZQUFBRHNCT3BQQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBT3lTVVJCVkdpQjdaaE5hQnhsR0lDZmQyWk5hbHNvaUZCVWhMYlpUZnB6TU5MZ1FURkZxTDFvUFpWNFVadmRwSlRXSHVzcGdnRXZtbEpDVmRDZzVzY2lZc1NEOUNMcUlZR0tJTGJhUTJxNzNhMkdsdGdLQlJWTm11ek92QjRTMDgzc3pPek16dTdzZ24xdTgzN3Y5MzBQSDd2Znp5dFV3K1JNQ3d1dFQyQnJOL0FvMEFGc0JqYXVaUHlOY2dNaEMvd0lUTFAwNTdjYzdpcFVOVjhKRWlwNy9Nb3VWSTZCOWdEM2haenJGc0lrTnUrUVNWME0yWGVWWU1JVCtYWnNld2g0TG5BZmJ4VDRBa3Rlb1QrWkM5dlpmL0pKTlpuUERhQU1BQzFWQ25xeGlNanJyRzk3Z3g2eGduYnlGaDY1ZkQ4dHh1ZEFkeTNzZkpqQ0tCN2c0STViUVpMZGhjZCszZ0tKcjRCVURjWDh5R0taKytqZk5sc3BzVno0L2F1YlNkalRvQjExVWZNbVQ2THdKQy91L00wdmFhM3cyQy9yb0hnVzJGMVBNeDkrWXNPNngrbDVlTUVyd1ZqN2FRM1RPRm1BVHVadkQva2wzRm5oOFd3M0tsTkUzN2FpWW1NYmUraHJPK3ZXdUx6Q3FvTEtLUm92QzJCZzJzT291cm9zQzAvazlnT2RjVnI1b25ReGR1VVp0NmFWRmVab3JFSkJFSTY0aDA5ZmZJRGlQZGNBTTJhbFNsZ1V6WWM0dE8xbWFkQ2cwTEtQNXBNRk1ER3RwNTFCQTlGNkg3M1ZZN0NuUEFTN0dxQVNER1duTTJRQVcrSTNDWXBzZFVZTVlGTURUQUtpWlc2R1cxb1RVZVpuQURkZEVwdUZPV2ZBUU11RFRZT29pN0JveFV0encxQXBjek9BNlFhb0JFT1pjb1lNc0w1c2dFb3dwUGlOTTJTUTN2RXJjQ2wrbTRyTXJMaXQ0Yjl0NCsxNFhRSWc4cFpiZUVVNE1VcHpiVysvczc3MXRGdkRzbkI2NjIxZ09FNGpYMVJPZUQxRTc1d2tzOWRQQXQvSDVlVERlUXAvblBKcWREenpMMjhINHp4d2I3MnRQRmhFMkUxdmFzWXJZZTFabmU2NGhIQUlzT3R0NW9LTmF0cFBGdHd1UDcycGoxSHRaN25LR0JlSzZsRXk3WjlVU25TL3JXWGF4MUJlQmlJWG9BT3doT29STXUwalFaTDk2eEFmNXJzdzdFbWc3Q0pkRTRUckNEMGNUSDBYdEl2L2ZiaXY3UWVXN01kQTNxTzJxMTFBZUJjcGRvYVJoVENWbmc5eVNVd2RCQTRBcmVIOFZsbEUrQXdZcERlVnIyYUE4S1dwa2Z3bVd1MW5VWjRIOWdmc2RRYmhVeEtjNFlYVVg2SG5MQ0ZhTFcwODl6V3FleXRrVFpGT1BSVnBuaEtpdmVrczZ6aitlN2FOeVBGSWN6aUlKdHpYY1FIa0k4OTJZWUxlNUxsSWN6aUkvbXEyaXdQQVB5NHRDOWp5V3VUeEhVUVg3dHMraDNMU3BXV0lUUEphNVBFZDFLWXVVZGp3SmxBcU40YzVmNkltWXp1b2pmRGhCK2VCd2RWdjFWZDU2UkczbjBsa2FsZjVtVTJPQStlQUMyeE1lZjhSbTRyUjdGNUdzNVgyNWJ2YzVYL052MW9ZOXFkYkZrbDBBQUFBQUVsRlRrU3VRbUNDXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwdXNocGluID0gbmV3IE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4obmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGRhdGEubGF0aXR1ZGUsIGRhdGEubG9uZ2l0dWRlKSwgeyBpY29uOiB0aWNrZXRJbWFnZSwgdGV4dDogaW5pdEluZGV4LnRvU3RyaW5nKCkgfSk7XHJcbiAgICAgICAgcHVzaHBpbi5tZXRhZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgbWFwLmVudGl0aWVzLnB1c2gocHVzaHBpbik7XHJcbiAgICAgICAgdGhpcy5kYXRhTGF5ZXIucHVzaChwdXNocGluKTtcclxuICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihwdXNocGluLCAnY2xpY2snLCBwdXNocGluQ2xpY2tlZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbWFwLnNldFZpZXcoeyBtYXBUeXBlSWQ6IE1pY3Jvc29mdC5NYXBzLk1hcFR5cGVJZC5yb2FkLCBjZW50ZXI6IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihkYXRhLmxhdGl0dWRlLCBkYXRhLmxvbmdpdHVkZSl9KTtcclxuICAgICAgICBpbml0SW5kZXggPSBpbml0SW5kZXggKyAxO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIG1hcFpvb21MZXZlbCA9IG1hcC5nZXRab29tKCk7XHJcbiAgICBcclxuICAgIC8vIGNvbnN0IGluZm9ib3ggPSBuZXcgTWljcm9zb2Z0Lk1hcHMuSW5mb2JveChtYXAuZ2V0Q2VudGVyKCksIHtcclxuICAgIC8vICAgdmlzaWJsZTogZmFsc2UsIGF1dG9BbGlnbm1lbnQ6IHRydWVcclxuICAgIC8vIH0pOyAgICBcclxuICAgIGZ1bmN0aW9uIHB1c2hwaW5DbGlja2VkKGUpIHtcclxuICAgICAgaWYgKGUudGFyZ2V0Lm1ldGFkYXRhKSB7XHJcbiAgICAgICAgdmFyIGxsPWUudGFyZ2V0LmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgbG9hZFRpY2tldERpcmVjdGlvbnModGhpcywgZS50YXJnZXQubWV0YWRhdGEsIGxsLmxhdGl0dWRlLCBsbC5sb25naXR1ZGUpO1xyXG4gICAgICAgIC8vLy9pbmZvYm94LnNldE1hcChtYXApOyAgXHJcbiAgICAgICAgLy8gaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgICAvLyAgIGxvY2F0aW9uOiBlLnRhcmdldC5nZXRMb2NhdGlvbigpLFxyXG4gICAgICAgIC8vICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAvLyAgIG9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDAsIDQwKSxcclxuICAgICAgICAvLyAgIGh0bWxDb250ZW50Oic8ZGl2IHN0eWxlPVwibWFyZ2luOmF1dG8gIWltcG9ydGFudDt3aWR0aDo1NTBweCAhaW1wb3J0YW50O2JhY2tncm91bmQtY29sb3I6IHdoaXRlO2JvcmRlcjogMXB4IHNvbGlkIGxpZ2h0Z3JheTtcIj4nXHJcbiAgICAgICAgLy8gICArIGdldFRpY2tldEluZm9Cb3hIVE1MKGUudGFyZ2V0Lm1ldGFkYXRhKSArICc8L2Rpdj4nXHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgIH1cclxuICAgICAgJCgnLk5hdkJhcl9Db250YWluZXIuTGlnaHQnKS5hdHRyKCdzdHlsZScsJ2JvdHRvbTozMHB4O3RvcDp1bnNldCAhaW1wb3J0YW50OycpO1xyXG4gICAgICBwaW5DbGlja2VkKGUudGFyZ2V0Lm1ldGFkYXRhLCAwKVxyXG4gICAgICAvLy8vTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoaW5mb2JveCwgJ2NsaWNrJywgY2xvc2UpO1xyXG4gIH1cclxuICB2YXIgY3VycmVudExhdGl0dWRlPTQwLjMxMjg7XHJcbiAgdmFyIGN1cnJlbnRMb25naXR1ZGU9LTc1LjM5MDI7XHJcbiAgdmFyIGRpc3RhbmNlRGF0YSA9IFwiXCI7XHJcbiAgZnVuY3Rpb24gbG9hZEN1cnJlbnRMb2NhdGlvbigpXHJcbiAgICAgIHtcclxuICAgICAgICBpZihuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pe1xyXG4gICAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24gKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbG9jID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcclxuICBcclxuICAgICAgICAgICAgICAgIC8vQWRkIGEgcHVzaHBpbiBhdCB0aGUgdXNlcidzIGxvY2F0aW9uLlxyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHBpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKGxvYyk7XHJcbiAgICAgICAgICAgICAgICAvLyBtYXAuZW50aXRpZXMucHVzaChwaW4pO1xyXG4gICAgICAgICAgICAgICAgLy8gLy8gQ2VudGVyIHRoZSBtYXAgb24gdGhlIHVzZXIncyBsb2NhdGlvbi5cclxuICAgICAgICAgICAgICAgIC8vIC8vIG1hcHMuc2V0Vmlldyh7IGNlbnRlcjogbG9jLCB6b29tOiAxNSB9KTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMYXRpdHVkZSA9IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMb25naXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY3VycmVudExhdGl0dWRlKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGN1cnJlbnRMb25naXR1ZGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICBmdW5jdGlvbiBwaW5DbGlja2VkKHBhcm1zOiBhbnksIGxhdWNoVGlja2V0Q2FyZDogbnVtYmVyKXtcclxuICAgICAgLy9jb25zb2xlLmxvZygnZW1pdCcsdGhhdCk7XHJcbiAgICAgIHZhciBzZWxlY3RlZFRpY2tldCA9IHtcIlNlbGVjdGVkVGlja2V0XCI6IHtcclxuICAgICAgICAgIFwiVGlja2V0TnVtYmVyXCI6IHBhcm1zLnRpY2tldE51bWJlcixcclxuICAgICAgICAgIFwiTGF1bmNoVGlja2V0Q2FyZFwiOiBsYXVjaFRpY2tldENhcmRcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coJ1NlbGVjdGVkIFRpY2tldDogJyArIHNlbGVjdGVkVGlja2V0ICsnbGF1bmNoVGlja2V0OiAnKyBsYXVjaFRpY2tldENhcmQpO1xyXG4gICAgdGhhdC50aWNrZXRDbGljay5lbWl0KHNlbGVjdGVkVGlja2V0KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gY2xvc2UoZSkge1xyXG4gICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnZmEgZmEtdGltZXMnKSB7XHJcbiAgICAgICQoJy5OYXZCYXJfQ29udGFpbmVyLkxpZ2h0JykuYXR0cignc3R5bGUnLCd0b3A6MHB4Jyk7XHJcbiAgICAgIC8vIGluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgIC8vICAgdmlzaWJsZTogZmFsc2VcclxuICAgICAgLy8gfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGxvYWRUaWNrZXREaXJlY3Rpb25zKHRoYXQsIGluZm9Cb3hNZXRhRGF0YTogYW55LGVuZExhdCwgZW5kTG9uZykge1xyXG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucycsICgpID0+IHtcclxuICAgICAgZGlyTWFuYWdlciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLkRpcmVjdGlvbnNNYW5hZ2VyKG1hcCk7XHJcbiAgICAgIGRpck1hbmFnZXIuY2xlYXJBbGwoKTtcclxuICAgICAgbWFwLmxheWVycy5jbGVhcigpO1xyXG4gICAgICAvL3ZhciBsb2NjID0gbWFwcy5nZXRDZW50ZXIoKTtcclxuICAgICAgdmFyIGxvY2MgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oY3VycmVudExhdGl0dWRlLCBjdXJyZW50TG9uZ2l0dWRlKTtcclxuICAgICAgLy8gU2V0IFJvdXRlIE1vZGUgdG8gZHJpdmluZ1xyXG4gICAgICBkaXJNYW5hZ2VyLnNldFJlcXVlc3RPcHRpb25zKHtcclxuICAgICAgICByb3V0ZU1vZGU6IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuUm91dGVNb2RlLmRyaXZpbmcsXHJcbiAgICAgICAgcm91dGVEcmFnZ2FibGU6IHRydWVcclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIGRpck1hbmFnZXIuc2V0UmVuZGVyT3B0aW9ucyh7XHJcbiAgICAgICAgZHJpdmluZ1BvbHlsaW5lT3B0aW9uczoge1xyXG4gICAgICAgICAgc3Ryb2tlQ29sb3I6IE1pY3Jvc29mdC5NYXBzLkNvbG9yLmZyb21IZXgoJyMwMDlmZGInKSxcclxuICAgICAgICAgIHN0cm9rZVRoaWNrbmVzczogNVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RXYXlwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IHRydWUsIHRleHQ6ICcnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEMEFBQUE5Q0FZQUFBQWVZbUhwQUFBQUJtSkxSMFFBL3dEL0FQK2d2YWVUQUFBQUNYQklXWE1BQUFCSUFBQUFTQUJHeVdzK0FBQVkxa2xFUVZSbzNxV2JhYXhsMlhYWGYydnRjODRkM3Z4ZURUMVA3bmJiN203YjNjNWs0aGdMTUIveUliRWlFRUlKRWlBSGdSQVNnZ0JCSVI5UTVFZ2doSVFWUjlBSmliQ0lFUXFLRkRHSUtTR09vUlBTZGx2ZGRMdXJKM2YxVUZWZFZhK3EzblNuYzg1ZWl3OTduM3Z2cThGZERVZTY5VzY5ZCs4NWUrMDEvOWQvaTd0enU1Y1pxS2IzYnVBS09CaUd1MkFPQnBoRGRNYzgvVDRpNEk0N0lMZTR1WU1JSUVMQUVYRlVsQ0NDQ2lpZ1F2bzlDZ0ppSUhyajJ0N3ZrdHNSMmoydlZjRE1jRlhjREhQQjNEQVVjMmdzNGlpTkc2MDVyVU0wVDV2aDRJQ1p1NmlJT1E2T2lvaWJ1NnFJWk1GVW9GQWg1SitsS0lKUmFrQUZBb2FJb3VLSUttS0dab205Mjd6L0g2RWR3TUFsdlhlenRIaDNvaXZSamNhZHhxQjFwNDdRQXRQV3ZERW5PclNkME9ZWWpvZ3NOTzdnN2lpQ2FOSnFrVitsQ3IxQ3BRQ3FBS1VJaFVJbGtxM0FVQkdTZ1NoQms4WkZiMjFRQU1YN0NleDU5MDNTb2lNa1FjeHBQVkliekZxbk5tZHE3ck1JVXpQcTZMUUdqVGt6Z3pvYXJVR1V0REJ6QTBCRlVCV0Nrd1FLU2sraERFSXAwQXZtbFNxREFKV0s5QXFoQ2xCSm5HOU0wcjVqcFBmV2FmU0RDdDBKVFBiUDZFbTdyU1Z0MWdhMU9aUFdtVVQzU1d0TXM4QlRnLzI2NWFpQlVlUHNOWkhEMmhqRjlKbldIZlAwQkpGa3ZuMkZsVkpZcXdLYlJVanZTMkdqQ3ZUVjZLdlNLL0JoVkFaQnBCK0VuZ3BSblRLaytGSllXck1ndU54YThPSldBbmNPNGdnR3RER1pjVzB3YVoyWk9hUFdmTnc0bzlhWW1uTlVPNWVtTFZkcTQvdzRjbVhXc2orREdaWWUzdTJrTEQ5RndPT3gxWldxYkpSd3NsOXcxMHBncDFKTzlBcldLMkhVR2lzaCtMQ0VRYUV5VktHUFVMcmpHaWcwQlQzSnpuMnoySG1EVC90YzNxUU5RNG51MUZtd1NYUkdqZnRSYXh6V3hzU2MvU1p5YnRSeWJoUjVkOXh3ZVdxWUpNdHdFNkliU0lydTBzbWVueXZaSnpzM0VuZFVOVWR2SVJpY0hDcDNEd3Z1V1MyNGMxQ3dWUVlHS3F4V3ltcXByQlFpZ3lEMGcyYTNFSVRzN3ptcXlhMkV2bDdnNkJCZG1FVm5HbzFSNjR5aSswRnRITlNSbzlaNGQ5VHkzYU9HZDQ1YWR1dTRFRlNTNzd1bGU3a0l1T0RjUEhBS0F1SkphRWxCTFFnRUIxRW5pTERUQzl5N1V2Q2gxWko3VmdwV1MyVzlES3lWeW1vaE1peUVRVkNxSUFSeGduQlR3WXNiQktiTHRVTHJLUUNOVytlb05RNGI4NFBHT0dpY0s3T0dWL1phWGo5cXVEaU9SRWlCS3Z0K2w2dkp1ZHZkRWVGN0NMMzRqSkxDL1R4SGU0cm1seWJHMVduTnhVbmtRN09TUjlkS21qN1VaclNtSGwzRkhWeUVudW84elNvTEM1Tk9hTy9zUHkvV2tCU3djcUE2YW8zOTJueXZqaHcyemp2anlJdlhacHc5YWpscW5SaU5Obi9IUkxCbzg3enNuWmkrdkxWeWsvYysvNVVBNGtMRWs5QkJhYzBwRktJNDU4Yk9YbTFjblVVZTMreHg3N0JJOVVCNm5LQ2FFcllLaGFUQ0tCVTJTY1pqZ2N3OWhmMDJwa0ExanNaUll4eTA3dGZxNU1PdkhUWThmN1htM0xpbE5tZ3NGU0tSVklpNGUwcHZ2ckFkUjQ3TGVhdTRLb3ZONlQ1cUltaHJTRTVGTWFjbWE1d3pldzFIalZOdjkzbG9yY0RGd01WZFRDaUJYTGtWbW1KRlorYUY1MkJpcEZ4c0JvMm5vRFZxbmIwbSt0NHNwWjFYOW11K2ZYWEdwVWxrNWs1clFqU243VXBRQThlQUhEV0ZKRERmSTM5Yy93ZFptR0hLYWs1MFIxeVQ2MGtLRmxIVEJyd3phcW5qbE5wTEhsbXJVaUdGdUlxSWloRkVjNHhJOTFRUkNvRmNKaVp0TlFiVENPUEdPV3lpSHpiT1FSTjUvYURodWFzMWx5ZVJtVU1kbldpTEhPNmRpWFpST3FlTDI2L3NiN0lKT1FPb0NPNUdkTUZjY0hHQ2E0b0JPTzlOV3A3ZE5RVGh3MnNRTkZCbzlFQVFXYW9BdXpSV3VDVXJpREdaVFcyV0k3WE5vL1IzajFxK2RYWEdwVWxMNDhta293dlJqTllsR3h5WUxJS0hIMS8rUEJ1MDFtM1M0dTlCSUdqU2dHWVRuRzlXdDNraXFGc3FZMTBYM1VidU5DNU5JdC9hblZJSmhKQWlmeW5paFlvVWFxZ29pcU9GVUpoMkNsTGFhRXlqTTI3ZEQ1c1VwQzZNSXk5ZG5YRmgxTktZVStNMEpuaE1EWWZUK1pzdUZydmtsN1hCSkJvbDhMR3RIazlzVmR3OUxOam9CZHlNdmNZNVAyNTU2VnJEUy9zMWpVVUdRU203K2prTFRkNVV4VkxlZDhWajBwaGp1QWpuSjhiejEycUdwUkpXQ2lwMVNoVktWUXB4eXFCNExuZXBjNGMwYTJFV25YRVRPV3FGYTNYa093YzFyeDFGb2pzTlFveXAwektYMUZLS0hvL0QyZFRiWEFELzRNa2VmKzZoTlQ1enFpK1QxdmpXbGRyZk9LdzVlOWdBc0ZrSm56MDk0RzkrYkVNR1FmakdlMVAvTjJlUGVIWjNsdEtMNXFpUWhiY2NuS0liNmtsUnVOS29JT0o4OTdCbHExZXpWaXI5VU5DUDdyMW9VaUNvUnZvZUtNekovZ0l6WU5MaVIxRTRhbHJlUEd3NXM5ZGdicW1MeXBGNldlQmpnZGRUTzFrSWZQcmtnTC8rMFRWMmVzcS9mTzJRbjNsMjE5KzVWak9QYTEzLzU0dmNkdTlXeForOWY1VXZQYlhGN3NUNThpdDdmUFB5RElQY1l5KzA3cUtwYVhHbHRSUThnd2h0Z0JmM2FrNzJBc09nOUZYcEYrbzlSU3BQalk3VTBabGFaTkk0aHcxY21iVitkUnA1NDZqaG1Vc1QzamlLMU5Gb290TjRDbDRtVG1vR2o2ZTd4bUdyRXY3V1k5czh1VjN5ajEvYTQydXZIZ0lrWDhxNThtWlh0MkhXcGxyMUp4OWU0KzkvZkpNLzJxMzVweS91c2QvWURkOVBVZDVRRjRLbWpxdEs3U2dQclJaODVsU2ZCMVpMZHZxQm5hcVF0UjRNZzZKT0VxUXhtSnI1SkRyN1RTb3YzeHExV0xhQ1NBY0UzRmpDZSs2bkg5Mm8rT2MvZEpyb3pxZi8wem0rOXVvaFpTbjBLcVhVUlRsNHM2Z3VJcWwvcnBTeUVIN2p0VU0rOVIvT0llNTg1WWRPOE9IMWtzYkkzZG54U085MEZhQWt4Ymh4OXFqaDNiRngwRmpxQk0yOGlhbGkxR1N5a3JxbWFJeGJZN2MyWGo5c2x3QUF5YVZscXFFOVZjcHpnV2NSUHJYVDR4OTkzdzcvN3EwanZ2aDdGNm1qMDZ2MFdEVHVHZzB4UjZMaDBYREx5VzRwNHFzazRkdm8vS1d2WCtUZnZ6M21GNTdjNXFtZEhvMHROU3VrT3NCRjVxV3Z1OUxrY3ZpVi9SbFhhbU1jalhGMHBqRXBwNGd1dEdaTW8vdTBkWTVpeW52dlRkdTBlK1lwUFhsblVrc0NBOVBvZkd5ajR1OCtzY25UWi9aNCtqdDdsTDB3RnpiRFkwZ2RvWW5RR0JKekpaTWtoRjdSSVFoNFNOS25JQ1pvcGZ5VEY2OXkwQnAvKzdFTnZ2VENIaS91MWZUVWx6bzBTZnJPYVRHWVl5cThONDI4TjJvNDFRdXNGRVlka3F4RjZ3a01tRm5xcEE1bWtiY09Hc3lnWlFFZWVOY3BMVjNSbkoxZTRPODhzY2x2dnp2aDZUTUhsRlU0bm12cmlJd2FaRlFud1cwQllzM3Y1ak84VUZncFlWakJNTXczVjBVb0N1WHBWL2ZacUpTLzhkRU5mdTdiVjdrMmk1Ukx5MGw5dnlPNVVTcmNpU2E4ZWRUeTRKcXhYaWt6YzIvTVJXUEd0ZXFZekhTL05zNVAybFJwbWN5cnRlT2xSakt4MnAwdmZuaURjK1BJTDMxbmp5SXMrYTJRaEwwOFJxOU9rRmxNWHd5NlFQL21MeEF6WkgrS1hCNGhlOU1VUkRwelJ5aFVlUHFWQTg1UFd2N2l3K3ZFcklpbG9JQXZkM2lXVFA3Q3hOaHZJdFBvekxKNWE4SzYwaS9HclhOcEZobEhpRWoyRWNtZDBuRVVvakY0WXJQaXlaMlNMNys4eHpSYTZtUTZnWTlxNU1vWW5iYkp4RFc1eUtReEpyUElaTnFtVngyVG4rWU5FVFBrMmhTOU9sNENHbEo3ZU5RYXYvcnFBWTl2bGp5K21meDc0ZHRkUitjSmR2WWt3N2cxTGs0ajB6YkoyTHBUNUJiU2EvUDBnWEdjUjhONWU5aDFEOHZCeTV3Ly84QWEvKzM4bUZmMjYwWHJKaURUQnRrZEo5L1YxTTVORzZOWENIL3lvWFdldkhQSXpyQmcxaHF2WDVueHUyY1BPSC9RVUlWVWp1S09ITTBRQlQ4eFJISXRMKzZjMmEvNS9Zc1Qvc3dESy96OHQyZVV2a2hqcVl0TWErZ3MxSUVMWStNajY4WXNLclc1RithcCtXOE5aZ2E3c3hhM2habDBwcjJzNWVqdzRGckJ3eHNsWHo2elIyMnBJT2xBT1M2TjVnS2JPMjEwbnJwcnlNOTk5aTZldW5Nb0oxZEtocVhRR2x5YnRKemRyLzFmZmZzeXYvYmNGWnBvbENIMXc3SS9nMkdGRHdzazNZNVI2L3ozODJQKzRaTTdQTFJXOHU2b1hmTHRwUE81d2pLZ2NHbVMydUNZWlMxY0VqclplR1RXUnZZYng4V0pzZnRTNXpzTFRUZm0vT0NKUG1mMmFzNlAyMFdaS01EK0ZLbFRFK0R1bU1Hbjcxdmxxei94b0R5NDFUOFdDTXNBcDFaTFRxMlc4dkhUQSs1ZHIvd1h2M0dCYWVNcFByampsMGZ3d0diYWhBd0l2RHVPdkhiUThLbWRIbWNQRzBxVnVkQ3BEazhhajVaMjZyQXhadEZTNysrYWZOcHk5M1BZcFBUa3VSVkw0UDZORlZSajhNbXRpaGYyYXNadDBrQ0tPSXJ1VFJGTkc5QkU1NDdWa2wvN3dnTTNDSHo5MVMrVW4vM3NYZktGajJ3UlFySVFKS1U2bWJaelNEY0lITlRHcS9zMWoyMlVjNzlldnR3V25WbVVoQVFkMURZZk9taXFZVk1oUDRxV1lGOFRmQWs0dnI3Y0xCVHVYUzE1NDdCbEduM3g5MWtEZFp4L3JsOHFQL1hKYlI3WkdYQzcxeTkrL2g1WnE1Um95VWxGQmZabng5TGNLRHBuUjVHN1Z3cjZoZDVZcGMwTENjRVRRTWRSOUR5WkFYV3pQRzlLdGZVTlRmOTFpamFIRTROQWNMZ3dibWs3bnhlUUhLazdJR0cxVkg3eTR5ZHVXMkNBZTlZclBuSEhJQWVscEcydG0yUHJpR2JzVGx0dzRVUXZwYXFicmJtcjJ4eW44WXdPbWFPSW9Kb21pbTJVRFBIY0d2RndZQ1VJMDF6amR2NE1JTTJ5UlVBWmxNZE9EZDVubkhiajlYMTNyYzBESTVDYThrNmUvS3pXb0FFR2hkeHlyY3ZmYWR1WVN1QThEUGpBa0k2S3BsSHQ4VHVEeGJrWk9oRDAvdzBzV3UwdHFldW1DMHk5YzVxSDNkNmV4cVdiYU9mRGtvZGdYWnkrMWEwRUdEV1JYaUVVR1VEb0FEeXZBaXcxQTYwSlI3WHhRYSt6MTVwVVV1Yi8yOUxjMlRNcVUrU3ViTmE4Ly8zZG9Rb2h1d3lvcUJKVVVJUXl5QnpqT3RaVkxBc3RjSzFPMWRkV0ZWREpnemhJOVhQK3ZBcU1HK08vdnI3L2dkWDl2OTQrVElFc1AxK3FZbm5BaG9xd1Zpa0Z3clhHRjlsajhaSDVXcEcwdGxKU09adW1wSjRFQ0dLc2hDU3RTQ282dXpuYjhxcEZoRWxydkRkdWVXaTlvSys2d01VRzVSd3pVb0ZSSGZuMTV5NS9JSUYvODZXcmZ2NndtVmQ0dU9PcjFkeUNIQmdFNWY2VmtzdlR5R0ZyTjFwbFJ5TEl3d0lreFNIcFN2M1F6WGRGV0MyVjRJNDZTTFp6a2VPSzZscStGL1pxSHR1b0dCUXBVZ01RQkZzcE05Q1lBc3ovZlB1SXIvenZTN2VsN1RldVR2blMxeTh3Ym1KYWJOZS9yNVoweXpDSDlWSjRlTFhrekg1OVV6UkdaREVwVkUvUTRYb2xoTFRFUk5Nb1JDZ1Nsc1JhcGFua1UrYVJXVVNPcWJ0VTRkbmRHUi9mcWpqWkR3dHdJRHErTTBpUndkTXM2ckNPL01MWHovSEx6MTcwSytQMnBzS2FPMy93enBILzlHK2Y5ZTljbml5R2J1YjRXaStWYm5RVEdEZzlESHhrcytTYlYrcWxhb3g1MWRiMTJVRlRXYnhTaFRUUmxEVG1LVUorVTJvYWRXNzFBOWZxaU5xQzRHTHV4d2RnQWkvdjFldzF4dWRPRDNqenFKMS9obDZKYi9TUlhKbVZxdXlPVy83ZWYzbVhQM2hyNUgvcTRYVWUydXF4M2dzMDBibHcxUEROY3lQKzdZdFhlZjNLbENJa3Y4TWNMd05zRCtnUWpHVGF3aDg3MmVld01jN3MxNVRIeURVT0pMUkc4L0JQQkhaNmdWNGU0NFpPNkRKQUZZUkJFRTcxbFRjUE80RnR5VCtXQUhwSlNNVnZuaDN4eFVmVytNL25KN3d6YWxMemFjRFdFRzhzQVFkWjhEbzYvL3I1WFg3cjVXczh0TjFqb3g5b1d1ZWRnNW9MMlllcnNLUmhGZnprRUM4RXlieVU2UERnU3NHUDNyM0NWNzk3bUxncVM0aHNFamtCQ1pyWlNRaWM2aW45a0VERE1pQ3FpYmNobFFqOUFLZDZnVXBJekozczA4ay9qN3RsRllSbkxrMjRPSTM4OUtQcmVZQ2ZYU20zaExaV2dhY05DaXIweXpSOWZQbnloR2ZlUHVLYjUwZnNqbHY2UlVJd0JTQWFYaWwrYWdVZkh2ZmxRdUV2ZkdpTks3UElIMTZlVW9YanVYeHUycklZK1pZcTNEVUk5QkpuSlVGUWhTYm5Ma09xYmpaN2dWT0RrS0dhRk9BNnpTNFBIalVqRlY5NWVaL1BuZTd6RXcrczBrYlA4NldVdm54bmlPMzBvVlNJaG5oNlZoVlMvT2dWbWdJUkxFeDRyWWVmV01GWGxnVk84UENQMzdQS2o1d2E4UFNyS2FVdHcxS3liSVVpODRCMXVoL1k3QVVHUlpxYUZBSWFKQkZXZWlyMGdyQlJLdmV0VnRsMzB3M1VPOFRxdUxaTGhiZU9HbjdwNVgzK3dTZTIrZlRwQVhWaml3SW5LTDdldzA2dFlEdERQQWU5TkwzUFRiem5EZHJzWVhlc3BVRFlMK1lDdXp0TjYvekk2UUUvOC9nbXYvTGFBVzhlTlZRM0VPWFNabXNPb0VFRlFYaHd0V0sxVkhxcTlFSWU4U1NDbWxLcFNUK0lyeFRLblFObHB4L1luVVlLZDF3Vjh6aHZBTG90RUVuMHBtOWNuTEorWnA5Zi8rRlQ4cGVmdWVUUHZEdW02dWw4MTcwcWtpbXRWY2xmWTlmalNWSjlUcUN1eHdGRGQ2ZWVHWis3YjRWLzl2MG4rT1V6Ky96K2V4TXE1UmlHTGhuTVVsR0NhcUplcUxCZEtYY01sWlZDeUd3a1NabEtoQ0F4VVphQ01Temd4S0RnNGJXU0sxT2pFQ2RtMHNxQ1JySEF5MVNFUXAzLytNNlljWXQvN1RPbjVFdi81NXIveWt2N1NKbjRIL05CWEJBSWtBYm1OMTdMMmJhT2p0ZkdYMzFpazUvOXhMYjgvTGQyL1grOE43MWhzaWxMcVVwRlVDeFpxTU9IMTlOMFk5Z0pIWVJDbkVJeHFpRFVCa01YbVFUMXpSTHVIWmE4MmF1NU9JV3lDRmdUYzFHVVowaTU3bDRXL0hjdmpIbDdWUHVYdi84a1AzYmZDbi90bVYzZTNadEJGYTR6UjFsVzU3SG9XMXY2NSs2dGtsLzkvRjNjM1EvODFPOWQ5TE5IVGFKTFhUL0tkVU5SUWxlUGg4UWtQTlVMM0w5YXNGa3FnNkQwZzBoVktKV0NxaWdxU2hXY3ZnUldDbUdsZ0h0V0FoL2I2bE5LU0RkVUpSU0NobzViWU1jZXJpSlVDbThjdHZ6bzc1em41YjJHNTM3c0h2bnFuN2lMSjNkNjFMVlJONGxKV0p0Ungvd3lUNzlyakxvMm5qclI0emMrZjVvWHZuQ2ZQSDl0eHAvK25mTzhOV29vYnlLdzVMbTRCaWNVUWdoT0tVbjRKN1o3M0RFc1dRbktzQlFHS3BUcWlDalNSS1AxdEpocEZQWWI0OW9zK3U0MGNtN1M4b2VYWjN4bnIwN2tPWVRHbk1ZY2l3YTZtRXQzNXRsVlRaUFcyQ2dML3NxamEvejRmU3RpRHQrNE9QWG5yczU0ZTlTd1Y2ZWxiMWJDZlNzbFQyMzMrT04zOUVXQTMzcHI1UC9pMVgwT2EyZWxYTVNQNVRDcUdGZ2k0YVFaZE9LUGxRcVBiMVg4d0U2UHUxY0xUbFNCclY2UTlWTHBxOU12QkVtZ2ZoSmtGcGxUcDY1TUUrUHZ1NGVSWnk1UE9UOXVFald5TldveUV5a21rcHhuQnNMMWMycHpaeHdkZGVmak8zMSs0RVNQajZ4WDNMa1NXQzhENE93M3pvVnh5NnNITlgrME8rWDVxdzNtempBa3p1ak5lRWpxS2YxcFNOVG9BcWNxa21uZk15ejQ0Wk45SGx3TjdQUUxkbnFCdFZKbHBWQjZJWlhRQmU2SlM2MkphamdJUW1zaXE1VjZiWUg3VjVWUmEweGlvakI1a1dqUDBRU0NZdEZRV1c3bXMwWnlqbC9MTVBETGV6VXZYSnVsVVcrMmhxU3haTFpCRTh0M0VKaFhXUjJDMHhuMS9PZXl3T3FVbW5Md2RoWDQ1SGFQKzFaS1ZxdlVRSFU4MGpKajZnb3Bla2RQL2Fab3lpVERvRVNRYU83UmpVZldTeVptUEhkbHhuNmRLQThObnVoSVFUT3JLUGZWU3hqMGN0bGFCYWh1QStWWWhxcVdoZTFnYUVVSllXbWpWS2xVMkN5RnA3WkxQclJhWkNLdHNsYXFESUxTeTZaZmRKU3FGSVFTc0pkTFVpd2syRFJXS3RFU29Qalllb1daOE1LMUtkZWF4T1FSSEhXaEpiTVQ1aXZPd2k5TlJtNFhTVmdNOVh3QkR1YW5hYTYwUXFaUWxxbVdacXRTbnR6dThkSE5pczFlWUwxUzFndVZRU0gwczc5M3pZZjRFazJ5U3oxQm9YSW5JcXlnZUlXWTRHNkJKN2JUUTE2NE9tTjNsc0NITmlidVpuU1pUeFZpbHJKYjlQVWJjR3MxK3h6UzZiNGpJZ1E2QUNEbjJTQnpydmVKbnZLSjdSNlBycGRzVjhwbXBXeFVLaXVsSm9GemJOQ2xMSG1NTWRpMXBxS0M1WWRhSVNsQ1o5cmg0eHM5K2tGNGFhL20zRkhMTEhjMU1SOWZjTTlkVVc1U0xFTXYwb0VDMTZ2VWwvNDdGM1JCWkJVODEvOU9JZWw5cWRCWDRaN1Zrc2ZXU3g3YUtOa29ReEk0a1dQcDU3SzY2eTJXMis0Q09tWmZ4OGxNUXBlV3VvUEVMWEVSM0lNYWhTZ2ZEUlhyWmVDVmFzYnJCeldIcmREbVNpaGFZaGE1Q0dhSk91MFpkNXJ6UkhQMDcveDl6aXRjWXV5cWVJcmVlYmlncWhTZTZvWDFTbmhrdmVUUmpSNTNEUklMZUtPU0ZLV0RNcGhYWDdsaDhpVVo1VHJ6N2paQXV4WUxoM3hvUkFpU0NHN3VpZENTSG5SSFAvREdZY3Vib3liUkhrZ3RZRFFuNW9tbGlXYWFoV1NheFJJUzA1M0I2RFNzQW02WkFleUpDRWM2bjFHSjhNQmF5Y05ySmZldEZteFZLV2l0bGNwYUtUTG9CQzZVTXRmZnk4ZEZibXJlbmRCay82WWo1aFVaZmpHbEVKTkMxQ3QxZWxxd1hnaW5od1VQVEVyZU9xeDU2OGlaeEpheTZMZ3FpYWhqb2huelNoendlWFBoanFoa1RFN21ITzBnaWVpT3c2QlE3bDlSSGxndHVYTlljcXFuREl0TWNpOGtrOXd6VUpEUGZpUS83Z3FiNjJTODFXbWRaV0pNT242VUN4aHpwbTBxT3NhTit5Z1Q0STlTSmNlVjJubG5OT1A4eE5pZEdHMzJZODlISTl6bnlhMHo5S1VwU2VxVUJLZlFOTEs1ZXhpNGQ5aGp1eWRzOXdQRFFsa0ppY3crTEVXR1FSZ1VNcWRUTFNLMTNCSy8vNTVIbERvZzMwbnpJOHRjc2NaZ1pzNnN6WXovVE5LWlJtZHF6djdNT0l6TzRTeHl0WWxjbXJUczE4NG9KdjU0YThlTGswS1RFS3NsYkpTQmt3TmxweXhZcllUMU1nV25LZ3MzQ01Jd2FEcTRrZ05Xa2NHQklwL2I2clI3eTRIRit4NUc4NVREelZJWVNrY2M4aXpKblRvYU00TlphMHdpUG8zR0xFS05VN2RwRXhaOGovUnE4L2ZKL3A4V25JQ01LcVEyc0s5SnFCS2hGNkFmbEVHQjlMSVpkN1YyRjUyRGtBNm1lWjVWZlkvc2VGc244Q3dIbWtSZU55eUNrdzZpdFpuM1hWdnVtSkpnUHZNMG42NHQwWmpTd2JUTUNuU2ZqNEs3QXlwZHBLMVVDS3BVNmducHlCaGVUenNUVmdwTm5WVElRVlpESXZTR3ZOYjNPMzE0VzBJZlUzdytZK201RURFZ3hrZ1VKVnFrYmdXVGhUWWJpN1NtdE80ZU0yRTljVmtXUHQxaGNTR2pHb1drSTRhZEZhZ0xWZUVFRFFRM1FnanBYRVpYWmMxWjBJdmpoOS9yK3I5YzN3THQ3SVBJT0FBQUFDVjBSVmgwWkdGMFpUcGpjbVZoZEdVQU1qQXhPQzB4TUMweU5WUXlNam8wTXpvd05pMHdOVG93TUZDemtDb0FBQUFsZEVWWWRHUmhkR1U2Ylc5a2FXWjVBREl3TVRndE1UQXRNalZVTWpJNk5ETTZNRFl0TURVNk1EQWg3aWlXQUFBQUFFbEZUa1N1UW1DQydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICBsYXN0V2F5cG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiB0cnVlLCB0ZXh0OiAnJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUQwQUFBQTBDQVlBQUFBNWJUQWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFoOVNVUkJWR2lCeFpwcmJGekZGY2QvNTk2czQvVjZ2VTVzRWxPMklYR2FoMjN5c0oxRUVOSHlVQitrbEg2QnZxQnFvYTNVaDVEYVNrV0lpbEpVcVNJaXFvTDZVSVZhcExZaTFPVWhFTFNncGhVb2tJWkVKQ1l4OFNPSlkxeUpCQ2V4MTE1NzEydnY3cDNURDd0cjFzSEc5M3J2cXY4dk8zdnZ6SC9PLzg3TW1UTVBvWXpvMjdBaFBHVlpuMWVSbTRHdGlLeEJOWkovUFE0TW9IcEM0ZFYwSnZQeXRmMzk0K1cwcHdBcEIyblhwazJOampFUG9QbzFJT1N5MktSQ2g0bzgwdDdkM1Y4T3V3cndWZlNoYURRWWpFUWVSdlhIUUdDUk5GbmdNU2NZL1BtMlk4Y21mVFJ2QnI2Si91ZjY5UnNyUlA1VmE5dFJYd2hGVG9ucTdWdDdlcnA5NFN1QzVRTkg0UGJhMm9jcVJVNzZKaGhBZFlQQ3djNk5HNi96alRPUFVsdjY0ODNCNEV1L1g3VnFTNDF0KzJMUWh5QVN0eDNuazV2Nyt0N3hpN0tVbHI2MXhyYTdIbzFHeXljWVFEWGlXTmJmdTF0YWx2dEZ1VmpSdHdJdlBORFFVSHRWWUxIK3loTldwVlVmOTR0c01hSzNBeDA3UXFFbHQwUWlDMmIyRVhkME5qZnY4b1BJcStnNjRFV2cra2NyVi9wUnZ5ZUk2bTcxWWNaWjRqSC9IcUJoV3loRVUyV2xwNEk5cVJUUGo0MXhJcFVpNlRoRWJKdHRvUkJmWHJhTWFFV0ZPeEtSelNldXVlWXpuRHk1MzZQZHMrQkY5RWJnR3dCZjlOQ3RNNnJzR1JyaTJkRlJ0T2o1K1V5RzNxa3AvaHFMOFlNcnJ1Q2UrbnBYZk9vNGR3TWxpZmJTdmU4RmJBdTRxYWJHZGFHT1dHemZNNk9qdHluc0FyNEh2QXdmNk0rcTh1dUxGL25qOExBN1FwSGJqcmEzbCtROTNZNFBHN2dBMURWVlZ2SlVZNk5iL21kYmUzcStOTWZ6RzRBT29LSHd3QUk2R2h0WjUyTFlxREU3Mi9yNjNuUnJ4T1Z3MjlMdDVKd1lUY0dnYTNLaitxdDVYaDBBYmdGU00zbUJwMkl4Vjd3aTB1cmFpRG5nVnZSTUpWSDM4M0t5cmJmM3lFZThQd0hzTFg1d09KbDB5LzBKdHhubmdsdlJhd3FKaVB2b2ExaVk1YnZtd3ArSy84U3lXWGZNbGxYbjFvZzVpN3ZNRnk0a2xscXVmZCtWcjYxZXZkQUE3UWRtbG8rdXB5NVY5Mk5zRHJoVk1OUHZFbzdqbHJ1aU5oaThaWUU4UzRHWkQzTmpPUHdSV1QrQWlKUzB3K0pXOUtWQ1l0eTlhQkI1Nk9tYzU1OFBOeGRzQ05zMmR5MTN0Nll3eHJpYzMrYUdXOUduQ29sem1Zd1gvdFoxTFMyL21TZDBGT0FCZ0FvUmRsOTFGY3VYdUl1VkxKRjN2Ump4b2ZJdTh4MGk3NVI2cHFhODFhRDYvZVBOemM5M05qVmRYZlJVZ04zQTllc3FLM2xpOVdwMlZsZTdwalNXZGN5YkViUGhKWGp2QWpiWkloemNzSUZLOXc2dGdMVENhK2N5bVhjUFRFeDhLbTFNODlhcUtyWldWWGxkUVV4WHA5T1JkZjM5MDE0TktNQkw3UDAwc01sUjVVZ3l5UTB1blU0UktnUStGdzBFWEkvZGVmQnFLWUxCVyt6ZFFiNkx2NTVJbEZKblNWRFZsMHJsOENLNm4venE1c0RFQkk0dUZIZVVBU0tPNVRndmxrcmpkV0R1QlJqSlpqbjQvMmh0MWYxYlQ1OCtWeXFOVjlIN2dVNkFGOGJHU3EzYk0xVGtDVDk0dklwVzRFR0FOeElKM3ZjMlo1Y0drWE5Mb2VUeERJdmJHSHdGT09Dbzh1VElpQjgydUlLcTdtM3A3azc3d2JYWUxlQjdnZXdMWTJQRXZZU2xpOGRZT3AzK2cxOWtpOTJsdndpc3pLanVXQ0xDanBEYmc4bkZRVVVlMlg3cVZFbjdZc1VvNVlUanA4Qi85OFZpakxoZEJ5OE9JK25wNmNmOEpDeEY5RGp3clpReCtvVGJUYjFGUU9FUnZ3L3JTejIxZkJYNDNkT2pvNXp4dWhCeGh6UGhkUHEzZnBQNmNWUjd2Nk42ZXZmUTBJSjdRMTZoOE1OUzQreTU0SWZvU2VEdXpzbkp6UDV4LzNxaHdITnRQVDJ2K0VaWUJEOUVBN3dKM0w5bmFJaWtNYVd6aWFUVW1KK1VUalEzL0R4WVBwd3lwdGxSYmJuV3c0YkFYQkRWWDdUMjlaVzhzSmdQZnJWMEFkL2VGNHYxdnBOS0xaeHpmaHdQV05hamZoazBGL3dXbmNpcTN2SHcrZk9KNmNVdFBhZU5aWDNUcjNCelBwVGozc1NsVWNmcFRLdmVlVjExdGFlZElCWDVXWHQzOTNObHNHa1d5blZaNUd4UEtqWFdGZ3J0K3BqTFl5Q0J3MmQ2ZXI3enpNS25JaVdqYkRka0RCd1pTS2NiUDF0VHM2VkNGbXp3Q1ZSM2ZYcTRqS0ZkRVZ4M3YwUFJhREJZWGIxUzRVcXhyQlVDZFloRVZEV0NTQ1IvNTdNYVFLRlNJR2hBL2p3OHZPT2UrdnFQM2tWVVBTZVdOWlJMYWdxWXl2T2tKSjhHRW9qRVVZMmpPaVlpY1lXWUduTVJrZlB4Vk9yQ1RZT0Ryc0xDV2FLUHRyY0hKSm5jYk50MnU2cXVRMlF0cW8zQTFVQnRVZFlFSXBkUWpSY01FWkc0cXFZUWNkU1ljUUFSY2FZZ2VYaGk0cjRidytIaThrVVd5SDhFL3FLcU5TSmk1NFhYcUtvTklKWlZnNm90SXNGWkh6ajNlMFhoUStjeEJneXE2b0NJRElqSUdUSG1hS2FxNnAxdHg0N043SGpJb1dnMFdGVlQ4MVhnTG9YcnlaMHZEUUs5cUE2SVpRMWd6THRxMnhlc1RPYjlaREk1dFBPOTl6ek5TYmVGdy9VUFJxT3ZWNGcwWGZhcTJ3a0dkNVJ5Qi9SUU5Cb01oVUlOSmhDNFVoeG5KWmExUm8xcEZKRzFtcnN5c2hxWUJ0NUFaTjlZTXRraHg1dWIvNjJ3QmRXL3FjZy9URGI3MXJiVHAzMGZXMjl2M0xnYXkzb0xLRnd1bVZDUmE5dTZ1M3Y4cnFzWVI5ZXZyN2VXTE5rdUlsOUE5U3ZBMjVibXh1SzRXdFlGVy9VQzRYQzhISlczOXZVTmF1NHFkQll3WWxsM2xsc3dBT0Z3M0lJaHpWMGZpUU1SNmRxMGFWbldtTytLNnRlQmxyempPSzdRSjZwbmpXV2R4WEVHalcyZlM4ZmpsN3gyN2N2eGRsUFRmVUJGYTIvdkwzMlFCRUIzUzh2eXRERjFxbG92dHIxR2pHbFVrYlZBazhBV3pSMEhueFNSSnpVUWVIeVdJenV4ZWZNS2s4bHNWOHRxRTlYMWVVZTJGbGhSbEcwQ2VCOFluWEZrTUVyT215YXMzUGpCcUU1YUl0TUFxcG9FMGdBS0NWSE5hbUUrRmdsSTNoa0pMRVdrS2wrKzBoTEpIYjZyVmdFaGhUcUZPb0hsQW5VcVVvZHFIYk1qeXd1b25rVmtRRlJQS1hSYWdjRFJMVjFkRndzWlhFMVpSOXZicXdLSnhFcEhwQ0UvWFRVWWtXVVlVNHRJclpXYnVtcUFDaUFpSWxaZWJLVElvTnFpK3BibGY1V2N4NFhjWFp2QzBISUtCKytxbWdVbUVKa1dpQ21NaURFakJrWkVaRmhFaGgyUkVUdWRIcG1jbkl5NTZZbi9BOEZJUzIwNU9TS2VBQUFBQUVsRlRrU3VRbUNDJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICB2aWFwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICB3YXlwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IGZhbHNlIH0sXHJcbiAgICAgICAgYXV0b1VwZGF0ZU1hcFZpZXc6IHRydWUsXHJcbiAgICAgICAgZGlzcGxheVJvdXRlU2VsZWN0b3I6IGZhbHNlXHJcbiAgICAgICAgLy9pdGluZXJhcnlDb250YWluZXI6ICcjZGlyZWN0aW9uc0l0aW5lcmFyeSdcclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICAvL2Rpck1hbmFnZXIuc2hvd0lucHV0UGFuZWwoJ2RpcmVjdGlvbnNQYW5lbCcpO1xyXG5cclxuICAgICAgY29uc3Qgd2F5cG9pbnQxID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuV2F5cG9pbnQoe1xyXG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24obG9jYy5sYXRpdHVkZSwgbG9jYy5sb25naXR1ZGUpXHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICBjb25zdCB3YXlwb2ludDIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5XYXlwb2ludCh7XHJcbiAgICAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihlbmRMYXQsIGVuZExvbmcpLCBcclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIGRpck1hbmFnZXIuYWRkV2F5cG9pbnQod2F5cG9pbnQxKTtcclxuICAgICAgZGlyTWFuYWdlci5hZGRXYXlwb2ludCh3YXlwb2ludDIpO1xyXG5cclxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoZGlyTWFuYWdlciwgJ2RpcmVjdGlvbnNVcGRhdGVkJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvL3RoYXQucGF0aExheWVyLmNsZWFyKCk7IFxyXG4gICAgICB2YXIgYWxsV2F5UG9pbnRzID0gZGlyTWFuYWdlci5nZXRBbGxXYXlwb2ludHMoKTtcclxuICAgICAgXHJcbiAgICAgIHZhciBmcm9tQWRkcmVzcyA9IGFsbFdheVBvaW50c1swXS5nZXRBZGRyZXNzKCk7XHJcbiAgICAgIHZhciB0b0FkZHJlc3MgPSBhbGxXYXlQb2ludHNbMV0uZ2V0QWRkcmVzcygpO1xyXG4gICAgICBcclxuICAgICAgY29uc3Qgcm91dGVJbmRleCA9IGUucm91dGVbMF0ucm91dGVMZWdzWzBdLm9yaWdpbmFsUm91dGVJbmRleDtcclxuICAgICAgY29uc3QgbmV4dExvY2F0aW9uID0gZS5yb3V0ZVswXS5yb3V0ZVBhdGhbcm91dGVJbmRleCArIDFdO1xyXG5cclxuICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IHJvdXRlIGluZGV4LlxyXG4gICAgICBjb25zdCByb3V0ZUlkeCA9IGRpck1hbmFnZXIuZ2V0UmVxdWVzdE9wdGlvbnMoKS5yb3V0ZUluZGV4O1xyXG4gICAgICAvLyBHZXQgdGhlIGRpc3RhbmNlIG9mIHRoZSByb3V0ZSwgcm91bmRlZCB0byAyIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGgucm91bmQoZS5yb3V0ZVN1bW1hcnlbcm91dGVJZHhdLmRpc3RhbmNlICogMTAwKSAvIDEwMDtcclxuICAgICAgLy8gR2V0IHRoZSBkaXN0YW5jZSB1bml0cyB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcm91dGUuXHJcbiAgICAgIGNvbnN0IHVuaXRzID0gZGlyTWFuYWdlci5nZXRSZXF1ZXN0T3B0aW9ucygpLmRpc3RhbmNlVW5pdDtcclxuICAgICAgbGV0IGRpc3RhbmNlVW5pdHMgPSAnJztcclxuXHJcbiAgICAgIGlmICh1bml0cyA9PT0gTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5EaXN0YW5jZVVuaXQua20pIHtcclxuICAgICAgICBkaXN0YW5jZVVuaXRzID0gJ2ttJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBNdXN0IGJlIGluIG1pbGVzXHJcbiAgICAgICAgZGlzdGFuY2VVbml0cyA9ICdtaWxlcyc7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGNvbnNvbGUubG9nKCdsYXN0IFpvb20gTGV2ZWwnK21hcFpvb21MZXZlbCk7XHJcbiAgICAgIC8vIFRpbWUgaXMgaW4gc2Vjb25kcywgY29udmVydCB0byBtaW51dGVzIGFuZCByb3VuZCBvZmYuXHJcbiAgICAgIGNvbnN0IHRpbWUgPSBNYXRoLnJvdW5kKGUucm91dGVTdW1tYXJ5W3JvdXRlSWR4XS50aW1lV2l0aFRyYWZmaWMgLyA2MCk7XHJcbiAgICAgIGRpc3RhbmNlRGF0YSA9IFwiPGxhYmVsIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyBmb250LXNpemU6MjRweDsnPlwiKyBkaXN0YW5jZSArICcmbmJzcDsnICsgZGlzdGFuY2VVbml0cyArIFwiLCA8L2xhYmVsPlRyYWZmaWM6IFwiICsgdGltZSArIFwiIG1pbnV0ZXNcIjtcclxuICAgICAgLy8gLy8gaW5mb2JveC5zZXRNYXAobWFwKTsgIFxyXG4gICAgICAvLyBpbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAvLyAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihlbmRMYXQsIGVuZExvbmcpLFxyXG4gICAgICAvLyAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgLy8gICAgIG9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDAsIDQwKSxcclxuICAgICAgLy8gICAgIGh0bWxDb250ZW50Oic8ZGl2IHN0eWxlPVwibWFyZ2luOmF1dG8gIWltcG9ydGFudDt3aWR0aDo1NTBweCAhaW1wb3J0YW50O2JhY2tncm91bmQtY29sb3I6IHdoaXRlO2JvcmRlcjogMXB4IHNvbGlkIGxpZ2h0Z3JheTtcIj4nXHJcbiAgICAgIC8vICAgICArIGdldFRpY2tldEluZm9Cb3hIVE1MKGluZm9Cb3hNZXRhRGF0YSwgZGlzdGFuY2VEYXRhLCBmcm9tQWRkcmVzcywgdG9BZGRyZXNzKSArICc8L2Rpdj4nXHJcbiAgICAgIC8vICAgfSk7XHJcbiAgICAgICQoXCIubW9kYWwtY29udGVudFwiKS5odG1sKGdldFRpY2tldE1vZGFsSFRNTChpbmZvQm94TWV0YURhdGEsIGRpc3RhbmNlRGF0YSwgZnJvbUFkZHJlc3MsIHRvQWRkcmVzcykpO1xyXG4gICAgICBqUXVlcnkoXCIjdGlja2V0bW9kYWxcIikubW9kYWwoe1xyXG4gICAgICAgLy8gYmFja2Ryb3A6ICdzdGF0aWMnLFxyXG4gICAgICAgIGtleWJvYXJkOiBmYWxzZVxyXG4gICAgIH0pO1xyXG4gICAgICB2YXIgeGZsYWc6IG51bWJlcj0wO1xyXG4gICAgICAkKFwiI21vcmVGb3JtQ29udGVudEJ0blwiKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsZWQgY2xpY2snKTtcclxuICAgICAgICBpZih4ZmxhZyA9PSAwKSB7XHJcbiAgICAgICAgICAkKFwiI2luaXRGb3JtQ29udGVudFwiKS5oaWRlKCk7XHJcbiAgICAgICAgICAkKFwiI21vcmVGb3JtQ29udGVudFwiKS5zbGlkZVRvZ2dsZSggXCJzbG93XCIpO1xyXG4gICAgICAgICAgJChcIiNkdW1teWltYWdlXCIpLmF0dHIoXCJzcmNcIixcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQmdBQUFBWUNBWUFBQURnZHozNEFBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCQlpHOWlaU0JKYldGblpWSmxZV1I1Y2NsbFBBQUFBeUpwVkZoMFdFMU1PbU52YlM1aFpHOWlaUzU0YlhBQUFBQUFBRHcvZUhCaFkydGxkQ0JpWldkcGJqMGk3N3UvSWlCcFpEMGlWelZOTUUxd1EyVm9hVWg2Y21WVGVrNVVZM3ByWXpsa0lqOCtJRHg0T25odGNHMWxkR0VnZUcxc2JuTTZlRDBpWVdSdlltVTZibk02YldWMFlTOGlJSGc2ZUcxd2RHczlJa0ZrYjJKbElGaE5VQ0JEYjNKbElEVXVNQzFqTURZeElEWTBMakUwTURrME9Td2dNakF4TUM4eE1pOHdOeTB4TURvMU56b3dNU0FnSUNBZ0lDQWdJajRnUEhKa1pqcFNSRVlnZUcxc2JuTTZjbVJtUFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eE9UazVMekF5THpJeUxYSmtaaTF6ZVc1MFlYZ3Ribk1qSWo0Z1BISmtaanBFWlhOamNtbHdkR2x2YmlCeVpHWTZZV0p2ZFhROUlpSWdlRzFzYm5NNmVHMXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNoaGNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSU1pXWTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpWSmxaaU1pSUhodGNEcERjbVZoZEc5eVZHOXZiRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5UTlM0eElGZHBibVJ2ZDNNaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9UaEdPVFk1T1RKRVF6TkJNVEZGT0Rrd01qQTRNMFF4TWpFM00wWXlOVGtpSUhodGNFMU5Pa1J2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T1RoR09UWTVPVE5FUXpOQk1URkZPRGt3TWpBNE0wUXhNakUzTTBZeU5Ua2lQaUE4ZUcxd1RVMDZSR1Z5YVhabFpFWnliMjBnYzNSU1pXWTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG81T0VZNU5qazVNRVJETTBFeE1VVTRPVEF5TURnelJERXlNVGN6UmpJMU9TSWdjM1JTWldZNlpHOWpkVzFsYm5SSlJEMGllRzF3TG1ScFpEbzVPRVk1TmprNU1VUkRNMEV4TVVVNE9UQXlNRGd6UkRFeU1UY3pSakkxT1NJdlBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1B2M1JId2dBQUFGN1NVUkJWSGphdkpaQlp3TkJGTWNuRmMwbktHRW9PWVdsaEh5SnNDdzk1V1BzS1pSOGtpSFhzUFRRUzNwcEpkK2dsRkpLTGlVOTlkTHFLWVRwbS9vUHo1amRuVW1uZmZ5V25aMzUvM2ZlN016YmptZ09TVndTT1hGR2pORCtTTHdUdDhTTjF2cE5SRWFmVU1TQjBDMGMwTGRQUnNMRkZ4UGlpd2xVeEpRWUUxMHdSbHZGK3BreGt6YURrZzI0SnJLQTJXYm9hOGVWZFFZRlM4azhOSmRNYU01U1ZyZ0daakUvMEVIRkxKYnp0Z29hUmt0eUE4WHlMWTQxZ0tCZEYyVU56bGxxc2dRR0dVdVYwUlpYYUZpS0k2TG0wMXhDMDJpTE5XNXlrU0Jna0VQenpuelRRN1k3ZVZ3UXB4SGFuOFRXMGZwSitSNXVQV2ZBYThBdTVxellESHBvMjNjYjN1Z0o1MDFvYk9zZTdPQW1FNjZCaE9idWhDNHZlRFpLOFJVNVdzL0c0QjQzVTVFdXJOYkdYQVovdU5FRy8zSlUyRVd4TldEMmk4TnV4bXFEOUIzWE90YkVJNjU5eDdXdjRGUnNsemZGMEtsc1pWdkpMQnBLcG8yNmtsbUUxR1M3Sm91SW9yK3dPWGZwUlA2MjJGazhoUDYyZkFzd0FKZWVaYUFuV1N1ZkFBQUFBRWxGVGtTdVFtQ0NcIik7XHJcbiAgICAgICAgICAgIHhmbGFnID0gMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYoeGZsYWcgPT0gMSkge1xyXG4gICAgICAgICAgICAkKFwiI21vcmVGb3JtQ29udGVudFwiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICQoXCIjaW5pdEZvcm1Db250ZW50XCIpLnNsaWRlVG9nZ2xlKCBcInNsb3dcIik7XHJcbiAgICAgICAgICAgICQoXCIjZHVtbXlpbWFnZVwiKS5hdHRyKFwic3JjXCIsXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJnQUFBQVlDQVlBQUFEZ2R6MzRBQUFBR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBQXlKcFZGaDBXRTFNT21OdmJTNWhaRzlpWlM1NGJYQUFBQUFBQUR3L2VIQmhZMnRsZENCaVpXZHBiajBpNzd1L0lpQnBaRDBpVnpWTk1FMXdRMlZvYVVoNmNtVlRlazVVWTNwcll6bGtJajgrSUR4NE9uaHRjRzFsZEdFZ2VHMXNibk02ZUQwaVlXUnZZbVU2Ym5NNmJXVjBZUzhpSUhnNmVHMXdkR3M5SWtGa2IySmxJRmhOVUNCRGIzSmxJRFV1TUMxak1EWXhJRFkwTGpFME1EazBPU3dnTWpBeE1DOHhNaTh3TnkweE1EbzFOem93TVNBZ0lDQWdJQ0FnSWo0Z1BISmtaanBTUkVZZ2VHMXNibk02Y21SbVBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHhPVGs1THpBeUx6SXlMWEprWmkxemVXNTBZWGd0Ym5NaklqNGdQSEprWmpwRVpYTmpjbWx3ZEdsdmJpQnlaR1k2WVdKdmRYUTlJaUlnZUcxc2JuTTZlRzF3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzaGhjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUlNaV1k5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVkpsWmlNaUlIaHRjRHBEY21WaGRHOXlWRzl2YkQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVOVE5TNHhJRmRwYm1SdmQzTWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVEkwUmpWRk5qWkVRek5CTVRGRk9FRkVNVEk0UVVNek9ETkRSRVJHUWtNaUlIaHRjRTFOT2tSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9USTBSalZGTmpkRVF6TkJNVEZGT0VGRU1USTRRVU16T0RORFJFUkdRa01pUGlBOGVHMXdUVTA2UkdWeWFYWmxaRVp5YjIwZ2MzUlNaV1k2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNU1qUkdOVVUyTkVSRE0wRXhNVVU0UVVReE1qaEJRek00TTBORVJFWkNReUlnYzNSU1pXWTZaRzlqZFcxbGJuUkpSRDBpZUcxd0xtUnBaRG81TWpSR05VVTJOVVJETTBFeE1VVTRRVVF4TWpoQlF6TTRNME5FUkVaQ1F5SXZQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QbGhPc3VZQUFBR3hTVVJCVkhqYXRKYkJTc05BRUlZVExmb0VoVUlnMEZNaElCUjY5U1FJQlNIZ3FkQUhFRHpsNUtuZ1l3aUI5bG9DSHJ6b1NmQU5CRUVJQ0lXaTFKTVh4Vk9oRVArVkdSalhUYktKY2VCTDAyVDMvN096MloyNFRuRjQ0QmdjZ1RibzAvVUg4QVp1d0ZXV1phOU94ZWlBR0d4QVZzS0cyblpnNU9pWVlnZytoVUFDUm1BQVdzU0FyaVdpbmVvekxET0lSSWRMRUZpTU5xQzIzQy9LTXdoRlNpYTJ1UlJDRTVHeVVEZFFrL2xPRGVJQ3ZYMXdJa2VtUFcxTUdrckxrd2F4eUhkUlhGQzdVNU1CQ2ZLOHhHemdpOVFFRFJnRUlsWCtGZzVqc0EzbUlIWCtHREJKU1V0cGpwWEJJZDJiMXhGMFhmY0htdGFCZXFkN1luWEsyQU03MnJVMi9mcTBGbVI4Z0lXbTlaM3lOZVZzVit2d2JMR0tKZGM4SjZTbFR0YXRndEUvMG40anc2ZFJ2Qmp1TGZLRVZ1VG1XYVQ4MTF0a1duaWtwVTVXYXBLZjZGNi81bHRqMm50WUsxVUd0L1JuNURRWHJIV25EdDEvWEdoZE5ZSWxtRkg3OHdhZW5qVm1NRnpLelk1cndGbmRPYUMrWEJzODAzYWRWVFV4aUdlbTdkcFVjQkt4eW91aXAxVzJxS3hraGdVbGt5T3ZaSVkyTlpublpGcWg2RTg1NXpwdXhjOFdIc1c5N1dmTGx3QURBRWVEVXEyRFZZOE1BQUFBQUVsRlRrU3VRbUNDXCIpO1xyXG4gICAgICAgICAgICB4ZmxhZyA9IDA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKFwiLmNsb3NlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZGlyTWFuYWdlci5jbGVhckFsbCgpO1xyXG4gICAgICAgIG1hcC5sYXllcnMuY2xlYXIoKTtcclxuICAgICAgICBtYXAuc2V0Vmlldyh7Y2VudGVyOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZW5kTGF0LCBlbmRMb25nKSwgbWFwWm9vbUxldmVsfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKFwiI3RpY2tldG1vZGFsXCIpLm9uKFwiaGlkZGVuLmJzLm1vZGFsXCIsZnVuY3Rpb24oKXtcclxuICAgICAgICBkaXJNYW5hZ2VyLmNsZWFyQWxsKCk7XHJcbiAgICAgICAgbWFwLmxheWVycy5jbGVhcigpO1xyXG4gICAgICAgIG1hcC5zZXRWaWV3KHtjZW50ZXI6IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihlbmRMYXQsIGVuZExvbmcpLCBtYXBab29tTGV2ZWx9KTtcclxuICAgICAgfSk7XHJcbiAgICAgICQoXCIjdGt0SWRcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgICBwaW5DbGlja2VkKGluZm9Cb3hNZXRhRGF0YSwgMSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgZGlyTWFuYWdlci5jYWxjdWxhdGVEaXJlY3Rpb25zKCk7XHJcbiAgICAgIFxyXG4gICAgfSk7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgZnVuY3Rpb24gZ2V0VGlja2V0TW9kYWxIVE1MKGRhdGE6IGFueSwgZGlzdGFuY2REYXRhOiBhbnksIGZyb21BZGRyZXNzOiBhbnksIHRvQWRkcmVzczogYW55KTpTdHJpbmd7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgdmFyIHdvcmtTZXZlcml0eUNvbG9yOiBhbnkgPSBcIiNjZjJhMmFcIjtcclxuICAgICAgICBpZihkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkgPT09IFwibWFqb3JcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICB3b3JrU2V2ZXJpdHlDb2xvciA9IFwiIzAwOWZkYlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJtaW5vclwiIHx8IGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJ3YXJuaW5nXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcInVua25vd25cIil7XHJcbiAgICAgICAgICB3b3JrU2V2ZXJpdHlDb2xvciA9IFwiIzE5MTkxOVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZGlhbG9nRGF0YSA9IFwiPGRpdiBzdHlsZT0nZGlzcGxheTogZmxleDsgcGFkZGluZzo1cHg7anVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0Oyc+XCJcclxuICAgICAgICArXCI8aDUgaWQ9J3RrdElkJz48YSBocmVmPSdqYXZhc2NyaXB0OnZvaWQoMCk7JyBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IGNvbG9yOiMwMDA7IGZvbnQtc2l6ZToxNXB4Oyc+XCIrIGRhdGEudGlja2V0TnVtYmVyICtcIjwvYT48L2g1PlwiXHJcbiAgICAgICAgK1wiPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzPSdjbG9zZScgZGF0YS1kaXNtaXNzPSdtb2RhbCcgdGl0bGU9J0Nsb3NlJz4mdGltZXM7PC9idXR0b24+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgIHN0eWxlPSdtYXgtaGVpZ2h0OjM5MHB4OyBvdmVyZmxvdy15OmF1dG87IG92ZXJmbG93LXg6aGlkZGVuOyBmb250LXNpemU6MTRweDsgcGFkZGluZzo1cHg7IHdpZHRoOjM3MHB4Oyc+XCJcdFx0XHRcdC8vY2xhc3M9J21vZGFsLWJvZHknXHRcclxuXHRcdFx0XHQrXCI8Zm9ybSBjbGFzcz0ndGt0Rm9ybSc+XCJcclxuICAgICAgICArXCI8ZGl2IGlkPSdpbml0Rm9ybUNvbnRlbnQnIHN0eWxlPSdkaXNwbGF5OiBibG9jazsnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjEzMHB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlNldmVyaXR5OjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjQwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJyBzdHlsZT1jb2xvcjpcIit3b3JrU2V2ZXJpdHlDb2xvcitcIj5cIisgZGF0YS50aWNrZXRTZXZlcml0eSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxMzBweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5Db21tb24gSUQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyNDBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrZGF0YS5jb21tb25JRCtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjEzMHB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkFmZmVjdGluZzo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjI0MHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5jdXN0QWZmZWN0aW5nICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjEzMHB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlNob3J0IERlc2NyaXB0OjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjQwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5zaG9ydERlc2NyaXB0aW9uICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tMScgc3R5bGU9J3dpZHRoOjMwcHg7Jz5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTEwJyBzdHlsZT0nYm9yZGVyLXRvcDoxcHggc29saWQgI2RiZGJkYjsnPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEnIHN0eWxlPSd3aWR0aDozMHB4Oyc+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tMTInIHN0eWxlPSd3aWR0aDozNTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkaXN0YW5jZERhdGEgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEnIHN0eWxlPSd3aWR0aDozMHB4Oyc+XCJcclxuICAgICAgICArXCI8aW1nIHNyYz0nZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCc0FBQUFZQ0FZQUFBQUxRSWI3QUFBQUFYTlNSMElBcnM0YzZRQUFBQVJuUVUxQkFBQ3hqd3Y4WVFVQUFBQUpjRWhaY3dBQURzTUFBQTdEQWNkdnFHUUFBQU5SU1VSQlZFaEx2WlZMU0ZSUkdNZU5pcUsydFl3V3RXL1JwcWlnQ0NKQ2lCWkZVRm5MYUZFdGFwRVNHQmlWUlJTQ0NHVXZOVzFzTE5OU2sxNHF2U3dkSDQyUGVUdVBhL04rT0MvdnpQejczeGl0Tzk0Wnh3aC9jT0J5N2ozM2Y4NzNQOS8zRldBUldaRFlkQ3lCY0VURVZIZ2FTQ1RUcy9renI1ZzlFTWRIV3hqVldqOUtlMTI0K01XSmtzOU9YTzV6NC81WUFOOGNZUVM0Z1h6SUtwYmlNSHBqdU5QclJGR3pCUnRyRFZqNlVJOVZOUWFzNWxqeVFJKzFOWHFjZWprQnRkWUxpeitPbExRb0IxbkZta2Y5T1BqTWpDMzFCbHpyRWZCYUY4Q1FLd1o3V01UUGFJTFBVVHdaOHVKc214VnJIdWx4b01NTzNXUWt2Vm9aUmJGbkZEcjUwb3FpRnhaVUQzb3h5aDlINkZjbWZncjNNWXlYR05hZFBQMitOaHZHK0cwcXFYeEV1UmkvTVRGMGg3bndHSVdlL3ZCQkZPZS9DQkdLbHRITERmVkdYUHYwRXhNTXFSSXlNU0VZeDExNnRJMmhxOUo0a0JEbk1lRXZiTDRZS2lpMGlUNCsxd2ZUczNKa1lyMk9DSTQrdDZEMG5RTURRdTc0SzZHaFo1dnJEQ2lucU4wMzkzUXlzU1pqQ091NXM0Wmg3MjgvRm9xYktYQ20wNDZMYngzb01zMDluVXlzVXV2amxkYWh4eDZtZi9tSGNJYXBlQkwxR2pkS0tLZ2E5cVZuL3pBckZvbUt1UExkaFpXOHh2b2dLOFEvRUo1T29wVTVkNkhUaHRwQlQzcjJEN05pSW5kMW85K0RGVXpjQVhjc1Bic3dwSk0xRFhsd3ZzT0tSd001eENTcVJ2eFljbThjbmVZUVVubGMrVXlDek1XYlBaTW9mbTFESzNNMUU1bFl5OFFVMXZFMjNmcnFoRDFMcnVSaUlqQ04vYnpOWlYwQ2ZnajBQUU9abUpUUTVkMENDaHROYU1tU0s5a1E2VmU3TVlobHZHQzNXWFdTQ3BHUmlZbUpGRFFzUDlzYmpEak5VR2o1bkM5dEZOclhaTVloVnA2dldkYkp4Q1JDTlBrS2szS1gyb1FqSFRiME1RMlVkamxEbEQ0MXMwZ2ZlMlhGYm02eWZjeVBrRUlkbFpnakppR3c5Sng0TDJEOVl3UE9TMlliZ2hoblJmQXcwUU9zK0g0T0Y1OUhQVEdvUm53b1pIZllvektpZ2w3SGNteE1VVXpDdzI2c1pwTHZWWm13L0w0T1c5Vm1YS2Z4ZGYxdVBQam1RdkViQjNid1hRSGZIV2ViZWE4UElFNGJjcFdDckdJU1FaNmdseld5a2dsNjllTWt5bGd6ejdWYmZ5ZHRLVXZTRFlhN1psenFjMnhCRFA5ODVCU2JJVVlQalB6aEI5YTdScllkcWJGMm00TXdlNkxwTC9Jakw3SC94U0tLQWI4QTlNS1hBT2dFNDJnQUFBQUFTVVZPUks1Q1lJST0nIC8+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlx0XHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS0xMCcgc3R5bGU9J2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkYmRiZGI7IHdpZHRoOjMwMHB4Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZnJvbUFkZHJlc3MgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS0xJyBzdHlsZT0nd2lkdGg6MzBweDsnPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS0xJyBzdHlsZT0nd2lkdGg6MzBweDsnPlwiXHJcbiAgICAgICAgK1wiPGltZyBzcmM9J2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQmtBQUFBYUNBWUFBQUJDZmZmTkFBQUFBWE5TUjBJQXJzNGM2UUFBQUFSblFVMUJBQUN4and2OFlRVUFBQUFKY0VoWmN3QUFEc01BQUE3REFjZHZxR1FBQUFOZlNVUkJWRWhMelpYZFMxTnhHTWY3ZXlMcndneU1iZ0loVWV2Q2lLQzZ6UWdVUmZSQ3c3QVhLbnFqRW91SVVDenFJbEFVTXdqQmhDNHFyTDIyOXY3VzNNN2NkSnViTzNzNTI3Zm45enVuVTN2ZnVwQStNRGFlMzludmUzNi81L3M4eng3c0F2K0hTRjZTa0V1bElPM3NRRW9rSU1Yai9IY3VuVVkrbDFPZXFrNVZrVHg5RWs0bmhQbDV1Ty9maCt2R0RUaXZYWVAzeVJPRWxwZVJYRitYSDZ4QldSRzIrYlpXQy9mWUdDd1hMc0RTM3cvSDlldHdQM29FMTcxN3NJMlB3OXpiQzh1NWMvQk5UQ0Joc2NoL3JFQ0pTQzZiUldSMUZjN1JVUmlPSDRlMXB3Yy9hZlBRKy9lSWZ2Mkt5SmN2Q0xLVDNid0o4OG1UTUo0NkJUY0pjNkU4ZTcxU0NrVHlKQkQ5OWczbXMyZWhPM0lFNjY5ZUlST0pLS3VsaUg0L1hGZXZ3a0JpdHBFUnBBUkJXU21rUUVUMGVHRHE2b0xwekJrSXM3TTh3ZFZnaWM5dWI4TS9QUTE5ZHpkY3QyL3pQWXBSUlRMUktJSnYzMExmM2c3ZjVDU3lOUVQrSnVsMncwTlhwajk2Rk9IRlJTWDZCMVVrWVRUQ09qZ0lHeVU3YmpBbzBmcUo2L1hRdGJieS9LVTJOcFNvakNxeVJXK2cyYnNYUWJxbVRDeW1ST3NuRXc3RE9qd01CeGtpOHZtekVwWGhJc3dUd1Jjdm9ObTNEekZ5VDNtUFZJY1ZxVzltaHQ5RWNHNU9pY3B3a1d3eUNmL1RwOUFlT0FEUjRlQUxqU0xSSGh2djNzRisrVEtFMTYrVnFBd1hrYWh0Qko0OWczYi9mb2gyTzE5b0ZPWkVZV0VCZGlwVTRjMGJKU3FqNWlSTXVkQTBOV0ZyWlFVUzlhVkd5Wkk3UFE4ZndrWW5DUzB0S1ZFWlZTVDY0UU4weDQ3QlN5Y1NmVDRsV2ovcFFJRFhsL3Z1WGNTTDJvd3FrcVJjT0trQm1rNmZ4bWJSbTlSQ0VrV0VLQi9hdzRjaHZIekpyLzl2VkJGMlJkRzFOZWpwUWZlbFMwaVdxZHhLUkQ1K2hHVmdnTDlnN05Nbkpmb0hWWVNSSTRldzQrbzdPbUNuenB2ZTNGUldLaE9qSXJiMTlVRjM2QkEycWJFeWx4VlRJTUlRYVVhNGJ0MkN0cTBOWnVwSGZxcWZ1TTJHSEEydjMyVElTZHNtRS94VUY5OVBuTUFQT2dHekxldGo1U2dSWWNScGc1OFBIc0JNaWZ4eDhTSWMxUFo5ZCs0ZytQdzVBbzhmdzBPenhUNDBCQXQ5ck9mUFE1aWFRb2FtWmlYS2lqQlkxY2VvaHptdlhJR3hzeFA2Z3dlaGEyNkdycVdGZjVzb3hpWmtnZ3hUcTBOVUZHSHcrVTdPWVRVZ2VyMklhVFM4ZWFiSTRqazI1OGxGOWN6NXFpTEZzS25KaEJ1bElaRi9aUmRFZ0Y4MzJuNHNodjdNb1FBQUFBQkpSVTVFcmtKZ2dnPT0nIC8+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlx0XHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTEwJyBzdHlsZT0nd2lkdGg6MzAwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgdG9BZGRyZXNzICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tMScgc3R5bGU9J3dpZHRoOjMwcHg7Jz5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCI8L2Rpdj5cIlx0XHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdC8vZW5kIGluaXRmb3JtXHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxkaXYgaWQ9J21vcmVGb3JtQ29udGVudCcgc3R5bGU9J2Rpc3BsYXk6IG5vbmU7Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkVudHJ5IFR5cGU6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuZW50cnlUeXBlICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlN0YXR1czo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS50aWNrZXRTdGF0dXMgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+Q3VzdG9tZXIgQWZmZWN0aW5nOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5jdXN0QWZmZWN0aW5nICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkFzc2lnbmVlOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5hc3NpZ25lZFRvICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkNvbW1vbiBJRDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIgKyBkYXRhLmNvbW1vbklEICsgXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5FcXVpcG1lbnQgSUQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmVxdWlwbWVudElEICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkVxdWlwbWVudCBOYW1lOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiICsgZGF0YS5lcXVpcG1lbnROYW1lICsgXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5QYXJlbnQgSUQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEucGFyZW50SUQgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+UGFyZW50IE5hbWU6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEucGFyZW50TmFtZSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5Qcm9ibGVtIENhdGVnb3J5OjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5wcm9ibGVtQ2F0ZWdvcnkgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+UHJvYmxlbSBTdWIgQ2F0ZWdvcnk6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEucHJvYmxlbVN1YmNhdGVnb3J5ICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlByb2JsZW0gRGV0YWlsOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5wcm9ibGVtRGV0YWlsICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlNob3J0IERlc2NyaXB0OjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnNob3J0RGVzY3JpcHRpb24gK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+TG9jYXRpb24gUmFua2luZzo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEubG9jYXRpb25SYW5raW5nICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcblx0XHRcdFx0K1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlBsYW5uZWQgUmVzdG9yYWwgVGltZTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnBsYW5uZWRSZXN0b3JhbFRpbWUgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+QWx0ZXJuYXRlIFNpdGUgSUQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5hbHRlcm5hdGVTaXRlSUQgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+V29yayBSZXF1ZXN0IElEOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLndvcmtSZXF1ZXN0SWQgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+QWN0aXZpdHkgQWN0aW9uOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmFjdGlvbiArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcdFx0XHJcbiAgICAgICAgK1wiPC9mb3JtPlwiXHJcblx0XHRcdFx0K1wiPC9kaXY+XCJcclxuXHRcdFx0XHQrXCI8ZGl2IHN0eWxlPSdkaXNwbGF5OiBmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kOyBwYWRkaW5nLXJpZ2h0OiA1cHg7IHBhZGRpbmctYm90dG9tOiA1cHg7Jz5cIlxyXG4gICAgICAgICtcIjxidXR0b24gaWQ9J21vcmVGb3JtQ29udGVudEJ0bicgc3R5bGU9J2JhY2tncm91bmQ6dHJhbnNwYXJlbnQ7Ym9yZGVyOjA7Y3Vyc29yOnBvaW50ZXI7Jz4gPGltZyBpZD0nZHVtbXlpbWFnZScgIHNyYz0nZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCZ0FBQUFZQ0FZQUFBRGdkejM0QUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUF5SnBWRmgwV0UxTU9tTnZiUzVoWkc5aVpTNTRiWEFBQUFBQUFEdy9lSEJoWTJ0bGRDQmlaV2RwYmowaTc3dS9JaUJwWkQwaVZ6Vk5NRTF3UTJWb2FVaDZjbVZUZWs1VVkzcHJZemxrSWo4K0lEeDRPbmh0Y0cxbGRHRWdlRzFzYm5NNmVEMGlZV1J2WW1VNmJuTTZiV1YwWVM4aUlIZzZlRzF3ZEdzOUlrRmtiMkpsSUZoTlVDQkRiM0psSURVdU1DMWpNRFl4SURZMExqRTBNRGswT1N3Z01qQXhNQzh4TWk4d055MHhNRG8xTnpvd01TQWdJQ0FnSUNBZ0lqNGdQSEprWmpwU1JFWWdlRzFzYm5NNmNtUm1QU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh4T1RrNUx6QXlMekl5TFhKa1ppMXplVzUwWVhndGJuTWpJajRnUEhKa1pqcEVaWE5qY21sd2RHbHZiaUJ5WkdZNllXSnZkWFE5SWlJZ2VHMXNibk02ZUcxd1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JTWldZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlZKbFppTWlJSGh0Y0RwRGNtVmhkRzl5Vkc5dmJEMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTlROUzR4SUZkcGJtUnZkM01pSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RJMFJqVkZOalpFUXpOQk1URkZPRUZFTVRJNFFVTXpPRE5EUkVSR1FrTWlJSGh0Y0UxTk9rUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPVEkwUmpWRk5qZEVRek5CTVRGRk9FRkVNVEk0UVVNek9ETkRSRVJHUWtNaVBpQThlRzF3VFUwNlJHVnlhWFpsWkVaeWIyMGdjM1JTWldZNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzVNalJHTlVVMk5FUkRNMEV4TVVVNFFVUXhNamhCUXpNNE0wTkVSRVpDUXlJZ2MzUlNaV1k2Wkc5amRXMWxiblJKUkQwaWVHMXdMbVJwWkRvNU1qUkdOVVUyTlVSRE0wRXhNVVU0UVVReE1qaEJRek00TTBORVJFWkNReUl2UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUGxoT3N1WUFBQUd4U1VSQlZIamF0SmJCU3NOQUVJWVRMZm9FaFVJZzBGTWhJQlI2OVNRSUJTSGdxZEFIRUR6bDVLbmdZd2lCOWxvQ0hyem9TZkFOQkVFSUNJV2kxSk1YeFZPaEVQK1ZHUmpYVGJLSmNlQkwwMlQzLzdPejJaMjRUbkY0NEJnY2dUYm8wL1VIOEFadXdGV1daYTlPeGVpQUdHeEFWc0tHMm5aZzVPaVlZZ2craFVBQ1JtQUFXc1NBcmlXaW5lb3pMRE9JUklkTEVGaU1OcUMyM0MvS013aEZTaWEydVJSQ0U1R3lVRGRRay9sT0RlSUN2WDF3SWtlbVBXMU1Ha3JMa3dheHlIZFJYRkM3VTVNQkNmSzh4R3pnaTlRRURSZ0VJbFgrRmc1anNBM21JSFgrR0RCSlNVdHBqcFhCSWQyYjF4RjBYZmNIbXRhQmVxZDdZblhLMkFNNzJyVTIvZnEwRm1SOGdJV205WjN5TmVWc1YrdndiTEdLSmRjOEo2U2xUdGF0Z3RFLzBuNGp3NmRSdkJqdUxmS0VWdVRtV2FUODExdGtXbmlrcFU1V2FwS2Y2RjYvNWx0ajJudFlLMVVHdC9SbjVEUVhySFduRHQxL1hHaGROWUlsbUZINzh3YWVualZtTUZ6S3pZNXJ3Rm5kT2FDK1hCczgwM2FkVlRVeGlHZW03ZHBVY0JLeHlvdWlwMVcycUt4a2hnVWxreU92WklZMk5abm5aRnFoNkU4NTV6cHV4YzhXSHNXOTdXZkxsd0FEQUVlRFVxMkRWWThNQUFBQUFFbEZUa1N1UW1DQycvPiA8L2J1dHRvbj5cIlxyXG5cdFx0XHRcdCtcIjwvZGl2PlwiXHJcbiAgICAgIHJldHVybiBkaWFsb2dEYXRhO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFRpY2tldEluZm9Cb3hIVE1MKGRhdGE6IGFueSwgZGlzdGFuY2REYXRhOiBhbnksIGZyb21BZGRyZXNzOiBhbnksIHRvQWRkcmVzczogYW55KTpTdHJpbmd7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIHZhciBpbmZvYm94RGF0YSA9IFwiPGRpdiBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDsnPjxkaXYgc3R5bGU9J3Bvc2l0aW9uOiByZWxhdGl2ZTt3aWR0aDoxMDAlOyc+XCJcclxuICAgICAgICArXCI8ZGl2PjxhIGhyZWY9J2phdmFzY3JpcHQ6dm9pZCgwKScgc3R5bGU9J3RleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lJz5cIitkYXRhLnRpY2tldE51bWJlcitcIiA8L2E+IDxpIGNsYXNzPSdmYSBmYS10aW1lcycgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+PC9pPjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiAgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTQnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweCcgPjxzcGFuPlNldmVyaXR5Ojwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSdjb2wtbWQtOCcgc3R5bGU9J2NvbG9yOnJlZDsnPlwiK2RhdGEudGlja2V0U2V2ZXJpdHkrXCI8L2Rpdj5cIiBcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTQnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweCcgPjxzcGFuPkNvbW1vbiBJRDo8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0nY29sLW1kLTgnPlwiK2RhdGEuY29tbW9uSUQrXCI8L2Rpdj5cIiBcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTQnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweCcgPjxzcGFuPkFmZmVjdGluZzo8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0nY29sLW1kLTgnPlwiK2RhdGEuY3VzdEFmZmVjdGluZytcIjwvZGl2PlwiIFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+U2hvcnREZXNjcmlwdDo8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0nY29sLW1kLTgnPlwiK2RhdGEuc2hvcnREZXNjcmlwdGlvbitcIjwvZGl2PlwiIFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtMTInIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweCcgPjxociAvPjwvZGl2PlwiXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtMTEnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweCcgPjxzcGFuPlwiKyBkaXN0YW5jZURhdGEgICtcIjwvc3Bhbj48L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTExJyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5cIisgZnJvbUFkZHJlc3MgICtcIjwvc3Bhbj48L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTExJyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5cIisgdG9BZGRyZXNzICArXCI8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICByZXR1cm4gaW5mb2JveERhdGE7XHJcbiAgICAgICAgfVxyXG59XHJcblxyXG4gIFVwZGF0ZVRpY2tldEpTT05EYXRhTGlzdCgpXHJcbiAge1xyXG4gICAgaWYodGhpcy50aWNrZXRMaXN0Lmxlbmd0aCAhPTApXHJcbiAgICB7XHJcbiAgICB0aGlzLnRpY2tldExpc3QuVGlja2V0SW5mb0xpc3QuVGlja2V0SW5mby5mb3JFYWNoKHRpY2tldEluZm8gPT4ge1xyXG4gICAgICB2YXIgdGlja2V0OiBUaWNrZXQgPSBuZXcgVGlja2V0KCk7O1xyXG4gICAgICB0aWNrZXRJbmZvLkZpZWxkVHVwbGVMaXN0LkZpZWxkVHVwbGUuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICBpZihlbGVtZW50Lk5hbWUgPT09IFwiVGlja2V0TnVtYmVyXCIpe1xyXG4gICAgICAgICAgICB0aWNrZXQudGlja2V0TnVtYmVyID0gZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiRW50cnlUeXBlXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmVudHJ5VHlwZSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkNyZWF0ZURhdGVcIil7XHJcbiAgICAgICAgICB0aWNrZXQuY3JlYXRlRGF0ZSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkVxdWlwbWVudElEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmVxdWlwbWVudElEID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQ29tbW9uSURcIil7XHJcbiAgICAgICAgICB0aWNrZXQuY29tbW9uSUQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQYXJlbnRJRFwiKXtcclxuICAgICAgICAgIHRpY2tldC5wYXJlbnRJRCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkN1c3RBZmZlY3RpbmdcIil7XHJcbiAgICAgICAgICB0aWNrZXQuY3VzdEFmZmVjdGluZyA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlRpY2tldFNldmVyaXR5XCIpe1xyXG4gICAgICAgICAgdGlja2V0LnRpY2tldFNldmVyaXR5ID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQXNzaWduZWRUb1wiKXtcclxuICAgICAgICAgIHRpY2tldC5hc3NpZ25lZFRvID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiU3VibWl0dGVkQnlcIil7XHJcbiAgICAgICAgICB0aWNrZXQuc3VibWl0dGVkQnkgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQcm9ibGVtU3ViY2F0ZWdvcnlcIil7XHJcbiAgICAgICAgICB0aWNrZXQucHJvYmxlbVN1YmNhdGVnb3J5ID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUHJvYmxlbURldGFpbFwiKXtcclxuICAgICAgICAgIHRpY2tldC5wcm9ibGVtRGV0YWlsID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUHJvYmxlbUNhdGVnb3J5XCIpe1xyXG4gICAgICAgICAgdGlja2V0LnByb2JsZW1DYXRlZ29yeSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkxhdGl0dWRlXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmxhdGl0dWRlID0gKGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBlbGVtZW50LlZhbHVlID09PSAnJykgID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTG9uZ2l0dWRlXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmxvbmdpdHVkZSA9ICAoZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGVsZW1lbnQuVmFsdWUgPT09ICcnKSA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlBsYW5uZWRSZXN0b3JhbFRpbWVcIil7XHJcbiAgICAgICAgICB0aWNrZXQucGxhbm5lZFJlc3RvcmFsVGltZSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFsdGVybmF0ZVNpdGVJRFwiKXtcclxuICAgICAgICAgIHRpY2tldC5hbHRlcm5hdGVTaXRlSUQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMb2NhdGlvblJhbmtpbmdcIil7XHJcbiAgICAgICAgICB0aWNrZXQubG9jYXRpb25SYW5raW5nID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQXNzaWduZWREZXBhcnRtZW50XCIpe1xyXG4gICAgICAgICAgdGlja2V0LmFzc2lnbmVkRGVwYXJ0bWVudCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlJlZ2lvblwiKXtcclxuICAgICAgICAgIHRpY2tldC5yZWdpb24gPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJNYXJrZXRcIil7XHJcbiAgICAgICAgICB0aWNrZXQubWFya2V0ID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiV29ya1JlcXVlc3RJZFwiKXtcclxuICAgICAgICAgIHRpY2tldC53b3JrUmVxdWVzdElkID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiU2hpZnRMb2dcIil7XHJcbiAgICAgICAgICB0aWNrZXQuc2hpZnRMb2cgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBY3Rpb25cIil7XHJcbiAgICAgICAgICB0aWNrZXQuYWN0aW9uID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiRXF1aXBtZW50TmFtZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5lcXVpcG1lbnROYW1lID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiU2hvcnREZXNjcmlwdGlvblwiKXtcclxuICAgICAgICAgIHRpY2tldC5zaG9ydERlc2NyaXB0aW9uID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUGFyZW50TmFtZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5wYXJlbnROYW1lID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiVGlja2V0U3RhdHVzXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnRpY2tldFN0YXR1cyA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkxvY2F0aW9uSURcIil7XHJcbiAgICAgICAgICB0aWNrZXQubG9jYXRpb25JRCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIk9wc0Rpc3RyaWN0XCIpe1xyXG4gICAgICAgICAgdGlja2V0Lm9wc0Rpc3RyaWN0ID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiT3BzWm9uZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5vcHNab25lID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLnRpY2tldERhdGEucHVzaCh0aWNrZXQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5jb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUnR0YW1hcGxpYkNvbXBvbmVudCB9IGZyb20gJy4vcnR0YW1hcGxpYi5jb21wb25lbnQnO1xuaW1wb3J0IHsgUnR0YW1hcGxpYlNlcnZpY2UgfSBmcm9tIFwiLi9ydHRhbWFwbGliLnNlcnZpY2VcIlxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1J0dGFtYXBsaWJDb21wb25lbnRdLFxuICBleHBvcnRzOiBbUnR0YW1hcGxpYkNvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW1J0dGFtYXBsaWJTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBSdHRhbWFwbGliTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbIkhlYWRlcnMiLCJSZXF1ZXN0T3B0aW9ucyIsIk9ic2VydmFibGUiLCJpby5jb25uZWN0IiwiSW5qZWN0YWJsZSIsIkh0dHAiLCJFdmVudEVtaXR0ZXIiLCJzZXRUaW1lb3V0IiwiZm9ya0pvaW4iLCJtb21lbnR0aW1lem9uZS51dGMiLCJtYXAiLCJDb21wb25lbnQiLCJWaWV3Q29udGFpbmVyUmVmIiwiVmlld0NoaWxkIiwiSW5wdXQiLCJPdXRwdXQiLCJOZ01vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO1FBb0JFLDJCQUFvQixJQUFVO1lBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTs0QkFObkIsS0FBSzsyQkFDTixJQUFJO3dCQUNDLElBQUk7MEJBQ0wsSUFBSTs2QkFDRSxJQUFJO1lBR3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsMkNBQTJDLENBQUM7WUFDeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxtQ0FBbUMsQ0FBQztTQUN0RDs7Ozs7UUFFRCxrREFBc0I7Ozs7WUFBdEIsVUFBdUIsUUFBUTs7Z0JBQzdCLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO2dCQUMxQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFhO29CQUMzRSxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDbkIsQ0FBQyxDQUFDO2FBQ0o7Ozs7O1FBRUQsNkNBQWlCOzs7O1lBQWpCLFVBQWtCLE1BQU07O2dCQUN0QixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7Z0JBQ3RCLFlBQVksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztnQkFDakMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztnQkFDakQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ2xDLFFBQVEsRUFBRSxFQUFFO29C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