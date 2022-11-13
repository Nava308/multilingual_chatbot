import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class Message {
  constructor(public author: string, public content: string) {}
}

@Injectable()
export class ChatService {
  constructor(private http: HttpClient) { }
  
  conversation = new Subject<Message[]>();
  
  messageMap:any = {
    "Hi": "Hello",
    "Who are you": "My name is Angular Bot",
    "What is Angular": "Angular is the best framework ever",
    "default": "I can't understand. Can you please repeat"
  }

  getTheTextInEng(msg:string){
    const url = "http://localhost:8080/sf/transulate";
    const req={
      "q": msg,
      "target": "en",
      "alt": "json",
      "source": "te"
  }
  this.http.post(url,req).subscribe(
    (res)=>{
      console.log(res);
    }
  );
  }
  getBotAnswer(msg: string) {
    const userMessage = new Message('user', msg);  
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg));
    
    setTimeout(()=>{
      this.conversation.next([botMessage]);
    }, 1500);
  }

  getBotMessage(question: string){
    let answer:string = this.messageMap[question];
    return answer || this.messageMap['default'];
  }
}