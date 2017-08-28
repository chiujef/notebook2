import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { Note } from '../models/note';
import { NoteService } from '../services/note.service';


/* Client storage for the note objects */
@Injectable()
export class NoteStoreService {
    private selectedNoteStoreSubject: Subject<Note> = new Subject<Note>();

    private noteStoreSubject: BehaviorSubject<Note[]> = new BehaviorSubject(new Array<Note>());
    private noteStorage: Note[] = new Array<Note>();

    constructor(private noteService: NoteService) { }

    getSelectedNoteStore(): Observable<Note> {
        return this.selectedNoteStoreSubject.asObservable();
    }

    getNoteStore(): Observable<Note[]> {
        return this.noteStoreSubject.asObservable();
    }

    addNote(newNote: Note): void {
        this.noteService.addNote(newNote).subscribe((note) => {
            this.noteStorage.push(note);
            this.noteStoreSubject.next(this.deepCopy(this.noteStorage));
        });
    }

    getAllNoteByNotebookId(notebookId: number): void {
        this.noteService.getAllNoteByNotebookId(notebookId).subscribe((notes) => {
            this.noteStorage = notes;
            this.noteStoreSubject.next(this.deepCopy(this.noteStorage));
        });
    }

    getNote(noteId: number): void {
        let selectedNote = this.noteStorage.find(note => note.id === noteId);
        if (!selectedNote) {
            this.noteService.getNote(noteId).subscribe((note) => {
                selectedNote = note;
                this.selectedNoteStoreSubject.next(this.deepCopy(selectedNote));
            });
        } else {
            this.selectedNoteStoreSubject.next(this.deepCopy(selectedNote));
        }
    }

    updateNote(updatedNote: Note): void {
         this.noteService.updateNote(updatedNote).subscribe((note) => {
            this.noteStorage.forEach((item, index) => {
                if (this.noteStorage[index].id === note.id) {
                    this.noteStorage[index] = note;
                }
            });

            this.noteStoreSubject.next(this.deepCopy(this.noteStorage));
        });
    }

    deleteNote(noteId: number): void {
         this.noteService.deleteNote(noteId).subscribe(() => {
            this.noteStorage.forEach((item, index) => {
                if (this.noteStorage[index].id === noteId) {
                    this.noteStorage.splice(index, 1);
                }
            });

            this.noteStoreSubject.next(this.deepCopy(this.noteStorage));
        });
    }

    private deepCopy(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }
}
