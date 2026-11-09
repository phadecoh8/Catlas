"use client";

import { useEffect, useMemo, useState } from "react";

type School = {
  id: string;
  name: string;
};

type Faculty = School & {
  school_id: string;
};

type Department = Faculty & {
  faculty_id: string;
};

type SchoolPickerProps = {
  schoolId: string;
  facultyId: string;
  departmentId: string;
  onSchoolChange: (value: string) => void;
  onFacultyChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
};

export function SchoolPicker({
  schoolId,
  facultyId,
  departmentId,
  onSchoolChange,
  onFacultyChange,
  onDepartmentChange,
}: SchoolPickerProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSchools() {
      try {
        const response = await fetch("/api/auth/schools", {
          cache: "no-store",
        });
        const result = (await response.json()) as {
          schools?: School[];
          faculties?: Faculty[];
          departments?: Department[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(result.error);
        }

        if (!active) return;
        setSchools(result.schools ?? []);
        setFaculties(result.faculties ?? []);
        setDepartments(result.departments ?? []);
      } catch {
        if (active) {
          setLoadError("School options are unavailable right now.");
        }
      }
    }

    void loadSchools();
    return () => {
      active = false;
    };
  }, []);

  const filteredFaculties = useMemo(
    () => faculties.filter((faculty) => faculty.school_id === schoolId),
    [faculties, schoolId],
  );
  const filteredDepartments = useMemo(
    () => departments.filter((department) => (
      department.faculty_id === facultyId &&
      department.school_id === schoolId
    )),
    [departments, facultyId, schoolId],
  );

  return (
    <>
      <label className="admin-login-field" htmlFor="signup-school">
        School
        <select
          autoComplete="organization"
          id="signup-school"
          onChange={(event) => onSchoolChange(event.target.value)}
          required
          value={schoolId}
        >
          <option value="">Choose your school</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-login-field" htmlFor="signup-faculty">
        Faculty
        <select
          id="signup-faculty"
          onChange={(event) => onFacultyChange(event.target.value)}
          required
          value={facultyId}
        >
          <option value="">Choose your faculty</option>
          {filteredFaculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-login-field" htmlFor="signup-department">
        Department
        <select
          id="signup-department"
          onChange={(event) => onDepartmentChange(event.target.value)}
          required
          value={departmentId}
        >
          <option value="">Choose your department</option>
          {filteredDepartments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </label>
      {loadError ? (
        <p className="admin-login-error" role="alert">{loadError}</p>
      ) : null}
      {!loadError && schools.length === 0 ? (
        <p className="auth-form-note">
          School options will appear once the school database is set up.
        </p>
      ) : null}
    </>
  );
}
