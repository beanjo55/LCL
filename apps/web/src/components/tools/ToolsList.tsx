import React, { useEffect, useState } from "react";
import type { Tool } from "../../types/tool";
import ToolComponent from "./Tool";

const ToolsList: React.FC = () => {
  const [tools, setTools] = useState<Array<Tool>>([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch("/api/tools");
        if (!response.ok) {
          throw new Error("Failed to fetch tools");
        }
        const data: Array<Tool> = await response.json();
        setTools(data);
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };
    fetchTools();
  }, []);

  return (
    <React.Fragment>
      <h2>Tools List</h2>
      {tools.length ? (
        tools.map((t) => <ToolComponent key={t.id} tool={t} />)
      ) : (
        <p>No tools available</p>
      )}
    </React.Fragment>
  );
};

export default ToolsList;
