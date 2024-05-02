'use client'
import { logOut } from '@/actions/logout';
import { useCurrentUser } from '@/hooks/use-current-user';

const SettingsPage = () => {
const user = useCurrentUser()

const handleSubmit = ()=>{
  logOut()
}

  return (
    <div className='bg-white p-10 rounded-xl'>
      {/* {JSON.stringify(user)} */}
        <button onClick={handleSubmit} type='submit'>
            signOut
        </button>
    </div>
  );
}
export default SettingsPage;