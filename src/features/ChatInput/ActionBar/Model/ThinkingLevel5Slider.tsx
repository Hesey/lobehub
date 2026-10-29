import { type CreatedLevelSliderProps, createLevelSliderComponent } from './createLevelSlider';

const THINKING_LEVELS = ['minimal', 'low', 'medium', 'high'] as const;
type ThinkingLevel5 = (typeof THINKING_LEVELS)[number];

export type ThinkingLevel5SliderProps = CreatedLevelSliderProps<ThinkingLevel5>;

const ThinkingLevel5Slider = createLevelSliderComponent<ThinkingLevel5>({
  defaultValue: 'minimal',
  levels: THINKING_LEVELS,
});

export default ThinkingLevel5Slider;
