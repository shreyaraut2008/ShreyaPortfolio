import VideoIntro from '../components/VideoIntro';
import AboutMe from '../components/AboutMe';
import WhatImBuilding from '../components/WhatImBuilding';
import SkillsGalaxy from '../components/SkillsGalaxy';
import AIAssistant from '../components/AIAssistant';
import ContactSection from '../components/ContactSection';

export default function Home() {
  return (
    <main>
      <VideoIntro />
      <AboutMe />
      <SkillsGalaxy />
      <AIAssistant />
      <WhatImBuilding />
      <ContactSection />
    </main>
  );
}
