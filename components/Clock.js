import React, {
    useContext,
} from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import TouchPad from './TouchPad';
import {gameStateContext} from './LandingScreen';

const Clock = ({respondToPadPress, padState, timeState, navigation, restart, pause, timeControls, setTimeControls, setCurrentTime, setGameState, time}) => {
    let gameState = useContext(gameStateContext);
    //determine the styling of the pads depending on current activity state
    const bottomPad = {
        backgroundColor: padState.bottomPadActive? '#ffffff' : '#444445',
        flex: 3,
    }
    
    const TopPad = {
        backgroundColor: padState.topPadActive? '#ffffff' : '#444445',
        flex: 3,
        transform: [
         {scaleX: -1}, {scaleY: -1}
        ]
    }

    return(
        <>
            <View
            style={{
                flex: 1,
                backgroundColor: '#000000'
            }}
            >
                <TouchPad
                customStyles={TopPad}
                textColor={padState.topPadActive? "#0c1714" : "#acacb0"}
                respondToPadPress={() => respondToPadPress('top')}
                activityState={padState.topPadActive}
                displayTime={timeState.topPadTime}
                />
                <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                }}
                >
                    <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                        <TouchableOpacity
                        onPress={() =>{pause(); navigation.navigate("Settings", {
                           screen: 'Set',
                           params: {
                               timeControls,
                               setTimeControls,
                               setCurrentTime,
                               setGameState,
                           }, 
                        })}}
                        >
                            <Image
                            source={require('../appimages/settings.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                        <TouchableOpacity
                        onPress={() => pause()}
                        >
                            {
                                (gameState.gameStarted && !gameState.gamePaused.pause && !gameState.gameOver) &&
                                <Image
                                source={require('../appimages/pause.png')}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                        <TouchableOpacity
                        onPress={() => {
                            Alert.alert('Reset Time', 'Restart the game?', [{
                                text: 'Yes',
                                onPress: () => {restart()},
                        }, {
                            text: 'No',
                            onPress: () => {},
                        }]);
                        }}
                        >
                            <Image
                            source={require('../appimages/restart.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchPad
                customStyles={bottomPad}
                textColor={padState.bottomPadActive? "#0c1714" : "#acacb0"}
                respondToPadPress={() => respondToPadPress('bottom')}
                activityState={padState.bottomPadActive}
                displayTime={timeState.bottomPadTime}
                />
            </View>
        </>
    );
}

export default React.memo(Clock);