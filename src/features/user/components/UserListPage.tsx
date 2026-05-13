import { useState, useCallback } from "react";
import { UserPlus, Filter, Pencil, Trash2, KeyRound, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/shared/components/PageHeader";
import { DataTable } from "@/shared/components/DataTable";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ROLES } from "@/shared/constants/roles";
import { useAuthStore } from "@/features/auth";
import { useUsers } from "@/features/user/hooks/useUsers";
import {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
  useRegeneratePassword,
} from "@/features/user/hooks/useUserMutations";
import { CreateUserDialog, EditUserDialog } from "@/features/user/components/UserForm";
import { PasswordRevealDialog } from "@/features/user/components/PasswordRevealDialog";
import type { AdminUser, UserQueryParams } from "@/features/user/types/user.types";
import type { ColumnDef } from "@/shared/types/dataTable.types";

const ROLE_LABELS: Record<string, string> = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.TEACHER]: "Teacher",
  [ROLES.STUDENT]: "Student",
  [ROLES.PROTECTOR]: "Protector",
};

const ROLE_COLORS: Record<string, string> = {
  [ROLES.ADMIN]: "bg-red-100 text-red-700",
  [ROLES.TEACHER]: "bg-blue-100 text-blue-700",
  [ROLES.STUDENT]: "bg-green-100 text-green-700",
  [ROLES.PROTECTOR]: "bg-purple-100 text-purple-700",
};

const PAGE_SIZE = 10;

