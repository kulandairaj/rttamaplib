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
            map.entities.push(pushpin);
            _this.dataLayer.push(pushpin);
            Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked);
            map.setView({ mapTypeId: Microsoft.Maps.MapTypeId.road, center: new Microsoft.Maps.Location(data.latitude, data.longitude) });
            initIndex = initIndex + 1;
        });
        $('.NavBar_Container.Light').attr('style', '480px');
        /** @type {?} */
        var infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
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
                infobox.setMap(map);
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
                ;
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
                    template: "  \n  <div id='myMap' class='mapclass' #mapElement>\n  </div>\n  ",
                    styles: ["\n  .mapclass{\n    height: calc(100vh - 4em - 70px) !important;    \n    display:block;\n  },\n  .infyMappopup{\n\t\tmargin:auto !important;\n    width:300px !important;\n    background-color: white;\n    border: 1px solid lightgray; \n  },\n  .popModalContainer{\n    padding:15px;\n  }\n  .popModalHeader{\n    position: relative;\n    width:100%;\n  }\n  .popModalHeader a{\n    display: inline-block;\n    padding:5px 10px;\n    background-color: #ffc107;\n    border-color: #ffc107;\n    position: absolute;\n    right:10px;\n    top:5px;\n  }\n  .popModalHeader .fa{\n    position: absolute;\n    top:-10px;\n    right:-10px;\n  \n  }\n  .popModalBody label{\n    font-weight: bold;\n    line-height: normal;\n  }\n  .popModalBody span{\n    display: inline-block;\n    line-height: normal;\n    word-break:\u00A0break-word;\n  }\n  .meterCal strong{\n    font-weight: bolder;\n    font-size: 23px;\n  }\n  .meterCal span{\n    display: block;\n  }\n  .popModalFooter .col{\n    text-align: center;\n  }\n  .popModalFooter .fa{\n    padding:0 5px;\n  }\n  "]
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9ydHRhbWFwbGliLyIsInNvdXJjZXMiOlsibGliL3J0dGFtYXBsaWIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBVSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFdkgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFHekQsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQU9wRixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFaEMsT0FBTyxLQUFLLGNBQWMsTUFBTSxpQkFBaUIsQ0FBQztBQVNsRCxtQkFBQyxNQUFhLEVBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztJQXVKOUIsNkJBQW9CLFVBQTZCOzs7SUFHL0MsQUFGQSwwQkFBMEI7SUFDMUIsZ0NBQWdDO0lBQ2hDLElBQXNCO1FBSEosZUFBVSxHQUFWLFVBQVUsQ0FBbUI7MEJBMUVwQyxFQUFFO3lCQUtILEVBQUU7dUJBR0osTUFBTTt1QkFDTixLQUFLO3FCQUVQLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO3FCQUNoQyxLQUFLO3NCQUtDLElBQUk7dUJBRVIsRUFDVDs2QkFFZSxFQUFFOzBDQUVXLEVBQUU7b0NBQ1IsRUFBRTtnQ0FDTixDQUFDOzRCQUNMLEVBQUU7NkJBQ0QsRUFBRTs0QkFDSCxFQUFFO29CQUNGLFdBQVc7NkJBQ1YsS0FBSztvQkFDZCxLQUFLOzZCQUNJLEVBQUU7OzJCQUVKLGdHQUFnRzs7MEJBR2pHLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVB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eUJBQUssSUFBRyxPQUFPLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBQzt3QkFDdEMsTUFBTSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUNuRTt5QkFBSyxJQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFDO3dCQUNsQyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQy9EO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM5QixDQUFDLENBQUM7U0FDSjtLQUNBOzs7O0lBRUQseUNBQVc7OztJQUFYO1FBQ0UsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUNqQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQy9CO0tBQ0Y7O2dCQTNxREYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFFBQVEsRUFBRSxtRUFHVDs2QkFDUSx5aUNBdURSO2lCQUNGOzs7O2dCQXpGUSxpQkFBaUI7Z0JBRmpCLGdCQUFnQjs7OzRCQStHdEIsU0FBUyxTQUFDLFlBQVk7K0JBTXRCLFNBQVMsU0FBQyxNQUFNOzZCQW9EaEIsS0FBSzsrQkFDTCxLQUFLOzhCQUNMLE1BQU07OzhCQTNLVDs7U0E0RmEsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVmlld0NvbnRhaW5lclJlZiwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkluaXQsIFZpZXdDaGlsZCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuLy8gaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgUnR0YW1hcGxpYlNlcnZpY2UgfSBmcm9tICcuL3J0dGFtYXBsaWIuc2VydmljZSc7XHJcbmltcG9ydCB7IE5ndWlBdXRvQ29tcGxldGVNb2R1bGUgfSBmcm9tICdAbmd1aS9hdXRvLWNvbXBsZXRlL2Rpc3QnO1xyXG4vLyBpbXBvcnQgeyBQb3B1cCB9IGZyb20gJ25nMi1vcGQtcG9wdXAnO1xyXG5pbXBvcnQgeyBUcnVja0RldGFpbHMsIFRydWNrRGlyZWN0aW9uRGV0YWlscywgVGlja2V0IH0gZnJvbSAnLi9tb2RlbHMvdHJ1Y2tkZXRhaWxzJztcclxuaW1wb3J0ICogYXMgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IGZhaWwsIHRocm93cyB9IGZyb20gJ2Fzc2VydCc7XHJcbi8vIGltcG9ydCB7IFRvYXN0LCBUb2FzdHNNYW5hZ2VyIH0gZnJvbSAnbmcyLXRvYXN0ci9uZzItdG9hc3RyJztcclxuaW1wb3J0IHsgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZS9zcmMvbWV0YWRhdGEvbGlmZWN5Y2xlX2hvb2tzJztcclxuaW1wb3J0IHsgVHJ5Q2F0Y2hTdG10IH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXIvc3JjL291dHB1dC9vdXRwdXRfYXN0JztcclxuaW1wb3J0IHsgQW5ndWxhck11bHRpU2VsZWN0TW9kdWxlIH0gZnJvbSAnYW5ndWxhcjItbXVsdGlzZWxlY3QtZHJvcGRvd24vYW5ndWxhcjItbXVsdGlzZWxlY3QtZHJvcGRvd24nO1xyXG5pbXBvcnQgeyBzZXRUaW1lb3V0IH0gZnJvbSAndGltZXJzJztcclxuaW1wb3J0IHsgZm9ya0pvaW4gfSBmcm9tICdyeGpzJztcclxuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcbmltcG9ydCAqIGFzIG1vbWVudHRpbWV6b25lIGZyb20gJ21vbWVudC10aW1lem9uZSc7XHJcbmltcG9ydCB7IFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXIvc3JjL2NvcmUnO1xyXG5pbXBvcnQgeyBQQVJBTUVURVJTIH0gZnJvbSAnQGFuZ3VsYXIvY29yZS9zcmMvdXRpbC9kZWNvcmF0b3JzJztcclxuXHJcbmRlY2xhcmUgY29uc3QgTWljcm9zb2Z0OiBhbnk7XHJcbmRlY2xhcmUgY29uc3QgQmluZztcclxuZGVjbGFyZSBjb25zdCBHZW9Kc29uOiBhbnk7XHJcbmRlY2xhcmUgdmFyIGpRdWVyeTogYW55O1xyXG5kZWNsYXJlIHZhciAkOiBhbnk7XHJcbih3aW5kb3cgYXMgYW55KS5nbG9iYWwgPSB3aW5kb3c7XHJcbi8vIDxkaXYgaWQ9XCJsb2FkaW5nXCI+XHJcbi8vICAgICA8aW1nIGlkPVwibG9hZGluZy1pbWFnZVwiIHNyYz1cImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaGtBR1FBYUlHQVAvLy84ek16Sm1abVdabVpqTXpNd0FBQVAvLy93QUFBQ0gvQzA1RlZGTkRRVkJGTWk0d0F3RUFBQUFoK1FRRkFBQUdBQ3dBQUFBQWtBR1FBUUFELzJpNjNQNHd5a21ydlRqcnpidi9ZQ2lPWkdtZWFLcXViT3UrY0N6UGRHM2ZlSzd2Zk8vL3dLQndTQ3dhajhpa2NzbHNPcC9RcUhSS3JWcXYyS3gyeSsxNnYrQ3dlRXd1bTgvb3RIck5icnZmOExoOFRxL2I3L2k4ZnMvdisvK0FnWUtEaElXR2g0aUppb3VNalk2UGtFa0FBWlFDQWdPWUJKcWFCWjJlbndXYUFKR2thYUNucUtrRm82V3RaS3F3cWF5dXRGK3h0NThCdGJ0ZHVMNjZ2TUZZdnJqQXdzZFR4TGZHeU0xT3lySE16dE5KMExEUzFObEUxcXJZMnQ4LzNLbmU0T1U2NHFqazV1czE2S2ZxN1BFdzdxRHc4dmNyOUxuNC9ESDZudloyQUJnZ1lGWS9TUDg2QmRRaG9CTUJBUXNQRGtwWUlPSU5BS0FlV3BUb2gvL2l4aG9EVUdua3VBU0F3U0FlaVFTQU5aSmtFWk9VaXFRY1F1RFd3NU11ZWNDa0ZBQ25ENG9DaGpUMGRUTm5qMGs4ZWZya0FWUUlnSnJLQ0JyTmdUUnAwaUZOZzRUa051RGoxQkU3clNaZGVpNWhVQ0FyMGJYODZxS3FXS3RDc3Y2QTZ1NGhXeFp1MzFvbGkwTnVqNkgvdXQ0OUVWYnZXNzQyL0Fxays2L29ZQkY1RFl0RjNNN3NqNjBVUTFGK1RDR3k1TVBoTFBkSW03bkFXYzRkUEg5K0cvcmY2UjJNRXhKQW5WcjE2c2svUmU4Z25ka3JiUU8yYjdQdW9maGk3TUMvTlFRWGpwdXA3aHlBTTI5T3ptQTU4NzNPWGU4dTNlazE5UXJXcnl2TnJzKzdEY3dVQ1V6L3ZpQzgrSjQ3S0E3UXdYc21ld3p2aGNkUE9CL0hVKzcvczkyWGdYdmlyWmNQZjlCeFY1R0FHdVIzVzFuSTNWQWZnZ3dPNk9CbkJxWWdIdzdvVVpSaGhjQmRLTm1ISm14b3c0VGFnV2loaUliMVJTRU4vNVdtbm9yS3NhZ1hpU1NZU0VOMDl0RjRBWUhpM2FDakRCaHgxNStQSzlxSVhXVVJ6dEJoUXI0aHFTUm9OQXdKQTRyNkhJbGtrbE5TZ21NSVZyWjFuRDR6YnJsQmwwdktFR1lMUEQ1bkpnWkFYbGZsaXk4VUtlT2JxYUU1bnBwMHV2RGtQMUhpR1Nkek02UVhBNWIwYUlsbmpYckM1NDlzTVl5cFQ2Q0xHdENvbDQ4MkJrT2JLVmJLd2FDM2ZjbUJvV0lDS0txbmx6cnFBcWt0L0RtcHB4K0ErdUFMcks2QWFGMndncERxcVJqVXFvS2s5RkNhYTRpWDBnb3BDNXhtT1N3SS83Sml1T3F4S3NSWUdxL0ROdXNzQzc2ZTRDbzk1aTI3Z2JXR1VVdEJ0aVhjcXBhNHkrNktMYlFvQU91T3NONjJsK3E2bXFaZ3JqZ0J4aHVDdWlxUUM1bTc2TUNycndMZ3R0Z3Z1eVZzNjQ2aUEzdFFNSlVvK0t1cmdtVTJ6Q3kvSjBqOEFjRGlkR3Z4cC9OR2pMQUk5M0pUOGNlNlhvcHVBNW1aSUcxdktJTVZjb2tVbVpCc29qR1RnSEdPTmV1czRJSTVRN2F6Q0MyVG9EQTZIZ2ZOd2RCZzlrd3l4U3NIL1RERVJEdk5MTWZjSkMySndNZE1MVllKUllkd002NVJORFJBMUxWNG5XWUltTFR0OXR0d3g4M3cwajl6ZlNKZFdzdWo5bFZaSEMzTzNFZ0VFQnNCZGdmRHRCUWxjMU40REFPbElwZ2JKcFYwK0JNdkYyY0VBUDlqRndDNEdWV2h6Y0xrVG1TT3IrZklja3c0RzNtUm5zTGVlMHBoWjJtTHR5QTRNV2V2NFpucWhNMWNOc1ZKQk9EM0tYbC9FUnp1SkxDTzZSUUNZSzFNN0t2L0xoTHpTb1Q2a3A3RXd5ZzY3WmRmRDh2bXdndFgvYjVUUnA1RjQvcDhyNnZ5c1FTdlJaem01MmxqK3hLaWo0cjY4YWNIL2ZUdndkK2dpUHBESjc4bkovTUIrVEpEUHlzMFMzd0NkRkQvQk9LOGZRQUJjejg3blJqZWg1WUNMWEEwRGN5WEQ1TDNzMDV3RHd0VHU2QUVnQ1RDSDh4dUdTYjhYOGZBc0xjU1BpQThMZ3hDNWo0NEE5OTE4QlMxOHdMckVPaWZhOFZoZ0JtSllYVWFhTGtyR085NFZBbVhIVTc0aVFMaVJYdW02c0lSV3llaDV1Q0JpUnE4QVFmL2I1ZytMa3h4YlRBYVN4OGdDTFQ2Y2RFbTk5UEJGOEZZUTFYNUFYTTRzT0VaZmVGRUpheVJha1FTWWlDQU9FZWI2REYzcWZMaHdLRFl4MUNrOFNLQkROVWYxOEhFUXNiQ0x1dExwUGZTcGNJekZtUUxkMlRPSXFmQlIwZXFJb2VZbEdUKzNrUkdUejd5a0RvUlpmNDJ1WXN0bWxJVmtBeERKZ3Vrb2thK0VoV2dGRU5oVkNtOSs4anhsbzVESmY1NHFVbnFkQktZQUJRbUVtWjVIUjdlcFpUSUJCNGNka25NRVQzR2x0SDBJQ3VQVXMxaVRnV2IyWHhjSFpqWlRKY2NNNW9TeEFNMXU0bkhlMEF6bTU2NEpCL0k2YzE3dUJLZTJ0d2pPM3ZKeUVweU1aMkNvS2NpelVISVBzYXlFQUpkelRhbjZjK2Z5VE1SQ2IwUk94SjMvOFpjTGlLaWJQeEdRMldqVE5UdFU0enhvS2lDNm9qUWozYlVFRVNVejBKbHljNlYwdUYxY3hRbkwralpqNEtxNWFUcTVLVkx4N2xST241ampUdGQ0ZzB0U28xMWhvOGpLU1VLVHZYWnFLRGVRYVM0QUdnODlwYVRwS3Jpb2ZndzZpak4yVlBOT2ZVT0Q1dUtUVDhoVlpKWTY2dDZxT1JCcDZKVmEzNEZxcVpCNng4R0pWYzlORkNtcUNGUVhmVlFzckwrSmp5Y3lSeEoyU3BJdGxUT0UwUVZrRzFvTXlHODBpZ3llL1VEWGZ6cUk3ZEUxZzlwd2VxaWtQSWR6Y0xxc2tvTHJXaEhTOXJTbXZhMHFFMnRhbGZMMnRhNjlyV3dqYTFzWjB2YjJ0cjJ0cmpOclc1M3k5dmUrdmEzd0EydWNJZEwzT0lhdHhFWUxaYVprdHZVR3YrWVZIZVZmYTV5MnloZE5KR3l1bnB5TG5hN2ROM3RUa203M3JWUmQ4UExJdkNTOTBMalBhK0R6S3ZlOTZTM3ZVR2lBWHpYdTl6NTVvZTk5cDNWbHBqYktQem05elB2L1MrQTVTdGcvZFMzd1BxVkFZSVRITjBGRDVpNkR0WkxnQ1BNTndoVEdDNEh2dkRYQ0t4aERPKzN3eHUyTUlnbnJHSC9sampESUk0SmgxTzgxSEx3TjdzclRqR0pMMnhpR3FOWXhqRWU4WTExTE9JT3o1akNOUWJ5am4yY1l5Si9tTVVxN3ZHSmo0emtJRWY0eDA4dThwS1I5R0xyWHNRa1dNNnlscmZNNVN5ekU4cE43YktZeDV6bDQ1cjV6R2hPczVyWHpPWTJ1L25OY0k2em5PZE01enJiK2M1NHpyT2U5OHpuUHZ2NXo0QU90S0FIVGVoQy94Yi90SWJHUzVML2ltaEloS1hSZWtBS3BCa0IyZDlrRkVTcW1iUWRibGZaNFhIR05zNWtEMkFmc3h4Tno3T2VYM0dQcWNIcTNydlFNcS81V1hVYjZFcHEvcjFWZ2FsV0VtRnRiYzZqOXZwOXNpWURWWCt0cEdDelVHVm1iZTVVQTJuc01URGJIRUNWeUJkRGpZeFpOaHNNcXJ3MkZNalpEMlpxVzNMZC9IWWt3ejFUaytMam8rSjJTbkxUYmNEbnNwdWIxWDMzRkxBcmIwUnV0OTdiOWk2K0dWZGxLbXFqMzBnMEJNRDluWTJCQjV5cDVOMDM1ZHFyOEJLMEZkMVpOWGhQR2g0Q2cxT2JIUkozSTZ2UFMvRjJxN2ZqY1BwNHJrVStCNHNQNXVIb0Jqa0VKSzV5S1RKODFpVC82OHZUWVBMN1pKemlGbS81R1ZnK0JwNC8xdWM2LytRNG1DRWU5SHQ3aXVYcGZ2SEZoeHh2bDd0YlgwQUhvVWwxdm9lYmo3dWFKVnc2eG1QdWNXSzY4T0R6ak9IQXRXM3RIaEk4cHhvUEk3MURLVWs5dHZPbEhyNXkwOW1PYkRYZWlPb2pmTHZhaVU1MzZnbWtzSkFEZFNyM3llNFd3aHZ3YXJCT0FySGVQVjhQZnBLMmcvemhSU252Z21uZHlYcG5xWngrZ0hJS2hvRkZDNVZWd3p0LzZTUW1zdWU0RGdMb2RYa2hseDVSNGV3Ymd1VUx2M3JaKzEzWW1neHFsNzRkUWlLUW5wK29WK2d3SFY4RnRWMnUyR2hBUE9kQkIyNDBvUlZjTkpmb0VZNUlCZW92TS9Wb3FQVDBtVzlIN2krL25Ja0hhZURxWG4zdkMxQ3ZIbzNzNjd0KysrNExmOVpNTUgvejIrOStnMGtidWxVSTVQL0NNNzkxOGxlY3pBQllaaFVuZjA1UmVzczJYU1REWFVLRGdFM1FPY25tZitEelhRdW9iTnQyZVl3RWdSR29hektEZ2JTMWZ1V2lnQ05BZ0tzbGdoZGdaUnRJZ2JWbGZTWmdnaWNJWTdaRmdpVUlnaTNvZkxhbGdpc29nek9JZzdEbGdTZkFnanJEZ2ExbFBMampnemxJZks1bGd6Mm9neUdJZjZ3Rmd4bEFoRVdJZksrRmhFa29nU2hBaGFybGhFK29oRCtJZ3FvbGhMTERoVkhvZVYrb2hWdG9oZllDaEtRRmhtR0lobGRvaHQ2Q2hTZ0FoUzdEaEtNRmgyZW9nWitqaGxKamgzTW9oZzduaDBHRGgza29YaTVBaUp2RmgxV29oNHFtaUJhRGlQZ0JpSFhvaFgxSWlYdm9oaXZBZzVYWVh3b21pWlBJaVVyRGhvZmlpVGYvYUlrTkk0ZVh5SWh0SVlqeEFvbjdnNGt0SUlvZkk0dWpDSXVOYUlyZTRvcXZxSXAxd29xZjVZZ3FRSWR0U0gvNjRvdTJRb3B2eUlCeENJekJpSXpKU0l6VllvekhhSXVyeUl4VVpvMXBTSTNWQ0kxSGg0M1p5SXVkaUl0dklvMnBhSWcyZ0lwTVYzdHg1SXpSNG8wQ1FvN2xXRjVtQjRxVlFvc253bzd0S0k0cVlvLzNLSVU1b0l1N3hvMlloMnIySnBENzZJN1RTSWIvaUpDMHdUbytzSHVQNTRKRFI1QUw2WTkycDQ4Vjhuc1B4Z01RT1JyS21JNFVXWkVLZVpFRzJXRFk1NUVXdVJzTWFVd255WkZHU0pJMG1Dc2FtWFlxbVpKLzUzeDRCM2VFb25vdldaTTJHWTN2VjBFL0NaT3RoeklQTndRZEtaUUtsSk5qcEVSQ3RwQ1UzeGRybzZWOVQ5bVRFU2w1VTJsWkttR1ZMdWs5VENsd2srQlVVUGxBQThWYVh6V1dTbmtZWDFsTFhIbVZTckdXTklLV1pEa1djT2tqY2htVkZtaG9kOGw1ZVpsb2U1bG9UdkNYZ0JsL2JUbVlTeUNZaHRrN2habVk0emVVakJrOWkvbVlSWUNZa3JtVmpsbVpSa0NabU1tVGw3bVpTQm1abm1sQ29CbWFLRG1TcFBrU1dsYVVwN21hck5tYXJ2bWFzQm1ic2ptYnRGbWJ0bm1idUptYnVybWJ2Tm1idnZtYndCbWN3am1jeEZtY0dKQUFBQ0g1QkFVQUFBWUFMTFVBRndERkFMOEFBQVAvYUxBYi9qQktRNnU5T092TnUvOWdLSTZqWko0VHFhNXM2NzR0S3A5d2JkOTRmczA4Qk9qQW9IQm82UmwveEtSeVNUTDJrTXlvZEdwdzhxRFVyRlpubldHMzREQ3JLL3VLeitnT0dXVk91OS9WdGFrTnI0ZmxjN3NlalpmUTk0Qk1mUkYvZ1laRGd6NkhpNEtKRG9XTWtUV09qNUtXUUpRQmtKZWNKWlNibmFFZW1hQ2lwaG1rcDZvaXFhdXVhcCt2c2hxdHM3WVV0YmV6dWJxdnZMMnJ2OENud3NPaXhjYWR5TW1YeTh5U3pzK00wZEtIMU5XQjE5aDdtUUhib2QzZnlwbmluT0hsbHVmb2tlcnJpKzN1aHZEeGdQUDBldmIzZGZuNmIvejlhZjRCUENOdzRCMXlCdTBVVEtobElVTXFEaDlLaVNpeEVhV0tiaWhpVEtKeC95TWloQjRQWGd3cDBoSEprb2xPZ3Vtb0VnZkxsalpld29RaGM2YUxtamJIZ015NUJDZlBKanQvRXZFcE5BVFJvaCtPSW9VMWNxa1FwVTVwQlkzcWNpclZxMWl6YXQzS3RhdlhyMkREaWgxTHRxelpzMmpUcWwzTHRxM2J0M0RqeXAxTHQ2N2R1M2p6NnQzTHQ2L2Z2NEFEQ3g1TXVMRGh3NGdUSzE3TXVMSGp4NUFqUzU1TXViTGx5NWd6YTk3TXViUG56NkJEaXg1TnVyVHAwNmhUcTE3TnVyWHIxN0JqeTU1dFNVQ0IyN2h6Njk3TnU3ZnYzOEIvQ3docE83ang0OGlUNng1QVhMbno1OUJ2TS9kWVBMcjE2NzJuYjZ5T3ZUdDJBczI5aTdjT252cjQ4OC9MYjBmUEhybDZqTnpieStmOXZtTDgrZmh4aDgvUC8vYisvbUg1L1FmZ2ZBSU8yRjZCQnFLSFlJTGpMY2lnZHc0K2lGMkVFbHBIWVlYUVhZaWhjdlZKZE4rRzVHa0k0bkVkUHZUaGlPbUppQ0p3SlRKMDRvckphUWNmak5mSmFGOXZCT1NvNDQ0OEVqREFqMEFHS2VTUEFoUnA1SkZJQ21DRkJRa0FBQ0g1QkFVQUFBWUFMT2dBSmdDQUFBa0JBQVAvYUxyYy9wQUZFS3U5T092TklRZ2dRSFZrYVo0bXFFNGo2cjR3dWM1aWJOKzQ4czEwbS85QURXODRDUnFQangyUjUwTTZjOHRvODBsRlJhL0ZxcmFreEJKcjIzREc2NTJLejRzdVdZcHVMOVpyczVzS2g4L0Y2dnBTZmovcXlYMWJlWDlNZ1ZxRVdJWlZnNGdxaWxTTWpWbVBTSkpMbEU2UmpYeVlOcFpFblVlYWlKeWhMcU9JcGtHZlE2cEFxSCtscmltc003TTVzSHF5dHgyMXRyeWV2aXE3d0JtNWVzVXh3bzdKTDhkd3hNMFd5eURTTHRTVDFpVFBkdHEweTlIZURkeGs0ZUlTMU9jeTFPYnE1SURxSE5qdDUrOWU4ZkxwK0VMcys4Ylkvc2IwQzJqQlhpS0Mwd1lpaElBdHdNSUlCcTg4akRCdlloS0FGaDFVek1nZy8ySVVqaDAzZ2pRZ0VxVEhTeU1WbE9SNEVsVEtsa1BvaVd1WTBnRE1RaWxYWnJ6NUs2ZENreGhyOGd4Uk0yU3RvaG8vSWIyNGFhbUhWRTRwNm9wYWdSdlZDN2xrQ2oxNFZhRExyaG9HYWFXcUJxeUpIV1BOcGpYTHRxM2J0M0RqeXAxTHQ2N2R1M2p6NnQzTHQ2L2Z2NEFEQ3g1TXVMRGh3NGdUSzE3TXVMSGp4NUFqUzU1TXViTGx5NWd6YTk3TXViUG56NkJEaXg1TnVyVHAwNmhUcTE3TnVyWHIxN0JqeTU1TnU3YnQyN2h6Njk3TnU3ZnYzOENEQ3g5T3ZMang0OGlUSzEvT3ZIbk93QUVLRUJEd2wwQ0I2d1FjN28xK3ZmdUF2ZGE3aTZkK1Y0RDQ4OUsxMDBYUGZvQjZ1QVBZeS84T2w3dDgrZVRiaHI4dlB6dGI4Ly84QmVnZVdQc0Z5RjkrVGdGb29JSFRPV1hmZ2d2NlYxUjhFRlpZQUgwalBXZ2hoQWhhVk9DR0VFbzRrWUlnYmlnaVFoK1dhQ0dHQVZHbzRvc2RxcVBoaXlXZWVFNktOSlk0NERrejV2Z2lpOWJnNktPS0RWcEQ0cEJEMmdpTUFFSWlxU0tReFJ6cFpJNHhBdVBpbERrVzJVd0FUV0pwb1pLOGNPbWxqMUF1T2FhUFZmSnk1WmtnZ25sTEFHdXl1ZUo3eFlncHA0N2FNSGxuaVduZUl1V2VETkpaVEp5QUNpaG9tSVFXZWwrZnM5aXBLSU9NdXZMbm8reTVlVXVpbEo1WHBwV1pHbmhvbUYxU2Fpa3Zlblo2WHFSbW1vcmRwOVpndWllcVc3cDZKZ0VMT1Fvb3JONlVldWVtQVUwNkphN3h5RW9qcjdXR1dpT3JFOW1LWmxReXZwcUlMRWpDR2dpc1JYRCsySmF5RVQ2N2xLNExUbHRVcytJUmE1YXNvN0pWN1h4NVlidGpYaVNXT3hlRjNzS0Zhd0lBSWZrRUJRQUFCZ0FzNkFCaEFIOEFDZ0VBQS85b3V0eitNTXBKcTRYZzZzMjc3MEFRZkdScG5rOG9CaG5xdmpDMnptMXMzK1NzczNqdlU2cmQ3RWNzR29KQ21uRVpReVoxektqSitkVFZwTmhMZGN2TGVpVlU3dTVMYm9URnUyc1plMFlMMWV1bGV3NlAvOXJ6Wk4xdXcrZWZmRDUrZjA5N2dTV0RoRldITUlxT0lvYU1Hb21QaTVJZmxKVlZrWmN5bXArY25RdVpuMXlob3FXcElxSmdxcW1uaDZTdW02d3BzNkMxRDdlZnVRNnl1Mm05REwvQVNzSUt4TVVyeDhqS2pyQ0J6b3JRZk1uSzFIYld5c3hIMG9UWWNkNS80R3Zhd09SbDVzRGM2cnZvWk8yejcydmlhUE54OGJ6Y3V2VjYrNTc5VnR5VEZIRFpQd29CQjRyS1orcWdCbWtLZXpFVTR0RER1WW9lSm5iQmFQSC9GVWNUcFQ2ZU1CZFI1RE9STDM2VlJMa2d6MHFXemNTOGhEbHF5MHlhREN6aHhCSG01czRHVm40U1VlRlRhQXFqU0pNcVhjcTBxZE9uVUtOS25VcTFxdFdyV0xOcTNjcTFxOWV2WU1PS0hVdTJyTm16YU5PcVhjdTJyZHUzY09QS25VdTNydDI3ZVBQcTNjdTNyOSsvZ0FNTEhreTRzT0hEaUJNclhzeTRzZVBIa0NOTG5reTVzdVhMbUROcjNzeTVzK2ZQb0VPTEhrMjZ0T25UcUZPclhzMjZ0ZXZYc0dQTHRpQ2dyUUFDQlVha0RZQzdRQUVDYVFmNEhsNmdkbGtCeElrREgzczdlZklCWVhrN242NjdxL0RwMDZGelJZNjllL1dyMHJ0M1gyNDF3SFh4NG8xVFBZOGVQVlh1N2VOcmZ4byt2djN2UytIYnQwK2VhWUQ5L3dEbTlwUitBWXJYSDFPOUZZaWVldjRwR0I5VTdEbVlIWDBTb29lZlVnUldxQnhVQ1dxWUhJTkwvZWVoY3djdTFlR0l2b0dvbElnb0VuZGhVaG1PT0Y5VEo2TDRJbElzdHZnYmh6b09wMkpTT2JaWW9sSVJvamdqZ2ozNmRxTlJNWG80WkZJMWpyaWtVRUdpK0NSU1JZNzRJNVJKRmdCVmt4b2VhV0tYVS81VTVZaFhHcFdsaDJYKzFHV2FRb0ZaNFpaSVJja21oVW1LU1NTWlVMMzVaWmQwR21WbmhYQ2EyYVdlU2EycFlaczRuZWtob2tqSktTR2pPQTBxWWFFN09hcGhvRUlwV2lGVW1sWUlLWk44UG1XcGc1ZzJXcXBUcHlxWUtrMmhTc2pwVDU1S0dGV3JCWTVLNWFvMEp2a3FUTEU2T090T3RicDZhNUxENGlScGdEY0VKTHNUcnZKUmFxaUd6VnBWN0hnQ1NNdGxydHBpR09BQXpyTEtYN2g0R2todVZJbzIyKzFVMDZscmxuN3Vvb1Zidkx1ZHkwd0NBQ0g1QkFVQUFBWUFMTFVBdWdERkFNQUFBQVAvYUxyYy9qREtTYXUxSU9qTnUvOWdLSTRpY0oxb3FxNFk2YjV3L0xGMGJkOU1KdTk4citIQW9EQ2k4eG1Qb2FGeWlTc2luMCttZElweVFxODlxbllMc1dLL01LNVk3QVdiUmVNMHRYeHVkOVR3SmR0Tmo5dURjM3I3enJmbDlXWjlnaXQvZ0YrRGlDZUZobGVKamhTTGpGR1BsQStSa2tlVm1qbVllcHVmbDUxWm41cWhvanVrcGFkN3FaU21xMkd0ajYrd0xyS3p0V0MzanJTNWFMdUl2YjRnd01IRGpjV0N3c2R2eVgzTFBBRFMwOVRWMXRmVXp0cmIzTjNlMytEaDR1UGs1ZWJuNk9ucTYrenQ3dS93OGZMejlQWDI5L2o1K3Z2OC9mNy9BQU1LSEVpd29NR0RDQk1xWE1pd29jT0hFQ05LbkVpeG9zV0xHRE5xM01peC82UEhqeUJEaWh4SnNxVEpreWhUcWx6SnNxWExsekJqeXB4SnM2Yk5temh6NnR6SnM2ZlBuMENEQ2gxS3RLalJvMGlUS2wzS3RLblRwMUNqU3AxS3RhclZxNDhFYU4zS3RhdlhyendMaUIxTHRxelpzMkhQcWwwN05pM2J0Mlhkd3AwcmQrN2J1bmJYNHMyTGRpZmZ0d1QyL2gwYjJPOWd0WVYxSGtZcytIRGluSXZQUHNZWjJlemttNVhMWHJhWm1lem1tcDBKTng3OG1XWm9zYVZubmk2UVd1YnExakZmai80TEc2WnN3NkZydjF3OVlEYmYzcmc3QTFkOGVqams0cjd6R3FlTVBIam01WmliRXc4Tm5iUDA0OVNUMjYwTytqcno3TTRyQzlBK2QzejR5T2FuZDA2UGZUMTV1T3kvdXorL09INzAwUGF0NDMvL05uLzMvVjMwSGVhZmFhY05xRnFCL0xFVlFJSnJMUmpnWUE2cWwxbUU3VTNJb0ZvVXltZmhnMzlsZUY5bkh1b0g0b1ZuaGZqZmlCenlaU0tCb2ExNFlJc2ttdVdpYTZmTkdGdU5NY2FWSTFrOXJlYlRCbG9OSUNRQlJCSUptRzR2SlFBQUlma0VCUUFBQmdBc1lBRHVBQWdCZUFBQUEvOW91dHorTU1wSnE3MDQ2NjBBLzJBb2ptUnBuaGtRQkI3cXZuQXN6K1pxdDNTdTczeXZxVGFiYjBnc0dsM0JKTzdJYkRxZndHUncrYXhhcnpDcGxvWHRlcithclJoTUxwdWpZaW5Wekc0YjAvQzFlMDZQb2VGYmVYM1BCK0gvZW4yQ2d4SjNmMktCaElxRGhvZHBpWXVSYzQ2VUs1S1hmSTJWajVpZGJadWdrSjZqUnBxZ2VLS2txanVuclFHcnNFV3VycW14dGlTbXM0ZTF0NzBidXNDOHZzTVR1Y0NVeE1rZng4ekN5c25HekpYT3o3N1Iwc2pWMmhIWDJJRGI0QTdleDlUaHE5M2pjZWJtNk9sajYrSHQ3bXJ3NGZPMDlkdnk5MVA1MnZ2OExQbXJCcEJmdVlHWEN0NDdpREJTd0ZBTm9UMmNGbEhpUkVjTUt6SzZpRkgvNHpDT2pqeCtCSWxLeGdBQ0FrUmFVWmd1STRVQUJXSVNlS1VTQ2trdExpa1FpTWx6UU0wcUxNbkZnTW16YU1xZlRtNnV5RGxoWjlHaU01RTJDZHBLaG9DbldBc01vQ20xRkVlbUVyS0s5ZG4xQ05XUU1RYUlYWHUwYkpHejZyS3NuUnZWcmF4NUp1ZnEzV3FYQ0Z4NmN2VUtidHUzeDkrbE1wd0sxb3V5OEpDL1lDRmNYVXk1cm1NZXdSSlQzcXoxc3VGWlZqbHZKdXVaUjhISUQ0aUtYc3kxdEdtS2FWY3ZKdXo2OHlFWnFtV3ZKVkQ3eUxjWWluV0xiZDM3TVJ6Y3d1a1duNXBIYy9MaHk1M2NRZjFnOG5Pc3BLTTN1VEhqdWxqdFY2Zy9VT3Y5S1czd3BIS1hMOEFiZlN6eTYyTVNkKzlKZmZuMjlGVUZYejgvL3lYci8vRmw1MThuKzNtSDM0Q2RBTGplZVFoR0VoOVBCellvQ1h6eDlTZmhJUFo1SitDRmloVG9uWVVjOHBIaGRReUcySWVIejBWb29pQUtsbGZpaW5XZ21KeUtNTzVCSVg4MVl2aGdUQnZtU01lTjVma295SWpQdlNpa0dUSUtSK09SYkJDWkhJaE1rcEdrYmt0R1NVYUxIMXBKeDQ2ZGFla0drTjU1NllhVHdoa3A1aFZncG5obWsxeEN1V1lWVThyVzQ1dFhZSG1kbTNRMkVlZHFjK2I1aEoweit2a0ZtYnFaS2FnUmFRWjZLQmFFeW9ibm9rUHNLVnFma01yU1pxVldTTXFab1pqeUFLaVNuVlp4YWFoT0NLRHBZbFdTT2tRQWlhNzJxS3FlbmpvV3JGZXcraHl0ako1VUtLNWQyQ3BhcXJ3eVlTcG5yd1pMaEsrQ0FXdHNFeVBENmxYc3NySTBteFdsMEZhQkxGVFZ0aUhBalp4bVcwV3p5bnFMaGFuUGlvdENBZ0FoK1FRRkFBQUdBQ3duQU80QUFnRjlBQUFELzJpNjNQNHd5amJJdkRqcnpidi9ZQ2lPa1ZDY0FxbXViT3Urc0JnUTUybkZlSzd2ZkI0TXRXQ3FSeXdhajBWVGNCbEFPcC9RYUdhMnJBNmsyS3lXK0t0NkM4MnRlRXdHQWIvZVczbk5iaXNFTlBSMzZLN2JvVlE1V24zdiszVm5lbkpYZjRXR0tuQ0NpbUdIalk0WWVZcUNmSStWbGdhQmtvdVhuSTFLbXBxVW5hTnRrYUNhZEtTcVpKbW5vS3V3VzUrdXJvU3h0MGltdEs2TXVMNDdyYnV1b3IvRkxMUEN3cjNHekRKeHlkREV6ZE1hd2REQ3FkVGFFOGpYMTh2YjRRdTYzdEMyNHVoZDVlVUU0T2phM2V1N0JObnY4TS95eWZYMjArVDV0ZTc0TWJQMkQxUTdnZUVTRmNTR2NKdS9oWkxPTld4R0VLS2dBUUVuNG9wbmNmOVNSbzJ4SG5hVXN3OGtyb29qdjBnMCtRdGx5aVVIV1RiaitESUlQWm5VUk5Zc2lmTVh6WlFyZXpMVENUR20wRzAvQzk0OEtvNm92S0JNc1FBNGtyUWN4cWhqQUFRSU1MV0kwMlJHc1diUnVuVXJWWWc4eFRvcHk3WnJFWHhXMVc0aHk3YnMyWFZoNVVLaFc1ZnRFWmVTOHVwMXdyZHZXeU5WQmFVZHpNV3c0NDh4QUtPQnlyaEk0Y2VIdmNKVkpMaXlaY3lnN3daZTdEbkhaZEI5M2ZiNFdvQjBhUnlvWTBPR1VaWHlheDJuWlJ2K3UyZjI3UmU1ZFJ0V3pjT2Y2OTh1Z2d2ZmpYaUpiZVE0bEMrdlM1ekhtYXZRa1VpZmJ0ZklETi9aWVhOSFhUMzhyZTNqelE4ZGoxcDlNZlRjeTd0WEJYLzYvRi9zUWN1LzM2bitjdjcvdU9TSDJYNEFXdUtmY0FRVytNaUJ1aWtJaTRDUEplamdJUXpLTnFFcUVEb200WVYvVkJnYmg2Tms2QmlJbllpWUdvbVhlTmdlaXBhWVNCMkxsYWdZR295UHVKZ1pqWTNZMkIyT0ZPcG9GbytIK01nVmtJYklpQm1SaGdpNUlaSmpDTWxraHo0dSthUVdTazU1aDVHUFdYbEhsVnJXNFdTWGJtQTVISmh1ZkVubUdtSXlkMllaWEs2WmxabHVpcEhtaTNFMjZXT2RiK29vSlo2cjNjbW5GblBXOVNlZ1VRNmFCWnlHUGhGb1dYc21HZ09pamg2eDZGYU5SdW9DcEpaNjVXZW1raGJLNlJHWWZvcWJwNkkycG1PcDN1bUpLaEdMVnJxcURDYTYrbW9JWXNvNks2enNBV0RycmJoT3R5dXZJakQ0SzdBaklFaHNGT2dOZTZ3S0dQb3B1eXl6d3puN3JBcUY2VHF0R0l4S2V5MEwxb2FRQUFBaCtRUUZBQUFHQUN3WEFMb0F1Z0RBQUFBRC95aTEzUDR3eWtubE1EanJ6YnYvWUNpT3BEWlVhS3F1emxXK2NDelAyY25lZU83U2ZPL0R0cHh3T05uOWpzZ2tnY2hzTW96SnFEUzJkRnFGMEtsMjY2bGV2NnNzZDh6MWdzOFVNWGtkTmFQZkR6Vjc3b1BiSVhLNlhuYnZQL2VBZFg1OWVZR0dJSU9FaDRzdmlYZUZqSkVHam5hUWtvdVVjSmFYaHBsdm01eUFubWlnb1hxalo2V21jNmhncXF0cmJxMUVyN0Jqc3JOWXRweTR1VGkxdTFxOXZpekF3VkxEeENyR3gwbEJ5anJOak0vUU44elNTUUhhMjl6ZEFRTGc0ZUxqQWdQbTUranA1Z1RzN2U3dnZkZlk4L1QxOXZmNCtmcjcvUDMrL3dBRENoeElzS0RCZ3dnVEtseklzS0hEaHhBalNweElzYUxGaXhnemF0eklzZitqeDQ4Z1E0b2NTYktreVpNb1U2cGN5YktseTVjd1k4cWNTYk9telpzNGMrcmN5Yk9uejU5QWd3b2RTclNvMGFOSWt5cGR5clNwMDZkUW8wcWRTcldxMWF0WXMycmR5cldyMTY5Z3c0b2RTN2FzMmJObzA2cGR5N2F0MjdkdzR6SUNRTGV1M2J0NDgwYjF4cmN2MzcxK0EvY0ZMTGp3TnNLR0N5Tk9ISGd4NDhGUUh5dU9MTGt4NWNxUW4yTDI2M2l6dHM2ZVFXOFdqWmwwWmRPU1VUOVd6WmgxWXRlR1lVL1c3Tm1iYk1HM0xkT3V6UzAzNTh1OFB3TVA3anV6MCtDOWgvTXUvbGQ1YmVhMm5ZZVdQcHA2YWV1bnNhZld2cHA3WWdEUXVZSDNibmo4N3VEbWp5TVBrTDdwZXZiaHQ3Vm4rbjcrMHZyeHRkbFhpcDk4NGYxSlNmVjNIbThBSWlXZ2VzZ1ZlTlNCN3Eybm9GRU0wdWRnZnZENUo5aURSVVY0MzRRV0JvWWhVUnJ5eCtHQXRYMDRWSWdCam9nZ2VoU2FLQlNLQnE0bjFYc3p5aWpWWGFFbEFBQWgrUVFGQUFBR0FDd25BR1lBZFFBQUFRQUQvMmk2dkJJdHlrbXJ2VGhyRmtnWld5aU9aS2tNUlZvSVp1dSttNkNxQkFUZitOdk44MkRud0NBR3hlT0JoTWlrbzhna3NKUlEzSTdaL0VXdkpCbDFlOFI2TmRQdDl2a3RVNGhpc2RQTVptalQ4RnFialliRHUvUHIyODRuNTVVZWZJSUZjbjlJZTROOFBvWkFZWW1EZUl3dWlJK0RmcElranBXSmhaZ2psSnVKaTU0Ym1xR1ZsNlFWb0tlUGE2b1ZwcTJibmJBTnJMT2JrYllHQVhXNXM2bTJzc0NWdGJ3R3VNV2NWcnkreTdtN3c0SFFwOEt3eXRWMng3eS8ycUxOMDkraDB0ampvZGVxM3VmYjRiREU3R0xscXRueFRPbWs2L1piN3UvVSsyT1FTYWdYajREQU13RHZIYVFBNzV6QmhhdisyZXNIa1lFK2JmTXFjcEQ0VGYrakJnRWNsK0h6R0lHZ01aSWhua0dqaUpKaFNGb3Rzd0JqR1RQV1JVVTFUVFJNazNNU3FwNHZiaFo1Q05URlRoVTBpOGE0b3pUSHphUk5VNGJNR0xVRUlxSlZnYUFabVZVbkFheGR3NG9kUzdhczJiTm8wNnBkeTdhdDI3ZHc0OHFkUzdldTNidDQ4K3JkeTdldjM3K0FBd3NlVExpdzRjT0lFeXRlekxpeDQ4ZVFJMHVlVExteTVjdVlNMnZlekxtejU4K2dRNHNlVGJxMDZkT29VNnRlemJxMTY5ZXdZOHVlVGJ1MjdkdTRjK3ZlemJ1Mzc5L0Fnd3NmVHJ5NDhlTzRBd1FBQUJpQWN1WE0rejZmenRmNTlPZlI4VjdmbnAydTllM1h1OGNGVHg2cTJmTGx4YS85amg2OGVyVHQ0NzhueXo0KytmbGk3ZXZIWDdXK2Z2VGYvQ24xMzREbXhlUWZnZVdKZFNDQzd1WEhvSHdLUGhqZldCSzJGMkJPQzFhb0hJVWEzaGRoaCtCeENPSjFJbzZJM1ljbVBsZGlpaGZXbEtHR0s1cllvb0VwVXVkZ2pRVzI5S0tFTThhRTQ0WTMxdGdqU2p0S0dPT0lRNUpVSklOSmt2Umpqa1QrMktSSFR4NEo0cFFWTGNtZ2xSMk9wU1dCV0ZaVUpZb3NjZ2tqbVRLYVdhR2FScUtKSkpzUGVpa2xuRnU2ZVNXZENNcUpvNTVDNGtrZ24yVUdtU0tnYVFyNnBwMWQrdmxmbUZudVdkYVg5akdxNUlocVFVb2VXNWFHNTFhbVFMNWxxYVJLUVZyWGtxRDJ0Mk5lR1ZiSG5WL3NCZVpjcVJZa0FBQWgrUVFGQUFBR0FDd25BQ29BZFFBQUFRQUQvMmk2M1A0d3lrbE5DRFhyemJ0WEFrRjhaR21lSUZHc0F1cSs4Q0lNYXozR2VMNEZkTzBQdXFDd0VRajVqZ1hNY0lreklvODNwdFRFZTFxVjB5ekhhVVZHdFdCSnRkdHRoYy9FZ1lwTVJyc3RQVFlaK0FaejVXUnNmVG5HeTc5N1FYZCtiSHFCT1FLRWhJQ0hPR3VLY21hTk9RR1Fmb2FUTDQrV1hYU1pNWldjaFo4NGNhSlBqS1JVcDJTU3FpaUpyS2l2TUp1eU5aNjBKckczUjVpNkhyYTl1Y0Fmb2IwK3Y4VWJwc2lweXhySHlDelFKTTNJMVNUVFA5a2V2TnZLM1JMQ3Q4L2lFZC9UNGVjUDVMTG03QTdTMDY3eEV0ZTk5aFh6eU1UNkQvaHVyZnRud0IwcmVBVFRJYXRIc0lIQlV3ai84ZXZGc09HQ2g2Y0c2cHQ0eS8rZlJRVUJaV25VdDgzR3h3Y0tLWjUwZ0pGVFJIMHBPNjUwV0hMRnlIZ2NaWG44R0pMVlRYWTVEODVrMFBOVXhZODFWd3lWa1hTbnhaYWNmcDRMQ25HcEFxaVdwSXFqS3VxbHZhS2lqamJrS3NxcWdaZzZ6V0pWNUxRaFdwZGEyYTFsSTNZbFdUWnRoNEx0UWlBdXdidFE2cG8xc05lSDRNRUtDT1ZGekpSTlg4WWFEQkk0REpsQnpNV1ZXUjRaNExmeXNjZVpQOUNnSExxMDZkT29VNnRlemJxMTY5ZXdZOHVlVGJ1MjdkdTRjK3ZlemJ1Mzc5L0Fnd3NmVHJ5NDhlUElreXRmenJ5NTgrZlFvMHVmVHIyNjlldllzMnZmenIyNzkrL2d3NHNmVDc2OCtmUG8wNnRmejc2OSsvZnc0OHVmVDcrKy9mdjQ4K3ZmejcrLy8vLy9BQVlvNElBRUZpamJCYmtCY0VFQUFOaW00SUlJenZZZ2hCYzBHTnVFRkZiNEdvWVpMdGdhaHgwdWFHRnFJWmJZbVVVZ21paWlhU21xQ0dGcExzWllXWXN4VWppaVZUVFdtT0ZnT3ZaNDQwazU5dGpoVEVFSzJlR1BFaG1wSklwS05ubmlKRVU2V1NLUzJVaHBKVHRSV21raWxicGtxYVdLVlg3NUpaZWZlQ21taTJRZVl1YVpMdEt5SnB0YnVnbm5tSExPYVdXYWU3eHBaNFo0MXJIbm5YWCtxV1NmYitncGFJU3ZITm9rb1c0WUtpaWphRGo2SjZSb0tMcWtMcFlLU1dtam1jYTRhYUdkeHBtTnBGK2VRNnFVbjBJWnFvYjJuQ3BrUTY1Nnl1U2hxUUlUNjVGTDdXbldyYXlhZFdhdHBtb0pMRTVTc3Jnb2Ftc09DNnVPR01wK0ZDVnNLalpMWklqU0xnWGliUkJXTzVpQzJoS1VBQUFoK1FRRkFBQUdBQ3dYQUJjQXVnQy9BQUFELzJpNjNQNHd5a21ydlRpN3dJVVlJQ0dLUldtZWhhaXRiT3UrTUlYT2RGM0VlSzd2c08zWHZLQndPUHdaVHdHaWNzbkVISi9KcG5RNmZSNmoxS3lXWnpWaXQrQXdxL3Y3aXM5b0NkbG5UcnZmYTF2N1RSZkhhL082UG51bjVmZUFUSDB6ZjRHR1FvTW9oWWVNT1lsSWpaRkZqeVdMa3BjYWxKV1luREdhQlphZG9oR2ZvYU9uREtXb3F4V3FySzhRbndLd3RBMnl0YmdHdDdtMHU3eXZ2cityd2NLbnhNV2l4OGljeXN1WHpjNlIwTkdNMDlTRzF0ZUEyZHA2M04xMG53UGd6NXJqNU5MbTZPbVU1K3VINHUvVjZ2TFk5UFhiOS9qZSt2dmgvZjdjeEF0WVp5QkJPQUFQMmttb0VJekJobWMrRVlDWVJpSkZOQll2THFRMFVmOWptSXdldDRBTXlVZFRSNUlsT2FMVU1uSmxrNVl1bDhDTVNXUW1UVVFtYjc3TXFWTW16NTQxZndMRnFYTG9wS0pHZzN5NmtWVHBwNlpPTlVIbDhuU3FqcVZXcjFiTjZta3IxeGNnd29vZFM3YXN1NjlvMDZwZHk3YXQyN2R3NDhxZFM3ZXUzYnQ0OCtyZHk3ZXYzNytBQXdzZVRMaXc0Y09JRXl0ZXpMaXg0OGVRSTB1ZVRMbXk1Y3VZTTJ2ZXpMbXo1OCtnUTRzZVRicTA2ZE9vVTZ0ZXpicTE2OWV3WTh1ZVRidTI3ZHU0Yyt2ZXpidTM3OS9BTlFEZ1FMeTQ4ZVBJa3l0ZnpwdzV4ZWJRbzB1Zmp2dzU5ZXZZczNPd3JyMjdkK1hjdjRzWEgzNjgrZXpsejZ1WG5uNjkrK1h0MzhzM0huKysvZnIyNWVQUDczNC9mL1ZFL3YxblhvQUNrZ2RSZ2Z3UmlHQjNDaTZJM29FTzZnZGhoUDFOU0NHQUZsNDRZSVlhR3RoUWh4aCtDT0tHSW83b29VSW1qdWNSQUN5MjZPS0xNTWJvNG9JVUpRQUFJZmtFQlFBQUJnQXNKd0FtQUFFQmZBQUFBLzlvdXR6K01NcEpxNzA0NjgyN0dvSW5qbVJwbm1qS0NVVkJDSUVxejNSdDMxV3J2ekh1LzhDZ2tESFFHWG5EcEhMSnZBU01VQmVzU2ExYWdZUm85SFh0ZXI4aWxsYkxCWnZQYUVaMlBBYWwzM0Jxa1UwZjlPTDR2TzFKN3lQMWdJRWxhMzErSVlLSWlSZGloWTEyaXBDUkRZU05oV1dTbUlKemxaVUVtWjk2Zkp5Vmg2Q21hWlNqZEo2bnJXYWlxbjEzcnJSV3FiRmFBN1c3Vll5NGJMekJTN0MvV3FYQ3lEK2J4VnZKemo3RXpFYXp6OVVxdDlJdTF0c3F2dGs2MU56aUhkSGZ1dVBvSHN2ZkxlbnVHK1haeCsvMEU5alNyUFg2RWQ3czRmc0FEYkNEY2k2Z1FRUHIvQjAwR0U5YXdZWDc3akhMQjFGZnYyL3pLcjRiZUVULzQ3NkUzLzU1Rk5lUTJjT1I2U1F5RTRuUzJrVjVMZCtwL0VVeHBqaVEyVmphVEZheVdNMmQxbWIrMGdrMDJFdUhSY1VKeFpXVUcwNXBHWnNLNjBsVGFsQ080S3crbzRycnAxWmVTMk1SL1dycXFVbXl5TGpHOG9yV1ZWaFZVZHVlVXF1S3JWeFRiMGVOdlJ2cDZGbSt0T2lxMmdzNGtkbGljUXRMRXN6SnJ1SkllVGtsZnF6SXIwL0twaGh6SW93NXorRmZKenREMGx5SmN3a0FBRVRYaUV3S0NJQUFzRlhMc0Z3VkNPemJxV1dmd0pyMXgrdmJ1SFdUb04zVk5mRGpBWElMN3lDQXRTemJ5SkV2RHpNd2RJM2YwWThybjc3aGN5UGoyYk52NTQ0aGdITWRrMVZnRHgrZC9Bcm5qdFd6bnovZXZRWHZVRXlUbU04L3VmME0vd0hncDQxdi9mVlgzMzhTbU5lSWZpTVU2Q0NDR0ZobUhRM3JPVWdmaEJmZ0ZKOEtGblo0SUlZT0tBaEZlaWxVMktHQklGSWc0b0ErbUhoaWdTbFNJQWFESXJqNElvb3hTa0FpQ2piZVdPQ0hPUWJSbzQ4L0JxbkVrRVFXYWFRUVNDYXA1Skk0Tk9ta2cwQkNlWUtVVXo1b0pZVlpkdW5mbGpOZzZTVi9WWUpaNDVoVGxta21CMktpeWQ2YThybEpwSnB3YXRDbW5NalJXV2Q1ZVBxbzU1NFYzTmtuY0lDYUlPaWdYeGJhSUtJbi9xbG9CSWNpK3VnSWtmYnA2S1FQTU9vaHBoNVVpdWFsbkQ3Z2FaZWhscUJwZUtDV0NzR29SS3A2NWFuQnVYb0NyRFRLT2dHck1Ob2FKNTZwNm1vQnJ0bjV5dVdud2w0M1pyRTNBTnNyc2l3WjRNcHNpNjArUzJDajBnWnhZclZNVW9udEVGSnVxOFNGM2liUlk3aE1tRWd1RmNBdGV5NlBzVEdiQUFBN1wiIGFsdD1cIkxvYWRpbmcuLi5cIiAvPlxyXG4vLyAgIDwvZGl2PlxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhdHQtcnR0YW1hcGxpYicsXHJcbiAgdGVtcGxhdGU6IGAgIFxyXG4gIDxkaXYgaWQ9J215TWFwJyBjbGFzcz0nbWFwY2xhc3MnICNtYXBFbGVtZW50PlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcbiAgc3R5bGVzOiBbYFxyXG4gIC5tYXBjbGFzc3tcclxuICAgIGhlaWdodDogY2FsYygxMDB2aCAtIDRlbSAtIDcwcHgpICFpbXBvcnRhbnQ7ICAgIFxyXG4gICAgZGlzcGxheTpibG9jaztcclxuICB9LFxyXG4gIC5pbmZ5TWFwcG9wdXB7XHJcblx0XHRtYXJnaW46YXV0byAhaW1wb3J0YW50O1xyXG4gICAgd2lkdGg6MzAwcHggIWltcG9ydGFudDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgbGlnaHRncmF5OyBcclxuICB9LFxyXG4gIC5wb3BNb2RhbENvbnRhaW5lcntcclxuICAgIHBhZGRpbmc6MTVweDtcclxuICB9XHJcbiAgLnBvcE1vZGFsSGVhZGVye1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgd2lkdGg6MTAwJTtcclxuICB9XHJcbiAgLnBvcE1vZGFsSGVhZGVyIGF7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgICBwYWRkaW5nOjVweCAxMHB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmYzEwNztcclxuICAgIGJvcmRlci1jb2xvcjogI2ZmYzEwNztcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHJpZ2h0OjEwcHg7XHJcbiAgICB0b3A6NXB4O1xyXG4gIH1cclxuICAucG9wTW9kYWxIZWFkZXIgLmZhe1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgdG9wOi0xMHB4O1xyXG4gICAgcmlnaHQ6LTEwcHg7XHJcbiAgXHJcbiAgfVxyXG4gIC5wb3BNb2RhbEJvZHkgbGFiZWx7XHJcbiAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgIGxpbmUtaGVpZ2h0OiBub3JtYWw7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEJvZHkgc3BhbntcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICAgIGxpbmUtaGVpZ2h0OiBub3JtYWw7XHJcbiAgICB3b3JkLWJyZWFrOsKgYnJlYWstd29yZDtcclxuICB9XHJcbiAgLm1ldGVyQ2FsIHN0cm9uZ3tcclxuICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XHJcbiAgICBmb250LXNpemU6IDIzcHg7XHJcbiAgfVxyXG4gIC5tZXRlckNhbCBzcGFue1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgfVxyXG4gIC5wb3BNb2RhbEZvb3RlciAuY29se1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIH1cclxuICAucG9wTW9kYWxGb290ZXIgLmZhe1xyXG4gICAgcGFkZGluZzowIDVweDtcclxuICB9XHJcbiAgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFJ0dGFtYXBsaWJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBjb25uZWN0aW9uO1xyXG4gIG1hcDogYW55O1xyXG4gIGNvbnRleHRNZW51OiBhbnk7XHJcbiAgdGVjaG5pY2lhblBob25lOiBzdHJpbmc7XHJcbiAgdGVjaG5pY2lhbkVtYWlsOiBzdHJpbmc7XHJcbiAgdGVjaG5pY2lhbk5hbWU6IHN0cmluZztcclxuICB0cmF2YWxEdXJhdGlvbjtcclxuICB0cnVja0l0ZW1zID0gW107XHJcblxyXG4gIGRpcmVjdGlvbnNNYW5hZ2VyO1xyXG4gIHRyYWZmaWNNYW5hZ2VyOiBhbnk7XHJcblxyXG4gIHRydWNrTGlzdCA9IFtdO1xyXG4gIHRydWNrV2F0Y2hMaXN0OiBUcnVja0RldGFpbHNbXTtcclxuICBidXN5OiBhbnk7XHJcbiAgbWFwdmlldyA9ICdyb2FkJztcclxuICBsb2FkaW5nID0gZmFsc2U7XHJcbiAgQFZpZXdDaGlsZCgnbWFwRWxlbWVudCcpIHNvbWVJbnB1dDogRWxlbWVudFJlZjtcclxuICBteU1hcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNteU1hcCcpO1xyXG4gIHJlYWR5ID0gZmFsc2U7XHJcbiAgYW5pbWF0ZWRMYXllcjtcclxuICAvLyBAVmlld0NoaWxkKCdzbXNwb3B1cCcpIHNtc3BvcHVwOiBQb3B1cDtcclxuICAvLyBAVmlld0NoaWxkKCdlbWFpbHBvcHVwJykgZW1haWxwb3B1cDogUG9wdXA7XHJcbiAgQFZpZXdDaGlsZCgnaW5mbycpIGluZm9UZW1wbGF0ZTogRWxlbWVudFJlZjtcclxuICBzb2NrZXQ6IGFueSA9IG51bGw7XHJcbiAgc29ja2V0VVJMOiBzdHJpbmc7XHJcbiAgcmVzdWx0cyA9IFtcclxuICBdO1xyXG4gIHB1YmxpYyB1c2VyUm9sZTogYW55O1xyXG4gIGxhc3Rab29tTGV2ZWwgPSAxMDtcclxuICBsYXN0TG9jYXRpb246IGFueTtcclxuICByZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscyA9IFtdO1xyXG4gIHJlcG9ydGluZ1RlY2huaWNpYW5zID0gW107XHJcbiAgaXNUcmFmZmljRW5hYmxlZCA9IDA7XHJcbiAgbG9nZ2VkVXNlcklkID0gJyc7XHJcbiAgbWFuYWdlclVzZXJJZCA9ICcnO1xyXG4gIGNvb2tpZUFUVFVJRCA9ICcnO1xyXG4gIGZlZXQ6IG51bWJlciA9IDAuMDAwMTg5Mzk0O1xyXG4gIElzQXJlYU1hbmFnZXIgPSBmYWxzZTtcclxuICBJc1ZQID0gZmFsc2U7XHJcbiAgZmllbGRNYW5hZ2VycyA9IFtdO1xyXG4gIC8vIFdlYXRoZXIgdGlsZSB1cmwgZnJvbSBJb3dhIEVudmlyb25tZW50YWwgTWVzb25ldCAoSUVNKTogaHR0cDovL21lc29uZXQuYWdyb24uaWFzdGF0ZS5lZHUvb2djL1xyXG4gIHVybFRlbXBsYXRlID0gJ2h0dHA6Ly9tZXNvbmV0LmFncm9uLmlhc3RhdGUuZWR1L2NhY2hlL3RpbGUucHkvMS4wLjAvbmV4cmFkLW4wcS17dGltZXN0YW1wfS97em9vbX0ve3h9L3t5fS5wbmcnO1xyXG5cclxuICAvLyBUaGUgdGltZSBzdGFtcHMgdmFsdWVzIGZvciB0aGUgSUVNIHNlcnZpY2UgZm9yIHRoZSBsYXN0IDUwIG1pbnV0ZXMgYnJva2VuIHVwIGludG8gNSBtaW51dGUgaW5jcmVtZW50cy5cclxuICB0aW1lc3RhbXBzID0gWyc5MDA5MTMtbTUwbScsICc5MDA5MTMtbTQ1bScsICc5MDA5MTMtbTQwbScsICc5MDA5MTMtbTM1bScsICc5MDA5MTMtbTMwbScsICc5MDA5MTMtbTI1bScsICc5MDA5MTMtbTIwbScsICc5MDA5MTMtbTE1bScsICc5MDA5MTMtbTEwbScsICc5MDA5MTMtbTA1bScsICc5MDA5MTMnXTtcclxuXHJcbiAgdGVjaFR5cGU6IGFueTtcclxuXHJcbiAgdGhyZXNob2xkVmFsdWUgPSAwO1xyXG5cclxuICBhbmltYXRpb25UcnVja0xpc3QgPSBbXTtcclxuXHJcbiAgZHJvcGRvd25TZXR0aW5ncyA9IHt9O1xyXG4gIHNlbGVjdGVkRmllbGRNZ3IgPSBbXTtcclxuICBtYW5hZ2VySWRzID0gJyc7XHJcblxyXG4gIHJhZGlvdXNWYWx1ZSA9ICcnO1xyXG5cclxuICBmb3VuZFRydWNrID0gZmFsc2U7XHJcblxyXG4gIGxvZ2dlZEluVXNlclRpbWVab25lID0gJ0NTVCc7XHJcbiAgY2xpY2tlZExhdDsgYW55O1xyXG4gIGNsaWNrZWRMb25nOiBhbnk7XHJcbiAgZGF0YUxheWVyOiBhbnk7XHJcbiAgcGF0aExheWVyOiBhbnk7XHJcbiAgaW5mb0JveExheWVyOiBhbnk7XHJcbiAgaW5mb2JveDogYW55O1xyXG4gIGlzTWFwTG9hZGVkID0gdHJ1ZTtcclxuICBXb3JrRmxvd0FkbWluID0gZmFsc2U7XHJcbiAgU3lzdGVtQWRtaW4gPSBmYWxzZTtcclxuICBSdWxlQWRtaW4gPSBmYWxzZTtcclxuICBSZWd1bGFyVXNlciA9IGZhbHNlO1xyXG4gIFJlcG9ydGluZyA9IGZhbHNlO1xyXG4gIE5vdGlmaWNhdGlvbkFkbWluID0gZmFsc2U7XHJcbiAgQElucHV0KCkgdGlja2V0TGlzdDogYW55ID0gW107XHJcbiAgQElucHV0KCkgbG9nZ2VkSW5Vc2VyOiBzdHJpbmc7XHJcbiAgQE91dHB1dCgpIHRpY2tldENsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICB0aWNrZXREYXRhOiBUaWNrZXRbXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1hcFNlcnZpY2U6IFJ0dGFtYXBsaWJTZXJ2aWNlLFxyXG4gICAgLy9wcml2YXRlIHJvdXRlcjogUm91dGVyLCBcclxuICAgIC8vcHVibGljIHRvYXN0cjogVG9hc3RzTWFuYWdlciwgXHJcbiAgICB2UmVmOiBWaWV3Q29udGFpbmVyUmVmXHJcbiAgICApIHtcclxuICAgIC8vdGhpcy50b2FzdHIuc2V0Um9vdFZpZXdDb250YWluZXJSZWYodlJlZik7XHJcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5jb29raWVBVFRVSUQgPSBcImtyNTIyNlwiOy8vdGhpcy51dGlscy5nZXRDb29raWVVc2VySWQoKTtcclxuICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMgPSBbXTtcclxuICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMucHVzaCh0aGlzLmNvb2tpZUFUVFVJRCk7XHJcbiAgICB0aGlzLnRyYXZhbER1cmF0aW9uID0gNTAwMDtcclxuICAgIC8vIC8vIHRvIGxvYWQgYWxyZWFkeSBhZGRyZWQgd2F0Y2ggbGlzdFxyXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnRydWNrTGlzdCA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICB0aGlzLmxvZ2dlZFVzZXJJZCA9IHRoaXMubWFuYWdlclVzZXJJZCA9IFwia3I1MjI2XCI7Ly90aGlzLnV0aWxzLmdldENvb2tpZVVzZXJJZCgpO1xyXG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAvL3RoaXMuY2hlY2tVc2VyTGV2ZWwoZmFsc2UpO1xyXG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gJ2NvbXBsZXRlJykgIHtcclxuICAgICAgZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgICB0aGlzLm1hcHZpZXcgPSAncm9hZCc7XHJcbiAgICAgICAgICB0aGlzLmxvYWRNYXBWaWV3KCdyb2FkJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubmdPbkluaXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgdGhpcy5tYXB2aWV3ID0gJ3JvYWQnO1xyXG4gICAgICAgIHRoaXMubG9hZE1hcFZpZXcoJ3JvYWQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgXHJcbiAgfVxyXG5cclxuICBjaGVja1VzZXJMZXZlbChJc1Nob3dUcnVjaykge1xyXG4gICAgdGhpcy5maWVsZE1hbmFnZXJzID0gW107XHJcbiAgICAvLyBBc3NpZ24gbG9nZ2VkIGluIHVzZXJcclxuICAgIHZhciBtZ3IgPSB7IGlkOiB0aGlzLm1hbmFnZXJVc2VySWQsIGl0ZW1OYW1lOiB0aGlzLm1hbmFnZXJVc2VySWQgfTtcclxuICAgIHRoaXMuZmllbGRNYW5hZ2Vycy5wdXNoKG1ncik7XHJcblxyXG4gICAgLy8gQ29tbWVudCBiZWxvdyBsaW5lIHdoZW4geW91IGdpdmUgZm9yIHByb2R1Y3Rpb24gYnVpbGQgOTAwOFxyXG4gICAgdGhpcy5Jc1ZQID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBDaGVjayBpcyBsb2dnZWQgaW4gdXNlciBpcyBhIGZpZWxkIG1hbmFnZXIgYXJlYSBtYW5hZ2VyL3ZwXHJcbiAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VySW5mbyh0aGlzLm1hbmFnZXJVc2VySWQpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoIWpRdWVyeS5pc0VtcHR5T2JqZWN0KGRhdGEpKSB7XHJcbiAgICAgICAgbGV0IG1hbmFnZXJzID0gJ2YnO1xyXG4gICAgICAgIGxldCBhbWFuYWdlcnMgPSAnZSc7XHJcbiAgICAgICAgbGV0IHZwID0gJ2EsYixjLGQnO1xyXG5cclxuICAgICAgICBpZiAoZGF0YS5sZXZlbC5pbmRleE9mKG1hbmFnZXJzKSA+IC0xKSB7XHJcbiAgICAgICAgICAvLyB0aGlzLklzVlAgPSBJc1Nob3dUcnVjaztcclxuICAgICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy5tYW5hZ2VySWRzID0gdGhpcy5maWVsZE1hbmFnZXJzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbVsnaWQnXTtcclxuICAgICAgICAgIH0pLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAvLyB0aGlzLmdldFRlY2hEZXRhaWxzRm9yTWFuYWdlcnMoKTtcclxuICAgICAgICAgIC8vIHRoaXMuTG9hZFRydWNrcyh0aGlzLm1hcCwgbnVsbCwgbnVsbCwgbnVsbCwgZmFsc2UpO1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IC8vJCgnI2xvYWRpbmcnKS5oaWRlKCkgXHJcbiAgICAgICAgfSwgMzAwMCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxldmVsLmluZGV4T2YoYW1hbmFnZXJzKSA+IC0xKSB7XHJcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMgPSBbXTtcclxuICAgICAgICAgIHZhciBhcmVhTWdyID0ge1xyXG4gICAgICAgICAgICBpZDogdGhpcy5tYW5hZ2VyVXNlcklkLFxyXG4gICAgICAgICAgICBpdGVtTmFtZTogZGF0YS5uYW1lICsgJyAoJyArIHRoaXMubWFuYWdlclVzZXJJZCArICcpJ1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHRoaXMuZmllbGRNYW5hZ2Vycy51bnNoaWZ0KGFyZWFNZ3IpO1xyXG4gICAgICAgICAgdGhpcy5nZXRMaXN0b2ZGaWVsZE1hbmFnZXJzKCk7XHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZXZlbC5pbmRleE9mKHZwKSA+IC0xKSB7XHJcbiAgICAgICAgICB0aGlzLklzVlAgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gZmFsc2U7XHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvL3RoaXMudG9hc3RyLndhcm5pbmcoJ05vdCB2YWxpZCBGaWVsZC9BcmVhIE1hbmFnZXIhJywgJ01hbmFnZXInLCB7IHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSB9KVxyXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy90aGlzLnRvYXN0ci53YXJuaW5nKCdQbGVhc2UgZW50ZXIgdmFsaWQgRmllbGQvQXJlYSBNYW5hZ2VyIGF0dHVpZCEnLCAnTWFuYWdlcicsIHsgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlIH0pXHJcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGNvbm5lY3Rpbmcgd2ViIHBob25lIScsICdFcnJvcicpXHJcbiAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldExpc3RvZkZpZWxkTWFuYWdlcnMoKSB7XHJcbiAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VyRGF0YSh0aGlzLm1hbmFnZXJVc2VySWQpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5UZWNobmljaWFuRGV0YWlscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZm9yICh2YXIgdGVjaCBpbiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzKSB7XHJcbiAgICAgICAgICB2YXIgbWdyID0ge1xyXG4gICAgICAgICAgICBpZDogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQsXHJcbiAgICAgICAgICAgIGl0ZW1OYW1lOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLm5hbWUgKyAnICgnICsgZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQgKyAnKSdcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMucHVzaChtZ3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5Jc1ZQID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLklzVlAgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIud2FybmluZygnRG8gbm90IGhhdmUgYW55IGRpcmVjdCByZXBvcnRzIScsICdNYW5hZ2VyJyk7XHJcbiAgICAgIH1cclxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBjb25uZWN0aW5nIHdlYiBwaG9uZSEnLCAnRXJyb3InKTtcclxuICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGVjaERldGFpbHNGb3JNYW5hZ2VycygpIHtcclxuICAgIGlmICh0aGlzLm1hbmFnZXJJZHMgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VyRGF0YSh0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChkYXRhLlRlY2huaWNpYW5EZXRhaWxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGZvciAodmFyIHRlY2ggaW4gZGF0YS5UZWNobmljaWFuRGV0YWlscykge1xyXG4gICAgICAgICAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnB1c2goZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5wdXNoKHtcclxuICAgICAgICAgICAgICBhdHR1aWQ6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkLFxyXG4gICAgICAgICAgICAgIG5hbWU6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0ubmFtZSxcclxuICAgICAgICAgICAgICBlbWFpbDogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5lbWFpbCxcclxuICAgICAgICAgICAgICBwaG9uZTogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5waG9uZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICAgIFxyXG4gIGxvYWRNYXBWaWV3KHR5cGU6IFN0cmluZykge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy50cnVja0l0ZW1zID0gW107XHJcbiAgICB2YXIgbG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oNDAuMDU4MywgLTc0LjQwNTcpO1xyXG5cclxuICAgIGlmICh0aGlzLmxhc3RMb2NhdGlvbikge1xyXG4gICAgICBsb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0aGlzLmxhc3RMb2NhdGlvbi5sYXRpdHVkZSwgdGhpcy5sYXN0TG9jYXRpb24ubG9uZ2l0dWRlKTtcclxuICAgIH1cclxuICAgIHRoaXMubWFwID0gbmV3IE1pY3Jvc29mdC5NYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlNYXAnKSwge1xyXG4gICAgICBjcmVkZW50aWFsczogJ0FueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWonLFxyXG4gICAgICBjZW50ZXI6IGxvY2F0aW9uLFxyXG4gICAgICBtYXBUeXBlSWQ6IHR5cGUgPT0gJ3NhdGVsbGl0ZScgPyBNaWNyb3NvZnQuTWFwcy5NYXBUeXBlSWQuYWVyaWFsIDogTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLnJvYWQsXHJcbiAgICAgIHpvb206IDEyLFxyXG4gICAgICBsaXRlTW9kZTogdHJ1ZSxcclxuICAgICAgLy9uYXZpZ2F0aW9uQmFyT3JpZW50YXRpb246IE1pY3Jvc29mdC5NYXBzLk5hdmlnYXRpb25CYXJPcmllbnRhdGlvbi5ob3Jpem9udGFsLFxyXG4gICAgICBlbmFibGVDbGlja2FibGVMb2dvOiBmYWxzZSxcclxuICAgICAgc2hvd0xvZ286IGZhbHNlLFxyXG4gICAgICBzaG93VGVybXNMaW5rOiBmYWxzZSxcclxuICAgICAgc2hvd01hcFR5cGVTZWxlY3RvcjogZmFsc2UsXHJcbiAgICAgIHNob3dUcmFmZmljQnV0dG9uOiB0cnVlLFxyXG4gICAgICBlbmFibGVTZWFyY2hMb2dvOiBmYWxzZSxcclxuICAgICAgc2hvd0NvcHlyaWdodDogZmFsc2VcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAvL0xvYWQgdGhlIEFuaW1hdGlvbiBNb2R1bGVcclxuICAgIC8vTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZShcIkFuaW1hdGlvbk1vZHVsZVwiKTtcclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ0FuaW1hdGlvbk1vZHVsZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vU3RvcmUgc29tZSBtZXRhZGF0YSB3aXRoIHRoZSBwdXNocGluXHJcbiAgICB0aGlzLmluZm9ib3ggPSBuZXcgTWljcm9zb2Z0Lk1hcHMuSW5mb2JveCh0aGlzLm1hcC5nZXRDZW50ZXIoKSwge1xyXG4gICAgICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmluZm9ib3guc2V0TWFwKHRoaXMubWFwKTtcclxuXHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgbGF5ZXIgZm9yIHJlbmRlcmluZyB0aGUgcGF0aC5cclxuICAgIHRoaXMucGF0aExheWVyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxheWVyKCk7XHJcbiAgICB0aGlzLm1hcC5sYXllcnMuaW5zZXJ0KHRoaXMucGF0aExheWVyKTtcclxuXHJcbiAgICAvLyBMb2FkIHRoZSBTcGF0aWFsIE1hdGggbW9kdWxlLlxyXG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGgnLCBmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucycsIGZ1bmN0aW9uICgpIHsgfSk7XHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgbGF5ZXIgdG8gbG9hZCBwdXNocGlucyB0by5cclxuICAgIHRoaXMuZGF0YUxheWVyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkVudGl0eUNvbGxlY3Rpb24oKTtcclxuXHJcbiAgICAvLyBBZGQgYSByaWdodCBjbGljayBldmVudCB0byB0aGUgbWFwXHJcbiAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLm1hcCwgJ3JpZ2h0Y2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBjb25zdCB4MSA9IGUubG9jYXRpb247XHJcbiAgICAgIHRoYXQuY2xpY2tlZExhdCA9IHgxLmxhdGl0dWRlO1xyXG4gICAgICB0aGF0LmNsaWNrZWRMb25nID0geDEubG9uZ2l0dWRlO1xyXG4gICAgICB0aGF0LnJhZGlvdXNWYWx1ZSA9ICcnO1xyXG4gICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ3Nob3cnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vbG9hZCB0aWNrZXQgZGV0YWlsc1xyXG4gICAgdGhpcy5hZGRUaWNrZXREYXRhKHRoaXMubWFwLCB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyKTtcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgTG9hZFRydWNrcyhtYXBzLCBsdCwgbGcsIHJkLCBpc1RydWNrU2VhcmNoKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMudHJ1Y2tJdGVtcyA9IFtdO1xyXG5cclxuICAgIGlmICghaXNUcnVja1NlYXJjaCkge1xyXG5cclxuICAgICAgdGhpcy5tYXBTZXJ2aWNlLmdldE1hcFB1c2hQaW5EYXRhKHRoaXMubWFuYWdlcklkcykudGhlbigoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSAmJiBkYXRhLnRlY2hEYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHZhciB0ZWNoRGF0YSA9IGRhdGEudGVjaERhdGE7XHJcbiAgICAgICAgICB2YXIgZGlyRGV0YWlscyA9IFtdO1xyXG4gICAgICAgICAgdGVjaERhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5sb25nID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGl0ZW0ubG9uZyA9IGl0ZW0ubG9uZ2c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGl0ZW0udGVjaElEICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIHZhciBkaXJEZXRhaWw6IFRydWNrRGlyZWN0aW9uRGV0YWlscyA9IG5ldyBUcnVja0RpcmVjdGlvbkRldGFpbHMoKTtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwudGVjaElkID0gaXRlbS50ZWNoSUQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxhdCA9IGl0ZW0ubGF0O1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMb25nID0gaXRlbS5sb25nO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TGF0ID0gaXRlbS53ckxhdDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExvbmcgPSBpdGVtLndyTG9uZztcclxuICAgICAgICAgICAgICBkaXJEZXRhaWxzLnB1c2goZGlyRGV0YWlsKTtcclxuICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdmFyIHJvdXRlTWFwVXJscyA9IFtdO1xyXG4gICAgICAgICAgcm91dGVNYXBVcmxzID0gdGhpcy5tYXBTZXJ2aWNlLkdldFJvdXRlTWFwRGF0YShkaXJEZXRhaWxzKTtcclxuXHJcbiAgICAgICAgICBmb3JrSm9pbihyb3V0ZU1hcFVybHMpLnN1YnNjcmliZShyZXN1bHRzID0+IHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IHJlc3VsdHMubGVuZ3RoIC0gMTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHJvdXRlRGF0YSA9IHJlc3VsdHNbal0gYXMgYW55O1xyXG4gICAgICAgICAgICAgIGxldCByb3V0ZWRhdGFKc29uID0gcm91dGVEYXRhLmpzb24oKTtcclxuICAgICAgICAgICAgICBpZiAocm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcyAhPSBudWxsXHJcbiAgICAgICAgICAgICAgICAmJiByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTGF0ID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzBdXHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxvbmcgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMV1cclxuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTGF0ID0gbmV4dFNvdXJjZUxhdDtcclxuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTG9uZyA9IG5leHRTb3VyY2VMb25nO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGxpc3RPZlBpbnMgPSBtYXBzLmVudGl0aWVzO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0T2ZQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcclxuICAgICAgICAgICAgICB2YXIgdGVjaElkID0gbGlzdE9mUGlucy5nZXQoaSkubWV0YWRhdGEuQVRUVUlEO1xyXG4gICAgICAgICAgICAgIHZhciB0cnVja0NvbG9yID0gbGlzdE9mUGlucy5nZXQoaSkubWV0YWRhdGEudHJ1Y2tDb2wudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICB2YXIgY3VyUHVzaFBpbiA9IGxpc3RPZlBpbnMuZ2V0KGkpO1xyXG4gICAgICAgICAgICAgIHZhciBjdXJyRGlyRGV0YWlsID0gW107XHJcblxyXG4gICAgICAgICAgICAgIGN1cnJEaXJEZXRhaWwgPSBkaXJEZXRhaWxzLmZpbHRlcihlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRlY2hJZCA9PT0gdGVjaElkKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICB2YXIgbmV4dExvY2F0aW9uO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoY3VyckRpckRldGFpbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0TG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMYXQsIGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTG9uZyk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAobmV4dExvY2F0aW9uICE9IG51bGwgJiYgbmV4dExvY2F0aW9uICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBpbkxvY2F0aW9uID0gbGlzdE9mUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0Q29vcmQgPSB0aGF0LkNhbGN1bGF0ZU5leHRDb29yZChwaW5Mb2NhdGlvbiwgbmV4dExvY2F0aW9uKTtcclxuICAgICAgICAgICAgICAgIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHBpbkxvY2F0aW9uLCBuZXh0Q29vcmQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihjdXJQdXNoUGluLCB0cnVja1VybCwgYmVhcmluZywgZnVuY3Rpb24gKCkgeyB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLm1hcFNlcnZpY2UuZ2V0VHJ1Y2tGZWVkKHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsIHRoaXMubWFuYWdlcklkcykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMuc29tZSh4ID0+IHgudG9Mb3dlckNhc2UoKSA9PSBkYXRhLnRlY2hJRC50b0xvd2VyQ2FzZSgpKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBkYXRhKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgZmV0Y2hpbmcgdHJ1Y2tzIGZyb20gS2Fma2EgQ29uc3VtZXIuIEVycm9ycy0+ICcgKyBlcnIuRXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignTm8gdHJ1Y2sgZm91bmQhJywgJ01hbmFnZXInKTtcclxuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGZldGNoaW5nIGRhdGEgZnJvbSBBUEkhJywgJ0Vycm9yJyk7XHJcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgY29uc3QgbXRycyA9IE1hdGgucm91bmQodGhhdC5nZXRNZXRlcnMocmQpKTtcclxuICAgICAgdGhpcy5tYXBTZXJ2aWNlLmZpbmRUcnVja05lYXJCeShsdCwgbGcsIG10cnMsIHRoaXMubWFuYWdlcklkcykudGhlbigoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSAmJiBkYXRhLnRlY2hEYXRhLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICBjb25zdCB0ZWNoRGF0YSA9IGRhdGEudGVjaERhdGE7XHJcbiAgICAgICAgICBsZXQgZGlyRGV0YWlscyA9IFtdO1xyXG4gICAgICAgICAgdGVjaERhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5sb25nID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGl0ZW0ubG9uZyA9IGl0ZW0ubG9uZ2c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKChpdGVtLnRlY2hJRCAhPSB1bmRlZmluZWQpICYmIChkaXJEZXRhaWxzLnNvbWUoeCA9PiB4LnRlY2hJZCA9PSBpdGVtLnRlY2hJRCkgPT0gZmFsc2UpKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGRpckRldGFpbDogVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzID0gbmV3IFRydWNrRGlyZWN0aW9uRGV0YWlscygpO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC50ZWNoSWQgPSBpdGVtLnRlY2hJRDtcclxuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTGF0ID0gaXRlbS5sYXQ7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxvbmcgPSBpdGVtLmxvbmc7XHJcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMYXQgPSBpdGVtLndyTGF0O1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TG9uZyA9IGl0ZW0ud3JMb25nO1xyXG4gICAgICAgICAgICAgIGRpckRldGFpbHMucHVzaChkaXJEZXRhaWwpO1xyXG4gICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgIHRoYXQuZm91bmRUcnVjayA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHZhciByb3V0ZU1hcFVybHMgPSBbXTtcclxuICAgICAgICAgIHJvdXRlTWFwVXJscyA9IHRoaXMubWFwU2VydmljZS5HZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlscyk7XHJcblxyXG4gICAgICAgICAgZm9ya0pvaW4ocm91dGVNYXBVcmxzKS5zdWJzY3JpYmUocmVzdWx0cyA9PiB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSByZXN1bHRzLmxlbmd0aCAtIDE7IGorKykge1xyXG4gICAgICAgICAgICAgIGxldCByb3V0ZURhdGEgPSByZXN1bHRzW2pdIGFzIGFueTtcclxuICAgICAgICAgICAgICBsZXQgcm91dGVkYXRhSnNvbiA9IHJvdXRlRGF0YS5qc29uKCk7XHJcbiAgICAgICAgICAgICAgaWYgKHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMgIT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgJiYgcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxhdCA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1swXVxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMb25nID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzFdXHJcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxhdCA9IG5leHRTb3VyY2VMYXQ7XHJcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxvbmcgPSBuZXh0U291cmNlTG9uZztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBsaXN0T2ZQaW5zID0gdGhhdC5tYXAuZW50aXRpZXM7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RPZlBpbnMuZ2V0TGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHB1c2hwaW4gPSBsaXN0T2ZQaW5zLmdldChpKTtcclxuICAgICAgICAgICAgICBpZiAocHVzaHBpbiBpbnN0YW5jZW9mIE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZWNoSWQgPSBwdXNocGluLm1ldGFkYXRhLkFUVFVJRDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRydWNrQ29sb3IgPSBwdXNocGluLm1ldGFkYXRhLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyckRpckRldGFpbCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGN1cnJEaXJEZXRhaWwgPSBkaXJEZXRhaWxzLmZpbHRlcihlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQudGVjaElkID09PSB0ZWNoSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRMb2NhdGlvbjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VyckRpckRldGFpbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIG5leHRMb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxhdCwgY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMb25nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dExvY2F0aW9uICE9IG51bGwgJiYgbmV4dExvY2F0aW9uICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgcGluTG9jYXRpb24gPSBsaXN0T2ZQaW5zLmdldChpKS5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgbmV4dENvb3JkID0gdGhhdC5DYWxjdWxhdGVOZXh0Q29vcmQocGluTG9jYXRpb24sIG5leHRMb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHBpbkxvY2F0aW9uLCBuZXh0Q29vcmQpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdHJ1Y2tVcmwgPSB0aGlzLmdldFRydWNrVXJsKHRydWNrQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4ocHVzaHBpbiwgdHJ1Y2tVcmwsIGJlYXJpbmcsIGZ1bmN0aW9uICgpIHsgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBMb2FkIHRoZSBzcGF0aWFsIG1hdGggbW9kdWxlXHJcbiAgICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIC8vIFJlcXVlc3QgdGhlIHVzZXIncyBsb2NhdGlvblxyXG5cclxuICAgICAgICAgICAgICBjb25zdCBsb2MgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odGhhdC5jbGlja2VkTGF0LCB0aGF0LmNsaWNrZWRMb25nKTtcclxuICAgICAgICAgICAgICAvLyBDcmVhdGUgYW4gYWNjdXJhY3kgY2lyY2xlXHJcbiAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IE1pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoLmdldFJlZ3VsYXJQb2x5Z29uKGxvYyxcclxuICAgICAgICAgICAgICAgIHJkLFxyXG4gICAgICAgICAgICAgICAgMzYsXHJcbiAgICAgICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aC5EaXN0YW5jZVVuaXRzLk1pbGVzKTtcclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgcG9seSA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2x5Z29uKHBhdGgpO1xyXG4gICAgICAgICAgICAgIHRoYXQubWFwLmVudGl0aWVzLnB1c2gocG9seSk7XHJcbiAgICAgICAgICAgICAgLy8gQWRkIGEgcHVzaHBpbiBhdCB0aGUgdXNlcidzIGxvY2F0aW9uLlxyXG4gICAgICAgICAgICAgIGNvbnN0IHBpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKGxvYyxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgaWNvbjogJ2h0dHBzOi8vYmluZ21hcHNpc2RrLmJsb2IuY29yZS53aW5kb3dzLm5ldC9pc2Rrc2FtcGxlcy9kZWZhdWx0UHVzaHBpbi5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgxMiwgMzkpLFxyXG4gICAgICAgICAgICAgICAgICB0aXRsZTogcmQgKyAnIG1pbGUocykgb2YgcmFkaXVzJyxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICB2YXIgbWV0YWRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBMYXRpdHVkZTogbHQsXHJcbiAgICAgICAgICAgICAgICBMb25naXR1ZGU6IGxnLFxyXG4gICAgICAgICAgICAgICAgcmFkaXVzOiByZFxyXG4gICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHBpbiwgJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoYXQucmFkaW91c1ZhbHVlID0gcmQ7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNsaWNrZWRMYXQgPSBsdDtcclxuICAgICAgICAgICAgICAgIHRoYXQuY2xpY2tlZExvbmcgPSBsZztcclxuICAgICAgICAgICAgICAgIGpRdWVyeSgnI215UmFkaXVzTW9kYWwnKS5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICBwaW4ubWV0YWRhdGEgPSBtZXRhZGF0YTtcclxuICAgICAgICAgICAgICB0aGF0Lm1hcC5lbnRpdGllcy5wdXNoKHBpbik7XHJcbiAgICAgICAgICAgICAgdGhhdC5kYXRhTGF5ZXIucHVzaChwaW4pO1xyXG5cclxuICAgICAgICAgICAgICAvLyBDZW50ZXIgdGhlIG1hcCBvbiB0aGUgdXNlcidzIGxvY2F0aW9uLlxyXG4gICAgICAgICAgICAgIHRoYXQubWFwLnNldFZpZXcoeyBjZW50ZXI6IGxvYywgem9vbTogOCB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBsZXQgZmVlZE1hbmFnZXIgPSBbXTtcclxuXHJcbiAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLm1hcFNlcnZpY2UuZ2V0VHJ1Y2tGZWVkKHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsIHRoaXMubWFuYWdlcklkcykuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGRpckRldGFpbHMuc29tZSh4ID0+IHgudGVjaElkLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gZGF0YS50ZWNoSUQudG9Mb2NhbGVMb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgZGF0YSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIGZldGNoaW5nIHRydWNrcyBmcm9tIEthZmthIENvbnN1bWVyLiBFcnJvcnMtPiAnICsgZXJyLkVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ05vIHRydWNrIGZvdW5kIScsICdNYW5hZ2VyJyk7XHJcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBmZXRjaGluZyBkYXRhIGZyb20gQVBJIScsICdFcnJvcicpO1xyXG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGdldFRydWNrVXJsKGNvbG9yKSB7XHJcbiAgICBsZXQgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUhrbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUm1NMlZpTVdRdE5HSmxaQzFqTmpRMExUZ3pZbVV0WWpRNVlqWmxORGxtWW1SbUlpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdFeE5UQmxZVEV0TWpKaFl5MDNPVFE1TFRoaU5tRXRaV1UxTVRjNFpUQm1NV0ZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T21Zd1pXUXhaV00zTFRNMU9UQXRaR0UwWWkwNU1XSXdMVFl3T1RRMlpqRmhOV1E1WXp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkyUEM5eVpHWTZiR2srSUR3dmNtUm1Pa0poWno0Z1BDOXdhRzkwYjNOb2IzQTZSRzlqZFcxbGJuUkJibU5sYzNSdmNuTStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTBWREU1T2pBNE9qQXpMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzFaRFEyTURjMVppMDRNbVJtTFdZM05EQXRZbVUzWlMxbU4ySTBNemxtWWpjeU16RWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRWVU1UazZNak02TXpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21Ga1pqTmxZakZrTFRSaVpXUXRZelkwTkMwNE0ySmxMV0kwT1dJMlpUUTVabUprWmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhPVlF4TlRvME9Ub3dNUzB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NGRiN3ZqQUFBQ2UwbEVRVlJJeDkyV1RXdFRRUlNHbnpOemIzTFR0S0cxV2xId3E0dUNiWVgrQTEyNUVMY3V1aWhDUlhDcDJIM0JoU3YvZ1V2QmdsSnc0VUxCaWdwU2FVRmNpRkxGalNBdHNYNjFTZE0wdlhOYzlOb2tSWk9ZQVJYbk1xdTV6RFBublBlOE00R3E4cWRId0Y4WS94NzA2ck9KbnBUSXRhZGY3bysrTHkrVnJaaGtSWkw1WXpqRXhPbjFGNW1wc1VQbmJreU1UVDVxR3pwWG1SbFpMdWJIUDdLRTdVcG4ySzYvMURGVndXU2htRnNkZi9oMlpueUNTV2svdmZlNmU3NE52U2F6SjBmc0t2VnJkZm9Uekthd1hpb3lOLys4NUZmVEo3dW4zS2Njd2RraUZCc2RYb2xUSUhtRHpIYjUxYlRuY0E0WE9HSVJORlNrUVhkWm82ZzFaTG9qNndXTkJtUTA3TlZwOGluc2hpQU5ndFhWTW1GWHlJR2gvYWU4b0ErQzIvbkFXQXAzaE9CRDlNdS9OUWE2SGRualpZYlA5SjhHWnRxR0hoemMyMUZJclJIczJ5QW94dzFQTDFsRmcwMEcwa2N1QXBmYWhpNi9MTnpxN092bDVQbWpsSXRyYUNKWlFSQ3Q1bHBGeVVScDVtOHVNUDE1cW5UNXhKWDIwMXV1YktTemJxczdKSFkxWVNuVVFCRkZqUUVNWDlkV1BHMVFRbFVVUjR5cXJmcUIxcmVwS0RoaW5DaEk2QWZWUks2U2ZQVjI4SE92c0JnL3FCTkZoR1NieGxlZ2s2UU16dmVXVVdvTVFacnZKbXlMclcyb1FaQVl6Ry9jODk1UUVXa3B3QzB4bWVUQ2M1N3BSVnRsWXRRZ0N0WVhLaUswL29SeWlGSEVlQW9wZHE3RzVMVnBOYXZUSjFMVm1wcEtNK0hpV3RONFkyaGFMSW9tS2RZbVFrcjYyaGVxQXNZSzFnaGhGTzRBUzEzYUF3dGlEV3g2UW91MlpES2xISXR2VnFsVTFsSFZxaUZxblNNUWhTR3VaTkNPNWxKcUNCM2NkV3hsNGQycnp0bnJpeGhyY0FsMFp6cFVoVmdkVWRUSmNQOUl3UXQ2OThManZ2L21oZjhkdEdIbGg0djVSMUlBQUFBQVNVVk9SSzVDWUlJPSc7XHJcblxyXG4gICAgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ2dyZWVuJykge1xyXG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSGttbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TkRrNk1ERXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TkRrNk1ERXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdSbU0yVmlNV1F0TkdKbFpDMWpOalEwTFRnelltVXRZalE1WWpabE5EbG1ZbVJtSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaR0V4TlRCbFlURXRNakpoWXkwM09UUTVMVGhpTm1FdFpXVTFNVGM0WlRCbU1XRmtJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPbVl3WldReFpXTTNMVE0xT1RBdFpHRTBZaTA1TVdJd0xUWXdPVFEyWmpGaE5XUTVZend2Y21SbU9teHBQaUE4Y21SbU9teHBQbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJQQzl5WkdZNmJHaytJRHd2Y21SbU9rSmhaejRnUEM5d2FHOTBiM05vYjNBNlJHOWpkVzFsYm5SQmJtTmxjM1J2Y25NK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMFZERTVPakE0T2pBekxUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvMVpEUTJNRGMxWmkwNE1tUm1MV1kzTkRBdFltVTNaUzFtTjJJME16bG1ZamN5TXpFaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVFZVTVRrNk1qTTZNekV0TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPbUZrWmpObFlqRmtMVFJpWldRdFl6WTBOQzA0TTJKbExXSTBPV0kyWlRRNVptSmtaaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE9WUXhOVG8wT1Rvd01TMHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOEwzSmtaanBUWlhFK0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0lEd3ZjbVJtT2xKRVJqNGdQQzk0T25odGNHMWxkR0UrSUR3L2VIQmhZMnRsZENCbGJtUTlJbklpUHo0ZGI3dmpBQUFDZTBsRVFWUkl4OTJXVFd0VFFSU0duek56YjNMVHRLRzFXbEh3cTR1Q2JZWCtBMTI1RUxjdXVpaENSWENwMkgzQmhTdi9nVXZCZ2xKdzRVTEJpZ3BTYVVGY2lGTEZqU0F0c1g2MVNkTTB2WE5jOU5va1JaT1lBUlhuTXF1NXpEUG5uUGU4TTRHcThxZEh3RjhZL3g3MDZyT0pucFRJdGFkZjdvKytMeStWclpoa1JaTDVZempFeE9uMUY1bXBzVVBuYmt5TVRUNXFHenBYbVJsWkx1YkhQN0tFN1VwbjJLNi8xREZWd1dTaG1Gc2RmL2gyWm55Q1NXay92ZmU2ZTc0TnZTYXpKMGZzS3ZWcmRmb1R6S2F3WGlveU4vKzg1RmZUSjd1bjNLY2N3ZGtpRkJzZFhvbFRJSG1EekhiNTFiVG5jQTRYT0dJUk5GU2tRWGRabzZnMVpMb2o2d1dOQm1RMDdOVnA4aW5zaGlBTmd0WFZNbUZYeUlHaC9hZThvQStDMi9uQVdBcDNoT0JEOU11L05RYTZIZG5qWlliUDlKOEdadHFHSGh6YzIxRklyUkhzMnlBb3h3MVBMMWxGZzAwRzBrY3VBcGZhaGk2L0xOenE3T3ZsNVBtamxJdHJhQ0paUVJDdDVscEZ5VVJwNW04dU1QMTVxblQ1eEpYMjAxdXViS1N6YnFzN0pIWTFZU25VUUJGRmpRRU1YOWRXUEcxUVFsVVVSNHlxcmZxQjFyZXBLRGhpbkNoSTZBZlZSSzZTZlBWMjhIT3ZzQmcvcUJORmhHU2J4bGVnazZRTXp2ZVdVV29NUVpydkpteUxyVzJvUVpBWXpHL2M4OTVRRVdrcHdDMHhtZVRDYzU3cFJWdGxZdFFnQ3RZWEtpSzAvb1J5aUZIRWVBb3BkcTdHNUxWcE5hdlRKMUxWbXBwS00rSGlXdE40WTJoYUxJb21LZFltUWtyNjJoZXFBc1lLMWdoaEZPNEFTMTNhQXd0aURXeDZRb3UyWkRLbEhJdHZWcWxVMWxIVnFpRnFuU01RaFNHdVpOQ081bEpxQ0IzY2RXeGw0ZDJyenRucml4aHJjQWwwWnpwVWhWZ2RVZFRKY1A5SXdRdDY5OExqdnYvbWhmOGR0R0hsaDR2NVIxSUFBQUFBU1VWT1JLNUNZSUk9JztcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAncmVkJykge1xyXG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSDNtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRJNk1qRXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRJNk1qRXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TURWak16YzFaRFl0TVdObE9DMWtaalJsTFRnd1lqZ3RNamxtWVRSaFpqQTJaREUzSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaR1JtTUdJelltRXRNV05pWkMxaE1qUTBMV0V5WldNdE1UZzRZVGxrT0dSbE1qazBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPakF3TURKbE5EaGxMVGhtT1dVdE5qVTBZeTA1WWpRMkxUVm1ZV1prTVRCaE4yRTJOend2Y21SbU9teHBQaUE4Y21SbU9teHBQbUZrYjJKbE9tUnZZMmxrT25Cb2IzUnZjMmh2Y0RwbU1HVmtNV1ZqTnkwek5Ua3dMV1JoTkdJdE9URmlNQzAyTURrME5tWXhZVFZrT1dNOEwzSmtaanBzYVQ0Z1BISmtaanBzYVQ1NGJYQXVaR2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmp3dmNtUm1PbXhwUGlBOEwzSmtaanBDWVdjK0lEd3ZjR2h2ZEc5emFHOXdPa1J2WTNWdFpXNTBRVzVqWlhOMGIzSnpQaUE4ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQSEprWmpwVFpYRStJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKamNtVmhkR1ZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZOV1EwTmpBM05XWXRPREprWmkxbU56UXdMV0psTjJVdFpqZGlORE01Wm1JM01qTXhJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMVZERTVPakl6T2pNeExUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvd05XTXpOelZrTmkweFkyVTRMV1JtTkdVdE9EQmlPQzB5T1daaE5HRm1NRFprTVRjaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCs3U2RBd0FBQUFzcEpSRUZVU01mbGw3dHJGRkVZeFgvZm5abGROd21KR2tLSUNENGlJV0tsSW9xclZqNDZRVkJzZllENEgyaGhiWkFVMm9pSW5WcUlXR2hsSTZnZ0JsRjhCTjhoS29oRW9oSTFiamI3dVBlejJOSGRUZHpaWlNkbzRRemZiZVlPNTU3dm5IdnVqS2dxZi9zeS9JUExqM3I0OU00OWhzZHVKVm9HTDY3b0hDZGhBK05temhHVWJDRW5EN2N1bjlqVHVmckQyTEpldStYd3dlWkJiNTQ4c1hqRFpPNzBzbHh5WGI3RHBVUW9hNkZsV09jOFdmOW9ZblNzOSswRitsYWVBNmFhQnYxMGUyak5GNXZkdWE1L0pkYk9JRmxoQlRXSzFmemE5dWZEaXdyYmRud0JMamF0NlJ2RDRJK1dkbkNHZ3RQcTBuTFpJa0NDSjByUGxZY1B6c2N5MHQxUEgvdSsrVWJyMmswc1NUeWVHY1BBMWN1NVdLQ1pydTR6ODdIVG9NeFRhbFpTQmFSSWQ2RGoyOUtianNaeTc3Nyt2bFAyNVl0RE53SWZEWUlxSWFYQ1NFWU1NTTJTbkxHNzNvMWZpd1c2dTZkNzcvd0g5NHZYWHc1N1daRUtJSkFLUDNuT3A4UGxTVTk4NzFwMTVtd2lGdWp6a2RIOS9SMmR5UzJaSDNnSm56K2xsd0FPaC9vcEpsdVV6eU92RG5SQlpJc2xLZ2FQdGJYbXQyY0x3ZExOYWV6Q0JlRGNyQzFUWW13aG1VSmVqM0RweVdPT3FFclRUQ1dUTGJaNnlhRE5HSnhVQ1ZuRlZNVmc4RkR4U0VBMlZuc3hCc1ZndzZKR1Y0eDFxSEdJay9qWjZ3QW5KWUtpMVNsVUZVNENpSUNVM29uSEZGQlZTbmZac2JOQkZSVkZhT3lZakF3SFQ4RlpDMW9iTU55cGdHQ2RhK2lzOU91dlNGQTBIRFZLaUhEZVhMVDNONUJFTk5nQWpabW9JVkFKaDErNjFXSmE4dEljdU5jVHJVUkZOSUtwQ0lqTWphWUZWU3dPRThIVWQ0cFR4VGI0a1ZlM3ZRZ0lJY3VvZEZOcFdOWG9HSlF3RDR3Qno5Uk1CNmNPTVZKYVhGelFoQXF0bnVCbE01aEpIN1VXQ2RzK3k5TUpoeWtXQ0Jvd1V5Um96bG52dmJPTURnMVZnWmh3WjhvTTdnSHdHYnhZb09tQjQxOU5NZCtHeXhVVTU3UWlDaXBQdUZJSkJ0OXNERkpUZFczeTMveFcvQVJOcGp2eGw4MHVMQUFBQUFCSlJVNUVya0pnZ2c9PSc7XHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ3llbGxvdycpIHtcclxuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUlLbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5UZzZOVFV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5UZzZOVFV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUTRNakZrWmpNdFptRmxOQzB4TWpRekxUbGpaVFV0Wm1Ga04yRTJNVGRtTlRVM0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpVd04ySXhZbU10TkRCa1pTMHdaRFF5TFdJd1pUY3RNR1U0TmpObU56VmtOakEwSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEbzRNemN4WTJVMllTMHhZV1prTFRFME5ETXRPVGd4WkMxa04yRTROR1kxTm1VMFpXVThMM0prWmpwc2FUNGdQSEprWmpwc2FUNWhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpCbFpERmxZemN0TXpVNU1DMWtZVFJpTFRreFlqQXROakE1TkRabU1XRTFaRGxqUEM5eVpHWTZiR2srSUR4eVpHWTZiR2srZUcxd0xtUnBaRG80T0dRek5UWmhOeTAzTVRneExXVTFOR0V0T1RsbVpTMDBPREJsTXpWaFl6WTJaalk4TDNKa1pqcHNhVDRnUEM5eVpHWTZRbUZuUGlBOEwzQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSGh0Y0UxTk9raHBjM1J2Y25rK0lEeHlaR1k2VTJWeFBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpWTNKbFlYUmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG80T0dRek5UWmhOeTAzTVRneExXVTFOR0V0T1RsbVpTMDBPREJsTXpWaFl6WTJaallpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UUlVNVGs2TURnNk1ETXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qVmtORFl3TnpWbUxUZ3laR1l0WmpjME1DMWlaVGRsTFdZM1lqUXpPV1ppTnpJek1TSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TlZReE9Ub3lNem96TVMwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdRNE1qRmtaak10Wm1GbE5DMHhNalF6TFRsalpUVXRabUZrTjJFMk1UZG1OVFUzSWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTVWREUxT2pVNE9qVTFMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BuZXdZNlVBQUFKRVNVUkJWRWpIM1ZZeGF4UlJFUDYrOS9heXVkVUlrU05uQ0FvUmxZaUlXZ21DaFJEc1JVdGJDMytBbHNIV3dsWWJpMWhwWXhFRW0xaXBNUkJSRVVROGdvMlNIQ2tpM2wyNDNON3V6VmdrSm5mSHVidTVGeEp3NExIRnpzNDM4MzN6Wm9lcWlyMDJnMzJ3ZlFIMWtsNVdWbitWdjN5NEZ4dzc4a3dPRFIyRXlJWVUyaVAxOVZEd2MrV2lHVDkxdjE0Y0hSOU5pc3NrVGFjZlhHdGNuWHpyRjBaK0l3elo5bFUzdENESWU1aDkxY1NhWEFwdjNKd2I3SnZlVDU4L3l0SnlEYW9XYkQ5aVFmRzJEdFNEVWhERkZxVnZKWEhTZEhwR01MOUErRUZ5RUFWaFNVVHhBQjQveWJ0cDJsQkJzd1hBRXRacU83ZGRtU3RvRmJSQUxRcmRRR2RuSHFKVnZZMXF0UUxHQnY5U24xRFVRb1ZxQTFOM2I2V0NNbTA0dkg2UjE3bUZZUWdEV0x0TmFFZWxhbUFOY081TUdaUFgxK2dFK3ZUUlVXMjJobEE0L0FOeFJORDJ2RENnS093QU1IRkM4ZnpsMlBxZHFjV2diM3BQbjZ4aHRUNk9rV0lSS2dyVm5wS0NDbmcrOFdaK0JXT0ZpcHVtVVd3UVJ6SE9uajhPU01xTXpnK2d2TlJDNGNDeUcrZ1drK3NSNHBZa3V1VUl4RkdNTURTT29HeDdNc1dQdXpSN3Q2dE5pYW85RXUwWFZEdm1yS1l6b3J0VXFUSmpwWnVkcmE2Z1pIZlVoRUwxYjRLdTlITG5uY0lNYm9uOWJWUkJFRHZabzlRVkZKcXRQdDBjU3dSaE1pVG9wWEZGQXBxbGU5bGpvZWl2ZTZWTm8vVHVKYk9KbWdocVFmaStCMlRVZEFOUEhLK01XdjIrMk9UbEt4Nk1tRVJHTUppRDczdXdvSEVDSFM3Nks4VjZJWGovTGhJVmR2ekt1aTNuQTZXdkRYTmh3dGFkTjRmL1pzUC9Bd3p0NVIzYnNRMmpBQUFBQUVsRlRrU3VRbUNDJztcclxuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAncHVycGxlJykge1xyXG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSDNtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURNdE1ESlVNVEk2TWpBNk16TXRNRFU2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURNdE1ESlVNVEk2TWpBNk16TXRNRFU2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WWpWbVltVTNZall0WkdRMU9DMWpOelJpTFRobVpHWXRZakprTmpVMU5UWTNPVEUwSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaakF4Tm1abU5qY3RZV1l4WkMwMk1UUTVMVGd6TWpRdFpETTBPR1kxTnpnMFpUazBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPakF3TURKbE5EaGxMVGhtT1dVdE5qVTBZeTA1WWpRMkxUVm1ZV1prTVRCaE4yRTJOend2Y21SbU9teHBQaUE4Y21SbU9teHBQbUZrYjJKbE9tUnZZMmxrT25Cb2IzUnZjMmh2Y0RwbU1HVmtNV1ZqTnkwek5Ua3dMV1JoTkdJdE9URmlNQzAyTURrME5tWXhZVFZrT1dNOEwzSmtaanBzYVQ0Z1BISmtaanBzYVQ1NGJYQXVaR2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmp3dmNtUm1PbXhwUGlBOEwzSmtaanBDWVdjK0lEd3ZjR2h2ZEc5emFHOXdPa1J2WTNWdFpXNTBRVzVqWlhOMGIzSnpQaUE4ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQSEprWmpwVFpYRStJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKamNtVmhkR1ZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZOV1EwTmpBM05XWXRPREprWmkxbU56UXdMV0psTjJVdFpqZGlORE01Wm1JM01qTXhJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMVZERTVPakl6T2pNeExUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwaU5XWmlaVGRpTmkxa1pEVTRMV00zTkdJdE9HWmtaaTFpTW1RMk5UVTFOamM1TVRRaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCszNDEzandBQUF1cEpSRUZVU01mbGw4OXZWRlVVeHovbjN2dW0wNExsVjhEd2ExR1JOb1M0d0tZUTQwcHdSUWc3b3dsdWNDRWJOcXp3RDJDSEN6ZktRbGVXeEJCV0pwQzRRellFUThMQ0tLTFNBRldVU0pCU3kwdzc3OTV6WEx3cG5hWXowenF2MFlWbmNpZVpuSnYzdmVmNy9aNXozNGlaOFcrSDR6K0kwQzE1Y2Z3U0QyOWVxZVFYWG5tNU5yMnBJbG5TcGFjV0dyRXV6L1plZVRLNjY5aURxYUhmMG9rejcvUU9ldU96bXp1R3B0NzhlR3NhR3RPMWpYNG44bHdMYThJcm9FR2xPams2TVpNOUdHZllQZ1ZxUFlOT1huLzY2dnJHMDZON2RtNGcxN1FvWnkzQ1pBTEVOQnB2cmQ4bWI4dzhCczczck9tanl2MnpzLzAxb2dsUjQ2S1ZiR0hWVTZJUllDSjh2L1hxajE5OVhzcEkzODE4TTF3UDA5YkNhdHVvQUk0KzdsZHVjLzdyVCtaS2djYU45WE12NkxwWkFUS3JkbHllUGpLQkY5UG1QMTdiOS9vSHBkeDdlTWRiSDZWYjZmMXZCNjZpWWtoTFRxejRaWUFpVktPd3FiWXo3ZjM1NkplbFFBOE9Ibms3ajJ2aUR6OWQ4MUhtV0F5N0VMbDNET2FEYkdmMzVpT25EMVpLZ2Q3NVplTDRsakRTOTFJY28ySjlHTnBtbDRBcWlQQ1hUVE01ZWZjOUdPMUtzWFFiZysvS3FjWUlZOW5JOEFpeUlTKzRuRytaSnIyQzRCV3MzOGp2QkM0Ly9JSngrMUI2cm5TV3VaZ3hrUFhMR3B4RlJLVk5uWUtKb1NxSWVRSlp2UlM5Z2tNeG9pU2NKS1REK1UwZG1pQ1pLejk3RlMxME5Dbm83S0NFaUlFQW9taGIzWHU2WlF5anMvYk9ESEVHck95YVhBWlVpT1NZRmRwMVpNUVZ1YVFKdDRJNlhQZWt3NXAxZHJPajErSkl4YmlVMWFEWFdyN2JSM0xHUDNuL0NNdHRFQVFSOEFMV1lmQTdCV3Z1S3cyYUVmQk5NcEl0ek5zbGxRb0ZvSFRYZm9WOVdoZ0p0R3Vsb2dHMWhKcXVEcjIrc0FqSnJHT2xVSXpmVmRIVU5ha1NaN2dBRmp0NUxlRzl6RHVnTEdoR2xRR2s3cEVna09ZZjYxcjhMSWdKV29Hc1lRU3ljcUFOWnYwamZ1WDNlM2VmVHlScGZ0bzFpU2N3elorK0ZPaWhrd2VtZk1PdkRYUGtUazNuZ1ZSMFNTK3JHQ21JRzY3dXJ5M2JoditidnhWL0E4c1ZRQWc4K2dEWUFBQUFBRWxGVGtTdVFtQ0MnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVja1VybDtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRNaWxlc1RvRmVldChtaWxlcykge1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQobWlsZXMgKiA1MjgwKTtcclxuICB9XHJcblxyXG4gIHB1c2hOZXdUcnVjayhtYXBzLCB0cnVja0l0ZW0pIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgdmFyIGN1cnJlbnRPYmplY3QgPSB0aGlzO1xyXG4gICAgdmFyIHBpbkxvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRydWNrSXRlbS5sYXQsIHRydWNrSXRlbS5sb25nKTtcclxuICAgIHZhciBkZXN0TG9jID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRydWNrSXRlbS53ckxhdCwgdHJ1Y2tJdGVtLndyTG9uZyk7XHJcbiAgICB2YXIgaWNvblVybDtcclxuICAgIHZhciBpbmZvQm94VHJ1Y2tVcmw7XHJcbiAgICB2YXIgTmV3UGluO1xyXG4gICAgdmFyIGpvYklkVXJsID0gJyc7XHJcblxyXG4gICAgdmFyIHRydWNrQ29sb3IgPSB0cnVja0l0ZW0udHJ1Y2tDb2wudG9Mb3dlckNhc2UoKTtcclxuICAgIGljb25VcmwgPSB0aGlzLmdldEljb25VcmwodHJ1Y2tDb2xvciwgdHJ1Y2tJdGVtLmxhdCwgdHJ1Y2tJdGVtLmxvbmcsIHRydWNrSXRlbS53ckxhdCwgdHJ1Y2tJdGVtLndyTG9uZyk7XHJcblxyXG4gICAgaWYgKHRydWNrQ29sb3IgPT0gJ2dyZWVuJykge1xyXG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUZHbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdOUzB3TVZReE5qb3hNVG94TUMwd05Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1qQXRNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TWpBdE1EUTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVGRrWmpFMFltUXROREJoT0MwMU5EUmpMVGt6T1RBdE0yUmlObVprWVRabU1tSmxJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNk1HRmtNMkl5WkRJdE9EQmhOaTB4TURSa0xUaGlOelF0WmpWaFpERm1NVGhsWXpFeUlpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9UZGtaakUwWW1RdE5EQmhPQzAxTkRSakxUa3pPVEF0TTJSaU5tWmtZVFptTW1KbElqNGdQSGh0Y0UxTk9raHBjM1J2Y25rK0lEeHlaR1k2VTJWeFBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpWTNKbFlYUmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG81TjJSbU1UUmlaQzAwTUdFNExUVTBOR010T1RNNU1DMHpaR0kyWm1SaE5tWXlZbVVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGd0TURVdE1ERlVNVFk2TVRFNk1UQXRNRFE2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpTHo0Z1BDOXlaR1k2VTJWeFBpQThMM2h0Y0UxTk9raHBjM1J2Y25rK0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBpQThMM0prWmpwU1JFWStJRHd2ZURwNGJYQnRaWFJoUGlBOFAzaHdZV05yWlhRZ1pXNWtQU0p5SWo4K09kdUszUUFBQXc5SlJFRlVhTjd0bWoxUEcwRVFodThudUtlaERKMHJsTkpTSkdwSHBDV3lsRFlGNmFBQlY2UWlRUUtsU1JSTUZTVUZwcU5CbUFvRUJhUWdwRFRpUTVRR21wU2JlOUZ0TkJuMnpudDNPOGQ5ZUtTUmJUanR2dmZjN3N6YzducWVrQ21sMnFyWWR1SjdUUXBPUS9keS8rZGVmVG5ZVU11OXRkdzdkRUl2c2E0VW9DM2R3OVNubDJwczRWbGhISHFwSlFWUTkvMmo3ejNmQjJGajlOZk43MExCMFg3UVAwb0dLQURUczUzRTZLZ3lnUHhyRnprQXpGYzBSaDJqcG5LQS9PdlcrY2g0OCsydHNmRlg2NityQllqRFdkeCtIOWw0cFFCeE9PKzY4ME1icnd5Z0pIQXFBeWdwbkVvQVNnT245SURTd2lrMUlQLzdTbG80cFFYa2Z6WmR3Q2t6b0w0TE9LVUVSRWZQajVOdTZzYkxDS2lqZnp6LzhHSUV5QUFJSzJmcWNuRHRwUEV5QW5KNk15TkFReHpUbEpxTGFadWxUeXhOcWp1eTdPcEpQRzI2Sm5ReHVGS3ptM05xK3V0TTdoMDZvZmUvSlZjSlFIU2FGZHhtUGFsNGdYcUs3UkFVemJaMGtTZ1dVREdmc2NDRytvb3Z6ZWJSbWJYRkFSWE5SNEN5QklUcG95TS9Qdk8wUVlqU2dtcXpMVFdjQUVKbjM0ODNqVkVOS1hKNWQvWEp3R0NuNVpTVUdOVDIrNGNQMlZVVUVETFRuVVZtZ2tpTXNDemhoRDAwYnAvM04yUUE0ZW53YldWa0tEd1ZPTi80enhJU2g0TjcwZHFnRzFtVWFzUDFUZ0h4OGp0c2J3elgwU3JheGZLSnphaTJXZXhEYUtEYVROUHRVWkZvQ3doSFEydzNEZ0VKS3dOWnZZdlJWNE00Mms3WndRcEQ5ZC9RZ1BhRzNZd1dZYnNrUXFmak1OR3VqcXJZYXFNamp0NHZRZ1N6Y1Eyb3BmK3lmYmJ6S0c3Z3R6WTBFcmVta0t5djZNaTIxVWJ2UjU4djRHZUNNR2o0ZHM5UC9SL0VHa1I2cEdzNERZQVFaQ3RleHl5ZCtpVWNxVHVKTnByNlE3SmZuUU9xVVVoaGxtUUVaV1ZKQUlWWUsyeTd1Ulljdkx5TnFtL3l1dHhocTQyWEsvVHQvVjlndGp5RVNiMFRaMXVJRHYwZ0NUUUV2UjJWdXJtelN2czhhS09XOWxEbU9JMVJVVUlNYzdydUNWdHdvdy9hb3Q0SkRkcGFZdWVlMFJsZUJKRVZJTXEwWE9sVVFMUzJaZ0p0SFFraEt6SENRdHZMMEdpNVltRWQ2YWQxSHRINW5uV3djNit0VGd0ZmcwRjNNMDZiZndHNFR2OFh5K2hQYUFBQUFBQkpSVTVFcmtKZ2dnPT0nO1xyXG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICdyZWQnKSB7XHJcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXJDQVlBQUFEYmpjNnpBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRkVtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd05TMHdNVlF4TmpveE1Ub3lNUzB3TkRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1qTXRNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1qTXRNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WmpBMVkyVm1ORGN0TTJOallpMDNZalEyTFdJMVpqUXROMkk1TURBd01qZzFNamxsSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT21Zd05XTmxaalEzTFROalkySXROMkkwTmkxaU5XWTBMVGRpT1RBd01ESTROVEk1WlNJZ2VHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT21Zd05XTmxaalEzTFROalkySXROMkkwTmkxaU5XWTBMVGRpT1RBd01ESTROVEk1WlNJK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZaakExWTJWbU5EY3RNMk5qWWkwM1lqUTJMV0kxWmpRdE4ySTVNREF3TWpnMU1qbGxJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakV4T2pJeExUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUHBLcGNLY0FBQUw0U1VSQlZHamU3WnJOU2pNeEZJYm5FdVlTdW5iVm5WczM3c1ViY0c1QTZOWnVuS1U3WGVqYTZnMjBGMUN3NjI0VVFTd0kva0JGRUlwRlFSQ0VtTGMwY25xY1RETXp5VGcvUFhBKzlXTkkzanhKVGs1K1BNK0JDU0ZDVVc2N2xPNTdqdUJzcUZxKzM5L0Y2L201ZURrNUtieERKL1FTNjdvQzFGTTFqTGEzeGVYYVdta2NlcGsxMGdCb1NqK1VmaUg5VFRkR1AwZWpVc0ZSL2pFYzBtYUVTY0ZjbUU1aVZGUWJRUExEZlE0QTh4V0ZVY2VvcVIwZytkRXBIeG4zdTd1UmhkOEZRYjBBY1Rqamc0UFl3bXNGaU1ONWFyZVhGbDRiUUduZzFBWlFXamkxQUpRRlR1VUJaWVZUYVVEeWw2T3NjQ29MU1A2elpRTk9sUUU5MklCVFpVQXptL1I2bVF1dk5LQ2J6YzBWSUIyZ3IrZG5LNFZYRnBDdHhxd0FMWEZNVTJvMnBtMmVmcjIrem85ZFc1N3QzcVpuUWwvanNYamEyeE4zT3p1RmQraUVYbWErZFVCMG1wWGNXaXFMdGg0dmtFK3hvVm8yNjlFOW1KT0Fpdm1NQXpia1YveG90b2pPTEhRT3FHeStBcFFuSUV3ZkZmbnhzMGdYaEVndHFEYlRWTU1LSUZRMjZYWWpveHFXeUpmajQzOERnNXVXejl0YjdSMGRWbGVuZ0V4WEpvakVDTXNUanE3VHVMMmVuYmtCaE43aDE4cFlvZEFyY0g3eG55Y2tEZ2R0VWRxZ0c2c28xWWJ2clFMaTZiZnViZ3pmMFN6YXh2R0p5YWcyT2V4RGFLRGFvcVpiWkpKb0FnaFBRMHd2RGdFSkp3TjU3Y1hvMWlDSk5vendKZG4veGdLZ3VNWW9FYVpISW5RNkxoTnQ2Nm1LcVRZNjRtaDdFU0swejE3VS8wejcvVDl4QTMvL0JqaFpTTktjd21WK1JVZTJxVGJhSHZXK0lPSk4wSURmaFYwdHZBaVRrUjdMTlp3R1FBZ3lGYTlpbGxyNlhUamRIaVRSUmp0UHMvbzFPU0NmUXRJdWtTbEdVRjZXQnBER0F0MWR2RDkvZURtTnkyK0tldHhocW8ybkszVDN2aENZRFI1aFV1OGt1UlppTytOQlJIazJQWXhidXY4YzVpMW0yby96TXZ5c2p6SWJORWJGQ1ltWTAwM1BzYzBiT3RNV3R5ZU0wQlk0ZS9lTXlyQVJ4S29BVVpyanlzREx3ZmpOc0tHMmpnc2hSd25DUXVqbGFPaU1CTm82cm52ck1hYnlnWEd3czYrdE9hOWZaOUM5bGJUY0h4SEJ4QjdKNmVUVkFBQUFBRWxGVGtTdVFtQ0MnO1xyXG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICd5ZWxsb3cnKSB7XHJcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXNDQVlBQUFER2lQNExBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRkVtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd05TMHdNVlF4TmpveE1Ub3dOaTB3TkRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1Ua3RNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1Ua3RNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RBeU5ERTRZMkV0TlRNek5DMDROalJqTFdGaE5tRXRZVEpsTkRrMlltVTFZbUU0SWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2prd01qUXhPR05oTFRVek16UXRPRFkwWXkxaFlUWmhMV0V5WlRRNU5tSmxOV0poT0NJZ2VHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2prd01qUXhPR05oTFRVek16UXRPRFkwWXkxaFlUWmhMV0V5WlRRNU5tSmxOV0poT0NJK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVEF5TkRFNFkyRXROVE16TkMwNE5qUmpMV0ZoTm1FdFlUSmxORGsyWW1VMVltRTRJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakV4T2pBMkxUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUG5LYkk1WUFBQU1KU1VSQlZHamU3WnE5U3NSQUVJRHZFU3g4QU1FWE9Id0I3d25VSjVCN0FBVjdDNi9WUmt1dHZNNVNRUVFiT1FXMXNmQkFMU3o4NFJvYndiUFFRc3l0TTJzMlRqYWJaUE96YTM1dVlGQlFzcE12c3pPenM5Tm9XQkRHMkFUb2JBbTAyYkFwc09BQzZCTXJsN3lCcnVGSE5RMm53OG90MThZZ3dZTmIzakpmNzh4NTNHSE8vVWJ4RmV4RWU0bnNtd0owSUZad3pscnMrM0N5TklyMlVra0xvQW02Q2Rwejk2eFNSdSszcFlJamRQUjZrUTZRQzZhbnU0bHhvZG9BY2lPN1gyQy80c044Q2w1VE8wRHdmN3V5WnpoWGkrbzlmRGxmTDBBQk9IZXIwVUd1VG9BQ2NQckw4Vm1nTG9EU3dLa05vTFJ3YWdFb0M1ektBOG9LcDlLQTRQZXRySEFxQzhodFMyU0dVMlZBVDNuQXFTUWc2ajJqd1Y3MjAzQUZBWFc5MXNUSnpCaVFBdEExLysxemtFOC9wWUtBY24yWk1hQTRRTEJOcWVTeGJhM3E4VFJqWDBOemdQZ1hJRDBoOWpGZ1RuOEpQR3V1K0FwMm9yMitscXNKUUhTYmxWeFdHcWJpQmRaVDBnMUIyZVJBRklubUFpcnNaMnl3WVgwVmFNMFdVQ1hwbUFkVU1oMERzZ29JdG8rSS9QeG5nUzRJc2JUdzJhWlphdVFDQ0JmRG1LSVVTSkdqKy9YL0EzTzFDQ1hHVGNnZDNUblBya1lCL1dhbVlmeUZJUmlKSG1hMStnMzdhSkk0RDl0bUFPSFhrYStWTVVQaFYrRXFYZnpiaENURDRWbEoySVplaFgrbnRvVjBMZElEa3NydjBMc3hUT3YwWmpXSDlvbVdWMnMwKzNob0lMYXB0bHVnU05RRmhLTWh1aGVISE9ibndOcFpqQjROa3RqR1BUeTYrbThKUUtkeEwrTVpvZGtTb2RzeDF1aThSbFUwYmFNZVI5K1hod2kvVEFsQWJlOWxYbzZDY1FPcGl3ZkNRNUxXRkNicksrcloycmJSOTNIbkMrU1pJSFFhK2Jxbi96ZXhNZVNSSHRNMVZ4SUEwU0J0UUNKbXVhbmZpRUxxVG1VYlNmMGgyYStwbWtMdHg2YklGQjVrUzlJQUNwRjIxS2d1RGw0T0krdWJnclk3dEcyVHloVjZldmNDcytZUUp0VnVrbXNoNnZwdUVtZ1oxRTVVNmc0MjgzeVY5clA3akltc1E1bFR2aGdWWVloaVR6Y3R6R00vZTdaRm5Ba1Z0cldOelQzalluZ1E1SWRXTUVyVnJzelZnUGlCOWFTMmRVMFlzcFVnTEhRc1QvVzNFOWltRGVjSFJqeFNtSyticWZ3QUFBQUFTVVZPUks1Q1lJST0nO1xyXG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICdwdXJwbGUnKSB7XHJcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXJDQVlBQUFEYmpjNnpBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBR3RtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd015MHdNMVF4TVRvek1Ub3dOQzB3TlRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk5Ea3RNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk5Ea3RNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TURrd1lUQXdaVFl0T1RObVppMWtZalExTFdJeE1qRXRNMkkxTXpCbU4yWXlaVFF3SWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZOVEprTVdRd01EZ3RZV014TXkwM01EUTVMVGxtT0dNdE9UaGlOVGN4WkRJellqSTBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZZekkwT1RnME1HVXRNbUprTVMxa1pEUXhMVGcwWTJJdE1XUTBZalJqTnpWa01Ea3hJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwak1qUTVPRFF3WlMweVltUXhMV1JrTkRFdE9EUmpZaTB4WkRSaU5HTTNOV1F3T1RFaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1ETXRNRE5VTVRFNk16RTZNRFF0TURVNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPakptTXprM01qRTRMVGxtTURVdFpUYzBNQzFpWTJZNUxUTmlNbVZqTXprNU1EUTNNaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhPQzB3TXkwd00xUXhNVG96T1Rvd09DMHdOVG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGljMkYyWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1Ea3dZVEF3WlRZdE9UTm1aaTFrWWpRMUxXSXhNakV0TTJJMU16Qm1OMll5WlRRd0lpQnpkRVYyZERwM2FHVnVQU0l5TURFNExUQTFMVEF4VkRFMk9qRTFPalE1TFRBME9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQnpkRVYyZERwamFHRnVaMlZrUFNJdklpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QZ1lvSTRvQUFBTDlTVVJCVkdqZTdacTdUaHRCRkliM0Vmd0lQSUlmZ1RmQU5aV3IxTzZEaEx1VVFCc3B5blpXaW5BTERVaGdGMGdrVWlRaWgyWWIxa1Vva0pDTUVBVlV5LzdJQThmSHM3dXp1M00yZS9HUmpuelJhdWJmYjJiT25MazRqcEFGUWRBUHFtMlhvYmVrNEt5cVdwNGVuNFB4b1JmOEhseVYzcUVUZW9udFNRSGFWelY4N3gwSG45ZStWY2FobDFwV0FPM1F0MElmaGo2TjZxTjMvclJTY0pUZi9MM05CbWdHWm1nNmlGRlJZd0NGejI1eUFCaXZLSXc2ZWszakFJWFBmZVU5NCtUVHViYndvNDFoc3dCeE9CZGZMbU1MYnhRZ0RtZTA4eXV4OE1ZQXlnS25NWUN5d21rRW9EeHdhZzhvTDV4YUF3cS9iK2VGVTF0QTRXZkhCcHc2QS9KdHdLa2xJTnA3dkRNL2QrRjFCT1NxSDRNUFIwdEFHa0RZT1FzZWJoK3RGRjVIUUZaZlpna293VEZNcWRrWXRrVzZ1NzQ3dCszcVNMUTIzUlBDME1YTStPUGpXZWtkT3FGM2JzdFZBaEFkWmhXM25pTVZMOUFhN0lTZ2FyYXZra1N4Z0lyeGpBMDI1RmQ4YTdhTXpxd3ZEcWhxdmdSVUpDQU1IeFg1OFZtbUEwS2tGbFNiYWFwaEJSQXE4MDU5YlZUREZJa2ozUDhGQmljdGQ5ZlR5RE02eks2aWdFeG5Kb2hFRHlzU1RsU2pjUnNmZURLQTBEcjhXQmt6RkZvRnpnLytpNFRFNGVCZGxEYm94aXhLdGVGNXE0QjQraDExTm9ibmFCWnRZL3ZFcEZlYmJQWWhORkJ0dXVHMmtDU2FBa0pjTVQwNEJDU2Fya3V2eFdoZGFiU2hoeWRrLzZzSzBDanBaVlNocGxzaWREZ21pYloxVmNWVUcrMXg5SDBSSXBpdEtFQmQ5WS8vODk5QzNNRHZ0d0IzNktYT0tTVHpLOXF6VGJYUjkxSDNDL2lkSUhRYWZ0enpaKzVHMk1IN2pUQWFBTk5NNFNwbXFhbGZ3dW55SUkwMjJuZ1JzMStiQTJwUlNKRlRaSVllVkpSbEFSUmgzYWpqNXRiczR1VjlYSDVUMXUwT1UyMDhYYUdyOTdmQWJIZ0prN3FiNWxpSXJZeEhtdkpzZWo5dTZsN1l6SnZQdENlek1scDVMMld1MEJnVkowUXpwdHVPc00xZTlGVmIzSnBRbzYwcmR1OFpsV0VoaUZrQm9uVGJsVllGeEd2clpORG1TZ2paVGhFVytrNkJSdE1WQTNPbFcyc1NVL25JT05qWjE5YW1pYS9Hb0x1VHBzd1hvYVR3c25LQWtkRUFBQUFBU1VWT1JLNUNZSUk9JztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZmVldGZvck1pbGVzID0gMC4wMDAxODkzOTQ7XHJcbiAgICB2YXIgbWllbHNUb2Rpc3BhdGNoID0gcGFyc2VGbG9hdCh0cnVja0l0ZW0uZGlzdCkudG9GaXhlZCgyKTtcclxuXHJcbiAgICB0aGlzLnJlc3VsdHMucHVzaCh7XHJcbiAgICAgIGRpc3BsYXk6IHRydWNrSXRlbS50cnVja0lkICsgXCIgOiBcIiArIHRydWNrSXRlbS50ZWNoSUQsXHJcbiAgICAgIHZhbHVlOiAxLFxyXG4gICAgICBMYXRpdHVkZTogdHJ1Y2tJdGVtLmxhdCxcclxuICAgICAgTG9uZ2l0dWRlOiB0cnVja0l0ZW0ubG9uZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcclxuICAgIGNvbnN0IGxpc3RPZlB1c2hQaW5zID0gbWFwcy5lbnRpdGllcztcclxuICAgIHZhciBpc05ld1RydWNrID0gdHJ1ZTtcclxuXHJcbiAgICB2YXIgbWV0YWRhdGEgPSB7XHJcbiAgICAgIHRydWNrSWQ6IHRydWNrSXRlbS50cnVja0lkLFxyXG4gICAgICBBVFRVSUQ6IHRydWNrSXRlbS50ZWNoSUQsXHJcbiAgICAgIHRydWNrU3RhdHVzOiB0cnVja0l0ZW0udHJ1Y2tDb2wsXHJcbiAgICAgIHRydWNrQ29sOiB0cnVja0l0ZW0udHJ1Y2tDb2wsXHJcbiAgICAgIGpvYlR5cGU6IHRydWNrSXRlbS5qb2JUeXBlLFxyXG4gICAgICBXUkpvYlR5cGU6IHRydWNrSXRlbS53b3JrVHlwZSxcclxuICAgICAgV1JTdGF0dXM6IHRydWNrSXRlbS53clN0YXQsXHJcbiAgICAgIEFzc2luZ2VkV1JJRDogdHJ1Y2tJdGVtLndySUQsXHJcbiAgICAgIFNwZWVkOiB0cnVja0l0ZW0uc3BlZWQsXHJcbiAgICAgIERpc3RhbmNlOiBtaWVsc1RvZGlzcGF0Y2gsXHJcbiAgICAgIEN1cnJlbnRJZGxlVGltZTogdHJ1Y2tJdGVtLmlkbGVUaW1lLFxyXG4gICAgICBFVEE6IHRydWNrSXRlbS50b3RJZGxlVGltZSxcclxuICAgICAgRW1haWw6ICcnLC8vIHRydWNrSXRlbS5FbWFpbCxcclxuICAgICAgTW9iaWxlOiAnJywgLy8gdHJ1Y2tJdGVtLk1vYmlsZSxcclxuICAgICAgaWNvbjogaWNvblVybCxcclxuICAgICAgaWNvbkluZm86IGluZm9Cb3hUcnVja1VybCxcclxuICAgICAgQ3VycmVudExhdDogdHJ1Y2tJdGVtLmxhdCxcclxuICAgICAgQ3VycmVudExvbmc6IHRydWNrSXRlbS5sb25nLFxyXG4gICAgICBXUkxhdDogdHJ1Y2tJdGVtLndyTGF0LFxyXG4gICAgICBXUkxvbmc6IHRydWNrSXRlbS53ckxvbmcsXHJcbiAgICAgIHRlY2hJZHM6IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsXHJcbiAgICAgIGpvYklkOiB0cnVja0l0ZW0uam9iSWQsXHJcbiAgICAgIG1hbmFnZXJJZHM6IHRoaXMubWFuYWdlcklkcyxcclxuICAgICAgd29ya0FkZHJlc3M6IHRydWNrSXRlbS53b3JrQWRkcmVzcyxcclxuICAgICAgc2JjVmluOiB0cnVja0l0ZW0uc2JjVmluLFxyXG4gICAgICBjdXN0b21lck5hbWU6IHRydWNrSXRlbS5jdXN0b21lck5hbWUsXHJcbiAgICAgIHRlY2huaWNpYW5OYW1lOiB0cnVja0l0ZW0udGVjaG5pY2lhbk5hbWUsXHJcbiAgICAgIGRpc3BhdGNoVGltZTogdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSxcclxuICAgICAgcmVnaW9uOiB0cnVja0l0ZW0uem9uZVxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgam9iSWRTdHJpbmcgPSAnaHR0cDovL2VkZ2UtZWR0Lml0LmF0dC5jb20vY2dpLWJpbi9lZHRfam9iaW5mby5jZ2k/JztcclxuXHJcbiAgICBsZXQgem9uZSA9IHRydWNrSXRlbS56b25lO1xyXG5cclxuICAgIC8vID0gTSBmb3IgTVdcclxuICAgIC8vID0gVyBmb3IgV2VzdFxyXG4gICAgLy8gPSBCIGZvciBTRVxyXG4gICAgLy8gPSBTIGZvciBTV1xyXG4gICAgaWYgKHpvbmUgIT0gbnVsbCAmJiB6b25lICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAoem9uZSA9PT0gJ01XJykge1xyXG4gICAgICAgIHpvbmUgPSAnTSc7XHJcbiAgICAgIH0gZWxzZSBpZiAoem9uZSA9PT0gJ1NFJykge1xyXG4gICAgICAgIHpvbmUgPSAnQidcclxuICAgICAgfSBlbHNlIGlmICh6b25lID09PSAnU1cnKSB7XHJcbiAgICAgICAgem9uZSA9ICdTJ1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB6b25lID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgam9iSWRTdHJpbmcgPSBqb2JJZFN0cmluZyArICdlZHRfcmVnaW9uPScgKyB6b25lICsgJyZ3cmlkPScgKyB0cnVja0l0ZW0ud3JJRDtcclxuXHJcbiAgICB0cnVja0l0ZW0uam9iSWQgPSB0cnVja0l0ZW0uam9iSWQgPT0gdW5kZWZpbmVkIHx8IHRydWNrSXRlbS5qb2JJZCA9PSBudWxsID8gJycgOiB0cnVja0l0ZW0uam9iSWQ7XHJcblxyXG4gICAgaWYgKHRydWNrSXRlbS5qb2JJZCAhPSAnJykge1xyXG4gICAgICBqb2JJZFVybCA9ICc8YSBocmVmPVwiJyArIGpvYklkU3RyaW5nICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiIHRpdGxlPVwiQ2xpY2sgaGVyZSB0byBzZWUgYWN0dWFsIEZvcmNlL0VkZ2Ugam9iIGRhdGFcIj4nICsgdHJ1Y2tJdGVtLmpvYklkICsgJzwvYT4nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lICE9IG51bGwgJiYgdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSB1bmRlZmluZWQgJiYgdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSAnJykge1xyXG4gICAgICBsZXQgZGlzcGF0Y2hEYXRlID0gdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZS5zcGxpdCgnOicpO1xyXG4gICAgICBsZXQgZHQgPSBkaXNwYXRjaERhdGVbMF0gKyAnICcgKyBkaXNwYXRjaERhdGVbMV0gKyAnOicgKyBkaXNwYXRjaERhdGVbMl0gKyAnOicgKyBkaXNwYXRjaERhdGVbM107XHJcbiAgICAgIG1ldGFkYXRhLmRpc3BhdGNoVGltZSA9IHRoYXQuVVRDVG9UaW1lWm9uZShkdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXBkYXRlIGluIHRoZSBUcnVja1dhdGNoTGlzdCBzZXNzaW9uXHJcbiAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSAhPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnRydWNrTGlzdCA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSk7XHJcblxyXG4gICAgICBpZiAodGhpcy50cnVja0xpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGlmICh0aGlzLnRydWNrTGlzdC5zb21lKHggPT4geC50cnVja0lkID09IHRydWNrSXRlbS50cnVja0lkKSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMudHJ1Y2tMaXN0LmZpbmQoeCA9PiB4LnRydWNrSWQgPT0gdHJ1Y2tJdGVtLnRydWNrSWQpO1xyXG4gICAgICAgICAgY29uc3QgaW5kZXg6IG51bWJlciA9IHRoaXMudHJ1Y2tMaXN0LmluZGV4T2YoaXRlbSk7XHJcbiAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uRGlzdGFuY2UgPSBtZXRhZGF0YS5EaXN0YW5jZTtcclxuICAgICAgICAgICAgaXRlbS5pY29uID0gbWV0YWRhdGEuaWNvbjtcclxuICAgICAgICAgICAgdGhpcy50cnVja0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgdGhpcy50cnVja0xpc3Quc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrV2F0Y2hMaXN0JywgdGhpcy50cnVja0xpc3QpO1xyXG4gICAgICAgICAgICBpdGVtID0gbnVsbDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBVcGRhdGUgaW4gdGhlIFNlbGVjdGVkVHJ1Y2sgc2Vzc2lvblxyXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrRGV0YWlscycpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICBzZWxlY3RlZFRydWNrID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja0RldGFpbHMnKSk7XHJcblxyXG4gICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sudHJ1Y2tJZCA9PSB0cnVja0l0ZW0udHJ1Y2tJZCkge1xyXG4gICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnVHJ1Y2tEZXRhaWxzJyk7XHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tEZXRhaWxzJywgbWV0YWRhdGEpO1xyXG4gICAgICAgICAgc2VsZWN0ZWRUcnVjayA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudHJ1Y2tJdGVtcy5sZW5ndGggPiAwICYmIHRoaXMudHJ1Y2tJdGVtcy5zb21lKHggPT4geC50b0xvd2VyQ2FzZSgpID09IHRydWNrSXRlbS50cnVja0lkLnRvTG93ZXJDYXNlKCkpKSB7XHJcbiAgICAgIGlzTmV3VHJ1Y2sgPSBmYWxzZTtcclxuICAgICAgLy8gSWYgaXQgaXMgbm90IGEgbmV3IHRydWNrIHRoZW4gbW92ZSB0aGUgdHJ1Y2sgdG8gbmV3IGxvY2F0aW9uXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mUHVzaFBpbnMuZ2V0TGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICAgIGlmIChsaXN0T2ZQdXNoUGlucy5nZXQoaSkubWV0YWRhdGEudHJ1Y2tJZCA9PT0gdHJ1Y2tJdGVtLnRydWNrSWQpIHtcclxuICAgICAgICAgIHZhciBjdXJQdXNoUGluID0gbGlzdE9mUHVzaFBpbnMuZ2V0KGkpO1xyXG4gICAgICAgICAgY3VyUHVzaFBpbi5tZXRhZGF0YSA9IG1ldGFkYXRhO1xyXG4gICAgICAgICAgZGVzdExvYyA9IHBpbkxvY2F0aW9uO1xyXG4gICAgICAgICAgcGluTG9jYXRpb24gPSBsaXN0T2ZQdXNoUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcclxuXHJcbiAgICAgICAgICBsZXQgdHJ1Y2tJZFJhbklkID0gdHJ1Y2tJdGVtLnRydWNrSWQgKyAnXycgKyBNYXRoLnJhbmRvbSgpO1xyXG5cclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0LmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmluZGV4T2YodHJ1Y2tJdGVtLnRydWNrSWQpID4gLTEpIHtcclxuICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0LnB1c2godHJ1Y2tJZFJhbklkKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmxvYWREaXJlY3Rpb25zKHRoaXMsIHBpbkxvY2F0aW9uLCBkZXN0TG9jLCBpLCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKTtcclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRydWNrSXRlbXMucHVzaCh0cnVja0l0ZW0udHJ1Y2tJZCk7XHJcbiAgICAgIE5ld1BpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKHBpbkxvY2F0aW9uLCB7IGljb246IHRydWNrVXJsIH0pO1xyXG5cclxuICAgICAgTmV3UGluLm1ldGFkYXRhID0gbWV0YWRhdGE7XHJcbiAgICAgIHRoaXMubWFwLmVudGl0aWVzLnB1c2goTmV3UGluKTtcclxuXHJcbiAgICAgIHRoaXMuZGF0YUxheWVyLnB1c2goTmV3UGluKTtcclxuICAgICAgaWYgKHRoaXMuaXNNYXBMb2FkZWQpIHtcclxuICAgICAgICB0aGlzLmlzTWFwTG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5tYXAuc2V0Vmlldyh7IGNlbnRlcjogcGluTG9jYXRpb24sIHpvb206IHRoaXMubGFzdFpvb21MZXZlbCB9KTtcclxuICAgICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSB0aGlzLm1hcC5nZXRab29tKCk7XHJcbiAgICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSB0aGlzLm1hcC5nZXRDZW50ZXIoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoTmV3UGluLCAnbW91c2VvdXQnLCAoZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5mb2JveC5zZXRPcHRpb25zKHsgdmlzaWJsZTogZmFsc2UgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgMTAyNCkge1xyXG4gICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgIHRoaXMuaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgICAgICAgc2hvd1BvaW50ZXI6IHRydWUsXHJcbiAgICAgICAgICAgIGxvY2F0aW9uOiBlLnRhcmdldC5nZXRMb2NhdGlvbigpLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93Q2xvc2VCdXR0b246IHRydWUsXHJcbiAgICAgICAgICAgIG9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDAsIDIwKSxcclxuICAgICAgICAgICAgaHRtbENvbnRlbnQ6ICc8ZGl2IGNsYXNzID0gXCJpbmZ5IGluZnlNYXBwb3B1cFwiPidcclxuICAgICAgICAgICAgICArIGdldEluZm9Cb3hIVE1MKGUudGFyZ2V0Lm1ldGFkYXRhLCB0aGlzLnRocmVzaG9sZFZhbHVlLCBqb2JJZFVybCkgKyAnPC9kaXY+J1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGhpcy50cnVja1dhdGNoTGlzdCA9IFt7IFRydWNrSWQ6IGUudGFyZ2V0Lm1ldGFkYXRhLnRydWNrSWQsIERpc3RhbmNlOiBlLnRhcmdldC5tZXRhZGF0YS5EaXN0YW5jZSB9XTtcclxuXHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcclxuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja0RldGFpbHMnLCBlLnRhcmdldC5tZXRhZGF0YSk7XHJcblxyXG4gICAgICAgICAgLy8gQSBidWZmZXIgbGltaXQgdG8gdXNlIHRvIHNwZWNpZnkgdGhlIGluZm9ib3ggbXVzdCBiZSBhd2F5IGZyb20gdGhlIGVkZ2VzIG9mIHRoZSBtYXAuXHJcblxyXG4gICAgICAgICAgdmFyIGJ1ZmZlciA9IDMwO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hPZmZzZXQgPSB0aGF0LmluZm9ib3guZ2V0T2Zmc2V0KCk7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveEFuY2hvciA9IHRoYXQuaW5mb2JveC5nZXRBbmNob3IoKTtcclxuICAgICAgICAgIHZhciBpbmZvYm94TG9jYXRpb24gPSBtYXBzLnRyeUxvY2F0aW9uVG9QaXhlbChlLnRhcmdldC5nZXRMb2NhdGlvbigpLCBNaWNyb3NvZnQuTWFwcy5QaXhlbFJlZmVyZW5jZS5jb250cm9sKTtcclxuICAgICAgICAgIHZhciBkeCA9IGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveE9mZnNldC54IC0gaW5mb2JveEFuY2hvci54O1xyXG4gICAgICAgICAgdmFyIGR5ID0gaW5mb2JveExvY2F0aW9uLnkgLSAyNSAtIGluZm9ib3hBbmNob3IueTtcclxuXHJcbiAgICAgICAgICBpZiAoZHkgPCBidWZmZXIpIHsgLy8gSW5mb2JveCBvdmVybGFwcyB3aXRoIHRvcCBvZiBtYXAuXHJcbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cclxuICAgICAgICAgICAgZHkgKj0gLTE7XHJcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGJ1ZmZlciBmcm9tIHRoZSB0b3AgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICBkeSArPSBidWZmZXI7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAjIyMjIElmIGR5IGlzIGdyZWF0ZXIgdGhhbiB6ZXJvIHRoYW4gaXQgZG9lcyBub3Qgb3ZlcmxhcC5cclxuICAgICAgICAgICAgZHkgPSAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChkeCA8IGJ1ZmZlcikgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCBsZWZ0IHNpZGUgb2YgbWFwLlxyXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXHJcbiAgICAgICAgICAgIGR4ICo9IC0xO1xyXG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgZHggKz0gYnVmZmVyO1xyXG4gICAgICAgICAgfSBlbHNlIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggcmlnaHQgc2lkZSBvZiBtYXAuXHJcbiAgICAgICAgICAgIGR4ID0gbWFwcy5nZXRXaWR0aCgpIC0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94QW5jaG9yLnggLSB0aGF0LmluZm9ib3guZ2V0V2lkdGgoKTtcclxuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeCBpcyBncmVhdGVyIHRoYW4gemVybyB0aGVuIGl0IGRvZXMgbm90IG92ZXJsYXAuXHJcbiAgICAgICAgICAgIGlmIChkeCA+IGJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgIGR4ID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSByaWdodCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgICAgZHggLT0gYnVmZmVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gIyMjIyBBZGp1c3QgdGhlIG1hcCBzbyBpbmZvYm94IGlzIGluIHZpZXdcclxuICAgICAgICAgIGlmIChkeCAhPSAwIHx8IGR5ICE9IDApIHtcclxuICAgICAgICAgICAgbWFwcy5zZXRWaWV3KHtcclxuICAgICAgICAgICAgICBjZW50ZXJPZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludChkeCwgZHkpLFxyXG4gICAgICAgICAgICAgIGNlbnRlcjogbWFwcy5nZXRDZW50ZXIoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xyXG4gICAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoaXMubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcclxuXHJcbiAgICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhpcy5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxyXG4gICAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0ZWNobmljaWFuRGV0YWlscyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbk5hbWUgPSB0ZWNobmljaWFuRGV0YWlscy5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLmluZm9ib3gsICdjbGljaycsIHZpZXdUcnVja0RldGFpbHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ21vdXNlb3ZlcicsIChlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgICAgICAgIHNob3dQb2ludGVyOiB0cnVlLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCAyMCksXHJcbiAgICAgICAgICAgIGh0bWxDb250ZW50OiAnPGRpdiBjbGFzcyA9IFwiaW5meSBpbmZ5TWFwcG9wdXBcIj4nXHJcbiAgICAgICAgICAgICAgKyBnZXRJbmZvQm94SFRNTChlLnRhcmdldC5tZXRhZGF0YSwgdGhpcy50aHJlc2hvbGRWYWx1ZSwgam9iSWRVcmwpICsgJzwvZGl2PidcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRoaXMudHJ1Y2tXYXRjaExpc3QgPSBbeyBUcnVja0lkOiBlLnRhcmdldC5tZXRhZGF0YS50cnVja0lkLCBEaXN0YW5jZTogZS50YXJnZXQubWV0YWRhdGEuRGlzdGFuY2UgfV07XHJcblxyXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snLCBlLnRhcmdldC5tZXRhZGF0YSk7XHJcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tEZXRhaWxzJywgZS50YXJnZXQubWV0YWRhdGEpO1xyXG5cclxuICAgICAgICAgIC8vIEEgYnVmZmVyIGxpbWl0IHRvIHVzZSB0byBzcGVjaWZ5IHRoZSBpbmZvYm94IG11c3QgYmUgYXdheSBmcm9tIHRoZSBlZGdlcyBvZiB0aGUgbWFwLlxyXG5cclxuICAgICAgICAgIHZhciBidWZmZXIgPSAzMDtcclxuICAgICAgICAgIHZhciBpbmZvYm94T2Zmc2V0ID0gdGhhdC5pbmZvYm94LmdldE9mZnNldCgpO1xyXG4gICAgICAgICAgdmFyIGluZm9ib3hBbmNob3IgPSB0aGF0LmluZm9ib3guZ2V0QW5jaG9yKCk7XHJcbiAgICAgICAgICB2YXIgaW5mb2JveExvY2F0aW9uID0gbWFwcy50cnlMb2NhdGlvblRvUGl4ZWwoZS50YXJnZXQuZ2V0TG9jYXRpb24oKSwgTWljcm9zb2Z0Lk1hcHMuUGl4ZWxSZWZlcmVuY2UuY29udHJvbCk7XHJcbiAgICAgICAgICB2YXIgZHggPSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hPZmZzZXQueCAtIGluZm9ib3hBbmNob3IueDtcclxuICAgICAgICAgIHZhciBkeSA9IGluZm9ib3hMb2NhdGlvbi55IC0gMjUgLSBpbmZvYm94QW5jaG9yLnk7XHJcblxyXG4gICAgICAgICAgaWYgKGR5IDwgYnVmZmVyKSB7IC8vIEluZm9ib3ggb3ZlcmxhcHMgd2l0aCB0b3Agb2YgbWFwLlxyXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXHJcbiAgICAgICAgICAgIGR5ICo9IC0xO1xyXG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBidWZmZXIgZnJvbSB0aGUgdG9wIGVkZ2Ugb2YgdGhlIG1hcC5cclxuICAgICAgICAgICAgZHkgKz0gYnVmZmVyO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeSBpcyBncmVhdGVyIHRoYW4gemVybyB0aGFuIGl0IGRvZXMgbm90IG92ZXJsYXAuXHJcbiAgICAgICAgICAgIGR5ID0gMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoZHggPCBidWZmZXIpIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggbGVmdCBzaWRlIG9mIG1hcC5cclxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxyXG4gICAgICAgICAgICBkeCAqPSAtMTtcclxuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgbGVmdCBlZGdlIG9mIHRoZSBtYXAuXHJcbiAgICAgICAgICAgIGR4ICs9IGJ1ZmZlcjtcclxuICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIHJpZ2h0IHNpZGUgb2YgbWFwLlxyXG4gICAgICAgICAgICBkeCA9IG1hcHMuZ2V0V2lkdGgoKSAtIGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveEFuY2hvci54IC0gdGhhdC5pbmZvYm94LmdldFdpZHRoKCk7XHJcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHggaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhlbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxyXG4gICAgICAgICAgICBpZiAoZHggPiBidWZmZXIpIHtcclxuICAgICAgICAgICAgICBkeCA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgbWFwLlxyXG4gICAgICAgICAgICAgIGR4IC09IGJ1ZmZlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vICMjIyMgQWRqdXN0IHRoZSBtYXAgc28gaW5mb2JveCBpcyBpbiB2aWV3XHJcbiAgICAgICAgICBpZiAoZHggIT0gMCB8fCBkeSAhPSAwKSB7XHJcbiAgICAgICAgICAgIG1hcHMuc2V0Vmlldyh7XHJcbiAgICAgICAgICAgICAgY2VudGVyT2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoZHgsIGR5KSxcclxuICAgICAgICAgICAgICBjZW50ZXI6IG1hcHMuZ2V0Q2VudGVyKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcclxuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGlzLm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XHJcblxyXG4gICAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcclxuICAgICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XHJcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcclxuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5pbmZvYm94LCAnY2xpY2snLCB2aWV3VHJ1Y2tEZXRhaWxzKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKG1hcHMsICd2aWV3Y2hhbmdlJywgbWFwVmlld0NoYW5nZWQpO1xyXG5cclxuICAgICAgLy8gdGhpcy5DaGFuZ2VUcnVja0RpcmVjdGlvbih0aGlzLCBOZXdQaW4sIGRlc3RMb2MsIHRydWNrVXJsKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYXBWaWV3Q2hhbmdlZChlKSB7XHJcbiAgICAgIHRoYXQubGFzdFpvb21MZXZlbCA9IG1hcHMuZ2V0Wm9vbSgpO1xyXG4gICAgICB0aGF0Lmxhc3RMb2NhdGlvbiA9IG1hcHMuZ2V0Q2VudGVyKCk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBtb3VzZXdoZWVsQ2hhbmdlZChlKSB7XHJcbiAgICAgIHRoYXQubGFzdFpvb21MZXZlbCA9IG1hcHMuZ2V0Wm9vbSgpO1xyXG4gICAgICB0aGF0Lmxhc3RMb2NhdGlvbiA9IG1hcHMuZ2V0Q2VudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0SW5mb0JveEhUTUwoZGF0YTogYW55LCB0VmFsdWUsIGpvYklkKTogU3RyaW5nIHtcclxuXHJcbiAgICAgIGlmICghZGF0YS5TcGVlZCkge1xyXG4gICAgICAgIGRhdGEuU3BlZWQgPSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY2xhc3NOYW1lID0gXCJcIjtcclxuICAgICAgdmFyIHN0eWxlTGVmdCA9IFwiXCI7XHJcbiAgICAgIHZhciByZWFzb24gPSAnJztcclxuICAgICAgaWYgKGRhdGEudHJ1Y2tTdGF0dXMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKGRhdGEudHJ1Y2tTdGF0dXMudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAncmVkJykge1xyXG4gICAgICAgICAgcmVhc29uID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tdG9wOjNweDtjb2xvcjpyZWQ7Jz5SZWFzb246IEN1bXVsYXRpdmUgaWRsZSB0aW1lIGlzIGJleW9uZCBcIiArIHRWYWx1ZSArIFwiIG1pbnM8L2Rpdj5cIjtcclxuICAgICAgICB9IGVsc2UgaWYgKGRhdGEudHJ1Y2tTdGF0dXMudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAncHVycGxlJykge1xyXG4gICAgICAgICAgcmVhc29uID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tdG9wOjNweDtjb2xvcjpwdXJwbGU7Jz5SZWFzb246IFRydWNrIGlzIGRyaXZlbiBncmVhdGVyIHRoYW4gNzUgbS9oPC9kaXY+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgaW5mb2JveERhdGEgPSAnJztcclxuXHJcbiAgICAgIGRhdGEuY3VzdG9tZXJOYW1lID0gZGF0YS5jdXN0b21lck5hbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEuY3VzdG9tZXJOYW1lID09IG51bGwgPyAnJyA6IGRhdGEuY3VzdG9tZXJOYW1lO1xyXG5cclxuICAgICAgZGF0YS5kaXNwYXRjaFRpbWUgPSBkYXRhLmRpc3BhdGNoVGltZSA9PSB1bmRlZmluZWQgfHwgZGF0YS5kaXNwYXRjaFRpbWUgPT0gbnVsbCA/ICcnIDogZGF0YS5kaXNwYXRjaFRpbWU7XHJcblxyXG4gICAgICBkYXRhLmpvYklkID0gZGF0YS5qb2JJZCA9PSB1bmRlZmluZWQgfHwgZGF0YS5qb2JJZCA9PSBudWxsID8gJycgOiBkYXRhLmpvYklkO1xyXG5cclxuICAgICAgZGF0YS53b3JrQWRkcmVzcyA9IGRhdGEud29ya0FkZHJlc3MgPT0gdW5kZWZpbmVkIHx8IGRhdGEud29ya0FkZHJlc3MgPT0gbnVsbCA/ICcnIDogZGF0YS53b3JrQWRkcmVzcztcclxuXHJcbiAgICAgIGRhdGEuc2JjVmluID0gZGF0YS5zYmNWaW4gPT0gdW5kZWZpbmVkIHx8IGRhdGEuc2JjVmluID09IG51bGwgfHwgZGF0YS5zYmNWaW4gPT0gJycgPyAnJyA6IGRhdGEuc2JjVmluO1xyXG5cclxuICAgICAgZGF0YS50ZWNobmljaWFuTmFtZSA9IGRhdGEudGVjaG5pY2lhbk5hbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEudGVjaG5pY2lhbk5hbWUgPT0gbnVsbCB8fCBkYXRhLnRlY2huaWNpYW5OYW1lID09ICcnID8gJycgOiBkYXRhLnRlY2huaWNpYW5OYW1lO1xyXG5cclxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgMTAyNCkge1xyXG4gICAgICAgIGluZm9ib3hEYXRhID0gXCI8ZGl2IGNsYXNzPSdwb3BNb2RhbENvbnRhaW5lcic+PGRpdiBjbGFzcz0ncG9wTW9kYWxIZWFkZXInPjxpbWcgc3JjPSdcIiArIGRhdGEuaWNvbkluZm8gKyBcIicgPjxhIGNsYXNzPSdkZXRhaWxzJyB0aXRsZT0nQ2xpY2sgaGVyZSB0byBzZWUgdGVjaG5pY2lhbiBkZXRhaWxzJyA+VmlldyBEZXRhaWxzPC9hPjxpIGNsYXNzPSdmYSBmYS10aW1lcycgYXJpYS1oaWRkZW49J3RydWUnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPjwvaT48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxoci8+PGRpdiBjbGFzcz0ncG9wTW9kYWxCb2R5Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPlZlaGljbGUgTnVtYmVyIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuc2JjVmluICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPlZUUyBVbml0IElEIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEudHJ1Y2tJZCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5Kb2IgVHlwZSA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmpvYlR5cGUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Sm9iIElkIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGpvYklkICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkFUVFVJRCA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLkFUVFVJRCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5UZWNobmljaWFuIE5hbWUgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS50ZWNobmljaWFuTmFtZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5DdXN0b21lciBOYW1lIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuY3VzdG9tZXJOYW1lICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkRpc3BhdGNoIFRpbWU6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmRpc3BhdGNoVGltZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTEyJz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbC0xMiBjb2wtc20tMTIgY29sLWZvcm0tbGFiZWwnPkpvYiBBZGRyZXNzIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtc20tMTInPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCBjb2wtZm9ybS1sYWJlbC1mdWxsJz5cIiArIGRhdGEud29ya0FkZHJlc3MgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IG1ldGVyQ2FsJz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtbWQtNCc+PHN0cm9uZz5cIiArIGRhdGEuU3BlZWQgKyBcIjwvc3Ryb25nPiBtcGggPHNwYW4gY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+U3BlZWQ8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyBkYXRhLkVUQSArIFwiPC9zdHJvbmc+IE1pbnMgPHNwYW4gY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+Q3VtdWxhdGl2ZSBJZGxlIE1pbnV0ZXM8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyB0aGF0LmNvbnZlcnRNaWxlc1RvRmVldChkYXRhLkRpc3RhbmNlKSArIFwiPC9zdHJvbmc+IEZ0IDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkZlZXQgdG8gSm9iIFNpdGU8L3NwYW4+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PiA8aHIvPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncG9wTW9kYWxGb290ZXInPjxkaXYgY2xhc3M9J3Jvdyc+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wgY29sLW1kLTQnPjxpIGNsYXNzPSdmYSBmYS1jb21tZW50aW5nJz48L2k+PHNwYW4gY2xhc3M9J3NtcycgdGl0bGU9J0NsaWNrIHRvIHNlbmQgU01TJyA+U01TPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtZW52ZWxvcGUnIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PHNwYW4gY2xhc3M9J2VtYWlsJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBlbWFpbCcgPkVtYWlsPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtZXllJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxzcGFuIGNsYXNzPSd3YXRjaGxpc3QnIHRpdGxlPSdDbGljayB0byBhZGQgaW4gd2F0Y2hsaXN0JyA+V2F0Y2g8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj4gPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIjtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5mb2JveERhdGEgPSBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J3BhZGRpbmctdG9wOjEwcHg7bWFyZ2luOiAwcHg7Jz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC0zJz48ZGl2IHN0eWxlPSdwYWRkaW5nLXRvcDoxNXB4OycgPjxpbWcgc3JjPSdcIiArIGRhdGEuaWNvbkluZm8gKyBcIicgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrO21hcmdpbjogMCBhdXRvOycgPjwvZGl2PjwvZGl2PlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTknPlwiICtcclxuICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncm93ICc+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtOCcgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5WZWhpY2xlIE51bWJlcjwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLnNiY1ZpbiArIFwiPC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNCcgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PGEgY2xhc3M9J2RldGFpbHMnIHN0eWxlPSdjb2xvcjojMDA5RkRCO2N1cnNvcjogcG9pbnRlcjsnICB0aXRsZT0nQ2xpY2sgaGVyZSB0byBzZWUgdGVjaG5pY2lhbiBkZXRhaWxzJyA+VmlldyBEZXRhaWxzPC9hPjxpIGNsYXNzPSdmYSBmYS10aW1lcycgc3R5bGU9J3BhZGRpbmctbGVmdDoxNXB4O2N1cnNvcjogcG9pbnRlcjsnIGFyaWEtaGlkZGVuPSd0cnVlJyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz48L2k+PC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8L2Rpdj5cIiArXHJcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J3Jvdyc+PGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPlZUUyBVbml0IElEPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEudHJ1Y2tJZCArIFwiPC9kaXY+PC9kaXY+XCIgK1xyXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnPjxkaXYgY2xhc3M9J2NvbC1tZC01JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkpvYiBUeXBlPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuam9iVHlwZSArIFwiPC9kaXY+PGRpdiBjbGFzcz0nY29sLW1kLTcnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOycgPkpvYiBJZDwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBqb2JJZCArIFwiPC9kaXY+PC9kaXY+XCJcclxuICAgICAgICAgICsgcmVhc29uICsgXCI8L2Rpdj48L2Rpdj5cIlxyXG4gICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+QVRUVUlEPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuQVRUVUlEICsgXCI8c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDttYXJnaW4tbGVmdDo4cHg7Jz5UZWNobmljaWFuIE5hbWU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS50ZWNobmljaWFuTmFtZSArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnID5cIlxyXG4gICAgICAgICAgKyBcIjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5DdXN0b21lciBOYW1lPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuY3VzdG9tZXJOYW1lICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7JyA+XCJcclxuICAgICAgICAgICsgXCI8ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+RGlzcGF0Y2ggVGltZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmRpc3BhdGNoVGltZSArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4OycgPlwiXHJcbiAgICAgICAgICArIFwiPGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkpvYiBBZGRyZXNzPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEud29ya0FkZHJlc3MgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8aHIgc3R5bGU9J21hcmdpbi10b3A6MXB4OyBtYXJnaW4tYm90dG9tOjVweDsnIC8+XCJcclxuXHJcbiAgICAgICAgICArIFwiPGRpdiBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHg7Jz4gPGRpdiBjbGFzcz0ncm93Jz4gPGRpdiBjbGFzcz0nc3BlZWQgY29sLW1kLTMnPiA8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tbGVmdDogMXB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIGRhdGEuU3BlZWQgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5tcGg8L3A+PC9kaXY+PHAgc3R5bGU9J21hcmdpbjowcHgnIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPlNwZWVkPC9wPjwvZGl2PlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naWRsZSBjb2wtbWQtNSc+PGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHgnPjxwIHN0eWxlPSdmb250LXdlaWdodDogYm9sZGVyO2ZvbnQtc2l6ZTogMjNweDttYXJnaW46IDBweDsnPlwiICsgZGF0YS5FVEEgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5NaW5zPC9wPjwvZGl2PjxwIHN0eWxlPSdtYXJnaW46MHB4JyBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5DdW11bGF0aXZlIElkbGUgTWludXRlczwvcD48L2Rpdj4gPGRpdiBjbGFzcz0nbWlsZXMgY29sLW1kLTQnPlwiXHJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHgnPjxwIHN0eWxlPSdmb250LXdlaWdodDogYm9sZGVyO2ZvbnQtc2l6ZTogMjNweDttYXJnaW46IDBweDsnPlwiICsgdGhhdC5jb252ZXJ0TWlsZXNUb0ZlZXQoZGF0YS5EaXN0YW5jZSkgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5GdDwvcD48L2Rpdj48cCBzdHlsZT0nbWFyZ2luOjBweCcgY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+RmVldCB0byBKb2IgU2l0ZTwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjwvZGl2PjwvZGl2PjxociBzdHlsZT0nbWFyZ2luLXRvcDoxcHg7IG1hcmdpbi1ib3R0b206NXB4OycgLz5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+IDxkaXYgY2xhc3M9J2NvbC1tZC0xJz48L2Rpdj48ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnIHN0eWxlPSdcIiArIGNsYXNzTmFtZSArIFwiJz4gPGkgY2xhc3M9J2ZhIGZhLWNvbW1lbnRpbmcgY29sLW1kLTInPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgc21zJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBTTVMnID5TTVM8L3A+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMgb2Zmc2V0LW1kLTEnIHN0eWxlPSdcIiArIGNsYXNzTmFtZSArIFwiJz4gPGkgY2xhc3M9J2ZhIGZhLWVudmVsb3BlIGNvbC1tZC0yJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxwIGNsYXNzPSdjb2wtbWQtNiBlbWFpbCcgdGl0bGU9J0NsaWNrIHRvIHNlbmQgZW1haWwnID5FbWFpbDwvcD48L2Rpdj5cIlxyXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3JvdyBjb2wtbWQtMyc+PC9kaXY+XCJcclxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnIHN0eWxlPSdcIiArIHN0eWxlTGVmdCArIFwiJz48aSBjbGFzcz0nZmEgZmEtZXllIGNvbC1tZC0yJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxwIGNsYXNzPSdjb2wtbWQtNiB3YXRjaGxpc3QnIHRpdGxlPSdDbGljayB0byBhZGQgaW4gd2F0Y2hsaXN0JyA+V2F0Y2g8L3A+PC9kaXY+IDwvZGl2PlwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaW5mb2JveERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmlld1RydWNrRGV0YWlscyhlKSB7XHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2ZhIGZhLXRpbWVzJykge1xyXG4gICAgICAgIHRoYXQuaW5mb2JveC5zZXRPcHRpb25zKHtcclxuICAgICAgICAgIHZpc2libGU6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnZGV0YWlscycpIHtcclxuICAgICAgICAvL3RoYXQucm91dGVyLm5hdmlnYXRlKFsnL3RlY2huaWNpYW4tZGV0YWlscyddKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnY29sLW1kLTYgc21zJykge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XHJcbiAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoYXQubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGF0LnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXHJcbiAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbFNNUycpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2NvbC1tZC02IGVtYWlsJykge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XHJcbiAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoYXQubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGF0LnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXHJcbiAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xyXG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbEVtYWlsJykubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgfVxyXG4gICAgIFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZERpcmVjdGlvbnModGhhdCwgc3RhcnRMb2MsIGVuZExvYywgaW5kZXgsIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpIHtcclxuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5EaXJlY3Rpb25zTWFuYWdlcih0aGF0Lm1hcCk7XHJcbiAgICAgIC8vIFNldCBSb3V0ZSBNb2RlIHRvIGRyaXZpbmdcclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5zZXRSZXF1ZXN0T3B0aW9ucyh7XHJcbiAgICAgICAgcm91dGVNb2RlOiBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLlJvdXRlTW9kZS5kcml2aW5nXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLnNldFJlbmRlck9wdGlvbnMoe1xyXG4gICAgICAgIGRyaXZpbmdQb2x5bGluZU9wdGlvbnM6IHtcclxuICAgICAgICAgIHN0cm9rZUNvbG9yOiAnZ3JlZW4nLFxyXG4gICAgICAgICAgc3Ryb2tlVGhpY2tuZXNzOiAzLFxyXG4gICAgICAgICAgdmlzaWJsZTogZmFsc2VcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UgfSxcclxuICAgICAgICB2aWFwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IGZhbHNlIH0sXHJcbiAgICAgICAgYXV0b1VwZGF0ZU1hcFZpZXc6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3Qgd2F5cG9pbnQxID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuV2F5cG9pbnQoe1xyXG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oc3RhcnRMb2MubGF0aXR1ZGUsIHN0YXJ0TG9jLmxvbmdpdHVkZSksIGljb246ICcnXHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zdCB3YXlwb2ludDIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5XYXlwb2ludCh7XHJcbiAgICAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihlbmRMb2MubGF0aXR1ZGUsIGVuZExvYy5sb25naXR1ZGUpXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50MSk7XHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuYWRkV2F5cG9pbnQod2F5cG9pbnQyKTtcclxuXHJcbiAgICAgIC8vIEFkZCBldmVudCBoYW5kbGVyIHRvIGRpcmVjdGlvbnMgbWFuYWdlci5cclxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5kaXJlY3Rpb25zTWFuYWdlciwgJ2RpcmVjdGlvbnNVcGRhdGVkJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvLyBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICB2YXIgcm91dGVJbmRleCA9IGUucm91dGVbMF0ucm91dGVMZWdzWzBdLm9yaWdpbmFsUm91dGVJbmRleDtcclxuICAgICAgICB2YXIgbmV4dEluZGV4ID0gcm91dGVJbmRleDtcclxuICAgICAgICBpZiAoZS5yb3V0ZVswXS5yb3V0ZVBhdGgubGVuZ3RoID4gcm91dGVJbmRleCkge1xyXG4gICAgICAgICAgbmV4dEluZGV4ID0gcm91dGVJbmRleCArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBuZXh0TG9jYXRpb24gPSBlLnJvdXRlWzBdLnJvdXRlUGF0aFtuZXh0SW5kZXhdO1xyXG4gICAgICAgIHZhciBwaW4gPSB0aGF0Lm1hcC5lbnRpdGllcy5nZXQoaW5kZXgpO1xyXG4gICAgICAgIC8vIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHN0YXJ0TG9jLG5leHRMb2NhdGlvbik7XHJcbiAgICAgICAgdGhhdC5Nb3ZlUGluT25EaXJlY3Rpb24odGhhdCwgZS5yb3V0ZVswXS5yb3V0ZVBhdGgsIHBpbiwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5jYWxjdWxhdGVEaXJlY3Rpb25zKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIE1vdmVQaW5PbkRpcmVjdGlvbih0aGF0LCByb3V0ZVBhdGgsIHBpbiwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCkge1xyXG4gICAgdGhhdCA9IHRoaXM7XHJcbiAgICB2YXIgaXNHZW9kZXNpYyA9IGZhbHNlO1xyXG4gICAgdGhhdC5jdXJyZW50QW5pbWF0aW9uID0gbmV3IEJpbmcuTWFwcy5BbmltYXRpb25zLlBhdGhBbmltYXRpb24ocm91dGVQYXRoLCBmdW5jdGlvbiAoY29vcmQsIGlkeCwgZnJhbWVJZHgsIHJvdGF0aW9uQW5nbGUsIGxvY2F0aW9ucywgdHJ1Y2tJZFJhbklkKSB7XHJcblxyXG4gICAgICBpZiAodGhhdC5hbmltYXRpb25UcnVja0xpc3QubGVuZ3RoID4gMCAmJiB0aGF0LmFuaW1hdGlvblRydWNrTGlzdC5zb21lKHggPT4geCA9PSB0cnVja0lkUmFuSWQpKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gKGZyYW1lSWR4ID09IGxvY2F0aW9ucy5sZW5ndGggLSAxKSA/IGZyYW1lSWR4IDogZnJhbWVJZHggKyAxO1xyXG4gICAgICAgIHZhciByb3RhdGlvbkFuZ2xlID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKGNvb3JkLCBsb2NhdGlvbnNbaW5kZXhdKTtcclxuICAgICAgICBpZiAodGhhdC5pc09kZChmcmFtZUlkeCkpIHtcclxuICAgICAgICAgIHRoYXQuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwaW4sIHRydWNrVXJsLCByb3RhdGlvbkFuZ2xlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZnJhbWVJZHggPT0gbG9jYXRpb25zLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIHRoYXQuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwaW4sIHRydWNrVXJsLCByb3RhdGlvbkFuZ2xlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGluLnNldExvY2F0aW9uKGNvb3JkKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0sIGlzR2VvZGVzaWMsIHRoYXQudHJhdmFsRHVyYXRpb24sIHRydWNrSWRSYW5JZCk7XHJcblxyXG4gICAgdGhhdC5jdXJyZW50QW5pbWF0aW9uLnBsYXkoKTtcclxuICB9XHJcblxyXG4gIENhbGN1bGF0ZU5leHRDb29yZChzdGFydExvY2F0aW9uLCBlbmRMb2NhdGlvbikge1xyXG4gICAgdHJ5IHtcclxuXHJcbiAgICAgIHZhciBkbGF0ID0gKGVuZExvY2F0aW9uLmxhdGl0dWRlIC0gc3RhcnRMb2NhdGlvbi5sYXRpdHVkZSk7XHJcbiAgICAgIHZhciBkbG9uID0gKGVuZExvY2F0aW9uLmxvbmdpdHVkZSAtIHN0YXJ0TG9jYXRpb24ubG9uZ2l0dWRlKTtcclxuICAgICAgdmFyIGFscGhhID0gTWF0aC5hdGFuMihkbGF0ICogTWF0aC5QSSAvIDE4MCwgZGxvbiAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICB2YXIgZHggPSAwLjAwMDE1MjM4Nzk0NzI3OTA5OTMxO1xyXG4gICAgICBkbGF0ID0gZHggKiBNYXRoLnNpbihhbHBoYSk7XHJcbiAgICAgIGRsb24gPSBkeCAqIE1hdGguY29zKGFscGhhKTtcclxuICAgICAgdmFyIG5leHRDb29yZCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihzdGFydExvY2F0aW9uLmxhdGl0dWRlICsgZGxhdCwgc3RhcnRMb2NhdGlvbi5sb25naXR1ZGUgKyBkbG9uKTtcclxuXHJcbiAgICAgIGRsYXQgPSBudWxsO1xyXG4gICAgICBkbG9uID0gbnVsbDtcclxuICAgICAgYWxwaGEgPSBudWxsO1xyXG4gICAgICBkeCA9IG51bGw7XHJcblxyXG4gICAgICByZXR1cm4gbmV4dENvb3JkO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIENhbGN1bGF0ZU5leHRDb29yZCAtICcgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc09kZChudW0pIHtcclxuICAgIHJldHVybiBudW0gJSAyO1xyXG4gIH1cclxuXHJcbiAgZGVnVG9SYWQoeCkge1xyXG4gICAgcmV0dXJuIHggKiBNYXRoLlBJIC8gMTgwO1xyXG4gIH1cclxuXHJcbiAgcmFkVG9EZWcoeCkge1xyXG4gICAgcmV0dXJuIHggKiAxODAgLyBNYXRoLlBJO1xyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlQmVhcmluZyhvcmlnaW4sIGRlc3QpIHtcclxuICAgIC8vLyA8c3VtbWFyeT5DYWxjdWxhdGVzIHRoZSBiZWFyaW5nIGJldHdlZW4gdHdvIGxvYWNhdGlvbnMuPC9zdW1tYXJ5PlxyXG4gICAgLy8vIDxwYXJhbSBuYW1lPVwib3JpZ2luXCIgdHlwZT1cIk1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uXCI+SW5pdGlhbCBsb2NhdGlvbi48L3BhcmFtPlxyXG4gICAgLy8vIDxwYXJhbSBuYW1lPVwiZGVzdFwiIHR5cGU9XCJNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvblwiPlNlY29uZCBsb2NhdGlvbi48L3BhcmFtPlxyXG4gICAgdHJ5IHtcclxuICAgICAgdmFyIGxhdDEgPSB0aGlzLmRlZ1RvUmFkKG9yaWdpbi5sYXRpdHVkZSk7XHJcbiAgICAgIHZhciBsb24xID0gb3JpZ2luLmxvbmdpdHVkZTtcclxuICAgICAgdmFyIGxhdDIgPSB0aGlzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpO1xyXG4gICAgICB2YXIgbG9uMiA9IGRlc3QubG9uZ2l0dWRlO1xyXG4gICAgICB2YXIgZExvbiA9IHRoaXMuZGVnVG9SYWQobG9uMiAtIGxvbjEpO1xyXG4gICAgICB2YXIgeSA9IE1hdGguc2luKGRMb24pICogTWF0aC5jb3MobGF0Mik7XHJcbiAgICAgIHZhciB4ID0gTWF0aC5jb3MobGF0MSkgKiBNYXRoLnNpbihsYXQyKSAtIE1hdGguc2luKGxhdDEpICogTWF0aC5jb3MobGF0MikgKiBNYXRoLmNvcyhkTG9uKTtcclxuXHJcbiAgICAgIGxhdDEgPSBsYXQyID0gbG9uMSA9IGxvbjIgPSBkTG9uID0gbnVsbDtcclxuXHJcbiAgICAgIHJldHVybiAodGhpcy5yYWRUb0RlZyhNYXRoLmF0YW4yKHksIHgpKSArIDM2MCkgJSAzNjA7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZygnRXJyb3IgaW4gY2FsY3VsYXRlQmVhcmluZyAtICcgKyBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBTZW5kU01TKGZvcm0pIHtcclxuICAgIC8vIGlmKHRoaXMudGVjaG5pY2lhblBob25lICE9ICcnKXtcclxuICAgIGlmIChmb3JtLnZhbHVlLm1vYmlsZU5vICE9ICcnKSB7XHJcbiAgICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgd2FudCB0byBzZW5kIFNNUz8nKSkge1xyXG4gICAgICAgIC8vIHRoaXMubWFwU2VydmljZS5zZW5kU01TKHRoaXMudGVjaG5pY2lhblBob25lLGZvcm0udmFsdWUuc21zTWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnNlbmRTTVMoZm9ybS52YWx1ZS5tb2JpbGVObywgZm9ybS52YWx1ZS5zbXNNZXNzYWdlKTtcclxuXHJcbiAgICAgICAgZm9ybS5jb250cm9scy5zbXNNZXNzYWdlLnJlc2V0KClcclxuICAgICAgICBmb3JtLnZhbHVlLm1vYmlsZU5vID0gdGhpcy50ZWNobmljaWFuUGhvbmU7XHJcbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbFNNUycpLm1vZGFsKCdoaWRlJyk7XHJcbiAgICAgICAgLy90aGlzLnRvYXN0ci5zdWNjZXNzKCdTTVMgc2VudCBzdWNjZXNzZnVsbHknLCAnU3VjY2VzcycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgU2VuZEVtYWlsKGZvcm0pIHtcclxuICAgIC8vIGlmKHRoaXMudGVjaG5pY2lhbkVtYWlsICE9ICcnKXtcclxuICAgIGlmIChmb3JtLnZhbHVlLmVtYWlsSWQgIT0gJycpIHtcclxuICAgICAgaWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZSB3YW50IHRvIHNlbmQgRW1haWw/JykpIHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy51c2VyUHJvZmlsZVNlcnZpY2UuZ2V0VXNlckRhdGEodGhpcy5jb29raWVBVFRVSUQpXHJcbiAgICAgICAgLy8gICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XHJcbiAgICAgICAgLy8gICAgIHZhciBuZXdEYXRhOiBhbnkgPSB0aGlzLnN0cmluZ2lmeUpzb24oZGF0YSk7XHJcbiAgICAgICAgLy8gICAgIC8vdGhpcy5tYXBTZXJ2aWNlLnNlbmRFbWFpbChuZXdEYXRhLmVtYWlsLHRoaXMudGVjaG5pY2lhbkVtYWlsLG5ld0RhdGEubGFzdE5hbWUgKyAnICcgKyBuZXdEYXRhLmZpcnN0TmFtZSwgdGhpcy50ZWNobmljaWFuTmFtZSwgZm9ybS52YWx1ZS5lbWFpbFN1YmplY3QsZm9ybS52YWx1ZS5lbWFpbE1lc3NhZ2UpO1xyXG4gICAgICAgIC8vICAgICB0aGlzLm1hcFNlcnZpY2Uuc2VuZEVtYWlsKG5ld0RhdGEuZW1haWwsIGZvcm0udmFsdWUuZW1haWxJZCwgbmV3RGF0YS5sYXN0TmFtZSArICcgJyArIG5ld0RhdGEuZmlyc3ROYW1lLCB0aGlzLnRlY2huaWNpYW5OYW1lLCBmb3JtLnZhbHVlLmVtYWlsU3ViamVjdCwgZm9ybS52YWx1ZS5lbWFpbE1lc3NhZ2UpO1xyXG4gICAgICAgIC8vICAgICB0aGlzLnRvYXN0ci5zdWNjZXNzKFwiRW1haWwgc2VudCBzdWNjZXNzZnVsbHlcIiwgJ1N1Y2Nlc3MnKTtcclxuXHJcbiAgICAgICAgLy8gICAgIGZvcm0uY29udHJvbHMuZW1haWxTdWJqZWN0LnJlc2V0KClcclxuICAgICAgICAvLyAgICAgZm9ybS5jb250cm9scy5lbWFpbE1lc3NhZ2UucmVzZXQoKVxyXG4gICAgICAgIC8vICAgICBmb3JtLnZhbHVlLmVtYWlsSWQgPSB0aGlzLnRlY2huaWNpYW5FbWFpbDtcclxuICAgICAgICAvLyAgICAgalF1ZXJ5KCcjbXlNb2RhbEVtYWlsJykubW9kYWwoJ2hpZGUnKTtcclxuICAgICAgICAvLyAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBTZWFyY2hUcnVjayhmb3JtKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAvLyQoJyNsb2FkaW5nJykuc2hvdygpO1xyXG5cclxuICAgIGlmIChmb3JtLnZhbHVlLmlucHV0bWlsZXMgIT0gJycgJiYgZm9ybS52YWx1ZS5pbnB1dG1pbGVzICE9IG51bGwpIHtcclxuICAgICAgY29uc3QgbHQgPSB0aGF0LmNsaWNrZWRMYXQ7XHJcbiAgICAgIGNvbnN0IGxnID0gdGhhdC5jbGlja2VkTG9uZztcclxuICAgICAgY29uc3QgcmQgPSBmb3JtLnZhbHVlLmlucHV0bWlsZXM7XHJcblxyXG4gICAgICB0aGlzLmZvdW5kVHJ1Y2sgPSBmYWxzZTtcclxuICAgICAgdGhpcy5hbmltYXRpb25UcnVja0xpc3QgPSBbXTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmxvYWRNYXBWaWV3KCdyb2FkJyk7XHJcblxyXG4gICAgICB0aGF0LkxvYWRUcnVja3ModGhpcy5tYXAsIGx0LCBsZywgcmQsIHRydWUpO1xyXG5cclxuICAgICAgZm9ybS5jb250cm9scy5pbnB1dG1pbGVzLnJlc2V0KCk7XHJcbiAgICAgIGpRdWVyeSgnI215UmFkaXVzTW9kYWwnKS5tb2RhbCgnaGlkZScpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICB9LCAxMDAwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGdldE1pbGVzKGkpIHtcclxuICAgIHJldHVybiBpICogMC4wMDA2MjEzNzExOTI7XHJcbiAgfVxyXG5cclxuICBnZXRNZXRlcnMoaSkge1xyXG4gICAgcmV0dXJuIGkgKiAxNjA5LjM0NDtcclxuICB9XHJcblxyXG4gIHN0cmluZ2lmeUpzb24oZGF0YSkge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gIH1cclxuICBwYXJzZVRvSnNvbihkYXRhKSB7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcclxuICB9XHJcblxyXG4gIFJvdW5kKG51bWJlciwgcHJlY2lzaW9uKSB7XHJcbiAgICB2YXIgZmFjdG9yID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XHJcbiAgICB2YXIgdGVtcE51bWJlciA9IG51bWJlciAqIGZhY3RvcjtcclxuICAgIHZhciByb3VuZGVkVGVtcE51bWJlciA9IE1hdGgucm91bmQodGVtcE51bWJlcik7XHJcbiAgICByZXR1cm4gcm91bmRlZFRlbXBOdW1iZXIgLyBmYWN0b3I7XHJcbiAgfVxyXG5cclxuICBnZXRBdGFuMih5LCB4KSB7XHJcbiAgICByZXR1cm4gTWF0aC5hdGFuMih5LCB4KTtcclxuICB9O1xyXG5cclxuICBnZXRJY29uVXJsKGNvbG9yOiBzdHJpbmcsIHNvdXJjZUxhdDogbnVtYmVyLCBzb3VyY2VMb25nOiBudW1iZXIsIGRlc3RpbmF0aW9uTGF0OiBudW1iZXIsIGRlc3RpbmF0aW9uTG9uZzogbnVtYmVyKSB7XHJcbiAgICB2YXIgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQTNaSlJFRlVhSUh0bDExSVUyRVl4Lzl2dVZxUWF4ZUI2d3YwS3NjSUY0RzBicG9hWm5XemhWcGRWRXAxRVJybXBDaHZNZ2pySWhUNm9LQlo2RVhVQXVlTmFGSDBRVFN4eUFXVlhSUXVQMUF2c3UzTTVuSGFuaTdjbHVuWng5bG1DTDYvcTNQTzgvS2MvLzk1dndFT2g4UGhjRGdjRG9lelZHR3BTRUpFYWdCVnFjZ2xnWXN4MWh3cG1KWnNkaUpTQnlqd1ljejNjKzJ3WjhTZmJMNjViRm12VXhPUmtURldMaFdYM1FQQmF1OEVvQTkrMGs5TWlmdTJYZDJwRUVRaENhblNXUElxWVRGV0FFQVdZOHcxTnk2ckI0aW9hanJ3KzFMYXN1V3IrMzcwajQ5UGVxY3pWQmxLMTloM3RoRGlBY0RoNmdaUUFRQ1pBQkkzUUVUM0FKUmRlM1ViVmtjTEJGRllEY3hVYUVkbWJvcmt5aWN1QXlIeGxyWmEySHJzQ3l4SkhzdGlOVmpNNG9FWUJoYTdlQ0NLQVNJeVlwR0xCNkxNZ2NscC81blgzOTVNMlhyc2l2OHBTQzRSRGF4TVc3RzN2ZmRKWEVuU2xla3BFelNYTlVwVjFIalVWV2pBUFJUekI0TG9oVTZUalJLOUthNzJjaW5PTVlVZW5WTHhwSThTdGg0N1N2VW1OSm92SjVzcUd0V01NYmRVSUdrRGdpaWc4SllaaHF6VWIyYWxlak5LOUNZZ1F2V0JKQXpvTkZwOEd1a052enY2dWhOTk5TOVhDRU1jTzd3c0F5cWxDZzJtZWhScEM4TGZHcDdmUU1PTG0zTFNoRG0yL1FocThpcWhDaTRDRGxjM0xQWmFXWE5KbG9HbVE5ZXhTYjBSeHgrY2drY1VvTk5vVVdPc3dKcFZLbHpva0RjSGpodU9vcTdvSEpxNld0RDU1UmtBb01aWUNWdDVNM2JmMm85NEQ0Y1JEWWpUNHFoT284MElEWTBpN1M0WU1uTmhhTndWcnBDanJ4dUQ3aUZZRDE2SDFkRWlxM0lXWXdVZU9kditNVjdjZHdSZDFjOVF1dFVNcTZNWk9ldDBVd0FVa0RpRnhqU2dURlBlUHB0ZlZldVo4Q2dHM0VNbzNKeVBMdGZiZVNJN2U1OENBQXF6Q3lUSHNSUTZqUllxWlRwc3p2azd2TTFweCs3c2ZCQVJDalliRlFCZVN0MERZaHBnak5VUmticlJmRGw4VlJ6eGp2b0JySmpkVGhYY2FDN3VPUitYK05sSWJWS2IxQnRtZW5wbUFyOEVZSnJYYUxiT2VINUVSSHJNWENqc2RaMVhZSFg4dmFJMm1PcFJ1dFVNQUdZQWttdTFGT09UdmdPRDdzRVQrKzhlWGg0YTd6cU5GbzlQdG9hRlIxcjdFNGFJeW9pSVBnNzMwcDAzemRUL2M1Q0NsQ1dRU3kySTNxL0NoQkI0K0w2Vk9qNC9KU0tpUUNEZ0NSWnNZU0Fpb3pnMTJmN2oxNWpUNTUrNEh6eTFKcHBMVFVTblBhTDNuYy92NnlLaXV1Q2RtOFBoY0RpY3BjRWZrM2VBTGJjMStWUUFBQUFBU1VWT1JLNUNZSUk9XCI7XHJcblxyXG4gICAgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJncmVlblwiKSB7XHJcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEzWkpSRUZVYUlIdGwxMUlVMkVZeC85dnVWcVFheGVCNnd2MEtzY0lGNEcwYnBvYVpuV3poVnBkVkVwMUVScm1wQ2h2TWdqckloVDZvS0JaNkVYVUF1ZU5hRkgwUVRTeHlBV1ZYUlF1UDFBdnN1M001bkhhbmk3Y2x1blp4OWxtQ0w2L3EzUE84L0tjLy85NXZ3RU9oOFBoY0RnY0RvZXpWR0dwU0VKRWFnQlZxY2dsZ1lzeDFod3BtSlpzZGlKU0J5andZY3ozYysyd1o4U2ZiTDY1YkZtdlV4T1JrVEZXTGhXWDNRUEJhdThFb0E5KzBrOU1pZnUyWGQycEVFUWhDYW5TV1BJcVlURldBRUFXWTh3MU55NnJCNGlvYWpydysxTGFzdVdyKzM3MGo0OVBlcWN6VkJsSzE5aDN0aERpQWNEaDZnWlFBUUNaQUJJM1FFVDNBSlJkZTNVYlZrY0xCRkZZRGN4VWFFZG1ib3JreWljdUF5SHhsclphMkhyc0N5eEpIc3RpTlZqTTRvRVlCaGE3ZUNDS0FTSXlZcEdMQjZMTWdjbHAvNW5YMzk1TTJYcnNpdjhwU0M0UkRheE1XN0czdmZkSlhFblNsZWtwRXpTWE5VcFYxSGpVVldqQVBSVHpCNExvaFU2VGpSSzlLYTcyY2luT01ZVWVuVkx4cEk4U3RoNDdTdlVtTkpvdko1c3FHdFdNTWJkVUlHa0RnaWlnOEpZWmhxelViMmFsZWpOSzlDWWdRdldCSkF6b05GcDhHdWtOdnp2NnVoTk5OUzlYQ0VNY083d3NBeXFsQ2cybWVoUnBDOExmR3A3ZlFNT0xtM0xTaERtMi9RaHE4aXFoQ2k0Q0RsYzNMUFphV1hOSmxvR21ROWV4U2IwUnh4K2Nna2NVb05Ob1VXT3N3SnBWS2x6b2tEY0hqaHVPb3E3b0hKcTZXdEQ1NVJrQW9NWllDVnQ1TTNiZjJvOTRENGNSRFlqVDRxaE9vODBJRFkwaTdTNFlNbk5oYU53VnJwQ2pyeHVEN2lGWUQxNkgxZEVpcTNJV1l3VWVPZHYrTVY3Y2R3UmQxYzlRdXRVTXE2TVpPZXQwVXdBVWtEaUZ4alNnVEZQZVBwdGZWZXVaOENnRzNFTW8zSnlQTHRmYmVTSTdlNThDQUFxekN5VEhzUlE2alJZcVpUcHN6dms3dk0xcHgrN3NmQkFSQ2pZYkZRQmVTdDBEWWhwZ2pOVVJrYnJSZkRsOFZSenhqdm9CckpqZFRoWGNhQzd1T1IrWCtObEliVktiMUJ0bWVucG1BcjhFWUpyWGFMYk9lSDVFUkhyTVhDanNkWjFYWUhYOHZhSTJtT3BSdXRVTUFHWUFrbXUxRk9PVHZnT0Q3c0VUKys4ZVhoNGE3enFORm85UHRvYUZSMXI3RTRhSXlvaUlQZzczMHAwM3pkVC9jNUNDbENXUVN5MkkzcS9DaEJCNCtMNlZPajQvSlNLaVFDRGdDUlpzWVNBaW96ZzEyZjdqMTVqVDU1KzRIenkxSnBwTFRVU25QYUwzbmMvdjZ5S2l1dUNkbThQaGNEaWNwY0VmazNlQUxiYzErVlFBQUFBQVNVVk9SSzVDWUlJPVwiO1xyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwicmVkXCIpIHtcclxuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQTB4SlJFRlVhSUh0bHoxc0VtRWN4cDlYaEJRRGhSQS9NQ1NOVFV5OHRFc1hYRXNnY2RBQnFvT1RwQTR1a0tBT3hzWXVEa0owcmRIbzFKUW1iZ1ljWFB4S25EVGdVQWR0bXpTeElVQ0tSQ3dlb1FWNjkzZUF1Mmg3QlE1YTA4VDNOeDMzUDU1N252ZnIzaGZnY0RnY0RvZkQ0WEE0L3l0c0wwU0l5QTdnK2w1b2FiREtHSnZiclhpNFgzVWlza09XUDIvOS9IbTBYaWpVKzlYYnpwR1JFVHNSZVJoalY3WHF1bnVnMWRyakFNWmF0OGJremMwTFh6d2VveVNLZlZqVnhoa093eGtLQWNBd1kyeDFlMTFYRHhEUmRaS2tlOHhnc05ReW1ZcFVxV3laamg4ZnFHVXliRC9NQTBBbG5WWXVUd0hvUFFBUnpRS1lMRHg5aW1JOERra1VMVUN6aFN4dTkxNTQ3WW11QWlqbU05UFRLQ1dUKzJ4Skg0YzZQWENRelFNZEFoeDA4MENiQUVUa3dRRTNEN1NaQTFTdjN4SS9mR2lVa2tuanZ6U2tsMTBETUpQcC9QcXJWMTJKR0t6V1BUT2tWN3Z0S2xUUDV6dStRQkpGbUFVQkRyKy9xK2YxNHZEN2xjc0ZyWHJmVzRsU0lnRkhJSUNoV0t4ZnFYYmNaSXl0YXhYNkRpQ0pJcFl2WG9UbDdObCtwWGJnQ0FTVUh0QnNmYUNQQUdaQndNYlNrdnE3a2tyMUtyVkRTNkdiTDd5dUFBYXJGVVBSS0d3K24zcHY3ZEVqckQxK3JFZEc1ZGlWSzNDR3crcEVyYVRUeUV4UG81N0xkYTJoSzhEd3c0Y3d1Vno0Rm9tb2s5Y1pDc0V3T0lqYy9mdjZ6QWVEY04yK2plTDhQTXJ2M2dFQW5LRVFUcy9PWXZuU0pYUzdPZHcxZ0x5NVdUQUx3Z2xsYU5oOFBsamNibnc5ZDA1dG9Vb3FoWG91aCtHWkdSVG41M1cxbkRNVVF1bkZpNytDcjZSU0dIbjlHbzZKQ1JUamNSd1pIVzBBTUVKakY5b3h3S0dCZ1Njbkk1RTdVcmxzck9menNIbTlxS1RUTzB5VzM3NXRCdlI2TmNleEZtWkJnTUZxMWZ6Q2w1SkoyTHhlZ0FpRDQrTkdBTysxemdFZEF6REc3aEtSZlNnV1U0K0tqZWFKeS9UbmM4cjRkVTFOZFdWZTY3OS9Zbks1WUhHN2xRbjhIa0NnblVaWEp6SWlHa1B6UUpISVBYaUFZanl1MW9haVVUZ0NBUUNZQUtDNVZtc2hWNnVYYTluc3RaVmcwS0NNZDdNZzRNeno1NnJ4M2RiK25pR2lTU0tpNnVJaWZaK2JvMW8yU3kwbWU5Q3lTNks0c3ZYcmwvd2prYUQxTjIrYVNySmNialhZL2tCRUhybFdlOWtvbFJha2pZMW5yVjFycjFwMklyb2hpZUtucldyMUl4SGRiWjI1T1J3T2g4UDVQL2dOcWh4LzZyc3VqamdBQUFBQVNVVk9SSzVDWUlJPVwiO1xyXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwieWVsbG93XCIpIHtcclxuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQXloSlJFRlVhSUh0bHoxTVUxRVlodC92WWhXTmFadGdoQUdObUlDSlZtRndNQ0ZSSEV3RUU4VkpuTVJCblJRZHlnQU9EcnJvWUNJTHVCZ1dZZFBFeUdSaXhCUWNIQ0QrREtoQVdpTTQxSGdKbEovYm50ZWh0L1dudHorM0JVUENlYWJlKzUyOGZiL3ZuSHZPZHdDTlJxUFJhRFFhalVhelVaSFZFQ0hwQjlDeEdsb09USXRJZjdiZ3BsTFZTZnBCTlE3cnh3NHNmbHNwVlM4RDN5RS95U1lSdWVnVWRqMERkcldQQVdpd1h6VWdzWGdxOGVLZ0I1WlpnbE5ucEs0VFJsMFFBR3BFWlByZnVLc1pJTmtCeG05RE5tMUhiSEllMW53YzVWWGxYSmlVdFRBUEFJaUdBQVFCWUErQTRoTWcrUWhBdS9wMEg1enFBeXh6TzVDc2tGUTBycEpiOXhTVVFNbzh4NitCa1lFMXR1UU9JOStBUDgycmRXWWV5SlBBZWpjUDVFaUFaQlBXdVhrZzF6ZVFXQTR5T215cHlJRG5QL3B4VGZZRXlyYTBZT1paWVNvZTd5clpjZEwyNVF6bjNJVVlDK2ZWbDdnSjhRWWd1OXFBQXNhN1JhclBwWDZPT2NWTGJpVlVaQkJHOVhrWTlUMmxTdVhpaG9qOGRBcVVuQUFzRTJxNGFVME9NNmx1Uzg1c2x1b0RKU1FnM2dBNDl6Nzl6R2lvV0trTXJUUVZqWG1iTlhjSmVId3c2aDlBcWxyU3J6aHhGMnJpbml1WkZFYk5aVWhkWi9wRFpUUUVqbDhyNk50TDRTb0I0M0EvWk50dXFMY1hBTXVFK0FLUTJrNkl4dzkrNkhabmZ1OFZ5UDdiVUZNUGdka2hBSGJuZWVRcEVxK1BvOURtTVB0Sm5GajZMcjVBK2xHcVdpQVZqVkNqcmVEc0VCZ05RVTMyUVkxZlRWWnkyMjVYQ1VodEVJd01naCs2azVXUGhxQkd6d0FDR01sMUQvRTNXUGJ3akM0MFJZNXpvTHhYOW5WMWlXVjZFQXRES3B2QjZFakc5REpWdmNxVGdOTTZkakx2RFFBZUgvaDFNQ09tSW9PUXltWVlKR1RuQ1ErQVYwNzNnTHdKaU1ndGtuNmp2dWYzVlhGcFpnWEE1cjhHMnV0WER0eHhmenR5T0tSazY2N2tqcGJjMVY0QmFNMGxVZEIva214QThrTHhoQjl2UWszMnBXTkdmVTlxcXpzTHdIR3ZkaVF4ZjQ2eDhDVTFjcm9zdGQ3Rkc0Qng5R1hhZUxhOXYyaEl0cE9rTXQ4eDhhV1hYQWpUcHIwSUxUOVg1ajdUTXBVS0QxRE5QTGVsbEdrWGJHMGcyY1Q0MG5NdVI4Y1lqejIydTlaaXRmd2tyM1BGZk12NHdodVN0K3c3dDBhajBXZzBHNE5mVGl4a2ZGeHlYUEVBQUFBQVNVVk9SSzVDWUlJPVwiXHJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJwdXJwbGVcIikge1xyXG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRjYybFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd015MHdNMVF4TVRvME1Eb3pOeTB3TlRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURNdE1ETlVNVEU2TlRNNk1qVXRNRFU2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURNdE1ETlVNVEU2TlRNNk1qVXRNRFU2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVRsaFlUWXhaR1l0WTJWaE5DMHdZelF5TFRoaFpUQXRaalkxWlRkaE5XSXdNakJoSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZNVEk0Tm1ZelpHVXRaRGRqTlMxa1pUUm1MVGc1TkdZdE1XWXpPRGsyWW1NNVpqRmtJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZZVGRrTkRSbU4yRXRNakpsWXkxaE9EUTBMVGxtT1dJdE1UQTNZakZoTldZMk9UY3lJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwaE4yUTBOR1kzWVMweU1tVmpMV0U0TkRRdE9XWTVZaTB4TURkaU1XRTFaalk1TnpJaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1ETXRNRE5VTVRFNk5EQTZNemN0TURVNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPbUU1WVdFMk1XUm1MV05sWVRRdE1HTTBNaTA0WVdVd0xXWTJOV1UzWVRWaU1ESXdZU0lnYzNSRmRuUTZkMmhsYmowaU1qQXhPQzB3TXkwd00xUXhNVG8xTXpveU5TMHdOVG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOEwzSmtaanBUWlhFK0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0lEd3ZjbVJtT2xKRVJqNGdQQzk0T25odGNHMWxkR0UrSUR3L2VIQmhZMnRsZENCbGJtUTlJbklpUHo2UlEyY1hBQUFDUzBsRVFWUm8zdTJZdlVvRFFSREg4d2g1Qk45QUg4REMya1lyV3dYdDFWN1JXaHU3bElLS1dDa3FOb0tvb0tCRUpTREVEMHdSalNTU2NHTGlKV1p6ZCt2K3o5dXdoSHhlOXVDRUdSaENObmV6ODV1ZG5aMU5oSE1lK2M4YUlRQUNJQUFDSUFBQ0lBQUNJQUFDSUFEdEFMMkllRDRxZENrZ25WVG0wUThBNXgyYnA4c0ZaaGFTMzUrNmxmL0p1allBTDlwalNvVDJhaFdiN1F6ZjhvM0JhKzJhaUdVOEJqN1FONEFZbjdVdHB3UnJ4ZGRLQ1JFcTUxbmw0NjVZQzhKNTZQSE1nd1FZNlFzQXl3Z3JpSWdhYlh6UHhyOTRxQUdrODVlTHFhWkxIR3FBZHM2SEhxQ1Q4NkVHOEY1bzYzeW9BZXlxYy9SMi9zbTZLWE5oWFlHTzBaY0F4cU1aR01EcC9MTi9BTkIzbWlDK21uYXRYeXlrK1BIMGczWjlQVEVrUURRUUFKd0p4cFBKQTVhNW5sdUpiZ0hVWE5XdHFZTjhQWDIwQXh4TzNHdkw4MWEybEQ1SUR3RFNSY2xKTGxzTHY0N0hWOUs4V3F6VmJhR2E3WTRtZ2dQQUJLWDNIN2N5NERkc1lEaVEzTXIyN3J5MytmR3VUQm5YZnVhbjNtdjFCU0JhNUJ3bWFTeG5hb1RhalhkU2dDUEhHOGNSSURrdnppSFpTdnRaZ2VWYTJXYXlQTDdzNTFzZVdCQ2tRN2VsRWMrMjJtUHlZSlRQQ0RuemZTTVRuMnRxdnB1NWFyVlpHZlVyV0wxR2UwcmxjWjFIL2UvN1NpbStEd2tkZHlPdHBCVVVLK1BKdUhkYWRxWE10R0xHczJtcGR3dFVvMmFPYTdzVGkvRXBXRWZya056TXVodk9rNmxJandJSFdjbDZFWHZCUVJEcTFjM2hYd2hZaTNlMDNJbEgwT2hWREpZUUczMWJWZ2cvNHJVSGN3TGtocFd0Syt5N1pwSDNCVUIvYkJFQUFSQUFBUkRBZjlCZlJiNjRLWWZsUkxBQUFBQUFTVVZPUks1Q1lJST1cIlxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpY29uVXJsO1xyXG4gIH1cclxuXHJcbiAgbG9jYXRlcHVzaHBpbihvYmopIHtcclxuICAgIGNvbnN0IHRydWNrSWQgPSBvYmoudHJ1Y2tJZDtcclxuXHJcbiAgICAvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBwaW5zIGluIHRoZSBkYXRhIGxheWVyIGFuZCBmaW5kIHRoZSBwdXNocGluIGZvciB0aGUgbG9jYXRpb24uIFxyXG4gICAgbGV0IHNlYXJjaFBpbjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhTGF5ZXIuZ2V0TGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICBzZWFyY2hQaW4gPSB0aGlzLmRhdGFMYXllci5nZXQoaSk7XHJcbiAgICAgIGlmIChzZWFyY2hQaW4ubWV0YWRhdGEudHJ1Y2tJZC50b0xvd2VyQ2FzZSgpICE9PSB0cnVja0lkLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICBzZWFyY2hQaW4gPSBudWxsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgYSBwaW4gaXMgZm91bmQgd2l0aCBhIG1hdGNoaW5nIElELCB0aGVuIGNlbnRlciB0aGUgbWFwIG9uIGl0IGFuZCBzaG93IGl0J3MgaW5mb2JveC5cclxuICAgIGlmIChzZWFyY2hQaW4pIHtcclxuICAgICAgLy8gT2Zmc2V0IHRoZSBjZW50ZXJpbmcgdG8gYWNjb3VudCBmb3IgdGhlIGluZm9ib3guXHJcbiAgICAgIHRoaXMubWFwLnNldFZpZXcoeyBjZW50ZXI6IHNlYXJjaFBpbi5nZXRMb2NhdGlvbigpLCB6b29tOiAxNyB9KTtcclxuICAgICAgLy8gdGhpcy5kaXNwbGF5SW5mb0JveChzZWFyY2hQaW4sIG9iaik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKGxvY2F0aW9uLCB1cmwsIHJvdGF0aW9uQW5nbGUsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cclxuICAgICAgdmFyIHJvdGF0aW9uQW5nbGVSYWRzID0gcm90YXRpb25BbmdsZSAqIE1hdGguUEkgLyAxODA7XHJcbiAgICAgIGMud2lkdGggPSA1MDtcclxuICAgICAgYy5oZWlnaHQgPSA1MDtcclxuICAgICAgLy8gQ2FsY3VsYXRlIHJvdGF0ZWQgaW1hZ2Ugc2l6ZS5cclxuICAgICAgLy8gYy53aWR0aCA9IE1hdGguYWJzKE1hdGguY2VpbChpbWcud2lkdGggKiBNYXRoLmNvcyhyb3RhdGlvbkFuZ2xlUmFkcykgKyBpbWcuaGVpZ2h0ICogTWF0aC5zaW4ocm90YXRpb25BbmdsZVJhZHMpKSk7XHJcbiAgICAgIC8vIGMuaGVpZ2h0ID0gTWF0aC5hYnMoTWF0aC5jZWlsKGltZy53aWR0aCAqIE1hdGguc2luKHJvdGF0aW9uQW5nbGVSYWRzKSArIGltZy5oZWlnaHQgKiBNYXRoLmNvcyhyb3RhdGlvbkFuZ2xlUmFkcykpKTtcclxuXHJcbiAgICAgIHZhciBjb250ZXh0ID0gYy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgICAgLy8gTW92ZSB0byB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXHJcbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGMud2lkdGggLyAyLCBjLmhlaWdodCAvIDIpO1xyXG5cclxuICAgICAgLy8gUm90YXRlIHRoZSBjYW52YXMgdG8gdGhlIHNwZWNpZmllZCBhbmdsZSBpbiBkZWdyZWVzLlxyXG4gICAgICBjb250ZXh0LnJvdGF0ZShyb3RhdGlvbkFuZ2xlUmFkcyk7XHJcblxyXG4gICAgICAvLyBEcmF3IHRoZSBpbWFnZSwgc2luY2UgdGhlIGNvbnRleHQgaXMgcm90YXRlZCwgdGhlIGltYWdlIHdpbGwgYmUgcm90YXRlZCBhbHNvLlxyXG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWcsIC1pbWcud2lkdGggLyAyLCAtaW1nLmhlaWdodCAvIDIpO1xyXG4gICAgICAvLyBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgyNCwgNilcclxuICAgICAgaWYgKCFpc05hTihyb3RhdGlvbkFuZ2xlUmFkcykgJiYgcm90YXRpb25BbmdsZVJhZHMgPiAwKSB7XHJcbiAgICAgICAgbG9jYXRpb24uc2V0T3B0aW9ucyh7IGljb246IGMudG9EYXRhVVJMKCksIGFuY2hvcjogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KGMud2lkdGggLyAyLCBjLmhlaWdodCAvIDIpIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyByZXR1cm4gYztcclxuICAgIH07XHJcblxyXG4gICAgLy8gQWxsb3cgY3Jvc3MgZG9tYWluIGltYWdlIGVkaXR0aW5nLlxyXG4gICAgaW1nLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XHJcbiAgICBpbWcuc3JjID0gdXJsO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGhyZXNob2xkVmFsdWUoKSB7XHJcblxyXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFJ1bGVzKHRoaXMudGVjaFR5cGUpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGRhdGEpID0+IHtcclxuICAgICAgICAgIHZhciBvYmogPSBKU09OLnBhcnNlKCh0aGlzLnN0cmluZ2lmeUJvZHlKc29uKGRhdGEpKS5kYXRhKTtcclxuICAgICAgICAgIGlmIChvYmogIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgaWRsZVRpbWUgPSBvYmouZmlsdGVyKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmZpZWxkTmFtZSA9PT0gJ0N1bXVsYXRpdmUgaWRsZSB0aW1lIGZvciBSRUQnICYmIGVsZW1lbnQuZGlzcGF0Y2hUeXBlID09PSB0aGlzLnRlY2hUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC52YWx1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlkbGVUaW1lICE9IHVuZGVmaW5lZCAmJiBpZGxlVGltZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy50aHJlc2hvbGRWYWx1ZSA9IGlkbGVUaW1lWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIHN0cmluZ2lmeUJvZHlKc29uKGRhdGEpIHtcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGFbJ19ib2R5J10pO1xyXG4gIH1cclxuXHJcbiAgVVRDVG9UaW1lWm9uZShyZWNvcmREYXRldGltZSkge1xyXG4gICAgdmFyIHJlY29yZFRpbWU7XHJcbiAgICB2YXIgcmVjb3JkZFRpbWUgPSBtb21lbnR0aW1lem9uZS51dGMocmVjb3JkRGF0ZXRpbWUpO1xyXG4gICAgLy8gdmFyIHJlY29yZGRUaW1lID0gbW9tZW50dGltZXpvbmUudHoocmVjb3JkRGF0ZXRpbWUsIFwiQW1lcmljYS9DaGljYWdvXCIpO1xyXG5cclxuICAgIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdDU1QnKSB7XHJcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignQW1lcmljYS9DaGljYWdvJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcclxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnRVNUJykge1xyXG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ0FtZXJpY2EvTmV3X1lvcmsnKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdQU1QnKSB7XHJcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignQW1lcmljYS9Mb3NfQW5nZWxlcycpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ0FsYXNrYScpIHtcclxuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdVUy9BbGFza2EnKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZWNvcmRUaW1lO1xyXG4gIH1cclxuXHJcbiAgYWRkVGlja2V0RGF0YShtYXAsIGRpck1hbmFnZXIpe1xyXG4gICAgLy8vL2xvYWQgY3VycmVudCBsb2NhdGlvblxyXG4gICAgbG9hZEN1cnJlbnRMb2NhdGlvbigpOyAgICBcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuVXBkYXRlVGlja2V0SlNPTkRhdGFMaXN0KCk7XHJcbiAgICB2YXIgaW5pdEluZGV4OiBudW1iZXIgPTE7XHJcbiAgICB0aGlzLnRpY2tldERhdGEuZm9yRWFjaChkYXRhID0+IHtcclxuICAgICAgdmFyIHRpY2tldEltYWdlID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNnQUFBQXRDQVlBQUFEY015bmVBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFOT1NVUkJWRmlGelpsUFNCUlJHTUIvMzl0TUNDTjNOeTNJTGxHQy9UbFlVT0NmVFlJd0lTandWblRwVkhUSmcxRWdDZFZGcTFzUkhTTG9uSWU2V0ZHa3E3c1ZGRWhobXVXdFA0VE1paWlGdWpPdlE2TTc2cXc2N3Jqajd6YnZmZk45UHg2ek8rOTlJNndBM1VDaE1VNnRDTFZhcUJTTFhRaGJnQ0k3WkFMTmJ4R0dOUFJwaUVlTDZKVk9KcjNXRWkvQm96RXFMWXNMQ0kxQXNjZGFvMENITXJrYlR0TG5xMkNxanIzYTVCWlE3MUVxVzlWT1RKcWpDZnFYRGwwRXZZZjFxUWczZ0NaZ25TOXlHZEphdUIwMXVDcjlUSGtXTk9vb0U1TW5HdmI3TERiZjRMMmU1dVRtTi94d24zYVRxMllQSVo2ajJiYXFjaG0rQS9YUkhqN1BuMWdnT0ZKRHVSSzZnYTM1TUhQd3l3d1JLKzNpbTNOd2p1QklOUnVWNGgxUWtWZTFERU5TeU1ISVM4Wm1CcFJ6VmlrZUVwd2NRTG1lNUw1ellIWUZqVm9hZ2NkNVYzTEJFazZVeEhrS3RxQStRRUZxQTRQQWprRE5iQVMraFVOVVNCZHBCV0JzNERSclJBNUF3MDRqelNtd24wR0I4OEVxTFVTRWN3QmkvNjE4Q1ZySWpaREpUaVhpMC90MUZiQVU5VXFnS21pUmJGaFFyWURkUVl0a1JhaFFRRm5RSG90UXBzanNndGNjQXBzVWVOK0c1NUcvQ3ZnWnRNVWkvRlFDdjRLMldJUWZ5b0tCb0MyeUlUQ29nQmRCaTJSRjgxenNUYW9CRkFUdE00OHBNMFJVbFNRWVp3MnVvc0N6MGk0bUZJQVMyb01XY3FFZDdPMVdPRTRjU0FhcTQwVFRFK2toQWM0emlkQU1tRUU1T1REUlhKcTVtQldNeGtscXpjMWduRElJdEVVVHZIVmNaOUFORkk1T2tGejFia0lXQkQ2RVUxUTVXeUZ6anAzU3lXUUJISU9GSi93OE1KUU9jWHgrbjhhOTlWRkhHU2JkNU9rZ3BXRllXOFJLRWd2M0JjcnRobWdYM3d0Q0hFTG9YSDA5WHBsVFZMdkp3Vkx0TjFCR0xaY0ZXb0gxUG90TmlkQWFqdE1tb0xNRkxhdUJhY1RZRHJTZ09VdnVmVUlMb1NPVTVrcHhrdUdsZ2oyMWdFZHFLRmR3eG00QmUrM2hES0RwTUJXUFN1TjhYZTVObmdTZHBHTHMwNXB1SUx4RTZLZ0loeU54UHEya2p1dVBaRG5ZQmE4dkkvVGFTdVVnQjBHQXlCL3VBRVBaNWpVTVI0cTRsMHVObkFUbEE5UFcvM2U0ZTNKTjAwcStqY3lwa2N2Tk14ZzF2RUE0T2lleDVuV2tseU81NXM1cEJXZlJOQUZweDRpSmNOR1AxTDRJMmg5a0hzNE9DQThpUFh6MEk3Yy9Ld2hNbTdRQVk4QzRxV2oxSys4L2RramxmZmUwMTY4QUFBQUFTVVZPUks1Q1lJST1cIlxyXG4gICAgICBpZihkYXRhLnRpY2tldFNldmVyaXR5ID09PSBcIlVua25vd25cIiB8fCBkYXRhLnRpY2tldFNldmVyaXR5ID09PSBcIldhcm5pbmdcIiB8fCBkYXRhLnRpY2tldFNldmVyaXR5ID09PSBcIk1pbm9yXCIpXHJcbiAgICAgIHtcclxuICAgICAgICB0aWNrZXRJbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDd0FBQUF6Q0FZQUFBRHNCT3BQQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBUHlTVVJCVkdpQjdaaFBpQnQxRk1lLzd5WFQxZDNGUWhHS2VLbm9LdGpzV21sdnhSYWg5cUxWUzZkSlpvT3VCdytXUWkvMXRJY1d2T2lXc2xTOXVBZUpheWEvYklNSEtZcW9oeFFVUVloYU5wV3lXRkJXb2kzMG9DaDFONVBmODdEYmtKMU1KcE9kWkJLd24xdmU3LzErNzVOaDV2ZVBzQTFNMDl4aEdNWkJBSWNBUEEzZ0NRQzdBWXh2cHZ4TlJIK0l5QXFBSDVqNXl1am82RGNMQ3d1MTdkUnJocnBKVHFmVGU0bm9GSUFUQUhaMVdlczJnRXRFOUo1dDJ6OTEyYmRCSU9Ga012bDRMQmFiQS9CaTBENCtDSUJQbVBtTlhDNzNjN2VkZll1YnBobUx4K096UkRRTFlNZDJEZHV3SmlKdk9vN3pWckZZckFmdDFGWTRuVTQvU0VRZlkrTTk3UnNpVWpJTTQvamk0dUx0SVBtZXdxbFVhZzh6ZndGZ29xZDI3VmtCY0RTZnovL2FLYkZGT0oxTzd5YWlLOWo0OHFQa0JqTS9rOHZsZnZkTDR1WWZNek16OXhIUnA0aGVGZ0FlMVZwL1pwcm0vWDVKVzRUWDE5Zm5BZXp2cTVZLyt3ekRtUE5MYUx3U2xtVWRBbEJDK0drckxGcEVEaXVsdnZacXZQdUVDY0JGREY0V0FKaUk1dEhHaFFFZ2s4a2NBN0F2U3FzT0hKaWVubjdlcTRFQlFHdDlNbHFmem9qSTYxNXh5bVF5RDJtdFZ3SEVJbmJxUkYxRUhsWkszV3dPc29nY3hmREpBaHRPejdtRHJMWHU2OUliQmlJNjdJNHhNKzhkaEV3UWlPaEpkNHhGWk04QVhBSWhJbys0WXd4ZzV3QmNndExpeGw1WlEwU0xId080NlpFNExGVGRBZllLRGhHZXdoMDN6UU9reFkwM04rdERpWWlVM0RHdTErdWZEOEFsRUNMeWxUdkdoVUxoRndEWG85ZnB5TFZOdHkwd0FJakl1NUhyZE9ZZHJ5QUR3TWpJeUFjWXJ1bnRWcTFXKzhpcmdRRWdtODMrQzJBK1VpVi96aGVMeFR0ZURZMlZwRnF0WGdEd1hXUks3ZmwrZkh6OFlydkdobkNwVkhKRTVCVUFudjhzSXRaRTVHVy9XODR0YTdWUzZqcUExd0RvZnB0NW9FWGtWYVhVTmIra2xwUEc4dkx5Y2lLUldDV2lYdHhVQmtWRTVLUlNLdHNwMGZOb1ZLbFVmcHljbkx3RklJcmowN3FJbkZKS3ZSOGsyZmNKcGxLcEE4eDhDVURMUnJwSC9DWWlKNVJTM3didDRQdjBLcFZLTlpGSTJFVDBBSUNuT3VWM1FRM0FRandlVDlxMnZkSk54OER2YUNhVGVVeHJmUTdBY1FBajNmazFXQ09pb3VNNDU1YVdsbTVzWjRDdVB5clROSGNhaHZFQ2dDU0FZd0c3WFFhd1JFU1hiZHYrcTl1YXpZU2FCU3pMK2hMQUViOGNFU2twcFo0TlU2ZVpVR2M2Wmo0RC96bGJFOUdaTURWYWFvYnBuTXZscmdKWTlFbjVNSi9QbDhQVWNCUDYxS3kxbmdYd2owZlRIYTMxMmJEanV3a3RYQ2dVcWtSMHdhTnBybEFvcklZZDMwMVA3aVhHeHNiZUJ0QXNWNDNGWXVkN01iYWJuaXdFNVhLNU5qVTE5U2VBbHdCQVJFN2J0dDJYcldyUGJuNG1KaWF5QU1vaWN0VnhITDhQY1hpd0xPdUlaVm0rOC9JOTd2Ri81ei9kMGpvRVB6aFpHZ0FBQUFCSlJVNUVya0pnZ2c9PVwiXHJcbiAgICAgIH1lbHNlIGlmKGRhdGEudGlja2V0U2V2ZXJpdHkgPT09IFwiTWFqb3JcIil7XHJcbiAgICAgICAgdGlja2V0SW1hZ2UgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ3dBQUFBekNBWUFBQURzQk9wUEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBT3hBQUFEc1FCbFNzT0d3QUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU95U1VSQlZHaUI3WmhOYUJ4bEdJQ2ZkMlpOYWxzb2lGQlVoTGJaVGZwek1OTGdRVEZGcUwxb1BaVjRVWnZkcEpUV0h1c3BnZ0V2bWxKQ1ZkQ2c1c2NpWXNTRDlDTHFJWUdLSUxiYVEycTczYTJHbHRnS0JSVk5tdXpPdkI0UzA4M3N6T3pNenU3c2duMXU4Mzd2OTMwUEg3dmZ6eXRVdytSTUN3dXRUMkJyTi9BbzBBRnNCamF1WlB5TmNnTWhDL3dJVExQMDU3Y2M3aXBVTlY4SkVpcDcvTW91Vkk2QjlnRDNoWnpyRnNJa051K1FTVjBNMlhlVllNSVQrWFpzZXdoNExuQWZieFQ0QWt0ZW9UK1pDOXZaZi9KSk5ablBEYUFNQUMxVkNucXhpTWpyckc5N2d4NnhnbmJ5Rmg2NWZEOHR4dWRBZHkzc2ZKakNLQjdnNEk1YlFaTGRoY2QrM2dLSnI0QlVEY1g4eUdLWisramZObHNwc1Z6NC9hdWJTZGpUb0IxMVVmTW1UNkx3SkMvdS9NMHZhYTN3MkMvcm9IZ1cyRjFQTXg5K1lzTzZ4K2w1ZU1FcndWajdhUTNUT0ZtQVR1WnZEL2tsM0ZuaDhXdzNLbE5FMzdhaVltTWJlK2hyTyt2V3VMekNxb0xLS1JvdkMyQmcyc09vdXJvc0MwL2s5Z09kY1ZyNW9uUXhkdVVadDZhVkZlWm9yRUpCRUk2NGgwOWZmSURpUGRjQU0yYWxTbGdVelljNHRPMW1hZENnMExLUDVwTUZNREd0cDUxQkE5RjZINzNWWTdDblBBUzdHcUFTREdXbk0yUUFXK0kzQ1lwc2RVWU1ZRk1EVEFLaVpXNkdXMW9UVWVabkFEZGRFcHVGT1dmQVFNdURUWU9vaTdCb3hVdHp3MUFwY3pPQTZRYW9CRU9aY29ZTXNMNXNnRW93cFBpTk0yU1EzdkVyY0NsK200ck1yTGl0NGI5dDQrMTRYUUlnOHBaYmVFVTRNVXB6YlcrL3M3NzF0RnZEc25CNjYyMWdPRTRqWDFST2VEMUU3NXdrczlkUEF0L0g1ZVREZVFwL25QSnFkRHp6TDI4SDR6eHdiNzJ0UEZoRTJFMXZhc1lyWWUxWm5lNjRoSEFJc090dDVvS05hdHBQRnR3dVA3MnBqMUh0WjduS0dCZUs2bEV5N1o5VVNuUy9yV1hheDFCZUJpSVhvQU93aE9vUk11MGpRWkw5NnhBZjVyc3c3RW1nN0NKZEU0VHJDRDBjVEgwWHRJdi9mYml2N1FlVzdNZEEzcU8ycTExQWVCY3Bkb2FSaFRDVm5nOXlTVXdkQkE0QXJlSDhWbGxFK0F3WXBEZVZyMmFBOEtXcGtmd21XdTFuVVo0SDlnZnNkUWJoVXhLYzRZWFVYNkhuTENGYUxXMDg5eldxZXl0a1RaRk9QUlZwbmhLaXZla3M2emorZTdhTnlQRkljemlJSnR6WGNRSGtJODkyWVlMZTVMbEljemlJL21xMml3UEFQeTR0QzlqeVd1VHhIVVFYN3RzK2gzTFNwV1dJVFBKYTVQRWQxS1l1VWRqd0psQXFONGM1ZjZJbVl6dW9qZkRoQitlQndkVnYxVmQ1NlJHM24wbGthbGY1bVUyT0ErZUFDMnhNZWY4Um00clI3RjVHczVYMjVidmM1WC9OdjFvWTlxZGJGa2wwQUFBQUFFbEZUa1N1UW1DQ1wiXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBwdXNocGluID0gbmV3IE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4obmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGRhdGEubGF0aXR1ZGUsIGRhdGEubG9uZ2l0dWRlKSwgeyBpY29uOiB0aWNrZXRJbWFnZSwgdGV4dDogaW5pdEluZGV4LnRvU3RyaW5nKCkgfSk7XHJcbiAgICAgIHB1c2hwaW4ubWV0YWRhdGEgPSBkYXRhO1xyXG4gICAgICBtYXAuZW50aXRpZXMucHVzaChwdXNocGluKTtcclxuICAgICAgdGhpcy5kYXRhTGF5ZXIucHVzaChwdXNocGluKTtcclxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIocHVzaHBpbiwgJ2NsaWNrJywgcHVzaHBpbkNsaWNrZWQpO1xyXG4gICAgICBtYXAuc2V0Vmlldyh7IG1hcFR5cGVJZDogTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLnJvYWQsIGNlbnRlcjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGRhdGEubGF0aXR1ZGUsIGRhdGEubG9uZ2l0dWRlKX0pO1xyXG4gICAgICBpbml0SW5kZXggPSBpbml0SW5kZXggKyAxO1xyXG4gICAgfSk7XHJcbiAgICAkKCcuTmF2QmFyX0NvbnRhaW5lci5MaWdodCcpLmF0dHIoJ3N0eWxlJywnNDgwcHgnKTtcclxuICAgIGNvbnN0IGluZm9ib3ggPSBuZXcgTWljcm9zb2Z0Lk1hcHMuSW5mb2JveChtYXAuZ2V0Q2VudGVyKCksIHtcclxuICAgICAgdmlzaWJsZTogZmFsc2UsIGF1dG9BbGlnbm1lbnQ6IHRydWVcclxuICAgIH0pOyAgICBcclxuICAgIGZ1bmN0aW9uIHB1c2hwaW5DbGlja2VkKGUpIHtcclxuICAgICAgaWYgKGUudGFyZ2V0Lm1ldGFkYXRhKSB7XHJcbiAgICAgICAgdmFyIGxsPWUudGFyZ2V0LmdldExvY2F0aW9uKCk7XHJcbiAgICAgICAgbG9hZFRydWNrRGlyZWN0aW9ucyh0aGlzLGxsLmxhdGl0dWRlLGxsLmxvbmdpdHVkZSk7XHJcbiAgICAgICAgaW5mb2JveC5zZXRNYXAobWFwKTsgIFxyXG4gICAgICAgIGluZm9ib3guc2V0T3B0aW9ucyh7XHJcbiAgICAgICAgICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcclxuICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCA0MCksXHJcbiAgICAgICAgICBodG1sQ29udGVudDonPGRpdiBzdHlsZT1cIm1hcmdpbjphdXRvICFpbXBvcnRhbnQ7d2lkdGg6NDUwcHggIWltcG9ydGFudDtiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtib3JkZXI6IDFweCBzb2xpZCBsaWdodGdyYXk7XCI+J1xyXG4gICAgICAgICAgKyBnZXRUaWNrZXRJbmZvQm94SFRNTChlLnRhcmdldC5tZXRhZGF0YSkgKyAnPC9kaXY+J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgICQoJy5OYXZCYXJfQ29udGFpbmVyLkxpZ2h0JykuYXR0cignc3R5bGUnLCd0b3A6NDgwcHgnKTtcclxuICAgICAgcGluQ2xpY2tlZChlLnRhcmdldC5tZXRhZGF0YSwgMClcclxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoaW5mb2JveCwgJ2NsaWNrJywgY2xvc2UpO1xyXG4gIH1cclxuICB2YXIgY3VycmVudExhdGl0dWRlPTQwLjMxMjg7XHJcbiAgdmFyIGN1cnJlbnRMb25naXR1ZGU9LTc1LjM5MDI7XHJcbiAgZnVuY3Rpb24gbG9hZEN1cnJlbnRMb2NhdGlvbigpXHJcbiAgICAgIHtcclxuICAgICAgICBpZihuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pe1xyXG4gICAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24gKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbG9jID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcclxuICBcclxuICAgICAgICAgICAgICAgIC8vQWRkIGEgcHVzaHBpbiBhdCB0aGUgdXNlcidzIGxvY2F0aW9uLlxyXG4gICAgICAgICAgICAgICAgdmFyIHBpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKGxvYyk7XHJcbiAgICAgICAgICAgICAgICBtYXAuZW50aXRpZXMucHVzaChwaW4pO1xyXG4gIFxyXG4gICAgICAgICAgICAgICAgLy8gLy8gQ2VudGVyIHRoZSBtYXAgb24gdGhlIHVzZXIncyBsb2NhdGlvbi5cclxuICAgICAgICAgICAgICAgIC8vIC8vIG1hcHMuc2V0Vmlldyh7IGNlbnRlcjogbG9jLCB6b29tOiAxNSB9KTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMYXRpdHVkZSA9IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMb25naXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudExhdGl0dWRlKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRMb25naXR1ZGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICBmdW5jdGlvbiBwaW5DbGlja2VkKHBhcm1zOiBhbnksIGxhdWNoVGlja2V0Q2FyZDogbnVtYmVyKXtcclxuICAgICAgLy9jb25zb2xlLmxvZygnZW1pdCcsdGhhdCk7XHJcbiAgICAgIHZhciBzZWxlY3RlZFRpY2tldCA9IHtcIlNlbGVjdGVkVGlja2V0XCI6IHtcclxuICAgICAgICAgIFwiVGlja2V0TnVtYmVyXCI6IHBhcm1zLnRpY2tldE51bWJlcixcclxuICAgICAgICAgIFwiTGF1bmNoVGlja2V0Q2FyZFwiOiBsYXVjaFRpY2tldENhcmRcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coJ2VtaXQnLHNlbGVjdGVkVGlja2V0KTtcclxuICAgIHRoYXQudGlja2V0Q2xpY2suZW1pdChzZWxlY3RlZFRpY2tldCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNsb3NlKGUpIHtcclxuICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2ZhIGZhLXRpbWVzJykge1xyXG4gICAgICAkKCcuTmF2QmFyX0NvbnRhaW5lci5MaWdodCcpLmF0dHIoJ3N0eWxlJywndG9wOjBweCcpO1xyXG4gICAgICBpbmZvYm94LnNldE9wdGlvbnMoe1xyXG4gICAgICAgIHZpc2libGU6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBsb2FkVHJ1Y2tEaXJlY3Rpb25zKHRoYXQsZW5kTGF0LCBlbmRMb25nKSB7XHJcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zJywgKCkgPT4ge1xyXG4gICAgICBkaXJNYW5hZ2VyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuRGlyZWN0aW9uc01hbmFnZXIobWFwKTtcclxuICAgICAgZGlyTWFuYWdlci5jbGVhckFsbCgpO1xyXG4gICAgICBtYXAubGF5ZXJzLmNsZWFyKCk7XHJcbiAgICAgIC8vdmFyIGxvY2MgPSBtYXBzLmdldENlbnRlcigpO1xyXG4gICAgICB2YXIgbG9jYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihjdXJyZW50TGF0aXR1ZGUsIGN1cnJlbnRMb25naXR1ZGUpO1xyXG4gICAgICAvLyBTZXQgUm91dGUgTW9kZSB0byBkcml2aW5nXHJcbiAgICAgIGRpck1hbmFnZXIuc2V0UmVxdWVzdE9wdGlvbnMoe1xyXG4gICAgICAgIHJvdXRlTW9kZTogTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5Sb3V0ZU1vZGUuZHJpdmluZyxcclxuICAgICAgICByb3V0ZURyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICB9KTtcclxuICBcclxuICAgICAgZGlyTWFuYWdlci5zZXRSZW5kZXJPcHRpb25zKHtcclxuICAgICAgICBkcml2aW5nUG9seWxpbmVPcHRpb25zOiB7XHJcbiAgICAgICAgICBzdHJva2VDb2xvcjogTWljcm9zb2Z0Lk1hcHMuQ29sb3IuZnJvbUhleCgnIzAwOWZkYicpLFxyXG4gICAgICAgICAgc3Ryb2tlVGhpY2tuZXNzOiA1XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaXJzdFdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogdHJ1ZSwgdGV4dDogJycsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEMEFBQUEwQ0FZQUFBQTViVEFoQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBaDlTVVJCVkdpQnhacHJiRnpGRmNkLzU5NnM0L1Y2dlU1c0VsTzJJWEdhaDIzeXNKMUVFTkh5VUIra2xINkJ2cUJxb2EzVWg1RGFTa1dJaWxKVXFTSWlxb0w2VUlWYXBMWWkxT1VoRUxTZ3BoVW9rSVpFSkNZeDhTT0pZMXlKQkNleDExNTcxMnZ2N3AzVEQ3dHIxc0hHOTNydnF2OHZPM3Z2ekgvTy84N01tVE1Qb1l6bzI3QWhQR1ZabjFlUm00R3RpS3hCTlpKL1BRNE1vSHBDNGRWMEp2UHl0ZjM5NCtXMHB3QXBCMm5YcGsyTmpqRVBvUG8xSU9TeTJLUkNoNG84MHQ3ZDNWOE91d3J3VmZTaGFEUVlqRVFlUnZYSFFHQ1JORm5nTVNjWS9QbTJZOGNtZlRSdkJyNkovdWY2OVJzclJQNVZhOXRSWHdoRlRvbnE3VnQ3ZXJwOTRTdUM1UU5INFBiYTJvY3FSVTc2SmhoQWRZUEN3YzZORzYvempUT1BVbHY2NDgzQjRFdS9YN1ZxUzQxdCsyTFFoeUFTdHgzbms1djcrdDd4aTdLVWxyNjF4cmE3SG8xR3l5Y1lRRFhpV05iZnUxdGFsdnRGdVZqUnR3SXZQTkRRVUh0VllMSCt5aE5XcFZVZjk0dHNNYUszQXgwN1FxRWx0MFFpQzJiMkVYZDBOamZ2OG9QSXErZzY0RVdnK2tjclYvcFJ2eWVJNm03MVljWlo0akgvSHFCaFd5aEVVMldscDRJOXFSVFBqNDF4SXBVaTZUaEViSnR0b1JCZlhyYU1hRVdGT3hLUnpTZXV1ZVl6bkR5NTM2UGRzK0JGOUViZ0d3QmY5TkN0TTZyc0dScmkyZEZSdE9qNStVeUczcWtwL2hxTDhZTXJydUNlK25wWGZPbzRkd01saWZiU3ZlOEZiQXU0cWFiR2RhR09XR3pmTTZPanR5bnNBcjRIdkF3ZjZNK3E4dXVMRi9uajhMQTdRcEhianJhM2wrUTkzWTRQRzdnQTFEVlZWdkpVWTZOYi9tZGJlM3ErTk1mekc0QU9vS0h3d0FJNkdodFo1MkxZcURFNzIvcjYzblJyeE9WdzI5THQ1SndZVGNHZ2EzS2orcXQ1WGgwQWJnRlNNM21CcDJJeFY3d2kwdXJhaURuZ1Z2Uk1KVkgzODNLeXJiZjN5RWU4UHdIc0xYNXdPSmwweS8wSnR4bm5nbHZSYXdxSmlQdm9hMWlZNWJ2bXdwK0svOFN5V1hmTWxsWG4xb2c1aTd2TUZ5NGtsbHF1ZmQrVnI2MWV2ZEFBN1FkbWxvK3VweTVWOTJOc0RyaFZNTlB2RW83amxydWlOaGk4WllFOFM0R1pEM05qT1B3UldUK0FpSlMwdytKVzlLVkNZdHk5YUJCNTZPbWM1NThQTnhkc0NOczJkeTEzdDZZd3hyaWMzK2FHVzlHbkNvbHptWXdYL3RaMUxTMi9tU2QwRk9BQmdBb1JkbDkxRmN1WHVJdVZMSkYzdlJqeG9mSXU4eDBpNzVSNnBxYTgxYUQ2L2VQTnpjOTNOalZkWGZSVWdOM0E5ZXNxSzNsaTlXcDJWbGU3cGpTV2RjeWJFYlBoSlhqdkFqYlpJaHpjc0lGSzl3NnRnTFRDYStjeW1YY1BURXg4S20xTTg5YXFLclpXVlhsZFFVeFhwOU9SZGYzOTAxNE5LTUJMN1AwMHNNbFI1VWd5eVEwdW5VNFJLZ1ErRncwRVhJL2RlZkJxS1lMQlcremRRYjZMdjU1SWxGSm5TVkRWbDBybDhDSzZuL3pxNXNERUJJNHVGSGVVQVNLTzVUZ3Zsa3JqZFdEdUJSakpaam40LzJodDFmMWJUNTgrVnlxTlY5SDdnVTZBRjhiR1NxM2JNMVRrQ1Q5NHZJcFc0RUdBTnhJSjN2YzJaNWNHa1hOTG9lVHhESXZiR0h3Rk9PQ284dVRJaUI4MnVJS3E3bTNwN2s3N3diWFlMZUI3Z2V3TFkyUEV2WVNsaThkWU9wMytnMTlraTkybHZ3aXN6S2p1V0NMQ2pwRGJnOG5GUVVVZTJYN3FWRW43WXNVbzVZVGpwOEIvOThWaWpMaGRCeThPSStucDZjZjhKQ3hGOURqd3JaUXgrb1RiVGIxRlFPRVJ2dy9yU3oyMWZCWDQzZE9qbzV6eHVoQnhoelBoZFBxM2ZwUDZjVlI3djZONmV2ZlEwSUo3UTE2aDhNTlM0K3k1NElmb1NlRHV6c25KelA1eC8zcWh3SE50UFQyditFWllCRDlFQTd3SjNMOW5hSWlrTWFXemlhVFVtSitVVGpRMy9EeFlQcHd5cHRsUmJibld3NGJBWEJEVlg3VDI5Wlc4c0pnUGZyVjBBZC9lRjR2MXZwTktMWnh6Zmh3UFdOYWpmaGswRi93V25jaXEzdkh3K2ZPSjZjVXRQYWVOWlgzVHIzQnpQcFRqM3NTbFVjZnBUS3ZlZVYxMXRhZWRJQlg1V1h0MzkzTmxzR2tXeW5WWjVHeFBLalhXRmdydCtwakxZeUNCdzJkNmVyN3p6TUtuSWlXamJEZGtEQndaU0tjYlAxdFRzNlZDRm16d0NWUjNmWHE0aktGZEVWeDN2MFBSYURCWVhiMVM0VXF4ckJVQ2RZaEVWRFdDU0NSLzU3TWFRS0ZTSUdoQS9qdzh2T09lK3ZxUDNrVlVQU2VXTlpSTGFncVl5dk9rSko4R0VvakVVWTJqT2lZaWNZV1lHbk1Sa2ZQeFZPckNUWU9EcnNMQ1dhS1B0cmNISkpuY2JOdDJ1NnF1UTJRdHFvM0ExVUJ0VWRZRUlwZFFqUmNNRVpHNHFxWVFjZFNZY1FBUmNhWWdlWGhpNHI0YncrSGk4a1VXeUg4RS9xS3FOU0ppNTRYWHFLb05JSlpWZzZvdElzRlpIemozZTBYaFErY3hCZ3lxNm9DSURJaklHVEhtYUthcTZwMXR4NDdON0hqSW9XZzBXRlZUODFYZ0xvWHJ5WjB2RFFLOXFBNklaUTFnekx0cTJ4ZXNUT2I5WkRJNXRQTzk5enpOU2JlRncvVVBScU92VjRnMFhmYXEyd2tHZDVSeUIvUlFOQm9NaFVJTkpoQzRVaHhuSlphMVJvMXBGSkcxbXJzeXNocVlCdDVBWk45WU10a2h4NXViLzYyd0JkVy9xY2cvVERiNzFyYlRwMzBmVzI5djNMZ2F5M29MS0Z3dW1WQ1JhOXU2dTN2OHJxc1lSOWV2cjdlV0xOa3VJbDlBOVN2QTI1Ym14dUs0V3RZRlcvVUM0WEM4SEpXMzl2VU5hdTRxZEJZd1lsbDNsbHN3QU9GdzNJSWh6VjBmaVFNUjZkcTBhVm5XbU8rSzZ0ZUJscnpqT0s3UUo2cG5qV1dkeFhFR2pXMmZTOGZqbDd4MjdjdnhkbFBUZlVCRmEyL3ZMMzJRQkVCM1M4dnl0REYxcWxvdnRyMUdqR2xVa2JWQWs4QVd6UjBIbnhTUkp6VVFlSHlXSXp1eGVmTUtrOGxzVjh0cUU5WDFlVWUyRmxoUmxHMENlQjhZblhGa01Fck9teWFzM1BqQnFFNWFJdE1BcXBvRTBnQUtDVkhOYW1FK0ZnbEkzaGtKTEVXa0tsKyswaExKSGI2clZnRWhoVHFGT29IbEFuVXFVb2RxSGJNanl3dW9ua1ZrUUZSUEtYUmFnY0RSTFYxZEZ3c1pYRTFaUjl2YnF3S0p4RXBIcENFL1hUVVlrV1VZVTR0SXJaV2J1bXFBQ2lBaUlsWmViS1RJb05xaStwYmxmNVdjeDRYY1hadkMwSElLQisrcW1nVW1FSmtXaUNtTWlERWpCa1pFWkZoRWhoMlJFVHVkSHBtY25JeTU2WW4vQThGSVMyMDVPU0tlQUFBQUFFbEZUa1N1UW1DQydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICBsYXN0V2F5cG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiB0cnVlLCB0ZXh0OiAnJywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRDBBQUFBOUNBWUFBQUFlWW1IcEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUFDWEJJV1hNQUFBQklBQUFBU0FCR3lXcytBQUFZMWtsRVFWUm8zcVdiYWF4bDJYWFhmMnZ0Yzg0ZDN2eGVEVDFQN25iYjdtN2IzYzVrNGhnTE1CL3lJYkVpRUVJSkVpQUhnUkFTZ2dCQklSOVE1RWdnaElRVlI5QUppYkNJRVFxS0ZER0lLU0dPb1JQU2RsdmRkTHVySjNmMVVGVmRWYStxM25TbmM4NWVpdzk3bjN2dnE4RmREVWU2OVc2OWQrODVlKzAxLzlkL2k3dHp1NWNacUtiM2J1QUtPQmlHdTJBT0JwaERkTWM4L1Q0aTRJNDdJTGU0dVlNSUlFTEFFWEZVbENDQ0NpaWdRdm85Q2dKaUlIcmoydDd2a3RzUjJqMnZWY0RNY0ZYY0RIUEIzREFVYzJnczRpaU5HNjA1clVNMFQ1dmg0SUNadTZpSU9RNk9pb2lidTZxSVpNRlVvRkFoNUorbEtJSlJha0FGQW9hSW91S0lLbUtHWm9tOTI3ei9INkVkd01BbHZYZXp0SGgzb2l2UmpjYWR4cUIxcDQ3UUF0UFd2REVuT3JTZDBPWVlqb2dzTk83ZzdpaUNhTkpxa1YrbENyMUNwUUNxQUtVSWhVSWxrcTNBVUJHU2dTaEJrOFpGYjIxUUFNWDdDZXg1OTAzU29pTWtRY3hwUFZJYnpGcW5ObWRxN3JNSVV6UHE2TFFHalRremd6b2FyVUdVdERCekEwQkZVQldDa3dRS1NrK2hERUlwMEF2bWxTcURBSldLOUFxaENsQkpuRzlNMHI1anBQZldhZlNEQ3QwSlRQYlA2RW03clNWdDFnYTFPWlBXbVVUM1NXdE1zOEJUZy8yNjVhaUJVZVBzTlpIRDJoakY5Sm5XSGZQMEJKRmt2bjJGbFZKWXF3S2JSVWp2UzJHakN2VFY2S3ZTSy9CaFZBWkJwQitFbmdwUm5US2srRkpZV3JNZ3VOeGE4T0pXQW5jTzRnZ0d0REdaY1cwd2FaMlpPYVBXZk53NG85YVltbk5VTzVlbUxWZHE0L3c0Y21YV3NqK0RHWlllM3Uya0xEOUZ3T094MVpXcWJKUndzbDl3MTBwZ3AxSk85QXJXSzJIVUdpc2grTENFUWFFeVZLR1BVTHJqR2lnMEJUM0p6bjJ6MkhtRFQvdGMzcVFOUTRudTFGbXdTWFJHamZ0UmF4eld4c1NjL1NaeWJ0UnliaFI1ZDl4d2VXcVlKTXR3RTZJYlNJcnUwc21lbnl2Wkp6czNFbmRVTlVkdklSaWNIQ3AzRHd2dVdTMjRjMUN3VlFZR0txeFd5bXFwckJRaWd5RDBnMmEzRUlUczd6bXF5YTJFdmw3ZzZCQmRtRVZuR28xUjY0eWkrMEZ0SE5TUm85WjRkOVR5M2FPR2Q0NWFkdXU0RUZTUzc3dWxlN2tJdU9EY1BIQUtBdUpKYUVsQkxRZ0VCMUVuaUxEVEM5eTdVdkNoMVpKN1ZncFdTMlc5REt5Vnltb2hNaXlFUVZDcUlBUnhnbkJUd1lzYkJLYkx0VUxyS1FDTlcrZW9OUTRiODRQR09HaWNLN09HVi9aYVhqOXF1RGlPUkVpQkt2dCtsNnZKdWR2ZEVlRjdDTDM0akpMQy9UeEhlNHJtbHliRzFXbk54VW5rUTdPU1I5ZEttajdVWnJTbUhsM0ZIVnlFbnVvOHpTb0xDNU5PYU8vc1B5L1drQlN3Y3FBNmFvMzkybnl2amh3Mnpqdmp5SXZYWnB3OWFqbHFuUmlOTm4vSFJMQm84N3pzblppK3ZMVnlrL2MrLzVVQTRrTEVrOUJCYWMwcEZLSTQ1OGJPWG0xY25VVWUzK3h4NzdCSTlVQjZuS0NhRXJZS2hhVENLQlUyU2NaamdjdzloZjAycGtBMWpzWlJZeHkwN3RmcTVNT3ZIVFk4ZjdYbTNMaWxObWdzRlNLUlZJaTRlMHB2dnJBZFI0N0xlYXU0S292TjZUNXFJbWhyU0U1Rk1hY21hNXd6ZXcxSGpWTnY5M2xvcmNERndNVmRUQ2lCWExrVm1tSkZaK2FGNTJCaXBGeHNCbzJub0RWcW5iMG0rdDRzcFoxWDltdStmWFhHcFVsazVrNXJRalNuN1VwUUE4ZUFIRFdGSkREZkkzOWMvd2RabUdIS2FrNTBSMXlUNjBrS0ZsSFRCcnd6YXFuamxOcExIbG1yVWlHRnVJcUlpaEZFYzR4STkxUVJDb0ZjSmladE5RYlRDT1BHT1d5aUh6Yk9RUk41L2FEaHVhczFseWVSbVVNZG5XaUxITzZkaVhaUk9xZUwyNi9zYjdJSk9RT29DTzVHZE1GY2NIR0NhNG9CT085TldwN2ROUVRodzJzUU5GQm85RUFRV2FvQXV6Uld1Q1VyaURHWlRXMldJN1hOby9SM2oxcStkWFhHcFVsTDQ4bWtvd3ZSak5ZbEd4eVlMSUtISDEvK1BCdTAxbTNTNHU5QklHalNnR1lUbkc5V3Qza2lxRnNxWTEwWDNVYnVOQzVOSXQvYW5WSUpoSkFpZnluaWhZb1VhcWdvaXFPRlVKaDJDbExhYUV5ak0yN2RENXNVcEM2TUl5OWRuWEZoMU5LWVUrTTBKbmhNRFlmVCtac3VGcnZrbDdYQkpCb2w4TEd0SGs5c1ZkdzlMTmpvQmR5TXZjWTVQMjU1NlZyRFMvczFqVVVHUVNtNytqa0xUZDVVeFZMZWQ4VmowcGhqdUFqbko4YnoxMnFHcFJKV0NpcDFTaFZLVlFweHlxQjRMbmVwYzRjMGEyRVduWEVUT1dxRmEzWGtPd2MxcngxRm9qc05Rb3lwMHpLWDFGS0tIby9EMmRUYlhBRC80TWtlZis2aE5UNXpxaStUMXZqV2xkcmZPS3c1ZTlnQXNGa0puejA5NEc5K2JFTUdRZmpHZTFQL04yZVBlSFozbHRLTDVxaVFoYmNjbktJYjZrbFJ1TktvSU9KODk3QmxxMWV6VmlyOVVOQ1A3cjFvVWlDb1J2b2VLTXpKL2dJellOTGlSMUU0YWxyZVBHdzVzOWRnYnFtTHlwRjZXZUJqZ2RkVE8xa0lmUHJrZ0wvKzBUVjJlc3EvZk8yUW4zbDIxOSs1VmpPUGExMy81NHZjZHU5V3haKzlmNVV2UGJYRjdzVDU4aXQ3ZlBQeURJUGNZeSswN3FLcGFYR2x0UlE4Z3dodGdCZjNhazcyQXNPZzlGWHBGK285UlNwUGpZN1UwWmxhWk5JNGh3MWNtYlYrZFJwNTQ2amhtVXNUM2ppSzFORm9vdE40Q2w0bVRtb0dqNmU3eG1HckV2N1dZOXM4dVYzeWoxL2E0MnV2SGdJa1g4cTU4bVpYdDJIV3BscjFKeDllNCs5L2ZKTS8ycTM1cHkvdXNkL1lEZDlQVWQ1UUY0S21qcXRLN1NnUHJSWjg1bFNmQjFaTGR2cUJuYXFRdFI0TWc2Sk9FcVF4bUpyNUpEcjdUU292M3hxMVdMYUNTQWNFM0ZqQ2UrNm5IOTJvK09jL2RKcm96cWYvMHptKzl1b2haU24wS3FYVVJUbDRzNmd1SXFsL3JwU3lFSDdqdFVNKzlSL09JZTU4NVlkTzhPSDFrc2JJM2RueFNPOTBGYUFreGJoeDlxamgzYkZ4MEZqcUJNMjhpYWxpMUdTeWtycW1hSXhiWTdjMlhqOXNsd0FBeWFWbHFxRTlWY3B6Z1djUlByWFQ0eDk5M3c3LzdxMGp2dmg3RjZtajA2djBXRFR1R2cweFI2TGgwWERMeVc0cDRxc2s0ZHZvL0tXdlgrVGZ2ejNtRjU3YzVxbWRIbzB0TlN1a09zQkY1cVd2dTlMa2N2aVYvUmxYYW1NY2pYRjBwakVwcDRndXRHWk1vL3UwZFk1aXludnZUZHUwZStZcFBYbG5Va3NDQTlQb2ZHeWo0dTgrc2NuVFovWjQranQ3bEwwd0Z6YkRZMGdkb1luUUdCSnpKWk1raEY3UklRaDRTTktuSUNab3BmeVRGNjl5MEJwLys3RU52dlRDSGkvdTFmVFVsem8wU2ZyT2FUR1lZeXE4TjQyOE4ybzQxUXVzRkVZZGtxeEY2d2tNbUZucXBBNW1rYmNPR3N5Z1pRRWVlTmNwTFYzUm5KMWU0Tzg4c2NsdnZ6dmg2VE1IbEZVNG5tdnJpSXdhWkZRbndXMEJZczN2NWpPOFVGZ3BZVmpCTU13M1YwVW9DdVhwVi9mWnFKUy84ZEVOZnU3YlY3azJpNVJMeTBsOXZ5TzVVU3JjaVNhOGVkVHk0SnF4WGlremMyL01SV1BHdGVxWXpIUy9OczVQMmxScG1jeXJ0ZU9sUmpLeDJwMHZmbmlEYytQSUwzMW5qeUlzK2EyUWhMMDhScTlPa0ZsTVh3eTZRUC9tTHhBelpIK0tYQjRoZTlNVVJEcHpSeWhVZVBxVkE4NVBXdjdpdyt2RXJJaWxvSUF2ZDNpV1RQN0N4Tmh2SXRQb3pMSjVhOEs2MGkvR3JYTnBGaGxIaUVqMkVjbWQwbkVVb2pGNFlyUGl5WjJTTDcrOHh6UmE2bVE2Z1k5cTVNb1luYmJKeERXNXlLUXhKclBJWk5xbVZ4MlRuK1lORVRQazJoUzlPbDRDR2xKN2VOUWF2L3JxQVk5dmxqeSttZng3NGR0ZFIrY0pkdllrdzdnMUxrNGowemJKMkxwVDVCYlNhL1AwZ1hHY1I4TjVlOWgxRDh2Qnk1dy8vOEFhLyszOG1GZjI2MFhySmlEVEJ0a2RKOS9WMU01Tkc2TlhDSC95b1hXZXZIUEl6ckJnMWhxdlg1bnh1MmNQT0gvUVVJVlVqdUtPSE0wUUJUOHhSSEl0TCs2YzJhLzUvWXNUL3N3REsvejh0MmVVdmtoanFZdE1hK2dzMUlFTFkrTWo2OFlzS3JXNUYrYXArVzhOWmdhN3N4YTNoWmwwcHIyczVlanc0RnJCd3hzbFh6NnpSMjJwSU9sQU9TNk41Z0tiTzIxMG5ycHJ5TTk5OWk2ZXVuTW9KMWRLaHFYUUdseWJ0Snpkci8xZmZmc3l2L2JjRlpwb2xDSDF3N0kvZzJHRkR3c2szWTVSNi96MzgyUCs0Wk03UExSVzh1Nm9YZkx0cFBPNXdqS2djR21TMnVDWVpTMWNFanJaZUdUV1J2WWJ4OFdKc2Z0UzV6c0xUVGZtL09DSlBtZjJhczZQMjBXWktNRCtGS2xURStEdW1NR243MXZscXoveG9EeTQxVDhXQ01zQXAxWkxUcTJXOHZIVEErNWRyL3dYdjNHQmFlTXBQcmpqbDBmd3dHYmFoQXdJdkR1T3ZIYlE4S21kSG1jUEcwcVZ1ZENwRGs4YWo1WjI2ckF4WnRGUzcrK2FmTnB5OTNQWXBQVGt1UlZMNFA2TkZWUmo4TW10aWhmMmFzWnQwa0NLT0lydVRSRk5HOUJFNTQ3VmtsLzd3Z00zQ0h6OTFTK1VuLzNzWGZLRmoyd1JRcklRSktVNm1iWnpTRGNJSE5UR3EvczFqMjJVYzc5ZXZ0d1duVm1VaEFRZDFEWWZPbWlxWVZNaFA0cVdZRjhUZkFrNHZyN2NMQlR1WFMxNTQ3QmxHbjN4OTFrRGRaeC9ybDhxUC9YSmJSN1pHWEM3MXk5Ky9oNVpxNVJveVVsRkJmWm54OUxjS0RwblI1RzdWd3I2aGQ1WXBjMExDY0VUUU1kUjlEeVpBWFd6UEc5S3RmVU5UZjkxaWphSEU0TkFjTGd3Ym1rN254ZVFIS2s3SUdHMVZIN3k0eWR1VzJDQWU5WXJQbkhISUFlbHBHMnRtMlByaUdic1RsdHc0VVF2cGFxYnJibXIyeHluOFl3T21hT0lvSm9taW0yVURQSGNHdkZ3WUNVSTAxempkdjRNSU0yeVJVQVpsTWRPRGQ1bm5IYmo5WDEzcmMwREk1Q2E4azZlL0t6V29BRUdoZHh5cmN2ZmFkdVlTdUE4RFBqQWtJNktwbEh0OFR1RHhia1pPaEQwL3cwc1d1MHRxZXVtQzB5OWM1cUgzZDZleHFXYmFPZkRrb2RnWFp5KzFhMEVHRFdSWGlFVUdVRG9BRHl2QWl3MUE2MEpSN1h4UWErejE1cFVVdWIvMjlMYzJUTXFVK1N1Yk5hOC8vM2RvUW9odXd5b3FCSlVVSVF5eUJ6ak90WlZMQXN0Y0sxTzFkZFdGVkRKZ3poSTlYUCt2QXFNRytPL3ZyNy9nZFg5djk0K1RJRXNQMStxWW5uQWhvcXdWaWtGd3JYR0Y5bGo4Wkg1V3BHMHRsSlNPWnVtcEo0RUNHS3NoQ1N0U0NvNnV6bmI4cXBGaEVscnZEZHVlV2k5b0srNndNVUc1Und6VW9GUkhmbjE1eTUvSUlGLzg2V3JmdjZ3bVZkNHVPT3IxZHlDSEJnRTVmNlZrc3ZUeUdGck4xcGxSeUxJd3dJa3hTSHBTdjNRelhkRldDMlY0STQ2U0xaemtlT0s2bHErRi9acUh0dW9HQlFwVWdNUUJGc3BNOUNZQXN6L2ZQdUlyL3p2UzdlbDdUZXVUdm5TMXk4d2JtSmFiTmUvcjVaMHl6Q0g5Vko0ZUxYa3pINTlVelJHWkRFcFZFL1E0WG9saExURVJOTW9SQ2dTbHNSYXBhbmtVK2FSV1VTT3FidFU0ZG5kR1IvZnFqalpEd3R3SURxK00waVJ3ZE1zNnJDTy9NTFh6L0hMejE3MEsrUDJwc0thTzMvd3pwSC85RytmOWU5Y25peUdidWI0V2krVmJuUVRHRGc5REh4a3MrU2JWK3FsYW94NTFkYjEyVUZUV2J4U2hUVFJsRFRtS1VKK1Uyb2FkVzcxQTlmcWlOcUM0R0x1eHdkZ0FpL3YxZXcxeHVkT0QzanpxSjEvaGw2SmIvU1JYSm1WcXV5T1cvN2VmM21YUDNocjVIL3E0WFVlMnVxeDNnczAwYmx3MVBETmN5UCs3WXRYZWYzS2xDSWt2OE1jTHdOc0QrZ1FqR1Rhd2g4NzJlZXdNYzdzMTVUSHlEVU9KTFJHOC9CUEJIWjZnVjRlNDRaTzZESkFGWVJCRUU3MWxUY1BPNEZ0eVQrV0FIcEpTTVZ2bmgzeHhVZlcrTS9uSjd3emFsTHphY0RXRUc4c0FRZFo4RG82Ly9yNVhYN3I1V3M4dE4xam94OW9XdWVkZzVvTDJZZXJzS1JoRmZ6a0VDOEV5YnlVNlBEZ1NzR1AzcjNDVjc5N21MZ3FTNGhzRWprQkNaclpTUWljNmluOWtFRERNaUNxaWJjaGxRajlBS2Q2Z1VwSXpKM3MwOGsvajd0bEZZUm5MazI0T0kzODlLUHJlWUNmWFNtM2hMWldnYWNOQ2lyMHl6UjlmUG55aEdmZVB1S2I1MGZzamx2NlJVSXdCU0FhWGlsK2FnVWZIdmZsUXVFdmZHaU5LN1BJSDE2ZVVvWGp1WHh1MnJJWStaWXEzRFVJOUJKbkpVRlFoU2JuTGtPcWJqWjdnVk9Ea0tHYUZPQTZ6UzRQSGpVakZWOTVlWi9QbmU3ekV3K3Mwa2JQODZXVXZueG5pTzMwb1ZTSWhuaDZWaFZTL09nVm1nSVJMRXg0clllZldNRlhsZ1ZPOFBDUDM3UEtqNXdhOFBTckthVXR3MUt5YklVaTg0QjF1aC9ZN0FVR1JacWFGQUlhSkJGV2VpcjBnckJSS3ZldFZ0bDMwdzNVTzhUcXVMWkxoYmVPR243cDVYMyt3U2UyK2ZUcEFYVmppd0luS0w3ZXcwNnRZRHREUEFlOU5MM1BUYnpuRGRyc1lYZXNwVURZTCtZQ3V6dE42L3pJNlFFLzgvZ212L0xhQVc4ZU5WUTNFT1hTWm1zT29FRUZRWGh3dFdLMVZIcXE5RUllOFNTQ21sS3BTVCtJcnhUS25RTmxweC9ZblVZS2Qxd1Y4emh2QUxvdEVFbjBwbTljbkxKK1pwOWYvK0ZUOHBlZnVlVFB2RHVtNnVsODE3MHFraW10VmNsZlk5ZmpTVko5VHFDdXh3RkRkNmVlR1orN2I0Vi85djBuK09VeisveitleE1xNVJpR0xobk1VbEdDYXFKZXFMQmRLWGNNbFpWQ3lHd2tTWmxLaENBeFVaYUNNU3pneEtEZzRiV1NLMU9qRUNkbTBzcUNSckhBeTFTRVFwMy8rTTZZY1l0LzdUT241RXYvNTVyL3lrdjdTSm40SC9OQlhCQUlrQWJtTjE3TDJiYU9qdGZHWDMxaWs1Lzl4TGI4L0xkMi9YKzhONzFoc2lsTHFVcEZVQ3hacU1PSDE5TjBZOWdKSFlSQ25FSXhxaURVQmtNWG1RVDF6Ukx1SFphODJhdTVPSVd5Q0ZnVGMxR1VaMGk1N2w0Vy9IY3ZqSGw3VlB1WHYvOGtQM2JmQ24vdG1WM2UzWnRCRmE0elIxbFc1N0hvVzF2NjUrNnRrbC85L0YzYzNRLzgxTzlkOUxOSFRhSkxYVC9LZFVOUlFsZVBoOFFrUE5VTDNMOWFzRmtxZzZEMGcwaFZLSldDcWlncVNoV2N2Z1JXQ21HbGdIdFdBaC9iNmxOS1NEZFVKUlNDaG81YllNY2VyaUpVQ204Y3R2em83NXpuNWIyRzUzN3NIdm5xbjdpTEozZDYxTFZSTjRsSldKdFJ4L3d5VDc5cmpMbzJuanJSNHpjK2Y1b1h2bkNmUEg5dHhwLytuZk84Tldvb2J5S3c1TG00QmljVVFnaE9LVW40SjdaNzNERXNXUW5Lc0JRR0twVHFpQ2pTUktQMXRKaHBGUFliNDlvcyt1NDBjbTdTOG9lWFozeG5yMDdrT1lUR25NWWNpd2E2bUV0MzV0bFZUWlBXMkNnTC9zcWphL3o0ZlN0aUR0KzRPUFhucnM1NGU5U3dWNmVsYjFiQ2ZTc2xUMjMzK09OMzlFV0EzM3ByNVAvaTFYME9hMmVsWE1TUDVUQ3FHRmdpNGFRWmRPS1BsUXFQYjFYOHdFNlB1MWNMVGxTQnJWNlE5VkxwcTlNdkJFbWdmaEprRnBsVHA2NU1FK1B2dTRlUlp5NVBPVDl1RWpXeU5Xb3lFeWtta3B4bkJzTDFjMnB6Wnh3ZGRlZmpPMzErNEVTUGo2eFgzTGtTV0M4RDRPdzN6b1Z4eTZzSE5YKzBPK1g1cXczbXpqQWt6dWpOZUVqcUtmMXBTTlRvQXFjcWttbmZNeXo0NFpOOUhsd043UFFMZG5xQnRWSmxwVkI2SVpYUUJlNkpTNjJKYWpnSVFtc2lxNVY2YllIN1Y1VlJhMHhpb2pCNWtXalAwUVNDWXRGUVdXN21zMFp5amwvTE1QRExlelV2WEp1bFVXKzJocVN4WkxaQkU4dDNFSmhYV1IyQzB4bjEvT2V5d09xVW1uTHdkaFg0NUhhUCsxWktWcXZVUUhVODBqSmo2Z29wZWtkUC9hWm95aVREb0VTUWFPN1JqVWZXU3labVBIZGx4bjZkS0E4Tm51aElRVE9yS1BmVlN4ajBjdGxhQmFodUErVllocXFXaGUxZ2FFVUpZV21qVktsVTJDeUZwN1pMUHJSYVpDS3RzbGFxRElMU3k2WmZkSlNxRklRU3NKZExVaXdrMkRSV0t0RVNvUGpZZW9XWjhNSzFLZGVheE9RUkhIV2hKYk1UNWl2T3dpOU5SbTRYU1ZnTTlYd0JEdWFuYWE2MFFxWlFscW1XWnF0U250enU4ZEhOaXMxZVlMMVMxZ3VWUVNIMHM3OTN6WWY0RWsyeVN6MUJvWEluSXF5Z2VJV1k0RzZCSjdiVFExNjRPbU4zbHNDSE5pYnVablNaVHhWaWxySmI5UFViY0dzMSt4elM2YjRqSWdRNkFDRG4yU0J6cnZlSm52S0o3UjZQcnBkc1Y4cG1wV3hVS2l1bEpvRnpiTkNsTEhtTU1kaTFwcUtDNVlkYUlTbENaOXJoNHhzOStrRjRhYS9tM0ZITExIYzFNUjlmY005ZFVXNVNMRU12MG9FQzE2dlVsLzQ3RjNSQlpCVTgxLzlPSWVsOXFkQlg0WjdWa3NmV1N4N2FLTmtvUXhJNGtXUHA1N0s2NnkyVzIrNENPbVpmeDhsTVFwZVd1b1BFTFhFUjNJTWFoU2dmRFJYclplQ1Zhc2JyQnpXSHJkRG1TaWhhWWhhNUNHYUpPdTBaZDVyelJIUDA3L3g5eml0Y1l1eXFlSXJlZWJpZ3FoU2U2b1gxU25oa3ZlVFJqUjUzRFJJTGVLT1NGS1dETXBoWFg3bGg4aVVaNVRyejdqWkF1eFlMaDN4b1JBaVNDRzd1aWRDU0huUkhQL0RHWWN1Ym95YlJIa2d0WURRbjVvbWxpV2FhaFdTYXhSSVMwNTNCNkRTc0FtNlpBZXlKQ0VjNm4xR0o4TUJheWNOckpmZXRGbXhWS1dpdGxjcGFLVExvQkM2VU10ZmZ5OGRGYm1yZW5kQmsvNllqNWhVWmZqR2xFSk5DMUN0MWVscXdYZ2luaHdVUFRFcmVPcXg1NjhpWnhKYXk2TGdxaWFoam9obnpTaHp3ZVhQaGpxaGtURTdtSE8wZ2llaU93NkJRN2w5UkhsZ3R1WE5ZY3FxbkRJdE1jaThrazl3elVKRFBmaVEvN2dxYjYyUzgxV21kWldKTU9uNlVDeGh6cG0wcU9zYU4reWdUNEk5U0pjZVYybmxuTk9QOHhOaWRHRzMyWTg5SEk5em55YTB6OUtVcFNlcVVCS2ZRTkxLNWV4aTRkOWhqdXlkczl3UERRbGtKaWN3K0xFV0dRUmdVTXFkVExTSzEzQksvLzU1SGxEb2czMG56STh0Y3NjWmdaczZzell6L1ROS1pSbWRxenY3TU9Jek80U3h5dFlsY21yVHMxODRvSnY1NGE4ZUxrMEtURUtzbGJKU0Jrd05scHl4WXJZVDFNZ1duS2dzM0NNSXdhRHE0a2dOV2tjR0JJcC9iNnJSN3k0SEYreDVHODVURHpWSVlTa2NjOGl6Sm5Ub2FNNE5aYTB3aVBvM0dMRUtOVTdkcEV4WjhqL1JxOC9mSi9wOFduSUNNS3FRMnNLOUpxQktoRjZBZmxFR0I5TElaZDdWMkY1MkRrQTZtZVo1VmZZL3NlRnNuOEN3SG1rUmVOeXlDa3c2aXRabjNYVnZ1bUpKZ1B2TTBuNjR0MFpqU3diVE1DblNmajRLN0F5cGRwSzFVQ0twVTZnbnB5QmhlVHpzVFZncE5uVlRJUVZaREl2U0d2TmIzTzMxNFcwSWZVM3crWSttNUVERWd4a2dVSlZxa2JnV1RoVFliaTdTbXRPNGVNMkU5Y1ZrV1B0MWhjU0dqR29Xa0k0YWRGYWdMVmVFRURRUTNRZ2pwWEVaWFpjMVowSXZqaDkvcityOWMzd0x0N0lQSU9BQUFBQ1YwUlZoMFpHRjBaVHBqY21WaGRHVUFNakF4T0MweE1DMHlOVlF5TWpvME16b3dOaTB3TlRvd01GQ3prQ29BQUFBbGRFVllkR1JoZEdVNmJXOWthV1o1QURJd01UZ3RNVEF0TWpWVU1qSTZORE02TURZdE1EVTZNREFoN2lpV0FBQUFBRWxGVGtTdVFtQ0MnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIHZpYXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgIHdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UgfSxcclxuICAgICAgICBhdXRvVXBkYXRlTWFwVmlldzogdHJ1ZSxcclxuICAgICAgICAvL2l0aW5lcmFyeUNvbnRhaW5lcjogJyNkaXJlY3Rpb25zSXRpbmVyYXJ5J1xyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIC8vZGlyTWFuYWdlci5zaG93SW5wdXRQYW5lbCgnZGlyZWN0aW9uc1BhbmVsJyk7XHJcblxyXG4gICAgICBjb25zdCB3YXlwb2ludDEgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5XYXlwb2ludCh7XHJcbiAgICAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihsb2NjLmxhdGl0dWRlLCBsb2NjLmxvbmdpdHVkZSlcclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIGNvbnN0IHdheXBvaW50MiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLldheXBvaW50KHtcclxuICAgICAgICBsb2NhdGlvbjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGVuZExhdCwgZW5kTG9uZyksIFxyXG4gICAgICB9KTtcclxuICBcclxuICAgICAgZGlyTWFuYWdlci5hZGRXYXlwb2ludCh3YXlwb2ludDEpO1xyXG4gICAgICBkaXJNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50Mik7XHJcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKGRpck1hbmFnZXIsICdkaXJlY3Rpb25zVXBkYXRlZCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy9tYXBzLmxheWVycy5jbGVhcigpO1xyXG4gICAgICB9KTtcclxuICAgICAgZGlyTWFuYWdlci5jYWxjdWxhdGVEaXJlY3Rpb25zKCk7XHJcbiAgICAgIFxyXG4gICAgfSk7XHJcbiAgICB9XHJcbiAgIFxyXG4gIFxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFRpY2tldEluZm9Cb3hIVE1MKGRhdGE6IGFueSk6U3RyaW5ne1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICB2YXIgaW5mb2JveERhdGEgPSBcIjxkaXYgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7Jz48ZGl2IHN0eWxlPSdwb3NpdGlvbjogcmVsYXRpdmU7d2lkdGg6MTAwJTsnPlwiXHJcbiAgICAgICAgK1wiPGRpdj48YSBocmVmPSdqYXZhc2NyaXB0OnZvaWQoMCknIHN0eWxlPSd0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSc+XCIrZGF0YS50aWNrZXROdW1iZXIrXCIgPC9hPiA8aSBjbGFzcz0nZmEgZmEtdGltZXMnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPjwvaT48L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5TZXZlcml0eTo8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0nY29sLW1kLTgnIHN0eWxlPSdjb2xvcjpyZWQ7Jz5cIitkYXRhLnRpY2tldFNldmVyaXR5K1wiPC9kaXY+XCIgXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5Db21tb24gSUQ6PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC04Jz5cIitkYXRhLmNvbW1vbklEK1wiPC9kaXY+XCIgXHJcbiAgICAgICAgK1wiPC9kaXY+XCJcclxuICAgICAgICArXCI8ZGl2IGNsYXNzPSdyb3cnPlwiIFxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48c3Bhbj5BZmZlY3Rpbmc6PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC04Jz5cIitkYXRhLmN1c3RBZmZlY3RpbmcrXCI8L2Rpdj5cIiBcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTQnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweCcgPjxzcGFuPlNob3J0RGVzY3JpcHQ6PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC04Jz5cIitkYXRhLnNob3J0RGVzY3JpcHRpb24rXCI8L2Rpdj5cIiBcclxuICAgICAgICArXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgK1wiPGRpdiBjbGFzcz0nY29sLW1kLTExJyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHgnID48aHIgLz48L2Rpdj5cIlxyXG4gICAgICAgICsgXCI8L2Rpdj5cIlxyXG4gICAgICAgICtcIjxkaXYgY2xhc3M9J3Jvdyc+XCIgXHJcbiAgICAgICAgXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgKyBcIjwvZGl2PlwiXHJcbiAgICAgICAgcmV0dXJuIGluZm9ib3hEYXRhO1xyXG4gICAgICAgIH1cclxufVxyXG5cclxuICBVcGRhdGVUaWNrZXRKU09ORGF0YUxpc3QoKVxyXG4gIHtcclxuICAgIGlmKHRoaXMudGlja2V0TGlzdC5sZW5ndGggIT0wKVxyXG4gICAge1xyXG4gICAgdGhpcy50aWNrZXRMaXN0LlRpY2tldEluZm9MaXN0LlRpY2tldEluZm8uZm9yRWFjaCh0aWNrZXRJbmZvID0+IHtcclxuICAgICAgdmFyIHRpY2tldDogVGlja2V0ID0gbmV3IFRpY2tldCgpOztcclxuICAgICAgdGlja2V0SW5mby5GaWVsZFR1cGxlTGlzdC5GaWVsZFR1cGxlLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgaWYoZWxlbWVudC5OYW1lID09PSBcIlRpY2tldE51bWJlclwiKXtcclxuICAgICAgICAgICAgdGlja2V0LnRpY2tldE51bWJlciA9IGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkVudHJ5VHlwZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5lbnRyeVR5cGUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQ3JlYXRlRGF0ZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5jcmVhdGVEYXRlID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkVxdWlwbWVudElEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmVxdWlwbWVudElEID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkNvbW1vbklEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmNvbW1vbklEID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlBhcmVudElEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnBhcmVudElEID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkN1c3RBZmZlY3RpbmdcIil7XHJcbiAgICAgICAgICB0aWNrZXQuY3VzdEFmZmVjdGluZyA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJUaWNrZXRTZXZlcml0eVwiKXtcclxuICAgICAgICAgIHRpY2tldC50aWNrZXRTZXZlcml0eSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBc3NpZ25lZFRvXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmFzc2lnbmVkVG8gPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiU3VibWl0dGVkQnlcIil7XHJcbiAgICAgICAgICB0aWNrZXQuc3VibWl0dGVkQnkgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUHJvYmxlbVN1YmNhdGVnb3J5XCIpe1xyXG4gICAgICAgICAgdGlja2V0LnByb2JsZW1TdWJjYXRlZ29yeSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQcm9ibGVtRGV0YWlsXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnByb2JsZW1EZXRhaWwgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUHJvYmxlbUNhdGVnb3J5XCIpe1xyXG4gICAgICAgICAgdGlja2V0LnByb2JsZW1DYXRlZ29yeSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMYXRpdHVkZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5sYXRpdHVkZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMb25naXR1ZGVcIil7XHJcbiAgICAgICAgICB0aWNrZXQubG9uZ2l0dWRlID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlBsYW5uZWRSZXN0b3JhbFRpbWVcIil7XHJcbiAgICAgICAgICB0aWNrZXQucGxhbm5lZFJlc3RvcmFsVGltZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBbHRlcm5hdGVTaXRlSURcIil7XHJcbiAgICAgICAgICB0aWNrZXQuYWx0ZXJuYXRlU2l0ZUlEID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkxvY2F0aW9uUmFua2luZ1wiKXtcclxuICAgICAgICAgIHRpY2tldC5sb2NhdGlvblJhbmtpbmcgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQXNzaWduZWREZXBhcnRtZW50XCIpe1xyXG4gICAgICAgICAgdGlja2V0LmFzc2lnbmVkRGVwYXJ0bWVudCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJSZWdpb25cIil7XHJcbiAgICAgICAgICB0aWNrZXQucmVnaW9uID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIk1hcmtldFwiKXtcclxuICAgICAgICAgIHRpY2tldC5tYXJrZXQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiV29ya1JlcXVlc3RJZFwiKXtcclxuICAgICAgICAgIHRpY2tldC53b3JrUmVxdWVzdElkID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlNoaWZ0TG9nXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnNoaWZ0TG9nID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFjdGlvblwiKXtcclxuICAgICAgICAgIHRpY2tldC5hY3Rpb24gPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiRXF1aXBtZW50TmFtZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5lcXVpcG1lbnROYW1lID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlNob3J0RGVzY3JpcHRpb25cIil7XHJcbiAgICAgICAgICB0aWNrZXQuc2hvcnREZXNjcmlwdGlvbiA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQYXJlbnROYW1lXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnBhcmVudE5hbWUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiVGlja2V0U3RhdHVzXCIpe1xyXG4gICAgICAgICAgdGlja2V0LnRpY2tldFN0YXR1cyA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xyXG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMb2NhdGlvbklEXCIpe1xyXG4gICAgICAgICAgdGlja2V0LmxvY2F0aW9uSUQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiT3BzRGlzdHJpY3RcIil7XHJcbiAgICAgICAgICB0aWNrZXQub3BzRGlzdHJpY3QgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcclxuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiT3BzWm9uZVwiKXtcclxuICAgICAgICAgIHRpY2tldC5vcHNab25lID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy50aWNrZXREYXRhLnB1c2godGlja2V0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuY29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIl19