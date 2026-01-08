import { useMemo } from "react";
import { useLeads, useUpdateLeadStatus } from "@/hooks/useSales";
import { LeadCard } from "./LeadCard";
import type { DealStatus, SalesLead } from "@/api/types/sales";
import { cn } from "@/lib/utils";

const PIPELINE_COLUMNS: { status: DealStatus; label: string; color: string }[] = [
  { status: "new", label: "New", color: "bg-blue-500" },
  { status: "contacted", label: "Contacted", color: "bg-yellow-500" },
  { status: "demo", label: "Demo", color: "bg-purple-500" },
  { status: "negotiation", label: "Negotiation", color: "bg-orange-500" },
  { status: "won", label: "Won", color: "bg-green-500" },
  { status: "lost", label: "Lost", color: "bg-red-500" },
];

interface PipelineViewProps {
  searchQuery: string;
}

export function PipelineView({ searchQuery }: PipelineViewProps) {
  const { data: leads, isLoading } = useLeads();
  const updateStatus = useUpdateLeadStatus();

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    if (!searchQuery.trim()) return leads;

    const query = searchQuery.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.gym_name.toLowerCase().includes(query) ||
        lead.contact_name.toLowerCase().includes(query) ||
        lead.contact_email.toLowerCase().includes(query)
    );
  }, [leads, searchQuery]);

  const getLeadsByStatus = (status: DealStatus): SalesLead[] => {
    return filteredLeads.filter((lead) => lead.status === status);
  };

  const handleStatusChange = (leadId: string, newStatus: DealStatus) => {
    updateStatus.mutate({ id: leadId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-4">
        {PIPELINE_COLUMNS.map((col) => (
          <div key={col.status} className="space-y-3">
            <div className="h-10 rounded-lg bg-card animate-pulse" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-card animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-4 overflow-x-auto pb-4">
      {PIPELINE_COLUMNS.map((column) => {
        const columnLeads = getLeadsByStatus(column.status);

        return (
          <div key={column.status} className="min-w-[200px]">
            {/* Column Header */}
            <div className="mb-3 flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full", column.color)} />
              <span className="font-semibold">{column.label}</span>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs">
                {columnLeads.length}
              </span>
            </div>

            {/* Column Content */}
            <div className="space-y-3">
              {columnLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onStatusChange={(status) => handleStatusChange(lead.id, status)}
                />
              ))}

              {columnLeads.length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-muted p-4 text-center text-sm text-muted-foreground">
                  No leads
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
