import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs/Rx';

import { NoteEditComponent } from './note-edit.component';

import { NoteComponent } from '../index';
import {
    Note,
    Notebook,
    NotebookSelectedOperation,
    NotebookStoreService,
    NoteStoreService
} from '../shared/index';


describe('Note Edit Component tests', () => {
    const expectedNoteId = 1;

    class MockNoteStoreService {
        getSelectedNoteStore: () => Observable<Note>;
        getNoteStore: () => Observable<Note[]>;
        addNote: (newNote: Note) => void;
        getNote: (notebookId: number) => void;
    }

    class MockNotebookStoreService {
        getSelectedNotebookStore: () => Observable<NotebookSelectedOperation>;
        setSelectedNotebook: (notebookId: number) => void;
    }

    let mockNotebookStoreService: MockNotebookStoreService;
    let mockNoteStoreService: MockNoteStoreService;
    let noteEditComponent: NoteEditComponent;
    let fixture: ComponentFixture<NoteEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ NoteComponent, NoteEditComponent ],
            imports: [ RouterTestingModule, FormsModule ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: Observable.of(convertToParamMap({noteId: expectedNoteId}))
                    }
                },
                MockNotebookStoreService,
                { provide: NotebookStoreService, useClass: MockNotebookStoreService },
                MockNoteStoreService,
                { provide: NoteStoreService, useClass: MockNoteStoreService }
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(NoteEditComponent);
            noteEditComponent = fixture.componentInstance;

            mockNotebookStoreService = TestBed.get(NotebookStoreService);
            mockNoteStoreService = TestBed.get(NoteStoreService);

            mockNotebookStoreService.getSelectedNotebookStore = jasmine.createSpy('getSelectedNotebookStore')
                .and.returnValue(Observable.of(new NotebookSelectedOperation(true, 1)));
            mockNotebookStoreService.setSelectedNotebook = jasmine.createSpy('setSelectedNotebook');

            mockNoteStoreService.getSelectedNoteStore = jasmine.createSpy('getSelectedNoteStore')
                .and.returnValue(Observable.of(new Note()));
            mockNoteStoreService.getNoteStore = jasmine.createSpy('getNoteStore')
                .and.returnValue(Observable.of(new Array<Note>()));
            mockNoteStoreService.getNote = jasmine.createSpy('getNote');
        });
    }));

    it('should initialize note', () => {
        fixture.detectChanges();

        expect(noteEditComponent.note).toBeTruthy();
    });

    it('should set selected note store with the noteId passed from the URL', () => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(mockNoteStoreService.getNote).toHaveBeenCalledWith(expectedNoteId);
        });
    });

    it('should set selected notebook Id in notebook store based on a valid note\'s notebookId', () => {
        const expectedNotebookId = 1;
        mockNoteStoreService.getSelectedNoteStore = jasmine.createSpy('getSelectedNoteStore')
            .and.returnValue(Observable.of({ id: 1, notebookId: expectedNotebookId, text: 'test' }));

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(mockNotebookStoreService.setSelectedNotebook).toHaveBeenCalledWith(expectedNotebookId);
        });
    });

    describe('saveNoteClick tests', () => {
        it('should save a valid note', async() => {
            mockNotebookStoreService.getSelectedNotebookStore = jasmine.createSpy('getSelectedNotebookStore')
                .and.returnValue(Observable.of(new NotebookSelectedOperation(true, 1)));
            mockNoteStoreService.addNote = jasmine.createSpy('addNote');

            fixture.detectChanges();
            noteEditComponent.saveNoteClick();

            fixture.whenStable().then(() => {
                expect(mockNoteStoreService.addNote).toHaveBeenCalled();
            });
        });

        it('should not save a note if there are no notebook associated to it', async() => {
            mockNotebookStoreService.getSelectedNotebookStore = jasmine.createSpy('getSelectedNotebookStore')
                .and.returnValue(Observable.of(new NotebookSelectedOperation(false, 0)));
            mockNoteStoreService.addNote = jasmine.createSpy('addNote');

            fixture.detectChanges();
            noteEditComponent.saveNoteClick();

            fixture.whenStable().then(() => {
                expect(mockNoteStoreService.addNote).not.toHaveBeenCalled();
            });
        });
    });
});
