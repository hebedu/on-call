import React, { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle2, ArrowRight, User, Calendar, ShieldAlert, X } from 'lucide-react';
import { Button, Input, Badge, Card, Modal } from './ui';
import { cn } from '../lib/utils';

// Mock Data
const MOCK_ALERTS = [
  { id: 'ALT-20260302-001', title: '核心数据库 CPU 使用率超 90%', level: 'P0', status: 'unclaimed', escalationStatus: '环节 2', time: '10分钟前', duty: '张三 (DBA组)', schedule: '核心数据库告警值班' },
  { id: 'ALT-20260302-002', title: '前端登录接口响应超时', level: 'P1', status: 'claimed', escalationStatus: '环节 1', time: '1小时前', duty: '王五 (前端组)', schedule: '前端业务线值班' },
  { id: 'ALT-20260302-003', title: '支付网关连接失败', level: 'P0', status: 'closed', escalationStatus: '已完成', time: '3小时前', duty: '李四 (DBA组)', schedule: '核心数据库告警值班' },
];

export const AlertList = () => {
  const [selectedAlert, setSelectedAlert] = useState<typeof MOCK_ALERTS[0] | null>(null);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'P0': return 'bg-red-100 text-red-800 border-red-200';
      case 'P1': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unclaimed': return <Badge variant="danger">未认领</Badge>;
      case 'claimed': return <Badge variant="warning">处理中</Badge>;
      case 'closed': return <Badge variant="success">已关闭</Badge>;
      default: return <Badge>未知</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 flex-1">
          <Input placeholder="搜索告警标题/ID..." className="max-w-xs" />
          <select className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">所有级别</option>
            <option value="P0">P0 级</option>
            <option value="P1">P1 级</option>
          </select>
          <select className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">所有状态</option>
            <option value="unclaimed">未认领</option>
            <option value="claimed">处理中</option>
            <option value="closed">已关闭</option>
          </select>
          <select className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">升级状态</option>
            <option value="l1">环节 1</option>
            <option value="l2">环节 2</option>
            <option value="done">已完成</option>
          </select>
        </div>
        <Button variant="outline" className="gap-2">
          <Clock className="h-4 w-4" />
          最近 24 小时
        </Button>
      </div>

      {/* Alert Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-medium">告警 ID / 标题</th>
              <th className="px-6 py-4 font-medium">级别</th>
              <th className="px-6 py-4 font-medium">状态</th>
              <th className="px-6 py-4 font-medium">升级状态</th>
              <th className="px-6 py-4 font-medium">触发时间</th>
              <th className="px-6 py-4 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {MOCK_ALERTS.map((alert) => (
              <tr key={alert.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedAlert(alert)}>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{alert.title}</span>
                    <span className="text-xs text-gray-500 font-mono">{alert.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold", getLevelColor(alert.level))}>
                    {alert.level}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(alert.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-orange-600 font-medium text-xs bg-orange-50 px-2.5 py-1 rounded-full w-fit">
                    <ArrowRight className="h-3.5 w-3.5" />
                    {alert.escalationStatus}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {alert.time}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-blue-600">查看详情</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">告警详情</h2>
              <button onClick={() => setSelectedAlert(null)} className="rounded-full p-1.5 hover:bg-gray-200 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold", getLevelColor(selectedAlert.level))}>
                    {selectedAlert.level}
                  </span>
                  <span className="text-sm font-mono text-gray-500">{selectedAlert.id}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">{selectedAlert.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> 10分钟前触发</span>
                  {getStatusBadge(selectedAlert.status)}
                </div>
              </div>

              {/* Duty Personnel Module */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <User className="h-4 w-4 text-blue-500" />
                  当前值班人员
                </h3>
                <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">值班人员/组</span>
                    <span className="font-medium text-gray-900">{selectedAlert.duty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">关联日程</span>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {selectedAlert.schedule}
                    </a>
                  </div>
                </div>
              </div>

              {/* Escalation Path Module */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <ShieldAlert className="h-4 w-4 text-orange-500" />
                  升级状态与路径
                </h3>
                
                <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-gray-200">
                  {/* Level 1 */}
                  <div className="relative">
                    <div className="absolute -left-6 mt-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-4 ring-white" />
                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">环节 1 (初始通知)</span>
                        <Badge variant="success" className="text-[10px]">已通知</Badge>
                      </div>
                      <div className="space-y-1.5 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>通知对象：</span>
                          <span className="font-medium text-gray-900">DBA组</span>
                        </div>
                        <div className="flex justify-between">
                          <span>通知时间：</span>
                          <span>2026-03-02 01:10:00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Level 2 */}
                  <div className="relative">
                    <div className="absolute -left-6 mt-1 h-2.5 w-2.5 rounded-full bg-orange-500 ring-4 ring-white animate-pulse" />
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-orange-900">环节 2 (当前环节)</span>
                        <Badge variant="warning" className="text-[10px]">待响应</Badge>
                      </div>
                      <div className="space-y-1.5 text-xs text-orange-800/80">
                        <div className="flex justify-between">
                          <span>通知对象：</span>
                          <span className="font-medium text-orange-900">张三 (负责人)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>触发条件：</span>
                          <span>15分钟未认领</span>
                        </div>
                        <div className="flex justify-between">
                          <span>预计通知：</span>
                          <span>2026-03-02 01:25:00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Level 3 */}
                  <div className="relative opacity-50">
                    <div className="absolute -left-6 mt-1 h-2.5 w-2.5 rounded-full bg-gray-300 ring-4 ring-white" />
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">环节 3</span>
                        <Badge variant="outline" className="text-[10px]">待触发</Badge>
                      </div>
                      <div className="space-y-1.5 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>通知对象：</span>
                          <span>运维总监</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 bg-gray-50 p-4 flex gap-3">
              <Button className="flex-1">认领告警</Button>
              <Button variant="outline" className="flex-1">关闭告警</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
