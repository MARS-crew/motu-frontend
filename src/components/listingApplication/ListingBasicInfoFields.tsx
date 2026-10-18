import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View, Text, type TextInputProps } from 'react-native';

import { TextField } from '@/components/TextField';
import { ListingCategoryField } from '@/components/listingApplication/ListingCategoryField';
import { ListingFileField } from '@/components/listingApplication/ListingFileField';
import { type ListingBasicInfoForm } from '@/schemas/listingBasicInfoSchema';

type TextFieldName = Exclude<keyof ListingBasicInfoForm, 'logo' | 'coverImage' | 'category'>;

type ListingBasicInfoFieldsProps = {
  control: Control<ListingBasicInfoForm>;
  errors: FieldErrors<ListingBasicInfoForm>;
  onFieldLayout: (field: keyof ListingBasicInfoForm, offset: number) => void;
  onImagePress: (field: 'logo' | 'coverImage') => void;
};

export function ListingBasicInfoFields({
  control,
  errors,
  onFieldLayout,
  onImagePress,
}: ListingBasicInfoFieldsProps) {
  const renderTextField = (
    name: TextFieldName,
    label: string,
    props: TextInputProps & { isRequired?: boolean } = {},
  ) => (
    <View
      onLayout={(event) => {
        onFieldLayout(name, event.nativeEvent.layout.y);
      }}
    >
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <TextField
            label={label}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            inputRef={ref}
            style={{
              includeFontPadding: false,
              textAlignVertical: props.multiline ? 'top' : 'center',
            }}
            errorMessage={errors[name]?.message}
            {...props}
          />
        )}
      />
    </View>
  );

  return (
    <>
      {renderTextField('serviceName', '서비스명', {
        isRequired: true,
        placeholder: '입력해 주세요.',
      })}
      {renderTextField('introduction', '한 줄 소개', {
        isRequired: true,
        placeholder: '입력해 주세요.',
      })}
      {renderTextField('description', '상세 설명', {
        multiline: true,
        placeholder: '서비스의 목적과 주요 기능을 2~3문장으로 소개해주세요',
      })}
      <View
        onLayout={(event) => {
          onFieldLayout('category', event.nativeEvent.layout.y);
        }}
      >
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <ListingCategoryField
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.category?.message}
            />
          )}
        />
      </View>
      <View
        onLayout={(event) => {
          onFieldLayout('logo', event.nativeEvent.layout.y);
        }}
      >
        <Controller
          control={control}
          name="logo"
          render={({ field }) => (
            <ListingFileField
              label="로고 파일"
              file={field.value}
              errorMessage={errors.logo?.message}
              onPress={() => onImagePress('logo')}
            />
          )}
        />
      </View>
      <View
        onLayout={(event) => {
          onFieldLayout('coverImage', event.nativeEvent.layout.y);
        }}
      >
        <Controller
          control={control}
          name="coverImage"
          render={({ field }) => (
            <ListingFileField
              label="대표 이미지"
              isRequired
              file={field.value}
              errorMessage={errors.coverImage?.message}
              onPress={() => onImagePress('coverImage')}
            />
          )}
        />
      </View>
      {renderTextField('officialUrl', '공식 URL', {
        placeholder: 'https://',
        keyboardType: 'url',
        autoCapitalize: 'none',
        autoCorrect: false,
      })}
      <Text
        accessibilityRole="header"
        className="pt-2 font-pretendard-bold text-[15px] leading-5 text-motu-text-primary"
      >
        운영사·담당자 정보
      </Text>
      {renderTextField('companyName', '운영사명', {
        isRequired: true,
        placeholder: '예: 마스외전',
      })}
      {renderTextField('contactName', '담당자명', {
        isRequired: true,
        placeholder: '예: 김민혁',
      })}
      {renderTextField('email', '업무용 이메일', {
        isRequired: true,
        placeholder: '예: plan@example.com',
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        autoCorrect: false,
      })}
      {renderTextField('phone', '담당자 연락처', {
        isRequired: true,
        placeholder: '예: 010-1234-5678',
        keyboardType: 'phone-pad',
      })}
    </>
  );
}
