import React, { useState } from 'react';
import { useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Search, Filter, Download, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/hooks/useSupabase';

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  amount: number;
  feeType: string;
  paymentMethod: 'cash' | 'cheque' | 'online' | 'card';
  paymentDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  receiptNumber: string;
  academicYear: string;
  month?: string;
  remarks?: string;
}


const getStatusBadge = (status: Payment['status']) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-success/10 text-success border-success/20">Paid</Badge>;
    case 'pending':
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    case 'overdue':
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Overdue</Badge>;
    case 'partial':
      return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Partial</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getPaymentMethodBadge = (method: Payment['paymentMethod']) => {
  const colors = {
    cash: 'bg-primary/10 text-primary border-primary/20',
    cheque: 'bg-secondary/10 text-secondary border-secondary/20',
    online: 'bg-success/10 text-success border-success/20',
    card: 'bg-warning/10 text-warning border-warning/20',
  };
  
  return (
    <Badge className={colors[method]}>
      {method.charAt(0).toUpperCase() + method.slice(1)}
    </Badge>
  );
};

export const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentDate, setPaymentDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const { toast } = useToast();
  const { getPayments, createPayment, loading } = useSupabase();

  const [formData, setFormData] = useState<Partial<Payment>>({
    studentName: '',
    class: '',
    amount: 0,
    feeType: '',
    paymentMethod: 'cash',
    paymentDate: '',
    dueDate: '',
    status: 'pending',
    academicYear: '2024-25',
    month: '',
    remarks: '',
  });

  useEffect(() => {
    const fetchPayments = async () => {
      const data = await getPayments();
      if (data) {
        // Transform database data to match our Payment interface
        const transformedData = data.map((payment: any) => ({
          id: payment.id,
          studentId: payment.student_id,
          studentName: payment.student_name,
          class: payment.class,
          amount: payment.amount,
          feeType: payment.fee_type,
          paymentMethod: payment.payment_method,
          paymentDate: payment.payment_date,
          dueDate: payment.due_date,
          status: payment.status,
          receiptNumber: payment.receipt_number,
          academicYear: payment.academic_year,
          month: payment.month,
          remarks: payment.remarks,
        }));
        setPayments(transformedData);
      }
    };

    fetchPayments();
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const createNewPayment = async () => {
      const paymentData = {
        student_id: Date.now().toString(), // This should be selected from actual students
        student_name: formData.studentName,
        class: formData.class,
        amount: formData.amount,
        fee_type: formData.feeType,
        payment_method: formData.paymentMethod,
        payment_date: formData.paymentDate,
        due_date: formData.dueDate,
        status: formData.status,
        receipt_number: `RCP${String(payments.length + 1).padStart(3, '0')}`,
        academic_year: formData.academicYear,
        month: formData.month,
        remarks: formData.remarks,
      };

      const result = await createPayment(paymentData);
      if (result) {
        // Refresh payments list
        const updatedPayments = await getPayments();
        if (updatedPayments) {
          const transformedData = updatedPayments.map((payment: any) => ({
            id: payment.id,
            studentId: payment.student_id,
            studentName: payment.student_name,
            class: payment.class,
            amount: payment.amount,
            feeType: payment.fee_type,
            paymentMethod: payment.payment_method,
            paymentDate: payment.payment_date,
            dueDate: payment.due_date,
            status: payment.status,
            receiptNumber: payment.receipt_number,
            academicYear: payment.academic_year,
            month: payment.month,
            remarks: payment.remarks,
          }));
          setPayments(transformedData);
        }

        setIsDialogOpen(false);
        setFormData({
          studentName: '',
          class: '',
          amount: 0,
          feeType: '',
          paymentMethod: 'cash',
          paymentDate: '',
          dueDate: '',
          status: 'pending',
          academicYear: '2024-25',
          month: '',
          remarks: '',
        });
        setPaymentDate(undefined);
        setDueDate(undefined);
      }
    };

    createNewPayment();
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || !statusFilter || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = filteredPayments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = filteredPayments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Manage fee payments and transactions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
              <DialogDescription>
                Record a new fee payment for a student.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Input
                    id="class"
                    value={formData.class}
                    onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                    placeholder="e.g., 10-A"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feeType">Fee Type</Label>
                  <Select
                    value={formData.feeType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, feeType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly Fee">Monthly Fee</SelectItem>
                      <SelectItem value="Admission Fee">Admission Fee</SelectItem>
                      <SelectItem value="Exam Fee">Exam Fee</SelectItem>
                      <SelectItem value="Transport Fee">Transport Fee</SelectItem>
                      <SelectItem value="Activity Fee">Activity Fee</SelectItem>
                      <SelectItem value="Late Fee">Late Fee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as Payment['paymentMethod'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Payment['status'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Payment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !paymentDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paymentDate ? format(paymentDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={paymentDate}
                        onSelect={(date) => {
                          setPaymentDate(date);
                          setFormData(prev => ({ 
                            ...prev, 
                            paymentDate: date ? format(date, "yyyy-MM-dd") : '' 
                          }));
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => {
                          setDueDate(date);
                          setFormData(prev => ({ 
                            ...prev, 
                            dueDate: date ? format(date, "yyyy-MM-dd") : '' 
                          }));
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Select
                    value={formData.month}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ].map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={formData.academicYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                    placeholder="2024-25"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Input
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="Any additional notes"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Payment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹{paidAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.filter(p => p.status === 'paid').length} payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">₹{pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.filter(p => p.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Records
          </CardTitle>
          <CardDescription>
            View and manage all payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, receipt number, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Payments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt No.</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.receiptNumber || 'Pending'}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.studentName}</p>
                        <p className="text-sm text-muted-foreground">
                          Class {payment.class}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                      {payment.month && (
                        <div className="text-sm text-muted-foreground">
                          {payment.month} {payment.academicYear}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{payment.feeType}</TableCell>
                    <TableCell>
                      {getPaymentMethodBadge(payment.paymentMethod)}
                    </TableCell>
                    <TableCell>
                      <div>
                        {payment.paymentDate ? (
                          <p className="text-sm">
                            {format(new Date(payment.paymentDate), 'dd MMM yyyy')}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not paid</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Due: {format(new Date(payment.dueDate), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payments found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};