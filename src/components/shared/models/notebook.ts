import { Note } from './note';

export class Notebook {
    id: number;
    title: string;

    constructor(title: string) {
        this.title = title;
    }
}
