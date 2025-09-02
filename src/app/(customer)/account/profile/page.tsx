
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentUser } from "@/lib/actions/users";


export default async function AccountProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        return <div>Please log in to view your profile.</div>
    }

    const userInitials = user.name.split(' ').map(n => n[0]).join('');
    const [firstName, lastName] = user.name.split(' ');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold font-headline">My Profile</h2>
                <p className="text-muted-foreground">Update your personal information and email address.</p>
            </div>
            <Separator />
            <form className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatar} alt="User avatar" />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                     <Button type="button" variant="outline">Change Photo</Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue={firstName} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue={lastName} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" type="tel" defaultValue="+64 21 123 4567" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Default Address</Label>
                    <Textarea id="address" defaultValue="123 Organic Lane, Auckland 1010, New Zealand" rows={3} />
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="set-default" />
                    <Label htmlFor="set-default" className="text-sm font-normal">
                        Set as default shipping address
                    </Label>
                </div>

                <div className="pt-2">
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </div>
    );
}
