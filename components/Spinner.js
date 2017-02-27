import React from 'react';
import { Accelerometer, Gyroscope } from 'Sensors';
import { View, Header, SubHeader, DeviceEventEmitter } from 'react-native';

const Spinner = React.createClass({
  propTypes: {
    triggerMatch: React.propTypes.func,
    beginMatching: React.propTypes.func,
    mode: React.propTypes.string,
    thresholds: React.propTypes.list,
    events: React.propTypes.func
  },

  getInitialState: function() {
    return ({
      accel: {
        x: 0,
        y: 0,
        z: 0
      },
      gyro: {
        x: 0,
        y: 0,
        z: 0
      },
      matchLevel: 0
    });
  },

  componentDidMount: function() {
    DeviceEventEmitter.addListener('AccelerationData', function(data) {
      this.props.events.setState({
        accel: {
          x: data.acceleration.x.toFixed(100),
          y: data.acceleration.y.toFixed(100),
          z: data.acceleration.z.toFixed(100)
        }
      });
    }.bind(this));

    DeviceEventEmitter.addListener('GyroscopeData', function(data) {
      this.this.props.events.setState({
        gyro: {
          x: data.rotationRate.x.toFixed(100),
          y: data.rotationRate.y.toFixed(100),
          z: data.rotationRate.z.toFixed(100)
        }
      });
    }.bind(this));

    Accelerometer.startAccelerometer();
    Gyroscope.startGyroUpdates();
  },

  componentWillUpdate: function(prevState) {
    const { accel, gyro, matchLevel } = this.state;
    const { thresholds, triggerMatch, mode, events } = this.props;

    const newMatchLevel = Math.abs(gyro.x * gyro.y * gyro.z) / 100;
    const accelLevel = Math.abs(accel.x * accel.y * accel.z);

    if (mode === 'initial' && accelLevel > 100 || newMatchLevel > 10) {
      this.beginMatching();
      return;
    }

    /** If the accel level > 9000, indication phone has been subjected to throwing motion.
      * This value was found expiramentally on an Iphone 7.
      */
    if (accelLevel > 9000) {
      // eslint-disable-next-line no-alert
      alert('You just threw your phone! Love Isn\'t Dead... Just Gotta Keep Spinning');
      return;
    } else if (matchLevel < newMatchLevel && thresholds.get(matchLevel) < newMatchLevel) {
      events.setState({
        matchLevel: newMatchLevel
      });
      triggerMatch(matchLevel);
    }
  },

  componentWillUnmount: function() {
    Gyroscope.stopGyroUpdates();
    Accelerometer.stopAccelerometer();
  },

  render() {
    const { mode } = this.props;
    const blurb = mode === 'initial' ? undefined : 'Left for Love, Right for Retry';
    return (
      <View>
        <Header>
          Are You Looking to Spin?
          <SubHeader>{blurb}</SubHeader>
        </Header>
      </View>
    );
  }
});

module.exports = Spinner;
