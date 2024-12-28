import OverView from "./OverView";
import Projects from "./Projects";
import Contact from "./Contact";
import Cv from "./Cv";
import Tech from "./Tech";

function BentoBox() {
  return (
    <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-3 p-20 xl:m-64 lg:m-32 md:m-16">
      <OverView />
      <Projects/>   
      <Contact />
      <Cv />
      <Tech />
    </div>
  );
}

export default BentoBox;  