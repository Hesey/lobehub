import { type CreatedLevelSliderProps, createLevelSliderComponent } from './createLevelSlider';

const THINKING_LEVELS = ['minimal', 'low', 'medium', 'high'] as const;
type ThinkingLevel = (typeof THINKING_LEVELS)[number];

export type ThinkingLevelSliderProps = CreatedLevelSliderProps<ThinkingLevel>;

const ThinkingLevelSlider = createLevelSliderComponent<ThinkingLevel>({
  defaultValue: 'high',
  levels: THINKING_LEVELS,
});

export default ThinkingLevelSlider;
