import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { product } from 'src/app/models/product';
import { listSellItem, sell } from 'src/app/models/sell';
import { CallApiService } from 'src/app/services/call-api.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

import pdfMake from 'pdfmake-thai/build/pdfmake.js'
import pdfFonts from "pdfmake-thai/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { listProduct } from 'src/app/models/stock';

@Component({
  selector: 'app-sell-main',
  templateUrl: './sell-main.component.html',
  styleUrls: ['./sell-main.component.css']
})
export class SellMainComponent implements OnInit {
  @ViewChild('closebuttonAdd') closebuttonAdd: any;
  time: Date
  total: number

  testint: number
  dataForPdf: any;
  formdiscount: any
  formmoney: any;
  formCustomer: any
  formProduct: any
  formDataSell: any
  formShowSellDone: any

  formstock: any;
  submitstock: boolean = false;
  submitlist: boolean = false;
  getdatastock: any;
  getproductbyid: any
  getdatalistProduct: any

  countItemInList: any = 0
  multiListSellItem: listSellItem[] = []
  product: product[] = []
  productData: any
  listSellItem: listSellItem

  formListProduct: any
  dataCustomerById: any
  dataUserById: any
  dataProductAll: any
  dataProductByName: any
  multiListProduct: listProduct[] = []

  totalPrice: number = 0;

  text: number;
  // searchBy = "tel"

  config = {
    itemsPerPage: 5,
    currentPage: 0
  }

  submitRecive: boolean = false
  forMatchCurrency = new Intl.NumberFormat()
  constructor(public callapi: CallApiService, formbuilder: FormBuilder, public router: Router) {
    this.formShowSellDone = formbuilder.group({
      reciveMoney: null,
      totalPrice: null,
      changeMoney: null
    })
    this.formCustomer = formbuilder.group({
      customerId: [null, Validators.required],
      customerTel: [null, Validators.required]
    })
    this.formProduct = formbuilder.group({
      productId: [null],
      productName: [null]
    })
    this.formdiscount = formbuilder.group({
      discount: [null],
      perDiscount: [null]
    })
    this.formmoney = formbuilder.group({
      receiveMoney: [null, Validators.pattern('[0-9]*')]
    })
    this.formDataSell = formbuilder.group({
      sellId: [null],
      shopName: [null],
      customerStoreName: [null],
      taxId: [null],
      netPrice: [null],
      totalPrice: [0],
      discount: [null],
      perDiscount: [null],
      vat: [null],
      receiveMoney: [null],
      changeMoney: [null],
      listSellItem: [{
        productId: [null],
        productName: [null],
        price: [null],
        amount: [null],
        totalPrice: [null]
      }],
      status: [null],
      creationDatetime: [null]
    }),
      this.formstock = formbuilder.group({
        stockId: [null],
        billProduct: [null, [Validators.required]],
        status: [null],
        creationDateTime: [null],
        listProduct: [{
          productId: [null],
          productName: [null],
          price: [null],
          amount: [null]
        }]
      }),
      this.formListProduct = formbuilder.group({
        productId: [null],
        productName: [null],
        price: [null],
        amount: [null],
        totalPrice: null
      })

    setInterval(() => {
      this.time = new Date();
    }, 1000);


  }


  get formStock() { return this.formstock.controls }
  get formControllCuntomer() {
    return this.formCustomer.controls
  }

  get formControllcalculate() {
    return this.formmoney.controls
  }

