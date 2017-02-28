import React, { Component } from 'react';
import { Text, View, } from 'react-native';
import { MD5 } from 'HashFunctions';
import { ProfileData } from 'ProfileData';
import Spinner from './components/Spinner.js';


class SpinderUi extends Component { {

  RetrieveMatchDisplay(matchUserName, previousHits) {
    const matchId = MD5(matchUserName)};
    const { fullName, picture, blurb } = ProfileData.retrieve(matchId);

    const profileImage = <Image source={picture} altText={fullName + ' Awesome Picture'}/>;

    if (previousHits) {
      return (
        <View style={{highlight: 'faded'}}>
          {profileImage}
          <Text style={{text: 'dispair'}}>
            {`${fullName} maybe didn't spin before`}
          </Text>
          <Text style={{text: 'hope'}}>
            {'But they say it takes' + {previousHits + 1} + 'tries to find love!'}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{highlight: 'love'}}>
          {profileImage}
          <Text style={{text: 'excite'}}>
            {`LOOK! IT'S ${fullName}. Could be the one!`}
          </Text>
        </View>
      );
    }
  },

  GenerateMatch(prefTimeOfDay, age, region) {
    const matchList = ProfileData.getPreviousMatches(this.props.userName);
    const regionalUsers = ProfileData.filterUsers({region: region, age: age});

    let thisMatch = undefined;

    let validMatchRankings = regionalUsers.map((user) => {
      if (prefTimeOfDay === user.prefTimeOfDay) {
        return 0;
      }
      let ageMultiplier = age > user.age ? user.age/age : age/user.age;
      return matchList[user.userName] === undefined ?
        ageMultiplier/matchList[user.userName].previousHits :
        ageMultiplier;
    });

    if (validaMatchRankings) {
      validaMatchRankings.sort();
      return validMatchRankings.get(0);
    }

    return ProfileData.botUser;
  },

  onSpinEvent(event) {
    /* TODO */
  },

  render() {
    /* TODO */
  }
}

AppRegistry.registerComponent('SpinderUi', () => SpinderUi);
