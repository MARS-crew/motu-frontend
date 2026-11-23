// 서버는 연락처를 하이픈 없이(01012345678) 내려주므로, 화면에서는 가운데를 가려 보여 줍니다.
export const maskPhoneNumber = (phoneNumber: string) => {
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length !== 11) return phoneNumber;
  return `${digits.slice(0, 3)}-****-${digits.slice(7)}`;
};
