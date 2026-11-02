"use client";

import { useProjectWindows } from "./ProjectWindows";
import Icon from "./Icon";

export default function OpenProjectButton({ projectId }: { projectId: string }) {
  const { openProject } = useProjectWindows();
  return <button type="button" className="open-workspace-button" onClick={() => openProject(projectId)}>Open in workspace <Icon name="arrow-up-right" /></button>;
}
