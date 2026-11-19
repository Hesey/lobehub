import { type CreatedLevelSliderProps, createLevelSliderComponent } from './createLevelSlider';

// Separate from thinkingLevel5 to preserve existing Flash-Lite settings.
const THINKING_LEVELS = ['low', 'medium', 'high', 'xhigh'] as const;
type ThinkingLevel6 = (typeof THINKING_LEVELS)[number];

export type ThinkingLevel6SliderProps = CreatedLevelSliderProps<ThinkingLevel6>;

const ThinkingLevel6Slider = createLevelSliderComponent<ThinkingLevel6>({
  defaultValue: 'high',
  levels: THINKING_LEVELS,
});

export default ThinkingLevel6Slider;
