import React from 'react';
import { useTheme } from './ThemeContext';


const ThemeSwitcher = () => {
  const { setAppTheme } = useTheme();

  return (
    <div className='row '>
    {/* // <div class="dropdown d-flex">
    //  <button class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    // <i class="fa-solid fa-palette"></i> */}

      <div className='col-10 col-md-3 mb-3  form-control'>
      <i className="Ocean" variant="light" onClick={() => setAppTheme('blue')}></i>
      </div>
      <div className='col-10 col-md-3 mb-3 form-control '><i className="Volcanic"  variant="danger" onClick={() => setAppTheme('red')}></i></div>
      <div className='col-10 col-md-3 mb-3  form-control'><i className="Leaf"  variant="success" onClick={() => setAppTheme('green')}></i></div>
      <div className='col-10 col-md-3 mb-3  form-control'><i class="Dark"  onClick={() => setAppTheme('dark')}></i></div>
      <div className='col-10 col-md-3 mb-3  form-control'><i class="brown"  onClick={() => setAppTheme('brown')}></i></div>
      <div className='col-10 col-md-3 mb-3 form-control'><i class="Navi"  onClick={() => setAppTheme('Rose')}></i></div>
      {/* <div className='col-10 col-md-2'><i class="Orange"  onClick={() => setAppTheme('Orange')}></i></div> */}
      
      
     
    
  </div>
    
    
    
 
  );
};

export default ThemeSwitcher;
