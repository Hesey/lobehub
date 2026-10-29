import { type CreatedLevelSliderProps, createLevelSliderComponent } from './createLevelSlider';

const THINKING_LEVELS = ['low', 'high'] as const;
type ThinkingLevel2 = (typeof THINKING_LEVELS)[number];

export type ThinkingLevel2SliderProps = CreatedLevelSliderProps<ThinkingLevel2>;

const ThinkingLevel2Slider = createLevelSliderComponent<ThinkingLevel2>({
  defaultValue: 'high',
  levels: THINKING_LEVELS,
  style: { minWidth: 110 },
});

export default ThinkingLevel2Slider;
