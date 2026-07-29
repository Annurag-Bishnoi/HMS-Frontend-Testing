export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  doctor: string;
  phone: string;
  department: string;
  status: string;
}

export const patients: Patient[] = [
  {
    id: "P001",
    name: "Rahul Sharma",
    age: 28,
    gender: "Male",
    doctor: "Dr. Amit",
    phone: "9876543210",
    department: "Cardiology",
    status: "Admitted",
  },
  {
    id: "P002",
    name: "Priya Singh",
    age: 35,
    gender: "Female",
    doctor: "Dr. Neha",
    phone: "9123456780",
    department: "Neurology",
    status: "Discharged",
  },
  {
    id: "P003",
    name: "Rohan Gupta",
    age: 42,
    gender: "Male",
    doctor: "Dr. Raj",
    phone: "9988776655",
    department: "Orthopedics",
    status: "Under Treatment",
  },
  {
    id: "P004",
    name: "Anjali Verma",
    age: 30,
    gender: "Female",
    doctor: "Dr. Mehta",
    phone: "9012345678",
    department: "Pediatrics",
    status: "Admitted",
  },
];