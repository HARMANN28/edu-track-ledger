import React, { useState } from 'react';
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
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeeStructure {
  id: string;
  class: string;
  tuitionFee: number;
  transportFee: number;
  mealFee: number;
  libraryFee: number;
  labFee: number;
  sportsFee: number;
  admissionFee: number;
  developmentFee: number;
  maintenanceFee: number;
  examFee: number;
  activityFee: number;
  lateFeePercentage: number;
}

const mockFeeStructures: FeeStructure[] = [
  {
    id: '1',
    class: '8',
    tuitionFee: 3000,
    transportFee: 800,
    mealFee: 1200,
    libraryFee: 200,
    labFee: 300,
    sportsFee: 150,
    admissionFee: 5000,
    developmentFee: 2000,
    maintenanceFee: 1000,
    examFee: 500,
    activityFee: 300,
    lateFeePercentage: 5,
  },
  {
    id: '2',
    class: '9',
    tuitionFee: 3500,
    transportFee: 800,
    mealFee: 1200,
    libraryFee: 200,
    labFee: 400,
    sportsFee: 150,
    admissionFee: 5000,
    developmentFee: 2000,
    maintenanceFee: 1000,
    examFee: 600,
    activityFee: 300,
    lateFeePercentage: 5,
  },
  {
    id: '3',
    class: '10',
    tuitionFee: 4000,
    transportFee: 800,
    mealFee: 1200,
    libraryFee: 200,
    labFee: 500,
    sportsFee: 150,
    admissionFee: 5000,
    developmentFee: 2000,
    maintenanceFee: 1000,
    examFee: 700,
    activityFee: 300,
    lateFeePercentage: 5,
  },
];

export const FeeStructure: React.FC = () => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(mockFeeStructures);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<FeeStructure>>({
    class: '',
    tuitionFee: 0,
    transportFee: 0,
    mealFee: 0,
    libraryFee: 0,
    labFee: 0,
    sportsFee: 0,
    admissionFee: 0,
    developmentFee: 0,
    maintenanceFee: 0,
    examFee: 0,
    activityFee: 0,
    lateFeePercentage: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStructure) {
      setFeeStructures(prev => 
        prev.map(structure => 
          structure.id === editingStructure.id 
            ? { ...structure, ...formData }
            : structure
        )
      );
      toast({
        title: "Fee structure updated",
        description: `Fee structure for class ${formData.class} has been updated successfully.`,
      });
    } else {
      const newStructure: FeeStructure = {
        id: Date.now().toString(),
        ...formData as FeeStructure,
      };
      setFeeStructures(prev => [...prev, newStructure]);
      toast({
        title: "Fee structure created",
        description: `Fee structure for class ${formData.class} has been created successfully.`,
      });
    }

    setIsDialogOpen(false);
    setEditingStructure(null);
    setFormData({
      class: '',
      tuitionFee: 0,
      transportFee: 0,
      mealFee: 0,
      libraryFee: 0,
      labFee: 0,
      sportsFee: 0,
      admissionFee: 0,
      developmentFee: 0,
      maintenanceFee: 0,
      examFee: 0,
      activityFee: 0,
      lateFeePercentage: 5,
    });
  };

  const handleEdit = (structure: FeeStructure) => {
    setEditingStructure(structure);
    setFormData(structure);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setFeeStructures(prev => prev.filter(structure => structure.id !== id));
    toast({
      title: "Fee structure deleted",
      description: "Fee structure has been deleted successfully.",
      variant: "destructive",
    });
  };

  const calculateTotalMonthlyFee = (structure: FeeStructure) => {
    return structure.tuitionFee + structure.transportFee + structure.mealFee + 
           structure.libraryFee + structure.labFee + structure.sportsFee;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fee Structure</h1>
          <p className="text-muted-foreground">Manage fee structures for different classes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
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
                    value={formData.lateFeePercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, lateFeePercentage: Number(e.target.value) }))}
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
                      value={formData.tuitionFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, tuitionFee: Number(e.target.value) }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transportFee">Transport Fee (₹)</Label>
                    <Input
                      id="transportFee"
                      type="number"
                      value={formData.transportFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, transportFee: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mealFee">Meal Fee (₹)</Label>
                    <Input
                      id="mealFee"
                      type="number"
                      value={formData.mealFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, mealFee: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="libraryFee">Library Fee (₹)</Label>
                    <Input
                      id="libraryFee"
                      type="number"
                      value={formData.libraryFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, libraryFee: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="labFee">Lab Fee (₹)</Label>
                    <Input
                      id="labFee"
                      type="number"
                      value={formData.labFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, labFee: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sportsFee">Sports Fee (₹)</Label>
                    <Input
                      id="sportsFee"
                      type="number"
                      value={formData.sportsFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, sportsFee: Number(e.target.value) }))}
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
                      value={formData.admissionFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, admissionFee: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="developmentFee">Development Fee (₹)</Label>
                    <Input
                      id="developmentFee"
                      type="number"
                      value={formData.developmentFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, developmentFee: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceFee">Maintenance Fee (₹)</Label>
                    <Input
                      id="maintenanceFee"
                      type="number"
                      value={formData.maintenanceFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, maintenanceFee: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Other Fees</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="examFee">Exam Fee (₹)</Label>
                    <Input
                      id="examFee"
                      type="number"
                      value={formData.examFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, examFee: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activityFee">Activity Fee (₹)</Label>
                    <Input
                      id="activityFee"
                      type="number"
                      value={formData.activityFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, activityFee: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStructure ? 'Update' : 'Create'} Fee Structure
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                  <TableHead>Exam Fee</TableHead>
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
                        Tuition: ₹{structure.tuitionFee.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ₹{(structure.admissionFee + structure.developmentFee + structure.maintenanceFee).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Admission: ₹{structure.admissionFee.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>₹{structure.examFee.toLocaleString()}</TableCell>
                    <TableCell>{structure.lateFeePercentage}%</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(structure)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(structure.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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