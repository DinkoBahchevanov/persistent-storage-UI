import { Component, OnInit, Optional } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Pair } from './pair';
import { PairService } from './pair.service';
import { NgForm } from '@angular/forms';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public pairs: Pair[];
  public deletePair: Pair;
  private stompClient = null;
  disabled = true;

  setConnected(connected: boolean) {
    this.disabled = !connected;
    if (connected) {

    }
  }

    connect() {
    const socket = new SockJS('http://localhost:8080/chat');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      _this.stompClient.subscribe('/topic/messages', function (pairOutput) {
        console.log("going to receive info from the webSocket");
        console.log(pairOutput.body);
        _this.showMessageOutput(JSON.parse(pairOutput.body));
      });
    });
  }

showMessageOutput(messageOutput) {
  console.log("This is the message to show: " + messageOutput);
  this.getpairs();
}

  constructor(private pairservice: PairService){ this.pairs = [];}

  ngOnInit() {
    this.getpairs();
    this.connect();
  }

  public getpairs(): void {
    this.pairservice.getPairs().subscribe(
      (response: Pair[]) => {
        // this.webSocketApi._connect();
        this.pairs = response;
        console.log(this.pairs);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeletePair(pairId: string): void {
    this.pairservice.deletePair(pairId).subscribe(
      (response: void) => {
        this.sendMessage(this.deletePair);
        console.log(response);
        this.getpairs();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onOpenModal(pair: Pair, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addPairModal');
    }
    if (mode === 'delete') {
      this.deletePair = pair;
      button.setAttribute('data-target', '#deletePairModal');
    }
    container.appendChild(button);
    button.click();
  }

  public searchPairs(id: string): void {
    console.log(id);
    const results: Pair[] = [];
    for (const pair of this.pairs) {
      if (pair.key.toLowerCase().indexOf(id.toLowerCase()) !== -1) {
        results.push(pair);
      }
    }
    this.pairs = results;
    if (results.length === 0 || !id) {
      this.getpairs();
    }
  }

  public onAddPair(addForm: NgForm): void {
    document.getElementById('add-pair-form').click();
    this.pairservice.addPair(addForm.value).subscribe(
      (response: Pair) => {
        this.sendMessage(response);
        // console.log("The response is: " + JSON.stringify(response));
        this.getpairs();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  sendMessage(pair: Pair) {
    this.stompClient.send("/app/chat", {}, 
      JSON.stringify({'key':pair.key, 'value':pair.value}));
}

  // handleMessage(pairs){
  //   this.pairs = pairs;
  // }
}
