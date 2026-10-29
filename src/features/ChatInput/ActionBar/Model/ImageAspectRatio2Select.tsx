import { Select } from 'antd';
import { memo, useMemo } from 'react';
import useMergeState from 'use-merge-value';

const NANO_BANANA_2_ASPECT_RATIOS = [
  'auto',
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
  '1:4',
  '4:1',
  '1:8',
  '8:1',
] as const;

type AspectRatio2 = (typeof NANO_BANANA_2_ASPECT_RATIOS)[number];

export interface ImageAspectRatio2SelectProps {
  defaultValue?: AspectRatio2;
  onChange?: (value: AspectRatio2) => void;
  value?: AspectRatio2;
}

const ImageAspectRatio2Select = memo<ImageAspectRatio2SelectProps>(
  ({ value, onChange, defaultValue = 'auto' }) => {
    const [ratio, setRatio] = useMergeState(value ?? defaultValue, {
      defaultValue,
      onChange,
      value,
    });

    const options = useMemo(
      () => NANO_BANANA_2_ASPECT_RATIOS.map((item) => ({ label: item, value: item })),
      [],
    );

    return (
      <Select
        onChange={(next) => setRatio(next as AspectRatio2)}
        options={options}
        style={{ height: 32, marginRight: 10, width: 75 }}
        value={ratio}
      />
    );
  },
);

export default ImageAspectRatio2Select;
