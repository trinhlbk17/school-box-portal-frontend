import { useMyStudents } from "@/features/protector/hooks/useMyStudents";
import { StudentCard } from "../components/StudentCard";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { FeatureErrorBoundary } from "@/shared/components/FeatureErrorBoundary";

export function MyStudentsPage() {
  const { data: students = [], isLoading, error } = useMyStudents();

  if (error) {
    return (
      <div className="p-8 text-center text-destructive flex flex-col items-center">
        <AlertCircle className="h-8 w-8 mb-4" />
        <h2>Failed to load your students.</h2>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">My Students</h1>
        <p className="text-muted-foreground">Select a student to view their profile and class albums.</p>
      </div>

      <FeatureErrorBoundary featureName="My Students">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed">
            <p className="text-muted-foreground">No students are currently linked to your account.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </FeatureErrorBoundary>
    </div>
  );
}
