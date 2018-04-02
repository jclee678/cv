import {Component} from '@angular/core';
import {DemoService} from './demo.service';
import {Observable} from 'rxjs/Rx';
import { FileUploader } from 'ng2-file-upload';
import { Globals } from './globals';

@Component({
  selector: 'demo-app',
  template:`
  <h1>Cash Visibility Blockchain Interface for 
    <div *ngIf="myId" >
        {{myId.id}}
    </div>
  </h1>
  
  <div class="panel-group">
  
         <br>
         <div class="card">
            <div class="card-header primary-color white-text">
                Documents related with this institution
            </div>
            
            <form (ngSubmit)="doCombine()" #heroForm="ngForm">
                <div class="card-body">

                    <table class="table table-striped">
                      <tr>
                        <th></th>
                        <th>Sender</th>
                        <th>Recipient</th>
                        <th>Type</th>
                        <th>File Id</th>
                        <th>Time</th>
                      </tr>
                      <tr *ngFor="let tx of relatedDocRes">
                        <td><input type="checkbox"  value="{{ tx.fileId }}" [(ngModel)]="tx.selected"  [ngModelOptions]="{standalone: true}" /></td>
                        <td>{{ tx.sender}}</td>
                        <td>{{ tx.receiver}}</td>
                        <td>{{ tx.fileType }}</td>
                        <td><div (click)="decrypt(tx.sender, tx.fileId)">{{ tx.fileId}}</div></td>
                        <td>{{ tx.time*1000 | date : "MMM d, y h:mm:ss a"}}</td>

                      </tr>
                    </table>
                </div> 
                <div>
                    Receiver: <select class="form-control" required
                      [(ngModel)]="selectedReceiver" [ngModelOptions]="{standalone: true}">
                      <option *ngFor="let p of globalVars.receivers" [value]="p">{{p}}</option>
                    </select>
                    <button type="submit" class="btn btn-success">Combine</button>
                </div>
            </form>
            
         </div>
         <br>
  
      <div class="card">
         <div class="card-header success-color white-text">
            Upload File
         </div>
         <div class="card-body">
          <div ng2FileDrop  [uploader]="uploader"></div>
            <input type="file" ng2FileSelect [uploader]="uploader" single /><br>
            <!--
            Transaction Reference Id: <input type="text" [(ngModel)]="refId"><br>
            -->
            Receiver: <select class="form-control" required
              [(ngModel)]="selectedReceiver">
              <option *ngFor="let p of globalVars.receivers" [value]="p">{{p}}</option>
            </select>
            Document Type: <select class="form-control" required
              [(ngModel)]="selectedDocType">
              <option *ngFor="let p of globalVars.docType" [value]="p">{{p}}</option>
            </select>
            
            <button type="button" class="btn btn-primary" (click)="doUpload();">
              Upload
            </button>
          </div>
      </div>
      <br>
     <div class="card">
        <div class="card-header primary-color white-text">
            Transaction Flow
        </div>
        <div class="card-body">
            Manifest Id: <input type="text" [(ngModel)]="iRefId"> <br>
            <button type="button" class="btn btn-primary" (click)="doRetrieveFlow();">
              Search
            </button>

            <table class="table table-striped">
              <tr>
                <th>Type</th>
                <th>Sender</th>
                <th>Recipient</th>
                <th>Type</th>
                <th>File Id</th>
                <th>Time</th>
              </tr>
              <tr *ngFor="let tx of transactionFlow">
                <td>{{ tx.status }}</td>
                <td>{{ tx.sender}}</td>
                <td>{{ tx.receiver}}</td>
                <td>{{ tx.fileType }}</td>
                <td><div (click)="decrypt(tx.sender, tx.fileId)">{{ tx.fileId}}</div></td>
                <td>{{ tx.time*1000 | date : "MMM d, y h:mm:ss a"}}</td>
                
              </tr>
          </table>
        </div>  
     </div>
     <br>
     <div class="card">
        <div class="card-header deep-orange lighten-1 white-text">
            File Content  
            <div *ngIf="fileContentMessage" >  {{ fileContentMessage.errorMessage}} </div>
        </div>
        <div class="panel-body">
          
          <div *ngIf="fileContentMessage" >
            <textarea style="min-width: 100%" [(ngModel)]="fileContentMessage.fileContent"></textarea>
          </div>
          
        </div>
     </div>
  </div>
    
  `
})
export class AppComponent {


  public transactionFlow;
  public relatedDocRes;
  public uploader;
  public refId;
  public receiverId;
  public iRefId;
  public myId;
  public fileContentMessage;
  public globalVars;
  public selectedDocType;
  public selectedReceiver;

  constructor(private _demoService: DemoService, private globals: Globals) {
    this.globalVars = globals;
  }

  ngOnInit() {
   // this.getTransactionFlow('2-10-1');  
    this.getMyId();
    this.getRelatedDoc();
    this.uploader = new FileUploader({url: this.globalVars.urlRoot + `/fileUpload`});
    
  }
  
  getTransactionFlow(txRefId) {
    this._demoService.getTransactionFlow(txRefId).subscribe(
      // the first argument is a function which runs on success
      data => { this.transactionFlow = data},
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading transactionFlow')
    );
  }
  
  getRelatedDoc() {
    this._demoService.getRelatedDoc().subscribe(
      // the first argument is a function which runs on success
      data => { this.relatedDocRes = data},
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading relatedDoc')
    );
  }
  
  decrypt(senderId, fileId) 
  {
    this._demoService.decrypt(senderId, fileId).subscribe(
      // the first argument is a function which runs on success
      data => { this.fileContentMessage = data;
                console.log(this.fileContentMessage.fileContent)
              },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('file decrypted')
    );
  }
  
  
  getMyId() {
    this._demoService.getMyId().subscribe(
      // the first argument is a function which runs on success
      data => { this.myId = data;
                console.log(this.myId)},
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('found my Id')
    );
  }
  
  
  doUpload()
  {
    //console.log("in doUpload");
    this.uploader.onBuildItemForm = (item, form) => {
      //form.append("receiverId", this.receiverId);
      //form.append("refId", this.refId);
      form.append("selectedDocType", this.selectedDocType);
      form.append("selectedReceiver", this.selectedReceiver);
    };
    var item = this.uploader.queue;
    console.log(this.uploader.queue);
   // console.log("refId = " + this.refId + ", receiverId = " + this.selectedReceiver);
    console.log(item[0].upload());
  }
  
  doRetrieveFlow()
  {
    this.getTransactionFlow(this.iRefId);
  }
  
  doCombine()
  {
    var selectedDocs = this.relatedDocRes
              .filter(opt => opt.selected)
              .map(opt => opt.fileId);
    
    console.log("selectedReceiver = " + this.selectedReceiver);
    console.log(selectedDocs[0]);
    console.log(selectedDocs[1]);
    var res = "{ \"docs\":" + selectedDocs + ", \"receiver\":" + this.selectedReceiver + "}";
    
    console.log(res);
              
  }

}
