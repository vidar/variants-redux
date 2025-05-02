
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContentSectionProps {
  contentType: string;
  setContentType: (value: string) => void;
  entryUid: string;
  setEntryUid: (value: string) => void;
  locale: string;
  setLocale: (value: string) => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  contentType,
  setContentType,
  entryUid,
  setEntryUid,
  locale,
  setLocale
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Content</h3>
      <div className="space-y-3">
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
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
