import React from "react";
import styles from "./styles/SliderItem.module.css";

const SliderItem = ({ item, isActive }) => {
  return (
    <div className={`${styles.sliderItem} ${isActive ? styles.active : ""}`}>
      <a href={item.link}>
        <img className={styles.img} src={item.url} alt={item.alt} />
      </a>
    </div>
  );
};

export default SliderItem;
