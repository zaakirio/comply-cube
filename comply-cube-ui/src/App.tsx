import React from 'react';
import { PageContainer } from './components/layout/PageContainer';
import { CustomerForm } from './components/forms/CustomerForm';

const App: React.FC = () => {
  return (
    <PageContainer>
      <CustomerForm />
    </PageContainer>
  );
};

export default App;