  addSell() {
    if (this.multiListSellItem.length != 0) {
      this.formDataSell.value.totalPrice = this.totalPrice;
      this.formDataSell.value.customerStoreName = this.dataCustomerById.customerName;
      this.formDataSell.value.sellId = localStorage.getItem('idsell');
      this.formDataSell.value.shopName = localStorage.getItem('shopname');
      this.formDataSell.value.status = 'Open';
      this.formDataSell.value.taxId = localStorage.getItem('txtid');
      this.formDataSell.value.receiveMoney = parseInt(this.formDataSell.value.receiveMoney);
      this.formDataSell.value.listSellItem = this.multiListSellItem;
      this.formDataSell.value.creationDatetime = new Date();
      // console.log(this.formDataSell.value);
      // this.callapi.addSell(this.formDataSell.value).subscribe(formsell => {})
      this.submitRecive = false;
      if (this.formDataSell.value.changeMoney >= 0 && this.formDataSell.value.changeMoney != null) {
        if (localStorage.getItem('idsell') != null || localStorage.getItem('shopname') != null || localStorage.getItem('txtid') != null || localStorage.getItem('vat') != null) {
          this.callapi.addSell(this.formDataSell.value).subscribe(i => {
            this.dataForPdf = i;
            // console.log("เพิ่มสำเร็จ");
            localStorage.removeItem('custommer')
            localStorage.removeItem("countItemInList")
            localStorage.removeItem("multiListSellItem")
            this.formShowSellDone.reciveMoney = this.forMatchCurrency.format(this.formDataSell.value.receiveMoney)
            this.formShowSellDone.totalPrice = this.forMatchCurrency.format(this.formDataSell.value.totalPrice)
            this.formShowSellDone.changeMoney = this.forMatchCurrency.format(this.formDataSell.value.changeMoney)
            Swal.fire({
              showConfirmButton: true,
              confirmButtonText: 'พิมพ์',
              width: 1000,
              html: `<div class="row">
                        <div class="col-5"><h1> เงินที่ได้รับ </h1></div>
                        <div class="col-1"><h1> : </h1></div>
                        <div class="col-6"><h1> ${this.formShowSellDone.reciveMoney} บาท </h1></div>
                      </div>
                      <div class="row">
                        <div class="col-5"><h1> ราคาสินค้ารวม </h1></div>
                        <div class="col-1"><h1> : </h1></div>
                        <div class="col-6"><h1> ${this.formShowSellDone.totalPrice} บาท </h1></div>
                      </div>
                      <div class="row">
                        <div class="col-5"><h1  style="font-weight: bold; font-size: 25px;"> เงินทอน </h1></div>
                        <div class="col-1"><h1> : </h1></div>
                        <div class="col-6"><h1  style="font-weight: bold;font-size: 25px;"> ${this.formShowSellDone.changeMoney} บาท </h1></div>
                      </div>`
              ,
            }).then((result) => {
              if (result.isConfirmed) {
                this.genPDF(this.dataForPdf);
              }
            })
            this.clearListSellItem();
            this.setCustomer();
            // console.log(this.formDataSell.value);

          })
        } else if (localStorage.getItem('idsell') == null) {
          Swal.fire({
            text: 'กรุณาไปหน้าตั้งค่าเพื่อกำหนดรหัสการขาย',
            icon: 'warning',
            showConfirmButton: true
          })
        } else if (localStorage.getItem('shopname') == null) {
          Swal.fire({
            text: 'กรุณาไปหน้าตั้งค่าเพื่อกำหนดชื่อร้าน',
            icon: 'warning',
            showConfirmButton: true
          })
        } else if (localStorage.getItem('txtid') == null) {
          Swal.fire({
            text: 'กรุณาไปหน้าตั้งค่าเพื่อกำหนดรหัสผู้เสียภาษี',
            icon: 'warning',
            showConfirmButton: true
          })
        }
      } else {
        Swal.fire({
          text: 'จำนวนเงินผิดพลาด',
          icon: 'warning',
          timer: 1000,
          showConfirmButton: false
        })
      }
    } else {

      Swal.fire({
        text: 'รายการสินค้าไม่ถูกต้อง',
        timer: 1000,
        icon: 'error',
        showConfirmButton: false
      })
    }
  }

