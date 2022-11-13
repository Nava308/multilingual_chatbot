import { Component, OnInit } from '@angular/core';
import {Message,ChatService} from '../chat.service'
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  //currentLang:string = "";
  messages: Message[] = [];
  agentMessages: Message[] = [];
  value: string = "";
  value1: string = "";

  constructor(public chatService: ChatService) { }

  ngOnInit() {
      this.chatService.userConversation.subscribe((val) => {
      this.messages = this.messages.concat(val);
    });
      this.chatService.agentConversation.subscribe((val) => {
      this.agentMessages = this.agentMessages.concat(val);
    });
  }

  sendMessage() {
      this.chatService.getBotAnswer(this.value);
      this.value = '';
    
  }
  sendAgentMessage(){
    this.chatService.getAgentAnswer(this.value1);
    this.value1 = '';
  }

}