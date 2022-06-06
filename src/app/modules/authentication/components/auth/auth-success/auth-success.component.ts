import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-auth-success',
  templateUrl: './auth-success.component.html',
  styleUrls: ['./auth-success.component.scss']
})
export class AuthSuccessComponent implements OnInit {

  @Input() successMessage: string;
  @Input() showButton: boolean;
  @Output() successResponce: EventEmitter<any> = new EventEmitter(); 

  constructor(private titleService: Title) { this.titleService.setTitle('Collabtic - Success'); }

  ngOnInit(): void {
    console.log(this.successMessage);
    console.log(this.showButton);
    this.showButton = (this.showButton) ? true : false;
    console.log(this.showButton);
  }

  clickOK(){
    this.successResponce.emit(true); 
  }

}