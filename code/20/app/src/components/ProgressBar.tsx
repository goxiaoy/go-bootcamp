import { Progress } from '@/components/ui/progress';

export function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const value = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>今日进度</span>
        <span>
          {current}/{total}
        </span>
      </div>
      <Progress value={value} />
    </div>
  );
}
