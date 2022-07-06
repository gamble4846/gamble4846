import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageDataServiceService {

  apiLink:string = "https://script.google.com/macros/s/AKfycbxbNPxDrE2igIdznhRBrmOcZNMJk_ttcwh_EOQ4KcH-6yl4_zLHpOAMq6ss1OeiGFONsQ/exec";


  constructor(private http: HttpClient) { }

  getOptions(){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return options;
  }

  GetPageData(){
    var body ={
      "method": "GETPAGEDATA"
    };
    return this.http.post(this.apiLink, body, this.getOptions());
  }
}
