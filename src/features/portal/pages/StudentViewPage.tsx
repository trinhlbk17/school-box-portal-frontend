import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/features/student/hooks/useStudents";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { StudentInfoTab } from "../components/StudentInfoTab";
import { StudentAlbumsTab } from "../components/StudentAlbumsTab";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { FeatureErrorBoundary } from "@/shared/components/FeatureErrorBoundary";

export function StudentViewPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const isProtector = useAuthStore((state) => state.user?.role === 'PROTECTOR');
  
  const { data: student, isLoading, error } = useStudent(studentId!);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-8 text-center text-destructive flex flex-col items-center">
          <AlertCircle className="h-8 w-8 mb-4" />
          <h2>Failed to load student profile.</h2>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/portal/students")}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to My Students
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !student) {
    return (
      <div className="container mx-auto py-8 max-w-5xl space-y-6">
        <Skeleton className="h-12 w-1/4 mb-8" />
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl space-y-6">
      <div className="flex items-center gap-4 border-b pb-4 border-primary/10">
        {isProtector && (
          <Button variant="ghost" size="sm" onClick={() => navigate("/portal/students")} className="p-0 h-auto hover:bg-primary/5 text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-primary">{student.name}'s Profile</h1>
      </div>

      <FeatureErrorBoundary featureName="Student Profile">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-6 bg-primary/5">
            <TabsTrigger value="info" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Information</TabsTrigger>
            <TabsTrigger value="albums" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Class Albums</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="mt-0 outline-none">
            <StudentInfoTab student={student} />
          </TabsContent>
          <TabsContent value="albums" className="mt-0 outline-none">
            {student.classId ? (
              <StudentAlbumsTab classId={student.classId} studentId={student.id} />
            ) : (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-primary/20 rounded-xl bg-primary/5">
                This student is not currently assigned to a class.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </FeatureErrorBoundary>
    </div>
  );
}
