export type ListingApplicationStatus =
  'draft' | 'received' | 'reviewing' | 'supplementRequested' | 'approved' | 'rejected';

export type ListingApplicationFilter = 'all' | ListingApplicationStatus;

export type ListingSubmittedApplication = {
  id: string;
  name: string;
  status: Exclude<ListingApplicationStatus, 'draft'>;
  submittedDate: string;
  receiptNumber?: string;
};

export type ListingApplicationListItem =
  | ListingSubmittedApplication
  | {
      id: string;
      name: string;
      status: 'draft';
      savedDate: string;
      step: 1 | 2 | 3 | 4;
    };
