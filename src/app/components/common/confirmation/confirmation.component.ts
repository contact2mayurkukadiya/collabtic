import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  
  @Input() access;
  @Input() title: string = "";
  @Output() confirmAction: EventEmitter<any> = new EventEmitter();
  public bodyElem;

  public bodyTxt: string = "";
  public notifyFlag: boolean = true;

  constructor(
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName('body')[0];
    switch(this.access) {
      case 'Remove Vehicles':
        this.bodyTxt = "If you select <span>All Product Types</span>, all selected vehicle details will be removed";
        break;
      case 'Remove Probing Question':
        this.bodyTxt = "Would you like to delete the delete the probing question?";
        break;  
      case 'Remove Voice':
        this.bodyTxt = "Would you like to delete the voice of customer?";
        break;
      case 'Publish':
        this.bodyTxt = "Would you like to publish?";      
        break;
      case 'Save':
        this.bodyTxt = "Would you like to save?";  
        break;
      case 'Cancel':
        this.bodyTxt = "Would you like to Discard changes?";  
        break;
      case 'Parts Cancel':
        this.bodyTxt = "Discard Part changes?";  
        break;
      case 'Cancel Upload':
        this.bodyTxt = "Would you like to cancel upload?";  
        break;
      case 'Remove SIB Action':
        this.bodyTxt = "Would you like to remove SIB action?";  
        break;
      case 'Remove Frame':
        this.bodyTxt = "Would you like to remove frame number?";  
        break;
      case 'Remove User':
        this.bodyTxt = "Would you like to remove user?";  
        break;  
      case 'Delete':     
        this.bodyTxt = "Would you like to delete?";  
        break; 
        case 'DeleteWs':     
        this.bodyTxt = "Are you sure you???d like to delete this worksteam?";  
        break;  
      case 'Workstream Save':
        this.bodyTxt = "Notify users of workstream name change?";  
        break;
      case 'userdashboard discard':
        this.bodyTxt = "Discard Changes?";  
        break;
        case 'userDelete':
        this.bodyTxt = "Are you sure you???d like to delete this user?";  
        break;
      case 'ThreadClose':
        this.bodyTxt = `Close this ${this.title}?`;  
        break;
      case 'escalationAction':
        let titleCaps = this.title.toUpperCase();
        let titleLow = this.title.toLowerCase();
        this.bodyTxt = `CLOSE ${titleCaps} button is disabled because ${titleLow} <br/> escalation is not complete.`;  
        break;
      case 'ThreadDelete':
        this.bodyTxt = `Delete  ${this.title}?`;  
        break;
      case 'PostDelete':
        this.bodyTxt = "Delete Post?";  
        break;
      case 'Reset Vin':
        this.bodyTxt = "Invalid VIN";
        break;        
      case 'Error Code Remove Warning':
        this.bodyTxt = "Remove Emission? <br/> The selected error codes will be removed.";
        break;
        case 'Vehicle Remove Warning':
          this.bodyTxt = "Remove Vehicle Details? <br/> The selected error codes will be removed.";
          break;
      case 'ppfrconfirmation':
        this.bodyTxt = "Are you sure you want to remove?";
        break;
      }
  }
  
  // Notify User Change
  notifyUserChange(status) {
    this.notifyFlag = (status == 1) ? true : false;
  }

  // Confirmation Action
  confAction(flag) {
    this.confirmAction.emit(flag)
  }

  // Confirmation Notify Action
  confNotifyAction(flag) {
    let notifyRes = {
      'notify': this.notifyFlag,
      'action': flag
    };
    this.confirmAction.emit(notifyRes);
  }

  ngOnDestroy(){
    this.bodyElem.classList.remove("auth-open-remove-popup");
  }

}