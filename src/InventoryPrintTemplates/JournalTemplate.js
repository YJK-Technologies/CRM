import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import '../Template.css';
import { ToWords } from 'to-words';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const JournalPrint = () => {
  const [headerData, setHeaderData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const componentRef = useRef();
  const toWords = new ToWords();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Journal data'
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
        const header = sessionStorage.getItem('JheaderData');
        const detail = sessionStorage.getItem('JdetailData');

        if (header && detail) {
            setHeaderData(JSON.parse(header));
            setDetailData(JSON.parse(detail));
        } else {
            console.error('Data not found in sessionStorage');
        }
    }, []);


    if (!headerData || !detailData ) {
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
        <h1 className="invoice-title">Journal</h1>
        <div className="invoice-info">
          <div className="bill-to">
            <p>Journal Number : {headerData[0].journal_no}</p>
            <p>Transaction  Date : {new Date(headerData[0].transaction_date).toLocaleDateString()}</p>
          </div>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Transaction Type</th>
              <th>Original ACC code Code</th>
              <th>Contra Acc code</th>
              <th>Journal  Amount</th>
               <th>Narration 1</th>
              <th>Narration 2</th>
              <th>Narration 3</th>
              <th>Narration 4</th> 
            </tr>
          </thead>
          <tbody>
            {detailData.map((row, index) => (
              <tr key={index}>
                <td>{row.Item_SNo}</td>
                <td>{row.transaction_type}</td>
                <td>{row.original_accountcode}</td>
                <td>{row.contra_accountCode}</td>
                <td>{row.journal_amount}</td>
                 <td>{row.narration1}</td>
                <td>{row.narration2}</td>
                <td>{row.narration3}</td>
                <td>{row.narration4}</td> 
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

export default JournalPrint;
