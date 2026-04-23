import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Link2,
  Link2Off,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useBoxStatus } from "@/features/box/hooks/useBoxStatus";
import { useBoxConnect, useBoxDisconnect } from "@/features/box/hooks/useBoxConnect";
import { BoxFolderBrowser } from "@/features/box/components/BoxFolderBrowser";
import type { BoxFolderBrowserResult } from "@/features/box/types/box.types";

export function BoxSettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BoxFolderBrowserResult | null>(null);

  const { data: status, isLoading, error, refetch } = useBoxStatus();
  const { connect } = useBoxConnect();
  const disconnect = useBoxDisconnect();

  // Detect successful OAuth callback redirect
  useEffect(() => {
    if (searchParams.get("box_connected") === "true") {
      toast.success("Box connected successfully!");
      // Remove query param without triggering navigation
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("box_connected");
      setSearchParams(newParams, { replace: true });
      // Refetch status to show connected state
      refetch();
    }
  }, [searchParams, setSearchParams, refetch]);

  const handleConfirmDisconnect = async () => {
    await disconnect.mutateAsync();
    setIsDisconnectOpen(false);
  };

  const handleBrowseSelect = (result: BoxFolderBrowserResult) => {
    setSelectedItem(result);
    toast.success(
      `Selected ${result.type}: ${result.name} (ID: ${result.id})`
    );
  };

  if (error) {
    return (
      <ErrorAlert
        title="Failed to load Box status"
        message={(error as { message: string }).message}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Box Settings"
        description="Connect and manage your Box.com file storage integration."
      />

      {/* Connection Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connection Status</CardTitle>
          <CardDescription>
            The system uses Box.com to store and manage school files securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-3 text-neutral-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Checking connection...</span>
            </div>
          ) : status?.connected ? (
            <div className="space-y-4">
              {/* Connected state */}
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-700">
                    Connected to Box.com
                  </p>
                  {status.boxUserId && (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Box User ID:{" "}
                      <span className="font-mono">{status.boxUserId}</span>
                    </p>
                  )}
                  {status.tokenExpiry && (
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      Token expires:{" "}
                      {new Date(status.tokenExpiry).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsBrowserOpen(true)}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => setIsDisconnectOpen(true)}
                >
                  <Link2Off className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>

              {/* Show last selected item if any */}
              {selectedItem && (
                <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm">
                  <p className="text-xs text-neutral-500 mb-1">Last selected:</p>
                  <p className="font-medium text-neutral-900">{selectedItem.name}</p>
                  <p className="text-xs font-mono text-neutral-500">
                    {selectedItem.type} · ID: {selectedItem.id}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Disconnected state */}
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-neutral-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-700">
                    Not connected
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Connect your Box.com account to enable file storage features.
                  </p>
                </div>
              </div>

              <Button onClick={connect}>
                <Link2 className="h-4 w-4 mr-2" />
                Connect to Box
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">About Box Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-neutral-600">
          <p>
            Box.com is used as the primary file storage system for school photos,
            documents, and albums.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>School and class folders are automatically created in Box</li>
            <li>Album images are stored and managed via Box</li>
            <li>File downloads are served through Box with watermarking</li>
            <li>
              Students and protectors can download watermarked images securely
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={isDisconnectOpen}
        title="Disconnect from Box"
        description="Are you sure you want to disconnect Box.com? File operations will stop working until you reconnect."
        confirmLabel="Disconnect"
        variant="destructive"
        isLoading={disconnect.isPending}
        onConfirm={handleConfirmDisconnect}
        onClose={() => setIsDisconnectOpen(false)}
      />

      <BoxFolderBrowser
        isOpen={isBrowserOpen}
        onClose={() => setIsBrowserOpen(false)}
        onSelect={handleBrowseSelect}
      />
    </div>
  );
}
