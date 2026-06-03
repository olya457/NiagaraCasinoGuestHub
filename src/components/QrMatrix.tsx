import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

type Props = {
  size: number;
  color?: string;
  quietColor?: string;
};

const cells = 29;

const finder = (row: number, col: number, top: number, left: number) => {
  const r = row - top;
  const c = col - left;
  if (r < 0 || c < 0 || r > 6 || c > 6) {
    return false;
  }
  return r === 0 || c === 0 || r === 6 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
};

const filled = (row: number, col: number) => {
  if (
    finder(row, col, 2, 2) ||
    finder(row, col, 2, cells - 9) ||
    finder(row, col, cells - 9, 2)
  ) {
    return true;
  }

  const value =
    (row * 7 + col * 11 + row * col * 3 + (row % 5) * 13 + (col % 4) * 17) % 10;
  return value === 0 || value === 2 || value === 5 || value === 7;
};

export function QrMatrix({
  size,
  color = '#ffffff',
  quietColor = 'transparent',
}: Props): React.JSX.Element {
  const dot = size / cells;
  const blocks = useMemo(
    () =>
      Array.from({length: cells * cells}, (_, index) => {
        const row = Math.floor(index / cells);
        const col = index % cells;
        return {id: `${row}-${col}`, active: filled(row, col)};
      }),
    [],
  );

  return (
    <View style={[styles.wrap, {width: size, height: size}]}>
      {blocks.map(block => (
        <View
          key={block.id}
          style={[
            styles.dot,
            {
              width: dot,
              height: dot,
              backgroundColor: block.active ? color : quietColor,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  dot: {
    borderRadius: 1,
  },
});
