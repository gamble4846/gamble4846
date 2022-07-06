import { Component, HostListener, OnInit } from '@angular/core';
import { PageDataServiceService } from 'src/app/Services/PageDataService/page-data-service.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  currentWheelPosition:number = 0;
  pageDatas:any;
  currentMainImage:any;
  scrolPerPage:number = 300;

  constructor(public PageDataService:PageDataServiceService) { }

  ngOnInit(): void {
    this.getPageData();
  }

  @HostListener('mousewheel', ['$event']) onMousewheel(event:any) {
    this.currentWheelPosition += event.deltaY;
    if(this.currentWheelPosition < 0){
      this.currentWheelPosition = 0;
    }
    console.log(this.currentWheelPosition);
  }

  updatePage(){
  }

  getPageData(){
    this.PageDataService.GetPageData().subscribe((response:any) => {
      if(response.status == "200"){
        console.log(response);
        this.pageDatas = response.data;
        this.currentMainImage = this.pageDatas[0].ImageLink;
      }
      else{

      }
    },
    (error) => {
      console.log(error);
    });
  }
}
