/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ViewContainerRef, Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { RttamaplibService } from './rttamaplib.service';
import { TruckDirectionDetails, Ticket } from './models/truckdetails';
import { setTimeout } from 'timers';
import { forkJoin } from 'rxjs';
import * as momenttimezone from 'moment-timezone';
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
                else {
                    //this.toastr.warning('Not valid Field/Area Manager!', 'Manager', { showCloseButton: true })
                    //$('#loading').hide();
                }
            }
            else {
                //this.toastr.warning('Please enter valid Field/Area Manager attuid!', 'Manager', { showCloseButton: true })
                //$('#loading').hide();
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
                else {
                    //this.toastr.error('No truck found!', 'Manager');
                    //$('#loading').hide();
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
                    /** @type {?} */
                    var feedManager = [];
                    _this.connection = _this.mapService.getTruckFeed(_this.reportingTechnicians, _this.managerIds).subscribe(function (data) {
                        if (dirDetails_1.some(function (x) { return x.techId.toLocaleLowerCase() == data.techID.toLocaleLowerCase(); })) {
                            console.log(data);
                            _this.pushNewTruck(maps, data);
                        }
                    }, function (err) {
                        console.log('Error while fetching trucks from Kafka Consumer. Errors-> ' + err.Error);
                    });
                }
                else {
                    //this.toastr.error('No truck found!', 'Manager');
                    //$('#loading').hide();
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
        var currentObject = this;
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
        var feetforMiles = 0.000189394;
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
        var isNewTruck = true;
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
            isNewTruck = false;
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
         * @param {?} e
         * @return {?}
         */
        function mousewheelChanged(e) {
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
            if (e.originalEvent.target.className === 'details') {
                //that.router.navigate(['/technician-details']);
            }
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
            if (confirm('Are you sure want to send Email?')) {
                // this.userProfileService.getUserData(this.cookieATTUID)
                //   .subscribe((data) => {
                //     var newData: any = this.stringifyJson(data);
                //     //this.mapService.sendEmail(newData.email,this.technicianEmail,newData.lastName + ' ' + newData.firstName, this.technicianName, form.value.emailSubject,form.value.emailMessage);
                //     this.mapService.sendEmail(newData.email, form.value.emailId, newData.lastName + ' ' + newData.firstName, this.technicianName, form.value.emailSubject, form.value.emailMessage);
                //     this.toastr.success("Email sent successfully", 'Success');
                //     form.controls.emailSubject.reset()
                //     form.controls.emailMessage.reset()
                //     form.value.emailId = this.technicianEmail;
                //     jQuery('#myModalEmail').modal('hide');
                //   });
            }
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
    ;
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
         * @param {?} e
         * @return {?}
         */
        function close(e) {
            if (e.originalEvent.target.className === 'fa fa-times') {
                $('.NavBar_Container.Light').attr('style', 'top:0px');
                // infobox.setOptions({
                //   visible: false
                // });
            }
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
        /**
         * @param {?} data
         * @param {?} distancdData
         * @param {?} fromAddress
         * @param {?} toAddress
         * @return {?}
         */
        function getTicketInfoBoxHTML(data, distancdData, fromAddress, toAddress) {
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
                + "<div class='col-md-12' style='padding-left:15px' ><hr /></div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-md-11' style='padding-left:15px' ><span>" + distanceData + "</span></div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-md-11' style='padding-left:15px' ><span>" + fromAddress + "</span></div>"
                + "</div>"
                + "<div class='row'>"
                + "<div class='col-md-11' style='padding-left:15px' ><span>" + toAddress + "</span></div>"
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
                ;
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
export { RttamaplibComponent };
if (false) {
    /** @type {?} */
    RttamaplibComponent.prototype.connection;
    /** @type {?} */
    RttamaplibComponent.prototype.map;
    /** @type {?} */
    RttamaplibComponent.prototype.contextMenu;
    /** @type {?} */
    RttamaplibComponent.prototype.technicianPhone;
    /** @type {?} */
    RttamaplibComponent.prototype.technicianEmail;
    /** @type {?} */
    RttamaplibComponent.prototype.technicianName;
    /** @type {?} */
    RttamaplibComponent.prototype.travalDuration;
    /** @type {?} */
    RttamaplibComponent.prototype.truckItems;
    /** @type {?} */
    RttamaplibComponent.prototype.testClass;
    /** @type {?} */
    RttamaplibComponent.prototype.directionsManager;
    /** @type {?} */
    RttamaplibComponent.prototype.trafficManager;
    /** @type {?} */
    RttamaplibComponent.prototype.truckList;
    /** @type {?} */
    RttamaplibComponent.prototype.truckWatchList;
    /** @type {?} */
    RttamaplibComponent.prototype.busy;
    /** @type {?} */
    RttamaplibComponent.prototype.mapview;
    /** @type {?} */
    RttamaplibComponent.prototype.loading;
    /** @type {?} */
    RttamaplibComponent.prototype.someInput;
    /** @type {?} */
    RttamaplibComponent.prototype.myMap;
    /** @type {?} */
    RttamaplibComponent.prototype.ready;
    /** @type {?} */
    RttamaplibComponent.prototype.animatedLayer;
    /** @type {?} */
    RttamaplibComponent.prototype.infoTemplate;
    /** @type {?} */
    RttamaplibComponent.prototype.socket;
    /** @type {?} */
    RttamaplibComponent.prototype.socketURL;
    /** @type {?} */
    RttamaplibComponent.prototype.results;
    /** @type {?} */
    RttamaplibComponent.prototype.userRole;
    /** @type {?} */
    RttamaplibComponent.prototype.lastZoomLevel;
    /** @type {?} */
    RttamaplibComponent.prototype.lastLocation;
    /** @type {?} */
    RttamaplibComponent.prototype.reportingTechnicianDetails;
    /** @type {?} */
    RttamaplibComponent.prototype.reportingTechnicians;
    /** @type {?} */
    RttamaplibComponent.prototype.isTrafficEnabled;
    /** @type {?} */
    RttamaplibComponent.prototype.loggedUserId;
    /** @type {?} */
    RttamaplibComponent.prototype.managerUserId;
    /** @type {?} */
    RttamaplibComponent.prototype.cookieATTUID;
    /** @type {?} */
    RttamaplibComponent.prototype.feet;
    /** @type {?} */
    RttamaplibComponent.prototype.IsAreaManager;
    /** @type {?} */
    RttamaplibComponent.prototype.IsVP;
    /** @type {?} */
    RttamaplibComponent.prototype.fieldManagers;
    /** @type {?} */
    RttamaplibComponent.prototype.urlTemplate;
    /** @type {?} */
    RttamaplibComponent.prototype.timestamps;
    /** @type {?} */
    RttamaplibComponent.prototype.techType;
    /** @type {?} */
    RttamaplibComponent.prototype.thresholdValue;
    /** @type {?} */
    RttamaplibComponent.prototype.animationTruckList;
    /** @type {?} */
    RttamaplibComponent.prototype.dropdownSettings;
    /** @type {?} */
    RttamaplibComponent.prototype.selectedFieldMgr;
    /** @type {?} */
    RttamaplibComponent.prototype.managerIds;
    /** @type {?} */
    RttamaplibComponent.prototype.radiousValue;
    /** @type {?} */
    RttamaplibComponent.prototype.foundTruck;
    /** @type {?} */
    RttamaplibComponent.prototype.loggedInUserTimeZone;
    /** @type {?} */
    RttamaplibComponent.prototype.clickedLat;
    /** @type {?} */
    RttamaplibComponent.prototype.any;
    /** @type {?} */
    RttamaplibComponent.prototype.clickedLong;
    /** @type {?} */
    RttamaplibComponent.prototype.dataLayer;
    /** @type {?} */
    RttamaplibComponent.prototype.pathLayer;
    /** @type {?} */
    RttamaplibComponent.prototype.infoBoxLayer;
    /** @type {?} */
    RttamaplibComponent.prototype.infobox;
    /** @type {?} */
    RttamaplibComponent.prototype.isMapLoaded;
    /** @type {?} */
    RttamaplibComponent.prototype.WorkFlowAdmin;
    /** @type {?} */
    RttamaplibComponent.prototype.SystemAdmin;
    /** @type {?} */
    RttamaplibComponent.prototype.RuleAdmin;
    /** @type {?} */
    RttamaplibComponent.prototype.RegularUser;
    /** @type {?} */
    RttamaplibComponent.prototype.Reporting;
    /** @type {?} */
    RttamaplibComponent.prototype.NotificationAdmin;
    /** @type {?} */
    RttamaplibComponent.prototype.ticketList;
    /** @type {?} */
    RttamaplibComponent.prototype.loggedInUser;
    /** @type {?} */
    RttamaplibComponent.prototype.ticketClick;
    /** @type {?} */
    RttamaplibComponent.prototype.ticketData;
    /** @type {?} */
    RttamaplibComponent.prototype.mapService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9ydHRhbWFwbGliLyIsInNvdXJjZXMiOlsibGliL3J0dGFtYXBsaWIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBVSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFdkgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFHekQsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQU9wRixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFaEMsT0FBTyxLQUFLLGNBQWMsTUFBTSxpQkFBaUIsQ0FBQztBQVVsRCxtQkFBQyxNQUFhLEVBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztJQW1MOUIsNkJBQW1CLFVBQTZCOzs7SUFHOUMsQUFGQSwwQkFBMEI7SUFDMUIsZ0NBQWdDO0lBQ2hDLElBQXNCO1FBSEwsZUFBVSxHQUFWLFVBQVUsQ0FBbUI7MEJBM0VuQyxFQUFFO3lCQUNILG9CQUFvQjt5QkFLcEIsRUFBRTt1QkFHSixNQUFNO3VCQUNOLEtBQUs7cUJBRVAsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7cUJBQ2hDLEtBQUs7c0JBS0MsSUFBSTt1QkFFUixFQUNUOzZCQUVlLEVBQUU7MENBRVcsRUFBRTtvQ0FDUixFQUFFO2dDQUNOLENBQUM7NEJBQ0wsRUFBRTs2QkFDRCxFQUFFOzRCQUNILEVBQUU7b0JBQ0YsV0FBVzs2QkFDVixLQUFLO29CQUNkLEtBQUs7NkJBQ0ksRUFBRTs7MkJBRUosZ0dBQWdHOzswQkFHakcsQ0FBQyxhQUFhLEVBQUUsYUFB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QjtnQkFGakIsZ0JBQWdCOzs7NEJBNEl0QixTQUFTLFNBQUMsWUFBWTsrQkFNdEIsU0FBUyxTQUFDLE1BQU07NkJBb0RoQixLQUFLOytCQUNMLEtBQUs7OEJBQ0wsTUFBTTs7OEJBeE1UOztTQXdIYSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWaWV3Q29udGFpbmVyUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uSW5pdCwgVmlld0NoaWxkLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG4vLyBpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBSdHRhbWFwbGliU2VydmljZSB9IGZyb20gJy4vcnR0YW1hcGxpYi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTmd1aUF1dG9Db21wbGV0ZU1vZHVsZSB9IGZyb20gJ0BuZ3VpL2F1dG8tY29tcGxldGUvZGlzdCc7XHJcbi8vIGltcG9ydCB7IFBvcHVwIH0gZnJvbSAnbmcyLW9wZC1wb3B1cCc7XHJcbmltcG9ydCB7IFRydWNrRGV0YWlscywgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzLCBUaWNrZXQgfSBmcm9tICcuL21vZGVscy90cnVja2RldGFpbHMnO1xyXG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcclxuaW1wb3J0IHsgZmFpbCwgdGhyb3dzIH0gZnJvbSAnYXNzZXJ0JztcclxuLy8gaW1wb3J0IHsgVG9hc3QsIFRvYXN0c01hbmFnZXIgfSBmcm9tICduZzItdG9hc3RyL25nMi10b2FzdHInO1xyXG5pbXBvcnQgeyBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlL3NyYy9tZXRhZGF0YS9saWZlY3ljbGVfaG9va3MnO1xyXG5pbXBvcnQgeyBUcnlDYXRjaFN0bXQgfSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvb3V0cHV0L291dHB1dF9hc3QnO1xyXG5pbXBvcnQgeyBBbmd1bGFyTXVsdGlTZWxlY3RNb2R1bGUgfSBmcm9tICdhbmd1bGFyMi1tdWx0aXNlbGVjdC1kcm9wZG93bi9hbmd1bGFyMi1tdWx0aXNlbGVjdC1kcm9wZG93bic7XHJcbmltcG9ydCB7IHNldFRpbWVvdXQgfSBmcm9tICd0aW1lcnMnO1xyXG5pbXBvcnQgeyBmb3JrSm9pbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0ICogYXMgbW9tZW50dGltZXpvbmUgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcclxuaW1wb3J0IHsgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21waWxlci9zcmMvY29yZSc7XHJcbmltcG9ydCB7IFBBUkFNRVRFUlMgfSBmcm9tICdAYW5ndWxhci9jb3JlL3NyYy91dGlsL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBzaGFsbG93RXF1YWwgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXIvc3JjL3V0aWxzL2NvbGxlY3Rpb24nO1xyXG5cclxuZGVjbGFyZSBjb25zdCBNaWNyb3NvZnQ6IGFueTtcclxuZGVjbGFyZSBjb25zdCBCaW5nO1xyXG5kZWNsYXJlIGNvbnN0IEdlb0pzb246IGFueTtcclxuZGVjbGFyZSB2YXIgalF1ZXJ5OiBhbnk7XHJcbmRlY2xhcmUgdmFyICQ6IGFueTtcclxuKHdpbmRvdyBhcyBhbnkpLmdsb2JhbCA9IHdpbmRvdztcclxuLy8gPGRpdiBpZD1cImxvYWRpbmdcIj5cclxuLy8gICAgIDxpbWcgaWQ9XCJsb2FkaW5nLWltYWdlXCIgc3JjPVwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoa0FHUUFhSUdBUC8vLzh6TXpKbVptV1ptWmpNek13QUFBUC8vL3dBQUFDSC9DMDVGVkZORFFWQkZNaTR3QXdFQUFBQWgrUVFGQUFBR0FDd0FBQUFBa0FHUUFRQUQvMmk2M1A0d3lrbXJ2VGpyemJ2L1lDaU9aR21lYUtxdWJPdStjQ3pQZEczZmVLN3ZmTy8vd0tCd1NDd2FqOGlrY3Nsc09wL1FxSFJLclZxdjJLeDJ5KzE2ditDd2VFd3VtOC9vdEhyTmJydmY4TGg4VHEvYjcvaThmcy92Ky8rQWdZS0RoSVdHaDRpSmlvdU1qWTZQa0VrQUFaUUNBZ09ZQkpxYUJaMmVud1dhQUpHa2FhQ25xS2tGbzZXdFpLcXdxYXl1dEYreHQ1OEJ0YnRkdUw2NnZNRll2cmpBd3NkVHhMZkd5TTFPeXJITXp0TkowTERTMU5sRTFxclkydDgvM0tuZTRPVTY0cWprNXVzMTZLZnE3UEV3N3FEdzh2Y3I5TG40L0RINm52WjJBQmdnWUZZL1NQODZCZFFob0JNQkFRc1BEa3BZSU9JTkFLQWVXcFRvaC8vaXhob0RVR25rdUFTQXdTQWVpUVNBTlpKa0VaT1VpcVFjUXVEV3c1TXVlY0NrRkFDbkQ0b0NoalQwZFRObmowazhlZnJrQVZRSWdKcktDQnJOZ1RScDBpRk5nNFRrTnVEajFCRTdyU1pkZWk1aFVDQXIwYlg4NnFLcVdLdENzdjZBNnU0aFd4WnUzMW9saTBOdWo2SC91dDQ5RVZidlc3NDIvQXFrKzYvb1lCRjVEWXRGM003c2o2MFVRMUYrVENHeTVNUGhMUGRJbTduQVdjNGRQSDkrRy9yZjZSMk1FeEpBblZyMTZzay9SZThnbmRrcmJRTzJiN1B1b2ZoaTdNQy9OUVFYanB1cDdoeUFNMjlPem1BNTg3M09YZTh1M2VrMTlRcldyeXZOcnMrN0Rjd1VDVXovdmlDOCtKNDdLQTdRd1hzbWV3enZoY2RQT0IvSFUrNy9zOTJYZ1h2aXJaY1BmOUJ4VjVHQUd1UjNXMW5JM1ZBZmdnd082T0JuQnFZZ0h3N29VWlJoaGNCZEtObUhKbXhvdzRUYWdXaWhpSWIxUlNFTi81V21ub3JLc2FnWGlTU1lTRU4wOXRGNEFZSGkzYUNqREJoeDE1K1BLOXFJWFdVUnp0QmhRcjRocVNSb05Bd0pBNHI2SElsa2tsTlNnbU1JVnJaMW5ENHpicmxCbDB2S0VHWUxQRDVuSmdaQVhsZmxpeThVS2VPYnFhRTVucHAwdXZEa1AxSGlHU2R6TTZRWEE1YjBhSWxualhyQzU0OXNNWXlwVDZDTEd0Q29sNDgyQmtPYktWYkt3YUMzZmNtQm9XSUNLS3FubHpycUFxa3QvRG1wcHgrQSt1QUxySzZBYUYyd2dwRHFxUmpVcW9LazlGQ2FhNGlYMGdvcEM1eG1PU3dJLzdKaXVPcXhLc1JZR3EvRE51c3NDNzZlNENvOTVpMjdnYldHVVV0QnRpWGNxcGE0eSs2S0xiUW9BT3VPc042MmwrcTZtcVpncmpnQnhodUN1aXFRQzVtNzZNQ3Jyd0xndHRndnV5VnM2NDZpQTN0UU1KVW8rS3VyZ21VMnpDeS9KMGo4QWNEaWRHdnhwL05HakxBSTkzSlQ4Y2U2WG9wdUE1bVpJRzF2S0lNVmNva1VtWkJzb2pHVGdIR09OZXVzNElJNVE3YXpDQzJUb0RBNkhnZk53ZEJnOWt3eXhTc0gvVERFUkR2TkxNZmNKQzJKd01kTUxWWUpSWWR3TTY1Uk5EUkExTFY0bldZSW1MVHQ5dHR3eDgzdzBqOXpmU0pkV3N1ajlsVlpIQzNPM0VnRUVCc0JkZ2ZEdEJRbGMxTjREQU9sSXBnYkpwVjArQk12RjJjRUFQOWpGd0M0R1ZXaHpjTGtUbVNPcitmSWNrdzRHM21SbnNMZWUwcGhaMm1MdHlBNE1XZXY0Wm5xaE0xY05zVkpCT0QzS1hsL0VSenVKTENPNlJRQ1lLMU03S3YvTGhMelNvVDZrcDdFd3lnNjdaZGZEOHZtd2d0WC9iNVRScDVGNC9wOHI2dnlzUVN2Ulp6bTUybGoreEtpajRyNjhhY0gvZlR2d2QrZ2lQcERKNzhuSi9NQitUSkRQeXMwUzN3Q2RGRC9CT0s4ZlFBQmN6ODduUmplaDVZQ0xYQTBEY3lYRDVMM3MwNXdEd3RUdTZBRWdDVENIOHh1R1NiOFg4ZkFzTGNTUGlBOExneEM1ajQ0QTk5MThCUzE4d0xyRU9pZmE4VmhnQm1KWVhVYWFMa3JHTzk0VkFtWEhVNzRpUUxpUlh1bTZzSVJXeWVoNXVDQmlScThBUWYvYjVnK0xreHhiVEFhU3g4Z0NMVDZjZEVtOTlQQkY4RllRMVg1QVhNNHNPRVpmZUZFSmF5UmFrUVNZaUNBT0VlYjZERjNxZkxod0tEWXgxQ2s4U0tCRE5VZjE4SEVRc2JDTHV0THBQZlNwY0l6Rm1RTGQyVE9JcWZCUjBlcUlvZVlsR1QrM2tSR1R6N3lrRG9SWmY0MnVZc3RtbElWa0F4REpndWtva2ErRWhXZ0ZFTmhWQ205KzhqeGxvNURKZjU0cVVucWRCS1lBQlFtRW1aNUhSN2VwWlRJQkI0Y2Rrbk1FVDNHbHRIMElDdVBVczFpVGdXYjJYeGNIWmpaVEpjY001b1N4QU0xdTRuSGUwQXptNTY0SkIvSTZjMTd1QktlMnR3ak8zdkp5RXB5TVoyQ29LY2l6VUhJUHNheUVBSmR6VGFuNmMrZnlUTVJDYjBST3hKMy84WmNMaUtpYlB4R1EyV2pUTlR0VTR6eG9LaUM2b2pRajNiVUVFU1V6MEpseWM2VjB1RjFjeFFuTCtqWmo0S3E1YVRxNUtWTHg3bFJPbjVqalR0ZDRnMHRTbzExaG84aktTVUtUdlhacUtEZVFhUzRBR2c4OXBhVHBLcmlvZmd3NmlqTjJWUE5PZlVPRDV1S1RUOGhWWkpZNjZ0NnFPUkJwNkpWYTM0RnFxWkI2eDhHSlZjOU5GQ21xQ0ZRWGZWUXNyTCtKanljeVJ4SjJTcEl0bFRPRTBRVmtHMW9NeUc4MGlneWUvVURYZnpxSTdkRTFnOXB3ZXFpa1BJZHpjTHFza29McldoSFM5clNtdmEwcUUydGFsZkwydGE2OXJXd2phMXNaMHZiMnRyMnRyak5yVzUzeTl2ZSt2YTN3QTJ1Y0lkTDNPSWF0eEVZTFphWmt0dlVHditZVkhlVmZhNXkyeWhkTkpHeXVucHlMbmE3ZE4zdFRrbTczclZSZDhQTEl2Q1M5MExqUGErRHpLdmU5NlMzdlVHaUFYelh1OXo1NW9lOTlwM1ZscGpiS1B6bTl6UHYvUytBNVN0Zy9kUzN3UHFWQVlJVEhOMEZENWk2RHRaTGdDUE1Od2hUR0M0SHZ2RFhDS3hoRE8rM3d4dTJNSWduckdIL2xqakRJSTRKaDFPODFITHdON3NyVGpHSkwyeGlHcU5ZeGpFZThZMTFMT0lPejVqQ05RYnlqbjJjWXlKL21NVXE3dkdKajR6a0lFZjR4MDh1OHBLUjlHTHJYc1FrV002eWxyZk01U3l6RThwTjdiS1l4NXpsNDVyNXpHaE9zNXJYek9ZMnUvbk5jSTZ6bk9kTTV6cmIrYzU0enJPZTk4em5QdnY1ejRBT3RLQUhUZWhDL3hiL3RJYkdTNUwvaW1oSWhLWFJla0FLcEJrQjJkOWtGRVNxbWJRZGJsZlo0WEhHTnM1a0QyQWZzeHhOejdPZVgzR1BxY0hxM3J2UU1xLzVXWFViNkVwcS9yMVZnYWxXRW1GdGJjNmo5dnA5c2lZRFZYK3RwR0N6VUdWbWJlNVVBMm5zTVREYkhFQ1Z5QmREall4Wk5oc01xcncyRk1qWkQyWnFXM0xkL0hZa3d6MVRrK0xqbytKMlNuTFRiY0Ruc3B1YjFYMzNGTEFyYjBSdXQ5N2I5aTYrR1ZkbEttcWozMGcwQk1EOW5ZMkJCNXlwNU4wMzVkcXI4QkswRmQxWk5YaFBHaDRDZzFPYkhSSjNJNnZQUy9GMnE3ZmpjUHA0cmtVK0I0c1A1dUhvQmprRUpLNXlLVEo4MWlULzY4dlRZUEw3Wkp6aUZtLzVHVmcrQnA0LzF1YzYvK1E0bUNFZTlIdDdpdVhwZnZIRmh4eHZsN3RiWDBBSG9VbDF2b2Viajd1YUpWdzZ4bVB1Y1dLNjhPRHpqT0hBdFczdEhoSThweG9QSTcxREtVazl0dk9sSHI1eTA5bU9iRFhlaU9vamZMdmFpVTUzNmdta3NKQURkU3IzeWU0V3dodndhckJPQXJIZVBWOFBmcEsyZy96aFJTbnZnbW5keVhwbnFaeCtnSElLaG9GRkM1VlZ3enQvNlNRbXN1ZTREZ0xvZFhraGx4NVI0ZXdiZ3VVTHYzclorMTNZbWd4cWw3NGRRaUtRbnArb1YrZ3dIVjhGdFYydTJHaEFQT2RCQjI0MG9SVmNOSmZvRVk1SUJlb3ZNL1ZvcVBUMG1XOUg3aSsvbklrSGFlRHFYbjN2QzFDdkhvM3M2N3QrKys0TGY5Wk1NSC96Mis5K2cwa2J1bFVJNVAvQ003OTE4bGVjekFCWVpoVW5mMDVSZXNzMlhTVERYVUtEZ0UzUU9jbm1mK0R6WFF1b2JOdDJlWXdFZ1JHb2F6S0RnYlMxZnVXaWdDTkFnS3NsZ2hkZ1pSdElnYlZsZlNaZ2dpY0lZN1pGZ2lVSWdpM29mTGFsZ2lzb2d6T0lnN0RsZ1NmQWdqckRnYTFsUExqamd6bElmSzVsZ3oyb2d5R0lmNndGZ3hsQWhFV0lmSytGaEVrb2dTaEFoYXJsaEUrb2hEK0lncW9saExMRGhWSG9lVitvaFZ0b2hmWUNoS1FGaG1HSWhsZG9odDZDaFNnQWhTN0RoS01GaDJlb2daK2pobEpqaDNNb2hnN25oMEdEaDNrb1hpNUFpSnZGaDFXb2g0cW1pQmFEaVBnQmlIWG9oWDFJaVh2b2hpdkFnNVhZWHdvbWlaUElpVXJEaG9maWlUZi9hSWtOSTRlWHlJaHRJWWp4QW9uN2c0a3RJSW9mSTR1akNJdU5hSXJlNG9xdnFJcDF3b3FmNVlncVFJZHRTSC82NG91MlFvcHZ5SUJ4Q0l6QmlJekpTSXpWWW96SGFJdXJ5SXhVWm8xcFNJM1ZDSTFIaDQzWnlJdWRpSXR2SW8ycGFJZzJnSXBNVjN0eDVJelI0bzBDUW83bFdGNW1CNHFWUW9zbndvN3RLSTRxWW8vM0tJVTVvSXU3eG8yWWgycjJKcEQ3Nkk3VFNJYi9pSkMwd1RvK3NIdVA1NEpEUjVBTDZZOTJwNDhWOG5zUHhnTVFPUnJLbUk0VVdaRUtlWkVHMldEWTU1RVd1UnNNYVV3bnlaRkdTSkkwbUNzYW1YWXFtWkovNTN4NEIzZUVvbm92V1pNMkdZM3ZWMEUvQ1pPdGh6SVBOd1FkS1pRS2xKTmpwRVJDdHBDVTN4ZHJvNlY5VDltVEVTbDVVMmxaS21HVkx1azlUQ2x3aytCVVVQbEFBOFZhWHpXV1Nua1lYMWxMWEhtVlNyR1dOSUtXWkRrV2NPa2pjaG1WRm1ob2Q4bDVlWmxvZTVsb1R2Q1hnQmwvYlRtWVN5Q1lodGs3aFptWTR6ZVVqQms5aS9tWVJZQ1lrcm1WamxtWlJrQ1ptTW1UbDdtWlNCbVpubWxDb0JtYUtEbVNwUGtTV2xhVXA3bWFyTm1hcnZtYXNCbWJzam1idEZtYnRubWJ1Sm1idXJtYnZObWJ2dm1id0JtY3dqbWN4Rm1jR0pBQUFDSDVCQVVBQUFZQUxMVUFGd0RGQUw4QUFBUC9hTEFiL2pCS1E2dTlPT3ZOdS85Z0tJNmpaSjRUcWE1czY3NHRLcDl3YmQ5NGZzMDhCT2pBb0hCbzZSbC94S1J5U1RMMmtNeW9kR3B3OHFEVXJGWm5uV0czNERDcksvdUt6K2dPR1dWT3U5L1Z0YWtOcjRmbGM3c2VqWmZROTRCTWZSRi9nWVpEZ3o2SGk0S0pEb1dNa1RXT2o1S1dRSlFCa0plY0paU2JuYUVlbWFDaXBobWtwNm9pcWF1dWFwK3ZzaHF0czdZVXRiZXp1YnF2dkwycnY4Q253c09peGNhZHlNbVh5OHlTenMrTTBkS0gxTldCMTloN21RSGJvZDNmeXBuaW5PSGxsdWZva2VycmkrM3VodkR4Z1BQMGV2YjNkZm42Yi96OWFmNEJQQ053NEIxeUJ1MFVUS2hsSVVNcURoOUtpU2l4RWFXS2JpaGlUS0p4L3lNaWhCNFBYZ3dwMGhISmtvbE9ndW1vRWdmTGxqWmV3b1FoYzZhTG1qYkhnTXk1QkNmUEpqdC9FdkVwTkFUUm9oK09Jb1UxY3FrUXBVNXBCWTNxY2lyVnExaXphdDNLdGF2WHIyRERpaDFMdHF6WnMyalRxbDNMdHEzYnQzRGp5cDFMdDY3ZHUzano2dDNMdDYvZnY0QURDeDVNdUxEaHc0Z1RLMTdNdUxIang1QWpTNTVNdWJMbHk1Z3phOTdNdWJQbno2QkRpeDVOdXJUcDA2aFRxMTdOdXJYcjE3Qmp5NTV0U1VDQjI3aHo2OTdOdTdmdjM4Qi9Dd2hwTzdqeDQ4aVQ2eDVBWExuejU5QnZNL2RZUExyMTY3Mm5iNnlPdlR0MkFzMjlpN2NPbnZyNDg4L0xiMGZQSHJsNmpOemJ5K2Y5dm1MOCtmaHhoOC9QLy9iKy9tSDUvUWZnZkFJTzJGNkJCcUtIWUlMakxjaWdkdzQraUYyRUVscEhZWVhRWFlpaGN2VkpkTitHNUdrSTRuRWRQdlRoaU9tSmlDSndKVEowNG9ySmFRY2ZqTmZKYUY5dkJPU280NDQ4RWpEQWowQUdLZVNQQWhScDVKRklDbUNGQlFrQUFDSDVCQVVBQUFZQUxPZ0FKZ0NBQUFrQkFBUC9hTHJjL3BBRkVLdTlPT3ZOSVFnZ1FIVmthWjRtcUU0ajZyNHd1YzVpYk4rNDhzMTBtLzlBRFc4NENScVBqeDJSNTBNNmM4dG84MGxGUmEvRnFyYWt4QkpyMjNERzY1Mkt6NHN1V1lwdUw5WnJzNXNLaDgvRjZ2cFNmai9xeVgxYmVYOU1nVnFFV0laVmc0Z3FpbFNNalZtUFNKSkxsRTZSalh5WU5wWkVuVWVhaUp5aExxT0lwa0dmUTZwQXFIK2xyaW1zTTdNNXNIcXl0eDIxdHJ5ZXZpcTd3Qm01ZXNVeHdvN0pMOGR3eE0wV3l5RFNMdFNUMWlUUGR0cTB5OUhlRGR4azRlSVMxT2N5MU9icTVJRHFITmp0NSs5ZThmTHArRUxzKzhiWS9zYjBDMmpCWGlLQzB3WWloSUF0d01JSUJxODhqREJ2WWhLQUZoMVV6TWdnLzJJVWpoMDNnalFnRXFUSFN5TVZsT1I0RWxUS2xrUG9pV3VZMGdETVFpbFhacno1SzZkQ2t4aHI4Z3hSTTJTdG9oby9JYjI0YWFtSFZFNHA2b3BhZ1J2VkM3bGtDajE0VmFETHJob0dhYVdxQnF5SkhXUE5walhMdHEzYnQzRGp5cDFMdDY3ZHUzano2dDNMdDYvZnY0QURDeDVNdUxEaHc0Z1RLMTdNdUxIang1QWpTNTVNdWJMbHk1Z3phOTdNdWJQbno2QkRpeDVOdXJUcDA2aFRxMTdOdXJYcjE3Qmp5NTVOdTdidDI3aHo2OTdOdTdmdjM4Q0RDeDlPdkxqeDQ4aVRLMS9PdkhuT3dBRUtFQkR3bDBDQjZ3UWM3bzErdmZ1QXZkYTdpNmQrVjRENDg5SzEwMFhQZm9CNnVBUFl5LzhPbDd0OCtlVGJocjh2UHp0YjgvLzhCZWdlV1BzRnlGOStUZ0Zvb0lIVE9XWGZnZ3Y2VjFSOEVGWllBSDBqUFdnaGhBaGFWT0NHRUVvNGtZSWdiaWdpUWgrV2FDR0dBVkdvNG9zZHFxUGhpeVdlZUU2S05KWTQ0RGt6NXZnaWk5Ymc2S09LRFZwRDRwQkQyZ2lNQUVJaXFTS1F4UnpwWkk0eEF1UGlsRGtXMlV3QVRXSnBvWks4Y09tbGoxQXVPYWFQVmZKeTVaa2dnbmxMQUd1eXVlSjd4WWdwcDQ3YU1IbG5pV25lSXVXZUROSlpUSnlBQ2lob21JUVdlbCtmczlpcEtJT011dkxubyt5NWVVdWlsSjVYcHBXWkduaG9tRjFTYWlrdmVuWjZYcVJtbW9yZHA5Wmd1aWVxVzdwNkpnRUxPUW9vck42VWV1ZW1BVTA2SmE3eHlFb2pyN1dHV2lPckU5bUtabFF5dnBxSUxFakNHZ2lzUlhEKzJKYXlFVDY3bEs0TFRsdFVzK0lSYTVhc283SlY3WHg1WWJ0alhpU1dPeGVGM3NLRmF3SUFJZmtFQlFBQUJnQXM2QUJoQUg4QUNnRUFBLzlvdXR6K01NcEpxNFhnNnMyNzcwQVFmR1Jwbms4b0JobnF2akMyem0xczMrU3NzM2p2VTZyZDdFY3NHb0pDbW5FWlF5WjF6S2pKK2RUVnBOaExkY3ZMZWlWVTd1NUxib1RGdTJzWmUwWUwxZXVsZXc2UC85cnpaTjF1dytlZmZENStmMDk3Z1NXRGhGV0hNSXFPSW9hTUdvbVBpNUlmbEpWVmtaY3ltcCtjblF1Wm4xeWhvcVdwSXFKZ3FxbW5oNlN1bTZ3cHM2QzFEN2VmdVE2eXUybTlETC9BU3NJS3hNVXJ4OGpLanJDQnpvclFmTW5LMUhiV3lzeEgwb1RZY2Q1LzRHdmF3T1JsNXNEYzZydm9aTzJ6NzJ2aWFQTng4YnpjdXZWNis1NzlWdHlURkhEWlB3b0JCNHJLWitxZ0Jta0tlekVVNHRERHVZb2VKbmJCYVBIL0ZVY1RwVDZlTUJkUjVET1JMMzZWUkxrZ3owcVd6Y1M4aERscXkweWFEQ3poeEJIbTVzNEdWbjRTVWVGVGFBcWpTSk1xWGNxMHFkT25VS05LblVxMXF0V3JXTE5xM2NxMXE5ZXZZTU9LSFV1MnJObXphTk9xWGN1MnJkdTNjT1BLblV1M3J0MjdlUFBxM2N1M3I5Ky9nQU1MSGt5NHNPSERpQk1yWHN5NHNlUEhrQ05Mbmt5NXN1WExtRE5yM3N5NXMrZlBvRU9MSGsyNnRPblRxRk9yWHMyNnRldlhzR1BMdGlDZ3JRQUNCVWFrRFlDN1FBRUNhUWY0SGw2Z2Rsa0J4SWtESDNzN2VmSUJZWGs3bjY2N3EvRHAwNkZ6Ulk2OWUvV3IwcnQzWDI0MXdIWHg0bzFUUFk4ZVBWWHU3ZU5yZnhvK3Z2M3ZTK0hidDArZWFZRDkvd0RtOXBSK0FZclhIMU85RllpZWV2NHBHQjlVN0RtWUhYMFNvb2VmVWdSV3FCeFVDV3FZSElOTC9lZWhjd2N1MWVHSXZvR29sSWdvRW5kaFVobU9PRjlUSjZMNElsSXN0dmdiaHpvT3AySlNPYlpZb2xJUm9qZ2pnajM2ZHFOUk1YbzRaRkkxanJpa1VFR2krQ1JTUlk3NEk1UkpGZ0JWa3hvZWFXS1hVLzVVNVloWEdwV2xoMlgrMUdXYVFvRlo0WlpJUmNrbWhVbUtTU1NaVUwzNVpaZDBHbVZuaFhDYTJhV2VTYTJwWVpzNG5la2hva2pKS1NHak9BMHFZYUU3T2FwaG9FSXBXaUZVbWxZSUtaTjhQbVdwZzVnMldxcFRweXFZS2syaFNzanBUNTVLR0ZXckJZNUs1YW8wSnZrcVRMRTZPT3RPdGJwNmE1TEQ0aVJwZ0RjRUpMc1RydkpSYXFpR3pWcFY3SGdDU010bHJ0cGlHT0FBenJMS1g3aDRHa2h1VklvMjIrMVUwNmxybG43dW9vVmJ2THVkeTB3Q0FDSDVCQVVBQUFZQUxMVUF1Z0RGQU1BQUFBUC9hTHJjL2pES1NhdTFJT2pOdS85Z0tJNGljSjFvcXE0WTZiNXcvTEYwYmQ5TUp1OThyK0hBb0RDaTh4bVBvYUZ5aVNzaW4wK21kSXB5UXE4OXFuWUxzV0svTUs1WTdBV2JSZU0wdFh4dWQ5VHdKZHROajl1RGMzcjd6cmZsOVdaOWdpdC9nRitEaUNlRmhsZUpqaFNMakZHUGxBK1Jra2VWbWptWWVwdWZsNTFabjVxaG9qdWtwYWQ3cVpTbXEyR3RqNit3THJLenRXQzNqclM1YUx1SXZiNGd3TUhEamNXQ3dzZHZ5WDNMUEFEUzA5VFYxdGZVenRyYjNOM2UzK0RoNHVQazVlYm42T25xNit6dDd1L3c4Zkx6OVBYMjkvajUrdnY4L2Y3L0FBTUtIRWl3b01HRENCTXFYTWl3b2NPSEVDTktuRWl4b3NXTEdETnEzTWl4LzZQSGp5QkRpaHhKc3FUSmt5aFRxbHpKc3FYTGx6Qmp5cHhKczZiTm16aHo2dHpKczZmUG4wQ0RDaDFLdEtqUm8waVRLbDNLdEtuVHAxQ2pTcDFLdGFyVnE0OEVhTjNLdGF2WHJ6d0xpQjFMdHF6WnMySFBxbDA3TmkzYnQyWGR3cDByZCs3YnVuYlg0czJMZGlmZnR3VDIvaDBiMk85Z3RZVjFIa1lzK0hEaW5JdlBQc1laMmV6a201WExYcmFabWV6bW1wMEpOeDc4bVdab3NhVm5uaTZRV3VicTFqRmZqLzRMRzZac3c2RnJ2MXc5WURiZjNyZzdBMWQ4ZWpqazRyN3pHcWVNUEhqbTVaaWJFdzhObmJQMDQ5U1QyNjBPK2pyejdNNHJDOUErZDN6NHlPYW5kMDZQZlQxNXVPeS91eisvT0g3MDBQYXQ0My8vTm4vMy9WMzBIZWFmYWFjTnFGcUIvTEVWUUlKckxSamdZQTZxbDFtRTdVM0lvRm9VeW1maGczOWxlRjluSHVvSDRvVm5oZmpmaUJ6eVpTS0JvYTE0WUlza211V2lhNmZOR0Z1Tk1jYVZJMWs5cmViVEJsb05JQ1FCUkJJSm1HNHZKUUFBSWZrRUJRQUFCZ0FzWUFEdUFBZ0JlQUFBQS85b3V0eitNTXBKcTcwNDY2MEEvMkFvam1ScG5oa1FCQjdxdm5Bc3orWnF0M1N1NzN5dnFUYWJiMGdzR2wzQkpPN0liRHFmd0dSdytheGFyekNwbG9YdGVyK2FyUmhNTHB1allpblZ6RzRiMC9DMWUwNlBvZUZiZVgzUEIrSC9lbjJDZ3hKM2YyS0JoSXFEaG9kcGlZdVJjNDZVSzVLWGZJMlZqNWlkYlp1Z2tKNmpScHFnZUtLa3FqdW5yUUdyc0VXdXJxbXh0aVNtczRlMXQ3MGJ1c0M4dnNNVHVjQ1V4TWtmeDh6Q3lzbkd6SlhPejc3UjBzalYyaEhYMklEYjRBN2V4OVRocTkzamNlYm02T2xqNitIdDdtcnc0Zk8wOWR2eTkxUDUydnY4TFBtckJwQmZ1WUdYQ3Q0N2lEQlN3RkFOb1QyY0ZsSGlSRWNNS3pLNmlGSC80ekNPamp4K0JJbEt4Z0FDQWtSYVVaZ3VJNFVBQldJU2VLVVNDa2t0TGlrUWlNbHpRTTBxTE1uRmdNbXphTXFmVG02dXlEbGhaOUdpTTVFMkNkcEtob0NuV0FzTW9DbTFGRWVtRXJLSzlkbjFDTldRTVFhSVhYdTBiSkd6NnJLc25SdlZyYXg1SnVmcTNXcVhDRng2Y3ZVS2J0dTN4OStsTXB3SzFvdXk4SkMvWUNGY1hVeTVybU1ld1JKVDNxejFzdUZaVmpsdkp1dVpSOEhJRDRpS1hzeTF0R21LYVZjdkp1ejY4eUVacW1XdkpWRDd5TGNZaW5XTGJkMzdNUnpjd3VrV241cEhjL0xoeTUzY1FmMWc4bk9zcEtNM3VUSGp1bGp0VjZnL1VPdjlLVzN3cEhLWEw4QWJmU3p5NjJNU2QrOUpmZm4yOUZVRlh6OC8veVhyLy9GbDUxOG4rM21IMzRDZEFMamVlUWhHRWg5UEJ6WW9DWHp4OVNmaElQWjVKK0NGaWhUb25ZVWM4cEhoZFF5RzJJZUh6MFZvb2lBS2xsZmlpbldnbUp5S01PNUJJWDgxWXZoZ1RCdm1TTWVONWZrb3lJalB2U2lrR1RJS1IrT1JiQkNaSEloTWtwR2tia3RHU1VhTEgxcEp4NDZkYWVrR2tONTU2WWFUd2hrcDVoVmdwbmhtazF4Q3VXWVZVOHJXNDV0WFlIbWRtM1EyRWVkcWMrYjVoSjB6K3ZrRm1icVpLYWdSYVFaNktCYUV5b2Jub2tQc0tWcWZrTXJTWnFWV1NNcVpvWmp5QUtpU25WWnhhYWhPQ0tEcFlsV1NPa1FBaWE3MnFLcWVuam9XckZldytoeXRqSjVVS0s1ZDJDcGFxcnd5WVNwbnJ3WkxoSytDQVd0c0V5UEQ2bFhzc3JJMG14V2wwRmFCTEZUVnRpSEFqWnhtVzBXenlucUxoYW5QaW90Q0FnQWgrUVFGQUFBR0FDd25BTzRBQWdGOUFBQUQvMmk2M1A0d3lqYkl2RGpyemJ2L1lDaU9rVkNjQXFtdWJPdStzQmdRNTJuRmVLN3ZmQjRNdFdDcVJ5d2FqMFZUY0JsQU9wL1FhR2EyckE2azJLeVcrS3Q2QzgydGVFd0dBYi9lVzNuTmJpc0VOUFIzNks3Ym9WUTVXbjN2KzNWbmVuSlhmNFdHS25DQ2ltR0hqWTRZZVlxQ2ZJK1ZsZ2FCa291WG5JMUttcHFVbmFOdGthQ2FkS1NxWkptbm9LdXdXNSt1cm9TeHQwaW10SzZNdUw0N3JidXVvci9GTExQQ3dyM0d6REp4eWRERXpkTWF3ZERDcWRUYUU4algxOHZiNFF1NjN0QzI0dWhkNWVVRTRPamEzZXU3Qk5udjhNL3l5ZlgyMCtUNXRlNzRNYlAyRDFRN2dlRVNGY1NHY0p1L2haTE9OV3hHRUtLZ0FRRW40b3BuY2Y5U1JvMnhIbmFVc3c4a3Jvb2p2MGcwK1F0bHlpVUhXVGJqK0RJSVBablVSTllzaWZNWHpaUXJlekxUQ1RHbTBHMC9DOTQ4S282b3ZLQk1zUUE0a3JRY3hxaGpBQVFJTUxXSTAyUkdzV2JSdW5VclZZZzh4VG9weTdackVYeFcxVzRoeTdiczJYVmg1VUtoVzVmdEVaZVM4dXAxd3Jkdld5TlZCYVVkek1XdzQ0OHhBS09CeXJoSTRjZUh2Y0pWSkxpeVpjeWc3d1plN0RuSFpkQjkzZmI0V29CMGFSeW9ZME9HVVpYeWF4Mm5aUnYrdTJmMjdSZTVkUnRXemNPZjY5OHVnZ3ZmalhpSmJlUTRsQyt2UzV6SG1hdlFrVWlmYnRmSUROL1pZWE5IWFQzOHJlM2p6UThkajFwOU1mVGN5N3RYQlgvNi9GL3NRY3UvMzZuK2N2Ny91T1NIMlg0QVd1S2ZjQVFXK01pQnVpa0lpNENQSmVqZ0lRektOcUVxRURvbTRZVi9WQmdiaDZOazZCaUluWWlZR29tWGVOZ2VpcGFZU0IyTGxhZ1lHb3lQdUpnWmpZM1kyQjJPRk9wb0ZvK0grTWdWa0liSWlCbVJoZ2k1SVpKakNNbGtoejR1K2FRV1NrNTVoNUdQV1hsSGxWclc0V1NYYm1BNUhKaHVmRW5tR21JeWQyWVpYSzZabFpsdWlwSG1pM0UyNldPZGIrb29KWjZyM2NtbkZuUFc5U2VnVVE2YUJaeUdQaEZvV1hzbUdnT2lqaDZ4NkZhTlJ1b0NwSlo2NVdlbWtoYks2UkdZZm9xYnA2STJwbU9wM3VtSktoR0xWcnFxRENhNittb0lZc282SzZ6c0FXRHJyYmhPdHl1dklqRDRLN0FqSUVoc0ZPZ05lNndLR1BvcHV5eXp3em43ckFxRjZUcXRHSXhLZXkwTDFvYVFBQUFoK1FRRkFBQUdBQ3dYQUxvQXVnREFBQUFEL3lpMTNQNHd5a25sTURqcnpidi9ZQ2lPcERaVWFLcXV6bFcrY0N6UDJjbmVlTzdTZk8vRHRweHdPTm45anNna2djaHNNb3pKcURTMmRGcUYwS2wyNjZsZXY2c3NkOHoxZ3M4VU1Ya2ROYVBmRHpWNzdvUGJJWEs2WG5idlAvZUFkWDU5ZVlHR0lJT0VoNHN2aVhlRmpKRUdqbmFRa291VWNKYVhocGx2bTV5QW5taWdvWHFqWjZXbWM2aGdxcXRyYnExRXI3Qmpzck5ZdHB5NHVUaTF1MXE5dml6QXdWTER4Q3JHeDBsQnlqck5qTS9RTjh6U1NRSGEyOXpkQVFMZzRlTGpBZ1BtNStqcDVnVHM3ZTd2dmRmWTgvVDE5dmY0K2ZyNy9QMysvd0FEQ2h4SXNLREJnd2dUS2x6SXNLSERoeEFqU3B4SXNhTEZpeGd6YXR6SXNmK2p4NDhnUTRvY1NiS2t5Wk1vVTZwY3liS2x5NWN3WThxY1NiT216WnM0YytyY3liT256NTlBZ3dvZFNyU28wYU5Ja3lwZHlyU3AwNmRRbzBxZFNyV3ExYXRZczJyZHlyV3IxNjlndzRvZFM3YXMyYk5vMDZwZHk3YXQyN2R3NHpJQ1FMZXUzYnQ0ODBiMXhyY3YzNzErQS9jRkxMandOc0tHQ3lOT0hIZ3g0OEZRSHl1T0xMa3g1Y3FRbjJMMjYzaXp0czZlUVc4V2pabDBaZE9TVVQ5V3paaDFZdGVHWVUvVzdObWJiTUczTGRPdXpTMDM1OHU4UHdNUDdqdXowK0M5aC9NdS9sZDViZWEyblllV1BwcDZhZXVuc2FmV3ZwcDdZZ0RRdVlIM2Juajg3dURtanlNUGtMN3BldmJodDdWbituNyswdnJ4dGRsWGlwOTg0ZjFKU2ZWM0htOEFJaVdnZXNnVmVOU0I3cTJub0ZFTTB1ZGdmdkQ1SjlpRFJVVjQzNFFXQm9ZaFVScnl4K0dBdFgwNFZJZ0Jqb2dnZWhTYUtCU0tCcTRuMVhzenlpalZYYUVsQUFBaCtRUUZBQUFHQUN3bkFHWUFkUUFBQVFBRC8yaTZ2Qkl0eWttcnZUaHJGa2daV3lpT1pLa01SVm9JWnV1K202Q3FCQVRmK052TjgyRG53Q0FHeGVPQmhNaWtvOGdrc0pSUTNJN1ovRVd2SkJsMWU4UjZOZFB0OXZrdFU0aGlzZFBNWm1qVDhGcWJqWWJEdS9QcjI4NG41NVVlZklJRmNuOUllNE44UG9aQVlZbURlSXd1aUkrRGZwSWtqcFdKaFpnamxKdUppNTRibXFHVmw2UVZvS2VQYTZvVnBxMmJuYkFOckxPYmtiWUdBWFc1czZtMnNzQ1Z0YndHdU1XY1ZyeSt5N203dzRIUXA4S3d5dFYyeDd5LzJxTE4wOStoMHRqam9kZXEzdWZiNGJERTdHTGxxdG54VE9tazYvWmI3dS9VKzJPUVNhZ1hqNERBTXdEdkhhUUE3NXpCaGF2KzJlc0hrWUUrYmZNcWNwRDRUZitqQmdFY2wrSHpHSUdnTVpJaG5rR2ppSkpoU0ZvdHN3QmpHVFBXUlVVMVRUUk1rM01TcXA0dmJoWjVDTlRGVGhVMGk4YTRvelRIemFSTlU0Yk1HTFVFSXFKVmdhQVptVlVuQWF4ZHc0b2RTN2FzMmJObzA2cGR5N2F0MjdkdzQ4cWRTN2V1M2J0NDgrcmR5N2V2MzcrQUF3c2VUTGl3NGNPSUV5dGV6TGl4NDhlUUkwdWVUTG15NWN1WU0ydmV6TG16NTgrZ1E0c2VUYnEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQWd3c2ZUcnk0OGVPNEF3UUFBQmlBY3VYTSt6NmZ6dGY1OU9mUjhWN2ZucDJ1OWUzWHU4Y0ZUeDZxMmZMbHhhLzlqaDY4ZXJUdDQ3OG55ejQrK2ZsaTdldkhYN1crZnZUZi9DbjEzNERteGVRZmdlV0pkU0NDN3VYSG9Id0tQaGpmV0JLMkYyQk9DMWFvSElVYTNoZGhoK0J4Q09KMUlvNkkzWWNtUGxkaWloZldsS0dHSzVyWW9vRXBVdWRnalFXMjlLS0VNOGFFNDRZMzF0Z2pTanRLR09PSVE1SlVKSU5Ka3ZSamprVCsyS1JIVHg0SjRwUVZMY21nbFIyT3BTV0JXRlpVSllvc2Nna2ptVEthV2FHYVJxS0pKSnNQZWlrbG5GdTZlU1dkQ01xSm81NUM0a2tnbjJVR21TS2dhUXI2cHAxZCt2bGZtRm51V2RhWDlqR3E1SWhxUVVvZVc1YUc1MWFtUUw1bHFhUktRVnJYa3FEMnQyTmVHVmJIblYvc0JlWmNxUllrQUFBaCtRUUZBQUFHQUN3bkFDb0FkUUFBQVFBRC8yaTYzUDR3eWtsTkNEWHJ6YnRYQWtGOFpHbWVJRkdzQXVxKzhDSU1hejNHZUw0RmRPMFB1cUN3RVFqNWpnWE1jSWt6SW84M3B0VEVlMXFWMHl6SGFVVkd0V0JKdGR0dGhjL0VnWXBNUnJzdFBUWVorQVp6NVdSc2ZUbkd5Nzk3UVhkK2JIcUJPUUtFaElDSE9HdUtjbWFOT1FHUWZvYVRMNCtXWFhTWk1aV2NoWjg0Y2FKUGpLUlVwMlNTcWlpSnJLaXZNSnV5Tlo2MEpyRzNSNWk2SHJhOXVjQWZvYjArdjhVYnBzaXB5eHJIeUN6UUpNM0kxU1RUUDlrZXZOdkszUkxDdDgvaUVkL1Q0ZWNQNUxMbTdBN1MwNjd4RXRlOTloWHp5TVQ2RC9odXJmdG53QjByZUFUVElhdEhzSUhCVXdqLzhldkZzT0dDaDZjRzZwdDR5LytmUlFVQlpXblV0ODNHeHdjS0taNTBnSkZUUkgwcE82NTBXSExGeUhnY1pYbjhHSkxWVFhZNUQ4NWswUE5VeFk4MVZ3eVZrWFNueFphY2ZwNExDbkdwQXFpV3BJcWpLdXFsdmFLaWpqYmtLc3FxZ1pnNnpXSlY1TFFoV3BkYTJhMWxJM1lsV1RadGg0THRRaUF1d2J0UTZwbzFzTmVINE1FS0NPVkZ6SlJOWDhZYURCSTRESmxCek1XVldSNFo0TGZ5c2NlWlA5Q2dITHEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQWd3c2ZUcnk0OGVQSWt5dGZ6cnk1OCtmUW8wdWZUcjI2OWV2WXMydmZ6cjI3OSsvZ3c0c2ZUNzY4K2ZQbzA2dGZ6NzY5Ky9mdzQ4dWZUNysrL2Z2NDgrdmZ6NysvLy8vL0FBWW80SUFFRmlqYkJia0JjRUVBQU5pbTRJSUl6dllnaEJjMEdOdUVGRmI0R29ZWkx0Z2FoeDB1YUdGcUlaYlltVVVnbWlpaWFTbXFDR0ZwTHNaWVdZc3hVamlpVlRUV21PRmdPdlo0NDBrNTl0amhURUVLMmVHUEVobXBKSXBLTm5uaUpFVTZXU0tTMlVocEpUdFJXbWtpbGJwa3FhV0tWWDc1SlplZmVDbW1pMlFlWXVhWkx0S3lKcHRidWdubm1ITE9hV1dhZTd4cFo0WjQxckhublhYK3FXU2ZiK2dwYUlTdkhOb2tvVzRZS2lpamFEajZKNlJvS0xxa0xwWUtTV21qbWNhNGFhR2R4cG1OcEYrZVE2cVVuMElacW9iMm5DcGtRNjU2eXVTaHFRSVQ2NUZMN1duV3JheWFkV2F0cG1vSkxFNVNzcmdvYW1zT0M2dU9HTXArRkNWc0tqWkxaSWpTTGdYaWJSQldPNWlDMmhLVUFBQWgrUVFGQUFBR0FDd1hBQmNBdWdDL0FBQUQvMmk2M1A0d3lrbXJ2VGk3d0lVWUlDR0tSV21laGFpdGJPdStNSVhPZEYzRWVLN3ZzTzNYdktCd09Qd1pUd0dpY3NuRUhKL0pwblE2ZlI2ajFLeVdaelZpdCtBd3EvdjdpczlvQ2RsblRydmZhMXY3VFJmSGEvTzZQbnVuNWZlQVRIMHpmNEdHUW9Nb2hZZU1PWWxJalpGRmp5V0xrcGNhbEpXWW5ER2FCWmFkb2hHZm9hT25ES1dvcXhXcXJLOFFud0t3dEEyeXRiZ0d0N20wdTd5dnZyK3J3Y0tueE1XaXg4aWN5c3VYemM2UjBOR00wOVNHMXRlQTJkcDYzTjEwbndQZ3o1cmo1TkxtNk9tVTUrdUg0dS9WNnZMWTlQWGI5L2plK3Z2aC9mN2N4QXRZWnlCQk9BQVAya21vRUl6QmhtYytFWUNZUmlKRk5CWXZMcVEwVWY5am1Jd2V0NEFNeVVkVFI1SWxPYUxVTW5KbGs1WXVsOENNU1dRbVRVUW1iNzdNcVZNbXo1NDFmd0xGcVhMb3BLSkdnM3k2a1ZUcHA2Wk9OVUhsOG5TcWpxVldyMWJONm1rcjF4Y2d3b29kUzdhc3U2OW8wNnBkeTdhdDI3ZHc0OHFkUzdldTNidDQ4K3JkeTdldjM3K0FBd3NlVExpdzRjT0lFeXRlekxpeDQ4ZVFJMHVlVExteTVjdVlNMnZlekxtejU4K2dRNHNlVGJxMDZkT29VNnRlemJxMTY5ZXdZOHVlVGJ1MjdkdTRjK3ZlemJ1Mzc5L0FOUURnUUx5NDhlUElreXRmenB3NXhlYlFvMHVmanZ3NTlldllzM093cnIyN2QrWGN2NHNYSDM2OCtlemx6NnVYbm42OSsrWHQzOHMzSG4rKy9mcjI1ZVBQNzM0L2YvVkUvdjFuWG9BQ2tnZFJnZndSaUdCM0NpNkkzb0VPNmdkaGhQMU5TQ0dBRmw0NFlJWWFHdGhRaHhoK0NPS0dJbzdvb1VJbWp1Y1JBQ3kyNk9LTE1NYm80b0lVSlFBQUlma0VCUUFBQmdBc0p3QW1BQUVCZkFBQUEvOW91dHorTU1wSnE3MDQ2ODI3R29JbmptUnBubWpLQ1VWQkNJRXF6M1J0MzFXcnZ6SHUvOENna0RIUUdYbkRwSExKdkFTTVVCZXNTYTFhZ1lSbzlIWHRlcjhpbGxiTEJadlBhRVoyUEFhbDMzQnFrVTBmOU9MNHZPMUo3eVAxZ0lFbGEzMStJWUtJaVJkaWhZMTJpcENSRFlTTmhXV1NtSUp6bFpVRW1aOTZmSnlWaDZDbWFaU2pkSjZucldhaXFuMTNyclJXcWJGYUE3VzdWWXk0Ykx6QlM3Qy9XcVhDeUQrYnhWdkp6ajdFekVheno5VXF0OUl1MXRzcXZ0azYxTnppSGRIZnV1UG9Ic3ZmTGVudUcrWFp4Ky8wRTlqU3JQWDZFZDdzNGZzQURiQ0RjaTZnUVFQci9CMDBHRTlhd1lYNzdqSExCMUZmdjIvektyNGJlRVQvNDc2RTMvNTVGTmVRMmNPUjZTUXlFNG5TMmtWNUxkK3AvRVV4cGppUTJWamFURmF5V00yZDFtYiswZ2swMkV1SFJjVUp4WldVRzA1cEdac0s2MGxUYWxDTzRLdytvNHJycDFaZVMyTVIvV3JxcVVteXlMakc4b3JXVlZoVlVkdWVVcXVLclZ4VGIwZU52UnZwNkZtK3RPaXEyZ3M0a2RsaWNRdExFc3pKcnVKSWVUa2xmcXpJcjAvS3BoaHpJb3c1eitGZkp6dEQwbHlKY3drQUFFVFhpRXdLQ0lBQXNGWExzRndWQ096YnFXV2Z3SnIxeCt2YnVIV1RvTjNWTmZEakFYSUw3eUNBdFN6YnlKRXZEek13ZEkzZjBZOHJuNzdoY3lQajJiTnY1NDRoZ0hNZGsxVmdEeCtkL0Fybmp0V3puei9ldlFYdlVFeVRtTTgvdWYwTS93SGdwNDF2L2ZWWDMzOFNtTmVJZmlNVTZDQ0NHRmhtSFEzck9VZ2ZoQmZnRko4S0ZuWjRJSVlPS0FoRmVpbFUyS0dCSUZJZzRvQSttSGhpZ1NsU0lBYURJcmo0SW9veFNrQWlDamJlV09DSE9RYlJvNDgvQnFuRWtFUVdhYVFRU0NhcDVKSTROT21rZzBCQ2VZS1VVejVvSllWWmR1bmZsak5nNlNWL1ZZSlo0NWhUbG1rbUIyS2l5ZDZhOHJsSnBKcHdhdENtbk1qUldXZDVlUHFvNTU0VjNOa25jSUNhSU9pZ1h4YmFJS0luL3Fsb0JJY2krdWdJa2ZicDZLUVBNT29ocGg1VWl1YWxuRDdnYVplaGxxQnBlS0NXQ3NHb1JLcDY1YW5CdVhvQ3JEVEtPZ0dyTU5vYUo1NnA2bW9CcnRuNXl1V253bDQzWnJFM0FOc3JzaXdaNE1wc2k2MCtTMkNqMGdaeFlyVk1Vb250RUZKdXE4U0YzaWJSWTdoTW1FZ3VGY0F0ZXk2UHNUR2JBQUE3XCIgYWx0PVwiTG9hZGluZy4uLlwiIC8+XHJcbi8vICAgPC9kaXY+XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2F0dC1ydHRhbWFwbGliJyxcclxuICB0ZW1wbGF0ZTogYCAgXHJcbiAgPGRpdiBzdHlsZT0ncG9zaXRpb246cmVsYXRpdmU7Jz5cclxuICA8ZGl2IGlkPSdteU1hcCcgY2xhc3M9J21hcGNsYXNzJyAjbWFwRWxlbWVudD5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGlkPVwidGlja2V0bW9kYWxcIiBjbGFzcz1cIm1vZGFsXCI+XHJcblx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCIgc3R5bGU9J21heC13aWR0aDozNzBweDsnPlx0XHRcdFxyXG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiIHN0eWxlPSdsaW5lLWhlaWdodDoxLjJlbTsnPlxyXG4gICAgICA8L2Rpdj5cdFx0XHRcclxuICAgICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuICBzdHlsZXM6IFtgXHJcbiAgLm1hcGNsYXNze1xyXG4gICAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gNGVtIC0gODBweCkgIWltcG9ydGFudDsgICAgXHJcbiAgICBkaXNwbGF5OmJsb2NrO1xyXG4gIH1cclxuICAubW9kYWx7XHJcbiAgICBwb3NpdGlvbjphYnNvbHV0ZTtcclxuICB9XHJcbiAgLmluZnlNYXBwb3B1cHtcclxuXHRcdG1hcmdpbjphdXRvICFpbXBvcnRhbnQ7XHJcbiAgICB3aWR0aDozMDBweCAhaW1wb3J0YW50O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCBsaWdodGdyYXk7IFxyXG4gIH0sXHJcbiAgLnBvcE1vZGFsQ29udGFpbmVye1xyXG4gICAgcGFkZGluZzoxNXB4O1xyXG4gIH1cclxuICAucG9wTW9kYWxIZWFkZXJ7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB3aWR0aDoxMDAlO1xyXG4gIH1cclxuICAucG9wTW9kYWxIZWFkZXIgYXtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIHBhZGRpbmc6NXB4IDEwcHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZjMTA3O1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjZmZjMTA3O1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6MTBweDtcclxuICAgIHRvcDo1cHg7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEhlYWRlciAuZmF7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6LTEwcHg7XHJcbiAgICByaWdodDotMTBweDtcclxuICBcclxuICB9XHJcbiAgLnBvcE1vZGFsQm9keSBsYWJlbHtcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcclxuICB9XHJcbiAgLnBvcE1vZGFsQm9keSBzcGFue1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcclxuICAgIHdvcmQtYnJlYWs6wqBicmVhay13b3JkO1xyXG4gIH1cclxuICAubWV0ZXJDYWwgc3Ryb25ne1xyXG4gICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcclxuICAgIGZvbnQtc2l6ZTogMjNweDtcclxuICB9XHJcbiAgLm1ldGVyQ2FsIHNwYW57XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICB9XHJcbiAgLnBvcE1vZGFsRm9vdGVyIC5jb2x7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEZvb3RlciAuZmF7XHJcbiAgICBwYWRkaW5nOjAgNXB4O1xyXG4gIH1cclxuLm1vZGFsLWJvZHkge21heC1oZWlnaHQ6NDUwcHg7IG92ZXJmbG93LXk6YXV0b31cclxuLnRrdEZvcm0gLmZvcm0tZ3JvdXAge21hcmdpbi1ib3R0b206NXB4fVxyXG4udGt0Rm9ybSAuZm9ybS1ncm91cCBkaXYgbGFiZWwge2ZvbnQtd2VpZ2h0OjUwMH1cclxuLnRvcEJvcmRlciB7Ym9yZGVyLXRvcDojZGJkYmRiIDFweCBzb2xpZDt9XHJcblxyXG4udGV4dC1zdWNjZXNzIHtjb2xvcjojNWNiODVjfVxyXG4udGV4dC1kYW5nZXIge2NvbG9yOiNkOTUzNGZ9XHJcbiNtb3JlRm9ybUNvbnRlbnRCdG4sICNtb3JlRm9ybUNvbnRlbnRCdG46aG92ZXIgIHsgICAgXHJcbiAgIFxyXG4gICAgYmFja2dyb3VuZDp0cmFuc3BhcmVudDtcclxuICAgIGJvcmRlcjowXHJcbn1cclxuI21vcmVGb3JtQ29udGVudEJ0bjpmb2N1cyAgeyAgICBcclxuICAgIG91dGxpbmU6MFxyXG59XHJcblxyXG4gIGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBSdHRhbWFwbGliQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgY29ubmVjdGlvbjtcclxuICBtYXA6IGFueTtcclxuICBjb250ZXh0TWVudTogYW55O1xyXG4gIHRlY2huaWNpYW5QaG9uZTogc3RyaW5nO1xyXG4gIHRlY2huaWNpYW5FbWFpbDogc3RyaW5nO1xyXG4gIHRlY2huaWNpYW5OYW1lOiBzdHJpbmc7XHJcbiAgdHJhdmFsRHVyYXRpb247XHJcbiAgdHJ1Y2tJdGVtcyA9IFtdO1xyXG4gIHRlc3RDbGFzcyA9IFwicG9zaXRpb246cmVsYXRpdmU7XCI7XHJcblxyXG4gIGRpcmVjdGlvbnNNYW5hZ2VyO1xyXG4gIHRyYWZmaWNNYW5hZ2VyOiBhbnk7XHJcblxyXG4gIHRydWNrTGlzdCA9IFtdO1xyXG4gIHRydWNrV2F0Y2hMaXN0OiBUcnVja0RldGFpbHNbXTtcclxuICBidXN5OiBhbnk7XHJcbiAgbWFwdmlldyA9ICdyb2FkJztcclxuICBsb2FkaW5nID0gZmFsc2U7XHJcbiAgQFZpZXdDaGlsZCgnbWFwRWxlbWVudCcpIHNvbWVJbnB1dDogRWxlbWVudFJlZjtcclxuICBteU1hcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNteU1hcCcpO1xyXG4gIHJlYWR5ID0gZmFsc2U7XHJcbiAgYW5pbWF0ZWRMYXllcjtcclxuICAvLyBAVmlld0NoaWxkKCdzbXNwb3B1cCcpIHNtc3BvcHVwOiBQb3B1cDtcclxuICAvLyBAVmlld0NoaWxkKCdlbWFpbHBvcHVwJykgZW1haWxwb3B1cDogUG9wdXA7XHJcbiAgQFZpZXdDaGlsZCgnaW5mbycpIGluZm9UZW1wbGF0ZTogRWxlbWVudFJlZjtcclxuICBzb2NrZXQ6IGFueSA9IG51bGw7XHJcbiAgc29ja2V0VVJMOiBzdHJpbmc7XHJcbiAgcmVzdWx0cyA9IFtcclxuICBdO1xyXG4gIHB1YmxpYyB1c2VyUm9sZTogYW55O1xyXG4gIGxhc3Rab29tTGV2ZWwgPSAxMDtcclxuICBsYXN0TG9jYXRpb246IGFueTtcclxuICByZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscyA9IFtdO1xyXG4gIHJlcG9ydGluZ1RlY2huaWNpYW5zID0gW107XHJcbiAgaXNUcmFmZmljRW5hYmxlZCA9IDA7XHJcbiAgbG9nZ2VkVXNlcklkID0gJyc7XHJcbiAgbWFuYWdlclVzZXJJZCA9ICcnO1xyXG4gIGNvb2tpZUFUVFVJRCA9ICcnO1xyXG4gIGZlZXQ6IG51bWJlciA9IDAuMDAwMTg5Mzk0O1xyXG4gIElzQXJlYU1hbmFnZXIgPSBmYWxzZTtcclxuICBJc1ZQID0gZmFsc2U7XHJcbiAgZmllbGRNYW5hZ2VycyA9IFtdO1xyXG4gIC8vIFdlYXRoZXIgdGlsZSB1cmwgZnJvbSBJb3dhIEVudmlyb25tZW50YWwgTWVzb25ldCAoSUVNKTogaHR0cDovL21lc29uZXQuYWdyb24uaWFzdGF0ZS5lZHUvb2djL1xyXG4gIHVybFRlbXBsYXRlID0gJ2h0dHA6Ly9tZXNvbmV0LmFncm9uLmlhc3RhdGUuZWR1L2NhY2hlL3RpbGUucHkvMS4wLjAvbmV4cmFkLW4wcS17dGltZXN0YW1wfS97em9vbX0ve3h9L3t5fS5wbmcnO1xyXG5cclxuICAvLyBUaGUgdGltZSBzdGFtcHMgdmFsdWVzIGZvciB0aGUgSUVNIHNlcnZpY2UgZm9yIHRoZSBsYXN0IDUwIG1pbnV0ZXMgYnJva2VuIHVwIGludG8gNSBtaW51dGUgaW5jcmVtZW50cy5cclxuICB0aW1lc3RhbXBzID0gWyc5MDA5MTMtbTUwbScsICc5MDA5MTMtbTQ1bScsICc5MDA5MTMtbTQwbScsICc5MDA5MTMtbTM1bScsICc5MDA5MTMtbTMwbScsICc5MDA5MTMtbTI1bScsICc5MDA5MTMtbTIwbScsICc5MDA5MTMtbTE1bScsICc5MDA5MTMtbTEwbScsICc5MDA5MTMtbTA1bScsICc5MDA5MTMnXTtcclxuXHJcbiAgdGVjaFR5cGU6IGFueTtcclxuXHJcbiAgdGhyZXNob2xkVmFsdWUgPSAwO1xyXG5cclxuICBhbmltYXRpb25UcnVja0xpc3QgPSBbXTtcclxuXHJcbiAgZHJvcGRvd25TZXR0aW5ncyA9IHt9O1xyXG4gIHNlbGVjdGVkRmllbGRNZ3IgPSBbXTtcclxuICBtYW5hZ2VySWRzID0gJyc7XHJcblxyXG4gIHJhZGlvdXNWYWx1ZSA9ICcnO1xyXG5cclxuICBmb3VuZFRydWNrID0gZmFsc2U7XHJcblxyXG4gIGxvZ2dlZEluVXNlclRpbWVab25lID0gJ0NTVCc7XHJcbiAgY2xpY2tlZExhdDsgYW55O1xyXG4gIGNsaWNrZWRMb25nOiBhbnk7XHJcbiAgZGF0YUxheWVyOiBhbnk7XHJcbiAgcGF0aExheWVyOiBhbnk7XHJcbiAgaW5mb0JveExheWVyOiBhbnk7XHJcbiAgaW5mb2JveDogYW55O1xyXG4gIGlzTWFwTG9hZGVkID0gdHJ1ZTtcclxuICBXb3JrRmxvd0FkbWluID0gZmFsc2U7XHJcbiAgU3lzdGVtQWRtaW4gPSBmYWxzZTtcclxuICBSdWxlQWRtaW4gPSBmYWxzZTtcclxuICBSZWd1bGFyVXNlciA9IGZhbHNlO1xyXG4gIFJlcG9ydGluZyA9IGZhbHNlO1xyXG4gIE5vdGlmaWNhdGlvbkFkbWluID0gZmFsc2U7XHJcbiAgQElucHV0KCkgdGlja2V0TGlzdDogYW55ID0gW107XHJcbiAgQElucHV0KCkgbG9nZ2VkSW5Vc2VyOiBzdHJpbmc7XHJcbiAgQE91dHB1dCgpIHRpY2tldENsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICB0aWNrZXREYXRhOiBUaWNrZXRbXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWFwU2VydmljZTogUnR0YW1hcGxpYlNlcnZpY2UsXHJcbiAgICAvL3ByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIFxyXG4gICAgLy9wdWJsaWMgdG9hc3RyOiBUb2FzdHNNYW5hZ2VyLCBcclxuICAgIHZSZWY6IFZpZXdDb250YWluZXJSZWZcclxuICAgICkge1xyXG4gICAgLy90aGlzLnRvYXN0ci5zZXRSb290Vmlld0NvbnRhaW5lclJlZih2UmVmKTtcclxuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XHJcbiAgICB0aGlzLmNvb2tpZUFUVFVJRCA9IFwia3I1MjI2XCI7Ly90aGlzLnV0aWxzLmdldENvb2tpZVVzZXJJZCgpO1xyXG4gICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFucyA9IFtdO1xyXG4gICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFucy5wdXNoKHRoaXMuY29va2llQVRUVUlEKTtcclxuICAgIHRoaXMudHJhdmFsRHVyYXRpb24gPSA1MDAwO1xyXG4gICAgLy8gLy8gdG8gbG9hZCBhbHJlYWR5IGFkZHJlZCB3YXRjaCBsaXN0XHJcbiAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMudHJ1Y2tMaXN0ID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja1dhdGNoTGlzdCcpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgIHRoaXMubG9nZ2VkVXNlcklkID0gdGhpcy5tYW5hZ2VyVXNlcklkID0gXCJrcjUyMjZcIjsvL3RoaXMudXRpbHMuZ2V0Q29va2llVXNlcklkKCk7XHJcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgIC8vdGhpcy5jaGVja1VzZXJMZXZlbChmYWxzZSk7XHJcbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSAnY29tcGxldGUnKSAge1xyXG4gICAgICBkb2N1bWVudC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcclxuICAgICAgICAgIHRoaXMubWFwdmlldyA9ICdyb2FkJztcclxuICAgICAgICAgIHRoaXMubG9hZE1hcFZpZXcoJ3JvYWQnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5uZ09uSW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcclxuICAgICAgICB0aGlzLm1hcHZpZXcgPSAncm9hZCc7XHJcbiAgICAgICAgdGhpcy5sb2FkTWFwVmlldygncm9hZCcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAgICBcclxuICB9XHJcblxyXG4gIGNoZWNrVXNlckxldmVsKElzU2hvd1RydWNrKSB7XHJcbiAgICB0aGlzLmZpZWxkTWFuYWdlcnMgPSBbXTtcclxuICAgIC8vIEFzc2lnbiBsb2dnZWQgaW4gdXNlclxyXG4gICAgdmFyIG1nciA9IHsgaWQ6IHRoaXMubWFuYWdlclVzZXJJZCwgaXRlbU5hbWU6IHRoaXMubWFuYWdlclVzZXJJZCB9O1xyXG4gICAgdGhpcy5maWVsZE1hbmFnZXJzLnB1c2gobWdyKTtcclxuXHJcbiAgICAvLyBDb21tZW50IGJlbG93IGxpbmUgd2hlbiB5b3UgZ2l2ZSBmb3IgcHJvZHVjdGlvbiBidWlsZCA5MDA4XHJcbiAgICB0aGlzLklzVlAgPSB0cnVlO1xyXG5cclxuICAgIC8vIENoZWNrIGlzIGxvZ2dlZCBpbiB1c2VyIGlzIGEgZmllbGQgbWFuYWdlciBhcmVhIG1hbmFnZXIvdnBcclxuICAgIHRoaXMubWFwU2VydmljZS5nZXRXZWJQaG9uZVVzZXJJbmZvKHRoaXMubWFuYWdlclVzZXJJZCkudGhlbigoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgIGlmICghalF1ZXJ5LmlzRW1wdHlPYmplY3QoZGF0YSkpIHtcclxuICAgICAgICBsZXQgbWFuYWdlcnMgPSAnZic7XHJcbiAgICAgICAgbGV0IGFtYW5hZ2VycyA9ICdlJztcclxuICAgICAgICBsZXQgdnAgPSAnYSxiLGMsZCc7XHJcblxyXG4gICAgICAgIGlmIChkYXRhLmxldmVsLmluZGV4T2YobWFuYWdlcnMpID4gLTEpIHtcclxuICAgICAgICAgIC8vIHRoaXMuSXNWUCA9IElzU2hvd1RydWNrO1xyXG4gICAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLm1hbmFnZXJJZHMgPSB0aGlzLmZpZWxkTWFuYWdlcnMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtWydpZCddO1xyXG4gICAgICAgICAgfSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIC8vIHRoaXMuZ2V0VGVjaERldGFpbHNGb3JNYW5hZ2VycygpO1xyXG4gICAgICAgICAgLy8gdGhpcy5Mb2FkVHJ1Y2tzKHRoaXMubWFwLCBudWxsLCBudWxsLCBudWxsLCBmYWxzZSk7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgLy8kKCcjbG9hZGluZycpLmhpZGUoKSBcclxuICAgICAgICB9LCAzMDAwKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRhdGEubGV2ZWwuaW5kZXhPZihhbWFuYWdlcnMpID4gLTEpIHtcclxuICAgICAgICAgIHRoaXMuZmllbGRNYW5hZ2VycyA9IFtdO1xyXG4gICAgICAgICAgdmFyIGFyZWFNZ3IgPSB7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLm1hbmFnZXJVc2VySWQsXHJcbiAgICAgICAgICAgIGl0ZW1OYW1lOiBkYXRhLm5hbWUgKyAnICgnICsgdGhpcy5tYW5hZ2VyVXNlcklkICsgJyknXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgdGhpcy5maWVsZE1hbmFnZXJzLnVuc2hpZnQoYXJlYU1ncik7XHJcbiAgICAgICAgICB0aGlzLmdldExpc3RvZkZpZWxkTWFuYWdlcnMoKTtcclxuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxldmVsLmluZGV4T2YodnApID4gLTEpIHtcclxuICAgICAgICAgIHRoaXMuSXNWUCA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLklzQXJlYU1hbmFnZXIgPSBmYWxzZTtcclxuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vdGhpcy50b2FzdHIud2FybmluZygnTm90IHZhbGlkIEZpZWxkL0FyZWEgTWFuYWdlciEnLCAnTWFuYWdlcicsIHsgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlIH0pXHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvL3RoaXMudG9hc3RyLndhcm5pbmcoJ1BsZWFzZSBlbnRlciB2YWxpZCBGaWVsZC9BcmVhIE1hbmFnZXIgYXR0dWlkIScsICdNYW5hZ2VyJywgeyBzaG93Q2xvc2VCdXR0b246IHRydWUgfSlcclxuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgY29ubmVjdGluZyB3ZWIgcGhvbmUhJywgJ0Vycm9yJylcclxuICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGlzdG9mRmllbGRNYW5hZ2VycygpIHtcclxuICAgIHRoaXMubWFwU2VydmljZS5nZXRXZWJQaG9uZVVzZXJEYXRhKHRoaXMubWFuYWdlclVzZXJJZCkudGhlbigoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgIGlmIChkYXRhLlRlY2huaWNpYW5EZXRhaWxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBmb3IgKHZhciB0ZWNoIGluIGRhdGEuVGVjaG5pY2lhbkRldGFpbHMpIHtcclxuICAgICAgICAgIHZhciBtZ3IgPSB7XHJcbiAgICAgICAgICAgIGlkOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmF0dHVpZCxcclxuICAgICAgICAgICAgaXRlbU5hbWU6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0ubmFtZSArICcgKCcgKyBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmF0dHVpZCArICcpJ1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHRoaXMuZmllbGRNYW5hZ2Vycy5wdXNoKG1ncik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLklzVlAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLklzQXJlYU1hbmFnZXIgPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuSXNWUCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gZmFsc2U7XHJcbiAgICAgICAgLy90aGlzLnRvYXN0ci53YXJuaW5nKCdEbyBub3QgaGF2ZSBhbnkgZGlyZWN0IHJlcG9ydHMhJywgJ01hbmFnZXInKTtcclxuICAgICAgfVxyXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGNvbm5lY3Rpbmcgd2ViIHBob25lIScsICdFcnJvcicpO1xyXG4gICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRUZWNoRGV0YWlsc0Zvck1hbmFnZXJzKCkge1xyXG4gICAgaWYgKHRoaXMubWFuYWdlcklkcyAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMubWFwU2VydmljZS5nZXRXZWJQaG9uZVVzZXJEYXRhKHRoaXMubWFuYWdlcklkcykudGhlbigoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKGRhdGEuVGVjaG5pY2lhbkRldGFpbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgZm9yICh2YXIgdGVjaCBpbiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMucHVzaChkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmF0dHVpZCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGF0dHVpZDogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQsXHJcbiAgICAgICAgICAgICAgbmFtZTogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5uYW1lLFxyXG4gICAgICAgICAgICAgIGVtYWlsOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmVtYWlsLFxyXG4gICAgICAgICAgICAgIHBob25lOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLnBob25lXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gICAgXHJcbiAgbG9hZE1hcFZpZXcodHlwZTogU3RyaW5nKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLnRydWNrSXRlbXMgPSBbXTtcclxuICAgIHZhciBsb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbig0MC4wNTgzLCAtNzQuNDA1Nyk7XHJcblxyXG4gICAgaWYgKHRoaXMubGFzdExvY2F0aW9uKSB7XHJcbiAgICAgIGxvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRoaXMubGFzdExvY2F0aW9uLmxhdGl0dWRlLCB0aGlzLmxhc3RMb2NhdGlvbi5sb25naXR1ZGUpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5tYXAgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteU1hcCcpLCB7XHJcbiAgICAgIGNyZWRlbnRpYWxzOiAnQW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNaicsXHJcbiAgICAgIGNlbnRlcjogbG9jYXRpb24sXHJcbiAgICAgIG1hcFR5cGVJZDogdHlwZSA9PSAnc2F0ZWxsaXRlJyA/IE1pY3Jvc29mdC5NYXBzLk1hcFR5cGVJZC5hZXJpYWwgOiBNaWNyb3NvZnQuTWFwcy5NYXBUeXBlSWQucm9hZCxcclxuICAgICAgem9vbTogMTIsXHJcbiAgICAgIGxpdGVNb2RlOiB0cnVlLFxyXG4gICAgICAvL25hdmlnYXRpb25CYXJPcmllbnRhdGlvbjogTWljcm9zb2Z0Lk1hcHMuTmF2aWdhdGlvbkJhck9yaWVudGF0aW9uLmhvcml6b250YWwsXHJcbiAgICAgIGVuYWJsZUNsaWNrYWJsZUxvZ286IGZhbHNlLFxyXG4gICAgICBzaG93TG9nbzogZmFsc2UsXHJcbiAgICAgIHNob3dUZXJtc0xpbms6IGZhbHNlLFxyXG4gICAgICBzaG93TWFwVHlwZVNlbGVjdG9yOiBmYWxzZSxcclxuICAgICAgc2hvd1RyYWZmaWNCdXR0b246IHRydWUsXHJcbiAgICAgIGVuYWJsZVNlYXJjaExvZ286IGZhbHNlLFxyXG4gICAgICBzaG93Q29weXJpZ2h0OiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIC8vTG9hZCB0aGUgQW5pbWF0aW9uIE1vZHVsZVxyXG4gICAgLy9NaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKFwiQW5pbWF0aW9uTW9kdWxlXCIpO1xyXG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnQW5pbWF0aW9uTW9kdWxlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgfSk7XHJcbiAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLm1hcCwgJ3ZpZXdjaGFuZ2VlbmQnLCAoKSA9PiB7IFxyXG4gICAgICB3aW5kb3cuc2V0VGltZW91dCh0aGF0LnNldFpvb21Qb3NpdGlvbiwxMDAwMCk7XHJcbiAgICAgfSk7XHJcblxyXG4gICAgICBcclxuICAgIC8vU3RvcmUgc29tZSBtZXRhZGF0YSB3aXRoIHRoZSBwdXNocGluXHJcbiAgICB0aGlzLmluZm9ib3ggPSBuZXcgTWljcm9zb2Z0Lk1hcHMuSW5mb2JveCh0aGlzLm1hcC5nZXRDZW50ZXIoKSwge1xyXG4gICAgICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmluZm9ib3guc2V0TWFwKHRoaXMubWFwKTtcclxuICAgIFxyXG4gICAgLy8gQ3JlYXRlIGEgbGF5ZXIgZm9yIHJlbmRlcmluZyB0aGUgcGF0aC5cclxuICAgIHRoaXMucGF0aExheWVyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxheWVyKCk7XHJcbiAgICB0aGlzLm1hcC5sYXllcnMuaW5zZXJ0KHRoaXMucGF0aExheWVyKTtcclxuXHJcbiAgICAvLyBMb2FkIHRoZSBTcGF0aWFsIE1hdGggbW9kdWxlLlxyXG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGgnLCBmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucycsIGZ1bmN0aW9uICgpIHsgfSk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgbGF5ZXIgdG8gbG9hZCBwdXNocGlucyB0by5cclxuICAgIHRoaXMuZGF0YUxheWVyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkVudGl0eUNvbGxlY3Rpb24oKTtcclxuXHJcbiAgICAvLyBBZGQgYSByaWdodCBjbGljayBldmVudCB0byB0aGUgbWFwXHJcbiAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLm1hcCwgJ3JpZ2h0Y2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBjb25zdCB4MSA9IGUubG9jYXRpb247XHJcbiAgICAgIHRoYXQuY2xpY2tlZExhdCA9IHgxLmxhdGl0dWRlO1xyXG4gICAgICB0aGF0LmNsaWNrZWRMb25nID0geDEubG9uZ2l0dWRlO1xyXG4gICAgICB0aGF0LnJhZGlvdXNWYWx1ZSA9ICcnO1xyXG4gICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ3Nob3cnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vbG9hZCB0aWNrZXQgZGV0YWlsc1xyXG4gICAgdGhpcy5hZGRUaWNrZXREYXRhKHRoaXMubWFwLCB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyKTtcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgc2V0Wm9vbVBvc2l0aW9uKCl7XHJcbiAgICAkKCcuTmF2QmFyX0NvbnRhaW5lci5MaWdodCcpLmF0dHIoJ3N0eWxlJywnYm90dG9tOjMwcHg7dG9wOnVuc2V0ICFpbXBvcnRhbnQ7Jyk7ICAgIFxyXG4gIH1cclxuXHJcbiAgTG9hZFRydWNrcyhtYXBzLCBsdCwgbGcsIHJkLCBpc1RydWNrU2VhcmNoKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMudHJ1Y2tJdGVtcyA9IFtdO1xyXG5cclxuICAgIGlmICghaXNUcnVja1NlYXJjaCkge1xyXG5cclxuICAgICAgdGhpcy5tYXBTZXJ2aWNlLmdldE1hcFB1c2hQaW5EYXRhKHRoaXMubWFuYWdlcklkcykudGhlbigoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSAmJiBkYXRhLnRlY2hEYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHZhciB0ZWNoRGF0YSA9IGRhdGEudGVjaERhdGE7XHJcbiAgICAgICAgICB2YXIgZGlyRGV0YWlscyA9IFtdO1xyXG4gICAgICAgICAgdGVjaERhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5sb25nID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGl0ZW0ubG9uZyA9IGl0ZW0ubG9uZ2c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGl0ZW0udGVjaElEICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIHZhciBkaXJEZXRhaWw6IFRydWNrRGlyZWN0aW9uRGV0YWlscyA9IG5ldyBUcnVja0RpcmVjdGlvbkRldGFpbHMoKTtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwudGVjaElkID0gaXRlbS50ZWNoSUQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxhdCA9IGl0ZW0ubGF0O1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMb25nID0gaXRlbS5sb25nO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TGF0ID0gaXRlbS53ckxhdDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExvbmcgPSBpdGVtLndyTG9uZztcclxuICAgICAgICAgICAgICBkaXJEZXRhaWxzLnB1c2goZGlyRGV0YWlsKTtcclxuICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdmFyIHJvdXRlTWFwVXJscyA9IFtdO1xyXG4gICAgICAgICAgcm91dGVNYXBVcmxzID0gdGhpcy5tYXBTZXJ2aWNlLkdldFJvdXRlTWFwRGF0YShkaXJEZXRhaWxzKTtcclxuXHJcbiAgICAgICAgICBmb3JrSm9pbihyb3V0ZU1hcFVybHMpLnN1YnNjcmliZShyZXN1bHRzID0+IHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IHJlc3VsdHMubGVuZ3RoIC0gMTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHJvdXRlRGF0YSA9IHJlc3VsdHNbal0gYXMgYW55O1xyXG4gICAgICAgICAgICAgIGxldCByb3V0ZWRhdGFKc29uID0gcm91dGVEYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgICBpZiAocm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcyAhPSBudWxsXHJcbiAgICAgICAgICAgICAgICAmJiByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTGF0ID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzBdXHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxvbmcgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMV1cclxuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTGF0ID0gbmV4dFNvdXJjZUxhdDtcclxuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTG9uZyA9IG5leHRTb3VyY2VMb25nO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGxpc3RPZlBpbnMgPSBtYXBzLmVudGl0aWVzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0T2ZQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcclxuICAgICAgICAgICAgICB2YXIgdGVjaElkID0gbGlzdE9mUGlucy5nZXQoaSkubWV0YWRhdGEuQVRUVUlEO1xyXG4gICAgICAgICAgICAgIHZhciB0cnVja0NvbG9yID0gbGlzdE9mUGlucy5nZXQoaSkubWV0YWRhdGEudHJ1Y2tDb2wudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICB2YXIgY3VyUHVzaFBpbiA9IGxpc3RPZlBpbnMuZ2V0KGkpO1xyXG4gICAgICAgICAgICAgIHZhciBjdXJyRGlyRGV0YWlsID0gW107XHJcblxyXG4gICAgICAgICAgICAgIGN1cnJEaXJEZXRhaWwgPSBkaXJEZXRhaWxzLmZpbHRlcihlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRlY2hJZCA9PT0gdGVjaElkKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICB2YXIgbmV4dExvY2F0aW9uO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoY3VyckRpckRldGFpbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0TG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMYXQsIGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTG9uZyk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAobmV4dExvY2F0aW9uICE9IG51bGwgJiYgbmV4dExvY2F0aW9uICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBpbkxvY2F0aW9uID0gbGlzdE9mUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0Q29vcmQgPSB0aGF0LkNhbGN1bGF0ZU5leHRDb29yZChwaW5Mb2NhdGlvbiwgbmV4dExvY2F0aW9uKTtcclxuICAgICAgICAgICAgICAgIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHBpbkxvY2F0aW9uLCBuZXh0Q29vcmQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihjdXJQdXNoUGluLCB0cnVja1VybCwgYmVhcmluZywgZnVuY3Rpb24gKCkgeyB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLm1hcFNlcnZpY2UuZ2V0VHJ1Y2tGZWVkKHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsIHRoaXMubWFuYWdlcklkcykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMuc29tZSh4ID0+IHgudG9Mb3dlckNhc2UoKSA9PSBkYXRhLnRlY2hJRC50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBkYXRhKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgZmV0Y2hpbmcgdHJ1Y2tzIGZyb20gS2Fma2EgQ29uc3VtZXIuIEVycm9ycy0+ICcgKyBlcnIuRXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignTm8gdHJ1Y2sgZm91bmQhJywgJ01hbmFnZXInKTtcclxuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGZldGNoaW5nIGRhdGEgZnJvbSBBUEkhJywgJ0Vycm9yJyk7XHJcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgY29uc3QgbXRycyA9IE1hdGgucm91bmQodGhhdC5nZXRNZXRlcnMocmQpKTtcclxuICAgICAgdGhpcy5tYXBTZXJ2aWNlLmZpbmRUcnVja05lYXJCeShsdCwgbGcsIG10cnMsIHRoaXMubWFuYWdlcklkcykudGhlbigoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSAmJiBkYXRhLnRlY2hEYXRhLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICBjb25zdCB0ZWNoRGF0YSA9IGRhdGEudGVjaERhdGE7XHJcbiAgICAgICAgICBsZXQgZGlyRGV0YWlscyA9IFtdO1xyXG4gICAgICAgICAgdGVjaERhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5sb25nID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGl0ZW0ubG9uZyA9IGl0ZW0ubG9uZ2c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKChpdGVtLnRlY2hJRCAhPSB1bmRlZmluZWQpICYmIChkaXJEZXRhaWxzLnNvbWUoeCA9PiB4LnRlY2hJZCA9PSBpdGVtLnRlY2hJRCkgPT0gZmFsc2UpKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGRpckRldGFpbDogVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzID0gbmV3IFRydWNrRGlyZWN0aW9uRGV0YWlscygpO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC50ZWNoSWQgPSBpdGVtLnRlY2hJRDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTGF0ID0gaXRlbS5sYXQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxvbmcgPSBpdGVtLmxvbmc7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMYXQgPSBpdGVtLndyTGF0O1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TG9uZyA9IGl0ZW0ud3JMb25nO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbHMucHVzaChkaXJEZXRhaWwpO1xyXG4gICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgIHRoYXQuZm91bmRUcnVjayA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHZhciByb3V0ZU1hcFVybHMgPSBbXTtcclxuICAgICAgICAgIHJvdXRlTWFwVXJscyA9IHRoaXMubWFwU2VydmljZS5HZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlscyk7XHJcblxyXG4gICAgICAgICAgZm9ya0pvaW4ocm91dGVNYXBVcmxzKS5zdWJzY3JpYmUocmVzdWx0cyA9PiB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSByZXN1bHRzLmxlbmd0aCAtIDE7IGorKykge1xyXG4gICAgICAgICAgICAgIGxldCByb3V0ZURhdGEgPSByZXN1bHRzW2pdIGFzIGFueTtcclxuICAgICAgICAgICAgICBsZXQgcm91dGVkYXRhSnNvbiA9IHJvdXRlRGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgICAgaWYgKHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMgIT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgJiYgcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxhdCA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1swXVxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMb25nID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzFdXHJcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxhdCA9IG5leHRTb3VyY2VMYXQ7XHJcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxvbmcgPSBuZXh0U291cmNlTG9uZztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBsaXN0T2ZQaW5zID0gdGhhdC5tYXAuZW50aXRpZXM7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RPZlBpbnMuZ2V0TGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHB1c2hwaW4gPSBsaXN0T2ZQaW5zLmdldChpKTtcclxuICAgICAgICAgICAgICBpZiAocHVzaHBpbiBpbnN0YW5jZW9mIE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZWNoSWQgPSBwdXNocGluLm1ldGFkYXRhLkFUVFVJRDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRydWNrQ29sb3IgPSBwdXNocGluLm1ldGFkYXRhLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyckRpckRldGFpbCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGN1cnJEaXJEZXRhaWwgPSBkaXJEZXRhaWxzLmZpbHRlcihlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQudGVjaElkID09PSB0ZWNoSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRMb2NhdGlvbjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VyckRpckRldGFpbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIG5leHRMb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxhdCwgY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMb25nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dExvY2F0aW9uICE9IG51bGwgJiYgbmV4dExvY2F0aW9uICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgcGluTG9jYXRpb24gPSBsaXN0T2ZQaW5zLmdldChpKS5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgbmV4dENvb3JkID0gdGhhdC5DYWxjdWxhdGVOZXh0Q29vcmQocGluTG9jYXRpb24sIG5leHRMb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHBpbkxvY2F0aW9uLCBuZXh0Q29vcmQpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdHJ1Y2tVcmwgPSB0aGlzLmdldFRydWNrVXJsKHRydWNrQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4ocHVzaHBpbiwgdHJ1Y2tVcmwsIGJlYXJpbmcsIGZ1bmN0aW9uICgpIHsgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBMb2FkIHRoZSBzcGF0aWFsIG1hdGggbW9kdWxlXHJcbiAgICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIC8vIFJlcXVlc3QgdGhlIHVzZXIncyBsb2NhdGlvblxyXG5cclxuICAgICAgICAgICAgICBjb25zdCBsb2MgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odGhhdC5jbGlja2VkTGF0LCB0aGF0LmNsaWNrZWRMb25nKTtcclxuICAgICAgICAgICAgICAvLyBDcmVhdGUgYW4gYWNjdXJhY3kgY2lyY2xlXHJcbiAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IE1pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoLmdldFJlZ3VsYXJQb2x5Z29uKGxvYyxcclxuICAgICAgICAgICAgICAgIHJkLFxyXG4gICAgICAgICAgICAgICAgMzYsXHJcbiAgICAgICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aC5EaXN0YW5jZVVuaXRzLk1pbGVzKTtcclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgcG9seSA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2x5Z29uKHBhdGgpO1xyXG4gICAgICAgICAgICAgIHRoYXQubWFwLmVudGl0aWVzLnB1c2gocG9seSk7XHJcbiAgICAgICAgICAgICAgLy8gQWRkIGEgcHVzaHBpbiBhdCB0aGUgdXNlcidzIGxvY2F0aW9uLlxyXG4gICAgICAgICAgICAgIGNvbnN0IHBpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKGxvYyxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2h0dHBzOi8vYmluZ21hcHNpc2RrLmJsb2IuY29yZS53aW5kb3dzLm5ldC9pc2Rrc2FtcGxlcy9kZWZhdWx0UHVzaHBpbi5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgxMiwgMzkpLFxyXG4gICAgICAgICAgICAgICAgICB0aXRsZTogcmQgKyAnIG1pbGUocykgb2YgcmFkaXVzJyxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICB2YXIgbWV0YWRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBMYXRpdHVkZTogbHQsXHJcbiAgICAgICAgICAgICAgICBMb25naXR1ZGU6IGxnLFxyXG4gICAgICAgICAgICAgICAgcmFkaXVzOiByZFxyXG4gICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHBpbiwgJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoYXQucmFkaW91c1ZhbHVlID0gcmQ7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNsaWNrZWRMYXQgPSBsdDtcclxuICAgICAgICAgICAgICAgIHRoYXQuY2xpY2tlZExvbmcgPSBsZztcclxuICAgICAgICAgICAgICAgIGpRdWVyeSgnI215UmFkaXVzTW9kYWwnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICBwaW4ubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgICAgICAgICAgICB0aGF0Lm1hcC5lbnRpdGllcy5wdXNoKHBpbik7XHJcbiAgICAgICAgICAgICAgdGhhdC5kYXRhTGF5ZXIucHVzaChwaW4pO1xyXG5cclxuICAgICAgICAgICAgICAvLyBDZW50ZXIgdGhlIG1hcCBvbiB0aGUgdXNlcidzIGxvY2F0aW9uLlxyXG4gICAgICAgICAgICAgIHRoYXQubWFwLnNldFZpZXcoeyBjZW50ZXI6IGxvYywgem9vbTogOCB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBsZXQgZmVlZE1hbmFnZXIgPSBbXTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLm1hcFNlcnZpY2UuZ2V0VHJ1Y2tGZWVkKHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsIHRoaXMubWFuYWdlcklkcykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGRpckRldGFpbHMuc29tZSh4ID0+IHgudGVjaElkLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gZGF0YS50ZWNoSUQudG9Mb2NhbGVMb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIGZldGNoaW5nIHRydWNrcyBmcm9tIEthZmthIENvbnN1bWVyLiBFcnJvcnMtPiAnICsgZXJyLkVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ05vIHRydWNrIGZvdW5kIScsICdNYW5hZ2VyJyk7XHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBmZXRjaGluZyBkYXRhIGZyb20gQVBJIScsICdFcnJvcicpO1xyXG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGdldFRydWNrVXJsKGNvbG9yKSB7XHJcbiAgICBsZXQgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUhrbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUm1NMlZpTVdRdE5HSmxaQzFqTmpRMExUZ3pZbVV0WWpRNVlqWmxORGxtWW1SbUlpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdFeE5UQmxZVEV0TWpKaFl5MDNPVFE1TFRoaU5tRXRaV1UxTVRjNFpUQm1NV0ZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T21Zd1pXUXhaV00zTFRNMU9UQXRaR0UwWWkwNU1XSXdMVFl3T1RRMlpqRmhOV1E1WXp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkyUEM5eVpHWTZiR2srSUR3dmNtUm1Pa0poWno0Z1BDOXdhRzkwYjNOb2IzQTZSRzlqZFcxbGJuUkJibU5sYzNSdmNuTStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTBWREU1T2pBNE9qQXpMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzFaRFEyTURjMVppMDRNbVJtTFdZM05EQXRZbVUzWlMxbU4ySTBNemxtWWpjeU16RWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRWVU1UazZNak02TXpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21Ga1pqTmxZakZrTFRSaVpXUXRZelkwTkMwNE0ySmxMV0kwT1dJMlpUUTVabUprWmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhPVlF4TlRvME9Ub3dNUzB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NGRiN3ZqQUFBQ2UwbEVRVlJJeDkyV1RXdFRRUlNHbnpOemIzTFR0S0cxV2xId3E0dUNiWVgrQTEyNUVMY3V1aWhDUlhDcDJIM0JoU3YvZ1V2QmdsSnc0VUxCaWdwU2FVRmNpRkxGalNBdHNYNjFTZE0wdlhOYzlOb2tSWk9ZQVJYbk1xdTV6RFBublBlOE00R3E4cWRId0Y4WS94NzA2ck9KbnBUSXRhZGY3bysrTHkrVnJaaGtSWkw1WXpqRXhPbjFGNW1wc1VQbmJreU1UVDVxR3pwWG1SbFpMdWJIUDdLRTdVcG4ySzYvMURGVndXU2htRnNkZi9oMlpueUNTV2svdmZlNmU3NE52U2F6SjBmc0t2VnJkZm9Uekthd1hpb3lOLys4NUZmVEo3dW4zS2Njd2RraUZCc2RYb2xUSUhtRHpIYjUxYlRuY0E0WE9HSVJORlNrUVhkWm82ZzFaTG9qNndXTkJtUTA3TlZwOGluc2hpQU5ndFhWTW1GWHlJR2gvYWU4b0ErQzIvbkFXQXAzaE9CRDlNdS9OUWE2SGRualpZYlA5SjhHWnRxR0hoemMyMUZJclJIczJ5QW94dzFQTDFsRmcwMEcwa2N1QXBmYWhpNi9MTnpxN092bDVQbWpsSXRyYUNKWlFSQ3Q1bHBGeVVScDVtOHVNUDE1cW5UNXhKWDIwMXV1YktTemJxczdKSFkxWVNuVVFCRkZqUUVNWDlkV1BHMVFRbFVVUjR5cXJmcUIxcmVwS0RoaW5DaEk2QWZWUks2U2ZQVjI4SE92c0JnL3FCTkZoR1NieGxlZ2s2UU16dmVXVVdvTVFacnZKbXlMclcyb1FaQVl6Ry9jODk1UUVXa3B3QzB4bWVUQ2M1N3BSVnRsWXRRZ0N0WVhLaUswL29SeWlGSEVlQW9wZHE3RzVMVnBOYXZUSjFMVm1wcEtNK0hpV3RONFkyaGFMSW9tS2RZbVFrcjYyaGVxQXNZSzFnaGhGTzRBUzEzYUF3dGlEV3g2UW91MlpES2xISXR2VnFsVTFsSFZxaUZxblNNUWhTR3VaTkNPNWxKcUNCM2NkV3hsNGQycnp0bnJpeGhyY0FsMFp6cFVoVmdkVWRUSmNQOUl3UXQ2OThManZ2L21oZjhkdEdIbGg0djVSMUlBQUFBQVNVVk9SSzVDWUlJPSc7XHJcblxyXG4gICAgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ2dyZWVuJykge1xyXG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSGttbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TkRrNk1ERXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TkRrNk1ERXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdSbU0yVmlNV1F0TkdKbFpDMWpOalEwTFRnelltVXRZalE1WWpabE5EbG1ZbVJtSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaR0V4TlRCbFlURXRNakpoWXkwM09UUTVMVGhpTm1FdFpXVTFNVGM0WlRCbU1XRmtJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPbVl3WldReFpXTTNMVE0xT1RBdFpHRTBZaTA1TVdJd0xUWXdPVFEyWmpGaE5XUTVZend2Y21SbU9teHBQaUE4Y21SbU9teHBQbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJQQzl5WkdZNmJHaytJRHd2Y21SbU9rSmhaejRnUEM5d2FHOTBiM05vYjNBNlJHOWpkVzFsYm5SQmJtTmxjM1J2Y25NK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMFZERTVPakE0T2pBekxUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvMVpEUTJNRGMxWmkwNE1tUm1MV1kzTkRBdFltVTNaUzFtTjJJME16bG1ZamN5TXpFaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVFZVTVRrNk1qTTZNekV0TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPbUZrWmpObFlqRmtMVFJpWldRdFl6WTBOQzA0TTJKbExXSTBPV0kyWlRRNVptSmtaaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE9WUXhOVG8wT1Rvd01TMHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOEwzSmtaanBUWlhFK0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0lEd3ZjbVJtT2xKRVJqNGdQQzk0T25odGNHMWxkR0UrSUR3L2VIQmhZMnRsZENCbGJtUTlJbklpUHo0ZGI3dmpBQUFDZTBsRVFWUkl4OTJXVFd0VFFSU0duek56YjNMVHRLRzFXbEh3cTR1Q2JZWCtBMTI1RUxjdXVpaENSWENwMkgzQmhTdi9nVXZCZ2xKdzRVTEJpZ3BTYVVGY2lGTEZqU0F0c1g2MVNkTTB2WE5jOU5va1JaT1lBUlhuTXF1NXpEUG5uUGU4TTRHcThxZEh3RjhZL3g3MDZyT0pucFRJdGFkZjdvKytMeStWclpoa1JaTDVZempFeE9uMUY1bXBzVVBuYmt5TVRUNXFHenBYbVJsWkx1YkhQN0tFN1VwbjJLNi8xREZWd1dTaG1Gc2RmL2gyWm55Q1NXay92ZmU2ZTc0TnZTYXpKMGZzS3ZWcmRmb1R6S2F3WGlveU4vKzg1RmZUSjd1bjNLY2N3ZGtpRkJzZFhvbFRJSG1EekhiNTFiVG5jQTRYT0dJUk5GU2tRWGRabzZnMVpMb2o2d1dOQm1RMDdOVnA4aW5zaGlBTmd0WFZNbUZYeUlHaC9hZThvQStDMi9uQVdBcDNoT0JEOU11L05RYTZIZG5qWlliUDlKOEdadHFHSGh6YzIxRklyUkhzMnlBb3h3MVBMMWxGZzAwRzBrY3VBcGZhaGk2L0xOenE3T3ZsNVBtamxJdHJhQ0paUVJDdDVscEZ5VVJwNW04dU1QMTVxblQ1eEpYMjAxdXViS1N6YnFzN0pIWTFZU25VUUJGRmpRRU1YOWRXUEcxUVFsVVVSNHlxcmZxQjFyZXBLRGhpbkNoSTZBZlZSSzZTZlBWMjhIT3ZzQmcvcUJORmhHU2J4bGVnazZRTXp2ZVdVV29NUVpydkpteUxyVzJvUVpBWXpHL2M4OTVRRVdrcHdDMHhtZVRDYzU3cFJWdGxZdFFnQ3RZWEtpSzAvb1J5aUZIRWVBb3BkcTdHNUxWcE5hdlRKMUxWbXBwS00rSGlXdE40WTJoYUxJb21LZFltUWtyNjJoZXFBc1lLMWdoaEZPNEFTMTNhQXd0aURXeDZRb3UyWkRLbEhJdHZWcWxVMWxIVnFpRnFuU01RaFNHdVpOQ081bEpxQ0IzY2RXeGw0ZDJyenRucml4aHJjQWwwWnpwVWhWZ2RVZFRKY1A5SXdRdDY5OExqdnYvbWhmOGR0R0hsaDR2NVIxSUFBQUFBU1VWT1JLNUNZSUk9JztcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAncmVkJykge1xyXG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSDNtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRJNk1qRXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRJNk1qRXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TURWak16YzFaRFl0TVdObE9DMWtaalJsTFRnd1lqZ3RNamxtWVRSaFpqQTJaREUzSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaR1JtTUdJelltRXRNV05pWkMxaE1qUTBMV0V5WldNdE1UZzRZVGxrT0dSbE1qazBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPakF3TURKbE5EaGxMVGhtT1dVdE5qVTBZeTA1WWpRMkxUVm1ZV1prTVRCaE4yRTJOend2Y21SbU9teHBQaUE4Y21SbU9teHBQbUZrYjJKbE9tUnZZMmxrT25Cb2IzUnZjMmh2Y0RwbU1HVmtNV1ZqTnkwek5Ua3dMV1JoTkdJdE9URmlNQzAyTURrME5tWXhZVFZrT1dNOEwzSmtaanBzYVQ0Z1BISmtaanBzYVQ1NGJYQXVaR2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmp3dmNtUm1PbXhwUGlBOEwzSmtaanBDWVdjK0lEd3ZjR2h2ZEc5emFHOXdPa1J2WTNWdFpXNTBRVzVqWlhOMGIzSnpQaUE4ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQSEprWmpwVFpYRStJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKamNtVmhkR1ZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZOV1EwTmpBM05XWXRPREprWmkxbU56UXdMV0psTjJVdFpqZGlORE01Wm1JM01qTXhJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMVZERTVPakl6T2pNeExUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvd05XTXpOelZrTmkweFkyVTRMV1JtTkdVdE9EQmlPQzB5T1daaE5HRm1NRFprTVRjaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCs3U2RBd0FBQUFzcEpSRUZVU01mbGw3dHJGRkVZeFgvZm5abGROd21KR2tLSUNENGlJV0tsSW9xclZqNDZRVkJzZllENEgyaGhiWkFVMm9pSW5WcUlXR2hsSTZnZ0JsRjhCTjhoS29oRW9oSTFiamI3dVBlejJOSGRUZHpaWlNkbzRRemZiZVlPNTU3dm5IdnVqS2dxZi9zeS9JUExqM3I0OU00OWhzZHVKVm9HTDY3b0hDZGhBK05temhHVWJDRW5EN2N1bjlqVHVmckQyTEpldStYd3dlWkJiNTQ4c1hqRFpPNzBzbHh5WGI3RHBVUW9hNkZsV09jOFdmOW9ZblNzOSswRitsYWVBNmFhQnYxMGUyak5GNXZkdWE1L0pkYk9JRmxoQlRXSzFmemE5dWZEaXdyYmRud0JMamF0NlJ2RDRJK1dkbkNHZ3RQcTBuTFpJa0NDSjByUGxZY1B6c2N5MHQxUEgvdSsrVWJyMmswc1NUeWVHY1BBMWN1NVdLQ1pydTR6ODdIVG9NeFRhbFpTQmFSSWQ2RGoyOUtianNaeTc3Nyt2bFAyNVl0RE53SWZEWUlxSWFYQ1NFWU1NTTJTbkxHNzNvMWZpd1c2dTZkNzcvd0g5NHZYWHc1N1daRUtJSkFLUDNuT3A4UGxTVTk4NzFwMTVtd2lGdWp6a2RIOS9SMmR5UzJaSDNnSm56K2xsd0FPaC9vcEpsdVV6eU92RG5SQlpJc2xLZ2FQdGJYbXQyY0x3ZExOYWV6Q0JlRGNyQzFUWW13aG1VSmVqM0RweVdPT3FFclRUQ1dUTGJaNnlhRE5HSnhVQ1ZuRlZNVmc4RkR4U0VBMlZuc3hCc1ZndzZKR1Y0eDFxSEdJay9qWjZ3QW5KWUtpMVNsVUZVNENpSUNVM29uSEZGQlZTbmZac2JOQkZSVkZhT3lZakF3SFQ4RlpDMW9iTU55cGdHQ2RhK2lzOU91dlNGQTBIRFZLaUhEZVhMVDNONUJFTk5nQWpabW9JVkFKaDErNjFXSmE4dEljdU5jVHJVUkZOSUtwQ0lqTWphWUZWU3dPRThIVWQ0cFR4VGI0a1ZlM3ZRZ0lJY3VvZEZOcFdOWG9HSlF3RDR3Qno5Uk1CNmNPTVZKYVhGelFoQXF0bnVCbE01aEpIN1VXQ2RzK3k5TUpoeWtXQ0Jvd1V5Um96bG52dmJPTURnMVZnWmh3WjhvTTdnSHdHYnhZb09tQjQxOU5NZCtHeXhVVTU3UWlDaXBQdUZJSkJ0OXNERkpUZFczeTMveFcvQVJOcGp2eGw4MHVMQUFBQUFCSlJVNUVya0pnZ2c9PSc7XHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ3llbGxvdycpIHtcclxuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUlLbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5UZzZOVFV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5UZzZOVFV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUTRNakZrWmpNdFptRmxOQzB4TWpRekxUbGpaVFV0Wm1Ga04yRTJNVGRtTlRVM0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpVd04ySXhZbU10TkRCa1pTMHdaRFF5TFdJd1pUY3RNR1U0TmpObU56VmtOakEwSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEbzRNemN4WTJVMllTMHhZV1prTFRFME5ETXRPVGd4WkMxa04yRTROR1kxTm1VMFpXVThMM0prWmpwc2FUNGdQSEprWmpwc2FUNWhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpCbFpERmxZemN0TXpVNU1DMWtZVFJpTFRreFlqQXROakE1TkRabU1XRTFaRGxqUEM5eVpHWTZiR2srSUR4eVpHWTZiR2srZUcxd0xtUnBaRG80T0dRek5UWmhOeTAzTVRneExXVTFOR0V0T1RsbVpTMDBPREJsTXpWaFl6WTJaalk4TDNKa1pqcHNhVDRnUEM5eVpHWTZRbUZuUGlBOEwzQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSGh0Y0UxTk9raHBjM1J2Y25rK0lEeHlaR1k2VTJWeFBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpWTNKbFlYUmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG80T0dRek5UWmhOeTAzTVRneExXVTFOR0V0T1RsbVpTMDBPREJsTXpWaFl6WTJaallpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UUlVNVGs2TURnNk1ETXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qVmtORFl3TnpWbUxUZ3laR1l0WmpjME1DMWlaVGRsTFdZM1lqUXpPV1ppTnpJek1TSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TlZReE9Ub3lNem96TVMwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdRNE1qRmtaak10Wm1GbE5DMHhNalF6TFRsalpUVXRabUZrTjJFMk1UZG1OVFUzSWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTVWREUxT2pVNE9qVTFMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BuZXdZNlVBQUFKRVNVUkJWRWpIM1ZZeGF4UlJFUDYrOS9heXVkVUlrU05uQ0FvUmxZaUlXZ21DaFJEc1JVdGJDMytBbHNIV3dsWWJpMWhwWXhFRW0xaXBNUkJSRVVROGdvMlNIQ2tpM2wyNDNON3V6VmdrSm5mSHVidTVGeEp3NExIRnpzNDM4MzN6Wm9lcWlyMDJnMzJ3ZlFIMWtsNVdWbitWdjN5NEZ4dzc4a3dPRFIyRXlJWVUyaVAxOVZEd2MrV2lHVDkxdjE0Y0hSOU5pc3NrVGFjZlhHdGNuWHpyRjBaK0l3elo5bFUzdENESWU1aDkxY1NhWEFwdjNKd2I3SnZlVDU4L3l0SnlEYW9XYkQ5aVFmRzJEdFNEVWhERkZxVnZKWEhTZEhwR01MOUErRUZ5RUFWaFNVVHhBQjQveWJ0cDJsQkJzd1hBRXRacU83ZGRtU3RvRmJSQUxRcmRRR2RuSHFKVnZZMXF0UUxHQnY5U24xRFVRb1ZxQTFOM2I2V0NNbTA0dkg2UjE3bUZZUWdEV0x0TmFFZWxhbUFOY081TUdaUFgxK2dFK3ZUUlVXMjJobEE0L0FOeFJORDJ2RENnS093QU1IRkM4ZnpsMlBxZHFjV2diM3BQbjZ4aHRUNk9rV0lSS2dyVm5wS0NDbmcrOFdaK0JXT0ZpcHVtVVd3UVJ6SE9uajhPU01xTXpnK2d2TlJDNGNDeUcrZ1drK3NSNHBZa3V1VUl4RkdNTURTT29HeDdNc1dQdXpSN3Q2dE5pYW85RXUwWFZEdm1yS1l6b3J0VXFUSmpwWnVkcmE2Z1pIZlVoRUwxYjRLdTlITG5uY0lNYm9uOWJWUkJFRHZabzlRVkZKcXRQdDBjU3dSaE1pVG9wWEZGQXBxbGU5bGpvZWl2ZTZWTm8vVHVKYk9KbWdocVFmaStCMlRVZEFOUEhLK01XdjIrMk9UbEt4Nk1tRVJHTUppRDczdXdvSEVDSFM3Nks4VjZJWGovTGhJVmR2ekt1aTNuQTZXdkRYTmh3dGFkTjRmL1pzUC9Bd3p0NVIzYnNRMmpBQUFBQUVsRlRrU3VRbUNDJztcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAncHVycGxlJykge1xyXG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSDNtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURNdE1ESlVNVEk2TWpBNk16TXRNRFU2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURNdE1ESlVNVEk2TWpBNk16TXRNRFU2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WWpWbVltVTNZall0WkdRMU9DMWpOelJpTFRobVpHWXRZakprTmpVMU5UWTNPVEUwSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaakF4Tm1abU5qY3RZV1l4WkMwMk1UUTVMVGd6TWpRdFpETTBPR1kxTnpnMFpUazBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPakF3TURKbE5EaGxMVGhtT1dVdE5qVTBZeTA1WWpRMkxUVm1ZV1prTVRCaE4yRTJOend2Y21SbU9teHBQaUE4Y21SbU9teHBQbUZrYjJKbE9tUnZZMmxrT25Cb2IzUnZjMmh2Y0RwbU1HVmtNV1ZqTnkwek5Ua3dMV1JoTkdJdE9URmlNQzAyTURrME5tWXhZVFZrT1dNOEwzSmtaanBzYVQ0Z1BISmtaanBzYVQ1NGJYQXVaR2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmp3dmNtUm1PbXhwUGlBOEwzSmtaanBDWVdjK0lEd3ZjR2h2ZEc5emFHOXdPa1J2WTNWdFpXNTBRVzVqWlhOMGIzSnpQaUE4ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQSEprWmpwVFpYRStJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKamNtVmhkR1ZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZOV1EwTmpBM05XWXRPREprWmkxbU56UXdMV0psTjJVdFpqZGlORE01Wm1JM01qTXhJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMVZERTVPakl6T2pNeExUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwaU5XWmlaVGRpTmkxa1pEVTRMV00zTkdJdE9HWmtaaTFpTW1RMk5UVTFOamM1TVRRaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCszNDEzandBQUF1cEpSRUZVU01mbGw4OXZWRlVVeHovbjN2dW0wNExsVjhEd2ExR1JOb1M0d0tZUTQwcHdSUWc3b3dsdWNDRWJOcXp3RDJDSEN6ZktRbGVXeEJCV0pwQzRRellFUThMQ0tLTFNBRldVU0pCU3kwdzc3OTV6WEx3cG5hWXowenF2MFlWbmNpZVpuSnYzdmVmNy9aNXozNGlaOFcrSDR6K0kwQzE1Y2Z3U0QyOWVxZVFYWG5tNU5yMnBJbG5TcGFjV0dyRXV6L1plZVRLNjY5aURxYUhmMG9rejcvUU9ldU96bXp1R3B0NzhlR3NhR3RPMWpYNG44bHdMYThJcm9FR2xPams2TVpNOUdHZllQZ1ZxUFlOT1huLzY2dnJHMDZON2RtNGcxN1FvWnkzQ1pBTEVOQnB2cmQ4bWI4dzhCczczck9tanl2MnpzLzAxb2dsUjQ2S1ZiR0hWVTZJUllDSjh2L1hxajE5OVhzcEkzODE4TTF3UDA5YkNhdHVvQUk0KzdsZHVjLzdyVCtaS2djYU45WE12NkxwWkFUS3JkbHllUGpLQkY5UG1QMTdiOS9vSHBkeDdlTWRiSDZWYjZmMXZCNjZpWWtoTFRxejRaWUFpVktPd3FiWXo3ZjM1NkplbFFBOE9Ibms3ajJ2aUR6OWQ4MUhtV0F5N0VMbDNET2FEYkdmMzVpT25EMVpLZ2Q3NVplTDRsakRTOTFJY28ySjlHTnBtbDRBcWlQQ1hUVE01ZWZjOUdPMUtzWFFiZysvS3FjWUlZOW5JOEFpeUlTKzRuRytaSnIyQzRCV3MzOGp2QkM0Ly9JSngrMUI2cm5TV3VaZ3hrUFhMR3B4RlJLVk5uWUtKb1NxSWVRSlp2UlM5Z2tNeG9pU2NKS1REK1UwZG1pQ1pLejk3RlMxME5Dbm83S0NFaUlFQW9taGIzWHU2WlF5anMvYk9ESEVHck95YVhBWlVpT1NZRmRwMVpNUVZ1YVFKdDRJNlhQZWt3NXAxZHJPajErSkl4YmlVMWFEWFdyN2JSM0xHUDNuL0NNdHRFQVFSOEFMV1lmQTdCV3Z1S3cyYUVmQk5NcEl0ek5zbGxRb0ZvSFRYZm9WOVdoZ0p0R3Vsb2dHMWhKcXVEcjIrc0FqSnJHT2xVSXpmVmRIVU5ha1NaN2dBRmp0NUxlRzl6RHVnTEdoR2xRR2s3cEVna09ZZjYxcjhMSWdKV29Hc1lRU3ljcUFOWnYwamZ1WDNlM2VmVHlScGZ0bzFpU2N3elorK0ZPaWhrd2VtZk1PdkRYUGtUazNuZ1ZSMFNTK3JHQ21JRzY3dXJ5M2JoditidnhWL0E4c1ZRQWc4K2dEWUFBQUFBRWxGVGtTdVFtQ0MnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVja1VybDtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRNaWxlc1RvRmVldChtaWxlcykge1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQobWlsZXMgKiA1MjgwKTtcclxuICB9XHJcblxyXG4gIHB1c2hOZXdUcnVjayhtYXBzLCB0cnVja0l0ZW0pIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgdmFyIGN1cnJlbnRPYmplY3QgPSB0aGlzO1xyXG4gICAgdmFyIHBpbkxvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRydWNrSXRlbS5sYXQsIHRydWNrSXRlbS5sb25nKTtcclxuICAgIHZhciBkZXN0TG9jID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRydWNrSXRlbS53ckxhdCwgdHJ1Y2tJdGVtLndyTG9uZyk7XHJcbiAgICB2YXIgaWNvblVybDtcclxuICAgIHZhciBpbmZvQm94VHJ1Y2tVcmw7XHJcbiAgICB2YXIgTmV3UGluO1xyXG4gICAgdmFyIGpvYklkVXJsID0gJyc7XHJcblxyXG4gICAgdmFyIHRydWNrQ29sb3IgPSB0cnVja0l0ZW0udHJ1Y2tDb2wudG9Mb3dlckNhc2UoKTtcclxuICAgIGljb25VcmwgPSB0aGlzLmdldEljb25VcmwodHJ1Y2tDb2xvciwgdHJ1Y2tJdGVtLmxhdCwgdHJ1Y2tJdGVtLmxvbmcsIHRydWNrSXRlbS53ckxhdCwgdHJ1Y2tJdGVtLndyTG9uZyk7XHJcblxyXG4gICAgaWYgKHRydWNrQ29sb3IgPT0gJ2dyZWVuJykge1xyXG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUZHbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdOUzB3TVZReE5qb3hNVG94TUMwd05Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1qQXRNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TWpBdE1EUTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVGRrWmpFMFltUXROREJoT0MwMU5EUmpMVGt6T1RBdE0yUmlObVprWVRabU1tSmxJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNk1HRmtNMkl5WkRJdE9EQmhOaTB4TURSa0xUaGlOelF0WmpWaFpERm1NVGhsWXpFeUlpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9UZGtaakUwWW1RdE5EQmhPQzAxTkRSakxUa3pPVEF0TTJSaU5tWmtZVFptTW1KbElqNGdQSGh0Y0UxTk9raHBjM1J2Y25rK0lEeHlaR1k2VTJWeFBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpWTNKbFlYUmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG81TjJSbU1UUmlaQzAwTUdFNExUVTBOR010T1RNNU1DMHpaR0kyWm1SaE5tWXlZbVVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGd0TURVdE1ERlVNVFk2TVRFNk1UQXRNRFE2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpTHo0Z1BDOXlaR1k2VTJWeFBpQThMM2h0Y0UxTk9raHBjM1J2Y25rK0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBpQThMM0prWmpwU1JFWStJRHd2ZURwNGJYQnRaWFJoUGlBOFAzaHdZV05yWlhRZ1pXNWtQU0p5SWo4K09kdUszUUFBQXc5SlJFRlVhTjd0bWoxUEcwRVFodThudUtlaERKMHJsTkpTSkdwSHBDV3lsRFlGNmFBQlY2UWlRUUtsU1JSTUZTVUZwcU5CbUFvRUJhUWdwRFRpUTVRR21wU2JlOUZ0TkJuMnpudDNPOGQ5ZUtTUmJUanR2dmZjN3N6YzducWVrQ21sMnFyWWR1SjdUUXBPUS9keS8rZGVmVG5ZVU11OXRkdzdkRUl2c2E0VW9DM2R3OVNubDJwczRWbGhISHFwSlFWUTkvMmo3ejNmQjJGajlOZk43MExCMFg3UVAwb0dLQURUczUzRTZLZ3lnUHhyRnprQXpGYzBSaDJqcG5LQS9PdlcrY2g0OCsydHNmRlg2NityQllqRFdkeCtIOWw0cFFCeE9PKzY4ME1icnd5Z0pIQXFBeWdwbkVvQVNnT245SURTd2lrMUlQLzdTbG80cFFYa2Z6WmR3Q2t6b0w0TE9LVUVSRWZQajVOdTZzYkxDS2lqZnp6LzhHSUV5QUFJSzJmcWNuRHRwUEV5QW5KNk15TkFReHpUbEpxTGFadWxUeXhOcWp1eTdPcEpQRzI2Sm5ReHVGS3ptM05xK3V0TTdoMDZvZmUvSlZjSlFIU2FGZHhtUGFsNGdYcUs3UkFVemJaMGtTZ1dVREdmc2NDRytvb3Z6ZWJSbWJYRkFSWE5SNEN5QklUcG95TS9Qdk8wUVlqU2dtcXpMVFdjQUVKbjM0ODNqVkVOS1hKNWQvWEp3R0NuNVpTVUdOVDIrNGNQMlZVVUVETFRuVVZtZ2tpTXNDemhoRDAwYnAvM04yUUE0ZW53YldWa0tEd1ZPTi80enhJU2g0TjcwZHFnRzFtVWFzUDFUZ0h4OGp0c2J3elgwU3JheGZLSnphaTJXZXhEYUtEYVROUHRVWkZvQ3doSFEydzNEZ0VKS3dOWnZZdlJWNE00Mms3WndRcEQ5ZC9RZ1BhRzNZd1dZYnNrUXFmak1OR3VqcXJZYXFNamp0NHZRZ1N6Y1Eyb3BmK3lmYmJ6S0c3Z3R6WTBFcmVta0t5djZNaTIxVWJ2UjU4djRHZUNNR2o0ZHM5UC9SL0VHa1I2cEdzNERZQVFaQ3RleHl5ZCtpVWNxVHVKTnByNlE3SmZuUU9xVVVoaGxtUUVaV1ZKQUlWWUsyeTd1Ulljdkx5TnFtL3l1dHhocTQyWEsvVHQvVjlndGp5RVNiMFRaMXVJRHYwZ0NUUUV2UjJWdXJtelN2czhhS09XOWxEbU9JMVJVVUlNYzdydUNWdHdvdy9hb3Q0SkRkcGFZdWVlMFJsZUJKRVZJTXEwWE9sVVFMUzJaZ0p0SFFraEt6SENRdHZMMEdpNVltRWQ2YWQxSHRINW5uV3djNit0VGd0ZmcwRjNNMDZiZndHNFR2OFh5K2hQYUFBQUFBQkpSVTVFcmtKZ2dnPT0nO1xyXG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICdyZWQnKSB7XHJcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXJDQVlBQUFEYmpjNnpBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRkVtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd05TMHdNVlF4TmpveE1Ub3lNUzB3TkRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1qTXRNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1qTXRNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WmpBMVkyVm1ORGN0TTJOallpMDNZalEyTFdJMVpqUXROMkk1TURBd01qZzFNamxsSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT21Zd05XTmxaalEzTFROalkySXROMkkwTmkxaU5XWTBMVGRpT1RBd01ESTROVEk1WlNJZ2VHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT21Zd05XTmxaalEzTFROalkySXROMkkwTmkxaU5XWTBMVGRpT1RBd01ESTROVEk1WlNJK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZaakExWTJWbU5EY3RNMk5qWWkwM1lqUTJMV0kxWmpRdE4ySTVNREF3TWpnMU1qbGxJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakV4T2pJeExUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUHBLcGNLY0FBQUw0U1VSQlZHamU3WnJOU2pNeEZJYm5FdVlTdW5iVm5WczM3c1ViY0c1QTZOWnVuS1U3WGVqYTZnMjBGMUN3NjI0VVFTd0kva0JGRUlwRlFSQ0VtTGMwY25xY1RETXp5VGcvUFhBKzlXTkkzanhKVGs1K1BNK0JDU0ZDVVc2N2xPNTdqdUJzcUZxKzM5L0Y2L201ZURrNUtieERKL1FTNjdvQzFGTTFqTGEzeGVYYVdta2NlcGsxMGdCb1NqK1VmaUg5VFRkR1AwZWpVc0ZSL2pFYzBtYUVTY0ZjbUU1aVZGUWJRUExEZlE0QTh4V0ZVY2VvcVIwZytkRXBIeG4zdTd1UmhkOEZRYjBBY1Rqamc0UFl3bXNGaU1ONWFyZVhGbDRiUUduZzFBWlFXamkxQUpRRlR1VUJaWVZUYVVEeWw2T3NjQ29MU1A2elpRTk9sUUU5MklCVFpVQXptL1I2bVF1dk5LQ2J6YzBWSUIyZ3IrZG5LNFZYRnBDdHhxd0FMWEZNVTJvMnBtMmVmcjIrem85ZFc1N3QzcVpuUWwvanNYamEyeE4zT3p1RmQraUVYbWErZFVCMG1wWGNXaXFMdGg0dmtFK3hvVm8yNjlFOW1KT0Fpdm1NQXpia1YveG90b2pPTEhRT3FHeStBcFFuSUV3ZkZmbnhzMGdYaEVndHFEYlRWTU1LSUZRMjZYWWpveHFXeUpmajQzOERnNXVXejl0YjdSMGRWbGVuZ0V4WEpvakVDTXNUanE3VHVMMmVuYmtCaE43aDE4cFlvZEFyY0g3eG55Y2tEZ2R0VWRxZ0c2c28xWWJ2clFMaTZiZnViZ3pmMFN6YXh2R0p5YWcyT2V4RGFLRGFvcVpiWkpKb0FnaFBRMHd2RGdFSkp3TjU3Y1hvMWlDSk5vendKZG4veGdLZ3VNWW9FYVpISW5RNkxoTnQ2Nm1LcVRZNjRtaDdFU0swejE3VS8wejcvVDl4QTMvL0JqaFpTTktjd21WK1JVZTJxVGJhSHZXK0lPSk4wSURmaFYwdHZBaVRrUjdMTlp3R1FBZ3lGYTlpbGxyNlhUamRIaVRSUmp0UHMvbzFPU0NmUXRJdWtTbEdVRjZXQnBER0F0MWR2RDkvZURtTnkyK0tldHhocW8ybkszVDN2aENZRFI1aFV1OGt1UlppTytOQlJIazJQWXhidXY4YzVpMW0yby96TXZ5c2p6SWJORWJGQ1ltWTAwM1BzYzBiT3RNV3R5ZU0wQlk0ZS9lTXlyQVJ4S29BVVpyanlzREx3ZmpOc0tHMmpnc2hSd25DUXVqbGFPaU1CTm82cm52ck1hYnlnWEd3czYrdE9hOWZaOUM5bGJUY0h4SEJ4QjdKNmVUVkFBQUFBRWxGVGtTdVFtQ0MnO1xyXG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICd5ZWxsb3cnKSB7XHJcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXNDQVlBQUFER2lQNExBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRkVtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd05TMHdNVlF4TmpveE1Ub3dOaTB3TkRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1Ua3RNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1Ua3RNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RBeU5ERTRZMkV0TlRNek5DMDROalJqTFdGaE5tRXRZVEpsTkRrMlltVTFZbUU0SWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2prd01qUXhPR05oTFRVek16UXRPRFkwWXkxaFlUWmhMV0V5WlRRNU5tSmxOV0poT0NJZ2VHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2prd01qUXhPR05oTFRVek16UXRPRFkwWXkxaFlUWmhMV0V5WlRRNU5tSmxOV0poT0NJK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVEF5TkRFNFkyRXROVE16TkMwNE5qUmpMV0ZoTm1FdFlUSmxORGsyWW1VMVltRTRJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakV4T2pBMkxUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUG5LYkk1WUFBQU1KU1VSQlZHamU3WnE5U3NSQUVJRHZFU3g4QU1FWE9Id0I3d25VSjVCN0FBVjdDNi9WUmt1dHZNNVNRUVFiT1FXMXNmQkFMU3o4NFJvYndiUFFRc3l0TTJzMlRqYWJaUE96YTM1dVlGQlFzcE12c3pPenM5Tm9XQkRHMkFUb2JBbTAyYkFwc09BQzZCTXJsN3lCcnVGSE5RMm53OG90MThZZ3dZTmIzakpmNzh4NTNHSE8vVWJ4RmV4RWU0bnNtd0owSUZad3pscnMrM0N5TklyMlVra0xvQW02Q2Rwejk2eFNSdSszcFlJamRQUjZrUTZRQzZhbnU0bHhvZG9BY2lPN1gyQy80c044Q2w1VE8wRHdmN3V5WnpoWGkrbzlmRGxmTDBBQk9IZXIwVUd1VG9BQ2NQckw4Vm1nTG9EU3dLa05vTFJ3YWdFb0M1ektBOG9LcDlLQTRQZXRySEFxQzhodFMyU0dVMlZBVDNuQXFTUWc2ajJqd1Y3MjAzQUZBWFc5MXNUSnpCaVFBdEExLysxemtFOC9wWUtBY24yWk1hQTRRTEJOcWVTeGJhM3E4VFJqWDBOemdQZ1hJRDBoOWpGZ1RuOEpQR3V1K0FwMm9yMitscXNKUUhTYmxWeFdHcWJpQmRaVDBnMUIyZVJBRklubUFpcnNaMnl3WVgwVmFNMFdVQ1hwbUFkVU1oMERzZ29JdG8rSS9QeG5nUzRJc2JUdzJhWlphdVFDQ0JmRG1LSVVTSkdqKy9YL0EzTzFDQ1hHVGNnZDNUblBya1lCL1dhbVlmeUZJUmlKSG1hMStnMzdhSkk0RDl0bUFPSFhrYStWTVVQaFYrRXFYZnpiaENURDRWbEoySVplaFgrbnRvVjBMZElEa3NydjBMc3hUT3YwWmpXSDlvbVdWMnMwKzNob0lMYXB0bHVnU05RRmhLTWh1aGVISE9ibndOcFpqQjROa3RqR1BUeTYrbThKUUtkeEwrTVpvZGtTb2RzeDF1aThSbFUwYmFNZVI5K1hod2kvVEFsQWJlOWxYbzZDY1FPcGl3ZkNRNUxXRkNicksrcloycmJSOTNIbkMrU1pJSFFhK2Jxbi96ZXhNZVNSSHRNMVZ4SUEwU0J0UUNKbXVhbmZpRUxxVG1VYlNmMGgyYStwbWtMdHg2YklGQjVrUzlJQUNwRjIxS2d1RGw0T0krdWJnclk3dEcyVHloVjZldmNDcytZUUp0VnVrbXNoNnZwdUVtZ1oxRTVVNmc0MjgzeVY5clA3akltc1E1bFR2aGdWWVloaVR6Y3R6R00vZTdaRm5Ba1Z0cldOelQzalluZ1E1SWRXTUVyVnJzelZnUGlCOWFTMmRVMFlzcFVnTEhRc1QvVzNFOWltRGVjSFJqeFNtSyticWZ3QUFBQUFTVVZPUks1Q1lJST0nO1xyXG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICdwdXJwbGUnKSB7XHJcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXJDQVlBQUFEYmpjNnpBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBR3RtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd015MHdNMVF4TVRvek1Ub3dOQzB3TlRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk5Ea3RNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk5Ea3RNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TURrd1lUQXdaVFl0T1RObVppMWtZalExTFdJeE1qRXRNMkkxTXpCbU4yWXlaVFF3SWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZOVEprTVdRd01EZ3RZV014TXkwM01EUTVMVGxtT0dNdE9UaGlOVGN4WkRJellqSTBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZZekkwT1RnME1HVXRNbUprTVMxa1pEUXhMVGcwWTJJdE1XUTBZalJqTnpWa01Ea3hJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwak1qUTVPRFF3WlMweVltUXhMV1JrTkRFdE9EUmpZaTB4WkRSaU5HTTNOV1F3T1RFaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1ETXRNRE5VTVRFNk16RTZNRFF0TURVNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPakptTXprM01qRTRMVGxtTURVdFpUYzBNQzFpWTJZNUxUTmlNbVZqTXprNU1EUTNNaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhPQzB3TXkwd00xUXhNVG96T1Rvd09DMHdOVG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGljMkYyWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1Ea3dZVEF3WlRZdE9UTm1aaTFrWWpRMUxXSXhNakV0TTJJMU16Qm1OMll5WlRRd0lpQnpkRVYyZERwM2FHVnVQU0l5TURFNExUQTFMVEF4VkRFMk9qRTFPalE1TFRBME9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQnpkRVYyZERwamFHRnVaMlZrUFNJdklpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QZ1lvSTRvQUFBTDlTVVJCVkdqZTdacTdUaHRCRkliM0Vmd0lQSUlmZ1RmQU5aV3IxTzZEaEx1VVFCc3B5blpXaW5BTERVaGdGMGdrVWlRaWgyWWIxa1Vva0pDTUVBVlV5LzdJQThmSHM3dXp1M00yZS9HUmpuelJhdWJmYjJiT25MazRqcEFGUWRBUHFtMlhvYmVrNEt5cVdwNGVuNFB4b1JmOEhseVYzcUVUZW9udFNRSGFWelY4N3gwSG45ZStWY2FobDFwV0FPM1F0MElmaGo2TjZxTjMvclJTY0pUZi9MM05CbWdHWm1nNmlGRlJZd0NGejI1eUFCaXZLSXc2ZWszakFJWFBmZVU5NCtUVHViYndvNDFoc3dCeE9CZGZMbU1MYnhRZ0RtZTA4eXV4OE1ZQXlnS25NWUN5d21rRW9EeHdhZzhvTDV4YUF3cS9iK2VGVTF0QTRXZkhCcHc2QS9KdHdLa2xJTnA3dkRNL2QrRjFCT1NxSDRNUFIwdEFHa0RZT1FzZWJoK3RGRjVIUUZaZlpna293VEZNcWRrWXRrVzZ1NzQ3dCszcVNMUTIzUlBDME1YTStPUGpXZWtkT3FGM2JzdFZBaEFkWmhXM25pTVZMOUFhN0lTZ2FyYXZra1N4Z0lyeGpBMDI1RmQ4YTdhTXpxd3ZEcWhxdmdSVUpDQU1IeFg1OFZtbUEwS2tGbFNiYWFwaEJSQXE4MDU5YlZUREZJa2ozUDhGQmljdGQ5ZlR5RE02eks2aWdFeG5Kb2hFRHlzU1RsU2pjUnNmZURLQTBEcjhXQmt6RkZvRnpnLytpNFRFNGVCZGxEYm94aXhLdGVGNXE0QjQraDExTm9ibmFCWnRZL3ZFcEZlYmJQWWhORkJ0dXVHMmtDU2FBa0pjTVQwNEJDU2Fya3V2eFdoZGFiU2hoeWRrLzZzSzBDanBaVlNocGxzaWREZ21pYloxVmNWVUcrMXg5SDBSSXBpdEtFQmQ5WS8vODk5QzNNRHZ0d0IzNktYT0tTVHpLOXF6VGJYUjkxSDNDL2lkSUhRYWZ0enpaKzVHMk1IN2pUQWFBTk5NNFNwbXFhbGZ3dW55SUkwMjJuZ1JzMStiQTJwUlNKRlRaSVllVkpSbEFSUmgzYWpqNXRiczR1VjlYSDVUMXUwT1UyMDhYYUdyOTdmQWJIZ0prN3FiNWxpSXJZeEhtdkpzZWo5dTZsN1l6SnZQdENlek1scDVMMld1MEJnVkowUXpwdHVPc00xZTlGVmIzSnBRbzYwcmR1OFpsV0VoaUZrQm9uVGJsVllGeEd2clpORG1TZ2paVGhFVytrNkJSdE1WQTNPbFcyc1NVL25JT05qWjE5YW1pYS9Hb0x1VHBzd1hvYVR3c25LQWtkRUFBQUFBU1VWT1JLNUNZSUk9JztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZmVldGZvck1pbGVzID0gMC4wMDAxODkzOTQ7XHJcbiAgICB2YXIgbWllbHNUb2Rpc3BhdGNoID0gcGFyc2VGbG9hdCh0cnVja0l0ZW0uZGlzdCkudG9GaXhlZCgyKTtcclxuXHJcbiAgICB0aGlzLnJlc3VsdHMucHVzaCh7XHJcbiAgICAgIGRpc3BsYXk6IHRydWNrSXRlbS50cnVja0lkICsgXCIgOiBcIiArIHRydWNrSXRlbS50ZWNoSUQsXHJcbiAgICAgIHZhbHVlOiAxLFxyXG4gICAgICBMYXRpdHVkZTogdHJ1Y2tJdGVtLmxhdCxcclxuICAgICAgTG9uZ2l0dWRlOiB0cnVja0l0ZW0ubG9uZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcclxuICAgIGNvbnN0IGxpc3RPZlB1c2hQaW5zID0gbWFwcy5lbnRpdGllcztcclxuICAgIHZhciBpc05ld1RydWNrID0gdHJ1ZTtcclxuXHJcbiAgICB2YXIgbWV0YWRhdGEgPSB7XHJcbiAgICAgIHRydWNrSWQ6IHRydWNrSXRlbS50cnVja0lkLFxyXG4gICAgICBBVFRVSUQ6IHRydWNrSXRlbS50ZWNoSUQsXHJcbiAgICAgIHRydWNrU3RhdHVzOiB0cnVja0l0ZW0udHJ1Y2tDb2wsXHJcbiAgICAgIHRydWNrQ29sOiB0cnVja0l0ZW0udHJ1Y2tDb2wsXHJcbiAgICAgIGpvYlR5cGU6IHRydWNrSXRlbS5qb2JUeXBlLFxyXG4gICAgICBXUkpvYlR5cGU6IHRydWNrSXRlbS53b3JrVHlwZSxcclxuICAgICAgV1JTdGF0dXM6IHRydWNrSXRlbS53clN0YXQsXHJcbiAgICAgIEFzc2luZ2VkV1JJRDogdHJ1Y2tJdGVtLndySUQsXHJcbiAgICAgIFNwZWVkOiB0cnVja0l0ZW0uc3BlZWQsXHJcbiAgICAgIERpc3RhbmNlOiBtaWVsc1RvZGlzcGF0Y2gsXHJcbiAgICAgIEN1cnJlbnRJZGxlVGltZTogdHJ1Y2tJdGVtLmlkbGVUaW1lLFxyXG4gICAgICBFVEE6IHRydWNrSXRlbS50b3RJZGxlVGltZSxcclxuICAgICAgRW1haWw6ICcnLC8vIHRydWNrSXRlbS5FbWFpbCxcclxuICAgICAgTW9iaWxlOiAnJywgLy8gdHJ1Y2tJdGVtLk1vYmlsZSxcclxuICAgICAgaWNvbjogaWNvblVybCxcclxuICAgICAgaWNvbkluZm86IGluZm9Cb3hUcnVja1VybCxcclxuICAgICAgQ3VycmVudExhdDogdHJ1Y2tJdGVtLmxhdCxcclxuICAgICAgQ3VycmVudExvbmc6IHRydWNrSXRlbS5sb25nLFxyXG4gICAgICBXUkxhdDogdHJ1Y2tJdGVtLndyTGF0LFxyXG4gICAgICBXUkxvbmc6IHRydWNrSXRlbS53ckxvbmcsXHJcbiAgICAgIHRlY2hJZHM6IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsXHJcbiAgICAgIGpvYklkOiB0cnVja0l0ZW0uam9iSWQsXHJcbiAgICAgIG1hbmFnZXJJZHM6IHRoaXMubWFuYWdlcklkcyxcclxuICAgICAgd29ya0FkZHJlc3M6IHRydWNrSXRlbS53b3JrQWRkcmVzcyxcclxuICAgICAgc2JjVmluOiB0cnVja0l0ZW0uc2JjVmluLFxyXG4gICAgICBjdXN0b21lck5hbWU6IHRydWNrSXRlbS5jdXN0b21lck5hbWUsXHJcbiAgICAgIHRlY2huaWNpYW5OYW1lOiB0cnVja0l0ZW0udGVjaG5pY2lhbk5hbWUsXHJcbiAgICAgIGRpc3BhdGNoVGltZTogdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSxcclxuICAgICAgcmVnaW9uOiB0cnVja0l0ZW0uem9uZVxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgam9iSWRTdHJpbmcgPSAnaHR0cDovL2VkZ2UtZWR0Lml0LmF0dC5jb20vY2dpLWJpbi9lZHRfam9iaW5mby5jZ2k/JztcclxuXHJcbiAgICBsZXQgem9uZSA9IHRydWNrSXRlbS56b25lO1xyXG5cclxuICAgIC8vID0gTSBmb3IgTVdcclxuICAgIC8vID0gVyBmb3IgV2VzdFxyXG4gICAgLy8gPSBCIGZvciBTRVxyXG4gICAgLy8gPSBTIGZvciBTV1xyXG4gICAgaWYgKHpvbmUgIT0gbnVsbCAmJiB6b25lICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAoem9uZSA9PT0gJ01XJykge1xyXG4gICAgICAgIHpvbmUgPSAnTSc7XHJcbiAgICAgIH0gZWxzZSBpZiAoem9uZSA9PT0gJ1NFJykge1xyXG4gICAgICAgIHpvbmUgPSAnQidcclxuICAgICAgfSBlbHNlIGlmICh6b25lID09PSAnU1cnKSB7XHJcbiAgICAgICAgem9uZSA9ICdTJ1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB6b25lID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgam9iSWRTdHJpbmcgPSBqb2JJZFN0cmluZyArICdlZHRfcmVnaW9uPScgKyB6b25lICsgJyZ3cmlkPScgKyB0cnVja0l0ZW0ud3JJRDtcclxuXHJcbiAgICB0cnVja0l0ZW0uam9iSWQgPSB0cnVja0l0ZW0uam9iSWQgPT0gdW5kZWZpbmVkIHx8IHRydWNrSXRlbS5qb2JJZCA9PSBudWxsID8gJycgOiB0cnVja0l0ZW0uam9iSWQ7XHJcblxyXG4gICAgaWYgKHRydWNrSXRlbS5qb2JJZCAhPSAnJykge1xyXG4gICAgICBqb2JJZFVybCA9ICc8YSBocmVmPVwiJyArIGpvYklkU3RyaW5nICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiIHRpdGxlPVwiQ2xpY2sgaGVyZSB0byBzZWUgYWN0dWFsIEZvcmNlL0VkZ2Ugam9iIGRhdGFcIj4nICsgdHJ1Y2tJdGVtLmpvYklkICsgJzwvYT4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lICE9IG51bGwgJiYgdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSB1bmRlZmluZWQgJiYgdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSAnJykge1xyXG4gICAgICBsZXQgZGlzcGF0Y2hEYXRlID0gdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZS5zcGxpdCgnOicpO1xyXG4gICAgICBsZXQgZHQgPSBkaXNwYXRjaERhdGVbMF0gKyAnICcgKyBkaXNwYXRjaERhdGVbMV0gKyAnOicgKyBkaXNwYXRjaERhdGVbMl0gKyAnOicgKyBkaXNwYXRjaERhdGVbM107XHJcbiAgICAgIG1ldGFkYXRhLmRpc3BhdGNoVGltZSA9IHRoYXQuVVRDVG9UaW1lWm9uZShkdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXBkYXRlIGluIHRoZSBUcnVja1dhdGNoTGlzdCBzZXNzaW9uXHJcbiAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSAhPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnRydWNrTGlzdCA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSk7XHJcblxyXG4gICAgICBpZiAodGhpcy50cnVja0xpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRydWNrTGlzdC5zb21lKHggPT4geC50cnVja0lkID09IHRydWNrSXRlbS50cnVja0lkKSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMudHJ1Y2tMaXN0LmZpbmQoeCA9PiB4LnRydWNrSWQgPT0gdHJ1Y2tJdGVtLnRydWNrSWQpO1xyXG4gICAgICAgICAgY29uc3QgaW5kZXg6IG51bWJlciA9IHRoaXMudHJ1Y2tMaXN0LmluZGV4T2YoaXRlbSk7XHJcbiAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uRGlzdGFuY2UgPSBtZXRhZGF0YS5EaXN0YW5jZTtcclxuICAgICAgICAgICAgaXRlbS5pY29uID0gbWV0YWRhdGEuaWNvbjtcclxuICAgICAgICAgICAgdGhpcy50cnVja0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgdGhpcy50cnVja0xpc3Quc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrV2F0Y2hMaXN0JywgdGhpcy50cnVja0xpc3QpO1xyXG4gICAgICAgICAgICBpdGVtID0gbnVsbDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBVcGRhdGUgaW4gdGhlIFNlbGVjdGVkVHJ1Y2sgc2Vzc2lvblxyXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrRGV0YWlscycpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICBzZWxlY3RlZFRydWNrID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja0RldGFpbHMnKSk7XHJcblxyXG4gICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sudHJ1Y2tJZCA9PSB0cnVja0l0ZW0udHJ1Y2tJZCkge1xyXG4gICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnVHJ1Y2tEZXRhaWxzJyk7XHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tEZXRhaWxzJywgbWV0YWRhdGEpO1xyXG4gICAgICAgICAgc2VsZWN0ZWRUcnVjayA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudHJ1Y2tJdGVtcy5sZW5ndGggPiAwICYmIHRoaXMudHJ1Y2tJdGVtcy5zb21lKHggPT4geC50b0xvd2VyQ2FzZSgpID09IHRydWNrSXRlbS50cnVja0lkLnRvTG93ZXJDYXNlKCkpKSB7XHJcbiAgICAgIGlzTmV3VHJ1Y2sgPSBmYWxzZTtcclxuICAgICAgLy8gSWYgaXQgaXMgbm90IGEgbmV3IHRydWNrIHRoZW4gbW92ZSB0aGUgdHJ1Y2sgdG8gbmV3IGxvY2F0aW9uXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mUHVzaFBpbnMuZ2V0TGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICAgIGlmIChsaXN0T2ZQdXNoUGlucy5nZXQoaSkubWV0YWRhdGEudHJ1Y2tJZCA9PT0gdHJ1Y2tJdGVtLnRydWNrSWQpIHtcclxuICAgICAgICAgIHZhciBjdXJQdXNoUGluID0gbGlzdE9mUHVzaFBpbnMuZ2V0KGkpO1xyXG4gICAgICAgICAgY3VyUHVzaFBpbi5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG4gICAgICAgICAgZGVzdExvYyA9IHBpbkxvY2F0aW9uO1xyXG4gICAgICAgICAgcGluTG9jYXRpb24gPSBsaXN0T2ZQdXNoUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcclxuXHJcbiAgICAgICAgICBsZXQgdHJ1Y2tJZFJhbklkID0gdHJ1Y2tJdGVtLnRydWNrSWQgKyAnXycgKyBNYXRoLnJhbmRvbSgpO1xyXG5cclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0LmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmluZGV4T2YodHJ1Y2tJdGVtLnRydWNrSWQpID4gLTEpIHtcclxuICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0LnB1c2godHJ1Y2tJZFJhbklkKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmxvYWREaXJlY3Rpb25zKHRoaXMsIHBpbkxvY2F0aW9uLCBkZXN0TG9jLCBpLCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKTtcclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRydWNrSXRlbXMucHVzaCh0cnVja0l0ZW0udHJ1Y2tJZCk7XHJcbiAgICAgIE5ld1BpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKHBpbkxvY2F0aW9uLCB7IGljb246IHRydWNrVXJsIH0pO1xyXG5cclxuICAgICAgTmV3UGluLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcbiAgICAgIHRoaXMubWFwLmVudGl0aWVzLnB1c2goTmV3UGluKTtcclxuXHJcbiAgICAgIHRoaXMuZGF0YUxheWVyLnB1c2goTmV3UGluKTtcclxuICAgICAgaWYgKHRoaXMuaXNNYXBMb2FkZWQpIHtcclxuICAgICAgICB0aGlzLmlzTWFwTG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5tYXAuc2V0Vmlldyh7IGNlbnRlcjogcGluTG9jYXRpb24sIHpvb206IHRoaXMubGFzdFpvb21MZXZlbCB9KTtcclxuICAgICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSB0aGlzLm1hcC5nZXRab29tKCk7XHJcbiAgICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSB0aGlzLm1hcC5nZXRDZW50ZXIoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoTmV3UGluLCAnbW91c2VvdXQnLCAoZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5mb2JveC5zZXRPcHRpb25zKHsgdmlzaWJsZTogZmFsc2UgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgMTAyNCkge1xyXG4gICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgIHRoaXMuaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgICAgICAgc2hvd1BvaW50ZXI6IHRydWUsXHJcbiAgICAgICAgICAgIGxvY2F0aW9uOiBlLnRhcmdldC5nZXRMb2NhdGlvbigpLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93Q2xvc2VCdXR0b246IHRydWUsXHJcbiAgICAgICAgICAgIG9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDAsIDIwKSxcclxuICAgICAgICAgICAgaHRtbENvbnRlbnQ6ICc8ZGl2IGNsYXNzID0gXCJpbmZ5IGluZnlNYXBwb3B1cFwiPidcclxuICAgICAgICAgICAgICArIGdldEluZm9Cb3hIVE1MKGUudGFyZ2V0Lm1ldGFkYXRhLCB0aGlzLnRocmVzaG9sZFZhbHVlLCBqb2JJZFVybCkgKyAnPC9kaXY+J1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGhpcy50cnVja1dhdGNoTGlzdCA9IFt7IFRydWNrSWQ6IGUudGFyZ2V0Lm1ldGFkYXRhLnRydWNrSWQsIERpc3RhbmNlOiBlLnRhcmdldC5tZXRhZGF0YS5EaXN0YW5jZSB9XTtcclxuXHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcclxuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja0RldGFpbHMnLCBlLnRhcmdldC5tZXRhZGF0YSk7XHJcblxyXG4gICAgICAgICAgLy8gQSBidWZmZXIgbGltaXQgdG8gdXNlIHRvIHNwZWNpZnkgdGhlIGluZm9ib3ggbXVzdCBiZSBhd2F5IGZyb20gdGhlIGVkZ2VzIG9mIHRoZSBtYXAuXHJcblxyXG4gICAgICAgICAgdmFyIGJ1ZmZlciA9IDMwO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hPZmZzZXQgPSB0aGF0LmluZm9ib3guZ2V0T2Zmc2V0KCk7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveEFuY2hvciA9IHRoYXQuaW5mb2JveC5nZXRBbmNob3IoKTtcclxuICAgICAgICAgIHZhciBpbmZvYm94TG9jYXRpb24gPSBtYXBzLnRyeUxvY2F0aW9uVG9QaXhlbChlLnRhcmdldC5nZXRMb2NhdGlvbigpLCBNaWNyb3NvZnQuTWFwcy5QaXhlbFJlZmVyZW5jZS5jb250cm9sKTtcclxuICAgICAgICAgIHZhciBkeCA9IGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveE9mZnNldC54IC0gaW5mb2JveEFuY2hvci54O1xyXG4gICAgICAgICAgdmFyIGR5ID0gaW5mb2JveExvY2F0aW9uLnkgLSAyNSAtIGluZm9ib3hBbmNob3IueTtcclxuXHJcbiAgICAgICAgICBpZiAoZHkgPCBidWZmZXIpIHsgLy8gSW5mb2JveCBvdmVybGFwcyB3aXRoIHRvcCBvZiBtYXAuXHJcbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cclxuICAgICAgICAgICAgZHkgKj0gLTE7XHJcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGJ1ZmZlciBmcm9tIHRoZSB0b3AgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICBkeSArPSBidWZmZXI7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAjIyMjIElmIGR5IGlzIGdyZWF0ZXIgdGhhbiB6ZXJvIHRoYW4gaXQgZG9lcyBub3Qgb3ZlcmxhcC5cclxuICAgICAgICAgICAgZHkgPSAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChkeCA8IGJ1ZmZlcikgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCBsZWZ0IHNpZGUgb2YgbWFwLlxyXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXHJcbiAgICAgICAgICAgIGR4ICo9IC0xO1xyXG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgZHggKz0gYnVmZmVyO1xyXG4gICAgICAgICAgfSBlbHNlIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggcmlnaHQgc2lkZSBvZiBtYXAuXHJcbiAgICAgICAgICAgIGR4ID0gbWFwcy5nZXRXaWR0aCgpIC0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94QW5jaG9yLnggLSB0aGF0LmluZm9ib3guZ2V0V2lkdGgoKTtcclxuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeCBpcyBncmVhdGVyIHRoYW4gemVybyB0aGVuIGl0IGRvZXMgbm90IG92ZXJsYXAuXHJcbiAgICAgICAgICAgIGlmIChkeCA+IGJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgIGR4ID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSByaWdodCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgICAgZHggLT0gYnVmZmVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gIyMjIyBBZGp1c3QgdGhlIG1hcCBzbyBpbmZvYm94IGlzIGluIHZpZXdcclxuICAgICAgICAgIGlmIChkeCAhPSAwIHx8IGR5ICE9IDApIHtcclxuICAgICAgICAgICAgbWFwcy5zZXRWaWV3KHtcclxuICAgICAgICAgICAgICBjZW50ZXJPZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludChkeCwgZHkpLFxyXG4gICAgICAgICAgICAgIGNlbnRlcjogbWFwcy5nZXRDZW50ZXIoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoaXMubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcclxuXHJcbiAgICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhpcy5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxyXG4gICAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0ZWNobmljaWFuRGV0YWlscyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbk5hbWUgPSB0ZWNobmljaWFuRGV0YWlscy5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLmluZm9ib3gsICdjbGljaycsIHZpZXdUcnVja0RldGFpbHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ21vdXNlb3ZlcicsIChlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgICAgICAgIHNob3dQb2ludGVyOiB0cnVlLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCAyMCksXHJcbiAgICAgICAgICAgIGh0bWxDb250ZW50OiAnPGRpdiBjbGFzcyA9IFwiaW5meSBpbmZ5TWFwcG9wdXBcIj4nXHJcbiAgICAgICAgICAgICAgKyBnZXRJbmZvQm94SFRNTChlLnRhcmdldC5tZXRhZGF0YSwgdGhpcy50aHJlc2hvbGRWYWx1ZSwgam9iSWRVcmwpICsgJzwvZGl2PidcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRoaXMudHJ1Y2tXYXRjaExpc3QgPSBbeyBUcnVja0lkOiBlLnRhcmdldC5tZXRhZGF0YS50cnVja0lkLCBEaXN0YW5jZTogZS50YXJnZXQubWV0YWRhdGEuRGlzdGFuY2UgfV07XHJcblxyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snLCBlLnRhcmdldC5tZXRhZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tEZXRhaWxzJywgZS50YXJnZXQubWV0YWRhdGEpO1xyXG5cclxuICAgICAgICAgIC8vIEEgYnVmZmVyIGxpbWl0IHRvIHVzZSB0byBzcGVjaWZ5IHRoZSBpbmZvYm94IG11c3QgYmUgYXdheSBmcm9tIHRoZSBlZGdlcyBvZiB0aGUgbWFwLlxyXG5cclxuICAgICAgICAgIHZhciBidWZmZXIgPSAzMDtcclxuICAgICAgICAgIHZhciBpbmZvYm94T2Zmc2V0ID0gdGhhdC5pbmZvYm94LmdldE9mZnNldCgpO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hBbmNob3IgPSB0aGF0LmluZm9ib3guZ2V0QW5jaG9yKCk7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveExvY2F0aW9uID0gbWFwcy50cnlMb2NhdGlvblRvUGl4ZWwoZS50YXJnZXQuZ2V0TG9jYXRpb24oKSwgTWljcm9zb2Z0Lk1hcHMuUGl4ZWxSZWZlcmVuY2UuY29udHJvbCk7XHJcbiAgICAgICAgICB2YXIgZHggPSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hPZmZzZXQueCAtIGluZm9ib3hBbmNob3IueDtcclxuICAgICAgICAgIHZhciBkeSA9IGluZm9ib3hMb2NhdGlvbi55IC0gMjUgLSBpbmZvYm94QW5jaG9yLnk7XHJcblxyXG4gICAgICAgICAgaWYgKGR5IDwgYnVmZmVyKSB7IC8vIEluZm9ib3ggb3ZlcmxhcHMgd2l0aCB0b3Agb2YgbWFwLlxyXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXHJcbiAgICAgICAgICAgIGR5ICo9IC0xO1xyXG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBidWZmZXIgZnJvbSB0aGUgdG9wIGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgZHkgKz0gYnVmZmVyO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeSBpcyBncmVhdGVyIHRoYW4gemVybyB0aGFuIGl0IGRvZXMgbm90IG92ZXJsYXAuXHJcbiAgICAgICAgICAgIGR5ID0gMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoZHggPCBidWZmZXIpIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggbGVmdCBzaWRlIG9mIG1hcC5cclxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxyXG4gICAgICAgICAgICBkeCAqPSAtMTtcclxuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgbGVmdCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgIGR4ICs9IGJ1ZmZlcjtcclxuICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIHJpZ2h0IHNpZGUgb2YgbWFwLlxyXG4gICAgICAgICAgICBkeCA9IG1hcHMuZ2V0V2lkdGgoKSAtIGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveEFuY2hvci54IC0gdGhhdC5pbmZvYm94LmdldFdpZHRoKCk7XHJcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHggaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhlbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxyXG4gICAgICAgICAgICBpZiAoZHggPiBidWZmZXIpIHtcclxuICAgICAgICAgICAgICBkeCA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICAgIGR4IC09IGJ1ZmZlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vICMjIyMgQWRqdXN0IHRoZSBtYXAgc28gaW5mb2JveCBpcyBpbiB2aWV3XHJcbiAgICAgICAgICBpZiAoZHggIT0gMCB8fCBkeSAhPSAwKSB7XHJcbiAgICAgICAgICAgIG1hcHMuc2V0Vmlldyh7XHJcbiAgICAgICAgICAgICAgY2VudGVyT2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoZHgsIGR5KSxcclxuICAgICAgICAgICAgICBjZW50ZXI6IG1hcHMuZ2V0Q2VudGVyKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcclxuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGlzLm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XHJcblxyXG4gICAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcclxuICAgICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5pbmZvYm94LCAnY2xpY2snLCB2aWV3VHJ1Y2tEZXRhaWxzKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKG1hcHMsICd2aWV3Y2hhbmdlJywgbWFwVmlld0NoYW5nZWQpO1xyXG5cclxuICAgICAgLy8gdGhpcy5DaGFuZ2VUcnVja0RpcmVjdGlvbih0aGlzLCBOZXdQaW4sIGRlc3RMb2MsIHRydWNrVXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYXBWaWV3Q2hhbmdlZChlKSB7XHJcbiAgICAgIHRoYXQubGFzdFpvb21MZXZlbCA9IG1hcHMuZ2V0Wm9vbSgpO1xyXG4gICAgICB0aGF0Lmxhc3RMb2NhdGlvbiA9IG1hcHMuZ2V0Q2VudGVyKCk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBtb3VzZXdoZWVsQ2hhbmdlZChlKSB7XHJcbiAgICAgIHRoYXQubGFzdFpvb21MZXZlbCA9IG1hcHMuZ2V0Wm9vbSgpO1xyXG4gICAgICB0aGF0Lmxhc3RMb2NhdGlvbiA9IG1hcHMuZ2V0Q2VudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0SW5mb0JveEhUTUwoZGF0YTogYW55LCB0VmFsdWUsIGpvYklkKTogU3RyaW5nIHtcclxuXHJcbiAgICAgIGlmICghZGF0YS5TcGVlZCkge1xyXG4gICAgICAgIGRhdGEuU3BlZWQgPSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY2xhc3NOYW1lID0gXCJcIjtcclxuICAgICAgdmFyIHN0eWxlTGVmdCA9IFwiXCI7XHJcbiAgICAgIHZhciByZWFzb24gPSAnJztcclxuICAgICAgaWYgKGRhdGEudHJ1Y2tTdGF0dXMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEudHJ1Y2tTdGF0dXMudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAncmVkJykge1xyXG4gICAgICAgICAgcmVhc29uID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tdG9wOjNweDtjb2xvcjpyZWQ7Jz5SZWFzb246IEN1bXVsYXRpdmUgaWRsZSB0aW1lIGlzIGJleW9uZCBcIiArIHRWYWx1ZSArIFwiIG1pbnM8L2Rpdj5cIjtcclxuICAgICAgICB9IGVsc2UgaWYgKGRhdGEudHJ1Y2tTdGF0dXMudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAncHVycGxlJykge1xyXG4gICAgICAgICAgcmVhc29uID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tdG9wOjNweDtjb2xvcjpwdXJwbGU7Jz5SZWFzb246IFRydWNrIGlzIGRyaXZlbiBncmVhdGVyIHRoYW4gNzUgbS9oPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgaW5mb2JveERhdGEgPSAnJztcclxuXHJcbiAgICAgIGRhdGEuY3VzdG9tZXJOYW1lID0gZGF0YS5jdXN0b21lck5hbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEuY3VzdG9tZXJOYW1lID09IG51bGwgPyAnJyA6IGRhdGEuY3VzdG9tZXJOYW1lO1xyXG5cclxuICAgICAgZGF0YS5kaXNwYXRjaFRpbWUgPSBkYXRhLmRpc3BhdGNoVGltZSA9PSB1bmRlZmluZWQgfHwgZGF0YS5kaXNwYXRjaFRpbWUgPT0gbnVsbCA/ICcnIDogZGF0YS5kaXNwYXRjaFRpbWU7XHJcblxyXG4gICAgICBkYXRhLmpvYklkID0gZGF0YS5qb2JJZCA9PSB1bmRlZmluZWQgfHwgZGF0YS5qb2JJZCA9PSBudWxsID8gJycgOiBkYXRhLmpvYklkO1xyXG5cclxuICAgICAgZGF0YS53b3JrQWRkcmVzcyA9IGRhdGEud29ya0FkZHJlc3MgPT0gdW5kZWZpbmVkIHx8IGRhdGEud29ya0FkZHJlc3MgPT0gbnVsbCA/ICcnIDogZGF0YS53b3JrQWRkcmVzcztcclxuXHJcbiAgICAgIGRhdGEuc2JjVmluID0gZGF0YS5zYmNWaW4gPT0gdW5kZWZpbmVkIHx8IGRhdGEuc2JjVmluID09IG51bGwgfHwgZGF0YS5zYmNWaW4gPT0gJycgPyAnJyA6IGRhdGEuc2JjVmluO1xyXG5cclxuICAgICAgZGF0YS50ZWNobmljaWFuTmFtZSA9IGRhdGEudGVjaG5pY2lhbk5hbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEudGVjaG5pY2lhbk5hbWUgPT0gbnVsbCB8fCBkYXRhLnRlY2huaWNpYW5OYW1lID09ICcnID8gJycgOiBkYXRhLnRlY2huaWNpYW5OYW1lO1xyXG5cclxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgMTAyNCkge1xyXG4gICAgICAgIGluZm9ib3hEYXRhID0gXCI8ZGl2IGNsYXNzPSdwb3BNb2RhbENvbnRhaW5lcic+PGRpdiBjbGFzcz0ncG9wTW9kYWxIZWFkZXInPjxpbWcgc3JjPSdcIiArIGRhdGEuaWNvbkluZm8gKyBcIicgPjxhIGNsYXNzPSdkZXRhaWxzJyB0aXRsZT0nQ2xpY2sgaGVyZSB0byBzZWUgdGVjaG5pY2lhbiBkZXRhaWxzJyA+VmlldyBEZXRhaWxzPC9hPjxpIGNsYXNzPSdmYSBmYS10aW1lcycgYXJpYS1oaWRkZW49J3RydWUnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPjwvaT48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxoci8+PGRpdiBjbGFzcz0ncG9wTW9kYWxCb2R5Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPlZlaGljbGUgTnVtYmVyIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuc2JjVmluICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPlZUUyBVbml0IElEIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEudHJ1Y2tJZCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5Kb2IgVHlwZSA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmpvYlR5cGUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Sm9iIElkIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGpvYklkICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkFUVFVJRCA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLkFUVFVJRCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5UZWNobmljaWFuIE5hbWUgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS50ZWNobmljaWFuTmFtZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5DdXN0b21lciBOYW1lIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuY3VzdG9tZXJOYW1lICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkRpc3BhdGNoIFRpbWU6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmRpc3BhdGNoVGltZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTEyJz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbC0xMiBjb2wtc20tMTIgY29sLWZvcm0tbGFiZWwnPkpvYiBBZGRyZXNzIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtc20tMTInPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCBjb2wtZm9ybS1sYWJlbC1mdWxsJz5cIiArIGRhdGEud29ya0FkZHJlc3MgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IG1ldGVyQ2FsJz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtbWQtNCc+PHN0cm9uZz5cIiArIGRhdGEuU3BlZWQgKyBcIjwvc3Ryb25nPiBtcGggPHNwYW4gY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+U3BlZWQ8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyBkYXRhLkVUQSArIFwiPC9zdHJvbmc+IE1pbnMgPHNwYW4gY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+Q3VtdWxhdGl2ZSBJZGxlIE1pbnV0ZXM8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyB0aGF0LmNvbnZlcnRNaWxlc1RvRmVldChkYXRhLkRpc3RhbmNlKSArIFwiPC9zdHJvbmc+IEZ0IDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkZlZXQgdG8gSm9iIFNpdGU8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PiA8aHIvPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncG9wTW9kYWxGb290ZXInPjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wgY29sLW1kLTQnPjxpIGNsYXNzPSdmYSBmYS1jb21tZW50aW5nJz48L2k+PHNwYW4gY2xhc3M9J3NtcycgdGl0bGU9J0NsaWNrIHRvIHNlbmQgU01TJyA+U01TPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtZW52ZWxvcGUnIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PHNwYW4gY2xhc3M9J2VtYWlsJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBlbWFpbCcgPkVtYWlsPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtZXllJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxzcGFuIGNsYXNzPSd3YXRjaGxpc3QnIHRpdGxlPSdDbGljayB0byBhZGQgaW4gd2F0Y2hsaXN0JyA+V2F0Y2g8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj4gPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIjtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5mb2JveERhdGEgPSBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J3BhZGRpbmctdG9wOjEwcHg7bWFyZ2luOiAwcHg7Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC0zJz48ZGl2IHN0eWxlPSdwYWRkaW5nLXRvcDoxNXB4OycgPjxpbWcgc3JjPSdcIiArIGRhdGEuaWNvbkluZm8gKyBcIicgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrO21hcmdpbjogMCBhdXRvOycgPjwvZGl2PjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTknPlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncm93ICc+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtOCcgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5WZWhpY2xlIE51bWJlcjwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLnNiY1ZpbiArIFwiPC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PGEgY2xhc3M9J2RldGFpbHMnIHN0eWxlPSdjb2xvcjojMDA5RkRCO2N1cnNvcjogcG9pbnRlcjsnICB0aXRsZT0nQ2xpY2sgaGVyZSB0byBzZWUgdGVjaG5pY2lhbiBkZXRhaWxzJyA+VmlldyBEZXRhaWxzPC9hPjxpIGNsYXNzPSdmYSBmYS10aW1lcycgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4O2N1cnNvcjogcG9pbnRlcjsnIGFyaWEtaGlkZGVuPSd0cnVlJyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz48L2k+PC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8L2Rpdj5cIiArXHJcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J3Jvdyc+PGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPlZUUyBVbml0IElEPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEudHJ1Y2tJZCArIFwiPC9kaXY+PC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnPjxkaXYgY2xhc3M9J2NvbC1tZC01JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkpvYiBUeXBlPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuam9iVHlwZSArIFwiPC9kaXY+PGRpdiBjbGFzcz0nY29sLW1kLTcnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOycgPkpvYiBJZDwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBqb2JJZCArIFwiPC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgcmVhc29uICsgXCI8L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+QVRUVUlEPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuQVRUVUlEICsgXCI8c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDttYXJnaW4tbGVmdDo4cHg7Jz5UZWNobmljaWFuIE5hbWU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS50ZWNobmljaWFuTmFtZSArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnID5cIlxyXG4gICAgICAgICAgKyBcIjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5DdXN0b21lciBOYW1lPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuY3VzdG9tZXJOYW1lICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7JyA+XCJcclxuICAgICAgICAgICsgXCI8ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+RGlzcGF0Y2ggVGltZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmRpc3BhdGNoVGltZSArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4OycgPlwiXHJcbiAgICAgICAgICArIFwiPGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkpvYiBBZGRyZXNzPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEud29ya0FkZHJlc3MgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8aHIgc3R5bGU9J21hcmdpbi10b3A6MXB4OyBtYXJnaW4tYm90dG9tOjVweDsnIC8+XCJcclxuXHJcbiAgICAgICAgICArIFwiPGRpdiBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHg7Jz4gPGRpdiBjbGFzcz0ncm93Jz4gPGRpdiBjbGFzcz0nc3BlZWQgY29sLW1kLTMnPiA8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tbGVmdDogMXB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIGRhdGEuU3BlZWQgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5tcGg8L3A+PC9kaXY+PHAgc3R5bGU9J21hcmdpbjowcHgnIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPlNwZWVkPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naWRsZSBjb2wtbWQtNSc+PGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHgnPjxwIHN0eWxlPSdmb250LXdlaWdodDogYm9sZGVyO2ZvbnQtc2l6ZTogMjNweDttYXJnaW46IDBweDsnPlwiICsgZGF0YS5FVEEgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5NaW5zPC9wPjwvZGl2PjxwIHN0eWxlPSdtYXJnaW46MHB4JyBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5DdW11bGF0aXZlIElkbGUgTWludXRlczwvcD48L2Rpdj4gPGRpdiBjbGFzcz0nbWlsZXMgY29sLW1kLTQnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHgnPjxwIHN0eWxlPSdmb250LXdlaWdodDogYm9sZGVyO2ZvbnQtc2l6ZTogMjNweDttYXJnaW46IDBweDsnPlwiICsgdGhhdC5jb252ZXJ0TWlsZXNUb0ZlZXQoZGF0YS5EaXN0YW5jZSkgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5GdDwvcD48L2Rpdj48cCBzdHlsZT0nbWFyZ2luOjBweCcgY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+RmVldCB0byBKb2IgU2l0ZTwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PjwvZGl2PjxociBzdHlsZT0nbWFyZ2luLXRvcDoxcHg7IG1hcmdpbi1ib3R0b206NXB4OycgLz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+IDxkaXYgY2xhc3M9J2NvbC1tZC0xJz48L2Rpdj48ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnIHN0eWxlPSdcIiArIGNsYXNzTmFtZSArIFwiJz4gPGkgY2xhc3M9J2ZhIGZhLWNvbW1lbnRpbmcgY29sLW1kLTInPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgc21zJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBTTVMnID5TTVM8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMgb2Zmc2V0LW1kLTEnIHN0eWxlPSdcIiArIGNsYXNzTmFtZSArIFwiJz4gPGkgY2xhc3M9J2ZhIGZhLWVudmVsb3BlIGNvbC1tZC0yJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxwIGNsYXNzPSdjb2wtbWQtNiBlbWFpbCcgdGl0bGU9J0NsaWNrIHRvIHNlbmQgZW1haWwnID5FbWFpbDwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3JvdyBjb2wtbWQtMyc+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnIHN0eWxlPSdcIiArIHN0eWxlTGVmdCArIFwiJz48aSBjbGFzcz0nZmEgZmEtZXllIGNvbC1tZC0yJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxwIGNsYXNzPSdjb2wtbWQtNiB3YXRjaGxpc3QnIHRpdGxlPSdDbGljayB0byBhZGQgaW4gd2F0Y2hsaXN0JyA+V2F0Y2g8L3A+PC9kaXY+IDwvZGl2PlwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaW5mb2JveERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmlld1RydWNrRGV0YWlscyhlKSB7XHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2ZhIGZhLXRpbWVzJykge1xyXG4gICAgICAgIHRoYXQuaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgICAgIHZpc2libGU6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnZGV0YWlscycpIHtcclxuICAgICAgICAvL3RoYXQucm91dGVyLm5hdmlnYXRlKFsnL3RlY2huaWNpYW4tZGV0YWlscyddKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnY29sLW1kLTYgc21zJykge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XHJcbiAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoYXQubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGF0LnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXHJcbiAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbFNNUycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2NvbC1tZC02IGVtYWlsJykge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XHJcbiAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoYXQubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGF0LnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXHJcbiAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbEVtYWlsJykubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgfVxyXG4gICAgIFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZERpcmVjdGlvbnModGhhdCwgc3RhcnRMb2MsIGVuZExvYywgaW5kZXgsIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpIHtcclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5EaXJlY3Rpb25zTWFuYWdlcih0aGF0Lm1hcCk7XHJcbiAgICAgIC8vIFNldCBSb3V0ZSBNb2RlIHRvIGRyaXZpbmdcclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5zZXRSZXF1ZXN0T3B0aW9ucyh7XHJcbiAgICAgICAgcm91dGVNb2RlOiBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLlJvdXRlTW9kZS5kcml2aW5nXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLnNldFJlbmRlck9wdGlvbnMoe1xyXG4gICAgICAgIGRyaXZpbmdQb2x5bGluZU9wdGlvbnM6IHtcclxuICAgICAgICAgIHN0cm9rZUNvbG9yOiAnZ3JlZW4nLFxyXG4gICAgICAgICAgc3Ryb2tlVGhpY2tuZXNzOiAzLFxyXG4gICAgICAgICAgdmlzaWJsZTogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UgfSxcclxuICAgICAgICB2aWFwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IGZhbHNlIH0sXHJcbiAgICAgICAgYXV0b1VwZGF0ZU1hcFZpZXc6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3Qgd2F5cG9pbnQxID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuV2F5cG9pbnQoe1xyXG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oc3RhcnRMb2MubGF0aXR1ZGUsIHN0YXJ0TG9jLmxvbmdpdHVkZSksIGljb246ICcnXHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCB3YXlwb2ludDIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5XYXlwb2ludCh7XHJcbiAgICAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihlbmRMb2MubGF0aXR1ZGUsIGVuZExvYy5sb25naXR1ZGUpXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50MSk7XHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuYWRkV2F5cG9pbnQod2F5cG9pbnQyKTtcclxuXHJcbiAgICAgIC8vIEFkZCBldmVudCBoYW5kbGVyIHRvIGRpcmVjdGlvbnMgbWFuYWdlci5cclxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5kaXJlY3Rpb25zTWFuYWdlciwgJ2RpcmVjdGlvbnNVcGRhdGVkJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvLyBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICB2YXIgcm91dGVJbmRleCA9IGUucm91dGVbMF0ucm91dGVMZWdzWzBdLm9yaWdpbmFsUm91dGVJbmRleDtcclxuICAgICAgICB2YXIgbmV4dEluZGV4ID0gcm91dGVJbmRleDtcclxuICAgICAgICBpZiAoZS5yb3V0ZVswXS5yb3V0ZVBhdGgubGVuZ3RoID4gcm91dGVJbmRleCkge1xyXG4gICAgICAgICAgbmV4dEluZGV4ID0gcm91dGVJbmRleCArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBuZXh0TG9jYXRpb24gPSBlLnJvdXRlWzBdLnJvdXRlUGF0aFtuZXh0SW5kZXhdO1xyXG4gICAgICAgIHZhciBwaW4gPSB0aGF0Lm1hcC5lbnRpdGllcy5nZXQoaW5kZXgpO1xyXG4gICAgICAgIC8vIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHN0YXJ0TG9jLG5leHRMb2NhdGlvbik7XHJcbiAgICAgICAgdGhhdC5Nb3ZlUGluT25EaXJlY3Rpb24odGhhdCwgZS5yb3V0ZVswXS5yb3V0ZVBhdGgsIHBpbiwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5jYWxjdWxhdGVEaXJlY3Rpb25zKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIE1vdmVQaW5PbkRpcmVjdGlvbih0aGF0LCByb3V0ZVBhdGgsIHBpbiwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCkge1xyXG4gICAgdGhhdCA9IHRoaXM7XHJcbiAgICB2YXIgaXNHZW9kZXNpYyA9IGZhbHNlO1xyXG4gICAgdGhhdC5jdXJyZW50QW5pbWF0aW9uID0gbmV3IEJpbmcuTWFwcy5BbmltYXRpb25zLlBhdGhBbmltYXRpb24ocm91dGVQYXRoLCBmdW5jdGlvbiAoY29vcmQsIGlkeCwgZnJhbWVJZHgsIHJvdGF0aW9uQW5nbGUsIGxvY2F0aW9ucywgdHJ1Y2tJZFJhbklkKSB7XHJcblxyXG4gICAgICBpZiAodGhhdC5hbmltYXRpb25UcnVja0xpc3QubGVuZ3RoID4gMCAmJiB0aGF0LmFuaW1hdGlvblRydWNrTGlzdC5zb21lKHggPT4geCA9PSB0cnVja0lkUmFuSWQpKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gKGZyYW1lSWR4ID09IGxvY2F0aW9ucy5sZW5ndGggLSAxKSA/IGZyYW1lSWR4IDogZnJhbWVJZHggKyAxO1xyXG4gICAgICAgIHZhciByb3RhdGlvbkFuZ2xlID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKGNvb3JkLCBsb2NhdGlvbnNbaW5kZXhdKTtcclxuICAgICAgICBpZiAodGhhdC5pc09kZChmcmFtZUlkeCkpIHtcclxuICAgICAgICAgIHRoYXQuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwaW4sIHRydWNrVXJsLCByb3RhdGlvbkFuZ2xlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZnJhbWVJZHggPT0gbG9jYXRpb25zLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIHRoYXQuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwaW4sIHRydWNrVXJsLCByb3RhdGlvbkFuZ2xlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGluLnNldExvY2F0aW9uKGNvb3JkKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0sIGlzR2VvZGVzaWMsIHRoYXQudHJhdmFsRHVyYXRpb24sIHRydWNrSWRSYW5JZCk7XHJcblxyXG4gICAgdGhhdC5jdXJyZW50QW5pbWF0aW9uLnBsYXkoKTtcclxuICB9XHJcblxyXG4gIENhbGN1bGF0ZU5leHRDb29yZChzdGFydExvY2F0aW9uLCBlbmRMb2NhdGlvbikge1xyXG4gICAgdHJ5IHtcclxuXHJcbiAgICAgIHZhciBkbGF0ID0gKGVuZExvY2F0aW9uLmxhdGl0dWRlIC0gc3RhcnRMb2NhdGlvbi5sYXRpdHVkZSk7XHJcbiAgICAgIHZhciBkbG9uID0gKGVuZExvY2F0aW9uLmxvbmdpdHVkZSAtIHN0YXJ0TG9jYXRpb24ubG9uZ2l0dWRlKTtcclxuICAgICAgdmFyIGFscGhhID0gTWF0aC5hdGFuMihkbGF0ICogTWF0aC5QSSAvIDE4MCwgZGxvbiAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICB2YXIgZHggPSAwLjAwMDE1MjM4Nzk0NzI3OTA5OTMxO1xyXG4gICAgICBkbGF0ID0gZHggKiBNYXRoLnNpbihhbHBoYSk7XHJcbiAgICAgIGRsb24gPSBkeCAqIE1hdGguY29zKGFscGhhKTtcclxuICAgICAgdmFyIG5leHRDb29yZCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihzdGFydExvY2F0aW9uLmxhdGl0dWRlICsgZGxhdCwgc3RhcnRMb2NhdGlvbi5sb25naXR1ZGUgKyBkbG9uKTtcclxuXHJcbiAgICAgIGRsYXQgPSBudWxsO1xyXG4gICAgICBkbG9uID0gbnVsbDtcclxuICAgICAgYWxwaGEgPSBudWxsO1xyXG4gICAgICBkeCA9IG51bGw7XHJcblxyXG4gICAgICByZXR1cm4gbmV4dENvb3JkO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIENhbGN1bGF0ZU5leHRDb29yZCAtICcgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc09kZChudW0pIHtcclxuICAgIHJldHVybiBudW0gJSAyO1xyXG4gIH1cclxuXHJcbiAgZGVnVG9SYWQoeCkge1xyXG4gICAgcmV0dXJuIHggKiBNYXRoLlBJIC8gMTgwO1xyXG4gIH1cclxuXHJcbiAgcmFkVG9EZWcoeCkge1xyXG4gICAgcmV0dXJuIHggKiAxODAgLyBNYXRoLlBJO1xyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlQmVhcmluZyhvcmlnaW4sIGRlc3QpIHtcclxuICAgIC8vLyA8c3VtbWFyeT5DYWxjdWxhdGVzIHRoZSBiZWFyaW5nIGJldHdlZW4gdHdvIGxvYWNhdGlvbnMuPC9zdW1tYXJ5PlxyXG4gICAgLy8vIDxwYXJhbSBuYW1lPVwib3JpZ2luXCIgdHlwZT1cIk1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uXCI+SW5pdGlhbCBsb2NhdGlvbi48L3BhcmFtPlxyXG4gICAgLy8vIDxwYXJhbSBuYW1lPVwiZGVzdFwiIHR5cGU9XCJNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvblwiPlNlY29uZCBsb2NhdGlvbi48L3BhcmFtPlxyXG4gICAgdHJ5IHtcclxuICAgICAgdmFyIGxhdDEgPSB0aGlzLmRlZ1RvUmFkKG9yaWdpbi5sYXRpdHVkZSk7XHJcbiAgICAgIHZhciBsb24xID0gb3JpZ2luLmxvbmdpdHVkZTtcclxuICAgICAgdmFyIGxhdDIgPSB0aGlzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpO1xyXG4gICAgICB2YXIgbG9uMiA9IGRlc3QubG9uZ2l0dWRlO1xyXG4gICAgICB2YXIgZExvbiA9IHRoaXMuZGVnVG9SYWQobG9uMiAtIGxvbjEpO1xyXG4gICAgICB2YXIgeSA9IE1hdGguc2luKGRMb24pICogTWF0aC5jb3MobGF0Mik7XHJcbiAgICAgIHZhciB4ID0gTWF0aC5jb3MobGF0MSkgKiBNYXRoLnNpbihsYXQyKSAtIE1hdGguc2luKGxhdDEpICogTWF0aC5jb3MobGF0MikgKiBNYXRoLmNvcyhkTG9uKTtcclxuXHJcbiAgICAgIGxhdDEgPSBsYXQyID0gbG9uMSA9IGxvbjIgPSBkTG9uID0gbnVsbDtcclxuXHJcbiAgICAgIHJldHVybiAodGhpcy5yYWRUb0RlZyhNYXRoLmF0YW4yKHksIHgpKSArIDM2MCkgJSAzNjA7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZygnRXJyb3IgaW4gY2FsY3VsYXRlQmVhcmluZyAtICcgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBTZW5kU01TKGZvcm0pIHtcclxuICAgIC8vIGlmKHRoaXMudGVjaG5pY2lhblBob25lICE9ICcnKXtcclxuICAgIGlmIChmb3JtLnZhbHVlLm1vYmlsZU5vICE9ICcnKSB7XHJcbiAgICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgd2FudCB0byBzZW5kIFNNUz8nKSkge1xyXG4gICAgICAgIC8vIHRoaXMubWFwU2VydmljZS5zZW5kU01TKHRoaXMudGVjaG5pY2lhblBob25lLGZvcm0udmFsdWUuc21zTWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnNlbmRTTVMoZm9ybS52YWx1ZS5tb2JpbGVObywgZm9ybS52YWx1ZS5zbXNNZXNzYWdlKTtcclxuXHJcbiAgICAgICAgZm9ybS5jb250cm9scy5zbXNNZXNzYWdlLnJlc2V0KClcclxuICAgICAgICBmb3JtLnZhbHVlLm1vYmlsZU5vID0gdGhpcy50ZWNobmljaWFuUGhvbmU7XHJcbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbFNNUycpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgLy90aGlzLnRvYXN0ci5zdWNjZXNzKCdTTVMgc2VudCBzdWNjZXNzZnVsbHknLCAnU3VjY2VzcycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgU2VuZEVtYWlsKGZvcm0pIHtcclxuICAgIC8vIGlmKHRoaXMudGVjaG5pY2lhbkVtYWlsICE9ICcnKXtcclxuICAgIGlmIChmb3JtLnZhbHVlLmVtYWlsSWQgIT0gJycpIHtcclxuICAgICAgaWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZSB3YW50IHRvIHNlbmQgRW1haWw/JykpIHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy51c2VyUHJvZmlsZVNlcnZpY2UuZ2V0VXNlckRhdGEodGhpcy5jb29raWVBVFRVSUQpXHJcbiAgICAgICAgLy8gICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgLy8gICAgIHZhciBuZXdEYXRhOiBhbnkgPSB0aGlzLnN0cmluZ2lmeUpzb24oZGF0YSk7XHJcbiAgICAgICAgLy8gICAgIC8vdGhpcy5tYXBTZXJ2aWNlLnNlbmRFbWFpbChuZXdEYXRhLmVtYWlsLHRoaXMudGVjaG5pY2lhbkVtYWlsLG5ld0RhdGEubGFzdE5hbWUgKyAnICcgKyBuZXdEYXRhLmZpcnN0TmFtZSwgdGhpcy50ZWNobmljaWFuTmFtZSwgZm9ybS52YWx1ZS5lbWFpbFN1YmplY3QsZm9ybS52YWx1ZS5lbWFpbE1lc3NhZ2UpO1xyXG4gICAgICAgIC8vICAgICB0aGlzLm1hcFNlcnZpY2Uuc2VuZEVtYWlsKG5ld0RhdGEuZW1haWwsIGZvcm0udmFsdWUuZW1haWxJZCwgbmV3RGF0YS5sYXN0TmFtZSArICcgJyArIG5ld0RhdGEuZmlyc3ROYW1lLCB0aGlzLnRlY2huaWNpYW5OYW1lLCBmb3JtLnZhbHVlLmVtYWlsU3ViamVjdCwgZm9ybS52YWx1ZS5lbWFpbE1lc3NhZ2UpO1xyXG4gICAgICAgIC8vICAgICB0aGlzLnRvYXN0ci5zdWNjZXNzKFwiRW1haWwgc2VudCBzdWNjZXNzZnVsbHlcIiwgJ1N1Y2Nlc3MnKTtcclxuXHJcbiAgICAgICAgLy8gICAgIGZvcm0uY29udHJvbHMuZW1haWxTdWJqZWN0LnJlc2V0KClcclxuICAgICAgICAvLyAgICAgZm9ybS5jb250cm9scy5lbWFpbE1lc3NhZ2UucmVzZXQoKVxyXG4gICAgICAgIC8vICAgICBmb3JtLnZhbHVlLmVtYWlsSWQgPSB0aGlzLnRlY2huaWNpYW5FbWFpbDtcclxuICAgICAgICAvLyAgICAgalF1ZXJ5KCcjbXlNb2RhbEVtYWlsJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAvLyAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBTZWFyY2hUcnVjayhmb3JtKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAvLyQoJyNsb2FkaW5nJykuc2hvdygpO1xyXG5cclxuICAgIGlmIChmb3JtLnZhbHVlLmlucHV0bWlsZXMgIT0gJycgJiYgZm9ybS52YWx1ZS5pbnB1dG1pbGVzICE9IG51bGwpIHtcclxuICAgICAgY29uc3QgbHQgPSB0aGF0LmNsaWNrZWRMYXQ7XHJcbiAgICAgIGNvbnN0IGxnID0gdGhhdC5jbGlja2VkTG9uZztcclxuICAgICAgY29uc3QgcmQgPSBmb3JtLnZhbHVlLmlucHV0bWlsZXM7XHJcblxyXG4gICAgICB0aGlzLmZvdW5kVHJ1Y2sgPSBmYWxzZTtcclxuICAgICAgdGhpcy5hbmltYXRpb25UcnVja0xpc3QgPSBbXTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmxvYWRNYXBWaWV3KCdyb2FkJyk7XHJcblxyXG4gICAgICB0aGF0LkxvYWRUcnVja3ModGhpcy5tYXAsIGx0LCBsZywgcmQsIHRydWUpO1xyXG5cclxuICAgICAgZm9ybS5jb250cm9scy5pbnB1dG1pbGVzLnJlc2V0KCk7XHJcbiAgICAgIGpRdWVyeSgnI215UmFkaXVzTW9kYWwnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICB9LCAxMDAwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGdldE1pbGVzKGkpIHtcclxuICAgIHJldHVybiBpICogMC4wMDA2MjEzNzExOTI7XHJcbiAgfVxyXG5cclxuICBnZXRNZXRlcnMoaSkge1xyXG4gICAgcmV0dXJuIGkgKiAxNjA5LjM0NDtcclxuICB9XHJcblxyXG4gIHN0cmluZ2lmeUpzb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gIH1cclxuICBwYXJzZVRvSnNvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcclxuICB9XHJcblxyXG4gIFJvdW5kKG51bWJlciwgcHJlY2lzaW9uKSB7XHJcbiAgICB2YXIgZmFjdG9yID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XHJcbiAgICB2YXIgdGVtcE51bWJlciA9IG51bWJlciAqIGZhY3RvcjtcclxuICAgIHZhciByb3VuZGVkVGVtcE51bWJlciA9IE1hdGgucm91bmQodGVtcE51bWJlcik7XHJcbiAgICByZXR1cm4gcm91bmRlZFRlbXBOdW1iZXIgLyBmYWN0b3I7XHJcbiAgfVxyXG5cclxuICBnZXRBdGFuMih5LCB4KSB7XHJcbiAgICByZXR1cm4gTWF0aC5hdGFuMih5LCB4KTtcclxuICB9O1xyXG5cclxuICBnZXRJY29uVXJsKGNvbG9yOiBzdHJpbmcsIHNvdXJjZUxhdDogbnVtYmVyLCBzb3VyY2VMb25nOiBudW1iZXIsIGRlc3RpbmF0aW9uTGF0OiBudW1iZXIsIGRlc3RpbmF0aW9uTG9uZzogbnVtYmVyKSB7XHJcbiAgICB2YXIgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQTNaSlJFRlVhSUh0bDExSVUyRVl4Lzl2dVZxUWF4ZUI2d3YwS3NjSUY0RzBicG9hWm5XemhWcGRWRXAxRVJybXBDaHZNZ2pySWhUNm9LQlo2RVhVQXVlTmFGSDBRVFN4eUFXVlhSUXVQMUF2c3UzTTVuSGFuaTdjbHVuWng5bG1DTDYvcTNQTzgvS2MvLzk1dndFT2g4UGhjRGdjRG9lelZHR3BTRUpFYWdCVnFjZ2xnWXN4MWh3cG1KWnNkaUpTQnlqd1ljejNjKzJ3WjhTZmJMNjViRm12VXhPUmtURldMaFdYM1FQQmF1OEVvQTkrMGs5TWlmdTJYZDJwRUVRaENhblNXUElxWVRGV0FFQVdZOHcxTnk2ckI0aW9hanJ3KzFMYXN1V3IrMzcwajQ5UGVxY3pWQmxLMTloM3RoRGlBY0RoNmdaUUFRQ1pBQkkzUUVUM0FKUmRlM1ViVmtjTEJGRllEY3hVYUVkbWJvcmt5aWN1QXlIeGxyWmEySHJzQ3l4SkhzdGlOVmpNNG9FWUJoYTdlQ0NLQVNJeVlwR0xCNkxNZ2NscC81blgzOTVNMlhyc2l2OHBTQzRSRGF4TVc3RzN2ZmRKWEVuU2xla3BFelNYTlVwVjFIalVWV2pBUFJUekI0TG9oVTZUalJLOUthNzJjaW5PTVlVZW5WTHhwSThTdGg0N1N2VW1OSm92SjVzcUd0V01NYmRVSUdrRGdpaWc4SllaaHF6VWIyYWxlak5LOUNZZ1F2V0JKQXpvTkZwOEd1a052enY2dWhOTk5TOVhDRU1jTzd3c0F5cWxDZzJtZWhScEM4TGZHcDdmUU1PTG0zTFNoRG0yL1FocThpcWhDaTRDRGxjM0xQWmFXWE5KbG9HbVE5ZXhTYjBSeHgrY2drY1VvTk5vVVdPc3dKcFZLbHpva0RjSGpodU9vcTdvSEpxNld0RDU1UmtBb01aWUNWdDVNM2JmMm85NEQ0Y1JEWWpUNHFoT284MElEWTBpN1M0WU1uTmhhTndWcnBDanJ4dUQ3aUZZRDE2SDFkRWlxM0lXWXdVZU9kditNVjdjZHdSZDFjOVF1dFVNcTZNWk9ldDBVd0FVa0RpRnhqU2dURlBlUHB0ZlZldVo4Q2dHM0VNbzNKeVBMdGZiZVNJN2U1OENBQXF6Q3lUSHNSUTZqUllxWlRwc3p2azd2TTFweCs3c2ZCQVJDalliRlFCZVN0MERZaHBnak5VUmticlJmRGw4VlJ6eGp2b0JySmpkVGhYY2FDN3VPUitYK05sSWJWS2IxQnRtZW5wbUFyOEVZSnJYYUxiT2VINUVSSHJNWENqc2RaMVhZSFg4dmFJMm1PcFJ1dFVNQUdZQWttdTFGT09UdmdPRDdzRVQrKzhlWGg0YTd6cU5GbzlQdG9hRlIxcjdFNGFJeW9pSVBnNzMwcDAzemRUL2M1Q0NsQ1dRU3kySTNxL0NoQkI0K0w2Vk9qNC9KU0tpUUNEZ0NSWnNZU0Fpb3pnMTJmN2oxNWpUNTUrNEh6eTFKcHBMVFVTblBhTDNuYy92NnlLaXV1Q2RtOFBoY0RpY3BjRWZrM2VBTGJjMStWUUFBQUFBU1VWT1JLNUNZSUk9XCI7XHJcblxyXG4gICAgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJncmVlblwiKSB7XHJcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEzWkpSRUZVYUlIdGwxMUlVMkVZeC85dnVWcVFheGVCNnd2MEtzY0lGNEcwYnBvYVpuV3poVnBkVkVwMUVScm1wQ2h2TWdqckloVDZvS0JaNkVYVUF1ZU5hRkgwUVRTeHlBV1ZYUlF1UDFBdnN1M001bkhhbmk3Y2x1blp4OWxtQ0w2L3EzUE84L0tjLy85NXZ3RU9oOFBoY0RnY0RvZXpWR0dwU0VKRWFnQlZxY2dsZ1lzeDFod3BtSlpzZGlKU0J5andZY3ozYysyd1o4U2ZiTDY1YkZtdlV4T1JrVEZXTGhXWDNRUEJhdThFb0E5KzBrOU1pZnUyWGQycEVFUWhDYW5TV1BJcVlURldBRUFXWTh3MU55NnJCNGlvYWpydysxTGFzdVdyKzM3MGo0OVBlcWN6VkJsSzE5aDN0aERpQWNEaDZnWlFBUUNaQUJJM1FFVDNBSlJkZTNVYlZrY0xCRkZZRGN4VWFFZG1ib3JreWljdUF5SHhsclphMkhyc0N5eEpIc3RpTlZqTTRvRVlCaGE3ZUNDS0FTSXlZcEdMQjZMTWdjbHAvNW5YMzk1TTJYcnNpdjhwU0M0UkRheE1XN0czdmZkSlhFblNsZWtwRXpTWE5VcFYxSGpVVldqQVBSVHpCNExvaFU2VGpSSzlLYTcyY2luT01ZVWVuVkx4cEk4U3RoNDdTdlVtTkpvdko1c3FHdFdNTWJkVUlHa0RnaWlnOEpZWmhxelViMmFsZWpOSzlDWWdRdldCSkF6b05GcDhHdWtOdnp2NnVoTk5OUzlYQ0VNY083d3NBeXFsQ2cybWVoUnBDOExmR3A3ZlFNT0xtM0xTaERtMi9RaHE4aXFoQ2k0Q0RsYzNMUFphV1hOSmxvR21ROWV4U2IwUnh4K2Nna2NVb05Ob1VXT3N3SnBWS2x6b2tEY0hqaHVPb3E3b0hKcTZXdEQ1NVJrQW9NWllDVnQ1TTNiZjJvOTRENGNSRFlqVDRxaE9vODBJRFkwaTdTNFlNbk5oYU53VnJwQ2pyeHVEN2lGWUQxNkgxZEVpcTNJV1l3VWVPZHYrTVY3Y2R3UmQxYzlRdXRVTXE2TVpPZXQwVXdBVWtEaUZ4alNnVEZQZVBwdGZWZXVaOENnRzNFTW8zSnlQTHRmYmVTSTdlNThDQUFxekN5VEhzUlE2alJZcVpUcHN6dms3dk0xcHgrN3NmQkFSQ2pZYkZRQmVTdDBEWWhwZ2pOVVJrYnJSZkRsOFZSenhqdm9CckpqZFRoWGNhQzd1T1IrWCtObEliVktiMUJ0bWVucG1BcjhFWUpyWGFMYk9lSDVFUkhyTVhDanNkWjFYWUhYOHZhSTJtT3BSdXRVTUFHWUFrbXUxRk9PVHZnT0Q3c0VUKys4ZVhoNGE3enFORm85UHRvYUZSMXI3RTRhSXlvaUlQZzczMHAwM3pkVC9jNUNDbENXUVN5MkkzcS9DaEJCNCtMNlZPajQvSlNLaVFDRGdDUlpzWVNBaW96ZzEyZjdqMTVqVDU1KzRIenkxSnBwTFRVU25QYUwzbmMvdjZ5S2l1dUNkbThQaGNEaWNwY0VmazNlQUxiYzErVlFBQUFBQVNVVk9SSzVDWUlJPVwiO1xyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwicmVkXCIpIHtcclxuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQTB4SlJFRlVhSUh0bHoxc0VtRWN4cDlYaEJRRGhSQS9NQ1NOVFV5OHRFc1hYRXNnY2RBQnFvT1RwQTR1a0tBT3hzWXVEa0owcmRIbzFKUW1iZ1ljWFB4S25EVGdVQWR0bXpTeElVQ0tSQ3dlb1FWNjkzZUF1Mmg3QlE1YTA4VDNOeDMzUDU1N252ZnIzaGZnY0RnY0RvZkQ0WEE0L3l0c0wwU0l5QTdnK2w1b2FiREtHSnZiclhpNFgzVWlza09XUDIvOS9IbTBYaWpVKzlYYnpwR1JFVHNSZVJoalY3WHF1bnVnMWRyakFNWmF0OGJremMwTFh6d2VveVNLZlZqVnhoa093eGtLQWNBd1kyeDFlMTFYRHhEUmRaS2tlOHhnc05ReW1ZcFVxV3laamg4ZnFHVXliRC9NQTBBbG5WWXVUd0hvUFFBUnpRS1lMRHg5aW1JOERra1VMVUN6aFN4dTkxNTQ3WW11QWlqbU05UFRLQ1dUKzJ4Skg0YzZQWENRelFNZEFoeDA4MENiQUVUa3dRRTNEN1NaQTFTdjN4SS9mR2lVa2tuanZ6U2tsMTBETUpQcC9QcXJWMTJKR0t6V1BUT2tWN3Z0S2xUUDV6dStRQkpGbUFVQkRyKy9xK2YxNHZEN2xjc0ZyWHJmVzRsU0lnRkhJSUNoV0t4ZnFYYmNaSXl0YXhYNkRpQ0pJcFl2WG9UbDdObCtwWGJnQ0FTVUh0QnNmYUNQQUdaQndNYlNrdnE3a2tyMUtyVkRTNkdiTDd5dUFBYXJGVVBSS0d3K24zcHY3ZEVqckQxK3JFZEc1ZGlWSzNDR3crcEVyYVRUeUV4UG81N0xkYTJoSzhEd3c0Y3d1Vno0Rm9tb2s5Y1pDc0V3T0lqYy9mdjZ6QWVEY04yK2plTDhQTXJ2M2dFQW5LRVFUcy9PWXZuU0pYUzdPZHcxZ0x5NVdUQUx3Z2xsYU5oOFBsamNibnc5ZDA1dG9Vb3FoWG91aCtHWkdSVG41M1cxbkRNVVF1bkZpNytDcjZSU0dIbjlHbzZKQ1JUamNSd1pIVzBBTUVKakY5b3h3S0dCZ1Njbkk1RTdVcmxzck9menNIbTlxS1RUTzB5VzM3NXRCdlI2TmNleEZtWkJnTUZxMWZ6Q2w1SkoyTHhlZ0FpRDQrTkdBTysxemdFZEF6REc3aEtSZlNnV1U0K0tqZWFKeS9UbmM4cjRkVTFOZFdWZTY3OS9Zbks1WUhHN2xRbjhIa0NnblVaWEp6SWlHa1B6UUpISVBYaUFZanl1MW9haVVUZ0NBUUNZQUtDNVZtc2hWNnVYYTluc3RaVmcwS0NNZDdNZzRNeno1NnJ4M2RiK25pR2lTU0tpNnVJaWZaK2JvMW8yU3kwbWU5Q3lTNks0c3ZYcmwvd2prYUQxTjIrYVNySmNialhZL2tCRUhybFdlOWtvbFJha2pZMW5yVjFycjFwMklyb2hpZUtucldyMUl4SGRiWjI1T1J3T2g4UDVQL2dOcWh4LzZyc3VqamdBQUFBQVNVVk9SSzVDWUlJPVwiO1xyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwieWVsbG93XCIpIHtcclxuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQXloSlJFRlVhSUh0bHoxTVUxRVlodC92WWhXTmFadGdoQUdObUlDSlZtRndNQ0ZSSEV3RUU4VkpuTVJCblJRZHlnQU9EcnJvWUNJTHVCZ1dZZFBFeUdSaXhCUWNIQ0QrREtoQVdpTTQxSGdKbEovYm50ZWh0L1dudHorM0JVUENlYWJlKzUyOGZiL3ZuSHZPZHdDTlJxUFJhRFFhalVhelVaSFZFQ0hwQjlDeEdsb09USXRJZjdiZ3BsTFZTZnBCTlE3cnh3NHNmbHNwVlM4RDN5RS95U1lSdWVnVWRqMERkcldQQVdpd1h6VWdzWGdxOGVLZ0I1WlpnbE5ucEs0VFJsMFFBR3BFWlByZnVLc1pJTmtCeG05RE5tMUhiSEllMW53YzVWWGxYSmlVdFRBUEFJaUdBQVFCWUErQTRoTWcrUWhBdS9wMEg1enFBeXh6TzVDc2tGUTBycEpiOXhTVVFNbzh4NitCa1lFMXR1UU9JOStBUDgycmRXWWV5SlBBZWpjUDVFaUFaQlBXdVhrZzF6ZVFXQTR5T215cHlJRG5QL3B4VGZZRXlyYTBZT1paWVNvZTd5clpjZEwyNVF6bjNJVVlDK2ZWbDdnSjhRWWd1OXFBQXNhN1JhclBwWDZPT2NWTGJpVlVaQkJHOVhrWTlUMmxTdVhpaG9qOGRBcVVuQUFzRTJxNGFVME9NNmx1Uzg1c2x1b0RKU1FnM2dBNDl6Nzl6R2lvV0trTXJUUVZqWG1iTlhjSmVId3c2aDlBcWxyU3J6aHhGMnJpbml1WkZFYk5aVWhkWi9wRFpUUUVqbDhyNk50TDRTb0I0M0EvWk50dXFMY1hBTXVFK0FLUTJrNkl4dzkrNkhabmZ1OFZ5UDdiVUZNUGdka2hBSGJuZWVRcEVxK1BvOURtTVB0Sm5GajZMcjVBK2xHcVdpQVZqVkNqcmVEc0VCZ05RVTMyUVkxZlRWWnkyMjVYQ1VodEVJd01naCs2azVXUGhxQkd6d0FDR01sMUQvRTNXUGJ3akM0MFJZNXpvTHhYOW5WMWlXVjZFQXRES3B2QjZFakc5REpWdmNxVGdOTTZkakx2RFFBZUgvaDFNQ09tSW9PUXltWVlKR1RuQ1ErQVYwNzNnTHdKaU1ndGtuNmp2dWYzVlhGcFpnWEE1cjhHMnV0WER0eHhmenR5T0tSazY2N2tqcGJjMVY0QmFNMGxVZEIva214QThrTHhoQjl2UWszMnBXTkdmVTlxcXpzTHdIR3ZkaVF4ZjQ2eDhDVTFjcm9zdGQ3Rkc0Qng5R1hhZUxhOXYyaEl0cE9rTXQ4eDhhV1hYQWpUcHIwSUxUOVg1ajdUTXBVS0QxRE5QTGVsbEdrWGJHMGcyY1Q0MG5NdVI4Y1lqejIydTlaaXRmd2tyM1BGZk12NHdodVN0K3c3dDBhajBXZzBHNE5mVGl4a2ZGeHlYUEVBQUFBQVNVVk9SSzVDWUlJPVwiXHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJwdXJwbGVcIikge1xyXG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRjYybFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd015MHdNMVF4TVRvME1Eb3pOeTB3TlRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURNdE1ETlVNVEU2TlRNNk1qVXRNRFU2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURNdE1ETlVNVEU2TlRNNk1qVXRNRFU2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVRsaFlUWXhaR1l0WTJWaE5DMHdZelF5TFRoaFpUQXRaalkxWlRkaE5XSXdNakJoSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZNVEk0Tm1ZelpHVXRaRGRqTlMxa1pUUm1MVGc1TkdZdE1XWXpPRGsyWW1NNVpqRmtJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZZVGRrTkRSbU4yRXRNakpsWXkxaE9EUTBMVGxtT1dJdE1UQTNZakZoTldZMk9UY3lJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwaE4yUTBOR1kzWVMweU1tVmpMV0U0TkRRdE9XWTVZaTB4TURkaU1XRTFaalk1TnpJaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1ETXRNRE5VTVRFNk5EQTZNemN0TURVNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPbUU1WVdFMk1XUm1MV05sWVRRdE1HTTBNaTA0WVdVd0xXWTJOV1UzWVRWaU1ESXdZU0lnYzNSRmRuUTZkMmhsYmowaU1qQXhPQzB3TXkwd00xUXhNVG8xTXpveU5TMHdOVG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOEwzSmtaanBUWlhFK0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0lEd3ZjbVJtT2xKRVJqNGdQQzk0T25odGNHMWxkR0UrSUR3L2VIQmhZMnRsZENCbGJtUTlJbklpUHo2UlEyY1hBQUFDUzBsRVFWUm8zdTJZdlVvRFFSREg4d2g1Qk45QUg4REMya1lyV3dYdDFWN1JXaHU3bElLS1dDa3FOb0tvb0tCRUpTREVEMHdSalNTU2NHTGlKV1p6ZCt2K3o5dXdoSHhlOXVDRUdSaENObmV6ODV1ZG5aMU5oSE1lK2M4YUlRQUNJQUFDSUFBQ0lBQUNJQUFDSUFEdEFMMkllRDRxZENrZ25WVG0wUThBNXgyYnA4c0ZaaGFTMzUrNmxmL0p1allBTDlwalNvVDJhaFdiN1F6ZjhvM0JhKzJhaUdVOEJqN1FONEFZbjdVdHB3UnJ4ZGRLQ1JFcTUxbmw0NjVZQzhKNTZQSE1nd1FZNlFzQXl3Z3JpSWdhYlh6UHhyOTRxQUdrODVlTHFhWkxIR3FBZHM2SEhxQ1Q4NkVHOEY1bzYzeW9BZXlxYy9SMi9zbTZLWE5oWFlHTzBaY0F4cU1aR01EcC9MTi9BTkIzbWlDK21uYXRYeXlrK1BIMGczWjlQVEVrUURRUUFKd0p4cFBKQTVhNW5sdUpiZ0hVWE5XdHFZTjhQWDIwQXh4TzNHdkw4MWEybEQ1SUR3RFNSY2xKTGxzTHY0N0hWOUs4V3F6VmJhR2E3WTRtZ2dQQUJLWDNIN2N5NERkc1lEaVEzTXIyN3J5MytmR3VUQm5YZnVhbjNtdjFCU0JhNUJ3bWFTeG5hb1RhalhkU2dDUEhHOGNSSURrdnppSFpTdnRaZ2VWYTJXYXlQTDdzNTFzZVdCQ2tRN2VsRWMrMjJtUHlZSlRQQ0RuemZTTVRuMnRxdnB1NWFyVlpHZlVyV0wxR2UwcmxjWjFIL2UvN1NpbStEd2tkZHlPdHBCVVVLK1BKdUhkYWRxWE10R0xHczJtcGR3dFVvMmFPYTdzVGkvRXBXRWZya056TXVodk9rNmxJandJSFdjbDZFWHZCUVJEcTFjM2hYd2hZaTNlMDNJbEgwT2hWREpZUUczMWJWZ2cvNHJVSGN3TGtocFd0Syt5N1pwSDNCVUIvYkJFQUFSQUFBUkRBZjlCZlJiNjRLWWZsUkxBQUFBQUFTVVZPUks1Q1lJST1cIlxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpY29uVXJsO1xyXG4gIH1cclxuXHJcbiAgbG9jYXRlcHVzaHBpbihvYmopIHtcclxuICAgIGNvbnN0IHRydWNrSWQgPSBvYmoudHJ1Y2tJZDtcclxuXHJcbiAgICAvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBwaW5zIGluIHRoZSBkYXRhIGxheWVyIGFuZCBmaW5kIHRoZSBwdXNocGluIGZvciB0aGUgbG9jYXRpb24uIFxyXG4gICAgbGV0IHNlYXJjaFBpbjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhTGF5ZXIuZ2V0TGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICBzZWFyY2hQaW4gPSB0aGlzLmRhdGFMYXllci5nZXQoaSk7XHJcbiAgICAgIGlmIChzZWFyY2hQaW4ubWV0YWRhdGEudHJ1Y2tJZC50b0xvd2VyQ2FzZSgpICE9PSB0cnVja0lkLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICBzZWFyY2hQaW4gPSBudWxsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgYSBwaW4gaXMgZm91bmQgd2l0aCBhIG1hdGNoaW5nIElELCB0aGVuIGNlbnRlciB0aGUgbWFwIG9uIGl0IGFuZCBzaG93IGl0J3MgaW5mb2JveC5cclxuICAgIGlmIChzZWFyY2hQaW4pIHtcclxuICAgICAgLy8gT2Zmc2V0IHRoZSBjZW50ZXJpbmcgdG8gYWNjb3VudCBmb3IgdGhlIGluZm9ib3guXHJcbiAgICAgIHRoaXMubWFwLnNldFZpZXcoeyBjZW50ZXI6IHNlYXJjaFBpbi5nZXRMb2NhdGlvbigpLCB6b29tOiAxNyB9KTtcclxuICAgICAgLy8gdGhpcy5kaXNwbGF5SW5mb0JveChzZWFyY2hQaW4sIG9iaik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKGxvY2F0aW9uLCB1cmwsIHJvdGF0aW9uQW5nbGUsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cclxuICAgICAgdmFyIHJvdGF0aW9uQW5nbGVSYWRzID0gcm90YXRpb25BbmdsZSAqIE1hdGguUEkgLyAxODA7XHJcbiAgICAgIGMud2lkdGggPSA1MDtcclxuICAgICAgYy5oZWlnaHQgPSA1MDtcclxuICAgICAgLy8gQ2FsY3VsYXRlIHJvdGF0ZWQgaW1hZ2Ugc2l6ZS5cclxuICAgICAgLy8gYy53aWR0aCA9IE1hdGguYWJzKE1hdGguY2VpbChpbWcud2lkdGggKiBNYXRoLmNvcyhyb3RhdGlvbkFuZ2xlUmFkcykgKyBpbWcuaGVpZ2h0ICogTWF0aC5zaW4ocm90YXRpb25BbmdsZVJhZHMpKSk7XHJcbiAgICAgIC8vIGMuaGVpZ2h0ID0gTWF0aC5hYnMoTWF0aC5jZWlsKGltZy53aWR0aCAqIE1hdGguc2luKHJvdGF0aW9uQW5nbGVSYWRzKSArIGltZy5oZWlnaHQgKiBNYXRoLmNvcyhyb3RhdGlvbkFuZ2xlUmFkcykpKTtcclxuXHJcbiAgICAgIHZhciBjb250ZXh0ID0gYy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgICAgLy8gTW92ZSB0byB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGMud2lkdGggLyAyLCBjLmhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgLy8gUm90YXRlIHRoZSBjYW52YXMgdG8gdGhlIHNwZWNpZmllZCBhbmdsZSBpbiBkZWdyZWVzLlxyXG4gICAgICBjb250ZXh0LnJvdGF0ZShyb3RhdGlvbkFuZ2xlUmFkcyk7XHJcblxyXG4gICAgICAvLyBEcmF3IHRoZSBpbWFnZSwgc2luY2UgdGhlIGNvbnRleHQgaXMgcm90YXRlZCwgdGhlIGltYWdlIHdpbGwgYmUgcm90YXRlZCBhbHNvLlxyXG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWcsIC1pbWcud2lkdGggLyAyLCAtaW1nLmhlaWdodCAvIDIpO1xyXG4gICAgICAvLyBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgyNCwgNilcclxuICAgICAgaWYgKCFpc05hTihyb3RhdGlvbkFuZ2xlUmFkcykgJiYgcm90YXRpb25BbmdsZVJhZHMgPiAwKSB7XHJcbiAgICAgICAgbG9jYXRpb24uc2V0T3B0aW9ucyh7IGljb246IGMudG9EYXRhVVJMKCksIGFuY2hvcjogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KGMud2lkdGggLyAyLCBjLmhlaWdodCAvIDIpIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyByZXR1cm4gYztcclxuICAgIH07XHJcblxyXG4gICAgLy8gQWxsb3cgY3Jvc3MgZG9tYWluIGltYWdlIGVkaXR0aW5nLlxyXG4gICAgaW1nLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XHJcbiAgICBpbWcuc3JjID0gdXJsO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGhyZXNob2xkVmFsdWUoKSB7XHJcblxyXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFJ1bGVzKHRoaXMudGVjaFR5cGUpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGRhdGEpID0+IHtcclxuICAgICAgICAgIHZhciBvYmogPSBKU09OLnBhcnNlKCh0aGlzLnN0cmluZ2lmeUJvZHlKc29uKGRhdGEpKS5kYXRhKTtcclxuICAgICAgICAgIGlmIChvYmogIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgaWRsZVRpbWUgPSBvYmouZmlsdGVyKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmZpZWxkTmFtZSA9PT0gJ0N1bXVsYXRpdmUgaWRsZSB0aW1lIGZvciBSRUQnICYmIGVsZW1lbnQuZGlzcGF0Y2hUeXBlID09PSB0aGlzLnRlY2hUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC52YWx1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkbGVUaW1lICE9IHVuZGVmaW5lZCAmJiBpZGxlVGltZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy50aHJlc2hvbGRWYWx1ZSA9IGlkbGVUaW1lWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIHN0cmluZ2lmeUJvZHlKc29uKGRhdGEpIHtcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGFbJ19ib2R5J10pO1xyXG4gIH1cclxuXHJcbiAgVVRDVG9UaW1lWm9uZShyZWNvcmREYXRldGltZSkge1xyXG4gICAgdmFyIHJlY29yZFRpbWU7XHJcbiAgICB2YXIgcmVjb3JkZFRpbWUgPSBtb21lbnR0aW1lem9uZS51dGMocmVjb3JkRGF0ZXRpbWUpO1xyXG4gICAgLy8gdmFyIHJlY29yZGRUaW1lID0gbW9tZW50dGltZXpvbmUudHoocmVjb3JkRGF0ZXRpbWUsIFwiQW1lcmljYS9DaGljYWdvXCIpO1xyXG5cclxuICAgIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdDU1QnKSB7XHJcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignQW1lcmljYS9DaGljYWdvJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcclxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnRVNUJykge1xyXG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ0FtZXJpY2EvTmV3X1lvcmsnKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdQU1QnKSB7XHJcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignQW1lcmljYS9Mb3NfQW5nZWxlcycpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ0FsYXNrYScpIHtcclxuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdVUy9BbGFza2EnKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZWNvcmRUaW1lO1xyXG4gIH1cclxuICBcclxuICBhZGRUaWNrZXREYXRhKG1hcCwgZGlyTWFuYWdlcil7XHJcbiAgICAvLy8vbG9hZCBjdXJyZW50IGxvY2F0aW9uXHJcbiAgICB2YXIgbWFwWm9vbUxldmVsOiBudW1iZXI9MTA7XHJcbiAgICBsb2FkQ3VycmVudExvY2F0aW9uKCk7ICAgIFxyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy5VcGRhdGVUaWNrZXRKU09ORGF0YUxpc3QoKTtcclxuICAgIHZhciBpbml0SW5kZXg6IG51bWJlciA9MTtcclxuICAgIHRoaXMudGlja2V0RGF0YS5mb3JFYWNoKGRhdGEgPT4ge1xyXG4gICAgICBpZihkYXRhLmxhdGl0dWRlICE9ICcnICYmICBkYXRhLmxvbmdpdHVkZSAhPSAnJyl7XHJcbiAgICAgICAgdmFyIHRpY2tldEltYWdlID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNnQUFBQXRDQVlBQUFEY015bmVBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFOT1NVUkJWRmlGelpsUFNCUlJHTUIvMzl0TUNDTjNOeTNJTGxHQy9UbFlVT0NmVFlJd0lTandWblRwVkhUSmcxRWdDZFZGcTFzUkhTTG9uSWU2V0ZHa3E3c1ZGRWhobXVXdFA0VE1paWlGdWpPdlE2TTc2cXc2N3Jqajd6YnZmZk45UHg2ek8rOTlJNndBM1VDaE1VNnRDTFZhcUJTTFhRaGJnQ0k3WkFMTmJ4R0dOUFJwaUVlTDZKVk9KcjNXRWkvQm96RXFMWXNMQ0kxQXNjZGFvMENITXJrYlR0TG5xMkNxanIzYTVCWlE3MUVxVzlWT1RKcWpDZnFYRGwwRXZZZjFxUWczZ0NaZ25TOXlHZEphdUIwMXVDcjlUSGtXTk9vb0U1TW5HdmI3TERiZjRMMmU1dVRtTi94d24zYVRxMllQSVo2ajJiYXFjaG0rQS9YUkhqN1BuMWdnT0ZKRHVSSzZnYTM1TUhQd3l3d1JLKzNpbTNOd2p1QklOUnVWNGgxUWtWZTFERU5TeU1ISVM4Wm1CcFJ6VmlrZUVwd2NRTG1lNUw1ellIWUZqVm9hZ2NkNVYzTEJFazZVeEhrS3RxQStRRUZxQTRQQWprRE5iQVMraFVOVVNCZHBCV0JzNERSclJBNUF3MDRqelNtd24wR0I4OEVxTFVTRWN3QmkvNjE4Q1ZySWpaREpUaVhpMC90MUZiQVU5VXFnS21pUmJGaFFyWURkUVl0a1JhaFFRRm5RSG90UXBzanNndGNjQXBzVWVOK0c1NUcvQ3ZnWnRNVWkvRlFDdjRLMldJUWZ5b0tCb0MyeUlUQ29nQmRCaTJSRjgxenNUYW9CRkFUdE00OHBNMFJVbFNRWVp3MnVvc0N6MGk0bUZJQVMyb01XY3FFZDdPMVdPRTRjU0FhcTQwVFRFK2toQWM0emlkQU1tRUU1T1REUlhKcTVtQldNeGtscXpjMWduRElJdEVVVHZIVmNaOUFORkk1T2tGejFia0lXQkQ2RVUxUTVXeUZ6anAzU3lXUUJISU9GSi93OE1KUU9jWHgrbjhhOTlWRkhHU2JkNU9rZ3BXRllXOFJLRWd2M0JjcnRobWdYM3d0Q0hFTG9YSDA5WHBsVFZMdkp3Vkx0TjFCR0xaY0ZXb0gxUG90TmlkQWFqdE1tb0xNRkxhdUJhY1RZRHJTZ09VdnVmVUlMb1NPVTVrcHhrdUdsZ2oyMWdFZHFLRmR3eG00QmUrM2hES0RwTUJXUFN1TjhYZTVObmdTZHBHTHMwNXB1SUx4RTZLZ0loeU54UHEya2p1dVBaRG5ZQmE4dkkvVGFTdVVnQjBHQXlCL3VBRVBaNWpVTVI0cTRsMHVObkFUbEE5UFcvM2U0ZTNKTjAwcStqY3lwa2N2Tk14ZzF2RUE0T2lleDVuV2tseU81NXM1cEJXZlJOQUZweDRpSmNOR1AxTDRJMmg5a0hzNE9DQThpUFh6MEk3Yy9Ld2hNbTdRQVk4QzRxV2oxSys4L2RramxmZmUwMTY4QUFBQUFTVVZPUks1Q1lJST1cIlxyXG4gICAgICAgIGlmKGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJ1bmtub3duXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcIndhcm5pbmdcIiB8fCBkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkgPT09IFwibWlub3JcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0aWNrZXRJbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDd0FBQUF6Q0FZQUFBRHNCT3BQQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBUHlTVVJCVkdpQjdaaFBpQnQxRk1lLzd5WFQxZDNGUWhHS2VLbm9LdGpzV21sdnhSYWg5cUxWUzZkSlpvT3VCdytXUWkvMXRJY1d2T2lXc2xTOXVBZUpheWEvYklNSEtZcW9oeFFVUVloYU5wV3lXRkJXb2kzMG9DaDFONVBmODdEYmtKMU1KcE9kWkJLd24xdmU3LzErNzVOaDV2ZVBzQTFNMDl4aEdNWkJBSWNBUEEzZ0NRQzdBWXh2cHZ4TlJIK0l5QXFBSDVqNXl1am82RGNMQ3d1MTdkUnJocnBKVHFmVGU0bm9GSUFUQUhaMVdlczJnRXRFOUo1dDJ6OTEyYmRCSU9Ga012bDRMQmFiQS9CaTBENCtDSUJQbVBtTlhDNzNjN2VkZll1YnBobUx4K096UkRRTFlNZDJEZHV3SmlKdk9vN3pWckZZckFmdDFGWTRuVTQvU0VRZlkrTTk3UnNpVWpJTTQvamk0dUx0SVBtZXdxbFVhZzh6ZndGZ29xZDI3VmtCY0RTZnovL2FLYkZGT0oxTzd5YWlLOWo0OHFQa0JqTS9rOHZsZnZkTDR1WWZNek16OXhIUnA0aGVGZ0FlMVZwL1pwcm0vWDVKVzRUWDE5Zm5BZXp2cTVZLyt3ekRtUE5MYUx3U2xtVWRBbEJDK0drckxGcEVEaXVsdnZacXZQdUVDY0JGREY0V0FKaUk1dEhHaFFFZ2s4a2NBN0F2U3FzT0hKaWVubjdlcTRFQlFHdDlNbHFmem9qSTYxNXh5bVF5RDJtdFZ3SEVJbmJxUkYxRUhsWkszV3dPc29nY3hmREpBaHRPejdtRHJMWHU2OUliQmlJNjdJNHhNKzhkaEV3UWlPaEpkNHhGWk04QVhBSWhJbys0WXd4ZzV3QmNndExpeGw1WlEwU0xId080NlpFNExGVGRBZllLRGhHZXdoMDN6UU9reFkwM04rdERpWWlVM0RHdTErdWZEOEFsRUNMeWxUdkdoVUxoRndEWG85ZnB5TFZOdHkwd0FJakl1NUhyZE9ZZHJ5QUR3TWpJeUFjWXJ1bnRWcTFXKzhpcmdRRWdtODMrQzJBK1VpVi96aGVMeFR0ZURZMlZwRnF0WGdEd1hXUks3ZmwrZkh6OFlydkdobkNwVkhKRTVCVUFudjhzSXRaRTVHVy9XODR0YTdWUzZqcUExd0RvZnB0NW9FWGtWYVhVTmIra2xwUEc4dkx5Y2lLUldDV2lYdHhVQmtWRTVLUlNLdHNwMGZOb1ZLbFVmcHljbkx3RklJcmowN3FJbkZKS3ZSOGsyZmNKcGxLcEE4eDhDVURMUnJwSC9DWWlKNVJTM3didDRQdjBLcFZLTlpGSTJFVDBBSUNuT3VWM1FRM0FRandlVDlxMnZkSk54OER2YUNhVGVVeHJmUTdBY1FBajNmazFXQ09pb3VNNDU1YVdsbTVzWjRDdVB5clROSGNhaHZFQ2dDU0FZd0c3WFFhd1JFU1hiZHYrcTl1YXpZU2FCU3pMK2hMQUViOGNFU2twcFo0TlU2ZVpVR2M2Wmo0RC96bGJFOUdaTURWYWFvYnBuTXZscmdKWTlFbjVNSi9QbDhQVWNCUDYxS3kxbmdYd2owZlRIYTMxMmJEanV3a3RYQ2dVcWtSMHdhTnBybEFvcklZZDMwMVA3aVhHeHNiZUJ0QXNWNDNGWXVkN01iYWJuaXdFNVhLNU5qVTE5U2VBbHdCQVJFN2J0dDJYcldyUGJuNG1KaWF5QU1vaWN0VnhITDhQY1hpd0xPdUlaVm0rOC9JOTd2Ri81ei9kMGpvRVB6aFpHZ0FBQUFCSlJVNUVya0pnZ2c9PVwiXHJcbiAgICAgICAgfWVsc2UgaWYoZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcIm1ham9yXCIpe1xyXG4gICAgICAgICAgdGlja2V0SW1hZ2UgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ3dBQUFBekNBWUFBQURzQk9wUEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBT3hBQUFEc1FCbFNzT0d3QUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU95U1VSQlZHaUI3WmhOYUJ4bEdJQ2ZkMlpOYWxzb2lGQlVoTGJaVGZwek1OTGdRVEZGcUwxb1BaVjRVWnZkcEpUV0h1c3BnZ0V2bWxKQ1ZkQ2c1c2NpWXNTRDlDTHFJWUdLSUxiYVEycTczYTJHbHRnS0JSVk5tdXpPdkI0UzA4M3N6T3pNenU3c2duMXU4Mzd2OTMwUEg3dmZ6eXRVdytSTUN3dXRUMkJyTi9BbzBBRnNCamF1WlB5TmNnTWhDL3dJVExQMDU3Y2M3aXBVTlY4SkVpcDcvTW91Vkk2QjlnRDNoWnpyRnNJa051K1FTVjBNMlhlVllNSVQrWFpzZXdoNExuQWZieFQ0QWt0ZW9UK1pDOXZaZi9KSk5ablBEYUFNQUMxVkNucXhpTWpyckc5N2d4NnhnbmJ5Rmg2NWZEOHR4dWRBZHkzc2ZKakNLQjdnNEk1YlFaTGRoY2QrM2dLSnI0QlVEY1g4eUdLWisramZObHNwc1Z6NC9hdWJTZGpUb0IxMVVmTW1UNkx3SkMvdS9NMHZhYTN3MkMvcm9IZ1cyRjFQTXg5K1lzTzZ4K2w1ZU1FcndWajdhUTNUT0ZtQVR1WnZEL2tsM0ZuaDhXdzNLbE5FMzdhaVltTWJlK2hyTyt2V3VMekNxb0xLS1JvdkMyQmcyc09vdXJvc0MwL2s5Z09kY1ZyNW9uUXhkdVVadDZhVkZlWm9yRUpCRUk2NGgwOWZmSURpUGRjQU0yYWxTbGdVelljNHRPMW1hZENnMExLUDVwTUZNREd0cDUxQkE5RjZINzNWWTdDblBBUzdHcUFTREdXbk0yUUFXK0kzQ1lwc2RVWU1ZRk1EVEFLaVpXNkdXMW9UVWVabkFEZGRFcHVGT1dmQVFNdURUWU9vaTdCb3hVdHp3MUFwY3pPQTZRYW9CRU9aY29ZTXNMNXNnRW93cFBpTk0yU1EzdkVyY0NsK200ck1yTGl0NGI5dDQrMTRYUUlnOHBaYmVFVTRNVXB6YlcrL3M3NzF0RnZEc25CNjYyMWdPRTRqWDFST2VEMUU3NXdrczlkUEF0L0g1ZVREZVFwL25QSnFkRHp6TDI4SDR6eHdiNzJ0UEZoRTJFMXZhc1lyWWUxWm5lNjRoSEFJc090dDVvS05hdHBQRnR3dVA3MnBqMUh0WjduS0dCZUs2bEV5N1o5VVNuUy9yV1hheDFCZUJpSVhvQU93aE9vUk11MGpRWkw5NnhBZjVyc3c3RW1nN0NKZEU0VHJDRDBjVEgwWHRJdi9mYml2N1FlVzdNZEEzcU8ycTExQWVCY3Bkb2FSaFRDVm5nOXlTVXdkQkE0QXJlSDhWbGxFK0F3WXBEZVZyMmFBOEtXcGtmd21XdTFuVVo0SDlnZnNkUWJoVXhLYzRZWFVYNkhuTENGYUxXMDg5eldxZXl0a1RaRk9QUlZwbmhLaXZla3M2emorZTdhTnlQRkljemlJSnR6WGNRSGtJODkyWVlMZTVMbEljemlJL21xMml3UEFQeTR0QzlqeVd1VHhIVVFYN3RzK2gzTFNwV1dJVFBKYTVQRWQxS1l1VWRqd0psQXFONGM1ZjZJbVl6dW9qZkRoQitlQndkVnYxVmQ1NlJHM24wbGthbGY1bVUyT0ErZUFDMnhNZWY4Um00clI3RjVHczVYMjVidmM1WC9OdjFvWTlxZGJGa2wwQUFBQUFFbEZUa1N1UW1DQ1wiXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgcHVzaHBpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihkYXRhLmxhdGl0dWRlLCBkYXRhLmxvbmdpdHVkZSksIHsgaWNvbjogdGlja2V0SW1hZ2UsIHRleHQ6IGluaXRJbmRleC50b1N0cmluZygpIH0pO1xyXG4gICAgICAgIHB1c2hwaW4ubWV0YWRhdGEgPSBkYXRhO1xyXG4gICAgICAgIG1hcC5lbnRpdGllcy5wdXNoKHB1c2hwaW4pO1xyXG4gICAgICAgIHRoaXMuZGF0YUxheWVyLnB1c2gocHVzaHBpbik7XHJcbiAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIocHVzaHBpbiwgJ2NsaWNrJywgcHVzaHBpbkNsaWNrZWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIG1hcC5zZXRWaWV3KHsgbWFwVHlwZUlkOiBNaWNyb3NvZnQuTWFwcy5NYXBUeXBlSWQucm9hZCwgY2VudGVyOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZGF0YS5sYXRpdHVkZSwgZGF0YS5sb25naXR1ZGUpfSk7XHJcbiAgICAgICAgaW5pdEluZGV4ID0gaW5pdEluZGV4ICsgMTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBtYXBab29tTGV2ZWwgPSBtYXAuZ2V0Wm9vbSgpO1xyXG4gICAgXHJcbiAgICAvLyBjb25zdCBpbmZvYm94ID0gbmV3IE1pY3Jvc29mdC5NYXBzLkluZm9ib3gobWFwLmdldENlbnRlcigpLCB7XHJcbiAgICAvLyAgIHZpc2libGU6IGZhbHNlLCBhdXRvQWxpZ25tZW50OiB0cnVlXHJcbiAgICAvLyB9KTsgICAgXHJcbiAgICBmdW5jdGlvbiBwdXNocGluQ2xpY2tlZChlKSB7XHJcbiAgICAgIGlmIChlLnRhcmdldC5tZXRhZGF0YSkge1xyXG4gICAgICAgIHZhciBsbD1lLnRhcmdldC5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgIGxvYWRUaWNrZXREaXJlY3Rpb25zKHRoaXMsIGUudGFyZ2V0Lm1ldGFkYXRhLCBsbC5sYXRpdHVkZSwgbGwubG9uZ2l0dWRlKTtcclxuICAgICAgICAvLy8vaW5mb2JveC5zZXRNYXAobWFwKTsgIFxyXG4gICAgICAgIC8vIGluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgICAgLy8gICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcclxuICAgICAgICAvLyAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgLy8gICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCA0MCksXHJcbiAgICAgICAgLy8gICBodG1sQ29udGVudDonPGRpdiBzdHlsZT1cIm1hcmdpbjphdXRvICFpbXBvcnRhbnQ7d2lkdGg6NTUwcHggIWltcG9ydGFudDtiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtib3JkZXI6IDFweCBzb2xpZCBsaWdodGdyYXk7XCI+J1xyXG4gICAgICAgIC8vICAgKyBnZXRUaWNrZXRJbmZvQm94SFRNTChlLnRhcmdldC5tZXRhZGF0YSkgKyAnPC9kaXY+J1xyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICB9XHJcbiAgICAgICQoJy5OYXZCYXJfQ29udGFpbmVyLkxpZ2h0JykuYXR0cignc3R5bGUnLCdib3R0b206MzBweDt0b3A6dW5zZXQgIWltcG9ydGFudDsnKTtcclxuICAgICAgcGluQ2xpY2tlZChlLnRhcmdldC5tZXRhZGF0YSwgMClcclxuICAgICAgLy8vL01pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKGluZm9ib3gsICdjbGljaycsIGNsb3NlKTtcclxuICB9XHJcbiAgdmFyIGN1cnJlbnRMYXRpdHVkZT00MC4zMTI4O1xyXG4gIHZhciBjdXJyZW50TG9uZ2l0dWRlPS03NS4zOTAyO1xyXG4gIHZhciBkaXN0YW5jZURhdGEgPSBcIlwiO1xyXG4gIGZ1bmN0aW9uIGxvYWRDdXJyZW50TG9jYXRpb24oKVxyXG4gICAgICB7XHJcbiAgICAgICAgaWYobmF2aWdhdG9yLmdlb2xvY2F0aW9uKXtcclxuICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XHJcbiAgXHJcbiAgICAgICAgICAgICAgICAvL0FkZCBhIHB1c2hwaW4gYXQgdGhlIHVzZXIncyBsb2NhdGlvbi5cclxuICAgICAgICAgICAgICAgIC8vIHZhciBwaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihsb2MpO1xyXG4gICAgICAgICAgICAgICAgLy8gbWFwLmVudGl0aWVzLnB1c2gocGluKTtcclxuICAgICAgICAgICAgICAgIC8vIC8vIENlbnRlciB0aGUgbWFwIG9uIHRoZSB1c2VyJ3MgbG9jYXRpb24uXHJcbiAgICAgICAgICAgICAgICAvLyAvLyBtYXBzLnNldFZpZXcoeyBjZW50ZXI6IGxvYywgem9vbTogMTUgfSk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TGF0aXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TG9uZ2l0dWRlID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGN1cnJlbnRMYXRpdHVkZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjdXJyZW50TG9uZ2l0dWRlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgZnVuY3Rpb24gcGluQ2xpY2tlZChwYXJtczogYW55LCBsYXVjaFRpY2tldENhcmQ6IG51bWJlcil7XHJcbiAgICAgIC8vY29uc29sZS5sb2coJ2VtaXQnLHRoYXQpO1xyXG4gICAgICB2YXIgc2VsZWN0ZWRUaWNrZXQgPSB7XCJTZWxlY3RlZFRpY2tldFwiOiB7XHJcbiAgICAgICAgICBcIlRpY2tldE51bWJlclwiOiBwYXJtcy50aWNrZXROdW1iZXIsXHJcbiAgICAgICAgICBcIkxhdW5jaFRpY2tldENhcmRcIjogbGF1Y2hUaWNrZXRDYXJkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCdTZWxlY3RlZCBUaWNrZXQ6ICcgKyBzZWxlY3RlZFRpY2tldCArJ2xhdW5jaFRpY2tldDogJysgbGF1Y2hUaWNrZXRDYXJkKTtcclxuICAgIHRoYXQudGlja2V0Q2xpY2suZW1pdChzZWxlY3RlZFRpY2tldCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNsb3NlKGUpIHtcclxuICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2ZhIGZhLXRpbWVzJykge1xyXG4gICAgICAkKCcuTmF2QmFyX0NvbnRhaW5lci5MaWdodCcpLmF0dHIoJ3N0eWxlJywndG9wOjBweCcpO1xyXG4gICAgICAvLyBpbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAvLyAgIHZpc2libGU6IGZhbHNlXHJcbiAgICAgIC8vIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBsb2FkVGlja2V0RGlyZWN0aW9ucyh0aGF0LCBpbmZvQm94TWV0YURhdGE6IGFueSxlbmRMYXQsIGVuZExvbmcpIHtcclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMnLCAoKSA9PiB7XHJcbiAgICAgIGRpck1hbmFnZXIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5EaXJlY3Rpb25zTWFuYWdlcihtYXApO1xyXG4gICAgICBkaXJNYW5hZ2VyLmNsZWFyQWxsKCk7XHJcbiAgICAgIG1hcC5sYXllcnMuY2xlYXIoKTtcclxuICAgICAgLy92YXIgbG9jYyA9IG1hcHMuZ2V0Q2VudGVyKCk7XHJcbiAgICAgIHZhciBsb2NjID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGN1cnJlbnRMYXRpdHVkZSwgY3VycmVudExvbmdpdHVkZSk7XHJcbiAgICAgIC8vIFNldCBSb3V0ZSBNb2RlIHRvIGRyaXZpbmdcclxuICAgICAgZGlyTWFuYWdlci5zZXRSZXF1ZXN0T3B0aW9ucyh7XHJcbiAgICAgICAgcm91dGVNb2RlOiBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLlJvdXRlTW9kZS5kcml2aW5nLFxyXG4gICAgICAgIHJvdXRlRHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICBkaXJNYW5hZ2VyLnNldFJlbmRlck9wdGlvbnMoe1xyXG4gICAgICAgIGRyaXZpbmdQb2x5bGluZU9wdGlvbnM6IHtcclxuICAgICAgICAgIHN0cm9rZUNvbG9yOiBNaWNyb3NvZnQuTWFwcy5Db2xvci5mcm9tSGV4KCcjMDA5ZmRiJyksXHJcbiAgICAgICAgICBzdHJva2VUaGlja25lc3M6IDVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpcnN0V2F5cG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiB0cnVlLCB0ZXh0OiAnJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRDBBQUFBOUNBWUFBQUFlWW1IcEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUFDWEJJV1hNQUFBQklBQUFBU0FCR3lXcytBQUFZMWtsRVFWUm8zcVdiYWF4bDJYWFhmMnZ0Yzg0ZDN2eGVEVDFQN25iYjdtN2IzYzVrNGhnTE1CL3lJYkVpRUVJSkVpQUhnUkFTZ2dCQklSOVE1RWdnaElRVlI5QUppYkNJRVFxS0ZER0lLU0dPb1JQU2RsdmRkTHVySjNmMVVGVmRWYStxM25TbmM4NWVpdzk3bjN2dnE4RmREVWU2OVc2OWQrODVlKzAxLzlkL2k3dHp1NWNacUtiM2J1QUtPQmlHdTJBT0JwaERkTWM4L1Q0aTRJNDdJTGU0dVlNSUlFTEFFWEZVbENDQ0NpaWdRdm85Q2dKaUlIcmoydDd2a3RzUjJqMnZWY0RNY0ZYY0RIUEIzREFVYzJnczRpaU5HNjA1clVNMFQ1dmg0SUNadTZpSU9RNk9pb2lidTZxSVpNRlVvRkFoNUorbEtJSlJha0FGQW9hSW91S0lLbUtHWm9tOTI3ei9INkVkd01BbHZYZXp0SGgzb2l2UmpjYWR4cUIxcDQ3UUF0UFd2REVuT3JTZDBPWVlqb2dzTk83ZzdpaUNhTkpxa1YrbENyMUNwUUNxQUtVSWhVSWxrcTNBVUJHU2dTaEJrOFpGYjIxUUFNWDdDZXg1OTAzU29pTWtRY3hwUFZJYnpGcW5ObWRxN3JNSVV6UHE2TFFHalRremd6b2FyVUdVdERCekEwQkZVQldDa3dRS1NrK2hERUlwMEF2bWxTcURBSldLOUFxaENsQkpuRzlNMHI1anBQZldhZlNEQ3QwSlRQYlA2RW03clNWdDFnYTFPWlBXbVVUM1NXdE1zOEJUZy8yNjVhaUJVZVBzTlpIRDJoakY5Sm5XSGZQMEJKRmt2bjJGbFZKWXF3S2JSVWp2UzJHakN2VFY2S3ZTSy9CaFZBWkJwQitFbmdwUm5US2srRkpZV3JNZ3VOeGE4T0pXQW5jTzRnZ0d0REdaY1cwd2FaMlpPYVBXZk53NG85YVltbk5VTzVlbUxWZHE0L3c0Y21YV3NqK0RHWlllM3Uya0xEOUZ3T094MVpXcWJKUndzbDl3MTBwZ3AxSk85QXJXSzJIVUdpc2grTENFUWFFeVZLR1BVTHJqR2lnMEJUM0p6bjJ6MkhtRFQvdGMzcVFOUTRudTFGbXdTWFJHamZ0UmF4eld4c1NjL1NaeWJ0UnliaFI1ZDl4d2VXcVlKTXR3RTZJYlNJcnUwc21lbnl2Wkp6czNFbmRVTlVkdklSaWNIQ3AzRHd2dVdTMjRjMUN3VlFZR0txeFd5bXFwckJRaWd5RDBnMmEzRUlUczd6bXF5YTJFdmw3ZzZCQmRtRVZuR28xUjY0eWkrMEZ0SE5TUm85WjRkOVR5M2FPR2Q0NWFkdXU0RUZTUzc3dWxlN2tJdU9EY1BIQUtBdUpKYUVsQkxRZ0VCMUVuaUxEVEM5eTdVdkNoMVpKN1ZncFdTMlc5REt5Vnltb2hNaXlFUVZDcUlBUnhnbkJUd1lzYkJLYkx0VUxyS1FDTlcrZW9OUTRiODRQR09HaWNLN09HVi9aYVhqOXF1RGlPUkVpQkt2dCtsNnZKdWR2ZEVlRjdDTDM0akpMQy9UeEhlNHJtbHliRzFXbk54VW5rUTdPU1I5ZEttajdVWnJTbUhsM0ZIVnlFbnVvOHpTb0xDNU5PYU8vc1B5L1drQlN3Y3FBNmFvMzkybnl2amh3Mnpqdmp5SXZYWnB3OWFqbHFuUmlOTm4vSFJMQm84N3pzblppK3ZMVnlrL2MrLzVVQTRrTEVrOUJCYWMwcEZLSTQ1OGJPWG0xY25VVWUzK3h4NzdCSTlVQjZuS0NhRXJZS2hhVENLQlUyU2NaamdjdzloZjAycGtBMWpzWlJZeHkwN3RmcTVNT3ZIVFk4ZjdYbTNMaWxObWdzRlNLUlZJaTRlMHB2dnJBZFI0N0xlYXU0S292TjZUNXFJbWhyU0U1Rk1hY21hNXd6ZXcxSGpWTnY5M2xvcmNERndNVmRUQ2lCWExrVm1tSkZaK2FGNTJCaXBGeHNCbzJub0RWcW5iMG0rdDRzcFoxWDltdStmWFhHcFVsazVrNXJRalNuN1VwUUE4ZUFIRFdGSkREZkkzOWMvd2RabUdIS2FrNTBSMXlUNjBrS0ZsSFRCcnd6YXFuamxOcExIbG1yVWlHRnVJcUlpaEZFYzR4STkxUVJDb0ZjSmladE5RYlRDT1BHT1d5aUh6Yk9RUk41L2FEaHVhczFseWVSbVVNZG5XaUxITzZkaVhaUk9xZUwyNi9zYjdJSk9RT29DTzVHZE1GY2NIR0NhNG9CT085TldwN2ROUVRodzJzUU5GQm85RUFRV2FvQXV6Uld1Q1VyaURHWlRXMldJN1hOby9SM2oxcStkWFhHcFVsTDQ4bWtvd3ZSak5ZbEd4eVlMSUtISDEvK1BCdTAxbTNTNHU5QklHalNnR1lUbkc5V3Qza2lxRnNxWTEwWDNVYnVOQzVOSXQvYW5WSUpoSkFpZnluaWhZb1VhcWdvaXFPRlVKaDJDbExhYUV5ak0yN2RENXNVcEM2TUl5OWRuWEZoMU5LWVUrTTBKbmhNRFlmVCtac3VGcnZrbDdYQkpCb2w4TEd0SGs5c1ZkdzlMTmpvQmR5TXZjWTVQMjU1NlZyRFMvczFqVVVHUVNtNytqa0xUZDVVeFZMZWQ4VmowcGhqdUFqbko4YnoxMnFHcFJKV0NpcDFTaFZLVlFweHlxQjRMbmVwYzRjMGEyRVduWEVUT1dxRmEzWGtPd2MxcngxRm9qc05Rb3lwMHpLWDFGS0tIby9EMmRUYlhBRC80TWtlZis2aE5UNXpxaStUMXZqV2xkcmZPS3c1ZTlnQXNGa0puejA5NEc5K2JFTUdRZmpHZTFQL04yZVBlSFozbHRLTDVxaVFoYmNjbktJYjZrbFJ1TktvSU9KODk3QmxxMWV6VmlyOVVOQ1A3cjFvVWlDb1J2b2VLTXpKL2dJellOTGlSMUU0YWxyZVBHdzVzOWRnYnFtTHlwRjZXZUJqZ2RkVE8xa0lmUHJrZ0wvKzBUVjJlc3EvZk8yUW4zbDIxOSs1VmpPUGExMy81NHZjZHU5V3haKzlmNVV2UGJYRjdzVDU4aXQ3ZlBQeURJUGNZeSswN3FLcGFYR2x0UlE4Z3dodGdCZjNhazcyQXNPZzlGWHBGK285UlNwUGpZN1UwWmxhWk5JNGh3MWNtYlYrZFJwNTQ2amhtVXNUM2ppSzFORm9vdE40Q2w0bVRtb0dqNmU3eG1HckV2N1dZOXM4dVYzeWoxL2E0MnV2SGdJa1g4cTU4bVpYdDJIV3BscjFKeDllNCs5L2ZKTS8ycTM1cHkvdXNkL1lEZDlQVWQ1UUY0S21qcXRLN1NnUHJSWjg1bFNmQjFaTGR2cUJuYXFRdFI0TWc2Sk9FcVF4bUpyNUpEcjdUU292M3hxMVdMYUNTQWNFM0ZqQ2UrNm5IOTJvK09jL2RKcm96cWYvMHptKzl1b2haU24wS3FYVVJUbDRzNmd1SXFsL3JwU3lFSDdqdFVNKzlSL09JZTU4NVlkTzhPSDFrc2JJM2RueFNPOTBGYUFreGJoeDlxamgzYkZ4MEZqcUJNMjhpYWxpMUdTeWtycW1hSXhiWTdjMlhqOXNsd0FBeWFWbHFxRTlWY3B6Z1djUlByWFQ0eDk5M3c3LzdxMGp2dmg3RjZtajA2djBXRFR1R2cweFI2TGgwWERMeVc0cDRxc2s0ZHZvL0tXdlgrVGZ2ejNtRjU3YzVxbWRIbzB0TlN1a09zQkY1cVd2dTlMa2N2aVYvUmxYYW1NY2pYRjBwakVwcDRndXRHWk1vL3UwZFk1aXludnZUZHUwZStZcFBYbG5Va3NDQTlQb2ZHeWo0dTgrc2NuVFovWjQranQ3bEwwd0Z6YkRZMGdkb1luUUdCSnpKWk1raEY3UklRaDRTTktuSUNab3BmeVRGNjl5MEJwLys3RU52dlRDSGkvdTFmVFVsem8wU2ZyT2FUR1lZeXE4TjQyOE4ybzQxUXVzRkVZZGtxeEY2d2tNbUZucXBBNW1rYmNPR3N5Z1pRRWVlTmNwTFYzUm5KMWU0Tzg4c2NsdnZ6dmg2VE1IbEZVNG5tdnJpSXdhWkZRbndXMEJZczN2NWpPOFVGZ3BZVmpCTU13M1YwVW9DdVhwVi9mWnFKUy84ZEVOZnU3YlY3azJpNVJMeTBsOXZ5TzVVU3JjaVNhOGVkVHk0SnF4WGlremMyL01SV1BHdGVxWXpIUy9OczVQMmxScG1jeXJ0ZU9sUmpLeDJwMHZmbmlEYytQSUwzMW5qeUlzK2EyUWhMMDhScTlPa0ZsTVh3eTZRUC9tTHhBelpIK0tYQjRoZTlNVVJEcHpSeWhVZVBxVkE4NVBXdjdpdyt2RXJJaWxvSUF2ZDNpV1RQN0N4Tmh2SXRQb3pMSjVhOEs2MGkvR3JYTnBGaGxIaUVqMkVjbWQwbkVVb2pGNFlyUGl5WjJTTDcrOHh6UmE2bVE2Z1k5cTVNb1luYmJKeERXNXlLUXhKclBJWk5xbVZ4MlRuK1lORVRQazJoUzlPbDRDR2xKN2VOUWF2L3JxQVk5dmxqeSttZng3NGR0ZFIrY0pkdllrdzdnMUxrNGowemJKMkxwVDVCYlNhL1AwZ1hHY1I4TjVlOWgxRDh2Qnk1dy8vOEFhLyszOG1GZjI2MFhySmlEVEJ0a2RKOS9WMU01Tkc2TlhDSC95b1hXZXZIUEl6ckJnMWhxdlg1bnh1MmNQT0gvUVVJVlVqdUtPSE0wUUJUOHhSSEl0TCs2YzJhLzUvWXNUL3N3REsvejh0MmVVdmtoanFZdE1hK2dzMUlFTFkrTWo2OFlzS3JXNUYrYXArVzhOWmdhN3N4YTNoWmwwcHIyczVlanc0RnJCd3hzbFh6NnpSMjJwSU9sQU9TNk41Z0tiTzIxMG5ycHJ5TTk5OWk2ZXVuTW9KMWRLaHFYUUdseWJ0Snpkci8xZmZmc3l2L2JjRlpwb2xDSDF3N0kvZzJHRkR3c2szWTVSNi96MzgyUCs0Wk03UExSVzh1Nm9YZkx0cFBPNXdqS2djR21TMnVDWVpTMWNFanJaZUdUV1J2WWJ4OFdKc2Z0UzV6c0xUVGZtL09DSlBtZjJhczZQMjBXWktNRCtGS2xURStEdW1NR243MXZscXoveG9EeTQxVDhXQ01zQXAxWkxUcTJXOHZIVEErNWRyL3dYdjNHQmFlTXBQcmpqbDBmd3dHYmFoQXdJdkR1T3ZIYlE4S21kSG1jUEcwcVZ1ZENwRGs4YWo1WjI2ckF4WnRGUzcrK2FmTnB5OTNQWXBQVGt1UlZMNFA2TkZWUmo4TW10aWhmMmFzWnQwa0NLT0lydVRSRk5HOUJFNTQ3VmtsLzd3Z00zQ0h6OTFTK1VuLzNzWGZLRmoyd1JRcklRSktVNm1iWnpTRGNJSE5UR3EvczFqMjJVYzc5ZXZ0d1duVm1VaEFRZDFEWWZPbWlxWVZNaFA0cVdZRjhUZkFrNHZyN2NMQlR1WFMxNTQ3QmxHbjN4OTFrRGRaeC9ybDhxUC9YSmJSN1pHWEM3MXk5Ky9oNVpxNVJveVVsRkJmWm54OUxjS0RwblI1RzdWd3I2aGQ1WXBjMExDY0VUUU1kUjlEeVpBWFd6UEc5S3RmVU5UZjkxaWphSEU0TkFjTGd3Ym1rN254ZVFIS2s3SUdHMVZIN3k0eWR1VzJDQWU5WXJQbkhISUFlbHBHMnRtMlByaUdic1RsdHc0VVF2cGFxYnJibXIyeHluOFl3T21hT0lvSm9taW0yVURQSGNHdkZ3WUNVSTAxempkdjRNSU0yeVJVQVpsTWRPRGQ1bm5IYmo5WDEzcmMwREk1Q2E4azZlL0t6V29BRUdoZHh5cmN2ZmFkdVlTdUE4RFBqQWtJNktwbEh0OFR1RHhia1pPaEQwL3cwc1d1MHRxZXVtQzB5OWM1cUgzZDZleHFXYmFPZkRrb2RnWFp5KzFhMEVHRFdSWGlFVUdVRG9BRHl2QWl3MUE2MEpSN1h4UWErejE1cFVVdWIvMjlMYzJUTXFVK1N1Yk5hOC8vM2RvUW9odXd5b3FCSlVVSVF5eUJ6ak90WlZMQXN0Y0sxTzFkZFdGVkRKZ3poSTlYUCt2QXFNRytPL3ZyNy9nZFg5djk0K1RJRXNQMStxWW5uQWhvcXdWaWtGd3JYR0Y5bGo4Wkg1V3BHMHRsSlNPWnVtcEo0RUNHS3NoQ1N0U0NvNnV6bmI4cXBGaEVscnZEZHVlV2k5b0srNndNVUc1Und6VW9GUkhmbjE1eTUvSUlGLzg2V3JmdjZ3bVZkNHVPT3IxZHlDSEJnRTVmNlZrc3ZUeUdGck4xcGxSeUxJd3dJa3hTSHBTdjNRelhkRldDMlY0STQ2U0xaemtlT0s2bHErRi9acUh0dW9HQlFwVWdNUUJGc3BNOUNZQXN6L2ZQdUlyL3p2UzdlbDdUZXVUdm5TMXk4d2JtSmFiTmUvcjVaMHl6Q0g5Vko0ZUxYa3pINTlVelJHWkRFcFZFL1E0WG9saExURVJOTW9SQ2dTbHNSYXBhbmtVK2FSV1VTT3FidFU0ZG5kR1IvZnFqalpEd3R3SURxK00waVJ3ZE1zNnJDTy9NTFh6L0hMejE3MEsrUDJwc0thTzMvd3pwSC85RytmOWU5Y25peUdidWI0V2krVmJuUVRHRGc5REh4a3MrU2JWK3FsYW94NTFkYjEyVUZUV2J4U2hUVFJsRFRtS1VKK1Uyb2FkVzcxQTlmcWlOcUM0R0x1eHdkZ0FpL3YxZXcxeHVkT0QzanpxSjEvaGw2SmIvU1JYSm1WcXV5T1cvN2VmM21YUDNocjVIL3E0WFVlMnVxeDNnczAwYmx3MVBETmN5UCs3WXRYZWYzS2xDSWt2OE1jTHdOc0QrZ1FqR1Rhd2g4NzJlZXdNYzdzMTVUSHlEVU9KTFJHOC9CUEJIWjZnVjRlNDRaTzZESkFGWVJCRUU3MWxUY1BPNEZ0eVQrV0FIcEpTTVZ2bmgzeHhVZlcrTS9uSjd3emFsTHphY0RXRUc4c0FRZFo4RG82Ly9yNVhYN3I1V3M4dE4xam94OW9XdWVkZzVvTDJZZXJzS1JoRmZ6a0VDOEV5YnlVNlBEZ1NzR1AzcjNDVjc5N21MZ3FTNGhzRWprQkNaclpTUWljNmluOWtFRERNaUNxaWJjaGxRajlBS2Q2Z1VwSXpKM3MwOGsvajd0bEZZUm5MazI0T0kzODlLUHJlWUNmWFNtM2hMWldnYWNOQ2lyMHl6UjlmUG55aEdmZVB1S2I1MGZzamx2NlJVSXdCU0FhWGlsK2FnVWZIdmZsUXVFdmZHaU5LN1BJSDE2ZVVvWGp1WHh1MnJJWStaWXEzRFVJOUJKbkpVRlFoU2JuTGtPcWJqWjdnVk9Ea0tHYUZPQTZ6UzRQSGpVakZWOTVlWi9QbmU3ekV3K3Mwa2JQODZXVXZueG5pTzMwb1ZTSWhuaDZWaFZTL09nVm1nSVJMRXg0clllZldNRlhsZ1ZPOFBDUDM3UEtqNXdhOFBTckthVXR3MUt5YklVaTg0QjF1aC9ZN0FVR1JacWFGQUlhSkJGV2VpcjBnckJSS3ZldFZ0bDMwdzNVTzhUcXVMWkxoYmVPR243cDVYMyt3U2UyK2ZUcEFYVmppd0luS0w3ZXcwNnRZRHREUEFlOU5MM1BUYnpuRGRyc1lYZXNwVURZTCtZQ3V6dE42L3pJNlFFLzgvZ212L0xhQVc4ZU5WUTNFT1hTWm1zT29FRUZRWGh3dFdLMVZIcXE5RUllOFNTQ21sS3BTVCtJcnhUS25RTmxweC9ZblVZS2Qxd1Y4emh2QUxvdEVFbjBwbTljbkxKK1pwOWYvK0ZUOHBlZnVlVFB2RHVtNnVsODE3MHFraW10VmNsZlk5ZmpTVko5VHFDdXh3RkRkNmVlR1orN2I0Vi85djBuK09VeisveitleE1xNVJpR0xobk1VbEdDYXFKZXFMQmRLWGNNbFpWQ3lHd2tTWmxLaENBeFVaYUNNU3pneEtEZzRiV1NLMU9qRUNkbTBzcUNSckhBeTFTRVFwMy8rTTZZY1l0LzdUT241RXYvNTVyL3lrdjdTSm40SC9OQlhCQUlrQWJtTjE3TDJiYU9qdGZHWDMxaWs1Lzl4TGI4L0xkMi9YKzhONzFoc2lsTHFVcEZVQ3hacU1PSDE5TjBZOWdKSFlSQ25FSXhxaURVQmtNWG1RVDF6Ukx1SFphODJhdTVPSVd5Q0ZnVGMxR1VaMGk1N2w0Vy9IY3ZqSGw3VlB1WHYvOGtQM2JmQ24vdG1WM2UzWnRCRmE0elIxbFc1N0hvVzF2NjUrNnRrbC85L0YzYzNRLzgxTzlkOUxOSFRhSkxYVC9LZFVOUlFsZVBoOFFrUE5VTDNMOWFzRmtxZzZEMGcwaFZLSldDcWlncVNoV2N2Z1JXQ21HbGdIdFdBaC9iNmxOS1NEZFVKUlNDaG81YllNY2VyaUpVQ204Y3R2em83NXpuNWIyRzUzN3NIdm5xbjdpTEozZDYxTFZSTjRsSldKdFJ4L3d5VDc5cmpMbzJuanJSNHpjK2Y1b1h2bkNmUEg5dHhwLytuZk84Tldvb2J5S3c1TG00QmljVVFnaE9LVW40SjdaNzNERXNXUW5Lc0JRR0twVHFpQ2pTUktQMXRKaHBGUFliNDlvcyt1NDBjbTdTOG9lWFozeG5yMDdrT1lUR25NWWNpd2E2bUV0MzV0bFZUWlBXMkNnTC9zcWphL3o0ZlN0aUR0KzRPUFhucnM1NGU5U3dWNmVsYjFiQ2ZTc2xUMjMzK09OMzlFV0EzM3ByNVAvaTFYME9hMmVsWE1TUDVUQ3FHRmdpNGFRWmRPS1BsUXFQYjFYOHdFNlB1MWNMVGxTQnJWNlE5VkxwcTlNdkJFbWdmaEprRnBsVHA2NU1FK1B2dTRlUlp5NVBPVDl1RWpXeU5Xb3lFeWtta3B4bkJzTDFjMnB6Wnh3ZGRlZmpPMzErNEVTUGo2eFgzTGtTV0M4RDRPdzN6b1Z4eTZzSE5YKzBPK1g1cXczbXpqQWt6dWpOZUVqcUtmMXBTTlRvQXFjcWttbmZNeXo0NFpOOUhsd043UFFMZG5xQnRWSmxwVkI2SVpYUUJlNkpTNjJKYWpnSVFtc2lxNVY2YllIN1Y1VlJhMHhpb2pCNWtXalAwUVNDWXRGUVdXN21zMFp5amwvTE1QRExlelV2WEp1bFVXKzJocVN4WkxaQkU4dDNFSmhYV1IyQzB4bjEvT2V5d09xVW1uTHdkaFg0NUhhUCsxWktWcXZVUUhVODBqSmo2Z29wZWtkUC9hWm95aVREb0VTUWFPN1JqVWZXU3labVBIZGx4bjZkS0E4Tm51aElRVE9yS1BmVlN4ajBjdGxhQmFodUErVllocXFXaGUxZ2FFVUpZV21qVktsVTJDeUZwN1pMUHJSYVpDS3RzbGFxRElMU3k2WmZkSlNxRklRU3NKZExVaXdrMkRSV0t0RVNvUGpZZW9XWjhNSzFLZGVheE9RUkhIV2hKYk1UNWl2T3dpOU5SbTRYU1ZnTTlYd0JEdWFuYWE2MFFxWlFscW1XWnF0U250enU4ZEhOaXMxZVlMMVMxZ3VWUVNIMHM3OTN6WWY0RWsyeVN6MUJvWEluSXF5Z2VJV1k0RzZCSjdiVFExNjRPbU4zbHNDSE5pYnVablNaVHhWaWxySmI5UFViY0dzMSt4elM2YjRqSWdRNkFDRG4yU0J6cnZlSm52S0o3UjZQcnBkc1Y4cG1wV3hVS2l1bEpvRnpiTkNsTEhtTU1kaTFwcUtDNVlkYUlTbENaOXJoNHhzOStrRjRhYS9tM0ZITExIYzFNUjlmY005ZFVXNVNMRU12MG9FQzE2dlVsLzQ3RjNSQlpCVTgxLzlPSWVsOXFkQlg0WjdWa3NmV1N4N2FLTmtvUXhJNGtXUHA1N0s2NnkyVzIrNENPbVpmeDhsTVFwZVd1b1BFTFhFUjNJTWFoU2dmRFJYclplQ1Zhc2JyQnpXSHJkRG1TaWhhWWhhNUNHYUpPdTBaZDVyelJIUDA3L3g5eml0Y1l1eXFlSXJlZWJpZ3FoU2U2b1gxU25oa3ZlVFJqUjUzRFJJTGVLT1NGS1dETXBoWFg3bGg4aVVaNVRyejdqWkF1eFlMaDN4b1JBaVNDRzd1aWRDU0huUkhQL0RHWWN1Ym95YlJIa2d0WURRbjVvbWxpV2FhaFdTYXhSSVMwNTNCNkRTc0FtNlpBZXlKQ0VjNm4xR0o4TUJheWNOckpmZXRGbXhWS1dpdGxjcGFLVExvQkM2VU10ZmZ5OGRGYm1yZW5kQmsvNllqNWhVWmZqR2xFSk5DMUN0MWVscXdYZ2luaHdVUFRFcmVPcXg1NjhpWnhKYXk2TGdxaWFoam9obnpTaHp3ZVhQaGpxaGtURTdtSE8wZ2llaU93NkJRN2w5UkhsZ3R1WE5ZY3FxbkRJdE1jaThrazl3elVKRFBmaVEvN2dxYjYyUzgxV21kWldKTU9uNlVDeGh6cG0wcU9zYU4reWdUNEk5U0pjZVYybmxuTk9QOHhOaWRHRzMyWTg5SEk5em55YTB6OUtVcFNlcVVCS2ZRTkxLNWV4aTRkOWhqdXlkczl3UERRbGtKaWN3K0xFV0dRUmdVTXFkVExTSzEzQksvLzU1SGxEb2czMG56STh0Y3NjWmdaczZzell6L1ROS1pSbWRxenY3TU9Jek80U3h5dFlsY21yVHMxODRvSnY1NGE4ZUxrMEtURUtzbGJKU0Jrd05scHl4WXJZVDFNZ1duS2dzM0NNSXdhRHE0a2dOV2tjR0JJcC9iNnJSN3k0SEYreDVHODVURHpWSVlTa2NjOGl6Sm5Ub2FNNE5aYTB3aVBvM0dMRUtOVTdkcEV4WjhqL1JxOC9mSi9wOFduSUNNS3FRMnNLOUpxQktoRjZBZmxFR0I5TElaZDdWMkY1MkRrQTZtZVo1VmZZL3NlRnNuOEN3SG1rUmVOeXlDa3c2aXRabjNYVnZ1bUpKZ1B2TTBuNjR0MFpqU3diVE1DblNmajRLN0F5cGRwSzFVQ0twVTZnbnB5QmhlVHpzVFZncE5uVlRJUVZaREl2U0d2TmIzTzMxNFcwSWZVM3crWSttNUVERWd4a2dVSlZxa2JnV1RoVFliaTdTbXRPNGVNMkU5Y1ZrV1B0MWhjU0dqR29Xa0k0YWRGYWdMVmVFRURRUTNRZ2pwWEVaWFpjMVowSXZqaDkvcityOWMzd0x0N0lQSU9BQUFBQ1YwUlZoMFpHRjBaVHBqY21WaGRHVUFNakF4T0MweE1DMHlOVlF5TWpvME16b3dOaTB3TlRvd01GQ3prQ29BQUFBbGRFVllkR1JoZEdVNmJXOWthV1o1QURJd01UZ3RNVEF0TWpWVU1qSTZORE02TURZdE1EVTZNREFoN2lpV0FBQUFBRWxGVGtTdVFtQ0MnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgbGFzdFdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogdHJ1ZSwgdGV4dDogJycsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEMEFBQUEwQ0FZQUFBQTViVEFoQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBaDlTVVJCVkdpQnhacHJiRnpGRmNkLzU5NnM0L1Y2dlU1c0VsTzJJWEdhaDIzeXNKMUVFTkh5VUIra2xINkJ2cUJxb2EzVWg1RGFTa1dJaWxKVXFTSWlxb0w2VUlWYXBMWWkxT1VoRUxTZ3BoVW9rSVpFSkNZeDhTT0pZMXlKQkNleDExNTcxMnZ2N3AzVEQ3dHIxc0hHOTNydnF2OHZPM3Z2ekgvTy84N01tVE1Qb1l6bzI3QWhQR1ZabjFlUm00R3RpS3hCTlpKL1BRNE1vSHBDNGRWMEp2UHl0ZjM5NCtXMHB3QXBCMm5YcGsyTmpqRVBvUG8xSU9TeTJLUkNoNG84MHQ3ZDNWOE91d3J3VmZTaGFEUVlqRVFlUnZYSFFHQ1JORm5nTVNjWS9QbTJZOGNtZlRSdkJyNkovdWY2OVJzclJQNVZhOXRSWHdoRlRvbnE3VnQ3ZXJwOTRTdUM1UU5INFBiYTJvY3FSVTc2SmhoQWRZUEN3YzZORzYvempUT1BVbHY2NDgzQjRFdS9YN1ZxUzQxdCsyTFFoeUFTdHgzbms1djcrdDd4aTdLVWxyNjF4cmE3SG8xR3l5Y1lRRFhpV05iZnUxdGFsdnRGdVZqUnR3SXZQTkRRVUh0VllMSCt5aE5XcFZVZjk0dHNNYUszQXgwN1FxRWx0MFFpQzJiMkVYZDBOamZ2OG9QSXErZzY0RVdnK2tjclYvcFJ2eWVJNm03MVljWlo0akgvSHFCaFd5aEVVMldscDRJOXFSVFBqNDF4SXBVaTZUaEViSnR0b1JCZlhyYU1hRVdGT3hLUnpTZXV1ZVl6bkR5NTM2UGRzK0JGOUViZ0d3QmY5TkN0TTZyc0dScmkyZEZSdE9qNStVeUczcWtwL2hxTDhZTXJydUNlK25wWGZPbzRkd01saWZiU3ZlOEZiQXU0cWFiR2RhR09XR3pmTTZPanR5bnNBcjRIdkF3ZjZNK3E4dXVMRi9uajhMQTdRcEhianJhM2wrUTkzWTRQRzdnQTFEVlZWdkpVWTZOYi9tZGJlM3ErTk1mekc0QU9vS0h3d0FJNkdodFo1MkxZcURFNzIvcjYzblJyeE9WdzI5THQ1SndZVGNHZ2EzS2orcXQ1WGgwQWJnRlNNM21CcDJJeFY3d2kwdXJhaURuZ1Z2Uk1KVkgzODNLeXJiZjN5RWU4UHdIc0xYNXdPSmwweS8wSnR4bm5nbHZSYXdxSmlQdm9hMWlZNWJ2bXdwK0svOFN5V1hmTWxsWG4xb2c1aTd2TUZ5NGtsbHF1ZmQrVnI2MWV2ZEFBN1FkbWxvK3VweTVWOTJOc0RyaFZNTlB2RW83amxydWlOaGk4WllFOFM0R1pEM05qT1B3UldUK0FpSlMwdytKVzlLVkNZdHk5YUJCNTZPbWM1NThQTnhkc0NOczJkeTEzdDZZd3hyaWMzK2FHVzlHbkNvbHptWXdYL3RaMUxTMi9tU2QwRk9BQmdBb1JkbDkxRmN1WHVJdVZMSkYzdlJqeG9mSXU4eDBpNzVSNnBxYTgxYUQ2L2VQTnpjOTNOalZkWGZSVWdOM0E5ZXNxSzNsaTlXcDJWbGU3cGpTV2RjeWJFYlBoSlhqdkFqYlpJaHpjc0lGSzl3NnRnTFRDYStjeW1YY1BURXg4S20xTTg5YXFLclpXVlhsZFFVeFhwOU9SZGYzOTAxNE5LTUJMN1AwMHNNbFI1VWd5eVEwdW5VNFJLZ1ErRncwRVhJL2RlZkJxS1lMQlcremRRYjZMdjU1SWxGSm5TVkRWbDBybDhDSzZuL3pxNXNERUJJNHVGSGVVQVNLTzVUZ3Zsa3JqZFdEdUJSakpaam40LzJodDFmMWJUNTgrVnlxTlY5SDdnVTZBRjhiR1NxM2JNMVRrQ1Q5NHZJcFc0RUdBTnhJSjN2YzJaNWNHa1hOTG9lVHhESXZiR0h3Rk9PQ284dVRJaUI4MnVJS3E3bTNwN2s3N3diWFlMZUI3Z2V3TFkyUEV2WVNsaThkWU9wMytnMTlraTkybHZ3aXN6S2p1V0NMQ2pwRGJnOG5GUVVVZTJYN3FWRW43WXNVbzVZVGpwOEIvOThWaWpMaGRCeThPSStucDZjZjhKQ3hGOURqd3JaUXgrb1RiVGIxRlFPRVJ2dy9yU3oyMWZCWDQzZE9qbzV6eHVoQnhoelBoZFBxM2ZwUDZjVlI3djZONmV2ZlEwSUo3UTE2aDhNTlM0K3k1NElmb1NlRHV6c25KelA1eC8zcWh3SE50UFQyditFWllCRDlFQTd3SjNMOW5hSWlrTWFXemlhVFVtSitVVGpRMy9EeFlQcHd5cHRsUmJibld3NGJBWEJEVlg3VDI5Wlc4c0pnUGZyVjBBZC9lRjR2MXZwTktMWnh6Zmh3UFdOYWpmaGswRi93V25jaXEzdkh3K2ZPSjZjVXRQYWVOWlgzVHIzQnpQcFRqM3NTbFVjZnBUS3ZlZVYxMXRhZWRJQlg1V1h0MzkzTmxzR2tXeW5WWjVHeFBLalhXRmdydCtwakxZeUNCdzJkNmVyN3p6TUtuSWlXamJEZGtEQndaU0tjYlAxdFRzNlZDRm16d0NWUjNmWHE0aktGZEVWeDN2MFBSYURCWVhiMVM0VXF4ckJVQ2RZaEVWRFdDU0NSLzU3TWFRS0ZTSUdoQS9qdzh2T09lK3ZxUDNrVlVQU2VXTlpSTGFncVl5dk9rSko4R0VvakVVWTJqT2lZaWNZV1lHbk1Sa2ZQeFZPckNUWU9EcnNMQ1dhS1B0cmNISkpuY2JOdDJ1NnF1UTJRdHFvM0ExVUJ0VWRZRUlwZFFqUmNNRVpHNHFxWVFjZFNZY1FBUmNhWWdlWGhpNHI0YncrSGk4a1VXeUg4RS9xS3FOU0ppNTRYWHFLb05JSlpWZzZvdElzRlpIemozZTBYaFErY3hCZ3lxNm9DSURJaklHVEhtYUthcTZwMXR4NDdON0hqSW9XZzBXRlZUODFYZ0xvWHJ5WjB2RFFLOXFBNklaUTFnekx0cTJ4ZXNUT2I5WkRJNXRQTzk5enpOU2JlRncvVVBScU92VjRnMFhmYXEyd2tHZDVSeUIvUlFOQm9NaFVJTkpoQzRVaHhuSlphMVJvMXBGSkcxbXJzeXNocVlCdDVBWk45WU10a2h4NXViLzYyd0JkVy9xY2cvVERiNzFyYlRwMzBmVzI5djNMZ2F5M29MS0Z3dW1WQ1JhOXU2dTN2OHJxc1lSOWV2cjdlV0xOa3VJbDlBOVN2QTI1Ym14dUs0V3RZRlcvVUM0WEM4SEpXMzl2VU5hdTRxZEJZd1lsbDNsbHN3QU9GdzNJSWh6VjBmaVFNUjZkcTBhVm5XbU8rSzZ0ZUJscnpqT0s3UUo2cG5qV1dkeFhFR2pXMmZTOGZqbDd4MjdjdnhkbFBUZlVCRmEyL3ZMMzJRQkVCM1M4dnl0REYxcWxvdnRyMUdqR2xVa2JWQWs4QVd6UjBIbnhTUkp6VVFlSHlXSXp1eGVmTUtrOGxzVjh0cUU5WDFlVWUyRmxoUmxHMENlQjhZblhGa01Fck9teWFzM1BqQnFFNWFJdE1BcXBvRTBnQUtDVkhOYW1FK0ZnbEkzaGtKTEVXa0tsKyswaExKSGI2clZnRWhoVHFGT29IbEFuVXFVb2RxSGJNanl3dW9ua1ZrUUZSUEtYUmFnY0RSTFYxZEZ3c1pYRTFaUjl2YnF3S0p4RXBIcENFL1hUVVlrV1VZVTR0SXJaV2J1bXFBQ2lBaUlsWmViS1RJb05xaStwYmxmNVdjeDRYY1hadkMwSElLQisrcW1nVW1FSmtXaUNtTWlERWpCa1pFWkZoRWhoMlJFVHVkSHBtY25JeTU2WW4vQThGSVMyMDVPU0tlQUFBQUFFbEZUa1N1UW1DQydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgdmlhcG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgd2F5cG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiBmYWxzZSB9LFxyXG4gICAgICAgIGF1dG9VcGRhdGVNYXBWaWV3OiB0cnVlLFxyXG4gICAgICAgIGRpc3BsYXlSb3V0ZVNlbGVjdG9yOiBmYWxzZVxyXG4gICAgICAgIC8vaXRpbmVyYXJ5Q29udGFpbmVyOiAnI2RpcmVjdGlvbnNJdGluZXJhcnknXHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgLy9kaXJNYW5hZ2VyLnNob3dJbnB1dFBhbmVsKCdkaXJlY3Rpb25zUGFuZWwnKTtcclxuXHJcbiAgICAgIGNvbnN0IHdheXBvaW50MSA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLldheXBvaW50KHtcclxuICAgICAgICBsb2NhdGlvbjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGxvY2MubGF0aXR1ZGUsIGxvY2MubG9uZ2l0dWRlKVxyXG4gICAgICB9KTtcclxuICBcclxuICAgICAgY29uc3Qgd2F5cG9pbnQyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuV2F5cG9pbnQoe1xyXG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZW5kTGF0LCBlbmRMb25nKSwgXHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICBkaXJNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50MSk7XHJcbiAgICAgIGRpck1hbmFnZXIuYWRkV2F5cG9pbnQod2F5cG9pbnQyKTtcclxuXHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKGRpck1hbmFnZXIsICdkaXJlY3Rpb25zVXBkYXRlZCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy90aGF0LnBhdGhMYXllci5jbGVhcigpOyBcclxuICAgICAgdmFyIGFsbFdheVBvaW50cyA9IGRpck1hbmFnZXIuZ2V0QWxsV2F5cG9pbnRzKCk7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgZnJvbUFkZHJlc3MgPSBhbGxXYXlQb2ludHNbMF0uZ2V0QWRkcmVzcygpO1xyXG4gICAgICB2YXIgdG9BZGRyZXNzID0gYWxsV2F5UG9pbnRzWzFdLmdldEFkZHJlc3MoKTtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IHJvdXRlSW5kZXggPSBlLnJvdXRlWzBdLnJvdXRlTGVnc1swXS5vcmlnaW5hbFJvdXRlSW5kZXg7XHJcbiAgICAgIGNvbnN0IG5leHRMb2NhdGlvbiA9IGUucm91dGVbMF0ucm91dGVQYXRoW3JvdXRlSW5kZXggKyAxXTtcclxuXHJcbiAgICAgIC8vIEdldCB0aGUgY3VycmVudCByb3V0ZSBpbmRleC5cclxuICAgICAgY29uc3Qgcm91dGVJZHggPSBkaXJNYW5hZ2VyLmdldFJlcXVlc3RPcHRpb25zKCkucm91dGVJbmRleDtcclxuICAgICAgLy8gR2V0IHRoZSBkaXN0YW5jZSBvZiB0aGUgcm91dGUsIHJvdW5kZWQgdG8gMiBkZWNpbWFsIHBsYWNlcy5cclxuICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnJvdW5kKGUucm91dGVTdW1tYXJ5W3JvdXRlSWR4XS5kaXN0YW5jZSAqIDEwMCkgLyAxMDA7XHJcbiAgICAgIC8vIEdldCB0aGUgZGlzdGFuY2UgdW5pdHMgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHJvdXRlLlxyXG4gICAgICBjb25zdCB1bml0cyA9IGRpck1hbmFnZXIuZ2V0UmVxdWVzdE9wdGlvbnMoKS5kaXN0YW5jZVVuaXQ7XHJcbiAgICAgIGxldCBkaXN0YW5jZVVuaXRzID0gJyc7XHJcblxyXG4gICAgICBpZiAodW5pdHMgPT09IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuRGlzdGFuY2VVbml0LmttKSB7XHJcbiAgICAgICAgZGlzdGFuY2VVbml0cyA9ICdrbSc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gTXVzdCBiZSBpbiBtaWxlc1xyXG4gICAgICAgIGRpc3RhbmNlVW5pdHMgPSAnbWlsZXMnO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBjb25zb2xlLmxvZygnbGFzdCBab29tIExldmVsJyttYXBab29tTGV2ZWwpO1xyXG4gICAgICAvLyBUaW1lIGlzIGluIHNlY29uZHMsIGNvbnZlcnQgdG8gbWludXRlcyBhbmQgcm91bmQgb2ZmLlxyXG4gICAgICBjb25zdCB0aW1lID0gTWF0aC5yb3VuZChlLnJvdXRlU3VtbWFyeVtyb3V0ZUlkeF0udGltZVdpdGhUcmFmZmljIC8gNjApO1xyXG4gICAgICBkaXN0YW5jZURhdGEgPSBcIjxsYWJlbCBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsgZm9udC1zaXplOjI0cHg7Jz5cIisgZGlzdGFuY2UgKyAnJm5ic3A7JyArIGRpc3RhbmNlVW5pdHMgKyBcIiwgPC9sYWJlbD5UcmFmZmljOiBcIiArIHRpbWUgKyBcIiBtaW51dGVzXCI7XHJcbiAgICAgIC8vIC8vIGluZm9ib3guc2V0TWFwKG1hcCk7ICBcclxuICAgICAgLy8gaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgLy8gICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZW5kTGF0LCBlbmRMb25nKSxcclxuICAgICAgLy8gICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgIC8vICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCA0MCksXHJcbiAgICAgIC8vICAgICBodG1sQ29udGVudDonPGRpdiBzdHlsZT1cIm1hcmdpbjphdXRvICFpbXBvcnRhbnQ7d2lkdGg6NTUwcHggIWltcG9ydGFudDtiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtib3JkZXI6IDFweCBzb2xpZCBsaWdodGdyYXk7XCI+J1xyXG4gICAgICAvLyAgICAgKyBnZXRUaWNrZXRJbmZvQm94SFRNTChpbmZvQm94TWV0YURhdGEsIGRpc3RhbmNlRGF0YSwgZnJvbUFkZHJlc3MsIHRvQWRkcmVzcykgKyAnPC9kaXY+J1xyXG4gICAgICAvLyAgIH0pO1xyXG4gICAgICAkKFwiLm1vZGFsLWNvbnRlbnRcIikuaHRtbChnZXRUaWNrZXRNb2RhbEhUTUwoaW5mb0JveE1ldGFEYXRhLCBkaXN0YW5jZURhdGEsIGZyb21BZGRyZXNzLCB0b0FkZHJlc3MpKTtcclxuICAgICAgalF1ZXJ5KFwiI3RpY2tldG1vZGFsXCIpLm1vZGFsKHtcclxuICAgICAgIC8vIGJhY2tkcm9wOiAnc3RhdGljJyxcclxuICAgICAgICBrZXlib2FyZDogZmFsc2VcclxuICAgICB9KTtcclxuICAgICAgdmFyIHhmbGFnOiBudW1iZXI9MDtcclxuICAgICAgJChcIiNtb3JlRm9ybUNvbnRlbnRCdG5cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnY2FsbGVkIGNsaWNrJyk7XHJcbiAgICAgICAgaWYoeGZsYWcgPT0gMCkge1xyXG4gICAgICAgICAgJChcIiNpbml0Rm9ybUNvbnRlbnRcIikuaGlkZSgpO1xyXG4gICAgICAgICAgJChcIiNtb3JlRm9ybUNvbnRlbnRcIikuc2xpZGVUb2dnbGUoIFwic2xvd1wiKTtcclxuICAgICAgICAgICQoXCIjZHVtbXlpbWFnZVwiKS5hdHRyKFwic3JjXCIsXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJnQUFBQVlDQVlBQUFEZ2R6MzRBQUFBR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBQXlKcFZGaDBXRTFNT21OdmJTNWhaRzlpWlM1NGJYQUFBQUFBQUR3L2VIQmhZMnRsZENCaVpXZHBiajBpNzd1L0lpQnBaRDBpVnpWTk1FMXdRMlZvYVVoNmNtVlRlazVVWTNwcll6bGtJajgrSUR4NE9uaHRjRzFsZEdFZ2VHMXNibk02ZUQwaVlXUnZZbVU2Ym5NNmJXVjBZUzhpSUhnNmVHMXdkR3M5SWtGa2IySmxJRmhOVUNCRGIzSmxJRFV1TUMxak1EWXhJRFkwTGpFME1EazBPU3dnTWpBeE1DOHhNaTh3TnkweE1EbzFOem93TVNBZ0lDQWdJQ0FnSWo0Z1BISmtaanBTUkVZZ2VHMXNibk02Y21SbVBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHhPVGs1THpBeUx6SXlMWEprWmkxemVXNTBZWGd0Ym5NaklqNGdQSEprWmpwRVpYTmpjbWx3ZEdsdmJpQnlaR1k2WVdKdmRYUTlJaUlnZUcxc2JuTTZlRzF3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzaGhjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUlNaV1k5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVkpsWmlNaUlIaHRjRHBEY21WaGRHOXlWRzl2YkQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVOVE5TNHhJRmRwYm1SdmQzTWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVGhHT1RZNU9USkVRek5CTVRGRk9Ea3dNakE0TTBReE1qRTNNMFl5TlRraUlIaHRjRTFOT2tSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9UaEdPVFk1T1RORVF6TkJNVEZGT0Rrd01qQTRNMFF4TWpFM00wWXlOVGtpUGlBOGVHMXdUVTA2UkdWeWFYWmxaRVp5YjIwZ2MzUlNaV1k2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNU9FWTVOams1TUVSRE0wRXhNVVU0T1RBeU1EZ3pSREV5TVRjelJqSTFPU0lnYzNSU1pXWTZaRzlqZFcxbGJuUkpSRDBpZUcxd0xtUnBaRG81T0VZNU5qazVNVVJETTBFeE1VVTRPVEF5TURnelJERXlNVGN6UmpJMU9TSXZQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QdjNSSHdnQUFBRjdTVVJCVkhqYXZKWkJad05CRk1jbkZjMG5LR0VvT1lXbGhIeUpzQ3c5NVdQc0taUjhraUhYc1BUUVMzcHBKZCtnbEZKS0xpVTk5ZExxS1lUcG0vb1B6NWpkblVtbmZmeVduWjM1LzNmZTdNemJqbWdPU1Z3U09YRkdqTkQrU0x3VHQ4U04xdnBOUkVhZlVNU0IwQzBjMExkUFJzTEZGeFBpaXdsVXhKUVlFMTB3Umx2Ritwa3hremFEa2cyNEpyS0EyV2JvYThlVmRRWUZTOGs4TkpkTWFNNVNWcmdHWmpFLzBFSEZMSmJ6dGdvYVJrdHlBOFh5TFk0MWdLQmRGMlVOemxscXNnUUdHVXVWMFJaWGFGaUtJNkxtMDF4QzAyaUxOVzV5a1NCZ2tFUHp6bnpUUTdZN2VWd1FweEhhbjhUVzBmcEorUjV1UFdmQWE4QXU1cXpZREhwbzIzY2IzdWdKNTAxb2JPc2U3T0FtRTY2QmhPYnVoQzR2ZURaSzhSVTVXcy9HNEI0M1U1RXVyTmJHWEFaL3VORUcvM0pVMkVXeE5XRDJpOE51eG1xRDlCM1hPdGJFSTY1OXg3V3Y0RlJzbHpmRjBLbHNaVnZKTEJwS3BvMjZrbG1FMUdTN0pvdUlvcit3T1hmcFJQNjIyRms4aFA2MmZBc3dBSmVlWmFBbldTdWZBQUFBQUVsRlRrU3VRbUNDXCIpO1xyXG4gICAgICAgICAgICB4ZmxhZyA9IDE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmKHhmbGFnID09IDEpIHtcclxuICAgICAgICAgICAgJChcIiNtb3JlRm9ybUNvbnRlbnRcIikuaGlkZSgpO1xyXG4gICAgICAgICAgICAkKFwiI2luaXRGb3JtQ29udGVudFwiKS5zbGlkZVRvZ2dsZSggXCJzbG93XCIpO1xyXG4gICAgICAgICAgICAkKFwiI2R1bW15aW1hZ2VcIikuYXR0cihcInNyY1wiLFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCZ0FBQUFZQ0FZQUFBRGdkejM0QUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUF5SnBWRmgwV0UxTU9tTnZiUzVoWkc5aVpTNTRiWEFBQUFBQUFEdy9lSEJoWTJ0bGRDQmlaV2RwYmowaTc3dS9JaUJwWkQwaVZ6Vk5NRTF3UTJWb2FVaDZjbVZUZWs1VVkzcHJZemxrSWo4K0lEeDRPbmh0Y0cxbGRHRWdlRzFzYm5NNmVEMGlZV1J2WW1VNmJuTTZiV1YwWVM4aUlIZzZlRzF3ZEdzOUlrRmtiMkpsSUZoTlVDQkRiM0psSURVdU1DMWpNRFl4SURZMExqRTBNRGswT1N3Z01qQXhNQzh4TWk4d055MHhNRG8xTnpvd01TQWdJQ0FnSUNBZ0lqNGdQSEprWmpwU1JFWWdlRzFzYm5NNmNtUm1QU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh4T1RrNUx6QXlMekl5TFhKa1ppMXplVzUwWVhndGJuTWpJajRnUEhKa1pqcEVaWE5qY21sd2RHbHZiaUJ5WkdZNllXSnZkWFE5SWlJZ2VHMXNibk02ZUcxd1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JTWldZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlZKbFppTWlJSGh0Y0RwRGNtVmhkRzl5Vkc5dmJEMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTlROUzR4SUZkcGJtUnZkM01pSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RJMFJqVkZOalpFUXpOQk1URkZPRUZFTVRJNFFVTXpPRE5EUkVSR1FrTWlJSGh0Y0UxTk9rUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPVEkwUmpWRk5qZEVRek5CTVRGRk9FRkVNVEk0UVVNek9ETkRSRVJHUWtNaVBpQThlRzF3VFUwNlJHVnlhWFpsWkVaeWIyMGdjM1JTWldZNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzVNalJHTlVVMk5FUkRNMEV4TVVVNFFVUXhNamhCUXpNNE0wTkVSRVpDUXlJZ2MzUlNaV1k2Wkc5amRXMWxiblJKUkQwaWVHMXdMbVJwWkRvNU1qUkdOVVUyTlVSRE0wRXhNVVU0UVVReE1qaEJRek00TTBORVJFWkNReUl2UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUGxoT3N1WUFBQUd4U1VSQlZIamF0SmJCU3NOQUVJWVRMZm9FaFVJZzBGTWhJQlI2OVNRSUJTSGdxZEFIRUR6bDVLbmdZd2lCOWxvQ0hyem9TZkFOQkVFSUNJV2kxSk1YeFZPaEVQK1ZHUmpYVGJLSmNlQkwwMlQzLzdPejJaMjRUbkY0NEJnY2dUYm8wL1VIOEFadXdGV1daYTlPeGVpQUdHeEFWc0tHMm5aZzVPaVlZZ2craFVBQ1JtQUFXc1NBcmlXaW5lb3pMRE9JUklkTEVGaU1OcUMyM0MvS013aEZTaWEydVJSQ0U1R3lVRGRRay9sT0RlSUN2WDF3SWtlbVBXMU1Ha3JMa3dheHlIZFJYRkM3VTVNQkNmSzh4R3pnaTlRRURSZ0VJbFgrRmc1anNBM21JSFgrR0RCSlNVdHBqcFhCSWQyYjF4RjBYZmNIbXRhQmVxZDdZblhLMkFNNzJyVTIvZnEwRm1SOGdJV205WjN5TmVWc1YrdndiTEdLSmRjOEo2U2xUdGF0Z3RFLzBuNGp3NmRSdkJqdUxmS0VWdVRtV2FUODExdGtXbmlrcFU1V2FwS2Y2RjYvNWx0ajJudFlLMVVHdC9SbjVEUVhySFduRHQxL1hHaGROWUlsbUZINzh3YWVualZtTUZ6S3pZNXJ3Rm5kT2FDK1hCczgwM2FkVlRVeGlHZW03ZHBVY0JLeHlvdWlwMVcycUt4a2hnVWxreU92WklZMk5abm5aRnFoNkU4NTV6cHV4YzhXSHNXOTdXZkxsd0FEQUVlRFVxMkRWWThNQUFBQUFFbEZUa1N1UW1DQ1wiKTtcclxuICAgICAgICAgICAgeGZsYWcgPSAwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgJChcIi5jbG9zZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgIGRpck1hbmFnZXIuY2xlYXJBbGwoKTtcclxuICAgICAgICBtYXAubGF5ZXJzLmNsZWFyKCk7XHJcbiAgICAgICAgbWFwLnNldFZpZXcoe2NlbnRlcjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGVuZExhdCwgZW5kTG9uZyksIG1hcFpvb21MZXZlbH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgJChcIiN0aWNrZXRtb2RhbFwiKS5vbihcImhpZGRlbi5icy5tb2RhbFwiLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZGlyTWFuYWdlci5jbGVhckFsbCgpO1xyXG4gICAgICAgIG1hcC5sYXllcnMuY2xlYXIoKTtcclxuICAgICAgICBtYXAuc2V0Vmlldyh7Y2VudGVyOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZW5kTGF0LCBlbmRMb25nKSwgbWFwWm9vbUxldmVsfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKFwiI3RrdElkXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcGluQ2xpY2tlZChpbmZvQm94TWV0YURhdGEsIDEpO1xyXG4gICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRpck1hbmFnZXIuY2FsY3VsYXRlRGlyZWN0aW9ucygpO1xyXG4gICAgICBcclxuICAgIH0pO1xyXG4gICAgfVxyXG4gICBcclxuICAgIGZ1bmN0aW9uIGdldFRpY2tldE1vZGFsSFRNTChkYXRhOiBhbnksIGRpc3RhbmNkRGF0YTogYW55LCBmcm9tQWRkcmVzczogYW55LCB0b0FkZHJlc3M6IGFueSk6U3RyaW5ne1xyXG4gICAgICBjb25zb2xlLmxvZyhkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgIHZhciB3b3JrU2V2ZXJpdHlDb2xvcjogYW55ID0gXCIjY2YyYTJhXCI7XHJcbiAgICAgICAgaWYoZGF0YS50aWNrZXRTZXZlcml0eS50b0xvd2VyQ2FzZSgpID09PSBcIm1ham9yXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgd29ya1NldmVyaXR5Q29sb3IgPSBcIiMwMDlmZGJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkgPT09IFwibWlub3JcIiB8fCBkYXRhLnRpY2tldFNldmVyaXR5LnRvTG93ZXJDYXNlKCkgPT09IFwid2FybmluZ1wiIHx8IGRhdGEudGlja2V0U2V2ZXJpdHkudG9Mb3dlckNhc2UoKSA9PT0gXCJ1bmtub3duXCIpe1xyXG4gICAgICAgICAgd29ya1NldmVyaXR5Q29sb3IgPSBcIiMxOTE5MTlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRpYWxvZ0RhdGEgPSBcIjxkaXYgc3R5bGU9J2Rpc3BsYXk6IGZsZXg7IHBhZGRpbmc6NXB4O2p1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczogZmxleC1zdGFydDsnPlwiXHJcbiAgICAgICAgK1wiPGg1IGlkPSd0a3RJZCc+PGEgaHJlZj0namF2YXNjcmlwdDp2b2lkKDApOycgc3R5bGU9J3RleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyBjb2xvcjojMDAwOyBmb250LXNpemU6MTVweDsnPlwiKyBkYXRhLnRpY2tldE51bWJlciArXCI8L2E+PC9oNT5cIlxyXG4gICAgICAgICtcIjxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzcz0nY2xvc2UnIGRhdGEtZGlzbWlzcz0nbW9kYWwnIHRpdGxlPSdDbG9zZSc+JnRpbWVzOzwvYnV0dG9uPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2ICBzdHlsZT0nbWF4LWhlaWdodDozOTBweDsgb3ZlcmZsb3cteTphdXRvOyBvdmVyZmxvdy14OmhpZGRlbjsgZm9udC1zaXplOjE0cHg7IHBhZGRpbmc6NXB4OyB3aWR0aDozNzBweDsnPlwiXHRcdFx0XHQvL2NsYXNzPSdtb2RhbC1ib2R5J1x0XHJcblx0XHRcdFx0K1wiPGZvcm0gY2xhc3M9J3RrdEZvcm0nPlwiXHJcbiAgICAgICAgK1wiPGRpdiBpZD0naW5pdEZvcm1Db250ZW50JyBzdHlsZT0nZGlzcGxheTogYmxvY2s7Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxMzBweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5TZXZlcml0eTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjI0MHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCcgc3R5bGU9Y29sb3I6XCIrd29ya1NldmVyaXR5Q29sb3IrXCI+XCIrIGRhdGEudGlja2V0U2V2ZXJpdHkgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTMwcHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+Q29tbW9uIElEOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjQwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiK2RhdGEuY29tbW9uSUQrXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxMzBweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5BZmZlY3Rpbmc6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyNDBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuY3VzdEFmZmVjdGluZyArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxMzBweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5TaG9ydCBEZXNjcmlwdDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjI0MHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuc2hvcnREZXNjcmlwdGlvbiArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEnIHN0eWxlPSd3aWR0aDozMHB4Oyc+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS0xMCcgc3R5bGU9J2JvcmRlci10b3A6MXB4IHNvbGlkICNkYmRiZGI7Jz5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS0xJyBzdHlsZT0nd2lkdGg6MzBweDsnPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEyJyBzdHlsZT0nd2lkdGg6MzUwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGlzdGFuY2REYXRhICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS0xJyBzdHlsZT0nd2lkdGg6MzBweDsnPlwiXHJcbiAgICAgICAgK1wiPGltZyBzcmM9J2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQnNBQUFBWUNBWUFBQUFMUUliN0FBQUFBWE5TUjBJQXJzNGM2UUFBQUFSblFVMUJBQUN4and2OFlRVUFBQUFKY0VoWmN3QUFEc01BQUE3REFjZHZxR1FBQUFOUlNVUkJWRWhMdlpWTFNGUlJHTWVOaXFLMnRZd1d0Vy9ScHFpZ0NDSkNpQlpGVUZuTGFGRXRhcEVTR0JpVlJSU0NDR1V2Tlcxc0xOTlNrMTRxdlN3ZEg0MlBlVHVQYS9OK09DL3Z6UHo3M3hpdE85NFp4d2gvY09CeTdqMzNmODczUDkvM0ZXQVJXWkRZZEN5QmNFVEVWSGdhU0NUVHMva3pyNWc5RU1kSFd4alZXajlLZTEyNCtNV0prczlPWE81ejQvNVlBTjhjWVFTNGdYeklLcGJpTUhwanVOUHJSRkd6QlJ0ckRWajZVSTlWTlFhczVsanlRSSsxTlhxY2Vqa0J0ZFlMaXorT2xMUW9CMW5GbWtmOU9Qak1qQzMxQmx6ckVmQmFGOENRS3daN1dNVFBhSUxQVVR3Wjh1SnNteFZySHVseG9NTU8zV1FrdlZvWlJiRm5GRHI1MG9xaUZ4WlVEM294eWg5SDZGY21mZ3IzTVl5WEdOYWRQUDIrTmh2RytHMHFxWHhFdVJpL01URjBoN253R0lXZS92QkJGT2UvQ0JHS2x0SExEZlZHWFB2MEV4TU1xUkl5TVNFWXgxMTZ0STJocTlKNGtCRG5NZUV2Ykw0WUtpaTBpVDQrMXdmVHMzSmtZcjJPQ0k0K3Q2RDBuUU1EUXU3NEs2R2haNXZyRENpbnFOMDM5M1F5c1NaakNPdTVzNFpoNzI4L0ZvcWJLWENtMDQ2TGJ4M29NczA5blV5c1V1dmpsZGFoeHg2bWYvbUhjSWFwZUJMMUdqZEtLS2dhOXFWbi96QXJGb21LdVBMZGhaVzh4dm9nSzhRL0VKNU9vcFU1ZDZIVGh0cEJUM3IyRDdOaUluZDFvOStERlV6Y0FYY3NQYnN3cEpNMURYbHd2c09LUndNNXhDU3FSdnhZY204Y25lWVFVbmxjK1V5Q3pNV2JQWk1vZm0xREszTTFFNWxZeThRVTF2RTIzZnJxaEQxTHJ1UmlJakNOL2J6TlpWMENmZ2owUFFPWm1KVFE1ZDBDQ2h0TmFNbVNLOWtRNlZlN01ZaGx2R0MzV1hXU0NwR1JpWW1KRkRRc1A5c2JqRGpOVUdqNW5DOXRGTnJYWk1ZaFZwNnZXZGJKeENSQ05Qa0trM0tYMm9RakhUYjBNUTJVZGpsRGxENDFzMGdmZTJYRmJtNnlmY3lQa0VJZGxaZ2pKaUd3OUp4NEwyRDlZd1BPUzJZYmdoaG5SZkF3MFFPcytINE9GNTlIUFRHb1Jud29aSGZZb3pLaWdsN0hjbXhNVVV6Q3cyNnNacEx2Vlptdy9MNE9XOVZtWEtmeGRmMXVQUGptUXZFYkIzYndYUUhmSFdlYmVhOFBJRTRiY3BXQ3JHSVNRWjZnbHpXeWtnbDY5ZU1reWxneno3VmJmeWR0S1V2U0RZYTdabHpxYzJ4QkRQOTg1QlNiSVVZUGpQemhCOWE3UnJZZHFiRjJtNE13ZTZMcEwvSWpMN0gveFNLS0FiOEE5TUtYQU9nRTQyZ0FBQUFBU1VWT1JLNUNZSUk9JyAvPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tMTAnIHN0eWxlPSdib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZGJkYmRiOyB3aWR0aDozMDBweCc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGZyb21BZGRyZXNzICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tMScgc3R5bGU9J3dpZHRoOjMwcHg7Jz5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHRcclxuICAgICAgICArXCI8L2Rpdj5cIlx0XHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIiA8ZGl2IGNsYXNzPSdjb2wtc20tMScgc3R5bGU9J3dpZHRoOjMwcHg7Jz5cIlxyXG4gICAgICAgICtcIjxpbWcgc3JjPSdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJrQUFBQWFDQVlBQUFCQ2ZmZk5BQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFBSmNFaFpjd0FBRHNNQUFBN0RBY2R2cUdRQUFBTmZTVVJCVkVoTHpaWGRTMU54R01mN2V5THJ3Z3lNYmdJaFVldkNpS0M2elFnVVJmUkN3N0FYS25xakVvdUlVQ3pxSWxBVU13akJoQzRxckwyMjl2N1czTTdjZEp1Yk8zczUyN2ZuOXp1blUzdmZ1cEErTURhZTM5bnZlMzYvNS9zOHp4N3NBditIU0Y2U2tFdWxJTzNzUUVva0lNWGovSGN1blVZK2wxT2VxazVWa1R4OUVrNG5oUGw1dU8vZmgrdkdEVGl2WFlQM3lST0VscGVSWEYrWEg2eEJXUkcyK2JaV0MvZllHQ3dYTHNEUzN3L0g5ZXR3UDNvRTE3MTdzSTJQdzl6YkM4dTVjL0JOVENCaHNjaC9yRUNKU0M2YlJXUjFGYzdSVVJpT0g0ZTFwd2MvYWZQUSsvZUlmdjJLeUpjdkNMS1QzYndKODhtVE1KNDZCVGNKYzZFOGU3MVNDa1R5SkJEOTlnM21zMmVoTzNJRTY2OWVJUk9KS0t1bGlINC9YRmV2d2tCaXRwRVJwQVJCV1Nta1FFVDBlR0RxNm9McHpCa0lzN004d2RWZ2ljOXViOE0vUFExOWR6ZGN0Mi96UFlwUlJUTFJLSUp2MzBMZjNnN2Y1Q1N5TlFUK0p1bDJ3ME5YcGo5NkZPSEZSU1g2QjFVa1lUVENPamdJR3lVN2JqQW8wZnFKNi9YUXRiYnkvS1UyTnBTb2pDcXlSVytnMmJzWFFicW1UQ3ltUk9zbkV3N0RPandNQnhraTh2bXpFcFhoSXN3VHdSY3ZvTm0zRHpGeVQzbVBWSWNWcVc5bWh0OUVjRzVPaWNwd2tXd3lDZi9UcDlBZU9BRFI0ZUFMalNMUkhodnYzc0YrK1RLRTE2K1ZxQXdYa2FodEJKNDlnM2IvZm9oMk8xOW9GT1pFWVdFQmRpcFU0YzBiSlNxajVpUk11ZEEwTldGclpRVVM5YVZHeVpJN1BROGZ3a1luQ1MwdEtWRVpWU1Q2NFFOMHg0N0JTeWNTZlQ0bFdqL3BRSURYbC92dVhjU0wyb3dxa3FSY09La0JtazZmeG1iUm05UkNFa1dFS0IvYXc0Y2h2SHpKci85dlZCRjJSZEcxTmVqcFFmZWxTMGlXcWR4S1JENStoR1ZnZ0w5ZzdOTW5KZm9IVllTUkk0ZXc0K283T21DbnpwdmUzRlJXS2hPaklyYjE5VUYzNkJBMnFiRXlseFZUSU1JUWFVYTRidDJDdHEwTlp1cEhmcXFmdU0yR0hBMnYzMlRJU2RzbUUveFVGOTlQbk1BUE9nR3pMZXRqNVNnUlljUnBnNThQSHNCTWlmeHg4U0ljMVBaOWQrNGcrUHc1QW84ZncwT3p4VDQwQkF0OXJPZlBRNWlhUW9hbVppWEtpakJZMWNlb2h6bXZYSUd4c3hQNmd3ZWhhMjZHcnFXRmY1c294aVprZ2d4VHEwTlVGR0h3K1U3T1lUVWdlcjJJYVRTOGVhYkk0amsyNThsRjljejVxaUxGc0tuSmhCdWxJWkYvWlJkRWdGODMybjRzaHY3TW9RQUFBQUJKUlU1RXJrSmdnZz09JyAvPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS0xMCcgc3R5bGU9J3dpZHRoOjMwMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIHRvQWRkcmVzcyArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCIgPGRpdiBjbGFzcz0nY29sLXNtLTEnIHN0eWxlPSd3aWR0aDozMHB4Oyc+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlx0XHJcbiAgICAgICAgK1wiPC9kaXY+XCJcdFxyXG4gICAgICAgICtcIjwvZGl2PlwiXHQvL2VuZCBpbml0Zm9ybVx0XHRcdFx0XHRcclxuICAgICAgICArXCI8ZGl2IGlkPSdtb3JlRm9ybUNvbnRlbnQnIHN0eWxlPSdkaXNwbGF5OiBub25lOyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiIDxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5FbnRyeSBUeXBlOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmVudHJ5VHlwZSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5TdGF0dXM6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEudGlja2V0U3RhdHVzICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkN1c3RvbWVyIEFmZmVjdGluZzo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuY3VzdEFmZmVjdGluZyArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5Bc3NpZ25lZTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuYXNzaWduZWRUbyArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5Db21tb24gSUQ6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiICsgZGF0YS5jb21tb25JRCArIFwiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+RXF1aXBtZW50IElEOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcclxuICAgICAgICArXCIgPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5lcXVpcG1lbnRJRCArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5FcXVpcG1lbnQgTmFtZTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIiArIGRhdGEuZXF1aXBtZW50TmFtZSArIFwiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+UGFyZW50IElEOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnBhcmVudElEICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlBhcmVudCBOYW1lOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnBhcmVudE5hbWUgK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTQnIHN0eWxlPSd3aWR0aDoxNjBweDsgZm9udC1zaXplOjEycHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+UHJvYmxlbSBDYXRlZ29yeTo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiIDxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEucHJvYmxlbUNhdGVnb3J5ICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlByb2JsZW0gU3ViIENhdGVnb3J5OjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLnByb2JsZW1TdWJjYXRlZ29yeSArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5Qcm9ibGVtIERldGFpbDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEucHJvYmxlbURldGFpbCArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5TaG9ydCBEZXNjcmlwdDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5zaG9ydERlc2NyaXB0aW9uICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkxvY2F0aW9uIFJhbmtpbmc6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHRcdFx0XHRcdFx0XHRcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPlwiKyBkYXRhLmxvY2F0aW9uUmFua2luZyArXCI8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG5cdFx0XHRcdCtcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tNCcgc3R5bGU9J3dpZHRoOjE2MHB4OyBmb250LXNpemU6MTJweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5QbGFubmVkIFJlc3RvcmFsIFRpbWU6PC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLXNtLTgnIHN0eWxlPSd3aWR0aDoyMTBweDsnPlwiXHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5wbGFubmVkUmVzdG9yYWxUaW1lICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkFsdGVybmF0ZSBTaXRlIElEOjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS04JyBzdHlsZT0nd2lkdGg6MjEwcHg7Jz5cIlxyXG4gICAgICAgICtcIjxsYWJlbCBjbGFzcz0nY29udHJvbC1sYWJlbCc+XCIrIGRhdGEuYWx0ZXJuYXRlU2l0ZUlEICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPldvcmsgUmVxdWVzdCBJRDo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS53b3JrUmVxdWVzdElkICtcIjwvbGFiZWw+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0ncm93Jz5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1zbS00JyBzdHlsZT0nd2lkdGg6MTYwcHg7IGZvbnQtc2l6ZToxMnB4Oyc+XCJcclxuICAgICAgICArXCI8bGFiZWwgY2xhc3M9J2NvbnRyb2wtbGFiZWwnPkFjdGl2aXR5IEFjdGlvbjo8L2xhYmVsPlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdjb2wtc20tOCcgc3R5bGU9J3dpZHRoOjIxMHB4Oyc+XCJcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgK1wiPGxhYmVsIGNsYXNzPSdjb250cm9sLWxhYmVsJz5cIisgZGF0YS5hY3Rpb24gK1wiPC9sYWJlbD5cIlxyXG4gICAgICAgICtcIjwvZGl2PlwiXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8L2Rpdj5cIlx0XHRcdFxyXG4gICAgICAgICtcIjwvZm9ybT5cIlxyXG5cdFx0XHRcdCtcIjwvZGl2PlwiXHJcblx0XHRcdFx0K1wiPGRpdiBzdHlsZT0nZGlzcGxheTogZmxleDsganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDsgcGFkZGluZy1yaWdodDogNXB4OyBwYWRkaW5nLWJvdHRvbTogNXB4Oyc+XCJcclxuICAgICAgICArXCI8YnV0dG9uIGlkPSdtb3JlRm9ybUNvbnRlbnRCdG4nIHN0eWxlPSdiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O2JvcmRlcjowO2N1cnNvcjpwb2ludGVyOyc+IDxpbWcgaWQ9J2R1bW15aW1hZ2UnICBzcmM9J2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQmdBQUFBWUNBWUFBQURnZHozNEFBQUFHWFJGV0hSVGIyWjBkMkZ5WlFCQlpHOWlaU0JKYldGblpWSmxZV1I1Y2NsbFBBQUFBeUpwVkZoMFdFMU1PbU52YlM1aFpHOWlaUzU0YlhBQUFBQUFBRHcvZUhCaFkydGxkQ0JpWldkcGJqMGk3N3UvSWlCcFpEMGlWelZOTUUxd1EyVm9hVWg2Y21WVGVrNVVZM3ByWXpsa0lqOCtJRHg0T25odGNHMWxkR0VnZUcxc2JuTTZlRDBpWVdSdlltVTZibk02YldWMFlTOGlJSGc2ZUcxd2RHczlJa0ZrYjJKbElGaE5VQ0JEYjNKbElEVXVNQzFqTURZeElEWTBMakUwTURrME9Td2dNakF4TUM4eE1pOHdOeTB4TURvMU56b3dNU0FnSUNBZ0lDQWdJajRnUEhKa1pqcFNSRVlnZUcxc2JuTTZjbVJtUFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eE9UazVMekF5THpJeUxYSmtaaTF6ZVc1MFlYZ3Ribk1qSWo0Z1BISmtaanBFWlhOamNtbHdkR2x2YmlCeVpHWTZZV0p2ZFhROUlpSWdlRzFzYm5NNmVHMXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNoaGNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSU1pXWTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpWSmxaaU1pSUhodGNEcERjbVZoZEc5eVZHOXZiRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5UTlM0eElGZHBibVJ2ZDNNaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9USTBSalZGTmpaRVF6TkJNVEZGT0VGRU1USTRRVU16T0RORFJFUkdRa01pSUhodGNFMU5Pa1J2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T1RJMFJqVkZOamRFUXpOQk1URkZPRUZFTVRJNFFVTXpPRE5EUkVSR1FrTWlQaUE4ZUcxd1RVMDZSR1Z5YVhabFpFWnliMjBnYzNSU1pXWTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG81TWpSR05VVTJORVJETTBFeE1VVTRRVVF4TWpoQlF6TTRNME5FUkVaQ1F5SWdjM1JTWldZNlpHOWpkVzFsYm5SSlJEMGllRzF3TG1ScFpEbzVNalJHTlVVMk5VUkRNMEV4TVVVNFFVUXhNamhCUXpNNE0wTkVSRVpDUXlJdlBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BsaE9zdVlBQUFHeFNVUkJWSGphdEpiQlNzTkFFSVlUTGZvRWhVSWcwRk1oSUJSNjlTUUlCU0hncWRBSEVEemw1S25nWXdpQjlsb0NIcnpvU2ZBTkJFRUlDSVdpMUpNWHhWT2hFUCtWR1JqWFRiS0pjZUJMMDJUMy83T3oyWjI0VG5GNDRCZ2NnVGJvMC9VSDhBWnV3RldXWmE5T3hlaUFHR3hBVnNLRzJuWmc1T2lZWWdnK2hVQUNSbUFBV3NTQXJpV2luZW96TERPSVJJZExFRmlNTnFDMjNDL0tNd2hGU2lhMnVSUkNFNUd5VURkUWsvbE9EZUlDdlgxd0lrZW1QVzFNR2tyTGt3YXh5SGRSWEZDN1U1TUJDZks4eEd6Z2k5UUVEUmdFSWxYK0ZnNWpzQTNtSUhYK0dEQkpTVXRwanBYQklkMmIxeEYwWGZjSG10YUJlcWQ3WW5YSzJBTTcyclUyL2ZxMEZtUjhnSVdtOVozeU5lVnNWK3Z3YkxHS0pkYzhKNlNsVHRhdGd0RS8wbjRqdzZkUnZCanVMZktFVnVUbVdhVDgxMXRrV25pa3BVNVdhcEtmNkY2LzVsdGoybnRZSzFVR3QvUm41RFFYckhXbkR0MS9YR2hkTllJbG1GSDc4d2FlbmpWbU1Gekt6WTVyd0ZuZE9hQytYQnM4MDNhZFZUVXhpR2VtN2RwVWNCS3h5b3VpcDFXMnFLeGtoZ1Vsa3lPdlpJWTJOWm5uWkZxaDZFODU1enB1eGM4V0hzVzk3V2ZMbHdBREFFZURVcTJEVlk4TUFBQUFBRWxGVGtTdVFtQ0MnLz4gPC9idXR0b24+XCJcclxuXHRcdFx0XHQrXCI8L2Rpdj5cIlxyXG4gICAgICByZXR1cm4gZGlhbG9nRGF0YTtcclxuICAgIH1cclxuICBcclxuICAgICAgICBmdW5jdGlvbiBnZXRUaWNrZXRJbmZvQm94SFRNTChkYXRhOiBhbnksIGRpc3RhbmNkRGF0YTogYW55LCBmcm9tQWRkcmVzczogYW55LCB0b0FkZHJlc3M6IGFueSk6U3RyaW5ne1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICB2YXIgaW5mb2JveERhdGEgPSBcIjxkaXYgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7Jz48ZGl2IHN0eWxlPSdwb3NpdGlvbjogcmVsYXRpdmU7d2lkdGg6MTAwJTsnPlwiXHJcbiAgICAgICAgK1wiPGRpdj48YSBocmVmPSdqYXZhc2NyaXB0OnZvaWQoMCknIHN0eWxlPSd0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSc+XCIrZGF0YS50aWNrZXROdW1iZXIrXCIgPC9hPiA8aSBjbGFzcz0nZmEgZmEtdGltZXMnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPjwvaT48L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5TZXZlcml0eTo8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0nY29sLW1kLTgnIHN0eWxlPSdjb2xvcjpyZWQ7Jz5cIitkYXRhLnRpY2tldFNldmVyaXR5K1wiPC9kaXY+XCIgXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5Db21tb24gSUQ6PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC04Jz5cIitkYXRhLmNvbW1vbklEK1wiPC9kaXY+XCIgXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5BZmZlY3Rpbmc6PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC04Jz5cIitkYXRhLmN1c3RBZmZlY3RpbmcrXCI8L2Rpdj5cIiBcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTQnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweCcgPjxzcGFuPlNob3J0RGVzY3JpcHQ6PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC04Jz5cIitkYXRhLnNob3J0RGVzY3JpcHRpb24rXCI8L2Rpdj5cIiBcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTEyJyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48aHIgLz48L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTExJyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5cIisgZGlzdGFuY2VEYXRhICArXCI8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC0xMScgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+XCIrIGZyb21BZGRyZXNzICArXCI8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC0xMScgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4JyA+PHNwYW4+XCIrIHRvQWRkcmVzcyAgK1wiPC9zcGFuPjwvZGl2PlwiXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgcmV0dXJuIGluZm9ib3hEYXRhO1xyXG4gICAgICAgIH1cclxufVxyXG5cclxuICBVcGRhdGVUaWNrZXRKU09ORGF0YUxpc3QoKVxyXG4gIHtcclxuICAgIGlmKHRoaXMudGlja2V0TGlzdC5sZW5ndGggIT0wKVxyXG4gICAge1xyXG4gICAgdGhpcy50aWNrZXRMaXN0LlRpY2tldEluZm9MaXN0LlRpY2tldEluZm8uZm9yRWFjaCh0aWNrZXRJbmZvID0+IHtcclxuICAgICAgdmFyIHRpY2tldDogVGlja2V0ID0gbmV3IFRpY2tldCgpOztcclxuICAgICAgdGlja2V0SW5mby5GaWVsZFR1cGxlTGlzdC5GaWVsZFR1cGxlLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgaWYoZWxlbWVudC5OYW1lID09PSBcIlRpY2tldE51bWJlclwiKXtcclxuICAgICAgICAgICAgdGlja2V0LnRpY2tldE51bWJlciA9IGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkVudHJ5VHlwZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5lbnRyeVR5cGUgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDcmVhdGVEYXRlXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmNyZWF0ZURhdGUgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFcXVpcG1lbnRJRFwiKXtcclxuICAgICAgICAgIHRpY2tldC5lcXVpcG1lbnRJRCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkNvbW1vbklEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmNvbW1vbklEID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUGFyZW50SURcIil7XHJcbiAgICAgICAgICB0aWNrZXQucGFyZW50SUQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDdXN0QWZmZWN0aW5nXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmN1c3RBZmZlY3RpbmcgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJUaWNrZXRTZXZlcml0eVwiKXtcclxuICAgICAgICAgIHRpY2tldC50aWNrZXRTZXZlcml0eSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFzc2lnbmVkVG9cIil7XHJcbiAgICAgICAgICB0aWNrZXQuYXNzaWduZWRUbyA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlN1Ym1pdHRlZEJ5XCIpe1xyXG4gICAgICAgICAgdGlja2V0LnN1Ym1pdHRlZEJ5ID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUHJvYmxlbVN1YmNhdGVnb3J5XCIpe1xyXG4gICAgICAgICAgdGlja2V0LnByb2JsZW1TdWJjYXRlZ29yeSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlByb2JsZW1EZXRhaWxcIil7XHJcbiAgICAgICAgICB0aWNrZXQucHJvYmxlbURldGFpbCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlByb2JsZW1DYXRlZ29yeVwiKXtcclxuICAgICAgICAgIHRpY2tldC5wcm9ibGVtQ2F0ZWdvcnkgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMYXRpdHVkZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5sYXRpdHVkZSA9IChlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgfHwgZWxlbWVudC5WYWx1ZSA9PT0gJycpICA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkxvbmdpdHVkZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5sb25naXR1ZGUgPSAgKGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBlbGVtZW50LlZhbHVlID09PSAnJykgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQbGFubmVkUmVzdG9yYWxUaW1lXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnBsYW5uZWRSZXN0b3JhbFRpbWUgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBbHRlcm5hdGVTaXRlSURcIil7XHJcbiAgICAgICAgICB0aWNrZXQuYWx0ZXJuYXRlU2l0ZUlEID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTG9jYXRpb25SYW5raW5nXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmxvY2F0aW9uUmFua2luZyA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFzc2lnbmVkRGVwYXJ0bWVudFwiKXtcclxuICAgICAgICAgIHRpY2tldC5hc3NpZ25lZERlcGFydG1lbnQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJSZWdpb25cIil7XHJcbiAgICAgICAgICB0aWNrZXQucmVnaW9uID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTWFya2V0XCIpe1xyXG4gICAgICAgICAgdGlja2V0Lm1hcmtldCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIldvcmtSZXF1ZXN0SWRcIil7XHJcbiAgICAgICAgICB0aWNrZXQud29ya1JlcXVlc3RJZCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlNoaWZ0TG9nXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnNoaWZ0TG9nID0gZWxlbWVudC5WYWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQWN0aW9uXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmFjdGlvbiA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkVxdWlwbWVudE5hbWVcIil7XHJcbiAgICAgICAgICB0aWNrZXQuZXF1aXBtZW50TmFtZSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlNob3J0RGVzY3JpcHRpb25cIil7XHJcbiAgICAgICAgICB0aWNrZXQuc2hvcnREZXNjcmlwdGlvbiA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlBhcmVudE5hbWVcIil7XHJcbiAgICAgICAgICB0aWNrZXQucGFyZW50TmFtZSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlRpY2tldFN0YXR1c1wiKXtcclxuICAgICAgICAgIHRpY2tldC50aWNrZXRTdGF0dXMgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMb2NhdGlvbklEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmxvY2F0aW9uSUQgPSBlbGVtZW50LlZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJPcHNEaXN0cmljdFwiKXtcclxuICAgICAgICAgIHRpY2tldC5vcHNEaXN0cmljdCA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIk9wc1pvbmVcIil7XHJcbiAgICAgICAgICB0aWNrZXQub3BzWm9uZSA9IGVsZW1lbnQuVmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy50aWNrZXREYXRhLnB1c2godGlja2V0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuY29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIl19