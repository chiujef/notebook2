import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import {
    Note,
    NoteService
} from '../index';
import { NoteStoreService } from './note-store.service';


describe('Note Store Service tests', () => {

    class MockNoteService {
        addNote: (note: Note) => Observable<Note>;
        getAllNoteByNotebookId: (notebookId: number) => Observable<Note[]>;
        getNote: (noteId: number) => Observable<Note>;
        updateNote: (note: Note) => Observable<Note>;
        deleteNote: (noteId: number) => Observable<any>;
    }

    /* test data - start */
    const NOTE_DATA_1: Note = { id: 1, notebookId: 1, text: 'Note 1' };
    const NOTE_DATA_1_UPD: Note = { id: 1, notebookId: 1, text: 'Note 1 UPD' };
    const NOTE_DATA_2: Note = { id: 3, notebookId: 2, text: 'Note 2' };
    /* test data - end */

    let noteStoreService: NoteStoreService = null;
    let mockNoteService: MockNoteService = null;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                MockNoteService,
                { provide: NoteService, useClass: MockNoteService },
                NoteStoreService
            ]
        })
        .compileComponents()
        .then(() => {
            noteStoreService = TestBed.get(NoteStoreService);
            mockNoteService = TestBed.get(NoteService);
        });
    }));

    describe('addNote tests', () => {
        it('should add note to the note store', async() => {
            mockNoteService.addNote = jasmine.createSpy('addNote')
                                                .and.returnValue(Observable.of(NOTE_DATA_1));

            noteStoreService.addNote(NOTE_DATA_1);

            noteStoreService.getNoteStore().subscribe((notes) => {
                expect(mockNoteService.addNote).toHaveBeenCalledTimes(1);
                expect(notes.length).toBe(1);
                expect(notes[0].id).toBe(NOTE_DATA_1.id);
                expect(notes[0].text).toBe(NOTE_DATA_1.text);
            });
        });
    });

    describe('getAllNoteByNotebookId tests', () => {
        it('should get all note by notebook id to the note store', async() => {
            mockNoteService.getAllNoteByNotebookId = jasmine.createSpy('getAllNoteByNotebookId')
                                                .and.returnValue(Observable.of([NOTE_DATA_1, NOTE_DATA_2]));

            noteStoreService.getAllNoteByNotebookId(1);

            noteStoreService.getNoteStore().subscribe((notes) => {
                expect(mockNoteService.getAllNoteByNotebookId).toHaveBeenCalledTimes(1);
                expect(notes.length).toBe(2);
                expect(notes[0].id).toBe(NOTE_DATA_1.id);
                expect(notes[0].notebookId).toBe(NOTE_DATA_1.notebookId);
                expect(notes[0].text).toBe(NOTE_DATA_1.text);
                expect(notes[1].id).toBe(NOTE_DATA_2.id);
                expect(notes[1].notebookId).toBe(NOTE_DATA_2.notebookId);
                expect(notes[1].text).toBe(NOTE_DATA_2.text);
            });
        });
    });

    describe('getNote tests', () => {
        it('should get note and save to selected note store', async() => {
            mockNoteService.getNote = jasmine.createSpy('getNote')
                                                .and.returnValue(Observable.of(NOTE_DATA_1));

            noteStoreService.getNote(1);

            noteStoreService.getSelectedNoteStore().subscribe((note) => {
                expect(mockNoteService.getNote).toHaveBeenCalledTimes(1);
                expect(note).toBe(NOTE_DATA_1);
            });
        });

        it('should return a new note when note is not found', async() => {
            mockNoteService.getNote = jasmine.createSpy('getNote')
                .and.returnValue(Observable.of(null));

            noteStoreService.getNote(1);

            noteStoreService.getSelectedNoteStore().subscribe((note) => {
                expect(mockNoteService.getNote).toHaveBeenCalledTimes(1);
                expect(note).toBeTruthy();
            });
        });
    });

    describe('updateNote tests', () => {
        it('should update note on the note store', async() => {
            mockNoteService.addNote = jasmine.createSpy('addNote')
                                                .and.returnValue(Observable.of(NOTE_DATA_1));
            mockNoteService.updateNote = jasmine.createSpy('updateNote')
                                                .and.returnValue(Observable.of(NOTE_DATA_1_UPD));

            noteStoreService.addNote(NOTE_DATA_1);
            noteStoreService.updateNote(NOTE_DATA_1_UPD);

            noteStoreService.getNoteStore().subscribe((notes) => {
                expect(mockNoteService.updateNote).toHaveBeenCalledTimes(1);
                expect(notes.length).toBe(1);
                expect(notes[0].text).toBe(NOTE_DATA_1_UPD.text);
            });
        });
    });

    describe('deleteNote tests', () => {
        it('should delete note on the note store', async() => {
            mockNoteService.addNote = jasmine.createSpy('addNote')
                                                .and.returnValue(Observable.of(NOTE_DATA_1));
            mockNoteService.deleteNote = jasmine.createSpy('deleteNote')
                                                .and.returnValue(Observable.of(null));

            noteStoreService.addNote(NOTE_DATA_1);
            noteStoreService.deleteNote(NOTE_DATA_1.id);

            noteStoreService.getNoteStore().subscribe((notes) => {
                expect(mockNoteService.deleteNote).toHaveBeenCalledTimes(1);
                expect(notes.length).toBe(0);
            });
        });
    });
});
