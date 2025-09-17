import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Activity, User, Shield, Settings, Eye, Download, Filter, Clock, AlertTriangle, CheckCircle, Database } from "lucide-react";

const AdminActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const activityLogs = [
    {
      id: "LOG-ADM-001",
      timestamp: "2024-02-20 15:45:32",
      user: "Admin User",
      role: "System Administrator", 
      action: "system_setting_changed",
      description: "Updated system backup schedule from daily to hourly",
      module: "System Settings",
      severity: "info",
      ipAddress: "192.168.1.10",
      userAgent: "Chrome 121.0.0.0",
      success: true,
      details: {
        field: "backup_schedule",
        oldValue: "daily",
        newValue: "hourly"
      }
    },
    {
      id: "LOG-ADM-002",
      timestamp: "2024-02-20 15:30:18",
      user: "John Doe",
      role: "Admin",
      action: "user_account_created",
      description: "Created new user account for Dr. Mary Smith",
      module: "User Management",
      severity: "info",
      ipAddress: "192.168.1.15",
      userAgent: "Firefox 122.0.0.0",
      success: true,
      details: {
        targetUser: "Dr. Mary Smith",
        role: "Doctor",
        permissions: "Standard Doctor Access"
      }
    },
    {
      id: "LOG-ADM-003",
      timestamp: "2024-02-20 15:15:45",
      user: "Security System",
      role: "System",
      action: "security_breach_attempt",
      description: "Multiple failed login attempts detected from suspicious IP",
      module: "Security",
      severity: "critical",
      ipAddress: "197.156.89.45",
      userAgent: "Unknown Client",
      success: false,
      details: {
        attempts: 15,
        targetAccount: "admin@bluerxflow.ke",
        blocked: true
      }
    },
    {
      id: "LOG-ADM-004",
      timestamp: "2024-02-20 14:45:22",
      user: "Sarah Johnson",
      role: "Administrator",
      action: "report_generated",
      description: "Generated monthly system usage report",
      module: "Reports",
      severity: "info",
      ipAddress: "192.168.1.12",
      userAgent: "Chrome 120.0.0.0",
      success: true,
      details: {
        reportType: "System Usage",
        period: "February 2024",
        recipients: 5
      }
    },
    {
      id: "LOG-ADM-005",
      timestamp: "2024-02-20 14:30:10",
      user: "Database Service",
      role: "System",
      action: "database_backup_completed",
      description: "Automated database backup completed successfully",
      module: "Database",
      severity: "success",
      ipAddress: "127.0.0.1",
      userAgent: "System Process",
      success: true,
      details: {
        backupSize: "2.4 GB",
        duration: "45 minutes",
        location: "/backups/2024-02-20/"
      }
    },
    {
      id: "LOG-ADM-006",
      timestamp: "2024-02-20 13:15:33",
      user: "Mike Wilson",
      role: "Admin",
      action: "permission_changed",
      description: "Modified user permissions for pharmacy staff",
      module: "User Management",
      severity: "warning",
      ipAddress: "192.168.1.18",
      userAgent: "Chrome 121.0.0.0",
      success: true,
      details: {
        targetUser: "Pharmacy Staff Group",
        changedPermissions: ["prescription_verification", "inventory_management"],
        action: "granted"
      }
    }
  ];

  const logStats = [
    { title: "Total Activities", value: "3,247", icon: Activity, color: "text-primary" },
    { title: "Critical Events", value: "8", icon: AlertTriangle, color: "text-destructive" },
    { title: "Successful Actions", value: "3,185", icon: CheckCircle, color: "text-success" },
    { title: "System Events", value: "124", icon: Database, color: "text-secondary" }
  ];

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: "bg-destructive text-destructive-foreground animate-pulse",
      warning: "bg-warning text-warning-foreground",
      success: "bg-success text-success-foreground",
      info: "bg-primary text-primary-foreground"
    };
    return variants[severity as keyof typeof variants] || variants.info;
  };

  const getActionIcon = (action: string) => {
    const icons = {
      system_setting_changed: Settings,
      user_account_created: User,
      security_breach_attempt: Shield,
      report_generated: Activity,
      database_backup_completed: Database,
      permission_changed: Shield
    };
    return icons[action as keyof typeof icons] || Activity;
  };

  const getModuleColor = (module: string) => {
    const colors = {
      "System Settings": "text-primary",
      "User Management": "text-secondary",
      "Security": "text-destructive",
      "Reports": "text-warning",
      "Database": "text-success"
    };
    return colors[module as keyof typeof colors] || "text-muted-foreground";
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gradient">Admin Activity Logs</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Comprehensive audit trail of all administrative activities
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Logs
          </Button>
          <Button className="medical-button gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filter
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="medical-grid">
        {logStats.map((stat, index) => (
          <Card key={index} className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="healthcare-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by user, action, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="system">System Changes</SelectItem>
                <SelectItem value="user">User Management</SelectItem>
                <SelectItem value="security">Security Events</SelectItem>
                <SelectItem value="reports">Report Actions</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="user-actions">User Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle>Recent Administrative Activity</CardTitle>
              <CardDescription>
                Chronological view of all administrative system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs.map((log) => {
                  const ActionIcon = getActionIcon(log.action);
                  return (
                    <div key={log.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className={`p-2 rounded-full ${log.success ? 'bg-success/10' : 'bg-destructive/10'}`}>
                        <ActionIcon className={`w-5 h-5 ${log.success ? 'text-success' : 'text-destructive'}`} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{log.description}</h3>
                            <Badge className={getSeverityBadge(log.severity)}>
                              {log.severity}
                            </Badge>
                            {!log.success && (
                              <Badge variant="destructive">Failed</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {formatTime(log.timestamp)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">User:</span> {log.user}
                          </div>
                          <div>
                            <span className="font-medium">Role:</span> {log.role}
                          </div>
                          <div>
                            <span className="font-medium">Module:</span> <span className={getModuleColor(log.module)}>{log.module}</span>
                          </div>
                          <div>
                            <span className="font-medium">IP:</span> {log.ipAddress}
                          </div>
                        </div>
                        {log.details && (
                          <div className="text-sm bg-accent/30 p-3 rounded-lg">
                            <span className="font-medium">Details:</span>
                            <div className="mt-1 space-y-1">
                              {Object.entries(log.details).map(([key, value]) => (
                                <div key={key}>
                                  <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Details
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <div className="space-y-4">
            {activityLogs.filter(log => log.severity === 'critical').map((log) => {
              const ActionIcon = getActionIcon(log.action);
              return (
                <Card key={log.id} className="healthcare-card border-l-4 border-l-destructive">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-destructive/10 rounded-full">
                        <ActionIcon className="w-6 h-6 text-destructive" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-destructive">{log.description}</h3>
                          <span className="text-sm text-muted-foreground">{formatTime(log.timestamp)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>User:</strong> {log.user}</div>
                          <div><strong>Module:</strong> {log.module}</div>
                          <div><strong>IP Address:</strong> {log.ipAddress}</div>
                          <div><strong>Status:</strong> {log.success ? 'Success' : 'Failed'}</div>
                        </div>
                        {log.details && (
                          <div className="text-sm bg-destructive/10 p-3 rounded-lg">
                            <strong>Critical Details:</strong>
                            <div className="mt-1 space-y-1">
                              {Object.entries(log.details).map(([key, value]) => (
                                <div key={key}>
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="space-y-4">
            {activityLogs.filter(log => log.module === 'Security' || log.action.includes('security') || log.action.includes('permission')).map((log) => {
              const ActionIcon = getActionIcon(log.action);
              return (
                <Card key={log.id} className="healthcare-card border-l-4 border-l-warning">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-warning/10 rounded-full">
                        <Shield className="w-6 h-6 text-warning" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{log.description}</h3>
                          <span className="text-sm text-muted-foreground">{formatTime(log.timestamp)}</span>
                        </div>
                        <div className="text-sm text-warning">
                          <strong>Security Event:</strong> {log.user} from {log.ipAddress}
                        </div>
                        {log.details && (
                          <div className="text-sm bg-warning/10 p-3 rounded-lg">
                            <strong>Security Details:</strong>
                            <div className="mt-1 space-y-1">
                              {Object.entries(log.details).map(([key, value]) => (
                                <div key={key}>
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="space-y-4">
            {activityLogs.filter(log => log.role === 'System' || log.module === 'System Settings' || log.module === 'Database').map((log) => {
              const ActionIcon = getActionIcon(log.action);
              return (
                <Card key={log.id} className="healthcare-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <ActionIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{log.description}</h3>
                          <span className="text-sm text-muted-foreground">{formatTime(log.timestamp)}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong>System Process:</strong> {log.module}
                        </div>
                        {log.details && (
                          <div className="text-sm bg-primary/10 p-3 rounded-lg">
                            <strong>System Details:</strong>
                            <div className="mt-1 space-y-1">
                              {Object.entries(log.details).map(([key, value]) => (
                                <div key={key}>
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="user-actions" className="space-y-4">
          <div className="space-y-4">
            {activityLogs.filter(log => log.role !== 'System' && log.module !== 'Database').map((log) => {
              const ActionIcon = getActionIcon(log.action);
              return (
                <Card key={log.id} className="healthcare-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-secondary/10 rounded-full">
                        <User className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{log.description}</h3>
                          <span className="text-sm text-muted-foreground">{formatTime(log.timestamp)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div><strong>User:</strong> {log.user} ({log.role})</div>
                          <div><strong>Module:</strong> {log.module}</div>
                          <div><strong>IP Address:</strong> {log.ipAddress}</div>
                          <div><strong>Browser:</strong> {log.userAgent}</div>
                        </div>
                        {log.details && (
                          <div className="text-sm bg-secondary/10 p-3 rounded-lg">
                            <strong>Action Details:</strong>
                            <div className="mt-1 space-y-1">
                              {Object.entries(log.details).map(([key, value]) => (
                                <div key={key}>
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminActivityLogs;