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
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/components/AuthProvider';
import { useRBAC } from '@/hooks/useRBAC';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface FeeStructure {
  id: string;
  class: string;
  monthly_fees: any;
  annual_fees: any;
  exam_fees: any;
  activity_fees: number;
  late_fee_percentage: number;
}

export const FeeStructure: React.FC = () => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);
  const { getFeeStructures, createFeeStructure, updateFeeStructure, deleteFeeStructure, loading } = useSupabase();
  const { user } = useAuth();
  const { canRead, canCreate, canUpdate, canDelete } = useRBAC();

  if (!canRead('fee-structure')) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fee Structure</h1>
          <p className="text-muted-foreground">Fee structures for different classes</p>
        </div>
        <PermissionGuard resource="fee-structure" action="read" showAlert={true} />
      </div>
    );
  }

  const [formData, setFormData] = useState({
    class: '',
    monthly_fees: {
      tuition: 0,
      transport: 0,
      meal: 0,
      library: 0,
      lab: 0,
      sports: 0,
    },
    annual_fees: {
      admission: 0,
      development: 0,
      maintenance: 0,
    },
    exam_fees: {
      quarterly: 0,
      halfYearly: 0,
      annual: 0,
    },
    activity_fees: 0,
    late_fee_percentage: 5,
  });

  const fetchFeeStructures = async () => {
    const data = await getFeeStructures();
    if (data) {
      setFeeStructures(data);
    }
  };

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStructure) {
        await updateFeeStructure(editingStructure.id, formData);
      } else {
        await createFeeStructure(formData);
      }
      
      await fetchFeeStructures();
      setIsDialogOpen(false);
      setEditingStructure(null);
      resetForm();
    } catch (error) {
      console.error('Error saving fee structure:', error);
    }
  };

  const handleEdit = (structure: FeeStructure) => {
    setEditingStructure(structure);
    setFormData({
      class: structure.class,
      monthly_fees: structure.monthly_fees || {
        tuition: 0,
        transport: 0,
        meal: 0,
        library: 0,
        lab: 0,
        sports: 0,
      },
      annual_fees: structure.annual_fees || {
        admission: 0,
        development: 0,
        maintenance: 0,
      },
      exam_fees: structure.exam_fees || {
        quarterly: 0,
        halfYearly: 0,
        annual: 0,
      },
      activity_fees: structure.activity_fees || 0,
      late_fee_percentage: structure.late_fee_percentage || 5,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteFeeStructure(id);
    if (success) {
      await fetchFeeStructures();
    }
  };

  const resetForm = () => {
    setFormData({
      class: '',
      monthly_fees: {
        tuition: 0,
        transport: 0,
        meal: 0,
        library: 0,
        lab: 0,
        sports: 0,
      },
      annual_fees: {
        admission: 0,
        development: 0,
        maintenance: 0,
      },
      exam_fees: {
        quarterly: 0,
        halfYearly: 0,
        annual: 0,
      },
      activity_fees: 0,
      late_fee_percentage: 5,
    });
  };

  const calculateTotalMonthlyFee = (structure: FeeStructure) => {
    const monthly = structure.monthly_fees || {};
    return Object.values(monthly).reduce((sum: number, value: any) => sum + (Number(value) || 0), 0);
  };

  const calculateTotalAnnualFee = (structure: FeeStructure) => {
    const annual = structure.annual_fees || {};
    return Object.values(annual).reduce((sum: number, value: any) => sum + (Number(value) || 0), 0);
  };

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
          <h1 className="text-3xl font-bold text-foreground">Fee Structure</h1>
          <p className="text-muted-foreground">Manage fee structures for different classes</p>
        </div>
        <PermissionGuard resource="fee-structure" action="create">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={resetForm}>
                <Plus className="h-4 w-4" />
                Add Fee Structure
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStructure ? 'Edit Fee Structure' : 'Add New Fee Structure'}
              </DialogTitle>
              <DialogDescription>
                Set up the fee structure for a class including monthly and annual fees.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select
                    value={formData.class}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Class {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateFeePercentage">Late Fee Percentage (%)</Label>
                  <Input
                    id="lateFeePercentage"
                    type="number"
                    value={formData.late_fee_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, late_fee_percentage: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Monthly Fees</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tuitionFee">Tuition Fee (₹)</Label>
                    <Input
                      id="tuitionFee"
                      type="number"
                      value={formData.monthly_fees.tuition}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        monthly_fees: { ...prev.monthly_fees, tuition: Number(e.target.value) }
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transportFee">Transport Fee (₹)</Label>
                    <Input
                      id="transportFee"
                      type="number"
                      value={formData.monthly_fees.transport}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        monthly_fees: { ...prev.monthly_fees, transport: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mealFee">Meal Fee (₹)</Label>
                    <Input
                      id="mealFee"
                      type="number"
                      value={formData.monthly_fees.meal}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        monthly_fees: { ...prev.monthly_fees, meal: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="libraryFee">Library Fee (₹)</Label>
                    <Input
                      id="libraryFee"
                      type="number"
                      value={formData.monthly_fees.library}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        monthly_fees: { ...prev.monthly_fees, library: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="labFee">Lab Fee (₹)</Label>
                    <Input
                      id="labFee"
                      type="number"
                      value={formData.monthly_fees.lab}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        monthly_fees: { ...prev.monthly_fees, lab: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sportsFee">Sports Fee (₹)</Label>
                    <Input
                      id="sportsFee"
                      type="number"
                      value={formData.monthly_fees.sports}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        monthly_fees: { ...prev.monthly_fees, sports: Number(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Annual Fees</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admissionFee">Admission Fee (₹)</Label>
                    <Input
                      id="admissionFee"
                      type="number"
                      value={formData.annual_fees.admission}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        annual_fees: { ...prev.annual_fees, admission: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="developmentFee">Development Fee (₹)</Label>
                    <Input
                      id="developmentFee"
                      type="number"
                      value={formData.annual_fees.development}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        annual_fees: { ...prev.annual_fees, development: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceFee">Maintenance Fee (₹)</Label>
                    <Input
                      id="maintenanceFee"
                      type="number"
                      value={formData.annual_fees.maintenance}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        annual_fees: { ...prev.annual_fees, maintenance: Number(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Exam Fees</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quarterlyExamFee">Quarterly Exam Fee (₹)</Label>
                    <Input
                      id="quarterlyExamFee"
                      type="number"
                      value={formData.exam_fees.quarterly}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        exam_fees: { ...prev.exam_fees, quarterly: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="halfYearlyExamFee">Half Yearly Exam Fee (₹)</Label>
                    <Input
                      id="halfYearlyExamFee"
                      type="number"
                      value={formData.exam_fees.halfYearly}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        exam_fees: { ...prev.exam_fees, halfYearly: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualExamFee">Annual Exam Fee (₹)</Label>
                    <Input
                      id="annualExamFee"
                      type="number"
                      value={formData.exam_fees.annual}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        exam_fees: { ...prev.exam_fees, annual: Number(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Other Fees</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activityFee">Activity Fee (₹)</Label>
                    <Input
                      id="activityFee"
                      type="number"
                      value={formData.activity_fees}
                      onChange={(e) => setFormData(prev => ({ ...prev, activity_fees: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingStructure ? 'Update' : 'Create')} Fee Structure
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
          </Dialog>
        </PermissionGuard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fee Structures
          </CardTitle>
          <CardDescription>
            Manage fee structures for different classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Monthly Fee</TableHead>
                  <TableHead>Annual Fee</TableHead>
                  <TableHead>Activity Fee</TableHead>
                  <TableHead>Late Fee %</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeStructures.map((structure) => (
                  <TableRow key={structure.id}>
                    <TableCell>
                      <Badge variant="outline">Class {structure.class}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{calculateTotalMonthlyFee(structure).toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        Tuition: ₹{(structure.monthly_fees?.tuition || 0).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ₹{calculateTotalAnnualFee(structure).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Admission: ₹{(structure.annual_fees?.admission || 0).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>₹{(structure.activity_fees || 0).toLocaleString()}</TableCell>
                    <TableCell>{structure.late_fee_percentage}%</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <PermissionGuard resource="fee-structure" action="update">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(structure)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>
                        <PermissionGuard resource="fee-structure" action="delete">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the fee structure.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(structure.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </PermissionGuard>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {feeStructures.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No fee structures found. Create your first fee structure.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};