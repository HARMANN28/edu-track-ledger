import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { CalendarIcon, Download, FileText, TrendingUp, Users, DollarSign, AlertTriangle, Search, Eye, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/components/AuthProvider';
import { useSupabase } from '@/hooks/useSupabase';
import { StudentProfile } from '@/components/students/StudentProfile';

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedPaymentType, setSelectedPaymentType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportType, setReportType] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isStudentProfileOpen, setIsStudentProfileOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState('student');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedClassForExport, setSelectedClassForExport] = useState('');
  const { user } = useAuth();
  const { getStudents, getPayments, loading } = useSupabase();

  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [classWiseData, setClassWiseData] = useState<any[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  const [defaultersData, setDefaultersData] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);

  const fetchReportData = async () => {
    try {
      const [studentsData, paymentsData] = await Promise.all([
        getStudents(),
        getPayments()
      ]);

      // Transform students data
      const transformedStudents = studentsData.map((student: any) => ({
        id: student.id,
        admissionNumber: student.admission_number,
        firstName: student.first_name,
        middleName: student.middle_name,
        lastName: student.last_name,
        dateOfBirth: student.date_of_birth,
        gender: student.gender,
        class: student.class,
        section: student.section,
        rollNumber: student.roll_number,
        dateOfAdmission: student.date_of_admission,
        academicYear: student.academic_year,
        fatherName: student.father_name,
        fatherOccupation: student.father_occupation,
        fatherContact: student.father_contact,
        fatherEmail: student.father_email,
        motherName: student.mother_name,
        motherOccupation: student.mother_occupation,
        motherContact: student.mother_contact,
        motherEmail: student.mother_email,
        guardianName: student.guardian_name,
        guardianRelationship: student.guardian_relationship,
        guardianContact: student.guardian_contact,
        permanentAddress: student.permanent_address,
        currentAddress: student.current_address,
        city: student.city,
        state: student.state,
        pinCode: student.pin_code,
        country: student.country,
        discountType: student.discount_type,
        discountPercentage: student.discount_percentage,
        discountValidityPeriod: student.discount_validity_period,
        status: student.status,
      }));

      setStudents(transformedStudents);
      setPayments(paymentsData);

      // Generate monthly data
      const monthlyStats = generateMonthlyData(paymentsData);
      setMonthlyData(monthlyStats);

      // Generate class-wise data
      const classStats = generateClassWiseData(transformedStudents, paymentsData);
      setClassWiseData(classStats);

      // Generate payment method data
      const methodStats = generatePaymentMethodData(paymentsData);
      setPaymentMethodData(methodStats);

      // Generate defaulters data
      const defaulters = generateDefaultersData(transformedStudents, paymentsData);
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
    const filteredStudents = studentsData.filter(student => {
      const matchesSearch = searchTerm === '' || 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = selectedClass === 'all' || student.class === selectedClass;
      const matchesSection = selectedSection === 'all' || student.section === selectedSection;
      
      return matchesSearch && matchesClass && matchesSection;
    });

    const classGroups = filteredStudents.reduce((acc, student) => {
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
    const filteredStudents = studentsData.filter(student => {
      const matchesSearch = searchTerm === '' || 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = selectedClass === 'all' || student.class === selectedClass;
      const matchesSection = selectedSection === 'all' || student.section === selectedSection;
      
      return matchesSearch && matchesClass && matchesSection;
    });

    return filteredStudents.map(student => {
      const studentPayments = paymentsData.filter(p => 
        p.student_id === student.id && (p.status === 'pending' || p.status === 'overdue')
      );
      
      if (studentPayments.length === 0) return null;

      const totalPending = studentPayments.reduce((sum, p) => sum + p.amount, 0);
      const monthsDue = studentPayments.length;

      return {
        id: student.id,
        student: student,
        name: `${student.firstName} ${student.lastName}`,
        class: `${student.class}-${student.section}`,
        amount: totalPending,
        months: monthsDue,
        contact: student.fatherContact
      };
    }).filter(Boolean);
  };

  // Filter students based on search and class
  useEffect(() => {
    const filtered = students.filter(student => {
      const matchesSearch = searchTerm === '' || 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = selectedClass === 'all' || student.class === selectedClass;
      const matchesSection = selectedSection === 'all' || student.section === selectedSection;
      
      return matchesSearch && matchesClass && matchesSection;
    });
    setFilteredStudents(filtered);
  }, [students, searchTerm, selectedClass, selectedSection]);

  React.useEffect(() => {
    fetchReportData();
  }, [searchTerm, selectedClass, selectedSection, selectedPaymentType, dateRange]);

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
    setIsStudentProfileOpen(true);
  };

  const handleStudentEdit = (student: any) => {
    // This would typically open an edit form
    console.log('Edit student:', student);
  };

  const handleExport = () => {
    const filteredData = getFilteredPayments();
    let dataToExport = filteredData.map(p => {
      const student = students.find(s => s.id === p.student_id);
      return {
        'Receipt No.': p.receipt_number,
        'Student Name': student ? student.firstName + ' ' + student.lastName : '',
        'Class': student ? student.class + '-' + student.section : '',
        'Amount': p.amount,
        'Fee Type': p.fee_type,
        'Payment Method': p.payment_method,
        'Payment Date': p.payment_date,
        'Status': p.status,
      };
    });
    let filename = 'fee_report_filtered.csv';
    if (selectedClass !== 'all') filename = `fee_report_class_${selectedClass}.csv`;
    if (selectedSection !== 'all') filename = filename.replace('.csv', `_section_${selectedSection}.csv`);
    if (searchTerm) filename = filename.replace('.csv', `_search_${searchTerm}.csv`);
    if (dateRange.from && dateRange.to) filename = filename.replace('.csv', `_from_${format(dateRange.from, 'yyyyMMdd')}_to_${format(dateRange.to, 'yyyyMMdd')}.csv`);
    if (dataToExport.length > 0) {
      const csvContent = "data:text/csv;charset=utf-8,"
        + Object.keys(dataToExport[0]).join(",") + "\n"
        + dataToExport.map(e => Object.values(e).join(",")).join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setIsExportDialogOpen(false);
  };

  // Filter payments based on student filters
  const getFilteredPayments = () => {
    const filteredStudentIds = filteredStudents
      .filter(s => selectedSection === 'all' || s.section === selectedSection)
      .map(s => s.id);
    return payments.filter(p => {
      const matchesStudent = filteredStudentIds.includes(p.student_id);
      const matchesPaymentType = selectedPaymentType === 'all' || p.payment_method === selectedPaymentType;
      let matchesDate = true;
      if (dateRange.from && dateRange.to) {
        const paymentDate = new Date(p.payment_date);
        matchesDate = paymentDate >= dateRange.from && paymentDate <= dateRange.to;
      }
      return matchesStudent && matchesPaymentType && matchesDate;
    });
  };

  const filteredPayments = getFilteredPayments();
  const totalCollected = filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = filteredPayments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
  const collectionRate = totalCollected + totalPending > 0 ? (totalCollected / (totalCollected + totalPending)) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive fee collection reports and insights</p>
        </div>
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Fee Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Show a summary of active filters for clarity */}
              <div className="text-sm text-muted-foreground">
                <div><strong>Filters:</strong></div>
                <div>Class: {selectedClass === 'all' ? 'All' : selectedClass}</div>
                <div>Section: {selectedSection === 'all' ? 'All' : selectedSection}</div>
                <div>Payment Type: {selectedPaymentType === 'all' ? 'All' : selectedPaymentType}</div>
                <div>Date Range: {dateRange.from && dateRange.to ? `${format(dateRange.from, 'PPP')} - ${format(dateRange.to, 'PPP')}` : 'All'}</div>
                <div>Search: {searchTerm || 'None'}</div>
              </div>
              <Button className="w-full" onClick={handleExport}>
                Generate and Download CSV
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="collection">Collection Report</SelectItem>
                <SelectItem value="defaulters">Defaulters Report</SelectItem>
                <SelectItem value="class-wise">Class-wise Report</SelectItem>
                <SelectItem value="student-wise">Student-wise Report</SelectItem>
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

            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger>
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {['A', 'B', 'C', 'D'].map(section => (
                  <SelectItem key={section} value={section}>
                    Section {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPaymentType} onValueChange={setSelectedPaymentType}>
              <SelectTrigger>
                <SelectValue placeholder="All Payment Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Types</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                    : "Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range || {})}
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
            <div className="text-2xl font-bold">{filteredStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              {searchTerm || selectedClass !== 'all' ? 'Filtered results' : 'Total enrolled'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Student-wise Report */}
      {reportType === 'student-wise' && (
        <Card>
          <CardHeader>
            <CardTitle>Student-wise Fee Report</CardTitle>
            <CardDescription>Individual student fee details and payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Paid</TableHead>
                    <TableHead>Total Pending</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      const studentPayments = payments.filter(p => p.student_id === student.id);
                      const totalPaid = studentPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
                      const totalPending = studentPayments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
                      const lastPayment = studentPayments
                        .filter(p => p.payment_date)
                        .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())[0];

                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.admissionNumber}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{student.firstName} {student.lastName}</p>
                              <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{student.class}-{student.section}</Badge>
                          </TableCell>
                          <TableCell className="text-success font-medium">
                            ₹{totalPaid.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-warning font-medium">
                            ₹{totalPending.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {lastPayment ? format(new Date(lastPayment.payment_date), 'dd MMM yyyy') : 'No payments'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStudentClick(student)}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Profile
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">No students found matching your criteria.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType !== 'student-wise' && (
        <>
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
                      collected: { label: "Collected", color: "hsl(var(--success))" },
                      pending: { label: "Pending", color: "hsl(var(--warning))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="collected" fill="hsl(var(--success))" />
                        <Bar dataKey="pending" fill="hsl(var(--warning))" />
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
                      value: { label: "Percentage", color: "hsl(var(--primary))" },
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
                Fee Defaulters {searchTerm || selectedClass !== 'all' ? '(Filtered)' : ''}
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
                          <TableCell className="font-medium">
                            <button
                              onClick={() => handleStudentClick(defaulter.student)}
                              className="text-left hover:text-primary transition-colors"
                            >
                              {defaulter.name}
                            </button>
                          </TableCell>
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
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStudentClick(defaulter.student)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                Send Notice
                              </Button>
                            </div>
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
        </>
      )}

      {/* Student Profile Modal */}
      <StudentProfile
        isOpen={isStudentProfileOpen}
        onClose={() => setIsStudentProfileOpen(false)}
        student={selectedStudent}
        onEdit={handleStudentEdit}
      />
    </div>
  );
};