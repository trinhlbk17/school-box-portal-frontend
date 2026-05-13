import type { Student } from "@/features/student/types/student.types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function StudentInfoTab({ student }: { student: Student }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground block">Full Name</span>
            <span className="font-medium">{student.name}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground block">Date of Birth</span>
            <span className="font-medium">
              {student.dateOfBirth ? format(new Date(student.dateOfBirth), "PP") : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground block">Gender</span>
            <span className="font-medium">
              {student.gender ? student.gender.charAt(0) + student.gender.slice(1).toLowerCase() : "N/A"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground block">Class</span>
            <span className="font-medium">{student.class?.name || "Unassigned"}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground block">Academic Year</span>
            <span className="font-medium">{student.class?.academicYear || "N/A"}</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground block">Grade</span>
            <span className="font-medium">{student.class?.grade || "N/A"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
