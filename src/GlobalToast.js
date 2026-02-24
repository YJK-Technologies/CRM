import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let toastDisplayed = false;

export const showEightHourToast = (onConfirm) => {
  if (toastDisplayed) return;

  toastDisplayed = true;

  toast(
    ({ closeToast }) => (
      <div>
        <p>⏱ You have worked for 8 hours!</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "5px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              onConfirm();
              closeToast();
            }}
          >
            OK
          </button>
        </div>
      </div>
    ),
    {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    }
  );
};
