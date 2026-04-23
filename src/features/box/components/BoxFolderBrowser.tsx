import { useState } from "react";
import {
  Folder,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileArchive,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { useBoxFolderItems } from "@/features/box/hooks/useBoxFolderItems";
import type {
  BoxFolderBrowserResult,
  BoxFolderStack,
  BoxFolderItem,
} from "@/features/box/types/box.types";

const ROOT_FOLDER: BoxFolderStack = { id: "0", name: "Root" };

function getFileIcon(item: BoxFolderItem) {
  if (item.type === "folder") return <Folder className="h-5 w-5 text-amber-500" />;
  const ext = item.extension?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
    return <FileImage className="h-5 w-5 text-blue-500" />;
  if (["mp4", "mov", "avi", "mkv"].includes(ext))
    return <FileVideo className="h-5 w-5 text-purple-500" />;
  if (["pdf", "doc", "docx", "txt", "xlsx", "xls"].includes(ext))
    return <FileText className="h-5 w-5 text-green-500" />;
  if (["zip", "rar", "tar", "gz"].includes(ext))
    return <FileArchive className="h-5 w-5 text-orange-500" />;
  return <File className="h-5 w-5 text-neutral-400" />;
}

interface BoxFolderBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: BoxFolderBrowserResult) => void;
  /** If true, only folders are selectable (not files) */
  foldersOnly?: boolean;
}

export function BoxFolderBrowser({
  isOpen,
  onClose,
  onSelect,
  foldersOnly = false,
}: BoxFolderBrowserProps) {
  const [folderStack, setFolderStack] = useState<BoxFolderStack[]>([ROOT_FOLDER]);
  const [selectedItem, setSelectedItem] = useState<BoxFolderItem | null>(null);

  const currentFolder = folderStack[folderStack.length - 1];

  const { data, isLoading, error } = useBoxFolderItems(
    isOpen ? currentFolder.id : "",
    foldersOnly ? "folder" : undefined
  );

  const items = data?.items ?? [];

  const handleFolderClick = (item: BoxFolderItem) => {
    if (item.type !== "folder") return;
    setFolderStack((prev) => [...prev, { id: item.id, name: item.name }]);
    setSelectedItem(null);
  };

  const handleBreadcrumbClick = (index: number) => {
    setFolderStack((prev) => prev.slice(0, index + 1));
    setSelectedItem(null);
  };

  const handleSelect = () => {
    if (!selectedItem) return;
    onSelect({
      id: selectedItem.id,
      name: selectedItem.name,
      type: selectedItem.type,
    });
    onClose();
  };

  const handleClose = () => {
    setFolderStack([ROOT_FOLDER]);
    setSelectedItem(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Browse Box Files</DialogTitle>
          <DialogDescription>
            {foldersOnly
              ? "Select a folder from Box.com."
              : "Browse and select a file or folder from Box.com."}
          </DialogDescription>
        </DialogHeader>

        {/* Breadcrumb */}
        <nav aria-label="Folder navigation" className="flex items-center gap-1 flex-wrap">
          {folderStack.map((segment, index) => (
            <div key={segment.id} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              )}
              {index < folderStack.length - 1 ? (
                <button
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                  onClick={() => handleBreadcrumbClick(index)}
                >
                  {segment.name}
                </button>
              ) : (
                <span className="text-sm font-medium text-neutral-900">
                  {segment.name}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Item List */}
        <div className="min-h-[300px] max-h-[400px] overflow-y-auto rounded-lg border border-neutral-200">
          {isLoading ? (
            <div className="flex items-center justify-center h-full py-16">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
            </div>
          ) : error ? (
            <div className="p-4">
              <ErrorAlert
                title="Failed to load folder"
                message={(error as { message: string }).message}
              />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
              <Folder className="h-10 w-10 mb-2" />
              <p className="text-sm">This folder is empty</p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {items.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isClickable = item.type === "folder";
                const isSelectable = !foldersOnly || item.type === "folder";

                return (
                  <li key={item.id}>
                    <div
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                        isSelected
                          ? "bg-primary-50 border-l-2 border-primary-600"
                          : "hover:bg-neutral-50"
                      }`}
                    >
                      {/* Icon */}
                      <span className="shrink-0">{getFileIcon(item)}</span>

                      {/* Name — clicking folder navigates, clicking file selects */}
                      <button
                        className={`flex-1 text-left text-sm ${
                          isClickable
                            ? "text-neutral-900 hover:text-primary-700"
                            : "text-neutral-700"
                        } ${!isSelectable ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => {
                          if (item.type === "folder") {
                            handleFolderClick(item);
                          } else if (isSelectable) {
                            setSelectedItem(item);
                          }
                        }}
                        disabled={!isSelectable && item.type !== "folder"}
                        aria-label={`${item.type === "folder" ? "Open folder" : "Select file"}: ${item.name}`}
                      >
                        {item.name}
                        {item.type === "folder" && (
                          <span className="ml-2 text-xs text-neutral-400">
                            (folder)
                          </span>
                        )}
                      </button>

                      {/* Select button for selectable items */}
                      {isSelectable && (
                        <button
                          className={`shrink-0 rounded px-2 py-1 text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-primary-600 text-white"
                              : "border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(isSelected ? null : item);
                          }}
                          aria-label={isSelected ? `Deselect ${item.name}` : `Select ${item.name}`}
                          aria-pressed={isSelected}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-neutral-500">
            {selectedItem
              ? `Selected: ${selectedItem.name}`
              : "Click a folder to navigate, or select an item"}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedItem}>
              Confirm Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
