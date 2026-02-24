import React, { useState, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-toastify';

const config = require('./Apiconfig');

function ItemInput({ open, handleClose, productCode, ProductImage }) {
    const [productImage, setProductImage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [logoSrc, setLogoSrc] = useState(null); // ✅ Store the correct image source

    const company_code = sessionStorage.getItem('selectedCompanyCode');

    useEffect(() => {
        if (ProductImage) {
            if (ProductImage instanceof Blob) {
                // ✅ Handle Blob images
                const blobUrl = URL.createObjectURL(ProductImage);
                setLogoSrc(blobUrl);

                // Cleanup URL object when component unmounts
                return () => URL.revokeObjectURL(blobUrl);
            } else if (typeof ProductImage === 'object' && ProductImage.data) {
                // ✅ Handle Buffer Data
                const base64String = arrayBufferToBase64(ProductImage.data);
                setLogoSrc(`data:image/jpeg;base64,${base64String}`);
            } else if (typeof ProductImage === 'string') {
                // ✅ Handle URLs or Base64 strings directly
                setLogoSrc(ProductImage);
            }
        }
    }, [ProductImage]);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSize = 1 * 1024 * 1024; // 1MB limit
            if (file.size > maxSize) {
                toast.warning('File size exceeds 1MB. Please upload a smaller file');
                event.target.value = null;
                return;
            }
            setSelectedImage(URL.createObjectURL(file)); // Show selected image immediately
            setProductImage(file); // Store for submission
        }
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const handleInsert = async () => {
        if (!company_code || !productCode) {
            toast.warning("Company code or Product code is missing");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("company_code", company_code);
            formData.append("Product_Code", productCode);

            if (productImage) {
                formData.append("Product_img", productImage);
            }

            const response = await fetch(`${config.apiBaseUrl}/productImageUpdate`, {
                method: "POST",
                body: formData,
            });

            if (response.status === 200) {
                toast.success("Data inserted successfully!", {
                    onClose: () => window.location.reload(),
                });
            } else if (response.status === 400) {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message);
            } else {
                toast.error('Failed to insert data');
            }
        } catch (error) {
            toast.error('Error inserting data: ' + error.message);
        }
    };

    return (
        <div>
            {open && (
                <fieldset>
                    <div className="modal mt-5" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-xl px-4 p-3" role="document">
                            <div className="modal-content">
                                <div className="row justify-content-center">
                                    <div className="col-md-12 text-center">
                                        <div className="p-1 justify-content-between bg-body-tertiary">
                                            <div className="d-flex justify-content-between">
                                                <h1 className="purbut me-4">Image Update</h1>
                                                <button onClick={handleClose} className="btn btn-danger" title="Close">
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2 mb-4">
                                        <div className="modal-body">
                                            <div className="row ms-3 me-3">
                                                <div className="col-md-3 form-group mb-2">
                                                    <label className="exp-form-labels">Product Code<span className="text-danger">*</span></label>
                                                    <input
                                                        className="exp-input-field form-control"
                                                        type="text"
                                                        value={productCode}
                                                        readOnly
                                                    />
                                                </div>

                                                <div className="col-md-3 form-group mb-2">
                                                    <label className="exp-form-labels">Image</label>
                                                    <input
                                                        type="file"
                                                        className="exp-input-field form-control"
                                                        accept="image/*"
                                                        onChange={handleFileSelect}
                                                    />
                                                </div>

                                                {(selectedImage || logoSrc) && (
                                                    <div className="col-md-3 form-group mb-2">
                                                        <img
                                                            src={selectedImage || logoSrc}
                                                            alt="Product"
                                                            className="avatar rounded sm mt-4"
                                                            style={{ height: '200px', width: '200px' }}
                                                        />
                                                    </div>
                                                )}

                                                <div className="col-md-4 form-group">
                                                    <button onClick={handleInsert} className="btn btn-primary mt-4">Update</button>
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
