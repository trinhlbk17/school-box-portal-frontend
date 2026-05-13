import { Link } from "react-router-dom";
import type { Student } from "@/features/student/types/student.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { User, School } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <Link to={`/portal/students/${student.id}`} className="block transition-transform hover:-translate-y-1">
      <Card className="h-full hover:shadow-md transition-shadow border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            {student.name}
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">Student</Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <School className="h-4 w-4" />
            <span>Class: {student.class?.name || "Unassigned"}</span>
          </div>
          {student.class?.academicYear && (
             <div className="text-xs text-muted-foreground ml-6 mt-1">
               Year: {student.class.academicYear}
             </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
