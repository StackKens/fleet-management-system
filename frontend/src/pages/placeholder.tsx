import { Link } from 'wouter';
import { ArrowLeft, Construction, Route } from 'lucide-react';

type PlaceholderProps = {
  title: string;
  description: string;
  phase: string;
};

export default function Placeholder({ title, description, phase }: PlaceholderProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-76px)] max-w-[900px] items-start px-5 py-12 sm:px-8 sm:py-16">
      <section className="w-full border border-border bg-card">
        <div className="border-b border-border px-6 py-7 sm:px-8">
          <div className="mb-6 flex h-10 w-10 items-center justify-center bg-muted text-primary">
            <Construction className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{phase}</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-start gap-3">
            <Route className="mt-0.5 h-4 w-4 flex-none text-muted-foreground" strokeWidth={1.8} />
            <p className="max-w-lg text-xs leading-5 text-muted-foreground">This destination is reserved for the next implementation phase. The workspace navigation is active so the operating model can be reviewed end to end.</p>
          </div>
          <Link href="/dashboard" data-testid="link-return-dashboard" className="inline-flex h-9 flex-none items-center justify-center gap-2 border border-border px-3.5 text-xs font-semibold text-foreground hover:bg-muted">
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}