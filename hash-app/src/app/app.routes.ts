import { Routes } from "@angular/router"
import { Md5Component } from "./md5/md5.component"
import { Sha2Component } from "./sha2/sha2.component"
import { HashComponent } from "./hash/hash.component"
import { DashboardComponent } from "./dashboard/dashboard.component";
import { Md5Simulator} from "./md5-simulator/md5-simulator.component";
import { BooleanFunctionsComponent } from "./boolean-functions/boolean-functions.component";
import { Sha2SimulatorComponent } from "./sha2-simulator/sha2-simulator.component";
export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'md5', component: Md5Component },
      { path: 'sha2', component: Sha2Component },
      { path: 'hash', component: HashComponent },
      { path: 'boolean', component: BooleanFunctionsComponent },
      { path: 'md5-simulator', component: Md5Simulator },
      { path: 'sha2-simulator', component: Sha2SimulatorComponent },
      { path: '', redirectTo: '/hash', pathMatch: 'full' },
    ],
  },
];