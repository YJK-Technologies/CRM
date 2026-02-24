import { useState } from 'react';
import LeadModal from './modal';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import { useNavigate } from "react-router-dom";

const initialData = {
  columns: {
    new: {
      name: 'New',
      items: [
        // {
        //   id: 'lead-1',
        //   company: 'Company X',
        //   contact: 'John Doe',
        //   opportunity: 'Website Revamp',
        //   email: 'john@example.com',
        //   phone: '1234567890',
        //   investment: 10000,
        //   rotational: 3000
        // },
        // {
        //   id: 'lead-2',
        //   company: 'Company Y',
        //   contact: 'Jane Smith',
        //   opportunity: 'Mobile App',
        //   email: 'jane@example.com',
        //   phone: '9876543210',
        //   investment: 20000,
        //   rotational: 5000
        // }
      ]
    },
    qualified: {
      name: 'Qualified',
      items: []
    },
    proposal: {
      name: 'Proposal',
      items: []
    },
    won: {
      name: 'Won',
      items: []
    }
  }
};

export default function CRMBoard() {

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [fontSize, setFontSize] = useState(14);


 const handleNavigate = () => {
    navigate("/crmlistpage"); // Pass selectedRows as props to the Input component
  };
   const handleNavigate1 = () => {
    navigate("/CrmChart"); // Pass selectedRows as props to the Input component
  };

     const handleNavigate3 = () => {
    navigate("/CrmScheduler"); // Pass selectedRows as props to the Input component
  };

     const handleNavigate4 = () => {
    navigate("/CrmActivity"); // Pass selectedRows as props to the Input component
  };
    const handleNavigate5 = () => {
    navigate("/CrmLocation"); // Pass selectedRows as props to the Input component
  };
   const handleNavigateKanban = () => {
    navigate("/Crmworkspace"); // Pass selectedRows as props to the Input component
  };
 const [activeTab, setActiveTab] = useState('notes');
  const [text, setText] = useState('');
  const [contact, setContact] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const styles = {
    container: {
      padding: '20px',
     
      margin: 'auto',
      fontFamily: 'sans-serif',
    },
    textarea: {
      width: '100%',
      height: '300px',
      padding: '10px',
      fontSize: '16px',
      backgroundColor: '#fffbe6',
      borderRadius: '8px',
      border: '1px solid #ccc',
      resize: 'vertical',
    },
    tabButton: (tab) => ({
      padding: '10px 20px',
      marginRight: '10px',
      border: '1px',
      borderBottom: activeTab === tab ? '3px solid #007bff' : '3px solid transparent',
      backgroundColor: 'transparent',
      fontWeight: activeTab === tab ? 'bold' : 'normal',
      cursor: 'pointer',
      color: "black"
    }),
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '16px',
    }
  };
  return (
    <>
      <div className="container-fluid Topnav-screen">
        <div className="shadow-lg p-0 mb-2 bg-white rounded">
          <div className="d-flex justify-content-between flex-wrap p-1">
            <div className="d-flex justify-content-start">
              <h1 className="">CRM Workspace</h1>
            </div>
            <div className="d-flex justify-content-end">
              <addbutton className="mt-2 " onClick={handleNavigateKanban}>
                <i class="bi bi-kanban text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate}>
                <i class="bi bi-card-list text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate3}>
                <i class="bi bi-calendar3 text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate1}>
                <i class="bi bi-bar-chart-fill text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate4}>
                <i class="bi bi-stopwatch text-dark fs-4"></i>
              </addbutton>
              <addbutton className="mt-2 " onClick={handleNavigate5}>
                <i class="bi bi-geo-alt-fill text-dark fs-4"></i>
              </addbutton>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="shadow-lg p-3 col-md-8 bg-white rounded me-2 ms-3">
            <div>
              <div className="row col-md-8 p-2">
                <h3 className="ms-4">Name</h3>
                <div className="col-md-6">
                  <p>Expected Revenue</p>
                  <p>₹ 0.00</p>
                </div>
                <div className="col-md-6">
                  <p>Probability</p>
                  <p>at 0.00 %</p>
                </div>
              </div>
            </div>
            <p className="fw-bold">Contact</p>

            <div className="row col-md-8 p-2">
              <div className="col-md-6">
                <p>Email:</p>
                <p>Phone:</p>
              </div>
              <div className="col-md-6">
                <p>Salesperson:</p>
                <p>Expected Closing:</p>
                <p>
                  Tags (!){" "}
                  <input
                    type="text"
                    placeholder="Tags here"
                    className="form-control w-50 d-inline-block"
                  />
                </p>
              </div>
            </div>

            <div style={styles.container}>
              <div className="d-flex justify-content-start mb-3">
                <button
                  style={styles.tabButton("notes")}
                  onClick={() => setActiveTab("notes")}
                >
                  Notes
                </button>
                <button
                  style={styles.tabButton("contacts")}
                  onClick={() => setActiveTab("contacts")}
                >
                  Contacts
                </button>
              </div>

              {activeTab === "notes" ? (
                <>
                  <h2 className="d-flex justify-content-start">Notes</h2>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing your notes..."
                    style={styles.textarea}
                  />
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary mb-3"
                    onClick={handleOpenModal}
                  >
                    Add Contact
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="shadow-lg p-3 col-md-3 bg-white rounded pe-5"></div>
        </div>
      </div>
     {showModal && (
  <div
    className="modal show fade d-block"
    tabIndex="-1"
    role="dialog"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <div className="row col-md-12 align-items-center">
            <div className="col-md-11">
              <h5 className="modal-title fw-bold">Add Contact</h5>
            </div>
            <div className="col-md-1 text-end">
              <button
                className="btn btn-sm btn-danger"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="modal-body">
          {/* Contact Type Radio Buttons */}
          <div className="mb-3 border-bottom pb-3">
            <div className="d-flex gap-3">
              {["Contact", "Invoice", "Delivery", "Others"].map((type) => (
                <div className="form-check form-check-inline" key={type}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="contactType"
                    id={`radio-${type}`}
                    value={type}
                    checked={contact.type === type}
                    onChange={(e) =>
                      setContact({ ...contact, type: e.target.value })
                    }
                  />
                  <label className="form-check-label fw-semibold" htmlFor={`radio-${type}`}>
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Input Fields */}
          <div className="row">
            <div className="col-md-12">
              <input
                type="text"
                placeholder="Name"
                value={contact.name}
                onChange={(e) =>
                  setContact({ ...contact, name: e.target.value })
                }
                className="form-control mb-3"
              />
            </div>
           
            <div className="col-md-12">
              <input
                type="email"
                placeholder="Email"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
                className="form-control mb-3"
              />
            </div>
            <div className="col-md-12">
              <input
                type="Number"
                placeholder="Phone"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
                className="form-control mb-3"
              />
            </div>
            <div className="col-md-12">
              <input
                type="text"
                placeholder="Job"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
                className="form-control mb-3"
              />
            </div>

             {/* Notes Section */}
            <div className="col-md-12">
              <textarea
                placeholder="Notes"
                value={contact.notes}
                onChange={(e) =>
                  setContact({ ...contact, notes: e.target.value })
                }
                rows={4}
                className="form-control mb-3"
              ></textarea>
            </div>


            {/* ASCII Tools Section */}
            <div className="col-md-12">


  {/* Upload + Font Size */}
  <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
    <div>
      <input
        type="file"
        accept=".txt,.ascii"
        className="form-control form-control-sm"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setContact({ ...contact, ascii: e.target.result });
            };
            reader.readAsText(file);
          }
        }}
      />
    </div>

    <div className="d-flex align-items-center gap-2">
      <label className="mb-0 fw-semibold">Font Size:</label>
      <input
        type="range"
        min="10"
        max="30"
        value={fontSize}
        onChange={(e) => setFontSize(e.target.value)}
        style={{ width: "120px" }}
      />
      <span>{fontSize}px</span>
    </div>
  </div>

  <div className="col-md-12">
  <label className="fw-semibold mb-1">Notes Editor</label>

  {/* Format Buttons */}
  <div className="d-flex gap-2 mb-2 flex-wrap">
    <button
      className="btn btn-outline-secondary btn-sm"
      onClick={() =>
        setContact({
          ...contact,
          ascii: contact.ascii + "**bold text**",
        })
      }
    >
      Bold
    </button>
    <button
      className="btn btn-outline-secondary btn-sm"
      onClick={() =>
        setContact({
          ...contact,
          ascii: contact.ascii + "_italic text_",
        })
      }
    >
      Italic
    </button>
    <button
      className="btn btn-outline-secondary btn-sm"
      onClick={() =>
        setContact({
          ...contact,
          ascii: contact.ascii + "__underline text__",
        })
      }
    >
      Underline
    </button>
    <button
      className="btn btn-outline-danger btn-sm"
      onClick={() => setContact({ ...contact, ascii: "" })}
    >
      Clear
    </button>
  </div>

  {/* ASCII/Notes Textarea */}
  <textarea
    placeholder="Write notes here (supports basic Markdown-like formatting)"
    value={contact.ascii}
    onChange={(e) =>
      setContact({ ...contact, ascii: e.target.value })
    }
    rows={6}
    className="form-control font-monospace"
    style={{
      whiteSpace: "pre-wrap",
      fontFamily: "monospace",
      fontSize: `${fontSize}px`,
    }}
  ></textarea>
</div>
</div>

          </div>
        </div>

        <div className="modal-footer">
          
          <addbutton
            className=""
            onClick={() => {
              console.log(contact);
              handleCloseModal();
            }}
          >
            <i class="bi bi-floppy2-fill text-success fs-4"></i>
          </addbutton>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
}
