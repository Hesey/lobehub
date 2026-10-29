import { Slider } from 'antd';
import { type CSSProperties, memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';
import useMergeState from 'use-merge-value';

export interface CreatedLevelSliderProps<T extends string> {
  defaultValue?: T;
  onChange?: (value: T) => void;
  value?: T;
}

interface CreateLevelSliderOptions<T extends string> {
  defaultValue: T;
  levels: readonly T[];
  style?: CSSProperties;
}

export const createLevelSliderComponent = <T extends string>({
  defaultValue,
  levels,
  style,
}: CreateLevelSliderOptions<T>) =>
  memo<CreatedLevelSliderProps<T>>(({ value, onChange, defaultValue: componentDefaultValue }) => {
    const [currentValue, setCurrentValue] = useMergeState(value ?? componentDefaultValue ?? defaultValue, {
      defaultValue: componentDefaultValue,
      onChange,
      value,
    });

    const marks = useMemo(
      () =>
        Object.fromEntries(levels.map((level, index) => [index, level])) as Record<number, string>,
      [levels],
    );

    const sliderValue = Math.max(0, levels.indexOf(currentValue as T));

    return (
      <Flexbox
        align={'center'}
        gap={12}
        horizontal
        paddingInline={'0 20px'}
        style={{ minWidth: 200, width: '100%', ...style }}
      >
        <Flexbox flex={1}>
          <Slider
            marks={marks}
            max={levels.length - 1}
            min={0}
            onChange={(index) => {
              setCurrentValue(levels[index as number] ?? defaultValue);
            }}
            step={1}
            tooltip={{ open: false }}
            value={sliderValue}
          />
        </Flexbox>
      </Flexbox>
    );
  });
