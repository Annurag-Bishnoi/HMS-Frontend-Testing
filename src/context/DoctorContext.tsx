import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Doctor } from "../types/doctor";
import { doctors as mockDoctors } from "../data/doctor";

type DoctorContextProps = {
  doctors: Doctor[];
  addDoctor: (doc: Doctor) => void;
  updateDoctor: (doc: Doctor) => void;
  deleteDoctor: (id: number) => void;
  getDoctorById: (id: number) => Doctor | undefined;
};

const DoctorContext = createContext<DoctorContextProps | undefined>(undefined);
export const useDoctorContext = () => {
  const ctx = useContext(DoctorContext);
  if (!ctx) throw new Error("useDoctorContext must be used within DoctorProvider");
  return ctx;
};

export const DoctorProvider = ({ children }: { children: ReactNode }) => {
  const storageKey = "hms-doctors";
  const initialDoctors: Doctor[] = (() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved) as Doctor[];
      } catch {
        console.warn("Unable to parse stored doctors, using mock data.");
      }
    }
    return mockDoctors;
  })();

  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(doctors));
  }, [doctors]);

  const addDoctor = (doc: Doctor) => {
    const newId = doctors.length ? Math.max(...doctors.map(d => d.id)) + 1 : 1;
    setDoctors([...doctors, { ...doc, id: newId }]);
  };

  const updateDoctor = (doc: Doctor) => {
    setDoctors(doctors.map(d => (d.id === doc.id ? doc : d)));
  };

  const deleteDoctor = (id: number) => {
    setDoctors(doctors.filter(d => d.id !== id));
  };

  const getDoctorById = (id: number) => doctors.find(d => d.id === id);

  return (
    <DoctorContext.Provider value={{ doctors, addDoctor, updateDoctor, deleteDoctor, getDoctorById }}>
      {children}
    </DoctorContext.Provider>
  );
};
