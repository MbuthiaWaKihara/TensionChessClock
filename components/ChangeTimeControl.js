import React, {
    useState,
    useEffect,
} from 'react';
import {
    View,
    Text,
    TextInput,
    Keyboard,
    Animated,
} from 'react-native';
import ChangeTime from './ChangeTime';
import ChangeTimeButton from './ChangeTimeButton';

const saveButtonStyles = {
    borderBottomStartRadius: 3,
    borderEndWidth: 1,
    borderEndColor: '#000000',
}

const cancelButtonStyles = {
    borderBottomEndRadius: 3,
}

const ChangeTimeControl = ({status, save, cancel, setChangingControl, focusedTime, timeControls}) => {
    const [keyboardIsShown, setKeyboardIsShown] = useState(false);
    const [editingControl, setEditingControl] = useState(false);
    const [fadeOpacity] = useState(new Animated.Value(0));

    //onmount, handle keyboard listeners
    useEffect(
        () => {
            Animated.timing(fadeOpacity,{
                toValue: 1,
                duration: 1000,
            }).start();
            let keybaordUpListener = Keyboard.addListener('keyboardDidShow', keyboardUp);
            let keyboardDownListener = Keyboard.addListener('keyboardDidHide', keyboardDown);
            //if the component is visible because of an edit, we focus on the editing control
            if(status.edit){
                timeControls.forEach((timeControl, index) => {
                    if(timeControl.id === focusedTime){
                        let time = new Date(null);
                        time.setSeconds(timeControl.seconds);
                        let MHSTime = time.toISOString().substr(11,8);
                        let minutes = MHSTime.substring(3,5);
                        let hours = MHSTime.substring(0,2);
                        setEditingControl({
                            name: timeControl.name,
                            hours,
                            minutes,
                            increment: timeControl.increment,
                        });
                        setChangingControl({
                            name: timeControl.name,
                            hours: parseInt(hours),
                            minutes: parseInt(minutes),
                            increment: timeControl.increment,
                        });
                    }
                });

            }
            return(
                () => {
                    keybaordUpListener.remove();
                    keyboardDownListener.remove();
                }
            );
        },[]
    );

    //keyboard event callbacks
    const keyboardUp = () => {
        setKeyboardIsShown(true);
    }
    const keyboardDown = () => {
        setKeyboardIsShown(false);
    }
    return(
        <>
            <Animated.View
            style={{
                position: 'absolute',
                borderWidth: 1,
                borderColor: '#b0b0b0',
                width: '85%',
                height: '85%',
                top: 0,
                left: 30,
                elevation: 10,
                backgroundColor: '#ffffff',
                borderRadius: 5,
                opacity: fadeOpacity,
            }}
            >
                <View
                style={{
                    backgroundColor: '#b0b0b0',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    width: '100%',
                    borderTopStartRadius: 3,
                    borderTopEndRadius: 3,
                    // marginStart: 20,
                }}
                >
                    <Text
                    style={{
                        // color: '#ffffff'
                        fontWeight: 'bold',
                    }}
                    >{`${status.add ? 'NEW TIME CONTROL': ''}${status.edit ? 'CHANGE TIME CONTROL' : ''}`}</Text>
                </View>

               <View
               style={{
                   flexDirection: 'row',
                   flexWrap: 'wrap',
               }}
               >
                    <View
                    style={{
                        // borderWidth: 1,
                        // borderColor: '#000000',
                        width: '100%',
                    }}
                    >
                        <Text
                        style={{
                            padding: 5,
                        }}
                        >
                            Name:
                        </Text>
                        <TextInput
                        style={{
                            backgroundColor: '#e8e8e8',
                            height: 45,
                        }}
                        placeholder={editingControl ? null: "Naming is important!"}
                        onChangeText={(text) => {
                            setChangingControl(
                                previousChangingControl => {
                                    return({
                                        ...previousChangingControl,
                                        name: text,
                                    });
                                }
                            )
                        }}
                        >
                            {editingControl ? editingControl.name : null}
                        </TextInput>
                    </View>

                    {
                        !keyboardIsShown &&
                       <>
                        <ChangeTime
                        label="Hours"
                        settings={{
                            value: editingControl ? editingControl.hours: 0,
                            max: 24,
                            min: 0,
                            onChange: (hours) => {
                                setChangingControl(
                                    previousChangingControl => {
                                        return({
                                            ...previousChangingControl,
                                            hours,
                                        });
                                    }
                                )
                            },
                        }}
                        />
                        
                        <ChangeTime
                        label="Minutes"
                        settings={{
                            value: editingControl ? editingControl.minutes: 0,
                            max: 59,
                            min: 0,
                            onChange: (minutes) => {
                                setChangingControl(
                                    previousChangingControl => {
                                        return({
                                            ...previousChangingControl,
                                            minutes,
                                        });
                                    }
                                )
                            },
                        }}
                        />
        
                        <ChangeTime
                        label="Increment"
                        settings={{
                            value: editingControl ? editingControl.increment: 0,
                            max: 30,
                            min: 0,
                            onChange: (increment) => {
                                setChangingControl(
                                    previousChangingControl => {
                                        return({
                                            ...previousChangingControl,
                                            increment,
                                        });
                                    }
                                )
                            },
                        }}
                        />
                       </>
                    }
               </View>

               <View
               style={{
                // width: '100%',
                flexDirection: 'row',
                // borderWidth: 5,
                // borderColor: '#000000',
                // justifyContent: 'space-evenly'
                // marginTop: 102,
                position: 'absolute',
                bottom: 0,
               }}
               >
                <ChangeTimeButton
                text="Save"
                customStyle={saveButtonStyles}
                onPress={save}
                />

                <ChangeTimeButton
                text="Cancel"
                customStyle={cancelButtonStyles}
                onPress={cancel}
                />
               </View>

            </Animated.View>
        </>
    );
}

export default React.memo(ChangeTimeControl);