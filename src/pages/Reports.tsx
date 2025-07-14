import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, TrendingUp, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const monthlyData = [
  { month: 'Jan', collected: 850000, pending: 150000 },
  { month: 'Feb', collected: 920000, pending: 120000 },
  { month: 'Mar', collected: 780000, pending: 180000 },
  { month: 'Apr', collected: 950000, pending: 100000 },
  { month: 'May', collected: 880000, pending: 140000 },
  { month: 'Jun', collected: 1020000, pending: 80000 },
];

const classWiseData = [
  { class: '8', students: 120, collected: 480000, pending: 60000 },
  { class: '9', students: 135, collected: 540000, pending: 67500 },
  { class: '10', students: 140, collected: 560000, pending: 70000 },
  { class: '11', students: 125, collected: 625000, pending: 62500 },
  { class: '12', students: 110, collected: 550000, pending: 55000 },
];

const paymentMethodData = [
  { method: 'Online', value: 45, color: '#FF8C00' },
  { method: 'Cash', value: 30, color: '#8B0000' },
  { method: 'Card', value: 20, color: '#FF6347' },
  { method: 'Cheque', value: 5, color: '#CD853F' },
];

const defaultersData = [
  { id: '1', name: 'Rahul Verma', class: '10-A', amount: 15000, months: 3, contact: '+91-9876543210' },
  { id: '2', name: 'Sneha Patel', class: '9-B', amount: 12000, months: 2, contact: '+91-9876543211' },
  { id: '3', name: 'Arjun Singh', class: '11-C', amount: 18000, months: 4, contact: '+91-9876543212' },
  { id: '4', name: 'Kavya Sharma', class: '8-A', amount: 9000, months: 2, contact: '+91-9876543213' },
];

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedClass, setSelectedClass] = useState('all');
  const [reportType, setReportType] = useState('overview');

  const totalCollected = monthlyData.reduce((sum, item) => sum + item.collected, 0);
  const totalPending = monthlyData.reduce((sum, item) => sum + item.pending, 0);
  const collectionRate = (totalCollected / (totalCollected + totalPending)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive fee collection reports and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="collection">Collection Report</SelectItem>
                <SelectItem value="defaulters">Defaulters Report</SelectItem>
                <SelectItem value="class-wise">Class-wise Report</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Class {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? format(dateRange.from, "PPP") : "From Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? format(dateRange.to, "PPP") : "To Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹{(totalCollected / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">₹{(totalPending / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              -8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +15 new admissions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Collection Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Collection Trend</CardTitle>
            <CardDescription>Fee collection vs pending amounts over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                collected: { label: "Collected", color: "#FF8C00" },
                pending: { label: "Pending", color: "#8B0000" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="collected" fill="#FF8C00" />
                  <Bar dataKey="pending" fill="#8B0000" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Payment Method Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Distribution</CardTitle>
            <CardDescription>Breakdown of payment methods used</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Percentage", color: "#FF8C00" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ method, value }) => `${method}: ${value}%`}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Class-wise Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Class-wise Fee Collection</CardTitle>
          <CardDescription>Collection performance by class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Collected</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Collection Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classWiseData.map((item) => {
                  const rate = (item.collected / (item.collected + item.pending)) * 100;
                  return (
                    <TableRow key={item.class}>
                      <TableCell>
                        <Badge variant="outline">Class {item.class}</Badge>
                      </TableCell>
                      <TableCell>{item.students}</TableCell>
                      <TableCell className="text-success font-medium">
                        ₹{(item.collected / 100000).toFixed(1)}L
                      </TableCell>
                      <TableCell className="text-warning font-medium">
                        ₹{(item.pending / 100000).toFixed(1)}L
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{rate.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Defaulters Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Fee Defaulters
          </CardTitle>
          <CardDescription>Students with pending fee payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Pending Amount</TableHead>
                  <TableHead>Months Due</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {defaultersData.map((defaulter) => (
                  <TableRow key={defaulter.id}>
                    <TableCell className="font-medium">{defaulter.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{defaulter.class}</Badge>
                    </TableCell>
                    <TableCell className="text-destructive font-medium">
                      ₹{defaulter.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{defaulter.months} months</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{defaulter.contact}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Send Notice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};