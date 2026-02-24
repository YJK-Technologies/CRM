import * as React from 'react';

export default function PdfPreviewHelp({ open, handleClose, pdfUrl }) {

  return (
    <div>
      {open && (
        <fieldset>
          <div>
          <div className="purbut">
          <div className="modal mt-5 Topnav-screen popup popupadj" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-xl ps-5 p-1 pe-5" role="document">
                <div className="modal-content">
                  <div className="row justify-content-center">
                    <div className="col-md-12 text-center">
                    <div className="p-0 bg-body-tertiary">
                          <div className="purbut mb-0 d-flex justify-content-between" >
                            <h1 align="left" className="purbut">PDF Preview</h1>
                            <button onClick={handleClose} className="purbut btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                            <i class="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                          <div class="d-flex justify-content-between">
                            <div className="d-flex justify-content-start">
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className="modal-body">
                      {pdfUrl ? (
                        <iframe
                          src={pdfUrl}
                          title="PDF Preview"
                          style={{
                            width: "100%",
                            height: "70vh", 
                            border: "none"
                          }}
                        />
                      ) : (
                        <p>No PDF available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mobileview">
          <div className="modal mt-5 Topnav-screen" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-xl ps-4 pe-4 p-1" role="document">
                <div className="modal-content">
                  <div className="row justify-content-center">
                  <div class="col-md-12 text-center">
                        <div className="mb-0 d-flex justify-content-between">
                          <div className="mb-0 d-flex justify-content-start me-4">
                            <h1 className="h1">PDF Preview</h1>
                          </div>
                          <div className="mb-0 d-flex justify-content-end" >
                            <button onClick={handleClose} className="closebtn2" required title="Close">
                            <i class="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        </div>
                        <div class="d-flex justify-content-between">
                          <div className="d-flex justify-content-start">
                          </div>
                        </div>
                      </div>
                    <div className="modal-body">
                      {pdfUrl ? (
                        <iframe
                          src={pdfUrl}
                          title="PDF Preview"
                          style={{
                            width: "100%",
                            height: "70vh", 
                            border: "none"
                          }}
                        />
                      ) : (
                        <p>No PDF available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </fieldset>
      )}
    </div>
  );
}
