// Pages
export { ClassDetailPage } from "@/features/class/pages/ClassDetailPage";
export { MyClassesPage } from "@/features/class/pages/MyClassesPage";

// Components
export { ClassFormSheet } from "@/features/class/components/ClassFormSheet";
export { TeacherListTab } from "@/features/class/components/TeacherListTab";
export { AssignTeacherDialog } from "@/features/class/components/AssignTeacherDialog";

// Hooks
export {
  classKeys,
  useClassesBySchool,
  useClass,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  useAssignTeacher,
  useRemoveTeacher,
} from "@/features/class/hooks/useClasses";
export { useTeacherUsers } from "@/features/class/hooks/useTeacherUsers";

// API
export { classApi } from "@/features/class/api/classApi";

// Types
export type {
  Class,
  ClassTeacher,
  CreateClassInput,
  UpdateClassInput,
  AssignTeacherInput,
} from "@/features/class/types/class.types";

// Schemas
export { classSchema } from "@/features/class/schemas/classSchema";
export type { ClassFormValues } from "@/features/class/schemas/classSchema";
