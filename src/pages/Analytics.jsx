import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import ApperIcon from '../components/ApperIcon'

const Analytics = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [timeRange, setTimeRange] = useState('week')
  
  // Sample data - in real app this would come from state management
  const [tasks] = useState([
    {
      id: '1',
      title: 'Design new landing page',
      status: 'completed',
      priority: 'high',
      projectId: 'proj-1',
      completedAt: new Date().toISOString(),
      timeEntries: [
        { id: 't1', hours: 3, date: format(new Date(), 'yyyy-MM-dd'), description: 'Initial design mockups' },
        { id: 't2', hours: 2, date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), description: 'Refinements' }
      ]
    },
    {
      id: '2',
      title: 'Review marketing campaign',
      status: 'in-progress',
      priority: 'medium',
      projectId: 'proj-2',
      timeEntries: [
        { id: 't3', hours: 4, date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), description: 'Campaign analysis' }
      ]
    },
    {
      id: '3',
      title: 'Update documentation',
      status: 'pending',
      priority: 'low',
      projectId: 'proj-1',
      timeEntries: []
    },
    {
      id: '4',
      title: 'Bug fixes',
      status: 'completed',
      priority: 'high',
      projectId: 'proj-3',
      completedAt: subDays(new Date(), 3).toISOString(),
      timeEntries: [
        { id: 't4', hours: 6, date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), description: 'Critical bug fixes' }
      ]
    }
  ])

  const [projects] = useState([
    { id: 'proj-1', name: 'Website Redesign', color: '#6366f1' },
    { id: 'proj-2', name: 'Marketing Campaign', color: '#f59e0b' },
    { id: 'proj-3', name: 'Mobile App', color: '#10b981' }
  ])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const statusDistribution = [
      { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' },
      { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#f59e0b' },
      { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#6b7280' }
    ]

    const priorityDistribution = [
      { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
      { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
      { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' }
    ]

    const projectProgress = projects.map(project => {
      const projectTasks = tasks.filter(t => t.projectId === project.id)
      const completedTasks = projectTasks.filter(t => t.status === 'completed').length
      const totalTasks = projectTasks.length
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      
      return {
        name: project.name,
        completed: completedTasks,
        total: totalTasks,
        completionRate: Math.round(completionRate),
        color: project.color
      }
    })

    // Time tracking data
    const totalTimeSpent = tasks.reduce((total, task) => {
      return total + (task.timeEntries?.reduce((taskTotal, entry) => taskTotal + entry.hours, 0) || 0)
    }, 0)

    const avgTimePerTask = tasks.length > 0 ? totalTimeSpent / tasks.length : 0

    // Productivity trend (last 7 days)
    const weekStart = startOfWeek(new Date())
    const weekEnd = endOfWeek(new Date())
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
    
    const productivityTrend = weekDays.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayTasks = tasks.filter(task => 
        task.timeEntries?.some(entry => entry.date === dayStr)
      )
      const hoursWorked = dayTasks.reduce((total, task) => {
        return total + (task.timeEntries?.filter(entry => entry.date === dayStr)
          .reduce((taskTotal, entry) => taskTotal + entry.hours, 0) || 0)
      }, 0)
      
      return {
        day: format(day, 'EEE'),
        hours: hoursWorked,
        tasks: dayTasks.length
      }
    })

    return {
      statusDistribution,
      priorityDistribution,
      projectProgress,
      totalTimeSpent,
      avgTimePerTask,
      productivityTrend,
      completionRate: tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0
    }
  }, [tasks, projects])

  const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-2xl flex items-center justify-center`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-readable mb-1">
        {value}
      </div>
      <div className="text-sm text-readable-secondary mb-1">
        {title}
      </div>
      {subtitle && (
        <div className="text-xs text-surface-500">
          {subtitle}
        </div>
      )}
    </motion.div>
  )

  const ChartCard = ({ title, children, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-6 rounded-2xl ${className}`}
    >
      <h3 className="text-lg font-semibold text-readable mb-4">
        {title}
      </h3>
      {children}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 glass-card border-b border-surface-200/20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-soft">
                <ApperIcon name="CheckSquare" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xs sm:text-sm text-readable-secondary hidden sm:block">
                  Analytics Dashboard
                </p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              {/* Navigation */}
              <Link
                to="/"
                className="px-4 py-2 text-readable-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Tasks
              </Link>
              
              {/* Dark Mode Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors shadow-soft"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-readable" 
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-readable mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-readable-secondary">
            Track your productivity and project progress
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="Target"
            title="Completion Rate"
            value={`${Math.round(analyticsData.completionRate)}%`}
            subtitle="Overall task completion"
            color="green"
          />
          <StatCard
            icon="Clock"
            title="Total Time Logged"
            value={`${analyticsData.totalTimeSpent}h`}
            subtitle="Across all tasks"
            color="blue"
          />
          <StatCard
            icon="TrendingUp"
            title="Avg Time per Task"
            value={`${analyticsData.avgTimePerTask.toFixed(1)}h`}
            subtitle="Average time investment"
            color="purple"
          />
          <StatCard
            icon="CheckCircle"
            title="Tasks Completed"
            value={tasks.filter(t => t.status === 'completed').length}
            subtitle={`Out of ${tasks.length} total tasks`}
            color="green"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Task Status Distribution */}
          <ChartCard title="Task Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {analyticsData.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Priority Distribution */}
          <ChartCard title="Priority Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.priorityDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {analyticsData.priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Project Progress */}
        <ChartCard title="Project Progress" className="mb-8">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.projectProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'completionRate' ? `${value}%` : value,
                  name === 'completionRate' ? 'Completion Rate' : name
                ]}
              />
              <Bar dataKey="completionRate" fill="#6366f1" name="Completion Rate" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Productivity Trend */}
        <ChartCard title="Weekly Productivity Trend" className="mb-8">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.productivityTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                name="Hours Worked"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Summary */}
          <ChartCard title="Project Summary">
            <div className="space-y-4">
              {analyticsData.projectProgress.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <div>
                      <div className="font-medium text-readable">
                        {project.name}
                      </div>
                      <div className="text-sm text-readable-secondary">
                        {project.completed}/{project.total} tasks completed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-surface-900 dark:text-white">
                      {project.completionRate}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>

          {/* Time Tracking Summary */}
          <ChartCard title="Time Tracking Summary">
            <div className="space-y-4">
              {tasks
                .filter(task => task.timeEntries && task.timeEntries.length > 0)
                .map((task, index) => {
                  const totalTime = task.timeEntries.reduce((sum, entry) => sum + entry.hours, 0)
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-xl"
                    >
                      <div>
                        <div className="font-medium text-readable mb-1">
                          {task.title}
                        </div>
                        <div className="text-sm text-readable-secondary">
                          {task.timeEntries.length} time entries
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-surface-900 dark:text-white">
                          {totalTime}h
                        </div>
                        <div className="text-sm text-readable-secondary">
                          Total time
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

export default Analytics