import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { User, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { FeatureErrorBoundary } from "@/shared/components/FeatureErrorBoundary";

export function MyProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="container mx-auto py-8 max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">My Profile</h1>
      
      <FeatureErrorBoundary featureName="My Profile">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <Badge variant="outline" className="mt-1 uppercase">{user.role}</Badge>
              </div>
            </div>
            
            <div className="grid gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-muted-foreground">
                <User className="h-5 w-5" />
                <span>{user.name}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>{user.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">Change your account password</p>
              </div>
              <Link to="/portal/change-password">
                <Button variant="outline">Change Password</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </FeatureErrorBoundary>
    </div>
  );
}
