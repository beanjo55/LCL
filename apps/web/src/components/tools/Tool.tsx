import React, { useEffect, useState } from "react";
import type { Tool as ToolType } from "../../types/tool";

interface ToolComponentProps {
  tool: ToolType;
}

const ToolComponent: React.FC<ToolComponentProps> = ({ tool: propTool }) => {
  const [toolData, setToolData] = useState<ToolType | null>(null);

  useEffect(() => {
    setToolData(propTool);
  }, [propTool]);

  return (
    <React.Fragment>
      <h3>Tool Entry</h3>
      {toolData && (
        <div>
          <p>Name: {toolData.name}</p>
          <p>ID: {toolData.id}</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default ToolComponent;
