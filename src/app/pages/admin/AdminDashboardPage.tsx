import { useAuthStore } from '@/features/auth';
import { StatCard } from '@/shared/components/StatCard';
import { RecentActivity } from './components/RecentActivity';
import { FeatureErrorBoundary } from '@/shared/components/FeatureErrorBoundary';
import { School, BookOpen, Users, Image as ImageIcon } from 'lucide-react';

export function AdminDashboardPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className={`grid gap-4 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {isAdmin && (
          <StatCard
            title="Total Schools"
            value="-"
            icon={School}
            iconColorClass="text-primary-600"
            iconBgClass="bg-primary-50"
          />
        )}
        <StatCard
          title={isAdmin ? "Total Classes" : "My Classes"}
          value="-"
          icon={BookOpen}
          iconColorClass="text-info-600"
          iconBgClass="bg-info-50"
        />
        <StatCard
          title={isAdmin ? "Total Students" : "My Students"}
          value="-"
          icon={Users}
          iconColorClass="text-success-600"
          iconBgClass="bg-success-50"
        />
        <StatCard
          title={isAdmin ? "Total Albums" : "My Albums"}
          value="-"
          icon={ImageIcon}
          iconColorClass="text-warning-600"
          iconBgClass="bg-warning-50"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {isAdmin && (
          <div className="col-span-4">
            <FeatureErrorBoundary>
              <RecentActivity />
            </FeatureErrorBoundary>
          </div>
        )}
        <div className={isAdmin ? "col-span-3" : "col-span-7"}>
          {/* Future widget space or empty space */}
          <div className="h-full min-h-[300px] rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-sm text-slate-500 bg-slate-50/50">
            More features coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
