import BlurCircle from "./BlurCircle";
import { BlurMask, Canvas } from "@shopify/react-native-skia";
import React, { useRef } from "react";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const SIZES = {
  HOME: {
    HEADER: 60,
  },
  WINDOW: {
    HEIGHT: height,
    WIDTH: width,
  },
};

const BlurBackground = (): JSX.Element => {
  /** Radius of circle */
  const r = useRef(SIZES.WINDOW.WIDTH / 2.5).current;
  /** An array responsible for how many circles will be located on the screen */
  const circles = useRef(new Array(6).fill(1)).current;
  /** The distance the elements will be located from each other */
  const step = SIZES.WINDOW.HEIGHT / circles.length;

  return (
    <Canvas style={styles.background}>
      <BlurMask blur={50} style="normal" />

      {circles.map((_, index) => (
        <BlurCircle
          key={index}
          // Arrange elements in a checkerboard pattern
          cx={index % 2 ? SIZES.WINDOW.WIDTH : 0}
          cy={step * index}
          r={r}
          delay={index * 1000}
        />
      ))}
    </Canvas>
  );
};

export default BlurBackground;

const styles = StyleSheet.create({
  background: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: -1,
  },
  blur: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 1,
  },
  bottom: {
    bottom: 0,
  },
  top: {
    top: 0,
  },
  wrapper: {
    flex: 1,
    position: "relative",
  },
});
