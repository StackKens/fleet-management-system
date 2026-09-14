import { ArrowLeft, CircleAlert } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-76px)] max-w-[900px] items-start px-5 py-12 sm:px-8 sm:py-16">
      <section className="w-full border border-border bg-card p-7 sm:p-9">
        <CircleAlert className="mb-5 h-6 w-6 text-muted-foreground" strokeWidth={1.8} />
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Page not found</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">This destination does not exist.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Use the workspace navigation to return to an available operations area.</p>
        <Link href="/dashboard" data-testid="link-not-found-dashboard" className="mt-7 inline-flex h-9 items-center gap-2 border border-border px-3.5 text-xs font-semibold text-foreground hover:bg-muted">
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to dashboard
        </Link>
      </section>
    </div>
  );
}
