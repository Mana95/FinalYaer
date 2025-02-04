import {Component, OnInit, Inject, ViewChild, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {LocomotiveService} from "../../../../../../service/locomotive.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import LocoDTO from "../../../../../../dto/LocoDTO";
import swal from "sweetalert";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import UserDTO from "../../../../../../dto/UserDTO";
import {AccessService} from "../../../../../../service/access.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-edit-loco',
  templateUrl: './edit-loco.component.html',
  styleUrls: ['./edit-loco.component.css']
})
export class EditLocoComponent implements OnInit  {



  editLocoGroup: FormGroup;
  myControl = new FormControl();
  userList: UserDTO[] = [];
  options: string[] = ['M2', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
  statuses: string[] = ['In', 'Out'];
  tMotors: string[] = ['Working', 'Not Working'];
  mainMotors: string[] = ['Working', 'Not Working'];
  vBreaks: string[] = ['Working', 'Not Working'];
  dBreaks: string[] = ['Working', 'Not Working'];
  isVisble = true;
  val = '';
  loading =  false;
  filesToUpload: Array<File> = [];
  urls = new Array<string>();
  public selectedIndex: number = 0;
  val2: string[] = [];
  private val1: string[] = [];
  text: string = '';
  newID: any;
  preview: { link: any };
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }
  id: any;
  condition: string[] = ['Working' , 'Not Working'];
  imageSt: any;
  submitted = false;
  disableSelect = new FormControl(true);
  @Output() myEvent =  new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private locomotiveService: LocomotiveService,  private router: Router,  private toastr: ToastrService,
              private formBuilder: FormBuilder, private accessService: AccessService, private cd: ChangeDetectorRef,
              private route: ActivatedRoute,) {
    this.loadAll();
  }
  locoArray: LocoDTO[] = [];
  ngOnInit(): void {

    this.editLocoGroup = this.formBuilder.group({
      locoCatId: ['', [Validators.required]],
      locoNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      locoPower: ['', [Validators.required, Validators.minLength(5),  Validators.pattern('^[0-9]*$')]],
      locoMileage: ['', [Validators.required, Validators.minLength(10),  Validators.pattern('^[0-9]*$')]],
      locoDate: ['', [Validators.required]],
      userNic: ['', [Validators.required]],
      supervisorName: ['', [Validators.required]],
      supervisorEmail: ['', [Validators.required]],
      locoAvailability: ['', [Validators.required]],
      locoMotors: new FormArray ([]),
      locoBreaks: new FormArray([]),
      locoFluids: new FormArray([]),
      locoNote: ['', [Validators.required, Validators.maxLength(1000),  Validators.pattern('^[0-9]*$')]],
      //image: [''],
      mtrType: ['', Validators.required],
      brkType: ['', Validators.required],
      fldType: ['', Validators.required]
    });
    this.loadAll();
  this.loadAllIds();

    this.locomotiveService.getOneLoco(this.data.id).pipe(first())
      .subscribe(
        res => {
          if (res !== undefined){
            console.log(res);
            this.editLocoGroup.controls['locoCatId'].setValue(res[0].locoCatId);
            this.editLocoGroup.controls['locoNumber'].setValue(res[0].locoNumber);
            this.editLocoGroup.controls['locoPower'].setValue(res[0].locoPower);
            this.editLocoGroup.controls['locoMileage'].setValue(res[0].locoMileage);
            this.editLocoGroup.controls['userNic'].setValue(res[0].userNic);
            this.editLocoGroup.controls['locoDate'].setValue(res[0].locoDate);
            this.editLocoGroup.controls['supervisorName'].setValue(res[0].supervisorName);
            this.editLocoGroup.controls['supervisorEmail'].setValue(res[0].supervisorEmail);
            this.editLocoGroup.controls['locoAvailability'].setValue(res[0]. locoAvailability);
            this.editLocoGroup.controls['locoNote'].setValue(res[0].locoNote);
            const _locoMotors  = this.getFm.locoMotors as FormArray
            res[0].locoMotors.forEach((data , index)=>{
              _locoMotors.push(
                this.formBuilder.group(({
                  Name:[data.Name, Validators.required],
                  working:[data.working, Validators.required]

                }))
              );
            });
            const _locoBreaks  = this.getFm.locoBreaks as FormArray
            res[0].locoBreaks.forEach((data , index)=>{
              _locoBreaks.push(
                this.formBuilder.group(({
                  bName:[data.bName, Validators.required],
                  working:[data.working, Validators.required]

                }))
              );
            });
            const _locoFluids  = this.getFm.locoFluids as FormArray
            res[0].locoFluids.forEach((data , index)=>{
              _locoFluids.push(
                this.formBuilder.group(({
                  fName:[data.fName, Validators.required],
                  fluids:[data.fluids, Validators.required]

                }))
              );
            });
            this.imageSt = res[0].image;
            console.log(res[0].image);
            // this.editLocoGroup.controls['preview'].setValue(res[0]. image);

          }


        }
      )
  }

  onEdit(){
    console.log(this.editLocoGroup.value);
   // this.submitted = true;
    //this.submitted = true;

      if (window.confirm('Are you sure?')) {
        let id = this.route.snapshot.paramMap.get('id');
        this.locomotiveService.updateLoco(this.editLocoGroup.value)
          .subscribe(res => {

            //this.router.navigateByUrl('/employees-list');
            console.log('Content updated successfully!');
            console.log(res);
          }, (error) => {
            console.log(error)
          })

    }
  }

  sendNewEmail(from, text){
    this.locomotiveService.sendStatusEmail(
      this.editLocoGroup.controls.locoNumber.value,
      this.editLocoGroup.controls.supervisorEmail.value
    ).subscribe(result =>{
      if (result){
        //this.onSucess('Sent');
        console.log(result);
      }else {
        console.log('failed')
      }

    })
  }
  loadAll(){
    this.locomotiveService.getAllLocomotives().subscribe(resp => {
      this.locoArray = resp;
      console.log(this.locoArray);

    });


  }

  get getFm(){
    return this.editLocoGroup.controls;
  }
  get mtrArray(){
    return this.getFm.locoMotors as FormArray;
  }
  get brkArray(){
    return this.getFm.locoBreaks as FormArray;
  }
  get fluidArray(){
    return this.getFm.locoFluids as FormArray;
  }

  onWarning(message: string){
    this.toastr.warning(message, 'Warning');
  }
  onSucess(message: string){
    this.toastr.success(message, 'Success');
  }
  uploadFile(event) {

    const fileEvnet = event.target.files[0];



    const uploadData = new FormData();

    // uploadData.append('file', fileItem);

    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // this.LocoGroup.patchValue({
      //   image: reader.result
      // });
      reader.onload = () => {
        //this.imageUrl = reader.result;
        //     this.showAlert = false;
        console.log(reader.result)
        this.editLocoGroup.patchValue({
          image: reader.result
        });
        // this.editFile = false;
        // this.removeUpload = true;
      }
      // this.LocoGroup.controls['image'].setValue(file);
      // When file uploads set it to file formcontrol

      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }


  private loadAllIds() {
    this.loading = true;
    this.accessService.getAllUsers().subscribe(result => {
      this.userList = result;
      this.loading = true;
    });
  }



  onClickMotor() {
    if (this.getFm.mtrType.value !== ''){
      this.mtrArray.push(this.formBuilder.group({
        Name: [this.getFm.mtrType.value],
        working: [true],


      }));
    }

  }
  onClickremoveField(index = null, value) {

    switch(value) {
      case 'main':
        while (this.mtrArray.length !== 0) {
          this.mtrArray.removeAt(0);
        }
        break;
      case 'sub':
        this.mtrArray.removeAt(index);
        break;
    }
  }
  onClickremoveBreakField(index = null, value) {

    switch (value) {
      case 'main':
        while (this.brkArray.length !== 0) {
          this.brkArray.removeAt(0);
        }
        break;
      case 'sub':
        this.brkArray.removeAt(index);
        break;
    }
  }
  onClickremoveFluidField(index = null, value) {

    switch (value) {
      case 'main':
        while (this.fluidArray.length !== 0) {
          this.fluidArray.removeAt(0);
        }
        break;
      case 'sub':
        this.fluidArray.removeAt(index);
        break;
    }
  }

  onClickBreaks() {
    if (this.getFm.brkType.value !== ''){
      this.brkArray.push(this.formBuilder.group({
        bName: [this.getFm.brkType.value],
        working: [true],
        notWorking: [false]


      }))
    }
    this.val = this.getFm.brkType.value;

  }
  onClickFluids(){
    if (this.getFm.fldType.value !== ''){
      this.fluidArray.push(this.formBuilder.group({
        fName: [this.getFm.fldType.value],
        fluids: [''],
      }))
    }
    this.val2 = this.getFm.fldType.value;
  }

  onKeyUp(value: string){}
  changeFiles(event) {
    this.isVisble = !this.isVisble;
    this.filesToUpload = event.target.files as Array<File>;
    this.urls = [];
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
            if (Number(e.total) > 2e+6) {
              alert('Please make sure that you entered image size is less than 2MB');
              this.filesToUpload = [];
              return;
            } else {
              this.urls.push(e.target.result);
            }
          } else {
            alert('Supported formats: .JPEG .JPG .PNG');
            this.filesToUpload = [];
            return;
          }


        };
        reader.readAsDataURL(file);
      }
    }
    console.log(this.filesToUpload);
  }
}
