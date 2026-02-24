import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./CRMLocation.css";
import { useNavigate, useLocation } from "react-router-dom";
import './Column.css';

// Dummy customer data
const customers = [
  { name: "Harish - T. Nagar", lat: 13.0418, lng: 80.2337, revenue: 120000 },
  { name: "Pavun - Velachery", lat: 12.9784, lng: 80.2218, revenue: 45000 },
  { name: "Rajan - Anna Nagar", lat: 13.0878, lng: 80.2106, revenue: 8000 },
];

// Helper function for marker color based on revenue
function getMarkerColor(revenue) {
  if (revenue > 100000) return "green";
  if (revenue > 30000) return "orange";
  return "red";
}

export default function CustomerMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [80.2707, 13.0827],
      zoom: 11,
    });

    const popup = new maplibregl.Popup({ offset: 25 });

    customers.forEach((customer) => {
      const el = document.createElement("div");
      el.style.backgroundColor = getMarkerColor(customer.revenue);
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.border = "2px solid white";

      const marker = new maplibregl.Marker(el)
        .setLngLat([customer.lng, customer.lat])
        .addTo(map.current);

      marker.getElement().addEventListener("click", () => {
        popup
          .setLngLat([customer.lng, customer.lat])
          .setHTML(`<strong>${customer.name}</strong>`)
          .addTo(map.current);

        setSelectedCustomer(customer);
      });
    });

    return () => map.current?.remove();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigate = () => { navigate("/crmlistpage"); };
  const handleNavigate1 = () => { navigate("/CrmChart"); };
  const handleNavigate3 = () => { navigate("/CrmScheduler"); };
  const handleNavigate4 = () => { navigate("/CrmActivity"); };
  const handleNavigate5 = () => { navigate("/CrmLocation"); };
  const handleNavigateKanban = () => { navigate("/Crmworkspace"); };

  return (
    <>
      <div className="Topnav-screen container-fluid">
        <div className="shadow-lg p-0 mb-2 bg-white rounded" >
          <div className="d-flex justify-content-between flex-wrap p-0">
            <div className="d-flex justify-content-start align-items-center ps-3">
              <h1 className="h4 mb-0">CRM Location</h1>
            </div>
            <div className="d-flex justify-content-end flex-wrap p-2">
              <addbutton className={`nav-btn-container nav-btn-kanban ${isActive('/Crmworkspace') ? 'active' : ''}`} onClick={handleNavigateKanban} title="Crmworkspace">
                <i className="bi bi-kanban nav-btn-icon"></i>
              </addbutton>
              {/* <addbutton className={`nav-btn-container nav-btn-list ${isActive('/crmlistpage') ? 'active' : ''}`} onClick={handleNavigate} title="ListPage">
                <i className="bi bi-card-list nav-btn-icon"></i>
              </addbutton> */}
              <addbutton className={`nav-btn-container nav-btn-calendar ${isActive('/CrmScheduler') ? 'active' : ''}`} onClick={handleNavigate3} title="Scheduler">
                <i className="bi bi-calendar3 nav-btn-icon"></i>
              </addbutton>
              <addbutton className={`nav-btn-container nav-btn-chart ${isActive('/CrmChart') ? 'active' : ''}`} onClick={handleNavigate1} title="Report">
                <i className="bi bi-bar-chart-fill nav-btn-icon"></i>
              </addbutton>
              {/* <addbutton className={`nav-btn-container nav-btn-activity ${isActive('/CrmActivity') ? 'active' : ''}`} onClick={handleNavigate4}>
                <i className="bi bi-stopwatch nav-btn-icon"></i>
              </addbutton> */}
              <addbutton className={`nav-btn-container nav-btn-location ${isActive('/CrmLocation') ? 'active' : ''}`} onClick={handleNavigate5} title="Location">
                <i className="bi bi-geo-alt-fill nav-btn-icon"></i>
              </addbutton>
            </div>
          </div>
        </div>
        <div
          className="d-flex  shadow-lg bg-white"
          style={{ height: "80vh", width: "100%" }}
        >
          {/* Map container */}
          <div
            ref={mapContainer}
            style={{ flex: 2, minWidth: 0 }}
          />

          {/* Side Panel */}
          <div
            style={{ flex: 1 }}
            className="p-3 border-start bg-white shadow-sm d-flex flex-column"
          >
            <h5 className="mb-4">Customer Details</h5>

            {loading && (
              <div
                className="d-flex flex-column align-items-center justify-content-center flex-grow-1"
                style={{ minHeight: "150px" }}
              >
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
                <p className="mt-3">Loading customer data...</p>
              </div>
            )}

            {!loading && selectedCustomer && (
              <div>
                <h6>{selectedCustomer.name}</h6>
                {/* <p>
              Lat: {selectedCustomer.lat}, Lng: {selectedCustomer.lng}
            </p> */}
                <p>Revenue: ₹{selectedCustomer.revenue.toLocaleString()}</p>

                <div className="progress mt-3" style={{ height: "25px" }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                    role="progressbar"
                    style={{
                      width: `${Math.min(
                        selectedCustomer.revenue / 2000,
                        100
                      )}%`,
                    }}
                  >
                    {Math.min(
                      (selectedCustomer.revenue / 2000).toFixed(0),
                      100
                    )}
                    %
                  </div>
                </div>
              </div>
            )}

            {!loading && !selectedCustomer && (
              <p className="text-muted">
                Click a marker to view customer data.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
