// Pages
export { SchoolListPage } from "@/features/school/pages/SchoolListPage";
export { SchoolDetailPage } from "@/features/school/pages/SchoolDetailPage";

// Components
export { SchoolFormSheet } from "@/features/school/components/SchoolFormSheet";

// Hooks
export {
  schoolKeys,
  useSchools,
  useSchool,
  useCreateSchool,
  useUpdateSchool,
  useDeleteSchool,
} from "@/features/school/hooks/useSchools";

// API
export { schoolApi } from "@/features/school/api/schoolApi";

// Types
export type {
  School,
  CreateSchoolInput,
  UpdateSchoolInput,
} from "@/features/school/types/school.types";

// Schemas
export { schoolSchema } from "@/features/school/schemas/schoolSchema";
export type { SchoolFormValues } from "@/features/school/schemas/schoolSchema";
