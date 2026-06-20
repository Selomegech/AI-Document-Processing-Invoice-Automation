import './index.css';
import { Composition } from 'remotion';
import { MainVideo } from './Composition';
import { FPS, TOTAL_FRAMES, WIDTH, HEIGHT } from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CPA-Automation"
        component={MainVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
