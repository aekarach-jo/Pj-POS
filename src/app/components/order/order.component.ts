import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CallApiService } from 'src/app/services/call-api.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderByStatus: any
  orderProduct: any
  showSlip : any
  imagePath : string

  constructor(public callApi: CallApiService, public router: Router) { }


  ngOnInit(): void {
    this.getOrderByUseStatus("wait payment")
  }

  getOrderByUseStatus(status: string) {
    this.callApi.getOrderByStatus(status).subscribe(data => {
      this.orderByStatus = data
      // console.log(data);
    })
  }

  clickPayment(orderId: string) {
    localStorage.setItem('orderId', orderId)
    if (localStorage.getItem("orderId") != null) {
      this.callApi.getOrderById(localStorage.getItem("orderId")).subscribe(data => {
        this.orderProduct = data
        // console.log(this.orderProduct);
        this.orderProduct.status = "payment"
        this.orderProduct.creationDatetime = new Date 
        // console.log(this.orderProduct);
        this.callApi.editOrder(this.orderProduct.orderId, this.orderProduct).subscribe(data => {
        })
        // console.log(this.orderProduct);
        window.location.reload();
      })
    }
  }

  clickNopayment(orderId: string) {
    localStorage.setItem('orderId', orderId)
    if (localStorage.getItem("orderId") != null) {
      this.callApi.getOrderById(localStorage.getItem("orderId")).subscribe(data => {
        this.orderProduct = data
        // console.log(this.orderProduct);
        this.orderProduct.status = "No payment"
        // console.log(this.orderProduct);
        this.callApi.editOrder(this.orderProduct.orderId, this.orderProduct).subscribe(data => {
        })
        // console.log(this.orderProduct);
        window.location.reload();
      })
    }
  }

  clickShowSlip(orderId: string) {
    localStorage.setItem('orderId', orderId)
    if (localStorage.getItem("orderId") != null) {
      this.callApi.getOrderById(localStorage.getItem("orderId")).subscribe(data => {
        this.orderProduct = data
        // console.log(this.orderProduct);
        // console.log(this.orderProduct.slip);
        this.imagePath = this.orderProduct.slip
        // console.log(this.imagePath);
      })
    }
  }

  public showImages = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }
}
