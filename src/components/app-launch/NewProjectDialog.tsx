import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAppProject } from "@/hooks/useAppLaunch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Apple, Play, Rocket, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Platform } from "@/api/types/appLaunch";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const navigate = useNavigate();
  const createProject = useCreateAppProject();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const togglePlatform = (platform: Platform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    if (platforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    try {
      const project = await createProject.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        platforms,
      });

      if (project) {
        toast.success("Project created successfully!");
        onOpenChange(false);
        setName("");
        setDescription("");
        setPlatforms([]);
        navigate(`/app-launch/project/${project.id}`);
      }
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            New App Project
          </DialogTitle>
          <DialogDescription>
            Create a new project to start your app launch journey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* App Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">App Name</label>
            <Input
              placeholder="My Awesome App"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description (optional)</label>
            <Input
              placeholder="A brief description of your app"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Platforms</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => togglePlatform("android")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                  platforms.includes("android")
                    ? "border-green-500 bg-green-500/10"
                    : "border-white/10 hover:border-white/30"
                )}
              >
                <Play
                  className={cn(
                    "h-8 w-8",
                    platforms.includes("android") ? "text-green-500" : "text-muted-foreground"
                  )}
                />
                <span className="text-sm font-medium">Android</span>
                <span className="text-xs text-muted-foreground">Google Play</span>
              </button>

              <button
                type="button"
                onClick={() => togglePlatform("ios")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                  platforms.includes("ios")
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 hover:border-white/30"
                )}
              >
                <Apple
                  className={cn(
                    "h-8 w-8",
                    platforms.includes("ios") ? "text-blue-500" : "text-muted-foreground"
                  )}
                />
                <span className="text-sm font-medium">iOS</span>
                <span className="text-xs text-muted-foreground">App Store</span>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={createProject.isPending || !name || platforms.length === 0}
            className="gap-2"
          >
            {createProject.isPending ? (
              "Creating..."
            ) : (
              <>
                Create Project
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
