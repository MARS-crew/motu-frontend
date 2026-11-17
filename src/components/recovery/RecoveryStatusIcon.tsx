import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { View } from 'react-native';

cssInterop(Image, { className: 'style' });

type RecoveryStatusIconProps = {
  icon: 'mail' | 'clock';
};

export function RecoveryStatusIcon({ icon }: RecoveryStatusIconProps) {
  return (
    <View className="h-[56px] w-[56px] items-center justify-center rounded-full bg-motu-bg-secondary">
      <Image
        source={
          icon === 'mail'
            ? require('../../../assets/icons/recovery/mail.svg')
            : require('../../../assets/icons/recovery/clock.svg')
        }
        className={icon === 'mail' ? 'h-[26px] w-[26px]' : 'h-[22px] w-[22px]'}
        contentFit="contain"
        accessible={false}
      />
    </View>
  );
}
