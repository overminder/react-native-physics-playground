import {
  ViewStyle,
} from 'react-native';
import * as U from './util';

interface CirclePos {
  radius: number;
  x: number;
  y: number;
}

export interface Circle extends CirclePos {
  color: string;
  scale: number;
}

export type RandomCircleInit = {
  [K in keyof CirclePos]: U.Range
} & {
  scale: number;
}

export function randCircle(o: RandomCircleInit): Circle {
  return {
    radius: U.randRange(o.radius) * o.scale,
    x: U.randRange(o.x) * o.scale,
    y: U.randRange(o.y) * o.scale,
    scale: o.scale,
    color: U.randColor(),
  };
}

export interface CircleWorld<A> {
  collectGarbage();
  addBody();
  render(): A;
  step(dy: number, dt: number, maxSubSteps: number);
  bodyCount: number;
  enableBottomPlane(enabled: boolean);
  clearBodies();
}

export function toStyle(vc: Circle): ViewStyle {
  return {
    backgroundColor: vc.color,
    width: vc.radius * 2 / vc.scale,
    height: vc.radius * 2 / vc.scale,
    borderRadius: vc.radius / vc.scale,
  };
}
