import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  CreditCard,
  FileText,
  Edit,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import type { Student } from '@/types';
import { useSupabase } from '@/hooks/useSupabase';

interface StudentProfileProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit: (student: Student) => void;
}

const getStatusBadge = (status: Student['status']) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
    case 'inactive':
      return <Badge variant="secondary">Inactive</Badge>;
    case 'transferred':
      return <Badge className="bg-warning/10 text-warning border-warning/20">Transferred</Badge>;
    case 'withdrawn':
      return <Badge variant="destructive">Withdrawn</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getDiscountBadge = (type?: string, percentage?: number) => {
  if (!type) return null;
  
  const colors = {
    RTE: 'bg-primary/10 text-primary border-primary/20',
    SC: 'bg-secondary/10 text-secondary border-secondary/20',
    ED: 'bg-warning/10 text-warning border-warning/20',
  };
  
  return (
    <Badge className={colors[type as keyof typeof colors]}>
      {type} ({percentage}%)
    </Badge>
  );
};

const getPaymentStatusBadge = (status: string) => {
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

export const StudentProfile: React.FC<StudentProfileProps> = ({
  isOpen,
  onClose,
  student,
  onEdit,
}) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { getPayments } = useSupabase();

  const fetchStudentPayments = async () => {
    if (!student) return;
    
    setLoading(true);
    try {
      const allPayments = await getPayments();
      const studentPayments = allPayments.filter(p => p.student_id === student.id);
      setPayments(studentPayments);
    } catch (error) {
      console.error('Error fetching student payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && student) {
      fetchStudentPayments();
    }
  }, [isOpen, student]);

  if (!student) return null;

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
  const totalAmount = totalPaid + totalPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {student.firstName} {student.middleName} {student.lastName}
              </DialogTitle>
              <DialogDescription>
                Admission No: {student.admissionNumber} • Class {student.class}-{student.section}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(student.status)}
              <Button variant="outline" size="sm" onClick={() => onEdit(student)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="academic">Academic Info</TabsTrigger>
            <TabsTrigger value="fees">Fee Reports</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="text-sm">
                        {student.firstName} {student.middleName} {student.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p className="text-sm">
                        {format(new Date(student.dateOfBirth), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gender</p>
                      <p className="text-sm capitalize">{student.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <div className="mt-1">
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Permanent Address</p>
                    <p className="text-sm">{student.permanentAddress}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Other Identification Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">PAN No.</p>
                      <p className="text-sm">{student.pan_no || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Apar ID</p>
                      {(student.class !== 'NUR' && student.class !== 'LKG' && student.class !== 'UKG') && (
                        <p className="text-sm">{student.apar_id || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Samagra ID</p>
                      <p className="text-sm">{student.samagra_id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Caste</p>
                      <p className="text-sm">{student.caste || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Aadhar No.</p>
                      <p className="text-sm">{student.aadhar_no || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bank A/c</p>
                      <p className="text-sm">{student.bank_account_no || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">IFSC Code</p>
                      <p className="text-sm">{student.ifsc_code || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Student Contact No.</p>
                      <p className="text-sm">{student.student_contact_no || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Enrollment No.</p>
                      {(student.class === '10' || student.class === '12') && (
                        <p className="text-sm">{student.enrollment_no || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Academic Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Admission Number</p>
                      <p className="text-sm font-mono">{student.admissionNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                      <p className="text-sm">{student.academicYear}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Class</p>
                      <Badge variant="outline">Class {student.class}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Section</p>
                      <Badge variant="outline">Section {student.section}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
                      <p className="text-sm">{student.rollNumber}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date of Admission</p>
                    <p className="text-sm">
                      {format(new Date(student.dateOfAdmission), 'dd MMM yyyy')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Discount Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.discountType ? (
                    <>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Discount Type</p>
                        <div className="mt-1">
                          {getDiscountBadge(student.discountType, student.discountPercentage)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Discount Percentage</p>
                          <p className="text-sm">{student.discountPercentage}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Validity Period</p>
                          <p className="text-sm">{student.discountValidityPeriod || 'N/A'}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No discount applied</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fees" className="space-y-6">
            {/* Fee Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {payments.length} transactions
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
                  <CreditCard className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">₹{totalPaid.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {payments.filter(p => p.status === 'paid').length} payments
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                  <CreditCard className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">₹{totalPending.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {payments.filter(p => p.status === 'pending' || p.status === 'overdue').length} pending
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Complete fee payment records for this student</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Receipt No.</TableHead>
                          <TableHead>Fee Type</TableHead>
                          <TableHead>Month</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment Date</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.length > 0 ? (
                          payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell className="font-medium">
                                {payment.receipt_number || 'Pending'}
                              </TableCell>
                              <TableCell>{payment.fee_type}</TableCell>
                              <TableCell>{payment.month || 'N/A'}</TableCell>
                              <TableCell className="font-medium">
                                ₹{payment.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {payment.payment_date ? 
                                  format(new Date(payment.payment_date), 'dd MMM yyyy') : 
                                  'Not paid'
                                }
                              </TableCell>
                              <TableCell>
                                {format(new Date(payment.due_date), 'dd MMM yyyy')}
                              </TableCell>
                              <TableCell>
                                {getPaymentStatusBadge(payment.status)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              <p className="text-muted-foreground">No payment records found.</p>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Father's Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-sm">{student.fatherName}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Mother's Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-sm">{student.motherName}</p>
                  </div>
                </CardContent>
              </Card>

              
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};