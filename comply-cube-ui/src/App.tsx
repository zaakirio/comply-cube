// src/App.tsx
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

// import React from 'react'

// function App() {
//   return (
//     <div className="min-h-screen bg-background p-8">
//       <div className="rounded-lg border bg-card p-8">
//         <h1 className="text-3xl font-bold text-primary">
//           Test Component
//         </h1>
//         <div className="mt-4 space-y-4">
//           <div className="bg-red-500 p-4 text-white rounded-md">
//             Red Background Test
//           </div>
//           <div className="bg-primary text-primary-foreground p-4 rounded-md">
//             Primary Color Test
//           </div>
//           <div className="bg-secondary text-secondary-foreground p-4 rounded-md">
//             Secondary Color Test
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default App