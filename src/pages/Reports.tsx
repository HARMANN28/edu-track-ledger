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
import { useAuth } from '@/components/AuthProvider';
import { useSupabase } from '@/hooks/useSupabase';


export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedClass, setSelectedClass] = useState('all');
  const [reportType, setReportType] = useState('overview');
  const { user } = useAuth();
  const { getStudents, getPayments, loading } = useSupabase();

  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [classWiseData, setClassWiseData] = useState<any[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  const [defaultersData, setDefaultersData] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  const fetchReportData = async () => {
    try {
      const [studentsData, paymentsData] = await Promise.all([
        getStudents(),
        getPayments()
      ]);

      setStudents(studentsData);
      setPayments(paymentsData);

      // Generate monthly data
      const monthlyStats = generateMonthlyData(paymentsData);
      setMonthlyData(monthlyStats);

      // Generate class-wise data
      const classStats = generateClassWiseData(studentsData, paymentsData);
      setClassWiseData(classStats);

      // Generate payment method data
      const methodStats = generatePaymentMethodData(paymentsData);
      setPaymentMethodData(methodStats);

      // Generate defaulters data
      const defaulters = generateDefaultersData(studentsData, paymentsData);
      setDefaultersData(defaulters);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const generateMonthlyData = (paymentsData: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const monthPayments = paymentsData.filter(p => 
        p.month && p.month.substring(0, 3) === month
      );
      
      const collected = monthPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const pending = monthPayments
        .filter(p => p.status === 'pending' || p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);

      return { month, collected, pending };
    });
  };

  const generateClassWiseData = (studentsData: any[], paymentsData: any[]) => {
    const classGroups = studentsData.reduce((acc, student) => {
      const className = student.class;
      if (!acc[className]) {
        acc[className] = [];
      }
      acc[className].push(student);
      return acc;
    }, {});

    return Object.entries(classGroups).map(([className, classStudents]: [string, any[]]) => {
      const studentIds = classStudents.map(s => s.id);
      const classPayments = paymentsData.filter(p => 
        studentIds.includes(p.student_id)
      );

      const collected = classPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const pending = classPayments
        .filter(p => p.status === 'pending' || p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        class: className,
        students: classStudents.length,
        collected,
        pending
      };
    });
  };

  const generatePaymentMethodData = (paymentsData: any[]) => {
    const paidPayments = paymentsData.filter(p => p.status === 'paid');
    const total = paidPayments.length;
    
    if (total === 0) return [];

    const methods = ['cash', 'online', 'cheque', 'card'];
    const colors = ['#FF8C00', '#8B0000', '#32CD32', '#4169E1'];

    return methods.map((method, index) => {
      const count = paidPayments.filter(p => p.payment_method === method).length;
      const percentage = Math.round((count / total) * 100);
      
      return {
        method: method.charAt(0).toUpperCase() + method.slice(1),
        value: percentage,
        color: colors[index]
      };
    }).filter(item => item.value > 0);
  };

  const generateDefaultersData = (studentsData: any[], paymentsData: any[]) => {
    return studentsData.map(student => {
      const studentPayments = paymentsData.filter(p => 
        p.student_id === student.id && (p.status === 'pending' || p.status === 'overdue')
      );
      
      if (studentPayments.length === 0) return null;

      const totalPending = studentPayments.reduce((sum, p) => sum + p.amount, 0);
      const monthsDue = studentPayments.length;

      return {
        id: student.id,
        name: `${student.first_name} ${student.last_name}`,
        class: `${student.class}-${student.section}`,
        amount: totalPending,
        months: monthsDue,
        contact: student.father_contact
      };
    }).filter(Boolean);
  };

  React.useEffect(() => {
    fetchReportData();
  }, []);

  const totalCollected = monthlyData.reduce((sum, item) => sum + (item.collected || 0), 0);
  const totalPending = monthlyData.reduce((sum, item) => sum + (item.pending || 0), 0);
  const collectionRate = totalCollected + totalPending > 0 ? (totalCollected / (totalCollected + totalPending)) * 100 : 0;

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

      {user?.role === 'staff' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Staff Access:</strong> You have view and export access to reports. Contact an administrator for data modifications.
          </p>
        </div>
      )}

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
                {Array.from(new Set(students.map(s => s.class))).sort().map((className) => (
                  <SelectItem key={className} value={className}>
                    Class {className}
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
            <div className="text-2xl font-bold text-success">₹{totalCollected > 0 ? (totalCollected / 100000).toFixed(1) + 'L' : '0'}</div>
            <p className="text-xs text-muted-foreground">
              {monthlyData.length > 0 ? 'This period' : 'No data available yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">₹{totalPending > 0 ? (totalPending / 100000).toFixed(1) + 'L' : '0'}</div>
            <p className="text-xs text-muted-foreground">
              {monthlyData.length > 0 ? 'Outstanding' : 'No data available yet'}
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
              {monthlyData.length > 0 ? 'Overall rate' : 'No data available yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              {students.length > 0 ? 'Total enrolled' : 'No students added yet'}
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
            {monthlyData.length > 0 ? (
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
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No data available for chart</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Distribution</CardTitle>
            <CardDescription>Breakdown of payment methods used</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentMethodData.length > 0 ? (
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
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No payment data available for chart</p>
              </div>
            )}
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
                {classWiseData.length > 0 ? (
                  classWiseData.map((item) => {
                    const rate = (item.collected / (item.collected + item.pending)) * 100;
                    return (
                      <TableRow key={item.class}>
                        <TableCell>
                          <Badge variant="outline">Class {item.class}</Badge>
                        </TableCell>
                        <TableCell>{item.students}</TableCell>
                        <TableCell className="text-success font-medium">
                          ₹{item.collected.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-warning font-medium">
                          ₹{item.pending.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${isNaN(rate) ? 0 : rate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{isNaN(rate) ? '0.0' : rate.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">No class data available yet.</p>
                    </TableCell>
                  </TableRow>
                )}
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
                {defaultersData.length > 0 ? (
                  defaultersData.map((defaulter) => (
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No defaulters found.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};