import React, { useState } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer,toast } from 'react-toastify';

const config = require('./Apiconfig');

function ItemInput({ open, handleClose, companyNo, companyLogo }) {
    const [comapnyImage, setCompanyImage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSize = 1 * 1024 * 1024;
            if (file.size > maxSize) {
                
                toast.warning('File size exceeds 1MB. Please upload a smaller file')
                event.target.value = null;
                return;
            }
            setSelectedImage(URL.createObjectURL(file));
            setCompanyImage(file);
        }
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const logoSrc = selectedImage
        ? selectedImage
        : companyLogo
            ? `data:image/jpeg;base64,${typeof companyLogo === 'object' ? arrayBufferToBase64(companyLogo.data) : companyLogo}`
            : null;

    const handleInsert = async () => {
        if (!companyNo) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("company_no", companyNo);

            if (comapnyImage) {
                formData.append("company_logo", comapnyImage);
            }

            const response = await fetch(`${config.apiBaseUrl}/UpdateCompanyImage`, {
                method: "POST",
                body: formData,
            });

            if (response.status === 200) {
                console.log("Data inserted successfully");
                 setTimeout(() => {
                          toast.success("Data inserted successfully!", {
                            onClose: () => window.location.reload(), // Reloads the page after the toast closes
                          });
                }, 1000);
            } else if (response.status === 400) {
                const errorResponse = await response.json();
                console.error(errorResponse.message);
 toast.warning(errorResponse.message, {
          
        });               
          } else {
                 console.error("Failed to insert data");
                 toast.error('Failed to insert data', {
                   
                 });
               }
             } catch (error) {
               console.error("Error inserting data:", error);
               toast.error('Error inserting data: ' + error.message, {
                
               });
             }
           };

    return (
        <div>
                  <ToastContainer position="top-right" className="toast-design" theme="colored"/>
            {open && (
                <fieldset>
                    <div className="modal mt-5" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} >
                        <div className="modal-dialog modal-xl px-4 p-3" role="document">
                            <div className="modal-content">
                                <div class="row justify-content-center">
                                    <div class="col-md-12 text-center">
                                        <div className="p-1 justify-content-between bg-body-tertiary">
                                            <div class="d-flex justify-content-between">
                                                <div className="d-flex justify-content-start">
                                                    <h1 align="left" className="purbut me-4">Image Update</h1>
                                                </div>
                                                <div className="d-flex justify-content-end purbut me-4">
                                                    <delbutton onClick={handleClose} className="purbut btn btn-danger" required title="Close">
                                                    <i class="fa-solid fa-xmark"></i>
                                                    </delbutton>
                                                </div>
                                            </div>
                                            <div class="mobileview">
                                                <div class="d-flex justify-content-between">
                                                    <div className="d-flex justify-content-start ">
                                                        <h1 className="" style={{ marginRight: "35px", fontSize: "20px" }}>Image Update</h1>
                                                    </div>
                                                    <div className="d-flex justify-content-end">
                                                        <delbutton onClick={handleClose} className="btn btn-danger" required title="Close">
                                                        <i class="fa-solid fa-xmark"></i>
                                                        </delbutton>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="pt-2 mb-4">
                                        <div className="modal-body">
                                            <div class="row ms-3 me-3">
                                                <div className="col-md-3 form-group mb-2">
                                                    <div class="exp-form-floating">
                                                        <div class="d-flex justify-content-start">
                                                            <div>
                                                                <label for="state" class="exp-form-labels">
                                                                    Company No
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <span className="text-danger">*</span>
                                                            </div>
                                                        </div>
                                                        <input
                                                            id="Icode"
                                                            class="exp-input-field form-control"
                                                            type="text"
                                                            placeholder=""
                                                            required title="Please enter the code"
                                                            maxLength={18}
                                                            value={companyNo}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 form-group mb-2 ">
                                                    <div class="exp-form-floating">
                                                        <label for="locno" class="exp-form-labels">
                                                            Image
                                                        </label>
                                                        <input type="file"
                                                            class="exp-input-field form-control"
                                                            accept="image/*"
                                                            onChange={handleFileSelect}
                                                        />
                                                    </div>
                                                </div>
                                                {logoSrc && (
                                                    <div className="col-md-3 form-group mb-2">
                                                        <div className="exp-form-floating">
                                                            <img
                                                                src={logoSrc}
                                                                alt="Company Logo"
                                                                className="avatar rounded sm mt-4"
                                                                style={{ height: '200px', width: '200px' }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                <div class="col-md-4 form-group  ">
                                                    <button onClick={handleInsert} class="mt-4" required title="update"> Update</button>
                                                </div>
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
export default ItemInput;
