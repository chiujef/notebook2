import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';

import { NotebookListComponent } from './notebook-list.component';

import { Notebook, NotebookStoreService } from '../shared/index';


describe('Notebook List Component tests', () => {
    let router = {
        navigate: jasmine.createSpy('navigate')
    };

    class MockNotebookStoreService {
        getSelectedNotebookStore: () => Observable<number>;
        getNotebookStore: () => Observable<Notebook[]>;
        setSelectedNotebook: (notebookId: number) => void;
        addNotebook: (newNotebook: Notebook) => void;
        getAllNotebook: () => void;
        deleteNotebook: (notebookId: number) => void;
    }

    let mockNotebookStoreService: MockNotebookStoreService;
    let notebookListComponent: NotebookListComponent;
    let fixture: ComponentFixture<NotebookListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ NotebookListComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                MockNotebookStoreService,
                { provide: NotebookStoreService, useClass: MockNotebookStoreService },
                { provide: Router, useValue: router }
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(NotebookListComponent);
            notebookListComponent = fixture.componentInstance;

            mockNotebookStoreService = TestBed.get(NotebookStoreService);

            mockNotebookStoreService.getSelectedNotebookStore = jasmine.createSpy('getSelectedNotebookStore')
                .and.returnValue(Observable.of(1));
            mockNotebookStoreService.getNotebookStore = jasmine.createSpy('getNotebookStore')
                .and.returnValue(Observable.of(new Array<Notebook>()));
            mockNotebookStoreService.getAllNotebook = jasmine.createSpy('getAllNotebook');
        });
    }));

    it('should initialize notebooks', async() => {
        fixture.detectChanges();

        expect(notebookListComponent.notebooks).toBeTruthy();
    });

    it('should subscribe to the notes store', async() => {
        fixture.detectChanges();

        expect(mockNotebookStoreService.getNotebookStore).toHaveBeenCalled();
    });

    it('should subscribe to the selected notebook store', async() => {
        fixture.detectChanges();

        expect(mockNotebookStoreService.getSelectedNotebookStore).toHaveBeenCalled();
    });

    it('should subscribe to the notebook store', async() => {
        fixture.detectChanges();

        expect(mockNotebookStoreService.getNotebookStore).toHaveBeenCalled();
    });

    it('should retrieve all the notebook', async() => {
        fixture.detectChanges();

        expect(mockNotebookStoreService.getAllNotebook).toHaveBeenCalled();
    });

    describe('isNotebookSelected', () => {
        it('should return true if selected notebook id is greater than 0', async() => {
            mockNotebookStoreService.getSelectedNotebookStore = jasmine.createSpy('getSelectedNotebookStore')
                .and.returnValue(Observable.of(1));

            fixture.detectChanges();

            expect(notebookListComponent.isNotebookSelected()).toBeTruthy();
        });

        it('should return false if selected notebook id is equal to 0', async() => {
            mockNotebookStoreService.getSelectedNotebookStore = jasmine.createSpy('getSelectedNotebookStore')
                .and.returnValue(Observable.of(0));

            fixture.detectChanges();

            expect(notebookListComponent.isNotebookSelected()).toBeFalsy();
        });

        it('should return false if selected notebook id is less than 0', async() => {
            mockNotebookStoreService.getSelectedNotebookStore = jasmine.createSpy('getSelectedNotebookStore')
                .and.returnValue(Observable.of(-1));

            fixture.detectChanges();

            expect(notebookListComponent.isNotebookSelected()).toBeFalsy();
        });
    });

    describe('notebookClick tests', () => {
        it('should set the selected notebook store based on the notebookId selected', async() => {
            mockNotebookStoreService.setSelectedNotebook = jasmine.createSpy('setSelectedNotebook');
            const expectedNotebookId = 1;

            notebookListComponent.notebookClick(expectedNotebookId);

            expect(mockNotebookStoreService.setSelectedNotebook).toHaveBeenCalledWith(expectedNotebookId);
        });
    });

    describe('addNewNotebookClick tests', () => {
        it('should set createMode flag to true', () => {
            notebookListComponent.addNewNotebookClick();

            expect(notebookListComponent.createMode).toBeTruthy();
        });
    });

    describe('createNotebookClick tests', () => {
        it('should call notebook store service to add the notebook', async() => {
            mockNotebookStoreService.addNotebook = jasmine.createSpy('addNotebook');

            notebookListComponent.createNotebookClick('test');

            expect(mockNotebookStoreService.addNotebook).toHaveBeenCalled();
        });

        it('should set createMode flag to false', async() => {
            notebookListComponent.createNotebookClick('test');

            expect(notebookListComponent.createMode).toBeFalsy();
        });
    });

    describe('cancelCreateNotebookClick tests', () => {
        it('should set createMode flag to false', () => {
            notebookListComponent.cancelCreateNotebookClick();

            expect(notebookListComponent.createMode).toBeFalsy();
        });
    });

    describe('deleteNotebookClick tests', async() => {
        it('should call notebook store service to delete the notebook', async() => {
            mockNotebookStoreService.deleteNotebook = jasmine.createSpy('deleteNotebook');

            fixture.detectChanges();
            notebookListComponent.deleteNotebookClick();

            expect(mockNotebookStoreService.deleteNotebook).toHaveBeenCalled();
        });

        it('should redirect to main page after deletion', async() => {
            mockNotebookStoreService.deleteNotebook = jasmine.createSpy('deleteNotebook');

            fixture.detectChanges();
            notebookListComponent.deleteNotebookClick();

            expect(router.navigate).toHaveBeenCalledWith(['/']);
        });

        it('should not delete the notebook if there are no notebook selected', async() => {
            mockNotebookStoreService.getSelectedNotebookStore = jasmine.createSpy('getSelectedNotebookStore')
                .and.returnValue(Observable.of(0));
            mockNotebookStoreService.deleteNotebook = jasmine.createSpy('deleteNotebook');

            fixture.detectChanges();
            notebookListComponent.deleteNotebookClick();

            expect(mockNotebookStoreService.deleteNotebook).toHaveBeenCalledTimes(0);
        });
    });
});
