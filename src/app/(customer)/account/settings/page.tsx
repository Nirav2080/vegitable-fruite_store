
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function AccountSettingsPage() {
    return (
         <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold font-headline">Account Settings</h2>
                <p className="text-muted-foreground">Manage your password and account preferences.</p>
            </div>
            <Separator />
            <form className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                </div>
                <div className="pt-2">
                    <Button type="submit">Update Password</Button>
                </div>
            </form>
        </div>
    );
}
