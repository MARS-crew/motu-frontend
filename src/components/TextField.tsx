import { Text, TextInput, View, type TextInputProps } from 'react-native';

type TextFieldProps = TextInputProps & {
  label: string;
  errorMessage?: string;
};

export function TextField({ label, errorMessage, ...inputProps }: TextFieldProps) {
  return (
    <View className="gap-1">
      <Text className="text-sm font-medium text-gray-700">{label}</Text>
      <TextInput
        className="rounded-xl border border-gray-300 px-4 py-3 text-base"
        placeholderTextColor="#9CA3AF"
        {...inputProps}
      />
      {errorMessage && <Text className="text-xs text-red-500">{errorMessage}</Text>}
    </View>
  );
}
