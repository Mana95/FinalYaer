import { fadeInAnimation } from 'src/app/_animations';
import { ViewFeedBacksComponent } from './view-feed-backs/view-feed-backs.component';
import { mergeMap } from 'rxjs/operators';
import { LoadTrialService } from './../../../../../../service/load-trial.service';
import { ScheduleService } from 'src/app/service/schedule.service';
import { Component,HostListener,OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddFeedBacksComponent } from '../add-feed-backs/add-feed-backs.component';
import { ViewportScroller } from '@angular/common';



@Component({
  selector: 'app-view-load-prof',
  templateUrl: './view-load-prof.component.html',
  styleUrls: ['./view-load-prof.component.css'],

})
export class ViewLoadProfComponent implements OnInit {
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  panelOpenState5 = false;
  panelOpenState6 = false;
  panelOpenState7 = false;
  panelOpenState8 = false;
  panelOpenState9 = false;

  displayedColumns1: string[] = ['No', 'Description', 'Observation', 'Action'];
  displayedColumns2: string[] = ['No', 'Description', 'Observation', 'Action'];
  displayedColumns3: string[] = ['No', 'Notch', 'Track', 'Main'];
  displayedColumns4: string[] = ['No', 'Status','Date', 'Comments', '#'];
  id:any;
  loadNo: any;
  loadDate: any;
  loadFrom: any;
  loadTo: any;
  scheduleNo: any;
  locoCatId: any;
  locoNumber: any;
  supervisorName: any;
  supervisorNic: any;
  supervisorEmail: any;
  managerName: any;
  managerNic: any;
  managerEmail: any;
  loadNote: any;
  startMileage: any;
  endMileage: any;
  status: any;
  reason: any;
  comments: any;
  dataSource1: any[] = [];
  dataSource2: any[] = [];
  dataSource3: any[]=[];
  dataSource4: any[]=[];
  @ViewChild(MatPaginator) paginator: MatPaginator;



   pageYoffset = 0;

  @HostListener('window:scroll', ['$event']) onScroll(event){
    this.pageYoffset = window.pageYOffset;
  }


  constructor(private scroll: ViewportScroller,  private route: ActivatedRoute, public dialog: MatDialog,private router: Router, private loadService: LoadTrialService, private scheduleService: ScheduleService) { }

  ngOnInit(): void {
    this.id = (this.route.snapshot.paramMap.get('id'));
    console.log(this.id);
    this.loadService.getOneLoad(this.id).pipe(
      map(res=>{
        const _load = res[0];
        this.scheduleNo = res[0].scheduleNo;
          this.loadNo = res[0].loadNo;
          this.loadDate = res[0].loadDate;
          this.loadFrom = res[0].loadFrom;
          this.loadTo = res[0].loadTo;
          this.locoNumber = res[0].locoNumber;
          this.locoCatId = res[0].locoCatId;
          this.status = res[0].status;
          this.managerNic = res[0].managerNic;
          this.managerName = res[0].managerName;
          this.managerEmail = res[0].managerEmail;
          this.supervisorNic= res[0].supervisorNic;
          this.supervisorEmail =  res[0].supervisorEmail;
          this.supervisorName =  res[0].supervisorName;
          this.dataSource1= res[0].items;
          this.dataSource2 = res[0].itemsStop;
          this.dataSource3 = res[0].dynamicBrake;
          this.loadNote= res[0].loadNote;
          this.startMileage = res[0].startMileage;
          this.endMileage = res[0].endMileage;
          this.comments = res[0].comments;
          this.reason = res[0].reason;

        return _load;
      }),
      mergeMap(
        sch=> this.loadService.getRelevantComments(sch.loadNo))

    ).subscribe(
      final=>{
       // console.log('Schedule');
        console.log(final);
        this.dataSource4 = final;
        //this.dataSource9 = final;
        //console.log(this.dataSource9)
      }
    )
  }

 scrollToTopm(){
  this.scroll.scrollToPosition([0,0]);
}


  statusBinder(status){
    if (status === 1){
      return 'hourglass_top';
    }else if (status === 2){
      return 'check_circle_outline';
    }else if (status === 3){
      return 'pending_actions';
    }
  }
  cmtStatusBinder(val){
    if (val === 3){
      return 'pending_actions';
    }else if (val === 2){
      return 'done_all';
    }else if (val === 0){
      return 'build';
    }else if (val === 4){
      return 'thumb_up_off_alt';
    }
  }
  addFeedBack(_id: string) {
    console.log(_id)
    const dialogRef = this.dialog.open(AddFeedBacksComponent,{
      data: {id: _id},
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  viewFeedBack(commentId: string){
    console.log(commentId)
    const dialogRef = this.dialog.open(ViewFeedBacksComponent,{
      data: {commentId: commentId},
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


}
