import { Loader2 } from "lucide-react";

export default function LoadingWidget() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Chargement...</p>
    </div>
  );
}
