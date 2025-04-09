import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VintomPlayerComponent } from './vintom-player/vintom-player.component';

const routes: Routes = [
  { path: '', redirectTo: 'vintom-player', pathMatch: 'full' },
  { path: 'vintom-player', component: VintomPlayerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
