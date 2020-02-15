import React from 'react';
import {
    Alert,
} from 'react-native';

const ErrorFallback = ({dismissAlertBox}) => {
    return(
        <>
            {
                Alert.alert('Oops! This is unexpected',
                'Something went wrong, please try again',
                [{
                    text: 'OKAY',
                    onPress: () => {dismissAlertBox()},
                }])
            }
        </>
    );
}

export default React.memo(ErrorFallback);