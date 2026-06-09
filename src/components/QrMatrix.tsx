import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import qrcode from 'qrcode-generator';

type Props = {
  size: number;
  payload?: string;
  color?: string;
  quietColor?: string;
};

export function QrMatrix({
  size,
  payload = 'Niagara Casino Guest Hub',
  color = '#ffffff',
  quietColor = 'transparent',
}: Props): React.JSX.Element {
  const {blocks, cells} = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(payload);
    qr.make();
    const moduleCount = qr.getModuleCount();
    return {
      cells: moduleCount,
      blocks: Array.from({length: moduleCount * moduleCount}, (_, index) => {
        const row = Math.floor(index / moduleCount);
        const col = index % moduleCount;
        return {id: `${row}-${col}`, active: qr.isDark(row, col)};
      }),
    };
  }, [payload]);
  const dot = size / cells;

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
