import { type CreatedLevelSliderProps, createLevelSliderComponent } from './createLevelSlider';

const THINKING_LEVELS = ['low', 'medium', 'high'] as const;
type ThinkingLevel3 = (typeof THINKING_LEVELS)[number];

export type ThinkingLevel3SliderProps = CreatedLevelSliderProps<ThinkingLevel3>;

const ThinkingLevel3Slider = createLevelSliderComponent<ThinkingLevel3>({
  defaultValue: 'high',
  levels: THINKING_LEVELS,
  style: { minWidth: 160 },
});

export default ThinkingLevel3Slider;
