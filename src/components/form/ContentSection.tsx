
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ContentSectionProps {
  contentType: string;
  setContentType: (value: string) => void;
  entryUid: string;
  setEntryUid: (value: string) => void;
  locale: string;
  setLocale: (value: string) => void;
  includeAll: boolean;
  setIncludeAll: (value: boolean) => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  contentType,
  setContentType,
  entryUid,
  setEntryUid,
  locale,
  setLocale,
  includeAll,
  setIncludeAll
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between p-0 hover:bg-transparent">
          <h3 className="font-medium">Content</h3>
          <span className="text-xs text-gray-500">{isOpen ? 'Hide' : 'Show'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label htmlFor="contentType">Content Type</Label>
            <Input
              id="contentType"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              placeholder="e.g., blog_post"
            />
          </div>
          <div>
            <Label htmlFor="entryUid">Entry UID</Label>
            <Input
              id="entryUid"
              value={entryUid}
              onChange={(e) => setEntryUid(e.target.value)}
              placeholder="e.g., blt1234567890abcdef"
            />
          </div>
          <div>
            <Label htmlFor="locale">Locale</Label>
            <Input
              id="locale"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              placeholder="en-us"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="includeAll">Include All</Label>
              <div className="text-xs text-gray-500">Include all referenced content and depth</div>
            </div>
            <Switch
              id="includeAll"
              checked={includeAll}
              onCheckedChange={setIncludeAll}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ContentSection;
