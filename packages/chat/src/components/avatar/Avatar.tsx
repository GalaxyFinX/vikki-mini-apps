import {ChatAvatar} from '@assets/new-images';
import {ChatMessage} from '../../customer-service.interface';
import {Size} from '@galaxyfinx/react-native-common-ui';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {AvatarProps} from 'react-native-gifted-chat';

const styles = StyleSheet.create({
  icon: {
    width: Size.ms(32),
    height: Size.ms(32),
  },
});

const Avatar: React.FC<AvatarProps<ChatMessage>> = props => {
  const {position} = props;

  if (position === 'right') {
    return null;
  }
  return (
    <Image
      style={styles.icon}
      source={{uri: 'https://cdn-icons-png.flaticon.com/512/8743/8743954.png'}}
    />
  );
};

export default Avatar;
