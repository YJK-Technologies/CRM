import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import LoadingScreen from './Loading';
const config = require('./Apiconfig');

const POsettings = () => {
    const [Type, setType] = useState("PurchaseOrder");
    const [selectedParty, setSelectedParty] = useState(null);
    const [party, setParty] = useState(null);
    const [partyDrop, setPartyDrop] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedPrint, setselectedPrint] = useState(null);
    const [printdrop, setprintdrop] = useState([]);
    const [selectedCopies, setselectedCopies] = useState(null);
    const [Print, setPrint] = useState(null);
    const [Copies, setCopies] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [PrintTemplate, setPrintTemplate] = useState([]);
    const [copiesdrop, setcopiesdrop] = useState([]);
    const [error, setError] = useState('');

    const handleChangeParty = (selectedParty) => {
        setSelectedParty(selectedParty);
        const selectedValue = selectedParty ? selectedParty.value : "";
        setParty(selectedValue);
    };

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getGSTReport`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            }),
        }).then((response) => response.json())
            .then((data) => {
                setPartyDrop(data);
                const defaultParty = data.find((item) => item.descriptions === "Customer") || data[0];
                if (defaultParty) {
                    setSelectedParty({
                        value: defaultParty.descriptions,
                        label: defaultParty.descriptions,
                    });
                    setParty(defaultParty.descriptions);
                }
            })
            .catch((error) => console.error("Error fetching invoice types:", error));
    }, []);

    const filteredOptionParty = Array.isArray(partyDrop)
        ? partyDrop.map((option) => ({
            value: option.descriptions,
            label: option.descriptions,
        }))
        : [];

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getDefaultoptions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                company_code: sessionStorage.getItem("selectedCompanyCode"),
                Screen_Type: Type
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data || data.length === 0) return;

                const { Shiping_to, Print_copies, Print_options } = data[0];

                const setDefault = (type, setType, options, setSelected) => {
                    if (type !== undefined && type !== null) {
                        const typeStr = type.toString();
                        setType(typeStr);
                        setSelected(options.find((opt) => opt.value === typeStr) || null);
                    }
                };
                setDefault(Shiping_to, setParty, filteredOptionParty, setSelectedParty);
                setDefault(Print_options, setPrint, filteredOptionPrint, setselectedPrint);
                setDefault(Print_copies, setCopies, filteredOptionCopies, setselectedCopies);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [partyDrop, printdrop, copiesdrop]);



    const handleSaveButtonClick = async () => {
        if (!party) {
            toast.warning('Error: Missing required fields');
            return;
        }

        setLoading(true);

        try {
            const selectedTemplate = PrintTemplate[currentIndex];
            const selectedKeyField = selectedTemplate ? selectedTemplate.keyfield : "";

            const Header = {
                company_code: sessionStorage.getItem('selectedCompanyCode'),
                Screen_Type: Type,
                Shiping_to: party,
                Print_options: Print,
                Print_copies: Copies,
                Print_templates: selectedKeyField,
                created_by: sessionStorage.getItem('selectedUserCode')
            };
            const response = await fetch(`${config.apiBaseUrl}/AddTransactionSettinngs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Header),
            });

            if (response.ok) {
                toast.success("Data inserted Successfully");
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert sales data");
                console.error(errorResponse.details || errorResponse.message);
            }
        } catch (error) {
            console.error("Error inserting data:", error);
            toast.error("Error inserting data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = () => {
        navigate("/PurchaseOrder"); // Pass selectedRows as props to the Input component
    };

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/PrintTemplates`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Screen_Type: Type
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const templates = data.map((item) => {
                        const byteArray = new Uint8Array(item.Templates.data);
                        const blob = new Blob([byteArray], { type: "image/png" });
                        const imageUrl = URL.createObjectURL(blob);
                        return {
                            keyfield: item.Key_field,
                            image: imageUrl,
                        };
                    });
                    setPrintTemplate(templates);
                }
            })
            .catch((error) =>
                console.error("Error fetching print templates:", error)
            );
    }, []);

    const handleChangePrint = (selectedOption) => {
        setselectedPrint(selectedOption);
        setPrint(selectedOption ? selectedOption.value : '');
    };
    const filteredOptionPrint = Array.isArray(printdrop) ? printdrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    })) : [];

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getPrint`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            }),
        })
            .then((response) => response.json())
            .then(setprintdrop)
            .catch((error) => console.error("Error fetching warehouse:", error));
    }, []);

    const handleChangeCopeies = (selectedOption) => {
        setselectedCopies(selectedOption);
        setCopies(selectedOption ? selectedOption.value : '');
    };

    const filteredOptionCopies = Array.isArray(copiesdrop) ? copiesdrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    })) : [];

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getcopies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_code: sessionStorage.getItem("selectedCompanyCode"),
            }),
        })
            .then((response) => response.json())
            .then(setcopiesdrop)
            .catch((error) => console.error("Error fetching warehouse:", error));
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? PrintTemplate.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === PrintTemplate.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="container-fluid Topnav-screen">
            {loading && <LoadingScreen />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-0 bg-body-tertiary rounded  ">
                <div className=" mb-0 d-flex justify-content-between" >
                    <label className="fw-bold fs-5">Default  Settings: </label>
                    <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            <div class="pt-2 mb-4">
                <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
                    <div className="row  ms-3 me-3">
                        <div className="col-md-3 form-group mb-2" >
                            <div class="exp-form-floating" >
                                <label for="">Ship To</label>
                                <Select
                                    id="status"
                                    value={selectedParty}
                                    onChange={handleChangeParty}
                                    options={filteredOptionParty}
                                    className="exp-input-field"
                                    placeholder=""
                                />
                            </div>
                        </div>
                        <div className="col-md-3 form-group mb-2" >
                            <div className="exp-form-floating">
                                <label className={` ${error && !selectedPrint ? 'text-danger' : ''}`}> Print Options<span className="text-danger">*</span></label>
                                <Select
                                    className="exp-input-field "
                                    id="customername"
                                    placeholder=""
                                    required
                                    value={selectedPrint}
                                    onChange={handleChangePrint}
                                    options={filteredOptionPrint}
                                    data-tip="Please select a default Options"
                                />
                            </div>
                        </div>
                        <div className="col-md-3 form-group mb-2" >
                            <div className="exp-form-floating">
                                <label className={` ${error && !selectedCopies ? 'text-danger' : ''}`}> Print Copies<span className="text-danger">*</span></label>
                                <Select
                                    className="exp-input-field "
                                    id="customername"
                                    placeholder=""
                                    required
                                    value={selectedCopies}
                                    onChange={handleChangeCopeies}
                                    options={filteredOptionCopies}
                                    data-tip="Please select a default Copy"
                                />
                            </div>
                        </div>
                        <div className="col-md-3 d-flex flex-column justify-content-between align-items-center h-100">
                            <div className="position-relative d-flex justify-content-center my-4">
                                <button
                                    className="nav-arrow btn btn-light rounded-1 position-absolute start-0 top-50 translate-middle-y"
                                    onClick={handlePrev}
                                    disabled={PrintTemplate.length === 0}
                                >
                                    ❮
                                </button>
                                <div className="template-preview-box border rounded shadow-sm py-2 ">
                                    {PrintTemplate.length > 0 ? (
                                        <img
                                            src={PrintTemplate[currentIndex].image}
                                            alt="Template"
                                            className="preview-image"
                                            style={{ maxWidth: "100%", maxHeight: "200px" }}
                                        />
                                    ) : (
                                        <div className="placeholder-text">No Preview Available</div>
                                    )}
                                </div>
                                <button
                                    className="nav-arrow btn btn-light rounded-1  position-absolute end-0 top-50 translate-middle-y"
                                    onClick={handleNext}
                                    disabled={PrintTemplate.length === 0}
                                >
                                    ❯
                                </button>
                            </div>
                            <div className="mt-auto text-center small text-muted mb-2">
                                Template {PrintTemplate.length > 0 ? currentIndex + 1 : 0} of {PrintTemplate.length}
                            </div>
                        </div>
                        <div className="col-md-3 form-group mb-2" style={{ display: "none" }}>
                            <div className="exp-form-floating">
                                <label id="customer">Screen Type</label>
                                <input
                                    className="exp-input-field form-control"
                                    id="customername"
                                    required
                                    value={Type}
                                    onChange={(e) => setType(e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="col-md-3 form-group d-flex justify-content-start mt-4 mb-4">
                            <button className="" onClick={handleSaveButtonClick} title="Save">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POsettings;
