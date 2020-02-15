import React, {
    useEffect,
    useState,
    useCallback,
} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Alert,
    AsyncStorage,
} from 'react-native';
import ActionButton from './ActionButton';
import RemovableControl from './RemovableControl';
import { useFocusEffect } from '@react-navigation/native';
import ErrorFallback from './ErrorFallback';

const Remove = ({route, navigation}) => {
    const [error, setError] = useState(false);
    const {setTimeControls, setPageControls, setSetPageControls, focusedTime} = route.params;
    
    const initializeCheckboxData = (timeControls) => {
        let checkboxData = [];
        timeControls.forEach(
            (timeControl, index) => {
                checkboxData = [
                    ...checkboxData, 
                    {
                        ...timeControl,
                        targetForRemoval: false,
                    }
                ]
            }
        );

        return checkboxData;
    }

    const [checkboxControls, setCheckboxControls] = useState(() => initializeCheckboxData(setPageControls));
    const [removeCount, setRemoveCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            try{
                AsyncStorage.getItem('TCCControls')
                .then((response) => {
                    let timeControls = JSON.parse(response);
                    let pageControls = initializeCheckboxData(timeControls);
                    setCheckboxControls(pageControls);
                })
            }
            catch(error){
                setError(true);
            }
        },[setPageControls])
    );

    //callbacks
    //callback to mark or unmark time control
    const onClickCheckbox = (id) => {
        let count = 0;
        let copy = checkboxControls;
        checkboxControls.forEach(
            (timeControl, index) => {
                if(timeControl.id === id){
                    let current = copy[index].targetForRemoval;
                    copy[index].targetForRemoval = !current;
                }
                if(timeControl.targetForRemoval){
                    count++;
                }
            }
        );
        setCheckboxControls(copy);
        setRemoveCount(count);
    }

    //callback to delete selected items
    const remove = () => {
        //update the setpage controls
        let newControls = setPageControls.filter(
            (timeControl, index) => {
                return(
                    !checkboxControls[index].targetForRemoval
                )
            }
        );
        setSetPageControls(newControls);
        //update the top level state manager
        setTimeControls(newControls);
        //update check box controls
        let newCheckboxControls = initializeCheckboxData(newControls);
        setCheckboxControls(newCheckboxControls);
        //update count
        setRemoveCount(0);
        //update async storage
        AsyncStorage.setItem('TCCControls', JSON.stringify(newControls))
        .then(
            () => {
                //navigate to the set time controls page
                navigation.navigate("Set");
            }
        );
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
                    backgroundColor: '#ffffff',
                }}
                >
                    <TouchableOpacity
                    style={{
                        alignSelf: 'flex-start',
                    }}
                    onPress={() => navigation.navigate("Set")}
                    >
                        <Image
                        source={require('../appimages/back.png')}
                        />
                    </TouchableOpacity>
                </View>
                    <FlatList
                    data={checkboxControls}
                    renderItem={({item}) => <RemovableControl timeControl={item} focusedTime={focusedTime} onClickCheckbox={onClickCheckbox}/>}
                    keyExtractor={item => item.id}
                    />
                <View
                style={{
                    backgroundColor: '#ffffff',
                    width: '100%',
                    height: '20%',
                }}
                />
                <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    alignItems: 'center',
                    elevation: 8,
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
                >
                    
                    <ActionButton
                    text="REMOVE"
                    onPress={() => {
                        if(removeCount > 0){
                            Alert.alert('Remove Time Controls',
                            `Are you sure you want to remove ${removeCount} time control(s)?`,
                            [{
                                text: 'YES',
                                onPress: () => remove()
                            }, {
                                text: 'CANCEL',
                                onPress: () => {}
                            }]);
                        }else{
                            Alert.alert('Remove Time Controls',
                            'No time controls selected...',
                            [{
                                text: 'OKAY',
                                onPress: () => {},
                            }])
                        }
                    }}
                    backgroundColor="#850000"
                    />
                </View>
            </View>
        </>
    );
}

export default React.memo(Remove);