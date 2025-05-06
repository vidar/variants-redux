
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentType } from '@/hooks/useContentTypes';
import { Entry } from '@/hooks/useEntries';
import { Language } from '@/hooks/useLanguages';
import { RefreshCw } from "lucide-react";

interface ContentSectionProps {
  contentType: string;
  setContentType: (value: string) => void;
  entryUid: string;
  setEntryUid: (value: string) => void;
  locale: string;
  setLocale: (value: string) => void;
  includeAll: boolean;
  setIncludeAll: (value: boolean) => void;
  contentTypes: ContentType[];
  isLoadingContentTypes: boolean;
  contentTypesError: string | null;
  refreshContentTypes: () => void;
  entries: Entry[];
  isLoadingEntries: boolean;
  entriesError: string | null;
  refreshEntries: () => void;
  languages: Language[];
  isLoadingLanguages: boolean;
  languagesError: string | null;
  refreshLanguages: () => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  contentType,
  setContentType,
  entryUid,
  setEntryUid,
  locale,
  setLocale,
  includeAll,
  setIncludeAll,
  contentTypes,
  isLoadingContentTypes,
  contentTypesError,
  refreshContentTypes,
  entries,
  isLoadingEntries,
  entriesError,
  refreshEntries,
  languages,
  isLoadingLanguages,
  languagesError,
  refreshLanguages
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // When content type changes, reset entry UID
  useEffect(() => {
    setEntryUid('');
  }, [contentType, setEntryUid]);

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
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="contentType">Content Type</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={refreshContentTypes}
                disabled={isLoadingContentTypes}
                className="h-7 px-2 text-xs"
              >
                {isLoadingContentTypes ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                    Loading...
                  </>
                ) : (
                  'Refresh'
                )}
              </Button>
            </div>
            {contentTypes.length > 0 ? (
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger id="contentType">
                  <SelectValue placeholder="Select a content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((ct) => (
                    <SelectItem key={ct.uid} value={ct.uid}>
                      {ct.title} ({ct.uid})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="mb-2">
                <Input
                  id="contentType"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  placeholder={isLoadingContentTypes ? "Loading content types..." : "e.g., blog_post"}
                  disabled={isLoadingContentTypes}
                />
                {contentTypesError && (
                  <p className="text-xs text-red-500 mt-1">{contentTypesError}</p>
                )}
                {!contentTypesError && !isLoadingContentTypes && contentTypes.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No content types found. Check your API key and management token.
                  </p>
                )}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="entryUid">Entry</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={refreshEntries}
                disabled={isLoadingEntries || !contentType}
                className="h-7 px-2 text-xs"
              >
                {isLoadingEntries ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                    Loading...
                  </>
                ) : (
                  'Refresh'
                )}
              </Button>
            </div>
            {entries.length > 0 ? (
              <Select value={entryUid} onValueChange={setEntryUid}>
                <SelectTrigger id="entryUid">
                  <SelectValue placeholder="Select an entry" />
                </SelectTrigger>
                <SelectContent>
                  {entries.map((entry) => (
                    <SelectItem key={entry.uid} value={entry.uid}>
                      {entry.title || entry.uid}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="mb-2">
                <Input
                  id="entryUid"
                  value={entryUid}
                  onChange={(e) => setEntryUid(e.target.value)}
                  placeholder={isLoadingEntries ? "Loading entries..." : "e.g., blt1234567890abcdef"}
                  disabled={isLoadingEntries}
                />
                {entriesError && (
                  <p className="text-xs text-red-500 mt-1">{entriesError}</p>
                )}
                {!entriesError && !isLoadingEntries && contentType && entries.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No entries found for this content type.
                  </p>
                )}
                {!contentType && (
                  <p className="text-xs text-gray-500 mt-1">
                    Select a content type to load entries.
                  </p>
                )}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="locale">Locale</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={refreshLanguages}
                disabled={isLoadingLanguages}
                className="h-7 px-2 text-xs"
              >
                {isLoadingLanguages ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                    Loading...
                  </>
                ) : (
                  'Refresh'
                )}
              </Button>
            </div>
            {languages.length > 0 ? (
              <Select value={locale} onValueChange={setLocale}>
                <SelectTrigger id="locale">
                  <SelectValue placeholder="Select a locale" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name} ({language.code})
                      {language.fallback_locale && (
                        <span className="text-xs text-muted-foreground ml-2">
                          → {language.fallback_locale}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="mb-2">
                <Input
                  id="locale"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  placeholder={isLoadingLanguages ? "Loading locales..." : "e.g., en-us"}
                  disabled={isLoadingLanguages}
                />
                {languagesError && (
                  <p className="text-xs text-red-500 mt-1">{languagesError}</p>
                )}
                {!languagesError && !isLoadingLanguages && languages.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No locales found. Check your API key and management token.
                  </p>
                )}
              </div>
            )}
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
