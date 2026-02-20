import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate("/")}
      className="fixed top-20 left-4 z-40 gap-2 bg-background/80 backdrop-blur-sm border-border shadow-sm"
    >
      <ArrowLeft className="h-4 w-4" />
      Назад
    </Button>
  );
};
