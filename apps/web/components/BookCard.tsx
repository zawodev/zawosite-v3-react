import type { Book } from '@/lib/books';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';

export default function BookCard({ id, title, author, price, coverUrl }: Book) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {coverUrl && (
                    <img
                        src={coverUrl}
                        alt={title}
                        className="w-full h-40 object-cover rounded mb-3"
                    />
                )}
                <p className="text-muted-foreground">Autor: {author}</p>
                <p className="text-xl font-bold mt-2">{price} zł</p>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Kup teraz</Button>
            </CardFooter>
        </Card>
    );
}
