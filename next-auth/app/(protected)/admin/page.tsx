'use client'
import { admin } from "@/actions/admin"
import { RoleGate } from "@/components/auth/role-gate"
import { FormSuccess } from "@/components/form-success"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"
const AdminPage = ()=>{
    const onServerClick = () =>{
        admin()
        .then((data)=>{
            if(data.success){
                toast.success(data.success)
            }
            else{
                toast.error(data.error)
            }
        })
    }
    const onApiRouteClick = () => {
        fetch("/api/admin")
            .then((response)=>{
                if(response.ok){
                    toast.success("Allowed API route!")
                }
                else{
                    toast.error("Forbidden API route!")
                }
            })
    }
    return(
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    🔑 Admin
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message="You are allowed to see this content!"/>
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admin-only API route
                    </p>
                    <Button onClick={onApiRouteClick}>
                        Click to test
                    </Button>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admin-only Server Action
                    </p>
                    <Button onClick = {onServerClick}>
                        Click to test
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default AdminPage