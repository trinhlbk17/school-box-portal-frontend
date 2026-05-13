import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/shared/components/ui/sheet";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Loader2, CalendarIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { classSchema, type ClassFormValues } from "@/features/class/schemas/classSchema";
import type { Class } from "@/features/class/types/class.types";
import { useCreateClass, useUpdateClass } from "@/features/class/hooks/useClasses";
import { useState } from "react";

interface ClassFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
  class?: Class | null;
}

function YearRangePicker({ value, onChange }: { value: string | null | undefined; onChange: (v: string | null) => void }) {
  const [open, setOpen] = useState(false);
  
  // Local selection state
  const [selectingStart, setSelectingStart] = useState<number | null>(null);

  // Parse current value
  const parts = value ? value.split("-") : [];
  const currentStart = parts[0] ? parseInt(parts[0]) : null;
  const currentEnd = parts[1] ? parseInt(parts[1]) : null;

  const currentYear = new Date().getFullYear();
  // Show 12 years: from 3 years ago to 8 years in the future
  const years = Array.from({ length: 12 }, (_, i) => currentYear - 3 + i); 

  const handleYearClick = (year: number) => {
    if (!selectingStart) {
      // First click
      setSelectingStart(year);
    } else {
      // Second click
      const start = Math.min(selectingStart, year);
      const end = Math.max(selectingStart, year);
      onChange(`${start}-${end}`);
      setSelectingStart(null);
      setOpen(false);
    }
  };

  const handleClear = () => {
    onChange(null);
    setSelectingStart(null);
    setOpen(false);
  };

  // When popover closes, reset local selection
  useEffect(() => {
    if (!open) setSelectingStart(null);
  }, [open]);

  // Display value formatting
  let displayValue = <span>Select academic year</span>;
  if (open && selectingStart) {
    displayValue = <span>{selectingStart} - End Year</span>;
  } else if (value) {
    displayValue = <span className="text-foreground">{value}</span>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              (!value && !selectingStart) && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            {displayValue}
          </Button>
        }
      />
      <PopoverContent className="w-[280px] p-3" align="start">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm">Select Year Range</span>
            <Button variant="ghost" size="xs" onClick={handleClear} className="h-7 px-2">Clear</Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {years.map((year) => {
              // Determine if year is selected or in range
              let isStart = false;
              let isEnd = false;
              let inRange = false;

              if (open && selectingStart) {
                isStart = year === selectingStart;
              } else if (currentStart && currentEnd) {
                isStart = year === currentStart;
                isEnd = year === currentEnd;
                inRange = year > currentStart && year < currentEnd;
              }

              return (
                <Button
                  key={year}
                  type="button"
                  variant={isStart || isEnd ? "default" : inRange ? "secondary" : "outline"}
                  className={cn("h-9", inRange && "opacity-70")}
                  onClick={() => handleYearClick(year)}
                >
                  {year}
                </Button>
              );
            })}
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {selectingStart ? "Select end year" : "Select start year"}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ClassFormSheet({
  isOpen,
  onClose,
  schoolId,
  class: cls,
}: ClassFormSheetProps) {
  const isEdit = !!cls;
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const isPending = createClass.isPending || updateClass.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: { name: "", grade: "-", academicYear: "" },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: cls?.name ?? "",
        grade: cls?.grade || "-",
        academicYear: cls?.academicYear ?? "",
      });
    }
  }, [isOpen, cls, reset]);

  const onSubmit = async (values: ClassFormValues) => {
    const payload: any = {
      name: values.name,
    };

    if (values.grade && values.grade !== "-") {
      payload.grade = values.grade;
    } else {
      payload.grade = null;
    }

    if (values.academicYear) {
      payload.academicYear = values.academicYear;
    } else {
      payload.academicYear = null;
    }

    try {
      if (isEdit && cls) {
        await updateClass.mutateAsync({ id: cls.id, data: payload });
      } else {
        await createClass.mutateAsync({ schoolId, data: payload });
      }
      onClose();
    } catch (error) {
      // Error is handled by global query client or mutation onError
      console.error("Failed to save class", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Class" : "Add Class"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the class information below."
              : "Fill in the details to create a new class."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">
            <div className="space-y-1.5">
              <Label htmlFor="class-name">
                Class Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="class-name"
                placeholder="e.g. 10A1"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="class-grade">Grade</Label>
              <Select
                value={watch("grade") || "-"}
                onValueChange={(val) => setValue("grade", val, { shouldValidate: true })}
              >
                <SelectTrigger id="class-grade" className="w-full">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">-</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="class-year">Academic Year</Label>
              <YearRangePicker
                value={watch("academicYear")}
                onChange={(val) => setValue("academicYear", val, { shouldValidate: true })}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-100 bg-white">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="w-32">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="w-32">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
