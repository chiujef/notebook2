import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { Observable } from 'rxjs/Rx';

import { NoteListComponent } from './note-list.component';

import { NoteComponent } from '../index';
import {
    Note,
    Notebook,
    NotebookStoreService,
    NoteStoreService
} from '../shared/index';


describe('Note List Component tests', () => {
    const expectedNotebookId = 1;

    class MockNoteStoreService {
        getNoteStore: () => Observable<Note[]>;
        getAllNoteByNotebookId: (notebookId: number) => void;
    }

    class MockNotebookStoreService {
        setSelectedNotebook: (notebookId: number) => void;
    }

    let mockNotebookStoreService: MockNotebookStoreService;
    let mockNoteStoreService: MockNoteStoreService;
    let noteListComponent: NoteListComponent;
    let fixture: ComponentFixture<NoteListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ NoteComponent, NoteListComponent ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: Observable.of(convertToParamMap({notebookId: expectedNotebookId}))
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
            fixture = TestBed.createComponent(NoteListComponent);
            noteListComponent = fixture.componentInstance;

            mockNotebookStoreService = TestBed.get(NotebookStoreService);
            mockNoteStoreService = TestBed.get(NoteStoreService);

            mockNotebookStoreService.setSelectedNotebook = jasmine.createSpy('setSelectedNotebook');

            mockNoteStoreService.getNoteStore = jasmine.createSpy('getNoteStore')
                .and.returnValue(Observable.of(new Array<Note>()));
            mockNoteStoreService.getAllNoteByNotebookId = jasmine.createSpy('getAllNoteByNotebookId');
        });
    }));

    it('should initialize notes', () => {
        fixture.detectChanges();

        expect(noteListComponent.notes).toBeTruthy();
    });

    it('should set selected notebook store with the notebookId passed from the URL', () => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(mockNotebookStoreService.setSelectedNotebook).toHaveBeenCalledWith(expectedNotebookId);
        });
    });

    it('should get all notebook with the notebookId passed from the URL', () => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(mockNoteStoreService.getAllNoteByNotebookId).toHaveBeenCalledWith(expectedNotebookId);
        });
    });
});
