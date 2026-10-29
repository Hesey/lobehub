import { Select } from 'antd';
import { memo, useMemo } from 'react';
import useMergeState from 'use-merge-value';

const NANO_BANANA_ASPECT_RATIOS = [
  '1:1',
  '2:3',
  '3:2',
  '3:4',
  '4:3',
  '4:5',
  '5:4',
  '9:16',
  '16:9',
  '21:9',
] as const;

type AspectRatio = (typeof NANO_BANANA_ASPECT_RATIOS)[number];

export interface ImageAspectRatioSelectProps {
  defaultValue?: AspectRatio;
  onChange?: (value: AspectRatio) => void;
  value?: AspectRatio;
}

const ImageAspectRatioSelect = memo<ImageAspectRatioSelectProps>(
  ({ value, onChange, defaultValue = '1:1' }) => {
    const [ratio, setRatio] = useMergeState(value ?? defaultValue, {
      defaultValue,
      onChange,
      value,
    });

    const options = useMemo(
      () => NANO_BANANA_ASPECT_RATIOS.map((item) => ({ label: item, value: item })),
      [],
    );

    return (
      <Select
        onChange={(next) => setRatio(next as AspectRatio)}
        options={options}
        style={{ height: 32, marginRight: 10, width: 75 }}
        value={ratio}
      />
    );
  },
);

export default ImageAspectRatioSelect;
