import BlurEdge from "./BlurEdge";
import { View, ViewProps, StyleSheet } from "react-native";
import { vec } from "@shopify/react-native-skia";
import React, { useRef } from "react";
import {
  SafeAreaViewProps,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import BlurBackground from "./BlurBackground";

type Props = ViewProps & {
  children?: React.ReactNode;
  bottomBlur?: boolean;
  edges?: SafeAreaViewProps["edges"];
};

const BlurBox = ({
  bottomBlur,
  edges = [],
  ...props
}: React.PropsWithChildren<Props>): JSX.Element => {
  const edgeHeight = useRef(60).current;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, props.style]}>
      <BlurEdge
        height={edgeHeight + insets.top}
        colors={["#FFFFFF90", "#FFFFFF00"]}
        start={vec(0, 0 + insets.top)}
        end={vec(0, edgeHeight + insets.top)}
        style={[styles.blur, styles.top]}
      />

      {props.children}

      <BlurEdge
        enabled={bottomBlur}
        height={edgeHeight}
        start={vec(0, 0)}
        end={vec(0, edgeHeight)}
        colors={["#FFFFFF00", "#FFFFFF80"]}
        style={[styles.blur, styles.bottom]}
      />

      <BlurBackground />
    </View>
  );
};

export default BlurBox;

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
  content: {
    flex: 1,
    position: "relative",
  },
  top: {
    top: 0,
  },
  wrapper: {
    flex: 1,
    position: "relative",
  },
});
