import React from "react";
import styles from "./styles/SliderNavigation.module.css";

const SliderNavigation = ({
  currentIndex,
  totalItems,
  nextSlide,
  prevSlide,
  setCurrentIndex,
}) => {
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.navigation}>
      <button className={styles.arrow} onClick={prevSlide}>
        {"<"}
      </button>
      <div className={styles.dots}>
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              index === currentIndex ? styles.active : ""
            }`}
            onClick={() => handleDotClick(index)}
          ></button>
        ))}
      </div>
      <button className={styles.arrow} onClick={nextSlide}>
        {">"}
      </button>
    </div>
  );
};

export default SliderNavigation;
