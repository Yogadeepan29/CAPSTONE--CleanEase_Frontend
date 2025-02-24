import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardProfile from '../../Components/DashboardProfile';
import DashboardSidebar from '../../Components/DashboardSidebar';
import DashboardAddress from '../../Components/DashboardAddress';

const UserDashboard = () => {
    const location = useLocation();
    const [tab,setTab]=useState('')
    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search);
      const tabUrl = urlParams.get('tab');
      if(tabUrl){
        setTab(tabUrl)
      }
    },[location.search])
    return (
        <div className='min-h-screen'>
            <div className="md:flex md:flex-row justify-center">
           <div className='md:w-50 md:min-h-screen'>
            <DashboardSidebar/>
           </div>
           {tab === 'profile' && <DashboardProfile/> }
           {tab === 'address' && <DashboardAddress/> }
           </div>
        </div>
    );
};

export default UserDashboard;