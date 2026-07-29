import { useState } from "react";

import PatientStats from "../../../components/admin/patients/PatientStats";
import PatientToolbar from "../../../components/admin/patients/PatientToolbar";
import PatientTable from "../../../components/admin/patients/PatientTable";

export default function PatientList() {

 const [search, setSearch] = useState("");

const [department, setDepartment] = useState("All");

const [status, setStatus] = useState("All");

  return (
    <div className="space-y-6">

      <PatientStats />

      <PatientToolbar
    search={search}
    setSearch={setSearch}
    department={department}
    setDepartment={setDepartment}
    status={status}
    setStatus={setStatus}
/>

<PatientTable
    search={search}
    
    status={status}
/>

    </div>
  );
}
