import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import { listingImageSchema, type ListingImage } from '@/schemas/listingBasicInfoSchema';

cssInterop(Image, { className: 'style' });

type ListingFileFieldProps = {
  label: string;
  file: ListingImage | null;
  isRequired?: boolean;
  errorMessage?: string;
  onPress: () => void;
};

export function ListingFileField({
  label,
  file,
  isRequired = false,
  errorMessage,
  onPress,
}: ListingFileFieldProps) {
  const hasValidFile = file !== null && listingImageSchema.safeParse(file).success;
  const sizeLabel = file
    ? file.size >= 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)}MB`
      : file.size >= 1024
        ? `${Math.round(file.size / 1024)}KB`
        : `${file.size}B`
    : '';
  const dimensionsLabel = file?.width && file.height ? `${file.width} × ${file.height} · ` : '';
  return (
    <View className="gap-2">
      <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
        {label}
        {isRequired && <Text className="text-motu-btn-red"> *</Text>}
      </Text>
      <View
        className={`${hasValidFile ? 'h-[68px]' : 'min-h-14'} flex-row items-center gap-2.5 rounded-xl border border-dashed bg-white py-3 pl-3 pr-4 ${errorMessage ? 'border-motu-btn-red' : 'border-motu-border'}`}
      >
        {hasValidFile &&
          file &&
          (file.isPreview ? (
            <View
              className={`h-11 items-center justify-center rounded-lg bg-motu-tonal ${isRequired ? 'w-16' : 'w-11'}`}
            >
              <Text className="font-pretendard-semibold text-[11px] leading-[14px] text-motu-text-secondary">
                {isRequired ? 'IMAGE' : 'LOGO'}
              </Text>
            </View>
          ) : (
            <Image
              source={{ uri: file.uri }}
              contentFit="cover"
              className={`h-11 rounded-lg ${isRequired ? 'w-16' : 'w-11'}`}
            />
          ))}
        <View className="min-w-0 flex-1 gap-0.5">
          <Text
            numberOfLines={1}
            className={`font-pretendard-medium ${hasValidFile ? 'text-[13px] leading-[18px] text-motu-text-primary' : 'text-sm leading-5 text-motu-text-tertiary'}`}
          >
            {hasValidFile ? file?.name : isRequired ? '가로형 이미지 권장' : '정사각형 이미지 권장'}
          </Text>
          {hasValidFile && (
            <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-text-tertiary">
              {dimensionsLabel}
              {sizeLabel}
            </Text>
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} ${hasValidFile ? '변경' : '파일 선택'}`}
          onPress={onPress}
          className="rounded-lg bg-motu-tonal px-3 py-2 active:opacity-60"
        >
          <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-primary">
            {hasValidFile ? '변경' : '파일 선택'}
          </Text>
        </Pressable>
      </View>
      {errorMessage && (
        <Text
          accessibilityLiveRegion="polite"
          className="font-pretendard-medium text-xs leading-4 text-motu-btn-red"
        >
          {errorMessage}
        </Text>
      )}
      {isRequired && (
        <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-tertiary">
          JPG·JPEG·PNG / 10MB 이하
        </Text>
      )}
    </View>
  );
}
