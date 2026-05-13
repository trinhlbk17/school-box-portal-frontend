import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  iconColorClass?: string;
  iconBgClass?: string;
  description?: string;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColorClass = 'text-primary-600',
  iconBgClass = 'bg-primary-50',
  description,
  isLoading = false,
}: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-full", iconBgClass)}>
          <Icon className={cn("h-5 w-5", iconColorClass)} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20 mt-1" />
        ) : (
          <div className="text-2xl font-bold text-slate-900">{value}</div>
        )}
        {description && (
          <p className="text-xs text-slate-500 mt-1">
            {isLoading ? <Skeleton className="h-3 w-32 mt-1" /> : description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
