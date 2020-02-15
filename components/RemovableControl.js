import React, {
    useState,
} from 'react';
import {
    View,
    Text,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const RemovableControl = ({timeControl, focusedTime, onClickCheckbox}) => {

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

    const [checkboxState, setCheckboxState] = useState(timeControl.targetForRemoval);

    return(
        <>
            <View
            style={{
                width: '100%',
                backgroundColor: '#ffffff',
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
                <View
                style={{
                    alignSelf: 'flex-end',
                    position: 'absolute',
                    top: 15,
                }}
                >
                {
                    timeControl.id !== focusedTime &&
                    <CheckBox
                    onChange={()=> {onClickCheckbox(timeControl.id); setCheckboxState(previousCheckboxState => !previousCheckboxState)}}
                    value={checkboxState}
                    tintColors={{
                        true: '#000000',
                    }}
                    />
                }
                </View>
                    
            </View>
        </>
    );
}

export default RemovableControl;