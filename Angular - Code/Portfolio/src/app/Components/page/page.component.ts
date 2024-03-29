import { Component, HostListener, OnInit } from '@angular/core';
import { PageDataServiceService } from 'src/app/Services/PageDataService/page-data-service.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactMeService } from 'src/app/Services/ContactMeService/contact-me.service';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  menuItems:any;
  menuOpen:boolean = false;
  pageOuterContainerTransform:any = "translateX(0vw)";
  transitionDelayonMenuClick:any = "0.0s";
  sideMenuOpened:boolean = false;
  showFullPageLoader:boolean = false;
  loaderTransparent:boolean = false;
  swipeCoord?:any;
  swipeTime?:any;

  //Contect Me
  contactMeForm!:FormGroup;


  constructor(private message: NzMessageService, public ContactMe:ContactMeService, public PageDataService:PageDataServiceService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getPageData();
    this.contactMeForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      name: [null, [Validators.required]],
      message: [null, [Validators.required]],
    });
  }

  @HostListener('mousewheel', ['$event']) onMousewheel(event:any) {
    if(!this.sideMenuOpened){
      this.currentWheelPosition += event.deltaY;
      if(this.currentWheelPosition < 0){
        this.currentWheelPosition = 0;
      }
      if(this.currentWheelPosition > (this.totalPages + 1) * this.scrolPerPage){
        this.currentWheelPosition = (this.totalPages + 1) * this.scrolPerPage;
      }
      this.updatePage();
    }
  }

  updatePage(){
    for (let index = 0; index < this.pageDatas.length; index++) {
      const pageData = this.pageDatas[index];
      let maxScroll = (index + 1) * this.scrolPerPage;
      let minScroll = ((index + 1) * this.scrolPerPage) - this.scrolPerPage;
      if(this.currentWheelPosition <= maxScroll && this.currentWheelPosition >= minScroll){
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

  getMenusItems(){
    this.menuItems = [...new Set(this.pageDatas.map((item:any) => item.PageName))];
    this.menuItems.push("Experience");
    this.menuItems.push("Contact Me");
  }

  getPageData(){
    this.showFullPageLoader = true;
    this.PageDataService.GetPageData().subscribe((response:any) => {
      if(response.status == "200"){
        this.pageDatas = response.data;
        this.currentMainImage = this.pageDatas[0].ImageLink;
        this.currentPageName = this.pageDatas[0].PageName;
        this.totalPages = this.pageDatas.length;
        this.currentSelectedPageIndex = 0;
        this.getMenusItems();
        this.showFullPageLoader = false;
      }
      else{
        this.message.error("Error Occured");
      }
    },
    (error) => {
      this.message.error("Error Occured");
    });
  }

  submitContactMeForm(){
    if (this.contactMeForm.valid) {
      this.loaderTransparent = true;
      this.showFullPageLoader = true;
      this.ContactMe.AddContactMe(this.contactMeForm.value.name,this.contactMeForm.value.email,this.contactMeForm.value.message).subscribe((response:any) => {
        if(response.status == "200"){
          this.message.success("Message Sent",{nzDuration: 3000});
          this.contactMeForm.reset();
        }
        else{
          this.message.error("Error Occured",{nzDuration: 3000});
        }
        this.loaderTransparent = false;
        this.showFullPageLoader = false;
      },
      (error) => {
        this.message.error("Error Occured",{nzDuration: 3000});
        this.loaderTransparent = false;
        this.showFullPageLoader = false;
      })
    } else {
      Object.values(this.contactMeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  navigationClicked(menuName:any){
    if(this.sideMenuOpened){
      this.transitionDelayonMenuClick = "0.3s";
    }

    setTimeout(() =>{this.transitionDelayonMenuClick = "0.0s"},300);

    this.backtoMainPage();
    switch(menuName){
      case "Contact Me":
        this.currentWheelPosition = ((this.totalPages + 1) * this.scrolPerPage) - 10;
        this.updatePage();
        break;
      default:
        let index = this.pageDatas.findIndex((x:any) => x.PageName == menuName);
        if(index == -1){
          this.message.error("Error Occured",{nzDuration: 3000});
        }
        else{
          this.currentWheelPosition = ((index + 1) * this.scrolPerPage) - 10;
          this.updatePage();
        }
        break;
    }
  }

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }

  mainPageButtonClicked(){
    this.sideMenuOpened = true;
    this.pageOuterContainerTransform = 'translateX(-100vw)';
  }

  backtoMainPage(){
    this.sideMenuOpened = false;
    this.pageOuterContainerTransform = 'translateX(0vw)';
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;

    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000
        && Math.abs(direction[0]) > 30
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
          const swipe = direction[0] < 0 ? 'next' : 'previous';
          if(swipe == "next"){
            this.HorizontalNextSwipe();
          }

          if(swipe == "previous"){
            this.HorizontalPreviousSwipe();
          }
      }

      if (duration < 1000
        && Math.abs(direction[1]) > 30
        && Math.abs(direction[1]) > Math.abs(direction[0] * 3)) {
          const swipe = direction[1] < 0 ? 'next' : 'previous';
          if(swipe == "next"){
            this.VerticleNextSwipe();
          }

          if(swipe == "previous"){
            this.VerticlePreviousSwipe();
          }
      }
    }
  }

  VerticleNextSwipe(){
    if(!this.sideMenuOpened){
      this.currentWheelPosition += this.scrolPerPage;
      if(this.currentWheelPosition < 0){
        this.currentWheelPosition = 0;
      }
      if(this.currentWheelPosition > (this.totalPages + 1) * this.scrolPerPage){
        this.currentWheelPosition = (this.totalPages + 1) * this.scrolPerPage;
      }
      console.log(this.currentWheelPosition);
      this.updatePage();
    }
  }

  VerticlePreviousSwipe(){
    if(!this.sideMenuOpened){
      this.currentWheelPosition -= this.scrolPerPage;
      if(this.currentWheelPosition < 0){
        this.currentWheelPosition = 0;
      }
      if(this.currentWheelPosition > (this.totalPages + 1) * this.scrolPerPage){
        this.currentWheelPosition = (this.totalPages + 1) * this.scrolPerPage;
      }
      console.log(this.currentWheelPosition);
      this.updatePage();
    }
  }

  HorizontalNextSwipe(){
    if(!this.sideMenuOpened){
      this.mainPageButtonClicked();
    }
  }

  HorizontalPreviousSwipe(){
    if(this.sideMenuOpened){
      this.backtoMainPage();
    }
  }
}
