import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion';
import { SCENE_TIMINGS } from './constants';
import { Scene1Flood } from './scenes/Scene1Flood';
import { Scene2AIArrives } from './scenes/Scene2AIArrives';
import { Scene3Sort } from './scenes/Scene3Sort';
import { Scene4Extraction } from './scenes/Scene4Extraction';
import { Scene5CRM } from './scenes/Scene5CRM';
import { Scene6Audit } from './scenes/Scene6Audit';
import { Scene7Outreach } from './scenes/Scene7Outreach';
import { Scene8Invoice } from './scenes/Scene8Invoice';
import { Scene9Impact } from './scenes/Scene9Impact';

export const MainVideo: React.FC = () => {
  const s = SCENE_TIMINGS;
  return (
    <AbsoluteFill style={{ background: '#f0f4ff', fontFamily: 'Inter, sans-serif' }}>
      <Audio src={staticFile('background.mp3')} volume={0.4} />
      <Sequence from={s.scene1.start} durationInFrames={s.scene1.end - s.scene1.start}>
        <Scene1Flood />
      </Sequence>
      <Sequence from={s.scene2.start} durationInFrames={s.scene2.end - s.scene2.start}>
        <Scene2AIArrives />
      </Sequence>
      <Sequence from={s.scene3.start} durationInFrames={s.scene3.end - s.scene3.start}>
        <Scene3Sort />
      </Sequence>
      <Sequence from={s.scene4.start} durationInFrames={s.scene4.end - s.scene4.start}>
        <Scene4Extraction />
      </Sequence>
      <Sequence from={s.scene5.start} durationInFrames={s.scene5.end - s.scene5.start}>
        <Scene5CRM />
      </Sequence>
      <Sequence from={s.scene6.start} durationInFrames={s.scene6.end - s.scene6.start}>
        <Scene6Audit />
      </Sequence>
      <Sequence from={s.scene7.start} durationInFrames={s.scene7.end - s.scene7.start}>
        <Scene7Outreach />
      </Sequence>
      <Sequence from={s.scene8.start} durationInFrames={s.scene8.end - s.scene8.start}>
        <Scene8Invoice />
      </Sequence>
      <Sequence from={s.scene9.start} durationInFrames={s.scene9.end - s.scene9.start}>
        <Scene9Impact />
      </Sequence>
    </AbsoluteFill>
  );
};
