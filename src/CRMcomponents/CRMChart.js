import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function CRMCharts() {
  const navigate = useNavigate();

  // Sample data - replace with real backend data later
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
 const handleNavigate = () => {
    navigate("/Crmworkspace");
  };

  return (
    <div className="container-fluid Topnav-screen">
       <div className="shadow-lg p-2 mb-2 bg-white rounded">
        <div className="d-flex justify-content-between flex-wrap p-3">
          <div className="d-flex justify-content-start">
            <h1 className="">CRM Workspace</h1>
          </div>
          <div className="d-flex justify-content-end">
            <addbutton className="mt-2 " onClick={handleNavigate}>
              <i class="bi bi-kanban text-dark fs-4"></i>
            </addbutton>
            <addbutton className="mt-2 ">
              <i class="bi bi-card-list text-dark fs-4"></i>
            </addbutton>
            <addbutton className="mt-2 ">
              <i class="bi bi-calendar3 text-dark fs-4"></i>
            </addbutton>
            
            <addbutton className="mt-2 ">
              <i class="bi bi-stopwatch text-dark fs-4"></i>
            </addbutton>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Pie Chart: Leads by Source */}
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Leads by Source</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={leadSources} dataKey="value" nameKey="name" outerRadius={100} label>
                  {leadSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Opportunities by Stage */}
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Opportunities by Stage</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={opportunityStages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Revenue by Salesperson */}
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Revenue by Salesperson</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueBySalesperson}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart: Monthly Revenue */}
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Monthly Revenue Trend</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
