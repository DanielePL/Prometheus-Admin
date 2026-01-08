import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InfluencerStats } from "@/components/influencers/InfluencerStats";
import { InfluencerPipeline } from "@/components/influencers/InfluencerPipeline";
import { InfluencerForm } from "@/components/influencers/InfluencerForm";
import {
  INFLUENCER_CATEGORIES,
  CATEGORY_LABELS,
  TEAM_MEMBERS,
} from "@/api/types/influencers";
import { cn } from "@/lib/utils";

export default function InfluencersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [contactFilter, setContactFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Influencer CRM</h1>
          <p className="text-muted-foreground">
            Manage your influencer partnerships
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Influencer
        </Button>
      </div>

      {/* Stats */}
      <InfluencerStats />

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by handle, name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {(categoryFilter || contactFilter) && (
              <span className="ml-2 rounded-full bg-primary-foreground text-primary px-2 py-0.5 text-xs">
                {[categoryFilter, contactFilter].filter(Boolean).length}
              </span>
            )}
          </Button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="rounded-xl bg-card p-4 space-y-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter("")}
                  className={cn(
                    "rounded-full px-3 py-1 text-sm transition-colors",
                    !categoryFilter
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  All
                </button>
                {INFLUENCER_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      "rounded-full px-3 py-1 text-sm transition-colors",
                      categoryFilter === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Person Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned To</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setContactFilter("")}
                  className={cn(
                    "rounded-full px-3 py-1 text-sm transition-colors",
                    !contactFilter
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  All
                </button>
                {TEAM_MEMBERS.map((member) => (
                  <button
                    key={member}
                    onClick={() => setContactFilter(member)}
                    className={cn(
                      "rounded-full px-3 py-1 text-sm transition-colors",
                      contactFilter === member
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {member}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(categoryFilter || contactFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCategoryFilter("");
                  setContactFilter("");
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pipeline View */}
      <InfluencerPipeline
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        contactFilter={contactFilter}
      />

      {/* Add Form Modal */}
      <InfluencerForm isOpen={showAddForm} onClose={() => setShowAddForm(false)} />
    </div>
  );
}
