import {IChevronRight, IClose, IMailEnvelope} from '../../assets';
import {BaseButton} from '@galaxyfinx/react-native-common-ui';
import {
  Colors,
  Shadow,
  Size,
  Typography,
} from '@galaxyfinx/react-native-common-ui';
import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  tooltipContentWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: Size.hs(16),
    position: 'absolute',
    right: Size.ms(10),
    zIndex: 1,
    height: Size.ms(97),
    borderRadius: Size.ms(16),
    backgroundColor: Colors.Base.White,
    ...Shadow.AboveZ4,
  },
  actionButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    height: Size.ms(33),
  },
  actionTextStyle: {
    width: Size.ms(157),
    marginRight: Size.hs(16),
    ...Typography.TextTitle.Small,
  },
  borderBottomStyle: {
    borderBottomWidth: Size.ms(1),
    borderBottomColor: Colors.Stroke.Dark10,
  },
  adjustMarginLeft: {
    marginLeft: Size.hs(8),
  },
  adjustWidthLongContent: {
    width: Size.ms(181),
  },
  adjustAlignItems: {
    alignItems: 'flex-end',
  },
});

const iconSize = {
  width: Size.ms(16),
  height: Size.ms(16),
};

interface TooltipProps {
  isDisable: boolean;
  onCloseConversationPress: () => void;
  onSendMailPress: () => void;
}

const Tooltip: React.FC<TooltipProps> = props => {
  const {t} = useTranslation();
  const {isDisable, onCloseConversationPress, onSendMailPress} = props;
  const insets = useSafeAreaInsets();
  const marginTop = Math.max(Size.vs(44), insets.top);

  const marginTopAdjust = {marginTop: marginTop + Size.vs(40)};

  return (
    <View style={[styles.tooltipContentWrapper, marginTopAdjust]}>
      <BaseButton
        onPress={onSendMailPress}
        style={[styles.actionButtonWrapper, styles.borderBottomStyle]}>
        <IMailEnvelope {...iconSize} baseColor={Colors.Icon.Base} />
        <Text style={[styles.actionTextStyle, styles.adjustMarginLeft]}>
          {t('customerService.emailUs')}
        </Text>
        <IChevronRight baseColor={Colors.Icon.Base} {...iconSize} />
      </BaseButton>
      <BaseButton
        disabled={isDisable}
        onPress={onCloseConversationPress}
        style={[styles.actionButtonWrapper, styles.adjustAlignItems]}>
        <Text
          style={[
            styles.actionTextStyle,
            styles.adjustWidthLongContent,
            {
              color: isDisable
                ? Colors.TextBlack.Disabled
                : Colors.TextBlack.Primary,
            },
          ]}>
          {t('customerService.closeConversation')}
        </Text>
        <IClose
          baseColor={isDisable ? Colors.TextBlack.Disabled : Colors.Icon.Base}
          {...iconSize}
        />
      </BaseButton>
    </View>
  );
};

export default memo(Tooltip);
