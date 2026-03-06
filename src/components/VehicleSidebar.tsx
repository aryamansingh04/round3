import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useVehicles } from '@/contexts/VehiclesContext';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';

export function VehicleSidebar() {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { vehicles, addVehicle } = useVehicles();
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newType, setNewType] = useState('');

  const filtered = vehicles.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.plate.toLowerCase().includes(search.toLowerCase()) ||
    v.id.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'critical': return 'bg-destructive';
      default: return 'bg-muted-foreground';
    }
  };

  if (collapsed) {
    return (
      <aside className="w-12 border-r border-border bg-sidebar flex flex-col items-center py-3 shrink-0">
        <button onClick={() => setCollapsed(false)} className="p-1.5 rounded hover:bg-sidebar-accent text-sidebar-foreground mb-4">
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="flex flex-col gap-2">
          {vehicles.slice(0, 6).map(v => (
            <Link key={v.id} to={`/vehicles/${v.id}`} title={v.name}>
              <div className={`h-3 w-3 rounded-full ${statusColor(v.status)} ${v.status === 'critical' ? 'pulse-critical' : ''}`} />
            </Link>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-60 border-r border-border bg-sidebar flex flex-col shrink-0 overflow-hidden">
      <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
        <span className="text-xs font-heading font-semibold text-sidebar-foreground uppercase tracking-wider">Vehicles</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddOpen(true)}
            className="p-1 rounded hover:bg-sidebar-accent text-sidebar-foreground"
            title="Add vehicle"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button onClick={() => setCollapsed(true)} className="p-1 rounded hover:bg-sidebar-accent text-sidebar-foreground">
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* add vehicle dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Vehicle</DialogTitle>
            <DialogDescription>Enter basic details for the new vehicle.</DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              addVehicle({ name: newName, plate: newPlate, type: newType });
              setNewName('');
              setNewPlate('');
              setNewType('');
              setAddOpen(false);
            }}
          >
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="w-full rounded border px-3 py-2"
            />
            <input
              type="text"
              placeholder="Plate"
              value={newPlate}
              onChange={(e) => setNewPlate(e.target.value)}
              required
              className="w-full rounded border px-3 py-2"
            />
            <input
              type="text"
              placeholder="Type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              required
              className="w-full rounded border px-3 py-2"
            />
            <DialogFooter>
              <button
                type="submit"
                className="w-full rounded-full bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--accent)))] px-4 py-2 text-sm font-semibold text-background"
              >
                Add
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search vehicles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-sidebar-accent text-sm rounded-md pl-7 pr-3 py-1.5 text-sidebar-foreground placeholder:text-muted-foreground border border-sidebar-border focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.map(v => {
          const isActive = location.pathname === `/vehicles/${v.id}`;
          return (
            <Link
              key={v.id}
              to={`/vehicles/${v.id}`}
              className={`block px-3 py-2.5 border-b border-sidebar-border/50 transition-colors ${
                isActive ? 'bg-sidebar-accent border-l-2 border-l-primary' : 'hover:bg-sidebar-accent/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${statusColor(v.status)} ${v.status === 'critical' ? 'pulse-critical' : ''}`} />
                <span className="text-sm font-medium text-sidebar-foreground truncate">{v.name}</span>
              </div>
              <div className="flex items-center justify-between mt-1 ml-4">
                <span className="text-xs text-muted-foreground">{v.plate}</span>
                <span className={`text-xs font-semibold ${
                  v.healthScore >= 80 ? 'text-success' : v.healthScore >= 50 ? 'text-warning' : 'text-destructive'
                }`}>{v.healthScore}%</span>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
