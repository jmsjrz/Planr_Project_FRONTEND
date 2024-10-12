import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';


export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Content />
      <Footer />
    </div>
  )
}

export default LandingPage
