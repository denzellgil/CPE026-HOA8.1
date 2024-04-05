import React from 'react';
import { StyleSheet, View, Text, BackHandler, Image, TouchableHighlight, Keyboard } from 'react-native';
import * as Location from 'expo-location'; // Correct import statement for Location
import MessageList from './components/MessageList';
import { createTextMessage, createImageMessage, createLocationMessage } from './utils/MessageUtils';
import Toolbar from "./components/Toolbar";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        createImageMessage(require('./assets/hakari.jpg')),
        createTextMessage('World'),
        createTextMessage('Hello!'),
        createLocationMessage({
          latitude: 14.6488,
          longitude: 121.0509,
        }),
      ],
      fullscreenImageId: null,
      isInputFocused: false,
    };
    this.subscription = null;
  }

  dismissFullScreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  handlePressMessage = ({ id, type }) => {
    switch (type) {
      case 'text':
        break;
      case 'image':
        if (this.state.isInputFocused) {
          Keyboard.dismiss();
          this.setState({ isInputFocused: false });
        }
        this.setState({ fullscreenImageId: id });
        break;
      default:
        break;
    }
  };

  UNSAFE_componentWillMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;
      if (fullscreenImageId) {
        this.dismissFullScreenImage();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove();
    }
  }

  renderToolbar() {
    const { isInputFocused } = this.state;
    return (
      <Toolbar
        isFocused={isInputFocused}
        onSubmit={this.handleSubmit}
        onChangeFocus={this.handleChangeFocus}
        onPressCamera={this.handlePressToolbarCamera}
        onPressLocation={this.handlePressToolbarLocation}
      />
    );
  }

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;
    if (!fullscreenImageId) return null;
    const image = messages.find((message) => message.id === fullscreenImageId);
    if (!image || image.type !== 'image') return null;
  
    const { uri } = image; // Make sure that `uri` is properly extracted from the image object
  
    return (
      <View style={styles.fullscreenOverlay}>
        <TouchableHighlight
          style={styles.fullscreenOverlay}
          onPress={this.dismissFullScreenImage}
        >
          <Image style={styles.fullscreenImage} source={{ uri: `uri` }} /> {/* Pass `uri` as string to source */}
        </TouchableHighlight>
      </View>
    );
  };
  

  renderMessageList() {
    const { messages } = this.state;
    return (
      <View style={styles.messageContent}>
        <MessageList messages={messages}
          onPressMessage={this.handlePressMessage} />
      </View>
    );
  }

  handlePressToolbarCamera = () => {
    // Handle camera press
  };

  handlePressToolbarLocation = async () => {
    try {
     const { status } = await Location.requestForegroundPermissionsAsync(); // Request location permission
      if (status !== 'granted') {
        console.error('Location permission not granted');
        return;
      }

      const location = await Location.getCurrentPositionAsync({}); // Get current location
      const { latitude, longitude } = location.coords;

      this.setState({
        messages: [
          createLocationMessage({
            latitude,
            longitude,
          }),
          ...this.state.messages,
        ],
      });
    } catch (error) {
      console.error(error);
    } 
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handleSubmit = (text) => {
    const { messages } = this.state;
    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderMessageList()}
        {this.renderToolbar()}
        {this.renderFullscreenImage()}
        <View style={styles.inputMethod}>
          <Text> Denzell Gil </Text>
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    flex: 1,
    backgroundColor: '#4df0ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    textAlign: 'center'
  },
  toolbarSpace: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: '#72D4F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'flex-start'
  },
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)', // Dark background for overlay
    justifyContent: 'center', // Center the image
    alignItems: 'center', // Center the image
    zIndex: 100, // Make sure it covers everything else
  },
  fullscreenImage: {
    width: '100%', // Full width
    height: '100%', // Full height
    resizeMode: 'contain'
  },
});
