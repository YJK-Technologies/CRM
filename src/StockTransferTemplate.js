import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import './Template.css'
import { toWords } from 'number-to-words';
import {ToWords} from 'to-words';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'    
const config = require('./Apiconfig');

const Template = () => {
    const componentRef = useRef("");
    const toWords = new ToWords();
    // const [headerData, setHeaderData] = useState(null);
    // const [detailData, setDetailData] = useState([]);
    // const [taxData, setTaxData] = useState(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Purchase data'
    });

    const handleDownload = async () => {
        try {
          const invoiceElement = componentRef.current;
          const canvas = await html2canvas(invoiceElement);
          const imageData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
      
          const imgWidth = 210; // A4 width in mm
          const imgHeight = canvas.height * imgWidth / canvas.width;
          pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
      
          const blob = pdf.output('blob');
      
          if ('showSaveFilePicker' in window) {
            const opts = {
              types: [{
                description: 'PDF file',
                accept: { 'application/pdf': ['.pdf'] },
              }],
            };
      
            const handle = await window.showSaveFilePicker(opts);
            const writableStream = await handle.createWritable();
            await writableStream.write(blob);
            await writableStream.close();
          } else {
            const fileName = prompt("Enter file name:", "invoice.pdf");
            if (fileName) {
              saveAs(blob, fileName);
            }
          } 
        } catch (error) {
          console.error('Error saving the file:', error);
        }
      };

    const location = useLocation();
    const parseQueryParams = (query) => {
        return query
          .substring(1)
          .split("&")
          .reduce((acc, param) => {
            const [key, value] = param.split("=");
            acc[key] = decodeURIComponent(value);
            return acc;
          }, {});
      };
    
      const queryParams = parseQueryParams(location.search);
    
      const detailData = JSON.parse(queryParams.detailData);
    
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // Fetch header data
    //             const headerResponse = await fetch(`${config.apiBaseUrl}/refNumberToHeaderPrintData`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({ purch_autono: state.new_running_no })
    //             });
    //             const headerData = await headerResponse.json();
    //             // setHeaderData(headerData);
    //             // Fetch detail data
    //             const detailResponse = await fetch(`${config.apiBaseUrl}/refNumberToDetailPrintData`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({ purch_autono: state.new_running_no })
    //             });
    //             const detailData = await detailResponse.json();
    //             // setDetailData(detailData);

    //             // Fetch tax data
    //             const taxResponse = await fetch(`${config.apiBaseUrl}/refNumberToSumTax`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({ numberseries: state.new_running_no })
    //             });
    //             const taxData = await taxResponse.json();
    //             // setTaxData(taxData);
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };

    //     if (state && state.new_running_no) {
    //         fetchData();
    //     }
    // }, [state.new_running_no]);

    if ( !detailData) {
        return <div>Loading...</div>;
    }

    // const convertToWords = (amount) => {
    //     let words = toWords(amount);
    //     // Capitalize the first letter and add currency
    //     words = words.charAt(0).toUpperCase() + words.slice(1) + ' rupees only';
    //     return words;
    // };

  
    return (
        <>
            <div className="invoice-container" ref={componentRef}>
                <div className="invoice-header">
                    <div className="company-details">
                        {/* <h2>{headerData[0].company_code}</h2> */}
                    </div>
                    <div className="logo">
                        {/* <img src="logo.png" alt="Company Logo" /> */}
                    </div>
                </div>
                <h1 className="invoice-title">Stock Transfer Report</h1>
                <div className="invoice-info">
                    <div className="bill-to">
                        
                    </div>
                    <div className="invoice-details">
                       
                        <p>Transaction Date : {new Date(detailData[0].transaction_date).toLocaleDateString()}</p>
                       
                    </div>
                </div>
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>From Warehouse</th>
                            <th>To Warehouse</th>
                            <th> Qty</th>
                            <th> Weight</th>
                            <th>Total Weight</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                    {detailData.map((row, index) => (
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{row.item_code}</td>
                                <td>{row.Item_name}</td>
                               
                                <td>{row.from_Warehouse}</td>
                                <td>{row.to_Warehouse}</td>
                                <td>{row.transfer_Qty}</td>
                                <td>{row.weight}</td>
                                
                                <td>{row.total_weight}</td>
                            </tr>
                               ))}
                    
                    </tbody>
                </table>
           
                <div className="invoice-footer">
                    <p>For: My Company</p>
                    {/* <p>Authorized Signatory</p> */}
                </div>
              </div>
            
              <div class="d-flex justify-content-between" style={{ marginLeft: "45%", marginTop: "5px" }} >
                <div align="left" class="d-flex justify-content-start">
                    <button
                        type="button"
                        onClick={handleDownload}
                        className='PrintButton'
                        >
                        <FontAwesomeIcon icon="fa-solid fa-download" />
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className='PrintButton'
                        >
                        <FontAwesomeIcon icon="fa-solid fa-print" />
                    </button>

                </div>
            </div>
        </>
    );
}

export default Template;
