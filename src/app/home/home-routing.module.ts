import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ArticleComponent } from './article/article.component';
import { VenteComponent } from './vente/vente.component';
import { VentesComponent } from './ventes/ventes.component';
import { ConnectionComponent } from './connection/connection.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'connection', pathMatch: 'full' },
      { path: 'connection', component: ConnectionComponent, data: { state: 'connection' } },
      { path: 'article', component: ArticleComponent, data: { state: 'article' } },
      { path: 'ventes/:id', component: VenteComponent, data: { state: 'vente' } },
      { path: 'ventes', component: VentesComponent, data: { state: 'ventes' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
