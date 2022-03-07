import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { sell } from 'src/app/models/sell';
import { CallApiService } from 'src/app/services/call-api.service';
import { Router } from '@angular/router';
import pdfFonts from "pdfmake-thai/build/vfs_fonts";
import pdfMake from 'pdfmake-thai/build/pdfmake'
import * as moment from 'moment';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-sell-history',
  templateUrl: './sell-history.component.html',
  styleUrls: ['./sell-history.component.css']
})
export class SellHistoryComponent implements OnInit {

  dataUser: any
  picker: any
  searchText: any
  getAllSell: any
  showbill: any
  filterDate: any
  timeStart: any
  timeEnd: any
  dateRange: any
  config = {
    itemsPerPage: 7,
    currentPage: 0
  }

  constructor(public callapi: CallApiService, formBuilder: FormBuilder, public router: Router) {
    this.dateRange = formBuilder.group({
      start: null,
      end: null
    })
    
  }

  ngOnInit(): void {
    this.getDataAllSell()
    this.dataUser = localStorage.getItem('rankuser')
    if (this.dataUser == 'STOCK') {
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
  }

  onPageChage(event: any) {
    // console.log(event)
    this.config.currentPage = event
  }

  showBill(id: string) {
    this.callapi.getSellByID(id).subscribe(data => {
      this.showbill = data
      // console.log(this.showbill);
    })
  }


  findDate() {
    if (this.dateRange.value.start != null && this.dateRange.value.end != null) {
      this.callapi.getSellByRangeDate(this.dateRange.value.start.toUTCString(), this.dateRange.value.end.toUTCString()).subscribe(data => {
        this.getAllSell = data
      })
    } else if (this.dateRange.value.start != null) {
      this.callapi.getSellByDate(this.dateRange.value.start.toUTCString()).subscribe(data => {
        this.getAllSell = data
      })
    }    
  }

   // pdf
   genPDF(sell: sell) {
    var doc = {
      pageSize: {
        width: 210,
        height: 'auto',
      },
      content: [
        { text: sell.shopName, style: 'header', alignment: 'center', fontSize: 20, bold: true, margin: [0, -38, 0, 6] },
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
              { text: `${sell.customerStoreName}`, bold: true, alignment: 'right', margin: [0, 0, -13, 0] },
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
            { text: sell.listSellItem[i].price.toString(), margin: [0, 0, -13, 0], bold: true, alignment: 'right' }
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
          { text: `ราคารวม : `, bold: true, margin: [-28, 0, 0, 0] },
          { text: `ภาษี :`, bold: true, margin: [-28, 0, 0, 0] },
          { text: `ราคาไม่รวมภาษี :`, bold: true, margin: [-28, 0, 0, 0] },
          { text: `ลดราคาพิเศษ : `, bold: true, margin: [-28, 0, 0, 0] },
          { text: `ลดราคา : `, bold: true, margin: [-28, 0, 0, 0] },
          { text: `เงินที่รับ : `, bold: true, margin: [-28, 0, 0, 0] },
          { text: `เงินทอน : `, bold: true, margin: [-28, 0, 0, 0] },
        ],
        [
          { text: `${sell.totalPrice}` + ' บาท', bold: true, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${sell.vat} %`, alignment: 'right', bold: true, margin: [0, 0, -13, 0] },
          { text: `${sell.netPrice}` + ' บาท', alignment: 'right', bold: true, margin: [0, 0, -13, 0] },
          { text: `${sell.discount}` + ' บาท', alignment: 'right', bold: true, margin: [0, 0, -13, 0] },
          { text: `${sell.perDiscount} %`, alignment: 'right', bold: true, margin: [0, 0, -13, 0] },
          { text: `${sell.receiveMoney}` + ' บาท', alignment: 'right', bold: true, margin: [0, 0, -13, 0] },
          { text: `${sell.changeMoney}` + ' บาท', alignment: 'right', bold: true, margin: [0, 0, -13, 5] },
        ]
      ]
    })
    pdfMake.createPdf(doc).open(window.print)
  }

  getDataAllSell() {
    this.dateRange.value.start = null;
    this.dateRange.value.end = null;
    this.callapi.getAllSell().subscribe(data => {
      this.getAllSell = data
      this.getAllSell.reverse();
      // console.log(this.getAllSell);
    })
  }
}
