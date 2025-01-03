import {IArrowLeft, IMenuVertical, IPhoneCall} from '../../assets';
import {BaseButton} from '@galaxyfinx/react-native-common-ui';
import {CHAT_SCREEN_TEST_ID} from '../../customer-service.constants';
import {Colors, Size, Typography} from '@galaxyfinx/react-native-common-ui';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Size.vs(4),
    paddingHorizontal: Size.hs(16),
    backgroundColor: Colors.BG.White,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    marginLeft: Size.hs(64),
    marginRight: Size.hs(12),
  },
  callCenterWrapper: {
    marginRight: Size.hs(16),
  },
  title: {
    ...Typography.TextHeading.XSmall,
  },
});

interface SimpleHeaderProps {
  title: string;
  allowGoBack: boolean;
  goBackTestID: string;
  callCenterAction: () => void;
  openChatOptions: () => void;
}

const ChatScreenHeader: React.FC<Partial<SimpleHeaderProps>> = ({
  title,
  allowGoBack = true,
  goBackTestID = 'Back',
  callCenterAction,
  openChatOptions,
}) => {
  const insets = useSafeAreaInsets();
  const paddingTop = Math.max(Size.vs(40), insets.top);

  return (
    <View style={[styles.container, {paddingTop}]}>
      {allowGoBack ? (
        <BaseButton onPress={() => {}}>
          <IArrowLeft baseColor={Colors.Icon.Base} />
        </BaseButton>
      ) : null}
      <View style={styles.mainContent}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>
      <BaseButton
        testID={`${CHAT_SCREEN_TEST_ID}.callCenter`}
        onPress={callCenterAction}
        style={styles.callCenterWrapper}>
        <IPhoneCall baseColor={Colors.Icon.Base} />
      </BaseButton>
      <BaseButton
        testID={`${CHAT_SCREEN_TEST_ID}.chatOptions`}
        onPress={openChatOptions}>
        <IMenuVertical baseColor={Colors.Icon.Base} />
      </BaseButton>
    </View>
  );
};

export default ChatScreenHeader;
