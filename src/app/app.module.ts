import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule, } from '@angular/common/http';
import { ChartModule } from 'angular2-chartjs';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';


// component
import { ManagerDailyincomeComponent } from './components/manager-dailyincome/manager-dailyincome.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { MemberCreateComponent } from './components/member-create/member-create.component';
import { SellMainComponent } from './components/sell-main/sell-main.component';
import { StockBalanceComponent } from './components/stock-balance/stock-balance.component';
import { SellHistoryComponent } from './components/sell-history/sell-history.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { UserDetaillComponent } from './components/user-detaill/user-detaill.component';
import { SettingPageComponent } from './components/setting-page/setting-page.component';
import { FlieuploadComponent } from './components/fileupload/fileupload.component';
import { OrderComponent } from './components/order/order.component';
import { NewsComponent } from './components/news/news.component';
// component

@NgModule({
  declarations: [
    AppComponent,
    ManagerDailyincomeComponent,
    ManagerDashboardComponent,
    MemberCreateComponent,
    SellMainComponent,
    StockBalanceComponent,
    SellHistoryComponent,
    ProductDetailComponent,
    UserDetaillComponent,
    SettingPageComponent,
    FlieuploadComponent,
    OrderComponent,
    NewsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    FormsModule,
    HttpClientModule,
    ChartModule,
    Ng2SearchPipeModule,
    MatSliderModule,
    MatCardModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    AutocompleteLibModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
