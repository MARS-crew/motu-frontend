import { Text, View } from 'react-native';

type OrderInfoRowProps = {
  label: string;
  value: string;
};

export function OrderInfoRow({ label, value }: OrderInfoRowProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-pretendard text-[13px] leading-[19.5px] text-motu-grey">{label}</Text>
      <Text className="font-pretendard-medium text-[13px] leading-[19.5px] text-motu-black">
        {value}
      </Text>
    </View>
  );
}

type OrderTotalRowProps = {
  label: string;
  value: string;
  valueClassName: string;
};

export function OrderTotalRow({ label, value, valueClassName }: OrderTotalRowProps) {
  return (
    <View className="mt-4 flex-row items-center justify-between border-t border-motu-grey-lighter pt-[17px]">
      <Text className="font-pretendard-semibold text-sm leading-[21px] text-motu-black">
        {label}
      </Text>
      <Text className={`font-pretendard-bold text-[17px] leading-[25.5px] ${valueClassName}`}>
        {value}
      </Text>
    </View>
  );
}
