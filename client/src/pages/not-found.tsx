import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6">
            The page you're looking for doesn't exist.
          </p>
          <Button variant="outline" onClick={() => navigate("/")} data-testid="button-go-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
