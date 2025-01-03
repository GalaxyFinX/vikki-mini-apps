import {IChevronDown} from '../../assets';
import {Colors, Size, Typography} from '@galaxyfinx/react-native-common-ui';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';

const ScrollBottomButton = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.buttonContainer}>
      <IChevronDown baseColor={Colors.Icon.Base} style={styles.icon} />
      <Text style={styles.text}>{t('customerService.latestMessage')}</Text>
    </View>
  );
};

export default ScrollBottomButton;

const styles = StyleSheet.create({
  text: {
    ...Typography.TextButton.Small,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: Size.hs(12),
  },
});
