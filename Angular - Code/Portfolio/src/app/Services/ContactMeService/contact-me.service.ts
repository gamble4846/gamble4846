import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactMeService {

  apiLink:string = "https://script.google.com/macros/s/AKfycbwn9_ei9uvS2Ui8sWm15vjrEm0ZUIpYB7wf0Jce-vSo21Nw5LVI_DDRmchtE4ffCfIeMw/exec";

  constructor(private http: HttpClient) { }

  getOptions(){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return options;
  }

  AddContactMe(Name:any, Email:any, Message:any){
    var body ={
      "method": "ADDCONTACTMEDATA",
      "DateTime": new Date(),
      "Name": Name,
      "Email": Email,
      "Message": Message
  };
    return this.http.post(this.apiLink, body, this.getOptions());
  }
}
