import React from 'react';
import {
    View,
    Text,
    TouchableNativeFeedback,
} from 'react-native';

const TimeControl = ({timeControl, focusedTime, onPress}) => {

    const displayedTime = (seconds) => {
        let time = new Date(null);
        time.setSeconds(seconds);
        let MHSTime = time.toISOString().substr(11,8);
        let minutes = MHSTime.substring(3,5);
        let hours = MHSTime.substring(0,2);
        let hoursToMinutes = parseInt(hours) * 60;
        return(
            parseInt(minutes) + hoursToMinutes
        );
    }
    return(
        <>
            <TouchableNativeFeedback
            onPress={() => onPress(timeControl.id)}
            >
            <View
            style={{
                width: '100%',
                backgroundColor: focusedTime === timeControl.id ? '#ffffff':'#ebebed',
                borderBottomColor: '#b0b0b0',
                borderBottomWidth: 1,
                padding: 20,
                marginBottom: 2,
                borderBottomStartRadius: 15,
            }}
            >
                        <Text
                        style={{
                            // color: '#b0b0b0',
                            // fontWeight: 'bold',
                        }}
                        >
                            {timeControl.name} {displayedTime(timeControl.seconds)}|{timeControl.increment}
                        </Text>
                    
            </View>
           </TouchableNativeFeedback>
        </>
    );
}

export default React.memo(TimeControl);