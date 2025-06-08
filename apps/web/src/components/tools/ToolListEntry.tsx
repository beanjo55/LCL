import React, { useState, useEffect } from "react";
import type { Tool } from "../../types/tool";

interface ToolListEntryProps {
  tool: Tool;
}

const ToolListEntry: React.FC<ToolListEntryProps> = ({ tool }) => {
  const [toolData, setToolData] = useState<Tool | null>(null);

  useEffect(() => {
    setToolData(tool);
  }, [tool]);

  return (
    <div className="tool-list-entry">
      <h3>{toolData?.name}</h3>
      <p>ID: {toolData?.id}</p>
      <p>Description: {toolData?.description}</p>
      <p>Enabled: {toolData?.enabled ? "Yes" : "No"}</p>
      <button onClick={() => {}} className="focus-tool-button">
        Show Tool Settings
      </button>
    </div>
  );
};

export default ToolListEntry;
