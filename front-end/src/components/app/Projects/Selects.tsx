import Select from "react-select";
import { AppDispatch, RootState } from "../../../state/store";
import { useDispatch, useSelector } from "react-redux";
import SelectDueDate from "./SelectDueDay";
import {
  customStyles,
  optionsDueDate,
  optionsSort,
  optionsStatus,
} from "../../../utils/data";
import { OptionDueDate, OptionSort, OptionStatus } from "../../../utils/types";
import { setFilters } from "../../../state/filters/projectsFiltersSlice";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAnglesUp } from "@fortawesome/free-solid-svg-icons";

export default function Selects() {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.proejctsFilters);

  const handleSetDueDayBefore = (date: Date | undefined) => {
    dispatch(
      setFilters({ dueDateBefore: date?.toISOString() ?? null, currentPage: 1 })
    );
  };

  const handleSetDueDayAfter = (date: Date | undefined) => {
    dispatch(
      setFilters({ dueDateAfter: date?.toISOString() ?? null, currentPage: 1 })
    );
  };

  const [open, setOpen] = useState(false);

  return (
    <section>
      <button
        onClick={() => setOpen(!open)}
        className="w-full border-2 border-gray-600 rounded-lg bg-gray-700 text-text px-3 py-1 flex justify-between items-center hover:bg-gray-600 transition-colors"
      >
        Filters - click to {open ? "hide" : "show"}
        <FontAwesomeIcon
          icon={open ? faAnglesUp : faAnglesDown}
          className="fill-secondary"
        />
      </button>
      {open && (
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 my-4">
            <SelectDueDate
              selectedDueDay={
                filters.dueDateBefore
                  ? new Date(filters.dueDateBefore)
                  : undefined
              }
              setSelectedDueDay={handleSetDueDayBefore}
              title="Due before"
            />
            <SelectDueDate
              selectedDueDay={
                filters.dueDateAfter
                  ? new Date(filters.dueDateAfter)
                  : undefined
              }
              setSelectedDueDay={handleSetDueDayAfter}
              title="Due after"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
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
                onChange={option =>
                  dispatch(setFilters({ status: option?.value }))
                }
              />
            </label>
            <label>
              <p className="opacity-70 pb-1">Sort</p>
              <Select
                options={optionsSort}
                value={optionsSort.find(
                  option => option.value === filters.sort
                )}
                isSearchable={false}
                defaultValue={optionsSort[0]}
                styles={customStyles<OptionSort>()}
                onChange={option =>
                  dispatch(setFilters({ sort: option?.value }))
                }
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
          </div>
        </div>
      )}
    </section>
  );
}
