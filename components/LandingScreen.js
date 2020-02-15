import React, {
    useState,
    useEffect,
    useRef,
} from 'react';
import {
    AsyncStorage,
} from 'react-native';
import Clock from './Clock';
import SoundPlayer from 'react-native-sound-player';
import ErrorFallback from './ErrorFallback';
// import {AsyncStorage} from '@react-native-community/async-storage';

// AsyncStorage.removeItem('TCCControls');

//this component, being the top parent, is used for top level state management
export const gameStateContext = React.createContext();
const LandingScreen = ({navigation}) => {
    const [error, setError] = useState(false);
    const [padState, setPadState] = useState({
        topPadActive: false,
        bottomPadActive: false,
    });
    const [gameState, setGameState] = useState({
        gameStarted: false,
        gamePaused: {
            pause: false,
            lastActive: null,
        },
        gameOver: false,
    });
    const [time, setTime] = useState({
        activeTimeControl: null,
        topPadTime: null,
        bottomPadTime: null,
        increment: null,
    }); 
    const [timeControls, setTimeControls] = useState([]);

    let topPadManipulator = useRef();
    let bottomPadManipulator = useRef();

    //callbacks
    const respondToPadPress = (padPressed) => {
        //start the game
        if(!gameState.gameStarted){
            if(!gameState.gamePaused.pause){
                setGameState(
                    previousGameState => {
                        return({
                            ...previousGameState,
                            gameStarted: true,
                            gamePaused: {
                                ...previousGameState.gamePaused,
                                lastActive: padPressed === 'top'? 'bottom' : 'top',
                            }
                        })
                    }
                );
            }else{
                setGameState(
                    previousGameState => {
                        return({
                            ...previousGameState,
                            gameStarted: true,
                            gamePaused: {
                                ...previousGameState.gamePaused,
                                pause: false,
                            }
                        })
                    }
                );
            }
        }

        
        //play sound
        try{
            padPressed === 'top' ? 
            SoundPlayer.playSoundFile('top_pad', 'mp3') :
            SoundPlayer.playSoundFile('bottom_pad', 'mp3');
        }
        catch(error){
            setError(true);
        }

        //change styling
        padPressed === 'top' ?
        setPadState({
            topPadActive: false,
            bottomPadActive: true,
        }) : 
        setPadState({
            topPadActive: true,
            bottomPadActive: false,
        });
    }

    const restart = () => {
        //clear intervals
        if(topPadManipulator.current){
            clearInterval(topPadManipulator.current);
        }
        if(bottomPadManipulator.current){
            clearInterval(bottomPadManipulator.current);
        }

        //find the active time control
        timeControls.forEach(
            (timeControl, index) => {
                if(timeControl.selected){
                    setTime({
                        activeTimeControl: timeControl.seconds,
                        topPadTime: timeControl.seconds,
                        bottomPadTime: timeControl.seconds,
                        increment: timeControl.increment,
                    })
                }
            }
        );
        setGameState(
            previousGameState => {
                return({
                    ...previousGameState,
                    gameOver: false,
                    gameStarted: false,
                })
            }
        );
        setPadState({
            topPadActive: false,
            bottomPadActive: false,
        });
    }

    const pause = () => {
       
        setGameState(
            previousGameState => {
                return({
                    ...previousGameState,
                    gameStarted: false,
                    gamePaused: {
                        ...previousGameState.gamePaused,
                        pause: true,
                        lastActive: padState.topPadActive? 'top': 'bottom',
                    },
                });
            }
        );
         //clear intervals
         if(topPadManipulator.current){
            clearInterval(topPadManipulator.current);
        }
        if(bottomPadManipulator.current){
            clearInterval(bottomPadManipulator.current);
        }
        setPadState({
            topPadActive: false,
            bottomPadActive: false,
        });
    }


    //state change methods
    const initializeAsyncData = () => {
       //handle situation when it's the first time a user is entering the app
       let timestamp = Date.now();
       let nextStamp = timestamp + 1;
       let otherStamp = nextStamp + 1;
       let defaultControls = [
        {
            id: timestamp.toString(),
            name: 'Blitz',
            seconds: 300,
            increment: 5,
            selected: true,
        },
        {
            id: nextStamp.toString(),
            name: 'Super Blitz',
            seconds: 180,
            increment: 0,
            selected: false,
        },
        {
            id: otherStamp.toString(),
            name: 'Rapid',
            seconds: 900,
            increment: 25,
            selected: false,
        }
        ];

        try{
            AsyncStorage.setItem('TCCControls', JSON.stringify(defaultControls))
            .then(() => {
                AsyncStorage.getItem('TCCControls')
                .then(
                (response) => {
                    let appTimeControls = JSON.parse(response);
                    setTimeControls(appTimeControls);
                    appTimeControls.forEach(
                        (timeControl, index) => {
                            if(timeControl.selected){
                                setTime({
                                    activeTimeControl: timeControl.seconds,
                                    topPadTime: timeControl.seconds,
                                    bottomPadTime: timeControl.seconds,
                                    increment: timeControl.increment,
                                });
                            }
                        }
                    )
                }
                );
            });
        }
        catch(error){
            setError(true);
        }
    }

    //when the component mounts, the app looks for the selected time control from async storage
    //if async storage returns null, the app makes a new time control which is used as the selected
    useEffect(() => {
       try{//get async data
           AsyncStorage.getItem('TCCControls')
           .then(
            (response) => {
                if(response === null){
                    initializeAsyncData();
                }else{
                    let appTimeControls = JSON.parse(response);
                    setTimeControls(appTimeControls);
                    appTimeControls.forEach(
                        (timeControl, index) => {
                            if(timeControl.selected){
                                setTime({
                                    activeTimeControl: timeControl.seconds,
                                    topPadTime: timeControl.seconds,
                                    bottomPadTime: timeControl.seconds,
                                    increment: timeControl.increment,
                                });
                            }
                        }
                    );
                }
            }
           );
       }
       catch(error){
           setError(true);
       }
    },[]);

    //whenever padState changes, we need to manipulate time
    useEffect(() => {
        if(gameState.gameStarted){
            if(padState.topPadActive){
                if(bottomPadManipulator.current){
                    clearInterval(bottomPadManipulator.current);
                }
                topPadManipulator.current= setInterval(() => {
                    setTime(
                        previousTime => {
                            return({
                                ...previousTime,
                                topPadTime: previousTime.topPadTime - 1,
                            })
                        }
                    );
                }, 1000);
                if(gameState.gamePaused.lastActive !== 'top'){
                    setTime(
                        previousTime => {
                            return({
                                ...previousTime,
                                bottomPadTime: previousTime.bottomPadTime + previousTime.increment,
                            });
                        }
                    );
                }
            }else{
                if(topPadManipulator.current){
                    clearInterval(topPadManipulator.current);
                }
                bottomPadManipulator.current = setInterval(() => {
                    setTime(
                        previousTime => {
                            return({
                                ...previousTime,
                                bottomPadTime: previousTime.bottomPadTime - 1,
                            })
                        }
                    );
                }, 1000);
                if(gameState.gamePaused.lastActive !== 'bottom'){
                    setTime(
                        previousTime => {
                            return({
                                ...previousTime,
                                topPadTime: previousTime.topPadTime + previousTime.increment,
                            });
                        }
                    );
                }
            }      

            if(gameState.gamePaused.lastActive){
                setGameState(
                    previousGameState => {
                        return({
                            ...previousGameState,
                            gamePaused: {
                                ...previousGameState.gamePaused,
                                lastActive: null,
                            }
                        })
                    }
                )
            }
        }
    },[padState]);

    //whenever the time state changes, we catch the chance that someone lost on time
    useEffect(() => {
        if(time.topPadTime === 0 || time.bottomPadTime === 0){
            //clear intervals to prevent memory leak
            if(topPadManipulator.current){
                setTimeout(() => {
                    clearInterval(topPadManipulator.current);
                }, 1000);
            }
            if(bottomPadManipulator.current){
                setTimeout(() => {
                    clearInterval(bottomPadManipulator.current);
                }, 1000);
            }
            //play sound
            try{
                SoundPlayer.playSoundFile('timeout', 'mp3');
            }
            catch(error){
                setError(true);
            }
            setGameState(
                previousGameState => {
                    return({
                        ...previousGameState,
                        gameOver: true,
                    })
                }
            );
        }
    },[time]);

    return(
        <>
            <gameStateContext.Provider
            value={gameState}
            >
                {
                    error && 
                    <ErrorFallback 
                    dismissAlertBox={() => setError(false)}
                    />
                }
                <Clock
                padState={padState}
                timeState={{
                    topPadTime: time.topPadTime,
                    bottomPadTime: time.bottomPadTime,
                }}
                respondToPadPress={respondToPadPress}
                navigation={navigation}
                restart={restart}
                pause={pause}
                timeControls={timeControls}
                setTimeControls={setTimeControls}
                setCurrentTime={setTime}
                setGameState={setGameState}
                />
            </gameStateContext.Provider>
        </>
    );
}

export default React.memo(LandingScreen);