'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CompanyData } from '@/lib/data-processor';
import { TrendingUp, Users, Truck, DollarSign, Globe } from 'lucide-react';

interface CompanyChartsProps {
  company: CompanyData;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function CompanyCharts({ company }: CompanyChartsProps) {
  // Generate chart data from company metrics
  const financialData = [
    { name: 'Revenue', value: company.metrics.revenue || 0, color: '#3b82f6' },
    { name: 'Market Cap', value: company.metrics.marketCap || 0, color: '#10b981' },
    { name: 'Valuation', value: company.metrics.valuation || 0, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const fleetData = {
    total: company.metrics.fleetSize || 0,
    category: company.metrics.fleetSizeRange || 'N/A'
  };

  // Mock vehicle type distribution (in real app, extract from CSV)
  const vehicleTypeData = [
    { name: 'Light Duty', value: 45, units: Math.floor((fleetData.total * 0.45) || 0) },
    { name: 'Heavy Duty', value: 30, units: Math.floor((fleetData.total * 0.30) || 0) },
    { name: 'Medium Duty', value: 15, units: Math.floor((fleetData.total * 0.15) || 0) },
    { name: 'Other', value: 10, units: Math.floor((fleetData.total * 0.10) || 0) },
  ];

  return (
    <>
      {/* Financial Overview */}
      {financialData.length > 0 && (
        <Card className="bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              Financial Overview
            </CardTitle>
          </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    tickFormatter={(value) => `$${(value / 1_000_000).toFixed(0)}M`}
                  />
                  <Tooltip
                    formatter={(value: any) => `$${(value / 1_000_000).toFixed(1)}M`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

      {/* Vehicle Type Distribution */}
      {fleetData.total > 0 && (
        <Card className="bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Truck className="h-4 w-4 text-green-600" />
              Vehicle Type Distribution
            </CardTitle>
          </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={vehicleTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vehicleTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any, props: any) => [
                      `${props.payload.units.toLocaleString()} units`,
                      name
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Global Presence Map */}
      {company.geography.markets.length > 0 && (
        <Card className="bg-white border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-orange-600" />
              Global Presence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {company.geography.markets.slice(0, 12).map((market, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="text-xs font-medium text-gray-900">{market}</span>
                  </div>
                ))}
              </div>
              {company.geography.headquarters && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Headquarters:</span> {company.geography.headquarters}
                  </p>
                </div>
              )}
            </div>
        </CardContent>
      </Card>
    )}
    </>
  );
}

// Client section
export function ClientsSection({ company }: { company: CompanyData }) {
  const customers = company.relationships.customers?.slice(0, 20) || [];
  
  if (customers.length === 0) return null;

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-600" />
          Key Clients ({customers.length}+)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {customers.map((client, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <p className="text-sm font-medium text-gray-900 truncate">{client}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
