import { Bell, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications, useMarkNotificationRead } from '@/hooks/use-fleet-data';

export default function Notifications() {
  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationRead();

  const handleMarkRead = (id: string) => {
    markRead.mutate(id);
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <section className="mb-7 border-b border-border pb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Notifications</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Your Notifications</h2>
        <p className="mt-2 text-sm text-muted-foreground">Stay updated on your assignments and requests</p>
      </section>

      <section className="border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">All Notifications</h3>
          <span className="text-xs text-muted-foreground">{notifications?.length ?? 0} notifications</span>
        </div>
        <div className="divide-y divide-border">
          {notifications?.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
              <p className="mt-4 text-sm text-muted-foreground">No notifications at this time.</p>
            </div>
          ) : (
            notifications?.map((notification) => (
              <div key={notification.id} className="flex items-start justify-between px-5 py-4">
                <div className="flex items-start gap-3">
                  {!notification.read && (
                    <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-primary" aria-label="Unread" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'font-semibold text-foreground'}`}>
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{notification.timestamp}</p>
                  </div>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkRead(notification.id)}
                    className="flex-none"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark read
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
