import HomeHero from "./components/HomeHero"
import HomeNewHero from "./components/HomeNewHero"
function Home() {
    return (
        <div className="page-content">
            <HomeNewHero />
            <HomeHero />
            <div className="abc-content">
                <div className="abc-title">
                    About me
                </div>
                <div className="abc-text">
                    For the first 18 years of my childhood, which I try with all power I have to elongate throughout the rest of my life, I lived in Gdańsk, Poland. There, I’ve graduated from CS in 3rd high school in Gdynia; while I haven’t been appreciative enough of that at the time, I got to experience many years of companion of the best programmers in Poland, working under the same teacher as Jakub Pachocki or Szymon Sidor. <br /> <br /> While my friends proceeded to begin their studies at the University of Warsaw, I took a large detour - instead, I committed to a broad range of side-interests definable as “creative hustling” - coming up with one project after another, and learning something important about building a business from it. And oh, were there many; starting from those purely creative, like writing a book about my teacher (they made a movie about him), through those fancy-but-technically-inachievable (at least for me back then, cause later friend .com came to be), then those, for which the younger me just lacked the balls (mobile shops, food-trucks but for fashion/ecommerce stores - noone has done that yet), up to the Networker - the first one I actually brought to life. <br /> <br /> It took me few iterations of learning to get from wordpress, through lovable and Claude-code, until I regularly used out the 20$ sub and had to buy Claude Max - as I now made a full circle, and got back to the motherland of coding manually (this website). It has been a fun journey, one that exposed me to multiple angles onto a project/business. Now, I lead my own projects (see the projects tab), and personally fight (=dream and work) for a place in the San Francisco startup scene.
                </div>
            </div>
        </div>
        
    )
}
export default Home
