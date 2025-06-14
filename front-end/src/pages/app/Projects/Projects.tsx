import Spinner from "../../../components/Spinner";
import Pagination from "../../../components/app/Projects/Pagination";
import Selects from "../../../components/app/Projects/Selects";
import AddProjectButton from "../../../components/app/Projects/AddProjectButton";
import { useProjects } from "../../../utils/myHooks/useProjects";
import ProjectsList from "../../../components/app/Projects/ProjectsList";
import SearchBar from "../../../components/app/Projects/SearchBar";

export default function Projects() {
  const {
    filters,
    projects,
    loading,
    totalProjects,
    totalPages,
    setPage,
    handleSearch,
  } = useProjects({});

  return (
    <>
      <SearchBar handleSearch={handleSearch} />

      <Selects />

      <AddProjectButton />

      {!loading && projects?.length === 0 ? (
        <ProjectsNotFound />
      ) : !loading ? (
        <ProjectsList projects={projects} totalProjects={totalProjects!} />
      ) : (
        <Spinner size={4} />
      )}

      {totalPages !== null && totalPages > 1 && (
        <Pagination
          totalPages={totalPages || 1}
          currentPage={filters.currentPage || 1}
          setCurrentPage={setPage}
        />
      )}
    </>
  );
}

function ProjectsNotFound() {
  return (
    <div className="text-center text-2xl font-bold text-gray-500 py-10">
      Projects not found
    </div>
  );
}
