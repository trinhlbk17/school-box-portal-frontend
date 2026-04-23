export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface StudentClass {
  id: string;
  name: string;
  grade: string | null;
  academicYear: string | null;
}

export interface Student {
  id: string;
  name: string;
  dateOfBirth: string | null;
  gender: Gender | null;
  classId: string;
  isActive: boolean;
  boxFolderId: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  class?: StudentClass;
}

export interface CreateStudentInput {
  name: string;
  classId: string;
  dateOfBirth?: string;
  gender?: Gender;
}

export type UpdateStudentInput = Partial<Omit<CreateStudentInput, "classId">>;

export interface TransferStudentInput {
  targetClassId: string;
}

export interface StudentListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}
