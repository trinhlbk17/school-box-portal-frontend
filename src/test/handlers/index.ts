import { authHandlers } from './auth.handlers';
import { schoolHandlers } from './school.handlers';
import { classHandlers } from './class.handlers';
import { studentHandlers } from './student.handlers';
import { protectorHandlers } from './protector.handlers';
import { albumHandlers } from './album.handlers';
import { userHandlers } from './user.handlers';
import { boxHandlers } from './box.handlers';
import { auditHandlers } from './audit.handlers';

export const handlers = [
  ...authHandlers,
  ...schoolHandlers,
  ...classHandlers,
  ...studentHandlers,
  ...protectorHandlers,
  ...albumHandlers,
  ...userHandlers,
  ...boxHandlers,
  ...auditHandlers,
];