  solveTotalPrice() {
    this.formDataSell.value.perDiscount = parseInt(this.formdiscount.value.perDiscount);
    this.formDataSell.value.discount = parseInt(this.formdiscount.value.discount);
    this.formDataSell.value.receiveMoney = parseInt(this.formmoney.value.receiveMoney);

    if (this.formDataSell.value.discount == null || isNaN(this.formDataSell.value.discount)) {
      this.formDataSell.value.discount = 0;
      this.formDataSell.value.discount = Math.round(this.formDataSell.value.discount)
    }
    if (this.formDataSell.value.perDiscount == null || isNaN(this.formDataSell.value.perDiscount)) {
      this.formDataSell.value.perDiscount = 0;
      this.formDataSell.value.perDiscount = Math.round(this.formDataSell.value.perDiscount)
    }
    this.submitRecive = true;
    this.totalPrice = this.formDataSell.value.totalPrice;
    this.totalPrice = Math.round(this.totalPrice)
    if (this.formDataSell.value.discount > 0 || this.formDataSell.value.perDiscount > 0) {
      this.totalPrice -= this.formDataSell.value.discount;
      this.totalPrice -= this.formDataSell.value.perDiscount * this.totalPrice / 100;
      this.totalPrice = Math.round(this.totalPrice)
    }
    // else if (this.formDataSell.value.perDiscount > 0) {
    //   this.totalPrice -= this.formDataSell.value.perDiscount * this.totalPrice / 100;
    //   this.totalPrice = Math.round(this.totalPrice)
    // }
    if (this.formDataSell.value.receiveMoney > 0) {
      this.formDataSell.value.changeMoney = this.formDataSell.value.receiveMoney - this.totalPrice;
      this.formDataSell.value.changeMoney = Math.round(this.formDataSell.value.changeMoney)
    }
  }

  deleteListSell(index: number) {
    this.countItemInList -= 1;
    this.multiListSellItem.splice(index, 1);
    this.whenKeyNumber();
  }

  whenKeyNumber() {
    this.formDataSell.value.netPrice = 0;
    for (let i = 0; i < this.multiListSellItem.length; i++) {
      if (this.multiListSellItem[i].amount > this.productData ) {
        Swal.fire({
          text: 'จำนวนสินค้าไม่พอ คงเหลือ : ' +this.productData + '  ชิ้น',
          icon: 'error',
          timer: 1700,
          showConfirmButton: false
        })
        this.multiListSellItem[i].amount = 0
      }else{
        this.formDataSell.value.netPrice += this.multiListSellItem[i].amount * this.multiListSellItem[i].price;
      this.multiListSellItem[i].totalPrice = this.multiListSellItem[i].amount * this.multiListSellItem[i].price;
      } 
      
    }
    this.formDataSell.value.totalPrice = this.formDataSell.value.netPrice + (this.formDataSell.value.netPrice * this.formDataSell.value.vat / 100);
    this.totalPrice = this.formDataSell.value.totalPrice;
    this.totalPrice = Math.round(this.totalPrice)
  }

  clearListSellItem() {
    this.multiListSellItem = []
    this.formdiscount.patchValue({
      discount: 0,
      perDiscount: 0,
    })
    this.formmoney.patchValue({
      receiveMoney: null
    })
    this.submitRecive = false
    this.countItemInList = 0
    this.totalPrice = 0;
    this.formmoney.value.receiveMoney = 0;
    this.formDataSell.value.totalPrice = null
    this.formDataSell.value.netPrice = 0
    this.formDataSell.value.receiveMoney = 0
    this.formDataSell.value.changeMoney = null
    this.formDataSell.value.discount = 0
    this.formDataSell.value.perDiscount = 0
    localStorage.removeItem("countItemInList")
    this.findCustomer('');
    // console.log(this.multiListSellItem);
  }

  findCustomer(customerId: string) {
    if ((customerId == '' || customerId == null) && (this.formCustomer.customerTel == null || this.formCustomer.customerTel == '')) {
      this.callapi.getCustomerByID('PH001').subscribe(data => {
        this.dataCustomerById = data;
      })
    } else {
      this.callapi.getCustomerByID(customerId).subscribe(data => {
        this.dataCustomerById = data;
      }, error => {
        Swal.fire({
          text: 'ไม่พบรหัสลูกค้า',
          icon: 'error',
          timer: 1000,
          showConfirmButton: false
        })
      })
    }
  }

  findCustomerByTel(customerTel: string) {
    if ((customerTel == null || customerTel == '') && (this.formCustomer.customerId == null || this.formCustomer.customerId == '')) {
      this.callapi.getCustomerByID('PH001').subscribe(data => {
        this.dataCustomerById = data;
      })
    } else {
      this.callapi.getCustomerByTel(this.formCustomer.value.customerTel).subscribe(data => {
        this.dataCustomerById = data;
      }, error => {
        Swal.fire({
          text: 'ไม่พบเบอร์โทรลูกค้า',
          icon: 'error',
          timer: 1000,
          showConfirmButton: false
        })
      })
    }
  }

