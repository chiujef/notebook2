import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  NoteEditComponent,
  NotebookListComponent,
  NoteListComponent
} from '../components/index';

const routes: Routes = [
  { path: '', redirectTo: 'notebooks', pathMatch: 'full' },
  { path: 'notebooks',  component: NoteListComponent },
  { path: 'notebooks/:notebookId',  component: NoteListComponent },
  { path: 'notes/:noteId',  component: NoteEditComponent },
  { path: 'notes/:noteId',  component: NoteEditComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
