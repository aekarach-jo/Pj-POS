export class order {
  orderId: string
  status: string
  userId: string
  address: string
  slip : string
  listSellItem: listSellItem[]
  totalPrice: string
  creationDatetime: string
}

export class listSellItem {
  productId: string
  productName: string
  price: number
  amount: number
  totalPrice: number
}
