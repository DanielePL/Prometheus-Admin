import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Rocket, Building2, ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import gradientBg from "@/assets/gradient-bg.jpg";
import gradientBgDark from "@/assets/gradient-bg-dark.png";

export function CreateOrganizationPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createOrganization, user, organization } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManuallyEdited && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generatedSlug);
    }
  }, [name, slugManuallyEdited]);

  // Redirect if user already has an organization
  useEffect(() => {
    if (organization) {
      navigate("/", { replace: true });
    }
  }, [organization, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Organization name is required");
      return;
    }

    if (!slug.trim() || slug.length < 3) {
      setError("URL must be at least 3 characters");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await createOrganization(name, slug);
      if (error) {
        if (error.message.includes("duplicate")) {
          setError("This URL is already taken. Please choose another.");
        } else {
          setError(error.message);
        }
      } else {
        navigate("/", { replace: true });
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${theme === "dark" ? gradientBgDark : gradientBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-md glass rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary glow-orange">
            <Rocket className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Create your workspace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set up your organization to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Organization Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Acme Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl pl-10"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium text-foreground">
              Workspace URL
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                app.launchpad.com/
              </span>
              <Input
                id="slug"
                type="text"
                placeholder="acme"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This will be your unique workspace URL. Only lowercase letters, numbers, and hyphens allowed.
            </p>
          </div>

          {/* Plan Preview */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">14-Day Free Trial</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Full access to all features. No credit card required. Cancel anytime.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold rounded-xl glow-orange transition-smooth"
            disabled={isLoading || !name || !slug}
          >
            {isLoading ? (
              "Creating workspace..."
            ) : (
              <>
                Create Workspace
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          You can invite team members after creating your workspace
        </p>
      </div>
    </div>
  );
}
