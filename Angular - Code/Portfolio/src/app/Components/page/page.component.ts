import { Component, HostListener, OnInit } from '@angular/core';
import { PageDataServiceService } from 'src/app/Services/PageDataService/page-data-service.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  currentWheelPosition:number = 0;
  pageDatas:any;
  currentMainImage:any;
  scrolPerPage:number = 500;
  currentPageName:any;
  totalPages:number = 0;
  currentSelectedPageIndex:number = 0;
  pageDatasTransform:any = "translateY(0vh)";

  //Contect Me
  contactMeForm!:FormGroup;


  constructor(public PageDataService:PageDataServiceService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getPageData();
    this.contactMeForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      name: [null, [Validators.required]],
      message: [null, [Validators.required]],
    });
  }

  @HostListener('mousewheel', ['$event']) onMousewheel(event:any) {
    this.currentWheelPosition += event.deltaY;
    if(this.currentWheelPosition < 0){
      this.currentWheelPosition = 0;
    }
    if(this.currentWheelPosition > (this.totalPages + 1) * this.scrolPerPage){
      this.currentWheelPosition = (this.totalPages + 1) * this.scrolPerPage;
    }
    this.updatePage();
  }

  updatePage(){
    for (let index = 0; index < this.pageDatas.length; index++) {
      const pageData = this.pageDatas[index];
      let maxScroll = (index + 1) * this.scrolPerPage;
      let minScroll = ((index + 1) * this.scrolPerPage) - this.scrolPerPage;
      if(this.currentWheelPosition < maxScroll && this.currentWheelPosition > minScroll){
        this.currentMainImage = this.pageDatas[index].ImageLink;
        this.currentPageName = this.pageDatas[index].PageName;
        this.totalPages = this.pageDatas.length;
        this.currentSelectedPageIndex = index;
        this.pageDatasTransform = "translateY(-"+(index) * 100+"vh)"
      }
    }

    //contact-me
    if(this.currentWheelPosition < (this.totalPages + 1) * this.scrolPerPage && this.currentWheelPosition > (((this.totalPages + 1)) * this.scrolPerPage) - this.scrolPerPage){
      this.pageDatasTransform = "translateY(-"+(this.totalPages) * 100+"vh)";
      this.currentSelectedPageIndex = (this.totalPages + 1);
      this.currentPageName = "Contact Me";
    }
  }

  getPageData(){
    this.PageDataService.GetPageData().subscribe((response:any) => {
      if(response.status == "200"){
        console.log(response);
        this.pageDatas = response.data;
        this.currentMainImage = this.pageDatas[0].ImageLink;
        this.currentPageName = this.pageDatas[0].PageName;
        this.totalPages = this.pageDatas.length;
        this.currentSelectedPageIndex = 0;
      }
      else{

      }
    },
    (error) => {
      console.log(error);
    });
  }

  submitContactMeForm(){
    if (this.contactMeForm.valid) {
      console.log('submit', this.contactMeForm.value);
    } else {
      Object.values(this.contactMeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
