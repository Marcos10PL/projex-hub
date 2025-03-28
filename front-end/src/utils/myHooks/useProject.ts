import { useEffect, useRef, useState } from "react";
import { projectResponseSchema, ProjectType } from "../zodSchemas";
import useApi from "./useApi";

type useProjectProps = {
  id: string | undefined;
};

export default function useProject({ id }: useProjectProps) {
  const { loading, fetchData, errorMsg } = useApi(
    "projects/" + id,
    projectResponseSchema,
    "get"
  );

  const fetchDataRef = useRef(fetchData);
  const [project, setProject] = useState<ProjectType>();

  useEffect(() => {
    if (!id) {
      setProject(undefined);
      return;
    }

    const getProject = async () => {
      const res = await fetchDataRef.current();
      if (res) setProject(res.project);
    };

    getProject();
  }, [id]);

  return { project, loading, errorMsg } as const;
}
