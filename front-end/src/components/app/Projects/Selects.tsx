import Select from "react-select";
import { AppDispatch } from "../../../state/store";
import { useDispatch } from "react-redux";
import SelectDueDate from "./SelectDueDay";
import {
  customStyles,
  optionsDueDate,
  optionsSort,
  optionsStatus,
} from "../../../utils/data";
import {
  Filters,
  OptionDueDate,
  OptionSort,
  OptionStatus,
} from "../../../utils/types";
import { setFilters } from "../../../state/projects/projectsSlice";

type SelectsProps = {
  filters: Filters;
  selectedDueDayBefore: Date | undefined;
  setSelectedDueDayBefore: React.Dispatch<
    React.SetStateAction<Date | undefined>
  >;
  selectedDueDayAfter: Date | undefined;
  setSelectedDueDayAfter: React.Dispatch<
    React.SetStateAction<Date | undefined>
  >;
};

export default function Selects({
  filters,
  selectedDueDayBefore,
  setSelectedDueDayBefore,
  selectedDueDayAfter,
  setSelectedDueDayAfter,
}: SelectsProps) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 my-4">
        <SelectDueDate
          selectedDueDay={selectedDueDayBefore}
          setSelectedDueDay={setSelectedDueDayBefore}
          title="Due before"
        />
        <SelectDueDate
          selectedDueDay={selectedDueDayAfter}
          setSelectedDueDay={setSelectedDueDayAfter}
          title="Due after"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
        <label>
          <p className="opacity-70 pb-1">Status</p>
          <Select
            options={optionsStatus}
            value={optionsStatus.find(
              option => option.value === filters.status
            )}
            defaultValue={optionsStatus[0]}
            isSearchable={false}
            styles={customStyles<OptionStatus>()}
            onChange={option => dispatch(setFilters({ status: option?.value }))}
          />
        </label>
        <label>
          <p className="opacity-70 pb-1">Sort</p>
          <Select
            options={optionsSort}
            value={optionsSort.find(option => option.value === filters.sort)}
            isSearchable={false}
            defaultValue={optionsSort[0]}
            styles={customStyles<OptionSort>()}
            onChange={option => dispatch(setFilters({ sort: option?.value }))}
          />
        </label>
        <label>
          <p className="opacity-70 pb-1">Due date</p>
          <Select
            options={optionsDueDate}
            value={optionsDueDate.find(
              option => option.value === filters.dueDate
            )}
            defaultValue={optionsDueDate[0]}
            isSearchable={false}
            styles={customStyles<OptionDueDate>()}
            onChange={option =>
              dispatch(setFilters({ dueDate: option?.value }))
            }
          />
        </label>
      </section>
    </>
  );
}
