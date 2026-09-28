import { useState } from 'react';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FormField } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { useDepartments } from '@/hooks/use-fleet-data';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const { data: departments } = useDepartments();
  const [orgName, setOrgName] = useState('Fleet Operations');
  const [timezone, setTimezone] = useState('Africa/Kampala');
  const [currency, setCurrency] = useState('UGX');
  const [serviceInterval, setServiceInterval] = useState('90');
  const [fuelAlertThreshold, setFuelAlertThreshold] = useState('15');
  const [insuranceReminderDays, setInsuranceReminderDays] = useState('30');
  const [defaultDepartment, setDefaultDepartment] = useState('');

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Fleet policies and operating defaults have been updated.',
    });
  };

  return (
    <div className="mx-auto max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10">
      <PageHeader
        title="Settings"
        description="Fleet policies, operating defaults and workspace settings."
        actions={
          <Button onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4 text-muted-foreground" />
              Organization
            </CardTitle>
            <CardDescription>Basic workspace configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Organization name" required>
              <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </FormField>
            <FormField label="Timezone" required>
              <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option value="Africa/Kampala">East Africa Time (Kampala)</option>
                <option value="Africa/Nairobi">East Africa Time (Nairobi)</option>
                <option value="Africa/Lagos">West Africa Time (Lagos)</option>
              </Select>
            </FormField>
            <FormField label="Currency" required>
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="UGX">UGX — Ugandan Shilling</option>
                <option value="KES">KES — Kenyan Shilling</option>
                <option value="TZS">TZS — Tanzanian Shilling</option>
                <option value="USD">USD — US Dollar</option>
              </Select>
            </FormField>
            <FormField label="Default department">
              <Select value={defaultDepartment} onChange={(e) => setDefaultDepartment(e.target.value)}>
                <option value="">Select default</option>
                {(departments ?? []).map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </Select>
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet policies</CardTitle>
            <CardDescription>Operating thresholds and reminders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Service interval (days)" hint="Days between scheduled services">
              <Input
                type="number"
                value={serviceInterval}
                onChange={(e) => setServiceInterval(e.target.value)}
              />
            </FormField>
            <FormField label="Fuel alert threshold (%)" hint="Alert when fuel level drops below this percentage">
              <Input
                type="number"
                value={fuelAlertThreshold}
                onChange={(e) => setFuelAlertThreshold(e.target.value)}
              />
            </FormField>
            <FormField label="Insurance reminder (days)" hint="Days before expiry to send renewal reminder">
              <Input
                type="number"
                value={insuranceReminderDays}
                onChange={(e) => setInsuranceReminderDays(e.target.value)}
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
            <CardDescription>Active departments in the fleet workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(departments ?? []).map((dept) => (
                <div key={dept.id} className="flex items-center justify-between border border-border px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{dept.name}</p>
                    <p className="text-xs text-muted-foreground">Head: {dept.head}</p>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{dept.vehicleCount} vehicles</span>
                    <span>{dept.driverCount} drivers</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification preferences</CardTitle>
            <CardDescription>Configure how notifications are delivered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Email notifications</p>
                <p className="text-xs text-muted-foreground">Send alerts via email</p>
              </div>
              <Select defaultValue="important" className="w-[140px]">
                <option value="all">All</option>
                <option value="important">Important only</option>
                <option value="none">None</option>
              </Select>
            </div>
            <div className="flex items-center justify-between border border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">SMS alerts</p>
                <p className="text-xs text-muted-foreground">Send critical alerts via SMS</p>
              </div>
              <Select defaultValue="critical" className="w-[140px]">
                <option value="all">All</option>
                <option value="critical">Critical only</option>
                <option value="none">None</option>
              </Select>
            </div>
            <div className="flex items-center justify-between border border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">In-app notifications</p>
                <p className="text-xs text-muted-foreground">Show notifications in the app</p>
              </div>
              <Select defaultValue="all" className="w-[140px]">
                <option value="all">All</option>
                <option value="important">Important only</option>
                <option value="none">None</option>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
