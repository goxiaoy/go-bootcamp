import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PlanSelector({ onSelect }: { onSelect: (count: number) => void }) {
  return (
    <Card className="glass">
      <CardHeader className="space-y-4 text-center">
        <Badge className="mx-auto w-fit" variant="secondary">
          六级冲刺
        </Badge>
        <CardTitle className="text-3xl">每日学习计划</CardTitle>
        <CardDescription>打开即学，离线也能背</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {[30, 50, 80].map((count) => (
          <Button
            key={count}
            size="lg"
            className="rounded-2xl text-lg"
            onClick={() => onSelect(count)}
          >
            每天 {count} 个
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
