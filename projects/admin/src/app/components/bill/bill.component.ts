import { Component, OnInit } from '@angular/core';
import { CommonsService } from 'projects/commons/src/public-api';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  public message = this.service.sayHello();

  constructor(private service: CommonsService) {}

  ngOnInit() {}
}
