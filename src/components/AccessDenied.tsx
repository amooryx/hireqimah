import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const AccessDenied = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold font-heading mb-2">Access Denied</h1>
        <p className="text-sm text-muted-foreground mb-6">You do not have permission to access this page. Please sign in with the correct account.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
          <Button onClick={() => navigate("/login/student")}>Sign In</Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
