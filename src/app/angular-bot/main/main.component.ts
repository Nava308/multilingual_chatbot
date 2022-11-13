import { Component, OnInit } from '@angular/core';
import {Message,ChatService} from '../chat.service'
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  messages: Message[] = [];
  value: string = "";
  constructor(public chatService: ChatService) { }

  ngOnInit() {
      this.chatService.userConversation.subscribe((val) => {
      this.messages = this.messages.concat(val);
    });
  }

  sendMessage() {
    this.chatService.getBotAnswer(this.value);
    this.value = '';
  }

}