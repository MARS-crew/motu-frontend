import type { EvidenceItem, ListingEvidenceForm } from '@/schemas/listingEvidenceSchema';

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
    | {
        status: 'supplementRequested';
        receiptNumber: string;
        supplementDeadline: string;
        adminOpinion: string;
        evidence: ListingEvidenceForm;
      }
    | {
        status: 'reviewing';
        receiptNumber: string;
        supplementSubmittedAt: string;
        evidence: ListingEvidenceForm;
      }
    | { status: 'approved' }
    | { status: 'rejected' }
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
