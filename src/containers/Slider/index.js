import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  const eventKeys = data ? Object.keys(data.focus) : [];
  
  // Trie les clés par date décroissante
  const sortedEventKeys = eventKeys.sort((keyA, keyB) => 
    new Date(data.focus[keyB].date) - new Date(data.focus[keyA].date)
  );

  const nextCard = () => {
    setIndex((prevIndex) => (prevIndex < sortedEventKeys.length - 1 ? prevIndex + 1 : 0));
  };

  useEffect(() => {
    const interval = setInterval(nextCard, 5000);
    return () => clearInterval(interval);
  }, [sortedEventKeys.length]);

  return (
    <div className="SlideCardList">
      {sortedEventKeys.map((key, idx) => {
        const event = data.focus[key];
        return (
          <div
            key={event.title}
            className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {sortedEventKeys.map((key, radioIdx) => (
            <input
              key={key}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => setIndex(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
