import DashboardLayout from '@/components/layout/DashboardLayout';
import { Package, Plus, List, Shield, Activity, TrendingUp, Factory, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ManufacturerDashboard = () => {
  const sidebarItems = [
    { icon: Package, label: 'Dashboard', path: '/manufacturer/dashboard', active: true },
    { icon: Plus, label: 'Register Batch', path: '/manufacturer/register-batch', active: false },
    { icon: List, label: 'Batch List', path: '/manufacturer/batch-list', active: false },
    { icon: Shield, label: 'Blockchain Verification', path: '/manufacturer/blockchain-verification', active: false },
    { icon: Activity, label: 'Activity Logs', path: '/manufacturer/activity-logs', active: false },
  ];

  const recentBatches = [
    { id: 'BTH2024001', product: 'Paracetamol 500mg', quantity: 10000, status: 'active', date: '2024-01-15' },
    { id: 'BTH2024002', product: 'Amoxicillin 250mg', quantity: 5000, status: 'pending', date: '2024-01-14' },
    { id: 'BTH2024003', product: 'Ibuprofen 400mg', quantity: 8000, status: 'verified', date: '2024-01-13' },
  ];

  const productionMetrics = [
    { name: 'Paracetamol', target: 10000, produced: 8500 },
    { name: 'Amoxicillin', target: 5000, produced: 4200 },
    { name: 'Ibuprofen', target: 8000, produced: 7600 },
    { name: 'Ciprofloxacin', target: 3000, produced: 2100 },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="manufacturer" userName="Sarah Manufacturer" userEmail="sarah@pharmaceutical.co.ke">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Manufacturing Dashboard
          </h1>
          <p className="text-muted-foreground">Monitor production, manage batches, and ensure drug authenticity</p>
        </div>

        {/* Production Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
              <Factory className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">127</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8% this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Products</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">98.5%</div>
              <p className="text-xs text-green-600 dark:text-green-400">Quality assurance rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Production</CardTitle>
              <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">2.1M</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Units produced</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">3</div>
              <p className="text-xs text-red-600 dark:text-red-400">Requires investigation</p>
            </CardContent>
          </Card>
        </div>

        {/* Production Metrics and Recent Batches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Production Progress</CardTitle>
              <CardDescription>Current month targets vs actual production</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {productionMetrics.map((metric) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{metric.name}</span>
                    <span>{metric.produced.toLocaleString()} / {metric.target.toLocaleString()}</span>
                  </div>
                  <Progress value={(metric.produced / metric.target) * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {Math.round((metric.produced / metric.target) * 100)}% complete
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Batches</CardTitle>
              <CardDescription>Latest batch registrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentBatches.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{batch.id}</p>
                    <p className="text-xs text-muted-foreground">{batch.product}</p>
                    <p className="text-xs text-muted-foreground">{batch.quantity.toLocaleString()} units</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge
                      variant={
                        batch.status === 'verified' ? 'default' :
                        batch.status === 'active' ? 'secondary' : 'outline'
                      }
                    >
                      {batch.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{batch.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Manufacturing Operations</CardTitle>
            <CardDescription>Quick access to common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col gap-2" variant="outline">
                <Plus className="h-6 w-6" />
                New Batch
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <List className="h-6 w-6" />
                View Batches
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <Shield className="h-6 w-6" />
                Verify Quality
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <Activity className="h-6 w-6" />
                Production Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManufacturerDashboard;