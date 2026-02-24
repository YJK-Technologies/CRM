import React from "react";
import "./PayslipReport.css";
import logo from './main.png'; // Make sure this logo matches the image

const PayslipReport = ({ payslip }) => {
  if (!payslip) return null;

  const {
    Basic,
    Bonus,
    Company_Pf_Contribution,
    Conveyance,
    EmployeeId,
    HRA,
    LeaveDeduction,
    Location_name,
    Medical,
    Net_Earnings,
    Other_Allowance,
    PFNo,
    PF_both_share,
    ProfessionalTax,
    SalaryDate,
    SalaryMonth,
    Special_Allowance,
    StaffLoan_SalaryAdvance,
    TDS,
    Total_Earnigs,
    Total_Leave,
    company_code,
    company_logo,
    company_name,
    designation_ID,
    employeename,
    mail_id,
    otherDeductions,
    Gross_deductions,
    total_working_days,
    PF_contribution_employee
  } = payslip;

  const getImageFromBuffer = (bufferData) => {
    const base64String = btoa(
      new Uint8Array(bufferData).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/png;base64,${base64String}`;
  };

  const logoSrc = getImageFromBuffer(company_logo?.data);

  return (
    <div className="payslip-wrapper">
      <div className="payslip-card">
        <h4 className="payslip-title">PAYSLIP</h4>

        <div className="header-section">
          <div className="company-info">
            <img src={logoSrc} alt="Company Logo" className="company-logo" />
            <div>
              <h5 className="company-name">{company_name}</h5>
              <p className="location"><strong>{Location_name}</strong></p>
              <p className="salary-month">Payslip for the month of <strong>{SalaryMonth}</strong></p>
            </div>
          </div>
          <div className="employee-info me-5">
            <p><strong>Associate Code:</strong> {EmployeeId}</p>
            <p><strong>Associate Name:</strong> {employeename}</p>
            <p><strong>PF No:</strong> {PFNo}</p>
            <p><strong>Designation:</strong>{designation_ID}</p>
            <p><strong>Location:</strong> {Location_name}</p>
            <p><strong>Total Working Days:</strong> {total_working_days}</p>
            {/* <p><strong>Total Working Days:</strong> 28</p> */}
          </div>
        </div>

        <table className="payslip-table">
          <thead>
            <tr>
              <th colSpan={3}>Earnings</th>
              <th colSpan={3}>Deductions</th>
            </tr>
            <tr>
              <th>Title</th>
              <th>Monthly</th>
              <th>Yearly</th>
              <th>Title</th>
              <th>Monthly</th>
              <th>Yearly</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Basic</td>
              <td>{(Basic || 0).toFixed(2)}</td>
              <td>{(Basic * 12).toFixed(2)}</td>
              <td>PF both share</td>
              <td>{(PF_both_share || 0).toFixed(2)}</td>
              <td>{((PF_both_share || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>HRA</td>
              <td>{(HRA || 0).toFixed(2)}</td>
              <td>{((HRA || 0) * 12).toFixed(2)}</td>
              <td>TDS</td>
              <td>{(TDS || 0).toFixed(2)}</td>
              <td>{((TDS || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Conveyance</td>
              <td>{(Conveyance || 0).toFixed(2)}</td>
              <td>{((Conveyance || 0) * 12).toFixed(2)}</td>
              <td>Professional Tax</td>
              <td>{(ProfessionalTax || 0).toFixed(2)}</td>
              <td>{((ProfessionalTax || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Medical Allowance</td>
              <td>{(Medical || 0).toFixed(2)}</td>
              <td>{((Medical || 0) * 12).toFixed(2)}</td>
              <td>Salary Advance</td>
              <td>{(StaffLoan_SalaryAdvance || 0).toFixed(2)}</td>
              <td>{((StaffLoan_SalaryAdvance || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Special Allowance</td>
              <td>{(Special_Allowance || 0).toFixed(2)}</td>
              <td>{((Special_Allowance || 0) * 12).toFixed(2)}</td>
              <td>Other Deductions</td>
              <td>{(otherDeductions || 0).toFixed(2)}</td>
              <td>{((otherDeductions || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Company PF</td>
              <td>{(Company_Pf_Contribution || 0).toFixed(2)}</td>
              <td>{((Company_Pf_Contribution || 0) * 12).toFixed(2)}</td>
              <td>Leave Deduction</td>
              <td>{(LeaveDeduction || 0).toFixed(2)}</td>
              <td>{((LeaveDeduction || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
            </tr>
            {/* <tr>
                <td>Contribution</td>
                <td>3000.00</td>
                <td>36000.00</td>
                <td colSpan="3"></td>
              </tr> */}
            <tr>
              <td>Bonus / Arrears</td>
              <td>{(Bonus || 0).toFixed(2)}</td>
              <td>{((Bonus || 0) * 12).toFixed(2)}</td>
              <td>PF Employee Contribution</td>
              <td>{(PF_contribution_employee || 0).toFixed(2)}</td>
              <td>{((PF_contribution_employee || 0) * 12).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Other Allowance</td>
              <td>{(Other_Allowance || 0).toFixed(2)}</td>
              <td>{((Other_Allowance || 0) * 12).toFixed(2)}</td>
              <td colSpan={3}></td>
            </tr>
            <tr className="summary-row">
              <td><strong>Total Earnings</strong></td>
              <td>{(Total_Earnigs || 0).toFixed(2)}</td>
              <td>{((Total_Earnigs || 0) * 12).toFixed(2)}</td>
              <td><strong>Total Deductions</strong></td>
              <td>{(Gross_deductions || 0).toFixed(2)}</td>
              <td>{((Gross_deductions || 0) * 12).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="net-pay">
          Net Pay: <span className="amount">₹{(Net_Earnings || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PayslipReport;
