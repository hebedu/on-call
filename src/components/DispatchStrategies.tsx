import React, { useState } from 'react';
import { ShieldAlert, Plus, Settings, Users, ArrowRight, Clock, AlertTriangle, Trash2, GripVertical, Mail, MessageSquare, Phone } from 'lucide-react';
import { Button, Input, Badge, Modal, Card } from './ui';

// Mock Data
const MOCK_STRATEGIES = [
  { id: '1', name: 'P0级核心告警分派', targets: ['DBA组', '张三 (负责人)'], escalationLevels: 2, status: 'active' },
  { id: '2', name: '常规业务告警', targets: ['前端组', '后端组'], escalationLevels: 0, status: 'active' },
];

export const DispatchStrategies = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [escalationPath, setEscalationPath] = useState([
    { id: 'l1', type: 'initial', targets: ['DBA组'], methods: ['mail', 'sms'], repeat: 1, interval: 0 },
    { id: 'l2', type: 'escalation', conditionTime: 15, conditionStatus: '未认领且未关闭', targets: ['张三 (负责人)'], methods: ['phone'], repeat: 3, interval: 5 }
  ]);

  const addEscalationLevel = () => {
    setEscalationPath([
      ...escalationPath,
      { id: `l${Date.now()}`, type: 'escalation', conditionTime: 30, conditionStatus: '未认领且未关闭', targets: [], methods: ['mail'], repeat: 1, interval: 0 }
    ]);
  };

  const removeEscalationLevel = (id: string) => {
    setEscalationPath(escalationPath.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Input placeholder="搜索策略名称..." className="pl-9" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          新建策略
        </Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 font-medium">策略名称</th>
              <th className="px-6 py-3 font-medium">分派对象</th>
              <th className="px-6 py-3 font-medium">升级路径</th>
              <th className="px-6 py-3 font-medium">状态</th>
              <th className="px-6 py-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {MOCK_STRATEGIES.map((strategy) => (
              <tr key={strategy.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-blue-500" />
                    {strategy.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {strategy.targets.map(t => (
                      <Badge key={t} variant="outline" className="bg-white">
                        {t.includes('负责人') ? <span className="text-blue-600 font-medium mr-1">★</span> : null}
                        {t.replace(' (负责人)', '')}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {strategy.escalationLevels > 0 ? (
                    <div className="flex items-center gap-1.5 text-orange-600 font-medium">
                      <ArrowRight className="h-4 w-4" />
                      包含 {strategy.escalationLevels} 级升级
                    </div>
                  ) : (
                    <span className="text-gray-400">无升级</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Badge variant="success">已启用</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                  >
                    配置升级
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 font-medium">
                    <Settings className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Edit Strategy Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="配置分派策略与升级路径"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>取消</Button>
            <Button onClick={() => setIsEditModalOpen(false)}>保存配置</Button>
          </>
        }
      >
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Settings className="h-4 w-4 text-gray-500" />
              基础配置
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">策略名称</label>
              <Input defaultValue="P0级核心告警分派" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">分派对象 (初始通知)</label>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                <Badge variant="outline" className="bg-white gap-1 pr-1">
                  DBA组
                  <button className="ml-1 rounded-full hover:bg-gray-100 p-0.5">×</button>
                </Badge>
                <Button variant="outline" size="sm" className="h-6 text-xs border-dashed bg-white">
                  <Plus className="h-3 w-3 mr-1" /> 添加人员/组
                </Button>
              </div>
            </div>
          </div>

          {/* Escalation Path */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-orange-500" />
                升级路径配置
              </h3>
              <Button variant="outline" size="sm" onClick={addEscalationLevel} className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" /> 添加环节
              </Button>
            </div>

            <div className="space-y-4">
              {escalationPath.map((level, index) => (
                <div key={level.id} className="relative rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                  {/* Level Header */}
                  <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <span className="font-medium text-sm text-gray-700">
                        {level.type === 'initial' ? '环节 1 (初始通知)' : `环节 ${index + 1}`}
                      </span>
                    </div>
                    {level.type !== 'initial' && (
                      <button onClick={() => removeEscalationLevel(level.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Level Content */}
                  <div className="p-4 space-y-4">
                    {/* Condition (Only for escalation levels) */}
                    {level.type === 'escalation' && (
                      <div className="grid grid-cols-2 gap-4 p-3 bg-orange-50/50 rounded-md border border-orange-100">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-orange-500" />
                            时间条件
                          </label>
                          <div className="flex items-center gap-2">
                            <Input type="number" defaultValue={level.conditionTime} className="h-8 w-20 text-sm" />
                            <span className="text-sm text-gray-600">分钟后升级</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                            告警状态
                          </label>
                          <select className="h-8 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>未认领且未关闭</option>
                            <option>已认领但未关闭</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Targets & Methods */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">通知对象</label>
                        <div className="flex flex-wrap gap-1.5">
                          {level.targets.map(t => (
                            <Badge key={t} variant="outline" className="bg-gray-50 text-xs">
                              {t}
                            </Badge>
                          ))}
                          <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 py-0 border-dashed">
                            + 添加
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">通知方式</label>
                        <div className="flex gap-2">
                          <button className={`p-1.5 rounded border ${level.methods.includes('mail') ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-400'}`}>
                            <Mail className="h-4 w-4" />
                          </button>
                          <button className={`p-1.5 rounded border ${level.methods.includes('sms') ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-400'}`}>
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button className={`p-1.5 rounded border ${level.methods.includes('phone') ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-400'}`}>
                            <Phone className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Repeat Config */}
                    <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">重复通知</span>
                        <Input type="number" defaultValue={level.repeat} className="h-7 w-16 text-xs px-2" />
                        <span className="text-xs text-gray-500">次</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">间隔</span>
                        <Input type="number" defaultValue={level.interval} className="h-7 w-16 text-xs px-2" />
                        <span className="text-xs text-gray-500">分钟</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Search Icon component to avoid missing import
const Search = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
