export function formatListingDate(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export function getListingDraftRoute(step = 1) {
  switch (step) {
    case 4:
      return '/listing-application/evidence' as const;
    case 3:
      return '/listing-application/service-metrics' as const;
    case 2:
      return '/listing-application/trading-info' as const;
    default:
      return '/listing-application/basic-info' as const;
  }
}
