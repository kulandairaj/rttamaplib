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
                            map$$1.entities.push(pin);
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
            { type: i0.Component, args: [{
                        selector: 'att-rttamaplib',
                        template: "  \n  <div id='myMap' class='mapclass' #mapElement>\n  </div>\n  <div id=\"ticketmodal\" class=\"modal fade\">\n\t\t<div class=\"modal-dialog\">\t\t\t\n      <div class=\"modal-content\">\n      </div>\t\t\t\n      </div>\n  </div>\n  ",
                        styles: ["\n  .mapclass{\n    height: calc(100vh - 4em - 70px) !important;    \n    display:block;\n  },\n  .infyMappopup{\n\t\tmargin:auto !important;\n    width:300px !important;\n    background-color: white;\n    border: 1px solid lightgray; \n  },\n  .popModalContainer{\n    padding:15px;\n  }\n  .popModalHeader{\n    position: relative;\n    width:100%;\n  }\n  .popModalHeader a{\n    display: inline-block;\n    padding:5px 10px;\n    background-color: #ffc107;\n    border-color: #ffc107;\n    position: absolute;\n    right:10px;\n    top:5px;\n  }\n  .popModalHeader .fa{\n    position: absolute;\n    top:-10px;\n    right:-10px;\n  \n  }\n  .popModalBody label{\n    font-weight: bold;\n    line-height: normal;\n  }\n  .popModalBody span{\n    display: inline-block;\n    line-height: normal;\n    word-break:\u00A0break-word;\n  }\n  .meterCal strong{\n    font-weight: bolder;\n    font-size: 23px;\n  }\n  .meterCal span{\n    display: block;\n  }\n  .popModalFooter .col{\n    text-align: center;\n  }\n  .popModalFooter .fa{\n    padding:0 5px;\n  }\n.modal-body {max-height:450px; overflow-y:auto}\n.tktForm .form-group {margin-bottom:5px}\n.tktForm .form-group div label {font-weight:500}\n.topBorder {border-top:#dbdbdb 1px solid;}\n\n.text-success {color:#5cb85c}\n.text-danger {color:#d9534f}\n#moreFormContentBtn, #moreFormContentBtn:hover  {    \n   \n    background:transparent;\n    border:0\n}\n#moreFormContentBtn:focus  {    \n    outline:0\n}\n\n  "]
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL3J0dGFtYXBsaWIvbGliL3J0dGFtYXBsaWIuc2VydmljZS50cyIsIm5nOi8vcnR0YW1hcGxpYi9saWIvbW9kZWxzL3RydWNrZGV0YWlscy50cyIsIm5nOi8vcnR0YW1hcGxpYi9saWIvcnR0YW1hcGxpYi5jb21wb25lbnQudHMiLCJuZzovL3J0dGFtYXBsaWIvbGliL3J0dGFtYXBsaWIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHAsIFJlc3BvbnNlLCBSZXF1ZXN0T3B0aW9ucywgSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaWJlciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tYXAnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci90b1Byb21pc2UnO1xuaW1wb3J0ICogYXMgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5pbXBvcnQgeyBUcnVja0RpcmVjdGlvbkRldGFpbHMgfSBmcm9tICcuL21vZGVscy90cnVja2RldGFpbHMnO1xuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlci9zcmMvdXRpbHMvY29sbGVjdGlvbic7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJ0dGFtYXBsaWJTZXJ2aWNlIHtcblxuICBtYXBSZWFkeSA9IGZhbHNlO1xuICBzaG93TmF2ID0gdHJ1ZTtcbiAgaG9zdDogc3RyaW5nID0gbnVsbDtcbiAgc29ja2V0OiBhbnkgPSBudWxsO1xuICBzb2NrZXRVUkw6IHN0cmluZyA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XG4gICAgdGhpcy5ob3N0ID0gXCJodHRwczovL3psZDA0MDkwLnZjaS5hdHQuY29tOjg0NDMvUkFQVE9SL1wiO1xuICAgIHRoaXMuc29ja2V0VVJMID0gXCJodHRwczovL3psZDA0MDkwLnZjaS5hdHQuY29tOjMwMDdcIjtcbiAgfVxuXG4gIGNoZWNrVXNlckhhc1Blcm1pc3Npb24odXNlck5hbWUpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciB1c2Vyc0xpc3RVcmwgPSB0aGlzLmhvc3QgKyBcImF1dGh1c2VyXCI7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVzZXJzTGlzdFVybCwgdXNlck5hbWUpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TWFwUHVzaFBpbkRhdGEoYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgc3VwZXJ2aXNvcklkID0gW107XG4gICAgc3VwZXJ2aXNvcklkID0gYXR0VUlELnNwbGl0KCcsJyk7XG4gICAgdmFyIHVzZXJzTGlzdFVybCA9IHRoaXMuaG9zdCArICdUZWNoRGV0YWlsRmV0Y2gnO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1c2Vyc0xpc3RVcmwsIHtcbiAgICAgIFwiYXR0dUlkXCI6IFwiXCIsXG4gICAgICBcInN1cGVydmlzb3JJZFwiOiBzdXBlcnZpc29ySWRcbiAgICB9KS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmRUcnVja05lYXJCeShsYXQsIGxvbmcsIGRpc3RhbmNlLCBzdXBlcnZpc29ySWQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzdXBlcnZpc29ySWRzID0gW107XG4gICAgc3VwZXJ2aXNvcklkcyA9IHN1cGVydmlzb3JJZC5zcGxpdCgnLCcpO1xuICAgIGNvbnN0IGZpbmRUcnVja1VSTCA9IHRoaXMuaG9zdCArICdGaW5kVHJ1Y2tOZWFyQnknO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChmaW5kVHJ1Y2tVUkwsIHtcbiAgICAgICdsYXQnOiBsYXQsXG4gICAgICAnbGxvbmcnOiBsb25nLFxuICAgICAgJ3JhZGl1cyc6IGRpc3RhbmNlLFxuICAgICAgJ3N1cGVydmlzb3JJZCc6IHN1cGVydmlzb3JJZHNcbiAgICB9KS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFdlYlBob25lVXNlckRhdGEoYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgbGRhcFVSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvZ2V0dGVjaG5pY2lhbnMvXCIgKyBhdHRVSUQ7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQobGRhcFVSTCkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRXZWJQaG9uZVVzZXJJbmZvKGF0dFVJRCk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIGxkYXBVUkwgPSB0aGlzLnNvY2tldFVSTCArIFwiL2dldHRlY2huaWNpYW5pbmZvL1wiICsgYXR0VUlEO1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGxkYXBVUkwpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgR2V0TmV4dFJvdXRlRGF0YShmcm9tQXR0aXR1ZGUsIHRvQXR0aXR1ZGUpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciByb3V0ZVVybCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL1YxL1JvdXRlcy9Ecml2aW5nP3dwLjA9XCIgKyBmcm9tQXR0aXR1ZGUgKyBcIiZ3cC4xPVwiICsgdG9BdHRpdHVkZSArIFwiJnJvdXRlQXR0cmlidXRlcz1yb3V0ZVBhdGgma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIlxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHJvdXRlVXJsKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzW1wiX2JvZHlcIl07XG4gICAgfSk7XG4gIH1cblxuICBHZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlsczogYW55W10pOiBhbnlbXSB7XG4gICAgbGV0IGNvbWJpbmVkVXJscyA9IFtdO1xuICAgIGxldCByb3V0ZVVybDtcbiAgICB2YXIgbmV3Um91dGVVcmw7XG4gICAgZGlyRGV0YWlscy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICByb3V0ZVVybCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL1YxL1JvdXRlcy8/d3AuMD1cIiArIGl0ZW0uc291cmNlTGF0ICsgXCIsXCIgKyBpdGVtLnNvdXJjZUxvbmcgKyBcIiZ3cC4xPVwiICsgaXRlbS5kZXN0TGF0ICsgXCIsXCIgKyBpdGVtLmRlc3RMb25nICsgXCIma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIlxuICAgICAgbmV3Um91dGVVcmwgPSB0aGlzLmh0dHAuZ2V0KHJvdXRlVXJsKVxuICAgICAgY29tYmluZWRVcmxzLnB1c2gobmV3Um91dGVVcmwpXG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbWJpbmVkVXJscztcbiAgfVxuXG4gIGdldEFkZHJlc3NCeUxhdExvbmcobGF0aXR1ZGUsbG9uZ2l0dWRlKSB7ICBcbiAgICB2YXIgYmluZ0hvc3QgPSBcImh0dHBzOi8vZGV2LnZpcnR1YWxlYXJ0aC5uZXQvUkVTVC92MS9Mb2NhdGlvbnMvTGF0TG9uZz9vPWpzb24ma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIjtcbiAgXG4gICAgdmFyIGdldEJpbmdVcmwgPSBiaW5nSG9zdC5yZXBsYWNlKFwiTGF0TG9uZ1wiLGxhdGl0dWRlICsgXCIsXCIgKyBsb25naXR1ZGUpOztcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChnZXRCaW5nVXJsKTtcbiAgfVxuXG4gIHNlbmRFbWFpbChmcm9tRW1haWwsIHRvRW1haWwsIGZyb21OYW1lLCB0b05hbWUsIHN1YmplY3QsIGJvZHkpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzbXNVUkwgPSB0aGlzLnNvY2tldFVSTCArIFwiL3NlbmRlbWFpbFwiO1xuICAgIHZhciBlbWFpbE1lc3NhZ2UgPSB7XG4gICAgICBcImV2ZW50XCI6IHtcbiAgICAgICAgXCJyZWNpcGllbnREYXRhXCI6IFt7XG4gICAgICAgICAgXCJoZWFkZXJcIjogeyBcInNvdXJjZVwiOiBcIktlcGxlclwiLCBcInNjZW5hcmlvTmFtZVwiOiBcIlwiLCBcInRyYW5zYWN0aW9uSWRcIjogXCI1MTExMVwiIH0sXG4gICAgICAgICAgXCJub3RpZmljYXRpb25PcHRpb25cIjogW3sgXCJtb2NcIjogXCJlbWFpbFwiIH1dLFxuICAgICAgICAgIFwiZW1haWxEYXRhXCI6IHtcbiAgICAgICAgICAgIFwic3ViamVjdFwiOiBcIlwiICsgc3ViamVjdCArIFwiXCIsXG4gICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJcIiArIGJvZHkgKyBcIlwiLFxuICAgICAgICAgICAgXCJhZGRyZXNzXCI6IHtcbiAgICAgICAgICAgICAgXCJ0b1wiOiBbeyBcIm5hbWVcIjogXCJcIiArIHRvTmFtZSArIFwiXCIsIFwiYWRkcmVzc1wiOiBcIlwiICsgdG9FbWFpbCArIFwiXCIgfV0sXG4gICAgICAgICAgICAgIFwiY2NcIjogW10sXG4gICAgICAgICAgICAgIFwiYmNjXCI6IFtdLFxuICAgICAgICAgICAgICBcImZyb21cIjogeyBcIm5hbWVcIjogXCJBVCZUIEVudGVycHJpc2UgTm90aWZpY2F0aW9uXCIsIFwiYWRkcmVzc1wiOiBcIlwiIH0sIFwiYm91bmNlVG9cIjogeyBcImFkZHJlc3NcIjogXCJcIiB9LFxuICAgICAgICAgICAgICBcInJlcGx5VG9cIjogeyBcImFkZHJlc3NcIjogXCJcIiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgXCJhdHRyaWJEYXRhXCI6IFt7IFwibmFtZVwiOiBcInN1YmplY3RcIiwgXCJ2YWx1ZVwiOiAgc3ViamVjdCB9LFxuICAgICAgICB7IFwibmFtZVwiOiBcIm1lc3NhZ2VcIiwgXCJ2YWx1ZVwiOiBcIlRoaXMgaXMgZmlyc3QgY2FtdW5kYSBwcm9jZXNzXCIgfSxcbiAgICAgICAgeyBcIm5hbWVcIjogXCJjb250cmFjdG9yTmFtZVwiLCBcInZhbHVlXCI6IFwiQWpheSBBcGF0XCIgfV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICB2YXIgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IGhlYWRlcnMgfSk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHNtc1VSTCwgSlNPTi5zdHJpbmdpZnkoZW1haWxNZXNzYWdlKSwgb3B0aW9ucykudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBzZW5kU01TKHRvTnVtYmVyLCBib2R5TWVzc2FnZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHNtc1VSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvc2VuZHNtc1wiO1xuICAgIHZhciBzbXNNZXNzYWdlID0ge1xuICAgICAgXCJldmVudFwiOiB7XG4gICAgICAgIFwicmVjaXBpZW50RGF0YVwiOiBbe1xuICAgICAgICAgIFwiaGVhZGVyXCI6IHsgXCJzb3VyY2VcIjogXCJLZXBsZXJcIiwgXCJzY2VuYXJpb05hbWVcIjogXCIgRmlyc3ROZXRJbml0aWFsUmVnaXN0cmF0aWlvblVzZXJcIiwgXCJ0cmFuc2FjdGlvbklkXCI6IFwiMDAwNFwiIH0sXG4gICAgICAgICAgXCJub3RpZmljYXRpb25PcHRpb25cIjogW3sgXCJtb2NcIjogXCJzbXNcIiB9XSxcbiAgICAgICAgICBcInNtc0RhdGFcIjoge1xuICAgICAgICAgICAgXCJkZXRhaWxzXCI6IHtcbiAgICAgICAgICAgICAgXCJjb250YWN0RGF0YVwiOiB7XG4gICAgICAgICAgICAgICAgXCJyZXF1ZXN0SWRcIjogXCIxMTExNlwiLCBcInN5c0lkXCI6IFwiQ0JcIiwgXCJjbGllbnRJZFwiOiBcIlJUVEFcIixcbiAgICAgICAgICAgICAgICAvLyBcInBob25lTnVtYmVyXCI6IHsgXCJhcmVhQ29kZVwiOiBcIlwiICsgdG9OdW1iZXIudG9TdHJpbmcoKS5zdWJzdHIoMCwgMykgKyBcIlwiLCBcIm51bWJlclwiOiBcIlwiICsgdG9OdW1iZXIudG9TdHJpbmcoKS5zdWJzdHIoMywgMTApICsgXCJcIiB9LCBcIm1lc3NhZ2VcIjogXCJcIiArIGJvZHlNZXNzYWdlICsgXCJcIixcbiAgICAgICAgICAgICAgICBcInBob25lTnVtYmVyXCI6IHsgXCJhcmVhQ29kZVwiOiBcIlwiLCBcIm51bWJlclwiOiBcIlwiICsgdG9OdW1iZXIgKyBcIlwiIH0sIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keU1lc3NhZ2UgKyBcIlwiLFxuICAgICAgICAgICAgICAgIFwic2NlbmFyaW9OYW1lXCI6IFwiIEZpcnN0TmV0SW5pdGlhbFJlZ2lzdHJhdGlpb25Vc2VyXCIsIFwiaW50ZXJuYXRpb25hbE51bWJlckluZGljYXRvclwiOiBcIlRydWVcIiwgXCJpbnRlcmFjdGl2ZUluZGljYXRvclwiOiBcIkZhbHNlXCIsXG4gICAgICAgICAgICAgICAgXCJob3N0ZWRJbmRpY2F0b3JcIjogXCJGYWxzZVwiLCBcInByb3ZpZGVyXCI6IFwiQlNOTFwiLCBcInNob3J0Q29kZVwiOiBcIjExMTFcIiwgXCJyZXBseVRvXCI6IFwiRE1BQVBcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgXCJhdHRyaWJEYXRhXCI6IFt7IFwibmFtZVwiOiBcImFkbWluRGF0YTFcIiwgXCJ2YWx1ZVwiOiAxMjM0NTY3IH0sIHsgXCJuYW1lXCI6IFwiY29udHJhY3Rvck5hbWVcIiwgXCJ2YWx1ZVwiOiBcImNvbnRyYWN0b3IgbmFtZVwiIH1dXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XG4gICAgdmFyIG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoeyBoZWFkZXJzOiBoZWFkZXJzIH0pO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChzbXNVUkwsIEpTT04uc3RyaW5naWZ5KHNtc01lc3NhZ2UpLCBvcHRpb25zKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFRydWNrRmVlZCh0ZWNoSWRzOiBhbnksIG1ncklkOiBhbnkpIHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuXG4gICAgICB0aGlzLnNvY2tldCA9IGlvLmNvbm5lY3QodGhpcy5zb2NrZXRVUkwsXG4gICAgICAgIHtcbiAgICAgICAgICBzZWN1cmU6IHRydWUsXG4gICAgICAgICAgcmVjb25uZWN0aW9uOiB0cnVlLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5OiAxMDAwLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5TWF4OiA1MDAwLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkF0dGVtcHRzOiA5OTk5OVxuICAgICAgICB9KTtcblxuICAgICAgdGhpcy5zb2NrZXQuZW1pdCgnam9pbicsIHsgbWdySWQ6IG1ncklkLCBhdHR1SWRzOiB0ZWNoSWRzIH0pO1xuXG4gICAgICB0aGlzLnNvY2tldC5vbignbWVzc2FnZScsIChkYXRhKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoZGF0YSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuICAvL0dldCBSdWxlIGRlc2lnbmVkIGJhc2VkIG9uIHRlY2h0eXBlLlxuICBnZXRSdWxlcyhkaXNwYXRjaFR5cGUpIHtcbiAgICB2YXIgZ2V0UnVsZXNVcmwgPSB0aGlzLmhvc3QgKyBcIkZldGNoUnVsZVwiO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChnZXRSdWxlc1VybCwge1xuICAgICAgXCJkaXNwYXRjaFR5cGVcIjogZGlzcGF0Y2hUeXBlXG4gICAgfSk7XG4gIH1cblxuICBzdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgIC8vIHJldHVybiAgaWYgeW91IHdhbnQgdG8gcmVtb3ZlIHRoZSBjb21wbGV0ZSBzdG9yYWdlIHVzZSB0aGUgY2xlYXIoKSBtZXRob2QsIGxpa2UgbG9jYWxTdG9yYWdlLmNsZWFyKClcbiAgICAvLyBDaGVjayBpZiB0aGUgc2Vzc2lvblN0b3JhZ2Ugb2JqZWN0IGV4aXN0c1xuICAgaWYoc2Vzc2lvblN0b3JhZ2UpXG4gICAge1xuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KG9iamVjdFRvU3RvcmUpKTtcbiAgICB9XG4gIH1cblxuICBzdG9yZURhdGFJbkxvY2FsU3RvcmFnZShrZXksIG9iamVjdFRvU3RvcmUpXG4gIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9TdG9yZSkpO1xuICB9XG5cbiAgcmV0cmlldmVEYXRhRnJvbUxvY2FsU3RvcmFnZShrZXksIG9iamVjdFRvU3RvcmUpXG4gIHtcbiAgICAgIHZhciByZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgaWYocmVzdWx0IT1udWxsKVxuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKGtleSlcbiAge1xuICAgIGlmKHNlc3Npb25TdG9yYWdlKVxuICAgIHtcbiAgICAgIHZhciByZXN1bHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICBpZihyZXN1bHQhPW51bGwpXG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxufVxuIiwiZXhwb3J0IGNsYXNzIFRydWNrRGV0YWlscyB7XG4gICBwdWJsaWMgVHJ1Y2tJZDogc3RyaW5nO1xuICAgcHVibGljIERpc3RhbmNlOiBzdHJpbmc7ICBcbn1cblxuZXhwb3J0IGNsYXNzIFRydWNrRGlyZWN0aW9uRGV0YWlsc3tcbiAgICBwdWJsaWMgdGVjaElkOiBzdHJpbmc7XG4gICAgcHVibGljIHNvdXJjZUxhdDogc3RyaW5nO1xuICAgIHB1YmxpYyBzb3VyY2VMb25nOiBzdHJpbmc7XG4gICAgcHVibGljIGRlc3RMYXQ6IHN0cmluZztcbiAgICBwdWJsaWMgZGVzdExvbmc6IHN0cmluZztcbiAgICBwdWJsaWMgbmV4dFJvdXRlTGF0OiBzdHJpbmc7XG4gICAgcHVibGljIG5leHRSb3V0ZUxvbmc6IHN0cmluZztcbiAgfVxuICBcbiAgZXhwb3J0IGNsYXNzIFRpY2tldHtcbiAgICBwdWJsaWMgdGlja2V0TnVtYmVyOiBzdHJpbmc7XG4gICAgcHVibGljIGVudHJ5VHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBjcmVhdGVEYXRlOiBzdHJpbmc7XG4gICAgcHVibGljIGVxdWlwbWVudElEOiBzdHJpbmc7XG4gICAgcHVibGljIGNvbW1vbklEOiBzdHJpbmc7XG4gICAgcHVibGljIHBhcmVudElEOiBzdHJpbmc7XG4gICAgcHVibGljIGN1c3RBZmZlY3Rpbmc6IHN0cmluZztcbiAgICBwdWJsaWMgdGlja2V0U2V2ZXJpdHk6IHN0cmluZztcbiAgICBwdWJsaWMgYXNzaWduZWRUbzogc3RyaW5nO1xuICAgIHB1YmxpYyBzdWJtaXR0ZWRCeTogc3RyaW5nO1xuICAgIHB1YmxpYyBwcm9ibGVtU3ViY2F0ZWdvcnk6IHN0cmluZztcbiAgICBwdWJsaWMgcHJvYmxlbURldGFpbDogc3RyaW5nO1xuICAgIHB1YmxpYyBwcm9ibGVtQ2F0ZWdvcnk6IHN0cmluZztcbiAgICBwdWJsaWMgbGF0aXR1ZGU6IHN0cmluZztcbiAgICBwdWJsaWMgbG9uZ2l0dWRlOiBzdHJpbmc7XG4gICAgcHVibGljIHBsYW5uZWRSZXN0b3JhbFRpbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYWx0ZXJuYXRlU2l0ZUlEOiBzdHJpbmc7XG4gICAgcHVibGljIGxvY2F0aW9uUmFua2luZzogc3RyaW5nO1xuICAgIHB1YmxpYyBhc3NpZ25lZERlcGFydG1lbnQ6IHN0cmluZztcbiAgICBwdWJsaWMgcmVnaW9uOiBzdHJpbmc7XG4gICAgcHVibGljIG1hcmtldDogc3RyaW5nO1xuICAgIHB1YmxpYyBzaGlmdExvZzogc3RyaW5nO1xuICAgIHB1YmxpYyBlcXVpcG1lbnROYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHNob3J0RGVzY3JpcHRpb246IHN0cmluZztcbiAgICBwdWJsaWMgdGlja2V0U3RhdHVzOiBzdHJpbmc7XG4gICAgcHVibGljIGxvY2F0aW9uSUQ6IHN0cmluZztcbiAgICBwdWJsaWMgb3BzRGlzdHJpY3Q6IHN0cmluZztcbiAgICBwdWJsaWMgb3BzWm9uZTogc3RyaW5nO1xuICAgIHB1YmxpYyBwYXJlbnROYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xuICAgIHB1YmxpYyB3b3JrUmVxdWVzdElkOiBzdHJpbmc7XG4gIH0iLCJpbXBvcnQgeyBWaWV3Q29udGFpbmVyUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uSW5pdCwgVmlld0NoaWxkLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG4vLyBpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBSdHRhbWFwbGliU2VydmljZSB9IGZyb20gJy4vcnR0YW1hcGxpYi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTmd1aUF1dG9Db21wbGV0ZU1vZHVsZSB9IGZyb20gJ0BuZ3VpL2F1dG8tY29tcGxldGUvZGlzdCc7XHJcbi8vIGltcG9ydCB7IFBvcHVwIH0gZnJvbSAnbmcyLW9wZC1wb3B1cCc7XHJcbmltcG9ydCB7IFRydWNrRGV0YWlscywgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzLCBUaWNrZXQgfSBmcm9tICcuL21vZGVscy90cnVja2RldGFpbHMnO1xyXG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcclxuaW1wb3J0IHsgZmFpbCwgdGhyb3dzIH0gZnJvbSAnYXNzZXJ0JztcclxuLy8gaW1wb3J0IHsgVG9hc3QsIFRvYXN0c01hbmFnZXIgfSBmcm9tICduZzItdG9hc3RyL25nMi10b2FzdHInO1xyXG5pbXBvcnQgeyBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlL3NyYy9tZXRhZGF0YS9saWZlY3ljbGVfaG9va3MnO1xyXG5pbXBvcnQgeyBUcnlDYXRjaFN0bXQgfSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvb3V0cHV0L291dHB1dF9hc3QnO1xyXG5pbXBvcnQgeyBBbmd1bGFyTXVsdGlTZWxlY3RNb2R1bGUgfSBmcm9tICdhbmd1bGFyMi1tdWx0aXNlbGVjdC1kcm9wZG93bi9hbmd1bGFyMi1tdWx0aXNlbGVjdC1kcm9wZG93bic7XHJcbmltcG9ydCB7IHNldFRpbWVvdXQgfSBmcm9tICd0aW1lcnMnO1xyXG5pbXBvcnQgeyBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0ICogYXMgbW9tZW50dGltZXpvbmUgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcclxuaW1wb3J0IHsgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvY29yZSc7XHJcbmltcG9ydCB7IFBBUkFNRVRFUlMgfSBmcm9tICdAYW5ndWxhci9jb3JlL3NyYy91dGlsL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBzaGFsbG93RXF1YWwgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXIvc3JjL3V0aWxzL2NvbGxlY3Rpb24nO1xyXG5cclxuZGVjbGFyZSBjb25zdCBNaWNyb3NvZnQ6IGFueTtcclxuZGVjbGFyZSBjb25zdCBCaW5nO1xyXG5kZWNsYXJlIGNvbnN0IEdlb0pzb246IGFueTtcclxuZGVjbGFyZSB2YXIgalF1ZXJ5OiBhbnk7XHJcbmRlY2xhcmUgdmFyICQ6IGFueTtcclxuKHdpbmRvdyBhcyBhbnkpLmdsb2JhbCA9IHdpbmRvdztcclxuLy8gPGRpdiBpZD1cImxvYWRpbmdcIj5cclxuLy8gICAgIDxpbWcgaWQ9XCJsb2FkaW5nLWltYWdlXCIgc3JjPVwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoa0FHUUFhSUdBUC8vLzh6TXpKbVptV1ptWmpNek13QUFBUC8vL3dBQUFDSC9DMDVGVkZORFFWQkZNaTR3QXdFQUFBQWgrUVFGQUFBR0FDd0FBQUFBa0FHUUFRQUQvMmk2M1A0d3lrbXJ2VGpyemJ2L1lDaU9aR21lYUtxdWJPdStjQ3pQZEczZmVLN3ZmTy8vd0tCd1NDd2FqOGlrY3Nsc09wL1FxSFJLclZxdjJLeDJ5KzE2ditDd2VFd3VtOC9vdEhyTmJydmY4TGg4VHEvYjcvaThmcy92Ky8rQWdZS0RoSVdHaDRpSmlvdU1qWTZQa0VrQUFaUUNBZ09ZQkpxYUJaMmVud1dhQUpHa2FhQ25xS2tGbzZXdFpLcXdxYXl1dEYreHQ1OEJ0YnRkdUw2NnZNRll2cmpBd3NkVHhMZkd5TTFPeXJITXp0TkowTERTMU5sRTFxclkydDgvM0tuZTRPVTY0cWprNXVzMTZLZnE3UEV3N3FEdzh2Y3I5TG40L0RINm52WjJBQmdnWUZZL1NQODZCZFFob0JNQkFRc1BEa3BZSU9JTkFLQWVXcFRvaC8vaXhob0RVR25rdUFTQXdTQWVpUVNBTlpKa0VaT1VpcVFjUXVEV3c1TXVlY0NrRkFDbkQ0b0NoalQwZFRObmowazhlZnJrQVZRSWdKcktDQnJOZ1RScDBpRk5nNFRrTnVEajFCRTdyU1pkZWk1aFVDQXIwYlg4NnFLcVdLdENzdjZBNnU0aFd4WnUzMW9saTBOdWo2SC91dDQ5RVZidlc3NDIvQXFrKzYvb1lCRjVEWXRGM003c2o2MFVRMUYrVENHeTVNUGhMUGRJbTduQVdjNGRQSDkrRy9yZjZSMk1FeEpBblZyMTZzay9SZThnbmRrcmJRTzJiN1B1b2ZoaTdNQy9OUVFYanB1cDdoeUFNMjlPem1BNTg3M09YZTh1M2VrMTlRcldyeXZOcnMrN0Rjd1VDVXovdmlDOCtKNDdLQTdRd1hzbWV3enZoY2RQT0IvSFUrNy9zOTJYZ1h2aXJaY1BmOUJ4VjVHQUd1UjNXMW5JM1ZBZmdnd082T0JuQnFZZ0h3N29VWlJoaGNCZEtObUhKbXhvdzRUYWdXaWhpSWIxUlNFTi81V21ub3JLc2FnWGlTU1lTRU4wOXRGNEFZSGkzYUNqREJoeDE1K1BLOXFJWFdVUnp0QmhRcjRocVNSb05Bd0pBNHI2SElsa2tsTlNnbU1JVnJaMW5ENHpicmxCbDB2S0VHWUxQRDVuSmdaQVhsZmxpeThVS2VPYnFhRTVucHAwdXZEa1AxSGlHU2R6TTZRWEE1YjBhSWxualhyQzU0OXNNWXlwVDZDTEd0Q29sNDgyQmtPYktWYkt3YUMzZmNtQm9XSUNLS3FubHpycUFxa3QvRG1wcHgrQSt1QUxySzZBYUYyd2dwRHFxUmpVcW9LazlGQ2FhNGlYMGdvcEM1eG1PU3dJLzdKaXVPcXhLc1JZR3EvRE51c3NDNzZlNENvOTVpMjdnYldHVVV0QnRpWGNxcGE0eSs2S0xiUW9BT3VPc042MmwrcTZtcVpncmpnQnhodUN1aXFRQzVtNzZNQ3Jyd0xndHRndnV5VnM2NDZpQTN0UU1KVW8rS3VyZ21VMnpDeS9KMGo4QWNEaWRHdnhwL05HakxBSTkzSlQ4Y2U2WG9wdUE1bVpJRzF2S0lNVmNva1VtWkJzb2pHVGdIR09OZXVzNElJNVE3YXpDQzJUb0RBNkhnZk53ZEJnOWt3eXhTc0gvVERFUkR2TkxNZmNKQzJKd01kTUxWWUpSWWR3TTY1Uk5EUkExTFY0bldZSW1MVHQ5dHR3eDgzdzBqOXpmU0pkV3N1ajlsVlpIQzNPM0VnRUVCc0JkZ2ZEdEJRbGMxTjREQU9sSXBnYkpwVjArQk12RjJjRUFQOWpGd0M0R1ZXaHpjTGtUbVNPcitmSWNrdzRHM21SbnNMZWUwcGhaMm1MdHlBNE1XZXY0Wm5xaE0xY05zVkpCT0QzS1hsL0VSenVKTENPNlJRQ1lLMU03S3YvTGhMelNvVDZrcDdFd3lnNjdaZGZEOHZtd2d0WC9iNVRScDVGNC9wOHI2dnlzUVN2Ulp6bTUybGoreEtpajRyNjhhY0gvZlR2d2QrZ2lQcERKNzhuSi9NQitUSkRQeXMwUzN3Q2RGRC9CT0s4ZlFBQmN6ODduUmplaDVZQ0xYQTBEY3lYRDVMM3MwNXdEd3RUdTZBRWdDVENIOHh1R1NiOFg4ZkFzTGNTUGlBOExneEM1ajQ0QTk5MThCUzE4d0xyRU9pZmE4VmhnQm1KWVhVYWFMa3JHTzk0VkFtWEhVNzRpUUxpUlh1bTZzSVJXeWVoNXVDQmlScThBUWYvYjVnK0xreHhiVEFhU3g4Z0NMVDZjZEVtOTlQQkY4RllRMVg1QVhNNHNPRVpmZUZFSmF5UmFrUVNZaUNBT0VlYjZERjNxZkxod0tEWXgxQ2s4U0tCRE5VZjE4SEVRc2JDTHV0THBQZlNwY0l6Rm1RTGQyVE9JcWZCUjBlcUlvZVlsR1QrM2tSR1R6N3lrRG9SWmY0MnVZc3RtbElWa0F4REpndWtva2ErRWhXZ0ZFTmhWQ205KzhqeGxvNURKZjU0cVVucWRCS1lBQlFtRW1aNUhSN2VwWlRJQkI0Y2Rrbk1FVDNHbHRIMElDdVBVczFpVGdXYjJYeGNIWmpaVEpjY001b1N4QU0xdTRuSGUwQXptNTY0SkIvSTZjMTd1QktlMnR3ak8zdkp5RXB5TVoyQ29LY2l6VUhJUHNheUVBSmR6VGFuNmMrZnlUTVJDYjBST3hKMy84WmNMaUtpYlB4R1EyV2pUTlR0VTR6eG9LaUM2b2pRajNiVUVFU1V6MEpseWM2VjB1RjFjeFFuTCtqWmo0S3E1YVRxNUtWTHg3bFJPbjVqalR0ZDRnMHRTbzExaG84aktTVUtUdlhacUtEZVFhUzRBR2c4OXBhVHBLcmlvZmd3NmlqTjJWUE5PZlVPRDV1S1RUOGhWWkpZNjZ0NnFPUkJwNkpWYTM0RnFxWkI2eDhHSlZjOU5GQ21xQ0ZRWGZWUXNyTCtKanljeVJ4SjJTcEl0bFRPRTBRVmtHMW9NeUc4MGlneWUvVURYZnpxSTdkRTFnOXB3ZXFpa1BJZHpjTHFza29McldoSFM5clNtdmEwcUUydGFsZkwydGE2OXJXd2phMXNaMHZiMnRyMnRyak5yVzUzeTl2ZSt2YTN3QTJ1Y0lkTDNPSWF0eEVZTFphWmt0dlVHditZVkhlVmZhNXkyeWhkTkpHeXVucHlMbmE3ZE4zdFRrbTczclZSZDhQTEl2Q1M5MExqUGErRHpLdmU5NlMzdlVHaUFYelh1OXo1NW9lOTlwM1ZscGpiS1B6bTl6UHYvUytBNVN0Zy9kUzN3UHFWQVlJVEhOMEZENWk2RHRaTGdDUE1Od2hUR0M0SHZ2RFhDS3hoRE8rM3d4dTJNSWduckdIL2xqakRJSTRKaDFPODFITHdON3NyVGpHSkwyeGlHcU5ZeGpFZThZMTFMT0lPejVqQ05RYnlqbjJjWXlKL21NVXE3dkdKajR6a0lFZjR4MDh1OHBLUjlHTHJYc1FrV002eWxyZk01U3l6RThwTjdiS1l4NXpsNDVyNXpHaE9zNXJYek9ZMnUvbk5jSTZ6bk9kTTV6cmIrYzU0enJPZTk4em5QdnY1ejRBT3RLQUhUZWhDL3hiL3RJYkdTNUwvaW1oSWhLWFJla0FLcEJrQjJkOWtGRVNxbWJRZGJsZlo0WEhHTnM1a0QyQWZzeHhOejdPZVgzR1BxY0hxM3J2UU1xLzVXWFViNkVwcS9yMVZnYWxXRW1GdGJjNmo5dnA5c2lZRFZYK3RwR0N6VUdWbWJlNVVBMm5zTVREYkhFQ1Z5QmREall4Wk5oc01xcncyRk1qWkQyWnFXM0xkL0hZa3d6MVRrK0xqbytKMlNuTFRiY0Ruc3B1YjFYMzNGTEFyYjBSdXQ5N2I5aTYrR1ZkbEttcWozMGcwQk1EOW5ZMkJCNXlwNU4wMzVkcXI4QkswRmQxWk5YaFBHaDRDZzFPYkhSSjNJNnZQUy9GMnE3ZmpjUHA0cmtVK0I0c1A1dUhvQmprRUpLNXlLVEo4MWlULzY4dlRZUEw3Wkp6aUZtLzVHVmcrQnA0LzF1YzYvK1E0bUNFZTlIdDdpdVhwZnZIRmh4eHZsN3RiWDBBSG9VbDF2b2Viajd1YUpWdzZ4bVB1Y1dLNjhPRHpqT0hBdFczdEhoSThweG9QSTcxREtVazl0dk9sSHI1eTA5bU9iRFhlaU9vamZMdmFpVTUzNmdta3NKQURkU3IzeWU0V3dodndhckJPQXJIZVBWOFBmcEsyZy96aFJTbnZnbW5keVhwbnFaeCtnSElLaG9GRkM1VlZ3enQvNlNRbXN1ZTREZ0xvZFhraGx4NVI0ZXdiZ3VVTHYzclorMTNZbWd4cWw3NGRRaUtRbnArb1YrZ3dIVjhGdFYydTJHaEFQT2RCQjI0MG9SVmNOSmZvRVk1SUJlb3ZNL1ZvcVBUMG1XOUg3aSsvbklrSGFlRHFYbjN2QzFDdkhvM3M2N3QrKys0TGY5Wk1NSC96Mis5K2cwa2J1bFVJNVAvQ003OTE4bGVjekFCWVpoVW5mMDVSZXNzMlhTVERYVUtEZ0UzUU9jbm1mK0R6WFF1b2JOdDJlWXdFZ1JHb2F6S0RnYlMxZnVXaWdDTkFnS3NsZ2hkZ1pSdElnYlZsZlNaZ2dpY0lZN1pGZ2lVSWdpM29mTGFsZ2lzb2d6T0lnN0RsZ1NmQWdqckRnYTFsUExqamd6bElmSzVsZ3oyb2d5R0lmNndGZ3hsQWhFV0lmSytGaEVrb2dTaEFoYXJsaEUrb2hEK0lncW9saExMRGhWSG9lVitvaFZ0b2hmWUNoS1FGaG1HSWhsZG9odDZDaFNnQWhTN0RoS01GaDJlb2daK2pobEpqaDNNb2hnN25oMEdEaDNrb1hpNUFpSnZGaDFXb2g0cW1pQmFEaVBnQmlIWG9oWDFJaVh2b2hpdkFnNVhZWHdvbWlaUElpVXJEaG9maWlUZi9hSWtOSTRlWHlJaHRJWWp4QW9uN2c0a3RJSW9mSTR1akNJdU5hSXJlNG9xdnFJcDF3b3FmNVlncVFJZHRTSC82NG91MlFvcHZ5SUJ4Q0l6QmlJekpTSXpWWW96SGFJdXJ5SXhVWm8xcFNJM1ZDSTFIaDQzWnlJdWRpSXR2SW8ycGFJZzJnSXBNVjN0eDVJelI0bzBDUW83bFdGNW1CNHFWUW9zbndvN3RLSTRxWW8vM0tJVTVvSXU3eG8yWWgycjJKcEQ3Nkk3VFNJYi9pSkMwd1RvK3NIdVA1NEpEUjVBTDZZOTJwNDhWOG5zUHhnTVFPUnJLbUk0VVdaRUtlWkVHMldEWTU1RVd1UnNNYVV3bnlaRkdTSkkwbUNzYW1YWXFtWkovNTN4NEIzZUVvbm92V1pNMkdZM3ZWMEUvQ1pPdGh6SVBOd1FkS1pRS2xKTmpwRVJDdHBDVTN4ZHJvNlY5VDltVEVTbDVVMmxaS21HVkx1azlUQ2x3aytCVVVQbEFBOFZhWHpXV1Nua1lYMWxMWEhtVlNyR1dOSUtXWkRrV2NPa2pjaG1WRm1ob2Q4bDVlWmxvZTVsb1R2Q1hnQmwvYlRtWVN5Q1lodGs3aFptWTR6ZVVqQms5aS9tWVJZQ1lrcm1WamxtWlJrQ1ptTW1UbDdtWlNCbVpubWxDb0JtYUtEbVNwUGtTV2xhVXA3bWFyTm1hcnZtYXNCbWJzam1idEZtYnRubWJ1Sm1idXJtYnZObWJ2dm1id0JtY3dqbWN4Rm1jR0pBQUFDSDVCQVVBQUFZQUxMVUFGd0RGQUw4QUFBUC9hTEFiL2pCS1E2dTlPT3ZOdS85Z0tJNmpaSjRUcWE1czY3NHRLcDl3YmQ5NGZzMDhCT2pBb0hCbzZSbC94S1J5U1RMMmtNeW9kR3B3OHFEVXJGWm5uV0czNERDcksvdUt6K2dPR1dWT3U5L1Z0YWtOcjRmbGM3c2VqWmZROTRCTWZSRi9nWVpEZ3o2SGk0S0pEb1dNa1RXT2o1S1dRSlFCa0plY0paU2JuYUVlbWFDaXBobWtwNm9pcWF1dWFwK3ZzaHF0czdZVXRiZXp1YnF2dkwycnY4Q253c09peGNhZHlNbVh5OHlTenMrTTBkS0gxTldCMTloN21RSGJvZDNmeXBuaW5PSGxsdWZva2VycmkrM3VodkR4Z1BQMGV2YjNkZm42Yi96OWFmNEJQQ053NEIxeUJ1MFVUS2hsSVVNcURoOUtpU2l4RWFXS2JpaGlUS0p4L3lNaWhCNFBYZ3dwMGhISmtvbE9ndW1vRWdmTGxqWmV3b1FoYzZhTG1qYkhnTXk1QkNmUEpqdC9FdkVwTkFUUm9oK09Jb1UxY3FrUXBVNXBCWTNxY2lyVnExaXphdDNLdGF2WHIyRERpaDFMdHF6WnMyalRxbDNMdHEzYnQzRGp5cDFMdDY3ZHUzano2dDNMdDYvZnY0QURDeDVNdUxEaHc0Z1RLMTdNdUxIang1QWpTNTVNdWJMbHk1Z3phOTdNdWJQbno2QkRpeDVOdXJUcDA2aFRxMTdOdXJYcjE3Qmp5NTV0U1VDQjI3aHo2OTdOdTdmdjM4Qi9Dd2hwTzdqeDQ4aVQ2eDVBWExuejU5QnZNL2RZUExyMTY3Mm5iNnlPdlR0MkFzMjlpN2NPbnZyNDg4L0xiMGZQSHJsNmpOemJ5K2Y5dm1MOCtmaHhoOC9QLy9iKy9tSDUvUWZnZkFJTzJGNkJCcUtIWUlMakxjaWdkdzQraUYyRUVscEhZWVhRWFlpaGN2VkpkTitHNUdrSTRuRWRQdlRoaU9tSmlDSndKVEowNG9ySmFRY2ZqTmZKYUY5dkJPU280NDQ4RWpEQWowQUdLZVNQQWhScDVKRklDbUNGQlFrQUFDSDVCQVVBQUFZQUxPZ0FKZ0NBQUFrQkFBUC9hTHJjL3BBRkVLdTlPT3ZOSVFnZ1FIVmthWjRtcUU0ajZyNHd1YzVpYk4rNDhzMTBtLzlBRFc4NENScVBqeDJSNTBNNmM4dG84MGxGUmEvRnFyYWt4QkpyMjNERzY1Mkt6NHN1V1lwdUw5WnJzNXNLaDgvRjZ2cFNmai9xeVgxYmVYOU1nVnFFV0laVmc0Z3FpbFNNalZtUFNKSkxsRTZSalh5WU5wWkVuVWVhaUp5aExxT0lwa0dmUTZwQXFIK2xyaW1zTTdNNXNIcXl0eDIxdHJ5ZXZpcTd3Qm01ZXNVeHdvN0pMOGR3eE0wV3l5RFNMdFNUMWlUUGR0cTB5OUhlRGR4azRlSVMxT2N5MU9icTVJRHFITmp0NSs5ZThmTHArRUxzKzhiWS9zYjBDMmpCWGlLQzB3WWloSUF0d01JSUJxODhqREJ2WWhLQUZoMVV6TWdnLzJJVWpoMDNnalFnRXFUSFN5TVZsT1I0RWxUS2xrUG9pV3VZMGdETVFpbFhacno1SzZkQ2t4aHI4Z3hSTTJTdG9oby9JYjI0YWFtSFZFNHA2b3BhZ1J2VkM3bGtDajE0VmFETHJob0dhYVdxQnF5SkhXUE5walhMdHEzYnQzRGp5cDFMdDY3ZHUzano2dDNMdDYvZnY0QURDeDVNdUxEaHc0Z1RLMTdNdUxIang1QWpTNTVNdWJMbHk1Z3phOTdNdWJQbno2QkRpeDVOdXJUcDA2aFRxMTdOdXJYcjE3Qmp5NTVOdTdidDI3aHo2OTdOdTdmdjM4Q0RDeDlPdkxqeDQ4aVRLMS9PdkhuT3dBRUtFQkR3bDBDQjZ3UWM3bzErdmZ1QXZkYTdpNmQrVjRENDg5SzEwMFhQZm9CNnVBUFl5LzhPbDd0OCtlVGJocjh2UHp0YjgvLzhCZWdlV1BzRnlGOStUZ0Zvb0lIVE9XWGZnZ3Y2VjFSOEVGWllBSDBqUFdnaGhBaGFWT0NHRUVvNGtZSWdiaWdpUWgrV2FDR0dBVkdvNG9zZHFxUGhpeVdlZUU2S05KWTQ0RGt6NXZnaWk5Ymc2S09LRFZwRDRwQkQyZ2lNQUVJaXFTS1F4UnpwWkk0eEF1UGlsRGtXMlV3QVRXSnBvWks4Y09tbGoxQXVPYWFQVmZKeTVaa2dnbmxMQUd1eXVlSjd4WWdwcDQ3YU1IbG5pV25lSXVXZUROSlpUSnlBQ2lob21JUVdlbCtmczlpcEtJT011dkxubyt5NWVVdWlsSjVYcHBXWkduaG9tRjFTYWlrdmVuWjZYcVJtbW9yZHA5Wmd1aWVxVzdwNkpnRUxPUW9vck42VWV1ZW1BVTA2SmE3eHlFb2pyN1dHV2lPckU5bUtabFF5dnBxSUxFakNHZ2lzUlhEKzJKYXlFVDY3bEs0TFRsdFVzK0lSYTVhc283SlY3WHg1WWJ0alhpU1dPeGVGM3NLRmF3SUFJZmtFQlFBQUJnQXM2QUJoQUg4QUNnRUFBLzlvdXR6K01NcEpxNFhnNnMyNzcwQVFmR1Jwbms4b0JobnF2akMyem0xczMrU3NzM2p2VTZyZDdFY3NHb0pDbW5FWlF5WjF6S2pKK2RUVnBOaExkY3ZMZWlWVTd1NUxib1RGdTJzWmUwWUwxZXVsZXc2UC85cnpaTjF1dytlZmZENStmMDk3Z1NXRGhGV0hNSXFPSW9hTUdvbVBpNUlmbEpWVmtaY3ltcCtjblF1Wm4xeWhvcVdwSXFKZ3FxbW5oNlN1bTZ3cHM2QzFEN2VmdVE2eXUybTlETC9BU3NJS3hNVXJ4OGpLanJDQnpvclFmTW5LMUhiV3lzeEgwb1RZY2Q1LzRHdmF3T1JsNXNEYzZydm9aTzJ6NzJ2aWFQTng4YnpjdXZWNis1NzlWdHlURkhEWlB3b0JCNHJLWitxZ0Jta0tlekVVNHRERHVZb2VKbmJCYVBIL0ZVY1RwVDZlTUJkUjVET1JMMzZWUkxrZ3owcVd6Y1M4aERscXkweWFEQ3poeEJIbTVzNEdWbjRTVWVGVGFBcWpTSk1xWGNxMHFkT25VS05LblVxMXF0V3JXTE5xM2NxMXE5ZXZZTU9LSFV1MnJObXphTk9xWGN1MnJkdTNjT1BLblV1M3J0MjdlUFBxM2N1M3I5Ky9nQU1MSGt5NHNPSERpQk1yWHN5NHNlUEhrQ05Mbmt5NXN1WExtRE5yM3N5NXMrZlBvRU9MSGsyNnRPblRxRk9yWHMyNnRldlhzR1BMdGlDZ3JRQUNCVWFrRFlDN1FBRUNhUWY0SGw2Z2Rsa0J4SWtESDNzN2VmSUJZWGs3bjY2N3EvRHAwNkZ6Ulk2OWUvV3IwcnQzWDI0MXdIWHg0bzFUUFk4ZVBWWHU3ZU5yZnhvK3Z2M3ZTK0hidDArZWFZRDkvd0RtOXBSK0FZclhIMU85RllpZWV2NHBHQjlVN0RtWUhYMFNvb2VmVWdSV3FCeFVDV3FZSElOTC9lZWhjd2N1MWVHSXZvR29sSWdvRW5kaFVobU9PRjlUSjZMNElsSXN0dmdiaHpvT3AySlNPYlpZb2xJUm9qZ2pnajM2ZHFOUk1YbzRaRkkxanJpa1VFR2krQ1JTUlk3NEk1UkpGZ0JWa3hvZWFXS1hVLzVVNVloWEdwV2xoMlgrMUdXYVFvRlo0WlpJUmNrbWhVbUtTU1NaVUwzNVpaZDBHbVZuaFhDYTJhV2VTYTJwWVpzNG5la2hva2pKS1NHak9BMHFZYUU3T2FwaG9FSXBXaUZVbWxZSUtaTjhQbVdwZzVnMldxcFRweXFZS2syaFNzanBUNTVLR0ZXckJZNUs1YW8wSnZrcVRMRTZPT3RPdGJwNmE1TEQ0aVJwZ0RjRUpMc1RydkpSYXFpR3pWcFY3SGdDU010bHJ0cGlHT0FBenJMS1g3aDRHa2h1VklvMjIrMVUwNmxybG43dW9vVmJ2THVkeTB3Q0FDSDVCQVVBQUFZQUxMVUF1Z0RGQU1BQUFBUC9hTHJjL2pES1NhdTFJT2pOdS85Z0tJNGljSjFvcXE0WTZiNXcvTEYwYmQ5TUp1OThyK0hBb0RDaTh4bVBvYUZ5aVNzaW4wK21kSXB5UXE4OXFuWUxzV0svTUs1WTdBV2JSZU0wdFh4dWQ5VHdKZHROajl1RGMzcjd6cmZsOVdaOWdpdC9nRitEaUNlRmhsZUpqaFNMakZHUGxBK1Jra2VWbWptWWVwdWZsNTFabjVxaG9qdWtwYWQ3cVpTbXEyR3RqNit3THJLenRXQzNqclM1YUx1SXZiNGd3TUhEamNXQ3dzZHZ5WDNMUEFEUzA5VFYxdGZVenRyYjNOM2UzK0RoNHVQazVlYm42T25xNit6dDd1L3c4Zkx6OVBYMjkvajUrdnY4L2Y3L0FBTUtIRWl3b01HRENCTXFYTWl3b2NPSEVDTktuRWl4b3NXTEdETnEzTWl4LzZQSGp5QkRpaHhKc3FUSmt5aFRxbHpKc3FYTGx6Qmp5cHhKczZiTm16aHo2dHpKczZmUG4wQ0RDaDFLdEtqUm8waVRLbDNLdEtuVHAxQ2pTcDFLdGFyVnE0OEVhTjNLdGF2WHJ6d0xpQjFMdHF6WnMySFBxbDA3TmkzYnQyWGR3cDByZCs3YnVuYlg0czJMZGlmZnR3VDIvaDBiMk85Z3RZVjFIa1lzK0hEaW5JdlBQc1laMmV6a201WExYcmFabWV6bW1wMEpOeDc4bVdab3NhVm5uaTZRV3VicTFqRmZqLzRMRzZac3c2RnJ2MXc5WURiZjNyZzdBMWQ4ZWpqazRyN3pHcWVNUEhqbTVaaWJFdzhObmJQMDQ5U1QyNjBPK2pyejdNNHJDOUErZDN6NHlPYW5kMDZQZlQxNXVPeS91eisvT0g3MDBQYXQ0My8vTm4vMy9WMzBIZWFmYWFjTnFGcUIvTEVWUUlKckxSamdZQTZxbDFtRTdVM0lvRm9VeW1maGczOWxlRjluSHVvSDRvVm5oZmpmaUJ6eVpTS0JvYTE0WUlza211V2lhNmZOR0Z1Tk1jYVZJMWs5cmViVEJsb05JQ1FCUkJJSm1HNHZKUUFBSWZrRUJRQUFCZ0FzWUFEdUFBZ0JlQUFBQS85b3V0eitNTXBKcTcwNDY2MEEvMkFvam1ScG5oa1FCQjdxdm5Bc3orWnF0M1N1NzN5dnFUYWJiMGdzR2wzQkpPN0liRHFmd0dSdytheGFyekNwbG9YdGVyK2FyUmhNTHB1allpblZ6RzRiMC9DMWUwNlBvZUZiZVgzUEIrSC9lbjJDZ3hKM2YyS0JoSXFEaG9kcGlZdVJjNDZVSzVLWGZJMlZqNWlkYlp1Z2tKNmpScHFnZUtLa3FqdW5yUUdyc0VXdXJxbXh0aVNtczRlMXQ3MGJ1c0M4dnNNVHVjQ1V4TWtmeDh6Q3lzbkd6SlhPejc3UjBzalYyaEhYMklEYjRBN2V4OVRocTkzamNlYm02T2xqNitIdDdtcnc0Zk8wOWR2eTkxUDUydnY4TFBtckJwQmZ1WUdYQ3Q0N2lEQlN3RkFOb1QyY0ZsSGlSRWNNS3pLNmlGSC80ekNPamp4K0JJbEt4Z0FDQWtSYVVaZ3VJNFVBQldJU2VLVVNDa2t0TGlrUWlNbHpRTTBxTE1uRmdNbXphTXFmVG02dXlEbGhaOUdpTTVFMkNkcEtob0NuV0FzTW9DbTFGRWVtRXJLSzlkbjFDTldRTVFhSVhYdTBiSkd6NnJLc25SdlZyYXg1SnVmcTNXcVhDRng2Y3ZVS2J0dTN4OStsTXB3SzFvdXk4SkMvWUNGY1hVeTVybU1ld1JKVDNxejFzdUZaVmpsdkp1dVpSOEhJRDRpS1hzeTF0R21LYVZjdkp1ejY4eUVacW1XdkpWRDd5TGNZaW5XTGJkMzdNUnpjd3VrV241cEhjL0xoeTUzY1FmMWc4bk9zcEtNM3VUSGp1bGp0VjZnL1VPdjlLVzN3cEhLWEw4QWJmU3p5NjJNU2QrOUpmZm4yOUZVRlh6OC8veVhyLy9GbDUxOG4rM21IMzRDZEFMamVlUWhHRWg5UEJ6WW9DWHp4OVNmaElQWjVKK0NGaWhUb25ZVWM4cEhoZFF5RzJJZUh6MFZvb2lBS2xsZmlpbldnbUp5S01PNUJJWDgxWXZoZ1RCdm1TTWVONWZrb3lJalB2U2lrR1RJS1IrT1JiQkNaSEloTWtwR2tia3RHU1VhTEgxcEp4NDZkYWVrR2tONTU2WWFUd2hrcDVoVmdwbmhtazF4Q3VXWVZVOHJXNDV0WFlIbWRtM1EyRWVkcWMrYjVoSjB6K3ZrRm1icVpLYWdSYVFaNktCYUV5b2Jub2tQc0tWcWZrTXJTWnFWV1NNcVpvWmp5QUtpU25WWnhhYWhPQ0tEcFlsV1NPa1FBaWE3MnFLcWVuam9XckZldytoeXRqSjVVS0s1ZDJDcGFxcnd5WVNwbnJ3WkxoSytDQVd0c0V5UEQ2bFhzc3JJMG14V2wwRmFCTEZUVnRpSEFqWnhtVzBXenlucUxoYW5QaW90Q0FnQWgrUVFGQUFBR0FDd25BTzRBQWdGOUFBQUQvMmk2M1A0d3lqYkl2RGpyemJ2L1lDaU9rVkNjQXFtdWJPdStzQmdRNTJuRmVLN3ZmQjRNdFdDcVJ5d2FqMFZUY0JsQU9wL1FhR2EyckE2azJLeVcrS3Q2QzgydGVFd0dBYi9lVzNuTmJpc0VOUFIzNks3Ym9WUTVXbjN2KzNWbmVuSlhmNFdHS25DQ2ltR0hqWTRZZVlxQ2ZJK1ZsZ2FCa291WG5JMUttcHFVbmFOdGthQ2FkS1NxWkptbm9LdXdXNSt1cm9TeHQwaW10SzZNdUw0N3JidXVvci9GTExQQ3dyM0d6REp4eWRERXpkTWF3ZERDcWRUYUU4algxOHZiNFF1NjN0QzI0dWhkNWVVRTRPamEzZXU3Qk5udjhNL3l5ZlgyMCtUNXRlNzRNYlAyRDFRN2dlRVNGY1NHY0p1L2haTE9OV3hHRUtLZ0FRRW40b3BuY2Y5U1JvMnhIbmFVc3c4a3Jvb2p2MGcwK1F0bHlpVUhXVGJqK0RJSVBablVSTllzaWZNWHpaUXJlekxUQ1RHbTBHMC9DOTQ4S282b3ZLQk1zUUE0a3JRY3hxaGpBQVFJTUxXSTAyUkdzV2JSdW5VclZZZzh4VG9weTdackVYeFcxVzRoeTdiczJYVmg1VUtoVzVmdEVaZVM4dXAxd3Jkdld5TlZCYVVkek1XdzQ0OHhBS09CeXJoSTRjZUh2Y0pWSkxpeVpjeWc3d1plN0RuSFpkQjkzZmI0V29CMGFSeW9ZME9HVVpYeWF4Mm5aUnYrdTJmMjdSZTVkUnRXemNPZjY5OHVnZ3ZmalhpSmJlUTRsQyt2UzV6SG1hdlFrVWlmYnRmSUROL1pZWE5IWFQzOHJlM2p6UThkajFwOU1mVGN5N3RYQlgvNi9GL3NRY3UvMzZuK2N2Ny91T1NIMlg0QVd1S2ZjQVFXK01pQnVpa0lpNENQSmVqZ0lRektOcUVxRURvbTRZVi9WQmdiaDZOazZCaUluWWlZR29tWGVOZ2VpcGFZU0IyTGxhZ1lHb3lQdUpnWmpZM1kyQjJPRk9wb0ZvK0grTWdWa0liSWlCbVJoZ2k1SVpKakNNbGtoejR1K2FRV1NrNTVoNUdQV1hsSGxWclc0V1NYYm1BNUhKaHVmRW5tR21JeWQyWVpYSzZabFpsdWlwSG1pM0UyNldPZGIrb29KWjZyM2NtbkZuUFc5U2VnVVE2YUJaeUdQaEZvV1hzbUdnT2lqaDZ4NkZhTlJ1b0NwSlo2NVdlbWtoYks2UkdZZm9xYnA2STJwbU9wM3VtSktoR0xWcnFxRENhNittb0lZc282SzZ6c0FXRHJyYmhPdHl1dklqRDRLN0FqSUVoc0ZPZ05lNndLR1BvcHV5eXp3em43ckFxRjZUcXRHSXhLZXkwTDFvYVFBQUFoK1FRRkFBQUdBQ3dYQUxvQXVnREFBQUFEL3lpMTNQNHd5a25sTURqcnpidi9ZQ2lPcERaVWFLcXV6bFcrY0N6UDJjbmVlTzdTZk8vRHRweHdPTm45anNna2djaHNNb3pKcURTMmRGcUYwS2wyNjZsZXY2c3NkOHoxZ3M4VU1Ya2ROYVBmRHpWNzdvUGJJWEs2WG5idlAvZUFkWDU5ZVlHR0lJT0VoNHN2aVhlRmpKRUdqbmFRa291VWNKYVhocGx2bTV5QW5taWdvWHFqWjZXbWM2aGdxcXRyYnExRXI3Qmpzck5ZdHB5NHVUaTF1MXE5dml6QXdWTER4Q3JHeDBsQnlqck5qTS9RTjh6U1NRSGEyOXpkQVFMZzRlTGpBZ1BtNStqcDVnVHM3ZTd2dmRmWTgvVDE5dmY0K2ZyNy9QMysvd0FEQ2h4SXNLREJnd2dUS2x6SXNLSERoeEFqU3B4SXNhTEZpeGd6YXR6SXNmK2p4NDhnUTRvY1NiS2t5Wk1vVTZwY3liS2x5NWN3WThxY1NiT216WnM0YytyY3liT256NTlBZ3dvZFNyU28wYU5Ja3lwZHlyU3AwNmRRbzBxZFNyV3ExYXRZczJyZHlyV3IxNjlndzRvZFM3YXMyYk5vMDZwZHk3YXQyN2R3NHpJQ1FMZXUzYnQ0ODBiMXhyY3YzNzErQS9jRkxMandOc0tHQ3lOT0hIZ3g0OEZRSHl1T0xMa3g1Y3FRbjJMMjYzaXp0czZlUVc4V2pabDBaZE9TVVQ5V3paaDFZdGVHWVUvVzdObWJiTUczTGRPdXpTMDM1OHU4UHdNUDdqdXowK0M5aC9NdS9sZDViZWEyblllV1BwcDZhZXVuc2FmV3ZwcDdZZ0RRdVlIM2Juajg3dURtanlNUGtMN3BldmJodDdWbituNyswdnJ4dGRsWGlwOTg0ZjFKU2ZWM0htOEFJaVdnZXNnVmVOU0I3cTJub0ZFTTB1ZGdmdkQ1SjlpRFJVVjQzNFFXQm9ZaFVScnl4K0dBdFgwNFZJZ0Jqb2dnZWhTYUtCU0tCcTRuMVhzenlpalZYYUVsQUFBaCtRUUZBQUFHQUN3bkFHWUFkUUFBQVFBRC8yaTZ2Qkl0eWttcnZUaHJGa2daV3lpT1pLa01SVm9JWnV1K202Q3FCQVRmK052TjgyRG53Q0FHeGVPQmhNaWtvOGdrc0pSUTNJN1ovRVd2SkJsMWU4UjZOZFB0OXZrdFU0aGlzZFBNWm1qVDhGcWJqWWJEdS9QcjI4NG41NVVlZklJRmNuOUllNE44UG9aQVlZbURlSXd1aUkrRGZwSWtqcFdKaFpnamxKdUppNTRibXFHVmw2UVZvS2VQYTZvVnBxMmJuYkFOckxPYmtiWUdBWFc1czZtMnNzQ1Z0YndHdU1XY1ZyeSt5N203dzRIUXA4S3d5dFYyeDd5LzJxTE4wOStoMHRqam9kZXEzdWZiNGJERTdHTGxxdG54VE9tazYvWmI3dS9VKzJPUVNhZ1hqNERBTXdEdkhhUUE3NXpCaGF2KzJlc0hrWUUrYmZNcWNwRDRUZitqQmdFY2wrSHpHSUdnTVpJaG5rR2ppSkpoU0ZvdHN3QmpHVFBXUlVVMVRUUk1rM01TcXA0dmJoWjVDTlRGVGhVMGk4YTRvelRIemFSTlU0Yk1HTFVFSXFKVmdhQVptVlVuQWF4ZHc0b2RTN2FzMmJObzA2cGR5N2F0MjdkdzQ4cWRTN2V1M2J0NDgrcmR5N2V2MzcrQUF3c2VUTGl3NGNPSUV5dGV6TGl4NDhlUUkwdWVUTG15NWN1WU0ydmV6TG16NTgrZ1E0c2VUYnEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQWd3c2ZUcnk0OGVPNEF3UUFBQmlBY3VYTSt6NmZ6dGY1OU9mUjhWN2ZucDJ1OWUzWHU4Y0ZUeDZxMmZMbHhhLzlqaDY4ZXJUdDQ3OG55ejQrK2ZsaTdldkhYN1crZnZUZi9DbjEzNERteGVRZmdlV0pkU0NDN3VYSG9Id0tQaGpmV0JLMkYyQk9DMWFvSElVYTNoZGhoK0J4Q09KMUlvNkkzWWNtUGxkaWloZldsS0dHSzVyWW9vRXBVdWRnalFXMjlLS0VNOGFFNDRZMzF0Z2pTanRLR09PSVE1SlVKSU5Ka3ZSamprVCsyS1JIVHg0SjRwUVZMY21nbFIyT3BTV0JXRlpVSllvc2Nna2ptVEthV2FHYVJxS0pKSnNQZWlrbG5GdTZlU1dkQ01xSm81NUM0a2tnbjJVR21TS2dhUXI2cHAxZCt2bGZtRm51V2RhWDlqR3E1SWhxUVVvZVc1YUc1MWFtUUw1bHFhUktRVnJYa3FEMnQyTmVHVmJIblYvc0JlWmNxUllrQUFBaCtRUUZBQUFHQUN3bkFDb0FkUUFBQVFBRC8yaTYzUDR3eWtsTkNEWHJ6YnRYQWtGOFpHbWVJRkdzQXVxKzhDSU1hejNHZUw0RmRPMFB1cUN3RVFqNWpnWE1jSWt6SW84M3B0VEVlMXFWMHl6SGFVVkd0V0JKdGR0dGhjL0VnWXBNUnJzdFBUWVorQVp6NVdSc2ZUbkd5Nzk3UVhkK2JIcUJPUUtFaElDSE9HdUtjbWFOT1FHUWZvYVRMNCtXWFhTWk1aV2NoWjg0Y2FKUGpLUlVwMlNTcWlpSnJLaXZNSnV5Tlo2MEpyRzNSNWk2SHJhOXVjQWZvYjArdjhVYnBzaXB5eHJIeUN6UUpNM0kxU1RUUDlrZXZOdkszUkxDdDgvaUVkL1Q0ZWNQNUxMbTdBN1MwNjd4RXRlOTloWHp5TVQ2RC9odXJmdG53QjByZUFUVElhdEhzSUhCVXdqLzhldkZzT0dDaDZjRzZwdDR5LytmUlFVQlpXblV0ODNHeHdjS0taNTBnSkZUUkgwcE82NTBXSExGeUhnY1pYbjhHSkxWVFhZNUQ4NWswUE5VeFk4MVZ3eVZrWFNueFphY2ZwNExDbkdwQXFpV3BJcWpLdXFsdmFLaWpqYmtLc3FxZ1pnNnpXSlY1TFFoV3BkYTJhMWxJM1lsV1RadGg0THRRaUF1d2J0UTZwbzFzTmVINE1FS0NPVkZ6SlJOWDhZYURCSTRESmxCek1XVldSNFo0TGZ5c2NlWlA5Q2dITHEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQWd3c2ZUcnk0OGVQSWt5dGZ6cnk1OCtmUW8wdWZUcjI2OWV2WXMydmZ6cjI3OSsvZ3c0c2ZUNzY4K2ZQbzA2dGZ6NzY5Ky9mdzQ4dWZUNysrL2Z2NDgrdmZ6NysvLy8vL0FBWW80SUFFRmlqYkJia0JjRUVBQU5pbTRJSUl6dllnaEJjMEdOdUVGRmI0R29ZWkx0Z2FoeDB1YUdGcUlaYlltVVVnbWlpaWFTbXFDR0ZwTHNaWVdZc3hVamlpVlRUV21PRmdPdlo0NDBrNTl0amhURUVLMmVHUEVobXBKSXBLTm5uaUpFVTZXU0tTMlVocEpUdFJXbWtpbGJwa3FhV0tWWDc1SlplZmVDbW1pMlFlWXVhWkx0S3lKcHRidWdubm1ITE9hV1dhZTd4cFo0WjQxckhublhYK3FXU2ZiK2dwYUlTdkhOb2tvVzRZS2lpamFEajZKNlJvS0xxa0xwWUtTV21qbWNhNGFhR2R4cG1OcEYrZVE2cVVuMElacW9iMm5DcGtRNjU2eXVTaHFRSVQ2NUZMN1duV3JheWFkV2F0cG1vSkxFNVNzcmdvYW1zT0M2dU9HTXArRkNWc0tqWkxaSWpTTGdYaWJSQldPNWlDMmhLVUFBQWgrUVFGQUFBR0FDd1hBQmNBdWdDL0FBQUQvMmk2M1A0d3lrbXJ2VGk3d0lVWUlDR0tSV21laGFpdGJPdStNSVhPZEYzRWVLN3ZzTzNYdktCd09Qd1pUd0dpY3NuRUhKL0pwblE2ZlI2ajFLeVdaelZpdCtBd3EvdjdpczlvQ2RsblRydmZhMXY3VFJmSGEvTzZQbnVuNWZlQVRIMHpmNEdHUW9Nb2hZZU1PWWxJalpGRmp5V0xrcGNhbEpXWW5ER2FCWmFkb2hHZm9hT25ES1dvcXhXcXJLOFFud0t3dEEyeXRiZ0d0N20wdTd5dnZyK3J3Y0tueE1XaXg4aWN5c3VYemM2UjBOR00wOVNHMXRlQTJkcDYzTjEwbndQZ3o1cmo1TkxtNk9tVTUrdUg0dS9WNnZMWTlQWGI5L2plK3Z2aC9mN2N4QXRZWnlCQk9BQVAya21vRUl6QmhtYytFWUNZUmlKRk5CWXZMcVEwVWY5am1Jd2V0NEFNeVVkVFI1SWxPYUxVTW5KbGs1WXVsOENNU1dRbVRVUW1iNzdNcVZNbXo1NDFmd0xGcVhMb3BLSkdnM3k2a1ZUcHA2Wk9OVUhsOG5TcWpxVldyMWJONm1rcjF4Y2d3b29kUzdhc3U2OW8wNnBkeTdhdDI3ZHc0OHFkUzdldTNidDQ4K3JkeTdldjM3K0FBd3NlVExpdzRjT0lFeXRlekxpeDQ4ZVFJMHVlVExteTVjdVlNMnZlekxtejU4K2dRNHNlVGJxMDZkT29VNnRlemJxMTY5ZXdZOHVlVGJ1MjdkdTRjK3ZlemJ1Mzc5L0FOUURnUUx5NDhlUElreXRmenB3NXhlYlFvMHVmanZ3NTlldllzM093cnIyN2QrWGN2NHNYSDM2OCtlemx6NnVYbm42OSsrWHQzOHMzSG4rKy9mcjI1ZVBQNzM0L2YvVkUvdjFuWG9BQ2tnZFJnZndSaUdCM0NpNkkzb0VPNmdkaGhQMU5TQ0dBRmw0NFlJWWFHdGhRaHhoK0NPS0dJbzdvb1VJbWp1Y1JBQ3kyNk9LTE1NYm80b0lVSlFBQUlma0VCUUFBQmdBc0p3QW1BQUVCZkFBQUEvOW91dHorTU1wSnE3MDQ2ODI3R29JbmptUnBubWpLQ1VWQkNJRXF6M1J0MzFXcnZ6SHUvOENna0RIUUdYbkRwSExKdkFTTVVCZXNTYTFhZ1lSbzlIWHRlcjhpbGxiTEJadlBhRVoyUEFhbDMzQnFrVTBmOU9MNHZPMUo3eVAxZ0lFbGEzMStJWUtJaVJkaWhZMTJpcENSRFlTTmhXV1NtSUp6bFpVRW1aOTZmSnlWaDZDbWFaU2pkSjZucldhaXFuMTNyclJXcWJGYUE3VzdWWXk0Ykx6QlM3Qy9XcVhDeUQrYnhWdkp6ajdFekVheno5VXF0OUl1MXRzcXZ0azYxTnppSGRIZnV1UG9Ic3ZmTGVudUcrWFp4Ky8wRTlqU3JQWDZFZDdzNGZzQURiQ0RjaTZnUVFQci9CMDBHRTlhd1lYNzdqSExCMUZmdjIvektyNGJlRVQvNDc2RTMvNTVGTmVRMmNPUjZTUXlFNG5TMmtWNUxkK3AvRVV4cGppUTJWamFURmF5V00yZDFtYiswZ2swMkV1SFJjVUp4WldVRzA1cEdac0s2MGxUYWxDTzRLdytvNHJycDFaZVMyTVIvV3JxcVVteXlMakc4b3JXVlZoVlVkdWVVcXVLclZ4VGIwZU52UnZwNkZtK3RPaXEyZ3M0a2RsaWNRdExFc3pKcnVKSWVUa2xmcXpJcjAvS3BoaHpJb3c1eitGZkp6dEQwbHlKY3drQUFFVFhpRXdLQ0lBQXNGWExzRndWQ096YnFXV2Z3SnIxeCt2YnVIV1RvTjNWTmZEakFYSUw3eUNBdFN6YnlKRXZEek13ZEkzZjBZOHJuNzdoY3lQajJiTnY1NDRoZ0hNZGsxVmdEeCtkL0Fybmp0V3puei9ldlFYdlVFeVRtTTgvdWYwTS93SGdwNDF2L2ZWWDMzOFNtTmVJZmlNVTZDQ0NHRmhtSFEzck9VZ2ZoQmZnRko4S0ZuWjRJSVlPS0FoRmVpbFUyS0dCSUZJZzRvQSttSGhpZ1NsU0lBYURJcmo0SW9veFNrQWlDamJlV09DSE9RYlJvNDgvQnFuRWtFUVdhYVFRU0NhcDVKSTROT21rZzBCQ2VZS1VVejVvSllWWmR1bmZsak5nNlNWL1ZZSlo0NWhUbG1rbUIyS2l5ZDZhOHJsSnBKcHdhdENtbk1qUldXZDVlUHFvNTU0VjNOa25jSUNhSU9pZ1h4YmFJS0luL3Fsb0JJY2krdWdJa2ZicDZLUVBNT29ocGg1VWl1YWxuRDdnYVplaGxxQnBlS0NXQ3NHb1JLcDY1YW5CdVhvQ3JEVEtPZ0dyTU5vYUo1NnA2bW9CcnRuNXl1V253bDQzWnJFM0FOc3JzaXdaNE1wc2k2MCtTMkNqMGdaeFlyVk1Vb250RUZKdXE4U0YzaWJSWTdoTW1FZ3VGY0F0ZXk2UHNUR2JBQUE3XCIgYWx0PVwiTG9hZGluZy4uLlwiIC8+XHJcbi8vICAgPC9kaXY+XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2F0dC1ydHRhbWFwbGliJyxcclxuICB0ZW1wbGF0ZTogYCAgXHJcbiAgPGRpdiBpZD0nbXlNYXAnIGNsYXNzPSdtYXBjbGFzcycgI21hcEVsZW1lbnQ+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBpZD1cInRpY2tldG1vZGFsXCIgY2xhc3M9XCJtb2RhbCBmYWRlXCI+XHJcblx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCI+XHRcdFx0XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XHJcbiAgICAgIDwvZGl2Plx0XHRcdFxyXG4gICAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG4gIHN0eWxlczogW2BcclxuICAubWFwY2xhc3N7XHJcbiAgICBoZWlnaHQ6IGNhbGMoMTAwdmggLSA0ZW0gLSA3MHB4KSAhaW1wb3J0YW50OyAgICBcclxuICAgIGRpc3BsYXk6YmxvY2s7XHJcbiAgfSxcclxuICAuaW5meU1hcHBvcHVwe1xyXG5cdFx0bWFyZ2luOmF1dG8gIWltcG9ydGFudDtcclxuICAgIHdpZHRoOjMwMHB4ICFpbXBvcnRhbnQ7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIGxpZ2h0Z3JheTsgXHJcbiAgfSxcclxuICAucG9wTW9kYWxDb250YWluZXJ7XHJcbiAgICBwYWRkaW5nOjE1cHg7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEhlYWRlcntcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHdpZHRoOjEwMCU7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEhlYWRlciBhe1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgcGFkZGluZzo1cHggMTBweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmMxMDc7XHJcbiAgICBib3JkZXItY29sb3I6ICNmZmMxMDc7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICByaWdodDoxMHB4O1xyXG4gICAgdG9wOjVweDtcclxuICB9XHJcbiAgLnBvcE1vZGFsSGVhZGVyIC5mYXtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDotMTBweDtcclxuICAgIHJpZ2h0Oi0xMHB4O1xyXG4gIFxyXG4gIH1cclxuICAucG9wTW9kYWxCb2R5IGxhYmVse1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICBsaW5lLWhlaWdodDogbm9ybWFsO1xyXG4gIH1cclxuICAucG9wTW9kYWxCb2R5IHNwYW57XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBsaW5lLWhlaWdodDogbm9ybWFsO1xyXG4gICAgd29yZC1icmVhazrDgsKgYnJlYWstd29yZDtcclxuICB9XHJcbiAgLm1ldGVyQ2FsIHN0cm9uZ3tcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XHJcbiAgICBmb250LXNpemU6IDIzcHg7XHJcbiAgfVxyXG4gIC5tZXRlckNhbCBzcGFue1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEZvb3RlciAuY29se1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIH1cclxuICAucG9wTW9kYWxGb290ZXIgLmZhe1xyXG4gICAgcGFkZGluZzowIDVweDtcclxuICB9XHJcbi5tb2RhbC1ib2R5IHttYXgtaGVpZ2h0OjQ1MHB4OyBvdmVyZmxvdy15OmF1dG99XHJcbi50a3RGb3JtIC5mb3JtLWdyb3VwIHttYXJnaW4tYm90dG9tOjVweH1cclxuLnRrdEZvcm0gLmZvcm0tZ3JvdXAgZGl2IGxhYmVsIHtmb250LXdlaWdodDo1MDB9XHJcbi50b3BCb3JkZXIge2JvcmRlci10b3A6I2RiZGJkYiAxcHggc29saWQ7fVxyXG5cclxuLnRleHQtc3VjY2VzcyB7Y29sb3I6IzVjYjg1Y31cclxuLnRleHQtZGFuZ2VyIHtjb2xvcjojZDk1MzRmfVxyXG4jbW9yZUZvcm1Db250ZW50QnRuLCAjbW9yZUZvcm1Db250ZW50QnRuOmhvdmVyICB7ICAgIFxyXG4gICBcclxuICAgIGJhY2tncm91bmQ6dHJhbnNwYXJlbnQ7XHJcbiAgICBib3JkZXI6MFxyXG59XHJcbiNtb3JlRm9ybUNvbnRlbnRCdG46Zm9jdXMgIHsgICAgXHJcbiAgICBvdXRsaW5lOjBcclxufVxyXG5cclxuICBgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUnR0YW1hcGxpYkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIGNvbm5lY3Rpb247XHJcbiAgbWFwOiBhbnk7XHJcbiAgY29udGV4dE1lbnU6IGFueTtcclxuICB0ZWNobmljaWFuUGhvbmU6IHN0cmluZztcclxuICB0ZWNobmljaWFuRW1haWw6IHN0cmluZztcclxuICB0ZWNobmljaWFuTmFtZTogc3RyaW5nO1xyXG4gIHRyYXZhbER1cmF0aW9uO1xyXG4gIHRydWNrSXRlbXMgPSBbXTtcclxuXHJcbiAgZGlyZWN0aW9uc01hbmFnZXI7XHJcbiAgdHJhZmZpY01hbmFnZXI6IGFueTtcclxuXHJcbiAgdHJ1Y2tMaXN0ID0gW107XHJcbiAgdHJ1Y2tXYXRjaExpc3Q6IFRydWNrRGV0YWlsc1tdO1xyXG4gIGJ1c3k6IGFueTtcclxuICBtYXB2aWV3ID0gJ3JvYWQnO1xyXG4gIGxvYWRpbmcgPSBmYWxzZTtcclxuICBAVmlld0NoaWxkKCdtYXBFbGVtZW50Jykgc29tZUlucHV0OiBFbGVtZW50UmVmO1xyXG4gIG15TWFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215TWFwJyk7XHJcbiAgcmVhZHkgPSBmYWxzZTtcclxuICBhbmltYXRlZExheWVyO1xyXG4gIC8vIEBWaWV3Q2hpbGQoJ3Ntc3BvcHVwJykgc21zcG9wdXA6IFBvcHVwO1xyXG4gIC8vIEBWaWV3Q2hpbGQoJ2VtYWlscG9wdXAnKSBlbWFpbHBvcHVwOiBQb3B1cDtcclxuICBAVmlld0NoaWxkKCdpbmZvJykgaW5mb1RlbXBsYXRlOiBFbGVtZW50UmVmO1xyXG4gIHNvY2tldDogYW55ID0gbnVsbDtcclxuICBzb2NrZXRVUkw6IHN0cmluZztcclxuICByZXN1bHRzID0gW1xyXG4gIF07XHJcbiAgcHVibGljIHVzZXJSb2xlOiBhbnk7XHJcbiAgbGFzdFpvb21MZXZlbCA9IDEwO1xyXG4gIGxhc3RMb2NhdGlvbjogYW55O1xyXG4gIHJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzID0gW107XHJcbiAgcmVwb3J0aW5nVGVjaG5pY2lhbnMgPSBbXTtcclxuICBpc1RyYWZmaWNFbmFibGVkID0gMDtcclxuICBsb2dnZWRVc2VySWQgPSAnJztcclxuICBtYW5hZ2VyVXNlcklkID0gJyc7XHJcbiAgY29va2llQVRUVUlEID0gJyc7XHJcbiAgZmVldDogbnVtYmVyID0gMC4wMDAxODkzOTQ7XHJcbiAgSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xyXG4gIElzVlAgPSBmYWxzZTtcclxuICBmaWVsZE1hbmFnZXJzID0gW107XHJcbiAgLy8gV2VhdGhlciB0aWxlIHVybCBmcm9tIElvd2EgRW52aXJvbm1lbnRhbCBNZXNvbmV0IChJRU0pOiBodHRwOi8vbWVzb25ldC5hZ3Jvbi5pYXN0YXRlLmVkdS9vZ2MvXHJcbiAgdXJsVGVtcGxhdGUgPSAnaHR0cDovL21lc29uZXQuYWdyb24uaWFzdGF0ZS5lZHUvY2FjaGUvdGlsZS5weS8xLjAuMC9uZXhyYWQtbjBxLXt0aW1lc3RhbXB9L3t6b29tfS97eH0ve3l9LnBuZyc7XHJcblxyXG4gIC8vIFRoZSB0aW1lIHN0YW1wcyB2YWx1ZXMgZm9yIHRoZSBJRU0gc2VydmljZSBmb3IgdGhlIGxhc3QgNTAgbWludXRlcyBicm9rZW4gdXAgaW50byA1IG1pbnV0ZSBpbmNyZW1lbnRzLlxyXG4gIHRpbWVzdGFtcHMgPSBbJzkwMDkxMy1tNTBtJywgJzkwMDkxMy1tNDVtJywgJzkwMDkxMy1tNDBtJywgJzkwMDkxMy1tMzVtJywgJzkwMDkxMy1tMzBtJywgJzkwMDkxMy1tMjVtJywgJzkwMDkxMy1tMjBtJywgJzkwMDkxMy1tMTVtJywgJzkwMDkxMy1tMTBtJywgJzkwMDkxMy1tMDVtJywgJzkwMDkxMyddO1xyXG5cclxuICB0ZWNoVHlwZTogYW55O1xyXG5cclxuICB0aHJlc2hvbGRWYWx1ZSA9IDA7XHJcblxyXG4gIGFuaW1hdGlvblRydWNrTGlzdCA9IFtdO1xyXG5cclxuICBkcm9wZG93blNldHRpbmdzID0ge307XHJcbiAgc2VsZWN0ZWRGaWVsZE1nciA9IFtdO1xyXG4gIG1hbmFnZXJJZHMgPSAnJztcclxuXHJcbiAgcmFkaW91c1ZhbHVlID0gJyc7XHJcblxyXG4gIGZvdW5kVHJ1Y2sgPSBmYWxzZTtcclxuXHJcbiAgbG9nZ2VkSW5Vc2VyVGltZVpvbmUgPSAnQ1NUJztcclxuICBjbGlja2VkTGF0OyBhbnk7XHJcbiAgY2xpY2tlZExvbmc6IGFueTtcclxuICBkYXRhTGF5ZXI6IGFueTtcclxuICBwYXRoTGF5ZXI6IGFueTtcclxuICBpbmZvQm94TGF5ZXI6IGFueTtcclxuICBpbmZvYm94OiBhbnk7XHJcbiAgaXNNYXBMb2FkZWQgPSB0cnVlO1xyXG4gIFdvcmtGbG93QWRtaW4gPSBmYWxzZTtcclxuICBTeXN0ZW1BZG1pbiA9IGZhbHNlO1xyXG4gIFJ1bGVBZG1pbiA9IGZhbHNlO1xyXG4gIFJlZ3VsYXJVc2VyID0gZmFsc2U7XHJcbiAgUmVwb3J0aW5nID0gZmFsc2U7XHJcbiAgTm90aWZpY2F0aW9uQWRtaW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSB0aWNrZXRMaXN0OiBhbnkgPSBbXTtcclxuICBASW5wdXQoKSBsb2dnZWRJblVzZXI6IHN0cmluZztcclxuICBAT3V0cHV0KCkgdGlja2V0Q2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gIHRpY2tldERhdGE6IFRpY2tldFtdID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtYXBTZXJ2aWNlOiBSdHRhbWFwbGliU2VydmljZSxcclxuICAgIC8vcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgXHJcbiAgICAvL3B1YmxpYyB0b2FzdHI6IFRvYXN0c01hbmFnZXIsIFxyXG4gICAgdlJlZjogVmlld0NvbnRhaW5lclJlZlxyXG4gICAgKSB7XHJcbiAgICAvL3RoaXMudG9hc3RyLnNldFJvb3RWaWV3Q29udGFpbmVyUmVmKHZSZWYpO1xyXG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcclxuICAgIHRoaXMuY29va2llQVRUVUlEID0gXCJrcjUyMjZcIjsvL3RoaXMudXRpbHMuZ2V0Q29va2llVXNlcklkKCk7XHJcbiAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zID0gW107XHJcbiAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnB1c2godGhpcy5jb29raWVBVFRVSUQpO1xyXG4gICAgdGhpcy50cmF2YWxEdXJhdGlvbiA9IDUwMDA7XHJcbiAgICAvLyAvLyB0byBsb2FkIGFscmVhZHkgYWRkcmVkIHdhdGNoIGxpc3RcclxuICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja1dhdGNoTGlzdCcpICE9IG51bGwpIHtcclxuICAgICAgdGhpcy50cnVja0xpc3QgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgdGhpcy5sb2dnZWRVc2VySWQgPSB0aGlzLm1hbmFnZXJVc2VySWQgPSBcImtyNTIyNlwiOy8vdGhpcy51dGlscy5nZXRDb29raWVVc2VySWQoKTtcclxuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgLy90aGlzLmNoZWNrVXNlckxldmVsKGZhbHNlKTtcclxuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9ICdjb21wbGV0ZScpICB7XHJcbiAgICAgIGRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xyXG4gICAgICAgICAgdGhpcy5tYXB2aWV3ID0gJ3JvYWQnO1xyXG4gICAgICAgICAgdGhpcy5sb2FkTWFwVmlldygncm9hZCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLm5nT25Jbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xyXG4gICAgICAgIHRoaXMubWFwdmlldyA9ICdyb2FkJztcclxuICAgICAgICB0aGlzLmxvYWRNYXBWaWV3KCdyb2FkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgICAgIFxyXG4gIH1cclxuXHJcbiAgY2hlY2tVc2VyTGV2ZWwoSXNTaG93VHJ1Y2spIHtcclxuICAgIHRoaXMuZmllbGRNYW5hZ2VycyA9IFtdO1xyXG4gICAgLy8gQXNzaWduIGxvZ2dlZCBpbiB1c2VyXHJcbiAgICB2YXIgbWdyID0geyBpZDogdGhpcy5tYW5hZ2VyVXNlcklkLCBpdGVtTmFtZTogdGhpcy5tYW5hZ2VyVXNlcklkIH07XHJcbiAgICB0aGlzLmZpZWxkTWFuYWdlcnMucHVzaChtZ3IpO1xyXG5cclxuICAgIC8vIENvbW1lbnQgYmVsb3cgbGluZSB3aGVuIHlvdSBnaXZlIGZvciBwcm9kdWN0aW9uIGJ1aWxkIDkwMDhcclxuICAgIHRoaXMuSXNWUCA9IHRydWU7XHJcblxyXG4gICAgLy8gQ2hlY2sgaXMgbG9nZ2VkIGluIHVzZXIgaXMgYSBmaWVsZCBtYW5hZ2VyIGFyZWEgbWFuYWdlci92cFxyXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckluZm8odGhpcy5tYW5hZ2VyVXNlcklkKS50aGVuKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSkge1xyXG4gICAgICAgIGxldCBtYW5hZ2VycyA9ICdmJztcclxuICAgICAgICBsZXQgYW1hbmFnZXJzID0gJ2UnO1xyXG4gICAgICAgIGxldCB2cCA9ICdhLGIsYyxkJztcclxuXHJcbiAgICAgICAgaWYgKGRhdGEubGV2ZWwuaW5kZXhPZihtYW5hZ2VycykgPiAtMSkge1xyXG4gICAgICAgICAgLy8gdGhpcy5Jc1ZQID0gSXNTaG93VHJ1Y2s7XHJcbiAgICAgICAgICB0aGlzLklzQXJlYU1hbmFnZXIgPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMubWFuYWdlcklkcyA9IHRoaXMuZmllbGRNYW5hZ2Vycy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1bJ2lkJ107XHJcbiAgICAgICAgICB9KS50b1N0cmluZygpO1xyXG4gICAgICAgICAgLy8gdGhpcy5nZXRUZWNoRGV0YWlsc0Zvck1hbmFnZXJzKCk7XHJcbiAgICAgICAgICAvLyB0aGlzLkxvYWRUcnVja3ModGhpcy5tYXAsIG51bGwsIG51bGwsIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyAvLyQoJyNsb2FkaW5nJykuaGlkZSgpIFxyXG4gICAgICAgIH0sIDMwMDApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZXZlbC5pbmRleE9mKGFtYW5hZ2VycykgPiAtMSkge1xyXG4gICAgICAgICAgdGhpcy5maWVsZE1hbmFnZXJzID0gW107XHJcbiAgICAgICAgICB2YXIgYXJlYU1nciA9IHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMubWFuYWdlclVzZXJJZCxcclxuICAgICAgICAgICAgaXRlbU5hbWU6IGRhdGEubmFtZSArICcgKCcgKyB0aGlzLm1hbmFnZXJVc2VySWQgKyAnKSdcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMudW5zaGlmdChhcmVhTWdyKTtcclxuICAgICAgICAgIHRoaXMuZ2V0TGlzdG9mRmllbGRNYW5hZ2VycygpO1xyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRhdGEubGV2ZWwuaW5kZXhPZih2cCkgPiAtMSkge1xyXG4gICAgICAgICAgdGhpcy5Jc1ZQID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy90aGlzLnRvYXN0ci53YXJuaW5nKCdOb3QgdmFsaWQgRmllbGQvQXJlYSBNYW5hZ2VyIScsICdNYW5hZ2VyJywgeyBzaG93Q2xvc2VCdXR0b246IHRydWUgfSlcclxuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIud2FybmluZygnUGxlYXNlIGVudGVyIHZhbGlkIEZpZWxkL0FyZWEgTWFuYWdlciBhdHR1aWQhJywgJ01hbmFnZXInLCB7IHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSB9KVxyXG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBjb25uZWN0aW5nIHdlYiBwaG9uZSEnLCAnRXJyb3InKVxyXG4gICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRMaXN0b2ZGaWVsZE1hbmFnZXJzKCkge1xyXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckRhdGEodGhpcy5tYW5hZ2VyVXNlcklkKS50aGVuKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGRhdGEuVGVjaG5pY2lhbkRldGFpbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZvciAodmFyIHRlY2ggaW4gZGF0YS5UZWNobmljaWFuRGV0YWlscykge1xyXG4gICAgICAgICAgdmFyIG1nciA9IHtcclxuICAgICAgICAgICAgaWQ6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkLFxyXG4gICAgICAgICAgICBpdGVtTmFtZTogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5uYW1lICsgJyAoJyArIGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkICsgJyknXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgdGhpcy5maWVsZE1hbmFnZXJzLnB1c2gobWdyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuSXNWUCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5Jc1ZQID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLklzQXJlYU1hbmFnZXIgPSBmYWxzZTtcclxuICAgICAgICAvL3RoaXMudG9hc3RyLndhcm5pbmcoJ0RvIG5vdCBoYXZlIGFueSBkaXJlY3QgcmVwb3J0cyEnLCAnTWFuYWdlcicpO1xyXG4gICAgICB9XHJcbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgY29ubmVjdGluZyB3ZWIgcGhvbmUhJywgJ0Vycm9yJyk7XHJcbiAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFRlY2hEZXRhaWxzRm9yTWFuYWdlcnMoKSB7XHJcbiAgICBpZiAodGhpcy5tYW5hZ2VySWRzICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckRhdGEodGhpcy5tYW5hZ2VySWRzKS50aGVuKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAoZGF0YS5UZWNobmljaWFuRGV0YWlscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciB0ZWNoIGluIGRhdGEuVGVjaG5pY2lhbkRldGFpbHMpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFucy5wdXNoKGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgYXR0dWlkOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmF0dHVpZCxcclxuICAgICAgICAgICAgICBuYW1lOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLm5hbWUsXHJcbiAgICAgICAgICAgICAgZW1haWw6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uZW1haWwsXHJcbiAgICAgICAgICAgICAgcGhvbmU6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0ucGhvbmVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgICBcclxuICBsb2FkTWFwVmlldyh0eXBlOiBTdHJpbmcpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMudHJ1Y2tJdGVtcyA9IFtdO1xyXG4gICAgdmFyIGxvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKDQwLjA1ODMsIC03NC40MDU3KTtcclxuXHJcbiAgICBpZiAodGhpcy5sYXN0TG9jYXRpb24pIHtcclxuICAgICAgbG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odGhpcy5sYXN0TG9jYXRpb24ubGF0aXR1ZGUsIHRoaXMubGFzdExvY2F0aW9uLmxvbmdpdHVkZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm1hcCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215TWFwJyksIHtcclxuICAgICAgY3JlZGVudGlhbHM6ICdBbnhwUy0zMmtZdkJ6alE1cGJaY25EejE3b0tCYTFCcTJIUndIQU5vTnBIczNaMjVORHZxYmhjcUpaeURvWU1qJyxcclxuICAgICAgY2VudGVyOiBsb2NhdGlvbixcclxuICAgICAgbWFwVHlwZUlkOiB0eXBlID09ICdzYXRlbGxpdGUnID8gTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLmFlcmlhbCA6IE1pY3Jvc29mdC5NYXBzLk1hcFR5cGVJZC5yb2FkLFxyXG4gICAgICB6b29tOiAxMixcclxuICAgICAgbGl0ZU1vZGU6IHRydWUsXHJcbiAgICAgIC8vbmF2aWdhdGlvbkJhck9yaWVudGF0aW9uOiBNaWNyb3NvZnQuTWFwcy5OYXZpZ2F0aW9uQmFyT3JpZW50YXRpb24uaG9yaXpvbnRhbCxcclxuICAgICAgZW5hYmxlQ2xpY2thYmxlTG9nbzogZmFsc2UsXHJcbiAgICAgIHNob3dMb2dvOiBmYWxzZSxcclxuICAgICAgc2hvd1Rlcm1zTGluazogZmFsc2UsXHJcbiAgICAgIHNob3dNYXBUeXBlU2VsZWN0b3I6IGZhbHNlLFxyXG4gICAgICBzaG93VHJhZmZpY0J1dHRvbjogdHJ1ZSxcclxuICAgICAgZW5hYmxlU2VhcmNoTG9nbzogZmFsc2UsXHJcbiAgICAgIHNob3dDb3B5cmlnaHQ6IGZhbHNlXHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgLy9Mb2FkIHRoZSBBbmltYXRpb24gTW9kdWxlXHJcbiAgICAvL01pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoXCJBbmltYXRpb25Nb2R1bGVcIik7XHJcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdBbmltYXRpb25Nb2R1bGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL1N0b3JlIHNvbWUgbWV0YWRhdGEgd2l0aCB0aGUgcHVzaHBpblxyXG4gICAgdGhpcy5pbmZvYm94ID0gbmV3IE1pY3Jvc29mdC5NYXBzLkluZm9ib3godGhpcy5tYXAuZ2V0Q2VudGVyKCksIHtcclxuICAgICAgdmlzaWJsZTogZmFsc2VcclxuICAgIH0pO1xyXG4gICAgdGhpcy5pbmZvYm94LnNldE1hcCh0aGlzLm1hcCk7XHJcblxyXG5cclxuICAgIC8vIENyZWF0ZSBhIGxheWVyIGZvciByZW5kZXJpbmcgdGhlIHBhdGguXHJcbiAgICB0aGlzLnBhdGhMYXllciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5MYXllcigpO1xyXG4gICAgdGhpcy5tYXAubGF5ZXJzLmluc2VydCh0aGlzLnBhdGhMYXllcik7XHJcblxyXG4gICAgLy8gTG9hZCB0aGUgU3BhdGlhbCBNYXRoIG1vZHVsZS5cclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoJywgZnVuY3Rpb24gKCkgeyB9KTtcclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMnLCBmdW5jdGlvbiAoKSB7IH0pO1xyXG5cclxuICAgIC8vIENyZWF0ZSBhIGxheWVyIHRvIGxvYWQgcHVzaHBpbnMgdG8uXHJcbiAgICB0aGlzLmRhdGFMYXllciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5FbnRpdHlDb2xsZWN0aW9uKCk7XHJcblxyXG4gICAgLy8gQWRkIGEgcmlnaHQgY2xpY2sgZXZlbnQgdG8gdGhlIG1hcFxyXG4gICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5tYXAsICdyaWdodGNsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgY29uc3QgeDEgPSBlLmxvY2F0aW9uO1xyXG4gICAgICB0aGF0LmNsaWNrZWRMYXQgPSB4MS5sYXRpdHVkZTtcclxuICAgICAgdGhhdC5jbGlja2VkTG9uZyA9IHgxLmxvbmdpdHVkZTtcclxuICAgICAgdGhhdC5yYWRpb3VzVmFsdWUgPSAnJztcclxuICAgICAgalF1ZXJ5KCcjbXlSYWRpdXNNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL2xvYWQgdGlja2V0IGRldGFpbHNcclxuICAgIHRoaXMuYWRkVGlja2V0RGF0YSh0aGlzLm1hcCwgdGhpcy5kaXJlY3Rpb25zTWFuYWdlcik7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIExvYWRUcnVja3MobWFwcywgbHQsIGxnLCByZCwgaXNUcnVja1NlYXJjaCkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLnRydWNrSXRlbXMgPSBbXTtcclxuXHJcbiAgICBpZiAoIWlzVHJ1Y2tTZWFyY2gpIHtcclxuXHJcbiAgICAgIHRoaXMubWFwU2VydmljZS5nZXRNYXBQdXNoUGluRGF0YSh0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmICghalF1ZXJ5LmlzRW1wdHlPYmplY3QoZGF0YSkgJiYgZGF0YS50ZWNoRGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICB2YXIgdGVjaERhdGEgPSBkYXRhLnRlY2hEYXRhO1xyXG4gICAgICAgICAgdmFyIGRpckRldGFpbHMgPSBbXTtcclxuICAgICAgICAgIHRlY2hEYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ubG9uZyA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBpdGVtLmxvbmcgPSBpdGVtLmxvbmdnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnRlY2hJRCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICB2YXIgZGlyRGV0YWlsOiBUcnVja0RpcmVjdGlvbkRldGFpbHMgPSBuZXcgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzKCk7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnRlY2hJZCA9IGl0ZW0udGVjaElEO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMYXQgPSBpdGVtLmxhdDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTG9uZyA9IGl0ZW0ubG9uZztcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExhdCA9IGl0ZW0ud3JMYXQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMb25nID0gaXRlbS53ckxvbmc7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlscy5wdXNoKGRpckRldGFpbCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHZhciByb3V0ZU1hcFVybHMgPSBbXTtcclxuICAgICAgICAgIHJvdXRlTWFwVXJscyA9IHRoaXMubWFwU2VydmljZS5HZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlscyk7XHJcblxyXG4gICAgICAgICAgZm9ya0pvaW4ocm91dGVNYXBVcmxzKS5zdWJzY3JpYmUocmVzdWx0cyA9PiB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSByZXN1bHRzLmxlbmd0aCAtIDE7IGorKykge1xyXG4gICAgICAgICAgICAgIGxldCByb3V0ZURhdGEgPSByZXN1bHRzW2pdIGFzIGFueTtcclxuICAgICAgICAgICAgICBsZXQgcm91dGVkYXRhSnNvbiA9IHJvdXRlRGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgICAgaWYgKHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMgIT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgJiYgcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxhdCA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1swXVxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMb25nID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzFdXHJcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxhdCA9IG5leHRTb3VyY2VMYXQ7XHJcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxvbmcgPSBuZXh0U291cmNlTG9uZztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBsaXN0T2ZQaW5zID0gbWFwcy5lbnRpdGllcztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mUGlucy5nZXRMZW5ndGgoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHRlY2hJZCA9IGxpc3RPZlBpbnMuZ2V0KGkpLm1ldGFkYXRhLkFUVFVJRDtcclxuICAgICAgICAgICAgICB2YXIgdHJ1Y2tDb2xvciA9IGxpc3RPZlBpbnMuZ2V0KGkpLm1ldGFkYXRhLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgdmFyIGN1clB1c2hQaW4gPSBsaXN0T2ZQaW5zLmdldChpKTtcclxuICAgICAgICAgICAgICB2YXIgY3VyckRpckRldGFpbCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICBjdXJyRGlyRGV0YWlsID0gZGlyRGV0YWlscy5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50ZWNoSWQgPT09IHRlY2hJZCkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgdmFyIG5leHRMb2NhdGlvbjtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGN1cnJEaXJEZXRhaWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbmV4dExvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTGF0LCBjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxvbmcpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKG5leHRMb2NhdGlvbiAhPSBudWxsICYmIG5leHRMb2NhdGlvbiAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwaW5Mb2NhdGlvbiA9IGxpc3RPZlBpbnMuZ2V0KGkpLmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dENvb3JkID0gdGhhdC5DYWxjdWxhdGVOZXh0Q29vcmQocGluTG9jYXRpb24sIG5leHRMb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhwaW5Mb2NhdGlvbiwgbmV4dENvb3JkKTtcclxuICAgICAgICAgICAgICAgIHZhciB0cnVja1VybCA9IHRoaXMuZ2V0VHJ1Y2tVcmwodHJ1Y2tDb2xvcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4oY3VyUHVzaFBpbiwgdHJ1Y2tVcmwsIGJlYXJpbmcsIGZ1bmN0aW9uICgpIHsgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5tYXBTZXJ2aWNlLmdldFRydWNrRmVlZCh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLCB0aGlzLm1hbmFnZXJJZHMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnNvbWUoeCA9PiB4LnRvTG93ZXJDYXNlKCkgPT0gZGF0YS50ZWNoSUQudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIGZldGNoaW5nIHRydWNrcyBmcm9tIEthZmthIENvbnN1bWVyLiBFcnJvcnMtPiAnICsgZXJyLkVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ05vIHRydWNrIGZvdW5kIScsICdNYW5hZ2VyJyk7XHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBmZXRjaGluZyBkYXRhIGZyb20gQVBJIScsICdFcnJvcicpO1xyXG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIGNvbnN0IG10cnMgPSBNYXRoLnJvdW5kKHRoYXQuZ2V0TWV0ZXJzKHJkKSk7XHJcbiAgICAgIHRoaXMubWFwU2VydmljZS5maW5kVHJ1Y2tOZWFyQnkobHQsIGxnLCBtdHJzLCB0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmICghalF1ZXJ5LmlzRW1wdHlPYmplY3QoZGF0YSkgJiYgZGF0YS50ZWNoRGF0YS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgY29uc3QgdGVjaERhdGEgPSBkYXRhLnRlY2hEYXRhO1xyXG4gICAgICAgICAgbGV0IGRpckRldGFpbHMgPSBbXTtcclxuICAgICAgICAgIHRlY2hEYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ubG9uZyA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBpdGVtLmxvbmcgPSBpdGVtLmxvbmdnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgoaXRlbS50ZWNoSUQgIT0gdW5kZWZpbmVkKSAmJiAoZGlyRGV0YWlscy5zb21lKHggPT4geC50ZWNoSWQgPT0gaXRlbS50ZWNoSUQpID09IGZhbHNlKSkge1xyXG4gICAgICAgICAgICAgIHZhciBkaXJEZXRhaWw6IFRydWNrRGlyZWN0aW9uRGV0YWlscyA9IG5ldyBUcnVja0RpcmVjdGlvbkRldGFpbHMoKTtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwudGVjaElkID0gaXRlbS50ZWNoSUQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxhdCA9IGl0ZW0ubGF0O1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMb25nID0gaXRlbS5sb25nO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TGF0ID0gaXRlbS53ckxhdDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExvbmcgPSBpdGVtLndyTG9uZztcclxuICAgICAgICAgICAgICBkaXJEZXRhaWxzLnB1c2goZGlyRGV0YWlsKTtcclxuICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBpdGVtKTtcclxuICAgICAgICAgICAgICB0aGF0LmZvdW5kVHJ1Y2sgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB2YXIgcm91dGVNYXBVcmxzID0gW107XHJcbiAgICAgICAgICByb3V0ZU1hcFVybHMgPSB0aGlzLm1hcFNlcnZpY2UuR2V0Um91dGVNYXBEYXRhKGRpckRldGFpbHMpO1xyXG5cclxuICAgICAgICAgIGZvcmtKb2luKHJvdXRlTWFwVXJscykuc3Vic2NyaWJlKHJlc3VsdHMgPT4ge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPD0gcmVzdWx0cy5sZW5ndGggLSAxOyBqKyspIHtcclxuICAgICAgICAgICAgICBsZXQgcm91dGVEYXRhID0gcmVzdWx0c1tqXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgbGV0IHJvdXRlZGF0YUpzb24gPSByb3V0ZURhdGEuanNvbigpO1xyXG4gICAgICAgICAgICAgIGlmIChyb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zICE9IG51bGxcclxuICAgICAgICAgICAgICAgICYmIHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMYXQgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMF1cclxuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTG9uZyA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1sxXVxyXG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMYXQgPSBuZXh0U291cmNlTGF0O1xyXG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMb25nID0gbmV4dFNvdXJjZUxvbmc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbGlzdE9mUGlucyA9IHRoYXQubWFwLmVudGl0aWVzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0T2ZQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcclxuICAgICAgICAgICAgICBjb25zdCBwdXNocGluID0gbGlzdE9mUGlucy5nZXQoaSk7XHJcbiAgICAgICAgICAgICAgaWYgKHB1c2hwaW4gaW5zdGFuY2VvZiBNaWNyb3NvZnQuTWFwcy5QdXNocGluKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVjaElkID0gcHVzaHBpbi5tZXRhZGF0YS5BVFRVSUQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0cnVja0NvbG9yID0gcHVzaHBpbi5tZXRhZGF0YS50cnVja0NvbC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJEaXJEZXRhaWwgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBjdXJyRGlyRGV0YWlsID0gZGlyRGV0YWlscy5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRlY2hJZCA9PT0gdGVjaElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBuZXh0TG9jYXRpb247XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJEaXJEZXRhaWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICBuZXh0TG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMYXQsIGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTG9uZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5leHRMb2NhdGlvbiAhPSBudWxsICYmIG5leHRMb2NhdGlvbiAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHBpbkxvY2F0aW9uID0gbGlzdE9mUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgdmFyIG5leHRDb29yZCA9IHRoYXQuQ2FsY3VsYXRlTmV4dENvb3JkKHBpbkxvY2F0aW9uLCBuZXh0TG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhwaW5Mb2NhdGlvbiwgbmV4dENvb3JkKTtcclxuICAgICAgICAgICAgICAgICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKHB1c2hwaW4sIHRydWNrVXJsLCBiZWFyaW5nLCBmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gTG9hZCB0aGUgc3BhdGlhbCBtYXRoIG1vZHVsZVxyXG4gICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAvLyBSZXF1ZXN0IHRoZSB1c2VyJ3MgbG9jYXRpb25cclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgbG9jID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRoYXQuY2xpY2tlZExhdCwgdGhhdC5jbGlja2VkTG9uZyk7XHJcbiAgICAgICAgICAgICAgLy8gQ3JlYXRlIGFuIGFjY3VyYWN5IGNpcmNsZVxyXG4gICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aC5nZXRSZWd1bGFyUG9seWdvbihsb2MsXHJcbiAgICAgICAgICAgICAgICByZCxcclxuICAgICAgICAgICAgICAgIDM2LFxyXG4gICAgICAgICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGguRGlzdGFuY2VVbml0cy5NaWxlcyk7XHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IHBvbHkgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9seWdvbihwYXRoKTtcclxuICAgICAgICAgICAgICB0aGF0Lm1hcC5lbnRpdGllcy5wdXNoKHBvbHkpO1xyXG4gICAgICAgICAgICAgIC8vIEFkZCBhIHB1c2hwaW4gYXQgdGhlIHVzZXIncyBsb2NhdGlvbi5cclxuICAgICAgICAgICAgICBjb25zdCBwaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihsb2MsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGljb246ICdodHRwczovL2JpbmdtYXBzaXNkay5ibG9iLmNvcmUud2luZG93cy5uZXQvaXNka3NhbXBsZXMvZGVmYXVsdFB1c2hwaW4ucG5nJyxcclxuICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMTIsIDM5KSxcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHJkICsgJyBtaWxlKHMpIG9mIHJhZGl1cycsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgdmFyIG1ldGFkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgTGF0aXR1ZGU6IGx0LFxyXG4gICAgICAgICAgICAgICAgTG9uZ2l0dWRlOiBsZyxcclxuICAgICAgICAgICAgICAgIHJhZGl1czogcmRcclxuICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihwaW4sICdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnJhZGlvdXNWYWx1ZSA9IHJkO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jbGlja2VkTGF0ID0gbHQ7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNsaWNrZWRMb25nID0gbGc7XHJcbiAgICAgICAgICAgICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgcGluLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcbiAgICAgICAgICAgICAgdGhhdC5tYXAuZW50aXRpZXMucHVzaChwaW4pO1xyXG4gICAgICAgICAgICAgIHRoYXQuZGF0YUxheWVyLnB1c2gocGluKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ2VudGVyIHRoZSBtYXAgb24gdGhlIHVzZXIncyBsb2NhdGlvbi5cclxuICAgICAgICAgICAgICB0aGF0Lm1hcC5zZXRWaWV3KHsgY2VudGVyOiBsb2MsIHpvb206IDggfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgbGV0IGZlZWRNYW5hZ2VyID0gW107XHJcblxyXG4gICAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5tYXBTZXJ2aWNlLmdldFRydWNrRmVlZCh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLCB0aGlzLm1hbmFnZXJJZHMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChkaXJEZXRhaWxzLnNvbWUoeCA9PiB4LnRlY2hJZC50b0xvY2FsZUxvd2VyQ2FzZSgpID09IGRhdGEudGVjaElELnRvTG9jYWxlTG93ZXJDYXNlKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGRhdGEpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBmZXRjaGluZyB0cnVja3MgZnJvbSBLYWZrYSBDb25zdW1lci4gRXJyb3JzLT4gJyArIGVyci5FcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdObyB0cnVjayBmb3VuZCEnLCAnTWFuYWdlcicpO1xyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgZmV0Y2hpbmcgZGF0YSBmcm9tIEFQSSEnLCAnRXJyb3InKTtcclxuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBnZXRUcnVja1VybChjb2xvcikge1xyXG4gICAgbGV0IHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFIa21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1JtTTJWaU1XUXROR0psWkMxak5qUTBMVGd6WW1VdFlqUTVZalpsTkRsbVltUm1JaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpHRXhOVEJsWVRFdE1qSmhZeTAzT1RRNUxUaGlObUV0WldVMU1UYzRaVEJtTVdGa0lpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09tWXdaV1F4WldNM0xUTTFPVEF0WkdFMFlpMDVNV0l3TFRZd09UUTJaakZoTldRNVl6d3ZjbVJtT214cFBpQThjbVJtT214cFBuaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMlBDOXlaR1k2YkdrK0lEd3ZjbVJtT2tKaFp6NGdQQzl3YUc5MGIzTm9iM0E2Ukc5amRXMWxiblJCYm1ObGMzUnZjbk0rSUR4NGJYQk5UVHBJYVhOMGIzSjVQaUE4Y21SbU9sTmxjVDRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUltTnlaV0YwWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEUwVkRFNU9qQTRPakF6TFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpOCtJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKellYWmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG8xWkRRMk1EYzFaaTA0TW1SbUxXWTNOREF0WW1VM1pTMW1OMkkwTXpsbVlqY3lNekVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UVlVNVGs2TWpNNk16RXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpSUhOMFJYWjBPbU5vWVc1blpXUTlJaThpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09tRmtaak5sWWpGa0xUUmlaV1F0WXpZME5DMDRNMkpsTFdJME9XSTJaVFE1Wm1Ka1ppSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4T1ZReE5UbzBPVG93TVMwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4TDNKa1pqcFRaWEUrSUR3dmVHMXdUVTA2U0dsemRHOXllVDRnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrSUR3dmNtUm1PbEpFUmo0Z1BDOTRPbmh0Y0cxbGRHRStJRHcvZUhCaFkydGxkQ0JsYm1ROUluSWlQejRkYjd2akFBQUNlMGxFUVZSSXg5MldUV3RUUVJTR256TnpiM0xUdEtHMVdsSHdxNHVDYllYK0ExMjVFTGN1dWloQ1JYQ3AySDNCaFN2L2dVdkJnbEp3NFVMQmlncFNhVUZjaUZMRmpTQXRzWDYxU2RNMHZYTmM5Tm9rUlpPWUFSWG5NcXU1ekRQbm5QZThNNEdxOHFkSHdGOFkveDcwNnJPSm5wVEl0YWRmN28rK0x5K1ZyWmhrUlpMNVl6akV4T24xRjVtcHNVUG5ia3lNVFQ1cUd6cFhtUmxaTHViSFA3S0U3VXBuMks2LzFERlZ3V1NobUZzZGYvaDJabnlDU1drL3ZmZTZlNzROdlNhekowZnNLdlZyZGZvVHpLYXdYaW95Ti8rODVGZlRKN3VuM0tjY3dka2lGQnNkWG9sVElIbUR6SGI1MWJUbmNBNFhPR0lSTkZTa1FYZFpvNmcxWkxvajZ3V05CbVEwN05WcDhpbnNoaUFOZ3RYVk1tRlh5SUdoL2FlOG9BK0MyL25BV0FwM2hPQkQ5TXUvTlFhNkhkbmpaWWJQOUo4R1p0cUdIaHpjMjFGSXJSSHMyeUFveHcxUEwxbEZnMDBHMGtjdUFwZmFoaTYvTE56cTdPdmw1UG1qbEl0cmFDSlpRUkN0NWxwRnlVUnA1bTh1TVAxNXFuVDV4SlgyMDF1dWJLU3picXM3SkhZMVlTblVRQkZGalFFTVg5ZFdQRzFRUWxVVVI0eXFyZnFCMXJlcEtEaGluQ2hJNkFmVlJLNlNmUFYyOEhPdnNCZy9xQk5GaEdTYnhsZWdrNlFNenZlV1VXb01RWnJ2Sm15THJXMm9RWkFZekcvYzg5NVFFV2twd0MweG1lVENjNTdwUlZ0bFl0UWdDdFlYS2lLMC9vUnlpRkhFZUFvcGRxN0c1TFZwTmF2VEoxTFZtcHBLTStIaVd0TjRZMmhhTElvbUtkWW1Ra3I2MmhlcUFzWUsxZ2hoRk80QVMxM2FBd3RpRFd4NlFvdTJaREtsSEl0dlZxbFUxbEhWcWlGcW5TTVFoU0d1Wk5DTzVsSnFDQjNjZFd4bDRkMnJ6dG5yaXhocmNBbDBaenBVaFZnZFVkVEpjUDlJd1F0Njk4TGp2di9taGY4ZHRHSGxoNHY1UjFJQUFBQUFTVVZPUks1Q1lJST0nO1xyXG5cclxuICAgIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICdncmVlbicpIHtcclxuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUhrbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUm1NMlZpTVdRdE5HSmxaQzFqTmpRMExUZ3pZbVV0WWpRNVlqWmxORGxtWW1SbUlpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdFeE5UQmxZVEV0TWpKaFl5MDNPVFE1TFRoaU5tRXRaV1UxTVRjNFpUQm1NV0ZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T21Zd1pXUXhaV00zTFRNMU9UQXRaR0UwWWkwNU1XSXdMVFl3T1RRMlpqRmhOV1E1WXp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkyUEM5eVpHWTZiR2srSUR3dmNtUm1Pa0poWno0Z1BDOXdhRzkwYjNOb2IzQTZSRzlqZFcxbGJuUkJibU5sYzNSdmNuTStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTBWREU1T2pBNE9qQXpMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzFaRFEyTURjMVppMDRNbVJtTFdZM05EQXRZbVUzWlMxbU4ySTBNemxtWWpjeU16RWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRWVU1UazZNak02TXpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21Ga1pqTmxZakZrTFRSaVpXUXRZelkwTkMwNE0ySmxMV0kwT1dJMlpUUTVabUprWmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhPVlF4TlRvME9Ub3dNUzB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NGRiN3ZqQUFBQ2UwbEVRVlJJeDkyV1RXdFRRUlNHbnpOemIzTFR0S0cxV2xId3E0dUNiWVgrQTEyNUVMY3V1aWhDUlhDcDJIM0JoU3YvZ1V2QmdsSnc0VUxCaWdwU2FVRmNpRkxGalNBdHNYNjFTZE0wdlhOYzlOb2tSWk9ZQVJYbk1xdTV6RFBublBlOE00R3E4cWRId0Y4WS94NzA2ck9KbnBUSXRhZGY3bysrTHkrVnJaaGtSWkw1WXpqRXhPbjFGNW1wc1VQbmJreU1UVDVxR3pwWG1SbFpMdWJIUDdLRTdVcG4ySzYvMURGVndXU2htRnNkZi9oMlpueUNTV2svdmZlNmU3NE52U2F6SjBmc0t2VnJkZm9Uekthd1hpb3lOLys4NUZmVEo3dW4zS2Njd2RraUZCc2RYb2xUSUhtRHpIYjUxYlRuY0E0WE9HSVJORlNrUVhkWm82ZzFaTG9qNndXTkJtUTA3TlZwOGluc2hpQU5ndFhWTW1GWHlJR2gvYWU4b0ErQzIvbkFXQXAzaE9CRDlNdS9OUWE2SGRualpZYlA5SjhHWnRxR0hoemMyMUZJclJIczJ5QW94dzFQTDFsRmcwMEcwa2N1QXBmYWhpNi9MTnpxN092bDVQbWpsSXRyYUNKWlFSQ3Q1bHBGeVVScDVtOHVNUDE1cW5UNXhKWDIwMXV1YktTemJxczdKSFkxWVNuVVFCRkZqUUVNWDlkV1BHMVFRbFVVUjR5cXJmcUIxcmVwS0RoaW5DaEk2QWZWUks2U2ZQVjI4SE92c0JnL3FCTkZoR1NieGxlZ2s2UU16dmVXVVdvTVFacnZKbXlMclcyb1FaQVl6Ry9jODk1UUVXa3B3QzB4bWVUQ2M1N3BSVnRsWXRRZ0N0WVhLaUswL29SeWlGSEVlQW9wZHE3RzVMVnBOYXZUSjFMVm1wcEtNK0hpV3RONFkyaGFMSW9tS2RZbVFrcjYyaGVxQXNZSzFnaGhGTzRBUzEzYUF3dGlEV3g2UW91MlpES2xISXR2VnFsVTFsSFZxaUZxblNNUWhTR3VaTkNPNWxKcUNCM2NkV3hsNGQycnp0bnJpeGhyY0FsMFp6cFVoVmdkVWRUSmNQOUl3UXQ2OThManZ2L21oZjhkdEdIbGg0djVSMUlBQUFBQVNVVk9SSzVDWUlJPSc7XHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ3JlZCcpIHtcclxuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUgzbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1EVmpNemMxWkRZdE1XTmxPQzFrWmpSbExUZ3dZamd0TWpsbVlUUmhaakEyWkRFM0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdSbU1HSXpZbUV0TVdOaVpDMWhNalEwTFdFeVpXTXRNVGc0WVRsa09HUmxNamswSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEcG1NR1ZrTVdWak55MHpOVGt3TFdSaE5HSXRPVEZpTUMwMk1EazBObVl4WVRWa09XTThMM0prWmpwc2FUNGdQSEprWmpwc2FUNTRiWEF1Wkdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5qd3ZjbVJtT214cFBpQThMM0prWmpwQ1lXYytJRHd2Y0dodmRHOXphRzl3T2tSdlkzVnRaVzUwUVc1alpYTjBiM0p6UGlBOGVHMXdUVTA2U0dsemRHOXllVDRnUEhKa1pqcFRaWEUrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSmpjbVZoZEdWa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5pSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TldRME5qQTNOV1l0T0RKa1ppMW1OelF3TFdKbE4yVXRaamRpTkRNNVptSTNNak14SWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTFWREU1T2pJek9qTXhMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEb3dOV016TnpWa05pMHhZMlU0TFdSbU5HVXRPREJpT0MweU9XWmhOR0ZtTURaa01UY2lJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRsVU1UVTZOVEk2TWpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEM5eVpHWTZVMlZ4UGlBOEwzaHRjRTFOT2tocGMzUnZjbmsrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrN1NkQXdBQUFBc3BKUkVGVVNNZmxsN3RyRkZFWXhYL2ZuWmxkTndtSkdrS0lDRDRpSVdLbElvcXJWajQ2UVZCc2ZZRDRIMmhoYlpBVTJvaUluVnFJV0dobEk2Z2dCbEY4Qk44aEtvaEVvaEkxYmpiN3VQZXoyTkhkVGR6WlpTZG80UXpmYmVZTzU1N3ZuSHZ1aktncWYvc3kvSVBMajNyNDlNNDloc2R1SlZvR0w2N29IQ2RoQStObXpoR1ViQ0VuRDdjdW45alR1ZnJEMkxKZXUrWHd3ZVpCYjU0OHNYakRaTzcwc2x4eVhiN0RwVVFvYTZGbFdPYzhXZjlvWW5TczkrMEYrbGFlQTZhYUJ2MTBlMmpORjV2ZHVhNS9KZGJPSUZsaEJUV0sxZnphOXVmRGl3cmJkbndCTGphdDZSdkQ0SStXZG5DR2d0UHEwbkxaSWtDQ0owclBsWWNQenNjeTB0MVBIL3UrK1VicjJrMHNTVHllR2NQQTFjdTVXS0NacnU0ejg3SFRvTXhUYWxaU0JhUklkNkRqMjlLYmpzWnk3NzcrdmxQMjVZdEROd0lmRFlJcUlhWENTRVlNTU0yU25MRzczbzFmaXdXNnU2ZDc3L3dIOTR2WFh3NTdXWkVLSUpBS1Azbk9wOFBsU1U5ODcxcDE1bXdpRnVqemtkSDkvUjJkeVMyWkgzZ0pueitsbHdBT2gvb3BKbHVVenlPdkRuUkJaSXNsS2dhUHRiWG10MmNMd2RMTmFlekNCZURjckMxVFltd2htVUplajNEcHlXT09xRXJUVENXVExiWjZ5YUROR0p4VUNWbkZWTVZnOEZEeFNFQTJWbnN4QnNWZ3c2SkdWNHgxcUhHSWsvalo2d0FuSllLaTFTbFVGVTRDaUlDVTNvbkhGRkJWU25mWnNiTkJGUlZGYU95WWpBd0hUOEZaQzFvYk1OeXBnR0NkYStpczlPdXZTRkEwSERWS2lIRGVYTFQzTjVCRU5OZ0FqWm1vSVZBSmgxKzYxV0phOHRJY3VOY1RyVVJGTklLcENJak1qYVlGVlN3T0U4SFVkNHBUeFRiNGtWZTN2UWdJSWN1b2RGTnBXTlhvR0pRd0Q0d0J6OVJNQjZjT01WSmFYRnpRaEFxdG51QmxNNWhKSDdVV0Nkcyt5OU1KaHlrV0NCb3dVeVJvemxudnZiT01EZzFWZ1pod1o4b003Z0h3R2J4WW9PbUI0MTlOTWQrR3l4VVU1N1FpQ2lwUHVGSUpCdDlzREZKVGRXM3kzL3hXL0FSTnBqdnhsODB1TEFBQUFBQkpSVTVFcmtKZ2dnPT0nO1xyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICd5ZWxsb3cnKSB7XHJcbiAgICAgIHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFJS21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZOVGc2TlRVdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZOVGc2TlRVdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1E0TWpGa1pqTXRabUZsTkMweE1qUXpMVGxqWlRVdFptRmtOMkUyTVRkbU5UVTNJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpqVXdOMkl4WW1NdE5EQmtaUzB3WkRReUxXSXdaVGN0TUdVNE5qTm1OelZrTmpBMElpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09qQXdNREpsTkRobExUaG1PV1V0TmpVMFl5MDVZalEyTFRWbVlXWmtNVEJoTjJFMk56d3ZjbVJtT214cFBpQThjbVJtT214cFBtRmtiMkpsT21SdlkybGtPbkJvYjNSdmMyaHZjRG80TXpjeFkyVTJZUzB4WVdaa0xURTBORE10T1RneFpDMWtOMkU0TkdZMU5tVTBaV1U4TDNKa1pqcHNhVDRnUEhKa1pqcHNhVDVoWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpqQmxaREZsWXpjdE16VTVNQzFrWVRSaUxUa3hZakF0TmpBNU5EWm1NV0UxWkRsalBDOXlaR1k2YkdrK0lEeHlaR1k2YkdrK2VHMXdMbVJwWkRvNE9HUXpOVFpoTnkwM01UZ3hMV1UxTkdFdE9UbG1aUzAwT0RCbE16VmhZelkyWmpZOEwzSmtaanBzYVQ0Z1BDOXlaR1k2UW1GblBpQThMM0JvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNE9HUXpOVFpoTnkwM01UZ3hMV1UxTkdFdE9UbG1aUzAwT0RCbE16VmhZelkyWmpZaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVFJVTVRrNk1EZzZNRE10TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPalZrTkRZd056Vm1MVGd5WkdZdFpqYzBNQzFpWlRkbExXWTNZalF6T1daaU56SXpNU0lnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE5WUXhPVG95TXpvek1TMHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGljMkYyWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUTRNakZrWmpNdFptRmxOQzB4TWpRekxUbGpaVFV0Wm1Ga04yRTJNVGRtTlRVM0lpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEU1VkRFMU9qVTRPalUxTFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQnpkRVYyZERwamFHRnVaMlZrUFNJdklpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QbmV3WTZVQUFBSkVTVVJCVkVqSDNWWXhheFJSRVA2KzkvYXl1ZFVJa1NObkNBb1JsWWlJV2dtQ2hSRHNSVXRiQzMrQWxzSFd3bFliaTFocFl4RUVtMWlwTVJCUkVVUThnbzJTSENraTNsMjQzTjd1elZna0puZkh1YnU1RnhKdzRMSEZ6czQzODMzelpvZXFpcjAyZzMyd2ZRSDFrbDVXVm4rVnYzeTRGeHc3OGt3T0RSMkV5SVlVMmlQMTlWRHdjK1dpR1Q5MXYxNGNIUjlOaXNza1RhY2ZYR3Rjblh6ckYwWitJd3paOWxVM3RDREllNWg5MWNTYVhBcHYzSndiN0p2ZVQ1OC95dEp5RGFvV2JEOWlRZkcyRHRTRFVoREZGcVZ2SlhIU2RIcEdNTDlBK0VGeUVBVmhTVVR4QUI0L3lidHAybEJCc3dYQUV0WnFPN2RkbVN0b0ZiUkFMUXJkUUdkbkhxSlZ2WTFxdFFMR0J2OVNuMURVUW9WcUExTjNiNldDTW0wNHZINlIxN21GWVFnRFdMdE5hRWVsYW1BTmNPNU1HWlBYMStnRSt2VFJVVzIyaGxBNC9BTnhSTkQydkRDZ0tPd0FNSEZDOGZ6bDJQcWRxY1dnYjNwUG42eGh0VDZPa1dJUktnclZucEtDQ25nKzhXWitCV09GaXB1bVVXd1FSekhPbmo4T1NNcU16Zytndk5SQzRjQ3lHK2dXaytzUjRwWWt1dVVJeEZHTU1EU09vR3g3TXNXUHV6Ujd0NnROaWFvOUV1MFhWRHZtcktZem9ydFVxVEpqcFp1ZHJhNmdaSGZVaEVMMWI0S3U5SExubmNJTWJvbjliVlJCRUR2Wm85UVZGSnF0UHQwY1N3UmhNaVRvcFhGRkFwcWxlOWxqb2VpdmU2Vk5vL1R1SmJPSm1naHFRZmkrQjJUVWRBTlBISytNV3YyKzJPVGxLeDZNbUVSR01KaUQ3M3V3b0hFQ0hTNzZLOFY2SVhqL0xoSVZkdnpLdWkzbkE2V3ZEWE5od3RhZE40Zi9ac1AvQXd6dDVSM2JzUTJqQUFBQUFFbEZUa1N1UW1DQyc7XHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ3B1cnBsZScpIHtcclxuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUgzbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllqVm1ZbVUzWWpZdFpHUTFPQzFqTnpSaUxUaG1aR1l0WWpKa05qVTFOVFkzT1RFMElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpBeE5tWm1OamN0WVdZeFpDMDJNVFE1TFRnek1qUXRaRE0wT0dZMU56ZzBaVGswSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEcG1NR1ZrTVdWak55MHpOVGt3TFdSaE5HSXRPVEZpTUMwMk1EazBObVl4WVRWa09XTThMM0prWmpwc2FUNGdQSEprWmpwc2FUNTRiWEF1Wkdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5qd3ZjbVJtT214cFBpQThMM0prWmpwQ1lXYytJRHd2Y0dodmRHOXphRzl3T2tSdlkzVnRaVzUwUVc1alpYTjBiM0p6UGlBOGVHMXdUVTA2U0dsemRHOXllVDRnUEhKa1pqcFRaWEUrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSmpjbVZoZEdWa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5pSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TldRME5qQTNOV1l0T0RKa1ppMW1OelF3TFdKbE4yVXRaamRpTkRNNVptSTNNak14SWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTFWREU1T2pJek9qTXhMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGlOV1ppWlRkaU5pMWtaRFU0TFdNM05HSXRPR1prWmkxaU1tUTJOVFUxTmpjNU1UUWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TURKVU1USTZNakE2TXpNdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEM5eVpHWTZVMlZ4UGlBOEwzaHRjRTFOT2tocGMzUnZjbmsrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrMzQxM2p3QUFBdXBKUkVGVVNNZmxsODl2VkZVVXh6L24zdnVtMDRMbFY4RHdhMUdSTm9TNHdLWVE0MHB3UlFnN293bHVjQ0ViTnF6d0QyQ0hDemZLUWxlV3hCQldKcEM0UXpZRVE4TENLS0xTQUZXVVNKQlN5MHc3Nzk1elhMd3BuYVl6MHpxdjBZVm5jaWVabkp2M3ZlZjcvWjV6MzRpWjhXK0g0eitJMEMxNWNmd1NEMjllcWVRWFhubTVOcjJwSWxuU3BhY1dHckV1ei9aZWVUSzY2OWlEcWFIZjBva3o3L1FPZXVPem16dUdwdDc4ZUdzYUd0TzFqWDRuOGx3TGE4SXJvRUdsT2prNk1aTTlHR2ZZUGdWcVBZTk9Ybi82NnZyRzA2TjdkbTRnMTdRb1p5M0NaQUxFTkJwdnJkOG1iOHc4QnM3M3JPbWp5djJ6cy8wMW9nbFI0NktWYkdIVlU2SVJZQ0o4di9YcWoxOTlYc3BJMzgxOE0xd1AwOWJDYXR1b0FJNCs3bGR1Yy83clQrWktnY2FOOVhNdjZMcFpBVEtyZGx5ZVBqS0JGOVBtUDE3Yjkvb0hwZHg3ZU1kYkg2VmI2ZjF2QjY2aVlraExUcXo0WllBaVZLT3dxYll6N2YzNTZKZWxRQThPSG5rN2oydmlEejlkODFIbVdBeTdFTGwzRE9hRGJHZjM1aU9uRDFaS2dkNzVaZUw0bGpEUzkxSWNvMko5R05wbWw0QXFpUENYVFRNNWVmYzlHTzFLc1hRYmcrL0txY1lJWTluSThBaXlJUys0bkcrWkpyMkM0QldzMzhqdkJDNC8vSUp4KzFCNnJuU1d1Wmd4a1BYTEdweEZSS1ZObllLSm9TcUllUUpadlJTOWdrTXhvaVNjSktURCtVMGRtaUNaS3o5N0ZTMTBOQ25vN0tDRWlJRUFvbWhiM1h1NlpReWpzL2JPREhFR3JPeWFYQVpVaU9TWUZkcDFaTVFWdWFRSnQ0STZYUGVrdzVwMWRyT2oxK0pJeGJpVTFhRFhXcjdiUjNMR1Azbi9DTXR0RUFRUjhBTFdZZkE3Qld2dUt3MmFFZkJOTXBJdHpOc2xsUW9Gb0hUWGZvVjlXaGdKdEd1bG9nRzFoSnF1RHIyK3NBakpyR09sVUl6ZlZkSFVOYWtTWjdnQUZqdDVMZUc5ekR1Z0xHaEdsUUdrN3BFZ2tPWWY2MXI4TElnSldvR3NZUVN5Y3FBTlp2MGpmdVgzZTNlZlR5UnBmdG8xaVNjd3paKytGT2loa3dlbWZNT3ZEWFBrVGszbmdWUjBTUytyR0NtSUc2N3VyeTNiaHYrYnZ4Vi9BOHNWUUFnOCtnRFlBQUFBQUVsRlRrU3VRbUNDJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1Y2tVcmw7XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0TWlsZXNUb0ZlZXQobWlsZXMpIHtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKG1pbGVzICogNTI4MCk7XHJcbiAgfVxyXG5cclxuICBwdXNoTmV3VHJ1Y2sobWFwcywgdHJ1Y2tJdGVtKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgIHZhciBjdXJyZW50T2JqZWN0ID0gdGhpcztcclxuICAgIHZhciBwaW5Mb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0cnVja0l0ZW0ubGF0LCB0cnVja0l0ZW0ubG9uZyk7XHJcbiAgICB2YXIgZGVzdExvYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0cnVja0l0ZW0ud3JMYXQsIHRydWNrSXRlbS53ckxvbmcpO1xyXG4gICAgdmFyIGljb25Vcmw7XHJcbiAgICB2YXIgaW5mb0JveFRydWNrVXJsO1xyXG4gICAgdmFyIE5ld1BpbjtcclxuICAgIHZhciBqb2JJZFVybCA9ICcnO1xyXG5cclxuICAgIHZhciB0cnVja0NvbG9yID0gdHJ1Y2tJdGVtLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpY29uVXJsID0gdGhpcy5nZXRJY29uVXJsKHRydWNrQ29sb3IsIHRydWNrSXRlbS5sYXQsIHRydWNrSXRlbS5sb25nLCB0cnVja0l0ZW0ud3JMYXQsIHRydWNrSXRlbS53ckxvbmcpO1xyXG5cclxuICAgIGlmICh0cnVja0NvbG9yID09ICdncmVlbicpIHtcclxuICAgICAgaW5mb0JveFRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRWdBQUFBckNBWUFBQURiamM2ekFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFGR21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TlMwd01WUXhOam94TVRveE1DMHdORG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNakF0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1qQXRNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1Rka1pqRTBZbVF0TkRCaE9DMDFORFJqTFRrek9UQXRNMlJpTm1aa1lUWm1NbUpsSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZNR0ZrTTJJeVpESXRPREJoTmkweE1EUmtMVGhpTnpRdFpqVmhaREZtTVRobFl6RXlJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPVGRrWmpFMFltUXROREJoT0MwMU5EUmpMVGt6T1RBdE0yUmlObVprWVRabU1tSmxJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNU4yUm1NVFJpWkMwME1HRTRMVFUwTkdNdE9UTTVNQzB6WkdJMlptUmhObVl5WW1VaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1EVXRNREZVTVRZNk1URTZNVEF0TURRNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCtPZHVLM1FBQUF3OUpSRUZVYU43dG1qMVBHMEVRaHU4bnVLZWhESjBybE5KU0pHcEhwQ1d5bERZRjZhQUJWNlFpUVFLbFNSUk1GU1VGcHFOQm1Bb0VCYVFncERUaVE1UUdtcFNiZTlGdE5CbjJ6bnQzTzhkOWVLU1JiVGp0dnZmYzdzemM3bnFla0NtbDJxcllkdUo3VFFwT1EvZHkvK2RlZlRuWVVNdTl0ZHc3ZEVJdnNhNFVvQzNkdzlTbmwycHM0VmxoSEhxcEpRVlE5LzJqN3ozZkIyRmo5TmZONzBMQjBYN1FQMG9HS0FEVHM1M0U2S2d5Z1B4ckZ6a0F6RmMwUmgyanBuS0EvT3ZXK2NoNDgrMnRzZkZYNjYrckJZakRXZHgrSDlsNHBRQnhPTys2ODBNYnJ3eWdKSEFxQXlncG5Fb0FTZ09uOUlEU3dpazFJUC83U2xvNHBRWGtmelpkd0Nrem9MNExPS1VFUkVmUGo1TnU2c2JMQ0tpamZ6ei84R0lFeUFBSUsyZnFjbkR0cFBFeUFuSjZNeU5BUXh6VGxKcUxhWnVsVHl4TnFqdXk3T3BKUEcyNkpuUXh1Rkt6bTNOcSt1dE03aDA2b2ZlL0pWY0pRSFNhRmR4bVBhbDRnWHFLN1JBVXpiWjBrU2dXVURHZnNjQ0crb292emViUm1iWEZBUlhOUjRDeUJJVHBveU0vUHZPMFFZalNnbXF6TFRXY0FFSm4zNDgzalZFTktYSjVkL1hKd0dDbjVaU1VHTlQyKzRjUDJWVVVFRExUblVWbWdraU1zQ3poaEQwMGJwLzNOMlFBNGVud2JXVmtLRHdWT04vNHp4SVNoNE43MGRxZ0cxbVVhc1AxVGdIeDhqdHNid3pYMFNyYXhmS0p6YWkyV2V4RGFLRGFUTlB0VVpGb0N3aEhRMnczRGdFSkt3Tlp2WXZSVjRNNDJrN1p3UXBEOWQvUWdQYUczWXdXWWJza1FxZmpNTkd1anFyWWFxTWpqdDR2UWdTemNRMm9wZit5ZmJiektHN2d0elkwRXJlbWtLeXY2TWkyMVVidlI1OHY0R2VDTUdqNGRzOVAvUi9FR2tSNnBHczREWUFRWkN0ZXh5eWQraVVjcVR1Sk5wcjZRN0pmblFPcVVVaGhsbVFFWldWSkFJVllLMnk3dVJZY3ZMeU5xbS95dXR4aHE0MlhLL1R0L1Y5Z3RqeUVTYjBUWjF1SUR2MGdDVFFFdlIyVnVybXpTdnM4YUtPVzlsRG1PSTFSVVVJTWM3cnVDVnR3b3cvYW90NEpEZHBhWXVlZTBSbGVCSkVWSU1xMFhPbFVRTFMyWmdKdEhRa2hLekhDUXR2TDBHaTVZbUVkNmFkMUh0SDVubld3YzYrdFRndGZnMEYzTTA2YmZ3RzRUdjhYeStoUGFBQUFBQUJKUlU1RXJrSmdnZz09JztcclxuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAncmVkJykge1xyXG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUZFbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdOUzB3TVZReE5qb3hNVG95TVMwd05Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNak10TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNak10TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNlpqQTFZMlZtTkRjdE0yTmpZaTAzWWpRMkxXSTFaalF0TjJJNU1EQXdNamcxTWpsbElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09tWXdOV05sWmpRM0xUTmpZMkl0TjJJME5pMWlOV1kwTFRkaU9UQXdNREk0TlRJNVpTSWdlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09tWXdOV05sWmpRM0xUTmpZMkl0TjJJME5pMWlOV1kwTFRkaU9UQXdNREk0TlRJNVpTSStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WmpBMVkyVm1ORGN0TTJOallpMDNZalEyTFdJMVpqUXROMkk1TURBd01qZzFNamxsSWlCemRFVjJkRHAzYUdWdVBTSXlNREU0TFRBMUxUQXhWREUyT2pFeE9qSXhMVEEwT2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BwS3BjS2NBQUFMNFNVUkJWR2plN1pyTlNqTXhGSWJuRXVZU3VuYlZuVnMzN3NVYmNHNUE2Tlp1bktVN1hlamE2ZzIwRjFDdzYyNFVRU3dJL2tCRkVJcEZRUkNFbUxjMGNucWNURE16eVRnL1BYQSs5V05JM2p4SlRrNStQTStCQ1NGQ1VXNjdsTzU3anVCc3FGcSszOS9GNi9tNWVEazVLYnhESi9RUzY3b0MxRk0xakxhM3hlWGFXbWtjZXBrMTBnQm9TaitVZmlIOVRUZEdQMGVqVXNGUi9qRWMwbWFFU2NGY21FNWlWRlFiUVBMRGZRNEE4eFdGVWNlb3FSMGcrZEVwSHhuM3U3dVJoZDhGUWIwQWNUampnNFBZd21zRmlNTjVhcmVYRmw0YlFHbmcxQVpRV2ppMUFKUUZUdVVCWllWVGFVRHlsNk9zY0NvTFNQNnpaUU5PbFFFOTJJQlRaVUF6bS9SNm1RdXZOS0NiemMwVklCMmdyK2RuSzRWWEZwQ3R4cXdBTFhGTVUybzJwbTJlZnIyK3pvOWRXNTd0M3FablFsL2pzWGphMnhOM096dUZkK2lFWG1hK2RVQjBtcFhjV2lxTHRoNHZrRSt4b1ZvMjY5RTltSk9BaXZtTUF6YmtWL3hvdG9qT0xIUU9xR3krQXBRbklFd2ZGZm54czBnWGhFZ3RxRGJUVk1NS0lGUTI2WFlqb3hxV3lKZmo0MzhEZzV1V3o5dGI3UjBkVmxlbmdFeFhKb2pFQ01zVGpxN1R1TDJlbmJrQmhON2gxOHBZb2RBcmNIN3hueWNrRGdkdFVkcWdHNnNvMVlidnJRTGk2YmZ1Ymd6ZjBTemF4dkdKeWFnMk9leERhS0Rhb3FaYlpKSm9BZ2hQUTB3dkRnRUpKd041N2NYbzFpQ0pOb3p3SmRuL3hnS2d1TVlvRWFaSEluUTZMaE50NjZtS3FUWTY0bWg3RVNLMHoxN1UvMHo3L1Q5eEEzLy9CamhaU05LY3dtVitSVWUycVRiYUh2VytJT0pOMElEZmhWMHR2QWlUa1I3TE5ad0dRQWd5RmE5aWxscjZYVGpkSGlUUlJqdFBzL28xT1NDZlF0SXVrU2xHVUY2V0JwREdBdDFkdkQ5L2VEbU55MitLZXR4aHFvMm5LM1QzdmhDWURSNWhVdThrdVJaaU8rTkJSSGsyUFl4YnV2OGM1aTFtMm8vek12eXNqekliTkViRkNZbVkwMDNQc2MwYk90TVd0eWVNMEJZNGUvZU15ckFSeEtvQVVacmp5c0RMd2ZqTnNLRzJqZ3NoUnduQ1F1amxhT2lNQk5vNnJudnJNYWJ5Z1hHd3M2K3RPYTlmWjlDOWxiVGNIeEhCeEI3SjZlVFZBQUFBQUVsRlRrU3VRbUNDJztcclxuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAneWVsbG93Jykge1xyXG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFzQ0FZQUFBREdpUDRMQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUZFbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdOUzB3TVZReE5qb3hNVG93Tmkwd05Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNVGt0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNVGt0TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9UQXlOREU0WTJFdE5UTXpOQzA0TmpSakxXRmhObUV0WVRKbE5EazJZbVUxWW1FNElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09qa3dNalF4T0dOaExUVXpNelF0T0RZMFl5MWhZVFpoTFdFeVpUUTVObUpsTldKaE9DSWdlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09qa3dNalF4T0dOaExUVXpNelF0T0RZMFl5MWhZVFpoTFdFeVpUUTVObUpsTldKaE9DSStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RBeU5ERTRZMkV0TlRNek5DMDROalJqTFdGaE5tRXRZVEpsTkRrMlltVTFZbUU0SWlCemRFVjJkRHAzYUdWdVBTSXlNREU0TFRBMUxUQXhWREUyT2pFeE9qQTJMVEEwT2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BuS2JJNVlBQUFNSlNVUkJWR2plN1pxOVNzUkFFSUR2RVN4OEFNRVhPSHdCN3duVUo1QjdBQVY3QzYvVlJrdXR2TTVTUVFRYk9RVzFzZkJBTFN6ODRSb2J3YlBRUXN5dE0yczJUamFiWlBPemEzNXVZRkJRc3BNdnN6T3pzOU5vV0JERzJBVG9iQW0wMmJBcHNPQUM2Qk1ybDd5QnJ1RkhOUTJudzhvdDE4WWd3WU5iM2pKZjc4eDUzR0hPL1VieEZleEVlNG5zbXdKMElGWnd6bHJzKzNDeU5JcjJVa2tMb0FtNkNkcHo5NnhTUnUrM3BZSWpkUFI2a1E2UUM2YW51NGx4b2RvQWNpTzdYMkMvNHNOOENsNVRPMER3Zjd1eVp6aFhpK285ZkRsZkwwQUJPSGVyMFVHdVRvQUNjUHJMOFZtZ0xvRFN3S2tOb0xSd2FnRW9DNXpLQThvS3A5S0E0UGV0ckhBcUM4aHRTMlNHVTJWQVQzbkFxU1FnNmoyandWNzIwM0FGQVhXOTFzVEp6QmlRQXRBMS8rMXprRTgvcFlLQWNuMlpNYUE0UUxCTnFlU3hiYTNxOFRSalgwTnpnUGdYSUQwaDlqRmdUbjhKUEd1dStBcDJvcjIrbHFzSlFIU2JsVnhXR3FiaUJkWlQwZzFCMmVSQUZJbm1BaXJzWjJ5d1lYMFZhTTBXVUNYcG1BZFVNaDBEc2dvSXRvK0kvUHhuZ1M0SXNiVHcyYVpaYXVRQ0NCZkRtS0lVU0pHaisvWC9BM08xQ0NYR1RjZ2QzVG5QcmtZQi9XYW1ZZnlGSVJpSkhtYTErZzM3YUpJNEQ5dG1BT0hYa2ErVk1VUGhWK0VxWGZ6YmhDVEQ0VmxKMklaZWhYK250b1YwTGRJRGtzcnYwTHN4VE92MFpqV0g5b21XVjJzMCszaG9JTGFwdGx1Z1NOUUZoS01odWhlSEhPYm53TnBaakI0Tmt0akdQVHk2K204SlFLZHhMK01ab2RrU29kc3gxdWk4UmxVMGJhTWVSOStYaHdpL1RBbEFiZTlsWG82Q2NRT3Bpd2ZDUTVMV0ZDYnJLK3JaMnJiUjkzSG5DK1NaSUhRYSticW4vemV4TWVTUkh0TTFWeElBMFNCdFFDSm11YW5maUVMcVRtVWJTZjBoMmErcG1rTHR4NmJJRkI1a1M5SUFDcEYyMUtndURsNE9JK3ViZ3JZN3RHMlR5aFY2ZXZjQ3MrWVFKdFZ1a21zaDZ2cHVFbWdaMUU1VTZnNDI4M3lWOXJQN2pJbXNRNWxUdmhnVllZaGlUemN0ekdNL2U3WkZuQWtWdHJXTnpUM2pZbmdRNUlkV01FclZyc3pWZ1BpQjlhUzJkVTBZc3BVZ0xIUXNUL1czRTlpbURlY0hSanhTbUsrYnFmd0FBQUFBU1VWT1JLNUNZSUk9JztcclxuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAncHVycGxlJykge1xyXG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUd0bWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdNeTB3TTFReE1Ub3pNVG93TkMwd05Ub3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZORGt0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZORGt0TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1Ea3dZVEF3WlRZdE9UTm1aaTFrWWpRMUxXSXhNakV0TTJJMU16Qm1OMll5WlRRd0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2TlRKa01XUXdNRGd0WVdNeE15MDNNRFE1TFRsbU9HTXRPVGhpTlRjeFpESXpZakkwSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2WXpJME9UZzBNR1V0TW1Ka01TMWtaRFF4TFRnMFkySXRNV1EwWWpSak56VmtNRGt4SWo0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGpNalE1T0RRd1pTMHlZbVF4TFdSa05ERXRPRFJqWWkweFpEUmlOR00zTldRd09URWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TUROVU1URTZNekU2TURRdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pKbU16azNNakU0TFRsbU1EVXRaVGMwTUMxaVkyWTVMVE5pTW1Wak16azVNRFEzTWlJZ2MzUkZkblE2ZDJobGJqMGlNakF4T0Mwd015MHdNMVF4TVRvek9Ub3dPQzB3TlRvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZNRGt3WVRBd1pUWXRPVE5tWmkxa1lqUTFMV0l4TWpFdE0ySTFNekJtTjJZeVpUUXdJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakUxT2pRNUxUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUGdZb0k0b0FBQUw5U1VSQlZHamU3WnE3VGh0QkZJYjNFZndJUElJZmdUZkFOWldyMU82RGhMdVVRQnNweW5aV2luQUxEVWhnRjBna1VpUWloMlliMWtVb2tKQ01FQVZVeS83SUE4ZkhzN3V6dTNNMmUvR1JqbnpSYXViZmIyYk9uTGs0anBBRlFkQVBxbTJYb2JlazRLeXFXcDRlbjRQeG9SZjhIbHlWM3FFVGVvbnRTUUhhVnpWODd4MEhuOWUrVmNhaGwxcFdBTzNRdDBJZmhqNk42cU4zL3JSU2NKVGYvTDNOQm1nR1ptZzZpRkZSWXdDRnoyNXlBQml2S0l3NmVrM2pBSVhQZmVVOTQrVFR1YmJ3bzQxaHN3QnhPQmRmTG1NTGJ4UWdEbWUwOHl1eDhNWUF5Z0tuTVlDeXdta0VvRHh3YWc4b0w1eGFBd3EvYitlRlUxdEE0V2ZIQnB3NkEvSnR3S2tsSU5wN3ZETS9kK0YxQk9TcUg0TVBSMHRBR2tEWU9Rc2ViaCt0RkY1SFFGWmZaZ2tvd1RGTXFka1l0a1c2dTc0N3QrM3FTTFEyM1JQQzBNWE0rT1BqV2VrZE9xRjNic3RWQWhBZFpoVzNuaU1WTDlBYTdJU2dhcmF2a2tTeGdJcnhqQTAyNUZkOGE3YU16cXd2RHFocXZnUlVKQ0FNSHhYNThWbW1BMEtrRmxTYmFhcGhCUkFxODA1OWJWVERGSWtqM1A4RkJpY3RkOWZUeURNNnpLNmlnRXhuSm9oRUR5c1NUbFNqY1JzZmVES0EwRHI4V0JrekZGb0Z6Zy8raTRURTRlQmRsRGJveGl4S3RlRjVxNEI0K2gxMU5vYm5hQlp0WS92RXBGZWJiUFloTkZCdHV1RzJrQ1NhQWtKY01UMDRCQ1Nhcmt1dnhXaGRhYlNoaHlkay82c0swQ2pwWlZTaHBsc2lkRGdtaWJaMVZjVlVHKzF4OUgwUklwaXRLRUJkOVkvLzg5OUMzTUR2dHdCMzZLWE9LU1R6SzlxelRiWFI5MUgzQy9pZElIUWFmdHp6Wis1RzJNSDdqVEFhQU5OTTRTcG1xYWxmd3VueUlJMDIybmdSczErYkEycFJTSkZUWklZZVZKUmxBUlJoM2FqajV0YnM0dVY5WEg1VDF1ME9VMjA4WGFHcjk3ZkFiSGdKazdxYjVsaUlyWXhIbXZKc2VqOXU2bDdZekp2UHRDZXpNbHA1TDJXdTBCZ1ZKMFF6cHR1T3NNMWU5RlZiM0pwUW82MHJkdThabFdFaGlGa0JvblRibFZZRnhHdnJaTkRtU2dqWlRoRVcrazZCUnRNVkEzT2xXMnNTVS9uSU9OaloxOWFtaWEvR29MdVRwc3dYb2FUd3NuS0FrZEVBQUFBQVNVVk9SSzVDWUlJPSc7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGZlZXRmb3JNaWxlcyA9IDAuMDAwMTg5Mzk0O1xyXG4gICAgdmFyIG1pZWxzVG9kaXNwYXRjaCA9IHBhcnNlRmxvYXQodHJ1Y2tJdGVtLmRpc3QpLnRvRml4ZWQoMik7XHJcblxyXG4gICAgdGhpcy5yZXN1bHRzLnB1c2goe1xyXG4gICAgICBkaXNwbGF5OiB0cnVja0l0ZW0udHJ1Y2tJZCArIFwiIDogXCIgKyB0cnVja0l0ZW0udGVjaElELFxyXG4gICAgICB2YWx1ZTogMSxcclxuICAgICAgTGF0aXR1ZGU6IHRydWNrSXRlbS5sYXQsXHJcbiAgICAgIExvbmdpdHVkZTogdHJ1Y2tJdGVtLmxvbmdcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciB0cnVja1VybCA9IHRoaXMuZ2V0VHJ1Y2tVcmwodHJ1Y2tDb2xvcik7XHJcbiAgICBjb25zdCBsaXN0T2ZQdXNoUGlucyA9IG1hcHMuZW50aXRpZXM7XHJcbiAgICB2YXIgaXNOZXdUcnVjayA9IHRydWU7XHJcblxyXG4gICAgdmFyIG1ldGFkYXRhID0ge1xyXG4gICAgICB0cnVja0lkOiB0cnVja0l0ZW0udHJ1Y2tJZCxcclxuICAgICAgQVRUVUlEOiB0cnVja0l0ZW0udGVjaElELFxyXG4gICAgICB0cnVja1N0YXR1czogdHJ1Y2tJdGVtLnRydWNrQ29sLFxyXG4gICAgICB0cnVja0NvbDogdHJ1Y2tJdGVtLnRydWNrQ29sLFxyXG4gICAgICBqb2JUeXBlOiB0cnVja0l0ZW0uam9iVHlwZSxcclxuICAgICAgV1JKb2JUeXBlOiB0cnVja0l0ZW0ud29ya1R5cGUsXHJcbiAgICAgIFdSU3RhdHVzOiB0cnVja0l0ZW0ud3JTdGF0LFxyXG4gICAgICBBc3NpbmdlZFdSSUQ6IHRydWNrSXRlbS53cklELFxyXG4gICAgICBTcGVlZDogdHJ1Y2tJdGVtLnNwZWVkLFxyXG4gICAgICBEaXN0YW5jZTogbWllbHNUb2Rpc3BhdGNoLFxyXG4gICAgICBDdXJyZW50SWRsZVRpbWU6IHRydWNrSXRlbS5pZGxlVGltZSxcclxuICAgICAgRVRBOiB0cnVja0l0ZW0udG90SWRsZVRpbWUsXHJcbiAgICAgIEVtYWlsOiAnJywvLyB0cnVja0l0ZW0uRW1haWwsXHJcbiAgICAgIE1vYmlsZTogJycsIC8vIHRydWNrSXRlbS5Nb2JpbGUsXHJcbiAgICAgIGljb246IGljb25VcmwsXHJcbiAgICAgIGljb25JbmZvOiBpbmZvQm94VHJ1Y2tVcmwsXHJcbiAgICAgIEN1cnJlbnRMYXQ6IHRydWNrSXRlbS5sYXQsXHJcbiAgICAgIEN1cnJlbnRMb25nOiB0cnVja0l0ZW0ubG9uZyxcclxuICAgICAgV1JMYXQ6IHRydWNrSXRlbS53ckxhdCxcclxuICAgICAgV1JMb25nOiB0cnVja0l0ZW0ud3JMb25nLFxyXG4gICAgICB0ZWNoSWRzOiB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLFxyXG4gICAgICBqb2JJZDogdHJ1Y2tJdGVtLmpvYklkLFxyXG4gICAgICBtYW5hZ2VySWRzOiB0aGlzLm1hbmFnZXJJZHMsXHJcbiAgICAgIHdvcmtBZGRyZXNzOiB0cnVja0l0ZW0ud29ya0FkZHJlc3MsXHJcbiAgICAgIHNiY1ZpbjogdHJ1Y2tJdGVtLnNiY1ZpbixcclxuICAgICAgY3VzdG9tZXJOYW1lOiB0cnVja0l0ZW0uY3VzdG9tZXJOYW1lLFxyXG4gICAgICB0ZWNobmljaWFuTmFtZTogdHJ1Y2tJdGVtLnRlY2huaWNpYW5OYW1lLFxyXG4gICAgICBkaXNwYXRjaFRpbWU6IHRydWNrSXRlbS5kaXNwYXRjaFRpbWUsXHJcbiAgICAgIHJlZ2lvbjogdHJ1Y2tJdGVtLnpvbmVcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGpvYklkU3RyaW5nID0gJ2h0dHA6Ly9lZGdlLWVkdC5pdC5hdHQuY29tL2NnaS1iaW4vZWR0X2pvYmluZm8uY2dpPyc7XHJcblxyXG4gICAgbGV0IHpvbmUgPSB0cnVja0l0ZW0uem9uZTtcclxuXHJcbiAgICAvLyA9IE0gZm9yIE1XXHJcbiAgICAvLyA9IFcgZm9yIFdlc3RcclxuICAgIC8vID0gQiBmb3IgU0VcclxuICAgIC8vID0gUyBmb3IgU1dcclxuICAgIGlmICh6b25lICE9IG51bGwgJiYgem9uZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgaWYgKHpvbmUgPT09ICdNVycpIHtcclxuICAgICAgICB6b25lID0gJ00nO1xyXG4gICAgICB9IGVsc2UgaWYgKHpvbmUgPT09ICdTRScpIHtcclxuICAgICAgICB6b25lID0gJ0InXHJcbiAgICAgIH0gZWxzZSBpZiAoem9uZSA9PT0gJ1NXJykge1xyXG4gICAgICAgIHpvbmUgPSAnUydcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgem9uZSA9ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIGpvYklkU3RyaW5nID0gam9iSWRTdHJpbmcgKyAnZWR0X3JlZ2lvbj0nICsgem9uZSArICcmd3JpZD0nICsgdHJ1Y2tJdGVtLndySUQ7XHJcblxyXG4gICAgdHJ1Y2tJdGVtLmpvYklkID0gdHJ1Y2tJdGVtLmpvYklkID09IHVuZGVmaW5lZCB8fCB0cnVja0l0ZW0uam9iSWQgPT0gbnVsbCA/ICcnIDogdHJ1Y2tJdGVtLmpvYklkO1xyXG5cclxuICAgIGlmICh0cnVja0l0ZW0uam9iSWQgIT0gJycpIHtcclxuICAgICAgam9iSWRVcmwgPSAnPGEgaHJlZj1cIicgKyBqb2JJZFN0cmluZyArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIiB0aXRsZT1cIkNsaWNrIGhlcmUgdG8gc2VlIGFjdHVhbCBGb3JjZS9FZGdlIGpvYiBkYXRhXCI+JyArIHRydWNrSXRlbS5qb2JJZCArICc8L2E+JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSBudWxsICYmIHRydWNrSXRlbS5kaXNwYXRjaFRpbWUgIT0gdW5kZWZpbmVkICYmIHRydWNrSXRlbS5kaXNwYXRjaFRpbWUgIT0gJycpIHtcclxuICAgICAgbGV0IGRpc3BhdGNoRGF0ZSA9IHRydWNrSXRlbS5kaXNwYXRjaFRpbWUuc3BsaXQoJzonKTtcclxuICAgICAgbGV0IGR0ID0gZGlzcGF0Y2hEYXRlWzBdICsgJyAnICsgZGlzcGF0Y2hEYXRlWzFdICsgJzonICsgZGlzcGF0Y2hEYXRlWzJdICsgJzonICsgZGlzcGF0Y2hEYXRlWzNdO1xyXG4gICAgICBtZXRhZGF0YS5kaXNwYXRjaFRpbWUgPSB0aGF0LlVUQ1RvVGltZVpvbmUoZHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFVwZGF0ZSBpbiB0aGUgVHJ1Y2tXYXRjaExpc3Qgc2Vzc2lvblxyXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykgIT09IG51bGwpIHtcclxuICAgICAgdGhpcy50cnVja0xpc3QgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykpO1xyXG5cclxuICAgICAgaWYgKHRoaXMudHJ1Y2tMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICBpZiAodGhpcy50cnVja0xpc3Quc29tZSh4ID0+IHgudHJ1Y2tJZCA9PSB0cnVja0l0ZW0udHJ1Y2tJZCkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnRydWNrTGlzdC5maW5kKHggPT4geC50cnVja0lkID09IHRydWNrSXRlbS50cnVja0lkKTtcclxuICAgICAgICAgIGNvbnN0IGluZGV4OiBudW1iZXIgPSB0aGlzLnRydWNrTGlzdC5pbmRleE9mKGl0ZW0pO1xyXG4gICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpdGVtLkRpc3RhbmNlID0gbWV0YWRhdGEuRGlzdGFuY2U7XHJcbiAgICAgICAgICAgIGl0ZW0uaWNvbiA9IG1ldGFkYXRhLmljb247XHJcbiAgICAgICAgICAgIHRoaXMudHJ1Y2tMaXN0LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMudHJ1Y2tMaXN0LnNwbGljZShpbmRleCwgMCwgaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja1dhdGNoTGlzdCcsIHRoaXMudHJ1Y2tMaXN0KTtcclxuICAgICAgICAgICAgaXRlbSA9IG51bGw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXBkYXRlIGluIHRoZSBTZWxlY3RlZFRydWNrIHNlc3Npb25cclxuICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja0RldGFpbHMnKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcclxuICAgICAgc2VsZWN0ZWRUcnVjayA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tEZXRhaWxzJykpO1xyXG5cclxuICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrLnRydWNrSWQgPT0gdHJ1Y2tJdGVtLnRydWNrSWQpIHtcclxuICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ1RydWNrRGV0YWlscycpO1xyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrRGV0YWlscycsIG1ldGFkYXRhKTtcclxuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRydWNrSXRlbXMubGVuZ3RoID4gMCAmJiB0aGlzLnRydWNrSXRlbXMuc29tZSh4ID0+IHgudG9Mb3dlckNhc2UoKSA9PSB0cnVja0l0ZW0udHJ1Y2tJZC50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICBpc05ld1RydWNrID0gZmFsc2U7XHJcbiAgICAgIC8vIElmIGl0IGlzIG5vdCBhIG5ldyB0cnVjayB0aGVuIG1vdmUgdGhlIHRydWNrIHRvIG5ldyBsb2NhdGlvblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RPZlB1c2hQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcclxuICAgICAgICBpZiAobGlzdE9mUHVzaFBpbnMuZ2V0KGkpLm1ldGFkYXRhLnRydWNrSWQgPT09IHRydWNrSXRlbS50cnVja0lkKSB7XHJcbiAgICAgICAgICB2YXIgY3VyUHVzaFBpbiA9IGxpc3RPZlB1c2hQaW5zLmdldChpKTtcclxuICAgICAgICAgIGN1clB1c2hQaW4ubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgICAgICAgIGRlc3RMb2MgPSBwaW5Mb2NhdGlvbjtcclxuICAgICAgICAgIHBpbkxvY2F0aW9uID0gbGlzdE9mUHVzaFBpbnMuZ2V0KGkpLmdldExvY2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgbGV0IHRydWNrSWRSYW5JZCA9IHRydWNrSXRlbS50cnVja0lkICsgJ18nICsgTWF0aC5yYW5kb20oKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5pbmRleE9mKHRydWNrSXRlbS50cnVja0lkKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25UcnVja0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5wdXNoKHRydWNrSWRSYW5JZCk7XHJcblxyXG4gICAgICAgICAgdGhpcy5sb2FkRGlyZWN0aW9ucyh0aGlzLCBwaW5Mb2NhdGlvbiwgZGVzdExvYywgaSwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50cnVja0l0ZW1zLnB1c2godHJ1Y2tJdGVtLnRydWNrSWQpO1xyXG4gICAgICBOZXdQaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihwaW5Mb2NhdGlvbiwgeyBpY29uOiB0cnVja1VybCB9KTtcclxuXHJcbiAgICAgIE5ld1Bpbi5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG4gICAgICB0aGlzLm1hcC5lbnRpdGllcy5wdXNoKE5ld1Bpbik7XHJcblxyXG4gICAgICB0aGlzLmRhdGFMYXllci5wdXNoKE5ld1Bpbik7XHJcbiAgICAgIGlmICh0aGlzLmlzTWFwTG9hZGVkKSB7XHJcbiAgICAgICAgdGhpcy5pc01hcExvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubWFwLnNldFZpZXcoeyBjZW50ZXI6IHBpbkxvY2F0aW9uLCB6b29tOiB0aGlzLmxhc3Rab29tTGV2ZWwgfSk7XHJcbiAgICAgICAgdGhhdC5sYXN0Wm9vbUxldmVsID0gdGhpcy5tYXAuZ2V0Wm9vbSgpO1xyXG4gICAgICAgIHRoYXQubGFzdExvY2F0aW9uID0gdGhpcy5tYXAuZ2V0Q2VudGVyKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ21vdXNlb3V0JywgKGUpID0+IHtcclxuICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7IHZpc2libGU6IGZhbHNlIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDEwMjQpIHtcclxuICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihOZXdQaW4sICdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgICAgICAgIHNob3dQb2ludGVyOiB0cnVlLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCAyMCksXHJcbiAgICAgICAgICAgIGh0bWxDb250ZW50OiAnPGRpdiBjbGFzcyA9IFwiaW5meSBpbmZ5TWFwcG9wdXBcIj4nXHJcbiAgICAgICAgICAgICAgKyBnZXRJbmZvQm94SFRNTChlLnRhcmdldC5tZXRhZGF0YSwgdGhpcy50aHJlc2hvbGRWYWx1ZSwgam9iSWRVcmwpICsgJzwvZGl2PidcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRoaXMudHJ1Y2tXYXRjaExpc3QgPSBbeyBUcnVja0lkOiBlLnRhcmdldC5tZXRhZGF0YS50cnVja0lkLCBEaXN0YW5jZTogZS50YXJnZXQubWV0YWRhdGEuRGlzdGFuY2UgfV07XHJcblxyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snLCBlLnRhcmdldC5tZXRhZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tEZXRhaWxzJywgZS50YXJnZXQubWV0YWRhdGEpO1xyXG5cclxuICAgICAgICAgIC8vIEEgYnVmZmVyIGxpbWl0IHRvIHVzZSB0byBzcGVjaWZ5IHRoZSBpbmZvYm94IG11c3QgYmUgYXdheSBmcm9tIHRoZSBlZGdlcyBvZiB0aGUgbWFwLlxyXG5cclxuICAgICAgICAgIHZhciBidWZmZXIgPSAzMDtcclxuICAgICAgICAgIHZhciBpbmZvYm94T2Zmc2V0ID0gdGhhdC5pbmZvYm94LmdldE9mZnNldCgpO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hBbmNob3IgPSB0aGF0LmluZm9ib3guZ2V0QW5jaG9yKCk7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveExvY2F0aW9uID0gbWFwcy50cnlMb2NhdGlvblRvUGl4ZWwoZS50YXJnZXQuZ2V0TG9jYXRpb24oKSwgTWljcm9zb2Z0Lk1hcHMuUGl4ZWxSZWZlcmVuY2UuY29udHJvbCk7XHJcbiAgICAgICAgICB2YXIgZHggPSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hPZmZzZXQueCAtIGluZm9ib3hBbmNob3IueDtcclxuICAgICAgICAgIHZhciBkeSA9IGluZm9ib3hMb2NhdGlvbi55IC0gMjUgLSBpbmZvYm94QW5jaG9yLnk7XHJcblxyXG4gICAgICAgICAgaWYgKGR5IDwgYnVmZmVyKSB7IC8vIEluZm9ib3ggb3ZlcmxhcHMgd2l0aCB0b3Agb2YgbWFwLlxyXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXHJcbiAgICAgICAgICAgIGR5ICo9IC0xO1xyXG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBidWZmZXIgZnJvbSB0aGUgdG9wIGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgZHkgKz0gYnVmZmVyO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeSBpcyBncmVhdGVyIHRoYW4gemVybyB0aGFuIGl0IGRvZXMgbm90IG92ZXJsYXAuXHJcbiAgICAgICAgICAgIGR5ID0gMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoZHggPCBidWZmZXIpIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggbGVmdCBzaWRlIG9mIG1hcC5cclxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxyXG4gICAgICAgICAgICBkeCAqPSAtMTtcclxuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgbGVmdCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgIGR4ICs9IGJ1ZmZlcjtcclxuICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIHJpZ2h0IHNpZGUgb2YgbWFwLlxyXG4gICAgICAgICAgICBkeCA9IG1hcHMuZ2V0V2lkdGgoKSAtIGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveEFuY2hvci54IC0gdGhhdC5pbmZvYm94LmdldFdpZHRoKCk7XHJcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHggaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhlbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxyXG4gICAgICAgICAgICBpZiAoZHggPiBidWZmZXIpIHtcclxuICAgICAgICAgICAgICBkeCA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICAgIGR4IC09IGJ1ZmZlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vICMjIyMgQWRqdXN0IHRoZSBtYXAgc28gaW5mb2JveCBpcyBpbiB2aWV3XHJcbiAgICAgICAgICBpZiAoZHggIT0gMCB8fCBkeSAhPSAwKSB7XHJcbiAgICAgICAgICAgIG1hcHMuc2V0Vmlldyh7XHJcbiAgICAgICAgICAgICAgY2VudGVyT2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoZHgsIGR5KSxcclxuICAgICAgICAgICAgICBjZW50ZXI6IG1hcHMuZ2V0Q2VudGVyKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcclxuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGlzLm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XHJcblxyXG4gICAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcclxuICAgICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5pbmZvYm94LCAnY2xpY2snLCB2aWV3VHJ1Y2tEZXRhaWxzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihOZXdQaW4sICdtb3VzZW92ZXInLCAoZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5pbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAgICAgICBzaG93UG9pbnRlcjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9jYXRpb246IGUudGFyZ2V0LmdldExvY2F0aW9uKCksXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgb2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMCwgMjApLFxyXG4gICAgICAgICAgICBodG1sQ29udGVudDogJzxkaXYgY2xhc3MgPSBcImluZnkgaW5meU1hcHBvcHVwXCI+J1xyXG4gICAgICAgICAgICAgICsgZ2V0SW5mb0JveEhUTUwoZS50YXJnZXQubWV0YWRhdGEsIHRoaXMudGhyZXNob2xkVmFsdWUsIGpvYklkVXJsKSArICc8L2Rpdj4nXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLnRydWNrV2F0Y2hMaXN0ID0gW3sgVHJ1Y2tJZDogZS50YXJnZXQubWV0YWRhdGEudHJ1Y2tJZCwgRGlzdGFuY2U6IGUudGFyZ2V0Lm1ldGFkYXRhLkRpc3RhbmNlIH1dO1xyXG5cclxuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJywgZS50YXJnZXQubWV0YWRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrRGV0YWlscycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcclxuXHJcbiAgICAgICAgICAvLyBBIGJ1ZmZlciBsaW1pdCB0byB1c2UgdG8gc3BlY2lmeSB0aGUgaW5mb2JveCBtdXN0IGJlIGF3YXkgZnJvbSB0aGUgZWRnZXMgb2YgdGhlIG1hcC5cclxuXHJcbiAgICAgICAgICB2YXIgYnVmZmVyID0gMzA7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveE9mZnNldCA9IHRoYXQuaW5mb2JveC5nZXRPZmZzZXQoKTtcclxuICAgICAgICAgIHZhciBpbmZvYm94QW5jaG9yID0gdGhhdC5pbmZvYm94LmdldEFuY2hvcigpO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hMb2NhdGlvbiA9IG1hcHMudHJ5TG9jYXRpb25Ub1BpeGVsKGUudGFyZ2V0LmdldExvY2F0aW9uKCksIE1pY3Jvc29mdC5NYXBzLlBpeGVsUmVmZXJlbmNlLmNvbnRyb2wpO1xyXG4gICAgICAgICAgdmFyIGR4ID0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94T2Zmc2V0LnggLSBpbmZvYm94QW5jaG9yLng7XHJcbiAgICAgICAgICB2YXIgZHkgPSBpbmZvYm94TG9jYXRpb24ueSAtIDI1IC0gaW5mb2JveEFuY2hvci55O1xyXG5cclxuICAgICAgICAgIGlmIChkeSA8IGJ1ZmZlcikgeyAvLyBJbmZvYm94IG92ZXJsYXBzIHdpdGggdG9wIG9mIG1hcC5cclxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxyXG4gICAgICAgICAgICBkeSAqPSAtMTtcclxuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYnVmZmVyIGZyb20gdGhlIHRvcCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgIGR5ICs9IGJ1ZmZlcjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHkgaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhhbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxyXG4gICAgICAgICAgICBkeSA9IDA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGR4IDwgYnVmZmVyKSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIGxlZnQgc2lkZSBvZiBtYXAuXHJcbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cclxuICAgICAgICAgICAgZHggKj0gLTE7XHJcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIGxlZnQgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICBkeCArPSBidWZmZXI7XHJcbiAgICAgICAgICB9IGVsc2UgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCByaWdodCBzaWRlIG9mIG1hcC5cclxuICAgICAgICAgICAgZHggPSBtYXBzLmdldFdpZHRoKCkgLSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hBbmNob3IueCAtIHRoYXQuaW5mb2JveC5nZXRXaWR0aCgpO1xyXG4gICAgICAgICAgICAvLyAjIyMjIElmIGR4IGlzIGdyZWF0ZXIgdGhhbiB6ZXJvIHRoZW4gaXQgZG9lcyBub3Qgb3ZlcmxhcC5cclxuICAgICAgICAgICAgaWYgKGR4ID4gYnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgZHggPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgICBkeCAtPSBidWZmZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyAjIyMjIEFkanVzdCB0aGUgbWFwIHNvIGluZm9ib3ggaXMgaW4gdmlld1xyXG4gICAgICAgICAgaWYgKGR4ICE9IDAgfHwgZHkgIT0gMCkge1xyXG4gICAgICAgICAgICBtYXBzLnNldFZpZXcoe1xyXG4gICAgICAgICAgICAgIGNlbnRlck9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KGR4LCBkeSksXHJcbiAgICAgICAgICAgICAgY2VudGVyOiBtYXBzLmdldENlbnRlcigpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XHJcbiAgICAgICAgICBzZWxlY3RlZFRydWNrID0gdGhpcy5tYXBTZXJ2aWNlLnJldHJpZXZlRGF0YUZyb21TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycpO1xyXG5cclxuICAgICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXHJcbiAgICAgICAgICAgICAgeCA9PiB4LmF0dHVpZC50b0xvd2VyQ2FzZSgpID09IHNlbGVjdGVkVHJ1Y2suQVRUVUlELnRvTG93ZXJDYXNlKCkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhblBob25lID0gdGVjaG5pY2lhbkRldGFpbHMucGhvbmU7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMuaW5mb2JveCwgJ2NsaWNrJywgdmlld1RydWNrRGV0YWlscyk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihtYXBzLCAndmlld2NoYW5nZScsIG1hcFZpZXdDaGFuZ2VkKTtcclxuXHJcbiAgICAgIC8vIHRoaXMuQ2hhbmdlVHJ1Y2tEaXJlY3Rpb24odGhpcywgTmV3UGluLCBkZXN0TG9jLCB0cnVja1VybCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWFwVmlld0NoYW5nZWQoZSkge1xyXG4gICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSBtYXBzLmdldFpvb20oKTtcclxuICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSBtYXBzLmdldENlbnRlcigpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gbW91c2V3aGVlbENoYW5nZWQoZSkge1xyXG4gICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSBtYXBzLmdldFpvb20oKTtcclxuICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSBtYXBzLmdldENlbnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEluZm9Cb3hIVE1MKGRhdGE6IGFueSwgdFZhbHVlLCBqb2JJZCk6IFN0cmluZyB7XHJcblxyXG4gICAgICBpZiAoIWRhdGEuU3BlZWQpIHtcclxuICAgICAgICBkYXRhLlNwZWVkID0gMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNsYXNzTmFtZSA9IFwiXCI7XHJcbiAgICAgIHZhciBzdHlsZUxlZnQgPSBcIlwiO1xyXG4gICAgICB2YXIgcmVhc29uID0gJyc7XHJcbiAgICAgIGlmIChkYXRhLnRydWNrU3RhdHVzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChkYXRhLnRydWNrU3RhdHVzLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3JlZCcpIHtcclxuICAgICAgICAgIHJlYXNvbiA9IFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLXRvcDozcHg7Y29sb3I6cmVkOyc+UmVhc29uOiBDdW11bGF0aXZlIGlkbGUgdGltZSBpcyBiZXlvbmQgXCIgKyB0VmFsdWUgKyBcIiBtaW5zPC9kaXY+XCI7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLnRydWNrU3RhdHVzLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3B1cnBsZScpIHtcclxuICAgICAgICAgIHJlYXNvbiA9IFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLXRvcDozcHg7Y29sb3I6cHVycGxlOyc+UmVhc29uOiBUcnVjayBpcyBkcml2ZW4gZ3JlYXRlciB0aGFuIDc1IG0vaDwvZGl2PlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGluZm9ib3hEYXRhID0gJyc7XHJcblxyXG4gICAgICBkYXRhLmN1c3RvbWVyTmFtZSA9IGRhdGEuY3VzdG9tZXJOYW1lID09IHVuZGVmaW5lZCB8fCBkYXRhLmN1c3RvbWVyTmFtZSA9PSBudWxsID8gJycgOiBkYXRhLmN1c3RvbWVyTmFtZTtcclxuXHJcbiAgICAgIGRhdGEuZGlzcGF0Y2hUaW1lID0gZGF0YS5kaXNwYXRjaFRpbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEuZGlzcGF0Y2hUaW1lID09IG51bGwgPyAnJyA6IGRhdGEuZGlzcGF0Y2hUaW1lO1xyXG5cclxuICAgICAgZGF0YS5qb2JJZCA9IGRhdGEuam9iSWQgPT0gdW5kZWZpbmVkIHx8IGRhdGEuam9iSWQgPT0gbnVsbCA/ICcnIDogZGF0YS5qb2JJZDtcclxuXHJcbiAgICAgIGRhdGEud29ya0FkZHJlc3MgPSBkYXRhLndvcmtBZGRyZXNzID09IHVuZGVmaW5lZCB8fCBkYXRhLndvcmtBZGRyZXNzID09IG51bGwgPyAnJyA6IGRhdGEud29ya0FkZHJlc3M7XHJcblxyXG4gICAgICBkYXRhLnNiY1ZpbiA9IGRhdGEuc2JjVmluID09IHVuZGVmaW5lZCB8fCBkYXRhLnNiY1ZpbiA9PSBudWxsIHx8IGRhdGEuc2JjVmluID09ICcnID8gJycgOiBkYXRhLnNiY1ZpbjtcclxuXHJcbiAgICAgIGRhdGEudGVjaG5pY2lhbk5hbWUgPSBkYXRhLnRlY2huaWNpYW5OYW1lID09IHVuZGVmaW5lZCB8fCBkYXRhLnRlY2huaWNpYW5OYW1lID09IG51bGwgfHwgZGF0YS50ZWNobmljaWFuTmFtZSA9PSAnJyA/ICcnIDogZGF0YS50ZWNobmljaWFuTmFtZTtcclxuXHJcbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDEwMjQpIHtcclxuICAgICAgICBpbmZvYm94RGF0YSA9IFwiPGRpdiBjbGFzcz0ncG9wTW9kYWxDb250YWluZXInPjxkaXYgY2xhc3M9J3BvcE1vZGFsSGVhZGVyJz48aW1nIHNyYz0nXCIgKyBkYXRhLmljb25JbmZvICsgXCInID48YSBjbGFzcz0nZGV0YWlscycgdGl0bGU9J0NsaWNrIGhlcmUgdG8gc2VlIHRlY2huaWNpYW4gZGV0YWlscycgPlZpZXcgRGV0YWlsczwvYT48aSBjbGFzcz0nZmEgZmEtdGltZXMnIGFyaWEtaGlkZGVuPSd0cnVlJyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz48L2k+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8aHIvPjxkaXYgY2xhc3M9J3BvcE1vZGFsQm9keSc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5WZWhpY2xlIE51bWJlciA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLnNiY1ZpbiArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5WVFMgVW5pdCBJRCA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLnRydWNrSWQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Sm9iIFR5cGUgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5qb2JUeXBlICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkpvYiBJZCA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBqb2JJZCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5BVFRVSUQgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5BVFRVSUQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+VGVjaG5pY2lhbiBOYW1lIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEudGVjaG5pY2lhbk5hbWUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Q3VzdG9tZXIgTmFtZSA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmN1c3RvbWVyTmFtZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5EaXNwYXRjaCBUaW1lOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5kaXNwYXRjaFRpbWUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC0xMic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wtMTIgY29sLXNtLTEyIGNvbC1mb3JtLWxhYmVsJz5Kb2IgQWRkcmVzcyA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wtMTIgY29sLXNtLTEyJz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwgY29sLWZvcm0tbGFiZWwtZnVsbCc+XCIgKyBkYXRhLndvcmtBZGRyZXNzICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3JvdyBtZXRlckNhbCc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyBkYXRhLlNwZWVkICsgXCI8L3N0cm9uZz4gbXBoIDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPlNwZWVkPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLTEyIGNvbC1tZC00Jz48c3Ryb25nPlwiICsgZGF0YS5FVEEgKyBcIjwvc3Ryb25nPiBNaW5zIDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkN1bXVsYXRpdmUgSWRsZSBNaW51dGVzPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLTEyIGNvbC1tZC00Jz48c3Ryb25nPlwiICsgdGhhdC5jb252ZXJ0TWlsZXNUb0ZlZXQoZGF0YS5EaXN0YW5jZSkgKyBcIjwvc3Ryb25nPiBGdCA8c3BhbiBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5GZWV0IHRvIEpvYiBTaXRlPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj4gPGhyLz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3BvcE1vZGFsRm9vdGVyJz48ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtY29tbWVudGluZyc+PC9pPjxzcGFuIGNsYXNzPSdzbXMnIHRpdGxlPSdDbGljayB0byBzZW5kIFNNUycgPlNNUzwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbCBjb2wtbWQtNCc+PGkgY2xhc3M9J2ZhIGZhLWVudmVsb3BlJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxzcGFuIGNsYXNzPSdlbWFpbCcgdGl0bGU9J0NsaWNrIHRvIHNlbmQgZW1haWwnID5FbWFpbDwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbCBjb2wtbWQtNCc+PGkgY2xhc3M9J2ZhIGZhLWV5ZScgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48c3BhbiBjbGFzcz0nd2F0Y2hsaXN0JyB0aXRsZT0nQ2xpY2sgdG8gYWRkIGluIHdhdGNobGlzdCcgPldhdGNoPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+IDwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCI7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluZm9ib3hEYXRhID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdwYWRkaW5nLXRvcDoxMHB4O21hcmdpbjogMHB4Oyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtMyc+PGRpdiBzdHlsZT0ncGFkZGluZy10b3A6MTVweDsnID48aW1nIHNyYz0nXCIgKyBkYXRhLmljb25JbmZvICsgXCInIHN0eWxlPSdkaXNwbGF5OiBibG9jazttYXJnaW46IDAgYXV0bzsnID48L2Rpdj48L2Rpdj5cIiArXHJcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J2NvbC1tZC05Jz5cIiArXHJcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdyAnPlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTgnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+VmVoaWNsZSBOdW1iZXI8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5zYmNWaW4gKyBcIjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTQnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxhIGNsYXNzPSdkZXRhaWxzJyBzdHlsZT0nY29sb3I6IzAwOUZEQjtjdXJzb3I6IHBvaW50ZXI7JyAgdGl0bGU9J0NsaWNrIGhlcmUgdG8gc2VlIHRlY2huaWNpYW4gZGV0YWlscycgPlZpZXcgRGV0YWlsczwvYT48aSBjbGFzcz0nZmEgZmEtdGltZXMnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweDtjdXJzb3I6IHBvaW50ZXI7JyBhcmlhLWhpZGRlbj0ndHJ1ZScgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+PC9pPjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnPjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5WVFMgVW5pdCBJRDwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLnRydWNrSWQgKyBcIjwvZGl2PjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncm93Jz48ZGl2IGNsYXNzPSdjb2wtbWQtNScgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5Kb2IgVHlwZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmpvYlR5cGUgKyBcIjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC03JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnID5Kb2IgSWQ8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgam9iSWQgKyBcIjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIHJlYXNvbiArIFwiPC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7Jz48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkFUVFVJRDwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLkFUVFVJRCArIFwiPHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7bWFyZ2luLWxlZnQ6OHB4Oyc+VGVjaG5pY2lhbiBOYW1lPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEudGVjaG5pY2lhbk5hbWUgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7JyA+XCJcclxuICAgICAgICAgICsgXCI8ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+Q3VzdG9tZXIgTmFtZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmN1c3RvbWVyTmFtZSArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4OycgPlwiXHJcbiAgICAgICAgICArIFwiPGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkRpc3BhdGNoIFRpbWU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5kaXNwYXRjaFRpbWUgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnID5cIlxyXG4gICAgICAgICAgKyBcIjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5Kb2IgQWRkcmVzczwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLndvcmtBZGRyZXNzICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGhyIHN0eWxlPSdtYXJnaW4tdG9wOjFweDsgbWFyZ2luLWJvdHRvbTo1cHg7JyAvPlwiXHJcblxyXG4gICAgICAgICAgKyBcIjxkaXYgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Oyc+IDxkaXYgY2xhc3M9J3Jvdyc+IDxkaXYgY2xhc3M9J3NwZWVkIGNvbC1tZC0zJz4gPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDFweCc+PHAgc3R5bGU9J2ZvbnQtd2VpZ2h0OiBib2xkZXI7Zm9udC1zaXplOiAyM3B4O21hcmdpbjogMHB4Oyc+XCIgKyBkYXRhLlNwZWVkICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+bXBoPC9wPjwvZGl2PjxwIHN0eWxlPSdtYXJnaW46MHB4JyBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5TcGVlZDwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2lkbGUgY29sLW1kLTUnPjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIGRhdGEuRVRBICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+TWluczwvcD48L2Rpdj48cCBzdHlsZT0nbWFyZ2luOjBweCcgY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+Q3VtdWxhdGl2ZSBJZGxlIE1pbnV0ZXM8L3A+PC9kaXY+IDxkaXYgY2xhc3M9J21pbGVzIGNvbC1tZC00Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIHRoYXQuY29udmVydE1pbGVzVG9GZWV0KGRhdGEuRGlzdGFuY2UpICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+RnQ8L3A+PC9kaXY+PHAgc3R5bGU9J21hcmdpbjowcHgnIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkZlZXQgdG8gSm9iIFNpdGU8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj48L2Rpdj48aHIgc3R5bGU9J21hcmdpbi10b3A6MXB4OyBtYXJnaW4tYm90dG9tOjVweDsnIC8+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPiA8ZGl2IGNsYXNzPSdjb2wtbWQtMSc+PC9kaXY+PGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zJyBzdHlsZT0nXCIgKyBjbGFzc05hbWUgKyBcIic+IDxpIGNsYXNzPSdmYSBmYS1jb21tZW50aW5nIGNvbC1tZC0yJz48L2k+PHAgY2xhc3M9J2NvbC1tZC02IHNtcycgdGl0bGU9J0NsaWNrIHRvIHNlbmQgU01TJyA+U01TPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zIG9mZnNldC1tZC0xJyBzdHlsZT0nXCIgKyBjbGFzc05hbWUgKyBcIic+IDxpIGNsYXNzPSdmYSBmYS1lbnZlbG9wZSBjb2wtbWQtMicgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgZW1haWwnIHRpdGxlPSdDbGljayB0byBzZW5kIGVtYWlsJyA+RW1haWw8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zJyBzdHlsZT0nXCIgKyBzdHlsZUxlZnQgKyBcIic+PGkgY2xhc3M9J2ZhIGZhLWV5ZSBjb2wtbWQtMicgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgd2F0Y2hsaXN0JyB0aXRsZT0nQ2xpY2sgdG8gYWRkIGluIHdhdGNobGlzdCcgPldhdGNoPC9wPjwvZGl2PiA8L2Rpdj5cIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGluZm9ib3hEYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpZXdUcnVja0RldGFpbHMoZSkge1xyXG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdmYSBmYS10aW1lcycpIHtcclxuICAgICAgICB0aGF0LmluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2RldGFpbHMnKSB7XHJcbiAgICAgICAgLy90aGF0LnJvdXRlci5uYXZpZ2F0ZShbJy90ZWNobmljaWFuLWRldGFpbHMnXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2NvbC1tZC02IHNtcycpIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGF0Lm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XHJcblxyXG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcclxuICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhhdC5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxyXG4gICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGpRdWVyeSgnI215TW9kYWxTTVMnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdjb2wtbWQtNiBlbWFpbCcpIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGF0Lm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XHJcblxyXG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcclxuICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhhdC5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxyXG4gICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGpRdWVyeSgnI215TW9kYWxFbWFpbCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgIH1cclxuICAgICBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvYWREaXJlY3Rpb25zKHRoYXQsIHN0YXJ0TG9jLCBlbmRMb2MsIGluZGV4LCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKSB7XHJcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuRGlyZWN0aW9uc01hbmFnZXIodGhhdC5tYXApO1xyXG4gICAgICAvLyBTZXQgUm91dGUgTW9kZSB0byBkcml2aW5nXHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuc2V0UmVxdWVzdE9wdGlvbnMoe1xyXG4gICAgICAgIHJvdXRlTW9kZTogTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5Sb3V0ZU1vZGUuZHJpdmluZ1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5zZXRSZW5kZXJPcHRpb25zKHtcclxuICAgICAgICBkcml2aW5nUG9seWxpbmVPcHRpb25zOiB7XHJcbiAgICAgICAgICBzdHJva2VDb2xvcjogJ2dyZWVuJyxcclxuICAgICAgICAgIHN0cm9rZVRoaWNrbmVzczogMyxcclxuICAgICAgICAgIHZpc2libGU6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3YXlwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IGZhbHNlIH0sXHJcbiAgICAgICAgdmlhcG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiBmYWxzZSB9LFxyXG4gICAgICAgIGF1dG9VcGRhdGVNYXBWaWV3OiBmYWxzZVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IHdheXBvaW50MSA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLldheXBvaW50KHtcclxuICAgICAgICBsb2NhdGlvbjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHN0YXJ0TG9jLmxhdGl0dWRlLCBzdGFydExvYy5sb25naXR1ZGUpLCBpY29uOiAnJ1xyXG4gICAgICB9KTtcclxuICAgICAgY29uc3Qgd2F5cG9pbnQyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuV2F5cG9pbnQoe1xyXG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZW5kTG9jLmxhdGl0dWRlLCBlbmRMb2MubG9uZ2l0dWRlKVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5hZGRXYXlwb2ludCh3YXlwb2ludDEpO1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50Mik7XHJcblxyXG4gICAgICAvLyBBZGQgZXZlbnQgaGFuZGxlciB0byBkaXJlY3Rpb25zIG1hbmFnZXIuXHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMuZGlyZWN0aW9uc01hbmFnZXIsICdkaXJlY3Rpb25zVXBkYXRlZCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy8gY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgdmFyIHJvdXRlSW5kZXggPSBlLnJvdXRlWzBdLnJvdXRlTGVnc1swXS5vcmlnaW5hbFJvdXRlSW5kZXg7XHJcbiAgICAgICAgdmFyIG5leHRJbmRleCA9IHJvdXRlSW5kZXg7XHJcbiAgICAgICAgaWYgKGUucm91dGVbMF0ucm91dGVQYXRoLmxlbmd0aCA+IHJvdXRlSW5kZXgpIHtcclxuICAgICAgICAgIG5leHRJbmRleCA9IHJvdXRlSW5kZXggKyAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV4dExvY2F0aW9uID0gZS5yb3V0ZVswXS5yb3V0ZVBhdGhbbmV4dEluZGV4XTtcclxuICAgICAgICB2YXIgcGluID0gdGhhdC5tYXAuZW50aXRpZXMuZ2V0KGluZGV4KTtcclxuICAgICAgICAvLyB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhzdGFydExvYyxuZXh0TG9jYXRpb24pO1xyXG4gICAgICAgIHRoYXQuTW92ZVBpbk9uRGlyZWN0aW9uKHRoYXQsIGUucm91dGVbMF0ucm91dGVQYXRoLCBwaW4sIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuY2FsY3VsYXRlRGlyZWN0aW9ucygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBNb3ZlUGluT25EaXJlY3Rpb24odGhhdCwgcm91dGVQYXRoLCBwaW4sIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpIHtcclxuICAgIHRoYXQgPSB0aGlzO1xyXG4gICAgdmFyIGlzR2VvZGVzaWMgPSBmYWxzZTtcclxuICAgIHRoYXQuY3VycmVudEFuaW1hdGlvbiA9IG5ldyBCaW5nLk1hcHMuQW5pbWF0aW9ucy5QYXRoQW5pbWF0aW9uKHJvdXRlUGF0aCwgZnVuY3Rpb24gKGNvb3JkLCBpZHgsIGZyYW1lSWR4LCByb3RhdGlvbkFuZ2xlLCBsb2NhdGlvbnMsIHRydWNrSWRSYW5JZCkge1xyXG5cclxuICAgICAgaWYgKHRoYXQuYW5pbWF0aW9uVHJ1Y2tMaXN0Lmxlbmd0aCA+IDAgJiYgdGhhdC5hbmltYXRpb25UcnVja0xpc3Quc29tZSh4ID0+IHggPT0gdHJ1Y2tJZFJhbklkKSkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IChmcmFtZUlkeCA9PSBsb2NhdGlvbnMubGVuZ3RoIC0gMSkgPyBmcmFtZUlkeCA6IGZyYW1lSWR4ICsgMTtcclxuICAgICAgICB2YXIgcm90YXRpb25BbmdsZSA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhjb29yZCwgbG9jYXRpb25zW2luZGV4XSk7XHJcbiAgICAgICAgaWYgKHRoYXQuaXNPZGQoZnJhbWVJZHgpKSB7XHJcbiAgICAgICAgICB0aGF0LmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4ocGluLCB0cnVja1VybCwgcm90YXRpb25BbmdsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGZyYW1lSWR4ID09IGxvY2F0aW9ucy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICB0aGF0LmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4ocGluLCB0cnVja1VybCwgcm90YXRpb25BbmdsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBpbi5zZXRMb2NhdGlvbihjb29yZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9LCBpc0dlb2Rlc2ljLCB0aGF0LnRyYXZhbER1cmF0aW9uLCB0cnVja0lkUmFuSWQpO1xyXG5cclxuICAgIHRoYXQuY3VycmVudEFuaW1hdGlvbi5wbGF5KCk7XHJcbiAgfVxyXG5cclxuICBDYWxjdWxhdGVOZXh0Q29vcmQoc3RhcnRMb2NhdGlvbiwgZW5kTG9jYXRpb24pIHtcclxuICAgIHRyeSB7XHJcblxyXG4gICAgICB2YXIgZGxhdCA9IChlbmRMb2NhdGlvbi5sYXRpdHVkZSAtIHN0YXJ0TG9jYXRpb24ubGF0aXR1ZGUpO1xyXG4gICAgICB2YXIgZGxvbiA9IChlbmRMb2NhdGlvbi5sb25naXR1ZGUgLSBzdGFydExvY2F0aW9uLmxvbmdpdHVkZSk7XHJcbiAgICAgIHZhciBhbHBoYSA9IE1hdGguYXRhbjIoZGxhdCAqIE1hdGguUEkgLyAxODAsIGRsb24gKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgdmFyIGR4ID0gMC4wMDAxNTIzODc5NDcyNzkwOTkzMTtcclxuICAgICAgZGxhdCA9IGR4ICogTWF0aC5zaW4oYWxwaGEpO1xyXG4gICAgICBkbG9uID0gZHggKiBNYXRoLmNvcyhhbHBoYSk7XHJcbiAgICAgIHZhciBuZXh0Q29vcmQgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oc3RhcnRMb2NhdGlvbi5sYXRpdHVkZSArIGRsYXQsIHN0YXJ0TG9jYXRpb24ubG9uZ2l0dWRlICsgZGxvbik7XHJcblxyXG4gICAgICBkbGF0ID0gbnVsbDtcclxuICAgICAgZGxvbiA9IG51bGw7XHJcbiAgICAgIGFscGhhID0gbnVsbDtcclxuICAgICAgZHggPSBudWxsO1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRDb29yZDtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBpbiBDYWxjdWxhdGVOZXh0Q29vcmQgLSAnICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNPZGQobnVtKSB7XHJcbiAgICByZXR1cm4gbnVtICUgMjtcclxuICB9XHJcblxyXG4gIGRlZ1RvUmFkKHgpIHtcclxuICAgIHJldHVybiB4ICogTWF0aC5QSSAvIDE4MDtcclxuICB9XHJcblxyXG4gIHJhZFRvRGVnKHgpIHtcclxuICAgIHJldHVybiB4ICogMTgwIC8gTWF0aC5QSTtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZUJlYXJpbmcob3JpZ2luLCBkZXN0KSB7XHJcbiAgICAvLy8gPHN1bW1hcnk+Q2FsY3VsYXRlcyB0aGUgYmVhcmluZyBiZXR3ZWVuIHR3byBsb2FjYXRpb25zLjwvc3VtbWFyeT5cclxuICAgIC8vLyA8cGFyYW0gbmFtZT1cIm9yaWdpblwiIHR5cGU9XCJNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvblwiPkluaXRpYWwgbG9jYXRpb24uPC9wYXJhbT5cclxuICAgIC8vLyA8cGFyYW0gbmFtZT1cImRlc3RcIiB0eXBlPVwiTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb25cIj5TZWNvbmQgbG9jYXRpb24uPC9wYXJhbT5cclxuICAgIHRyeSB7XHJcbiAgICAgIHZhciBsYXQxID0gdGhpcy5kZWdUb1JhZChvcmlnaW4ubGF0aXR1ZGUpO1xyXG4gICAgICB2YXIgbG9uMSA9IG9yaWdpbi5sb25naXR1ZGU7XHJcbiAgICAgIHZhciBsYXQyID0gdGhpcy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlKTtcclxuICAgICAgdmFyIGxvbjIgPSBkZXN0LmxvbmdpdHVkZTtcclxuICAgICAgdmFyIGRMb24gPSB0aGlzLmRlZ1RvUmFkKGxvbjIgLSBsb24xKTtcclxuICAgICAgdmFyIHkgPSBNYXRoLnNpbihkTG9uKSAqIE1hdGguY29zKGxhdDIpO1xyXG4gICAgICB2YXIgeCA9IE1hdGguY29zKGxhdDEpICogTWF0aC5zaW4obGF0MikgLSBNYXRoLnNpbihsYXQxKSAqIE1hdGguY29zKGxhdDIpICogTWF0aC5jb3MoZExvbik7XHJcblxyXG4gICAgICBsYXQxID0gbGF0MiA9IGxvbjEgPSBsb24yID0gZExvbiA9IG51bGw7XHJcblxyXG4gICAgICByZXR1cm4gKHRoaXMucmFkVG9EZWcoTWF0aC5hdGFuMih5LCB4KSkgKyAzNjApICUgMzYwO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIGNhbGN1bGF0ZUJlYXJpbmcgLSAnICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgU2VuZFNNUyhmb3JtKSB7XHJcbiAgICAvLyBpZih0aGlzLnRlY2huaWNpYW5QaG9uZSAhPSAnJyl7XHJcbiAgICBpZiAoZm9ybS52YWx1ZS5tb2JpbGVObyAhPSAnJykge1xyXG4gICAgICBpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHdhbnQgdG8gc2VuZCBTTVM/JykpIHtcclxuICAgICAgICAvLyB0aGlzLm1hcFNlcnZpY2Uuc2VuZFNNUyh0aGlzLnRlY2huaWNpYW5QaG9uZSxmb3JtLnZhbHVlLnNtc01lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMubWFwU2VydmljZS5zZW5kU01TKGZvcm0udmFsdWUubW9iaWxlTm8sIGZvcm0udmFsdWUuc21zTWVzc2FnZSk7XHJcblxyXG4gICAgICAgIGZvcm0uY29udHJvbHMuc21zTWVzc2FnZS5yZXNldCgpXHJcbiAgICAgICAgZm9ybS52YWx1ZS5tb2JpbGVObyA9IHRoaXMudGVjaG5pY2lhblBob25lO1xyXG4gICAgICAgIGpRdWVyeSgnI215TW9kYWxTTVMnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIuc3VjY2VzcygnU01TIHNlbnQgc3VjY2Vzc2Z1bGx5JywgJ1N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIFNlbmRFbWFpbChmb3JtKSB7XHJcbiAgICAvLyBpZih0aGlzLnRlY2huaWNpYW5FbWFpbCAhPSAnJyl7XHJcbiAgICBpZiAoZm9ybS52YWx1ZS5lbWFpbElkICE9ICcnKSB7XHJcbiAgICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgd2FudCB0byBzZW5kIEVtYWlsPycpKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXNlclByb2ZpbGVTZXJ2aWNlLmdldFVzZXJEYXRhKHRoaXMuY29va2llQVRUVUlEKVxyXG4gICAgICAgIC8vICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgIC8vICAgICB2YXIgbmV3RGF0YTogYW55ID0gdGhpcy5zdHJpbmdpZnlKc29uKGRhdGEpO1xyXG4gICAgICAgIC8vICAgICAvL3RoaXMubWFwU2VydmljZS5zZW5kRW1haWwobmV3RGF0YS5lbWFpbCx0aGlzLnRlY2huaWNpYW5FbWFpbCxuZXdEYXRhLmxhc3ROYW1lICsgJyAnICsgbmV3RGF0YS5maXJzdE5hbWUsIHRoaXMudGVjaG5pY2lhbk5hbWUsIGZvcm0udmFsdWUuZW1haWxTdWJqZWN0LGZvcm0udmFsdWUuZW1haWxNZXNzYWdlKTtcclxuICAgICAgICAvLyAgICAgdGhpcy5tYXBTZXJ2aWNlLnNlbmRFbWFpbChuZXdEYXRhLmVtYWlsLCBmb3JtLnZhbHVlLmVtYWlsSWQsIG5ld0RhdGEubGFzdE5hbWUgKyAnICcgKyBuZXdEYXRhLmZpcnN0TmFtZSwgdGhpcy50ZWNobmljaWFuTmFtZSwgZm9ybS52YWx1ZS5lbWFpbFN1YmplY3QsIGZvcm0udmFsdWUuZW1haWxNZXNzYWdlKTtcclxuICAgICAgICAvLyAgICAgdGhpcy50b2FzdHIuc3VjY2VzcyhcIkVtYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5XCIsICdTdWNjZXNzJyk7XHJcblxyXG4gICAgICAgIC8vICAgICBmb3JtLmNvbnRyb2xzLmVtYWlsU3ViamVjdC5yZXNldCgpXHJcbiAgICAgICAgLy8gICAgIGZvcm0uY29udHJvbHMuZW1haWxNZXNzYWdlLnJlc2V0KClcclxuICAgICAgICAvLyAgICAgZm9ybS52YWx1ZS5lbWFpbElkID0gdGhpcy50ZWNobmljaWFuRW1haWw7XHJcbiAgICAgICAgLy8gICAgIGpRdWVyeSgnI215TW9kYWxFbWFpbCcpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgLy8gICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgU2VhcmNoVHJ1Y2soZm9ybSkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgLy8kKCcjbG9hZGluZycpLnNob3coKTtcclxuXHJcbiAgICBpZiAoZm9ybS52YWx1ZS5pbnB1dG1pbGVzICE9ICcnICYmIGZvcm0udmFsdWUuaW5wdXRtaWxlcyAhPSBudWxsKSB7XHJcbiAgICAgIGNvbnN0IGx0ID0gdGhhdC5jbGlja2VkTGF0O1xyXG4gICAgICBjb25zdCBsZyA9IHRoYXQuY2xpY2tlZExvbmc7XHJcbiAgICAgIGNvbnN0IHJkID0gZm9ybS52YWx1ZS5pbnB1dG1pbGVzO1xyXG5cclxuICAgICAgdGhpcy5mb3VuZFRydWNrID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0ID0gW107XHJcblxyXG4gICAgICBpZiAodGhpcy5jb25uZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5sb2FkTWFwVmlldygncm9hZCcpO1xyXG5cclxuICAgICAgdGhhdC5Mb2FkVHJ1Y2tzKHRoaXMubWFwLCBsdCwgbGcsIHJkLCB0cnVlKTtcclxuXHJcbiAgICAgIGZvcm0uY29udHJvbHMuaW5wdXRtaWxlcy5yZXNldCgpO1xyXG4gICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgfSwgMTAwMDApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG5cclxuICBnZXRNaWxlcyhpKSB7XHJcbiAgICByZXR1cm4gaSAqIDAuMDAwNjIxMzcxMTkyO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWV0ZXJzKGkpIHtcclxuICAgIHJldHVybiBpICogMTYwOS4zNDQ7XHJcbiAgfVxyXG5cclxuICBzdHJpbmdpZnlKc29uKGRhdGEpIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICB9XHJcbiAgcGFyc2VUb0pzb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgfVxyXG5cclxuICBSb3VuZChudW1iZXIsIHByZWNpc2lvbikge1xyXG4gICAgdmFyIGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xyXG4gICAgdmFyIHRlbXBOdW1iZXIgPSBudW1iZXIgKiBmYWN0b3I7XHJcbiAgICB2YXIgcm91bmRlZFRlbXBOdW1iZXIgPSBNYXRoLnJvdW5kKHRlbXBOdW1iZXIpO1xyXG4gICAgcmV0dXJuIHJvdW5kZWRUZW1wTnVtYmVyIC8gZmFjdG9yO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXRhbjIoeSwgeCkge1xyXG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCk7XHJcbiAgfTtcclxuXHJcbiAgZ2V0SWNvblVybChjb2xvcjogc3RyaW5nLCBzb3VyY2VMYXQ6IG51bWJlciwgc291cmNlTG9uZzogbnVtYmVyLCBkZXN0aW5hdGlvbkxhdDogbnVtYmVyLCBkZXN0aW5hdGlvbkxvbmc6IG51bWJlcikge1xyXG4gICAgdmFyIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEzWkpSRUZVYUlIdGwxMUlVMkVZeC85dnVWcVFheGVCNnd2MEtzY0lGNEcwYnBvYVpuV3poVnBkVkVwMUVScm1wQ2h2TWdqckloVDZvS0JaNkVYVUF1ZU5hRkgwUVRTeHlBV1ZYUlF1UDFBdnN1M001bkhhbmk3Y2x1blp4OWxtQ0w2L3EzUE84L0tjLy85NXZ3RU9oOFBoY0RnY0RvZXpWR0dwU0VKRWFnQlZxY2dsZ1lzeDFod3BtSlpzZGlKU0J5andZY3ozYysyd1o4U2ZiTDY1YkZtdlV4T1JrVEZXTGhXWDNRUEJhdThFb0E5KzBrOU1pZnUyWGQycEVFUWhDYW5TV1BJcVlURldBRUFXWTh3MU55NnJCNGlvYWpydysxTGFzdVdyKzM3MGo0OVBlcWN6VkJsSzE5aDN0aERpQWNEaDZnWlFBUUNaQUJJM1FFVDNBSlJkZTNVYlZrY0xCRkZZRGN4VWFFZG1ib3JreWljdUF5SHhsclphMkhyc0N5eEpIc3RpTlZqTTRvRVlCaGE3ZUNDS0FTSXlZcEdMQjZMTWdjbHAvNW5YMzk1TTJYcnNpdjhwU0M0UkRheE1XN0czdmZkSlhFblNsZWtwRXpTWE5VcFYxSGpVVldqQVBSVHpCNExvaFU2VGpSSzlLYTcyY2luT01ZVWVuVkx4cEk4U3RoNDdTdlVtTkpvdko1c3FHdFdNTWJkVUlHa0RnaWlnOEpZWmhxelViMmFsZWpOSzlDWWdRdldCSkF6b05GcDhHdWtOdnp2NnVoTk5OUzlYQ0VNY083d3NBeXFsQ2cybWVoUnBDOExmR3A3ZlFNT0xtM0xTaERtMi9RaHE4aXFoQ2k0Q0RsYzNMUFphV1hOSmxvR21ROWV4U2IwUnh4K2Nna2NVb05Ob1VXT3N3SnBWS2x6b2tEY0hqaHVPb3E3b0hKcTZXdEQ1NVJrQW9NWllDVnQ1TTNiZjJvOTRENGNSRFlqVDRxaE9vODBJRFkwaTdTNFlNbk5oYU53VnJwQ2pyeHVEN2lGWUQxNkgxZEVpcTNJV1l3VWVPZHYrTVY3Y2R3UmQxYzlRdXRVTXE2TVpPZXQwVXdBVWtEaUZ4alNnVEZQZVBwdGZWZXVaOENnRzNFTW8zSnlQTHRmYmVTSTdlNThDQUFxekN5VEhzUlE2alJZcVpUcHN6dms3dk0xcHgrN3NmQkFSQ2pZYkZRQmVTdDBEWWhwZ2pOVVJrYnJSZkRsOFZSenhqdm9CckpqZFRoWGNhQzd1T1IrWCtObEliVktiMUJ0bWVucG1BcjhFWUpyWGFMYk9lSDVFUkhyTVhDanNkWjFYWUhYOHZhSTJtT3BSdXRVTUFHWUFrbXUxRk9PVHZnT0Q3c0VUKys4ZVhoNGE3enFORm85UHRvYUZSMXI3RTRhSXlvaUlQZzczMHAwM3pkVC9jNUNDbENXUVN5MkkzcS9DaEJCNCtMNlZPajQvSlNLaVFDRGdDUlpzWVNBaW96ZzEyZjdqMTVqVDU1KzRIenkxSnBwTFRVU25QYUwzbmMvdjZ5S2l1dUNkbThQaGNEaWNwY0VmazNlQUxiYzErVlFBQUFBQVNVVk9SSzVDWUlJPVwiO1xyXG5cclxuICAgIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwiZ3JlZW5cIikge1xyXG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBM1pKUkVGVWFJSHRsMTFJVTJFWXgvOXZ1VnFRYXhlQjZ3djBLc2NJRjRHMGJwb2Fabld6aFZwZFZFcDFFUnJtcENodk1nanJJaFQ2b0tCWjZFWFVBdWVOYUZIMFFUU3h5QVdWWFJRdVAxQXZzdTNNNW5IYW5pN2NsdW5aeDlsbUNMNi9xM1BPOC9LYy8vOTV2d0VPaDhQaGNEZ2NEb2V6VkdHcFNFSkVhZ0JWcWNnbGdZc3gxaHdwbUpac2RpSlNCeWp3WWN6M2MrMndaOFNmYkw2NWJGbXZVeE9Sa1RGV0xoV1gzUVBCYXU4RW9BOSswazlNaWZ1MlhkMnBFRVFoQ2FuU1dQSXFZVEZXQUVBV1k4dzFOeTZyQjRpb2FqcncrMUxhc3VXciszNzBqNDlQZXFjelZCbEsxOWgzdGhEaUFjRGg2Z1pRQVFDWkFCSTNRRVQzQUpSZGUzVWJWa2NMQkZGWURjeFVhRWRtYm9ya3lpY3VBeUh4bHJaYTJIcnNDeXhKSHN0aU5Wak00b0VZQmhhN2VDQ0tBU0l5WXBHTEI2TE1nY2xwLzVuWDM5NU0yWHJzaXY4cFNDNFJEYXhNVzdHM3ZmZEpYRW5TbGVrcEV6U1hOVXBWMUhqVVZXakFQUlR6QjRMb2hVNlRqUks5S2E3MmNpbk9NWVVlblZMeHBJOFN0aDQ3U3ZVbU5Kb3ZKNXNxR3RXTU1iZFVJR2tEZ2lpZzhKWVpocXpVYjJhbGVqTks5Q1lnUXZXQkpBem9ORnA4R3VrTnZ6djZ1aE5OTlM5WENFTWNPN3dzQXlxbENnMm1laFJwQzhMZkdwN2ZRTU9MbTNMU2hEbTIvUWhxOGlxaENpNENEbGMzTFBaYVdYTkpsb0dtUTlleFNiMFJ4eCtjZ2tjVW9OTm9VV09zd0pwVktsem9rRGNIamh1T29xN29ISnE2V3RENTVSa0FvTVpZQ1Z0NU0zYmYybzk0RDRjUkRZalQ0cWhPbzgwSURZMGk3UzRZTW5OaGFOd1ZycENqcnh1RDdpRllEMTZIMWRFaXEzSVdZd1VlT2R2K01WN2Nkd1JkMWM5UXV0VU1xNk1aT2V0MFV3QVVrRGlGeGpTZ1RGUGVQcHRmVmV1WjhDZ0czRU1vM0p5UEx0ZmJlU0k3ZTU4Q0FBcXpDeVRIc1JRNmpSWXFaVHBzenZrN3ZNMXB4KzdzZkJBUkNqWWJGUUJlU3QwRFlocGdqTlVSa2JyUmZEbDhWUnp4anZvQnJKamRUaFhjYUM3dU9SK1grTmxJYlZLYjFCdG1lbnBtQXI4RVlKclhhTGJPZUg1RVJIck1YQ2pzZFoxWFlIWDh2YUkybU9wUnV0VU1BR1lBa211MUZPT1R2Z09EN3NFVCsrOGVYaDRhN3pxTkZvOVB0b2FGUjFyN0U0YUl5b2lJUGc3MzBwMDN6ZFQvYzVDQ2xDV1FTeTJJM3EvQ2hCQjQrTDZWT2o0L0pTS2lRQ0RnQ1Jac1lTQWlvemcxMmY3ajE1alQ1NSs0SHp5MUpwcExUVVNuUGFMM25jL3Y2eUtpdXVDZG04UGhjRGljcGNFZmszZUFMYmMxK1ZRQUFBQUFTVVZPUks1Q1lJST1cIjtcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcInJlZFwiKSB7XHJcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEweEpSRUZVYUlIdGx6MXNFbUVjeHA5WGhCUURoUkEvTUNTTlRVeTh0RXNYWEVzZ2NkQUJxb09UcEE0dWtLQU94c1l1RGtKMHJkSG8xSlFtYmdZY1hQeEtuRFRnVUFkdG16U3hJVUNLUkN3ZW9RVjY5M2VBdTJoN0JRNWEwOFQzTngzM1A1NTdudmZyM2hmZ2NEZ2NEb2ZENFhBNC95dHNMMFNJeUE3ZytsNW9hYkRLR0p2YnJYaTRYM1Vpc2tPV1AyLzkvSG0wWGlqVSs5WGJ6cEdSRVRzUmVSaGpWN1hxdW51ZzFkcmpBTVphdDhia3pjMExYendlb3lTS2ZWalZ4aGtPd3hrS0FjQXdZMngxZTExWER4RFJkWktrZTh4Z3NOUXltWXBVcVd5WmpoOGZxR1V5YkQvTUEwQWxuVll1VHdIb1BRQVJ6UUtZTER4OWltSThEa2tVTFVDemhTeHU5MTU0N1ltdUFpam1NOVBUS0NXVCsyeEpINGM2UFhDUXpRTWRBaHgwODBDYkFFVGt3UUUzRDdTWkExU3YzeEkvZkdpVWtrbmp2elNrbDEwRE1KUHAvUHFyVjEySkdLeldQVE9rVjd2dEtsVFA1enUrUUJKRm1BVUJEcisvcStmMTR2RDdsY3NGclhyZlc0bFNJZ0ZISUlDaFdLeGZxWGJjWkl5dGF4WDZEaUNKSXBZdlhvVGw3TmwrcFhiZ0NBU1VIdEJzZmFDUEFHWkJ3TWJTa3ZxN2trcjFLclZEUzZHYkw3eXVBQWFyRlVQUktHdytuM3B2N2RFanJEMStyRWRHNWRpVkszQ0d3K3BFcmFUVHlFeFBvNTdMZGEyaEs4RHd3NGN3dVZ6NEZvbW9rOWNaQ3NFd09JamMvZnY2ekFlRGNOMitqZUw4UE1ydjNnRUFuS0VRVHMvT1l2blNKWFM3T2R3MWdMeTVXVEFMd2dsbGFOaDhQbGpjYm53OWQwNXRvVW9xaFhvdWgrR1pHUlRuNTNXMW5ETVVRdW5GaTcrQ3I2UlNHSG45R282SkNSVGpjUndaSFcwQU1FSmpGOW94d0tHQmdTY25JNUU3VXJsc3JPZnpzSG05cUtUVE8weVczNzV0QnZSNk5jZXhGbVpCZ01GcTFmekNsNUpKMkx4ZWdBaUQ0K05HQU8rMXpnRWRBekRHN2hLUmZTZ1dVNCtLamVhSnkvVG5jOHI0ZFUxTmRXVmU2NzkvWW5LNVlIRzdsUW44SGtDZ25VWlhKeklpR2tQelFKSElQWGlBWWp5dTFvYWlVVGdDQVFDWUFLQzVWbXNoVjZ1WGE5bnN0WlZnMEtDTWQ3TWc0TXp6NTZyeDNkYituaUdpU1NLaTZ1SWlmWitibzFvMlN5MG1lOUN5UzZLNHN2WHJsL3dqa2FEMU4yK2FTckpjYmpYWS9rQkVIcmxXZTlrb2xSYWtqWTFuclYxcnIxcDJJcm9oaWVLbnJXcjFJeEhkYloyNU9Sd09oOFA1UC9nTnFoeC82cnN1ampnQUFBQUFTVVZPUks1Q1lJST1cIjtcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcInllbGxvd1wiKSB7XHJcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUF5aEpSRUZVYUlIdGx6MU1VMUVZaHQvdlloV05hWnRnaEFHTm1JQ0pWbUZ3TUNGUkhFd0VFOFZKbk1SQm5SUWR5Z0FPRHJyb1lDSUx1QmdXWWRQRXlHUml4QlFjSENEK0RLaEFXaU00MUhnSmxKL2JudGVodC9XbnR6KzNCVVBDZWFiZSs1MjhmYi92bkh2T2R3Q05ScVBSYURRYWpVYXpVWkhWRUNIcEI5Q3hHbG9PVEl0SWY3YmdwbExWU2ZwQk5RN3J4dzRzZmxzcFZTOEQzeUUveVNZUnVlZ1VkajBEZHJXUEFXaXdYelVnc1hncThlS2dCNVpaZ2xObnBLNFRSbDBRQUdwRVpQcmZ1S3NaSU5rQnhtOURObTFIYkhJZTFud2M1VlhsWEppVXRUQVBBSWlHQUFRQllBK0E0aE1nK1FoQXUvcDBINXpxQXl4ek81Q3NrRlEwcnBKYjl4U1VRTW84eDYrQmtZRTF0dVFPSTkrQVA4MnJkV1lleUpQQWVqY1A1RWlBWkJQV3VYa2cxemVRV0E0eU9teXB5SURuUC9weFRmWUV5cmEwWU9aWllTb2U3eXJaY2RMMjVRem4zSVVZQytmVmw3Z0o4UVlndTlxQUFzYTdSYXJQcFg2T09jVkxiaVZVWkJCRzlYa1k5VDJsU3VYaWhvajhkQXFVbkFBc0UycTRhVTBPTTZsdVM4NXNsdW9ESlNRZzNnQTQ5ejc5ekdpb1dLa01yVFFWalhtYk5YY0plSHd3Nmg5QXFsclNyemh4RjJyaW5pdVpGRWJOWlVoZFovcERaVFFFamw4cjZOdEw0U29CNDNBL1pOdHVxTGNYQU11RStBS1EyazZJeHc5KzZIWm5mdThWeVA3YlVGTVBnZGtoQUhibmVlUXBFcStQbzlEbU1QdEpuRmo2THI1QStsR3FXaUFWalZDanJlRHNFQmdOUVUzMlFZMWZUVlp5MjI1WENVaHRFSXdNZ2grNms1V1BocUJHendBQ0dNbDFEL0UzV1Bid2pDNDBSWTV6b0x4WDluVjFpV1Y2RUF0REtwdkI2RWpHOURKVnZjcVRnTk02ZGpMdkRRQWVIL2gxTUNPbUlvT1F5bVlZSkdUbkNRK0FWMDczZ0x3SmlNZ3RrbjZqdnVmM1ZYRnBaZ1hBNXI4RzJ1dFhEdHh4Znp0eU9LUms2NjdranBiYzFWNEJhTTBsVWRCL2tteEE4a0x4aEI5dlFrMzJwV05HZlU5cXF6c0x3SEd2ZGlReGY0Nng4Q1UxY3Jvc3RkN0ZHNEJ4OUdYYWVMYTl2MmhJdHBPa010OHg4YVdYWEFqVHByMElMVDlYNWo3VE1wVUtEMUROUExlbGxHa1hiRzBnMmNUNDBuTXVSOGNZanoyMnU5Wml0ZndrcjNQRmZNdjR3aHVTdCt3N3QwYWowV2cwRzROZlRpeGtmRnh5WFBFQUFBQUFTVVZPUks1Q1lJST1cIlxyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwicHVycGxlXCIpIHtcclxuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUY2MmxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdNeTB3TTFReE1UbzBNRG96Tnkwd05Ub3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1ETXRNRE5VTVRFNk5UTTZNalV0TURVNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1ETXRNRE5VTVRFNk5UTTZNalV0TURVNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllUbGhZVFl4WkdZdFkyVmhOQzB3WXpReUxUaGhaVEF0WmpZMVpUZGhOV0l3TWpCaElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2TVRJNE5tWXpaR1V0WkRkak5TMWtaVFJtTFRnNU5HWXRNV1l6T0RrMlltTTVaakZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2WVRka05EUm1OMkV0TWpKbFl5MWhPRFEwTFRsbU9XSXRNVEEzWWpGaE5XWTJPVGN5SWo0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGhOMlEwTkdZM1lTMHlNbVZqTFdFNE5EUXRPV1k1WWkweE1EZGlNV0UxWmpZNU56SWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TUROVU1URTZOREE2TXpjdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21FNVlXRTJNV1JtTFdObFlUUXRNR00wTWkwNFlXVXdMV1kyTldVM1lUVmlNREl3WVNJZ2MzUkZkblE2ZDJobGJqMGlNakF4T0Mwd015MHdNMVF4TVRvMU16b3lOUzB3TlRvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NlJRMmNYQUFBQ1MwbEVRVlJvM3UyWXZVb0RRUkRIOHdoNUJOOUFIOERDMmtZcld3WHQxVjdSV2h1N2xJS0tXQ2txTm9Lb29LQkVKU0RFRDB3UmpTU1NjR0xpSldaemQrdit6OXV3aEh4ZTl1Q0VHUmhDTm5lejg1dWRuWjFOaEhNZStjOGFJUUFDSUFBQ0lBQUNJQUFDSUFBQ0lBRHRBTDJJZUQ0cWRDa2duVlRtMFE4QTV4MmJwOHNGWmhhUzM1KzZsZi9KdWpZQUw5cGpTb1QyYWhXYjdRemY4bzNCYSsyYWlHVThCajdRTjRBWW43VXRwd1JyeGRkS0NSRXE1MW5sNDY1WUM4SjU2UEhNZ3dRWTZRc0F5d2dyaUlnYWJYelB4cjk0cUFHazg1ZUxxYVpMSEdxQWRzNkhIcUNUODZFRzhGNW82M3lvQWV5cWMvUjIvc202S1hOaFhZR08wWmNBeHFNWkdNRHAvTE4vQU5CM21pQyttbmF0WHl5aytQSDBnM1o5UFRFa1FEUVFBSndKeHBQSkE1YTVubHVKYmdIVVhOV3RxWU44UFgyMEF4eE8zR3ZMODFhMmxENUlEd0RTUmNsSkxsc0x2NDdIVjlLOFdxelZiYUdhN1k0bWdnUEFCS1gzSDdjeTREZHNZRGlRM01yMjdyeTMrZkd1VEJuWGZ1YW4zbXYxQlNCYTVCd21hU3huYW9UYWpYZFNnQ1BIRzhjUklEa3Z6aUhaU3Z0WmdlVmEyV2F5UEw3czUxc2VXQkNrUTdlbEVjKzIybVB5WUpUUENEbnpmU01UbjJ0cXZwdTVhclZaR2ZVcldMMUdlMHJsY1oxSC9lLzdTaW0rRHdrZGR5T3RwQlVVSytQSnVIZGFkcVhNdEdMR3MybXBkd3RVbzJhT2E3c1RpL0VwV0VmcmtOek11aHZPazZsSWp3SUhXY2w2RVh2QlFSRHExYzNoWHdoWWkzZTAzSWxIME9oVkRKWVFHMzFiVmdnLzRyVUhjd0xraHBXdEsreTdacEgzQlVCL2JCRUFBUkFBQVJEQWY5QmZSYjY0S1lmbFJMQUFBQUFBU1VWT1JLNUNZSUk9XCJcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaWNvblVybDtcclxuICB9XHJcblxyXG4gIGxvY2F0ZXB1c2hwaW4ob2JqKSB7XHJcbiAgICBjb25zdCB0cnVja0lkID0gb2JqLnRydWNrSWQ7XHJcblxyXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgcGlucyBpbiB0aGUgZGF0YSBsYXllciBhbmQgZmluZCB0aGUgcHVzaHBpbiBmb3IgdGhlIGxvY2F0aW9uLiBcclxuICAgIGxldCBzZWFyY2hQaW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YUxheWVyLmdldExlbmd0aCgpOyBpKyspIHtcclxuICAgICAgc2VhcmNoUGluID0gdGhpcy5kYXRhTGF5ZXIuZ2V0KGkpO1xyXG4gICAgICBpZiAoc2VhcmNoUGluLm1ldGFkYXRhLnRydWNrSWQudG9Mb3dlckNhc2UoKSAhPT0gdHJ1Y2tJZC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgc2VhcmNoUGluID0gbnVsbDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGEgcGluIGlzIGZvdW5kIHdpdGggYSBtYXRjaGluZyBJRCwgdGhlbiBjZW50ZXIgdGhlIG1hcCBvbiBpdCBhbmQgc2hvdyBpdCdzIGluZm9ib3guXHJcbiAgICBpZiAoc2VhcmNoUGluKSB7XHJcbiAgICAgIC8vIE9mZnNldCB0aGUgY2VudGVyaW5nIHRvIGFjY291bnQgZm9yIHRoZSBpbmZvYm94LlxyXG4gICAgICB0aGlzLm1hcC5zZXRWaWV3KHsgY2VudGVyOiBzZWFyY2hQaW4uZ2V0TG9jYXRpb24oKSwgem9vbTogMTcgfSk7XHJcbiAgICAgIC8vIHRoaXMuZGlzcGxheUluZm9Cb3goc2VhcmNoUGluLCBvYmopO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihsb2NhdGlvbiwgdXJsLCByb3RhdGlvbkFuZ2xlLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuXHJcbiAgICAgIHZhciByb3RhdGlvbkFuZ2xlUmFkcyA9IHJvdGF0aW9uQW5nbGUgKiBNYXRoLlBJIC8gMTgwO1xyXG4gICAgICBjLndpZHRoID0gNTA7XHJcbiAgICAgIGMuaGVpZ2h0ID0gNTA7XHJcbiAgICAgIC8vIENhbGN1bGF0ZSByb3RhdGVkIGltYWdlIHNpemUuXHJcbiAgICAgIC8vIGMud2lkdGggPSBNYXRoLmFicyhNYXRoLmNlaWwoaW1nLndpZHRoICogTWF0aC5jb3Mocm90YXRpb25BbmdsZVJhZHMpICsgaW1nLmhlaWdodCAqIE1hdGguc2luKHJvdGF0aW9uQW5nbGVSYWRzKSkpO1xyXG4gICAgICAvLyBjLmhlaWdodCA9IE1hdGguYWJzKE1hdGguY2VpbChpbWcud2lkdGggKiBNYXRoLnNpbihyb3RhdGlvbkFuZ2xlUmFkcykgKyBpbWcuaGVpZ2h0ICogTWF0aC5jb3Mocm90YXRpb25BbmdsZVJhZHMpKSk7XHJcblxyXG4gICAgICB2YXIgY29udGV4dCA9IGMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgIC8vIE1vdmUgdG8gdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZShjLndpZHRoIC8gMiwgYy5oZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgIC8vIFJvdGF0ZSB0aGUgY2FudmFzIHRvIHRoZSBzcGVjaWZpZWQgYW5nbGUgaW4gZGVncmVlcy5cclxuICAgICAgY29udGV4dC5yb3RhdGUocm90YXRpb25BbmdsZVJhZHMpO1xyXG5cclxuICAgICAgLy8gRHJhdyB0aGUgaW1hZ2UsIHNpbmNlIHRoZSBjb250ZXh0IGlzIHJvdGF0ZWQsIHRoZSBpbWFnZSB3aWxsIGJlIHJvdGF0ZWQgYWxzby5cclxuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCAtaW1nLndpZHRoIC8gMiwgLWltZy5oZWlnaHQgLyAyKTtcclxuICAgICAgLy8gYW5jaG9yOiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMjQsIDYpXHJcbiAgICAgIGlmICghaXNOYU4ocm90YXRpb25BbmdsZVJhZHMpICYmIHJvdGF0aW9uQW5nbGVSYWRzID4gMCkge1xyXG4gICAgICAgIGxvY2F0aW9uLnNldE9wdGlvbnMoeyBpY29uOiBjLnRvRGF0YVVSTCgpLCBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludChjLndpZHRoIC8gMiwgYy5oZWlnaHQgLyAyKSB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gcmV0dXJuIGM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEFsbG93IGNyb3NzIGRvbWFpbiBpbWFnZSBlZGl0dGluZy5cclxuICAgIGltZy5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xyXG4gICAgaW1nLnNyYyA9IHVybDtcclxuICB9XHJcblxyXG4gIGdldFRocmVzaG9sZFZhbHVlKCkge1xyXG5cclxuICAgIHRoaXMubWFwU2VydmljZS5nZXRSdWxlcyh0aGlzLnRlY2hUeXBlKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICB2YXIgb2JqID0gSlNPTi5wYXJzZSgodGhpcy5zdHJpbmdpZnlCb2R5SnNvbihkYXRhKSkuZGF0YSk7XHJcbiAgICAgICAgICBpZiAob2JqICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIGlkbGVUaW1lID0gb2JqLmZpbHRlcihlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5maWVsZE5hbWUgPT09ICdDdW11bGF0aXZlIGlkbGUgdGltZSBmb3IgUkVEJyAmJiBlbGVtZW50LmRpc3BhdGNoVHlwZSA9PT0gdGhpcy50ZWNoVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZGxlVGltZSAhPSB1bmRlZmluZWQgJiYgaWRsZVRpbWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGhyZXNob2xkVmFsdWUgPSBpZGxlVGltZVswXS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBzdHJpbmdpZnlCb2R5SnNvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhWydfYm9keSddKTtcclxuICB9XHJcblxyXG4gIFVUQ1RvVGltZVpvbmUocmVjb3JkRGF0ZXRpbWUpIHtcclxuICAgIHZhciByZWNvcmRUaW1lO1xyXG4gICAgdmFyIHJlY29yZGRUaW1lID0gbW9tZW50dGltZXpvbmUudXRjKHJlY29yZERhdGV0aW1lKTtcclxuICAgIC8vIHZhciByZWNvcmRkVGltZSA9IG1vbWVudHRpbWV6b25lLnR6KHJlY29yZERhdGV0aW1lLCBcIkFtZXJpY2EvQ2hpY2Fnb1wiKTtcclxuXHJcbiAgICBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnQ1NUJykge1xyXG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ0FtZXJpY2EvQ2hpY2FnbycpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ0VTVCcpIHtcclxuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdBbWVyaWNhL05ld19Zb3JrJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcclxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnUFNUJykge1xyXG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ0FtZXJpY2EvTG9zX0FuZ2VsZXMnKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdBbGFza2EnKSB7XHJcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignVVMvQWxhc2thJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVjb3JkVGltZTtcclxuICB9XHJcbiAgXHJcbiAgYWRkVGlja2V0RGF0YShtYXAsIGRpck1hbmFnZXIpe1xyXG4gICAgLy8vL2xvYWQgY3VycmVudCBsb2NhdGlvblxyXG4gICAgdmFyIG1hcFpvb21MZXZlbDogbnVtYmVyPTEwO1xyXG4gICAgbG9hZEN1cnJlbnRMb2NhdGlvbigpOyAgICBcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuVXBkYXRlVGlja2V0SlNPTkRhdGFMaXN0KCk7XHJcbiAgICB2YXIgaW5pdEluZGV4OiBudW1iZXIgPTE7XHJcbiAgICB0aGlzLnRpY2tldERhdGEuZm9yRWFjaChkYXRhID0+IHtcclxuICAgICAgaWYoZGF0YS5sYXRpdHVkZSAhPSAnJyAmJiAgZGF0YS5sb25naXR1ZGUgIT0gJycpe1xyXG4gICAgICAgIHZhciB0aWNrZXRJbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDZ0FBQUF0Q0FZQUFBRGNNeW5lQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBTk9TVVJCVkZpRnpabFBTQlJSR01CLzM5dE1DQ04zTnkzSUxsR0MvVGxZVU9DZlRZSXdJU2p3Vm5UcFZIVEpnMUVnQ2RWRnExc1JIU0xvbkllNldGR2txN3NWRkVoaG11V3RQNFRNaWlpRnVqT3ZRNk03NnF3Njdyamo3emJ2ZmZOOVB4NnpPKzk5STZ3QTNVQ2hNVTZ0Q0xWYXFCU0xYUWhiZ0NJN1pBTE5ieEdHTlBScGlFZUw2SlZPSnIzV0VpL0JvekVxTFlzTENJMUFzY2RhbzBDSE1ya2JUdExucTJDcWpyM2E1QlpRNzFFcVc5Vk9USnFqQ2ZxWERsMEV2WWYxcVFnM2dDWmduUzl5R2RKYXVCMDF1Q3I5VEhrV05Pb29FNU1uR3ZiN0xEYmY0TDJlNXVUbU4veHduM2FUcTJZUElaNmoyYmFxY2htK0EvWFJIajdQbjFnZ09GSkR1Uks2Z2EzNU1IUHd5d3dSSyszaW0zTndqdUJJTlJ1VjRoMVFrVmUxREVOU3lNSElTOFptQnBSelZpa2VFcHdjUUxtZTVMNXpZSFlGalZvYWdjZDVWM0xCRWs2VXhIa0t0cUErUUVGcUE0UEFqa0ROYkFTK2hVTlVTQmRwQldCczREUnJSQTVBdzA0anpTbXduMEdCODhFcUxVU0Vjd0JpLzYxOENWcklqWkRKVGlYaTAvdDFGYkFVOVVxZ0ttaVJiRmhRcllEZFFZdGtSYWhRUUZuUUhvdFFwc2pzZ3RjY0Fwc1VlTitHNTVHL0N2Z1p0TVVpL0ZRQ3Y0SzJXSVFmeW9LQm9DMnlJVENvZ0JkQmkyUkY4MXpzVGFvQkZBVHRNNDhwTTBSVWxTUVladzJ1b3NDejBpNG1GSUFTMm9NV2NxRWQ3TzFXT0U0Y1NBYXE0MFRURStraEFjNHppZEFNbUVFNU9URFJYSnE1bUJXTXhrbHF6YzFnbkRJSXRFVVR2SFZjWjlBTkZJNU9rRnoxYmtJV0JENkVVMVE1V3lGempwM1N5V1FCSElPRkovdzhNSlFPY1h4K244YTk5VkZIR1NiZDVPa2dwV0ZZVzhSS0VndjNCY3J0aG1nWDN3dENIRUxvWEgwOVhwbFRWTHZKd1ZMdE4xQkdMWmNGV29IMVBvdE5pZEFhanRNbW9MTUZMYXVCYWNUWURyU2dPVXZ1ZlVJTG9TT1U1a3B4a3VHbGdqMjFnRWRxS0Zkd3htNEJlKzNoREtEcE1CV1BTdU44WGU1Tm5nU2RwR0xzMDVwdUlMeEU2S2dJaHlOeFBxMmtqdXVQWkRuWUJhOHZJL1RhU3VVZ0IwR0F5Qi91QUVQWjVqVU1SNHE0bDB1Tm5BVGxBOVBXLzNlNGUzSk4wMHEramN5cGtjdk5NeGcxdkVBNE9pZXg1bldrbHlPNTVzNXBCV2ZSTkFGcHg0aUpjTkdQMUw0STJoOWtIczRPQ0E4aVBYejBJN2MvS3doTW03UUFZOEM0cVdqMUsrOC9ka2psZmZlMDE2OEFBQUFBU1VWT1JLNUNZSUk9XCJcclxuICAgICAgICBpZihkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkgPT09IFwidW5rbm93blwiIHx8IGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJ3YXJuaW5nXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcIm1pbm9yXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGlja2V0SW1hZ2UgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ3dBQUFBekNBWUFBQURzQk9wUEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBT3hBQUFEc1FCbFNzT0d3QUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQVB5U1VSQlZHaUI3WmhQaUJ0MUZNZS83eVhUMWQzRlFoR0tlS25vS3Rqc1dtbHZ4UmFoOXFMVlM2ZEpab091QncrV1FpLzF0SWNXdk9pV3NsUzl1QWVKYXlhL2JJTUhLWXFvaHhRVVFZaGFOcFd5V0ZCV29pMzBvQ2gxTjVQZjg3RGJrSjFNSnBPZFpCS3duMXZlNy8xKzc1Tmg1dmVQc0ExTTA5eGhHTVpCQUljQVBBM2dDUUM3QVl4dnB2eE5SSCtJeUFxQUg1ajV5dWpvNkRjTEN3dTE3ZFJyaHJwSlRxZlRlNG5vRklBVEFIWjFXZXMyZ0V0RTlKNXQyejkxMmJkQklPRmtNdmw0TEJhYkEvQmkwRDQrQ0lCUG1QbU5YQzczYzdlZGZZdWJwaG1MeCtPelJEUUxZTWQyRGR1d0ppSnZPbzd6VnJGWXJBZnQxRlk0blU0L1NFUWZZK005N1JzaVVqSU00L2ppNHVMdElQbWV3cWxVYWc4emZ3RmdvcWQyN1ZrQmNEU2Z6Ly9hS2JGRk9KMU83eWFpSzlqNDhxUGtCak0vazh2bGZ2ZEw0dVlmTXpNejl4SFJwNGhlRmdBZTFWcC9acHJtL1g1Slc0VFgxOWZuQWV6dnE1WS8rd3pEbVBOTGFMd1NsbVVkQWxCQytHa3JMRnBFRGl1bHZ2WnF2UHVFQ2NCRkRGNFdBSmlJNXRIR2hRRWdrOGtjQTdBdlNxc09ISmllbm43ZXE0RUJRR3Q5TWxxZnpvakk2MTV4eW1ReUQybXRWd0hFSW5icVJGMUVIbFpLM1d3T3NvZ2N4ZkRKQWh0T3o3bURyTFh1NjlJYkJpSTY3STR4TSs4ZGhFd1FpT2hKZDR4RlpNOEFYQUloSW8rNFl3eGc1d0JjZ3RMaXhsNVpRMFNMSHdPNDZaRTRMRlRkQWZZS0RoR2V3aDAzelFPa3hZMDNOK3REaVlpVTNER3UxK3VmRDhBbEVDTHlsVHZHaFVMaEZ3RFhvOWZweUxWTnR5MHdBSWpJdTVIcmRPWWRyeUFEd01qSXlBY1lydW50VnExVys4aXJnUUVnbTgzK0MyQStVaVYvemhlTHhUdGVEWTJWcEZxdFhnRHdYV1JLN2ZsK2ZIejhZcnZHaG5DcFZISkU1QlVBbnY4c0l0WkU1R1cvVzg0dGE3VlM2anFBMXdEb2ZwdDVvRVhrVmFYVU5iK2tscFBHOHZMeWNpS1JXQ1dpWHR4VUJrVkU1S1JTS3RzcDBmTm9WS2xVZnB5Y25Md0ZJSXJqMDdxSW5GSkt2UjhrMmZjSnBsS3BBOHg4Q1VETFJycEgvQ1lpSjVSUzN3YnQ0UHYwS3BWS05aRkkyRVQwQUlDbk91VjNRUTNBUWp3ZVQ5cTJ2ZEpOeDhEdmFDYVRlVXhyZlE3QWNRQWozZmsxV0NPaW91TTQ1NWFXbG01c1o0Q3VQeXJUTkhjYWh2RUNnQ1NBWXdHN1hRYXdSRVNYYmR2K3E5dWF6WVNhQlN6TCtoTEFFYjhjRVNrcHBaNE5VNmVaVUdjNlpqNEQvemxiRTlHWk1EVmFhb2Jwbk12bHJnSlk5RW41TUovUGw4UFVjQlA2MUt5MW5nWHdqMGZUSGEzMTJiRGp1d2t0WENnVXFrUjB3YU5wcmxBb3JJWWQzMDFQN2lYR3hzYmVCdEFzVjQzRll1ZDdNYmFibml3RTVYSzVOalUxOVNlQWx3QkFSRTdidHQyWHJXclBibjRtSmlheUFNb2ljdFZ4SEw4UGNYaXdMT3VJWlZtKzgvSTk3dkYvNXovZDBqb0VQemhaR2dBQUFBQkpSVTVFcmtKZ2dnPT1cIlxyXG4gICAgICAgIH1lbHNlIGlmKGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJtYWpvclwiKXtcclxuICAgICAgICAgIHRpY2tldEltYWdlID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUN3QUFBQXpDQVlBQUFEc0JPcFBBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFPeVNVUkJWR2lCN1poTmFCeGxHSUNmZDJaTmFsc29pRkJVaExiWlRmcHpNTkxnUVRGRnFMMW9QWlY0VVp2ZHBKVFdIdXNwZ2dFdm1sSkNWZENnNXNjaVlzU0Q5Q0xxSVlHS0lMYmFRMnE3M2EyR2x0Z0tCUlZObXV6T3ZCNFMwODNzek96TXp1N3NnbjF1ODM3djkzMFBIN3Zmenl0VXcrUk1Dd3V0VDJCck4vQW8wQUZzQmphdVpQeU5jZ01oQy93SVRMUDA1N2NjN2lwVU5WOEpFaXA3L01vdVZJNkI5Z0QzaFp6ckZzSWtOdStRU1YwTTJYZVZZTUlUK1hac2V3aDRMbkFmYnhUNEFrdGVvVCtaQzl2WmYvSkpOWm5QRGFBTUFDMVZDbnF4aU1qcnJHOTdneDZ4Z25ieUZoNjVmRDh0eHVkQWR5M3NmSmpDS0I3ZzRJNWJRWkxkaGNkKzNnS0pyNEJVRGNYOHlHS1orK2pmTmxzcHNWejQvYXViU2RqVG9CMTFVZk1tVDZMd0pDL3UvTTB2YWEzdzJDL3JvSGdXMkYxUE14OStZc082eCtsNWVNRXJ3Vmo3YVEzVE9GbUFUdVp2RC9rbDNGbmg4V3czS2xORTM3YWlZbU1iZStock8rdld1THpDcW9MS0tSb3ZDMkJnMnNPb3Vyb3NDMC9rOWdPZGNWcjVvblF4ZHVVWnQ2YVZGZVpvckVKQkVJNjRoMDlmZklEaVBkY0FNMmFsU2xnVXpZYzR0TzFtYWRDZzBMS1A1cE1GTURHdHA1MUJBOUY2SDczVlk3Q25QQVM3R3FBU0RHV25NMlFBVytJM0NZcHNkVVlNWUZNRFRBS2laVzZHVzFvVFVlWm5BRGRkRXB1Rk9XZkFRTXVEVFlPb2k3Qm94VXR6dzFBcGN6T0E2UWFvQkVPWmNvWU1zTDVzZ0Vvd3BQaU5NMlNRM3ZFcmNDbCttNHJNckxpdDRiOXQ0KzE0WFFJZzhwWmJlRVU0TVVwemJXKy9zNzcxdEZ2RHNuQjY2MjFnT0U0algxUk9lRDFFNzV3a3M5ZFBBdC9INWVURGVRcC9uUEpxZER6ekwyOEg0enh3YjcydFBGaEUyRTF2YXNZclllMVpuZTY0aEhBSXNPdHQ1b0tOYXRwUEZ0d3VQNzJwajFIdFo3bktHQmVLNmxFeTdaOVVTblMvcldYYXgxQmVCaUlYb0FPd2hPb1JNdTBqUVpMOTZ4QWY1cnN3N0VtZzdDSmRFNFRyQ0QwY1RIMFh0SXYvZmJpdjdRZVc3TWRBM3FPMnExMUFlQmNwZG9hUmhUQ1ZuZzl5U1V3ZEJBNEFyZUg4VmxsRStBd1lwRGVWcjJhQThLV3BrZndtV3UxblVaNEg5Z2ZzZFFiaFV4S2M0WVhVWDZIbkxDRmFMVzA4OXpXcWV5dGtUWkZPUFJWcG5oS2l2ZWtzNnpqK2U3YU55UEZJY3ppSUp0elhjUUhrSTg5MllZTGU1TGxJY3ppSS9tcTJpd1BBUHk0dEM5anlXdVR4SFVRWDd0cytoM0xTcFdXSVRQSmE1UEVkMUtZdVVkandKbEFxTjRjNWY2SW1ZenVvamZEaEIrZUJ3ZFZ2MVZkNTZSRzNuMGxrYWxmNW1VMk9BK2VBQzJ4TWVmOFJtNHJSN0Y1R3M1WDI1YnZjNVgvTnYxb1k5cWRiRmtsMEFBQUFBRWxGVGtTdVFtQ0NcIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHB1c2hwaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZGF0YS5sYXRpdHVkZSwgZGF0YS5sb25naXR1ZGUpLCB7IGljb246IHRpY2tldEltYWdlLCB0ZXh0OiBpbml0SW5kZXgudG9TdHJpbmcoKSB9KTtcclxuICAgICAgICBwdXNocGluLm1ldGFkYXRhID0gZGF0YTtcclxuICAgICAgICBtYXAuZW50aXRpZXMucHVzaChwdXNocGluKTtcclxuICAgICAgICB0aGlzLmRhdGFMYXllci5wdXNoKHB1c2hwaW4pO1xyXG4gICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHB1c2hwaW4sICdjbGljaycsIHB1c2hwaW5DbGlja2VkKTtcclxuICAgICAgICBtYXAuc2V0Vmlldyh7IG1hcFR5cGVJZDogTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLnJvYWQsIGNlbnRlcjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGRhdGEubGF0aXR1ZGUsIGRhdGEubG9uZ2l0dWRlKX0pO1xyXG4gICAgICAgIGluaXRJbmRleCA9IGluaXRJbmRleCArIDE7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgbWFwWm9vbUxldmVsID0gbWFwLmdldFpvb20oKTtcclxuICAgICQoJy5OYXZCYXJfQ29udGFpbmVyLkxpZ2h0JykuYXR0cignc3R5bGUnLCc0ODBweCcpO1xyXG4gICAgLy8gY29uc3QgaW5mb2JveCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5JbmZvYm94KG1hcC5nZXRDZW50ZXIoKSwge1xyXG4gICAgLy8gICB2aXNpYmxlOiBmYWxzZSwgYXV0b0FsaWdubWVudDogdHJ1ZVxyXG4gICAgLy8gfSk7ICAgIFxyXG4gICAgZnVuY3Rpb24gcHVzaHBpbkNsaWNrZWQoZSkge1xyXG4gICAgICBpZiAoZS50YXJnZXQubWV0YWRhdGEpIHtcclxuICAgICAgICB2YXIgbGw9ZS50YXJnZXQuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICBsb2FkVGlja2V0RGlyZWN0aW9ucyh0aGlzLCBlLnRhcmdldC5tZXRhZGF0YSwgbGwubGF0aXR1ZGUsIGxsLmxvbmdpdHVkZSk7XHJcbiAgICAgICAgLy8vL2luZm9ib3guc2V0TWFwKG1hcCk7ICBcclxuICAgICAgICAvLyBpbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAgIC8vICAgbG9jYXRpb246IGUudGFyZ2V0LmdldExvY2F0aW9uKCksXHJcbiAgICAgICAgLy8gICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgIC8vICAgb2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMCwgNDApLFxyXG4gICAgICAgIC8vICAgaHRtbENvbnRlbnQ6JzxkaXYgc3R5bGU9XCJtYXJnaW46YXV0byAhaW1wb3J0YW50O3dpZHRoOjU1MHB4ICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjogd2hpdGU7Ym9yZGVyOiAxcHggc29saWQgbGlnaHRncmF5O1wiPidcclxuICAgICAgICAvLyAgICsgZ2V0VGlja2V0SW5mb0JveEhUTUwoZS50YXJnZXQubWV0YWRhdGEpICsgJzwvZGl2PidcclxuICAgICAgICAvLyB9KTtcclxuICAgICAgfVxyXG4gICAgICAkKCcuTmF2QmFyX0NvbnRhaW5lci5MaWdodCcpLmF0dHIoJ3N0eWxlJywndG9wOjQ4MHB4Jyk7XHJcbiAgICAgIHBpbkNsaWNrZWQoZS50YXJnZXQubWV0YWRhdGEsIDApXHJcbiAgICAgIC8vLy9NaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihpbmZvYm94LCAnY2xpY2snLCBjbG9zZSk7XHJcbiAgfVxyXG4gIHZhciBjdXJyZW50TGF0aXR1ZGU9NDAuMzEyODtcclxuICB2YXIgY3VycmVudExvbmdpdHVkZT0tNzUuMzkwMjtcclxuICB2YXIgZGlzdGFuY2VEYXRhID0gXCJcIjtcclxuICBmdW5jdGlvbiBsb2FkQ3VycmVudExvY2F0aW9uKClcclxuICAgICAge1xyXG4gICAgICAgIGlmKG5hdmlnYXRvci5nZW9sb2NhdGlvbil7XHJcbiAgICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIHZhciBsb2MgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG4gIFxyXG4gICAgICAgICAgICAgICAgLy9BZGQgYSBwdXNocGluIGF0IHRoZSB1c2VyJ3MgbG9jYXRpb24uXHJcbiAgICAgICAgICAgICAgICB2YXIgcGluID0gbmV3IE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4obG9jKTtcclxuICAgICAgICAgICAgICAgIG1hcC5lbnRpdGllcy5wdXNoKHBpbik7XHJcbiAgXHJcbiAgICAgICAgICAgICAgICAvLyAvLyBDZW50ZXIgdGhlIG1hcCBvbiB0aGUgdXNlcidzIGxvY2F0aW9uLlxyXG4gICAgICAgICAgICAgICAgLy8gLy8gbWFwcy5zZXRWaWV3KHsgY2VudGVyOiBsb2MsIHpvb206IDE1IH0pO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudExhdGl0dWRlID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudExvbmdpdHVkZSA9IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50TGF0aXR1ZGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudExvbmdpdHVkZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBpbkNsaWNrZWQocGFybXM6IGFueSwgbGF1Y2hUaWNrZXRDYXJkOiBudW1iZXIpe1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCdlbWl0Jyx0aGF0KTtcclxuICAgICAgdmFyIHNlbGVjdGVkVGlja2V0ID0ge1wiU2VsZWN0ZWRUaWNrZXRcIjoge1xyXG4gICAgICAgICAgXCJUaWNrZXROdW1iZXJcIjogcGFybXMudGlja2V0TnVtYmVyLFxyXG4gICAgICAgICAgXCJMYXVuY2hUaWNrZXRDYXJkXCI6IGxhdWNoVGlja2V0Q2FyZFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZygnU2VsZWN0ZWQgVGlja2V0OiAnICsgc2VsZWN0ZWRUaWNrZXQgKydsYXVuY2hUaWNrZXQ6ICcrIGxhdWNoVGlja2V0Q2FyZCk7XHJcbiAgICB0aGF0LnRpY2tldENsaWNrLmVtaXQoc2VsZWN0ZWRUaWNrZXQpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBjbG9zZShlKSB7XHJcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdmYSBmYS10aW1lcycpIHtcclxuICAgICAgJCgnLk5hdkJhcl9Db250YWluZXIuTGlnaHQnKS5hdHRyKCdzdHlsZScsJ3RvcDowcHgnKTtcclxuICAgICAgLy8gaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgLy8gICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgICAvLyB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gbG9hZFRpY2tldERpcmVjdGlvbnModGhhdCwgaW5mb0JveE1ldGFEYXRhOiBhbnksZW5kTGF0LCBlbmRMb25nKSB7XHJcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zJywgKCkgPT4ge1xyXG4gICAgICBkaXJNYW5hZ2VyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuRGlyZWN0aW9uc01hbmFnZXIobWFwKTtcclxuICAgICAgZGlyTWFuYWdlci5jbGVhckFsbCgpO1xyXG4gICAgICBtYXAubGF5ZXJzLmNsZWFyKCk7XHJcbiAgICAgIC8vdmFyIGxvY2MgPSBtYXBzLmdldENlbnRlcigpO1xyXG4gICAgICB2YXIgbG9jYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihjdXJyZW50TGF0aXR1ZGUsIGN1cnJlbnRMb25naXR1ZGUpO1xyXG4gICAgICAvLyBTZXQgUm91dGUgTW9kZSB0byBkcml2aW5nXHJcbiAgICAgIGRpck1hbmFnZXIuc2V0UmVxdWVzdE9wdGlvbnMoe1xyXG4gICAgICAgIHJvdXRlTW9kZTogTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5Sb3V0ZU1vZGUuZHJpdmluZyxcclxuICAgICAgICByb3V0ZURyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICB9KTtcclxuICBcclxuICAgICAgZGlyTWFuYWdlci5zZXRSZW5kZXJPcHRpb25zKHtcclxuICAgICAgICBkcml2aW5nUG9seWxpbmVPcHRpb25zOiB7XHJcbiAgICAgICAgICBzdHJva2VDb2xvcjogTWljcm9zb2Z0Lk1hcHMuQ29sb3IuZnJvbUhleCgnIzAwOWZkYicpLFxyXG4gICAgICAgICAgc3Ryb2tlVGhpY2tuZXNzOiA1XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaXJzdFdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogdHJ1ZSwgdGV4dDogJycsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEMEFBQUEwQ0FZQUFBQTViVEFoQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBaDlTVVJCVkdpQnhacHJiRnpGRmNkLzU5NnM0L1Y2dlU1c0VsTzJJWEdhaDIzeXNKMUVFTkh5VUIra2xINkJ2cUJxb2EzVWg1RGFTa1dJaWxKVXFTSWlxb0w2VUlWYXBMWWkxT1VoRUxTZ3BoVW9rSVpFSkNZeDhTT0pZMXlKQkNleDExNTcxMnZ2N3AzVEQ3dHIxc0hHOTNydnF2OHZPM3Z2ekgvTy84N01tVE1Qb1l6bzI3QWhQR1ZabjFlUm00R3RpS3hCTlpKL1BRNE1vSHBDNGRWMEp2UHl0ZjM5NCtXMHB3QXBCMm5YcGsyTmpqRVBvUG8xSU9TeTJLUkNoNG84MHQ3ZDNWOE91d3J3VmZTaGFEUVlqRVFlUnZYSFFHQ1JORm5nTVNjWS9QbTJZOGNtZlRSdkJyNkovdWY2OVJzclJQNVZhOXRSWHdoRlRvbnE3VnQ3ZXJwOTRTdUM1UU5INFBiYTJvY3FSVTc2SmhoQWRZUEN3YzZORzYvempUT1BVbHY2NDgzQjRFdS9YN1ZxUzQxdCsyTFFoeUFTdHgzbms1djcrdDd4aTdLVWxyNjF4cmE3SG8xR3l5Y1lRRFhpV05iZnUxdGFsdnRGdVZqUnR3SXZQTkRRVUh0VllMSCt5aE5XcFZVZjk0dHNNYUszQXgwN1FxRWx0MFFpQzJiMkVYZDBOamZ2OG9QSXErZzY0RVdnK2tjclYvcFJ2eWVJNm03MVljWlo0akgvSHFCaFd5aEVVMldscDRJOXFSVFBqNDF4SXBVaTZUaEViSnR0b1JCZlhyYU1hRVdGT3hLUnpTZXV1ZVl6bkR5NTM2UGRzK0JGOUViZ0d3QmY5TkN0TTZyc0dScmkyZEZSdE9qNStVeUczcWtwL2hxTDhZTXJydUNlK25wWGZPbzRkd01saWZiU3ZlOEZiQXU0cWFiR2RhR09XR3pmTTZPanR5bnNBcjRIdkF3ZjZNK3E4dXVMRi9uajhMQTdRcEhianJhM2wrUTkzWTRQRzdnQTFEVlZWdkpVWTZOYi9tZGJlM3ErTk1mekc0QU9vS0h3d0FJNkdodFo1MkxZcURFNzIvcjYzblJyeE9WdzI5THQ1SndZVGNHZ2EzS2orcXQ1WGgwQWJnRlNNM21CcDJJeFY3d2kwdXJhaURuZ1Z2Uk1KVkgzODNLeXJiZjN5RWU4UHdIc0xYNXdPSmwweS8wSnR4bm5nbHZSYXdxSmlQdm9hMWlZNWJ2bXdwK0svOFN5V1hmTWxsWG4xb2c1aTd2TUZ5NGtsbHF1ZmQrVnI2MWV2ZEFBN1FkbWxvK3VweTVWOTJOc0RyaFZNTlB2RW83amxydWlOaGk4WllFOFM0R1pEM05qT1B3UldUK0FpSlMwdytKVzlLVkNZdHk5YUJCNTZPbWM1NThQTnhkc0NOczJkeTEzdDZZd3hyaWMzK2FHVzlHbkNvbHptWXdYL3RaMUxTMi9tU2QwRk9BQmdBb1JkbDkxRmN1WHVJdVZMSkYzdlJqeG9mSXU4eDBpNzVSNnBxYTgxYUQ2L2VQTnpjOTNOalZkWGZSVWdOM0E5ZXNxSzNsaTlXcDJWbGU3cGpTV2RjeWJFYlBoSlhqdkFqYlpJaHpjc0lGSzl3NnRnTFRDYStjeW1YY1BURXg4S20xTTg5YXFLclpXVlhsZFFVeFhwOU9SZGYzOTAxNE5LTUJMN1AwMHNNbFI1VWd5eVEwdW5VNFJLZ1ErRncwRVhJL2RlZkJxS1lMQlcremRRYjZMdjU1SWxGSm5TVkRWbDBybDhDSzZuL3pxNXNERUJJNHVGSGVVQVNLTzVUZ3Zsa3JqZFdEdUJSakpaam40LzJodDFmMWJUNTgrVnlxTlY5SDdnVTZBRjhiR1NxM2JNMVRrQ1Q5NHZJcFc0RUdBTnhJSjN2YzJaNWNHa1hOTG9lVHhESXZiR0h3Rk9PQ284dVRJaUI4MnVJS3E3bTNwN2s3N3diWFlMZUI3Z2V3TFkyUEV2WVNsaThkWU9wMytnMTlraTkybHZ3aXN6S2p1V0NMQ2pwRGJnOG5GUVVVZTJYN3FWRW43WXNVbzVZVGpwOEIvOThWaWpMaGRCeThPSStucDZjZjhKQ3hGOURqd3JaUXgrb1RiVGIxRlFPRVJ2dy9yU3oyMWZCWDQzZE9qbzV6eHVoQnhoelBoZFBxM2ZwUDZjVlI3djZONmV2ZlEwSUo3UTE2aDhNTlM0K3k1NElmb1NlRHV6c25KelA1eC8zcWh3SE50UFQyditFWllCRDlFQTd3SjNMOW5hSWlrTWFXemlhVFVtSitVVGpRMy9EeFlQcHd5cHRsUmJibld3NGJBWEJEVlg3VDI5Wlc4c0pnUGZyVjBBZC9lRjR2MXZwTktMWnh6Zmh3UFdOYWpmaGswRi93V25jaXEzdkh3K2ZPSjZjVXRQYWVOWlgzVHIzQnpQcFRqM3NTbFVjZnBUS3ZlZVYxMXRhZWRJQlg1V1h0MzkzTmxzR2tXeW5WWjVHeFBLalhXRmdydCtwakxZeUNCdzJkNmVyN3p6TUtuSWlXamJEZGtEQndaU0tjYlAxdFRzNlZDRm16d0NWUjNmWHE0aktGZEVWeDN2MFBSYURCWVhiMVM0VXF4ckJVQ2RZaEVWRFdDU0NSLzU3TWFRS0ZTSUdoQS9qdzh2T09lK3ZxUDNrVlVQU2VXTlpSTGFncVl5dk9rSko4R0VvakVVWTJqT2lZaWNZV1lHbk1Sa2ZQeFZPckNUWU9EcnNMQ1dhS1B0cmNISkpuY2JOdDJ1NnF1UTJRdHFvM0ExVUJ0VWRZRUlwZFFqUmNNRVpHNHFxWVFjZFNZY1FBUmNhWWdlWGhpNHI0YncrSGk4a1VXeUg4RS9xS3FOU0ppNTRYWHFLb05JSlpWZzZvdElzRlpIemozZTBYaFErY3hCZ3lxNm9DSURJaklHVEhtYUthcTZwMXR4NDdON0hqSW9XZzBXRlZUODFYZ0xvWHJ5WjB2RFFLOXFBNklaUTFnekx0cTJ4ZXNUT2I5WkRJNXRQTzk5enpOU2JlRncvVVBScU92VjRnMFhmYXEyd2tHZDVSeUIvUlFOQm9NaFVJTkpoQzRVaHhuSlphMVJvMXBGSkcxbXJzeXNocVlCdDVBWk45WU10a2h4NXViLzYyd0JkVy9xY2cvVERiNzFyYlRwMzBmVzI5djNMZ2F5M29MS0Z3dW1WQ1JhOXU2dTN2OHJxc1lSOWV2cjdlV0xOa3VJbDlBOVN2QTI1Ym14dUs0V3RZRlcvVUM0WEM4SEpXMzl2VU5hdTRxZEJZd1lsbDNsbHN3QU9GdzNJSWh6VjBmaVFNUjZkcTBhVm5XbU8rSzZ0ZUJscnpqT0s3UUo2cG5qV1dkeFhFR2pXMmZTOGZqbDd4MjdjdnhkbFBUZlVCRmEyL3ZMMzJRQkVCM1M4dnl0REYxcWxvdnRyMUdqR2xVa2JWQWs4QVd6UjBIbnhTUkp6VVFlSHlXSXp1eGVmTUtrOGxzVjh0cUU5WDFlVWUyRmxoUmxHMENlQjhZblhGa01Fck9teWFzM1BqQnFFNWFJdE1BcXBvRTBnQUtDVkhOYW1FK0ZnbEkzaGtKTEVXa0tsKyswaExKSGI2clZnRWhoVHFGT29IbEFuVXFVb2RxSGJNanl3dW9ua1ZrUUZSUEtYUmFnY0RSTFYxZEZ3c1pYRTFaUjl2YnF3S0p4RXBIcENFL1hUVVlrV1VZVTR0SXJaV2J1bXFBQ2lBaUlsWmViS1RJb05xaStwYmxmNVdjeDRYY1hadkMwSElLQisrcW1nVW1FSmtXaUNtTWlERWpCa1pFWkZoRWhoMlJFVHVkSHBtY25JeTU2WW4vQThGSVMyMDVPU0tlQUFBQUFFbEZUa1N1UW1DQydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICBsYXN0V2F5cG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiB0cnVlLCB0ZXh0OiAnJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRDBBQUFBOUNBWUFBQUFlWW1IcEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUFDWEJJV1hNQUFBQklBQUFBU0FCR3lXcytBQUFZMWtsRVFWUm8zcVdiYWF4bDJYWFhmMnZ0Yzg0ZDN2eGVEVDFQN25iYjdtN2IzYzVrNGhnTE1CL3lJYkVpRUVJSkVpQUhnUkFTZ2dCQklSOVE1RWdnaElRVlI5QUppYkNJRVFxS0ZER0lLU0dPb1JQU2RsdmRkTHVySjNmMVVGVmRWYStxM25TbmM4NWVpdzk3bjN2dnE4RmREVWU2OVc2OWQrODVlKzAxLzlkL2k3dHp1NWNacUtiM2J1QUtPQmlHdTJBT0JwaERkTWM4L1Q0aTRJNDdJTGU0dVlNSUlFTEFFWEZVbENDQ0NpaWdRdm85Q2dKaUlIcmoydDd2a3RzUjJqMnZWY0RNY0ZYY0RIUEIzREFVYzJnczRpaU5HNjA1clVNMFQ1dmg0SUNadTZpSU9RNk9pb2lidTZxSVpNRlVvRkFoNUorbEtJSlJha0FGQW9hSW91S0lLbUtHWm9tOTI3ei9INkVkd01BbHZYZXp0SGgzb2l2UmpjYWR4cUIxcDQ3UUF0UFd2REVuT3JTZDBPWVlqb2dzTk83ZzdpaUNhTkpxa1YrbENyMUNwUUNxQUtVSWhVSWxrcTNBVUJHU2dTaEJrOFpGYjIxUUFNWDdDZXg1OTAzU29pTWtRY3hwUFZJYnpGcW5ObWRxN3JNSVV6UHE2TFFHalRremd6b2FyVUdVdERCekEwQkZVQldDa3dRS1NrK2hERUlwMEF2bWxTcURBSldLOUFxaENsQkpuRzlNMHI1anBQZldhZlNEQ3QwSlRQYlA2RW03clNWdDFnYTFPWlBXbVVUM1NXdE1zOEJUZy8yNjVhaUJVZVBzTlpIRDJoakY5Sm5XSGZQMEJKRmt2bjJGbFZKWXF3S2JSVWp2UzJHakN2VFY2S3ZTSy9CaFZBWkJwQitFbmdwUm5US2srRkpZV3JNZ3VOeGE4T0pXQW5jTzRnZ0d0REdaY1cwd2FaMlpPYVBXZk53NG85YVltbk5VTzVlbUxWZHE0L3c0Y21YV3NqK0RHWlllM3Uya0xEOUZ3T094MVpXcWJKUndzbDl3MTBwZ3AxSk85QXJXSzJIVUdpc2grTENFUWFFeVZLR1BVTHJqR2lnMEJUM0p6bjJ6MkhtRFQvdGMzcVFOUTRudTFGbXdTWFJHamZ0UmF4eld4c1NjL1NaeWJ0UnliaFI1ZDl4d2VXcVlKTXR3RTZJYlNJcnUwc21lbnl2Wkp6czNFbmRVTlVkdklSaWNIQ3AzRHd2dVdTMjRjMUN3VlFZR0txeFd5bXFwckJRaWd5RDBnMmEzRUlUczd6bXF5YTJFdmw3ZzZCQmRtRVZuR28xUjY0eWkrMEZ0SE5TUm85WjRkOVR5M2FPR2Q0NWFkdXU0RUZTUzc3dWxlN2tJdU9EY1BIQUtBdUpKYUVsQkxRZ0VCMUVuaUxEVEM5eTdVdkNoMVpKN1ZncFdTMlc5REt5Vnltb2hNaXlFUVZDcUlBUnhnbkJUd1lzYkJLYkx0VUxyS1FDTlcrZW9OUTRiODRQR09HaWNLN09HVi9aYVhqOXF1RGlPUkVpQkt2dCtsNnZKdWR2ZEVlRjdDTDM0akpMQy9UeEhlNHJtbHliRzFXbk54VW5rUTdPU1I5ZEttajdVWnJTbUhsM0ZIVnlFbnVvOHpTb0xDNU5PYU8vc1B5L1drQlN3Y3FBNmFvMzkybnl2amh3Mnpqdmp5SXZYWnB3OWFqbHFuUmlOTm4vSFJMQm84N3pzblppK3ZMVnlrL2MrLzVVQTRrTEVrOUJCYWMwcEZLSTQ1OGJPWG0xY25VVWUzK3h4NzdCSTlVQjZuS0NhRXJZS2hhVENLQlUyU2NaamdjdzloZjAycGtBMWpzWlJZeHkwN3RmcTVNT3ZIVFk4ZjdYbTNMaWxObWdzRlNLUlZJaTRlMHB2dnJBZFI0N0xlYXU0S292TjZUNXFJbWhyU0U1Rk1hY21hNXd6ZXcxSGpWTnY5M2xvcmNERndNVmRUQ2lCWExrVm1tSkZaK2FGNTJCaXBGeHNCbzJub0RWcW5iMG0rdDRzcFoxWDltdStmWFhHcFVsazVrNXJRalNuN1VwUUE4ZUFIRFdGSkREZkkzOWMvd2RabUdIS2FrNTBSMXlUNjBrS0ZsSFRCcnd6YXFuamxOcExIbG1yVWlHRnVJcUlpaEZFYzR4STkxUVJDb0ZjSmladE5RYlRDT1BHT1d5aUh6Yk9RUk41L2FEaHVhczFseWVSbVVNZG5XaUxITzZkaVhaUk9xZUwyNi9zYjdJSk9RT29DTzVHZE1GY2NIR0NhNG9CT085TldwN2ROUVRodzJzUU5GQm85RUFRV2FvQXV6Uld1Q1VyaURHWlRXMldJN1hOby9SM2oxcStkWFhHcFVsTDQ4bWtvd3ZSak5ZbEd4eVlMSUtISDEvK1BCdTAxbTNTNHU5QklHalNnR1lUbkc5V3Qza2lxRnNxWTEwWDNVYnVOQzVOSXQvYW5WSUpoSkFpZnluaWhZb1VhcWdvaXFPRlVKaDJDbExhYUV5ak0yN2RENXNVcEM2TUl5OWRuWEZoMU5LWVUrTTBKbmhNRFlmVCtac3VGcnZrbDdYQkpCb2w4TEd0SGs5c1ZkdzlMTmpvQmR5TXZjWTVQMjU1NlZyRFMvczFqVVVHUVNtNytqa0xUZDVVeFZMZWQ4VmowcGhqdUFqbko4YnoxMnFHcFJKV0NpcDFTaFZLVlFweHlxQjRMbmVwYzRjMGEyRVduWEVUT1dxRmEzWGtPd2MxcngxRm9qc05Rb3lwMHpLWDFGS0tIby9EMmRUYlhBRC80TWtlZis2aE5UNXpxaStUMXZqV2xkcmZPS3c1ZTlnQXNGa0puejA5NEc5K2JFTUdRZmpHZTFQL04yZVBlSFozbHRLTDVxaVFoYmNjbktJYjZrbFJ1TktvSU9KODk3QmxxMWV6VmlyOVVOQ1A3cjFvVWlDb1J2b2VLTXpKL2dJellOTGlSMUU0YWxyZVBHdzVzOWRnYnFtTHlwRjZXZUJqZ2RkVE8xa0lmUHJrZ0wvKzBUVjJlc3EvZk8yUW4zbDIxOSs1VmpPUGExMy81NHZjZHU5V3haKzlmNVV2UGJYRjdzVDU4aXQ3ZlBQeURJUGNZeSswN3FLcGFYR2x0UlE4Z3dodGdCZjNhazcyQXNPZzlGWHBGK285UlNwUGpZN1UwWmxhWk5JNGh3MWNtYlYrZFJwNTQ2amhtVXNUM2ppSzFORm9vdE40Q2w0bVRtb0dqNmU3eG1HckV2N1dZOXM4dVYzeWoxL2E0MnV2SGdJa1g4cTU4bVpYdDJIV3BscjFKeDllNCs5L2ZKTS8ycTM1cHkvdXNkL1lEZDlQVWQ1UUY0S21qcXRLN1NnUHJSWjg1bFNmQjFaTGR2cUJuYXFRdFI0TWc2Sk9FcVF4bUpyNUpEcjdUU292M3hxMVdMYUNTQWNFM0ZqQ2UrNm5IOTJvK09jL2RKcm96cWYvMHptKzl1b2haU24wS3FYVVJUbDRzNmd1SXFsL3JwU3lFSDdqdFVNKzlSL09JZTU4NVlkTzhPSDFrc2JJM2RueFNPOTBGYUFreGJoeDlxamgzYkZ4MEZqcUJNMjhpYWxpMUdTeWtycW1hSXhiWTdjMlhqOXNsd0FBeWFWbHFxRTlWY3B6Z1djUlByWFQ0eDk5M3c3LzdxMGp2dmg3RjZtajA2djBXRFR1R2cweFI2TGgwWERMeVc0cDRxc2s0ZHZvL0tXdlgrVGZ2ejNtRjU3YzVxbWRIbzB0TlN1a09zQkY1cVd2dTlMa2N2aVYvUmxYYW1NY2pYRjBwakVwcDRndXRHWk1vL3UwZFk1aXludnZUZHUwZStZcFBYbG5Va3NDQTlQb2ZHeWo0dTgrc2NuVFovWjQranQ3bEwwd0Z6YkRZMGdkb1luUUdCSnpKWk1raEY3UklRaDRTTktuSUNab3BmeVRGNjl5MEJwLys3RU52dlRDSGkvdTFmVFVsem8wU2ZyT2FUR1lZeXE4TjQyOE4ybzQxUXVzRkVZZGtxeEY2d2tNbUZucXBBNW1rYmNPR3N5Z1pRRWVlTmNwTFYzUm5KMWU0Tzg4c2NsdnZ6dmg2VE1IbEZVNG5tdnJpSXdhWkZRbndXMEJZczN2NWpPOFVGZ3BZVmpCTU13M1YwVW9DdVhwVi9mWnFKUy84ZEVOZnU3YlY3azJpNVJMeTBsOXZ5TzVVU3JjaVNhOGVkVHk0SnF4WGlremMyL01SV1BHdGVxWXpIUy9OczVQMmxScG1jeXJ0ZU9sUmpLeDJwMHZmbmlEYytQSUwzMW5qeUlzK2EyUWhMMDhScTlPa0ZsTVh3eTZRUC9tTHhBelpIK0tYQjRoZTlNVVJEcHpSeWhVZVBxVkE4NVBXdjdpdyt2RXJJaWxvSUF2ZDNpV1RQN0N4Tmh2SXRQb3pMSjVhOEs2MGkvR3JYTnBGaGxIaUVqMkVjbWQwbkVVb2pGNFlyUGl5WjJTTDcrOHh6UmE2bVE2Z1k5cTVNb1luYmJKeERXNXlLUXhKclBJWk5xbVZ4MlRuK1lORVRQazJoUzlPbDRDR2xKN2VOUWF2L3JxQVk5dmxqeSttZng3NGR0ZFIrY0pkdllrdzdnMUxrNGowemJKMkxwVDVCYlNhL1AwZ1hHY1I4TjVlOWgxRDh2Qnk1dy8vOEFhLyszOG1GZjI2MFhySmlEVEJ0a2RKOS9WMU01Tkc2TlhDSC95b1hXZXZIUEl6ckJnMWhxdlg1bnh1MmNQT0gvUVVJVlVqdUtPSE0wUUJUOHhSSEl0TCs2YzJhLzUvWXNUL3N3REsvejh0MmVVdmtoanFZdE1hK2dzMUlFTFkrTWo2OFlzS3JXNUYrYXArVzhOWmdhN3N4YTNoWmwwcHIyczVlanc0RnJCd3hzbFh6NnpSMjJwSU9sQU9TNk41Z0tiTzIxMG5ycHJ5TTk5OWk2ZXVuTW9KMWRLaHFYUUdseWJ0Snpkci8xZmZmc3l2L2JjRlpwb2xDSDF3N0kvZzJHRkR3c2szWTVSNi96MzgyUCs0Wk03UExSVzh1Nm9YZkx0cFBPNXdqS2djR21TMnVDWVpTMWNFanJaZUdUV1J2WWJ4OFdKc2Z0UzV6c0xUVGZtL09DSlBtZjJhczZQMjBXWktNRCtGS2xURStEdW1NR243MXZscXoveG9EeTQxVDhXQ01zQXAxWkxUcTJXOHZIVEErNWRyL3dYdjNHQmFlTXBQcmpqbDBmd3dHYmFoQXdJdkR1T3ZIYlE4S21kSG1jUEcwcVZ1ZENwRGs4YWo1WjI2ckF4WnRGUzcrK2FmTnB5OTNQWXBQVGt1UlZMNFA2TkZWUmo4TW10aWhmMmFzWnQwa0NLT0lydVRSRk5HOUJFNTQ3VmtsLzd3Z00zQ0h6OTFTK1VuLzNzWGZLRmoyd1JRcklRSktVNm1iWnpTRGNJSE5UR3EvczFqMjJVYzc5ZXZ0d1duVm1VaEFRZDFEWWZPbWlxWVZNaFA0cVdZRjhUZkFrNHZyN2NMQlR1WFMxNTQ3QmxHbjN4OTFrRGRaeC9ybDhxUC9YSmJSN1pHWEM3MXk5Ky9oNVpxNVJveVVsRkJmWm54OUxjS0RwblI1RzdWd3I2aGQ1WXBjMExDY0VUUU1kUjlEeVpBWFd6UEc5S3RmVU5UZjkxaWphSEU0TkFjTGd3Ym1rN254ZVFIS2s3SUdHMVZIN3k0eWR1VzJDQWU5WXJQbkhISUFlbHBHMnRtMlByaUdic1RsdHc0VVF2cGFxYnJibXIyeHluOFl3T21hT0lvSm9taW0yVURQSGNHdkZ3WUNVSTAxempkdjRNSU0yeVJVQVpsTWRPRGQ1bm5IYmo5WDEzcmMwREk1Q2E4azZlL0t6V29BRUdoZHh5cmN2ZmFkdVlTdUE4RFBqQWtJNktwbEh0OFR1RHhia1pPaEQwL3cwc1d1MHRxZXVtQzB5OWM1cUgzZDZleHFXYmFPZkRrb2RnWFp5KzFhMEVHRFdSWGlFVUdVRG9BRHl2QWl3MUE2MEpSN1h4UWErejE1cFVVdWIvMjlMYzJUTXFVK1N1Yk5hOC8vM2RvUW9odXd5b3FCSlVVSVF5eUJ6ak90WlZMQXN0Y0sxTzFkZFdGVkRKZ3poSTlYUCt2QXFNRytPL3ZyNy9nZFg5djk0K1RJRXNQMStxWW5uQWhvcXdWaWtGd3JYR0Y5bGo4Wkg1V3BHMHRsSlNPWnVtcEo0RUNHS3NoQ1N0U0NvNnV6bmI4cXBGaEVscnZEZHVlV2k5b0srNndNVUc1Und6VW9GUkhmbjE1eTUvSUlGLzg2V3JmdjZ3bVZkNHVPT3IxZHlDSEJnRTVmNlZrc3ZUeUdGck4xcGxSeUxJd3dJa3hTSHBTdjNRelhkRldDMlY0STQ2U0xaemtlT0s2bHErRi9acUh0dW9HQlFwVWdNUUJGc3BNOUNZQXN6L2ZQdUlyL3p2UzdlbDdUZXVUdm5TMXk4d2JtSmFiTmUvcjVaMHl6Q0g5Vko0ZUxYa3pINTlVelJHWkRFcFZFL1E0WG9saExURVJOTW9SQ2dTbHNSYXBhbmtVK2FSV1VTT3FidFU0ZG5kR1IvZnFqalpEd3R3SURxK00waVJ3ZE1zNnJDTy9NTFh6L0hMejE3MEsrUDJwc0thTzMvd3pwSC85RytmOWU5Y25peUdidWI0V2krVmJuUVRHRGc5REh4a3MrU2JWK3FsYW94NTFkYjEyVUZUV2J4U2hUVFJsRFRtS1VKK1Uyb2FkVzcxQTlmcWlOcUM0R0x1eHdkZ0FpL3YxZXcxeHVkT0QzanpxSjEvaGw2SmIvU1JYSm1WcXV5T1cvN2VmM21YUDNocjVIL3E0WFVlMnVxeDNnczAwYmx3MVBETmN5UCs3WXRYZWYzS2xDSWt2OE1jTHdOc0QrZ1FqR1Rhd2g4NzJlZXdNYzdzMTVUSHlEVU9KTFJHOC9CUEJIWjZnVjRlNDRaTzZESkFGWVJCRUU3MWxUY1BPNEZ0eVQrV0FIcEpTTVZ2bmgzeHhVZlcrTS9uSjd3emFsTHphY0RXRUc4c0FRZFo4RG82Ly9yNVhYN3I1V3M4dE4xam94OW9XdWVkZzVvTDJZZXJzS1JoRmZ6a0VDOEV5YnlVNlBEZ1NzR1AzcjNDVjc5N21MZ3FTNGhzRWprQkNaclpTUWljNmluOWtFRERNaUNxaWJjaGxRajlBS2Q2Z1VwSXpKM3MwOGsvajd0bEZZUm5MazI0T0kzODlLUHJlWUNmWFNtM2hMWldnYWNOQ2lyMHl6UjlmUG55aEdmZVB1S2I1MGZzamx2NlJVSXdCU0FhWGlsK2FnVWZIdmZsUXVFdmZHaU5LN1BJSDE2ZVVvWGp1WHh1MnJJWStaWXEzRFVJOUJKbkpVRlFoU2JuTGtPcWJqWjdnVk9Ea0tHYUZPQTZ6UzRQSGpVakZWOTVlWi9QbmU3ekV3K3Mwa2JQODZXVXZueG5pTzMwb1ZTSWhuaDZWaFZTL09nVm1nSVJMRXg0clllZldNRlhsZ1ZPOFBDUDM3UEtqNXdhOFBTckthVXR3MUt5YklVaTg0QjF1aC9ZN0FVR1JacWFGQUlhSkJGV2VpcjBnckJSS3ZldFZ0bDMwdzNVTzhUcXVMWkxoYmVPR243cDVYMyt3U2UyK2ZUcEFYVmppd0luS0w3ZXcwNnRZRHREUEFlOU5MM1BUYnpuRGRyc1lYZXNwVURZTCtZQ3V6dE42L3pJNlFFLzgvZ212L0xhQVc4ZU5WUTNFT1hTWm1zT29FRUZRWGh3dFdLMVZIcXE5RUllOFNTQ21sS3BTVCtJcnhUS25RTmxweC9ZblVZS2Qxd1Y4emh2QUxvdEVFbjBwbTljbkxKK1pwOWYvK0ZUOHBlZnVlVFB2RHVtNnVsODE3MHFraW10VmNsZlk5ZmpTVko5VHFDdXh3RkRkNmVlR1orN2I0Vi85djBuK09VeisveitleE1xNVJpR0xobk1VbEdDYXFKZXFMQmRLWGNNbFpWQ3lHd2tTWmxLaENBeFVaYUNNU3pneEtEZzRiV1NLMU9qRUNkbTBzcUNSckhBeTFTRVFwMy8rTTZZY1l0LzdUT241RXYvNTVyL3lrdjdTSm40SC9OQlhCQUlrQWJtTjE3TDJiYU9qdGZHWDMxaWs1Lzl4TGI4L0xkMi9YKzhONzFoc2lsTHFVcEZVQ3hacU1PSDE5TjBZOWdKSFlSQ25FSXhxaURVQmtNWG1RVDF6Ukx1SFphODJhdTVPSVd5Q0ZnVGMxR1VaMGk1N2w0Vy9IY3ZqSGw3VlB1WHYvOGtQM2JmQ24vdG1WM2UzWnRCRmE0elIxbFc1N0hvVzF2NjUrNnRrbC85L0YzYzNRLzgxTzlkOUxOSFRhSkxYVC9LZFVOUlFsZVBoOFFrUE5VTDNMOWFzRmtxZzZEMGcwaFZLSldDcWlncVNoV2N2Z1JXQ21HbGdIdFdBaC9iNmxOS1NEZFVKUlNDaG81YllNY2VyaUpVQ204Y3R2em83NXpuNWIyRzUzN3NIdm5xbjdpTEozZDYxTFZSTjRsSldKdFJ4L3d5VDc5cmpMbzJuanJSNHpjK2Y1b1h2bkNmUEg5dHhwLytuZk84Tldvb2J5S3c1TG00QmljVVFnaE9LVW40SjdaNzNERXNXUW5Lc0JRR0twVHFpQ2pTUktQMXRKaHBGUFliNDlvcyt1NDBjbTdTOG9lWFozeG5yMDdrT1lUR25NWWNpd2E2bUV0MzV0bFZUWlBXMkNnTC9zcWphL3o0ZlN0aUR0KzRPUFhucnM1NGU5U3dWNmVsYjFiQ2ZTc2xUMjMzK09OMzlFV0EzM3ByNVAvaTFYME9hMmVsWE1TUDVUQ3FHRmdpNGFRWmRPS1BsUXFQYjFYOHdFNlB1MWNMVGxTQnJWNlE5VkxwcTlNdkJFbWdmaEprRnBsVHA2NU1FK1B2dTRlUlp5NVBPVDl1RWpXeU5Xb3lFeWtta3B4bkJzTDFjMnB6Wnh3ZGRlZmpPMzErNEVTUGo2eFgzTGtTV0M4RDRPdzN6b1Z4eTZzSE5YKzBPK1g1cXczbXpqQWt6dWpOZUVqcUtmMXBTTlRvQXFjcWttbmZNeXo0NFpOOUhsd043UFFMZG5xQnRWSmxwVkI2SVpYUUJlNkpTNjJKYWpnSVFtc2lxNVY2YllIN1Y1VlJhMHhpb2pCNWtXalAwUVNDWXRGUVdXN21zMFp5amwvTE1QRExlelV2WEp1bFVXKzJocVN4WkxaQkU4dDNFSmhYV1IyQzB4bjEvT2V5d09xVW1uTHdkaFg0NUhhUCsxWktWcXZVUUhVODBqSmo2Z29wZWtkUC9hWm95aVREb0VTUWFPN1JqVWZXU3labVBIZGx4bjZkS0E4Tm51aElRVE9yS1BmVlN4ajBjdGxhQmFodUErVllocXFXaGUxZ2FFVUpZV21qVktsVTJDeUZwN1pMUHJSYVpDS3RzbGFxRElMU3k2WmZkSlNxRklRU3NKZExVaXdrMkRSV0t0RVNvUGpZZW9XWjhNSzFLZGVheE9RUkhIV2hKYk1UNWl2T3dpOU5SbTRYU1ZnTTlYd0JEdWFuYWE2MFFxWlFscW1XWnF0U250enU4ZEhOaXMxZVlMMVMxZ3VWUVNIMHM3OTN6WWY0RWsyeVN6MUJvWEluSXF5Z2VJV1k0RzZCSjdiVFExNjRPbU4zbHNDSE5pYnVablNaVHhWaWxySmI5UFViY0dzMSt4elM2YjRqSWdRNkFDRG4yU0J6cnZlSm52S0o3UjZQcnBkc1Y4cG1wV3hVS2l1bEpvRnpiTkNsTEhtTU1kaTFwcUtDNVlkYUlTbENaOXJoNHhzOStrRjRhYS9tM0ZITExIYzFNUjlmY005ZFVXNVNMRU12MG9FQzE2dlVsLzQ3RjNSQlpCVTgxLzlPSWVsOXFkQlg0WjdWa3NmV1N4N2FLTmtvUXhJNGtXUHA1N0s2NnkyVzIrNENPbVpmeDhsTVFwZVd1b1BFTFhFUjNJTWFoU2dmRFJYclplQ1Zhc2JyQnpXSHJkRG1TaWhhWWhhNUNHYUpPdTBaZDVyelJIUDA3L3g5eml0Y1l1eXFlSXJlZWJpZ3FoU2U2b1gxU25oa3ZlVFJqUjUzRFJJTGVLT1NGS1dETXBoWFg3bGg4aVVaNVRyejdqWkF1eFlMaDN4b1JBaVNDRzd1aWRDU0huUkhQL0RHWWN1Ym95YlJIa2d0WURRbjVvbWxpV2FhaFdTYXhSSVMwNTNCNkRTc0FtNlpBZXlKQ0VjNm4xR0o4TUJheWNOckpmZXRGbXhWS1dpdGxjcGFLVExvQkM2VU10ZmZ5OGRGYm1yZW5kQmsvNllqNWhVWmZqR2xFSk5DMUN0MWVscXdYZ2luaHdVUFRFcmVPcXg1NjhpWnhKYXk2TGdxaWFoam9obnpTaHp3ZVhQaGpxaGtURTdtSE8wZ2llaU93NkJRN2w5UkhsZ3R1WE5ZY3FxbkRJdE1jaThrazl3elVKRFBmaVEvN2dxYjYyUzgxV21kWldKTU9uNlVDeGh6cG0wcU9zYU4reWdUNEk5U0pjZVYybmxuTk9QOHhOaWRHRzMyWTg5SEk5em55YTB6OUtVcFNlcVVCS2ZRTkxLNWV4aTRkOWhqdXlkczl3UERRbGtKaWN3K0xFV0dRUmdVTXFkVExTSzEzQksvLzU1SGxEb2czMG56STh0Y3NjWmdaczZzell6L1ROS1pSbWRxenY3TU9Jek80U3h5dFlsY21yVHMxODRvSnY1NGE4ZUxrMEtURUtzbGJKU0Jrd05scHl4WXJZVDFNZ1duS2dzM0NNSXdhRHE0a2dOV2tjR0JJcC9iNnJSN3k0SEYreDVHODVURHpWSVlTa2NjOGl6Sm5Ub2FNNE5aYTB3aVBvM0dMRUtOVTdkcEV4WjhqL1JxOC9mSi9wOFduSUNNS3FRMnNLOUpxQktoRjZBZmxFR0I5TElaZDdWMkY1MkRrQTZtZVo1VmZZL3NlRnNuOEN3SG1rUmVOeXlDa3c2aXRabjNYVnZ1bUpKZ1B2TTBuNjR0MFpqU3diVE1DblNmajRLN0F5cGRwSzFVQ0twVTZnbnB5QmhlVHpzVFZncE5uVlRJUVZaREl2U0d2TmIzTzMxNFcwSWZVM3crWSttNUVERWd4a2dVSlZxa2JnV1RoVFliaTdTbXRPNGVNMkU5Y1ZrV1B0MWhjU0dqR29Xa0k0YWRGYWdMVmVFRURRUTNRZ2pwWEVaWFpjMVowSXZqaDkvcityOWMzd0x0N0lQSU9BQUFBQ1YwUlZoMFpHRjBaVHBqY21WaGRHVUFNakF4T0MweE1DMHlOVlF5TWpvME16b3dOaTB3TlRvd01GQ3prQ29BQUFBbGRFVllkR1JoZEdVNmJXOWthV1o1QURJd01UZ3RNVEF0TWpWVU1qSTZORE02TURZdE1EVTZNREFoN2lpV0FBQUFBRWxGVGtTdVFtQ0MnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIHZpYXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIHdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UgfSxcclxuICAgICAgICBhdXRvVXBkYXRlTWFwVmlldzogdHJ1ZSxcclxuICAgICAgICAvL2l0aW5lcmFyeUNvbnRhaW5lcjogJyNkaXJlY3Rpb25zSXRpbmVyYXJ5J1xyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIC8vZGlyTWFuYWdlci5zaG93SW5wdXRQYW5lbCgnZGlyZWN0aW9uc1BhbmVsJyk7XHJcblxyXG4gICAgICBjb25zdCB3YXlwb2ludDEgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5XYXlwb2ludCh7XHJcbiAgICAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihsb2NjLmxhdGl0dWRlLCBsb2NjLmxvbmdpdHVkZSlcclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIGNvbnN0IHdheXBvaW50MiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLldheXBvaW50KHtcclxuICAgICAgICBsb2NhdGlvbjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGVuZExhdCwgZW5kTG9uZyksIFxyXG4gICAgICB9KTtcclxuICBcclxuICAgICAgZGlyTWFuYWdlci5hZGRXYXlwb2ludCh3YXlwb2ludDEpO1xyXG4gICAgICBkaXJNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50Mik7XHJcblxyXG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihkaXJNYW5hZ2VyLCAnZGlyZWN0aW9uc1VwZGF0ZWQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIC8vdGhhdC5wYXRoTGF5ZXIuY2xlYXIoKTsgXHJcbiAgICAgIHZhciBhbGxXYXlQb2ludHMgPSBkaXJNYW5hZ2VyLmdldEFsbFdheXBvaW50cygpO1xyXG4gICAgICBcclxuICAgICAgdmFyIGZyb21BZGRyZXNzID0gYWxsV2F5UG9pbnRzWzBdLmdldEFkZHJlc3MoKTtcclxuICAgICAgdmFyIHRvQWRkcmVzcyA9IGFsbFdheVBvaW50c1sxXS5nZXRBZGRyZXNzKCk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCByb3V0ZUluZGV4ID0gZS5yb3V0ZVswXS5yb3V0ZUxlZ3NbMF0ub3JpZ2luYWxSb3V0ZUluZGV4O1xyXG4gICAgICBjb25zdCBuZXh0TG9jYXRpb24gPSBlLnJvdXRlWzBdLnJvdXRlUGF0aFtyb3V0ZUluZGV4ICsgMV07XHJcblxyXG4gICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgcm91dGUgaW5kZXguXHJcbiAgICAgIGNvbnN0IHJvdXRlSWR4ID0gZGlyTWFuYWdlci5nZXRSZXF1ZXN0T3B0aW9ucygpLnJvdXRlSW5kZXg7XHJcbiAgICAgIC8vIEdldCB0aGUgZGlzdGFuY2Ugb2YgdGhlIHJvdXRlLCByb3VuZGVkIHRvIDIgZGVjaW1hbCBwbGFjZXMuXHJcbiAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5yb3VuZChlLnJvdXRlU3VtbWFyeVtyb3V0ZUlkeF0uZGlzdGFuY2UgKiAxMDApIC8gMTAwO1xyXG4gICAgICAvLyBHZXQgdGhlIGRpc3RhbmNlIHVuaXRzIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByb3V0ZS5cclxuICAgICAgY29uc3QgdW5pdHMgPSBkaXJNYW5hZ2VyLmdldFJlcXVlc3RPcHRpb25zKCkuZGlzdGFuY2VVbml0O1xyXG4gICAgICBsZXQgZGlzdGFuY2VVbml0cyA9ICcnO1xyXG5cclxuICAgICAgaWYgKHVuaXRzID09PSBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLkRpc3RhbmNlVW5pdC5rbSkge1xyXG4gICAgICAgIGRpc3RhbmNlVW5pdHMgPSAna20nO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIE11c3QgYmUgaW4gbWlsZXNcclxuICAgICAgICBkaXN0YW5jZVVuaXRzID0gJ21pbGVzJztcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgY29uc29sZS5sb2coJ2xhc3QgWm9vbSBMZXZlbCcrbWFwWm9vbUxldmVsKTtcclxuICAgICAgLy8gVGltZSBpcyBpbiBzZWNvbmRzLCBjb252ZXJ0IHRvIG1pbnV0ZXMgYW5kIHJvdW5kIG9mZi5cclxuICAgICAgY29uc3QgdGltZSA9IE1hdGgucm91bmQoZS5yb3V0ZVN1bW1hcnlbcm91dGVJZHhdLnRpbWVXaXRoVHJhZmZpYyAvIDYwKTtcclxuICAgICAgZGlzdGFuY2VEYXRhID0gXCI8bGFiZWwgc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7IGZvbnQtc2l6ZTozMnB4Oyc+XCIrIGRpc3RhbmNlICsgJyZuYnNwOycgKyBkaXN0YW5jZVVuaXRzICsgXCIsIDwvbGFiZWw+IFRpbWUgd2l0aCBUcmFmZmljOiBcIiArIHRpbWUgKyBcIiBtaW51dGVzXCI7XHJcbiAgICAgIC8vIC8vIGluZm9ib3guc2V0TWFwKG1hcCk7ICBcclxuICAgICAgLy8gaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgLy8gICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZW5kTGF0LCBlbmRMb25nKSxcclxuICAgICAgLy8gICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgIC8vICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCA0MCksXHJcbiAgICAgIC8vICAgICBodG1sQ29udGVudDonPGRpdiBzdHlsZT1cIm1hcmdpbjphdXRvICFpbXBvcnRhbnQ7d2lkdGg6NTUwcHggIWltcG9ydGFudDtiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtib3JkZXI6IDFweCBzb2xpZCBsaWdodGdyYXk7XCI+J1xyXG4gICAgICAvLyAgICAgKyBnZXRUaWNrZXRJbmZvQm94SFRNTChpbmZvQm94TWV0YURhdGEsIGRpc3RhbmNlRGF0YSwgZnJvbUFkZHJlc3MsIHRvQWRkcmVzcykgKyAnPC9kaXY+J1xyXG4gICAgICAvLyAgIH0pO1xyXG4gICAgICAkKFwiLm1vZGFsLWNvbnRlbnRcIikuaHRtbChnZXRUaWNrZXRNb2RhbEhUTUwoaW5mb0JveE1ldGFEYXRhLCBkaXN0YW5jZURhdGEsIGZyb21BZGRyZXNzLCB0b0FkZHJlc3MpKTtcclxuICAgICAgalF1ZXJ5KFwiI3RpY2tldG1vZGFsXCIpLm1vZGFsKHtcclxuICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXHJcbiAgICAgICAga2V5Ym9hcmQ6IGZhbHNlXHJcbiAgICAgfSk7XHJcbiAgICAgIHZhciB4ZmxhZzogbnVtYmVyPTA7XHJcbiAgICAgICQoXCIjbW9yZUZvcm1Db250ZW50QnRuXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxlZCBjbGljaycpO1xyXG4gICAgICAgIGlmKHhmbGFnID09IDApIHtcclxuICAgICAgICAgICQoXCIjaW5pdEZvcm1Db250ZW50XCIpLmhpZGUoKTtcclxuICAgICAgICAgICQoXCIjbW9yZUZvcm1Db250ZW50XCIpLnNsaWRlVG9nZ2xlKCBcInNsb3dcIik7XHJcbiAgICAgICAgICAkKFwiI2R1bW15aW1hZ2VcIikuYXR0cihcInNyY1wiLFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCZ0FBQUFZQ0FZQUFBRGdkejM0QUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUF5SnBWRmgwV0UxTU9tTnZiUzVoWkc5aVpTNTRiWEFBQUFBQUFEdy9lSEJoWTJ0bGRDQmlaV2RwYmowaTc3dS9JaUJwWkQwaVZ6Vk5NRTF3UTJWb2FVaDZjbVZUZWs1VVkzcHJZemxrSWo4K0lEeDRPbmh0Y0cxbGRHRWdlRzFzYm5NNmVEMGlZV1J2WW1VNmJuTTZiV1YwWVM4aUlIZzZlRzF3ZEdzOUlrRmtiMkpsSUZoTlVDQkRiM0psSURVdU1DMWpNRFl4SURZMExqRTBNRGswT1N3Z01qQXhNQzh4TWk4d055MHhNRG8xTnpvd01TQWdJQ0FnSUNBZ0lqNGdQSEprWmpwU1JFWWdlRzFzYm5NNmNtUm1QU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh4T1RrNUx6QXlMekl5TFhKa1ppMXplVzUwWVhndGJuTWpJajRnUEhKa1pqcEVaWE5qY21sd2RHbHZiaUJ5WkdZNllXSnZkWFE5SWlJZ2VHMXNibk02ZUcxd1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JTWldZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlZKbFppTWlJSGh0Y0RwRGNtVmhkRzl5Vkc5dmJEMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTlROUzR4SUZkcGJtUnZkM01pSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RoR09UWTVPVEpFUXpOQk1URkZPRGt3TWpBNE0wUXhNakUzTTBZeU5Ua2lJSGh0Y0UxTk9rUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPVGhHT1RZNU9UTkVRek5CTVRGRk9Ea3dNakE0TTBReE1qRTNNMFl5TlRraVBpQThlRzF3VFUwNlJHVnlhWFpsWkVaeWIyMGdjM1JTWldZNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzVPRVk1TmprNU1FUkRNMEV4TVVVNE9UQXlNRGd6UkRFeU1UY3pSakkxT1NJZ2MzUlNaV1k2Wkc5amRXMWxiblJKUkQwaWVHMXdMbVJwWkRvNU9FWTVOams1TVVSRE0wRXhNVVU0T1RBeU1EZ3pSREV5TVRjelJqSTFPU0l2UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUHYzUkh3Z0FBQUY3U1VSQlZIamF2SlpCWndOQkZNY25GYzBuS0dFb09ZV2xoSHlKc0N3OTVXUHNLWlI4a2lIWHNQVFFTM3BwSmQrZ2xGSktMaVU5OWRMcUtZVHBtL29QejVqZG5VbW5mZnlXblozNS8zZmU3TXpiam1nT1NWd1NPWEZHak5EK1NMd1R0OFNOMXZwTlJFYWZVTVNCMEMwYzBMZFBSc0xGRnhQaWl3bFV4SlFZRTEwd1JsdkYrcGt4a3phRGtnMjRKcktBMldib2E4ZVZkUVlGUzhrOE5KZE1hTTVTVnJnR1pqRS8wRUhGTEpienRnb2FSa3R5QThYeUxZNDFnS0JkRjJVTnpsbHFzZ1FHR1V1VjBSWlhhRmlLSTZMbTAxeEMwMmlMTlc1eWtTQmdrRVB6em56VFE3WTdlVndRcHhIYW44VFcwZnBKK1I1dVBXZkFhOEF1NXF6WURIcG8yM2NiM3VnSjUwMW9iT3NlN09BbUU2NkJoT2J1aEM0dmVEWks4UlU1V3MvRzRCNDNVNUV1ck5iR1hBWi91TkVHLzNKVTJFV3hOV0QyaThOdXhtcUQ5QjNYT3RiRUk2NTl4N1d2NEZSc2x6ZkYwS2xzWlZ2SkxCcEtwbzI2a2xtRTFHUzdKb3VJb3Ird09YZnBSUDYyMkZrOGhQNjJmQXN3QUplZVphQW5XU3VmQUFBQUFFbEZUa1N1UW1DQ1wiKTtcclxuICAgICAgICAgICAgeGZsYWcgPSAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZih4ZmxhZyA9PSAxKSB7XHJcbiAgICAgICAgICAgICQoXCIjbW9yZUZvcm1Db250ZW50XCIpLmhpZGUoKTtcclxuICAgICAgICAgICAgJChcIiNpbml0Rm9ybUNvbnRlbnRcIikuc2xpZGVUb2dnbGUoIFwic2xvd1wiKTtcclxuICAgICAgICAgICAgJChcIiNkdW1teWltYWdlXCIpLmF0dHIoXCJzcmNcIixcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQmdBQUFBWUNBWUFBQURnZHozNEFBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCQlpHOWlaU0JKYldGblpWSmxZV1I1Y2NsbFBBQUFBeUpwVkZoMFdFMU1PbU52YlM1aFpHOWlaUzU0YlhBQUFBQUFBRHcvZUhCaFkydGxkQ0JpWldkcGJqMGk3N3UvSWlCcFpEMGlWelZOTUUxd1EyVm9hVWg2Y21WVGVrNVVZM3ByWXpsa0lqOCtJRHg0T25odGNHMWxkR0VnZUcxc2JuTTZlRDBpWVdSdlltVTZibk02YldWMFlTOGlJSGc2ZUcxd2RHczlJa0ZrYjJKbElGaE5VQ0JEYjNKbElEVXVNQzFqTURZeElEWTBMakUwTURrME9Td2dNakF4TUM4eE1pOHdOeTB4TURvMU56b3dNU0FnSUNBZ0lDQWdJajRnUEhKa1pqcFNSRVlnZUcxc2JuTTZjbVJtUFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eE9UazVMekF5THpJeUxYSmtaaTF6ZVc1MFlYZ3Ribk1qSWo0Z1BISmtaanBFWlhOamNtbHdkR2x2YmlCeVpHWTZZV0p2ZFhROUlpSWdlRzFzYm5NNmVHMXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNoaGNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSU1pXWTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpWSmxaaU1pSUhodGNEcERjbVZoZEc5eVZHOXZiRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5UTlM0eElGZHBibVJ2ZDNNaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9USTBSalZGTmpaRVF6TkJNVEZGT0VGRU1USTRRVU16T0RORFJFUkdRa01pSUhodGNFMU5Pa1J2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T1RJMFJqVkZOamRFUXpOQk1URkZPRUZFTVRJNFFVTXpPRE5EUkVSR1FrTWlQaUE4ZUcxd1RVMDZSR1Z5YVhabFpFWnliMjBnYzNSU1pXWTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG81TWpSR05VVTJORVJETTBFeE1VVTRRVVF4TWpoQlF6TTRNME5FUkVaQ1F5SWdjM1JTWldZNlpHOWpkVzFsYm5SSlJEMGllRzF3TG1ScFpEbzVNalJHTlVVMk5VUkRNMEV4TVVVNFFVUXhNamhCUXpNNE0wTkVSRVpDUXlJdlBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BsaE9zdVlBQUFHeFNVUkJWSGphdEpiQlNzTkFFSVlUTGZvRWhVSWcwRk1oSUJSNjlTUUlCU0hncWRBSEVEemw1S25nWXdpQjlsb0NIcnpvU2ZBTkJFRUlDSVdpMUpNWHhWT2hFUCtWR1JqWFRiS0pjZUJMMDJUMy83T3oyWjI0VG5GNDRCZ2NnVGJvMC9VSDhBWnV3RldXWmE5T3hlaUFHR3hBVnNLRzJuWmc1T2lZWWdnK2hVQUNSbUFBV3NTQXJpV2luZW96TERPSVJJZExFRmlNTnFDMjNDL0tNd2hGU2lhMnVSUkNFNUd5VURkUWsvbE9EZUlDdlgxd0lrZW1QVzFNR2tyTGt3YXh5SGRSWEZDN1U1TUJDZks4eEd6Z2k5UUVEUmdFSWxYK0ZnNWpzQTNtSUhYK0dEQkpTVXRwanBYQklkMmIxeEYwWGZjSG10YUJlcWQ3WW5YSzJBTTcyclUyL2ZxMEZtUjhnSVdtOVozeU5lVnNWK3Z3YkxHS0pkYzhKNlNsVHRhdGd0RS8wbjRqdzZkUnZCanVMZktFVnVUbVdhVDgxMXRrV25pa3BVNVdhcEtmNkY2LzVsdGoybnRZSzFVR3QvUm41RFFYckhXbkR0MS9YR2hkTllJbG1GSDc4d2FlbmpWbU1Gekt6WTVyd0ZuZE9hQytYQnM4MDNhZFZUVXhpR2VtN2RwVWNCS3h5b3VpcDFXMnFLeGtoZ1Vsa3lPdlpJWTJOWm5uWkZxaDZFODU1enB1eGM4V0hzVzk3V2ZMbHdBREFFZURVcTJEVlk4TUFBQUFBRWxGVGtTdVFtQ0NcIik7XHJcbiAgICAgICAgICAgIHhmbGFnID0gMDtcclxuICAgICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgICQoXCIuY2xvc2VcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgICBkaXJNYW5hZ2VyLmNsZWFyQWxsKCk7XHJcbiAgICAgICAgbWFwLmxheWVycy5jbGVhcigpO1xyXG4gICAgICAgIG1hcC5zZXRWaWV3KHtjZW50ZXI6IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihlbmRMYXQsIGVuZExvbmcpLCBtYXBab29tTGV2ZWx9KTtcclxuICAgICAgfSk7XHJcbiAgICAgICQoXCIjdGt0SWRcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgICBwaW5DbGlja2VkKGluZm9Cb3hNZXRhRGF0YSwgMSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgZGlyTWFuYWdlci5jYWxjdWxhdGVEaXJlY3Rpb25zKCk7XHJcbiAgICAgIFxyXG4gICAgfSk7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgZnVuY3Rpb24gZ2V0VGlja2V0TW9kYWxIVE1MKGRhdGE6IGFueSwgZGlzdGFuY2REYXRhOiBhbnksIGZyb21BZGRyZXNzOiBhbnksIHRvQWRkcmVzczogYW55KTpTdHJpbmd7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgdmFyIHdvcmtTZXZlcml0eUNvbG9yOiBhbnkgPSBcIiNjZjJhMmFcIjtcclxuICAgICAgICBpZihkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkgPT09IFwibWFqb3JcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICB3b3JrU2V2ZXJpdHlDb2xvciA9IFwiIzAwOWZkYlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJtaW5vclwiIHx8IGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJ3YXJuaW5nXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcInVua25vd25cIil7XHJcbiAgICAgICAgICB3b3JrU2V2ZXJpdHlDb2xvciA9IFwiIzE5MTkxOVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZGlhbG9nRGF0YSA9IFwiPGRpdiBjbGFzcz0nbW9kYWwtaGVhZGVyJz5cIlxyXG4gICAgICAgICtcIjxoNSBjbGFzcz0nbW9kYWwtdGl0bGUnIGlkPSd0a3RJZCc+PGEgaHJlZj0namF2YXNjcmlwdDp2b2lkKDApOycgc3R5bGU9J3RleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyBjb2xvcjojMDAwOyc+XCIrIGRhdGEudGlja2V0TnVtYmVyICtcIjwvYT48L2g1PlwiXHJcbiAgICAgICAgK1wiPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzPSdjbG9zZScgZGF0YS1kaXNtaXNzPSdtb2RhbCcgdGl0bGU9J0Nsb3NlJz4mdGltZXM7PC9idXR0b24+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J21vZGFsLWJvZHknIHN0eWxlPSdtYXgtaGVpZ2h0OjUyMHB4OyBvdmVyZmxvdy15OmF1dG87Jz5cIlx0XHRcdFx0XHRcclxuXHRcdFx0XHQrXCI8Zm9ybSBjbGFzcz0ndGt0Rm9ybSc+XCJcclxuICAgICAgICArXCI8ZGl2IGlkPSdpbml0Rm9ybUNvbnRlbnQnIHN0eWxlPSdkaXNwbGF5OiBibG9jazsnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlNldmVyaXR5OjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJyBzdHlsZT1jb2xvcjpcIit3b3JrU2V2ZXJpdHlDb2xvcitcIj5cIisgZGF0YS50aWNrZXRTZXZlcml0eSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5Db21tb24gSUQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrZGF0YS5jb21tb25JRCtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkFmZmVjdGluZzo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5jdXN0QWZmZWN0aW5nICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlNob3J0IERlc2NyaXB0OjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5zaG9ydERlc2NyaXB0aW9uICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS0xMScgc3R5bGU9J2JvcmRlci10b3A6MXB4IHNvbGlkICNkYmRiZGI7Jz5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS0xMic+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRpc3RhbmNkRGF0YSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlx0XHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tMSc+XCJcclxuICAgICAgICArXCI8aW1nIHNyYz0nZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCa0FBQUFhQ0FZQUFBQkNmZmZOQUFBQUFYTlNSMElBcnM0YzZRQUFBQVJuUVUxQkFBQ3hqd3Y4WVFVQUFBQUpjRWhaY3dBQURzTUFBQTdEQWNkdnFHUUFBQU5mU1VSQlZFaEx6WlhkUzFOeEdNZjdleUxyd2d5TWJnSWhVZXZDaUtDNnpRZ1VSZlJDdzdBWEtucWpFb3VJVUN6cUlsQVVNd2pCaEM0cXJMMjI5djdXM003Y2RKdWJPM3M1Mjdmbjl6dW5VM3ZmdXBBK01EYWUzOW52ZTM2LzUvczh6eDdzQXYrSFNGNlNrRXVsSU8zc1FFb2tJTVhqL0hjdW5VWStsMU9lcWs1VmtUeDlFazRuaFBsNXVPL2ZoK3ZHRFRpdlhZUDN5Uk9FbHBlUlhGK1hINnhCV1JHMitiWldDL2ZZR0N3WExzRFMzdy9IOWV0d1Azb0UxNzE3c0kyUHc5emJDOHU1Yy9CTlRDQmhzY2gvckVDSlNDNmJSV1IxRmM3UlVSaU9INGUxcHdjL2FmUFErL2VJZnYyS3lKY3ZDTEtUM2J3Sjg4bVRNSjQ2QlRjSmM2RThlNzFTQ2tUeUpCRDk5ZzNtczJlaE8zSUU2NjllSVJPSktLdWxpSDQvWEZldndrQml0cEVScEFSQldTbWtRRVQwZUdEcTZvTHB6QmtJczdNOHdkVmdpYzl1YjhNL1BRMTlkemRjdDIvelBZcFJSVExSS0lKdjMwTGYzZzdmNUNTeU5RVCtKdWwydzBOWHBqOTZGT0hGUlNYNkIxVWtZVFRDT2pnSUd5VTdiakFvMGZxSjYvWFF0YmJ5L0tVMk5wU29qQ3F5UlcrZzJic1hRYnFtVEN5bVJPc25FdzdET2p3TUJ4a2k4dm16RXBYaElzd1R3UmN2b05tM0R6RnlUM21QVkljVnFXOW1odDlFY0c1T2ljcHdrV3d5Q2YvVHA5QWVPQURSNGVBTGpTTFJIaHZ2M3NGKytUS0UxNitWcUF3WGthaHRCSjQ5ZzNiL2ZvaDJPMTlvRk9aRVlXRUJkaXBVNGMwYkpTcWo1aVJNdWRBME5XRnJaUVVTOWFWR3laSTdQUThmd2tZbkNTMHRLVkVaVlNUNjRRTjB4NDdCU3ljU2ZUNGxXai9wUUlEWGwvdnVYY1NMMm93cWtxUmNPS2tCbWs2ZnhtYlJtOVJDRWtXRUtCL2F3NGNodkh6SnIvOXZWQkYyUmRHMU5lanBRZmVsUzBpV3FkeEtSRDUraEdWZ2dMOWc3Tk1uSmZvSFZZU1JJNGV3NCtvN09tQ256cHZlM0ZSV0toT2pJcmIxOVVGMzZCQTJxYkV5bHhWVElNSVFhVWE0YnQyQ3RxME5adXBIZnFxZnVNMkdIQTJ2MzJUSVNkc21FL3hVRjk5UG5NQVBPZ0d6TGV0ajVTZ1JZY1JwZzU4UEhzQk1pZnh4OFNJYzFQWjlkKzRnK1B3NUFvOGZ3ME96eFQ0MEJBdDlyT2ZQUTVpYVFvYW1aaVhLaWpCWTFjZW9oem12WElHeHN4UDZnd2VoYTI2R3JxV0ZmNXNveGlaa2dneFRxME5VRkdIdytVN09ZVFVnZXIySWFUUzhlYWJJNGprMjU4bEY5Y3o1cWlMRnNLbkpoQnVsSVpGL1pSZEVnRjgzMm40c2h2N01vUUFBQUFCSlJVNUVya0pnZ2c9PScgLz5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEwJyBzdHlsZT0nYm9yZGVyLWJvdHRvbToxcHggc29saWQgI2RiZGJkYjsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBmcm9tQWRkcmVzcyArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEnPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS0xJz5cIlxyXG4gICAgICAgICtcIjxpbWcgc3JjPSdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJzQUFBQVlDQVlBQUFBTFFJYjdBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFBSmNFaFpjd0FBRHNNQUFBN0RBY2R2cUdRQUFBTlJTVVJCVkVoTHZaVkxTRlJSR01lTmlxSzJ0WXdXdFcvUnBxaWdDQ0pDaUJaRlVGbkxhRkV0YXBFU0dCaVZSUlNDQ0dVdk5XMXNMTk5TazE0cXZTd2RINDJQZVR1UGEvTitPQy92elB6NzN4aXRPOTRaeHdoL2NPQnk3ajMzZjg3M1A5LzNGV0FSV1pEWWRDeUJjRVRFVkhnYVNDVFRzL2t6cjVnOUVNZEhXeGpWV2o5S2UxMjQrTVdKa3M5T1hPNXo0LzVZQU44Y1lRUzRnWHpJS3BiaU1IcGp1TlByUkZHekJSdHJEVmo2VUk5Vk5RYXM1bGp5UUkrMU5YcWNlamtCdGRZTGl6K09sTFFvQjFuRm1rZjlPUGpNakMzMUJsenJFZkJhRjhDUUt3WjdXTVRQYUlMUFVUd1o4dUpzbXhWckh1bHhvTU1PM1dRa3ZWb1pSYkZuRkRyNTBvcWlGeFpVRDNveHloOUg2RmNtZmdyM01ZeVhHTmFkUFAyK05odkcrRzBxcVh4RXVSaS9NVEYwaDdud0dJV2UvdkJCRk9lL0NCR0tsdEhMRGZWR1hQdjBFeE1NcVJJeU1TRVl4MTE2dEkyaHE5SjRrQkRuTWVFdmJMNFlLaWkwaVQ0KzF3ZlRzM0prWXIyT0NJNCt0NkQwblFNRFF1NzRLNkdoWjV2ckRDaW5xTjAzOTNReXNTWmpDT3U1czRaaDcyOC9Gb3FiS1hDbTA0NkxieDNvTXMwOW5VeXNVdXZqbGRhaHh4Nm1mL21IY0lhcGVCTDFHamRLS0tnYTlxVm4vekFyRm9tS3VQTGRoWlc4eHZvZ0s4US9FSjVPb3BVNWQ2SFRodHBCVDNyMkQ3TmlJbmQxbzkrREZVemNBWGNzUGJzd3BKTTFEWGx3dnNPS1J3TTV4Q1NxUnZ4WWNtOGNuZVlRVW5sYytVeUN6TVdiUFpNb2ZtMURLM00xRTVsWXk4UVUxdkUyM2ZycWhEMUxydVJpSWpDTi9iek5aVjBDZmdqMFBRT1ptSlRRNWQwQ0NodE5hTW1TSzlrUTZWZTdNWWhsdkdDM1dYV1NDcEdSaVltSkZEUXNQOXNiakRqTlVHajVuQzl0Rk5yWFpNWWhWcDZ2V2RiSnhDUkNOUGtLazNLWDJvUWpIVGIwTVEyVWRqbERsRDQxczBnZmUyWEZibTZ5ZmN5UGtFSWRsWmdqSmlHdzlKeDRMMkQ5WXdQT1MyWWJnaGhuUmZBdzBRT3MrSDRPRjU5SFBUR29SbndvWkhmWW96S2lnbDdIY214TVVVekN3MjZzWnBMdlZabXcvTDRPVzlWbVhLZnhkZjF1UFBqbVF2RWJCM2J3WFFIZkhXZWJlYThQSUU0YmNwV0NyR0lTUVo2Z2x6V3lrZ2w2OWVNa3lsZ3p6N1ZiZnlkdEtVdlNEWWE3Wmx6cWMyeEJEUDk4NUJTYklVWVBqUHpoQjlhN1JyWWRxYkYybTRNd2U2THBML0lqTDdIL3hTS0tBYjhBOU1LWEFPZ0U0MmdBQUFBQVNVVk9SSzVDWUlJPScgLz5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tMTAnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyB0b0FkZHJlc3MgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS0xJz5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCI8L2Rpdj5cIlx0XHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdC8vZW5kIGluaXRmb3JtXHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxkaXYgaWQ9J21vcmVGb3JtQ29udGVudCcgc3R5bGU9J2Rpc3BsYXk6IG5vbmU7Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+RW50cnkgVHlwZTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5lbnRyeVR5cGUgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5TdGF0dXM6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEudGlja2V0U3RhdHVzICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+Q3VzdG9tZXIgQWZmZWN0aW5nOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5jdXN0QWZmZWN0aW5nICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+QXNzaWduZWU6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmFzc2lnbmVkVG8gK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5Db21tb24gSUQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiICsgZGF0YS5jb21tb25JRCArIFwiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5FcXVpcG1lbnQgSUQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmVxdWlwbWVudElEICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+RXF1aXBtZW50IE5hbWU6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIgKyBkYXRhLmVxdWlwbWVudE5hbWUgKyBcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+UGFyZW50IElEOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnBhcmVudElEICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+UGFyZW50IE5hbWU6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEucGFyZW50TmFtZSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlByb2JsZW0gQ2F0ZWdvcnk6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIiA8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnByb2JsZW1DYXRlZ29yeSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlByb2JsZW0gU3ViIENhdGVnb3J5OjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnByb2JsZW1TdWJjYXRlZ29yeSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlByb2JsZW0gRGV0YWlsOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04Jz5cIlx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5wcm9ibGVtRGV0YWlsICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+U2hvcnQgRGVzY3JpcHQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuc2hvcnREZXNjcmlwdGlvbiArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkxvY2F0aW9uIFJhbmtpbmc6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnPlwiXHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmxvY2F0aW9uUmFua2luZyArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG5cdFx0XHRcdCtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlBsYW5uZWQgUmVzdG9yYWwgVGltZTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnBsYW5uZWRSZXN0b3JhbFRpbWUgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5BbHRlcm5hdGUgU2l0ZSBJRDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmFsdGVybmF0ZVNpdGVJRCArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPldvcmsgUmVxdWVzdCBJRDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS53b3JrUmVxdWVzdElkICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+QWN0aXZpdHkgQWN0aW9uOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmFjdGlvbiArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcdFx0XHJcbiAgICAgICAgK1wiPC9mb3JtPlwiXHJcblx0XHRcdFx0K1wiPC9kaXY+XCJcclxuXHRcdFx0XHQrXCI8ZGl2IGNsYXNzPSdtb2RhbC1mb290ZXInPlwiXHJcbiAgICAgICAgK1wiPGJ1dHRvbiBpZD0nbW9yZUZvcm1Db250ZW50QnRuJyBzdHlsZT0nYmFja2dyb3VuZDp0cmFuc3BhcmVudDtib3JkZXI6MDtjdXJzb3I6cG9pbnRlcjsnPiA8aW1nIGlkPSdkdW1teWltYWdlJyAgc3JjPSdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJnQUFBQVlDQVlBQUFEZ2R6MzRBQUFBR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBQXlKcFZGaDBXRTFNT21OdmJTNWhaRzlpWlM1NGJYQUFBQUFBQUR3L2VIQmhZMnRsZENCaVpXZHBiajBpNzd1L0lpQnBaRDBpVnpWTk1FMXdRMlZvYVVoNmNtVlRlazVVWTNwcll6bGtJajgrSUR4NE9uaHRjRzFsZEdFZ2VHMXNibk02ZUQwaVlXUnZZbVU2Ym5NNmJXVjBZUzhpSUhnNmVHMXdkR3M5SWtGa2IySmxJRmhOVUNCRGIzSmxJRFV1TUMxak1EWXhJRFkwTGpFME1EazBPU3dnTWpBeE1DOHhNaTh3TnkweE1EbzFOem93TVNBZ0lDQWdJQ0FnSWo0Z1BISmtaanBTUkVZZ2VHMXNibk02Y21SbVBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHhPVGs1THpBeUx6SXlMWEprWmkxemVXNTBZWGd0Ym5NaklqNGdQSEprWmpwRVpYTmpjbWx3ZEdsdmJpQnlaR1k2WVdKdmRYUTlJaUlnZUcxc2JuTTZlRzF3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzaGhjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUlNaV1k5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVkpsWmlNaUlIaHRjRHBEY21WaGRHOXlWRzl2YkQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVOVE5TNHhJRmRwYm1SdmQzTWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVEkwUmpWRk5qWkVRek5CTVRGRk9FRkVNVEk0UVVNek9ETkRSRVJHUWtNaUlIaHRjRTFOT2tSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9USTBSalZGTmpkRVF6TkJNVEZGT0VGRU1USTRRVU16T0RORFJFUkdRa01pUGlBOGVHMXdUVTA2UkdWeWFYWmxaRVp5YjIwZ2MzUlNaV1k2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNU1qUkdOVVUyTkVSRE0wRXhNVVU0UVVReE1qaEJRek00TTBORVJFWkNReUlnYzNSU1pXWTZaRzlqZFcxbGJuUkpSRDBpZUcxd0xtUnBaRG81TWpSR05VVTJOVVJETTBFeE1VVTRRVVF4TWpoQlF6TTRNME5FUkVaQ1F5SXZQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QbGhPc3VZQUFBR3hTVVJCVkhqYXRKYkJTc05BRUlZVExmb0VoVUlnMEZNaElCUjY5U1FJQlNIZ3FkQUhFRHpsNUtuZ1l3aUI5bG9DSHJ6b1NmQU5CRUVJQ0lXaTFKTVh4Vk9oRVArVkdSalhUYktKY2VCTDAyVDMvN096MloyNFRuRjQ0QmdjZ1RibzAvVUg4QVp1d0ZXV1phOU94ZWlBR0d4QVZzS0cyblpnNU9pWVlnZytoVUFDUm1BQVdzU0FyaVdpbmVvekxET0lSSWRMRUZpTU5xQzIzQy9LTXdoRlNpYTJ1UlJDRTVHeVVEZFFrL2xPRGVJQ3ZYMXdJa2VtUFcxTUdrckxrd2F4eUhkUlhGQzdVNU1CQ2ZLOHhHemdpOVFFRFJnRUlsWCtGZzVqc0EzbUlIWCtHREJKU1V0cGpwWEJJZDJiMXhGMFhmY0htdGFCZXFkN1luWEsyQU03MnJVMi9mcTBGbVI4Z0lXbTlaM3lOZVZzVit2d2JMR0tKZGM4SjZTbFR0YXRndEUvMG40anc2ZFJ2Qmp1TGZLRVZ1VG1XYVQ4MTF0a1duaWtwVTVXYXBLZjZGNi81bHRqMm50WUsxVUd0L1JuNURRWHJIV25EdDEvWEdoZE5ZSWxtRkg3OHdhZW5qVm1NRnpLelk1cndGbmRPYUMrWEJzODAzYWRWVFV4aUdlbTdkcFVjQkt4eW91aXAxVzJxS3hraGdVbGt5T3ZaSVkyTlpublpGcWg2RTg1NXpwdXhjOFdIc1c5N1dmTGx3QURBRWVEVXEyRFZZOE1BQUFBQUVsRlRrU3VRbUNDJy8+IDwvYnV0dG9uPlwiXHJcblx0XHRcdFx0K1wiPC9kaXY+XCJcclxuICAgICAgcmV0dXJuIGRpYWxvZ0RhdGE7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VGlja2V0SW5mb0JveEhUTUwoZGF0YTogYW55LCBkaXN0YW5jZERhdGE6IGFueSwgZnJvbUFkZHJlc3M6IGFueSwgdG9BZGRyZXNzOiBhbnkpOlN0cmluZ3tcclxuICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgdmFyIGluZm9ib3hEYXRhID0gXCI8ZGl2IHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4Oyc+PGRpdiBzdHlsZT0ncG9zaXRpb246IHJlbGF0aXZlO3dpZHRoOjEwMCU7Jz5cIlxyXG4gICAgICAgICtcIjxkaXY+PGEgaHJlZj0namF2YXNjcmlwdDp2b2lkKDApJyBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUnPlwiK2RhdGEudGlja2V0TnVtYmVyK1wiIDwvYT4gPGkgY2xhc3M9J2ZhIGZhLXRpbWVzJyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz48L2k+PC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiICBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+U2V2ZXJpdHk6PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC04JyBzdHlsZT0nY29sb3I6cmVkOyc+XCIrZGF0YS50aWNrZXRTZXZlcml0eStcIjwvZGl2PlwiIFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+Q29tbW9uIElEOjwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSdjb2wtbWQtOCc+XCIrZGF0YS5jb21tb25JRCtcIjwvZGl2PlwiIFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+QWZmZWN0aW5nOjwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSdjb2wtbWQtOCc+XCIrZGF0YS5jdXN0QWZmZWN0aW5nK1wiPC9kaXY+XCIgXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5TaG9ydERlc2NyaXB0Ojwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSdjb2wtbWQtOCc+XCIrZGF0YS5zaG9ydERlc2NyaXB0aW9uK1wiPC9kaXY+XCIgXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC0xMicgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PGhyIC8+PC9kaXY+XCJcclxuICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC0xMScgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4OyBmb250LXdlaWdodDogYm9sZGwnID48c3Bhbj5cIisgZGlzdGFuY2VEYXRhICArXCI8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC0xMScgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4OyBmb250LXdlaWdodDogYm9sZGwnID48c3Bhbj5cIisgZnJvbUFkZHJlc3MgICtcIjwvc3Bhbj48L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTExJyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHg7IGZvbnQtd2VpZ2h0OiBib2xkbCcgPjxzcGFuPlwiKyB0b0FkZHJlc3MgICtcIjwvc3Bhbj48L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgIHJldHVybiBpbmZvYm94RGF0YTtcclxuICAgICAgICB9XHJcbn1cclxuXHJcbiAgVXBkYXRlVGlja2V0SlNPTkRhdGFMaXN0KClcclxuICB7XHJcbiAgICBpZih0aGlzLnRpY2tldExpc3QubGVuZ3RoICE9MClcclxuICAgIHtcclxuICAgIHRoaXMudGlja2V0TGlzdC5UaWNrZXRJbmZvTGlzdC5UaWNrZXRJbmZvLmZvckVhY2godGlja2V0SW5mbyA9PiB7XHJcbiAgICAgIHZhciB0aWNrZXQ6IFRpY2tldCA9IG5ldyBUaWNrZXQoKTs7XHJcbiAgICAgIHRpY2tldEluZm8uRmllbGRUdXBsZUxpc3QuRmllbGRUdXBsZS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJUaWNrZXROdW1iZXJcIil7XHJcbiAgICAgICAgICAgIHRpY2tldC50aWNrZXROdW1iZXIgPSBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFbnRyeVR5cGVcIil7XHJcbiAgICAgICAgICB0aWNrZXQuZW50cnlUeXBlID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQ3JlYXRlRGF0ZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5jcmVhdGVEYXRlID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiRXF1aXBtZW50SURcIil7XHJcbiAgICAgICAgICB0aWNrZXQuZXF1aXBtZW50SUQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDb21tb25JRFwiKXtcclxuICAgICAgICAgIHRpY2tldC5jb21tb25JRCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlBhcmVudElEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnBhcmVudElEID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQ3VzdEFmZmVjdGluZ1wiKXtcclxuICAgICAgICAgIHRpY2tldC5jdXN0QWZmZWN0aW5nID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiVGlja2V0U2V2ZXJpdHlcIil7XHJcbiAgICAgICAgICB0aWNrZXQudGlja2V0U2V2ZXJpdHkgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBc3NpZ25lZFRvXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmFzc2lnbmVkVG8gPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTdWJtaXR0ZWRCeVwiKXtcclxuICAgICAgICAgIHRpY2tldC5zdWJtaXR0ZWRCeSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlByb2JsZW1TdWJjYXRlZ29yeVwiKXtcclxuICAgICAgICAgIHRpY2tldC5wcm9ibGVtU3ViY2F0ZWdvcnkgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQcm9ibGVtRGV0YWlsXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnByb2JsZW1EZXRhaWwgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQcm9ibGVtQ2F0ZWdvcnlcIil7XHJcbiAgICAgICAgICB0aWNrZXQucHJvYmxlbUNhdGVnb3J5ID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTGF0aXR1ZGVcIil7XHJcbiAgICAgICAgICB0aWNrZXQubGF0aXR1ZGUgPSAoZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGVsZW1lbnQuVmFsdWUgPT09ICcnKSAgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMb25naXR1ZGVcIil7XHJcbiAgICAgICAgICB0aWNrZXQubG9uZ2l0dWRlID0gIChlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgfHwgZWxlbWVudC5WYWx1ZSA9PT0gJycpID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUGxhbm5lZFJlc3RvcmFsVGltZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5wbGFubmVkUmVzdG9yYWxUaW1lID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQWx0ZXJuYXRlU2l0ZUlEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmFsdGVybmF0ZVNpdGVJRCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkxvY2F0aW9uUmFua2luZ1wiKXtcclxuICAgICAgICAgIHRpY2tldC5sb2NhdGlvblJhbmtpbmcgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBc3NpZ25lZERlcGFydG1lbnRcIil7XHJcbiAgICAgICAgICB0aWNrZXQuYXNzaWduZWREZXBhcnRtZW50ID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUmVnaW9uXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnJlZ2lvbiA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIk1hcmtldFwiKXtcclxuICAgICAgICAgIHRpY2tldC5tYXJrZXQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJXb3JrUmVxdWVzdElkXCIpe1xyXG4gICAgICAgICAgdGlja2V0LndvcmtSZXF1ZXN0SWQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTaGlmdExvZ1wiKXtcclxuICAgICAgICAgIHRpY2tldC5zaGlmdExvZyA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFjdGlvblwiKXtcclxuICAgICAgICAgIHRpY2tldC5hY3Rpb24gPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFcXVpcG1lbnROYW1lXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmVxdWlwbWVudE5hbWUgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTaG9ydERlc2NyaXB0aW9uXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnNob3J0RGVzY3JpcHRpb24gPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQYXJlbnROYW1lXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnBhcmVudE5hbWUgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJUaWNrZXRTdGF0dXNcIil7XHJcbiAgICAgICAgICB0aWNrZXQudGlja2V0U3RhdHVzID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTG9jYXRpb25JRFwiKXtcclxuICAgICAgICAgIHRpY2tldC5sb2NhdGlvbklEID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiT3BzRGlzdHJpY3RcIil7XHJcbiAgICAgICAgICB0aWNrZXQub3BzRGlzdHJpY3QgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJPcHNab25lXCIpe1xyXG4gICAgICAgICAgdGlja2V0Lm9wc1pvbmUgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMudGlja2V0RGF0YS5wdXNoKHRpY2tldCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLmNvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSdHRhbWFwbGliQ29tcG9uZW50IH0gZnJvbSAnLi9ydHRhbWFwbGliLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBSdHRhbWFwbGliU2VydmljZSB9IGZyb20gXCIuL3J0dGFtYXBsaWIuc2VydmljZVwiXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbUnR0YW1hcGxpYkNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtSdHRhbWFwbGliQ29tcG9uZW50XSxcbiAgcHJvdmlkZXJzOiBbUnR0YW1hcGxpYlNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIFJ0dGFtYXBsaWJNb2R1bGUgeyB9XG4iXSwibmFtZXMiOlsiSGVhZGVycyIsIlJlcXVlc3RPcHRpb25zIiwiT2JzZXJ2YWJsZSIsImlvLmNvbm5lY3QiLCJJbmplY3RhYmxlIiwiSHR0cCIsIkV2ZW50RW1pdHRlciIsInNldFRpbWVvdXQiLCJmb3JrSm9pbiIsIm1vbWVudHRpbWV6b25lLnV0YyIsIm1hcCIsIkNvbXBvbmVudCIsIlZpZXdDb250YWluZXJSZWYiLCJWaWV3Q2hpbGQiLCJJbnB1dCIsIk91dHB1dCIsIk5nTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7UUFvQkUsMkJBQW9CLElBQVU7WUFBVixTQUFJLEdBQUosSUFBSSxDQUFNOzRCQU5uQixLQUFLOzJCQUNOLElBQUk7d0JBQ0MsSUFBSTswQkFDTCxJQUFJOzZCQUNFLElBQUk7WUFHdEIsSUFBSSxDQUFDLElBQUksR0FBRywyQ0FBMkMsQ0FBQztZQUN4RCxJQUFJLENBQUMsU0FBUyxHQUFHLG1DQUFtQyxDQUFDO1NBQ3REOzs7OztRQUVELGtEQUFzQjs7OztZQUF0QixVQUF1QixRQUFROztnQkFDN0IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7Z0JBQzFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLElB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