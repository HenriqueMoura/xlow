import { useState } from "react";
import SliderItem from "./SliderItem";
import SliderNavigation from "./SliderNavigation";

import styles from "./styles/Slider.module.css";

const Slider = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider}>
        {items.map((item, index) => (
          <SliderItem
            key={index}
            item={item}
            isActive={index === currentIndex}
          />
        ))}
      </div>
      <SliderNavigation
        currentIndex={currentIndex}
        totalItems={items.length}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
};

export default Slider;
