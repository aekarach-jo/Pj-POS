import { listProduct } from './../../models/stock';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { product } from 'src/app/models/product';
import { HttpClient } from '@angular/common/http';
import { CallApiService } from 'src/app/services/call-api.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  @ViewChild('closebuttonAdd') closebuttonAdd: any;
  @ViewChild('closebuttonDelete') closebuttonDelete: any;

  formAdd: any;
  formAddForExel: any;
  arrayOfExel: any = [];
  submitAdd: boolean = false;
  submitEdit: boolean = false;
  formEdit: any;
  receiveProduct: any;
  receiveProductLow: any;
  receiveProductById: any;
  searchText: any;
  filterType: any;
  lastFilterType: any[] = [];
  typeFilter: any[] = [];
  getDataStock: any;
  getPriceStock: listProduct[] = [];
  dataForExel: [][];
  arrayOfProductFromExel: product[] = [];

  rankUser : any

  num : any 
  constructor(public fb: FormBuilder, public callapi: CallApiService, public http: HttpClient) {
    this.formAdd = this.fb.group({
      productId: [null, [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
      productName: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      model: [null, [Validators.required]],
      type: [null, [Validators.required]],
      costNew: [null],
      costAvg: [null],
      price1: [null, [Validators.required, Validators.pattern('[0-9]*')]],
      price2: [null, [Validators.required, Validators.pattern('[0-9]*')]],
      price3: [null, [Validators.required, Validators.pattern('[0-9]*')]],
      counterProduct: [null],
      balance: [null],
      status: [null],
      userUpdate: [null],
      updationDatetime: [null],
      creationDatetime: [null]
      // imgPath: [null]
    }),
      this.formAddForExel = this.fb.group({
        productId: [null],
        productName: [null],
        brand: [null],
        model: [null],
        type: [null],
        costNew: [null],
        costAvg: [null],
        price1: [null],
        price2: [null],
        price3: [null],
        counterProduct: [null],
        balance: [null],
        status: [null],
        userUpdate: [null],
        updationDatetime: [null],
        creationDatetime: [null]
        // imgPath: [null]
      }),
      this.formEdit = this.fb.group({
        productId: [null],
        productName: [null, [Validators.required]],
        brand: [null, [Validators.required]],
        model: [null, [Validators.required]],
        type: [null, [Validators.required]],
        costNew: [null],
        costAvg: [null],
        price1: [null, [Validators.required, Validators.pattern('[0-9]*')]],
        price2: [null, [Validators.required, Validators.pattern('[0-9]*')]],
        price3: [null, [Validators.required, Validators.pattern('[0-9]*')]],
        balance: [null],
        status: [null],
        userUpdate: [null],
        updationDatetime: [null],
        creationDatetime: [null]
        // imgPath: [null]
      })
  }

  ngOnInit(): void {
    this.getAllProduct();
  }


  config = {
    itemsPerPage: 6,
    currentPage: 0,
  };

  downloadExel() {
    const exelUrl = './assets/formPOS.xlsx';
    const exelName = 'แบบฟอร์มสำหรับเพิ่มสินค้า';
    FileSaver.saveAs(exelUrl, exelName);
  }

  onPageChange(event) {
    this.config.currentPage = event;
  }

  get formValidAdd() {
    return this.formAdd.controls;
  }

  get formValidEdit() {
    return this.formEdit.controls;
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.dataForExel = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      // console.log(this.dataForExel);
      this.setArrayForAddExel();
    }
    reader.readAsBinaryString(target.files[0]);
  }

  setArrayForAddExel() {
    for (let i = 1; i < this.dataForExel.length; i++) {
      // console.log(this.dataForExel[i]);
      this.arrayOfExel.push(this.dataForExel[i]);
    }
    // console.log(this.arrayOfExel);
  }

  newProduct(statusSubmit: boolean) {
    this.submitAdd = statusSubmit;
    this.formAdd.value.status = "Open";
    this.formAdd.value.creationDatetime = new Date;
    this.formAdd.value.updationDatetime = new Date;
    this.formAdd.value.costAvg = 0;
    this.formAdd.value.costNew = 0;
    this.formAdd.value.balance = 0;
    this.formAdd.value.counterProduct = 0;
    // console.log(this.formAdd.value);
    if (this.formAdd.valid && this.arrayOfExel.length == 0) {
      this.callapi.addProduct(this.formAdd.value).subscribe(addProd => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'เพิ่มสินค้าสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.getAllProduct();
        this.submitAdd = false;
      })
      this.closebuttonAdd.nativeElement.click();
    } else if (this.arrayOfExel.length > 0) {
      // console.log(this.arrayOfExel);
      for (let i = 0; i < this.arrayOfExel.length; i++) {
        this.formAddForExel.value.productId = this.arrayOfExel[i][0];
        this.formAddForExel.value.productId = this.formAddForExel.value.productId.toString();
        this.formAddForExel.value.productName = this.arrayOfExel[i][1];
        this.formAddForExel.value.brand = this.arrayOfExel[i][2];
        this.formAddForExel.value.model = this.arrayOfExel[i][3];
        this.formAddForExel.value.type = this.arrayOfExel[i][4];
        // this.formAddForExel.value.costNew = this.arrayOfExel[i][5];
        this.formAddForExel.value.costNew = 0;
        this.formAddForExel.value.costAvg = 0;
        if (this.arrayOfExel[i][6] == 0 || this.arrayOfExel[i][6] == null) {
          if (this.arrayOfExel[i][7] == 0 || this.arrayOfExel[i][7] == null) {
            this.formAddForExel.value.price1 = this.arrayOfExel[i][8];
          } else {
            this.formAddForExel.value.price1 = this.arrayOfExel[i][7];
          }
        } else {
          this.formAddForExel.value.price1 = this.arrayOfExel[i][6];
        }
        if (this.arrayOfExel[i][7] == 0 || this.arrayOfExel[i][7] == null) {
          if (this.arrayOfExel[i][6] == 0 || this.arrayOfExel[i][6] == null) {
            this.formAddForExel.value.price2 = this.arrayOfExel[i][8];
          } else {
            this.formAddForExel.value.price2 = this.arrayOfExel[i][6];
          }
        } else {
          this.formAddForExel.value.price2 = this.arrayOfExel[i][7];
        }
        if (this.arrayOfExel[i][8] == 0 || this.arrayOfExel[i][8] == null) {
          if (this.arrayOfExel[i][6] == 0 || this.arrayOfExel[i][6] == null) {
            this.formAddForExel.value.price3 = this.arrayOfExel[i][7];
          } else {
            this.formAddForExel.value.price3 = this.arrayOfExel[i][6];
          }
        } else {
          this.formAddForExel.value.price3 = this.arrayOfExel[i][8];
        }
        this.formAddForExel.value.counterProduct = 0;
        this.formAddForExel.value.balance = 0;
        this.formAddForExel.value.status = "Open";
        this.formAddForExel.value.userUpdate = null;
        this.formAddForExel.value.updationDatetime = new Date;
        this.formAddForExel.value.creationDatetime = new Date;
        // console.log(this.formAddForExel.value);
        
        this.callapi.addProduct(this.formAddForExel.value).subscribe(pd => {
          this.submitAdd = false;
          // console.log(this.formAddForExel.value);
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'เพิ่มสินค้าสำเร็จ',
            showConfirmButton: false,
            timer: 1000
          })
          this.getAllProduct();
        })
      }
      this.closebuttonAdd.nativeElement.click();
    }
  }

  closeproduct() {
    this.submitAdd = false
    this.formAdd.patchValue({
      productId: "",
      productName: "",
      brand: "",
      model: "",
      type: "",
      costNew: null,
      costAvg: null,
      price1: null,
      price2: null,
      price3: null,
    })
  }

  deleteProduct(productId: string) {
    Swal.fire({
      position: 'top',
      text: "ต้องการลบรายการสินค้านี้หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      confirmButtonText: 'ใช่, ฉันต้องการลบรายการ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.callapi.deleteProduct(productId).subscribe(pd => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'ลบสำเร็จ',
            showConfirmButton: false,
            timer: 1000
          })
          this.closebuttonDelete.nativeElement.click();
        })
        window.location.reload()
      }
    })
  }

  patchValue(receiveProductById: product) {
    this.formEdit.patchValue({
      productId: receiveProductById.productId,
      productName: receiveProductById.productName,
      brand: receiveProductById.brand,
      model: receiveProductById.model,
      type: receiveProductById.type,
      costNew: receiveProductById.costNew,
      costAvg: receiveProductById.costAvg,
      price1: receiveProductById.price1,
      price2: receiveProductById.price2,
      price3: receiveProductById.price3,
      balance: receiveProductById.balance,
      status: receiveProductById.status,
      userUpdate: receiveProductById.userUpdate,
      updationDatetime: receiveProductById.updationDatetime,
      creationDatetime: receiveProductById.creationDatetime
    });
  }

  editProduct(productId: string) {
    this.submitEdit = true;
    if (this.formEdit.valid) {
      this.formEdit.value.updationDatetime = new Date;
      this.closebuttonDelete.nativeElement.click();
      this.callapi.editProduct(productId, this.formEdit.value).subscribe(edpd => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'แก้ไขสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.getAllProduct();
        
      })
    }
  }

  getProductById(productId: string) {
    this.callapi.getProductByID(productId).subscribe(pd => {
      this.receiveProductById = pd;
      this.patchValue(this.receiveProductById);
    })
  }

  getAllProduct() {
    this.callapi.getAllProduct().subscribe(pd => {
      this.receiveProduct = pd;
      this.receiveProduct.reverse();
      this.filterShow();
      // console.log(pd);
      this.rankUser = localStorage.getItem('rankuser')
    })
  }

  filterLowProduct() {
    Swal.fire({
      title: 'ระบุสินค้าเหลือน้อยที่ต้องการ',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
    }).then((result) => {
      for (let i = 0; i < this.receiveProduct.length; i++) {
        // console.log(this.receiveProduct[i].balance);
        if (this.receiveProduct[i].balance >= result.value  ) {
          this.receiveProduct.splice(i,1)
        }
      }
    })
  }

  filterShow() {
    for (let data of this.receiveProduct) {
      this.typeFilter.push(data.type)
    }
    for (let i = 0; i < this.typeFilter.length; i++) {
      for (let j = 0; j < this.typeFilter.length; j++) {
        if (this.typeFilter[i] == this.typeFilter[j] && i != j) {
          this.typeFilter.splice(j, 1)
          // console.log(this.typeFilter);
          j = 0
        }
      }
    }
  }

  checkFilterType(type: string) {
    this.filterType = type;
    if(this.filterType == null){
      this.getAllProduct()
    }
  }
}
