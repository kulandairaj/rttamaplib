import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
export declare class RttamaplibService {
    private http;
    mapReady: boolean;
    showNav: boolean;
    host: string;
    socket: any;
    socketURL: string;
    constructor(http: Http);
    checkUserHasPermission(userName: any): Promise<any>;
    getMapPushPinData(attUID: any): Promise<any>;
    findTruckNearBy(lat: any, long: any, distance: any, supervisorId: any): Promise<any>;
    getWebPhoneUserData(attUID: any): Promise<any>;
    getWebPhoneUserInfo(attUID: any): Promise<any>;
    GetNextRouteData(fromAttitude: any, toAttitude: any): Promise<any>;
    GetRouteMapData(dirDetails: any[]): any[];
    sendEmail(fromEmail: any, toEmail: any, fromName: any, toName: any, subject: any, body: any): Promise<any>;
    sendSMS(toNumber: any, bodyMessage: any): Promise<any>;
    getTruckFeed(techIds: any, mgrId: any): Observable<{}>;
    getRules(dispatchType: any): Observable<Response>;
    storeDataInSessionStorage(key: any, objectToStore: any): void;
    storeDataInLocalStorage(key: any, objectToStore: any): void;
    retrieveDataFromLocalStorage(key: any, objectToStore: any): string;
    retrieveDataFromSessionStorage(key: any): string;
}
