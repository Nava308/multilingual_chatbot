import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  links:any = [
    {path:'/main',label:'Chat with bot',active:'button-active'},
    {path:'/chat',label:'Chat with live agent',active:'button-active'}
  ]
}
