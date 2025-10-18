// src/app/api-docs/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  example?: string;
}

const apiEndpoints: ApiEndpoint[] = [
  {
    method: 'GET',
    path: '/api/health',
    description: '健康检查接口，返回系统状态和统计信息',
  },
  {
    method: 'GET',
    path: '/api/sync/wordpress',
    description: '从WordPress同步订单数据',
  },
  {
    method: 'POST',
    path: '/api/webhook/strikingly',
    description: '接收Strikingly的订单webhook',
  },
  {
    method: 'GET',
    path: '/api/dify/orders',
    description: '为Dify提供订单查询接口',
    parameters: [
      { name: 'site', type: 'string', required: false, description: '站点名称 (zenbreeze/sogoodtea)' },
      { name: 'email', type: 'string', required: false, description: '客户邮箱' },
      { name: 'start_date', type: 'string', required: false, description: '开始日期 (YYYY-MM-DD)' },
      { name: 'end_date', type: 'string', required: false, description: '结束日期 (YYYY-MM-DD)' },
      { name: 'status', type: 'string', required: false, description: '订单状态' },
      { name: 'limit', type: 'number', required: false, description: '返回数量限制 (默认50)' },
    ],
    example: '/api/dify/orders?site=zenbreeze&start_date=2025-01-01&limit=20',
  },
  {
    method: 'GET',
    path: '/api/dify/customers',
    description: '为Dify提供客户查询接口',
    parameters: [
      { name: 'site', type: 'string', required: false, description: '站点名称' },
      { name: 'email', type: 'string', required: false, description: '客户邮箱' },
      { name: 'tags', type: 'string', required: false, description: '客户标签' },
      { name: 'min_lifetime_value', type: 'number', required: false, description: '最小生命周期价值' },
      { name: 'limit', type: 'number', required: false, description: '返回数量限制' },
    ],
  },
  {
    method: 'GET',
    path: '/api/dify/products',
    description: '为Dify提供产品查询接口',
    parameters: [
      { name: 'site', type: 'string', required: false, description: '站点名称' },
      { name: 'category', type: 'string', required: false, description: '产品分类' },
      { name: 'name', type: 'string', required: false, description: '产品名称' },
      { name: 'min_price', type: 'number', required: false, description: '最低价格' },
      { name: 'max_price', type: 'number', required: false, description: '最高价格' },
      { name: 'in_stock', type: 'boolean', required: false, description: '是否有库存' },
      { name: 'limit', type: 'number', required: false, description: '返回数量限制' },
    ],
  },
];

export default function ApiDocs() {
  const [healthData, setHealthData] = useState<{
    status?: string;
    stats?: {
      sites?: number;
      orders?: number;
      customers?: number;
      products?: number;
    };
  } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealthData(data))
      .catch(err => console.error('Failed to fetch health data:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">数据中台 API 文档</h1>
        
        {/* 系统状态 */}
        {healthData && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">系统状态</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{healthData.stats?.sites || 0}</div>
                <div className="text-sm text-gray-600">站点</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{healthData.stats?.orders || 0}</div>
                <div className="text-sm text-gray-600">订单</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{healthData.stats?.customers || 0}</div>
                <div className="text-sm text-gray-600">客户</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{healthData.stats?.products || 0}</div>
                <div className="text-sm text-gray-600">产品</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              状态: <span className={`font-semibold ${healthData.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                {healthData.status === 'healthy' ? '健康' : '异常'}
              </span>
            </div>
          </div>
        )}

        {/* API 接口列表 */}
        <div className="space-y-6">
          {apiEndpoints.map((endpoint, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                  endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-lg font-mono bg-gray-100 px-2 py-1 rounded">
                  {endpoint.path}
                </code>
              </div>
              
              <p className="text-gray-700 mb-4">{endpoint.description}</p>
              
              {endpoint.parameters && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">参数:</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">参数名</th>
                          <th className="text-left py-2">类型</th>
                          <th className="text-left py-2">必需</th>
                          <th className="text-left py-2">描述</th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoint.parameters.map((param, paramIndex) => (
                          <tr key={paramIndex} className="border-b">
                            <td className="py-2 font-mono">{param.name}</td>
                            <td className="py-2">{param.type}</td>
                            <td className="py-2">{param.required ? '是' : '否'}</td>
                            <td className="py-2">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {endpoint.example && (
                <div>
                  <h4 className="font-semibold mb-2">示例:</h4>
                  <code className="block bg-gray-100 p-3 rounded text-sm">
                    {endpoint.example}
                  </code>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
