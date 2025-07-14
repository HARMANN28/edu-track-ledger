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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Search, Filter, Download, CreditCard, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/components/AuthProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface Payment {
  id: string;
  student_id: string;
  student_name: string;
  class: string;
  amount: number;
  fee_type: string;
  payment_method: 'cash' | 'cheque' | 'online' | 'card';
  payment_date: string;
  due_date: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  receipt_number: string;
  academic_year: string;
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

const getPaymentMethodBadge = (method: Payment['payment_method']) => {
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
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentDate, setPaymentDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const { getPayments, createPayment, updatePayment, deletePayment, loading } = useSupabase();
  const { user } = useAuth();

  if (user?.role === 'staff') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Fee payments and transactions</p>
        </div>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access payment management. This feature is only available for administrators.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    student_name: '',
    class: '',
    amount: 0,
    fee_type: '',
    payment_method: 'cash' as Payment['payment_method'],
    payment_date: '',
    due_date: '',
    status: 'pending' as Payment['status'],
    academic_year: '2024-25',
    month: '',
    remarks: '',
  });

  const fetchPayments = async () => {
    const data = await getPayments();
    if (data) {
      setPayments(data);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const paymentData = {
        ...formData,
        student_id: editingPayment?.student_id || `student_${Date.now()}`, // This should be a real student ID in production
        // Let database generate receipt_number automatically
      };

      if (editingPayment) {
        await updatePayment(editingPayment.id, paymentData);
      } else {
        await createPayment(paymentData);
      }
      
      await fetchPayments();
      setIsDialogOpen(false);
      setEditingPayment(null);
      resetForm();
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormData({
      student_name: payment.student_name,
      class: payment.class,
      amount: payment.amount,
      fee_type: payment.fee_type,
      payment_method: payment.payment_method,
      payment_date: payment.payment_date,
      due_date: payment.due_date,
      status: payment.status,
      academic_year: payment.academic_year,
      month: payment.month || '',
      remarks: payment.remarks || '',
    });
    setPaymentDate(payment.payment_date ? new Date(payment.payment_date) : undefined);
    setDueDate(payment.due_date ? new Date(payment.due_date) : undefined);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await deletePayment(id);
    if (success) {
      await fetchPayments();
    }
  };

  const resetForm = () => {
    setFormData({
      student_name: '',
      class: '',
      amount: 0,
      fee_type: '',
      payment_method: 'cash',
      payment_date: '',
      due_date: '',
      status: 'pending',
      academic_year: '2024-25',
      month: '',
      remarks: '',
    });
    setPaymentDate(undefined);
    setDueDate(undefined);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <Button className="gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPayment ? 'Edit Payment' : 'Record New Payment'}
              </DialogTitle>
              <DialogDescription>
                {editingPayment ? 'Update payment information' : 'Record a new fee payment for a student'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student_name">Student Name</Label>
                  <Input
                    id="student_name"
                    value={formData.student_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, student_name: e.target.value }))}
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
                  <Label htmlFor="fee_type">Fee Type</Label>
                  <Select
                    value={formData.fee_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, fee_type: value }))}
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
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value as Payment['payment_method'] }))}
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
                            payment_date: date ? format(date, "yyyy-MM-dd") : '' 
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
                            due_date: date ? format(date, "yyyy-MM-dd") : '' 
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
                  <Label htmlFor="academic_year">Academic Year</Label>
                  <Input
                    id="academic_year"
                    value={formData.academic_year}
                    onChange={(e) => setFormData(prev => ({ ...prev, academic_year: e.target.value }))}
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
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingPayment ? 'Update Payment' : 'Record Payment')}
                </Button>
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
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.receipt_number || 'Pending'}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.student_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Class {payment.class}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                      {payment.month && (
                        <div className="text-sm text-muted-foreground">
                          {payment.month} {payment.academic_year}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{payment.fee_type}</TableCell>
                    <TableCell>
                      {getPaymentMethodBadge(payment.payment_method)}
                    </TableCell>
                    <TableCell>
                      <div>
                        {payment.payment_date ? (
                          <p className="text-sm">
                            {format(new Date(payment.payment_date), 'dd MMM yyyy')}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not paid</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Due: {format(new Date(payment.due_date), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(payment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Payment
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the payment record.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(payment.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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