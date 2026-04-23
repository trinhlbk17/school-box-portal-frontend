import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, CalendarDays } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { useSchools } from "@/features/school";
import { useClassesBySchool } from "@/features/class/hooks/useClasses";
import { ROUTES } from "@/shared/constants/routes";

function ClassCard({
  id,
  name,
  grade,
  academicYear,
  onClick,
}: {
  id: string;
  name: string;
  grade: string | null;
  academicYear: string | null;
  onClick: () => void;
}) {
  return (
    <button
      key={id}
      onClick={onClick}
      className="group flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition-all hover:border-primary-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 group-hover:bg-primary-100 transition-colors">
        <BookOpen className="h-5 w-5 text-primary-600" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
          {name}
        </h3>
        <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
          {grade && (
            <span className="flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" />
              Grade {grade}
            </span>
          )}
          {academicYear && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {academicYear}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/**
 * Teacher landing page — shows only classes they are assigned to.
 * Strategy: fetch single school (MVP), then fetch classes (auto-filtered for teacher by backend).
 */
function ClassGrid({ schoolId }: { schoolId: string }) {
  const navigate = useNavigate();
  const { data: classes = [], isLoading, error } = useClassesBySchool(schoolId);

  if (error) {
    return <ErrorAlert title="Failed to load classes" message={(error as { message: string }).message} />;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 rounded-xl border border-neutral-200 bg-neutral-50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <EmptyState
        title="No classes assigned"
        description="You haven't been assigned to any classes yet. Contact your administrator."
        icon={<BookOpen className="h-6 w-6 text-neutral-500" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes.map((cls) => (
        <ClassCard
          key={cls.id}
          id={cls.id}
          name={cls.name}
          grade={cls.grade}
          academicYear={cls.academicYear}
          onClick={() => navigate(ROUTES.ADMIN.CLASS_DETAIL(cls.id))}
        />
      ))}
    </div>
  );
}

export function MyClassesPage() {
  const { data: schools = [], isLoading: schoolsLoading, error: schoolsError } = useSchools();

  if (schoolsError) {
    return <ErrorAlert title="Failed to load school info" message={(schoolsError as { message: string }).message} />;
  }

  const school = schools[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Classes"
        description="Classes you are assigned to as a teacher."
      />

      {schoolsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl border border-neutral-200 bg-neutral-50 animate-pulse" />
          ))}
        </div>
      ) : !school ? (
        <EmptyState
          title="No school configured"
          description="Your school hasn't been set up yet. Contact your administrator."
        />
      ) : (
        <ClassGrid schoolId={school.id} />
      )}
    </div>
  );
}
