import * as React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { autobind } from 'core-decorators';
import { Engine, World, Composite, Bodies, Body } from 'matter-js';

import * as V from './virtual';
import * as U from './util';

interface Circle {
  body: Body;
  style: ViewStyle;
}

@autobind
export class CircleWorld implements V.CircleWorld<JSX.Element[]> {
  private engine: Engine;
  private bodies: Circle[] = [];

  constructor(private conf: V.RandomCircleInit) {
    this.engine = Engine.create();
    this.engine.world.gravity.y = -900.82;
  }

  get bodyCount(): number {
    return this.bodies.length;
  }

  step(_dy: number, dt: number, _maxSubSteps: number) {
    Engine.update(this.engine, dt);
  }

  addBody() {
    const cv = V.randCircle(this.conf);
    const b = fromVirtual(cv);
    this.bodies.push({
      body: b,
      style: V.toStyle(cv),
    });
    World.add(this.engine.world, b);
  }

  render() {
    return this.bodies.map(this.renderCircle);
  }

  renderCircle(c: Circle) {
    const { x, y } = c.body.position;
    const posStyle = {
      left: x / this.conf.scale + 160,
      bottom: y / this.conf.scale + 120,
    };

    return (
      <View
        key={c.body.id}
        style={[posStyle, c.style, styles.circle]}
      />
    );
  }

  enableBottomPlane() {
    // Not implemented
  }

  collectGarbage() {
    let i = 0;
    while (i < this.bodies.length) {
      const b = this.bodies[i];
      const { y } = b.body.position;
      // Out of screen
      if ((y / this.conf.scale) < -150) {
        const removed = U.swapAndPop(this.bodies, i);
        World.remove(this.engine.world, removed.body);
        // Continue.
      } else {
        i += 1;
      }
    }
  }

  clearBodies() {
    this.bodies.forEach(b => {
      World.remove(this.engine.world, b.body);
    });
    this.bodies = [];
  }
}

function fromVirtual(cv: V.Circle) {
  const b = Bodies.circle(cv.x, cv.y, cv.radius, {
    restitution: 1,
    friction: 0,
    frictionAir: 0,
  });
  Body.setDensity(b, 15.5);
  Body.setVelocity(b, {
    x: (Math.random() * 20 - 10) * cv.scale,
    y: (Math.random() * 20 - 10) * cv.scale,
  });
  return b;
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
  },
});
