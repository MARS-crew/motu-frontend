import type { EvidenceItem } from '@/schemas/listingEvidenceSchema';

export type ListingApplicationStatus =
  'draft' | 'received' | 'reviewing' | 'supplementRequested' | 'approved' | 'rejected';

export type ListingApplicationFilter = 'all' | ListingApplicationStatus;

type ListingSubmittedApplicationBase = {
  id: string;
  name: string;
  submittedDate: string;
  receiptNumber?: string;
};

export type ListingSubmittedApplication = ListingSubmittedApplicationBase &
  (
    | { status: 'received'; submittedAt: string; evidenceItems: EvidenceItem[] }
    | { status: Exclude<ListingApplicationStatus, 'draft' | 'received'> }
  );

export type ListingApplicationListItem =
  | ListingSubmittedApplication
  | {
      id: string;
      name: string;
      status: 'draft';
      savedDate: string;
      step: 1 | 2 | 3 | 4;
    };
