import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useState } from 'react';

const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const chartOptions = [
  { value: 'pie', label: 'Pie Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' }
];

export default function CRMCharts() {
  const navigate = useNavigate();

  const [leadChartType, setLeadChartType] = useState('pie');
  const [stageChartType, setStageChartType] = useState('bar');
  const [salesChartType, setSalesChartType] = useState('bar');
  const [trendChartType, setTrendChartType] = useState('line');

  // Sample data
  const leadSources = [
    { name: 'Website', value: 400 },
    { name: 'Referral', value: 300 },
    { name: 'Email Campaign', value: 200 },
    { name: 'Social Media', value: 100 }
  ];

  const opportunityStages = [
    { stage: 'New', count: 10 },
    { stage: 'Qualified', count: 8 },
    { stage: 'Proposal', count: 5 },
    { stage: 'Won', count: 3 },
    { stage: 'New', count: 10 },
    { stage: 'Qualified', count: 8 },
    { stage: 'Proposal', count: 5 },
    { stage: 'Won', count: 3 },
    { stage: 'New', count: 10 },
    { stage: 'Qualified', count: 8 },
    { stage: 'Proposal', count: 5 },
    { stage: 'Won', count: 3 },
    { stage: 'New', count: 10 },
    { stage: 'Qualified', count: 8 },
    { stage: 'Proposal', count: 5 },
    { stage: 'Won', count: 3 },
    { stage: 'Lost', count: 2 }
  ];

  const revenueBySalesperson = [
    { name: 'Alice', revenue: 120000 },
    { name: 'Bob', revenue: 95000 },
    { name: 'Carol', revenue: 78000 }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 30000 },
    { month: 'Feb', revenue: 40000 },
    { month: 'Mar', revenue: 45000 },
    { month: 'Apr', revenue: 60000 },
    { month: 'May', revenue: 75000 }
  ];

  const handleNavigate = () => navigate("/Crmworkspace");

  const renderChart = (type, data, xKey, yKey) => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={700}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={700}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yKey} stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
      default:
        return (
          <ResponsiveContainer width="100%" height={700}>
            <PieChart>
              <Pie data={data} dataKey={yKey} nameKey={xKey} outerRadius={300} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };
 const handleNavigate1 = () => {
    navigate("/Crmlistpage");
  };
   const handleNavigate2 = () => {
    navigate("/CrmChart");
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

  return (
    <div className="container-fluid Topnav-screen">
      <div className="shadow-lg p-0 mb-2 bg-white rounded">
        <div className="d-flex justify-content-between flex-wrap p-1">
          <h1>CRM Analytics</h1>
          <div className="d-flex ">
            <addbutton className="mt-2 " onClick={handleNavigate} title='CRMWorkspace'>
              <i class="bi bi-kanban text-dark fs-4"></i>
            </addbutton>
            <addbutton className="mt-2 " onClick={handleNavigate1} title='CRMWorkspace'>
              <i class="bi bi-card-list text-dark fs-4"></i>
            </addbutton>
            
            <addbutton className="mt-2 " onClick={handleNavigate2}title='CRMChart'>
              <i class="bi bi-bar-chart-fill text-dark fs-4"></i>
            </addbutton>
           
           
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Leads by Source */}
        <div className="col-md-12">
          <div className="card p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex justify-content-start ms-2">
                <h5>Leads by Source</h5>
              </div>
              <div className="d-flex justify-content-end  me-5">
                <button className='col-md-4 me-3'> Insert in Spreadsheet </button>
                <Select className="col-md-3 me-3" placeholder="Measures" />
                <Select className="col-md-3 me-3" placeholder="Select Period" />
                <Select
                  options={chartOptions}
                  defaultValue={chartOptions[0]}
                  onChange={(e) => setLeadChartType(e.value)}
                  className="col-md-3"
                />
              </div>
            </div>
            {renderChart(leadChartType, leadSources, "name", "value")}
          </div>
        </div>

        {/* Opportunities by Stage */}
      </div>
    </div>
  );
}
