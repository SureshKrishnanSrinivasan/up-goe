import {
  NgModule
} from '@angular/core';

import {
  Routes,
  RouterModule
} from '@angular/router';

//Application Imports
import {
  PageNotFoundComponent
} from 'shared/pages';

import {
  SpecificComponent
} from 'teacher/specific/specific.component';

import {
  SpecificCharacterComponent,
  SpecificMyCourseComponent,
  SpecificNewsComponent, 
  SpecificProfileComponent,
  SpecificQuestMapComponent
} from 'teacher/specific/pages';

import { 
  AuthGuardService 
} from 'shared/services/auth-guard.service';

import { 
  GeneralComponent 
} from 'teacher/general/general.component';

import { 
  GenSelcourseComponent 
} from 'teacher/general/pages';

const specificRoutes: Routes = [

  {
    path: '',
    component: SpecificComponent,
    children: [
      {
        path: 'specific-profile/',
        loadChildren: 'teacher/general/general.module#GeneralModule',
        component: GenSelcourseComponent
      },
      {
        path: 'specific-news/',
        component: GenSelcourseComponent
      },
      {
        path: 'specific-my-course/',
        component: GenSelcourseComponent
      },
      {
        path: 'specific-character/:sectionId',
        component: SpecificCharacterComponent
      },
      {
        path: 'specific-news/:sectionId',
        component: SpecificNewsComponent
      },
      {
        path: 'specific-my-course/:sectionId',
        component: SpecificMyCourseComponent
      },
      {
        path: 'specific-profile/:sectionId',
        component: SpecificProfileComponent
      },
      {
        path: 'specific-quest-map/:sectionId',
        component: SpecificQuestMapComponent
      },
      {
        path: '**',
        component: PageNotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(specificRoutes)],
  exports: [RouterModule]
})

export class SpecificRoutingModule { }
