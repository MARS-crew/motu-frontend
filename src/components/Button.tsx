import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'md' | 'lg';
type ButtonColor = 'black' | 'red' | 'blue' | 'danger';

type ButtonProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
};

const PRIMARY_BUTTON_COLOR_STYLE = {
  black: 'bg-motu-black',
  red: 'bg-motu-red',
  danger: 'bg-motu-btn-red',
  blue: 'bg-motu-blue',
};

const BUTTON_SIZE_STYLE = {
  md: 'h-11',
  lg: 'h-[52px]',
};

export function Button({
  title,
  subtitle,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'lg',
  color = 'black',
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const isPrimary = variant === 'primary';
  const buttonColorClassName = isDisabled
    ? 'bg-motu-border'
    : isPrimary
      ? PRIMARY_BUTTON_COLOR_STYLE[color]
      : 'border border-motu-grey-lighter bg-white';
  const textColorClassName = isDisabled
    ? 'text-motu-disabled'
    : isPrimary
      ? 'text-white'
      : 'text-motu-black';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`items-center justify-center rounded-xl ${buttonColorClassName} ${BUTTON_SIZE_STYLE[size]}`}
    >
      {isLoading ? (
        <ActivityIndicator color={isDisabled ? '#B0B8C1' : isPrimary ? 'white' : '#2E3138'} />
      ) : (
        <>
          <Text
            className={`font-pretendard-bold ${subtitle ? 'text-sm leading-[18px]' : 'text-[15px] leading-5'} ${
              textColorClassName
            }`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className={`font-pretendard-medium text-[11px] leading-[14px] ${
                isDisabled ? 'text-motu-disabled' : 'text-white/80'
              }`}
            >
              {subtitle}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
}
