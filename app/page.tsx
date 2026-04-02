import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import PlayerSection from '@/components/PlayerSection'
import Events from '@/components/Events'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <PlayerSection />
        <Events />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
