import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { StandupComponent } from './standup.component';

const routes: Routes = [
  { path: 'standup', component: StandupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandupRoutingModule { }

export const routedComponents = [
	StandupComponent
];
