
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// component
import { ManagerDailyincomeComponent } from './components/manager-dailyincome/manager-dailyincome.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { MemberCreateComponent } from './components/member-create/member-create.component';
import { SellHistoryComponent } from './components/sell-history/sell-history.component';
import { SellMainComponent } from './components/sell-main/sell-main.component';
import { StockBalanceComponent } from './components/stock-balance/stock-balance.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { UserDetaillComponent } from './components/user-detaill/user-detaill.component';
import { OrderComponent } from './components/order/order.component';
import { SettingPageComponent } from './components/setting-page/setting-page.component';
import { FlieuploadComponent } from './components/fileupload/fileupload.component';
import { NewsComponent } from './components/news/news.component';
// component

const routes: Routes = [
  // { path: '', redirectTo: 'manager-dashboard', pathMatch: 'full' },
  { path: 'manager-dashboard', component: ManagerDashboardComponent },
  { path: 'manager-dailyincome', component: ManagerDailyincomeComponent },
  { path: 'sell-main', component: SellMainComponent },
  { path: 'member-create', component: MemberCreateComponent },
  { path: 'stock-balance', component: StockBalanceComponent },
  { path: 'sell-history', component: SellHistoryComponent },
  { path: 'product-detail', component: ProductDetailComponent },
  { path: 'user-detail', component: UserDetaillComponent },
  { path: 'setting', component: SettingPageComponent },
  { path: 'file', component: FlieuploadComponent},
  { path: 'order', component: OrderComponent},
  { path: 'news', component: NewsComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
