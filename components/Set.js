import React, {
    useState,
    useEffect,
    useCallback,
} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    AsyncStorage,
    Alert,
} from 'react-native';
import ActionButton from './ActionButton';
import ChangeTimeControl from './ChangeTimeControl';
import TimeControl from './TimeControl';
import ErrorFallback from './ErrorFallback';
import { useFocusEffect } from '@react-navigation/native';

const Set = ({route, navigation}) => {
    const [error, setError] = useState(false);
    const {timeControls, setTimeControls, setCurrentTime, setGameState,} = route.params;
    const [setPageControls, setSetPageControls] = useState(timeControls);
    const [isChanging, setIsChanging] = useState({
        edit: false,
        add: false,
    })
    const [changingControl, setChangingControl] = useState({
        name: null,
        hours: null,
        minutes: null,
        increment: null,
    });

    //method that finds the initally selected time controls
    const determineInitialFocused = (timeControls) => {
        let selectedId = "0";
        timeControls.forEach((timeControl, index) => {
            if(timeControl.selected){
                selectedId = timeControl.id;
            }
        });
        return selectedId;
    }
    const [focusedTime, setFocusedTime] = useState(() => determineInitialFocused(timeControls));
    
    //callbacks
    //callback to change the focused time control
    const changeFocus = (id) => {
        setFocusedTime(id);
    }
    
    //action button callback
    const play = () => {
        //change selected time to focused time
        let timeControls = setPageControls;
        setPageControls.forEach(
            (timeControl, index) => {
                if(timeControl.selected){
                    timeControls[index].selected = false;
                }
                if(timeControl.id === focusedTime){
                    timeControls[index].selected = true;
                }
            }
        );

        //change current time control to focused time details
        timeControls.forEach(
            (timeControl, index) => {
                if(timeControl.selected){
                    setCurrentTime({
                        activeTimeControl: timeControl.seconds,
                        topPadTime: timeControl.seconds,
                        bottomPadTime: timeControl.seconds,
                        increment: timeControl.increment,
                    });
                }
            }
        );

        //push changes to async storage
        try{
            AsyncStorage.setItem('TCCControls', JSON.stringify(timeControls))
            .then(
                () => {
                    //unpause game
                    setGameState(
                        previousGameState => {
                            return({
                                ...previousGameState,
                                gameOver: false,
                                gamePaused: {
                                    pause: false,
                                    lastActive: null,
                                },    
                            })
                        }
                    );
                    //navigate to front page
                    navigation.navigate("Landing");
                }
            );
        }
        catch(error){
            setError(true);
        }
        
    }

    //save an editing control callback
    const save = () => {
        //validate
        if(changingControl.name === ''){
            Alert.alert('Oops we found an error',
            'The name field cannot remain empty',
            [{
                text: 'GOT IT',
                onPress: () => {}
            }]);
            return 0;
        }
        if(changingControl.minutes === 0 && changingControl.hours === 0){
            Alert.alert('Oops we found an error',
            'Time controls should be at least a minute long',
            [{
                text: 'GOT IT',
                onPress: () => {}
            }]);
            return 0;
        }

        //in case it was an edit
        if(isChanging.edit && !isChanging.add){
            //update the set page controls
            let timeControls = setPageControls;
            setPageControls.forEach(
                (timeControl, index) => {
                    if(timeControl.id === focusedTime){
                        //transform the editing time object
                        let hoursToSeconds = changingControl.hours * 3600;
                        let minutesToSeconds = changingControl.minutes * 60;
                        let totalSeconds = hoursToSeconds + minutesToSeconds;
                        timeControls[index] = {
                            id: focusedTime,
                            name: changingControl.name,
                            seconds: totalSeconds,
                            increment: changingControl.increment,
                            selected: true,
                        }
                    }
                }
            );

            setSetPageControls(timeControls);
            //update top level controls
            setTimeControls(timeControls);
            //update async storage
            try{
                AsyncStorage.setItem('TCCControls', JSON.stringify(timeControls))
                .then(() => {
                    //remove pop up
                    setIsChanging({
                        edit: false,
                        add: false,
                    });
                });
            }
            catch(error){
                setError(true);
            }
        }

        //in case it was a new control
        if(!isChanging.edit && isChanging.add){
             //transform the editing time object
             let hoursToSeconds = changingControl.hours * 3600;
             let minutesToSeconds = changingControl.minutes * 60;
             let totalSeconds = hoursToSeconds + minutesToSeconds;
            //update the set page controls
            let timeControls = setPageControls;
            let newTimeControls = [
                ...timeControls,
                {
                    id: Date.now(),
                    name: changingControl.name,
                    seconds: totalSeconds,
                    increment: changingControl.increment,
                    selected: false,
                }
            ];

            //update the focus time
            let newFocus = newTimeControls[newTimeControls.length - 1].id;
            setFocusedTime(newFocus);
            //update the selected time
            let copy = newTimeControls;
            copy.forEach(
                (timeControl, index) => {
                    if(timeControl.id === focusedTime){
                        newTimeControls[index].selected = true;
                    }else{
                        newTimeControls[index].selected = false;
                    }
                }
            );

            setSetPageControls(newTimeControls);
            //update top level controls
            setTimeControls(newTimeControls);
            //update async storage
            try{
                AsyncStorage.setItem('TCCControls', JSON.stringify(newTimeControls))
                .then(() => {
                    //remove pop up
                    setIsChanging({
                        edit: false,
                        add: false,
                    });
                });
            }
            catch(error){
                setError(true);
            }
        }
    }

    return(
        <>
            <View
            style={{
                flex: 1,
            }}
            >  
                {
                    error && 
                    <ErrorFallback
                    dismissAlertBox={() => setError(false)}
                    />
                }
                <View
                style={{
                    width: '100%',
                    height: '8%',
                    backgroundColor: '#ebebed',
                }}
                >
                    {
                        !isChanging.edit && !isChanging.add &&
                        <TouchableOpacity
                        style={{
                            alignSelf: 'flex-end',
                        }}
                        onPress={() => navigation.navigate('Remove',{
                            setTimeControls,
                            setPageControls,
                            setSetPageControls,
                            focusedTime,
                        })}
                        >
                            <Image
                            source={require('../appimages/right-arrow.png')}
                            />
                        </TouchableOpacity>
                    }
                </View>
                <FlatList
                data={setPageControls}
                renderItem={({item}) => <TimeControl timeControl={item} focusedTime={focusedTime} onPress={changeFocus}/>}
                keyExtractor={item => item.id}
                />
                {
                    !isChanging.edit && !isChanging.add && 
                    <>
                        <View
                        style={{
                            backgroundColor: '#ffffff',
                            width: '100%',
                            height: '20%',
                        }}
                        />
                     <TouchableOpacity
                        style={{
                        position: 'absolute',
                        bottom: 180,
                        right: 10,
                        elevation: 8,
                    }}
                    onPress={() => setIsChanging({
                        add: false,
                        edit: true,
                    })}
                    >
                        <Image
                        source={require('../appimages/penciledit.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 100,
                        right: 10,
                        elevation: 8,
                    }}
                    onPress={() => {
                        setIsChanging({
                            add: true,
                            edit: false,
                        });
                        setChangingControl({
                            name: '',
                            hours: 0,
                            minutes: 0,
                            increment: 0,
                        });
                    }}
                    >
                        <Image
                        source={require('../appimages/tccplus(1).png')}
                        />
                    </TouchableOpacity>
                    <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        alignItems: 'center',
                        elevation: 8,
                        paddingLeft: 10,
                        paddingRight: 10,
                        // borderColor: '#000000',
                        // borderWidth: 5,
                    }}
                    >
                        
                        <ActionButton
                        text="PLAY"
                        onPress={play}
                        backgroundColor="#0c1714"
                        />
                    </View>
                    </>
                }
            </View>
            {
                (isChanging.edit || isChanging.add) &&
                <ChangeTimeControl
                status={isChanging}
                cancel={() => {
                    setIsChanging({
                        edit: false,
                        add: false,
                    });
                    setChangingControl({
                        name: null,
                        hours: null,
                        minutes: null,
                        increment: null,
                    })
                }}
                save={save}
                setChangingControl={setChangingControl}
                focusedTime={focusedTime}
                timeControls={setPageControls}
                />
            }
        </>
    );
}

export default React.memo(Set);