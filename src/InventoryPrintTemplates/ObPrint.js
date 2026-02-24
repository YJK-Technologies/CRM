import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import '../Template.css';
import { ToWords } from 'to-words';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdjustmnetPrint = () => {
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
  const headerData = JSON.parse(queryParams.headerData);
  const detailData = JSON.parse(queryParams.detailData);

  console.log(detailData)

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
        <h1 className="invoice-title">Opening Balance</h1>
        <div className="invoice-info">
          <div className="bill-to">
            <p>Transaction Number : {headerData[0].transaction_no}</p>
            <p>Transaction  Date : {new Date(headerData[0].transaction_date).toLocaleDateString()}</p>
          </div>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Account Code</th>
              <th>Journal No</th>
              <th>Account Type</th>
              <th>Item Type</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>
            {detailData.map((row, index) => (
              <tr key={index}>
                <td>{row.Item_SNo}</td>
                <td>{row.acct_code}</td>
                <td>{row.journal_no}</td>
                <td>{row.acc_type}</td>
                <td>{row.item_type}</td>
                <td>{row.debit}</td>
                <td>{row.credit}</td>
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

export default AdjustmnetPrint;
