import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class Message {
  constructor(public author: string, public content: string|undefined,public oppositeText:string|undefined) {}
}
export interface iTranslations{
  translatedText:string;
  detectedSourceLanguage:string;
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
  map = new Map<string,string>;
  constructor(private http: HttpClient) { 
    this.map.set("te","Telugu");
    this.map.set("fr","French");
    this.map.set("de","German");
  }
  
  userConversation = new Subject<Message[]>();
  agentConversation = new Subject<Message[]>();
  
  currentLang:string|undefined|null= "";
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
          "source": this.currentLang
      }
    } 
    else {
      req ={
        "q": msg,
        "target": "",
        "alt": "json",
        "source": "en"
    }
    }
console.log(req);
  this.http.post<iTransulateRes>(url,req).subscribe(
    (res)=>{
      if(res?.data==null)
       return;
      if(res.data.translations.at(0)?.detectedSourceLanguage!=null){
        let curLang = res.data.translations.at(0)?.detectedSourceLanguage;
         let desc:boolean= confirm("We have detected your language as "+curLang+". Do you want to continue?");
         if(!desc){
          let lang = prompt("Enter any lang code from the https://cloud.google.com/translate/docs/languages Eg: te for Telugu, fr for French, de for German");
          if(lang!=null)
          {
            this.currentLang = lang;
          }
         }
         else{
          this.currentLang = curLang;
         }

      }
     // if(res?.data!=null){
        const oppsiteText = res?.data?.translations?.at(0)?.translatedText;
         
      if(from === "user"){
        const userMessage = new Message('bot',oppsiteText,msg );
        const userMessage1 = new Message('user', msg,oppsiteText);
        this.userConversation.next([userMessage1]);
        this.agentConversation.next([userMessage]);
      }
      else{
        const userMessage = new Message('bot',oppsiteText,msg );
        const userMessage1 = new Message('user', msg,oppsiteText);
        this.agentConversation.next([userMessage1]);
        this.userConversation.next([userMessage]);
      }
      //}
    }
  );
  }
  getBotAnswer(msg: string) {
    
    this.getTheTextInEng(msg,"user");
  }

  getAgentAnswer(msg: string) { 
    
    this.getTheTextInEng(msg,"agent");
  }

  getBotMessage(question: string){
    let answer:string = this.messageMap[question];
    return answer || this.messageMap['default'];
  }
  getTheSpeechInText(base64data:String){
    const url = "http://localhost:8080/sf/speechToText";
    let req;
    
      req ={
        "config": {
          "languageCode": this.currentLang
      },
      "audio": {
          "content": base64data
      }
      }

  this.http.post<any>(url,req).subscribe(
    (res)=>{
      if(res["results"]!=null
      &&res["results"][0]!=null
      &&res["results"][0]["alternatives"]!=null
      &&res["results"][0]["alternatives"][0]!=null
      &&res["results"][0]["alternatives"][0]["transcript"]!=null
      ){
        const data = res["results"][0]["alternatives"][0]["transcript"];
        if(this.currentLang == "en"){
          const userMessage = new Message('bot',data,data );
          const userMessage1 = new Message('user', data,data);
          this.userConversation.next([userMessage1]);
          this.agentConversation.next([userMessage]);
          return;
        }
        else{
          this.getTheTextInEng(res["results"][0]["alternatives"][0]["transcript"],"user");
        }
      
      }
    }
  );
  }
}