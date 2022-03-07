import { listSellItem } from './../../models/sell';
import { product } from './../../models/product';
import { listProduct } from './../../models/stock';
import { CallApiService } from './../../services/call-api.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { MatInput } from '@angular/material/input';
@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
})
export class ManagerDashboardComponent implements OnInit {
  time: Date
  dateRange: any
  chooseOption: string;
  option: string[] = [
    'สินค้าที่ขายวันนี้',
    'สินค้าที่ขายเดือนนี้',
    'ประวัติการขายทั้งหมด',
  ];
  statusTab: number;
  tabs = ['ประวัติการขายทั้งหมด'];
  selected = new FormControl();
  searchText: any;

  panelOpenState = false;


  dataUser: any
  formFindDate: any;
  formFindMonth: any;
  formFindYear: any;

  myChart: any;
  myChart2: any;
  myChart3: any;
  income: any = 0;
  incomeAll: any = 0;
  cost: any = 0;
  costAll: any = 0;
  costMonth: any = 0;
  incomeMonth: any = 0;
  realIncome: any = 0;
  result: any = 0;
  getAllSell: any;
  getAllSellByDate: any[] = [];
  getAllSellByMonth: any;
  getAllSellToChooseDate: any[] = [];

  getDataProduct: any;
  getDataProductAll: any;
  getDataProductMonth: any;
  getPriceProduct: product[] = [];
  getPriceStockStepTwo: product[] = [];
  countPriceStock: number;

  counterItem: number = 0;
  counterItemAll: number = 0;
  counterItemMonth: any = 0;
  getIncomeData: any;
  getIncomeDataAll: any;
  getIncomeDataMonth: any;
  getCost: any;
  getProduct: product[] = [];
  getIncomePrice: listProduct[] = [];
  getIncomePriceAll: listProduct[] = [];
  getIncomePriceMonth: listProduct[] = [];
  listItem: listSellItem[] = [];
  bestSeller: listSellItem[] = [];
  bestSeller2: listSellItem[] = [];
  tableTotalPriceBar: listSellItem[] = [];
  tableTotalPriceLine: listSellItem[] = [];
  totalPriceShow: listSellItem[] = [];

  data: any[] = [];
  labelProduct: any[] = [];
  nameProduct: any[] = [];
  amountProduct: any[] = [];
  dataProduct: listSellItem[] = [];

  labelProductResult: any[] = [];
  dataProductResult: any[] = [];







