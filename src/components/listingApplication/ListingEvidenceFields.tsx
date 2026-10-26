import { Controller, useWatch, type Control, type FieldErrors } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { TextField } from '@/components/TextField';
import { ListingEvidenceItem } from '@/components/listingApplication/ListingEvidenceItem';
import {
  MAX_EVIDENCE_ITEMS,
  type EvidenceItem,
  type ListingEvidenceForm,
} from '@/schemas/listingEvidenceSchema';

type ListingEvidenceFieldsProps = {
  control: Control<ListingEvidenceForm>;
  errors: FieldErrors<ListingEvidenceForm>;
  attachmentError: string | null;
  isPicking: boolean;
  isSaving?: boolean;
  onPick: () => void;
  onHelp: () => void;
  onDelete: (item: EvidenceItem) => void;
  onAddLink: () => void;
  onDescriptionLayout: (offset: number) => void;
};

export function ListingEvidenceFields({
  control,
  errors,
  attachmentError,
  isPicking,
  isSaving = false,
  onPick,
  onHelp,
  onDelete,
  onAddLink,
  onDescriptionLayout,
}: ListingEvidenceFieldsProps) {
  const items = useWatch({ control, name: 'items' });
  const hasReachedLimit = items.length >= MAX_EVIDENCE_ITEMS;
  return (
    <>
      <View className="h-[18px] flex-row items-center gap-1">
        <Text className="flex-1 font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
          증빙 파일
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="첨부 가능한 자료 안내"
          onPress={onHelp}
          hitSlop={8}
          className="h-[18px] w-[18px] items-center justify-center rounded-full bg-motu-tonal"
        >
          <Text className="font-pretendard-bold text-[11px] leading-[14px] text-motu-text-secondary">
            ?
          </Text>
        </Pressable>
      </View>
      <View className="gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="증빙 파일 선택"
          accessibilityState={{ disabled: isPicking || isSaving || hasReachedLimit }}
          disabled={isPicking || isSaving || hasReachedLimit}
          onPress={onPick}
          className={`h-10 w-[84px] items-center justify-center self-start rounded-[10px] bg-motu-grey-lighter px-[18px] ${isPicking || hasReachedLimit ? 'opacity-50' : ''}`}
        >
          {isPicking ? (
            <ActivityIndicator />
          ) : (
            <Text className="font-pretendard-medium text-xs leading-4 text-motu-black">
              파일 선택
            </Text>
          )}
        </Pressable>
        <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
          첨부 가능 형식: JPG, JPEG, PNG, PDF
        </Text>
        {(attachmentError || errors.items?.message || hasReachedLimit) && (
          <Text
            accessibilityLiveRegion="polite"
            className={`font-pretendard-medium text-xs leading-4 ${attachmentError || errors.items?.message ? 'text-motu-red' : 'text-motu-grey'}`}
          >
            {attachmentError ||
              errors.items?.message ||
              '파일과 링크를 합산해 최대 10개까지 등록할 수 있습니다.'}
          </Text>
        )}
      </View>
      <View className="flex-row items-center gap-1">
        <Text className="flex-1 font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
          등록 항목
        </Text>
        <Text
          accessibilityLiveRegion="polite"
          className="font-pretendard-medium text-xs leading-4 text-motu-text-tertiary"
        >
          {items.length}/{MAX_EVIDENCE_ITEMS}
        </Text>
      </View>
      {items.length > 0 && (
        <View className="gap-2">
          {items.map((item) => (
            <ListingEvidenceItem
              key={item.id}
              item={item}
              disabled={isSaving}
              onDelete={() => onDelete(item)}
            />
          ))}
        </View>
      )}
      <Controller
        control={control}
        name="linkUrl"
        render={({ field }) => (
          <TextField
            label="외부 링크 URL"
            editable={!isSaving}
            placeholder="https://"
            hasBaselineOffset={false}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            errorMessage={errors.linkUrl?.message}
            inputAction={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="외부 링크 추가"
                disabled={hasReachedLimit || isSaving}
                onPress={onAddLink}
                className={`h-[50px] w-[47px] items-center justify-center rounded-lg bg-motu-tonal px-3 ${hasReachedLimit ? 'opacity-50' : ''}`}
              >
                <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-primary">
                  추가
                </Text>
              </Pressable>
            }
          />
        )}
      />
      <View onLayout={(event) => onDescriptionLayout(event.nativeEvent.layout.y)}>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextField
              label="자료 설명"
              editable={!isSaving}
              isRequired
              multiline
              multilineSize="short"
              hasBaselineOffset={false}
              placeholder="자료에 대한 설명을 입력해 주세요."
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              errorMessage={errors.description?.message}
            />
          )}
        />
      </View>
    </>
  );
}
