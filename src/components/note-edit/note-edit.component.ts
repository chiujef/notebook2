import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Note, NoteStoreService } from '../shared/index';

@Component({
    selector: 'nb-note-edit',
    templateUrl: './note-edit.component.html',
    styleUrls: ['./note-edit.component.css']
})
export class NoteEditComponent implements OnInit {
    note: Note;

    constructor(private route: ActivatedRoute,
        private noteStoreService: NoteStoreService
    ) { }

    ngOnInit(): void {
        this.noteStoreService.getSelectedNoteStore().subscribe((note) => {
            this.note = note;
        });

        this.route.paramMap.subscribe((params: ParamMap) => {
            const noteId = +params.get('noteId');
            this.noteStoreService.getNote(noteId);
        });
    }
}
