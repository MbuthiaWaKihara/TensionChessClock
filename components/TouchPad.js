import React , {
    useContext,
} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ActivityIndicator,
} from 'react-native';
import {gameStateContext, } from './LandingScreen';


const TouchPad = ({customStyles, textColor, respondToPadPress, activityState, displayTime}) => {
    const gameState = useContext(gameStateContext);

    //this method prepares the display time prop for display
    const formatDisplayTime = (displayTime) => {
        if(displayTime <= 0 ){
            return ('00:00');
        }
        let time = new Date(null);
        time.setSeconds(displayTime);
        let MHSTime = time.toISOString().substr(11,8);
        let timeSections = MHSTime.split(':');
        if(timeSections[0] === '00'){
            let formattedTime = MHSTime.substring(3, MHSTime.length );
            return formattedTime;
        }
        return MHSTime;
    }
    return(
        <>
           <TouchableOpacity
           style={customStyles}
           onPress={() => respondToPadPress()}
           disabled={(gameState.gameStarted && !activityState) || gameState.gameOver}
           >
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
                  {
                      displayTime ? 
                      <Text
                      style={{
                          color: textColor,
                          fontSize: 80,
                          fontWeight: 'bold'
                      }}
                      >{formatDisplayTime(displayTime)}
                      </Text>:
                      <ActivityIndicator 
                      size={50}
                      color={textColor}
                      />
                  }
                </View>
           </TouchableOpacity>
        </>
    );
}

export default React.memo(TouchPad);