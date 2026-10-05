import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export function Button({ title, onPress, isLoading = false, disabled = false }: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`items-center rounded-xl bg-black py-4 ${isDisabled ? 'opacity-50' : ''}`}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-base font-bold text-white">{title}</Text>
      )}
    </Pressable>
  );
}
