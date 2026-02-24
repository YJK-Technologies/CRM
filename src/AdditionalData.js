import React from "react";
import labels from "./Labels";
const AuditInfo = () => {
  return (
    <div className="shadow-lg p-2 bg-body-tertiary rounded mt-2 mb-2">
      <div className="row ms-2">
        <div className="d-flex justify-content-start">
          <p className="col-md-6">
            {labels.createdBy}:{additionalData.created_by}
             </p>
          <p className="col-md-6">
            {labels.createdDate}:{additionalData.created_date}
             </p>
        </div>
        <div className="d-flex justify-content-start">
          <p className="col-md-6"> 
            {labels.createdDate}: {additionalData.modified_by}{" "}
           </p>
          <p className="col-md-6">
             {labels.createdDate}: {additionalData.modified_date} 
             </p>
        </div>
      </div>
    </div>
  );
};

export default AuditInfo;
