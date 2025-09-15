import React from "react";

interface Props {
  onClose: () => void;
  data: Record<string, any>;
  loading?: boolean;
}

export const CampaignDetailsModal: React.FC<Props> = ({
  onClose,
  data,
  loading,
}) => {
  // const renderField = (key: string, value: any) => {
  //   if (typeof value === "object" && value !== null && "name" in value) {
  //     return value.name;
  //   } else if (typeof value === "object" && "$date" in value) {
  //     return new Date(value.$date).toLocaleString();
  //   } else if (Array.isArray(value)) {
  //     return value.join(", ");
  //   } else if (typeof value === "boolean") {
  //     return value ? "Yes" : "No";
  //   } else if (typeof value === "object" && value !== null) {
  //     return JSON.stringify(value, null, 2);
  //   }
  //   return value?.toString();
  // };
  const details = formatCampaignDetails(data);
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xl bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white text-black max-w-2xl px-10 py-6 rounded-lg shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b-2 pb-5">
          Campaign Details
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div>
            {Object.entries(details).map(([label, value]) => (
              <div key={label} className="flex items-start mb-2">
                <span className="w-40 text-gray-900 font-bold">{label}:</span>

                {label === "Tags" ? (
                  <div className="flex flex-wrap gap-2">
                    {value
                      .substring(1, value.length - 1)
                      .split(",")
                      .map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {tag.trim().replace(/"/g, "")}
                        </span>
                      ))}
                  </div>
                ) : (
                  <span className="text-black font-medium">{value}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const formatCampaignDetails = (campaign: Record<string, any>) => {
  const hiddenKeys = ["_id", "lastModifiedBy"];

  const keyToLabelMap: Record<string, string> = {
    workspaceId: "Workspace",
    creator: "Creator",
    templateId: "Template",
    name: "Name",
    tags: "Tags",
    status: "Status",
    startDate: "Start Date",
    endDate: "End Date",
    creationDate: "Created At",
  };

  const formatted: Record<string, string> = {};

  for (const key in campaign) {
    if (hiddenKeys.includes(key)) continue;

    const label = keyToLabelMap[key] || key;
    const value = campaign[key];

    let displayValue: string;

    if (typeof value === "object" && value !== null) {
      if ("name" in value) {
        displayValue = value.name;
      } else if ("title" in value) {
        displayValue = value.title;
      } else if ("$date" in value) {
        displayValue = new Date(value.$date).toLocaleString();
      } else {
        displayValue = JSON.stringify(value, null, 2);
      }
    } else if (Array.isArray(value)) {
      displayValue = value.toString();
    } else if (typeof value === "string" && Date.parse(value)) {
      displayValue = new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } else if (typeof value === "boolean") {
      displayValue = value ? "Yes" : "No";
    } else {
      displayValue = value?.toString() || "-";
    }

    formatted[label] = displayValue;
  }

  return formatted;
};
