import { useEffect } from "react";
import API from "../../../utils/axiosConfig";

export default function Projects() {
  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await API.get("projects");
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    getProjects();
  });

  return <div>Projects</div>;
}