export function UserListPage() {
  const currentUser = useAuthStore((s) => s.user);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Dialogs state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminUser | null>(null);
  const [revealPassword, setRevealPassword] = useState<{
    password: string;
    userName?: string;
  } | null>(null);

  const queryParams: UserQueryParams = {
    search: search || undefined,
    role: (roleFilter as AdminUser["role"]) || undefined,
    isActive:
      statusFilter === "active"
        ? true
        : statusFilter === "inactive"
          ? false
          : undefined,
    page,
    limit: PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  const { data, isLoading, error } = useUsers(queryParams);
  const users = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const regeneratePassword = useRegeneratePassword();

  const handleSearchChange = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleFilterChange = () => setPage(1);

  const handleCreate = async (payload: {
    email: string;
    name: string;
    role: string;
    password: string;
    plainPassword: string;
  }) => {
    try {
      await createUser.mutateAsync({
        email: payload.email,
        name: payload.name,
        role: payload.role as AdminUser["role"],
        password: payload.password,
      });
      setIsCreateOpen(false);
      setRevealPassword({ password: payload.plainPassword, userName: payload.name });
      // Toast success is handled in the mutation hook
    } catch (error) {
      console.error("Failed to create user", error);
    }
  };

  const handleUpdate = async (values: { email: string; name: string }) => {
    if (!editTarget) return;
    try {
      await updateUser.mutateAsync({ id: editTarget.id, data: values });
      setEditTarget(null);
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await deactivateUser.mutateAsync(deactivateTarget.id);
      setDeactivateTarget(null);
    } catch (error) {
      console.error("Failed to deactivate user", error);
    }
  };

  const handleActivate = (user: AdminUser) => {
    activateUser.mutate(user.id);
  };

  const handleRegeneratePassword = async (user: AdminUser) => {
    try {
      const result = await regeneratePassword.mutateAsync(user.id);
      setRevealPassword({ password: result.temporaryPassword, userName: user.name });
    } catch (error) {
      console.error("Failed to regenerate password", error);
    }
  };

  const columns: ColumnDef<AdminUser>[] = [
    {
      id: "name",
      header: "User",
      cell: (row) => (
        <div>
          <p className="text-sm font-medium text-neutral-900">{row.name}</p>
          <p className="text-xs text-neutral-500">{row.email}</p>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[row.role] ?? "bg-neutral-100 text-neutral-700"}`}
        >
          {ROLE_LABELS[row.role] ?? row.role}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            row.isActive
              ? "bg-green-100 text-green-700"
              : "bg-neutral-100 text-neutral-500"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${row.isActive ? "bg-green-500" : "bg-neutral-400"}`}
          />
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "createdAt",
      header: "Created",
      cell: (row) => (
        <span className="text-sm text-neutral-500">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: (row) => {
        const isSelf = currentUser?.id === row.id;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditTarget(row)}
              aria-label={`Edit ${row.name}`}
              title="Edit user"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            {row.isActive ? (
              <Button
                variant="ghost"
                size="sm"
                disabled={isSelf}
                onClick={() => setDeactivateTarget(row)}
                aria-label={`Deactivate ${row.name}`}
                title={isSelf ? "Cannot deactivate yourself" : "Deactivate user"}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              >
                <UserX className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleActivate(row)}
                aria-label={`Activate ${row.name}`}
                title="Activate user"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <UserCheck className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRegeneratePassword(row)}
              disabled={regeneratePassword.isPending}
              aria-label={`Regenerate password for ${row.name}`}
              title="Regenerate password"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <KeyRound className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={isSelf}
              onClick={() => setDeleteTarget(row)}
              aria-label={`Delete ${row.name}`}
              title={isSelf ? "Cannot delete yourself" : "Delete user"}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <ErrorAlert
        title="Failed to load users"
        message={(error as { message: string }).message}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage all user accounts in the system."
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="user-role-filter" className="text-xs whitespace-nowrap">
              Role
            </Label>
            <Select
              value={roleFilter}
              onValueChange={(val) => {
                setRoleFilter(val || "");
                handleFilterChange();
              }}
            >
              <SelectTrigger id="user-role-filter" className="w-36 h-8 text-sm">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All roles</SelectItem>
                {Object.entries(ROLE_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="user-status-filter" className="text-xs whitespace-nowrap">
              Status
            </Label>
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val || "");
                handleFilterChange();
              }}
            >
              <SelectTrigger id="user-status-filter" className="w-32 h-8 text-sm">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active filter badges */}
          {(roleFilter || statusFilter) && (
            <div className="flex items-center gap-1.5 ml-1">
              {roleFilter && (
                <Badge variant="secondary" className="gap-1 h-7">
                  {ROLE_LABELS[roleFilter]}
                  <button
                    className="ml-0.5 text-neutral-500 hover:text-neutral-700"
                    onClick={() => { setRoleFilter(""); handleFilterChange(); }}
                    aria-label="Clear role filter"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {statusFilter && (
                <Badge variant="secondary" className="gap-1 h-7">
                  {statusFilter === "active" ? "Active" : "Inactive"}
                  <button
                    className="ml-0.5 text-neutral-500 hover:text-neutral-700"
                    onClick={() => { setStatusFilter(""); handleFilterChange(); }}
                    aria-label="Clear status filter"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {!isLoading && users.length === 0 && !search && !roleFilter && !statusFilter ? (
        <EmptyState
          title="No users found"
          description="Get started by creating the first user account."
          icon={<UserPlus className="h-6 w-6 text-neutral-500" />}
          action={{ label: "Add User", onClick: () => setIsCreateOpen(true) }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          totalCount={total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onSearch={handleSearchChange}
          searchPlaceholder="Search by name or email..."
        />
      )}

      {/* Dialogs */}
      <CreateUserDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isPending={createUser.isPending}
      />

      <EditUserDialog
        isOpen={!!editTarget}
        user={editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        isPending={updateUser.isPending}
      />

      <ConfirmDialog
        isOpen={!!deactivateTarget}
        title="Deactivate User"
        description={`Are you sure you want to deactivate "${deactivateTarget?.name}"? They will not be able to log in until reactivated.`}
        confirmLabel="Deactivate"
        variant="destructive"
        isLoading={deactivateUser.isPending}
        onConfirm={handleConfirmDeactivate}
        onClose={() => setDeactivateTarget(null)}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete User"
        description={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteUser.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {revealPassword && (
        <PasswordRevealDialog
          isOpen={!!revealPassword}
          password={revealPassword.password}
          userName={revealPassword.userName}
          onClose={() => setRevealPassword(null)}
        />
      )}
    </div>
  );
}
