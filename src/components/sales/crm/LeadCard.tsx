import { useState } from "react";
import { Building2, User, Mail, Phone, Calendar, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LeadDetailModal } from "./LeadDetailModal";
import type { SalesLead, DealStatus } from "@/api/types/sales";
import { calculatePricing } from "@/api/types/sales";

interface LeadCardProps {
  lead: SalesLead;
  onStatusChange: (status: DealStatus) => void;
}

export function LeadCard({ lead, onStatusChange }: LeadCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const pricing = calculatePricing(
    lead.coaches_count,
    lead.clients_count,
    lead.founding_partner
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className={cn(
          "cursor-pointer rounded-xl bg-card p-4 transition-all hover:bg-card/80 hover:shadow-lg",
          lead.founding_partner && "border-l-4 border-primary"
        )}
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm line-clamp-1">{lead.gym_name}</h4>
              {lead.founding_partner && (
                <span className="text-xs text-primary">Founding Partner</span>
              )}
            </div>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {showMenu && (
              <div className="absolute right-0 top-6 z-10 min-w-[120px] rounded-lg bg-card border border-muted p-1 shadow-lg">
                {(["new", "contacted", "demo", "negotiation", "won", "lost"] as DealStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(status);
                        setShowMenu(false);
                      }}
                      className="block w-full rounded px-3 py-1.5 text-left text-sm hover:bg-muted capitalize"
                    >
                      {status === "new" && "New"}
                      {status === "contacted" && "Contacted"}
                      {status === "demo" && "Demo"}
                      {status === "negotiation" && "Negotiation"}
                      {status === "won" && "Won"}
                      {status === "lost" && "Lost"}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span className="line-clamp-1">{lead.contact_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3" />
            <span className="line-clamp-1">{lead.contact_email}</span>
          </div>
          {lead.contact_phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <span>{lead.contact_phone}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-muted pt-3">
          <div className="text-xs">
            <span className="text-muted-foreground">
              {lead.coaches_count} Coaches, {lead.clients_count} Clients
            </span>
          </div>
          <div className="text-sm font-semibold text-primary">
            CHF {pricing.monthly.toFixed(0)}
          </div>
        </div>

        {/* Demo Date */}
        {lead.demo_date && (
          <div className="mt-2 flex items-center gap-1 text-xs text-purple-400">
            <Calendar className="h-3 w-3" />
            <span>Demo: {formatDate(lead.demo_date)}</span>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <LeadDetailModal
        lead={lead}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </>
  );
}
