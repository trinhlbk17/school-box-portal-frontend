// Types
export type {
  Student,
  StudentClass,
  Gender,
  CreateStudentInput,
  UpdateStudentInput,
  TransferStudentInput,
  StudentListParams,
} from "./types/student.types";

// Schemas
export { studentSchema } from "./schemas/studentSchema";
export type { StudentFormValues } from "./schemas/studentSchema";

// API
export { studentApi } from "./api/studentApi";

// Hooks
export {
  studentKeys,
  useStudents,
  useStudent,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  useTransferStudent,
} from "./hooks/useStudents";

// Components
export { StudentListTab } from "./components/StudentListTab";
export { StudentFormSheet } from "./components/StudentFormSheet";

// Pages
export { StudentDetailPage } from "./pages/StudentDetailPage";
