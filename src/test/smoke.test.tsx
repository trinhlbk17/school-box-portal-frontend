/**
 * Smoke tests to verify the testing infrastructure works correctly.
 * These tests validate:
 * 1. MSW intercepts API requests
 * 2. Custom render wraps components with required providers
 * 3. Factories produce valid typed objects
 */
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from './test-utils';
import {
  createUser,
  createAdmin,
  createTeacher,
  createSchool,
  createClass,
  createStudent,
  createAlbum,
  createAlbumImage,
  createProtector,
} from './factories';
import { AlbumStatus } from '@/features/album/types/album.types';

// ─── Factory Tests ─────────────────────────────────────────────────────────

describe('Test Factories', () => {
  it('should_create_user_with_defaults_when_no_overrides_provided', () => {
    const user = createUser();
    expect(user.id).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.name).toBeDefined();
    expect(user.role).toBe('ADMIN');
    expect(user.isActive).toBe(true);
  });

  it('should_apply_overrides_when_passed_to_createUser', () => {
    const user = createUser({ role: 'TEACHER', name: 'Jane Doe' });
    expect(user.role).toBe('TEACHER');
    expect(user.name).toBe('Jane Doe');
  });

  it('should_create_admin_with_correct_role', () => {
    const admin = createAdmin();
    expect(admin.role).toBe('ADMIN');
  });

  it('should_create_teacher_with_correct_role', () => {
    const teacher = createTeacher();
    expect(teacher.role).toBe('TEACHER');
  });

  it('should_create_school_with_required_fields', () => {
    const school = createSchool();
    expect(school.id).toBeDefined();
    expect(school.name).toBeDefined();
    expect(school.createdAt).toBeDefined();
  });

  it('should_create_class_with_school_reference', () => {
    const cls = createClass({ schoolId: 'school-abc' });
    expect(cls.schoolId).toBe('school-abc');
    expect(cls.name).toBeDefined();
  });

  it('should_create_student_with_class_reference', () => {
    const student = createStudent({ classId: 'class-abc' });
    expect(student.classId).toBe('class-abc');
    expect(student.isActive).toBe(true);
  });

  it('should_create_album_with_draft_status_by_default', () => {
    const album = createAlbum();
    expect(album.status).toBe(AlbumStatus.DRAFT);
    expect(album.name).toBeDefined();
  });

  it('should_create_album_with_published_status_when_overridden', () => {
    const album = createAlbum({ status: AlbumStatus.PUBLISHED });
    expect(album.status).toBe(AlbumStatus.PUBLISHED);
  });

  it('should_create_album_image_with_required_fields', () => {
    const image = createAlbumImage({ albumId: 'album-xyz' });
    expect(image.albumId).toBe('album-xyz');
    expect(image.originalName).toBeDefined();
    expect(image.mimeType).toBe('image/jpeg');
  });

  it('should_create_protector_with_parent_relationship_by_default', () => {
    const protector = createProtector();
    expect(protector.relationship).toBe('PARENT');
    expect(protector.email).toBeDefined();
  });

  it('should_create_protector_with_guardian_relationship_when_overridden', () => {
    const protector = createProtector({ relationship: 'GUARDIAN' });
    expect(protector.relationship).toBe('GUARDIAN');
  });
});

// ─── Custom Render Tests ────────────────────────────────────────────────────

describe('Custom Render Utility', () => {
  it('should_render_component_without_throwing_when_using_custom_render', () => {
    const TestComponent = () => <div data-testid="test-component">Hello Test</div>;
    render(<TestComponent />);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('should_display_text_content_when_component_renders', () => {
    const TestComponent = () => <p>Test content</p>;
    render(<TestComponent />);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});

// ─── MSW Integration Tests ──────────────────────────────────────────────────

describe('MSW Server', () => {
  it('should_intercept_auth_login_request_and_return_mock_user', async () => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'pass' }),
    });
    const data = await response.json() as { success: boolean; data: { sessionToken: string } };
    expect(data.success).toBe(true);
    expect(data.data.sessionToken).toBe('test-session-token');
  });

  it('should_intercept_schools_list_request_and_return_mock_array', async () => {
    const response = await fetch('http://localhost:3000/api/schools');
    const data = await response.json() as unknown[];
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('should_intercept_auth_me_request_and_return_mock_user', async () => {
    const response = await fetch('http://localhost:3000/api/auth/me');
    const data = await response.json() as { success: boolean; data: { role: string } };
    expect(data.success).toBe(true);
    expect(data.data.role).toBe('ADMIN');
  });
});