  constructor(public router: Router, public fb: FormBuilder, public callapi: CallApiService) {
    this.formFindDate = this.fb.group({
      dateStart: null,
      dateEnd: null,
    }),
      this.formFindMonth = this.fb.group({
        monthStart: null,
        monthEnd: null,
      }),
      this.formFindYear = this.fb.group({
        yearStart: null,
        yearEnd: null,
      }),
      this.dateRange = this.fb.group({
        start: null,
        end: null
      })

    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  config = {
    itemsPerPage: 6,
    currentPage: 0,
  };

  onPageChange(event) {
    this.config.currentPage = event;
  }

  @ViewChild('dateRange', {
    read: MatInput
  }) fromInput: MatInput;

  @ViewChild('toInput', {
    read: MatInput
  }) toInput: MatInput;


  onGetAll() {
    this.nameProduct = []
    this.dataProduct = []
    this.amountProduct = []
    this.callapi.getAllSell().subscribe((i) => {
      this.getAllSell = i;
      // console.log(this.getAllSell);

      this.getAllSellByDate[0] = i;
      for (let i = 0; i < this.getAllSell.length; i++) {
        for (let index = 0; index < this.getAllSell[i].listSellItem.length; index++) {
          this.listItem.push(this.getAllSell[i].listSellItem[index]);
        }
      }
      for (let i = 0; i < this.getAllSellByDate[0].length; i++) {
        for (let index = 0; index < this.getAllSellByDate[0][i].listSellItem.length; index++) {
          let checkId = this.dataProduct.find(sum => sum.productId == this.getAllSellByDate[0][i].listSellItem[index].productId)
          if (checkId == null) {
            this.dataProduct.push(this.getAllSellByDate[0][i].listSellItem[index]);

          } else {

            for (let j = 0; j < this.dataProduct.length; j++) {
              if (this.dataProduct[j].productId == this.getAllSellByDate[0][i].listSellItem[index].productId) {
                this.dataProduct[j].amount += this.getAllSellByDate[0][i].listSellItem[index].amount;
                this.dataProduct[j].totalPrice += this.getAllSellByDate[0][i].listSellItem[index].totalPrice;
              }

            }
          }
        }
      }


      this.productBestSeller();
    });
  }

  productBestSeller() {
    this.bestSeller = []
    let date = new Date();
    this.formFindMonth.value.monthStart = new Date();
    this.formFindMonth.value.monthEnd = new Date();
    this.formFindMonth.value.monthStart.setDate(1);
    this.formFindMonth.value.monthStart.setHours(0);
    this.formFindMonth.value.monthStart.setMinutes(0);
    this.formFindMonth.value.monthStart.setSeconds(0);
    this.formFindMonth.value.monthEnd.setMonth(date.getMonth() + 1);
    this.formFindMonth.value.monthEnd.setDate(1);
    this.formFindMonth.value.monthEnd.setHours(0);
    this.formFindMonth.value.monthEnd.setMinutes(0);
    this.formFindMonth.value.monthEnd.setSeconds(0);
    // console.log('--------', this.formFindMonth.value.month);
    this.callapi.getSellByMonth(
      this.formFindMonth.value.monthStart.toUTCString(),
      this.formFindMonth.value.monthEnd.toUTCString()).subscribe((i) => {
        this.getAllSellByMonth = i;
        for (let i = 0; i < this.getAllSellByMonth.length; i++) {
          for (let index = 0; index < this.getAllSellByMonth[i].listSellItem.length; index++) {
            let checkId = this.bestSeller.find(sum => sum.productId == this.getAllSellByMonth[i].listSellItem[index].productId)
            if (checkId == null) {
              this.bestSeller.push(this.getAllSellByMonth[i].listSellItem[index]);

            } else {
              for (let j = 0; j < this.bestSeller.length; j++) {
                if (this.bestSeller[j].productId == this.getAllSellByMonth[i].listSellItem[index].productId) {
                  this.bestSeller[j].amount += this.getAllSellByMonth[i].listSellItem[index].amount;
                  this.bestSeller.sort((a, b) => b.amount - a.amount);
                }
              }
            }
          }
        }
        for (let k = 0; k < this.bestSeller.length; k++) {
          if (k < 10) {
            this.bestSeller2[k] = this.bestSeller[k]
          }
        }
        for (let d = 0; d < this.bestSeller2.length; d++) {
          this.nameProduct.push(this.bestSeller2[d].productName)
          this.amountProduct.push(this.bestSeller2[d].amount)
        }
        this.chartResult();
        // console.log(this.bestSeller2);
      });
  }

  dailyIncome() {
    this.formFindDate.value.dateStart = new Date();
    this.formFindDate.value.dateEnd = new Date();
    this.formFindDate.value.dateStart.setHours(0);
    this.formFindDate.value.dateStart.setMinutes(0);
    this.formFindDate.value.dateStart.setSeconds(1);
    this.formFindDate.value.dateEnd.setHours(23);
    this.formFindDate.value.dateEnd.setMinutes(59);
    this.formFindDate.value.dateEnd.setSeconds(59);
    if (this.formFindDate != null) {
      this.callapi.getSellByRangeDate(
        this.formFindDate.value.dateStart.toUTCString(),
        this.formFindDate.value.dateEnd.toUTCString()
      )
        .subscribe((data) => {
          this.getIncomeData = data;
          // console.log(this.getIncomeData);

          for (let i = 0; i < this.getIncomeData.length; i++) {
            for (let index = 0; index < this.getIncomeData[i].listSellItem.length; index++) {
              this.getIncomePrice.push(this.getIncomeData[i].listSellItem[index]);
              this.income += this.getIncomeData[i].listSellItem[index].totalPrice;
              this.counterItem += 1;
            }
          }
          this.dailyCost();
          // console.log(this.cost);
        });
    }
  }

  dailyCost() {
    this.callapi.getAllProduct().subscribe(data => {
      this.getDataProduct = data;
      // console.log(this.getIncomePrice);
      if (this.getDataProduct != undefined) {
        for (let data = 0; data < this.getDataProduct.length; data++) {
          for (let index = 0; index < this.getIncomePrice.length; index++) {

            if (this.getDataProduct[data].productId == this.getIncomePrice[index].productId) {
              this.cost += (this.getDataProduct[data].costAvg * this.getIncomePrice[index].amount);

            }
          }
        }
      }
    });
  }
  monthIncome() {
    let date = new Date();
    this.formFindMonth.value.monthStart = new Date();
    this.formFindMonth.value.monthEnd = new Date();
    this.formFindMonth.value.monthStart.setDate(1);
    this.formFindMonth.value.monthStart.setHours(0);
    this.formFindMonth.value.monthStart.setMinutes(0);
    this.formFindMonth.value.monthStart.setSeconds(0);
    this.formFindMonth.value.monthEnd.setMonth(date.getMonth() + 1);
    this.formFindMonth.value.monthEnd.setDate(1);
    this.formFindMonth.value.monthEnd.setHours(0);
    this.formFindMonth.value.monthEnd.setMinutes(0);
    this.formFindMonth.value.monthEnd.setSeconds(0);
    if (this.formFindMonth != null) {
      this.callapi.getSellByMonth(
        this.formFindMonth.value.monthStart.toUTCString(),
        this.formFindMonth.value.monthEnd.toUTCString()).subscribe((data) => {
          this.getIncomeDataMonth = data;
          // console.log(this.getIncomeDataMonth);
          for (let i = 0; i < this.getIncomeDataMonth.length; i++) {
            for (let index = 0; index < this.getIncomeDataMonth[i].listSellItem.length; index++) {
              this.getIncomePriceMonth.push(this.getIncomeDataMonth[i].listSellItem[index]);
              this.incomeMonth += this.getIncomeDataMonth[i].listSellItem[index].totalPrice;
              this.counterItemMonth += 1;
            }
          }
          this.monthCost();
          // console.log(this.cost);
        });
    }
  }

  monthCost() {
    this.callapi.getAllProduct().subscribe(data => {
      this.getDataProductMonth = data;
      // console.log(this.getIncomePrice);
      if (this.getDataProductMonth != undefined) {
        for (let data = 0; data < this.getDataProductMonth.length; data++) {
          for (let index = 0; index < this.getIncomePriceMonth.length; index++) {

            if (this.getDataProductMonth[data].productId == this.getIncomePriceMonth[index].productId) {
              this.costMonth += (this.getDataProductMonth[data].costAvg * this.getIncomePriceMonth[index].amount);
            }
          }
        }
      }
    });
  }

  allIncome() {
    if (this.formFindDate != null) {
      this.callapi.getAllSell().subscribe((data) => {
        this.getIncomeDataAll = data;
        // console.log(this.getIncomeDataAll);

        for (let i = 0; i < this.getIncomeDataAll.length; i++) {
          for (let index = 0; index < this.getIncomeDataAll[i].listSellItem.length; index++) {
            this.getIncomePriceAll.push(this.getIncomeDataAll[i].listSellItem[index]);
            this.incomeAll += this.getIncomeDataAll[i].listSellItem[index].totalPrice;
            this.counterItemAll += 1;
          }
        }
        this.allCost();
        // console.log(this.cost);
      });
    }
  }

  allCost() {
    this.callapi.getAllProduct().subscribe(data => {
      this.getDataProductAll = data;
      // console.log(this.getIncomePrice);
      if (this.getDataProductAll != undefined) {
        for (let data = 0; data < this.getDataProductAll.length; data++) {
          for (let index = 0; index < this.getIncomePriceAll.length; index++) {

            if (this.getDataProductAll[data].productId == this.getIncomePriceAll[index].productId) {
              this.costAll += (this.getDataProductAll[data].costAvg * this.getIncomePriceAll[index].amount);

            }
          }
        }
      }
    });
  }



  addTab() {
    this.tabs.fill(this.chooseOption);
    if (this.chooseOption == 'ประวัติการขายทั้งหมด') {
      this.statusTab = 0;
      this.onGetAll();
      this.selected.setValue(this.tabs.length);
    } else if (this.chooseOption == 'สินค้าที่ขายวันนี้') {
      this.statusTab = 1;
      this.findDate();
      this.selected.setValue(this.tabs.length);
    } else if (this.chooseOption == 'สินค้าที่ขายเดือนนี้') {
      this.statusTab = 2;
      this.findMonth();
      this.selected.setValue(this.tabs.length);
    }

  }
  findDatePicker() {
    if (this.dateRange.value.start != null && this.dateRange.value.end != null) {
      this.callapi.getSellByRangeDate(this.dateRange.value.start.toUTCString(), this.dateRange.value.end.toUTCString()).subscribe((data) => {
        this.getAllSellByDate[0] = data;
        this.findRange();
        this.chartToday();
        // console.log(this.getAllSellByDate[0]);
      });
    } else if (this.dateRange.value.start != null) {
      this.callapi.getSellByDate(this.dateRange.value.start.toUTCString()).subscribe((data) => {
        this.getAllSellByDate[0] = data;
        this.findRange();
        this.chartToday();
        // console.log(this.getAllSellByDate[0]);
      });
    }
    this.dateRange.value = ""
  }

  findRange() {
    this.nameProduct = []
    this.dataProduct = []
    this.amountProduct = []
    // console.log('findRange', this.formFindDate.value);
    for (let i = 0; i < this.getAllSellByDate[0].length; i++) {
      for (let index = 0; index < this.getAllSellByDate[0][i].listSellItem.length; index++) {
        let checkId = this.dataProduct.find(sum => sum.productId == this.getAllSellByDate[0][i].listSellItem[index].productId)
        if (checkId == null) {
          this.dataProduct.push(this.getAllSellByDate[0][i].listSellItem[index]);
          // console.log(this.dataProduct);
        } else {
          for (let j = 0; j < this.dataProduct.length; j++) {
            if (this.dataProduct[j].productId == this.getAllSellByDate[0][i].listSellItem[index].productId) {
              this.dataProduct[j].amount += this.getAllSellByDate[0][i].listSellItem[index].amount
              this.dataProduct[j].totalPrice += this.getAllSellByDate[0][i].listSellItem[index].totalPrice;
            }
          }
        }
      }
    }
    for (let k = 0; k < this.dataProduct.length; k++) {
      this.nameProduct.push(this.dataProduct[k].productName)
      this.amountProduct.push(this.dataProduct[k].amount)
    }
  }

  findDate() {
    this.nameProduct = []
    this.dataProduct = []
    this.amountProduct = []
    this.formFindDate.value.dateStart = new Date();
    this.formFindDate.value.dateEnd = new Date();
    this.formFindDate.value.dateStart.setHours(0);
    this.formFindDate.value.dateStart.setMinutes(0);
    this.formFindDate.value.dateStart.setSeconds(1);
    this.formFindDate.value.dateEnd.setHours(23);
    this.formFindDate.value.dateEnd.setMinutes(59);
    this.formFindDate.value.dateEnd.setSeconds(59);
    if (this.formFindDate != null) {
      this.callapi
        .getSellByRangeDate(
          this.formFindDate.value.dateStart.toUTCString(),
          this.formFindDate.value.dateEnd.toUTCString()
        )
        .subscribe((data) => {
          // console.log('findDate', this.formFindDate.value);
          this.getAllSellByDate[1] = data
          for (let i = 0; i < this.getAllSellByDate[1].length; i++) {
            for (let index = 0; index < this.getAllSellByDate[1][i].listSellItem.length; index++) {
              let checkId = this.dataProduct.find(sum => sum.productId == this.getAllSellByDate[1][i].listSellItem[index].productId)
              if (checkId == null) {
                this.dataProduct.push(this.getAllSellByDate[1][i].listSellItem[index]);
                // console.log(this.dataProduct);

              } else {
                for (let j = 0; j < this.dataProduct.length; j++) {
                  if (this.dataProduct[j].productId == this.getAllSellByDate[1][i].listSellItem[index].productId) {
                    this.dataProduct[j].amount += this.getAllSellByDate[1][i].listSellItem[index].amount
                    this.dataProduct[j].totalPrice += this.getAllSellByDate[1][i].listSellItem[index].totalPrice;
                  }
                }
              }
            }
          }

          for (let k = 0; k < this.dataProduct.length; k++) {
            this.nameProduct.push(this.dataProduct[k].productName)
            this.amountProduct.push(this.dataProduct[k].amount)
          }
        });
    }
  }

  findMonth() {
    this.nameProduct = []
    this.dataProduct = []
    this.amountProduct = []
    let date = new Date();
    this.formFindMonth.value.monthStart = new Date();
    this.formFindMonth.value.monthEnd = new Date();
    this.formFindMonth.value.monthStart.setDate(1);
    this.formFindMonth.value.monthStart.setHours(0);
    this.formFindMonth.value.monthStart.setMinutes(0);
    this.formFindMonth.value.monthStart.setSeconds(0);
    this.formFindMonth.value.monthEnd.setMonth(date.getMonth() + 1);
    this.formFindMonth.value.monthEnd.setDate(1);
    this.formFindMonth.value.monthEnd.setHours(0);
    this.formFindMonth.value.monthEnd.setMinutes(0);
    this.formFindMonth.value.monthEnd.setSeconds(0);
    // console.log('--------', this.formFindMonth.value.month);
    if (this.formFindMonth != null) {
      this.callapi.getSellByMonth(
        this.formFindMonth.value.monthStart.toUTCString(),
        this.formFindMonth.value.monthEnd.toUTCString()).subscribe((data) => {
          // console.log('findMonth', this.formFindMonth.value);
          this.getAllSellByDate[2] = data;
          for (let i = 0; i < this.getAllSellByDate[2].length; i++) {
            for (let index = 0; index < this.getAllSellByDate[2][i].listSellItem.length; index++) {
              let checkId = this.dataProduct.find(sum => sum.productId == this.getAllSellByDate[2][i].listSellItem[index].productId)
              if (checkId == null) {
                this.dataProduct.push(this.getAllSellByDate[2][i].listSellItem[index]);

              } else {
                for (let j = 0; j < this.dataProduct.length; j++) {
                  if (this.dataProduct[j].productId == this.getAllSellByDate[2][i].listSellItem[index].productId) {
                    this.dataProduct[j].amount += this.getAllSellByDate[2][i].listSellItem[index].amount;
                    this.dataProduct[j].totalPrice += this.getAllSellByDate[2][i].listSellItem[index].totalPrice;
                  }
                }
              }
            }
          }
          for (let k = 0; k < this.dataProduct.length; k++) {
            this.nameProduct.push(this.dataProduct[k].productName.substring(0,))
            this.amountProduct.push(this.dataProduct[k].amount)
          }
        });
    }
  }

  chartToday() {
    if (this.myChart != undefined) {
      this.myChart.destroy();
    }
    const ctx = document.getElementById('chartToday');
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.nameProduct,
        datasets: [
          {
            label: "",
            data: this.amountProduct,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  chartResult() {
    if (this.myChart2 != undefined) {
      this.myChart2.destroy();
    }
    if (this.nameProduct != [] && this.amountProduct != []) {
      const ctx2 = document.getElementById('chartResults');
      this.myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: this.nameProduct,
          datasets: [
            {
              label: "",
              data: this.amountProduct,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }
  }



  ngOnInit() {
    this.dailyIncome();
    this.monthIncome();
    this.allIncome()
    this.statusTab = 0;
    this.onGetAll();

    this.dataUser = localStorage.getItem('rankuser')
    if (this.dataUser == 'SELL') {
      this.router.navigateByUrl('/sell-main')
    }
    if (this.dataUser == 'STOCK') {
      this.router.navigateByUrl('/product-detail')
    }
  }

}
