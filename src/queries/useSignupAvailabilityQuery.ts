import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getSignupAvailability,
  SIGNUP_AVAILABILITY_SCHEMAS,
  type SignupAvailabilityField,
} from '@/apis/signup';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const getAvailabilityOptions = (field: SignupAvailabilityField, value: string) =>
  queryOptions({
    queryKey: ['signup', 'availability', field, value],
    queryFn: ({ signal }) => getSignupAvailability(field, value, signal),
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

export function useSignupAvailabilityQuery(field: SignupAvailabilityField, value: string) {
  const client = useQueryClient();
  const debounced = useDebouncedValue(value);
  const currentOptions = getAvailabilityOptions(field, value);
  const query = useQuery({
    ...getAvailabilityOptions(field, debounced),
    enabled: debounced === value && SIGNUP_AVAILABILITY_SCHEMAS[field].safeParse(value).success,
  });
  return {
    ...query,
    checkedValue: debounced,
    // 버튼은 디바운스를 기다리지 않고 현재 입력값으로 같은 Query를 조회합니다.
    checkAvailability: () => client.fetchQuery(currentOptions),
  };
}
