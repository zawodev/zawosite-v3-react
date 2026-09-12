export interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    coverUrl?: string;
}

export const books: Book[] = [
    { id: '1', title: 'Wiedźmin', author: 'Andrzej Sapkowski', price: 49.99 },
    { id: '2', title: '1984', author: 'George Orwell', price: 29.99 },
    { id: '3', title: 'Dune', author: 'Frank Herbert', price: 39.99 },
];
