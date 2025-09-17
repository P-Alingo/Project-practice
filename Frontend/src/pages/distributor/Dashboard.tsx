import DashboardLayout from '@/components/layout/DashboardLayout';
import { Truck, Package, RotateCcw, FileText, Activity, TrendingUp, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DistributorDashboard = () => {
  const sidebarItems = [
    { icon: Truck, label: 'Dashboard', path: '/distributor/dashboard', active: true },
    { icon: Package, label: 'Active Shipments', path: '/distributor/active-shipments', active: false },
    { icon: RotateCcw, label: 'Update Shipment', path: '/distributor/update-shipment', active: false },
    { icon: FileText, label: 'Shipment Logs', path: '/distributor/shipment-logs', active: false },
    { icon: Activity, label: 'Activity Logs', path: '/distributor/activity-logs', active: false },
  ];

  const activeShipments = [
    { id: 'SHP001', destination: 'Nairobi Central Pharmacy', product: 'Paracetamol Batch BTH2024001', status: 'in-transit', eta: '2 hours' },
    { id: 'SHP002', destination: 'Mombasa Medical Store', product: 'Amoxicillin Batch BTH2024002', status: 'departed', eta: '6 hours' },
    { id: 'SHP003', destination: 'Kisumu Health Center', product: 'Ibuprofen Batch BTH2024003', status: 'delivered', eta: 'Delivered' },
  ];

  const deliveryRoutes = [
    { route: 'Nairobi - Mombasa', progress: 75, vehicles: 8 },
    { route: 'Nairobi - Kisumu', progress: 45, vehicles: 5 },
    { route: 'Nairobi - Eldoret', progress: 90, vehicles: 3 },
    { route: 'Mombasa - Malindi', progress: 20, vehicles: 2 },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="distributor" userName="Mike Distributor" userEmail="mike@logistics.co.ke">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Distribution Dashboard
          </h1>
          <p className="text-muted-foreground">Monitor shipments, track deliveries, and ensure supply chain integrity</p>
        </div>

        {/* Logistics Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
              <Truck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">24</div>
              <p className="text-xs text-cyan-600 dark:text-cyan-400">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +15% this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">96.2%</div>
              <p className="text-xs text-green-600 dark:text-green-400">Delivery performance</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fleet Vehicles</CardTitle>
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">18</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Available for dispatch</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Route Delays</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">2</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">Weather conditions</p>
            </CardContent>
          </Card>
        </div>

        {/* Shipment Tracking and Route Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
              <CardDescription>Real-time shipment tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeShipments.map((shipment) => (
                <div key={shipment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{shipment.id}</p>
                    <p className="text-xs text-muted-foreground">{shipment.destination}</p>
                    <p className="text-xs text-muted-foreground">{shipment.product}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge
                      variant={
                        shipment.status === 'delivered' ? 'default' :
                        shipment.status === 'in-transit' ? 'secondary' : 'outline'
                      }
                    >
                      {shipment.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">ETA: {shipment.eta}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Routes</CardTitle>
              <CardDescription>Route progress and fleet allocation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deliveryRoutes.map((route) => (
                <div key={route.route} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{route.route}</span>
                    <span>{route.vehicles} vehicles</span>
                  </div>
                  <Progress value={route.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {route.progress}% complete
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution Operations</CardTitle>
            <CardDescription>Quick access to logistics management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col gap-2" variant="outline">
                <Package className="h-6 w-6" />
                Track Shipment
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <RotateCcw className="h-6 w-6" />
                Update Status
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <MapPin className="h-6 w-6" />
                Route Planning
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <FileText className="h-6 w-6" />
                Delivery Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DistributorDashboard;