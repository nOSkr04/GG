import { Canvas, LinearGradient, Rect } from "@shopify/react-native-skia";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SIZES } from "./BlurBackground";

type Props = {
  enabled?: boolean;
  height: number;
  colors: string[];
  style: StyleProp<ViewStyle>;
  start: any;
  end: any;
};

const BlurEdge: React.FC<Props> = ({
  enabled,
  height,
  style,
  ...props
}: Props) => {
  if (!enabled) {
    return null;
  }
  return (
    <Canvas style={[style, { height }]}>
      <Rect x={0} y={0} width={SIZES.WINDOW.WIDTH} height={height}>
        <LinearGradient {...props} />
      </Rect>
    </Canvas>
  );
};

BlurEdge.defaultProps = {
  enabled: true,
};

export default BlurEdge;
