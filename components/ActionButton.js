import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
} from 'react-native';

const ActionButton = ({text, onPress, backgroundColor}) => {
   return(
       <>
       <View
       style={{
           flexDirection: 'row',
           alignItems: 'center',
           justifyContent: 'center',
           paddingBottom: 20,
       }}
       >
            <TouchableOpacity
            style={{
                backgroundColor,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 15,
                width: '100%',
            }}
            onPress={() => onPress()}
            >
                <View>
                    <Text
                    style={{
                        color: '#ffffff',
                        fontWeight: 'bold',
                        fontSize: 20,
                    }}
                    >
                        {text}
                    </Text>
                </View>
            </TouchableOpacity>
       </View>
       </>
   ); 
}

export default React.memo(ActionButton);