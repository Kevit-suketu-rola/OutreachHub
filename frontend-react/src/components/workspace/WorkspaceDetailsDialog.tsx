export const WorkspaceDetailsDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  workspace: any;
}> = ({ open, onClose, workspace }) => {
  if (!open || !workspace) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-md w-full p-6 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">{workspace.name}</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Description:</strong> {workspace.description}
          </p>
          <p>
            <strong>Tags:</strong> {workspace.tags.join(", ")}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(workspace.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Creator ID:</strong> {workspace.creator}
          </p>
        </div>
        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
