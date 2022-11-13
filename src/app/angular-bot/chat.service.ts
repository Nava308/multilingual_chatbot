import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class Message {
  constructor(public author: string, public content: string|undefined) {}
}
export interface iTranslations{
  translatedText:string;
}
export interface iData{
  translations :Array<iTranslations>;
}
export interface iServerRes{
    responseCode: Number,
    errorMessage: string,
    success: boolean
}
export interface iTransulateRes{
    data: iData,
    serverRes: iServerRes
}

@Injectable()
export class ChatService {
  constructor(private http: HttpClient) { }
  
  userConversation = new Subject<Message[]>();
  agentConversation = new Subject<Message[]>();
  
  messageMap:any = {
    "Hi": "Hello",
    "Who are you": "My name is Angular Bot",
    "What is Angular": "Angular is the best framework ever",
    "default": "I can't understand. Can you please repeat"
  }

  getTheTextInEng(msg:string,from:string){
    const url = "http://localhost:8080/sf/transulate";
    let req;
    if(from === "user"){
      req ={
          "q": msg,
          "target": "en",
          "alt": "json",
          "source": "te"
      }
    } 
    else {
      req ={
        "q": msg,
        "target": "te",
        "alt": "json",
        "source": "en"
    }
    }

  this.http.post<iTransulateRes>(url,req).subscribe(
    (res)=>{
      const userMessage = new Message('bot', res?.data?.translations?.at(0)?.translatedText); 
      if(from === "user"){
        this.agentConversation.next([userMessage]);
      }
      else{
        this.userConversation.next([userMessage]);
      }
    }
  );
  }
  getBotAnswer(msg: string) {
    const userMessage = new Message('user', msg);  
    this.userConversation.next([userMessage]);
    this.getTheTextInEng(msg,"user");
  }

  getAgentAnswer(msg: string) {
    const userMessage = new Message('user', msg);  
    this.agentConversation.next([userMessage]);
    this.getTheTextInEng(msg,"agent");
  }

  getBotMessage(question: string){
    let answer:string = this.messageMap[question];
    return answer || this.messageMap['default'];
  }
}