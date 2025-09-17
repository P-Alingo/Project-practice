import DashboardLayout from '@/components/layout/DashboardLayout';
import { Package, Plus, List, Shield, Activity, Calendar, Factory, Hash, Thermometer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const RegisterBatch = () => {
  const sidebarItems = [
    { icon: Package, label: 'Dashboard', path: '/manufacturer/dashboard', active: false },
    { icon: Plus, label: 'Register Batch', path: '/manufacturer/register-batch', active: true },
    { icon: List, label: 'Batch List', path: '/manufacturer/batch-list', active: false },
    { icon: Shield, label: 'Blockchain Verification', path: '/manufacturer/blockchain-verification', active: false },
    { icon: Activity, label: 'Activity Logs', path: '/manufacturer/activity-logs', active: false },
  ];

  const recentBatches = [
    { id: 'BTH2024001', product: 'Paracetamol 500mg', quantity: 10000, date: '2024-01-15', status: 'verified' },
    { id: 'BTH2024002', product: 'Amoxicillin 250mg', quantity: 5000, date: '2024-01-14', status: 'pending' },
    { id: 'BTH2024003', product: 'Ibuprofen 400mg', quantity: 8000, date: '2024-01-13', status: 'active' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="manufacturer" userName="Sarah Manufacturer" userEmail="sarah@pharmaceutical.co.ke">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Register New Batch
          </h1>
          <p className="text-muted-foreground">Register a new drug batch with complete manufacturing details and blockchain verification</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  Batch Registration Form
                </CardTitle>
                <CardDescription>Enter complete manufacturing details for blockchain registration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="batch-id">Batch ID</Label>
                      <div className="flex gap-2">
                        <Input id="batch-id" placeholder="Auto-generated" disabled />
                        <Button variant="outline" size="sm">
                          <Hash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paracetamol-500">Paracetamol 500mg</SelectItem>
                          <SelectItem value="amoxicillin-250">Amoxicillin 250mg</SelectItem>
                          <SelectItem value="ibuprofen-400">Ibuprofen 400mg</SelectItem>
                          <SelectItem value="ciprofloxacin-500">Ciprofloxacin 500mg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity (Units)</Label>
                      <Input id="quantity" type="number" placeholder="Enter quantity" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="manufacturing-date">Manufacturing Date</Label>
                      <Input id="manufacturing-date" type="date" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <Input id="expiry-date" type="date" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="storage-temp">Storage Temperature</Label>
                      <div className="flex gap-2">
                        <Input id="storage-temp" placeholder="20-25" />
                        <div className="flex items-center px-3 border rounded-md bg-muted">
                          <Thermometer className="h-4 w-4" />
                          <span className="ml-1 text-sm">°C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Manufacturing Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Manufacturing Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facility">Manufacturing Facility</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nairobi-main">Nairobi Main Plant</SelectItem>
                          <SelectItem value="mombasa-branch">Mombasa Branch</SelectItem>
                          <SelectItem value="eldoret-facility">Eldoret Facility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="production-line">Production Line</Label>
                      <Input id="production-line" placeholder="e.g., Line A-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quality-officer">Quality Control Officer</Label>
                      <Input id="quality-officer" placeholder="Officer name" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="raw-material-batch">Raw Material Batch</Label>
                      <Input id="raw-material-batch" placeholder="Raw material batch ID" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manufacturing-notes">Manufacturing Notes</Label>
                    <Textarea 
                      id="manufacturing-notes" 
                      placeholder="Enter any additional manufacturing details, quality control notes, or special instructions..."
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                {/* Blockchain Registration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Blockchain Registration
                  </h3>
                  
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                      This batch will be registered on the blockchain for immutable tracking and anti-counterfeit protection.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:blue-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Estimated gas fee: 0.002 ETH</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button className="flex-1" size="lg">
                    <Shield className="mr-2 h-4 w-4" />
                    Register Batch on Blockchain
                  </Button>
                  <Button variant="outline" size="lg">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Batches Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Batches</CardTitle>
                <CardDescription>Recently registered batches</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentBatches.map((batch) => (
                  <div key={batch.id} className="p-3 rounded-lg bg-muted/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{batch.id}</p>
                      <Badge variant={batch.status === 'verified' ? 'default' : batch.status === 'active' ? 'secondary' : 'outline'}>
                        {batch.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{batch.product}</p>
                    <p className="text-xs text-muted-foreground">{batch.quantity.toLocaleString()} units</p>
                    <p className="text-xs text-muted-foreground">{batch.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Batch Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p>Ensure all quality control tests are completed before registration</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p>Verify raw material batch traceability</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p>Double-check expiry date calculations</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p>Blockchain registration is irreversible</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RegisterBatch;