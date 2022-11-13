import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  links:any = [
    {path:'/main',label:'main',active:'button-active'},
    {path:'/chat',label:'chat',active:'button-active'}
  ]
}
