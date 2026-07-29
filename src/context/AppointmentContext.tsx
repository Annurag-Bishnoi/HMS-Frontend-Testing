import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { Appointment } from "../types/appointment";
import { mockAppointments } from "../data/mockAppointments";

type AppointmentContextType = {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

export function AppointmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);

  return (
    <AppointmentContext.Provider
      value={{ appointments, setAppointments }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);

  if (!context) {
    throw new Error(
      "useAppointments must be used inside AppointmentProvider"
    );
  }

  return context;
}