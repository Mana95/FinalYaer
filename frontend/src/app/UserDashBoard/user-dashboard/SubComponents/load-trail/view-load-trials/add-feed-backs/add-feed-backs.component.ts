import { first } from 'rxjs/operators';


import { LoadTrialService } from 'src/app/service/load-trial.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import swal from "sweetalert";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-feed-backs',
  templateUrl: './add-feed-backs.component.html',
  styleUrls: ['./add-feed-backs.component.css']
})
export class AddFeedBacksComponent implements OnInit {
  feedBackGroup: FormGroup;
  id: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute,
  private formBuilder: FormBuilder, private loadTrialService: LoadTrialService) { }

  ngOnInit(): void {
    this.feedBackGroup = this.formBuilder.group({
      loadNo: ['', [Validators.required]],
      feedId: ['', [Validators.required]],
      locoNumber: ['', [Validators.required]],
      comments: ['', [Validators.required]],
      action: ['', [Validators.required]],
      status: [1],
      reason:['Resolved Issues on'],
      commentId:['', [Validators.required]]
      
    })
    this.loadTrialService.getOneComment(this.data.id).pipe(first())
    .subscribe(
      resp=>{
        if(resp!== undefined){
          console.log(resp)
          this.feedBackGroup.controls['loadNo'].setValue(resp[0].loadNo);
          this.feedBackGroup.controls['locoNumber'].setValue(resp[0].locoNumber);
          this.feedBackGroup.controls['comments'].setValue(resp[0].comments);
          this.feedBackGroup.controls['commentId'].setValue(resp[0].commentId);
          this.id = resp[0].commentId.value;
          console.log(this.id)
        }
      }
    )
//console.log(this.loadNo)
    
  }

  
  onSubmit(){
    console.log(this.feedBackGroup.value)
    {
      this.loadTrialService.addFeedBack(this.feedBackGroup.value).pipe(first()).subscribe(
      res => {
        console.log(res);
        if (res.isSaved) {
         this.changeStatusComment(this.feedBackGroup.value);
         console.log('gfg')
          swal({
            title: 'Record Saved!',
            text: 'Please Click OK',
            icon: 'success',
          });
          setTimeout(() => {
           // this.refresh();
          }, 3000);
  
        } else {
          swal({
            title: 'Record already Exits',
            text: 'Please Click OK',
            icon: 'error',
          });
          setTimeout(() => {
            //this.refresh();
          }, 3000);
        }
      },
  
      error => {
        console.log(error);
      },
      () => {
        console.log('dss');
      }
    )
    }
  }

  changeStatusComment(obj){
    this.loadTrialService.changeStatusComment(obj).pipe(first())
    .subscribe((
        res=>{
          console.log(res);
        }
    ))
  }

}
