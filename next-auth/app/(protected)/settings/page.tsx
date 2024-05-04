'use client'
import * as z from 'zod'
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SettingSchema } from '@/schemas'
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { 
  Card,
  CardHeader,
  CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { settings } from '@/actions/settings';
import { useTransition, useState } from 'react';
import { useSession } from 'next-auth/react';

const SettingsPage = () => {
  const [error,setError] = useState<string | undefined>();
  const [success,setSuccess] = useState<string | undefined>();
  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues:{
      name: ""
    }
  })
  const {update} = useSession();
  const [isPending, startTransition] = useTransition();
  const onClickButton = (values: z.infer<typeof SettingSchema>) =>{
    startTransition(()=>{
      settings(values)
        .then((data) =>{
          if(data.error){
            setError(data.error)
          }
          else{
            setSuccess(data.success)
          }
          update();
        })
    })
  }
  return (
      <Card className='w-[600px]'>
        <CardHeader>
          <p className='text-2xl font-semibold text-center'>
            ⚙️ Settings
          </p>
        </CardHeader>
        <CardContent>
          <Button disabled={isPending} onClick={onClickButton}>
            Update name
          </Button>
        </CardContent>
      </Card>
  );
}
export default SettingsPage;