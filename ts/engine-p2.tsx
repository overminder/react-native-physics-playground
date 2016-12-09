import * as React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { autobind } from 'core-decorators';
import * as p2 from 'p2';

import * as V from './virtual';
import * as U from './util';

interface Circle {
  body: p2.Body;
  shape: p2.Circle;
  style: ViewStyle;
}

@autobind
export class CircleWorld<A> implements V.CircleWorld<JSX.Element[]> {
  private bodies: Circle[] = [];
  private world: p2.World;
  private groundBody: p2.Body;

  constructor(private conf: V.RandomCircleInit) {
    this.world = new p2.World();
  }

  get bodyCount(): number {
    return this.bodies.length;
  }

  enableBottomPlane(enabled: boolean) {
    if (this.groundBody && !enabled) {
      this.world.removeBody(this.groundBody);
      this.groundBody = undefined;
    }

    if (!this.groundBody && enabled) {
      const groundBody = new p2.Body({
        mass: 0, // Setting mass to 0 makes it static
      });
      const groundShape = new p2.Plane();

      groundBody.addShape(groundShape);
      this.world.addBody(groundBody);
      this.groundBody = groundBody;
    }
  }

  step(dy: number, dt: number, maxSubSteps: number) {
    this.world.step(dy, dt, maxSubSteps);
  }

  render(): JSX.Element[] {
    return this.bodies.map(this.renderCircle);
  }

  renderCircle(c: Circle) {
    const { 0: x, 1: y } = c.body.interpolatedPosition;
    const circ = c.shape;
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

  clearBodies() {
    this.bodies.forEach(b => {
      this.world.removeBody(b.body);
    });
    this.bodies = [];
  }

  collectGarbage() {
    let i = 0;
    while (i < this.bodies.length) {
      const b = this.bodies[i];
      const { 0: x, 1: y } = b.body.interpolatedPosition;
      const sX = x / this.conf.scale;
      const sY = y / this.conf.scale;
      // Out of screen
      if (sY < -150 || sX < -200 || sX > 220) {
        const removed = U.swapAndPop(this.bodies, i);
        this.world.removeBody(removed.body);
        // Continue.
      } else {
        i += 1;
      }
    }
  }

  addBody() {
    const vc = V.randCircle(this.conf);
    const c = {...fromVirtual(vc), style: V.toStyle(vc)};
    this.bodies.push(c);
    this.world.addBody(c.body);
  }
}

function fromVirtual(vc: V.Circle) {
  const body = new p2.Body({
    mass: vc.radius ** 3,
    position: [vc.x, vc.y],
  });

  const shape = new p2.Circle({ radius: vc.radius });
  body.addShape(shape);

  return { body, shape };
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
  },
});
