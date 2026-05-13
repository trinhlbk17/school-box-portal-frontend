import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { render, userEvent } from '@/test/test-utils';
import { server } from '@/test/msw/server';
import { StudentFormSheet } from '@/features/student/components/StudentFormSheet';
import { createStudent } from '@/test/factories';

const API_BASE = 'http://localhost:3000/api';
const CLASS_ID = 'class-test-001';

describe('StudentFormSheet', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    classId: CLASS_ID,
  };

  it('should_render_add_form_when_no_student_provided', () => {
    render(<StudentFormSheet {...defaultProps} />);

    expect(screen.getByRole('heading', { name: /add student/i })).toBeInTheDocument();
    // Name input should be empty
    expect(screen.getByLabelText(/full name/i)).toHaveValue('');
  });

  it('should_render_edit_form_with_prefilled_data_when_student_provided', () => {
    const student = createStudent({ name: 'Nguyen Van A', classId: CLASS_ID });
    render(<StudentFormSheet {...defaultProps} student={student} />);

    expect(screen.getByText('Edit Student')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Nguyen Van A');
  });

  it('should_show_validation_error_when_name_is_empty', async () => {
    const user = userEvent.setup();
    render(<StudentFormSheet {...defaultProps} />);

    // Click add without entering name
    await user.click(screen.getByRole('button', { name: /add student/i }));

    expect(await screen.findByText(/student name is required/i)).toBeInTheDocument();
  });

  it('should_call_create_mutation_when_submitting_new_student', async () => {
    let requestBody: Record<string, unknown> | null = null;
    server.use(
      http.post(`${API_BASE}/students`, async ({ request }) => {
        requestBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json(
          createStudent({ name: requestBody.name as string, classId: requestBody.classId as string }),
          { status: 201 },
        );
      }),
    );

    const user = userEvent.setup();
    render(<StudentFormSheet {...defaultProps} />);

    await user.type(screen.getByLabelText(/full name/i), 'Tran Thi B');
    await user.click(screen.getByRole('button', { name: /add student/i }));

    await waitFor(() => {
      expect(requestBody).toMatchObject({ name: 'Tran Thi B', classId: CLASS_ID });
    });
  });

  it('should_call_update_mutation_when_submitting_existing_student', async () => {
    const student = createStudent({ id: 'student-edit-1', name: 'Old Name', classId: CLASS_ID });
    let requestBody: Record<string, unknown> | null = null;
    server.use(
      http.put(`${API_BASE}/students/${student.id}`, async ({ request }) => {
        requestBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json(createStudent({ ...student, name: requestBody.name as string }));
      }),
    );

    const user = userEvent.setup();
    render(<StudentFormSheet {...defaultProps} student={student} />);

    // Clear the name and type a new one
    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'New Name');
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(requestBody).toMatchObject({ name: 'New Name' });
    });
  });
});
