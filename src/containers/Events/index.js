import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);


  // Filtrer les événements par type
  const filteredEvents = (data?.events || []).filter(event =>
    !type || event.type === type
  );


  // Paginer les événements filtrés
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);


  // Changer le type de filtre
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  // Calculer le nombre de pages
  const pageNumber = Math.ceil(filteredEvents.length / PER_PAGE);
  const typeList = Array.from(new Set(data?.events.map((event) => event.type)));


  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={typeList}
            onChange={(value) => changeType(value)}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => {
              // Vérifie que toutes les propriétés nécessaires sont définies
              if (!event.cover || !event.title || !event.date) {
                return null;
              }

              const eventDate = new Date(event.date);

              return (
                <Modal key={event.id} Content={<ModalEvent event={event} />}>
                  {({ setIsOpened }) => (
                    <EventCard
                      onClick={() => setIsOpened(true)}
                      imageSrc={event.cover}
                      title={event.title}
                      date={eventDate} // Passer une instance de Date
                      label={event.type}
                    />
                  )}
                </Modal>
              );
            })}
          </div>
          <div className="Pagination">
            {Array.from({ length: pageNumber }).map((_, index) => (
              <a
                key={`page-${index + 1}`}
                href="#events"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
