
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";


export default function AccountProfilePage() {
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
                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                     <Button type="button" variant="outline">Change Photo</Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Doe" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                <div className="pt-2">
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </div>
    );
}
