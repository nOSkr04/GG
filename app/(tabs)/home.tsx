import React, { memo, useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
const { width, height } = Dimensions.get("window");
const tarodCardImg =
  "https://img.freepik.com/free-vector/hand-drawn-sun-pattern_23-2148907263.jpg?size=626&ext=jpg";
const numberOfCards = 40;
type Card = {
  key: string;
  uri: string;
};

const _size = 100;
const _cardSize = {
  width: _size,
  height: _size * 1.67,
  borderRadius: 12,
};

const cards: Card[] = [...Array(numberOfCards).keys()].map(i => ({
  key: `card-${i}`,
  uri: tarodCardImg,
}));

const TWO_PI = Math.PI * 2;
const theta = TWO_PI / numberOfCards;
const cardVisibilityPercentage = 0.7;
const cardSize = _cardSize.width * cardVisibilityPercentage;
const circleRadius = Math.max(
  (cardSize * numberOfCards) / (2 * Math.PI),
  width,
);
const circleCircumference = TWO_PI * circleRadius;
const changeFactor = circleCircumference / width;

// const cardCoordinates = (index: number) => {
//   return {
//     x: Math.cos(theta * index) * circleRadius,
//     y: Math.sin(theta * index) * circleRadius,
//   };
// };

const SettingScreen = memo(() => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#164aa1",
      }}>
      {activeIndex && <Text>Active Index: {activeIndex}</Text>}
      <TarotWheel
        cards={cards}
        onIndexChange={index => {
          setActiveIndex(index);
        }}
      />
    </View>
  );
});

const TarotWheel = ({
  cards,
  onIndexChange,
}: {
  cards: Card[];
  onIndexChange: (index: number) => void;
}) => {
  const distance = useSharedValue(0);
  const angle = useDerivedValue(() => {
    return distance.value / circleCircumference;
  });
  const interpolatedIndex = useDerivedValue(() => {
    const floatIndex = Math.abs((angle.value % TWO_PI) / theta);
    return angle.value < 0 ? floatIndex : numberOfCards - floatIndex;
  });
  const acitveIndex = useDerivedValue(() => {
    return Math.round(interpolatedIndex.value);
  });
  const gesture = Gesture.Pan()
    .onChange(ev => {
      distance.value += ev.changeX * changeFactor;
    })
    .onFinalize(ev => {
      distance.value = withDecay(
        {
          velocity: ev.velocityX,
          velocityFactor: changeFactor,
        },
        () => {
          const newFloatAngle = -interpolatedIndex.value % theta;
          const newAngle = -acitveIndex.value * theta;

          distance.value = newFloatAngle * circleCircumference;
          distance.value = withSpring(newAngle * circleCircumference);
          runOnJS(onIndexChange)(acitveIndex.value);
        },
      );
    });
  const stylez = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${angle.value}rad` }],
    };
  });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            width: circleRadius * 2,
            height: circleRadius * 2,
            borderRadius: circleRadius,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: height - _cardSize.height * 1.5,
          },
          stylez,
        ]}>
        {cards.map((card, index) => {
          return (
            <TarotCard
              key={card.key}
              card={card}
              index={index}
              interpolatedIndex={interpolatedIndex}
            />
          );
        })}
      </Animated.View>
    </GestureDetector>
  );
};

const TarotCard = ({
  card,
  index,
  interpolatedIndex,
}: {
  card: Card;
  index: number;
  interpolatedIndex: Readonly<SharedValue<number>>;
}) => {
  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${theta * index}rad`,
        },
        {
          translateY: interpolate(
            interpolatedIndex.value,
            [index - 1, index, index + 1],
            [0, -_cardSize.height / 2, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: _cardSize.width,
          height: circleRadius * 2,
          position: "absolute",
        },
        stylez,
      ]}>
      <Text>{index}</Text>
      <Image
        source={{ uri: card.uri }}
        style={{
          width: _cardSize.width,
          height: _cardSize.height,
          borderRadius: _cardSize.borderRadius,
          borderWidth: 4,
          // position: "absolute",
          // top: circleRadius - _cardSize.height / 2,
          // left: circleRadius - _cardSize.width / 2,
          // transform: [
          //   { rotate: `${theta * index}rad` },
          //   { translateY: -circleRadius },
          //   { rotate: `${-theta * index}rad` },
          // ],
        }}
      />
    </Animated.View>
  );
};

SettingScreen.displayName = "SettingScreen";

export { SettingScreen };
