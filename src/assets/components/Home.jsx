import PopularSlider from "./PopularSlider";
import Hero from "./Hero";
import Genre from "./Genre";

const Home = ({openInfo}) => {
  return (
    <div>
         <Hero openInfo={openInfo}/>
        <PopularSlider/>
        <Genre/>
    </div>
  )
}

export default Home
