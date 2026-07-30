// controllers/dataController.js
const sql = require("mssql");
const connection = require("../connection/connection");
const transporter = require("../mailer");
const { generateOTP } = require("../utils");
const dbConfig = require("../config/dbConfig");
const multer = require("multer");
const CryptoJS = require("crypto-js");
const upload = multer({ storage: multer.memoryStorage() }); //add in top of the datacontroller page
const path = require("path");
const fs = require("fs");
const otpStorage = {};

const uploadImages = async (req, res) => {
  try {
    let fileUrl;

    // Case 1: File uploaded via multer
    if (req.file) {
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }
    // Case 2: Base64 image in request body
    else if (req.body && req.body.base64 && req.body.filename) {
      const { base64, filename } = req.body;

      // Remove metadata prefix if exists
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Save file to uploads folder
      const savePath = path.join(__dirname, "../uploads", filename);
      fs.writeFileSync(savePath, buffer);

      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
    } else {
      return res.status(400).json({ error: "No file or base64 data provided" });
    }

    res.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: "alert@yjktechnologies.com",
    to: email,
    subject: "Login OTP",
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending OTP:", err);
    throw new Error("Error sending OTP");
  }
};

// forget Password handler
const forgetPassword = async (req, res) => {
  const { user_code, email_id } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "VE")
      .input("user_code", sql.NVarChar, user_code)
      .input("email_id", sql.NVarChar, email_id)
      .query(
        `EXEC sp_user_info_hdr @mode,'',@user_code,'','','','','','','',@email_id,'','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    if (result.recordset.length > 0) {
      const otp = generateOTP();
      await sendOTP(email_id, otp);

      otpStorage[email_id] = otp;

      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(401).json({ message: "Email not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Passwords = async (req, res) => {
  const { user_code, email_id, user_password } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "UP")
      .input("user_code", sql.NVarChar, user_code)
      .input("email_id", sql.NVarChar, email_id)
      .input("user_password", sql.NVarChar, user_password)
      .query(
        "EXEC sp_user_info_hdr @mode,'',@user_code,'','','',@user_password,'','','',@email_id,'','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { user_code, user_password } = req.body;
  const secretKey = "yjk26012024";

  try {
    const decryptedUserCode = CryptoJS.AES.decrypt(
      user_code,
      secretKey,
    ).toString(CryptoJS.enc.Utf8);
    const decryptedPassword = CryptoJS.AES.decrypt(
      user_password,
      secretKey,
    ).toString(CryptoJS.enc.Utf8);

    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "LUC")
      .input("user_code", sql.NVarChar, decryptedUserCode)
      .input("user_password", sql.NVarChar, decryptedPassword)
      .query(
        `EXEC sp_user_info_hdr 'LUC','',@user_code,'','','',@user_password,'','','','','','','','','','','','','','','','','','',''`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Signup handler
const signUp = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Check if the user already exists in the database
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("Email", sql.NVarChar, email)
      .query("SELECT * FROM yjk_users WHERE Ymail = @Email");

    if (result.recordset.length === 0) {
      // If user does not exist, generate and send OTP
      const otp = generateOTP();
      await sendOTP(email, otp);

      // Store OTP temporarily for verification
      otpStorage[email] = otp;

      // Proceed with adding user to the database
      await pool
        .request()
        .input("Name", sql.NVarChar, name)
        .input("Email", sql.NVarChar, email)
        .query("INSERT INTO yjk_users (Name, Ymail) VALUES (@Name, @Email)");

      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(401).json({ message: "Existing User" });
    }
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Verify OTP handler
const verifyOtp = (req, res) => {
  const { email_id, enteredOtp } = req.body;

  try {
    const storedOtp = otpStorage[email_id];
    if (storedOtp && storedOtp === enteredOtp) {
      // If OTP is valid, clear the OTP storage
      delete otpStorage[email_id];
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getvariant = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Item_variant','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getuom = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'UOM','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCity = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'city','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCountry = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'country','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getState = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'state','',' ', ' ' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getStatus = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'status','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getShift = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Shift','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getTransaction = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Transaction Type','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getGender = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Gender','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getLoginorout = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Log IN/OUT','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getDeletepermission = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'deletepermission','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getregisterbrand = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Register_brand','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getboolean = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'boolean','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getourbrand = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'our_brand','','', '' , '','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const gethdrcode = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      "EXEC sp_attribute_Info 'TS','','', '','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getUsercode = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_user_info_hdr 'F','','user_code','','','','','','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
    );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getUsertype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'User Type', '','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getscreentype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Sc type', '','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getVendorcodename = async (req, res) => {
  const { vendor_name } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("vendor_name", sql.NVarChar, vendor_name)
      .query(
        "EXEC sp_vendor_info_hdr 'AK','','',@vendor_name,'','','',null,null,null,null,null,null,null,null,null,null,null ",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCompanyno = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_company_info 'F','', ' ', '', '', '', '', '',  '', '' , '', '', '','',  '','','','','','',null,NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL,null,null,null`,
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getLocationno = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      "EXEC sp_location_info 'F','', '', '', '', '', '', '','', '', '', '', '',  0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getvendorcode = async (req, res) => {
  const { company_code } = req.body;
  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();
    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "F")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_vendor_info_hdr @mode,@company_code,'','','','','',null,null,null,null,null,null,null,null,null,null,NULL`,
      );
    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPaytype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'paytype','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPurchasetype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'PurchaseType','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getSalestype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'SalesType','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getordertype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'ORDER TYPE','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getroleid = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_role_info 'F',@company_code,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAllData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query("select * from tbl_company_info_hdr");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getsearchdata = async (req, res) => {
  const { company_no, company_name, city, state, pincode, country, status, company_gst_no, } = req.body;
  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();
    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_no", sql.NVarChar, company_no)
      .input("company_name", sql.NVarChar, company_name)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("company_gst_no", sql.NVarChar, company_gst_no)
      .input("status", sql.NVarChar, status)
      .query(` EXEC sp_company_info @mode,@company_no,@company_name,'','','','',@city,@state,@pincode,@country,'',@status,'','','','','','',@company_gst_no,'','','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL `,
      );
    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addData = async (req, res) => {
  const { company_no, company_name, short_name, address1, address2, address3, city, state, pincode, country, email_id, status, foundedDate, websiteURL, contact_no, annualReportURL,
 location_no, company_gst_no, created_by, modified_by, Keyfield, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;

  let company_logo = req.files["company_logo"]
    ? req.files["company_logo"][0].buffer
    : null;
  let authorisedSignatur = req.files["authorisedSignatur"]
    ? req.files["authorisedSignatur"][0].buffer
    : null;

  try {
    pool = await sql.connect(dbConfig);

    // If the company code doesn't exist, proceed with inserting the data
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_no", sql.NVarChar, company_no)
      .input("company_name", sql.NVarChar, company_name)
      .input("short_name", sql.NVarChar, short_name)
      .input("address1", sql.NVarChar, address1)
      .input("address2", sql.NVarChar, address2)
      .input("address3", sql.NVarChar, address3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("email_id", sql.NVarChar, email_id)
      .input("status", sql.NVarChar, status)
      .input("foundedDate", sql.NVarChar, foundedDate)
      .input("websiteURL", sql.NVarChar, websiteURL)
      .input("company_logo", sql.VarBinary, company_logo)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("annualReportURL", sql.NVarChar, annualReportURL)
      .input("location_no", sql.NVarChar, location_no)
      .input("company_gst_no", sql.NVarChar, company_gst_no)
      .input("authorisedSignatur", sql.VarBinary, authorisedSignatur)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("Keyfield", sql.NVarChar, Keyfield)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_company_info @mode, @company_no, @company_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country, @email_id, 
        @status, @foundedDate, @websiteURL, @company_logo, @contact_no, @annualReportURL,@location_no,@company_gst_no,@authorisedSignatur,@created_by,@modified_by,@keyfield,  
         @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`,);

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const saveEditedData = async (req, res) => {
  const editedData = req.body.editedData;
  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }
  try {
    const pool = await connection.connectToDatabase();
    for (const updatedRow of editedData) {
      const company_logo =
        updatedRow.company_logo && updatedRow.company_logo.type === "Buffer"
          ? Buffer.from(updatedRow.company_logo.data)
          : null;

      const authorisedSignatur =
        updatedRow.authorisedSignatur &&
        updatedRow.authorisedSignatur.type === "Buffer"
          ? Buffer.from(updatedRow.authorisedSignatur.data)
          : null;

      console.log(company_logo);
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_no", updatedRow.company_no)
        .input("company_name", updatedRow.company_name)
        .input("short_name", updatedRow.short_name)
        .input("address1", updatedRow.address1)
        .input("address2", updatedRow.address2)
        .input("address3", updatedRow.address3)
        .input("city", updatedRow.city)
        .input("state", updatedRow.state)
        .input("pincode", updatedRow.pincode)
        .input("country", updatedRow.country)
        .input("email_id", updatedRow.email_id)
        .input("status", updatedRow.status)
        .input("foundedDate", updatedRow.foundedDate)
        .input("websiteURL", updatedRow.websiteURL)
        .input("company_logo", sql.VarBinary(sql.MAX), company_logo)
        .input("contact_no", updatedRow.contact_no)
        .input("annualReportURL", updatedRow.annualReportURL)
        .input("location_no", updatedRow.location_no)
        .input("company_gst_no", updatedRow.company_gst_no)
        .input("authorisedSignatur", sql.VarBinary(sql.MAX), authorisedSignatur)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_company_info @mode, @company_no, @company_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country, @email_id,
           @status, @foundedDate, @websiteURL,@company_logo,@contact_no,@annualReportURL,@location_no,@company_gst_no,@authorisedSignatur,@created_by,@modified_by,'',
           @tempstr1, @tempstr2, @tempstr3, @tempstr4,@datetime1, @datetime2, @datetime3, @datetime4`);
    }
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const deleteData = async (req, res) => {
  const company_nosToDelete = req.body.company_nos;

  if (!company_nosToDelete || !company_nosToDelete.length) {
    res.status(400).json("Invalid or empty company_nos array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const company_no of company_nosToDelete) {
      await pool
        .request()
        .input("company_no", company_no)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .query(`EXEC sp_company_info 'D', @company_no,'','','','','','','','','','','','','','','','',
          '','','','',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
        `);
    }

    res.status(200).json("Companies deleted successfully");
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAlluserData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_user_info_hdr 'A','','','','','','','','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const userAddData = async (req, res) => {
  const { company_code, user_code, user_name, first_name, last_name, user_password, user_status, log_in_out, user_type, email_id, dob, gender,
 role_id, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, super_admin } = req.body;

  let user_img = null;

  if (req.file) {
    user_img = req.file.buffer;
  }

  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("user_name", sql.NVarChar, user_name)
      .input("first_name", sql.NVarChar, first_name)
      .input("last_name", sql.NVarChar, last_name)
      .input("user_password", sql.NVarChar, user_password)
      .input("user_status", sql.NVarChar, user_status)
      .input("log_in_out", sql.NVarChar, log_in_out)
      .input("user_type", sql.NVarChar, user_type)
      .input("email_id", sql.NVarChar, email_id)
      .input("dob", sql.NVarChar, dob)
      .input("gender", sql.NVarChar, gender)
      .input("role_id", sql.NVarChar, role_id)
      .input("user_img", sql.VarBinary, user_img)
      .input("super_admin", sql.NVarChar, super_admin)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_user_info_hdr @mode,@company_code,@user_code,@user_name,@first_name,@last_name,@user_password,@user_status,@log_in_out,@user_type,
        @email_id,@dob,@gender,@role_id,@user_img,@super_admin,@created_by,@modified_by,@tempstr1, @tempstr2, @tempstr3,@tempstr4,@datetime1, @datetime2, @datetime3, @datetime4`);
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      res
        .status(400)
        .json({ message: "User already exists", err: err.message });
    } else {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const UsersaveEditedData = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U") // update mode
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("user_code", sql.NVarChar, updatedRow.user_code)
        .input("user_name", sql.NVarChar, updatedRow.user_name)
        .input("first_name", sql.NVarChar, updatedRow.first_name)
        .input("last_name", sql.NVarChar, updatedRow.last_name)
        .input("user_password", sql.NVarChar, updatedRow.user_password)
        .input("user_status", sql.NVarChar, updatedRow.user_status)
        .input("log_in_out", sql.NVarChar, updatedRow.log_in_out)
        .input("user_type", sql.NVarChar, updatedRow.user_type)
        .input("email_id", sql.NVarChar, updatedRow.email_id)
        .input("dob", sql.NVarChar, updatedRow.dob)
        .input("gender", sql.NVarChar, updatedRow.gender)
        .input("role_id", sql.NVarChar, updatedRow.role_id)
        .input("super_admin", sql.NVarChar, updatedRow.super_admin)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(`EXEC sp_user_info_hdr @mode,@company_code, @user_code, @user_name, @first_name, @last_name, @user_password, @user_status, @log_in_out, @user_type, 
            @email_id, @dob, @gender,@role_id,'',@super_admin, @created_by, @modified_by, @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const UserdeleteData = async (req, res) => {
  const user_codesToDelete = req.body.user_codes;

  if (!user_codesToDelete || !user_codesToDelete.length) {
    res.status(400).json("Invalid or empty user_codes array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const user_code of user_codesToDelete) {
      try {
        await pool
          .request()
          .input("user_code", user_code)
          .input("company_code", sql.NVarChar, req.headers["company_code"])
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(
            `EXEC sp_user_info_hdr 'D',@company_code,@user_code,'','','', '', '', '', '','','', '','','','','', @modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
          );
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(500)
            .json(
              "The user cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("user deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAllWareHouseData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query("select * from tbl_warehouse_info");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAllRoleInfoData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_role_Info 'A','','','','','','','','','','','','','',''`,
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const AddRoleInfoData = async (req, res) => {
  const { company_code, role_id, role_name, description, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4,} = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.NVarChar, role_id)
      .input("role_name", sql.NVarChar, role_name)
      .input("description", sql.NVarChar, description)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_role_info @mode,@company_code, @role_id, @role_name,@description, @created_by,@modified_by,
        @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`);

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: "Role already exists" });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

// update for WareHouse Data
const RolesaveEditedData = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U") // update mode
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("role_id", sql.NVarChar, updatedRow.role_id)
        .input("role_name", sql.NVarChar, updatedRow.role_name)
        .input("description", sql.NVarChar, updatedRow.description)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(
          `EXEC sp_Role_Info @mode,@company_code,@role_id,@role_name,@description,@created_by,@modified_by,@tempstr1,@tempstr2,
          @tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4
          `,
        );
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//ATRRIBUTE HDR SCREEN DATACONTROLLER

//GET ATTRIBUTES HEADER DATA
const getAllattributehdrData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query("select * from tbl_attribute_info_hdr");

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//ADD DATAS IN ATTRIBUTE HEADER TABLE
const addattrihdrData = async (req, res) => {
  const { company_code, attributeheader_code, attributeheader_name, status, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributeheader_name", sql.NVarChar, attributeheader_name)
      .input("status", sql.NVarChar, status)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(
        `EXEC sp_attribute_hdr @mode,@company_code,@attributeheader_code,@attributeheader_name,@status,@created_by,@modified_by,@tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

//GET ATTRIBUTES HEADER DATA
const getAllattributedetData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result =
      await sql.query(`EXEC sp_attribute_info 'A','','', '','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//ADD DATAS IN ATTRIBUTE DETAILS TABLE
const addattridetData = async (req, res) => {
  const { company_code, attributeheader_code, attributedetails_code, attributedetails_name, descriptions, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;

  try {
    // Input validation
    if (!attributeheader_code) {
      return res
        .status(400)
        .json({ error: "Attribute Header Code cannot be blank" });
    }

    // Establish connection to the database
    const pool = await sql.connect(dbConfig);

    // Execute the stored procedure
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributedetails_code", sql.NVarChar, attributedetails_code)
      .input("attributedetails_name", sql.NVarChar, attributedetails_name)
      .input("descriptions", sql.NVarChar, descriptions)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_attribute_Info @mode,@company_code,@attributeheader_code, @attributedetails_code,@attributedetails_name,@descriptions,@created_by,@modified_by,@tempstr1, @tempstr2, @tempstr3, @tempstr4, 
        @datetime1, @datetime2, @datetime3, @datetime4`,
      );
    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: err.message });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const deleteAttriDetailData = async (req, res) => {
  const { attributeheader_codesToDelete, attributedetails_codeToDelete } =
    req.body;

  if (
    !attributeheader_codesToDelete ||
    !attributeheader_codesToDelete.length ||
    !attributedetails_codeToDelete ||
    !attributedetails_codeToDelete.length
  ) {
    res.status(400).json("Invalid or empty Codes or codeDetails array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    const deleteQuery = `EXEC sp_attribute_Info 'D',@company_code,@attributeheader_code, @attributedetails_code,'','','',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
    `;
    for (let i = 0; i < attributeheader_codesToDelete.length; i++) {
      try {
        await pool
          .request()
          .input("attributeheader_code", attributeheader_codesToDelete[i])
          .input("attributedetails_code", attributedetails_codeToDelete[i])
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .input("company_code", sql.NVarChar, req.headers["company_code"])
          .query(deleteQuery);
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The attribute cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("Attribute data deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updattridetData = async (req, res) => {
  const {
    attributeheader_codesToUpdate,
    attributedetails_codesToUpdate,
    updatedData,
  } = req.body;

  if (
    !attributeheader_codesToUpdate ||
    !attributeheader_codesToUpdate.length ||
    !attributedetails_codesToUpdate ||
    !attributedetails_codesToUpdate.length ||
    !updatedData ||
    !updatedData.length
  ) {
    res.status(400).json("Invalid or empty input data.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (let i = 0; i < attributeheader_codesToUpdate.length; i++) {
      const updatedRow = updatedData[i]; // Assuming updatedData is an array of objects with updated values

      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("attributeheader_code", attributeheader_codesToUpdate[i])
        .input("attributedetails_code", attributedetails_codesToUpdate[i])
        .input("attributedetails_name", sql.NVarChar, updatedRow.attributedetails_name,)
        .input("descriptions", sql.NVarChar, updatedRow.descriptions)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(`EXEC sp_attribute_Info @mode,@company_code, @attributeheader_code, @attributedetails_code, @attributedetails_name, @descriptions, @created_by,@modified_by, @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`,
        );
    }

    res.status(200).json("Updated data successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//VENDOR HRD INFO //

const addVendorHdrData = async (req, res) => {
  const { company_code, vendor_code, vendor_name, status, vendor_logo, panno, vendor_gst_no, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4,} = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("vendor_code", sql.NVarChar, vendor_code)
      .input("vendor_name", sql.NVarChar, vendor_name)
      .input("status", sql.NVarChar, status)
      .input("vendor_logo", sql.NVarChar, vendor_logo)
      .input("panno", sql.NVarChar, panno)
      .input("vendor_gst_no", sql.NVarChar, vendor_gst_no)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_vendor_info_hdr @mode,@company_code,@vendor_code, @vendor_name, @status,'',@panno,@vendor_gst_no,@created_by,@modified_by,
        @tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
      );
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const getAllVendorHdrData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_vendor_info_hdr 'A','','','','','','','','','',null,null,null,null,null,null,null,null`,
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error ", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// VENDOR DET INFO//
const getAllVendorDetData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result =
      await sql.query(`EXEC sp_vendor_details_info_hdr 'A','','','','','','','','','','','','' ,'','','',
      '','','','',0,'','','','','','','','','',NULL,NULL,NULL,null,null,null,null,null`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addVendorDetData = async (req, res) => {
  const { vendor_code, company_code, vendor_name, status, panno, vendor_gst_no, vendor_addr_1, vendor_addr_2, vendor_addr_3, vendor_addr_4, vendor_area_code, vendor_state_code, vendor_country_code, vendor_imex_no, vendor_office_no, vendor_resi_no, vendor_mobile_no, vendor_fax_no, vendor_email_id, vendor_credit_limit,
  vendor_transport_code, vendor_salesman_code, vendor_broker_code, vendor_weekday_code, contact_person, office_type, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2,
  datetime3, datetime4,} = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("vendor_code", sql.VarChar, vendor_code)
      .input("company_code", sql.NVarChar, company_code)
      .input("vendor_name", sql.NVarChar, vendor_name)
      .input("status", sql.NVarChar, status)
      .input("panno", sql.NVarChar, panno)
      .input("vendor_gst_no", sql.NVarChar, vendor_gst_no)
      .input("vendor_addr_1", sql.VarChar, vendor_addr_1)
      .input("vendor_addr_2", sql.VarChar, vendor_addr_2)
      .input("vendor_addr_3", sql.VarChar, vendor_addr_3)
      .input("vendor_addr_4", sql.VarChar, vendor_addr_4)
      .input("vendor_area_code", sql.VarChar, vendor_area_code)
      .input("vendor_state_code", sql.VarChar, vendor_state_code)
      .input("vendor_country_code", sql.VarChar, vendor_country_code)
      .input("vendor_imex_no", sql.NVarChar, vendor_imex_no)
      .input("vendor_office_no", sql.NVarChar, vendor_office_no)
      .input("vendor_resi_no", sql.NVarChar, vendor_resi_no)
      .input("vendor_mobile_no", sql.NVarChar, vendor_mobile_no)
      .input("vendor_fax_no", sql.NVarChar, vendor_fax_no)
      .input("vendor_email_id", sql.NVarChar, vendor_email_id)
      .input("vendor_credit_limit", sql.Decimal(14, 3), vendor_credit_limit)
      .input("vendor_transport_code", sql.NVarChar, vendor_transport_code)
      .input("vendor_salesman_code", sql.NVarChar, vendor_salesman_code)
      .input("vendor_broker_code", sql.NVarChar, vendor_broker_code)
      .input("vendor_weekday_code", sql.NVarChar, vendor_weekday_code)
      .input("contact_person", sql.NVarChar, contact_person)
      .input("office_type", sql.NVarChar, office_type)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_vendor_details_info_hdr @mode, @vendor_code, @company_code, '', '', '', '', @vendor_addr_1, @vendor_addr_2,
        @vendor_addr_3, @vendor_addr_4, @vendor_area_code, @vendor_state_code, @vendor_country_code, @vendor_imex_no, @vendor_office_no, @vendor_resi_no, @vendor_mobile_no,
         @vendor_fax_no, @vendor_email_id, @vendor_credit_limit, @vendor_transport_code, @vendor_salesman_code, @vendor_broker_code, @vendor_weekday_code, @contact_person,@office_type,'',@created_by, @modified_by,
          @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`,
      );
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updvendordetData = async (req, res) => {
  const { vendor_codesToUpdate, company_codesToUpdate, updatedData } = req.body;

  if (
    !vendor_codesToUpdate ||
    !vendor_codesToUpdate.length ||
    !company_codesToUpdate ||
    !company_codesToUpdate.length ||
    !updatedData ||
    !updatedData.length
  ) {
    return res.status(400).json("Invalid or empty input data.");
  }

  try {
    const pool = await connection.connectToDatabase();

    for (let i = 0; i < vendor_codesToUpdate.length; i++) {
      const updatedRow = updatedData[i]; // Assuming updatedData is an array of objects with updated values

      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("vendor_code", vendor_codesToUpdate[i])
        .input("company_code", company_codesToUpdate[i])
        .input("vendor_name", sql.NVarChar, updatedRow.vendor_name)
        .input("status", sql.NVarChar, updatedRow.status)
        .input("panno", sql.NVarChar, updatedRow.panno)
        .input("vendor_gst_no", sql.NVarChar, updatedRow.vendor_gst_no)
        .input("vendor_addr_1", sql.NVarChar, updatedRow.vendor_addr_1)
        .input("vendor_addr_2", sql.NVarChar, updatedRow.vendor_addr_2)
        .input("vendor_addr_3", sql.NVarChar, updatedRow.vendor_addr_3)
        .input("vendor_addr_4", sql.NVarChar, updatedRow.vendor_addr_4)
        .input("vendor_area_code", sql.NVarChar, updatedRow.vendor_area_code)
        .input("vendor_state_code", sql.NVarChar, updatedRow.vendor_state_code)
        .input("vendor_country_code", sql.NVarChar, updatedRow.vendor_country_code,)
        .input("vendor_imex_no", sql.NVarChar, updatedRow.vendor_imex_no)
        .input("vendor_office_no", sql.NVarChar, updatedRow.vendor_office_no)
        .input("vendor_resi_no", sql.NVarChar, updatedRow.vendor_resi_no)
        .input("vendor_mobile_no", sql.NVarChar, updatedRow.vendor_mobile_no)
        .input("vendor_fax_no", sql.NVarChar, updatedRow.vendor_fax_no)
        .input("vendor_email_id", sql.NVarChar, updatedRow.vendor_email_id)
        .input("vendor_credit_limit", sql.Decimal(14, 3), updatedRow.vendor_credit_limit,)
        .input("vendor_transport_code", sql.NVarChar, updatedRow.vendor_transport_code,)
        .input("vendor_salesman_code", sql.NVarChar, updatedRow.vendor_salesman_code,)
        .input("vendor_broker_code", sql.NVarChar, updatedRow.vendor_broker_code,)
        .input("vendor_weekday_code", sql.NVarChar, updatedRow.vendor_weekday_code,)
        .input("contact_person", sql.NVarChar, updatedRow.contact_person)
        .input("office_type", sql.NVarChar, updatedRow.office_type)
        .input("keyfield", sql.NVarChar, updatedRow.keyfield)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(`EXEC sp_vendor_details_info_hdr @mode,@vendor_code,@company_code,@vendor_name,@status,@panno,@vendor_gst_no,@vendor_addr_1,@vendor_addr_2,@vendor_addr_3,
            @vendor_addr_4,@vendor_area_code,@vendor_state_code ,@vendor_country_code,@vendor_imex_no,@vendor_office_no,@vendor_resi_no,@vendor_mobile_no,@vendor_fax_no,@vendor_email_id,
            @vendor_credit_limit,@vendor_transport_code,@vendor_salesman_code,@vendor_broker_code,@vendor_weekday_code, @contact_person,@office_type,@keyfield,@created_by, @modified_by, @tempstr1, @tempstr2, @tempstr3, @tempstr4,
             @datetime1, @datetime2, @datetime3, @datetime4`,
        );
    }

    res.status(200).json("Updated data successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const VendordeleteData = async (req, res) => {
  const { keyfieldsToDelete } = req.body;

  if (!keyfieldsToDelete || !keyfieldsToDelete.length) {
    res.status(400).json("Invalid or empty Codes or codeDetails array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    const deleteQuery = `EXEC sp_vendor_details_info_hdr 'D','',@company_code,'','','','','','','','','','' ,'','','','','','','',0,
      '','','','','','',@keyfield,'',@modified_by,NULL,NULL,NULL,null,null,null,null,null
      `;
    for (let i = 0; i < keyfieldsToDelete.length; i++) {
      await pool
        .request()
        .input("keyfield", keyfieldsToDelete[i])
        .input("company_code", sql.NVarChar, req.headers["company-code"])
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .query(deleteQuery);
    }

    res.status(200).json("Vendor data deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Dhana create on : 02may2024 COMPANY MAPPING//
const getAllCompanyMappingData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result =
      await sql.query(`EXEC sp_user_company_mapping 'I','','','','','',0,'','','',
      NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const addCompanyMappingData = async (req, res) => {
  const { company_code, user_code, company_no, location_no, status, order_no, created_by, modified_by,
    tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.VarChar, user_code)
      .input("company_no", sql.NVarChar, company_no)
      .input("location_no", sql.VarChar, location_no)
      .input("status", sql.VarChar, status)
      .input("order_no", sql.Int, order_no)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_user_company_mapping @mode,@company_code,@user_code,@company_no,@location_no,@status,@order_no,'',@created_by,@modified_by,
        @tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: err.message });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const getAllUserRoleMappingData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_user_rolemapping 'A','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addUserRoleMappingData = async (req, res) => {
  const { company_code, user_code, role_id, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.VarChar, user_code)
      .input("role_id", sql.NVarChar, role_id)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_user_rolemapping @mode,@company_code, @user_code,'',@role_id,'','',@created_by,@modified_by,
        @tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
      );

    res.json({ success: true, message: "Data inserted successfully" });
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: "User & Role already exists" });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const getlocationsearchdata = async (req, res) => {
  const { company_code, location_no, location_name, city, state, pincode, country, status,  } = req.body
  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("location_no", sql.NVarChar, location_no)
      .input("location_name", sql.NVarChar, location_name)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("status", sql.NVarChar, status)
      .query(` EXEC sp_location_info @mode,@location_no,@location_name, '', '', '', '', @city,@state, @pincode, @country, '', 
        @status, '', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL `);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addlocationinfo = async (req, res) => {
  const { location_no, location_name, short_name, address1, address2, address3, city, state, pincode, country, email_id, status,
    contact_no, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;

  let pool;
  try {
    pool = await sql.connect(dbConfig);

    // If the company code doesn't exist, proceed with inserting the data
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("location_no", sql.NVarChar, location_no)
      .input("location_name", sql.NVarChar, location_name)
      .input("short_name", sql.NVarChar, short_name)
      .input("address1", sql.NVarChar, address1)
      .input("address2", sql.NVarChar, address2)
      .input("address3", sql.NVarChar, address3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("email_id", sql.NVarChar, email_id)
      .input("status", sql.NVarChar, status)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_location_info @mode,@location_no, @location_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country, @email_id, 
      @status,  @contact_no, @created_by,@modified_by,@tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`,);

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: "Location already exists" });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const locationsaveEditedData = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("location_no", updatedRow.location_no)
        .input("location_name", updatedRow.location_name)
        .input("short_name", updatedRow.short_name)
        .input("address1", updatedRow.address1)
        .input("address2", updatedRow.address2)
        .input("address3", updatedRow.address3)
        .input("city", updatedRow.city)
        .input("state", updatedRow.state)
        .input("pincode", updatedRow.pincode)
        .input("country", updatedRow.country)
        .input("email_id", updatedRow.email_id)
        .input("status", updatedRow.status)
        .input("contact_no", updatedRow.contact_no)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_location_info @mode,@location_no, @location_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, 
          @country, @email_id,  @status, @contact_no, @created_by, @modified_by , @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const locationdeleteData = async (req, res) => {
  const location_nosToDelete = req.body.location_nos;

  if (!location_nosToDelete || !location_nosToDelete.length) {
    res.status(400).json("Invalid or empty location no's array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const location_no of location_nosToDelete) {
      try {
        await pool
          .request()
          .input("location_no", location_no)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(`EXEC sp_location_info 'D',@location_no, '', '', '', '', '', '', '', '', '', '','',  '', '',@modified_by,
       NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL`);
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The location cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("Companies deleted successfully");
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getUserrolesearchdata = async (req, res) => {
  const { company_code, user_code, user_name, role_id, role_name } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("user_name", sql.NVarChar, user_name)
      .input("role_id", sql.NVarChar, role_id)
      .input("role_name", sql.NVarChar, role_name)
      .query(`EXEC sp_user_rolemapping @mode,@company_code,@user_code,@user_name,@role_id,@role_name,'','','',
      null,null,null,null,null,null,null,null `);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getUsersearchdata = async (req, res) => {
  const { company_code, user_code, user_name, first_name, last_name, user_status, email_id, dob, gender, role_id, created_by, } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("user_name", sql.NVarChar, user_name)
      .input("first_name", sql.NVarChar, first_name)
      .input("last_name", sql.NVarChar, last_name)
      .input("user_status", sql.NVarChar, user_status)
      .input("email_id", sql.NVarChar, email_id)
      .input("dob", sql.NVarChar, dob)
      .input("gender", sql.NVarChar, gender)
      .input("role_id", sql.NVarChar, role_id)
      .input("created_by", sql.NVarChar, created_by)
      .query(`EXEC sp_user_info_hdr @mode,@company_code,@user_code,@user_name,@first_name,@last_name,'',@user_status,'','',@email_id,@dob,@gender,@role_id,'','',@created_by,'','','','','','','','',''`,
      );

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getRolesearchdata = async (req, res) => {
  const { company_code, role_id, role_name } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.NVarChar, role_id)
      .input("role_name", sql.NVarChar, role_name)
      .query(`EXEC sp_Role_Info @mode,@company_code,@role_id,@role_name,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const roledeleteData = async (req, res) => {
  const role_idsToDelete = req.body.role_ids;

  if (!role_idsToDelete || !role_idsToDelete.length) {
    res.status(400).json("Invalid or empty RoleID array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const role_id of role_idsToDelete) {
      try {
        await pool
          .request()
          .input("role_id", role_id)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .input("company_code", sql.NVarChar, req.headers["company_code"])
          .query(`EXEC sp_Role_Info 'D',@company_code,@role_id,'','','',@modified_by,NULL, NULL, NULL, NULL,NULL, NULL, NULL, NULL`);
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The role cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("User deleted successfully");
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getvendorSearchdata = async (req, res) => {
  const { company_code, vendor_code, vendor_name, panno, vendor_gst_no, vendor_addr_1, vendor_area_code, vendor_state_code, vendor_country_code, vendor_mobile_no, status, } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("vendor_code", sql.NVarChar, vendor_code)
      .input("vendor_name", sql.NVarChar, vendor_name)
      .input("status", sql.NVarChar, status)
      .input("panno", sql.NVarChar, panno)
      .input("vendor_gst_no", sql.NVarChar, vendor_gst_no)
      .input("vendor_addr_1", sql.NVarChar, vendor_addr_1)
      .input("vendor_area_code", sql.NVarChar, vendor_area_code)
      .input("vendor_state_code", sql.NVarChar, vendor_state_code)
      .input("vendor_country_code", sql.NVarChar, vendor_country_code)
      .input("vendor_mobile_no", sql.NVarChar, vendor_mobile_no)
      .query(`EXEC sp_vendor_details_info_hdr @mode,@vendor_code,@company_code,@vendor_name,@status,@panno,@vendor_gst_no,@vendor_addr_1,'','','',@vendor_area_code,@vendor_state_code,
        @vendor_country_code,'','','',@vendor_mobile_no,'' ,'',0,'','','','','','','','','',NULL,NULL,NULL,NULL,NULL,null,null,null`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPartyCode = async (req, res) => {
  const { company_code, vendor_code } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "VCS")
      .input("company_code", sql.NVarChar, company_code)
      .input("vendor_code", sql.NVarChar, vendor_code)
      .query(`EXEC sp_vendor_details_info_hdr @mode,@vendor_code,@company_code,'','','','','','','','','','' ,'','','','','','','',0,'','','','','','','','','',NULL,null,null,null,null,null,null,null`,
      );

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getcompanymappingsearchdata = async (req, res) => {
  const { company_code, user_code, company_no, location_no, status } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("company_no", sql.NVarChar, company_no)
      .input("location_no", sql.NVarChar, location_no)
      .input("status", sql.NVarChar, status)
      .query(`EXEC sp_user_company_mapping @mode,@company_code,@user_code,@company_no,@location_no,@status,0,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getattributeSearchdata = async (req, res) => {
  const { company_code, attributeheader_code, attributedetails_code, attributedetails_name, descriptions, } = req.body
  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributedetails_code", sql.NVarChar, attributedetails_code)
      .input("attributedetails_name", sql.NVarChar, attributedetails_name)
      .input("descriptions", sql.NVarChar, descriptions)
      .query(`EXEC sp_attribute_Info 'SC',@company_code,@attributeheader_code,@attributedetails_code,@attributedetails_name,@descriptions,'','','','','','','','','',''`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by dhana
const gettranstype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query("EXEC sp_attribute_Info 'F',@company_code,'TRANSATION','','', '','','' , NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//NUMBERSERIES

const getAllNumberseries = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result =
      await sql.query(`EXEC sp_numberseries 'A','','','','',0,0,0,'','','','','',null,null,null,null,null,null,null,null,''`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//ADD DATAS IN Intermediary  DETAILS  TABLE
const addNumberseries = async (req, res) => {
  const { company_code, Screen_Type, Start_Year, End_Year, Start_No, Running_No, End_No, comtext, number_prefix, status, created_by, modified_by,
    tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("Screen_Type", sql.NVarChar, Screen_Type)
      .input("Start_Year", sql.Date, Start_Year)
      .input("End_Year", sql.Date, End_Year)
      .input("Start_No", sql.Int, Start_No)
      .input("Running_No", sql.Int, Running_No)
      .input("End_No", sql.Int, End_No)
      .input("comtext", sql.NVarChar, comtext)
      .input("number_prefix", sql.NVarChar, number_prefix)
      .input("Status", sql.NVarChar, status)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_numberseries @mode,@company_code,@Screen_Type,@Start_Year,@End_Year,@Start_No,@Running_No,@End_No,@comtext,@number_prefix,@Status,
                     @created_by,@modified_by, @tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4,''`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: err.message });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const getnumberseriessearchdata = async (req, res) => {
  const { company_code, Screen_Type } = req.body; // Extract Screen_Type from req.body

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("Screen_Type", sql.NVarChar, Screen_Type) // Correct parameter name
      .query(`EXEC sp_numberseries @mode,@company_code,@Screen_Type,'','',0,0,0,'','','','','',
                         null,null,null,null,null,null,null,null,''`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const saveEditedNumberseriesData = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", updatedRow.company_code)
        .input("Screen_Type", updatedRow.Screen_Type)
        .input("Start_Year", updatedRow.Start_Year)
        .input("End_Year", updatedRow.End_Year)
        .input("Start_No", updatedRow.Start_No)
        .input("Running_No", updatedRow.Running_No)
        .input("End_No", updatedRow.End_No)
        .input("comtext", updatedRow.comtext)
        .input("number_prefix", updatedRow.number_prefix)
        .input("Status", updatedRow.Status)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_numberseries @mode, @company_code,@Screen_Type, @Start_Year, @End_Year, @Start_No, @Running_No, @End_No,@comtext,@number_prefix,@Status,
        @created_by,@modified_by,@tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4,''`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by harish kumar on 07/03/2024//
const getusercompany = async (req, res) => {
  const { user_code } = req.body;
  let pool;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "UCL") // Insert mode
      .input("user_code", sql.NVarChar, user_code)
      .query(
        `EXEC sp_user_company_mapping @mode,'',@user_code,'','','',0,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,);
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// code ended by harishkumar  07/03/2024

const numberseriesdeleteData = async (req, res) => {
  const Screen_TypesToDelete = req.body.Screen_TypesToDelete;

  if (!Screen_TypesToDelete || !Screen_TypesToDelete.length) {
    res.status(400).json("Invalid or empty company_nos array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const updatedRow of Screen_TypesToDelete) {
      try {
        await pool
          .request()
          .input("Screen_Type", updatedRow.Screen_Type)
          .input("Start_Year", updatedRow.Start_Year)
          .input("End_Year", updatedRow.End_Year)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .input("company_code", sql.NVarChar, req.headers["company_code"])
          .query(`EXEC sp_numberseries 'D',@company_code,@Screen_Type,@Start_Year,@End_Year,0,0,0,'','','','',@modified_by, null,null,null,null,null,null,null,null,''`,);
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The number series cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("Number series deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updcompanymapping = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("user_code", updatedRow.user_code)
        .input("company_no", updatedRow.company_no)
        .input("location_no", updatedRow.location_no)
        .input("status", updatedRow.status)
        .input("order_no", updatedRow.order_no)
        .input("keyfiels", updatedRow.keyfiels)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_user_company_mapping @mode, @company_code, @user_code, @company_no, @location_no, @status, @order_no,@keyfiels,@created_by,@modified_by,
         @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const commappingdeleteData = async (req, res) => {
  const keyfielsToDelete = req.body.keyfiels;

  try {
    const pool = await connection.connectToDatabase();

    for (const keyfiels of keyfielsToDelete) {
      try {
        await pool
          .request()
          .input("keyfiels", keyfiels)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(`EXEC sp_user_company_mapping 'D','','','','001','',0,@keyfiels,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);
      } catch (err) {
        if (err.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The user rights cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw err; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("User and company mapping data deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by harish kum,ar on 07/04/2024 code ends//

const getAlluserscreenmap = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result =
      await sql.query(`EXEC sp_rolescreen_mapping 'A','','','','','','','', null,null,null,null,null,null,null,null `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const adduserscreenmap = async (req, res) => {
  const { company_code, role_id, screen_type, permission_type, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.VarChar, role_id)
      .input("screen_type", sql.NVarChar, screen_type)
      .input("permission_type", sql.VarChar, permission_type)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_rolescreen_mapping @mode, @company_code,@role_id, @screen_type,@permission_type,'',@created_by,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,);
    res.json({ success: true, message: "Data inserted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//USER SCREEN MAPPING UPDATE 06/07/2024 DHANA//
const saveEditeduserscreenmap = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", updatedRow.company_code)
        .input("role_id", updatedRow.role_id)
        .input("screen_type", updatedRow.screen_type)
        .input("permission_type", updatedRow.permission_type)
        .input("keyfield", updatedRow.keyfield)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_rolescreen_mapping @mode,@company_code, @role_id, @screen_type, @permission_type, @keyfield,'', @modified_by,  @tempstr1, @tempstr2, @tempstr3, @tempstr4, 
              @datetime1, @datetime2, @datetime3, @datetime4`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//USER SCREEN MAPPING DELETE 06/07/2024 DHANA//
const userscreenmapdeleteData = async (req, res) => {
  const keyfieldsToDelete = req.body.keyfield;

  // if (!keyfieldsToDelete || !keyfieldsToDelete.length) {
  //   res.status(400).json("Invalid or empty company_nos array.");
  //   return;
  // }

  try {
    const pool = await connection.connectToDatabase();

    for (const keyfield of keyfieldsToDelete) {
      try {
        await pool
          .request()
          .input("keyfield", keyfield)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(
            `EXEC sp_rolescreen_mapping 'D','','','','',@keyfield,'',@modified_by,null,null,null,null,null,null,null,null`,
          );
      } catch (error) {
        if (error.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The user rights cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw error; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("User screen mapping deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getuserscreensearchdata = async (req, res) => {
  const { company_code, role_id, screen_type, permission_type } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.VarChar, company_code)
      .input("role_id", sql.VarChar, role_id)
      .input("screen_type", sql.NVarChar, screen_type)
      .input("permission_type", sql.NVarChar, permission_type)
      .query(`EXEC sp_rolescreen_mapping @mode,@company_code,@role_id,@screen_type,@permission_type,'','','',null,null,null,null,null,null,null,null`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//DROPDOWN FOR USER SCREEN MAPPING 06/07/2024 DHANA

const getScreens = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Screens','',' ', ' ','','' , NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPermissions = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Permissions','',' ', ' ' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAllcustomerhdr = async (req, res) => {
  const { company_code } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "A")
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_customer_info_hdr 'A',@company_code,'','','','','','','','',null, null,null,null,null,null,null,null`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addcustomerhdr = async (req, res) => {
  const { company_code, customer_code, customer_name, status, customer_logo, panno, customer_gst_no, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("customer_code", sql.NVarChar, customer_code)
      .input("customer_name", sql.NVarChar, customer_name)
      .input("status", sql.NVarChar, status)
      .input("customer_logo", sql.NVarChar, customer_logo)
      .input("panno", sql.NVarChar, panno)
      .input("customer_gst_no", sql.NVarChar, customer_gst_no)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_customer_info_hdr @mode,@company_code,@customer_code, @customer_name, @status,'',@panno,@customer_gst_no,@created_by,@modified_by,
      @tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,);
    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: err.message });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

// CUSTOMER DET INFO//
const getAllCustomerDetData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result =
      await sql.query(`EXEC sp_customer_details_info 'A','','','','','','','','','','','','',
       '','','','','','','',0,'','','','','','','','','','',NULL,NULL,NULL,null,null,null,null,null`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addCustomerDetData = async (req, res) => {
  const { customer_code, company_code, customer_name, status, panno, customer_gst_no, customer_addr_1, customer_addr_2, customer_addr_3, customer_addr_4, customer_area, customer_state, customer_country, customer_imex_no, customer_office_no, customer_resi_no, customer_mobile_no, customer_fax_no, customer_email_id, customer_credit_limit, customer_transport_code, customer_salesman_code, customer_broker_code, customer_weekday_code,
    contact_person, office_type, default_customer, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body
  let pool;
  try {
    pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("customer_code", sql.VarChar, customer_code)
      .input("company_code", sql.NVarChar, company_code)
      .input("customer_name", sql.NVarChar, customer_name)
      .input("status", sql.NVarChar, status)
      .input("panno", sql.NVarChar, panno)
      .input("customer_gst_no", sql.NVarChar, customer_gst_no)
      .input("customer_addr_1", sql.VarChar, customer_addr_1)
      .input("customer_addr_2", sql.VarChar, customer_addr_2)
      .input("customer_addr_3", sql.VarChar, customer_addr_3)
      .input("customer_addr_4", sql.VarChar, customer_addr_4)
      .input("customer_area", sql.VarChar, customer_area)
      .input("customer_state", sql.VarChar, customer_state)
      .input("customer_country", sql.VarChar, customer_country)
      .input("customer_imex_no", sql.NVarChar, customer_imex_no)
      .input("customer_office_no", sql.NVarChar, customer_office_no)
      .input("customer_resi_no", sql.NVarChar, customer_resi_no)
      .input("customer_mobile_no", sql.NVarChar, customer_mobile_no)
      .input("customer_fax_no", sql.NVarChar, customer_fax_no)
      .input("customer_email_id", sql.NVarChar, customer_email_id)
      .input("customer_credit_limit", sql.Decimal(14, 3), customer_credit_limit)
      .input("customer_transport_code", sql.NVarChar, customer_transport_code)
      .input("customer_salesman_code", sql.NVarChar, customer_salesman_code)
      .input("customer_broker_code", sql.NVarChar, customer_broker_code)
      .input("customer_weekday_code", sql.NVarChar, customer_weekday_code)
      .input("contact_person", sql.NVarChar, contact_person)
      .input("office_type", sql.NVarChar, office_type)
      .input("default_customer", sql.NVarChar, default_customer)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_customer_details_info @mode, @customer_code, @company_code, '', '', '', '', @customer_addr_1, @customer_addr_2, @customer_addr_3, @customer_addr_4,@customer_area,
        @customer_state, @customer_country, @customer_imex_no, @customer_office_no, @customer_resi_no, @customer_mobile_no, @customer_fax_no, @customer_email_id, 
         @customer_credit_limit, @customer_transport_code, @customer_salesman_code, @customer_broker_code, @customer_weekday_code, @contact_person,@office_type,@default_customer,'',@created_by, @modified_by,
          @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

// CUSTOMER UPDATE 07/07/2024 DHANA //
const updcustomerdetData = async (req, res) => {
  const { customer_codesToUpdate, company_codesToUpdate, updatedData } =
    req.body;

  if (
    !customer_codesToUpdate ||
    !customer_codesToUpdate.length ||
    !company_codesToUpdate ||
    !company_codesToUpdate.length ||
    !updatedData ||
    !updatedData.length
  ) {
    return res.status(400).json("Invalid or empty input data.");
  }

  try {
    const pool = await connection.connectToDatabase();

    for (let i = 0; i < customer_codesToUpdate.length; i++) {
      const updatedRow = updatedData[i]; // Assuming updatedData is an array of objects with updated values

      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("customer_code", customer_codesToUpdate[i])
        .input("company_code", company_codesToUpdate[i])
        .input("customer_name", sql.NVarChar, updatedRow.vendor_name)
        .input("status", sql.NVarChar, updatedRow.status)
        .input("panno", sql.NVarChar, updatedRow.panno)
        .input("customer_gst_no", sql.NVarChar, updatedRow.customer_gst_no)
        .input("customer_addr_1", sql.NVarChar, updatedRow.customer_addr_1)
        .input("customer_addr_2", sql.NVarChar, updatedRow.customer_addr_2)
        .input("customer_addr_3", sql.NVarChar, updatedRow.customer_addr_3)
        .input("customer_addr_4", sql.NVarChar, updatedRow.customer_addr_4)
        .input("customer_area", sql.NVarChar, updatedRow.customer_area)
        .input("customer_state", sql.NVarChar, updatedRow.customer_state)
        .input("customer_country", sql.NVarChar, updatedRow.customer_country)
        .input("customer_imex_no", sql.NVarChar, updatedRow.customer_imex_no)
        .input("customer_office_no", sql.NVarChar, updatedRow.customer_office_no,)
        .input("customer_resi_no", sql.NVarChar, updatedRow.customer_resi_no)
        .input("customer_mobile_no", sql.NVarChar, updatedRow.customer_mobile_no,)
        .input("customer_fax_no", sql.NVarChar, updatedRow.customer_fax_no)
        .input("customer_email_id", sql.NVarChar, updatedRow.customer_email_id)
        .input("customer_credit_limit", sql.Decimal(14, 3), updatedRow.customer_credit_limit,)
        .input("customer_transport_code", sql.NVarChar, updatedRow.customer_transport_code,)
        .input("customer_salesman_code", sql.NVarChar, updatedRow.customer_salesman_code,)
        .input("customer_broker_code", sql.NVarChar, updatedRow.customer_broker_code,)
        .input("customer_weekday_code", sql.NVarChar, updatedRow.customer_weekday_code,)
        .input("contact_person", sql.NVarChar, updatedRow.contact_person)
        .input("office_type", sql.NVarChar, updatedRow.office_type)
        .input("default_customer", sql.NVarChar, updatedRow.default_customer)
        .input("keyfield", sql.NVarChar, updatedRow.keyfield)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(`EXEC sp_customer_details_info @mode,@customer_code,@company_code,@customer_name,@status,@panno,@customer_gst_no,
            @customer_addr_1,@customer_addr_2,@customer_addr_3,@customer_addr_4,@customer_area,@customer_state ,@customer_country,
            @customer_imex_no,@customer_office_no,@customer_resi_no,@customer_mobile_no,@customer_fax_no,@customer_email_id,@customer_credit_limit,@customer_transport_code,
            @customer_salesman_code,@customer_broker_code,@customer_weekday_code,@contact_person,@office_type,@default_customer, @keyfield,@created_by, @modified_by, @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1,
            @datetime2, @datetime3, @datetime4`,);
    }

    res.status(200).json("Updated data successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// CUSTOMER SEARCH CRITERIA 07/07/2024 DHANA //
const customerSearchdata = async (req, res) => {
  const { company_code, customer_code, customer_name, panno, customer_gst_no, customer_addr_1, customer_area, customer_state, customer_country, customer_mobile_no, status, default_customer, } = req.body
  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("customer_code", sql.NVarChar, customer_code)
      .input("customer_name", sql.NVarChar, customer_name)
      .input("status", sql.NVarChar, status)
      .input("panno", sql.NVarChar, panno)
      .input("customer_gst_no", sql.NVarChar, customer_gst_no)
      .input("customer_addr_1", sql.NVarChar, customer_addr_1)
      .input("customer_area", sql.NVarChar, customer_area)
      .input("customer_state", sql.NVarChar, customer_state)
      .input("customer_country", sql.NVarChar, customer_country)
      .input("customer_mobile_no", sql.NVarChar, customer_mobile_no)
      .input("default_customer", sql.NVarChar, default_customer)
      .query(`EXEC sp_customer_details_info @mode,@customer_code,@company_code,@customer_name,@status,@panno,@customer_gst_no,@customer_addr_1,'','','',@customer_area,@customer_state,
      @customer_country,'','','',@customer_mobile_no,'' ,'',0,'','','','','','',@default_customer,'','','',NULL,NULL,NULL,NULL,NULL,null,null,null`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getcustomercode = async (req, res) => {
  const { company_code } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "F")
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_customer_info_hdr @mode,@company_code,'','','','','','','','',null, null,null,null,null,null,null,null`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// CUSTOMER DELETE 07/07/2024 DHANA //

const customerdeleteData = async (req, res) => {
  const { keyfieldsToDelete } = req.body;

  if (!keyfieldsToDelete || !keyfieldsToDelete.length) {
    res.status(400).json("Invalid or empty Codes or codeDetails array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    const deleteQuery = `EXEC sp_customer_details_info 'D','',@company_code,'','','','','','','','','','' ,'','','','','','','',0,'','','','','','','',@keyfield,'',@modified_by,NULL,NULL,NULL,null,null,null,null,null
    `;
    for (let i = 0; i < keyfieldsToDelete.length; i++) {
      await pool
        .request()
        .input("keyfield", keyfieldsToDelete[i])
        .input("company_code", sql.NVarChar, req.headers["company-code"])
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .query(deleteQuery);
    }

    res.status(200).json("Customer data deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//OPENING BALANCE 09/07/2024  DHANA//

const getAllopenbalance = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_openning_balance 'A','','','','','','',0,0,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL `,);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addopenbalance = async (req, res) => {
  const { company_code, transaction_date, transaction_type, transaction_no, acct_code, journal_no, debit, credit, created_by, modified_by,
    tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("transaction_date", sql.NVarChar, transaction_date)
      .input("transaction_type", sql.NVarChar, transaction_type)
      .input("transaction_no", sql.NVarChar, transaction_no)
      .input("acct_code", sql.NVarChar, acct_code)
      .input("journal_no", sql.NVarChar, journal_no)
      .input("debit", sql.Decimal(14, 2), debit)
      .input("credit", sql.Decimal(14, 2), credit)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_openning_balance @mode,@company_code,@transaction_date,@transaction_type,@transaction_no,@acct_code,@journal_no,@debit,@credit,'','',
        NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,);

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (err) {
    if (err.class === 16 && err.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: "Opening balance already exists" });
    } else {
      // Handle unexpected errors
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }
};

const openbalsaveEditedData = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U") // update mode
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("transaction_date", sql.NVarChar, updatedRow.transaction_date)
        .input("transaction_type", sql.NVarChar, updatedRow.transaction_type)
        .input("transaction_no", sql.NVarChar, updatedRow.transaction_no)
        .input("acct_code", sql.NVarChar, updatedRow.acct_code)
        .input("journal_no", sql.NVarChar, updatedRow.journal_no)
        .input("debit", sql.Decimal(14, 2), updatedRow.debit)
        .input("credit", sql.Decimal(14, 2), updatedRow.credit)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(`EXEC sp_openning_balance @mode,@company_code,@transaction_date,@transaction_type,@transaction_no,@acct_code,@journal_no,@debit,@credit,'','',
          NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const openingbalancedeleteData = async (req, res) => {
  const journal_nosToDelete = req.body.journal_nos;

  if (!journal_nosToDelete || !journal_nosToDelete.length) {
    res.status(400).json("Invalid or empty journal_nos array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const journal_no of journal_nosToDelete) {
      try {
        await pool
          .request()
          .input("journal_no", journal_no)
          .input("company_code", sql.NVarChar, req.headers["company_code"])
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(`EXEC sp_openning_balance 'D',@company_code,'','','','',@journal_no,0,0,'',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
        `);
      } catch (error) {
        if (error.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The opening balance cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw error; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("opening balance sheet deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getopeningbalanceSearchdata = async (req, res) => {
  const { company_code, transaction_date, transaction_type, transaction_no, acct_code, journal_no, } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("transaction_date", sql.NVarChar, transaction_date)
      .input("transaction_type", sql.NVarChar, transaction_type)
      .input("transaction_no", sql.NVarChar, transaction_no)
      .input("acct_code", sql.NVarChar, acct_code)
      .input("journal_no", sql.NVarChar, journal_no)
      .query(` EXEC sp_openning_balance @mode,@company_code,@transaction_date,@transaction_type,@transaction_no,@acct_code,@journal_no,0,0,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCustomerCode = async (req, res) => {
  const { company_code, customer_code } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "CCS")
      .input("company_code", sql.NVarChar, company_code)
      .input("customer_code", sql.NVarChar, customer_code)
      .query(`EXEC sp_customer_details_info @mode,@customer_code,@company_code,'','','','','','','','','','','','','','','','','',0,
          '','','','','','','','','','',NULL,NULL,NULL,null,null,null,null,null`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCustomerSearchdata = async (req, res) => {
  const { customer_code, company_code, customer_name, status, panno, customer_gst_no, customer_addr_1, customer_addr_2, customer_addr_3, customer_addr_4, customer_area, customer_state, customer_country, customer_mobile_no, customer_resi_no, customer_office_no, customer_fax_no, } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("customer_code", sql.NVarChar, customer_code)
      .input("company_code", sql.NVarChar, company_code)
      .input("customer_name", sql.NVarChar, customer_name)
      .input("status", sql.NVarChar, status)
      .input("panno", sql.NVarChar, panno)
      .input("customer_gst_no", sql.NVarChar, customer_gst_no)
      .input("customer_addr_1", sql.NVarChar, customer_addr_1)
      .input("customer_addr_2", sql.NVarChar, customer_addr_2)
      .input("customer_addr_3", sql.NVarChar, customer_addr_3)
      .input("customer_addr_4", sql.NVarChar, customer_addr_4)
      .input("customer_area", sql.NVarChar, customer_area)
      .input("customer_state", sql.NVarChar, customer_state)
      .input("customer_country", sql.NVarChar, customer_country)
      .input("customer_mobile_no", sql.NVarChar, customer_mobile_no)
      .input("customer_resi_no", sql.NVarChar, customer_resi_no)
      .input("customer_office_no", sql.NVarChar, customer_office_no)
      .input("customer_fax_no", sql.NVarChar, customer_fax_no)
      .query(`EXEC sp_customer_details_info @mode,@customer_code,@company_code,@customer_name,@status,@panno,@customer_gst_no,@customer_addr_1,@customer_addr_2,@customer_addr_3,@customer_addr_4,
          @customer_area,@customer_state,@customer_country,'','','',@customer_mobile_no,@customer_fax_no,'',0,'','','','','','','','','','',NULL,NULL,NULL,null,null,null,null,null`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//JOURNAL 11/07/2024 DHANA//
const addjournal = async (req, res) => {
  const { company_code, transaction_date, transaction_type, transaction_no, journal_no, original_accountcode, contra_accountCode, journal_amount, narration1, narration2, narration3, narration4, created_by,
    modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("transaction_date", sql.Date, transaction_date)
      .input("transaction_type", sql.NVarChar, transaction_type)
      .input("transaction_no", sql.NVarChar, transaction_no)
      .input("journal_no", sql.NVarChar, journal_no)
      .input("original_accountcode", sql.NVarChar, original_accountcode)
      .input("contra_accountCode", sql.NVarChar, contra_accountCode)
      .input("journal_amount", sql.Decimal(14, 3), journal_amount)
      .input("narration1", sql.NVarChar, narration1)
      .input("narration2", sql.NVarChar, narration2)
      .input("narration3", sql.NVarChar, narration3)
      .input("narration4", sql.NVarChar, narration4)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_journal @mode,@company_code,@transaction_date,@transaction_type,@transaction_no,@journal_no,@original_accountcode,@contra_accountCode,@journal_amount,
      @narration1,@narration2,@narration3,@narration4,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,);
    res.json({ success: true, message: "Data inserted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getjournalSearch = async (req, res) => {
  const { transaction_date, transaction_type, transaction_no, journal_no, original_accountcode, contra_accountCode, } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("transaction_date", sql.NVarChar, transaction_date)
      .input("transaction_type", sql.NVarChar, transaction_type)
      .input("transaction_no", sql.NVarChar, transaction_no)
      .input("journal_no", sql.NVarChar, journal_no)
      .input("original_accountcode", sql.NVarChar, original_accountcode)
      .input("contra_accountCode", sql.NVarChar, contra_accountCode)
      .query(` EXEC sp_journal @mode,'',@transaction_date,@transaction_type,@transaction_no,@journal_no,@original_accountcode,@contra_accountCode,
          0,'','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getUserPermission = async (req, res) => {
  const { role_id } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "UP")
      .input("role_id", sql.NVarChar, role_id)
      .query(`EXEC sp_rolescreen_mapping @mode,'',@role_id,'','','','','',null,null,null,null,null,null,null,null`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//JOURNAL UPDATE 12/07/2024 DHANA//
const saveEditjournal = async (req, res) => {
  const { transaction_datesToUpdate, journal_nosToUpdate, updatedData } =
    req.body;

  if (
    !transaction_datesToUpdate ||
    !transaction_datesToUpdate.length ||
    !journal_nosToUpdate ||
    !journal_nosToUpdate.length ||
    !updatedData ||
    !updatedData.length
  ) {
    res.status(400).json("Invalid or empty input data.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (let i = 0; i < transaction_datesToUpdate.length; i++) {
      const updatedRow = updatedData[i]; // Assuming updatedData is an array of objects with updated values

      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", updatedRow.company_code)
        .input("transaction_date", transaction_datesToUpdate[i])
        .input("transaction_type", updatedRow.transaction_type)
        .input("transaction_no", updatedRow.transaction_no)
        .input("journal_no", journal_nosToUpdate[i])
        .input("original_accountcode", updatedRow.original_accountcode)
        .input("contra_accountCode", updatedRow.contra_accountCode)
        .input("journal_amount", updatedRow.journal_amount)
        .input("narration1", updatedRow.narration1)
        .input("narration2", updatedRow.narration2)
        .input("narration3", updatedRow.narration3)
        .input("narration4", updatedRow.narration4)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_journal @mode,@company_code,@transaction_date,@transaction_type, @transaction_no,@journal_no, @original_accountcode, @contra_accountCode,@journal_amount, @narration1, 
          @narration2, @narration4,@narration4,@created_by, @modified_by,@tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`);
    }

    res.status(200).json("Updated data successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//JOURNAL DELETE 12/07/2024 DHANA//
const deletejournal = async (req, res) => {
  const { transaction_datesToDelete, journal_noToDelete } = req.body;

  if (
    !transaction_datesToDelete ||
    !transaction_datesToDelete.length ||
    !journal_noToDelete ||
    !journal_noToDelete.length
  ) {
    res.status(400).json("Invalid or empty Codes or codeDetails array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    const deleteQuery = `EXEC sp_journal 'D','',@transaction_date,'','', @journal_no,'','',0,'','','','','',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
`;
    for (let i = 0; i < transaction_datesToDelete.length; i++) {
      await pool
        .request()
        .input("transaction_date", transaction_datesToDelete[i])
        .input("journal_no", journal_noToDelete[i])
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .query(deleteQuery);
    }

    res.status(200).json("Intermediary data deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//DROP DOWN FOR JOURNAL SCREEN//
const getwarehousecode = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      "EXEC [sp_journal] 'F','','','','','','','',0,'','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

///test from kathir on 18-07-2024
const facereg = async (req, res) => {
  try {
    const pool = await connection.connectToDatabase();
    const user_code = req.params.user_code;

    const result = await pool
      .request()
      .input("user_code", sql.VarChar, user_code)
      .query(
        "SELECT user_image FROM tbl_face_recognition WHERE user_code = @user_code",
      );

    if (result.recordset.length > 0 && result.recordset[0].user_image) {
      const imageData = result.recordset[0].user_image;

      // Convert binary image data to Base64
      const base64Image = Buffer.from(imageData).toString("base64");
      const imageSrc = `data:image/jpeg;base64,${base64Image}`; // Adjust content type based on your image type

      res.json({ imageSrc });
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//ADD DATAS IN USER ACCOUNT GROUP
const addUserAccGrp = async (req, res) => {
  const { user_accgroup_code, user_accgroup_name, standard_accgroup_code, base_accgroup_code, status, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("user_accgroup_code", sql.NVarChar, user_accgroup_code)
      .input("user_accgroup_name", sql.NVarChar, user_accgroup_name)
      .input("standard_accgroup_code", sql.NVarChar, standard_accgroup_code)
      .input("base_accgroup_code", sql.NVarChar, base_accgroup_code)
      .input("status", sql.NVarChar, status)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_user_account_group @mode,@user_accgroup_code,@user_accgroup_name,@standard_accgroup_code,@base_accgroup_code,@status,@created_by,
        @modified_by,@tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (error) {
    if (error.class === 16 && error.number === 50000) {
      // Custom error from the stored procedure
      res.status(400).json({ message: "User Account already exists" });
    } else {
      // Handle unexpected errors
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
};

const getsearchUserAccGrp = async (req, res) => {
  const { user_accgroup_code, user_accgroup_name, standard_accgroup_code, base_accgroup_code, status, } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("user_accgroup_code", sql.NVarChar, user_accgroup_code)
      .input("user_accgroup_name", sql.NVarChar, user_accgroup_name)
      .input("standard_accgroup_code", sql.NVarChar, standard_accgroup_code)
      .input("base_accgroup_code", sql.NVarChar, base_accgroup_code)
      .input("status", sql.NVarChar, status)
      .query(`EXEC sp_user_account_group @mode,@user_accgroup_code,@user_accgroup_name,@standard_accgroup_code, @base_accgroup_code,@status,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updUserAccGrp = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("user_accgroup_code", sql.NVarChar, updatedRow.user_accgroup_code,)
        .input("user_accgroup_name", sql.NVarChar, updatedRow.user_accgroup_name,)
        .input("standard_accgroup_code", sql.NVarChar, updatedRow.standard_accgroup_code,)
        .input("base_accgroup_code", sql.NVarChar, updatedRow.base_accgroup_code,)
        .input("status", sql.NVarChar, updatedRow.status)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(`EXEC sp_user_account_group @mode,@user_accgroup_code, @user_accgroup_name, @standard_accgroup_code, @base_accgroup_code, @status,
            @created_by,@modified_by, @tempstr1, @tempstr2, @tempstr3, @tempstr4, @datetime1, @datetime2, @datetime3, @datetime4`,
        );
    }
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const deleteUserAccGrp = async (req, res) => {
  const { user_accgroup_codesToDelete, user_accgroup_nameToDelete } = req.body;

  if (
    !user_accgroup_codesToDelete ||
    !user_accgroup_nameToDelete.length ||
    !user_accgroup_codesToDelete ||
    !user_accgroup_nameToDelete.length
  ) {
    res.status(400).json("Invalid or empty Codes or codeDetails array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    const deleteQuery = `EXEC sp_user_account_group 'D',@user_accgroup_code, @user_accgroup_name,'','','',
      '',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
      `;
    for (let i = 0; i < user_accgroup_codesToDelete.length; i++) {
      try {
        await pool
          .request()
          .input("user_accgroup_code", user_accgroup_codesToDelete[i])
          .input("user_accgroup_name", user_accgroup_nameToDelete[i])
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(deleteQuery);
      } catch (error) {
        if (error.number === 50000) {
          // Foreign key constraint violation
          res
            .status(400)
            .json(
              "The user account group cannot be deleted due to a link with another record",
            );
          return;
        } else {
          throw error; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("User Account Group data deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//ACCOUNT NAME//10 AUG 2024//ADD
const addAccountName = async (req, res) => {
  const { company_code, account_code, account_name, acc_addr_1, acc_addr_2, acc_addr_3, acc_addr_4, acc_area_code, acc_state_code, acc_country_code, acc_imex_no, acc_office_no, acc_resi_no, acc_mobile_no, acc_fax_no, acc_email_id, acc_credit_limit, acc_transport_code,
    acc_salesman_code, acc_broker_code, acc_weekday_code, base_accgroup_code, standard_accgroup_code, user_accgroup_code, account_subcode, status, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4,
    datetime1, datetime2, datetime3, datetime4, } = req.body;

  let pool;
  try {
    pool = await sql.connect(dbConfig);

    // If the company code doesn't exist, proceed with inserting the data
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("account_code", sql.NVarChar, account_code)
      .input("account_name", sql.NVarChar, account_name)
      .input("acc_addr_1", sql.NVarChar, acc_addr_1)
      .input("acc_addr_2", sql.NVarChar, acc_addr_2)
      .input("acc_addr_3", sql.NVarChar, acc_addr_3)
      .input("acc_addr_4", sql.NVarChar, acc_addr_4)
      .input("acc_area_code", sql.NVarChar, acc_area_code)
      .input("acc_state_code", sql.NVarChar, acc_state_code)
      .input("acc_country_code", sql.NVarChar, acc_country_code)
      .input("acc_imex_no", sql.NVarChar, acc_imex_no)
      .input("acc_office_no", sql.NVarChar, acc_office_no)
      .input("acc_resi_no", sql.NVarChar, acc_resi_no)
      .input("acc_mobile_no", sql.NVarChar, acc_mobile_no)
      .input("acc_fax_no", sql.NVarChar, acc_fax_no)
      .input("acc_email_id", sql.NVarChar, acc_email_id)
      .input("acc_credit_limit", sql.Decimal(14, 3), acc_credit_limit)
      .input("acc_transport_code", sql.NVarChar, acc_transport_code)
      .input("acc_salesman_code", sql.NVarChar, acc_salesman_code)
      .input("acc_broker_code", sql.NVarChar, acc_broker_code)
      .input("acc_weekday_code", sql.NVarChar, acc_weekday_code)
      .input("base_accgroup_code", sql.NVarChar, base_accgroup_code)
      .input("standard_accgroup_code", sql.NVarChar, standard_accgroup_code)
      .input("user_accgroup_code", sql.NVarChar, user_accgroup_code)
      .input("account_subcode", sql.NVarChar, account_subcode)
      .input("status", sql.NVarChar, status)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_account_name @mode, @company_code,@account_code, @account_name, @acc_addr_1, @acc_addr_2, @acc_addr_3, @acc_addr_4, @acc_area_code, @acc_state_code, 
      @acc_country_code, @acc_imex_no, @acc_office_no, @acc_resi_no, @acc_mobile_no, @acc_fax_no,@acc_email_id, @acc_credit_limit, @acc_transport_code, 
      @acc_salesman_code, @acc_broker_code, @acc_weekday_code,@base_accgroup_code,@standard_accgroup_code,@user_accgroup_code,@account_subcode,@status,'','','','','','','','','',@created_by,
      @modified_by,@tempstr1, @tempstr2, @tempstr3, @tempstr4,@datetime1, @datetime2, @datetime3, @datetime4,''`);

    // Return success response
    res.json({ success: true, message: "Data inserted successfully" });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAccNameSearch = async (req, res) => {
  const { company_code, account_code, account_name, acc_addr_1, acc_area_code, acc_state_code, acc_country_code, acc_mobile_no, base_accgroup_code, standard_accgroup_code, user_accgroup_code, account_subcode, status, } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("account_code", sql.NVarChar, account_code)
      .input("account_name", sql.NVarChar, account_name)
      .input("acc_addr_1", sql.NVarChar, acc_addr_1)
      .input("acc_area_code", sql.NVarChar, acc_area_code)
      .input("acc_state_code", sql.NVarChar, acc_state_code)
      .input("acc_country_code", sql.NVarChar, acc_country_code)
      .input("acc_mobile_no", sql.NVarChar, acc_mobile_no)
      .input("base_accgroup_code", sql.NVarChar, base_accgroup_code)
      .input("standard_accgroup_code", sql.NVarChar, standard_accgroup_code)
      .input("user_accgroup_code", sql.NVarChar, user_accgroup_code)
      .input("account_subcode", sql.NVarChar, account_subcode)
      .input("status", sql.NVarChar, status)
      .query(`EXEC sp_account_name @mode,@company_code,@account_code,@account_name,@acc_addr_1,'','','',@acc_area_code,@acc_state_code,
      @acc_country_code,'','','',@acc_mobile_no,'' ,'',0,'','','','',@base_accgroup_code,@standard_accgroup_code,@user_accgroup_code,
      @account_subcode,@status,'','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,null,null,null,''`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const updateAccName = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U") // update mode
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("account_code", sql.NVarChar, updatedRow.account_code)
        .input("account_name", sql.NVarChar, updatedRow.account_name)
        .input("acc_addr_1", sql.NVarChar, updatedRow.acc_addr_1)
        .input("acc_addr_2", sql.NVarChar, updatedRow.acc_addr_2)
        .input("acc_addr_3", sql.NVarChar, updatedRow.acc_addr_3)
        .input("acc_addr_4", sql.NVarChar, updatedRow.acc_addr_4)
        .input("acc_area_code", sql.NVarChar, updatedRow.acc_area_code)
        .input("acc_state_code", sql.NVarChar, updatedRow.acc_state_code)
        .input("acc_country_code", sql.NVarChar, updatedRow.acc_country_code)
        .input("acc_imex_no", sql.NVarChar, updatedRow.acc_imex_no)
        .input("acc_office_no", sql.NVarChar, updatedRow.acc_office_no)
        .input("acc_resi_no", sql.NVarChar, updatedRow.acc_resi_no)
        .input("acc_mobile_no", sql.NVarChar, updatedRow.acc_mobile_no)
        .input("acc_fax_no", sql.NVarChar, updatedRow.acc_fax_no)
        .input("acc_email_id", sql.NVarChar, updatedRow.acc_email_id)
        .input("acc_credit_limit", sql.Decimal(14, 3), updatedRow.acc_credit_limit,)
        .input("acc_transport_code", sql.NVarChar, updatedRow.acc_transport_code,)
        .input("acc_salesman_code", sql.NVarChar, updatedRow.acc_salesman_code)
        .input("acc_broker_code", sql.NVarChar, updatedRow.acc_broker_code)
        .input("acc_weekday_code", sql.NVarChar, updatedRow.acc_weekday_code)
        .input("base_accgroup_code", sql.NVarChar, updatedRow.base_accgroup_code,)
        .input("standard_accgroup_code", sql.NVarChar, updatedRow.standard_accgroup_code,)
        .input("user_accgroup_code", sql.NVarChar, updatedRow.user_accgroup_code,)
        .input("account_subcode", sql.NVarChar, updatedRow.account_subcode)
        .input("status", sql.NVarChar, updatedRow.status)
        .input("panno", sql.NVarChar, updatedRow.panno)
        .input("gst_no", sql.NVarChar, updatedRow.gst_no)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(`EXEC sp_account_name @mode,@company_code,@account_code,@account_name,@acc_addr_1,@acc_addr_2,@acc_addr_3,@acc_addr_4,
          @acc_area_code,@acc_state_code,@acc_country_code,@acc_imex_no,@acc_office_no,@acc_resi_no,@acc_mobile_no,@acc_fax_no,
          @acc_email_id,@acc_credit_limit,@acc_transport_code,@acc_salesman_code,@acc_broker_code,@acc_weekday_code,@base_accgroup_code,
          @standard_accgroup_code,@user_accgroup_code,@account_subcode,@status,'','','','',@panno,@gst_no,'','','',
          @created_by,@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,''`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const AccNameDelete = async (req, res) => {
  const account_codesToDelete = req.body.account_codes;

  if (!account_codesToDelete || !account_codesToDelete.length) {
    res.status(400).json("Invalid or empty account_codes array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase();

    for (const account_code of account_codesToDelete) {
      try {
        await pool
          .request()
          .input("company_code", sql.NVarChar, req.headers["company_code"])
          .input("account_code", account_code)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(`
         EXEC sp_account_name 'D',@company_code,@account_code,'','','','','','','','','','' ,'','','','',0,'','','',
          '','','','','','','','','','','','','','','','',@modified_by,NULL,NULL,NULL,null,null,null,null,null,''`);
      } catch (error) {
        if (error.number === 50000) {
          // Foreign key constraint violation
          res.status(400).json(error.message);
          return;
        } else {
          throw error; // Rethrow other SQL errors
        }
      }
    }

    res.status(200).json("Account data deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAllAccNameData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_account_name 'A','','','','','','','','','','','','','','','','',0,'','','','','','','','','','','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
    );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getDateRange = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(`EXEC sp_DateRangeList 'FD',0,''`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getUsercodename = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FSA")
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_account_name @mode,@company_code,'','','','','','','','','','','','','','','',0,'','','','','','','','','','','','','','','','','','','','',
        NULL,NULL,NULL,null,null,null,null,null,''`,);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getUsercodenameBank = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FSAB")
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_account_name @mode,@company_code,'','','','','','','','','','','','','','','',0,'','','','','','','','','','','','','','','','',
        '','','','',NULL,NULL,NULL,null,null,null,null,null,''`,);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAccountCode = async (req, res) => {
  const { company_code, user_accgroup_code, account_name } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "CU")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_accgroup_code", sql.NVarChar, user_accgroup_code)
      .input("account_name", sql.NVarChar, account_name)
      .query(
        `EXEC sp_account_name @mode,@company_code,'',@account_name,'','','','','','','','','','','','','',0,'','','','','','',@user_accgroup_code,'','','','','','','','','','','','','',NULL,NULL,NULL,null,null,null,null,null,''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by AK (20/08/2024) code begins for insert option for bank acccount
const addbankAccount = async (req, res) => {
  const { company_code, account_code, account_name, acc_addr_1, acc_addr_2, acc_addr_3, acc_addr_4, acc_area_code, acc_state_code, acc_country_code, base_accgroup_code, standard_accgroup_code, user_accgroup_code,
    account_number, IFSC_code, account_type, branch, default_bank, created_by, modified_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;

  let bank_paymentQRCode = null;

  if (req.file) {
    bank_paymentQRCode = req.file.buffer;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("account_code", sql.NVarChar, account_code)
      .input("account_name", sql.NVarChar, account_name)
      .input("acc_addr_1", sql.NVarChar, acc_addr_1)
      .input("acc_addr_2", sql.NVarChar, acc_addr_2)
      .input("acc_addr_3", sql.NVarChar, acc_addr_3)
      .input("acc_addr_4", sql.NVarChar, acc_addr_4)
      .input("acc_area_code", sql.NVarChar, acc_area_code)
      .input("acc_state_code", sql.NVarChar, acc_state_code)
      .input("acc_country_code", sql.NVarChar, acc_country_code)
      .input("base_accgroup_code", sql.NVarChar, base_accgroup_code)
      .input("standard_accgroup_code", sql.NVarChar, standard_accgroup_code)
      .input("user_accgroup_code", sql.NVarChar, user_accgroup_code)
      .input("account_number", sql.NVarChar, account_number)
      .input("IFSC_code", sql.NVarChar, IFSC_code)
      .input("account_type", sql.NVarChar, account_type)
      .input("branch", sql.NVarChar, branch)
      .input("bank_paymentQRCode", sql.VarBinary, bank_paymentQRCode)
      .input("default_bank", sql.VarChar, default_bank)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_account_name @mode, @company_code,@account_code, @account_name, @acc_addr_1, @acc_addr_2, @acc_addr_3, @acc_addr_4, @acc_area_code, @acc_state_code, 
      @acc_country_code, '','','','','','',0,'','','','',@base_accgroup_code,@standard_accgroup_code,@user_accgroup_code,'','',@account_number,@IFSC_code,@account_type,@branch,'','','',@bank_paymentQRCode,@default_bank,@created_by,
      @modified_by,@tempstr1, @tempstr2, @tempstr3, @tempstr4,@datetime1, @datetime2, @datetime3, @datetime4,''`);

    res.json({ success: true, message: "Data inserted successfully" });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getacctype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'account type','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updatebankAcc = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U") // update mode
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("account_code", sql.NVarChar, updatedRow.account_code)
        .input("account_name", sql.NVarChar, updatedRow.account_name)
        .input("acc_addr_1", sql.NVarChar, updatedRow.acc_addr_1)
        .input("acc_addr_2", sql.NVarChar, updatedRow.acc_addr_2)
        .input("acc_addr_3", sql.NVarChar, updatedRow.acc_addr_3)
        .input("acc_addr_4", sql.NVarChar, updatedRow.acc_addr_4)
        .input("acc_area_code", sql.NVarChar, updatedRow.acc_area_code)
        .input("acc_state_code", sql.NVarChar, updatedRow.acc_state_code)
        .input("acc_country_code", sql.NVarChar, updatedRow.acc_country_code)
        .input("base_accgroup_code", sql.NVarChar, updatedRow.base_accgroup_code,)
        .input("standard_accgroup_code", sql.NVarChar, updatedRow.standard_accgroup_code,)
        .input("user_accgroup_code", sql.NVarChar, updatedRow.user_accgroup_code,)
        .input("account_number", sql.NVarChar, updatedRow.account_number)
        .input("IFSC_code", sql.NVarChar, updatedRow.IFSC_code)
        .input("account_type", sql.NVarChar, updatedRow.account_type)
        .input("branch", sql.NVarChar, updatedRow.branch)
        .input("default_bank", sql.VarChar, updatedRow.default_bank)
        .input("created_by", sql.NVarChar, updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", sql.NVarChar, updatedRow.tempstr1)
        .input("tempstr2", sql.NVarChar, updatedRow.tempstr2)
        .input("tempstr3", sql.NVarChar, updatedRow.tempstr3)
        .input("tempstr4", sql.NVarChar, updatedRow.tempstr4)
        .input("datetime1", sql.NVarChar, updatedRow.datetime1)
        .input("datetime2", sql.NVarChar, updatedRow.datetime2)
        .input("datetime3", sql.NVarChar, updatedRow.datetime3)
        .input("datetime4", sql.NVarChar, updatedRow.datetime4)
        .query(`EXEC sp_account_name @mode,@company_code,@account_code,@account_name,@acc_addr_1,@acc_addr_2,@acc_addr_3,@acc_addr_4,
          @acc_area_code,@acc_state_code,@acc_country_code,'','','','','',
          '',0,'','','','',@base_accgroup_code,@standard_accgroup_code,@user_accgroup_code,'','',@account_number,@IFSC_code,@account_type,@branch,'','','',
          '',@default_bank,@created_by,@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,''`);
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getbankaccSearch = async (req, res) => {
  const { company_code, account_code, account_name, acc_addr_1, acc_area_code, acc_state_code, acc_country_code, account_type, branch, } = req.body;

  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();

    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SCB")
      .input("company_code", sql.NVarChar, company_code)
      .input("account_code", sql.NVarChar, account_code)
      .input("account_name", sql.NVarChar, account_name)
      .input("acc_addr_1", sql.NVarChar, acc_addr_1)
      .input("acc_area_code", sql.NVarChar, acc_area_code)
      .input("acc_state_code", sql.NVarChar, acc_state_code)
      .input("acc_country_code", sql.NVarChar, acc_country_code)
      .input("account_type", sql.NVarChar, account_type)
      .input("branch", sql.NVarChar, branch)
      .query(`EXEC sp_account_name @mode,@company_code,@account_code,@account_name,@acc_addr_1,'','','',@acc_area_code,@acc_state_code,
      @acc_country_code,'','','','','' ,'',0,'','','','','','','',
      '','','','',@account_type,@branch,'','','','','','','',NULL,NULL,NULL,NULL,NULL,null,null,null,''`);

    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//code ends
const getofftype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'OfficeType','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const RollMappingDelete = async (req, res) => {
  const keyfieldToDelete = req.body.keyfield;

  try {
    const pool = await connection.connectToDatabase();
    for (const keyfield of keyfieldToDelete) {
      try {
        await pool
          .request()
          .input("keyfield", keyfield)
          .input("modified_by", sql.NVarChar, req.headers["modified-by"])
          .query(` EXEC sp_user_rolemapping 'D','','','','','',@keyfield,'', @modified_by,null,null,null,null,null,null,null,null
            `);
      } catch (error) {
        if (error.number === 547) {
          // Foreign key constraint violation
          res.status(400).json("First Delete the RoleMapping header");
          return;
        } else {
          throw error; // Rethrow other SQL errors
        }
      }
    }
    res.status(200).json("RoleMapping Deleted Successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updateRoleMapping = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }
  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", sql.NVarChar, req.headers["company_code"])
        .input("user_code", updatedRow.user_code)
        .input("role_id", updatedRow.role_id)
        .input("keyfield", updatedRow.keyfield)
        .input("created_by", updatedRow.created_by)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .input("tempstr1", updatedRow.tempstr1)
        .input("tempstr2", updatedRow.tempstr2)
        .input("tempstr3", updatedRow.tempstr3)
        .input("tempstr4", updatedRow.tempstr4)
        .input("datetime1", updatedRow.datetime1)
        .input("datetime2", updatedRow.datetime2)
        .input("datetime3", updatedRow.datetime3)
        .input("datetime4", updatedRow.datetime4)
        .query(`EXEC sp_user_rolemapping @mode,@company_code,@user_code,'',@role_id,'',@keyfield,@created_by,@modified_by,@tempstr1,@tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`,
        );
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getUserRole = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_role_info 'UR',@company_code,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const UpdateUserImage = async (req, res) => {
  const { user_code } = req.body;

  let user_img = null;

  if (req.file) {
    user_img = req.file.buffer; // Buffer containing the uploaded image
  }
  try {
    // Check if the user exists in the database
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("user_code", sql.NVarChar, user_code)
      .input("user_img", sql.VarBinary, user_img)
      .query(
        `EXEC sp_user_info_hdr 'UI','',@user_code,'','','','','','','','','','','',@user_img,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (error) {
    if (error.class === 16 && error.number === 50000) {
      // Custom error from the stored procedure
      res
        .status(400)
        .json({ message: "User already exists", error: error.message });
    } else {
      // Handle unexpected errors
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
};

const getEmptype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'EmployeeType','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//CODE ENDED PAVUN
const getCondition = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Condition','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by pavun 05-06-2024
const LocationUpdate = async (req, res) => {
  const { location_no, location_name, short_name, address1, address2, address3, city, state, pincode, country, email_id, status, contact_no, created_by, modified_by, } = req.body;

  let pool;
  try {
    pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("location_no", sql.NVarChar, location_no)
      .input("location_name", sql.NVarChar, location_name)
      .input("short_name", sql.NVarChar, short_name)
      .input("address1", sql.NVarChar, address1)
      .input("address2", sql.NVarChar, address2)
      .input("address3", sql.NVarChar, address3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("email_id", sql.NVarChar, email_id)
      .input("status", sql.NVarChar, status)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_location_info @mode,@location_no, @location_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country,
         @email_id,  @status, @contact_no, @created_by, @modified_by , '', '', '', '','', '', '',''`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CompanyUpdate = async (req, res) => {
  const { company_no, company_name, short_name, address1, address2, address3, city, state, pincode, country, email_id,
    status, foundedDate, websiteURL, contact_no, annualReportURL, location_no, company_gst_no, modified_by, } = req.body;

  let company_logo = req.files["company_logo"]
    ? req.files["company_logo"][0].buffer
    : null;
  let authorisedSignatur = req.files["authorisedSignatur"]
    ? req.files["authorisedSignatur"][0].buffer
    : null;
  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_no", sql.NVarChar, company_no)
      .input("company_name", sql.NVarChar, company_name)
      .input("short_name", sql.NVarChar, short_name)
      .input("address1", sql.NVarChar, address1)
      .input("address2", sql.NVarChar, address2)
      .input("address3", sql.NVarChar, address3)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("pincode", sql.NVarChar, pincode)
      .input("country", sql.NVarChar, country)
      .input("email_id", sql.NVarChar, email_id)
      .input("status", sql.NVarChar, status)
      .input("foundedDate", sql.NVarChar, foundedDate)
      .input("websiteURL", sql.NVarChar, websiteURL)
      .input("company_logo", sql.VarBinary, company_logo)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("annualReportURL", sql.NVarChar, annualReportURL)
      .input("location_no", sql.NVarChar, location_no)
      .input("company_gst_no", sql.NVarChar, company_gst_no)
      .input("authorisedSignatur", sql.VarBinary, authorisedSignatur)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_company_info @mode, @company_no, @company_name, @short_name, @address1, @address2, @address3, @city, @state, @pincode, @country, @email_id, 
        @status, @foundedDate, @websiteURL, @company_logo, @contact_no, @annualReportURL,@location_no,@company_gst_no,@authorisedSignatur,'' ,@modified_by, '',
         '', '', '', '','', '', '', ''`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const UpdateCompanyImage = async (req, res) => {
  const { company_no } = req.body;

  let company_logo = null;

  if (req.file) {
    company_logo = req.file.buffer;
  }

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_no", sql.NVarChar, company_no)
      .input("company_logo", sql.VarBinary, company_logo)
      .query(`EXEC sp_company_info 'CIU',@company_no,'','','','','','','','','','','','','',@company_logo,'','','','','','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,null`,
      );

    // Return success response
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Data inserted successfully" });
    }
  } catch (error) {
    if (error.class === 16 && error.number === 50000) {
      // Custom error from the stored procedure
      res
        .status(400)
        .json({ message: "company already exists", error: error.message });
    } else {
      // Handle unexpected errors
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
};

//code added by pavun 07-10-2024
const RoleUpdate = async (req, res) => {
  const { company_code, role_id, role_name, description, created_by, modified_by, } = req.body;
  let pool;
  try {
    pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // update mode
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.NVarChar, role_id)
      .input("role_name", sql.NVarChar, role_name)
      .input("description", sql.NVarChar, description)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_Role_Info @mode,@company_code,@role_id,@role_name,@description,@created_by,@modified_by,'','',
          '','','','','',''`,);

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const UserUpdate = async (req, res) => {
  const { company_code, user_code, user_name, first_name, last_name, user_password, user_status, log_in_out, user_type, email_id, dob, gender, role_id, created_by, modified_by, super_admin, } = req.body;

  let user_images = null;

  if (req.file) {
    user_images = req.file.buffer;
  }

  try {
    pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // update mode
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .input("user_name", sql.NVarChar, user_name)
      .input("first_name", sql.NVarChar, first_name)
      .input("last_name", sql.NVarChar, last_name)
      .input("user_password", sql.NVarChar, user_password)
      .input("user_status", sql.NVarChar, user_status)
      .input("log_in_out", sql.NVarChar, log_in_out)
      .input("user_type", sql.NVarChar, user_type)
      .input("email_id", sql.NVarChar, email_id)
      .input("dob", sql.NVarChar, dob)
      .input("gender", sql.NVarChar, gender)
      .input("role_id", sql.NVarChar, role_id)
      .input("user_images", sql.VarBinary, user_images)
      .input("super_admin", sql.NVarChar, super_admin)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_user_info_hdr @mode,@company_code, @user_code, @user_name, @first_name, @last_name, @user_password, @user_status, @log_in_out, @user_type, 
      @email_id, @dob, @gender,@role_id,@user_images, @super_admin, @created_by, @modified_by, '', '', '', '', '', '', '', ''`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CompanyMappingUpdate = async (req, res) => {
  const { company_code, user_code, company_no, location_no, status, order_no, keyfiels, modified_by, } = req.body;
  let pool;
  try {
    pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.VarChar, user_code)
      .input("company_no", sql.NVarChar, company_no)
      .input("location_no", sql.VarChar, location_no)
      .input("status", sql.VarChar, status)
      .input("order_no", sql.Int, order_no)
      .input("keyfiels", sql.NVarChar, keyfiels)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_user_company_mapping @mode, @company_code, @user_code, @company_no, @location_no, 
          @status, @order_no,@keyfiels,'',@modified_by,'', '', '', '', '', '', '', ''`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const RoleMappingUpdate = async (req, res) => {
  const { company_code, user_code, role_id, keyfield, modified_by } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.VarChar, user_code)
      .input("role_id", sql.VarChar, role_id)
      .input("keyfield", sql.VarChar, keyfield)
      .input("modified_by", sql.VarChar, modified_by)
      .query(
        `EXEC sp_user_rolemapping @mode,@company_code,@user_code,'',@role_id,'',@keyfield,'',@modified_by,'','','','','','','',''`,
      );

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const AttributeUpdate = async (req, res) => {
  const { company_code, attributeheader_code, attributedetails_code, attributedetails_name, descriptions, created_by, modified_by, } = req.body;

  let pool;
  try {
    pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributedetails_code", sql.NVarChar, attributedetails_code)
      .input("attributedetails_name", sql.NVarChar, attributedetails_name)
      .input("descriptions", sql.NVarChar, descriptions)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_attribute_Info @mode,@company_code, @attributeheader_code, @attributedetails_code, @attributedetails_name, @descriptions, @created_by,@modified_by, '', '', '', '', '', '', '', ''`,
      );
    res.status(200).json("Updated data successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const NumberSeriesUpdate = async (req, res) => {
  const { company_code, Screen_Type, Start_Year, End_Year, Start_No, Running_No, End_No, text, number_prefix, Status, created_by, modified_by, } = req.body;

  let pool;
  try {
    pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.NVarChar, company_code)
      .input("Screen_Type", sql.NVarChar, Screen_Type)
      .input("Start_Year", sql.NVarChar, Start_Year)
      .input("End_Year", sql.NVarChar, End_Year)
      .input("Start_No", sql.Int, Start_No)
      .input("Running_No", sql.Int, Running_No)
      .input("End_No", sql.Int, End_No)
      .input("text", sql.NVarChar, text)
      .input("number_prefix", sql.NVarChar, number_prefix)
      .input("Status", sql.NVarChar, Status)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_numberseries @mode, @company_code,@Screen_Type, @Start_Year, @End_Year, @Start_No, @Running_No,@End_No,@text,@number_prefix,
             @Status,@created_by,@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,''`);

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const VendorUpdate = async (req, res) => {
  const { vendor_code, company_code, vendor_name, vendor_gst_no, vendor_addr_1, vendor_addr_2, vendor_addr_3, vendor_addr_4, vendor_area_code, vendor_state_code, vendor_country_code, vendor_imex_no, vendor_office_no,
    vendor_resi_no, vendor_mobile_no, vendor_fax_no, vendor_email_id, vendor_credit_limit, vendor_transport_code, vendor_salesman_code, vendor_broker_code, vendor_weekday_code, contact_person, office_type, keyfield, modified_by, } = req.body;

  let pool;
  try {
    pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("vendor_code", sql.NVarChar, vendor_code)
      .input("company_code", sql.NVarChar, company_code)
      .input("vendor_name", sql.NVarChar, vendor_name)
      .input("vendor_gst_no", sql.NVarChar, vendor_gst_no)
      .input("vendor_addr_1", sql.NVarChar, vendor_addr_1)
      .input("vendor_addr_2", sql.NVarChar, vendor_addr_2)
      .input("vendor_addr_3", sql.NVarChar, vendor_addr_3)
      .input("vendor_addr_4", sql.NVarChar, vendor_addr_4)
      .input("vendor_area_code", sql.NVarChar, vendor_area_code)
      .input("vendor_state_code", sql.NVarChar, vendor_state_code)
      .input("vendor_country_code", sql.NVarChar, vendor_country_code)
      .input("vendor_imex_no", sql.NVarChar, vendor_imex_no)
      .input("vendor_office_no", sql.NVarChar, vendor_office_no)
      .input("vendor_resi_no", sql.NVarChar, vendor_resi_no)
      .input("vendor_mobile_no", sql.NVarChar, vendor_mobile_no)
      .input("vendor_fax_no", sql.NVarChar, vendor_fax_no)
      .input("vendor_email_id", sql.NVarChar, vendor_email_id)
      .input("vendor_credit_limit", sql.Decimal(14, 3), vendor_credit_limit)
      .input("vendor_transport_code", sql.NVarChar, vendor_transport_code)
      .input("vendor_salesman_code", sql.NVarChar, vendor_salesman_code)
      .input("vendor_broker_code", sql.NVarChar, vendor_broker_code)
      .input("vendor_weekday_code", sql.NVarChar, vendor_weekday_code)
      .input("contact_person", sql.NVarChar, contact_person)
      .input("office_type", sql.NVarChar, office_type)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_vendor_details_info_hdr @mode,@vendor_code,@company_code,@vendor_name,'','',@vendor_gst_no,@vendor_addr_1,@vendor_addr_2,@vendor_addr_3,
              @vendor_addr_4,@vendor_area_code,@vendor_state_code ,@vendor_country_code,@vendor_imex_no,@vendor_office_no,@vendor_resi_no,@vendor_mobile_no,@vendor_fax_no,@vendor_email_id,
              @vendor_credit_limit,@vendor_transport_code,@vendor_salesman_code,@vendor_broker_code,@vendor_weekday_code, @contact_person,@office_type,@keyfield,'', @modified_by, '', '', '', '',
               '', '', '', ''`);

    res.status(200).json("Updated data successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//ced ended by pavun

//code added by pavun 08-10-2024
const CustomerUpdate = async (req, res) => {
  const { customer_code, company_code, customer_name, customer_gst_no, customer_addr_1, customer_addr_2, customer_addr_3, customer_addr_4, customer_area, customer_state, customer_country, customer_imex_no,
    customer_office_no, customer_resi_no, customer_mobile_no, customer_fax_no, customer_email_id, customer_credit_limit, customer_transport_code, customer_salesman_code, customer_broker_code, customer_weekday_code, contact_person, office_type, default_customer, keyfield, modified_by, } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("customer_code", sql.NVarChar, customer_code)
      .input("company_code", sql.NVarChar, company_code)
      .input("customer_name", sql.NVarChar, customer_name)
      .input("customer_gst_no", sql.NVarChar, customer_gst_no)
      .input("customer_addr_1", sql.NVarChar, customer_addr_1)
      .input("customer_addr_2", sql.NVarChar, customer_addr_2)
      .input("customer_addr_3", sql.NVarChar, customer_addr_3)
      .input("customer_addr_4", sql.NVarChar, customer_addr_4)
      .input("customer_area", sql.NVarChar, customer_area)
      .input("customer_state", sql.NVarChar, customer_state)
      .input("customer_country", sql.NVarChar, customer_country)
      .input("customer_imex_no", sql.NVarChar, customer_imex_no)
      .input("customer_office_no", sql.NVarChar, customer_office_no)
      .input("customer_resi_no", sql.NVarChar, customer_resi_no)
      .input("customer_mobile_no", sql.NVarChar, customer_mobile_no)
      .input("customer_fax_no", sql.NVarChar, customer_fax_no)
      .input("customer_email_id", sql.NVarChar, customer_email_id)
      .input("customer_credit_limit", sql.Decimal(14, 3), customer_credit_limit)
      .input("customer_transport_code", sql.NVarChar, customer_transport_code)
      .input("customer_salesman_code", sql.NVarChar, customer_salesman_code)
      .input("customer_broker_code", sql.NVarChar, customer_broker_code)
      .input("customer_weekday_code", sql.NVarChar, customer_weekday_code)
      .input("contact_person", sql.NVarChar, contact_person)
      .input("office_type", sql.NVarChar, office_type)
      .input("default_customer", sql.NVarChar, default_customer)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_customer_details_info @mode,@customer_code,@company_code,@customer_name,'','',@customer_gst_no,
          @customer_addr_1,@customer_addr_2,@customer_addr_3,@customer_addr_4,@customer_area,@customer_state ,@customer_country,
          @customer_imex_no,@customer_office_no,@customer_resi_no,@customer_mobile_no,@customer_fax_no,@customer_email_id,@customer_credit_limit,@customer_transport_code,
          @customer_salesman_code,@customer_broker_code,@customer_weekday_code,@contact_person,@office_type,@default_customer,@keyfield,'', @modified_by, '', '', '', '', '',
          '', '', ''`);

    res.status(200).json("Updated data successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const BankAccountUpdate = async (req, res) => {
  const { company_code, account_code, account_name, acc_addr_1, acc_addr_2, acc_addr_3, acc_addr_4, acc_area_code, acc_state_code,
    acc_country_code, base_accgroup_code, standard_accgroup_code, user_accgroup_code, account_number, IFSC_code, account_type, branch, modified_by, default_bank, } = req.body;

  let bank_paymentQRCode = null;

  if (req.file) {
    bank_paymentQRCode = req.file.buffer;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // update mode
      .input("company_code", sql.NVarChar, company_code)
      .input("account_code", sql.NVarChar, account_code)
      .input("account_name", sql.NVarChar, account_name)
      .input("acc_addr_1", sql.NVarChar, acc_addr_1)
      .input("acc_addr_2", sql.NVarChar, acc_addr_2)
      .input("acc_addr_3", sql.NVarChar, acc_addr_3)
      .input("acc_addr_4", sql.NVarChar, acc_addr_4)
      .input("acc_area_code", sql.NVarChar, acc_area_code)
      .input("acc_state_code", sql.NVarChar, acc_state_code)
      .input("acc_country_code", sql.NVarChar, acc_country_code)
      .input("base_accgroup_code", sql.NVarChar, base_accgroup_code)
      .input("standard_accgroup_code", sql.NVarChar, standard_accgroup_code)
      .input("user_accgroup_code", sql.NVarChar, user_accgroup_code)
      .input("account_number", sql.NVarChar, account_number)
      .input("IFSC_code", sql.NVarChar, IFSC_code)
      .input("account_type", sql.NVarChar, account_type)
      .input("branch", sql.NVarChar, branch)
      .input("bank_paymentQRCode", sql.VarBinary, bank_paymentQRCode)
      .input("default_bank", sql.VarChar, default_bank)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_account_name @mode,@company_code,@account_code,@account_name,@acc_addr_1,@acc_addr_2,@acc_addr_3,@acc_addr_4,
          @acc_area_code,@acc_state_code,@acc_country_code,'','','','','',
          '',0,'','','','',@base_accgroup_code,@standard_accgroup_code,@user_accgroup_code,'','',@account_number,@IFSC_code,@account_type,@branch,'','','',
          @bank_paymentQRCode,@default_bank,'',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,''`);

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const COAUpdate = async (req, res) => {
  //charts of accounts
  const { company_code, account_code, account_name, acc_addr_1, acc_addr_2, acc_addr_3, acc_addr_4, acc_area_code, acc_state_code, acc_country_code, acc_imex_no, acc_office_no, acc_resi_no, acc_mobile_no, acc_fax_no, acc_email_id,
    acc_credit_limit, acc_transport_code, acc_salesman_code, acc_broker_code, acc_weekday_code, base_accgroup_code, standard_accgroup_code, user_accgroup_code, account_subcode, status, panno, gst_no, created_by, modified_by,
  } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // update mode
      .input("company_code", sql.NVarChar, company_code)
      .input("account_code", sql.NVarChar, account_code)
      .input("account_name", sql.NVarChar, account_name)
      .input("acc_addr_1", sql.NVarChar, acc_addr_1)
      .input("acc_addr_2", sql.NVarChar, acc_addr_2)
      .input("acc_addr_3", sql.NVarChar, acc_addr_3)
      .input("acc_addr_4", sql.NVarChar, acc_addr_4)
      .input("acc_area_code", sql.NVarChar, acc_area_code)
      .input("acc_state_code", sql.NVarChar, acc_state_code)
      .input("acc_country_code", sql.NVarChar, acc_country_code)
      .input("acc_imex_no", sql.NVarChar, acc_imex_no)
      .input("acc_office_no", sql.NVarChar, acc_office_no)
      .input("acc_resi_no", sql.NVarChar, acc_resi_no)
      .input("acc_mobile_no", sql.NVarChar, acc_mobile_no)
      .input("acc_fax_no", sql.NVarChar, acc_fax_no)
      .input("acc_email_id", sql.NVarChar, acc_email_id)
      .input("acc_credit_limit", sql.Decimal(14, 3), acc_credit_limit)
      .input("acc_transport_code", sql.NVarChar, acc_transport_code)
      .input("acc_salesman_code", sql.NVarChar, acc_salesman_code)
      .input("acc_broker_code", sql.NVarChar, acc_broker_code)
      .input("acc_weekday_code", sql.NVarChar, acc_weekday_code)
      .input("base_accgroup_code", sql.NVarChar, base_accgroup_code)
      .input("standard_accgroup_code", sql.NVarChar, standard_accgroup_code)
      .input("user_accgroup_code", sql.NVarChar, user_accgroup_code)
      .input("account_subcode", sql.NVarChar, account_subcode)
      .input("status", sql.NVarChar, status)
      .input("panno", sql.NVarChar, panno)
      .input("gst_no", sql.NVarChar, gst_no)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_account_name @mode,@company_code,@account_code,@account_name,@acc_addr_1,@acc_addr_2,@acc_addr_3,@acc_addr_4,
          @acc_area_code,@acc_state_code,@acc_country_code,@acc_imex_no,@acc_office_no,@acc_resi_no,@acc_mobile_no,@acc_fax_no,
          @acc_email_id,@acc_credit_limit,@acc_transport_code,@acc_salesman_code,@acc_broker_code,@acc_weekday_code,@base_accgroup_code,
          @standard_accgroup_code,@user_accgroup_code,@account_subcode,@status,'','','','',@panno,@gst_no,'','','',
          @created_by,@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,''`);

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const UserAccGrpUpdate = async (req, res) => {
  const { user_accgroup_code, user_accgroup_name, standard_accgroup_code, base_accgroup_code, status, created_by, modified_by, } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("user_accgroup_code", sql.NVarChar, user_accgroup_code)
      .input("user_accgroup_name", sql.NVarChar, user_accgroup_name)
      .input("standard_accgroup_code", sql.NVarChar, standard_accgroup_code)
      .input("base_accgroup_code", sql.NVarChar, base_accgroup_code)
      .input("status", sql.NVarChar, status)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_user_account_group @mode,@user_accgroup_code, @user_accgroup_name, @standard_accgroup_code, @base_accgroup_code, @status,
      @created_by,@modified_by, '', '', '', '', '', '', '', ''`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added By Harish 18-10-2024
const getEvent = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Transactions Event','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code Ended By Harish 18-10-2024

const addSalaryDetails = async (req, res) => {
  const { EmployeeId, salaryType, Payscale, PFNo, salary_month, company_code, created_by, modified_by,
    tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4,} = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("EmployeeId", sql.VarChar, EmployeeId)
      .input("salaryType", sql.VarChar, salaryType)
      .input("Payscale", sql.VarChar, Payscale)
      .input("PFNo", sql.NVarChar, PFNo)
      .input("salary_month", sql.Decimal(14, 3), salary_month)
      .input("company_code", sql.NVarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_salary_details @mode,@EmployeeId,'',@salaryType,@Payscale, @PFNo,@salary_month,'',@company_code,@created_by,@modified_by,@tempstr1,
        @tempstr2,@tempstr3,@tempstr4,@datetime1,@datetime2,@datetime3,@datetime4`);
    res.status(200).json("Salary details data inserted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);

    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

const allSalaryDetailsData = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result =
      await sql.query(`EXEC sp_salary_details 'A','','','','','',0,'','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const deleteSalaryDetails = async (req, res) => {
  const { EmployeeId, PFNo, company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("EmployeeId", sql.NVarChar, EmployeeId)
      .input("PFNo", sql.NVarChar, PFNo)
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_salary_details 'D',@EmployeeId,'','',@PFNo,0,'','',@company_code,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res.status(200).json("Employee salary data deleted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);

    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

const updateSalaryDetails = async (req, res) => {
  const { EmployeeId, salaryType, Payscale, PFNo, salary_month, company_code, modified_by, } = req.body;

  try {
    const pool = await connection.connectToDatabase(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // Insert mode
      .input("EmployeeId", sql.VarChar, EmployeeId)
      .input("salaryType", sql.VarChar, salaryType)
      .input("Payscale", sql.VarChar, Payscale)
      .input("PFNo", sql.NVarChar, PFNo)
      .input("salary_month", sql.Decimal(14, 3), salary_month)
      .input("company_code", sql.NVarChar, company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_salary_details @mode,@EmployeeId,'',@salaryType,@Payscale,@PFNo,@salary_month,'',@company_code,'',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res.status(200).json("Employee data updated successfully");
  } catch (err) {
    console.error("Error inserting data:", err);

    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

const getsiblings = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query("EXEC sp_attribute_Info 'F',@company_code,'Siblings','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getkids = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query("EXEC sp_attribute_Info 'F',@company_code,'Kids','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getMartial = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query("EXEC sp_attribute_Info 'F',@company_code,'Marital Status','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addDailyattendance = async (req, res) => {
  const { EmployeeId, date, checkIn, checkOut, Status, company_code, created_by, tempstr1, tempstr2, tempstr3, tempstr4, datetime1, datetime2, datetime3, datetime4, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("EmployeeId", sql.VarChar, EmployeeId)
      .input("date", sql.Date, date)
      .input("checkIn", sql.DateTime, checkIn)
      .input("checkOut", sql.DateTime, checkOut)
      .input("Status", sql.VarChar, Status)
      .input("company_code", sql.NVarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("tempstr1", sql.NVarChar, tempstr1)
      .input("tempstr2", sql.NVarChar, tempstr2)
      .input("tempstr3", sql.NVarChar, tempstr3)
      .input("tempstr4", sql.NVarChar, tempstr4)
      .input("datetime1", sql.NVarChar, datetime1)
      .input("datetime2", sql.NVarChar, datetime2)
      .input("datetime3", sql.NVarChar, datetime3)
      .input("datetime4", sql.NVarChar, datetime4)
      .query(`EXEC sp_daily_attendance 'i',@EmployeeId,@date, '','','','','','',@company_code,'','',null,null, null,null,null,null,null,null`);
    res.status(200).json("Check IN data inserted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

const getSalaryType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query("EXEC sp_attribute_Info 'F',@company_code,'Salary Type','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPayscale = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query("EXEC sp_attribute_Info 'F',@company_code,'Payscale','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code Ended by Harish 14-11-2024

const getLoanID = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query("EXEC sp_attribute_Info 'F',@company_code,'LoanID','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added By Harish  18_11_2024
const getItem = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query("EXEC sp_attribute_Info 'F',@company_code,'product','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getDocumentType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query("EXEC sp_attribute_Info 'F',@company_code,'document type','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code Added by Pavun 30/11/2024
const getCustomerDetails = async (req, res) => {
  const { company_code, customer_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "TC")
      .input("company_code", sql.NVarChar, company_code)
      .input("customer_code", sql.NVarChar, customer_code)
      .query(`EXEC sp_customer_details_info @mode,@customer_code,@company_code,'','','','','','','','','','','','','','','','','',0,'','','','','','','','',
        '','',NULL,NULL,NULL,null,null,null,null,null`,);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code Added by Harish 03/12/2024

const getrelation = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query("EXEC sp_attribute_Info 'F',@company_code,'Relationship','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code Ended by Harish 03/12/2024

const getannoncementtype = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query("EXEC sp_attribute_Info 'F',@company_code,'AnnouncementType','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const getAnnouncementDetail = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'AnnouncementDetail','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAnnouncement_Msg = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Announcement_Msg','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by pavun 13-12-2024

const getAnnouncement = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Annoucement','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by mathu 16-12-2024
const getcompanyshift = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'ESS_SHIFT','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code Added by Harish on 20/12/24

const getOverallTAX = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'tax type','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getInvocieType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Invoice Type','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by pavun 25-12-2024
const getVendorDetails = async (req, res) => {
  const { company_code, vendor_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "PV")
      .input("company_code", sql.NVarChar, company_code)
      .input("vendor_code", sql.NVarChar, vendor_code)
      .query(
        `EXEC sp_vendor_details_info_hdr @mode,@vendor_code,@company_code,'','','','','','','','','','' ,'','','','','','','',0,'','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code added by harish 27/12/2024
const TermsDC = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'TermsConditionDC','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const TermsQO = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'TermsConditionQO','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const TermsPO = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'TermsConditionsPO','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const TermsTI = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'TermsConditionTI','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//CODE ADDED BY PAVUN 27-12-2024
const getFinancialDetailsSearchCretria = async (req, res) => {
  const { EmployeeId, Name, salaryType, Payscale, salary_month, company_code } =
    req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("EmployeeId", sql.NVarChar, EmployeeId)
      .input("Name", sql.NVarChar, Name)
      .input("salaryType", sql.NVarChar, salaryType)
      .input("Payscale", sql.NVarChar, Payscale)
      .input("salary_month", sql.Decimal(14, 2), salary_month)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_salary_details @mode,@EmployeeId,@Name,@salaryType,@Payscale,'',@salary_month,'',@company_code,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code ended by pavun
const getLeaveType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'LeaveType','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getSelectSlot = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Select_Slot','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getDashBoardType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'DB Type','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getGST = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'GST','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getPartyName = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'PartyName','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getGSTReport = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'GF',@company_code,'GSTReport','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Type','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getAccrual = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'AccrualType','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getExceedLeave = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Exceed_Leave','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getLeaveReason = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Leave_Reason','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code Added by Harish on 10/01/25
const DailyattendanceandTime = async (req, res) => {
  const { EmployeeId, company_code, start_date, end_date } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "CL") // Insert mode
      .input("EmployeeId", sql.VarChar, EmployeeId)
      .input("start_date", sql.NVarChar, start_date)
      .input("end_date", sql.NVarChar, end_date)
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_daily_attendance 'CL',@EmployeeId,'','','','','',@start_date,@end_date,@company_code,'','',null,null,null,null,null,null,null,null
`);
    if (
      result.recordsets &&
      result.recordsets.length > 0 &&
      result.recordsets[0].length > 0
    ) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCustomerCodeDrop = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "CD")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_customer_info_hdr @mode,@company_code,'','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data Not Found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by pavun 10/01/25
const getPendingStatus = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'PendingStatus','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//code ended by pavun

// Code Added by harish on 16/01/2025

const getdefCustomer = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'DefaultCust','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//CODE ADDED BY PAVUN 22-01-2025
const getSalesMode = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'SalesMode','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//CODE ENDED BY PAVUN

//Code Added by pavun 30-01-2025
const getPurchaseAnalysis = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Purchase','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code Ended by Pavun

//code added by kathiravan 01-02-2025
const addDailyLogin = async (req, res) => {
  const { userID, DayofLogin, DeviceDetails, company_code, IP_Address, Location, created_by, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I") // Insert mode
      .input("userID", sql.VarChar, userID)
      .input("DayofLogin", sql.Date, DayofLogin)
      .input("DeviceDetails", sql.VarChar, DeviceDetails)
      .input("IP_Address", sql.VarChar, IP_Address)
      .input("Location", sql.VarChar, Location)
      .input("company_code", sql.VarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .query(
        `EXEC sp_DailyLogin @mode,@userID,@DayofLogin,'','','','',@DeviceDetails,@IP_Address,@Location,@company_code,@created_by,'',null,null,null,null,null,null,null,null`,
      );
    res.status(200).json("Check IN data inserted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

const addDailyTask = async (req, res) => {
  const { TaskMasterID, DailyTaskID, DailyTaskTiltle, HourseTaken, TaskDescription, TaskStauts, userID, PriorityLevel, company_code, created_by, } = req.body;
  let pool;

  let Files = null;
  if (req.file) {
    Files = req.file.buffer; // Buffer containing the uploaded IMG
  }

  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("TaskMasterID", sql.VarChar, TaskMasterID)
      .input("DailyTaskID", sql.VarChar, DailyTaskID)
      .input("DailyTaskTiltle", sql.VarChar, DailyTaskTiltle)
      .input("HourseTaken", sql.Decimal(10, 2), HourseTaken)
      .input("TaskDescription", sql.VarChar, TaskDescription)
      .input("TaskStauts", sql.VarChar, TaskStauts)
      .input("userID", sql.VarChar, userID)
      .input("PriorityLevel", sql.VarChar, PriorityLevel)
      .input("Files", sql.VarBinary, Files)
      .input("company_code", sql.NVarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .query(`EXEC sp_DailyTask @mode,@TaskMasterID,@DailyTaskID,@DailyTaskTiltle,@HourseTaken,@TaskDescription,@TaskStauts,@userID,@PriorityLevel,@Files,@company_code,
        @created_by,'',null,null,null,null,null,null,null,null`,);
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json(err.message);
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const delDailyTask = async (req, res) => {
  const { DailyTaskID } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "D") // Insert mode
      .input("DailyTaskID", sql.VarChar, DailyTaskID)
      .query(`EXEC sp_DailyTask @mode,'',@DailyTaskID,'','','','','','','','','',null,null,null,null,null,null,null,null`,);
    res.status(200).json("Daily Task Deleted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

// Code Added by Harish 03-02-2025

const getTaskstatus = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Taskstatus','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by pavun 05-02-2025

const PendingCustomer = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'PendingCustomer','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code ended by pavun

//code added by pavun 06-02-2025
const updateBankAccount = async (req, res) => {
  const { company_code, account_code, account_name, acc_addr_1, acc_addr_2, acc_addr_3, acc_addr_4, acc_area_code, acc_state_code, acc_country_code, base_accgroup_code,
    standard_accgroup_code, user_accgroup_code, account_number, IFSC_code, account_type, branch, default_bank, modified_by, } = req.body;

  let bank_paymentQRCode = null;

  if (req.file) {
    bank_paymentQRCode = req.file.buffer;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("account_code", sql.NVarChar, account_code)
      .input("account_name", sql.NVarChar, account_name)
      .input("acc_addr_1", sql.NVarChar, acc_addr_1)
      .input("acc_addr_2", sql.NVarChar, acc_addr_2)
      .input("acc_addr_3", sql.NVarChar, acc_addr_3)
      .input("acc_addr_4", sql.NVarChar, acc_addr_4)
      .input("acc_area_code", sql.NVarChar, acc_area_code)
      .input("acc_state_code", sql.NVarChar, acc_state_code)
      .input("acc_country_code", sql.NVarChar, acc_country_code)
      .input("base_accgroup_code", sql.NVarChar, base_accgroup_code)
      .input("standard_accgroup_code", sql.NVarChar, standard_accgroup_code)
      .input("user_accgroup_code", sql.NVarChar, user_accgroup_code)
      .input("account_number", sql.NVarChar, account_number)
      .input("IFSC_code", sql.NVarChar, IFSC_code)
      .input("account_type", sql.NVarChar, account_type)
      .input("branch", sql.NVarChar, branch)
      .input("bank_paymentQRCode", sql.VarBinary, bank_paymentQRCode)
      .input("default_bank", sql.VarChar, default_bank)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_account_name @mode, @company_code,@account_code, @account_name, @acc_addr_1, @acc_addr_2, @acc_addr_3, @acc_addr_4, @acc_area_code, @acc_state_code, 
      @acc_country_code, '','','','','','',0,'','','','',@base_accgroup_code,@standard_accgroup_code,@user_accgroup_code,'','',@account_number,@IFSC_code,@account_type,@branch,'','','',
      @bank_paymentQRCode,@default_bank,'',@modified_by,NULL, NULL,NULL, NULL,NULL, NULL,NULL,NULL,''`);
    // Return success response
    res.json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//code ended by pavun

// Code Added By harish 07-02-25
const getPriority = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'PriorityLevel','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Ended By harish 07-02-25

//code added by pavun 14-02-2025
const getTaskDetailReport = async (req, res) => {
  const { TaskMasterID } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "TD")
      .input("TaskMasterID", sql.VarChar, TaskMasterID)
      .query(
        `EXEC sp_DailyTask @mode,@TaskMasterID,'','',0,'','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//code ended by pavun

const Userdropdown = async (req, res) => {
  const { user_code } = req.body;
  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();
    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "MG")
      .input("user_code", sql.NVarChar, user_code)
      .query(
        `EXEC [sp_user_info_hdr] @mode,'',@user_code,'','','','','','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code ended by pavun

//Code Added By Harish 07/03/2025
const DailyLogin = async (req, res) => {
  const { userID, DayofLogin, DeviceDetails, company_code, IP_Address, Location, created_by, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "IN") // Insert mode
      .input("userID", sql.VarChar, userID)
      .input("DayofLogin", sql.Date, DayofLogin)
      .input("DeviceDetails", sql.VarChar, DeviceDetails)
      .input("IP_Address", sql.VarChar, IP_Address)
      .input("Location", sql.VarChar, Location)
      .input("company_code", sql.VarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .query(
        `EXEC sp_DailyLogin @mode,@userID,@DayofLogin,'','','','',@DeviceDetails,@IP_Address,@Location,@company_code,@created_by,'',null,null,null,null,null,null,null,null`,
      );
    res.status(200).json("Check IN data inserted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};
const DailyLogOUT = async (req, res) => {
  const { userID, DayofLogin, DeviceDetails, IP_Address, company_code, Location, created_by, } = req.body;
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "OUT") // Insert mode
      .input("userID", sql.VarChar, userID)
      .input("DayofLogin", sql.Date, DayofLogin)
      .input("DeviceDetails", sql.VarChar, DeviceDetails)
      .input("IP_Address", sql.VarChar, IP_Address)
      .input("Location", sql.VarChar, Location)
      .input("company_code", sql.VarChar, company_code)
      .input("created_by", sql.NVarChar, created_by)
      .query(
        `EXEC sp_DailyLogin @mode,@userID,@DayofLogin,'','','','',@DeviceDetails,@IP_Address,@Location,@company_code,@created_by,'',null,null,null,null,null,null,null,null`,
      );
    res.status(200).json("Check out data inserted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};
//Code Ended By Harish 07/03/2025

//code added by harish 13-03-2025
const GetCC = async (req, res) => {
  let pool;
  try {
    pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "CC")
      .query(
        `EXEC sp_Stock_Validation_Status @mode,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const InsertStockVal = async (req, res) => {
  const { company_code, Validation_status, Screens, created_by } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("company_code", sql.VarChar, company_code)
      .input("Validation_status", sql.VarChar, Validation_status)
      .input("Screens", sql.VarChar, Screens)
      .input("created_by", sql.VarChar, created_by)
      .query(
        `EXEC sp_Stock_Validation_Status @mode,@company_code,@Validation_status,@Screens,@created_by,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.status(200).json("Data inserted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

const updateStockVal = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }
  try {
    const pool = await connection.connectToDatabase();
    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("company_code", sql.NVarChar, updatedRow.company_code)
        .input("Validation_status", sql.NVarChar, updatedRow.Validation_status)
        .input("Screens", sql.NVarChar, updatedRow.Screens)
        .input("modified_by", sql.NVarChar, req.headers["modified-by"])
        .query(
          `EXEC sp_Stock_Validation_Status @mode,@company_code,@Validation_status,@Screens,'',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
        );
    }
    res.status(200).json("data updated successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updateStockValStatus = async (req, res) => {
  const { company_code, Validation_status, Screens, modified_by } = req.body;
  try {
    const pool = await connection.connectToDatabase(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // Insert mode
      .input("company_code", sql.NVarChar, company_code)
      .input("Validation_status", sql.NVarChar, Validation_status)
      .input("Screens", sql.NVarChar, Screens)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_Stock_Validation_Status @mode,@company_code,@Validation_status,@Screens,'',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.status(200).json("Data updated successfully");
  } catch (err) {
    console.error("Error Updating data:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

const deleteStockValue = async (req, res) => {
  const StockValueToDelete = req.body.StockValueToDelete;
  if (!StockValueToDelete || !StockValueToDelete.length) {
    res.status(400).json("Invalid or empty Taskmaster Code array.");
    return;
  }
  try {
    const pool = await connection.connectToDatabase();
    for (const updatedRow of StockValueToDelete) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "D")
        .input("company_code", sql.NVarChar, updatedRow.company_code)
        .query(
          `EXEC sp_Stock_Validation_Status @mode,@company_code,'','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
        );
    }
    res.json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const StockSC = async (req, res) => {
  const { company_code, Validation_status, Screens } = req.body;
  try {
    // Connect to the database
    const pool = await connection.connectToDatabase();
    // Execute the query
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.VarChar, company_code)
      .input("Validation_status", sql.VarChar, Validation_status)
      .input("Screens", sql.VarChar, Screens)
      .query(
        `EXEC sp_Stock_Validation_Status @mode,@company_code,@Validation_status,@Screens,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Ended by Harish on 13/03/25

const getAnnouncementDuration = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'AnnounceDuration','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code Added by Harish on 18/03/25
const AddFileAttachment = async (req, res) => {
  const { TaskMasterID, DailyTaskID, created_by } = req.body;
  let pool;
  let transaction;

  try {
    pool = await sql.connect(dbConfig);
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    for (const file of req.files) {
      await new sql.Request(transaction)
        .input("TaskMasterID", sql.VarChar, TaskMasterID)
        .input("Files", sql.VarBinary, file.buffer)
        .input("DailyTaskID", sql.NVarChar, DailyTaskID)
        .input("created_by", sql.NVarChar, created_by)
        .input("created_date", sql.DateTime, new Date()).query(`
          INSERT INTO tbl_PMS_Task_File_Attachment 
          (TaskMasterID, Files, DailyTaskID, Created_by, created_date)
          VALUES (@TaskMasterID, @Files, @DailyTaskID, @created_by, @created_date)
        `);
    }

    await transaction.commit();
    res
      .status(200)
      .json({ message: `${req.files.length} files inserted successfully` });
  } catch (err) {
    console.error("Error inserting data:", err);
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr);
      }
    }
    res.status(500).json({ message: err.message || "Internal Server Error" });
  } finally {
    if (pool) {
      pool.close();
    }
  }
};

//code added by pavun on 15-04-25
const getDocument = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'DocumentType','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code ended by pavun on 15-04-25

//code added by pavun on 21-04-25
const sendAutoMail = async (req, res) => {
  const { email } = req.body;

  try {
    const mailOptions = {
      from: "alert@yjktechnologies.com",
      to: email,
      subject: "Working Hours Exceeded",
      text: "You have worked more than 8 hours today. Please take a break!",
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Mail sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send mail", error });
  }
};
// code ended by pavun on 21-04-25

//code added by pavun on 09-05-25
const updateRoleRights = async (req, res) => {
  const { company_code, role_id, screen_type, permission_type, keyfield, modified_by, } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("company_code", sql.VarChar, company_code)
      .input("role_id", sql.VarChar, role_id)
      .input("screen_type", sql.NVarChar, screen_type)
      .input("permission_type", sql.VarChar, permission_type)
      .input("keyfield", sql.VarChar, keyfield)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(`EXEC sp_rolescreen_mapping @mode,@company_code, @role_id, @screen_type, @permission_type, @keyfield,'', @modified_by,  
               NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL`);
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code ended by pavun on 09-05-25

//code added by pavun on 10-05-25

const termsandCondition = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_attribute_Info 'F',@company_code,'Terms&Conditions','','', '' , '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const customerCodeDropdown = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "CC")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_customer_details_info @mode,'',@company_code,'','','','','','','','','','','','','','','','','',0,'','','','','','','','','','',NULL,NULL,NULL,null,null,null,null,null`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code ended by pavun on 10-05-25

//code added by mathu on 12-05-25

const getLockType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Lock_Type','','', '' ,'','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code ended by mathu on 12-05-25

//code added by pavun on 13-05-25

const vendorCodeDropdown = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "VC")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_vendor_details_info_hdr @mode,'',@company_code,'','','','','','','','','','' ,'','','','','','','',0,'','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    if (result.recordset && result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code ended by pavun on 13-05-25

const getPrint = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Print_options','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getcopies = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Print_copies','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Added by Harish on 19-05-2025

// Code  Added by Harish on 24-05-25

const AddClientBugs = async (req, res) => {
  const { Project, Task, Date, Screens, company_code, Description, Client_user, created_by, } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Date", sql.Date, Date)
      .input("Task	", sql.Date, Task)
      .input("Project	", sql.VarChar, Project)
      .input("Screens	", sql.VarChar, Screens)
      .input("Description", sql.VarChar, Description)
      .input("Client_user", sql.VarChar, Client_user)
      .input("@company_code", sql.VarChar, company_code)
      .input("created_by", sql.VarChar, created_by)
      .query(`EXEC sp_Client_bugs @mode,'',@Date,@Task,@Project,@Screens,@Description,@Client_user,'','','',@company_code,@created_by,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
`);
    res.status(200).json("Data Inserted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const DeleteClientBugs = async (req, res) => {
  const { sno, company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("company_code", sql.NVarChar, company_code)
      .input("sno", sql.NVarChar, sno)
      .query(`EXEC sp_Client_bugs @mode,@sno,'','','','','','','','','',@company_code,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
`);
    res.status(200).json("data deleted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const UpdateClientBugs = async (req, res) => {
  const { company_code, Date, sno, Task, Project, Screens, Description, Client_user, modified_by, } = req.body;
  let pool;
  try {
    const pool = await connection.connectToDatabase(dbConfig);

    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // update mode
      .input("company_code", sql.NVarChar, company_code)
      .input("sno", sql.BigInt, sno)
      .input("Date", sql.NVarChar, Date)
      .input("Task", sql.NVarChar, Task)
      .input("Project", sql.NVarChar, Project)
      .input("Screens", sql.NVarChar, Screens)
      .input("Description", sql.NVarChar, Description)
      .input("Client_user", sql.NVarChar, Client_user)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_Client_bugs @mode,@sno,@Date,@Task,@Project,@Screens,@Description,@Client_user,'','','',@company_code,'',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getClientbugs = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_Client_bugs @mode,'','','','','','','','','','',@company_code,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code Added by Harish on 14/06/25
const WeekOff = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Week_Off','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by pavun on 17-06-25
const addCRMClient = async (req, res) => {
  const { company_code, contact_no, company_name, Contact_name, client_name, client_email, Expected_revenue, Monthly_revenue, created_by, } = req.body;
  try {
    const pool = await connection.connectToDatabase(dbConfig);

    await pool
      .request()
      .input("mode", sql.NVarChar, "I") // update mode
      .input("company_code", sql.NVarChar, company_code)
      .input("company_name", sql.VarChar, company_name)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("Contact_name", sql.NVarChar, Contact_name)
      .input("client_name", sql.NVarChar, client_name)
      .input("client_email", sql.NVarChar, client_email)
      .input("Expected_revenue", sql.Decimal(10, 2), Expected_revenue)
      .input("Monthly_revenue", sql.Decimal(10, 2), Monthly_revenue)
      .input("created_by", sql.NVarChar, created_by)
      .query(
        `EXEC sp_CRM_Clients @mode,@company_code,@company_name,@contact_no,@Contact_name,@client_name,@client_email,@Expected_revenue,@Monthly_revenue,'',@created_by,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.status(200).json("data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updateCRMClient = async (req, res) => {
  const { company_code, contact_no, company_name, Contact_name, client_name, client_email, Expected_revenue, Monthly_revenue, modified_by, } = req.body;
  try {
    const pool = await connection.connectToDatabase(dbConfig);

    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // update mode
      .input("company_code", sql.NVarChar, company_code)
      .input("company_name", sql.VarChar, company_name)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("Contact_name", sql.VarChar, Contact_name)
      .input("client_name", sql.VarChar, client_name)
      .input("client_email", sql.NVarChar, client_email)
      .input("Expected_revenue", sql.Decimal(10, 2), Expected_revenue)
      .input("Monthly_revenue", sql.Decimal(10, 2), Monthly_revenue)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_CRM_Clients @mode,@company_code,@company_name,@contact_no,@Contact_name,@client_name,@client_email,@Expected_revenue,@Monthly_revenue,'','','','',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.status(200).json("data updated successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const deleteCRMClient = async (req, res) => {
  const { contact_no } = req.body;
  try {
    const pool = await connection.connectToDatabase(dbConfig);

    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("contact_no", sql.NVarChar, contact_no)
      .query(
        `EXEC sp_CRM_Clients @mode,'','',@contact_no,'','','',0,0,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.status(200).json("data deleted successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCRMClient = async (req, res) => {
  const { contact_no } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("contact_no", sql.NVarChar, contact_no)
      .query(
        `EXEC sp_CRM_Clients 'A','','',@contact_no,'','','',0,0,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRMClientSearch = async (req, res) => {
  const { company_code, contact_no, company_name, Contact_name, client_name, client_email, Expected_revenue, Monthly_revenue, } = req.body;
  try {
    const pool = await connection.connectToDatabase(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("company_name", sql.VarChar, company_name)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("Contact_name", sql.VarChar, Contact_name)
      .input("client_name", sql.VarChar, client_name)
      .input("client_email", sql.NVarChar, client_email)
      .input("Expected_revenue", sql.Decimal(10, 2), Expected_revenue)
      .input("Monthly_revenue", sql.Decimal(10, 2), Monthly_revenue)
      .query(
        `EXEC sp_CRM_Clients @mode,@company_code,@company_name,@contact_no,@Contact_name,@client_name,@client_email,@Expected_revenue,@Monthly_revenue,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const addCRMContacts = async (req, res) => {
  const { Name, contact_no, email, Address, Country, company_code, Screen_mode, Contact_info_id, Notes,
    company_name, contact_name, type_of_contact, Aadhar, Pan, Contact_ID, status, created_by, } = req.body;
  let Image = null;

  if (req.file) {
    Image = req.file.buffer; // Buffer containing the uploaded image
  }
  try {
    const pool = await connection.connectToDatabase(dbConfig);

    await pool
      .request()
      .input("mode", sql.NVarChar, "I") // update mode
      .input("Name", sql.VarChar, Name)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("email", sql.VarChar, email)
      .input("Address", sql.VarChar, Address)
      .input("Country", sql.VarChar, Country)
      .input("Aadhar", sql.VarChar, Aadhar)
      .input("Pan", sql.VarChar, Pan)
      .input("company_code", sql.VarChar, company_code)
      .input("Image", sql.VarBinary, Image)
      .input("Screen_mode", sql.VarChar, Screen_mode)
      .input("Notes", sql.VarChar, Notes)
      .input("Contact_info_id", sql.Int, Contact_info_id)
      .input("company_name", sql.VarChar, company_name)
      .input("contact_name", sql.VarChar, contact_name)
      .input("type_of_contact", sql.VarChar, type_of_contact)
      .input("Contact_ID", sql.Int, Contact_ID)
      .input("status", sql.NVarChar, status)
      .input("created_by", sql.NVarChar, created_by)
      .query(
        `EXEC sp_CRM_Contacts @mode,@Name,@contact_no,@email,@Address,@Country,@Aadhar,@Pan,'',@company_code,@Image,@Screen_mode,@Notes,@Contact_info_id,@company_name,@contact_name,@type_of_contact,@Contact_ID,@status,@created_by,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.status(200).json("data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updateCRMContacts = async (req, res) => {
  const { Name, contact_no, email, Address, company_code, Country, Aadhar, Pan, company_name, contact_name, type_of_contact, keyfield, status, modified_by,} = req.body;
  try {
    const pool = await connection.connectToDatabase(dbConfig);

    await pool
      .request()
      .input("mode", sql.NVarChar, "U") // update mode
      .input("Name", sql.VarChar, Name)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("email", sql.VarChar, email)
      .input("Address", sql.VarChar, Address)
      .input("Country", sql.VarChar, Country)
      .input("Aadhar", sql.VarChar, Aadhar)
      .input("Pan", sql.VarChar, Pan)
      .input("company_name", sql.VarChar, company_name)
      .input("contact_name", sql.VarChar, contact_name)
      .input("type_of_contact", sql.VarChar, type_of_contact)
      .input("keyfield", sql.VarChar, keyfield)
      .input("company_code", sql.NVarChar, company_code)
      .input("status", sql.NVarChar, status)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_CRM_Contacts @mode,@Name,@contact_no,@email,@Address,@Country,@Aadhar,@Pan,@keyfield,@company_code,NULL,'','',0,@company_name,@contact_name,@type_of_contact,0,@status,'',@modified_by,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.status(200).json("data updated successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// datacontroller.js
const deleteCRMContacts = async (req, res) => {
  const { company_code, contact_no, email, Name } = req.body;

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("contact_no", sql.NVarChar, contact_no)
      .input("email", sql.NVarChar, email)
      .input("Name", sql.NVarChar, Name)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_Contacts @mode,@Name,@contact_no,@email,'','','','','',@company_code,'','','',0,'','','',0,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({
      message: err.message || "Failed to delete contact",
    });
  }
};

const getCRMContacts = async (req, res) => {
  const { keyfield } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("keyfield", sql.NVarChar, keyfield)
      .query(
        `EXEC sp_CRM_Contacts 'A','','','','','','','',@keyfield,'','','','',0,'','','',0,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCRMContactName = async (req, res) => {
  try {
    await connection.connectToDatabase();
    const result = await sql.query(
      `EXEC sp_CRM_Contacts 'F','','','','','','','','','','','','',0,'','','',0,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
    );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code ended by pavun on 17-06-25

// Code Added by harish on 17-06-25
const GenerateEmployee = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'GenerateEmpId','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by harish on 20-06-2025
const GetUserCheckIN = async (req, res) => {
  const { userid } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FC")
      .input("userid", sql.NVarChar, userid)
      .query(` EXEC sp_DailyLogin @mode,@userid,'','','','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//code ended by harish on 20-06-25

//code added by pavun on 23-06-25

const getLeaveStatus = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "F")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'LeaveStatus','','', '' ,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code ended by pavun on 23-06-25

//code added by pavun on 25-06-25
const getCheckInStatus = async (req, res) => {
  const { userID, company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "CICO")
      .input("userID", sql.NVarChar, userID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_DailyLogin @mode,@userID,'','','','','','','','',@company_code,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//code ended by pavun on 25-06-25

const GetPaymentMode = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'PaymentMode','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const GetPaymentType = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'PaymentType','','', '','','', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error during update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Client_PaymentInsert = async (req, res) => {
  const { Client_code, Payment_Date, Payment_type, Notes, Payment, Product_ID, Keyfield, Company_code, created_by, created_date, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Client_code", sql.NVarChar, Client_code)
      .input("Payment_Date", sql.Date, Payment_Date)
      .input("Payment_type", sql.NVarChar, Payment_type)
      .input("Payment", sql.Decimal(12, 2), Payment)
      .input("Notes", sql.NVarChar, Notes)
      .input("Product_ID", sql.NVarChar, Product_ID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("created_date", sql.NVarChar, created_date)
      .query(
        `EXEC sp_Client_Payment @mode,'', @Client_code, @Payment_Date, @Payment_type, @Payment, @Notes,@Product_ID,'',@Company_code, @created_by, @created_date,'', '',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res
      .status(200)
      .json({ success: true, message: "Client_Payment insertd successfully" });
  } catch (err) {
    console.error("Error during Client_Payment insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Client_PaymentUpdate = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await sql.connect(dbConfig);
    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("Client_code", updatedRow.Client_code)
        .input("Payment_Date", updatedRow.Payment_Date)
        .input("Payment_type", updatedRow.Payment_Type)
        .input("Payment", updatedRow.Payment)
        .input("Notes", updatedRow.Notes)
        .input("Keyfield", updatedRow.Keyfield)
        .input("Company_code", sql.NVarChar, req.headers["company_code"])
        .input("modified_by", sql.NVarChar, req.headers["modified_by"])
        .query(
          `EXEC sp_Client_Payment @mode,0, @Client_code, @Payment_Date, @Payment_type, @Payment, @Notes,'',@Keyfield,@Company_code,'', '', @modified_by, '',NUll,NUll,NUll,NUll,NUll,NUll,NUll,NUll`,
        );
    }
    res
      .status(200)
      .json({ success: true, message: "Client_Payment updated successfully" });
  } catch (err) {
    console.error("Error during Client_Payment update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Client_PaymentDelete = async (req, res) => {
  const keyfieldToDelete = req.body.keyfieldToDelete;

  if (!keyfieldToDelete || !keyfieldToDelete.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await sql.connect(dbConfig);
    for (const deletedRow of keyfieldToDelete) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "D")
        .input("Keyfield", deletedRow.Keyfield)
        .input("Company_code", sql.NVarChar, req.headers["company_code"])
        .query(
          `EXEC sp_Client_Payment @mode,0,'','','',0,'','',@Keyfield,@Company_code,'','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
        );
    }
    res
      .status(200)
      .json({ success: true, message: "Client_Payment deleted successfully" });
  } catch (err) {
    console.error("Error during Client_Payment delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Client_PaymentLoopUpdate = async (req, res) => {
  const Client_PaymentData = req.body.Client_PaymentData;
  if (!Client_PaymentData || !Client_PaymentData.length) {
    return res.status(400).json("Invalid or empty Client_PaymentData array.");
  }

  try {
    const pool = await sql.connect(dbConfig);
    for (const item of Client_PaymentData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U")
        .input("Client_code", sql.NVarChar, item.Client_code)
        .input("Payment_Date", sql.Date, item.Payment_Date)
        .input("Payment_type", sql.NVarChar, item.Payment_type)
        .input("Payment", sql.Decimal(12, 2), item.Payment)
        .input("Notes", sql.NVarChar, item.Notes)
        .input("Product_ID", sql.NVarChar, item.Product_ID)
        .input("Keyfield", sql.NVarChar, item.Keyfield)
        .input("Company_code", sql.NVarChar, item.Company_code)
        .input("modified_by", sql.NVarChar, item.modified_by)
        .query(
          `EXEC sp_Client_Payment @mode,'', @Client_code, @Payment_Date, @Payment_type, @Payment,@Product_ID,@Keyfield,@Company_code, '','', @modified_by,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
        );
    }
    res.status(200).json("Client_Payment data updated successfully");
  } catch (err) {
    console.error("Error in Client_PaymentLoopUpdate:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Client_PaymentLoopDelete = async (req, res) => {
  const Client_PaymentData = req.body.Client_PaymentData;
  if (!Client_PaymentData || !Client_PaymentData.length) {
    return res.status(400).json("Invalid or empty Client_PaymentData array.");
  }

  try {
    const pool = await sql.connect(dbConfig);
    for (const item of Client_PaymentData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "D")
        .input("Keyfield", sql.NVarChar, item.Keyfield)

        .query(
          `EXEC sp_Client_Payment @mode,'','', '','',0,'','',@Keyfield,'','','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
        );
    }
    res.status(200).json("Client_Payment data deleted successfully");
  } catch (err) {
    console.error("Error in Client_PaymentLoopDelete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const GetClient_PaymentData = async (req, res) => {
  const { Client_code, Company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FC")
      .input("Client_code", sql.NVarChar, Client_code)
      .input("Company_code", sql.NVarChar, Company_code)
      .query(
        `EXEC sp_Client_Payment @mode,'', @Client_code,'','', 0,'','','',@Company_code, '','', '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const GetClient_PaymentDataSearch = async (req, res) => {
  const { Client_code, Payment_Type, Payment_Date, Payment, Company_code } =
    req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SCC")
      .input("Client_code", sql.NVarChar, Client_code)
      .input("Payment_Type", sql.NVarChar, Payment_Type)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Payment_Date", sql.NVarChar, Payment_Date)
      .input("Payment", sql.Decimal(12, 2), Payment)
      .query(
        `EXEC sp_Client_Payment @mode, '',@Client_code,@Payment_Date,@Payment_Type,@Payment,'','','',@Company_code, '','', '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_NewCompanyInsert = async (req, res) => {
  const { CompanyID, OpportunityName, Followups_jobposition, Followup_Pincode, Followup_State, Followup_Country, Followup_CompanyName, Followup_CompanyAddress1, Followup_City, Followup_CompanyAddress2, SalesTeam_Code, Sales_man_code, Medium_ID, Referred_BY, Source_ID, campaignID,
    Contact_Followups, ContactName, Priority, Email_ID, ContactPhone, ExpectedRevenue, Payment, PaymentType, ExpectedClosing, Stage,
    Website, company_code, Status, Contact_ID, keyfield, sourceType, Created_by,} = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("CompanyID", sql.Int, CompanyID)
      .input("OpportunityName", sql.NVarChar, OpportunityName)
      .input("ContactName", sql.NVarChar, ContactName)
      .input("ContactPhone", sql.NVarChar, ContactPhone)
      .input("ExpectedRevenue", sql.Decimal(12, 2), ExpectedRevenue)
      .input("Payment", sql.Decimal(12, 2), Payment)
      .input("PaymentType", sql.NVarChar, PaymentType)
      .input("ExpectedClosing", sql.Date, ExpectedClosing)
      .input("Email_ID", sql.NVarChar, Email_ID)
      .input("Priority", sql.NVarChar, Priority)
      .input("Contact_Followups", sql.NVarChar, Contact_Followups)
      .input("Followups_jobposition", sql.NVarChar, Followups_jobposition)
      .input("Sales_man_code", sql.NVarChar, Sales_man_code)
      .input("campaignID", sql.NVarChar, campaignID)
      .input("Medium_ID", sql.NVarChar, Medium_ID)
      .input("Source_ID", sql.NVarChar, Source_ID)
      .input("Referred_BY", sql.NVarChar, Referred_BY)
      .input("SalesTeam_Code", sql.NVarChar, SalesTeam_Code)
      .input("Followup_CompanyName", sql.NVarChar, Followup_CompanyName)
      .input("Followup_CompanyAddress1", sql.NVarChar, Followup_CompanyAddress1)
      .input("Followup_CompanyAddress2", sql.NVarChar, Followup_CompanyAddress2)
      .input("Followup_City", sql.NVarChar, Followup_City)
      .input("Followup_State", sql.NVarChar, Followup_State)
      .input("Followup_Country", sql.NVarChar, Followup_Country)
      .input("Followup_Pincode", sql.NVarChar, Followup_Pincode)
      .input("Stage", sql.NVarChar, Stage)
      .input("Contact_ID", sql.Int, Contact_ID)
      .input("Website", sql.NVarChar, Website)
      .input("company_code", sql.NVarChar, company_code)
      .input("Status", sql.NVarChar, Status)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("sourceType", sql.NVarChar, sourceType)
      .input("Created_by", sql.NVarChar, Created_by)
      .query(`EXEC sp_CRM_NewCompany @mode, @CompanyID, '', '', 0, @OpportunityName, @ContactName, @ContactPhone, @ExpectedRevenue, @Payment, @PaymentType, @ExpectedClosing, @Email_ID, @Priority, @Contact_Followups,
        @Followups_jobposition, @Sales_man_code, @campaignID, @Medium_ID, @Source_ID, @Referred_BY, @SalesTeam_Code, @Followup_CompanyName, @Followup_CompanyAddress1, @Followup_CompanyAddress2, @Followup_City, @Followup_State,
        @Followup_Country, @Followup_Pincode, @Stage,@Contact_ID,@Website, @company_code, @Status, @keyfield,@sourceType,'',0,'','',@Created_by, '', '', ''`);
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json(err.message);
    }
  } catch (err) {
    console.error("Error during CRM_NewCompany insert:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_NewCompanyUpdate = async (req, res) => {
  const { Opportunity_ID, CompanyID, OpportunityName, Followups_jobposition, Followup_Pincode, Followup_State, Followup_Country, Followup_CompanyName, Followup_CompanyAddress1, Followup_City, Followup_CompanyAddress2, SalesTeam_Code, Sales_man_code,
    Medium_ID, Referred_BY, Source_ID, campaignID, Contact_Followups, ContactName, Priority, Email_ID, ContactPhone, ExpectedRevenue, Payment, PaymentType, ExpectedClosing, Stage,
    Website, company_code, Status, keyfield, modified_by, modified_date, Contact_ID, sourceType, Notes, probability, Tags, } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("CompanyID", sql.Int, CompanyID)
      .input("Opportunity_ID", sql.Int, Opportunity_ID)
      .input("OpportunityName", sql.NVarChar, OpportunityName)
      .input("ContactName", sql.NVarChar, ContactName)
      .input("ContactPhone", sql.NVarChar, ContactPhone)
      .input("ExpectedRevenue", sql.Decimal(12, 2), ExpectedRevenue)
      .input("Payment", sql.Decimal(12, 2), Payment)
      .input("PaymentType", sql.NVarChar, PaymentType)
      .input("ExpectedClosing", sql.Date, ExpectedClosing && ExpectedClosing.trim() !== "" ? new Date(ExpectedClosing) : null,)
      .input("Email_ID", sql.NVarChar, Email_ID)
      .input("Priority", sql.NVarChar, Priority)
      .input("Contact_Followups", sql.NVarChar, Contact_Followups)
      .input("Followups_jobposition", sql.NVarChar, Followups_jobposition)
      .input("Sales_man_code", sql.NVarChar, Sales_man_code)
      .input("campaignID", sql.NVarChar, campaignID)
      .input("Medium_ID", sql.NVarChar, Medium_ID)
      .input("Source_ID", sql.NVarChar, Source_ID)
      .input("Contact_ID", sql.Int, Contact_ID)
      .input("Referred_BY", sql.NVarChar, Referred_BY)
      .input("SalesTeam_Code", sql.NVarChar, SalesTeam_Code)
      .input("Followup_CompanyName", sql.NVarChar, Followup_CompanyName)
      .input("Followup_CompanyAddress1", sql.NVarChar, Followup_CompanyAddress1)
      .input("Followup_CompanyAddress2", sql.NVarChar, Followup_CompanyAddress2)
      .input("Followup_City", sql.NVarChar, Followup_City)
      .input("Followup_State", sql.NVarChar, Followup_State)
      .input("Followup_Country", sql.NVarChar, Followup_Country)
      .input("Followup_Pincode", sql.NVarChar, Followup_Pincode)
      .input("Stage", sql.NVarChar, Stage)
      .input("Website", sql.NVarChar, Website)
      .input("company_code", sql.NVarChar, company_code)
      .input("Status", sql.NVarChar, Status)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("sourceType", sql.NVarChar, sourceType)
      .input("Notes", sql.NVarChar, Notes)
      .input("probability", sql.Decimal(18, 2), probability)
      .input("Tags", sql.VarChar, Tags)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.NVarChar, modified_date)
      .query(`EXEC sp_CRM_NewCompany @mode, @CompanyID, '', '', @Opportunity_ID, @OpportunityName, @ContactName, @ContactPhone, @ExpectedRevenue, @Payment, @PaymentType, @ExpectedClosing, @Email_ID, @Priority, @Contact_Followups,
        @Followups_jobposition, @Sales_man_code, @campaignID, @Medium_ID, @Source_ID, @Referred_BY, @SalesTeam_Code, @Followup_CompanyName, @Followup_CompanyAddress1, @Followup_CompanyAddress2, @Followup_City, @Followup_State,
        @Followup_Country, @Followup_Pincode, @Stage,@Contact_ID,@Website, @company_code, @Status, @keyfield,@sourceType,@Notes,@probability,@Tags,'', '', '', @modified_by, @modified_date`);
    res
      .status(200)
      .json({ success: true, message: "CRM_NewCompany updated successfully" });
  } catch (err) {
    console.error("Error during CRM_NewCompany update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_NewCompanyDelete = async (req, res) => {
  const { Opportunity_ID, company_code } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("Opportunity_ID", sql.Int, Opportunity_ID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_NewCompany @mode,0, '', '', @Opportunity_ID, '', '','', 0,0,'', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '','','', '','',@company_code, '', '', '','',0,'','', '', '', '', ''`,
      );
    res
      .status(200)
      .json({ success: true, message: "CRM_NewCompany deleted successfully" });
  } catch (err) {
    console.error("Error during CRM_NewCompany delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_ContactInfoInsert = async (req, res) => {
  const { ContactID, Company_or_Persona, Email, CompanyName, Phone, GSTIn, Website, Tag, Stage, Address1, Address2, Address3,
    City, Zip, State, Country, Notes, company_code, status, keyfield, BussinessDomain, RefferedBy, Created_by, Person_name,} = req.body;

  let Image = null;

  if (req.file) {
    Image = req.file.buffer;
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("ContactID", sql.Int, ContactID)
      .input("Company_or_Persona", sql.VarChar, Company_or_Persona)
      .input("Email", sql.VarChar, Email)
      .input("CompanyName", sql.VarChar, CompanyName)
      .input("Phone", sql.VarChar, Phone)
      .input("GSTIn", sql.VarChar, GSTIn)
      .input("Website", sql.VarChar, Website)
      .input("Tag", sql.VarChar, Tag)
      .input("Stage", sql.VarChar, Stage)
      .input("Address1", sql.VarChar, Address1)
      .input("Address2", sql.VarChar, Address2)
      .input("Address3", sql.VarChar, Address3)
      .input("City", sql.VarChar, City)
      .input("Zip", sql.VarChar, Zip)
      .input("State", sql.VarChar, State)
      .input("Country", sql.VarChar, Country)
      .input("Notes", sql.Text, Notes)
      .input("company_code", sql.VarChar, company_code)
      .input("status", sql.VarChar, status)
      .input("keyfield", sql.VarChar, keyfield)
      .input("Image", sql.VarBinary, Image)
      .input("Person_name", sql.VarChar, Person_name)
      .input("BussinessDomain", sql.NVarChar, BussinessDomain)
      .input("RefferedBy", sql.NVarChar, RefferedBy)
      .input("Created_by", sql.VarChar, Created_by)
      .query(`EXEC sp_CRM_ContactInfo @mode, @ContactID, @Company_or_Persona, @Email, @CompanyName, @Phone, @GSTIn, @Website, @Tag, @Stage, @Address1, @Address2, 
        @Address3, @City, @Zip, @State, @Country, @Notes, @company_code, @status, @keyfield, @Image, @Person_name,'','','', '', @BussinessDomain, @RefferedBy, @Created_by, '', '', ''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    }
  } catch (err) {
    console.error("Error during CRM_ContactInfo insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_ContactInfoUpdate = async (req, res) => {
  const { ContactID, Company_or_Persona, Email, CompanyName, Phone, GSTIn, Website, Tag, Stage, Address1, Address2, Address3, City, Zip,
    State, Country, Notes, company_code, status, keyfield, modified_by, Person_name, BussinessDomain, RefferedBy, } = req.body
  let Image = null;

  if (req.file) {
    Image = req.file.buffer;
  }

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.VarChar, "U")
      .input("ContactID", sql.Int, ContactID)
      .input("Company_or_Persona", sql.VarChar, Company_or_Persona)
      .input("Email", sql.VarChar, Email)
      .input("CompanyName", sql.VarChar, CompanyName)
      .input("Phone", sql.VarChar, Phone)
      .input("GSTIn", sql.VarChar, GSTIn)
      .input("Website", sql.VarChar, Website)
      .input("Tag", sql.VarChar, Tag)
      .input("Stage", sql.VarChar, Stage)
      .input("Address1", sql.VarChar, Address1)
      .input("Address2", sql.VarChar, Address2)
      .input("Address3", sql.VarChar, Address3)
      .input("City", sql.VarChar, City)
      .input("Zip", sql.VarChar, Zip)
      .input("State", sql.VarChar, State)
      .input("Country", sql.VarChar, Country)
      .input("Notes", sql.Text, Notes)
      .input("company_code", sql.VarChar, company_code)
      .input("status", sql.VarChar, status)
      .input("keyfield", sql.VarChar, keyfield)
      .input("Image", sql.VarBinary, Image)
      .input("Person_name", sql.NVarChar, Person_name)
      .input("BussinessDomain", sql.NVarChar, BussinessDomain)
      .input("RefferedBy", sql.NVarChar, RefferedBy)
      .input("modified_by", sql.VarChar, modified_by)
      .query(`EXEC sp_CRM_ContactInfo @mode, @ContactID, @Company_or_Persona, @Email, @CompanyName, @Phone, @GSTIn, @Website, @Tag, @Stage, @Address1, @Address2, 
        @Address3, @City, @Zip, @State, @Country, @Notes, @company_code, @status, @keyfield, @Image, @Person_name,'','','','', @BussinessDomain, @RefferedBy, '','', @modified_by, ''`);

    res
      .status(200)
      .json({ success: true, message: "CRM_ContactInfo updated successfully" });
  } catch (err) {
    console.error("Error during CRM_ContactInfo update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_ContactInfoDelete = async (req, res) => {
  const { keyfield, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("keyfield", sql.NVarChar, keyfield)
      .input("company_code", sql.VarChar, company_code)
      .query(
        `EXEC sp_CRM_ContactInfo @mode, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', @company_code,'', @keyfield,'','', '', '', '', '', '','','', '', '', ''`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_ContactInfo Deleted Successfully" });
  } catch (err) {
    console.error("Error during CRM_ContactInfo delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Auto-generated Node.js CRUD for sp_CRM_AddContact
const CRM_AddContactInsert = async (req, res) => {
  const { AddContactID, ContactID, ContactName, Email, Phone, JobTitle, company_code, status, keyfield, Created_Date, modified_date, Created_by, modified_by, Notes, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("AddContactID", sql.Int, AddContactID)
      .input("ContactID", sql.Int, ContactID)
      .input("ContactName", sql.NVarChar, ContactName)
      .input("Email", sql.NVarChar, Email)
      .input("Phone", sql.NVarChar, Phone)
      .input("JobTitle", sql.NVarChar, JobTitle)
      .input("company_code", sql.NVarChar, company_code)
      .input("status", sql.NVarChar, status)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("Created_Date", sql.NVarChar, Created_Date)
      .input("modified_date", sql.NVarChar, modified_date)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("Notes", sql.NVarChar, Notes)
      .query(
        `EXEC sp_CRM_AddContact @mode, @AddContactID, @ContactID, @ContactName, @Email, @Phone, @JobTitle, @company_code, @status, @keyfield, @Created_Date, @modified_date, @Created_by, @modified_by, @Notes`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_AddContact insertd successfully" });
  } catch (err) {
    console.error("Error during CRM_AddContact insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_AddContactUpdate = async (req, res) => {
  const { AddContactID, ContactID, ContactName, Email, Phone, JobTitle, company_code, status, keyfield, Created_Date, modified_date, Created_by, modified_by, Notes, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("AddContactID", sql.Int, AddContactID)
      .input("ContactID", sql.Int, ContactID)
      .input("ContactName", sql.NVarChar, ContactName)
      .input("Email", sql.NVarChar, Email)
      .input("Phone", sql.NVarChar, Phone)
      .input("JobTitle", sql.NVarChar, JobTitle)
      .input("company_code", sql.NVarChar, company_code)
      .input("status", sql.NVarChar, status)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("Created_Date", sql.NVarChar, Created_Date)
      .input("modified_date", sql.NVarChar, modified_date)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("Notes", sql.NVarChar, Notes)
      .query(
        `EXEC sp_CRM_AddContact @mode, @AddContactID, @ContactID, @ContactName, @Email, @Phone, @JobTitle, @company_code, @status, @keyfield, @Created_Date, @modified_date, @Created_by, @modified_by, @Notes`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_AddContact updated successfully" });
  } catch (err) {
    console.error("Error during CRM_AddContact update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_AddContactDelete = async (req, res) => {
  const { AddContactID, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("AddContactID", sql.Int, AddContactID)
      .input("company_code", sql.NVarChar, company_code)

      .query(
        `EXEC sp_CRM_AddContact @mode, @AddContactID, '', '', '', '', '', @company_code, '', '', '', '', '', '', ''`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_AddContact deleted successfully" });
  } catch (err) {
    console.error("Error during CRM_AddContact delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_SalesPersonMasterInsert = async (req, res) => {
  const { SalesCode, SalesPersonName, EmailID, Language, Role, status, company_code, keyfield, SalesTeam, BussinessDomain, RefferedBy, Created_by, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("SalesCode", sql.NVarChar, SalesCode)
      .input("SalesPersonName", sql.NVarChar, SalesPersonName)
      .input("EmailID", sql.NVarChar, EmailID)
      .input("Language", sql.NVarChar, Language)
      .input("Role", sql.NVarChar, Role)
      .input("status", sql.NVarChar, status)
      .input("SalesTeam", sql.NVarChar, SalesTeam)
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("BussinessDomain", sql.NVarChar, BussinessDomain)
      .input("RefferedBy", sql.NVarChar, RefferedBy)
      .input("Created_by", sql.NVarChar, Created_by)
      .query(
        `EXEC sp_CRM_SalesPersonMaster @mode, @SalesCode, @SalesPersonName, @EmailID, @Language, @Role, @status,@SalesTeam, @company_code, @keyfield, @BussinessDomain, @RefferedBy, '', '', @Created_by,''`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_SalesPersonMaster insertd successfully",
      });
  } catch (err) {
    console.error("Error during CRM_SalesPersonMaster insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_SalesPersonMasterUpdate = async (req, res) => {
  const { SalesCode, SalesPersonName, EmailID, Language, Role, status, SalesTeam, company_code, keyfield, BussinessDomain, RefferedBy, modified_date, modified_by, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("SalesCode", sql.NVarChar, SalesCode)
      .input("SalesPersonName", sql.NVarChar, SalesPersonName)
      .input("EmailID", sql.NVarChar, EmailID)
      .input("Language", sql.NVarChar, Language)
      .input("Role", sql.NVarChar, Role)
      .input("status", sql.NVarChar, status)
      .input("SalesTeam", sql.NVarChar, SalesTeam)
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("BussinessDomain", sql.NVarChar, BussinessDomain)
      .input("RefferedBy", sql.NVarChar, RefferedBy)
      .input("modified_date", sql.NVarChar, modified_date)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_CRM_SalesPersonMaster @mode, @SalesCode, @SalesPersonName, @EmailID, @Language, @Role, @status, @SalesTeam, @company_code, @keyfield, @BussinessDomain, @RefferedBy, '', @modified_date, '', @modified_by`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_SalesPersonMaster updated successfully",
      });
  } catch (err) {
    console.error("Error during CRM_SalesPersonMaster update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_SalesPersonMasterDelete = async (req, res) => {
  const { SalesCode, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("SalesCode", sql.NVarChar, SalesCode)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_SalesPersonMaster @mode, @SalesCode, '', '', '', '', '', '', @company_code,'','','','','','',''`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_SalesPersonMaster deleted successfully",
      });
  } catch (err) {
    console.error("Error during CRM_SalesPersonMaster delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Node.js CRUD for sp_CRM_LogNote
const CRM_LogNoteInsert = async (req, res) => {
  const { Opportunity_ID, type, stage, AssignedTo, LogNote, company_code, keyfield, Created_Date, Created_by, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Opportunity_ID", sql.Int, Opportunity_ID)
      .input("type", sql.NVarChar, type)
      .input("AssignedTo", sql.NVarChar, AssignedTo)
      .input("LogNote", sql.NVarChar, LogNote)
      .input("stage", sql.NVarChar, stage)
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("Created_Date", sql.NVarChar, Created_Date)
      .input("Created_by", sql.NVarChar, Created_by)
      .query(
        `EXEC sp_CRM_LogNote @mode, @Opportunity_ID, @type, @AssignedTo, @LogNote, @stage, @company_code, @Created_Date, '', @Created_by, '','',''`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_LogNote insertd successfully" });
  } catch (err) {
    console.error("Error during CRM_LogNote insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_LogNoteUpdate = async (req, res) => {
  const { Opportunity_ID, type, stage, AssignedTo, LogNote, company_code, keyfield, modified_date, modified_by, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("Opportunity_ID", sql.Int, Opportunity_ID)
      .input("type", sql.NVarChar, type)
      .input("AssignedTo", sql.NVarChar, AssignedTo)
      .input("LogNote", sql.NVarChar, LogNote)
      .input("stage", sql.NVarChar, stage)
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("modified_date", sql.NVarChar, modified_date)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_CRM_LogNote @mode, @Opportunity_ID, @ContactID,  @AssignedTo, @LogNote, @stage, @company_code, '', @modified_date,'',@modified_by,'',''`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_LogNote updated successfully" });
  } catch (err) {
    console.error("Error during CRM_LogNote update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_LogNoteDelete = async (req, res) => {
  const { Keyfield, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("Keyfield", sql.NVarChar, Keyfield)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_LogNote @mode, 0,'', '','','', @company_code, '', '', '','',@Keyfield,''`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_LogNote deleted successfully" });
  } catch (err) {
    console.error("Error during CRM_LogNote delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const CRM_LogNoteGet = async (req, res) => {
  const { Opportunity_ID, company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();

    const request = pool.request();
    const result = await request
      .input("mode", sql.NVarChar, "A")
      .input("Opportunity_ID", sql.Int, Opportunity_ID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_LogNote @mode, @Opportunity_ID,'', '','','',@company_code, '', '','','', '',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//  Node.js CRUD for sp_CRM_MeetingSubject
const CRM_MeetingSubjectInsert = async (req, res) => {
  const { MeetingID, MeetingSubject, Start, End, Duration, Timezone, Location, VideoCallURL, Tags, Privacy, Organizer, Description,
    Reminder, Recurrent, Repeat, RepeatOn, Unit, status, company_code, keyfield, Created_Date, Created_by,} = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("MeetingID", sql.Int, MeetingID)
      .input("MeetingSubject", sql.NVarChar, MeetingSubject)
      .input("Start", sql.DateTime, Start)
      .input("End", sql.DateTime, End)
      .input("Duration", sql.NVarChar, Duration)
      .input("Timezone", sql.NVarChar, Timezone)
      .input("Location", sql.NVarChar, Location)
      .input("VideoCallURL", sql.NVarChar, VideoCallURL)
      .input("Tags", sql.NVarChar, Tags)
      .input("Privacy", sql.NVarChar, Privacy)
      .input("Organizer", sql.NVarChar, Organizer)
      .input("Description", sql.NVarChar, Description)
      .input("Reminder", sql.NVarChar, Reminder)
      .input("Recurrent", sql.NVarChar, Recurrent)
      .input("Repeat", sql.NVarChar, Repeat)
      .input("RepeatOn", sql.NVarChar, RepeatOn)
      .input("Unit", sql.NVarChar, Unit)
      .input("status", sql.NVarChar, status)
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("Created_Date", sql.NVarChar, Created_Date)
      .input("Created_by", sql.NVarChar, Created_by)
      .query(
        `EXEC sp_CRM_MeetingSubject @mode, @MeetingID, @MeetingSubject, @Start, @End, @Duration, @Timezone, @Location, @VideoCallURL, @Tags, @Privacy, @Organizer, @Description, @Reminder, @Recurrent, @Repeat, @RepeatOn, @Unit, @status, @company_code, @keyfield, @Created_Date, '', @Created_by,''`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_MeetingSubject insertd successfully",
      });
  } catch (err) {
    console.error("Error during CRM_MeetingSubject insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_MeetingSubjectUpdate = async (req, res) => {
  const { MeetingID, MeetingSubject, Start, End, Duration, Timezone, Location, VideoCallURL, Tags, Privacy, Organizer, Description, Reminder,
    Recurrent, Repeat, RepeatOn, Unit, status, company_code, keyfield, modified_date, modified_by, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("MeetingID", sql.Int, MeetingID)
      .input("MeetingSubject", sql.NVarChar, MeetingSubject)
      .input("Start", sql.DateTime, Start)
      .input("End", sql.DateTime, End)
      .input("Duration", sql.NVarChar, Duration)
      .input("Timezone", sql.NVarChar, Timezone)
      .input("Location", sql.NVarChar, Location)
      .input("VideoCallURL", sql.NVarChar, VideoCallURL)
      .input("Tags", sql.NVarChar, Tags)
      .input("Privacy", sql.NVarChar, Privacy)
      .input("Organizer", sql.NVarChar, Organizer)
      .input("Description", sql.NVarChar, Description)
      .input("Reminder", sql.NVarChar, Reminder)
      .input("Recurrent", sql.NVarChar, Recurrent)
      .input("Repeat", sql.NVarChar, Repeat)
      .input("RepeatOn", sql.NVarChar, RepeatOn)
      .input("Unit", sql.NVarChar, Unit)
      .input("status", sql.NVarChar, status)
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("modified_date", sql.NVarChar, modified_date)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_CRM_MeetingSubject @mode, @MeetingID, @MeetingSubject, @Start, @End, @Duration, @Timezone, @Location, @VideoCallURL, @Tags, @Privacy, @Organizer, @Description, @Reminder, @Recurrent, @Repeat, @RepeatOn, @Unit, @status, @company_code, @keyfield, '', @modified_date, '', @modified_by`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_MeetingSubject updated successfully",
      });
  } catch (err) {
    console.error("Error during CRM_MeetingSubject update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_MeetingSubjectDelete = async (req, res) => {
  const { MeetingID, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("MeetingID", sql.Int, MeetingID)
      .input("company_code", sql.NVarChar, company_code)

      .query(
        `EXEC sp_CRM_MeetingSubject @mode, @MeetingID, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', @company_code, '', '', '', '', ''`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_MeetingSubject deleted successfully",
      });
  } catch (err) {
    console.error("Error during CRM_MeetingSubject delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//  Node.js CRUD for sp_CRM_Campaign
const CRM_CampaignInsert = async (req, res) => {
  const { CampaignID, CampaignName, Responsible, TagName, status, company_code, keyfield, Created_by, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("CampaignID", sql.NVarChar, CampaignID)
      .input("CampaignName", sql.NVarChar, CampaignName)
      .input("Responsible", sql.NVarChar, Responsible)
      .input("TagName", sql.NVarChar, TagName)
      .input("status", sql.NVarChar, status)
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("Created_by", sql.NVarChar, Created_by)
      .query(
        `EXEC sp_CRM_Campaign @mode,@CampaignID, @CampaignName, @Responsible, @TagName, @status, @company_code, @keyfield, '', '', @Created_by, ''`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Campaign insertd successfully" });
  } catch (err) {
    console.error("Error during CRM_Campaign insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_CampaignUpdate = async (req, res) => {
  const { CampaignID, CampaignName, Responsible, TagName, status, company_code, keyfield, modified_date, modified_by, } = req.body
  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("CampaignID ", sql.NVarChar, CampaignID)
      .input("CampaignName", sql.NVarChar, CampaignName)
      .input("Responsible", sql.NVarChar, Responsible)
      .input("TagName", sql.NVarChar, TagName)
      .input("status", sql.NVarChar, status)
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.NVarChar, keyfield)
      .input("modified_date", sql.NVarChar, modified_date)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_CRM_Campaign @mode,'', @CampaignName, @Responsible, @TagName, @status, @company_code, @keyfield, '', @modified_date, '', @modified_by`,);
    res
      .status(200)
      .json({ success: true, message: "CRM_Campaign updated successfully" });
  } catch (err) {
    console.error("Error during CRM_Campaign update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_CampaignDelete = async (req, res) => {
  const { CampaignID, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("CampaignID ", sql.NVarChar, CampaignID)
      .input("company_code", sql.NVarChar, company_code)

      .query(
        `EXEC sp_CRM_Campaign @mode, @CampaignID,'', '', '', '', @company_code, '', '', '', '', ''`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Campaign deleted successfully" });
  } catch (err) {
    console.error("Error during CRM_Campaign delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Node.js CRUD for sp_CRM_Medium
const CRM_MediumInsert = async (req, res) => {
  const { Medium_ID, MediumName, Status, Created_by, Created_Date, company_code, keyfield, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Medium_ID", sql.NVarChar, Medium_ID)
      .input("MediumName", sql.NVarChar, MediumName)
      .input("Status", sql.NVarChar, Status)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("Created_Date", sql.NVarChar, Created_Date)
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.NVarChar, keyfield)
      .query(
        `EXEC sp_CRM_Medium @mode,@Medium_ID, @MediumName, @Status, @Created_by, '', @Created_Date, '', @company_code, @keyfield`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Medium insertd successfully" });
  } catch (err) {
    console.error("Error during CRM_Medium insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_MediumUpdate = async (req, res) => {
  const { Medium_ID, MediumName, Status, modified_by, modified_date, company_code, keyfield,  } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("Medium_ID", sql.NVarChar, Medium_ID)
      .input("MediumName", sql.NVarChar, MediumName)
      .input("Status", sql.NVarChar, Status)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.NVarChar, modified_date)
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.NVarChar, keyfield)
      .query(
        `EXEC sp_CRM_Medium @mode,@Medium_ID, @MediumName, @Status, '', @modified_by, '', @modified_date, @company_code, @keyfield`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Medium updated successfully" });
  } catch (err) {
    console.error("Error during CRM_Medium update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_MediumDelete = async (req, res) => {
  const { Medium_ID, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.VarChar, "D")
      .input("Medium_ID", sql.VarChar, Medium_ID)
      .input("company_code", sql.VarChar, company_code)
      .query(
        `EXEC sp_CRM_Medium @mode, @Medium_ID, '', '', '', '', '', '', @company_code, ''`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Medium deleted successfully" });
  } catch (err) {
    console.error("Error during CRM_Medium delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//  Node.js CRUD for sp_CRM_Source
const CRM_SourceInsert = async (req, res) => {
  const { Source_ID, SourceName, Created_by, Created_Date, company_code, keyfield, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Source_ID", sql.NVarChar, Source_ID)
      .input("SourceName", sql.NVarChar, SourceName)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("Created_Date", sql.NVarChar, Created_Date)
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.VarChar, keyfield)
      .query(
        `EXEC sp_CRM_Source @mode,@Source_ID, @SourceName, @Created_by, '', @Created_Date, '', @company_code,@keyfield`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Source insertd successfully" });
  } catch (err) {
    console.error("Error during CRM_Source insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_SourceUpdate = async (req, res) => {
  const { Source_ID, SourceName, modified_by, modified_date, company_code, keyfield, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("Source_ID", sql.NVarChar, Source_ID)
      .input("SourceName", sql.NVarChar, SourceName)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.NVarChar, modified_date)
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.VarChar, keyfield)
      .query(
        `EXEC sp_CRM_Source @mode,@Source_ID  , @SourceName, '', @modified_by, '', @modified_date, @company_code,@keyfield`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Source updated successfully" });
  } catch (err) {
    console.error("Error during CRM_Source update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_SourceDelete = async (req, res) => {
  const { Source_ID, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("Source_ID", sql.NVarChar, Source_ID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_Source @mode, @Source_ID,'','','','','', @company_code,''`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Source deleted successfully" });
  } catch (err) {
    console.error("Error during CRM_Source delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Node.js CRUD for sp_CRM_SalesPurchase
const CRM_SalesPurchaseInsert = async (req, res) => {
  const { SalesPurchaseID, ContactID, Type, SalesPerson, Mist, CompanyID, Reference, Industry, status, keyfield, Created_by, Created_Date, company_code, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("SalesPurchaseID", sql.NVarChar, SalesPurchaseID)
      .input("ContactID", sql.NVarChar, ContactID)
      .input("Type", sql.NVarChar, Type)
      .input("SalesPerson", sql.NVarChar, SalesPerson)
      .input("Mist", sql.NVarChar, Mist)
      .input("Reference", sql.NVarChar, Reference)
      .input("Industry", sql.NVarChar, Industry)
      .input("status", sql.NVarChar, status)
      .input("keyfield", sql.VarChar, keyfield)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("Created_Date", sql.NVarChar, Created_Date)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_SalesPurchase @mode, @SalesPurchaseID, @ContactID, @Type, @SalesPerson, @Mist, @Reference, @Industry, @status,@keyfield, @Created_by, @modified_by, @Created_Date, @modified_date, @company_code`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_SalesPurchase insertd successfully",
      });
  } catch (err) {
    console.error("Error during CRM_SalesPurchase insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_SalesPurchaseUpdate = async (req, res) => {
  const { SalesPurchaseID, ContactID, Type, SalesPerson, Mist, CompanyID, Reference, Industry, status, keyfield, modified_by, modified_date, company_code, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("SalesPurchaseID", sql.NVarChar, SalesPurchaseID)
      .input("ContactID", sql.NVarChar, ContactID)
      .input("Type", sql.NVarChar, Type)
      .input("SalesPerson", sql.NVarChar, SalesPerson)
      .input("Mist", sql.NVarChar, Mist)
      .input("Reference", sql.NVarChar, Reference)
      .input("Industry", sql.NVarChar, Industry)
      .input("status", sql.NVarChar, status)
      .input("keyfield", sql.VarChar, keyfield)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.NVarChar, modified_date)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_SalesPurchase @mode, @SalesPurchaseID, @ContactID, @Type, @SalesPerson, @Mist, @Reference, @Industry, @status,@keyfield, '', @modified_by, '', @modified_date, @company_code`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_SalesPurchase updated successfully",
      });
  } catch (err) {
    console.error("Error during CRM_SalesPurchase update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_SalesPurchaseDelete = async (req, res) => {
  const { SalesPurchaseID, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("SalesPurchaseID", sql.NVarChar, SalesPurchaseID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_SalesPurchase @mode, @SalesPurchaseID, '', '', '', '', '', '', '','', @company_code '', '', '', ''`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_SalesPurchase deleted successfully",
      });
  } catch (err) {
    console.error("Error during CRM_SalesPurchase delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by pavun on 11-09-25
const getClientPaymentExcel = async (req, res) => {
  const { Client_code, Company_code, Product_ID } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "CPE")
      .input("Client_code", sql.NVarChar, Client_code)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Product_ID", sql.NVarChar, Product_ID)
      .query(
        `EXEC sp_Client_Payment @mode,0,@Client_code,'','',0,'',@Product_ID,'',@Company_code,'','','','',NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 11-09-25
// Code Added by Harish 15/09/25

const CompanySearch = async (req, res) => {
  const { Company_or_Persona, Email, CompanyName, Phone, GSTIn, Website, Tag, Stage, Address1, Address2, Address3, City, Zip, State, Country, Notes, company_code, status, Person_name, } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("Company_or_Persona", sql.NVarChar, Company_or_Persona)
      .input("Email", sql.NVarChar, Email)
      .input("CompanyName", sql.NVarChar, CompanyName)
      .input("Phone", sql.NVarChar, Phone)
      .input("GSTIn", sql.NVarChar, GSTIn)
      .input("Website", sql.VarChar, Website)
      .input("Tag", sql.NVarChar, Tag)
      .input("Stage", sql.NVarChar, Stage)
      .input("Address1", sql.NVarChar, Address1)
      .input("Address2", sql.NVarChar, Address2)
      .input("Address3", sql.NVarChar, Address3)
      .input("City", sql.NVarChar, City)
      .input("Zip", sql.NVarChar, Zip)
      .input("State", sql.NVarChar, State)
      .input("Country", sql.NVarChar, Country)
      .input("Notes", sql.NVarChar, Notes)
      .input("company_code", sql.NVarChar, company_code)
      .input("status", sql.NVarChar, status)
      .input("Person_name", sql.NVarChar, Person_name)
      .query(
        `EXEC sp_CRM_ContactInfo @mode,'',@Company_or_Persona,@Email,@CompanyName,@Phone,@GSTIn,@Website,@Tag,@Stage,@Address1,@Address2,@Address3,@City,@Zip,@State,@Country,@Notes,@company_code,@status,'','','','','','','','','','','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error in CompanySearch:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by pavun on 15-09-25
const CRM_ContactInfoCompanyName = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GC")
      .input("company_code", sql.VarChar, company_code)
      .query(
        `EXEC sp_CRM_ContactInfo @mode, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', @company_code,'','','', '', '', '', '', '', '','','', '', '',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_ContactInfo delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavub on 15-09-25

//Code added by pavun on 18-09-25
const defaultCompanyNames = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GDCN")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_NewCompany @mode,0, '', '', '', '', '','', 0,0,'', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '','', '','','',@company_code, '', '', '', '', 0, '', '','', '', '', ''`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_NewCompany delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const defaultContactsName = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GDCT")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_NewCompany @mode,0, '', '', '', '', '','', 0,0,'', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '','', '','','',@company_code, '', '', '', '', 0, '','', '', '', '', ''`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_NewCompany delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const companyToContact = async (req, res) => {
  const { CompanyID, company_code } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "CCT")
      .input("CompanyID", sql.Int, CompanyID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_NewCompany @mode,@CompanyID, '', '', '', '', '','', 0,0,'', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '','','', '','',@company_code, '', '', '', '', 0, '', '','', '', '', ''`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_NewCompany delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const contactToCompany = async (req, res) => {
  const { Contact_ID, company_code, sourceType } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "CCN")
      .input("Contact_ID", sql.Int, Contact_ID)
      .input("company_code", sql.NVarChar, company_code)
      .input("sourceType", sql.NVarChar, sourceType)
      .query(
        `EXEC sp_CRM_NewCompany @mode,0, '','', '', '', '','', 0,0,'', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '','', '',@Contact_ID,'',@company_code, '', '', @sourceType, '', 0, '','', '', '', '', ''`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_NewCompany delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 19-09-25

//Code added by pavun on 22-09-25
const getDateRangeCRM = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'DateRange','','', '','','' , NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getNewCompany = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_CRM_NewCompany 'GC',0, '', '', '', '', '','', 0,0,'', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '','','', '','',@company_code, '', '', '', '', 0, '','', '', '', '', '' ",
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updateNewCompanyStage = async (req, res) => {
  const { Opportunity_ID, Stage, company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("Opportunity_ID", sql.Int, Opportunity_ID)
      .input("Stage", sql.NVarChar, Stage)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_CRM_NewCompany 'UC',0,'','', @Opportunity_ID, '', '','', 0,0,'', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '','', @Stage,'','',@company_code, '', '', '', '', 0, '','', '', '', '', '' ",
      );
    res
      .status(200)
      .json({
        success: true,
        message: "Opportunity ID stage updated successfully",
      });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 22-09-25

//Code added by pavun on 23-09-25
const getOpportunityDetails = async (req, res) => {
  const { Opportunity_ID, company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("Opportunity_ID", sql.Int, Opportunity_ID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_CRM_NewCompany 'OD',0,'','', @Opportunity_ID, '', '','', 0,0,'', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '','', '','','',@company_code, '', '', '', '', 0, '','', '', '', '', '' ",
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 23-09-25

// Auto-generated Node.js CRUD for sp_CRM_SalesTeam_HDR

const CRM_SalesTeam_HDRInsert = async (req, res) => {
  const { Sales_ID, Sales_Team, Team_Leader, Email_alias, Sales_person, Emails_From, Company_code, Created_by, keyfield, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Sales_ID", sql.NVarChar, Sales_ID)
      .input("Sales_Team", sql.VarChar, Sales_Team)
      .input("Team_Leader", sql.NVarChar, Team_Leader)
      .input("Email_alias", sql.VarChar, Email_alias)
      .input("Emails_From", sql.VarChar, Emails_From)
      .input("Sales_person", sql.VarChar, Sales_person)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("keyfield", sql.VarChar, keyfield)
      .query(
        `EXEC sp_CRM_SalesTeam_HDR @mode,@Sales_ID, @Sales_Team, @Team_Leader, @Email_alias, @Emails_From,@Sales_person, @Company_code, @Created_by,'','','',@keyfield`,
      );

    res
      .status(200)
      .json({ success: true, message: "Sales Team insertd successfully" });
  } catch (err) {
    console.error("Error during CRM_SalesTeam_HDR insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_SalesTeam_HDRUpdate = async (req, res) => {
  const { Sales_ID, Sales_Team, Team_Leader, Email_alias, Emails_From, Company_code, modified_by, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("Sales_ID", sql.NVarChar, Sales_ID)
      .input("Sales_Team", sql.NVarChar, Sales_Team)
      .input("Team_Leader", sql.NVarChar, Team_Leader)
      .input("Email_alias", sql.NVarChar, Email_alias)
      .input("Emails_From", sql.NVarChar, Emails_From)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_CRM_SalesTeam_HDR @mode, @Sales_ID, @Sales_Team, @Team_Leader, @Email_alias, @Emails_From,'', @Company_code,'', @modified_by,'','',''`,
      );

    res
      .status(200)
      .json({ success: true, message: "Data Updated Successfully" });
  } catch (err) {
    console.error("Error during CRM_SalesTeam_HDR update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_SalesTeam_HDRDelete = async (req, res) => {
  const { Sales_ID, Company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("Sales_ID", sql.NVarChar, Sales_ID)
      .input("Company_code", sql.NVarChar, Company_code)

      .query(
        `EXEC sp_CRM_SalesTeam_HDR @mode, @Sales_ID,'','','', '', '',@Company_code, '', '', '', '',''`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_SalesTeam_HDR deleted successfully",
      });
  } catch (err) {
    console.error("Error during CRM_SalesTeam_HDR delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code Added by Harish on 23_09_25

const CRM_SalesTeam_DetailsInsert = async (req, res) => {
  const { Sales_ID, Sales_Person, Company_code, Created_by, keyfield } =
    req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Sales_ID", sql.Int, Sales_ID)
      .input("Sales_Person", sql.NVarChar, Sales_Person)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("keyfield", sql.VarChar, keyfield)
      .query(
        `EXEC sp_CRM_SalesTeam_Details @mode, @Sales_ID, @Sales_Person, @Company_code, @Created_by,'', '', '',@keyfield`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_SalesTeam_Details insertd successfully",
      });
  } catch (err) {
    console.error("Error during CRM_SalesTeam_Details insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_SalesTeam_DetailsUpdate = async (req, res) => {
  const { Sales_ID, Sales_Person, Company_code, modified_by, modified_date } =
    req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("Sales_ID", sql.Int, Sales_ID)
      .input("Sales_Person", sql.NVarChar, Sales_Person)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.Date, modified_date)
      .query(
        `EXEC sp_CRM_SalesTeam_Details @mode, @Sales_ID, @Sales_Person, @Company_code, '', @modified_by,'','',''`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_SalesTeam_Details updated successfully",
      });
  } catch (err) {
    console.error("Error during CRM_SalesTeam_Details update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_SalesTeam_DetailsDelete = async (req, res) => {
  const { Sales_ID, Company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("Sales_ID", sql.Int, Sales_ID)
      .input("Company_code", sql.NVarChar, Company_code)
      .query(
        `EXEC sp_CRM_SalesTeam_Details @mode, @Sales_ID,'', @Company_code,'','','','',''`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_SalesTeam_Details deleted successfully",
      });
  } catch (err) {
    console.error("Error during CRM_SalesTeam_Details delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Auto-generated Node.js CRUD for sp_CRM_Activity

const CRM_ActivityInsert = async (req, res) => {
  const { Activity_ID, Opportunity_ID, Markdone_Status, Feedback, Summary, Type_of_Activity, Due_date, Assigned_To, Notes, Company_code, Created_by, } = req.body;

  let Attachments = null;
  if (req.file) Attachments = req.file.buffer;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Activity_ID", sql.Int, Activity_ID)
      .input("Opportunity_ID", sql.Int, Opportunity_ID)
      .input("Summary", sql.NVarChar, Summary)
      .input("Type_of_Activity", sql.NVarChar, Type_of_Activity)
      .input("Due_date", sql.Date, Due_date)
      .input("Assigned_To", sql.NVarChar, Assigned_To)
      .input("Attachments", sql.VarBinary, Attachments)
      .input("Notes", sql.NVarChar, Notes)
      .input("Markdone_Status", sql.Bit, Markdone_Status)
      .input("Feedback", sql.NVarChar, Feedback)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Created_by", sql.NVarChar, Created_by)
      .query(`EXEC sp_CRM_Activity @mode,@Activity_ID,@Opportunity_ID,@Summary, @Type_of_Activity, @Due_date, @Assigned_To, 
        @Attachments, @Notes, @Company_code, '','','','',0,0,@Markdone_Status,@Feedback,@Created_by,'','','', ''`);

    res
      .status(200)
      .json({ success: true, message: "CRM_Activity insertd successfully" });
  } catch (err) {
    console.error("Error during CRM_Activity insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_ActivityUpdate = async (req, res) => {
  const { Activity_ID, Type_of_Activity, Due_date, Assigned_To, Keyfield, Notes, Company_code, modified_by,  } = req.body;
  let Attachments = null;
  if (req.file) Attachments = req.file.buffer;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("Activity_ID", sql.Int, Activity_ID)
      .input("Type_of_Activity", sql.NVarChar, Type_of_Activity)
      .input("Due_date", sql.Date, Due_date)
      .input("Assigned_To", sql.NVarChar, Assigned_To)
      .input("Attachments", sql.VarBinary, Attachments)
      .input("Notes", sql.NVarChar, Notes)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("Keyfield", sql.VarChar, Keyfield)
      .query(
        `EXEC sp_CRM_Activity @mode,@Activity_ID,0,'', @Type_of_Activity, @Due_date, @Assigned_To, @Attachments, @Notes, @Company_code,'','','','',0,0,'','','', @modified_by,'','',@Keyfield`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Activity updated successfully" });
  } catch (err) {
    console.error("Error during CRM_Activity update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_ActivityDelete = async (req, res) => {
  const { Activity_ID, Company_code, Keyfield } = req.body;
  let Attachments = null;
  if (req.file) Attachments = req.file.buffer;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("Activity_ID", sql.Int, Activity_ID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Keyfield", sql.VarChar, Keyfield)
      .query(
        `EXEC sp_CRM_Activity @mode, @Activity_ID,0,'','','', '', '', '', @Company_code,'','','','',0,0,'','', '', '', '', '', @Keyfield`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Activity deleted successfully" });
  } catch (err) {
    console.error("Error during CRM_Activity delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Ended by Harish on 23_09_25

//Code added by pavun on 24-09-25
const getCustomerDropdown = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_CRM_NewCompany 'PC',0, '', '', 0, '', '','', 0,0,'', '', '', '', '', '', 0, '', '',  '', '', '', '', '', '', '', '', '','', '',0,'',@company_code, '', '', '', '', 0, '','', '', '', '', '' ",
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const updateNewCompanyPeriority = async (req, res) => {
  const { Opportunity_ID, Priority, company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    await pool
      .request()
      .input("mode", sql.NVarChar, "UP")
      .input("Opportunity_ID", sql.Int, Opportunity_ID)
      .input("Priority", sql.NVarChar, Priority)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_CRM_NewCompany @mode,0,'','',@Opportunity_ID,'','','',0,0,'','','',@Priority,'','','','','','','','','','','','','','','','','','',@company_code,'','','','',0,'','','','','','' ",
      );

    res
      .status(200)
      .json({
        success: true,
        message: "Opportunity ID stage updated successfully",
      });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 24-09-25
const CRM_NewEventInsert = async (req, res) => {
  const { Event_Name, Oppurtinity_ID, Start_date, End_date, All_Days, Attendees, Videocall_URL, Description, Activity_ID, Company_code, Created_by, keyfield, } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Event_Name", sql.NVarChar, Event_Name)
      .input("Oppurtinity_ID", sql.Int, Oppurtinity_ID)
      .input("Start_date", sql.Date, Start_date)
      .input("End_date", sql.Date, End_date)
      .input("All_Days", sql.NVarChar, All_Days)
      .input("Attendees", sql.NVarChar, Attendees)
      .input("Videocall_URL", sql.NVarChar, Videocall_URL)
      .input("Description", sql.NVarChar, Description)
      .input("Activity_ID", sql.Int, Activity_ID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("Created_by", sql.NVarChar, Created_by)
      .input("keyfield", sql.VarChar, keyfield)
      .query(
        `EXEC sp_CRM_NewEvent @mode,@Event_Name,@Oppurtinity_ID,@Start_date, @End_date,@All_Days, @Attendees,@Videocall_URL,@Description,0,@Company_code, @Created_by, '', '', '',@keyfield`,
      );
    res
      .status(200)
      .json({ success: true, message: "CRM_NewEvent insertd successfully" });
  } catch (err) {
    console.error("Error during CRM_NewEvent insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const CRM_NewEventUpdate = async (req, res) => {
  const { Event_Name, Start_date, End_date, All_Days, Attendees, Videocall_URL, Description, Activity_ID, Company_code, modified_by, } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("Event_Name", sql.NVarChar, Event_Name)
      .input("Start_date", sql.Date, Start_date)
      .input("End_date", sql.Date, End_date)
      .input("All_Days", sql.NVarChar, All_Days)
      .input("Attendees", sql.NVarChar, Attendees)
      .input("Videocall_URL", sql.NVarChar, Videocall_URL)
      .input("Description", sql.NVarChar, Description)
      .input("Activity_ID", sql.NVarChar, Activity_ID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_CRM_NewEvent @mode,0, @Event_Name, @Start_date, @End_date, @All_Days, @Attendees, @Videocall_URL, @Description, @Activity_ID, @Company_code, '', @modified_by, '', '',''`,
      );
    res
      .status(200)
      .json({ success: true, message: "CRM_NewEvent updated successfully" });
  } catch (err) {
    console.error("Error during CRM_NewEvent update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const CRM_NewEventDelete = async (req, res) => {
  const { Event_Name, Company_code } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("Event_Name", sql.NVarChar, Event_Name)
      .input("Company_code", sql.NVarChar, Company_code)
      .query(
        `EXEC sp_CRM_NewEvent @mode,0, @Event_Name, '', '', '', '', '', '', '', @Company_code, '', '', '', '',''`,
      );
    res
      .status(200)
      .json({ success: true, message: "CRM_NewEvent deleted successfully" });
  } catch (err) {
    console.error("Error during CRM_NewEvent delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Auto-generated Node.js CRUD for sp_CRM_Message

const CRM_MessageInsert = async (req, res) => {
  const { Send_To, Notes, Company_code, created_by, created_date } = req.body;
  let Files = null;
  if (req.file) Files = req.file.buffer;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Send_To", sql.NVarChar, Send_To)
      .input("Notes", sql.NVarChar, Notes)
      .input("Files", sql.VarBinary, Files)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("created_by", sql.NVarChar, created_by)
      .input("created_date", sql.NVarChar, created_date)
      .query(
        `EXEC sp_CRM_Message @mode, @Send_To, @Notes, @Files, @Company_code, @created_by, @created_date, '', ''`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Message insertd successfully" });
  } catch (err) {
    console.error("Error during CRM_Message insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_MessageUpdate = async (req, res) => {
  const { Send_To, Notes, Company_code, modified_by, modified_date } = req.body;
  let Files = null;
  if (req.file) Files = req.file.buffer;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("Send_To", sql.NVarChar, Send_To)
      .input("Notes", sql.NVarChar, Notes)
      .input("Files", sql.VarBinary, Files)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("modified_date", sql.NVarChar, modified_date)
      .query(
        `EXEC sp_CRM_Message @mode, @Send_To, @Notes, @Files, @Company_code, '', '', @modified_by, @modified_date`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Message updated successfully" });
  } catch (err) {
    console.error("Error during CRM_Message update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_MessageDelete = async (req, res) => {
  const { Send_To, Company_code } = req.body;
  let Files = null;
  if (req.file) Files = req.file.buffer;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("Send_To", sql.NVarChar, Send_To)
      .input("Company_code", sql.NVarChar, Company_code)

      .query(
        `EXEC sp_CRM_Message @mode, @Send_To, '', '', @Company_code, '', '', '', ''`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Message deleted successfully" });
  } catch (err) {
    console.error("Error during CRM_Message delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const GetSalesperson = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "AD")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_SalesPersonMaster @mode, '', '', '', '', '', '','', @company_code, '', '', '', '', '', '',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const GetSalespersonALL = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "A")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_SalesPersonMaster @mode, '', '', '', '', '', '','', @company_code, '', '', '', '', '', '',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Ended by Harish on 23_09_25

//Code added by pavun on 25-09-25
const salesPersonDropdown = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GSP")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_SalesPersonMaster @mode, '', '', '', '', '', '','', @company_code, '', '', '', '', '', '',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 25-09-25

// Code Added By Harish on 25_09_25

const GetDataContactInfo = async (req, res) => {
  const { ContactID, Contact_Info_ID } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FC")
      .input("ContactID", sql.Int, ContactID)
      .input("Contact_Info_ID", sql.Int, Contact_Info_ID)
      .query(
        `EXEC sp_CRM_Contacts @mode,'','','','','','','','','','','','',@Contact_Info_ID,'','','', @ContactID ,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const GetDataContact = async (req, res) => {
  const { ContactID } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FCI")
      .input("ContactID", sql.Int, ContactID)
      .query(
        `EXEC sp_CRM_Contacts @mode,'','','','','','','','','','','','',@Contact_Info_ID,'','','', @ContactID ,'','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by pavun on 26-09-25
const getContactEmail = async (req, res) => {
  const { Contact_ID, company_code, sourceType } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GCE")
      .input("Contact_ID", sql.Int, Contact_ID)
      .input("company_code", sql.NVarChar, company_code)
      .input("sourceType", sql.NVarChar, sourceType)
      .query(
        `EXEC sp_CRM_NewCompany @mode,0, '','', '', '', '','', 0,0,'', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '','', '',@Contact_ID,'',@company_code, '', '', @sourceType, '', 0, '','', '', '', '', '' `,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_NewCompany delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getContacts = async (req, res) => {
  const { Contact_ID, company_code, sourceType } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GCT")
      .input("Contact_ID", sql.Int, Contact_ID)
      .input("company_code", sql.NVarChar, company_code)
      .input("sourceType", sql.NVarChar, sourceType)
      .query(
        `EXEC sp_CRM_NewCompany @mode,0, '','', '', '', '','', 0,0,'', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '','', '',@Contact_ID,'',@company_code, '', '', @sourceType, '', 0, '','', '', '', '', ''`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_NewCompany delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getContactsDetails = async (req, res) => {
  const { Contact_ID, company_code, sourceType } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "CT")
      .input("Contact_ID", sql.Int, Contact_ID)
      .input("company_code", sql.NVarChar, company_code)
      .input("sourceType", sql.NVarChar, sourceType)
      .query(
        `EXEC sp_CRM_NewCompany @mode,0, '','', '', '', '','', 0,0,'', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '','', '',@Contact_ID,'',@company_code, '', '', @sourceType, '', 0, '', '', '', '', '', ''`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_NewCompany delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 26-09-25

//Code added by pavun on 27-09-25
const getSource = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GS")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_Source @mode,''  , '', '', '', '', '', @company_code,''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_Source update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 27-09-25
//Code added by Harish on 27-09-25
const getMedium = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "MF")
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_CRM_Medium @mode,'','','','','','','',@company_code, ''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_Source update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by Harish on 27-09-25

//Code added by pavun on 29-09-25
const searchSource = async (req, res) => {
  const { Source_ID, SourceName, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("Source_ID", sql.NVarChar, Source_ID)
      .input("SourceName", sql.NVarChar, SourceName)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_Source @mode,@Source_ID, @SourceName, '', '', '', '', @company_code,''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_Source update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 29-09-25

//Code added by pavun on 30-09-25
const mediumSearch = async (req, res) => {
  const { Medium_ID, MediumName, Status, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("Medium_ID", sql.NVarChar, Medium_ID)
      .input("MediumName", sql.NVarChar, MediumName)
      .input("Status", sql.NVarChar, Status)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_Medium @mode,@Medium_ID,@MediumName,@Status,'','','','',@company_code,''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_Source update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CampaignSearch = async (req, res) => {
  const { CampaignID, CampaignName, Responsible, TagName, company_code } =
    req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("CampaignID", sql.NVarChar, CampaignID)
      .input("CampaignName", sql.NVarChar, CampaignName)
      .input("Responsible", sql.NVarChar, Responsible)
      .input("TagName", sql.NVarChar, TagName)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_Campaign @mode,@CampaignID, @CampaignName, @Responsible, @TagName, '', @company_code, '', '', '', '', ''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_Campaign insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const SearchSalesperson = async (req, res) => {
  const { SalesCode, SalesPersonName, EmailID, Language, Role, status, SalesTeam, company_code, } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("SalesCode", sql.NVarChar, SalesCode)
      .input("SalesPersonName", sql.NVarChar, SalesPersonName)
      .input("EmailID", sql.NVarChar, EmailID)
      .input("Language", sql.NVarChar, Language)
      .input("Role", sql.NVarChar, Role)
      .input("status", sql.NVarChar, status)
      .input("SalesTeam", sql.NVarChar, SalesTeam)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_SalesPersonMaster @mode, @SalesCode,@SalesPersonName,@EmailID,@Language,@Role,@status,@SalesTeam,@company_code, '', '', '', '', '', '',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCampaign = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GC")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_Campaign @mode,'', '', '', '', '', @company_code, '', '', '', '', ''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_Campaign insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 30-09-25
//CODE Added by Harish on 03-10-25

// Auto-generated Node.js CRUD for sp_CRM_Tag_Master

const CRM_Tag_MasterInsert = async (req, res) => {
  const { Tag_Name, Tag_colour, Company_code, created_by, status, keyfield } =
    req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "I")
      .input("Tag_Name", sql.NVarChar, Tag_Name)
      .input("Tag_colour", sql.NVarChar, Tag_colour)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("status", sql.NVarChar, status)
      .input("created_by", sql.NVarChar, created_by)
      .input("keyfield", sql.VarChar, keyfield)
      .query(
        `EXEC sp_CRM_Tag_Master @mode, @Tag_Name, @Tag_colour, @Company_code,@status, @created_by, '', '','',@keyfield`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Tag_Master insertd successfully" });
  } catch (err) {
    console.error("Error during CRM_Tag_Master insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_Tag_MasterUpdate = async (req, res) => {
  const { Tag_Name, Tag_colour, Company_code, modified_by, keyfield } =
    req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "U")
      .input("Tag_Name", sql.NVarChar, Tag_Name)
      .input("Tag_colour", sql.NVarChar, Tag_colour)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .input("keyfield", sql.VarChar, keyfield)
      .query(
        `EXEC sp_CRM_Tag_Master @mode, @Tag_Name, @Tag_colour, @Company_code,'', '', @modified_by, '','',@keyfield`,
      );

    res
      .status(200)
      .json({ success: true, message: "CRM_Tag_Master updated successfully" });
  } catch (err) {
    console.error("Error during CRM_Tag_Master update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const CRM_Tag_MasterDelete = async (req, res) => {
  const { Tag_Name, Company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("Tag_Name", sql.NVarChar, Tag_Name)
      .input("Company_code", sql.NVarChar, Company_code)
      .query(`EXEC sp_CRM_Tag_Master @mode, @Tag_Name, '', @Company_code, '', '', '', '','',''`,);

    res
      .status(200)
      .json({ success: true, message: "CRM_Tag_Master deleted successfully" });
  } catch (err) {
    console.error("Error during CRM_Tag_Master delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Added by Harish on 06/10/25

const GetTeam = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FD")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_SalesTeam_HDR @mode, '', '', '', '', '','',@company_code, '', '', '', '',''`,
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Ended by Harish on 06/10/25
// Code Added by Harish on 07-10-25

const GetSalesTeam = async (req, res) => {
  const { SalesTeam_Code, company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FO")
      .input("SalesTeam_Code", sql.NVarChar, SalesTeam_Code)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_NewCompany @mode,0, '', '', 0, '', '','', 0,0,'', '', '', '', '', '', '', '', '',  '', '', @SalesTeam_Code,'', '', '', '', '', '', '','',0,'',@company_code, '', '', '', '', 0, '','', '', '', '', ''`,
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const GetTeamName = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FDD")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_SalesTeam_HDR @mode, '', '', '', '', '','',@company_code, '', '', '', '',''`,
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
const GetActivity = async (req, res) => {
  const { Opportunity_ID, company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FA")
      .input("Opportunity_ID", sql.Int, Opportunity_ID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_Activity @mode, 0,@Opportunity_ID,'','', '', '', '', '', @Company_code,'','','','',0,0, '','','', '', '', '', ''`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code Ended by Harish on 07-10-25
// Code Added by Harish on 08-10-25

const GetContactClient = async (req, res) => {
  const { CompanyName, Person_name, Phone, Email, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FCI")
      .input("CompanyName", sql.VarChar, CompanyName)
      .input("Person_name", sql.VarChar, Person_name)
      .input("Phone", sql.VarChar, Phone)
      .input("Email", sql.VarChar, Email)
      .input("company_code", sql.VarChar, company_code)
      .query(
        `EXEC sp_CRM_ContactInfo 'FCI', '', '',@Email, @CompanyName,@Phone, '', '', '', '','','','','','','','','',@company_code,'','','',@Person_name,'','','','','','','','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_ContactInfo delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const GetContactInfo = async (req, res) => {
  const { ContactID, company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FC")
      .input("ContactID", sql.Int, ContactID)
      .input("company_code", sql.VarChar, company_code)
      .query(
        `EXEC sp_CRM_ContactInfo @mode,@ContactID, '', '', '','', '', '', '', '','','','','','','','','',@company_code,'','','','','','','','','','','','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_ContactInfo delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Ended by Harish on 08-10-25

//Code added by pavun on 08-10-25
const activitySearch = async (req, res) => {
  const { stage, Company, OpportunityName, ContactName, company_code, ExpectedRevenue, Payment,  } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("company_code", sql.NVarChar, company_code)
      .input("stage", sql.NVarChar, stage)
      .input("Company", sql.NVarChar, Company)
      .input("OpportunityName", sql.NVarChar, OpportunityName)
      .input("ContactName", sql.NVarChar, ContactName)
      .input("ExpectedRevenue", sql.Decimal(12, 2), ExpectedRevenue)
      .input("Payment", sql.Decimal(12, 2), Payment)
      .query(
        `EXEC sp_CRM_Activity @mode,0,0, '', '', '', '', '','',@Company_code,@stage,@Company,@OpportunityName,@ContactName,@ExpectedRevenue,@Payment,'','', '', '', '', '', ''`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 08-10-25

// code added by mathu-08-10-2025
const TagSearch = async (req, res) => {
  const { Tag_Name, Tag_colour, status, Company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("Tag_Name", sql.VarChar, Tag_Name)
      .input("Tag_colour", sql.VarChar, Tag_colour)
      .input("status", sql.NVarChar, status)
      .input("Company_code", sql.VarChar, Company_code)
      .query(
        `EXEC sp_CRM_Tag_Master @mode,@Tag_Name, @Tag_colour,@company_code,'', '', '', '', '',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_Tag insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getTagName = async (req, res) => {
  const { Company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.VarChar, "TN")
      .input("Company_code", sql.VarChar, Company_code)
      .query(
        `EXEC sp_CRM_Tag_Master @mode, '', '', @Company_code, '', '', '','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by Harish on 09-10-25
const GetActivityAll = async (req, res) => {
  const { company_code, Opportunity_ID } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "A")
      .input("company_code", sql.NVarChar, company_code)
      .input("Opportunity_ID", sql.Int, Opportunity_ID)
      .query(
        `EXEC sp_CRM_Activity @mode, 0,@Opportunity_ID,'','', '', '', '', '', @Company_code,'','','','',0,0,'','', '', '', '', '', ''`,
      );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by harish on 09-10-25

//Code added by sakthi on 09-10-25
const GetContactInfoData = async (req, res) => {
  const { ContactID, company_code } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FC")
      .input("ContactID", sql.Int, ContactID)
      .input("company_code", sql.VarChar, company_code)
      .query(
        `EXEC sp_CRM_ContactInfo @mode,@ContactID, '', '', '','', '', '', '', '','','','','','','',@company_code,'','','','','','','','','','','','','',''`,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_ContactInfo delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const GetContactInfoDetails = async (req, res) => {
  const { ContactID, company_code, sourceType } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GCD")
      .input("ContactID", sql.Int, ContactID)
      .input("company_code", sql.NVarChar, company_code)
      .input("sourceType", sql.NVarChar, sourceType)
      .query(
        `EXEC sp_CRM_ContactInfo @mode,@ContactID, '', '', '','', '', '', '', '','','','','','','','','',@company_code,'','','','','','','',@sourceType,'','','','','',''`,
      );
    if (result.recordset.length > 0) {
      const data = {
        ContactInfo: result.recordsets[0],
        Contact: result.recordsets[1] || [],
      };
      res.status(200).json(data);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_ContactInfo delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const GetCompanyMonth = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "MS")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_NewCompany @mode,0, '', '', 0, '', '','', 0,0,'', '', '', '', '', '', 0, '', '',  '', '', '', '', '', '', '', '', '','', '',0,'',@company_code, '', '', '', '', 0, '','', '', '', '', ''`,
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by pavun on 11-10-25
const SalesTeamSearch = async (req, res) => {
  const { Sales_Team, Team_Leader, Email_alias, Emails_From, Company_code } =
    req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("Sales_Team", sql.NVarChar, Sales_Team)
      .input("Team_Leader", sql.NVarChar, Team_Leader)
      .input("Email_alias", sql.NVarChar, Email_alias)
      .input("Emails_From", sql.NVarChar, Emails_From)
      .input("Company_code", sql.NVarChar, Company_code)
      .query(
        `EXEC sp_CRM_SalesTeam_HDR @mode,'',@Sales_Team,@Team_Leader,@Email_alias,@Emails_From,'',@Company_code,'','','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_SalesTeam_HDR insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 11-10-25

// Code Added by Harish on 11-10-25

const Forecastsearch = async (req, res) => {
  const { company_code, Company, Contact, SalesPersonName, OpportunityName, ExpectedRevenue, ContactPhone, Payment, Email_id, ExpectedClosing, } = req.body;
  try {
    const pool = await connection.connectToDatabase(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("Company", sql.NVarChar, Company)
      .input("Contact", sql.VarChar, Contact)
      .input("OpportunityName", sql.NVarChar, OpportunityName)
      .input("ContactPhone", sql.VarChar, ContactPhone)
      .input("ExpectedRevenue", sql.Decimal(12, 2), ExpectedRevenue)
      .input("Payment", sql.Decimal(12, 2), Payment)
      .input("Email_id", sql.VarChar, Email_id)
      .input("ExpectedClosing", sql.VarChar, ExpectedClosing)
      .input("SalesPersonName", sql.VarChar, SalesPersonName)
      .input("company_code", sql.VarChar, company_code)
      .query(`EXEC sp_CRM_NewCompany @mode, 0, @Company, @Contact, 0, @OpportunityName,'', @ContactPhone,@ExpectedRevenue, @Payment, '', @ExpectedClosing, @Email_ID, '', '',
        '', '', '', '', '', '', '','', '', '', '', '','', '', '','','', @company_code, '', '','','',0,'',@SalesPersonName,'', '', '', ''`);
    // Send response
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset); // 200 OK if data is found
    } else {
      res.status(404).json("Data not found"); // 404 Not Found if no data is found
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code Added by Harish 13-10-25

const CRM_CompanyDateUpdate = async (req, res) => {
  const { Opportunity_ID, ExpectedClosing, company_code, modified_by } =
    req.body;
  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "UDT")
      .input("Opportunity_ID", sql.Int, Opportunity_ID)
      .input("ExpectedClosing", sql.Date, ExpectedClosing)
      .input("company_code", sql.NVarChar, company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_CRM_NewCompany @mode, 0, '', '', @Opportunity_ID, '','', '',0, 0, '', @ExpectedClosing, '', '', '','', 0, '', '', '', '', '','', '', '', '', '','', '', '',0,'', @company_code, '', '','','',0,'','','','',@modified_by,''`,
      );
    res
      .status(200)
      .json({ success: true, message: "CRM_NewCompany updated successfully" });
  } catch (err) {
    console.error("Error during CRM_NewCompany update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code Added by Sakthi on 14-10-25

const CRM_CompanySearch = async (req, res) => {
  const { Company_or_Persona = "", Email = "", CompanyName = "", Phone = "", Address1 = "", Address2 = "", Address3 = "", State = "", Country = "",
  contact_no = "", Address = "", Name = "", company_code = "", status = "", Person_name = "",} = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SCC")
      .input("Company_or_Persona", sql.NVarChar, Company_or_Persona)
      .input("Email", sql.NVarChar, Email)
      .input("CompanyName", sql.NVarChar, CompanyName)
      .input("Phone", sql.NVarChar, Phone)
      .input("Address1", sql.NVarChar, Address1)
      .input("Address2", sql.NVarChar, Address2)
      .input("Address3", sql.NVarChar, Address3)
      .input("State", sql.NVarChar, State)
      .input("Country", sql.NVarChar, Country)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("Address", sql.NVarChar, Address)
      .input("Name", sql.NVarChar, Name)
      .input("company_code", sql.NVarChar, company_code)
      .input("status", sql.NVarChar, status)
      .input("Person_name", sql.NVarChar, Person_name)
      .query(`EXEC sp_CRM_ContactInfo @mode,0,@Company_or_Persona,@Email,@CompanyName,@Phone,'','','','',
        @Address1,@Address2,@Address3,'','',@State,@Country,'',@company_code,@status,'','',@Person_name,
        @Name,@contact_no,@Address,'','','','','','',''`);

    if (result.recordset && result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("CRM_CompanySearch error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Code Added by Harish on 24/10/25
const CRM_MarkUP = async (req, res) => {
  const { Activity_ID, Company_code, modified_by } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "MK")
      .input("Activity_ID", sql.Int, Activity_ID)
      .input("Company_code", sql.NVarChar, Company_code)
      .input("modified_by", sql.NVarChar, modified_by)
      .query(
        `EXEC sp_CRM_Activity @mode,@Activity_ID,0,'', '', '', '', '', '', @Company_code,'','','','',0,0,0,'','',@modified_by,'','',''`,
      );
    res
      .status(200)
      .json({ success: true, message: "CRM_Activity updated successfully" });
  } catch (err) {
    console.error("Error during CRM_Activity update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by pavun on 24-10-25
const SalesTeamChart = async (req, res) => {
  const { mode, company_code, start_date, end_date } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, mode)
      .input("company_code", sql.NVarChar, company_code)
      .input("start_date", sql.Date, start_date)
      .input("end_date", sql.Date, end_date)
      .query(
        `EXEC sp_CRM_SalesTeam_Chart @mode,@company_code,@start_date,@end_date,''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_SalesTeam_HDR insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 24-10-25

//Code added by Harish on 29-10-25
const Pipelinechart = async (req, res) => {
  const { mode, company_code, DynamicYear, start_date, end_date } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, mode)
      .input("company_code", sql.NVarChar, company_code)
      .input("start_date", sql.Date, start_date)
      .input("end_date", sql.Date, end_date)
      .input("DynamicYear", sql.Int, DynamicYear)
      .query(
        `EXEC sp_CRM_PipeLine_Chart @mode,@company_code,@start_date,@end_date,@DynamicYear,''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_SalesTeam_HDR insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 29-10-25

// Code Added by Harish on 30-09-25
const PipelineDetailChart = async (req, res) => {
  const { mode, company_code, start_date, end_date, sales_team_name } =
    req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, mode)
      .input("company_code", sql.NVarChar, company_code)
      .input("start_date", sql.Date, start_date)
      .input("end_date", sql.Date, end_date)
      .input("sales_team_name", sql.NVarChar, sales_team_name)
      .query(
        `EXEC sp_CRM_PipeLine_Chart @mode, @company_code, @start_date, @end_date, 0, @sales_team_name`,
      );

    if (result && result.recordset && result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during PipelineDetailChart:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code Added by Dinesh Gokul on 11-11-25
const ActivityChart = async (req, res) => {
  const { mode, From_Date, To_Date, company_code } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, mode)
      .input("From_Date", sql.Date, From_Date)
      .input("To_Date", sql.Date, To_Date)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_Activity_Chart @mode,@From_Date,@To_Date,@company_code,''`,
      );
    const records = result?.recordset || [];

    if (records.length > 0) {
      res.status(200).json(records);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    console.error("Error during ActivityChart insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by pavun on 31-10-25
const getDomain = async (req, res) => {
  const { company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("company_code", sql.NVarChar, company_code)
      .query(
        "EXEC sp_attribute_Info 'F',@company_code,'Domain','','', '','','' , NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL",
      );

    res.json(result.recordset);
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 31-10-25

//Code added by Dinesh Gokul on 30-10-25
const CRM_Lose_Insert = async (req, res) => {
  const { OpportunityID, Reason_for_Lose, Description, company_code, SalesTeam, Sales_man_code, Created_by, Keyfield, } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "i")
      .input("OpportunityID", sql.Int, OpportunityID)
      .input("Reason_for_Lose", sql.VarChar, Reason_for_Lose)
      .input("Description", sql.VarChar, Description)
      .input("company_code", sql.NVarChar, company_code)
      .input("SalesTeam", sql.NVarChar, SalesTeam)
      .input("Sales_man_code", sql.NVarChar, Sales_man_code)
      .input("Created_by", sql.VarChar, Created_by)
      .input("Keyfield", sql.NVarChar, Keyfield)
      .query(
        `EXEC sp_CRM_Lose @mode, @OpportunityID,@Reason_for_Lose,@Description,@company_code,@SalesTeam,@Sales_man_code, '', '',@Created_by, '', @Keyfield`,
      );

    res
      .status(200)
      .json({
        success: true,
        message: "CRM_Lose_Insert inserted successfully",
      });
  } catch (err) {
    console.error("Error during CRM_Lose_Insert insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by Dinesh Gokul on 30-10-25
const CRM_Lose_Select = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "a")
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_Lose @mode, '','','',@company_code,'','', '', '','', ''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_Lose_Select update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// Code Added by Harish on 01-11-25
const GetAllMeeting = async (req, res) => {
  const { OppurtInity_ID, company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "A")
      .input("OppurtInity_ID", sql.Int, OppurtInity_ID)
      .input("company_code", sql.NVarChar, company_code)
      .query(
        `EXEC sp_CRM_NewEvent @mode,'',@OppurtInity_ID, '', '', '', '', '', '','', @Company_code, '', '', '','','' `,
      );
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
// Code Ended by Harish on 01-11-25

//Code added by pavun on 01-11-25
const SalesTeamDetailChart = async (req, res) => {
  const { mode, company_code, start_date, end_date, detail_name } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, mode)
      .input("company_code", sql.NVarChar, company_code)
      .input("start_date", sql.Date, start_date)
      .input("end_date", sql.Date, end_date)
      .input("detail_name", sql.NVarChar, detail_name)
      .query(
        `EXEC sp_CRM_SalesTeam_Chart @mode,@company_code,@start_date,@end_date,@detail_name`,
      );

    const records = result?.recordset || [];

    if (records.length > 0) {
      res.status(200).json(records);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    console.error("Error during CRM_SalesTeam_HDR insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 01-11-25

//code added by madhu on 01-11-25
const GetActive = async (req, res) => {
  const { OpportunityName, ContactName, Company_code } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "FS")
      .input("OpportunityName", sql.NVarChar, OpportunityName)
      .input("ContactName", sql.NVarChar, ContactName)
      .input("Company_code", sql.NVarChar, Company_code)
      .query(`EXEC sp_CRM_Activity @mode,0,'','','','','','', @Company_code,'','',
          @OpportunityName, @ContactName,0,0,''Null,Null,Null,Null,Null,Null,Null`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error during CRM_Lose_Select update:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//code added by madhu on 05-11-25
const GetRevenue = async (req, res) => {
  const { Company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "RE")
      .input("Company_code", sql.NVarChar, Company_code)
      .query(
        `EXEC sp_CRM_Activity @mode, 0, 0, '', '', '', '', '', '', @Company_code, '', '', '', '', 0, 0, '', '', '', '', '', '',''`,
      );

    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error("Error fetching contacts", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//Code added by pavun on 06-11-2025
const GetAllEvent = async (req, res) => {
  const { Company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "S")
      .input("Company_code", sql.NVarChar, Company_code)
      .query(
        `EXEC sp_CRM_NewEvent @mode,'',0, '', '', '', '', '', '','', @Company_code, '', '', '','','' `,
      );

    const records = result?.recordset || [];

    if (records.length > 0) {
      res.status(200).json(records);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 06-11-2025

//code added by mathu- 06-11-2025
const CRMSalesTeamUpdateGrid = async (req, res) => {
  const editedData = req.body.editedData;

  if (!editedData || !editedData.length) {
    res.status(400).json("Invalid or empty editedData array.");
    return;
  }

  try {
    const pool = await connection.connectToDatabase(dbConfig);

    for (const updatedRow of editedData) {
      await pool
        .request()
        .input("mode", sql.NVarChar, "U") // update mode
        .input("Sales_ID", sql.NVarChar, updatedRow.Sales_ID)
        .input("Sales_Team", sql.NVarChar, updatedRow.Sales_Team)
        .input("Team_Leader", sql.NVarChar, updatedRow.Team_Leader)
        .input("Email_alias", sql.NVarChar, updatedRow.Email_alias)
        .input("Emails_From", sql.NVarChar, updatedRow.Emails_From)
        .input("Company_code", sql.NVarChar, updatedRow.Company_code)
        .input("modified_by", sql.NVarChar, updatedRow.modified_by)
        .query(
          `EXEC sp_CRM_SalesTeam_HDR @mode, @Sales_ID, @Sales_Team, @Team_Leader, @Email_alias, @Emails_From,'', @Company_code,'', @modified_by,'','',''`,
        );
    }

    res.status(200).json("Edited data saved successfully");
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code Added by Harish 06-11-25

const CRM_LoseSC = async (req, res) => {
  const {} = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "Lost")
      .query(`EXEC sp_CRM_Lose @mode,0, '', '', '', '', 0, '', '', '', ''`);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error in CRM Lose Search:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code Ended by Harish 06-11-25

//Code added by pavun on 07-11-25
const ActivityDetailChart = async (req, res) => {
  const { mode, company_code, detail_name } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, mode)
      .input("company_code", sql.NVarChar, company_code)
      .input("detail_name", sql.NVarChar, detail_name)
      .query(
        `EXEC sp_CRM_Activity_Chart @mode,'','',@company_code,@detail_name`,
      );
    const records = result?.recordset || [];

    if (records.length > 0) {
      res.status(200).json(records);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    console.error("Error during ActivityChart insert:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 07-11-25

//Code Added by Harish 07-11-25

const CRM_PV = async (req, res) => {
  const {} = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "PT")
      .query(
        `EXEC sp_CRM_PivotTable @mode, 0, '', '', '', '',  0, '', '', '', '' `,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error in CRM Lose Search:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//Code added by Dinesh Gokul on 11-11-25
const GetCalendarEvent = async (req, res) => {
  const { Company_code } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "EC")
      .input("Company_code", sql.NVarChar, Company_code)
      .query(
        `EXEC sp_CRM_NewEvent @mode,'',0, '', '', '', '', '', '','', @Company_code, '', '', '','', ''`,
      );
    const records = result?.recordset || [];
    if (records.length > 0) {
      res.status(200).json(records);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by Dinesh Gokul on 11-11-25

//Code added by pavun on 06-12-25
const CRM_Lose_Delete = async (req, res) => {
  const { OpportunityID, company_code } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("mode", sql.NVarChar, "D")
      .input("OpportunityID", sql.Int, OpportunityID)
      .input("company_code", sql.VarChar, company_code)
      .query(
        `EXEC sp_CRM_Lose @mode, @OpportunityID,'','',@company_code,'','', '', '','', '',''`,
      );
    res
      .status(200)
      .json({ success: true, message: "CRM Lose Data Deleted Successfully" });
  } catch (err) {
    console.error("Error during CRM_Lose_Delete delete:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code ended by pavun on 06-12-25

const ContactSearch = async (req, res) => {
  const { Name, contact_no, email, Address, Country, company_name, contact_name, type_of_contact, Screen_mode, Contact_Info_ID, company_code, status, } = req.body;

  try {
    const pool = await connection.connectToDatabase();

    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "SC")
      .input("Name", sql.NVarChar, Name)
      .input("contact_no", sql.NVarChar, contact_no)
      .input("email", sql.NVarChar, email)
      .input("Address", sql.NVarChar, Address)
      .input("Country", sql.NVarChar, Country)
      .input("company_name", sql.NVarChar, company_name)
      .input("contact_name", sql.NVarChar, contact_name)
      .input("type_of_contact", sql.NVarChar, type_of_contact)
      .input("Screen_mode", sql.NVarChar, Screen_mode)
      .input("Contact_Info_ID", sql.Int, Contact_Info_ID)
      .input("company_code", sql.NVarChar, company_code)
      .input("status", sql.NVarChar, status)
      .query(`EXEC sp_CRM_Contacts @mode, @Name,@contact_no,@email,@Address,@Country,'','','',@company_code,'',@Screen_mode,'',@Contact_info_id,@company_name,@contact_name,@type_of_contact,0,@status,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL
      `);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error in ContactSearch:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

//Code Added By Dinesh Gokul On 16-06-2026
const getCompanyData = async (req, res) => {
  const { company_no } = req.body;
  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GC")
      .input("company_no", sql.NVarChar, company_no)
      .query(
        `EXEC sp_company_info @mode,@company_no,'','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getCompanyMappingData = async (req, res) => {
  const { company_code, keyfiels } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GCM")
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfiels", sql.NVarChar, keyfiels)
      .query(
        `EXEC sp_user_company_mapping @mode,@company_code,'','','','',0,@keyfiels,'','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getLocationData = async (req, res) => {
  const { location_no } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GL")
      .input("location_no", sql.NVarChar, location_no)
      .query(` EXEC sp_location_info @mode,@location_no,'','','','','','','','','','', 
      '', '', '','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL `);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getRoleData = async (req, res) => {
  const { company_code, role_id } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GR")
      .input("company_code", sql.NVarChar, company_code)
      .input("role_id", sql.NVarChar, role_id)
      .query(
        `EXEC sp_Role_Info @mode,@company_code,@role_id,'','','','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getRoleMappingData = async (req, res) => {
  const { company_code, keyfield } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GRM")
      .input("company_code", sql.NVarChar, company_code)
      .input("keyfield", sql.NVarChar, keyfield)
      .query(
        `EXEC sp_user_rolemapping @mode,@company_code,'','','','',@keyfield,'','',null,null,null,null,null,null,null,null`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getRoleRightsData = async (req, res) => {
  const { company_code, keyfield } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GRSM")
      .input("company_code", sql.VarChar, company_code)
      .input("keyfield", sql.VarChar, keyfield)
      .query(
        `EXEC sp_rolescreen_mapping @mode,@company_code,'','','',@keyfield,'','',null,null,null,null,null,null,null,null`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getUserData = async (req, res) => {
  const { company_code, user_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GUIH")
      .input("company_code", sql.NVarChar, company_code)
      .input("user_code", sql.NVarChar, user_code)
      .query(`EXEC sp_user_info_hdr @mode,@company_code,@user_code,'','','','','','','','','','','','','','','','','','','','','','',''`,);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err.message);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const getAttributeData = async (req, res) => {
  const { company_code, attributeheader_code, attributedetails_code } =
    req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "GAI")
      .input("company_code", sql.NVarChar, company_code)
      .input("attributeheader_code", sql.NVarChar, attributeheader_code)
      .input("attributedetails_code", sql.NVarChar, attributedetails_code)
      .query(
        `EXEC sp_attribute_Info @mode,@company_code,@attributeheader_code,@attributedetails_code,'','','','','','','','','','','',''`,
      );

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
//Code Added By Dinesh Gokul On 16-06-2026

module.exports = {
  login,
  forgetPassword,
  signUp,
  verifyOtp,
  getvariant,
  getuom,
  getCity,
  getCountry,
  getState,
  getStatus,
  getTransaction,
  getGender,
  getLoginorout,
  getAllData,
  addData,
  userAddData,
  getAlluserData,
  getAllWareHouseData,
  getAllRoleInfoData,
  AddRoleInfoData,
  RolesaveEditedData,
  saveEditedData,
  deleteData,
  UserdeleteData,
  UsersaveEditedData,
  getAllattributehdrData,
  addattrihdrData,
  getAllattributedetData,
  addattridetData,
  updattridetData,
  deleteAttriDetailData,
  gethdrcode,
  getDeletepermission,
  getregisterbrand,
  getourbrand,
  getsearchdata,
  getUsercode,
  getUsertype,
  getCompanyno,
  getLocationno,
  getvendorcode,
  getAllVendorHdrData,
  addVendorHdrData,
  getAllVendorDetData,
  addVendorDetData,
  updvendordetData,
  VendordeleteData,
  getAllCompanyMappingData,
  addCompanyMappingData,
  getPaytype,
  getPurchasetype,
  getSalestype,
  getordertype,
  getVendorcodename,
  getroleid,
  getAllUserRoleMappingData,
  addUserRoleMappingData,
  getlocationsearchdata,
  addlocationinfo,
  locationsaveEditedData,
  locationdeleteData,
  getUserrolesearchdata,
  getUsersearchdata,
  getRolesearchdata,
  roledeleteData,
  getvendorSearchdata,
  getPartyCode,
  getcompanymappingsearchdata,
  getattributeSearchdata,
  gettranstype,
  getAllNumberseries,
  addNumberseries,
  getnumberseriessearchdata,
  saveEditedNumberseriesData,
  getscreentype,
  Passwords,
  numberseriesdeleteData,
  getusercompany,
  updcompanymapping,
  commappingdeleteData,
  getAlluserscreenmap,
  adduserscreenmap,
  saveEditeduserscreenmap,
  userscreenmapdeleteData,
  getuserscreensearchdata,
  getScreens,
  getPermissions,
  getAllcustomerhdr,
  addcustomerhdr,
  getAllCustomerDetData,
  addCustomerDetData,
  updcustomerdetData,
  customerSearchdata,
  getcustomercode,
  customerdeleteData,
  getAllopenbalance,
  addopenbalance,
  openbalsaveEditedData,
  openingbalancedeleteData,
  getopeningbalanceSearchdata,
  getCustomerCode,
  getCustomerSearchdata,
  addjournal,
  getjournalSearch,
  getUserPermission,
  saveEditjournal,
  deletejournal,
  getwarehousecode,
  facereg,
  addUserAccGrp,
  getsearchUserAccGrp,
  updUserAccGrp,
  deleteUserAccGrp,
  addAccountName,
  getAccNameSearch,
  updateAccName,
  AccNameDelete,
  getAllAccNameData,
  getDateRange,
  getUsercodename,
  getAccountCode,
  addbankAccount,
  getacctype,
  updatebankAcc,
  getbankaccSearch,
  getofftype,
  getItem,
  RollMappingDelete,
  updateRoleMapping,
  getUserRole,
  UpdateUserImage,
  getEmptype,
  getCondition,
  LocationUpdate,
  CompanyUpdate,
  UpdateCompanyImage,
  RoleUpdate,
  UserUpdate,
  CompanyMappingUpdate,
  RoleMappingUpdate,
  AttributeUpdate,
  NumberSeriesUpdate,
  VendorUpdate,
  CustomerUpdate,
  BankAccountUpdate,
  COAUpdate, //charts of Accounts
  UserAccGrpUpdate,
  getEvent,
  addSalaryDetails,
  allSalaryDetailsData,
  deleteSalaryDetails,
  updateSalaryDetails,
  getsiblings,
  getkids,
  getMartial,
  addDailyattendance,
  getSalaryType,
  getPayscale,
  getLoanID,
  getShift,
  getDocumentType,
  getCustomerDetails,
  getrelation,
  getannoncementtype,
  getAnnouncementDetail,
  getAnnouncement_Msg,
  getAnnouncement,
  getcompanyshift,
  getOverallTAX,
  getInvocieType,
  getUsercodenameBank,
  getVendorDetails,
  getFinancialDetailsSearchCretria,
  TermsDC,
  TermsQO,
  TermsPO,
  TermsTI,
  getLeaveType,
  getSelectSlot,
  getDashBoardType,
  getGST,
  getPartyName,
  getGSTReport,
  getType,
  getAccrual,
  getExceedLeave,
  getLeaveReason,
  DailyattendanceandTime,
  getCustomerCodeDrop,
  getPendingStatus,
  getdefCustomer,
  getSalesMode,
  getPurchaseAnalysis,
  addDailyLogin,
  addDailyTask,
  delDailyTask,
  getTaskstatus,
  getPriority,
  PendingCustomer,
  updateBankAccount,
  getPriority,
  getTaskDetailReport,
  Userdropdown,
  DailyLogin,
  DailyLogOUT,
  GetCC,
  InsertStockVal,
  updateStockVal,
  updateStockValStatus,
  deleteStockValue,
  StockSC,
  getAnnouncementDuration,
  AddFileAttachment,
  getboolean,
  getDocument,
  sendAutoMail,
  updateRoleRights,
  termsandCondition,
  customerCodeDropdown,
  getLockType,
  vendorCodeDropdown,
  getPrint,
  getcopies,
  AddClientBugs,
  DeleteClientBugs,
  UpdateClientBugs,
  getClientbugs,
  WeekOff,
  addCRMClient,
  updateCRMClient,
  deleteCRMClient,
  getCRMClient,
  addCRMContacts,
  updateCRMContacts,
  deleteCRMContacts,
  getCRMContacts,
  getCRMContactName,
  GenerateEmployee,
  GetUserCheckIN,
  getLeaveStatus,
  getCheckInStatus,
  GetPaymentMode,
  GetPaymentType,
  uploadImages,
  Client_PaymentInsert,
  Client_PaymentUpdate,
  Client_PaymentDelete,
  Client_PaymentLoopUpdate,
  Client_PaymentLoopDelete,
  GetClient_PaymentData,
  GetClient_PaymentDataSearch,
  CRM_ContactInfoInsert,
  CRM_ContactInfoUpdate,
  CRM_ContactInfoDelete,
  CRM_AddContactInsert,
  CRM_AddContactUpdate,
  CRM_AddContactDelete,
  CRM_SalesPersonMasterInsert,
  CRM_SalesPersonMasterUpdate,
  CRM_SalesPersonMasterDelete,
  CRM_LogNoteInsert,
  CRM_LogNoteUpdate,
  CRM_LogNoteDelete,
  CRM_MeetingSubjectInsert,
  CRM_MeetingSubjectUpdate,
  CRM_MeetingSubjectDelete,
  CRM_CampaignInsert,
  CRM_CampaignUpdate,
  CRM_CampaignDelete,
  CRM_MediumInsert,
  CRM_MediumUpdate,
  CRM_MediumDelete,
  CRM_SourceInsert,
  CRM_SourceUpdate,
  CRM_SourceDelete,
  CRM_SalesPurchaseInsert,
  CRM_SalesPurchaseUpdate,
  CRM_SalesPurchaseDelete,
  CRM_NewCompanyInsert,
  CRM_NewCompanyUpdate,
  CRM_NewCompanyDelete,
  getClientPaymentExcel,
  CompanySearch,
  CRM_ContactInfoCompanyName,
  defaultCompanyNames,
  defaultContactsName,
  companyToContact,
  contactToCompany,
  getDateRangeCRM,
  getNewCompany,
  updateNewCompanyStage,
  getOpportunityDetails,
  CRM_SalesTeam_HDRInsert,
  CRM_SalesTeam_HDRUpdate,
  CRM_SalesTeam_HDRDelete,
  CRM_SalesTeam_DetailsInsert,
  CRM_SalesTeam_DetailsUpdate,
  CRM_SalesTeam_DetailsDelete,
  CRM_ActivityInsert,
  CRM_ActivityUpdate,
  CRM_ActivityDelete,
  getCustomerDropdown,
  updateNewCompanyPeriority,
  CRM_ActivityDelete,
  CRM_NewEventInsert,
  CRM_NewEventUpdate,
  CRM_NewEventDelete,
  CRM_MessageInsert,
  CRM_MessageUpdate,
  CRM_MessageDelete,
  GetSalesperson,
  GetSalespersonALL,
  salesPersonDropdown,
  GetDataContactInfo,
  GetDataContact,
  getContactEmail,
  getContacts,
  getContactsDetails,
  getSource,
  getMedium,
  CRM_LogNoteGet,
  searchSource,
  mediumSearch,
  CampaignSearch,
  SearchSalesperson,
  getCampaign,
  CRM_Tag_MasterInsert,
  CRM_Tag_MasterUpdate,
  CRM_Tag_MasterDelete,
  CRMClientSearch,
  GetTeam,
  GetSalesTeam,
  GetTeamName,
  GetActivity,
  GetContactClient,
  GetContactInfo,
  activitySearch,
  TagSearch,
  getTagName,
  GetContactInfoData,
  GetContactInfoDetails,
  GetCompanyMonth,
  GetActivityAll,
  SalesTeamSearch,
  Forecastsearch,
  CRM_CompanyDateUpdate,
  CRM_CompanySearch,
  SalesTeamChart,
  CRM_MarkUP,
  SalesTeamChart,
  Pipelinechart,
  CRM_Lose_Insert,
  CRM_Lose_Select,
  PipelineDetailChart,
  ActivityChart,
  getDomain,
  GetAllMeeting,
  SalesTeamDetailChart,
  GetActive,
  GetRevenue,
  GetAllEvent,
  CRMSalesTeamUpdateGrid,
  CRM_LoseSC,
  ActivityDetailChart,
  CRM_PV,
  GetCalendarEvent,
  CRM_Lose_Delete,
  ContactSearch,
  getCompanyData,
  getCompanyMappingData,
  getLocationData,
  getRoleData,
  getRoleMappingData,
  getRoleRightsData,
  getUserData,
  getAttributeData,
};
