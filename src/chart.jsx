import React, { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

const Chart = () => {
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5500/");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const fetchedData = await response.json();

        // Group data by 'expenses_spentby' and sum up 'expenses_spent' values
        const aggregatedData = fetchedData.reduce((acc, current) => {
          const index = acc.findIndex(item => item.expenses_spentby === current.expenses_spentby);
          if (index !== -1) {
            acc[index].expenses_amount += current.expenses_amount;
          } else {
            acc.push({ expenses_spentby: current.expenses_spentby, expenses_amount: current.expenses_amount });
          }
          return acc;
        }, []);

        setExpenseData(aggregatedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%">
      <BarChart data={expenseData}>
        <XAxis dataKey="expenses_spentby" stroke="#2884ff" />
        <Bar dataKey="expenses_amount" stroke="#2884ff" fill="#2884ff" barSize={30} />
        <Tooltip wrapperClassName="tooltip__style" cursor={false} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;





/*
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Chart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5500/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();

      // Aggregate data by expenses_type and sum up expenses_amount
      const aggregatedData = aggregateData(jsonData);

      setData(aggregatedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to aggregate data by expenses_type
  const aggregateData = (originalData) => {
    const aggregatedData = [];
    const map = new Map();
    originalData.forEach((item) => {
      const { expenses_type, expenses_amount } = item;
      if (map.has(expenses_type)) {
        map.set(expenses_type, map.get(expenses_type) + expenses_amount);
      } else {
        map.set(expenses_type, expenses_amount);
      }
    });
    map.forEach((value, key) => {
      aggregatedData.push({ expenses_type: key, expenses_amount: value });
    });
    return aggregatedData;
  };

  return (
    <div id="myAreaChart">
      <h1>Expenditure by Types</h1>
      <BarChart width={600} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="expenses_type" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="expenses_amount" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default Chart;
*/
/*
import React, { useState, useEffect } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Chart() {
    const [expensesData, setExpensesData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5800/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();

            setExpensesData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>

            <div className='main-cards'>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>EXPENSES</h3>
                        <BsFillArchiveFill className='card_icon' />
                    </div>
                    <h1>{expensesData.length}</h1>
                </div>
              
                <div className='card'>
                    <div className='card-inner'>
                        <h3>CATEGORIES</h3>
                        <BsFillGrid3X3GapFill className='card_icon' />
                    </div>
                    <h1></h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>CUSTOMERS</h3>
                        <BsPeopleFill className='card_icon' />
                    </div>
                    <h1></h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>ALERTS</h3>
                        <BsFillBellFill className='card_icon' />
                    </div>
                    <h1></h1>
                </div>
            </div>

            <div className='charts'>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={expensesData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="expenses_type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="expenses_amount" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </main>
    )
}

export default Chart;

*/

/*
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5800/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();

      // Aggregate data by job and sum up salary
      const aggregatedData = aggregateData(jsonData);

      setData(aggregatedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to aggregate data by job
  const aggregateData = (originalData) => {
    const aggregatedData = [];
    const map = new Map();
    originalData.forEach((item) => {
      const { job, salary } = item;
      if (map.has(job)) {
        map.set(job, map.get(job) + salary);
      } else {
        map.set(job, salary);
      }
    });
    map.forEach((value, key) => {
      aggregatedData.push({ job: key, salary: value });
    });
    return aggregatedData;
  };

  return (
    <div>
      <h1>Data Dashboard</h1>
      <BarChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="job" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="salary" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default App;

*/
