import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageDataServiceService {

  apiLink:string = "https://script.google.com/macros/s/AKfycbwQcRg29pmqBDH4qUYh64DRmUg-KfcIDD3OByQTRB7OG5yfqlGT-9kKN5SJBPuf34gsdw/exec";


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
