import { useQuery } from '@tanstack/react-query';

import {
  getSignupAvailability,
  SIGNUP_AVAILABILITY_SCHEMAS,
  type SignupAvailabilityField,
} from '@/apis/signup';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export function useSignupAvailabilityQuery(field: SignupAvailabilityField, value: string) {
  const debounced = useDebouncedValue(value);
  const query = useQuery({
    queryKey: ['signup', 'availability', field, debounced],
    queryFn: ({ signal }) => getSignupAvailability(field, debounced, signal),
    enabled: debounced === value && SIGNUP_AVAILABILITY_SCHEMAS[field].safeParse(value).success,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
  return { ...query, checkedValue: debounced };
}
