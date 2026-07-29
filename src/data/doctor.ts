import type { Doctor } from "../types/doctor";

export const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Rahul Sharma",
    email: "rahul.sharma@hospital.com",
    phone: "9876543210",
    department: "Cardiology",
    specialization: "Cardiologist",
    experience: 8,
    status: "Available",
  },

  {
    id: 2,
    name: "Dr. Priya Verma",
    email: "priya.verma@hospital.com",
    phone: "9876501234",
    department: "Neurology",
    specialization: "Neurologist",
    experience: 10,
    status: "Available",
  },

  {
    id: 3,
    name: "Dr. Amit Patel",
    email: "amit.patel@hospital.com",
    phone: "9876512345",
    department: "Orthopedics",
    specialization: "Orthopedic Surgeon",
    experience: 12,
    status: "On Leave",
  },

  {
    id: 4,
    name: "Dr. Sneha Gupta",
    email: "sneha.gupta@hospital.com",
    phone: "9876523456",
    department: "Pediatrics",
    specialization: "Pediatrician",
    experience: 6,
    status: "Available",
  },

  {
    id: 5,
    name: "Dr. Arjun Singh",
    email: "arjun.singh@hospital.com",
    phone: "9876534567",
    department: "Dermatology",
    specialization: "Dermatologist",
    experience: 9,
    status: "Available",
  },
];