import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Function to show the confirmation toast
export const showConfirmationToast = (message, onConfirm, onCancel) => {
    toast(
        <div>
            {message}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                    style={{
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        toast.dismiss(); 
                        onConfirm();
                    }}
                >
                    Yes
                </button>
                <button
                    style={{
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        toast.dismiss(); 
                        onCancel(); 
                    }}
                >
                    No
                </button>
            </div>
        </div>,
        {
            autoClose: false, 
            closeButton: false,
        }
    );
};
