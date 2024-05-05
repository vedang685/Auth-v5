'use client'
import * as z from 'zod';
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SettingSchema } from '@/schemas';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Card,
  CardHeader,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { settings } from '@/actions/settings';
import { useTransition, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { 
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { UserRole } from '@prisma/client';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  const user = useCurrentUser();
  console.log(user)
  const [error,setError] = useState<string | undefined>();
  const [success,setSuccess] = useState<string | undefined>();
  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues:{
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role,
      isTwoFactorEnabled: user?.isTwoFactorEnabled,
    }
  })
  const {update} = useSession();
  const [isPending, startTransition] = useTransition();
  const onSubmit = (values: z.infer<typeof SettingSchema>) =>{
    startTransition(()=>{
      settings(values)
        .then((data) =>{
          if(data.error){
            setError(data.error)
          }
          if(data.success){
            update();
            setSuccess(data.success)
          }
          update();
        })
        .catch(()=>{setError("Something went wrong!")})
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
          <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} disabled={isPending}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
                )}
              />
              {user?.isOAuth === false && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} disabled={isPending}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" {...field} disabled={isPending} type='password'/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" {...field} disabled={isPending} type='password'/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                  )}
                />
                <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable two factor authentication for your account
                    </FormDescription>
                  </div>
                  <Switch
                    disabled={isPending}
                    checked ={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormItem>
                )}
              />
              </>
              )}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>
                        Admin
                      </SelectItem>
                      <SelectItem value={UserRole.USER}>
                        User
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage/>
                </FormItem>
                )}
              />
            </div>
            <FormError message={error}/>
            <FormSuccess message={success}/>
            <Button disabled={isPending} type='submit'>Save</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
  );
}
export default SettingsPage;