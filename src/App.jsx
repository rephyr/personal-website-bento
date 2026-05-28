import BentoBox from "./components/BentoBox";

function App() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-900 p-6">
      <div style={{ width: "min(95vw, calc(95vh * 1.5))", height: "min(95vh, calc(95vw / 1.5))" }}>
        <BentoBox />
      </div>
    </div>
  );
}

export default App;
