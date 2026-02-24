import { useState, useEffect, useRef } from "react";
import "./NewContactModal.css";
import Select from "react-select";
import { toast } from "react-toastify";
import person from "./person.png";
import Company from "./company.png";
import Typesofcontacts from "./TypesofContacts";
import AddCompanyModal from "./company.js";
import {
  emailInputStyle,
  emailInputFocusStyle,
  companySelectStyles,
} from "./formStyles";
const config = require("../../Apiconfig");

const NewContactModal = ({
  showC,
  onCloseC,
  selectedColumnId,
  contactData,
  source,
  initialData,
  screenType ,
}) => {
  const [type, setType] = useState(screenType || "company");
  const [activeTab, setActiveTab] = useState("contacts");
  const [isFocused, setIsFocused] = useState(false);

  const mode = initialData ? "update" : "create";

  const [companyImage, setCompanyImage] = useState(Company);
  const [personImage, setPersonImage] = useState(person);

  const [selectedCompanyFile, setSelectedCompanyFile] = useState(null);
  const [selectedPersonFile, setSelectedPersonFile] = useState(null);

  const companyInputRef = useRef(null);
  const personInputRef = useRef(null);

  const handleCompanyChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyImage(URL.createObjectURL(file));
      setSelectedCompanyFile(file); 
    }
  };

  useEffect(() => {
    if (initialData) {
      console.log(initialData)
      setContactID(initialData.ContactID || "");
      setCompanyName(initialData.CompanyName || "");
      setCompanyPhone(initialData.Phone || "");
      setcompanyGSTIn(initialData.GSTIn || "");
      setCompanyEmail(initialData.Email || "");
      setCompanyWebsite(initialData.Website || "");
      setCompanyTags(initialData.Tag || "");
      setCompanyAddress1(initialData.Address1 || "");
      setCompanyAddress2(initialData.Address2 || "");
      setCompanyAddress3(initialData.Address3 || "");
      setCompanyCity(initialData.City || "");
      setCompanyCountry(initialData.Country || "");
      setCompanyState(initialData.State || "");
      setCompanyStatus(initialData.status || "");
      setCompanyZip(initialData.Zip || "");

      setSelectedCompanyState(
        initialData.State
          ? { value: initialData.State, label: initialData.State }
          : null
      );

      setSelectedCompanyCountry(
        initialData.Country
          ? { value: initialData.Country, label: initialData.Country }
          : null
      );

      setSelectedCompanyStatus(
        initialData.status
          ? { value: initialData.status, label: initialData.status }
          : null
      );

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [initialData]);

  const clearInputFields = () => {
    setCompanyName("");
    setCompanyPhone("");
    setcompanyGSTIn("");
    setCompanyEmail("");
    setCompanyWebsite("");
    setCompanyTags("");
    setCompanyAddress1("");
    setCompanyAddress2("");
    setCompanyAddress3("");
    setCompanyCity("");
    setCompanyZip("");
    setCompanyState("");
    setCompanyCountry("");
    setCompanyStatus("");
    setSelectedCompanyState(null);
    setSelectedCompanyCountry(null);
    setSelectedCompanyStatus(null);
  };

  const handleCompanyClick = () => {
    companyInputRef.current.click();
  };

  const handlePersonChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPersonImage(URL.createObjectURL(file));
      setSelectedPersonFile(file); 
    }
  };

  const handlePersonClick = () => {
    personInputRef.current.click();
  };

  // Person fields
  const [personName, setPersonName] = useState("");
  const [personPhone, setPersonPhone] = useState("");
  const [personGSTIn, setPersonGSTIn] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [personWebsite, setPersonWebsite] = useState("");
  const [personTags, setPersonTags] = useState("");
  const [personAddress1, setPersonAddress1] = useState("");
  const [personAddress2, setPersonAddress2] = useState("");
  const [personAddress3, setPersonAddress3] = useState("");
  const [personCity, setPersonCity] = useState("");
  const [selectedPersonState, setSelectedPersonState] = useState("");
  const [personState, setPersonState] = useState("");
  const [personStateDrop, setPersonStateDrop] = useState([]);
  const [personZip, setPersonZip] = useState("");
  const [personCountryDrop, setPersonCountryDrop] = useState([]);
  const [selectedPersonCountry, setSelectedPersonCountry] = useState("");
  const [personCountry, setPersonCountry] = useState("");
  const [personStatusDrop, setPersonStatusDrop] = useState([]);
  const [selectedPersonStatus, setSelectedPersonStatus] = useState("");
  const [personStatus, setPersonStatus] = useState("");
  const [personCompanyDrop, setPersonCompanyDrop] = useState([]);
  const [selectedPersonCompany, setSelectedPersonCompany] = useState("");
  const [personCompany, setPersonCompany] = useState("");

  // Company fields
  const [companyName, setCompanyName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyGSTIn, setcompanyGSTIn] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyTags, setCompanyTags] = useState("");
  const [companyAddress1, setCompanyAddress1] = useState("");
  const [companyAddress2, setCompanyAddress2] = useState("");
  const [companyAddress3, setCompanyAddress3] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [selectedCompanyState, setSelectedCompanyState] = useState("");
  const [companyState, setCompanyState] = useState("");
  const [companyStateDrop, setCompanyStateDrop] = useState([]);
  const [companyZip, setCompanyZip] = useState("");
  const [companyCountryDrop, setCompanyCountryDrop] = useState([]);
  const [selectedCompanyCountry, setSelectedCompanyCountry] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [companyStatusDrop, setCompanyStatusDrop] = useState([]);
  const [selectedCompanyStatus, setSelectedCompanyStatus] = useState("");
  const [companyStatus, setCompanyStatus] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [showCompanyModal, setshowCompanyModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalType, setModalType] = useState("Contact");
  const [ContactID, setContactID] = useState('')
  const [error, setError] = useState("");
  const [domainDrop, setDomainDrop] = useState([]);
  const [selectedDomainStatus, setSelectedDomainStatus] = useState("");
  const [domain, setDomain] = useState("");
  const [refferedBy, setRefferedBy] = useState("");

  useEffect(() => {
    if (showC) {
      console.log(source); 
    }
  }, [showC, source]);


  useEffect(() => {
    if (contactData) {
      if (Array.isArray(contactData.Contact)) {
        setContacts(contactData.Contact);
      } else {
        setContacts([]);
      }

      const info = contactData.ContactInfo?.[0];
      if (info) {
        const companyOrPersona = (info.Company_or_Persona || "").toLowerCase();
        const screenMode = (info.Screen_mode || "").toLowerCase();

        const type =
          companyOrPersona !== "company" && screenMode !== "company"
            ? "person"
            : "company";

        setType(type);

        if (type === "company") {
          console.log(type)
          setContactID(info.ContactID || "");
          setCompanyName(info.Company || "");
          setCompanyPhone(info.Phone || "");
          setcompanyGSTIn(info.GSTIN || "");
          setCompanyEmail(info.Email || "");
          setCompanyWebsite(info.Website || "");
          setCompanyTags(info.Tag || "");
          setCompanyAddress1(info.Address1 || "");
          setCompanyAddress2(info.Address2 || "");
          setCompanyAddress3(info.Address3 || "");
          setCompanyCity(info.City || "");
          setCompanyState(info.State || "");
          setCompanyZip(info.PinCode || "");
          setCompanyCountry(info.Country || "");
          setDomain(info.BussinessDomain || "");
          setRefferedBy(info.RefferedBy || "");
          setCompanyStatus(info.Status || "");

          const matchedCountry = filteredOptionCompanyCountry.find(
            (option) => option.value === info.Country
          );
          const matchedState = filteredOptionCompanyState.find(
            (option) => option.value === info.State
          );
          const matchedStatus = filteredOptionCompanyStatus.find(
            (option) => option.value === info.Status
          );
          const matchedDomain = filteredOptionDomain.find(
            (option) => option.value === info.BussinessDomain
          );
          setSelectedCompanyCountry(matchedCountry || null);
          setSelectedCompanyState(matchedState || null);
          setSelectedCompanyStatus(matchedStatus || null);
          setSelectedDomainStatus(matchedDomain || null);
        } else if (type === "person") {
          console.log(type)
          setContactID(info.ContactID || "");
          setPersonName(info.Name || "");
          setPersonPhone(info.contact_no || "");
          setPersonGSTIn(info.GSTIN || "");
          setPersonEmail(info.email || "");
          setPersonCompany(info.Company || "");
          setPersonWebsite(info.Website || "");
          setPersonTags(info.Tag || "");
          setPersonAddress1(info.Address1 || "");
          setPersonAddress2(info.Address2 || "");
          setPersonAddress3(info.Address3 || "");
          setPersonCity(info.City || "");
          setPersonState(info.State || "");
          setPersonZip(info.PinCode || "");
          setPersonCountry(info.Country || "");
          setPersonStatus(info.Status || "");
          setDomain(info.BussinessDomain || "");
          setRefferedBy(info.RefferedBy || "");

          const matchedCountry = filteredOptionPersonCountry.find(
            (option) => option.value === info.Country
          );
          const matchedState = filteredOptionPersonState.find(
            (option) => option.value === info.State
          );
          const matchedStatus = filteredOptionPersonStatus.find(
            (option) => option.value === info.Status
          );
          const matchedCompany = filteredOptionPersonCompany.find(
            (option) => option.value === info.Company
          );
          const matchedDomain = filteredOptionDomain.find(
            (option) => option.value === info.BussinessDomain
          );
          setSelectedPersonCountry(matchedCountry || null);
          setSelectedPersonState(matchedState || null);
          setSelectedPersonStatus(matchedStatus || null);
          setSelectedPersonCompany(matchedCompany || null);
          setSelectedDomainStatus(matchedDomain || null);
        }
      }
    }
  }, [contactData]);


  const handleContactClick = (contact, i) => {
    setSelectedContact({ ...contact, index: i });
    setShowNewModal(true);
  };

  const handleAddContacts = () => {
    setSelectedContact(null);

    let defaultType = "Contact";
    if (type === "company") defaultType = "Contact";
    else if (type === "person") defaultType = "Other";

    setShowNewModal(true);
    setModalType(defaultType);
  };

  // receive contact from child modal
  const handleAddContact = (newContact, index) => {
    if (newContact === null && typeof index !== "undefined") {
      setContacts((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    if (typeof index !== "undefined") {
      setContacts((prev) => prev.map((c, i) => (i === index ? newContact : c)));
    } else {
      setContacts((prev) => [...prev, newContact]);
    }
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/country`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setPersonCountryDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/state`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setPersonStateDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setPersonStatusDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/ContactInfoCompanyName`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => {
        if (Array.isArray(val)) {
          setPersonCompanyDrop(val);
        } else {
          setPersonCompanyDrop([]); // fallback
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/country`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setCompanyCountryDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/state`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setCompanyStateDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setCompanyStatusDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");
    fetch(`${config.apiBaseUrl}/getDomain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setDomainDrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionPersonState = personStateDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionPersonCountry = personCountryDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionPersonStatus = personStatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionPersonCompany = (personCompanyDrop || []).map(
    (option) => ({
      value: option.CompanyName,
      label: option.CompanyName,
    })
  );

  const filteredOptionCompanyState = companyStateDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionDomain = domainDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionCompanyCountry = companyCountryDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionCompanyStatus = companyStatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangePersonState = (selectedPersonState) => {
    setSelectedPersonState(selectedPersonState);
    setPersonState(selectedPersonState ? selectedPersonState.value : "");
  };

  const handleChangePersonCountry = (selectedPersonCountry) => {
    setSelectedPersonCountry(selectedPersonCountry);
    setPersonCountry(selectedPersonCountry ? selectedPersonCountry.value : "");
  };

  const handleChangePersonStatus = (selectedPersonStatus) => {
    setSelectedPersonStatus(selectedPersonStatus);
    setPersonStatus(selectedPersonStatus ? selectedPersonStatus.value : "");
  };

  const handleChangePersonCompany = (selectedPersonCompany) => {
    setSelectedPersonCompany(selectedPersonCompany);
    setPersonCompany(selectedPersonCompany ? selectedPersonCompany.value : "");
  };

  const handleChangeCompanyState = (selectedCompanyState) => {
    setSelectedCompanyState(selectedCompanyState);
    setCompanyState(selectedCompanyState ? selectedCompanyState.value : "");
  };

  const handleChangeDomain = (selectedDomainStatus) => {
    setSelectedDomainStatus(selectedDomainStatus);

    if (selectedDomainStatus && selectedDomainStatus.length > 0) {
      const selectedValues = selectedDomainStatus.map(option => option.value);
      setDomain(selectedValues.join(","));
    } else {
      setDomain("");
    }
  };

  const handleChangeCompanyCountry = (selectedCompanyCountry) => {
    setSelectedCompanyCountry(selectedCompanyCountry);
    setCompanyCountry(
      selectedCompanyCountry ? selectedCompanyCountry.value : ""
    );
  };

  const handleChangeCompanyStatus = (selectedCompanyStatus) => {
    setSelectedCompanyStatus(selectedCompanyStatus);
    setCompanyStatus(selectedCompanyStatus ? selectedCompanyStatus.value : "");
  };

  if (!showC) return null;

//   const handleDeleteCard = async (indexToRemove) => {
//   try {
//     const contactToDelete = contacts[indexToRemove];

//     const company_code = sessionStorage.getItem("selectedCompanyCode");
//     const Created_by = sessionStorage.getItem("username");

//     const response = await fetch(
//       `${config.apiBaseUrl}/deleteCRMContacts`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           company_code,
//           contact_no: contactToDelete.contact_no,
//           email: contactToDelete.email,
//           Name: contactToDelete.Name,
//           ContactID: contactToDelete.Contact_ID,
//           Contact_info_id: contactToDelete.Contact_info_id,
//           Created_by
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errData = await response.json();
//       throw new Error(errData.message || "Delete failed");
//     }

//     // UI update after successful delete
//     setContacts((prev) =>
//       prev.filter((_, index) => index !== indexToRemove)
//     );

//     toast.success("Contact deleted successfully");

//   } catch (error) {
//     console.error(error);
//     toast.error(error.message || "Failed to delete contact");
//   }
// };

  const handleDeleteCard = async (indexToRemove) => {
    try {
      const contactToDelete = contacts[indexToRemove];
      const company_code = sessionStorage.getItem("selectedCompanyCode");
      const Contact_ID = contactToDelete?.Contact_ID || null;
      // Call backend API using fetch
      const response = await fetch(`${config.apiBaseUrl}/deleteCRMContacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code,
          Contact_ID,
          Contact_info_id: ContactID,
        }),
      });
      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Failed to delete contact from server");
      }
      // Remove from UI after successful delete
      setContacts((prevContacts) =>
        prevContacts.filter((_, index) => index !== indexToRemove)
      );
      console.log("Contact deleted successfully");
    } catch (error) {
      toast.error("Error deleting contact:", error);
    }
  };

  const validateForm = () => {
  if (type === "person") {
    if (
      !personName ||
      !personPhone ||
      !personEmail ||
      !personCompany ||
      !personCity ||
      !personCountry
    ) {
      toast.warning("Please fill all required fields before saving!");
      return false;
    }
  }

  if (type === "company") {
    console.log(companyName,companyPhone,companyEmail,companyCity,selectedCompanyCountry)
    if (
      !companyName ||
      !companyPhone ||
      !companyEmail ||
      !companyCity ||
      !companyCountry
    ) {
      toast.warning("Please fill all required fields before saving!");
      return false;
    }
  }

  return true;
};

const clearForm = () => {
  if (type === "person") {
    setPersonCompany("");
    setPersonPhone("");
    setPersonGSTIn("");
    setPersonEmail("");
    setPersonWebsite("");
    setPersonTags("");
    setPersonAddress1("");
    setPersonAddress2("");
    setPersonAddress3("");
    setPersonCity("");
    setPersonZip("");
    setSelectedPersonState("");
    setSelectedPersonCountry("");
    setSelectedPersonStatus("");
    setPersonName("");
    setSelectedPersonFile(null);
  } else {
    setCompanyName("");
    setCompanyPhone("");
    setcompanyGSTIn("");
    setCompanyEmail("");
    setCompanyWebsite("");
    setCompanyTags("");
    setCompanyAddress1("");
    setCompanyAddress2("");
    setCompanyAddress3("");
    setCompanyCity("");
    setCompanyZip("");
    setSelectedCompanyState("");
    setSelectedCompanyCountry("");
    setSelectedCompanyStatus("");
    setSelectedCompanyFile(null);
  }

  setSelectedDomainStatus("");
  setRefferedBy("");
  // setSelectedColumnId("new");
  setContacts([]);
};

  const handleSave = async () => {

    if (!validateForm()) return;

    try {
      const formData = new FormData();

      if (type === "person") {
        formData.append("Company_or_Persona", "Person");
        formData.append("ContactID", ContactID);
        formData.append("CompanyName", personCompany);
        formData.append("Phone", personPhone);
        formData.append("GSTIn", personGSTIn);
        formData.append("Email", personEmail);
        formData.append("Website", personWebsite);
        formData.append("Tag", personTags);
        formData.append("Address1", personAddress1);
        formData.append("Address2", personAddress2);
        formData.append("Address3", personAddress3);
        formData.append("City", personCity);
        formData.append("Zip", personZip);
        formData.append("State", personState);
        formData.append("Country", personCountry);
        formData.append("status", personStatus);
        formData.append("Person_name", personName);
        formData.append("BussinessDomain", domain);
        formData.append("RefferedBy", refferedBy);
        formData.append("Stage", selectedColumnId || "new");
        if (selectedPersonFile) {
          formData.append("Image", selectedPersonFile);
        }
      } else if (type === "company") {
        formData.append("Company_or_Persona", "Company");
        formData.append("ContactID", ContactID);
        formData.append("CompanyName", companyName);
        formData.append("Phone", companyPhone);
        formData.append("GSTIn", companyGSTIn);
        formData.append("Email", companyEmail);
        formData.append("Website", companyWebsite);
        formData.append("Tag", companyTags);
        formData.append("Address1", companyAddress1);
        formData.append("Address2", companyAddress2);
        formData.append("Address3", companyAddress3);
        formData.append("City", companyCity);
        formData.append("Zip", companyZip);
        formData.append("State", companyState);
        formData.append("Country", companyCountry);
        formData.append("status", companyStatus);
        formData.append("BussinessDomain", domain);
        formData.append("RefferedBy", refferedBy);
        formData.append("Stage", selectedColumnId || "new");
        if (selectedCompanyFile) {
          formData.append("Image", selectedCompanyFile);
        }
      }

      formData.append(
        "company_code",
        sessionStorage.getItem("selectedCompanyCode")
      );
      formData.append("Created_by", sessionStorage.getItem("selectedUserCode"));

      const response = await fetch(`${config.apiBaseUrl}/CRM_ContactInfoInsert`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const searchData = await response.json();
        const [{ CompanyID }] = searchData;
        toast.success(`${type} data saved successfully!`);

        if (contacts.length > 0) {
          for (const contact of contacts) {
            const contactFormData = new FormData();
            contactFormData.append("Contact_ID", contact.Contact_ID);
            contactFormData.append("Name", contact.Name);
            contactFormData.append("contact_no", contact.contact_no);
            contactFormData.append("email", contact.email);
            contactFormData.append("Address", contact.Address);
            contactFormData.append("Country", contact.Country);
            contactFormData.append("Aadhar", contact.Aadhar || "");
            contactFormData.append("Pan", contact.Pan || "");
            contactFormData.append("Notes", contact.Notes || "");
            contactFormData.append("Contact_info_id", CompanyID);
            contactFormData.append("Screen_mode", contact.Screen_mode);
            contactFormData.append("created_by", contact.created_by);
            contactFormData.append("type_of_contact", type);
            contactFormData.append("status", contact.Status);
            contactFormData.append(
              "contact_name",
              type === "person" ? personName : ""
            );
            contactFormData.append(
              "company_name",
              type === "company" ? companyName : personCompany
            );
            contactFormData.append(
              "company_code",
              sessionStorage.getItem("selectedCompanyCode")
            );

            if (contact.Image) {
              contactFormData.append("Image", contact.Image);
            }

            try {
              const contactResponse = await fetch(
                `${config.apiBaseUrl}/addCRMContacts`,
                {
                  method: "POST",
                  body: contactFormData,
                }
              );

              if (!contactResponse.ok) {
                let errorMessage = "Error saving contact";
                try {
                  const errorResponse = await contactResponse.json();
                  errorMessage = errorResponse.message || errorMessage;
                } catch {
                  errorMessage = await contactResponse.text();
                }
                toast.warning(errorMessage);
              }
            } catch (err) {
              toast.error("Error saving contact: " + err.message);
            }
          }
        }
         clearForm();
      } else {
        let errorMessage = "Something went wrong";
        try {
          const errorResponse = await response.json();
          errorMessage = errorResponse.message || errorMessage;
        } catch {
          errorMessage = await response.text();
        }
        toast.warning(errorMessage);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data: " + error.message);
    }
  };

  // const handleUpdate = async () => {
  //   try {
  //     const modified_by = sessionStorage.getItem("selectedUserCode");
  //     const company_code = sessionStorage.getItem("selectedCompanyCode");

  //     // 🔹 Create form data for main contact info
  //     const formData = new FormData();

  //     if (type === "person") {
  //       formData.append("Company_or_Persona", "Person");
  //       formData.append("CompanyName", personCompany || "");
  //       formData.append("Phone", personPhone || "");
  //       formData.append("GSTIn", personGSTIn || "");
  //       formData.append("Email", personEmail || "");
  //       formData.append("Website", personWebsite || "");
  //       formData.append("Tag", personTags || "");
  //       formData.append("Address1", personAddress1 || "");
  //       formData.append("Address2", personAddress2 || "");
  //       formData.append("Address3", personAddress3 || "");
  //       formData.append("City", personCity || "");
  //       formData.append("Zip", personZip || "");
  //       formData.append("State", personState || "");
  //       formData.append("Country", personCountry || "");
  //       formData.append("status", personStatus || "Active");
  //       formData.append("Person_name", personName || "");
  //       formData.append("BussinessDomain", domain || "");
  //       formData.append("RefferedBy", refferedBy || "");

  //       if (selectedPersonFile) {
  //         formData.append("Image", selectedPersonFile);
  //       }
  //     } else if (type === "company") {
  //       formData.append("Company_or_Persona", "Company");
  //       formData.append("CompanyName", companyName || "");
  //       formData.append("Phone", companyPhone || "");
  //       formData.append("GSTIn", companyGSTIn || "");
  //       formData.append("Email", companyEmail || "");
  //       formData.append("Website", companyWebsite || "");
  //       formData.append("Tag", companyTags || "");
  //       formData.append("Address1", companyAddress1 || "");
  //       formData.append("Address2", companyAddress2 || "");
  //       formData.append("Address3", companyAddress3 || "");
  //       formData.append("City", companyCity || "");
  //       formData.append("Zip", companyZip || "");
  //       formData.append("State", companyState || "");
  //       formData.append("Country", companyCountry || "");
  //       formData.append("status", companyStatus || "Active");
  //       formData.append("BussinessDomain", domain || "");
  //       formData.append("RefferedBy", refferedBy || "");
  //       formData.append("ContactID", ContactID|| ""); // MUST
  //       formData.append("company_code", company_code|| ""); 
  //       formData.append("modified_by", modified_by|| ""); // MUST

  //       if (selectedCompanyFile) {
  //         formData.append("Image", selectedCompanyFile);
  //       }
  //     }

  //     // 🔹 Update main contact info
  //     const response = await fetch(`${config.apiBaseUrl}/CRM_ContactInfoUpdate`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       toast.warning(`Failed to update ${type}: ${errorText}`);
  //       return;
  //     }

  //     toast.success(`${type} updated successfully!`);

  //     // 🔹 Update linked contacts (if any)
  //     if (contacts && contacts.length > 0) {
  //       for (const contact of contacts) {
  //         const contactFormData = new FormData();
  //         contactFormData.append("keyfield", contact.keyfield || "");
  //         contactFormData.append("Name", contact.Name || "");
  //         contactFormData.append("contact_no", contact.contact_no || "");
  //         contactFormData.append("email", contact.email || "");
  //         contactFormData.append("Address", contact.Address || "");
  //         contactFormData.append("Country", contact.Country || "");
  //         contactFormData.append("Aadhar", contact.Aadhar || "");
  //         contactFormData.append("Pan", contact.Pan || "");
  //         contactFormData.append("status", contact.status || "Active");
  //         contactFormData.append("modified_by", modified_by || "");
  //         contactFormData.append("company_code", company_code || "");
  //         contactFormData.append(
  //           "company_name",
  //           type === "company" ? companyName : personCompany
  //         );
  //         contactFormData.append(
  //           "contact_name",
  //           type === "person" ? personName : ""
  //         );
  //         contactFormData.append("type_of_contact", type);

  //         // Optional image if contact has one
  //         if (contact.Image) {
  //           contactFormData.append("Image", contact.Image);
  //         }

  //         const contactResponse = await fetch(
  //           `${config.apiBaseUrl}/updateCRMContacts`,
  //           {
  //             method: "POST",
  //             body: contactFormData,
  //           }
  //         );

  //         if (!contactResponse.ok) {
  //           const errTxt = await contactResponse.text();
  //           toast.warning(`Contact update failed: ${errTxt}`);
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error updating data:", err);
  //     toast.error("Error updating data: " + err.message);
  //   }
  // };

  const handleUpdate = async () => {
    try {
      const modified_by = sessionStorage.getItem("selectedUserCode");
      const company_code = sessionStorage.getItem("selectedCompanyCode");

      // 🔹 Create form data for main contact info
      const formData = new FormData();

      if (type === "person") {
        formData.append("Company_or_Persona", "Person");
        formData.append("CompanyName", personCompany || "");
        formData.append("Phone", personPhone || "");
        formData.append("GSTIn", personGSTIn || "");
        formData.append("Email", personEmail || "");
        formData.append("Website", personWebsite || "");
        formData.append("Tag", personTags || "");
        formData.append("Address1", personAddress1 || "");
        formData.append("Address2", personAddress2 || "");
        formData.append("Address3", personAddress3 || "");
        formData.append("City", personCity || "");
        formData.append("Zip", personZip || "");
        formData.append("State", personState || "");
        formData.append("Country", personCountry || "");
        formData.append("status", personStatus || "Active");
        formData.append("Person_name", personName || "");
        formData.append("BussinessDomain", domain || "");
        formData.append("RefferedBy", refferedBy || "");

        if (selectedPersonFile) {
          formData.append("Image", selectedPersonFile);
        }
      } else if (type === "company") {
        formData.append("Company_or_Persona", "Company");
        formData.append("CompanyName", companyName || "");
        formData.append("Phone", companyPhone || "");
        formData.append("GSTIn", companyGSTIn || "");
        formData.append("Email", companyEmail || "");
        formData.append("Website", companyWebsite || "");
        formData.append("Tag", companyTags || "");
        formData.append("Address1", companyAddress1 || "");
        formData.append("Address2", companyAddress2 || "");
        formData.append("Address3", companyAddress3 || "");
        formData.append("City", companyCity || "");
        formData.append("Zip", companyZip || "");
        formData.append("State", companyState || "");
        formData.append("Country", companyCountry || "");
        formData.append("status", companyStatus || "Active");
        formData.append("BussinessDomain", domain || "");
        formData.append("RefferedBy", refferedBy || "");

        if (selectedCompanyFile) {
          formData.append("Image", selectedCompanyFile);
        }
      }

      // 🔹 Update main contact info
      const response = await fetch(`${config.apiBaseUrl}/CRM_ContactInfoUpdate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.warning(`Failed to update ${type}: ${errorText}`);
        return;
      }

      toast.success(`${type} updated successfully!`);

      // 🔹 Update linked contacts (if any)
      if (contacts && contacts.length > 0) {
        for (const contact of contacts) {
          const contactFormData = new FormData();
          contactFormData.append("keyfield", contact.keyfield || "");
          contactFormData.append("Name", contact.Name || "");
          contactFormData.append("contact_no", contact.contact_no || "");
          contactFormData.append("email", contact.email || "");
          contactFormData.append("Address", contact.Address || "");
          contactFormData.append("Country", contact.Country || "");
          contactFormData.append("Aadhar", contact.Aadhar || "");
          contactFormData.append("Pan", contact.Pan || "");
          contactFormData.append("status", contact.status || "Active");
          contactFormData.append("modified_by", modified_by || "");
          contactFormData.append("company_code", company_code || "");
          contactFormData.append(
            "company_name",
            type === "company" ? companyName : personCompany
          );
          contactFormData.append(
            "contact_name",
            type === "person" ? personName : ""
          );
          contactFormData.append("type_of_contact", type);

          // Optional image if contact has one
          if (contact.Image) {
            contactFormData.append("Image", contact.Image);
          }

          const contactResponse = await fetch(
            `${config.apiBaseUrl}/updateCRMContacts`,
            {
              method: "POST",
              body: contactFormData,
            }
          );

          if (!contactResponse.ok) {
            const errTxt = await contactResponse.text();
            toast.warning(`Contact update failed: ${errTxt}`);
          }
        }
      }
    } catch (err) {
      console.error("Error updating data:", err);
      toast.error("Error updating data: " + err.message);
    }
  };

  const handleDelete = async (keyfield) => {
  if (!keyfield) {
    toast.warning("Invalid contact id");
    return;
  }

  if (!window.confirm("Are you sure you want to delete this contact?")) return;

  try {
    const response = await fetch(
      `${config.apiBaseUrl}/CRM_ContactInfoDelete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyfield: keyfield,
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      toast.success(result.message || "Deleted successfully");

    } else {
      let errorMessage = "Delete failed";
      try {
        const errorResponse = await response.json();
        errorMessage = errorResponse.message || errorMessage;
      } catch {
        errorMessage = await response.text();
      }
      toast.warning(errorMessage);
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Error deleting data: " + error.message);
  }
};



  return (
    <div
      className="modal d-block mt-5 popupadj popup"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        width: "100%",
        marginLeft: "10px",
        minWidth: "530px",
      }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-2">
          <div className="modal-header">
            <div className="d-flex justify-content-between w-100">
              <h5 className="modal-title">Add Company</h5>
              <button className="btn btn-danger" onClick={onCloseC}>
                <i className="bi bi-x-lg" title="Close"></i>
              </button>
            </div>
          </div>
          <div className="modal-body">
            <div className="mb-3 d-flex gap-3">
              <label>
                <input
                  type="radio"
                  value="person"
                  checked={type === "person"}
                  onChange={() => setType("person")}
                />{" "}
                Person
              </label>
              <label>
                <input
                  type="radio"
                  value="company"
                  checked={type === "company"}
                  onChange={() => setType("company")}
                />{" "}
                Company
              </label>
            </div>
            <form>
              {type === "person" ? (
                <>
                  <div className="row mb-1">
                    <div className="col-md-3 text-start">
                      <img
                        src={personImage}
                        alt="Preview"
                        className="img-thumbnail mb-1"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "10%",
                          cursor: "pointer",
                        }}
                        onClick={handlePersonClick}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePersonChange}
                        ref={personInputRef}
                        style={{ display: "none" }}
                      />
                    </div>
                    <div className="col-md-9">
                      <div className="row mb-2">
                        <div className="col-md-6">
                          <label className="form-label d-flex justify-content-start">
                            Full Name
                          </label>

                          {/* <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Full Name"
                           
                          /> */}
                          <input
                            type="text"
                            placeholder="Enter Full Name"
                            style={{
                              ...emailInputStyle,
                              ...(isFocused ? emailInputFocusStyle : {}),
                              width: "280px",
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            value={personName}
                            onChange={(e) => setPersonName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label d-flex justify-content-start">
                            Phone No
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Phone No"
                            style={{
                              ...emailInputStyle,
                              ...(isFocused ? emailInputFocusStyle : {}),
                              width: "280px",
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            value={personPhone}
                            onChange={(e) => setPersonPhone(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-6">
                          <label className="form-label d-flex justify-content-start">
                            GSTIN
                          </label>
                          <input
                            type="text"
                            placeholder="Enter GSTIN"
                            style={{
                              ...emailInputStyle,
                              ...(isFocused ? emailInputFocusStyle : {}),
                              width: "280px",
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            value={personGSTIn}
                            onChange={(e) => setPersonGSTIn(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label d-flex justify-content-start">
                            Email
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Email"
                            style={{
                              ...emailInputStyle,
                              ...(isFocused ? emailInputFocusStyle : {}),
                              width: "280px",
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            value={personEmail}
                            onChange={(e) => setPersonEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Company Name
                      </label>
                      <div className="input-group">
                        <div className="form-control p-0 border-0">
                          <Select
                            className="text-start"
                            placeholder="Select Company"
                            value={selectedPersonCompany}
                            onChange={handleChangePersonCompany}
                            options={filteredOptionPersonCompany}
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                border: "none",
                                borderBottom: state.isFocused
                                  ? "2px solid #17a2b8"
                                  : "2px solid #ccc",
                                boxShadow: "none",
                                borderRadius: "0",
                                backgroundColor: "transparent",
                                fontSize: "14px",
                                fontWeight: 500,
                                width: "350px",
                              }),
                              indicatorSeparator: () => ({ display: "none" }),
                              dropdownIndicator: (base) => ({
                                ...base,
                                color: "#666",
                                ":hover": { color: "#17a2b8" },
                              }),
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setshowCompanyModal(true)}
                        >
                          <i className="bi bi-plus-lg"></i>
                        </button>
                      </div>
                      <AddCompanyModal
                        showCompany={showCompanyModal}
                        onCompanyClose={() => setshowCompanyModal(false)}
                        onSaveCompany={setPersonCompany}
                        selectedColumnId={selectedColumnId}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start mt-1">
                        Website
                      </label>

                      <input
                        type="text"
                        placeholder="Enter Website"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused ? emailInputFocusStyle : {}),
                          width: "360px",
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={personWebsite}
                        onChange={(e) => setPersonWebsite(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6 mt-2">
                      <label className="form-label d-flex justify-content-start">
                        Tags
                      </label>

                      <input
                        type="text"
                        placeholder="Enter Tags"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused ? emailInputFocusStyle : {}),
                          width: "350px",
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={personTags}
                        onChange={(e) => setPersonTags(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start mt-2">
                        Address 1
                      </label>

                      <input
                        type="text"
                        placeholder="Enter Address 1"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused ? emailInputFocusStyle : {}),
                          width: "350px",
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={personAddress1}
                        onChange={(e) => setPersonAddress1(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Address 2
                      </label>

                      <input
                        type="text"
                        placeholder="Enter Address 2"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused ? emailInputFocusStyle : {}),
                          width: "350px",
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={personAddress2}
                        onChange={(e) => setPersonAddress2(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Address 3
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Address 3"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused ? emailInputFocusStyle : {}),
                          width: "350px",
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={personAddress3}
                        onChange={(e) => setPersonAddress3(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Enter City"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused ? emailInputFocusStyle : {}),
                          width: "350px",
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={personCity}
                        onChange={(e) => setPersonCity(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        State
                      </label>
                      <Select
                        placeholder="Select State"
                        className="text-start"
                        value={selectedPersonState}
                        onChange={handleChangePersonState}
                        options={filteredOptionPersonState}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            border: "none", // remove all borders
                            borderBottom: state.isFocused
                              ? "2px solid #17a2b8" // bottom border on focus
                              : "2px solid #ccc", // normal bottom border
                            boxShadow: "none", // remove react-select shadow
                            borderRadius: "0", // no rounded corners
                            backgroundColor: "transparent",
                            fontSize: "14px",
                            fontWeight: 500,
                            width: "350px",
                          }),
                          indicatorSeparator: () => ({ display: "none" }), // remove the vertical line
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: "#666", // dropdown arrow color
                            ":hover": { color: "#17a2b8" },
                          }),
                        }}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Zip Code"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused ? emailInputFocusStyle : {}),
                          width: "350px",
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={personZip}
                        onChange={(e) => setPersonZip(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Country
                      </label>
                      <Select
                        className="text-start"
                        placeholder="Select Country"
                        value={selectedPersonCountry}
                        onChange={handleChangePersonCountry}
                        options={filteredOptionPersonCountry}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            border: "none", // remove all borders
                            borderBottom: state.isFocused
                              ? "2px solid #17a2b8" // bottom border on focus
                              : "2px solid #ccc", // normal bottom border
                            boxShadow: "none", // remove react-select shadow
                            borderRadius: "0", // no rounded corners
                            backgroundColor: "transparent",
                            fontSize: "14px",
                            fontWeight: 500,
                            width: "350px",
                          }),
                          indicatorSeparator: () => ({ display: "none" }), // remove the vertical line
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: "#666", // dropdown arrow color
                            ":hover": { color: "#17a2b8" },
                          }),
                        }}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Status
                      </label>
                      <Select
                        className="text-start"
                        placeholder="Select Status"
                        value={selectedPersonStatus}
                        onChange={handleChangePersonStatus}
                        options={filteredOptionPersonStatus}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            border: "none", // remove all borders
                            borderBottom: state.isFocused
                              ? "2px solid #17a2b8" // bottom border on focus
                              : "2px solid #ccc", // normal bottom border
                            boxShadow: "none", // remove react-select shadow
                            borderRadius: "0", // no rounded corners
                            backgroundColor: "transparent",
                            fontSize: "14px",
                            fontWeight: 500,
                            width: "350px",
                          }),
                          indicatorSeparator: () => ({ display: "none" }), // remove the vertical line
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: "#666", // dropdown arrow color
                            ":hover": { color: "#17a2b8" },
                          }),
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row mb-1">
                    <div className="col-md-3 text-start">
                      <img
                        src={companyImage}
                        alt="Preview"
                        className="img-thumbnail mb-1"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "10%",
                          cursor: "pointer",
                        }}
                        onClick={handleCompanyClick}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCompanyChange}
                        ref={companyInputRef}
                        style={{ display: "none" }}
                      />
                    </div>
                    <div className="col-md-9">
                      <div className="row mb-2">
                        <div className="col-md-6">
                          <label className="form-label d-flex justify-content-start">
                            Company Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Company Name"
                            style={{
                              ...emailInputStyle,
                              ...(isFocused === "companyName"
                                ? emailInputFocusStyle
                                : {}),
                              width: "280px",
                            }}
                            onFocus={() => setIsFocused("companyName")}
                            onBlur={() => setIsFocused("")}
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label d-flex justify-content-start">
                            Phone No
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Phone No"
                            style={{
                              ...emailInputStyle,
                              ...(isFocused === "companyPhone"
                                ? emailInputFocusStyle
                                : {}),
                              width: "280px",
                            }}
                            onFocus={() => setIsFocused("companyPhone")}
                            onBlur={() => setIsFocused("")}
                            value={companyPhone}
                            onChange={(e) => setCompanyPhone(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-6">
                          <label className="form-label d-flex justify-content-start">
                            GSTIN
                          </label>
                          <input
                            type="text"
                            placeholder="Enter GSTIN"
                            style={{
                              ...emailInputStyle,
                              ...(isFocused === "companyGSTIn"
                                ? emailInputFocusStyle
                                : {}),
                              width: "280px",
                            }}
                            onFocus={() => setIsFocused("companyGSTIn")}
                            onBlur={() => setIsFocused("")}
                            value={companyGSTIn}
                            onChange={(e) => setcompanyGSTIn(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label d-flex justify-content-start">
                            Email
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Email"
                            style={{
                              ...emailInputStyle,
                              ...(isFocused === "companyEmail"
                                ? emailInputFocusStyle
                                : {}),
                              width: "280px",
                            }}
                            onFocus={() => setIsFocused("companyEmail")}
                            onBlur={() => setIsFocused("")}
                            value={companyEmail}
                            onChange={(e) => setCompanyEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Website
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Website"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused === "companyWebsite"
                            ? emailInputFocusStyle
                            : {}),
                          width: "330px",
                        }}
                        onFocus={() => setIsFocused("companyWebsite")}
                        onBlur={() => setIsFocused("")}
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Tags
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Tags"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused === "companyTags"
                            ? emailInputFocusStyle
                            : {}),
                          width: "330px",
                        }}
                        onFocus={() => setIsFocused("companyTags")}
                        onBlur={() => setIsFocused("")}
                        value={companyTags}
                        onChange={(e) => setCompanyTags(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Address 1
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Address 1"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused === "companyAddress1"
                            ? emailInputFocusStyle
                            : {}),
                          width: "330px",
                        }}
                        onFocus={() => setIsFocused("companyAddress1")}
                        onBlur={() => setIsFocused("")}
                        value={companyAddress1}
                        onChange={(e) => setCompanyAddress1(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Address 2
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Address 2"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused === "companyAddress2"
                            ? emailInputFocusStyle
                            : {}),
                          width: "330px",
                        }}
                        onFocus={() => setIsFocused("companyAddress2")}
                        onBlur={() => setIsFocused("")}
                        value={companyAddress2}
                        onChange={(e) => setCompanyAddress2(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Address 3
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Address 3"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused === "companyAddress3"
                            ? emailInputFocusStyle
                            : {}),
                          width: "330px",
                        }}
                        onFocus={() => setIsFocused("companyAddress3")}
                        onBlur={() => setIsFocused("")}
                        value={companyAddress3}
                        onChange={(e) => setCompanyAddress3(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        City{" "}
                      </label>
                      <input
                        type="text"
                        placeholder="Enter City"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused === "companyCity"
                            ? emailInputFocusStyle
                            : {}),
                          width: "330px",
                        }}
                        onFocus={() => setIsFocused("companyCity")}
                        onBlur={() => setIsFocused("")}
                        value={companyCity}
                        onChange={(e) => setCompanyCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        State
                      </label>
                      <Select
                        placeholder="Select State"
                        value={selectedCompanyState}
                        onChange={handleChangeCompanyState}
                        options={filteredOptionCompanyState}
                        styles={companySelectStyles}
                        style={{ width: "280px" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Zip Code"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused === "companyZip"
                            ? emailInputFocusStyle
                            : {}),
                          width: "330px",
                        }}
                        onFocus={() => setIsFocused("companyZip")}
                        onBlur={() => setIsFocused("")}
                        value={companyZip}
                        onChange={(e) => setCompanyZip(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className= {`"form-label d-flex justify-content-start" ${error && !selectedCompanyCountry ? 'text-danger' : ''}`}>
                        Country<span className="text-danger">*</span>
                      </label>

                      <Select
                        placeholder="Select Country"
                        value={selectedCompanyCountry}
                        onChange={handleChangeCompanyCountry}
                        options={filteredOptionCompanyCountry}
                        styles={companySelectStyles}
                      />
                    </div>

                    <div className="col-md-6">
                      <label class="exp-form-labels" className={`"form-label d-flex justify-content-start" ${error && !selectedCompanyStatus ? 'text-danger' : ''}`}>
                        Status<span className="text-danger">*</span>
                      </label>
                      <Select
                        placeholder="Select Status"
                        value={selectedCompanyStatus}
                        onChange={handleChangeCompanyStatus}
                        options={filteredOptionCompanyStatus}
                        styles={companySelectStyles}
                      />
                    </div>
                  </div>
                </>
              )}
            </form>
            <div
              style={{    
                display: "flex",
                marginBottom: "1rem",
                borderBottom: "1px solid #ddd",
              }}
            >
              <button
                onClick={() => setActiveTab("contacts")}
                style={{
                  background: "none",
                  border: "none",
                  padding: "8px 16px",
                  marginRight: "0px",
                  fontSize: "14px",
                  borderRadius: "0",
                  cursor: "pointer",
                  color: activeTab === "contacts" ? "#000" : "#444",
                  fontWeight: activeTab === "contacts" ? "700" : "500",
                  borderTop:
                    activeTab === "contacts"
                      ? "2px solid #5c2c6d"
                      : "0px solid transparent",
                  borderBottom:
                    activeTab === "contacts"
                      ? "2px solid #ffffffff"
                      : "2px solid transparent",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Contacts
              </button>

              <button
                onClick={() => setActiveTab("sales")}
                style={{
                  background: "none",
                  border: "none",
                  padding: "8px 16px",
                  marginRight: "0px",
                  fontSize: "14px",
                  borderRadius: "0",
                  cursor: "pointer",
                  color: activeTab === "sales" ? "#000" : "#444",
                  fontWeight: activeTab === "sales" ? "700" : "500",
                  borderTop:
                    activeTab === "sales"
                      ? "2px solid #5c2c6d"
                      : "2px solid transparent",
                  borderBottom:
                    activeTab === "sales"
                      ? "2px solid #ffffffff"
                      : "2px solid transparent",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Sales Information
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                style={{
                  background: "none",
                  border: "none",
                  padding: "8px 16px",
                  marginRight: "0px",
                  fontSize: "14px",
                  borderRadius: "0",
                  cursor: "pointer",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  color: activeTab === "notes" ? "#000" : "#444",
                  fontWeight: activeTab === "notes" ? "700" : "500",
                  borderTop:
                    activeTab === "notes"
                      ? "2px solid #5c2c6d"
                      : "2px solid transparent",
                  borderBottom:
                    activeTab === "notes"
                      ? "2px solid #ffffffff"
                      : "2px solid transparent",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Notes
              </button>
            </div>
            <div className="tab-content p-3 rounded">
              {activeTab === "contacts" && (
                <div>
                  <div className="row row-cols-1 row-cols-md-2 g-3">
                    {(contacts || []).map((c, index) => (
                      <div
                        key={index}
                        className="col"
                        onClick={() => handleContactClick(c, index)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card h-100 p-1 rounded-0 position-relative shadow-sm">
                          <i
                            className="bi bi-x-circle-fill text-danger position-absolute"
                            style={{
                              top: "5px",
                              right: "5px",
                              cursor: "pointer",
                              fontSize: "18px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation(); // ✅ prevent any parent onClick (like add popup)
                              handleDeleteCard(index);
                            }}
                          ></i>

                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <img
                                src={c?.ImageUrl || Company}
                                alt="contact icon"
                                className="rounded-0 ms-1"
                                style={{ width: "60px", height: "auto" }}
                              />
                            </div>
                            <div>
                              {c?.Name && (
                                <li
                                  className="card-text ms-2 mb-1 text-start"
                                  style={{ fontSize: "14px" }}
                                >
                                  <i className="bi bi-person-fill me-2"></i>
                                  {c.Name}
                                </li>
                              )}
                              {c?.email && (
                                <li
                                  className="card-text ms-2 mb-1 text-start"
                                  style={{ fontSize: "14px" }}
                                >
                                  <i className="bi bi-envelope-fill me-2"></i>
                                  {c.email}
                                </li>
                              )}
                              {c?.contact_no && (
                                <li
                                  className="card-text ms-2 mb-1 text-start"
                                  style={{ fontSize: "14px" }}
                                >
                                  <i className="bi bi-telephone-fill me-2"></i>
                                  {c.contact_no}
                                </li>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="col">
                      <div
                        className="card h-100 p-4 rounded-0 d-flex justify-content-center align-items-center"
                        onClick={handleAddContacts}
                      >
                        <span className="text-success">Add Contact</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "sales" && (
                <div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Bussiness Domain
                      </label>
                      <Select
                        placeholder="Select State"
                        value={selectedDomainStatus}
                        onChange={handleChangeDomain}
                        options={filteredOptionDomain}
                        styles={companySelectStyles}
                        style={{ width: "280px" }}
                        isMulti
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label d-flex justify-content-start">
                        Reffered By
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Reffered By"
                        style={{
                          ...emailInputStyle,
                          ...(isFocused === "companyZip"
                            ? emailInputFocusStyle
                            : {}),
                          width: "330px",
                        }}
                        onFocus={() => setIsFocused("companyZip")}
                        onBlur={() => setIsFocused("")}
                        value={refferedBy}
                        onChange={(e) => setRefferedBy(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "notes" && (
                <div>
                  <textarea
                    className="form-control mb-2"
                    rows="3"
                    placeholder="Write your notes here..."
                  />

                </div>
              )}
            </div>
          </div>

          <div className="modal-footer d-flex justify-content-end">
            <div className="d-flex gap-2">
              {mode === "create" ? (
                <button
                  className="btn btn-success text-center"
                  onClick={handleSave}
                  style={{ color: "white" }}
                  title="Save"
                >
                  <i className="bi bi-save me-2"></i> Save
                </button>
              ) : (
                <button
                  className="btn btn-success text-center"
                  onClick={handleSave}
                  style={{ color: "white" }}
                  title="Update"
                >
                  <i className="bi bi-pencil-square me-2"></i> Update
                </button>
              )}

              <button
                type="button"
                className="btn btn-danger px-4"
                onClick={onCloseC}
                title="Discard"
              >
                Discard
              </button>
            </div>
          </div>

          {showNewModal && (
            <Typesofcontacts
              onClose={() => setShowNewModal(false)}
              onSave={handleAddContact}
              initialData={selectedContact}
              initialType={modalType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewContactModal;
