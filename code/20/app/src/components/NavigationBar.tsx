import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function NavigationBar({
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        variant="outline"
        size="lg"
        className="flex-1 rounded-2xl"
        onClick={onPrev}
        disabled={!canPrev}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        上一个
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="flex-1 rounded-2xl"
        onClick={onNext}
        disabled={!canNext}
      >
        下一个
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
