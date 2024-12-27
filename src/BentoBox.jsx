import OverView from "./OverView";

function BentoBox() {
  return (
    <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-3 p-20 xl:m-64 lg:m-32 md:m-16">
      <OverView />
      <div className="col-span-2 row-span-2 rounded-xl bg-white outline outline-2 outline-pink-300 hover-grow">Projects</div>
      <div className="col-span-1 row-span-1 rounded-xl bg-white outline outline-2 outline-pink-300 hover-grow">Contact</div>
      <div className="col-span-1 row-span-1 rounded-xl bg-white outline outline-2 outline-pink-300 hover-grow">CV</div>
      <div className="col-span-4 row-span-1 rounded-xl bg-white outline outline-2 outline-pink-300 hover-grow">Tech</div>
    </div>
  );
}

export default BentoBox;