"use client";
import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { API_URL, apiFetch } from "@/lib/api";

import {
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Pencil,
  Trash2,
  KeyRound,
  UserPlus,
} from "lucide-react";

interface Employee {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}
interface EmployeeForm {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface EditForm {
  name: string;
  phone: string;
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}
interface EmployeeFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
interface EditFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  showStrength = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  showStrength?: boolean;
}) {
  const [show, setShow] = useState(false);
  const getStrength = () => {
    if (!value) return null;
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    if (score <= 2)
      return {
        label: "Weak",
        color: "bg-red-400",
        width: "w-1/3",
        textColor: "text-red-500",
      };
    if (score <= 3)
      return {
        label: "Fair",
        color: "bg-yellow-400",
        width: "w-2/3",
        textColor: "text-yellow-600",
      };
    return {
      label: "Strong",
      color: "bg-brand-500",
      width: "w-full",
      textColor: "text-brand-600",
    };
  };
  const strength = showStrength ? getStrength() : null;
  return (
    <div>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {showStrength && value && strength && (
        <div className="mt-2">
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
            />
          </div>
          <p className={`text-xs mt-1 ${strength.textColor}`}>
            Strength: {strength.label}
          </p>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function validateAddForm(form: EmployeeForm): EmployeeFormErrors {
  const e: EmployeeFormErrors = {};
  if (!form.name.trim()) e.name = "Full name is required.";
  const digits = form.phone.replace(/\D/g, "");
  if (!form.phone.trim()) e.phone = "Phone number is required.";
  else if (digits.length < 10 || digits.length > 13)
    e.phone = "Enter a valid phone number.";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) e.email = "Email is required.";
  else if (!emailRe.test(form.email)) e.email = "Enter a valid email address.";
  if (!form.password) e.password = "Password is required.";
  else if (form.password.length < 8) e.password = "Must be at least 8 characters.";
  else if (!/[A-Z]/.test(form.password))
    e.password = "Must contain at least one uppercase letter.";
  else if (!/[0-9]/.test(form.password))
    e.password = "Must contain at least one number.";
  else if (!/[^A-Za-z0-9]/.test(form.password))
    e.password = "Must contain at least one special character.";
  if (!form.confirmPassword) e.confirmPassword = "Please confirm the password.";
  else if (form.confirmPassword !== form.password)
    e.confirmPassword = "Passwords do not match.";
  return e;
}

function validateEditForm(form: EditForm): EditFormErrors {
  const e: EditFormErrors = {};
  if (!form.name.trim()) e.name = "Full name is required.";
  const digits = form.phone.replace(/\D/g, "");
  if (!form.phone.trim()) e.phone = "Phone number is required.";
  else if (digits.length < 10 || digits.length > 13)
    e.phone = "Enter a valid phone number.";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) e.email = "Email is required.";
  else if (!emailRe.test(form.email)) e.email = "Enter a valid email address.";
  if (form.newPassword) {
    if (form.newPassword.length < 8)
      e.newPassword = "Must be at least 8 characters.";
    else if (!/[A-Z]/.test(form.newPassword))
      e.newPassword = "Must contain an uppercase letter.";
    else if (!/[0-9]/.test(form.newPassword))
      e.newPassword = "Must contain a number.";
    else if (!/[^A-Za-z0-9]/.test(form.newPassword))
      e.newPassword = "Must contain a special character.";
    if (!form.confirmNewPassword)
      e.confirmNewPassword = "Please confirm the new password.";
    else if (form.confirmNewPassword !== form.newPassword)
      e.confirmNewPassword = "Passwords do not match.";
  }
  return e;
}

const emptyAdd: EmployeeForm = {
  name: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const emptyEdit: EditForm = {
  name: "",
  phone: "",
  email: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addServerError, setAddServerError] = useState("");
  const [addForm, setAddForm] = useState<EmployeeForm>(emptyAdd);
  const [addErrors, setAddErrors] = useState<EmployeeFormErrors>({});
  const [addTouched, setAddTouched] = useState<Record<string, boolean>>({});

  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyEdit);
  const [editErrors, setEditErrors] = useState<EditFormErrors>({});
  const [editTouched, setEditTouched] = useState<Record<string, boolean>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editServerError, setEditServerError] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setFetchLoading(true);
    setFetchError("");
    try {
      const res = await apiFetch(`${API_URL}/admin/users?role=EMPLOYEE&limit=100`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmployees(data.users ?? []);
      setTotalEmployees(data.meta?.total ?? 0);
    } catch {
      setFetchError("Could not load employees. Please refresh the page.");
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleToggleActive = async (id: number) => {
    setTogglingId(id);
    try {
      const res = await apiFetch(`${API_URL}/admin/users/${id}/toggle`,
        { method: "PATCH", credentials: "include" },
      );
      if (!res.ok) throw new Error();
      fetchEmployees();
    } catch {
      alert("Failed to update employee status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleAddChange = (field: keyof EmployeeForm, value: string) => {
    const updated = { ...addForm, [field]: value };
    setAddForm(updated);
    if (addTouched[field])
      setAddErrors((p) => ({ ...p, [field]: validateAddForm(updated)[field] }));
    if (field === "password" && addTouched["confirmPassword"])
      setAddErrors((p) => ({
        ...p,
        confirmPassword: validateAddForm(updated).confirmPassword,
      }));
  };
  const handleAddBlur = (field: keyof EmployeeForm) => {
    setAddTouched((p) => ({ ...p, [field]: true }));
    setAddErrors((p) => ({ ...p, [field]: validateAddForm(addForm)[field] }));
  };
  const handleAddClose = () => {
    setShowAddForm(false);
    setAddForm(emptyAdd);
    setAddErrors({});
    setAddTouched({});
    setAddServerError("");
  };
  const handleAddSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setAddServerError("");
    setAddTouched({
      name: true,
      phone: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    const errs = validateAddForm(addForm);
    setAddErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setAddLoading(true);
    try {
      const { confirmPassword, ...remaining_data } = addForm;
      const res = await apiFetch(`${API_URL}/admin/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(remaining_data),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddServerError(data.message || "Failed to add employee.");
        return;
      }
      handleAddClose();
      fetchEmployees();
    } catch {
      setAddServerError("Unable to connect to server.");
    } finally {
      setAddLoading(false);
    }
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setEditForm({
      name: emp.name,
      phone: emp.phone ?? "",
      email: emp.email ?? "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setEditErrors({});
    setEditTouched({});
    setEditServerError("");
    setShowPasswordSection(false);
    setShowEditForm(true);
  };
  const handleEditChange = (field: keyof EditForm, value: string) => {
    const updated = { ...editForm, [field]: value };
    setEditForm(updated);
    if (editTouched[field])
      setEditErrors((p) => ({
        ...p,
        [field]: validateEditForm(updated)[field],
      }));
    if (field === "newPassword" && editTouched["confirmNewPassword"])
      setEditErrors((p) => ({
        ...p,
        confirmNewPassword: validateEditForm(updated).confirmNewPassword,
      }));
  };
  const handleEditBlur = (field: keyof EditForm) => {
    setEditTouched((p) => ({ ...p, [field]: true }));
    setEditErrors((p) => ({
      ...p,
      [field]: validateEditForm(editForm)[field],
    }));
  };
  const handleEditClose = () => {
    setShowEditForm(false);
    setEditingEmployee(null);
    setEditForm(emptyEdit);
    setEditErrors({});
    setEditTouched({});
    setEditServerError("");
    setShowPasswordSection(false);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditServerError("");
    const touch: Record<string, boolean> = {
      name: true,
      phone: true,
      email: true,
    };
    if (showPasswordSection) {
      touch.newPassword = true;
      touch.confirmNewPassword = true;
    }
    setEditTouched(touch);
    const errs = validateEditForm(editForm);
    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setEditLoading(true);
    try {
      const payload: any = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
      };
      if (showPasswordSection && editForm.newPassword)
        payload.password = editForm.newPassword;
      const res = await apiFetch(`${API_URL}/admin/employees/${editingEmployee!.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setEditServerError(data.message || "Failed to update employee.");
        return;
      }
      handleEditClose();
      fetchEmployees();
    } catch {
      setEditServerError("Unable to connect to server.");
    } finally {
      setEditLoading(false);
    }
  };

  const openDeleteModal = (emp: Employee) => {
    setDeletingEmployee(emp);
    setShowDeleteConfirm(true);
  };
  const handleDeleteClose = () => {
    setShowDeleteConfirm(false);
    setDeletingEmployee(null);
  };
  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    setDeleteLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/admin/employees/${deletingEmployee.id}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) throw new Error();
      handleDeleteClose();
      fetchEmployees();
    } catch {
      alert("Failed to delete employee.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    {
      key: "email",
      header: "Email",
      render: (_: any, row: Employee) => row.email ?? "—",
    },
    {
      key: "phone",
      header: "Phone",
      render: (_: any, row: Employee) => row.phone ?? "—",
    },
    {
      key: "created_at",
      header: "Joined",
      render: (v: string) =>
        new Date(v).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "is_active",
      header: "Status",
      render: (v: boolean) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${v ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${v ? "bg-green-500" : "bg-red-500"}`}
          />
          {v ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: Employee) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openEditModal(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => handleToggleActive(row.id)}
            disabled={togglingId === row.id}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${row.is_active ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100" : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"}`}
          >
            {togglingId === row.id ? (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : row.is_active ? (
              <>
                <UserX size={12} /> Block
              </>
            ) : (
              <>
                <UserCheck size={12} /> Unblock
              </>
            )}
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      ),
    },
  ];

  const pwdRules = (pwd: string) => [
    { label: "At least 8 characters", ok: pwd.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(pwd) },
    { label: "One number", ok: /[0-9]/.test(pwd) },
    { label: "One special character", ok: /[^A-Za-z0-9]/.test(pwd) },
  ];

  return (
    <>
      <Navbar title="Employees Management" subtitle="View and manage all employees" />

      <div className="p-5 lg:p-8">
        <div className="mb-5 flex justify-end">
          <Button onClick={() => setShowAddForm(true)} size="sm">
            <UserPlus size={15} /> Add Employee
          </Button>
        </div>

        <Card>
          <h2 className="font-semibold text-gray-900 mb-5">
            All Employees{" "}
            {!fetchLoading && (
              <span className="text-gray-400 font-normal">
                ({totalEmployees})
              </span>
            )}
          </h2>

          {fetchLoading && (
            <div className="py-12 text-center text-gray-400">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading employees…</p>
            </div>
          )}
          {fetchError && !fetchLoading && (
            <div className="py-6 text-center text-red-500 text-sm">
              {fetchError}
              <button
                onClick={fetchEmployees}
                className="ml-2 text-brand-600 underline"
              >
                Retry
              </button>
            </div>
          )}
          {!fetchLoading && !fetchError && employees.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">
              No employees found.
            </div>
          )}
          {!fetchLoading && !fetchError && employees.length > 0 && (
            <Table columns={columns} data={employees} />
          )}
        </Card>
      </div>

      {/* Add modal */}
      < Modal
        isOpen={showAddForm}
        onClose={handleAddClose}
        title="Add New Employee"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4" noValidate>
          {addServerError && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {addServerError}
            </div>
          )}
          <div>
            <Input
              label="Full Name"
              placeholder="Enter employee name"
              value={addForm.name}
              onChange={(e) => handleAddChange("name", e.target.value)}
              onBlur={() => handleAddBlur("name")}
              required
            />
            {addErrors.name && (
              <p className="mt-1 text-xs text-red-500">{addErrors.name}</p>
            )}
          </div>
          <div>
            <Input
              type="tel"
              label="Phone"
              placeholder="Enter phone number"
              value={addForm.phone}
              onChange={(e) => handleAddChange("phone", e.target.value)}
              onBlur={() => handleAddBlur("phone")}
              required
            />
            {addErrors.phone && (
              <p className="mt-1 text-xs text-red-500">{addErrors.phone}</p>
            )}
          </div>
          <div>
            <Input
              type="email"
              label="Email"
              placeholder="Enter email address"
              value={addForm.email}
              onChange={(e) => handleAddChange("email", e.target.value)}
              onBlur={() => handleAddBlur("email")}
              required
            />
            {addErrors.email && (
              <p className="mt-1 text-xs text-red-500">{addErrors.email}</p>
            )}
          </div>
          <PasswordInput
            label="Password"
            placeholder="Set initial password"
            value={addForm.password}
            onChange={(e) => handleAddChange("password", e.target.value)}
            onBlur={() => handleAddBlur("password")}
            error={addErrors.password}
            showStrength
          />
          <div>
            <PasswordInput
              label="Confirm Password"
              placeholder="Re-enter password"
              value={addForm.confirmPassword}
              onChange={(e) =>
                handleAddChange("confirmPassword", e.target.value)
              }
              onBlur={() => handleAddBlur("confirmPassword")}
              error={addErrors.confirmPassword}
            />
            {!addErrors.confirmPassword &&
              addForm.confirmPassword &&
              addForm.confirmPassword === addForm.password && (
                <p className="mt-1 text-xs text-brand-600">✓ Passwords match</p>
              )}
          </div>
          <ul className="text-xs space-y-1 bg-gray-50 rounded-lg p-3">
            {pwdRules(addForm.password).map((r, i) => (
              <li key={i} className={r.ok ? "text-brand-600" : "text-gray-400"}>
                {r.ok ? "✓" : "○"} {r.label}
              </li>
            ))}
          </ul>
          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={addLoading}>
              {addLoading ? "Adding…" : "Add Employee"}
            </Button>
            <Button
              type="button"
              variant="outline_danger"
              onClick={handleAddClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal >

      {/* Edit modal */}
      < Modal
        isOpen={showEditForm}
        onClose={handleEditClose}
        title="Edit Employee"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4" noValidate>
          {editServerError && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {editServerError}
            </div>
          )}
          <div>
            <Input
              label="Full Name"
              placeholder="Enter name"
              value={editForm.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
              onBlur={() => handleEditBlur("name")}
              required
            />
            {editErrors.name && (
              <p className="mt-1 text-xs text-red-500">{editErrors.name}</p>
            )}
          </div>
          <div>
            <Input
              type="tel"
              label="Phone"
              placeholder="Enter phone"
              value={editForm.phone}
              onChange={(e) => handleEditChange("phone", e.target.value)}
              onBlur={() => handleEditBlur("phone")}
              required
            />
            {editErrors.phone && (
              <p className="mt-1 text-xs text-red-500">{editErrors.phone}</p>
            )}
          </div>
          <div>
            <Input
              type="email"
              label="Email"
              placeholder="Enter email"
              value={editForm.email}
              onChange={(e) => handleEditChange("email", e.target.value)}
              onBlur={() => handleEditBlur("email")}
              required
            />
            {editErrors.email && (
              <p className="mt-1 text-xs text-red-500">{editErrors.email}</p>
            )}
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setShowPasswordSection((p) => !p);
                if (showPasswordSection) {
                  setEditForm((p) => ({
                    ...p,
                    newPassword: "",
                    confirmNewPassword: "",
                  }));
                  setEditErrors((p) => ({
                    ...p,
                    newPassword: undefined,
                    confirmNewPassword: undefined,
                  }));
                }
              }}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
            >
              <span className="flex items-center gap-2">
                <KeyRound size={14} className="text-gray-500" /> Change Password{" "}
                <span className="text-xs font-normal text-gray-400">
                  (optional)
                </span>
              </span>
              <span
                className={`text-gray-400 text-xs transition-transform ${showPasswordSection ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
            {showPasswordSection && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
                  value={editForm.newPassword}
                  onChange={(e) =>
                    handleEditChange("newPassword", e.target.value)
                  }
                  onBlur={() => handleEditBlur("newPassword")}
                  error={editErrors.newPassword}
                  showStrength
                />
                <div>
                  <PasswordInput
                    label="Confirm New Password"
                    placeholder="Re-enter new password"
                    value={editForm.confirmNewPassword}
                    onChange={(e) =>
                      handleEditChange("confirmNewPassword", e.target.value)
                    }
                    onBlur={() => handleEditBlur("confirmNewPassword")}
                    error={editErrors.confirmNewPassword}
                  />
                  {!editErrors.confirmNewPassword &&
                    editForm.confirmNewPassword &&
                    editForm.confirmNewPassword === editForm.newPassword && (
                      <p className="mt-1 text-xs text-brand-600">
                        ✓ Passwords match
                      </p>
                    )}
                </div>
                <ul className="text-xs space-y-1 bg-gray-50 rounded-lg p-3">
                  {pwdRules(editForm.newPassword).map((r, i) => (
                    <li
                      key={i}
                      className={r.ok ? "text-brand-600" : "text-gray-400"}
                    >
                      {r.ok ? "✓" : "○"} {r.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={editLoading}>
              {editLoading ? "Saving…" : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={handleEditClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal >

      {/* Delete modal */}
      < Modal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteClose}
        title="Delete Employee"
      // size="sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
            <Trash2 size={18} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Delete{" "}
                <span className="font-bold">{deletingEmployee?.name}</span>?
              </p>
              <p className="text-xs text-red-600 mt-1">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deleteLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 size={14} /> Delete
                </>
              )}
            </button>
            <Button type="button" variant="outline" onClick={handleDeleteClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal >
    </>
  );
}
