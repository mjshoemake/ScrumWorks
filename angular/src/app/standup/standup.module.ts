import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';
import { StandupRoutingModule, routedComponents } from './standup.routing';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Declarations
import { StandupComponent } from './standup.component';
import { StandupService } from './standup.service';

@NgModule({
  imports: [StandupRoutingModule,
            SharedModule,
            CommonModule,
            NgbModule],
  declarations: [routedComponents,
                 StandupComponent
                ],
  providers: [StandupService]
})
export class StandupModule { }
