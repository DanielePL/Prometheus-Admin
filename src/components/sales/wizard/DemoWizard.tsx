import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardProgress } from "./WizardProgress";
import { DiscoveryStep } from "./DiscoveryStep";
import { SolutionStep } from "./SolutionStep";
import { PricingStep } from "./PricingStep";
import { LeadCaptureStep } from "./LeadCaptureStep";
import { useCreateLead } from "@/hooks/useSales";
import { calculatePricing } from "@/api/types/sales";
import type { PainPoint, CreateLeadInput } from "@/api/types/sales";

const STEPS = [
  { title: "Discovery", description: "Pain Points" },
  { title: "Solution", description: "3-Tier System" },
  { title: "Pricing", description: "Price Calculator" },
  { title: "Lead", description: "Contact Details" },
];

export function DemoWizard() {
  const navigate = useNavigate();
  const createLead = useCreateLead();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPainPoints, setSelectedPainPoints] = useState<PainPoint[]>([]);
  const [coachesCount, setCoachesCount] = useState(5);
  const [clientsCount, setClientsCount] = useState(50);
  const [isFoundingPartner, setIsFoundingPartner] = useState(true);
  const [formData, setFormData] = useState({
    gymName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
  });

  const togglePainPoint = (painPoint: PainPoint) => {
    setSelectedPainPoints((prev) =>
      prev.includes(painPoint)
        ? prev.filter((p) => p !== painPoint)
        : [...prev, painPoint]
    );
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedPainPoints.length > 0;
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return (
          formData.gymName.trim() !== "" &&
          formData.contactName.trim() !== "" &&
          formData.contactEmail.trim() !== ""
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedPainPoints([]);
    setCoachesCount(5);
    setClientsCount(50);
    setIsFoundingPartner(true);
    setFormData({
      gymName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      notes: "",
    });
  };

  const handleSave = async () => {
    const pricing = calculatePricing(coachesCount, clientsCount, isFoundingPartner);

    const leadData: CreateLeadInput = {
      gym_name: formData.gymName,
      contact_name: formData.contactName,
      contact_email: formData.contactEmail,
      contact_phone: formData.contactPhone || undefined,
      coaches_count: coachesCount,
      clients_count: clientsCount,
      pain_points: selectedPainPoints,
      pricing_quoted: pricing.monthly,
      founding_partner: isFoundingPartner,
      notes: formData.notes || undefined,
    };

    try {
      await createLead.mutateAsync(leadData);
      // Navigate to CRM after successful save
      navigate("/sales/crm");
    } catch (error) {
      console.error("Failed to create lead:", error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <WizardProgress currentStep={currentStep} steps={STEPS} />

      <div className="min-h-[500px] rounded-2xl bg-card/50 p-6 md:p-8">
        {currentStep === 0 && (
          <DiscoveryStep
            selectedPainPoints={selectedPainPoints}
            onToggle={togglePainPoint}
          />
        )}

        {currentStep === 1 && (
          <SolutionStep selectedPainPoints={selectedPainPoints} />
        )}

        {currentStep === 2 && (
          <PricingStep
            coachesCount={coachesCount}
            clientsCount={clientsCount}
            isFoundingPartner={isFoundingPartner}
            onCoachesChange={setCoachesCount}
            onClientsChange={setClientsCount}
            onFoundingPartnerChange={setIsFoundingPartner}
          />
        )}

        {currentStep === 3 && (
          <LeadCaptureStep
            formData={formData}
            onFormChange={updateFormData}
            coachesCount={coachesCount}
            clientsCount={clientsCount}
            isFoundingPartner={isFoundingPartner}
            selectedPainPoints={selectedPainPoints}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <Button variant="ghost" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        <div>
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!canProceed() || createLead.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {createLead.isPending ? "Saving..." : "Save Lead"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
