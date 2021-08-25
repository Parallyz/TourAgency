import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Hotel, ICostFilter, IFood, IHotelRoom, IHotelServices, Tour, Town } from 'src/app/Models/model';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../tour.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { faChild } from '@fortawesome/free-solid-svg-icons';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { faVolleyballBall } from '@fortawesome/free-solid-svg-icons';
import { faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faHotel } from '@fortawesome/free-solid-svg-icons';
import { faConciergeBell } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { HotelService } from 'src/app/crud-hotel/hotel.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FoodConstants } from 'src/app/allConstans';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-tourpage',
  templateUrl: './tourpage.component.html',
  styleUrls: ['./tourpage.component.css'],
  animations: [
    trigger('animation', [
      state('visible', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => *', [
        style({ transform: 'translateX(50%)', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition('* => void', [
        animate(('250ms ease-in'), style({
          height: 0,
          opacity: 0,
          transform: 'translateX(50%)'
        }))
      ])
    ])
  ]

})
export class TourpageComponent implements OnInit {

  // tour: Tour = new Tour('name',
  // 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',5,220.2,
  // "desc",'short desc',"1",10)
  faChild = faChild;
  faInfo = faInfo;
  faVolleyballBall = faVolleyballBall;
  faUmbrellaBeach = faUmbrellaBeach;
  faInfoCircle = faInfoCircle;
  faHotel = faHotel;
  faConciergeBell = faConciergeBell;
  faComment = faComment;
  rating = 0;
  faDollarSign = faDollarSign;

  tour: Tour

  images: any[] = [];




  public isAuthenticated: Observable<boolean>;
  public userName: Observable<string>;

 

  
  

  displayBasic: boolean;

  hotel: Hotel;
  SportServices: IHotelServices[] = [];
  GeneralServices: IHotelServices[] = [];
  ForKidsServices: IHotelServices[] = [];
  BeachServices: IHotelServices[] = [];

  columns: ICostFilter[] = [];

  hotelRoomsFroomAPI: IHotelRoom[] = [];
  hotelFoodsFroomAPI: IFood[] = [];

  roomlist: any[];
  foodlist: any[];





  constructor(private spinner: NgxSpinnerService,
    private tourService: TourService,
    private messageService: MessageService,
    private activateRoute: ActivatedRoute,
    private hotelService: HotelService,
    private router:Router,
  ) { }

  ngOnInit() {

    //   this.spinner.show();
  //  this.isAuthenticated = this.authorizeService.isAuthenticated();
  //  this.userName = this.authorizeService.getUser().pipe(map(u => u && u.name));
  


  this.spinner.show()

   this.getTourAndHOtel();


    setTimeout(() => {

      this.spinner.hide();
    }, 5000);

  }

  ifTourNotNull(): boolean {
    return this.tour != null;
  }


  InitializeRoomAndFood() {
    this.roomlist = this.hotelService.getHotelRoomConstantsList();
    this.foodlist = this.hotelService.getHotelFoodsConstantsList();

    this.hotelService.getFoods(this.hotel.id).subscribe(food => {
      this.hotelFoodsFroomAPI = food;

    });
    this.hotelService.getHotelRomms(this.hotel.id).subscribe(rooms => {
      this.hotelRoomsFroomAPI = rooms;

    });
  }

  foodSelected(i, event) {

    let item = this.columns.find(x => x.id == i);
    if (event.value != null) {
      let food = this.hotelFoodsFroomAPI.find(x => x.type == event.value);
      item.FoodType = event.value;
      if (food == null) {
        item.FoodCostForOneDay = 0;
      }
      else
        item.FoodCostForOneDay = food.costinDoldars;


    
       
        this.tour.costinDoldars += (item.FoodCostForOneDay * this.tour.duration);
   

    }
    else {
     console.log(item);
      if (event.value != FoodConstants.Food_Without)
        this.tour.costinDoldars -= (item.FoodCostForOneDay * this.tour.duration);

    }
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Price ' + this.tour.costinDoldars.toString() + ' $', life: 3000 });

  }



  roomSelected(i, event) {



    let item = this.columns.find(x => x.id == i);

    if (event.value != null) {
      let room = this.hotelRoomsFroomAPI.find(x => x.type == event.value);

      item.RoomType = event.value;


      item.RoomCostForOneDay = room.costinDoldarsForOneDay;


      this.tour.costinDoldars += (item.RoomCostForOneDay * this.tour.duration);
    }
    else {

      // if( this.tour.costinDoldars-(item.RoomCostForOneDay*this.tour.duration)>=this.FirstPrice)
      this.tour.costinDoldars -= (item.RoomCostForOneDay * this.tour.duration);

    }

    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Price ' + this.tour.costinDoldars.toString() + ' $', life: 3000 });

  }
  addColumn() {
    this.columns.push(new ICostFilter(this.columns.length));

  }

  removeColumn() {
    let item = this.columns[this.columns.length - 1];
    if (item.FoodType == FoodConstants.Food_Without||
      item.FoodType ==null||
      item.FoodType ==""
      ) {
      item.FoodCostForOneDay = 0;
    }
    if (    item.RoomType ==null||
      item.RoomType ==""
      ) {
      item.RoomCostForOneDay = 0;
    }
    this.tour.costinDoldars -= (item.RoomCostForOneDay * this.tour.duration);


    this.tour.costinDoldars -= (item.FoodCostForOneDay * this.tour.duration);
    console.log(item);
    this.columns.splice(-1, 1);

    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Price ' + this.tour.costinDoldars.toString() + ' $', life: 3000 });

  }
  getTourAndHOtel() {
    let id = this.activateRoute.snapshot.paramMap.get('id');


    this.tourService.getTour(id).subscribe(tour => {
      if(tour==null)
        this.router.navigate(['/']);
      this.tour = tour;
      this.getHotel();
      this.getHotelServices();
      this.getGallery();

      setTimeout(() => {

        this.spinner.hide();
      }, 1000);
    },
      (error: HttpErrorResponse) => {
        setTimeout(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });

          this.spinner.hide();
        }, 5000);
      }

    );
  }

  getGallery(){
    this.tourService.getTourGallery(this.tour.id).subscribe(gallery => {
      this.images=gallery;
     console.log(gallery);
      

      setTimeout(() => {

        this.spinner.hide();
      }, 1000);
    },
      (error: HttpErrorResponse) => {
        setTimeout(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });

          this.spinner.hide();
        }, 5000);
      }

    );
  }

  getHotel() {


    this.hotelService.getHotel(this.tour.hotelId).subscribe(hotel => {
      this.hotel = hotel;


      this.InitializeRoomAndFood();
    },
      (error: HttpErrorResponse) => {
        setTimeout(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });

          this.spinner.hide();
        }, 5000);
      }

    );
  }

  getHotelServices() {
    this.hotelService.getSportServices(this.tour.hotelId).subscribe(sport => {

      for (let index = 0; index < sport.length; index++) {
        const element = sport[index];
        this.SportServices.push(element);
      }

    },
      (error: HttpErrorResponse) => {
        setTimeout(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });

          this.spinner.hide();
        }, 5000);
      }

    );
    this.hotelService.getBeachServices(this.tour.hotelId).subscribe(beach => {
      for (let index = 0; index < beach.length; index++) {
        const element = beach[index];
        this.BeachServices.push(element);
      }


    },
      (error: HttpErrorResponse) => {
        setTimeout(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });

          this.spinner.hide();
        }, 5000);
      }

    );
    this.hotelService.getGeneralServices(this.tour.hotelId).subscribe(general => {
      for (let index = 0; index < general.length; index++) {
        const element = general[index];
        this.GeneralServices.push(element);
      }


    },
      (error: HttpErrorResponse) => {
        setTimeout(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });

          this.spinner.hide();
        }, 5000);
      }

    );
    this.hotelService.getForKidsServices(this.tour.hotelId).subscribe(forkids => {

      for (let index = 0; index < forkids.length; index++) {
        const element = forkids[index];
        this.ForKidsServices.push(element);
      }

      setTimeout(() => {

        this.spinner.hide();
      }, 1000);
    },
      (error: HttpErrorResponse) => {
        setTimeout(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });

          this.spinner.hide();
        }, 5000);
      }

    );
  }


  ifFokKidsNotEmpty(): boolean {
    return this.ForKidsServices.length != 0;
  }
  ifGenearalNotEmpty(): boolean {
    return this.GeneralServices.length != 0;
  }
  ifBeachNotEmpty(): boolean {
    return this.BeachServices.length != 0;
  }
  ifSportNotEmpty(): boolean {
    return this.SportServices.length != 0;
  }


  ifDefaultImg(): boolean {
    if (this.hotel != null) {
      return this.hotel.mainImage.indexOf("default.jpg") !== -1;

    }
  }

  ifHotelNoteNull(): boolean {
    return this.hotel != null;
  }

  viewGallery() {

    this.displayBasic = true;
  }
}
