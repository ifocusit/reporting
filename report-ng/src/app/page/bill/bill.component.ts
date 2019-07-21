import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  infosClient = ['info client', 'sur plusieurs', 'lignes'];
  month = 'Juillet 2019';
  idFacture = '21911';
  numeroTVA = 'TVA-1234567-IJHG';
  compte = 'CPT 98765432123456';
  iban = 'CHF 1234 56789 1234 56';
  duration = 146.0;
  amount = 26500.0;
  totalHT = 26500.0;
  totalTVA = 1300.0;
  totalTTC = this.totalHT + this.totalTVA;

  constructor() {}

  ngOnInit() {}
}
