import { ViewContainerRef, ElementRef, OnInit, EventEmitter } from '@angular/core';
import { RttamaplibService } from './rttamaplib.service';
import { Popup } from 'ng2-opd-popup';
import { TruckDetails, Ticket } from './models/truckdetails';
export declare class RttamaplibComponent implements OnInit {
    private mapService;
    connection: any;
    map: any;
    contextMenu: any;
    technicianPhone: string;
    technicianEmail: string;
    technicianName: string;
    travalDuration: any;
    truckItems: any[];
    directionsManager: any;
    trafficManager: any;
    truckList: any[];
    truckWatchList: TruckDetails[];
    busy: any;
    mapview: string;
    loading: boolean;
    someInput: ElementRef;
    myMap: Element;
    ready: boolean;
    animatedLayer: any;
    smspopup: Popup;
    emailpopup: Popup;
    infoTemplate: ElementRef;
    socket: any;
    socketURL: string;
    results: any[];
    userRole: any;
    lastZoomLevel: number;
    lastLocation: any;
    reportingTechnicianDetails: any[];
    reportingTechnicians: any[];
    isTrafficEnabled: number;
    loggedUserId: string;
    managerUserId: string;
    cookieATTUID: string;
    feet: number;
    IsAreaManager: boolean;
    IsVP: boolean;
    fieldManagers: any[];
    urlTemplate: string;
    timestamps: string[];
    techType: any;
    thresholdValue: number;
    animationTruckList: any[];
    dropdownSettings: {};
    selectedFieldMgr: any[];
    managerIds: string;
    radiousValue: string;
    foundTruck: boolean;
    loggedInUserTimeZone: string;
    clickedLat: any;
    any: any;
    clickedLong: any;
    dataLayer: any;
    pathLayer: any;
    infoBoxLayer: any;
    infobox: any;
    isMapLoaded: boolean;
    WorkFlowAdmin: boolean;
    SystemAdmin: boolean;
    RuleAdmin: boolean;
    RegularUser: boolean;
    Reporting: boolean;
    NotificationAdmin: boolean;
    ticketList: any;
    loggedInUser: string;
    ticketClick: EventEmitter<any>;
    ticketData: Ticket[];
    constructor(mapService: RttamaplibService, vRef: ViewContainerRef);
    ngOnInit(): void;
    checkUserLevel(IsShowTruck: any): void;
    getListofFieldManagers(): void;
    getTechDetailsForManagers(): void;
    loadMapView(type: String): void;
    LoadTrucks(maps: any, lt: any, lg: any, rd: any, isTruckSearch: any): void;
    getTruckUrl(color: any): string;
    convertMilesToFeet(miles: any): number;
    pushNewTruck(maps: any, truckItem: any): void;
    loadDirections(that: any, startLoc: any, endLoc: any, index: any, truckUrl: any, truckIdRanId: any): void;
    MovePinOnDirection(that: any, routePath: any, pin: any, truckUrl: any, truckIdRanId: any): void;
    CalculateNextCoord(startLocation: any, endLocation: any): any;
    isOdd(num: any): number;
    degToRad(x: any): number;
    radToDeg(x: any): number;
    calculateBearing(origin: any, dest: any): number;
    SendSMS(form: any): void;
    SendEmail(form: any): void;
    SearchTruck(form: any): void;
    getMiles(i: any): number;
    getMeters(i: any): number;
    stringifyJson(data: any): string;
    parseToJson(data: any): any;
    Round(number: any, precision: any): number;
    getAtan2(y: any, x: any): number;
    getIconUrl(color: string, sourceLat: number, sourceLong: number, destinationLat: number, destinationLong: number): string;
    locatepushpin(obj: any): void;
    createRotatedImagePushpin(location: any, url: any, rotationAngle: any, callback: any): void;
    getThresholdValue(): void;
    stringifyBodyJson(data: any): any;
    UTCToTimeZone(recordDatetime: any): any;
    addTicketData(map: any, dirManager: any): void;
    UpdateTicketJSONDataList(): void;
    ngOnDestroy(): void;
}