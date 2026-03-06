import React, { createContext, useContext, useState, ReactNode } from 'react';
import { vehicles as initialVehicles, Vehicle } from '@/data/mockData';

interface VehiclesContextType {
  vehicles: Vehicle[];
  addVehicle: (v: Omit<Vehicle, 'id' | 'healthScore' | 'status' | 'lastUpdate' | 'driver' | 'mileage'>) => void;
}

const VehiclesContext = createContext<VehiclesContextType | undefined>(undefined);

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([...initialVehicles]);

  const addVehicle = (v: Omit<Vehicle, 'id' | 'healthScore' | 'status' | 'lastUpdate' | 'driver' | 'mileage'>) => {
    const newVehicle: Vehicle = {
      id: `V${Date.now()}`,
      healthScore: 100,
      status: 'healthy',
      lastUpdate: 'Just now',
      driver: '',
      mileage: 0,
      ...v,
    };
    setVehicles((cur) => [...cur, newVehicle]);
  };

  return (
    <VehiclesContext.Provider value={{ vehicles, addVehicle }}>
      {children}
    </VehiclesContext.Provider>
  );
}

export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error('useVehicles must be used within VehiclesProvider');
  return ctx;
}
