import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const notebooks = [
      { id: 1, title: 'Notebook 1' }
    ];
    const notes = [
      { id: 1, notebookId: 1, text: 'Notes 1-1' },
      { id: 2, notebookId: 1, text: 'Notebook Text 1' },
      { id: 3, notebookId: 1, text: 'Notebook Text 2' },
      { id: 4, notebookId: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. veritatis reiciendis quae non fuga molestias dolor, mollitia, culpa, fugiat voluptates aperiam excepturi.' },
      { id: 5, notebookId: 1, text: 'Suscipit ut provident quasi explicabo temporibus vero nemo atque' },
      { id: 6, notebookId: 1, text: 'Basic panel example' },
      { id: 7, notebookId: 1, text: 'Suscipit ut provident quasi explicabo temporibus vero nemo atque' },
      { id: 8, notebookId: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. veritatis reiciendis quae non fuga molestias dolor, mollitia, culpa, fugiat voluptates aperiam excepturi.' },
      { id: 9, notebookId: 1, text: 'Basic panel example' },
      { id: 10, notebookId: 1, text: 'Suscipit ut provident quasi explicabo temporibus vero nemo atque' },
      { id: 11, notebookId: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. veritatis reiciendis quae non fuga molestias dolor, mollitia, culpa, fugiat voluptates aperiam excepturi.' }
    ];

    return { notebooks, notes };
  }
}
