import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, Plus, Search, ChevronLeft, ChevronRight, Clock, Users, AlertCircle } from 'lucide-react';
import { Button, Input, Badge, Modal, Card } from './ui';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { cn } from '../lib/utils';

// Mock Data
const MOCK_SCHEDULES = [
  { id: '1', name: '核心数据库告警值班', start: '2026-03-01 00:00', end: '2026-03-31 23:59', users: ['张三', '李四'], cycle: '每 1 天轮换' },
  { id: '2', name: '前端业务线值班', start: '2026-03-15 08:00', end: '2026-04-15 08:00', users: ['王五', '赵六'], cycle: '无轮换' },
];

const MOCK_USERS = [
  { id: 'u1', name: '张三', group: 'DBA组', hasStrategy: true },
  { id: 'u2', name: '李四', group: 'DBA组', hasStrategy: true },
  { id: 'u3', name: '王五', group: '前端组', hasStrategy: false },
  { id: 'u4', name: '赵六', group: '前端组', hasStrategy: true },
];

export const DutyManagement = () => {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [dutyScope, setDutyScope] = useState<'all' | 'mine'>('all');
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const CURRENT_USER = '张三';

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-lg bg-white p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setView('calendar')}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
              view === 'calendar' ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            日历视图
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
              view === 'list' ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <List className="h-4 w-4" />
            日程列表
          </button>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          新建日程
        </Button>
      </div>

      {/* Content Area */}
      {view === 'calendar' ? (
        <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'yyyy年 MM月')}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              今天
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {dutyScope === 'all' && (
            <select
              value={selectedUserFilter}
              onChange={(e) => setSelectedUserFilter(e.target.value)}
              className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有人员</option>
              {MOCK_USERS.map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          )}
          <div className="flex items-center rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setDutyScope('all')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                dutyScope === 'all' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              全部值班
            </button>
            <button
              onClick={() => setDutyScope('mine')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                dutyScope === 'mine' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              我的值班
            </button>
          </div>
        </div>
      </div>
          
          <div className="grid grid-cols-7 gap-px rounded-lg bg-gray-200 overflow-hidden border border-gray-200">
            {['一', '二', '三', '四', '五', '六', '日'].map(day => (
              <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
                周{day}
              </div>
            ))}
            {daysInMonth.map((day, idx) => {
              const isCurrMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);
              // Mock some duty assignments
              const hasDuty = idx % 3 === 0;
              const dutyUser = hasDuty ? (idx % 2 === 0 ? '张三' : '王五') : null;
              const showDuty = hasDuty && (
                dutyScope === 'mine' 
                  ? dutyUser === CURRENT_USER 
                  : (selectedUserFilter === 'all' || dutyUser === selectedUserFilter)
              );

              return (
                <div 
                  key={day.toISOString()} 
                  className={cn(
                    "min-h-[120px] bg-white p-2 transition-colors hover:bg-gray-50",
                    !isCurrMonth && "bg-gray-50/50 text-gray-400"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                      isTodayDate ? "bg-blue-600 text-white" : "text-gray-700"
                    )}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  {showDuty && (
                    <div className="mt-2 space-y-1">
                      <div className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors">
                        <div className="truncate">{dutyUser} (当值)</div>
                        <div className="truncate text-[10px] text-blue-500">核心数据库...</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="搜索日程名称..." className="pl-9" />
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">日程名称</th>
                <th className="px-6 py-3 font-medium">时间范围</th>
                <th className="px-6 py-3 font-medium">值班人员</th>
                <th className="px-6 py-3 font-medium">轮班周期</th>
                <th className="px-6 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {MOCK_SCHEDULES.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{schedule.name}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {schedule.start} ~ {schedule.end}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-gray-700">{schedule.users.join(', ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={schedule.cycle === '无轮换' ? 'default' : 'outline'}>
                      {schedule.cycle}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">编辑</button>
                    <button className="text-red-600 hover:text-red-800 font-medium">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Create Schedule Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="新建值班日程"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>取消</Button>
            <Button onClick={() => setIsCreateModalOpen(false)}>保存日程</Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">日程名称 <span className="text-red-500">*</span></label>
            <Input placeholder="例如：核心业务线周末值班" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">开始时间 <span className="text-red-500">*</span></label>
              <Input type="datetime-local" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">结束时间 <span className="text-red-500">*</span></label>
              <Input type="datetime-local" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">告警组 / 人员 <span className="text-red-500">*</span></label>
            <div className="rounded-md border border-gray-300 p-3 space-y-3">
              <div className="flex flex-wrap gap-2">
                {MOCK_USERS.slice(0, 2).map(u => (
                  <Badge key={u.id} variant="outline" className="bg-white gap-1 pr-1">
                    {u.name}
                    <button className="ml-1 rounded-full hover:bg-gray-100 p-0.5"><AlertCircle className="h-3 w-3 text-gray-400" /></button>
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="h-6 text-xs border-dashed">
                  <Plus className="h-3 w-3 mr-1" /> 添加人员
                </Button>
              </div>
              
              {/* Warning for users without strategy */}
              <div className="rounded-md bg-yellow-50 p-3 border border-yellow-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">⚠️ 以下人员/组未配置分派策略，告警触发时将无法通知到值班人员：</p>
                  <p className="mb-2">王五 (前端组)</p>
                  <a href="#" className="font-medium text-blue-600 hover:underline">前往分派策略配置 →</a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">开启轮班周期</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out translate-x-5 border-blue-500" checked readOnly/>
                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-blue-500 cursor-pointer"></label>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">每</span>
              <Input type="number" defaultValue={1} className="w-20 h-8" />
              <select className="h-8 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>天</option>
                <option>周</option>
                <option>月</option>
              </select>
              <span className="text-sm text-gray-600">轮换一次</span>
            </div>
            <p className="text-xs text-gray-500">按人员列表顺序依次排班，每个时间段仅一人当值。</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
