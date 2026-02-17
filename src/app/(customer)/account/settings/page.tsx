
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function AccountSettingsPage() {
    return (
         <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-extrabold tracking-tight font-headline">Account Settings</h2>
                <p className="text-muted-foreground leading-relaxed">Manage your password and account preferences.</p>
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
                    <Button type="submit" className="rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30">Update Password</Button>
                </div>
            </form>
        </div>
    );
}
