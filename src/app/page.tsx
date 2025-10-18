import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            智能体数据中台
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            为您的跨境独立站智能体提供统一的数据服务，连接WordPress和Strikingly平台
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-blue-600 text-3xl mb-4">🔄</div>
            <h3 className="text-xl font-semibold mb-3">数据同步</h3>
            <p className="text-gray-600">
              自动同步来自WordPress和Strikingly的订单、客户和产品数据
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-green-600 text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-3">智能体支持</h3>
            <p className="text-gray-600">
              为Dify智能体提供统一的API接口，支持复杂查询和数据分析
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-purple-600 text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3">实时监控</h3>
            <p className="text-gray-600">
              实时监控系统状态，提供健康检查和统计信息
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/api-docs"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            查看API文档
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
