import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Notebook, NotebookStoreService } from '../shared/index';

@Component({
    selector: 'nb-notebook-list',
    templateUrl: './notebook-list.component.html',
    styleUrls: ['./notebook-list.component.css']
})
export class NotebookListComponent implements OnInit {
    selectedNotebookId: number;
    notebooks: Notebook[];
    createMode: boolean;

    constructor(private router: Router,
        private notebookStoreService: NotebookStoreService
    ) {
        this.notebooks = new Array<Notebook>();
        this.createMode = false;
    }

    ngOnInit(): void {
        this.notebookStoreService.getSelectedNotebookStore().subscribe((notebookId) => {
            this.selectedNotebookId = notebookId;
        });

        this.notebookStoreService.getNotebookStore().subscribe((notebooks) => {
            this.notebooks = notebooks;
        });

        this.notebookStoreService.getAllNotebook();
    }

    isNotebookSelected(): boolean {
        if (this.selectedNotebookId > 0) {
            return true;
        }

        return false;
    }

    notebookClick(notebookId: number) {
        this.notebookStoreService.setSelectedNotebook(notebookId);
    }

    addNewNotebookClick() {
        this.createMode = true;
    }

    createNotebookClick(notebookTitle: string) {
        this.notebookStoreService.addNotebook(new Notebook(notebookTitle));
        this.createMode = false;
    }

    cancelCreateNotebookClick() {
        this.createMode = false;
    }

    deleteNotebookClick() {
        if (this.isNotebookSelected()) {
            this.notebookStoreService.deleteNotebook(this.selectedNotebookId);
            this.router.navigateByUrl('/');
        }
    }
}
