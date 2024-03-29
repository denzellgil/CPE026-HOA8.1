import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import MessageList from './components/MessageList';
import { createTextMessage, createImageMessage, createLocationMessage } from './utils/MessageUtils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        createImageMessage(require('./assets/hakari.jpg')),
        createTextMessage('World'),
        createTextMessage('Hello'),
        createLocationMessage({
          latitude: 14.6488,
          longitude: 121.0509,
        }),
      ],
      fullScreenImageUri: null,
    };
  }

  handlePressMessage = (message) => {
    if (message.type === 'image') {
      this.setState({ fullScreenImageUri: message.imageUri });
    }
  };

  handleCloseFullScreenImage = () => {
    this.setState({ fullScreenImageUri: null });
  };

  renderMessageList() {
    const { messages } = this.state;
    return (
      <View style={styles.messageContent}>
        <MessageList messages={messages} onPressMessage={this.handlePressMessage} />
      </View>
    );
  }

  render() {
    const { fullScreenImageUri } = this.state;
    return (
      <View style={styles.container}>
        {this.renderMessageList()}
        <Modal visible={!!fullScreenImageUri} transparent>
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={this.handleCloseFullScreenImage}>
            <Image source={{ uri: fullScreenImageUri }} style={styles.fullScreenImage} resizeMode="contain" />
          </TouchableOpacity>
        </Modal>
        <View style={styles.toolbarSpace}>
          <Text> Denzell Gil</Text>
        </View>
        <View style={styles.inputMethod}>
          <Text> JUMPJUTSU KAISEN IS BACK #JJK255</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  messageContent: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethod: {
    flex: 1,
    backgroundColor: '#34ebe1',
    padding: 15,
    alignItems: 'center',
  },
  toolbarSpace: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: '#f5585b',
    padding: 15,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenHeight,
  },
});
