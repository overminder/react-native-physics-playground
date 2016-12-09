import * as React from 'react';
import {
  View,
  ViewStyle,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import * as p2 from 'p2';
import { autobind } from 'core-decorators';

import * as V from './virtual';
import * as U from './util';
import * as Ep2 from './engine-p2';
import * as Em2 from './engine-matter';

function delay(ms: number) {
  return new Promise<void>(k => setTimeout(k, ms));
}

interface P2Demo1State {
}

@autobind
class P2Demo1 extends React.Component<void, P2Demo1State> {
  private world: V.CircleWorld<JSX.Element[]>;

  private rafHandle: number;
  private lastTime: number;

  constructor() {
    super();
    this.state = {};

    const conf = {
      x: { from: -100, to: 100 },
      y: { from: 350, to: 650 },
      radius: { from: 5, to: 15 },
      scale: 0.01,
    };

    this.world = new Ep2.CircleWorld(conf);
    this.world.enableBottomPlane(true);
  }

  async componentDidMount() {
    this.sceneLoop();
  }

  async sceneLoop() {
    this.rafHandle = requestAnimationFrame(this.raf);

    const nBodies = Platform.select({ ios: 250, android: 20 });
    const clearAfterEachLoop = Platform.select({ ios: false, android: true });
    const totalTime = 750;
    const interval = totalTime / nBodies;

    while (true) {
      for (let i = 0; i < nBodies; ++i) {
        await delay(interval);
        this.world.addBody();
      }

      await delay(2000);
      if (clearAfterEachLoop) {
        this.world.clearBodies();
      }
    }

    /*
    if (this.rafHandle) {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = undefined;
    }
    */
  }

  raf(time: number) {
    const fixedTimeStep = 1 / 60; // seconds
    const maxSubSteps = 10; // Max sub steps to catch up with the wall clock

    this.rafHandle = requestAnimationFrame(this.raf);

    // Compute elapsed time since last render frame
    const deltaTime = this.lastTime ? (time - this.lastTime) / 1000 : 0;

    // Move bodies forward in time
    this.world.step(fixedTimeStep, deltaTime, maxSubSteps);

    // Kill out-of-scene bodies
    this.world.collectGarbage();

    // Render the circle at the current interpolated position
    this.forceUpdate();

    this.lastTime = time;
  }

  renderCounter() {
    return (
      <Text style={styles.counter}>
        Body Count: {this.world.bodyCount}
      </Text>
    );
  }

  render() {
    return (
      <View style={styles.root}>
        {this.world.render()}
        {this.renderCounter()}
      </View>
    );
  }
}

export class Root extends React.Component<void, void> {
  render() {
    return <P2Demo1 />;
  }
}

function Dummy() {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>
        Hello, world!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
  },
  text: {
    fontSize: 24,
  },
  circle: {
    position: 'absolute',
  },
  counter: {
    position: 'absolute' as 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: 'transparent',
  },
});
