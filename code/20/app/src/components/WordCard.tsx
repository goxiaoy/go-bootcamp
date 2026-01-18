import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Word } from '@/lib/logic';

export function WordCard({
  word,
  showMeaning,
  showExample,
}: {
  word: Word;
  showMeaning: boolean;
  showExample: boolean;
}) {
  return (
    <Card className="glass">
      <CardContent className="space-y-4 pt-8 text-center">
        <div className="text-4xl font-semibold">{word.text}</div>
        {word.phonetic ? (
          <div className="text-sm text-muted-foreground">{word.phonetic}</div>
        ) : null}
        {word.pos ? (
          <Badge className="mx-auto" variant="secondary">
            {word.pos}
          </Badge>
        ) : null}
        {showMeaning && word.meaning ? (
          <div className="text-lg font-medium">{word.meaning}</div>
        ) : null}
        {showExample && word.example ? (
          <div className="text-sm text-muted-foreground">{word.example}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
