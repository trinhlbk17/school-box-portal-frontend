import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useAuditLogs } from '@/features/audit/hooks/useAuditLogs';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { type LogType, LOG_TYPES } from '@/features/audit/types/audit.types';
import { formatDistanceToNow } from 'date-fns';
import { 
  LogIn, 
  Eye, 
  Upload, 
  Download, 
  Archive, 
  ArrowRightLeft, 
  GraduationCap,
  Activity
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

function getLogIconAndColor(logType: LogType) {
  switch (logType) {
    case LOG_TYPES.LOGIN:
      return { icon: LogIn, color: 'text-primary-500', bg: 'bg-primary-50' };
    case LOG_TYPES.FILE_UPLOAD:
      return { icon: Upload, color: 'text-success-500', bg: 'bg-success-50' };
    case LOG_TYPES.FILE_DOWNLOAD:
      return { icon: Download, color: 'text-warning-500', bg: 'bg-warning-50' };
    case LOG_TYPES.ALBUM_DOWNLOAD:
      return { icon: Archive, color: 'text-warning-500', bg: 'bg-warning-50' };
    case LOG_TYPES.FILE_VIEW:
      return { icon: Eye, color: 'text-slate-500', bg: 'bg-slate-100' };
    case LOG_TYPES.CLASS_TRANSFER:
      return { icon: ArrowRightLeft, color: 'text-purple-500', bg: 'bg-purple-50' };
    case LOG_TYPES.CLASS_PROMOTION:
      return { icon: GraduationCap, color: 'text-success-500', bg: 'bg-success-50' };
    default:
      return { icon: Activity, color: 'text-slate-500', bg: 'bg-slate-100' };
  }
}

function getLogText(logType: LogType, userName: string, target?: string) {
  switch (logType) {
    case LOG_TYPES.LOGIN:
      return `${userName} logged in`;
    case LOG_TYPES.FILE_UPLOAD:
      return `${userName} uploaded file(s)`;
    case LOG_TYPES.FILE_DOWNLOAD:
      return `${userName} downloaded file(s)`;
    case LOG_TYPES.ALBUM_DOWNLOAD:
      return `${userName} downloaded an album`;
    case LOG_TYPES.FILE_VIEW:
      return `${userName} viewed ${target || 'a file'}`;
    case LOG_TYPES.CLASS_TRANSFER:
      return `${userName} transferred a student`;
    case LOG_TYPES.CLASS_PROMOTION:
      return `${userName} promoted a class`;
    default:
      return `${userName} performed an action`;
  }
}

export function RecentActivity() {
  const { data, isLoading, isError } = useAuditLogs({ limit: 10, page: 1 });
  const logs = data?.data || [];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-sm text-destructive">Failed to load recent activity.</div>
        ) : logs.length === 0 ? (
          <div className="text-sm text-slate-500">No recent activity found.</div>
        ) : (
          <div className="space-y-6">
            {logs.map((log) => {
              const { icon: Icon, color, bg } = getLogIconAndColor(log.logType);
              
              return (
                <div key={log.id} className="flex items-start space-x-4">
                  <div className={cn("p-2 rounded-full flex-shrink-0 mt-0.5", bg)}>
                    <Icon className={cn("h-4 w-4", color)} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-slate-900">
                      {getLogText(log.logType, log.userName, log.target)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
