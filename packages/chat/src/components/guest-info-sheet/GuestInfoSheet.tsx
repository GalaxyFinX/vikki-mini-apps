import {
  PHONE_VALID_REGEX,
  STORAGE_KEY,
  VIETNAMESE_NAME_REGEX,
} from '../../constants';
// import {navigate} from '@navigations';
import {
  ActionButton,
  BottomSheetContainer,
  BottomSheetContainerMethod,
  FormInput,
  SheetProps,
} from '@galaxyfinx/react-native-common-ui';
import {
  GUEST_NAME_MAX_LENGTH,
  GUEST_NAME_MIN_LENGTH,
  GUEST_PHONE_MAX_LENGTH,
} from '../../customer-service.constants';
import {
  ChatScreenParams,
  GuestInformation,
} from '../../customer-service.interface';
import {Storage} from '../../utils';
import {Colors, Size, Typography} from '@galaxyfinx/react-native-common-ui';
import {useFormik} from 'formik';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import * as Yup from 'yup';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Size.hs(16),
  },
  titleWrapper: {
    height: Size.ms(56),
    marginBottom: Size.vs(24),
  },
  titleText: {
    ...Typography.TextTitle.XLarge,
  },
  labelWrapper: {
    height: Size.ms(16),
  },
  labelText: {
    ...Typography.TextBody.Small,
    color: Colors.TextBlack.Secondary,
  },
  inputWrapper: {
    height: Size.ms(52),
    marginBottom: Size.vs(32),
  },
  text: {
    ...Typography.TextBody.XLarge,
  },
  errorMessage: {
    ...Typography.TextBody.Small,
    color: Colors.TextSupport.Error,
  },
});

export interface GuestInfoSheetProps extends SheetProps {}

const GuestInfoSheet: React.FC<GuestInfoSheetProps> = ({id}) => {
  const {t} = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const modal = useRef<BottomSheetContainerMethod>(null);
  const phoneRef = useRef<TextInput>(null);

  const validationSchema = Yup.object({
    guestName: Yup.string()
      .required(t('customerService.nameErrorText'))
      .min(3, t('customerService.nameErrorText'))
      .max(50, t('customerService.nameErrorText'))
      .matches(VIETNAMESE_NAME_REGEX, t('customerService.nameErrorText')),
    guestPhone: Yup.string()
      .required(t('customerService.phoneErrorText'))
      .matches(PHONE_VALID_REGEX, t('customerService.phoneErrorText')),
  });

  const {
    values,
    errors,
    setValues,
    validateField,
    setFieldValue,
    setFieldError,
    isValid,
  } = useFormik({
    initialValues: {
      guestName: '',
      guestPhone: '',
    },
    validationSchema: validationSchema,
    onSubmit: () => onAction(),
  });

  const autoFillUserInfoFromStorage = () => {
    try {
      const userInfo = Storage.retrieve(
        STORAGE_KEY.GUEST_INFORMATION,
      ) as GuestInformation;

      if (userInfo) {
        setValues({
          guestName: userInfo.name,
          guestPhone: userInfo.phone,
        });
      }
    } catch (error) {
      return false;
    }
  };

  const buttonState = useMemo(() => {
    return isValid ? 'enabled' : 'disabled';
  }, [isValid]);

  useEffect(() => {
    autoFillUserInfoFromStorage();
  }, []);

  useEffect(() => {
    if (name.length >= GUEST_NAME_MIN_LENGTH) {
      validateField('guestName');
    } else {
      setFieldError('guestName', '');
    }
  }, [name.length]);

  useEffect(() => {
    if (phone.length === GUEST_PHONE_MAX_LENGTH) {
      validateField('guestPhone');
    } else {
      setFieldError('guestPhone', '');
    }
  }, [phone.length]);

  const onAction = () => {
    Keyboard.dismiss();
    if (modal && modal.current) {
      modal.current.close();
    }
    const info: ChatScreenParams = {
      name: values.guestName,
      phone: values.guestPhone,
      isAuthenticated: false,
    };
    Storage.save(STORAGE_KEY.GUEST_INFORMATION, info);
    // navigate(ROUTES.CUSTOMER_SERVICE.CHAT_SCREEN, info);
  };

  const onSubmitName = () => {
    validateField('guestName');
    if (phoneRef && phoneRef.current) {
      phoneRef.current.focus();
    }
  };

  const onChangeName = (text: string) => {
    setFieldValue('guestName', text, false);
    setName(text);
  };

  const onChangePhone = (text: string) => {
    if (text) {
      setFieldValue('guestPhone', text, false);
      setPhone(text);
    }
  };

  return (
    <BottomSheetContainer id={id} ref={modal}>
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>{t('customerService.title')}</Text>
        </View>
        <View style={styles.labelWrapper}>
          <Text style={styles.labelText}>{t('customerService.nameLabel')}</Text>
        </View>
        <FormInput
          onSubmitEditing={onSubmitName}
          autoCorrect={false}
          returnKeyType={'next'}
          defaultValue={values.guestName}
          style={styles.text}
          onChangeText={onChangeName}
          errorStyle={styles.errorMessage}
          containerStyle={styles.inputWrapper}
          errorTitle={errors.guestName}
          maxLength={GUEST_NAME_MAX_LENGTH}
          placeholder={t('customerService.namePlaceHolder')}
        />
        <View style={styles.labelWrapper}>
          <Text style={styles.labelText}>
            {t('customerService.phoneNumberLabel')}
          </Text>
        </View>
        <FormInput
          ref={phoneRef}
          autoCorrect={false}
          returnKeyType={'go'}
          keyboardType={'number-pad'}
          defaultValue={values.guestPhone}
          style={styles.text}
          onChangeText={onChangePhone}
          errorStyle={styles.errorMessage}
          containerStyle={styles.inputWrapper}
          errorTitle={errors.guestPhone}
          maxLength={GUEST_PHONE_MAX_LENGTH}
          placeholder={t('customerService.phoneNumberPlaceHolder')}
        />
        <ActionButton
          onPress={onAction}
          state={buttonState}
          type={'primary'}
          title={t('customerService.letsChatText')}
        />
      </View>
    </BottomSheetContainer>
  );
};
export default GuestInfoSheet;
