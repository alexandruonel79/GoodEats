import React from 'react';
import { useAuth } from '../context/AuthContext';

const DemoPage = () => {
  const { role } = useAuth();

  if (!role) {
    return <h2>You need to login to view this page.</h2>;
  }

  return (
    <div className="demo-container">
      <h2>Welcome to the Demo Page!</h2>
      {role === 'user' && <p>You have basic user permissions.</p>}
      {role === 'restaurant_owner' && <p>You have restaurant owner permissions.</p>}
      {role === 'admin' && <p>You have admin permissions.</p>}
    </div>
  );
};

export default DemoPage;