  submitIdproduct() {
    // console.log("product ID = " + this.formProduct.value.productId);
    this.getDataProductById(this.formProduct.value.productId)
  }

  selectEvent(item: product) {
    // console.log("product ID = " + item.productId);
    this.getDataProductById(item.productId)
  }

  genPDF(sell: sell) {
    var doc = {
      pageSize: {
        width: 210,
        height: 'auto',
      },
      content: [
        { text: sell.shopName, style: 'header', alignment: 'center', fontSize: 16, bold: true, margin: [0, -38, 0, 6] },
        { text: moment(sell.creationDatetime).format('DD/MM/YYYY'), alignment: 'left', bold: true, margin: [-28, 0, 0, -15] },
        { text: moment(sell.creationDatetime).format('HH:mm'), alignment: 'right', bold: true, margin: [0, 0, -13, 0] },
        {
          columns: [
            [
              { text: `รหัสการขาย : `, bold: true, margin: [-28, 0, 0, 0] },
              { text: `ชื่อร้าน : `, bold: true, margin: [-28, 0, 0, 0] },
              { text: `ชื่อพนักงานขาย : `, bold: true, margin: [-28, 0, 0, 0] },
              { text: `รหัสผู้เสียภาษี : `, bold: true, margin: [-28, 0, 0, 1] }
            ], [
              { text: `${sell.sellId}`, bold: true, alignment: 'right', margin: [0, 0, -13, 0] },
              { text: `${sell.shopName}`, bold: true, alignment: 'right', margin: [0, 0, -13, 0] },
              { text: `${this.dataUserById.userName}`, bold: true, alignment: 'right', margin: [0, 0, -13, 0] },
              { text: ` ${sell.taxId}`, bold: true, alignment: 'right', margin: [0, 0, -13, 1] }
            ]
          ]
        },
        {
          columns: [
            [
              { text: '-----------------------------------------------------------------------------', margin: [-38, 0, 0, 0] }
            ]
          ]
        }
      ],
      styles: {
        arguments: 'left',
        fontSize: 18,
        bold: true,
        background: '#ff1'
      },
      defaultStyle: {
        font: 'THSarabunNew'
      }
    };
    doc.content.push({
      columns: [
        [
          { text: `ชื่อสินค้า`, bold: true, margin: [-28, 0, 0, 0], alignment: 'left' }
        ],
        [
          { text: `ราคา`, bold: true, margin: [0, 0, -13, 0], alignment: 'right' }
        ],
      ]
    })
    for (let i = 0; i < sell.listSellItem.length; i++) {

      doc.content.push({
        columns: [
          [
            { text: sell.listSellItem[i].productName + ' (' + sell.listSellItem[i].amount.toString() + ')', margin: [-28, 0, 0, 0], bold: true, alignment: 'left' },
          ],
          [
            { text: sell.listSellItem[i].totalPrice.toString(), margin: [0, 0, -13, 0], bold: true, alignment: 'right' }
          ],
        ]
      })
    }
    doc.content.push({
      columns: [
        [
          { text: '-----------------------------------------------------------------------------', margin: [-38, 0, 0, 0] }
        ]
      ]
    }, {
      columns: [
        [
          { text: `ราคาไม่รวมภาษี :`, bold: true, margin: [-28, 0, 0, 0] },
          { text: `ภาษี :`, bold: true, margin: [-28, 0, 0, 0] },
          { text: `ลดราคาพิเศษ : `, bold: true, margin: [-28, 0, 0, 0] },
          { text: `ลดราคา : `, bold: true, margin: [-28, 0, 0, 0] },
          { text: `ราคารวม : `, bold: true, margin: [-28, 0, 0, 0] },
          { text: `เงินที่รับ : `, bold: true, margin: [-28, 0, 0, 0] },
          { text: `เงินทอน : `, bold: true, margin: [-28, 0, 0, 0] },
        ],
        [
          { text: `${sell.netPrice}` + ' บาท', alignment: 'right', bold: true, margin: [0, 0, -13, 0] },
          { text: `${sell.vat} %`, alignment: 'right', bold: true, margin: [0, 0, -13, 0] },
          { text: `${sell.discount}` + ' บาท', alignment: 'right', bold: true, margin: [0, 0, -13, 0] },
          { text: `${sell.perDiscount} %`, alignment: 'right', bold: true, margin: [0, 0, -13, 0] },
          { text: `${sell.totalPrice}` + ' บาท', bold: true, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${sell.receiveMoney}` + ' บาท', alignment: 'right', bold: true, margin: [0, 0, -13, 0] },
          { text: `${sell.changeMoney}` + ' บาท', alignment: 'right', bold: true, margin: [0, 0, -13, 5] },
        ]
      ]
    })
    pdfMake.createPdf(doc).print()
  }

  getDataProductById(id: string) {
    this.listSellItem = {
      productId: null,
      productName: null,
      price: null,
      amount: null,
      totalPrice: null
    }
    this.formdiscount.patchValue({
      discount: 0,
      perDiscount: 0
    })

    if (this.dataCustomerById != null) {
      this.callapi.getProductByID(id).subscribe(data => {
        this.productData = data.balance
        if (data.balance > 0) {
          this.listSellItem.productId = data.productId
          this.listSellItem.productName = data.productName
          if (this.dataCustomerById.type == 'standard') { this.listSellItem.price = data.price1 }
          else if (this.dataCustomerById.type == 'member') { this.listSellItem.price = data.price2 }
          else if (this.dataCustomerById.type == 'vip') { this.listSellItem.price = data.price3 }
          this.listSellItem.amount = 1
          this.listSellItem.totalPrice = this.listSellItem.amount * this.listSellItem.price;
          this.product.push(data)
          this.multiListSellItem.push(this.listSellItem)
          this.formDataSell.value.netPrice += this.multiListSellItem[this.countItemInList].totalPrice
          this.totalPrice = parseInt(this.formDataSell.value.netPrice + (this.formDataSell.value.netPrice * this.formDataSell.value.vat) / 100);
          this.formDataSell.value.totalPrice = this.totalPrice;
          this.countItemInList += 1

        } else if (data.balance == 0) {
          Swal.fire({
            title: 'สินค้าหมด',
            timer: 1000,
            icon: 'warning',
            showConfirmButton: false
          })
        }
        this.formProduct.patchValue({
          productId: null,
          productName: null
        })
      }, error => {
        this.formProduct.patchValue({
          productId: null
        })
        Swal.fire({
          title: 'รหัสสินค้าไม่ตรง',
          timer: 1000,
          icon: 'warning',
          showConfirmButton: false
        })
      })
    }
  }

  setCustomer() {
    if (this.dataCustomerById == null) {
      this.callapi.getCustomerByID("PH001").subscribe(data => {
        this.dataCustomerById = data;
      })
    }
  }

  getAlldatastock() {
    this.callapi.getAllStock().subscribe(i => {
      this.getdatastock = i;
      this.getdatastock.reverse();
    })
  }

  findProductById() {
    this.callapi.getProductByID(this.formListProduct.value.productId).subscribe(data => {
      this.getproductbyid = data
      this.formListProduct.patchValue({
        productId: this.getproductbyid.productId,
        productName: this.getproductbyid.productName,
        price: 0,
        amount: 0,
        totalPrice: 0
      })
      // console.log(this.formListProduct.value);
      this.addProductToList();
      this.resetFormArray();
    })
  }

  resetFormArray() {
    this.formListProduct.patchValue({
      productId: null,
      productName: null,
      price: 0,
      amount: 0,
      totalPrice: 0
    })
  }

  addProductToList() {
    if (this.formListProduct.value.productId != null && this.formListProduct.value.productName != null && this.formListProduct.value.price >= 0 && this.formListProduct.value.amount >= 0) {
      this.multiListProduct.push(this.formListProduct.value)
    }
  }
  whenAddProductToArray() {
    for (let i = 0; i < this.multiListProduct.length; i++) {
      this.multiListProduct[i].totalPrice = this.multiListProduct[i].price * this.multiListProduct[i].amount;
    }
  }

  // เพิ่มสินค้าเข้าสต็อก
  addProduct() {
    this.submitstock = true
    this.formstock.value.status = "Open"
    this.formstock.value.creationDateTime = new Date();
    this.formstock.value.listProduct = this.multiListProduct;
    // console.log(this.formstock.value);

    if (this.multiListProduct[0] != undefined && this.formstock.valid) {
      this.callapi.addStock(this.formstock.value).subscribe(i => {
        Swal.fire({
          title: 'เพิ่มสำเร็จ',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
        this.formstock.patchValue({
          billProduct: ''
        })
        this.formListProduct.patchValue({
          productId: '',
          productName: '',
          price: '',
          amount: '',
          totalPrice: ''
        })
        this.submitstock = false
        this.submitlist = false
        for (let i = 0; i <= this.multiListProduct.length; i++) {
          this.multiListProduct.pop()
        }
        this.getAlldatastock();
        this.closebuttonAdd.nativeElement.click();
      })

    }
  }

  closeStock() {
    this.submitstock = false
    this.submitlist = false
    this.formstock.patchValue({
      billProduct: ''
    })
    this.formListProduct.patchValue({
      productId: '',
      productName: '',
      price: '',
      amount: '',
      totalPrice: ''
    })
    for (let i = 0; i <= this.multiListProduct.length; i++) {
      this.multiListProduct.pop()
    }
  }
  ngOnInit(): void {
    this.setCustomer();
    // for(let i = 0; i < this.multiListSellItem.length; i++){
    //   this.totalPrice += this.multiListSellItem[i].amount * this.multiListSellItem[i].price;
    // }
    if (localStorage.getItem('rankuser') == 'STOCK') {
      this.router.navigateByUrl('/product-detail')
    }
    pdfMake.fonts = {
      THSarabunNew: {
        normal: 'THSarabunNew.ttf',
        bold: 'THSarabunNew-Bold.ttf',
        italics: 'THSarabunNew-Italic.ttf',
        bolditalics: 'THSarabunNew-BoldItalic.ttf'
      },
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    }
    this.callapi.getUserByID(localStorage.getItem('iduser')).subscribe(data => {
      this.dataUserById = data
    })
    this.formdiscount.value.discount = 0
    this.formdiscount.value.perDiscount = 0
    this.formDataSell.value.vat = 0
    if (localStorage.getItem('idsell') == null || localStorage.getItem('shopname') == null || localStorage.getItem('txtid') == null || localStorage.getItem('vat') == null) {
      Swal.fire({
        title: 'กรุณาตั้งค่าก่อนเริ่มการขาย',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'ไปยังหน้าตั้งค่า',
        confirmButtonColor: '#313131',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCloseButton: false,
        preConfirm: () => {
          localStorage.setItem('index', '7')
          this.router.navigateByUrl('/setting')

          // ยังไม่ได้ใช้   setvat ตอนเริ่มต้น   //
          // if (!vat) {
          //   Swal.showValidationMessage(
          //     '<i class="fa fa-info-circle"></i> กรุณากรอก  % Vat '
          //   )
          // } else {
          //   let isnum = /^\d+$/.test(vat)
          //   if (isnum == true) {
          //     this.formDataSell.value.vat = parseInt(vat)
          //     localStorage.setItem('vat', vat)
          //     Swal.fire({
          //       position: 'center',
          //       icon: 'success',
          //       title: 'บันทึกเรียบร้อย',
          //       showConfirmButton: false,
          //       timer: 1000
          //     })
          //   } else {
          //     Swal.showValidationMessage(
          //       '<i class="fa fa-info-circle"></i> กรุณากรอกเฉพาะตัวเลข '
          //     )
          //   }
          // }
        }
      })
    } else {
      this.formDataSell.value.vat = parseInt(localStorage.getItem('vat'))
    }

    this.callapi.getAllProduct().subscribe(data => {
      this.dataProductAll = data;
    })
  }

  onPageChange(event: any) {
    this.config.currentPage = event;
  }

}
