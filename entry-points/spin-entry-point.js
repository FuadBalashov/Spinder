import React, { Component } from 'react';
import { Text, View, Image, Header } from 'react-native';
import { MD5 } from 'HashFunctions';
import { ProfileData } from 'ProfileData';
import Spinner from './components/Spinner.js';


const SpinderUi = React.createClass({

  getInitialState: function () {
    return ({
      currentMatch: undefined,
      openMessenger: false,
      initialLoad: true
    });
  },

  retrieveMatchDisplay(matchUserName, previousHits) {
    const matchId = MD5(matchUserName);
    const { fullName, picture, blurb } = ProfileData.retrieve(matchId);

    const profileImage = <Image source={picture} altText={fullName + '\'s Awesome Picture'}/>;
    if (previousHits) {
      return (
        <View style={{highlight: 'faded'}}>
          {profileImage}
          <Text style={{text: 'dispair'}}>
            {`${fullName} maybe didn't spin before`}
          </Text>
          <Text style={{text: 'hope'}}>
            {'But they say it takes ' + {previousHits + 1} + ' tries to find love!'}
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

  generateMatch(prefTimeOfDay, age, region) {
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

  onSpinEvent(matchLevel) {
    const { prefTimeOfDay, age, region } = this.props;
    const currentMatch = this.state.currentMatch;
    const recipientResponce = ProfileData.sendMatchLevel(this.props.username, currentMatch, matchLevel);

    if (recipientResponce) {
      this.setState({openMessenger: true});
    } else {
      /* If current match has not yet responded, move on to the next match */
      this.setState({currentMatch: generateMatch(prefTimeOfDay, age, region)});
    }
  },

  closeMessenger() {
    this.setState({
      openMessenger: false
    });
  },

  render() {
    if (initialLoad) {
      return (
        <View>
          <Header>
            Wave Your Phone Around If You Are Looking For Love!
            <Spinner mode='initial' beginMatching={this.onSpinEvent}/>
          </Header>
        </View>
      )
    }
    if (openMessenger) {
      return (
        <View>
          <Messenger user={this.props.username} close={this.closeMessenger}>
            <Header>
              {`Talk to ${this.state.currentMatch.prefferedName}!`}
            </Header>
          </Messenger>
        </View>
      )
    } else {
      return (
        <View>
          {this.state.currentMatch ? this.retrieveMatchDisplay(currentMatch.userName, currentMatch.previousHits) : undefined}
          <Spinner mode='picker' triggerMatch={this.onSpinEvent}/>
        </View>
      )
    }
  }
});

AppRegistry.registerComponent('SpinderUi', () => SpinderUi);
