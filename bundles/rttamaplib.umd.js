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
                $('.NavBar_Container.Light').attr('style', 'top:580px');
                /** @type {?} */
                var infobox = new Microsoft.Maps.Infobox(map$$1.getCenter(), {
                    visible: false
                });
                /**
                 * @param {?} e
                 * @return {?}
                 */
                function pushpinClicked(e) {
                    if (e.target.metadata) {
                        infobox.setMap(map$$1);
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
            { type: i0.Component, args: [{
                        selector: 'att-rttamaplib',
                        template: "  \n  <div id='myMap' style=\"padding: 0px 0px 0px 10px;\" #mapElement>\n  </div>\n  "
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
            smspopup: [{ type: i0.ViewChild, args: ['smspopup',] }],
            emailpopup: [{ type: i0.ViewChild, args: ['emailpopup',] }],
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL3J0dGFtYXBsaWIvbGliL3J0dGFtYXBsaWIuc2VydmljZS50cyIsIm5nOi8vcnR0YW1hcGxpYi9saWIvbW9kZWxzL3RydWNrZGV0YWlscy50cyIsIm5nOi8vcnR0YW1hcGxpYi9saWIvcnR0YW1hcGxpYi5jb21wb25lbnQudHMiLCJuZzovL3J0dGFtYXBsaWIvbGliL3J0dGFtYXBsaWIubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHAsIFJlc3BvbnNlLCBSZXF1ZXN0T3B0aW9ucywgSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaWJlciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tYXAnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci90b1Byb21pc2UnO1xuaW1wb3J0ICogYXMgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5pbXBvcnQgeyBUcnVja0RpcmVjdGlvbkRldGFpbHMgfSBmcm9tICcuL21vZGVscy90cnVja2RldGFpbHMnO1xuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlci9zcmMvdXRpbHMvY29sbGVjdGlvbic7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJ0dGFtYXBsaWJTZXJ2aWNlIHtcblxuICBtYXBSZWFkeSA9IGZhbHNlO1xuICBzaG93TmF2ID0gdHJ1ZTtcbiAgaG9zdDogc3RyaW5nID0gbnVsbDtcbiAgc29ja2V0OiBhbnkgPSBudWxsO1xuICBzb2NrZXRVUkw6IHN0cmluZyA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XG4gICAgdGhpcy5ob3N0ID0gXCJodHRwczovL3psZDA0MDkwLnZjaS5hdHQuY29tOjg0NDMvUkFQVE9SL1wiO1xuICAgIHRoaXMuc29ja2V0VVJMID0gXCJodHRwczovL3psZDA0MDkwLnZjaS5hdHQuY29tOjMwMDdcIjtcbiAgfVxuXG4gIGNoZWNrVXNlckhhc1Blcm1pc3Npb24odXNlck5hbWUpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciB1c2Vyc0xpc3RVcmwgPSB0aGlzLmhvc3QgKyBcImF1dGh1c2VyXCI7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVzZXJzTGlzdFVybCwgdXNlck5hbWUpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TWFwUHVzaFBpbkRhdGEoYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgc3VwZXJ2aXNvcklkID0gW107XG4gICAgc3VwZXJ2aXNvcklkID0gYXR0VUlELnNwbGl0KCcsJyk7XG4gICAgdmFyIHVzZXJzTGlzdFVybCA9IHRoaXMuaG9zdCArICdUZWNoRGV0YWlsRmV0Y2gnO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1c2Vyc0xpc3RVcmwsIHtcbiAgICAgIFwiYXR0dUlkXCI6IFwiXCIsXG4gICAgICBcInN1cGVydmlzb3JJZFwiOiBzdXBlcnZpc29ySWRcbiAgICB9KS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmRUcnVja05lYXJCeShsYXQsIGxvbmcsIGRpc3RhbmNlLCBzdXBlcnZpc29ySWQpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzdXBlcnZpc29ySWRzID0gW107XG4gICAgc3VwZXJ2aXNvcklkcyA9IHN1cGVydmlzb3JJZC5zcGxpdCgnLCcpO1xuICAgIGNvbnN0IGZpbmRUcnVja1VSTCA9IHRoaXMuaG9zdCArICdGaW5kVHJ1Y2tOZWFyQnknO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChmaW5kVHJ1Y2tVUkwsIHtcbiAgICAgICdsYXQnOiBsYXQsXG4gICAgICAnbGxvbmcnOiBsb25nLFxuICAgICAgJ3JhZGl1cyc6IGRpc3RhbmNlLFxuICAgICAgJ3N1cGVydmlzb3JJZCc6IHN1cGVydmlzb3JJZHNcbiAgICB9KS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFdlYlBob25lVXNlckRhdGEoYXR0VUlEKTogUHJvbWlzZTxhbnk+IHtcbiAgICB2YXIgbGRhcFVSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvZ2V0dGVjaG5pY2lhbnMvXCIgKyBhdHRVSUQ7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQobGRhcFVSTCkudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRXZWJQaG9uZVVzZXJJbmZvKGF0dFVJRCk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIGxkYXBVUkwgPSB0aGlzLnNvY2tldFVSTCArIFwiL2dldHRlY2huaWNpYW5pbmZvL1wiICsgYXR0VUlEO1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGxkYXBVUkwpLnRvUHJvbWlzZSgpLnRoZW4oKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgR2V0TmV4dFJvdXRlRGF0YShmcm9tQXR0aXR1ZGUsIHRvQXR0aXR1ZGUpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciByb3V0ZVVybCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL1YxL1JvdXRlcy9Ecml2aW5nP3dwLjA9XCIgKyBmcm9tQXR0aXR1ZGUgKyBcIiZ3cC4xPVwiICsgdG9BdHRpdHVkZSArIFwiJnJvdXRlQXR0cmlidXRlcz1yb3V0ZVBhdGgma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIlxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHJvdXRlVXJsKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzW1wiX2JvZHlcIl07XG4gICAgfSk7XG4gIH1cblxuICBHZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlsczogYW55W10pOiBhbnlbXSB7XG4gICAgbGV0IGNvbWJpbmVkVXJscyA9IFtdO1xuICAgIGxldCByb3V0ZVVybDtcbiAgICB2YXIgbmV3Um91dGVVcmw7XG4gICAgZGlyRGV0YWlscy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICByb3V0ZVVybCA9IFwiaHR0cHM6Ly9kZXYudmlydHVhbGVhcnRoLm5ldC9SRVNUL1YxL1JvdXRlcy8/d3AuMD1cIiArIGl0ZW0uc291cmNlTGF0ICsgXCIsXCIgKyBpdGVtLnNvdXJjZUxvbmcgKyBcIiZ3cC4xPVwiICsgaXRlbS5kZXN0TGF0ICsgXCIsXCIgKyBpdGVtLmRlc3RMb25nICsgXCIma2V5PUFueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWpcIlxuICAgICAgbmV3Um91dGVVcmwgPSB0aGlzLmh0dHAuZ2V0KHJvdXRlVXJsKVxuICAgICAgY29tYmluZWRVcmxzLnB1c2gobmV3Um91dGVVcmwpXG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbWJpbmVkVXJscztcbiAgfVxuXG4gIHNlbmRFbWFpbChmcm9tRW1haWwsIHRvRW1haWwsIGZyb21OYW1lLCB0b05hbWUsIHN1YmplY3QsIGJvZHkpOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBzbXNVUkwgPSB0aGlzLnNvY2tldFVSTCArIFwiL3NlbmRlbWFpbFwiO1xuICAgIHZhciBlbWFpbE1lc3NhZ2UgPSB7XG4gICAgICBcImV2ZW50XCI6IHtcbiAgICAgICAgXCJyZWNpcGllbnREYXRhXCI6IFt7XG4gICAgICAgICAgXCJoZWFkZXJcIjogeyBcInNvdXJjZVwiOiBcIktlcGxlclwiLCBcInNjZW5hcmlvTmFtZVwiOiBcIlwiLCBcInRyYW5zYWN0aW9uSWRcIjogXCI1MTExMVwiIH0sXG4gICAgICAgICAgXCJub3RpZmljYXRpb25PcHRpb25cIjogW3sgXCJtb2NcIjogXCJlbWFpbFwiIH1dLFxuICAgICAgICAgIFwiZW1haWxEYXRhXCI6IHtcbiAgICAgICAgICAgIFwic3ViamVjdFwiOiBcIlwiICsgc3ViamVjdCArIFwiXCIsXG4gICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJcIiArIGJvZHkgKyBcIlwiLFxuICAgICAgICAgICAgXCJhZGRyZXNzXCI6IHtcbiAgICAgICAgICAgICAgXCJ0b1wiOiBbeyBcIm5hbWVcIjogXCJcIiArIHRvTmFtZSArIFwiXCIsIFwiYWRkcmVzc1wiOiBcIlwiICsgdG9FbWFpbCArIFwiXCIgfV0sXG4gICAgICAgICAgICAgIFwiY2NcIjogW10sXG4gICAgICAgICAgICAgIFwiYmNjXCI6IFtdLFxuICAgICAgICAgICAgICBcImZyb21cIjogeyBcIm5hbWVcIjogXCJBVCZUIEVudGVycHJpc2UgTm90aWZpY2F0aW9uXCIsIFwiYWRkcmVzc1wiOiBcIlwiIH0sIFwiYm91bmNlVG9cIjogeyBcImFkZHJlc3NcIjogXCJcIiB9LFxuICAgICAgICAgICAgICBcInJlcGx5VG9cIjogeyBcImFkZHJlc3NcIjogXCJcIiB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgXCJhdHRyaWJEYXRhXCI6IFt7IFwibmFtZVwiOiBcInN1YmplY3RcIiwgXCJ2YWx1ZVwiOiAgc3ViamVjdCB9LFxuICAgICAgICB7IFwibmFtZVwiOiBcIm1lc3NhZ2VcIiwgXCJ2YWx1ZVwiOiBcIlRoaXMgaXMgZmlyc3QgY2FtdW5kYSBwcm9jZXNzXCIgfSxcbiAgICAgICAgeyBcIm5hbWVcIjogXCJjb250cmFjdG9yTmFtZVwiLCBcInZhbHVlXCI6IFwiQWpheSBBcGF0XCIgfV1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICB2YXIgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7IGhlYWRlcnM6IGhlYWRlcnMgfSk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHNtc1VSTCwgSlNPTi5zdHJpbmdpZnkoZW1haWxNZXNzYWdlKSwgb3B0aW9ucykudG9Qcm9taXNlKCkudGhlbigocmVzOiBSZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG4gIH1cblxuICBzZW5kU01TKHRvTnVtYmVyLCBib2R5TWVzc2FnZSk6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHNtc1VSTCA9IHRoaXMuc29ja2V0VVJMICsgXCIvc2VuZHNtc1wiO1xuICAgIHZhciBzbXNNZXNzYWdlID0ge1xuICAgICAgXCJldmVudFwiOiB7XG4gICAgICAgIFwicmVjaXBpZW50RGF0YVwiOiBbe1xuICAgICAgICAgIFwiaGVhZGVyXCI6IHsgXCJzb3VyY2VcIjogXCJLZXBsZXJcIiwgXCJzY2VuYXJpb05hbWVcIjogXCIgRmlyc3ROZXRJbml0aWFsUmVnaXN0cmF0aWlvblVzZXJcIiwgXCJ0cmFuc2FjdGlvbklkXCI6IFwiMDAwNFwiIH0sXG4gICAgICAgICAgXCJub3RpZmljYXRpb25PcHRpb25cIjogW3sgXCJtb2NcIjogXCJzbXNcIiB9XSxcbiAgICAgICAgICBcInNtc0RhdGFcIjoge1xuICAgICAgICAgICAgXCJkZXRhaWxzXCI6IHtcbiAgICAgICAgICAgICAgXCJjb250YWN0RGF0YVwiOiB7XG4gICAgICAgICAgICAgICAgXCJyZXF1ZXN0SWRcIjogXCIxMTExNlwiLCBcInN5c0lkXCI6IFwiQ0JcIiwgXCJjbGllbnRJZFwiOiBcIlJUVEFcIixcbiAgICAgICAgICAgICAgICAvLyBcInBob25lTnVtYmVyXCI6IHsgXCJhcmVhQ29kZVwiOiBcIlwiICsgdG9OdW1iZXIudG9TdHJpbmcoKS5zdWJzdHIoMCwgMykgKyBcIlwiLCBcIm51bWJlclwiOiBcIlwiICsgdG9OdW1iZXIudG9TdHJpbmcoKS5zdWJzdHIoMywgMTApICsgXCJcIiB9LCBcIm1lc3NhZ2VcIjogXCJcIiArIGJvZHlNZXNzYWdlICsgXCJcIixcbiAgICAgICAgICAgICAgICBcInBob25lTnVtYmVyXCI6IHsgXCJhcmVhQ29kZVwiOiBcIlwiLCBcIm51bWJlclwiOiBcIlwiICsgdG9OdW1iZXIgKyBcIlwiIH0sIFwibWVzc2FnZVwiOiBcIlwiICsgYm9keU1lc3NhZ2UgKyBcIlwiLFxuICAgICAgICAgICAgICAgIFwic2NlbmFyaW9OYW1lXCI6IFwiIEZpcnN0TmV0SW5pdGlhbFJlZ2lzdHJhdGlpb25Vc2VyXCIsIFwiaW50ZXJuYXRpb25hbE51bWJlckluZGljYXRvclwiOiBcIlRydWVcIiwgXCJpbnRlcmFjdGl2ZUluZGljYXRvclwiOiBcIkZhbHNlXCIsXG4gICAgICAgICAgICAgICAgXCJob3N0ZWRJbmRpY2F0b3JcIjogXCJGYWxzZVwiLCBcInByb3ZpZGVyXCI6IFwiQlNOTFwiLCBcInNob3J0Q29kZVwiOiBcIjExMTFcIiwgXCJyZXBseVRvXCI6IFwiRE1BQVBcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgXCJhdHRyaWJEYXRhXCI6IFt7IFwibmFtZVwiOiBcImFkbWluRGF0YTFcIiwgXCJ2YWx1ZVwiOiAxMjM0NTY3IH0sIHsgXCJuYW1lXCI6IFwiY29udHJhY3Rvck5hbWVcIiwgXCJ2YWx1ZVwiOiBcImNvbnRyYWN0b3IgbmFtZVwiIH1dXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XG4gICAgdmFyIG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoeyBoZWFkZXJzOiBoZWFkZXJzIH0pO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChzbXNVUkwsIEpTT04uc3RyaW5naWZ5KHNtc01lc3NhZ2UpLCBvcHRpb25zKS50b1Byb21pc2UoKS50aGVuKChyZXM6IFJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFRydWNrRmVlZCh0ZWNoSWRzOiBhbnksIG1ncklkOiBhbnkpIHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuXG4gICAgICB0aGlzLnNvY2tldCA9IGlvLmNvbm5lY3QodGhpcy5zb2NrZXRVUkwsXG4gICAgICAgIHtcbiAgICAgICAgICBzZWN1cmU6IHRydWUsXG4gICAgICAgICAgcmVjb25uZWN0aW9uOiB0cnVlLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5OiAxMDAwLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkRlbGF5TWF4OiA1MDAwLFxuICAgICAgICAgIHJlY29ubmVjdGlvbkF0dGVtcHRzOiA5OTk5OVxuICAgICAgICB9KTtcblxuICAgICAgdGhpcy5zb2NrZXQuZW1pdCgnam9pbicsIHsgbWdySWQ6IG1ncklkLCBhdHR1SWRzOiB0ZWNoSWRzIH0pO1xuXG4gICAgICB0aGlzLnNvY2tldC5vbignbWVzc2FnZScsIChkYXRhKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoZGF0YSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuICAvL0dldCBSdWxlIGRlc2lnbmVkIGJhc2VkIG9uIHRlY2h0eXBlLlxuICBnZXRSdWxlcyhkaXNwYXRjaFR5cGUpIHtcbiAgICB2YXIgZ2V0UnVsZXNVcmwgPSB0aGlzLmhvc3QgKyBcIkZldGNoUnVsZVwiO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChnZXRSdWxlc1VybCwge1xuICAgICAgXCJkaXNwYXRjaFR5cGVcIjogZGlzcGF0Y2hUeXBlXG4gICAgfSk7XG4gIH1cblxuICBzdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKGtleSwgb2JqZWN0VG9TdG9yZSlcbiAge1xuICAgIC8vIHJldHVybiAgaWYgeW91IHdhbnQgdG8gcmVtb3ZlIHRoZSBjb21wbGV0ZSBzdG9yYWdlIHVzZSB0aGUgY2xlYXIoKSBtZXRob2QsIGxpa2UgbG9jYWxTdG9yYWdlLmNsZWFyKClcbiAgICAvLyBDaGVjayBpZiB0aGUgc2Vzc2lvblN0b3JhZ2Ugb2JqZWN0IGV4aXN0c1xuICAgaWYoc2Vzc2lvblN0b3JhZ2UpXG4gICAge1xuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KG9iamVjdFRvU3RvcmUpKTtcbiAgICB9XG4gIH1cblxuICBzdG9yZURhdGFJbkxvY2FsU3RvcmFnZShrZXksIG9iamVjdFRvU3RvcmUpXG4gIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9TdG9yZSkpO1xuICB9XG5cbiAgcmV0cmlldmVEYXRhRnJvbUxvY2FsU3RvcmFnZShrZXksIG9iamVjdFRvU3RvcmUpXG4gIHtcbiAgICAgIHZhciByZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgaWYocmVzdWx0IT1udWxsKVxuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKGtleSlcbiAge1xuICAgIGlmKHNlc3Npb25TdG9yYWdlKVxuICAgIHtcbiAgICAgIHZhciByZXN1bHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICBpZihyZXN1bHQhPW51bGwpXG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxufVxuIiwiZXhwb3J0IGNsYXNzIFRydWNrRGV0YWlscyB7XG4gICBwdWJsaWMgVHJ1Y2tJZDogc3RyaW5nO1xuICAgcHVibGljIERpc3RhbmNlOiBzdHJpbmc7ICBcbn1cblxuZXhwb3J0IGNsYXNzIFRydWNrRGlyZWN0aW9uRGV0YWlsc3tcbiAgICBwdWJsaWMgdGVjaElkOiBzdHJpbmc7XG4gICAgcHVibGljIHNvdXJjZUxhdDogc3RyaW5nO1xuICAgIHB1YmxpYyBzb3VyY2VMb25nOiBzdHJpbmc7XG4gICAgcHVibGljIGRlc3RMYXQ6IHN0cmluZztcbiAgICBwdWJsaWMgZGVzdExvbmc6IHN0cmluZztcbiAgICBwdWJsaWMgbmV4dFJvdXRlTGF0OiBzdHJpbmc7XG4gICAgcHVibGljIG5leHRSb3V0ZUxvbmc6IHN0cmluZztcbiAgfVxuICBcbiAgZXhwb3J0IGNsYXNzIFRpY2tldHtcbiAgICBwdWJsaWMgdGlja2V0TnVtYmVyOiBzdHJpbmc7XG4gICAgcHVibGljIGVudHJ5VHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBjcmVhdGVEYXRlOiBzdHJpbmc7XG4gICAgcHVibGljIGVxdWlwbWVudElEOiBzdHJpbmc7XG4gICAgcHVibGljIGNvbW1vbklEOiBzdHJpbmc7XG4gICAgcHVibGljIHBhcmVudElEOiBzdHJpbmc7XG4gICAgcHVibGljIGN1c3RBZmZlY3Rpbmc6IHN0cmluZztcbiAgICBwdWJsaWMgdGlja2V0U2V2ZXJpdHk6IHN0cmluZztcbiAgICBwdWJsaWMgYXNzaWduZWRUbzogc3RyaW5nO1xuICAgIHB1YmxpYyBzdWJtaXR0ZWRCeTogc3RyaW5nO1xuICAgIHB1YmxpYyBwcm9ibGVtU3ViY2F0ZWdvcnk6IHN0cmluZztcbiAgICBwdWJsaWMgcHJvYmxlbURldGFpbDogc3RyaW5nO1xuICAgIHB1YmxpYyBwcm9ibGVtQ2F0ZWdvcnk6IHN0cmluZztcbiAgICBwdWJsaWMgbGF0aXR1ZGU6IHN0cmluZztcbiAgICBwdWJsaWMgbG9uZ2l0dWRlOiBzdHJpbmc7XG4gICAgcHVibGljIHBsYW5uZWRSZXN0b3JhbFRpbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYWx0ZXJuYXRlU2l0ZUlEOiBzdHJpbmc7XG4gICAgcHVibGljIGxvY2F0aW9uUmFua2luZzogc3RyaW5nO1xuICAgIHB1YmxpYyBhc3NpZ25lZERlcGFydG1lbnQ6IHN0cmluZztcbiAgICBwdWJsaWMgcmVnaW9uOiBzdHJpbmc7XG4gICAgcHVibGljIG1hcmtldDogc3RyaW5nO1xuICAgIHB1YmxpYyBzaGlmdExvZzogc3RyaW5nO1xuICAgIHB1YmxpYyBlcXVpcG1lbnROYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHNob3J0RGVzY3JpcHRpb246IHN0cmluZztcbiAgICBwdWJsaWMgdGlja2V0U3RhdHVzOiBzdHJpbmc7XG4gICAgcHVibGljIGxvY2F0aW9uSUQ6IHN0cmluZztcbiAgICBwdWJsaWMgb3BzRGlzdHJpY3Q6IHN0cmluZztcbiAgICBwdWJsaWMgb3BzWm9uZTogc3RyaW5nO1xuICAgIHB1YmxpYyBwYXJlbnROYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xuICAgIHB1YmxpYyB3b3JrUmVxdWVzdElkOiBzdHJpbmc7XG4gIH0iLCJpbXBvcnQgeyBWaWV3Q29udGFpbmVyUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uSW5pdCwgVmlld0NoaWxkLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuLy8gaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFJ0dGFtYXBsaWJTZXJ2aWNlIH0gZnJvbSAnLi9ydHRhbWFwbGliLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmd1aUF1dG9Db21wbGV0ZU1vZHVsZSB9IGZyb20gJ0BuZ3VpL2F1dG8tY29tcGxldGUvZGlzdCc7XG5pbXBvcnQgeyBQb3B1cCB9IGZyb20gJ25nMi1vcGQtcG9wdXAnO1xuaW1wb3J0IHsgVHJ1Y2tEZXRhaWxzLCBUcnVja0RpcmVjdGlvbkRldGFpbHMsIFRpY2tldCB9IGZyb20gJy4vbW9kZWxzL3RydWNrZGV0YWlscyc7XG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcbmltcG9ydCB7IGZhaWwsIHRocm93cyB9IGZyb20gJ2Fzc2VydCc7XG4vLyBpbXBvcnQgeyBUb2FzdCwgVG9hc3RzTWFuYWdlciB9IGZyb20gJ25nMi10b2FzdHIvbmcyLXRvYXN0cic7XG5pbXBvcnQgeyBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlL3NyYy9tZXRhZGF0YS9saWZlY3ljbGVfaG9va3MnO1xuaW1wb3J0IHsgVHJ5Q2F0Y2hTdG10IH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXIvc3JjL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7IEFuZ3VsYXJNdWx0aVNlbGVjdE1vZHVsZSB9IGZyb20gJ2FuZ3VsYXIyLW11bHRpc2VsZWN0LWRyb3Bkb3duL2FuZ3VsYXIyLW11bHRpc2VsZWN0LWRyb3Bkb3duJztcbmltcG9ydCB7IHNldFRpbWVvdXQgfSBmcm9tICd0aW1lcnMnO1xuaW1wb3J0IHsgZm9ya0pvaW4gfSBmcm9tICdyeGpzJztcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0ICogYXMgbW9tZW50dGltZXpvbmUgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcbmltcG9ydCB7IFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXIvc3JjL2NvcmUnO1xuXG5kZWNsYXJlIGNvbnN0IE1pY3Jvc29mdDogYW55O1xuZGVjbGFyZSBjb25zdCBCaW5nO1xuZGVjbGFyZSBjb25zdCBHZW9Kc29uOiBhbnk7XG5kZWNsYXJlIHZhciBqUXVlcnk6IGFueTtcbmRlY2xhcmUgdmFyICQ6IGFueTtcblxuLy8gPGRpdiBpZD1cImxvYWRpbmdcIj5cbi8vICAgICA8aW1nIGlkPVwibG9hZGluZy1pbWFnZVwiIHNyYz1cImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaGtBR1FBYUlHQVAvLy84ek16Sm1abVdabVpqTXpNd0FBQVAvLy93QUFBQ0gvQzA1RlZGTkRRVkJGTWk0d0F3RUFBQUFoK1FRRkFBQUdBQ3dBQUFBQWtBR1FBUUFELzJpNjNQNHd5a21ydlRqcnpidi9ZQ2lPWkdtZWFLcXViT3UrY0N6UGRHM2ZlSzd2Zk8vL3dLQndTQ3dhajhpa2NzbHNPcC9RcUhSS3JWcXYyS3gyeSsxNnYrQ3dlRXd1bTgvb3RIck5icnZmOExoOFRxL2I3L2k4ZnMvdisvK0FnWUtEaElXR2g0aUppb3VNalk2UGtFa0FBWlFDQWdPWUJKcWFCWjJlbndXYUFKR2thYUNucUtrRm82V3RaS3F3cWF5dXRGK3h0NThCdGJ0ZHVMNjZ2TUZZdnJqQXdzZFR4TGZHeU0xT3lySE16dE5KMExEUzFObEUxcXJZMnQ4LzNLbmU0T1U2NHFqazV1czE2S2ZxN1BFdzdxRHc4dmNyOUxuNC9ESDZudloyQUJnZ1lGWS9TUDg2QmRRaG9CTUJBUXNQRGtwWUlPSU5BS0FlV3BUb2gvL2l4aG9EVUdua3VBU0F3U0FlaVFTQU5aSmtFWk9VaXFRY1F1RFd3NU11ZWNDa0ZBQ25ENG9DaGpUMGRUTm5qMGs4ZWZya0FWUUlnSnJLQ0JyTmdUUnAwaUZOZzRUa051RGoxQkU3clNaZGVpNWhVQ0FyMGJYODZxS3FXS3RDc3Y2QTZ1NGhXeFp1MzFvbGkwTnVqNkgvdXQ0OUVWYnZXNzQyL0Fxays2L29ZQkY1RFl0RjNNN3NqNjBVUTFGK1RDR3k1TVBoTFBkSW03bkFXYzRkUEg5K0cvcmY2UjJNRXhKQW5WcjE2c2svUmU4Z25ka3JiUU8yYjdQdW9maGk3TUMvTlFRWGpwdXA3aHlBTTI5T3ptQTU4NzNPWGU4dTNlazE5UXJXcnl2TnJzKzdEY3dVQ1V6L3ZpQzgrSjQ3S0E3UXdYc21ld3p2aGNkUE9CL0hVKzcvczkyWGdYdmlyWmNQZjlCeFY1R0FHdVIzVzFuSTNWQWZnZ3dPNk9CbkJxWWdIdzdvVVpSaGhjQmRLTm1ISm14b3c0VGFnV2loaUliMVJTRU4vNVdtbm9yS3NhZ1hpU1NZU0VOMDl0RjRBWUhpM2FDakRCaHgxNStQSzlxSVhXVVJ6dEJoUXI0aHFTUm9OQXdKQTRyNkhJbGtrbE5TZ21NSVZyWjFuRDR6YnJsQmwwdktFR1lMUEQ1bkpnWkFYbGZsaXk4VUtlT2JxYUU1bnBwMHV2RGtQMUhpR1Nkek02UVhBNWIwYUlsbmpYckM1NDlzTVl5cFQ2Q0xHdENvbDQ4MkJrT2JLVmJLd2FDM2ZjbUJvV0lDS0txbmx6cnFBcWt0L0RtcHB4K0ErdUFMcks2QWFGMndncERxcVJqVXFvS2s5RkNhYTRpWDBnb3BDNXhtT1N3SS83Sml1T3F4S3NSWUdxL0ROdXNzQzc2ZTRDbzk1aTI3Z2JXR1VVdEJ0aVhjcXBhNHkrNktMYlFvQU91T3NONjJsK3E2bXFaZ3JqZ0J4aHVDdWlxUUM1bTc2TUNycndMZ3R0Z3Z1eVZzNjQ2aUEzdFFNSlVvK0t1cmdtVTJ6Q3kvSjBqOEFjRGlkR3Z4cC9OR2pMQUk5M0pUOGNlNlhvcHVBNW1aSUcxdktJTVZjb2tVbVpCc29qR1RnSEdPTmV1czRJSTVRN2F6Q0MyVG9EQTZIZ2ZOd2RCZzlrd3l4U3NIL1RERVJEdk5MTWZjSkMySndNZE1MVllKUllkd002NVJORFJBMUxWNG5XWUltTFR0OXR0d3g4M3cwajl6ZlNKZFdzdWo5bFZaSEMzTzNFZ0VFQnNCZGdmRHRCUWxjMU40REFPbElwZ2JKcFYwK0JNdkYyY0VBUDlqRndDNEdWV2h6Y0xrVG1TT3IrZklja3c0RzNtUm5zTGVlMHBoWjJtTHR5QTRNV2V2NFpucWhNMWNOc1ZKQk9EM0tYbC9FUnp1SkxDTzZSUUNZSzFNN0t2L0xoTHpTb1Q2a3A3RXd5ZzY3WmRmRDh2bXdndFgvYjVUUnA1RjQvcDhyNnZ5c1FTdlJaem01MmxqK3hLaWo0cjY4YWNIL2ZUdndkK2dpUHBESjc4bkovTUIrVEpEUHlzMFMzd0NkRkQvQk9LOGZRQUJjejg3blJqZWg1WUNMWEEwRGN5WEQ1TDNzMDV3RHd0VHU2QUVnQ1RDSDh4dUdTYjhYOGZBc0xjU1BpQThMZ3hDNWo0NEE5OTE4QlMxOHdMckVPaWZhOFZoZ0JtSllYVWFhTGtyR085NFZBbVhIVTc0aVFMaVJYdW02c0lSV3llaDV1Q0JpUnE4QVFmL2I1ZytMa3h4YlRBYVN4OGdDTFQ2Y2RFbTk5UEJGOEZZUTFYNUFYTTRzT0VaZmVGRUpheVJha1FTWWlDQU9FZWI2REYzcWZMaHdLRFl4MUNrOFNLQkROVWYxOEhFUXNiQ0x1dExwUGZTcGNJekZtUUxkMlRPSXFmQlIwZXFJb2VZbEdUKzNrUkdUejd5a0RvUlpmNDJ1WXN0bWxJVmtBeERKZ3Vrb2thK0VoV2dGRU5oVkNtOSs4anhsbzVESmY1NHFVbnFkQktZQUJRbUVtWjVIUjdlcFpUSUJCNGNka25NRVQzR2x0SDBJQ3VQVXMxaVRnV2IyWHhjSFpqWlRKY2NNNW9TeEFNMXU0bkhlMEF6bTU2NEpCL0k2YzE3dUJLZTJ0d2pPM3ZKeUVweU1aMkNvS2NpelVISVBzYXlFQUpkelRhbjZjK2Z5VE1SQ2IwUk94SjMvOFpjTGlLaWJQeEdRMldqVE5UdFU0enhvS2lDNm9qUWozYlVFRVNVejBKbHljNlYwdUYxY3hRbkwralpqNEtxNWFUcTVLVkx4N2xST241ampUdGQ0ZzB0U28xMWhvOGpLU1VLVHZYWnFLRGVRYVM0QUdnODlwYVRwS3Jpb2ZndzZpak4yVlBOT2ZVT0Q1dUtUVDhoVlpKWTY2dDZxT1JCcDZKVmEzNEZxcVpCNng4R0pWYzlORkNtcUNGUVhmVlFzckwrSmp5Y3lSeEoyU3BJdGxUT0UwUVZrRzFvTXlHODBpZ3llL1VEWGZ6cUk3ZEUxZzlwd2VxaWtQSWR6Y0xxc2tvTHJXaEhTOXJTbXZhMHFFMnRhbGZMMnRhNjlyV3dqYTFzWjB2YjJ0cjJ0cmpOclc1M3k5dmUrdmEzd0EydWNJZEwzT0lhdHhFWUxaYVprdHZVR3YrWVZIZVZmYTV5MnloZE5KR3l1bnB5TG5hN2ROM3RUa203M3JWUmQ4UExJdkNTOTBMalBhK0R6S3ZlOTZTM3ZVR2lBWHpYdTl6NTVvZTk5cDNWbHBqYktQem05elB2L1MrQTVTdGcvZFMzd1BxVkFZSVRITjBGRDVpNkR0WkxnQ1BNTndoVEdDNEh2dkRYQ0t4aERPKzN3eHUyTUlnbnJHSC9sampESUk0SmgxTzgxSEx3TjdzclRqR0pMMnhpR3FOWXhqRWU4WTExTE9JT3o1akNOUWJ5am4yY1l5Si9tTVVxN3ZHSmo0emtJRWY0eDA4dThwS1I5R0xyWHNRa1dNNnlscmZNNVN5ekU4cE43YktZeDV6bDQ1cjV6R2hPczVyWHpPWTJ1L25OY0k2em5PZE01enJiK2M1NHpyT2U5OHpuUHZ2NXo0QU90S0FIVGVoQy94Yi90SWJHUzVML2ltaEloS1hSZWtBS3BCa0IyZDlrRkVTcW1iUWRibGZaNFhIR05zNWtEMkFmc3h4Tno3T2VYM0dQcWNIcTNydlFNcS81V1hVYjZFcHEvcjFWZ2FsV0VtRnRiYzZqOXZwOXNpWURWWCt0cEdDelVHVm1iZTVVQTJuc01URGJIRUNWeUJkRGpZeFpOaHNNcXJ3MkZNalpEMlpxVzNMZC9IWWt3ejFUaytMam8rSjJTbkxUYmNEbnNwdWIxWDMzRkxBcmIwUnV0OTdiOWk2K0dWZGxLbXFqMzBnMEJNRDluWTJCQjV5cDVOMDM1ZHFyOEJLMEZkMVpOWGhQR2g0Q2cxT2JIUkozSTZ2UFMvRjJxN2ZqY1BwNHJrVStCNHNQNXVIb0Jqa0VKSzV5S1RKODFpVC82OHZUWVBMN1pKemlGbS81R1ZnK0JwNC8xdWM2LytRNG1DRWU5SHQ3aXVYcGZ2SEZoeHh2bDd0YlgwQUhvVWwxdm9lYmo3dWFKVnc2eG1QdWNXSzY4T0R6ak9IQXRXM3RIaEk4cHhvUEk3MURLVWs5dHZPbEhyNXkwOW1PYkRYZWlPb2pmTHZhaVU1MzZnbWtzSkFEZFNyM3llNFd3aHZ3YXJCT0FySGVQVjhQZnBLMmcvemhSU252Z21uZHlYcG5xWngrZ0hJS2hvRkZDNVZWd3p0LzZTUW1zdWU0RGdMb2RYa2hseDVSNGV3Ymd1VUx2M3JaKzEzWW1neHFsNzRkUWlLUW5wK29WK2d3SFY4RnRWMnUyR2hBUE9kQkIyNDBvUlZjTkpmb0VZNUlCZW92TS9Wb3FQVDBtVzlIN2krL25Ja0hhZURxWG4zdkMxQ3ZIbzNzNjd0KysrNExmOVpNTUgvejIrOStnMGtidWxVSTVQL0NNNzkxOGxlY3pBQllaaFVuZjA1UmVzczJYU1REWFVLRGdFM1FPY25tZitEelhRdW9iTnQyZVl3RWdSR29hektEZ2JTMWZ1V2lnQ05BZ0tzbGdoZGdaUnRJZ2JWbGZTWmdnaWNJWTdaRmdpVUlnaTNvZkxhbGdpc29nek9JZzdEbGdTZkFnanJEZ2ExbFBMampnemxJZks1bGd6Mm9neUdJZjZ3Rmd4bEFoRVdJZksrRmhFa29nU2hBaGFybGhFK29oRCtJZ3FvbGhMTERoVkhvZVYrb2hWdG9oZllDaEtRRmhtR0lobGRvaHQ2Q2hTZ0FoUzdEaEtNRmgyZW9nWitqaGxKamgzTW9oZzduaDBHRGgza29YaTVBaUp2RmgxV29oNHFtaUJhRGlQZ0JpSFhvaFgxSWlYdm9oaXZBZzVYWVh3b21pWlBJaVVyRGhvZmlpVGYvYUlrTkk0ZVh5SWh0SVlqeEFvbjdnNGt0SUlvZkk0dWpDSXVOYUlyZTRvcXZxSXAxd29xZjVZZ3FRSWR0U0gvNjRvdTJRb3B2eUlCeENJekJpSXpKU0l6VllvekhhSXVyeUl4VVpvMXBTSTNWQ0kxSGg0M1p5SXVkaUl0dklvMnBhSWcyZ0lwTVYzdHg1SXpSNG8wQ1FvN2xXRjVtQjRxVlFvc253bzd0S0k0cVlvLzNLSVU1b0l1N3hvMlloMnIySnBENzZJN1RTSWIvaUpDMHdUbytzSHVQNTRKRFI1QUw2WTkycDQ4Vjhuc1B4Z01RT1JyS21JNFVXWkVLZVpFRzJXRFk1NUVXdVJzTWFVd255WkZHU0pJMG1Dc2FtWFlxbVpKLzUzeDRCM2VFb25vdldaTTJHWTN2VjBFL0NaT3RoeklQTndRZEtaUUtsSk5qcEVSQ3RwQ1UzeGRybzZWOVQ5bVRFU2w1VTJsWkttR1ZMdWs5VENsd2srQlVVUGxBQThWYVh6V1dTbmtZWDFsTFhIbVZTckdXTklLV1pEa1djT2tqY2htVkZtaG9kOGw1ZVpsb2U1bG9UdkNYZ0JsL2JUbVlTeUNZaHRrN2habVk0emVVakJrOWkvbVlSWUNZa3JtVmpsbVpSa0NabU1tVGw3bVpTQm1abm1sQ29CbWFLRG1TcFBrU1dsYVVwN21hck5tYXJ2bWFzQm1ic2ptYnRGbWJ0bm1idUptYnVybWJ2Tm1idnZtYndCbWN3am1jeEZtY0dKQUFBQ0g1QkFVQUFBWUFMTFVBRndERkFMOEFBQVAvYUxBYi9qQktRNnU5T092TnUvOWdLSTZqWko0VHFhNXM2NzR0S3A5d2JkOTRmczA4Qk9qQW9IQm82UmwveEtSeVNUTDJrTXlvZEdwdzhxRFVyRlpubldHMzREQ3JLL3VLeitnT0dXVk91OS9WdGFrTnI0ZmxjN3NlalpmUTk0Qk1mUkYvZ1laRGd6NkhpNEtKRG9XTWtUV09qNUtXUUpRQmtKZWNKWlNibmFFZW1hQ2lwaG1rcDZvaXFhdXVhcCt2c2hxdHM3WVV0YmV6dWJxdnZMMnJ2OENud3NPaXhjYWR5TW1YeTh5U3pzK00wZEtIMU5XQjE5aDdtUUhib2QzZnlwbmluT0hsbHVmb2tlcnJpKzN1aHZEeGdQUDBldmIzZGZuNmIvejlhZjRCUENOdzRCMXlCdTBVVEtobElVTXFEaDlLaVNpeEVhV0tiaWhpVEtKeC95TWloQjRQWGd3cDBoSEprb2xPZ3Vtb0VnZkxsalpld29RaGM2YUxtamJIZ015NUJDZlBKanQvRXZFcE5BVFJvaCtPSW9VMWNxa1FwVTVwQlkzcWNpclZxMWl6YXQzS3RhdlhyMkREaWgxTHRxelpzMmpUcWwzTHRxM2J0M0RqeXAxTHQ2N2R1M2p6NnQzTHQ2L2Z2NEFEQ3g1TXVMRGh3NGdUSzE3TXVMSGp4NUFqUzU1TXViTGx5NWd6YTk3TXViUG56NkJEaXg1TnVyVHAwNmhUcTE3TnVyWHIxN0JqeTU1dFNVQ0IyN2h6Njk3TnU3ZnYzOEIvQ3docE83ang0OGlUNng1QVhMbno1OUJ2TS9kWVBMcjE2NzJuYjZ5T3ZUdDJBczI5aTdjT252cjQ4OC9MYjBmUEhybDZqTnpieStmOXZtTDgrZmh4aDgvUC8vYisvbUg1L1FmZ2ZBSU8yRjZCQnFLSFlJTGpMY2lnZHc0K2lGMkVFbHBIWVlYUVhZaWhjdlZKZE4rRzVHa0k0bkVkUHZUaGlPbUppQ0p3SlRKMDRvckphUWNmak5mSmFGOXZCT1NvNDQ0OEVqREFqMEFHS2VTUEFoUnA1SkZJQ21DRkJRa0FBQ0g1QkFVQUFBWUFMT2dBSmdDQUFBa0JBQVAvYUxyYy9wQUZFS3U5T092TklRZ2dRSFZrYVo0bXFFNGo2cjR3dWM1aWJOKzQ4czEwbS85QURXODRDUnFQangyUjUwTTZjOHRvODBsRlJhL0ZxcmFreEJKcjIzREc2NTJLejRzdVdZcHVMOVpyczVzS2g4L0Y2dnBTZmovcXlYMWJlWDlNZ1ZxRVdJWlZnNGdxaWxTTWpWbVBTSkpMbEU2UmpYeVlOcFpFblVlYWlKeWhMcU9JcGtHZlE2cEFxSCtscmltc003TTVzSHF5dHgyMXRyeWV2aXE3d0JtNWVzVXh3bzdKTDhkd3hNMFd5eURTTHRTVDFpVFBkdHEweTlIZURkeGs0ZUlTMU9jeTFPYnE1SURxSE5qdDUrOWU4ZkxwK0VMcys4Ylkvc2IwQzJqQlhpS0Mwd1lpaElBdHdNSUlCcTg4akRCdlloS0FGaDFVek1nZy8ySVVqaDAzZ2pRZ0VxVEhTeU1WbE9SNEVsVEtsa1BvaVd1WTBnRE1RaWxYWnJ6NUs2ZENreGhyOGd4Uk0yU3RvaG8vSWIyNGFhbUhWRTRwNm9wYWdSdlZDN2xrQ2oxNFZhRExyaG9HYWFXcUJxeUpIV1BOcGpYTHRxM2J0M0RqeXAxTHQ2N2R1M2p6NnQzTHQ2L2Z2NEFEQ3g1TXVMRGh3NGdUSzE3TXVMSGp4NUFqUzU1TXViTGx5NWd6YTk3TXViUG56NkJEaXg1TnVyVHAwNmhUcTE3TnVyWHIxN0JqeTU1TnU3YnQyN2h6Njk3TnU3ZnYzOENEQ3g5T3ZMang0OGlUSzEvT3ZIbk93QUVLRUJEd2wwQ0I2d1FjN28xK3ZmdUF2ZGE3aTZkK1Y0RDQ4OUsxMDBYUGZvQjZ1QVBZeS84T2w3dDgrZVRiaHI4dlB6dGI4Ly84QmVnZVdQc0Z5RjkrVGdGb29JSFRPV1hmZ2d2NlYxUjhFRlpZQUgwalBXZ2hoQWhhVk9DR0VFbzRrWUlnYmlnaVFoK1dhQ0dHQVZHbzRvc2RxcVBoaXlXZWVFNktOSlk0NERrejV2Z2lpOWJnNktPS0RWcEQ0cEJEMmdpTUFFSWlxU0tReFJ6cFpJNHhBdVBpbERrVzJVd0FUV0pwb1pLOGNPbWxqMUF1T2FhUFZmSnk1WmtnZ25sTEFHdXl1ZUo3eFlncHA0N2FNSGxuaVduZUl1V2VETkpaVEp5QUNpaG9tSVFXZWwrZnM5aXBLSU9NdXZMbm8reTVlVXVpbEo1WHBwV1pHbmhvbUYxU2Fpa3Zlblo2WHFSbW1vcmRwOVpndWllcVc3cDZKZ0VMT1Fvb3JONlVldWVtQVUwNkphN3h5RW9qcjdXR1dpT3JFOW1LWmxReXZwcUlMRWpDR2dpc1JYRCsySmF5RVQ2N2xLNExUbHRVcytJUmE1YXNvN0pWN1h4NVlidGpYaVNXT3hlRjNzS0Zhd0lBSWZrRUJRQUFCZ0FzNkFCaEFIOEFDZ0VBQS85b3V0eitNTXBKcTRYZzZzMjc3MEFRZkdScG5rOG9CaG5xdmpDMnptMXMzK1NzczNqdlU2cmQ3RWNzR29KQ21uRVpReVoxektqSitkVFZwTmhMZGN2TGVpVlU3dTVMYm9URnUyc1plMFlMMWV1bGV3NlAvOXJ6Wk4xdXcrZWZmRDUrZjA5N2dTV0RoRldITUlxT0lvYU1Hb21QaTVJZmxKVlZrWmN5bXArY25RdVpuMXlob3FXcElxSmdxcW1uaDZTdW02d3BzNkMxRDdlZnVRNnl1Mm05REwvQVNzSUt4TVVyeDhqS2pyQ0J6b3JRZk1uSzFIYld5c3hIMG9UWWNkNS80R3Zhd09SbDVzRGM2cnZvWk8yejcydmlhUE54OGJ6Y3V2VjYrNTc5VnR5VEZIRFpQd29CQjRyS1orcWdCbWtLZXpFVTR0RER1WW9lSm5iQmFQSC9GVWNUcFQ2ZU1CZFI1RE9STDM2VlJMa2d6MHFXemNTOGhEbHF5MHlhREN6aHhCSG01czRHVm40U1VlRlRhQXFqU0pNcVhjcTBxZE9uVUtOS25VcTFxdFdyV0xOcTNjcTFxOWV2WU1PS0hVdTJyTm16YU5PcVhjdTJyZHUzY09QS25VdTNydDI3ZVBQcTNjdTNyOSsvZ0FNTEhreTRzT0hEaUJNclhzeTRzZVBIa0NOTG5reTVzdVhMbUROcjNzeTVzK2ZQb0VPTEhrMjZ0T25UcUZPclhzMjZ0ZXZYc0dQTHRpQ2dyUUFDQlVha0RZQzdRQUVDYVFmNEhsNmdkbGtCeElrREgzczdlZklCWVhrN242NjdxL0RwMDZGelJZNjllL1dyMHJ0M1gyNDF3SFh4NG8xVFBZOGVQVlh1N2VOcmZ4byt2djN2UytIYnQwK2VhWUQ5L3dEbTlwUitBWXJYSDFPOUZZaWVldjRwR0I5VTdEbVlIWDBTb29lZlVnUldxQnhVQ1dxWUhJTkwvZWVoY3djdTFlR0l2b0dvbElnb0VuZGhVaG1PT0Y5VEo2TDRJbElzdHZnYmh6b09wMkpTT2JaWW9sSVJvamdqZ2ozNmRxTlJNWG80WkZJMWpyaWtVRUdpK0NSU1JZNzRJNVJKRmdCVmt4b2VhV0tYVS81VTVZaFhHcFdsaDJYKzFHV2FRb0ZaNFpaSVJja21oVW1LU1NTWlVMMzVaWmQwR21WbmhYQ2EyYVdlU2EycFlaczRuZWtob2tqSktTR2pPQTBxWWFFN09hcGhvRUlwV2lGVW1sWUlLWk44UG1XcGc1ZzJXcXBUcHlxWUtrMmhTc2pwVDU1S0dGV3JCWTVLNWFvMEp2a3FUTEU2T090T3RicDZhNUxENGlScGdEY0VKTHNUcnZKUmFxaUd6VnBWN0hnQ1NNdGxydHBpR09BQXpyTEtYN2g0R2todVZJbzIyKzFVMDZscmxuN3Vvb1Zidkx1ZHkwd0NBQ0g1QkFVQUFBWUFMTFVBdWdERkFNQUFBQVAvYUxyYy9qREtTYXUxSU9qTnUvOWdLSTRpY0oxb3FxNFk2YjV3L0xGMGJkOU1KdTk4citIQW9EQ2k4eG1Qb2FGeWlTc2luMCttZElweVFxODlxbllMc1dLL01LNVk3QVdiUmVNMHRYeHVkOVR3SmR0Tmo5dURjM3I3enJmbDlXWjlnaXQvZ0YrRGlDZUZobGVKamhTTGpGR1BsQStSa2tlVm1qbVllcHVmbDUxWm41cWhvanVrcGFkN3FaU21xMkd0ajYrd0xyS3p0V0MzanJTNWFMdUl2YjRnd01IRGpjV0N3c2R2eVgzTFBBRFMwOVRWMXRmVXp0cmIzTjNlMytEaDR1UGs1ZWJuNk9ucTYrenQ3dS93OGZMejlQWDI5L2o1K3Z2OC9mNy9BQU1LSEVpd29NR0RDQk1xWE1pd29jT0hFQ05LbkVpeG9zV0xHRE5xM01peC82UEhqeUJEaWh4SnNxVEpreWhUcWx6SnNxWExsekJqeXB4SnM2Yk5temh6NnR6SnM2ZlBuMENEQ2gxS3RLalJvMGlUS2wzS3RLblRwMUNqU3AxS3RhclZxNDhFYU4zS3RhdlhyendMaUIxTHRxelpzMkhQcWwwN05pM2J0Mlhkd3AwcmQrN2J1bmJYNHMyTGRpZmZ0d1QyL2gwYjJPOWd0WVYxSGtZcytIRGluSXZQUHNZWjJlemttNVhMWHJhWm1lem1tcDBKTng3OG1XWm9zYVZubmk2UVd1YnExakZmai80TEc2WnN3NkZydjF3OVlEYmYzcmc3QTFkOGVqams0cjd6R3FlTVBIam01WmliRXc4Tm5iUDA0OVNUMjYwTytqcno3TTRyQzlBK2QzejR5T2FuZDA2UGZUMTV1T3kvdXorL09INzAwUGF0NDMvL05uLzMvVjMwSGVhZmFhY05xRnFCL0xFVlFJSnJMUmpnWUE2cWwxbUU3VTNJb0ZvVXltZmhnMzlsZUY5bkh1b0g0b1ZuaGZqZmlCenlaU0tCb2ExNFlJc2ttdVdpYTZmTkdGdU5NY2FWSTFrOXJlYlRCbG9OSUNRQlJCSUptRzR2SlFBQUlma0VCUUFBQmdBc1lBRHVBQWdCZUFBQUEvOW91dHorTU1wSnE3MDQ2NjBBLzJBb2ptUnBuaGtRQkI3cXZuQXN6K1pxdDNTdTczeXZxVGFiYjBnc0dsM0JKTzdJYkRxZndHUncrYXhhcnpDcGxvWHRlcithclJoTUxwdWpZaW5Wekc0YjAvQzFlMDZQb2VGYmVYM1BCK0gvZW4yQ2d4SjNmMktCaElxRGhvZHBpWXVSYzQ2VUs1S1hmSTJWajVpZGJadWdrSjZqUnBxZ2VLS2txanVuclFHcnNFV3VycW14dGlTbXM0ZTF0NzBidXNDOHZzTVR1Y0NVeE1rZng4ekN5c25HekpYT3o3N1Iwc2pWMmhIWDJJRGI0QTdleDlUaHE5M2pjZWJtNk9sajYrSHQ3bXJ3NGZPMDlkdnk5MVA1MnZ2OExQbXJCcEJmdVlHWEN0NDdpREJTd0ZBTm9UMmNGbEhpUkVjTUt6SzZpRkgvNHpDT2pqeCtCSWxLeGdBQ0FrUmFVWmd1STRVQUJXSVNlS1VTQ2trdExpa1FpTWx6UU0wcUxNbkZnTW16YU1xZlRtNnV5RGxoWjlHaU01RTJDZHBLaG9DbldBc01vQ20xRkVlbUVyS0s5ZG4xQ05XUU1RYUlYWHUwYkpHejZyS3NuUnZWcmF4NUp1ZnEzV3FYQ0Z4NmN2VUtidHUzeDkrbE1wd0sxb3V5OEpDL1lDRmNYVXk1cm1NZXdSSlQzcXoxc3VGWlZqbHZKdXVaUjhISUQ0aUtYc3kxdEdtS2FWY3ZKdXo2OHlFWnFtV3ZKVkQ3eUxjWWluV0xiZDM3TVJ6Y3d1a1duNXBIYy9MaHk1M2NRZjFnOG5Pc3BLTTN1VEhqdWxqdFY2Zy9VT3Y5S1czd3BIS1hMOEFiZlN6eTYyTVNkKzlKZmZuMjlGVUZYejgvL3lYci8vRmw1MThuKzNtSDM0Q2RBTGplZVFoR0VoOVBCellvQ1h6eDlTZmhJUFo1SitDRmloVG9uWVVjOHBIaGRReUcySWVIejBWb29pQUtsbGZpaW5XZ21KeUtNTzVCSVg4MVl2aGdUQnZtU01lTjVma295SWpQdlNpa0dUSUtSK09SYkJDWkhJaE1rcEdrYmt0R1NVYUxIMXBKeDQ2ZGFla0drTjU1NllhVHdoa3A1aFZncG5obWsxeEN1V1lWVThyVzQ1dFhZSG1kbTNRMkVlZHFjK2I1aEoweit2a0ZtYnFaS2FnUmFRWjZLQmFFeW9ibm9rUHNLVnFma01yU1pxVldTTXFab1pqeUFLaVNuVlp4YWFoT0NLRHBZbFdTT2tRQWlhNzJxS3FlbmpvV3JGZXcraHl0ako1VUtLNWQyQ3BhcXJ3eVlTcG5yd1pMaEsrQ0FXdHNFeVBENmxYc3NySTBteFdsMEZhQkxGVFZ0aUhBalp4bVcwV3p5bnFMaGFuUGlvdENBZ0FoK1FRRkFBQUdBQ3duQU80QUFnRjlBQUFELzJpNjNQNHd5amJJdkRqcnpidi9ZQ2lPa1ZDY0FxbXViT3Urc0JnUTUybkZlSzd2ZkI0TXRXQ3FSeXdhajBWVGNCbEFPcC9RYUdhMnJBNmsyS3lXK0t0NkM4MnRlRXdHQWIvZVczbk5iaXNFTlBSMzZLN2JvVlE1V24zdiszVm5lbkpYZjRXR0tuQ0NpbUdIalk0WWVZcUNmSStWbGdhQmtvdVhuSTFLbXBxVW5hTnRrYUNhZEtTcVpKbW5vS3V3VzUrdXJvU3h0MGltdEs2TXVMNDdyYnV1b3IvRkxMUEN3cjNHekRKeHlkREV6ZE1hd2REQ3FkVGFFOGpYMTh2YjRRdTYzdEMyNHVoZDVlVUU0T2phM2V1N0JObnY4TS95eWZYMjArVDV0ZTc0TWJQMkQxUTdnZUVTRmNTR2NKdS9oWkxPTld4R0VLS2dBUUVuNG9wbmNmOVNSbzJ4SG5hVXN3OGtyb29qdjBnMCtRdGx5aVVIV1RiaitESUlQWm5VUk5Zc2lmTVh6WlFyZXpMVENUR20wRzAvQzk0OEtvNm92S0JNc1FBNGtyUWN4cWhqQUFRSU1MV0kwMlJHc1diUnVuVXJWWWc4eFRvcHk3WnJFWHhXMVc0aHk3YnMyWFZoNVVLaFc1ZnRFWmVTOHVwMXdyZHZXeU5WQmFVZHpNV3c0NDh4QUtPQnlyaEk0Y2VIdmNKVkpMaXlaY3lnN3daZTdEbkhaZEI5M2ZiNFdvQjBhUnlvWTBPR1VaWHlheDJuWlJ2K3UyZjI3UmU1ZFJ0V3pjT2Y2OTh1Z2d2ZmpYaUpiZVE0bEMrdlM1ekhtYXZRa1VpZmJ0ZklETi9aWVhOSFhUMzhyZTNqelE4ZGoxcDlNZlRjeTd0WEJYLzYvRi9zUWN1LzM2bitjdjcvdU9TSDJYNEFXdUtmY0FRVytNaUJ1aWtJaTRDUEplamdJUXpLTnFFcUVEb200WVYvVkJnYmg2Tms2QmlJbllpWUdvbVhlTmdlaXBhWVNCMkxsYWdZR295UHVKZ1pqWTNZMkIyT0ZPcG9GbytIK01nVmtJYklpQm1SaGdpNUlaSmpDTWxraHo0dSthUVdTazU1aDVHUFdYbEhsVnJXNFdTWGJtQTVISmh1ZkVubUdtSXlkMllaWEs2WmxabHVpcEhtaTNFMjZXT2RiK29vSlo2cjNjbW5GblBXOVNlZ1VRNmFCWnlHUGhGb1dYc21HZ09pamg2eDZGYU5SdW9DcEpaNjVXZW1raGJLNlJHWWZvcWJwNkkycG1PcDN1bUpLaEdMVnJxcURDYTYrbW9JWXNvNks2enNBV0RycmJoT3R5dXZJakQ0SzdBaklFaHNGT2dOZTZ3S0dQb3B1eXl6d3puN3JBcUY2VHF0R0l4S2V5MEwxb2FRQUFBaCtRUUZBQUFHQUN3WEFMb0F1Z0RBQUFBRC95aTEzUDR3eWtubE1EanJ6YnYvWUNpT3BEWlVhS3F1emxXK2NDelAyY25lZU83U2ZPL0R0cHh3T05uOWpzZ2tnY2hzTW96SnFEUzJkRnFGMEtsMjY2bGV2NnNzZDh6MWdzOFVNWGtkTmFQZkR6Vjc3b1BiSVhLNlhuYnZQL2VBZFg1OWVZR0dJSU9FaDRzdmlYZUZqSkVHam5hUWtvdVVjSmFYaHBsdm01eUFubWlnb1hxalo2V21jNmhncXF0cmJxMUVyN0Jqc3JOWXRweTR1VGkxdTFxOXZpekF3VkxEeENyR3gwbEJ5anJOak0vUU44elNTUUhhMjl6ZEFRTGc0ZUxqQWdQbTUranA1Z1RzN2U3dnZkZlk4L1QxOXZmNCtmcjcvUDMrL3dBRENoeElzS0RCZ3dnVEtseklzS0hEaHhBalNweElzYUxGaXhnemF0eklzZitqeDQ4Z1E0b2NTYktreVpNb1U2cGN5YktseTVjd1k4cWNTYk9telpzNGMrcmN5Yk9uejU5QWd3b2RTclNvMGFOSWt5cGR5clNwMDZkUW8wcWRTcldxMWF0WXMycmR5cldyMTY5Z3c0b2RTN2FzMmJObzA2cGR5N2F0MjdkdzR6SUNRTGV1M2J0NDgwYjF4cmN2MzcxK0EvY0ZMTGp3TnNLR0N5Tk9ISGd4NDhGUUh5dU9MTGt4NWNxUW4yTDI2M2l6dHM2ZVFXOFdqWmwwWmRPU1VUOVd6WmgxWXRlR1lVL1c3Tm1iYk1HM0xkT3V6UzAzNTh1OFB3TVA3anV6MCtDOWgvTXUvbGQ1YmVhMm5ZZVdQcHA2YWV1bnNhZld2cHA3WWdEUXVZSDNibmo4N3VEbWp5TVBrTDdwZXZiaHQ3Vm4rbjcrMHZyeHRkbFhpcDk4NGYxSlNmVjNIbThBSWlXZ2VzZ1ZlTlNCN3Eybm9GRU0wdWRnZnZENUo5aURSVVY0MzRRV0JvWWhVUnJ5eCtHQXRYMDRWSWdCam9nZ2VoU2FLQlNLQnE0bjFYc3p5aWpWWGFFbEFBQWgrUVFGQUFBR0FDd25BR1lBZFFBQUFRQUQvMmk2dkJJdHlrbXJ2VGhyRmtnWld5aU9aS2tNUlZvSVp1dSttNkNxQkFUZitOdk44MkRud0NBR3hlT0JoTWlrbzhna3NKUlEzSTdaL0VXdkpCbDFlOFI2TmRQdDl2a3RVNGhpc2RQTVptalQ4RnFialliRHUvUHIyODRuNTVVZWZJSUZjbjlJZTROOFBvWkFZWW1EZUl3dWlJK0RmcElranBXSmhaZ2psSnVKaTU0Ym1xR1ZsNlFWb0tlUGE2b1ZwcTJibmJBTnJMT2JrYllHQVhXNXM2bTJzc0NWdGJ3R3VNV2NWcnkreTdtN3c0SFFwOEt3eXRWMng3eS8ycUxOMDkraDB0ampvZGVxM3VmYjRiREU3R0xscXRueFRPbWs2L1piN3UvVSsyT1FTYWdYajREQU13RHZIYVFBNzV6QmhhdisyZXNIa1lFK2JmTXFjcEQ0VGYrakJnRWNsK0h6R0lHZ01aSWhua0dqaUpKaFNGb3Rzd0JqR1RQV1JVVTFUVFJNazNNU3FwNHZiaFo1Q05URlRoVTBpOGE0b3pUSHphUk5VNGJNR0xVRUlxSlZnYUFabVZVbkFheGR3NG9kUzdhczJiTm8wNnBkeTdhdDI3ZHc0OHFkUzdldTNidDQ4K3JkeTdldjM3K0FBd3NlVExpdzRjT0lFeXRlekxpeDQ4ZVFJMHVlVExteTVjdVlNMnZlekxtejU4K2dRNHNlVGJxMDZkT29VNnRlemJxMTY5ZXdZOHVlVGJ1MjdkdTRjK3ZlemJ1Mzc5L0Fnd3NmVHJ5NDhlTzRBd1FBQUJpQWN1WE0rejZmenRmNTlPZlI4VjdmbnAydTllM1h1OGNGVHg2cTJmTGx4YS85amg2OGVyVHQ0NzhueXo0KytmbGk3ZXZIWDdXK2Z2VGYvQ24xMzREbXhlUWZnZVdKZFNDQzd1WEhvSHdLUGhqZldCSzJGMkJPQzFhb0hJVWEzaGRoaCtCeENPSjFJbzZJM1ljbVBsZGlpaGZXbEtHR0s1cllvb0VwVXVkZ2pRVzI5S0tFTThhRTQ0WTMxdGdqU2p0S0dPT0lRNUpVSklOSmt2Umpqa1QrMktSSFR4NEo0cFFWTGNtZ2xSMk9wU1dCV0ZaVUpZb3NjZ2tqbVRLYVdhR2FScUtKSkpzUGVpa2xuRnU2ZVNXZENNcUpvNTVDNGtrZ24yVUdtU0tnYVFyNnBwMWQrdmxmbUZudVdkYVg5akdxNUlocVFVb2VXNWFHNTFhbVFMNWxxYVJLUVZyWGtxRDJ0Mk5lR1ZiSG5WL3NCZVpjcVJZa0FBQWgrUVFGQUFBR0FDd25BQ29BZFFBQUFRQUQvMmk2M1A0d3lrbE5DRFhyemJ0WEFrRjhaR21lSUZHc0F1cSs4Q0lNYXozR2VMNEZkTzBQdXFDd0VRajVqZ1hNY0lreklvODNwdFRFZTFxVjB5ekhhVVZHdFdCSnRkdHRoYy9FZ1lwTVJyc3RQVFlaK0FaejVXUnNmVG5HeTc5N1FYZCtiSHFCT1FLRWhJQ0hPR3VLY21hTk9RR1Fmb2FUTDQrV1hYU1pNWldjaFo4NGNhSlBqS1JVcDJTU3FpaUpyS2l2TUp1eU5aNjBKckczUjVpNkhyYTl1Y0Fmb2IwK3Y4VWJwc2lweXhySHlDelFKTTNJMVNUVFA5a2V2TnZLM1JMQ3Q4L2lFZC9UNGVjUDVMTG03QTdTMDY3eEV0ZTk5aFh6eU1UNkQvaHVyZnRud0IwcmVBVFRJYXRIc0lIQlV3ai84ZXZGc09HQ2g2Y0c2cHQ0eS8rZlJRVUJaV25VdDgzR3h3Y0tLWjUwZ0pGVFJIMHBPNjUwV0hMRnlIZ2NaWG44R0pMVlRYWTVEODVrMFBOVXhZODFWd3lWa1hTbnhaYWNmcDRMQ25HcEFxaVdwSXFqS3VxbHZhS2lqamJrS3NxcWdaZzZ6V0pWNUxRaFdwZGEyYTFsSTNZbFdUWnRoNEx0UWlBdXdidFE2cG8xc05lSDRNRUtDT1ZGekpSTlg4WWFEQkk0REpsQnpNV1ZXUjRaNExmeXNjZVpQOUNnSExxMDZkT29VNnRlemJxMTY5ZXdZOHVlVGJ1MjdkdTRjK3ZlemJ1Mzc5L0Fnd3NmVHJ5NDhlUElreXRmenJ5NTgrZlFvMHVmVHIyNjlldllzMnZmenIyNzkrL2d3NHNmVDc2OCtmUG8wNnRmejc2OSsvZnc0OHVmVDcrKy9mdjQ4K3ZmejcrLy8vLy9BQVlvNElBRUZpamJCYmtCY0VFQUFOaW00SUlJenZZZ2hCYzBHTnVFRkZiNEdvWVpMdGdhaHgwdWFHRnFJWmJZbVVVZ21paWlhU21xQ0dGcExzWllXWXN4VWppaVZUVFdtT0ZnT3ZaNDQwazU5dGpoVEVFSzJlR1BFaG1wSklwS05ubmlKRVU2V1NLUzJVaHBKVHRSV21raWxicGtxYVdLVlg3NUpaZWZlQ21taTJRZVl1YVpMdEt5SnB0YnVnbm5tSExPYVdXYWU3eHBaNFo0MXJIbm5YWCtxV1NmYitncGFJU3ZITm9rb1c0WUtpaWphRGo2SjZSb0tMcWtMcFlLU1dtam1jYTRhYUdkeHBtTnBGK2VRNnFVbjBJWnFvYjJuQ3BrUTY1Nnl1U2hxUUlUNjVGTDdXbldyYXlhZFdhdHBtb0pMRTVTc3Jnb2Ftc09DNnVPR01wK0ZDVnNLalpMWklqU0xnWGliUkJXTzVpQzJoS1VBQUFoK1FRRkFBQUdBQ3dYQUJjQXVnQy9BQUFELzJpNjNQNHd5a21ydlRpN3dJVVlJQ0dLUldtZWhhaXRiT3UrTUlYT2RGM0VlSzd2c08zWHZLQndPUHdaVHdHaWNzbkVISi9KcG5RNmZSNmoxS3lXWnpWaXQrQXdxL3Y3aXM5b0NkbG5UcnZmYTF2N1RSZkhhL082UG51bjVmZUFUSDB6ZjRHR1FvTW9oWWVNT1lsSWpaRkZqeVdMa3BjYWxKV1luREdhQlphZG9oR2ZvYU9uREtXb3F4V3FySzhRbndLd3RBMnl0YmdHdDdtMHU3eXZ2cityd2NLbnhNV2l4OGljeXN1WHpjNlIwTkdNMDlTRzF0ZUEyZHA2M04xMG53UGd6NXJqNU5MbTZPbVU1K3VINHUvVjZ2TFk5UFhiOS9qZSt2dmgvZjdjeEF0WVp5QkJPQUFQMmttb0VJekJobWMrRVlDWVJpSkZOQll2THFRMFVmOWptSXdldDRBTXlVZFRSNUlsT2FMVU1uSmxrNVl1bDhDTVNXUW1UVVFtYjc3TXFWTW16NTQxZndMRnFYTG9wS0pHZzN5NmtWVHBwNlpPTlVIbDhuU3FqcVZXcjFiTjZta3IxeGNnd29vZFM3YXN1NjlvMDZwZHk3YXQyN2R3NDhxZFM3ZXUzYnQ0OCtyZHk3ZXYzNytBQXdzZVRMaXc0Y09JRXl0ZXpMaXg0OGVRSTB1ZVRMbXk1Y3VZTTJ2ZXpMbXo1OCtnUTRzZVRicTA2ZE9vVTZ0ZXpicTE2OWV3WTh1ZVRidTI3ZHU0Yyt2ZXpidTM3OS9BTlFEZ1FMeTQ4ZVBJa3l0ZnpwdzV4ZWJRbzB1Zmp2dzU5ZXZZczNPd3JyMjdkK1hjdjRzWEgzNjgrZXpsejZ1WG5uNjkrK1h0MzhzM0huKysvZnIyNWVQUDczNC9mL1ZFL3YxblhvQUNrZ2RSZ2Z3UmlHQjNDaTZJM29FTzZnZGhoUDFOU0NHQUZsNDRZSVlhR3RoUWh4aCtDT0tHSW83b29VSW1qdWNSQUN5MjZPS0xNTWJvNG9JVUpRQUFJZmtFQlFBQUJnQXNKd0FtQUFFQmZBQUFBLzlvdXR6K01NcEpxNzA0NjgyN0dvSW5qbVJwbm1qS0NVVkJDSUVxejNSdDMxV3J2ekh1LzhDZ2tESFFHWG5EcEhMSnZBU01VQmVzU2ExYWdZUm85SFh0ZXI4aWxsYkxCWnZQYUVaMlBBYWwzM0Jxa1UwZjlPTDR2TzFKN3lQMWdJRWxhMzErSVlLSWlSZGloWTEyaXBDUkRZU05oV1dTbUlKemxaVUVtWjk2Zkp5Vmg2Q21hWlNqZEo2bnJXYWlxbjEzcnJSV3FiRmFBN1c3Vll5NGJMekJTN0MvV3FYQ3lEK2J4VnZKemo3RXpFYXp6OVVxdDlJdTF0c3F2dGs2MU56aUhkSGZ1dVBvSHN2ZkxlbnVHK1haeCsvMEU5alNyUFg2RWQ3czRmc0FEYkNEY2k2Z1FRUHIvQjAwR0U5YXdZWDc3akhMQjFGZnYyL3pLcjRiZUVULzQ3NkUzLzU1Rk5lUTJjT1I2U1F5RTRuUzJrVjVMZCtwL0VVeHBqaVEyVmphVEZheVdNMmQxbWIrMGdrMDJFdUhSY1VKeFpXVUcwNXBHWnNLNjBsVGFsQ080S3crbzRycnAxWmVTMk1SL1dycXFVbXl5TGpHOG9yV1ZWaFZVZHVlVXF1S3JWeFRiMGVOdlJ2cDZGbSt0T2lxMmdzNGtkbGljUXRMRXN6SnJ1SkllVGtsZnF6SXIwL0twaGh6SW93NXorRmZKenREMGx5SmN3a0FBRVRYaUV3S0NJQUFzRlhMc0Z3VkNPemJxV1dmd0pyMXgrdmJ1SFdUb04zVk5mRGpBWElMN3lDQXRTemJ5SkV2RHpNd2RJM2YwWThybjc3aGN5UGoyYk52NTQ0aGdITWRrMVZnRHgrZC9Bcm5qdFd6bnovZXZRWHZVRXlUbU04L3VmME0vd0hncDQxdi9mVlgzMzhTbU5lSWZpTVU2Q0NDR0ZobUhRM3JPVWdmaEJmZ0ZKOEtGblo0SUlZT0tBaEZlaWxVMktHQklGSWc0b0ErbUhoaWdTbFNJQWFESXJqNElvb3hTa0FpQ2piZVdPQ0hPUWJSbzQ4L0JxbkVrRVFXYWFRUVNDYXA1Skk0Tk9ta2cwQkNlWUtVVXo1b0pZVlpkdW5mbGpOZzZTVi9WWUpaNDVoVGxta21CMktpeWQ2YThybEpwSnB3YXRDbW5NalJXV2Q1ZVBxbzU1NFYzTmtuY0lDYUlPaWdYeGJhSUtJbi9xbG9CSWNpK3VnSWtmYnA2S1FQTU9vaHBoNVVpdWFsbkQ3Z2FaZWhscUJwZUtDV0NzR29SS3A2NWFuQnVYb0NyRFRLT2dHck1Ob2FKNTZwNm1vQnJ0bjV5dVdud2w0M1pyRTNBTnNyc2l3WjRNcHNpNjArUzJDajBnWnhZclZNVW9udEVGSnVxOFNGM2liUlk3aE1tRWd1RmNBdGV5NlBzVEdiQUFBN1wiIGFsdD1cIkxvYWRpbmcuLi5cIiAvPlxuLy8gICA8L2Rpdj5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXR0LXJ0dGFtYXBsaWInLFxuICB0ZW1wbGF0ZTogYCAgXG4gIDxkaXYgaWQ9J215TWFwJyBzdHlsZT1cInBhZGRpbmc6IDBweCAwcHggMHB4IDEwcHg7XCIgI21hcEVsZW1lbnQ+XG4gIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFJ0dGFtYXBsaWJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbm5lY3Rpb247XG4gIG1hcDogYW55O1xuICBjb250ZXh0TWVudTogYW55O1xuICB0ZWNobmljaWFuUGhvbmU6IHN0cmluZztcbiAgdGVjaG5pY2lhbkVtYWlsOiBzdHJpbmc7XG4gIHRlY2huaWNpYW5OYW1lOiBzdHJpbmc7XG4gIHRyYXZhbER1cmF0aW9uO1xuICB0cnVja0l0ZW1zID0gW107XG5cbiAgZGlyZWN0aW9uc01hbmFnZXI7XG4gIHRyYWZmaWNNYW5hZ2VyOiBhbnk7XG5cbiAgdHJ1Y2tMaXN0ID0gW107XG4gIHRydWNrV2F0Y2hMaXN0OiBUcnVja0RldGFpbHNbXTtcbiAgYnVzeTogYW55O1xuICBtYXB2aWV3ID0gJ3JvYWQnO1xuICBsb2FkaW5nID0gZmFsc2U7XG4gIEBWaWV3Q2hpbGQoJ21hcEVsZW1lbnQnKSBzb21lSW5wdXQ6IEVsZW1lbnRSZWY7XG4gIG15TWFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215TWFwJyk7XG4gIHJlYWR5ID0gZmFsc2U7XG4gIGFuaW1hdGVkTGF5ZXI7XG4gIEBWaWV3Q2hpbGQoJ3Ntc3BvcHVwJykgc21zcG9wdXA6IFBvcHVwO1xuICBAVmlld0NoaWxkKCdlbWFpbHBvcHVwJykgZW1haWxwb3B1cDogUG9wdXA7XG4gIEBWaWV3Q2hpbGQoJ2luZm8nKSBpbmZvVGVtcGxhdGU6IEVsZW1lbnRSZWY7XG4gIHNvY2tldDogYW55ID0gbnVsbDtcbiAgc29ja2V0VVJMOiBzdHJpbmc7XG4gIHJlc3VsdHMgPSBbXG4gIF07XG4gIHB1YmxpYyB1c2VyUm9sZTogYW55O1xuICBsYXN0Wm9vbUxldmVsID0gMTA7XG4gIGxhc3RMb2NhdGlvbjogYW55O1xuICByZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscyA9IFtdO1xuICByZXBvcnRpbmdUZWNobmljaWFucyA9IFtdO1xuICBpc1RyYWZmaWNFbmFibGVkID0gMDtcbiAgbG9nZ2VkVXNlcklkID0gJyc7XG4gIG1hbmFnZXJVc2VySWQgPSAnJztcbiAgY29va2llQVRUVUlEID0gJyc7XG4gIGZlZXQ6IG51bWJlciA9IDAuMDAwMTg5Mzk0O1xuICBJc0FyZWFNYW5hZ2VyID0gZmFsc2U7XG4gIElzVlAgPSBmYWxzZTtcbiAgZmllbGRNYW5hZ2VycyA9IFtdO1xuICAvLyBXZWF0aGVyIHRpbGUgdXJsIGZyb20gSW93YSBFbnZpcm9ubWVudGFsIE1lc29uZXQgKElFTSk6IGh0dHA6Ly9tZXNvbmV0LmFncm9uLmlhc3RhdGUuZWR1L29nYy9cbiAgdXJsVGVtcGxhdGUgPSAnaHR0cDovL21lc29uZXQuYWdyb24uaWFzdGF0ZS5lZHUvY2FjaGUvdGlsZS5weS8xLjAuMC9uZXhyYWQtbjBxLXt0aW1lc3RhbXB9L3t6b29tfS97eH0ve3l9LnBuZyc7XG5cbiAgLy8gVGhlIHRpbWUgc3RhbXBzIHZhbHVlcyBmb3IgdGhlIElFTSBzZXJ2aWNlIGZvciB0aGUgbGFzdCA1MCBtaW51dGVzIGJyb2tlbiB1cCBpbnRvIDUgbWludXRlIGluY3JlbWVudHMuXG4gIHRpbWVzdGFtcHMgPSBbJzkwMDkxMy1tNTBtJywgJzkwMDkxMy1tNDVtJywgJzkwMDkxMy1tNDBtJywgJzkwMDkxMy1tMzVtJywgJzkwMDkxMy1tMzBtJywgJzkwMDkxMy1tMjVtJywgJzkwMDkxMy1tMjBtJywgJzkwMDkxMy1tMTVtJywgJzkwMDkxMy1tMTBtJywgJzkwMDkxMy1tMDVtJywgJzkwMDkxMyddO1xuXG4gIHRlY2hUeXBlOiBhbnk7XG5cbiAgdGhyZXNob2xkVmFsdWUgPSAwO1xuXG4gIGFuaW1hdGlvblRydWNrTGlzdCA9IFtdO1xuXG4gIGRyb3Bkb3duU2V0dGluZ3MgPSB7fTtcbiAgc2VsZWN0ZWRGaWVsZE1nciA9IFtdO1xuICBtYW5hZ2VySWRzID0gJyc7XG5cbiAgcmFkaW91c1ZhbHVlID0gJyc7XG5cbiAgZm91bmRUcnVjayA9IGZhbHNlO1xuXG4gIGxvZ2dlZEluVXNlclRpbWVab25lID0gJ0NTVCc7XG4gIGNsaWNrZWRMYXQ7IGFueTtcbiAgY2xpY2tlZExvbmc6IGFueTtcbiAgZGF0YUxheWVyOiBhbnk7XG4gIHBhdGhMYXllcjogYW55O1xuICBpbmZvQm94TGF5ZXI6IGFueTtcbiAgaW5mb2JveDogYW55O1xuICBpc01hcExvYWRlZCA9IHRydWU7XG4gIFdvcmtGbG93QWRtaW4gPSBmYWxzZTtcbiAgU3lzdGVtQWRtaW4gPSBmYWxzZTtcbiAgUnVsZUFkbWluID0gZmFsc2U7XG4gIFJlZ3VsYXJVc2VyID0gZmFsc2U7XG4gIFJlcG9ydGluZyA9IGZhbHNlO1xuICBOb3RpZmljYXRpb25BZG1pbiA9IGZhbHNlO1xuICBASW5wdXQoKSB0aWNrZXRMaXN0OiBhbnkgPSBbXTtcbiAgQElucHV0KCkgbG9nZ2VkSW5Vc2VyOiBzdHJpbmc7XG4gIEBPdXRwdXQoKSB0aWNrZXRDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICB0aWNrZXREYXRhOiBUaWNrZXRbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbWFwU2VydmljZTogUnR0YW1hcGxpYlNlcnZpY2UsXG4gICAgLy9wcml2YXRlIHJvdXRlcjogUm91dGVyLCBcbiAgICAvL3B1YmxpYyB0b2FzdHI6IFRvYXN0c01hbmFnZXIsIFxuICAgIHZSZWY6IFZpZXdDb250YWluZXJSZWZcbiAgICApIHtcbiAgICAvL3RoaXMudG9hc3RyLnNldFJvb3RWaWV3Q29udGFpbmVyUmVmKHZSZWYpO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5jb29raWVBVFRVSUQgPSBcImtyNTIyNlwiOy8vdGhpcy51dGlscy5nZXRDb29raWVVc2VySWQoKTtcbiAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zID0gW107XG4gICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFucy5wdXNoKHRoaXMuY29va2llQVRUVUlEKTtcbiAgICB0aGlzLnRyYXZhbER1cmF0aW9uID0gNTAwMDtcbiAgICAvLyAvLyB0byBsb2FkIGFscmVhZHkgYWRkcmVkIHdhdGNoIGxpc3RcbiAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSAhPSBudWxsKSB7XG4gICAgICB0aGlzLnRydWNrTGlzdCA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICB0aGlzLmxvZ2dlZFVzZXJJZCA9IHRoaXMubWFuYWdlclVzZXJJZCA9IFwia3I1MjI2XCI7Ly90aGlzLnV0aWxzLmdldENvb2tpZVVzZXJJZCgpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIC8vdGhpcy5jaGVja1VzZXJMZXZlbChmYWxzZSk7XG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gJ2NvbXBsZXRlJykgIHtcbiAgICAgIGRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICB0aGlzLm1hcHZpZXcgPSAncm9hZCc7XG4gICAgICAgICAgdGhpcy5sb2FkTWFwVmlldygncm9hZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubmdPbkluaXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICB0aGlzLm1hcHZpZXcgPSAncm9hZCc7XG4gICAgICAgIHRoaXMubG9hZE1hcFZpZXcoJ3JvYWQnKTtcbiAgICAgIH1cbiAgICB9ICAgXG4gIH1cblxuICBjaGVja1VzZXJMZXZlbChJc1Nob3dUcnVjaykge1xuICAgIHRoaXMuZmllbGRNYW5hZ2VycyA9IFtdO1xuICAgIC8vIEFzc2lnbiBsb2dnZWQgaW4gdXNlclxuICAgIHZhciBtZ3IgPSB7IGlkOiB0aGlzLm1hbmFnZXJVc2VySWQsIGl0ZW1OYW1lOiB0aGlzLm1hbmFnZXJVc2VySWQgfTtcbiAgICB0aGlzLmZpZWxkTWFuYWdlcnMucHVzaChtZ3IpO1xuXG4gICAgLy8gQ29tbWVudCBiZWxvdyBsaW5lIHdoZW4geW91IGdpdmUgZm9yIHByb2R1Y3Rpb24gYnVpbGQgOTAwOFxuICAgIHRoaXMuSXNWUCA9IHRydWU7XG5cbiAgICAvLyBDaGVjayBpcyBsb2dnZWQgaW4gdXNlciBpcyBhIGZpZWxkIG1hbmFnZXIgYXJlYSBtYW5hZ2VyL3ZwXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckluZm8odGhpcy5tYW5hZ2VyVXNlcklkKS50aGVuKChkYXRhOiBhbnkpID0+IHtcbiAgICAgIGlmICghalF1ZXJ5LmlzRW1wdHlPYmplY3QoZGF0YSkpIHtcbiAgICAgICAgbGV0IG1hbmFnZXJzID0gJ2YnO1xuICAgICAgICBsZXQgYW1hbmFnZXJzID0gJ2UnO1xuICAgICAgICBsZXQgdnAgPSAnYSxiLGMsZCc7XG5cbiAgICAgICAgaWYgKGRhdGEubGV2ZWwuaW5kZXhPZihtYW5hZ2VycykgPiAtMSkge1xuICAgICAgICAgIC8vIHRoaXMuSXNWUCA9IElzU2hvd1RydWNrO1xuICAgICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMubWFuYWdlcklkcyA9IHRoaXMuZmllbGRNYW5hZ2Vycy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtWydpZCddO1xuICAgICAgICAgIH0pLnRvU3RyaW5nKCk7XG4gICAgICAgICAgLy8gdGhpcy5nZXRUZWNoRGV0YWlsc0Zvck1hbmFnZXJzKCk7XG4gICAgICAgICAgLy8gdGhpcy5Mb2FkVHJ1Y2tzKHRoaXMubWFwLCBudWxsLCBudWxsLCBudWxsLCBmYWxzZSk7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IC8vJCgnI2xvYWRpbmcnKS5oaWRlKCkgXG4gICAgICAgIH0sIDMwMDApO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEubGV2ZWwuaW5kZXhPZihhbWFuYWdlcnMpID4gLTEpIHtcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMgPSBbXTtcbiAgICAgICAgICB2YXIgYXJlYU1nciA9IHtcbiAgICAgICAgICAgIGlkOiB0aGlzLm1hbmFnZXJVc2VySWQsXG4gICAgICAgICAgICBpdGVtTmFtZTogZGF0YS5uYW1lICsgJyAoJyArIHRoaXMubWFuYWdlclVzZXJJZCArICcpJ1xuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5maWVsZE1hbmFnZXJzLnVuc2hpZnQoYXJlYU1ncik7XG4gICAgICAgICAgdGhpcy5nZXRMaXN0b2ZGaWVsZE1hbmFnZXJzKCk7XG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxldmVsLmluZGV4T2YodnApID4gLTEpIHtcbiAgICAgICAgICB0aGlzLklzVlAgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy90aGlzLnRvYXN0ci53YXJuaW5nKCdOb3QgdmFsaWQgRmllbGQvQXJlYSBNYW5hZ2VyIScsICdNYW5hZ2VyJywgeyBzaG93Q2xvc2VCdXR0b246IHRydWUgfSlcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL3RoaXMudG9hc3RyLndhcm5pbmcoJ1BsZWFzZSBlbnRlciB2YWxpZCBGaWVsZC9BcmVhIE1hbmFnZXIgYXR0dWlkIScsICdNYW5hZ2VyJywgeyBzaG93Q2xvc2VCdXR0b246IHRydWUgfSlcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBjb25uZWN0aW5nIHdlYiBwaG9uZSEnLCAnRXJyb3InKVxuICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldExpc3RvZkZpZWxkTWFuYWdlcnMoKSB7XG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckRhdGEodGhpcy5tYW5hZ2VyVXNlcklkKS50aGVuKChkYXRhOiBhbnkpID0+IHtcbiAgICAgIGlmIChkYXRhLlRlY2huaWNpYW5EZXRhaWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yICh2YXIgdGVjaCBpbiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzKSB7XG4gICAgICAgICAgdmFyIG1nciA9IHtcbiAgICAgICAgICAgIGlkOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmF0dHVpZCxcbiAgICAgICAgICAgIGl0ZW1OYW1lOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLm5hbWUgKyAnICgnICsgZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQgKyAnKSdcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMuZmllbGRNYW5hZ2Vycy5wdXNoKG1ncik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLklzVlAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuSXNWUCA9IHRydWU7XG4gICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xuICAgICAgICAvL3RoaXMudG9hc3RyLndhcm5pbmcoJ0RvIG5vdCBoYXZlIGFueSBkaXJlY3QgcmVwb3J0cyEnLCAnTWFuYWdlcicpO1xuICAgICAgfVxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGNvbm5lY3Rpbmcgd2ViIHBob25lIScsICdFcnJvcicpO1xuICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFRlY2hEZXRhaWxzRm9yTWFuYWdlcnMoKSB7XG4gICAgaWYgKHRoaXMubWFuYWdlcklkcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VyRGF0YSh0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICBpZiAoZGF0YS5UZWNobmljaWFuRGV0YWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yICh2YXIgdGVjaCBpbiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzKSB7XG4gICAgICAgICAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnB1c2goZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQpO1xuXG4gICAgICAgICAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLnB1c2goe1xuICAgICAgICAgICAgICBhdHR1aWQ6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkLFxuICAgICAgICAgICAgICBuYW1lOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLm5hbWUsXG4gICAgICAgICAgICAgIGVtYWlsOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmVtYWlsLFxuICAgICAgICAgICAgICBwaG9uZTogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5waG9uZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgICBcbiAgbG9hZE1hcFZpZXcodHlwZTogU3RyaW5nKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMudHJ1Y2tJdGVtcyA9IFtdO1xuICAgIHZhciBsb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbig0MC4wNTgzLCAtNzQuNDA1Nyk7XG5cbiAgICBpZiAodGhpcy5sYXN0TG9jYXRpb24pIHtcbiAgICAgIGxvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRoaXMubGFzdExvY2F0aW9uLmxhdGl0dWRlLCB0aGlzLmxhc3RMb2NhdGlvbi5sb25naXR1ZGUpO1xuICAgIH1cbiAgICB0aGlzLm1hcCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215TWFwJyksIHtcbiAgICAgIGNyZWRlbnRpYWxzOiAnQW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNaicsXG4gICAgICBjZW50ZXI6IGxvY2F0aW9uLFxuICAgICAgbWFwVHlwZUlkOiB0eXBlID09ICdzYXRlbGxpdGUnID8gTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLmFlcmlhbCA6IE1pY3Jvc29mdC5NYXBzLk1hcFR5cGVJZC5yb2FkLFxuICAgICAgem9vbTogMTIsXG4gICAgICBsaXRlTW9kZTogdHJ1ZSxcbiAgICAgIC8vbmF2aWdhdGlvbkJhck9yaWVudGF0aW9uOiBNaWNyb3NvZnQuTWFwcy5OYXZpZ2F0aW9uQmFyT3JpZW50YXRpb24uaG9yaXpvbnRhbCxcbiAgICAgIGVuYWJsZUNsaWNrYWJsZUxvZ286IGZhbHNlLFxuICAgICAgc2hvd0xvZ286IGZhbHNlLFxuICAgICAgc2hvd1Rlcm1zTGluazogZmFsc2UsXG4gICAgICBzaG93TWFwVHlwZVNlbGVjdG9yOiBmYWxzZSxcbiAgICAgIHNob3dUcmFmZmljQnV0dG9uOiB0cnVlLFxuICAgICAgZW5hYmxlU2VhcmNoTG9nbzogZmFsc2UsXG4gICAgICBzaG93Q29weXJpZ2h0OiBmYWxzZVxuICAgIH0pO1xuICAgIFxuICAgIC8vTG9hZCB0aGUgQW5pbWF0aW9uIE1vZHVsZVxuICAgIC8vTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZShcIkFuaW1hdGlvbk1vZHVsZVwiKTtcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdBbmltYXRpb25Nb2R1bGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgfSk7XG5cbiAgICAvL1N0b3JlIHNvbWUgbWV0YWRhdGEgd2l0aCB0aGUgcHVzaHBpblxuICAgIHRoaXMuaW5mb2JveCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5JbmZvYm94KHRoaXMubWFwLmdldENlbnRlcigpLCB7XG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHRoaXMuaW5mb2JveC5zZXRNYXAodGhpcy5tYXApO1xuXG4gICAgLy8gQ3JlYXRlIGEgbGF5ZXIgZm9yIHJlbmRlcmluZyB0aGUgcGF0aC5cbiAgICB0aGlzLnBhdGhMYXllciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5MYXllcigpO1xuICAgIHRoaXMubWFwLmxheWVycy5pbnNlcnQodGhpcy5wYXRoTGF5ZXIpO1xuXG4gICAgLy8gTG9hZCB0aGUgU3BhdGlhbCBNYXRoIG1vZHVsZS5cbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aCcsIGZ1bmN0aW9uICgpIHsgfSk7XG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucycsIGZ1bmN0aW9uICgpIHsgfSk7XG5cbiAgICAvLyBDcmVhdGUgYSBsYXllciB0byBsb2FkIHB1c2hwaW5zIHRvLlxuICAgIHRoaXMuZGF0YUxheWVyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkVudGl0eUNvbGxlY3Rpb24oKTtcblxuICAgIC8vIEFkZCBhIHJpZ2h0IGNsaWNrIGV2ZW50IHRvIHRoZSBtYXBcbiAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLm1hcCwgJ3JpZ2h0Y2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgY29uc3QgeDEgPSBlLmxvY2F0aW9uO1xuICAgICAgdGhhdC5jbGlja2VkTGF0ID0geDEubGF0aXR1ZGU7XG4gICAgICB0aGF0LmNsaWNrZWRMb25nID0geDEubG9uZ2l0dWRlO1xuICAgICAgdGhhdC5yYWRpb3VzVmFsdWUgPSAnJztcbiAgICAgIGpRdWVyeSgnI215UmFkaXVzTW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgIH0pO1xuXG4gICAgLy9sb2FkIHRpY2tldCBkZXRhaWxzXG4gICAgdGhpcy5hZGRUaWNrZXREYXRhKHRoaXMubWFwLCB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyKTtcbiAgICBcbiAgfVxuXG4gIExvYWRUcnVja3MobWFwcywgbHQsIGxnLCByZCwgaXNUcnVja1NlYXJjaCkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHRoaXMudHJ1Y2tJdGVtcyA9IFtdO1xuXG4gICAgaWYgKCFpc1RydWNrU2VhcmNoKSB7XG5cbiAgICAgIHRoaXMubWFwU2VydmljZS5nZXRNYXBQdXNoUGluRGF0YSh0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICBpZiAoIWpRdWVyeS5pc0VtcHR5T2JqZWN0KGRhdGEpICYmIGRhdGEudGVjaERhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhciB0ZWNoRGF0YSA9IGRhdGEudGVjaERhdGE7XG4gICAgICAgICAgdmFyIGRpckRldGFpbHMgPSBbXTtcbiAgICAgICAgICB0ZWNoRGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5sb25nID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBpdGVtLmxvbmcgPSBpdGVtLmxvbmdnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0udGVjaElEICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB2YXIgZGlyRGV0YWlsOiBUcnVja0RpcmVjdGlvbkRldGFpbHMgPSBuZXcgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzKCk7XG4gICAgICAgICAgICAgIGRpckRldGFpbC50ZWNoSWQgPSBpdGVtLnRlY2hJRDtcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxhdCA9IGl0ZW0ubGF0O1xuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTG9uZyA9IGl0ZW0ubG9uZztcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMYXQgPSBpdGVtLndyTGF0O1xuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExvbmcgPSBpdGVtLndyTG9uZztcbiAgICAgICAgICAgICAgZGlyRGV0YWlscy5wdXNoKGRpckRldGFpbCk7XG4gICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmFyIHJvdXRlTWFwVXJscyA9IFtdO1xuICAgICAgICAgIHJvdXRlTWFwVXJscyA9IHRoaXMubWFwU2VydmljZS5HZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlscyk7XG5cbiAgICAgICAgICBmb3JrSm9pbihyb3V0ZU1hcFVybHMpLnN1YnNjcmliZShyZXN1bHRzID0+IHtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPD0gcmVzdWx0cy5sZW5ndGggLSAxOyBqKyspIHtcbiAgICAgICAgICAgICAgbGV0IHJvdXRlRGF0YSA9IHJlc3VsdHNbal0gYXMgYW55O1xuICAgICAgICAgICAgICBsZXQgcm91dGVkYXRhSnNvbiA9IHJvdXRlRGF0YS5qc29uKCk7XG4gICAgICAgICAgICAgIGlmIChyb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zICE9IG51bGxcbiAgICAgICAgICAgICAgICAmJiByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxhdCA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1swXVxuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTG9uZyA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1sxXVxuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTGF0ID0gbmV4dFNvdXJjZUxhdDtcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxvbmcgPSBuZXh0U291cmNlTG9uZztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbGlzdE9mUGlucyA9IG1hcHMuZW50aXRpZXM7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mUGlucy5nZXRMZW5ndGgoKTsgaSsrKSB7XG4gICAgICAgICAgICAgIHZhciB0ZWNoSWQgPSBsaXN0T2ZQaW5zLmdldChpKS5tZXRhZGF0YS5BVFRVSUQ7XG4gICAgICAgICAgICAgIHZhciB0cnVja0NvbG9yID0gbGlzdE9mUGlucy5nZXQoaSkubWV0YWRhdGEudHJ1Y2tDb2wudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgdmFyIGN1clB1c2hQaW4gPSBsaXN0T2ZQaW5zLmdldChpKTtcbiAgICAgICAgICAgICAgdmFyIGN1cnJEaXJEZXRhaWwgPSBbXTtcblxuICAgICAgICAgICAgICBjdXJyRGlyRGV0YWlsID0gZGlyRGV0YWlscy5maWx0ZXIoZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQudGVjaElkID09PSB0ZWNoSWQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgdmFyIG5leHRMb2NhdGlvbjtcblxuICAgICAgICAgICAgICBpZiAoY3VyckRpckRldGFpbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbmV4dExvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTGF0LCBjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxvbmcpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKG5leHRMb2NhdGlvbiAhPSBudWxsICYmIG5leHRMb2NhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGluTG9jYXRpb24gPSBsaXN0T2ZQaW5zLmdldChpKS5nZXRMb2NhdGlvbigpO1xuICAgICAgICAgICAgICAgIHZhciBuZXh0Q29vcmQgPSB0aGF0LkNhbGN1bGF0ZU5leHRDb29yZChwaW5Mb2NhdGlvbiwgbmV4dExvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhwaW5Mb2NhdGlvbiwgbmV4dENvb3JkKTtcbiAgICAgICAgICAgICAgICB2YXIgdHJ1Y2tVcmwgPSB0aGlzLmdldFRydWNrVXJsKHRydWNrQ29sb3IpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihjdXJQdXNoUGluLCB0cnVja1VybCwgYmVhcmluZywgZnVuY3Rpb24gKCkgeyB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMubWFwU2VydmljZS5nZXRUcnVja0ZlZWQodGhpcy5yZXBvcnRpbmdUZWNobmljaWFucywgdGhpcy5tYW5hZ2VySWRzKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnNvbWUoeCA9PiB4LnRvTG93ZXJDYXNlKCkgPT0gZGF0YS50ZWNoSUQudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBkYXRhKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIGZldGNoaW5nIHRydWNrcyBmcm9tIEthZmthIENvbnN1bWVyLiBFcnJvcnMtPiAnICsgZXJyLkVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignTm8gdHJ1Y2sgZm91bmQhJywgJ01hbmFnZXInKTtcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgZmV0Y2hpbmcgZGF0YSBmcm9tIEFQSSEnLCAnRXJyb3InKTtcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG5cbiAgICAgIGNvbnN0IG10cnMgPSBNYXRoLnJvdW5kKHRoYXQuZ2V0TWV0ZXJzKHJkKSk7XG4gICAgICB0aGlzLm1hcFNlcnZpY2UuZmluZFRydWNrTmVhckJ5KGx0LCBsZywgbXRycywgdGhpcy5tYW5hZ2VySWRzKS50aGVuKChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSAmJiBkYXRhLnRlY2hEYXRhLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgIGNvbnN0IHRlY2hEYXRhID0gZGF0YS50ZWNoRGF0YTtcbiAgICAgICAgICBsZXQgZGlyRGV0YWlscyA9IFtdO1xuICAgICAgICAgIHRlY2hEYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmxvbmcgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGl0ZW0ubG9uZyA9IGl0ZW0ubG9uZ2c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKGl0ZW0udGVjaElEICE9IHVuZGVmaW5lZCkgJiYgKGRpckRldGFpbHMuc29tZSh4ID0+IHgudGVjaElkID09IGl0ZW0udGVjaElEKSA9PSBmYWxzZSkpIHtcbiAgICAgICAgICAgICAgdmFyIGRpckRldGFpbDogVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzID0gbmV3IFRydWNrRGlyZWN0aW9uRGV0YWlscygpO1xuICAgICAgICAgICAgICBkaXJEZXRhaWwudGVjaElkID0gaXRlbS50ZWNoSUQ7XG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMYXQgPSBpdGVtLmxhdDtcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxvbmcgPSBpdGVtLmxvbmc7XG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TGF0ID0gaXRlbS53ckxhdDtcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMb25nID0gaXRlbS53ckxvbmc7XG4gICAgICAgICAgICAgIGRpckRldGFpbHMucHVzaChkaXJEZXRhaWwpO1xuICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBpdGVtKTtcbiAgICAgICAgICAgICAgdGhhdC5mb3VuZFRydWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciByb3V0ZU1hcFVybHMgPSBbXTtcbiAgICAgICAgICByb3V0ZU1hcFVybHMgPSB0aGlzLm1hcFNlcnZpY2UuR2V0Um91dGVNYXBEYXRhKGRpckRldGFpbHMpO1xuXG4gICAgICAgICAgZm9ya0pvaW4ocm91dGVNYXBVcmxzKS5zdWJzY3JpYmUocmVzdWx0cyA9PiB7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IHJlc3VsdHMubGVuZ3RoIC0gMTsgaisrKSB7XG4gICAgICAgICAgICAgIGxldCByb3V0ZURhdGEgPSByZXN1bHRzW2pdIGFzIGFueTtcbiAgICAgICAgICAgICAgbGV0IHJvdXRlZGF0YUpzb24gPSByb3V0ZURhdGEuanNvbigpO1xuICAgICAgICAgICAgICBpZiAocm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcyAhPSBudWxsXG4gICAgICAgICAgICAgICAgJiYgcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMYXQgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMF1cbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxvbmcgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMV1cbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxhdCA9IG5leHRTb3VyY2VMYXQ7XG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMb25nID0gbmV4dFNvdXJjZUxvbmc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGxpc3RPZlBpbnMgPSB0aGF0Lm1hcC5lbnRpdGllcztcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0T2ZQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgcHVzaHBpbiA9IGxpc3RPZlBpbnMuZ2V0KGkpO1xuICAgICAgICAgICAgICBpZiAocHVzaHBpbiBpbnN0YW5jZW9mIE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4pIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRlY2hJZCA9IHB1c2hwaW4ubWV0YWRhdGEuQVRUVUlEO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRydWNrQ29sb3IgPSBwdXNocGluLm1ldGFkYXRhLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJEaXJEZXRhaWwgPSBbXTtcblxuICAgICAgICAgICAgICAgIGN1cnJEaXJEZXRhaWwgPSBkaXJEZXRhaWxzLmZpbHRlcihlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRlY2hJZCA9PT0gdGVjaElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIG5leHRMb2NhdGlvbjtcblxuICAgICAgICAgICAgICAgIGlmIChjdXJyRGlyRGV0YWlsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgIG5leHRMb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxhdCwgY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMb25nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobmV4dExvY2F0aW9uICE9IG51bGwgJiYgbmV4dExvY2F0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgdmFyIHBpbkxvY2F0aW9uID0gbGlzdE9mUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgIHZhciBuZXh0Q29vcmQgPSB0aGF0LkNhbGN1bGF0ZU5leHRDb29yZChwaW5Mb2NhdGlvbiwgbmV4dExvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICAgIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHBpbkxvY2F0aW9uLCBuZXh0Q29vcmQpO1xuICAgICAgICAgICAgICAgICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwdXNocGluLCB0cnVja1VybCwgYmVhcmluZywgZnVuY3Rpb24gKCkgeyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTG9hZCB0aGUgc3BhdGlhbCBtYXRoIG1vZHVsZVxuICAgICAgICAgICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGgnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIFJlcXVlc3QgdGhlIHVzZXIncyBsb2NhdGlvblxuXG4gICAgICAgICAgICAgIGNvbnN0IGxvYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0aGF0LmNsaWNrZWRMYXQsIHRoYXQuY2xpY2tlZExvbmcpO1xuICAgICAgICAgICAgICAvLyBDcmVhdGUgYW4gYWNjdXJhY3kgY2lyY2xlXG4gICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aC5nZXRSZWd1bGFyUG9seWdvbihsb2MsXG4gICAgICAgICAgICAgICAgcmQsXG4gICAgICAgICAgICAgICAgMzYsXG4gICAgICAgICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGguRGlzdGFuY2VVbml0cy5NaWxlcyk7XG5cbiAgICAgICAgICAgICAgY29uc3QgcG9seSA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2x5Z29uKHBhdGgpO1xuICAgICAgICAgICAgICB0aGF0Lm1hcC5lbnRpdGllcy5wdXNoKHBvbHkpO1xuICAgICAgICAgICAgICAvLyBBZGQgYSBwdXNocGluIGF0IHRoZSB1c2VyJ3MgbG9jYXRpb24uXG4gICAgICAgICAgICAgIGNvbnN0IHBpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKGxvYyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBpY29uOiAnaHR0cHM6Ly9iaW5nbWFwc2lzZGsuYmxvYi5jb3JlLndpbmRvd3MubmV0L2lzZGtzYW1wbGVzL2RlZmF1bHRQdXNocGluLnBuZycsXG4gICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgxMiwgMzkpLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHJkICsgJyBtaWxlKHMpIG9mIHJhZGl1cycsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgdmFyIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgICAgIExhdGl0dWRlOiBsdCxcbiAgICAgICAgICAgICAgICBMb25naXR1ZGU6IGxnLFxuICAgICAgICAgICAgICAgIHJhZGl1czogcmRcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihwaW4sICdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhhdC5yYWRpb3VzVmFsdWUgPSByZDtcbiAgICAgICAgICAgICAgICB0aGF0LmNsaWNrZWRMYXQgPSBsdDtcbiAgICAgICAgICAgICAgICB0aGF0LmNsaWNrZWRMb25nID0gbGc7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcjbXlSYWRpdXNNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIHBpbi5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgICAgICB0aGF0Lm1hcC5lbnRpdGllcy5wdXNoKHBpbik7XG4gICAgICAgICAgICAgIHRoYXQuZGF0YUxheWVyLnB1c2gocGluKTtcblxuICAgICAgICAgICAgICAvLyBDZW50ZXIgdGhlIG1hcCBvbiB0aGUgdXNlcidzIGxvY2F0aW9uLlxuICAgICAgICAgICAgICB0aGF0Lm1hcC5zZXRWaWV3KHsgY2VudGVyOiBsb2MsIHpvb206IDggfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBsZXQgZmVlZE1hbmFnZXIgPSBbXTtcblxuICAgICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMubWFwU2VydmljZS5nZXRUcnVja0ZlZWQodGhpcy5yZXBvcnRpbmdUZWNobmljaWFucywgdGhpcy5tYW5hZ2VySWRzKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChkaXJEZXRhaWxzLnNvbWUoeCA9PiB4LnRlY2hJZC50b0xvY2FsZUxvd2VyQ2FzZSgpID09IGRhdGEudGVjaElELnRvTG9jYWxlTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgZGF0YSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBmZXRjaGluZyB0cnVja3MgZnJvbSBLYWZrYSBDb25zdW1lci4gRXJyb3JzLT4gJyArIGVyci5FcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ05vIHRydWNrIGZvdW5kIScsICdNYW5hZ2VyJyk7XG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGZldGNoaW5nIGRhdGEgZnJvbSBBUEkhJywgJ0Vycm9yJyk7XG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIGdldFRydWNrVXJsKGNvbG9yKSB7XG4gICAgbGV0IHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFIa21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1JtTTJWaU1XUXROR0psWkMxak5qUTBMVGd6WW1VdFlqUTVZalpsTkRsbVltUm1JaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpHRXhOVEJsWVRFdE1qSmhZeTAzT1RRNUxUaGlObUV0WldVMU1UYzRaVEJtTVdGa0lpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09tWXdaV1F4WldNM0xUTTFPVEF0WkdFMFlpMDVNV0l3TFRZd09UUTJaakZoTldRNVl6d3ZjbVJtT214cFBpQThjbVJtT214cFBuaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMlBDOXlaR1k2YkdrK0lEd3ZjbVJtT2tKaFp6NGdQQzl3YUc5MGIzTm9iM0E2Ukc5amRXMWxiblJCYm1ObGMzUnZjbk0rSUR4NGJYQk5UVHBJYVhOMGIzSjVQaUE4Y21SbU9sTmxjVDRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUltTnlaV0YwWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEUwVkRFNU9qQTRPakF6TFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpOCtJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKellYWmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG8xWkRRMk1EYzFaaTA0TW1SbUxXWTNOREF0WW1VM1pTMW1OMkkwTXpsbVlqY3lNekVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UVlVNVGs2TWpNNk16RXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpSUhOMFJYWjBPbU5vWVc1blpXUTlJaThpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09tRmtaak5sWWpGa0xUUmlaV1F0WXpZME5DMDRNMkpsTFdJME9XSTJaVFE1Wm1Ka1ppSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4T1ZReE5UbzBPVG93TVMwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4TDNKa1pqcFRaWEUrSUR3dmVHMXdUVTA2U0dsemRHOXllVDRnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrSUR3dmNtUm1PbEpFUmo0Z1BDOTRPbmh0Y0cxbGRHRStJRHcvZUhCaFkydGxkQ0JsYm1ROUluSWlQejRkYjd2akFBQUNlMGxFUVZSSXg5MldUV3RUUVJTR256TnpiM0xUdEtHMVdsSHdxNHVDYllYK0ExMjVFTGN1dWloQ1JYQ3AySDNCaFN2L2dVdkJnbEp3NFVMQmlncFNhVUZjaUZMRmpTQXRzWDYxU2RNMHZYTmM5Tm9rUlpPWUFSWG5NcXU1ekRQbm5QZThNNEdxOHFkSHdGOFkveDcwNnJPSm5wVEl0YWRmN28rK0x5K1ZyWmhrUlpMNVl6akV4T24xRjVtcHNVUG5ia3lNVFQ1cUd6cFhtUmxaTHViSFA3S0U3VXBuMks2LzFERlZ3V1NobUZzZGYvaDJabnlDU1drL3ZmZTZlNzROdlNhekowZnNLdlZyZGZvVHpLYXdYaW95Ti8rODVGZlRKN3VuM0tjY3dka2lGQnNkWG9sVElIbUR6SGI1MWJUbmNBNFhPR0lSTkZTa1FYZFpvNmcxWkxvajZ3V05CbVEwN05WcDhpbnNoaUFOZ3RYVk1tRlh5SUdoL2FlOG9BK0MyL25BV0FwM2hPQkQ5TXUvTlFhNkhkbmpaWWJQOUo4R1p0cUdIaHpjMjFGSXJSSHMyeUFveHcxUEwxbEZnMDBHMGtjdUFwZmFoaTYvTE56cTdPdmw1UG1qbEl0cmFDSlpRUkN0NWxwRnlVUnA1bTh1TVAxNXFuVDV4SlgyMDF1dWJLU3picXM3SkhZMVlTblVRQkZGalFFTVg5ZFdQRzFRUWxVVVI0eXFyZnFCMXJlcEtEaGluQ2hJNkFmVlJLNlNmUFYyOEhPdnNCZy9xQk5GaEdTYnhsZWdrNlFNenZlV1VXb01RWnJ2Sm15THJXMm9RWkFZekcvYzg5NVFFV2twd0MweG1lVENjNTdwUlZ0bFl0UWdDdFlYS2lLMC9vUnlpRkhFZUFvcGRxN0c1TFZwTmF2VEoxTFZtcHBLTStIaVd0TjRZMmhhTElvbUtkWW1Ra3I2MmhlcUFzWUsxZ2hoRk80QVMxM2FBd3RpRFd4NlFvdTJaREtsSEl0dlZxbFUxbEhWcWlGcW5TTVFoU0d1Wk5DTzVsSnFDQjNjZFd4bDRkMnJ6dG5yaXhocmNBbDBaenBVaFZnZFVkVEpjUDlJd1F0Njk4TGp2di9taGY4ZHRHSGxoNHY1UjFJQUFBQUFTVVZPUks1Q1lJST0nO1xuXG4gICAgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ2dyZWVuJykge1xuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUhrbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUm1NMlZpTVdRdE5HSmxaQzFqTmpRMExUZ3pZbVV0WWpRNVlqWmxORGxtWW1SbUlpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdFeE5UQmxZVEV0TWpKaFl5MDNPVFE1TFRoaU5tRXRaV1UxTVRjNFpUQm1NV0ZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T21Zd1pXUXhaV00zTFRNMU9UQXRaR0UwWWkwNU1XSXdMVFl3T1RRMlpqRmhOV1E1WXp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkyUEM5eVpHWTZiR2srSUR3dmNtUm1Pa0poWno0Z1BDOXdhRzkwYjNOb2IzQTZSRzlqZFcxbGJuUkJibU5sYzNSdmNuTStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTBWREU1T2pBNE9qQXpMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzFaRFEyTURjMVppMDRNbVJtTFdZM05EQXRZbVUzWlMxbU4ySTBNemxtWWpjeU16RWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRWVU1UazZNak02TXpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21Ga1pqTmxZakZrTFRSaVpXUXRZelkwTkMwNE0ySmxMV0kwT1dJMlpUUTVabUprWmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhPVlF4TlRvME9Ub3dNUzB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NGRiN3ZqQUFBQ2UwbEVRVlJJeDkyV1RXdFRRUlNHbnpOemIzTFR0S0cxV2xId3E0dUNiWVgrQTEyNUVMY3V1aWhDUlhDcDJIM0JoU3YvZ1V2QmdsSnc0VUxCaWdwU2FVRmNpRkxGalNBdHNYNjFTZE0wdlhOYzlOb2tSWk9ZQVJYbk1xdTV6RFBublBlOE00R3E4cWRId0Y4WS94NzA2ck9KbnBUSXRhZGY3bysrTHkrVnJaaGtSWkw1WXpqRXhPbjFGNW1wc1VQbmJreU1UVDVxR3pwWG1SbFpMdWJIUDdLRTdVcG4ySzYvMURGVndXU2htRnNkZi9oMlpueUNTV2svdmZlNmU3NE52U2F6SjBmc0t2VnJkZm9Uekthd1hpb3lOLys4NUZmVEo3dW4zS2Njd2RraUZCc2RYb2xUSUhtRHpIYjUxYlRuY0E0WE9HSVJORlNrUVhkWm82ZzFaTG9qNndXTkJtUTA3TlZwOGluc2hpQU5ndFhWTW1GWHlJR2gvYWU4b0ErQzIvbkFXQXAzaE9CRDlNdS9OUWE2SGRualpZYlA5SjhHWnRxR0hoemMyMUZJclJIczJ5QW94dzFQTDFsRmcwMEcwa2N1QXBmYWhpNi9MTnpxN092bDVQbWpsSXRyYUNKWlFSQ3Q1bHBGeVVScDVtOHVNUDE1cW5UNXhKWDIwMXV1YktTemJxczdKSFkxWVNuVVFCRkZqUUVNWDlkV1BHMVFRbFVVUjR5cXJmcUIxcmVwS0RoaW5DaEk2QWZWUks2U2ZQVjI4SE92c0JnL3FCTkZoR1NieGxlZ2s2UU16dmVXVVdvTVFacnZKbXlMclcyb1FaQVl6Ry9jODk1UUVXa3B3QzB4bWVUQ2M1N3BSVnRsWXRRZ0N0WVhLaUswL29SeWlGSEVlQW9wZHE3RzVMVnBOYXZUSjFMVm1wcEtNK0hpV3RONFkyaGFMSW9tS2RZbVFrcjYyaGVxQXNZSzFnaGhGTzRBUzEzYUF3dGlEV3g2UW91MlpES2xISXR2VnFsVTFsSFZxaUZxblNNUWhTR3VaTkNPNWxKcUNCM2NkV3hsNGQycnp0bnJpeGhyY0FsMFp6cFVoVmdkVWRUSmNQOUl3UXQ2OThManZ2L21oZjhkdEdIbGg0djVSMUlBQUFBQVNVVk9SSzVDWUlJPSc7XG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICdyZWQnKSB7XG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSDNtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRJNk1qRXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRJNk1qRXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TURWak16YzFaRFl0TVdObE9DMWtaalJsTFRnd1lqZ3RNamxtWVRSaFpqQTJaREUzSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaR1JtTUdJelltRXRNV05pWkMxaE1qUTBMV0V5WldNdE1UZzRZVGxrT0dSbE1qazBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPakF3TURKbE5EaGxMVGhtT1dVdE5qVTBZeTA1WWpRMkxUVm1ZV1prTVRCaE4yRTJOend2Y21SbU9teHBQaUE4Y21SbU9teHBQbUZrYjJKbE9tUnZZMmxrT25Cb2IzUnZjMmh2Y0RwbU1HVmtNV1ZqTnkwek5Ua3dMV1JoTkdJdE9URmlNQzAyTURrME5tWXhZVFZrT1dNOEwzSmtaanBzYVQ0Z1BISmtaanBzYVQ1NGJYQXVaR2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmp3dmNtUm1PbXhwUGlBOEwzSmtaanBDWVdjK0lEd3ZjR2h2ZEc5emFHOXdPa1J2WTNWdFpXNTBRVzVqWlhOMGIzSnpQaUE4ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQSEprWmpwVFpYRStJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKamNtVmhkR1ZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZOV1EwTmpBM05XWXRPREprWmkxbU56UXdMV0psTjJVdFpqZGlORE01Wm1JM01qTXhJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMVZERTVPakl6T2pNeExUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvd05XTXpOelZrTmkweFkyVTRMV1JtTkdVdE9EQmlPQzB5T1daaE5HRm1NRFprTVRjaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCs3U2RBd0FBQUFzcEpSRUZVU01mbGw3dHJGRkVZeFgvZm5abGROd21KR2tLSUNENGlJV0tsSW9xclZqNDZRVkJzZllENEgyaGhiWkFVMm9pSW5WcUlXR2hsSTZnZ0JsRjhCTjhoS29oRW9oSTFiamI3dVBlejJOSGRUZHpaWlNkbzRRemZiZVlPNTU3dm5IdnVqS2dxZi9zeS9JUExqM3I0OU00OWhzZHVKVm9HTDY3b0hDZGhBK05temhHVWJDRW5EN2N1bjlqVHVmckQyTEpldStYd3dlWkJiNTQ4c1hqRFpPNzBzbHh5WGI3RHBVUW9hNkZsV09jOFdmOW9ZblNzOSswRitsYWVBNmFhQnYxMGUyak5GNXZkdWE1L0pkYk9JRmxoQlRXSzFmemE5dWZEaXdyYmRud0JMamF0NlJ2RDRJK1dkbkNHZ3RQcTBuTFpJa0NDSjByUGxZY1B6c2N5MHQxUEgvdSsrVWJyMmswc1NUeWVHY1BBMWN1NVdLQ1pydTR6ODdIVG9NeFRhbFpTQmFSSWQ2RGoyOUtianNaeTc3Nyt2bFAyNVl0RE53SWZEWUlxSWFYQ1NFWU1NTTJTbkxHNzNvMWZpd1c2dTZkNzcvd0g5NHZYWHc1N1daRUtJSkFLUDNuT3A4UGxTVTk4NzFwMTVtd2lGdWp6a2RIOS9SMmR5UzJaSDNnSm56K2xsd0FPaC9vcEpsdVV6eU92RG5SQlpJc2xLZ2FQdGJYbXQyY0x3ZExOYWV6Q0JlRGNyQzFUWW13aG1VSmVqM0RweVdPT3FFclRUQ1dUTGJaNnlhRE5HSnhVQ1ZuRlZNVmc4RkR4U0VBMlZuc3hCc1ZndzZKR1Y0eDFxSEdJay9qWjZ3QW5KWUtpMVNsVUZVNENpSUNVM29uSEZGQlZTbmZac2JOQkZSVkZhT3lZakF3SFQ4RlpDMW9iTU55cGdHQ2RhK2lzOU91dlNGQTBIRFZLaUhEZVhMVDNONUJFTk5nQWpabW9JVkFKaDErNjFXSmE4dEljdU5jVHJVUkZOSUtwQ0lqTWphWUZWU3dPRThIVWQ0cFR4VGI0a1ZlM3ZRZ0lJY3VvZEZOcFdOWG9HSlF3RDR3Qno5Uk1CNmNPTVZKYVhGelFoQXF0bnVCbE01aEpIN1VXQ2RzK3k5TUpoeWtXQ0Jvd1V5Um96bG52dmJPTURnMVZnWmh3WjhvTTdnSHdHYnhZb09tQjQxOU5NZCtHeXhVVTU3UWlDaXBQdUZJSkJ0OXNERkpUZFczeTMveFcvQVJOcGp2eGw4MHVMQUFBQUFCSlJVNUVya0pnZ2c9PSc7XG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICd5ZWxsb3cnKSB7XG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSUttbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRnNk5UVXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRnNk5UVXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdRNE1qRmtaak10Wm1GbE5DMHhNalF6TFRsalpUVXRabUZrTjJFMk1UZG1OVFUzSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaalV3TjJJeFltTXROREJrWlMwd1pEUXlMV0l3WlRjdE1HVTROak5tTnpWa05qQTBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPakF3TURKbE5EaGxMVGhtT1dVdE5qVTBZeTA1WWpRMkxUVm1ZV1prTVRCaE4yRTJOend2Y21SbU9teHBQaUE4Y21SbU9teHBQbUZrYjJKbE9tUnZZMmxrT25Cb2IzUnZjMmh2Y0RvNE16Y3hZMlUyWVMweFlXWmtMVEUwTkRNdE9UZ3haQzFrTjJFNE5HWTFObVUwWldVOEwzSmtaanBzYVQ0Z1BISmtaanBzYVQ1aFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaakJsWkRGbFl6Y3RNelU1TUMxa1lUUmlMVGt4WWpBdE5qQTVORFptTVdFMVpEbGpQQzl5WkdZNmJHaytJRHh5WkdZNmJHaytlRzF3TG1ScFpEbzRPR1F6TlRaaE55MDNNVGd4TFdVMU5HRXRPVGxtWlMwME9EQmxNelZoWXpZMlpqWThMM0prWmpwc2FUNGdQQzl5WkdZNlFtRm5QaUE4TDNCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzRPR1F6TlRaaE55MDNNVGd4TFdVMU5HRXRPVGxtWlMwME9EQmxNelZoWXpZMlpqWWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRSVU1UazZNRGc2TURNdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pWa05EWXdOelZtTFRneVpHWXRaamMwTUMxaVpUZGxMV1kzWWpRek9XWmlOekl6TVNJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhOVlF4T1RveU16b3pNUzB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1E0TWpGa1pqTXRabUZsTkMweE1qUXpMVGxqWlRVdFptRmtOMkUyTVRkbU5UVTNJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFNVZERTFPalU0T2pVMUxUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUG5ld1k2VUFBQUpFU1VSQlZFakgzVll4YXhSUkVQNis5L2F5dWRVSWtTTm5DQW9SbFlpSVdnbUNoUkRzUlV0YkMzK0Fsc0hXd2xZYmkxaHBZeEVFbTFpcE1SQlJFVVE4Z28yU0hDa2kzbDI0M043dXpWZ2tKbmZIdWJ1NUZ4Snc0TEhGenM0MzgzM3pab2VxaXIwMmczMndmUUgxa2w1V1ZuK1Z2M3k0Rnh3Nzhrd09EUjJFeUlZVTJpUDE5VkR3YytXaUdUOTF2MTRjSFI5Tmlzc2tUYWNmWEd0Y25YenJGMForSXd6WjlsVTN0Q0RJZTVoOTFjU2FYQXB2M0p3YjdKdmVUNTgveXRKeURhb1diRDlpUWZHMkR0U0RVaERGRnFWdkpYSFNkSHBHTUw5QStFRnlFQVZoU1VUeEFCNC95YnRwMmxCQnN3WEFFdFpxTzdkZG1TdG9GYlJBTFFyZFFHZG5IcUpWdlkxcXRRTEdCdjlTbjFEVVFvVnFBMU4zYjZXQ01tMDR2SDZSMTdtRllRZ0RXTHROYUVlbGFtQU5jTzVNR1pQWDErZ0UrdlRSVVcyMmhsQTQvQU54Uk5EMnZEQ2dLT3dBTUhGQzhmemwyUHFkcWNXZ2IzcFBuNnhodFQ2T2tXSVJLZ3JWbnBLQ0NuZys4V1orQldPRmlwdW1VV3dRUnpIT25qOE9TTXFNemcrZ3ZOUkM0Y0N5RytnV2src1I0cFlrdXVVSXhGR01NRFNPb0d4N01zV1B1elI3dDZ0TmlhbzlFdTBYVkR2bXJLWXpvcnRVcVRKanBadWRyYTZnWkhmVWhFTDFiNEt1OUhMbm5jSU1ib245YlZSQkVEdlpvOVFWRkpxdFB0MGNTd1JoTWlUb3BYRkZBcHFsZTlsam9laXZlNlZOby9UdUpiT0ptZ2hxUWZpK0IyVFVkQU5QSEsrTVd2MisyT1RsS3g2TW1FUkdNSmlENzN1d29IRUNIUzc2SzhWNklYai9MaElWZHZ6S3VpM25BNld2RFhOaHd0YWRONGYvWnNQL0F3enQ1UjNic1EyakFBQUFBRWxGVGtTdVFtQ0MnO1xuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAncHVycGxlJykge1xuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUgzbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllqVm1ZbVUzWWpZdFpHUTFPQzFqTnpSaUxUaG1aR1l0WWpKa05qVTFOVFkzT1RFMElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpBeE5tWm1OamN0WVdZeFpDMDJNVFE1TFRnek1qUXRaRE0wT0dZMU56ZzBaVGswSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEcG1NR1ZrTVdWak55MHpOVGt3TFdSaE5HSXRPVEZpTUMwMk1EazBObVl4WVRWa09XTThMM0prWmpwc2FUNGdQSEprWmpwc2FUNTRiWEF1Wkdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5qd3ZjbVJtT214cFBpQThMM0prWmpwQ1lXYytJRHd2Y0dodmRHOXphRzl3T2tSdlkzVnRaVzUwUVc1alpYTjBiM0p6UGlBOGVHMXdUVTA2U0dsemRHOXllVDRnUEhKa1pqcFRaWEUrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSmpjbVZoZEdWa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5pSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TldRME5qQTNOV1l0T0RKa1ppMW1OelF3TFdKbE4yVXRaamRpTkRNNVptSTNNak14SWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTFWREU1T2pJek9qTXhMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGlOV1ppWlRkaU5pMWtaRFU0TFdNM05HSXRPR1prWmkxaU1tUTJOVFUxTmpjNU1UUWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TURKVU1USTZNakE2TXpNdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEM5eVpHWTZVMlZ4UGlBOEwzaHRjRTFOT2tocGMzUnZjbmsrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrMzQxM2p3QUFBdXBKUkVGVVNNZmxsODl2VkZVVXh6L24zdnVtMDRMbFY4RHdhMUdSTm9TNHdLWVE0MHB3UlFnN293bHVjQ0ViTnF6d0QyQ0hDemZLUWxlV3hCQldKcEM0UXpZRVE4TENLS0xTQUZXVVNKQlN5MHc3Nzk1elhMd3BuYVl6MHpxdjBZVm5jaWVabkp2M3ZlZjcvWjV6MzRpWjhXK0g0eitJMEMxNWNmd1NEMjllcWVRWFhubTVOcjJwSWxuU3BhY1dHckV1ei9aZWVUSzY2OWlEcWFIZjBva3o3L1FPZXVPem16dUdwdDc4ZUdzYUd0TzFqWDRuOGx3TGE4SXJvRUdsT2prNk1aTTlHR2ZZUGdWcVBZTk9Ybi82NnZyRzA2TjdkbTRnMTdRb1p5M0NaQUxFTkJwdnJkOG1iOHc4QnM3M3JPbWp5djJ6cy8wMW9nbFI0NktWYkdIVlU2SVJZQ0o4di9YcWoxOTlYc3BJMzgxOE0xd1AwOWJDYXR1b0FJNCs3bGR1Yy83clQrWktnY2FOOVhNdjZMcFpBVEtyZGx5ZVBqS0JGOVBtUDE3Yjkvb0hwZHg3ZU1kYkg2VmI2ZjF2QjY2aVlraExUcXo0WllBaVZLT3dxYll6N2YzNTZKZWxRQThPSG5rN2oydmlEejlkODFIbVdBeTdFTGwzRE9hRGJHZjM1aU9uRDFaS2dkNzVaZUw0bGpEUzkxSWNvMko5R05wbWw0QXFpUENYVFRNNWVmYzlHTzFLc1hRYmcrL0txY1lJWTluSThBaXlJUys0bkcrWkpyMkM0QldzMzhqdkJDNC8vSUp4KzFCNnJuU1d1Wmd4a1BYTEdweEZSS1ZObllLSm9TcUllUUpadlJTOWdrTXhvaVNjSktURCtVMGRtaUNaS3o5N0ZTMTBOQ25vN0tDRWlJRUFvbWhiM1h1NlpReWpzL2JPREhFR3JPeWFYQVpVaU9TWUZkcDFaTVFWdWFRSnQ0STZYUGVrdzVwMWRyT2oxK0pJeGJpVTFhRFhXcjdiUjNMR1Azbi9DTXR0RUFRUjhBTFdZZkE3Qld2dUt3MmFFZkJOTXBJdHpOc2xsUW9Gb0hUWGZvVjlXaGdKdEd1bG9nRzFoSnF1RHIyK3NBakpyR09sVUl6ZlZkSFVOYWtTWjdnQUZqdDVMZUc5ekR1Z0xHaEdsUUdrN3BFZ2tPWWY2MXI4TElnSldvR3NZUVN5Y3FBTlp2MGpmdVgzZTNlZlR5UnBmdG8xaVNjd3paKytGT2loa3dlbWZNT3ZEWFBrVGszbmdWUjBTUytyR0NtSUc2N3VyeTNiaHYrYnZ4Vi9BOHNWUUFnOCtnRFlBQUFBQUVsRlRrU3VRbUNDJztcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1Y2tVcmw7XG4gIH1cblxuICBjb252ZXJ0TWlsZXNUb0ZlZXQobWlsZXMpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtaWxlcyAqIDUyODApO1xuICB9XG5cbiAgcHVzaE5ld1RydWNrKG1hcHMsIHRydWNrSXRlbSkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHZhciBjdXJyZW50T2JqZWN0ID0gdGhpcztcbiAgICB2YXIgcGluTG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odHJ1Y2tJdGVtLmxhdCwgdHJ1Y2tJdGVtLmxvbmcpO1xuICAgIHZhciBkZXN0TG9jID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRydWNrSXRlbS53ckxhdCwgdHJ1Y2tJdGVtLndyTG9uZyk7XG4gICAgdmFyIGljb25Vcmw7XG4gICAgdmFyIGluZm9Cb3hUcnVja1VybDtcbiAgICB2YXIgTmV3UGluO1xuICAgIHZhciBqb2JJZFVybCA9ICcnO1xuXG4gICAgdmFyIHRydWNrQ29sb3IgPSB0cnVja0l0ZW0udHJ1Y2tDb2wudG9Mb3dlckNhc2UoKTtcbiAgICBpY29uVXJsID0gdGhpcy5nZXRJY29uVXJsKHRydWNrQ29sb3IsIHRydWNrSXRlbS5sYXQsIHRydWNrSXRlbS5sb25nLCB0cnVja0l0ZW0ud3JMYXQsIHRydWNrSXRlbS53ckxvbmcpO1xuXG4gICAgaWYgKHRydWNrQ29sb3IgPT0gJ2dyZWVuJykge1xuICAgICAgaW5mb0JveFRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRWdBQUFBckNBWUFBQURiamM2ekFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFGR21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TlMwd01WUXhOam94TVRveE1DMHdORG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNakF0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1qQXRNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1Rka1pqRTBZbVF0TkRCaE9DMDFORFJqTFRrek9UQXRNMlJpTm1aa1lUWm1NbUpsSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZNR0ZrTTJJeVpESXRPREJoTmkweE1EUmtMVGhpTnpRdFpqVmhaREZtTVRobFl6RXlJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPVGRrWmpFMFltUXROREJoT0MwMU5EUmpMVGt6T1RBdE0yUmlObVprWVRabU1tSmxJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNU4yUm1NVFJpWkMwME1HRTRMVFUwTkdNdE9UTTVNQzB6WkdJMlptUmhObVl5WW1VaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1EVXRNREZVTVRZNk1URTZNVEF0TURRNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCtPZHVLM1FBQUF3OUpSRUZVYU43dG1qMVBHMEVRaHU4bnVLZWhESjBybE5KU0pHcEhwQ1d5bERZRjZhQUJWNlFpUVFLbFNSUk1GU1VGcHFOQm1Bb0VCYVFncERUaVE1UUdtcFNiZTlGdE5CbjJ6bnQzTzhkOWVLU1JiVGp0dnZmYzdzemM3bnFla0NtbDJxcllkdUo3VFFwT1EvZHkvK2RlZlRuWVVNdTl0ZHc3ZEVJdnNhNFVvQzNkdzlTbmwycHM0VmxoSEhxcEpRVlE5LzJqN3ozZkIyRmo5TmZONzBMQjBYN1FQMG9HS0FEVHM1M0U2S2d5Z1B4ckZ6a0F6RmMwUmgyanBuS0EvT3ZXK2NoNDgrMnRzZkZYNjYrckJZakRXZHgrSDlsNHBRQnhPTys2ODBNYnJ3eWdKSEFxQXlncG5Fb0FTZ09uOUlEU3dpazFJUC83U2xvNHBRWGtmelpkd0Nrem9MNExPS1VFUkVmUGo1TnU2c2JMQ0tpamZ6ei84R0lFeUFBSUsyZnFjbkR0cFBFeUFuSjZNeU5BUXh6VGxKcUxhWnVsVHl4TnFqdXk3T3BKUEcyNkpuUXh1Rkt6bTNOcSt1dE03aDA2b2ZlL0pWY0pRSFNhRmR4bVBhbDRnWHFLN1JBVXpiWjBrU2dXVURHZnNjQ0crb292emViUm1iWEZBUlhOUjRDeUJJVHBveU0vUHZPMFFZalNnbXF6TFRXY0FFSm4zNDgzalZFTktYSjVkL1hKd0dDbjVaU1VHTlQyKzRjUDJWVVVFRExUblVWbWdraU1zQ3poaEQwMGJwLzNOMlFBNGVud2JXVmtLRHdWT04vNHp4SVNoNE43MGRxZ0cxbVVhc1AxVGdIeDhqdHNid3pYMFNyYXhmS0p6YWkyV2V4RGFLRGFUTlB0VVpGb0N3aEhRMnczRGdFSkt3Tlp2WXZSVjRNNDJrN1p3UXBEOWQvUWdQYUczWXdXWWJza1FxZmpNTkd1anFyWWFxTWpqdDR2UWdTemNRMm9wZit5ZmJiektHN2d0elkwRXJlbWtLeXY2TWkyMVVidlI1OHY0R2VDTUdqNGRzOVAvUi9FR2tSNnBHczREWUFRWkN0ZXh5eWQraVVjcVR1Sk5wcjZRN0pmblFPcVVVaGhsbVFFWldWSkFJVllLMnk3dVJZY3ZMeU5xbS95dXR4aHE0MlhLL1R0L1Y5Z3RqeUVTYjBUWjF1SUR2MGdDVFFFdlIyVnVybXpTdnM4YUtPVzlsRG1PSTFSVVVJTWM3cnVDVnR3b3cvYW90NEpEZHBhWXVlZTBSbGVCSkVWSU1xMFhPbFVRTFMyWmdKdEhRa2hLekhDUXR2TDBHaTVZbUVkNmFkMUh0SDVubld3YzYrdFRndGZnMEYzTTA2YmZ3RzRUdjhYeStoUGFBQUFBQUJKUlU1RXJrSmdnZz09JztcbiAgICB9IGVsc2UgaWYgKHRydWNrQ29sb3IgPT0gJ3JlZCcpIHtcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXJDQVlBQUFEYmpjNnpBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRkVtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd05TMHdNVlF4TmpveE1Ub3lNUzB3TkRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1qTXRNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1qTXRNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WmpBMVkyVm1ORGN0TTJOallpMDNZalEyTFdJMVpqUXROMkk1TURBd01qZzFNamxsSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT21Zd05XTmxaalEzTFROalkySXROMkkwTmkxaU5XWTBMVGRpT1RBd01ESTROVEk1WlNJZ2VHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT21Zd05XTmxaalEzTFROalkySXROMkkwTmkxaU5XWTBMVGRpT1RBd01ESTROVEk1WlNJK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZaakExWTJWbU5EY3RNMk5qWWkwM1lqUTJMV0kxWmpRdE4ySTVNREF3TWpnMU1qbGxJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakV4T2pJeExUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUHBLcGNLY0FBQUw0U1VSQlZHamU3WnJOU2pNeEZJYm5FdVlTdW5iVm5WczM3c1ViY0c1QTZOWnVuS1U3WGVqYTZnMjBGMUN3NjI0VVFTd0kva0JGRUlwRlFSQ0VtTGMwY25xY1RETXp5VGcvUFhBKzlXTkkzanhKVGs1K1BNK0JDU0ZDVVc2N2xPNTdqdUJzcUZxKzM5L0Y2L201ZURrNUtieERKL1FTNjdvQzFGTTFqTGEzeGVYYVdta2NlcGsxMGdCb1NqK1VmaUg5VFRkR1AwZWpVc0ZSL2pFYzBtYUVTY0ZjbUU1aVZGUWJRUExEZlE0QTh4V0ZVY2VvcVIwZytkRXBIeG4zdTd1UmhkOEZRYjBBY1Rqamc0UFl3bXNGaU1ONWFyZVhGbDRiUUduZzFBWlFXamkxQUpRRlR1VUJaWVZUYVVEeWw2T3NjQ29MU1A2elpRTk9sUUU5MklCVFpVQXptL1I2bVF1dk5LQ2J6YzBWSUIyZ3IrZG5LNFZYRnBDdHhxd0FMWEZNVTJvMnBtMmVmcjIrem85ZFc1N3QzcVpuUWwvanNYamEyeE4zT3p1RmQraUVYbWErZFVCMG1wWGNXaXFMdGg0dmtFK3hvVm8yNjlFOW1KT0Fpdm1NQXpia1YveG90b2pPTEhRT3FHeStBcFFuSUV3ZkZmbnhzMGdYaEVndHFEYlRWTU1LSUZRMjZYWWpveHFXeUpmajQzOERnNXVXejl0YjdSMGRWbGVuZ0V4WEpvakVDTXNUanE3VHVMMmVuYmtCaE43aDE4cFlvZEFyY0g3eG55Y2tEZ2R0VWRxZ0c2c28xWWJ2clFMaTZiZnViZ3pmMFN6YXh2R0p5YWcyT2V4RGFLRGFvcVpiWkpKb0FnaFBRMHd2RGdFSkp3TjU3Y1hvMWlDSk5vendKZG4veGdLZ3VNWW9FYVpISW5RNkxoTnQ2Nm1LcVRZNjRtaDdFU0swejE3VS8wejcvVDl4QTMvL0JqaFpTTktjd21WK1JVZTJxVGJhSHZXK0lPSk4wSURmaFYwdHZBaVRrUjdMTlp3R1FBZ3lGYTlpbGxyNlhUamRIaVRSUmp0UHMvbzFPU0NmUXRJdWtTbEdVRjZXQnBER0F0MWR2RDkvZURtTnkyK0tldHhocW8ybkszVDN2aENZRFI1aFV1OGt1UlppTytOQlJIazJQWXhidXY4YzVpMW0yby96TXZ5c2p6SWJORWJGQ1ltWTAwM1BzYzBiT3RNV3R5ZU0wQlk0ZS9lTXlyQVJ4S29BVVpyanlzREx3ZmpOc0tHMmpnc2hSd25DUXVqbGFPaU1CTm82cm52ck1hYnlnWEd3czYrdE9hOWZaOUM5bGJUY0h4SEJ4QjdKNmVUVkFBQUFBRWxGVGtTdVFtQ0MnO1xuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAneWVsbG93Jykge1xuICAgICAgaW5mb0JveFRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRWdBQUFBc0NBWUFBQURHaVA0TEFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFGRW1sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TlMwd01WUXhOam94TVRvd05pMHdORG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TVRrdE1EUTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TVRrdE1EUTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVEF5TkRFNFkyRXROVE16TkMwNE5qUmpMV0ZoTm1FdFlUSmxORGsyWW1VMVltRTRJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0o0YlhBdVpHbGtPamt3TWpReE9HTmhMVFV6TXpRdE9EWTBZeTFoWVRaaExXRXlaVFE1Tm1KbE5XSmhPQ0lnZUcxd1RVMDZUM0pwWjJsdVlXeEViMk4xYldWdWRFbEVQU0o0YlhBdVpHbGtPamt3TWpReE9HTmhMVFV6TXpRdE9EWTBZeTFoWVRaaExXRXlaVFE1Tm1KbE5XSmhPQ0krSUR4NGJYQk5UVHBJYVhOMGIzSjVQaUE4Y21SbU9sTmxjVDRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUltTnlaV0YwWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9UQXlOREU0WTJFdE5UTXpOQzA0TmpSakxXRmhObUV0WVRKbE5EazJZbVUxWW1FNElpQnpkRVYyZERwM2FHVnVQU0l5TURFNExUQTFMVEF4VkRFMk9qRXhPakEyTFRBME9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QbktiSTVZQUFBTUpTVVJCVkdqZTdacTlTc1JBRUlEdkVTeDhBTUVYT0h3Qjd3blVKNUI3QUFWN0M2L1ZSa3V0dk01U1FRUWJPUVcxc2ZCQUxTejg0Um9id2JQUVFzeXRNMnMyVGphYlpQT3phMzV1WUZCUXNwTXZzek96czlOb1dCREcyQVRvYkFtMDJiQXBzT0FDNkJNcmw3eUJydUZITlEybnc4b3QxOFlnd1lOYjNqSmY3OHg1M0dITy9VYnhGZXhFZTRuc213SjBJRlp3emxycyszQ3lOSXIyVWtrTG9BbTZDZHB6OTZ4U1J1KzNwWUlqZFBSNmtRNlFDNmFudTRseG9kb0FjaU83WDJDLzRzTjhDbDVUTzBEd2Y3dXlaemhYaStvOWZEbGZMMEFCT0hlcjBVR3VUb0FDY1ByTDhWbWdMb0RTd0trTm9MUndhZ0VvQzV6S0E4b0twOUtBNFBldHJIQXFDOGh0UzJTR1UyVkFUM25BcVNRZzZqMmp3VjcyMDNBRkFYVzkxc1RKekJpUUF0QTEvKzF6a0U4L3BZS0FjbjJaTWFBNFFMQk5xZVN4YmEzcThUUmpYME56Z1BnWElEMGg5akZnVG44SlBHdXUrQXAyb3IyK2xxc0pRSFNibFZ4V0dxYmlCZFpUMGcxQjJlUkFGSW5tQWlyc1oyeXdZWDBWYU0wV1VDWHBtQWRVTWgwRHNnb0l0bytJL1B4bmdTNElzYlR3MmFaWmF1UUNDQmZEbUtJVVNKR2orL1gvQTNPMUNDWEdUY2dkM1RuUHJrWUIvV2FtWWZ5RklSaUpIbWExK2czN2FKSTREOXRtQU9IWGthK1ZNVVBoVitFcVhmemJoQ1RENFZsSjJJWmVoWCtudG9WMExkSURrc3J2MExzeFRPdjBaaldIOW9tV1YyczArM2hvSUxhcHRsdWdTTlFGaEtNaHVoZUhIT2Jud05wWmpCNE5rdGpHUFR5NittOEpRS2R4TCtNWm9ka1NvZHN4MXVpOFJsVTBiYU1lUjkrWGh3aS9UQWxBYmU5bFhvNkNjUU9waXdmQ1E1TFdGQ2JySytyWjJyYlI5M0huQytTWklIUWErYnFuL3pleE1lU1JIdE0xVnhJQTBTQnRRQ0ptdWFuZmlFTHFUbVViU2YwaDJhK3Bta0x0eDZiSUZCNWtTOUlBQ3BGMjFLZ3VEbDRPSSt1YmdyWTd0RzJUeWhWNmV2Y0NzK1lRSnRWdWttc2g2dnB1RW1nWjFFNVU2ZzQyODN5VjlyUDdqSW1zUTVsVHZoZ1ZZWWhpVHpjdHpHTS9lN1pGbkFrVnRyV056VDNqWW5nUTVJZFdNRXJWcnN6VmdQaUI5YVMyZFUwWXNwVWdMSFFzVC9XM0U5aW1EZWNIUmp4U21LK2JxZndBQUFBQVNVVk9SSzVDWUlJPSc7XG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICdwdXJwbGUnKSB7XG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUd0bWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdNeTB3TTFReE1Ub3pNVG93TkMwd05Ub3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZORGt0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZORGt0TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1Ea3dZVEF3WlRZdE9UTm1aaTFrWWpRMUxXSXhNakV0TTJJMU16Qm1OMll5WlRRd0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2TlRKa01XUXdNRGd0WVdNeE15MDNNRFE1TFRsbU9HTXRPVGhpTlRjeFpESXpZakkwSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2WXpJME9UZzBNR1V0TW1Ka01TMWtaRFF4TFRnMFkySXRNV1EwWWpSak56VmtNRGt4SWo0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGpNalE1T0RRd1pTMHlZbVF4TFdSa05ERXRPRFJqWWkweFpEUmlOR00zTldRd09URWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TUROVU1URTZNekU2TURRdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pKbU16azNNakU0TFRsbU1EVXRaVGMwTUMxaVkyWTVMVE5pTW1Wak16azVNRFEzTWlJZ2MzUkZkblE2ZDJobGJqMGlNakF4T0Mwd015MHdNMVF4TVRvek9Ub3dPQzB3TlRvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZNRGt3WVRBd1pUWXRPVE5tWmkxa1lqUTFMV0l4TWpFdE0ySTFNekJtTjJZeVpUUXdJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakUxT2pRNUxUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUGdZb0k0b0FBQUw5U1VSQlZHamU3WnE3VGh0QkZJYjNFZndJUElJZmdUZkFOWldyMU82RGhMdVVRQnNweW5aV2luQUxEVWhnRjBna1VpUWloMlliMWtVb2tKQ01FQVZVeS83SUE4ZkhzN3V6dTNNMmUvR1JqbnpSYXViZmIyYk9uTGs0anBBRlFkQVBxbTJYb2JlazRLeXFXcDRlbjRQeG9SZjhIbHlWM3FFVGVvbnRTUUhhVnpWODd4MEhuOWUrVmNhaGwxcFdBTzNRdDBJZmhqNk42cU4zL3JSU2NKVGYvTDNOQm1nR1ptZzZpRkZSWXdDRnoyNXlBQml2S0l3NmVrM2pBSVhQZmVVOTQrVFR1YmJ3bzQxaHN3QnhPQmRmTG1NTGJ4UWdEbWUwOHl1eDhNWUF5Z0tuTVlDeXdta0VvRHh3YWc4b0w1eGFBd3EvYitlRlUxdEE0V2ZIQnB3NkEvSnR3S2tsSU5wN3ZETS9kK0YxQk9TcUg0TVBSMHRBR2tEWU9Rc2ViaCt0RkY1SFFGWmZaZ2tvd1RGTXFka1l0a1c2dTc0N3QrM3FTTFEyM1JQQzBNWE0rT1BqV2VrZE9xRjNic3RWQWhBZFpoVzNuaU1WTDlBYTdJU2dhcmF2a2tTeGdJcnhqQTAyNUZkOGE3YU16cXd2RHFocXZnUlVKQ0FNSHhYNThWbW1BMEtrRmxTYmFhcGhCUkFxODA1OWJWVERGSWtqM1A4RkJpY3RkOWZUeURNNnpLNmlnRXhuSm9oRUR5c1NUbFNqY1JzZmVES0EwRHI4V0JrekZGb0Z6Zy8raTRURTRlQmRsRGJveGl4S3RlRjVxNEI0K2gxMU5vYm5hQlp0WS92RXBGZWJiUFloTkZCdHV1RzJrQ1NhQWtKY01UMDRCQ1Nhcmt1dnhXaGRhYlNoaHlkay82c0swQ2pwWlZTaHBsc2lkRGdtaWJaMVZjVlVHKzF4OUgwUklwaXRLRUJkOVkvLzg5OUMzTUR2dHdCMzZLWE9LU1R6SzlxelRiWFI5MUgzQy9pZElIUWFmdHp6Wis1RzJNSDdqVEFhQU5OTTRTcG1xYWxmd3VueUlJMDIybmdSczErYkEycFJTSkZUWklZZVZKUmxBUlJoM2FqajV0YnM0dVY5WEg1VDF1ME9VMjA4WGFHcjk3ZkFiSGdKazdxYjVsaUlyWXhIbXZKc2VqOXU2bDdZekp2UHRDZXpNbHA1TDJXdTBCZ1ZKMFF6cHR1T3NNMWU5RlZiM0pwUW82MHJkdThabFdFaGlGa0JvblRibFZZRnhHdnJaTkRtU2dqWlRoRVcrazZCUnRNVkEzT2xXMnNTVS9uSU9OaloxOWFtaWEvR29MdVRwc3dYb2FUd3NuS0FrZEVBQUFBQVNVVk9SSzVDWUlJPSc7XG4gICAgfVxuXG4gICAgdmFyIGZlZXRmb3JNaWxlcyA9IDAuMDAwMTg5Mzk0O1xuICAgIHZhciBtaWVsc1RvZGlzcGF0Y2ggPSBwYXJzZUZsb2F0KHRydWNrSXRlbS5kaXN0KS50b0ZpeGVkKDIpO1xuXG4gICAgdGhpcy5yZXN1bHRzLnB1c2goe1xuICAgICAgZGlzcGxheTogdHJ1Y2tJdGVtLnRydWNrSWQgKyBcIiA6IFwiICsgdHJ1Y2tJdGVtLnRlY2hJRCxcbiAgICAgIHZhbHVlOiAxLFxuICAgICAgTGF0aXR1ZGU6IHRydWNrSXRlbS5sYXQsXG4gICAgICBMb25naXR1ZGU6IHRydWNrSXRlbS5sb25nXG4gICAgfSk7XG5cbiAgICB2YXIgdHJ1Y2tVcmwgPSB0aGlzLmdldFRydWNrVXJsKHRydWNrQ29sb3IpO1xuICAgIGNvbnN0IGxpc3RPZlB1c2hQaW5zID0gbWFwcy5lbnRpdGllcztcbiAgICB2YXIgaXNOZXdUcnVjayA9IHRydWU7XG5cbiAgICB2YXIgbWV0YWRhdGEgPSB7XG4gICAgICB0cnVja0lkOiB0cnVja0l0ZW0udHJ1Y2tJZCxcbiAgICAgIEFUVFVJRDogdHJ1Y2tJdGVtLnRlY2hJRCxcbiAgICAgIHRydWNrU3RhdHVzOiB0cnVja0l0ZW0udHJ1Y2tDb2wsXG4gICAgICB0cnVja0NvbDogdHJ1Y2tJdGVtLnRydWNrQ29sLFxuICAgICAgam9iVHlwZTogdHJ1Y2tJdGVtLmpvYlR5cGUsXG4gICAgICBXUkpvYlR5cGU6IHRydWNrSXRlbS53b3JrVHlwZSxcbiAgICAgIFdSU3RhdHVzOiB0cnVja0l0ZW0ud3JTdGF0LFxuICAgICAgQXNzaW5nZWRXUklEOiB0cnVja0l0ZW0ud3JJRCxcbiAgICAgIFNwZWVkOiB0cnVja0l0ZW0uc3BlZWQsXG4gICAgICBEaXN0YW5jZTogbWllbHNUb2Rpc3BhdGNoLFxuICAgICAgQ3VycmVudElkbGVUaW1lOiB0cnVja0l0ZW0uaWRsZVRpbWUsXG4gICAgICBFVEE6IHRydWNrSXRlbS50b3RJZGxlVGltZSxcbiAgICAgIEVtYWlsOiAnJywvLyB0cnVja0l0ZW0uRW1haWwsXG4gICAgICBNb2JpbGU6ICcnLCAvLyB0cnVja0l0ZW0uTW9iaWxlLFxuICAgICAgaWNvbjogaWNvblVybCxcbiAgICAgIGljb25JbmZvOiBpbmZvQm94VHJ1Y2tVcmwsXG4gICAgICBDdXJyZW50TGF0OiB0cnVja0l0ZW0ubGF0LFxuICAgICAgQ3VycmVudExvbmc6IHRydWNrSXRlbS5sb25nLFxuICAgICAgV1JMYXQ6IHRydWNrSXRlbS53ckxhdCxcbiAgICAgIFdSTG9uZzogdHJ1Y2tJdGVtLndyTG9uZyxcbiAgICAgIHRlY2hJZHM6IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsXG4gICAgICBqb2JJZDogdHJ1Y2tJdGVtLmpvYklkLFxuICAgICAgbWFuYWdlcklkczogdGhpcy5tYW5hZ2VySWRzLFxuICAgICAgd29ya0FkZHJlc3M6IHRydWNrSXRlbS53b3JrQWRkcmVzcyxcbiAgICAgIHNiY1ZpbjogdHJ1Y2tJdGVtLnNiY1ZpbixcbiAgICAgIGN1c3RvbWVyTmFtZTogdHJ1Y2tJdGVtLmN1c3RvbWVyTmFtZSxcbiAgICAgIHRlY2huaWNpYW5OYW1lOiB0cnVja0l0ZW0udGVjaG5pY2lhbk5hbWUsXG4gICAgICBkaXNwYXRjaFRpbWU6IHRydWNrSXRlbS5kaXNwYXRjaFRpbWUsXG4gICAgICByZWdpb246IHRydWNrSXRlbS56b25lXG4gICAgfTtcblxuICAgIGxldCBqb2JJZFN0cmluZyA9ICdodHRwOi8vZWRnZS1lZHQuaXQuYXR0LmNvbS9jZ2ktYmluL2VkdF9qb2JpbmZvLmNnaT8nO1xuXG4gICAgbGV0IHpvbmUgPSB0cnVja0l0ZW0uem9uZTtcblxuICAgIC8vID0gTSBmb3IgTVdcbiAgICAvLyA9IFcgZm9yIFdlc3RcbiAgICAvLyA9IEIgZm9yIFNFXG4gICAgLy8gPSBTIGZvciBTV1xuICAgIGlmICh6b25lICE9IG51bGwgJiYgem9uZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh6b25lID09PSAnTVcnKSB7XG4gICAgICAgIHpvbmUgPSAnTSc7XG4gICAgICB9IGVsc2UgaWYgKHpvbmUgPT09ICdTRScpIHtcbiAgICAgICAgem9uZSA9ICdCJ1xuICAgICAgfSBlbHNlIGlmICh6b25lID09PSAnU1cnKSB7XG4gICAgICAgIHpvbmUgPSAnUydcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgem9uZSA9ICcnO1xuICAgIH1cblxuICAgIGpvYklkU3RyaW5nID0gam9iSWRTdHJpbmcgKyAnZWR0X3JlZ2lvbj0nICsgem9uZSArICcmd3JpZD0nICsgdHJ1Y2tJdGVtLndySUQ7XG5cbiAgICB0cnVja0l0ZW0uam9iSWQgPSB0cnVja0l0ZW0uam9iSWQgPT0gdW5kZWZpbmVkIHx8IHRydWNrSXRlbS5qb2JJZCA9PSBudWxsID8gJycgOiB0cnVja0l0ZW0uam9iSWQ7XG5cbiAgICBpZiAodHJ1Y2tJdGVtLmpvYklkICE9ICcnKSB7XG4gICAgICBqb2JJZFVybCA9ICc8YSBocmVmPVwiJyArIGpvYklkU3RyaW5nICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiIHRpdGxlPVwiQ2xpY2sgaGVyZSB0byBzZWUgYWN0dWFsIEZvcmNlL0VkZ2Ugam9iIGRhdGFcIj4nICsgdHJ1Y2tJdGVtLmpvYklkICsgJzwvYT4nO1xuICAgIH1cblxuICAgIGlmICh0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lICE9IG51bGwgJiYgdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSB1bmRlZmluZWQgJiYgdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSAnJykge1xuICAgICAgbGV0IGRpc3BhdGNoRGF0ZSA9IHRydWNrSXRlbS5kaXNwYXRjaFRpbWUuc3BsaXQoJzonKTtcbiAgICAgIGxldCBkdCA9IGRpc3BhdGNoRGF0ZVswXSArICcgJyArIGRpc3BhdGNoRGF0ZVsxXSArICc6JyArIGRpc3BhdGNoRGF0ZVsyXSArICc6JyArIGRpc3BhdGNoRGF0ZVszXTtcbiAgICAgIG1ldGFkYXRhLmRpc3BhdGNoVGltZSA9IHRoYXQuVVRDVG9UaW1lWm9uZShkdCk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGluIHRoZSBUcnVja1dhdGNoTGlzdCBzZXNzaW9uXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudHJ1Y2tMaXN0ID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja1dhdGNoTGlzdCcpKTtcblxuICAgICAgaWYgKHRoaXMudHJ1Y2tMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHRoaXMudHJ1Y2tMaXN0LnNvbWUoeCA9PiB4LnRydWNrSWQgPT0gdHJ1Y2tJdGVtLnRydWNrSWQpID09IHRydWUpIHtcbiAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMudHJ1Y2tMaXN0LmZpbmQoeCA9PiB4LnRydWNrSWQgPT0gdHJ1Y2tJdGVtLnRydWNrSWQpO1xuICAgICAgICAgIGNvbnN0IGluZGV4OiBudW1iZXIgPSB0aGlzLnRydWNrTGlzdC5pbmRleE9mKGl0ZW0pO1xuICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGl0ZW0uRGlzdGFuY2UgPSBtZXRhZGF0YS5EaXN0YW5jZTtcbiAgICAgICAgICAgIGl0ZW0uaWNvbiA9IG1ldGFkYXRhLmljb247XG4gICAgICAgICAgICB0aGlzLnRydWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy50cnVja0xpc3Quc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcbiAgICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja1dhdGNoTGlzdCcsIHRoaXMudHJ1Y2tMaXN0KTtcbiAgICAgICAgICAgIGl0ZW0gPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBpbiB0aGUgU2VsZWN0ZWRUcnVjayBzZXNzaW9uXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrRGV0YWlscycpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcbiAgICAgIHNlbGVjdGVkVHJ1Y2sgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrRGV0YWlscycpKTtcblxuICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjay50cnVja0lkID09IHRydWNrSXRlbS50cnVja0lkKSB7XG4gICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnVHJ1Y2tEZXRhaWxzJyk7XG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrRGV0YWlscycsIG1ldGFkYXRhKTtcbiAgICAgICAgICBzZWxlY3RlZFRydWNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnRydWNrSXRlbXMubGVuZ3RoID4gMCAmJiB0aGlzLnRydWNrSXRlbXMuc29tZSh4ID0+IHgudG9Mb3dlckNhc2UoKSA9PSB0cnVja0l0ZW0udHJ1Y2tJZC50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgaXNOZXdUcnVjayA9IGZhbHNlO1xuICAgICAgLy8gSWYgaXQgaXMgbm90IGEgbmV3IHRydWNrIHRoZW4gbW92ZSB0aGUgdHJ1Y2sgdG8gbmV3IGxvY2F0aW9uXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RPZlB1c2hQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcbiAgICAgICAgaWYgKGxpc3RPZlB1c2hQaW5zLmdldChpKS5tZXRhZGF0YS50cnVja0lkID09PSB0cnVja0l0ZW0udHJ1Y2tJZCkge1xuICAgICAgICAgIHZhciBjdXJQdXNoUGluID0gbGlzdE9mUHVzaFBpbnMuZ2V0KGkpO1xuICAgICAgICAgIGN1clB1c2hQaW4ubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICBkZXN0TG9jID0gcGluTG9jYXRpb247XG4gICAgICAgICAgcGluTG9jYXRpb24gPSBsaXN0T2ZQdXNoUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcblxuICAgICAgICAgIGxldCB0cnVja0lkUmFuSWQgPSB0cnVja0l0ZW0udHJ1Y2tJZCArICdfJyArIE1hdGgucmFuZG9tKCk7XG5cbiAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0uaW5kZXhPZih0cnVja0l0ZW0udHJ1Y2tJZCkgPiAtMSkge1xuICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0LnB1c2godHJ1Y2tJZFJhbklkKTtcblxuICAgICAgICAgIHRoaXMubG9hZERpcmVjdGlvbnModGhpcywgcGluTG9jYXRpb24sIGRlc3RMb2MsIGksIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudHJ1Y2tJdGVtcy5wdXNoKHRydWNrSXRlbS50cnVja0lkKTtcbiAgICAgIE5ld1BpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKHBpbkxvY2F0aW9uLCB7IGljb246IHRydWNrVXJsIH0pO1xuXG4gICAgICBOZXdQaW4ubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgIHRoaXMubWFwLmVudGl0aWVzLnB1c2goTmV3UGluKTtcblxuICAgICAgdGhpcy5kYXRhTGF5ZXIucHVzaChOZXdQaW4pO1xuICAgICAgaWYgKHRoaXMuaXNNYXBMb2FkZWQpIHtcbiAgICAgICAgdGhpcy5pc01hcExvYWRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1hcC5zZXRWaWV3KHsgY2VudGVyOiBwaW5Mb2NhdGlvbiwgem9vbTogdGhpcy5sYXN0Wm9vbUxldmVsIH0pO1xuICAgICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSB0aGlzLm1hcC5nZXRab29tKCk7XG4gICAgICAgIHRoYXQubGFzdExvY2F0aW9uID0gdGhpcy5tYXAuZ2V0Q2VudGVyKCk7XG4gICAgICB9XG5cbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ21vdXNlb3V0JywgKGUpID0+IHtcbiAgICAgICAgdGhpcy5pbmZvYm94LnNldE9wdGlvbnMoeyB2aXNpYmxlOiBmYWxzZSB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPCAxMDI0KSB7XG4gICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7XG4gICAgICAgICAgICBzaG93UG9pbnRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiBlLnRhcmdldC5nZXRMb2NhdGlvbigpLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgIG9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDAsIDIwKSxcbiAgICAgICAgICAgIGh0bWxDb250ZW50OiAnPGRpdiBjbGFzcyA9IFwiaW5meSBpbmZ5TWFwcG9wdXBcIj4nXG4gICAgICAgICAgICAgICsgZ2V0SW5mb0JveEhUTUwoZS50YXJnZXQubWV0YWRhdGEsIHRoaXMudGhyZXNob2xkVmFsdWUsIGpvYklkVXJsKSArICc8L2Rpdj4nXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnRydWNrV2F0Y2hMaXN0ID0gW3sgVHJ1Y2tJZDogZS50YXJnZXQubWV0YWRhdGEudHJ1Y2tJZCwgRGlzdGFuY2U6IGUudGFyZ2V0Lm1ldGFkYXRhLkRpc3RhbmNlIH1dO1xuXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snLCBlLnRhcmdldC5tZXRhZGF0YSk7XG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrRGV0YWlscycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcblxuICAgICAgICAgIC8vIEEgYnVmZmVyIGxpbWl0IHRvIHVzZSB0byBzcGVjaWZ5IHRoZSBpbmZvYm94IG11c3QgYmUgYXdheSBmcm9tIHRoZSBlZGdlcyBvZiB0aGUgbWFwLlxuXG4gICAgICAgICAgdmFyIGJ1ZmZlciA9IDMwO1xuICAgICAgICAgIHZhciBpbmZvYm94T2Zmc2V0ID0gdGhhdC5pbmZvYm94LmdldE9mZnNldCgpO1xuICAgICAgICAgIHZhciBpbmZvYm94QW5jaG9yID0gdGhhdC5pbmZvYm94LmdldEFuY2hvcigpO1xuICAgICAgICAgIHZhciBpbmZvYm94TG9jYXRpb24gPSBtYXBzLnRyeUxvY2F0aW9uVG9QaXhlbChlLnRhcmdldC5nZXRMb2NhdGlvbigpLCBNaWNyb3NvZnQuTWFwcy5QaXhlbFJlZmVyZW5jZS5jb250cm9sKTtcbiAgICAgICAgICB2YXIgZHggPSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hPZmZzZXQueCAtIGluZm9ib3hBbmNob3IueDtcbiAgICAgICAgICB2YXIgZHkgPSBpbmZvYm94TG9jYXRpb24ueSAtIDI1IC0gaW5mb2JveEFuY2hvci55O1xuXG4gICAgICAgICAgaWYgKGR5IDwgYnVmZmVyKSB7IC8vIEluZm9ib3ggb3ZlcmxhcHMgd2l0aCB0b3Agb2YgbWFwLlxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxuICAgICAgICAgICAgZHkgKj0gLTE7XG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBidWZmZXIgZnJvbSB0aGUgdG9wIGVkZ2Ugb2YgdGhlIG1hcC5cbiAgICAgICAgICAgIGR5ICs9IGJ1ZmZlcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeSBpcyBncmVhdGVyIHRoYW4gemVybyB0aGFuIGl0IGRvZXMgbm90IG92ZXJsYXAuXG4gICAgICAgICAgICBkeSA9IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGR4IDwgYnVmZmVyKSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIGxlZnQgc2lkZSBvZiBtYXAuXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXG4gICAgICAgICAgICBkeCAqPSAtMTtcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIGxlZnQgZWRnZSBvZiB0aGUgbWFwLlxuICAgICAgICAgICAgZHggKz0gYnVmZmVyO1xuICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIHJpZ2h0IHNpZGUgb2YgbWFwLlxuICAgICAgICAgICAgZHggPSBtYXBzLmdldFdpZHRoKCkgLSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hBbmNob3IueCAtIHRoYXQuaW5mb2JveC5nZXRXaWR0aCgpO1xuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeCBpcyBncmVhdGVyIHRoYW4gemVybyB0aGVuIGl0IGRvZXMgbm90IG92ZXJsYXAuXG4gICAgICAgICAgICBpZiAoZHggPiBidWZmZXIpIHtcbiAgICAgICAgICAgICAgZHggPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgbWFwLlxuICAgICAgICAgICAgICBkeCAtPSBidWZmZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gIyMjIyBBZGp1c3QgdGhlIG1hcCBzbyBpbmZvYm94IGlzIGluIHZpZXdcbiAgICAgICAgICBpZiAoZHggIT0gMCB8fCBkeSAhPSAwKSB7XG4gICAgICAgICAgICBtYXBzLnNldFZpZXcoe1xuICAgICAgICAgICAgICBjZW50ZXJPZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludChkeCwgZHkpLFxuICAgICAgICAgICAgICBjZW50ZXI6IG1hcHMuZ2V0Q2VudGVyKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XG4gICAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoaXMubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcblxuICAgICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhpcy5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxuICAgICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XG5cbiAgICAgICAgICAgIGlmICh0ZWNobmljaWFuRGV0YWlscyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhblBob25lID0gdGVjaG5pY2lhbkRldGFpbHMucGhvbmU7XG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbk5hbWUgPSB0ZWNobmljaWFuRGV0YWlscy5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLmluZm9ib3gsICdjbGljaycsIHZpZXdUcnVja0RldGFpbHMpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbmZvYm94LnNldE9wdGlvbnMoe1xuICAgICAgICAgICAgc2hvd1BvaW50ZXI6IHRydWUsXG4gICAgICAgICAgICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICBzaG93Q2xvc2VCdXR0b246IHRydWUsXG4gICAgICAgICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCAyMCksXG4gICAgICAgICAgICBodG1sQ29udGVudDogJzxkaXYgY2xhc3MgPSBcImluZnkgaW5meU1hcHBvcHVwXCI+J1xuICAgICAgICAgICAgICArIGdldEluZm9Cb3hIVE1MKGUudGFyZ2V0Lm1ldGFkYXRhLCB0aGlzLnRocmVzaG9sZFZhbHVlLCBqb2JJZFVybCkgKyAnPC9kaXY+J1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy50cnVja1dhdGNoTGlzdCA9IFt7IFRydWNrSWQ6IGUudGFyZ2V0Lm1ldGFkYXRhLnRydWNrSWQsIERpc3RhbmNlOiBlLnRhcmdldC5tZXRhZGF0YS5EaXN0YW5jZSB9XTtcblxuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJywgZS50YXJnZXQubWV0YWRhdGEpO1xuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja0RldGFpbHMnLCBlLnRhcmdldC5tZXRhZGF0YSk7XG5cbiAgICAgICAgICAvLyBBIGJ1ZmZlciBsaW1pdCB0byB1c2UgdG8gc3BlY2lmeSB0aGUgaW5mb2JveCBtdXN0IGJlIGF3YXkgZnJvbSB0aGUgZWRnZXMgb2YgdGhlIG1hcC5cblxuICAgICAgICAgIHZhciBidWZmZXIgPSAzMDtcbiAgICAgICAgICB2YXIgaW5mb2JveE9mZnNldCA9IHRoYXQuaW5mb2JveC5nZXRPZmZzZXQoKTtcbiAgICAgICAgICB2YXIgaW5mb2JveEFuY2hvciA9IHRoYXQuaW5mb2JveC5nZXRBbmNob3IoKTtcbiAgICAgICAgICB2YXIgaW5mb2JveExvY2F0aW9uID0gbWFwcy50cnlMb2NhdGlvblRvUGl4ZWwoZS50YXJnZXQuZ2V0TG9jYXRpb24oKSwgTWljcm9zb2Z0Lk1hcHMuUGl4ZWxSZWZlcmVuY2UuY29udHJvbCk7XG4gICAgICAgICAgdmFyIGR4ID0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94T2Zmc2V0LnggLSBpbmZvYm94QW5jaG9yLng7XG4gICAgICAgICAgdmFyIGR5ID0gaW5mb2JveExvY2F0aW9uLnkgLSAyNSAtIGluZm9ib3hBbmNob3IueTtcblxuICAgICAgICAgIGlmIChkeSA8IGJ1ZmZlcikgeyAvLyBJbmZvYm94IG92ZXJsYXBzIHdpdGggdG9wIG9mIG1hcC5cbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cbiAgICAgICAgICAgIGR5ICo9IC0xO1xuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYnVmZmVyIGZyb20gdGhlIHRvcCBlZGdlIG9mIHRoZSBtYXAuXG4gICAgICAgICAgICBkeSArPSBidWZmZXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHkgaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhhbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxuICAgICAgICAgICAgZHkgPSAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkeCA8IGJ1ZmZlcikgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCBsZWZ0IHNpZGUgb2YgbWFwLlxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxuICAgICAgICAgICAgZHggKj0gLTE7XG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIG1hcC5cbiAgICAgICAgICAgIGR4ICs9IGJ1ZmZlcjtcbiAgICAgICAgICB9IGVsc2UgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCByaWdodCBzaWRlIG9mIG1hcC5cbiAgICAgICAgICAgIGR4ID0gbWFwcy5nZXRXaWR0aCgpIC0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94QW5jaG9yLnggLSB0aGF0LmluZm9ib3guZ2V0V2lkdGgoKTtcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHggaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhlbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxuICAgICAgICAgICAgaWYgKGR4ID4gYnVmZmVyKSB7XG4gICAgICAgICAgICAgIGR4ID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIG1hcC5cbiAgICAgICAgICAgICAgZHggLT0gYnVmZmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vICMjIyMgQWRqdXN0IHRoZSBtYXAgc28gaW5mb2JveCBpcyBpbiB2aWV3XG4gICAgICAgICAgaWYgKGR4ICE9IDAgfHwgZHkgIT0gMCkge1xuICAgICAgICAgICAgbWFwcy5zZXRWaWV3KHtcbiAgICAgICAgICAgICAgY2VudGVyT2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoZHgsIGR5KSxcbiAgICAgICAgICAgICAgY2VudGVyOiBtYXBzLmdldENlbnRlcigpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGlzLm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XG5cbiAgICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcbiAgICAgICAgICAgICAgeCA9PiB4LmF0dHVpZC50b0xvd2VyQ2FzZSgpID09IHNlbGVjdGVkVHJ1Y2suQVRUVUlELnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5pbmZvYm94LCAnY2xpY2snLCB2aWV3VHJ1Y2tEZXRhaWxzKTtcblxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIobWFwcywgJ3ZpZXdjaGFuZ2UnLCBtYXBWaWV3Q2hhbmdlZCk7XG5cbiAgICAgIC8vIHRoaXMuQ2hhbmdlVHJ1Y2tEaXJlY3Rpb24odGhpcywgTmV3UGluLCBkZXN0TG9jLCB0cnVja1VybCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFwVmlld0NoYW5nZWQoZSkge1xuICAgICAgdGhhdC5sYXN0Wm9vbUxldmVsID0gbWFwcy5nZXRab29tKCk7XG4gICAgICB0aGF0Lmxhc3RMb2NhdGlvbiA9IG1hcHMuZ2V0Q2VudGVyKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1vdXNld2hlZWxDaGFuZ2VkKGUpIHtcbiAgICAgIHRoYXQubGFzdFpvb21MZXZlbCA9IG1hcHMuZ2V0Wm9vbSgpO1xuICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSBtYXBzLmdldENlbnRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEluZm9Cb3hIVE1MKGRhdGE6IGFueSwgdFZhbHVlLCBqb2JJZCk6IFN0cmluZyB7XG5cbiAgICAgIGlmICghZGF0YS5TcGVlZCkge1xuICAgICAgICBkYXRhLlNwZWVkID0gMDtcbiAgICAgIH1cblxuICAgICAgdmFyIGNsYXNzTmFtZSA9IFwiXCI7XG4gICAgICB2YXIgc3R5bGVMZWZ0ID0gXCJcIjtcbiAgICAgIHZhciByZWFzb24gPSAnJztcbiAgICAgIGlmIChkYXRhLnRydWNrU3RhdHVzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoZGF0YS50cnVja1N0YXR1cy50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICdyZWQnKSB7XG4gICAgICAgICAgcmVhc29uID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tdG9wOjNweDtjb2xvcjpyZWQ7Jz5SZWFzb246IEN1bXVsYXRpdmUgaWRsZSB0aW1lIGlzIGJleW9uZCBcIiArIHRWYWx1ZSArIFwiIG1pbnM8L2Rpdj5cIjtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLnRydWNrU3RhdHVzLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3B1cnBsZScpIHtcbiAgICAgICAgICByZWFzb24gPSBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi10b3A6M3B4O2NvbG9yOnB1cnBsZTsnPlJlYXNvbjogVHJ1Y2sgaXMgZHJpdmVuIGdyZWF0ZXIgdGhhbiA3NSBtL2g8L2Rpdj5cIjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgaW5mb2JveERhdGEgPSAnJztcblxuICAgICAgZGF0YS5jdXN0b21lck5hbWUgPSBkYXRhLmN1c3RvbWVyTmFtZSA9PSB1bmRlZmluZWQgfHwgZGF0YS5jdXN0b21lck5hbWUgPT0gbnVsbCA/ICcnIDogZGF0YS5jdXN0b21lck5hbWU7XG5cbiAgICAgIGRhdGEuZGlzcGF0Y2hUaW1lID0gZGF0YS5kaXNwYXRjaFRpbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEuZGlzcGF0Y2hUaW1lID09IG51bGwgPyAnJyA6IGRhdGEuZGlzcGF0Y2hUaW1lO1xuXG4gICAgICBkYXRhLmpvYklkID0gZGF0YS5qb2JJZCA9PSB1bmRlZmluZWQgfHwgZGF0YS5qb2JJZCA9PSBudWxsID8gJycgOiBkYXRhLmpvYklkO1xuXG4gICAgICBkYXRhLndvcmtBZGRyZXNzID0gZGF0YS53b3JrQWRkcmVzcyA9PSB1bmRlZmluZWQgfHwgZGF0YS53b3JrQWRkcmVzcyA9PSBudWxsID8gJycgOiBkYXRhLndvcmtBZGRyZXNzO1xuXG4gICAgICBkYXRhLnNiY1ZpbiA9IGRhdGEuc2JjVmluID09IHVuZGVmaW5lZCB8fCBkYXRhLnNiY1ZpbiA9PSBudWxsIHx8IGRhdGEuc2JjVmluID09ICcnID8gJycgOiBkYXRhLnNiY1ZpbjtcblxuICAgICAgZGF0YS50ZWNobmljaWFuTmFtZSA9IGRhdGEudGVjaG5pY2lhbk5hbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEudGVjaG5pY2lhbk5hbWUgPT0gbnVsbCB8fCBkYXRhLnRlY2huaWNpYW5OYW1lID09ICcnID8gJycgOiBkYXRhLnRlY2huaWNpYW5OYW1lO1xuXG4gICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPCAxMDI0KSB7XG4gICAgICAgIGluZm9ib3hEYXRhID0gXCI8ZGl2IGNsYXNzPSdwb3BNb2RhbENvbnRhaW5lcic+PGRpdiBjbGFzcz0ncG9wTW9kYWxIZWFkZXInPjxpbWcgc3JjPSdcIiArIGRhdGEuaWNvbkluZm8gKyBcIicgPjxhIGNsYXNzPSdkZXRhaWxzJyB0aXRsZT0nQ2xpY2sgaGVyZSB0byBzZWUgdGVjaG5pY2lhbiBkZXRhaWxzJyA+VmlldyBEZXRhaWxzPC9hPjxpIGNsYXNzPSdmYSBmYS10aW1lcycgYXJpYS1oaWRkZW49J3RydWUnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPjwvaT48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8aHIvPjxkaXYgY2xhc3M9J3BvcE1vZGFsQm9keSc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5WZWhpY2xlIE51bWJlciA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLnNiY1ZpbiArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPlZUUyBVbml0IElEIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEudHJ1Y2tJZCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Sm9iIFR5cGUgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5qb2JUeXBlICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Sm9iIElkIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGpvYklkICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5BVFRVSUQgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5BVFRVSUQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5UZWNobmljaWFuIE5hbWUgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS50ZWNobmljaWFuTmFtZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Q3VzdG9tZXIgTmFtZSA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmN1c3RvbWVyTmFtZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkRpc3BhdGNoIFRpbWU6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmRpc3BhdGNoVGltZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTEyJz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wtMTIgY29sLXNtLTEyIGNvbC1mb3JtLWxhYmVsJz5Kb2IgQWRkcmVzcyA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wtMTIgY29sLXNtLTEyJz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwgY29sLWZvcm0tbGFiZWwtZnVsbCc+XCIgKyBkYXRhLndvcmtBZGRyZXNzICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IG1ldGVyQ2FsJz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyBkYXRhLlNwZWVkICsgXCI8L3N0cm9uZz4gbXBoIDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPlNwZWVkPC9zcGFuPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtbWQtNCc+PHN0cm9uZz5cIiArIGRhdGEuRVRBICsgXCI8L3N0cm9uZz4gTWlucyA8c3BhbiBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5DdW11bGF0aXZlIElkbGUgTWludXRlczwvc3Bhbj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyB0aGF0LmNvbnZlcnRNaWxlc1RvRmVldChkYXRhLkRpc3RhbmNlKSArIFwiPC9zdHJvbmc+IEZ0IDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkZlZXQgdG8gSm9iIFNpdGU8L3NwYW4+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+IDxoci8+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncG9wTW9kYWxGb290ZXInPjxkaXYgY2xhc3M9J3Jvdyc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtY29tbWVudGluZyc+PC9pPjxzcGFuIGNsYXNzPSdzbXMnIHRpdGxlPSdDbGljayB0byBzZW5kIFNNUycgPlNNUzwvcD48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wgY29sLW1kLTQnPjxpIGNsYXNzPSdmYSBmYS1lbnZlbG9wZScgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48c3BhbiBjbGFzcz0nZW1haWwnIHRpdGxlPSdDbGljayB0byBzZW5kIGVtYWlsJyA+RW1haWw8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtZXllJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxzcGFuIGNsYXNzPSd3YXRjaGxpc3QnIHRpdGxlPSdDbGljayB0byBhZGQgaW4gd2F0Y2hsaXN0JyA+V2F0Y2g8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+IDwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmZvYm94RGF0YSA9IFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0ncGFkZGluZy10b3A6MTBweDttYXJnaW46IDBweDsnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC0zJz48ZGl2IHN0eWxlPSdwYWRkaW5nLXRvcDoxNXB4OycgPjxpbWcgc3JjPSdcIiArIGRhdGEuaWNvbkluZm8gKyBcIicgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrO21hcmdpbjogMCBhdXRvOycgPjwvZGl2PjwvZGl2PlwiICtcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J2NvbC1tZC05Jz5cIiArXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cgJz5cIiArXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtOCcgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5WZWhpY2xlIE51bWJlcjwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLnNiY1ZpbiArIFwiPC9kaXY+XCIgK1xuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTQnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxhIGNsYXNzPSdkZXRhaWxzJyBzdHlsZT0nY29sb3I6IzAwOUZEQjtjdXJzb3I6IHBvaW50ZXI7JyAgdGl0bGU9J0NsaWNrIGhlcmUgdG8gc2VlIHRlY2huaWNpYW4gZGV0YWlscycgPlZpZXcgRGV0YWlsczwvYT48aSBjbGFzcz0nZmEgZmEtdGltZXMnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweDtjdXJzb3I6IHBvaW50ZXI7JyBhcmlhLWhpZGRlbj0ndHJ1ZScgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+PC9pPjwvZGl2PlwiICtcbiAgICAgICAgICBcIjwvZGl2PlwiICtcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J3Jvdyc+PGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPlZUUyBVbml0IElEPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEudHJ1Y2tJZCArIFwiPC9kaXY+PC9kaXY+XCIgK1xuICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncm93Jz48ZGl2IGNsYXNzPSdjb2wtbWQtNScgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5Kb2IgVHlwZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmpvYlR5cGUgKyBcIjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC03JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnID5Kb2IgSWQ8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgam9iSWQgKyBcIjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyByZWFzb24gKyBcIjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4Oyc+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5BVFRVSUQ8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5BVFRVSUQgKyBcIjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkO21hcmdpbi1sZWZ0OjhweDsnPlRlY2huaWNpYW4gTmFtZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLnRlY2huaWNpYW5OYW1lICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnID5cIlxuICAgICAgICAgICsgXCI8ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+Q3VzdG9tZXIgTmFtZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmN1c3RvbWVyTmFtZSArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7JyA+XCJcbiAgICAgICAgICArIFwiPGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkRpc3BhdGNoIFRpbWU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5kaXNwYXRjaFRpbWUgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4OycgPlwiXG4gICAgICAgICAgKyBcIjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5Kb2IgQWRkcmVzczwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLndvcmtBZGRyZXNzICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8aHIgc3R5bGU9J21hcmdpbi10b3A6MXB4OyBtYXJnaW4tYm90dG9tOjVweDsnIC8+XCJcblxuICAgICAgICAgICsgXCI8ZGl2IHN0eWxlPSdtYXJnaW4tbGVmdDogMTBweDsnPiA8ZGl2IGNsYXNzPSdyb3cnPiA8ZGl2IGNsYXNzPSdzcGVlZCBjb2wtbWQtMyc+IDxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi1sZWZ0OiAxcHgnPjxwIHN0eWxlPSdmb250LXdlaWdodDogYm9sZGVyO2ZvbnQtc2l6ZTogMjNweDttYXJnaW46IDBweDsnPlwiICsgZGF0YS5TcGVlZCArIFwiPC9wPjxwIHN0eWxlPSdtYXJnaW46IDEwcHggMTBweDsnPm1waDwvcD48L2Rpdj48cCBzdHlsZT0nbWFyZ2luOjBweCcgY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+U3BlZWQ8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naWRsZSBjb2wtbWQtNSc+PGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHgnPjxwIHN0eWxlPSdmb250LXdlaWdodDogYm9sZGVyO2ZvbnQtc2l6ZTogMjNweDttYXJnaW46IDBweDsnPlwiICsgZGF0YS5FVEEgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5NaW5zPC9wPjwvZGl2PjxwIHN0eWxlPSdtYXJnaW46MHB4JyBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5DdW11bGF0aXZlIElkbGUgTWludXRlczwvcD48L2Rpdj4gPGRpdiBjbGFzcz0nbWlsZXMgY29sLW1kLTQnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIHRoYXQuY29udmVydE1pbGVzVG9GZWV0KGRhdGEuRGlzdGFuY2UpICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+RnQ8L3A+PC9kaXY+PHAgc3R5bGU9J21hcmdpbjowcHgnIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkZlZXQgdG8gSm9iIFNpdGU8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+PC9kaXY+PGhyIHN0eWxlPSdtYXJnaW4tdG9wOjFweDsgbWFyZ2luLWJvdHRvbTo1cHg7JyAvPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+IDxkaXYgY2xhc3M9J2NvbC1tZC0xJz48L2Rpdj48ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnIHN0eWxlPSdcIiArIGNsYXNzTmFtZSArIFwiJz4gPGkgY2xhc3M9J2ZhIGZhLWNvbW1lbnRpbmcgY29sLW1kLTInPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgc21zJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBTTVMnID5TTVM8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zIG9mZnNldC1tZC0xJyBzdHlsZT0nXCIgKyBjbGFzc05hbWUgKyBcIic+IDxpIGNsYXNzPSdmYSBmYS1lbnZlbG9wZSBjb2wtbWQtMicgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgZW1haWwnIHRpdGxlPSdDbGljayB0byBzZW5kIGVtYWlsJyA+RW1haWw8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zJz48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnIHN0eWxlPSdcIiArIHN0eWxlTGVmdCArIFwiJz48aSBjbGFzcz0nZmEgZmEtZXllIGNvbC1tZC0yJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxwIGNsYXNzPSdjb2wtbWQtNiB3YXRjaGxpc3QnIHRpdGxlPSdDbGljayB0byBhZGQgaW4gd2F0Y2hsaXN0JyA+V2F0Y2g8L3A+PC9kaXY+IDwvZGl2PlwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW5mb2JveERhdGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmlld1RydWNrRGV0YWlscyhlKSB7XG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdmYSBmYS10aW1lcycpIHtcbiAgICAgICAgdGhhdC5pbmZvYm94LnNldE9wdGlvbnMoe1xuICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnZGV0YWlscycpIHtcbiAgICAgICAgLy90aGF0LnJvdXRlci5uYXZpZ2F0ZShbJy90ZWNobmljaWFuLWRldGFpbHMnXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2NvbC1tZC02IHNtcycpIHtcbiAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcbiAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoYXQubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGF0LnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXG4gICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XG5cbiAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhblBob25lID0gdGVjaG5pY2lhbkRldGFpbHMucGhvbmU7XG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbFNNUycpLm1vZGFsKCdzaG93Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2NvbC1tZC02IGVtYWlsJykge1xuICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xuICAgICAgICBzZWxlY3RlZFRydWNrID0gdGhhdC5tYXBTZXJ2aWNlLnJldHJpZXZlRGF0YUZyb21TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycpO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcbiAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoYXQucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcbiAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcblxuICAgICAgICAgIGlmICh0ZWNobmljaWFuRGV0YWlscyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbk5hbWUgPSB0ZWNobmljaWFuRGV0YWlscy5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBqUXVlcnkoJyNteU1vZGFsRW1haWwnKS5tb2RhbCgnc2hvdycpO1xuICAgICAgfVxuICAgICBcbiAgICB9XG4gIH1cblxuICBsb2FkRGlyZWN0aW9ucyh0aGF0LCBzdGFydExvYywgZW5kTG9jLCBpbmRleCwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCkge1xuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMnLCAoKSA9PiB7XG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuRGlyZWN0aW9uc01hbmFnZXIodGhhdC5tYXApO1xuICAgICAgLy8gU2V0IFJvdXRlIE1vZGUgdG8gZHJpdmluZ1xuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5zZXRSZXF1ZXN0T3B0aW9ucyh7XG4gICAgICAgIHJvdXRlTW9kZTogTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5Sb3V0ZU1vZGUuZHJpdmluZ1xuICAgICAgfSk7XG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLnNldFJlbmRlck9wdGlvbnMoe1xuICAgICAgICBkcml2aW5nUG9seWxpbmVPcHRpb25zOiB7XG4gICAgICAgICAgc3Ryb2tlQ29sb3I6ICdncmVlbicsXG4gICAgICAgICAgc3Ryb2tlVGhpY2tuZXNzOiAzLFxuICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UgfSxcbiAgICAgICAgdmlhcG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiBmYWxzZSB9LFxuICAgICAgICBhdXRvVXBkYXRlTWFwVmlldzogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB3YXlwb2ludDEgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5XYXlwb2ludCh7XG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oc3RhcnRMb2MubGF0aXR1ZGUsIHN0YXJ0TG9jLmxvbmdpdHVkZSksIGljb246ICcnXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHdheXBvaW50MiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLldheXBvaW50KHtcbiAgICAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihlbmRMb2MubGF0aXR1ZGUsIGVuZExvYy5sb25naXR1ZGUpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuYWRkV2F5cG9pbnQod2F5cG9pbnQxKTtcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuYWRkV2F5cG9pbnQod2F5cG9pbnQyKTtcblxuICAgICAgLy8gQWRkIGV2ZW50IGhhbmRsZXIgdG8gZGlyZWN0aW9ucyBtYW5hZ2VyLlxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5kaXJlY3Rpb25zTWFuYWdlciwgJ2RpcmVjdGlvbnNVcGRhdGVkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB2YXIgcm91dGVJbmRleCA9IGUucm91dGVbMF0ucm91dGVMZWdzWzBdLm9yaWdpbmFsUm91dGVJbmRleDtcbiAgICAgICAgdmFyIG5leHRJbmRleCA9IHJvdXRlSW5kZXg7XG4gICAgICAgIGlmIChlLnJvdXRlWzBdLnJvdXRlUGF0aC5sZW5ndGggPiByb3V0ZUluZGV4KSB7XG4gICAgICAgICAgbmV4dEluZGV4ID0gcm91dGVJbmRleCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5leHRMb2NhdGlvbiA9IGUucm91dGVbMF0ucm91dGVQYXRoW25leHRJbmRleF07XG4gICAgICAgIHZhciBwaW4gPSB0aGF0Lm1hcC5lbnRpdGllcy5nZXQoaW5kZXgpO1xuICAgICAgICAvLyB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhzdGFydExvYyxuZXh0TG9jYXRpb24pO1xuICAgICAgICB0aGF0Lk1vdmVQaW5PbkRpcmVjdGlvbih0aGF0LCBlLnJvdXRlWzBdLnJvdXRlUGF0aCwgcGluLCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLmNhbGN1bGF0ZURpcmVjdGlvbnMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIE1vdmVQaW5PbkRpcmVjdGlvbih0aGF0LCByb3V0ZVBhdGgsIHBpbiwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCkge1xuICAgIHRoYXQgPSB0aGlzO1xuICAgIHZhciBpc0dlb2Rlc2ljID0gZmFsc2U7XG4gICAgdGhhdC5jdXJyZW50QW5pbWF0aW9uID0gbmV3IEJpbmcuTWFwcy5BbmltYXRpb25zLlBhdGhBbmltYXRpb24ocm91dGVQYXRoLCBmdW5jdGlvbiAoY29vcmQsIGlkeCwgZnJhbWVJZHgsIHJvdGF0aW9uQW5nbGUsIGxvY2F0aW9ucywgdHJ1Y2tJZFJhbklkKSB7XG5cbiAgICAgIGlmICh0aGF0LmFuaW1hdGlvblRydWNrTGlzdC5sZW5ndGggPiAwICYmIHRoYXQuYW5pbWF0aW9uVHJ1Y2tMaXN0LnNvbWUoeCA9PiB4ID09IHRydWNrSWRSYW5JZCkpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gKGZyYW1lSWR4ID09IGxvY2F0aW9ucy5sZW5ndGggLSAxKSA/IGZyYW1lSWR4IDogZnJhbWVJZHggKyAxO1xuICAgICAgICB2YXIgcm90YXRpb25BbmdsZSA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhjb29yZCwgbG9jYXRpb25zW2luZGV4XSk7XG4gICAgICAgIGlmICh0aGF0LmlzT2RkKGZyYW1lSWR4KSkge1xuICAgICAgICAgIHRoYXQuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwaW4sIHRydWNrVXJsLCByb3RhdGlvbkFuZ2xlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmcmFtZUlkeCA9PSBsb2NhdGlvbnMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIHRoYXQuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwaW4sIHRydWNrVXJsLCByb3RhdGlvbkFuZ2xlKTtcbiAgICAgICAgfVxuICAgICAgICBwaW4uc2V0TG9jYXRpb24oY29vcmQpO1xuICAgICAgfVxuXG4gICAgfSwgaXNHZW9kZXNpYywgdGhhdC50cmF2YWxEdXJhdGlvbiwgdHJ1Y2tJZFJhbklkKTtcblxuICAgIHRoYXQuY3VycmVudEFuaW1hdGlvbi5wbGF5KCk7XG4gIH1cblxuICBDYWxjdWxhdGVOZXh0Q29vcmQoc3RhcnRMb2NhdGlvbiwgZW5kTG9jYXRpb24pIHtcbiAgICB0cnkge1xuXG4gICAgICB2YXIgZGxhdCA9IChlbmRMb2NhdGlvbi5sYXRpdHVkZSAtIHN0YXJ0TG9jYXRpb24ubGF0aXR1ZGUpO1xuICAgICAgdmFyIGRsb24gPSAoZW5kTG9jYXRpb24ubG9uZ2l0dWRlIC0gc3RhcnRMb2NhdGlvbi5sb25naXR1ZGUpO1xuICAgICAgdmFyIGFscGhhID0gTWF0aC5hdGFuMihkbGF0ICogTWF0aC5QSSAvIDE4MCwgZGxvbiAqIE1hdGguUEkgLyAxODApO1xuICAgICAgdmFyIGR4ID0gMC4wMDAxNTIzODc5NDcyNzkwOTkzMTtcbiAgICAgIGRsYXQgPSBkeCAqIE1hdGguc2luKGFscGhhKTtcbiAgICAgIGRsb24gPSBkeCAqIE1hdGguY29zKGFscGhhKTtcbiAgICAgIHZhciBuZXh0Q29vcmQgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oc3RhcnRMb2NhdGlvbi5sYXRpdHVkZSArIGRsYXQsIHN0YXJ0TG9jYXRpb24ubG9uZ2l0dWRlICsgZGxvbik7XG5cbiAgICAgIGRsYXQgPSBudWxsO1xuICAgICAgZGxvbiA9IG51bGw7XG4gICAgICBhbHBoYSA9IG51bGw7XG4gICAgICBkeCA9IG51bGw7XG5cbiAgICAgIHJldHVybiBuZXh0Q29vcmQ7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBpbiBDYWxjdWxhdGVOZXh0Q29vcmQgLSAnICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGlzT2RkKG51bSkge1xuICAgIHJldHVybiBudW0gJSAyO1xuICB9XG5cbiAgZGVnVG9SYWQoeCkge1xuICAgIHJldHVybiB4ICogTWF0aC5QSSAvIDE4MDtcbiAgfVxuXG4gIHJhZFRvRGVnKHgpIHtcbiAgICByZXR1cm4geCAqIDE4MCAvIE1hdGguUEk7XG4gIH1cblxuICBjYWxjdWxhdGVCZWFyaW5nKG9yaWdpbiwgZGVzdCkge1xuICAgIC8vLyA8c3VtbWFyeT5DYWxjdWxhdGVzIHRoZSBiZWFyaW5nIGJldHdlZW4gdHdvIGxvYWNhdGlvbnMuPC9zdW1tYXJ5PlxuICAgIC8vLyA8cGFyYW0gbmFtZT1cIm9yaWdpblwiIHR5cGU9XCJNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvblwiPkluaXRpYWwgbG9jYXRpb24uPC9wYXJhbT5cbiAgICAvLy8gPHBhcmFtIG5hbWU9XCJkZXN0XCIgdHlwZT1cIk1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uXCI+U2Vjb25kIGxvY2F0aW9uLjwvcGFyYW0+XG4gICAgdHJ5IHtcbiAgICAgIHZhciBsYXQxID0gdGhpcy5kZWdUb1JhZChvcmlnaW4ubGF0aXR1ZGUpO1xuICAgICAgdmFyIGxvbjEgPSBvcmlnaW4ubG9uZ2l0dWRlO1xuICAgICAgdmFyIGxhdDIgPSB0aGlzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpO1xuICAgICAgdmFyIGxvbjIgPSBkZXN0LmxvbmdpdHVkZTtcbiAgICAgIHZhciBkTG9uID0gdGhpcy5kZWdUb1JhZChsb24yIC0gbG9uMSk7XG4gICAgICB2YXIgeSA9IE1hdGguc2luKGRMb24pICogTWF0aC5jb3MobGF0Mik7XG4gICAgICB2YXIgeCA9IE1hdGguY29zKGxhdDEpICogTWF0aC5zaW4obGF0MikgLSBNYXRoLnNpbihsYXQxKSAqIE1hdGguY29zKGxhdDIpICogTWF0aC5jb3MoZExvbik7XG5cbiAgICAgIGxhdDEgPSBsYXQyID0gbG9uMSA9IGxvbjIgPSBkTG9uID0gbnVsbDtcblxuICAgICAgcmV0dXJuICh0aGlzLnJhZFRvRGVnKE1hdGguYXRhbjIoeSwgeCkpICsgMzYwKSAlIDM2MDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIGNhbGN1bGF0ZUJlYXJpbmcgLSAnICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIFNlbmRTTVMoZm9ybSkge1xuICAgIC8vIGlmKHRoaXMudGVjaG5pY2lhblBob25lICE9ICcnKXtcbiAgICBpZiAoZm9ybS52YWx1ZS5tb2JpbGVObyAhPSAnJykge1xuICAgICAgaWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZSB3YW50IHRvIHNlbmQgU01TPycpKSB7XG4gICAgICAgIC8vIHRoaXMubWFwU2VydmljZS5zZW5kU01TKHRoaXMudGVjaG5pY2lhblBob25lLGZvcm0udmFsdWUuc21zTWVzc2FnZSk7XG4gICAgICAgIHRoaXMubWFwU2VydmljZS5zZW5kU01TKGZvcm0udmFsdWUubW9iaWxlTm8sIGZvcm0udmFsdWUuc21zTWVzc2FnZSk7XG5cbiAgICAgICAgZm9ybS5jb250cm9scy5zbXNNZXNzYWdlLnJlc2V0KClcbiAgICAgICAgZm9ybS52YWx1ZS5tb2JpbGVObyA9IHRoaXMudGVjaG5pY2lhblBob25lO1xuICAgICAgICBqUXVlcnkoJyNteU1vZGFsU01TJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgLy90aGlzLnRvYXN0ci5zdWNjZXNzKCdTTVMgc2VudCBzdWNjZXNzZnVsbHknLCAnU3VjY2VzcycpO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgU2VuZEVtYWlsKGZvcm0pIHtcbiAgICAvLyBpZih0aGlzLnRlY2huaWNpYW5FbWFpbCAhPSAnJyl7XG4gICAgaWYgKGZvcm0udmFsdWUuZW1haWxJZCAhPSAnJykge1xuICAgICAgaWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZSB3YW50IHRvIHNlbmQgRW1haWw/JykpIHtcblxuICAgICAgICAvLyB0aGlzLnVzZXJQcm9maWxlU2VydmljZS5nZXRVc2VyRGF0YSh0aGlzLmNvb2tpZUFUVFVJRClcbiAgICAgICAgLy8gICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgIC8vICAgICB2YXIgbmV3RGF0YTogYW55ID0gdGhpcy5zdHJpbmdpZnlKc29uKGRhdGEpO1xuICAgICAgICAvLyAgICAgLy90aGlzLm1hcFNlcnZpY2Uuc2VuZEVtYWlsKG5ld0RhdGEuZW1haWwsdGhpcy50ZWNobmljaWFuRW1haWwsbmV3RGF0YS5sYXN0TmFtZSArICcgJyArIG5ld0RhdGEuZmlyc3ROYW1lLCB0aGlzLnRlY2huaWNpYW5OYW1lLCBmb3JtLnZhbHVlLmVtYWlsU3ViamVjdCxmb3JtLnZhbHVlLmVtYWlsTWVzc2FnZSk7XG4gICAgICAgIC8vICAgICB0aGlzLm1hcFNlcnZpY2Uuc2VuZEVtYWlsKG5ld0RhdGEuZW1haWwsIGZvcm0udmFsdWUuZW1haWxJZCwgbmV3RGF0YS5sYXN0TmFtZSArICcgJyArIG5ld0RhdGEuZmlyc3ROYW1lLCB0aGlzLnRlY2huaWNpYW5OYW1lLCBmb3JtLnZhbHVlLmVtYWlsU3ViamVjdCwgZm9ybS52YWx1ZS5lbWFpbE1lc3NhZ2UpO1xuICAgICAgICAvLyAgICAgdGhpcy50b2FzdHIuc3VjY2VzcyhcIkVtYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5XCIsICdTdWNjZXNzJyk7XG5cbiAgICAgICAgLy8gICAgIGZvcm0uY29udHJvbHMuZW1haWxTdWJqZWN0LnJlc2V0KClcbiAgICAgICAgLy8gICAgIGZvcm0uY29udHJvbHMuZW1haWxNZXNzYWdlLnJlc2V0KClcbiAgICAgICAgLy8gICAgIGZvcm0udmFsdWUuZW1haWxJZCA9IHRoaXMudGVjaG5pY2lhbkVtYWlsO1xuICAgICAgICAvLyAgICAgalF1ZXJ5KCcjbXlNb2RhbEVtYWlsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgLy8gICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBTZWFyY2hUcnVjayhmb3JtKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICAvLyQoJyNsb2FkaW5nJykuc2hvdygpO1xuXG4gICAgaWYgKGZvcm0udmFsdWUuaW5wdXRtaWxlcyAhPSAnJyAmJiBmb3JtLnZhbHVlLmlucHV0bWlsZXMgIT0gbnVsbCkge1xuICAgICAgY29uc3QgbHQgPSB0aGF0LmNsaWNrZWRMYXQ7XG4gICAgICBjb25zdCBsZyA9IHRoYXQuY2xpY2tlZExvbmc7XG4gICAgICBjb25zdCByZCA9IGZvcm0udmFsdWUuaW5wdXRtaWxlcztcblxuICAgICAgdGhpcy5mb3VuZFRydWNrID0gZmFsc2U7XG4gICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdCA9IFtdO1xuXG4gICAgICBpZiAodGhpcy5jb25uZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9hZE1hcFZpZXcoJ3JvYWQnKTtcblxuICAgICAgdGhhdC5Mb2FkVHJ1Y2tzKHRoaXMubWFwLCBsdCwgbGcsIHJkLCB0cnVlKTtcblxuICAgICAgZm9ybS5jb250cm9scy5pbnB1dG1pbGVzLnJlc2V0KCk7XG4gICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgfSwgMTAwMDApO1xuICAgIH1cbiAgfVxuXG5cblxuICBnZXRNaWxlcyhpKSB7XG4gICAgcmV0dXJuIGkgKiAwLjAwMDYyMTM3MTE5MjtcbiAgfVxuXG4gIGdldE1ldGVycyhpKSB7XG4gICAgcmV0dXJuIGkgKiAxNjA5LjM0NDtcbiAgfVxuXG4gIHN0cmluZ2lmeUpzb24oZGF0YSkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgfVxuICBwYXJzZVRvSnNvbihkYXRhKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gIH1cblxuICBSb3VuZChudW1iZXIsIHByZWNpc2lvbikge1xuICAgIHZhciBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKTtcbiAgICB2YXIgdGVtcE51bWJlciA9IG51bWJlciAqIGZhY3RvcjtcbiAgICB2YXIgcm91bmRlZFRlbXBOdW1iZXIgPSBNYXRoLnJvdW5kKHRlbXBOdW1iZXIpO1xuICAgIHJldHVybiByb3VuZGVkVGVtcE51bWJlciAvIGZhY3RvcjtcbiAgfVxuXG4gIGdldEF0YW4yKHksIHgpIHtcbiAgICByZXR1cm4gTWF0aC5hdGFuMih5LCB4KTtcbiAgfTtcblxuICBnZXRJY29uVXJsKGNvbG9yOiBzdHJpbmcsIHNvdXJjZUxhdDogbnVtYmVyLCBzb3VyY2VMb25nOiBudW1iZXIsIGRlc3RpbmF0aW9uTGF0OiBudW1iZXIsIGRlc3RpbmF0aW9uTG9uZzogbnVtYmVyKSB7XG4gICAgdmFyIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEzWkpSRUZVYUlIdGwxMUlVMkVZeC85dnVWcVFheGVCNnd2MEtzY0lGNEcwYnBvYVpuV3poVnBkVkVwMUVScm1wQ2h2TWdqckloVDZvS0JaNkVYVUF1ZU5hRkgwUVRTeHlBV1ZYUlF1UDFBdnN1M001bkhhbmk3Y2x1blp4OWxtQ0w2L3EzUE84L0tjLy85NXZ3RU9oOFBoY0RnY0RvZXpWR0dwU0VKRWFnQlZxY2dsZ1lzeDFod3BtSlpzZGlKU0J5andZY3ozYysyd1o4U2ZiTDY1YkZtdlV4T1JrVEZXTGhXWDNRUEJhdThFb0E5KzBrOU1pZnUyWGQycEVFUWhDYW5TV1BJcVlURldBRUFXWTh3MU55NnJCNGlvYWpydysxTGFzdVdyKzM3MGo0OVBlcWN6VkJsSzE5aDN0aERpQWNEaDZnWlFBUUNaQUJJM1FFVDNBSlJkZTNVYlZrY0xCRkZZRGN4VWFFZG1ib3JreWljdUF5SHhsclphMkhyc0N5eEpIc3RpTlZqTTRvRVlCaGE3ZUNDS0FTSXlZcEdMQjZMTWdjbHAvNW5YMzk1TTJYcnNpdjhwU0M0UkRheE1XN0czdmZkSlhFblNsZWtwRXpTWE5VcFYxSGpVVldqQVBSVHpCNExvaFU2VGpSSzlLYTcyY2luT01ZVWVuVkx4cEk4U3RoNDdTdlVtTkpvdko1c3FHdFdNTWJkVUlHa0RnaWlnOEpZWmhxelViMmFsZWpOSzlDWWdRdldCSkF6b05GcDhHdWtOdnp2NnVoTk5OUzlYQ0VNY083d3NBeXFsQ2cybWVoUnBDOExmR3A3ZlFNT0xtM0xTaERtMi9RaHE4aXFoQ2k0Q0RsYzNMUFphV1hOSmxvR21ROWV4U2IwUnh4K2Nna2NVb05Ob1VXT3N3SnBWS2x6b2tEY0hqaHVPb3E3b0hKcTZXdEQ1NVJrQW9NWllDVnQ1TTNiZjJvOTRENGNSRFlqVDRxaE9vODBJRFkwaTdTNFlNbk5oYU53VnJwQ2pyeHVEN2lGWUQxNkgxZEVpcTNJV1l3VWVPZHYrTVY3Y2R3UmQxYzlRdXRVTXE2TVpPZXQwVXdBVWtEaUZ4alNnVEZQZVBwdGZWZXVaOENnRzNFTW8zSnlQTHRmYmVTSTdlNThDQUFxekN5VEhzUlE2alJZcVpUcHN6dms3dk0xcHgrN3NmQkFSQ2pZYkZRQmVTdDBEWWhwZ2pOVVJrYnJSZkRsOFZSenhqdm9CckpqZFRoWGNhQzd1T1IrWCtObEliVktiMUJ0bWVucG1BcjhFWUpyWGFMYk9lSDVFUkhyTVhDanNkWjFYWUhYOHZhSTJtT3BSdXRVTUFHWUFrbXUxRk9PVHZnT0Q3c0VUKys4ZVhoNGE3enFORm85UHRvYUZSMXI3RTRhSXlvaUlQZzczMHAwM3pkVC9jNUNDbENXUVN5MkkzcS9DaEJCNCtMNlZPajQvSlNLaVFDRGdDUlpzWVNBaW96ZzEyZjdqMTVqVDU1KzRIenkxSnBwTFRVU25QYUwzbmMvdjZ5S2l1dUNkbThQaGNEaWNwY0VmazNlQUxiYzErVlFBQUFBQVNVVk9SSzVDWUlJPVwiO1xuXG4gICAgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJncmVlblwiKSB7XG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBM1pKUkVGVWFJSHRsMTFJVTJFWXgvOXZ1VnFRYXhlQjZ3djBLc2NJRjRHMGJwb2Fabld6aFZwZFZFcDFFUnJtcENodk1nanJJaFQ2b0tCWjZFWFVBdWVOYUZIMFFUU3h5QVdWWFJRdVAxQXZzdTNNNW5IYW5pN2NsdW5aeDlsbUNMNi9xM1BPOC9LYy8vOTV2d0VPaDhQaGNEZ2NEb2V6VkdHcFNFSkVhZ0JWcWNnbGdZc3gxaHdwbUpac2RpSlNCeWp3WWN6M2MrMndaOFNmYkw2NWJGbXZVeE9Sa1RGV0xoV1gzUVBCYXU4RW9BOSswazlNaWZ1MlhkMnBFRVFoQ2FuU1dQSXFZVEZXQUVBV1k4dzFOeTZyQjRpb2FqcncrMUxhc3VXciszNzBqNDlQZXFjelZCbEsxOWgzdGhEaUFjRGg2Z1pRQVFDWkFCSTNRRVQzQUpSZGUzVWJWa2NMQkZGWURjeFVhRWRtYm9ya3lpY3VBeUh4bHJaYTJIcnNDeXhKSHN0aU5Wak00b0VZQmhhN2VDQ0tBU0l5WXBHTEI2TE1nY2xwLzVuWDM5NU0yWHJzaXY4cFNDNFJEYXhNVzdHM3ZmZEpYRW5TbGVrcEV6U1hOVXBWMUhqVVZXakFQUlR6QjRMb2hVNlRqUks5S2E3MmNpbk9NWVVlblZMeHBJOFN0aDQ3U3ZVbU5Kb3ZKNXNxR3RXTU1iZFVJR2tEZ2lpZzhKWVpocXpVYjJhbGVqTks5Q1lnUXZXQkpBem9ORnA4R3VrTnZ6djZ1aE5OTlM5WENFTWNPN3dzQXlxbENnMm1laFJwQzhMZkdwN2ZRTU9MbTNMU2hEbTIvUWhxOGlxaENpNENEbGMzTFBaYVdYTkpsb0dtUTlleFNiMFJ4eCtjZ2tjVW9OTm9VV09zd0pwVktsem9rRGNIamh1T29xN29ISnE2V3RENTVSa0FvTVpZQ1Z0NU0zYmYybzk0RDRjUkRZalQ0cWhPbzgwSURZMGk3UzRZTW5OaGFOd1ZycENqcnh1RDdpRllEMTZIMWRFaXEzSVdZd1VlT2R2K01WN2Nkd1JkMWM5UXV0VU1xNk1aT2V0MFV3QVVrRGlGeGpTZ1RGUGVQcHRmVmV1WjhDZ0czRU1vM0p5UEx0ZmJlU0k3ZTU4Q0FBcXpDeVRIc1JRNmpSWXFaVHBzenZrN3ZNMXB4KzdzZkJBUkNqWWJGUUJlU3QwRFlocGdqTlVSa2JyUmZEbDhWUnp4anZvQnJKamRUaFhjYUM3dU9SK1grTmxJYlZLYjFCdG1lbnBtQXI4RVlKclhhTGJPZUg1RVJIck1YQ2pzZFoxWFlIWDh2YUkybU9wUnV0VU1BR1lBa211MUZPT1R2Z09EN3NFVCsrOGVYaDRhN3pxTkZvOVB0b2FGUjFyN0U0YUl5b2lJUGc3MzBwMDN6ZFQvYzVDQ2xDV1FTeTJJM3EvQ2hCQjQrTDZWT2o0L0pTS2lRQ0RnQ1Jac1lTQWlvemcxMmY3ajE1alQ1NSs0SHp5MUpwcExUVVNuUGFMM25jL3Y2eUtpdXVDZG04UGhjRGljcGNFZmszZUFMYmMxK1ZRQUFBQUFTVVZPUks1Q1lJST1cIjtcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJyZWRcIikge1xuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQTB4SlJFRlVhSUh0bHoxc0VtRWN4cDlYaEJRRGhSQS9NQ1NOVFV5OHRFc1hYRXNnY2RBQnFvT1RwQTR1a0tBT3hzWXVEa0owcmRIbzFKUW1iZ1ljWFB4S25EVGdVQWR0bXpTeElVQ0tSQ3dlb1FWNjkzZUF1Mmg3QlE1YTA4VDNOeDMzUDU1N252ZnIzaGZnY0RnY0RvZkQ0WEE0L3l0c0wwU0l5QTdnK2w1b2FiREtHSnZiclhpNFgzVWlza09XUDIvOS9IbTBYaWpVKzlYYnpwR1JFVHNSZVJoalY3WHF1bnVnMWRyakFNWmF0OGJremMwTFh6d2VveVNLZlZqVnhoa093eGtLQWNBd1kyeDFlMTFYRHhEUmRaS2tlOHhnc05ReW1ZcFVxV3laamg4ZnFHVXliRC9NQTBBbG5WWXVUd0hvUFFBUnpRS1lMRHg5aW1JOERra1VMVUN6aFN4dTkxNTQ3WW11QWlqbU05UFRLQ1dUKzJ4Skg0YzZQWENRelFNZEFoeDA4MENiQUVUa3dRRTNEN1NaQTFTdjN4SS9mR2lVa2tuanZ6U2tsMTBETUpQcC9QcXJWMTJKR0t6V1BUT2tWN3Z0S2xUUDV6dStRQkpGbUFVQkRyKy9xK2YxNHZEN2xjc0ZyWHJmVzRsU0lnRkhJSUNoV0t4ZnFYYmNaSXl0YXhYNkRpQ0pJcFl2WG9UbDdObCtwWGJnQ0FTVUh0QnNmYUNQQUdaQndNYlNrdnE3a2tyMUtyVkRTNkdiTDd5dUFBYXJGVVBSS0d3K24zcHY3ZEVqckQxK3JFZEc1ZGlWSzNDR3crcEVyYVRUeUV4UG81N0xkYTJoSzhEd3c0Y3d1Vno0Rm9tb2s5Y1pDc0V3T0lqYy9mdjZ6QWVEY04yK2plTDhQTXJ2M2dFQW5LRVFUcy9PWXZuU0pYUzdPZHcxZ0x5NVdUQUx3Z2xsYU5oOFBsamNibnc5ZDA1dG9Vb3FoWG91aCtHWkdSVG41M1cxbkRNVVF1bkZpNytDcjZSU0dIbjlHbzZKQ1JUamNSd1pIVzBBTUVKakY5b3h3S0dCZ1Njbkk1RTdVcmxzck9menNIbTlxS1RUTzB5VzM3NXRCdlI2TmNleEZtWkJnTUZxMWZ6Q2w1SkoyTHhlZ0FpRDQrTkdBTysxemdFZEF6REc3aEtSZlNnV1U0K0tqZWFKeS9UbmM4cjRkVTFOZFdWZTY3OS9Zbks1WUhHN2xRbjhIa0NnblVaWEp6SWlHa1B6UUpISVBYaUFZanl1MW9haVVUZ0NBUUNZQUtDNVZtc2hWNnVYYTluc3RaVmcwS0NNZDdNZzRNeno1NnJ4M2RiK25pR2lTU0tpNnVJaWZaK2JvMW8yU3kwbWU5Q3lTNks0c3ZYcmwvd2prYUQxTjIrYVNySmNialhZL2tCRUhybFdlOWtvbFJha2pZMW5yVjFycjFwMklyb2hpZUtucldyMUl4SGRiWjI1T1J3T2g4UDVQL2dOcWh4LzZyc3VqamdBQUFBQVNVVk9SSzVDWUlJPVwiO1xuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcInllbGxvd1wiKSB7XG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBeWhKUkVGVWFJSHRsejFNVTFFWWh0L3ZZaFdOYVp0Z2hBR05tSUNKVm1Gd01DRlJIRXdFRThWSm5NUkJuUlFkeWdBT0Rycm9ZQ0lMdUJnV1lkUEV5R1JpeEJRY0hDRCtES2hBV2lNNDFIZ0psSi9ibnRlaHQvV250eiszQlVQQ2VhYmUrNTI4ZmIvdm5Idk9kd0NOUnFQUmFEUWFqVWF6VVpIVkVDSHBCOUN4R2xvT1RJdElmN2JncGxMVlNmcEJOUTdyeHc0c2Zsc3BWUzhEM3lFL3lTWVJ1ZWdVZGowRGRyV1BBV2l3WHpVZ3NYZ3E4ZUtnQjVaWmdsTm5wSzRUUmwwUUFHcEVaUHJmdUtzWklOa0J4bTlETm0xSGJISWUxbndjNVZYbFhKaVV0VEFQQUlpR0FBUUJZQStBNGhNZytRaEF1L3AwSDV6cUF5eHpPNUNza0ZRMHJwSmI5eFNVUU1vOHg2K0JrWUUxdHVRT0k5K0FQODJyZFdZZXlKUEFlamNQNUVpQVpCUFd1WGtnMXplUVdBNHlPbXlweUlEblAvcHhUZllFeXJhMFlPWlpZU29lN3lyWmNkTDI1UXpuM0lVWUMrZlZsN2dKOFFZZ3U5cUFBc2E3UmFyUHBYNk9PY1ZMYmlWVVpCQkc5WGtZOVQybFN1WGlob2o4ZEFxVW5BQXNFMnE0YVUwT002bHVTODVzbHVvREpTUWczZ0E0OXo3OXpHaW9XS2tNclRRVmpYbWJOWGNKZUh3dzZoOUFxbHJTcnpoeEYycmluaXVaRkViTlpVaGRaL3BEWlRRRWpsOHI2TnRMNFNvQjQzQS9aTnR1cUxjWEFNdUUrQUtRMms2SXh3OSs2SFpuZnU4VnlQN2JVRk1QZ2RraEFIYm5lZVFwRXErUG85RG1NUHRKbkZqNkxyNUErbEdxV2lBVmpWQ2pyZURzRUJnTlFVMzJRWTFmVFZaeTIyNVhDVWh0RUl3TWdoKzZrNVdQaHFCR3p3QUNHTWwxRC9FM1dQYndqQzQwUlk1em9MeFg5blYxaVdWNkVBdERLcHZCNkVqRzlESlZ2Y3FUZ05NNmRqTHZEUUFlSC9oMU1DT21Jb09ReW1ZWUpHVG5DUStBVjA3M2dMd0ppTWd0a242anZ1ZjNWWEZwWmdYQTVyOEcydXRYRHR4eGZ6dHlPS1JrNjY3a2pwYmMxVjRCYU0wbFVkQi9rbXhBOGtMeGhCOXZRazMycFdOR2ZVOXFxenNMd0hHdmRpUXhmNDZ4OENVMWNyb3N0ZDdGRzRCeDlHWGFlTGE5djJoSXRwT2tNdDh4OGFXWFhBalRwcjBJTFQ5WDVqN1RNcFVLRDFETlBMZWxsR2tYYkcwZzJjVDQwbk11UjhjWWp6MjJ1OVppdGZ3a3IzUEZmTXY0d2h1U3Qrdzd0MGFqMFdnMEc0TmZUaXhrZkZ4eVhQRUFBQUFBU1VWT1JLNUNZSUk9XCJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJwdXJwbGVcIikge1xuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUY2MmxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdNeTB3TTFReE1UbzBNRG96Tnkwd05Ub3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1ETXRNRE5VTVRFNk5UTTZNalV0TURVNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1ETXRNRE5VTVRFNk5UTTZNalV0TURVNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllUbGhZVFl4WkdZdFkyVmhOQzB3WXpReUxUaGhaVEF0WmpZMVpUZGhOV0l3TWpCaElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2TVRJNE5tWXpaR1V0WkRkak5TMWtaVFJtTFRnNU5HWXRNV1l6T0RrMlltTTVaakZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2WVRka05EUm1OMkV0TWpKbFl5MWhPRFEwTFRsbU9XSXRNVEEzWWpGaE5XWTJPVGN5SWo0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGhOMlEwTkdZM1lTMHlNbVZqTFdFNE5EUXRPV1k1WWkweE1EZGlNV0UxWmpZNU56SWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TUROVU1URTZOREE2TXpjdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21FNVlXRTJNV1JtTFdObFlUUXRNR00wTWkwNFlXVXdMV1kyTldVM1lUVmlNREl3WVNJZ2MzUkZkblE2ZDJobGJqMGlNakF4T0Mwd015MHdNMVF4TVRvMU16b3lOUzB3TlRvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NlJRMmNYQUFBQ1MwbEVRVlJvM3UyWXZVb0RRUkRIOHdoNUJOOUFIOERDMmtZcld3WHQxVjdSV2h1N2xJS0tXQ2txTm9Lb29LQkVKU0RFRDB3UmpTU1NjR0xpSldaemQrdit6OXV3aEh4ZTl1Q0VHUmhDTm5lejg1dWRuWjFOaEhNZStjOGFJUUFDSUFBQ0lBQUNJQUFDSUFBQ0lBRHRBTDJJZUQ0cWRDa2duVlRtMFE4QTV4MmJwOHNGWmhhUzM1KzZsZi9KdWpZQUw5cGpTb1QyYWhXYjdRemY4bzNCYSsyYWlHVThCajdRTjRBWW43VXRwd1JyeGRkS0NSRXE1MW5sNDY1WUM4SjU2UEhNZ3dRWTZRc0F5d2dyaUlnYWJYelB4cjk0cUFHazg1ZUxxYVpMSEdxQWRzNkhIcUNUODZFRzhGNW82M3lvQWV5cWMvUjIvc202S1hOaFhZR08wWmNBeHFNWkdNRHAvTE4vQU5CM21pQyttbmF0WHl5aytQSDBnM1o5UFRFa1FEUVFBSndKeHBQSkE1YTVubHVKYmdIVVhOV3RxWU44UFgyMEF4eE8zR3ZMODFhMmxENUlEd0RTUmNsSkxsc0x2NDdIVjlLOFdxelZiYUdhN1k0bWdnUEFCS1gzSDdjeTREZHNZRGlRM01yMjdyeTMrZkd1VEJuWGZ1YW4zbXYxQlNCYTVCd21hU3huYW9UYWpYZFNnQ1BIRzhjUklEa3Z6aUhaU3Z0WmdlVmEyV2F5UEw3czUxc2VXQkNrUTdlbEVjKzIybVB5WUpUUENEbnpmU01UbjJ0cXZwdTVhclZaR2ZVcldMMUdlMHJsY1oxSC9lLzdTaW0rRHdrZGR5T3RwQlVVSytQSnVIZGFkcVhNdEdMR3MybXBkd3RVbzJhT2E3c1RpL0VwV0VmcmtOek11aHZPazZsSWp3SUhXY2w2RVh2QlFSRHExYzNoWHdoWWkzZTAzSWxIME9oVkRKWVFHMzFiVmdnLzRyVUhjd0xraHBXdEsreTdacEgzQlVCL2JCRUFBUkFBQVJEQWY5QmZSYjY0S1lmbFJMQUFBQUFBU1VWT1JLNUNZSUk9XCJcbiAgICB9XG5cbiAgICByZXR1cm4gaWNvblVybDtcbiAgfVxuXG4gIGxvY2F0ZXB1c2hwaW4ob2JqKSB7XG4gICAgY29uc3QgdHJ1Y2tJZCA9IG9iai50cnVja0lkO1xuXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgcGlucyBpbiB0aGUgZGF0YSBsYXllciBhbmQgZmluZCB0aGUgcHVzaHBpbiBmb3IgdGhlIGxvY2F0aW9uLiBcbiAgICBsZXQgc2VhcmNoUGluO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhTGF5ZXIuZ2V0TGVuZ3RoKCk7IGkrKykge1xuICAgICAgc2VhcmNoUGluID0gdGhpcy5kYXRhTGF5ZXIuZ2V0KGkpO1xuICAgICAgaWYgKHNlYXJjaFBpbi5tZXRhZGF0YS50cnVja0lkLnRvTG93ZXJDYXNlKCkgIT09IHRydWNrSWQudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBzZWFyY2hQaW4gPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgYSBwaW4gaXMgZm91bmQgd2l0aCBhIG1hdGNoaW5nIElELCB0aGVuIGNlbnRlciB0aGUgbWFwIG9uIGl0IGFuZCBzaG93IGl0J3MgaW5mb2JveC5cbiAgICBpZiAoc2VhcmNoUGluKSB7XG4gICAgICAvLyBPZmZzZXQgdGhlIGNlbnRlcmluZyB0byBhY2NvdW50IGZvciB0aGUgaW5mb2JveC5cbiAgICAgIHRoaXMubWFwLnNldFZpZXcoeyBjZW50ZXI6IHNlYXJjaFBpbi5nZXRMb2NhdGlvbigpLCB6b29tOiAxNyB9KTtcbiAgICAgIC8vIHRoaXMuZGlzcGxheUluZm9Cb3goc2VhcmNoUGluLCBvYmopO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4obG9jYXRpb24sIHVybCwgcm90YXRpb25BbmdsZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cbiAgICAgIHZhciByb3RhdGlvbkFuZ2xlUmFkcyA9IHJvdGF0aW9uQW5nbGUgKiBNYXRoLlBJIC8gMTgwO1xuICAgICAgYy53aWR0aCA9IDUwO1xuICAgICAgYy5oZWlnaHQgPSA1MDtcbiAgICAgIC8vIENhbGN1bGF0ZSByb3RhdGVkIGltYWdlIHNpemUuXG4gICAgICAvLyBjLndpZHRoID0gTWF0aC5hYnMoTWF0aC5jZWlsKGltZy53aWR0aCAqIE1hdGguY29zKHJvdGF0aW9uQW5nbGVSYWRzKSArIGltZy5oZWlnaHQgKiBNYXRoLnNpbihyb3RhdGlvbkFuZ2xlUmFkcykpKTtcbiAgICAgIC8vIGMuaGVpZ2h0ID0gTWF0aC5hYnMoTWF0aC5jZWlsKGltZy53aWR0aCAqIE1hdGguc2luKHJvdGF0aW9uQW5nbGVSYWRzKSArIGltZy5oZWlnaHQgKiBNYXRoLmNvcyhyb3RhdGlvbkFuZ2xlUmFkcykpKTtcblxuICAgICAgdmFyIGNvbnRleHQgPSBjLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgIC8vIE1vdmUgdG8gdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxuICAgICAgY29udGV4dC50cmFuc2xhdGUoYy53aWR0aCAvIDIsIGMuaGVpZ2h0IC8gMik7XG5cbiAgICAgIC8vIFJvdGF0ZSB0aGUgY2FudmFzIHRvIHRoZSBzcGVjaWZpZWQgYW5nbGUgaW4gZGVncmVlcy5cbiAgICAgIGNvbnRleHQucm90YXRlKHJvdGF0aW9uQW5nbGVSYWRzKTtcblxuICAgICAgLy8gRHJhdyB0aGUgaW1hZ2UsIHNpbmNlIHRoZSBjb250ZXh0IGlzIHJvdGF0ZWQsIHRoZSBpbWFnZSB3aWxsIGJlIHJvdGF0ZWQgYWxzby5cbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltZywgLWltZy53aWR0aCAvIDIsIC1pbWcuaGVpZ2h0IC8gMik7XG4gICAgICAvLyBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgyNCwgNilcbiAgICAgIGlmICghaXNOYU4ocm90YXRpb25BbmdsZVJhZHMpICYmIHJvdGF0aW9uQW5nbGVSYWRzID4gMCkge1xuICAgICAgICBsb2NhdGlvbi5zZXRPcHRpb25zKHsgaWNvbjogYy50b0RhdGFVUkwoKSwgYW5jaG9yOiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoYy53aWR0aCAvIDIsIGMuaGVpZ2h0IC8gMikgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJldHVybiBjO1xuICAgIH07XG5cbiAgICAvLyBBbGxvdyBjcm9zcyBkb21haW4gaW1hZ2UgZWRpdHRpbmcuXG4gICAgaW1nLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG4gICAgaW1nLnNyYyA9IHVybDtcbiAgfVxuXG4gIGdldFRocmVzaG9sZFZhbHVlKCkge1xuXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFJ1bGVzKHRoaXMudGVjaFR5cGUpXG4gICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAoZGF0YSkgPT4ge1xuICAgICAgICAgIHZhciBvYmogPSBKU09OLnBhcnNlKCh0aGlzLnN0cmluZ2lmeUJvZHlKc29uKGRhdGEpKS5kYXRhKTtcbiAgICAgICAgICBpZiAob2JqICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBpZGxlVGltZSA9IG9iai5maWx0ZXIoZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmZpZWxkTmFtZSA9PT0gJ0N1bXVsYXRpdmUgaWRsZSB0aW1lIGZvciBSRUQnICYmIGVsZW1lbnQuZGlzcGF0Y2hUeXBlID09PSB0aGlzLnRlY2hUeXBlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaWRsZVRpbWUgIT0gdW5kZWZpbmVkICYmIGlkbGVUaW1lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJlc2hvbGRWYWx1ZSA9IGlkbGVUaW1lWzBdLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH1cbiAgICAgICk7XG4gIH1cblxuICBzdHJpbmdpZnlCb2R5SnNvbihkYXRhKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YVsnX2JvZHknXSk7XG4gIH1cblxuICBVVENUb1RpbWVab25lKHJlY29yZERhdGV0aW1lKSB7XG4gICAgdmFyIHJlY29yZFRpbWU7XG4gICAgdmFyIHJlY29yZGRUaW1lID0gbW9tZW50dGltZXpvbmUudXRjKHJlY29yZERhdGV0aW1lKTtcbiAgICAvLyB2YXIgcmVjb3JkZFRpbWUgPSBtb21lbnR0aW1lem9uZS50eihyZWNvcmREYXRldGltZSwgXCJBbWVyaWNhL0NoaWNhZ29cIik7XG5cbiAgICBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnQ1NUJykge1xuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdBbWVyaWNhL0NoaWNhZ28nKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnRVNUJykge1xuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdBbWVyaWNhL05ld19Zb3JrJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ1BTVCcpIHtcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignQW1lcmljYS9Mb3NfQW5nZWxlcycpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXG4gICAgfSBlbHNlIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdBbGFza2EnKSB7XG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ1VTL0FsYXNrYScpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlY29yZFRpbWU7XG4gIH1cblxuICBhZGRUaWNrZXREYXRhKG1hcCwgZGlyTWFuYWdlcil7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuVXBkYXRlVGlja2V0SlNPTkRhdGFMaXN0KCk7XG4gICAgdmFyIGluaXRJbmRleDogbnVtYmVyID0xO1xuICAgIHRoaXMudGlja2V0RGF0YS5mb3JFYWNoKGRhdGEgPT4ge1xuICAgICAgdmFyIHRpY2tldEltYWdlID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNnQUFBQXRDQVlBQUFEY015bmVBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFOT1NVUkJWRmlGelpsUFNCUlJHTUIvMzl0TUNDTjNOeTNJTGxHQy9UbFlVT0NmVFlJd0lTandWblRwVkhUSmcxRWdDZFZGcTFzUkhTTG9uSWU2V0ZHa3E3c1ZGRWhobXVXdFA0VE1paWlGdWpPdlE2TTc2cXc2N3Jqajd6YnZmZk45UHg2ek8rOTlJNndBM1VDaE1VNnRDTFZhcUJTTFhRaGJnQ0k3WkFMTmJ4R0dOUFJwaUVlTDZKVk9KcjNXRWkvQm96RXFMWXNMQ0kxQXNjZGFvMENITXJrYlR0TG5xMkNxanIzYTVCWlE3MUVxVzlWT1RKcWpDZnFYRGwwRXZZZjFxUWczZ0NaZ25TOXlHZEphdUIwMXVDcjlUSGtXTk9vb0U1TW5HdmI3TERiZjRMMmU1dVRtTi94d24zYVRxMllQSVo2ajJiYXFjaG0rQS9YUkhqN1BuMWdnT0ZKRHVSSzZnYTM1TUhQd3l3d1JLKzNpbTNOd2p1QklOUnVWNGgxUWtWZTFERU5TeU1ISVM4Wm1CcFJ6VmlrZUVwd2NRTG1lNUw1ellIWUZqVm9hZ2NkNVYzTEJFazZVeEhrS3RxQStRRUZxQTRQQWprRE5iQVMraFVOVVNCZHBCV0JzNERSclJBNUF3MDRqelNtd24wR0I4OEVxTFVTRWN3QmkvNjE4Q1ZySWpaREpUaVhpMC90MUZiQVU5VXFnS21pUmJGaFFyWURkUVl0a1JhaFFRRm5RSG90UXBzanNndGNjQXBzVWVOK0c1NUcvQ3ZnWnRNVWkvRlFDdjRLMldJUWZ5b0tCb0MyeUlUQ29nQmRCaTJSRjgxenNUYW9CRkFUdE00OHBNMFJVbFNRWVp3MnVvc0N6MGk0bUZJQVMyb01XY3FFZDdPMVdPRTRjU0FhcTQwVFRFK2toQWM0emlkQU1tRUU1T1REUlhKcTVtQldNeGtscXpjMWduRElJdEVVVHZIVmNaOUFORkk1T2tGejFia0lXQkQ2RVUxUTVXeUZ6anAzU3lXUUJISU9GSi93OE1KUU9jWHgrbjhhOTlWRkhHU2JkNU9rZ3BXRllXOFJLRWd2M0JjcnRobWdYM3d0Q0hFTG9YSDA5WHBsVFZMdkp3Vkx0TjFCR0xaY0ZXb0gxUG90TmlkQWFqdE1tb0xNRkxhdUJhY1RZRHJTZ09VdnVmVUlMb1NPVTVrcHhrdUdsZ2oyMWdFZHFLRmR3eG00QmUrM2hES0RwTUJXUFN1TjhYZTVObmdTZHBHTHMwNXB1SUx4RTZLZ0loeU54UHEya2p1dVBaRG5ZQmE4dkkvVGFTdVVnQjBHQXlCL3VBRVBaNWpVTVI0cTRsMHVObkFUbEE5UFcvM2U0ZTNKTjAwcStqY3lwa2N2Tk14ZzF2RUE0T2lleDVuV2tseU81NXM1cEJXZlJOQUZweDRpSmNOR1AxTDRJMmg5a0hzNE9DQThpUFh6MEk3Yy9Ld2hNbTdRQVk4QzRxV2oxSys4L2RramxmZmUwMTY4QUFBQUFTVVZPUks1Q1lJST1cIlxuICAgICAgaWYoZGF0YS50aWNrZXRTZXZlcml0eSA9PT0gXCJVbmtub3duXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eSA9PT0gXCJXYXJuaW5nXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eSA9PT0gXCJNaW5vclwiKVxuICAgICAge1xuICAgICAgICB0aWNrZXRJbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDd0FBQUF6Q0FZQUFBRHNCT3BQQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBUHlTVVJCVkdpQjdaaFBpQnQxRk1lLzd5WFQxZDNGUWhHS2VLbm9LdGpzV21sdnhSYWg5cUxWUzZkSlpvT3VCdytXUWkvMXRJY1d2T2lXc2xTOXVBZUpheWEvYklNSEtZcW9oeFFVUVloYU5wV3lXRkJXb2kzMG9DaDFONVBmODdEYmtKMU1KcE9kWkJLd24xdmU3LzErNzVOaDV2ZVBzQTFNMDl4aEdNWkJBSWNBUEEzZ0NRQzdBWXh2cHZ4TlJIK0l5QXFBSDVqNXl1am82RGNMQ3d1MTdkUnJocnBKVHFmVGU0bm9GSUFUQUhaMVdlczJnRXRFOUo1dDJ6OTEyYmRCSU9Ga012bDRMQmFiQS9CaTBENCtDSUJQbVBtTlhDNzNjN2VkZll1YnBobUx4K096UkRRTFlNZDJEZHV3SmlKdk9vN3pWckZZckFmdDFGWTRuVTQvU0VRZlkrTTk3UnNpVWpJTTQvamk0dUx0SVBtZXdxbFVhZzh6ZndGZ29xZDI3VmtCY0RTZnovL2FLYkZGT0oxTzd5YWlLOWo0OHFQa0JqTS9rOHZsZnZkTDR1WWZNek16OXhIUnA0aGVGZ0FlMVZwL1pwcm0vWDVKVzRUWDE5Zm5BZXp2cTVZLyt3ekRtUE5MYUx3U2xtVWRBbEJDK0drckxGcEVEaXVsdnZacXZQdUVDY0JGREY0V0FKaUk1dEhHaFFFZ2s4a2NBN0F2U3FzT0hKaWVubjdlcTRFQlFHdDlNbHFmem9qSTYxNXh5bVF5RDJtdFZ3SEVJbmJxUkYxRUhsWkszV3dPc29nY3hmREpBaHRPejdtRHJMWHU2OUliQmlJNjdJNHhNKzhkaEV3UWlPaEpkNHhGWk04QVhBSWhJbys0WXd4ZzV3QmNndExpeGw1WlEwU0xId080NlpFNExGVGRBZllLRGhHZXdoMDN6UU9reFkwM04rdERpWWlVM0RHdTErdWZEOEFsRUNMeWxUdkdoVUxoRndEWG85ZnB5TFZOdHkwd0FJakl1NUhyZE9ZZHJ5QUR3TWpJeUFjWXJ1bnRWcTFXKzhpcmdRRWdtODMrQzJBK1VpVi96aGVMeFR0ZURZMlZwRnF0WGdEd1hXUks3ZmwrZkh6OFlydkdobkNwVkhKRTVCVUFudjhzSXRaRTVHVy9XODR0YTdWUzZqcUExd0RvZnB0NW9FWGtWYVhVTmIra2xwUEc4dkx5Y2lLUldDV2lYdHhVQmtWRTVLUlNLdHNwMGZOb1ZLbFVmcHljbkx3RklJcmowN3FJbkZKS3ZSOGsyZmNKcGxLcEE4eDhDVURMUnJwSC9DWWlKNVJTM3didDRQdjBLcFZLTlpGSTJFVDBBSUNuT3VWM1FRM0FRandlVDlxMnZkSk54OER2YUNhVGVVeHJmUTdBY1FBajNmazFXQ09pb3VNNDU1YVdsbTVzWjRDdVB5clROSGNhaHZFQ2dDU0FZd0c3WFFhd1JFU1hiZHYrcTl1YXpZU2FCU3pMK2hMQUViOGNFU2twcFo0TlU2ZVpVR2M2Wmo0RC96bGJFOUdaTURWYWFvYnBuTXZscmdKWTlFbjVNSi9QbDhQVWNCUDYxS3kxbmdYd2owZlRIYTMxMmJEanV3a3RYQ2dVcWtSMHdhTnBybEFvcklZZDMwMVA3aVhHeHNiZUJ0QXNWNDNGWXVkN01iYWJuaXdFNVhLNU5qVTE5U2VBbHdCQVJFN2J0dDJYcldyUGJuNG1KaWF5QU1vaWN0VnhITDhQY1hpd0xPdUlaVm0rOC9JOTd2Ri81ei9kMGpvRVB6aFpHZ0FBQUFCSlJVNUVya0pnZ2c9PVwiXG4gICAgICB9ZWxzZSBpZihkYXRhLnRpY2tldFNldmVyaXR5ID09PSBcIk1ham9yXCIpe1xuICAgICAgICB0aWNrZXRJbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDd0FBQUF6Q0FZQUFBRHNCT3BQQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBT3lTVVJCVkdpQjdaaE5hQnhsR0lDZmQyWk5hbHNvaUZCVWhMYlpUZnB6TU5MZ1FURkZxTDFvUFpWNFVadmRwSlRXSHVzcGdnRXZtbEpDVmRDZzVzY2lZc1NEOUNMcUlZR0tJTGJhUTJxNzNhMkdsdGdLQlJWTm11ek92QjRTMDgzc3pPek16dTdzZ24xdTgzN3Y5MzBQSDd2Znp5dFV3K1JNQ3d1dFQyQnJOL0FvMEFGc0JqYXVaUHlOY2dNaEMvd0lUTFAwNTdjYzdpcFVOVjhKRWlwNy9Nb3VWSTZCOWdEM2haenJGc0lrTnUrUVNWME0yWGVWWU1JVCtYWnNld2g0TG5BZmJ4VDRBa3Rlb1QrWkM5dlpmL0pKTlpuUERhQU1BQzFWQ25xeGlNanJyRzk3Z3g2eGduYnlGaDY1ZkQ4dHh1ZEFkeTNzZkpqQ0tCN2c0STViUVpMZGhjZCszZ0tKcjRCVURjWDh5R0taKytqZk5sc3BzVno0L2F1YlNkalRvQjExVWZNbVQ2THdKQy91L00wdmFhM3cyQy9yb0hnVzJGMVBNeDkrWXNPNngrbDVlTUVyd1ZqN2FRM1RPRm1BVHVadkQva2wzRm5oOFd3M0tsTkUzN2FpWW1NYmUraHJPK3ZXdUx6Q3FvTEtLUm92QzJCZzJzT291cm9zQzAvazlnT2RjVnI1b25ReGR1VVp0NmFWRmVab3JFSkJFSTY0aDA5ZmZJRGlQZGNBTTJhbFNsZ1V6WWM0dE8xbWFkQ2cwTEtQNXBNRk1ER3RwNTFCQTlGNkg3M1ZZN0NuUEFTN0dxQVNER1duTTJRQVcrSTNDWXBzZFVZTVlGTURUQUtpWlc2R1cxb1RVZVpuQURkZEVwdUZPV2ZBUU11RFRZT29pN0JveFV0encxQXBjek9BNlFhb0JFT1pjb1lNc0w1c2dFb3dwUGlOTTJTUTN2RXJjQ2wrbTRyTXJMaXQ0Yjl0NCsxNFhRSWc4cFpiZUVVNE1VcHpiVysvczc3MXRGdkRzbkI2NjIxZ09FNGpYMVJPZUQxRTc1d2tzOWRQQXQvSDVlVERlUXAvblBKcWREenpMMjhINHp4d2I3MnRQRmhFMkUxdmFzWXJZZTFabmU2NGhIQUlzT3R0NW9LTmF0cFBGdHd1UDcycGoxSHRaN25LR0JlSzZsRXk3WjlVU25TL3JXWGF4MUJlQmlJWG9BT3doT29STXUwalFaTDk2eEFmNXJzdzdFbWc3Q0pkRTRUckNEMGNUSDBYdEl2L2ZiaXY3UWVXN01kQTNxTzJxMTFBZUJjcGRvYVJoVENWbmc5eVNVd2RCQTRBcmVIOFZsbEUrQXdZcERlVnIyYUE4S1dwa2Z3bVd1MW5VWjRIOWdmc2RRYmhVeEtjNFlYVVg2SG5MQ0ZhTFcwODl6V3FleXRrVFpGT1BSVnBuaEtpdmVrczZ6aitlN2FOeVBGSWN6aUlKdHpYY1FIa0k4OTJZWUxlNUxsSWN6aUkvbXEyaXdQQVB5NHRDOWp5V3VUeEhVUVg3dHMraDNMU3BXV0lUUEphNVBFZDFLWXVVZGp3SmxBcU40YzVmNkltWXp1b2pmRGhCK2VCd2RWdjFWZDU2UkczbjBsa2FsZjVtVTJPQStlQUMyeE1lZjhSbTRyUjdGNUdzNVgyNWJ2YzVYL052MW9ZOXFkYkZrbDBBQUFBQUVsRlRrU3VRbUNDXCJcbiAgICAgIH1cblxuICAgICAgdmFyIHB1c2hwaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZGF0YS5sYXRpdHVkZSwgZGF0YS5sb25naXR1ZGUpLCB7IGljb246IHRpY2tldEltYWdlLCB0ZXh0OiBpbml0SW5kZXgudG9TdHJpbmcoKSB9KTtcbiAgICAgIHB1c2hwaW4ubWV0YWRhdGEgPSBkYXRhO1xuICAgICAgbWFwLmVudGl0aWVzLnB1c2gocHVzaHBpbik7XG4gICAgICB0aGlzLmRhdGFMYXllci5wdXNoKHB1c2hwaW4pO1xuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIocHVzaHBpbiwgJ2NsaWNrJywgcHVzaHBpbkNsaWNrZWQpO1xuICAgICAgbWFwLnNldFZpZXcoeyBtYXBUeXBlSWQ6IE1pY3Jvc29mdC5NYXBzLk1hcFR5cGVJZC5yb2FkLCBjZW50ZXI6IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihkYXRhLmxhdGl0dWRlLCBkYXRhLmxvbmdpdHVkZSl9KTtcbiAgICAgIGluaXRJbmRleCA9IGluaXRJbmRleCArIDE7XG4gICAgfSk7XG4gICAgJCgnLk5hdkJhcl9Db250YWluZXIuTGlnaHQnKS5hdHRyKCdzdHlsZScsJ3RvcDo1ODBweCcpO1xuICAgIGNvbnN0IGluZm9ib3ggPSBuZXcgTWljcm9zb2Z0Lk1hcHMuSW5mb2JveChtYXAuZ2V0Q2VudGVyKCksIHtcbiAgICAgIHZpc2libGU6IGZhbHNlICBcbiAgICB9KTsgICAgXG4gICAgZnVuY3Rpb24gcHVzaHBpbkNsaWNrZWQoZSkge1xuICAgICAgaWYgKGUudGFyZ2V0Lm1ldGFkYXRhKSB7XG4gICAgICAgIGluZm9ib3guc2V0TWFwKG1hcCk7ICBcbiAgICAgICAgaW5mb2JveC5zZXRPcHRpb25zKHtcbiAgICAgICAgICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcbiAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgIG9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDAsIDIwKSxcbiAgICAgICAgICBodG1sQ29udGVudDonPGRpdiBjbGFzcyA9IFwiaW5meVwiIHN0eWxlPSBcImJhY2tncm91bmQtY29sb3I6IHdoaXRlO2JvcmRlcjogMXB4IHNvbGlkIGxpZ2h0Z3JheTsgd2lkdGg6MzYwcHg7XCI+J1xuICAgICAgICAgICsgZ2V0VGlja2V0SW5mb0JveEhUTUwoZS50YXJnZXQubWV0YWRhdGEpICsgJzwvZGl2PidcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAkKCcuTmF2QmFyX0NvbnRhaW5lci5MaWdodCcpLmF0dHIoJ3N0eWxlJywndG9wOjU4MHB4Jyk7XG4gICAgICBwaW5DbGlja2VkKGUudGFyZ2V0Lm1ldGFkYXRhKVxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoaW5mb2JveCwgJ2NsaWNrJywgY2xvc2UpO1xuICB9XG4gIGZ1bmN0aW9uIHBpbkNsaWNrZWQocGFybXMpe1xuICAgIGNvbnNvbGUubG9nKCdlbWl0Jyx0aGF0KTtcbiAgICB0aGF0LnRpY2tldENsaWNrLmVtaXQocGFybXMpO1xuICB9XG4gIGZ1bmN0aW9uIGNsb3NlKGUpIHtcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdmYSBmYS10aW1lcycpIHtcbiAgICAgICQoJy5OYXZCYXJfQ29udGFpbmVyLkxpZ2h0JykuYXR0cignc3R5bGUnLCd0b3A6MHB4Jyk7XG4gICAgICBpbmZvYm94LnNldE9wdGlvbnMoe1xuICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIFxuICAgICAgICBmdW5jdGlvbiBnZXRUaWNrZXRJbmZvQm94SFRNTChkYXRhOiBhbnkpOlN0cmluZ3tcbiAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB2YXIgaW5mb2JveERhdGEgPSBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J3BhZGRpbmctdG9wOjEwcHg7cGFkZGluZy1ib3R0b206MTBweDttYXJnaW46IDBweDsnPlwiXG4gICAgICAgICsgXCI8L2Rpdj5cIlxuICAgICAgICByZXR1cm4gaW5mb2JveERhdGE7XG4gICAgICAgIH1cblxuXG59XG5cbiAgVXBkYXRlVGlja2V0SlNPTkRhdGFMaXN0KClcbiAge1xuICAgIGlmKHRoaXMudGlja2V0TGlzdC5sZW5ndGggIT0wKVxuICAgIHtcbiAgICB0aGlzLnRpY2tldExpc3QuVGlja2V0SW5mb0xpc3QuVGlja2V0SW5mby5mb3JFYWNoKHRpY2tldEluZm8gPT4ge1xuICAgICAgdmFyIHRpY2tldDogVGlja2V0ID0gbmV3IFRpY2tldCgpOztcbiAgICAgIHRpY2tldEluZm8uRmllbGRUdXBsZUxpc3QuRmllbGRUdXBsZS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBpZihlbGVtZW50Lk5hbWUgPT09IFwiVGlja2V0TnVtYmVyXCIpe1xuICAgICAgICAgICAgdGlja2V0LnRpY2tldE51bWJlciA9IGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiRW50cnlUeXBlXCIpe1xuICAgICAgICAgIHRpY2tldC5lbnRyeVR5cGUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDcmVhdGVEYXRlXCIpe1xuICAgICAgICAgIHRpY2tldC5jcmVhdGVEYXRlID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFcXVpcG1lbnRJRFwiKXtcbiAgICAgICAgICB0aWNrZXQuZXF1aXBtZW50SUQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDb21tb25JRFwiKXtcbiAgICAgICAgICB0aWNrZXQuY29tbW9uSUQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlBhcmVudElEXCIpe1xuICAgICAgICAgIHRpY2tldC5wYXJlbnRJRCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQ3VzdEFmZmVjdGluZ1wiKXtcbiAgICAgICAgICB0aWNrZXQuY3VzdEFmZmVjdGluZyA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiVGlja2V0U2V2ZXJpdHlcIil7XG4gICAgICAgICAgdGlja2V0LnRpY2tldFNldmVyaXR5ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBc3NpZ25lZFRvXCIpe1xuICAgICAgICAgIHRpY2tldC5hc3NpZ25lZFRvID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTdWJtaXR0ZWRCeVwiKXtcbiAgICAgICAgICB0aWNrZXQuc3VibWl0dGVkQnkgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlByb2JsZW1TdWJjYXRlZ29yeVwiKXtcbiAgICAgICAgICB0aWNrZXQucHJvYmxlbVN1YmNhdGVnb3J5ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQcm9ibGVtRGV0YWlsXCIpe1xuICAgICAgICAgIHRpY2tldC5wcm9ibGVtRGV0YWlsID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQcm9ibGVtQ2F0ZWdvcnlcIil7XG4gICAgICAgICAgdGlja2V0LnByb2JsZW1DYXRlZ29yeSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTGF0aXR1ZGVcIil7XG4gICAgICAgICAgdGlja2V0LmxhdGl0dWRlID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMb25naXR1ZGVcIil7XG4gICAgICAgICAgdGlja2V0LmxvbmdpdHVkZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUGxhbm5lZFJlc3RvcmFsVGltZVwiKXtcbiAgICAgICAgICB0aWNrZXQucGxhbm5lZFJlc3RvcmFsVGltZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQWx0ZXJuYXRlU2l0ZUlEXCIpe1xuICAgICAgICAgIHRpY2tldC5hbHRlcm5hdGVTaXRlSUQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkxvY2F0aW9uUmFua2luZ1wiKXtcbiAgICAgICAgICB0aWNrZXQubG9jYXRpb25SYW5raW5nID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBc3NpZ25lZERlcGFydG1lbnRcIil7XG4gICAgICAgICAgdGlja2V0LmFzc2lnbmVkRGVwYXJ0bWVudCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUmVnaW9uXCIpe1xuICAgICAgICAgIHRpY2tldC5yZWdpb24gPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIk1hcmtldFwiKXtcbiAgICAgICAgICB0aWNrZXQubWFya2V0ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJXb3JrUmVxdWVzdElkXCIpe1xuICAgICAgICAgIHRpY2tldC53b3JrUmVxdWVzdElkID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTaGlmdExvZ1wiKXtcbiAgICAgICAgICB0aWNrZXQuc2hpZnRMb2cgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFjdGlvblwiKXtcbiAgICAgICAgICB0aWNrZXQuYWN0aW9uID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFcXVpcG1lbnROYW1lXCIpe1xuICAgICAgICAgIHRpY2tldC5lcXVpcG1lbnROYW1lID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTaG9ydERlc2NyaXB0aW9uXCIpe1xuICAgICAgICAgIHRpY2tldC5zaG9ydERlc2NyaXB0aW9uID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQYXJlbnROYW1lXCIpe1xuICAgICAgICAgIHRpY2tldC5wYXJlbnROYW1lID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJUaWNrZXRTdGF0dXNcIil7XG4gICAgICAgICAgdGlja2V0LnRpY2tldFN0YXR1cyA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTG9jYXRpb25JRFwiKXtcbiAgICAgICAgICB0aWNrZXQubG9jYXRpb25JRCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiT3BzRGlzdHJpY3RcIil7XG4gICAgICAgICAgdGlja2V0Lm9wc0Rpc3RyaWN0ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJPcHNab25lXCIpe1xuICAgICAgICAgIHRpY2tldC5vcHNab25lID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy50aWNrZXREYXRhLnB1c2godGlja2V0KTtcbiAgICB9KTtcbiAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJ0dGFtYXBsaWJDb21wb25lbnQgfSBmcm9tICcuL3J0dGFtYXBsaWIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtSdHRhbWFwbGliQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW1J0dGFtYXBsaWJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIFJ0dGFtYXBsaWJNb2R1bGUgeyB9XG4iXSwibmFtZXMiOlsiSGVhZGVycyIsIlJlcXVlc3RPcHRpb25zIiwiT2JzZXJ2YWJsZSIsImlvLmNvbm5lY3QiLCJJbmplY3RhYmxlIiwiSHR0cCIsIkV2ZW50RW1pdHRlciIsInNldFRpbWVvdXQiLCJmb3JrSm9pbiIsIm1vbWVudHRpbWV6b25lLnV0YyIsIm1hcCIsIkNvbXBvbmVudCIsIlZpZXdDb250YWluZXJSZWYiLCJWaWV3Q2hpbGQiLCJJbnB1dCIsIk91dHB1dCIsIk5nTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7UUFvQkUsMkJBQW9CLElBQVU7WUFBVixTQUFJLEdBQUosSUFBSSxDQUFNOzRCQU5uQixLQUFLOzJCQUNOLElBQUk7d0JBQ0MsSUFBSTswQkFDTCxJQUFJOzZCQUNFLElBQUk7WUFHdEIsSUFBSSxDQUFDLElBQUksR0FBRywyQ0FBMkMsQ0FBQztZQUN4RCxJQUFJLENBQUMsU0FBUyxHQUFHLG1DQUFtQyxDQUFDO1NBQ3REOzs7OztRQUVELGtEQUFzQjs7OztZQUF0QixVQUF1QixRQUFROztnQkFDN0IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7Z0JBQzFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQWE7b0JBQzNFLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNuQixDQUFDLENBQUM7YUFDSjs7Ozs7UUFFRCw2Q0FBaUI7Ozs7WUFBakIsVUFBa0IsTUFBTTs7Z0JBQ3RCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztnQkFDdEIsWUFBWSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7O2dCQUNqQyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO2dCQUNqRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDbEMsUUFBUSxFQUFFLEVBQUU7b0JBQ1osY0FBYyxFQUFFLFlBQVk7aUJBQzdCLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFhO29CQUNoQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFD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