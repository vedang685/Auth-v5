'use client'

import { useCurrentRole } from "@/hooks/use-current-role"
import { UserRole } from "@prisma/client"
import { FormError } from "../form-error"

interface RoleGateProp {
    children: React.ReactNode
    allowedRole: UserRole
}

export const RoleGate = ({children, allowedRole}: RoleGateProp) => {
    const role = useCurrentRole();
    if(role != allowedRole){
        return(
            <FormError message="You do not have permission to view this content!"/>
        )
    }
}