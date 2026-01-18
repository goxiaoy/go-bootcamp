import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanSelector } from '@/components/PlanSelector';
import { WordCard } from '@/components/WordCard';
import { NavigationBar } from '@/components/NavigationBar';
import { ProgressBar } from '@/components/ProgressBar';
import { buildTodayQueue, normalizeDate, type ProgressMap, type Word } from '@/lib/logic';
import { createLocalStore } from '@/lib/storage';
import { nextIndex, prevIndex } from '@/lib/navigation';

export default function App() {
  const store = useMemo(() => createLocalStore(), []);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [queue, setQueue] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [dailyCount, setDailyCount] = useState<number | null>(
    store.get<number | null>('dailyCount', null)
  );
  const [progress] = useState<ProgressMap>(store.get<ProgressMap>('progress', {}));

  useEffect(() => {
    let active = true;
    setStatus('loading');
    fetch('/data/words.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('词表加载失败');
        }
        return response.json();
      })
      .then((data: Word[]) => {
        if (!active) return;
        setWords(data);
        setStatus('ready');
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message || '词表加载失败');
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!words.length || !dailyCount) return;
    const today = normalizeDate(new Date());
    const { queue: todayQueue } = buildTodayQueue({
      words,
      progress,
      dailyCount,
      today,
    });
    setQueue(todayQueue);
    setIndex(0);
    setShowMeaning(false);
    setShowExample(false);
  }, [words, dailyCount, progress]);

  const currentWord = queue[index];
  const canPrev = index > 0;
  const canNext = index < queue.length - 1;

  const handlePlanSelect = (count: number) => {
    setDailyCount(count);
    store.set('dailyCount', count);
  };

  const handlePrev = () => {
    if (!queue.length) return;
    setIndex((current) => prevIndex(current, queue.length));
    setShowMeaning(false);
    setShowExample(false);
  };

  const handleNext = () => {
    if (!queue.length) return;
    setIndex((current) => nextIndex(current, queue.length));
    setShowMeaning(false);
    setShowExample(false);
  };

  const handleRetry = () => {
    setError('');
    setStatus('loading');
    fetch('/data/words.json')
      .then((response) => response.json())
      .then((data: Word[]) => {
        setWords(data);
        setStatus('ready');
      })
      .catch(() => {
        setError('词表加载失败');
        setStatus('error');
      });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
          Vocab Lab
        </p>
        <h1 className="text-4xl">口袋背单词</h1>
        <p className="text-sm text-muted-foreground">
          轻量、离线、每天坚持一点点
        </p>
      </header>

      {status === 'error' && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>词表加载失败</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={handleRetry}>重新加载</Button>
          </CardContent>
        </Card>
      )}

      {status === 'loading' && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>正在准备词表</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            请稍等，马上开始。
          </CardContent>
        </Card>
      )}

      {status === 'ready' && !dailyCount && <PlanSelector onSelect={handlePlanSelect} />}

      {status === 'ready' && dailyCount && (
        <section className="space-y-5">
          <ProgressBar
            current={queue.length ? index + 1 : 0}
            total={queue.length}
          />

          {currentWord ? (
            <WordCard
              word={currentWord}
              showMeaning={showMeaning}
              showExample={showExample}
            />
          ) : (
            <Card className="glass">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                今日队列为空，稍后再来。
              </CardContent>
            </Card>
          )}

          <div className="grid gap-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <Button size="lg" onClick={() => setShowMeaning(true)}>
                显示释义
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setShowExample(true)}
              >
                显示例句
              </Button>
            </div>
            <NavigationBar
              canPrev={canPrev}
              canNext={canNext}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        </section>
      )}
    </main>
  );
}
