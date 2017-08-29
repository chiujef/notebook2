import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import {
    Notebook,
    NotebookSelectedOperation,
    NotebookService
} from '../index';
import { NotebookStoreService } from './notebook-store.service';


describe('Notebook Store Service tests', () => {

    class MockNotebookService {
        setSelectedNotebook: (notebookId: number) => Observable<NotebookSelectedOperation>;
        addNotebook: (notebook: Notebook) => Observable<Notebook>;
        getAllNotebook: () => Observable<Notebook[]>;
        updateNotebook: (notebook: Notebook) => Observable<Notebook>;
        deleteNotebook: (notebookId: number) => Observable<any>;
    }

    /* test data - start */
    const NOTEBOOK_DATA_1: Notebook = { id: 1, title: 'Title 1' };
    const NOTEBOOK_DATA_1_UPD: Notebook = { id: 1, title: 'Title 1 - Update' };
    const NOTEBOOK_DATA_2: Notebook = { id: 2, title: 'Title 2' };
    /* test data - end */

    let notebookStoreService: NotebookStoreService = null;
    let mockNotebookService: MockNotebookService = null;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                MockNotebookService,
                { provide: NotebookService, useClass: MockNotebookService },
                NotebookStoreService
            ]
        })
        .compileComponents()
        .then(() => {
            notebookStoreService = TestBed.get(NotebookStoreService);
            mockNotebookService = TestBed.get(NotebookService);
        });
    }));

    describe('setSelectedNotebook tests', () => {
        it('should set the selected notebook store', async() => {
            notebookStoreService.setSelectedNotebook(1);

            notebookStoreService.getSelectedNotebookStore().subscribe((notebookSelectedOperation) => {
                expect(notebookSelectedOperation.notebookId).toBe(1);
            });
        });

        it('should set the selected notebook store to true when selected notebook is set', async() => {
            notebookStoreService.setSelectedNotebook(1);

            notebookStoreService.getSelectedNotebookStore().subscribe((notebookSelectedOperation) => {
                expect(notebookSelectedOperation.isSelected).toBe(true);
            });
        });
    });

    describe('addNotebook tests', () => {
        it('should add notebook to the notebook store', async() => {
            mockNotebookService.addNotebook = jasmine.createSpy('addNotebook')
                                                .and.returnValue(Observable.of(NOTEBOOK_DATA_1));

            notebookStoreService.addNotebook(NOTEBOOK_DATA_1);

            notebookStoreService.getNotebookStore().subscribe((notebooks) => {
                expect(mockNotebookService.addNotebook).toHaveBeenCalledTimes(1);
                expect(notebooks.length).toBe(1);
                expect(notebooks[0].id).toBe(NOTEBOOK_DATA_1.id);
                expect(notebooks[0].title).toBe(NOTEBOOK_DATA_1.title);
            });
        });
    });

    describe('getAllNotebook tests', () => {
        it('should get all notebook to the notebook store', async() => {
            mockNotebookService.getAllNotebook = jasmine.createSpy('getAllNotebook')
                                                    .and
                                                    .returnValue(Observable.of([NOTEBOOK_DATA_1, NOTEBOOK_DATA_2]));

            notebookStoreService.getAllNotebook();

            notebookStoreService.getNotebookStore().subscribe((notebooks) => {
                expect(mockNotebookService.getAllNotebook).toHaveBeenCalledTimes(1);
                expect(notebooks.length).toBe(2);
                expect(notebooks[0].id).toBe(NOTEBOOK_DATA_1.id);
                expect(notebooks[0].title).toBe(NOTEBOOK_DATA_1.title);
                expect(notebooks[1].id).toBe(NOTEBOOK_DATA_2.id);
                expect(notebooks[1].title).toBe(NOTEBOOK_DATA_2.title);
            });
        });
    });

    describe('updateNotebook tests', () => {
        it('should update notebook on the notebook store', async() => {
            mockNotebookService.addNotebook = jasmine.createSpy('addNotebook')
                                                .and.returnValue(Observable.of(NOTEBOOK_DATA_1));
            mockNotebookService.updateNotebook = jasmine.createSpy('updateNotebook')
                                                .and.returnValue(Observable.of(NOTEBOOK_DATA_1_UPD));

            notebookStoreService.addNotebook(NOTEBOOK_DATA_1);
            notebookStoreService.updateNotebook(NOTEBOOK_DATA_1_UPD);

            notebookStoreService.getNotebookStore().subscribe((notebooks) => {
                expect(mockNotebookService.updateNotebook).toHaveBeenCalledTimes(1);
                expect(notebooks.length).toBe(1);
                expect(notebooks[0].id).toBe(NOTEBOOK_DATA_1_UPD.id);
                expect(notebooks[0].title).toBe(NOTEBOOK_DATA_1_UPD.title);
            });
        });
    });

    describe('deleteNotebook tests', () => {
        it('should delete notebook on the notebook store', async() => {
            mockNotebookService.addNotebook = jasmine.createSpy('addNotebook')
                                                .and.returnValue(Observable.of(NOTEBOOK_DATA_1));
            mockNotebookService.deleteNotebook = jasmine.createSpy('deleteNotebook')
                                                .and.returnValue(Observable.of(null));

            notebookStoreService.addNotebook(NOTEBOOK_DATA_1);
            notebookStoreService.deleteNotebook(NOTEBOOK_DATA_1.id);

            notebookStoreService.getNotebookStore().subscribe((notebooks) => {
                expect(mockNotebookService.deleteNotebook).toHaveBeenCalledTimes(1);
                expect(notebooks.length).toBe(0);
            });
        });
    });
});
