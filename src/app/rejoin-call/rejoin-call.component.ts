import { Component, OnInit } from '@angular/core';
import { CallsService } from '../controller/calls.service';

@Component({
  selector: 'app-rejoin-call',
  templateUrl: './rejoin-call.component.html',
  styleUrls: ['./rejoin-call.component.scss']
})
export class RejoinCallComponent implements OnInit {

  constructor(public call: CallsService) { }

  ngOnInit(): void {
  }

  rejoin(): void {
    localStorage.setItem('rejoin', 'true');
    window.location.reload();
  }

  endCall(): void {
    this.call.session.disconnect();
    window.close();
  }

}
