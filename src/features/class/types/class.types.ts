export interface ClassTeacher {
  id: string;
  classId: string;
  userId: string;
  isHomeroom: boolean;
  deletedAt: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  grade: string | null;
  academicYear: string | null;
  boxFolderId: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  classTeachers?: ClassTeacher[];
}

export interface CreateClassInput {
  name: string;
  grade?: string;
  academicYear?: string;
}

export type UpdateClassInput = Partial<CreateClassInput>;

export interface AssignTeacherInput {
  userId: string;
  isHomeroom?: boolean;
}
