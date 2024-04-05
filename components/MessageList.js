import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const keyExtractor = item => item.id.toString();

export default class MessageList extends React.Component {

    renderMessageItem = ({ item }) => { 
        const { onPressMessage } = this.props;
        return (
            <View key={item.id} style={styles.messageRow}>
            <TouchableOpacity onPress={() => onPressMessage (item)}> 
                {this.renderMessageBody (item)}
            </TouchableOpacity>
        </View> 
        );
    };

    renderMessageBody = ({ type, text, uri, coordinate}) => {
    switch (type) {
        case 'text':
            return (
                <View style={styles.messageBubble}>
                    <Text style = {styles.text}> {text} </Text>
                </View>
            );
        case 'image': 
        return (
            <Image
            source={{ uri: 'https://preview.redd.it/made-this-fan-art-for-my-favorite-character-hakari-cant-v0-yp17x9xlnehb1.jpg?width=968&format=pjpg&auto=webp&s=40c4628b1262d9473592bf3203bc7d14fdba7743' }}
            style={styles.image}
            />

        )
        case 'location':
            return (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: coordinate.latitude,
                        longitude: coordinate.longitude,
                        latitudeDelta: 0.0922, // example delta values
                        longitudeDelta: 0.0421, // example delta values
                    }}
                    >
                    <Marker
                        coordinate={{
                        latitude: coordinate.latitude,
                        longitude: coordinate.longitude,
                        }}
                    />
                </MapView>
            );
        default:
            return null;
        };
    };

    render() {
        const { messages } = this.props;
        return (
            <FlatList
                inverted
                style={styles.container}
                data={messages}
                renderItem={this.renderMessageItem}
                keyExtractor={keyExtractor}
                keyboardShouldPersistTaps={'handled'}
            />
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'visible',
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',// Aligns messages to the right
        marginLeft: 60, // Leaves space on the left
        marginRight: 5,
    },
    messageBubble: {
        backgroundColor: '#007AFF',
        borderRadius: 15,
        paddingHorizontal: 10, // Horizontal padding
        paddingVertical: 5, // Vertical padding, less than horizontal to reduce height for short messages
        maxWidth: '80%',
        alignSelf: 'flex-end',
        marginBottom: 5,
        marginTop: 5,
        marginRight: 10,
        minWidth: 50, // Set a minimum width for very short messages
      },
      text: {
        color: 'white',
        fontSize: 16,
        lineHeight: 20, // Ensures text is vertically centered
      },
    image: {
        width: 200, 
        height: 150,
        resizeMode: 'contain',
        borderRadius: 10,
        margin: 10,
        alignSelf: 'flex-end'
    },
    map: {
        width: 250, // Fixed width for the map on the right
        height: Dimensions.get('window').width * 0.7,
        borderRadius: 10,
        margin: 10,
        alignSelf: 'flex-end', // Align map to the right
    }
});