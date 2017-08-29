import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { Notebook } from '../models/notebook';
import { NotebookSelectedOperation } from '../operations/notebook-selected.operation';
import { NotebookService } from '../services/notebook.service';


/* Client storage for the notebook objects */
@Injectable()
export class NotebookStoreService {
    private selectedNotebookStoreSubject: BehaviorSubject<NotebookSelectedOperation> =
        new BehaviorSubject(new NotebookSelectedOperation(false, 0));

    private notebookStoreSubject: BehaviorSubject<Notebook[]> = new BehaviorSubject(new Array<Notebook>());
    private notebookStorage: Notebook[] = new Array<Notebook>();

    constructor(private notebookService: NotebookService) { }

    getSelectedNotebookStore(): Observable<NotebookSelectedOperation> {
        return this.selectedNotebookStoreSubject.asObservable();
    }

    getNotebookStore(): Observable<Notebook[]> {
        return this.notebookStoreSubject.asObservable();
    }

    setSelectedNotebook(notebookId: number): void {
        this.selectedNotebookStoreSubject.next(new NotebookSelectedOperation(true, notebookId));
    }

    addNotebook(newNotebook: Notebook): void {
        this.notebookService.addNotebook(newNotebook).subscribe((notebook) => {
            this.notebookStorage.push(notebook);
            this.notebookStoreSubject.next(this.deepCopy(this.notebookStorage));
        });
    }

    getAllNotebook(): void {
        this.notebookService.getAllNotebook().subscribe((notebooks) => {
            this.notebookStorage = notebooks;
            this.notebookStoreSubject.next(this.deepCopy(this.notebookStorage));
        });
    }

    updateNotebook(updatedNotebook: Notebook): void {
         this.notebookService.updateNotebook(updatedNotebook).subscribe((notebook) => {
            this.notebookStorage.forEach((item, index) => {
                if (this.notebookStorage[index].id === notebook.id) {
                    this.notebookStorage[index] = notebook;
                }
            });

            this.notebookStoreSubject.next(this.deepCopy(this.notebookStorage));
        });
    }

    deleteNotebook(notebookId: number): void {
         this.notebookService.deleteNotebook(notebookId).subscribe(() => {
            this.notebookStorage.forEach((item, index) => {
                if (this.notebookStorage[index].id === notebookId) {
                    this.notebookStorage.splice(index, 1);
                }
            });

            this.notebookStoreSubject.next(this.deepCopy(this.notebookStorage));
        });
    }

    private deepCopy(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }
}
