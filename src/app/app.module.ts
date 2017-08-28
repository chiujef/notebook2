import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {
  NoteComponent,
  NoteEditComponent,
  NoteListComponent,
  NotebookListComponent
} from '../components/index';

import {
  InMemoryDataService,
  NotebookService,
  NotebookStoreService,
  NoteService,
  NoteStoreService
} from '../components/shared/index';

import {
  NOTE_API_URL,
  NOTEBOOK_API_URL
} from '../components/shared/config';


@NgModule({
  declarations: [
    AppComponent,
    NoteComponent,
    NoteEditComponent,
    NoteListComponent,
    NotebookListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    NotebookService,
    { provide: NOTEBOOK_API_URL, useValue: NOTEBOOK_API_URL },
    NotebookStoreService,
    NoteService,
    { provide: NOTE_API_URL, useValue: NOTE_API_URL },
    NoteStoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
