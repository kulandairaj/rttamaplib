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
export class RttamaplibComponent {
    /**
     * @param {?} mapService
     * @param {?} vRef
     */
    constructor(mapService, 
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
    ngOnInit() {
        //$('#loading').hide();
        this.loggedUserId = this.managerUserId = "kr5226"; //this.utils.getCookieUserId();
        this.loading = false;
        //this.checkUserLevel(false);
        if (document.readyState != 'complete') {
            document.onreadystatechange = () => {
                if (document.readyState === 'complete') {
                    this.mapview = 'road';
                    this.loadMapView('road');
                }
                else {
                    this.ngOnInit();
                }
            };
        }
        else {
            if (document.readyState === 'complete') {
                this.mapview = 'road';
                this.loadMapView('road');
            }
        }
    }
    /**
     * @param {?} IsShowTruck
     * @return {?}
     */
    checkUserLevel(IsShowTruck) {
        this.fieldManagers = [];
        /** @type {?} */
        var mgr = { id: this.managerUserId, itemName: this.managerUserId };
        this.fieldManagers.push(mgr);
        // Comment below line when you give for production build 9008
        this.IsVP = true;
        // Check is logged in user is a field manager area manager/vp
        this.mapService.getWebPhoneUserInfo(this.managerUserId).then((data) => {
            if (!jQuery.isEmptyObject(data)) {
                /** @type {?} */
                let managers = 'f';
                /** @type {?} */
                let amanagers = 'e';
                /** @type {?} */
                let vp = 'a,b,c,d';
                if (data.level.indexOf(managers) > -1) {
                    // this.IsVP = IsShowTruck;
                    this.IsAreaManager = false;
                    this.managerIds = this.fieldManagers.map(function (item) {
                        return item['id'];
                    }).toString();
                    // this.getTechDetailsForManagers();
                    // this.LoadTrucks(this.map, null, null, null, false);
                    setTimeout(() => {
                        //$('#loading').hide()
                    }, 3000);
                }
                else if (data.level.indexOf(amanagers) > -1) {
                    this.fieldManagers = [];
                    /** @type {?} */
                    var areaMgr = {
                        id: this.managerUserId,
                        itemName: data.name + ' (' + this.managerUserId + ')'
                    };
                    this.fieldManagers.unshift(areaMgr);
                    this.getListofFieldManagers();
                    //$('#loading').hide();
                }
                else if (data.level.indexOf(vp) > -1) {
                    this.IsVP = true;
                    this.IsAreaManager = false;
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
        }).catch(error => {
            console.log(error);
            //this.toastr.error('Error while connecting web phone!', 'Error')
            //$('#loading').hide();
        });
    }
    /**
     * @return {?}
     */
    getListofFieldManagers() {
        this.mapService.getWebPhoneUserData(this.managerUserId).then((data) => {
            if (data.TechnicianDetails.length > 0) {
                for (var tech in data.TechnicianDetails) {
                    /** @type {?} */
                    var mgr = {
                        id: data.TechnicianDetails[tech].attuid,
                        itemName: data.TechnicianDetails[tech].name + ' (' + data.TechnicianDetails[tech].attuid + ')'
                    };
                    this.fieldManagers.push(mgr);
                }
                this.IsVP = false;
                this.IsAreaManager = true;
            }
            else {
                this.IsVP = true;
                this.IsAreaManager = false;
                //this.toastr.warning('Do not have any direct reports!', 'Manager');
            }
        }).catch(error => {
            console.log(error);
            //this.toastr.error('Error while connecting web phone!', 'Error');
            //$('#loading').hide();
        });
    }
    /**
     * @return {?}
     */
    getTechDetailsForManagers() {
        if (this.managerIds != null) {
            this.mapService.getWebPhoneUserData(this.managerIds).then((data) => {
                if (data.TechnicianDetails.length > 0) {
                    for (var tech in data.TechnicianDetails) {
                        this.reportingTechnicians.push(data.TechnicianDetails[tech].attuid);
                        this.reportingTechnicianDetails.push({
                            attuid: data.TechnicianDetails[tech].attuid,
                            name: data.TechnicianDetails[tech].name,
                            email: data.TechnicianDetails[tech].email,
                            phone: data.TechnicianDetails[tech].phone
                        });
                    }
                }
            });
        }
    }
    /**
     * @param {?} type
     * @return {?}
     */
    loadMapView(type) {
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
            const x1 = e.location;
            that.clickedLat = x1.latitude;
            that.clickedLong = x1.longitude;
            that.radiousValue = '';
            jQuery('#myRadiusModal').modal('show');
        });
        //load ticket details
        this.addTicketData(this.map, this.directionsManager);
    }
    /**
     * @param {?} maps
     * @param {?} lt
     * @param {?} lg
     * @param {?} rd
     * @param {?} isTruckSearch
     * @return {?}
     */
    LoadTrucks(maps, lt, lg, rd, isTruckSearch) {
        /** @type {?} */
        const that = this;
        this.truckItems = [];
        if (!isTruckSearch) {
            this.mapService.getMapPushPinData(this.managerIds).then((data) => {
                if (!jQuery.isEmptyObject(data) && data.techData.length > 0) {
                    /** @type {?} */
                    var techData = data.techData;
                    /** @type {?} */
                    var dirDetails = [];
                    techData.forEach((item) => {
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
                            this.pushNewTruck(maps, item);
                        }
                    });
                    /** @type {?} */
                    var routeMapUrls = [];
                    routeMapUrls = this.mapService.GetRouteMapData(dirDetails);
                    forkJoin(routeMapUrls).subscribe(results => {
                        for (let j = 0; j <= results.length - 1; j++) {
                            /** @type {?} */
                            let routeData = /** @type {?} */ (results[j]);
                            /** @type {?} */
                            let routedataJson = routeData.json();
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
                        for (let i = 0; i < listOfPins.getLength(); i++) {
                            /** @type {?} */
                            var techId = listOfPins.get(i).metadata.ATTUID;
                            /** @type {?} */
                            var truckColor = listOfPins.get(i).metadata.truckCol.toLowerCase();
                            /** @type {?} */
                            var curPushPin = listOfPins.get(i);
                            /** @type {?} */
                            var currDirDetail = [];
                            currDirDetail = dirDetails.filter(element => {
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
                                var truckUrl = this.getTruckUrl(truckColor);
                                this.createRotatedImagePushpin(curPushPin, truckUrl, bearing, function () { });
                            }
                        }
                        //$('#loading').hide();
                    }, (err) => {
                        //$('#loading').hide();
                    });
                    this.connection = this.mapService.getTruckFeed(this.reportingTechnicians, this.managerIds).subscribe((data) => {
                        if (this.reportingTechnicians.some(x => x.toLowerCase() == data.techID.toLowerCase())) {
                            console.log(data);
                            this.pushNewTruck(maps, data);
                        }
                    }, (err) => {
                        console.log('Error while fetching trucks from Kafka Consumer. Errors-> ' + err.Error);
                    });
                }
                else {
                    //this.toastr.error('No truck found!', 'Manager');
                    //$('#loading').hide();
                }
            }).catch(error => {
                console.log(error);
                //this.toastr.error('Error while fetching data from API!', 'Error');
                //$('#loading').hide();
            });
        }
        else {
            /** @type {?} */
            const mtrs = Math.round(that.getMeters(rd));
            this.mapService.findTruckNearBy(lt, lg, mtrs, this.managerIds).then((data) => {
                if (!jQuery.isEmptyObject(data) && data.techData.length > 0) {
                    /** @type {?} */
                    const techData = data.techData;
                    /** @type {?} */
                    let dirDetails = [];
                    techData.forEach((item) => {
                        if (item.long == undefined) {
                            item.long = item.longg;
                        }
                        if ((item.techID != undefined) && (dirDetails.some(x => x.techId == item.techID) == false)) {
                            /** @type {?} */
                            var dirDetail = new TruckDirectionDetails();
                            dirDetail.techId = item.techID;
                            dirDetail.sourceLat = item.lat;
                            dirDetail.sourceLong = item.long;
                            dirDetail.destLat = item.wrLat;
                            dirDetail.destLong = item.wrLong;
                            dirDetails.push(dirDetail);
                            this.pushNewTruck(maps, item);
                            that.foundTruck = true;
                        }
                    });
                    /** @type {?} */
                    var routeMapUrls = [];
                    routeMapUrls = this.mapService.GetRouteMapData(dirDetails);
                    forkJoin(routeMapUrls).subscribe(results => {
                        for (let j = 0; j <= results.length - 1; j++) {
                            /** @type {?} */
                            let routeData = /** @type {?} */ (results[j]);
                            /** @type {?} */
                            let routedataJson = routeData.json();
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
                        var listOfPins = that.map.entities;
                        for (let i = 0; i < listOfPins.getLength(); i++) {
                            /** @type {?} */
                            const pushpin = listOfPins.get(i);
                            if (pushpin instanceof Microsoft.Maps.Pushpin) {
                                /** @type {?} */
                                const techId = pushpin.metadata.ATTUID;
                                /** @type {?} */
                                const truckColor = pushpin.metadata.truckCol.toLowerCase();
                                /** @type {?} */
                                var currDirDetail = [];
                                currDirDetail = dirDetails.filter(element => {
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
                                    var truckUrl = this.getTruckUrl(truckColor);
                                    this.createRotatedImagePushpin(pushpin, truckUrl, bearing, function () { });
                                }
                            }
                        }
                        // Load the spatial math module
                        Microsoft.Maps.loadModule('Microsoft.Maps.SpatialMath', function () {
                            /** @type {?} */
                            const loc = new Microsoft.Maps.Location(that.clickedLat, that.clickedLong);
                            /** @type {?} */
                            const path = Microsoft.Maps.SpatialMath.getRegularPolygon(loc, rd, 36, Microsoft.Maps.SpatialMath.DistanceUnits.Miles);
                            /** @type {?} */
                            const poly = new Microsoft.Maps.Polygon(path);
                            that.map.entities.push(poly);
                            /** @type {?} */
                            const pin = new Microsoft.Maps.Pushpin(loc, {
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
                            Microsoft.Maps.Events.addHandler(pin, 'click', (e) => {
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
                    }, (err) => {
                        console.log(err);
                        //$('#loading').hide();
                    });
                    /** @type {?} */
                    let feedManager = [];
                    this.connection = this.mapService.getTruckFeed(this.reportingTechnicians, this.managerIds).subscribe((data) => {
                        if (dirDetails.some(x => x.techId.toLocaleLowerCase() == data.techID.toLocaleLowerCase())) {
                            console.log(data);
                            this.pushNewTruck(maps, data);
                        }
                    }, (err) => {
                        console.log('Error while fetching trucks from Kafka Consumer. Errors-> ' + err.Error);
                    });
                }
                else {
                    //this.toastr.error('No truck found!', 'Manager');
                    //$('#loading').hide();
                }
            }).catch(error => {
                console.log(error);
                //this.toastr.error('Error while fetching data from API!', 'Error');
                //$('#loading').hide();
            });
        }
    }
    /**
     * @param {?} color
     * @return {?}
     */
    getTruckUrl(color) {
        /** @type {?} */
        let truckUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAHkmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxNy0xMi0xNFQxOTowODowMy0wODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTctMTItMTlUMTU6NDk6MDEtMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTctMTItMTlUMTU6NDk6MDEtMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YWRmM2ViMWQtNGJlZC1jNjQ0LTgzYmUtYjQ5YjZlNDlmYmRmIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZGExNTBlYTEtMjJhYy03OTQ5LThiNmEtZWU1MTc4ZTBmMWFkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ODhkMzU2YTctNzE4MS1lNTRhLTk5ZmUtNDgwZTM1YWM2NmY2Ij4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmYwZWQxZWM3LTM1OTAtZGE0Yi05MWIwLTYwOTQ2ZjFhNWQ5YzwvcmRmOmxpPiA8cmRmOmxpPnhtcC5kaWQ6ODhkMzU2YTctNzE4MS1lNTRhLTk5ZmUtNDgwZTM1YWM2NmY2PC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODhkMzU2YTctNzE4MS1lNTRhLTk5ZmUtNDgwZTM1YWM2NmY2IiBzdEV2dDp3aGVuPSIyMDE3LTEyLTE0VDE5OjA4OjAzLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDQ2MDc1Zi04MmRmLWY3NDAtYmU3ZS1mN2I0MzlmYjcyMzEiIHN0RXZ0OndoZW49IjIwMTctMTItMTVUMTk6MjM6MzEtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmFkZjNlYjFkLTRiZWQtYzY0NC04M2JlLWI0OWI2ZTQ5ZmJkZiIgc3RFdnQ6d2hlbj0iMjAxNy0xMi0xOVQxNTo0OTowMS0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4db7vjAAACe0lEQVRIx92WTWtTQRSGnzNzb3LTtKG1WlHwq4uCbYX+A125ELcuuihCRXCp2H3BhSv/gUvBglJw4ULBigpSaUFciFLFjSAtsX61SdM0vXNc9NokRZOYARXnMqu5zDPnnPe8M4Gq8qdHwF8Y/x706rOJnpTItadf7o++Ly+VrZhkRZL5YzjExOn1F5mpsUPnbkyMTT5qGzpXmRlZLubHP7KE7Upn2K6/1DFVwWShmFsdf/h2ZnyCSWk/vfe6e74NvSazJ0fsKvVrdfoTzKawXioyN/+85FfTJ7un3KccwdkiFBsdXolTIHmDzHb51bTncA4XOGIRNFSkQXdZo6g1ZLoj6wWNBmQ07NVp8inshiANgtXVMmFXyIGh/ae8oA+C2/nAWAp3hOBD9Mu/NQa6HdnjZYbP9J8GZtqGHhzc21FIrRHs2yAoxw1PL1lFg00G0kcuApfahi6/LNzq7Ovl5PmjlItraCJZQRCt5lpFyURp5m8uMP15qnT5xJX201uubKSzbqs7JHY1YSnUQBFFjQEMX9dWPG1QQlUUR4yqrfqB1repKDhinChI6AfVRK6SfPV28HOvsBg/qBNFhGSbxlegk6QMzveWUWoMQZrvJmyLrW2oQZAYzG/c895QEWkpwC0xmeTCc57pRVtlYtQgCtYXKiK0/oRyiFHEeAopdq7G5LVpNavTJ1LVmppKM+HiWtN4Y2haLIomKdYmQkr62heqAsYK1ghhFO4AS13aAwtiDWx6Qou2ZDKlHItvVqlU1lHVqiFqnSMQhSGuZNCO5lJqCB3cdWxl4d2rztnrixhrcAl0ZzpUhVgdUdTJcP9IwQt698Ljvv/mhf8dtGHlh4v5R1IAAAAASUVORK5CYII=';
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
    }
    /**
     * @param {?} miles
     * @return {?}
     */
    convertMilesToFeet(miles) {
        return Math.round(miles * 5280);
    }
    /**
     * @param {?} maps
     * @param {?} truckItem
     * @return {?}
     */
    pushNewTruck(maps, truckItem) {
        /** @type {?} */
        const that = this;
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
        const listOfPushPins = maps.entities;
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
        let jobIdString = 'http://edge-edt.it.att.com/cgi-bin/edt_jobinfo.cgi?';
        /** @type {?} */
        let zone = truckItem.zone;
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
            let dispatchDate = truckItem.dispatchTime.split(':');
            /** @type {?} */
            let dt = dispatchDate[0] + ' ' + dispatchDate[1] + ':' + dispatchDate[2] + ':' + dispatchDate[3];
            metadata.dispatchTime = that.UTCToTimeZone(dt);
        }
        // Update in the TruckWatchList session
        if (sessionStorage.getItem('TruckWatchList') !== null) {
            this.truckList = JSON.parse(sessionStorage.getItem('TruckWatchList'));
            if (this.truckList.length > 0) {
                if (this.truckList.some(x => x.truckId == truckItem.truckId) == true) {
                    /** @type {?} */
                    let item = this.truckList.find(x => x.truckId == truckItem.truckId);
                    /** @type {?} */
                    const index = this.truckList.indexOf(item);
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
            let selectedTruck;
            selectedTruck = JSON.parse(sessionStorage.getItem('TruckDetails'));
            if (selectedTruck != null) {
                if (selectedTruck.truckId == truckItem.truckId) {
                    sessionStorage.removeItem('TruckDetails');
                    this.mapService.storeDataInSessionStorage('TruckDetails', metadata);
                    selectedTruck = null;
                }
            }
        }
        if (this.truckItems.length > 0 && this.truckItems.some(x => x.toLowerCase() == truckItem.truckId.toLowerCase())) {
            isNewTruck = false;
            // If it is not a new truck then move the truck to new location
            for (let i = 0; i < listOfPushPins.getLength(); i++) {
                if (listOfPushPins.get(i).metadata.truckId === truckItem.truckId) {
                    /** @type {?} */
                    var curPushPin = listOfPushPins.get(i);
                    curPushPin.metadata = metadata;
                    destLoc = pinLocation;
                    pinLocation = listOfPushPins.get(i).getLocation();
                    /** @type {?} */
                    let truckIdRanId = truckItem.truckId + '_' + Math.random();
                    this.animationTruckList.forEach((item, index) => {
                        if (item.indexOf(truckItem.truckId) > -1) {
                            this.animationTruckList.splice(index, 1);
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
            Microsoft.Maps.Events.addHandler(NewPin, 'mouseout', (e) => {
                this.infobox.setOptions({ visible: false });
            });
            if ($(window).width() < 1024) {
                Microsoft.Maps.Events.addHandler(NewPin, 'click', (e) => {
                    this.infobox.setOptions({
                        showPointer: true,
                        location: e.target.getLocation(),
                        visible: true,
                        showCloseButton: true,
                        offset: new Microsoft.Maps.Point(0, 20),
                        htmlContent: '<div class = "infy infyMappopup">'
                            + getInfoBoxHTML(e.target.metadata, this.thresholdValue, jobIdUrl) + '</div>'
                    });
                    this.truckWatchList = [{ TruckId: e.target.metadata.truckId, Distance: e.target.metadata.Distance }];
                    this.mapService.storeDataInSessionStorage('selectedTruck', e.target.metadata);
                    this.mapService.storeDataInSessionStorage('TruckDetails', e.target.metadata);
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
                    let selectedTruck;
                    selectedTruck = this.mapService.retrieveDataFromSessionStorage('selectedTruck');
                    if (selectedTruck != null) {
                        /** @type {?} */
                        const technicianDetails = this.reportingTechnicianDetails.find(x => x.attuid.toLowerCase() == selectedTruck.ATTUID.toLowerCase());
                        if (technicianDetails != null) {
                            this.technicianEmail = technicianDetails.email;
                            this.technicianPhone = technicianDetails.phone;
                            this.technicianName = technicianDetails.name;
                        }
                    }
                    Microsoft.Maps.Events.addHandler(this.infobox, 'click', viewTruckDetails);
                });
            }
            else {
                Microsoft.Maps.Events.addHandler(NewPin, 'mouseover', (e) => {
                    this.infobox.setOptions({
                        showPointer: true,
                        location: e.target.getLocation(),
                        visible: true,
                        showCloseButton: true,
                        offset: new Microsoft.Maps.Point(0, 20),
                        htmlContent: '<div class = "infy infyMappopup">'
                            + getInfoBoxHTML(e.target.metadata, this.thresholdValue, jobIdUrl) + '</div>'
                    });
                    this.truckWatchList = [{ TruckId: e.target.metadata.truckId, Distance: e.target.metadata.Distance }];
                    this.mapService.storeDataInSessionStorage('selectedTruck', e.target.metadata);
                    this.mapService.storeDataInSessionStorage('TruckDetails', e.target.metadata);
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
                    let selectedTruck;
                    selectedTruck = this.mapService.retrieveDataFromSessionStorage('selectedTruck');
                    if (selectedTruck != null) {
                        /** @type {?} */
                        const technicianDetails = this.reportingTechnicianDetails.find(x => x.attuid.toLowerCase() == selectedTruck.ATTUID.toLowerCase());
                        if (technicianDetails != null) {
                            this.technicianEmail = technicianDetails.email;
                            this.technicianPhone = technicianDetails.phone;
                            this.technicianName = technicianDetails.name;
                        }
                    }
                    Microsoft.Maps.Events.addHandler(this.infobox, 'click', viewTruckDetails);
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
            let infoboxData = '';
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
                let selectedTruck;
                selectedTruck = that.mapService.retrieveDataFromSessionStorage('selectedTruck');
                if (selectedTruck != null) {
                    /** @type {?} */
                    const technicianDetails = that.reportingTechnicianDetails.find(x => x.attuid.toLowerCase() == selectedTruck.ATTUID.toLowerCase());
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
                let selectedTruck;
                selectedTruck = that.mapService.retrieveDataFromSessionStorage('selectedTruck');
                if (selectedTruck != null) {
                    /** @type {?} */
                    const technicianDetails = that.reportingTechnicianDetails.find(x => x.attuid.toLowerCase() == selectedTruck.ATTUID.toLowerCase());
                    if (technicianDetails != null) {
                        this.technicianEmail = technicianDetails.email;
                        this.technicianPhone = technicianDetails.phone;
                        this.technicianName = technicianDetails.name;
                    }
                }
                jQuery('#myModalEmail').modal('show');
            }
        }
    }
    /**
     * @param {?} that
     * @param {?} startLoc
     * @param {?} endLoc
     * @param {?} index
     * @param {?} truckUrl
     * @param {?} truckIdRanId
     * @return {?}
     */
    loadDirections(that, startLoc, endLoc, index, truckUrl, truckIdRanId) {
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', () => {
            this.directionsManager = new Microsoft.Maps.Directions.DirectionsManager(that.map);
            // Set Route Mode to driving
            this.directionsManager.setRequestOptions({
                routeMode: Microsoft.Maps.Directions.RouteMode.driving
            });
            this.directionsManager.setRenderOptions({
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
            const waypoint1 = new Microsoft.Maps.Directions.Waypoint({
                location: new Microsoft.Maps.Location(startLoc.latitude, startLoc.longitude), icon: ''
            });
            /** @type {?} */
            const waypoint2 = new Microsoft.Maps.Directions.Waypoint({
                location: new Microsoft.Maps.Location(endLoc.latitude, endLoc.longitude)
            });
            this.directionsManager.addWaypoint(waypoint1);
            this.directionsManager.addWaypoint(waypoint2);
            // Add event handler to directions manager.
            Microsoft.Maps.Events.addHandler(this.directionsManager, 'directionsUpdated', function (e) {
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
            this.directionsManager.calculateDirections();
        });
    }
    /**
     * @param {?} that
     * @param {?} routePath
     * @param {?} pin
     * @param {?} truckUrl
     * @param {?} truckIdRanId
     * @return {?}
     */
    MovePinOnDirection(that, routePath, pin, truckUrl, truckIdRanId) {
        that = this;
        /** @type {?} */
        var isGeodesic = false;
        that.currentAnimation = new Bing.Maps.Animations.PathAnimation(routePath, function (coord, idx, frameIdx, rotationAngle, locations, truckIdRanId) {
            if (that.animationTruckList.length > 0 && that.animationTruckList.some(x => x == truckIdRanId)) {
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
    }
    /**
     * @param {?} startLocation
     * @param {?} endLocation
     * @return {?}
     */
    CalculateNextCoord(startLocation, endLocation) {
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
    }
    /**
     * @param {?} num
     * @return {?}
     */
    isOdd(num) {
        return num % 2;
    }
    /**
     * @param {?} x
     * @return {?}
     */
    degToRad(x) {
        return x * Math.PI / 180;
    }
    /**
     * @param {?} x
     * @return {?}
     */
    radToDeg(x) {
        return x * 180 / Math.PI;
    }
    /**
     * @param {?} origin
     * @param {?} dest
     * @return {?}
     */
    calculateBearing(origin, dest) {
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
    }
    /**
     * @param {?} form
     * @return {?}
     */
    SendSMS(form) {
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
    }
    /**
     * @param {?} form
     * @return {?}
     */
    SendEmail(form) {
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
    }
    /**
     * @param {?} form
     * @return {?}
     */
    SearchTruck(form) {
        /** @type {?} */
        const that = this;
        //$('#loading').show();
        if (form.value.inputmiles != '' && form.value.inputmiles != null) {
            /** @type {?} */
            const lt = that.clickedLat;
            /** @type {?} */
            const lg = that.clickedLong;
            /** @type {?} */
            const rd = form.value.inputmiles;
            this.foundTruck = false;
            this.animationTruckList = [];
            if (this.connection !== undefined) {
                this.connection.unsubscribe();
            }
            this.loadMapView('road');
            that.LoadTrucks(this.map, lt, lg, rd, true);
            form.controls.inputmiles.reset();
            jQuery('#myRadiusModal').modal('hide');
            setTimeout(() => {
                //$('#loading').hide();
            }, 10000);
        }
    }
    /**
     * @param {?} i
     * @return {?}
     */
    getMiles(i) {
        return i * 0.000621371192;
    }
    /**
     * @param {?} i
     * @return {?}
     */
    getMeters(i) {
        return i * 1609.344;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    stringifyJson(data) {
        return JSON.stringify(data);
    }
    /**
     * @param {?} data
     * @return {?}
     */
    parseToJson(data) {
        return JSON.parse(data);
    }
    /**
     * @param {?} number
     * @param {?} precision
     * @return {?}
     */
    Round(number, precision) {
        /** @type {?} */
        var factor = Math.pow(10, precision);
        /** @type {?} */
        var tempNumber = number * factor;
        /** @type {?} */
        var roundedTempNumber = Math.round(tempNumber);
        return roundedTempNumber / factor;
    }
    /**
     * @param {?} y
     * @param {?} x
     * @return {?}
     */
    getAtan2(y, x) {
        return Math.atan2(y, x);
    }
    ;
    /**
     * @param {?} color
     * @param {?} sourceLat
     * @param {?} sourceLong
     * @param {?} destinationLat
     * @param {?} destinationLong
     * @return {?}
     */
    getIconUrl(color, sourceLat, sourceLong, destinationLat, destinationLong) {
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
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    locatepushpin(obj) {
        /** @type {?} */
        const truckId = obj.truckId;
        /** @type {?} */
        let searchPin;
        for (let i = 0; i < this.dataLayer.getLength(); i++) {
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
    }
    /**
     * @param {?} location
     * @param {?} url
     * @param {?} rotationAngle
     * @param {?} callback
     * @return {?}
     */
    createRotatedImagePushpin(location, url, rotationAngle, callback) {
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
    }
    /**
     * @return {?}
     */
    getThresholdValue() {
        this.mapService.getRules(this.techType)
            .subscribe((data) => {
            /** @type {?} */
            var obj = JSON.parse((this.stringifyBodyJson(data)).data);
            if (obj != null) {
                /** @type {?} */
                var idleTime = obj.filter(element => {
                    if (element.fieldName === 'Cumulative idle time for RED' && element.dispatchType === this.techType) {
                        return element.value;
                    }
                });
                if (idleTime != undefined && idleTime.length > 0) {
                    this.thresholdValue = idleTime[0].value;
                }
            }
        }, (err) => {
            console.log(err);
        });
    }
    /**
     * @param {?} data
     * @return {?}
     */
    stringifyBodyJson(data) {
        return JSON.parse(data['_body']);
    }
    /**
     * @param {?} recordDatetime
     * @return {?}
     */
    UTCToTimeZone(recordDatetime) {
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
    }
    /**
     * @param {?} map
     * @param {?} dirManager
     * @return {?}
     */
    addTicketData(map, dirManager) {
        /** @type {?} */
        var that = this;
        this.UpdateTicketJSONDataList();
        /** @type {?} */
        var initIndex = 1;
        this.ticketData.forEach(data => {
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
            this.dataLayer.push(pushpin);
            Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked);
            map.setView({ mapTypeId: Microsoft.Maps.MapTypeId.road, center: new Microsoft.Maps.Location(data.latitude, data.longitude) });
            initIndex = initIndex + 1;
        });
        $('.NavBar_Container.Light').attr('style', 'top:580px');
        /** @type {?} */
        const infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
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
    }
    /**
     * @return {?}
     */
    UpdateTicketJSONDataList() {
        if (this.ticketList.length != 0) {
            this.ticketList.TicketInfoList.TicketInfo.forEach(ticketInfo => {
                /** @type {?} */
                var ticket = new Ticket();
                ;
                ticketInfo.FieldTupleList.FieldTuple.forEach(element => {
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
                this.ticketData.push(ticket);
            });
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.connection !== undefined) {
            this.connection.unsubscribe();
        }
    }
}
RttamaplibComponent.decorators = [
    { type: Component, args: [{
                selector: 'att-rttamaplib',
                template: `  
  <div id='myMap' style="padding: 0px 0px 0px 10px;" #mapElement>
  </div>
  `
            }] }
];
/** @nocollapse */
RttamaplibComponent.ctorParameters = () => [
    { type: RttamaplibService },
    { type: ViewContainerRef }
];
RttamaplibComponent.propDecorators = {
    someInput: [{ type: ViewChild, args: ['mapElement',] }],
    smspopup: [{ type: ViewChild, args: ['smspopup',] }],
    emailpopup: [{ type: ViewChild, args: ['emailpopup',] }],
    infoTemplate: [{ type: ViewChild, args: ['info',] }],
    ticketList: [{ type: Input }],
    loggedInUser: [{ type: Input }],
    ticketClick: [{ type: Output }]
};
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnR0YW1hcGxpYi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9ydHRhbWFwbGliLyIsInNvdXJjZXMiOlsibGliL3J0dGFtYXBsaWIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBVSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFdkgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFekQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0QyxPQUFPLEVBQWdCLHFCQUFxQixFQUFFLE1BQU0sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBT3BGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDcEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVoQyxPQUFPLEtBQUssY0FBYyxNQUFNLGlCQUFpQixDQUFDO0FBcUJsRCxNQUFNOzs7OztJQW1GSixZQUFvQixVQUE2Qjs7O0lBRy9DLEFBRkEsMEJBQTBCO0lBQzFCLGdDQUFnQztJQUNoQyxJQUFzQjtRQUhKLGVBQVUsR0FBVixVQUFVLENBQW1COzBCQTFFcEMsRUFBRTt5QkFLSCxFQUFFO3VCQUdKLE1BQU07dUJBQ04sS0FBSztxQkFFUCxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztxQkFDaEMsS0FBSztzQkFLQyxJQUFJO3VCQUVSLEVBQ1Q7NkJBRWUsRUFBRTswQ0FFVyxFQUFFO29DQUNSLEVBQUU7Z0NBQ04sQ0FBQzs0QkFDTCxFQUFFOzZCQUNELEVBQUU7NEJBQ0gsRUFBRTtvQkFDRixXQUFXOzZCQUNWLEtBQUs7b0JBQ2QsS0FBSzs2QkFDSSxFQUFFOzsyQkFFSixnR0FBZ0c7OzBCQUdqRyxDQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUs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RTtZQUNqQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQy9CO0tBQ0Y7OztZQTFnREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFFBQVEsRUFBRTs7O0dBR1Q7YUFFRjs7OztZQWpDUSxpQkFBaUI7WUFGakIsZ0JBQWdCOzs7d0JBdUR0QixTQUFTLFNBQUMsWUFBWTt1QkFJdEIsU0FBUyxTQUFDLFVBQVU7eUJBQ3BCLFNBQVMsU0FBQyxZQUFZOzJCQUN0QixTQUFTLFNBQUMsTUFBTTt5QkFvRGhCLEtBQUs7MkJBQ0wsS0FBSzswQkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVmlld0NvbnRhaW5lclJlZiwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkluaXQsIFZpZXdDaGlsZCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbi8vIGltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBSdHRhbWFwbGliU2VydmljZSB9IGZyb20gJy4vcnR0YW1hcGxpYi5zZXJ2aWNlJztcbmltcG9ydCB7IE5ndWlBdXRvQ29tcGxldGVNb2R1bGUgfSBmcm9tICdAbmd1aS9hdXRvLWNvbXBsZXRlL2Rpc3QnO1xuaW1wb3J0IHsgUG9wdXAgfSBmcm9tICduZzItb3BkLXBvcHVwJztcbmltcG9ydCB7IFRydWNrRGV0YWlscywgVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzLCBUaWNrZXQgfSBmcm9tICcuL21vZGVscy90cnVja2RldGFpbHMnO1xuaW1wb3J0ICogYXMgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5pbXBvcnQgeyBmYWlsLCB0aHJvd3MgfSBmcm9tICdhc3NlcnQnO1xuLy8gaW1wb3J0IHsgVG9hc3QsIFRvYXN0c01hbmFnZXIgfSBmcm9tICduZzItdG9hc3RyL25nMi10b2FzdHInO1xuaW1wb3J0IHsgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZS9zcmMvbWV0YWRhdGEvbGlmZWN5Y2xlX2hvb2tzJztcbmltcG9ydCB7IFRyeUNhdGNoU3RtdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyL3NyYy9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQgeyBBbmd1bGFyTXVsdGlTZWxlY3RNb2R1bGUgfSBmcm9tICdhbmd1bGFyMi1tdWx0aXNlbGVjdC1kcm9wZG93bi9hbmd1bGFyMi1tdWx0aXNlbGVjdC1kcm9wZG93bic7XG5pbXBvcnQgeyBzZXRUaW1lb3V0IH0gZnJvbSAndGltZXJzJztcbmltcG9ydCB7IGZvcmtKb2luIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCAqIGFzIG1vbWVudHRpbWV6b25lIGZyb20gJ21vbWVudC10aW1lem9uZSc7XG5pbXBvcnQgeyBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyL3NyYy9jb3JlJztcblxuZGVjbGFyZSBjb25zdCBNaWNyb3NvZnQ6IGFueTtcbmRlY2xhcmUgY29uc3QgQmluZztcbmRlY2xhcmUgY29uc3QgR2VvSnNvbjogYW55O1xuZGVjbGFyZSB2YXIgalF1ZXJ5OiBhbnk7XG5kZWNsYXJlIHZhciAkOiBhbnk7XG5cbi8vIDxkaXYgaWQ9XCJsb2FkaW5nXCI+XG4vLyAgICAgPGltZyBpZD1cImxvYWRpbmctaW1hZ2VcIiBzcmM9XCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhrQUdRQWFJR0FQLy8vOHpNekptWm1XWm1aak16TXdBQUFQLy8vd0FBQUNIL0MwNUZWRk5EUVZCRk1pNHdBd0VBQUFBaCtRUUZBQUFHQUN3QUFBQUFrQUdRQVFBRC8yaTYzUDR3eWttcnZUanJ6YnYvWUNpT1pHbWVhS3F1Yk91K2NDelBkRzNmZUs3dmZPLy93S0J3U0N3YWo4aWtjc2xzT3AvUXFIUktyVnF2Mkt4MnkrMTZ2K0N3ZUV3dW04L290SHJOYnJ2ZjhMaDhUcS9iNy9pOGZzL3YrLytBZ1lLRGhJV0doNGlKaW91TWpZNlBrRWtBQVpRQ0FnT1lCSnFhQloyZW53V2FBSkdrYWFDbnFLa0ZvNld0Wktxd3FheXV0Rit4dDU4QnRidGR1TDY2dk1GWXZyakF3c2RUeExmR3lNMU95ckhNenROSjBMRFMxTmxFMXFyWTJ0OC8zS25lNE9VNjRxams1dXMxNktmcTdQRXc3cUR3OHZjcjlMbjQvREg2bnZaMkFCZ2dZRlkvU1A4NkJkUWhvQk1CQVFzUERrcFlJT0lOQUtBZVdwVG9oLy9peGhvRFVHbmt1QVNBd1NBZWlRU0FOWkprRVpPVWlxUWNRdURXdzVNdWVjQ2tGQUNuRDRvQ2hqVDBkVE5uajBrOGVmcmtBVlFJZ0pyS0NCck5nVFJwMGlGTmc0VGtOdURqMUJFN3JTWmRlaTVoVUNBcjBiWDg2cUtxV0t0Q3N2NkE2dTRoV3hadTMxb2xpME51ajZIL3V0NDlFVmJ2Vzc0Mi9BcWsrNi9vWUJGNURZdEYzTTdzajYwVVExRitUQ0d5NU1QaExQZEltN25BV2M0ZFBIOStHL3JmNlIyTUV4SkFuVnIxNnNrL1JlOGduZGtyYlFPMmI3UHVvZmhpN01DL05RUVhqcHVwN2h5QU0yOU96bUE1ODczT1hlOHUzZWsxOVFyV3J5dk5ycys3RGN3VUNVei92aUM4K0o0N0tBN1F3WHNtZXd6dmhjZFBPQi9IVSs3L3M5MlhnWHZpclpjUGY5QnhWNUdBR3VSM1cxbkkzVkFmZ2d3TzZPQm5CcVlnSHc3b1VaUmhoY0JkS05tSEpteG93NFRhZ1dpaGlJYjFSU0VOLzVXbW5vcktzYWdYaVNTWVNFTjA5dEY0QVlIaTNhQ2pEQmh4MTUrUEs5cUlYV1VSenRCaFFyNGhxU1JvTkF3SkE0cjZISWxra2xOU2dtTUlWcloxbkQ0emJybEJsMHZLRUdZTFBENW5KZ1pBWGxmbGl5OFVLZU9icWFFNW5wcDB1dkRrUDFIaUdTZHpNNlFYQTViMGFJbG5qWHJDNTQ5c01ZeXBUNkNMR3RDb2w0ODJCa09iS1ZiS3dhQzNmY21Cb1dJQ0tLcW5senJxQXFrdC9EbXBweCtBK3VBTHJLNkFhRjJ3Z3BEcXFSalVxb0trOUZDYWE0aVgwZ29wQzV4bU9Td0kvN0ppdU9xeEtzUllHcS9ETnVzc0M3NmU0Q285NWkyN2diV0dVVXRCdGlYY3FwYTR5KzZLTGJRb0FPdU9zTjYybCtxNm1xWmdyamdCeGh1Q3VpcVFDNW03Nk1DcnJ3TGd0dGd2dXlWczY0NmlBM3RRTUpVbytLdXJnbVUyekN5L0owajhBY0RpZEd2eHAvTkdqTEFJOTNKVDhjZTZYb3B1QTVtWklHMXZLSU1WY29rVW1aQnNvakdUZ0hHT05ldXM0SUk1UTdhekNDMlRvREE2SGdmTndkQmc5a3d5eFNzSC9UREVSRHZOTE1mY0pDMkp3TWRNTFZZSlJZZHdNNjVSTkRSQTFMVjRuV1lJbUxUdDl0dHd4ODN3MGo5emZTSmRXc3VqOWxWWkhDM08zRWdFRUJzQmRnZkR0QlFsYzFONERBT2xJcGdiSnBWMCtCTXZGMmNFQVA5akZ3QzRHVldoemNMa1RtU09yK2ZJY2t3NEczbVJuc0xlZTBwaFoybUx0eUE0TVdldjRabnFoTTFjTnNWSkJPRDNLWGwvRVJ6dUpMQ082UlFDWUsxTTdLdi9MaEx6U29UNmtwN0V3eWc2N1pkZkQ4dm13Z3RYL2I1VFJwNUY0L3A4cjZ2eXNRU3ZSWnptNTJsait4S2lqNHI2OGFjSC9mVHZ3ZCtnaVBwREo3OG5KL01CK1RKRFB5czBTM3dDZEZEL0JPSzhmUUFCY3o4N25SamVoNVlDTFhBMERjeVhENUwzczA1d0R3dFR1NkFFZ0NUQ0g4eHVHU2I4WDhmQXNMY1NQaUE4TGd4QzVqNDRBOTkxOEJTMTh3THJFT2lmYThWaGdCbUpZWFVhYUxrckdPOTRWQW1YSFU3NGlRTGlSWHVtNnNJUld5ZWg1dUNCaVJxOEFRZi9iNWcrTGt4eGJUQWFTeDhnQ0xUNmNkRW05OVBCRjhGWVExWDVBWE00c09FWmZlRkVKYXlSYWtRU1lpQ0FPRWViNkRGM3FmTGh3S0RZeDFDazhTS0JETlVmMThIRVFzYkNMdXRMcFBmU3BjSXpGbVFMZDJUT0lxZkJSMGVxSW9lWWxHVCsza1JHVHo3eWtEb1JaZjQydVlzdG1sSVZrQXhESmd1a29rYStFaFdnRkVOaFZDbTkrOGp4bG81REpmNTRxVW5xZEJLWUFCUW1FbVo1SFI3ZXBaVElCQjRjZGtuTUVUM0dsdEgwSUN1UFVzMWlUZ1diMlh4Y0haalpUSmNjTTVvU3hBTTF1NG5IZTBBem01NjRKQi9JNmMxN3VCS2UydHdqTzN2SnlFcHlNWjJDb0tjaXpVSElQc2F5RUFKZHpUYW42YytmeVRNUkNiMFJPeEozLzhaY0xpS2liUHhHUTJXalROVHRVNHp4b0tpQzZvalFqM2JVRUVTVXowSmx5YzZWMHVGMWN4UW5MK2paajRLcTVhVHE1S1ZMeDdsUk9uNWpqVHRkNGcwdFNvMTFobzhqS1NVS1R2WFpxS0RlUWFTNEFHZzg5cGFUcEtyaW9mZ3c2aWpOMlZQTk9mVU9ENXVLVFQ4aFZaSlk2NnQ2cU9SQnA2SlZhMzRGcXFaQjZ4OEdKVmM5TkZDbXFDRlFYZlZRc3JMK0pqeWN5UnhKMlNwSXRsVE9FMFFWa0cxb015RzgwaWd5ZS9VRFhmenFJN2RFMWc5cHdlcWlrUElkemNMcXNrb0xyV2hIUzlyU212YTBxRTJ0YWxmTDJ0YTY5cld3amExc1owdmIydHIydHJqTnJXNTN5OXZlK3ZhM3dBMnVjSWRMM09JYXR4RVlMWmFaa3R2VUd2K1lWSGVWZmE1eTJ5aGROSkd5dW5weUxuYTdkTjN0VGttNzNyVlJkOFBMSXZDUzkwTGpQYStEekt2ZTk2UzN2VUdpQVh6WHU5ejU1b2U5OXAzVmxwamJLUHptOXpQdi9TK0E1U3RnL2RTM3dQcVZBWUlUSE4wRkQ1aTZEdFpMZ0NQTU53aFRHQzRIdnZEWENLeGhETyszd3h1Mk1JZ25yR0gvbGpqRElJNEpoMU84MUhMd043c3JUakdKTDJ4aUdxTll4akVlOFkxMUxPSU96NWpDTlFieWpuMmNZeUovbU1VcTd2R0pqNHprSUVmNHgwOHU4cEtSOUdMclhzUWtXTTZ5bHJmTTVTeXpFOHBON2JLWXg1emw0NXI1ekdoT3M1clh6T1kydS9uTmNJNnpuT2RNNXpyYitjNTR6ck9lOTh6blB2djV6NEFPdEtBSFRlaEMveGIvdEliR1M1TC9pbWhJaEtYUmVrQUtwQmtCMmQ5a0ZFU3FtYlFkYmxmWjRYSEdOczVrRDJBZnN4eE56N09lWDNHUHFjSHEzcnZRTXEvNVdYVWI2RXBxL3IxVmdhbFdFbUZ0YmM2ajl2cDlzaVlEVlgrdHBHQ3pVR1ZtYmU1VUEybnNNVERiSEVDVnlCZERqWXhaTmhzTXFydzJGTWpaRDJacVczTGQvSFlrd3oxVGsrTGpvK0oyU25MVGJjRG5zcHViMVgzM0ZMQXJiMFJ1dDk3YjlpNitHVmRsS21xajMwZzBCTUQ5blkyQkI1eXA1TjAzNWRxcjhCSzBGZDFaTlhoUEdoNENnMU9iSFJKM0k2dlBTL0YycTdmamNQcDRya1UrQjRzUDV1SG9CamtFSks1eUtUSjgxaVQvNjh2VFlQTDdaSnppRm0vNUdWZytCcDQvMXVjNi8rUTRtQ0VlOUh0N2l1WHBmdkhGaHh4dmw3dGJYMEFIb1VsMXZvZWJqN3VhSlZ3NnhtUHVjV0s2OE9EempPSEF0VzN0SGhJOHB4b1BJNzFES1VrOXR2T2xIcjV5MDltT2JEWGVpT29qZkx2YWlVNTM2Z21rc0pBRGRTcjN5ZTRXd2h2d2FyQk9BckhlUFY4UGZwSzJnL3poUlNudmdtbmR5WHBucVp4K2dISUtob0ZGQzVWVnd6dC82U1Ftc3VlNERnTG9kWGtobHg1UjRld2JndVVMdjNyWisxM1ltZ3hxbDc0ZFFpS1FucCtvVitnd0hWOEZ0VjJ1MkdoQVBPZEJCMjQwb1JWY05KZm9FWTVJQmVvdk0vVm9xUFQwbVc5SDdpKy9uSWtIYWVEcVhuM3ZDMUN2SG8zczY3dCsrKzRMZjlaTU1IL3oyKzkrZzBrYnVsVUk1UC9DTTc5MThsZWN6QUJZWmhVbmYwNVJlc3MyWFNURFhVS0RnRTNRT2NubWYrRHpYUXVvYk50MmVZd0VnUkdvYXpLRGdiUzFmdVdpZ0NOQWdLc2xnaGRnWlJ0SWdiVmxmU1pnZ2ljSVk3WkZnaVVJZ2kzb2ZMYWxnaXNvZ3pPSWc3RGxnU2ZBZ2pyRGdhMWxQTGpqZ3psSWZLNWxnejJvZ3lHSWY2d0ZneGxBaEVXSWZLK0ZoRWtvZ1NoQWhhcmxoRStvaEQrSWdxb2xoTExEaFZIb2VWK29oVnRvaGZZQ2hLUUZobUdJaGxkb2h0NkNoU2dBaFM3RGhLTUZoMmVvZ1oramhsSmpoM01vaGc3bmgwR0RoM2tvWGk1QWlKdkZoMVdvaDRxbWlCYURpUGdCaUhYb2hYMUlpWHZvaGl2QWc1WFlYd29taVpQSWlVckRob2ZpaVRmL2FJa05JNGVYeUlodElZanhBb243ZzRrdElJb2ZJNHVqQ0l1TmFJcmU0b3F2cUlwMXdvcWY1WWdxUUlkdFNILzY0b3UyUW9wdnlJQnhDSXpCaUl6SlNJelZZb3pIYUl1cnlJeFVabzFwU0kzVkNJMUhoNDNaeUl1ZGlJdHZJbzJwYUlnMmdJcE1WM3R4NUl6UjRvMENRbzdsV0Y1bUI0cVZRb3Nud283dEtJNHFZby8zS0lVNW9JdTd4bzJZaDJyMkpwRDc2STdUU0liL2lKQzB3VG8rc0h1UDU0SkRSNUFMNlk5MnA0OFY4bnNQeGdNUU9SckttSTRVV1pFS2VaRUcyV0RZNTVFV3VSc01hVXdueVpGR1NKSTBtQ3NhbVhZcW1aSi81M3g0QjNlRW9ub3ZXWk0yR1kzdlYwRS9DWk90aHpJUE53UWRLWlFLbEpOanBFUkN0cENVM3hkcm82VjlUOW1URVNsNVUybFpLbUdWTHVrOVRDbHdrK0JVVVBsQUE4VmFYeldXU25rWVgxbExYSG1WU3JHV05JS1daRGtXY09ramNobVZGbWhvZDhsNWVabG9lNWxvVHZDWGdCbC9iVG1ZU3lDWWh0azdoWm1ZNHplVWpCazlpL21ZUllDWWtybVZqbG1aUmtDWm1NbVRsN21aU0JtWm5tbENvQm1hS0RtU3BQa1NXbGFVcDdtYXJObWFydm1hc0JtYnNqbWJ0Rm1idG5tYnVKbWJ1cm1idk5tYnZ2bWJ3Qm1jd2ptY3hGbWNHSkFBQUNINUJBVUFBQVlBTExVQUZ3REZBTDhBQUFQL2FMQWIvakJLUTZ1OU9Pdk51LzlnS0k2alpKNFRxYTVzNjc0dEtwOXdiZDk0ZnMwOEJPakFvSEJvNlJsL3hLUnlTVEwya015b2RHcHc4cURVckZabm5XRzM0RENySy91S3orZ09HV1ZPdTkvVnRha05yNGZsYzdzZWpaZlE5NEJNZlJGL2dZWkRnejZIaTRLSkRvV01rVFdPajVLV1FKUUJrSmVjSlpTYm5hRWVtYUNpcGhta3A2b2lxYXV1YXArdnNocXRzN1lVdGJlenVicXZ2TDJydjhDbndzT2l4Y2FkeU1tWHk4eVN6cytNMGRLSDFOV0IxOWg3bVFIYm9kM2Z5cG5pbk9IbGx1Zm9rZXJyaSszdWh2RHhnUFAwZXZiM2RmbjZiL3o5YWY0QlBDTnc0QjF5QnUwVVRLaGxJVU1xRGg5S2lTaXhFYVdLYmloaVRLSngveU1paEI0UFhnd3AwaEhKa29sT2d1bW9FZ2ZMbGpaZXdvUWhjNmFMbWpiSGdNeTVCQ2ZQSmp0L0V2RXBOQVRSb2grT0lvVTFjcWtRcFU1cEJZM3FjaXJWcTFpemF0M0t0YXZYcjJERGloMUx0cXpaczJqVHFsM0x0cTNidDNEanlwMUx0NjdkdTNqejZ0M0x0Ni9mdjRBREN4NU11TERodzRnVEsxN011TEhqeDVBalM1NU11YkxseTVnemE5N011YlBuejZCRGl4NU51clRwMDZoVHExN051clhyMTdCank1NXRTVUNCMjdoejY5N051N2Z2MzhCL0N3aHBPN2p4NDhpVDZ4NUFYTG56NTlCdk0vZFlQTHIxNjcybmI2eU92VHQyQXMyOWk3Y09udnI0ODgvTGIwZlBIcmw2ak56YnkrZjl2bUw4K2ZoeGg4L1AvL2IrL21INS9RZmdmQUlPMkY2QkJxS0hZSUxqTGNpZ2R3NCtpRjJFRWxwSFlZWFFYWWloY3ZWSmROK0c1R2tJNG5FZFB2VGhpT21KaUNKd0pUSjA0b3JKYVFjZmpOZkphRjl2Qk9TbzQ0NDhFakRBajBBR0tlU1BBaFJwNUpGSUNtQ0ZCUWtBQUNINUJBVUFBQVlBTE9nQUpnQ0FBQWtCQUFQL2FMcmMvcEFGRUt1OU9Pdk5JUWdnUUhWa2FaNG1xRTRqNnI0d3VjNWliTis0OHMxMG0vOUFEVzg0Q1JxUGp4MlI1ME02Yzh0bzgwbEZSYS9GcXJha3hCSnIyM0RHNjUyS3o0c3VXWXB1TDlacnM1c0toOC9GNnZwU2ZqL3F5WDFiZVg5TWdWcUVXSVpWZzRncWlsU01qVm1QU0pKTGxFNlJqWHlZTnBaRW5VZWFpSnloTHFPSXBrR2ZRNnBBcUgrbHJpbXNNN001c0hxeXR4MjF0cnlldmlxN3dCbTVlc1V4d283Skw4ZHd4TTBXeXlEU0x0U1QxaVRQZHRxMHk5SGVEZHhrNGVJUzFPY3kxT2JxNUlEcUhOanQ1KzllOGZMcCtFTHMrOGJZL3NiMEMyakJYaUtDMHdZaWhJQXR3TUlJQnE4OGpEQnZZaEtBRmgxVXpNZ2cvMklVamgwM2dqUWdFcVRIU3lNVmxPUjRFbFRLbGtQb2lXdVkwZ0RNUWlsWFpyejVLNmRDa3hocjhneFJNMlN0b2hvL0liMjRhYW1IVkU0cDZvcGFnUnZWQzdsa0NqMTRWYURMcmhvR2FhV3FCcXlKSFdQTnBqWEx0cTNidDNEanlwMUx0NjdkdTNqejZ0M0x0Ni9mdjRBREN4NU11TERodzRnVEsxN011TEhqeDVBalM1NU11YkxseTVnemE5N011YlBuejZCRGl4NU51clRwMDZoVHExN051clhyMTdCank1NU51N2J0MjdoejY5N051N2Z2MzhDREN4OU92TGp4NDhpVEsxL092SG5Pd0FFS0VCRHdsMENCNndRYzdvMSt2ZnVBdmRhN2k2ZCtWNEQ0ODlLMTAwWFBmb0I2dUFQWXkvOE9sN3Q4K2VUYmhyOHZQenRiOC8vOEJlZ2VXUHNGeUY5K1RnRm9vSUhUT1dYZmdndjZWMVI4RUZaWUFIMGpQV2doaEFoYVZPQ0dFRW80a1lJZ2JpZ2lRaCtXYUNHR0FWR280b3NkcXFQaGl5V2VlRTZLTkpZNDREa3o1dmdpaTliZzZLT0tEVnBENHBCRDJnaU1BRUlpcVNLUXhSenBaSTR4QXVQaWxEa1cyVXdBVFdKcG9aSzhjT21sajFBdU9hYVBWZkp5NVprZ2dubExBR3V5dWVKN3hZZ3BwNDdhTUhsbmlXbmVJdVdlRE5KWlRKeUFDaWhvbUlRV2VsK2ZzOWlwS0lPTXV2TG5vK3k1ZVV1aWxKNVhwcFdaR25ob21GMVNhaWt2ZW5aNlhxUm1tb3JkcDlaZ3VpZXFXN3A2SmdFTE9Rb29yTjZVZXVlbUFVMDZKYTd4eUVvanI3V0dXaU9yRTltS1psUXl2cHFJTEVqQ0dnaXNSWEQrMkpheUVUNjdsSzRMVGx0VXMrSVJhNWFzbzdKVjdYeDVZYnRqWGlTV094ZUYzc0tGYXdJQUlma0VCUUFBQmdBczZBQmhBSDhBQ2dFQUEvOW91dHorTU1wSnE0WGc2czI3NzBBUWZHUnBuazhvQmhucXZqQzJ6bTFzMytTc3MzanZVNnJkN0Vjc0dvSkNtbkVaUXlaMXpLakorZFRWcE5oTGRjdkxlaVZVN3U1TGJvVEZ1MnNaZTBZTDFldWxldzZQLzlyelpOMXV3K2VmZkQ1K2YwOTdnU1dEaEZXSE1JcU9Jb2FNR29tUGk1SWZsSlZWa1pjeW1wK2NuUXVabjF5aG9xV3BJcUpncXFtbmg2U3VtNndwczZDMUQ3ZWZ1UTZ5dTJtOURML0FTc0lLeE1Vcng4aktqckNCem9yUWZNbksxSGJXeXN4SDBvVFljZDUvNEd2YXdPUmw1c0RjNnJ2b1pPMno3MnZpYVBOeDhiemN1dlY2KzU3OVZ0eVRGSERaUHdvQkI0cktaK3FnQm1rS2V6RVU0dEREdVlvZUpuYkJhUEgvRlVjVHBUNmVNQmRSNURPUkwzNlZSTGtnejBxV3pjUzhoRGxxeTB5YURDemh4QkhtNXM0R1ZuNFNVZUZUYUFxalNKTXFYY3EwcWRPblVLTktuVXExcXRXcldMTnEzY3ExcTlldllNT0tIVXUyck5temFOT3FYY3UycmR1M2NPUEtuVXUzcnQyN2VQUHEzY3UzcjkrL2dBTUxIa3k0c09IRGlCTXJYc3k0c2VQSGtDTkxua3k1c3VYTG1ETnIzc3k1cytmUG9FT0xIazI2dE9uVHFGT3JYczI2dGV2WHNHUEx0aUNnclFBQ0JVYWtEWUM3UUFFQ2FRZjRIbDZnZGxrQnhJa0RIM3M3ZWZJQllYazduNjY3cS9EcDA2RnpSWTY5ZS9XcjBydDNYMjQxd0hYeDRvMVRQWThlUFZYdTdlTnJmeG8rdnYzdlMrSGJ0MCtlYVlEOS93RG05cFIrQVlyWEgxTzlGWWllZXY0cEdCOVU3RG1ZSFgwU29vZWZVZ1JXcUJ4VUNXcVlISU5ML2VlaGN3Y3UxZUdJdm9Hb2xJZ29FbmRoVWhtT09GOVRKNkw0SWxJc3R2Z2Joem9PcDJKU09iWllvbElSb2pnamdqMzZkcU5STVhvNFpGSTFqcmlrVUVHaStDUlNSWTc0STVSSkZnQlZreG9lYVdLWFUvNVU1WWhYR3BXbGgyWCsxR1dhUW9GWjRaWklSY2ttaFVtS1NTU1pVTDM1WlpkMEdtVm5oWENhMmFXZVNhMnBZWnM0bmVraG9rakpLU0dqT0EwcVlhRTdPYXBob0VJcFdpRlVtbFlJS1pOOFBtV3BnNWcyV3FwVHB5cVlLazJoU3NqcFQ1NUtHRldyQlk1SzVhbzBKdmtxVExFNk9PdE90YnA2YTVMRDRpUnBnRGNFSkxzVHJ2SlJhcWlHelZwVjdIZ0NTTXRscnRwaUdPQUF6ckxLWDdoNEdraHVWSW8yMisxVTA2bHJsbjd1b29WYnZMdWR5MHdDQUNINUJBVUFBQVlBTExVQXVnREZBTUFBQUFQL2FMcmMvakRLU2F1MUlPak51LzlnS0k0aWNKMW9xcTRZNmI1dy9MRjBiZDlNSnU5OHIrSEFvRENpOHhtUG9hRnlpU3NpbjArbWRJcHlRcTg5cW5ZTHNXSy9NSzVZN0FXYlJlTTB0WHh1ZDlUd0pkdE5qOXVEYzNyN3pyZmw5V1o5Z2l0L2dGK0RpQ2VGaGxlSmpoU0xqRkdQbEErUmtrZVZtam1ZZXB1Zmw1MVpuNXFob2p1a3BhZDdxWlNtcTJHdGo2K3dMckt6dFdDM2pyUzVhTHVJdmI0Z3dNSERqY1dDd3NkdnlYM0xQQURTMDlUVjF0ZlV6dHJiM04zZTMrRGg0dVBrNWVibjZPbnE2K3p0N3UvdzhmTHo5UFgyOS9qNSt2djgvZjcvQUFNS0hFaXdvTUdEQ0JNcVhNaXdvY09IRUNOS25FaXhvc1dMR0ROcTNNaXgvNlBIanlCRGloeEpzcVRKa3loVHFsekpzcVhMbHpCanlweEpzNmJObXpoejZ0ekpzNmZQbjBDRENoMUt0S2pSbzBpVEtsM0t0S25UcDFDalNwMUt0YXJWcTQ4RWFOM0t0YXZYcnp3TGlCMUx0cXpaczJIUHFsMDdOaTNidDJYZHdwMHJkKzdidW5iWDRzMkxkaWZmdHdUMi9oMGIyTzlndFlWMUhrWXMrSERpbkl2UFBzWVoyZXprbTVYTFhyYVptZXptbXAwSk54NzhtV1pvc2FWbm5pNlFXdWJxMWpGZmovNExHNlpzdzZGcnYxdzlZRGJmM3JnN0ExZDhlamprNHI3ekdxZU1QSGptNVppYkV3OE5uYlAwNDlTVDI2ME8ranJ6N000ckM5QStkM3o0eU9hbmQwNlBmVDE1dU95L3V6Ky9PSDcwMFBhdDQzLy9Obi8zL1YzMEhlYWZhYWNOcUZxQi9MRVZRSUpyTFJqZ1lBNnFsMW1FN1UzSW9Gb1V5bWZoZzM5bGVGOW5IdW9ING9WbmhmamZpQnp5WlNLQm9hMTRZSXNrbXVXaWE2Zk5HRnVOTWNhVkkxazlyZWJUQmxvTklDUUJSQklKbUc0dkpRQUFJZmtFQlFBQUJnQXNZQUR1QUFnQmVBQUFBLzlvdXR6K01NcEpxNzA0NjYwQS8yQW9qbVJwbmhrUUJCN3F2bkFzeitacXQzU3U3M3l2cVRhYmIwZ3NHbDNCSk83SWJEcWZ3R1J3K2F4YXJ6Q3Bsb1h0ZXIrYXJSaE1McHVqWWluVnpHNGIwL0MxZTA2UG9lRmJlWDNQQitIL2VuMkNneEozZjJLQmhJcURob2RwaVl1UmM0NlVLNUtYZkkyVmo1aWRiWnVna0o2alJwcWdlS0trcWp1bnJRR3JzRVd1cnFteHRpU21zNGUxdDcwYnVzQzh2c01UdWNDVXhNa2Z4OHpDeXNuR3pKWE96NzdSMHNqVjJoSFgySURiNEE3ZXg5VGhxOTNqY2VibTZPbGo2K0h0N21ydzRmTzA5ZHZ5OTFQNTJ2djhMUG1yQnBCZnVZR1hDdDQ3aURCU3dGQU5vVDJjRmxIaVJFY01Leks2aUZILzR6Q09qangrQklsS3hnQUNBa1JhVVpndUk0VUFCV0lTZUtVU0Nra3RMaWtRaU1selFNMHFMTW5GZ01temFNcWZUbTZ1eURsaFo5R2lNNUUyQ2RwS2hvQ25XQXNNb0NtMUZFZW1FcktLOWRuMUNOV1FNUWFJWFh1MGJKR3o2cktzblJ2VnJheDVKdWZxM1dxWENGeDZjdlVLYnR1M3g5K2xNcHdLMW91eThKQy9ZQ0ZjWFV5NXJtTWV3UkpUM3F6MXN1RlpWamx2SnV1WlI4SElENGlLWHN5MXRHbUthVmN2SnV6Njh5RVpxbVd2SlZEN3lMY1lpbldMYmQzN01SemN3dWtXbjVwSGMvTGh5NTNjUWYxZzhuT3NwS00zdVRIanVsanRWNmcvVU92OUtXM3dwSEtYTDhBYmZTenk2Mk1TZCs5SmZmbjI5RlVGWHo4Ly95WHIvL0ZsNTE4biszbUgzNENkQUxqZWVRaEdFaDlQQnpZb0NYeng5U2ZoSVBaNUorQ0ZpaFRvbllVYzhwSGhkUXlHMkllSHowVm9vaUFLbGxmaWluV2dtSnlLTU81QklYODFZdmhnVEJ2bVNNZU41ZmtveUlqUHZTaWtHVElLUitPUmJCQ1pISWhNa3BHa2JrdEdTVWFMSDFwSng0NmRhZWtHa041NTZZYVR3aGtwNWhWZ3BuaG1rMXhDdVdZVlU4clc0NXRYWUhtZG0zUTJFZWRxYytiNWhKMHordmtGbWJxWkthZ1JhUVo2S0JhRXlvYm5va1BzS1ZxZmtNclNacVZXU01xWm9aanlBS2lTblZaeGFhaE9DS0RwWWxXU09rUUFpYTcycUtxZW5qb1dyRmV3K2h5dGpKNVVLSzVkMkNwYXFyd3lZU3BucndaTGhLK0NBV3RzRXlQRDZsWHNzckkwbXhXbDBGYUJMRlRWdGlIQWpaeG1XMFd6eW5xTGhhblBpb3RDQWdBaCtRUUZBQUFHQUN3bkFPNEFBZ0Y5QUFBRC8yaTYzUDR3eWpiSXZEanJ6YnYvWUNpT2tWQ2NBcW11Yk91K3NCZ1E1Mm5GZUs3dmZCNE10V0NxUnl3YWowVlRjQmxBT3AvUWFHYTJyQTZrMkt5VytLdDZDODJ0ZUV3R0FiL2VXM25OYmlzRU5QUjM2Szdib1ZRNVduM3YrM1ZuZW5KWGY0V0dLbkNDaW1HSGpZNFllWXFDZkkrVmxnYUJrb3VYbkkxS21wcVVuYU50a2FDYWRLU3FaSm1ub0t1d1c1K3Vyb1N4dDBpbXRLNk11TDQ3cmJ1dW9yL0ZMTFBDd3IzR3pESnh5ZERFemRNYXdkRENxZFRhRThqWDE4dmI0UXU2M3RDMjR1aGQ1ZVVFNE9qYTNldTdCTm52OE0veXlmWDIwK1Q1dGU3NE1iUDJEMVE3Z2VFU0ZjU0djSnUvaFpMT05XeEdFS0tnQVFFbjRvcG5jZjlTUm8yeEhuYVVzdzhrcm9vanYwZzArUXRseWlVSFdUYmorRElJUFpuVVJOWXNpZk1YelpRcmV6TFRDVEdtMEcwL0M5NDhLbzZvdktCTXNRQTRrclFjeHFoakFBUUlNTFdJMDJSR3NXYlJ1blVyVllnOHhUb3B5N1pyRVh4VzFXNGh5N2JzMlhWaDVVS2hXNWZ0RVplUzh1cDF3cmR2V3lOVkJhVWR6TVd3NDQ4eEFLT0J5cmhJNGNlSHZjSlZKTGl5WmN5Zzd3WmU3RG5IWmRCOTNmYjRXb0IwYVJ5b1kwT0dVWlh5YXgyblpSdit1MmYyN1JlNWRSdFd6Y09mNjk4dWdndmZqWGlKYmVRNGxDK3ZTNXpIbWF2UWtVaWZidGZJRE4vWllYTkhYVDM4cmUzanpROGRqMXA5TWZUY3k3dFhCWC82L0Yvc1FjdS8zNm4rY3Y3L3VPU0gyWDRBV3VLZmNBUVcrTWlCdWlrSWk0Q1BKZWpnSVF6S05xRXFFRG9tNFlWL1ZCZ2JoNk5rNkJpSW5ZaVlHb21YZU5nZWlwYVlTQjJMbGFnWUdveVB1SmdaalkzWTJCMk9GT3BvRm8rSCtNZ1ZrSWJJaUJtUmhnaTVJWkpqQ01sa2h6NHUrYVFXU2s1NWg1R1BXWGxIbFZyVzRXU1hibUE1SEpodWZFbm1HbUl5ZDJZWlhLNlpsWmx1aXBIbWkzRTI2V09kYitvb0paNnIzY21uRm5QVzlTZWdVUTZhQlp5R1BoRm9XWHNtR2dPaWpoNng2RmFOUnVvQ3BKWjY1V2Vta2hiSzZSR1lmb3FicDZJMnBtT3AzdW1KS2hHTFZycXFEQ2E2K21vSVlzbzZLNnpzQVdEcnJiaE90eXV2SWpENEs3QWpJRWhzRk9nTmU2d0tHUG9wdXl5end6bjdyQXFGNlRxdEdJeEtleTBMMW9hUUFBQWgrUVFGQUFBR0FDd1hBTG9BdWdEQUFBQUQveWkxM1A0d3lrbmxNRGpyemJ2L1lDaU9wRFpVYUtxdXpsVytjQ3pQMmNuZWVPN1NmTy9EdHB4d09Objlqc2drZ2Noc01vekpxRFMyZEZxRjBLbDI2NmxldjZzc2Q4ejFnczhVTVhrZE5hUGZEelY3N29QYklYSzZYbmJ2UC9lQWRYNTllWUdHSUlPRWg0c3ZpWGVGakpFR2puYVFrb3VVY0phWGhwbHZtNXlBbm1pZ29YcWpaNldtYzZoZ3FxdHJicTFFcjdCanNyTll0cHk0dVRpMXUxcTl2aXpBd1ZMRHhDckd4MGxCeWpyTmpNL1FOOHpTU1FIYTI5emRBUUxnNGVMakFnUG01K2pwNWdUczdlN3Z2ZGZZOC9UMTl2ZjQrZnI3L1AzKy93QURDaHhJc0tEQmd3Z1RLbHpJc0tIRGh4QWpTcHhJc2FMRml4Z3phdHpJc2Yrang0OGdRNG9jU2JLa3laTW9VNnBjeWJLbHk1Y3dZOHFjU2JPbXpaczRjK3JjeWJPbno1OUFnd29kU3JTbzBhTklreXBkeXJTcDA2ZFFvMHFkU3JXcTFhdFlzMnJkeXJXcjE2OWd3NG9kUzdhczJiTm8wNnBkeTdhdDI3ZHc0eklDUUxldTNidDQ4MGIxeHJjdjM3MStBL2NGTExqd05zS0dDeU5PSEhneDQ4RlFIeXVPTExreDVjcVFuMkwyNjNpenRzNmVRVzhXalpsMFpkT1NVVDlXelpoMVl0ZUdZVS9XN05tYmJNRzNMZE91elMwMzU4dThQd01QN2p1ejArQzloL011L2xkNWJlYTJuWWVXUHBwNmFldW5zYWZXdnBwN1lnRFF1WUgzYm5qODd1RG1qeU1Qa0w3cGV2Ymh0N1ZuK243KzB2cnh0ZGxYaXA5ODRmMUpTZlYzSG04QUlpV2dlc2dWZU5TQjdxMm5vRkVNMHVkZ2Z2RDVKOWlEUlVWNDM0UVdCb1loVVJyeXgrR0F0WDA0VklnQmpvZ2dlaFNhS0JTS0JxNG4xWHN6eWlqVlhhRWxBQUFoK1FRRkFBQUdBQ3duQUdZQWRRQUFBUUFELzJpNnZCSXR5a21ydlRockZrZ1pXeWlPWktrTVJWb0ladXUrbTZDcUJBVGYrTnZOODJEbndDQUd4ZU9CaE1pa284Z2tzSlJRM0k3Wi9FV3ZKQmwxZThSNk5kUHQ5dmt0VTRoaXNkUE1abWpUOEZxYmpZYkR1L1ByMjg0bjU1VWVmSUlGY245SWU0TjhQb1pBWVltRGVJd3VpSStEZnBJa2pwV0poWmdqbEp1Smk1NGJtcUdWbDZRVm9LZVBhNm9WcHEyYm5iQU5yTE9ia2JZR0FYVzVzNm0yc3NDVnRid0d1TVdjVnJ5K3k3bTd3NEhRcDhLd3l0VjJ4N3kvMnFMTjA5K2gwdGpqb2RlcTN1ZmI0YkRFN0dMbHF0bnhUT21rNi9aYjd1L1UrMk9RU2FnWGo0REFNd0R2SGFRQTc1ekJoYXYrMmVzSGtZRStiZk1xY3BENFRmK2pCZ0VjbCtIekdJR2dNWklobmtHamlKSmhTRm90c3dCakdUUFdSVVUxVFRSTWszTVNxcDR2YmhaNUNOVEZUaFUwaThhNG96VEh6YVJOVTRiTUdMVUVJcUpWZ2FBWm1WVW5BYXhkdzRvZFM3YXMyYk5vMDZwZHk3YXQyN2R3NDhxZFM3ZXUzYnQ0OCtyZHk3ZXYzNytBQXdzZVRMaXc0Y09JRXl0ZXpMaXg0OGVRSTB1ZVRMbXk1Y3VZTTJ2ZXpMbXo1OCtnUTRzZVRicTA2ZE9vVTZ0ZXpicTE2OWV3WTh1ZVRidTI3ZHU0Yyt2ZXpidTM3OS9BZ3dzZlRyeTQ4ZU80QXdRQUFCaUFjdVhNK3o2Znp0ZjU5T2ZSOFY3Zm5wMnU5ZTNYdThjRlR4NnEyZkxseGEvOWpoNjhlclR0NDc4bnl6NCsrZmxpN2V2SFg3VytmdlRmL0NuMTM0RG14ZVFmZ2VXSmRTQ0M3dVhIb0h3S1BoamZXQksyRjJCT0MxYW9ISVVhM2hkaGgrQnhDT0oxSW82STNZY21QbGRpaWhmV2xLR0dLNXJZb29FcFV1ZGdqUVcyOUtLRU04YUU0NFkzMXRnalNqdEtHT09JUTVKVUpJTkprdlJqamtUKzJLUkhUeDRKNHBRVkxjbWdsUjJPcFNXQldGWlVKWW9zY2dram1US2FXYUdhUnFLSkpKc1BlaWtsbkZ1NmVTV2RDTXFKbzU1QzRra2duMlVHbVNLZ2FRcjZwcDFkK3ZsZm1GbnVXZGFYOWpHcTVJaHFRVW9lVzVhRzUxYW1RTDVscWFSS1FWclhrcUQydDJOZUdWYkhuVi9zQmVaY3FSWWtBQUFoK1FRRkFBQUdBQ3duQUNvQWRRQUFBUUFELzJpNjNQNHd5a2xOQ0RYcnpidFhBa0Y4WkdtZUlGR3NBdXErOENJTWF6M0dlTDRGZE8wUHVxQ3dFUWo1amdYTWNJa3pJbzgzcHRURWUxcVYweXpIYVVWR3RXQkp0ZHR0aGMvRWdZcE1ScnN0UFRZWitBWno1V1JzZlRuR3k3OTdRWGQrYkhxQk9RS0VoSUNIT0d1S2NtYU5PUUdRZm9hVEw0K1dYWFNaTVpXY2haODRjYUpQaktSVXAyU1NxaWlKcktpdk1KdXlOWjYwSnJHM1I1aTZIcmE5dWNBZm9iMCt2OFVicHNpcHl4ckh5Q3pRSk0zSTFTVFRQOWtldk52SzNSTEN0OC9pRWQvVDRlY1A1TExtN0E3UzA2N3hFdGU5OWhYenlNVDZEL2h1cmZ0bndCMHJlQVRUSWF0SHNJSEJVd2ovOGV2RnNPR0NoNmNHNnB0NHkvK2ZSUVVCWlduVXQ4M0d4d2NLS1o1MGdKRlRSSDBwTzY1MFdITEZ5SGdjWlhuOEdKTFZUWFk1RDg1azBQTlV4WTgxVnd5VmtYU254WmFjZnA0TENuR3BBcWlXcElxakt1cWx2YUtpampia0tzcXFnWmc2eldKVjVMUWhXcGRhMmExbEkzWWxXVFp0aDRMdFFpQXV3YnRRNnBvMXNOZUg0TUVLQ09WRnpKUk5YOFlhREJJNERKbEJ6TVdWV1I0WjRMZnlzY2VaUDlDZ0hMcTA2ZE9vVTZ0ZXpicTE2OWV3WTh1ZVRidTI3ZHU0Yyt2ZXpidTM3OS9BZ3dzZlRyeTQ4ZVBJa3l0ZnpyeTU4K2ZRbzB1ZlRyMjY5ZXZZczJ2ZnpyMjc5Ky9ndzRzZlQ3NjgrZlBvMDZ0Zno3NjkrL2Z3NDh1ZlQ3KysvZnY0OCt2Zno3Ky8vLy8vQUFZbzRJQUVGaWpiQmJrQmNFRUFBTmltNElJSXp2WWdoQmMwR051RUZGYjRHb1laTHRnYWh4MHVhR0ZxSVpiWW1VVWdtaWlpYVNtcUNHRnBMc1pZV1lzeFVqaWlWVFRXbU9GZ092WjQ0MGs1OXRqaFRFRUsyZUdQRWhtcEpJcEtObm5pSkVVNldTS1MyVWhwSlR0Uldta2lsYnBrcWFXS1ZYNzVKWmVmZUNtbWkyUWVZdWFaTHRLeUpwdGJ1Z25ubUhMT2FXV2FlN3hwWjRaNDFySG5uWFgrcVdTZmIrZ3BhSVN2SE5va29XNFlLaWlqYURqNko2Um9LTHFrTHBZS1NXbWptY2E0YWFHZHhwbU5wRitlUTZxVW4wSVpxb2IybkNwa1E2NTZ5dVNocVFJVDY1Rkw3V25XcmF5YWRXYXRwbW9KTEU1U3NyZ29hbXNPQzZ1T0dNcCtGQ1ZzS2paTFpJalNMZ1hpYlJCV081aUMyaEtVQUFBaCtRUUZBQUFHQUN3WEFCY0F1Z0MvQUFBRC8yaTYzUDR3eWttcnZUaTd3SVVZSUNHS1JXbWVoYWl0Yk91K01JWE9kRjNFZUs3dnNPM1h2S0J3T1B3WlR3R2ljc25FSEovSnBuUTZmUjZqMUt5V1p6Vml0K0F3cS92N2lzOW9DZGxuVHJ2ZmExdjdUUmZIYS9PNlBudW41ZmVBVEgwemY0R0dRb01vaFllTU9ZbElqWkZGanlXTGtwY2FsSldZbkRHYUJaYWRvaEdmb2FPbkRLV29xeFdxcks4UW53S3d0QTJ5dGJnR3Q3bTB1N3l2dnIrcndjS254TVdpeDhpY3lzdVh6YzZSME5HTTA5U0cxdGVBMmRwNjNOMTBud1BnejVyajVOTG02T21VNSt1SDR1L1Y2dkxZOVBYYjkvamUrdnZoL2Y3Y3hBdFlaeUJCT0FBUDJrbW9FSXpCaG1jK0VZQ1lSaUpGTkJZdkxxUTBVZjlqbUl3ZXQ0QU15VWRUUjVJbE9hTFVNbkpsazVZdWw4Q01TV1FtVFVRbWI3N01xVk1tejU0MWZ3TEZxWExvcEtKR2czeTZrVlRwcDZaT05VSGw4blNxanFWV3IxYk42bWtyMXhjZ3dvb2RTN2FzdTY5bzA2cGR5N2F0MjdkdzQ4cWRTN2V1M2J0NDgrcmR5N2V2MzcrQUF3c2VUTGl3NGNPSUV5dGV6TGl4NDhlUUkwdWVUTG15NWN1WU0ydmV6TG16NTgrZ1E0c2VUYnEwNmRPb1U2dGV6YnExNjlld1k4dWVUYnUyN2R1NGMrdmV6YnUzNzkvQU5RRGdRTHk0OGVQSWt5dGZ6cHc1eGViUW8wdWZqdnc1OWV2WXMzT3dycjI3ZCtYY3Y0c1hIMzY4K2V6bHo2dVhubjY5KytYdDM4czNIbisrL2ZyMjVlUFA3MzQvZi9WRS92MW5Yb0FDa2dkUmdmd1JpR0IzQ2k2STNvRU82Z2RoaFAxTlNDR0FGbDQ0WUlZYUd0aFFoeGgrQ09LR0lvN29vVUltanVjUkFDeTI2T0tMTU1ibzRvSVVKUUFBSWZrRUJRQUFCZ0FzSndBbUFBRUJmQUFBQS85b3V0eitNTXBKcTcwNDY4MjdHb0luam1ScG5taktDVVZCQ0lFcXozUnQzMVdydnpIdS84Q2drREhRR1huRHBITEp2QVNNVUJlc1NhMWFnWVJvOUhYdGVyOGlsbGJMQlp2UGFFWjJQQWFsMzNCcWtVMGY5T0w0dk8xSjd5UDFnSUVsYTMxK0lZS0lpUmRpaFkxMmlwQ1JEWVNOaFdXU21JSnpsWlVFbVo5NmZKeVZoNkNtYVpTamRKNm5yV2FpcW4xM3JyUldxYkZhQTdXN1ZZeTRiTHpCUzdDL1dxWEN5RCtieFZ2SnpqN0V6RWF6ejlVcXQ5SXUxdHNxdnRrNjFOemlIZEhmdXVQb0hzdmZMZW51RytYWngrLzBFOWpTclBYNkVkN3M0ZnNBRGJDRGNpNmdRUVByL0IwMEdFOWF3WVg3N2pITEIxRmZ2Mi96S3I0YmVFVC80NzZFMy81NUZOZVEyY09SNlNReUU0blMya1Y1TGQrcC9FVXhwamlRMlZqYVRGYXlXTTJkMW1iKzBnazAyRXVIUmNVSnhaV1VHMDVwR1pzSzYwbFRhbENPNEt3K280cnJwMVplUzJNUi9XcnFxVW15eUxqRzhvcldWVmhWVWR1ZVVxdUtyVnhUYjBlTnZSdnA2Rm0rdE9pcTJnczRrZGxpY1F0TEVzekpydUpJZVRrbGZxeklyMC9LcGhoeklvdzV6K0ZmSnp0RDBseUpjd2tBQUVUWGlFd0tDSUFBc0ZYTHNGd1ZDT3picVdXZndKcjF4K3ZidUhXVG9OM1ZOZkRqQVhJTDd5Q0F0U3pieUpFdkR6TXdkSTNmMFk4cm43N2hjeVBqMmJOdjU0NGhnSE1kazFWZ0R4K2QvQXJuanRXem56L2V2UVh2VUV5VG1NOC91ZjBNL3dIZ3A0MXYvZlZYMzM4U21OZUlmaU1VNkNDQ0dGaG1IUTNyT1VnZmhCZmdGSjhLRm5aNElJWU9LQWhGZWlsVTJLR0JJRklnNG9BK21IaGlnU2xTSUFhRElyajRJb294U2tBaUNqYmVXT0NIT1FiUm80OC9CcW5Fa0VRV2FhUVFTQ2FwNUpJNE5PbWtnMEJDZVlLVVV6NW9KWVZaZHVuZmxqTmc2U1YvVllKWjQ1aFRsbWttQjJLaXlkNmE4cmxKcEpwd2F0Q21uTWpSV1dkNWVQcW81NTRWM05rbmNJQ2FJT2lnWHhiYUlLSW4vcWxvQkljaSt1Z0lrZmJwNktRUE1Pb2hwaDVVaXVhbG5EN2dhWmVobHFCcGVLQ1dDc0dvUktwNjVhbkJ1WG9DckRUS09nR3JNTm9hSjU2cDZtb0JydG41eXVXbndsNDNackUzQU5zcnNpd1o0TXBzaTYwK1MyQ2owZ1p4WXJWTVVvbnRFRkp1cThTRjNpYlJZN2hNbUVndUZjQXRleTZQc1RHYkFBQTdcIiBhbHQ9XCJMb2FkaW5nLi4uXCIgLz5cbi8vICAgPC9kaXY+XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2F0dC1ydHRhbWFwbGliJyxcbiAgdGVtcGxhdGU6IGAgIFxuICA8ZGl2IGlkPSdteU1hcCcgc3R5bGU9XCJwYWRkaW5nOiAwcHggMHB4IDBweCAxMHB4O1wiICNtYXBFbGVtZW50PlxuICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBSdHRhbWFwbGliQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25uZWN0aW9uO1xuICBtYXA6IGFueTtcbiAgY29udGV4dE1lbnU6IGFueTtcbiAgdGVjaG5pY2lhblBob25lOiBzdHJpbmc7XG4gIHRlY2huaWNpYW5FbWFpbDogc3RyaW5nO1xuICB0ZWNobmljaWFuTmFtZTogc3RyaW5nO1xuICB0cmF2YWxEdXJhdGlvbjtcbiAgdHJ1Y2tJdGVtcyA9IFtdO1xuXG4gIGRpcmVjdGlvbnNNYW5hZ2VyO1xuICB0cmFmZmljTWFuYWdlcjogYW55O1xuXG4gIHRydWNrTGlzdCA9IFtdO1xuICB0cnVja1dhdGNoTGlzdDogVHJ1Y2tEZXRhaWxzW107XG4gIGJ1c3k6IGFueTtcbiAgbWFwdmlldyA9ICdyb2FkJztcbiAgbG9hZGluZyA9IGZhbHNlO1xuICBAVmlld0NoaWxkKCdtYXBFbGVtZW50Jykgc29tZUlucHV0OiBFbGVtZW50UmVmO1xuICBteU1hcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNteU1hcCcpO1xuICByZWFkeSA9IGZhbHNlO1xuICBhbmltYXRlZExheWVyO1xuICBAVmlld0NoaWxkKCdzbXNwb3B1cCcpIHNtc3BvcHVwOiBQb3B1cDtcbiAgQFZpZXdDaGlsZCgnZW1haWxwb3B1cCcpIGVtYWlscG9wdXA6IFBvcHVwO1xuICBAVmlld0NoaWxkKCdpbmZvJykgaW5mb1RlbXBsYXRlOiBFbGVtZW50UmVmO1xuICBzb2NrZXQ6IGFueSA9IG51bGw7XG4gIHNvY2tldFVSTDogc3RyaW5nO1xuICByZXN1bHRzID0gW1xuICBdO1xuICBwdWJsaWMgdXNlclJvbGU6IGFueTtcbiAgbGFzdFpvb21MZXZlbCA9IDEwO1xuICBsYXN0TG9jYXRpb246IGFueTtcbiAgcmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMgPSBbXTtcbiAgcmVwb3J0aW5nVGVjaG5pY2lhbnMgPSBbXTtcbiAgaXNUcmFmZmljRW5hYmxlZCA9IDA7XG4gIGxvZ2dlZFVzZXJJZCA9ICcnO1xuICBtYW5hZ2VyVXNlcklkID0gJyc7XG4gIGNvb2tpZUFUVFVJRCA9ICcnO1xuICBmZWV0OiBudW1iZXIgPSAwLjAwMDE4OTM5NDtcbiAgSXNBcmVhTWFuYWdlciA9IGZhbHNlO1xuICBJc1ZQID0gZmFsc2U7XG4gIGZpZWxkTWFuYWdlcnMgPSBbXTtcbiAgLy8gV2VhdGhlciB0aWxlIHVybCBmcm9tIElvd2EgRW52aXJvbm1lbnRhbCBNZXNvbmV0IChJRU0pOiBodHRwOi8vbWVzb25ldC5hZ3Jvbi5pYXN0YXRlLmVkdS9vZ2MvXG4gIHVybFRlbXBsYXRlID0gJ2h0dHA6Ly9tZXNvbmV0LmFncm9uLmlhc3RhdGUuZWR1L2NhY2hlL3RpbGUucHkvMS4wLjAvbmV4cmFkLW4wcS17dGltZXN0YW1wfS97em9vbX0ve3h9L3t5fS5wbmcnO1xuXG4gIC8vIFRoZSB0aW1lIHN0YW1wcyB2YWx1ZXMgZm9yIHRoZSBJRU0gc2VydmljZSBmb3IgdGhlIGxhc3QgNTAgbWludXRlcyBicm9rZW4gdXAgaW50byA1IG1pbnV0ZSBpbmNyZW1lbnRzLlxuICB0aW1lc3RhbXBzID0gWyc5MDA5MTMtbTUwbScsICc5MDA5MTMtbTQ1bScsICc5MDA5MTMtbTQwbScsICc5MDA5MTMtbTM1bScsICc5MDA5MTMtbTMwbScsICc5MDA5MTMtbTI1bScsICc5MDA5MTMtbTIwbScsICc5MDA5MTMtbTE1bScsICc5MDA5MTMtbTEwbScsICc5MDA5MTMtbTA1bScsICc5MDA5MTMnXTtcblxuICB0ZWNoVHlwZTogYW55O1xuXG4gIHRocmVzaG9sZFZhbHVlID0gMDtcblxuICBhbmltYXRpb25UcnVja0xpc3QgPSBbXTtcblxuICBkcm9wZG93blNldHRpbmdzID0ge307XG4gIHNlbGVjdGVkRmllbGRNZ3IgPSBbXTtcbiAgbWFuYWdlcklkcyA9ICcnO1xuXG4gIHJhZGlvdXNWYWx1ZSA9ICcnO1xuXG4gIGZvdW5kVHJ1Y2sgPSBmYWxzZTtcblxuICBsb2dnZWRJblVzZXJUaW1lWm9uZSA9ICdDU1QnO1xuICBjbGlja2VkTGF0OyBhbnk7XG4gIGNsaWNrZWRMb25nOiBhbnk7XG4gIGRhdGFMYXllcjogYW55O1xuICBwYXRoTGF5ZXI6IGFueTtcbiAgaW5mb0JveExheWVyOiBhbnk7XG4gIGluZm9ib3g6IGFueTtcbiAgaXNNYXBMb2FkZWQgPSB0cnVlO1xuICBXb3JrRmxvd0FkbWluID0gZmFsc2U7XG4gIFN5c3RlbUFkbWluID0gZmFsc2U7XG4gIFJ1bGVBZG1pbiA9IGZhbHNlO1xuICBSZWd1bGFyVXNlciA9IGZhbHNlO1xuICBSZXBvcnRpbmcgPSBmYWxzZTtcbiAgTm90aWZpY2F0aW9uQWRtaW4gPSBmYWxzZTtcbiAgQElucHV0KCkgdGlja2V0TGlzdDogYW55ID0gW107XG4gIEBJbnB1dCgpIGxvZ2dlZEluVXNlcjogc3RyaW5nO1xuICBAT3V0cHV0KCkgdGlja2V0Q2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgdGlja2V0RGF0YTogVGlja2V0W10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1hcFNlcnZpY2U6IFJ0dGFtYXBsaWJTZXJ2aWNlLFxuICAgIC8vcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgXG4gICAgLy9wdWJsaWMgdG9hc3RyOiBUb2FzdHNNYW5hZ2VyLCBcbiAgICB2UmVmOiBWaWV3Q29udGFpbmVyUmVmXG4gICAgKSB7XG4gICAgLy90aGlzLnRvYXN0ci5zZXRSb290Vmlld0NvbnRhaW5lclJlZih2UmVmKTtcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMuY29va2llQVRUVUlEID0gXCJrcjUyMjZcIjsvL3RoaXMudXRpbHMuZ2V0Q29va2llVXNlcklkKCk7XG4gICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFucyA9IFtdO1xuICAgIHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMucHVzaCh0aGlzLmNvb2tpZUFUVFVJRCk7XG4gICAgdGhpcy50cmF2YWxEdXJhdGlvbiA9IDUwMDA7XG4gICAgLy8gLy8gdG8gbG9hZCBhbHJlYWR5IGFkZHJlZCB3YXRjaCBsaXN0XG4gICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykgIT0gbnVsbCkge1xuICAgICAgdGhpcy50cnVja0xpc3QgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ1RydWNrV2F0Y2hMaXN0JykpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgdGhpcy5sb2dnZWRVc2VySWQgPSB0aGlzLm1hbmFnZXJVc2VySWQgPSBcImtyNTIyNlwiOy8vdGhpcy51dGlscy5nZXRDb29raWVVc2VySWQoKTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAvL3RoaXMuY2hlY2tVc2VyTGV2ZWwoZmFsc2UpO1xuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9ICdjb21wbGV0ZScpICB7XG4gICAgICBkb2N1bWVudC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgICAgdGhpcy5tYXB2aWV3ID0gJ3JvYWQnO1xuICAgICAgICAgIHRoaXMubG9hZE1hcFZpZXcoJ3JvYWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm5nT25Jbml0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgdGhpcy5tYXB2aWV3ID0gJ3JvYWQnO1xuICAgICAgICB0aGlzLmxvYWRNYXBWaWV3KCdyb2FkJyk7XG4gICAgICB9XG4gICAgfSAgIFxuICB9XG5cbiAgY2hlY2tVc2VyTGV2ZWwoSXNTaG93VHJ1Y2spIHtcbiAgICB0aGlzLmZpZWxkTWFuYWdlcnMgPSBbXTtcbiAgICAvLyBBc3NpZ24gbG9nZ2VkIGluIHVzZXJcbiAgICB2YXIgbWdyID0geyBpZDogdGhpcy5tYW5hZ2VyVXNlcklkLCBpdGVtTmFtZTogdGhpcy5tYW5hZ2VyVXNlcklkIH07XG4gICAgdGhpcy5maWVsZE1hbmFnZXJzLnB1c2gobWdyKTtcblxuICAgIC8vIENvbW1lbnQgYmVsb3cgbGluZSB3aGVuIHlvdSBnaXZlIGZvciBwcm9kdWN0aW9uIGJ1aWxkIDkwMDhcbiAgICB0aGlzLklzVlAgPSB0cnVlO1xuXG4gICAgLy8gQ2hlY2sgaXMgbG9nZ2VkIGluIHVzZXIgaXMgYSBmaWVsZCBtYW5hZ2VyIGFyZWEgbWFuYWdlci92cFxuICAgIHRoaXMubWFwU2VydmljZS5nZXRXZWJQaG9uZVVzZXJJbmZvKHRoaXMubWFuYWdlclVzZXJJZCkudGhlbigoZGF0YTogYW55KSA9PiB7XG4gICAgICBpZiAoIWpRdWVyeS5pc0VtcHR5T2JqZWN0KGRhdGEpKSB7XG4gICAgICAgIGxldCBtYW5hZ2VycyA9ICdmJztcbiAgICAgICAgbGV0IGFtYW5hZ2VycyA9ICdlJztcbiAgICAgICAgbGV0IHZwID0gJ2EsYixjLGQnO1xuXG4gICAgICAgIGlmIChkYXRhLmxldmVsLmluZGV4T2YobWFuYWdlcnMpID4gLTEpIHtcbiAgICAgICAgICAvLyB0aGlzLklzVlAgPSBJc1Nob3dUcnVjaztcbiAgICAgICAgICB0aGlzLklzQXJlYU1hbmFnZXIgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLm1hbmFnZXJJZHMgPSB0aGlzLmZpZWxkTWFuYWdlcnMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVsnaWQnXTtcbiAgICAgICAgICB9KS50b1N0cmluZygpO1xuICAgICAgICAgIC8vIHRoaXMuZ2V0VGVjaERldGFpbHNGb3JNYW5hZ2VycygpO1xuICAgICAgICAgIC8vIHRoaXMuTG9hZFRydWNrcyh0aGlzLm1hcCwgbnVsbCwgbnVsbCwgbnVsbCwgZmFsc2UpO1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyAvLyQoJyNsb2FkaW5nJykuaGlkZSgpIFxuICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxldmVsLmluZGV4T2YoYW1hbmFnZXJzKSA+IC0xKSB7XG4gICAgICAgICAgdGhpcy5maWVsZE1hbmFnZXJzID0gW107XG4gICAgICAgICAgdmFyIGFyZWFNZ3IgPSB7XG4gICAgICAgICAgICBpZDogdGhpcy5tYW5hZ2VyVXNlcklkLFxuICAgICAgICAgICAgaXRlbU5hbWU6IGRhdGEubmFtZSArICcgKCcgKyB0aGlzLm1hbmFnZXJVc2VySWQgKyAnKSdcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMuZmllbGRNYW5hZ2Vycy51bnNoaWZ0KGFyZWFNZ3IpO1xuICAgICAgICAgIHRoaXMuZ2V0TGlzdG9mRmllbGRNYW5hZ2VycygpO1xuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZXZlbC5pbmRleE9mKHZwKSA+IC0xKSB7XG4gICAgICAgICAgdGhpcy5Jc1ZQID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLklzQXJlYU1hbmFnZXIgPSBmYWxzZTtcbiAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vdGhpcy50b2FzdHIud2FybmluZygnTm90IHZhbGlkIEZpZWxkL0FyZWEgTWFuYWdlciEnLCAnTWFuYWdlcicsIHsgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlIH0pXG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy90aGlzLnRvYXN0ci53YXJuaW5nKCdQbGVhc2UgZW50ZXIgdmFsaWQgRmllbGQvQXJlYSBNYW5hZ2VyIGF0dHVpZCEnLCAnTWFuYWdlcicsIHsgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlIH0pXG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICB9XG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgLy90aGlzLnRvYXN0ci5lcnJvcignRXJyb3Igd2hpbGUgY29ubmVjdGluZyB3ZWIgcGhvbmUhJywgJ0Vycm9yJylcbiAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRMaXN0b2ZGaWVsZE1hbmFnZXJzKCkge1xuICAgIHRoaXMubWFwU2VydmljZS5nZXRXZWJQaG9uZVVzZXJEYXRhKHRoaXMubWFuYWdlclVzZXJJZCkudGhlbigoZGF0YTogYW55KSA9PiB7XG4gICAgICBpZiAoZGF0YS5UZWNobmljaWFuRGV0YWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAodmFyIHRlY2ggaW4gZGF0YS5UZWNobmljaWFuRGV0YWlscykge1xuICAgICAgICAgIHZhciBtZ3IgPSB7XG4gICAgICAgICAgICBpZDogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5hdHR1aWQsXG4gICAgICAgICAgICBpdGVtTmFtZTogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5uYW1lICsgJyAoJyArIGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkICsgJyknXG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcnMucHVzaChtZ3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5Jc1ZQID0gZmFsc2U7XG4gICAgICAgIHRoaXMuSXNBcmVhTWFuYWdlciA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLklzVlAgPSB0cnVlO1xuICAgICAgICB0aGlzLklzQXJlYU1hbmFnZXIgPSBmYWxzZTtcbiAgICAgICAgLy90aGlzLnRvYXN0ci53YXJuaW5nKCdEbyBub3QgaGF2ZSBhbnkgZGlyZWN0IHJlcG9ydHMhJywgJ01hbmFnZXInKTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBjb25uZWN0aW5nIHdlYiBwaG9uZSEnLCAnRXJyb3InKTtcbiAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRUZWNoRGV0YWlsc0Zvck1hbmFnZXJzKCkge1xuICAgIGlmICh0aGlzLm1hbmFnZXJJZHMgIT0gbnVsbCkge1xuICAgICAgdGhpcy5tYXBTZXJ2aWNlLmdldFdlYlBob25lVXNlckRhdGEodGhpcy5tYW5hZ2VySWRzKS50aGVuKChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGRhdGEuVGVjaG5pY2lhbkRldGFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAodmFyIHRlY2ggaW4gZGF0YS5UZWNobmljaWFuRGV0YWlscykge1xuICAgICAgICAgICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFucy5wdXNoKGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0uYXR0dWlkKTtcblxuICAgICAgICAgICAgdGhpcy5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5wdXNoKHtcbiAgICAgICAgICAgICAgYXR0dWlkOiBkYXRhLlRlY2huaWNpYW5EZXRhaWxzW3RlY2hdLmF0dHVpZCxcbiAgICAgICAgICAgICAgbmFtZTogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5uYW1lLFxuICAgICAgICAgICAgICBlbWFpbDogZGF0YS5UZWNobmljaWFuRGV0YWlsc1t0ZWNoXS5lbWFpbCxcbiAgICAgICAgICAgICAgcGhvbmU6IGRhdGEuVGVjaG5pY2lhbkRldGFpbHNbdGVjaF0ucGhvbmVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gICAgXG4gIGxvYWRNYXBWaWV3KHR5cGU6IFN0cmluZykge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLnRydWNrSXRlbXMgPSBbXTtcbiAgICB2YXIgbG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oNDAuMDU4MywgLTc0LjQwNTcpO1xuXG4gICAgaWYgKHRoaXMubGFzdExvY2F0aW9uKSB7XG4gICAgICBsb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0aGlzLmxhc3RMb2NhdGlvbi5sYXRpdHVkZSwgdGhpcy5sYXN0TG9jYXRpb24ubG9uZ2l0dWRlKTtcbiAgICB9XG4gICAgdGhpcy5tYXAgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteU1hcCcpLCB7XG4gICAgICBjcmVkZW50aWFsczogJ0FueHBTLTMya1l2QnpqUTVwYlpjbkR6MTdvS0JhMUJxMkhSd0hBTm9OcEhzM1oyNU5EdnFiaGNxSlp5RG9ZTWonLFxuICAgICAgY2VudGVyOiBsb2NhdGlvbixcbiAgICAgIG1hcFR5cGVJZDogdHlwZSA9PSAnc2F0ZWxsaXRlJyA/IE1pY3Jvc29mdC5NYXBzLk1hcFR5cGVJZC5hZXJpYWwgOiBNaWNyb3NvZnQuTWFwcy5NYXBUeXBlSWQucm9hZCxcbiAgICAgIHpvb206IDEyLFxuICAgICAgbGl0ZU1vZGU6IHRydWUsXG4gICAgICAvL25hdmlnYXRpb25CYXJPcmllbnRhdGlvbjogTWljcm9zb2Z0Lk1hcHMuTmF2aWdhdGlvbkJhck9yaWVudGF0aW9uLmhvcml6b250YWwsXG4gICAgICBlbmFibGVDbGlja2FibGVMb2dvOiBmYWxzZSxcbiAgICAgIHNob3dMb2dvOiBmYWxzZSxcbiAgICAgIHNob3dUZXJtc0xpbms6IGZhbHNlLFxuICAgICAgc2hvd01hcFR5cGVTZWxlY3RvcjogZmFsc2UsXG4gICAgICBzaG93VHJhZmZpY0J1dHRvbjogdHJ1ZSxcbiAgICAgIGVuYWJsZVNlYXJjaExvZ286IGZhbHNlLFxuICAgICAgc2hvd0NvcHlyaWdodDogZmFsc2VcbiAgICB9KTtcbiAgICBcbiAgICAvL0xvYWQgdGhlIEFuaW1hdGlvbiBNb2R1bGVcbiAgICAvL01pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoXCJBbmltYXRpb25Nb2R1bGVcIik7XG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnQW5pbWF0aW9uTW9kdWxlJywgZnVuY3Rpb24gKCkge1xuICAgIH0pO1xuXG4gICAgLy9TdG9yZSBzb21lIG1ldGFkYXRhIHdpdGggdGhlIHB1c2hwaW5cbiAgICB0aGlzLmluZm9ib3ggPSBuZXcgTWljcm9zb2Z0Lk1hcHMuSW5mb2JveCh0aGlzLm1hcC5nZXRDZW50ZXIoKSwge1xuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KTtcbiAgICB0aGlzLmluZm9ib3guc2V0TWFwKHRoaXMubWFwKTtcblxuICAgIC8vIENyZWF0ZSBhIGxheWVyIGZvciByZW5kZXJpbmcgdGhlIHBhdGguXG4gICAgdGhpcy5wYXRoTGF5ZXIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTGF5ZXIoKTtcbiAgICB0aGlzLm1hcC5sYXllcnMuaW5zZXJ0KHRoaXMucGF0aExheWVyKTtcblxuICAgIC8vIExvYWQgdGhlIFNwYXRpYWwgTWF0aCBtb2R1bGUuXG4gICAgTWljcm9zb2Z0Lk1hcHMubG9hZE1vZHVsZSgnTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGgnLCBmdW5jdGlvbiAoKSB7IH0pO1xuICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMnLCBmdW5jdGlvbiAoKSB7IH0pO1xuXG4gICAgLy8gQ3JlYXRlIGEgbGF5ZXIgdG8gbG9hZCBwdXNocGlucyB0by5cbiAgICB0aGlzLmRhdGFMYXllciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5FbnRpdHlDb2xsZWN0aW9uKCk7XG5cbiAgICAvLyBBZGQgYSByaWdodCBjbGljayBldmVudCB0byB0aGUgbWFwXG4gICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5tYXAsICdyaWdodGNsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGNvbnN0IHgxID0gZS5sb2NhdGlvbjtcbiAgICAgIHRoYXQuY2xpY2tlZExhdCA9IHgxLmxhdGl0dWRlO1xuICAgICAgdGhhdC5jbGlja2VkTG9uZyA9IHgxLmxvbmdpdHVkZTtcbiAgICAgIHRoYXQucmFkaW91c1ZhbHVlID0gJyc7XG4gICAgICBqUXVlcnkoJyNteVJhZGl1c01vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICB9KTtcblxuICAgIC8vbG9hZCB0aWNrZXQgZGV0YWlsc1xuICAgIHRoaXMuYWRkVGlja2V0RGF0YSh0aGlzLm1hcCwgdGhpcy5kaXJlY3Rpb25zTWFuYWdlcik7XG4gICAgXG4gIH1cblxuICBMb2FkVHJ1Y2tzKG1hcHMsIGx0LCBsZywgcmQsIGlzVHJ1Y2tTZWFyY2gpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICB0aGlzLnRydWNrSXRlbXMgPSBbXTtcblxuICAgIGlmICghaXNUcnVja1NlYXJjaCkge1xuXG4gICAgICB0aGlzLm1hcFNlcnZpY2UuZ2V0TWFwUHVzaFBpbkRhdGEodGhpcy5tYW5hZ2VySWRzKS50aGVuKChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKCFqUXVlcnkuaXNFbXB0eU9iamVjdChkYXRhKSAmJiBkYXRhLnRlY2hEYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB2YXIgdGVjaERhdGEgPSBkYXRhLnRlY2hEYXRhO1xuICAgICAgICAgIHZhciBkaXJEZXRhaWxzID0gW107XG4gICAgICAgICAgdGVjaERhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0ubG9uZyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgaXRlbS5sb25nID0gaXRlbS5sb25nZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnRlY2hJRCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgdmFyIGRpckRldGFpbDogVHJ1Y2tEaXJlY3Rpb25EZXRhaWxzID0gbmV3IFRydWNrRGlyZWN0aW9uRGV0YWlscygpO1xuICAgICAgICAgICAgICBkaXJEZXRhaWwudGVjaElkID0gaXRlbS50ZWNoSUQ7XG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMYXQgPSBpdGVtLmxhdDtcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnNvdXJjZUxvbmcgPSBpdGVtLmxvbmc7XG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TGF0ID0gaXRlbS53ckxhdDtcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLmRlc3RMb25nID0gaXRlbS53ckxvbmc7XG4gICAgICAgICAgICAgIGRpckRldGFpbHMucHVzaChkaXJEZXRhaWwpO1xuICAgICAgICAgICAgICB0aGlzLnB1c2hOZXdUcnVjayhtYXBzLCBpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciByb3V0ZU1hcFVybHMgPSBbXTtcbiAgICAgICAgICByb3V0ZU1hcFVybHMgPSB0aGlzLm1hcFNlcnZpY2UuR2V0Um91dGVNYXBEYXRhKGRpckRldGFpbHMpO1xuXG4gICAgICAgICAgZm9ya0pvaW4ocm91dGVNYXBVcmxzKS5zdWJzY3JpYmUocmVzdWx0cyA9PiB7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IHJlc3VsdHMubGVuZ3RoIC0gMTsgaisrKSB7XG4gICAgICAgICAgICAgIGxldCByb3V0ZURhdGEgPSByZXN1bHRzW2pdIGFzIGFueTtcbiAgICAgICAgICAgICAgbGV0IHJvdXRlZGF0YUpzb24gPSByb3V0ZURhdGEuanNvbigpO1xuICAgICAgICAgICAgICBpZiAocm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcyAhPSBudWxsXG4gICAgICAgICAgICAgICAgJiYgcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMYXQgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMF1cbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNvdXJjZUxvbmcgPSByb3V0ZWRhdGFKc29uLnJlc291cmNlU2V0c1swXS5yZXNvdXJjZXNbMF0ucm91dGVMZWdzWzBdLml0aW5lcmFyeUl0ZW1zWzFdLm1hbmV1dmVyUG9pbnQuY29vcmRpbmF0ZXNbMV1cbiAgICAgICAgICAgICAgICBkaXJEZXRhaWxzW2pdLm5leHRSb3V0ZUxhdCA9IG5leHRTb3VyY2VMYXQ7XG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMb25nID0gbmV4dFNvdXJjZUxvbmc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGxpc3RPZlBpbnMgPSBtYXBzLmVudGl0aWVzO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RPZlBpbnMuZ2V0TGVuZ3RoKCk7IGkrKykge1xuICAgICAgICAgICAgICB2YXIgdGVjaElkID0gbGlzdE9mUGlucy5nZXQoaSkubWV0YWRhdGEuQVRUVUlEO1xuICAgICAgICAgICAgICB2YXIgdHJ1Y2tDb2xvciA9IGxpc3RPZlBpbnMuZ2V0KGkpLm1ldGFkYXRhLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgIHZhciBjdXJQdXNoUGluID0gbGlzdE9mUGlucy5nZXQoaSk7XG4gICAgICAgICAgICAgIHZhciBjdXJyRGlyRGV0YWlsID0gW107XG5cbiAgICAgICAgICAgICAgY3VyckRpckRldGFpbCA9IGRpckRldGFpbHMuZmlsdGVyKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRlY2hJZCA9PT0gdGVjaElkKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIHZhciBuZXh0TG9jYXRpb247XG5cbiAgICAgICAgICAgICAgaWYgKGN1cnJEaXJEZXRhaWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIG5leHRMb2NhdGlvbiA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbihjdXJyRGlyRGV0YWlsWzBdLm5leHRSb3V0ZUxhdCwgY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMb25nKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChuZXh0TG9jYXRpb24gIT0gbnVsbCAmJiBuZXh0TG9jYXRpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBpbkxvY2F0aW9uID0gbGlzdE9mUGlucy5nZXQoaSkuZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dENvb3JkID0gdGhhdC5DYWxjdWxhdGVOZXh0Q29vcmQocGluTG9jYXRpb24sIG5leHRMb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgdmFyIGJlYXJpbmcgPSB0aGF0LmNhbGN1bGF0ZUJlYXJpbmcocGluTG9jYXRpb24sIG5leHRDb29yZCk7XG4gICAgICAgICAgICAgICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4oY3VyUHVzaFBpbiwgdHJ1Y2tVcmwsIGJlYXJpbmcsIGZ1bmN0aW9uICgpIHsgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLm1hcFNlcnZpY2UuZ2V0VHJ1Y2tGZWVkKHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsIHRoaXMubWFuYWdlcklkcykuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgICBpZiAodGhpcy5yZXBvcnRpbmdUZWNobmljaWFucy5zb21lKHggPT4geC50b0xvd2VyQ2FzZSgpID09IGRhdGEudGVjaElELnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgZGF0YSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBmZXRjaGluZyB0cnVja3MgZnJvbSBLYWZrYSBDb25zdW1lci4gRXJyb3JzLT4gJyArIGVyci5FcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ05vIHRydWNrIGZvdW5kIScsICdNYW5hZ2VyJyk7XG4gICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIC8vdGhpcy50b2FzdHIuZXJyb3IoJ0Vycm9yIHdoaWxlIGZldGNoaW5nIGRhdGEgZnJvbSBBUEkhJywgJ0Vycm9yJyk7XG4gICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuXG4gICAgICBjb25zdCBtdHJzID0gTWF0aC5yb3VuZCh0aGF0LmdldE1ldGVycyhyZCkpO1xuICAgICAgdGhpcy5tYXBTZXJ2aWNlLmZpbmRUcnVja05lYXJCeShsdCwgbGcsIG10cnMsIHRoaXMubWFuYWdlcklkcykudGhlbigoZGF0YTogYW55KSA9PiB7XG4gICAgICAgIGlmICghalF1ZXJ5LmlzRW1wdHlPYmplY3QoZGF0YSkgJiYgZGF0YS50ZWNoRGF0YS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICBjb25zdCB0ZWNoRGF0YSA9IGRhdGEudGVjaERhdGE7XG4gICAgICAgICAgbGV0IGRpckRldGFpbHMgPSBbXTtcbiAgICAgICAgICB0ZWNoRGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5sb25nID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBpdGVtLmxvbmcgPSBpdGVtLmxvbmdnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChpdGVtLnRlY2hJRCAhPSB1bmRlZmluZWQpICYmIChkaXJEZXRhaWxzLnNvbWUoeCA9PiB4LnRlY2hJZCA9PSBpdGVtLnRlY2hJRCkgPT0gZmFsc2UpKSB7XG4gICAgICAgICAgICAgIHZhciBkaXJEZXRhaWw6IFRydWNrRGlyZWN0aW9uRGV0YWlscyA9IG5ldyBUcnVja0RpcmVjdGlvbkRldGFpbHMoKTtcbiAgICAgICAgICAgICAgZGlyRGV0YWlsLnRlY2hJZCA9IGl0ZW0udGVjaElEO1xuICAgICAgICAgICAgICBkaXJEZXRhaWwuc291cmNlTGF0ID0gaXRlbS5sYXQ7XG4gICAgICAgICAgICAgIGRpckRldGFpbC5zb3VyY2VMb25nID0gaXRlbS5sb25nO1xuICAgICAgICAgICAgICBkaXJEZXRhaWwuZGVzdExhdCA9IGl0ZW0ud3JMYXQ7XG4gICAgICAgICAgICAgIGRpckRldGFpbC5kZXN0TG9uZyA9IGl0ZW0ud3JMb25nO1xuICAgICAgICAgICAgICBkaXJEZXRhaWxzLnB1c2goZGlyRGV0YWlsKTtcbiAgICAgICAgICAgICAgdGhpcy5wdXNoTmV3VHJ1Y2sobWFwcywgaXRlbSk7XG4gICAgICAgICAgICAgIHRoYXQuZm91bmRUcnVjayA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2YXIgcm91dGVNYXBVcmxzID0gW107XG4gICAgICAgICAgcm91dGVNYXBVcmxzID0gdGhpcy5tYXBTZXJ2aWNlLkdldFJvdXRlTWFwRGF0YShkaXJEZXRhaWxzKTtcblxuICAgICAgICAgIGZvcmtKb2luKHJvdXRlTWFwVXJscykuc3Vic2NyaWJlKHJlc3VsdHMgPT4ge1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSByZXN1bHRzLmxlbmd0aCAtIDE7IGorKykge1xuICAgICAgICAgICAgICBsZXQgcm91dGVEYXRhID0gcmVzdWx0c1tqXSBhcyBhbnk7XG4gICAgICAgICAgICAgIGxldCByb3V0ZWRhdGFKc29uID0gcm91dGVEYXRhLmpzb24oKTtcbiAgICAgICAgICAgICAgaWYgKHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMgIT0gbnVsbFxuICAgICAgICAgICAgICAgICYmIHJvdXRlZGF0YUpzb24ucmVzb3VyY2VTZXRzWzBdLnJlc291cmNlc1swXS5yb3V0ZUxlZ3NbMF0uaXRpbmVyYXJ5SXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXh0U291cmNlTGF0ID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzBdXG4gICAgICAgICAgICAgICAgdmFyIG5leHRTb3VyY2VMb25nID0gcm91dGVkYXRhSnNvbi5yZXNvdXJjZVNldHNbMF0ucmVzb3VyY2VzWzBdLnJvdXRlTGVnc1swXS5pdGluZXJhcnlJdGVtc1sxXS5tYW5ldXZlclBvaW50LmNvb3JkaW5hdGVzWzFdXG4gICAgICAgICAgICAgICAgZGlyRGV0YWlsc1tqXS5uZXh0Um91dGVMYXQgPSBuZXh0U291cmNlTGF0O1xuICAgICAgICAgICAgICAgIGRpckRldGFpbHNbal0ubmV4dFJvdXRlTG9uZyA9IG5leHRTb3VyY2VMb25nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBsaXN0T2ZQaW5zID0gdGhhdC5tYXAuZW50aXRpZXM7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdE9mUGlucy5nZXRMZW5ndGgoKTsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHB1c2hwaW4gPSBsaXN0T2ZQaW5zLmdldChpKTtcbiAgICAgICAgICAgICAgaWYgKHB1c2hwaW4gaW5zdGFuY2VvZiBNaWNyb3NvZnQuTWFwcy5QdXNocGluKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0ZWNoSWQgPSBwdXNocGluLm1ldGFkYXRhLkFUVFVJRDtcbiAgICAgICAgICAgICAgICBjb25zdCB0cnVja0NvbG9yID0gcHVzaHBpbi5tZXRhZGF0YS50cnVja0NvbC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHZhciBjdXJyRGlyRGV0YWlsID0gW107XG5cbiAgICAgICAgICAgICAgICBjdXJyRGlyRGV0YWlsID0gZGlyRGV0YWlscy5maWx0ZXIoZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50ZWNoSWQgPT09IHRlY2hJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBuZXh0TG9jYXRpb247XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VyckRpckRldGFpbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICBuZXh0TG9jYXRpb24gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oY3VyckRpckRldGFpbFswXS5uZXh0Um91dGVMYXQsIGN1cnJEaXJEZXRhaWxbMF0ubmV4dFJvdXRlTG9uZyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG5leHRMb2NhdGlvbiAhPSBudWxsICYmIG5leHRMb2NhdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBwaW5Mb2NhdGlvbiA9IGxpc3RPZlBpbnMuZ2V0KGkpLmdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICB2YXIgbmV4dENvb3JkID0gdGhhdC5DYWxjdWxhdGVOZXh0Q29vcmQocGluTG9jYXRpb24sIG5leHRMb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgICB2YXIgYmVhcmluZyA9IHRoYXQuY2FsY3VsYXRlQmVhcmluZyhwaW5Mb2NhdGlvbiwgbmV4dENvb3JkKTtcbiAgICAgICAgICAgICAgICAgIHZhciB0cnVja1VybCA9IHRoaXMuZ2V0VHJ1Y2tVcmwodHJ1Y2tDb2xvcik7XG4gICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4ocHVzaHBpbiwgdHJ1Y2tVcmwsIGJlYXJpbmcsIGZ1bmN0aW9uICgpIHsgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExvYWQgdGhlIHNwYXRpYWwgbWF0aCBtb2R1bGVcbiAgICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLmxvYWRNb2R1bGUoJ01pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAvLyBSZXF1ZXN0IHRoZSB1c2VyJ3MgbG9jYXRpb25cblxuICAgICAgICAgICAgICBjb25zdCBsb2MgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24odGhhdC5jbGlja2VkTGF0LCB0aGF0LmNsaWNrZWRMb25nKTtcbiAgICAgICAgICAgICAgLy8gQ3JlYXRlIGFuIGFjY3VyYWN5IGNpcmNsZVxuICAgICAgICAgICAgICBjb25zdCBwYXRoID0gTWljcm9zb2Z0Lk1hcHMuU3BhdGlhbE1hdGguZ2V0UmVndWxhclBvbHlnb24obG9jLFxuICAgICAgICAgICAgICAgIHJkLFxuICAgICAgICAgICAgICAgIDM2LFxuICAgICAgICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLlNwYXRpYWxNYXRoLkRpc3RhbmNlVW5pdHMuTWlsZXMpO1xuXG4gICAgICAgICAgICAgIGNvbnN0IHBvbHkgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9seWdvbihwYXRoKTtcbiAgICAgICAgICAgICAgdGhhdC5tYXAuZW50aXRpZXMucHVzaChwb2x5KTtcbiAgICAgICAgICAgICAgLy8gQWRkIGEgcHVzaHBpbiBhdCB0aGUgdXNlcidzIGxvY2F0aW9uLlxuICAgICAgICAgICAgICBjb25zdCBwaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihsb2MsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgaWNvbjogJ2h0dHBzOi8vYmluZ21hcHNpc2RrLmJsb2IuY29yZS53aW5kb3dzLm5ldC9pc2Rrc2FtcGxlcy9kZWZhdWx0UHVzaHBpbi5wbmcnLFxuICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMTIsIDM5KSxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiByZCArICcgbWlsZShzKSBvZiByYWRpdXMnLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIHZhciBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBMYXRpdHVkZTogbHQsXG4gICAgICAgICAgICAgICAgTG9uZ2l0dWRlOiBsZyxcbiAgICAgICAgICAgICAgICByYWRpdXM6IHJkXG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIocGluLCAnY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoYXQucmFkaW91c1ZhbHVlID0gcmQ7XG4gICAgICAgICAgICAgICAgdGhhdC5jbGlja2VkTGF0ID0gbHQ7XG4gICAgICAgICAgICAgICAgdGhhdC5jbGlja2VkTG9uZyA9IGxnO1xuICAgICAgICAgICAgICAgIGpRdWVyeSgnI215UmFkaXVzTW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBwaW4ubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICAgICAgdGhhdC5tYXAuZW50aXRpZXMucHVzaChwaW4pO1xuICAgICAgICAgICAgICB0aGF0LmRhdGFMYXllci5wdXNoKHBpbik7XG5cbiAgICAgICAgICAgICAgLy8gQ2VudGVyIHRoZSBtYXAgb24gdGhlIHVzZXIncyBsb2NhdGlvbi5cbiAgICAgICAgICAgICAgdGhhdC5tYXAuc2V0Vmlldyh7IGNlbnRlcjogbG9jLCB6b29tOiA4IH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbGV0IGZlZWRNYW5hZ2VyID0gW107XG5cbiAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSB0aGlzLm1hcFNlcnZpY2UuZ2V0VHJ1Y2tGZWVkKHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbnMsIHRoaXMubWFuYWdlcklkcykuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZGlyRGV0YWlscy5zb21lKHggPT4geC50ZWNoSWQudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSBkYXRhLnRlY2hJRC50b0xvY2FsZUxvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMucHVzaE5ld1RydWNrKG1hcHMsIGRhdGEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3Igd2hpbGUgZmV0Y2hpbmcgdHJ1Y2tzIGZyb20gS2Fma2EgQ29uc3VtZXIuIEVycm9ycy0+ICcgKyBlcnIuRXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdObyB0cnVjayBmb3VuZCEnLCAnTWFuYWdlcicpO1xuICAgICAgICAgIC8vJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAvL3RoaXMudG9hc3RyLmVycm9yKCdFcnJvciB3aGlsZSBmZXRjaGluZyBkYXRhIGZyb20gQVBJIScsICdFcnJvcicpO1xuICAgICAgICAvLyQoJyNsb2FkaW5nJykuaGlkZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gIH1cblxuICBnZXRUcnVja1VybChjb2xvcikge1xuICAgIGxldCB0cnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUIwQUFBQWRDQVlBQUFCV2syY1BBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSGttbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4TnkweE1pMHhORlF4T1Rvd09Eb3dNeTB3T0Rvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TkRrNk1ERXRNRGc2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGN0TVRJdE1UbFVNVFU2TkRrNk1ERXRNRGc2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdSbU0yVmlNV1F0TkdKbFpDMWpOalEwTFRnelltVXRZalE1WWpabE5EbG1ZbVJtSWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKaFpHOWlaVHBrYjJOcFpEcHdhRzkwYjNOb2IzQTZaR0V4TlRCbFlURXRNakpoWXkwM09UUTVMVGhpTm1FdFpXVTFNVGM0WlRCbU1XRmtJaUI0YlhCTlRUcFBjbWxuYVc1aGJFUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJajRnUEhCb2IzUnZjMmh2Y0RwRWIyTjFiV1Z1ZEVGdVkyVnpkRzl5Y3o0Z1BISmtaanBDWVdjK0lEeHlaR1k2YkdrK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPbVl3WldReFpXTTNMVE0xT1RBdFpHRTBZaTA1TVdJd0xUWXdPVFEyWmpGaE5XUTVZend2Y21SbU9teHBQaUE4Y21SbU9teHBQbmh0Y0M1a2FXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJQQzl5WkdZNmJHaytJRHd2Y21SbU9rSmhaejRnUEM5d2FHOTBiM05vYjNBNlJHOWpkVzFsYm5SQmJtTmxjM1J2Y25NK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPRGhrTXpVMllUY3ROekU0TVMxbE5UUmhMVGs1Wm1VdE5EZ3daVE0xWVdNMk5tWTJJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTNMVEV5TFRFMFZERTVPakE0T2pBekxUQTRPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSnpZWFpsWkNJZ2MzUkZkblE2YVc1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRvMVpEUTJNRGMxWmkwNE1tUm1MV1kzTkRBdFltVTNaUzFtTjJJME16bG1ZamN5TXpFaUlITjBSWFowT25kb1pXNDlJakl3TVRjdE1USXRNVFZVTVRrNk1qTTZNekV0TURnNk1EQWlJSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblE5SWtGa2IySmxJRkJvYjNSdmMyaHZjQ0JEUXlBb1YybHVaRzkzY3lraUlITjBSWFowT21Ob1lXNW5aV1E5SWk4aUx6NGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW5OaGRtVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPbUZrWmpObFlqRmtMVFJpWldRdFl6WTBOQzA0TTJKbExXSTBPV0kyWlRRNVptSmtaaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE9WUXhOVG8wT1Rvd01TMHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0lnYzNSRmRuUTZZMmhoYm1kbFpEMGlMeUl2UGlBOEwzSmtaanBUWlhFK0lEd3ZlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0lEd3ZjbVJtT2xKRVJqNGdQQzk0T25odGNHMWxkR0UrSUR3L2VIQmhZMnRsZENCbGJtUTlJbklpUHo0ZGI3dmpBQUFDZTBsRVFWUkl4OTJXVFd0VFFSU0duek56YjNMVHRLRzFXbEh3cTR1Q2JZWCtBMTI1RUxjdXVpaENSWENwMkgzQmhTdi9nVXZCZ2xKdzRVTEJpZ3BTYVVGY2lGTEZqU0F0c1g2MVNkTTB2WE5jOU5va1JaT1lBUlhuTXF1NXpEUG5uUGU4TTRHcThxZEh3RjhZL3g3MDZyT0pucFRJdGFkZjdvKytMeStWclpoa1JaTDVZempFeE9uMUY1bXBzVVBuYmt5TVRUNXFHenBYbVJsWkx1YkhQN0tFN1VwbjJLNi8xREZWd1dTaG1Gc2RmL2gyWm55Q1NXay92ZmU2ZTc0TnZTYXpKMGZzS3ZWcmRmb1R6S2F3WGlveU4vKzg1RmZUSjd1bjNLY2N3ZGtpRkJzZFhvbFRJSG1EekhiNTFiVG5jQTRYT0dJUk5GU2tRWGRabzZnMVpMb2o2d1dOQm1RMDdOVnA4aW5zaGlBTmd0WFZNbUZYeUlHaC9hZThvQStDMi9uQVdBcDNoT0JEOU11L05RYTZIZG5qWlliUDlKOEdadHFHSGh6YzIxRklyUkhzMnlBb3h3MVBMMWxGZzAwRzBrY3VBcGZhaGk2L0xOenE3T3ZsNVBtamxJdHJhQ0paUVJDdDVscEZ5VVJwNW04dU1QMTVxblQ1eEpYMjAxdXViS1N6YnFzN0pIWTFZU25VUUJGRmpRRU1YOWRXUEcxUVFsVVVSNHlxcmZxQjFyZXBLRGhpbkNoSTZBZlZSSzZTZlBWMjhIT3ZzQmcvcUJORmhHU2J4bGVnazZRTXp2ZVdVV29NUVpydkpteUxyVzJvUVpBWXpHL2M4OTVRRVdrcHdDMHhtZVRDYzU3cFJWdGxZdFFnQ3RZWEtpSzAvb1J5aUZIRWVBb3BkcTdHNUxWcE5hdlRKMUxWbXBwS00rSGlXdE40WTJoYUxJb21LZFltUWtyNjJoZXFBc1lLMWdoaEZPNEFTMTNhQXd0aURXeDZRb3UyWkRLbEhJdHZWcWxVMWxIVnFpRnFuU01RaFNHdVpOQ081bEpxQ0IzY2RXeGw0ZDJyenRucml4aHJjQWwwWnpwVWhWZ2RVZFRKY1A5SXdRdDY5OExqdnYvbWhmOGR0R0hsaDR2NVIxSUFBQUFBU1VWT1JLNUNZSUk9JztcblxuICAgIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09ICdncmVlbicpIHtcbiAgICAgIHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFIa21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UY3RNVEl0TVRsVU1UVTZORGs2TURFdE1EZzZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZV1JtTTJWaU1XUXROR0psWkMxak5qUTBMVGd6WW1VdFlqUTVZalpsTkRsbVltUm1JaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpHRXhOVEJsWVRFdE1qSmhZeTAzT1RRNUxUaGlObUV0WldVMU1UYzRaVEJtTVdGa0lpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09tWXdaV1F4WldNM0xUTTFPVEF0WkdFMFlpMDVNV0l3TFRZd09UUTJaakZoTldRNVl6d3ZjbVJtT214cFBpQThjbVJtT214cFBuaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMlBDOXlaR1k2YkdrK0lEd3ZjbVJtT2tKaFp6NGdQQzl3YUc5MGIzTm9iM0E2Ukc5amRXMWxiblJCYm1ObGMzUnZjbk0rSUR4NGJYQk5UVHBJYVhOMGIzSjVQaUE4Y21SbU9sTmxjVDRnUEhKa1pqcHNhU0J6ZEVWMmREcGhZM1JwYjI0OUltTnlaV0YwWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEUwVkRFNU9qQTRPakF6TFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpOCtJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKellYWmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG8xWkRRMk1EYzFaaTA0TW1SbUxXWTNOREF0WW1VM1pTMW1OMkkwTXpsbVlqY3lNekVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UVlVNVGs2TWpNNk16RXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpSUhOMFJYWjBPbU5vWVc1blpXUTlJaThpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09tRmtaak5sWWpGa0xUUmlaV1F0WXpZME5DMDRNMkpsTFdJME9XSTJaVFE1Wm1Ka1ppSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4T1ZReE5UbzBPVG93TVMwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4TDNKa1pqcFRaWEUrSUR3dmVHMXdUVTA2U0dsemRHOXllVDRnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrSUR3dmNtUm1PbEpFUmo0Z1BDOTRPbmh0Y0cxbGRHRStJRHcvZUhCaFkydGxkQ0JsYm1ROUluSWlQejRkYjd2akFBQUNlMGxFUVZSSXg5MldUV3RUUVJTR256TnpiM0xUdEtHMVdsSHdxNHVDYllYK0ExMjVFTGN1dWloQ1JYQ3AySDNCaFN2L2dVdkJnbEp3NFVMQmlncFNhVUZjaUZMRmpTQXRzWDYxU2RNMHZYTmM5Tm9rUlpPWUFSWG5NcXU1ekRQbm5QZThNNEdxOHFkSHdGOFkveDcwNnJPSm5wVEl0YWRmN28rK0x5K1ZyWmhrUlpMNVl6akV4T24xRjVtcHNVUG5ia3lNVFQ1cUd6cFhtUmxaTHViSFA3S0U3VXBuMks2LzFERlZ3V1NobUZzZGYvaDJabnlDU1drL3ZmZTZlNzROdlNhekowZnNLdlZyZGZvVHpLYXdYaW95Ti8rODVGZlRKN3VuM0tjY3dka2lGQnNkWG9sVElIbUR6SGI1MWJUbmNBNFhPR0lSTkZTa1FYZFpvNmcxWkxvajZ3V05CbVEwN05WcDhpbnNoaUFOZ3RYVk1tRlh5SUdoL2FlOG9BK0MyL25BV0FwM2hPQkQ5TXUvTlFhNkhkbmpaWWJQOUo4R1p0cUdIaHpjMjFGSXJSSHMyeUFveHcxUEwxbEZnMDBHMGtjdUFwZmFoaTYvTE56cTdPdmw1UG1qbEl0cmFDSlpRUkN0NWxwRnlVUnA1bTh1TVAxNXFuVDV4SlgyMDF1dWJLU3picXM3SkhZMVlTblVRQkZGalFFTVg5ZFdQRzFRUWxVVVI0eXFyZnFCMXJlcEtEaGluQ2hJNkFmVlJLNlNmUFYyOEhPdnNCZy9xQk5GaEdTYnhsZWdrNlFNenZlV1VXb01RWnJ2Sm15THJXMm9RWkFZekcvYzg5NVFFV2twd0MweG1lVENjNTdwUlZ0bFl0UWdDdFlYS2lLMC9vUnlpRkhFZUFvcGRxN0c1TFZwTmF2VEoxTFZtcHBLTStIaVd0TjRZMmhhTElvbUtkWW1Ra3I2MmhlcUFzWUsxZ2hoRk80QVMxM2FBd3RpRFd4NlFvdTJaREtsSEl0dlZxbFUxbEhWcWlGcW5TTVFoU0d1Wk5DTzVsSnFDQjNjZFd4bDRkMnJ6dG5yaXhocmNBbDBaenBVaFZnZFVkVEpjUDlJd1F0Njk4TGp2di9taGY4ZHRHSGxoNHY1UjFJQUFBQUFTVVZPUks1Q1lJST0nO1xuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAncmVkJykge1xuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUgzbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5USTZNakV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk1EVmpNemMxWkRZdE1XTmxPQzFrWmpSbExUZ3dZamd0TWpsbVlUUmhaakEyWkRFM0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WkdSbU1HSXpZbUV0TVdOaVpDMWhNalEwTFdFeVpXTXRNVGc0WVRsa09HUmxNamswSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEcG1NR1ZrTVdWak55MHpOVGt3TFdSaE5HSXRPVEZpTUMwMk1EazBObVl4WVRWa09XTThMM0prWmpwc2FUNGdQSEprWmpwc2FUNTRiWEF1Wkdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5qd3ZjbVJtT214cFBpQThMM0prWmpwQ1lXYytJRHd2Y0dodmRHOXphRzl3T2tSdlkzVnRaVzUwUVc1alpYTjBiM0p6UGlBOGVHMXdUVTA2U0dsemRHOXllVDRnUEhKa1pqcFRaWEUrSUR4eVpHWTZiR2tnYzNSRmRuUTZZV04wYVc5dVBTSmpjbVZoZEdWa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qZzRaRE0xTm1FM0xUY3hPREV0WlRVMFlTMDVPV1psTFRRNE1HVXpOV0ZqTmpabU5pSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TldRME5qQTNOV1l0T0RKa1ppMW1OelF3TFdKbE4yVXRaamRpTkRNNVptSTNNak14SWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTFWREU1T2pJek9qTXhMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0p6WVhabFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEb3dOV016TnpWa05pMHhZMlU0TFdSbU5HVXRPREJpT0MweU9XWmhOR0ZtTURaa01UY2lJSE4wUlhaME9uZG9aVzQ5SWpJd01UY3RNVEl0TVRsVU1UVTZOVEk2TWpFdE1EZzZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lJSE4wUlhaME9tTm9ZVzVuWldROUlpOGlMejRnUEM5eVpHWTZVMlZ4UGlBOEwzaHRjRTFOT2tocGMzUnZjbmsrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrN1NkQXdBQUFBc3BKUkVGVVNNZmxsN3RyRkZFWXhYL2ZuWmxkTndtSkdrS0lDRDRpSVdLbElvcXJWajQ2UVZCc2ZZRDRIMmhoYlpBVTJvaUluVnFJV0dobEk2Z2dCbEY4Qk44aEtvaEVvaEkxYmpiN3VQZXoyTkhkVGR6WlpTZG80UXpmYmVZTzU1N3ZuSHZ1aktncWYvc3kvSVBMajNyNDlNNDloc2R1SlZvR0w2N29IQ2RoQStObXpoR1ViQ0VuRDdjdW45alR1ZnJEMkxKZXUrWHd3ZVpCYjU0OHNYakRaTzcwc2x4eVhiN0RwVVFvYTZGbFdPYzhXZjlvWW5TczkrMEYrbGFlQTZhYUJ2MTBlMmpORjV2ZHVhNS9KZGJPSUZsaEJUV0sxZnphOXVmRGl3cmJkbndCTGphdDZSdkQ0SStXZG5DR2d0UHEwbkxaSWtDQ0owclBsWWNQenNjeTB0MVBIL3UrK1VicjJrMHNTVHllR2NQQTFjdTVXS0NacnU0ejg3SFRvTXhUYWxaU0JhUklkNkRqMjlLYmpzWnk3NzcrdmxQMjVZdEROd0lmRFlJcUlhWENTRVlNTU0yU25MRzczbzFmaXdXNnU2ZDc3L3dIOTR2WFh3NTdXWkVLSUpBS1Azbk9wOFBsU1U5ODcxcDE1bXdpRnVqemtkSDkvUjJkeVMyWkgzZ0pueitsbHdBT2gvb3BKbHVVenlPdkRuUkJaSXNsS2dhUHRiWG10MmNMd2RMTmFlekNCZURjckMxVFltd2htVUplajNEcHlXT09xRXJUVENXVExiWjZ5YUROR0p4VUNWbkZWTVZnOEZEeFNFQTJWbnN4QnNWZ3c2SkdWNHgxcUhHSWsvalo2d0FuSllLaTFTbFVGVTRDaUlDVTNvbkhGRkJWU25mWnNiTkJGUlZGYU95WWpBd0hUOEZaQzFvYk1OeXBnR0NkYStpczlPdXZTRkEwSERWS2lIRGVYTFQzTjVCRU5OZ0FqWm1vSVZBSmgxKzYxV0phOHRJY3VOY1RyVVJGTklLcENJak1qYVlGVlN3T0U4SFVkNHBUeFRiNGtWZTN2UWdJSWN1b2RGTnBXTlhvR0pRd0Q0d0J6OVJNQjZjT01WSmFYRnpRaEFxdG51QmxNNWhKSDdVV0Nkcyt5OU1KaHlrV0NCb3dVeVJvemxudnZiT01EZzFWZ1pod1o4b003Z0h3R2J4WW9PbUI0MTlOTWQrR3l4VVU1N1FpQ2lwUHVGSUpCdDlzREZKVGRXM3kzL3hXL0FSTnBqdnhsODB1TEFBQUFBQkpSVTVFcmtKZ2dnPT0nO1xuICAgIH0gZWxzZSBpZiAoY29sb3IudG9Mb3dlckNhc2UoKSA9PSAneWVsbG93Jykge1xuICAgICAgdHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCMEFBQUFkQ0FZQUFBQldrMmNQQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUlLbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE55MHhNaTB4TkZReE9Ub3dPRG93TXkwd09Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5UZzZOVFV0TURnNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRjdE1USXRNVGxVTVRVNk5UZzZOVFV0TURnNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNllXUTRNakZrWmpNdFptRmxOQzB4TWpRekxUbGpaVFV0Wm1Ga04yRTJNVGRtTlRVM0lpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpVd04ySXhZbU10TkRCa1pTMHdaRFF5TFdJd1pUY3RNR1U0TmpObU56VmtOakEwSWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0Roa016VTJZVGN0TnpFNE1TMWxOVFJoTFRrNVptVXRORGd3WlRNMVlXTTJObVkySWo0Z1BIQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSEprWmpwQ1lXYytJRHh5WkdZNmJHaytZV1J2WW1VNlpHOWphV1E2Y0dodmRHOXphRzl3T2pBd01ESmxORGhsTFRobU9XVXROalUwWXkwNVlqUTJMVFZtWVdaa01UQmhOMkUyTnp3dmNtUm1PbXhwUGlBOGNtUm1PbXhwUG1Ga2IySmxPbVJ2WTJsa09uQm9iM1J2YzJodmNEbzRNemN4WTJVMllTMHhZV1prTFRFME5ETXRPVGd4WkMxa04yRTROR1kxTm1VMFpXVThMM0prWmpwc2FUNGdQSEprWmpwc2FUNWhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2WmpCbFpERmxZemN0TXpVNU1DMWtZVFJpTFRreFlqQXROakE1TkRabU1XRTFaRGxqUEM5eVpHWTZiR2srSUR4eVpHWTZiR2srZUcxd0xtUnBaRG80T0dRek5UWmhOeTAzTVRneExXVTFOR0V0T1RsbVpTMDBPREJsTXpWaFl6WTJaalk4TDNKa1pqcHNhVDRnUEM5eVpHWTZRbUZuUGlBOEwzQm9iM1J2YzJodmNEcEViMk4xYldWdWRFRnVZMlZ6ZEc5eWN6NGdQSGh0Y0UxTk9raHBjM1J2Y25rK0lEeHlaR1k2VTJWeFBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpWTNKbFlYUmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG80T0dRek5UWmhOeTAzTVRneExXVTFOR0V0T1RsbVpTMDBPREJsTXpWaFl6WTJaallpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGN0TVRJdE1UUlVNVGs2TURnNk1ETXRNRGc2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qVmtORFl3TnpWbUxUZ3laR1l0WmpjME1DMWlaVGRsTFdZM1lqUXpPV1ppTnpJek1TSWdjM1JGZG5RNmQyaGxiajBpTWpBeE55MHhNaTB4TlZReE9Ub3lNem96TVMwd09Eb3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WVdRNE1qRmtaak10Wm1GbE5DMHhNalF6TFRsalpUVXRabUZrTjJFMk1UZG1OVFUzSWlCemRFVjJkRHAzYUdWdVBTSXlNREUzTFRFeUxURTVWREUxT2pVNE9qVTFMVEE0T2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BuZXdZNlVBQUFKRVNVUkJWRWpIM1ZZeGF4UlJFUDYrOS9heXVkVUlrU05uQ0FvUmxZaUlXZ21DaFJEc1JVdGJDMytBbHNIV3dsWWJpMWhwWXhFRW0xaXBNUkJSRVVROGdvMlNIQ2tpM2wyNDNON3V6VmdrSm5mSHVidTVGeEp3NExIRnpzNDM4MzN6Wm9lcWlyMDJnMzJ3ZlFIMWtsNVdWbitWdjN5NEZ4dzc4a3dPRFIyRXlJWVUyaVAxOVZEd2MrV2lHVDkxdjE0Y0hSOU5pc3NrVGFjZlhHdGNuWHpyRjBaK0l3elo5bFUzdENESWU1aDkxY1NhWEFwdjNKd2I3SnZlVDU4L3l0SnlEYW9XYkQ5aVFmRzJEdFNEVWhERkZxVnZKWEhTZEhwR01MOUErRUZ5RUFWaFNVVHhBQjQveWJ0cDJsQkJzd1hBRXRacU83ZGRtU3RvRmJSQUxRcmRRR2RuSHFKVnZZMXF0UUxHQnY5U24xRFVRb1ZxQTFOM2I2V0NNbTA0dkg2UjE3bUZZUWdEV0x0TmFFZWxhbUFOY081TUdaUFgxK2dFK3ZUUlVXMjJobEE0L0FOeFJORDJ2RENnS093QU1IRkM4ZnpsMlBxZHFjV2diM3BQbjZ4aHRUNk9rV0lSS2dyVm5wS0NDbmcrOFdaK0JXT0ZpcHVtVVd3UVJ6SE9uajhPU01xTXpnK2d2TlJDNGNDeUcrZ1drK3NSNHBZa3V1VUl4RkdNTURTT29HeDdNc1dQdXpSN3Q2dE5pYW85RXUwWFZEdm1yS1l6b3J0VXFUSmpwWnVkcmE2Z1pIZlVoRUwxYjRLdTlITG5uY0lNYm9uOWJWUkJFRHZabzlRVkZKcXRQdDBjU3dSaE1pVG9wWEZGQXBxbGU5bGpvZWl2ZTZWTm8vVHVKYk9KbWdocVFmaStCMlRVZEFOUEhLK01XdjIrMk9UbEt4Nk1tRVJHTUppRDczdXdvSEVDSFM3Nks4VjZJWGovTGhJVmR2ekt1aTNuQTZXdkRYTmh3dGFkTjRmL1pzUC9Bd3p0NVIzYnNRMmpBQUFBQUVsRlRrU3VRbUNDJztcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gJ3B1cnBsZScpIHtcbiAgICAgIHRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQjBBQUFBZENBWUFBQUJXazJjUEFBQUFDWEJJV1hNQUFBN0VBQUFPeEFHVkt3NGJBQUFIM21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRE10TURKVU1USTZNakE2TXpNdE1EVTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRE10TURKVU1USTZNakE2TXpNdE1EVTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZalZtWW1VM1lqWXRaR1ExT0Mxak56UmlMVGhtWkdZdFlqSmtOalUxTlRZM09URTBJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNlpqQXhObVptTmpjdFlXWXhaQzAyTVRRNUxUZ3pNalF0WkRNME9HWTFOemcwWlRrMElpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNk9EaGtNelUyWVRjdE56RTRNUzFsTlRSaExUazVabVV0TkRnd1pUTTFZV00yTm1ZMklqNGdQSEJvYjNSdmMyaHZjRHBFYjJOMWJXVnVkRUZ1WTJWemRHOXljejRnUEhKa1pqcENZV2MrSUR4eVpHWTZiR2srWVdSdlltVTZaRzlqYVdRNmNHaHZkRzl6YUc5d09qQXdNREpsTkRobExUaG1PV1V0TmpVMFl5MDVZalEyTFRWbVlXWmtNVEJoTjJFMk56d3ZjbVJtT214cFBpQThjbVJtT214cFBtRmtiMkpsT21SdlkybGtPbkJvYjNSdmMyaHZjRHBtTUdWa01XVmpOeTB6TlRrd0xXUmhOR0l0T1RGaU1DMDJNRGswTm1ZeFlUVmtPV004TDNKa1pqcHNhVDRnUEhKa1pqcHNhVDU0YlhBdVpHbGtPamc0WkRNMU5tRTNMVGN4T0RFdFpUVTBZUzA1T1dabExUUTRNR1V6TldGak5qWm1Oand2Y21SbU9teHBQaUE4TDNKa1pqcENZV2MrSUR3dmNHaHZkRzl6YUc5d09rUnZZM1Z0Wlc1MFFXNWpaWE4wYjNKelBpQThlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BISmtaanBUWlhFK0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0pqY21WaGRHVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPamc0WkRNMU5tRTNMVGN4T0RFdFpUVTBZUzA1T1dabExUUTRNR1V6TldGak5qWm1OaUlnYzNSRmRuUTZkMmhsYmowaU1qQXhOeTB4TWkweE5GUXhPVG93T0Rvd015MHdPRG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJQ2hYYVc1a2IzZHpLU0l2UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGljMkYyWldRaUlITjBSWFowT21sdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk5XUTBOakEzTldZdE9ESmtaaTFtTnpRd0xXSmxOMlV0WmpkaU5ETTVabUkzTWpNeElpQnpkRVYyZERwM2FHVnVQU0l5TURFM0xURXlMVEUxVkRFNU9qSXpPak14TFRBNE9qQXdJaUJ6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQnpkRVYyZERwamFHRnVaMlZrUFNJdklpOCtJRHh5WkdZNmJHa2djM1JGZG5RNllXTjBhVzl1UFNKellYWmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRHBpTldaaVpUZGlOaTFrWkRVNExXTTNOR0l0T0daa1ppMWlNbVEyTlRVMU5qYzVNVFFpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGd0TURNdE1ESlVNVEk2TWpBNk16TXRNRFU2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpSUhOMFJYWjBPbU5vWVc1blpXUTlJaThpTHo0Z1BDOXlaR1k2VTJWeFBpQThMM2h0Y0UxTk9raHBjM1J2Y25rK0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBpQThMM0prWmpwU1JFWStJRHd2ZURwNGJYQnRaWFJoUGlBOFAzaHdZV05yWlhRZ1pXNWtQU0p5SWo4KzM0MTNqd0FBQXVwSlJFRlVTTWZsbDg5dlZGVVV4ei9uM3Z1bTA0TGxWOER3YTFHUk5vUzR3S1lRNDBwd1JRZzdvd2x1Y0NFYk5xendEMkNIQ3pmS1FsZVd4QkJXSnBDNFF6WUVROExDS0tMU0FGV1VTSkJTeTB3Nzc5NXpYTHdwbmFZejB6cXYwWVZuY2llWm5KdjN2ZWY3L1o1ejM0aVo4VytINHorSTBDMTVjZndTRDI5ZXFlUVhYbm01TnIycElsblNwYWNXR3JFdXovWmVlVEs2NjlpRHFhSGYwb2t6Ny9RT2V1T3ptenVHcHQ3OGVHc2FHdE8xalg0bjhsd0xhOElyb0VHbE9qazZNWk05R0dmWVBnVnFQWU5PWG4vNjZ2ckcwNk43ZG00ZzE3UW9aeTNDWkFMRU5CcHZyZDhtYjh3OEJzNzNyT21qeXYyenMvMDFvZ2xSNDZLVmJHSFZVNklSWUNKOHYvWHFqMTk5WHNwSTM4MThNMXdQMDliQ2F0dW9BSTQrN2xkdWMvN3JUK1pLZ2NhTjlYTXY2THBaQVRLcmRseWVQaktCRjlQbVAxN2I5L29IcGR4N2VNZGJINlZiNmYxdkI2NmlZa2hMVHF6NFpZQWlWS093cWJZejdmMzU2SmVsUUE4T0huazdqMnZpRHo5ZDgxSG1XQXk3RUxsM0RPYURiR2YzNWlPbkQxWktnZDc1WmVMNGxqRFM5MUljbzJKOUdOcG1sNEFxaVBDWFRUTTVlZmM5R08xS3NYUWJnKy9LcWNZSVk5bkk4QWl5SVMrNG5HK1pKcjJDNEJXczM4anZCQzQvL0lKeCsxQjZyblNXdVpneGtQWExHcHhGUktWTm5ZS0pvU3FJZVFKWnZSUzlna014b2lTY0pLVEQrVTBkbWlDWkt6OTdGUzEwTkNubzdLQ0VpSUVBb21oYjNYdTZaUXlqcy9iT0RIRUdyT3lhWEFaVWlPU1lGZHAxWk1RVnVhUUp0NEk2WFBla3c1cDFkck9qMStKSXhiaVUxYURYV3I3YlIzTEdQM24vQ010dEVBUVI4QUxXWWZBN0JXdnVLdzJhRWZCTk1wSXR6TnNsbFFvRm9IVFhmb1Y5V2hnSnRHdWxvZ0cxaEpxdURyMitzQWpKckdPbFVJemZWZEhVTmFrU1o3Z0FGanQ1TGVHOXpEdWdMR2hHbFFHazdwRWdrT1lmNjFyOExJZ0pXb0dzWVFTeWNxQU5adjBqZnVYM2UzZWZUeVJwZnRvMWlTY3d6WisrRk9paGt3ZW1mTU92RFhQa1RrM25nVlIwU1MrckdDbUlHNjd1cnkzYmh2K2J2eFYvQThzVlFBZzgrZ0RZQUFBQUFFbEZUa1N1UW1DQyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWNrVXJsO1xuICB9XG5cbiAgY29udmVydE1pbGVzVG9GZWV0KG1pbGVzKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobWlsZXMgKiA1MjgwKTtcbiAgfVxuXG4gIHB1c2hOZXdUcnVjayhtYXBzLCB0cnVja0l0ZW0pIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICB2YXIgY3VycmVudE9iamVjdCA9IHRoaXM7XG4gICAgdmFyIHBpbkxvY2F0aW9uID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHRydWNrSXRlbS5sYXQsIHRydWNrSXRlbS5sb25nKTtcbiAgICB2YXIgZGVzdExvYyA9IG5ldyBNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvbih0cnVja0l0ZW0ud3JMYXQsIHRydWNrSXRlbS53ckxvbmcpO1xuICAgIHZhciBpY29uVXJsO1xuICAgIHZhciBpbmZvQm94VHJ1Y2tVcmw7XG4gICAgdmFyIE5ld1BpbjtcbiAgICB2YXIgam9iSWRVcmwgPSAnJztcblxuICAgIHZhciB0cnVja0NvbG9yID0gdHJ1Y2tJdGVtLnRydWNrQ29sLnRvTG93ZXJDYXNlKCk7XG4gICAgaWNvblVybCA9IHRoaXMuZ2V0SWNvblVybCh0cnVja0NvbG9yLCB0cnVja0l0ZW0ubGF0LCB0cnVja0l0ZW0ubG9uZywgdHJ1Y2tJdGVtLndyTGF0LCB0cnVja0l0ZW0ud3JMb25nKTtcblxuICAgIGlmICh0cnVja0NvbG9yID09ICdncmVlbicpIHtcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXJDQVlBQUFEYmpjNnpBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRkdtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd05TMHdNVlF4TmpveE1Ub3hNQzB3TkRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TWpBdE1EUTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNakF0TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9UZGtaakUwWW1RdE5EQmhPQzAxTkRSakxUa3pPVEF0TTJSaU5tWmtZVFptTW1KbElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSmhaRzlpWlRwa2IyTnBaRHB3YUc5MGIzTm9iM0E2TUdGa00ySXlaREl0T0RCaE5pMHhNRFJrTFRoaU56UXRaalZoWkRGbU1UaGxZekV5SWlCNGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T1Rka1pqRTBZbVF0TkRCaE9DMDFORFJqTFRrek9UQXRNMlJpTm1aa1lUWm1NbUpsSWo0Z1BIaHRjRTFOT2tocGMzUnZjbmsrSUR4eVpHWTZVMlZ4UGlBOGNtUm1PbXhwSUhOMFJYWjBPbUZqZEdsdmJqMGlZM0psWVhSbFpDSWdjM1JGZG5RNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzVOMlJtTVRSaVpDMDBNR0U0TFRVME5HTXRPVE01TUMwelpHSTJabVJoTm1ZeVltVWlJSE4wUlhaME9uZG9aVzQ5SWpJd01UZ3RNRFV0TURGVU1UWTZNVEU2TVRBdE1EUTZNREFpSUhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5ROUlrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QW9WMmx1Wkc5M2N5a2lMejRnUEM5eVpHWTZVMlZ4UGlBOEwzaHRjRTFOT2tocGMzUnZjbmsrSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGlBOEwzSmtaanBTUkVZK0lEd3ZlRHA0YlhCdFpYUmhQaUE4UDNod1lXTnJaWFFnWlc1a1BTSnlJajgrT2R1SzNRQUFBdzlKUkVGVWFON3RtajFQRzBFUWh1OG51S2VoREowcmxOSlNKR3BIcENXeWxEWUY2YUFCVjZRaVFRS2xTUlJNRlNVRnBxTkJtQW9FQmFRZ3BEVGlRNVFHbXBTYmU5RnROQm4yem50M084ZDllS1NSYlRqdHZ2ZmM3c3pjN25xZWtDbWwycXJZZHVKN1RRcE9RL2R5LytkZWZUbllVTXU5dGR3N2RFSXZzYTRVb0MzZHc5U25sMnBzNFZsaEhIcXBKUVZROS8yajd6M2ZCMkZqOU5mTjcwTEIwWDdRUDBvR0tBRFRzNTNFNktneWdQeHJGemtBekZjMFJoMmpwbktBL092VytjaDQ4KzJ0c2ZGWDY2K3JCWWpEV2R4K0g5bDRwUUJ4T08rNjgwTWJyd3lnSkhBcUF5Z3BuRW9BU2dPbjlJRFN3aWsxSVAvN1NsbzRwUVhrZnpaZHdDa3pvTDRMT0tVRVJFZlBqNU51NnNiTENLaWpmenovOEdJRXlBQUlLMmZxY25EdHBQRXlBbko2TXlOQVF4elRsSnFMYVp1bFR5eE5xanV5N09wSlBHMjZKblF4dUZLem0zTnErdXRNN2gwNm9mZS9KVmNKUUhTYUZkeG1QYWw0Z1hxSzdSQVV6Ylowa1NnV1VER2ZzY0NHK29vdnplYlJtYlhGQVJYTlI0Q3lCSVRwb3lNL1B2TzBRWWpTZ21xekxUV2NBRUpuMzQ4M2pWRU5LWEo1ZC9YSndHQ241WlNVR05UMis0Y1AyVlVVRURMVG5VVm1na2lNc0N6aGhEMDBicC8zTjJRQTRlbndiV1ZrS0R3Vk9OLzR6eElTaDRONzBkcWdHMW1VYXNQMVRnSHg4anRzYnd6WDBTcmF4ZktKemFpMldleERhS0RhVE5QdFVaRm9Dd2hIUTJ3M0RnRUpLd05adll2UlY0TTQyazdad1FwRDlkL1FnUGFHM1l3V1lic2tRcWZqTU5HdWpxcllhcU1qanQ0dlFnU3pjUTJvcGYreWZiYnpLRzdndHpZMEVyZW1rS3l2Nk1pMjFVYnZSNTh2NEdlQ01HajRkczlQL1IvRUdrUjZwR3M0RFlBUVpDdGV4eXlkK2lVY3FUdUpOcHI2UTdKZm5RT3FVVWhobG1RRVpXVkpBSVZZSzJ5N3VSWWN2THlOcW0veXV0eGhxNDJYSy9UdC9WOWd0anlFU2IwVFoxdUlEdjBnQ1RRRXZSMlZ1cm16U3ZzOGFLT1c5bERtT0kxUlVVSU1jN3J1Q1Z0d293L2FvdDRKRGRwYVl1ZWUwUmxlQkpFVklNcTBYT2xVUUxTMlpnSnRIUWtoS3pIQ1F0dkwwR2k1WW1FZDZhZDFIdEg1bm5Xd2M2K3RUZ3RmZzBGM00wNmJmd0c0VHY4WHkraFBhQUFBQUFCSlJVNUVya0pnZ2c9PSc7XG4gICAgfSBlbHNlIGlmICh0cnVja0NvbG9yID09ICdyZWQnKSB7XG4gICAgICBpbmZvQm94VHJ1Y2tVcmwgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFZ0FBQUFyQ0FZQUFBRGJqYzZ6QUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUZFbWxVV0hSWVRVdzZZMjl0TG1Ga2IySmxMbmh0Y0FBQUFBQUFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDJMV014TkRJZ056a3VNVFl3T1RJMExDQXlNREUzTHpBM0x6RXpMVEF4T2pBMk9qTTVJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlnZUcxc2JuTTZjR2h2ZEc5emFHOXdQU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNCb2IzUnZjMmh2Y0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCNGJYQTZRM0psWVhSbFJHRjBaVDBpTWpBeE9DMHdOUzB3TVZReE5qb3hNVG95TVMwd05Eb3dNQ0lnZUcxd09rMXZaR2xtZVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNak10TURRNk1EQWlJSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVTlJakl3TVRndE1EVXRNREZVTVRZNk1UVTZNak10TURRNk1EQWlJR1JqT21admNtMWhkRDBpYVcxaFoyVXZjRzVuSWlCd2FHOTBiM05vYjNBNlEyOXNiM0pOYjJSbFBTSXpJaUJ3YUc5MGIzTm9iM0E2U1VORFVISnZabWxzWlQwaWMxSkhRaUJKUlVNMk1UazJOaTB5TGpFaUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNlpqQTFZMlZtTkRjdE0yTmpZaTAzWWpRMkxXSTFaalF0TjJJNU1EQXdNamcxTWpsbElpQjRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09tWXdOV05sWmpRM0xUTmpZMkl0TjJJME5pMWlOV1kwTFRkaU9UQXdNREk0TlRJNVpTSWdlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09tWXdOV05sWmpRM0xUTmpZMkl0TjJJME5pMWlOV1kwTFRkaU9UQXdNREk0TlRJNVpTSStJRHg0YlhCTlRUcElhWE4wYjNKNVBpQThjbVJtT2xObGNUNGdQSEprWmpwc2FTQnpkRVYyZERwaFkzUnBiMjQ5SW1OeVpXRjBaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2WmpBMVkyVm1ORGN0TTJOallpMDNZalEyTFdJMVpqUXROMkk1TURBd01qZzFNamxsSWlCemRFVjJkRHAzYUdWdVBTSXlNREU0TFRBMUxUQXhWREUyT2pFeE9qSXhMVEEwT2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BwS3BjS2NBQUFMNFNVUkJWR2plN1pyTlNqTXhGSWJuRXVZU3VuYlZuVnMzN3NVYmNHNUE2Tlp1bktVN1hlamE2ZzIwRjFDdzYyNFVRU3dJL2tCRkVJcEZRUkNFbUxjMGNucWNURE16eVRnL1BYQSs5V05JM2p4SlRrNStQTStCQ1NGQ1VXNjdsTzU3anVCc3FGcSszOS9GNi9tNWVEazVLYnhESi9RUzY3b0MxRk0xakxhM3hlWGFXbWtjZXBrMTBnQm9TaitVZmlIOVRUZEdQMGVqVXNGUi9qRWMwbWFFU2NGY21FNWlWRlFiUVBMRGZRNEE4eFdGVWNlb3FSMGcrZEVwSHhuM3U3dVJoZDhGUWIwQWNUampnNFBZd21zRmlNTjVhcmVYRmw0YlFHbmcxQVpRV2ppMUFKUUZUdVVCWllWVGFVRHlsNk9zY0NvTFNQNnpaUU5PbFFFOTJJQlRaVUF6bS9SNm1RdXZOS0NiemMwVklCMmdyK2RuSzRWWEZwQ3R4cXdBTFhGTVUybzJwbTJlZnIyK3pvOWRXNTd0M3FablFsL2pzWGphMnhOM096dUZkK2lFWG1hK2RVQjBtcFhjV2lxTHRoNHZrRSt4b1ZvMjY5RTltSk9BaXZtTUF6YmtWL3hvdG9qT0xIUU9xR3krQXBRbklFd2ZGZm54czBnWGhFZ3RxRGJUVk1NS0lGUTI2WFlqb3hxV3lKZmo0MzhEZzV1V3o5dGI3UjBkVmxlbmdFeFhKb2pFQ01zVGpxN1R1TDJlbmJrQmhON2gxOHBZb2RBcmNIN3hueWNrRGdkdFVkcWdHNnNvMVlidnJRTGk2YmZ1Ymd6ZjBTemF4dkdKeWFnMk9leERhS0Rhb3FaYlpKSm9BZ2hQUTB3dkRnRUpKd041N2NYbzFpQ0pOb3p3SmRuL3hnS2d1TVlvRWFaSEluUTZMaE50NjZtS3FUWTY0bWg3RVNLMHoxN1UvMHo3L1Q5eEEzLy9CamhaU05LY3dtVitSVWUycVRiYUh2VytJT0pOMElEZmhWMHR2QWlUa1I3TE5ad0dRQWd5RmE5aWxscjZYVGpkSGlUUlJqdFBzL28xT1NDZlF0SXVrU2xHVUY2V0JwREdBdDFkdkQ5L2VEbU55MitLZXR4aHFvMm5LM1QzdmhDWURSNWhVdThrdVJaaU8rTkJSSGsyUFl4YnV2OGM1aTFtMm8vek12eXNqekliTkViRkNZbVkwMDNQc2MwYk90TVd0eWVNMEJZNGUvZU15ckFSeEtvQVVacmp5c0RMd2ZqTnNLRzJqZ3NoUnduQ1F1amxhT2lNQk5vNnJudnJNYWJ5Z1hHd3M2K3RPYTlmWjlDOWxiVGNIeEhCeEI3SjZlVFZBQUFBQUVsRlRrU3VRbUNDJztcbiAgICB9IGVsc2UgaWYgKHRydWNrQ29sb3IgPT0gJ3llbGxvdycpIHtcbiAgICAgIGluZm9Cb3hUcnVja1VybCA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUVnQUFBQXNDQVlBQUFER2lQNExBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBRkVtbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhORElnTnprdU1UWXdPVEkwTENBeU1ERTNMekEzTHpFekxUQXhPakEyT2pNNUlDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9tUmpQU0pvZEhSd09pOHZjSFZ5YkM1dmNtY3ZaR012Wld4bGJXVnVkSE12TVM0eEx5SWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklpQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SWdlRzFzYm5NNmMzUkZkblE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM5elZIbHdaUzlTWlhOdmRYSmpaVVYyWlc1MEl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaUI0YlhBNlEzSmxZWFJsUkdGMFpUMGlNakF4T0Mwd05TMHdNVlF4TmpveE1Ub3dOaTB3TkRvd01DSWdlRzF3T2sxdlpHbG1lVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1Ua3RNRFE2TURBaUlIaHRjRHBOWlhSaFpHRjBZVVJoZEdVOUlqSXdNVGd0TURVdE1ERlVNVFk2TVRVNk1Ua3RNRFE2TURBaUlHUmpPbVp2Y20xaGREMGlhVzFoWjJVdmNHNW5JaUJ3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUFNJeklpQndhRzkwYjNOb2IzQTZTVU5EVUhKdlptbHNaVDBpYzFKSFFpQkpSVU0yTVRrMk5pMHlMakVpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T1RBeU5ERTRZMkV0TlRNek5DMDROalJqTFdGaE5tRXRZVEpsTkRrMlltVTFZbUU0SWlCNGJYQk5UVHBFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2prd01qUXhPR05oTFRVek16UXRPRFkwWXkxaFlUWmhMV0V5WlRRNU5tSmxOV0poT0NJZ2VHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUFNKNGJYQXVaR2xrT2prd01qUXhPR05oTFRVek16UXRPRFkwWXkxaFlUWmhMV0V5WlRRNU5tSmxOV0poT0NJK0lEeDRiWEJOVFRwSWFYTjBiM0o1UGlBOGNtUm1PbE5sY1Q0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbU55WldGMFpXUWlJSE4wUlhaME9tbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZPVEF5TkRFNFkyRXROVE16TkMwNE5qUmpMV0ZoTm1FdFlUSmxORGsyWW1VMVltRTRJaUJ6ZEVWMmREcDNhR1Z1UFNJeU1ERTRMVEExTFRBeFZERTJPakV4T2pBMkxUQTBPakF3SWlCemRFVjJkRHB6YjJaMGQyRnlaVUZuWlc1MFBTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRmRwYm1SdmQzTXBJaTgrSUR3dmNtUm1PbE5sY1Q0Z1BDOTRiWEJOVFRwSWFYTjBiM0o1UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUG5LYkk1WUFBQU1KU1VSQlZHamU3WnE5U3NSQUVJRHZFU3g4QU1FWE9Id0I3d25VSjVCN0FBVjdDNi9WUmt1dHZNNVNRUVFiT1FXMXNmQkFMU3o4NFJvYndiUFFRc3l0TTJzMlRqYWJaUE96YTM1dVlGQlFzcE12c3pPenM5Tm9XQkRHMkFUb2JBbTAyYkFwc09BQzZCTXJsN3lCcnVGSE5RMm53OG90MThZZ3dZTmIzakpmNzh4NTNHSE8vVWJ4RmV4RWU0bnNtd0owSUZad3pscnMrM0N5TklyMlVra0xvQW02Q2Rwejk2eFNSdSszcFlJamRQUjZrUTZRQzZhbnU0bHhvZG9BY2lPN1gyQy80c044Q2w1VE8wRHdmN3V5WnpoWGkrbzlmRGxmTDBBQk9IZXIwVUd1VG9BQ2NQckw4Vm1nTG9EU3dLa05vTFJ3YWdFb0M1ektBOG9LcDlLQTRQZXRySEFxQzhodFMyU0dVMlZBVDNuQXFTUWc2ajJqd1Y3MjAzQUZBWFc5MXNUSnpCaVFBdEExLysxemtFOC9wWUtBY24yWk1hQTRRTEJOcWVTeGJhM3E4VFJqWDBOemdQZ1hJRDBoOWpGZ1RuOEpQR3V1K0FwMm9yMitscXNKUUhTYmxWeFdHcWJpQmRaVDBnMUIyZVJBRklubUFpcnNaMnl3WVgwVmFNMFdVQ1hwbUFkVU1oMERzZ29JdG8rSS9QeG5nUzRJc2JUdzJhWlphdVFDQ0JmRG1LSVVTSkdqKy9YL0EzTzFDQ1hHVGNnZDNUblBya1lCL1dhbVlmeUZJUmlKSG1hMStnMzdhSkk0RDl0bUFPSFhrYStWTVVQaFYrRXFYZnpiaENURDRWbEoySVplaFgrbnRvVjBMZElEa3NydjBMc3hUT3YwWmpXSDlvbVdWMnMwKzNob0lMYXB0bHVnU05RRmhLTWh1aGVISE9ibndOcFpqQjROa3RqR1BUeTYrbThKUUtkeEwrTVpvZGtTb2RzeDF1aThSbFUwYmFNZVI5K1hod2kvVEFsQWJlOWxYbzZDY1FPcGl3ZkNRNUxXRkNicksrcloycmJSOTNIbkMrU1pJSFFhK2Jxbi96ZXhNZVNSSHRNMVZ4SUEwU0J0UUNKbXVhbmZpRUxxVG1VYlNmMGgyYStwbWtMdHg2YklGQjVrUzlJQUNwRjIxS2d1RGw0T0krdWJnclk3dEcyVHloVjZldmNDcytZUUp0VnVrbXNoNnZwdUVtZ1oxRTVVNmc0MjgzeVY5clA3akltc1E1bFR2aGdWWVloaVR6Y3R6R00vZTdaRm5Ba1Z0cldOelQzalluZ1E1SWRXTUVyVnJzelZnUGlCOWFTMmRVMFlzcFVnTEhRc1QvVzNFOWltRGVjSFJqeFNtSyticWZ3QUFBQUFTVVZPUks1Q1lJST0nO1xuICAgIH0gZWxzZSBpZiAodHJ1Y2tDb2xvciA9PSAncHVycGxlJykge1xuICAgICAgaW5mb0JveFRydWNrVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRWdBQUFBckNBWUFBQURiamM2ekFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFHdG1sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TXkwd00xUXhNVG96TVRvd05DMHdOVG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TkRrdE1EUTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRFV0TURGVU1UWTZNVFU2TkRrdE1EUTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZNRGt3WVRBd1pUWXRPVE5tWmkxa1lqUTFMV0l4TWpFdE0ySTFNekJtTjJZeVpUUXdJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNk5USmtNV1F3TURndFlXTXhNeTAzTURRNUxUbG1PR010T1RoaU5UY3haREl6WWpJMElpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNll6STBPVGcwTUdVdE1tSmtNUzFrWkRReExUZzBZMkl0TVdRMFlqUmpOelZrTURreElqNGdQSGh0Y0UxTk9raHBjM1J2Y25rK0lEeHlaR1k2VTJWeFBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpWTNKbFlYUmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRHBqTWpRNU9EUXdaUzB5WW1ReExXUmtOREV0T0RSallpMHhaRFJpTkdNM05XUXdPVEVpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGd0TURNdE1ETlVNVEU2TXpFNk1EUXRNRFU2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09qSm1NemszTWpFNExUbG1NRFV0WlRjME1DMWlZMlk1TFROaU1tVmpNems1TURRM01pSWdjM1JGZG5RNmQyaGxiajBpTWpBeE9DMHdNeTB3TTFReE1Ub3pPVG93T0Mwd05Ub3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4Y21SbU9teHBJSE4wUlhaME9tRmpkR2x2YmowaWMyRjJaV1FpSUhOMFJYWjBPbWx1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2TURrd1lUQXdaVFl0T1RObVppMWtZalExTFdJeE1qRXRNMkkxTXpCbU4yWXlaVFF3SWlCemRFVjJkRHAzYUdWdVBTSXlNREU0TFRBMUxUQXhWREUyT2pFMU9qUTVMVEEwT2pBd0lpQnpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0ZkcGJtUnZkM01wSWlCemRFVjJkRHBqYUdGdVoyVmtQU0l2SWk4K0lEd3ZjbVJtT2xObGNUNGdQQzk0YlhCTlRUcElhWE4wYjNKNVBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BnWW9JNG9BQUFMOVNVUkJWR2plN1pxN1RodEJGSWIzRWZ3SVBJSWZnVGZBTlpXcjFPNkRoTHVVUUJzcHluWldpbkFMRFVoZ0YwZ2tVaVFpaDJZYjFrVW9rSkNNRUFWVXkvN0lBOGZIczd1enUzTTJlL0dSam56UmF1YmZiMmJPbkxrNGpwQUZRZEFQcW0yWG9iZWs0S3lxV3A0ZW40UHhvUmY4SGx5VjNxRVRlb250U1FIYVZ6Vjg3eDBIbjllK1ZjYWhsMXBXQU8zUXQwSWZoajZONnFOMy9yUlNjSlRmL0wzTkJtZ0dabWc2aUZGUll3Q0Z6MjV5QUJpdktJdzZlazNqQUlYUGZlVTk0K1RUdWJid280MWhzd0J4T0JkZkxtTUxieFFnRG1lMDh5dXg4TVlBeWdLbk1ZQ3l3bWtFb0R4d2FnOG9MNXhhQXdxL2IrZUZVMXRBNFdmSEJwdzZBL0p0d0trbElOcDd2RE0vZCtGMUJPU3FINE1QUjB0QUdrRFlPUXNlYmgrdEZGNUhRRlpmWmdrb3dURk1xZGtZdGtXNnU3NDd0KzNxU0xRMjNSUEMwTVhNK09Qaldla2RPcUYzYnN0VkFoQWRaaFczbmlNVkw5QWE3SVNnYXJhdmtrU3hnSXJ4akEwMjVGZDhhN2FNenF3dkRxaHF2Z1JVSkNBTUh4WDU4Vm1tQTBLa0ZsU2JhYXBoQlJBcTgwNTliVlRERklrajNQOEZCaWN0ZDlmVHlETTZ6SzZpZ0V4bkpvaEVEeXNTVGxTamNSc2ZlREtBMERyOFdCa3pGRm9GemcvK2k0VEU0ZUJkbERib3hpeEt0ZUY1cTRCNCtoMTFOb2JuYUJadFkvdkVwRmViYlBZaE5GQnR1dUcya0NTYUFrSmNNVDA0QkNTYXJrdXZ4V2hkYWJTaGh5ZGsvNnNLMENqcFpWU2hwbHNpZERnbWliWjFWY1ZVRysxeDlIMFJJcGl0S0VCZDlZLy84OTlDM01EdnR3QjM2S1hPS1NUeks5cXpUYlhSOTFIM0MvaWRJSFFhZnR6elorNUcyTUg3alRBYUFOTk00U3BtcWFsZnd1bnlJSTAyMm5nUnMxK2JBMnBSU0pGVFpJWWVWSlJsQVJSaDNhamo1dGJzNHVWOVhINVQxdTBPVTIwOFhhR3I5N2ZBYkhnSms3cWI1bGlJcll4SG12SnNlajl1Nmw3WXpKdlB0Q2V6TWxwNUwyV3UwQmdWSjBRenB0dU9zTTFlOUZWYjNKcFFvNjByZHU4WmxXRWhpRmtCb25UYmxWWUZ4R3ZyWk5EbVNnalpUaEVXK2s2QlJ0TVZBM09sVzJzU1UvbklPTmpaMTlhbWlhL0dvTHVUcHN3WG9hVHdzbktBa2RFQUFBQUFTVVZPUks1Q1lJST0nO1xuICAgIH1cblxuICAgIHZhciBmZWV0Zm9yTWlsZXMgPSAwLjAwMDE4OTM5NDtcbiAgICB2YXIgbWllbHNUb2Rpc3BhdGNoID0gcGFyc2VGbG9hdCh0cnVja0l0ZW0uZGlzdCkudG9GaXhlZCgyKTtcblxuICAgIHRoaXMucmVzdWx0cy5wdXNoKHtcbiAgICAgIGRpc3BsYXk6IHRydWNrSXRlbS50cnVja0lkICsgXCIgOiBcIiArIHRydWNrSXRlbS50ZWNoSUQsXG4gICAgICB2YWx1ZTogMSxcbiAgICAgIExhdGl0dWRlOiB0cnVja0l0ZW0ubGF0LFxuICAgICAgTG9uZ2l0dWRlOiB0cnVja0l0ZW0ubG9uZ1xuICAgIH0pO1xuXG4gICAgdmFyIHRydWNrVXJsID0gdGhpcy5nZXRUcnVja1VybCh0cnVja0NvbG9yKTtcbiAgICBjb25zdCBsaXN0T2ZQdXNoUGlucyA9IG1hcHMuZW50aXRpZXM7XG4gICAgdmFyIGlzTmV3VHJ1Y2sgPSB0cnVlO1xuXG4gICAgdmFyIG1ldGFkYXRhID0ge1xuICAgICAgdHJ1Y2tJZDogdHJ1Y2tJdGVtLnRydWNrSWQsXG4gICAgICBBVFRVSUQ6IHRydWNrSXRlbS50ZWNoSUQsXG4gICAgICB0cnVja1N0YXR1czogdHJ1Y2tJdGVtLnRydWNrQ29sLFxuICAgICAgdHJ1Y2tDb2w6IHRydWNrSXRlbS50cnVja0NvbCxcbiAgICAgIGpvYlR5cGU6IHRydWNrSXRlbS5qb2JUeXBlLFxuICAgICAgV1JKb2JUeXBlOiB0cnVja0l0ZW0ud29ya1R5cGUsXG4gICAgICBXUlN0YXR1czogdHJ1Y2tJdGVtLndyU3RhdCxcbiAgICAgIEFzc2luZ2VkV1JJRDogdHJ1Y2tJdGVtLndySUQsXG4gICAgICBTcGVlZDogdHJ1Y2tJdGVtLnNwZWVkLFxuICAgICAgRGlzdGFuY2U6IG1pZWxzVG9kaXNwYXRjaCxcbiAgICAgIEN1cnJlbnRJZGxlVGltZTogdHJ1Y2tJdGVtLmlkbGVUaW1lLFxuICAgICAgRVRBOiB0cnVja0l0ZW0udG90SWRsZVRpbWUsXG4gICAgICBFbWFpbDogJycsLy8gdHJ1Y2tJdGVtLkVtYWlsLFxuICAgICAgTW9iaWxlOiAnJywgLy8gdHJ1Y2tJdGVtLk1vYmlsZSxcbiAgICAgIGljb246IGljb25VcmwsXG4gICAgICBpY29uSW5mbzogaW5mb0JveFRydWNrVXJsLFxuICAgICAgQ3VycmVudExhdDogdHJ1Y2tJdGVtLmxhdCxcbiAgICAgIEN1cnJlbnRMb25nOiB0cnVja0l0ZW0ubG9uZyxcbiAgICAgIFdSTGF0OiB0cnVja0l0ZW0ud3JMYXQsXG4gICAgICBXUkxvbmc6IHRydWNrSXRlbS53ckxvbmcsXG4gICAgICB0ZWNoSWRzOiB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5zLFxuICAgICAgam9iSWQ6IHRydWNrSXRlbS5qb2JJZCxcbiAgICAgIG1hbmFnZXJJZHM6IHRoaXMubWFuYWdlcklkcyxcbiAgICAgIHdvcmtBZGRyZXNzOiB0cnVja0l0ZW0ud29ya0FkZHJlc3MsXG4gICAgICBzYmNWaW46IHRydWNrSXRlbS5zYmNWaW4sXG4gICAgICBjdXN0b21lck5hbWU6IHRydWNrSXRlbS5jdXN0b21lck5hbWUsXG4gICAgICB0ZWNobmljaWFuTmFtZTogdHJ1Y2tJdGVtLnRlY2huaWNpYW5OYW1lLFxuICAgICAgZGlzcGF0Y2hUaW1lOiB0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lLFxuICAgICAgcmVnaW9uOiB0cnVja0l0ZW0uem9uZVxuICAgIH07XG5cbiAgICBsZXQgam9iSWRTdHJpbmcgPSAnaHR0cDovL2VkZ2UtZWR0Lml0LmF0dC5jb20vY2dpLWJpbi9lZHRfam9iaW5mby5jZ2k/JztcblxuICAgIGxldCB6b25lID0gdHJ1Y2tJdGVtLnpvbmU7XG5cbiAgICAvLyA9IE0gZm9yIE1XXG4gICAgLy8gPSBXIGZvciBXZXN0XG4gICAgLy8gPSBCIGZvciBTRVxuICAgIC8vID0gUyBmb3IgU1dcbiAgICBpZiAoem9uZSAhPSBudWxsICYmIHpvbmUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoem9uZSA9PT0gJ01XJykge1xuICAgICAgICB6b25lID0gJ00nO1xuICAgICAgfSBlbHNlIGlmICh6b25lID09PSAnU0UnKSB7XG4gICAgICAgIHpvbmUgPSAnQidcbiAgICAgIH0gZWxzZSBpZiAoem9uZSA9PT0gJ1NXJykge1xuICAgICAgICB6b25lID0gJ1MnXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHpvbmUgPSAnJztcbiAgICB9XG5cbiAgICBqb2JJZFN0cmluZyA9IGpvYklkU3RyaW5nICsgJ2VkdF9yZWdpb249JyArIHpvbmUgKyAnJndyaWQ9JyArIHRydWNrSXRlbS53cklEO1xuXG4gICAgdHJ1Y2tJdGVtLmpvYklkID0gdHJ1Y2tJdGVtLmpvYklkID09IHVuZGVmaW5lZCB8fCB0cnVja0l0ZW0uam9iSWQgPT0gbnVsbCA/ICcnIDogdHJ1Y2tJdGVtLmpvYklkO1xuXG4gICAgaWYgKHRydWNrSXRlbS5qb2JJZCAhPSAnJykge1xuICAgICAgam9iSWRVcmwgPSAnPGEgaHJlZj1cIicgKyBqb2JJZFN0cmluZyArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIiB0aXRsZT1cIkNsaWNrIGhlcmUgdG8gc2VlIGFjdHVhbCBGb3JjZS9FZGdlIGpvYiBkYXRhXCI+JyArIHRydWNrSXRlbS5qb2JJZCArICc8L2E+JztcbiAgICB9XG5cbiAgICBpZiAodHJ1Y2tJdGVtLmRpc3BhdGNoVGltZSAhPSBudWxsICYmIHRydWNrSXRlbS5kaXNwYXRjaFRpbWUgIT0gdW5kZWZpbmVkICYmIHRydWNrSXRlbS5kaXNwYXRjaFRpbWUgIT0gJycpIHtcbiAgICAgIGxldCBkaXNwYXRjaERhdGUgPSB0cnVja0l0ZW0uZGlzcGF0Y2hUaW1lLnNwbGl0KCc6Jyk7XG4gICAgICBsZXQgZHQgPSBkaXNwYXRjaERhdGVbMF0gKyAnICcgKyBkaXNwYXRjaERhdGVbMV0gKyAnOicgKyBkaXNwYXRjaERhdGVbMl0gKyAnOicgKyBkaXNwYXRjaERhdGVbM107XG4gICAgICBtZXRhZGF0YS5kaXNwYXRjaFRpbWUgPSB0aGF0LlVUQ1RvVGltZVpvbmUoZHQpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBpbiB0aGUgVHJ1Y2tXYXRjaExpc3Qgc2Vzc2lvblxuICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja1dhdGNoTGlzdCcpICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnRydWNrTGlzdCA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnVHJ1Y2tXYXRjaExpc3QnKSk7XG5cbiAgICAgIGlmICh0aGlzLnRydWNrTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICh0aGlzLnRydWNrTGlzdC5zb21lKHggPT4geC50cnVja0lkID09IHRydWNrSXRlbS50cnVja0lkKSA9PSB0cnVlKSB7XG4gICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnRydWNrTGlzdC5maW5kKHggPT4geC50cnVja0lkID09IHRydWNrSXRlbS50cnVja0lkKTtcbiAgICAgICAgICBjb25zdCBpbmRleDogbnVtYmVyID0gdGhpcy50cnVja0xpc3QuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBpdGVtLkRpc3RhbmNlID0gbWV0YWRhdGEuRGlzdGFuY2U7XG4gICAgICAgICAgICBpdGVtLmljb24gPSBtZXRhZGF0YS5pY29uO1xuICAgICAgICAgICAgdGhpcy50cnVja0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIHRoaXMudHJ1Y2tMaXN0LnNwbGljZShpbmRleCwgMCwgaXRlbSk7XG4gICAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tXYXRjaExpc3QnLCB0aGlzLnRydWNrTGlzdCk7XG4gICAgICAgICAgICBpdGVtID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgaW4gdGhlIFNlbGVjdGVkVHJ1Y2sgc2Vzc2lvblxuICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja0RldGFpbHMnKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XG4gICAgICBzZWxlY3RlZFRydWNrID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdUcnVja0RldGFpbHMnKSk7XG5cbiAgICAgIGlmIChzZWxlY3RlZFRydWNrICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sudHJ1Y2tJZCA9PSB0cnVja0l0ZW0udHJ1Y2tJZCkge1xuICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ1RydWNrRGV0YWlscycpO1xuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja0RldGFpbHMnLCBtZXRhZGF0YSk7XG4gICAgICAgICAgc2VsZWN0ZWRUcnVjayA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy50cnVja0l0ZW1zLmxlbmd0aCA+IDAgJiYgdGhpcy50cnVja0l0ZW1zLnNvbWUoeCA9PiB4LnRvTG93ZXJDYXNlKCkgPT0gdHJ1Y2tJdGVtLnRydWNrSWQudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgIGlzTmV3VHJ1Y2sgPSBmYWxzZTtcbiAgICAgIC8vIElmIGl0IGlzIG5vdCBhIG5ldyB0cnVjayB0aGVuIG1vdmUgdGhlIHRydWNrIHRvIG5ldyBsb2NhdGlvblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0T2ZQdXNoUGlucy5nZXRMZW5ndGgoKTsgaSsrKSB7XG4gICAgICAgIGlmIChsaXN0T2ZQdXNoUGlucy5nZXQoaSkubWV0YWRhdGEudHJ1Y2tJZCA9PT0gdHJ1Y2tJdGVtLnRydWNrSWQpIHtcbiAgICAgICAgICB2YXIgY3VyUHVzaFBpbiA9IGxpc3RPZlB1c2hQaW5zLmdldChpKTtcbiAgICAgICAgICBjdXJQdXNoUGluLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgZGVzdExvYyA9IHBpbkxvY2F0aW9uO1xuICAgICAgICAgIHBpbkxvY2F0aW9uID0gbGlzdE9mUHVzaFBpbnMuZ2V0KGkpLmdldExvY2F0aW9uKCk7XG5cbiAgICAgICAgICBsZXQgdHJ1Y2tJZFJhbklkID0gdHJ1Y2tJdGVtLnRydWNrSWQgKyAnXycgKyBNYXRoLnJhbmRvbSgpO1xuXG4gICAgICAgICAgdGhpcy5hbmltYXRpb25UcnVja0xpc3QuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmluZGV4T2YodHJ1Y2tJdGVtLnRydWNrSWQpID4gLTEpIHtcbiAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25UcnVja0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmFuaW1hdGlvblRydWNrTGlzdC5wdXNoKHRydWNrSWRSYW5JZCk7XG5cbiAgICAgICAgICB0aGlzLmxvYWREaXJlY3Rpb25zKHRoaXMsIHBpbkxvY2F0aW9uLCBkZXN0TG9jLCBpLCB0cnVja1VybCwgdHJ1Y2tJZFJhbklkKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRydWNrSXRlbXMucHVzaCh0cnVja0l0ZW0udHJ1Y2tJZCk7XG4gICAgICBOZXdQaW4gPSBuZXcgTWljcm9zb2Z0Lk1hcHMuUHVzaHBpbihwaW5Mb2NhdGlvbiwgeyBpY29uOiB0cnVja1VybCB9KTtcblxuICAgICAgTmV3UGluLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICB0aGlzLm1hcC5lbnRpdGllcy5wdXNoKE5ld1Bpbik7XG5cbiAgICAgIHRoaXMuZGF0YUxheWVyLnB1c2goTmV3UGluKTtcbiAgICAgIGlmICh0aGlzLmlzTWFwTG9hZGVkKSB7XG4gICAgICAgIHRoaXMuaXNNYXBMb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tYXAuc2V0Vmlldyh7IGNlbnRlcjogcGluTG9jYXRpb24sIHpvb206IHRoaXMubGFzdFpvb21MZXZlbCB9KTtcbiAgICAgICAgdGhhdC5sYXN0Wm9vbUxldmVsID0gdGhpcy5tYXAuZ2V0Wm9vbSgpO1xuICAgICAgICB0aGF0Lmxhc3RMb2NhdGlvbiA9IHRoaXMubWFwLmdldENlbnRlcigpO1xuICAgICAgfVxuXG4gICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihOZXdQaW4sICdtb3VzZW91dCcsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuaW5mb2JveC5zZXRPcHRpb25zKHsgdmlzaWJsZTogZmFsc2UgfSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgMTAyNCkge1xuICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihOZXdQaW4sICdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbmZvYm94LnNldE9wdGlvbnMoe1xuICAgICAgICAgICAgc2hvd1BvaW50ZXI6IHRydWUsXG4gICAgICAgICAgICBsb2NhdGlvbjogZS50YXJnZXQuZ2V0TG9jYXRpb24oKSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICBzaG93Q2xvc2VCdXR0b246IHRydWUsXG4gICAgICAgICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCAyMCksXG4gICAgICAgICAgICBodG1sQ29udGVudDogJzxkaXYgY2xhc3MgPSBcImluZnkgaW5meU1hcHBvcHVwXCI+J1xuICAgICAgICAgICAgICArIGdldEluZm9Cb3hIVE1MKGUudGFyZ2V0Lm1ldGFkYXRhLCB0aGlzLnRocmVzaG9sZFZhbHVlLCBqb2JJZFVybCkgKyAnPC9kaXY+J1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy50cnVja1dhdGNoTGlzdCA9IFt7IFRydWNrSWQ6IGUudGFyZ2V0Lm1ldGFkYXRhLnRydWNrSWQsIERpc3RhbmNlOiBlLnRhcmdldC5tZXRhZGF0YS5EaXN0YW5jZSB9XTtcblxuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJywgZS50YXJnZXQubWV0YWRhdGEpO1xuICAgICAgICAgIHRoaXMubWFwU2VydmljZS5zdG9yZURhdGFJblNlc3Npb25TdG9yYWdlKCdUcnVja0RldGFpbHMnLCBlLnRhcmdldC5tZXRhZGF0YSk7XG5cbiAgICAgICAgICAvLyBBIGJ1ZmZlciBsaW1pdCB0byB1c2UgdG8gc3BlY2lmeSB0aGUgaW5mb2JveCBtdXN0IGJlIGF3YXkgZnJvbSB0aGUgZWRnZXMgb2YgdGhlIG1hcC5cblxuICAgICAgICAgIHZhciBidWZmZXIgPSAzMDtcbiAgICAgICAgICB2YXIgaW5mb2JveE9mZnNldCA9IHRoYXQuaW5mb2JveC5nZXRPZmZzZXQoKTtcbiAgICAgICAgICB2YXIgaW5mb2JveEFuY2hvciA9IHRoYXQuaW5mb2JveC5nZXRBbmNob3IoKTtcbiAgICAgICAgICB2YXIgaW5mb2JveExvY2F0aW9uID0gbWFwcy50cnlMb2NhdGlvblRvUGl4ZWwoZS50YXJnZXQuZ2V0TG9jYXRpb24oKSwgTWljcm9zb2Z0Lk1hcHMuUGl4ZWxSZWZlcmVuY2UuY29udHJvbCk7XG4gICAgICAgICAgdmFyIGR4ID0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94T2Zmc2V0LnggLSBpbmZvYm94QW5jaG9yLng7XG4gICAgICAgICAgdmFyIGR5ID0gaW5mb2JveExvY2F0aW9uLnkgLSAyNSAtIGluZm9ib3hBbmNob3IueTtcblxuICAgICAgICAgIGlmIChkeSA8IGJ1ZmZlcikgeyAvLyBJbmZvYm94IG92ZXJsYXBzIHdpdGggdG9wIG9mIG1hcC5cbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cbiAgICAgICAgICAgIGR5ICo9IC0xO1xuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYnVmZmVyIGZyb20gdGhlIHRvcCBlZGdlIG9mIHRoZSBtYXAuXG4gICAgICAgICAgICBkeSArPSBidWZmZXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHkgaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhhbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxuICAgICAgICAgICAgZHkgPSAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkeCA8IGJ1ZmZlcikgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCBsZWZ0IHNpZGUgb2YgbWFwLlxuICAgICAgICAgICAgLy8gIyMjIyBPZmZzZXQgaW4gb3Bwb3NpdGUgZGlyZWN0aW9uLlxuICAgICAgICAgICAgZHggKj0gLTE7XG4gICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIG1hcC5cbiAgICAgICAgICAgIGR4ICs9IGJ1ZmZlcjtcbiAgICAgICAgICB9IGVsc2UgeyAvLyBDaGVjayB0byBzZWUgaWYgb3ZlcmxhcHBpbmcgd2l0aCByaWdodCBzaWRlIG9mIG1hcC5cbiAgICAgICAgICAgIGR4ID0gbWFwcy5nZXRXaWR0aCgpIC0gaW5mb2JveExvY2F0aW9uLnggKyBpbmZvYm94QW5jaG9yLnggLSB0aGF0LmluZm9ib3guZ2V0V2lkdGgoKTtcbiAgICAgICAgICAgIC8vICMjIyMgSWYgZHggaXMgZ3JlYXRlciB0aGFuIHplcm8gdGhlbiBpdCBkb2VzIG5vdCBvdmVybGFwLlxuICAgICAgICAgICAgaWYgKGR4ID4gYnVmZmVyKSB7XG4gICAgICAgICAgICAgIGR4ID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vICMjIyMgYWRkIGEgYnVmZmVyIGZyb20gdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIG1hcC5cbiAgICAgICAgICAgICAgZHggLT0gYnVmZmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vICMjIyMgQWRqdXN0IHRoZSBtYXAgc28gaW5mb2JveCBpcyBpbiB2aWV3XG4gICAgICAgICAgaWYgKGR4ICE9IDAgfHwgZHkgIT0gMCkge1xuICAgICAgICAgICAgbWFwcy5zZXRWaWV3KHtcbiAgICAgICAgICAgICAgY2VudGVyT2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoZHgsIGR5KSxcbiAgICAgICAgICAgICAgY2VudGVyOiBtYXBzLmdldENlbnRlcigpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgc2VsZWN0ZWRUcnVjazogYW55O1xuICAgICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGlzLm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XG5cbiAgICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCB0ZWNobmljaWFuRGV0YWlscyA9IHRoaXMucmVwb3J0aW5nVGVjaG5pY2lhbkRldGFpbHMuZmluZChcbiAgICAgICAgICAgICAgeCA9PiB4LmF0dHVpZC50b0xvd2VyQ2FzZSgpID09IHNlbGVjdGVkVHJ1Y2suQVRUVUlELnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5FbWFpbCA9IHRlY2huaWNpYW5EZXRhaWxzLmVtYWlsO1xuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xuICAgICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgTWljcm9zb2Z0Lk1hcHMuRXZlbnRzLmFkZEhhbmRsZXIodGhpcy5pbmZvYm94LCAnY2xpY2snLCB2aWV3VHJ1Y2tEZXRhaWxzKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBNaWNyb3NvZnQuTWFwcy5FdmVudHMuYWRkSGFuZGxlcihOZXdQaW4sICdtb3VzZW92ZXInLCAoZSkgPT4ge1xuICAgICAgICAgIHRoaXMuaW5mb2JveC5zZXRPcHRpb25zKHtcbiAgICAgICAgICAgIHNob3dQb2ludGVyOiB0cnVlLFxuICAgICAgICAgICAgbG9jYXRpb246IGUudGFyZ2V0LmdldExvY2F0aW9uKCksXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgc2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgb2Zmc2V0OiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMCwgMjApLFxuICAgICAgICAgICAgaHRtbENvbnRlbnQ6ICc8ZGl2IGNsYXNzID0gXCJpbmZ5IGluZnlNYXBwb3B1cFwiPidcbiAgICAgICAgICAgICAgKyBnZXRJbmZvQm94SFRNTChlLnRhcmdldC5tZXRhZGF0YSwgdGhpcy50aHJlc2hvbGRWYWx1ZSwgam9iSWRVcmwpICsgJzwvZGl2PidcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMudHJ1Y2tXYXRjaExpc3QgPSBbeyBUcnVja0lkOiBlLnRhcmdldC5tZXRhZGF0YS50cnVja0lkLCBEaXN0YW5jZTogZS50YXJnZXQubWV0YWRhdGEuRGlzdGFuY2UgfV07XG5cbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycsIGUudGFyZ2V0Lm1ldGFkYXRhKTtcbiAgICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc3RvcmVEYXRhSW5TZXNzaW9uU3RvcmFnZSgnVHJ1Y2tEZXRhaWxzJywgZS50YXJnZXQubWV0YWRhdGEpO1xuXG4gICAgICAgICAgLy8gQSBidWZmZXIgbGltaXQgdG8gdXNlIHRvIHNwZWNpZnkgdGhlIGluZm9ib3ggbXVzdCBiZSBhd2F5IGZyb20gdGhlIGVkZ2VzIG9mIHRoZSBtYXAuXG5cbiAgICAgICAgICB2YXIgYnVmZmVyID0gMzA7XG4gICAgICAgICAgdmFyIGluZm9ib3hPZmZzZXQgPSB0aGF0LmluZm9ib3guZ2V0T2Zmc2V0KCk7XG4gICAgICAgICAgdmFyIGluZm9ib3hBbmNob3IgPSB0aGF0LmluZm9ib3guZ2V0QW5jaG9yKCk7XG4gICAgICAgICAgdmFyIGluZm9ib3hMb2NhdGlvbiA9IG1hcHMudHJ5TG9jYXRpb25Ub1BpeGVsKGUudGFyZ2V0LmdldExvY2F0aW9uKCksIE1pY3Jvc29mdC5NYXBzLlBpeGVsUmVmZXJlbmNlLmNvbnRyb2wpO1xuICAgICAgICAgIHZhciBkeCA9IGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveE9mZnNldC54IC0gaW5mb2JveEFuY2hvci54O1xuICAgICAgICAgIHZhciBkeSA9IGluZm9ib3hMb2NhdGlvbi55IC0gMjUgLSBpbmZvYm94QW5jaG9yLnk7XG5cbiAgICAgICAgICBpZiAoZHkgPCBidWZmZXIpIHsgLy8gSW5mb2JveCBvdmVybGFwcyB3aXRoIHRvcCBvZiBtYXAuXG4gICAgICAgICAgICAvLyAjIyMjIE9mZnNldCBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24uXG4gICAgICAgICAgICBkeSAqPSAtMTtcbiAgICAgICAgICAgIC8vICMjIyMgYWRkIGJ1ZmZlciBmcm9tIHRoZSB0b3AgZWRnZSBvZiB0aGUgbWFwLlxuICAgICAgICAgICAgZHkgKz0gYnVmZmVyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAjIyMjIElmIGR5IGlzIGdyZWF0ZXIgdGhhbiB6ZXJvIHRoYW4gaXQgZG9lcyBub3Qgb3ZlcmxhcC5cbiAgICAgICAgICAgIGR5ID0gMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZHggPCBidWZmZXIpIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggbGVmdCBzaWRlIG9mIG1hcC5cbiAgICAgICAgICAgIC8vICMjIyMgT2Zmc2V0IGluIG9wcG9zaXRlIGRpcmVjdGlvbi5cbiAgICAgICAgICAgIGR4ICo9IC0xO1xuICAgICAgICAgICAgLy8gIyMjIyBhZGQgYSBidWZmZXIgZnJvbSB0aGUgbGVmdCBlZGdlIG9mIHRoZSBtYXAuXG4gICAgICAgICAgICBkeCArPSBidWZmZXI7XG4gICAgICAgICAgfSBlbHNlIHsgLy8gQ2hlY2sgdG8gc2VlIGlmIG92ZXJsYXBwaW5nIHdpdGggcmlnaHQgc2lkZSBvZiBtYXAuXG4gICAgICAgICAgICBkeCA9IG1hcHMuZ2V0V2lkdGgoKSAtIGluZm9ib3hMb2NhdGlvbi54ICsgaW5mb2JveEFuY2hvci54IC0gdGhhdC5pbmZvYm94LmdldFdpZHRoKCk7XG4gICAgICAgICAgICAvLyAjIyMjIElmIGR4IGlzIGdyZWF0ZXIgdGhhbiB6ZXJvIHRoZW4gaXQgZG9lcyBub3Qgb3ZlcmxhcC5cbiAgICAgICAgICAgIGlmIChkeCA+IGJ1ZmZlcikge1xuICAgICAgICAgICAgICBkeCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyAjIyMjIGFkZCBhIGJ1ZmZlciBmcm9tIHRoZSByaWdodCBlZGdlIG9mIHRoZSBtYXAuXG4gICAgICAgICAgICAgIGR4IC09IGJ1ZmZlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyAjIyMjIEFkanVzdCB0aGUgbWFwIHNvIGluZm9ib3ggaXMgaW4gdmlld1xuICAgICAgICAgIGlmIChkeCAhPSAwIHx8IGR5ICE9IDApIHtcbiAgICAgICAgICAgIG1hcHMuc2V0Vmlldyh7XG4gICAgICAgICAgICAgIGNlbnRlck9mZnNldDogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KGR4LCBkeSksXG4gICAgICAgICAgICAgIGNlbnRlcjogbWFwcy5nZXRDZW50ZXIoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcbiAgICAgICAgICBzZWxlY3RlZFRydWNrID0gdGhpcy5tYXBTZXJ2aWNlLnJldHJpZXZlRGF0YUZyb21TZXNzaW9uU3RvcmFnZSgnc2VsZWN0ZWRUcnVjaycpO1xuXG4gICAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGlzLnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXG4gICAgICAgICAgICAgIHggPT4geC5hdHR1aWQudG9Mb3dlckNhc2UoKSA9PSBzZWxlY3RlZFRydWNrLkFUVFVJRC50b0xvd2VyQ2FzZSgpKTtcblxuICAgICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuUGhvbmUgPSB0ZWNobmljaWFuRGV0YWlscy5waG9uZTtcbiAgICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMuaW5mb2JveCwgJ2NsaWNrJywgdmlld1RydWNrRGV0YWlscyk7XG5cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKG1hcHMsICd2aWV3Y2hhbmdlJywgbWFwVmlld0NoYW5nZWQpO1xuXG4gICAgICAvLyB0aGlzLkNoYW5nZVRydWNrRGlyZWN0aW9uKHRoaXMsIE5ld1BpbiwgZGVzdExvYywgdHJ1Y2tVcmwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hcFZpZXdDaGFuZ2VkKGUpIHtcbiAgICAgIHRoYXQubGFzdFpvb21MZXZlbCA9IG1hcHMuZ2V0Wm9vbSgpO1xuICAgICAgdGhhdC5sYXN0TG9jYXRpb24gPSBtYXBzLmdldENlbnRlcigpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBtb3VzZXdoZWVsQ2hhbmdlZChlKSB7XG4gICAgICB0aGF0Lmxhc3Rab29tTGV2ZWwgPSBtYXBzLmdldFpvb20oKTtcbiAgICAgIHRoYXQubGFzdExvY2F0aW9uID0gbWFwcy5nZXRDZW50ZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJbmZvQm94SFRNTChkYXRhOiBhbnksIHRWYWx1ZSwgam9iSWQpOiBTdHJpbmcge1xuXG4gICAgICBpZiAoIWRhdGEuU3BlZWQpIHtcbiAgICAgICAgZGF0YS5TcGVlZCA9IDA7XG4gICAgICB9XG5cbiAgICAgIHZhciBjbGFzc05hbWUgPSBcIlwiO1xuICAgICAgdmFyIHN0eWxlTGVmdCA9IFwiXCI7XG4gICAgICB2YXIgcmVhc29uID0gJyc7XG4gICAgICBpZiAoZGF0YS50cnVja1N0YXR1cyAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGRhdGEudHJ1Y2tTdGF0dXMudG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAncmVkJykge1xuICAgICAgICAgIHJlYXNvbiA9IFwiPGRpdiBjbGFzcz0ncm93JyBzdHlsZT0nbWFyZ2luLXRvcDozcHg7Y29sb3I6cmVkOyc+UmVhc29uOiBDdW11bGF0aXZlIGlkbGUgdGltZSBpcyBiZXlvbmQgXCIgKyB0VmFsdWUgKyBcIiBtaW5zPC9kaXY+XCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS50cnVja1N0YXR1cy50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICdwdXJwbGUnKSB7XG4gICAgICAgICAgcmVhc29uID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tdG9wOjNweDtjb2xvcjpwdXJwbGU7Jz5SZWFzb246IFRydWNrIGlzIGRyaXZlbiBncmVhdGVyIHRoYW4gNzUgbS9oPC9kaXY+XCI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IGluZm9ib3hEYXRhID0gJyc7XG5cbiAgICAgIGRhdGEuY3VzdG9tZXJOYW1lID0gZGF0YS5jdXN0b21lck5hbWUgPT0gdW5kZWZpbmVkIHx8IGRhdGEuY3VzdG9tZXJOYW1lID09IG51bGwgPyAnJyA6IGRhdGEuY3VzdG9tZXJOYW1lO1xuXG4gICAgICBkYXRhLmRpc3BhdGNoVGltZSA9IGRhdGEuZGlzcGF0Y2hUaW1lID09IHVuZGVmaW5lZCB8fCBkYXRhLmRpc3BhdGNoVGltZSA9PSBudWxsID8gJycgOiBkYXRhLmRpc3BhdGNoVGltZTtcblxuICAgICAgZGF0YS5qb2JJZCA9IGRhdGEuam9iSWQgPT0gdW5kZWZpbmVkIHx8IGRhdGEuam9iSWQgPT0gbnVsbCA/ICcnIDogZGF0YS5qb2JJZDtcblxuICAgICAgZGF0YS53b3JrQWRkcmVzcyA9IGRhdGEud29ya0FkZHJlc3MgPT0gdW5kZWZpbmVkIHx8IGRhdGEud29ya0FkZHJlc3MgPT0gbnVsbCA/ICcnIDogZGF0YS53b3JrQWRkcmVzcztcblxuICAgICAgZGF0YS5zYmNWaW4gPSBkYXRhLnNiY1ZpbiA9PSB1bmRlZmluZWQgfHwgZGF0YS5zYmNWaW4gPT0gbnVsbCB8fCBkYXRhLnNiY1ZpbiA9PSAnJyA/ICcnIDogZGF0YS5zYmNWaW47XG5cbiAgICAgIGRhdGEudGVjaG5pY2lhbk5hbWUgPSBkYXRhLnRlY2huaWNpYW5OYW1lID09IHVuZGVmaW5lZCB8fCBkYXRhLnRlY2huaWNpYW5OYW1lID09IG51bGwgfHwgZGF0YS50ZWNobmljaWFuTmFtZSA9PSAnJyA/ICcnIDogZGF0YS50ZWNobmljaWFuTmFtZTtcblxuICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgMTAyNCkge1xuICAgICAgICBpbmZvYm94RGF0YSA9IFwiPGRpdiBjbGFzcz0ncG9wTW9kYWxDb250YWluZXInPjxkaXYgY2xhc3M9J3BvcE1vZGFsSGVhZGVyJz48aW1nIHNyYz0nXCIgKyBkYXRhLmljb25JbmZvICsgXCInID48YSBjbGFzcz0nZGV0YWlscycgdGl0bGU9J0NsaWNrIGhlcmUgdG8gc2VlIHRlY2huaWNpYW4gZGV0YWlscycgPlZpZXcgRGV0YWlsczwvYT48aSBjbGFzcz0nZmEgZmEtdGltZXMnIGFyaWEtaGlkZGVuPSd0cnVlJyBzdHlsZT0nY3Vyc29yOiBwb2ludGVyJz48L2k+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGhyLz48ZGl2IGNsYXNzPSdwb3BNb2RhbEJvZHknPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+VmVoaWNsZSBOdW1iZXIgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5zYmNWaW4gKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5WVFMgVW5pdCBJRCA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBkYXRhLnRydWNrSWQgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkpvYiBUeXBlIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuam9iVHlwZSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkpvYiBJZCA6PC9sYWJlbD48ZGl2IGNsYXNzPSdjb2wgY29sLXNtLTcnPjxzcGFuIGNsYXNzPSdjb2wtZm9ybS1sYWJlbCc+XCIgKyBqb2JJZCArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3Jvdyc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+QVRUVUlEIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEuQVRUVUlEICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLW1kLTYnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2Zvcm0tZ3JvdXAgcm93Jz48bGFiZWwgY2xhc3M9J2NvbCBjb2wtc20tNSBjb2wtZm9ybS1sYWJlbCc+VGVjaG5pY2lhbiBOYW1lIDo8L2xhYmVsPjxkaXYgY2xhc3M9J2NvbCBjb2wtc20tNyc+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsJz5cIiArIGRhdGEudGVjaG5pY2lhbk5hbWUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC02Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdmb3JtLWdyb3VwIHJvdyc+PGxhYmVsIGNsYXNzPSdjb2wgY29sLXNtLTUgY29sLWZvcm0tbGFiZWwnPkN1c3RvbWVyIE5hbWUgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5jdXN0b21lck5hbWUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtNic+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sIGNvbC1zbS01IGNvbC1mb3JtLWxhYmVsJz5EaXNwYXRjaCBUaW1lOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sIGNvbC1zbS03Jz48c3BhbiBjbGFzcz0nY29sLWZvcm0tbGFiZWwnPlwiICsgZGF0YS5kaXNwYXRjaFRpbWUgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbC1tZC0xMic+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nZm9ybS1ncm91cCByb3cnPjxsYWJlbCBjbGFzcz0nY29sLTEyIGNvbC1zbS0xMiBjb2wtZm9ybS1sYWJlbCc+Sm9iIEFkZHJlc3MgOjwvbGFiZWw+PGRpdiBjbGFzcz0nY29sLTEyIGNvbC1zbS0xMic+PHNwYW4gY2xhc3M9J2NvbC1mb3JtLWxhYmVsIGNvbC1mb3JtLWxhYmVsLWZ1bGwnPlwiICsgZGF0YS53b3JrQWRkcmVzcyArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3JvdyBtZXRlckNhbCc+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLTEyIGNvbC1tZC00Jz48c3Ryb25nPlwiICsgZGF0YS5TcGVlZCArIFwiPC9zdHJvbmc+IG1waCA8c3BhbiBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5TcGVlZDwvc3Bhbj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtMTIgY29sLW1kLTQnPjxzdHJvbmc+XCIgKyBkYXRhLkVUQSArIFwiPC9zdHJvbmc+IE1pbnMgPHNwYW4gY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+Q3VtdWxhdGl2ZSBJZGxlIE1pbnV0ZXM8L3NwYW4+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sLTEyIGNvbC1tZC00Jz48c3Ryb25nPlwiICsgdGhhdC5jb252ZXJ0TWlsZXNUb0ZlZXQoZGF0YS5EaXN0YW5jZSkgKyBcIjwvc3Ryb25nPiBGdCA8c3BhbiBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5GZWV0IHRvIEpvYiBTaXRlPC9zcGFuPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PiA8aHIvPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3BvcE1vZGFsRm9vdGVyJz48ZGl2IGNsYXNzPSdyb3cnPlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbCBjb2wtbWQtNCc+PGkgY2xhc3M9J2ZhIGZhLWNvbW1lbnRpbmcnPjwvaT48c3BhbiBjbGFzcz0nc21zJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBTTVMnID5TTVM8L3A+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0nY29sIGNvbC1tZC00Jz48aSBjbGFzcz0nZmEgZmEtZW52ZWxvcGUnIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PHNwYW4gY2xhc3M9J2VtYWlsJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBlbWFpbCcgPkVtYWlsPC9wPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2NvbCBjb2wtbWQtNCc+PGkgY2xhc3M9J2ZhIGZhLWV5ZScgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48c3BhbiBjbGFzcz0nd2F0Y2hsaXN0JyB0aXRsZT0nQ2xpY2sgdG8gYWRkIGluIHdhdGNobGlzdCcgPldhdGNoPC9wPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PiA8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj5cIjtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5mb2JveERhdGEgPSBcIjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J3BhZGRpbmctdG9wOjEwcHg7bWFyZ2luOiAwcHg7Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtMyc+PGRpdiBzdHlsZT0ncGFkZGluZy10b3A6MTVweDsnID48aW1nIHNyYz0nXCIgKyBkYXRhLmljb25JbmZvICsgXCInIHN0eWxlPSdkaXNwbGF5OiBibG9jazttYXJnaW46IDAgYXV0bzsnID48L2Rpdj48L2Rpdj5cIiArXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdjb2wtbWQtOSc+XCIgK1xuICAgICAgICAgIFwiPGRpdiBjbGFzcz0ncm93ICc+XCIgK1xuICAgICAgICAgIFwiPGRpdiBjbGFzcz0nY29sLW1kLTgnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+VmVoaWNsZSBOdW1iZXI8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5zYmNWaW4gKyBcIjwvZGl2PlwiICtcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J2NvbC1tZC00JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjBweDtwYWRkaW5nLXJpZ2h0OjBweDsnID48YSBjbGFzcz0nZGV0YWlscycgc3R5bGU9J2NvbG9yOiMwMDlGREI7Y3Vyc29yOiBwb2ludGVyOycgIHRpdGxlPSdDbGljayBoZXJlIHRvIHNlZSB0ZWNobmljaWFuIGRldGFpbHMnID5WaWV3IERldGFpbHM8L2E+PGkgY2xhc3M9J2ZhIGZhLXRpbWVzJyBzdHlsZT0ncGFkZGluZy1sZWZ0OjE1cHg7Y3Vyc29yOiBwb2ludGVyOycgYXJpYS1oaWRkZW49J3RydWUnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPjwvaT48L2Rpdj5cIiArXG4gICAgICAgICAgXCI8L2Rpdj5cIiArXG4gICAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnPjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5WVFMgVW5pdCBJRDwvc3Bhbj4mbmJzcDs6Jm5ic3A7XCIgKyBkYXRhLnRydWNrSWQgKyBcIjwvZGl2PjwvZGl2PlwiICtcbiAgICAgICAgICBcIjxkaXYgY2xhc3M9J3Jvdyc+PGRpdiBjbGFzcz0nY29sLW1kLTUnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6MHB4O3BhZGRpbmctcmlnaHQ6MHB4OycgPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+Sm9iIFR5cGU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5qb2JUeXBlICsgXCI8L2Rpdj48ZGl2IGNsYXNzPSdjb2wtbWQtNycgc3R5bGU9J3BhZGRpbmctbGVmdDowcHg7cGFkZGluZy1yaWdodDowcHg7JyA+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7JyA+Sm9iIElkPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGpvYklkICsgXCI8L2Rpdj48L2Rpdj5cIlxuICAgICAgICAgICsgcmVhc29uICsgXCI8L2Rpdj48L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnPjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+QVRUVUlEPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuQVRUVUlEICsgXCI8c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDttYXJnaW4tbGVmdDo4cHg7Jz5UZWNobmljaWFuIE5hbWU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS50ZWNobmljaWFuTmFtZSArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0naW5mb1Jvdycgc3R5bGU9J3BhZGRpbmctbGVmdDo1cHg7cGFkZGluZy1yaWdodDo1cHg7JyA+XCJcbiAgICAgICAgICArIFwiPGRpdj48c3BhbiBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPkN1c3RvbWVyIE5hbWU8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS5jdXN0b21lck5hbWUgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2luZm9Sb3cnIHN0eWxlPSdwYWRkaW5nLWxlZnQ6NXB4O3BhZGRpbmctcmlnaHQ6NXB4OycgPlwiXG4gICAgICAgICAgKyBcIjxkaXY+PHNwYW4gc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5EaXNwYXRjaCBUaW1lPC9zcGFuPiZuYnNwOzombmJzcDtcIiArIGRhdGEuZGlzcGF0Y2hUaW1lICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8L2Rpdj5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdpbmZvUm93JyBzdHlsZT0ncGFkZGluZy1sZWZ0OjVweDtwYWRkaW5nLXJpZ2h0OjVweDsnID5cIlxuICAgICAgICAgICsgXCI8ZGl2PjxzcGFuIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+Sm9iIEFkZHJlc3M8L3NwYW4+Jm5ic3A7OiZuYnNwO1wiICsgZGF0YS53b3JrQWRkcmVzcyArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgICArIFwiPGhyIHN0eWxlPSdtYXJnaW4tdG9wOjFweDsgbWFyZ2luLWJvdHRvbTo1cHg7JyAvPlwiXG5cbiAgICAgICAgICArIFwiPGRpdiBzdHlsZT0nbWFyZ2luLWxlZnQ6IDEwcHg7Jz4gPGRpdiBjbGFzcz0ncm93Jz4gPGRpdiBjbGFzcz0nc3BlZWQgY29sLW1kLTMnPiA8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tbGVmdDogMXB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIGRhdGEuU3BlZWQgKyBcIjwvcD48cCBzdHlsZT0nbWFyZ2luOiAxMHB4IDEwcHg7Jz5tcGg8L3A+PC9kaXY+PHAgc3R5bGU9J21hcmdpbjowcHgnIGNsYXNzPSdpbmZvQm94LWJvdHRvbTEnPlNwZWVkPC9wPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J2lkbGUgY29sLW1kLTUnPjxkaXYgY2xhc3M9J3Jvdycgc3R5bGU9J21hcmdpbi1sZWZ0OiAxMHB4Jz48cCBzdHlsZT0nZm9udC13ZWlnaHQ6IGJvbGRlcjtmb250LXNpemU6IDIzcHg7bWFyZ2luOiAwcHg7Jz5cIiArIGRhdGEuRVRBICsgXCI8L3A+PHAgc3R5bGU9J21hcmdpbjogMTBweCAxMHB4Oyc+TWluczwvcD48L2Rpdj48cCBzdHlsZT0nbWFyZ2luOjBweCcgY2xhc3M9J2luZm9Cb3gtYm90dG9tMSc+Q3VtdWxhdGl2ZSBJZGxlIE1pbnV0ZXM8L3A+PC9kaXY+IDxkaXYgY2xhc3M9J21pbGVzIGNvbC1tZC00Jz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdtYXJnaW4tbGVmdDogMTBweCc+PHAgc3R5bGU9J2ZvbnQtd2VpZ2h0OiBib2xkZXI7Zm9udC1zaXplOiAyM3B4O21hcmdpbjogMHB4Oyc+XCIgKyB0aGF0LmNvbnZlcnRNaWxlc1RvRmVldChkYXRhLkRpc3RhbmNlKSArIFwiPC9wPjxwIHN0eWxlPSdtYXJnaW46IDEwcHggMTBweDsnPkZ0PC9wPjwvZGl2PjxwIHN0eWxlPSdtYXJnaW46MHB4JyBjbGFzcz0naW5mb0JveC1ib3R0b20xJz5GZWV0IHRvIEpvYiBTaXRlPC9wPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjwvZGl2PjwvZGl2PjxociBzdHlsZT0nbWFyZ2luLXRvcDoxcHg7IG1hcmdpbi1ib3R0b206NXB4OycgLz5cIlxuICAgICAgICAgICsgXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdjdXJzb3I6IHBvaW50ZXInPiA8ZGl2IGNsYXNzPSdjb2wtbWQtMSc+PC9kaXY+PGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zJyBzdHlsZT0nXCIgKyBjbGFzc05hbWUgKyBcIic+IDxpIGNsYXNzPSdmYSBmYS1jb21tZW50aW5nIGNvbC1tZC0yJz48L2k+PHAgY2xhc3M9J2NvbC1tZC02IHNtcycgdGl0bGU9J0NsaWNrIHRvIHNlbmQgU01TJyA+U01TPC9wPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3JvdyBjb2wtbWQtMyBvZmZzZXQtbWQtMScgc3R5bGU9J1wiICsgY2xhc3NOYW1lICsgXCInPiA8aSBjbGFzcz0nZmEgZmEtZW52ZWxvcGUgY29sLW1kLTInIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PHAgY2xhc3M9J2NvbC1tZC02IGVtYWlsJyB0aXRsZT0nQ2xpY2sgdG8gc2VuZCBlbWFpbCcgPkVtYWlsPC9wPjwvZGl2PlwiXG4gICAgICAgICAgKyBcIjxkaXYgY2xhc3M9J3JvdyBjb2wtbWQtMyc+PC9kaXY+XCJcbiAgICAgICAgICArIFwiPGRpdiBjbGFzcz0ncm93IGNvbC1tZC0zJyBzdHlsZT0nXCIgKyBzdHlsZUxlZnQgKyBcIic+PGkgY2xhc3M9J2ZhIGZhLWV5ZSBjb2wtbWQtMicgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48cCBjbGFzcz0nY29sLW1kLTYgd2F0Y2hsaXN0JyB0aXRsZT0nQ2xpY2sgdG8gYWRkIGluIHdhdGNobGlzdCcgPldhdGNoPC9wPjwvZGl2PiA8L2Rpdj5cIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGluZm9ib3hEYXRhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZpZXdUcnVja0RldGFpbHMoZSkge1xuICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnZmEgZmEtdGltZXMnKSB7XG4gICAgICAgIHRoYXQuaW5mb2JveC5zZXRPcHRpb25zKHtcbiAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2RldGFpbHMnKSB7XG4gICAgICAgIC8vdGhhdC5yb3V0ZXIubmF2aWdhdGUoWycvdGVjaG5pY2lhbi1kZXRhaWxzJ10pO1xuICAgICAgfVxuXG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdjb2wtbWQtNiBzbXMnKSB7XG4gICAgICAgIGxldCBzZWxlY3RlZFRydWNrOiBhbnk7XG4gICAgICAgIHNlbGVjdGVkVHJ1Y2sgPSB0aGF0Lm1hcFNlcnZpY2UucmV0cmlldmVEYXRhRnJvbVNlc3Npb25TdG9yYWdlKCdzZWxlY3RlZFRydWNrJyk7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkVHJ1Y2sgIT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IHRlY2huaWNpYW5EZXRhaWxzID0gdGhhdC5yZXBvcnRpbmdUZWNobmljaWFuRGV0YWlscy5maW5kKFxuICAgICAgICAgICAgeCA9PiB4LmF0dHVpZC50b0xvd2VyQ2FzZSgpID09IHNlbGVjdGVkVHJ1Y2suQVRUVUlELnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgICAgICAgaWYgKHRlY2huaWNpYW5EZXRhaWxzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhbkVtYWlsID0gdGVjaG5pY2lhbkRldGFpbHMuZW1haWw7XG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5QaG9uZSA9IHRlY2huaWNpYW5EZXRhaWxzLnBob25lO1xuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuTmFtZSA9IHRlY2huaWNpYW5EZXRhaWxzLm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGpRdWVyeSgnI215TW9kYWxTTVMnKS5tb2RhbCgnc2hvdycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZS5vcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09ICdjb2wtbWQtNiBlbWFpbCcpIHtcbiAgICAgICAgbGV0IHNlbGVjdGVkVHJ1Y2s6IGFueTtcbiAgICAgICAgc2VsZWN0ZWRUcnVjayA9IHRoYXQubWFwU2VydmljZS5yZXRyaWV2ZURhdGFGcm9tU2Vzc2lvblN0b3JhZ2UoJ3NlbGVjdGVkVHJ1Y2snKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRUcnVjayAhPSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgdGVjaG5pY2lhbkRldGFpbHMgPSB0aGF0LnJlcG9ydGluZ1RlY2huaWNpYW5EZXRhaWxzLmZpbmQoXG4gICAgICAgICAgICB4ID0+IHguYXR0dWlkLnRvTG93ZXJDYXNlKCkgPT0gc2VsZWN0ZWRUcnVjay5BVFRVSUQudG9Mb3dlckNhc2UoKSk7XG5cbiAgICAgICAgICBpZiAodGVjaG5pY2lhbkRldGFpbHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50ZWNobmljaWFuRW1haWwgPSB0ZWNobmljaWFuRGV0YWlscy5lbWFpbDtcbiAgICAgICAgICAgIHRoaXMudGVjaG5pY2lhblBob25lID0gdGVjaG5pY2lhbkRldGFpbHMucGhvbmU7XG4gICAgICAgICAgICB0aGlzLnRlY2huaWNpYW5OYW1lID0gdGVjaG5pY2lhbkRldGFpbHMubmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbEVtYWlsJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgIH1cbiAgICAgXG4gICAgfVxuICB9XG5cbiAgbG9hZERpcmVjdGlvbnModGhhdCwgc3RhcnRMb2MsIGVuZExvYywgaW5kZXgsIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpIHtcbiAgICBNaWNyb3NvZnQuTWFwcy5sb2FkTW9kdWxlKCdNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zJywgKCkgPT4ge1xuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlciA9IG5ldyBNaWNyb3NvZnQuTWFwcy5EaXJlY3Rpb25zLkRpcmVjdGlvbnNNYW5hZ2VyKHRoYXQubWFwKTtcbiAgICAgIC8vIFNldCBSb3V0ZSBNb2RlIHRvIGRyaXZpbmdcbiAgICAgIHRoaXMuZGlyZWN0aW9uc01hbmFnZXIuc2V0UmVxdWVzdE9wdGlvbnMoe1xuICAgICAgICByb3V0ZU1vZGU6IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuUm91dGVNb2RlLmRyaXZpbmdcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5zZXRSZW5kZXJPcHRpb25zKHtcbiAgICAgICAgZHJpdmluZ1BvbHlsaW5lT3B0aW9uczoge1xuICAgICAgICAgIHN0cm9rZUNvbG9yOiAnZ3JlZW4nLFxuICAgICAgICAgIHN0cm9rZVRoaWNrbmVzczogMyxcbiAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB3YXlwb2ludFB1c2hwaW5PcHRpb25zOiB7IHZpc2libGU6IGZhbHNlIH0sXG4gICAgICAgIHZpYXBvaW50UHVzaHBpbk9wdGlvbnM6IHsgdmlzaWJsZTogZmFsc2UgfSxcbiAgICAgICAgYXV0b1VwZGF0ZU1hcFZpZXc6IGZhbHNlXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgd2F5cG9pbnQxID0gbmV3IE1pY3Jvc29mdC5NYXBzLkRpcmVjdGlvbnMuV2F5cG9pbnQoe1xuICAgICAgICBsb2NhdGlvbjogbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHN0YXJ0TG9jLmxhdGl0dWRlLCBzdGFydExvYy5sb25naXR1ZGUpLCBpY29uOiAnJ1xuICAgICAgfSk7XG4gICAgICBjb25zdCB3YXlwb2ludDIgPSBuZXcgTWljcm9zb2Z0Lk1hcHMuRGlyZWN0aW9ucy5XYXlwb2ludCh7XG4gICAgICAgIGxvY2F0aW9uOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZW5kTG9jLmxhdGl0dWRlLCBlbmRMb2MubG9uZ2l0dWRlKVxuICAgICAgfSk7XG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50MSk7XG4gICAgICB0aGlzLmRpcmVjdGlvbnNNYW5hZ2VyLmFkZFdheXBvaW50KHdheXBvaW50Mik7XG5cbiAgICAgIC8vIEFkZCBldmVudCBoYW5kbGVyIHRvIGRpcmVjdGlvbnMgbWFuYWdlci5cbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHRoaXMuZGlyZWN0aW9uc01hbmFnZXIsICdkaXJlY3Rpb25zVXBkYXRlZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIC8vIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgdmFyIHJvdXRlSW5kZXggPSBlLnJvdXRlWzBdLnJvdXRlTGVnc1swXS5vcmlnaW5hbFJvdXRlSW5kZXg7XG4gICAgICAgIHZhciBuZXh0SW5kZXggPSByb3V0ZUluZGV4O1xuICAgICAgICBpZiAoZS5yb3V0ZVswXS5yb3V0ZVBhdGgubGVuZ3RoID4gcm91dGVJbmRleCkge1xuICAgICAgICAgIG5leHRJbmRleCA9IHJvdXRlSW5kZXggKyAxO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZXh0TG9jYXRpb24gPSBlLnJvdXRlWzBdLnJvdXRlUGF0aFtuZXh0SW5kZXhdO1xuICAgICAgICB2YXIgcGluID0gdGhhdC5tYXAuZW50aXRpZXMuZ2V0KGluZGV4KTtcbiAgICAgICAgLy8gdmFyIGJlYXJpbmcgPSB0aGF0LmNhbGN1bGF0ZUJlYXJpbmcoc3RhcnRMb2MsbmV4dExvY2F0aW9uKTtcbiAgICAgICAgdGhhdC5Nb3ZlUGluT25EaXJlY3Rpb24odGhhdCwgZS5yb3V0ZVswXS5yb3V0ZVBhdGgsIHBpbiwgdHJ1Y2tVcmwsIHRydWNrSWRSYW5JZCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5kaXJlY3Rpb25zTWFuYWdlci5jYWxjdWxhdGVEaXJlY3Rpb25zKCk7XG4gICAgfSk7XG4gIH1cblxuICBNb3ZlUGluT25EaXJlY3Rpb24odGhhdCwgcm91dGVQYXRoLCBwaW4sIHRydWNrVXJsLCB0cnVja0lkUmFuSWQpIHtcbiAgICB0aGF0ID0gdGhpcztcbiAgICB2YXIgaXNHZW9kZXNpYyA9IGZhbHNlO1xuICAgIHRoYXQuY3VycmVudEFuaW1hdGlvbiA9IG5ldyBCaW5nLk1hcHMuQW5pbWF0aW9ucy5QYXRoQW5pbWF0aW9uKHJvdXRlUGF0aCwgZnVuY3Rpb24gKGNvb3JkLCBpZHgsIGZyYW1lSWR4LCByb3RhdGlvbkFuZ2xlLCBsb2NhdGlvbnMsIHRydWNrSWRSYW5JZCkge1xuXG4gICAgICBpZiAodGhhdC5hbmltYXRpb25UcnVja0xpc3QubGVuZ3RoID4gMCAmJiB0aGF0LmFuaW1hdGlvblRydWNrTGlzdC5zb21lKHggPT4geCA9PSB0cnVja0lkUmFuSWQpKSB7XG4gICAgICAgIHZhciBpbmRleCA9IChmcmFtZUlkeCA9PSBsb2NhdGlvbnMubGVuZ3RoIC0gMSkgPyBmcmFtZUlkeCA6IGZyYW1lSWR4ICsgMTtcbiAgICAgICAgdmFyIHJvdGF0aW9uQW5nbGUgPSB0aGF0LmNhbGN1bGF0ZUJlYXJpbmcoY29vcmQsIGxvY2F0aW9uc1tpbmRleF0pO1xuICAgICAgICBpZiAodGhhdC5pc09kZChmcmFtZUlkeCkpIHtcbiAgICAgICAgICB0aGF0LmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4ocGluLCB0cnVja1VybCwgcm90YXRpb25BbmdsZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZnJhbWVJZHggPT0gbG9jYXRpb25zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICB0aGF0LmNyZWF0ZVJvdGF0ZWRJbWFnZVB1c2hwaW4ocGluLCB0cnVja1VybCwgcm90YXRpb25BbmdsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcGluLnNldExvY2F0aW9uKGNvb3JkKTtcbiAgICAgIH1cblxuICAgIH0sIGlzR2VvZGVzaWMsIHRoYXQudHJhdmFsRHVyYXRpb24sIHRydWNrSWRSYW5JZCk7XG5cbiAgICB0aGF0LmN1cnJlbnRBbmltYXRpb24ucGxheSgpO1xuICB9XG5cbiAgQ2FsY3VsYXRlTmV4dENvb3JkKHN0YXJ0TG9jYXRpb24sIGVuZExvY2F0aW9uKSB7XG4gICAgdHJ5IHtcblxuICAgICAgdmFyIGRsYXQgPSAoZW5kTG9jYXRpb24ubGF0aXR1ZGUgLSBzdGFydExvY2F0aW9uLmxhdGl0dWRlKTtcbiAgICAgIHZhciBkbG9uID0gKGVuZExvY2F0aW9uLmxvbmdpdHVkZSAtIHN0YXJ0TG9jYXRpb24ubG9uZ2l0dWRlKTtcbiAgICAgIHZhciBhbHBoYSA9IE1hdGguYXRhbjIoZGxhdCAqIE1hdGguUEkgLyAxODAsIGRsb24gKiBNYXRoLlBJIC8gMTgwKTtcbiAgICAgIHZhciBkeCA9IDAuMDAwMTUyMzg3OTQ3Mjc5MDk5MzE7XG4gICAgICBkbGF0ID0gZHggKiBNYXRoLnNpbihhbHBoYSk7XG4gICAgICBkbG9uID0gZHggKiBNYXRoLmNvcyhhbHBoYSk7XG4gICAgICB2YXIgbmV4dENvb3JkID0gbmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKHN0YXJ0TG9jYXRpb24ubGF0aXR1ZGUgKyBkbGF0LCBzdGFydExvY2F0aW9uLmxvbmdpdHVkZSArIGRsb24pO1xuXG4gICAgICBkbGF0ID0gbnVsbDtcbiAgICAgIGRsb24gPSBudWxsO1xuICAgICAgYWxwaGEgPSBudWxsO1xuICAgICAgZHggPSBudWxsO1xuXG4gICAgICByZXR1cm4gbmV4dENvb3JkO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3IgaW4gQ2FsY3VsYXRlTmV4dENvb3JkIC0gJyArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBpc09kZChudW0pIHtcbiAgICByZXR1cm4gbnVtICUgMjtcbiAgfVxuXG4gIGRlZ1RvUmFkKHgpIHtcbiAgICByZXR1cm4geCAqIE1hdGguUEkgLyAxODA7XG4gIH1cblxuICByYWRUb0RlZyh4KSB7XG4gICAgcmV0dXJuIHggKiAxODAgLyBNYXRoLlBJO1xuICB9XG5cbiAgY2FsY3VsYXRlQmVhcmluZyhvcmlnaW4sIGRlc3QpIHtcbiAgICAvLy8gPHN1bW1hcnk+Q2FsY3VsYXRlcyB0aGUgYmVhcmluZyBiZXR3ZWVuIHR3byBsb2FjYXRpb25zLjwvc3VtbWFyeT5cbiAgICAvLy8gPHBhcmFtIG5hbWU9XCJvcmlnaW5cIiB0eXBlPVwiTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb25cIj5Jbml0aWFsIGxvY2F0aW9uLjwvcGFyYW0+XG4gICAgLy8vIDxwYXJhbSBuYW1lPVwiZGVzdFwiIHR5cGU9XCJNaWNyb3NvZnQuTWFwcy5Mb2NhdGlvblwiPlNlY29uZCBsb2NhdGlvbi48L3BhcmFtPlxuICAgIHRyeSB7XG4gICAgICB2YXIgbGF0MSA9IHRoaXMuZGVnVG9SYWQob3JpZ2luLmxhdGl0dWRlKTtcbiAgICAgIHZhciBsb24xID0gb3JpZ2luLmxvbmdpdHVkZTtcbiAgICAgIHZhciBsYXQyID0gdGhpcy5kZWdUb1JhZChkZXN0LmxhdGl0dWRlKTtcbiAgICAgIHZhciBsb24yID0gZGVzdC5sb25naXR1ZGU7XG4gICAgICB2YXIgZExvbiA9IHRoaXMuZGVnVG9SYWQobG9uMiAtIGxvbjEpO1xuICAgICAgdmFyIHkgPSBNYXRoLnNpbihkTG9uKSAqIE1hdGguY29zKGxhdDIpO1xuICAgICAgdmFyIHggPSBNYXRoLmNvcyhsYXQxKSAqIE1hdGguc2luKGxhdDIpIC0gTWF0aC5zaW4obGF0MSkgKiBNYXRoLmNvcyhsYXQyKSAqIE1hdGguY29zKGRMb24pO1xuXG4gICAgICBsYXQxID0gbGF0MiA9IGxvbjEgPSBsb24yID0gZExvbiA9IG51bGw7XG5cbiAgICAgIHJldHVybiAodGhpcy5yYWRUb0RlZyhNYXRoLmF0YW4yKHksIHgpKSArIDM2MCkgJSAzNjA7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBpbiBjYWxjdWxhdGVCZWFyaW5nIC0gJyArIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBTZW5kU01TKGZvcm0pIHtcbiAgICAvLyBpZih0aGlzLnRlY2huaWNpYW5QaG9uZSAhPSAnJyl7XG4gICAgaWYgKGZvcm0udmFsdWUubW9iaWxlTm8gIT0gJycpIHtcbiAgICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgd2FudCB0byBzZW5kIFNNUz8nKSkge1xuICAgICAgICAvLyB0aGlzLm1hcFNlcnZpY2Uuc2VuZFNNUyh0aGlzLnRlY2huaWNpYW5QaG9uZSxmb3JtLnZhbHVlLnNtc01lc3NhZ2UpO1xuICAgICAgICB0aGlzLm1hcFNlcnZpY2Uuc2VuZFNNUyhmb3JtLnZhbHVlLm1vYmlsZU5vLCBmb3JtLnZhbHVlLnNtc01lc3NhZ2UpO1xuXG4gICAgICAgIGZvcm0uY29udHJvbHMuc21zTWVzc2FnZS5yZXNldCgpXG4gICAgICAgIGZvcm0udmFsdWUubW9iaWxlTm8gPSB0aGlzLnRlY2huaWNpYW5QaG9uZTtcbiAgICAgICAgalF1ZXJ5KCcjbXlNb2RhbFNNUycpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgIC8vdGhpcy50b2FzdHIuc3VjY2VzcygnU01TIHNlbnQgc3VjY2Vzc2Z1bGx5JywgJ1N1Y2Nlc3MnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIFNlbmRFbWFpbChmb3JtKSB7XG4gICAgLy8gaWYodGhpcy50ZWNobmljaWFuRW1haWwgIT0gJycpe1xuICAgIGlmIChmb3JtLnZhbHVlLmVtYWlsSWQgIT0gJycpIHtcbiAgICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgd2FudCB0byBzZW5kIEVtYWlsPycpKSB7XG5cbiAgICAgICAgLy8gdGhpcy51c2VyUHJvZmlsZVNlcnZpY2UuZ2V0VXNlckRhdGEodGhpcy5jb29raWVBVFRVSUQpXG4gICAgICAgIC8vICAgLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAvLyAgICAgdmFyIG5ld0RhdGE6IGFueSA9IHRoaXMuc3RyaW5naWZ5SnNvbihkYXRhKTtcbiAgICAgICAgLy8gICAgIC8vdGhpcy5tYXBTZXJ2aWNlLnNlbmRFbWFpbChuZXdEYXRhLmVtYWlsLHRoaXMudGVjaG5pY2lhbkVtYWlsLG5ld0RhdGEubGFzdE5hbWUgKyAnICcgKyBuZXdEYXRhLmZpcnN0TmFtZSwgdGhpcy50ZWNobmljaWFuTmFtZSwgZm9ybS52YWx1ZS5lbWFpbFN1YmplY3QsZm9ybS52YWx1ZS5lbWFpbE1lc3NhZ2UpO1xuICAgICAgICAvLyAgICAgdGhpcy5tYXBTZXJ2aWNlLnNlbmRFbWFpbChuZXdEYXRhLmVtYWlsLCBmb3JtLnZhbHVlLmVtYWlsSWQsIG5ld0RhdGEubGFzdE5hbWUgKyAnICcgKyBuZXdEYXRhLmZpcnN0TmFtZSwgdGhpcy50ZWNobmljaWFuTmFtZSwgZm9ybS52YWx1ZS5lbWFpbFN1YmplY3QsIGZvcm0udmFsdWUuZW1haWxNZXNzYWdlKTtcbiAgICAgICAgLy8gICAgIHRoaXMudG9hc3RyLnN1Y2Nlc3MoXCJFbWFpbCBzZW50IHN1Y2Nlc3NmdWxseVwiLCAnU3VjY2VzcycpO1xuXG4gICAgICAgIC8vICAgICBmb3JtLmNvbnRyb2xzLmVtYWlsU3ViamVjdC5yZXNldCgpXG4gICAgICAgIC8vICAgICBmb3JtLmNvbnRyb2xzLmVtYWlsTWVzc2FnZS5yZXNldCgpXG4gICAgICAgIC8vICAgICBmb3JtLnZhbHVlLmVtYWlsSWQgPSB0aGlzLnRlY2huaWNpYW5FbWFpbDtcbiAgICAgICAgLy8gICAgIGpRdWVyeSgnI215TW9kYWxFbWFpbCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgIC8vICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgU2VhcmNoVHJ1Y2soZm9ybSkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuXG4gICAgLy8kKCcjbG9hZGluZycpLnNob3coKTtcblxuICAgIGlmIChmb3JtLnZhbHVlLmlucHV0bWlsZXMgIT0gJycgJiYgZm9ybS52YWx1ZS5pbnB1dG1pbGVzICE9IG51bGwpIHtcbiAgICAgIGNvbnN0IGx0ID0gdGhhdC5jbGlja2VkTGF0O1xuICAgICAgY29uc3QgbGcgPSB0aGF0LmNsaWNrZWRMb25nO1xuICAgICAgY29uc3QgcmQgPSBmb3JtLnZhbHVlLmlucHV0bWlsZXM7XG5cbiAgICAgIHRoaXMuZm91bmRUcnVjayA9IGZhbHNlO1xuICAgICAgdGhpcy5hbmltYXRpb25UcnVja0xpc3QgPSBbXTtcblxuICAgICAgaWYgKHRoaXMuY29ubmVjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxvYWRNYXBWaWV3KCdyb2FkJyk7XG5cbiAgICAgIHRoYXQuTG9hZFRydWNrcyh0aGlzLm1hcCwgbHQsIGxnLCByZCwgdHJ1ZSk7XG5cbiAgICAgIGZvcm0uY29udHJvbHMuaW5wdXRtaWxlcy5yZXNldCgpO1xuICAgICAgalF1ZXJ5KCcjbXlSYWRpdXNNb2RhbCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgLy8kKCcjbG9hZGluZycpLmhpZGUoKTtcbiAgICAgIH0sIDEwMDAwKTtcbiAgICB9XG4gIH1cblxuXG5cbiAgZ2V0TWlsZXMoaSkge1xuICAgIHJldHVybiBpICogMC4wMDA2MjEzNzExOTI7XG4gIH1cblxuICBnZXRNZXRlcnMoaSkge1xuICAgIHJldHVybiBpICogMTYwOS4zNDQ7XG4gIH1cblxuICBzdHJpbmdpZnlKc29uKGRhdGEpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gIH1cbiAgcGFyc2VUb0pzb24oZGF0YSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICB9XG5cbiAgUm91bmQobnVtYmVyLCBwcmVjaXNpb24pIHtcbiAgICB2YXIgZmFjdG9yID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG4gICAgdmFyIHRlbXBOdW1iZXIgPSBudW1iZXIgKiBmYWN0b3I7XG4gICAgdmFyIHJvdW5kZWRUZW1wTnVtYmVyID0gTWF0aC5yb3VuZCh0ZW1wTnVtYmVyKTtcbiAgICByZXR1cm4gcm91bmRlZFRlbXBOdW1iZXIgLyBmYWN0b3I7XG4gIH1cblxuICBnZXRBdGFuMih5LCB4KSB7XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCk7XG4gIH07XG5cbiAgZ2V0SWNvblVybChjb2xvcjogc3RyaW5nLCBzb3VyY2VMYXQ6IG51bWJlciwgc291cmNlTG9uZzogbnVtYmVyLCBkZXN0aW5hdGlvbkxhdDogbnVtYmVyLCBkZXN0aW5hdGlvbkxvbmc6IG51bWJlcikge1xuICAgIHZhciBpY29uVXJsID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQURBQUFBQXdDQVlBQUFCWEF2bUhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBM1pKUkVGVWFJSHRsMTFJVTJFWXgvOXZ1VnFRYXhlQjZ3djBLc2NJRjRHMGJwb2Fabld6aFZwZFZFcDFFUnJtcENodk1nanJJaFQ2b0tCWjZFWFVBdWVOYUZIMFFUU3h5QVdWWFJRdVAxQXZzdTNNNW5IYW5pN2NsdW5aeDlsbUNMNi9xM1BPOC9LYy8vOTV2d0VPaDhQaGNEZ2NEb2V6VkdHcFNFSkVhZ0JWcWNnbGdZc3gxaHdwbUpac2RpSlNCeWp3WWN6M2MrMndaOFNmYkw2NWJGbXZVeE9Sa1RGV0xoV1gzUVBCYXU4RW9BOSswazlNaWZ1MlhkMnBFRVFoQ2FuU1dQSXFZVEZXQUVBV1k4dzFOeTZyQjRpb2FqcncrMUxhc3VXciszNzBqNDlQZXFjelZCbEsxOWgzdGhEaUFjRGg2Z1pRQVFDWkFCSTNRRVQzQUpSZGUzVWJWa2NMQkZGWURjeFVhRWRtYm9ya3lpY3VBeUh4bHJaYTJIcnNDeXhKSHN0aU5Wak00b0VZQmhhN2VDQ0tBU0l5WXBHTEI2TE1nY2xwLzVuWDM5NU0yWHJzaXY4cFNDNFJEYXhNVzdHM3ZmZEpYRW5TbGVrcEV6U1hOVXBWMUhqVVZXakFQUlR6QjRMb2hVNlRqUks5S2E3MmNpbk9NWVVlblZMeHBJOFN0aDQ3U3ZVbU5Kb3ZKNXNxR3RXTU1iZFVJR2tEZ2lpZzhKWVpocXpVYjJhbGVqTks5Q1lnUXZXQkpBem9ORnA4R3VrTnZ6djZ1aE5OTlM5WENFTWNPN3dzQXlxbENnMm1laFJwQzhMZkdwN2ZRTU9MbTNMU2hEbTIvUWhxOGlxaENpNENEbGMzTFBaYVdYTkpsb0dtUTlleFNiMFJ4eCtjZ2tjVW9OTm9VV09zd0pwVktsem9rRGNIamh1T29xN29ISnE2V3RENTVSa0FvTVpZQ1Z0NU0zYmYybzk0RDRjUkRZalQ0cWhPbzgwSURZMGk3UzRZTW5OaGFOd1ZycENqcnh1RDdpRllEMTZIMWRFaXEzSVdZd1VlT2R2K01WN2Nkd1JkMWM5UXV0VU1xNk1aT2V0MFV3QVVrRGlGeGpTZ1RGUGVQcHRmVmV1WjhDZ0czRU1vM0p5UEx0ZmJlU0k3ZTU4Q0FBcXpDeVRIc1JRNmpSWXFaVHBzenZrN3ZNMXB4KzdzZkJBUkNqWWJGUUJlU3QwRFlocGdqTlVSa2JyUmZEbDhWUnp4anZvQnJKamRUaFhjYUM3dU9SK1grTmxJYlZLYjFCdG1lbnBtQXI4RVlKclhhTGJPZUg1RVJIck1YQ2pzZFoxWFlIWDh2YUkybU9wUnV0VU1BR1lBa211MUZPT1R2Z09EN3NFVCsrOGVYaDRhN3pxTkZvOVB0b2FGUjFyN0U0YUl5b2lJUGc3MzBwMDN6ZFQvYzVDQ2xDV1FTeTJJM3EvQ2hCQjQrTDZWT2o0L0pTS2lRQ0RnQ1Jac1lTQWlvemcxMmY3ajE1alQ1NSs0SHp5MUpwcExUVVNuUGFMM25jL3Y2eUtpdXVDZG04UGhjRGljcGNFZmszZUFMYmMxK1ZRQUFBQUFTVVZPUks1Q1lJST1cIjtcblxuICAgIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwiZ3JlZW5cIikge1xuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQTNaSlJFRlVhSUh0bDExSVUyRVl4Lzl2dVZxUWF4ZUI2d3YwS3NjSUY0RzBicG9hWm5XemhWcGRWRXAxRVJybXBDaHZNZ2pySWhUNm9LQlo2RVhVQXVlTmFGSDBRVFN4eUFXVlhSUXVQMUF2c3UzTTVuSGFuaTdjbHVuWng5bG1DTDYvcTNQTzgvS2MvLzk1dndFT2g4UGhjRGdjRG9lelZHR3BTRUpFYWdCVnFjZ2xnWXN4MWh3cG1KWnNkaUpTQnlqd1ljejNjKzJ3WjhTZmJMNjViRm12VXhPUmtURldMaFdYM1FQQmF1OEVvQTkrMGs5TWlmdTJYZDJwRUVRaENhblNXUElxWVRGV0FFQVdZOHcxTnk2ckI0aW9hanJ3KzFMYXN1V3IrMzcwajQ5UGVxY3pWQmxLMTloM3RoRGlBY0RoNmdaUUFRQ1pBQkkzUUVUM0FKUmRlM1ViVmtjTEJGRllEY3hVYUVkbWJvcmt5aWN1QXlIeGxyWmEySHJzQ3l4SkhzdGlOVmpNNG9FWUJoYTdlQ0NLQVNJeVlwR0xCNkxNZ2NscC81blgzOTVNMlhyc2l2OHBTQzRSRGF4TVc3RzN2ZmRKWEVuU2xla3BFelNYTlVwVjFIalVWV2pBUFJUekI0TG9oVTZUalJLOUthNzJjaW5PTVlVZW5WTHhwSThTdGg0N1N2VW1OSm92SjVzcUd0V01NYmRVSUdrRGdpaWc4SllaaHF6VWIyYWxlak5LOUNZZ1F2V0JKQXpvTkZwOEd1a052enY2dWhOTk5TOVhDRU1jTzd3c0F5cWxDZzJtZWhScEM4TGZHcDdmUU1PTG0zTFNoRG0yL1FocThpcWhDaTRDRGxjM0xQWmFXWE5KbG9HbVE5ZXhTYjBSeHgrY2drY1VvTk5vVVdPc3dKcFZLbHpva0RjSGpodU9vcTdvSEpxNld0RDU1UmtBb01aWUNWdDVNM2JmMm85NEQ0Y1JEWWpUNHFoT284MElEWTBpN1M0WU1uTmhhTndWcnBDanJ4dUQ3aUZZRDE2SDFkRWlxM0lXWXdVZU9kditNVjdjZHdSZDFjOVF1dFVNcTZNWk9ldDBVd0FVa0RpRnhqU2dURlBlUHB0ZlZldVo4Q2dHM0VNbzNKeVBMdGZiZVNJN2U1OENBQXF6Q3lUSHNSUTZqUllxWlRwc3p2azd2TTFweCs3c2ZCQVJDalliRlFCZVN0MERZaHBnak5VUmticlJmRGw4VlJ6eGp2b0JySmpkVGhYY2FDN3VPUitYK05sSWJWS2IxQnRtZW5wbUFyOEVZSnJYYUxiT2VINUVSSHJNWENqc2RaMVhZSFg4dmFJMm1PcFJ1dFVNQUdZQWttdTFGT09UdmdPRDdzRVQrKzhlWGg0YTd6cU5GbzlQdG9hRlIxcjdFNGFJeW9pSVBnNzMwcDAzemRUL2M1Q0NsQ1dRU3kySTNxL0NoQkI0K0w2Vk9qNC9KU0tpUUNEZ0NSWnNZU0Fpb3pnMTJmN2oxNWpUNTUrNEh6eTFKcHBMVFVTblBhTDNuYy92NnlLaXV1Q2RtOFBoY0RpY3BjRWZrM2VBTGJjMStWUUFBQUFBU1VWT1JLNUNZSUk9XCI7XG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwicmVkXCIpIHtcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUEweEpSRUZVYUlIdGx6MXNFbUVjeHA5WGhCUURoUkEvTUNTTlRVeTh0RXNYWEVzZ2NkQUJxb09UcEE0dWtLQU94c1l1RGtKMHJkSG8xSlFtYmdZY1hQeEtuRFRnVUFkdG16U3hJVUNLUkN3ZW9RVjY5M2VBdTJoN0JRNWEwOFQzTngzM1A1NTdudmZyM2hmZ2NEZ2NEb2ZENFhBNC95dHNMMFNJeUE3ZytsNW9hYkRLR0p2YnJYaTRYM1Vpc2tPV1AyLzkvSG0wWGlqVSs5WGJ6cEdSRVRzUmVSaGpWN1hxdW51ZzFkcmpBTVphdDhia3pjMExYendlb3lTS2ZWalZ4aGtPd3hrS0FjQXdZMngxZTExWER4RFJkWktrZTh4Z3NOUXltWXBVcVd5WmpoOGZxR1V5YkQvTUEwQWxuVll1VHdIb1BRQVJ6UUtZTER4OWltSThEa2tVTFVDemhTeHU5MTU0N1ltdUFpam1NOVBUS0NXVCsyeEpINGM2UFhDUXpRTWRBaHgwODBDYkFFVGt3UUUzRDdTWkExU3YzeEkvZkdpVWtrbmp2elNrbDEwRE1KUHAvUHFyVjEySkdLeldQVE9rVjd2dEtsVFA1enUrUUJKRm1BVUJEcisvcStmMTR2RDdsY3NGclhyZlc0bFNJZ0ZISUlDaFdLeGZxWGJjWkl5dGF4WDZEaUNKSXBZdlhvVGw3TmwrcFhiZ0NBU1VIdEJzZmFDUEFHWkJ3TWJTa3ZxN2trcjFLclZEUzZHYkw3eXVBQWFyRlVQUktHdytuM3B2N2RFanJEMStyRWRHNWRpVkszQ0d3K3BFcmFUVHlFeFBvNTdMZGEyaEs4RHd3NGN3dVZ6NEZvbW9rOWNaQ3NFd09JamMvZnY2ekFlRGNOMitqZUw4UE1ydjNnRUFuS0VRVHMvT1l2blNKWFM3T2R3MWdMeTVXVEFMd2dsbGFOaDhQbGpjYm53OWQwNXRvVW9xaFhvdWgrR1pHUlRuNTNXMW5ETVVRdW5GaTcrQ3I2UlNHSG45R282SkNSVGpjUndaSFcwQU1FSmpGOW94d0tHQmdTY25JNUU3VXJsc3JPZnpzSG05cUtUVE8weVczNzV0QnZSNk5jZXhGbVpCZ01GcTFmekNsNUpKMkx4ZWdBaUQ0K05HQU8rMXpnRWRBekRHN2hLUmZTZ1dVNCtLamVhSnkvVG5jOHI0ZFUxTmRXVmU2NzkvWW5LNVlIRzdsUW44SGtDZ25VWlhKeklpR2tQelFKSElQWGlBWWp5dTFvYWlVVGdDQVFDWUFLQzVWbXNoVjZ1WGE5bnN0WlZnMEtDTWQ3TWc0TXp6NTZyeDNkYituaUdpU1NLaTZ1SWlmWitibzFvMlN5MG1lOUN5UzZLNHN2WHJsL3dqa2FEMU4yK2FTckpjYmpYWS9rQkVIcmxXZTlrb2xSYWtqWTFuclYxcnIxcDJJcm9oaWVLbnJXcjFJeEhkYloyNU9Sd09oOFA1UC9nTnFoeC82cnN1ampnQUFBQUFTVVZPUks1Q1lJST1cIjtcbiAgICB9IGVsc2UgaWYgKGNvbG9yLnRvTG93ZXJDYXNlKCkgPT0gXCJ5ZWxsb3dcIikge1xuICAgICAgaWNvblVybCA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFEQUFBQUF3Q0FZQUFBQlhBdm1IQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQXloSlJFRlVhSUh0bHoxTVUxRVlodC92WWhXTmFadGdoQUdObUlDSlZtRndNQ0ZSSEV3RUU4VkpuTVJCblJRZHlnQU9EcnJvWUNJTHVCZ1dZZFBFeUdSaXhCUWNIQ0QrREtoQVdpTTQxSGdKbEovYm50ZWh0L1dudHorM0JVUENlYWJlKzUyOGZiL3ZuSHZPZHdDTlJxUFJhRFFhalVhelVaSFZFQ0hwQjlDeEdsb09USXRJZjdiZ3BsTFZTZnBCTlE3cnh3NHNmbHNwVlM4RDN5RS95U1lSdWVnVWRqMERkcldQQVdpd1h6VWdzWGdxOGVLZ0I1WlpnbE5ucEs0VFJsMFFBR3BFWlByZnVLc1pJTmtCeG05RE5tMUhiSEllMW53YzVWWGxYSmlVdFRBUEFJaUdBQVFCWUErQTRoTWcrUWhBdS9wMEg1enFBeXh6TzVDc2tGUTBycEpiOXhTVVFNbzh4NitCa1lFMXR1UU9JOStBUDgycmRXWWV5SlBBZWpjUDVFaUFaQlBXdVhrZzF6ZVFXQTR5T215cHlJRG5QL3B4VGZZRXlyYTBZT1paWVNvZTd5clpjZEwyNVF6bjNJVVlDK2ZWbDdnSjhRWWd1OXFBQXNhN1JhclBwWDZPT2NWTGJpVlVaQkJHOVhrWTlUMmxTdVhpaG9qOGRBcVVuQUFzRTJxNGFVME9NNmx1Uzg1c2x1b0RKU1FnM2dBNDl6Nzl6R2lvV0trTXJUUVZqWG1iTlhjSmVId3c2aDlBcWxyU3J6aHhGMnJpbml1WkZFYk5aVWhkWi9wRFpUUUVqbDhyNk50TDRTb0I0M0EvWk50dXFMY1hBTXVFK0FLUTJrNkl4dzkrNkhabmZ1OFZ5UDdiVUZNUGdka2hBSGJuZWVRcEVxK1BvOURtTVB0Sm5GajZMcjVBK2xHcVdpQVZqVkNqcmVEc0VCZ05RVTMyUVkxZlRWWnkyMjVYQ1VodEVJd01naCs2azVXUGhxQkd6d0FDR01sMUQvRTNXUGJ3akM0MFJZNXpvTHhYOW5WMWlXVjZFQXRES3B2QjZFakc5REpWdmNxVGdOTTZkakx2RFFBZUgvaDFNQ09tSW9PUXltWVlKR1RuQ1ErQVYwNzNnTHdKaU1ndGtuNmp2dWYzVlhGcFpnWEE1cjhHMnV0WER0eHhmenR5T0tSazY2N2tqcGJjMVY0QmFNMGxVZEIva214QThrTHhoQjl2UWszMnBXTkdmVTlxcXpzTHdIR3ZkaVF4ZjQ2eDhDVTFjcm9zdGQ3Rkc0Qng5R1hhZUxhOXYyaEl0cE9rTXQ4eDhhV1hYQWpUcHIwSUxUOVg1ajdUTXBVS0QxRE5QTGVsbEdrWGJHMGcyY1Q0MG5NdVI4Y1lqejIydTlaaXRmd2tyM1BGZk12NHdodVN0K3c3dDBhajBXZzBHNE5mVGl4a2ZGeHlYUEVBQUFBQVNVVk9SSzVDWUlJPVwiXG4gICAgfSBlbHNlIGlmIChjb2xvci50b0xvd2VyQ2FzZSgpID09IFwicHVycGxlXCIpIHtcbiAgICAgIGljb25VcmwgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBREFBQUFBd0NBWUFBQUJYQXZtSEFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFGNjJsVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE5ESWdOemt1TVRZd09USTBMQ0F5TURFM0x6QTNMekV6TFRBeE9qQTJPak01SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ0tGZHBibVJ2ZDNNcElpQjRiWEE2UTNKbFlYUmxSR0YwWlQwaU1qQXhPQzB3TXkwd00xUXhNVG8wTURvek55MHdOVG93TUNJZ2VHMXdPazF2WkdsbWVVUmhkR1U5SWpJd01UZ3RNRE10TUROVU1URTZOVE02TWpVdE1EVTZNREFpSUhodGNEcE5aWFJoWkdGMFlVUmhkR1U5SWpJd01UZ3RNRE10TUROVU1URTZOVE02TWpVdE1EVTZNREFpSUdSak9tWnZjbTFoZEQwaWFXMWhaMlV2Y0c1bklpQndhRzkwYjNOb2IzQTZRMjlzYjNKTmIyUmxQU0l6SWlCd2FHOTBiM05vYjNBNlNVTkRVSEp2Wm1sc1pUMGljMUpIUWlCSlJVTTJNVGsyTmkweUxqRWlJSGh0Y0UxTk9rbHVjM1JoYm1ObFNVUTlJbmh0Y0M1cGFXUTZZVGxoWVRZeFpHWXRZMlZoTkMwd1l6UXlMVGhoWlRBdFpqWTFaVGRoTldJd01qQmhJaUI0YlhCTlRUcEViMk4xYldWdWRFbEVQU0poWkc5aVpUcGtiMk5wWkRwd2FHOTBiM05vYjNBNk1USTRObVl6WkdVdFpEZGpOUzFrWlRSbUxUZzVOR1l0TVdZek9EazJZbU01WmpGa0lpQjRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VROUluaHRjQzVrYVdRNllUZGtORFJtTjJFdE1qSmxZeTFoT0RRMExUbG1PV0l0TVRBM1lqRmhOV1kyT1RjeUlqNGdQSGh0Y0UxTk9raHBjM1J2Y25rK0lEeHlaR1k2VTJWeFBpQThjbVJtT214cElITjBSWFowT21GamRHbHZiajBpWTNKbFlYUmxaQ0lnYzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRHBoTjJRME5HWTNZUzB5TW1WakxXRTRORFF0T1dZNVlpMHhNRGRpTVdFMVpqWTVOeklpSUhOMFJYWjBPbmRvWlc0OUlqSXdNVGd0TURNdE1ETlVNVEU2TkRBNk16Y3RNRFU2TURBaUlITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUTlJa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUFvVjJsdVpHOTNjeWtpTHo0Z1BISmtaanBzYVNCemRFVjJkRHBoWTNScGIyNDlJbk5oZG1Wa0lpQnpkRVYyZERwcGJuTjBZVzVqWlVsRVBTSjRiWEF1YVdsa09tRTVZV0UyTVdSbUxXTmxZVFF0TUdNME1pMDRZV1V3TFdZMk5XVTNZVFZpTURJd1lTSWdjM1JGZG5RNmQyaGxiajBpTWpBeE9DMHdNeTB3TTFReE1UbzFNem95TlMwd05Ub3dNQ0lnYzNSRmRuUTZjMjltZEhkaGNtVkJaMlZ1ZEQwaVFXUnZZbVVnVUdodmRHOXphRzl3SUVORElDaFhhVzVrYjNkektTSWdjM1JGZG5RNlkyaGhibWRsWkQwaUx5SXZQaUE4TDNKa1pqcFRaWEUrSUR3dmVHMXdUVTA2U0dsemRHOXllVDRnUEM5eVpHWTZSR1Z6WTNKcGNIUnBiMjQrSUR3dmNtUm1PbEpFUmo0Z1BDOTRPbmh0Y0cxbGRHRStJRHcvZUhCaFkydGxkQ0JsYm1ROUluSWlQejZSUTJjWEFBQUNTMGxFUVZSbzN1Mll2VW9EUVJESDh3aDVCTjlBSDhEQzJrWXJXd1h0MVY3UldodTdsSUtLV0NrcU5vS29vS0JFSlNERUQwd1JqU1NTY0dMaUpXWnpkK3Yrejl1d2hIeGU5dUNFR1JoQ05uZXo4NXVkbloxTmhITWUrYzhhSVFBQ0lBQUNJQUFDSUFBQ0lBQUNJQUR0QUwySWVENHFkQ2tnblZUbTBROEE1eDJicDhzRlpoYVMzNSs2bGYvSnVqWUFMOXBqU29UMmFoV2I3UXpmOG8zQmErMmFpR1U4Qmo3UU40QVluN1V0cHdScnhkZEtDUkVxNTFubDQ2NVlDOEo1NlBITWd3UVk2UXNBeXdncmlJZ2FiWHpQeHI5NHFBR2s4NWVMcWFaTEhHcUFkczZISHFDVDg2RUc4RjVvNjN5b0FleXFjL1IyL3NtNktYTmhYWUdPMFpjQXhxTVpHTURwL0xOL0FOQjNtaUMrbW5hdFh5eWsrUEgwZzNaOVBURWtRRFFRQUp3SnhwUEpBNWE1bmx1SmJnSFVYTld0cVlOOFBYMjBBeHhPM0d2TDgxYTJsRDVJRHdEU1JjbEpMbHNMdjQ3SFY5SzhXcXpWYmFHYTdZNG1nZ1BBQktYM0g3Y3k0RGRzWURpUTNNcjI3cnkzK2ZHdVRCblhmdWFuM212MUJTQmE1QndtYVN4bmFvVGFqWGRTZ0NQSEc4Y1JJRGt2emlIWlN2dFpnZVZhMldheVBMN3M1MXNlV0JDa1E3ZWxFYysyMm1QeVlKVFBDRG56ZlNNVG4ydHF2cHU1YXJWWkdmVXJXTDFHZTBybGNaMUgvZS83U2ltK0R3a2RkeU90cEJVVUsrUEp1SGRhZHFYTXRHTEdzMm1wZHd0VW8yYU9hN3NUaS9FcFdFZnJrTnpNdWh2T2s2bElqd0lIV2NsNkVYdkJRUkRxMWMzaFh3aFlpM2UwM0lsSDBPaFZESllRRzMxYlZnZy80clVIY3dMa2hwV3RLK3k3WnBIM0JVQi9iQkVBQVJBQUFSREFmOUJmUmI2NEtZZmxSTEFBQUFBQVNVVk9SSzVDWUlJPVwiXG4gICAgfVxuXG4gICAgcmV0dXJuIGljb25Vcmw7XG4gIH1cblxuICBsb2NhdGVwdXNocGluKG9iaikge1xuICAgIGNvbnN0IHRydWNrSWQgPSBvYmoudHJ1Y2tJZDtcblxuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIHBpbnMgaW4gdGhlIGRhdGEgbGF5ZXIgYW5kIGZpbmQgdGhlIHB1c2hwaW4gZm9yIHRoZSBsb2NhdGlvbi4gXG4gICAgbGV0IHNlYXJjaFBpbjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YUxheWVyLmdldExlbmd0aCgpOyBpKyspIHtcbiAgICAgIHNlYXJjaFBpbiA9IHRoaXMuZGF0YUxheWVyLmdldChpKTtcbiAgICAgIGlmIChzZWFyY2hQaW4ubWV0YWRhdGEudHJ1Y2tJZC50b0xvd2VyQ2FzZSgpICE9PSB0cnVja0lkLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgc2VhcmNoUGluID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIGEgcGluIGlzIGZvdW5kIHdpdGggYSBtYXRjaGluZyBJRCwgdGhlbiBjZW50ZXIgdGhlIG1hcCBvbiBpdCBhbmQgc2hvdyBpdCdzIGluZm9ib3guXG4gICAgaWYgKHNlYXJjaFBpbikge1xuICAgICAgLy8gT2Zmc2V0IHRoZSBjZW50ZXJpbmcgdG8gYWNjb3VudCBmb3IgdGhlIGluZm9ib3guXG4gICAgICB0aGlzLm1hcC5zZXRWaWV3KHsgY2VudGVyOiBzZWFyY2hQaW4uZ2V0TG9jYXRpb24oKSwgem9vbTogMTcgfSk7XG4gICAgICAvLyB0aGlzLmRpc3BsYXlJbmZvQm94KHNlYXJjaFBpbiwgb2JqKTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVSb3RhdGVkSW1hZ2VQdXNocGluKGxvY2F0aW9uLCB1cmwsIHJvdGF0aW9uQW5nbGUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXG4gICAgICB2YXIgcm90YXRpb25BbmdsZVJhZHMgPSByb3RhdGlvbkFuZ2xlICogTWF0aC5QSSAvIDE4MDtcbiAgICAgIGMud2lkdGggPSA1MDtcbiAgICAgIGMuaGVpZ2h0ID0gNTA7XG4gICAgICAvLyBDYWxjdWxhdGUgcm90YXRlZCBpbWFnZSBzaXplLlxuICAgICAgLy8gYy53aWR0aCA9IE1hdGguYWJzKE1hdGguY2VpbChpbWcud2lkdGggKiBNYXRoLmNvcyhyb3RhdGlvbkFuZ2xlUmFkcykgKyBpbWcuaGVpZ2h0ICogTWF0aC5zaW4ocm90YXRpb25BbmdsZVJhZHMpKSk7XG4gICAgICAvLyBjLmhlaWdodCA9IE1hdGguYWJzKE1hdGguY2VpbChpbWcud2lkdGggKiBNYXRoLnNpbihyb3RhdGlvbkFuZ2xlUmFkcykgKyBpbWcuaGVpZ2h0ICogTWF0aC5jb3Mocm90YXRpb25BbmdsZVJhZHMpKSk7XG5cbiAgICAgIHZhciBjb250ZXh0ID0gYy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAvLyBNb3ZlIHRvIHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cbiAgICAgIGNvbnRleHQudHJhbnNsYXRlKGMud2lkdGggLyAyLCBjLmhlaWdodCAvIDIpO1xuXG4gICAgICAvLyBSb3RhdGUgdGhlIGNhbnZhcyB0byB0aGUgc3BlY2lmaWVkIGFuZ2xlIGluIGRlZ3JlZXMuXG4gICAgICBjb250ZXh0LnJvdGF0ZShyb3RhdGlvbkFuZ2xlUmFkcyk7XG5cbiAgICAgIC8vIERyYXcgdGhlIGltYWdlLCBzaW5jZSB0aGUgY29udGV4dCBpcyByb3RhdGVkLCB0aGUgaW1hZ2Ugd2lsbCBiZSByb3RhdGVkIGFsc28uXG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWcsIC1pbWcud2lkdGggLyAyLCAtaW1nLmhlaWdodCAvIDIpO1xuICAgICAgLy8gYW5jaG9yOiBuZXcgTWljcm9zb2Z0Lk1hcHMuUG9pbnQoMjQsIDYpXG4gICAgICBpZiAoIWlzTmFOKHJvdGF0aW9uQW5nbGVSYWRzKSAmJiByb3RhdGlvbkFuZ2xlUmFkcyA+IDApIHtcbiAgICAgICAgbG9jYXRpb24uc2V0T3B0aW9ucyh7IGljb246IGMudG9EYXRhVVJMKCksIGFuY2hvcjogbmV3IE1pY3Jvc29mdC5NYXBzLlBvaW50KGMud2lkdGggLyAyLCBjLmhlaWdodCAvIDIpIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyByZXR1cm4gYztcbiAgICB9O1xuXG4gICAgLy8gQWxsb3cgY3Jvc3MgZG9tYWluIGltYWdlIGVkaXR0aW5nLlxuICAgIGltZy5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuICAgIGltZy5zcmMgPSB1cmw7XG4gIH1cblxuICBnZXRUaHJlc2hvbGRWYWx1ZSgpIHtcblxuICAgIHRoaXMubWFwU2VydmljZS5nZXRSdWxlcyh0aGlzLnRlY2hUeXBlKVxuICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgKGRhdGEpID0+IHtcbiAgICAgICAgICB2YXIgb2JqID0gSlNPTi5wYXJzZSgodGhpcy5zdHJpbmdpZnlCb2R5SnNvbihkYXRhKSkuZGF0YSk7XG4gICAgICAgICAgaWYgKG9iaiAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgaWRsZVRpbWUgPSBvYmouZmlsdGVyKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5maWVsZE5hbWUgPT09ICdDdW11bGF0aXZlIGlkbGUgdGltZSBmb3IgUkVEJyAmJiBlbGVtZW50LmRpc3BhdGNoVHlwZSA9PT0gdGhpcy50ZWNoVHlwZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGlkbGVUaW1lICE9IHVuZGVmaW5lZCAmJiBpZGxlVGltZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyZXNob2xkVmFsdWUgPSBpZGxlVGltZVswXS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICB9XG4gICAgICApO1xuICB9XG5cbiAgc3RyaW5naWZ5Qm9keUpzb24oZGF0YSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGFbJ19ib2R5J10pO1xuICB9XG5cbiAgVVRDVG9UaW1lWm9uZShyZWNvcmREYXRldGltZSkge1xuICAgIHZhciByZWNvcmRUaW1lO1xuICAgIHZhciByZWNvcmRkVGltZSA9IG1vbWVudHRpbWV6b25lLnV0YyhyZWNvcmREYXRldGltZSk7XG4gICAgLy8gdmFyIHJlY29yZGRUaW1lID0gbW9tZW50dGltZXpvbmUudHoocmVjb3JkRGF0ZXRpbWUsIFwiQW1lcmljYS9DaGljYWdvXCIpO1xuXG4gICAgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ0NTVCcpIHtcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignQW1lcmljYS9DaGljYWdvJykuZm9ybWF0KCdNTS1ERC1ZWVlZIEhIOm1tOnNzJylcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9nZ2VkSW5Vc2VyVGltZVpvbmUgPT0gJ0VTVCcpIHtcbiAgICAgIHJlY29yZFRpbWUgPSByZWNvcmRkVGltZS50eignQW1lcmljYS9OZXdfWW9yaycpLmZvcm1hdCgnTU0tREQtWVlZWSBISDptbTpzcycpXG4gICAgfSBlbHNlIGlmICh0aGlzLmxvZ2dlZEluVXNlclRpbWVab25lID09ICdQU1QnKSB7XG4gICAgICByZWNvcmRUaW1lID0gcmVjb3JkZFRpbWUudHooJ0FtZXJpY2EvTG9zX0FuZ2VsZXMnKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxuICAgIH0gZWxzZSBpZiAodGhpcy5sb2dnZWRJblVzZXJUaW1lWm9uZSA9PSAnQWxhc2thJykge1xuICAgICAgcmVjb3JkVGltZSA9IHJlY29yZGRUaW1lLnR6KCdVUy9BbGFza2EnKS5mb3JtYXQoJ01NLURELVlZWVkgSEg6bW06c3MnKVxuICAgIH1cblxuICAgIHJldHVybiByZWNvcmRUaW1lO1xuICB9XG5cbiAgYWRkVGlja2V0RGF0YShtYXAsIGRpck1hbmFnZXIpe1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLlVwZGF0ZVRpY2tldEpTT05EYXRhTGlzdCgpO1xuICAgIHZhciBpbml0SW5kZXg6IG51bWJlciA9MTtcbiAgICB0aGlzLnRpY2tldERhdGEuZm9yRWFjaChkYXRhID0+IHtcbiAgICAgIHZhciB0aWNrZXRJbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDZ0FBQUF0Q0FZQUFBRGNNeW5lQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFPeEFBQURzUUJsU3NPR3dBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBTk9TVVJCVkZpRnpabFBTQlJSR01CLzM5dE1DQ04zTnkzSUxsR0MvVGxZVU9DZlRZSXdJU2p3Vm5UcFZIVEpnMUVnQ2RWRnExc1JIU0xvbkllNldGR2txN3NWRkVoaG11V3RQNFRNaWlpRnVqT3ZRNk03NnF3Njdyamo3emJ2ZmZOOVB4NnpPKzk5STZ3QTNVQ2hNVTZ0Q0xWYXFCU0xYUWhiZ0NJN1pBTE5ieEdHTlBScGlFZUw2SlZPSnIzV0VpL0JvekVxTFlzTENJMUFzY2RhbzBDSE1ya2JUdExucTJDcWpyM2E1QlpRNzFFcVc5Vk9USnFqQ2ZxWERsMEV2WWYxcVFnM2dDWmduUzl5R2RKYXVCMDF1Q3I5VEhrV05Pb29FNU1uR3ZiN0xEYmY0TDJlNXVUbU4veHduM2FUcTJZUElaNmoyYmFxY2htK0EvWFJIajdQbjFnZ09GSkR1Uks2Z2EzNU1IUHd5d3dSSyszaW0zTndqdUJJTlJ1VjRoMVFrVmUxREVOU3lNSElTOFptQnBSelZpa2VFcHdjUUxtZTVMNXpZSFlGalZvYWdjZDVWM0xCRWs2VXhIa0t0cUErUUVGcUE0UEFqa0ROYkFTK2hVTlVTQmRwQldCczREUnJSQTVBdzA0anpTbXduMEdCODhFcUxVU0Vjd0JpLzYxOENWcklqWkRKVGlYaTAvdDFGYkFVOVVxZ0ttaVJiRmhRcllEZFFZdGtSYWhRUUZuUUhvdFFwc2pzZ3RjY0Fwc1VlTitHNTVHL0N2Z1p0TVVpL0ZRQ3Y0SzJXSVFmeW9LQm9DMnlJVENvZ0JkQmkyUkY4MXpzVGFvQkZBVHRNNDhwTTBSVWxTUVladzJ1b3NDejBpNG1GSUFTMm9NV2NxRWQ3TzFXT0U0Y1NBYXE0MFRURStraEFjNHppZEFNbUVFNU9URFJYSnE1bUJXTXhrbHF6YzFnbkRJSXRFVVR2SFZjWjlBTkZJNU9rRnoxYmtJV0JENkVVMVE1V3lGempwM1N5V1FCSElPRkovdzhNSlFPY1h4K244YTk5VkZIR1NiZDVPa2dwV0ZZVzhSS0VndjNCY3J0aG1nWDN3dENIRUxvWEgwOVhwbFRWTHZKd1ZMdE4xQkdMWmNGV29IMVBvdE5pZEFhanRNbW9MTUZMYXVCYWNUWURyU2dPVXZ1ZlVJTG9TT1U1a3B4a3VHbGdqMjFnRWRxS0Zkd3htNEJlKzNoREtEcE1CV1BTdU44WGU1Tm5nU2RwR0xzMDVwdUlMeEU2S2dJaHlOeFBxMmtqdXVQWkRuWUJhOHZJL1RhU3VVZ0IwR0F5Qi91QUVQWjVqVU1SNHE0bDB1Tm5BVGxBOVBXLzNlNGUzSk4wMHEramN5cGtjdk5NeGcxdkVBNE9pZXg1bldrbHlPNTVzNXBCV2ZSTkFGcHg0aUpjTkdQMUw0STJoOWtIczRPQ0E4aVBYejBJN2MvS3doTW03UUFZOEM0cVdqMUsrOC9ka2psZmZlMDE2OEFBQUFBU1VWT1JLNUNZSUk9XCJcbiAgICAgIGlmKGRhdGEudGlja2V0U2V2ZXJpdHkgPT09IFwiVW5rbm93blwiIHx8IGRhdGEudGlja2V0U2V2ZXJpdHkgPT09IFwiV2FybmluZ1wiIHx8IGRhdGEudGlja2V0U2V2ZXJpdHkgPT09IFwiTWlub3JcIilcbiAgICAgIHtcbiAgICAgICAgdGlja2V0SW1hZ2UgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ3dBQUFBekNBWUFBQURzQk9wUEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBT3hBQUFEc1FCbFNzT0d3QUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQVB5U1VSQlZHaUI3WmhQaUJ0MUZNZS83eVhUMWQzRlFoR0tlS25vS3Rqc1dtbHZ4UmFoOXFMVlM2ZEpab091QncrV1FpLzF0SWNXdk9pV3NsUzl1QWVKYXlhL2JJTUhLWXFvaHhRVVFZaGFOcFd5V0ZCV29pMzBvQ2gxTjVQZjg3RGJrSjFNSnBPZFpCS3duMXZlNy8xKzc1Tmg1dmVQc0ExTTA5eGhHTVpCQUljQVBBM2dDUUM3QVl4dnB2eE5SSCtJeUFxQUg1ajV5dWpvNkRjTEN3dTE3ZFJyaHJwSlRxZlRlNG5vRklBVEFIWjFXZXMyZ0V0RTlKNXQyejkxMmJkQklPRmtNdmw0TEJhYkEvQmkwRDQrQ0lCUG1QbU5YQzczYzdlZGZZdWJwaG1MeCtPelJEUUxZTWQyRGR1d0ppSnZPbzd6VnJGWXJBZnQxRlk0blU0L1NFUWZZK005N1JzaVVqSU00L2ppNHVMdElQbWV3cWxVYWc4emZ3RmdvcWQyN1ZrQmNEU2Z6Ly9hS2JGRk9KMU83eWFpSzlqNDhxUGtCak0vazh2bGZ2ZEw0dVlmTXpNejl4SFJwNGhlRmdBZTFWcC9acHJtL1g1Slc0VFgxOWZuQWV6dnE1WS8rd3pEbVBOTGFMd1NsbVVkQWxCQytHa3JMRnBFRGl1bHZ2WnF2UHVFQ2NCRkRGNFdBSmlJNXRIR2hRRWdrOGtjQTdBdlNxc09ISmllbm43ZXE0RUJRR3Q5TWxxZnpvakk2MTV4eW1ReUQybXRWd0hFSW5icVJGMUVIbFpLM1d3T3NvZ2N4ZkRKQWh0T3o3bURyTFh1NjlJYkJpSTY3STR4TSs4ZGhFd1FpT2hKZDR4RlpNOEFYQUloSW8rNFl3eGc1d0JjZ3RMaXhsNVpRMFNMSHdPNDZaRTRMRlRkQWZZS0RoR2V3aDAzelFPa3hZMDNOK3REaVlpVTNER3UxK3VmRDhBbEVDTHlsVHZHaFVMaEZ3RFhvOWZweUxWTnR5MHdBSWpJdTVIcmRPWWRyeUFEd01qSXlBY1lydW50VnExVys4aXJnUUVnbTgzK0MyQStVaVYvemhlTHhUdGVEWTJWcEZxdFhnRHdYV1JLN2ZsK2ZIejhZcnZHaG5DcFZISkU1QlVBbnY4c0l0WkU1R1cvVzg0dGE3VlM2anFBMXdEb2ZwdDVvRVhrVmFYVU5iK2tscFBHOHZMeWNpS1JXQ1dpWHR4VUJrVkU1S1JTS3RzcDBmTm9WS2xVZnB5Y25Md0ZJSXJqMDdxSW5GSkt2UjhrMmZjSnBsS3BBOHg4Q1VETFJycEgvQ1lpSjVSUzN3YnQ0UHYwS3BWS05aRkkyRVQwQUlDbk91VjNRUTNBUWp3ZVQ5cTJ2ZEpOeDhEdmFDYVRlVXhyZlE3QWNRQWozZmsxV0NPaW91TTQ1NWFXbG01c1o0Q3VQeXJUTkhjYWh2RUNnQ1NBWXdHN1hRYXdSRVNYYmR2K3E5dWF6WVNhQlN6TCtoTEFFYjhjRVNrcHBaNE5VNmVaVUdjNlpqNEQvemxiRTlHWk1EVmFhb2Jwbk12bHJnSlk5RW41TUovUGw4UFVjQlA2MUt5MW5nWHdqMGZUSGEzMTJiRGp1d2t0WENnVXFrUjB3YU5wcmxBb3JJWWQzMDFQN2lYR3hzYmVCdEFzVjQzRll1ZDdNYmFibml3RTVYSzVOalUxOVNlQWx3QkFSRTdidHQyWHJXclBibjRtSmlheUFNb2ljdFZ4SEw4UGNYaXdMT3VJWlZtKzgvSTk3dkYvNXovZDBqb0VQemhaR2dBQUFBQkpSVTVFcmtKZ2dnPT1cIlxuICAgICAgfWVsc2UgaWYoZGF0YS50aWNrZXRTZXZlcml0eSA9PT0gXCJNYWpvclwiKXtcbiAgICAgICAgdGlja2V0SW1hZ2UgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ3dBQUFBekNBWUFBQURzQk9wUEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBT3hBQUFEc1FCbFNzT0d3QUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQU95U1VSQlZHaUI3WmhOYUJ4bEdJQ2ZkMlpOYWxzb2lGQlVoTGJaVGZwek1OTGdRVEZGcUwxb1BaVjRVWnZkcEpUV0h1c3BnZ0V2bWxKQ1ZkQ2c1c2NpWXNTRDlDTHFJWUdLSUxiYVEycTczYTJHbHRnS0JSVk5tdXpPdkI0UzA4M3N6T3pNenU3c2duMXU4Mzd2OTMwUEg3dmZ6eXRVdytSTUN3dXRUMkJyTi9BbzBBRnNCamF1WlB5TmNnTWhDL3dJVExQMDU3Y2M3aXBVTlY4SkVpcDcvTW91Vkk2QjlnRDNoWnpyRnNJa051K1FTVjBNMlhlVllNSVQrWFpzZXdoNExuQWZieFQ0QWt0ZW9UK1pDOXZaZi9KSk5ablBEYUFNQUMxVkNucXhpTWpyckc5N2d4NnhnbmJ5Rmg2NWZEOHR4dWRBZHkzc2ZKakNLQjdnNEk1YlFaTGRoY2QrM2dLSnI0QlVEY1g4eUdLWisramZObHNwc1Z6NC9hdWJTZGpUb0IxMVVmTW1UNkx3SkMvdS9NMHZhYTN3MkMvcm9IZ1cyRjFQTXg5K1lzTzZ4K2w1ZU1FcndWajdhUTNUT0ZtQVR1WnZEL2tsM0ZuaDhXdzNLbE5FMzdhaVltTWJlK2hyTyt2V3VMekNxb0xLS1JvdkMyQmcyc09vdXJvc0MwL2s5Z09kY1ZyNW9uUXhkdVVadDZhVkZlWm9yRUpCRUk2NGgwOWZmSURpUGRjQU0yYWxTbGdVelljNHRPMW1hZENnMExLUDVwTUZNREd0cDUxQkE5RjZINzNWWTdDblBBUzdHcUFTREdXbk0yUUFXK0kzQ1lwc2RVWU1ZRk1EVEFLaVpXNkdXMW9UVWVabkFEZGRFcHVGT1dmQVFNdURUWU9vaTdCb3hVdHp3MUFwY3pPQTZRYW9CRU9aY29ZTXNMNXNnRW93cFBpTk0yU1EzdkVyY0NsK200ck1yTGl0NGI5dDQrMTRYUUlnOHBaYmVFVTRNVXB6YlcrL3M3NzF0RnZEc25CNjYyMWdPRTRqWDFST2VEMUU3NXdrczlkUEF0L0g1ZVREZVFwL25QSnFkRHp6TDI4SDR6eHdiNzJ0UEZoRTJFMXZhc1lyWWUxWm5lNjRoSEFJc090dDVvS05hdHBQRnR3dVA3MnBqMUh0WjduS0dCZUs2bEV5N1o5VVNuUy9yV1hheDFCZUJpSVhvQU93aE9vUk11MGpRWkw5NnhBZjVyc3c3RW1nN0NKZEU0VHJDRDBjVEgwWHRJdi9mYml2N1FlVzdNZEEzcU8ycTExQWVCY3Bkb2FSaFRDVm5nOXlTVXdkQkE0QXJlSDhWbGxFK0F3WXBEZVZyMmFBOEtXcGtmd21XdTFuVVo0SDlnZnNkUWJoVXhLYzRZWFVYNkhuTENGYUxXMDg5eldxZXl0a1RaRk9QUlZwbmhLaXZla3M2emorZTdhTnlQRkljemlJSnR6WGNRSGtJODkyWVlMZTVMbEljemlJL21xMml3UEFQeTR0QzlqeVd1VHhIVVFYN3RzK2gzTFNwV1dJVFBKYTVQRWQxS1l1VWRqd0psQXFONGM1ZjZJbVl6dW9qZkRoQitlQndkVnYxVmQ1NlJHM24wbGthbGY1bVUyT0ErZUFDMnhNZWY4Um00clI3RjVHczVYMjVidmM1WC9OdjFvWTlxZGJGa2wwQUFBQUFFbEZUa1N1UW1DQ1wiXG4gICAgICB9XG5cbiAgICAgIHZhciBwdXNocGluID0gbmV3IE1pY3Jvc29mdC5NYXBzLlB1c2hwaW4obmV3IE1pY3Jvc29mdC5NYXBzLkxvY2F0aW9uKGRhdGEubGF0aXR1ZGUsIGRhdGEubG9uZ2l0dWRlKSwgeyBpY29uOiB0aWNrZXRJbWFnZSwgdGV4dDogaW5pdEluZGV4LnRvU3RyaW5nKCkgfSk7XG4gICAgICBwdXNocGluLm1ldGFkYXRhID0gZGF0YTtcbiAgICAgIG1hcC5lbnRpdGllcy5wdXNoKHB1c2hwaW4pO1xuICAgICAgdGhpcy5kYXRhTGF5ZXIucHVzaChwdXNocGluKTtcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKHB1c2hwaW4sICdjbGljaycsIHB1c2hwaW5DbGlja2VkKTtcbiAgICAgIG1hcC5zZXRWaWV3KHsgbWFwVHlwZUlkOiBNaWNyb3NvZnQuTWFwcy5NYXBUeXBlSWQucm9hZCwgY2VudGVyOiBuZXcgTWljcm9zb2Z0Lk1hcHMuTG9jYXRpb24oZGF0YS5sYXRpdHVkZSwgZGF0YS5sb25naXR1ZGUpfSk7XG4gICAgICBpbml0SW5kZXggPSBpbml0SW5kZXggKyAxO1xuICAgIH0pO1xuICAgICQoJy5OYXZCYXJfQ29udGFpbmVyLkxpZ2h0JykuYXR0cignc3R5bGUnLCd0b3A6NTgwcHgnKTtcbiAgICBjb25zdCBpbmZvYm94ID0gbmV3IE1pY3Jvc29mdC5NYXBzLkluZm9ib3gobWFwLmdldENlbnRlcigpLCB7XG4gICAgICB2aXNpYmxlOiBmYWxzZSAgXG4gICAgfSk7ICAgIFxuICAgIGZ1bmN0aW9uIHB1c2hwaW5DbGlja2VkKGUpIHtcbiAgICAgIGlmIChlLnRhcmdldC5tZXRhZGF0YSkge1xuICAgICAgICBpbmZvYm94LnNldE1hcChtYXApOyAgXG4gICAgICAgIGluZm9ib3guc2V0T3B0aW9ucyh7XG4gICAgICAgICAgbG9jYXRpb246IGUudGFyZ2V0LmdldExvY2F0aW9uKCksXG4gICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICBvZmZzZXQ6IG5ldyBNaWNyb3NvZnQuTWFwcy5Qb2ludCgwLCAyMCksXG4gICAgICAgICAgaHRtbENvbnRlbnQ6JzxkaXYgY2xhc3MgPSBcImluZnlcIiBzdHlsZT0gXCJiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtib3JkZXI6IDFweCBzb2xpZCBsaWdodGdyYXk7IHdpZHRoOjM2MHB4O1wiPidcbiAgICAgICAgICArIGdldFRpY2tldEluZm9Cb3hIVE1MKGUudGFyZ2V0Lm1ldGFkYXRhKSArICc8L2Rpdj4nXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgJCgnLk5hdkJhcl9Db250YWluZXIuTGlnaHQnKS5hdHRyKCdzdHlsZScsJ3RvcDo1ODBweCcpO1xuICAgICAgcGluQ2xpY2tlZChlLnRhcmdldC5tZXRhZGF0YSlcbiAgICAgIE1pY3Jvc29mdC5NYXBzLkV2ZW50cy5hZGRIYW5kbGVyKGluZm9ib3gsICdjbGljaycsIGNsb3NlKTtcbiAgfVxuICBmdW5jdGlvbiBwaW5DbGlja2VkKHBhcm1zKXtcbiAgICBjb25zb2xlLmxvZygnZW1pdCcsdGhhdCk7XG4gICAgdGhhdC50aWNrZXRDbGljay5lbWl0KHBhcm1zKTtcbiAgfVxuICBmdW5jdGlvbiBjbG9zZShlKSB7XG4gICAgaWYgKGUub3JpZ2luYWxFdmVudC50YXJnZXQuY2xhc3NOYW1lID09PSAnZmEgZmEtdGltZXMnKSB7XG4gICAgICAkKCcuTmF2QmFyX0NvbnRhaW5lci5MaWdodCcpLmF0dHIoJ3N0eWxlJywndG9wOjBweCcpO1xuICAgICAgaW5mb2JveC5zZXRPcHRpb25zKHtcbiAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBcbiAgICAgICAgZnVuY3Rpb24gZ2V0VGlja2V0SW5mb0JveEhUTUwoZGF0YTogYW55KTpTdHJpbmd7XG4gICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgdmFyIGluZm9ib3hEYXRhID0gXCI8ZGl2IGNsYXNzPSdyb3cnIHN0eWxlPSdwYWRkaW5nLXRvcDoxMHB4O3BhZGRpbmctYm90dG9tOjEwcHg7bWFyZ2luOiAwcHg7Jz5cIlxuICAgICAgICArIFwiPC9kaXY+XCJcbiAgICAgICAgcmV0dXJuIGluZm9ib3hEYXRhO1xuICAgICAgICB9XG5cblxufVxuXG4gIFVwZGF0ZVRpY2tldEpTT05EYXRhTGlzdCgpXG4gIHtcbiAgICBpZih0aGlzLnRpY2tldExpc3QubGVuZ3RoICE9MClcbiAgICB7XG4gICAgdGhpcy50aWNrZXRMaXN0LlRpY2tldEluZm9MaXN0LlRpY2tldEluZm8uZm9yRWFjaCh0aWNrZXRJbmZvID0+IHtcbiAgICAgIHZhciB0aWNrZXQ6IFRpY2tldCA9IG5ldyBUaWNrZXQoKTs7XG4gICAgICB0aWNrZXRJbmZvLkZpZWxkVHVwbGVMaXN0LkZpZWxkVHVwbGUuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgaWYoZWxlbWVudC5OYW1lID09PSBcIlRpY2tldE51bWJlclwiKXtcbiAgICAgICAgICAgIHRpY2tldC50aWNrZXROdW1iZXIgPSBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkVudHJ5VHlwZVwiKXtcbiAgICAgICAgICB0aWNrZXQuZW50cnlUeXBlID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQ3JlYXRlRGF0ZVwiKXtcbiAgICAgICAgICB0aWNrZXQuY3JlYXRlRGF0ZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiRXF1aXBtZW50SURcIil7XG4gICAgICAgICAgdGlja2V0LmVxdWlwbWVudElEID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQ29tbW9uSURcIil7XG4gICAgICAgICAgdGlja2V0LmNvbW1vbklEID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQYXJlbnRJRFwiKXtcbiAgICAgICAgICB0aWNrZXQucGFyZW50SUQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkN1c3RBZmZlY3RpbmdcIil7XG4gICAgICAgICAgdGlja2V0LmN1c3RBZmZlY3RpbmcgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlRpY2tldFNldmVyaXR5XCIpe1xuICAgICAgICAgIHRpY2tldC50aWNrZXRTZXZlcml0eSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQXNzaWduZWRUb1wiKXtcbiAgICAgICAgICB0aWNrZXQuYXNzaWduZWRUbyA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiU3VibWl0dGVkQnlcIil7XG4gICAgICAgICAgdGlja2V0LnN1Ym1pdHRlZEJ5ID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJQcm9ibGVtU3ViY2F0ZWdvcnlcIil7XG4gICAgICAgICAgdGlja2V0LnByb2JsZW1TdWJjYXRlZ29yeSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUHJvYmxlbURldGFpbFwiKXtcbiAgICAgICAgICB0aWNrZXQucHJvYmxlbURldGFpbCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUHJvYmxlbUNhdGVnb3J5XCIpe1xuICAgICAgICAgIHRpY2tldC5wcm9ibGVtQ2F0ZWdvcnkgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkxhdGl0dWRlXCIpe1xuICAgICAgICAgIHRpY2tldC5sYXRpdHVkZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiTG9uZ2l0dWRlXCIpe1xuICAgICAgICAgIHRpY2tldC5sb25naXR1ZGUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlBsYW5uZWRSZXN0b3JhbFRpbWVcIil7XG4gICAgICAgICAgdGlja2V0LnBsYW5uZWRSZXN0b3JhbFRpbWUgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkFsdGVybmF0ZVNpdGVJRFwiKXtcbiAgICAgICAgICB0aWNrZXQuYWx0ZXJuYXRlU2l0ZUlEID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJMb2NhdGlvblJhbmtpbmdcIil7XG4gICAgICAgICAgdGlja2V0LmxvY2F0aW9uUmFua2luZyA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiQXNzaWduZWREZXBhcnRtZW50XCIpe1xuICAgICAgICAgIHRpY2tldC5hc3NpZ25lZERlcGFydG1lbnQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIlJlZ2lvblwiKXtcbiAgICAgICAgICB0aWNrZXQucmVnaW9uID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJNYXJrZXRcIil7XG4gICAgICAgICAgdGlja2V0Lm1hcmtldCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiV29ya1JlcXVlc3RJZFwiKXtcbiAgICAgICAgICB0aWNrZXQud29ya1JlcXVlc3RJZCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiU2hpZnRMb2dcIil7XG4gICAgICAgICAgdGlja2V0LnNoaWZ0TG9nID0gZWxlbWVudC5WYWx1ZSA9PT0gbnVsbCA/ICcnIDogIGVsZW1lbnQuVmFsdWU7XG4gICAgICAgIH1lbHNlIGlmKGVsZW1lbnQuTmFtZSA9PT0gXCJBY3Rpb25cIil7XG4gICAgICAgICAgdGlja2V0LmFjdGlvbiA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiRXF1aXBtZW50TmFtZVwiKXtcbiAgICAgICAgICB0aWNrZXQuZXF1aXBtZW50TmFtZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiU2hvcnREZXNjcmlwdGlvblwiKXtcbiAgICAgICAgICB0aWNrZXQuc2hvcnREZXNjcmlwdGlvbiA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiUGFyZW50TmFtZVwiKXtcbiAgICAgICAgICB0aWNrZXQucGFyZW50TmFtZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiVGlja2V0U3RhdHVzXCIpe1xuICAgICAgICAgIHRpY2tldC50aWNrZXRTdGF0dXMgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIkxvY2F0aW9uSURcIil7XG4gICAgICAgICAgdGlja2V0LmxvY2F0aW9uSUQgPSBlbGVtZW50LlZhbHVlID09PSBudWxsID8gJycgOiAgZWxlbWVudC5WYWx1ZTtcbiAgICAgICAgfWVsc2UgaWYoZWxlbWVudC5OYW1lID09PSBcIk9wc0Rpc3RyaWN0XCIpe1xuICAgICAgICAgIHRpY2tldC5vcHNEaXN0cmljdCA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9ZWxzZSBpZihlbGVtZW50Lk5hbWUgPT09IFwiT3BzWm9uZVwiKXtcbiAgICAgICAgICB0aWNrZXQub3BzWm9uZSA9IGVsZW1lbnQuVmFsdWUgPT09IG51bGwgPyAnJyA6ICBlbGVtZW50LlZhbHVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMudGlja2V0RGF0YS5wdXNoKHRpY2tldCk7XG4gICAgfSk7XG4gIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==