import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
} from 'react-native';

const ChangeTimeButton = ({text, customStyle, onPress}) => {
    return(
        <>
            <View
                style={{
                        // borderWidth: 1,
                        // borderColor: '#000000',
                        // alignItems: 'center',
                        // justifyContent: 'center',
                        width: '50%'
                    }}
                >
                    <TouchableOpacity
                    style={{
                        ...customStyle,
                        // width: '45%',
                        padding: 10,
                        backgroundColor: '#b0b0b0',
                        // borderRadius: 18,
                        alignItems: 'center',
                        justifyContent: 'center',
                        // margin: 2,
                    }}
                    onPress={() => onPress()}
                    >
                        <Text>
                            {text}
                        </Text>
                    </TouchableOpacity>
                </View>
        </>
    );
}

export default React.memo(ChangeTimeButton);