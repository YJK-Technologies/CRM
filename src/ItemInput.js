import React, { useState, useEffect, useRef} from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { ToastContainer,toast } from 'react-toastify';
import Select from 'react-select'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';
import LoadingScreen from './Loading';

const config = require('./Apiconfig');

function ItemInput({  }) {  
  const [Item_code, setItem_code] = useState("");
  const inputRef = useRef(null);
  const [Item_variant, setItem_variant] = useState("");
  const [Item_name, setItem_name] = useState("");
  const [Item_wigh, setItem_wigh] = useState(0);
  const [Item_BaseUOM, setItem_BaseUOM] = useState("");
  const [Item_SecondaryUOM, setItem_SecondaryUOM] = useState("");
  const [Item_short_name, setItem_short_name] = useState("");
  const [ Item_Last_salesRate_ExTax, setItem_Last_salesRate_ExTax] = useState(0);
  const [Item_Last_salesRate_IncludingTax, setItem_Last_salesRate_IncludingTax] = useState(0);
  const [Item_std_purch_price, setItem_std_purch_price] = useState("");
  const [Item_std_sales_price, setItem_std_sales_price] = useState("");
  const [Item_stock_code, setItem_stock_code] = useState("");
  const [Item_purch_tax_type, setItem_purch_tax_type] = useState("");
  const [Item_purch_othertax_type, setItem_purch_othertax_type] = useState("");
  const [Item_sales_tax_type, setItem_sales_tax_type] = useState("");
  const [Item_stock_type, setItem_stock_type] = useState("");
  const [item_images, setItem_image] = useState("");
  const [hsn, sethsn] = useState("");
  const [Item_Register_Brand, setItem_Register_Brand] = useState("");
  const [Item_Our_Brand, setItem_Our_Brand] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const [regbranddrop, setregbranddrop] = useState([]);
  const [ourbranddrop, setourbranddrop] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [uomdrop, setuomdrop] = useState([]);
  const [suomdrop, setsuomdrop] = useState([]);
  const [variantdrop, setvariantdrop] = useState([]);
  const [selectedvarient, setselectedvarient] = useState('');
  const [purtaxdrop, setpurtaxdrop] = useState([]);
  const [selectedpurtax, setselectedpurtax] = useState('');
  const [selectedOtherpurtax, setselectedOtherpurtax] = useState('');
  const [selectedOthersaltax, setselectedOthersaltax] = useState('');
    const [loading, setLoading] = useState(false);
  
  const [Item_sales_Othertax_type, setItem_sales_Othertax_type] = useState('');
  const [Othersaltaxdrop, setOthersaltaxdrop] = useState('');
  const [saltaxdrop, setsaltaxdrop] = useState([]);
  const [otherpurtaxdrop, setotherPurtaxdrop] = useState([]);
  const [selectedsaltax, setselectedsaltax] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedUom, setSelectedUom] = useState('');
  const [selectedSuom, setSelectedSuom] = useState('');
  const [selectedRegister, setSelectedRegister] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();  
  const purchaseprice = useRef(null);
  const salesprice = useRef(null);
  const stockcode = useRef(null);
  const stocktype = useRef(null);
  const Lpurchasetaxtype = useRef(null);
  const Opurchasetaxtype = useRef(null);
  const Lsalestaxtype = useRef(null);
  const Osalestaxtype = useRef(null);
  const HSNcode = useRef(null);
  const regbrand = useRef(null);
  const ourbrand = useRef(null);
  const Status = useRef(null);
  const img = useRef(null);
  const barCode = useRef(null);
  const withtax = useRef(null);
  const withouttax = useRef(null);
  const seceondoryuom = useRef(null);
  const baseuom = useRef(null);
  const weigh = useRef(null);
  const nam = useRef(null);
  const variant = useRef(null);
  const code = useRef(null);
  const shortname = useRef(null);
  const MrpPrice = useRef(null);
  const discount = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState('');
  const [barcode, setBarcode] = useState("");
  const [MRPprice, setMRPPrice] = useState(0);
  const [Discount, setDiscount] = useState(0);

  const created_by = sessionStorage.getItem('selectedUserCode')
  const modified_by = sessionStorage.getItem("selectedUserCode");
  const [isUpdated, setIsUpdated] = useState(false); 

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  
  console.log(selectedRow);

  const clearInputFields = () => {
    setBarcodeValue("");
    setItem_code("");
    setItem_name("");
    setItem_wigh(0);
    sethsn("");
    setItem_stock_type("");
    setItem_stock_code("");
    setItem_std_sales_price("");
    setItem_std_purch_price("");
    setItem_Last_salesRate_IncludingTax(0);
    setItem_Last_salesRate_ExTax(0);
    setItem_short_name("");
    setSelectedUom('');
    setSelectedSuom('');
    setSelectedRegister('');
    setSelectedBrand('');
    setSelectedStatus('');
    setselectedsaltax('');
    setSelectedImage('');
    setselectedpurtax('');
    setselectedvarient('');
    setMRPPrice(0);
    setDiscount(0);
    setItem_BaseUOM('');
    setItem_SecondaryUOM('');
    setItem_Register_Brand('');
    setItem_Our_Brand('');
    setStatus('');
    setItem_sales_Othertax_type('');
    setItem_sales_tax_type('');
    setItem_purch_tax_type('');
    setItem_purch_othertax_type('');
    setItem_variant('');
    setselectedOthersaltax('');
    setselectedOtherpurtax('');
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {
      setBarcodeValue(selectedRow.Barcode_Data||"")
      setItem_code(selectedRow.Item_code || "");
      setItem_name(selectedRow.Item_name || "");
      setItem_wigh(selectedRow.Item_wigh || 0);
      sethsn(selectedRow.hsn || "");
      setItem_stock_type(selectedRow.Item_stock_type || "");
      setItem_stock_code(selectedRow.Item_stock_code || "");
      setItem_std_sales_price(selectedRow.Item_std_sales_price || 0);
      setItem_std_purch_price(selectedRow.Item_std_purch_price || 0);
      setItem_Last_salesRate_IncludingTax(selectedRow.Item_Last_salesRate_IncludingTax || 0);
      setItem_Last_salesRate_ExTax(selectedRow.Item_Last_salesRate_ExTax || 0);
      setItem_short_name(selectedRow.Item_short_name || "");
      setMRPPrice(selectedRow.MRP_Price || 0);
      setDiscount(selectedRow.discount_Percentage || 0);
      setItem_BaseUOM(selectedRow.Item_BaseUOM || "");
      setItem_SecondaryUOM(selectedRow.Item_SecondaryUOM || "");
      setItem_Register_Brand(selectedRow.Item_Register_Brand || "");
      setItem_Our_Brand(selectedRow.Item_Our_Brand || "");
      setStatus(selectedRow.status || "");
      setItem_sales_Othertax_type(selectedRow.Item_other_sales_taxtype || "");
      setItem_sales_tax_type(selectedRow.Item_sales_tax_type || "");
      setItem_purch_tax_type(selectedRow.Item_purch_tax_type || "");
      setItem_purch_othertax_type(selectedRow.Item_other_purch_taxtype || "");
      setItem_variant(selectedRow.Item_variant || "");
      setSelectedUom({
        label: selectedRow.Item_BaseUOM,
        value: selectedRow.Item_BaseUOM,
      });
      setSelectedSuom({
        label: selectedRow.Item_SecondaryUOM,
        value: selectedRow.Item_SecondaryUOM,
      });
      setSelectedRegister({
        label: selectedRow.Item_Register_Brand,
        value: selectedRow.Item_Register_Brand,
      });
      setSelectedBrand({
        label: selectedRow.Item_Our_Brand,
        value: selectedRow.Item_Our_Brand,
      });
      setSelectedStatus({
        label: selectedRow.status,
        value: selectedRow.status,
      });
      setselectedsaltax({
        label: selectedRow.Item_sales_tax_type,
        value: selectedRow.Item_sales_tax_type,
      });
      setselectedOthersaltax({
        label: selectedRow.Item_other_sales_taxtype,
        value: selectedRow.Item_other_sales_taxtype,
      });
      setselectedpurtax({
        label: selectedRow.Item_purch_tax_type,
        value: selectedRow.Item_purch_tax_type,
      });

      setselectedOtherpurtax({
        label: selectedRow.Item_other_purch_taxtype,
        value: selectedRow.Item_other_purch_taxtype,
      });
      setselectedvarient({
        label: selectedRow.Item_variant,
        value: selectedRow.Item_variant,
      });

    if (selectedRow.item_images && selectedRow.item_images.data) {
      const base64Image = arrayBufferToBase64(selectedRow.item_images.data);
      const file = base64ToFile(`data:image/jpeg;base64,${base64Image}`, 'item_images.jpg');
      setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
      setItem_image(file)
    } else {
      setSelectedImage(null); 
    }
 
    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);


  const base64ToFile = (base64Data, fileName) => {
    if (!base64Data || !base64Data.startsWith("data:")) {
      throw new Error("Invalid base64 string");
    }
  
    const parts = base64Data.split(',');
    if (parts.length !== 2) {
      throw new Error("Base64 string is not properly formatted");
    }
  
    const mimePart = parts[0];
    const dataPart = parts[1];
  
    const mime = mimePart.match(/:(.*?);/);
    if (!mime || !mime[1]) {
      throw new Error("Could not extract MIME type");
    }
  
    const binaryString = atob(dataPart);
    const len = binaryString.length;
    const uint8Array = new Uint8Array(len);
  
    for (let i = 0; i < len; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
  
    const fileBlob = new Blob([uint8Array], { type: mime[1] });
    return new File([fileBlob], fileName, { type: mime[1] });
  };
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024; 
      if (file.size > maxSize) {

        toast.error("File size exceeds 1MB. Please upload a smaller file.")
        event.target.value = null;
        return;
      }
      setSelectedImage(URL.createObjectURL(file)); 
      setItem_image(file); 
    }
  };




  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/ourbrand`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setourbranddrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  
  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/regbrand`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setregbranddrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  
  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/uom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setuomdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/uom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setsuomdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    
    fetch(`${config.apiBaseUrl}/variant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setvariantdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

 
 

 
  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchsaltaxtype = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/gettaxitemsales`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const val = await response.json();
        setsaltaxdrop(val);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    if (company_code) {
      fetchsaltaxtype();
    }
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchsaltaxtype = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getotherpurtax`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code}),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const val = await response.json();
        setotherPurtaxdrop(val);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    if (company_code) {
      fetchsaltaxtype();
    }
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchsaltaxtype = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/getothersalestax`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code}),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const val = await response.json();
        setOthersaltaxdrop(val);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    if (company_code) {
      fetchsaltaxtype();
    }
  }, []);

    
  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    const fetchpurtaxtype = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/gettaxitempur`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const val = await response.json();
        setpurtaxdrop(val);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    if (company_code) {
      fetchpurtaxtype();
    }
  }, []);



  const filteredOptionRegister = regbranddrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionBrand = ourbranddrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionuom = uomdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionSuom = suomdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));
  const filteredOptionVariant = variantdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptiontaxitemsales = saltaxdrop.map((option) => ({
    value: option.tax_type,
    label: option.tax_type,
  }));



  const filteredOptionOthertaxitemsales = Array.isArray(Othersaltaxdrop) 
  ? Othersaltaxdrop.map((option) => ({
      value: option.Other_Sales_tax_type,
      label: option.Other_Sales_tax_type,  // Concatenate ApprovedBy and EmployeeId with ' - '
  }))
  : [];


  const filteredOptiontaxitempur = purtaxdrop.map((option) => ({
    value: option.tax_type,
    label: option.tax_type,
  }));

  const filteredOptionothertaxitempur = otherpurtaxdrop.map((option) => ({
    value: option.Other_purch_tax_type,
    label: option.Other_purch_tax_type,
  }));


  const handleChangeRegister = (selectedRegister) => {
    setSelectedRegister(selectedRegister);
    setItem_Register_Brand(selectedRegister ? selectedRegister.value : '');
      
  };

  const handleChangeBrand = (selectedBrand) => {
    setSelectedBrand(selectedBrand);
    setItem_Our_Brand(selectedBrand ? selectedBrand.value : '');
      
  };


  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : '');
      
  };

  const handleChangeUom = (selectedUom) => {
    setSelectedUom(selectedUom);
    setItem_BaseUOM(selectedUom ? selectedUom.value : '');
      
  };
 
  const handleChangeSuom = (selectedSuom) => {
    setSelectedSuom(selectedSuom);
    setItem_SecondaryUOM(selectedSuom ? selectedSuom.value : '');
      
  };
  const handleChangeVariant = (selectedvarient) => {
    setselectedvarient(selectedvarient);
    setItem_variant(selectedvarient ? selectedvarient.value : '');
      
  };

  const handleChangesaltax = (selectedsaltax) => {
    setselectedsaltax(selectedsaltax);
    setItem_sales_Othertax_type(selectedsaltax ? selectedsaltax.value : '');
      
  };

  
  const handleChangeOthersaltax = (selectedsaltax) => {
    setselectedOthersaltax(selectedsaltax);
    setItem_sales_tax_type(selectedsaltax ? selectedsaltax.value : '');
      
  };

  const handleChangepurtax= (selectedpurtax) => {
    setselectedpurtax(selectedpurtax);
    setItem_purch_tax_type(selectedpurtax ? selectedpurtax.value : '');
      
  };

  const handleChangeotherpurtax= (selectedpurtax) => {
    setselectedOtherpurtax(selectedpurtax);
    setItem_purch_othertax_type(selectedpurtax ? selectedpurtax.value : '');
      
  };

  const handleInsert = async () => {
    if (
      !Item_code ||
      !Item_variant ||
      !Item_name ||
      !Item_BaseUOM ||
      !Item_SecondaryUOM ||
      !Item_std_purch_price ||
      !Item_std_sales_price ||
      !Item_purch_tax_type ||
      !Item_sales_tax_type ||
      !Item_sales_Othertax_type ||
      !Item_purch_othertax_type ||
      !hsn ||
      !Item_Register_Brand ||
      !Item_Our_Brand ||
      !MRPprice ||
      !status
    ) {
      setError(" ");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("company_code", sessionStorage.getItem('selectedCompanyCode'));
      formData.append("Item_code", Item_code);
      formData.append("Item_variant", Item_variant);
      formData.append("Item_name", Item_name);
      formData.append("Item_wigh", Item_wigh);
      formData.append("Item_BaseUOM", Item_BaseUOM);
      formData.append("Item_SecondaryUOM", Item_SecondaryUOM);
      formData.append("Item_short_name", Item_short_name);
      formData.append("Item_Last_salesRate_ExTax", Item_Last_salesRate_ExTax);
      formData.append("Item_Last_salesRate_IncludingTax", Item_Last_salesRate_IncludingTax);
      formData.append("Item_std_purch_price", Item_std_purch_price);
      formData.append("Item_std_sales_price", Item_std_sales_price);
      formData.append("Item_stock_code", Item_stock_code);
      formData.append("Item_purch_tax_type", Item_purch_tax_type);
      formData.append("Item_sales_tax_type", Item_sales_tax_type);
      formData.append("Item_other_sales_taxtype", Item_sales_Othertax_type);
      formData.append("Item_other_purch_taxtype", Item_purch_othertax_type);
      formData.append("Item_stock_type", Item_stock_type);
      formData.append("hsn", hsn);
      formData.append("Item_Register_Brand", Item_Register_Brand);
      formData.append("Item_Our_Brand", Item_Our_Brand);
      formData.append("status", status);
      formData.append("barcodeimg", barcode);
      formData.append("MRP_price", MRPprice);
      formData.append("discount_Percentage", Discount);
      formData.append("created_by", sessionStorage.getItem('selectedUserCode'));
  
      if (item_images) {
        formData.append("item_images", item_images); // Appending the image file
      }

      const response = await fetch(`${config.apiBaseUrl}/addItemBrandData`, {
        method: "POST",
        body: formData, // Sending as FormData
      });
  
      if (response.ok) {
                               toast.success("Data inserted Successfully", {
                                 onClose: () => clearInputFields()
                               });
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
    finally {
      setLoading(false);
    }
  };

  const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
    if (e.key === 'Enter') {
      // Check if the value has changed and handle the search logic
      if (hasValueChanged) {
        await handleKeyDownStatus(e); // Trigger the search function
        setHasValueChanged(false); // Reset the flag after the search
      }
  
      // Move to the next field if the current field has a valid value
      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault(); // Prevent moving to the next field if the value is empty
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) { // Only trigger search if the value has changed
       // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };
  

  const handleNavigate = () => {
    navigate("/Item"); // Pass selectedRows as props to the Input component
  };


  const handleUpdate = async () => {
    if (
      !Item_code ||
      !selectedvarient ||
      !Item_name ||
      !selectedUom ||
      !selectedSuom ||
      !Item_std_purch_price ||
      !Item_std_sales_price ||
      !selectedOtherpurtax||
      !selectedOthersaltax||
      !selectedpurtax ||
      !selectedsaltax ||
      !hsn ||
      !selectedRegister ||
      !selectedBrand ||
      !MRPprice||
      !selectedStatus
    ) {
      setError(" ");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("company_code", sessionStorage.getItem('selectedCompanyCode'));
      formData.append("Item_code", Item_code);
      formData.append("Item_variant", selectedvarient.value);
      formData.append("Item_name", Item_name);
      formData.append("Item_wigh", Item_wigh);
      formData.append("Item_BaseUOM", selectedUom.value);
      formData.append("Item_SecondaryUOM", selectedSuom.value);
      formData.append("Item_short_name", Item_short_name);
      formData.append("Item_Last_salesRate_ExTax", Item_Last_salesRate_ExTax);
      formData.append("Item_Last_salesRate_IncludingTax", Item_Last_salesRate_IncludingTax);
      formData.append("Item_std_purch_price", Item_std_purch_price);
      formData.append("Item_std_sales_price", Item_std_sales_price);
      formData.append("Item_stock_code", Item_stock_code);
      formData.append("Item_purch_tax_type", selectedpurtax.value);
      formData.append("Item_sales_tax_type", selectedsaltax.value);
      formData.append("Item_other_purch_taxtype", selectedOtherpurtax.value);
      formData.append("Item_other_sales_taxtype", selectedOthersaltax.value);
      formData.append("Item_stock_type", Item_stock_type);
      formData.append("hsn", hsn);
      formData.append("MRP_price", MRPprice);
      formData.append("discount_Percentage", Discount);
      formData.append("Item_Register_Brand", selectedRegister.value);
      formData.append("Item_Our_Brand", selectedBrand.value);
      formData.append("status", selectedStatus.value);
      formData.append("created_by", sessionStorage.getItem('selectedUserCode'));
  
      if (item_images) {
        formData.append("item_images", item_images); // Appending the image file
      }
  
      const response = await fetch(`${config.apiBaseUrl}/ItemUpdate`, {
        method: "POST",
        body: formData, // Sending as FormData
      });
  
      if (response.ok) {
                               toast.success("Data updated successfully", {
                                 onClose: () => clearInputFields()
                               });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error( "Failed to Update data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
    finally {
      setLoading(false);
    }
  };

   // Handle input field change
   const handleInputChange = (e) => {
    const value = e.target.value;
    setBarcode(value);

    if (value) {
      setBarcodeValue(true); // Show the barcode when there's input
    } else {
      setBarcodeValue(false); // Hide barcode when input is empty
    }
  };


  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Item Barcode data'
  });
  

   useEffect(() => {
      const handleScan = (e) => {
        if (e.key === 'Enter') {
          setItem_code(e.target.value);
        }
      };
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.addEventListener('keydown', handleScan);
      }
      return () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener('keydown', handleScan);
        }
      };
    }, []);

  return (
    <div class="container-fluid Topnav-screen ">
       <div className="">
        
    <div class="">
                    {loading && <LoadingScreen />}
      
      <ToastContainer
      position="top-right"
      className="toast-design" // Adjust this value as needed
theme="colored"
      />
          <div className="shadow-lg p-0 bg-body-tertiary rounded ">
    <div className=" mb-0 d-flex justify-content-between" >
              <h1 align="left" class="purbut">{mode === 'update' ? 'Update Item' : 'Add Item'}</h1>
              <h1 align="left" class="mobileview fs-4">{mode === 'update' ? 'Update Item' : 'Add Item'}</h1>
             
            <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
              <i class="fa-solid fa-xmark"></i>
              </button></div>

             
            </div>
        
        <div class="pt-2 mb-4">  
        
        <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
          <div class="row">
          <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      Code
                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="Icode"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the code"
                  value={Item_code}
                  onChange={(e) => setItem_code(e.target.value)}
                  maxLength={18}
                  ref={inputRef}
                  readOnly={mode === "update"}
                  onKeyDown={(e) => handleKeyDown(e, variant, code)}
                />                  {error && !Item_code && <div className="text-danger">Code should not be blank</div>}


              </div>
            </div>

            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      Variant

                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div> 
                <div title="Select the Variant">
                 <Select
                  id="SUOM"
                  value={selectedvarient}
                  onChange={handleChangeVariant}
                  options={filteredOptionVariant}
                  className="exp-input-field"
                  placeholder=""
                  maxLength={18}
                  ref={variant}
                  readOnly={mode === "update"}
                  isDisabled={mode === "update"}
                  onKeyDown={(e) => handleKeyDown(e, nam, variant)}
                />
                {error && !Item_variant && <div className="text-danger">Variant should not be blank</div>}

 </div>
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      Name

                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div> <input
                  id="Iname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the name"
                  value={Item_name}
                  onChange={(e) => setItem_name(e.target.value)}
                  maxLength={40}
                  defaultValue={0} 
                  ref={nam}
                  onKeyDown={(e) => handleKeyDown(e, weigh, nam)}
                />            {error && !Item_name && <div className="text-danger">Name should not be blank</div>}


              </div>

            </div>
         
        
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="Iweight" class="exp-form-labels">
                  Weight
                </label><input
                  id="weight"
                  class="exp-input-field form-control"
                  type="Number"
                  placeholder=""
                  required title="Please enter the weight"
                  value={Item_wigh}
                  onChange={(e) => setItem_wigh(e.target.value)}
                  maxLength={20}
                  ref={weigh}
                  onKeyDown={(e) => handleKeyDown(e, baseuom, weigh)}
                />

              </div>
            </div>




            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">

                <div>
                  <label for="state" class="exp-form-labels">
                    Base UOM <div>
                      <span className="text-danger">*</span>
                    </div>

                  </label>
                </div>


<div title="Select the Base UOM">
                <Select
                  id="BUOM"
                  value={selectedUom}
                  onChange={handleChangeUom}
                  options={filteredOptionuom}
                  className="exp-input-field"
                  placeholder=""
                  maxLength={60}
                  ref={baseuom}
                  onKeyDown={(e) => handleKeyDown(e, seceondoryuom, baseuom)}
                />
                {error && !Item_BaseUOM && <div className="text-danger">Base UOM should not be blank</div>}

</div>
              </div>
            </div>


            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      Secondary UOM <div>
                        <span className="text-danger">*</span>
                      </div>
                    </label>
                  </div>
                </div>
<div title="Select the Secondary UOM">
                <Select
                  id="SUOM"
                  value={selectedSuom}
                  onChange={handleChangeSuom}
                  options={filteredOptionSuom}
                  className="exp-input-field"
                  placeholder=""
                  maxLength={60}
                  ref={seceondoryuom}
                  onKeyDown={(e) => handleKeyDown(e, shortname, seceondoryuom)}
                />
                {error && !Item_SecondaryUOM && <div className="text-danger">Secondary UOM should not be blank</div>}

</div>
              </div>

            </div>
            <div className="col-md-3 form-group mb-2 ">
              <div class="exp-form-floating">

                <div>
                  <label for="state" class="exp-form-labels">
                    Short Name<div>
                      {/* <span className="text-danger">*</span> */}
                    </div>

                  </label>


                </div><input
                  id="Ishname"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the short name"
                  value={Item_short_name}
                  onChange={(e) => setItem_short_name(e.target.value)}
                  maxLength={50}
                  ref={shortname}
                  onKeyDown={(e) => handleKeyDown(e, withouttax, shortname)}
                />           
                 {/* {error && !Item_short_name && <div className="text-danger">Short Name should not be blank</div>} */}


              </div>
            </div>

            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="Iwotax" class="exp-form-labels">
                  Without Tax
                </label><input
                  id="Iwotax"
                  class="exp-input-field form-control"
                  type="Number"
                  placeholder=""
                  required title="Please enter the without tax"
                  value={Item_Last_salesRate_ExTax}
                  onChange={(e) => setItem_Last_salesRate_ExTax(e.target.value)}
                  maxLength={20}
                  ref={withouttax}
                  onKeyDown={(e) => handleKeyDown(e, withtax, withouttax)}
                />

              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="Iwtax" class="exp-form-labels">
                  With Tax
                </label><input
                  id="Iwtax"
                  class="exp-input-field form-control"
                  type="Number"
                  placeholder=""
                  required title="Please enter the with tax"
                  value={Item_Last_salesRate_IncludingTax}
                  onChange={(e) => setItem_Last_salesRate_IncludingTax(e.target.value)}
                  maxLength={20}
                  ref={withtax}
                  onKeyDown={(e) => handleKeyDown(e, purchaseprice, withtax)}
                />

              </div>
            </div>



            <div className="col-md-3 form-group mb-2">

              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      Purchase Price

                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="Ipprice"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=""
                  required title="Please enter the purchase price"
                  value={Item_std_purch_price}
                  onChange={(e) => setItem_std_purch_price(e.target.value)}
                  maxLength={20}
                  ref={purchaseprice}
                  onKeyDown={(e) => handleKeyDown(e, salesprice, purchaseprice)}
                />
                {error && !Item_std_purch_price && <div className="text-danger">Purchase Price should not be blank</div>}

              </div>
            </div>

            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      Sales Price

                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="Isprice"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=""
                  required title="Please enter the sales price"
                  value={Item_std_sales_price}
                  onChange={(e) => setItem_std_sales_price(e.target.value)}
                  maxLength={20}
                  ref={salesprice}
                  onKeyDown={(e) => handleKeyDown(e, MrpPrice, salesprice)}
                />            {error && !Item_std_sales_price && <div className="text-danger">Sales Price should not be blank</div>}


              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      MRP Price

                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="Isprice"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=""
                  required title="Please enter the MRP price"
                  value={MRPprice}
                  onChange={(e) => setMRPPrice(e.target.value)}
                  maxLength={20}
                  ref={MrpPrice}
                   onKeyDown={(e) => handleKeyDown(e, discount, MrpPrice)}
                />{error && !MRPprice && <div className="text-danger">MRP Price should not be blank</div>}


              </div>
            </div>
           
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      Discount %

                    </label>
                  </div>
                  
                </div><input
                  id="Disc%"
                  class="exp-input-field form-control"
                  type="number"
                  placeholder=""
                  required title="Please enter the Discount Percentage"
                  value={Discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  maxLength={20}
                  ref={discount}
                   onKeyDown={(e) => handleKeyDown(e, Lpurchasetaxtype, discount)}
                />
               

              </div>
            </div>
           
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                     Local Purchase Tax Type

                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div> 
                <div title="Select the Local Purchase Tax Type ">  <Select
                  id="SUOM"
                  value={selectedpurtax}
                  onChange={handleChangepurtax}
                  options={filteredOptiontaxitempur}
                  className="exp-input-field"
                  placeholder=""
                  maxLength={18}
                  ref={Lpurchasetaxtype}
                  onKeyDown={(e) => handleKeyDown(e, Opurchasetaxtype, Lpurchasetaxtype)}
                />
                {error && !Item_purch_tax_type && <div className="text-danger">Purchase Tax Type should not be blank</div>}
</div>
              </div>
            </div>

            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      Other Purchase Tax Type

                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div>  
                <div title="Select the Other Purchase Tax Type "> 
                  <Select
                  id="SUOM"
                  value={selectedOtherpurtax}
                  onChange={handleChangeotherpurtax}
                  options={filteredOptionothertaxitempur}
                  className="exp-input-field"
                  placeholder=""
                  maxLength={18}
                  ref={Opurchasetaxtype}
                  onKeyDown={(e) => handleKeyDown(e, Lsalestaxtype, Opurchasetaxtype)}
                />
                {error && !Item_purch_othertax_type && <div className="text-danger">Purchase Tax Type should not be blank</div>}

              </div>
              </div>
            </div>

            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels"> 
                      Local Sales Tax Type

                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div> 
                    <div title="Select the Local Sales Tax Type "> 
                  <Select
                  id="SUOM"
                  value={selectedOthersaltax}
                  onChange={handleChangeOthersaltax}
                  options={filteredOptiontaxitemsales}
                  className="exp-input-field"
                  placeholder=""
                  maxLength={18}
                  ref={Lsalestaxtype}
                  onKeyDown={(e) => handleKeyDown(e, Osalestaxtype, Lsalestaxtype)}
                /> {error && !Item_sales_tax_type && <div className="text-danger">Sales Tax Type should not be blank</div>}


              </div>
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels"> 
                      Other Sales Tax Type

                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div> 
                  <div title="Select the Other Sales Tax Type "> 

                  <Select
                  id="SUOM"
                  value={selectedsaltax}
                  onChange={handleChangesaltax}
                  options={filteredOptionOthertaxitemsales}
                  className="exp-input-field"
                  placeholder=""
                  maxLength={18}
                  ref={Osalestaxtype}
                  onKeyDown={(e) => handleKeyDown(e, stockcode, Osalestaxtype)}
                />         {error && !Item_sales_Othertax_type && <div className="text-danger">Sales Tax Type should not be blank</div>}


              </div>
              </div>
            </div>

            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <label for="Istcode" class="exp-form-labels">
                  Stock Code
                </label> <input
                  id="Istcode"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the stock code"
                  value={Item_stock_code}
                  onChange={(e) => setItem_stock_code(e.target.value)}
                  maxLength={10}
                  ref={stockcode}
                  onKeyDown={(e) => handleKeyDown(e, stocktype, stockcode)}
                />

              </div>
            </div>

            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      Stock type

                    </label>
                  </div>
                  <div>
                    {/* <span className="text-danger">*</span> */}
                  </div>
                </div><input
                  id="Isttype"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the stock type"
                  value={Item_stock_type}
                  onChange={(e) => setItem_stock_type(e.target.value)}
                  maxLength={50}
                  ref={stocktype}
                  onKeyDown={(e) => handleKeyDown(e, HSNcode, stocktype)}
                />
                {/* {error && !Item_stock_type && <div className="text-danger">Stock Type should not be blank</div>} */}

              </div>
            </div>
            
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      HSN Code

                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div><input
                  id="Ihsn"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the HSN code"
                  value={hsn}
                  onChange={(e) => sethsn(e.target.value)}
                  maxLength={6}
                  ref={HSNcode}
                  onKeyDown={(e) => handleKeyDown(e, regbrand, HSNcode)}
                />            {error && !hsn && <div className="text-danger">HSN Code should not be blank</div>}


              </div>
            </div>

            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      Register Brand

                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div>
                                  <div title="Select the Register Brand "> 

                <Select
                  id="regbrand"
                  value={selectedRegister}
                  onChange={handleChangeRegister}
                  options={filteredOptionRegister}
                  className="exp-input-field"
                  placeholder=""
                  maxLength={30}
                  ref={regbrand}
                  onKeyDown={(e) => handleKeyDown(e, ourbrand, regbrand)}
                />
                {error && !status && <div className="text-danger">Register Brand should not be blank</div>}


              </div>
              </div>
            </div>



            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                      Our Brand

                    </label>
                  </div>
                  <div>
                    <span className="text-danger">*</span>
                  </div>
                </div>
                                                 <div title="Select the Our Brand "> 

                <Select
                  id="ahsts"
                  value={selectedBrand}
                  onChange={handleChangeBrand}
                  options={filteredOptionBrand}
                  className="exp-input-field"
                  placeholder=""
                  maxLength={30}
                  ref={ourbrand}
                  onKeyDown={(e) => handleKeyDown(e, Status, ourbrand)}
                />
                {error && !status && <div className="text-danger">Our Brand should not be blank</div>}


              </div>
              </div>
            </div>
            <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">

                <div>
                  <label for="state" class="exp-form-labels">
                    Status <div>
                      <span className="text-danger">*</span>
                    </div>

                  </label>


                </div>
                 <div title="Select the Our Brand "> 

                <Select
                  id="ahsts"
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  options={filteredOptionStatus}
                  className="exp-input-field"
                  placeholder=""
                  maxLength={250}
                  ref={Status}
                  onKeyDown={(e) => handleKeyDown(e, img, Status)}
                />
                {error && !status && <div className="text-danger">Status should not be blank</div>}


              </div>
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
                       ref={img}
                        onKeyDown={(e) => handleKeyDown(e,barCode, img)}
                      />
                </div>
                </div>
                {selectedImage && (
                        <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                        <img 
                          src={selectedImage} 
                          alt="Selected Preview" 
                          className="avatar rounded sm mt-4" 
                          style={{ height: '200px', width: '200px' }}
                        /></div></div>
                      )}
                         <div className="col-md-3 form-group mb-2">
              <div class="exp-form-floating">
                <div class="d-flex justify-content-start">
                  <div>
                    <label for="state" class="exp-form-labels">
                    Barcode 
                    </label>
                  </div>
                  <div>
                    {/* <span className="text-danger">*</span> */}
                  </div>
                </div><input
                  id="barcode"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  required title="Please enter the barcode value"
                  value={barcode}
                  onChange={handleInputChange}
                  maxLength={18}
                  ref={barCode}
                 onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (mode === "create") {
                    handleInsert();
                  } else {
                    handleUpdate();
                  }
                }
              }}
                />                 


              </div>
            </div>
          <div className="col-md-3 form-group mb-2" >
              <div class="exp-form-floating">

                
      

               
               
                <div ref={componentRef} style={{ marginTop: '20px', overflowX:"auto" }}>
               {barcodeValue && <Barcode value={Item_code} displayValue={false}  height={20}/>}
              </div></div>
            </div>

           
            {/* <div className="col-md-3 form-group  mb-2">
            {mode === "create" ? (
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="state" class="exp-form-labels">
                        Created By
                      </label>
                    </div>
                  </div>
                  <input
                    id="emailid"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the email ID"
                    value={created_by}
                  />
                </div>
                ) : (
            <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="state" class="exp-form-labels">
                        Modified By
                      </label>
                    </div>
                  </div>
                  <input
                    id="emailid"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the email ID"
                    value={modified_by}
                  />
                </div>
                )}

          </div> */}

        


               <div class="col-md-3 form-group">
          <div class="d-flex justify-content-start ">
         
                {mode === "create" ? (

                  
                  <button onClick={handleInsert} className="mt-4" title="Save">
                    <i class="fa-solid fa-floppy-disk"></i>
                  </button>
                ) : (
                  <button onClick={handleUpdate} className="mt-4" title="Update">
                    <i class="fa-solid fa-floppy-disk"></i>
                  </button>
                )}

                <div className="mt-4 form-group">
                        <button
                      onClick={handlePrint}
                  class=" "
                  required
                  title="Generate Report"
                >
                  <i class="fa-solid fa-print"></i>
                </button>
              
            </div>

              </div></div>
               
              
            
          </div>
        </div>
      </div>

    
    </div>
    </div>
    </div>

  );
}
export default ItemInput;
