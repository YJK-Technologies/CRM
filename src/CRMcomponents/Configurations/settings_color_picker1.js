import React, { useState, useRef, useEffect } from 'react';

const ColorPicker = () => {
  const [color, setColor] = useState('#0d6efd');
  const [showPalette, setShowPalette] = useState(false);
  const colorBoxRef = useRef(null);
  const paletteRef = useRef(null);

  const togglePalette = () => {
    setShowPalette(!showPalette);
  };

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        paletteRef.current &&
        !paletteRef.current.contains(event.target) &&
        !colorBoxRef.current.contains(event.target)
      ) {
        setShowPalette(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const presetColors = ['#0d6efd', '#198754', '#dc3545', '#ffc107', '#20c997', '#6c757d'];

  return (
    <div className="text-muted d-flex align-items-center position-relative ms-4">
      Button Text:
      <div
        ref={colorBoxRef}
        onClick={togglePalette}
        className='ms-3'
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: color,
          borderRadius: '25px',
          marginLeft: '10px',
          cursor: 'pointer',
          border: '1px solid #ccc',
        }}
        title="Click to pick a color"
      ></div>

      {showPalette && (
        <div
          ref={paletteRef}
          className="position-absolute bg-white border p-2 shadow rounded"
          style={{
            left: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            flexWrap: 'wrap',
            width: '150px',
          }}
        >
          {presetColors.map((preset, index) => (
            <div
              key={index}
              onClick={() => {
                setColor(preset);
                setShowPalette(false);
              }}
              style={{
                backgroundColor: preset,
                width: '24px',
                height: '24px',
                margin: '4px',
                borderRadius: '4px',
                cursor: 'pointer',
                border: preset === color ? '2px solid #000' : '1px solid #ccc',
              }}
              title={preset}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
