import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateEvent() {
  return (
    <Card className="mx-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Créer un Événement</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Commencez à planifier votre prochain événement en le créant ici.
        </p>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Créer un Nouvel Événement
        </Button>
      </CardContent>
    </Card>
  );
}
