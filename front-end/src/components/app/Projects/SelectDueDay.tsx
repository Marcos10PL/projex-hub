import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { DayPicker } from "react-day-picker";

type SelectDueDateProps = {
  selectedDueDay: Date | undefined;
  setSelectedDueDay: React.Dispatch<React.SetStateAction<Date | undefined>>;
  title: string;
};

export default function SelectDueDate({
  selectedDueDay,
  setSelectedDueDay,
  title,
}: SelectDueDateProps) {
  const [isOpened, setIsOpened] = useState(false);

  const onDayClick = (day: Date) => {
    if (
      selectedDueDay &&
      selectedDueDay.toDateString() === day.toDateString()
    ) {
      setSelectedDueDay(undefined);
    } else {
      setSelectedDueDay(day);
    }
  };

  return (
    <div className="relative w-full ">
      <button
        type="button"
        onClick={() => setIsOpened(!isOpened)}
        className="bg-gray-800 px-2 py-1.5 rounded-lg w-full text-left flex justify-between items-center border-2 border-gray-500 focus:border-primary hover:border-primary hover:bg-gray-700 transition-colors"
      >
        {title} - {selectedDueDay ? selectedDueDay.toDateString() : "choose"}
        {isOpened ? (
          <FontAwesomeIcon icon={faChevronUp} className="fill-secondary" />
        ) : (
          <FontAwesomeIcon icon={faChevronDown} className="fill-secondary" />
        )}
      </button>
      {isOpened && (
        <div className="bg-gray-800 p-4 rounded-lg z-10 border-2 border-gray-700 absolute w-full flex justify-center mt-2">
          <DayPicker
            mode="single"
            onDayClick={onDayClick}
            classNames={{
              selected: `bg-gray-700 text-primary rounded-full`,
              today: `bg-gray-700 rounded-full`,
              root: `text-center`,
              chevron: `fill-secondary text-center cursor-pointer`,
            }}
            selected={selectedDueDay || undefined}
          />
        </div>
      )}
    </div>
  );
}
