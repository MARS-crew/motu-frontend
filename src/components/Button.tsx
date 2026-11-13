import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'md' | 'lg';
type ButtonColor = 'black' | 'red' | 'blue' | 'danger';

type ButtonProps = {
  title: string;
  appearance?: 'default' | 'auth';
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
  appearance = 'default',
  subtitle,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'lg',
  color = 'black',
}: ButtonProps) {
  const isAuth = appearance === 'auth';
  const isDisabled = disabled || isLoading;
  const isPrimary = variant === 'primary';
  const buttonColorClassName = isDisabled
    ? 'bg-motu-border'
    : isPrimary
      ? PRIMARY_BUTTON_COLOR_STYLE[color]
      : isAuth
        ? 'border border-motu-border bg-motu-surface-card'
        : 'border border-motu-grey-lighter bg-white';
  const textColorClassName = isDisabled
    ? isAuth
      ? 'text-motu-text-tertiary'
      : 'text-motu-disabled'
    : isPrimary
      ? isAuth
        ? 'text-motu-on-cta'
        : 'text-white'
      : isAuth
        ? 'text-motu-text-primary'
        : 'text-motu-black';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      onPress={onPress}
      disabled={isDisabled}
      className={`items-center justify-center ${isAuth ? 'rounded-auth-input' : 'rounded-xl'} ${buttonColorClassName} ${isAuth && size === 'md' ? 'h-[44px]' : BUTTON_SIZE_STYLE[size]}`}
    >
      {isLoading && !isAuth ? (
        <ActivityIndicator color={isDisabled ? '#B0B8C1' : isPrimary ? 'white' : '#2E3138'} />
      ) : (
        <>
          <Text
            className={`font-pretendard-bold ${isAuth ? 'text-[15px] leading-[20px] text-no-font-padding' : subtitle ? 'text-sm leading-[18px]' : 'text-[15px] leading-5'} ${
              textColorClassName
            }`}
          >
            {isAuth && isLoading ? '로그인 중…' : title}
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
