/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DutyManagement } from './components/DutyManagement';
import { DispatchStrategies } from './components/DispatchStrategies';
import { AlertList } from './components/AlertList';

export default function App() {
  const [activeTab, setActiveTab] = useState('alerts');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'alerts' && <AlertList />}
      {activeTab === 'duty' && <DutyManagement />}
      {activeTab === 'strategies' && <DispatchStrategies />}
      {activeTab === 'settings' && (
        <div className="flex h-full items-center justify-center text-gray-500">
          系统设置功能开发中...
        </div>
      )}
    </Layout>
  );
}

