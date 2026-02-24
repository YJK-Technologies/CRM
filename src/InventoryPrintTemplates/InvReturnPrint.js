import React, { useRef,useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import '../Template.css';
import { ToWords } from 'to-words';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InvReturnPrint = () => {
  const [headerData, setHeaderData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const componentRef = useRef();
  const toWords = new ToWords();

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

    useEffect(() => {
        const header = sessionStorage.getItem('IRheaderData');
        const detail = sessionStorage.getItem('IRdetailData');

        if (header && detail) {
            setHeaderData(JSON.parse(header));
            setDetailData(JSON.parse(detail));
        } else {
            console.error('Data not found in sessionStorage');
        }
    }, []);


    if (!headerData || !detailData) {
        return <div>Loading...</div>;
    }

  return (
    <>
      <div className="invoice-container" ref={componentRef}>
        <div className="invoice-header">
          <div className="company-details">
            <h2>{headerData[0].company_code}</h2>
            {/* <p>Phone no: 9790876453</p> */}
          </div>
          <div className="logo">
            {/* <img src="logo.png" alt="Company Logo" /> */}
          </div>
        </div>
        <h1 className="invoice-title">Inventory Return</h1>
        <div className="invoice-info">
          <div className="bill-to">
            <p>Return Id : {headerData[0].ReturnID}</p>
            <p>Return Type : {headerData[0].Return_Type}</p>
            <p>Transaction Date : {new Date(headerData[0].DateReturned).toLocaleDateString()}</p>
          </div>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item Name</th>
              <th>Warehouse</th>
              <th>Supplier</th>
              <th>Quantity Returned</th>
              <th>Reason For Return</th>
              <th>Condition</th>
              <th>Processed By</th>
              <th>Approval Status</th>
              <th>Action Taken</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {detailData.map((row, index) => (
              <tr key={index}>
                <td>{row.ItemSNo}</td>
                <td>{row.ItemName}</td>
                <td>{row.Warehouse}</td>
                <td>{row.Supplier}</td>
                <td>{row.QuantityReturned}</td>
                <td>{row.ReasonForReturn}</td>
                <td>{row.Condition}</td>
                <td>{row.ProcessedBy}</td>
                <td>{row.ApprovalStatus}</td>
                <td>{row.ActionTaken}</td>
                <td>{row.Notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="invoice-footer">
          <p>For: My Company</p>
          {/* <p>Authorized Signatory</p> */}
        </div>
      </div>
      <div className="d-flex justify-content-between" style={{ marginLeft: "45%", marginTop: "5px" }}>
        <div align="left" className="d-flex justify-content-start">
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

export default InvReturnPrint;
