/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ViewContainerRef, Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { RttamaplibService } from './rttamaplib.service';
import { Popup } from 'ng2-opd-popup';
import { TruckDirectionDetails, Ticket } from './models/truckdetails';
import { setTimeout } from 'timers';
import { forkJoin } from 'rxjs';
import * as momenttimezone from 'moment-timezone';
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
    RttamaplibComponent.prototype.smspopup;
    /** @type {?} */
    RttamaplibComponent.prototype.emailpopup;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9ydHRhbWFwbGliLyIsInNvdXJjZXMiOlsibGliL3J0dGFtYXBsaWIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBVSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFdkgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFekQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0QyxPQUFPLEVBQWdCLHFCQUFxQixFQUFFLE1BQU0sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBT3BGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDcEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVoQyxPQUFPLEtBQUssY0FBYyxNQUFNLGlCQUFpQixDQUFDOztJQXdHaEQsNkJBQW9CLFVBQTZCOzs7SUFHL0MsQUFGQSwwQkFBMEI7SUFDMUIsZ0NBQWdDO0lBQ2hDLElBQXNCO1FBSEosZUFBVSxHQUFWLFVBQVUsQ0FBbUI7MEJBMUVwQyxFQUFFO3lCQUtILEVBQUU7dUJBR0osTUFBTTt1QkFDTixLQUFLO3FCQUVQLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO3FCQUNoQyxLQUFLO3NCQUtDLElBQUk7dUJBRVIsRUFDVDs2QkFFZSxFQUFFOzBDQUVXLEVBQUU7b0NBQ1IsRUFBRTtnQ0FDTixDQUFDOzRCQUNMLEVBQUU7NkJBQ0QsRUFBRTs0QkFDSCxFQUFFO29CQUNGLFdBQVc7NkJBQ1YsS0FBSztvQkFDZCxLQUFLOzZCQUNJLEVBQUU7OzJCQUVKLGdHQUFnRzs7MEJBR2pHLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQzs4QkFJNUosQ0FBQztrQ0FFRyxFQUFFO2dDQUVKLEVBQUU7Z0NBQ0YsRUFBRTswQkFDUixFQUFFOzRCQUVBLEVBQUU7MEJBRUosS0FBSztvQ0FFSyxLQUFLOzJCQU9kLElBQUk7NkJBQ0YsS0FBSzsyQkFDUCxLQUFLO3lCQUNQLEtBQUs7MkJBQ0gsS0FBSzt5QkFDUCxLQUFLO2lDQUNHLEtBQUs7MEJBQ0UsRUFBRTsyQkFFYyxJQUFJLFlBQVksRUFBTzswQkFFM0MsRUFBRTs7UUFRdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQzs7UUFFM0IsSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksSUFBSSxFQUFFO1lBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztTQUN2RTtLQUNGOzs7O0lBRUQsc0NBQVE7OztJQUFSO1FBQUEsaUJBb0JDOztRQWxCQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDO1FBQ2xELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOztRQUVyQixJQUFJLFFBQVEsQ0FBQyxVQUFVLElBQUksVUFBVSxFQUFHO1lBQ3RDLFFBQVEsQ0FBQyxrQkFBa0IsR0FBRztnQkFDNUIsSUFBSSxRQUFRLENBQUMsVUFBVSxLQUFLLFVBQVUsRUFBRTtvQkFDdEMsS0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7b0JBQ3RCLEtBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQzFCO3FCQUFNO29CQUNMLEtBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDakI7YUFDRixDQUFBO1NBQ0Y7YUFBTTtZQUNMLElBQUksUUFBUSxDQUFDLFVBQVUsS0FBSyxVQUFVLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO2dCQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzFCO1NBQ0Y7S0FDRjs7Ozs7SUFFRCw0Q0FBYzs7OztJQUFkLFVBQWUsV0FBVztRQUExQixpQkFvREM7UUFuREMsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7O1FBRXhCLElBQUksR0FBRyxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNuRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFHN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7O1FBR2pCLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQVM7WUFDckUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7O2dCQUMvQixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUM7O2dCQUNuQixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUM7O2dCQUNwQixJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUM7Z0JBRW5CLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7O29CQUVyQyxBQURBLDJCQUEyQjtvQkFDM0IsS0FBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7b0JBQzNCLEtBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJO3dCQUNyRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDbkIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDOzs7b0JBR2QsVUFBVSxDQUFDOztxQkFDWixFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNSO3FCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQzdDLEtBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDOztvQkFDeEIsSUFBSSxPQUFPLEdBQUc7d0JBQ1osRUFBRSxFQUFFLEtBQUksQ0FBQyxhQUFhO3dCQUN0QixRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsS0FBSSxDQUFDLGFBQWEsR0FBRyxHQUFHO3FCQUN0RCxDQUFDO29CQUNGLEtBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNwQyxLQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQzs7aUJBRS9CO3FCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQ3RDLEtBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNqQixLQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQzs7aUJBRTVCO3FCQUFNOzs7aUJBR047YUFDRjtpQkFBTTs7O2FBR047U0FDRixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsS0FBSztZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7OztTQUdwQixDQUFDLENBQUM7S0FDSjs7OztJQUVELG9EQUFzQjs7O0lBQXRCO1FBQUEsaUJBdUJDO1FBdEJDLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQVM7WUFDckUsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDckMsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7O29CQUN2QyxJQUFJLEdBQUcsR0FBRzt3QkFDUixFQUFFLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU07d0JBQ3ZDLFFBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUc7cUJBQy9GLENBQUM7b0JBQ0YsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzlCO2dCQUVELEtBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO2dCQUNsQixLQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzthQUMzQjtpQkFBTTtnQkFDTCxLQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDakIsS0FBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7O2FBRTVCO1NBQ0YsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLEtBQUs7WUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7U0FHcEIsQ0FBQyxDQUFDO0tBQ0o7Ozs7SUFFRCx1REFBeUI7OztJQUF6QjtRQUFBLGlCQWlCQztRQWhCQyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxFQUFFO1lBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQVM7Z0JBQ2xFLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3JDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO3dCQUN2QyxLQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFFcEUsS0FBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQzs0QkFDbkMsTUFBTSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNOzRCQUMzQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUk7NEJBQ3ZDLEtBQUssRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSzs0QkFDekMsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLO3lCQUMxQyxDQUFDLENBQUM7cUJBQ0o7aUJBQ0Y7YUFDRixDQUFDLENBQUM7U0FDSjtLQUNGOzs7OztJQUVELHlDQUFXOzs7O0lBQVgsVUFBWSxJQUFZOztRQUN0QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7O1FBQ3JCLElBQUksUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFOUQsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDakc7UUFDRCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNsRSxXQUFXLEVBQUUsa0VBQWtFO1lBQy9FLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLFNBQVMsRUFBRSxJQUFJLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUk7WUFDaEcsSUFBSSxFQUFFLEVBQUU7WUFDUixRQUFRLEVBQUUsSUFBSTs7WUFFZCxtQkFBbUIsRUFBRSxLQUFLO1lBQzFCLFFBQVEsRUFBRSxLQUFLO1lBQ2YsYUFBYSxFQUFFLEtBQUs7WUFDcEIsbUJBQW1CLEVBQUUsS0FBSztZQUMxQixpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsYUFBYSxFQUFFLEtBQUs7U0FDckIsQ0FBQyxDQUFDOzs7UUFJSCxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtTQUM1QyxDQUFDLENBQUM7O1FBR0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDOUQsT0FBTyxFQUFFLEtBQUs7U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBRzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7O1FBR3ZDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLDRCQUE0QixFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3pFLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLDJCQUEyQixFQUFFLGVBQWUsQ0FBQyxDQUFDOztRQUd4RSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOztRQUd2RCxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDOztZQUNsRSxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDdkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hDLENBQUMsQ0FBQzs7UUFHSCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FFdEQ7Ozs7Ozs7OztJQUVELHdDQUFVOzs7Ozs7OztJQUFWLFVBQVcsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLGFBQWE7UUFBMUMsaUJBeVBDOztRQXhQQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUVsQixJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFTO2dCQUNoRSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7O29CQUMzRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDOztvQkFDN0IsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO29CQUNwQixRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTt3QkFDcEIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTs0QkFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO3lCQUN4Qjt3QkFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksU0FBUyxFQUFFOzs0QkFDNUIsSUFBSSxTQUFTLEdBQTBCLElBQUkscUJBQXFCLEVBQUUsQ0FBQzs0QkFDbkUsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOzRCQUMvQixTQUFTLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7NEJBQy9CLFNBQVMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzs0QkFDakMsU0FBUyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDOzRCQUMvQixTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7NEJBQ2pDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7NEJBQzNCLEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3lCQUMvQjtxQkFDRixDQUFDLENBQUM7O29CQUVILElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztvQkFDdEIsWUFBWSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUUzRCxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUEsT0FBTzt3QkFFdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFOzs0QkFDNUMsSUFBSSxTQUFTLHFCQUFHLE9BQU8sQ0FBQyxDQUFDLENBQVEsRUFBQzs7NEJBQ2xDLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs0QkFDckMsSUFBSSxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxJQUFJLElBQUk7bUNBQzdFLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7Z0NBQ3RGLElBQUksYUFBYSxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7Z0NBQzFILElBQUksY0FBYyxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQ0FDM0gsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksR0FBRyxhQUFhLENBQUM7Z0NBQzNDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUcsY0FBYyxDQUFDOzZCQUM5Qzt5QkFDRjs7d0JBRUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzt3QkFFL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTs7NEJBQy9DLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzs7NEJBQy9DLElBQUksVUFBVSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7NEJBQ25FLElBQUksVUFBVSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7OzRCQUNuQyxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7NEJBRXZCLGFBQWEsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUEsT0FBTztnQ0FDdkMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtvQ0FDN0IsT0FBTyxPQUFPLENBQUM7aUNBQ2hCOzZCQUNGLENBQUMsQ0FBQzs7NEJBRUgsSUFBSSxZQUFZLENBQUM7NEJBRWpCLElBQUksYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0NBQzVCLFlBQVksR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDOzZCQUMzRzs0QkFFRCxJQUFJLFlBQVksSUFBSSxJQUFJLElBQUksWUFBWSxJQUFJLFNBQVMsRUFBRTs7Z0NBQ3JELElBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7O2dDQUNsRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDOztnQ0FDbkUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQzs7Z0NBQzVELElBQUksUUFBUSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7Z0NBQzVDLEtBQUksQ0FBQyx5QkFBeUIsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQzs2QkFDaEY7eUJBQ0Y7O3FCQUdGLEVBQ0MsVUFBQyxHQUFHOztxQkFFSCxDQUNGLENBQUM7b0JBRUYsS0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FDbEcsVUFBQyxJQUFTO3dCQUNSLElBQUksS0FBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUE1QyxDQUE0QyxDQUFDLEVBQUU7NEJBQ3JGLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ2xCLEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3lCQUMvQjtxQkFDRixFQUNELFVBQUMsR0FBRzt3QkFDRixPQUFPLENBQUMsR0FBRyxDQUFDLDREQUE0RCxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDdkYsQ0FDRixDQUFDO2lCQUVIO3FCQUFNOzs7aUJBR047YUFDRixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsS0FBSztnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7YUFHcEIsQ0FBQyxDQUFDO1NBQ0o7YUFBTTs7WUFFTCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBUztnQkFDNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOztvQkFFM0QsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7b0JBQy9CLElBQUksWUFBVSxHQUFHLEVBQUUsQ0FBQztvQkFDcEIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7d0JBQ3BCLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUU7NEJBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzt5QkFDeEI7d0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFVLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUF2QixDQUF1QixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7OzRCQUMxRixJQUFJLFNBQVMsR0FBMEIsSUFBSSxxQkFBcUIsRUFBRSxDQUFDOzRCQUNuRSxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7NEJBQy9CLFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQzs0QkFDL0IsU0FBUyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOzRCQUNqQyxTQUFTLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7NEJBQy9CLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs0QkFDakMsWUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs0QkFDM0IsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7NEJBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO3lCQUN4QjtxQkFDRixDQUFDLENBQUM7O29CQUVILElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztvQkFDdEIsWUFBWSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFlBQVUsQ0FBQyxDQUFDO29CQUUzRCxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUEsT0FBTzt3QkFFdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFOzs0QkFDNUMsSUFBSSxTQUFTLHFCQUFHLE9BQU8sQ0FBQyxDQUFDLENBQVEsRUFBQzs7NEJBQ2xDLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs0QkFDckMsSUFBSSxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxJQUFJLElBQUk7bUNBQzdFLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7Z0NBQ3RGLElBQUksYUFBYSxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7Z0NBQzFILElBQUksY0FBYyxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQ0FDM0gsWUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksR0FBRyxhQUFhLENBQUM7Z0NBQzNDLFlBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUcsY0FBYyxDQUFDOzZCQUM5Qzt5QkFDRjs7d0JBRUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7Z0RBRTFCLENBQUM7OzRCQUNSLElBQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2xDLElBQUksT0FBTyxZQUFZLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFOztnQ0FFN0MsSUFBTSxRQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7O2dDQUN2QyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQ0FDdkQsYUFBYSxHQUFHLEVBQUUsQ0FBQztnQ0FFdkIsYUFBYSxHQUFHLFlBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQSxPQUFPO29DQUN2QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssUUFBTSxFQUFFO3dDQUM3QixPQUFPLE9BQU8sQ0FBQztxQ0FDaEI7aUNBQ0YsQ0FBQyxDQUFDO2dDQUlILElBQUksYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0NBQzVCLFlBQVksR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lDQUMzRztnQ0FFRCxJQUFJLFlBQVksSUFBSSxJQUFJLElBQUksWUFBWSxJQUFJLFNBQVMsRUFBRTtvQ0FDakQsV0FBVyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7b0NBQzlDLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO29DQUMvRCxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztvQ0FDeEQsUUFBUSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7b0NBQzVDLEtBQUksQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztpQ0FDN0U7NkJBQ0Y7OzRCQXJCSyxhQUFhLEVBUWIsWUFBWSxFQU9WLFdBQVcsRUFDWCxTQUFTLEVBQ1QsT0FBTyxFQUNQLFFBQVE7d0JBeEJsQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRTtvQ0FBdEMsQ0FBQzt5QkE0QlQ7O3dCQUdELFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLDRCQUE0QixFQUFFOzs0QkFHdEQsSUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7NEJBRTNFLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFDM0QsRUFBRSxFQUNGLEVBQUUsRUFDRixTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7OzRCQUVsRCxJQUFNLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7OzRCQUU3QixJQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFDeEM7Z0NBQ0UsSUFBSSxFQUFFLDJFQUEyRTtnQ0FDakYsTUFBTSxFQUFFLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztnQ0FDeEMsS0FBSyxFQUFFLEVBQUUsR0FBRyxvQkFBb0I7NkJBQ2pDLENBQUMsQ0FBQzs7NEJBRUwsSUFBSSxRQUFRLEdBQUc7Z0NBQ2IsUUFBUSxFQUFFLEVBQUU7Z0NBQ1osU0FBUyxFQUFFLEVBQUU7Z0NBQ2IsTUFBTSxFQUFFLEVBQUU7NkJBQ1gsQ0FBQzs0QkFFRixTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFDLENBQUM7Z0NBQy9DLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO2dDQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztnQ0FDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Z0NBQ3RCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzs2QkFDeEMsQ0FBQyxDQUFDOzRCQUVILEdBQUcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOzRCQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs0QkFHekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3lCQUM1QyxDQUFDLENBQUM7O3FCQUdKLEVBQ0MsVUFBQyxHQUFHO3dCQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7O3FCQUVsQixDQUNGLENBQUM7O29CQUVGLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztvQkFFckIsS0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsb0JBQW9CLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FDbEcsVUFBQyxJQUFTO3dCQUNSLElBQUksWUFBVSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLEVBQS9ELENBQStELENBQUMsRUFBRTs0QkFDekYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDbEIsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7eUJBQy9CO3FCQUNGLEVBQ0QsVUFBQyxHQUFHO3dCQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsNERBQTRELEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUN2RixDQUNGLENBQUM7aUJBRUg7cUJBQU07OztpQkFHTjthQUNGLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxLQUFLO2dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7OzthQUdwQixDQUFDLENBQUM7U0FDSjtLQUVGOzs7OztJQUVELHlDQUFXOzs7O0lBQVgsVUFBWSxLQUFLOztRQUNmLElBQUksUUFBUSxHQUFHLHcvR0FBdy9HLENBQUM7UUFFeGdILElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLE9BQU8sRUFBRTtZQUNsQyxRQUFRLEdBQUcsdy9HQUF3L0csQ0FBQztTQUNyZ0g7YUFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxLQUFLLEVBQUU7WUFDdkMsUUFBUSxHQUFHLHdzSEFBd3NILENBQUM7U0FDcnRIO2FBQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksUUFBUSxFQUFFO1lBQzFDLFFBQVEsR0FBRyx3bkhBQXduSCxDQUFDO1NBQ3JvSDthQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLFFBQVEsRUFBRTtZQUMxQyxRQUFRLEdBQUcsZ3ZIQUFndkgsQ0FBQztTQUM3dkg7UUFFRCxPQUFPLFFBQVEsQ0FBQztLQUNqQjs7Ozs7SUFFRCxnREFBa0I7Ozs7SUFBbEIsVUFBbUIsS0FBSztRQUN0QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO0tBQ2pDOzs7Ozs7SUFFRCwwQ0FBWTs7Ozs7SUFBWixVQUFhLElBQUksRUFBRSxTQUFTO1FBQTVCLGlCQXVmQzs7UUF0ZkMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztRQUNsQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUM7O1FBQ3pCLElBQUksV0FBVyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7O1FBQzdFLElBQUksT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7O1FBQzdFLElBQUksT0FBTyxDQUFDOztRQUNaLElBQUksZUFBZSxDQUFDOztRQUNwQixJQUFJLE1BQU0sQ0FBQzs7UUFDWCxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7O1FBRWxCLElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbEQsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV4RyxJQUFJLFVBQVUsSUFBSSxPQUFPLEVBQUU7WUFDekIsZUFBZSxHQUFHLG8zRkFBbzNGLENBQUM7U0FDeDRGO2FBQU0sSUFBSSxVQUFVLElBQUksS0FBSyxFQUFFO1lBQzlCLGVBQWUsR0FBRyx3MEZBQXcwRixDQUFDO1NBQzUxRjthQUFNLElBQUksVUFBVSxJQUFJLFFBQVEsRUFBRTtZQUNqQyxlQUFlLEdBQUcsZzJGQUFnMkYsQ0FBQztTQUNwM0Y7YUFBTSxJQUFJLFVBQVUsSUFBSSxRQUFRLEVBQUU7WUFDakMsZUFBZSxHQUFHLGc0R0FBZzRHLENBQUM7U0FDcDVHOztRQUVELElBQUksWUFBWSxHQUFHLFdBQVcsQ0FBQzs7UUFDL0IsSUFBSSxlQUFlLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFNUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDaEIsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNO1lBQ3JELEtBQUssRUFBRSxDQUFDO1lBQ1IsUUFBUSxFQUFFLFNBQVMsQ0FBQyxHQUFHO1lBQ3ZCLFNBQVMsRUFBRSxTQUFTLENBQUMsSUFBSTtTQUMxQixDQUFDLENBQUM7O1FBRUgsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7UUFDNUMsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7UUFDckMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDOztRQUV0QixJQUFJLFFBQVEsR0FBRztZQUNiLE9BQU8sRUFBRSxTQUFTLENBQUMsT0FBTztZQUMxQixNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU07WUFDeEIsV0FBVyxFQUFFLFNBQVMsQ0FBQyxRQUFRO1lBQy9CLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUTtZQUM1QixPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU87WUFDMUIsU0FBUyxFQUFFLFNBQVMsQ0FBQyxRQUFRO1lBQzdCLFFBQVEsRUFBRSxTQUFTLENBQUMsTUFBTTtZQUMxQixZQUFZLEVBQUUsU0FBUyxDQUFDLElBQUk7WUFDNUIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLO1lBQ3RCLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLGVBQWUsRUFBRSxTQUFTLENBQUMsUUFBUTtZQUNuQyxHQUFHLEVBQUUsU0FBUyxDQUFDLFdBQVc7WUFDMUIsS0FBSyxFQUFFLEVBQUU7O1lBQ1QsTUFBTSxFQUFFLEVBQUU7O1lBQ1YsSUFBSSxFQUFFLE9BQU87WUFDYixRQUFRLEVBQUUsZUFBZTtZQUN6QixVQUFVLEVBQUUsU0FBUyxDQUFDLEdBQUc7WUFDekIsV0FBVyxFQUFFLFNBQVMsQ0FBQyxJQUFJO1lBQzNCLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSztZQUN0QixNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU07WUFDeEIsT0FBTyxFQUFFLElBQUksQ0FBQyxvQkFBb0I7WUFDbEMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLO1lBQ3RCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVc7WUFDbEMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNO1lBQ3hCLFlBQVksRUFBRSxTQUFTLENBQUMsWUFBWTtZQUNwQyxjQUFjLEVBQUUsU0FBUyxDQUFDLGNBQWM7WUFDeEMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxZQUFZO1lBQ3BDLE1BQU0sRUFBRSxTQUFTLENBQUMsSUFBSTtTQUN2QixDQUFDOztRQUVGLElBQUksV0FBVyxHQUFHLHFEQUFxRCxDQUFDOztRQUV4RSxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDOzs7OztRQU0xQixJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLFNBQVMsRUFBRTtZQUNyQyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ2pCLElBQUksR0FBRyxHQUFHLENBQUM7YUFDWjtpQkFBTSxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3hCLElBQUksR0FBRyxHQUFHLENBQUE7YUFDWDtpQkFBTSxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3hCLElBQUksR0FBRyxHQUFHLENBQUE7YUFDWDtTQUNGO2FBQU07WUFDTCxJQUFJLEdBQUcsRUFBRSxDQUFDO1NBQ1g7UUFFRCxXQUFXLEdBQUcsV0FBVyxHQUFHLGFBQWEsR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFFN0UsU0FBUyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBRWpHLElBQUksU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFLEVBQUU7WUFDekIsUUFBUSxHQUFHLFdBQVcsR0FBRyxXQUFXLEdBQUcseUVBQXlFLEdBQUcsU0FBUyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7U0FDN0k7UUFFRCxJQUFJLFNBQVMsQ0FBQyxZQUFZLElBQUksSUFBSSxJQUFJLFNBQVMsQ0FBQyxZQUFZLElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxZQUFZLElBQUksRUFBRSxFQUFFOztZQUN6RyxJQUFJLFlBQVksR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7WUFDckQsSUFBSSxFQUFFLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pHLFFBQVEsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNoRDs7UUFHRCxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDckQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBRXRFLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM3QixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTyxFQUE5QixDQUE4QixDQUFDLElBQUksSUFBSSxFQUFFOztvQkFDcEUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQTlCLENBQThCLENBQUMsQ0FBQzs7b0JBQ3BFLElBQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNuRCxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTt3QkFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO3dCQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7d0JBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQzVFLElBQUksR0FBRyxJQUFJLENBQUM7cUJBQ2I7aUJBQ0Y7YUFDRjtTQUNGOztRQUdELElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxXQUFXLEVBQUU7O1lBQzFELElBQUksYUFBYSxVQUFNO1lBQ3ZCLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUVuRSxJQUFJLGFBQWEsSUFBSSxJQUFJLEVBQUU7Z0JBQ3pCLElBQUksYUFBYSxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFO29CQUM5QyxjQUFjLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUMxQyxJQUFJLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDcEUsYUFBYSxHQUFHLElBQUksQ0FBQztpQkFDdEI7YUFDRjtTQUNGO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBbEQsQ0FBa0QsQ0FBQyxFQUFFO1lBQy9HLFVBQVUsR0FBRyxLQUFLLENBQUM7O1lBRW5CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25ELElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxPQUFPLEVBQUU7O29CQUNoRSxJQUFJLFVBQVUsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxVQUFVLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztvQkFDL0IsT0FBTyxHQUFHLFdBQVcsQ0FBQztvQkFDdEIsV0FBVyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7O29CQUVsRCxJQUFJLFlBQVksR0FBRyxTQUFTLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBRTNELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSzt3QkFDMUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTs0QkFDeEMsS0FBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7eUJBQzFDO3FCQUNGLENBQUMsQ0FBQztvQkFDSCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUUzQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBRTNFLE9BQU87aUJBQ1I7YUFDRjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEMsTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFckUsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRS9CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBQ3BFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQzFDO1lBRUQsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBQyxDQUFDO2dCQUNyRCxLQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQzdDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksRUFBRTtnQkFDNUIsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBQyxDQUFDO29CQUNsRCxLQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQzt3QkFDdEIsV0FBVyxFQUFFLElBQUk7d0JBQ2pCLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTt3QkFDaEMsT0FBTyxFQUFFLElBQUk7d0JBQ2IsZUFBZSxFQUFFLElBQUk7d0JBQ3JCLE1BQU0sRUFBRSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ3ZDLFdBQVcsRUFBRSxtQ0FBbUM7OEJBQzVDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFJLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxHQUFHLFFBQVE7cUJBQ2hGLENBQUMsQ0FBQztvQkFFSCxLQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUVyRyxLQUFJLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUM5RSxLQUFJLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztvQkFJN0UsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDOztvQkFDaEIsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7b0JBQzdDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7O29CQUM3QyxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7b0JBQzdHLElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDOztvQkFDL0QsSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFFbEQsSUFBSSxFQUFFLEdBQUcsTUFBTSxFQUFFLEVBQUUsb0NBQW9DOzs7d0JBRXJELEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs7d0JBRVQsRUFBRSxJQUFJLE1BQU0sQ0FBQztxQkFDZDt5QkFBTTs7d0JBRUwsRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDUjtvQkFFRCxJQUFJLEVBQUUsR0FBRyxNQUFNLEVBQUUsRUFBRSxxREFBcUQ7Ozt3QkFFdEUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDOzt3QkFFVCxFQUFFLElBQUksTUFBTSxDQUFDO3FCQUNkO3lCQUFNLEVBQUUsc0RBQXNEOzt3QkFDN0QsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7d0JBRXJGLElBQUksRUFBRSxHQUFHLE1BQU0sRUFBRTs0QkFDZixFQUFFLEdBQUcsQ0FBQyxDQUFDO3lCQUNSOzZCQUFNOzs0QkFFTCxFQUFFLElBQUksTUFBTSxDQUFDO3lCQUNkO3FCQUNGOztvQkFHRCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTt3QkFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQzs0QkFDWCxZQUFZLEVBQUUsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDOzRCQUM5QyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRTt5QkFDekIsQ0FBQyxDQUFDO3FCQUNKOztvQkFFRCxJQUFJLGFBQWEsQ0FBTTtvQkFDdkIsYUFBYSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsOEJBQThCLENBQUMsZUFBZSxDQUFDLENBQUM7b0JBRWhGLElBQUksYUFBYSxJQUFJLElBQUksRUFBRTs7d0JBQ3pCLElBQU0saUJBQWlCLEdBQUcsS0FBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FDNUQsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQTVELENBQTRELENBQUMsQ0FBQzt3QkFFckUsSUFBSSxpQkFBaUIsSUFBSSxJQUFJLEVBQUU7NEJBQzdCLEtBQUksQ0FBQyxlQUFlLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDOzRCQUMvQyxLQUFJLENBQUMsZUFBZSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQzs0QkFDL0MsS0FBSSxDQUFDLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7eUJBQzlDO3FCQUNGO29CQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUMzRSxDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFDLENBQUM7b0JBQ3RELEtBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO3dCQUN0QixXQUFXLEVBQUUsSUFBSTt3QkFDakIsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO3dCQUNoQyxPQUFPLEVBQUUsSUFBSTt3QkFDYixlQUFlLEVBQUUsSUFBSTt3QkFDckIsTUFBTSxFQUFFLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQzt3QkFDdkMsV0FBVyxFQUFFLG1DQUFtQzs4QkFDNUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUksQ0FBQyxjQUFjLEVBQUUsUUFBUSxDQUFDLEdBQUcsUUFBUTtxQkFDaEYsQ0FBQyxDQUFDO29CQUVILEtBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7b0JBRXJHLEtBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQzlFLEtBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7O29CQUk3RSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7O29CQUNoQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDOztvQkFDN0MsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7b0JBQzdDLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztvQkFDN0csSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUM7O29CQUMvRCxJQUFJLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUVsRCxJQUFJLEVBQUUsR0FBRyxNQUFNLEVBQUUsRUFBRSxvQ0FBb0M7Ozt3QkFFckQsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDOzt3QkFFVCxFQUFFLElBQUksTUFBTSxDQUFDO3FCQUNkO3lCQUFNOzt3QkFFTCxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNSO29CQUVELElBQUksRUFBRSxHQUFHLE1BQU0sRUFBRSxFQUFFLHFEQUFxRDs7O3dCQUV0RSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7O3dCQUVULEVBQUUsSUFBSSxNQUFNLENBQUM7cUJBQ2Q7eUJBQU0sRUFBRSxzREFBc0Q7O3dCQUM3RCxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDOzt3QkFFckYsSUFBSSxFQUFFLEdBQUcsTUFBTSxFQUFFOzRCQUNmLEVBQUUsR0FBRyxDQUFDLENBQUM7eUJBQ1I7NkJBQU07OzRCQUVMLEVBQUUsSUFBSSxNQUFNLENBQUM7eUJBQ2Q7cUJBQ0Y7O29CQUdELElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO3dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDOzRCQUNYLFlBQVksRUFBRSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7NEJBQzlDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFO3lCQUN6QixDQUFDLENBQUM7cUJBQ0o7O29CQUVELElBQUksYUFBYSxDQUFNO29CQUN2QixhQUFhLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyw4QkFBOEIsQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFFaEYsSUFBSSxhQUFhLElBQUksSUFBSSxFQUFFOzt3QkFDekIsSUFBTSxpQkFBaUIsR0FBRyxLQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUM1RCxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBNUQsQ0FBNEQsQ0FBQyxDQUFDO3dCQUVyRSxJQUFJLGlCQUFpQixJQUFJLElBQUksRUFBRTs0QkFDN0IsS0FBSSxDQUFDLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7NEJBQy9DLEtBQUksQ0FBQyxlQUFlLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDOzRCQUMvQyxLQUFJLENBQUMsY0FBYyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQzt5QkFDOUM7cUJBQ0Y7b0JBQ0QsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7aUJBRTNFLENBQUMsQ0FBQzthQUNKO1lBRUQsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7O1NBR3RFOzs7OztRQUVELHdCQUF3QixDQUFDO1lBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3RDOzs7OztRQUNELDJCQUEyQixDQUFDO1lBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3RDOzs7Ozs7O1FBRUQsd0JBQXdCLElBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSztZQUU5QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDZixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQzthQUNoQjs7WUFFRCxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7O1lBQ25CLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQzs7WUFDbkIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxTQUFTLEVBQUU7Z0JBQ2pDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLEtBQUssRUFBRTtvQkFDakQsTUFBTSxHQUFHLDRGQUE0RixHQUFHLE1BQU0sR0FBRyxhQUFhLENBQUM7aUJBQ2hJO3FCQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLFFBQVEsRUFBRTtvQkFDM0QsTUFBTSxHQUFHLHlHQUF5RyxDQUFDO2lCQUNwSDthQUNGOztZQUVELElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUVyQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFFekcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBRXpHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUU3RSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFFckcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBRXRHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUU5SSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLEVBQUU7Z0JBQzVCLFdBQVcsR0FBRyx1RUFBdUUsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLGtLQUFrSztzQkFDdFEsaUNBQWlDO3NCQUNqQyxtQkFBbUI7c0JBQ25CLHdCQUF3QjtzQkFDeEIsd0pBQXdKLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRywyQkFBMkI7c0JBQ3BNLHdCQUF3QjtzQkFDeEIscUpBQXFKLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRywyQkFBMkI7c0JBQ2xNLFFBQVE7c0JBQ1IsbUJBQW1CO3NCQUNuQix3QkFBd0I7c0JBQ3hCLGtKQUFrSixHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsMkJBQTJCO3NCQUMvTCx3QkFBd0I7c0JBQ3hCLGdKQUFnSixHQUFHLEtBQUssR0FBRywyQkFBMkI7c0JBQ3RMLFFBQVE7c0JBQ1IsbUJBQW1CO3NCQUNuQix3QkFBd0I7c0JBQ3hCLGdKQUFnSixHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsMkJBQTJCO3NCQUM1TCx3QkFBd0I7c0JBQ3hCLHlKQUF5SixHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsMkJBQTJCO3NCQUM3TSxRQUFRO3NCQUNSLG1CQUFtQjtzQkFDbkIsd0JBQXdCO3NCQUN4Qix1SkFBdUosR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLDJCQUEyQjtzQkFDek0sd0JBQXdCO3NCQUN4QixzSkFBc0osR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLDJCQUEyQjtzQkFDeE0sUUFBUTtzQkFDUixtQkFBbUI7c0JBQ25CLHlCQUF5QjtzQkFDekIsaUxBQWlMLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRywyQkFBMkI7c0JBQ2xPLFFBQVE7c0JBQ1IsNEJBQTRCO3NCQUM1Qix1Q0FBdUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLGdFQUFnRTtzQkFDdkgsdUNBQXVDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxtRkFBbUY7c0JBQ3hJLHVDQUF1QyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsMEVBQTBFO3NCQUM3SixRQUFRO3NCQUNSLGNBQWM7c0JBQ2QsK0NBQStDO3NCQUMvQyxzSEFBc0g7c0JBQ3RILDZJQUE2STtzQkFDN0ksa0pBQWtKO3NCQUNsSixlQUFlO3NCQUNmLFFBQVEsQ0FBQzthQUVkO2lCQUFNO2dCQUNMLFdBQVcsR0FBRyx5REFBeUQ7c0JBQ25FLGtFQUFrRSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsd0RBQXdEO29CQUMvSSx3QkFBd0I7b0JBQ3hCLG9CQUFvQjtvQkFDcEIsdUlBQXVJLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRO29CQUNoSyxxVEFBcVQ7b0JBQ3JULFFBQVE7b0JBQ1IsdUZBQXVGLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxjQUFjO29CQUN2SCxrSkFBa0osR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLHNJQUFzSSxHQUFHLEtBQUssR0FBRyxjQUFjO3NCQUNqVSxNQUFNLEdBQUcsY0FBYztzQkFDdkIsNkhBQTZILEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxxRkFBcUYsR0FBRyxJQUFJLENBQUMsY0FBYyxHQUFHLFFBQVE7c0JBQ3BRLG9FQUFvRTtzQkFDcEUsd0VBQXdFLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRO3NCQUN2RyxRQUFRO3NCQUNSLG9FQUFvRTtzQkFDcEUsd0VBQXdFLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRO3NCQUN2RyxRQUFRO3NCQUNSLG9FQUFvRTtzQkFDcEUsc0VBQXNFLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRO3NCQUNwRyxRQUFRO3NCQUNSLG1EQUFtRDtzQkFFbkQsd0xBQXdMLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyw4R0FBOEc7c0JBQ3RULG9JQUFvSSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsOEpBQThKO3NCQUNoVCx5R0FBeUcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLHdIQUF3SDtzQkFDN1EsK0RBQStEO3NCQUMvRCx5R0FBeUcsR0FBRyxTQUFTLEdBQUcsOEdBQThHO3NCQUN0TywrQ0FBK0MsR0FBRyxTQUFTLEdBQUcscUlBQXFJO3NCQUNuTSxrQ0FBa0M7c0JBQ2xDLG1DQUFtQyxHQUFHLFNBQVMsR0FBRyxnSkFBZ0osQ0FBQzthQUN4TTtZQUVELE9BQU8sV0FBVyxDQUFDO1NBQ3BCOzs7OztRQUVELDBCQUEwQixDQUFDO1lBQ3pCLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLGFBQWEsRUFBRTtnQkFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7b0JBQ3RCLE9BQU8sRUFBRSxLQUFLO2lCQUNmLENBQUMsQ0FBQzthQUNKO1lBQ0QsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFOzthQUVuRDtZQUVELElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLGNBQWMsRUFBRTs7Z0JBQ3ZELElBQUksZUFBYSxVQUFNO2dCQUN2QixlQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyw4QkFBOEIsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFFaEYsSUFBSSxlQUFhLElBQUksSUFBSSxFQUFFOztvQkFDekIsSUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUM1RCxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksZUFBYSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBNUQsQ0FBNEQsQ0FBQyxDQUFDO29CQUVyRSxJQUFJLGlCQUFpQixJQUFJLElBQUksRUFBRTt3QkFDN0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7d0JBQy9DLElBQUksQ0FBQyxlQUFlLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDO3dCQUMvQyxJQUFJLENBQUMsY0FBYyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQztxQkFDOUM7aUJBQ0Y7Z0JBQ0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNyQztZQUVELElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxLQUFLLGdCQUFnQixFQUFFOztnQkFDekQsSUFBSSxlQUFhLFVBQU07Z0JBQ3ZCLGVBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLDhCQUE4QixDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUVoRixJQUFJLGVBQWEsSUFBSSxJQUFJLEVBQUU7O29CQUN6QixJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQzVELFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxlQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUE1RCxDQUE0RCxDQUFDLENBQUM7b0JBRXJFLElBQUksaUJBQWlCLElBQUksSUFBSSxFQUFFO3dCQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQzt3QkFDL0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7d0JBQy9DLElBQUksQ0FBQyxjQUFjLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDO3FCQUM5QztpQkFDRjtnQkFDRCxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3ZDO1NBRUY7S0FDRjs7Ozs7Ozs7OztJQUVELDRDQUFjOzs7Ozs7Ozs7SUFBZCxVQUFlLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsWUFBWTtRQUFwRSxpQkE0Q0M7UUEzQ0MsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsMkJBQTJCLEVBQUU7WUFDckQsS0FBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztZQUVuRixBQURBLDRCQUE0QjtZQUM1QixLQUFJLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3ZDLFNBQVMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTzthQUN2RCxDQUFDLENBQUM7WUFDSCxLQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ3RDLHNCQUFzQixFQUFFO29CQUN0QixXQUFXLEVBQUUsT0FBTztvQkFDcEIsZUFBZSxFQUFFLENBQUM7b0JBQ2xCLE9BQU8sRUFBRSxLQUFLO2lCQUNmO2dCQUNELHNCQUFzQixFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtnQkFDMUMsc0JBQXNCLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO2dCQUMxQyxpQkFBaUIsRUFBRSxLQUFLO2FBQ3pCLENBQUMsQ0FBQzs7WUFFSCxJQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztnQkFDdkQsUUFBUSxFQUFFLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUU7YUFDdkYsQ0FBQyxDQUFDOztZQUNILElBQU0sU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO2dCQUN2RCxRQUFRLEVBQUUsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUM7YUFDekUsQ0FBQyxDQUFDO1lBQ0gsS0FBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QyxLQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztZQUc5QyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLFVBQVUsQ0FBQzs7Z0JBRXZGLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O2dCQUNmLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDOztnQkFDNUQsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDO2dCQUMzQixJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLEVBQUU7b0JBQzVDLFNBQVMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO2lCQUM1Qjs7Z0JBQ0QsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7O2dCQUNuRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7O2dCQUV2QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7YUFDbEYsQ0FBQyxDQUFDO1lBRUgsS0FBSSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixFQUFFLENBQUM7U0FDOUMsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7OztJQUVELGdEQUFrQjs7Ozs7Ozs7SUFBbEIsVUFBbUIsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFlBQVk7UUFDN0QsSUFBSSxHQUFHLElBQUksQ0FBQzs7UUFDWixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxVQUFVLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsWUFBWTtZQUU5SSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLElBQUksWUFBWSxFQUFqQixDQUFpQixDQUFDLEVBQUU7O2dCQUM5RixJQUFJLEtBQUssR0FBRyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7O2dCQUN6RSxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNuRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ3hCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO2lCQUM5RDtxQkFDSSxJQUFJLFFBQVEsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDekMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7aUJBQzlEO2dCQUNELEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDeEI7U0FFRixFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRWxELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUM5Qjs7Ozs7O0lBRUQsZ0RBQWtCOzs7OztJQUFsQixVQUFtQixhQUFhLEVBQUUsV0FBVztRQUMzQyxJQUFJOztZQUVGLElBQUksSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7O1lBQzNELElBQUksSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7O1lBQzdELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDOztZQUNuRSxJQUFJLEVBQUUsR0FBRyxzQkFBc0IsQ0FBQztZQUNoQyxJQUFJLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUIsSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztZQUM1QixJQUFJLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxFQUFFLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFFM0csSUFBSSxHQUFHLElBQUksQ0FBQztZQUNaLElBQUksR0FBRyxJQUFJLENBQUM7WUFDWixLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2IsRUFBRSxHQUFHLElBQUksQ0FBQztZQUVWLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxHQUFHLEtBQUssQ0FBQyxDQUFDO1NBQ3ZEO0tBQ0Y7Ozs7O0lBRUQsbUNBQUs7Ozs7SUFBTCxVQUFNLEdBQUc7UUFDUCxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FDaEI7Ozs7O0lBRUQsc0NBQVE7Ozs7SUFBUixVQUFTLENBQUM7UUFDUixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztLQUMxQjs7Ozs7SUFFRCxzQ0FBUTs7OztJQUFSLFVBQVMsQ0FBQztRQUNSLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0tBQzFCOzs7Ozs7SUFFRCw4Q0FBZ0I7Ozs7O0lBQWhCLFVBQWlCLE1BQU0sRUFBRSxJQUFJO1FBSTNCLElBQUk7O1lBQ0YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7O1lBQzFDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7O1lBQzVCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztZQUN4QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDOztZQUMxQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQzs7WUFDdEMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDOztZQUN4QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFM0YsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7WUFFeEMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7U0FDdEQ7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FDckQ7S0FDRjs7Ozs7SUFFRCxxQ0FBTzs7OztJQUFQLFVBQVEsSUFBSTs7UUFFVixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUUsRUFBRTtZQUM3QixJQUFJLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxFQUFFOztnQkFFN0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFFcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUE7Z0JBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7O2FBRXJDO1NBQ0Y7S0FFRjs7Ozs7SUFFRCx1Q0FBUzs7OztJQUFULFVBQVUsSUFBSTs7UUFFWixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRTtZQUM1QixJQUFJLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxFQUFFOzs7Ozs7Ozs7Ozs7YUFjaEQ7U0FDRjtLQUNGOzs7OztJQUVELHlDQUFXOzs7O0lBQVgsVUFBWSxJQUFJOztRQUNkLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7UUFJbEIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksSUFBSSxFQUFFOztZQUNoRSxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDOztZQUMzQixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDOztZQUM1QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUVqQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztZQUN4QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDO1lBRTdCLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDL0I7WUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXpCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUU1QyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkMsVUFBVSxDQUFDOzthQUVWLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDWDtLQUNGOzs7OztJQUlELHNDQUFROzs7O0lBQVIsVUFBUyxDQUFDO1FBQ1IsT0FBTyxDQUFDLEdBQUcsY0FBYyxDQUFDO0tBQzNCOzs7OztJQUVELHVDQUFTOzs7O0lBQVQsVUFBVSxDQUFDO1FBQ1QsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDO0tBQ3JCOzs7OztJQUVELDJDQUFhOzs7O0lBQWIsVUFBYyxJQUFJO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3Qjs7Ozs7SUFDRCx5Q0FBVzs7OztJQUFYLFVBQVksSUFBSTtRQUNkLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN6Qjs7Ozs7O0lBRUQsbUNBQUs7Ozs7O0lBQUwsVUFBTSxNQUFNLEVBQUUsU0FBUzs7UUFDckIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7O1FBQ3JDLElBQUksVUFBVSxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7O1FBQ2pDLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQyxPQUFPLGlCQUFpQixHQUFHLE1BQU0sQ0FBQztLQUNuQzs7Ozs7O0lBRUQsc0NBQVE7Ozs7O0lBQVIsVUFBUyxDQUFDLEVBQUUsQ0FBQztRQUNYLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDekI7SUFBQSxDQUFDOzs7Ozs7Ozs7SUFFRix3Q0FBVTs7Ozs7Ozs7SUFBVixVQUFXLEtBQWEsRUFBRSxTQUFpQixFQUFFLFVBQWtCLEVBQUUsY0FBc0IsRUFBRSxlQUF1Qjs7UUFDOUcsSUFBSSxPQUFPLEdBQUcsd3hDQUF3eEMsQ0FBQztRQUV2eUMsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksT0FBTyxFQUFFO1lBQ2xDLE9BQU8sR0FBRyx3eENBQXd4QyxDQUFDO1NBQ3B5QzthQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLEtBQUssRUFBRTtZQUN2QyxPQUFPLEdBQUcsZ3VDQUFndUMsQ0FBQztTQUM1dUM7YUFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxRQUFRLEVBQUU7WUFDMUMsT0FBTyxHQUFHLGdyQ0FBZ3JDLENBQUE7U0FDM3JDO2FBQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksUUFBUSxFQUFFO1lBQzFDLE9BQU8sR0FBRyxvNEZBQW80RixDQUFBO1NBQy80RjtRQUVELE9BQU8sT0FBTyxDQUFDO0tBQ2hCOzs7OztJQUVELDJDQUFhOzs7O0lBQWIsVUFBYyxHQUFHOztRQUNmLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7O1FBRzVCLElBQUksU0FBUyxDQUFDO1FBQ2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkQsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUN0RSxTQUFTLEdBQUcsSUFBSSxDQUFDO2FBQ2xCO2lCQUFNO2dCQUNMLE1BQU07YUFDUDtTQUNGOztRQUdELElBQUksU0FBUyxFQUFFOztZQUViLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzs7U0FFakU7S0FDRjs7Ozs7Ozs7SUFFRCx1REFBeUI7Ozs7Ozs7SUFBekIsVUFBMEIsUUFBUSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsUUFBUTs7UUFDOUQsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUN0QixHQUFHLENBQUMsTUFBTSxHQUFHOztZQUNYLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7O1lBRXpDLElBQUksaUJBQWlCLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO1lBQ3RELENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2IsQ0FBQyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7O1lBS2QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7WUFHakMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOztZQUc3QyxPQUFPLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O1lBR2xDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOztZQUV4RCxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxFQUFFO2dCQUN0RCxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUMzRzs7U0FHRixDQUFDOztRQUdGLEdBQUcsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQzlCLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0tBQ2Y7Ozs7SUFFRCwrQ0FBaUI7OztJQUFqQjtRQUFBLGlCQXNCQztRQXBCQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ3BDLFNBQVMsQ0FDUixVQUFDLElBQUk7O1lBQ0gsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFELElBQUksR0FBRyxJQUFJLElBQUksRUFBRTs7Z0JBQ2YsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFBLE9BQU87b0JBQy9CLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyw4QkFBOEIsSUFBSSxPQUFPLENBQUMsWUFBWSxLQUFLLEtBQUksQ0FBQyxRQUFRLEVBQUU7d0JBQ2xHLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDdEI7aUJBQ0YsQ0FBQyxDQUFDO2dCQUVILElBQUksUUFBUSxJQUFJLFNBQVMsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDaEQsS0FBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2lCQUN6QzthQUNGO1NBQ0YsRUFDRCxVQUFDLEdBQUc7WUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCLENBQ0YsQ0FBQztLQUNMOzs7OztJQUVELCtDQUFpQjs7OztJQUFqQixVQUFrQixJQUFJO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUNsQzs7Ozs7SUFFRCwyQ0FBYTs7OztJQUFiLFVBQWMsY0FBYzs7UUFDMUIsSUFBSSxVQUFVLENBQUM7O1FBQ2YsSUFBSSxXQUFXLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7UUFHckQsSUFBSSxJQUFJLENBQUMsb0JBQW9CLElBQUksS0FBSyxFQUFFO1lBQ3RDLFVBQVUsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUE7U0FDN0U7YUFBTSxJQUFJLElBQUksQ0FBQyxvQkFBb0IsSUFBSSxLQUFLLEVBQUU7WUFDN0MsVUFBVSxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQTtTQUM5RTthQUFNLElBQUksSUFBSSxDQUFDLG9CQUFvQixJQUFJLEtBQUssRUFBRTtZQUM3QyxVQUFVLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO1NBQ2pGO2FBQU0sSUFBSSxJQUFJLENBQUMsb0JBQW9CLElBQUksUUFBUSxFQUFFO1lBQ2hELFVBQVUsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO1NBQ3ZFO1FBRUQsT0FBTyxVQUFVLENBQUM7S0FDbkI7Ozs7OztJQUVELDJDQUFhOzs7OztJQUFiLFVBQWMsR0FBRyxFQUFFLFVBQVU7UUFBN0IsaUJBNkREOztRQTVERyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7O1FBQ2hDLElBQUksU0FBUyxHQUFVLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7O1lBQzFCLElBQUksV0FBVyxHQUFHLGd6Q0FBZ3pDLENBQUE7WUFDbDBDLElBQUcsSUFBSSxDQUFDLGNBQWMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxPQUFPLEVBQzVHO2dCQUNFLFdBQVcsR0FBRyw0Z0RBQTRnRCxDQUFBO2FBQzNoRDtpQkFBSyxJQUFHLElBQUksQ0FBQyxjQUFjLEtBQUssT0FBTyxFQUFDO2dCQUN2QyxXQUFXLEdBQUcsbzdDQUFvN0MsQ0FBQTthQUNuOEM7O1lBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN4SixPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUN4QixHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQixLQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QixTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNuRSxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDN0gsU0FBUyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7U0FDM0IsQ0FBQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQyxXQUFXLENBQUMsQ0FBQzs7UUFDdkQsSUFBTSxPQUFPLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDMUQsT0FBTyxFQUFFLEtBQUs7U0FDZixDQUFDLENBQUM7Ozs7O1FBQ0gsd0JBQXdCLENBQUM7WUFDdkIsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtnQkFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEIsT0FBTyxDQUFDLFVBQVUsQ0FBQztvQkFDakIsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO29CQUNoQyxPQUFPLEVBQUUsSUFBSTtvQkFDYixNQUFNLEVBQUUsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUN2QyxXQUFXLEVBQUMsaUdBQWlHOzBCQUMzRyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFFBQVE7aUJBQ3JELENBQUMsQ0FBQzthQUNKO1lBQ0QsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQyxXQUFXLENBQUMsQ0FBQztZQUN2RCxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM3QixTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM3RDs7Ozs7UUFDRCxvQkFBb0IsS0FBSztZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5Qjs7Ozs7UUFDRCxlQUFlLENBQUM7WUFDZCxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsS0FBSyxhQUFhLEVBQUU7Z0JBQ3RELENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3JELE9BQU8sQ0FBQyxVQUFVLENBQUM7b0JBQ2pCLE9BQU8sRUFBRSxLQUFLO2lCQUNmLENBQUMsQ0FBQzthQUNKO1NBQ0Y7Ozs7O1FBRUssOEJBQThCLElBQVM7WUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7WUFDbkIsSUFBSSxXQUFXLEdBQUcsNkVBQTZFO2tCQUM3RixRQUFRLENBQUE7WUFDVixPQUFPLFdBQVcsQ0FBQztTQUNsQjtLQUdSOzs7O0lBRUMsc0RBQXdCOzs7SUFBeEI7UUFBQSxpQkE2RUM7UUEzRUMsSUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sSUFBRyxDQUFDLEVBQzdCO1lBQ0EsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVU7O2dCQUMxRCxJQUFJLE1BQU0sR0FBVyxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUFBLENBQUM7Z0JBQ25DLFVBQVUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87b0JBQ2xELElBQUcsT0FBTyxDQUFDLElBQUksS0FBSyxjQUFjLEVBQUM7d0JBQy9CLE1BQU0sQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDdkM7eUJBQ0ksSUFBRyxPQUFPLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBQzt3QkFDbkMsTUFBTSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUNqRTt5QkFDSSxJQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFDO3dCQUNwQyxNQUFNLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQ2xFO3lCQUFLLElBQUcsT0FBTyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUM7d0JBQ3RDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDbkU7eUJBQ0ksSUFBRyxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBQzt3QkFDbEMsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUNoRTt5QkFBSyxJQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFDO3dCQUNuQyxNQUFNLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQ2hFO3lCQUFLLElBQUcsT0FBTyxDQUFDLElBQUksS0FBSyxlQUFlLEVBQUM7d0JBQ3hDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDckU7eUJBQUssSUFBRyxPQUFPLENBQUMsSUFBSSxLQUFLLGdCQUFnQixFQUFDO3dCQUN6QyxNQUFNLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQ3RFO3lCQUFLLElBQUcsT0FBTyxDQUFDLElBQUksS0FBSyxZQUFZLEVBQUM7d0JBQ3JDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDbEU7eUJBQUssSUFBRyxPQUFPLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBQzt3QkFDdEMsTUFBTSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUNuRTt5QkFBSyxJQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUssb0JBQW9CLEVBQUM7d0JBQzdDLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUMxRTt5QkFBSyxJQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUssZUFBZSxFQUFDO3dCQUN4QyxNQUFNLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQ3JFO3lCQUFLLElBQUcsT0FBTyxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFBQzt3QkFDMUMsTUFBTSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUN2RTt5QkFBSyxJQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFDO3dCQUNuQyxNQUFNLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQ2hFO3lCQUFLLElBQUcsT0FBTyxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUM7d0JBQ3BDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDakU7eUJBQUssSUFBRyxPQUFPLENBQUMsSUFBSSxLQUFLLHFCQUFxQixFQUFDO3dCQUM5QyxNQUFNLENBQUMsbUJBQW1CLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDM0U7eUJBQUssSUFBRyxPQUFPLENBQUMsSUFBSSxLQUFLLGlCQUFpQixFQUFDO3dCQUMxQyxNQUFNLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQ3ZFO3lCQUFLLElBQUcsT0FBTyxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFBQzt3QkFDMUMsTUFBTSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUN2RTt5QkFBSyxJQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUssb0JBQW9CLEVBQUM7d0JBQzdDLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUMxRTt5QkFBSyxJQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFDO3dCQUNqQyxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQzlEO3lCQUFLLElBQUcsT0FBTyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUM7d0JBQ2pDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDOUQ7eUJBQUssSUFBRyxPQUFPLENBQUMsSUFBSSxLQUFLLGVBQWUsRUFBQzt3QkFDeEMsTUFBTSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUNyRTt5QkFBSyxJQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFDO3dCQUNuQyxNQUFNLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQ2hFO3lCQUFLLElBQUcsT0FBTyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUM7d0JBQ2pDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDOUQ7eUJBQUssSUFBRyxPQUFPLENBQUMsSUFBSSxLQUFLLGVBQWUsRUFBQzt3QkFDeEMsTUFBTSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUNyRTt5QkFBSyxJQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUssa0JBQWtCLEVBQUM7d0JBQzNDLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUN4RTt5QkFBSyxJQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFDO3dCQUNyQyxNQUFNLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQ2xFO3lCQUFLLElBQUcsT0FBTyxDQUFDLElBQUksS0FBSyxjQUFjLEVBQUM7d0JBQ3ZDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDcEU7eUJBQUssSUFBRyxPQUFPLENBQUMsSUFBSSxLQUFLLFlBQVksRUFBQzt3QkFDckMsTUFBTSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDO3FCQUNsRTt5QkFBSyxJQUFHLE9BQU8sQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFDO3dCQUN0QyxNQUFNLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUM7cUJBQ25FO3lCQUFLLElBQUcsT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUM7d0JBQ2xDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDL0Q7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzlCLENBQUMsQ0FBQztTQUNKO0tBQ0E7Ozs7SUFFRCx5Q0FBVzs7O0lBQVg7UUFDRSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDL0I7S0FDRjs7Z0JBMWdERixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsUUFBUSxFQUFFLHVGQUdUO2lCQUVGOzs7O2dCQWpDUSxpQkFBaUI7Z0JBRmpCLGdCQUFnQjs7OzRCQXVEdEIsU0FBUyxTQUFDLFlBQVk7MkJBSXRCLFNBQVMsU0FBQyxVQUFVOzZCQUNwQixTQUFTLFNBQUMsWUFBWTsrQkFDdEIsU0FBUyxTQUFDLE1BQU07NkJBb0RoQixLQUFLOytCQUNMLEtBQUs7OEJBQ0wsTUFBTTs7OEJBbkhUOztTQW9DYSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWaWV3Q29udGFpbmVyUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uSW5pdCwgVmlld0NoaWxkLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuLy8gaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFJ0dGFtYXBsaWJTZXJ2aWNlIH0gZnJvbSAnLi9ydHRhbWFwbGliLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmd1aUF1dG9Db21wbGV0ZU1vZHVsZSB9IGZyb20gJ0BuZ3VpL2F1dG8tY29tcGxldGUvZGlzdCc7XG5pbXBvcnQgeyBQb3B1cCB9IGZyb20gJ25nMi1vcGQtcG9wdXAnO1xuaW1wb3J0IHsgVHJ1Y2tEZXRhaWxzLCBUcnVja0RpcmVjdGlvbkRldGFpbHMsIFRpY2tldCB9IGZyb20gJy4vbW9kZWxzL3RydWNrZGV0YWlscyc7XG5pbXBvcnQgKiBhcyBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcbmltcG9ydCB7IGZhaWwsIHRocm93cyB9IGZyb20gJ2Fzc2VydCc7XG4vLyBpbXBvcnQgeyBUb2FzdCwgVG9hc3RzTWFuYWdlciB9IGZyb20gJ25nMi10b2FzdHIvbmcyLXRvYXN0cic7XG5pbXBvcnQgeyBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlL3NyYy9tZXRhZGF0YS9saWZlY3ljbGVfaG9va3MnO1xuaW1wb3J0IHsgVHJ5Q2F0Y2hTdG10IH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXIvc3JjL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7IEFuZ3VsYXJNdWx0aVNlbGVjdE1vZHVsZSB9IGZyb20gJ2FuZ3VsYXIyLW11bHRpc2VsZWN0LWRyb3Bkb3duL2FuZ3VsYXIyLW11bHRpc2VsZWN0LWRyb3Bkb3duJztcbmltcG9ydCB7IHNldFRpbWVvdXQgfSBmcm9tICd0aW1lcnMnO1xuaW1wb3J0IHsgZm9ya0pvaW4gfSBmcm9tICdyeGpzJztcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0ICogYXMgbW9tZW50dGltZXpvbmUgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcbmltcG9ydCB7IFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXIvc3JjL2NvcmUnO1xuXG5kZWNsYXJlIGNvbnN0IE1pY3Jvc29mdDogYW55O1xuZGVjbGFyZSBjb25zdCBCaW5nO1xuZGVjbGFyZSBjb25zdCBHZW9Kc29uOiBhbnk7XG5kZWNsYXJlIHZhciBqUXVlcnk6IGFueTtcbmRlY2xhcmUgdmFyICQ6IGFueTtcblxuLy8gPGRpdiBpZD1cImxvYWRpbmdcIj5cbi8vICAgICA8aW1nIGlkPVwibG9hZGluZy1pbWFnZVwiIHNyYz1cImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaGtBR1FBYUlHQVAvLy84ek16Sm1abVdabVpqTXpNd0FBQVAvLy93QUFBQ0gvQzA1RlZGTkRRVkJGTWk0d0F3RUFBQUFoK1FRRkFBQUdBQ3dBQUFBQWtBR1FBUUFELzJpNjNQNHd5a21ydlRqcnpidi9ZQ2lPWkdtZWFLcXViT3UrY0N6UGRHM2ZlSzd2Zk8vL3dLQndTQ3dhajhpa2NzbHNPcC9RcUhSS3JWcXYyS3gyeSsxNnYrQ3dlRXd1bTgvb3RIck5icnZmOExoOFRxL2I3L2k4ZnMvdisvK0FnWUtEaElXR2g0aUppb3VNalk2UGtFa0FBWlFDQWdPWUJKcWFCWjJlbndXYUFKR2thYUNucUtrRm82V3RaS3F3cWF5dXRGK3h0NThCdGJ0ZHVMNjZ2TUZZdnJqQXdzZFR4TGZHeU0xT3lySE16dE5KMExEUzFObEUxcXJZMnQ4LzNLbmU0T1U2NHFqazV1czE2S2ZxN1BFdzdxRHc4dmNyOUxuNC9ESDZudloyQUJnZ1lGWS9TUDg2QmRRaG9CTUJBUXNQRGtwWUlPSU5BS0FlV3BUb2gvL2l4aG9EVUdua3VBU0F3U0FlaVFTQU5aSmtFWk9VaXFRY1F1RFd3NU11ZWNDa0ZBQ25ENG9DaGpUMGRUTm5qMGs4ZWZya0FWUUlnSnJLQ0JyTmdUUnAwaUZOZzRUa051RGoxQkU3clNaZGVpNWhVQ0FyMGJYODZxS3FXS3RDc3Y2QTZ1NGhXeFp1MzFvbGkwTnVqNkgvdXQ0OUVWYnZXNzQyL0Fxays2L29ZQkY1RFl0RjNNN3NqNjBVUTFGK1RDR3k1TVBoTFBkSW03bkFXYzRkUEg5K0cvcmY2UjJNRXhKQW5WcjE2c2svUmU4Z25ka3JiUU8yYjdQdW9maGk3TUMvTlFRWGpwdXA3aHlBTTI5T3ptQTU4NzNPWGU4dTNlazE5UXJXcnl2TnJzKzdEY3dVQ1V6L3ZpQzgrSjQ3S0E3UXdYc21ld3p2aGNkUE9CL0hVKzcvczkyWGdYdmlyWmNQZjlCeFY1R0FHdVIzVzFuSTNWQWZnZ3dPNk9CbkJxWWdIdzdvVVpSaGhjQmRLTm1ISm14b3c0VGFnV2loaUliMVJTRU4vNVdtbm9yS3NhZ1hpU1NZU0VOMDl0RjRBWUhpM2FDakRCaHgxNStQSzlxSVhXVVJ6dEJoUXI0aHFTUm9OQXdKQTRyNkhJbGtrbE5TZ21NSVZyWjFuRDR6YnJsQmwwdktFR1lMUEQ1bkpnWkFYbGZsaXk4VUtlT2JxYUU1bnBwMHV2RGtQMUhpR1Nkek02UVhBNWIwYUlsbmpYckM1NDlzTVl5cFQ2Q0xHdENvbDQ4MkJrT2JLVmJLd2FDM2ZjbUJvV0lDS0txbmx6cnFBcWt0L0RtcHB4K0ErdUFMcks2QWFGMndncERxcVJqVXFvS2s5RkNhYTRpWDBnb3BDNXhtT1N3SS83Sml1T3F4S3NSWUdxL0ROdXNzQzc2ZTRDbzk1aTI3Z2JXR1VVdEJ0aVhjcXBhNHkrNktMYlFvQU91T3NONjJsK3E2bXFaZ3JqZ0J4aHVDdWlxUUM1bTc2TUNycndMZ3R0Z3Z1eVZzNjQ2aUEzdFFNSlVvK0t1cmdtVTJ6Q3kvSjBqOEFjRGlkR3Z4cC9OR2pMQUk5M0pUOGNlNlhvcHVBNW1aSUcxdktJTVZjb2tVbVpCc29qR1RnSEdPTmV1czRJSTVRN2F6Q0MyVG9EQTZIZ2ZOd2RCZzlrd3l4U3NIL1RERVJEdk5MTWZjSkMySndNZE1MVllKUllkd002NVJORFJBMUxWNG5XWUltTFR0OXR0d3g4M3cwajl6ZlNKZFdzdWo5bFZaSEMzTzNFZ0VFQnNCZGdmRHRCUWxjMU40REFPbElwZ2JKcFYwK0JNdkYyY0VBUDlqRndDNEdWV2h6Y0xrVG1TT3IrZklja3c0RzNtUm5zTGVlMHBoWjJtTHR5QTRNV2V2NFpucWhNMWNOc1ZKQk9EM0tYbC9FUnp1SkxDTzZSUUNZSzFNN0t2L0xoTHpTb1Q2a3A3RXd5ZzY3WmRmRDh2bXdndFgvYjVUUnA1RjQvcDhyNnZ5c1FTdlJaem01MmxqK3hLaWo0cjY4YWNIL2ZUdndkK2dpUHBESjc4bkovTUIrVEpEUHlzMFMzd0NkRkQvQk9LOGZRQUJjejg3blJqZWg1WUNMWEEwRGN5WEQ1TDNzMDV3RHd0VHU2QUVnQ1RDSDh4dUdTYjhYOGZBc0xjU1BpQThMZ3hDNWo0NEE5OTE4QlMxOHdMckVPaWZhOFZoZ0JtSllYVWFhTGtyR085NFZBbVhIVTc0aVFMaVJYdW02c0lSV3llaDV1Q0JpUnE4QVFmL2I1ZytMa3h4YlRBYVN4OGdDTFQ2Y2RFbTk5UEJGOEZZUTFYNUFYTTRzT0VaZmVGRUpheVJha1FTWWlDQU9FZWI2REYzcWZMaHdLRFl4MUNrOFNLQkROVWYxOEhFUXNiQ0x1dExwUGZTcGNJekZtUUxkMlRPSXFmQlIwZXFJb2VZbEdUKzNrUkdUejd5a0RvUlpmNDJ1WXN0bWxJVmtBeERKZ3Vrb2thK0VoV2dGRU5oVkNtOSs4anhsbzVESmY1NHFVbnFkQktZQUJRbUVtWjVIUjdlcFpUSUJCNGNka25NRVQzR2x0SDBJQ3VQVXMxaVRnV2IyWHhjSFpqWlRKY2NNNW9TeEFNMXU0bkhlMEF6bTU2NEpCL0k2YzE3dUJLZTJ0d2pPM3ZKeUVweU1aMkNvS2NpelVISVBzYXlFQUpkelRhbjZjK2Z5VE1SQ2IwUk94SjMvOFpjTGlLaWJQeEdRMldqVE5UdFU0enhvS2lDNm9qUWozYlVFRVNVejBKbHljNlYwdUYxY3hRbkwralpqNEtxNWFUcTVLVkx4N2xST241ampUdGQ0ZzB0U28xMWhvOGpLU1VLVHZYWnFLRGVRYVM0QUdnODlwYVRwS3Jpb2ZndzZpak4yVlBOT2ZVT0Q1dUtUVDhoVlpKWTY2dDZxT1JCcDZKVmEzNEZxcVpCNng4R0pWYzlORkNtcUNGUVhmVlFzckwrSmp5Y3lSeEoyU3BJdGxUT0UwUVZrRzFvTXlHODBpZ3llL1VEWGZ6cUk3ZEUxZzlwd2VxaWtQSWR6Y0xxc2tvTHJXaEhTOXJTbXZhMHFFMnRhbGZMMnRhNjlyV3dqYTFzWjB2YjJ0cjJ0cmpOclc1M3k5dmUrdmEzd0EydWNJZEwzT0lhdHhFWUxaYVprdHZVR3YrWVZIZVZmYTV5MnloZE5KR3l1bnB5TG5hN2ROM3RUa203M3JWUmQ4UExJdkNTOTBMalBhK0R6S3ZlOTZTM3ZVR2lBWHpYdTl6NTVvZTk5cDNWbHBqYktQem05elB2L1MrQTVTdGcvZFMzd1BxVkFZSVRITjBGRDVpNkR0WkxnQ1BNTndoVEdDNEh2dkRYQ0t4aERPKzN3eHUyTUlnbnJHSC9sampESUk0SmgxTzgxSEx3TjdzclRqR0pMMnhpR3FOWXhqRWU4WTExTE9JT3o1akNOUWJ5am4yY1l5Si9tTVVxN3ZHSmo0emtJRWY0eDA4dThwS1I5R0xyWHNRa1dNNnlscmZNNVN5ekU4cE43YktZeDV6bDQ1cjV6R2hPczVyWHpPWTJ1L25OY0k2em5PZE01enJiK2M1NHpyT2U5OHpuUHZ2NXo0QU90S0FIVGVoQy94Yi90SWJHUzVML2ltaEloS1hSZWtBS3BCa0IyZDlrRkVTcW1iUWRibGZaNFhIR05zNWtEMkFmc3h4Tno3T2VYM0dQcWNIcTNydlFNcS81V1hVYjZFcHEvcjFWZ2FsV0VtRnRiYzZqOXZwOXNpWURWWCt0cEdDelVHVm1iZTVVQTJuc01URGJIRUNWeUJkRGpZeFpOaHNNcXJ3MkZNalpEMlpxVzNMZC9IWWt3ejFUaytMam8rSjJTbkxUYmNEbnNwdWIxWDMzRkxBcmIwUnV0OTdiOWk2K0dWZGxLbXFqMzBnMEJNRDluWTJCQjV5cDVOMDM1ZHFyOEJLMEZkMVpOWGhQR2g0Q2cxT2JIUkozSTZ2UFMvRjJxN2ZqY1BwNHJrVStCNHNQNXVIb0Jqa0VKSzV5S1RKODFpVC82OHZUWVBMN1pKemlGbS81R1ZnK0JwNC8xdWM2LytRNG1DRWU5SHQ3aXVYcGZ2SEZoeHh2bDd0YlgwQUhvVWwxdm9lYmo3dWFKVnc2eG1QdWNXSzY4T0R6ak9IQXRXM3RIaEk4cHhvUEk3MURLVWs5dHZPbEhyNXkwOW1PYkRYZWlPb2pmTHZhaVU1MzZnbWtzSkFEZFNyM3llNFd3aHZ3YXJCT0FySGVQVjhQZnBLMmcvemhSU252Z21uZHlYcG5xWngrZ0hJS2hvRkZDNVZWd3p0LzZTUW1zdWU0RGdMb2RYa2hseDVSNGV3Ymd1VUx2M3JaKzEzWW1neHFsNzRkUWlLUW5wK29WK2d3SFY4RnRWMnUyR2hBUE9kQkIyNDBvUlZjTkpmb0VZNUlCZW92TS9Wb3FQVDBtVzlIN2krL25Ja0hhZURxWG4zdkMxQ3ZIbzNzNjd0KysrNExmOVpNTUgvejIrOStnMGtidWxVSTVQL0NNNzkxOGxlY3pBQllaaFVuZjA1UmVzczJYU1REWFVLRGdFM1FPY25tZitEelhRdW9iTnQyZVl3RWdSR29hektEZ2JTMWZ1V2lnQ05BZ0tzbGdoZGdaUnRJZ2JWbGZTWmdnaWNJWTdaRmdpVUlnaTNvZkxhbGdpc29nek9JZzdEbGdTZkFnanJEZ2ExbFBMampnemxJZks1bGd6Mm9neUdJZjZ3Rmd4bEFoRVdJZksrRmhFa29nU2hBaGFybGhFK29oRCtJZ3FvbGhMTERoVkhvZVYrb2hWdG9oZllDaEtRRmhtR0lobGRvaHQ2Q2hTZ0FoUzdEaEtNRmgyZW9nWitqaGxKamgzTW9oZzduaDBHRGgza29YaTVBaUp2RmgxV29oNHFtaUJhRGlQZ0JpSFhvaFgxSWlYdm9oaXZBZzVYWVh3b21pWlBJaVVyRGhvZmlpVGYvYUlrTkk0ZVh5SWh0SVlqeEFvbjdnNGt0SUlvZkk0dWpDSXVOYUlyZTRvcXZxSXAxd29xZjVZZ3FRSWR0U0gvNjRvdTJRb3B2eUlCeENJekJpSXpKU0l6VllvekhhSXVyeUl4VVpvMXBTSTNWQ0kxSGg0M1p5SXVkaUl0dklvMnBhSWcyZ0lwTVYzdHg1SXpSNG8wQ1FvN2xXRjVtQjRxVlFvc253bzd0S0k0cVlvLzNLSVU1b0l1N3hvMlloMnIySnBENzZJN1RTSWIvaUpDMHdUbytzSHVQNTRKRFI1QUw2WTkycDQ4Vjhuc1B4Z01RT1JyS21JNFVXWkVLZVpFRzJXRFk1NUVXdVJzTWFVd255WkZHU0pJMG1Dc2FtWFlxbVpKLzUzeDRCM2VFb25vdldaTTJHWTN2VjBFL0NaT3RoeklQTndRZEtaUUtsSk5qcEVSQ3RwQ1UzeGRybzZWOVQ5bVRFU2w1VTJsWkttR1ZMdWs5VENsd2srQlVVUGxBQThWYVh6V1dTbmtZWDFsTFhIbVZTckdXTklLV1pEa1djT2tqY2htVkZtaG9kOGw1ZVpsb2U1bG9UdkNYZ0JsL2JUbVlTeUNZaHRrN2habVk0emVVakJrOWkvbVlSWUNZa3JtVmpsbVpSa0NabU1tVGw3bVpTQm1abm1sQ29CbWFLRG1TcFBrU1dsYVVwN21hck5tYXJ2bWFzQm1ic2ptYnRGbWJ0bm1idUptYnVybWJ2Tm1idnZtYndCbWN3am1jeEZtY0dKQUFBQ0g1QkFVQUFBWUFMTFVBRndERkFMOEFBQVAvYUxBYi9qQktRNnU5T092TnUvOWdLSTZqWko0VHFhNXM2NzR0S3A5d2JkOTRmczA4Qk9qQW9IQm82UmwveEtSeVNUTDJrTXlvZEdwdzhxRFVyRlpubldHMzREQ3JLL3VLeitnT0dXVk91OS9WdGFrTnI0ZmxjN3NlalpmUTk0Qk1mUkYvZ1laRGd6NkhpNEtKRG9XTWtUV09qNUtXUUpRQmtKZWNKWlNibmFFZW1hQ2lwaG1rcDZvaXFhdXVhcCt2c2hxdHM3WVV0YmV6dWJxdnZMMnJ2OENud3NPaXhjYWR5TW1YeTh5U3pzK00wZEtIMU5XQjE5aDdtUUhib2QzZnlwbmluT0hsbHVmb2tlcnJpKzN1aHZEeGdQUDBldmIzZGZuNmIvejlhZjRCUENOdzRCMXlCdTBVVEtobElVTXFEaDlLaVNpeEVhV0tiaWhpVEtKeC95TWloQjRQWGd3cDBoSEprb2xPZ3Vtb0VnZkxsalpld29RaGM2YUxtamJIZ015NUJDZlBKanQvRXZFcE5BVFJvaCtPSW9VMWNxa1FwVTVwQlkzcWNpclZxMWl6YXQzS3RhdlhyMkREaWgxTHRxelpzMmpUcWwzTHRxM2J0M0RqeXAxTHQ2N2R1M2p6NnQzTHQ2L2Z2NEFEQ3g1TXVMRGh3NGdUSzE3TXVMSGp4NUFqUzU1TXViTGx5NWd6YTk3TXViUG56NkJEaXg1TnVyVHAwNmhUcTE3TnVyWHIxN0JqeTU1dFNVQ0IyN2h6Njk3TnU3ZnYzOEIvQ3docE83ang0OGlUNng1QVhMbno1OUJ2TS9kWVBMcjE2NzJuYjZ5T3ZUdDJBczI5aTdjT252cjQ4OC9MYjBmUEhybDZqTnpieStmOXZtTDgrZmh4aDgvUC8vYisvbUg1L1FmZ2ZBSU8yRjZCQnFLSFlJTGpMY2lnZHc0K2lGMkVFbHBIWVlYUVhZaWhjdlZKZE4rRzVHa0k0bkVkUHZUaGlPbUppQ0p3SlRKMDRvckphUWNmak5mSmFGOXZCT1NvNDQ0OEVqREFqMEFHS2VTUEFoUnA1SkZJQ21DRkJRa0FBQ0g1QkFVQUFBWUFMT2dBSmdDQUFBa0JBQVAvYUxyYy9wQUZFS3U5T092TklRZ2dRSFZrYVo0bXFFNGo2cjR3dWM1aWJOKzQ4czEwbS85QURXODRDUnFQangyUjUwTTZjOHRvODBsRlJhL0ZxcmFreEJKcjIzREc2NTJLejRzdVdZcHVMOVpyczVzS2g4L0Y2dnBTZmovcXlYMWJlWDlNZ1ZxRVdJWlZnNGdxaWxTTWpWbVBTSkpMbEU2UmpYeVlOcFpFblVlYWlKeWhMcU9JcGtHZlE2cEFxSCtscmltc003TTVzSHF5dHgyMXRyeWV2aXE3d0JtNWVzVXh3bzdKTDhkd3hNMFd5eURTTHRTVDFpVFBkdHEweTlIZURkeGs0ZUlTMU9jeTFPYnE1SURxSE5qdDUrOWU4ZkxwK0VMcys4Ylkvc2IwQzJqQlhpS0Mwd1lpaElBdHdNSUlCcTg4akRCdlloS0FGaDFVek1nZy8ySVVqaDAzZ2pRZ0VxVEhTeU1WbE9SNEVsVEtsa1BvaVd1WTBnRE1RaWxYWnJ6NUs2ZENreGhyOGd4Uk0yU3RvaG8vSWIyNGFhbUhWRTRwNm9wYWdSdlZDN2xrQ2oxNFZhRExyaG9HYWFXcUJxeUpIV1BOcGpYTHRxM2J0M0RqeXAxTHQ2N2R1M2p6NnQzTHQ2L2Z2NEFEQ3g1TXVMRGh3NGdUSzE3TXVMSGp4NUFqUzU1TXViTGx5NWd6YTk3TXViUG56NkJEaXg1TnVyVHAwNmhUcTE3TnVyWHIxN0JqeTU1TnU3YnQyN2h6Njk3TnU3ZnYzOENEQ3g5T3ZMang0OGlUSzEvT3ZIbk93QUVLRUJEd2wwQ0I2d1FjN28xK3ZmdUF2ZGE3aTZkK1Y0RDQ4OUsxMDBYUGZvQjZ1QVBZeS84T2w3dDgrZVRiaHI4dlB6dGI4Ly84QmVnZVdQc0Z5RjkrVGdGb29JSFRPV1hmZ2d2NlYxUjhFRlpZQUgwalBXZ2hoQWhhVk9DR0VFbzRrWUlnYmlnaVFoK1dhQ0dHQVZHbzRvc2RxcVBoaXlXZWVFNktOSlk0NERrejV2Z2lpOWJnNktPS0RWcEQ0cEJEMmdpTUFFSWlxU0tReFJ6cFpJNHhBdVBpbERrVzJVd0FUV0pwb1pLOGNPbWxqMUF1T2FhUFZmSnk1WmtnZ25sTEFHdXl1ZUo3eFlncHA0N2FNSGxuaVduZUl1V2VETkpaVEp5QUNpaG9tSVFXZWwrZnM5aXBLSU9NdXZMbm8reTVlVXVpbEo1WHBwV1pHbmhvbUYxU2Fpa3Zlblo2WHFSbW1vcmRwOVpndWllcVc3cDZKZ0VMT1Fvb3JONlVldWVtQVUwNkphN3h5RW9qcjdXR1dpT3JFOW1LWmxReXZwcUlMRWpDR2dpc1JYRCsySmF5RVQ2N2xLNExUbHRVcytJUmE1YXNvN0pWN1h4NVlidGpYaVNXT3hlRjNzS0Zhd0lBSWZrRUJRQUFCZ0FzNkFCaEFIOEFDZ0VBQS85b3V0eitNTXBKcTRYZzZzMjc3MEFRZkdScG5rOG9CaG5xdmpDMnptMXMzK1NzczNqdlU2cmQ3RWNzR29KQ21uRVpReVoxektqSitkVFZwTmhMZGN2TGVpVlU3dTVMYm9URnUyc1plMFlMMWV1bGV3NlAvOXJ6Wk4xdXcrZWZmRDUrZjA5N2dTV0RoRldITUlxT0lvYU1Hb21QaTVJZmxKVlZrWmN5bXArY25RdVpuMXlob3FXcElxSmdxcW1uaDZTdW02d3BzNkMxRDdlZnVRNnl1Mm05REwvQVNzSUt4TVVyeDhqS2pyQ0J6b3JRZk1uSzFIYld5c3hIMG9UWWNkNS80R3Zhd09SbDVzRGM2cnZvWk8yejcydmlhUE54OGJ6Y3V2VjYrNTc5VnR5VEZIRFpQd29CQjRyS1orcWdCbWtLZXpFVTR0RER1WW9lSm5iQmFQSC9GVWNUcFQ2ZU1CZFI1RE9STDM2VlJMa2d6MHFXemNTOGhEbHF5MHlhREN6aHhCSG01czRHVm40U1VlRlRhQXFqU0pNcVhjcTBxZE9uVUtOS25VcTFxdFdyV0xOcTNjcTFxOWV2WU1PS0hVdTJyTm16YU5PcVhjdTJyZHUzY09QS25VdTNydDI3ZVBQcTNjdTNyOSsvZ0FNTEhreTRzT0hEaUJNclhzeTRzZVBIa0NOTG5reTVzdVhMbUROcjNzeTVzK2ZQb0VPTEhrMjZ0T25UcUZPclhzMjZ0ZXZYc0dQTHRpQ2dyUUFDQlVha0RZQzdRQUVDYVFmNEhsNmdkbGtCeElrREgzczdlZklCWVhrN242NjdxL0RwMDZGelJZNjllL1dyMHJ0M1gyNDF3SFh4NG8xVFBZOGVQVlh1N2VOcmZ4byt2djN2UytIYnQwK2VhWUQ5L3dEbTlwUitBWXJYSDFPOUZZaWVldjRwR0I5VTdEbVlIWDBTb29lZlVnUldxQnhVQ1dxWUhJTkwvZWVoY3djdTFlR0l2b0dvbElnb0VuZGhVaG1PT0Y5VEo2TDRJbElzdHZnYmh6b09wMkpTT2JaWW9sSVJvamdqZ2ozNmRxTlJNWG80WkZJMWpyaWtVRUdpK0NSU1JZNzRJNVJKRmdCVmt4b2VhV0tYVS81VTVZaFhHcFdsaDJYKzFHV2FRb0ZaNFpaSVJja21oVW1LU1NTWlVMMzVaWmQwR21WbmhYQ2EyYVdlU2EycFlaczRuZWtob2tqSktTR2pPQTBxWWFFN09hcGhvRUlwV2lGVW1sWUlLWk44UG1XcGc1ZzJXcXBUcHlxWUtrMmhTc2pwVDU1S0dGV3JCWTVLNWFvMEp2a3FUTEU2T090T3RicDZhNUxENGlScGdEY0VKTHNUcnZKUmFxaUd6VnBWN0hnQ1NNdGxydHBpR09BQXpyTEtYN2g0R2todVZJbzIyKzFVMDZscmxuN3Vvb1Zidkx1ZHkwd0NBQ0g1QkFVQUFBWUFMTFVBdWdERkFNQUFBQVAvYUxyYy9qREtTYXUxSU9qTnUvOWdLSTRpY0oxb3FxNFk2YjV3L0xGMGJkOU1KdTk4citIQW9EQ2k4eG1Qb2FGeWlTc2luMCttZElweVFxODlxbllMc1dLL01LNVk3QVdiUmVNMHRYeHVkOVR3SmR0Tmo5dURjM3I3enJmbDlXWjlnaXQvZ0YrRGlDZUZobGVKamhTTGpGR1BsQStSa2tlVm1qbVllcHVmbDUxWm41cWhvanVrcGFkN3FaU21xMkd0ajYrd0xyS3p0V0MzanJTNWFMdUl2YjRnd01IRGpjV0N3c2R2eVgzTFBBRFMwOVRWMXRmVXp0cmIzTjNlMytEaDR1UGs1ZWJuNk9ucTYrenQ3dS93OGZMejlQWDI5L2o1K3Z2OC9mNy9BQU1LSEVpd29NR0RDQk1xWE1pd29jT0hFQ05LbkVpeG9zV0xHRE5xM01peC82UEhqeUJEaWh4SnNxVEpreWhUcWx6SnNxWExsekJqeXB4SnM2Yk5temh6NnR6SnM2ZlBuMENEQ2gxS3RLalJvMGlUS2wzS3RLblRwMUNqU3AxS3RhclZxNDhFYU4zS3RhdlhyendMaUIxTHRxelpzMkhQcWwwN05pM2J0Mlhkd3AwcmQrN2J1bmJYNHMyTGRpZmZ0d1QyL2gwYjJPOWd0WVYxSGtZcytIRGluSXZQUHNZWjJlemttNVhMWHJhWm1lem1tcDBKTng3OG1XWm9zYVZubmk2UVd1YnExakZmai80TEc2WnN3NkZydjF3OVlEYmYzcmc3QTFkOGVqams0cjd6R3FlTVBIam01WmliRXc4Tm5iUDA0OVNUMjYwTytqcno3TTRyQzlBK2QzejR5T2FuZDA2UGZUMTV1T3kvdXorL09INzAwUGF0NDMvL05uLzMvVjMwSGVhZmFhY05xRnFCL0xFVlFJSnJMUmpnWUE2cWwxbUU3VTNJb0ZvVXltZmhnMzlsZUY5bkh1b0g0b1ZuaGZqZmlCenlaU0tCb2ExNFlJc2ttdVdpYTZmTkdGdU5NY2FWSTFrOXJlYlRCbG9OSUNRQlJCSUptRzR2SlFBQUlma0VCUUFBQmdBc1lBRHVBQWdCZUFBQUEvOW91dHorTU1wSnE3MDQ2NjBBLzJBb2ptUnBuaGtRQkI3cXZuQXN6K1pxdDNTdTczeXZxVGFiYjBnc0dsM0JKTzdJYkRxZndHUncrYXhhcnpDcGxvWHRlcithclJoTUxwdWpZaW5Wekc0YjAvQzFlMDZQb2VGYmVYM1BCK0gvZW4yQ2d4SjNmMktCaElxRGhvZHBpWXVSYzQ2VUs1S1hmSTJWajVpZGJadWdrSjZqUnBxZ2VLS2txanVuclFHcnNFV3VycW14dGlTbXM0ZTF0NzBidXNDOHZzTVR1Y0NVeE1rZng4ekN5c25HekpYT3o3N1Iwc2pWMmhIWDJJRGI0QTdleDlUaHE5M2pjZWJtNk9sajYrSHQ3bXJ3NGZPMDlkdnk5MVA1MnZ2OExQbXJCcEJmdVlHWEN0NDdpREJTd0ZBTm9UMmNGbEhpUkVjTUt6SzZpRkgvNHpDT2pqeCtCSWxLeGdBQ0FrUmFVWmd1STRVQUJXSVNlS1VTQ2trdExpa1FpTWx6UU0wcUxNbkZnTW16YU1xZlRtNnV5RGxoWjlHaU01RTJDZHBLaG9DbldBc01vQ20xRkVlbUVyS0s5ZG4xQ05XUU1RYUlYWHUwYkpHejZyS3NuUnZWcmF4NUp1ZnEzV3FYQ0Z4NmN2VUtidHUzeDkrbE1wd0sxb3V5OEpDL1lDRmNYVXk1cm1NZXdSSlQzcXoxc3VGWlZqbHZKdXVaUjhISUQ0aUtYc3kxdEdtS2FWY3ZKdXo2OHlFWnFtV3ZKVkQ3eUxjWWluV0xiZDM3TVJ6Y3d1a1duNXBIYy9MaHk1M2NRZjFnOG5Pc3BLTTN1VEhqdWxqdFY2Zy9VT3Y5S1czd3BIS1hMOEFiZlN6eTYyTVNkKzlKZmZuMjlGVUZYejgvL3lYci8vRmw1MThuKzNtSDM0Q2RBTGplZVFoR0VoOVBCellvQ1h6eDlTZmhJUFo1SitDRmloVG9uWVVjOHBIaGRReUcySWVIejBWb29pQUtsbGZpaW5XZ21KeUtNTzVCSVg4MVl2aGdUQnZtU01lTjVma295SWpQdlNpa0dUSUtSK09SYkJDWkhJaE1rcEdrYmt0R1NVYUxIMXBKeDQ2ZGFla0drTjU1NllhVHdoa3A1aFZncG5obWsxeEN1V1lWVThyVzQ1dFhZSG1kbTNRMkVlZHFjK2I1aEoweit2a0ZtYnFaS2FnUmFRWjZLQmFFeW9ibm9rUHNLVnFma01yU1pxVldTTXFab1pqeUFLaVNuVlp4YWFoT0NLRHBZbFdTT2tRQWlhNzJxS3FlbmpvV3JGZXcraHl0ako1VUtLNWQyQ3BhcXJ3eVlTcG5yd1pMaEsrQ0FXdHNFeVBENmxYc3NySTBteFdsMEZhQkxGVFZ0aUhBalp4bVcwV3p5bnFMaGFuUGlvdENBZ0FoK1FRRkFBQUdBQ3duQU80QUFnRjlBQUFELzJpNjNQNHd5amJJdkRqcnpidi9ZQ2lPa1ZDY0FxbXViT3Urc0JnUTUybkZlSzd2ZkI0TXRXQ3FSeXdhajBWVGNCbEFPcC9RYUdhMnJBNmsyS3lXK0t0NkM4MnRlRXdHQWIvZVczbk5iaXNFTlBSMzZLN2JvVlE1V24zdiszVm5lbkpYZjRXR0tuQ0NpbUdIalk0WWVZcUNmSStWbGdhQmtvdVhuSTFLbXBxVW5hTnRrYUNhZEtTcVpKbW5vS3V3VzUrdXJvU3h0MGltdEs2TXVMNDdyYnV1b3IvRkxMUEN3cjNHekRKeHlkREV6ZE1hd2REQ3FkVGFFOGpYMTh2YjRRdTYzdEMyNHVoZDVlVUU0T2phM2V1N0JObnY4TS95eWZYMjArVDV0ZTc0TWJQMkQxUTdnZUVTRmNTR2NKdS9oWkxPTld4R0VLS2dBUUVuNG9wbmNmOVNSbzJ4SG5hVXN3OGtyb29qdjBnMCtRdGx5aVVIV1RiaitESUlQWm5VUk5Zc2lmTVh6WlFyZXpMVENUR20wRzAvQzk0OEtvNm92S0JNc1FBNGtyUWN4cWhqQUFRSU1MV0kwMlJHc1diUnVuVXJWWWc4eFRvcHk3WnJFWHhXMVc0aHk3YnMyWFZoNVVLaFc1ZnRFWmVTOHVwMXdyZHZXeU5WQmFVZHpNV3c0NDh4QUtPQnlyaEk0Y2VIdmNKVkpMaXlaY3lnN3daZTdEbkhaZEI5M2ZiNFdvQjBhUnlvWTBPR1VaWHlheDJuWlJ2K3UyZjI3UmU1ZFJ0V3pjT2Y2OTh1Z2d2ZmpYaUpiZVE0bEMrdlM1ekhtYXZRa1VpZmJ0ZklETi9aWVhOSFhUMzhyZTNqelE4ZGoxcDlNZlRjeTd0WEJYLzYvRi9zUWN1LzM2bitjdjcvdU9TSDJYNEFXdUtmY0FRVytNaUJ1aWtJaTRDUEplamdJUXpLTnFFcUVEb200WVYvVkJnYmg2Tms2QmlJbllpWUdvbVhlTmdlaXBhWVNCMkxsYWdZR295UHVKZ1pqWTNZMkIyT0ZPcG9GbytIK01nVmtJYklpQm1SaGdpNUlaSmpDTWxraHo0dSthUVdTazU1aDVHUFdYbEhsVnJXNFdTWGJtQTVISmh1ZkVubUdtSXlkMllaWEs2WmxabHVpcEhtaTNFMjZXT2RiK29vSlo2cjNjbW5GblBXOVNlZ1VRNmFCWnlHUGhGb1dYc21HZ09pamg2eDZGYU5SdW9DcEpaNjVXZW1raGJLNlJHWWZvcWJwNkkycG1PcDN1bUpLaEdMVnJxcURDYTYrbW9JWXNvNks2enNBV0RycmJoT3R5dXZJakQ0SzdBaklFaHNGT2dOZTZ3S0dQb3B1eXl6d3puN3JBcUY2VHF0R0l4S2V5MEwxb2FRQUFBaCtRUUZBQUFHQUN3WEFMb0F1Z0RBQUFBRC95aTEzUDR3eWtubE1EanJ6YnYvWUNpT3BEWlVhS3F1emxXK2NDelAyY25lZU83U2ZPL0R0cHh3T05uOWpzZ2tnY2hzTW96SnFEUzJkRnFGMEtsMjY2bGV2NnNzZDh6MWdzOFVNWGtkTmFQZkR6Vjc3b1BiSVhLNlhuYnZQL2VBZFg1OWVZR0dJSU9FaDRzdmlYZUZqSkVHam5hUWtvdVVjSmFYaHBsdm01eUFubWlnb1hxalo2V21jNmhncXF0cmJxMUVyN0Jqc3JOWXRweTR1VGkxdTFxOXZpekF3VkxEeENyR3gwbEJ5anJOak0vUU44elNTUUhhMjl6ZEFRTGc0ZUxqQWdQbTUranA1Z1RzN2U3dnZkZlk4L1QxOXZmNCtmcjcvUDMrL3dBRENoeElzS0RCZ3dnVEtseklzS0hEaHhBalNweElzYUxGaXhnemF0eklzZitqeDQ4Z1E0b2NTYktreVpNb1U2cGN5YktseTVjd1k4cWNTYk9telpzNGMrcmN5Yk9uejU5QWd3b2RTclNvMGFOSWt5cGR5clNwMDZkUW8wcWRTcldxMWF0WXMycmR5cldyMTY5Z3c0b2RTN2FzMmJObzA2cGR5N2F0MjdkdzR6SUNRTGV1M2J0NDgwYjF4cmN2MzcxK0EvY0ZMTGp3TnNLR0N5Tk9ISGd4NDhGUUh5dU9MTGt4NWNxUW4yTDI2M2l6dHM2ZVFXOFdqWmwwWmRPU1VUOVd6WmgxWXRlR1lVL1c3Tm1iYk1HM0xkT3V6UzAzNTh1OFB3TVA3anV6MCtDOWgvTXUvbGQ1YmVhMm5ZZVdQcHA2YWV1bnNhZld2cHA3WWdEUXVZSDNibmo4N3VEbWp5TVBrTDdwZXZiaHQ3Vm4rbjcrMHZyeHRkbFhpcDk4NGYxSlNmVjNIbThBSWlXZ2VzZ1ZlTlNCN3Eybm9GRU0wdWRnZnZENUo5aURSVVY0MzRRV0JvWWhVUnJ5eCtHQXRYMDRWSWdCam9nZ2VoU2FLQlNLQnE0bjFYc3p5aWpWWGFFbEFBQWgrUVFGQUFBR0FDd25BR1lBZFFBQUFRQUQvMmk2dkJJdHlrbXJ2VGhyRmtnWld5aU9aS2tNUlZvSVp1dSttNkNxQkFUZitOdk44MkRud0NBR3hlT0JoTWlrbzhna3NKUlEzSTdaL0VXdkpCbDFlOFI2TmRQdDl2a3RVNGhpc2RQTVptalQ4RnFialliRHUvUHIyODRuNTVVZWZJSUZjbjlJZTROOFBvWkFZWW1EZUl3dWlJK0RmcElranBXSmhaZ2psSnVKaTU0Ym1xR1ZsNlFWb0tlUGE2b1ZwcTJibmJBTnJMT2JrYllHQVhXNXM2bTJzc0NWdGJ3R3VNV2NWcnkreTdtN3c0SFFwOEt3eXRWMng3eS8ycUxOMDkraDB0ampvZGVxM3VmYjRiREU3R0xscXRueFRPbWs2L1piN3UvVSsyT1FTYWdYajREQU13RHZIYVFBNzV6QmhhdisyZXNIa1lFK2JmTXFjcEQ0VGYrakJnRWNsK0h6R0lHZ01aSWhua0dqaUpKaFNGb3Rzd0JqR1RQV1JVVTFUVFJNazNNU3FwNHZiaFo1Q05URlRoVTBpOGE0b3pUSHphUk5VNGJNR0xVRUlxSlZnYUFabVZVbkFheGR3NG9kUzdhczJiTm8wNnBkeTdhdDI3ZHc0OHFkUzdldTNidDQ4K3JkeTdldjM3K0FBd3NlVExpdzRjT0lFeXRlekxpeDQ4ZVFJMHVlVExteTVjdVlNMnZlekxtejU4K2dRNHNlVGJxMDZkT29VNnRlemJxMTY5ZXdZOHVlVGJ1MjdkdTRjK3ZlemJ1Mzc5L0Fnd3NmVHJ5NDhlTzRBd1FBQUJpQWN1WE0rejZmenRmNTlPZlI4VjdmbnAydTllM1h1OGNGVHg2cTJmTGx4YS85amg2OGVyVHQ0NzhueXo0KytmbGk3ZXZIWDdXK2Z2VGYvQ24xMzREbXhlUWZnZVdKZFNDQzd1WEhvSHdLUGhqZldCSzJGMkJPQzFhb0hJVWEzaGRoaCtCeENPSjFJbzZJM1ljbVBsZGlpaGZXbEtHR0s1cllvb0VwVXVkZ2pRVzI5S0tFTThhRTQ0WTMxdGdqU2p0S0dPT0lRNUpVSklOSmt2Umpqa1QrMktSSFR4NEo0cFFWTGNtZ2xSMk9wU1dCV0ZaVUpZb3NjZ2tqbVRLYVdhR2FScUtKSkpzUGVpa2xuRnU2ZVNXZENNcUpvNTVDNGtrZ24yVUdtU0tnYVFyNnBwMWQrdmxmbUZudVdkYVg5akdxNUlocVFVb2VXNWFHNTFhbVFMNWxxYVJLUVZyWGtxRDJ0Mk5lR1ZiSG5WL3NCZVpjcVJZa0FBQWgrUVFGQUFBR0FDd25BQ29BZFFBQUFRQUQvMmk2M1A0d3lrbE5DRFhyemJ0WEFrRjhaR21lSUZHc0F1cSs4Q0lNYXozR2VMNEZkTzBQdXFDd0VRajVqZ1hNY0lreklvODNwdFRFZTFxVjB5ekhhVVZHdFdCSnRkdHRoYy9FZ1lwTVJyc3RQVFlaK0FaejVXUnNmVG5HeTc5N1FYZCtiSHFCT1FLRWhJQ0hPR3VLY21hTk9RR1Fmb2FUTDQrV1hYU1pNWldjaFo4NGNhSlBqS1JVcDJTU3FpaUpyS2l2TUp1eU5aNjBKckczUjVpNkhyYTl1Y0Fmb2IwK3Y4VWJwc2lweXhySHlDelFKTTNJMVNUVFA5a2V2TnZLM1JMQ3Q4L2lFZC9UNGVjUDVMTG03QTdTMDY3eEV0ZTk5aFh6eU1UNkQvaHVyZnRud0IwcmVBVFRJYXRIc0lIQlV3ai84ZXZGc09HQ2g2Y0c2cHQ0eS8rZlJRVUJaV25VdDgzR3h3Y0tLWjUwZ0pGVFJIMHBPNjUwV0hMRnlIZ2NaWG44R0pMVlRYWTVEODVrMFBOVXhZODFWd3lWa1hTbnhaYWNmcDRMQ25HcEFxaVdwSXFqS3VxbHZhS2lqamJrS3NxcWdaZzZ6V0pWNUxRaFdwZGEyYTFsSTNZbFdUWnRoNEx0UWlBdXdidFE2cG8xc05lSDRNRUtDT1ZGekpSTlg4WWFEQkk0REpsQnpNV1ZXUjRaNExmeXNjZVpQOUNnSExxMDZkT29VNnRlemJxMTY5ZXdZOHVlVGJ1MjdkdTRjK3ZlemJ1Mzc5L0Fnd3NmVHJ5NDhlUElreXRmenJ5NTgrZlFvMHVmVHIyNjlldllzMnZmenIyNzkrL2d3NHNmVDc2OCtmUG8wNnRmejc2OSsvZnc0OHVmVDcrKy9mdjQ4K3ZmejcrLy8vLy9BQVlvNElBRUZpamJCYmtCY0VFQUFOaW00SUlJenZZZ2hCYzBHTnVFRkZiNEdvWVpMdGdhaHgwdWFHRnFJWmJZbVVVZ21paWlhU21xQ0dGcExzWllXWXN4VWppaVZUVFdtT0ZnT3ZaNDQwazU5dGpoVEVFSzJlR1BFaG1wSklwS05ubmlKRVU2V1NLUzJVaHBKVHRSV21raWxicGtxYVdLVlg3NUpaZWZlQ21taTJRZVl1YVpMdEt5SnB0YnVnbm5tSExPYVdXYWU3eHBaNFo0MXJIbm5YWCtxV1NmYitncGFJU3ZITm9rb1c0WUtpaWphRGo2SjZSb0tMcWtMcFlLU1dtam1jYTRhYUdkeHBtTnBGK2VRNnFVbjBJWnFvYjJuQ3BrUTY1Nnl1U2hxUUlUNjVGTDdXbldyYXlhZFdhdHBtb0pMRTVTc3Jnb2Ftc09DNnVPR01wK0ZDVnNLalpMWklqU0xnWGliUkJXTzVpQzJoS1VBQUFoK1FRRkFBQUdBQ3dYQUJjQXVnQy9BQUFELzJpNjNQNHd5a21ydlRpN3dJVVlJQ0dLUldtZWhhaXRiT3UrTUlYT2RGM0VlSzd2c08zWHZLQndPUHdaVHdHaWNzbkVISi9KcG5RNmZSNmoxS3lXWnpWaXQrQXdxL3Y3aXM5b0NkbG5UcnZmYTF2N1RSZkhhL082UG51bjVmZUFUSDB6ZjRHR1FvTW9oWWVNT1lsSWpaRkZqeVdMa3BjYWxKV1luREdhQlphZG9oR2ZvYU9uREtXb3F4V3FySzhRbndLd3RBMnl0YmdHdDdtMHU3eXZ2cityd2NLbnhNV2l4OGljeXN1WHpjNlIwTkdNMDlTRzF0ZUEyZHA2M04xMG53UGd6NXJqNU5MbTZPbVU1K3VINHUvVjZ2TFk5UFhiOS9qZSt2dmgvZjdjeEF0WVp5QkJPQUFQMmttb0VJekJobWMrRVlDWVJpSkZOQll2THFRMFVmOWptSXdldDRBTXlVZFRSNUlsT2FMVU1uSmxrNVl1bDhDTVNXUW1UVVFtYjc3TXFWTW16NTQxZndMRnFYTG9wS0pHZzN5NmtWVHBwNlpPTlVIbDhuU3FqcVZXcjFiTjZta3IxeGNnd29vZFM3YXN1NjlvMDZwZHk3YXQyN2R3NDhxZFM3ZXUzYnQ0OCtyZHk3ZXYzNytBQXdzZVRMaXc0Y09JRXl0ZXpMaXg0OGVRSTB1ZVRMbXk1Y3VZTTJ2ZXpMbXo1OCtnUTRzZVRicTA2ZE9vVTZ0ZXpicTE2OWV3WTh1ZVRidTI3ZHU0Yyt2ZXpidTM3OS9BTlFEZ1FMeTQ4ZVBJa3l0ZnpwdzV4ZWJRbzB1Zmp2dzU5ZXZZczNPd3JyMjdkK1hjdjRzWEgzNjgrZXpsejZ1WG5uNjkrK1h0MzhzM0huKysvZnIyNWVQUDczNC9mL1ZFL3YxblhvQUNrZ2RSZ2Z3UmlHQjNDaTZJM29FTzZnZGhoUDFOU0NHQUZsNDRZSVlhR3RoUWh4aCtDT0tHSW83b29VSW1qdWNSQUN5MjZPS0xNTWJvNG9JVUpRQUFJZmtFQlFBQUJnQXNKd0FtQUFFQmZBQUFBLzlvdXR6K01NcEpxNzA0NjgyN0dvSW5qbVJwbm1qS0NVVkJDSUVxejNSdDMxV3J2ekh1LzhDZ2tESFFHWG5EcEhMSnZBU01VQmVzU2ExYWdZUm85SFh0ZXI4aWxsYkxCWnZQYUVaMlBBYWwzM0Jxa1UwZjlPTDR2TzFKN3lQMWdJRWxhMzErSVlLSWlSZGloWTEyaXBDUkRZU05oV1dTbUlKemxaVUVtWjk2Zkp5Vmg2Q21hWlNqZEo2bnJXYWlxbjEzcnJSV3FiRmFBN1c3Vll5NGJMekJTN0MvV3FYQ3lEK2J4VnZKemo3RXpFYXp6OVVxdDlJdTF0c3F2dGs2MU56aUhkSGZ1dVBvSHN2ZkxlbnVHK1haeCsvMEU5alNyUFg2RWQ3czRmc0FEYkNEY2k2Z1FRUHIvQjAwR0U5YXdZWDc3akhMQjFGZnYyL3pLcjRiZUVULzQ3NkUzLzU1Rk5lUTJjT1I2U1F5RTRuUzJrVjVMZCtwL0VVeHBqaVEyVmphVEZheVdNMmQxbWIrMGdrMDJFdUhSY1VKeFpXVUcwNXBHWnNLNjBsVGFsQ080S3crbzRycnAxWmVTMk1SL1dycXFVbXl5TGpHOG9yV1ZWaFZVZHVlVXF1S3JWeFRiMGVOdlJ2cDZGbSt0T2lxMmdzNGtkbGljUXRMRXN6SnJ1SkllVGtsZnF6SXIwL0twaGh6SW93NXorRmZKenREMGx5SmN3a0FBRVRYaUV3S0NJQUFzRlhMc0Z3VkNPemJxV1dmd0pyMXgrdmJ1SFdUb04zVk5mRGpBWElMN3lDQXRTemJ5SkV2RHpNd2RJM2YwWThybjc3aGN5UGoyYk52NTQ0aGdITWRrMVZnRHgrZC9Bcm5qdFd6bnovZXZRWHZVRXlUbU04L3VmME0vd0hncDQxdi9mVlgzMzhTbU5lSWZpTVU2Q0NDR0ZobUhRM3JPVWdmaEJmZ0ZKOEtGblo0SUlZT0tBaEZlaWxVMktHQklGSWc0b0ErbUhoaWdTbFNJQWFESXJqNElvb3hTa0FpQ2piZVdPQ0hPUWJSbzQ4L0JxbkVrRVFXYWFRUVNDYXA1Skk0Tk9ta2cwQkNlWUtVVXo1b0pZVlpkdW5mbGpOZzZTVi9WWUpaNDVoVGxta21CMktpeWQ2YThybEpwSnB3YXRDbW5NalJXV2Q1ZVBxbzU1NFYzTmtuY0lDYUlPaWdYeGJhSUtJbi9xbG9CSWNpK3VnSWtmYnA2S1FQTU9vaHBoNVVpdWFsbkQ3Z2FaZWhscUJwZUtDV0NzR29SS3A2NWFuQnVYb0NyRFRLT2dHck1Ob2FKNTZwNm1vQnJ0bjV5dVdud2w0M1pyRTNBTnNyc2l3WjRNcHNpNjArUzJDajBnWnhZclZNVW9udEVGSnVxOFNGM2liUlk3aE1tRWd1RmNBdGV5NlBzVEdiQUFBN1wiIGFsdD1cIkxvYWRpbmcuLi5cIiAvPlxuLy8gICA8L2Rpdj5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXR0LXJ0dGFtYXBsaWInLFxuICB0ZW1wbGF0ZTogYCAgXG4gIDxkaXYgaWQ9J215TWFwJyBzdHlsZT1cInBhZGRpbmc6IDBweCAwcHggMHB4IDEwcHg7XCIgI21hcEVsZW1lbnQ+XG4gIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFJ0dGFtYXBsaWJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbm5lY3Rpb247XG4gIG1hcDogYW55O1xuICBjb250ZXh0TWVudTogYW55O1xuICB0ZWNobmljaWFuUGhvbmU6IHN0cmluZztcbiAgdGVjaG5pY2lhbkVtYWlsOiBzdHJpbmc7XG4gIHRlY2huaWNpYW5OYW1lOiBzdHJpbmc7XG4gIHRyYXZhbER1cmF0aW9uO1xuICB0cnVja0l0ZW1zID0gW107XG5cbiAgZGlyZWN0aW9uc01hbmFnZXI7XG4gIHRyYWZmaWNNYW5hZ2VyOiBhbnk7XG5cbiAgdHJ1Y2tMaXN0ID0gW107XG4gIHRydWNrV2F0Y2hMaXN0OiBUcnVja0RldGFpbHNbXTtcbiAgYnVzeTogYW55O1xuICBtYXB2aWV3ID0gJ3JvYWQnO1xuICBsb2FkaW5nID0gZmFsc2U7XG4gIEBWaWV3Q2hpbGQoJ21hcEVsZW1lbnQnKSBzb21lSW5wdXQ6IEVsZW1lbnRSZWY7XG4gIG15TWFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215TWFwJyk7XG4gIHJlYWR5ID0gZmFsc2U7XG4gIGFuaW1hdGVkTGF5ZXI7XG4gIEBWaWV3Q2hpbGQoJ3Ntc3BvcHVwJykgc21zcG9wdXA6IFBvcHVwO1xuICBAVmlld0NoaWxkKCdlbWFpbHBvcHVwJykgZW1haWxwb3B1cDogUG9wdXA7XG4gIEBWaWV3Q2hpbGQoJ2luZm8nKSBpbmZvVGVtcGxhdGU6IEVsZW1lbnRSZWY7XG4gIHNvY2tldDogYW55ID0gbnVsbDtcbiAgc29ja2V0VVJMOiBzdHJpbmc7XG4gIHJlc3VsdHMgPSBbXG4gIF07XG4gIHB1YmxpYyB1c2VyUm9sZTogYW55O1xuICBsYXN0Wm9vbUxldmVsID0gMTA7XG4gIGxhc3RMb2NhdGlvbjogYW55O1xuICByZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscyA9IFtdO1xuICByZXBvcnRpbmdUZWNobmljaWFucyA9IFtdO1xuICBpc1RyYWZmaWNFbmFibGVkID0gMDtcbiAgbG9nZ2VkVXNlcklkID0gJyc7XG4gIG1hbmFnZXJVc2VySWQgPSAnJztcbiAgY29va2llQVRUVUlEID0gJyc7XG4gIGZlZXQ6IG51bWJlciA9IDAuMDAwMTg5Mzk0O1xuICBJc0FyZWFNYW5hZ2VyID0gZmFsc2U7XG4gIElzVlAgPSBmYWxzZTtcbiAgZmllbGRNYW5hZ2VycyA9IFtdO1xuICAvLyBXZWF0aGVyIHRpbGUgdXJsIGZyb20gSW93YSBFbnZpcm9ubWVudGFsIE1lc29uZXQgKElFTSk6IGh0dHA6Ly9tZXNvbmV0LmFncm9uLmlhc3RhdGUuZWR1L29nYy9cbiAgdXJsVGVtcGxhdGUgPSAnaHR0cDovL21lc29uZXQuYWdyb24uaWFzdGF0ZS5lZHUvY2FjaGUvdGlsZS5weS8xLjAuMC9uZXhyYWQtbjBxLXt0aW1lc3RhbXB9L3t6b29tfS97eH0ve3l9LnBuZyc7XG5cbiAgLy8gVGhlIHRpbWUgc3RhbXBzIHZhbHVlcyBmb3IgdGhlIElFTSBzZXJ2aWNlIGZvciB0aGUgbGFzdCA1MCBtaW51dGVzIGJyb2tlbiB1cCBpbnRvIDUgbWludXRlIGluY3JlbWVudHMuXG4gIHRpbWVzdGFtcHMgPSBbJzkwMDkxMy1tNTBtJywgJzkwMDkxMy1tNDVtJywgJzkwMDkxMy1tNDBtJywgJzkwMDkxMy1tMzVtJywgJzkwMDkxMy1tMzBtJywgJzkwMDkxMy1tMjVtJywgJzkwMDkxMy1tMjBtJywgJzkwMDkxMy1tMTVtJywgJzkwMDkxMy1tMTBtJywgJzkwMDkxMy1tMDVtJywgJzkwMDkxMyddO1xuXG4gIHRlY2hUeXBlOiBhbnk7XG5cbiAgdGhyZXNob2xkVmFsdWUgPSAwO1xuXG4gIGFuaW1hdGlvblRydWNrTGlzdCA9IFtdO1xuXG4gIGRyb3Bkb3duU2V0dGluZ3MgPSB7fTtcbiAgc2VsZWN0ZWRGaWVsZE1nciA9IFtdO1xuICBtYW5hZ2VySWRzID0gJyc7XG5cbiAgcmFkaW91c1ZhbHVlID0gJyc7XG5cbiAgZm91bmRUcnVjayA9IGZhbHNlO1xuXG4gIGxvZ2dlZEluVXNlclRpbWVab25lID0gJ0NTVCc7XG4gIGNsaWNrZWRMYXQ7IGFueTtcbiAgY2xpY2tlZExvbmc6IGFueTtcbiAgZGF0YUxheWVyOiBhbnk7XG4gIHBhdGhMYXllcjogYW55O1xuICBpbmZvQm94TGF5ZXI6IGFueTtcbiAgaW5mb2JveDogYW55O1xuICBpc01hcExvYWRlZCA9IHRydWU7XG4gIFdvcmtGbG93QWRtaW4gPSBmYWxzZTtcbiAgU3lzdGVtQWRtaW4gPSBmYWxzZTtcbiAgUnVsZUFkbWluID0gZmFsc2U7XG4gIFJlZ3VsYXJVc2VyID0gZmFsc2U7XG4gIFJlcG9ydGluZyA9IGZhbHNlO1xuICBOb3RpZmljYXRpb25BZG1pbiA9IGZhbHNlO1xuICBASW5wdXQoKSB0aWNrZXRMaXN0OiBhbnkgPSBbXTtcbiAgQElucHV0KCkgbG9nZ2VkSW5Vc2VyOiBzdHJpbmc7XG4gIEBPdXRwdXQoKSB0aWNrZXRDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICB0aWNrZXREYXRhOiBUaWNrZXRbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbWFwU2VydmljZTogUnR0YW1hcGxpYlNlcnZpY2UsXG4gICAgLy9wcml2YXRlIHJvdXRlcjogUm91dGVyLCBcbiAgICAvL3B1YmxpYyB0b2FzdHI6IFRvYXN0c01hbmFnZXIsIFxuICAgIHZSZWY6IFZpZXdDb250YWluZXJSZWZcbiAgICApIHtcbiAgICAvL3RoaXMudG9hc3RyLnNldFJvb3RWaWV3Q29udGFpbmVyUmVmKHZSZWYpO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5jb29raWVBVFRVSUQgPSBcImtyNTIyNlwiOy8vdGhpcy51dGlscy5nZXRDb29raWVVc2VySWQoKTtcbiAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zID0gW107XG4gICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFucy5wdXNoKHRoaXMuY29va2llQVRUVUlEKTtcbiAgICB0aGlzLnRyYXZhbER1cmF0aW9uID0gNTAwMDtcbiAgICAvLyAvLyB0byBsb2FkIGFscmVhZHkgYWRkcmVkIHdhdGNoIGxpc3RcbiAgICBpZiAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSAhPSBudWxsKSB7XG4gICAgICB0aGlzLnRydWNrTGlzdCA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICB0aGlzLmxvZ2dlZFVzZXJJZCA9IHRoaXMubWFuYWdlclVzZXJJZCA9IFwia3I1MjI2XCI7Ly90aGlzLnV0aWxzLmdldENvb2tpZVVzZXJJZCgpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIC8vdGhpcy5jaGVja1VzZXJMZXZlbChmYWxzZSk7XG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gJ2NvbXBsZXRlJykgIHtcbiAgICAgIGRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICB0aGlzLm1hcHZpZXcgPSAncm9hZCc7XG4gICAgICAgICAgdGhpcy5sb2FkTWFwVmlldygncm9hZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubmdPbkluaXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICB0aGlzLm1hcHZpZXcgPSAncm9hZCc7XG4gICAgICAgIHRoaXMubG9hZE1hcFZpZXcoJ3JvYWQnKTtcbiAgICAgIH1cbiAgICB9ICAgXG4gIH1cblxuICBjaGVja1VzZXJMZXZlbChJc1Nob3dUcnVjaykge1xuICAgIHRoaXMuZmllbGRNYW5hZ2VycyA9IFtdO1xuICAgIC8vIEFzc2lnbiBsb2dnZWQgaW4gdXNlclxuICAgIHZhciBtZ3IgPSB7IGlkOiB0aGlzLm1hbmFnZXJVc2VySWQsIGl0ZW1OYW1lOiB0aGlzLm1hbmFnZXJVc2VySWQgfTtcbiAgICB0aGlzLmZpZWxkTWFuYWdlcnMucHVzaChtZ3IpO1xuXG4gICAgLy8gQ29tbWVudCBiZWxvdyBsaW5lIHdoZW4geW91IGdpdmUgZm9yIHByb2R1Y3Rpb24gYnVpbGQgOTAwOFxuICAgIHRoaXMuSXNWUCA9IHRydWU7XG5cbiAgICAvLyBDaGVjayBpcyBsb2dnZWQgaW4gdXNlciBpcyBhIGZpZWxkIG1hbmFnZXIgYXJlYSBtYW5hZ2VyL3ZwXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckluZm8odGhpcy5tYW5hZ2VyVXNlcklkKS50aGVuKChkYXRhOiBhbnkpID0+IHtcbiAgICAgIGlmICghalF1ZXJ5LmlzRW1wdHlPYmplY3QoZGF0YSkpIHtcbiAgICAgICAgbGV0IG1hbmFnZXJzID0gJ2YnO1xuICAgICAgICBsZXQgYW1hbmFnZXJzID0gJ2UnO1xuICAgICAgICBsZXQgdnAgPSAnYSxiLGMsZCc7XG5cbiAgICAgICAgaWYgKGRhdGEubGV2ZWwuaW5kZXhPZihtYW5hZ2VycykgPiAtMSkge1xuICAgICAgICAgIC8vIHRoaXMuSXNWUCA9IElzU2hvd1RydWNrO1xuICAgICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMubWFuYWdlcklkcyA9IHRoaXMuZmllbGRNYW5hZ2Vycy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtWydpZCddO1xuICAgICAgICAgIH0pLnRvU3RyaW5nKCk7XG4gICAgICAgICAgLy8gdGhpcy5nZXRUZWNoRGV0YWlsc0Zvck1hbmFnZXJzKCk7XG4gICAgICAgICAgLy8gdGhpcy5Mb2FkVHJ1Y2tzKHRoaXMubWFwLCBudWxsLCBudWxsLCBudWxsLCBmYWxzZSk7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IC8vJCgnI2xvYWRpbmcnKS5oaWRlKCkgXG4gICAgICAgIH0sIDMwMDApO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEubGV2ZWwuaW5kZXhPZihhbWFuYWdlcnMpID4gLTEpIHtcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMgPSBbXTtcbiAgICAgICAgICB2YXIgYXJlYU1nciA9IHtcbiAgICAgICAgICAgIGlkOiB0aGlzLm1hbmFnZXJVc2VySWQsXG4gICAgICAgICAgICBpdGVtTmFtZTogZGF0YS5uYW1lICsgJyAoJyArIHRoaXMubWFuYWdlclVzZXJJZCArICcpJ1xuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5maWVsZE1hbmFnZXJzLnVuc2hpZnQoYXJlYU1ncik7XG4gICAgICAgICAgdGhpcy5nZXRMaXN0b2ZGaWVsZE1hbmFnZXJzKCk7XG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxldmVsLmluZGV4T2YodnApID4gLTEpIHtcbiAgICAgICAgICB0aGlzLklzVlAgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy90aGlzLnRvYXN0ci53YXJuaW5nKCdOb3QgdmFsaWQgRmllbGQvQXJlYSBNYW5hZ2VyIScsICdNYW5hZ2VyJywgeyBzaG93Q2xvc2VCdXR0b246IHRydWUgfSlcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL3RoaXMudG9hc3RyLndhcm5pbmcoJ1BsZWFzZSBlbnRlciB2YWxpZCBGaWVsZC9BcmVhIE1hbmFnZXIgYXR0dWlkIScsICdNYW5hZ2VyJywgeyBzaG93Q2xvc2VCdXR0b246IHRydWUgfSlcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBjb25uZWN0aW5nIHdlYiBwaG9uZSEnLCAnRXJyb3InKVxuICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldExpc3RvZkZpZWxkTWFuYWdlcnMoKSB7XG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckRhdGEodGhpcy5tYW5hZ2VyVXNlcklkKS50aGVuKChkYXRhOiBhbnkpID0+IHtcbiAgICAgIGlmIChkYXRhLlRlY2huaWNpYW5EZXRhaWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yICh2YXIgdGVjaCBpbiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzKSB7XG4gICAgICAgICAgdmFyIG1nciA9IHtcbiAgICAgICAgICAgIGlkOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmF0dHVpZCxcbiAgICAgICAgICAgIGl0ZW1OYW1lOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLm5hbWUgKyAnICgnICsgZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQgKyAnKSdcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMuZmllbGRNYW5hZ2Vycy5wdXNoKG1ncik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLklzVlAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5Jc0FyZWFNYW5hZ2VyID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuSXNWUCA9IHRydWU7XG4gICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xuICAgICAgICAvL3RoaXMudG9hc3RyLndhcm5pbmcoJ0RvIG5vdCBoYXZlIGFueSBkaXJlY3QgcmVwb3J0cyEnLCAnTWFuYWdlcicpO1xuICAgICAgfVxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGNvbm5lY3Rpbmcgd2ViIHBob25lIScsICdFcnJvcicpO1xuICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFRlY2hEZXRhaWxzRm9yTWFuYWdlcnMoKSB7XG4gICAgaWYgKHRoaXMubWFuYWdlcklkcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0V2ViUGhvbmVVc2VyRGF0YSh0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICBpZiAoZGF0YS5UZWNobmljaWFuRGV0YWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yICh2YXIgdGVjaCBpbiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzKSB7XG4gICAgICAgICAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnB1c2goZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQpO1xuXG4gICAgICAgICAgICB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLnB1c2goe1xuICAgICAgICAgICAgICBhdHR1aWQ6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkLFxuICAgICAgICAgICAgICBuYW1lOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLm5hbWUsXG4gICAgICAgICAgICAgIGVtYWlsOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmVtYWlsLFxuICAgICAgICAgICAgICBwaG9uZTogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5waG9uZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgICBcbiAgbG9hZE1hcFZpZXcodHlwZTogU3RyaW5nKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMudHJ1Y2tJdGVtcyA9IFtdO1xuICAgIHZhciBsb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbig0MC4wNTgzLCAtNzQuNDA1Nyk7XG5cbiAgICBpZiAodGhpcy5sYXN0TG9jYXRpb24pIHtcbiAgICAgIGxvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRoaXMubGFzdExvY2F0aW9uLmxhdGl0dWRlLCB0aGlzLmxhc3RMb2NhdGlvbi5sb25naXR1ZGUpO1xuICAgIH1cbiAgICB0aGlzLm1hcCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215TWFwJyksIHtcbiAgICAgIGNyZWRlbnRpYWxzOiAnQW54cFMtMzJrWXZCempRNXBiWmNuRHoxN29LQmExQnEySFJ3SEFOb05wSHMzWjI1TkR2cWJoY3FKWnlEb1lNaicsXG4gICAgICBjZW50ZXI6IGxvY2F0aW9uLFxuICAgICAgbWFwVHlwZUlkOiB0eXBlID09ICdzYXRlbGxpdGUnID8gTWljcm9zb2Z0Lk1hcHMuTWFwVHlwZUlkLmFlcmlhbCA6IE1pY3Jvc29mdC5NYXBzLk1hcFR5cGVJZC5yb2FkLFxuICAgICAgem9vbTogMTIsXG4gICAgICBsaXRlTW9kZTogdHJ1ZSxcbiAgICAgIC8vbmF2aWdhdGlvbkJhck9yaWVudGF0aW9uOiBNaWNyb3NvZnQuTWFwcy5OYXZpZ2F0aW9uQmFyT3JpZW50YXRpb24uaG9yaXpvbnRhbCxcbiAgICAgIGVuYWJsZUNsaWNrYWJsZUxvZ286IGZhbHNlLFxuICAgICAgc2hvd0xvZ286IGZhbHNlLFxuICAgICAgc2hvd1Rlcm1zTGluazogZmFsc2UsXG4gICAgICBzaG93TWFwVHlwZVNlbGVjdG9yOiBmYWxzZSxcbiAgICAgIHNob3dUcmFmZmljQnV0dG9uOiB0cnVlLFxuICAgICAgZW5hYmxlU2VhcmNoTG9nbzogZmFsc2UsXG4gICAgICBzaG93Q29weXJpZ2h0OiBmYWxzZVxuICAgIH0pO1xuICAgIFxuICAgIC8vTG9hZCB0aGUgQW5pbWF0aW9uIE1vZHVsZVxuICAgIC8vTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZShcIkFuaW1hdGlvbk1vZHVsZVwiKTtcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdBbmltYXRpb25Nb2R1bGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgfSk7XG5cbiAgICAvL1N0b3JlIHNvbWUgbWV0YWRhdGEgd2l0aCB0aGUgcHVzaHBpblxuICAgIHRoaXMuaW5mb2JveCA9IG5ldyBNaWNyb3NvZnQuTWFwcy5JbmZvYm94KHRoaXMubWFwLmdldENlbnRlcigpLCB7XG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHRoaXMuaW5mb2JveC5zZXRNYXAodGhpcy5tYXApO1xuXG4gICAgLy8gQ3JlYXRlIGEgbGF5ZXIgZm9yIHJlbmRlcmluZyB0aGUgcGF0aC5cbiAgICB0aGlzLnBhdGhMYXllciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5MYXllcigpO1xuICAgIHRoaXMubWFwLmxheWVycy5pbnNlcnQodGhpcy5wYXRoTGF5ZXIpO1xuXG4gICAgLy8gTG9hZCB0aGUgU3BhdGlhbCBNYXRoIG1vZHVsZS5cbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aCcsIGZ1bmN0aW9uICgpIHsgfSk7XG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucycsIGZ1bmN0aW9uICgpIHsgfSk7XG5cbiAgICAvLyBDcmVhdGUgYSBsYXllciB0byBsb2FkIHB1c2hwaW5zIHRvLlxuICAgIHRoaXMuZGF0YUxheWVyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkVudGl0eUNvbGxlY3Rpb24oKTtcblxuICAgIC8vIEFkZCBhIHJpZ2h0IGNsaWNrIGV2ZW50IHRvIHRoZSBtYXBcbiAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLm1hcCwgJ3JpZ2h0Y2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgY29uc3QgeDEgPSBlLmxvY2F0aW9uO1xuICAgICAgdGhhdC5jbGlja2VkTGF0ID0geDEubGF0aXR1ZGU7XG4gICAgICB0aGF0LmNsaWNrZWRMb25nID0geDEubG9uZ2l0dWRlO1xuICAgICAgdGhhdC5yYWRpb3VzVmFsdWUgPSAnJztcbiAgICAgIGpRdWVyeSgnI215UmFkaXVzTW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgIH0pO1xuXG4gICAgLy9sb2FkIHRpY2tldCBkZXRhaWxzXG4gICAgdGhpcy5hZGRUaWNrZXREYXRhKHRoaXMubWFwLCB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyKTtcbiAgICBcbiAgfVxuXG4gIExvYWRUcnVja3MobWFwcywgbHQsIGxnLCByZCwgaXNUcnVja1NlYXJjaCkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHRoaXMudHJ1Y2tJdGVtcyA9IFtdO1xuXG4gICAgaWYgKCFpc1RydWNrU2VhcmNoKSB7XG5cbiAgICAgIHRoaXMubWFwU2VydmljZS5nZXRNYXBQdXNoUGluRGF0YSh0aGlzLm1hbmFnZXJJZHMpLnRoZW4oKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICBpZiAoIWpRdWVyeS5pc0VtcHR5T2JqZWN0KGRhdGEpICYmIGRhdGEudGVjaERhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhciB0ZWNoRGF0YSA9IGRhdGEudGVjaERhdGE7XG4gICAgICAgICAgdmFyIGRpckRldGFpbHMgPSBbXTtcbiAgICAgICAgICB0ZWNoRGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5sb25nID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBpdGVtLmxvbmcgPSBpdGVtLmxvbmdnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0udGVjaElEICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB2YXIgZGlyRGV0YWlsOiBUcnVja0RpcmVjdGlvbkRldGFpbHMgPSBuZXcgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzKCk7XG4gICAgICAgICAgICAgIGRpckRldGFpbC50ZWNoSWQgPSBpdGVtLnRlY2hJRDtcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxhdCA9IGl0ZW0ubGF0O1xuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTG9uZyA9IGl0ZW0ubG9uZztcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMYXQgPSBpdGVtLndyTGF0O1xuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExvbmcgPSBpdGVtLndyTG9uZztcbiAgICAgICAgICAgICAgZGlyRGV0YWlscy5wdXNoKGRpckRldGFpbCk7XG4gICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmFyIHJvdXRlTWFwVXJscyA9IFtdO1xuICAgICAgICAgIHJvdXRlTWFwVXJscyA9IHRoaXMubWFwU2VydmljZS5HZXRSb3V0ZU1hcERhdGEoZGlyRGV0YWlscyk7XG5cbiAgICAgICAgICBmb3JrSm9pbihyb3V0ZU1hcFVybHMpLnN1YnNjcmliZShyZXN1bHRzID0+IHtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPD0gcmVzdWx0cy5sZW5ndGggLSAxOyBqKyspIHtcbiAgICAgICAgICAgICAgbGV0IHJvdXRlRGF0YSA9IHJlc3VsdHNbal0gYXMgYW55O1xuICAgICAgICAgICAgICBsZXQgcm91dGVkYXRhSnNvbiA9IHJvdXRlRGF0YS5qc29uKCk7XG4gICAgICAgICAgICAgIGlmIChyb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zICE9IG51bGxcbiAgICAgICAgICAgICAgICAmJiByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxhdCA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1swXVxuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTG9uZyA9IHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXNbMV0ubWFuZXV2ZXJQb2ludC5jb29yZGluYXRlc1sxXVxuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTGF0ID0gbmV4dFNvdXJjZUxhdDtcbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxvbmcgPSBuZXh0U291cmNlTG9uZztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbGlzdE9mUGlucyA9IG1hcHMuZW50aXRpZXM7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mUGlucy5nZXRMZW5ndGgoKTsgaSsrKSB7XG4gICAgICAgICAgICAgIHZhciB0ZWNoSWQgPSBsaXN0T2ZQaW5zLmdldChpKS5tZXRhZGF0YS5BVFRVSUQ7XG4gICAgICAgICAgICAgIHZhciB0cnVja0NvbG9yID0gbGlzdE9mUGlucy5nZXQoaSkubWV0YWRhdGEudHJ1Y2tDb2wudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgdmFyIGN1clB1c2hQaW4gPSBsaXN0T2ZQaW5zLmdldChpKTtcbiAgICAgICAgICAgICAgdmFyIGN1cnJEaXJEZXRhaWwgPSBbXTtcblxuICAgICAgICAgICAgICBjdXJyRGlyRGV0YWlsID0gZGlyRGV0YWlscy5maWx0ZXIoZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQudGVjaElkID09PSB0ZWNoSWQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgdmFyIG5leHRMb2NhdGlvbjtcblxuICAgICAgICAgICAgICBpZiAoY3VyckRpckRldGFpbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbmV4dExvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTGF0LCBjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxvbmcpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKG5leHRMb2NhdGlvbiAhPSBudWxsICYmIG5leHRMb2NhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGluTG9jYXRpb24gPSBsaXN0T2ZQaW5zLmdldChpKS5nZXRMb2NhdGlvbigpO1xuICAgICAgICAgICAgICAgIHZhciBuZXh0Q29vcmQgPSB0aGF0LkNhbGN1bGF0ZU5leHRDb29yZChwaW5Mb2NhdGlvbiwgbmV4dExvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhwaW5Mb2NhdGlvbiwgbmV4dENvb3JkKTtcbiAgICAgICAgICAgICAgICB2YXIgdHJ1Y2tVcmwgPSB0aGlzLmdldFRydWNrVXJsKHRydWNrQ29sb3IpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihjdXJQdXNoUGluLCB0cnVja1VybCwgYmVhcmluZywgZnVuY3Rpb24gKCkgeyB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMubWFwU2VydmljZS5nZXRUcnVja0ZlZWQodGhpcy5yZXBvcnRpbmdUZWNobmljaWFucywgdGhpcy5tYW5hZ2VySWRzKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLnNvbWUoeCA9PiB4LnRvTG93ZXJDYXNlKCkgPT0gZGF0YS50ZWNoSUQudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBkYXRhKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHdoaWxlIGZldGNoaW5nIHRydWNrcyBmcm9tIEthZmthIENvbnN1bWVyLiBFcnJvcnMtPiAnICsgZXJyLkVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignTm8gdHJ1Y2sgZm91bmQhJywgJ01hbmFnZXInKTtcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgZmV0Y2hpbmcgZGF0YSBmcm9tIEFQSSEnLCAnRXJyb3InKTtcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG5cbiAgICAgIGNvbnN0IG10cnMgPSBNYXRoLnJvdW5kKHRoYXQuZ2V0TWV0ZXJzKHJkKSk7XG4gICAgICB0aGlzLm1hcFNlcnZpY2UuZmluZFRydWNrTmVhckJ5KGx0LCBsZywgbXRycywgdGhpcy5tYW5hZ2VySWRzKS50aGVuKChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSAmJiBkYXRhLnRlY2hEYXRhLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgIGNvbnN0IHRlY2hEYXRhID0gZGF0YS50ZWNoRGF0YTtcbiAgICAgICAgICBsZXQgZGlyRGV0YWlscyA9IFtdO1xuICAgICAgICAgIHRlY2hEYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmxvbmcgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGl0ZW0ubG9uZyA9IGl0ZW0ubG9uZ2c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKGl0ZW0udGVjaElEICE9IHVuZGVmaW5lZCkgJiYgKGRpckRldGFpbHMuc29tZSh4ID0+IHgudGVjaElkID09IGl0ZW0udGVjaElEKSA9PSBmYWxzZSkpIHtcbiAgICAgICAgICAgICAgdmFyIGRpckRldGFpbDogVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzID0gbmV3IFRydWNrRGlyZWN0aW9uRGV0YWlscygpO1xuICAgICAgICAgICAgICBkaXJEZXRhaWwudGVjaElkID0gaXRlbS50ZWNoSUQ7XG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMYXQgPSBpdGVtLmxhdDtcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxvbmcgPSBpdGVtLmxvbmc7XG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TGF0ID0gaXRlbS53ckxhdDtcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMb25nID0gaXRlbS53ckxvbmc7XG4gICAgICAgICAgICAgIGRpckRldGFpbHMucHVzaChkaXJEZXRhaWwpO1xuICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBpdGVtKTtcbiAgICAgICAgICAgICAgdGhhdC5mb3VuZFRydWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciByb3V0ZU1hcFVybHMgPSBbXTtcbiAgICAgICAgICByb3V0ZU1hcFVybHMgPSB0aGlzLm1hcFNlcnZpY2UuR2V0Um91dGVNYXBEYXRhKGRpckRldGFpbHMpO1xuXG4gICAgICAgICAgZm9ya0pvaW4ocm91dGVNYXBVcmxzKS5zdWJzY3JpYmUocmVzdWx0cyA9PiB7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IHJlc3VsdHMubGVuZ3RoIC0gMTsgaisrKSB7XG4gICAgICAgICAgICAgIGxldCByb3V0ZURhdGEgPSByZXN1bHRzW2pdIGFzIGFueTtcbiAgICAgICAgICAgICAgbGV0IHJvdXRlZGF0YUpzb24gPSByb3V0ZURhdGEuanNvbigpO1xuICAgICAgICAgICAgICBpZiAocm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcyAhPSBudWxsXG4gICAgICAgICAgICAgICAgJiYgcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMYXQgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMF1cbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxvbmcgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMV1cbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxhdCA9IG5leHRTb3VyY2VMYXQ7XG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMb25nID0gbmV4dFNvdXJjZUxvbmc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGxpc3RPZlBpbnMgPSB0aGF0Lm1hcC5lbnRpdGllcztcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0T2ZQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgcHVzaHBpbiA9IGxpc3RPZlBpbnMuZ2V0KGkpO1xuICAgICAgICAgICAgICBpZiAocHVzaHBpbiBpbnN0YW5jZW9mIE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4pIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRlY2hJZCA9IHB1c2hwaW4ubWV0YWRhdGEuQVRUVUlEO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRydWNrQ29sb3IgPSBwdXNocGluLm1ldGFkYXRhLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJEaXJEZXRhaWwgPSBbXTtcblxuICAgICAgICAgICAgICAgIGN1cnJEaXJEZXRhaWwgPSBkaXJEZXRhaWxzLmZpbHRlcihlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRlY2hJZCA9PT0gdGVjaElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIG5leHRMb2NhdGlvbjtcblxuICAgICAgICAgICAgICAgIGlmIChjdXJyRGlyRGV0YWlsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgIG5leHRMb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxhdCwgY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMb25nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobmV4dExvY2F0aW9uICE9IG51bGwgJiYgbmV4dExvY2F0aW9uICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgdmFyIHBpbkxvY2F0aW9uID0gbGlzdE9mUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgIHZhciBuZXh0Q29vcmQgPSB0aGF0LkNhbGN1bGF0ZU5leHRDb29yZChwaW5Mb2NhdGlvbiwgbmV4dExvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICAgIHZhciBiZWFyaW5nID0gdGhhdC5jYWxjdWxhdGVCZWFyaW5nKHBpbkxvY2F0aW9uLCBuZXh0Q29vcmQpO1xuICAgICAgICAgICAgICAgICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwdXNocGluLCB0cnVja1VybCwgYmVhcmluZywgZnVuY3Rpb24gKCkgeyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTG9hZCB0aGUgc3BhdGlhbCBtYXRoIG1vZHVsZVxuICAgICAgICAgICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGgnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIFJlcXVlc3QgdGhlIHVzZXIncyBsb2NhdGlvblxuXG4gICAgICAgICAgICAgIGNvbnN0IGxvYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0aGF0LmNsaWNrZWRMYXQsIHRoYXQuY2xpY2tlZExvbmcpO1xuICAgICAgICAgICAgICAvLyBDcmVhdGUgYW4gYWNjdXJhY3kgY2lyY2xlXG4gICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBNaWNyb3NvZnQuTWFwcy5TcGF0aWFsTWF0aC5nZXRSZWd1bGFyUG9seWdvbihsb2MsXG4gICAgICAgICAgICAgICAgcmQsXG4gICAgICAgICAgICAgICAgMzYsXG4gICAgICAgICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGguRGlzdGFuY2VVbml0cy5NaWxlcyk7XG5cbiAgICAgICAgICAgICAgY29uc3QgcG9seSA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2x5Z29uKHBhdGgpO1xuICAgICAgICAgICAgICB0aGF0Lm1hcC5lbnRpdGllcy5wdXNoKHBvbHkpO1xuICAgICAgICAgICAgICAvLyBBZGQgYSBwdXNocGluIGF0IHRoZSB1c2VyJ3MgbG9jYXRpb24uXG4gICAgICAgICAgICAgIGNvbnN0IHBpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKGxvYyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBpY29uOiAnaHR0cHM6Ly9iaW5nbWFwc2lzZGsuYmxvYi5jb3JlLndpbmRvd3MubmV0L2lzZGtzYW1wbGVzL2RlZmF1bHRQdXNocGluLnBuZycsXG4gICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgxMiwgMzkpLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6IHJkICsgJyBtaWxlKHMpIG9mIHJhZGl1cycsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgdmFyIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgICAgIExhdGl0dWRlOiBsdCxcbiAgICAgICAgICAgICAgICBMb25naXR1ZGU6IGxnLFxuICAgICAgICAgICAgICAgIHJhZGl1czogcmRcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihwaW4sICdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhhdC5yYWRpb3VzVmFsdWUgPSByZDtcbiAgICAgICAgICAgICAgICB0aGF0LmNsaWNrZWRMYXQgPSBsdDtcbiAgICAgICAgICAgICAgICB0aGF0LmNsaWNrZWRMb25nID0gbGc7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcjbXlSYWRpdXNNb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIHBpbi5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICAgICAgICAgICAgICB0aGF0Lm1hcC5lbnRpdGllcy5wdXNoKHBpbik7XG4gICAgICAgICAgICAgIHRoYXQuZGF0YUxheWVyLnB1c2gocGluKTtcblxuICAgICAgICAgICAgICAvLyBDZW50ZXIgdGhlIG1hcCBvbiB0aGUgdXNlcidzIGxvY2F0aW9uLlxuICAgICAgICAgICAgICB0aGF0Lm1hcC5zZXRWaWV3KHsgY2VudGVyOiBsb2MsIHpvb206IDggfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBsZXQgZmVlZE1hbmFnZXIgPSBbXTtcblxuICAgICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IHRoaXMubWFwU2VydmljZS5nZXRUcnVja0ZlZWQodGhpcy5yZXBvcnRpbmdUZWNobmljaWFucywgdGhpcy5tYW5hZ2VySWRzKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChkaXJEZXRhaWxzLnNvbWUoeCA9PiB4LnRlY2hJZC50b0xvY2FsZUxvd2VyQ2FzZSgpID09IGRhdGEudGVjaElELnRvTG9jYWxlTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgZGF0YSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBmZXRjaGluZyB0cnVja3MgZnJvbSBLYWZrYSBDb25zdW1lci4gRXJyb3JzLT4gJyArIGVyci5FcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ05vIHRydWNrIGZvdW5kIScsICdNYW5hZ2VyJyk7XG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGZldGNoaW5nIGRhdGEgZnJvbSBBUEkhJywgJ0Vycm9yJyk7XG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIGdldFRydWNrVXJsKGNvbG9yKSB7XG4gICAgbGV0IHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFIa21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1JtTTJWaU1XUXROR0psWkMxak5qUTBMVGd6WW1VdFlqUTVZalpsTkRsbVltUm1JaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpHRXhOVEJsWVRFdE1qSmhZeTAzT1RRNUxUaGlObUV0WldVMU1UYzRaVEJtTVdGa0lpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09tWXdaV1F4WldNM0xUTTFPVEF0WkdFMFlpMDVNV0l3TFRZd09UUTJaakZoTldRNVl6d3ZjbVJtT214cFBpQThjbVJtT214cFBuaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMlBDOXlaR1k2YkdrK0lEd3ZjbVJtT2tKaFp6NGdQQzl3YUc5MGIzTm9iM0E2Ukc5amRXMWxiblJCYm1ObGMzUnZjbk0rSUR4NGJYQk5UVHBJYVhOMGIzSjVQaUE4Y21SbU9sTmxjVDRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUltTnlaV0YwWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEUwVkRFNU9qQTRPakF6TFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpOCtJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKellYWmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG8xWkRRMk1EYzFaaTA0TW1SbUxXWTNOREF0WW1VM1pTMW1OMkkwTXpsbVlqY3lNekVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UVlVNVGs2TWpNNk16RXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpSUhOMFJYWjBPbU5vWVc1blpXUTlJaThpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09tRmtaak5sWWpGa0xUUmlaV1F0WXpZME5DMDRNMkpsTFdJME9XSTJaVFE1Wm1Ka1ppSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4T1ZReE5UbzBPVG93TVMwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4TDNKa1pqcFRaWEUrSUR3dmVHMXdUVTA2U0dsemRHOXllVDRnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrSUR3dmNtUm1PbEpFUmo0Z1BDOTRPbmh0Y0cxbGRHRStJRHcvZUhCaFkydGxkQ0JsYm1ROUluSWlQejRkYjd2akFBQUNlMGxFUVZSSXg5MldUV3RUUVJTR256TnpiM0xUdEtHMVdsSHdxNHVDYllYK0ExMjVFTGN1dWloQ1JYQ3AySDNCaFN2L2dVdkJnbEp3NFVMQmlncFNhVUZjaUZMRmpTQXRzWDYxU2RNMHZYTmM5Tm9rUlpPWUFSWG5NcXU1ekRQbm5QZThNNEdxOHFkSHdGOFkveDcwNnJPSm5wVEl0YWRmN28rK0x5K1ZyWmhrUlpMNVl6akV4T24xRjVtcHNVUG5ia3lNVFQ1cUd6cFhtUmxaTHViSFA3S0U3VXBuMks2LzFERlZ3V1NobUZzZGYvaDJabnlDU1drL3ZmZTZlNzROdlNhekowZnNLdlZyZGZvVHpLYXdYaW95Ti8rODVGZlRKN3VuM0tjY3dka2lGQnNkWG9sVElIbUR6SGI1MWJUbmNBNFhPR0lSTkZTa1FYZFpvNmcxWkxvajZ3V05CbVEwN05WcDhpbnNoaUFOZ3RYVk1tRlh5SUdoL2FlOG9BK0MyL25BV0FwM2hPQkQ5TXUvTlFhNkhkbmpaWWJQOUo4R1p0cUdIaHpjMjFGSXJSSHMyeUFveHcxUEwxbEZnMDBHMGtjdUFwZmFoaTYvTE56cTdPdmw1UG1qbEl0cmFDSlpRUkN0NWxwRnlVUnA1bTh1TVAxNXFuVDV4SlgyMDF1dWJLU3picXM3SkhZMVlTblVRQkZGalFFTVg5ZFdQRzFRUWxVVVI0eXFyZnFCMXJlcEtEaGluQ2hJNkFmVlJLNlNmUFYyOEhPdnNCZy9xQk5GaEdTYnhsZWdrNlFNenZlV1VXb01RWnJ2Sm15THJXMm9RWkFZekcvYzg5NVFFV2twd0MweG1lVENjNTdwUlZ0bFl0UWdDdFlYS2lLMC9vUnlpRkhFZUFvcGRxN0c1TFZwTmF2VEoxTFZtcHBLTStIaVd0TjRZMmhhTElvbUtkWW1Ra3I2MmhlcUFzWUsxZ2hoRk80QVMxM2FBd3RpRFd4NlFvdTJaREtsSEl0dlZxbFUxbEhWcWlGcW5TTVFoU0d1Wk5DTzVsSnFDQjNjZFd4bDRkMnJ6dG5yaXhocmNBbDBaenBVaFZnZFVkVEpjUDlJd1F0Njk4TGp2di9taGY4ZHRHSGxoNHY1UjFJQUFBQUFTVVZPUks1Q1lJST0nO1xuXG4gICAgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ2dyZWVuJykge1xuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUhrbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5EazZNREV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUm1NMlZpTVdRdE5HSmxaQzFqTmpRMExUZ3pZbVV0WWpRNVlqWmxORGxtWW1SbUlpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdFeE5UQmxZVEV0TWpKaFl5MDNPVFE1TFRoaU5tRXRaV1UxTVRjNFpUQm1NV0ZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T21Zd1pXUXhaV00zTFRNMU9UQXRaR0UwWWkwNU1XSXdMVFl3T1RRMlpqRmhOV1E1WXp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkyUEM5eVpHWTZiR2srSUR3dmNtUm1Pa0poWno0Z1BDOXdhRzkwYjNOb2IzQTZSRzlqZFcxbGJuUkJibU5sYzNSdmNuTStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTBWREU1T2pBNE9qQXpMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzFaRFEyTURjMVppMDRNbVJtTFdZM05EQXRZbVUzWlMxbU4ySTBNemxtWWpjeU16RWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRWVU1UazZNak02TXpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21Ga1pqTmxZakZrTFRSaVpXUXRZelkwTkMwNE0ySmxMV0kwT1dJMlpUUTVabUprWmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhPVlF4TlRvME9Ub3dNUzB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NGRiN3ZqQUFBQ2UwbEVRVlJJeDkyV1RXdFRRUlNHbnpOemIzTFR0S0cxV2xId3E0dUNiWVgrQTEyNUVMY3V1aWhDUlhDcDJIM0JoU3YvZ1V2QmdsSnc0VUxCaWdwU2FVRmNpRkxGalNBdHNYNjFTZE0wdlhOYzlOb2tSWk9ZQVJYbk1xdTV6RFBublBlOE00R3E4cWRId0Y4WS94NzA2ck9KbnBUSXRhZGY3bysrTHkrVnJaaGtSWkw1WXpqRXhPbjFGNW1wc1VQbmJreU1UVDVxR3pwWG1SbFpMdWJIUDdLRTdVcG4ySzYvMURGVndXU2htRnNkZi9oMlpueUNTV2svdmZlNmU3NE52U2F6SjBmc0t2VnJkZm9Uekthd1hpb3lOLys4NUZmVEo3dW4zS2Njd2RraUZCc2RYb2xUSUhtRHpIYjUxYlRuY0E0WE9HSVJORlNrUVhkWm82ZzFaTG9qNndXTkJtUTA3TlZwOGluc2hpQU5ndFhWTW1GWHlJR2gvYWU4b0ErQzIvbkFXQXAzaE9CRDlNdS9OUWE2SGRualpZYlA5SjhHWnRxR0hoemMyMUZJclJIczJ5QW94dzFQTDFsRmcwMEcwa2N1QXBmYWhpNi9MTnpxN092bDVQbWpsSXRyYUNKWlFSQ3Q1bHBGeVVScDVtOHVNUDE1cW5UNXhKWDIwMXV1YktTemJxczdKSFkxWVNuVVFCRkZqUUVNWDlkV1BHMVFRbFVVUjR5cXJmcUIxcmVwS0RoaW5DaEk2QWZWUks2U2ZQVjI4SE92c0JnL3FCTkZoR1NieGxlZ2s2UU16dmVXVVdvTVFacnZKbXlMclcyb1FaQVl6Ry9jODk1UUVXa3B3QzB4bWVUQ2M1N3BSVnRsWXRRZ0N0WVhLaUswL29SeWlGSEVlQW9wZHE3RzVMVnBOYXZUSjFMVm1wcEtNK0hpV3RONFkyaGFMSW9tS2RZbVFrcjYyaGVxQXNZSzFnaGhGTzRBUzEzYUF3dGlEV3g2UW91MlpES2xISXR2VnFsVTFsSFZxaUZxblNNUWhTR3VaTkNPNWxKcUNCM2NkV3hsNGQycnp0bnJpeGhyY0FsMFp6cFVoVmdkVWRUSmNQOUl3UXQ2OThManZ2L21oZjhkdEdIbGg0djVSMUlBQUFBQVNVVk9SSzVDWUlJPSc7XG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICdyZWQnKSB7XG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSDNtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRJNk1qRXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRJNk1qRXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TURWak16YzFaRFl0TVdObE9DMWtaalJsTFRnd1lqZ3RNamxtWVRSaFpqQTJaREUzSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaR1JtTUdJelltRXRNV05pWkMxaE1qUTBMV0V5WldNdE1UZzRZVGxrT0dSbE1qazBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPakF3TURKbE5EaGxMVGhtT1dVdE5qVTBZeTA1WWpRMkxUVm1ZV1prTVRCaE4yRTJOend2Y21SbU9teHBQaUE4Y21SbU9teHBQbUZrYjJKbE9tUnZZMmxrT25Cb2IzUnZjMmh2Y0RwbU1HVmtNV1ZqTnkwek5Ua3dMV1JoTkdJdE9URmlNQzAyTURrME5tWXhZVFZrT1dNOEwzSmtaanBzYVQ0Z1BISmtaanBzYVQ1NGJYQXVaR2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmp3dmNtUm1PbXhwUGlBOEwzSmtaanBDWVdjK0lEd3ZjR2h2ZEc5emFHOXdPa1J2WTNWdFpXNTBRVzVqWlhOMGIzSnpQaUE4ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQSEprWmpwVFpYRStJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKamNtVmhkR1ZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pnNFpETTFObUUzTFRjeE9ERXRaVFUwWVMwNU9XWmxMVFE0TUdVek5XRmpOalptTmlJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZOV1EwTmpBM05XWXRPREprWmkxbU56UXdMV0psTjJVdFpqZGlORE01Wm1JM01qTXhJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMVZERTVPakl6T2pNeExUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvd05XTXpOelZrTmkweFkyVTRMV1JtTkdVdE9EQmlPQzB5T1daaE5HRm1NRFprTVRjaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCs3U2RBd0FBQUFzcEpSRUZVU01mbGw3dHJGRkVZeFgvZm5abGROd21KR2tLSUNENGlJV0tsSW9xclZqNDZRVkJzZllENEgyaGhiWkFVMm9pSW5WcUlXR2hsSTZnZ0JsRjhCTjhoS29oRW9oSTFiamI3dVBlejJOSGRUZHpaWlNkbzRRemZiZVlPNTU3dm5IdnVqS2dxZi9zeS9JUExqM3I0OU00OWhzZHVKVm9HTDY3b0hDZGhBK05temhHVWJDRW5EN2N1bjlqVHVmckQyTEpldStYd3dlWkJiNTQ4c1hqRFpPNzBzbHh5WGI3RHBVUW9hNkZsV09jOFdmOW9ZblNzOSswRitsYWVBNmFhQnYxMGUyak5GNXZkdWE1L0pkYk9JRmxoQlRXSzFmemE5dWZEaXdyYmRud0JMamF0NlJ2RDRJK1dkbkNHZ3RQcTBuTFpJa0NDSjByUGxZY1B6c2N5MHQxUEgvdSsrVWJyMmswc1NUeWVHY1BBMWN1NVdLQ1pydTR6ODdIVG9NeFRhbFpTQmFSSWQ2RGoyOUtianNaeTc3Nyt2bFAyNVl0RE53SWZEWUlxSWFYQ1NFWU1NTTJTbkxHNzNvMWZpd1c2dTZkNzcvd0g5NHZYWHc1N1daRUtJSkFLUDNuT3A4UGxTVTk4NzFwMTVtd2lGdWp6a2RIOS9SMmR5UzJaSDNnSm56K2xsd0FPaC9vcEpsdVV6eU92RG5SQlpJc2xLZ2FQdGJYbXQyY0x3ZExOYWV6Q0JlRGNyQzFUWW13aG1VSmVqM0RweVdPT3FFclRUQ1dUTGJaNnlhRE5HSnhVQ1ZuRlZNVmc4RkR4U0VBMlZuc3hCc1ZndzZKR1Y0eDFxSEdJay9qWjZ3QW5KWUtpMVNsVUZVNENpSUNVM29uSEZGQlZTbmZac2JOQkZSVkZhT3lZakF3SFQ4RlpDMW9iTU55cGdHQ2RhK2lzOU91dlNGQTBIRFZLaUhEZVhMVDNONUJFTk5nQWpabW9JVkFKaDErNjFXSmE4dEljdU5jVHJVUkZOSUtwQ0lqTWphWUZWU3dPRThIVWQ0cFR4VGI0a1ZlM3ZRZ0lJY3VvZEZOcFdOWG9HSlF3RDR3Qno5Uk1CNmNPTVZKYVhGelFoQXF0bnVCbE01aEpIN1VXQ2RzK3k5TUpoeWtXQ0Jvd1V5Um96bG52dmJPTURnMVZnWmh3WjhvTTdnSHdHYnhZb09tQjQxOU5NZCtHeXhVVTU3UWlDaXBQdUZJSkJ0OXNERkpUZFczeTMveFcvQVJOcGp2eGw4MHVMQUFBQUFCSlJVNUVya0pnZ2c9PSc7XG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICd5ZWxsb3cnKSB7XG4gICAgICB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSUttbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRnNk5UVXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TlRnNk5UVXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdRNE1qRmtaak10Wm1GbE5DMHhNalF6TFRsalpUVXRabUZrTjJFMk1UZG1OVFUzSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaalV3TjJJeFltTXROREJrWlMwd1pEUXlMV0l3WlRjdE1HVTROak5tTnpWa05qQTBJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPakF3TURKbE5EaGxMVGhtT1dVdE5qVTBZeTA1WWpRMkxUVm1ZV1prTVRCaE4yRTJOend2Y21SbU9teHBQaUE4Y21SbU9teHBQbUZrYjJKbE9tUnZZMmxrT25Cb2IzUnZjMmh2Y0RvNE16Y3hZMlUyWVMweFlXWmtMVEUwTkRNdE9UZ3haQzFrTjJFNE5HWTFObVUwWldVOEwzSmtaanBzYVQ0Z1BISmtaanBzYVQ1aFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaakJsWkRGbFl6Y3RNelU1TUMxa1lUUmlMVGt4WWpBdE5qQTVORFptTVdFMVpEbGpQQzl5WkdZNmJHaytJRHh5WkdZNmJHaytlRzF3TG1ScFpEbzRPR1F6TlRaaE55MDNNVGd4TFdVMU5HRXRPVGxtWlMwME9EQmxNelZoWXpZMlpqWThMM0prWmpwc2FUNGdQQzl5WkdZNlFtRm5QaUE4TDNCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzRPR1F6TlRaaE55MDNNVGd4TFdVMU5HRXRPVGxtWlMwME9EQmxNelZoWXpZMlpqWWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRSVU1UazZNRGc2TURNdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pWa05EWXdOelZtTFRneVpHWXRaamMwTUMxaVpUZGxMV1kzWWpRek9XWmlOekl6TVNJZ2MzUkZkblE2ZDJobGJqMGlNakF4TnkweE1pMHhOVlF4T1RveU16b3pNUzB3T0Rvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1E0TWpGa1pqTXRabUZsTkMweE1qUXpMVGxqWlRVdFptRmtOMkUyTVRkbU5UVTNJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFNVZERTFPalU0T2pVMUxUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUG5ld1k2VUFBQUpFU1VSQlZFakgzVll4YXhSUkVQNis5L2F5dWRVSWtTTm5DQW9SbFlpSVdnbUNoUkRzUlV0YkMzK0Fsc0hXd2xZYmkxaHBZeEVFbTFpcE1SQlJFVVE4Z28yU0hDa2kzbDI0M043dXpWZ2tKbmZIdWJ1NUZ4Snc0TEhGenM0MzgzM3pab2VxaXIwMmczMndmUUgxa2w1V1ZuK1Z2M3k0Rnh3Nzhrd09EUjJFeUlZVTJpUDE5VkR3YytXaUdUOTF2MTRjSFI5Tmlzc2tUYWNmWEd0Y25YenJGMForSXd6WjlsVTN0Q0RJZTVoOTFjU2FYQXB2M0p3YjdKdmVUNTgveXRKeURhb1diRDlpUWZHMkR0U0RVaERGRnFWdkpYSFNkSHBHTUw5QStFRnlFQVZoU1VUeEFCNC95YnRwMmxCQnN3WEFFdFpxTzdkZG1TdG9GYlJBTFFyZFFHZG5IcUpWdlkxcXRRTEdCdjlTbjFEVVFvVnFBMU4zYjZXQ01tMDR2SDZSMTdtRllRZ0RXTHROYUVlbGFtQU5jTzVNR1pQWDErZ0UrdlRSVVcyMmhsQTQvQU54Uk5EMnZEQ2dLT3dBTUhGQzhmemwyUHFkcWNXZ2IzcFBuNnhodFQ2T2tXSVJLZ3JWbnBLQ0NuZys4V1orQldPRmlwdW1VV3dRUnpIT25qOE9TTXFNemcrZ3ZOUkM0Y0N5RytnV2src1I0cFlrdXVVSXhGR01NRFNPb0d4N01zV1B1elI3dDZ0TmlhbzlFdTBYVkR2bXJLWXpvcnRVcVRKanBadWRyYTZnWkhmVWhFTDFiNEt1OUhMbm5jSU1ib245YlZSQkVEdlpvOVFWRkpxdFB0MGNTd1JoTWlUb3BYRkZBcHFsZTlsam9laXZlNlZOby9UdUpiT0ptZ2hxUWZpK0IyVFVkQU5QSEsrTVd2MisyT1RsS3g2TW1FUkdNSmlENzN1d29IRUNIUzc2SzhWNklYai9MaElWZHZ6S3VpM25BNld2RFhOaHd0YWRONGYvWnNQL0F3enQ1UjNic1EyakFBQUFBRWxGVGtTdVFtQ0MnO1xuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAncHVycGxlJykge1xuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUgzbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1ETXRNREpVTVRJNk1qQTZNek10TURVNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllqVm1ZbVUzWWpZdFpHUTFPQzFqTnpSaUxUaG1aR1l0WWpKa05qVTFOVFkzT1RFMElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpBeE5tWm1OamN0WVdZeFpDMDJNVFE1TFRnek1qUXRaRE0wT0dZMU56ZzBaVGswSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEcG1NR1ZrTVdWak55MHpOVGt3TFdSaE5HSXRPVEZpTUMwMk1EazBObVl4WVRWa09XTThMM0prWmpwc2FUNGdQSEprWmpwc2FUNTRiWEF1Wkdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5qd3ZjbVJtT214cFBpQThMM0prWmpwQ1lXYytJRHd2Y0dodmRHOXphRzl3T2tSdlkzVnRaVzUwUVc1alpYTjBiM0p6UGlBOGVHMXdUVTA2U0dsemRHOXllVDRnUEhKa1pqcFRaWEUrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSmpjbVZoZEdWa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5pSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TldRME5qQTNOV1l0T0RKa1ppMW1OelF3TFdKbE4yVXRaamRpTkRNNVptSTNNak14SWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTFWREU1T2pJek9qTXhMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGlOV1ppWlRkaU5pMWtaRFU0TFdNM05HSXRPR1prWmkxaU1tUTJOVFUxTmpjNU1UUWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TURKVU1USTZNakE2TXpNdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEM5eVpHWTZVMlZ4UGlBOEwzaHRjRTFOT2tocGMzUnZjbmsrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrMzQxM2p3QUFBdXBKUkVGVVNNZmxsODl2VkZVVXh6L24zdnVtMDRMbFY4RHdhMUdSTm9TNHdLWVE0MHB3UlFnN293bHVjQ0ViTnF6d0QyQ0hDemZLUWxlV3hCQldKcEM0UXpZRVE4TENLS0xTQUZXVVNKQlN5MHc3Nzk1elhMd3BuYVl6MHpxdjBZVm5jaWVabkp2M3ZlZjcvWjV6MzRpWjhXK0g0eitJMEMxNWNmd1NEMjllcWVRWFhubTVOcjJwSWxuU3BhY1dHckV1ei9aZWVUSzY2OWlEcWFIZjBva3o3L1FPZXVPem16dUdwdDc4ZUdzYUd0TzFqWDRuOGx3TGE4SXJvRUdsT2prNk1aTTlHR2ZZUGdWcVBZTk9Ybi82NnZyRzA2TjdkbTRnMTdRb1p5M0NaQUxFTkJwdnJkOG1iOHc4QnM3M3JPbWp5djJ6cy8wMW9nbFI0NktWYkdIVlU2SVJZQ0o4di9YcWoxOTlYc3BJMzgxOE0xd1AwOWJDYXR1b0FJNCs3bGR1Yy83clQrWktnY2FOOVhNdjZMcFpBVEtyZGx5ZVBqS0JGOVBtUDE3Yjkvb0hwZHg3ZU1kYkg2VmI2ZjF2QjY2aVlraExUcXo0WllBaVZLT3dxYll6N2YzNTZKZWxRQThPSG5rN2oydmlEejlkODFIbVdBeTdFTGwzRE9hRGJHZjM1aU9uRDFaS2dkNzVaZUw0bGpEUzkxSWNvMko5R05wbWw0QXFpUENYVFRNNWVmYzlHTzFLc1hRYmcrL0txY1lJWTluSThBaXlJUys0bkcrWkpyMkM0QldzMzhqdkJDNC8vSUp4KzFCNnJuU1d1Wmd4a1BYTEdweEZSS1ZObllLSm9TcUllUUpadlJTOWdrTXhvaVNjSktURCtVMGRtaUNaS3o5N0ZTMTBOQ25vN0tDRWlJRUFvbWhiM1h1NlpReWpzL2JPREhFR3JPeWFYQVpVaU9TWUZkcDFaTVFWdWFRSnQ0STZYUGVrdzVwMWRyT2oxK0pJeGJpVTFhRFhXcjdiUjNMR1Azbi9DTXR0RUFRUjhBTFdZZkE3Qld2dUt3MmFFZkJOTXBJdHpOc2xsUW9Gb0hUWGZvVjlXaGdKdEd1bG9nRzFoSnF1RHIyK3NBakpyR09sVUl6ZlZkSFVOYWtTWjdnQUZqdDVMZUc5ekR1Z0xHaEdsUUdrN3BFZ2tPWWY2MXI4TElnSldvR3NZUVN5Y3FBTlp2MGpmdVgzZTNlZlR5UnBmdG8xaVNjd3paKytGT2loa3dlbWZNT3ZEWFBrVGszbmdWUjBTUytyR0NtSUc2N3VyeTNiaHYrYnZ4Vi9BOHNWUUFnOCtnRFlBQUFBQUVsRlRrU3VRbUNDJztcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1Y2tVcmw7XG4gIH1cblxuICBjb252ZXJ0TWlsZXNUb0ZlZXQobWlsZXMpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtaWxlcyAqIDUyODApO1xuICB9XG5cbiAgcHVzaE5ld1RydWNrKG1hcHMsIHRydWNrSXRlbSkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHZhciBjdXJyZW50T2JqZWN0ID0gdGhpcztcbiAgICB2YXIgcGluTG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odHJ1Y2tJdGVtLmxhdCwgdHJ1Y2tJdGVtLmxvbmcpO1xuICAgIHZhciBkZXN0TG9jID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRydWNrSXRlbS53ckxhdCwgdHJ1Y2tJdGVtLndyTG9uZyk7XG4gICAgdmFyIGljb25Vcmw7XG4gICAgdmFyIGluZm9Cb3hUcnVja1VybDtcbiAgICB2YXIgTmV3UGluO1xuICAgIHZhciBqb2JJZFVybCA9ICcnO1xuXG4gICAgdmFyIHRydWNrQ29sb3IgPSB0cnVja0l0ZW0udHJ1Y2tDb2wudG9Mb3dlckNhc2UoKTtcbiAgICBpY29uVXJsID0gdGhpcy5nZXRJY29uVXJsKHRydWNrQ29sb3IsIHRydWNrSXRlbS5sYXQsIHRydWNrSXRlbS5sb25nLCB0cnVja0l0ZW0ud3JMYXQsIHRydWNrSXRlbS53ckxvbmcpO1xuXG4gICAgaWYgKHRydWNrQ29sb3IgPT0gJ2dyZWVuJykge1xuICAgICAgaW5mb0JveFRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRWdBQUFBckNBWUFBQURiamM2ekFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFGR21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TlMwd01WUXhOam94TVRveE1DMHdORG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNakF0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1qQXRNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1Rka1pqRTBZbVF0TkRCaE9DMDFORFJqTFRrek9UQXRNMlJpTm1aa1lUWm1NbUpsSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZNR0ZrTTJJeVpESXRPREJoTmkweE1EUmtMVGhpTnpRdFpqVmhaREZtTVRobFl6RXlJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPVGRrWmpFMFltUXROREJoT0MwMU5EUmpMVGt6T1RBdE0yUmlObVprWVRabU1tSmxJajRnUEhodGNFMU5Pa2hwYzNSdmNuaytJRHh5WkdZNlUyVnhQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaVkzSmxZWFJsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvNU4yUm1NVFJpWkMwME1HRTRMVFUwTkdNdE9UTTVNQzB6WkdJMlptUmhObVl5WW1VaUlITjBSWFowT25kb1pXNDlJakl3TVRndE1EVXRNREZVTVRZNk1URTZNVEF0TURRNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCtPZHVLM1FBQUF3OUpSRUZVYU43dG1qMVBHMEVRaHU4bnVLZWhESjBybE5KU0pHcEhwQ1d5bERZRjZhQUJWNlFpUVFLbFNSUk1GU1VGcHFOQm1Bb0VCYVFncERUaVE1UUdtcFNiZTlGdE5CbjJ6bnQzTzhkOWVLU1JiVGp0dnZmYzdzemM3bnFla0NtbDJxcllkdUo3VFFwT1EvZHkvK2RlZlRuWVVNdTl0ZHc3ZEVJdnNhNFVvQzNkdzlTbmwycHM0VmxoSEhxcEpRVlE5LzJqN3ozZkIyRmo5TmZONzBMQjBYN1FQMG9HS0FEVHM1M0U2S2d5Z1B4ckZ6a0F6RmMwUmgyanBuS0EvT3ZXK2NoNDgrMnRzZkZYNjYrckJZakRXZHgrSDlsNHBRQnhPTys2ODBNYnJ3eWdKSEFxQXlncG5Fb0FTZ09uOUlEU3dpazFJUC83U2xvNHBRWGtmelpkd0Nrem9MNExPS1VFUkVmUGo1TnU2c2JMQ0tpamZ6ei84R0lFeUFBSUsyZnFjbkR0cFBFeUFuSjZNeU5BUXh6VGxKcUxhWnVsVHl4TnFqdXk3T3BKUEcyNkpuUXh1Rkt6bTNOcSt1dE03aDA2b2ZlL0pWY0pRSFNhRmR4bVBhbDRnWHFLN1JBVXpiWjBrU2dXVURHZnNjQ0crb292emViUm1iWEZBUlhOUjRDeUJJVHBveU0vUHZPMFFZalNnbXF6TFRXY0FFSm4zNDgzalZFTktYSjVkL1hKd0dDbjVaU1VHTlQyKzRjUDJWVVVFRExUblVWbWdraU1zQ3poaEQwMGJwLzNOMlFBNGVud2JXVmtLRHdWT04vNHp4SVNoNE43MGRxZ0cxbVVhc1AxVGdIeDhqdHNid3pYMFNyYXhmS0p6YWkyV2V4RGFLRGFUTlB0VVpGb0N3aEhRMnczRGdFSkt3Tlp2WXZSVjRNNDJrN1p3UXBEOWQvUWdQYUczWXdXWWJza1FxZmpNTkd1anFyWWFxTWpqdDR2UWdTemNRMm9wZit5ZmJiektHN2d0elkwRXJlbWtLeXY2TWkyMVVidlI1OHY0R2VDTUdqNGRzOVAvUi9FR2tSNnBHczREWUFRWkN0ZXh5eWQraVVjcVR1Sk5wcjZRN0pmblFPcVVVaGhsbVFFWldWSkFJVllLMnk3dVJZY3ZMeU5xbS95dXR4aHE0MlhLL1R0L1Y5Z3RqeUVTYjBUWjF1SUR2MGdDVFFFdlIyVnVybXpTdnM4YUtPVzlsRG1PSTFSVVVJTWM3cnVDVnR3b3cvYW90NEpEZHBhWXVlZTBSbGVCSkVWSU1xMFhPbFVRTFMyWmdKdEhRa2hLekhDUXR2TDBHaTVZbUVkNmFkMUh0SDVubld3YzYrdFRndGZnMEYzTTA2YmZ3RzRUdjhYeStoUGFBQUFBQUJKUlU1RXJrSmdnZz09JztcbiAgICB9IGVsc2UgaWYgKHRydWNrQ29sb3IgPT0gJ3JlZCcpIHtcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXJDQVlBQUFEYmpjNnpBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRkVtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd05TMHdNVlF4TmpveE1Ub3lNUzB3TkRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1qTXRNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1qTXRNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WmpBMVkyVm1ORGN0TTJOallpMDNZalEyTFdJMVpqUXROMkk1TURBd01qZzFNamxsSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT21Zd05XTmxaalEzTFROalkySXROMkkwTmkxaU5XWTBMVGRpT1RBd01ESTROVEk1WlNJZ2VHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT21Zd05XTmxaalEzTFROalkySXROMkkwTmkxaU5XWTBMVGRpT1RBd01ESTROVEk1WlNJK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZaakExWTJWbU5EY3RNMk5qWWkwM1lqUTJMV0kxWmpRdE4ySTVNREF3TWpnMU1qbGxJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakV4T2pJeExUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUHBLcGNLY0FBQUw0U1VSQlZHamU3WnJOU2pNeEZJYm5FdVlTdW5iVm5WczM3c1ViY0c1QTZOWnVuS1U3WGVqYTZnMjBGMUN3NjI0VVFTd0kva0JGRUlwRlFSQ0VtTGMwY25xY1RETXp5VGcvUFhBKzlXTkkzanhKVGs1K1BNK0JDU0ZDVVc2N2xPNTdqdUJzcUZxKzM5L0Y2L201ZURrNUtieERKL1FTNjdvQzFGTTFqTGEzeGVYYVdta2NlcGsxMGdCb1NqK1VmaUg5VFRkR1AwZWpVc0ZSL2pFYzBtYUVTY0ZjbUU1aVZGUWJRUExEZlE0QTh4V0ZVY2VvcVIwZytkRXBIeG4zdTd1UmhkOEZRYjBBY1Rqamc0UFl3bXNGaU1ONWFyZVhGbDRiUUduZzFBWlFXamkxQUpRRlR1VUJaWVZUYVVEeWw2T3NjQ29MU1A2elpRTk9sUUU5MklCVFpVQXptL1I2bVF1dk5LQ2J6YzBWSUIyZ3IrZG5LNFZYRnBDdHhxd0FMWEZNVTJvMnBtMmVmcjIrem85ZFc1N3QzcVpuUWwvanNYamEyeE4zT3p1RmQraUVYbWErZFVCMG1wWGNXaXFMdGg0dmtFK3hvVm8yNjlFOW1KT0Fpdm1NQXpia1YveG90b2pPTEhRT3FHeStBcFFuSUV3ZkZmbnhzMGdYaEVndHFEYlRWTU1LSUZRMjZYWWpveHFXeUpmajQzOERnNXVXejl0YjdSMGRWbGVuZ0V4WEpvakVDTXNUanE3VHVMMmVuYmtCaE43aDE4cFlvZEFyY0g3eG55Y2tEZ2R0VWRxZ0c2c28xWWJ2clFMaTZiZnViZ3pmMFN6YXh2R0p5YWcyT2V4RGFLRGFvcVpiWkpKb0FnaFBRMHd2RGdFSkp3TjU3Y1hvMWlDSk5vendKZG4veGdLZ3VNWW9FYVpISW5RNkxoTnQ2Nm1LcVRZNjRtaDdFU0swejE3VS8wejcvVDl4QTMvL0JqaFpTTktjd21WK1JVZTJxVGJhSHZXK0lPSk4wSURmaFYwdHZBaVRrUjdMTlp3R1FBZ3lGYTlpbGxyNlhUamRIaVRSUmp0UHMvbzFPU0NmUXRJdWtTbEdVRjZXQnBER0F0MWR2RDkvZURtTnkyK0tldHhocW8ybkszVDN2aENZRFI1aFV1OGt1UlppTytOQlJIazJQWXhidXY4YzVpMW0yby96TXZ5c2p6SWJORWJGQ1ltWTAwM1BzYzBiT3RNV3R5ZU0wQlk0ZS9lTXlyQVJ4S29BVVpyanlzREx3ZmpOc0tHMmpnc2hSd25DUXVqbGFPaU1CTm82cm52ck1hYnlnWEd3czYrdE9hOWZaOUM5bGJUY0h4SEJ4QjdKNmVUVkFBQUFBRWxGVGtTdVFtQ0MnO1xuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAneWVsbG93Jykge1xuICAgICAgaW5mb0JveFRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRWdBQUFBc0NBWUFBQURHaVA0TEFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFGRW1sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TlMwd01WUXhOam94TVRvd05pMHdORG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TVRrdE1EUTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TVRrdE1EUTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVEF5TkRFNFkyRXROVE16TkMwNE5qUmpMV0ZoTm1FdFlUSmxORGsyWW1VMVltRTRJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0o0YlhBdVpHbGtPamt3TWpReE9HTmhMVFV6TXpRdE9EWTBZeTFoWVRaaExXRXlaVFE1Tm1KbE5XSmhPQ0lnZUcxd1RVMDZUM0pwWjJsdVlXeEViMk4xYldWdWRFbEVQU0o0YlhBdVpHbGtPamt3TWpReE9HTmhMVFV6TXpRdE9EWTBZeTFoWVRaaExXRXlaVFE1Tm1KbE5XSmhPQ0krSUR4NGJYQk5UVHBJYVhOMGIzSjVQaUE4Y21SbU9sTmxjVDRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUltTnlaV0YwWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9UQXlOREU0WTJFdE5UTXpOQzA0TmpSakxXRmhObUV0WVRKbE5EazJZbVUxWW1FNElpQnpkRVYyZERwM2FHVnVQU0l5TURFNExUQTFMVEF4VkRFMk9qRXhPakEyTFRBME9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpOCtJRHd2Y21SbU9sTmxjVDRnUEM5NGJYQk5UVHBJYVhOMGIzSjVQaUE4TDNKa1pqcEVaWE5qY21sd2RHbHZiajRnUEM5eVpHWTZVa1JHUGlBOEwzZzZlRzF3YldWMFlUNGdQRDk0Y0dGamEyVjBJR1Z1WkQwaWNpSS9QbktiSTVZQUFBTUpTVVJCVkdqZTdacTlTc1JBRUlEdkVTeDhBTUVYT0h3Qjd3blVKNUI3QUFWN0M2L1ZSa3V0dk01U1FRUWJPUVcxc2ZCQUxTejg0Um9id2JQUVFzeXRNMnMyVGphYlpQT3phMzV1WUZCUXNwTXZzek96czlOb1dCREcyQVRvYkFtMDJiQXBzT0FDNkJNcmw3eUJydUZITlEybnc4b3QxOFlnd1lOYjNqSmY3OHg1M0dITy9VYnhGZXhFZTRuc213SjBJRlp3emxycyszQ3lOSXIyVWtrTG9BbTZDZHB6OTZ4U1J1KzNwWUlqZFBSNmtRNlFDNmFudTRseG9kb0FjaU83WDJDLzRzTjhDbDVUTzBEd2Y3dXlaemhYaStvOWZEbGZMMEFCT0hlcjBVR3VUb0FDY1ByTDhWbWdMb0RTd0trTm9MUndhZ0VvQzV6S0E4b0twOUtBNFBldHJIQXFDOGh0UzJTR1UyVkFUM25BcVNRZzZqMmp3VjcyMDNBRkFYVzkxc1RKekJpUUF0QTEvKzF6a0U4L3BZS0FjbjJaTWFBNFFMQk5xZVN4YmEzcThUUmpYME56Z1BnWElEMGg5akZnVG44SlBHdXUrQXAyb3IyK2xxc0pRSFNibFZ4V0dxYmlCZFpUMGcxQjJlUkFGSW5tQWlyc1oyeXdZWDBWYU0wV1VDWHBtQWRVTWgwRHNnb0l0bytJL1B4bmdTNElzYlR3MmFaWmF1UUNDQmZEbUtJVVNKR2orL1gvQTNPMUNDWEdUY2dkM1RuUHJrWUIvV2FtWWZ5RklSaUpIbWExK2czN2FKSTREOXRtQU9IWGthK1ZNVVBoVitFcVhmemJoQ1RENFZsSjJJWmVoWCtudG9WMExkSURrc3J2MExzeFRPdjBaaldIOW9tV1YyczArM2hvSUxhcHRsdWdTTlFGaEtNaHVoZUhIT2Jud05wWmpCNE5rdGpHUFR5NittOEpRS2R4TCtNWm9ka1NvZHN4MXVpOFJsVTBiYU1lUjkrWGh3aS9UQWxBYmU5bFhvNkNjUU9waXdmQ1E1TFdGQ2JySytyWjJyYlI5M0huQytTWklIUWErYnFuL3pleE1lU1JIdE0xVnhJQTBTQnRRQ0ptdWFuZmlFTHFUbVViU2YwaDJhK3Bta0x0eDZiSUZCNWtTOUlBQ3BGMjFLZ3VEbDRPSSt1YmdyWTd0RzJUeWhWNmV2Y0NzK1lRSnRWdWttc2g2dnB1RW1nWjFFNVU2ZzQyODN5VjlyUDdqSW1zUTVsVHZoZ1ZZWWhpVHpjdHpHTS9lN1pGbkFrVnRyV056VDNqWW5nUTVJZFdNRXJWcnN6VmdQaUI5YVMyZFUwWXNwVWdMSFFzVC9XM0U5aW1EZWNIUmp4U21LK2JxZndBQUFBQVNVVk9SSzVDWUlJPSc7XG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICdwdXJwbGUnKSB7XG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUd0bWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdNeTB3TTFReE1Ub3pNVG93TkMwd05Ub3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZORGt0TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZORGt0TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1Ea3dZVEF3WlRZdE9UTm1aaTFrWWpRMUxXSXhNakV0TTJJMU16Qm1OMll5WlRRd0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2TlRKa01XUXdNRGd0WVdNeE15MDNNRFE1TFRsbU9HTXRPVGhpTlRjeFpESXpZakkwSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2WXpJME9UZzBNR1V0TW1Ka01TMWtaRFF4TFRnMFkySXRNV1EwWWpSak56VmtNRGt4SWo0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGpNalE1T0RRd1pTMHlZbVF4TFdSa05ERXRPRFJqWWkweFpEUmlOR00zTldRd09URWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TUROVU1URTZNekU2TURRdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pKbU16azNNakU0TFRsbU1EVXRaVGMwTUMxaVkyWTVMVE5pTW1Wak16azVNRFEzTWlJZ2MzUkZkblE2ZDJobGJqMGlNakF4T0Mwd015MHdNMVF4TVRvek9Ub3dPQzB3TlRvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpYzJGMlpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZNRGt3WVRBd1pUWXRPVE5tWmkxa1lqUTFMV0l4TWpFdE0ySTFNekJtTjJZeVpUUXdJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakUxT2pRNUxUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUJ6ZEVWMmREcGphR0Z1WjJWa1BTSXZJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUGdZb0k0b0FBQUw5U1VSQlZHamU3WnE3VGh0QkZJYjNFZndJUElJZmdUZkFOWldyMU82RGhMdVVRQnNweW5aV2luQUxEVWhnRjBna1VpUWloMlliMWtVb2tKQ01FQVZVeS83SUE4ZkhzN3V6dTNNMmUvR1JqbnpSYXViZmIyYk9uTGs0anBBRlFkQVBxbTJYb2JlazRLeXFXcDRlbjRQeG9SZjhIbHlWM3FFVGVvbnRTUUhhVnpWODd4MEhuOWUrVmNhaGwxcFdBTzNRdDBJZmhqNk42cU4zL3JSU2NKVGYvTDNOQm1nR1ptZzZpRkZSWXdDRnoyNXlBQml2S0l3NmVrM2pBSVhQZmVVOTQrVFR1YmJ3bzQxaHN3QnhPQmRmTG1NTGJ4UWdEbWUwOHl1eDhNWUF5Z0tuTVlDeXdta0VvRHh3YWc4b0w1eGFBd3EvYitlRlUxdEE0V2ZIQnB3NkEvSnR3S2tsSU5wN3ZETS9kK0YxQk9TcUg0TVBSMHRBR2tEWU9Rc2ViaCt0RkY1SFFGWmZaZ2tvd1RGTXFka1l0a1c2dTc0N3QrM3FTTFEyM1JQQzBNWE0rT1BqV2VrZE9xRjNic3RWQWhBZFpoVzNuaU1WTDlBYTdJU2dhcmF2a2tTeGdJcnhqQTAyNUZkOGE3YU16cXd2RHFocXZnUlVKQ0FNSHhYNThWbW1BMEtrRmxTYmFhcGhCUkFxODA1OWJWVERGSWtqM1A4RkJpY3RkOWZUeURNNnpLNmlnRXhuSm9oRUR5c1NUbFNqY1JzZmVES0EwRHI4V0JrekZGb0Z6Zy8raTRURTRlQmRsRGJveGl4S3RlRjVxNEI0K2gxMU5vYm5hQlp0WS92RXBGZWJiUFloTkZCdHV1RzJrQ1NhQWtKY01UMDRCQ1Nhcmt1dnhXaGRhYlNoaHlkay82c0swQ2pwWlZTaHBsc2lkRGdtaWJaMVZjVlVHKzF4OUgwUklwaXRLRUJkOVkvLzg5OUMzTUR2dHdCMzZLWE9LU1R6SzlxelRiWFI5MUgzQy9pZElIUWFmdHp6Wis1RzJNSDdqVEFhQU5OTTRTcG1xYWxmd3VueUlJMDIybmdSczErYkEycFJTSkZUWklZZVZKUmxBUlJoM2FqajV0YnM0dVY5WEg1VDF1ME9VMjA4WGFHcjk3ZkFiSGdKazdxYjVsaUlyWXhIbXZKc2VqOXU2bDdZekp2UHRDZXpNbHA1TDJXdTBCZ1ZKMFF6cHR1T3NNMWU5RlZiM0pwUW82MHJkdThabFdFaGlGa0JvblRibFZZRnhHdnJaTkRtU2dqWlRoRVcrazZCUnRNVkEzT2xXMnNTVS9uSU9OaloxOWFtaWEvR29MdVRwc3dYb2FUd3NuS0FrZEVBQUFBQVNVVk9SSzVDWUlJPSc7XG4gICAgfVxuXG4gICAgdmFyIGZlZXRmb3JNaWxlcyA9IDAuMDAwMTg5Mzk0O1xuICAgIHZhciBtaWVsc1RvZGlzcGF0Y2ggPSBwYXJzZUZsb2F0KHRydWNrSXRlbS5kaXN0KS50b0ZpeGVkKDIpO1xuXG4gICAgdGhpcy5yZXN1bHRzLnB1c2goe1xuICAgICAgZGlzcGxheTogdHJ1Y2tJdGVtLnRydWNrSWQgKyBcIiA6IFwiICsgdHJ1Y2tJdGVtLnRlY2hJRCxcbiAgICAgIHZhbHVlOiAxLFxuICAgICAgTGF0aXR1ZGU6IHRydWNrSXRlbS5sYXQsXG4gICAgICBMb25naXR1ZGU6IHRydWNrSXRlbS5sb25nXG4gICAgfSk7XG5cbiAgICB2YXIgdHJ1Y2tVcmwgPSB0aGlzLmdldFRydWNrVXJsKHRydWNrQ29sb3IpO1xuICAgIGNvbnN0IGxpc3RPZlB1c2hQaW5zID0gbWFwcy5lbnRpdGllcztcbiAgICB2YXIgaXNOZXdUcnVjayA9IHRydWU7XG5cbiAgICB2YXIgbWV0YWRhdGEgPSB7XG4gICAgICB0cnVja0lkOiB0cnVja0l0ZW0udHJ1Y2tJZCxcbiAgICAgIEFUVFVJRDogdHJ1Y2tJdGVtLnRlY2hJRCxcbiAgICAgIHRydWNrU3RhdHVzOiB0cnVja0l0ZW0udHJ1Y2tDb2wsXG4gICAgICB0cnVja0NvbDogdHJ1Y2tJdGVtLnRydWNrQ29sLFxuICAgICAgam9iVHlwZTogdHJ1Y2tJdGVtLmpvYlR5cGUsXG4gICAgICBXUkpvYlR5cGU6IHRydWNrSXRlbS53b3JrVHlwZSxcbiAgICAgIFdSU3RhdHVzOiB0cnVja0l0ZW0ud3JTdGF0LFxuICAgICAgQXNzaW5nZWRXUklEOiB0cnVja0l0ZW0ud3JJRCxcbiAgICAgIFNwZWVkOiB0cnVja0l0ZW0uc3BlZWQsXG4gICAgICBEaXN0YW5jZTogbWllbHNUb2Rpc3BhdGNoLFxuICAgICAgQ3VycmVudElkbGVUaW1lOiB0cnVja0l0ZW0uaWRsZVRpbWUsXG4gICAgICBFVEE6IHRydWNrSXRlbS50b3RJZGxlVGltZSxcbiAgICAgIEVtYWlsOiAnJywvLyB0cnVja0l0ZW0uRW1haWwsXG4gICAgICBNb2JpbGU6ICcnLCAvLyB0cnVja0l0ZW0uTW9iaWxlLFxuICAgICAgaWNvbjogaWNvblVybCxcbiAgICAgIGljb25JbmZvOiBpbmZvQm94VHJ1Y2tVcmwsXG4gICAgICBDdXJyZW50TGF0OiB0cnVja0l0ZW0ubGF0LFxuICAgICAgQ3VycmVudExvbmc6IHRydWNrSXRlbS5sb25nLFxuICAgICAgV1JMYXQ6IHRydWNrSXRlbS53ckxhdCxcbiAgICAgIFdSTG9uZzogdHJ1Y2tJdGVtLndyTG9uZyxcbiAgICAgIHRlY2hJZHM6IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsXG4gICAgICBqb2JJZDogdHJ1Y2tJdGVtLmpvYklkLFxuICAgICAgbWFuYWdlcklkczogdGhpcy5tYW5hZ2VySWRzLFxuICAgICAgd29ya0FkZHJlc3M6IHRydWNrSXRlbS53b3JrQWRkcmVzcyxcbiAgICAgIHNiY1ZpbjogdHJ1Y2tJdGVtLnNiY1ZpbixcbiAgICAgIGN1c3RvbWVyTmFtZTogdHJ1Y2tJdGVtLmN1c3RvbWVyTmFtZSxcbiAgICAgIHRlY2huaWNpYW5OYW1lOiB0cnVja0l0ZW0udGVjaG5pY2lhbk5hbWUsXG4gICAgICBkaXNwYXRjaFRpbWU6IHRydWNrSXRlbS5kaXNwYXRjaFRpbWUsXG4gICAgICByZWdpb246IHRydWNrSXRlbS56b25lXG4gICAgfTtcblxuICAgIGxldCBqb2JJZFN0cmluZyA9ICdodHRwOi8vZWRnZS1lZHQuaXQuYXR0LmNvbS9jZ2ktYmluL2VkdF9qb2JpbmZvLmNnaT8nO1xuXG4gICAgbGV0IHpvbmUgPSB0cnVja0l0ZW0uem9uZTtcblxuICAgIC8vID0gTSBmb3IgTVdcbiAgICAvLyA9IFcgZm9yIFdlc3RcbiAgICAvLyA9IEIgZm9yIFNFXG4gICAgLy8gPSBTIGZvciBTV1xuICAgIGlmICh6b25lICE9IG51bGwgJiYgem9uZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh6b25lID09PSAnTVcnKSB7XG4gICAgICAgIHpvbmUgPSAnTSc7XG4gICAgICB9IGVsc2UgaWYgKHpvbmUgPT09ICdTRScpIHtcbiAgICAgICAgem9uZSA9ICdCJ1xuICAgICAgfSBlbHNlIGlmICh6b25lID09PSAnU1cnKSB7XG4gICAgICAgIHpvbmUgPSAnUydcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgem9uZSA9ICcnO1xuICAgIH1cblxuICAgIGpvYklkU3RyaW5nID0gam9iSWRTdHJpbmcgKyAnZWR0X3JlZ2lvbj0nICsgem9uZSArICcmd3JpZD0nICsgdHJ1Y2tJdGVtLndySUQ7XG5cbiAgICB0cnVja0l0ZW0uam9iSWQgPSB0cnVja0l0ZW0uam9iSWQgPT0gdW5kZWZpbmVkIHx8IHRydWNrSXRlbS5qb2JJZCA9PSBudWxsID8gJycgOiB0cnVja0l0ZW0uam9iSWQ7XG5cbiAgICBpZiAodHJ1Y2tJdGVtLmpvYklkICE9ICcnKSB7XG4gICAgICBqb2JJZFVybCA9ICc8YSBocmVmPVwiJyArIGpvYklkU3RyaW5nICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiIHRpdGxlPVwiQ2xpY2sgaGVyZSB0byBzZWUgYWN0dWFsIEZvcmNlL0VkZ2Ugam9iIGRhdGFcIj4nICsgdHJ1Y2tJdGVtLmpvYklkICsgJzwvYT4nO1xuICAgIH1cblxuICAgIGlmICh0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lICE9IG51bGwgJiYgdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSB1bmRlZmluZWQgJiYgdHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSAnJykge1xuICAgICAgbGV0IGRpc3BhdGNoRGF0ZSA9IHRydWNrSXRlbS5kaXNwYXRjaFRpbWUuc3BsaXQoJzonKTtcbiAgICAgIGxldCBkdCA9IGRpc3BhdGNoRGF0ZVswXSArICcgJyArIGRpc3BhdGNoRGF0ZVsxXSArICc6JyArIGRpc3BhdGNoRGF0ZVsyXSArICc6JyArIGRpc3BhdGNoRGF0ZVszXTtcbiAgICAgIG1ldGFkYXRhLmRpc3BhdGNoVGltZSA9IHRoYXQuVVRDVG9UaW1lWm9uZShkdCk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGluIHRoZSBUcnVja1dhdGNoTGlzdCBzZXNzaW9uXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykgIT09IG51bGwpIHtcbiAgICAgIHRoaXMudHJ1Y2tMaXN0ID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja1dhdGNoTGlzdCcpKTtcblxuICAgICAgaWYgKHRoaXMudHJ1Y2tMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHRoaXMudHJ1Y2tMaXN0LnNvbWUoeCA9PiB4LnRydWNrSWQgPT0gdHJ1Y2tJdGVtLnRydWNrSWQpID09IHRydWUpIHtcbiAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMudHJ1Y2tMaXN0LmZpbmQoeCA9PiB4LnRydWNrSWQgPT0gdHJ1Y2tJdGVtLnRydWNrSWQpO1xuICAgICAgICAgIGNvbnN0IGluZGV4OiBudW1iZXIgPSB0aGlzLnRydWNrTGlzdC5pbmRleE9mKGl0ZW0pO1xuICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGl0ZW0uRGlzdGFuY2UgPSBtZXRhZGF0YS5EaXN0YW5jZTtcbiAgICAgICAgICAgIGl0ZW0uaWNvbiA9IG1ldGFkYXRhLmljb247XG4gICAgICAgICAgICB0aGlzLnRydWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy50cnVja0xpc3Quc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcbiAgICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja1dhdGNoTGlzdCcsIHRoaXMudHJ1Y2tMaXN0KTtcbiAgICAgICAgICAgIGl0ZW0gPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBpbiB0aGUgU2VsZWN0ZWRUcnVjayBzZXNzaW9uXG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrRGV0YWlscycpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcbiAgICAgIHNlbGVjdGVkVHJ1Y2sgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrRGV0YWlscycpKTtcblxuICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xuICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjay50cnVja0lkID09IHRydWNrSXRlbS50cnVja0lkKSB7XG4gICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnVHJ1Y2tEZXRhaWxzJyk7XG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrRGV0YWlscycsIG1ldGFkYXRhKTtcbiAgICAgICAgICBzZWxlY3RlZFRydWNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnRydWNrSXRlbXMubGVuZ3RoID4gMCAmJiB0aGlzLnRydWNrSXRlbXMuc29tZSh4ID0+IHgudG9Mb3dlckNhc2UoKSA9PSB0cnVja0l0ZW0udHJ1Y2tJZC50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgaXNOZXdUcnVjayA9IGZhbHNlO1xuICAgICAgLy8gSWYgaXQgaXMgbm90IGEgbmV3IHRydWNrIHRoZW4gbW92ZSB0aGUgdHJ1Y2sgdG8gbmV3IGxvY2F0aW9uXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RPZlB1c2hQaW5zLmdldExlbmd0aCgpOyBpKyspIHtcbiAgICAgICAgaWYgKGxpc3RPZlB1c2hQaW5zLmdldChpKS5tZXRhZGF0YS50cnVja0lkID09PSB0cnVja0l0ZW0udHJ1Y2tJZCkge1xuICAgICAgICAgIHZhciBjdXJQdXNoUGluID0gbGlzdE9mUHVzaFBpbnMuZ2V0KGkpO1xuICAgICAgICAgIGN1clB1c2hQaW4ubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICBkZXN0TG9jID0gcGluTG9jYXRpb247XG4gICAgICAgICAgcGluTG9jYXRpb24gPSBsaXN0T2ZQdXNoUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcblxuICAgICAgICAgIGxldCB0cnVja0lkUmFuSWQgPSB0cnVja0l0ZW0udHJ1Y2tJZCArICdfJyArIE1hdGgucmFuZG9tKCk7XG5cbiAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0uaW5kZXhPZih0cnVja0l0ZW0udHJ1Y2tJZCkgPiAtMSkge1xuICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uVHJ1Y2tMaXN0LnB1c2godHJ1Y2tJZFJhbklkKTtcblxuICAgICAgICAgIHRoaXMubG9hZERpcmVjdGlvbnModGhpcywgcGluTG9jYXRpb24sIGRlc3RMb2MsIGksIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudHJ1Y2tJdGVtcy5wdXNoKHRydWNrSXRlbS50cnVja0lkKTtcbiAgICAgIE5ld1BpbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5QdXNocGluKHBpbkxvY2F0aW9uLCB7IGljb246IHRydWNrVXJsIH0pO1xuXG4gICAgICBOZXdQaW4ubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgIHRoaXMubWFwLmVudGl0aWVzLnB1c2goTmV3UGluKTtcblxuICAgICAgdGhpcy5kYXRhTGF5ZXIucHVzaChOZXdQaW4pO1xuICAgICAgaWYgKHRoaXMuaXNNYXBMb2FkZWQpIHtcbiAgICAgICAgdGhpcy5pc01hcExvYWRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1hcC5zZXRWaWV3KHsgY2VudGVyOiBwaW5Mb2NhdGlvbiwgem9vbTogdGhpcy5sYXN0Wm9vbUxldmVsIH0pO1xuICAgICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSB0aGlzLm1hcC5nZXRab29tKCk7XG4gICAgICAgIHRoYXQubGFzdExvY2F0aW9uID0gdGhpcy5tYXAuZ2V0Q2VudGVyKCk7XG4gICAgICB9XG5cbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ21vdXNlb3V0JywgKGUpID0+IHtcbiAgICAgICAgdGhpcy5pbmZvYm94LnNldE9wdGlvbnMoeyB2aXNpYmxlOiBmYWxzZSB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPCAxMDI0KSB7XG4gICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICB0aGlzLmluZm9ib3guc2V0T3B0aW9ucyh7XG4gICAgICAgICAgICBzaG93UG9pbnRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiBlLnRhcmdldC5nZXRMb2NhdGlvbigpLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHNob3dDbG9zZUJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgIG9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDAsIDIwKSxcbiAgICAgICAgICAgIGh0bWxDb250ZW50OiAnPGRpdiBjbGFzcyA9IFwiaW5meSBpbmZ5TWFwcG9wdXBcIj4nXG4gICAgICAgICAgICAgICsgZ2V0SW5mb0JveEhUTUwoZS50YXJnZXQubWV0YWRhdGEsIHRoaXMudGhyZXNob2xkVmFsdWUsIGpvYklkVXJsKSArICc8L2Rpdj4nXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnRydWNrV2F0Y2hMaXN0ID0gW3sgVHJ1Y2tJZDogZS50YXJnZXQubWV0YWRhdGEudHJ1Y2tJZCwgRGlzdGFuY2U6IGUudGFyZ2V0Lm1ldGFkYXRhLkRpc3RhbmNlIH1dO1xuXG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snLCBlLnRhcmdldC5tZXRhZGF0YSk7XG4gICAgICAgICAgdGhpcy5tYXBTZXJ2aWNlLnN0b3JlRGF0YUluU2Vzc2lvblN0b3JhZ2UoJ1RydWNrRGV0YWlscycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcblxuICAgICAgICAgIC8vIEEgYnVmZmVyIGxpbWl0IHRvIHVzZSB0byBzcGVjaWZ5IHRoZSBpbmZvYm94IG11c3QgYmUgYXdheSBmcm9tIHRoZSBlZGdlcyBvZiB0aGUgbWFwLlxuXG4gICAgICAgICAgdmFyIGJ1ZmZlciA9IDMwO1xuICAgICAgICAgIHZhciBpbmZvYm94T2Zmc2V0ID0gdGhhdC5pbmZvYm94LmdldE9mZnNldCgpO1xuICAgICAgICAgIHZhciBpbmZvYm94QW5jaG9yID0gdGhhdC5pbmZvYm94LmdldEFuY2hvcigpO1xuICAgICAgICAgIHZhciBpbmZvYm94TG9jYXRpb24gPSBtYXBzLnRyeUxvY2F0aW9uVG9QaXhlbChlLnRhcmdldC5nZXRMb2NhdGlvbigpLCBNaWNyb3NvZnQuTWFwcy5QaXhlbFJlZmVyZW5jZS5jb250cm9sKTtcbiAgICAgICAgICB2YXIgZHggPSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hPZmZzZXQueCAtIGluZm9ib3hBbmNob3IueDtcbiAgICAgICAgICB2YXIgZHkgPSBpbmZvYm94TG9jYXRpb24ueSAtIDI1IC0gaW5mb2JveEFuY2hvci55O1xuXG4gICAgICAgICAgaWYgKGR5IDwgYnVmZmVyKSB7IC8vIEluZm9ib3ggb3ZlcmxhcHMgd2l0aCB0b3Agb2YgbWFwLlxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxuICAgICAgICAgICAgZHkgKj0gLTE7XG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBidWZmZXIgZnJvbSB0aGUgdG9wIGVkZ2Ugb2YgdGhlIG1hcC5cbiAgICAgICAgICAgIGR5ICs9IGJ1ZmZlcjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeSBpcyBncmVhdGVyIHRoYW4gemVybyB0aGFuIGl0IGRvZXMgbm90IG92ZXJsYXAuXG4gICAgICAgICAgICBkeSA9IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGR4IDwgYnVmZmVyKSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIGxlZnQgc2lkZSBvZiBtYXAuXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXG4gICAgICAgICAgICBkeCAqPSAtMTtcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIGxlZnQgZWRnZSBvZiB0aGUgbWFwLlxuICAgICAgICAgICAgZHggKz0gYnVmZmVyO1xuICAgICAgICAgIH0gZWxzZSB7IC8vIENoZWNrIHRvIHNlZSBpZiBvdmVybGFwcGluZyB3aXRoIHJpZ2h0IHNpZGUgb2YgbWFwLlxuICAgICAgICAgICAgZHggPSBtYXBzLmdldFdpZHRoKCkgLSBpbmZvYm94TG9jYXRpb24ueCArIGluZm9ib3hBbmNob3IueCAtIHRoYXQuaW5mb2JveC5nZXRXaWR0aCgpO1xuICAgICAgICAgICAgLy8gIyMjIyBJZiBkeCBpcyBncmVhdGVyIHRoYW4gemVybyB0aGVuIGl0IGRvZXMgbm90IG92ZXJsYXAuXG4gICAgICAgICAgICBpZiAoZHggPiBidWZmZXIpIHtcbiAgICAgICAgICAgICAgZHggPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgbWFwLlxuICAgICAgICAgICAgICBkeCAtPSBidWZmZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gIyMjIyBBZGp1c3QgdGhlIG1hcCBzbyBpbmZvYm94IGlzIGluIHZpZXdcbiAgICAgICAgICBpZiAoZHggIT0gMCB8fCBkeSAhPSAwKSB7XG4gICAgICAgICAgICBtYXBzLnNldFZpZXcoe1xuICAgICAgICAgICAgICBjZW50ZXJPZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludChkeCwgZHkpLFxuICAgICAgICAgICAgICBjZW50ZXI6IG1hcHMuZ2V0Q2VudGVyKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XG4gICAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoaXMubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcblxuICAgICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhpcy5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxuICAgICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XG5cbiAgICAgICAgICAgIGlmICh0ZWNobmljaWFuRGV0YWlscyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhblBob25lID0gdGVjaG5pY2lhbkRldGFpbHMucGhvbmU7XG4gICAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbk5hbWUgPSB0ZWNobmljaWFuRGV0YWlscy5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcih0aGlzLmluZm9ib3gsICdjbGljaycsIHZpZXdUcnVja0RldGFpbHMpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKE5ld1BpbiwgJ21vdXNlb3ZlcicsIChlKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbmZvYm94LnNldE9wdGlvbnMoe1xuICAgICAgICAgICAgc2hvd1BvaW50ZXI6IHRydWUsXG4gICAgICAgICAgICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICBzaG93Q2xvc2VCdXR0b246IHRydWUsXG4gICAgICAgICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCAyMCksXG4gICAgICAgICAgICBodG1sQ29udGVudDogJzxkaXYgY2xhc3MgPSBcImluZnkgaW5meU1hcHBvcHVwXCI+J1xuICAgICAgICAgICAgICArIGdldEluZm9Cb3hIVE1MKGUudGFyZ2V0Lm1ldGFkYXRhLCB0aGlzLnRocmVzaG9sZFZhbHVlLCBqb2JJZFVybCkgKyAnPC9kaXY+J1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy50cnVja1dhdGNoTGlzdCA9IFt7IFRydWNrSWQ6IGUudGFyZ2V0Lm1ldGFkYXRhLnRydWNrSWQsIERpc3RhbmNlOiBlLnRhcmdldC5tZXRhZGF0YS5EaXN0YW5jZSB9XTtcblxuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJywgZS50YXJnZXQubWV0YWRhdGEpO1xuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja0RldGFpbHMnLCBlLnRhcmdldC5tZXRhZGF0YSk7XG5cbiAgICAgICAgICAvLyBBIGJ1ZmZlciBsaW1pdCB0byB1c2UgdG8gc3BlY2lmeSB0aGUgaW5mb2JveCBtdXN0IGJlIGF3YXkgZnJvbSB0aGUgZWRnZXMgb2YgdGhlIG1hcC5cblxuICAgICAgICAgIHZhciBidWZmZXIgPSAzMDtcbiAgICAgICAgICB2YXIgaW5mb2JveE9mZnNldCA9IHRoYXQuaW5mb2JveC5nZXRPZmZzZXQoKTtcbiAgICAgICAgICB2YXIgaW5mb2JveEFuY2hvciA9IHRoYXQuaW5mb2JveC5nZXRBbmNob3IoKTtcbiAgICAgICAgICB2YXIgaW5mb2JveExvY2F0aW9uID0gbWFwcy50cnlMb2NhdGlvblRvUGl4ZWwoZS50YXJnZXQuZ2V0TG9jYXRpb24oKSwgTWljcm9zb2Z0Lk1hcHMuUGl4ZWxSZWZlcmVuY2UuY29udHJvbCk7XG4gICAgICAgICAgdmFyIGR4ID0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94T2Zmc2V0LnggLSBpbmZvYm94QW5jaG9yLng7XG4gICAgICAgICAgdmFyIGR5ID0gaW5mb2JveExvY2F0aW9uLnkgLSAyNSAtIGluZm9ib3hBbmNob3IueTtcblxuICAgICAgICAgIGlmIChkeSA8IGJ1ZmZlcikgeyAvLyBJbmZvYm94IG92ZXJsYXBzIHdpdGggdG9wIG9mIG1hcC5cbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cbiAgICAgICAgICAgIGR5ICo9IC0xO1xuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYnVmZmVyIGZyb20gdGhlIHRvcCBlZGdlIG9mIHRoZSBtYXAuXG4gICAgICAgICAgICBkeSArPSBidWZmZXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHkgaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhhbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxuICAgICAgICAgICAgZHkgPSAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkeCA8IGJ1ZmZlcikgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCBsZWZ0IHNpZGUgb2YgbWFwLlxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxuICAgICAgICAgICAgZHggKj0gLTE7XG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIG1hcC5cbiAgICAgICAgICAgIGR4ICs9IGJ1ZmZlcjtcbiAgICAgICAgICB9IGVsc2UgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCByaWdodCBzaWRlIG9mIG1hcC5cbiAgICAgICAgICAgIGR4ID0gbWFwcy5nZXRXaWR0aCgpIC0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94QW5jaG9yLnggLSB0aGF0LmluZm9ib3guZ2V0V2lkdGgoKTtcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHggaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhlbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxuICAgICAgICAgICAgaWYgKGR4ID4gYnVmZmVyKSB7XG4gICAgICAgICAgICAgIGR4ID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIG1hcC5cbiAgICAgICAgICAgICAgZHggLT0gYnVmZmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vICMjIyMgQWRqdXN0IHRoZSBtYXAgc28gaW5mb2JveCBpcyBpbiB2aWV3XG4gICAgICAgICAgaWYgKGR4ICE9IDAgfHwgZHkgIT0gMCkge1xuICAgICAgICAgICAgbWFwcy5zZXRWaWV3KHtcbiAgICAgICAgICAgICAgY2VudGVyT2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoZHgsIGR5KSxcbiAgICAgICAgICAgICAgY2VudGVyOiBtYXBzLmdldENlbnRlcigpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGlzLm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XG5cbiAgICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcbiAgICAgICAgICAgICAgeCA9PiB4LmF0dHVpZC50b0xvd2VyQ2FzZSgpID09IHNlbGVjdGVkVHJ1Y2suQVRUVUlELnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5pbmZvYm94LCAnY2xpY2snLCB2aWV3VHJ1Y2tEZXRhaWxzKTtcblxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIobWFwcywgJ3ZpZXdjaGFuZ2UnLCBtYXBWaWV3Q2hhbmdlZCk7XG5cbiAgICAgIC8vIHRoaXMuQ2hhbmdlVHJ1Y2tEaXJlY3Rpb24odGhpcywgTmV3UGluLCBkZXN0TG9jLCB0cnVja1VybCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFwVmlld0NoYW5nZWQoZSkge1xuICAgICAgdGhhdC5sYXN0Wm9vbUxldmVsID0gbWFwcy5nZXRab29tKCk7XG4gICAgICB0aGF0Lmxhc3RMb2NhdGlvbiA9IG1hcHMuZ2V0Q2VudGVyKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1vdXNld2hlZWxDaGFuZ2VkKGUpIHtcbiAgICAgIHRoYXQubGFzdFpvb21MZXZlbCA9IG1hcHMuZ2V0Wm9vbSgpO1xuICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSBtYXBzLmdldENlbnRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEluZm9Cb3hIVE1MKGRhdGE6IGFueSwgdFZhbHVlLCBqb2JJZCk6IFN0cmluZyB7XG5cbiAgICAgIGlmICghZGF0YS5TcGVlZCkge1xuICAgICAgICBkYXRhLlNwZWVkID0gMDtcbiAgICAgIH1cblxuICAgICAgdmFyIGNsYXNzTmFtZSA9IFwiXCI7XG4gICAgICB2YXIgc3R5bGVMZWZ0ID0gXCJcIjtcbiAgICAgIHZhciByZWFzb24gPSAnJztcbiAgICAgIGlmIChkYXRhLnRydWNrU3RhdHVzICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoZGF0YS50cnVja1N0YXR1cy50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICdyZWQnKSB7XG4gICAgICAgICAgcmVhc29uID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tdG9wOjNweDtjb2xvcjpyZWQ7Jz5SZWFzb246IEN1bXVsYXRpdmUgaWRsZSB0aW1lIGlzIGJleW9uZCBcIiArIHRWYWx1ZSArIFwiIG1pbnM8L2Rpdj5cIjtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLnRydWNrU3RhdHVzLnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3B1cnBsZScpIHtcbiAgICAgICAgICByZWFzb24gPSBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi10b3A6M3B4O2NvbG9yOnB1cnBsZTsnPlJlYXNvbjogVHJ1Y2sgaXMgZHJpdmVuIGdyZWF0ZXIgdGhhbiA3NSBtL2g8L2Rpdj5cIjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgaW5mb2JveERhdGEgPSAnJztcblxuICAgICAgZGF0YS5jdXN0b21lck5hbWUgPSBkYXRhLmN1c3RvbWVyTmFtZSA9PSB1bmRlZmluZWQgfHwgZGF0YS5jdXN0b21lck5hbWUgPT0gbnVsbCA/ICcnIDogZGF0YS5jdXN0b21lck5hbWU7XG5cbiAgICAgIGRhdGEuZGlzcGF0Y2hUaW1lID0gZGF0YS5kaXNwYXRjaFRpbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEuZGlzcGF0Y2hUaW1lID09IG51bGwgPyAnJyA6IGRhdGEuZGlzcGF0Y2hUaW1lO1xuXG4gICAgICBkYXRhLmpvYklkID0gZGF0YS5qb2JJZCA9PSB1bmRlZmluZWQgfHwgZGF0YS5qb2JJZCA9PSBudWxsID8gJycgOiBkYXRhLmpvYklkO1xuXG4gICAgICBkYXRhLndvcmtBZGRyZXNzID0gZGF0YS53b3JrQWRkcmVzcyA9PSB1bmRlZmluZWQgfHwgZGF0YS53b3JrQWRkcmVzcyA9PSBudWxsID8gJycgOiBkYXRhLndvcmtBZGRyZXNzO1xuXG4gICAgICBkYXRhLnNiY1ZpbiA9IGRhdGEuc2JjVmluID09IHVuZGVmaW5lZCB8fCBkYXRhLnNiY1ZpbiA9PSBudWxsIHx8IGRhdGEuc2JjVmluID09ICcnID8gJycgOiBkYXRhLnNiY1ZpbjtcblxuICAgICAgZGF0YS50ZWNobmljaWFuTmFtZSA9IGRhdGEudGVjaG5pY2lhbk5hbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEudGVjaG5pY2lhbk5hbWUgPT0gbnVsbCB8fCBkYXRhLnRlY2huaWNpYW5OYW1lID09ICcnID8gJycgOiBkYXRhLnRlY2huaWNpYW5OYW1lO1xuXG4gICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPCAxMDI0KSB7XG4gICAgICAgIGluZm9ib3hEYXRhID0gXCI8ZGl2IGNsYXNzPSdwb3BNb2RhbENvbnRhaW5lcic+PGRpdiBjbGFzcz0ncG9wTW9kYWxIZWFkZXInPjxpbWcgc3JjPSdcIiArIGRhdGEuaWNvbkluZm8gKyBcIicgPjxhIGNsYXNzPSdkZXRhaWxzJyB0aXRsZT0nQ2xpY2sgaGVyZSB0byBzZWUgdGVjaG5pY2lhbiBkZXRhaWxzJyA+VmlldyBEZXRhaWxzPC9hPjxpIGNsYXNzPSdmYSBmYS10aW1lcycgYXJpYS1oaWRkZW49J3RydWUnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPjwvaT48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8aHIvPjxkaXYgY2xhc3M9J3BvcE1vZGFsQm9keSc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5WZWhpY2xlIE51bWJlciA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLnNiY1ZpbiArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPlZUUyBVbml0IElEIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEudHJ1Y2tJZCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Sm9iIFR5cGUgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5qb2JUeXBlICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Sm9iIElkIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGpvYklkICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5BVFRVSUQgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5BVFRVSUQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5UZWNobmljaWFuIE5hbWUgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS50ZWNobmljaWFuTmFtZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+Q3VzdG9tZXIgTmFtZSA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmN1c3RvbWVyTmFtZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkRpc3BhdGNoIFRpbWU6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLmRpc3BhdGNoVGltZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTEyJz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wtMTIgY29sLXNtLTEyIGNvbC1mb3JtLWxhYmVsJz5Kb2IgQWRkcmVzcyA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wtMTIgY29sLXNtLTEyJz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwgY29sLWZvcm0tbGFiZWwtZnVsbCc+XCIgKyBkYXRhLndvcmtBZGRyZXNzICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IG1ldGVyQ2FsJz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyBkYXRhLlNwZWVkICsgXCI8L3N0cm9uZz4gbXBoIDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPlNwZWVkPC9zcGFuPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC0xMiBjb2wtbWQtNCc+PHN0cm9uZz5cIiArIGRhdGEuRVRBICsgXCI8L3N0cm9uZz4gTWlucyA8c3BhbiBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5DdW11bGF0aXZlIElkbGUgTWludXRlczwvc3Bhbj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyB0aGF0LmNvbnZlcnRNaWxlc1RvRmVldChkYXRhLkRpc3RhbmNlKSArIFwiPC9zdHJvbmc+IEZ0IDxzcGFuIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkZlZXQgdG8gSm9iIFNpdGU8L3NwYW4+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+IDxoci8+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncG9wTW9kYWxGb290ZXInPjxkaXYgY2xhc3M9J3Jvdyc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtY29tbWVudGluZyc+PC9pPjxzcGFuIGNsYXNzPSdzbXMnIHRpdGxlPSdDbGljayB0byBzZW5kIFNNUycgPlNNUzwvcD48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wgY29sLW1kLTQnPjxpIGNsYXNzPSdmYSBmYS1lbnZlbG9wZScgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48c3BhbiBjbGFzcz0nZW1haWwnIHRpdGxlPSdDbGljayB0byBzZW5kIGVtYWlsJyA+RW1haWw8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtZXllJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxzcGFuIGNsYXNzPSd3YXRjaGxpc3QnIHRpdGxlPSdDbGljayB0byBhZGQgaW4gd2F0Y2hsaXN0JyA+V2F0Y2g8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+IDwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmZvYm94RGF0YSA9IFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0ncGFkZGluZy10b3A6MTBweDttYXJnaW46IDBweDsnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC0zJz48ZGl2IHN0eWxlPSdwYWRkaW5nLXRvcDoxNXB4OycgPjxpbWcgc3JjPSdcIiArIGRhdGEuaWNvbkluZm8gKyBcIicgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrO21hcmdpbjogMCBhdXRvOycgPjwvZGl2PjwvZGl2PlwiICtcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J2NvbC1tZC05Jz5cIiArXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cgJz5cIiArXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtOCcgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5WZWhpY2xlIE51bWJlcjwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLnNiY1ZpbiArIFwiPC9kaXY+XCIgK1xuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTQnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxhIGNsYXNzPSdkZXRhaWxzJyBzdHlsZT0nY29sb3I6IzAwOUZEQjtjdXJzb3I6IHBvaW50ZXI7JyAgdGl0bGU9J0NsaWNrIGhlcmUgdG8gc2VlIHRlY2huaWNpYW4gZGV0YWlscycgPlZpZXcgRGV0YWlsczwvYT48aSBjbGFzcz0nZmEgZmEtdGltZXMnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MTVweDtjdXJzb3I6IHBvaW50ZXI7JyBhcmlhLWhpZGRlbj0ndHJ1ZScgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+PC9pPjwvZGl2PlwiICtcbiAgICAgICAgICBcIjwvZGl2PlwiICtcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J3Jvdyc+PGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPlZUUyBVbml0IElEPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEudHJ1Y2tJZCArIFwiPC9kaXY+PC9kaXY+XCIgK1xuICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncm93Jz48ZGl2IGNsYXNzPSdjb2wtbWQtNScgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5Kb2IgVHlwZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmpvYlR5cGUgKyBcIjwvZGl2PjxkaXYgY2xhc3M9J2NvbC1tZC03JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnID5Kb2IgSWQ8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgam9iSWQgKyBcIjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyByZWFzb24gKyBcIjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4Oyc+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5BVFRVSUQ8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5BVFRVSUQgKyBcIjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkO21hcmdpbi1sZWZ0OjhweDsnPlRlY2huaWNpYW4gTmFtZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLnRlY2huaWNpYW5OYW1lICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnID5cIlxuICAgICAgICAgICsgXCI8ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+Q3VzdG9tZXIgTmFtZTwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLmN1c3RvbWVyTmFtZSArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7JyA+XCJcbiAgICAgICAgICArIFwiPGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkRpc3BhdGNoIFRpbWU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5kaXNwYXRjaFRpbWUgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4OycgPlwiXG4gICAgICAgICAgKyBcIjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5Kb2IgQWRkcmVzczwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLndvcmtBZGRyZXNzICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8aHIgc3R5bGU9J21hcmdpbi10b3A6MXB4OyBtYXJnaW4tYm90dG9tOjVweDsnIC8+XCJcblxuICAgICAgICAgICsgXCI8ZGl2IHN0eWxlPSdtYXJnaW4tbGVmdDogMTBweDsnPiA8ZGl2IGNsYXNzPSdyb3cnPiA8ZGl2IGNsYXNzPSdzcGVlZCBjb2wtbWQtMyc+IDxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi1sZWZ0OiAxcHgnPjxwIHN0eWxlPSdmb250LXdlaWdodDogYm9sZGVyO2ZvbnQtc2l6ZTogMjNweDttYXJnaW46IDBweDsnPlwiICsgZGF0YS5TcGVlZCArIFwiPC9wPjxwIHN0eWxlPSdtYXJnaW46IDEwcHggMTBweDsnPm1waDwvcD48L2Rpdj48cCBzdHlsZT0nbWFyZ2luOjBweCcgY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+U3BlZWQ8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naWRsZSBjb2wtbWQtNSc+PGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHgnPjxwIHN0eWxlPSdmb250LXdlaWdodDogYm9sZGVyO2ZvbnQtc2l6ZTogMjNweDttYXJnaW46IDBweDsnPlwiICsgZGF0YS5FVEEgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5NaW5zPC9wPjwvZGl2PjxwIHN0eWxlPSdtYXJnaW46MHB4JyBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5DdW11bGF0aXZlIElkbGUgTWludXRlczwvcD48L2Rpdj4gPGRpdiBjbGFzcz0nbWlsZXMgY29sLW1kLTQnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIHRoYXQuY29udmVydE1pbGVzVG9GZWV0KGRhdGEuRGlzdGFuY2UpICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+RnQ8L3A+PC9kaXY+PHAgc3R5bGU9J21hcmdpbjowcHgnIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPkZlZXQgdG8gSm9iIFNpdGU8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+PC9kaXY+PGhyIHN0eWxlPSdtYXJnaW4tdG9wOjFweDsgbWFyZ2luLWJvdHRvbTo1cHg7JyAvPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J2N1cnNvcjogcG9pbnRlcic+IDxkaXYgY2xhc3M9J2NvbC1tZC0xJz48L2Rpdj48ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnIHN0eWxlPSdcIiArIGNsYXNzTmFtZSArIFwiJz4gPGkgY2xhc3M9J2ZhIGZhLWNvbW1lbnRpbmcgY29sLW1kLTInPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgc21zJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBTTVMnID5TTVM8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zIG9mZnNldC1tZC0xJyBzdHlsZT0nXCIgKyBjbGFzc05hbWUgKyBcIic+IDxpIGNsYXNzPSdmYSBmYS1lbnZlbG9wZSBjb2wtbWQtMicgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgZW1haWwnIHRpdGxlPSdDbGljayB0byBzZW5kIGVtYWlsJyA+RW1haWw8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zJz48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cgY29sLW1kLTMnIHN0eWxlPSdcIiArIHN0eWxlTGVmdCArIFwiJz48aSBjbGFzcz0nZmEgZmEtZXllIGNvbC1tZC0yJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjxwIGNsYXNzPSdjb2wtbWQtNiB3YXRjaGxpc3QnIHRpdGxlPSdDbGljayB0byBhZGQgaW4gd2F0Y2hsaXN0JyA+V2F0Y2g8L3A+PC9kaXY+IDwvZGl2PlwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW5mb2JveERhdGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmlld1RydWNrRGV0YWlscyhlKSB7XG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdmYSBmYS10aW1lcycpIHtcbiAgICAgICAgdGhhdC5pbmZvYm94LnNldE9wdGlvbnMoe1xuICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnZGV0YWlscycpIHtcbiAgICAgICAgLy90aGF0LnJvdXRlci5uYXZpZ2F0ZShbJy90ZWNobmljaWFuLWRldGFpbHMnXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2NvbC1tZC02IHNtcycpIHtcbiAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcbiAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoYXQubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGF0LnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXG4gICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XG5cbiAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhblBob25lID0gdGVjaG5pY2lhbkRldGFpbHMucGhvbmU7XG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbFNNUycpLm1vZGFsKCdzaG93Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2NvbC1tZC02IGVtYWlsJykge1xuICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xuICAgICAgICBzZWxlY3RlZFRydWNrID0gdGhhdC5tYXBTZXJ2aWNlLnJldHJpZXZlRGF0YUZyb21TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycpO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcbiAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoYXQucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcbiAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcblxuICAgICAgICAgIGlmICh0ZWNobmljaWFuRGV0YWlscyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbk5hbWUgPSB0ZWNobmljaWFuRGV0YWlscy5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBqUXVlcnkoJyNteU1vZGFsRW1haWwnKS5tb2RhbCgnc2hvdycpO1xuICAgICAgfVxuICAgICBcbiAgICB9XG4gIH1cblxuICBsb2FkRGlyZWN0aW9ucyh0aGF0LCBzdGFydExvYywgZW5kTG9jLCBpbmRleCwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCkge1xuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMnLCAoKSA9PiB7XG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuRGlyZWN0aW9uc01hbmFnZXIodGhhdC5tYXApO1xuICAgICAgLy8gU2V0IFJvdXRlIE1vZGUgdG8gZHJpdmluZ1xuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5zZXRSZXF1ZXN0T3B0aW9ucyh7XG4gICAgICAgIHJvdXRlTW9kZTogTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5Sb3V0ZU1vZGUuZHJpdmluZ1xuICAgICAgfSk7XG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLnNldFJlbmRlck9wdGlvbnMoe1xuICAgICAgICBkcml2aW5nUG9seWxpbmVPcHRpb25zOiB7XG4gICAgICAgICAgc3Ryb2tlQ29sb3I6ICdncmVlbicsXG4gICAgICAgICAgc3Ryb2tlVGhpY2tuZXNzOiAzLFxuICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHdheXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UgfSxcbiAgICAgICAgdmlhcG9pbnRQdXNocGluT3B0aW9uczogeyB2aXNpYmxlOiBmYWxzZSB9LFxuICAgICAgICBhdXRvVXBkYXRlTWFwVmlldzogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB3YXlwb2ludDEgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5XYXlwb2ludCh7XG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oc3RhcnRMb2MubGF0aXR1ZGUsIHN0YXJ0TG9jLmxvbmdpdHVkZSksIGljb246ICcnXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHdheXBvaW50MiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLldheXBvaW50KHtcbiAgICAgICAgbG9jYXRpb246IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihlbmRMb2MubGF0aXR1ZGUsIGVuZExvYy5sb25naXR1ZGUpXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuYWRkV2F5cG9pbnQod2F5cG9pbnQxKTtcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuYWRkV2F5cG9pbnQod2F5cG9pbnQyKTtcblxuICAgICAgLy8gQWRkIGV2ZW50IGhhbmRsZXIgdG8gZGlyZWN0aW9ucyBtYW5hZ2VyLlxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5kaXJlY3Rpb25zTWFuYWdlciwgJ2RpcmVjdGlvbnNVcGRhdGVkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB2YXIgcm91dGVJbmRleCA9IGUucm91dGVbMF0ucm91dGVMZWdzWzBdLm9yaWdpbmFsUm91dGVJbmRleDtcbiAgICAgICAgdmFyIG5leHRJbmRleCA9IHJvdXRlSW5kZXg7XG4gICAgICAgIGlmIChlLnJvdXRlWzBdLnJvdXRlUGF0aC5sZW5ndGggPiByb3V0ZUluZGV4KSB7XG4gICAgICAgICAgbmV4dEluZGV4ID0gcm91dGVJbmRleCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5leHRMb2NhdGlvbiA9IGUucm91dGVbMF0ucm91dGVQYXRoW25leHRJbmRleF07XG4gICAgICAgIHZhciBwaW4gPSB0aGF0Lm1hcC5lbnRpdGllcy5nZXQoaW5kZXgpO1xuICAgICAgICAvLyB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhzdGFydExvYyxuZXh0TG9jYXRpb24pO1xuICAgICAgICB0aGF0Lk1vdmVQaW5PbkRpcmVjdGlvbih0aGF0LCBlLnJvdXRlWzBdLnJvdXRlUGF0aCwgcGluLCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLmNhbGN1bGF0ZURpcmVjdGlvbnMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIE1vdmVQaW5PbkRpcmVjdGlvbih0aGF0LCByb3V0ZVBhdGgsIHBpbiwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCkge1xuICAgIHRoYXQgPSB0aGlzO1xuICAgIHZhciBpc0dlb2Rlc2ljID0gZmFsc2U7XG4gICAgdGhhdC5jdXJyZW50QW5pbWF0aW9uID0gbmV3IEJpbmcuTWFwcy5BbmltYXRpb25zLlBhdGhBbmltYXRpb24ocm91dGVQYXRoLCBmdW5jdGlvbiAoY29vcmQsIGlkeCwgZnJhbWVJZHgsIHJvdGF0aW9uQW5nbGUsIGxvY2F0aW9ucywgdHJ1Y2tJZFJhbklkKSB7XG5cbiAgICAgIGlmICh0aGF0LmFuaW1hdGlvblRydWNrTGlzdC5sZW5ndGggPiAwICYmIHRoYXQuYW5pbWF0aW9uVHJ1Y2tMaXN0LnNvbWUoeCA9PiB4ID09IHRydWNrSWRSYW5JZCkpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gKGZyYW1lSWR4ID09IGxvY2F0aW9ucy5sZW5ndGggLSAxKSA/IGZyYW1lSWR4IDogZnJhbWVJZHggKyAxO1xuICAgICAgICB2YXIgcm90YXRpb25BbmdsZSA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhjb29yZCwgbG9jYXRpb25zW2luZGV4XSk7XG4gICAgICAgIGlmICh0aGF0LmlzT2RkKGZyYW1lSWR4KSkge1xuICAgICAgICAgIHRoYXQuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwaW4sIHRydWNrVXJsLCByb3RhdGlvbkFuZ2xlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmcmFtZUlkeCA9PSBsb2NhdGlvbnMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIHRoYXQuY3JlYXRlUm90YXRlZEltYWdlUHVzaHBpbihwaW4sIHRydWNrVXJsLCByb3RhdGlvbkFuZ2xlKTtcbiAgICAgICAgfVxuICAgICAgICBwaW4uc2V0TG9jYXRpb24oY29vcmQpO1xuICAgICAgfVxuXG4gICAgfSwgaXNHZW9kZXNpYywgdGhhdC50cmF2YWxEdXJhdGlvbiwgdHJ1Y2tJZFJhbklkKTtcblxuICAgIHRoYXQuY3VycmVudEFuaW1hdGlvbi5wbGF5KCk7XG4gIH1cblxuICBDYWxjdWxhdGVOZXh0Q29vcmQoc3RhcnRMb2NhdGlvbiwgZW5kTG9jYXRpb24pIHtcbiAgICB0cnkge1xuXG4gICAgICB2YXIgZGxhdCA9IChlbmRMb2NhdGlvbi5sYXRpdHVkZSAtIHN0YXJ0TG9jYXRpb24ubGF0aXR1ZGUpO1xuICAgICAgdmFyIGRsb24gPSAoZW5kTG9jYXRpb24ubG9uZ2l0dWRlIC0gc3RhcnRMb2NhdGlvbi5sb25naXR1ZGUpO1xuICAgICAgdmFyIGFscGhhID0gTWF0aC5hdGFuMihkbGF0ICogTWF0aC5QSSAvIDE4MCwgZGxvbiAqIE1hdGguUEkgLyAxODApO1xuICAgICAgdmFyIGR4ID0gMC4wMDAxNTIzODc5NDcyNzkwOTkzMTtcbiAgICAgIGRsYXQgPSBkeCAqIE1hdGguc2luKGFscGhhKTtcbiAgICAgIGRsb24gPSBkeCAqIE1hdGguY29zKGFscGhhKTtcbiAgICAgIHZhciBuZXh0Q29vcmQgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oc3RhcnRMb2NhdGlvbi5sYXRpdHVkZSArIGRsYXQsIHN0YXJ0TG9jYXRpb24ubG9uZ2l0dWRlICsgZGxvbik7XG5cbiAgICAgIGRsYXQgPSBudWxsO1xuICAgICAgZGxvbiA9IG51bGw7XG4gICAgICBhbHBoYSA9IG51bGw7XG4gICAgICBkeCA9IG51bGw7XG5cbiAgICAgIHJldHVybiBuZXh0Q29vcmQ7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBpbiBDYWxjdWxhdGVOZXh0Q29vcmQgLSAnICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGlzT2RkKG51bSkge1xuICAgIHJldHVybiBudW0gJSAyO1xuICB9XG5cbiAgZGVnVG9SYWQoeCkge1xuICAgIHJldHVybiB4ICogTWF0aC5QSSAvIDE4MDtcbiAgfVxuXG4gIHJhZFRvRGVnKHgpIHtcbiAgICByZXR1cm4geCAqIDE4MCAvIE1hdGguUEk7XG4gIH1cblxuICBjYWxjdWxhdGVCZWFyaW5nKG9yaWdpbiwgZGVzdCkge1xuICAgIC8vLyA8c3VtbWFyeT5DYWxjdWxhdGVzIHRoZSBiZWFyaW5nIGJldHdlZW4gdHdvIGxvYWNhdGlvbnMuPC9zdW1tYXJ5PlxuICAgIC8vLyA8cGFyYW0gbmFtZT1cIm9yaWdpblwiIHR5cGU9XCJNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvblwiPkluaXRpYWwgbG9jYXRpb24uPC9wYXJhbT5cbiAgICAvLy8gPHBhcmFtIG5hbWU9XCJkZXN0XCIgdHlwZT1cIk1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uXCI+U2Vjb25kIGxvY2F0aW9uLjwvcGFyYW0+XG4gICAgdHJ5IHtcbiAgICAgIHZhciBsYXQxID0gdGhpcy5kZWdUb1JhZChvcmlnaW4ubGF0aXR1ZGUpO1xuICAgICAgdmFyIGxvbjEgPSBvcmlnaW4ubG9uZ2l0dWRlO1xuICAgICAgdmFyIGxhdDIgPSB0aGlzLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpO1xuICAgICAgdmFyIGxvbjIgPSBkZXN0LmxvbmdpdHVkZTtcbiAgICAgIHZhciBkTG9uID0gdGhpcy5kZWdUb1JhZChsb24yIC0gbG9uMSk7XG4gICAgICB2YXIgeSA9IE1hdGguc2luKGRMb24pICogTWF0aC5jb3MobGF0Mik7XG4gICAgICB2YXIgeCA9IE1hdGguY29zKGxhdDEpICogTWF0aC5zaW4obGF0MikgLSBNYXRoLnNpbihsYXQxKSAqIE1hdGguY29zKGxhdDIpICogTWF0aC5jb3MoZExvbik7XG5cbiAgICAgIGxhdDEgPSBsYXQyID0gbG9uMSA9IGxvbjIgPSBkTG9uID0gbnVsbDtcblxuICAgICAgcmV0dXJuICh0aGlzLnJhZFRvRGVnKE1hdGguYXRhbjIoeSwgeCkpICsgMzYwKSAlIDM2MDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIGNhbGN1bGF0ZUJlYXJpbmcgLSAnICsgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIFNlbmRTTVMoZm9ybSkge1xuICAgIC8vIGlmKHRoaXMudGVjaG5pY2lhblBob25lICE9ICcnKXtcbiAgICBpZiAoZm9ybS52YWx1ZS5tb2JpbGVObyAhPSAnJykge1xuICAgICAgaWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZSB3YW50IHRvIHNlbmQgU01TPycpKSB7XG4gICAgICAgIC8vIHRoaXMubWFwU2VydmljZS5zZW5kU01TKHRoaXMudGVjaG5pY2lhblBob25lLGZvcm0udmFsdWUuc21zTWVzc2FnZSk7XG4gICAgICAgIHRoaXMubWFwU2VydmljZS5zZW5kU01TKGZvcm0udmFsdWUubW9iaWxlTm8sIGZvcm0udmFsdWUuc21zTWVzc2FnZSk7XG5cbiAgICAgICAgZm9ybS5jb250cm9scy5zbXNNZXNzYWdlLnJlc2V0KClcbiAgICAgICAgZm9ybS52YWx1ZS5tb2JpbGVObyA9IHRoaXMudGVjaG5pY2lhblBob25lO1xuICAgICAgICBqUXVlcnkoJyNteU1vZGFsU01TJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgLy90aGlzLnRvYXN0ci5zdWNjZXNzKCdTTVMgc2VudCBzdWNjZXNzZnVsbHknLCAnU3VjY2VzcycpO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgU2VuZEVtYWlsKGZvcm0pIHtcbiAgICAvLyBpZih0aGlzLnRlY2huaWNpYW5FbWFpbCAhPSAnJyl7XG4gICAgaWYgKGZvcm0udmFsdWUuZW1haWxJZCAhPSAnJykge1xuICAgICAgaWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZSB3YW50IHRvIHNlbmQgRW1haWw/JykpIHtcblxuICAgICAgICAvLyB0aGlzLnVzZXJQcm9maWxlU2VydmljZS5nZXRVc2VyRGF0YSh0aGlzLmNvb2tpZUFUVFVJRClcbiAgICAgICAgLy8gICAuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICAgIC8vICAgICB2YXIgbmV3RGF0YTogYW55ID0gdGhpcy5zdHJpbmdpZnlKc29uKGRhdGEpO1xuICAgICAgICAvLyAgICAgLy90aGlzLm1hcFNlcnZpY2Uuc2VuZEVtYWlsKG5ld0RhdGEuZW1haWwsdGhpcy50ZWNobmljaWFuRW1haWwsbmV3RGF0YS5sYXN0TmFtZSArICcgJyArIG5ld0RhdGEuZmlyc3ROYW1lLCB0aGlzLnRlY2huaWNpYW5OYW1lLCBmb3JtLnZhbHVlLmVtYWlsU3ViamVjdCxmb3JtLnZhbHVlLmVtYWlsTWVzc2FnZSk7XG4gICAgICAgIC8vICAgICB0aGlzLm1hcFNlcnZpY2Uuc2VuZEVtYWlsKG5ld0RhdGEuZW1haWwsIGZvcm0udmFsdWUuZW1haWxJZCwgbmV3RGF0YS5sYXN0TmFtZSArICcgJyArIG5ld0RhdGEuZmlyc3ROYW1lLCB0aGlzLnRlY2huaWNpYW5OYW1lLCBmb3JtLnZhbHVlLmVtYWlsU3ViamVjdCwgZm9ybS52YWx1ZS5lbWFpbE1lc3NhZ2UpO1xuICAgICAgICAvLyAgICAgdGhpcy50b2FzdHIuc3VjY2VzcyhcIkVtYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5XCIsICdTdWNjZXNzJyk7XG5cbiAgICAgICAgLy8gICAgIGZvcm0uY29udHJvbHMuZW1haWxTdWJqZWN0LnJlc2V0KClcbiAgICAgICAgLy8gICAgIGZvcm0uY29udHJvbHMuZW1haWxNZXNzYWdlLnJlc2V0KClcbiAgICAgICAgLy8gICAgIGZvcm0udmFsdWUuZW1haWxJZCA9IHRoaXMudGVjaG5pY2lhbkVtYWlsO1xuICAgICAgICAvLyAgICAgalF1ZXJ5KCcjbXlNb2RhbEVtYWlsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgLy8gICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBTZWFyY2hUcnVjayhmb3JtKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICAvLyQoJyNsb2FkaW5nJykuc2hvdygpO1xuXG4gICAgaWYgKGZvcm0udmFsdWUuaW5wdXRtaWxlcyAhPSAnJyAmJiBmb3JtLnZhbHVlLmlucHV0bWlsZXMgIT0gbnVsbCkge1xuICAgICAgY29uc3QgbHQgPSB0aGF0LmNsaWNrZWRMYXQ7XG4gICAgICBjb25zdCBsZyA9IHRoYXQuY2xpY2tlZExvbmc7XG4gICAgICBjb25zdCByZCA9IGZvcm0udmFsdWUuaW5wdXRtaWxlcztcblxuICAgICAgdGhpcy5mb3VuZFRydWNrID0gZmFsc2U7XG4gICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdCA9IFtdO1xuXG4gICAgICBpZiAodGhpcy5jb25uZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9hZE1hcFZpZXcoJ3JvYWQnKTtcblxuICAgICAgdGhhdC5Mb2FkVHJ1Y2tzKHRoaXMubWFwLCBsdCwgbGcsIHJkLCB0cnVlKTtcblxuICAgICAgZm9ybS5jb250cm9scy5pbnB1dG1pbGVzLnJlc2V0KCk7XG4gICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgfSwgMTAwMDApO1xuICAgIH1cbiAgfVxuXG5cblxuICBnZXRNaWxlcyhpKSB7XG4gICAgcmV0dXJuIGkgKiAwLjAwMDYyMTM3MTE5MjtcbiAgfVxuXG4gIGdldE1ldGVycyhpKSB7XG4gICAgcmV0dXJuIGkgKiAxNjA5LjM0NDtcbiAgfVxuXG4gIHN0cmluZ2lmeUpzb24oZGF0YSkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgfVxuICBwYXJzZVRvSnNvbihkYXRhKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gIH1cblxuICBSb3VuZChudW1iZXIsIHByZWNpc2lvbikge1xuICAgIHZhciBmYWN0b3IgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKTtcbiAgICB2YXIgdGVtcE51bWJlciA9IG51bWJlciAqIGZhY3RvcjtcbiAgICB2YXIgcm91bmRlZFRlbXBOdW1iZXIgPSBNYXRoLnJvdW5kKHRlbXBOdW1iZXIpO1xuICAgIHJldHVybiByb3VuZGVkVGVtcE51bWJlciAvIGZhY3RvcjtcbiAgfVxuXG4gIGdldEF0YW4yKHksIHgpIHtcbiAgICByZXR1cm4gTWF0aC5hdGFuMih5LCB4KTtcbiAgfTtcblxuICBnZXRJY29uVXJsKGNvbG9yOiBzdHJpbmcsIHNvdXJjZUxhdDogbnVtYmVyLCBzb3VyY2VMb25nOiBudW1iZXIsIGRlc3RpbmF0aW9uTGF0OiBudW1iZXIsIGRlc3RpbmF0aW9uTG9uZzogbnVtYmVyKSB7XG4gICAgdmFyIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEzWkpSRUZVYUlIdGwxMUlVMkVZeC85dnVWcVFheGVCNnd2MEtzY0lGNEcwYnBvYVpuV3poVnBkVkVwMUVScm1wQ2h2TWdqckloVDZvS0JaNkVYVUF1ZU5hRkgwUVRTeHlBV1ZYUlF1UDFBdnN1M001bkhhbmk3Y2x1blp4OWxtQ0w2L3EzUE84L0tjLy85NXZ3RU9oOFBoY0RnY0RvZXpWR0dwU0VKRWFnQlZxY2dsZ1lzeDFod3BtSlpzZGlKU0J5andZY3ozYysyd1o4U2ZiTDY1YkZtdlV4T1JrVEZXTGhXWDNRUEJhdThFb0E5KzBrOU1pZnUyWGQycEVFUWhDYW5TV1BJcVlURldBRUFXWTh3MU55NnJCNGlvYWpydysxTGFzdVdyKzM3MGo0OVBlcWN6VkJsSzE5aDN0aERpQWNEaDZnWlFBUUNaQUJJM1FFVDNBSlJkZTNVYlZrY0xCRkZZRGN4VWFFZG1ib3JreWljdUF5SHhsclphMkhyc0N5eEpIc3RpTlZqTTRvRVlCaGE3ZUNDS0FTSXlZcEdMQjZMTWdjbHAvNW5YMzk1TTJYcnNpdjhwU0M0UkRheE1XN0czdmZkSlhFblNsZWtwRXpTWE5VcFYxSGpVVldqQVBSVHpCNExvaFU2VGpSSzlLYTcyY2luT01ZVWVuVkx4cEk4U3RoNDdTdlVtTkpvdko1c3FHdFdNTWJkVUlHa0RnaWlnOEpZWmhxelViMmFsZWpOSzlDWWdRdldCSkF6b05GcDhHdWtOdnp2NnVoTk5OUzlYQ0VNY083d3NBeXFsQ2cybWVoUnBDOExmR3A3ZlFNT0xtM0xTaERtMi9RaHE4aXFoQ2k0Q0RsYzNMUFphV1hOSmxvR21ROWV4U2IwUnh4K2Nna2NVb05Ob1VXT3N3SnBWS2x6b2tEY0hqaHVPb3E3b0hKcTZXdEQ1NVJrQW9NWllDVnQ1TTNiZjJvOTRENGNSRFlqVDRxaE9vODBJRFkwaTdTNFlNbk5oYU53VnJwQ2pyeHVEN2lGWUQxNkgxZEVpcTNJV1l3VWVPZHYrTVY3Y2R3UmQxYzlRdXRVTXE2TVpPZXQwVXdBVWtEaUZ4alNnVEZQZVBwdGZWZXVaOENnRzNFTW8zSnlQTHRmYmVTSTdlNThDQUFxekN5VEhzUlE2alJZcVpUcHN6dms3dk0xcHgrN3NmQkFSQ2pZYkZRQmVTdDBEWWhwZ2pOVVJrYnJSZkRsOFZSenhqdm9CckpqZFRoWGNhQzd1T1IrWCtObEliVktiMUJ0bWVucG1BcjhFWUpyWGFMYk9lSDVFUkhyTVhDanNkWjFYWUhYOHZhSTJtT3BSdXRVTUFHWUFrbXUxRk9PVHZnT0Q3c0VUKys4ZVhoNGE3enFORm85UHRvYUZSMXI3RTRhSXlvaUlQZzczMHAwM3pkVC9jNUNDbENXUVN5MkkzcS9DaEJCNCtMNlZPajQvSlNLaVFDRGdDUlpzWVNBaW96ZzEyZjdqMTVqVDU1KzRIenkxSnBwTFRVU25QYUwzbmMvdjZ5S2l1dUNkbThQaGNEaWNwY0VmazNlQUxiYzErVlFBQUFBQVNVVk9SSzVDWUlJPVwiO1xuXG4gICAgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJncmVlblwiKSB7XG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBM1pKUkVGVWFJSHRsMTFJVTJFWXgvOXZ1VnFRYXhlQjZ3djBLc2NJRjRHMGJwb2Fabld6aFZwZFZFcDFFUnJtcENodk1nanJJaFQ2b0tCWjZFWFVBdWVOYUZIMFFUU3h5QVdWWFJRdVAxQXZzdTNNNW5IYW5pN2NsdW5aeDlsbUNMNi9xM1BPOC9LYy8vOTV2d0VPaDhQaGNEZ2NEb2V6VkdHcFNFSkVhZ0JWcWNnbGdZc3gxaHdwbUpac2RpSlNCeWp3WWN6M2MrMndaOFNmYkw2NWJGbXZVeE9Sa1RGV0xoV1gzUVBCYXU4RW9BOSswazlNaWZ1MlhkMnBFRVFoQ2FuU1dQSXFZVEZXQUVBV1k4dzFOeTZyQjRpb2FqcncrMUxhc3VXciszNzBqNDlQZXFjelZCbEsxOWgzdGhEaUFjRGg2Z1pRQVFDWkFCSTNRRVQzQUpSZGUzVWJWa2NMQkZGWURjeFVhRWRtYm9ya3lpY3VBeUh4bHJaYTJIcnNDeXhKSHN0aU5Wak00b0VZQmhhN2VDQ0tBU0l5WXBHTEI2TE1nY2xwLzVuWDM5NU0yWHJzaXY4cFNDNFJEYXhNVzdHM3ZmZEpYRW5TbGVrcEV6U1hOVXBWMUhqVVZXakFQUlR6QjRMb2hVNlRqUks5S2E3MmNpbk9NWVVlblZMeHBJOFN0aDQ3U3ZVbU5Kb3ZKNXNxR3RXTU1iZFVJR2tEZ2lpZzhKWVpocXpVYjJhbGVqTks5Q1lnUXZXQkpBem9ORnA4R3VrTnZ6djZ1aE5OTlM5WENFTWNPN3dzQXlxbENnMm1laFJwQzhMZkdwN2ZRTU9MbTNMU2hEbTIvUWhxOGlxaENpNENEbGMzTFBaYVdYTkpsb0dtUTlleFNiMFJ4eCtjZ2tjVW9OTm9VV09zd0pwVktsem9rRGNIamh1T29xN29ISnE2V3RENTVSa0FvTVpZQ1Z0NU0zYmYybzk0RDRjUkRZalQ0cWhPbzgwSURZMGk3UzRZTW5OaGFOd1ZycENqcnh1RDdpRllEMTZIMWRFaXEzSVdZd1VlT2R2K01WN2Nkd1JkMWM5UXV0VU1xNk1aT2V0MFV3QVVrRGlGeGpTZ1RGUGVQcHRmVmV1WjhDZ0czRU1vM0p5UEx0ZmJlU0k3ZTU4Q0FBcXpDeVRIc1JRNmpSWXFaVHBzenZrN3ZNMXB4KzdzZkJBUkNqWWJGUUJlU3QwRFlocGdqTlVSa2JyUmZEbDhWUnp4anZvQnJKamRUaFhjYUM3dU9SK1grTmxJYlZLYjFCdG1lbnBtQXI4RVlKclhhTGJPZUg1RVJIck1YQ2pzZFoxWFlIWDh2YUkybU9wUnV0VU1BR1lBa211MUZPT1R2Z09EN3NFVCsrOGVYaDRhN3pxTkZvOVB0b2FGUjFyN0U0YUl5b2lJUGc3MzBwMDN6ZFQvYzVDQ2xDV1FTeTJJM3EvQ2hCQjQrTDZWT2o0L0pTS2lRQ0RnQ1Jac1lTQWlvemcxMmY3ajE1alQ1NSs0SHp5MUpwcExUVVNuUGFMM25jL3Y2eUtpdXVDZG04UGhjRGljcGNFZmszZUFMYmMxK1ZRQUFBQUFTVVZPUks1Q1lJST1cIjtcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJyZWRcIikge1xuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQTB4SlJFRlVhSUh0bHoxc0VtRWN4cDlYaEJRRGhSQS9NQ1NOVFV5OHRFc1hYRXNnY2RBQnFvT1RwQTR1a0tBT3hzWXVEa0owcmRIbzFKUW1iZ1ljWFB4S25EVGdVQWR0bXpTeElVQ0tSQ3dlb1FWNjkzZUF1Mmg3QlE1YTA4VDNOeDMzUDU1N252ZnIzaGZnY0RnY0RvZkQ0WEE0L3l0c0wwU0l5QTdnK2w1b2FiREtHSnZiclhpNFgzVWlza09XUDIvOS9IbTBYaWpVKzlYYnpwR1JFVHNSZVJoalY3WHF1bnVnMWRyakFNWmF0OGJremMwTFh6d2VveVNLZlZqVnhoa093eGtLQWNBd1kyeDFlMTFYRHhEUmRaS2tlOHhnc05ReW1ZcFVxV3laamg4ZnFHVXliRC9NQTBBbG5WWXVUd0hvUFFBUnpRS1lMRHg5aW1JOERra1VMVUN6aFN4dTkxNTQ3WW11QWlqbU05UFRLQ1dUKzJ4Skg0YzZQWENRelFNZEFoeDA4MENiQUVUa3dRRTNEN1NaQTFTdjN4SS9mR2lVa2tuanZ6U2tsMTBETUpQcC9QcXJWMTJKR0t6V1BUT2tWN3Z0S2xUUDV6dStRQkpGbUFVQkRyKy9xK2YxNHZEN2xjc0ZyWHJmVzRsU0lnRkhJSUNoV0t4ZnFYYmNaSXl0YXhYNkRpQ0pJcFl2WG9UbDdObCtwWGJnQ0FTVUh0QnNmYUNQQUdaQndNYlNrdnE3a2tyMUtyVkRTNkdiTDd5dUFBYXJGVVBSS0d3K24zcHY3ZEVqckQxK3JFZEc1ZGlWSzNDR3crcEVyYVRUeUV4UG81N0xkYTJoSzhEd3c0Y3d1Vno0Rm9tb2s5Y1pDc0V3T0lqYy9mdjZ6QWVEY04yK2plTDhQTXJ2M2dFQW5LRVFUcy9PWXZuU0pYUzdPZHcxZ0x5NVdUQUx3Z2xsYU5oOFBsamNibnc5ZDA1dG9Vb3FoWG91aCtHWkdSVG41M1cxbkRNVVF1bkZpNytDcjZSU0dIbjlHbzZKQ1JUamNSd1pIVzBBTUVKakY5b3h3S0dCZ1Njbkk1RTdVcmxzck9menNIbTlxS1RUTzB5VzM3NXRCdlI2TmNleEZtWkJnTUZxMWZ6Q2w1SkoyTHhlZ0FpRDQrTkdBTysxemdFZEF6REc3aEtSZlNnV1U0K0tqZWFKeS9UbmM4cjRkVTFOZFdWZTY3OS9Zbks1WUhHN2xRbjhIa0NnblVaWEp6SWlHa1B6UUpISVBYaUFZanl1MW9haVVUZ0NBUUNZQUtDNVZtc2hWNnVYYTluc3RaVmcwS0NNZDdNZzRNeno1NnJ4M2RiK25pR2lTU0tpNnVJaWZaK2JvMW8yU3kwbWU5Q3lTNks0c3ZYcmwvd2prYUQxTjIrYVNySmNialhZL2tCRUhybFdlOWtvbFJha2pZMW5yVjFycjFwMklyb2hpZUtucldyMUl4SGRiWjI1T1J3T2g4UDVQL2dOcWh4LzZyc3VqamdBQUFBQVNVVk9SSzVDWUlJPVwiO1xuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSBcInllbGxvd1wiKSB7XG4gICAgICBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBeWhKUkVGVWFJSHRsejFNVTFFWWh0L3ZZaFdOYVp0Z2hBR05tSUNKVm1Gd01DRlJIRXdFRThWSm5NUkJuUlFkeWdBT0Rycm9ZQ0lMdUJnV1lkUEV5R1JpeEJRY0hDRCtES2hBV2lNNDFIZ0psSi9ibnRlaHQvV250eiszQlVQQ2VhYmUrNTI4ZmIvdm5Idk9kd0NOUnFQUmFEUWFqVWF6VVpIVkVDSHBCOUN4R2xvT1RJdElmN2JncGxMVlNmcEJOUTdyeHc0c2Zsc3BWUzhEM3lFL3lTWVJ1ZWdVZGowRGRyV1BBV2l3WHpVZ3NYZ3E4ZUtnQjVaWmdsTm5wSzRUUmwwUUFHcEVaUHJmdUtzWklOa0J4bTlETm0xSGJISWUxbndjNVZYbFhKaVV0VEFQQUlpR0FBUUJZQStBNGhNZytRaEF1L3AwSDV6cUF5eHpPNUNza0ZRMHJwSmI5eFNVUU1vOHg2K0JrWUUxdHVRT0k5K0FQODJyZFdZZXlKUEFlamNQNUVpQVpCUFd1WGtnMXplUVdBNHlPbXlweUlEblAvcHhUZllFeXJhMFlPWlpZU29lN3lyWmNkTDI1UXpuM0lVWUMrZlZsN2dKOFFZZ3U5cUFBc2E3UmFyUHBYNk9PY1ZMYmlWVVpCQkc5WGtZOVQybFN1WGlob2o4ZEFxVW5BQXNFMnE0YVUwT002bHVTODVzbHVvREpTUWczZ0E0OXo3OXpHaW9XS2tNclRRVmpYbWJOWGNKZUh3dzZoOUFxbHJTcnpoeEYycmluaXVaRkViTlpVaGRaL3BEWlRRRWpsOHI2TnRMNFNvQjQzQS9aTnR1cUxjWEFNdUUrQUtRMms2SXh3OSs2SFpuZnU4VnlQN2JVRk1QZ2RraEFIYm5lZVFwRXErUG85RG1NUHRKbkZqNkxyNUErbEdxV2lBVmpWQ2pyZURzRUJnTlFVMzJRWTFmVFZaeTIyNVhDVWh0RUl3TWdoKzZrNVdQaHFCR3p3QUNHTWwxRC9FM1dQYndqQzQwUlk1em9MeFg5blYxaVdWNkVBdERLcHZCNkVqRzlESlZ2Y3FUZ05NNmRqTHZEUUFlSC9oMU1DT21Jb09ReW1ZWUpHVG5DUStBVjA3M2dMd0ppTWd0a242anZ1ZjNWWEZwWmdYQTVyOEcydXRYRHR4eGZ6dHlPS1JrNjY3a2pwYmMxVjRCYU0wbFVkQi9rbXhBOGtMeGhCOXZRazMycFdOR2ZVOXFxenNMd0hHdmRpUXhmNDZ4OENVMWNyb3N0ZDdGRzRCeDlHWGFlTGE5djJoSXRwT2tNdDh4OGFXWFhBalRwcjBJTFQ5WDVqN1RNcFVLRDFETlBMZWxsR2tYYkcwZzJjVDQwbk11UjhjWWp6MjJ1OVppdGZ3a3IzUEZmTXY0d2h1U3Qrdzd0MGFqMFdnMEc0TmZUaXhrZkZ4eVhQRUFBQUFBU1VWT1JLNUNZSUk9XCJcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJwdXJwbGVcIikge1xuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUY2MmxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdNeTB3TTFReE1UbzBNRG96Tnkwd05Ub3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1ETXRNRE5VTVRFNk5UTTZNalV0TURVNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1ETXRNRE5VTVRFNk5UTTZNalV0TURVNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllUbGhZVFl4WkdZdFkyVmhOQzB3WXpReUxUaGhaVEF0WmpZMVpUZGhOV0l3TWpCaElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2TVRJNE5tWXpaR1V0WkRkak5TMWtaVFJtTFRnNU5HWXRNV1l6T0RrMlltTTVaakZrSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2WVRka05EUm1OMkV0TWpKbFl5MWhPRFEwTFRsbU9XSXRNVEEzWWpGaE5XWTJPVGN5SWo0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEcGhOMlEwTkdZM1lTMHlNbVZqTFdFNE5EUXRPV1k1WWkweE1EZGlNV0UxWmpZNU56SWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRE10TUROVU1URTZOREE2TXpjdE1EVTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUluTmhkbVZrSWlCemRFVjJkRHBwYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT21FNVlXRTJNV1JtTFdObFlUUXRNR00wTWkwNFlXVXdMV1kyTldVM1lUVmlNREl3WVNJZ2MzUkZkblE2ZDJobGJqMGlNakF4T0Mwd015MHdNMVF4TVRvMU16b3lOUzB3TlRvd01DSWdjM1JGZG5RNmMyOW1kSGRoY21WQloyVnVkRDBpUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESUNoWGFXNWtiM2R6S1NJZ2MzUkZkblE2WTJoaGJtZGxaRDBpTHlJdlBpQThMM0prWmpwVFpYRStJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNGdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtJRHd2Y21SbU9sSkVSajRnUEM5NE9uaHRjRzFsZEdFK0lEdy9lSEJoWTJ0bGRDQmxibVE5SW5JaVB6NlJRMmNYQUFBQ1MwbEVRVlJvM3UyWXZVb0RRUkRIOHdoNUJOOUFIOERDMmtZcld3WHQxVjdSV2h1N2xJS0tXQ2txTm9Lb29LQkVKU0RFRDB3UmpTU1NjR0xpSldaemQrdit6OXV3aEh4ZTl1Q0VHUmhDTm5lejg1dWRuWjFOaEhNZStjOGFJUUFDSUFBQ0lBQUNJQUFDSUFBQ0lBRHRBTDJJZUQ0cWRDa2duVlRtMFE4QTV4MmJwOHNGWmhhUzM1KzZsZi9KdWpZQUw5cGpTb1QyYWhXYjdRemY4bzNCYSsyYWlHVThCajdRTjRBWW43VXRwd1JyeGRkS0NSRXE1MW5sNDY1WUM4SjU2UEhNZ3dRWTZRc0F5d2dyaUlnYWJYelB4cjk0cUFHazg1ZUxxYVpMSEdxQWRzNkhIcUNUODZFRzhGNW82M3lvQWV5cWMvUjIvc202S1hOaFhZR08wWmNBeHFNWkdNRHAvTE4vQU5CM21pQyttbmF0WHl5aytQSDBnM1o5UFRFa1FEUVFBSndKeHBQSkE1YTVubHVKYmdIVVhOV3RxWU44UFgyMEF4eE8zR3ZMODFhMmxENUlEd0RTUmNsSkxsc0x2NDdIVjlLOFdxelZiYUdhN1k0bWdnUEFCS1gzSDdjeTREZHNZRGlRM01yMjdyeTMrZkd1VEJuWGZ1YW4zbXYxQlNCYTVCd21hU3huYW9UYWpYZFNnQ1BIRzhjUklEa3Z6aUhaU3Z0WmdlVmEyV2F5UEw3czUxc2VXQkNrUTdlbEVjKzIybVB5WUpUUENEbnpmU01UbjJ0cXZwdTVhclZaR2ZVcldMMUdlMHJsY1oxSC9lLzdTaW0rRHdrZGR5T3RwQlVVSytQSnVIZGFkcVhNdEdMR3MybXBkd3RVbzJhT2E3c1RpL0VwV0VmcmtOek11aHZPazZsSWp3SUhXY2w2RVh2QlFSRHExYzNoWHdoWWkzZTAzSWxIME9oVkRKWVFHMzFiVmdnLzRyVUhjd0xraHBXdEsreTdacEgzQlVCL2JCRUFBUkFBQVJEQWY5QmZSYjY0S1lmbFJMQUFBQUFBU1VWT1JLNUNZSUk9XCJcbiAgICB9XG5cbiAgICByZXR1cm4gaWNvblVybDtcbiAgfVxuXG4gIGxvY2F0ZXB1c2hwaW4ob2JqKSB7XG4gICAgY29uc3QgdHJ1Y2tJZCA9IG9iai50cnVja0lkO1xuXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgcGlucyBpbiB0aGUgZGF0YSBsYXllciBhbmQgZmluZCB0aGUgcHVzaHBpbiBmb3IgdGhlIGxvY2F0aW9uLiBcbiAgICBsZXQgc2VhcmNoUGluO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhTGF5ZXIuZ2V0TGVuZ3RoKCk7IGkrKykge1xuICAgICAgc2VhcmNoUGluID0gdGhpcy5kYXRhTGF5ZXIuZ2V0KGkpO1xuICAgICAgaWYgKHNlYXJjaFBpbi5tZXRhZGF0YS50cnVja0lkLnRvTG93ZXJDYXNlKCkgIT09IHRydWNrSWQudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBzZWFyY2hQaW4gPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgYSBwaW4gaXMgZm91bmQgd2l0aCBhIG1hdGNoaW5nIElELCB0aGVuIGNlbnRlciB0aGUgbWFwIG9uIGl0IGFuZCBzaG93IGl0J3MgaW5mb2JveC5cbiAgICBpZiAoc2VhcmNoUGluKSB7XG4gICAgICAvLyBPZmZzZXQgdGhlIGNlbnRlcmluZyB0byBhY2NvdW50IGZvciB0aGUgaW5mb2JveC5cbiAgICAgIHRoaXMubWFwLnNldFZpZXcoeyBjZW50ZXI6IHNlYXJjaFBpbi5nZXRMb2NhdGlvbigpLCB6b29tOiAxNyB9KTtcbiAgICAgIC8vIHRoaXMuZGlzcGxheUluZm9Cb3goc2VhcmNoUGluLCBvYmopO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4obG9jYXRpb24sIHVybCwgcm90YXRpb25BbmdsZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cbiAgICAgIHZhciByb3RhdGlvbkFuZ2xlUmFkcyA9IHJvdGF0aW9uQW5nbGUgKiBNYXRoLlBJIC8gMTgwO1xuICAgICAgYy53aWR0aCA9IDUwO1xuICAgICAgYy5oZWlnaHQgPSA1MDtcbiAgICAgIC8vIENhbGN1bGF0ZSByb3RhdGVkIGltYWdlIHNpemUuXG4gICAgICAvLyBjLndpZHRoID0gTWF0aC5hYnMoTWF0aC5jZWlsKGltZy53aWR0aCAqIE1hdGguY29zKHJvdGF0aW9uQW5nbGVSYWRzKSArIGltZy5oZWlnaHQgKiBNYXRoLnNpbihyb3RhdGlvbkFuZ2xlUmFkcykpKTtcbiAgICAgIC8vIGMuaGVpZ2h0ID0gTWF0aC5hYnMoTWF0aC5jZWlsKGltZy53aWR0aCAqIE1hdGguc2luKHJvdGF0aW9uQW5nbGVSYWRzKSArIGltZy5oZWlnaHQgKiBNYXRoLmNvcyhyb3RhdGlvbkFuZ2xlUmFkcykpKTtcblxuICAgICAgdmFyIGNvbnRleHQgPSBjLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgIC8vIE1vdmUgdG8gdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxuICAgICAgY29udGV4dC50cmFuc2xhdGUoYy53aWR0aCAvIDIsIGMuaGVpZ2h0IC8gMik7XG5cbiAgICAgIC8vIFJvdGF0ZSB0aGUgY2FudmFzIHRvIHRoZSBzcGVjaWZpZWQgYW5nbGUgaW4gZGVncmVlcy5cbiAgICAgIGNvbnRleHQucm90YXRlKHJvdGF0aW9uQW5nbGVSYWRzKTtcblxuICAgICAgLy8gRHJhdyB0aGUgaW1hZ2UsIHNpbmNlIHRoZSBjb250ZXh0IGlzIHJvdGF0ZWQsIHRoZSBpbWFnZSB3aWxsIGJlIHJvdGF0ZWQgYWxzby5cbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltZywgLWltZy53aWR0aCAvIDIsIC1pbWcuaGVpZ2h0IC8gMik7XG4gICAgICAvLyBhbmNob3I6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgyNCwgNilcbiAgICAgIGlmICghaXNOYU4ocm90YXRpb25BbmdsZVJhZHMpICYmIHJvdGF0aW9uQW5nbGVSYWRzID4gMCkge1xuICAgICAgICBsb2NhdGlvbi5zZXRPcHRpb25zKHsgaWNvbjogYy50b0RhdGFVUkwoKSwgYW5jaG9yOiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoYy53aWR0aCAvIDIsIGMuaGVpZ2h0IC8gMikgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJldHVybiBjO1xuICAgIH07XG5cbiAgICAvLyBBbGxvdyBjcm9zcyBkb21haW4gaW1hZ2UgZWRpdHRpbmcuXG4gICAgaW1nLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG4gICAgaW1nLnNyYyA9IHVybDtcbiAgfVxuXG4gIGdldFRocmVzaG9sZFZhbHVlKCkge1xuXG4gICAgdGhpcy5tYXBTZXJ2aWNlLmdldFJ1bGVzKHRoaXMudGVjaFR5cGUpXG4gICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAoZGF0YSkgPT4ge1xuICAgICAgICAgIHZhciBvYmogPSBKU09OLnBhcnNlKCh0aGlzLnN0cmluZ2lmeUJvZHlKc29uKGRhdGEpKS5kYXRhKTtcbiAgICAgICAgICBpZiAob2JqICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBpZGxlVGltZSA9IG9iai5maWx0ZXIoZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmZpZWxkTmFtZSA9PT0gJ0N1bXVsYXRpdmUgaWRsZSB0aW1lIGZvciBSRUQnICYmIGVsZW1lbnQuZGlzcGF0Y2hUeXBlID09PSB0aGlzLnRlY2hUeXBlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaWRsZVRpbWUgIT0gdW5kZWZpbmVkICYmIGlkbGVUaW1lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJlc2hvbGRWYWx1ZSA9IGlkbGVUaW1lWzBdLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH1cbiAgICAgICk7XG4gIH1cblxuICBzdHJpbmdpZnlCb2R5SnNvbihkYXRhKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YVsnX2JvZHknXSk7XG4gIH1cblxuICBVVENUb1RpbWVab25lKHJlY29yZERhdGV0aW1lKSB7XG4gICAgdmFyIHJlY29yZFRpbWU7XG4gICAgdmFyIHJlY29yZGRUaW1lID0gbW9tZW50dGltZXpvbmUudXRjKHJlY29yZERhdGV0aW1lKTtcbiAgICAvLyB2YXIgcmVjb3JkZFRpbWUgPSBtb21lbnR0aW1lem9uZS50eihyZWNvcmREYXRldGltZSwgXCJBbWVyaWNhL0NoaWNhZ29cIik7XG5cbiAgICBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnQ1NUJykge1xuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdBbWVyaWNhL0NoaWNhZ28nKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnRVNUJykge1xuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdBbWVyaWNhL05ld19Zb3JrJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ1BTVCcpIHtcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignQW1lcmljYS9Mb3NfQW5nZWxlcycpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXG4gICAgfSBlbHNlIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdBbGFza2EnKSB7XG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ1VTL0FsYXNrYScpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlY29yZFRpbWU7XG4gIH1cblxuICBhZGRUaWNrZXREYXRhKG1hcCwgZGlyTWFuYWdlcil7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuVXBkYXRlVGlja2V0SlNPTkRhdGFMaXN0KCk7XG4gICAgdmFyIGluaXRJbmRleDogbnVtYmVyID0xO1xuICAgIHRoaXMudGlja2V0RGF0YS5mb3JFYWNoKGRhdGEgPT4ge1xuICAgICAgdmFyIHRpY2tldEltYWdlID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNnQUFBQXRDQVlBQUFEY015bmVBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU94QUFBRHNRQmxTc09Hd0FBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFOT1NVUkJWRmlGelpsUFNCUlJHTUIvMzl0TUNDTjNOeTNJTGxHQy9UbFlVT0NmVFlJd0lTandWblRwVkhUSmcxRWdDZFZGcTFzUkhTTG9uSWU2V0ZHa3E3c1ZGRWhobXVXdFA0VE1paWlGdWpPdlE2TTc2cXc2N3Jqajd6YnZmZk45UHg2ek8rOTlJNndBM1VDaE1VNnRDTFZhcUJTTFhRaGJnQ0k3WkFMTmJ4R0dOUFJwaUVlTDZKVk9KcjNXRWkvQm96RXFMWXNMQ0kxQXNjZGFvMENITXJrYlR0TG5xMkNxanIzYTVCWlE3MUVxVzlWT1RKcWpDZnFYRGwwRXZZZjFxUWczZ0NaZ25TOXlHZEphdUIwMXVDcjlUSGtXTk9vb0U1TW5HdmI3TERiZjRMMmU1dVRtTi94d24zYVRxMllQSVo2ajJiYXFjaG0rQS9YUkhqN1BuMWdnT0ZKRHVSSzZnYTM1TUhQd3l3d1JLKzNpbTNOd2p1QklOUnVWNGgxUWtWZTFERU5TeU1ISVM4Wm1CcFJ6VmlrZUVwd2NRTG1lNUw1ellIWUZqVm9hZ2NkNVYzTEJFazZVeEhrS3RxQStRRUZxQTRQQWprRE5iQVMraFVOVVNCZHBCV0JzNERSclJBNUF3MDRqelNtd24wR0I4OEVxTFVTRWN3QmkvNjE4Q1ZySWpaREpUaVhpMC90MUZiQVU5VXFnS21pUmJGaFFyWURkUVl0a1JhaFFRRm5RSG90UXBzanNndGNjQXBzVWVOK0c1NUcvQ3ZnWnRNVWkvRlFDdjRLMldJUWZ5b0tCb0MyeUlUQ29nQmRCaTJSRjgxenNUYW9CRkFUdE00OHBNMFJVbFNRWVp3MnVvc0N6MGk0bUZJQVMyb01XY3FFZDdPMVdPRTRjU0FhcTQwVFRFK2toQWM0emlkQU1tRUU1T1REUlhKcTVtQldNeGtscXpjMWduRElJdEVVVHZIVmNaOUFORkk1T2tGejFia0lXQkQ2RVUxUTVXeUZ6anAzU3lXUUJISU9GSi93OE1KUU9jWHgrbjhhOTlWRkhHU2JkNU9rZ3BXRllXOFJLRWd2M0JjcnRobWdYM3d0Q0hFTG9YSDA5WHBsVFZMdkp3Vkx0TjFCR0xaY0ZXb0gxUG90TmlkQWFqdE1tb0xNRkxhdUJhY1RZRHJTZ09VdnVmVUlMb1NPVTVrcHhrdUdsZ2oyMWdFZHFLRmR3eG00QmUrM2hES0RwTUJXUFN1TjhYZTVObmdTZHBHTHMwNXB1SUx4RTZLZ0loeU54UHEya2p1dVBaRG5ZQmE4dkkvVGFTdVVnQjBHQXlCL3VBRVBaNWpVTVI0cTRsMHVObkFUbEE5UFcvM2U0ZTNKTjAwcStqY3lwa2N2Tk14ZzF2RUE0T2lleDVuV2tseU81NXM1cEJXZlJOQUZweDRpSmNOR1AxTDRJMmg5a0hzNE9DQThpUFh6MEk3Yy9Ld2hNbTdRQVk4QzRxV2oxSys4L2RramxmZmUwMTY4QUFBQUFTVVZPUks1Q1lJST1cIlxuICAgICAgaWYoZGF0YS50aWNrZXRTZXZlcml0eSA9PT0gXCJVbmtub3duXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eSA9PT0gXCJXYXJuaW5nXCIgfHwgZGF0YS50aWNrZXRTZXZlcml0eSA9PT0gXCJNaW5vclwiKVxuICAgICAge1xuICAgICAgICB0aWNrZXRJbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDd0FBQUF6Q0FZQUFBRHNCT3BQQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBUHlTVVJCVkdpQjdaaFBpQnQxRk1lLzd5WFQxZDNGUWhHS2VLbm9LdGpzV21sdnhSYWg5cUxWUzZkSlpvT3VCdytXUWkvMXRJY1d2T2lXc2xTOXVBZUpheWEvYklNSEtZcW9oeFFVUVloYU5wV3lXRkJXb2kzMG9DaDFONVBmODdEYmtKMU1KcE9kWkJLd24xdmU3LzErNzVOaDV2ZVBzQTFNMDl4aEdNWkJBSWNBUEEzZ0NRQzdBWXh2cHZ4TlJIK0l5QXFBSDVqNXl1am82RGNMQ3d1MTdkUnJocnBKVHFmVGU0bm9GSUFUQUhaMVdlczJnRXRFOUo1dDJ6OTEyYmRCSU9Ga012bDRMQmFiQS9CaTBENCtDSUJQbVBtTlhDNzNjN2VkZll1YnBobUx4K096UkRRTFlNZDJEZHV3SmlKdk9vN3pWckZZckFmdDFGWTRuVTQvU0VRZlkrTTk3UnNpVWpJTTQvamk0dUx0SVBtZXdxbFVhZzh6ZndGZ29xZDI3VmtCY0RTZnovL2FLYkZGT0oxTzd5YWlLOWo0OHFQa0JqTS9rOHZsZnZkTDR1WWZNek16OXhIUnA0aGVGZ0FlMVZwL1pwcm0vWDVKVzRUWDE5Zm5BZXp2cTVZLyt3ekRtUE5MYUx3U2xtVWRBbEJDK0drckxGcEVEaXVsdnZacXZQdUVDY0JGREY0V0FKaUk1dEhHaFFFZ2s4a2NBN0F2U3FzT0hKaWVubjdlcTRFQlFHdDlNbHFmem9qSTYxNXh5bVF5RDJtdFZ3SEVJbmJxUkYxRUhsWkszV3dPc29nY3hmREpBaHRPejdtRHJMWHU2OUliQmlJNjdJNHhNKzhkaEV3UWlPaEpkNHhGWk04QVhBSWhJbys0WXd4ZzV3QmNndExpeGw1WlEwU0xId080NlpFNExGVGRBZllLRGhHZXdoMDN6UU9reFkwM04rdERpWWlVM0RHdTErdWZEOEFsRUNMeWxUdkdoVUxoRndEWG85ZnB5TFZOdHkwd0FJakl1NUhyZE9ZZHJ5QUR3TWpJeUFjWXJ1bnRWcTFXKzhpcmdRRWdtODMrQzJBK1VpVi96aGVMeFR0ZURZMlZwRnF0WGdEd1hXUks3ZmwrZkh6OFlydkdobkNwVkhKRTVCVUFudjhzSXRaRTVHVy9XODR0YTdWUzZqcUExd0RvZnB0NW9FWGtWYVhVTmIra2xwUEc4dkx5Y2lLUldDV2lYdHhVQmtWRTVLUlNLdHNwMGZOb1ZLbFVmcHljbkx3RklJcmowN3FJbkZKS3ZSOGsyZmNKcGxLcEE4eDhDVURMUnJwSC9DWWlKNVJTM3didDRQdjBLcFZLTlpGSTJFVDBBSUNuT3VWM1FRM0FRandlVDlxMnZkSk54OER2YUNhVGVVeHJmUTdBY1FBajNmazFXQ09pb3VNNDU1YVdsbTVzWjRDdVB5clROSGNhaHZFQ2dDU0FZd0c3WFFhd1JFU1hiZHYrcTl1YXpZU2FCU3pMK2hMQUViOGNFU2twcFo0TlU2ZVpVR2M2Wmo0RC96bGJFOUdaTURWYWFvYnBuTXZscmdKWTlFbjVNSi9QbDhQVWNCUDYxS3kxbmdYd2owZlRIYTMxMmJEanV3a3RYQ2dVcWtSMHdhTnBybEFvcklZZDMwMVA3aVhHeHNiZUJ0QXNWNDNGWXVkN01iYWJuaXdFNVhLNU5qVTE5U2VBbHdCQVJFN2J0dDJYcldyUGJuNG1KaWF5QU1vaWN0VnhITDhQY1hpd0xPdUlaVm0rOC9JOTd2Ri81ei9kMGpvRVB6aFpHZ0FBQUFCSlJVNUVya0pnZ2c9PVwiXG4gICAgICB9ZWxzZSBpZihkYXRhLnRpY2tldFNldmVyaXR5ID09PSBcIk1ham9yXCIpe1xuICAgICAgICB0aWNrZXRJbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDd0FBQUF6Q0FZQUFBRHNCT3BQQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBT3lTVVJCVkdpQjdaaE5hQnhsR0lDZmQyWk5hbHNvaUZCVWhMYlpUZnB6TU5MZ1FURkZxTDFvUFpWNFVadmRwSlRXSHVzcGdnRXZtbEpDVmRDZzVzY2lZc1NEOUNMcUlZR0tJTGJhUTJxNzNhMkdsdGdLQlJWTm11ek92QjRTMDgzc3pPek16dTdzZ24xdTgzN3Y5MzBQSDd2Znp5dFV3K1JNQ3d1dFQyQnJOL0FvMEFGc0JqYXVaUHlOY2dNaEMvd0lUTFAwNTdjYzdpcFVOVjhKRWlwNy9Nb3VWSTZCOWdEM2haenJGc0lrTnUrUVNWME0yWGVWWU1JVCtYWnNld2g0TG5BZmJ4VDRBa3Rlb1QrWkM5dlpmL0pKTlpuUERhQU1BQzFWQ25xeGlNanJyRzk3Z3g2eGduYnlGaDY1ZkQ4dHh1ZEFkeTNzZkpqQ0tCN2c0STViUVpMZGhjZCszZ0tKcjRCVURjWDh5R0taKytqZk5sc3BzVno0L2F1YlNkalRvQjExVWZNbVQ2THdKQy91L00wdmFhM3cyQy9yb0hnVzJGMVBNeDkrWXNPNngrbDVlTUVyd1ZqN2FRM1RPRm1BVHVadkQva2wzRm5oOFd3M0tsTkUzN2FpWW1NYmUraHJPK3ZXdUx6Q3FvTEtLUm92QzJCZzJzT291cm9zQzAvazlnT2RjVnI1b25ReGR1VVp0NmFWRmVab3JFSkJFSTY0aDA5ZmZJRGlQZGNBTTJhbFNsZ1V6WWM0dE8xbWFkQ2cwTEtQNXBNRk1ER3RwNTFCQTlGNkg3M1ZZN0NuUEFTN0dxQVNER1duTTJRQVcrSTNDWXBzZFVZTVlGTURUQUtpWlc2R1cxb1RVZVpuQURkZEVwdUZPV2ZBUU11RFRZT29pN0JveFV0encxQXBjek9BNlFhb0JFT1pjb1lNc0w1c2dFb3dwUGlOTTJTUTN2RXJjQ2wrbTRyTXJMaXQ0Yjl0NCsxNFhRSWc4cFpiZUVVNE1VcHpiVysvczc3MXRGdkRzbkI2NjIxZ09FNGpYMVJPZUQxRTc1d2tzOWRQQXQvSDVlVERlUXAvblBKcWREenpMMjhINHp4d2I3MnRQRmhFMkUxdmFzWXJZZTFabmU2NGhIQUlzT3R0NW9LTmF0cFBGdHd1UDcycGoxSHRaN25LR0JlSzZsRXk3WjlVU25TL3JXWGF4MUJlQmlJWG9BT3doT29STXUwalFaTDk2eEFmNXJzdzdFbWc3Q0pkRTRUckNEMGNUSDBYdEl2L2ZiaXY3UWVXN01kQTNxTzJxMTFBZUJjcGRvYVJoVENWbmc5eVNVd2RCQTRBcmVIOFZsbEUrQXdZcERlVnIyYUE4S1dwa2Z3bVd1MW5VWjRIOWdmc2RRYmhVeEtjNFlYVVg2SG5MQ0ZhTFcwODl6V3FleXRrVFpGT1BSVnBuaEtpdmVrczZ6aitlN2FOeVBGSWN6aUlKdHpYY1FIa0k4OTJZWUxlNUxsSWN6aUkvbXEyaXdQQVB5NHRDOWp5V3VUeEhVUVg3dHMraDNMU3BXV0lUUEphNVBFZDFLWXVVZGp3SmxBcU40YzVmNkltWXp1b2pmRGhCK2VCd2RWdjFWZDU2UkczbjBsa2FsZjVtVTJPQStlQUMyeE1lZjhSbTRyUjdGNUdzNVgyNWJ2YzVYL052MW9ZOXFkYkZrbDBBQUFBQUVsRlRrU3VRbUNDXCJcbiAgICAgIH1cblxuICAgICAgdmFyIHB1c2hwaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZGF0YS5sYXRpdHVkZSwgZGF0YS5sb25naXR1ZGUpLCB7IGljb246IHRpY2tldEltYWdlLCB0ZXh0OiBpbml0SW5kZXgudG9TdHJpbmcoKSB9KTtcbiAgICAgIHB1c2hwaW4ubWV0YWRhdGEgPSBkYXRhO1xuICAgICAgbWFwLmVudGl0aWVzLnB1c2gocHVzaHBpbik7XG4gICAgICB0aGlzLmRhdGFMYXllci5wdXNoKHB1c2hwaW4pO1xuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIocHVzaHBpbiwgJ2NsaWNrJywgcHVzaHBpbkNsaWNrZWQpO1xuICAgICAgbWFwLnNldFZpZXcoeyBtYXBUeXBlSWQ6IE1pY3Jvc29mdC5NYXBzLk1hcFR5cGVJZC5yb2FkLCBjZW50ZXI6IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihkYXRhLmxhdGl0dWRlLCBkYXRhLmxvbmdpdHVkZSl9KTtcbiAgICAgIGluaXRJbmRleCA9IGluaXRJbmRleCArIDE7XG4gICAgfSk7XG4gICAgJCgnLk5hdkJhcl9Db250YWluZXIuTGlnaHQnKS5hdHRyKCdzdHlsZScsJ3RvcDo1ODBweCcpO1xuICAgIGNvbnN0IGluZm9ib3ggPSBuZXcgTWljcm9zb2Z0Lk1hcHMuSW5mb2JveChtYXAuZ2V0Q2VudGVyKCksIHtcbiAgICAgIHZpc2libGU6IGZhbHNlICBcbiAgICB9KTsgICAgXG4gICAgZnVuY3Rpb24gcHVzaHBpbkNsaWNrZWQoZSkge1xuICAgICAgaWYgKGUudGFyZ2V0Lm1ldGFkYXRhKSB7XG4gICAgICAgIGluZm9ib3guc2V0TWFwKG1hcCk7ICBcbiAgICAgICAgaW5mb2JveC5zZXRPcHRpb25zKHtcbiAgICAgICAgICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcbiAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgIG9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KDAsIDIwKSxcbiAgICAgICAgICBodG1sQ29udGVudDonPGRpdiBjbGFzcyA9IFwiaW5meVwiIHN0eWxlPSBcImJhY2tncm91bmQtY29sb3I6IHdoaXRlO2JvcmRlcjogMXB4IHNvbGlkIGxpZ2h0Z3JheTsgd2lkdGg6MzYwcHg7XCI+J1xuICAgICAgICAgICsgZ2V0VGlja2V0SW5mb0JveEhUTUwoZS50YXJnZXQubWV0YWRhdGEpICsgJzwvZGl2PidcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAkKCcuTmF2QmFyX0NvbnRhaW5lci5MaWdodCcpLmF0dHIoJ3N0eWxlJywndG9wOjU4MHB4Jyk7XG4gICAgICBwaW5DbGlja2VkKGUudGFyZ2V0Lm1ldGFkYXRhKVxuICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIoaW5mb2JveCwgJ2NsaWNrJywgY2xvc2UpO1xuICB9XG4gIGZ1bmN0aW9uIHBpbkNsaWNrZWQocGFybXMpe1xuICAgIGNvbnNvbGUubG9nKCdlbWl0Jyx0aGF0KTtcbiAgICB0aGF0LnRpY2tldENsaWNrLmVtaXQocGFybXMpO1xuICB9XG4gIGZ1bmN0aW9uIGNsb3NlKGUpIHtcbiAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdmYSBmYS10aW1lcycpIHtcbiAgICAgICQoJy5OYXZCYXJfQ29udGFpbmVyLkxpZ2h0JykuYXR0cignc3R5bGUnLCd0b3A6MHB4Jyk7XG4gICAgICBpbmZvYm94LnNldE9wdGlvbnMoe1xuICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIFxuICAgICAgICBmdW5jdGlvbiBnZXRUaWNrZXRJbmZvQm94SFRNTChkYXRhOiBhbnkpOlN0cmluZ3tcbiAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB2YXIgaW5mb2JveERhdGEgPSBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J3BhZGRpbmctdG9wOjEwcHg7cGFkZGluZy1ib3R0b206MTBweDttYXJnaW46IDBweDsnPlwiXG4gICAgICAgICsgXCI8L2Rpdj5cIlxuICAgICAgICByZXR1cm4gaW5mb2JveERhdGE7XG4gICAgICAgIH1cblxuXG59XG5cbiAgVXBkYXRlVGlja2V0SlNPTkRhdGFMaXN0KClcbiAge1xuICAgIGlmKHRoaXMudGlja2V0TGlzdC5sZW5ndGggIT0wKVxuICAgIHtcbiAgICB0aGlzLnRpY2tldExpc3QuVGlja2V0SW5mb0xpc3QuVGlja2V0SW5mby5mb3JFYWNoKHRpY2tldEluZm8gPT4ge1xuICAgICAgdmFyIHRpY2tldDogVGlja2V0ID0gbmV3IFRpY2tldCgpOztcbiAgICAgIHRpY2tldEluZm8uRmllbGRUdXBsZUxpc3QuRmllbGRUdXBsZS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBpZihlbGVtZW50Lk5hbWUgPT09IFwiVGlja2V0TnVtYmVyXCIpe1xuICAgICAgICAgICAgdGlja2V0LnRpY2tldE51bWJlciA9IGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiRW50cnlUeXBlXCIpe1xuICAgICAgICAgIHRpY2tldC5lbnRyeVR5cGUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDcmVhdGVEYXRlXCIpe1xuICAgICAgICAgIHRpY2tldC5jcmVhdGVEYXRlID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFcXVpcG1lbnRJRFwiKXtcbiAgICAgICAgICB0aWNrZXQuZXF1aXBtZW50SUQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJDb21tb25JRFwiKXtcbiAgICAgICAgICB0aWNrZXQuY29tbW9uSUQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlBhcmVudElEXCIpe1xuICAgICAgICAgIHRpY2tldC5wYXJlbnRJRCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQ3VzdEFmZmVjdGluZ1wiKXtcbiAgICAgICAgICB0aWNrZXQuY3VzdEFmZmVjdGluZyA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiVGlja2V0U2V2ZXJpdHlcIil7XG4gICAgICAgICAgdGlja2V0LnRpY2tldFNldmVyaXR5ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBc3NpZ25lZFRvXCIpe1xuICAgICAgICAgIHRpY2tldC5hc3NpZ25lZFRvID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTdWJtaXR0ZWRCeVwiKXtcbiAgICAgICAgICB0aWNrZXQuc3VibWl0dGVkQnkgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlByb2JsZW1TdWJjYXRlZ29yeVwiKXtcbiAgICAgICAgICB0aWNrZXQucHJvYmxlbVN1YmNhdGVnb3J5ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQcm9ibGVtRGV0YWlsXCIpe1xuICAgICAgICAgIHRpY2tldC5wcm9ibGVtRGV0YWlsID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQcm9ibGVtQ2F0ZWdvcnlcIil7XG4gICAgICAgICAgdGlja2V0LnByb2JsZW1DYXRlZ29yeSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTGF0aXR1ZGVcIil7XG4gICAgICAgICAgdGlja2V0LmxhdGl0dWRlID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMb25naXR1ZGVcIil7XG4gICAgICAgICAgdGlja2V0LmxvbmdpdHVkZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUGxhbm5lZFJlc3RvcmFsVGltZVwiKXtcbiAgICAgICAgICB0aWNrZXQucGxhbm5lZFJlc3RvcmFsVGltZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQWx0ZXJuYXRlU2l0ZUlEXCIpe1xuICAgICAgICAgIHRpY2tldC5hbHRlcm5hdGVTaXRlSUQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkxvY2F0aW9uUmFua2luZ1wiKXtcbiAgICAgICAgICB0aWNrZXQubG9jYXRpb25SYW5raW5nID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBc3NpZ25lZERlcGFydG1lbnRcIil7XG4gICAgICAgICAgdGlja2V0LmFzc2lnbmVkRGVwYXJ0bWVudCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUmVnaW9uXCIpe1xuICAgICAgICAgIHRpY2tldC5yZWdpb24gPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIk1hcmtldFwiKXtcbiAgICAgICAgICB0aWNrZXQubWFya2V0ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJXb3JrUmVxdWVzdElkXCIpe1xuICAgICAgICAgIHRpY2tldC53b3JrUmVxdWVzdElkID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTaGlmdExvZ1wiKXtcbiAgICAgICAgICB0aWNrZXQuc2hpZnRMb2cgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFjdGlvblwiKXtcbiAgICAgICAgICB0aWNrZXQuYWN0aW9uID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJFcXVpcG1lbnROYW1lXCIpe1xuICAgICAgICAgIHRpY2tldC5lcXVpcG1lbnROYW1lID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJTaG9ydERlc2NyaXB0aW9uXCIpe1xuICAgICAgICAgIHRpY2tldC5zaG9ydERlc2NyaXB0aW9uID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQYXJlbnROYW1lXCIpe1xuICAgICAgICAgIHRpY2tldC5wYXJlbnROYW1lID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJUaWNrZXRTdGF0dXNcIil7XG4gICAgICAgICAgdGlja2V0LnRpY2tldFN0YXR1cyA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTG9jYXRpb25JRFwiKXtcbiAgICAgICAgICB0aWNrZXQubG9jYXRpb25JRCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiT3BzRGlzdHJpY3RcIil7XG4gICAgICAgICAgdGlja2V0Lm9wc0Rpc3RyaWN0ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJPcHNab25lXCIpe1xuICAgICAgICAgIHRpY2tldC5vcHNab25lID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy50aWNrZXREYXRhLnB1c2godGlja2V0KTtcbiAgICB9KTtcbiAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxufVxuIl19