import Hero from "../components/home/Hero"
import Mission from "../components/home/Mission"
import Differentiated from "../components/home/Differentiated"
import MapSection from "../components/home/MapSection"
import Stats from "../components/home/Stats"
import Andes from "../components/home/Andes"
import VideoSection from "../components/home/VideoSection"
import CtaLink from "../components/CtaLink"

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <Differentiated />
      <MapSection />
      <Stats />
      <Andes />
      <VideoSection />
      <CtaLink
        label={{ en: "Meet the Lumens", es: "Conoce a los Lumens" }}
        href="#/scholars"
      />
    </>
  )
}
