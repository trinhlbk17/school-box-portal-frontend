export type Relationship = "PARENT" | "GUARDIAN" | "SIBLING" | "OTHER";

export interface ProtectorUser {
  id: string;
  name: string;
  email: string;
}

export interface Protector {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  relationship: Relationship;
  user?: ProtectorUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProtectorInput {
  name: string;
  email: string;
  phone?: string;
  relationship: Relationship;
  studentIds?: string[];
}

export interface AssignProtectorInput {
  protectorId?: string;
  name?: string;
  email?: string;
  phone?: string;
  relationship: Relationship;
}
