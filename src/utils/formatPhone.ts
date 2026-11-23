export function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7)].filter(Boolean).join('-');
}
