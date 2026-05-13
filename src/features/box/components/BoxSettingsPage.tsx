import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Link2,
  Link2Off,
  CheckCircle2,
  AlertCircle,
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

export function BoxSettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false);

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
          ) : status?.isConnected ? (
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
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => setIsDisconnectOpen(true)}
                >
                  <Link2Off className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
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
    </div>
  );
}
