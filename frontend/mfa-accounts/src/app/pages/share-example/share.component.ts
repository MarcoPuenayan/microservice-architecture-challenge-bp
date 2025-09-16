import { Component, ElementRef, OnInit   ,inject } from "@angular/core";
import { HttpClientModule,HttpClient } from "@angular/common/http";
@Component({
  selector: 'app-list-share',
  standalone: true,
  templateUrl: './share.component.html',
  styles: [],
  imports: [
   HttpClientModule    ]
})
export class ShareComponentsComponent implements OnInit {
  hello="hola"
  htmlContent="";
  user= []
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.getUsers()

  }

  getUsers(){
 //const template = require('./share.component.html');
    this.htmlContent = "";
    this.http.get('https://jsonplaceholder.typicode.com/users').subscribe((data:any)=>{
      this.user = data;
    })
  }

}

