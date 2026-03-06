import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AlertCard } from '@/components/AlertCard';
import { alerts as mockAlerts } from '@/data/mockData';
import type { Alert } from '@/data/mockData';

type SeverityFilter = 'all' | 'critical' | 'warning' | 'anomaly';

export default function AlertsPage() {
  const [alertList, setAlertList] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<SeverityFilter>('all');

  const filtered = filter === 'all' ? alertList : alertList.filter(a => a.severity === filter);

  const handleAcknowledge = (id: string) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const counts = {
    all: alertList.length,
    critical: alertList.filter(a => a.severity === 'critical').length,
    warning: alertList.filter(a => a.severity === 'warning').length,
    anomaly: alertList.filter(a => a.severity === 'anomaly').length,
  };

  const filterButtons: { key: SeverityFilter; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: 'bg-secondary text-secondary-foreground' },
    { key: 'critical', label: 'Critical', color: 'bg-destructive/20 text-destructive' },
    { key: 'warning', label: 'Warning', color: 'bg-warning/20 text-warning' },
    { key: 'anomaly', label: 'Anomaly', color: 'bg-anomaly/20 text-anomaly' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Alert Monitoring</h1>
          <p className="text-sm text-muted-foreground">Detected faults and abnormal events</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {filterButtons.map(fb => (
            <button
              key={fb.key}
              onClick={() => setFilter(fb.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                filter === fb.key ? fb.color + ' ring-1 ring-current' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
            >
              {fb.label} ({counts[fb.key]})
            </button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {filtered.map(alert => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
            ))}
            {filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center text-muted-foreground">
                No alerts match this filter.
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
