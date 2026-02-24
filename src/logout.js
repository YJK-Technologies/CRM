import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MainPage = () => {
    const navigate = useNavigate();
    const [isPageLoading, setIsPageLoading] = useState(false);
 
    // Check if user is logged in when component mounts
    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            // If not logged in, navigate to login page
            navigate('/login');
            
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.clear();
        sessionStorage.removeItem('isLoggedIn'); // Remove session flag
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="d-flex me-5">
            {isPageLoading && <LoadingScreen />}
           
                       <button onClick={handleLogout} className='logout-but'> <i class="fa-solid fa-right-from-bracket"></i> </button> 
                        
                        </div>
    );
};

const LoadingScreen = () => (
    <div className="loading-screen">
      <FontAwesomeIcon icon={faSpinner} spin size="4x" />
    </div>
);


export default MainPage;
