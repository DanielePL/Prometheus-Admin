import { useState } from "react";
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Smartphone,
  Send,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAddNote, useDeleteNote, useDeleteLead } from "@/hooks/useSales";
import { calculatePricing, PAIN_POINT_LABELS } from "@/api/types/sales";
import type { SalesLead, DealStatus } from "@/api/types/sales";

interface LeadDetailModalProps {
  lead: SalesLead;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<DealStatus, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-500" },
  contacted: { label: "Contacted", color: "bg-yellow-500" },
  demo: { label: "Demo", color: "bg-purple-500" },
  negotiation: { label: "Negotiation", color: "bg-orange-500" },
  won: { label: "Won", color: "bg-green-500" },
  lost: { label: "Lost", color: "bg-red-500" },
};

export function LeadDetailModal({ lead, isOpen, onClose }: LeadDetailModalProps) {
  const [newNote, setNewNote] = useState("");
  const addNote = useAddNote();
  const deleteNote = useDeleteNote();
  const deleteLead = useDeleteLead();

  const pricing = calculatePricing(
    lead.coaches_count,
    lead.clients_count,
    lead.founding_partner
  );

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote.mutate(
      { leadId: lead.id, content: newNote },
      {
        onSuccess: () => setNewNote(""),
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm("Really delete this lead?")) {
      deleteLead.mutate(lead.id, {
        onSuccess: () => onClose(),
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  const statusConfig = STATUS_CONFIG[lead.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-muted p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{lead.gym_name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className={cn("h-2 w-2 rounded-full", statusConfig.color)} />
                <span className="text-sm text-muted-foreground">
                  {statusConfig.label}
                </span>
                {lead.founding_partner && (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    Founding Partner
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">
          {/* Contact Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-semibold">Contact</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.contact_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${lead.contact_email}`} className="text-primary hover:underline">
                    {lead.contact_email}
                  </a>
                </div>
                {lead.contact_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${lead.contact_phone}`} className="text-primary hover:underline">
                      {lead.contact_phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Size & Price</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.coaches_count} Coaches</span>
                </div>
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.clients_count} Clients</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary">
                    CHF {pricing.monthly.toFixed(0)}/month
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pain Points */}
          {lead.pain_points.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Pain Points</h3>
              <div className="flex flex-wrap gap-2">
                {lead.pain_points.map((pp) => (
                  <span
                    key={pp}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {PAIN_POINT_LABELS[pp] || pp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span>{formatDate(lead.created_at)}</span>
            </div>
            {lead.demo_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span className="text-muted-foreground">Demo:</span>
                <span>{formatDate(lead.demo_date)}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <h3 className="font-semibold">Notes</h3>

            {/* Add Note */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a new note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                className="bg-card"
              />
              <Button onClick={handleAddNote} disabled={addNote.isPending}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note) => (
                  <div
                    key={note.id}
                    className="group relative rounded-lg bg-card p-3"
                  >
                    <p className="text-sm pr-8">{note.content}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      {note.created_by && <span>{note.created_by}</span>}
                      <span>{formatDate(note.created_at)}</span>
                    </div>
                    <button
                      onClick={() => deleteNote.mutate(note.id)}
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No notes yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-muted p-4 flex justify-between">
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Lead
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
