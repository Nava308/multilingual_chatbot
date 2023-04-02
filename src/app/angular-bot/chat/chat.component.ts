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
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];
  public audioBlob: Blob | null = null;
  public audioBase64: string | null = null;
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
  startRecording() {
    if(this.chatService.currentLang==""){
      alert("Lang not selected,please enter text in lang you want to proceed");
      return;

    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        this.chunks.push(event.data);
      });

      this.mediaRecorder.addEventListener('stop', () => {
        this.audioBlob = new Blob(this.chunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = btoa(reader.result as string);
          this.audioBase64 = base64data;
          this.getTheTextFromSpeech(this.audioBase64);
        };
        reader.readAsBinaryString(this.audioBlob);
        this.chunks = [];
      });

      this.mediaRecorder.start();
    });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  getTheTextFromSpeech(base64data: string){
   this.chatService.getTheSpeechInText(base64data);
  }
}