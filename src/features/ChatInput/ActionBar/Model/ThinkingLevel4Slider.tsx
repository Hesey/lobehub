import { type CreatedLevelSliderProps, createLevelSliderComponent } from './createLevelSlider';

const THINKING_LEVELS = ['minimal', 'high'] as const;
type ThinkingLevel4 = (typeof THINKING_LEVELS)[number];

export type ThinkingLevel4SliderProps = CreatedLevelSliderProps<ThinkingLevel4>;

const ThinkingLevel4Slider = createLevelSliderComponent<ThinkingLevel4>({
  defaultValue: 'minimal',
  levels: THINKING_LEVELS,
  style: { minWidth: 110 },
});

export default ThinkingLevel4Slider;
