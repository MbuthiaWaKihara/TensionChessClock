import React from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
} from 'react-native';
import InputSpinner from "react-native-input-spinner";

const ChangeTime = ({label, settings}) => {
    return(
        <>
            <KeyboardAvoidingView>
            <View
                style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 3,
                        paddingBottom: 3,
                        width: '100%',
                        justifyContent: 'space-around'
                    }}
                >
                        <Text
                        style={{
                            marginTop: 20,
                        }}
                        >
                            {label}:
                        </Text>
                        <View
                        >
                            <InputSpinner
                                max={settings.max}
                                min={settings.min}
                                step={1}
                                colorMax={"#f04048"}
                                colorMin={"#40c5f4"}
                                value={settings.value}
                                onChange={(num) => {
                                }}
                                width={180}
                                editable={false}
                                onChange={(number) => {
                                    settings.onChange(number);
                                }}
                            />
                        </View>
                </View>
            </KeyboardAvoidingView>
        </>
    );
}

export default React.memo(ChangeTime);