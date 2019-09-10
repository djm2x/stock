import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatModule } from '../mat.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DeleteComponent } from './delete/delete.component';
import { ArticleComponent } from './article/article.component';
import { UpdateComponent } from './article/update/update.component';
import { VenteComponent } from './vente/vente.component';
import { VentesComponent } from './ventes/ventes.component';
import { LoaderComponent } from '../shared/loader.component';
import { DeleteService } from './delete/delete.service';
import { ConnectionComponent } from './connection/connection.component';
@NgModule({
  declarations: [
    HomeComponent,
    WelcomeComponent,
    DeleteComponent,
    ArticleComponent,
    UpdateComponent,
    VenteComponent,
    VentesComponent,
    LoaderComponent,
    ConnectionComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    DeleteService,
    {provide: MAT_DATE_LOCALE, useValue: 'fr'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  entryComponents: [
    DeleteComponent,
    UpdateComponent,
  ],
})
export class HomeModule { }
