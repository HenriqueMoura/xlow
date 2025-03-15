import Slider from "./components/slider/Slider";

const App = () => {
  const sliderItems = [
    {
      url: "https://placecats.com/1280/821",
      alt: "Slide 1",
      link: "#",
    },
    {
      url: "https://placecats.com/1280/822",
      alt: "Slide 2",
      link: "#",
    },
    {
      url: "https://placecats.com/1280/825",
      alt: "Slide 3",
      link: "#",
    },
  ];

  return (
    <div>
      <Slider items={sliderItems} />
    </div>
  );
};

export default App;
