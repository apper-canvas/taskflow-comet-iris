import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday,
  parseISO,
  isValid
} from 'date-fns'
import ApperIcon from '../components/ApperIcon'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Sample tasks data - in real app this would come from a context or API
  const [tasks] = useState([
    {
      id: '1',
      title: 'Design new landing page',
      description: 'Create a modern and responsive landing page for the new product launch',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-15',
      projectId: 'proj-1',
      tags: ['design', 'frontend'],
      timeEntries: [
        { id: 'time1', hours: 3, date: format(new Date(), 'yyyy-MM-dd'), description: 'Initial design work' }
      ]
    },
    {
      id: '2',
      title: 'Review marketing campaign',
      description: 'Analyze the performance of Q4 marketing campaigns and prepare insights',
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-01-20',
      projectId: 'proj-2',
      tags: ['marketing', 'analysis'],
      timeEntries: []
    },
    {
      id: '3',
      title: 'Team standup meeting',
      description: 'Weekly team sync to discuss progress and blockers',
      priority: 'low',
      status: 'pending',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      projectId: 'proj-3',
      tags: ['meeting'],
      timeEntries: []
    },
    {
      id: '4',
      title: 'Code review session',
      description: 'Review pending pull requests and provide feedback',
      priority: 'high',
      status: 'completed',
      dueDate: format(addDays(new Date(), -2), 'yyyy-MM-dd'),
      projectId: 'proj-1',
      tags: ['development'],
      timeEntries: []
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

  const goToPreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      try {
        const taskDate = parseISO(task.dueDate)
        return isValid(taskDate) && isSameDay(taskDate, date)
      } catch {
        return false
      }
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'in-progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'pending': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const closeTaskModal = () => {
    setShowTaskModal(false)
    setSelectedTask(null)
  }

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : 'No Project'
  }

  const getTotalTimeForTask = (task) => {
    return (task.timeEntries || []).reduce((total, entry) => total + entry.hours, 0)
  }

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = []
    let day = startDate

    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }

    return days
  }, [currentDate])

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
                <ApperIcon name="Calendar" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Calendar
                </h1>
                <p className="text-xs sm:text-sm text-readable-secondary hidden sm:block">
                  Task Deadlines
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="px-4 py-2 text-surface-readable hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Tasks
              </Link>
              <Link
                to="/analytics"
                className="px-4 py-2 text-surface-readable hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Analytics
              </Link>
              
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors shadow-soft"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-surface-readable" 
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={goToPreviousMonth}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              >
                <ApperIcon name="ChevronLeft" className="w-5 h-5" />
              </motion.button>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-readable-primary">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              
              <motion.button
                onClick={goToNextMonth}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              >
                <ApperIcon name="ChevronRight" className="w-5 h-5" />
              </motion.button>
            </div>
            
            <motion.button
              onClick={goToToday}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 btn-text-primary rounded-xl font-medium transition-all duration-300"
            >
              Today
            </motion.button>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-2xl"
        >
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center py-2 text-sm font-medium text-surface-readable">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const dayTasks = getTasksForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isDayToday = isToday(day)
              
              return (
                <motion.div
                  key={day.toISOString()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`
                    relative min-h-[80px] sm:min-h-[100px] p-2 rounded-xl border transition-all duration-200
                    ${isCurrentMonth 
                      ? 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700' 
                      : 'bg-surface-50 dark:bg-surface-900 border-surface-100 dark:border-surface-800 opacity-50'
                    }
                    ${isDayToday ? 'ring-2 ring-primary-500 border-primary-300' : ''}
                    ${dayTasks.length > 0 ? 'hover:shadow-lg cursor-pointer' : ''}
                  `}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${isDayToday 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : isCurrentMonth 
                      ? 'text-readable-primary' 
                      : 'text-readable-muted'
                    }
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Task indicators */}
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <motion.div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          text-xs p-1 rounded cursor-pointer transition-all duration-200
                          ${getPriorityColor(task.priority)} text-white
                          hover:shadow-md
                        `}
                        title={task.title}
                      >
                        <div className="truncate font-medium">
                          {task.title}
                        </div>
                        {task.status === 'completed' && (
                          <div className="flex items-center mt-1">
                            <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
                            <span className="text-xs opacity-90">Done</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-readable-muted p-1">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-2xl mt-8"
        >
          <h3 className="text-lg font-semibold text-readable-primary mb-4">Priority Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-surface-readable">High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-readable-secondary">Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-readable-secondary">Low Priority</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {showTaskModal && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={closeTaskModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-readable-primary mb-2">
                    {selectedTask.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-lg border ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-lg ${
                      selectedTask.priority === 'high' ? 'text-red-600 bg-red-50 border border-red-200' :
                      selectedTask.priority === 'medium' ? 'text-yellow-600 bg-yellow-50 border border-yellow-200' :
                      'text-green-600 bg-green-50 border border-green-200'
                    }`}>
                      {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
                <motion.button
                  onClick={closeTaskModal}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-surface-muted hover:text-surface-readable hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Task Details */}
              <div className="space-y-6">
                {selectedTask.description && (
                  <div>
                    <h4 className="text-sm font-medium text-readable-primary mb-2">Description</h4>
                    <p className="text-surface-readable">
                      {selectedTask.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-readable-primary mb-2">Due Date</h4>
                    <div className="flex items-center gap-2 text-surface-readable">
                      <ApperIcon name="Calendar" className="w-4 h-4" />
                      <span>{format(parseISO(selectedTask.dueDate), 'MMMM dd, yyyy')}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-readable-primary mb-2">Project</h4>
                    <div className="flex items-center gap-2 text-surface-readable">
                      <ApperIcon name="Folder" className="w-4 h-4" />
                      <span>{getProjectName(selectedTask.projectId)}</span>
                    </div>
                  </div>
                </div>

                {selectedTask.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-readable-primary mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 rounded-md text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTask.timeEntries && selectedTask.timeEntries.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-readable-primary mb-3">
                      Time Entries ({getTotalTimeForTask(selectedTask)}h total)
                    </h4>
                    <div className="space-y-2">
                      {selectedTask.timeEntries.map((timeEntry) => (
                        <div
                          key={timeEntry.id}
                          className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-lg"
                        >
                          <div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-readable-primary">
                                {timeEntry.hours}h
                              </span>
                              <span className="text-surface-muted">•</span>
                              <span className="text-surface-readable">
                                {format(parseISO(timeEntry.date), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            {timeEntry.description && (
                              <div className="text-xs text-surface-500 mt-1">
                                {timeEntry.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-surface-200 dark:border-surface-700 mt-6">
                <Link
                  to="/"
                  className="flex-1 sm:flex-none bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 btn-text-primary px-6 py-3 rounded-xl font-medium transition-all duration-300 text-center"
                  onClick={closeTaskModal}
                >
                  Edit Task
                </Link>
                <motion.button
                  onClick={closeTaskModal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-none bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 btn-text-secondary px-6 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Calendar