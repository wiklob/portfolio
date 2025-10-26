import HomeHero from "./components/HomeHero"
import HomeNewHero from "./components/HomeNewHero"
function Home() {
    return (
        <div className="page-content">
            <HomeNewHero />
            <HomeHero />
        </div>
        
    )
}
export default Home
