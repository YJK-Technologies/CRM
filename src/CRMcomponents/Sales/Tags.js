import { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import TagsHelp from './TagsHelp';
import Select from 'react-select';
import { toast } from 'react-toastify';



const config = require('../../Apiconfig');

const Tags = ({ showTagSearch, onTagSearchClose, onSaveTagName }) => {
  const gridRef = useRef();
  const [searchResults, setSearchResults] = useState([]);
  const [showTagsHelp,  setShowTagsHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Tag_Name, setTagName] = useState("");
  const [Tag_colour, setTagColor] = useState("");
  const [rowData, setRowData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const popupRef = useRef(null);
  if (!showTagSearch) return null;

  const handleRowClick = (params) => {
    const selectedTags = params.data.Tag_Name;
    if (onSaveTagName) {
      onSaveTagName(selectedTags);
    }
  };

  const groupByOptions = [
    "Tag_Name",
    "Tag_colour",
    "status"

  ];


  const filterOptions = [
    // "My Pipeline", 

  ];


  const columnDefs = [
    { headerName: 'Tag Name', field: 'Tag_Name', cellStyle: { cursor: "pointer" }, },
    { headerName: 'Tag Colour', field: 'Tag_colour', cellStyle: { cursor: "pointer" }, },
  ];

  // const handleSearch = async () => {
  //    try {
  //      setLoading(true);
  //      const response = await fetch(`${config.apiBaseUrl}/TagSearch`, {
  //        method: "POST",
  //        headers: { "Content-Type": "application/json" },
  //        body: JSON.stringify({
  //         Tag_Name :Tag_Name,
  //         Tag_colour:Tag_colour,
  //         status:status,
  //         company_code: sessionStorage.getItem("selectedCompanyCode"),
  //        }),
  //      });

  //      if (response.ok) {
  //        const searchData = await response.json();
  //        setRowData(searchData);
  //        toast.success("Data fetched successfully!");
  //      } else if (response.status === 404) {
  //        setRowData([]);
  //        toast.warning("No data found for this company");
  //      } else {
  //        const errorResponse = await response.json();
  //        toast.error(errorResponse.message || "Failed to fetch sales data");
  //      }
  //    } catch (error) {
  //      toast.error("Error fetching data: " + error.message);
  //    } finally {
  //      setLoading(false);
  //    }
  // //  };

  const handleSearch = async () => {
    try {
      const payload = {};
      const Company_code = sessionStorage.getItem("selectedCompanyCode");

      if (Company_code) {
        payload.Company_code = Company_code;
      }

      selectedTags.forEach(tag => {
        const parts = tag.split(':');
        if (parts.length > 1) {
          const field = parts[0].trim().replace(/\s/g, '');
          const value = parts[1].trim();
          if (field === "Tag_Name") payload.Tag_Name = value;
          if (field === "Tag_colour") payload.Tag_colour = value;

        }
      });

      const response = await fetch(`${config.apiBaseUrl}/TagSearch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching company data:", error);
      setSearchResults([]);
    }
  };




  const handleSelect = (item) => {
    let tagToSet = item;
    if (item.startsWith("Search ")) {
      const parts = item.split(" for: ");
      const field = parts[0].replace("Search ", "");
      const query = parts[1];
      tagToSet = `${field}: ${query}`;
    }

    if (!selectedTags.includes(tagToSet)) {
      setSelectedTags([...selectedTags, tagToSet]);
    }
    setOpenDropdown(null);
    setShowPopup(false);
    setSearchQuery("");
  };
  const handleRemove = (item) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== item));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowPopup(true);
  };

  return (
    <div
      className="modal d-block mt-5 popupadj Topnav-screen popup"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">

          <div className="modal-header">
            <div className="d-flex justify-content-between w-100">
              <h5 className="modal-title">Search Tags</h5>
              <button
                className="btn btn-danger"
                onClick={onTagSearchClose}
                aria-label="Close"
                title='Close'
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          <div className="modal-body">
            {/* Search Filters */}
            <div className="row mb-3 d-flex justify-content-center">
              <div className="col-md-7 position-relative">
                <div className="input-group">
                  <div className="form-control border-start-1 d-flex flex-wrap align-items-center">
                    {selectedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="badge bg-primary me-1 mb-1"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemove(tag)}
                      >
                        {tag} <i className="bi bi-x"></i>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="border-0 p-0"
                      placeholder="Search"
                      onFocus={() => setShowPopup(true)}
                      onChange={handleSearchChange}
                      value={searchQuery}
                    />
                  </div>
                  <span title='Search' className="input-group-text bg-white border-end-1"
                    onClick={handleSearch} style={{ cursor: "pointer" }}>
                    <i className="bi bi-search"></i>
                  </span>
                </div>
                {showPopup && (
                  <div
                    ref={popupRef}
                    className="popup-menu shadow bg-white border"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "600px",
                      zIndex: 1000,
                      padding: "15px",
                    }}
                  >
                    {searchQuery.length > 0 ? (
                      <div>
                        <h6 className="fw-bold mb-3">Search for: {searchQuery}</h6>
                        <ul className="list-unstyled">
                          {groupByOptions.map((option, index) => (
                            <li
                              key={index}
                              className="p-1"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSelect(`Search ${option} for: ${searchQuery}`)}
                            >
                              Search {option} for: <strong>{searchQuery}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="d-flex ">
                        <div className="flex-fill px-3  text-center">
                          <h6 className="fw-bold mb-3">Filter</h6>
                          <ul className="list-unstyled">
                            {groupByOptions.map((item) => (
                              <li
                                key={item}
                                className={`p-1 ${selectedTags.includes(item)
                                  ? "bg-light fw-bold"
                                  : ""
                                  }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleSelect(item)}
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="col-md-1 mt-1">
                <button
                  className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                  type="button"
                  onClick={() => setShowTagsHelp(true)}
                  aria-label="Add New"
                  style={{ width: "30px", height: "30px" }}
                  title="Add"
                >
                  <i
                    className="bi bi-plus text-center"
                    style={{ fontSize: "26px" }}
                  ></i> 
                </button>
              </div>
            </div>
            {/* </div> */}

            {/* Grid */}
            <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
              <AgGridReact
                ref={gridRef}
                rowData={searchResults}
                columnDefs={columnDefs}
                pagination={true}
                paginationAutoPageSize={true}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                  flex: true,
                }}
                onRowClicked={(params) => handleRowClick(params)}
              />
            </div>
          </div>
        </div>
      </div>


      {showTagsHelp && (
        <TagsHelp
          showTag={showTagsHelp}
          onCloseC={() => setShowTagsHelp(false)}
        />
      )}
    </div>
  );
};

export default Tags;
