import { Component, OnInit } from '@angular/core';
import {Message,ChatService} from '../chat.service'
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: Message[] = [];
  value: string = "";
  value1: string = "";

  constructor(public chatService: ChatService) { }

  ngOnInit() {
      this.chatService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val);
    });
  }

  sendMessage() {
    if(this.value != null){
      this.chatService.getBotAnswer(this.value);
      this.value = '';
    }
    else if(this.value1 != null) {
      this.chatService.getBotAnswer(this.value1);
      this.value = '';
    }
    
  }

}