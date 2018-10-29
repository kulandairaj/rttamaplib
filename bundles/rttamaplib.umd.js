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
                loadCurrentLocation();
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
                    map$$1.entities.push(pushpin);
                    _this.dataLayer.push(pushpin);
                    Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked);
                    map$$1.setView({ mapTypeId: Microsoft.Maps.MapTypeId.road, center: new Microsoft.Maps.Location(data.latitude, data.longitude) });
                    initIndex = initIndex + 1;
                });
                $('.NavBar_Container.Light').attr('style', '480px');
                /** @type {?} */
                var infobox = new Microsoft.Maps.Infobox(map$$1.getCenter(), {
                    visible: false, autoAlignment: true
                });
                /**
                 * @param {?} e
                 * @return {?}
                 */
                function pushpinClicked(e) {
                    if (e.target.metadata) {
                        /** @type {?} */
                        var ll = e.target.getLocation();
                        loadTruckDirections(this, ll.latitude, ll.longitude);
                        infobox.setMap(map$$1);
                        infobox.setOptions({
                            location: e.target.getLocation(),
                            visible: true,
                            offset: new Microsoft.Maps.Point(0, 40),
                            htmlContent: '<div style="margin:auto !important;width:450px !important;background-color: white;border: 1px solid lightgray;">'
                                + getTicketInfoBoxHTML(e.target.metadata) + '</div>'
                        });
                    }
                    $('.NavBar_Container.Light').attr('style', 'top:480px');
                    pinClicked(e.target.metadata, 0);
                    Microsoft.Maps.Events.addHandler(infobox, 'click', close);
                }
                /** @type {?} */
                var currentLatitude = 40.3128;
                /** @type {?} */
                var currentLongitude = -75.3902;
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
                    console.log('emit', selectedTicket);
                    that.ticketClick.emit(selectedTicket);
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
                 * @param {?} that
                 * @param {?} endLat
                 * @param {?} endLong
                 * @return {?}
                 */
                function loadTruckDirections(that, endLat, endLong) {
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
                                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA9CAYAAAAeYmHpAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAY1klEQVRo3qWbaaxl2XXXf2vtc84d3vxeDT1P7nbb7m7b3c5k4hgLMB/yIbEiEEIJEiAHgRASggBBIR9Q5EgghIQVR9AJibCIEQqKFDGIKSGOoRPSdlvddLurJ3f1UFVdVa+q3nSnc85eiw97n3vvq8FdDUe69W69d+85e+01/9d/i7tzu5cZqKb3buAKOBiGu2AOBphDdMc8/T4i4I47ILe4uYMIIELAEXFUlCCCCiigQvo9CgJiIHrj2t7vktsR2j2vVcDMcFXcDHPB3DAUc2gs4iiNG605rUM0T5vh4ICZu6iIOQ6Oioibu6qIZMFUoFAh5J+lKIJRakAFAoaIouKIKmKGZom927z/H6EdwMAlvXeztHh3oivRjcadxqB1p47QAtPWvDEnOrSd0OYYjogsNO7g7iiCaNJqkV+lCr1CpQCqAKUIhUIlkq3AUBGSgShBk8ZFb21QAMX7Cex5903SoiMkQcxpPVIbzFqnNmdq7rMIUzPq6LQGjTkzgzoarUGUtDBzA0BFUBWCkwQKSk+hDEIp0AvmlSqDAJWK9AqhClBJnG9M0r5jpPfWafSDCt0JTPbP6Em7rSVt1ga1OZPWmUT3SWtMs8BTg/265aiBUePsNZHD2hjF9JnWHfP0BJFkvn2FlVJYqwKbRUjvS2GjCvTV6KvSK/BhVAZBpB+EngpRnTKk+FJYWrMguNxa8OJWAncO4ggGtDGZcW0waZ2ZOaPWfNw4o9aYmnNUO5emLVdq4/w4cmXWsj+DGZYe3u2kLD9FwOOx1ZWqbJRwsl9w10pgp1JO9ArWK2HUGish+LCEQaEyVKGPULrjGig0BT3Jzn2z2HmDT/tc3qQNQ4nu1FmwSXRGjftRaxzWxsSc/SZybtRybhR5d9xweWqYJMtwE6IbSIru0smenyvZJzs3EndUNUdvIRicHCp3DwvuWS24c1CwVQYGKqxWymqprBQigyD0g2a3EITs7zmqya2Evl7g6BBdmEVnGo1R64yi+0FtHNSRo9Z4d9Ty3aOGd45aduu4EFSS77ule7kIuODcPHAKAuJJaElBLQgEB1EniLDTC9y7UvCh1ZJ7VgpWS2W9DKyVymohMiyEQVCqIARxgnBTwYsbBKbLtULrKQCNW+eoNQ4b84PGOGicK7OGV/ZaXj9quDiOREiBKvt+l6vJudvdEeF7CL34jJLC/TxHe4rmlybG1WnNxUnkQ7OSR9dKmj7UZrSmHl3FHVyEnuo8zSoLC5NOaO/sPy/WkBSwcqA6ao392nyvjhw2zjvjyIvXZpw9ajlqnRiNNn/HRLBo87zsnZi+vLVyk/c+/5UA4kLEk9BBac0pFKI458bOXm1cnUUe3+xx77BI9UB6nKCaErYKhaTCKBU2ScZjgcw9hf02pkA1jsZRYxy07tfq5MOvHTY8f7Xm3LilNmgsFSKRVIi4e0pvvrAdR47Leau4KovN6T5qImhrSE5FMacma5wzew1HjVNv93lorcDFwMVdTCiBXLkVmmJFZ+aF52BipFxsBo2noDVqnb0m+t4spZ1X9mu+fXXGpUlk5k5rQjSn7UpQA8eAHDWFJDDfI39c/wdZmGHKak50R1yT60kKFlHTBrwzaqnjlNpLHlmrUiGFuIqIihFEc4xI91QRCoFcJiZtNQbTCOPGOWyiHzbOQRN5/aDhuas1lyeRmUMdnWiLHO6diXZROqeL26/sb7IJOQOoCO5GdMFccHGCa4oBOO9NWp7dNQThw2sQNFBo9EAQWaoAuzRWuCUriDGZTW2WI7XNo/R3j1q+dXXGpUlL48mkowvRjNYlGxyYLIKHH1/+PBu01m3S4u9BIGjSgGYTnG9Wt3kiqFsqY10X3UbuNC5NIt/anVIJhJAifynihYoUaqgoiqOFUJh2ClLaaEyjM27dD5sUpC6MIy9dnXFh1NKYU+M0JnhMDYfT+ZsuFrvkl7XBJBol8LGtHk9sVdw9LNjoBdyMvcY5P2556VrDS/s1jUUGQSm7+jkLTd5UxVLed8Vj0phjuAjnJ8bz12qGpRJWCip1ShVKVQpxyqB4Lnepc4c0a2EWnXETOWqFa3XkOwc1rx1FojsNQoyp0zKX1FKKHo/D2dTbXAD/4Mkef+6hNT5zqi+T1vjWldrfOKw5e9gAsFkJnz094G9+bEMGQfjGe1P/N2ePeHZ3ltKL5qiQhbccnKIb6klRuNKoIOJ897Blq1ezVir9UNCP7r1oUiCoRvoeKMzJ/gIzYNLiR1E4alrePGw5s9dgbqmLypF6WeBjgddTO1kIfPrkgL/+0TV2esq/fO2Qn3l219+5VjOPa13/54vcdu9WxZ+9f5UvPbXF7sT58it7fPPyDIPcYy+07qKpaXGltRQ8gwhtgBf3ak72AsOg9FXpF+o9RSpPjY7U0ZlaZNI4hw1cmbV+dRp546jhmUsT3jiK1NFootN4Cl4mTmoGj6e7xmGrEv7WY9s8uV3yj1/a42uvHgIkX8q58mZXt2HWplr1Jx9e4+9/fJM/2q35py/usd/YDd9PUd5QF4KmjqtK7SgPrRZ85lSfB1ZLdvqBnaqQtR4Mg6JOEqQxmJr5JDr7TSov3xq1WLaCSAcE3FjCe+6nH92o+Oc/dJrozqf/0zm+9uohZSn0KqXURTl4s6guIql/rpSyEH7jtUM+9R/OIe585YdO8OH1ksbI3dnxSO90FaAkxbhx9qjh3bFx0FjqBM28iali1GSykrqmaIxbY7c2Xj9slwAAyaVlqqE9VcpzgWcRPrXT4x993w7/7q0jvvh7F6mj06v0WDTuGg0xR6Lh0XDLyW4p4qsk4dvo/KWvX+Tfvz3mF57c5qmdHo0tNSukOsBF5qWvu9LkcviV/RlXamMcjXF0pjEpp4gutGZMo/u0dY5iynvvTdu0e+YpPXlnUksCA9PofGyj4u8+scnTZ/Z4+jt7lL0wFzbDY0gdoYnQGBJzJZMkhF7RIQh4SNKnICZopfyTF69y0Bp/+7ENvvTCHi/u1fTUlzo0SfrOaTGYYyq8N428N2o41QusFEYdkqxF6wkMmFnqpA5mkbcOGsygZQEeeNcpLV3RnJ1e4O88sclvvzvh6TMHlFU4nmvriIwaZFQnwW0BYs3v5jO8UFgpYVjBMMw3V0UoCuXpV/fZqJS/8dENfu7bV7k2i5RLy0l9vyO5USrciSa8edTy4JqxXikzc2/MRWPGteqYzHS/Ns5P2lRpmcyrteOlRjKx2p0vfniDc+PIL31njyIs+a2QhL08Rq9OkFlMXwy6QP/mLxAzZH+KXB4he9MURDpzRyhUePqVA85PWv7iw+vErIiloIAvd3iWTP7CxNhvItPozLJ5a8K60i/GrXNpFhlHiEj2Ecmd0nEUojF4YrPiyZ2SL7+8xzRa6mQ6gY9q5MoYnbbJxDW5yKQxJrPIZNqmVx2Tn+YNETPk2hS9Ol4CGlJ7eNQav/rqAY9vljy+mfx74dtdR+cJdvYkw7g1Lk4j0zbJ2LpT5BbSa/P0gXGcR8N5e9h1D8vBy5w//8Aa/+38mFf260XrJiDTBtkdJ9/V1M5NG6NXCH/yoXWevHPIzrBg1hqvX5nxu2cPOH/QUIVUjuKOHM0QBT8xRHItL+6c2a/5/YsT/swDK/z8t2eUvkhjqYtMa+gs1IELY+Mj68YsKrW5F+ap+W8NZga7sxa3hZl0pr2s5ejw4FrBwxslXz6zR22pIOlAOS6N5gKbO210nrpryM999i6eunMoJ1dKhqXQGlybtJzdr/1fffsyv/bcFZpolCH1w7I/g2GFDwsk3Y5R6/z382P+4ZM7PLRW8u6oXfLtpPO5wjKgcGmS2uCYZS1cEjrZeGTWRvYbx8WJsftS5zsLTTfm/OCJPmf2as6P20WZKMD+FKlTE+DumMGn71vlqz/xoDy41T8WCMsAp1ZLTq2W8vHTA+5dr/wXv3GBaeMpPrjjl0fwwGbahAwIvDuOvHbQ8KmdHmcPG0qVudCpDk8aj5Z26rAxZtFS7++afNpy93PYpPTkuRVL4P6NFVRj8Mmtihf2asZt0kCKOIruTRFNG9BE547Vkl/7wgM3CHz91S+Un/3sXfKFj2wRQrIQJKU6mbZzSDcIHNTGq/s1j22Uc79evtwWnVmUhAQd1DYfOmiqYVMhP4qWYF8TfAk4vr7cLBTuXS1547BlGn3x91kDdZx/rl8qP/XJbR7ZGXC71y9+/h5Zq5RoyUlFBfZnx9LcKDpnR5G7Vwr6hd5Ypc0LCcETQMdR9DyZAXWzPG9KtfUNTf91ijaHE4NAcLgwbmk7nxeQHKk7IGG1VH7y4yduW2CAe9YrPnHHIAelpG2tm2PriGbsTltw4UQvpaqbrbmr2xyn8YwOmaOIoJomim2UDPHcGvFwYCUI01zjdv4MIM2yRUAZlMdODd5nnHbj9X13rc0DI5Ca8k6e/KzWoAEGhdxyrcvfaduYSuA8DPjAkI6KplHt8TuDxbkZOhD0/w0sWu0tqeumC0y9c5qH3d6exqWbaOfDkodgXZy+1a0EGDWRXiEUGUDoADyvAiw1A60JR7XxQa+z15pUUub/29Lc2TMqU+SubNa8//3doQohuwyoqBJUUIQyyBzjOtZVLAstcK1O1ddWFVDJgzhI9XP+vAqMG+O/vr7/gdX9v94+TIEsP1+qYnnAhoqwVikFwrXGF9lj8ZH5WpG0tlJSOZumpJ4ECGKshCStSCo6uznb8qpFhElrvDdueWi9oK+6wMUG5RwzUoFRHfn15y5/IIF/86Wrfv6wmVd4uOOr1dyCHBgE5f6VksvTyGFrN1plRyLIwwIkxSHpSv3QzXdFWC2V4I46SLZzkeOK6lq+F/ZqHtuoGBQpUgMQBFspM9CYAsz/fPuIr/zvS7el7TeuTvnS1y8wbmJabNe/r5Z0yzCH9VJ4eLXkzH59UzRGZDEpVE/Q4XolhLTERNMoRCgSlsRapankU+aRWUSOqbtU4dndGR/fqjjZDwtwIDq+M0iRwdMs6rCO/MLXz/HLz170K+P2psKaO3/wzpH/9G+f9e9cniyGbub4Wi+VbnQTGDg9DHxks+SbV+qlaox51db12UFTWbxShTTRlDTmKUJ+U2oadW71A9fqiNqC4GLuxwdgAi/v1ew1xudOD3jzqJ1/hl6Jb/SRXJmVquyOW/7ef3mXP3hr5H/q4XUe2uqx3gs00blw1PDNcyP+7YtXef3KlCIkv8McLwNsD+gQjGTawh872eewMc7s15THyDUOJLRG8/BPBHZ6gV4e44ZO6DJAFYRBEE71lTcPO4FtyT+WAHpJSMVvnh3xxUfW+M/nJ7wzalLzacDWEG8sAQdZ8Do6//r5XX7r5Ws8tN1jox9oWuedg5oL2YersKRhFfzkEC8EybyU6PDgSsGP3r3CV797mLgqS4hsEjkBCZrZSQic6in9kEDDMiCqibchlQj9AKd6gUpIzJ3s08k/j7tlFYRnLk24OI389KPreYCfXSm3hLZWgacNCir0yzR9fPnyhGfePuKb50fsjlv6RUIwBSAaXil+agUfHvflQuEvfGiNK7PIH16eUoXjuXxu2rIY+ZYq3DUI9BJnJUFQhSbnLkOqbjZ7gVODkKGaFOA6zS4PHjUjFV95eZ/Pne7zEw+s0kbP86WUvnxniO30oVSIhnh6VhVS/OgVmgIRLEx4rYefWMFXlgVO8PCP37PKj5wa8PSrKaUtw1KybIUi84B1uh/Y7AUGRZqaFAIaJBFWeir0grBRKvetVtl30w3UO8TquLZLhbeOGn7p5X3+wSe2+fTpAXVjiwInKL7ew06tYDtDPAe9NL3PTbznDdrsYXespUDYL+YCuztN6/zI6QE/8/gmv/LaAW8eNVQ3EOXSZmsOoEEFQXhwtWK1VHqq9EIe8SSCmlKpST+IrxTKnQNlpx/YnUYKd1wV8zhvALotEEn0pm9cnLJ+Zp9f/+FT8pefueTPvDum6ul8170qkimtVclfY9fjSVJ9TqCuxwFDd6eeGZ+7b4V/9v0n+OUz+/z+exMq5RiGLhnMUlGCaqJeqLBdKXcMlZVCyGwkSZlKhCAxUZaCMSzgxKDg4bWSK1OjECdm0sqCRrHAy1SEQp3/+M6YcYt/7TOn5Ev/55r/ykv7SJn4H/NBXBAIkAbmN17L2baOjtfGX31ik5/9xLb8/Ld2/X+8N71hsilLqUpFUCxZqMOH19N0Y9gJHYRCnEIxqiDUBkMXmQT1zRLuHZa82au5OIWyCFgTc1GUZ0i57l4W/HcvjHl7VPuXv/8kP3bfCn/tmV3e3ZtBFa4zR1lW57HoW1v65+6tkl/9/F3c3Q/81O9d9LNHTaJLXT/KdUNRQlePh8QkPNUL3L9asFkqg6D0g0hVKJWCqigqShWcvgRWCmGlgHtWAh/b6lNKSDdUJRSCho5bYMceriJUCm8ctvzo75zn5b2G537sHvnqn7iLJ3d61LVRN4lJWJtRx/wyT79rjLo2njrR4zc+f5oXvnCfPH9txp/+nfO8NWoobyKw5Lm4BicUQghOKUn4J7Z73DEsWQnKsBQGKpTqiCjSRKP1tJhpFPYb49os+u40cm7S8oeXZ3xnr07kOYTGnMYciwa6mEt35tlVTZPW2CgL/sqja/z4fStiDt+4OPXnrs54e9SwV6elb1bCfSslT233+ON39EWA33pr5P/i1X0Oa2elXMSP5TCqGFgi4aQZdOKPlQqPb1X8wE6Pu1cLTlSBrV6Q9VLpq9MvBEmgfhJkFplTp65ME+Pvu4eRZy5POT9uEjWyNWoyEykmkpxnBsL1c2pzZxwddefjO31+4ESPj6xX3LkSWC8D4Ow3zoVxy6sHNX+0O+X5qw3mzjAkzujNeEjqKf1pSNToAqcqkmnfMyz44ZN9HlwN7PQLdnqBtVJlpVB6IZXQBe6JS62JajgIQmsiq5V6bYH7V5VRa0xiojB5kWjP0QSCYtFQWW7ms0Zyjl/LMPDLezUvXJulUW+2hqSxZLZBE8t3EJhXWR2C0xn1/OeywOqUmnLwdhX45HaP+1ZKVqvUQHU80jJj6gopekdP/aZoyiTDoESQaO7RjUfWSyZmPHdlxn6dKA8NnuhIQTOrKPfVSxj0ctlaBahuA+VYhqqWhe1gaEUJYWmjVKlU2CyFp7ZLPrRaZCKtslaqDILSy6ZfdJSqFIQSsJdLUiwk2DRWKtESoPjYeoWZ8MK1KdeaxOQRHHWhJbMT5ivOwi9NRm4XSVgM9XwBDuanaa60QqZQlqmWZqtSntzu8dHNis1eYL1S1guVQSH0s793zYf4Ek2ySz1BoXInIqygeIWY4G6BJ7bTQ164OmN3lsCHNibuZnSZTxVilrJb9PUbcGs1+xzS6b4jIgQ6ACDn2SBzrveJnvKJ7R6PrpdsV8pmpWxUKiulJoFzbNClLHmMMdi1pqKC5YdaISlCZ9rh4xs9+kF4aa/m3FHLLHc1MR9fcM9dUW5SLEMv0oEC16vUl/47F3RBZBU81/9OIel9qdBX4Z7VksfWSx7aKNkoQxI4kWPp57K66y2W2+4COmZfx8lMQpeWuoPELXER3IMahSgfDRXrZeCVasbrBzWHrdDmSihaYha5CGaJOu0Zd5rzRHP07/x9zitcYuyqeIreebigqhSe6oX1SnhkveTRjR53DRILeKOSFKWDMphXX7lh8iUZ5Trz7jZAuxYLh3xoRAiSCG7uidCSHnRHP/DGYcuboybRHkgtYDQn5omliWaahWSaxRIS053B6DSsAm6ZAeyJCEc6n1GJ8MBaycNrJfetFmxVKWitlcpaKTLoBC6UMtffy8dFbmrendBk/6Yj5hUZfjGlEJNC1Ct1elqwXginhwUPTEreOqx568iZxJay6LgqiahjohnzShzweXPhjqhkTE7mHO0gieiOw6BQ7l9RHlgtuXNYcqqnDItMci8kk9wzUJDPfiQ/7gqb62S81WmdZWJMOn6UCxhzpm0qOsaN+ygT4I9SJceV2nlnNOP8xNidGG32Y89HI9znya0z9KUpSeqUBKfQNLK5exi4d9hjuyds9wPDQlkJicw+LEWGQRgUMqdTLSK13BK//55HlDog30nzI8tcscZgZs6szYz/TNKZRmdqzv7MOIzO4SxytYlcmrTs184oJv54a8eLk0KTEKslbJSBkwNlpyxYrYT1MgWnKgs3CMIwaDq4kgNWkcGBIp/b6rR7y4HF+x5G85TDzVIYSkcc8izJnToaM4NZa0wiPo3GLEKNU7dpExZ8j/Rq8/fJ/p8WnICMKqQ2sK9JqBKhF6AflEGB9LIZd7V2F52DkA6meZ5VfY/seFsn8CwHmkReNyyCkw6itZn3XVvumJJgPvM0n64t0ZjSwbTMCnSfj4K7AypdpK1UCKpU6gnpyBheTzsTVgpNnVTIQVZDIvSGvNb3O314W0IfU3w+Y+m5EDEgxkgUJVqkbgWThTYbi7SmtO4eM2E9cVkWPt1hcSGjGoWkI4adFagLVeEEDQQ3QgjpXEZXZc1Z0Ivjh9/r+r9c3wLt7IPIOAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMC0yNVQyMjo0MzowNi0wNTowMFCzkCoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTAtMjVUMjI6NDM6MDYtMDU6MDAh7iiWAAAAAElFTkSuQmCC'
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
                            //maps.layers.clear();
                        });
                        dirManager.calculateDirections();
                    });
                }
                /**
                 * @param {?} data
                 * @return {?}
                 */
                function getTicketInfoBoxHTML(data) {
                    console.log(data);
                    /** @type {?} */
                    var infoboxData = "<div style='padding-left:5px;'><div style='position: relative;width:100%;'>"
                        + "<div><a href='javascript:void(0)' style='text-decoration: underline'>" + data.ticketNumber + " </a> <i class='fa fa-times' style='cursor: pointer'></i></div>"
                        + "<div class='row'>"
                        + "<div class='col-md-4' style='padding-left:15px' ><span>Severity:</span></div><div class='col-md-8' style='color:red;'>" + data.ticketSeverity + "</div>"
                        + "</div>"
                        + "<div class='row'>"
                        + "<div class='col-md-4' style='padding-left:15px' ><span>Common ID:</span></div><div class='col-md-8'>" + data.commonID + "</div>"
                        + "</div>"
                        + "<div class='row'>"
                        + "<div class='col-md-4' style='padding-left:15px' ><span>Affecting:</span></div><div class='col-md-8'>" + data.custAffecting + "</div>"
                        + "</div>"
                        + "<div class='row'>"
                        + "<div class='col-md-4' style='padding-left:15px' ><span>ShortDescript:</span></div><div class='col-md-8'>" + data.shortDescription + "</div>"
                        + "</div>"
                        + "<div class='row'>"
                        + "<div class='col-md-11' style='padding-left:15px' ><hr /></div>"
                        + "</div>"
                        + "<div class='row'>"
                        + "</div>"
                        + "</div>"
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
            { type: i0.Component, args: [{
                        selector: 'att-rttamaplib',
                        template: "  \n  <div id='myMap' class='mapclass' #mapElement>\n  </div>\n  ",
                        styles: ["\n  .mapclass{\n    height: calc(100vh - 4em - 70px) !important;    \n    display:block;\n  },\n  .infyMappopup{\n\t\tmargin:auto !important;\n    width:300px !important;\n    background-color: white;\n    border: 1px solid lightgray; \n  },\n  .popModalContainer{\n    padding:15px;\n  }\n  .popModalHeader{\n    position: relative;\n    width:100%;\n  }\n  .popModalHeader a{\n    display: inline-block;\n    padding:5px 10px;\n    background-color: #ffc107;\n    border-color: #ffc107;\n    position: absolute;\n    right:10px;\n    top:5px;\n  }\n  .popModalHeader .fa{\n    position: absolute;\n    top:-10px;\n    right:-10px;\n  \n  }\n  .popModalBody label{\n    font-weight: bold;\n    line-height: normal;\n  }\n  .popModalBody span{\n    display: inline-block;\n    line-height: normal;\n    word-break:\u00A0break-word;\n  }\n  .meterCal strong{\n    font-weight: bolder;\n    font-size: 23px;\n  }\n  .meterCal span{\n    display: block;\n  }\n  .popModalFooter .col{\n    text-align: center;\n  }\n  .popModalFooter .fa{\n    padding:0 5px;\n  }\n  "]
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

    exports.RttamaplibService = RttamaplibService;
    exports.RttamaplibComponent = RttamaplibComponent;
    exports.RttamaplibModule = RttamaplibModule;
    exports.TruckDetails = TruckDetails;
    exports.TruckDirectionDetails = TruckDirectionDetails;
    exports.Ticket = Ticket;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL3J0dGFtYXBsaWIvbGliL3J0dGFtYXBsaWIuc2VydmljZS50cyIsIm5nOi8vcnR0YW1hcGxpYi9saWIvbW9kZWxzL3RydWNrZGV0YWlscy50cyIsIm5nOi8vcnR0YW1hcGxpYi9saWIvcnR0YW1hcGxpYi5jb21wb25lbnQudHMiLCJuZzovL3J0dGFtYXBsaWIvbGliL3J0dGFtYXBsaWIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHAsIFJlc3BvbnNlLCBSZXF1ZXN0T3B0aW9ucywgSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaWJlciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tYXAnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci90b1Byb21pc2UnO1xuaW1wb3J0ICogYXMgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5pbXBvcnQgeyBUcnVja0RpcmVjdGlvbkRldGFpbHMgfSBmcm9tICcuL21vZGVscy90cnVja2RldGFpbHMnO1xuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlci9zcmMvdXRpbHMvY29sbGVjdGlvbic7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJ0dGFtYXBsaWJTZXJ2aWNlIHtcblxuICBtYXBSZWFkeSA9IGZhbHNlO1xuICBzaG93TmF2ID0gdHJ1ZTtcbiAgaG9zdDogc3RyaW5nID0gbnVsbDtcbiAgc29ja2V0OiBhbnkgPSBudWxsO1xuICBzb2NrZXRVUkw6IHN0cmluZyA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XG4gICAgdGhpcy5ob3N0ID0gXCJodHRwczovL3psZDA0MDkwLnZjaS5hdHQuY29tOjg0NDMvUkFQVE9SL1wiO1xuICAgIHRoaXMuc29ja2V0VVJMID0gXCJodHRwczovL3psZDA0MDkwLnZjaS5hdHQuY29tOjMwMDdcIjtcbiAgfVxuXG4gIGNoZWNrVXNlckhhc1Blcm1pc3Npb24odXNlck5hbWUpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciB1c2Vyc0xpc3RVcmwgPSB0aGlzLmhvc3QgKyBcImF1dGh1c2VyXCI7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVzZXJzTGlzdFVybCwgdXNlck5hbWUpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TWFwUHVzaFBpbkRhdGEoYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgc3VwZXJ2aXNvcklkID0gW107XG4gICAgc3VwZXJ2aXNvcklkID0gYXR0VUlELnNwbGl0KCcsJyk7XG4gICAgdmFyIHVzZXJzTGlzdFVybCA9IHRoaXMuaG9zdCArICdUZWNoRGV0YWlsRmV0Y2gnO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1c2Vyc0xpc3RVcmwsIHtcbiAgICAgIFwiYXR0dUlkXCI6IFwiXCIsXG4gICAgICBcInN1cGVydmlzb3JJZFwiOiBzdXBlcnZpc29ySWRcbiAgICB9KS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmRUcnVja05lYXJCeShsYXQsIGxvbmcsIGRpc3RhbmNlLCBzdXBlcnZpc29ySWQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzdXBlcnZpc29ySWRzID0gW107XG4gICAgc3VwZXJ2aXNvcklkcyA9IHN1cGVydmlzb3JJZC5zcGxpdCgnLCcpO1xuICAgIGNvbnN0IGZpbmRUcnVja1VSTCA9IHRoaXMuaG9zdCArICdGaW5kVHJ1Y2tOZWFyQnknO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChmaW5kVHJ1Y2tVUkwsIHtcbiAgICAgICdsYXQnOiBsYXQsXG4gICAgICAnbGxvbmcnOiBsb25nLFxuICAgICAgJ3JhZGl1cyc6IGRpc3RhbmNlLFxuICAgICAgJ3N1cGVydmlzb3JJZCc6IHN1cGVydmlzb3JJZHNcbiAgICB9KS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFdlYlBob25lVXNlckRhdGEoYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgbGRhcFVSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvZ2V0dGVjaG5pY2lhbnMvXCIgKyBhdHRVSUQ7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQobGRhcFVSTCkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRXZWJQaG9uZVVzZXJJbmZvKGF0dFVJRCk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIGxkYXBVUkwgPSB0aGlzLnNvY2tldFVSTCArIFwiL2dldHRlY2huaWNpYW5pbmZvL1wiICsgYXR0VUlEO1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGxkYXBVUkwpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgR2V0TmV4dFJvdXRlRGF0YShmcm9tQXR0aXR1ZGUsIHRvQXR0aXR1ZGUpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciByb3V0ZVVybCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL1YxL1JvdXRlcy9Ecml2aW5nP3dwLjA9XCIgKyBmcm9tQXR0aXR1ZGUgKyBcIiZ3cC4xPVwiICsgdG9BdHRpdHVkZSArIFwiJnJvdXRlQXR0cmlidXRlcz1yb3V0ZVBhdGgma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIlxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHJvdXRlVXJsKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzW1wiX2JvZHlcIl07XG4gICAgfSk7XG4gIH1cblxuICBHZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlsczogYW55W10pOiBhbnlbXSB7XG4gICAgbGV0IGNvbWJpbmVkVXJscyA9IFtdO1xuICAgIGxldCByb3V0ZVVybDtcbiAgICB2YXIgbmV3Um91dGVVcmw7XG4gICAgZGlyRGV0YWlscy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICByb3V0ZVVybCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL1YxL1JvdXRlcy8/d3AuMD1cIiArIGl0ZW0uc291cmNlTGF0ICsgXCIsXCIgKyBpdGVtLnNvdXJjZUxvbmcgKyBcIiZ3cC4xPVwiICsgaXRlbS5kZXN0TGF0ICsgXCIsXCIgKyBpdGVtLmRlc3RMb25nICsgXCIma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIlxuICAgICAgbmV3Um91dGVVcmwgPSB0aGlzLmh0dHAuZ2V0KHJvdXRlVXJsKVxuICAgICAgY29tYmluZWRVcmxzLnB1c2gobmV3Um91dGVVcmwpXG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbWJpbmVkVXJscztcbiAgfVxuXG4gIHNlbmRFbWFpbChmcm9tRW1haWwsIHRvRW1haWwsIGZyb21OYW1lLCB0b05hbWUsIHN1YmplY3QsIGJvZHkpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzbXNVUkwgPSB0aGlzLnNvY2tldFVSTCArIFwiL3NlbmRlbWFpbFwiO1xuICAgIHZhciBlbWFpbE1lc3NhZ2UgPSB7XG4gICAgICBcImV2ZW50XCI6IHtcbiAgICAgICAgXCJyZWNpcGllbnREYXRhXCI6IFt7XG4gICAgICAgICAgXCJoZWFkZXJcIjogeyBcInNvdXJjZVwiOiBcIktlcGxlclwiLCBcInNjZW5hcmlvTmFtZVwiOiBcIlwiLCBcInRyYW5zYWN0aW9uSWRcIjogXCI1MTExMVwiIH0sXG4gICAgICAgICAgXCJub3RpZmljYXRpb25PcHRpb25cIjogW3sgXCJtb2NcIjogXCJlbWFpbFwiIH1dLFxuICAgICAgICAgIFwiZW1haWxEYXRhXCI6IHtcbiAgICAgICAgICAgIFwic3ViamVjdFwiOiBcIlwiICsgc3ViamVjdCArIFwiXCIsXG4gICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJcIiArIGJvZHkgKyBcIlwiLFxuICAgICAgICAgICAgXCJhZGRyZXNzXCI6IHtcbiAgICAgICAgICAgICAgXCJ0b1wiOiBbeyBcIm5hbWVcIjogXCJcIiArIHRvTmFtZSArIFwiXCIsIFwiYWRkcmVzc1wiOiBcIlwiICsgdG9FbWFpbCArIFwiXCIgfV0sXG4gICAgICAgICAgICAgIFwiY2NcIjogW10sXG4gICAgICAgICAgICAgIFwiYmNjXCI6IFtdLFxuICAgICAgICAgICAgICBcImZyb21cIjogeyBcIm5hbWVcIjogXCJBVCZUIEVudGVycHJpc2UgTm90aWZpY2F0aW9uXCIsIFwiYWRkcmVzc1wiOiBcIlwiIH0sIFwiYm91bmNlVG9cIjogeyBcImFkZHJlc3NcIjogXCJcIiB9LFxuICAgICAgICAgICAgICBcInJlcGx5VG9cIjogeyBcImFkZHJlc3NcIjogXCJcIiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgXCJhdHRyaWJEYXRhXCI6IFt7IFwibmFtZVwiOiBcInN1YmplY3RcIiwgXCJ2YWx1ZVwiOiAgc3ViamVjdCB9LFxuICAgICAgICB7IFwibmFtZVwiOiBcIm1lc3NhZ2VcIiwgXCJ2YWx1ZVwiOiBcIlRoaXMgaXMgZmlyc3QgY2FtdW5kYSBwcm9jZXNzXCIgfSxcbiAgICAgICAgeyBcIm5hbWVcIjogXCJjb250cmFjdG9yTmFtZVwiLCBcInZhbHVlXCI6IFwiQWpheSBBcGF0XCIgfV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICB2YXIgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IGhlYWRlcnMgfSk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHNtc1VSTCwgSlNPTi5zdHJpbmdpZnkoZW1haWxNZXNzYWdlKSwgb3B0aW9ucykudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBzZW5kU01TKHRvTnVtYmVyLCBib2R5TWVzc2FnZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHNtc1VSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvc2VuZHNtc1wiO1xuICAgIHZhciBzbXNNZXNzYWdlID0ge1xuICAgICAgXCJldmVudFwiOiB7XG4gICAgICAgIFwicmVjaXBpZW50RGF0YVwiOiBbe1xuICAgICAgICAgIFwiaGVhZGVyXCI6IHsgXCJzb3VyY2VcIjogXCJLZXBsZXJcIiwgXCJzY2VuYXJpb05hbWVcIjogXCIgRmlyc3ROZXRJbml0aWFsUmVnaXN0cmF0aWlvblVzZXJcIiwgXCJ0cmFuc2FjdGlvbklkXCI6IFwiMDAwNFwiIH0sXG4gICAgICAgICAgXCJub3RpZmljYXRpb25PcHRpb25cIjogW3sgXCJtb2NcIjogXCJzbXNcIiB9XSxcbiAgICAgICAgICBcInNtc0RhdGFcIjoge1xuICAgICAgICAgICAgXCJkZXRhaWxzXCI6IHtcbiAgICAgICAgICAgICAgXCJjb250YWN0RGF0YVwiOiB7XG4gICAgICAgICAgICAgICAgXCJyZXF1ZXN0SWRcIjogXCIxMTExNlwiLCBcInN5c0lkXCI6IFwiQ0JcIiwgXCJjbGllbnRJZFwiOiBcIlJUVEFcIixcbiAgICAgICAgICAgICAgICAvLyBcInBob25lTnVtYmVyXCI6IHsgXCJhcmVhQ29kZVwiOiBcIlwiICsgdG9OdW1iZXIudG9TdHJpbmcoKS5zdWJzdHIoMCwgMykgKyBcIlwiLCBcIm51bWJlclwiOiBcIlwiICsgdG9OdW1iZXIudG9TdHJpbmcoKS5zdWJzdHIoMywgMTApICsgXCJcIiB9LCBcIm1lc3NhZ2VcIjogXCJcIiArIGJvZHlNZXNzYWdlICsgXCJcIixcbiAgICAgICAgICAgICAgICBcInBob25lTnVtYmVyXCI6IHsgXCJhcmVhQ29kZVwiOiBcIlwiLCBcIm51bWJlclwiOiBcIlwiICsgdG9OdW1iZXIgKyBcIlwiIH0sIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keU1lc3NhZ2UgKyBcIlwiLFxuICAgICAgICAgICAgICAgIFwic2NlbmFyaW9OYW1lXCI6IFwiIEZpcnN0TmV0SW5pdGlhbFJlZ2lzdHJhdGlpb25Vc2VyXCIsIFwiaW50ZXJuYXRpb25hbE51bWJlckluZGljYXRvclwiOiBcIlRydWVcIiwgXCJpbnRlcmFjdGl2ZUluZGljYXRvclwiOiBcIkZhbHNlXCIsXG4gICAgICAgICAgICAgICAgXCJob3N0ZWRJbmRpY2F0b3JcIjogXCJGYWxzZVwiLCBcInByb3ZpZGVyXCI6IFwiQlNOTFwiLCBcInNob3J0Q29kZVwiOiBcIjExMTFcIiwgXCJyZXBseVRvXCI6IFwiRE1BQVBcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgXCJhdHRyaWJEYXRhXCI6IFt7IFwibmFtZVwiOiBcImFkbWluRGF0YTFcIiwgXCJ2YWx1ZVwiOiAxMjM0NTY3IH0sIHsgXCJuYW1lXCI6IFwiY29udHJhY3Rvck5hbWVcIiwgXCJ2YWx1ZVwiOiBcImNvbnRyYWN0b3IgbmFtZVwiIH1dXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XG4gICAgdmFyIG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoeyBoZWFkZXJzOiBoZWFkZXJzIH0pO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChzbXNVUkwsIEpTT04uc3RyaW5naWZ5KHNtc01lc3NhZ2UpLCBvcHRpb25zKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFRydWNrRmVlZCh0ZWNoSWRzOiBhbnksIG1ncklkOiBhbnkpIHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuXG4gICAgICB0aGlzLnNvY2tldCA9IGlvLmNvbm5lY3QodGhpcy5zb2NrZXRVUkwsXG4gICAgICAgIHtcbiAgICAgICAgICBzZWN1cmU6IHRydWUsXG4gICAgICAgICAgcmVjb25uZWN0aW9uOiB0cnVlLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5OiAxMDAwLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5TWF4OiA1MDAwLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkF0dGVtcHRzOiA5OTk5OVxuICAgICAgICB9KTtcblxuICAgICAgdGhpcy5zb2NrZXQuZW1pdCgnam9pbicsIHsgbWdySWQ6IG1ncklkLCBhdHR1SWRzOiB0ZWNoSWRzIH0pO1xuXG4gICAgICB0aGlzLnNvY2tldC5vbignbWVzc2FnZScsIChkYXRhKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoZGF0YSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuICAvL0dldCBSdWxlIGRlc2lnbmVkIGJhc2VkIG9uIHRlY2h0eXBlLlxuICBnZXRSdWxlcyhkaXNwYXRjaFR5cGUpIHtcbiAgICB2YXIgZ2V0UnVsZXNVcmwgPSB0aGlzLmhvc3QgKyBcIkZldGNoUnVsZVwiO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChnZXRSdWxlc1VybCwge1xuICAgICAgXCJkaXNwYXRjaFR5cGVcIjogZGlzcGF0Y2hUeXBlXG4gICAgfSk7XG4gIH1cblxuICBzdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgIC8vIHJldHVybiAgaWYgeW91IHdhbnQgdG8gcmVtb3ZlIHRoZSBjb21wbGV0ZSBzdG9yYWdlIHVzZSB0aGUgY2xlYXIoKSBtZXRob2QsIGxpa2UgbG9jYWxTdG9yYWdlLmNsZWFyKClcbiAgICAvLyBDaGVjayBpZiB0aGUgc2Vzc2lvblN0b3JhZ2Ugb2JqZWN0IGV4aXN0c1xuICAgaWYoc2Vzc2lvblN0b3JhZ2UpXG4gICAge1xuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KG9iamVjdFRvU3RvcmUpKTtcbiAgICB9XG4gIH1cblxuICBzdG9yZURhdGFJbkxvY2FsU3RvcmFnZShrZXksIG9iamVjdFRvU3RvcmUpXG4gIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9TdG9yZSkpO1xuICB9XG5cbiAgcmV0cmlldmVEYXRhRnJvbUxvY2FsU3RvcmFnZShrZXksIG9iamVjdFRvU3RvcmUpXG4gIHtcbiAgICAgIHZhciByZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgaWYocmVzdWx0IT1udWxsKVxuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKGtleSlcbiAge1xuICAgIGlmKHNlc3Npb25TdG9yYWdlKVxuICAgIHtcbiAgICAgIHZhciByZXN1bHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICBpZihyZXN1bHQhPW51bGwpXG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxufVxuIiwiZXhwb3J0IGNsYXNzIFRydWNrRGV0YWlscyB7XG4gICBwdWJsaWMgVHJ1Y2tJZDogc3RyaW5nO1xuICAgcHVibGljIERpc3RhbmNlOiBzdHJpbmc7ICBcbn1cblxuZXhwb3J0IGNsYXNzIFRydWNrRGlyZWN0aW9uRGV0YWlsc3tcbiAgICBwdWJsaWMgdGVjaElkOiBzdHJpbmc7XG4gICAgcHVibGljIHNvdXJjZUxhdDogc3RyaW5nO1xuICAgIHB1YmxpYyBzb3VyY2VMb25nOiBzdHJpbmc7XG4gICAgcHVibGljIGRlc3RMYXQ6IHN0cmluZztcbiAgICBwdWJsaWMgZGVzdExvbmc6IHN0cmluZztcbiAgICBwdWJsaWMgbmV4dFJvdXRlTGF0OiBzdHJpbmc7XG4gICAgcHVibGljIG5leHRSb3V0ZUxvbmc6IHN0cmluZztcbiAgfVxuICBcbiAgZXhwb3J0IGNsYXNzIFRpY2tldHtcbiAgICBwdWJsaWMgdGlja2V0TnVtYmVyOiBzdHJpbmc7XG4gICAgcHVibGljIGVudHJ5VHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBjcmVhdGVEYXRlOiBzdHJpbmc7XG4gICAgcHVibGljIGVxdWlwbWVudElEOiBzdHJpbmc7XG4gICAgcHVibGljIGNvbW1vbklEOiBzdHJpbmc7XG4gICAgcHVibGljIHBhcmVudElEOiBzdHJpbmc7XG4gICAgcHVibGljIGN1c3RBZmZlY3Rpbmc6IHN0cmluZztcbiAgICBwdWJsaWMgdGlja2V0U2V2ZXJpdHk6IHN0cmluZztcbiAgICBwdWJsaWMgYXNzaWduZWRUbzogc3RyaW5nO1xuICAgIHB1YmxpYyBzdWJtaXR0ZWRCeTogc3RyaW5nO1xuICAgIHB1YmxpYyBwcm9ibGVtU3ViY2F0ZWdvcnk6IHN0cmluZztcbiAgICBwdWJsaWMgcHJvYmxlbURldGFpbDogc3RyaW5nO1xuICAgIHB1YmxpYyBwcm9ibGVtQ2F0ZWdvcnk6IHN0cmluZztcbiAgICBwdWJsaWMgbGF0aXR1ZGU6IHN0cmluZztcbiAgICBwdWJsaWMgbG9uZ2l0dWRlOiBzdHJpbmc7XG4gICAgcHVibGljIHBsYW5uZWRSZXN0b3JhbFRpbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYWx0ZXJuYXRlU2l0ZUlEOiBzdHJpbmc7XG4gICAgcHVibGljIGxvY2F0aW9uUmFua2luZzogc3RyaW5nO1xuICAgIHB1YmxpYyBhc3NpZ25lZERlcGFydG1lbnQ6IHN0cmluZztcbiAgICBwdWJsaWMgcmVnaW9uOiBzdHJpbmc7XG4gICAgcHVibGljIG1hcmtldDogc3RyaW5nO1xuICAgIHB1YmxpYyBzaGlmdExvZzogc3RyaW5nO1xuICAgIHB1YmxpYyBlcXVpcG1lbnROYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHNob3J0RGVzY3JpcHRpb246IHN0cmluZztcbiAgICBwdWJsaWMgdGlja2V0U3RhdHVzOiBzdHJpbmc7XG4gICAgcHVibGljIGxvY2F0aW9uSUQ6IHN0cmluZztcbiAgICBwdWJsaWMgb3BzRGlzdHJpY3Q6IHN0cmluZztcbiAgICBwdWJsaWMgb3BzWm9uZTogc3RyaW5nO1xuICAgIHB1YmxpYyBwYXJlbnROYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xuICAgIHB1YmxpYyB3b3JrUmVxdWVzdElkOiBzdHJpbmc7XG4gIH0iLCJpbXBvcnQgeyBWaWV3Q29udGFpbmVyUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uSW5pdCwgVmlld0NoaWxkLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG4vLyBpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBSdHRhbWFwbGliU2VydmljZSB9IGZyb20gJy4vcnR0YW1hcGxpYi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTmd1aUF1dG9Db21wbGV0ZU1vZHVsZSB9IGZyb20gJ0BuZ3VpL2F1dG8tY29tcGxldGUvZGlzdCc7XHJcbi8vIGltcG9ydCB7IFBvcHVwIH0gZnJvbSAnbmcyLW9wZC1wb3B1cCc7XHJcbmltcG9ydCB7IFRydWNrRGV0YWlscywgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzLCBUaWNrZXQgfSBmcm9tICcuL21vZGVscy90cnVja2RldGFpbHMnO1xyXG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcclxuaW1wb3J0IHsgZmFpbCwgdGhyb3dzIH0gZnJvbSAnYXNzZXJ0JztcclxuLy8gaW1wb3J0IHsgVG9hc3QsIFRvYXN0c01hbmFnZXIgfSBmcm9tICduZzItdG9hc3RyL25nMi10b2FzdHInO1xyXG5pbXBvcnQgeyBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlL3NyYy9tZXRhZGF0YS9saWZlY3ljbGVfaG9va3MnO1xyXG5pbXBvcnQgeyBUcnlDYXRjaFN0bXQgfSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvb3V0cHV0L291dHB1dF9hc3QnO1xyXG5pbXBvcnQgeyBBbmd1bGFyTXVsdGlTZWxlY3RNb2R1bGUgfSBmcm9tICdhbmd1bGFyMi1tdWx0aXNlbGVjdC1kcm9wZG93bi9hbmd1bGFyMi1tdWx0aXNlbGVjdC1kcm9wZG93bic7XHJcbmltcG9ydCB7IHNldFRpbWVvdXQgfSBmcm9tICd0aW1lcnMnO1xyXG5pbXBvcnQgeyBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0ICogYXMgbW9tZW50dGltZXpvbmUgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcclxuaW1wb3J0IHsgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvY29yZSc7XHJcbmltcG9ydCB7IFBBUkFNRVRFUlMgfSBmcm9tICdAYW5ndWxhci9jb3JlL3NyYy91dGlsL2RlY29yYXRvcnMnO1xyXG5cclxuZGVjbGFyZSBjb25zdCBNaWNyb3NvZnQ6IGFueTtcclxuZGVjbGFyZSBjb25zdCBCaW5nO1xyXG5kZWNsYXJlIGNvbnN0IEdlb0pzb246IGFueTtcclxuZGVjbGFyZSB2YXIgalF1ZXJ5OiBhbnk7XHJcbmRlY2xhcmUgdmFyICQ6IGFueTtcclxuKHdpbmRvdyBhcyBhbnkpLmdsb2JhbCA9IHdpbmRvdztcclxuLy8gPGRpdiBpZD1cImxvYWRpbmdcIj5cclxuLy8gICAgIDxpbWcgaWQ9XCJsb2FkaW5nLWltYWdlXCIgc3JjPVwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoa0FHUUFhSUdBUC8vLzh6TXpKbVptV1ptWmpNek13QUFBUC8vL3dBQUFDSC9DMDVGVkZORFFWQkZNaTR3QXdFQUFBQWgrUVFGQUFBR0FDd0FBQUFBa0FHUUFRQUQvMmk2M1A0d3lrbXJ2VGpyemJ2L1lDaU9aR21lYUtxdWJPdStjQ3pQZEczZmVLN3ZmTy8vd0tCd1NDd2FqOGlrY3Nsc09wL1FxSFJLclZxdjJLeDJ5KzE2ditDd2VFd3VtOC9vdEhyTmJydmY4TGg4VHEvYjcvaThmcy92Ky8rQWdZS0RoSVdHaDRpSmlvdU1qWTZQa0VrQUFaUUNBZ09ZQkpxYUJaMmVud1dhQUpHa2FhQ25xS2tGbzZXdFpLcXdxYXl1dEYreHQ1OEJ0YnRkdUw2NnZNRll2cmpBd3NkVHhMZkd5TTFPeXJITXp0TkowTERTMU5sRTFxclkydDgvM0tuZTRPVTY0cWprNXVzMTZLZnE3UEV3N3FEdzh2Y3I5TG40L0RINm52WjJBQmdnWUZZL1NQODZCZFFob0JNQkFRc1BEa3BZSU9JTkFLQWVXcFRvaC8vaXhob0RVR25rdUFTQXdTQWVpUVNBTlpKa0VaT1VpcVFjUXVEV3c1TXVlY0NrRkFDbkQ0b0NoalQwZFRObmowazhlZnJrQVZRSWdKcktDQnJOZ1RScDBpRk5nNFRrTnVEajFCRTdyU1pkZWk1aFVDQXIwYlg4NnFLcVdLdENzdjZBNnU0aFd4WnUzMW9saTBOdWo2SC91dDQ5RVZidlc3NDIvQXFrKzYvb1lCRjVEWXRGM003c2o2MFVRMUYrVENHeTVNUGhMUGRJbTduQVdjNGRQSDkrRy9yZjZSMk1FeEpBblZyMTZzay9SZThnbmRrcmJRTzJiN1B1b2ZoaTdNQy9OUVFYanB1cDdoeUFNMjlPem1BNTg3M09YZTh1M2VrMTlRcldyeXZOcnMrN0Rjd1VDVXovdmlDOCtKNDdLQTdRd1hzbWV3enZoY2RQT0IvSFUrNy9zOTJYZ1h2aXJaY1BmOUJ4VjVHQUd1UjNXMW5JM1ZBZmdnd082T0JuQnFZZ0h3N29VWlJoaGNCZEtObUhKbXhvdzRUYWdXaWhpSWIxUlNFTi81V21ub3JLc2FnWGlTU1lTRU4wOXRGNEFZSGkzYUNqREJoeDE1K1BLOXFJWFdVUnp0QmhRcjRocVNSb05Bd0pBNHI2SElsa2tsTlNnbU1JVnJaMW5ENHpicmxCbDB2S0VHWUxQRDVuSmdaQVhsZmxpeThVS2VPYnFhRTVucHAwdXZEa1AxSGlHU2R6TTZRWEE1YjBhSWxualhyQzU0OXNNWXlwVDZDTEd0Q29sNDgyQmtPYktWYkt3YUMzZmNtQm9XSUNLS3FubHpycUFxa3QvRG1wcHgrQSt1QUxySzZBYUYyd2dwRHFxUmpVcW9LazlGQ2FhNGlYMGdvcEM1eG1PU3dJLzdKaXVPcXhLc1JZR3EvRE51c3NDNzZlNENvOTVpMjdnYldHVVV0QnRpWGNxcGE0eSs2S0xiUW9BT3VPc042MmwrcTZtcVpncmpnQnhodUN1aXFRQzVtNzZNQ3Jyd0xndHRndnV5VnM2NDZpQTN0UU1KVW8rS3VyZ21VMnpDeS9KMGo4QWNEaWRHdnhwL05HakxBSTkzSlQ4Y2U2WG9wdUE1bVpJRzF2S0lNVmNva1VtWkJzb2pHVGdIR09OZXVzNElJNVE3YXpDQzJUb0RBNkhnZk53ZEJnOWt3eXhTc0gvVERFUkR2TkxNZmNKQzJKd01kTUxWWUpSWWR3TTY1Uk5EUkExTFY0bldZSW1MVHQ5dHR3eDgzdzBqOXpmU0pkV3N1ajlsVlpIQzNPM0VnRUVCc0JkZ2ZEdEJRbGMxTjREQU9sSXBnYkpwVjArQk12RjJjRUFQOWpGd0M0R1ZXaHpjTGtUbVNPcitmSWNrdzRHM21SbnNMZWUwcGhaMm1MdHlBNE1XZXY0Wm5xaE0xY05zVkpCT0QzS1hsL0VSenVKTENPNlJRQ1lLMU03S3YvTGhMelNvVDZrcDdFd3lnNjdaZGZEOHZtd2d0WC9iNVRScDVGNC9wOHI2dnlzUVN2Ulp6bTUybGoreEtpajRyNjhhY0gvZlR2d2QrZ2lQcERKNzhuSi9NQitUSkRQeXMwUzN3Q2RGRC9CT0s4ZlFBQmN6ODduUmplaDVZQ0xYQTBEY3lYRDVMM3MwNXdEd3RUdTZBRWdDVENIOHh1R1NiOFg4ZkFzTGNTUGlBOExneEM1ajQ0QTk5MThCUzE4d0xyRU9pZmE4VmhnQm1KWVhVYWFMa3JHTzk0VkFtWEhVNzRpUUxpUlh1bTZzSVJXeWVoNXVDQmlScThBUWYvYjVnK0xreHhiVEFhU3g4Z0NMVDZjZEVtOTlQQkY4RllRMVg1QVhNNHNPRVpmZUZFSmF5UmFrUVNZaUNBT0VlYjZERjNxZkxod0tEWXgxQ2s4U0tCRE5VZjE4SEVRc2JDTHV0THBQZlNwY0l6Rm1RTGQyVE9JcWZCUjBlcUlvZVlsR1QrM2tSR1R6N3lrRG9SWmY0MnVZc3RtbElWa0F4REpndWtva2ErRWhXZ0ZFTmhWQ205KzhqeGxvNURKZjU0cVVucWRCS1lBQlFtRW1aNUhSN2VwWlRJQkI0Y2Rrbk1FVDNHbHRIMElDdVBVczFpVGdXYjJYeGNIWmpaVEpjY001b1N4QU0xdTRuSGUwQXptNTY0SkIvSTZjMTd1QktlMnR3ak8zdkp5RXB5TVoyQ29LY2l6VUhJUHNheUVBSmR6VGFuNmMrZnlUTVJDYjBST3hKMy84WmNMaUtpYlB4R1EyV2pUTlR0VTR6eG9LaUM2b2pRajNiVUVFU1V6MEpseWM2VjB1RjFjeFFuTCtqWmo0S3E1YVRxNUtWTHg3bFJPbjVqalR0ZDRnMHRTbzExaG84aktTVUtUdlhacUtEZVFhUzRBR2c4OXBhVHBLcmlvZmd3NmlqTjJWUE5PZlVPRDV1S1RUOGhWWkpZNjZ0NnFPUkJwNkpWYTM0RnFxWkI2eDhHSlZjOU5GQ21xQ0ZRWGZWUXNyTCtKanljeVJ4SjJTcEl0bFRPRTBRVmtHMW9NeUc4MGlneWUvVURYZnpxSTdkRTFnOXB3ZXFpa1BJZHpjTHFza29McldoSFM5clNtdmEwcUUydGFsZkwydGE2OXJXd2phMXNaMHZiMnRyMnRyak5yVzUzeTl2ZSt2YTN3QTJ1Y0lkTDNPSWF0eEVZTFphWmt0dlVHditZVkhlVmZhNXkyeWhkTkpHeXVucHlMbmE3ZE4zdFRrbTczclZSZDhQTEl2Q1M5MExqUGErRHpLdmU5NlMzdlVHaUFYelh1OXo1NW9lOTlwM1ZscGpiS1B6bTl6UHYvUytBNVN0Zy9kUzN3UHFWQVlJVEhOMEZENWk2RHRaTGdDUE1Od2hUR0M0SHZ2RFhDS3hoRE8rM3d4dTJNSWduckdIL2xqakRJSTRKaDFPODFITHdON3NyVGpHSkwyeGlHcU5ZeGpFZThZMTFMT0lPejVqQ05RYnlqbjJjWXlKL21NVXE3dkdKajR6a0lFZjR4MDh1OHBLUjlHTHJYc1FrV002eWxyZk01U3l6RThwTjdiS1l4NXpsNDVyNXpHaE9zNXJYek9ZMnUvbk5jSTZ6bk9kTTV6cmIrYzU0enJPZTk4em5QdnY1ejRBT3RLQUhUZWhDL3hiL3RJYkdTNUwvaW1oSWhLWFJla0FLcEJrQjJkOWtGRVNxbWJRZGJsZlo0WEhHTnM1a0QyQWZzeHhOejdPZVgzR1BxY0hxM3J2UU1xLzVXWFViNkVwcS9yMVZnYWxXRW1GdGJjNmo5dnA5c2lZRFZYK3RwR0N6VUdWbWJlNVVBMm5zTVREYkhFQ1Z5QmREall4Wk5oc01xcncyRk1qWkQyWnFXM0xkL0hZa3d6MVRrK0xqbytKMlNuTFRiY0Ruc3B1YjFYMzNGTEFyYjBSdXQ5N2I5aTYrR1ZkbEttcWozMGcwQk1EOW5ZMkJCNXlwNU4wMzVkcXI4QkswRmQxWk5YaFBHaDRDZzFPYkhSSjNJNnZQUy9GMnE3ZmpjUHA0cmtVK0I0c1A1dUhvQmprRUpLNXlLVEo4MWlULzY4dlRZUEw3Wkp6aUZtLzVHVmcrQnA0LzF1YzYvK1E0bUNFZTlIdDdpdVhwZnZIRmh4eHZsN3RiWDBBSG9VbDF2b2Viajd1YUpWdzZ4bVB1Y1dLNjhPRHpqT0hBdFczdEhoSThweG9QSTcxREtVazl0dk9sSHI1eTA5bU9iRFhlaU9vamZMdmFpVTUzNmdta3NKQURkU3IzeWU0V3dodndhckJPQXJIZVBWOFBmcEsyZy96aFJTbnZnbW5keVhwbnFaeCtnSElLaG9GRkM1VlZ3enQvNlNRbXN1ZTREZ0xvZFhraGx4NVI0ZXdiZ3VVTHYzclorMTNZbWd4cWw3NGRRaUtRbnArb1YrZ3dIVjhGdFYydTJHaEFQT2RCQjI0MG9SVmNOSmZvRVk1SUJlb3ZNL1ZvcVBUMG1XOUg3aSsvbklrSGFlRHFYbjN2QzFDdkhvM3M2N3QrKys0TGY5Wk1NSC96Mis5K2cwa2J1bFVJNVAvQ003OTE4bGVjekFCWVpoVW5mMDVSZXNzMlhTVERYVUtEZ0UzUU9jbm1mK0R6WFF1b2JOdDJlWXdFZ1JHb2F6S0RnYlMxZnVXaWdDTkFnS3NsZ2hkZ1pSdElnYlZsZlNaZ2dpY0lZN1pGZ2lVSWdpM29mTGFsZ2lzb2d6T0lnN0RsZ1NmQWdqckRnYTFsUExqamd6bElmSzVsZ3oyb2d5R0lmNndGZ3hsQWhFV0lmSytGaEVrb2dTaEFoYXJsaEUrb2hEK0lncW9saExMRGhWSG9lVitvaFZ0b2hmWUNoS1FGaG1HSWhsZG9odDZDaFNnQWhTN0RoS01GaDJlb2daK2pobEpqaDNNb2hnN25oMEdEaDNrb1hpNUFpSnZGaDFXb2g0cW1pQmFEaVBnQmlIWG9oWDFJaVh2b2hpdkFnNVhZWHdvbWlaUElpVXJEaG9maWlUZi9hSWtOSTRlWHlJaHRJWWp4QW9uN2c0a3RJSW9mSTR1akNJdU5hSXJlNG9xdnFJcDF3b3FmNVlncVFJZHRTSC82NG91MlFvcHZ5SUJ4Q0l6QmlJekpTSXpWWW96SGFJdXJ5SXhVWm8xcFNJM1ZDSTFIaDQzWnlJdWRpSXR2SW8ycGFJZzJnSXBNVjN0eDVJelI0bzBDUW83bFdGNW1CNHFWUW9zbndvN3RLSTRxWW8vM0tJVTVvSXU3eG8yWWgycjJKcEQ3Nkk3VFNJYi9pSkMwd1RvK3NIdVA1NEpEUjVBTDZZOTJwNDhWOG5zUHhnTVFPUnJLbUk0VVdaRUtlWkVHMldEWTU1RVd1UnNNYVV3bnlaRkdTSkkwbUNzYW1YWXFtWkovNTN4NEIzZUVvbm92V1pNMkdZM3ZWMEUvQ1pPdGh6SVBOd1FkS1pRS2xKTmpwRVJDdHBDVTN4ZHJvNlY5VDltVEVTbDVVMmxaS21HVkx1azlUQ2x3aytCVVVQbEFBOFZhWHpXV1Nua1lYMWxMWEhtVlNyR1dOSUtXWkRrV2NPa2pjaG1WRm1ob2Q4bDVlWmxvZTVsb1R2Q1hnQmwvYlRtWVN5Q1lodGs3aFptWTR6ZVVqQms5aS9tWVJZQ1lrcm1WamxtWlJrQ1ptTW1UbDdtWlNCbVpubWxDb0JtYUtEbVNwUGtTV2xhVXA3bWFyTm1hcnZtYXNCbWJzam1idEZtYnRubWJ1Sm1idXJtYnZObWJ2dm1id0JtY3dqbWN4Rm1jR0pBQUFDSDVCQVVBQUFZQUxMVUFGd0RGQUw4QUFBUC9hTEFiL2pCS1E2dTlPT3ZOdS85Z0tJNmpaSjRUcWE1czY3NHRLcDl3YmQ5NGZzMDhCT2pBb0hCbzZSbC94S1J5U1RMMmtNeW9kR3B3OHFEVXJGWm5uV0czNERDcksvdUt6K2dPR1dWT3U5L1Z0YWtOcjRmbGM3c2VqWmZROTRCTWZSRi9nWVpEZ3o2SGk0S0pEb1dNa1RXT2o1S1dRSlFCa0plY0paU2JuYUVlbWFDaXBobWtwNm9pcWF1dWFwK3ZzaHF0czdZVXRiZXp1YnF2dkwycnY4Q253c09peGNhZHlNbVh5OHlTenMrTTBkS0gxTldCMTloN21RSGJvZDNmeXBuaW5PSGxsdWZva2VycmkrM3VodkR4Z1BQMGV2YjNkZm42Yi96OWFmNEJQQ053NEIxeUJ1MFVUS2hsSVVNcURoOUtpU2l4RWFXS2JpaGlUS0p4L3lNaWhCNFBYZ3dwMGhISmtvbE9ndW1vRWdmTGxqWmV3b1FoYzZhTG1qYkhnTXk1QkNmUEpqdC9FdkVwTkFUUm9oK09Jb1UxY3FrUXBVNXBCWTNxY2lyVnExaXphdDNLdGF2WHIyRERpaDFMdHF6WnMyalRxbDNMdHEzYnQzRGp5cDFMdDY3ZHUzano2dDNMdDYvZnY0QURDeDVNdUxEaHc0Z1RLMTdNdUxIang1QWpTNTVNdWJMbHk1Z3phOTdNdWJQbno2QkRpeDVOdXJUcDA2aFRxMTdOdXJYcjE3Qmp5NTV0U1VDQjI3aHo2OTdOdTdmdjM4Qi9Dd2hwTzdqeDQ4aVQ2eDVBWExuejU5QnZNL2RZUExyMTY3Mm5iNnlPdlR0MkFzMjlpN2NPbnZyNDg4L0xiMGZQSHJsNmpOemJ5K2Y5dm1MOCtmaHhoOC9QLy9iKy9tSDUvUWZnZkFJTzJGNkJCcUtIWUlMakxjaWdkdzQraUYyRUVscEhZWVhRWFlpaGN2VkpkTitHNUdrSTRuRWRQdlRoaU9tSmlDSndKVEowNG9ySmFRY2ZqTmZKYUY5dkJPU280NDQ4RWpEQWowQUdLZVNQQWhScDVKRklDbUNGQlFrQUFDSDVCQVVBQUFZQUxPZ0FKZ0NBQUFrQkFBUC9hTHJjL3BBRkVLdTlPT3ZOSVFnZ1FIVmthWjRtcUU0ajZyNHd1YzVpYk4rNDhzMTBtLzlBRFc4NENScVBqeDJSNTBNNmM4dG84MGxGUmEvRnFyYWt4QkpyMjNERzY1Mkt6NHN1V1lwdUw5WnJzNXNLaDgvRjZ2cFNmai9xeVgxYmVYOU1nVnFFV0laVmc0Z3FpbFNNalZtUFNKSkxsRTZSalh5WU5wWkVuVWVhaUp5aExxT0lwa0dmUTZwQXFIK2xyaW1zTTdNNXNIcXl0eDIxdHJ5ZXZpcTd3Qm01ZXNVeHdvN0pMOGR3eE0wV3l5RFNMdFNUMWlUUGR0cTB5OUhlRGR4azRlSVMxT2N5MU9icTVJRHFITmp0NSs5ZThmTHArRUxzKzhiWS9zYjBDMmpCWGlLQzB3WWloSUF0d01JSUJxODhqREJ2WWhLQUZoMVV6TWdnLzJJVWpoMDNnalFnRXFUSFN5TVZsT1I0RWxUS2xrUG9pV3VZMGdETVFpbFhacno1SzZkQ2t4aHI4Z3hSTTJTdG9oby9JYjI0YWFtSFZFNHA2b3BhZ1J2VkM3bGtDajE0VmFETHJob0dhYVdxQnF5SkhXUE5walhMdHEzYnQzRGp5cDFMdDY3ZHUzano2dDNMdDYvZnY0QURDeDVNdUxEaHc0Z1RLMTdNdUxIang1QWpTNTVNdWJMbHk1Z3phOTdNdWJQbno2QkRpeDVOdXJUcDA2aFRxMTdOdXJYcjE3Qmp5NTVOdTdidDI3aHo2OTdOdTdmdjM4Q0RDeDlPdkxqeDQ4aVRLMS9PdkhuT3dBRUtFQkR3bDBDQjZ3UWM3bzErdmZ1QXZkYTdpNmQrVjRENDg5SzEwMFhQZm9CNnVBUFl5LzhPbDd0OCtlVGJocjh2UHp0YjgvLzhCZWdlV1BzRnlGOStUZ0Zvb0lIVE9XWGZnZ3Y2VjFSOEVGWllBSDBqUFdnaGhBaGFWT0NHRUVvNGtZSWdiaWdpUWgrV2FDR0dBVkdvNG9zZHFxUGhpeVdlZUU2S05KWTQ0RGt6NXZnaWk5Ymc2S09LRFZwRDRwQkQyZ2lNQUVJaXFTS1F4UnpwWkk0eEF1UGlsRGtXMlV3QVRXSnBvWks4Y09tbGoxQXVPYWFQVmZKeTVaa2dnbmxMQUd1eXVlSjd4WWdwcDQ3YU1IbG5pV25lSXVXZUROSlpUSnlBQ2lob21JUVdlbCtmczlpcEtJT011dkxubyt5NWVVdWlsSjVYcHBXWkduaG9tRjFTYWlrdmVuWjZYcVJtbW9yZHA5Wmd1aWVxVzdwNkpnRUxPUW9vck42VWV1ZW1BVTA2SmE3eHlFb2pyN1dHV2lPckU5bUtabFF5dnBxSUxFakNHZ2lzUlhEKzJKYXlFVDY3bEs0TFRsdFVzK0lSYTVhc283SlY3WHg1WWJ0alhpU1dPeGVGM3NLRmF3SUFJZmtFQlFBQUJnQXM2QUJoQUg4QUNnRUFBLzlvdXR6K01NcEpxNFhnNnMyNzcwQVFmR1Jwbms4b0JobnF2akMyem0xczMrU3NzM2p2VTZyZDdFY3NHb0pDbW5FWlF5WjF6S2pKK2RUVnBOaExkY3ZMZWlWVTd1NUxib1RGdTJzWmUwWUwxZXVsZXc2UC85cnpaTjF1dytlZmZENStmMDk3Z1NXRGhGV0hNSXFPSW9hTUdvbVBpNUlmbEpWVmtaY3ltcCtjblF1Wm4xeWhvcVdwSXFKZ3FxbW5oNlN1bTZ3cHM2QzFEN2VmdVE2eXUybTlETC9BU3NJS3hNVXJ4OGpLanJDQnpvclFmTW5LMUhiV3lzeEgwb1RZY2Q1LzRHdmF3T1JsNXNEYzZydm9aTzJ6NzJ2aWFQTng4YnpjdXZWNis1NzlWdHlURkhEWlB3b0JCNHJLWitxZ0Jta0tlekVVNHRERHVZb2VKbmJCYVBIL0ZVY1RwVDZlTUJkUjVET1JMMzZWUkxrZ3owcVd6Y1M4aERscXkweWFEQ3poeEJIbTVzNEdWbjRTVWVGVGFBcWpTSk1xWGNxMHFkT25VS05LblVxMXF0V3JXTE5xM2NxMXE5ZXZZTU9LSFV1MnJObXphTk9xWGN1MnJkdTNjT1BLblV1M3J0MjdlUFBxM2N1M3I5Ky9nQU1MSGt5NHNPSERpQk1yWHN5NHNlUEhrQ05Mbmt5NXN1WExtRE5yM3N5NXMrZlBvRU9MSGsyNnRPblRxRk9yWHMyNnRldlhzR1BMdGlDZ3JRQUNCVWFrRFlDN1FBRUNhUWY0SGw2Z2Rsa0J4SWtESDNzN2VmSUJZWGs3bjY2N3EvRHAwNkZ6Ulk2OWUvV3IwcnQzWDI0MXdIWHg0bzFUUFk4ZVBWWHU3ZU5yZnhvK3Z2M3ZTK0hidDArZWFZRDkvd0RtOXBSK0FZclhIMU85RllpZWV2NHBHQjlVN0RtWUhYMFNvb2VmVWdSV3FCeFVDV3FZSElOTC9lZWhjd2N1MWVHSXZvR29sSWdvRW5kaFVobU9PRjlUSjZMNElsSXN0dmdiaHpvT3AySlNPYlpZb2xJUm9qZ2pnajM2ZHFOUk1YbzRaRkkxanJpa1VFR2krQ1JTUlk3NEk1UkpGZ0JWa3hvZWFXS1hVLzVVNVloWEdwV2xoMlgrMUdXYVFvRlo0WlpJUmNrbWhVbUtTU1NaVUwzNVpaZDBHbVZuaFhDYTJhV2VTYTJwWVpzNG5la2hva2pKS1NHak9BMHFZYUU3T2FwaG9FSXBXaUZVbWxZSUtaTjhQbVdwZzVnMldxcFRweXFZS2syaFNzanBUNTVLR0ZXckJZNUs1YW8wSnZrcVRMRTZPT3RPdGJwNmE1TEQ0aVJwZ0RjRUpMc1RydkpSYXFpR3pWcFY3SGdDU010bHJ0cGlHT0FBenJMS1g3aDRHa2h1VklvMjIrMVUwNmxybG43dW9vVmJ2THVkeTB3Q0FDSDVCQVVBQUFZQUxMVUF1Z0RGQU1BQUFBUC9hTHJjL2pES1NhdTFJT2pOdS85Z0tJNGljSjFvcXE0WTZiNXcvTEYwYmQ5TUp1OThyK0hBb0RDaTh4bVBvYUZ5aVNzaW4wK21kSXB5UXE4OXFuWUxzV0svTUs1WTdBV2JSZU0wdFh4dWQ5VHdKZHROajl1RGMzcjd6cmZsOVdaOWdpdC9nRitEaUNlRmhsZUpqaFNMakZHUGxBK1Jra2VWbWptWWVwdWZsNTFabjVxaG9qdWtwYWQ3cVpTbXEyR3RqNit3THJLenRXQzNqclM1YUx1SXZiNGd3TUhEamNXQ3dzZHZ5WDNMUEFEUzA5VFYxdGZVenRyYjNOM2UzK0RoNHVQazVlYm42T25xNit6dDd1L3c4Zkx6OVBYMjkvajUrdnY4L2Y3L0FBTUtIRWl3b01HRENCTXFYTWl3b2NPSEVDTktuRWl4b3NXTEdETnEzTWl4LzZQSGp5QkRpaHhKc3FUSmt5aFRxbHpKc3FYTGx6Qmp5cHhKczZiTm16aHo2dHpKczZmUG4wQ0RDaDFLdEtqUm8waVRLbDNLdEtuVHAxQ2pTcDFLdGFyVnE0OEVhTjNLdGF2WHJ6d0xpQjFMdHF6WnMySFBxbDA3TmkzYnQyWGR3cDByZCs3YnVuYlg0czJMZGlmZnR3VDIvaDBiMk85Z3RZVjFIa1lzK0hEaW5JdlBQc1laMmV6a201WExYcmFabWV6bW1wMEpOeDc4bVdab3NhVm5uaTZRV3VicTFqRmZqLzRMRzZac3c2RnJ2MXc5WURiZjNyZzdBMWQ4ZWpqazRyN3pHcWVNUEhqbTVaaWJFdzhObmJQMDQ5U1QyNjBPK2pyejdNNHJDOUErZDN6NHlPYW5kMDZQZlQxNXVPeS91eisvT0g3MDBQYXQ0My8vTm4vMy9WMzBIZWFmYWFjTnFGcUIvTEVWUUlKckxSamdZQTZxbDFtRTdVM0lvRm9VeW1maGczOWxlRjluSHVvSDRvVm5oZmpmaUJ6eVpTS0JvYTE0WUlza211V2lhNmZOR0Z1Tk1jYVZJMWs5cmViVEJsb05JQ1FCUkJJSm1HNHZKUUFBSWZrRUJRQUFCZ0FzWUFEdUFBZ0JlQUFBQS85b3V0eitNTXBKcTcwNDY2MEEvMkFvam1ScG5oa1FCQjdxdm5Bc3orWnF0M1N1NzN5dnFUYWJiMGdzR2wzQkpPN0liRHFmd0dSdytheGFyekNwbG9YdGVyK2FyUmhNTHB1allpblZ6RzRiMC9DMWUwNlBvZUZiZVgzUEIrSC9lbjJDZ3hKM2YyS0JoSXFEaG9kcGlZdVJjNDZVSzVLWGZJMlZqNWlkYlp1Z2tKNmpScHFnZUtLa3FqdW5yUUdyc0VXdXJxbXh0aVNtczRlMXQ3MGJ1c0M4dnNNVHVjQ1V4TWtmeDh6Q3lzbkd6SlhPejc3UjBzalYyaEhYMklEYjRBN2V4OVRocTkzamNlYm02T2xqNitIdDdtcnc0Zk8wOWR2eTkxUDUydnY4TFBtckJwQmZ1WUdYQ3Q0N2lEQlN3RkFOb1QyY0ZsSGlSRWNNS3pLNmlGSC80ekNPamp4K0JJbEt4Z0FDQWtSYVVaZ3VJNFVBQldJU2VLVVNDa2t0TGlrUWlNbHpRTTBxTE1uRmdNbXphTXFmVG02dXlEbGhaOUdpTTVFMkNkcEtob0NuV0FzTW9DbTFGRWVtRXJLSzlkbjFDTldRTVFhSVhYdTBiSkd6NnJLc25SdlZyYXg1SnVmcTNXcVhDRng2Y3ZVS2J0dTN4OStsTXB3SzFvdXk4SkMvWUNGY1hVeTVybU1ld1JKVDNxejFzdUZaVmpsdkp1dVpSOEhJRDRpS1hzeTF0R21LYVZjdkp1ejY4eUVacW1XdkpWRDd5TGNZaW5XTGJkMzdNUnpjd3VrV241cEhjL0xoeTUzY1FmMWc4bk9zcEtNM3VUSGp1bGp0VjZnL1VPdjlLVzN3cEhLWEw4QWJmU3p5NjJNU2QrOUpmZm4yOUZVRlh6OC8veVhyLy9GbDUxOG4rM21IMzRDZEFMamVlUWhHRWg5UEJ6WW9DWHp4OVNmaElQWjVKK0NGaWhUb25ZVWM4cEhoZFF5RzJJZUh6MFZvb2lBS2xsZmlpbldnbUp5S01PNUJJWDgxWXZoZ1RCdm1TTWVONWZrb3lJalB2U2lrR1RJS1IrT1JiQkNaSEloTWtwR2tia3RHU1VhTEgxcEp4NDZkYWVrR2tONTU2WWFUd2hrcDVoVmdwbmhtazF4Q3VXWVZVOHJXNDV0WFlIbWRtM1EyRWVkcWMrYjVoSjB6K3ZrRm1icVpLYWdSYVFaNktCYUV5b2Jub2tQc0tWcWZrTXJTWnFWV1NNcVpvWmp5QUtpU25WWnhhYWhPQ0tEcFlsV1NPa1FBaWE3MnFLcWVuam9XckZldytoeXRqSjVVS0s1ZDJDcGFxcnd5WVNwbnJ3WkxoSytDQVd0c0V5UEQ2bFhzc3JJMG14V2wwRmFCTEZUVnRpSEFqWnhtVzBXenlucUxoYW5QaW90Q0FnQWgrUVFGQUFBR0FDd25BTzRBQWdGOUFBQUQvMmk2M1A0d3lqYkl2RGpyemJ2L1lDaU9rVkNjQXFtdWJPdStzQmdRNTJuRmVLN3ZmQjRNdFdDcVJ5d2FqMFZUY0JsQU9wL1FhR2EyckE2azJLeVcrS3Q2QzgydGVFd0dBYi9lVzNuTmJpc0VOUFIzNks3Ym9WUTVXbjN2KzNWbmVuSlhmNFdHS25DQ2ltR0hqWTRZZVlxQ2ZJK1ZsZ2FCa291WG5JMUttcHFVbmFOdGthQ2FkS1NxWkptbm9LdXdXNSt1cm9TeHQwaW10SzZNdUw0N3JidXVvci9GTExQQ3dyM0d6REp4eWRERXpkTWF3ZERDcWRUYUU4algxOHZiNFF1NjN0QzI0dWhkNWVVRTRPamEzZXU3Qk5udjhNL3l5ZlgyMCtUNXRlNzRNYlAyRDFRN2dlRVNGY1NHY0p1L2haTE9OV3hHRUtLZ0FRRW40b3BuY2Y5U1JvMnhIbmFVc3c4a3Jvb2p2MGcwK1F0bHlpVUhXVGJqK0RJSVBablVSTllzaWZNWHpaUXJlekxUQ1RHbTBHMC9DOTQ4S282b3ZLQk1zUUE0a3JRY3hxaGpBQVFJTUxXSTAyUkdzV2JSdW5VclZZZzh4VG9weTdackVYeFcxVzRoeTdiczJYVmg1VUtoVzVmdEVaZVM4dXAxd3Jkdld5TlZCYVVkek1XdzQ0OHhBS09CeXJoSTRjZUh2Y0pWSkxpeVpjeWc3d1plN0RuSFpkQjkzZmI0V29CMGFSeW9ZME9HVVpYeWF4Mm5aUnYrdTJmMjdSZTVkUnRXemNPZjY5OHVnZ3ZmalhpSmJlUTRsQyt2UzV6SG1hdlFrVWlmYnRmSUROL1pZWE5IWFQzOHJlM2p6UThkajFwOU1mVGN5N3RYQlgvNi9GL3NRY3UvMzZuK2N2Ny91T1NIMlg0QVd1S2ZjQVFXK01pQnVpa0lpNENQSmVqZ0lRektOcUVxRURvbTRZVi9WQmdiaDZOazZCaUluWWlZR29tWGVOZ2VpcGFZU0IyTGxhZ1lHb3lQdUpnWmpZM1kyQjJPRk9wb0ZvK0grTWdWa0liSWlCbVJoZ2k1SVpKakNNbGtoejR1K2FRV1NrNTVoNUdQV1hsSGxWclc0V1NYYm1BNUhKaHVmRW5tR21JeWQyWVpYSzZabFpsdWlwSG1pM0UyNldPZGIrb29KWjZyM2NtbkZuUFc5U2VnVVE2YUJaeUdQaEZvV1hzbUdnT2lqaDZ4NkZhTlJ1b0NwSlo2NVdlbWtoYks2UkdZZm9xYnA2STJwbU9wM3VtSktoR0xWcnFxRENhNittb0lZc282SzZ6c0FXRHJyYmhPdHl1dklqRDRLN0FqSUVoc0ZPZ05lNndLR1BvcHV5eXp3em43ckFxRjZUcXRHSXhLZXkwTDFvYVFBQUFoK1FRRkFBQUdBQ3dYQUxvQXVnREFBQUFEL3lpMTNQNHd5a25sTURqcnpidi9ZQ2lPcERaVWFLcXV6bFcrY0N6UDJjbmVlTzdTZk8vRHRweHdPTm45anNna2djaHNNb3pKcURTMmRGcUYwS2wyNjZsZXY2c3NkOHoxZ3M4VU1Ya2ROYVBmRHpWNzdvUGJJWEs2WG5idlAvZUFkWDU5ZVlHR0lJT0VoNHN2aVhlRmpKRUdqbmFRa291VWNKYVhocGx2bTV5QW5taWdvWHFqWjZXbWM2aGdxcXRyYnExRXI3Qmpzck5ZdHB5NHVUaTF1MXE5dml6QXdWTER4Q3JHeDBsQnlqck5qTS9RTjh6U1NRSGEyOXpkQVFMZzRlTGpBZ1BtNStqcDVnVHM3ZTd2dmRmWTgvVDE5dmY0K2ZyNy9QMysvd0FEQ2h4SXNLREJnd2dUS2x6SXNLSERoeEFqU3B4SXNhTEZpeGd6YXR6SXNmK2p4NDhnUTRvY1NiS2t5Wk1vVTZwY3liS2x5NWN3WThxY1NiT216WnM0YytyY3liT256NTlBZ3dvZFNyU28wYU5Ja3lwZHlyU3AwNmRRbzBxZFNyV3ExYXRZczJyZHlyV3IxNjlndzRvZFM3YXMyYk5vMDZwZHk3YXQyN2R3NHpJQ1FMZXUzYnQ0ODBiMXhyY3YzNzErQS9jRkxMandOc0tHQ3lOT0hIZ3g0OEZRSHl1T0xMa3g1Y3FRbjJMMjYzaXp0czZlUVc4V2pabDBaZE9TVVQ5V3paaDFZdGVHWVUvVzdObWJiTUczTGRPdXpTMDM1OHU4UHdNUDdqdXowK0M5aC9NdS9sZDViZWEyblllV1BwcDZhZXVuc2FmV3ZwcDdZZ0RRdVlIM2Juajg3dURtanlNUGtMN3BldmJodDdWbituNyswdnJ4dGRsWGlwOTg0ZjFKU2ZWM0htOEFJaVdnZXNnVmVOU0I3cTJub0ZFTTB1ZGdmdkQ1SjlpRFJVVjQzNFFXQm9ZaFVScnl4K0dBdFgwNFZJZ0Jqb2dnZWhTYUtCU0tCcTRuMVhzenlpalZYYUVsQUFBaCtRUUZBQUFHQUN3bkFHWUFkUUFBQVFBRC8yaTZ2Qkl0eWttcnZUaHJGa2daV3lpT1pLa01SVm9JWnV1K202Q3FCQVRmK052TjgyRG53Q0FHeGVPQmhNaWtvOGdrc0pSUTNJN1ovRVd2SkJsMWU4UjZOZFB0OXZrdFU0aGlzZFBNWm1qVDhGcWJqWWJEdS9QcjI4NG41NVVlZklJRmNuOUllNE44UG9aQVlZbURlSXd1aUkrRGZwSWtqcFdKaFpnamxKdUppNTRibXFHVmw2UVZvS2VQYTZvVnBxMmJuYkFOckxPYmtiWUdBWFc1czZtMnNzQ1Z0YndHdU1XY1ZyeSt5N203dzRIUXA4S3d5dFYyeDd5LzJxTE4wOStoMHRqam9kZXEzdWZiNGJERTdHTGxxdG54VE9tazYvWmI3dS9VKzJPUVNhZ1hqNERBTXdEdkhhUUE3NXpCaGF2KzJlc0hrWUUrYmZNcWNwRDRUZitqQmdFY2wrSHpHSUdnTVpJaG5rR2ppSkpoU0ZvdHN3QmpHVFBXUlVVMVRUUk1rM01TcXA0dmJoWjVDTlRGVGhVMGk4YTRvelRIemFSTlU0Yk1HTFVFSXFKVmdhQVptVlVuQWF4ZHc0b2RTN2FzMmJObzA2cGR5N2F0MjdkdzQ4cWRTN2V1M2J0NDgrcmR5N2V2MzcrQUF3c2VUTGl3NGNPSUV5dGV6TGl4NDhlUUkwdWVUTG15NWN1WU0ydmV6TG16NTgrZ1E0c2VUYnEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQWd3c2ZUcnk0OGVPNEF3UUFBQmlBY3VYTSt6NmZ6dGY1OU9mUjhWN2ZucDJ1OWUzWHU4Y0ZUeDZxMmZMbHhhLzlqaDY4ZXJUdDQ3OG55ejQrK2ZsaTdldkhYN1crZnZUZi9DbjEzNERteGVRZmdlV0pkU0NDN3VYSG9Id0tQaGpmV0JLMkYyQk9DMWFvSElVYTNoZGhoK0J4Q09KMUlvNkkzWWNtUGxkaWloZldsS0dHSzVyWW9vRXBVdWRnalFXMjlLS0VNOGFFNDRZMzF0Z2pTanRLR09PSVE1SlVKSU5Ka3ZSamprVCsyS1JIVHg0SjRwUVZMY21nbFIyT3BTV0JXRlpVSllvc2Nna2ptVEthV2FHYVJxS0pKSnNQZWlrbG5GdTZlU1dkQ01xSm81NUM0a2tnbjJVR21TS2dhUXI2cHAxZCt2bGZtRm51V2RhWDlqR3E1SWhxUVVvZVc1YUc1MWFtUUw1bHFhUktRVnJYa3FEMnQyTmVHVmJIblYvc0JlWmNxUllrQUFBaCtRUUZBQUFHQUN3bkFDb0FkUUFBQVFBRC8yaTYzUDR3eWtsTkNEWHJ6YnRYQWtGOFpHbWVJRkdzQXVxKzhDSU1hejNHZUw0RmRPMFB1cUN3RVFqNWpnWE1jSWt6SW84M3B0VEVlMXFWMHl6SGFVVkd0V0JKdGR0dGhjL0VnWXBNUnJzdFBUWVorQVp6NVdSc2ZUbkd5Nzk3UVhkK2JIcUJPUUtFaElDSE9HdUtjbWFOT1FHUWZvYVRMNCtXWFhTWk1aV2NoWjg0Y2FKUGpLUlVwMlNTcWlpSnJLaXZNSnV5Tlo2MEpyRzNSNWk2SHJhOXVjQWZvYjArdjhVYnBzaXB5eHJIeUN6UUpNM0kxU1RUUDlrZXZOdkszUkxDdDgvaUVkL1Q0ZWNQNUxMbTdBN1MwNjd4RXRlOTloWHp5TVQ2RC9odXJmdG53QjByZUFUVElhdEhzSUhCVXdqLzhldkZzT0dDaDZjRzZwdDR5LytmUlFVQlpXblV0ODNHeHdjS0taNTBnSkZUUkgwcE82NTBXSExGeUhnY1pYbjhHSkxWVFhZNUQ4NWswUE5VeFk4MVZ3eVZrWFNueFphY2ZwNExDbkdwQXFpV3BJcWpLdXFsdmFLaWpqYmtLc3FxZ1pnNnpXSlY1TFFoV3BkYTJhMWxJM1lsV1RadGg0THRRaUF1d2J0UTZwbzFzTmVINE1FS0NPVkZ6SlJOWDhZYURCSTRESmxCek1XVldSNFo0TGZ5c2NlWlA5Q2dITHEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQWd3c2ZUcnk0OGVQSWt5dGZ6cnk1OCtmUW8wdWZUcjI2OWV2WXMydmZ6cjI3OSsvZ3c0c2ZUNzY4K2ZQbzA2dGZ6NzY5Ky9mdzQ4dWZUNysrL2Z2NDgrdmZ6NysvLy8vL0FBWW80SUFFRmlqYkJia0JjRUVBQU5pbTRJSUl6dllnaEJjMEdOdUVGRmI0R29ZWkx0Z2FoeDB1YUdGcUlaYlltVVVnbWlpaWFTbXFDR0ZwTHNaWVdZc3hVamlpVlRUV21PRmdPdlo0NDBrNTl0amhURUVLMmVHUEVobXBKSXBLTm5uaUpFVTZXU0tTMlVocEpUdFJXbWtpbGJwa3FhV0tWWDc1SlplZmVDbW1pMlFlWXVhWkx0S3lKcHRidWdubm1ITE9hV1dhZTd4cFo0WjQxckhublhYK3FXU2ZiK2dwYUlTdkhOb2tvVzRZS2lpamFEajZKNlJvS0xxa0xwWUtTV21qbWNhNGFhR2R4cG1OcEYrZVE2cVVuMElacW9iMm5DcGtRNjU2eXVTaHFRSVQ2NUZMN1duV3JheWFkV2F0cG1vSkxFNVNzcmdvYW1zT0M2dU9HTXArRkNWc0tqWkxaSWpTTGdYaWJSQldPNWlDMmhLVUFBQWgrUVFGQUFBR0FDd1hBQmNBdWdDL0FBQUQvMmk2M1A0d3lrbXJ2VGk3d0lVWUlDR0tSV21laGFpdGJPdStNSVhPZEYzRWVLN3ZzTzNYdktCd09Qd1pUd0dpY3NuRUhKL0pwblE2ZlI2ajFLeVdaelZpdCtBd3EvdjdpczlvQ2RsblRydmZhMXY3VFJmSGEvTzZQbnVuNWZlQVRIMHpmNEdHUW9Nb2hZZU1PWWxJalpGRmp5V0xrcGNhbEpXWW5ER2FCWmFkb2hHZm9hT25ES1dvcXhXcXJLOFFud0t3dEEyeXRiZ0d0N20wdTd5dnZyK3J3Y0tueE1XaXg4aWN5c3VYemM2UjBOR00wOVNHMXRlQTJkcDYzTjEwbndQZ3o1cmo1TkxtNk9tVTUrdUg0dS9WNnZMWTlQWGI5L2plK3Z2aC9mN2N4QXRZWnlCQk9BQVAya21vRUl6QmhtYytFWUNZUmlKRk5CWXZMcVEwVWY5am1Jd2V0NEFNeVVkVFI1SWxPYUxVTW5KbGs1WXVsOENNU1dRbVRVUW1iNzdNcVZNbXo1NDFmd0xGcVhMb3BLSkdnM3k2a1ZUcHA2Wk9OVUhsOG5TcWpxVldyMWJONm1rcjF4Y2d3b29kUzdhc3U2OW8wNnBkeTdhdDI3ZHc0OHFkUzdldTNidDQ4K3JkeTdldjM3K0FBd3NlVExpdzRjT0lFeXRlekxpeDQ4ZVFJMHVlVExteTVjdVlNMnZlekxtejU4K2dRNHNlVGJxMDZkT29VNnRlemJxMTY5ZXdZOHVlVGJ1MjdkdTRjK3ZlemJ1Mzc5L0FOUURnUUx5NDhlUElreXRmenB3NXhlYlFvMHVmanZ3NTlldllzM093cnIyN2QrWGN2NHNYSDM2OCtlemx6NnVYbm42OSsrWHQzOHMzSG4rKy9mcjI1ZVBQNzM0L2YvVkUvdjFuWG9BQ2tnZFJnZndSaUdCM0NpNkkzb0VPNmdkaGhQMU5TQ0dBRmw0NFlJWWFHdGhRaHhoK0NPS0dJbzdvb1VJbWp1Y1JBQ3kyNk9LTE1NYm80b0lVSlFBQUlma0VCUUFBQmdBc0p3QW1BQUVCZkFBQUEvOW91dHorTU1wSnE3MDQ2ODI3R29JbmptUnBubWpLQ1VWQkNJRXF6M1J0MzFXcnZ6SHUvOENna0RIUUdYbkRwSExKdkFTTVVCZXNTYTFhZ1lSbzlIWHRlcjhpbGxiTEJadlBhRVoyUEFhbDMzQnFrVTBmOU9MNHZPMUo3eVAxZ0lFbGEzMStJWUtJaVJkaWhZMTJpcENSRFlTTmhXV1NtSUp6bFpVRW1aOTZmSnlWaDZDbWFaU2pkSjZucldhaXFuMTNyclJXcWJGYUE3VzdWWXk0Ykx6QlM3Qy9XcVhDeUQrYnhWdkp6ajdFekVheno5VXF0OUl1MXRzcXZ0azYxTnppSGRIZnV1UG9Ic3ZmTGVudUcrWFp4Ky8wRTlqU3JQWDZFZDdzNGZzQURiQ0RjaTZnUVFQci9CMDBHRTlhd1lYNzdqSExCMUZmdjIvektyNGJlRVQvNDc2RTMvNTVGTmVRMmNPUjZTUXlFNG5TMmtWNUxkK3AvRVV4cGppUTJWamFURmF5V00yZDFtYiswZ2swMkV1SFJjVUp4WldVRzA1cEdac0s2MGxUYWxDTzRLdytvNHJycDFaZVMyTVIvV3JxcVVteXlMakc4b3JXVlZoVlVkdWVVcXVLclZ4VGIwZU52UnZwNkZtK3RPaXEyZ3M0a2RsaWNRdExFc3pKcnVKSWVUa2xmcXpJcjAvS3BoaHpJb3c1eitGZkp6dEQwbHlKY3drQUFFVFhpRXdLQ0lBQXNGWExzRndWQ096YnFXV2Z3SnIxeCt2YnVIV1RvTjNWTmZEakFYSUw3eUNBdFN6YnlKRXZEek13ZEkzZjBZOHJuNzdoY3lQajJiTnY1NDRoZ0hNZGsxVmdEeCtkL0Fybmp0V3puei9ldlFYdlVFeVRtTTgvdWYwTS93SGdwNDF2L2ZWWDMzOFNtTmVJZmlNVTZDQ0NHRmhtSFEzck9VZ2ZoQmZnRko4S0ZuWjRJSVlPS0FoRmVpbFUyS0dCSUZJZzRvQSttSGhpZ1NsU0lBYURJcmo0SW9veFNrQWlDamJlV09DSE9RYlJvNDgvQnFuRWtFUVdhYVFRU0NhcDVKSTROT21rZzBCQ2VZS1VVejVvSllWWmR1bmZsak5nNlNWL1ZZSlo0NWhUbG1rbUIyS2l5ZDZhOHJsSnBKcHdhdENtbk1qUldXZDVlUHFvNTU0VjNOa25jSUNhSU9pZ1h4YmFJS0luL3Fsb0JJY2krdWdJa2ZicDZLUVBNT29ocGg1VWl1YWxuRDdnYVplaGxxQnBlS0NXQ3NHb1JLcDY1YW5CdVhvQ3JEVEtPZ0dyTU5vYUo1NnA2bW9CcnRuNXl1V253bDQzWnJFM0FOc3JzaXdaNE1wc2k2MCtTMkNqMGdaeFlyVk1Vb250RUZKdXE4U0YzaWJSWTdoTW1FZ3VGY0F0ZXk2UHNUR2JBQUE3XCIgYWx0PVwiTG9hZGluZy4uLlwiIC8+XHJcbi8vICAgPC9kaXY+XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2F0dC1ydHRhbWFwbGliJyxcclxuICB0ZW1wbGF0ZTogYCAgXHJcbiAgPGRpdiBpZD0nbXlNYXAnIGNsYXNzPSdtYXBjbGFzcycgI21hcEVsZW1lbnQ+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuICBzdHlsZXM6IFtgXHJcbiAgLm1hcGNsYXNze1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gNGVtIC0gNzBweCkgIWltcG9ydGFudDsgICAgXHJcbiAgICBkaXNwbGF5OmJsb2NrO1xyXG4gIH0sXHJcbiAgLmluZnlNYXBwb3B1cHtcclxuXHRcdG1hcmdpbjphdXRvICFpbXBvcnRhbnQ7XHJcbiAgICB3aWR0aDozMDBweCAhaW1wb3J0YW50O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBsaWdodGdyYXk7IFxyXG4gIH0sXHJcbiAgLnBvcE1vZGFsQ29udGFpbmVye1xyXG4gICAgcGFkZGluZzoxNXB4O1xyXG4gIH1cclxuICAucG9wTW9kYWxIZWFkZXJ7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB3aWR0aDoxMDAlO1xyXG4gIH1cclxuICAucG9wTW9kYWxIZWFkZXIgYXtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIHBhZGRpbmc6NXB4IDEwcHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZjMTA3O1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjZmZjMTA3O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6MTBweDtcclxuICAgIHRvcDo1cHg7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEhlYWRlciAuZmF7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6LTEwcHg7XHJcbiAgICByaWdodDotMTBweDtcclxuICBcclxuICB9XHJcbiAgLnBvcE1vZGFsQm9keSBsYWJlbHtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcclxuICB9XHJcbiAgLnBvcE1vZGFsQm9keSBzcGFue1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcclxuICAgIHdvcmQtYnJlYWs6w4LCoGJyZWFrLXdvcmQ7XHJcbiAgfVxyXG4gIC5tZXRlckNhbCBzdHJvbmd7XHJcbiAgICBmb250LXdlaWdodDogYm9sZGVyO1xyXG4gICAgZm9udC1zaXplOiAyM3B4O1xyXG4gIH1cclxuICAubWV0ZXJDYWwgc3BhbntcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gIH1cclxuICAucG9wTW9kYWxGb290ZXIgLmNvbHtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICB9XHJcbiAgLnBvcE1vZGFsRm9vdGVyIC5mYXtcclxuICAgIHBhZGRpbmc6MCA1cHg7XHJcbiAgfVxyXG4gIGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBSdHRhbWFwbGliQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgY29ubmVjdGlvbjtcclxuICBtYXA6IGFueTtcclxuICBjb250ZXh0TWVudTogYW55O1xyXG4gIHRlY2huaWNpYW5QaG9uZTogc3RyaW5nO1xyXG4gIHRlY2huaWNpYW5FbWFpbDogc3RyaW5nO1xyXG4gIHRlY2huaWNpYW5OYW1lOiBzdHJpbmc7XHJcbiAgdHJhdmFsRHVyYXRpb247XHJcbiAgdHJ1Y2tJdGVtcyA9IFtdO1xyXG5cclxuICBkaXJlY3Rpb25zTWFuYWdlcjtcclxuICB0cmFmZmljTWFuYWdlcjogYW55O1xyXG5cclxuICB0cnVja0xpc3QgPSBbXTtcclxuICB0cnVja1dhdGNoTGlzdDogVHJ1Y2tEZXRhaWxzW107XHJcbiAgYnVzeTogYW55O1xyXG4gIG1hcHZpZXcgPSAncm9hZCc7XHJcbiAgbG9hZGluZyA9IGZhbHNlO1xyXG4gIEBWaWV3Q2hpbGQoJ21hcEVsZW1lbnQnKSBzb21lSW5wdXQ6IEVsZW1lbnRSZWY7XHJcbiAgbXlNYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlNYXAnKTtcclxuICByZWFkeSA9IGZhbHNlO1xyXG4gIGFuaW1hdGVkTGF5ZXI7XHJcbiAgLy8gQFZpZXdDaGlsZCgnc21zcG9wdXAnKSBzbXNwb3B1cDogUG9wdXA7XHJcbiAgLy8gQFZpZXdDaGlsZCgnZW1haWxwb3B1cCcpIGVtYWlscG9wdXA6IFBvcHVwO1xyXG4gIEBWaWV3Q2hpbGQoJ2luZm8nKSBpbmZvVGVtcGxhdGU6IEVsZW1lbnRSZWY7XHJcbiAgc29ja2V0OiBhbnkgPSBudWxsO1xyXG4gIHNvY2tldFVSTDogc3RyaW5nO1xyXG4gIHJlc3VsdHMgPSBbXHJcbiAgXTtcclxuICBwdWJsaWMgdXNlclJvbGU6IGFueTtcclxuICBsYXN0Wm9vbUxldmVsID0gMTA7XHJcbiAgbGFzdExvY2F0aW9uOiBhbnk7XHJcbiAgcmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMgPSBbXTtcclxuICByZXBvcnRpbmdUZWNobmljaWFucyA9IFtdO1xyXG4gIGlzVHJhZmZpY0VuYWJsZWQgPSAwO1xyXG4gIGxvZ2dlZFVzZXJJZCA9ICcnO1xyXG4gIG1hbmFnZXJVc2VySWQgPSAnJztcclxuICBjb29raWVBVFRVSUQgPSAnJztcclxuICBmZWV0OiBudW1iZXIgPSAwLjAwMDE4OTM5NDtcclxuICBJc0FyZWFNYW5hZ2VyID0gZmFsc2U7XHJcbiAgSXNWUCA9IGZhbHNlO1xyXG4gIGZpZWxkTWFuYWdlcnMgPSBbXTtcclxuICAvLyBXZWF0aGVyIHRpbGUgdXJsIGZyb20gSW93YSBFbnZpcm9ubWVudGFsIE1lc29uZXQgKElFTSk6IGh0dHA6Ly9tZXNvbmV0LmFncm9uLmlhc3RhdGUuZWR1L29nYy9cclxuICB1cmxUZW1wbGF0ZSA9ICdodHRwOi8vbWVzb25ldC5hZ3Jvbi5pYXN0YXRlLmVkdS9jYWNoZS90aWxlLnB5LzEuMC4wL25leHJhZC1uMHEte3RpbWVzdGFtcH0ve3pvb219L3t4fS97eX0ucG5nJztcclxuXHJcbiAgLy8gVGhlIHRpbWUgc3RhbXBzIHZhbHVlcyBmb3IgdGhlIElFTSBzZXJ2aWNlIGZvciB0aGUgbGFzdCA1MCBtaW51dGVzIGJyb2tlbiB1cCBpbnRvIDUgbWludXRlIGluY3JlbWVudHMuXHJcbiAgdGltZXN0YW1wcyA9IFsnOTAwOTEzLW01MG0nLCAnOTAwOTEzLW00NW0nLCAnOTAwOTEzLW00MG0nLCAnOTAwOTEzLW0zNW0nLCAnOTAwOTEzLW0zMG0nLCAnOTAwOTEzLW0yNW0nLCAnOTAwOTEzLW0yMG0nLCAnOTAwOTEzLW0xNW0nLCAnOTAwOTEzLW0xMG0nLCAnOTAwOTEzLW0wNW0nLCAnOTAwOTEzJ107XHJcblxyXG4gIHRlY2hUeXBlOiBhbnk7XHJcblxyXG4gIHRocmVzaG9sZFZhbHVlID0gMDtcclxuXHJcbiAgYW5pbWF0aW9uVHJ1Y2tMaXN0ID0gW107XHJcblxyXG4gIGRyb3Bkb3duU2V0dGluZ3MgPSB7fTtcclxuICBzZWxlY3RlZEZpZWxkTWdyID0gW107XHJcbiAgbWFuYWdlcklkcyA9ICcnO1xyXG5cclxuICByYWRpb3VzVmFsdWUgPSAnJztcclxuXHJcbiAgZm91bmRUcnVjayA9IGZhbHNlO1xyXG5cclxuICBsb2dnZWRJblVzZXJUaW1lWm9uZSA9ICdDU1QnO1xyXG4gIGNsaWNrZWRMYXQ7IGFueTtcclxuICBjbGlja2VkTG9uZzogYW55O1xyXG4gIGRhdGFMYXllcjogYW55O1xyXG4gIHBhdGhMYXllcjogYW55O1xyXG4gIGluZm9Cb3hMYXllcjogYW55O1xyXG4gIGluZm9ib3g6IGFueTtcclxuICBpc01hcExvYWRlZCA9IHRydWU7XHJcbiAgV29ya0Zsb3dBZG1pbiA9IGZhbHNlO1xyXG4gIFN5c3RlbUFkbWluID0gZmFsc2U7XHJcbiAgUnVsZUFkbWluID0gZmFsc2U7XHJcbiAgUmVndWxhclVzZXIgPSBmYWxzZTtcclxuICBSZXBvcnRpbmcgPSBmYWxzZTtcclxuICBOb3RpZmljYXRpb25BZG1pbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHRpY2tldExpc3Q6IGFueSA9IFtdO1xyXG4gIEBJbnB1dCgpIGxvZ2dlZEluVXNlcjogc3RyaW5nO1xyXG4gIEBPdXRwdXQoKSB0aWNrZXRDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgdGlja2V0RGF0YTogVGlja2V0W10gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBtYXBTZXJ2aWNlOiBSdHRhbWFwbGliU2VydmljZSxcclxuICAgIC8vcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgXHJcbiAgICAvL3B1YmxpYyB0b2FzdHI6IFRvYXN0c01hbmFnZXIsIFxyXG4gICAgdlJlZjogVmlld0NvbnRhaW5lclJlZlxyXG4gICAgKSB7XHJcbiAgICAvL3RoaXMudG9hc3RyLnNldFJvb3RWaWV3Q29udGFpbmVyUmVmKHZSZWYpO1xyXG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcclxuICAgIHRoaXMuY29va2llQVRUVUlEID0gXCJrcjUyMjZcIjsvL3RoaXMudXRpbHMuZ2V0Q29va2llVXNlcklkKCk7XHJcbiAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zID0gW107XHJcbiAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnB1c2godGhpcy5jb29raWVBVFRVSUQpO1xyXG4gICAgdGhpcy50cmF2YWxEdXJhdGlvbiA9IDUwMDA7XHJcbiAgICAvLyAvLyB0byBsb2FkIGFscmVhZHkgYWRkcmVkIHdhdGNoIGxpc3RcclxuICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja1dhdGNoTGlzdCcpICE9IG51bGwpIHtcclxuICAgICAgdGhpcy50cnVja0xpc3QgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgdGhpcy5sb2dnZWRVc2VySWQgPSB0aGlzLm1hbmFnZXJVc2VySWQgPSBcImtyNTIyNlwiOy8vdGhpcy51dGlscy5nZXRDb29raWVVc2VySWQoKTtcclxuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgLy90aGlzLmNoZWNrVXNlckxldmVsKGZhbHNlKTtcclxuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9ICdjb21wbGV0ZScpICB7XHJcbiAgICAgIGRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xyXG4gICAgICAgICAgdGhpcy5tYXB2aWV3ID0gJ3JvYWQnO1xyXG4gICAgICAgICAgdGhpcy5sb2FkTWFwVmlldygncm9hZCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLm5nT25Jbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xyXG4gICAgICAgIHRoaXMubWFwdmlldyA9ICdyb2FkJztcclxuICAgICAgICB0aGlzLmxvYWRNYXBWaWV3KCdyb2FkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgICAgIFxyXG4gIH1cclxuXHJcbiAgY2hlY2tVc2VyTGV2ZWwoSXNTaG93VHJ1Y2spIHtcclxuICAgIHRoaXMuZmllbGRNYW5hZ2VycyA9IFtdO1xyXG4gICAgLy8gQXNzaWduIGxvZ2dlZCBpbiB1c2VyXHJcbiAgICB2YXIgbWdyID0geyBpZDogdGhpcy5tYW5hZ2VyVXNlcklkLCBpdGVtTmFtZTogdGhpcy5tYW5hZ2VyVXNlcklkIH07XHJcbiAgICB0aGlzLmZpZWxkTWFuYWdlcnMucHVzaChtZ3IpO1xyXG5cclxuICAgIC8vIENvbW1lbnQgYmVsb3cgbGluZSB3aGVuIHlvdSBnaXZlIGZvciBwcm9kdWN0aW9uIGJ1aWxkIDkwMDhcclxuICAgIHRoaXMuSXNWUCA9IHRydWU7XHJcblxyXG4gICAgLy8gQ2hlY2sgaXMgbG9nZ2VkIGluIHVzZXIgaXMgYSBmaWVsZCBtYW5hZ2VyIGFyZWEgbWFuYWdlci92cFxyXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckluZm8odGhpcy5tYW5hZ2VyVXNlcklkKS50aGVuKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSkge1xyXG4gICAgICAgIGxldCBtYW5hZ2VycyA9ICdmJztcclxuICAgICAgICBsZXQgYW1hbmFnZXJzID0gJ2UnO1xyXG4gICAgICAgIGxldCB2cCA9ICdhLGIsYyxkJztcclxuXHJcbiAgICAgICAgaWYgKGRhdGEubGV2ZWwuaW5kZXhPZihtYW5hZ2VycykgPiAtMSkge1xyXG4gICAgICAgICAgLy8gdGhpcy5Jc1ZQID0gSXNTaG93VHJ1Y2s7XHJcbiAgICAgICAgICB0aGlzLklzQXJlYU1hbmFnZXIgPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMubWFuYWdlcklkcyA9IHRoaXMuZmllbGRNYW5hZ2Vycy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1bJ2lkJ107XHJcbiAgICAgICAgICB9KS50b1N0cmluZygpO1xyXG4gICAgICAgICAgLy8gdGhpcy5nZXRUZWNoRGV0YWlsc0Zvck1hbmFnZXJzKCk7XHJcbiAgICAgICAgICAvLyB0aGlzLkxvYWRUcnVja3ModGhpcy5tYXAsIG51bGwsIG51bGwsIG51bGwsIGZhbHNlKTtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyAvLyQoJyNsb2FkaW5nJykuaGlkZSgpIFxyXG4gICAgICAgIH0sIDMwMDApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZXZlbC5pbmRleE9mKGFtYW5hZ2VycykgPiAtMSkge1xyXG4gICAgICAgICAgdGhpcy5maWVsZE1hbmFnZXJzID0gW107XHJcbiAgICAgICAgICB2YXIgYXJlYU1nciA9IHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMubWFuYWdlclVzZXJJZCxcclxuICAgICAgICAgICAgaXRlbU5hbWU6IGRhdGEubmFtZSArICcgKCcgKyB0aGlzLm1hbmFnZXJVc2VySWQgKyAnKSdcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMudW5zaGlmdChhcmVhTWdyKTtcclxuICAgICAgICAgIHRoaXMuZ2V0TGlzdG9mRmllbGRNYW5hZ2VycygpO1xyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRhdGEubGV2ZWwuaW5kZXhPZih2cCkgPiAtMSkge1xyXG4gICAgICAgICAgdGhpcy5Jc1ZQID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy90aGlzLnRvYXN0ci53YXJuaW5nKCdOb3QgdmFsaWQgRmllbGQvQXJlYSBNYW5hZ2VyIScsICdNYW5hZ2VyJywgeyBzaG93Q2xvc2VCdXR0b246IHRydWUgfSlcclxuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIud2FybmluZygnUGxlYXNlIGVudGVyIHZhbGlkIEZpZWxkL0FyZWEgTWFuYWdlciBhdHR1aWQhJywgJ01hbmFnZXInLCB7IHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSB9KVxyXG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBjb25uZWN0aW5nIHdlYiBwaG9uZSEnLCAnRXJyb3InKVxyXG4gICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRMaXN0b2ZGaWVsZE1hbmFnZXJzKCkge1xyXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckRhdGEodGhpcy5tYW5hZ2VyVXNlcklkKS50aGVuKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGRhdGEuVGVjaG5pY2lhbkRldGFpbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZvciAodmFyIHRlY2ggaW4gZGF0YS5UZWNobmljaWFuRGV0YWlscykge1xyXG4gICAgICAgICAgdmFyIG1nciA9IHtcclxuICAgICAgICAgICAgaWQ6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkLFxyXG4gICAgICAgICAgICBpdGVtTmFtZTogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5uYW1lICsgJyAoJyArIGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkICsgJyknXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgdGhpcy5maWVsZE1hbmFnZXJzLnB1c2gobWdyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuSXNWUCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5Jc1ZQID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLklzQXJlYU1hbmFnZXIgPSBmYWxzZTtcclxuICAgICAgICAvL3RoaXMudG9hc3RyLndhcm5pbmcoJ0RvIG5vdCBoYXZlIGFueSBkaXJlY3QgcmVwb3J0cyEnLCAnTWFuYWdlcicpO1xyXG4gICAgICB9XHJcbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgY29ubmVjdGluZyB3ZWIgcGhvbmUhJywgJ0Vycm9yJyk7XHJcbiAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFRlY2hEZXRhaWxzRm9yTWFuYWdlcnMoKSB7XHJcbiAgICBpZiAodGhpcy5tYW5hZ2VySWRzICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckRhdGEodGhpcy5tYW5hZ2VySWRzKS50aGVuKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAoZGF0YS5UZWNobmljaWFuRGV0YWlscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciB0ZWNoIGluIGRhdGEuVGVjaG5pY2lhbkRldGFpbHMpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFucy5wdXNoKGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgYXR0dWlkOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmF0dHVpZCxcclxuICAgICAgICAgICAgICBuYW1lOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLm5hbWUsXHJcbiAgICAgICAgICAgICAgZW1haWw6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uZW1haWwsXHJcbiAgICAgICAgICAgICAgcGhvbmU6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0ucGhvbmVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgICBcclxuICBsb2FkTWFwVmlldyh0eXBlOiBTdHJpbmcpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMudHJ1Y2tJdGVtcyA9IFtdO1xyXG4gICAgdmFyIGxvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKDQwLjA1ODMsIC03NC40MDU3KTtcclxuXHJcbiAgICBpZiAodGhpcy5sYXN0TG9jYXRpb24pIHtcclxuICAgICAgbG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odGhpcy5sYXN0TG9jYXRpb24ubGF0aXR1ZGUsIHRoaXMubGFzdExvY2F0aW9uLmxvbmdpdHVkZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm1hcCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215TWFwJyksIHtcclxuICAgICAgY3JlZGVudGlhbHM6ICdBbnhwUy0zMmtZdkJ6alE1cGJaY25EejE3b0tCYTFCcTJIUndIQU5vTnBIczNaMjVORHZxYmhjcUpaeURvWU1qJyxcclxuICAgICAgY2VudGVyOiBsb2NhdGlvbixcclxuICAgICAgbWFwVHlwZUlkOiB0eXBlID09ICdzYXRlbGxpdGUnID8gTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLmFlcmlhbCA6IE1pY3Jvc29mdC5NYXBzLk1hcFR5cGVJZC5yb2FkLFxyXG4gICAgICB6b29tOiAxMixcclxuICAgICAgbGl0ZU1vZGU6IHRydWUsXHJcbiAgICAgIC8vbmF2aWdhdGlvbkJhck9yaWVudGF0aW9uOiBNaWNyb3NvZnQuTWFwcy5OYXZpZ2F0aW9uQmFyT3JpZW50YXRpb24uaG9yaXpvbnRhbCxcclxuICAgICAgZW5hYmxlQ2xpY2thYmxlTG9nbzogZmFsc2UsXHJcbiAgICAgIHNob3dMb2dvOiBmYWxzZSxcclxuICAgICAgc2hvd1Rlcm1zTGluazogZmFsc2UsXHJcbiAgICAgIHNob3dNYXBUeXBlU2VsZWN0b3I6IGZhbHNlLFxyXG4gICAgICBzaG93VHJhZmZpY0J1dHRvbjogdHJ1ZSxcclxuICAgICAgZW5hYmxlU2VhcmNoTG9nbzogZmFsc2UsXHJcbiAgICAgIHNob3dDb3B5cmlnaHQ6IGZhbHNlXHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgLy9Mb2FkIHRoZSBBbmltYXRpb24gTW9kdWxlXHJcbiAgICAvL01pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoXCJBbmltYXRpb25Nb2R1bGVcIik7XHJcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdBbmltYXRpb25Nb2R1bGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL1N0b3JlIHNvbWUgbWV0YWRhdGEgd2l0aCB0aGUgcHVzaHBpblxyXG4gICAgdGhpcy5pbmZvYm94ID0gbmV3IE1pY3Jvc29mdC5NYXBzLkluZm9ib3godGhpcy5tYXAuZ2V0Q2VudGVyKCksIHtcclxuICAgICAgdmlzaWJsZTogZmFsc2VcclxuICAgIH0pO1xyXG4gICAgdGhpcy5pbmZvYm94LnNldE1hcCh0aGlzLm1hcCk7XHJcblxyXG5cclxuICAgIC8vIENyZWF0ZSBhIGxheWVyIGZvciByZW5kZXJpbmcgdGhlIHBhdGguXHJcbiAgICB0aGlzLnBhdGhMYXllciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5MYXllcigpO1xyXG4gICAgdGhpcy5tYXAubGF5ZXJzLmluc2VydCh0aGlzLnBhdGhMYXllcik7XHJcblxyXG4gICAgLy8gTG9hZCB0aGUgU3BhdGlhbCBNYXRoIG1vZHVsZS5cclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoJywgZnVuY3Rpb24gKCkgeyB9KTtcclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMnLCBmdW5jdGlvbiAoKSB7IH0pO1xyXG5cclxuICAgIC8vIENyZWF0ZSBhIGxheWVyIHRvIGxvYWQgcHVzaHBpbnMgdG8uXHJcbiAgICB0aGlzLmRhdGFMYXllciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5FbnRpdHlDb2xsZWN0aW9uKCk7XHJcblxyXG4gICAgLy8gQWRkIGEgcmlnaHQgY2xpY2sgZXZlbnQgdG8gdGhlIG1hcFxyXG4gICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5tYXAsICdyaWdodGNsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgY29uc3QgeDEgPSBlLmxvY2F0aW9uO1xyXG4gICAgICB0aGF0LmNsaWNrZWRMYXQgPSB4MS5sYXRpdHVkZTtcclxuICAgICAgdGhhdC5jbGlja2VkTG9uZyA9IHgxLmxvbmdpdHVkZTtcclxuICAgICAgdGhhdC5yYWRpb3VzVmFsdWUgPSAnJztcclxuICAgICAgalF1ZXJ5KCcjbXlSYWRpdXNNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL2xvYWQgdGlja2V0IGRldGFpbHNcclxuICAgIHRoaXMuYWRkVGlja2V0RGF0YSh0aGlzLm1hcCwgdGhpcy5kaXJlY3Rpb25zTWFuYWdlcik7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIExvYWRUcnVja3MobWFwcywgbHQsIGxnLCByZCwgaXNUcnVja1NlYXJjaCkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLnRydWNrSXRlbXMgPSBbXTtcclxuXHJcbiAgICBpZiAoIWlzVHJ1Y2tTZWFyY2gpIHtcclxuXHJcbiAgICAgIHRoaXMubWFwU2VydmljZS5nZXRNYXBQdXNoUGluRGF0YSh0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmICghalF1ZXJ5LmlzRW1wdHlPYmplY3QoZGF0YSkgJiYgZGF0YS50ZWNoRGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICB2YXIgdGVjaERhdGEgPSBkYXRhLnRlY2hEYXRhO1xyXG4gICAgICAgICAgdmFyIGRpckRldGFpbHMgPSBbXTtcclxuICAgICAgICAgIHRlY2hEYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ubG9uZyA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBpdGVtLmxvbmcgPSBpdGVtLmxvbmdnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnRlY2hJRCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICB2YXIgZGlyRGV0YWlsOiBUcnVja0RpcmVjdGlvbkRldGFpbHMgPSBuZXcgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzKCk7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnRlY2hJZCA9IGl0ZW0udGVjaElEO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMYXQgPSBpdGVtLmxhdDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTG9uZyA9IGl0ZW0ubG9uZztcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExhdCA9IGl0ZW0ud3JMYXQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMb25nID0gaXRlbS53ckxvbmc7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlscy5wdXNoKGRpckRldGFpbCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHZhciByb3V0ZU1hcFVybHMgPSBbXTtcclxuICAgICAgICAgIHJvdXRlTWFwVXJscyA9IHRoaXMubWFwU2VydmljZS5HZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlscyk7XHJcblxyXG4gICAgICAgICAgZm9ya0pvaW4ocm91dGVNYXBVcmxzKS5zdWJzY3JpYmUocmVzdWx0cyA9PiB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSByZXN1bHRzLmxlbmd0aCAtIDE7IGorKykge1xyXG4gICAgICAgICAgICAgIGxldCByb3V0ZURhdGEgPSByZXN1bHRzW2pdIGFzIGFueTtcclxuICAgICAgICAgICAgICBsZXQgcm91dGVkYXRhSnNvbiA9IHJvdXRlRGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgICAgaWYgKHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMgIT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgJiYgcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxhdCA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1swXVxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMb25nID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzFdXHJcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxhdCA9IG5leHRTb3VyY2VMYXQ7XHJcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxvbmcgPSBuZXh0U291cmNlTG9uZztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBsaXN0T2ZQaW5zID0gbWFwcy5lbnRpdGllcztcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mUGlucy5nZXRMZW5ndGgoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHRlY2hJZCA9IGxpc3RPZlBpbnMuZ2V0KGkpLm1ldGFkYXRhLkFUVFVJRDtcclxuICAgICAgICAgICAgICB2YXIgdHJ1Y2tDb2xvciA9IGxpc3RPZlBpbnMuZ2V0KGkpLm1ldGFkYXRhLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgdmFyIGN1clB1c2hQaW4gPSBsaXN0T2ZQaW5zLmdldChpKTtcclxuICAgICAgICAgICAgICB2YXIgY3VyckRpckRldGFpbCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICBjdXJyRGlyRGV0YWlsID0gZGlyRGV0YWlscy5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50ZWNoSWQgPT09IHRlY2hJZCkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgdmFyIG5leHRMb2NhdGlvbjtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGN1cnJEaXJEZXRhaWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbmV4dExvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTGF0LCBjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxvbmcpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYgKG5leHRMb2NhdGlvbiAhPSBudWxsICYmIG5leHRMb2NhdGlvbiAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwaW5Mb2NhdGlvbiA9IGxpc3RPZlBpbnMuZ2V0KGkpLmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dENvb3JkID0gdGhhdC5DYWxjdWxhdGVOZXh0Q29vcmQocGluTG9jYXRpb24sIG5leHRMb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhwaW5Mb2NhdGlvbiwgbmV4dENvb3JkKTtcclxuICAgICAgICAgICAgICAgIHZhciB0cnVja1VybCA9IHRoaXMuZ2V0VHJ1Y2tVcmwodHJ1Y2tDb2xvcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4oY3VyUHVzaFBpbiwgdHJ1Y2tVcmwsIGJlYXJpbmcsIGZ1bmN0aW9uICgpIHsgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5tYXBTZXJ2aWNlLmdldFRydWNrRmVlZCh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLCB0aGlzLm1hbmFnZXJJZHMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnNvbWUoeCA9PiB4LnRvTG93ZXJDYXNlKCkgPT0gZGF0YS50ZWNoSUQudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIGZldGNoaW5nIHRydWNrcyBmcm9tIEthZmthIENvbnN1bWVyLiBFcnJvcnMtPiAnICsgZXJyLkVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ05vIHRydWNrIGZvdW5kIScsICdNYW5hZ2VyJyk7XHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBmZXRjaGluZyBkYXRhIGZyb20gQVBJIScsICdFcnJvcicpO1xyXG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIGNvbnN0IG10cnMgPSBNYXRoLnJvdW5kKHRoYXQuZ2V0TWV0ZXJzKHJkKSk7XHJcbiAgICAgIHRoaXMubWFwU2VydmljZS5maW5kVHJ1Y2tOZWFyQnkobHQsIGxnLCBtdHJzLCB0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmICghalF1ZXJ5LmlzRW1wdHlPYmplY3QoZGF0YSkgJiYgZGF0YS50ZWNoRGF0YS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgY29uc3QgdGVjaERhdGEgPSBkYXRhLnRlY2hEYXRhO1xyXG4gICAgICAgICAgbGV0IGRpckRldGFpbHMgPSBbXTtcclxuICAgICAgICAgIHRlY2hEYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ubG9uZyA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBpdGVtLmxvbmcgPSBpdGVtLmxvbmdnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgoaXRlbS50ZWNoSUQgIT0gdW5kZWZpbmVkKSAmJiAoZGlyRGV0YWlscy5zb21lKHggPT4geC50ZWNoSWQgPT0gaXRlbS50ZWNoSUQpID09IGZhbHNlKSkge1xyXG4gICAgICAgICAgICAgIHZhciBkaXJEZXRhaWw6IFRydWNrRGlyZWN0aW9uRGV0YWlscyA9IG5ldyBUcnVja0RpcmVjdGlvbkRldGFpbHMoKTtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwudGVjaElkID0gaXRlbS50ZWNoSUQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxhdCA9IGl0ZW0ubGF0O1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMb25nID0gaXRlbS5sb25nO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TGF0ID0gaXRlbS53ckxhdDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExvbmcgPSBpdGVtLndyTG9uZztcclxuICAgICAgICAgICAgICBkaXJEZXRhaWxzLnB1c2goZGlyRGV0YWlsKTtcclxuICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBpdGVtKTtcclxuICAgICAgICAgICAgICB0aGF0LmZvdW5kVHJ1Y2sgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB2YXIgcm91dGVNYXBVcmxzID0gW107XHJcbiAgICAgICAgICByb3V0ZU1hcFVybHMgPSB0aGlzLm1hcFNlcnZpY2UuR2V0Um91dGVNYXBEYXRhKGRpckRldGFpbHMpO1xyXG5cclxuICAgICAgICAgIGZvcmtKb2luKHJvdXRlTWFwVXJscykuc3Vic2NyaWJlKHJlc3VsdHMgPT4ge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPD0gcmVzdWx0cy5sZW5ndGggLSAxOyBqKyspIHtcclxuICAgICAgICAgICAgICBsZXQgcm91dGVEYXRhID0gcmVzdWx0c1tqXSBhcyBhbnk7XHJcbiAgICAgICAgICAgICAgbGV0IHJvdXRlZGF0YUpzb24gPSByb3V0ZURhdGEuanNvbigpO1xyXG4gICAgICAgICAgICAgIGlmIChyb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zICE9IG51bGxcclxuICAgICAgICAgICAgICAgICYmIHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMYXQgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMF1cclxuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTG9uZyA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1sxXVxyXG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMYXQgPSBuZXh0U291cmNlTGF0O1xyXG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMb25nID0gbmV4dFNvdXJjZUxvbmc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbGlzdE9mUGlucyA9IHRoYXQubWFwLmVudGl0aWVzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0T2ZQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcclxuICAgICAgICAgICAgICBjb25zdCBwdXNocGluID0gbGlzdE9mUGlucy5nZXQoaSk7XHJcbiAgICAgICAgICAgICAgaWYgKHB1c2hwaW4gaW5zdGFuY2VvZiBNaWNyb3NvZnQuTWFwcy5QdXNocGluKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVjaElkID0gcHVzaHBpbi5tZXRhZGF0YS5BVFRVSUQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0cnVja0NvbG9yID0gcHVzaHBpbi5tZXRhZGF0YS50cnVja0NvbC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJEaXJEZXRhaWwgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBjdXJyRGlyRGV0YWlsID0gZGlyRGV0YWlscy5maWx0ZXIoZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRlY2hJZCA9PT0gdGVjaElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBuZXh0TG9jYXRpb247XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJEaXJEZXRhaWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICBuZXh0TG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMYXQsIGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTG9uZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG5leHRMb2NhdGlvbiAhPSBudWxsICYmIG5leHRMb2NhdGlvbiAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHBpbkxvY2F0aW9uID0gbGlzdE9mUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgdmFyIG5leHRDb29yZCA9IHRoYXQuQ2FsY3VsYXRlTmV4dENvb3JkKHBpbkxvY2F0aW9uLCBuZXh0TG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhwaW5Mb2NhdGlvbiwgbmV4dENvb3JkKTtcclxuICAgICAgICAgICAgICAgICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKHB1c2hwaW4sIHRydWNrVXJsLCBiZWFyaW5nLCBmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gTG9hZCB0aGUgc3BhdGlhbCBtYXRoIG1vZHVsZVxyXG4gICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAvLyBSZXF1ZXN0IHRoZSB1c2VyJ3MgbG9jYXRpb25cclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgbG9jID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRoYXQuY2xpY2tlZExhdCwgdGhhdC5jbGlja2VkTG9uZyk7XHJcbiAgICAgICAgICAgICAgLy8gQ3JlYXRlIGFuIGFjY3VyYWN5IGNpcmNsZVxyXG4gICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aC5nZXRSZWd1bGFyUG9seWdvbihsb2MsXHJcbiAgICAgICAgICAgICAgICByZCxcclxuICAgICAgICAgICAgICAgIDM2LFxyXG4gICAgICAgICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGguRGlzdGFuY2VVbml0cy5NaWxlcyk7XHJcblxyXG4gICAgICAgICAgICAgIGNvbnN0IHBvbHkgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9seWdvbihwYXRoKTtcclxuICAgICAgICAgICAgICB0aGF0Lm1hcC5lbnRpdGllcy5wdXNoKHBvbHkpO1xyXG4gICAgICAgICAgICAgIC8vIEFkZCBhIHB1c2hwaW4gYXQgdGhlIHVzZXIncyBsb2NhdGlvbi5cclxuICAgICAgICAgICAgICBjb25zdCBwaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihsb2MsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGljb246ICdodHRwczovL2JpbmdtYXBzaXNkay5ibG9iLmNvcmUud2luZG93cy5uZXQvaXNka3NhbXBsZXMvZGVmYXVsdFB1c2hwaW4ucG5nJyxcclxuICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMTIsIDM5KSxcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHJkICsgJyBtaWxlKHMpIG9mIHJhZGl1cycsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgdmFyIG1ldGFkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgTGF0aXR1ZGU6IGx0LFxyXG4gICAgICAgICAgICAgICAgTG9uZ2l0dWRlOiBsZyxcclxuICAgICAgICAgICAgICAgIHJhZGl1czogcmRcclxuICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihwaW4sICdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnJhZGlvdXNWYWx1ZSA9IHJkO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jbGlja2VkTGF0ID0gbHQ7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNsaWNrZWRMb25nID0gbGc7XHJcbiAgICAgICAgICAgICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgcGluLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcbiAgICAgICAgICAgICAgdGhhdC5tYXAuZW50aXRpZXMucHVzaChwaW4pO1xyXG4gICAgICAgICAgICAgIHRoYXQuZGF0YUxheWVyLnB1c2gocGluKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gQ2VudGVyIHRoZSBtYXAgb24gdGhlIHVzZXIncyBsb2NhdGlvbi5cclxuICAgICAgICAgICAgICB0aGF0Lm1hcC5zZXRWaWV3KHsgY2VudGVyOiBsb2MsIHpvb206IDggfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgbGV0IGZlZWRNYW5hZ2VyID0gW107XHJcblxyXG4gICAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gdGhpcy5tYXBTZXJ2aWNlLmdldFRydWNrRmVlZCh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLCB0aGlzLm1hbmFnZXJJZHMpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChkaXJEZXRhaWxzLnNvbWUoeCA9PiB4LnRlY2hJZC50b0xvY2FsZUxvd2VyQ2FzZSgpID09IGRhdGEudGVjaElELnRvTG9jYWxlTG93ZXJDYXNlKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGRhdGEpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBmZXRjaGluZyB0cnVja3MgZnJvbSBLYWZrYSBDb25zdW1lci4gRXJyb3JzLT4gJyArIGVyci5FcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdObyB0cnVjayBmb3VuZCEnLCAnTWFuYWdlcicpO1xyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgZmV0Y2hpbmcgZGF0YSBmcm9tIEFQSSEnLCAnRXJyb3InKTtcclxuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBnZXRUcnVja1VybChjb2xvcikge1xyXG4gICAgbGV0IHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFIa21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1JtTTJWaU1XUXROR0psWkMxak5qUTBMVGd6WW1VdFlqUTVZalpsTkRsbVltUm1JaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpHRXhOVEJsWVRFdE1qSmhZeTAzT1RRNUxUaGlObUV0WldVMU1UYzRaVEJtTVdGa0lpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09tWXdaV1F4WldNM0xUTTFPVEF0WkdFMFlpMDVNV0l3TFRZd09UUTJaakZoTldRNVl6d3ZjbVJtT214cFBpQThjbVJtT214cFBuaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMlBDOXlaR1k2YkdrK0lEd3ZjbVJtT2tKaFp6NGdQQzl3YUc5MGIzTm9iM0E2Ukc5amRXMWxiblJCYm1ObGMzUnZjbk0rSUR4NGJYQk5UVHBJYVhOMGIzSjVQaUE4Y21SbU9sTmxjVDRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUltTnlaV0YwWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEUwVkRFNU9qQTRPakF6TFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpOCtJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKellYWmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG8xWkRRMk1EYzFaaTA0TW1SbUxXWTNOREF0WW1VM1pTMW1OMkkwTXpsbVlqY3lNekVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UVlVNVGs2TWpNNk16RXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpSUhOMFJYWjBPbU5vWVc1blpXUTlJaThpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09tRmtaak5sWWpGa0xUUmlaV1F0WXpZME5DMDRNMkpsTFdJME9XSTJaVFE1Wm1Ka1ppSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4T1ZReE5UbzBPVG93TVMwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4TDNKa1pqcFRaWEUrSUR3dmVHMXdUVTA2U0dsemRHOXllVDRnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrSUR3dmNtUm1PbEpFUmo0Z1BDOTRPbmh0Y0cxbGRHRStJRHcvZUhCaFkydGxkQ0JsYm1ROUluSWlQejRkYjd2akFBQUNlMGxFUVZSSXg5MldUV3RUUVJTR256TnpiM0xUdEtHMVdsSHdxNHVDYllYK0ExMjVFTGN1dWloQ1JYQ3AySDNCaFN2L2dVdkJnbEp3NFVMQmlncFNhVUZjaUZMRmpTQXRzWDYxU2RNMHZYTmM5Tm9rUlpPWUFSWG5NcXU1ekRQbm5QZThNNEdxOHFkSHdGOFkveDcwNnJPSm5wVEl0YWRmN28rK0x5K1ZyWmhrUlpMNVl6akV4T24xRjVtcHNVUG5ia3lNVFQ1cUd6cFhtUmxaTHViSFA3S0U3VXBuMks2LzFERlZ3V1NobUZzZGYvaDJabnlDU1drL3ZmZTZlNzROdlNhekowZnNLdlZyZGZvVHpLYXdYaW95Ti8rODVGZlRKN3VuM0tjY3dka2lGQnNkWG9sVElIbUR6SGI1MWJUbmNBNFhPR0lSTkZTa1FYZFpvNmcxWkxvajZ3V05CbVEwN05WcDhpbnNoaUFOZ3RYVk1tRlh5SUdoL2FlOG9BK0MyL25BV0FwM2hPQkQ5TXUvTlFhNkhkbmpaWWJQOUo4R1p0cUdIaHpjMjFGSXJSSHMyeUFveHcxUEwxbEZnMDBHMGtjdUFwZmFoaTYvTE56cTdPdmw1UG1qbEl0cmFDSlpRUkN0NWxwRnlVUnA1bTh1TVAxNXFuVDV4SlgyMDF1dWJLU3picXM3SkhZMVlTblVRQkZGalFFTVg5ZFdQRzFRUWxVVVI0eXFyZnFCMXJlcEtEaGluQ2hJNkFmVlJLNlNmUFYyOEhPdnNCZy9xQk5GaEdTYnhsZWdrNlFNenZlV1VXb01RWnJ2Sm15THJXMm9RWkFZekcvYzg5NVFFV2twd0MweG1lVENjNTdwUlZ0bFl0UWdDdFlYS2lLMC9vUnlpRkhFZUFvcGRxN0c1TFZwTmF2VEoxTFZtcHBLTStIaVd0TjRZMmhhTElvbUtkWW1Ra3I2MmhlcUFzWUsxZ2hoRk80QVMxM2FBd3RpRFd4NlFvdTJaREtsSEl0dlZxbFUxbEhWcWlGcW5TTVFoU0d1Wk5DTzVsSnFDQjNjZFd4bDRkMnJ6dG5yaXhocmNBbDBaenBVaFZnZFVkVEpjUDlJd1F0Njk4TGp2di9taGY4ZHRHSGxoNHY1UjFJQUFBQUFTVVZPUks1Q1lJST0nO1xyXG5cclxuICAgIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICdncmVlbicpIHtcclxuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUhrbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUm1NMlZpTVdRdE5HSmxaQzFqTmpRMExUZ3pZbVV0WWpRNVlqWmxORGxtWW1SbUlpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdFeE5UQmxZVEV0TWpKaFl5MDNPVFE1TFRoaU5tRXRaV1UxTVRjNFpUQm1NV0ZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T21Zd1pXUXhaV00zTFRNMU9UQXRaR0UwWWkwNU1XSXdMVFl3T1RRMlpqRmhOV1E1WXp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkyUEM5eVpHWTZiR2srSUR3dmNtUm1Pa0poWno0Z1BDOXdhRzkwYjNOb2IzQTZSRzlqZFcxbGJuUkJibU5sYzNSdmNuTStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTBWREU1T2pBNE9qQXpMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzFaRFEyTURjMVppMDRNbVJtTFdZM05EQXRZbVUzWlMxbU4ySTBNemxtWWpjeU16RWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRWVU1UazZNak02TXpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21Ga1pqTmxZakZrTFRSaVpXUXRZelkwTkMwNE0ySmxMV0kwT1dJMlpUUTVabUprWmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhPVlF4TlRvME9Ub3dNUzB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NGRiN3ZqQUFBQ2UwbEVRVlJJeDkyV1RXdFRRUlNHbnpOemIzTFR0S0cxV2xId3E0dUNiWVgrQTEyNUVMY3V1aWhDUlhDcDJIM0JoU3YvZ1V2QmdsSnc0VUxCaWdwU2FVRmNpRkxGalNBdHNYNjFTZE0wdlhOYzlOb2tSWk9ZQVJYbk1xdTV6RFBublBlOE00R3E4cWRId0Y4WS94NzA2ck9KbnBUSXRhZGY3bysrTHkrVnJaaGtSWkw1WXpqRXhPbjFGNW1wc1VQbmJreU1UVDVxR3pwWG1SbFpMdWJIUDdLRTdVcG4ySzYvMURGVndXU2htRnNkZi9oMlpueUNTV2svdmZlNmU3NE52U2F6SjBmc0t2VnJkZm9Uekthd1hpb3lOLys4NUZmVEo3dW4zS2Njd2RraUZCc2RYb2xUSUhtRHpIYjUxYlRuY0E0WE9HSVJORlNrUVhkWm82ZzFaTG9qNndXTkJtUTA3TlZwOGluc2hpQU5ndFhWTW1GWHlJR2gvYWU4b0ErQzIvbkFXQXAzaE9CRDlNdS9OUWE2SGRualpZYlA5SjhHWnRxR0hoemMyMUZJclJIczJ5QW94dzFQTDFsRmcwMEcwa2N1QXBmYWhpNi9MTnpxN092bDVQbWpsSXRyYUNKWlFSQ3Q1bHBGeVVScDVtOHVNUDE1cW5UNXhKWDIwMXV1YktTemJxczdKSFkxWVNuVVFCRkZqUUVNWDlkV1BHMVFRbFVVUjR5cXJmcUIxcmVwS0RoaW5DaEk2QWZWUks2U2ZQVjI4SE92c0JnL3FCTkZoR1NieGxlZ2s2UU16dmVXVVdvTVFacnZKbXlMclcyb1FaQVl6Ry9jODk1UUVXa3B3QzB4bWVUQ2M1N3BSVnRsWXRRZ0N0WVhLaUswL29SeWlGSEVlQW9wZHE3RzVMVnBOYXZUSjFMVm1wcEtNK0hpV3RONFkyaGFMSW9tS2RZbVFrcjYyaGVxQXNZSzFnaGhGTzRBUzEzYUF3dGlEV3g2UW91MlpES2xISXR2VnFsVTFsSFZxaUZxblNNUWhTR3VaTkNPNWxKcUNCM2NkV3hsNGQycnp0bnJpeGhyY0FsMFp6cFVoVmdkVWRUSmNQOUl3UXQ2OThManZ2L21oZjhkdEdIbGg0djVSMUlBQUFBQVNVVk9SSzVDWUlJPSc7XHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ3JlZCcpIHtcclxuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUgzbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1EVmpNemMxWkRZdE1XTmxPQzFrWmpSbExUZ3dZamd0TWpsbVlUUmhaakEyWkRFM0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdSbU1HSXpZbUV0TVdOaVpDMWhNalEwTFdFeVpXTXRNVGc0WVRsa09HUmxNamswSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEcG1NR1ZrTVdWak55MHpOVGt3TFdSaE5HSXRPVEZpTUMwMk1EazBObVl4WVRWa09XTThMM0prWmpwc2FUNGdQSEprWmpwc2FUNTRiWEF1Wkdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5qd3ZjbVJtT214cFBpQThMM0prWmpwQ1lXYytJRHd2Y0dodmRHOXphRzl3T2tSdlkzVnRaVzUwUVc1alpYTjBiM0p6UGlBOGVHMXdUVTA2U0dsemRHOXllVDRnUEhKa1pqcFRaWEUrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSmpjbVZoZEdWa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5pSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TldRME5qQTNOV1l0T0RKa1ppMW1OelF3TFdKbE4yVXRaamRpTkRNNVptSTNNak14SWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTFWREU1T2pJek9qTXhMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEb3dOV016TnpWa05pMHhZMlU0TFdSbU5HVXRPREJpT0MweU9XWmhOR0ZtTURaa01UY2lJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRsVU1UVTZOVEk2TWpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEM5eVpHWTZVMlZ4UGlBOEwzaHRjRTFOT2tocGMzUnZjbmsrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrN1NkQXdBQUFBc3BKUkVGVVNNZmxsN3RyRkZFWXhYL2ZuWmxkTndtSkdrS0lDRDRpSVdLbElvcXJWajQ2UVZCc2ZZRDRIMmhoYlpBVTJvaUluVnFJV0dobEk2Z2dCbEY4Qk44aEtvaEVvaEkxYmpiN3VQZXoyTkhkVGR6WlpTZG80UXpmYmVZTzU1N3ZuSHZ1aktncWYvc3kvSVBMajNyNDlNNDloc2R1SlZvR0w2N29IQ2RoQStObXpoR1ViQ0VuRDdjdW45alR1ZnJEMkxKZXUrWHd3ZVpCYjU0OHNYakRaTzcwc2x4eVhiN0RwVVFvYTZGbFdPYzhXZjlvWW5TczkrMEYrbGFlQTZhYUJ2MTBlMmpORjV2ZHVhNS9KZGJPSUZsaEJUV0sxZnphOXVmRGl3cmJkbndCTGphdDZSdkQ0SStXZG5DR2d0UHEwbkxaSWtDQ0owclBsWWNQenNjeTB0MVBIL3UrK1VicjJrMHNTVHllR2NQQTFjdTVXS0NacnU0ejg3SFRvTXhUYWxaU0JhUklkNkRqMjlLYmpzWnk3NzcrdmxQMjVZdEROd0lmRFlJcUlhWENTRVlNTU0yU25MRzczbzFmaXdXNnU2ZDc3L3dIOTR2WFh3NTdXWkVLSUpBS1Azbk9wOFBsU1U5ODcxcDE1bXdpRnVqemtkSDkvUjJkeVMyWkgzZ0pueitsbHdBT2gvb3BKbHVVenlPdkRuUkJaSXNsS2dhUHRiWG10MmNMd2RMTmFlekNCZURjckMxVFltd2htVUplajNEcHlXT09xRXJUVENXVExiWjZ5YUROR0p4VUNWbkZWTVZnOEZEeFNFQTJWbnN4QnNWZ3c2SkdWNHgxcUhHSWsvalo2d0FuSllLaTFTbFVGVTRDaUlDVTNvbkhGRkJWU25mWnNiTkJGUlZGYU95WWpBd0hUOEZaQzFvYk1OeXBnR0NkYStpczlPdXZTRkEwSERWS2lIRGVYTFQzTjVCRU5OZ0FqWm1vSVZBSmgxKzYxV0phOHRJY3VOY1RyVVJGTklLcENJak1qYVlGVlN3T0U4SFVkNHBUeFRiNGtWZTN2UWdJSWN1b2RGTnBXTlhvR0pRd0Q0d0J6OVJNQjZjT01WSmFYRnpRaEFxdG51QmxNNWhKSDdVV0Nkcyt5OU1KaHlrV0NCb3dVeVJvemxudnZiT01EZzFWZ1pod1o4b003Z0h3R2J4WW9PbUI0MTlOTWQrR3l4VVU1N1FpQ2lwUHVGSUpCdDlzREZKVGRXM3kzL3hXL0FSTnBqdnhsODB1TEFBQUFBQkpSVTVFcmtKZ2dnPT0nO1xyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICd5ZWxsb3cnKSB7XHJcbiAgICAgIHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFJS21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZOVGc2TlRVdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZOVGc2TlRVdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1E0TWpGa1pqTXRabUZsTkMweE1qUXpMVGxqWlRVdFptRmtOMkUyTVRkbU5UVTNJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpqVXdOMkl4WW1NdE5EQmtaUzB3WkRReUxXSXdaVGN0TUdVNE5qTm1OelZrTmpBMElpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09qQXdNREpsTkRobExUaG1PV1V0TmpVMFl5MDVZalEyTFRWbVlXWmtNVEJoTjJFMk56d3ZjbVJtT214cFBpQThjbVJtT214cFBtRmtiMkpsT21SdlkybGtPbkJvYjNSdmMyaHZjRG80TXpjeFkyVTJZUzB4WVdaa0xURTBORE10T1RneFpDMWtOMkU0TkdZMU5tVTBaV1U4TDNKa1pqcHNhVDRnUEhKa1pqcHNhVDVoWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpqQmxaREZsWXpjdE16VTVNQzFrWVRSaUxUa3hZakF0TmpBNU5EWm1NV0UxWkRsalBDOXlaR1k2YkdrK0lEeHlaR1k2YkdrK2VHMXdMbVJwWkRvNE9HUXpOVFpoTnkwM01UZ3hMV1UxTkdFdE9UbG1aUzAwT0RCbE16VmhZelkyWmpZOEwzSmtaanBzYVQ0Z1BDOXlaR1k2UW1GblBpQThMM0JvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNE9HUXpOVFpoTnkwM01UZ3hMV1UxTkdFdE9UbG1aUzAwT0RCbE16VmhZelkyWmpZaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVFJVTVRrNk1EZzZNRE10TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPalZrTkRZd056Vm1MVGd5WkdZdFpqYzBNQzFpWlRkbExXWTNZalF6T1daaU56SXpNU0lnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE5WUXhPVG95TXpvek1TMHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGljMkYyWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUTRNakZrWmpNdFptRmxOQzB4TWpRekxUbGpaVFV0Wm1Ga04yRTJNVGRtTlRVM0lpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEU1VkRFMU9qVTRPalUxTFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQnpkRVYyZERwamFHRnVaMlZrUFNJdklpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QbmV3WTZVQUFBSkVTVVJCVkVqSDNWWXhheFJSRVA2KzkvYXl1ZFVJa1NObkNBb1JsWWlJV2dtQ2hSRHNSVXRiQzMrQWxzSFd3bFliaTFocFl4RUVtMWlwTVJCUkVVUThnbzJTSENraTNsMjQzTjd1elZna0puZkh1YnU1RnhKdzRMSEZ6czQzODMzelpvZXFpcjAyZzMyd2ZRSDFrbDVXVm4rVnYzeTRGeHc3OGt3T0RSMkV5SVlVMmlQMTlWRHdjK1dpR1Q5MXYxNGNIUjlOaXNza1RhY2ZYR3Rjblh6ckYwWitJd3paOWxVM3RDREllNWg5MWNTYVhBcHYzSndiN0p2ZVQ1OC95dEp5RGFvV2JEOWlRZkcyRHRTRFVoREZGcVZ2SlhIU2RIcEdNTDlBK0VGeUVBVmhTVVR4QUI0L3lidHAybEJCc3dYQUV0WnFPN2RkbVN0b0ZiUkFMUXJkUUdkbkhxSlZ2WTFxdFFMR0J2OVNuMURVUW9WcUExTjNiNldDTW0wNHZINlIxN21GWVFnRFdMdE5hRWVsYW1BTmNPNU1HWlBYMStnRSt2VFJVVzIyaGxBNC9BTnhSTkQydkRDZ0tPd0FNSEZDOGZ6bDJQcWRxY1dnYjNwUG42eGh0VDZPa1dJUktnclZucEtDQ25nKzhXWitCV09GaXB1bVVXd1FSekhPbmo4T1NNcU16Zytndk5SQzRjQ3lHK2dXaytzUjRwWWt1dVVJeEZHTU1EU09vR3g3TXNXUHV6Ujd0NnROaWFvOUV1MFhWRHZtcktZem9ydFVxVEpqcFp1ZHJhNmdaSGZVaEVMMWI0S3U5SExubmNJTWJvbjliVlJCRUR2Wm85UVZGSnF0UHQwY1N3UmhNaVRvcFhGRkFwcWxlOWxqb2VpdmU2Vk5vL1R1SmJPSm1naHFRZmkrQjJUVWRBTlBISytNV3YyKzJPVGxLeDZNbUVSR01KaUQ3M3V3b0hFQ0hTNzZLOFY2SVhqL0xoSVZkdnpLdWkzbkE2V3ZEWE5od3RhZE40Zi9ac1AvQXd6dDVSM2JzUTJqQUFBQUFFbEZUa1N1UW1DQyc7XHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ3B1cnBsZScpIHtcclxuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUgzbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllqVm1ZbVUzWWpZdFpHUTFPQzFqTnpSaUxUaG1aR1l0WWpKa05qVTFOVFkzT1RFMElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpBeE5tWm1OamN0WVdZeFpDMDJNVFE1TFRnek1qUXRaRE0wT0dZMU56ZzBaVGswSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEcG1NR1ZrTVdWak55MHpOVGt3TFdSaE5HSXRPVEZpTUMwMk1EazBObVl4WVRWa09XTThMM0prWmpwc2FUNGdQSEprWmpwc2FUNTRiWEF1Wkdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5qd3ZjbVJtT214cFBpQThMM0prWmpwQ1lXYytJRHd2Y0dodmRHOXphRzl3T2tSdlkzVnRaVzUwUVc1alpYTjBiM0p6UGlBOGVHMXdUVTA2U0dsemRHOXllVDRnUEhKa1pqcFRaWEUrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSmpjbVZoZEdWa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5pSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TldRME5qQTNOV1l0T0RKa1ppMW1OelF3TFdKbE4yVXRaamRpTkRNNVptSTNNak14SWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTFWREU1T2pJek9qTXhMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGlOV1ppWlRkaU5pMWtaRFU0TFdNM05HSXRPR1prWmkxaU1tUTJOVFUxTmpjNU1UUWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TURKVU1USTZNakE2TXpNdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEM5eVpHWTZVMlZ4UGlBOEwzaHRjRTFOT2tocGMzUnZjbmsrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrMzQxM2p3QUFBdXBKUkVGVVNNZmxsODl2VkZVVXh6L24zdnVtMDRMbFY4RHdhMUdSTm9TNHdLWVE0MHB3UlFnN293bHVjQ0ViTnF6d0QyQ0hDemZLUWxlV3hCQldKcEM0UXpZRVE4TENLS0xTQUZXVVNKQlN5MHc3Nzk1elhMd3BuYVl6MHpxdjBZVm5jaWVabkp2M3ZlZjcvWjV6MzRpWjhXK0g0eitJMEMxNWNmd1NEMjllcWVRWFhubTVOcjJwSWxuU3BhY1dHckV1ei9aZWVUSzY2OWlEcWFIZjBva3o3L1FPZXVPem16dUdwdDc4ZUdzYUd0TzFqWDRuOGx3TGE4SXJvRUdsT2prNk1aTTlHR2ZZUGdWcVBZTk9Ybi82NnZyRzA2TjdkbTRnMTdRb1p5M0NaQUxFTkJwdnJkOG1iOHc4QnM3M3JPbWp5djJ6cy8wMW9nbFI0NktWYkdIVlU2SVJZQ0o4di9YcWoxOTlYc3BJMzgxOE0xd1AwOWJDYXR1b0FJNCs3bGR1Yy83clQrWktnY2FOOVhNdjZMcFpBVEtyZGx5ZVBqS0JGOVBtUDE3Yjkvb0hwZHg3ZU1kYkg2VmI2ZjF2QjY2aVlraExUcXo0WllBaVZLT3dxYll6N2YzNTZKZWxRQThPSG5rN2oydmlEejlkODFIbVdBeTdFTGwzRE9hRGJHZjM1aU9uRDFaS2dkNzVaZUw0bGpEUzkxSWNvMko5R05wbWw0QXFpUENYVFRNNWVmYzlHTzFLc1hRYmcrL0txY1lJWTluSThBaXlJUys0bkcrWkpyMkM0QldzMzhqdkJDNC8vSUp4KzFCNnJuU1d1Wmd4a1BYTEdweEZSS1ZObllLSm9TcUllUUpadlJTOWdrTXhvaVNjSktURCtVMGRtaUNaS3o5N0ZTMTBOQ25vN0tDRWlJRUFvbWhiM1h1NlpReWpzL2JPREhFR3JPeWFYQVpVaU9TWUZkcDFaTVFWdWFRSnQ0STZYUGVrdzVwMWRyT2oxK0pJeGJpVTFhRFhXcjdiUjNMR1Azbi9DTXR0RUFRUjhBTFdZZkE3Qld2dUt3MmFFZkJOTXBJdHpOc2xsUW9Gb0hUWGZvVjlXaGdKdEd1bG9nRzFoSnF1RHIyK3NBakpyR09sVUl6ZlZkSFVOYWtTWjdnQUZqdDVMZUc5ekR1Z0xHaEdsUUdrN3BFZ2tPWWY2MXI4TElnSldvR3NZUVN5Y3FBTlp2MGpmdVgzZTNlZlR5UnBmdG8xaVNjd3paKytGT2loa3dlbWZNT3ZEWFBrVGszbmdWUjBTUytyR0NtSUc2N3VyeTNiaHYrYnZ4Vi9BOHNWUUFnOCtnRFlBQUFBQUVsRlRrU3VRbUNDJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1Y2tVcmw7XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0TWlsZXNUb0ZlZXQobWlsZXMpIHtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKG1pbGVzICogNTI4MCk7XHJcbiAgfVxyXG5cclxuICBwdXNoTmV3VHJ1Y2sobWFwcywgdHJ1Y2tJdGVtKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgIHZhciBjdXJyZW50T2JqZWN0ID0gdGhpcztcclxuICAgIHZhciBwaW5Mb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0cnVja0l0ZW0ubGF0LCB0cnVja0l0ZW0ubG9uZyk7XHJcbiAgICB2YXIgZGVzdExvYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0cnVja0l0ZW0ud3JMYXQsIHRydWNrSXRlbS53ckxvbmcpO1xyXG4gICAgdmFyIGljb25Vcmw7XHJcbiAgICB2YXIgaW5mb0JveFRydWNrVXJsO1xyXG4gICAgdmFyIE5ld1BpbjtcclxuICAgIHZhciBqb2JJZFVybCA9ICcnO1xyXG5cclxuICAgIHZhciB0cnVja0NvbG9yID0gdHJ1Y2tJdGVtLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpY29uVXJsID0gdGhpcy5nZXRJY29uVXJsKHRydWNrQ29sb3IsIHRydWNrSXRlbS5sYXQsIHRydWNrSXRlbS5sb25nLCB0cnVja0l0ZW0ud3JMYXQsIHRydWNrSXRlbS53ckxvbmcpO1xyXG5cclxuICAgIGlmICh0cnVja0NvbG9yID09ICdncmVlbicpIHtcclxuICAgICAgaW5mb0JveFRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRWdBQUFBckNBWUFBQURiamM2ekFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFGR21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TlMwd01WUXhOam94TVRveE1DMHdORG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNakF0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1qQXRNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1Rka1pqRTBZbVF0TkRCaE9DMDFORFJqTFRrek9UQXRNMlJpTm1aa1lUWm1NbUpsSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZNR0ZrTTJJeVpESXRPREJoTmkweE1EUmtMVGhpTnpRdFpqVmhaREZtTVRobFl6RXlJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPVGRrWmpFMFltUXROREJoT0MwMU5EUmpMVGt6T1RBdE0yUmlObVprWVRabU1tSmxJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNU4yUm1NVFJpWkMwME1HRTRMVFUwTkdNdE9UTTVNQzB6WkdJMlptUmhObVl5WW1VaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1EVXRNREZVTVRZNk1URTZNVEF0TURRNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCtPZHVLM1FBQUF3OUpSRUZVYU43dG1qMVBHMEVRaHU4bnVLZWhESjBybE5KU0pHcEhwQ1d5bERZRjZhQUJWNlFpUVFLbFNSUk1GU1VGcHFOQm1Bb0VCYVFncERUaVE1UUdtcFNiZTlGdE5CbjJ6bnQzTzhkOWVLU1JiVGp0dnZmYzdzemM3bnFla0NtbDJxcllkdUo3VFFwT1EvZHkvK2RlZlRuWVVNdTl0ZHc3ZEVJdnNhNFVvQzNkdzlTbmwycHM0VmxoSEhxcEpRVlE5LzJqN3ozZkIyRmo5TmZONzBMQjBYN1FQMG9HS0FEVHM1M0U2S2d5Z1B4ckZ6a0F6RmMwUmgyanBuS0EvT3ZXK2NoNDgrMnRzZkZYNjYrckJZakRXZHgrSDlsNHBRQnhPTys2ODBNYnJ3eWdKSEFxQXlncG5Fb0FTZ09uOUlEU3dpazFJUC83U2xvNHBRWGtmelpkd0Nrem9MNExPS1VFUkVmUGo1TnU2c2JMQ0tpamZ6ei84R0lFeUFBSUsyZnFjbkR0cFBFeUFuSjZNeU5BUXh6VGxKcUxhWnVsVHl4TnFqdXk3T3BKUEcyNkpuUXh1Rkt6bTNOcSt1dE03aDA2b2ZlL0pWY0pRSFNhRmR4bVBhbDRnWHFLN1JBVXpiWjBrU2dXVURHZnNjQ0crb292emViUm1iWEZBUlhOUjRDeUJJVHBveU0vUHZPMFFZalNnbXF6TFRXY0FFSm4zNDgzalZFTktYSjVkL1hKd0dDbjVaU1VHTlQyKzRjUDJWVVVFRExUblVWbWdraU1zQ3poaEQwMGJwLzNOMlFBNGVud2JXVmtLRHdWT04vNHp4SVNoNE43MGRxZ0cxbVVhc1AxVGdIeDhqdHNid3pYMFNyYXhmS0p6YWkyV2V4RGFLRGFUTlB0VVpGb0N3aEhRMnczRGdFSkt3Tlp2WXZSVjRNNDJrN1p3UXBEOWQvUWdQYUczWXdXWWJza1FxZmpNTkd1anFyWWFxTWpqdDR2UWdTemNRMm9wZit5ZmJiektHN2d0elkwRXJlbWtLeXY2TWkyMVVidlI1OHY0R2VDTUdqNGRzOVAvUi9FR2tSNnBHczREWUFRWkN0ZXh5eWQraVVjcVR1Sk5wcjZRN0pmblFPcVVVaGhsbVFFWldWSkFJVllLMnk3dVJZY3ZMeU5xbS95dXR4aHE0MlhLL1R0L1Y5Z3RqeUVTYjBUWjF1SUR2MGdDVFFFdlIyVnVybXpTdnM4YUtPVzlsRG1PSTFSVVVJTWM3cnVDVnR3b3cvYW90NEpEZHBhWXVlZTBSbGVCSkVWSU1xMFhPbFVRTFMyWmdKdEhRa2hLekhDUXR2TDBHaTVZbUVkNmFkMUh0SDVubld3YzYrdFRndGZnMEYzTTA2YmZ3RzRUdjhYeStoUGFBQUFBQUJKUlU1RXJrSmdnZz09JztcclxuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAncmVkJykge1xyXG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUZFbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdOUzB3TVZReE5qb3hNVG95TVMwd05Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNak10TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNak10TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNlpqQTFZMlZtTkRjdE0yTmpZaTAzWWpRMkxXSTFaalF0TjJJNU1EQXdNamcxTWpsbElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09tWXdOV05sWmpRM0xUTmpZMkl0TjJJME5pMWlOV1kwTFRkaU9UQXdNREk0TlRJNVpTSWdlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09tWXdOV05sWmpRM0xUTmpZMkl0TjJJME5pMWlOV1kwTFRkaU9UQXdNREk0TlRJNVpTSStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WmpBMVkyVm1ORGN0TTJOallpMDNZalEyTFdJMVpqUXROMkk1TURBd01qZzFNamxsSWlCemRFVjJkRHAzYUdWdVBTSXlNREU0TFRBMUxUQXhWREUyT2pFeE9qSXhMVEEwT2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BwS3BjS2NBQUFMNFNVUkJWR2plN1pyTlNqTXhGSWJuRXVZU3VuYlZuVnMzN3NVYmNHNUE2Tlp1bktVN1hlamE2ZzIwRjFDdzYyNFVRU3dJL2tCRkVJcEZRUkNFbUxjMGNucWNURE16eVRnL1BYQSs5V05JM2p4SlRrNStQTStCQ1NGQ1VXNjdsTzU3anVCc3FGcSszOS9GNi9tNWVEazVLYnhESi9RUzY3b0MxRk0xakxhM3hlWGFXbWtjZXBrMTBnQm9TaitVZmlIOVRUZEdQMGVqVXNGUi9qRWMwbWFFU2NGY21FNWlWRlFiUVBMRGZRNEE4eFdGVWNlb3FSMGcrZEVwSHhuM3U3dVJoZDhGUWIwQWNUampnNFBZd21zRmlNTjVhcmVYRmw0YlFHbmcxQVpRV2ppMUFKUUZUdVVCWllWVGFVRHlsNk9zY0NvTFNQNnpaUU5PbFFFOTJJQlRaVUF6bS9SNm1RdXZOS0NiemMwVklCMmdyK2RuSzRWWEZwQ3R4cXdBTFhGTVUybzJwbTJlZnIyK3pvOWRXNTd0M3FablFsL2pzWGphMnhOM096dUZkK2lFWG1hK2RVQjBtcFhjV2lxTHRoNHZrRSt4b1ZvMjY5RTltSk9BaXZtTUF6YmtWL3hvdG9qT0xIUU9xR3krQXBRbklFd2ZGZm54czBnWGhFZ3RxRGJUVk1NS0lGUTI2WFlqb3hxV3lKZmo0MzhEZzV1V3o5dGI3UjBkVmxlbmdFeFhKb2pFQ01zVGpxN1R1TDJlbmJrQmhON2gxOHBZb2RBcmNIN3hueWNrRGdkdFVkcWdHNnNvMVlidnJRTGk2YmZ1Ymd6ZjBTemF4dkdKeWFnMk9leERhS0Rhb3FaYlpKSm9BZ2hQUTB3dkRnRUpKd041N2NYbzFpQ0pOb3p3SmRuL3hnS2d1TVlvRWFaSEluUTZMaE50NjZtS3FUWTY0bWg3RVNLMHoxN1UvMHo3L1Q5eEEzLy9CamhaU05LY3dtVitSVWUycVRiYUh2VytJT0pOMElEZmhWMHR2QWlUa1I3TE5ad0dRQWd5RmE5aWxscjZYVGpkSGlUUlJqdFBzL28xT1NDZlF0SXVrU2xHVUY2V0JwREdBdDFkdkQ5L2VEbU55MitLZXR4aHFvMm5LM1QzdmhDWURSNWhVdThrdVJaaU8rTkJSSGsyUFl4YnV2OGM1aTFtMm8vek12eXNqekliTkViRkNZbVkwMDNQc2MwYk90TVd0eWVNMEJZNGUvZU15ckFSeEtvQVVacmp5c0RMd2ZqTnNLRzJqZ3NoUnduQ1F1amxhT2lNQk5vNnJudnJNYWJ5Z1hHd3M2K3RPYTlmWjlDOWxiVGNIeEhCeEI3SjZlVFZBQUFBQUVsRlRrU3VRbUNDJztcclxuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAneWVsbG93Jykge1xyXG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFzQ0FZQUFBREdpUDRMQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUZFbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdOUzB3TVZReE5qb3hNVG93Tmkwd05Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNVGt0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNVGt0TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9UQXlOREU0WTJFdE5UTXpOQzA0TmpSakxXRmhObUV0WVRKbE5EazJZbVUxWW1FNElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09qa3dNalF4T0dOaExUVXpNelF0T0RZMFl5MWhZVFpoTFdFeVpUUTVObUpsTldKaE9DSWdlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09qa3dNalF4T0dOaExUVXpNelF0T0RZMFl5MWhZVFpoTFdFeVpUUTVObUpsTldKaE9DSStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RBeU5ERTRZMkV0TlRNek5DMDROalJqTFdGaE5tRXRZVEpsTkRrMlltVTFZbUU0SWlCemRFVjJkRHAzYUdWdVBTSXlNREU0TFRBMUxUQXhWREUyT2pFeE9qQTJMVEEwT2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BuS2JJNVlBQUFNSlNVUkJWR2plN1pxOVNzUkFFSUR2RVN4OEFNRVhPSHdCN3duVUo1QjdBQVY3QzYvVlJrdXR2TTVTUVFRYk9RVzFzZkJBTFN6ODRSb2J3YlBRUXN5dE0yczJUamFiWlBPemEzNXVZRkJRc3BNdnN6T3pzOU5vV0JERzJBVG9iQW0wMmJBcHNPQUM2Qk1ybDd5QnJ1RkhOUTJudzhvdDE4WWd3WU5iM2pKZjc4eDUzR0hPL1VieEZleEVlNG5zbXdKMElGWnd6bHJzKzNDeU5JcjJVa2tMb0FtNkNkcHo5NnhTUnUrM3BZSWpkUFI2a1E2UUM2YW51NGx4b2RvQWNpTzdYMkMvNHNOOENsNVRPMER3Zjd1eVp6aFhpK285ZkRsZkwwQUJPSGVyMFVHdVRvQUNjUHJMOFZtZ0xvRFN3S2tOb0xSd2FnRW9DNXpLQThvS3A5S0E0UGV0ckhBcUM4aHRTMlNHVTJWQVQzbkFxU1FnNmoyandWNzIwM0FGQVhXOTFzVEp6QmlRQXRBMS8rMXprRTgvcFlLQWNuMlpNYUE0UUxCTnFlU3hiYTNxOFRSalgwTnpnUGdYSUQwaDlqRmdUbjhKUEd1dStBcDJvcjIrbHFzSlFIU2JsVnhXR3FiaUJkWlQwZzFCMmVSQUZJbm1BaXJzWjJ5d1lYMFZhTTBXVUNYcG1BZFVNaDBEc2dvSXRvK0kvUHhuZ1M0SXNiVHcyYVpaYXVRQ0NCZkRtS0lVU0pHaisvWC9BM08xQ0NYR1RjZ2QzVG5QcmtZQi9XYW1ZZnlGSVJpSkhtYTErZzM3YUpJNEQ5dG1BT0hYa2ErVk1VUGhWK0VxWGZ6YmhDVEQ0VmxKMklaZWhYK250b1YwTGRJRGtzcnYwTHN4VE92MFpqV0g5b21XVjJzMCszaG9JTGFwdGx1Z1NOUUZoS01odWhlSEhPYm53TnBaakI0Tmt0akdQVHk2K204SlFLZHhMK01ab2RrU29kc3gxdWk4UmxVMGJhTWVSOStYaHdpL1RBbEFiZTlsWG82Q2NRT3Bpd2ZDUTVMV0ZDYnJLK3JaMnJiUjkzSG5DK1NaSUhRYSticW4vemV4TWVTUkh0TTFWeElBMFNCdFFDSm11YW5maUVMcVRtVWJTZjBoMmErcG1rTHR4NmJJRkI1a1M5SUFDcEYyMUtndURsNE9JK3ViZ3JZN3RHMlR5aFY2ZXZjQ3MrWVFKdFZ1a21zaDZ2cHVFbWdaMUU1VTZnNDI4M3lWOXJQN2pJbXNRNWxUdmhnVllZaGlUemN0ekdNL2U3WkZuQWtWdHJXTnpUM2pZbmdRNUlkV01FclZyc3pWZ1BpQjlhUzJkVTBZc3BVZ0xIUXNUL1czRTlpbURlY0hSanhTbUsrYnFmd0FBQUFBU1VWT1JLNUNZSUk9JztcclxuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAncHVycGxlJykge1xyXG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUd0bWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdNeTB3TTFReE1Ub3pNVG93TkMwd05Ub3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZORGt0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZORGt0TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1Ea3dZVEF3WlRZdE9UTm1aaTFrWWpRMUxXSXhNakV0TTJJMU16Qm1OMll5WlRRd0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2TlRKa01XUXdNRGd0WVdNeE15MDNNRFE1TFRsbU9HTXRPVGhpTlRjeFpESXpZakkwSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2WXpJME9UZzBNR1V0TW1Ka01TMWtaRFF4TFRnMFkySXRNV1EwWWpSak56VmtNRGt4SWo0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGpNalE1T0RRd1pTMHlZbVF4TFdSa05ERXRPRFJqWWkweFpEUmlOR00zTldRd09URWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TUROVU1URTZNekU2TURRdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pKbU16azNNakU0TFRsbU1EVXRaVGMwTUMxaVkyWTVMVE5pTW1Wak16azVNRFEzTWlJZ2MzUkZkblE2ZDJobGJqMGlNakF4T0Mwd015MHdNMVF4TVRvek9Ub3dPQzB3TlRvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZNRGt3WVRBd1pUWXRPVE5tWmkxa1lqUTFMV0l4TWpFdE0ySTFNekJtTjJZeVpUUXdJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakUxT2pRNUxUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUGdZb0k0b0FBQUw5U1VSQlZHamU3WnE3VGh0QkZJYjNFZndJUElJZmdUZkFOWldyMU82RGhMdVVRQnNweW5aV2luQUxEVWhnRjBna1VpUWloMlliMWtVb2tKQ01FQVZVeS83SUE4ZkhzN3V6dTNNMmUvR1JqbnpSYXViZmIyYk9uTGs0anBBRlFkQVBxbTJYb2JlazRLeXFXcDRlbjRQeG9SZjhIbHlWM3FFVGVvbnRTUUhhVnpWODd4MEhuOWUrVmNhaGwxcFdBTzNRdDBJZmhqNk42cU4zL3JSU2NKVGYvTDNOQm1nR1ptZzZpRkZSWXdDRnoyNXlBQml2S0l3NmVrM2pBSVhQZmVVOTQrVFR1YmJ3bzQxaHN3QnhPQmRmTG1NTGJ4UWdEbWUwOHl1eDhNWUF5Z0tuTVlDeXdta0VvRHh3YWc4b0w1eGFBd3EvYitlRlUxdEE0V2ZIQnB3NkEvSnR3S2tsSU5wN3ZETS9kK0YxQk9TcUg0TVBSMHRBR2tEWU9Rc2ViaCt0RkY1SFFGWmZaZ2tvd1RGTXFka1l0a1c2dTc0N3QrM3FTTFEyM1JQQzBNWE0rT1BqV2VrZE9xRjNic3RWQWhBZFpoVzNuaU1WTDlBYTdJU2dhcmF2a2tTeGdJcnhqQTAyNUZkOGE3YU16cXd2RHFocXZnUlVKQ0FNSHhYNThWbW1BMEtrRmxTYmFhcGhCUkFxODA1OWJWVERGSWtqM1A4RkJpY3RkOWZUeURNNnpLNmlnRXhuSm9oRUR5c1NUbFNqY1JzZmVES0EwRHI4V0JrekZGb0Z6Zy8raTRURTRlQmRsRGJveGl4S3RlRjVxNEI0K2gxMU5vYm5hQlp0WS92RXBGZWJiUFloTkZCdHV1RzJrQ1NhQWtKY01UMDRCQ1Nhcmt1dnhXaGRhYlNoaHlkay82c0swQ2pwWlZTaHBsc2lkRGdtaWJaMVZjVlVHKzF4OUgwUklwaXRLRUJkOVkvLzg5OUMzTUR2dHdCMzZLWE9LU1R6SzlxelRiWFI5MUgzQy9pZElIUWFmdHp6Wis1RzJNSDdqVEFhQU5OTTRTcG1xYWxmd3VueUlJMDIybmdSczErYkEycFJTSkZUWklZZVZKUmxBUlJoM2FqajV0YnM0dVY5WEg1VDF1ME9VMjA4WGFHcjk3ZkFiSGdKazdxYjVsaUlyWXhIbXZKc2VqOXU2bDdZekp2UHRDZXpNbHA1TDJXdTBCZ1ZKMFF6cHR1T3NNMWU5RlZiM0pwUW82MHJkdThabFdFaGlGa0JvblRibFZZRnhHdnJaTkRtU2dqWlRoRVcrazZCUnRNVkEzT2xXMnNTVS9uSU9OaloxOWFtaWEvR29MdVRwc3dYb2FUd3NuS0FrZEVBQUFBQVNVVk9SSzVDWUlJPSc7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGZlZXRmb3JNaWxlcyA9IDAuMDAwMTg5Mzk0O1xyXG4gICAgdmFyIG1pZWxzVG9kaXNwYXRjaCA9IHBhcnNlRmxvYXQodHJ1Y2tJdGVtLmRpc3QpLnRvRml4ZWQoMik7XHJcblxyXG4gICAgdGhpcy5yZXN1bHRzLnB1c2goe1xyXG4gICAgICBkaXNwbGF5OiB0cnVja0l0ZW0udHJ1Y2tJZCArIFwiIDogXCIgKyB0cnVja0l0ZW0udGVjaElELFxyXG4gICAgICB2YWx1ZTogMSxcclxuICAgICAgTGF0aXR1ZGU6IHRydWNrSXRlbS5sYXQsXHJcbiAgICAgIExvbmdpdHVkZTogdHJ1Y2tJdGVtLmxvbmdcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciB0cnVja1VybCA9IHRoaXMuZ2V0VHJ1Y2tVcmwodHJ1Y2tDb2xvcik7XHJcbiAgICBjb25zdCBsaXN0T2ZQdXNoUGlucyA9IG1hcHMuZW50aXRpZXM7XHJcbiAgICB2YXIgaXNOZXdUcnVjayA9IHRydWU7XHJcblxyXG4gICAgdmFyIG1ldGFkYXRhID0ge1xyXG4gICAgICB0cnVja0lkOiB0cnVja0l0ZW0udHJ1Y2tJZCxcclxuICAgICAgQVRUVUlEOiB0cnVja0l0ZW0udGVjaElELFxyXG4gICAgICB0cnVja1N0YXR1czogdHJ1Y2tJdGVtLnRydWNrQ29sLFxyXG4gICAgICB0cnVja0NvbDogdHJ1Y2tJdGVtLnRydWNrQ29sLFxyXG4gICAgICBqb2JUeXBlOiB0cnVja0l0ZW0uam9iVHlwZSxcclxuICAgICAgV1JKb2JUeXBlOiB0cnVja0l0ZW0ud29ya1R5cGUsXHJcbiAgICAgIFdSU3RhdHVzOiB0cnVja0l0ZW0ud3JTdGF0LFxyXG4gICAgICBBc3NpbmdlZFdSSUQ6IHRydWNrSXRlbS53cklELFxyXG4gICAgICBTcGVlZDogdHJ1Y2tJdGVtLnNwZWVkLFxyXG4gICAgICBEaXN0YW5jZTogbWllbHNUb2Rpc3BhdGNoLFxyXG4gICAgICBDdXJyZW50SWRsZVRpbWU6IHRydWNrSXRlbS5pZGxlVGltZSxcclxuICAgICAgRVRBOiB0cnVja0l0ZW0udG90SWRsZVRpbWUsXHJcbiAgICAgIEVtYWlsOiAnJywvLyB0cnVja0l0ZW0uRW1haWwsXHJcbiAgICAgIE1vYmlsZTogJycsIC8vIHRydWNrSXRlbS5Nb2JpbGUsXHJcbiAgICAgIGljb246IGljb25VcmwsXHJcbiAgICAgIGljb25JbmZvOiBpbmZvQm94VHJ1Y2tVcmwsXHJcbiAgICAgIEN1cnJlbnRMYXQ6IHRydWNrSXRlbS5sYXQsXHJcbiAgICAgIEN1cnJlbnRMb25nOiB0cnVja0l0ZW0ubG9uZyxcclxuICAgICAgV1JMYXQ6IHRydWNrSXRlbS53ckxhdCxcclxuICAgICAgV1JMb25nOiB0cnVja0l0ZW0ud3JMb25nLFxyXG4gICAgICB0ZWNoSWRzOiB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLFxyXG4gICAgICBqb2JJZDogdHJ1Y2tJdGVtLmpvYklkLFxyXG4gICAgICBtYW5hZ2VySWRzOiB0aGlzLm1hbmFnZXJJZHMsXHJcbiAgICAgIHdvcmtBZGRyZXNzOiB0cnVja0l0ZW0ud29ya0FkZHJlc3MsXHJcbiAgICAgIHNiY1ZpbjogdHJ1Y2tJdGVtLnNiY1ZpbixcclxuICAgICAgY3VzdG9tZXJOYW1lOiB0cnVja0l0ZW0uY3VzdG9tZXJOYW1lLFxyXG4gICAgICB0ZWNobmljaWFuTmFtZTogdHJ1Y2tJdGVtLnRlY2huaWNpYW5OYW1lLFxyXG4gICAgICBkaXNwYXRjaFRpbWU6IHRydWNrSXRlbS5kaXNwYXRjaFRpbWUsXHJcbiAgICAgIHJlZ2lvbjogdHJ1Y2tJdGVtLnpvbmVcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGpvYklkU3RyaW5nID0gJ2h0dHA6Ly9lZGdlLWVkdC5pdC5hdHQuY29tL2NnaS1iaW4vZWR0X2pvYmluZm8uY2dpPyc7XHJcblxyXG4gICAgbGV0IHpvbmUgPSB0cnVja0l0ZW0uem9uZTtcclxuXHJcbiAgICAvLyA9IE0gZm9yIE1XXHJcbiAgICAvLyA9IFcgZm9yIFdlc3RcclxuICAgIC8vID0gQiBmb3IgU0VcclxuICAgIC8vID0gUyBmb3IgU1dcclxuICAgIGlmICh6b25lICE9IG51bGwgJiYgem9uZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgaWYgKHpvbmUgPT09ICdNVycpIHtcclxuICAgICAgICB6b25lID0gJ00nO1xyXG4gICAgICB9IGVsc2UgaWYgKHpvbmUgPT09ICdTRScpIHtcclxuICAgICAgICB6b25lID0gJ0InXHJcbiAgICAgIH0gZWxzZSBpZiAoem9uZSA9PT0gJ1NXJykge1xyXG4gICAgICAgIHpvbmUgPSAnUydcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgem9uZSA9ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIGpvYklkU3RyaW5nID0gam9iSWRTdHJpbmcgKyAnZWR0X3JlZ2lvbj0nICsgem9uZSArICcmd3JpZD0nICsgdHJ1Y2tJdGVtLndySUQ7XHJcblxyXG4gICAgdHJ1Y2tJdGVtLmpvYklkID0gdHJ1Y2tJdGVtLmpvYklkID09IHVuZGVmaW5lZCB8fCB0cnVja0l0ZW0uam9iSWQgPT0gbnVsbCA/ICcnIDogdHJ1Y2tJdGVtLmpvYklkO1xyXG5cclxuICAgIGlmICh0cnVja0l0ZW0uam9iSWQgIT0gJycpIHtcclxuICAgICAgam9iSWRVcmwgPSAnPGEgaHJlZj1cIicgKyBqb2JJZFN0cmluZyArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIiB0aXRsZT1cIkNsaWNrIGhlcmUgdG8gc2VlIGFjdHVhbCBGb3JjZS9FZGdlIGpvYiBkYXRhXCI+JyArIHRydWNrSXRlbS5qb2JJZCArICc8L2E+JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSBudWxsICYmIHRydWNrSXRlbS5kaXNwYXRjaFRpbWUgIT0gdW5kZWZpbmVkICYmIHRydWNrSXRlbS5kaXNwYXRjaFRpbWUgIT0gJycpIHtcclxuICAgICAgbGV0IGRpc3BhdGNoRGF0ZSA9IHRydWNrSXRlbS5kaXNwYXRjaFRpbWUuc3BsaXQoJzonKTtcclxuICAgICAgbGV0IGR0ID0gZGlzcGF0Y2hEYXRlWzBdICsgJyAnICsgZGlzcGF0Y2hEYXRlWzFdICsgJzonICsgZGlzcGF0Y2hEYXRlWzJdICsgJzonICsgZGlzcGF0Y2hEYXRlWzNdO1xyXG4gICAgICBtZXRhZGF0YS5kaXNwYXRjaFRpbWUgPSB0aGF0LlVUQ1RvVGltZVpvbmUoZHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFVwZGF0ZSBpbiB0aGUgVHJ1Y2tXYXRjaExpc3Qgc2Vzc2lvblxyXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykgIT09IG51bGwpIHtcclxuICAgICAgdGhpcy50cnVja0xpc3QgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykpO1xyXG5cclxuICAgICAgaWYgKHRoaXMudHJ1Y2tMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICBpZiAodGhpcy50cnVja0xpc3Quc29tZSh4ID0+IHgudHJ1Y2tJZCA9PSB0cnVja0l0ZW0udHJ1Y2tJZCkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnRydWNrTGlzdC5maW5kKHggPT4geC50cnVja0lkID09IHRydWNrSXRlbS50cnVja0lkKTtcclxuICAgICAgICAgIGNvbnN0IGluZGV4OiBudW1iZXIgPSB0aGlzLnRydWNrTGlzdC5pbmRleE9mKGl0ZW0pO1xyXG4gICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpdGVtLkRpc3RhbmNlID0gbWV0YWRhdGEuRGlzdGFuY2U7XHJcbiAgICAgICAgICAgIGl0ZW0uaWNvbiA9IG1ldGFkYXRhLmljb247XHJcbiAgICAgICAgICAgIHRoaXMudHJ1Y2tMaXN0LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMudHJ1Y2tMaXN0LnNwbGljZShpbmRleCwgMCwgaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja1dhdGNoTGlzdCcsIHRoaXMudHJ1Y2tMaXN0KTtcclxuICAgICAgICAgICAgaXRlbSA9IG51bGw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXBkYXRlIGluIHRoZSBTZWxlY3RlZFRydWNrIHNlc3Npb25cclxuICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja0RldGFpbHMnKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcclxuICAgICAgc2VsZWN0ZWRUcnVjayA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tEZXRhaWxzJykpO1xyXG5cclxuICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrLnRydWNrSWQgPT0gdHJ1Y2tJdGVtLnRydWNrSWQpIHtcclxuICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ1RydWNrRGV0YWlscycpO1xyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrRGV0YWlscycsIG1ldGFkYXRhKTtcclxuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRydWNrSXRlbXMubGVuZ3RoID4gMCAmJiB0aGlzLnRydWNrSXRlbXMuc29tZSh4ID0+IHgudG9Mb3dlckNhc2UoKSA9PSB0cnVja0l0ZW0udHJ1Y2tJZC50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICBpc05ld1RydWNrID0gZmFsc2U7XHJcbiAgICAgIC8vIElmIGl0IGlzIG5vdCBhIG5ldyB0cnVjayB0aGVuIG1vdmUgdGhlIHRydWNrIHRvIG5ldyBsb2NhdGlvblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RPZlB1c2hQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcclxuICAgICAgICBpZiAobGlzdE9mUHVzaFBpbnMuZ2V0KGkpLm1ldGFkYXRhLnRydWNrSWQgPT09IHRydWNrSXRlbS50cnVja0lkKSB7XHJcbiAgICAgICAgICB2YXIgY3VyUHVzaFBpbiA9IGxpc3RPZlB1c2hQaW5zLmdldChpKTtcclxuICAgICAgICAgIGN1clB1c2hQaW4ubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgICAgICAgIGRlc3RMb2MgPSBwaW5Mb2NhdGlvbjtcclxuICAgICAgICAgIHBpbkxvY2F0aW9uID0gbGlzdE9mUHVzaFBpbnMuZ2V0KGkpLmdldExvY2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgbGV0IHRydWNrSWRSYW5JZCA9IHRydWNrSXRlbS50cnVja0lkICsgJ18nICsgTWF0aC5yYW5kb20oKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5pbmRleE9mKHRydWNrSXRlbS50cnVja0lkKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25UcnVja0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5wdXNoKHRydWNrSWRSYW5JZCk7XHJcblxyXG4gICAgICAgICAgdGhpcy5sb2FkRGlyZWN0aW9ucyh0aGlzLCBwaW5Mb2NhdGlvbiwgZGVzdExvYywgaSwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50cnVja0l0ZW1zLnB1c2godHJ1Y2tJdGVtLnRydWNrSWQpO1xyXG4gICAgICBOZXdQaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihwaW5Mb2NhdGlvbiwgeyBpY29uOiB0cnVja1VybCB9KTtcclxuXHJcbiAgICAgIE5ld1Bpbi5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG4gICAgICB0aGlzLm1hcC5lbnRpdGllcy5wdXNoKE5ld1Bpbik7XHJcblxyXG4gICAgICB0aGlzLmRhdGFMYXllci5wdXNoKE5ld1Bpbik7XHJcbiAgICAgIGlmICh0aGlzLmlzTWFwTG9hZGVkKSB7XHJcbiAgICAgICAgdGhpcy5pc01hcExvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubWFwLnNldFZpZXcoeyBjZW50ZXI6IHBpbkxvY2F0aW9uLCB6b29tOiB0aGlzLmxhc3Rab29tTGV2ZWwgfSk7XHJcbiAgICAgICAgdGhhdC5sYXN0Wm9vbUxldmVsID0gdGhpcy5tYXAuZ2V0Wm9vbSgpO1xyXG4gICAgICAgIHRoYXQubGFzdExvY2F0aW9uID0gdGhpcy5tYXAuZ2V0Q2VudGVyKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ21vdXNlb3V0JywgKGUpID0+IHtcclxuICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7IHZpc2libGU6IGZhbHNlIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDEwMjQpIHtcclxuICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihOZXdQaW4sICdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgICAgICAgIHNob3dQb2ludGVyOiB0cnVlLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCAyMCksXHJcbiAgICAgICAgICAgIGh0bWxDb250ZW50OiAnPGRpdiBjbGFzcyA9IFwiaW5meSBpbmZ5TWFwcG9wdXBcIj4nXHJcbiAgICAgICAgICAgICAgKyBnZXRJbmZvQm94SFRNTChlLnRhcmdldC5tZXRhZGF0YSwgdGhpcy50aHJlc2hvbGRWYWx1ZSwgam9iSWRVcmwpICsgJzwvZGl2PidcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRoaXMudHJ1Y2tXYXRjaExpc3QgPSBbeyBUcnVja0lkOiBlLnRhcmdldC5tZXRhZGF0YS50cnVja0lkLCBEaXN0YW5jZTogZS50YXJnZXQubWV0YWRhdGEuRGlzdGFuY2UgfV07XHJcblxyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snLCBlLnRhcmdldC5tZXRhZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tEZXRhaWxzJywgZS50YXJnZXQubWV0YWRhdGEpO1xyXG5cclxuICAgICAgICAgIC8vIEEgYnVmZmVyIGxpbWl0IHRvIHVzZSB0byBzcGVjaWZ5IHRoZSBpbmZvYm94IG11c3QgYmUgYXdheSBmcm9tIHRoZSBlZGdlcyBvZiB0aGUgbWFwLlxyXG5cclxuICAgICAgICAgIHZhciBidWZmZXIgPSAzMDtcclxuICAgICAgICAgIHZhciBpbmZvYm94T2Zmc2V0ID0gdGhhdC5pbmZvYm94LmdldE9mZnNldCgpO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hBbmNob3IgPSB0aGF0LmluZm9ib3guZ2V0QW5jaG9yKCk7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveExvY2F0aW9uID0gbWFwcy50cnlMb2NhdGlvblRvUGl4ZWwoZS50YXJnZXQuZ2V0TG9jYXRpb24oKSwgTWljcm9zb2Z0Lk1hcHMuUGl4ZWxSZWZlcmVuY2UuY29udHJvbCk7XHJcbiAgICAgICAgICB2YXIgZHggPSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hPZmZzZXQueCAtIGluZm9ib3hBbmNob3IueDtcclxuICAgICAgICAgIHZhciBkeSA9IGluZm9ib3hMb2NhdGlvbi55IC0gMjUgLSBpbmZvYm94QW5jaG9yLnk7XHJcblxyXG4gICAgICAgICAgaWYgKGR5IDwgYnVmZmVyKSB7IC8vIEluZm9ib3ggb3ZlcmxhcHMgd2l0aCB0b3Agb2YgbWFwLlxyXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXHJcbiAgICAgICAgICAgIGR5ICo9IC0xO1xyXG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBidWZmZXIgZnJvbSB0aGUgdG9wIGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgZHkgKz0gYnVmZmVyO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeSBpcyBncmVhdGVyIHRoYW4gemVybyB0aGFuIGl0IGRvZXMgbm90IG92ZXJsYXAuXHJcbiAgICAgICAgICAgIGR5ID0gMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoZHggPCBidWZmZXIpIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggbGVmdCBzaWRlIG9mIG1hcC5cclxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxyXG4gICAgICAgICAgICBkeCAqPSAtMTtcclxuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgbGVmdCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgIGR4ICs9IGJ1ZmZlcjtcclxuICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIHJpZ2h0IHNpZGUgb2YgbWFwLlxyXG4gICAgICAgICAgICBkeCA9IG1hcHMuZ2V0V2lkdGgoKSAtIGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveEFuY2hvci54IC0gdGhhdC5pbmZvYm94LmdldFdpZHRoKCk7XHJcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHggaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhlbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxyXG4gICAgICAgICAgICBpZiAoZHggPiBidWZmZXIpIHtcclxuICAgICAgICAgICAgICBkeCA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICAgIGR4IC09IGJ1ZmZlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vICMjIyMgQWRqdXN0IHRoZSBtYXAgc28gaW5mb2JveCBpcyBpbiB2aWV3XHJcbiAgICAgICAgICBpZiAoZHggIT0gMCB8fCBkeSAhPSAwKSB7XHJcbiAgICAgICAgICAgIG1hcHMuc2V0Vmlldyh7XHJcbiAgICAgICAgICAgICAgY2VudGVyT2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoZHgsIGR5KSxcclxuICAgICAgICAgICAgICBjZW50ZXI6IG1hcHMuZ2V0Q2VudGVyKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcclxuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGlzLm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XHJcblxyXG4gICAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcclxuICAgICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5pbmZvYm94LCAnY2xpY2snLCB2aWV3VHJ1Y2tEZXRhaWxzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihOZXdQaW4sICdtb3VzZW92ZXInLCAoZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5pbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAgICAgICBzaG93UG9pbnRlcjogdHJ1ZSxcclxuICAgICAgICAgICAgbG9jYXRpb246IGUudGFyZ2V0LmdldExvY2F0aW9uKCksXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgb2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMCwgMjApLFxyXG4gICAgICAgICAgICBodG1sQ29udGVudDogJzxkaXYgY2xhc3MgPSBcImluZnkgaW5meU1hcHBvcHVwXCI+J1xyXG4gICAgICAgICAgICAgICsgZ2V0SW5mb0JveEhUTUwoZS50YXJnZXQubWV0YWRhdGEsIHRoaXMudGhyZXNob2xkVmFsdWUsIGpvYklkVXJsKSArICc8L2Rpdj4nXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLnRydWNrV2F0Y2hMaXN0ID0gW3sgVHJ1Y2tJZDogZS50YXJnZXQubWV0YWRhdGEudHJ1Y2tJZCwgRGlzdGFuY2U6IGUudGFyZ2V0Lm1ldGFkYXRhLkRpc3RhbmNlIH1dO1xyXG5cclxuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJywgZS50YXJnZXQubWV0YWRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrRGV0YWlscycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcclxuXHJcbiAgICAgICAgICAvLyBBIGJ1ZmZlciBsaW1pdCB0byB1c2UgdG8gc3BlY2lmeSB0aGUgaW5mb2JveCBtdXN0IGJlIGF3YXkgZnJvbSB0aGUgZWRnZXMgb2YgdGhlIG1hcC5cclxuXHJcbiAgICAgICAgICB2YXIgYnVmZmVyID0gMzA7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveE9mZnNldCA9IHRoYXQuaW5mb2JveC5nZXRPZmZzZXQoKTtcclxuICAgICAgICAgIHZhciBpbmZvYm94QW5jaG9yID0gdGhhdC5pbmZvYm94LmdldEFuY2hvcigpO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hMb2NhdGlvbiA9IG1hcHMudHJ5TG9jYXRpb25Ub1BpeGVsKGUudGFyZ2V0LmdldExvY2F0aW9uKCksIE1pY3Jvc29mdC5NYXBzLlBpeGVsUmVmZXJlbmNlLmNvbnRyb2wpO1xyXG4gICAgICAgICAgdmFyIGR4ID0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94T2Zmc2V0LnggLSBpbmZvYm94QW5jaG9yLng7XHJcbiAgICAgICAgICB2YXIgZHkgPSBpbmZvYm94TG9jYXRpb24ueSAtIDI1IC0gaW5mb2JveEFuY2hvci55O1xyXG5cclxuICAgICAgICAgIGlmIChkeSA8IGJ1ZmZlcikgeyAvLyBJbmZvYm94IG92ZXJsYXBzIHdpdGggdG9wIG9mIG1hcC5cclxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxyXG4gICAgICAgICAgICBkeSAqPSAtMTtcclxuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYnVmZmVyIGZyb20gdGhlIHRvcCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgIGR5ICs9IGJ1ZmZlcjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHkgaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhhbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxyXG4gICAgICAgICAgICBkeSA9IDA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGR4IDwgYnVmZmVyKSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIGxlZnQgc2lkZSBvZiBtYXAuXHJcbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cclxuICAgICAgICAgICAgZHggKj0gLTE7XHJcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIGxlZnQgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICBkeCArPSBidWZmZXI7XHJcbiAgICAgICAgICB9IGVsc2UgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCByaWdodCBzaWRlIG9mIG1hcC5cclxuICAgICAgICAgICAgZHggPSBtYXBzLmdldFdpZHRoKCkgLSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hBbmNob3IueCAtIHRoYXQuaW5mb2JveC5nZXRXaWR0aCgpO1xyXG4gICAgICAgICAgICAvLyAjIyMjIElmIGR4IGlzIGdyZWF0ZXIgdGhhbiB6ZXJvIHRoZW4gaXQgZG9lcyBub3Qgb3ZlcmxhcC5cclxuICAgICAgICAgICAgaWYgKGR4ID4gYnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgZHggPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgICBkeCAtPSBidWZmZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyAjIyMjIEFkanVzdCB0aGUgbWFwIHNvIGluZm9ib3ggaXMgaW4gdmlld1xyXG4gICAgICAgICAgaWYgKGR4ICE9IDAgfHwgZHkgIT0gMCkge1xyXG4gICAgICAgICAgICBtYXBzLnNldFZpZXcoe1xyXG4gICAgICAgICAgICAgIGNlbnRlck9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KGR4LCBkeSksXHJcbiAgICAgICAgICAgICAgY2VudGVyOiBtYXBzLmdldENlbnRlcigpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XHJcbiAgICAgICAgICBzZWxlY3RlZFRydWNrID0gdGhpcy5tYXBTZXJ2aWNlLnJldHJpZXZlRGF0YUZyb21TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycpO1xyXG5cclxuICAgICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXHJcbiAgICAgICAgICAgICAgeCA9PiB4LmF0dHVpZC50b0xvd2VyQ2FzZSgpID09IHNlbGVjdGVkVHJ1Y2suQVRUVUlELnRvTG93ZXJDYXNlKCkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhblBob25lID0gdGVjaG5pY2lhbkRldGFpbHMucGhvbmU7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMuaW5mb2JveCwgJ2NsaWNrJywgdmlld1RydWNrRGV0YWlscyk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihtYXBzLCAndmlld2NoYW5nZScsIG1hcFZpZXdDaGFuZ2VkKTtcclxuXHJcbiAgICAgIC8vIHRoaXMuQ2hhbmdlVHJ1Y2tEaXJlY3Rpb24odGhpcywgTmV3UGluLCBkZXN0TG9jLCB0cnVja1VybCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWFwVmlld0NoYW5nZWQoZSkge1xyXG4gICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSBtYXBzLmdldFpvb20oKTtcclxuICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSBtYXBzLmdldENlbnRlcigpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gbW91c2V3aGVlbENoYW5nZWQoZSkge1xyXG4gICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSBtYXBzLmdldFpvb20oKTtcclxuICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSBtYXBzLmdldENlbnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEluZm9Cb3hIVE1MKGRhdGE6IGFueSwgdFZhbHVlLCBqb2JJZCk6IFN0cmluZyB7XHJcblxyXG4gICAgICBpZiAoIWRhdGEuU3BlZWQpIHtcclxuICAgICAgICBkYXRhLlNwZWVkID0gMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNsYXNzTmFtZSA9IFwiXCI7XHJcbiAgICAgIHZhciBzdHlsZUxlZnQgPSBcIlwiO1xyXG4gICAgICB2YXIgcmVhc29uID0gJyc7XHJcbiAgICAgIGlmIChkYXRhLnRydWNrU3RhdHVzICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChkYXRhLnRydWNrU3RhdHVzLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3JlZCcpIHtcclxuICAgICAgICAgIHJlYXNvbiA9IFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLXRvcDozcHg7Y29sb3I6cmVkOyc+UmVhc29uOiBDdW11bGF0aXZlIGlkbGUgdGltZSBpcyBiZXlvbmQgXCIgKyB0VmFsdWUgKyBcIiBtaW5zPC9kaXY+XCI7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLnRydWNrU3RhdHVzLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3B1cnBsZScpIHtcclxuICAgICAgICAgIHJlYXNvbiA9IFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLXRvcDozcHg7Y29sb3I6cHVycGxlOyc+UmVhc29uOiBUcnVjayBpcyBkcml2ZW4gZ3JlYXRlciB0aGFuIDc1IG0vaDwvZGl2PlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGluZm9ib3hEYXRhID0gJyc7XHJcblxyXG4gICAgICBkYXRhLmN1c3RvbWVyTmFtZSA9IGRhdGEuY3VzdG9tZXJOYW1lID09IHVuZGVmaW5lZCB8fCBkYXRhLmN1c3RvbWVyTmFtZSA9PSBudWxsID8gJycgOiBkYXRhLmN1c3RvbWVyTmFtZTtcclxuXHJcbiAgICAgIGRhdGEuZGlzcGF0Y2hUaW1lID0gZGF0YS5kaXNwYXRjaFRpbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEuZGlzcGF0Y2hUaW1lID09IG51bGwgPyAnJyA6IGRhdGEuZGlzcGF0Y2hUaW1lO1xyXG5cclxuICAgICAgZGF0YS5qb2JJZCA9IGRhdGEuam9iSWQgPT0gdW5kZWZpbmVkIHx8IGRhdGEuam9iSWQgPT0gbnVsbCA/ICcnIDogZGF0YS5qb2JJZDtcclxuXHJcbiAgICAgIGRhdGEud29ya0FkZHJlc3MgPSBkYXRhLndvcmtBZGRyZXNzID09IHVuZGVmaW5lZCB8fCBkYXRhLndvcmtBZGRyZXNzID09IG51bGwgPyAnJyA6IGRhdGEud29ya0FkZHJlc3M7XHJcblxyXG4gICAgICBkYXRhLnNiY1ZpbiA9IGRhdGEuc2JjVmluID09IHVuZGVmaW5lZCB8fCBkYXRhLnNiY1ZpbiA9PSBudWxsIHx8IGRhdGEuc2JjVmluID09ICcnID8gJycgOiBkYXRhLnNiY1ZpbjtcclxuXHJcbiAgICAgIGRhdGEudGVjaG5pY2lhbk5hbWUgPSBkYXRhLnRlY2huaWNpYW5OYW1lID09IHVuZGVmaW5lZCB8fCBkYXRhLnRlY2huaWNpYW5OYW1lID09IG51bGwgfHwgZGF0YS50ZWNobmljaWFuTmFtZSA9PSAnJyA/ICcnIDogZGF0YS50ZWNobmljaWFuTmFtZTtcclxuXHJcbiAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDEwMjQpIHtcclxuICAgICAgICBpbmZvYm94RGF0YSA9IFwiPGRpdiBjbGFzcz0ncG9wTW9kYWxDb250YWluZXInPjxkaXYgY2xhc3M9J3BvcE1vZGFsSGVhZGVyJz48aW1nIHNyYz0nXCIgKyBkYXRhLmljb25JbmZvICsgXCInID48YSBjbGFzcz0nZGV0YWlscycgdGl0bGU9J0NsaWNrIGhlcmUgdG8gc2VlIHRlY2huaWNpYW4gZGV0YWlscycgPlZpZXcgRGV0YWlsczwvYT48aSBjbGFzcz0nZmEgZmEtdGltZXMnIGFyaWEtaGlkZGVuPSd0cnVlJyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz48L2k+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8aHIvPjxkaXYgY2xhc3M9J3BvcE1vZGFsQm9keSc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5WZWhpY2xlIE51bWJlciA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLnNiY1ZpbiArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5WVFMgVW5pdCBJRCA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLnRydWNrSWQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Sm9iIFR5cGUgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5qb2JUeXBlICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkpvYiBJZCA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBqb2JJZCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5BVFRVSUQgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5BVFRVSUQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+VGVjaG5pY2lhbiBOYW1lIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEudGVjaG5pY2lhbk5hbWUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Q3VzdG9tZXIgTmFtZSA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmN1c3RvbWVyTmFtZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5EaXNwYXRjaCBUaW1lOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5kaXNwYXRjaFRpbWUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC0xMic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wtMTIgY29sLXNtLTEyIGNvbC1mb3JtLWxhYmVsJz5Kb2IgQWRkcmVzcyA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wtMTIgY29sLXNtLTEyJz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwgY29sLWZvcm0tbGFiZWwtZnVsbCc+XCIgKyBkYXRhLndvcmtBZGRyZXNzICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3JvdyBtZXRlckNhbCc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyBkYXRhLlNwZWVkICsgXCI8L3N0cm9uZz4gbXBoIDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPlNwZWVkPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLTEyIGNvbC1tZC00Jz48c3Ryb25nPlwiICsgZGF0YS5FVEEgKyBcIjwvc3Ryb25nPiBNaW5zIDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkN1bXVsYXRpdmUgSWRsZSBNaW51dGVzPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLTEyIGNvbC1tZC00Jz48c3Ryb25nPlwiICsgdGhhdC5jb252ZXJ0TWlsZXNUb0ZlZXQoZGF0YS5EaXN0YW5jZSkgKyBcIjwvc3Ryb25nPiBGdCA8c3BhbiBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5GZWV0IHRvIEpvYiBTaXRlPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj4gPGhyLz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3BvcE1vZGFsRm9vdGVyJz48ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtY29tbWVudGluZyc+PC9pPjxzcGFuIGNsYXNzPSdzbXMnIHRpdGxlPSdDbGljayB0byBzZW5kIFNNUycgPlNNUzwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbCBjb2wtbWQtNCc+PGkgY2xhc3M9J2ZhIGZhLWVudmVsb3BlJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxzcGFuIGNsYXNzPSdlbWFpbCcgdGl0bGU9J0NsaWNrIHRvIHNlbmQgZW1haWwnID5FbWFpbDwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbCBjb2wtbWQtNCc+PGkgY2xhc3M9J2ZhIGZhLWV5ZScgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48c3BhbiBjbGFzcz0nd2F0Y2hsaXN0JyB0aXRsZT0nQ2xpY2sgdG8gYWRkIGluIHdhdGNobGlzdCcgPldhdGNoPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+IDwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCI7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluZm9ib3hEYXRhID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdwYWRkaW5nLXRvcDoxMHB4O21hcmdpbjogMHB4Oyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtMyc+PGRpdiBzdHlsZT0ncGFkZGluZy10b3A6MTVweDsnID48aW1nIHNyYz0nXCIgKyBkYXRhLmljb25JbmZvICsgXCInIHN0eWxlPSdkaXNwbGF5OiBibG9jazttYXJnaW46IDAgYXV0bzsnID48L2Rpdj48L2Rpdj5cIiArXHJcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J2NvbC1tZC05Jz5cIiArXHJcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdyAnPlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTgnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+VmVoaWNsZSBOdW1iZXI8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5zYmNWaW4gKyBcIjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTQnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxhIGNsYXNzPSdkZXRhaWxzJyBzdHlsZT0nY29sb3I6IzAwOUZEQjtjdXJzb3I6IHBvaW50ZXI7JyAgdGl0bGU9J0NsaWNrIGhlcmUgdG8gc2VlIHRlY2huaWNpYW4gZGV0YWlscycgPlZpZXcgRGV0YWlsczwvYT48aSBjbGFzcz0nZmEgZmEtdGltZXMnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweDtjdXJzb3I6IHBvaW50ZXI7JyBhcmlhLWhpZGRlbj0ndHJ1ZScgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+PC9pPjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnPjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5WVFMgVW5pdCBJRDwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLnRydWNrSWQgKyBcIjwvZGl2PjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncm93Jz48ZGl2IGNsYXNzPSdjb2wtbWQtNScgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5Kb2IgVHlwZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmpvYlR5cGUgKyBcIjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC03JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnID5Kb2IgSWQ8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgam9iSWQgKyBcIjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIHJlYXNvbiArIFwiPC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7Jz48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkFUVFVJRDwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLkFUVFVJRCArIFwiPHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7bWFyZ2luLWxlZnQ6OHB4Oyc+VGVjaG5pY2lhbiBOYW1lPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEudGVjaG5pY2lhbk5hbWUgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7JyA+XCJcclxuICAgICAgICAgICsgXCI8ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+Q3VzdG9tZXIgTmFtZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmN1c3RvbWVyTmFtZSArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4OycgPlwiXHJcbiAgICAgICAgICArIFwiPGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkRpc3BhdGNoIFRpbWU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5kaXNwYXRjaFRpbWUgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnID5cIlxyXG4gICAgICAgICAgKyBcIjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5Kb2IgQWRkcmVzczwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLndvcmtBZGRyZXNzICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGhyIHN0eWxlPSdtYXJnaW4tdG9wOjFweDsgbWFyZ2luLWJvdHRvbTo1cHg7JyAvPlwiXHJcblxyXG4gICAgICAgICAgKyBcIjxkaXYgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Oyc+IDxkaXYgY2xhc3M9J3Jvdyc+IDxkaXYgY2xhc3M9J3NwZWVkIGNvbC1tZC0zJz4gPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDFweCc+PHAgc3R5bGU9J2ZvbnQtd2VpZ2h0OiBib2xkZXI7Zm9udC1zaXplOiAyM3B4O21hcmdpbjogMHB4Oyc+XCIgKyBkYXRhLlNwZWVkICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+bXBoPC9wPjwvZGl2PjxwIHN0eWxlPSdtYXJnaW46MHB4JyBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5TcGVlZDwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2lkbGUgY29sLW1kLTUnPjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIGRhdGEuRVRBICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+TWluczwvcD48L2Rpdj48cCBzdHlsZT0nbWFyZ2luOjBweCcgY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+Q3VtdWxhdGl2ZSBJZGxlIE1pbnV0ZXM8L3A+PC9kaXY+IDxkaXYgY2xhc3M9J21pbGVzIGNvbC1tZC00Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIHRoYXQuY29udmVydE1pbGVzVG9GZWV0KGRhdGEuRGlzdGFuY2UpICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+RnQ8L3A+PC9kaXY+PHAgc3R5bGU9J21hcmdpbjowcHgnIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkZlZXQgdG8gSm9iIFNpdGU8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj48L2Rpdj48aHIgc3R5bGU9J21hcmdpbi10b3A6MXB4OyBtYXJnaW4tYm90dG9tOjVweDsnIC8+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPiA8ZGl2IGNsYXNzPSdjb2wtbWQtMSc+PC9kaXY+PGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zJyBzdHlsZT0nXCIgKyBjbGFzc05hbWUgKyBcIic+IDxpIGNsYXNzPSdmYSBmYS1jb21tZW50aW5nIGNvbC1tZC0yJz48L2k+PHAgY2xhc3M9J2NvbC1tZC02IHNtcycgdGl0bGU9J0NsaWNrIHRvIHNlbmQgU01TJyA+U01TPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zIG9mZnNldC1tZC0xJyBzdHlsZT0nXCIgKyBjbGFzc05hbWUgKyBcIic+IDxpIGNsYXNzPSdmYSBmYS1lbnZlbG9wZSBjb2wtbWQtMicgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgZW1haWwnIHRpdGxlPSdDbGljayB0byBzZW5kIGVtYWlsJyA+RW1haWw8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zJyBzdHlsZT0nXCIgKyBzdHlsZUxlZnQgKyBcIic+PGkgY2xhc3M9J2ZhIGZhLWV5ZSBjb2wtbWQtMicgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgd2F0Y2hsaXN0JyB0aXRsZT0nQ2xpY2sgdG8gYWRkIGluIHdhdGNobGlzdCcgPldhdGNoPC9wPjwvZGl2PiA8L2Rpdj5cIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGluZm9ib3hEYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpZXdUcnVja0RldGFpbHMoZSkge1xyXG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdmYSBmYS10aW1lcycpIHtcclxuICAgICAgICB0aGF0LmluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2RldGFpbHMnKSB7XHJcbiAgICAgICAgLy90aGF0LnJvdXRlci5uYXZpZ2F0ZShbJy90ZWNobmljaWFuLWRldGFpbHMnXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2NvbC1tZC02IHNtcycpIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGF0Lm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XHJcblxyXG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcclxuICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhhdC5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxyXG4gICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGpRdWVyeSgnI215TW9kYWxTTVMnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdjb2wtbWQtNiBlbWFpbCcpIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGF0Lm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XHJcblxyXG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcclxuICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhhdC5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxyXG4gICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcclxuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGpRdWVyeSgnI215TW9kYWxFbWFpbCcpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgIH1cclxuICAgICBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvYWREaXJlY3Rpb25zKHRoYXQsIHN0YXJ0TG9jLCBlbmRMb2MsIGluZGV4LCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKSB7XHJcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuRGlyZWN0aW9uc01hbmFnZXIodGhhdC5tYXApO1xyXG4gICAgICAvLyBTZXQgUm91dGUgTW9kZSB0byBkcml2aW5nXHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuc2V0UmVxdWVzdE9wdGlvbnMoe1xyXG4gICAgICAgIHJvdXRlTW9kZTogTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5Sb3V0ZU1vZGUuZHJpdmluZ1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5zZXRSZW5kZXJPcHRpb25zKHtcclxuICAgICAgICBkcml2aW5nUG9seWxpbmVPcHRpb25zOiB7XHJcbiAgICAgICAgICBzdHJva2VDb2xvcjogJ2dyZWVuJyxcclxuICAgICAgICAgIHN0cm9rZVRoaWNrbmVzczogMyxcclxuICAgICAgICAgIHZpc2libGU6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3YXlwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IGZhbHNlIH0sXHJcbiAgICAgICAgdmlhcG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiBmYWxzZSB9LFxyXG4gICAgICAgIGF1dG9VcGRhdGVNYXBWaWV3OiBmYWxzZVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IHdheXBvaW50MSA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLldheXBvaW50KHtcclxuICAgICAgICBsb2NhdGlvbjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHN0YXJ0TG9jLmxhdGl0dWRlLCBzdGFydExvYy5sb25naXR1ZGUpLCBpY29uOiAnJ1xyXG4gICAgICB9KTtcclxuICAgICAgY29uc3Qgd2F5cG9pbnQyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuV2F5cG9pbnQoe1xyXG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZW5kTG9jLmxhdGl0dWRlLCBlbmRMb2MubG9uZ2l0dWRlKVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5hZGRXYXlwb2ludCh3YXlwb2ludDEpO1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50Mik7XHJcblxyXG4gICAgICAvLyBBZGQgZXZlbnQgaGFuZGxlciB0byBkaXJlY3Rpb25zIG1hbmFnZXIuXHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMuZGlyZWN0aW9uc01hbmFnZXIsICdkaXJlY3Rpb25zVXBkYXRlZCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy8gY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgdmFyIHJvdXRlSW5kZXggPSBlLnJvdXRlWzBdLnJvdXRlTGVnc1swXS5vcmlnaW5hbFJvdXRlSW5kZXg7XHJcbiAgICAgICAgdmFyIG5leHRJbmRleCA9IHJvdXRlSW5kZXg7XHJcbiAgICAgICAgaWYgKGUucm91dGVbMF0ucm91dGVQYXRoLmxlbmd0aCA+IHJvdXRlSW5kZXgpIHtcclxuICAgICAgICAgIG5leHRJbmRleCA9IHJvdXRlSW5kZXggKyAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV4dExvY2F0aW9uID0gZS5yb3V0ZVswXS5yb3V0ZVBhdGhbbmV4dEluZGV4XTtcclxuICAgICAgICB2YXIgcGluID0gdGhhdC5tYXAuZW50aXRpZXMuZ2V0KGluZGV4KTtcclxuICAgICAgICAvLyB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhzdGFydExvYyxuZXh0TG9jYXRpb24pO1xyXG4gICAgICAgIHRoYXQuTW92ZVBpbk9uRGlyZWN0aW9uKHRoYXQsIGUucm91dGVbMF0ucm91dGVQYXRoLCBwaW4sIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuY2FsY3VsYXRlRGlyZWN0aW9ucygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBNb3ZlUGluT25EaXJlY3Rpb24odGhhdCwgcm91dGVQYXRoLCBwaW4sIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpIHtcclxuICAgIHRoYXQgPSB0aGlzO1xyXG4gICAgdmFyIGlzR2VvZGVzaWMgPSBmYWxzZTtcclxuICAgIHRoYXQuY3VycmVudEFuaW1hdGlvbiA9IG5ldyBCaW5nLk1hcHMuQW5pbWF0aW9ucy5QYXRoQW5pbWF0aW9uKHJvdXRlUGF0aCwgZnVuY3Rpb24gKGNvb3JkLCBpZHgsIGZyYW1lSWR4LCByb3RhdGlvbkFuZ2xlLCBsb2NhdGlvbnMsIHRydWNrSWRSYW5JZCkge1xyXG5cclxuICAgICAgaWYgKHRoYXQuYW5pbWF0aW9uVHJ1Y2tMaXN0Lmxlbmd0aCA+IDAgJiYgdGhhdC5hbmltYXRpb25UcnVja0xpc3Quc29tZSh4ID0+IHggPT0gdHJ1Y2tJZFJhbklkKSkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IChmcmFtZUlkeCA9PSBsb2NhdGlvbnMubGVuZ3RoIC0gMSkgPyBmcmFtZUlkeCA6IGZyYW1lSWR4ICsgMTtcclxuICAgICAgICB2YXIgcm90YXRpb25BbmdsZSA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhjb29yZCwgbG9jYXRpb25zW2luZGV4XSk7XHJcbiAgICAgICAgaWYgKHRoYXQuaXNPZGQoZnJhbWVJZHgpKSB7XHJcbiAgICAgICAgICB0aGF0LmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4ocGluLCB0cnVja1VybCwgcm90YXRpb25BbmdsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGZyYW1lSWR4ID09IGxvY2F0aW9ucy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICB0aGF0LmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4ocGluLCB0cnVja1VybCwgcm90YXRpb25BbmdsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBpbi5zZXRMb2NhdGlvbihjb29yZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9LCBpc0dlb2Rlc2ljLCB0aGF0LnRyYXZhbER1cmF0aW9uLCB0cnVja0lkUmFuSWQpO1xyXG5cclxuICAgIHRoYXQuY3VycmVudEFuaW1hdGlvbi5wbGF5KCk7XHJcbiAgfVxyXG5cclxuICBDYWxjdWxhdGVOZXh0Q29vcmQoc3RhcnRMb2NhdGlvbiwgZW5kTG9jYXRpb24pIHtcclxuICAgIHRyeSB7XHJcblxyXG4gICAgICB2YXIgZGxhdCA9IChlbmRMb2NhdGlvbi5sYXRpdHVkZSAtIHN0YXJ0TG9jYXRpb24ubGF0aXR1ZGUpO1xyXG4gICAgICB2YXIgZGxvbiA9IChlbmRMb2NhdGlvbi5sb25naXR1ZGUgLSBzdGFydExvY2F0aW9uLmxvbmdpdHVkZSk7XHJcbiAgICAgIHZhciBhbHBoYSA9IE1hdGguYXRhbjIoZGxhdCAqIE1hdGguUEkgLyAxODAsIGRsb24gKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgdmFyIGR4ID0gMC4wMDAxNTIzODc5NDcyNzkwOTkzMTtcclxuICAgICAgZGxhdCA9IGR4ICogTWF0aC5zaW4oYWxwaGEpO1xyXG4gICAgICBkbG9uID0gZHggKiBNYXRoLmNvcyhhbHBoYSk7XHJcbiAgICAgIHZhciBuZXh0Q29vcmQgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oc3RhcnRMb2NhdGlvbi5sYXRpdHVkZSArIGRsYXQsIHN0YXJ0TG9jYXRpb24ubG9uZ2l0dWRlICsgZGxvbik7XHJcblxyXG4gICAgICBkbGF0ID0gbnVsbDtcclxuICAgICAgZGxvbiA9IG51bGw7XHJcbiAgICAgIGFscGhhID0gbnVsbDtcclxuICAgICAgZHggPSBudWxsO1xyXG5cclxuICAgICAgcmV0dXJuIG5leHRDb29yZDtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBpbiBDYWxjdWxhdGVOZXh0Q29vcmQgLSAnICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNPZGQobnVtKSB7XHJcbiAgICByZXR1cm4gbnVtICUgMjtcclxuICB9XHJcblxyXG4gIGRlZ1RvUmFkKHgpIHtcclxuICAgIHJldHVybiB4ICogTWF0aC5QSSAvIDE4MDtcclxuICB9XHJcblxyXG4gIHJhZFRvRGVnKHgpIHtcclxuICAgIHJldHVybiB4ICogMTgwIC8gTWF0aC5QSTtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZUJlYXJpbmcob3JpZ2luLCBkZXN0KSB7XHJcbiAgICAvLy8gPHN1bW1hcnk+Q2FsY3VsYXRlcyB0aGUgYmVhcmluZyBiZXR3ZWVuIHR3byBsb2FjYXRpb25zLjwvc3VtbWFyeT5cclxuICAgIC8vLyA8cGFyYW0gbmFtZT1cIm9yaWdpblwiIHR5cGU9XCJNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvblwiPkluaXRpYWwgbG9jYXRpb24uPC9wYXJhbT5cclxuICAgIC8vLyA8cGFyYW0gbmFtZT1cImRlc3RcIiB0eXBlPVwiTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb25cIj5TZWNvbmQgbG9jYXRpb24uPC9wYXJhbT5cclxuICAgIHRyeSB7XHJcbiAgICAgIHZhciBsYXQxID0gdGhpcy5kZWdUb1JhZChvcmlnaW4ubGF0aXR1ZGUpO1xyXG4gICAgICB2YXIgbG9uMSA9IG9yaWdpbi5sb25naXR1ZGU7XHJcbiAgICAgIHZhciBsYXQyID0gdGhpcy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlKTtcclxuICAgICAgdmFyIGxvbjIgPSBkZXN0LmxvbmdpdHVkZTtcclxuICAgICAgdmFyIGRMb24gPSB0aGlzLmRlZ1RvUmFkKGxvbjIgLSBsb24xKTtcclxuICAgICAgdmFyIHkgPSBNYXRoLnNpbihkTG9uKSAqIE1hdGguY29zKGxhdDIpO1xyXG4gICAgICB2YXIgeCA9IE1hdGguY29zKGxhdDEpICogTWF0aC5zaW4obGF0MikgLSBNYXRoLnNpbihsYXQxKSAqIE1hdGguY29zKGxhdDIpICogTWF0aC5jb3MoZExvbik7XHJcblxyXG4gICAgICBsYXQxID0gbGF0MiA9IGxvbjEgPSBsb24yID0gZExvbiA9IG51bGw7XHJcblxyXG4gICAgICByZXR1cm4gKHRoaXMucmFkVG9EZWcoTWF0aC5hdGFuMih5LCB4KSkgKyAzNjApICUgMzYwO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIGNhbGN1bGF0ZUJlYXJpbmcgLSAnICsgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgU2VuZFNNUyhmb3JtKSB7XHJcbiAgICAvLyBpZih0aGlzLnRlY2huaWNpYW5QaG9uZSAhPSAnJyl7XHJcbiAgICBpZiAoZm9ybS52YWx1ZS5tb2JpbGVObyAhPSAnJykge1xyXG4gICAgICBpZiAoY29uZmlybSgnQXJlIHlvdSBzdXJlIHdhbnQgdG8gc2VuZCBTTVM/JykpIHtcclxuICAgICAgICAvLyB0aGlzLm1hcFNlcnZpY2Uuc2VuZFNNUyh0aGlzLnRlY2huaWNpYW5QaG9uZSxmb3JtLnZhbHVlLnNtc01lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMubWFwU2VydmljZS5zZW5kU01TKGZvcm0udmFsdWUubW9iaWxlTm8sIGZvcm0udmFsdWUuc21zTWVzc2FnZSk7XHJcblxyXG4gICAgICAgIGZvcm0uY29udHJvbHMuc21zTWVzc2FnZS5yZXNldCgpXHJcbiAgICAgICAgZm9ybS52YWx1ZS5tb2JpbGVObyA9IHRoaXMudGVjaG5pY2lhblBob25lO1xyXG4gICAgICAgIGpRdWVyeSgnI215TW9kYWxTTVMnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIuc3VjY2VzcygnU01TIHNlbnQgc3VjY2Vzc2Z1bGx5JywgJ1N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIFNlbmRFbWFpbChmb3JtKSB7XHJcbiAgICAvLyBpZih0aGlzLnRlY2huaWNpYW5FbWFpbCAhPSAnJyl7XHJcbiAgICBpZiAoZm9ybS52YWx1ZS5lbWFpbElkICE9ICcnKSB7XHJcbiAgICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgd2FudCB0byBzZW5kIEVtYWlsPycpKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXNlclByb2ZpbGVTZXJ2aWNlLmdldFVzZXJEYXRhKHRoaXMuY29va2llQVRUVUlEKVxyXG4gICAgICAgIC8vICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgIC8vICAgICB2YXIgbmV3RGF0YTogYW55ID0gdGhpcy5zdHJpbmdpZnlKc29uKGRhdGEpO1xyXG4gICAgICAgIC8vICAgICAvL3RoaXMubWFwU2VydmljZS5zZW5kRW1haWwobmV3RGF0YS5lbWFpbCx0aGlzLnRlY2huaWNpYW5FbWFpbCxuZXdEYXRhLmxhc3ROYW1lICsgJyAnICsgbmV3RGF0YS5maXJzdE5hbWUsIHRoaXMudGVjaG5pY2lhbk5hbWUsIGZvcm0udmFsdWUuZW1haWxTdWJqZWN0LGZvcm0udmFsdWUuZW1haWxNZXNzYWdlKTtcclxuICAgICAgICAvLyAgICAgdGhpcy5tYXBTZXJ2aWNlLnNlbmRFbWFpbChuZXdEYXRhLmVtYWlsLCBmb3JtLnZhbHVlLmVtYWlsSWQsIG5ld0RhdGEubGFzdE5hbWUgKyAnICcgKyBuZXdEYXRhLmZpcnN0TmFtZSwgdGhpcy50ZWNobmljaWFuTmFtZSwgZm9ybS52YWx1ZS5lbWFpbFN1YmplY3QsIGZvcm0udmFsdWUuZW1haWxNZXNzYWdlKTtcclxuICAgICAgICAvLyAgICAgdGhpcy50b2FzdHIuc3VjY2VzcyhcIkVtYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5XCIsICdTdWNjZXNzJyk7XHJcblxyXG4gICAgICAgIC8vICAgICBmb3JtLmNvbnRyb2xzLmVtYWlsU3ViamVjdC5yZXNldCgpXHJcbiAgICAgICAgLy8gICAgIGZvcm0uY29udHJvbHMuZW1haWxNZXNzYWdlLnJlc2V0KClcclxuICAgICAgICAvLyAgICAgZm9ybS52YWx1ZS5lbWFpbElkID0gdGhpcy50ZWNobmljaWFuRW1haWw7XHJcbiAgICAgICAgLy8gICAgIGpRdWVyeSgnI215TW9kYWxFbWFpbCcpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgLy8gICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgU2VhcmNoVHJ1Y2soZm9ybSkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgLy8kKCcjbG9hZGluZycpLnNob3coKTtcclxuXHJcbiAgICBpZiAoZm9ybS52YWx1ZS5pbnB1dG1pbGVzICE9ICcnICYmIGZvcm0udmFsdWUuaW5wdXRtaWxlcyAhPSBudWxsKSB7XHJcbiAgICAgIGNvbnN0IGx0ID0gdGhhdC5jbGlja2VkTGF0O1xyXG4gICAgICBjb25zdCBsZyA9IHRoYXQuY2xpY2tlZExvbmc7XHJcbiAgICAgIGNvbnN0IHJkID0gZm9ybS52YWx1ZS5pbnB1dG1pbGVzO1xyXG5cclxuICAgICAgdGhpcy5mb3VuZFRydWNrID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0ID0gW107XHJcblxyXG4gICAgICBpZiAodGhpcy5jb25uZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5sb2FkTWFwVmlldygncm9hZCcpO1xyXG5cclxuICAgICAgdGhhdC5Mb2FkVHJ1Y2tzKHRoaXMubWFwLCBsdCwgbGcsIHJkLCB0cnVlKTtcclxuXHJcbiAgICAgIGZvcm0uY29udHJvbHMuaW5wdXRtaWxlcy5yZXNldCgpO1xyXG4gICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgfSwgMTAwMDApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG5cclxuICBnZXRNaWxlcyhpKSB7XHJcbiAgICByZXR1cm4gaSAqIDAuMDAwNjIxMzcxMTkyO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWV0ZXJzKGkpIHtcclxuICAgIHJldHVybiBpICogMTYwOS4zNDQ7XHJcbiAgfVxyXG5cclxuICBzdHJpbmdpZnlKc29uKGRhdGEpIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICB9XHJcbiAgcGFyc2VUb0pzb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgfVxyXG5cclxuICBSb3VuZChudW1iZXIsIHByZWNpc2lvbikge1xyXG4gICAgdmFyIGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xyXG4gICAgdmFyIHRlbXBOdW1iZXIgPSBudW1iZXIgKiBmYWN0b3I7XHJcbiAgICB2YXIgcm91bmRlZFRlbXBOdW1iZXIgPSBNYXRoLnJvdW5kKHRlbXBOdW1iZXIpO1xyXG4gICAgcmV0dXJuIHJvdW5kZWRUZW1wTnVtYmVyIC8gZmFjdG9yO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXRhbjIoeSwgeCkge1xyXG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCk7XHJcbiAgfTtcclxuXHJcbiAgZ2V0SWNvblVybChjb2xvcjogc3RyaW5nLCBzb3VyY2VMYXQ6IG51bWJlciwgc291cmNlTG9uZzogbnVtYmVyLCBkZXN0aW5hdGlvbkxhdDogbnVtYmVyLCBkZXN0aW5hdGlvbkxvbmc6IG51bWJlcikge1xyXG4gICAgdmFyIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEzWkpSRUZVYUlIdGwxMUlVMkVZeC85dnVWcVFheGVCNnd2MEtzY0lGNEcwYnBvYVpuV3poVnBkVkVwMUVScm1wQ2h2TWdqckloVDZvS0JaNkVYVUF1ZU5hRkgwUVRTeHlBV1ZYUlF1UDFBdnN1M001bkhhbmk3Y2x1blp4OWxtQ0w2L3EzUE84L0tjLy85NXZ3RU9oOFBoY0RnY0RvZXpWR0dwU0VKRWFnQlZxY2dsZ1lzeDFod3BtSlpzZGlKU0J5andZY3ozYysyd1o4U2ZiTDY1YkZtdlV4T1JrVEZXTGhXWDNRUEJhdThFb0E5KzBrOU1pZnUyWGQycEVFUWhDYW5TV1BJcVlURldBRUFXWTh3MU55NnJCNGlvYWpydysxTGFzdVdyKzM3MGo0OVBlcWN6VkJsSzE5aDN0aERpQWNEaDZnWlFBUUNaQUJJM1FFVDNBSlJkZTNVYlZrY0xCRkZZRGN4VWFFZG1ib3JreWljdUF5SHhsclphMkhyc0N5eEpIc3RpTlZqTTRvRVlCaGE3ZUNDS0FTSXlZcEdMQjZMTWdjbHAvNW5YMzk1TTJYcnNpdjhwU0M0UkRheE1XN0czdmZkSlhFblNsZWtwRXpTWE5VcFYxSGpVVldqQVBSVHpCNExvaFU2VGpSSzlLYTcyY2luT01ZVWVuVkx4cEk4U3RoNDdTdlVtTkpvdko1c3FHdFdNTWJkVUlHa0RnaWlnOEpZWmhxelViMmFsZWpOSzlDWWdRdldCSkF6b05GcDhHdWtOdnp2NnVoTk5OUzlYQ0VNY083d3NBeXFsQ2cybWVoUnBDOExmR3A3ZlFNT0xtM0xTaERtMi9RaHE4aXFoQ2k0Q0RsYzNMUFphV1hOSmxvR21ROWV4U2IwUnh4K2Nna2NVb05Ob1VXT3N3SnBWS2x6b2tEY0hqaHVPb3E3b0hKcTZXdEQ1NVJrQW9NWllDVnQ1TTNiZjJvOTRENGNSRFlqVDRxaE9vODBJRFkwaTdTNFlNbk5oYU53VnJwQ2pyeHVEN2lGWUQxNkgxZEVpcTNJV1l3VWVPZHYrTVY3Y2R3UmQxYzlRdXRVTXE2TVpPZXQwVXdBVWtEaUZ4alNnVEZQZVBwdGZWZXVaOENnRzNFTW8zSnlQTHRmYmVTSTdlNThDQUFxekN5VEhzUlE2alJZcVpUcHN6dms3dk0xcHgrN3NmQkFSQ2pZYkZRQmVTdDBEWWhwZ2pOVVJrYnJSZkRsOFZSenhqdm9CckpqZFRoWGNhQzd1T1IrWCtObEliVktiMUJ0bWVucG1BcjhFWUpyWGFMYk9lSDVFUkhyTVhDanNkWjFYWUhYOHZhSTJtT3BSdXRVTUFHWUFrbXUxRk9PVHZnT0Q3c0VUKys4ZVhoNGE3enFORm85UHRvYUZSMXI3RTRhSXlvaUlQZzczMHAwM3pkVC9jNUNDbENXUVN5MkkzcS9DaEJCNCtMNlZPajQvSlNLaVFDRGdDUlpzWVNBaW96ZzEyZjdqMTVqVDU1KzRIenkxSnBwTFRVU25QYUwzbmMvdjZ5S2l1dUNkbThQaGNEaWNwY0VmazNlQUxiYzErVlFBQUFBQVNVVk9SSzVDWUlJPVwiO1xyXG5cclxuICAgIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwiZ3JlZW5cIikge1xyXG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBM1pKUkVGVWFJSHRsMTFJVTJFWXgvOXZ1VnFRYXhlQjZ3djBLc2NJRjRHMGJwb2Fabld6aFZwZFZFcDFFUnJtcENodk1nanJJaFQ2b0tCWjZFWFVBdWVOYUZIMFFUU3h5QVdWWFJRdVAxQXZzdTNNNW5IYW5pN2NsdW5aeDlsbUNMNi9xM1BPOC9LYy8vOTV2d0VPaDhQaGNEZ2NEb2V6VkdHcFNFSkVhZ0JWcWNnbGdZc3gxaHdwbUpac2RpSlNCeWp3WWN6M2MrMndaOFNmYkw2NWJGbXZVeE9Sa1RGV0xoV1gzUVBCYXU4RW9BOSswazlNaWZ1MlhkMnBFRVFoQ2FuU1dQSXFZVEZXQUVBV1k4dzFOeTZyQjRpb2FqcncrMUxhc3VXciszNzBqNDlQZXFjelZCbEsxOWgzdGhEaUFjRGg2Z1pRQVFDWkFCSTNRRVQzQUpSZGUzVWJWa2NMQkZGWURjeFVhRWRtYm9ya3lpY3VBeUh4bHJaYTJIcnNDeXhKSHN0aU5Wak00b0VZQmhhN2VDQ0tBU0l5WXBHTEI2TE1nY2xwLzVuWDM5NU0yWHJzaXY4cFNDNFJEYXhNVzdHM3ZmZEpYRW5TbGVrcEV6U1hOVXBWMUhqVVZXakFQUlR6QjRMb2hVNlRqUks5S2E3MmNpbk9NWVVlblZMeHBJOFN0aDQ3U3ZVbU5Kb3ZKNXNxR3RXTU1iZFVJR2tEZ2lpZzhKWVpocXpVYjJhbGVqTks5Q1lnUXZXQkpBem9ORnA4R3VrTnZ6djZ1aE5OTlM5WENFTWNPN3dzQXlxbENnMm1laFJwQzhMZkdwN2ZRTU9MbTNMU2hEbTIvUWhxOGlxaENpNENEbGMzTFBaYVdYTkpsb0dtUTlleFNiMFJ4eCtjZ2tjVW9OTm9VV09zd0pwVktsem9rRGNIamh1T29xN29ISnE2V3RENTVSa0FvTVpZQ1Z0NU0zYmYybzk0RDRjUkRZalQ0cWhPbzgwSURZMGk3UzRZTW5OaGFOd1ZycENqcnh1RDdpRllEMTZIMWRFaXEzSVdZd1VlT2R2K01WN2Nkd1JkMWM5UXV0VU1xNk1aT2V0MFV3QVVrRGlGeGpTZ1RGUGVQcHRmVmV1WjhDZ0czRU1vM0p5UEx0ZmJlU0k3ZTU4Q0FBcXpDeVRIc1JRNmpSWXFaVHBzenZrN3ZNMXB4KzdzZkJBUkNqWWJGUUJlU3QwRFlocGdqTlVSa2JyUmZEbDhWUnp4anZvQnJKamRUaFhjYUM3dU9SK1grTmxJYlZLYjFCdG1lbnBtQXI4RVlKclhhTGJPZUg1RVJIck1YQ2pzZFoxWFlIWDh2YUkybU9wUnV0VU1BR1lBa211MUZPT1R2Z09EN3NFVCsrOGVYaDRhN3pxTkZvOVB0b2FGUjFyN0U0YUl5b2lJUGc3MzBwMDN6ZFQvYzVDQ2xDV1FTeTJJM3EvQ2hCQjQrTDZWT2o0L0pTS2lRQ0RnQ1Jac1lTQWlvemcxMmY3ajE1alQ1NSs0SHp5MUpwcExUVVNuUGFMM25jL3Y2eUtpdXVDZG04UGhjRGljcGNFZmszZUFMYmMxK1ZRQUFBQUFTVVZPUks1Q1lJST1cIjtcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcInJlZFwiKSB7XHJcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEweEpSRUZVYUlIdGx6MXNFbUVjeHA5WGhCUURoUkEvTUNTTlRVeTh0RXNYWEVzZ2NkQUJxb09UcEE0dWtLQU94c1l1RGtKMHJkSG8xSlFtYmdZY1hQeEtuRFRnVUFkdG16U3hJVUNLUkN3ZW9RVjY5M2VBdTJoN0JRNWEwOFQzTngzM1A1NTdudmZyM2hmZ2NEZ2NEb2ZENFhBNC95dHNMMFNJeUE3ZytsNW9hYkRLR0p2YnJYaTRYM1Vpc2tPV1AyLzkvSG0wWGlqVSs5WGJ6cEdSRVRzUmVSaGpWN1hxdW51ZzFkcmpBTVphdDhia3pjMExYendlb3lTS2ZWalZ4aGtPd3hrS0FjQXdZMngxZTExWER4RFJkWktrZTh4Z3NOUXltWXBVcVd5WmpoOGZxR1V5YkQvTUEwQWxuVll1VHdIb1BRQVJ6UUtZTER4OWltSThEa2tVTFVDemhTeHU5MTU0N1ltdUFpam1NOVBUS0NXVCsyeEpINGM2UFhDUXpRTWRBaHgwODBDYkFFVGt3UUUzRDdTWkExU3YzeEkvZkdpVWtrbmp2elNrbDEwRE1KUHAvUHFyVjEySkdLeldQVE9rVjd2dEtsVFA1enUrUUJKRm1BVUJEcisvcStmMTR2RDdsY3NGclhyZlc0bFNJZ0ZISUlDaFdLeGZxWGJjWkl5dGF4WDZEaUNKSXBZdlhvVGw3TmwrcFhiZ0NBU1VIdEJzZmFDUEFHWkJ3TWJTa3ZxN2trcjFLclZEUzZHYkw3eXVBQWFyRlVQUktHdytuM3B2N2RFanJEMStyRWRHNWRpVkszQ0d3K3BFcmFUVHlFeFBvNTdMZGEyaEs4RHd3NGN3dVZ6NEZvbW9rOWNaQ3NFd09JamMvZnY2ekFlRGNOMitqZUw4UE1ydjNnRUFuS0VRVHMvT1l2blNKWFM3T2R3MWdMeTVXVEFMd2dsbGFOaDhQbGpjYm53OWQwNXRvVW9xaFhvdWgrR1pHUlRuNTNXMW5ETVVRdW5GaTcrQ3I2UlNHSG45R282SkNSVGpjUndaSFcwQU1FSmpGOW94d0tHQmdTY25JNUU3VXJsc3JPZnpzSG05cUtUVE8weVczNzV0QnZSNk5jZXhGbVpCZ01GcTFmekNsNUpKMkx4ZWdBaUQ0K05HQU8rMXpnRWRBekRHN2hLUmZTZ1dVNCtLamVhSnkvVG5jOHI0ZFUxTmRXVmU2NzkvWW5LNVlIRzdsUW44SGtDZ25VWlhKeklpR2tQelFKSElQWGlBWWp5dTFvYWlVVGdDQVFDWUFLQzVWbXNoVjZ1WGE5bnN0WlZnMEtDTWQ3TWc0TXp6NTZyeDNkYituaUdpU1NLaTZ1SWlmWitibzFvMlN5MG1lOUN5UzZLNHN2WHJsL3dqa2FEMU4yK2FTckpjYmpYWS9rQkVIcmxXZTlrb2xSYWtqWTFuclYxcnIxcDJJcm9oaWVLbnJXcjFJeEhkYloyNU9Sd09oOFA1UC9nTnFoeC82cnN1ampnQUFBQUFTVVZPUks1Q1lJST1cIjtcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcInllbGxvd1wiKSB7XHJcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUF5aEpSRUZVYUlIdGx6MU1VMUVZaHQvdlloV05hWnRnaEFHTm1JQ0pWbUZ3TUNGUkhFd0VFOFZKbk1SQm5SUWR5Z0FPRHJyb1lDSUx1QmdXWWRQRXlHUml4QlFjSENEK0RLaEFXaU00MUhnSmxKL2JudGVodC9XbnR6KzNCVVBDZWFiZSs1MjhmYi92bkh2T2R3Q05ScVBSYURRYWpVYXpVWkhWRUNIcEI5Q3hHbG9PVEl0SWY3YmdwbExWU2ZwQk5RN3J4dzRzZmxzcFZTOEQzeUUveVNZUnVlZ1VkajBEZHJXUEFXaXdYelVnc1hncThlS2dCNVpaZ2xObnBLNFRSbDBRQUdwRVpQcmZ1S3NaSU5rQnhtOURObTFIYkhJZTFud2M1VlhsWEppVXRUQVBBSWlHQUFRQllBK0E0aE1nK1FoQXUvcDBINXpxQXl4ek81Q3NrRlEwcnBKYjl4U1VRTW84eDYrQmtZRTF0dVFPSTkrQVA4MnJkV1lleUpQQWVqY1A1RWlBWkJQV3VYa2cxemVRV0E0eU9teXB5SURuUC9weFRmWUV5cmEwWU9aWllTb2U3eXJaY2RMMjVRem4zSVVZQytmVmw3Z0o4UVlndTlxQUFzYTdSYXJQcFg2T09jVkxiaVZVWkJCRzlYa1k5VDJsU3VYaWhvajhkQXFVbkFBc0UycTRhVTBPTTZsdVM4NXNsdW9ESlNRZzNnQTQ5ejc5ekdpb1dLa01yVFFWalhtYk5YY0plSHd3Nmg5QXFsclNyemh4RjJyaW5pdVpGRWJOWlVoZFovcERaVFFFamw4cjZOdEw0U29CNDNBL1pOdHVxTGNYQU11RStBS1EyazZJeHc5KzZIWm5mdThWeVA3YlVGTVBnZGtoQUhibmVlUXBFcStQbzlEbU1QdEpuRmo2THI1QStsR3FXaUFWalZDanJlRHNFQmdOUVUzMlFZMWZUVlp5MjI1WENVaHRFSXdNZ2grNms1V1BocUJHendBQ0dNbDFEL0UzV1Bid2pDNDBSWTV6b0x4WDluVjFpV1Y2RUF0REtwdkI2RWpHOURKVnZjcVRnTk02ZGpMdkRRQWVIL2gxTUNPbUlvT1F5bVlZSkdUbkNRK0FWMDczZ0x3SmlNZ3RrbjZqdnVmM1ZYRnBaZ1hBNXI4RzJ1dFhEdHh4Znp0eU9LUms2NjdranBiYzFWNEJhTTBsVWRCL2tteEE4a0x4aEI5dlFrMzJwV05HZlU5cXF6c0x3SEd2ZGlReGY0Nng4Q1UxY3Jvc3RkN0ZHNEJ4OUdYYWVMYTl2MmhJdHBPa010OHg4YVdYWEFqVHByMElMVDlYNWo3VE1wVUtEMUROUExlbGxHa1hiRzBnMmNUNDBuTXVSOGNZanoyMnU5Wml0ZndrcjNQRmZNdjR3aHVTdCt3N3QwYWowV2cwRzROZlRpeGtmRnh5WFBFQUFBQUFTVVZPUks1Q1lJST1cIlxyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwicHVycGxlXCIpIHtcclxuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUY2MmxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdNeTB3TTFReE1UbzBNRG96Tnkwd05Ub3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1ETXRNRE5VTVRFNk5UTTZNalV0TURVNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1ETXRNRE5VTVRFNk5UTTZNalV0TURVNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllUbGhZVFl4WkdZdFkyVmhOQzB3WXpReUxUaGhaVEF0WmpZMVpUZGhOV0l3TWpCaElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2TVRJNE5tWXpaR1V0WkRkak5TMWtaVFJtTFRnNU5HWXRNV1l6T0RrMlltTTVaakZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2WVRka05EUm1OMkV0TWpKbFl5MWhPRFEwTFRsbU9XSXRNVEEzWWpGaE5XWTJPVGN5SWo0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGhOMlEwTkdZM1lTMHlNbVZqTFdFNE5EUXRPV1k1WWkweE1EZGlNV0UxWmpZNU56SWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TUROVU1URTZOREE2TXpjdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21FNVlXRTJNV1JtTFdObFlUUXRNR00wTWkwNFlXVXdMV1kyTldVM1lUVmlNREl3WVNJZ2MzUkZkblE2ZDJobGJqMGlNakF4T0Mwd015MHdNMVF4TVRvMU16b3lOUzB3TlRvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NlJRMmNYQUFBQ1MwbEVRVlJvM3UyWXZVb0RRUkRIOHdoNUJOOUFIOERDMmtZcld3WHQxVjdSV2h1N2xJS0tXQ2txTm9Lb29LQkVKU0RFRDB3UmpTU1NjR0xpSldaemQrdit6OXV3aEh4ZTl1Q0VHUmhDTm5lejg1dWRuWjFOaEhNZStjOGFJUUFDSUFBQ0lBQUNJQUFDSUFBQ0lBRHRBTDJJZUQ0cWRDa2duVlRtMFE4QTV4MmJwOHNGWmhhUzM1KzZsZi9KdWpZQUw5cGpTb1QyYWhXYjdRemY4bzNCYSsyYWlHVThCajdRTjRBWW43VXRwd1JyeGRkS0NSRXE1MW5sNDY1WUM4SjU2UEhNZ3dRWTZRc0F5d2dyaUlnYWJYelB4cjk0cUFHazg1ZUxxYVpMSEdxQWRzNkhIcUNUODZFRzhGNW82M3lvQWV5cWMvUjIvc202S1hOaFhZR08wWmNBeHFNWkdNRHAvTE4vQU5CM21pQyttbmF0WHl5aytQSDBnM1o5UFRFa1FEUVFBSndKeHBQSkE1YTVubHVKYmdIVVhOV3RxWU44UFgyMEF4eE8zR3ZMODFhMmxENUlEd0RTUmNsSkxsc0x2NDdIVjlLOFdxelZiYUdhN1k0bWdnUEFCS1gzSDdjeTREZHNZRGlRM01yMjdyeTMrZkd1VEJuWGZ1YW4zbXYxQlNCYTVCd21hU3huYW9UYWpYZFNnQ1BIRzhjUklEa3Z6aUhaU3Z0WmdlVmEyV2F5UEw3czUxc2VXQkNrUTdlbEVjKzIybVB5WUpUUENEbnpmU01UbjJ0cXZwdTVhclZaR2ZVcldMMUdlMHJsY1oxSC9lLzdTaW0rRHdrZGR5T3RwQlVVSytQSnVIZGFkcVhNdEdMR3MybXBkd3RVbzJhT2E3c1RpL0VwV0VmcmtOek11aHZPazZsSWp3SUhXY2w2RVh2QlFSRHExYzNoWHdoWWkzZTAzSWxIME9oVkRKWVFHMzFiVmdnLzRyVUhjd0xraHBXdEsreTdacEgzQlVCL2JCRUFBUkFBQVJEQWY5QmZSYjY0S1lmbFJMQUFBQUFBU1VWT1JLNUNZSUk9XCJcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaWNvblVybDtcclxuICB9XHJcblxyXG4gIGxvY2F0ZXB1c2hwaW4ob2JqKSB7XHJcbiAgICBjb25zdCB0cnVja0lkID0gb2JqLnRydWNrSWQ7XHJcblxyXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgcGlucyBpbiB0aGUgZGF0YSBsYXllciBhbmQgZmluZCB0aGUgcHVzaHBpbiBmb3IgdGhlIGxvY2F0aW9uLiBcclxuICAgIGxldCBzZWFyY2hQaW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YUxheWVyLmdldExlbmd0aCgpOyBpKyspIHtcclxuICAgICAgc2VhcmNoUGluID0gdGhpcy5kYXRhTGF5ZXIuZ2V0KGkpO1xyXG4gICAgICBpZiAoc2VhcmNoUGluLm1ldGFkYXRhLnRydWNrSWQudG9Mb3dlckNhc2UoKSAhPT0gdHJ1Y2tJZC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgc2VhcmNoUGluID0gbnVsbDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGEgcGluIGlzIGZvdW5kIHdpdGggYSBtYXRjaGluZyBJRCwgdGhlbiBjZW50ZXIgdGhlIG1hcCBvbiBpdCBhbmQgc2hvdyBpdCdzIGluZm9ib3guXHJcbiAgICBpZiAoc2VhcmNoUGluKSB7XHJcbiAgICAgIC8vIE9mZnNldCB0aGUgY2VudGVyaW5nIHRvIGFjY291bnQgZm9yIHRoZSBpbmZvYm94LlxyXG4gICAgICB0aGlzLm1hcC5zZXRWaWV3KHsgY2VudGVyOiBzZWFyY2hQaW4uZ2V0TG9jYXRpb24oKSwgem9vbTogMTcgfSk7XHJcbiAgICAgIC8vIHRoaXMuZGlzcGxheUluZm9Cb3goc2VhcmNoUGluLCBvYmopO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihsb2NhdGlvbiwgdXJsLCByb3RhdGlvbkFuZ2xlLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuXHJcbiAgICAgIHZhciByb3RhdGlvbkFuZ2xlUmFkcyA9IHJvdGF0aW9uQW5nbGUgKiBNYXRoLlBJIC8gMTgwO1xyXG4gICAgICBjLndpZHRoID0gNTA7XHJcbiAgICAgIGMuaGVpZ2h0ID0gNTA7XHJcbiAgICAgIC8vIENhbGN1bGF0ZSByb3RhdGVkIGltYWdlIHNpemUuXHJcbiAgICAgIC8vIGMud2lkdGggPSBNYXRoLmFicyhNYXRoLmNlaWwoaW1nLndpZHRoICogTWF0aC5jb3Mocm90YXRpb25BbmdsZVJhZHMpICsgaW1nLmhlaWdodCAqIE1hdGguc2luKHJvdGF0aW9uQW5nbGVSYWRzKSkpO1xyXG4gICAgICAvLyBjLmhlaWdodCA9IE1hdGguYWJzKE1hdGguY2VpbChpbWcud2lkdGggKiBNYXRoLnNpbihyb3RhdGlvbkFuZ2xlUmFkcykgKyBpbWcuaGVpZ2h0ICogTWF0aC5jb3Mocm90YXRpb25BbmdsZVJhZHMpKSk7XHJcblxyXG4gICAgICB2YXIgY29udGV4dCA9IGMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgIC8vIE1vdmUgdG8gdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxyXG4gICAgICBjb250ZXh0LnRyYW5zbGF0ZShjLndpZHRoIC8gMiwgYy5oZWlnaHQgLyAyKTtcclxuXHJcbiAgICAgIC8vIFJvdGF0ZSB0aGUgY2FudmFzIHRvIHRoZSBzcGVjaWZpZWQgYW5nbGUgaW4gZGVncmVlcy5cclxuICAgICAgY29udGV4dC5yb3RhdGUocm90YXRpb25BbmdsZVJhZHMpO1xyXG5cclxuICAgICAgLy8gRHJhdyB0aGUgaW1hZ2UsIHNpbmNlIHRoZSBjb250ZXh0IGlzIHJvdGF0ZWQsIHRoZSBpbWFnZSB3aWxsIGJlIHJvdGF0ZWQgYWxzby5cclxuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCAtaW1nLndpZHRoIC8gMiwgLWltZy5oZWlnaHQgLyAyKTtcclxuICAgICAgLy8gYW5jaG9yOiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMjQsIDYpXHJcbiAgICAgIGlmICghaXNOYU4ocm90YXRpb25BbmdsZVJhZHMpICYmIHJvdGF0aW9uQW5nbGVSYWRzID4gMCkge1xyXG4gICAgICAgIGxvY2F0aW9uLnNldE9wdGlvbnMoeyBpY29uOiBjLnRvRGF0YVVSTCgpLCBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludChjLndpZHRoIC8gMiwgYy5oZWlnaHQgLyAyKSB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gcmV0dXJuIGM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEFsbG93IGNyb3NzIGRvbWFpbiBpbWFnZSBlZGl0dGluZy5cclxuICAgIGltZy5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xyXG4gICAgaW1nLnNyYyA9IHVybDtcclxuICB9XHJcblxyXG4gIGdldFRocmVzaG9sZFZhbHVlKCkge1xyXG5cclxuICAgIHRoaXMubWFwU2VydmljZS5nZXRSdWxlcyh0aGlzLnRlY2hUeXBlKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICB2YXIgb2JqID0gSlNPTi5wYXJzZSgodGhpcy5zdHJpbmdpZnlCb2R5SnNvbihkYXRhKSkuZGF0YSk7XHJcbiAgICAgICAgICBpZiAob2JqICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIGlkbGVUaW1lID0gb2JqLmZpbHRlcihlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5maWVsZE5hbWUgPT09ICdDdW11bGF0aXZlIGlkbGUgdGltZSBmb3IgUkVEJyAmJiBlbGVtZW50LmRpc3BhdGNoVHlwZSA9PT0gdGhpcy50ZWNoVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpZGxlVGltZSAhPSB1bmRlZmluZWQgJiYgaWRsZVRpbWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGhyZXNob2xkVmFsdWUgPSBpZGxlVGltZVswXS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBzdHJpbmdpZnlCb2R5SnNvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhWydfYm9keSddKTtcclxuICB9XHJcblxyXG4gIFVUQ1RvVGltZVpvbmUocmVjb3JkRGF0ZXRpbWUpIHtcclxuICAgIHZhciByZWNvcmRUaW1lO1xyXG4gICAgdmFyIHJlY29yZGRUaW1lID0gbW9tZW50dGltZXpvbmUudXRjKHJlY29yZERhdGV0aW1lKTtcclxuICAgIC8vIHZhciByZWNvcmRkVGltZSA9IG1vbWVudHRpbWV6b25lLnR6KHJlY29yZERhdGV0aW1lLCBcIkFtZXJpY2EvQ2hpY2Fnb1wiKTtcclxuXHJcbiAgICBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnQ1NUJykge1xyXG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ0FtZXJpY2EvQ2hpY2FnbycpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ0VTVCcpIHtcclxuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdBbWVyaWNhL05ld19Zb3JrJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcclxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnUFNUJykge1xyXG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ0FtZXJpY2EvTG9zX0FuZ2VsZXMnKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdBbGFza2EnKSB7XHJcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignVVMvQWxhc2thJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVjb3JkVGltZTtcclxuICB9XHJcblxyXG4gIGFkZFRpY2tldERhdGEobWFwLCBkaXJNYW5hZ2VyKXtcclxuICAgIC8vLy9sb2FkIGN1cnJlbnQgbG9jYXRpb25cclxuICAgIGxvYWRDdXJyZW50TG9jYXRpb24oKTsgICAgXHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLlVwZGF0ZVRpY2tldEpTT05EYXRhTGlzdCgpO1xyXG4gICAgdmFyIGluaXRJbmRleDogbnVtYmVyID0xO1xyXG4gICAgdGhpcy50aWNrZXREYXRhLmZvckVhY2goZGF0YSA9PiB7XHJcbiAgICAgIHZhciB0aWNrZXRJbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDZ0FBQUF0Q0FZQUFBRGNNeW5lQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBTk9TVVJCVkZpRnpabFBTQlJSR01CLzM5dE1DQ04zTnkzSUxsR0MvVGxZVU9DZlRZSXdJU2p3Vm5UcFZIVEpnMUVnQ2RWRnExc1JIU0xvbkllNldGR2txN3NWRkVoaG11V3RQNFRNaWlpRnVqT3ZRNk03NnF3Njdyamo3emJ2ZmZOOVB4NnpPKzk5STZ3QTNVQ2hNVTZ0Q0xWYXFCU0xYUWhiZ0NJN1pBTE5ieEdHTlBScGlFZUw2SlZPSnIzV0VpL0JvekVxTFlzTENJMUFzY2RhbzBDSE1ya2JUdExucTJDcWpyM2E1QlpRNzFFcVc5Vk9USnFqQ2ZxWERsMEV2WWYxcVFnM2dDWmduUzl5R2RKYXVCMDF1Q3I5VEhrV05Pb29FNU1uR3ZiN0xEYmY0TDJlNXVUbU4veHduM2FUcTJZUElaNmoyYmFxY2htK0EvWFJIajdQbjFnZ09GSkR1Uks2Z2EzNU1IUHd5d3dSSyszaW0zTndqdUJJTlJ1VjRoMVFrVmUxREVOU3lNSElTOFptQnBSelZpa2VFcHdjUUxtZTVMNXpZSFlGalZvYWdjZDVWM0xCRWs2VXhIa0t0cUErUUVGcUE0UEFqa0ROYkFTK2hVTlVTQmRwQldCczREUnJSQTVBdzA0anpTbXduMEdCODhFcUxVU0Vjd0JpLzYxOENWcklqWkRKVGlYaTAvdDFGYkFVOVVxZ0ttaVJiRmhRcllEZFFZdGtSYWhRUUZuUUhvdFFwc2pzZ3RjY0Fwc1VlTitHNTVHL0N2Z1p0TVVpL0ZRQ3Y0SzJXSVFmeW9LQm9DMnlJVENvZ0JkQmkyUkY4MXpzVGFvQkZBVHRNNDhwTTBSVWxTUVladzJ1b3NDejBpNG1GSUFTMm9NV2NxRWQ3TzFXT0U0Y1NBYXE0MFRURStraEFjNHppZEFNbUVFNU9URFJYSnE1bUJXTXhrbHF6YzFnbkRJSXRFVVR2SFZjWjlBTkZJNU9rRnoxYmtJV0JENkVVMVE1V3lGempwM1N5V1FCSElPRkovdzhNSlFPY1h4K244YTk5VkZIR1NiZDVPa2dwV0ZZVzhSS0VndjNCY3J0aG1nWDN3dENIRUxvWEgwOVhwbFRWTHZKd1ZMdE4xQkdMWmNGV29IMVBvdE5pZEFhanRNbW9MTUZMYXVCYWNUWURyU2dPVXZ1ZlVJTG9TT1U1a3B4a3VHbGdqMjFnRWRxS0Zkd3htNEJlKzNoREtEcE1CV1BTdU44WGU1Tm5nU2RwR0xzMDVwdUlMeEU2S2dJaHlOeFBxMmtqdXVQWkRuWUJhOHZJL1RhU3VVZ0IwR0F5Qi91QUVQWjVqVU1SNHE0bDB1Tm5BVGxBOVBXLzNlNGUzSk4wMHEramN5cGtjdk5NeGcxdkVBNE9pZXg1bldrbHlPNTVzNXBCV2ZSTkFGcHg0aUpjTkdQMUw0STJoOWtIczRPQ0E4aVBYejBJN2MvS3doTW03UUFZOEM0cVdqMUsrOC9ka2psZmZlMDE2OEFBQUFBU1VWT1JLNUNZSUk9XCJcclxuICAgICAgaWYoZGF0YS50aWNrZXRTZXZlcml0eSA9PT0gXCJVbmtub3duXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eSA9PT0gXCJXYXJuaW5nXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eSA9PT0gXCJNaW5vclwiKVxyXG4gICAgICB7XHJcbiAgICAgICAgdGlja2V0SW1hZ2UgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ3dBQUFBekNBWUFBQURzQk9wUEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBT3hBQUFEc1FCbFNzT0d3QUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQVB5U1VSQlZHaUI3WmhQaUJ0MUZNZS83eVhUMWQzRlFoR0tlS25vS3Rqc1dtbHZ4UmFoOXFMVlM2ZEpab091QncrV1FpLzF0SWNXdk9pV3NsUzl1QWVKYXlhL2JJTUhLWXFvaHhRVVFZaGFOcFd5V0ZCV29pMzBvQ2gxTjVQZjg3RGJrSjFNSnBPZFpCS3duMXZlNy8xKzc1Tmg1dmVQc0ExTTA5eGhHTVpCQUljQVBBM2dDUUM3QVl4dnB2eE5SSCtJeUFxQUg1ajV5dWpvNkRjTEN3dTE3ZFJyaHJwSlRxZlRlNG5vRklBVEFIWjFXZXMyZ0V0RTlKNXQyejkxMmJkQklPRmtNdmw0TEJhYkEvQmkwRDQrQ0lCUG1QbU5YQzczYzdlZGZZdWJwaG1MeCtPelJEUUxZTWQyRGR1d0ppSnZPbzd6VnJGWXJBZnQxRlk0blU0L1NFUWZZK005N1JzaVVqSU00L2ppNHVMdElQbWV3cWxVYWc4emZ3RmdvcWQyN1ZrQmNEU2Z6Ly9hS2JGRk9KMU83eWFpSzlqNDhxUGtCak0vazh2bGZ2ZEw0dVlmTXpNejl4SFJwNGhlRmdBZTFWcC9acHJtL1g1Slc0VFgxOWZuQWV6dnE1WS8rd3pEbVBOTGFMd1NsbVVkQWxCQytHa3JMRnBFRGl1bHZ2WnF2UHVFQ2NCRkRGNFdBSmlJNXRIR2hRRWdrOGtjQTdBdlNxc09ISmllbm43ZXE0RUJRR3Q5TWxxZnpvakk2MTV4eW1ReUQybXRWd0hFSW5icVJGMUVIbFpLM1d3T3NvZ2N4ZkRKQWh0T3o3bURyTFh1NjlJYkJpSTY3STR4TSs4ZGhFd1FpT2hKZDR4RlpNOEFYQUloSW8rNFl3eGc1d0JjZ3RMaXhsNVpRMFNMSHdPNDZaRTRMRlRkQWZZS0RoR2V3aDAzelFPa3hZMDNOK3REaVlpVTNER3UxK3VmRDhBbEVDTHlsVHZHaFVMaEZ3RFhvOWZweUxWTnR5MHdBSWpJdTVIcmRPWWRyeUFEd01qSXlBY1lydW50VnExVys4aXJnUUVnbTgzK0MyQStVaVYvemhlTHhUdGVEWTJWcEZxdFhnRHdYV1JLN2ZsK2ZIejhZcnZHaG5DcFZISkU1QlVBbnY4c0l0WkU1R1cvVzg0dGE3VlM2anFBMXdEb2ZwdDVvRVhrVmFYVU5iK2tscFBHOHZMeWNpS1JXQ1dpWHR4VUJrVkU1S1JTS3RzcDBmTm9WS2xVZnB5Y25Md0ZJSXJqMDdxSW5GSkt2UjhrMmZjSnBsS3BBOHg4Q1VETFJycEgvQ1lpSjVSUzN3YnQ0UHYwS3BWS05aRkkyRVQwQUlDbk91VjNRUTNBUWp3ZVQ5cTJ2ZEpOeDhEdmFDYVRlVXhyZlE3QWNRQWozZmsxV0NPaW91TTQ1NWFXbG01c1o0Q3VQeXJUTkhjYWh2RUNnQ1NBWXdHN1hRYXdSRVNYYmR2K3E5dWF6WVNhQlN6TCtoTEFFYjhjRVNrcHBaNE5VNmVaVUdjNlpqNEQvemxiRTlHWk1EVmFhb2Jwbk12bHJnSlk5RW41TUovUGw4UFVjQlA2MUt5MW5nWHdqMGZUSGEzMTJiRGp1d2t0WENnVXFrUjB3YU5wcmxBb3JJWWQzMDFQN2lYR3hzYmVCdEFzVjQzRll1ZDdNYmFibml3RTVYSzVOalUxOVNlQWx3QkFSRTdidHQyWHJXclBibjRtSmlheUFNb2ljdFZ4SEw4UGNYaXdMT3VJWlZtKzgvSTk3dkYvNXovZDBqb0VQemhaR2dBQUFBQkpSVTVFcmtKZ2dnPT1cIlxyXG4gICAgICB9ZWxzZSBpZihkYXRhLnRpY2tldFNldmVyaXR5ID09PSBcIk1ham9yXCIpe1xyXG4gICAgICAgIHRpY2tldEltYWdlID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUN3QUFBQXpDQVlBQUFEc0JPcFBBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFPeVNVUkJWR2lCN1poTmFCeGxHSUNmZDJaTmFsc29pRkJVaExiWlRmcHpNTkxnUVRGRnFMMW9QWlY0VVp2ZHBKVFdIdXNwZ2dFdm1sSkNWZENnNXNjaVlzU0Q5Q0xxSVlHS0lMYmFRMnE3M2EyR2x0Z0tCUlZObXV6T3ZCNFMwODNzek96TXp1N3NnbjF1ODM3djkzMFBIN3Zmenl0VXcrUk1Dd3V0VDJCck4vQW8wQUZzQmphdVpQeU5jZ01oQy93SVRMUDA1N2NjN2lwVU5WOEpFaXA3L01vdVZJNkI5Z0QzaFp6ckZzSWtOdStRU1YwTTJYZVZZTUlUK1hac2V3aDRMbkFmYnhUNEFrdGVvVCtaQzl2WmYvSkpOWm5QRGFBTUFDMVZDbnF4aU1qcnJHOTdneDZ4Z25ieUZoNjVmRDh0eHVkQWR5M3NmSmpDS0I3ZzRJNWJRWkxkaGNkKzNnS0pyNEJVRGNYOHlHS1orK2pmTmxzcHNWejQvYXViU2RqVG9CMTFVZk1tVDZMd0pDL3UvTTB2YWEzdzJDL3JvSGdXMkYxUE14OStZc082eCtsNWVNRXJ3Vmo3YVEzVE9GbUFUdVp2RC9rbDNGbmg4V3czS2xORTM3YWlZbU1iZStock8rdld1THpDcW9MS0tSb3ZDMkJnMnNPb3Vyb3NDMC9rOWdPZGNWcjVvblF4ZHVVWnQ2YVZGZVpvckVKQkVJNjRoMDlmZklEaVBkY0FNMmFsU2xnVXpZYzR0TzFtYWRDZzBMS1A1cE1GTURHdHA1MUJBOUY2SDczVlk3Q25QQVM3R3FBU0RHV25NMlFBVytJM0NZcHNkVVlNWUZNRFRBS2laVzZHVzFvVFVlWm5BRGRkRXB1Rk9XZkFRTXVEVFlPb2k3Qm94VXR6dzFBcGN6T0E2UWFvQkVPWmNvWU1zTDVzZ0Vvd3BQaU5NMlNRM3ZFcmNDbCttNHJNckxpdDRiOXQ0KzE0WFFJZzhwWmJlRVU0TVVwemJXKy9zNzcxdEZ2RHNuQjY2MjFnT0U0algxUk9lRDFFNzV3a3M5ZFBBdC9INWVURGVRcC9uUEpxZER6ekwyOEg0enh3YjcydFBGaEUyRTF2YXNZclllMVpuZTY0aEhBSXNPdHQ1b0tOYXRwUEZ0d3VQNzJwajFIdFo3bktHQmVLNmxFeTdaOVVTblMvcldYYXgxQmVCaUlYb0FPd2hPb1JNdTBqUVpMOTZ4QWY1cnN3N0VtZzdDSmRFNFRyQ0QwY1RIMFh0SXYvZmJpdjdRZVc3TWRBM3FPMnExMUFlQmNwZG9hUmhUQ1ZuZzl5U1V3ZEJBNEFyZUg4VmxsRStBd1lwRGVWcjJhQThLV3BrZndtV3UxblVaNEg5Z2ZzZFFiaFV4S2M0WVhVWDZIbkxDRmFMVzA4OXpXcWV5dGtUWkZPUFJWcG5oS2l2ZWtzNnpqK2U3YU55UEZJY3ppSUp0elhjUUhrSTg5MllZTGU1TGxJY3ppSS9tcTJpd1BBUHk0dEM5anlXdVR4SFVRWDd0cytoM0xTcFdXSVRQSmE1UEVkMUtZdVVkandKbEFxTjRjNWY2SW1ZenVvamZEaEIrZUJ3ZFZ2MVZkNTZSRzNuMGxrYWxmNW1VMk9BK2VBQzJ4TWVmOFJtNHJSN0Y1R3M1WDI1YnZjNVgvTnYxb1k5cWRiRmtsMEFBQUFBRWxGVGtTdVFtQ0NcIlxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcHVzaHBpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihkYXRhLmxhdGl0dWRlLCBkYXRhLmxvbmdpdHVkZSksIHsgaWNvbjogdGlja2V0SW1hZ2UsIHRleHQ6IGluaXRJbmRleC50b1N0cmluZygpIH0pO1xyXG4gICAgICBwdXNocGluLm1ldGFkYXRhID0gZGF0YTtcclxuICAgICAgbWFwLmVudGl0aWVzLnB1c2gocHVzaHBpbik7XHJcbiAgICAgIHRoaXMuZGF0YUxheWVyLnB1c2gocHVzaHBpbik7XHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHB1c2hwaW4sICdjbGljaycsIHB1c2hwaW5DbGlja2VkKTtcclxuICAgICAgbWFwLnNldFZpZXcoeyBtYXBUeXBlSWQ6IE1pY3Jvc29mdC5NYXBzLk1hcFR5cGVJZC5yb2FkLCBjZW50ZXI6IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihkYXRhLmxhdGl0dWRlLCBkYXRhLmxvbmdpdHVkZSl9KTtcclxuICAgICAgaW5pdEluZGV4ID0gaW5pdEluZGV4ICsgMTtcclxuICAgIH0pO1xyXG4gICAgJCgnLk5hdkJhcl9Db250YWluZXIuTGlnaHQnKS5hdHRyKCdzdHlsZScsJzQ4MHB4Jyk7XHJcbiAgICBjb25zdCBpbmZvYm94ID0gbmV3IE1pY3Jvc29mdC5NYXBzLkluZm9ib3gobWFwLmdldENlbnRlcigpLCB7XHJcbiAgICAgIHZpc2libGU6IGZhbHNlLCBhdXRvQWxpZ25tZW50OiB0cnVlXHJcbiAgICB9KTsgICAgXHJcbiAgICBmdW5jdGlvbiBwdXNocGluQ2xpY2tlZChlKSB7XHJcbiAgICAgIGlmIChlLnRhcmdldC5tZXRhZGF0YSkge1xyXG4gICAgICAgIHZhciBsbD1lLnRhcmdldC5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgIGxvYWRUcnVja0RpcmVjdGlvbnModGhpcyxsbC5sYXRpdHVkZSxsbC5sb25naXR1ZGUpO1xyXG4gICAgICAgIGluZm9ib3guc2V0TWFwKG1hcCk7ICBcclxuICAgICAgICBpbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAgICAgbG9jYXRpb246IGUudGFyZ2V0LmdldExvY2F0aW9uKCksXHJcbiAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgb2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMCwgNDApLFxyXG4gICAgICAgICAgaHRtbENvbnRlbnQ6JzxkaXYgc3R5bGU9XCJtYXJnaW46YXV0byAhaW1wb3J0YW50O3dpZHRoOjQ1MHB4ICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjogd2hpdGU7Ym9yZGVyOiAxcHggc29saWQgbGlnaHRncmF5O1wiPidcclxuICAgICAgICAgICsgZ2V0VGlja2V0SW5mb0JveEhUTUwoZS50YXJnZXQubWV0YWRhdGEpICsgJzwvZGl2PidcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICAkKCcuTmF2QmFyX0NvbnRhaW5lci5MaWdodCcpLmF0dHIoJ3N0eWxlJywndG9wOjQ4MHB4Jyk7XHJcbiAgICAgIHBpbkNsaWNrZWQoZS50YXJnZXQubWV0YWRhdGEsIDApXHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKGluZm9ib3gsICdjbGljaycsIGNsb3NlKTtcclxuICB9XHJcbiAgdmFyIGN1cnJlbnRMYXRpdHVkZT00MC4zMTI4O1xyXG4gIHZhciBjdXJyZW50TG9uZ2l0dWRlPS03NS4zOTAyO1xyXG4gIGZ1bmN0aW9uIGxvYWRDdXJyZW50TG9jYXRpb24oKVxyXG4gICAgICB7XHJcbiAgICAgICAgaWYobmF2aWdhdG9yLmdlb2xvY2F0aW9uKXtcclxuICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XHJcbiAgXHJcbiAgICAgICAgICAgICAgICAvL0FkZCBhIHB1c2hwaW4gYXQgdGhlIHVzZXIncyBsb2NhdGlvbi5cclxuICAgICAgICAgICAgICAgIHZhciBwaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihsb2MpO1xyXG4gICAgICAgICAgICAgICAgbWFwLmVudGl0aWVzLnB1c2gocGluKTtcclxuICBcclxuICAgICAgICAgICAgICAgIC8vIC8vIENlbnRlciB0aGUgbWFwIG9uIHRoZSB1c2VyJ3MgbG9jYXRpb24uXHJcbiAgICAgICAgICAgICAgICAvLyAvLyBtYXBzLnNldFZpZXcoeyBjZW50ZXI6IGxvYywgem9vbTogMTUgfSk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TGF0aXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TG9uZ2l0dWRlID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRMYXRpdHVkZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50TG9uZ2l0dWRlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgZnVuY3Rpb24gcGluQ2xpY2tlZChwYXJtczogYW55LCBsYXVjaFRpY2tldENhcmQ6IG51bWJlcil7XHJcbiAgICAgIC8vY29uc29sZS5sb2coJ2VtaXQnLHRoYXQpO1xyXG4gICAgICB2YXIgc2VsZWN0ZWRUaWNrZXQgPSB7XCJTZWxlY3RlZFRpY2tldFwiOiB7XHJcbiAgICAgICAgICBcIlRpY2tldE51bWJlclwiOiBwYXJtcy50aWNrZXROdW1iZXIsXHJcbiAgICAgICAgICBcIkxhdW5jaFRpY2tldENhcmRcIjogbGF1Y2hUaWNrZXRDYXJkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCdlbWl0JyxzZWxlY3RlZFRpY2tldCk7XHJcbiAgICB0aGF0LnRpY2tldENsaWNrLmVtaXQoc2VsZWN0ZWRUaWNrZXQpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBjbG9zZShlKSB7XHJcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdmYSBmYS10aW1lcycpIHtcclxuICAgICAgJCgnLk5hdkJhcl9Db250YWluZXIuTGlnaHQnKS5hdHRyKCdzdHlsZScsJ3RvcDowcHgnKTtcclxuICAgICAgaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gbG9hZFRydWNrRGlyZWN0aW9ucyh0aGF0LGVuZExhdCwgZW5kTG9uZykge1xyXG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucycsICgpID0+IHtcclxuICAgICAgZGlyTWFuYWdlciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLkRpcmVjdGlvbnNNYW5hZ2VyKG1hcCk7XHJcbiAgICAgIGRpck1hbmFnZXIuY2xlYXJBbGwoKTtcclxuICAgICAgbWFwLmxheWVycy5jbGVhcigpO1xyXG4gICAgICAvL3ZhciBsb2NjID0gbWFwcy5nZXRDZW50ZXIoKTtcclxuICAgICAgdmFyIGxvY2MgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oY3VycmVudExhdGl0dWRlLCBjdXJyZW50TG9uZ2l0dWRlKTtcclxuICAgICAgLy8gU2V0IFJvdXRlIE1vZGUgdG8gZHJpdmluZ1xyXG4gICAgICBkaXJNYW5hZ2VyLnNldFJlcXVlc3RPcHRpb25zKHtcclxuICAgICAgICByb3V0ZU1vZGU6IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuUm91dGVNb2RlLmRyaXZpbmcsXHJcbiAgICAgICAgcm91dGVEcmFnZ2FibGU6IHRydWVcclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIGRpck1hbmFnZXIuc2V0UmVuZGVyT3B0aW9ucyh7XHJcbiAgICAgICAgZHJpdmluZ1BvbHlsaW5lT3B0aW9uczoge1xyXG4gICAgICAgICAgc3Ryb2tlQ29sb3I6IE1pY3Jvc29mdC5NYXBzLkNvbG9yLmZyb21IZXgoJyMwMDlmZGInKSxcclxuICAgICAgICAgIHN0cm9rZVRoaWNrbmVzczogNVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RXYXlwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IHRydWUsIHRleHQ6ICcnLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRDBBQUFBMENBWUFBQUE1YlRBaEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBT3hBQUFEc1FCbFNzT0d3QUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQWg5U1VSQlZHaUJ4WnByYkZ6RkZjZC81OTZzNC9WNnZVNXNFbE8ySVhHYWgyM3lzSjFFRU5IeVVCK2tsSDZCdnFCcW9hM1VoNURhU2tXSWlsSlVxU0lpcW9MNlVJVmFwTFlpMU9VaEVMU2dwaFVva0laRUpDWXg4U09KWTF5SkJDZXgxMTU3MTJ2djdwM1REN3RyMXNIRzkzcnZxdjh2TzN2dnpIL08vODdNbVRNUG9Zem8yN0FoUEdWWm4xZVJtNEd0aUt4Qk5aSi9QUTRNb0hwQzRkVjBKdlB5dGYzOTQrVzBwd0FwQjJuWHBrMk5qakVQb1BvMUlPU3kyS1JDaDRvODB0N2QzVjhPdXdyd1ZmU2hhRFFZakVRZVJ2WEhRR0NSTkZuZ01TY1kvUG0yWThjbWZUUnZCcjZKL3VmNjlSc3JSUDVWYTl0Ulh3aEZUb25xN1Z0N2VycDk0U3VDNVFOSDRQYmEyb2NxUlU3NkpoaEFkWVBDd2M2Tkc2L3pqVE9QVWx2NjQ4M0I0RXUvWDdWcVM0MXQrMkxRaHlBU3R4M25rNXY3K3Q3eGk3S1VscjYxeHJhN0hvMUd5eWNZUURYaVdOYmZ1MXRhbHZ0RnVWalJ0d0l2UE5EUVVIdFZZTEgreWhOV3BWVWY5NHRzTWFLM0F4MDdRcUVsdDBRaUMyYjJFWGQwTmpmdjhvUElxK2c2NEVXZytrY3JWL3BSdnllSTZtNzFZY1paNGpIL0hxQmhXeWhFVTJXbHA0STlxUlRQajQxeElwVWk2VGhFYkp0dG9SQmZYcmFNYUVXRk94S1J6U2V1dWVZem5EeTUzNlBkcytCRjlFYmdHd0JmOU5DdE02cnNHUnJpMmRGUnRPajUrVXlHM3FrcC9ocUw4WU1ycnVDZStucFhmT280ZHdNbGlmYlN2ZThGYkF1NHFhYkdkYUdPV0d6Zk02T2p0eW5zQXI0SHZBd2Y2TStxOHV1TEYvbmo4TEE3UXBIYmpyYTNsK1E5M1k0UEc3Z0ExRFZWVnZKVVk2TmIvbWRiZTNxK05NZnpHNEFPb0tId3dBSTZHaHRaNTJMWXFERTcyL3I2M25ScnhPVncyOUx0NUp3WVRjR2dhM0tqK3F0NVhoMEFiZ0ZTTTNtQnAySXhWN3dpMHVyYWlEbmdWdlJNSlZIMzgzS3lyYmYzeUVlOFB3SHNMWDV3T0psMHkvMEp0eG5uZ2x2UmF3cUppUHZvYTFpWTVidm13cCtLLzhTeVdYZk1sbFhuMW9nNWk3dk1GeTRrbGxxdWZkK1ZyNjFldmRBQTdRZG1sbyt1cHk1VjkyTnNEcmhWTU5QdkVvN2pscnVpTmhpOFpZRThTNEdaRDNOak9Qd1JXVCtBaUpTMHcrSlc5S1ZDWXR5OWFCQjU2T21jNTU4UE54ZHNDTnMyZHkxM3Q2WXd4cmljMythR1c5R25Db2x6bVl3WC90WjFMUzIvbVNkMEZPQUJnQW9SZGw5MUZjdVh1SXVWTEpGM3ZSanhvZkl1OHgwaTc1UjZwcWE4MWFENi9lUE56YzkzTmpWZFhmUlVnTjNBOWVzcUszbGk5V3AyVmxlN3BqU1dkY3liRWJQaEpYanZBamJaSWh6Y3NJRks5dzZ0Z0xUQ2ErY3ltWGNQVEV4OEttMU04OWFxS3JaV1ZYbGRRVXhYcDlPUmRmMzkwMTROS01CTDdQMDBzTWxSNVVneXlRMHVuVTRSS2dRK0Z3MEVYSS9kZWZCcUtZTEJXK3pkUWI2THY1NUlsRkpuU1ZEVmwwcmw4Q0s2bi96cTVzREVCSTR1RkhlVUFTS081VGd2bGtyamRXRHVCUmpKWmpuNC8yaHQxZjFiVDU4K1Z5cU5WOUg3Z1U2QUY4YkdTcTNiTTFUa0NUOTR2SXBXNEVHQU54SUozdmMyWjVjR2tYTkxvZVR4REl2YkdId0ZPT0NvOHVUSWlCODJ1SUtxN20zcDdrNzd3YlhZTGVCN2dld0xZMlBFdllTbGk4ZFlPcDMrZzE5a2k5Mmx2d2lzektqdVdDTENqcERiZzhuRlFVVWUyWDdxVkVuN1lzVW81WVRqcDhCLzk4VmlqTGhkQnk4T0krbnA2Y2Y4SkN4RjlEandyWlF4K29UYlRiMUZRT0VSdncvclN6MjFmQlg0M2RPam81enh1aEJ4aHpQaGRQcTNmcFA2Y1ZSN3Y2TjZldmZRMElKN1ExNmg4TU5TNCt5NTRJZm9TZUR1enNuSnpQNXgvM3Fod0hOdFBUMnYrRVpZQkQ5RUE3d0ozTDluYUlpa01hV3ppYVRVbUorVVRqUTMvRHhZUHB3eXB0bFJiYm5XdzRiQVhCRFZYN1QyOVpXOHNKZ1BmclYwQWQvZUY0djF2cE5LTFp4emZod1BXTmFqZmhrMEYvd1duY2lxM3ZIdytmT0o2Y1V0UGFlTlpYM1RyM0J6UHBUajNzU2xVY2ZwVEt2ZWVWMTF0YWVkSUJYNVdYdDM5M05sc0drV3luVlo1R3hQS2pYV0ZncnQrcGpMWXlDQncyZDZlcjd6ek1LbklpV2piRGRrREJ3WlNLY2JQMXRUczZWQ0ZtendDVlIzZlhxNGpLRmRFVngzdjBQUmFEQllYYjFTNFVxeHJCVUNkWWhFVkRXQ1NDUi81N01hUUtGU0lHaEEvanc4dk9PZSt2cVAza1ZVUFNlV05aUkxhZ3FZeXZPa0pKOEdFb2pFVVkyak9pWWljWVdZR25NUmtmUHhWT3JDVFlPRHJzTENXYUtQdHJjSEpKbmNiTnQydTZxdVEyUXRxbzNBMVVCdFVkWUVJcGRRalJjTUVaRzRxcVlRY2RTWWNRQVJjYVlnZVhoaTRyNGJ3K0hpOGtVV3lIOEUvcUtxTlNKaTU0WFhxS29OSUpaVmc2b3RJc0ZaSHpqM2UwWGhRK2N4Qmd5cTZvQ0lESWpJR1RIbWFLYXE2cDF0eDQ3TjdIaklvV2cwV0ZWVDgxWGdMb1hyeVowdkRRSzlxQTZJWlExZ3pMdHEyeGVzVE9iOVpESTV0UE85OXp6TlNiZUZ3L1VQUnFPdlY0ZzBYZmFxMndrR2Q1UnlCL1JRTkJvTWhVSU5KaEM0VWh4bkpaYTFSbzFwRkpHMW1yc3lzaHFZQnQ1QVpOOVlNdGtoeDV1Yi82MndCZFcvcWNnL1REYjcxcmJUcDMwZlcyOXYzTGdheTNvTEtGd3VtVkNSYTl1NnUzdjhycXNZUjlldnI3ZVdMTmt1SWw5QTlTdkEyNWJteHVLNFd0WUZXL1VDNFhDOEhKVzM5dlVOYXU0cWRCWXdZbGwzbGxzd0FPRnczSUloelYwZmlRTVI2ZHEwYVZuV21PK0s2dGVCbHJ6ak9LN1FKNnBualdXZHhYRUdqVzJmUzhmamw3eDI3Y3Z4ZGxQVGZVQkZhMi92TDMyUUJFQjNTOHZ5dERGMXFsb3Z0cjFHakdsVWtiVkFrOEFXelIwSG54U1JKelVRZUh5V0l6dXhlZk1Lazhsc1Y4dHFFOVgxZVVlMkZsaFJsRzBDZUI4WW5YRmtNRXJPbXlhczNQakJxRTVhSXRNQXFwb0UwZ0FLQ1ZITmFtRStGZ2xJM2hrSkxFV2tLbCsrMGhMSkhiNnJWZ0VoaFRxRk9vSGxBblVxVW9kcUhiTWp5d3VvbmtWa1FGUlBLWFJhZ2NEUkxWMWRGd3NaWEUxWlI5dmJxd0tKeEVwSHBDRS9YVFVZa1dVWVU0dElyWldidW1xQUNpQWlJbFplYktUSW9OcWkrcGJsZjVXY3g0WGNYWnZDMEhJS0IrK3FtZ1VtRUprV2lDbU1pREVqQmtaRVpGaEVoaDJSRVR1ZEhwbWNuSXk1NlluL0E4RklTMjA1T1NLZUFBQUFBRWxGVGtTdVFtQ0MnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgbGFzdFdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogdHJ1ZSwgdGV4dDogJycsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUQwQUFBQTlDQVlBQUFBZVltSHBBQUFBQm1KTFIwUUEvd0QvQVArZ3ZhZVRBQUFBQ1hCSVdYTUFBQUJJQUFBQVNBQkd5V3MrQUFBWTFrbEVRVlJvM3FXYmFheGwyWFhYZjJ2dGM4NGQzdnhlRFQxUDduYmI3bTdiM2M1azRoZ0xNQi95SWJFaUVFSUpFaUFIZ1JBU2dnQkJJUjlRNUVnZ2hJUVZSOUFKaWJDSUVRcUtGREdJS1NHT29SUFNkbHZkZEx1ckozZjFVRlZkVmErcTNuU25jODVlaXc5N24zdnZxOEZkRFVlNjlXNjlkKzg1ZSswMS85ZC9pN3R6dTVjWnFLYjNidUFLT0JpR3UyQU9CcGhEZE1jOC9UNGk0STQ3SUxlNHVZTUlJRUxBRVhGVWxDQ0NDaWlnUXZvOUNnSmlJSHJqMnQ3dmt0c1IyajJ2VmNETWNGWGNESFBCM0RBVWMyZ3M0aWlORzYwNXJVTTBUNXZoNElDWnU2aUlPUTZPaW9pYnU2cUlaTUZVb0ZBaDVKK2xLSUpSYWtBRkFvYUlvdUtJS21LR1pvbTkyN3ovSDZFZHdNQWx2WGV6dEhoM29pdlJqY2FkeHFCMXA0N1FBdFBXdkRFbk9yU2QwT1lZam9nc05PN2c3aWlDYU5KcWtWK2xDcjFDcFFDcUFLVUloVUlsa3EzQVVCR1NnU2hCazhaRmIyMVFBTVg3Q2V4NTkwM1NvaU1rUWN4cFBWSWJ6RnFuTm1kcTdyTUlVelBxNkxRR2pUa3pnem9hclVHVXREQnpBMEJGVUJXQ2t3UUtTaytoREVJcDBBdm1sU3FEQUpXSzlBcWhDbEJKbkc5TTByNWpwUGZXYWZTREN0MEpUUGJQNkVtN3JTVnQxZ2ExT1pQV21VVDNTV3RNczhCVGcvMjY1YWlCVWVQc05aSEQyaGpGOUpuV0hmUDBCSkZrdm4yRmxWSllxd0tiUlVqdlMyR2pDdlRWNkt2U0svQmhWQVpCcEIrRW5ncFJuVEtrK0ZKWVdyTWd1TnhhOE9KV0FuY080Z2dHdERHWmNXMHdhWjJaT2FQV2ZOdzRvOWFZbW5OVU81ZW1MVmRxNC93NGNtWFdzaitER1pZZTN1MmtMRDlGd09PeDFaV3FiSlJ3c2w5dzEwcGdwMUpPOUFyV0sySFVHaXNoK0xDRVFhRXlWS0dQVUxyakdpZzBCVDNKem4yejJIbURUL3RjM3FRTlE0bnUxRm13U1hSR2pmdFJheHpXeHNTYy9TWnlidFJ5YmhSNWQ5eHdlV3FZSk10d0U2SWJTSXJ1MHNtZW55dlpKenMzRW5kVU5VZHZJUmljSENwM0R3dnVXUzI0YzFDd1ZRWUdLcXhXeW1xcHJCUWlneUQwZzJhM0VJVHM3em1xeWEyRXZsN2c2QkJkbUVWbkdvMVI2NHlpKzBGdEhOU1JvOVo0ZDlUeTNhT0dkNDVhZHV1NEVGU1M3N3VsZTdrSXVPRGNQSEFLQXVKSmFFbEJMUWdFQjFFbmlMRFRDOXk3VXZDaDFaSjdWZ3BXUzJXOURLeVZ5bW9oTWl5RVFWQ3FJQVJ4Z25CVHdZc2JCS2JMdFVMcktRQ05XK2VvTlE0Yjg0UEdPR2ljSzdPR1YvWmFYajlxdURpT1JFaUJLdnQrbDZ2SnVkdmRFZUY3Q0wzNGpKTEMvVHhIZTRybWx5YkcxV25OeFVua1E3T1NSOWRLbWo3VVpyU21IbDNGSFZ5RW51bzh6U29MQzVOT2FPL3NQeS9Xa0JTd2NxQTZhbzM5Mm55dmpodzJ6anZqeUl2WFpwdzlhamxxblJpTk5uL0hSTEJvODd6c25aaSt2TFZ5ay9jKy81VUE0a0xFazlCQmFjMHBGS0k0NThiT1htMWNuVVVlMyt4eDc3Qkk5VUI2bktDYUVyWUtoYVRDS0JVMlNjWmpnY3c5aGYwMnBrQTFqc1pSWXh5MDd0ZnE1TU92SFRZOGY3WG0zTGlsTm1nc0ZTS1JWSWk0ZTBwdnZyQWRSNDdMZWF1NEtvdk42VDVxSW1oclNFNUZNYWNtYTV3emV3MUhqVk52OTNsb3JjREZ3TVZkVENpQlhMa1ZtbUpGWithRjUyQmlwRnhzQm8ybm9EVnFuYjBtK3Q0c3BaMVg5bXUrZlhYR3BVbGs1azVyUWpTbjdVcFFBOGVBSERXRkpERGZJMzljL3dkWm1HSEthazUwUjF5VDYwa0tGbEhUQnJ3emFxbmpsTnBMSGxtclVpR0Z1SXFJaWhGRWM0eEk5MVFSQ29GY0ppWnROUWJUQ09QR09XeWlIemJPUVJONS9hRGh1YXMxbHllUm1VTWRuV2lMSE82ZGlYWlJPcWVMMjYvc2I3SUpPUU9vQ081R2RNRmNjSEdDYTRvQk9POU5XcDdkTlFUaHcyc1FORkJvOUVBUVdhb0F1elJXdUNVcmlER1pUVzJXSTdYTm8vUjNqMXErZFhYR3BVbEw0OG1rb3d2UmpOWWxHeHlZTElLSEgxLytQQnUwMW0zUzR1OUJJR2pTZ0dZVG5HOVd0M2tpcUZzcVkxMFgzVWJ1TkM1Tkl0L2FuVklKaEpBaWZ5bmloWW9VYXFnb2lxT0ZVSmgyQ2xMYWFFeWpNMjdkRDVzVXBDNk1JeTlkblhGaDFOS1lVK00wSm5oTURZZlQrWnN1RnJ2a2w3WEJKQm9sOExHdEhrOXNWZHc5TE5qb0JkeU12Y1k1UDI1NTZWckRTL3MxalVVR1FTbTcramtMVGQ1VXhWTGVkOFZqMHBoanVBam5KOGJ6MTJxR3BSSldDaXAxU2hWS1ZRcHh5cUI0TG5lcGM0YzBhMkVXblhFVE9XcUZhM1hrT3djMXJ4MUZvanNOUW95cDB6S1gxRktLSG8vRDJkVGJYQUQvNE1rZWYrNmhOVDV6cWkrVDF2aldsZHJmT0t3NWU5Z0FzRmtKbnowOTRHOStiRU1HUWZqR2UxUC9OMmVQZUhaM2x0S0w1cWlRaGJjY25LSWI2a2xSdU5Lb0lPSjg5N0JscTFlelZpcjlVTkNQN3Ixb1VpQ29Sdm9lS016Si9nSXpZTkxpUjFFNGFscmVQR3c1czlkZ2JxbUx5cEY2V2VCamdkZFRPMWtJZlBya2dMLyswVFYyZXNxL2ZPMlFuM2wyMTkrNVZqT1BhMTMvNTR2Y2R1OVd4Wis5ZjVVdlBiWEY3c1Q1OGl0N2ZQUHlESVBjWXkrMDdxS3BhWEdsdFJROGd3aHRnQmYzYWs3MkFzT2c5RlhwRitvOVJTcFBqWTdVMFpsYVpOSTRodzFjbWJWK2RScDU0NmpobVVzVDNqaUsxTkZvb3RONENsNG1UbW9HajZlN3htR3JFdjdXWTlzOHVWM3lqMS9hNDJ1dkhnSWtYOHE1OG1aWHQySFdwbHIxSng5ZTQrOS9mSk0vMnEzNXB5L3VzZC9ZRGQ5UFVkNVFGNEttanF0SzdTZ1ByUlo4NWxTZkIxWkxkdnFCbmFxUXRSNE1nNkpPRXFReG1KcjVKRHI3VFNvdjN4cTFXTGFDU0FjRTNGakNlKzZuSDkybytPYy9kSnJvenFmLzB6bSs5dW9oWlNuMEtxWFVSVGw0czZndUlxbC9ycFN5RUg3anRVTSs5Ui9PSWU1ODVZZE84T0gxa3NiSTNkbnhTTzkwRmFBa3hiaHg5cWpoM2JGeDBGanFCTTI4aWFsaTFHU3lrcnFtYUl4Ylk3YzJYajlzbHdBQXlhVmxxcUU5VmNwemdXY1JQclhUNHg5OTN3Ny83cTBqdnZoN0Y2bWowNnYwV0RUdUdnMHhSNkxoMFhETHlXNHA0cXNrNGR2by9LV3ZYK1RmdnozbUY1N2M1cW1kSG8wdE5TdWtPc0JGNXFXdnU5TGtjdmlWL1JsWGFtTWNqWEYwcGpFcHA0Z3V0R1pNby91MGRZNWl5bnZ2VGR1MGUrWXBQWGxuVWtzQ0E5UG9mR3lqNHU4K3NjblRaL1o0K2p0N2xMMHdGemJEWTBnZG9ZblFHQkp6SlpNa2hGN1JJUWg0U05LbklDWm9wZnlURjY5eTBCcC8rN0VOdnZUQ0hpL3UxZlRVbHpvMFNmck9hVEdZWXlxOE40MjhOMm80MVF1c0ZFWWRrcXhGNndrTW1GbnFwQTVta2JjT0dzeWdaUUVlZU5jcExWM1JuSjFlNE84OHNjbHZ2enZoNlRNSGxGVTRubXZyaUl3YVpGUW53VzBCWXMzdjVqTzhVRmdwWVZqQk1NdzNWMFVvQ3VYcFYvZlpxSlMvOGRFTmZ1N2JWN2syaTVSTHkwbDl2eU81VVNyY2lTYThlZFR5NEpxeFhpa3pjMi9NUldQR3RlcVl6SFMvTnM1UDJsUnBtY3lydGVPbFJqS3gycDB2Zm5pRGMrUElMMzFuanlJcythMlFoTDA4UnE5T2tGbE1Yd3k2UVAvbUx4QXpaSCtLWEI0aGU5TVVSRHB6UnloVWVQcVZBODVQV3Y3aXcrdkVySWlsb0lBdmQzaVdUUDdDeE5odkl0UG96TEo1YThLNjBpL0dyWE5wRmhsSGlFajJFY21kMG5FVW9qRjRZclBpeVoyU0w3Kzh4elJhNm1RNmdZOXE1TW9ZbmJiSnhEVzV5S1F4SnJQSVpOcW1WeDJUbitZTkVUUGsyaFM5T2w0Q0dsSjdlTlFhdi9ycUFZOXZsankrbWZ4NzRkdGRSK2NKZHZZa3c3ZzFMazRqMHpiSjJMcFQ1QmJTYS9QMGdYR2NSOE41ZTloMUQ4dkJ5NXcvLzhBYS8rMzhtRmYyNjBYckppRFRCdGtkSjkvVjFNNU5HNk5YQ0gveW9YV2V2SFBJenJCZzFocXZYNW54dTJjUE9IL1FVSVZVanVLT0hNMFFCVDh4UkhJdEwrNmMyYS81L1lzVC9zd0RLL3o4dDJlVXZraGpxWXRNYStnczFJRUxZK01qNjhZc0tyVzVGK2FwK1c4TlpnYTdzeGEzaFpsMHByMnM1ZWp3NEZyQnd4c2xYejZ6UjIycElPbEFPUzZONWdLYk8yMTBucnByeU05OTlpNmV1bk1vSjFkS2hxWFFHbHlidEp6ZHIvMWZmZnN5di9iY0ZacG9sQ0gxdzdJL2cyR0ZEd3NrM1k1UjYvejM4MlArNFpNN1BMUlc4dTZvWGZMdHBQTzV3aktnY0dtUzJ1Q1laUzFjRWpyWmVHVFdSdllieDhXSnNmdFM1enNMVFRmbS9PQ0pQbWYyYXM2UDIwV1pLTUQrRktsVEUrRHVtTUduNzF2bHF6L3hvRHk0MVQ4V0NNc0FwMVpMVHEyVzh2SFRBKzVkci93WHYzR0JhZU1wUHJqamwwZnd3R2JhaEF3SXZEdU92SGJROEttZEhtY1BHMHFWdWRDcERrOGFqNVoyNnJBeFp0RlM3KythZk5weTkzUFlwUFRrdVJWTDRQNk5GVlJqOE1tdGloZjJhc1p0MGtDS09JcnVUUkZORzlCRTU0N1ZrbC83d2dNM0NIejkxUytVbi8zc1hmS0ZqMndSUXJJUUpLVTZtYlp6U0RjSUhOVEdxL3MxajIyVWM3OWV2dHdXblZtVWhBUWQxRFlmT21pcVlWTWhQNHFXWUY4VGZBazR2cjdjTEJUdVhTMTU0N0JsR24zeDkxa0RkWngvcmw4cVAvWEpiUjdaR1hDNzF5OSsvaDVacTVSb3lVbEZCZlpueDlMY0tEcG5SNUc3VndyNmhkNVlwYzBMQ2NFVFFNZFI5RHlaQVhXelBHOUt0ZlVOVGY5MWlqYUhFNE5BY0xnd2JtazdueGVRSEtrN0lHRzFWSDd5NHlkdVcyQ0FlOVlyUG5ISElBZWxwRzJ0bTJQcmlHYnNUbHR3NFVRdnBhcWJyYm1yMnh5bjhZd09tYU9Jb0pvbWltMlVEUEhjR3ZGd1lDVUkwMXpqZHY0TUlNMnlSVUFabE1kT0RkNW5uSGJqOVgxM3JjMERJNUNhOGs2ZS9LeldvQUVHaGR4eXJjdmZhZHVZU3VBOERQakFrSTZLcGxIdDhUdUR4YmtaT2hEMC93MHNXdTB0cWV1bUMweTljNXFIM2Q2ZXhxV2JhT2ZEa29kZ1haeSsxYTBFR0RXUlhpRVVHVURvQUR5dkFpdzFBNjBKUjdYeFFhK3oxNXBVVXViLzI5TGMyVE1xVStTdWJOYTgvLzNkb1FvaHV3eW9xQkpVVUlReXlCempPdFpWTEFzdGNLMU8xZGRXRlZESmd6aEk5WFArdkFxTUcrTy92cjcvZ2RYOXY5NCtUSUVzUDErcVlubkFob3F3VmlrRndyWEdGOWxqOFpINVdwRzB0bEpTT1p1bXBKNEVDR0tzaENTdFNDbzZ1em5iOHFwRmhFbHJ2RGR1ZVdpOW9LKzZ3TVVHNVJ3elVvRlJIZm4xNXk1L0lJRi84NldyZnY2d21WZDR1T09yMWR5Q0hCZ0U1ZjZWa3N2VHlHRnJOMXBsUnlMSXd3SWt4U0hwU3YzUXpYZEZXQzJWNEk0NlNMWnprZU9LNmxxK0YvWnFIdHVvR0JRcFVnTVFCRnNwTTlDWUFzei9mUHVJci96dlM3ZWw3VGV1VHZuUzF5OHdibUphYk5lL3I1WjB5ekNIOVZKNGVMWGt6SDU5VXpSR1pERXBWRS9RNFhvbGhMVEVSTk1vUkNnU2xzUmFwYW5rVSthUldVU09xYnRVNGRuZEdSL2ZxampaRHd0d0lEcStNMGlSd2RNczZyQ08vTUxYei9ITHoxNzBLK1AycHNLYU8zL3d6cEgvOUcrZjllOWNuaXlHYnViNFdpK1ZiblFUR0RnOURIeGtzK1NiVitxbGFveDUxZGIxMlVGVFdieFNoVFRSbERUbUtVSitVMm9hZFc3MUE5ZnFpTnFDNEdMdXh3ZGdBaS92MWV3MXh1ZE9EM2p6cUoxL2hsNkpiL1NSWEptVnF1eU9XLzdlZjNtWFAzaHI1SC9xNFhVZTJ1cXgzZ3MwMGJsdzFQRE5jeVArN1l0WGVmM0tsQ0lrdjhNY0x3TnNEK2dRakdUYXdoODcyZWV3TWM3czE1VEh5RFVPSkxSRzgvQlBCSFo2Z1Y0ZTQ0Wk82REpBRllSQkVFNzFsVGNQTzRGdHlUK1dBSHBKU01Wdm5oM3h4VWZXK00vbko3d3phbEx6YWNEV0VHOHNBUWRaOERvNi8vcjVYWDdyNVdzOHROMWpveDlvV3VlZGc1b0wyWWVyc0tSaEZmemtFQzhFeWJ5VTZQRGdTc0dQM3IzQ1Y3OTdtTGdxUzRoc0Vqa0JDWnJaU1FpYzZpbjlrRURETWlDcWliY2hsUWo5QUtkNmdVcEl6SjNzMDhrL2o3dGxGWVJuTGsyNE9JMzg5S1ByZVlDZlhTbTNoTFpXZ2FjTkNpcjB5elI5ZlBueWhHZmVQdUtiNTBmc2psdjZSVUl3QlNBYVhpbCthZ1VmSHZmbFF1RXZmR2lOSzdQSUgxNmVVb1hqdVh4dTJySVkrWllxM0RVSTlCSm5KVUZRaFNibkxrT3Fialo3Z1ZPRGtLR2FGT0E2elM0UEhqVWpGVjk1ZVovUG5lN3pFdytzMGtiUDg2V1V2bnhuaU8zMG9WU0lobmg2VmhWUy9PZ1ZtZ0lSTEV4NHJZZWZXTUZYbGdWTzhQQ1AzN1BLajV3YThQU3JLYVV0dzFLeWJJVWk4NEIxdWgvWTdBVUdSWnFhRkFJYUpCRldlaXIwZ3JCUkt2ZXRWdGwzMHczVU84VHF1TFpMaGJlT0duN3A1WDMrd1NlMitmVHBBWFZqaXdJbktMN2V3MDZ0WUR0RFBBZTlOTDNQVGJ6bkRkcnNZWGVzcFVEWUwrWUN1enRONi96STZRRS84L2dtdi9MYUFXOGVOVlEzRU9YU1ptc09vRUVGUVhod3RXSzFWSHFxOUVJZThTU0NtbEtwU1QrSXJ4VEtuUU5scHgvWW5VWUtkMXdWOHpodkFMb3RFRW4wcG05Y25MSitacDlmLytGVDhwZWZ1ZVRQdkR1bTZ1bDgxNzBxa2ltdFZjbGZZOWZqU1ZKOVRxQ3V4d0ZEZDZlZUdaKzdiNFYvOXYwbitPVXorL3orZXhNcTVSaUdMaG5NVWxHQ2FxSmVxTEJkS1hjTWxaVkN5R3drU1psS2hDQXhVWmFDTVN6Z3hLRGc0YldTSzFPakVDZG0wc3FDUnJIQXkxU0VRcDMvK002WWNZdC83VE9uNUV2LzU1ci95a3Y3U0puNEgvTkJYQkFJa0FibU4xN0wyYmFPanRmR1gzMWlrNS85eExiOC9MZDIvWCs4TjcxaHNpbExxVXBGVUN4WnFNT0gxOU4wWTlnSkhZUkNuRUl4cWlEVUJrTVhtUVQxelJMdUhaYTgyYXU1T0lXeUNGZ1RjMUdVWjBpNTdsNFcvSGN2akhsN1ZQdVh2LzhrUDNiZkNuL3RtVjNlM1p0QkZhNHpSMWxXNTdIb1cxdjY1KzZ0a2wvOS9GM2MzUS84MU85ZDlMTkhUYUpMWFQvS2RVTlJRbGVQaDhRa1BOVUwzTDlhc0ZrcWc2RDBnMGhWS0pXQ3FpZ3FTaFdjdmdSV0NtR2xnSHRXQWgvYjZsTktTRGRVSlJTQ2hvNWJZTWNlcmlKVUNtOGN0dnpvNzV6bjViMkc1MzdzSHZucW43aUxKM2Q2MUxWUk40bEpXSnRSeC93eVQ3OXJqTG8ybmpyUjR6YytmNW9Ydm5DZlBIOXR4cC8rbmZPOE5Xb29ieUt3NUxtNEJpY1VRZ2hPS1VuNEo3WjczREVzV1FuS3NCUUdLcFRxaUNqU1JLUDF0SmhwRlBZYjQ5b3MrdTQwY203UzhvZVhaM3hucjA3a09ZVEduTVljaXdhNm1FdDM1dGxWVFpQVzJDZ0wvc3FqYS96NGZTdGlEdCs0T1BYbnJzNTRlOVN3VjZlbGIxYkNmU3NsVDIzMytPTjM5RVdBMzNwcjVQL2kxWDBPYTJlbFhNU1A1VENxR0ZnaTRhUVpkT0tQbFFxUGIxWDh3RTZQdTFjTFRsU0JyVjZROVZMcHE5TXZCRW1nZmhKa0ZwbFRwNjVNRStQdnU0ZVJaeTVQT1Q5dUVqV3lOV295RXlrbWtweG5Cc0wxYzJwelp4d2RkZWZqTzMxKzRFU1BqNnhYM0xrU1dDOEQ0T3czem9WeHk2c0hOWCswTytYNXF3M216akFrenVqTmVFanFLZjFwU05Ub0FxY3FrbW5mTXl6NDRaTjlIbHdON1BRTGRucUJ0VkpscFZCNklaWFFCZTZKUzYySmFqZ0lRbXNpcTVWNmJZSDdWNVZSYTB4aW9qQjVrV2pQMFFTQ1l0RlFXVzdtczBaeWpsL0xNUERMZXpVdlhKdWxVVysyaHFTeFpMWkJFOHQzRUpoWFdSMkMweG4xL09leXdPcVVtbkx3ZGhYNDVIYVArMVpLVnF2VVFIVTgwakpqNmdvcGVrZFAvYVpveWlURG9FU1FhTzdSalVmV1N5Wm1QSGRseG42ZEtBOE5udWhJUVRPcktQZlZTeGowY3RsYUJhaHVBK1ZZaHFxV2hlMWdhRVVKWVdtalZLbFUyQ3lGcDdaTFByUmFaQ0t0c2xhcURJTFN5NlpmZEpTcUZJUVNzSmRMVWl3azJEUldLdEVTb1BqWWVvV1o4TUsxS2RlYXhPUVJISFdoSmJNVDVpdk93aTlOUm00WFNWZ005WHdCRHVhbmFhNjBRcVpRbHFtV1pxdFNudHp1OGRITmlzMWVZTDFTMWd1VlFTSDBzNzkzellmNEVrMnlTejFCb1hJbklxeWdlSVdZNEc2Qko3YlRRMTY0T21OM2xzQ0hOaWJ1Wm5TWlR4VmlsckpiOVBVYmNHczEreHpTNmI0aklnUTZBQ0RuMlNCenJ2ZUpudktKN1I2UHJwZHNWOHBtcFd4VUtpdWxKb0Z6Yk5DbExIbU1NZGkxcHFLQzVZZGFJU2xDWjlyaDR4czkra0Y0YWEvbTNGSExMSGMxTVI5ZmNNOWRVVzVTTEVNdjBvRUMxNnZVbC80N0YzUkJaQlU4MS85T0llbDlxZEJYNFo3VmtzZldTeDdhS05rb1F4STRrV1BwNTdLNjZ5MlcyKzRDT21aZng4bE1RcGVXdW9QRUxYRVIzSU1haFNnZkRSWHJaZUNWYXNickJ6V0hyZERtU2loYVloYTVDR2FKT3UwWmQ1cnpSSFAwNy94OXppdGNZdXlxZUlyZWViaWdxaFNlNm9YMVNuaGt2ZVRSalI1M0RSSUxlS09TRktXRE1waFhYN2xoOGlVWjVUcno3alpBdXhZTGgzeG9SQWlTQ0c3dWlkQ1NIblJIUC9ER1ljdWJveWJSSGtndFlEUW41b21saVdhYWhXU2F4UklTMDUzQjZEU3NBbTZaQWV5SkNFYzZuMUdKOE1CYXljTnJKZmV0Rm14VktXaXRsY3BhS1RMb0JDNlVNdGZmeThkRmJtcmVuZEJrLzZZajVoVVpmakdsRUpOQzFDdDFlbHF3WGdpbmh3VVBURXJlT3F4NTY4aVp4SmF5NkxncWlhaGpvaG56U2h6d2VYUGhqcWhrVEU3bUhPMGdpZWlPdzZCUTdsOVJIbGd0dVhOWWNxcW5ESXRNY2k4a2s5d3pVSkRQZmlRLzdncWI2MlM4MVdtZFpXSk1PbjZVQ3hoenBtMHFPc2FOK3lnVDRJOVNKY2VWMm5sbk5PUDh4TmlkR0czMlk4OUhJOXpueWEwejlLVXBTZXFVQktmUU5MSzVleGk0ZDloanV5ZHM5d1BEUWxrSmljdytMRVdHUVJnVU1xZFRMU0sxM0JLLy81NUhsRG9nMzBuekk4dGNzY1pnWnM2c3pZei9UTktaUm1kcXp2N01PSXpPNFN4eXRZbGNtclRzMTg0b0p2NTRhOGVMazBLVEVLc2xiSlNCa3dObHB5eFlyWVQxTWdXbktnczNDTUl3YURxNGtnTldrY0dCSXAvYjZyUjd5NEhGK3g1Rzg1VER6VklZU2tjYzhpekpuVG9hTTROWmEwd2lQbzNHTEVLTlU3ZHBFeFo4ai9ScTgvZkovcDhXbklDTUtxUTJzSzlKcUJLaEY2QWZsRUdCOUxJWmQ3VjJGNTJEa0E2bWVaNVZmWS9zZUZzbjhDd0hta1JlTnl5Q2t3Nml0Wm4zWFZ2dW1KSmdQdk0wbjY0dDBaalN3YlRNQ25TZmo0SzdBeXBkcEsxVUNLcFU2Z25weUJoZVR6c1RWZ3BOblZUSVFWWkRJdlNHdk5iM08zMTRXMElmVTN3K1krbTVFREVneGtnVUpWcWtiZ1dUaFRZYmk3U210TzRlTTJFOWNWa1dQdDFoY1NHakdvV2tJNGFkRmFnTFZlRUVEUVEzUWdqcFhFWlhaYzFaMEl2amg5L3IrcjljM3dMdDdJUElPQUFBQUNWMFJWaDBaR0YwWlRwamNtVmhkR1VBTWpBeE9DMHhNQzB5TlZReU1qbzBNem93Tmkwd05Ub3dNRkN6a0NvQUFBQWxkRVZZZEdSaGRHVTZiVzlrYVdaNUFESXdNVGd0TVRBdE1qVlVNakk2TkRNNk1EWXRNRFU2TURBaDdpaVdBQUFBQUVsRlRrU3VRbUNDJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICB2aWFwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICB3YXlwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IGZhbHNlIH0sXHJcbiAgICAgICAgYXV0b1VwZGF0ZU1hcFZpZXc6IHRydWUsXHJcbiAgICAgICAgLy9pdGluZXJhcnlDb250YWluZXI6ICcjZGlyZWN0aW9uc0l0aW5lcmFyeSdcclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICAvL2Rpck1hbmFnZXIuc2hvd0lucHV0UGFuZWwoJ2RpcmVjdGlvbnNQYW5lbCcpO1xyXG5cclxuICAgICAgY29uc3Qgd2F5cG9pbnQxID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuV2F5cG9pbnQoe1xyXG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24obG9jYy5sYXRpdHVkZSwgbG9jYy5sb25naXR1ZGUpXHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICBjb25zdCB3YXlwb2ludDIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5XYXlwb2ludCh7XHJcbiAgICAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihlbmRMYXQsIGVuZExvbmcpLCBcclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIGRpck1hbmFnZXIuYWRkV2F5cG9pbnQod2F5cG9pbnQxKTtcclxuICAgICAgZGlyTWFuYWdlci5hZGRXYXlwb2ludCh3YXlwb2ludDIpO1xyXG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihkaXJNYW5hZ2VyLCAnZGlyZWN0aW9uc1VwZGF0ZWQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIC8vbWFwcy5sYXllcnMuY2xlYXIoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRpck1hbmFnZXIuY2FsY3VsYXRlRGlyZWN0aW9ucygpO1xyXG4gICAgICBcclxuICAgIH0pO1xyXG4gICAgfVxyXG4gICBcclxuICBcclxuICAgICAgICBmdW5jdGlvbiBnZXRUaWNrZXRJbmZvQm94SFRNTChkYXRhOiBhbnkpOlN0cmluZ3tcclxuICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgdmFyIGluZm9ib3hEYXRhID0gXCI8ZGl2IHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4Oyc+PGRpdiBzdHlsZT0ncG9zaXRpb246IHJlbGF0aXZlO3dpZHRoOjEwMCU7Jz5cIlxyXG4gICAgICAgICtcIjxkaXY+PGEgaHJlZj0namF2YXNjcmlwdDp2b2lkKDApJyBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUnPlwiK2RhdGEudGlja2V0TnVtYmVyK1wiIDwvYT4gPGkgY2xhc3M9J2ZhIGZhLXRpbWVzJyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz48L2k+PC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiICBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+U2V2ZXJpdHk6PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC04JyBzdHlsZT0nY29sb3I6cmVkOyc+XCIrZGF0YS50aWNrZXRTZXZlcml0eStcIjwvZGl2PlwiIFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+Q29tbW9uIElEOjwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSdjb2wtbWQtOCc+XCIrZGF0YS5jb21tb25JRCtcIjwvZGl2PlwiIFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIiBcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+QWZmZWN0aW5nOjwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSdjb2wtbWQtOCc+XCIrZGF0YS5jdXN0QWZmZWN0aW5nK1wiPC9kaXY+XCIgXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5TaG9ydERlc2NyaXB0Ojwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSdjb2wtbWQtOCc+XCIrZGF0YS5zaG9ydERlc2NyaXB0aW9uK1wiPC9kaXY+XCIgXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC0xMScgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PGhyIC8+PC9kaXY+XCJcclxuICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgIFxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgIHJldHVybiBpbmZvYm94RGF0YTtcclxuICAgICAgICB9XHJcbn1cclxuXHJcbiAgVXBkYXRlVGlja2V0SlNPTkRhdGFMaXN0KClcclxuICB7XHJcbiAgICBpZih0aGlzLnRpY2tldExpc3QubGVuZ3RoICE9MClcclxuICAgIHtcclxuICAgIHRoaXMudGlja2V0TGlzdC5UaWNrZXRJbmZvTGlzdC5UaWNrZXRJbmZvLmZvckVhY2godGlja2V0SW5mbyA9PiB7XHJcbiAgICAgIHZhciB0aWNrZXQ6IFRpY2tldCA9IG5ldyBUaWNrZXQoKTs7XHJcbiAgICAgIHRpY2tldEluZm8uRmllbGRUdXBsZUxpc3QuRmllbGRUdXBsZS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJUaWNrZXROdW1iZXJcIil7XHJcbiAgICAgICAgICAgIHRpY2tldC50aWNrZXROdW1iZXIgPSBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFbnRyeVR5cGVcIil7XHJcbiAgICAgICAgICB0aWNrZXQuZW50cnlUeXBlID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkNyZWF0ZURhdGVcIil7XHJcbiAgICAgICAgICB0aWNrZXQuY3JlYXRlRGF0ZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFcXVpcG1lbnRJRFwiKXtcclxuICAgICAgICAgIHRpY2tldC5lcXVpcG1lbnRJRCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDb21tb25JRFwiKXtcclxuICAgICAgICAgIHRpY2tldC5jb21tb25JRCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQYXJlbnRJRFwiKXtcclxuICAgICAgICAgIHRpY2tldC5wYXJlbnRJRCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDdXN0QWZmZWN0aW5nXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmN1c3RBZmZlY3RpbmcgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiVGlja2V0U2V2ZXJpdHlcIil7XHJcbiAgICAgICAgICB0aWNrZXQudGlja2V0U2V2ZXJpdHkgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQXNzaWduZWRUb1wiKXtcclxuICAgICAgICAgIHRpY2tldC5hc3NpZ25lZFRvID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlN1Ym1pdHRlZEJ5XCIpe1xyXG4gICAgICAgICAgdGlja2V0LnN1Ym1pdHRlZEJ5ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlByb2JsZW1TdWJjYXRlZ29yeVwiKXtcclxuICAgICAgICAgIHRpY2tldC5wcm9ibGVtU3ViY2F0ZWdvcnkgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUHJvYmxlbURldGFpbFwiKXtcclxuICAgICAgICAgIHRpY2tldC5wcm9ibGVtRGV0YWlsID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlByb2JsZW1DYXRlZ29yeVwiKXtcclxuICAgICAgICAgIHRpY2tldC5wcm9ibGVtQ2F0ZWdvcnkgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTGF0aXR1ZGVcIil7XHJcbiAgICAgICAgICB0aWNrZXQubGF0aXR1ZGUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTG9uZ2l0dWRlXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmxvbmdpdHVkZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQbGFubmVkUmVzdG9yYWxUaW1lXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnBsYW5uZWRSZXN0b3JhbFRpbWUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQWx0ZXJuYXRlU2l0ZUlEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmFsdGVybmF0ZVNpdGVJRCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMb2NhdGlvblJhbmtpbmdcIil7XHJcbiAgICAgICAgICB0aWNrZXQubG9jYXRpb25SYW5raW5nID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFzc2lnbmVkRGVwYXJ0bWVudFwiKXtcclxuICAgICAgICAgIHRpY2tldC5hc3NpZ25lZERlcGFydG1lbnQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUmVnaW9uXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnJlZ2lvbiA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJNYXJrZXRcIil7XHJcbiAgICAgICAgICB0aWNrZXQubWFya2V0ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIldvcmtSZXF1ZXN0SWRcIil7XHJcbiAgICAgICAgICB0aWNrZXQud29ya1JlcXVlc3RJZCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTaGlmdExvZ1wiKXtcclxuICAgICAgICAgIHRpY2tldC5zaGlmdExvZyA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBY3Rpb25cIil7XHJcbiAgICAgICAgICB0aWNrZXQuYWN0aW9uID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkVxdWlwbWVudE5hbWVcIil7XHJcbiAgICAgICAgICB0aWNrZXQuZXF1aXBtZW50TmFtZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTaG9ydERlc2NyaXB0aW9uXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnNob3J0RGVzY3JpcHRpb24gPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUGFyZW50TmFtZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5wYXJlbnROYW1lID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlRpY2tldFN0YXR1c1wiKXtcclxuICAgICAgICAgIHRpY2tldC50aWNrZXRTdGF0dXMgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTG9jYXRpb25JRFwiKXtcclxuICAgICAgICAgIHRpY2tldC5sb2NhdGlvbklEID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIk9wc0Rpc3RyaWN0XCIpe1xyXG4gICAgICAgICAgdGlja2V0Lm9wc0Rpc3RyaWN0ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIk9wc1pvbmVcIil7XHJcbiAgICAgICAgICB0aWNrZXQub3BzWm9uZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMudGlja2V0RGF0YS5wdXNoKHRpY2tldCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLmNvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSdHRhbWFwbGliQ29tcG9uZW50IH0gZnJvbSAnLi9ydHRhbWFwbGliLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbUnR0YW1hcGxpYkNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtSdHRhbWFwbGliQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBSdHRhbWFwbGliTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbIkhlYWRlcnMiLCJSZXF1ZXN0T3B0aW9ucyIsIk9ic2VydmFibGUiLCJpby5jb25uZWN0IiwiSW5qZWN0YWJsZSIsIkh0dHAiLCJFdmVudEVtaXR0ZXIiLCJzZXRUaW1lb3V0IiwiZm9ya0pvaW4iLCJtb21lbnR0aW1lem9uZS51dGMiLCJtYXAiLCJDb21wb25lbnQiLCJWaWV3Q29udGFpbmVyUmVmIiwiVmlld0NoaWxkIiwiSW5wdXQiLCJPdXRwdXQiLCJOZ01vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO1FBb0JFLDJCQUFvQixJQUFVO1lBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTs0QkFObkIsS0FBSzsyQkFDTixJQUFJO3dCQUNDLElBQUk7MEJBQ0wsSUFBSTs2QkFDRSxJQUFJO1lBR3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsMkNBQTJDLENBQUM7WUFDeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxtQ0FBbUMsQ0FBQztTQUN0RDs7Ozs7UUFFRCxrREFBc0I7Ozs7WUFBdEIsVUFBdUIsUUFBUTs7Z0JBQzdCLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO2dCQUMxQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFhO29CQUMzRSxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDbkIsQ0FBQyxDQUFDO2FBQ0o7Ozs7O1FBRUQsNkNBQWlCOzs7O1lBQWpCLFVBQWtCLE1BQU07O2dCQUN0QixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7Z0JBQ3RC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