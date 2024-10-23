// src/components/widgets/UpgradePlan.tsx

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function UpgradePlan() {
  return (
    <Card className="mx-4 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Passer à Premium</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Accédez à des fonctionnalités exclusives et au support prioritaire.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          Passer à Premium
        </Button>
      </CardFooter>
    </Card>
  );
}
