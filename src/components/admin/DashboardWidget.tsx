"use client"
import React from 'react'

export const DashboardWidget: React.FC = () => {
  return (
    <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
      {/* Content Canvas */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-8" style={{ padding: '2rem', paddingBottom: '5rem' }}>
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Inter' }}>Good Morning, Admin</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Here's what's happening with your content today.</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-10">
          <a href="/admin/collections/articles/create" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">post_add</span>
            New Article
          </a>
          <a href="/admin/collections/users/create" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            New User
          </a>
          <a href="/admin/collections/media/create" className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 rounded-lg shadow-sm hover:-translate-y-1 hover:bg-slate-50 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            Upload Media
          </a>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Stat Card 1 */}
          <div className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all flex flex-col justify-between backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Total Articles</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">2.4k</h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +12%
              </span>
            </div>
            <div className="h-10 w-full mt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                <path className="text-blue-600 dark:text-blue-400" style={{strokeDasharray: 1000, strokeDashoffset: 0}} d="M0,25 Q10,15 20,20 T40,10 T60,15 T80,5 T100,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all flex flex-col justify-between backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">850</h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +5%
              </span>
            </div>
            <div className="h-10 w-full mt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                <path className="text-blue-600 dark:text-blue-400" style={{strokeDasharray: 1000, strokeDashoffset: 0}} d="M0,15 Q20,25 40,15 T60,20 T80,10 T100,5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all flex flex-col justify-between backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Subscribers</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">1.2k</h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +8%
              </span>
            </div>
            <div className="h-10 w-full mt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                <path className="text-blue-600 dark:text-blue-400" style={{strokeDasharray: 1000, strokeDashoffset: 0}} d="M0,20 Q20,10 40,15 T60,5 T80,10 T100,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all flex flex-col justify-between backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Media Files</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">4.2k</h3>
              </div>
              <span className="material-symbols-outlined text-gray-400">perm_media</span>
            </div>
            <div className="h-10 w-full mt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                <path className="text-gray-400" style={{strokeDasharray: 1000, strokeDashoffset: 0}} d="M0,5 Q20,15 40,5 T60,20 T80,15 T100,10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Charts & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm p-6 backdrop-blur-md">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Activity</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">Week</button>
                <button className="px-3 py-1 text-xs font-semibold rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Month</button>
              </div>
            </div>
            
            {/* Simulated Area Chart */}
            <div className="h-64 w-full relative">
              <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 pb-8">
                <div className="border-b border-gray-100 dark:border-gray-700 w-full h-0"></div>
                <div className="border-b border-gray-100 dark:border-gray-700 w-full h-0"></div>
                <div className="border-b border-gray-100 dark:border-gray-700 w-full h-0"></div>
                <div className="border-b border-gray-100 dark:border-gray-700 w-full h-0"></div>
                <div className="border-b border-gray-100 dark:border-gray-700 w-full h-0"></div>
              </div>
              <svg className="w-full h-full absolute inset-0 z-10 pt-2 pb-8" preserveAspectRatio="none" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#004ac6" stopOpacity="0.2"></stop>
                    <stop offset="100%" stopColor="#004ac6" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,30 Q10,10 20,20 T40,15 T60,25 T80,5 T100,10 L100,40 L0,40 Z" fill="url(#chartGradient)"></path>
                <path d="M0,30 Q10,10 20,20 T40,15 T60,25 T80,5 T100,10" fill="none" stroke="#004ac6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5"></path>
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm p-6 flex flex-col h-full backdrop-blur-md">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[16px]">edit_document</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100"><span className="font-semibold">Sarah Jenkins</span> updated article "Q3 Product Roadmap"</p>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100"><span className="font-semibold">New User</span> registered: michael.c@example.com</p>
                  <span className="text-xs text-gray-500">4 hours ago</span>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[16px]">image</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100"><span className="font-semibold">Admin</span> uploaded 5 new assets to "Hero Banners"</p>
                  <span className="text-xs text-gray-500">5 hours ago</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 text-center text-blue-600 dark:text-blue-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
