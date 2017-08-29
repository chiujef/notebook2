import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import {
    Note,
    NotebookStoreService,
    NoteStoreService
} from '../shared/index';

@Component({
    selector: 'nb-note-edit',
    templateUrl: './note-edit.component.html',
    styleUrls: ['./note-edit.component.css']
})
export class NoteEditComponent implements OnInit {
    note: Note;
    isNotebookSelected: boolean;
    selectedNotebookId: number;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private notebookStoreService: NotebookStoreService,
        private noteStoreService: NoteStoreService
    ) {
        this.note = new Note();
    }

    ngOnInit(): void {
        this.notebookStoreService.getSelectedNotebookStore().subscribe((notebookSelectedOperation) => {
            this.isNotebookSelected = notebookSelectedOperation.isSelected;
            this.selectedNotebookId = notebookSelectedOperation.notebookId;
        });

        this.noteStoreService.getSelectedNoteStore().subscribe((note) => {
            this.note = note;
            if (this.note.notebookId > 0) {
                this.notebookStoreService.setSelectedNotebook(this.note.notebookId);
            }
        });

        this.route.paramMap.subscribe((params: ParamMap) => {
            const noteId = +params.get('noteId');
            this.noteStoreService.getNote(noteId);
        });
    }

    saveNoteClick(): void {
        if (this.isNotebookSelected) {
            this.note.notebookId = this.selectedNotebookId;
            this.noteStoreService.addNote(this.note);
            this.goBack();
        } else {
            console.log('No Notebook to associate the Note to.');
            this.router.navigateByUrl('/');
        }
    }

    cancelNoteClick(): void {
        this.goBack();
    }

    private goBack(): void {
        this.location.back();
    }
}
